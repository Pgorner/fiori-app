/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Button from "sap/m/Button";
import FlexBox, { $FlexBoxSettings } from "sap/m/FlexBox";
import GenericTile from "sap/m/GenericTile";
import IllustratedMessage from "sap/m/IllustratedMessage";
import VBox from "sap/m/VBox";
import Event from "sap/ui/base/Event";
import Component from "sap/ui/core/Component";
import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import { DropInfo$DropEventParameters } from "sap/ui/core/dnd/DropInfo";
import { dnd } from "sap/ui/core/library";
import BasePagePanel, { $BasePagePanelSettings } from "./BasePagePanel";
import MenuItem from "./MenuItem";
import NewsAndPagesContainer from "./NewsAndPagesContainer";
import Page from "./Page";
import { ISpacePagePersonalization } from "./interface/KeyUserInterface";
import { IPage } from "./interface/PageSpaceInterface";
import { SETTINGS_PANELS_KEYS } from "./utils/Constants";
import { DeviceType } from "./utils/Device";
import { attachKeyboardHandler } from "./utils/DragDropUtils";
import { addFESRId, addFESRSemanticStepName } from "./utils/FESRUtil";
import PageManager from "./utils/PageManager";
import PersonalisationUtils from "./utils/PersonalisationUtils";
import UShellPersonalizer from "./utils/UshellPersonalizer";

const maxTileSize = 15,
	minTileSize = 7;

/**
 *
 * CustomFlexBox extending FlexBox to enable drag & drop.
 *
 * @extends sap.m.FlexBox
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.122
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.CustomFlexBox
 */
class CustomFlexBox extends FlexBox {
	constructor(idOrSettings?: string | $FlexBoxSettings);
	constructor(id?: string, settings?: $FlexBoxSettings);
	constructor(id?: string, settings?: $FlexBoxSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		aggregations: {
			items: { type: "sap.ui.core.Control", multiple: true, singularName: "item", dnd: { draggable: true, droppable: true } }
		}
	};
	static renderer = {
		apiVersion: 2
	};
}

/**
 *
 * Panel class for managing and storing Pages.
 *
 * @extends sap.cux.home.BasePagePanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.122
 *
 * @internal
 * @experimental Since 1.121
 * @public
 *
 * @alias sap.cux.home.PagePanel
 */

export default class PagePanel extends BasePagePanel {
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Title for the page panel
			 */
			title: { type: "string", group: "Misc", visibility: "hidden" },
			/**
			 * Key for the page panel
			 */
			key: { type: "string", group: "Misc", visibility: "hidden" }
		},
		aggregations: {
			/**
			 * Aggregation of pages available within the page panel
			 */
			pages: { type: "sap.cux.home.Page", singularName: "page", multiple: true, visibility: "hidden" }
		}
	};
	private _oWrapperFlexBox!: CustomFlexBox;
	private oPagePromise!: Promise<IPage[]> | null;
	private persContainerId: string = PersonalisationUtils.getPersContainerId(this);
	private PageManagerInstance: PageManager = PageManager.getInstance(
		this.persContainerId,
		PersonalisationUtils.getOwnerComponent(this) as Component
	);
	private aFavPages!: IPage[];
	private oInnerControls!: GenericTile[];
	private _oIllusMsg!: IllustratedMessage;
	private oAddPageBtn!: Button;
	private oPersonalizer!: UShellPersonalizer;
	private oEventBus!: EventBus;

	/**
	 * Constructor for a new Page panel.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $BasePagePanelSettings) {
		super(id, settings);
	}

	init() {
		super.init();

		this._oWrapperFlexBox = new CustomFlexBox({
			justifyContent: "Start",
			height: "100%",
			width: "100%",
			direction: "Row",
			renderType: "Bare",
			wrap: "Wrap"
		}).addStyleClass("newsSlideFlexGap sapUiSmallMarginTop sapUiSmallMarginBottom");

		this._oWrapperFlexBox
			.addDragDropConfig(
				new DragDropInfo({
					sourceAggregation: "items",
					targetAggregation: "items",
					dropPosition: dnd.DropPosition.Between,
					dropLayout: dnd.DropLayout.Horizontal,
					drop: (oEvent) => void this._handlePageDnd(oEvent)
				})
			)
			.attachBrowserEvent("keydown", (event: KeyboardEvent) =>
				attachKeyboardHandler(event, true, (dragDropEvent: Event) => this._handlePageDnd(dragDropEvent))
			);

		this._addContent(this._oWrapperFlexBox);
		this.setProperty("title", this._i18nBundle.getText("pageTitle"));

		const menuItem = new MenuItem(`${this.getId()}-managePages`, {
			title: this._i18nBundle.getText("mngPage"),
			icon: "sap-icon://edit",
			press: () => this._handleEditPages()
		});
		this.addAggregation("menuItems", menuItem);
		addFESRId(menuItem, "managePages");
		this.oEventBus = EventBus.getInstance();
		// Subscribe to the event
		this.oEventBus.subscribe(
			"importChannel",
			"favPagesImport",
			(sChannelId?: string, sEventId?: string, oData?) => {
				this.aFavPages = oData as IPage[];
				this._getInnerControls();
				this._importdone();
			},
			this
		);

		// Subscribe to page changes from pageManager
		this.oEventBus.subscribe(
			"pageChannel",
			"pageUpdated",
			() => {
				void this.getData(true);
			},
			this
		);
	}

	private _importdone() {
		const stateData = { status: true };
		this.oEventBus.publish("importChannel", "favPagesImported", stateData);
	}

	public async getData(forceUpdate: boolean = false) {
		if (this.oPagePromise === undefined || this.oPagePromise === null || forceUpdate) {
			this.oPagePromise = this.PageManagerInstance.getFavoritePages();
			const aFavPages = await this.oPagePromise;
			this.aFavPages = aFavPages;
			this._getInnerControls();
			this.oPagePromise = null;
		}
		return this.oPagePromise;
	}

	/**
	 * Handles the edit page event.
	 * Opens the page dialog for managing page data.
	 * @param {Event} oEvent - The event object.
	 * @private
	 */
	private _handleEditPages() {
		const parent = this.getParent() as NewsAndPagesContainer;
		parent?._getLayout().openSettingsDialog(SETTINGS_PANELS_KEYS.PAGES);
	}

	public attachResizeHandler(
		bIsNewsTileVisible: boolean,
		containerWidth: number,
		pagesContentWrapper: FlexBox,
		containerWrapper: FlexBox
	) {
		try {
			const iFavPagesCount = this.aFavPages.length,
				domRef = pagesContentWrapper.getDomRef() as Element;

			let domRefClientWidth = 0;
			domRefClientWidth = bIsNewsTileVisible ? domRef.clientWidth : containerWidth;

			let pagesPerRow: number = 0,
				tileWidth,
				wrapperWidth = domRefClientWidth / 16; // Divide by 16 to convert to rem,
			const gap = 1,
				flexWrapperWidth = containerWidth || domRef.clientWidth;

			if (iFavPagesCount === 1) {
				containerWrapper.setAlignItems("Start");
			}

			if (bIsNewsTileVisible && flexWrapperWidth >= 1520) {
				// As newsTile will grow till 40.75 rem, calculating the remaining width
				wrapperWidth = flexWrapperWidth / 16 - 40.75;
			}

			if (iFavPagesCount > 0) {
				if (!bIsNewsTileVisible) {
					// If Space available display all tiles in a single row
					const spaceRequired = iFavPagesCount * minTileSize + (iFavPagesCount - 1) * gap;
					if (spaceRequired <= wrapperWidth) {
						pagesPerRow = iFavPagesCount;
						tileWidth = (wrapperWidth - (pagesPerRow - 1) * gap) / pagesPerRow;
						tileWidth = tileWidth <= maxTileSize ? tileWidth : maxTileSize;
						this._setPropertyValues({ hBoxWidth: wrapperWidth + "rem", pagesTileWidth: tileWidth + "rem" });
						pagesContentWrapper.setWidth(wrapperWidth + "rem");
						return true;
					}
				}

				pagesPerRow = this._handleResizeForDesktop(bIsNewsTileVisible, iFavPagesCount, pagesPerRow);
				tileWidth = (wrapperWidth - (pagesPerRow - 1) * gap) / pagesPerRow;
				tileWidth = tileWidth <= maxTileSize ? tileWidth : maxTileSize;

				const hBoxWidth = pagesPerRow === 0 ? "100%" : pagesPerRow * tileWidth + pagesPerRow * gap + "rem";
				this._setPropertyValues({ hBoxWidth: hBoxWidth, pagesTileWidth: tileWidth + "rem" });
				pagesContentWrapper.setWidth(wrapperWidth + "rem");
				return true;
			}
			pagesContentWrapper.setWidth(wrapperWidth + "rem");
			return true;
		} catch (oErr) {
			if (oErr instanceof Error) {
				console.error(oErr.message);
			}
			return false;
		}
	}

	public async getUserAvailablePages() {
		return await this.PageManagerInstance.fetchAllAvailablePages();
	}

	private _handleResizeForDesktop(bIsNewsTileVisible: boolean, iFavPagesCount: number, pagesPerRow: number): number {
		const sDeviceType = this.getDeviceType();
		const pagesToDisplay = Math.ceil(iFavPagesCount >= 8 ? 4 : iFavPagesCount / 2);
		if (sDeviceType === DeviceType.Desktop || sDeviceType === DeviceType.LargeDesktop) {
			if (bIsNewsTileVisible) {
				pagesPerRow = pagesToDisplay;
			} else {
				pagesPerRow = iFavPagesCount <= 4 ? iFavPagesCount : pagesToDisplay;
			}
		} else if (sDeviceType === DeviceType.Tablet) {
			pagesPerRow = iFavPagesCount <= 4 ? iFavPagesCount : pagesToDisplay;
		}
		return pagesPerRow;
	}

	private _getInnerControls() {
		const myFavPage: Page[] = [];
		this.oInnerControls = [];
		const oParent = this.getParent() as NewsAndPagesContainer;
		if (this.aFavPages) {
			this.aFavPages.forEach((oPage: IPage) => {
				myFavPage.push(
					new Page("", {
						title: oPage.title,
						subTitle: oPage.title === oPage.spaceTitle ? "" : oPage.spaceTitle,
						icon: oPage.icon,
						bgColor: oPage.BGColor as string,
						pageId: oPage.pageId,
						spaceId: oPage.spaceId,
						spaceTitle: oPage.spaceTitle,
						url: "#Launchpad-openFLPPage?pageId=" + oPage.pageId + "&spaceId=" + oPage.spaceId
					})
				);
			});
			myFavPage.forEach((oFav: Page) => {
				this.oInnerControls.push(
					new GenericTile({
						// width: "10rem",
						header: oFav.getTitle(),
						subheader: oFav.getSubTitle(),
						press: () => void oFav.onPageTilePress(oFav),
						sizeBehavior: "Responsive",
						state: "Loaded",
						frameType: "OneByOne",
						mode: "IconMode",
						backgroundColor: oFav.getBgColor(),
						tileIcon: oFav.getIcon(),
						visible: true,
						renderOnThemeChange: true,
						ariaRole: "listitem",
						dropAreaOffset: 8,
						url: oFav.getProperty("url") as string
					})
				);
				this.addAggregation("pages", oFav, true);
			});

			this._oWrapperFlexBox.setAlignItems(this.aFavPages.length == 1 ? "Start" : "Center");

			if (this.aFavPages.length) {
				oParent?.panelLoadedFn("Page", { loaded: true, count: this.aFavPages.length });
				this._setFavPagesContent();
			} else {
				oParent?.panelLoadedFn("Page", { loaded: true, count: 0 });
				this._setNoPageContent();
			}
		} else {
			oParent?.panelLoadedFn("Page", { loaded: false, count: 0 });
			this.removeAggregation("content", this._oWrapperFlexBox);
		}
	}

	private _setFavPagesContent() {
		this._oWrapperFlexBox.removeAllItems();
		this.oInnerControls.forEach((oTile: GenericTile) => {
			this._oWrapperFlexBox.addItem(oTile);
		});
	}

	private _createNoPageContent() {
		if (!this._oIllusMsg) {
			this._oIllusMsg = new IllustratedMessage(this.getId() + "--idNoPages", {
				illustrationSize: "Spot",
				illustrationType: "sapIllus-SimpleNoSavedItems",
				title: this._i18nBundle.getText("noDataPageTitle"),
				description: this._i18nBundle.getText("noPageDescription")
			}).addStyleClass("myHomeIllustratedMsg myHomeIllustratedMessageAlign");
			this.oAddPageBtn = new Button(this.getId() + "--idAddPageBtn", {
				text: this._i18nBundle.getText("addPage"),
				tooltip: this._i18nBundle.getText("addPage"),
				type: "Emphasized",
				press: () => this._handleEditPages()
			});
			addFESRSemanticStepName(this.oAddPageBtn, "press", "addPages");
		}
	}

	private _setNoPageContent() {
		const oWrapperNoPageVBox = new VBox({
			width: "100%",
			height: "17rem",
			backgroundDesign: "Solid",
			justifyContent: "Center"
		}).addStyleClass("sapUiRoundedBorder noCardsBorder");
		this._createNoPageContent();
		this._oIllusMsg.addAdditionalContent(this.oAddPageBtn);
		this._oWrapperFlexBox.removeAllItems();
		this._oWrapperFlexBox.addStyleClass("pagesFlexBox");
		oWrapperNoPageVBox.addItem(this._oIllusMsg);
		this._oWrapperFlexBox.addItem(oWrapperNoPageVBox);
	}

	private _setPropertyValues(oVal: { hBoxWidth: string; pagesTileWidth: string }) {
		const propNames = Object.keys(oVal);
		propNames.forEach((sProperty: string) => {
			if (sProperty === "hBoxWidth") {
				this._oWrapperFlexBox.setProperty("width", oVal[sProperty]);
			} else if (sProperty === "pagesTileWidth" && this.oInnerControls.length) {
				this.oInnerControls.forEach(function (oTile) {
					oTile.setProperty("width", oVal[sProperty]);
				});
			}
		});
	}

	private async _handlePageDnd(oEvent: Event<DropInfo$DropEventParameters>) {
		const sInsertPosition = oEvent.getParameter?.("dropPosition"),
			oDragItem = oEvent?.getParameter?.("draggedControl") as Control,
			oDropItem = oEvent.getParameter("droppedControl") as Control,
			iDragItemIndex = (oDragItem.getParent() as FlexBox)?.indexOfItem(oDragItem);
		let iDropItemIndex = (oDragItem.getParent() as FlexBox)?.indexOfItem(oDropItem);

		if (sInsertPosition === "Before" && iDragItemIndex === iDropItemIndex - 1) {
			iDropItemIndex--;
		} else if (sInsertPosition === "After" && iDragItemIndex === iDropItemIndex + 1) {
			iDropItemIndex++;
		}

		if (iDragItemIndex !== iDropItemIndex) {
			await this._DragnDropPages(iDragItemIndex, iDropItemIndex, sInsertPosition as string);
		}
	}

	private async _DragnDropPages(iDragItemIndex: number, iDropItemIndex: number, sInsertPosition: string) {
		if (sInsertPosition === "Before" && iDragItemIndex < iDropItemIndex) {
			iDropItemIndex--;
		} else if (sInsertPosition === "After" && iDragItemIndex > iDropItemIndex) {
			iDropItemIndex++;
		}
		// take the moved item from dragIndex and add to dropindex
		const oItemMoved = this.aFavPages.splice(iDragItemIndex, 1)[0];
		this.aFavPages.splice(iDropItemIndex, 0, oItemMoved);
		this._getInnerControls();

		if (this.oPersonalizer === undefined) {
			this.oPersonalizer = await UShellPersonalizer.getInstance(
				this.persContainerId,
				PersonalisationUtils.getOwnerComponent(this) as Component
			);
		}

		let oPersData = await this.oPersonalizer.read();
		if (!oPersData) oPersData = { favouritePages: [] };
		oPersData.favouritePages = this.aFavPages;
		await this.oPersonalizer.write(oPersData);
	}

	public applyColorPersonalizations(personalizations: Array<ISpacePagePersonalization>) {
		void this.PageManagerInstance?.applyColorPersonalizations(personalizations);
	}

	public applyIconPersonalizations(personalizations: Array<ISpacePagePersonalization>) {
		void this.PageManagerInstance?.applyIconPersonalizations(personalizations);
	}
}
