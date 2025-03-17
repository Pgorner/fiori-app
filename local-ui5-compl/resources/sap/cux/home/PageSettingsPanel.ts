/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import CustomListItem from "sap/m/CustomListItem";
import HBox from "sap/m/HBox";
import List from "sap/m/List";
import Page from "sap/m/Page";
import Panel from "sap/m/Panel";
import SearchField from "sap/m/SearchField";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import ToggleButton from "sap/m/ToggleButton";
import Toolbar from "sap/m/Toolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import Event from "sap/ui/base/Event";
import Component from "sap/ui/core/Component";
import BaseSettingsPanel from "./BaseSettingsPanel";
import PagePanel from "./PagePanel";
import { IPage, ISpace } from "./interface/PageSpaceInterface";
import { PAGE_SELECTION_LIMIT, SETTINGS_PANELS_KEYS } from "./utils/Constants";
import PageManager from "./utils/PageManager";
import PersonalisationUtils from "./utils/PersonalisationUtils";

/**
 *
 * Class for My Home Page Settings Panel.
 *
 * @extends BaseSettingsPanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.PageSettingsPanel
 */
export default class PageSettingsPanel extends BaseSettingsPanel {
	private PageManagerInstance!: PageManager;
	private aAllPages!: IPage[];
	private aFavPages!: IPage[];
	private aSpaces!: ISpace[];
	private oWrapperVBox!: VBox;
	private oSearchField!: SearchField;
	private sSearchQuery!: string;
	private oMessage!: Text;
	private oPagesListVBox!: VBox;
	private oNoDataHBox!: HBox;
	private _initialNavigation: boolean = true;
	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init() {
		super.init();

		//setup panel
		this.setProperty("key", SETTINGS_PANELS_KEYS.PAGES);
		this.setProperty("title", this._i18nBundle.getText("pages"));
		this.setProperty("icon", "sap-icon://course-book");
		this.oWrapperVBox = new VBox(`${this.getId()}--pageSettingsWrapper`, {
			width: "100%"
		}).addStyleClass("sapUiNoPadding sapUiNoMarginEnd");
		this.addAggregation("content", this.oWrapperVBox);

		//fired every time on panel navigation
		this.attachPanelNavigated(() => {
			void this.onPanelNavigated();
		});
	}

	/**
	 * Handler for panel navigation event.
	 * Initialize the Page Settings Panel on navigation, if it is not already initializaed.
	 * @private
	 */
	private async onPanelNavigated() {
		if (this._initialNavigation) {
			this._initialNavigation = false;
			await this._initializePanel();
		}
		// Clear Search field and search results
		if (this.oSearchField?.getValue()) {
			this.oSearchField.setValue("");
			this.sSearchQuery = "";
			this._renderPages(this.aSpaces);
		}
	}

	/**
	 * Initialize the Page Settings Panel.
	 * @private
	 */
	private async _initializePanel() {
		if (!this.PageManagerInstance) {
			// initializing the page manager instance on panel navigation, as when on init is triggered, the panel assocation is not yet set
			// we are using this._getPanel() (i.e. corresponding panel) instead of this, as settings panel don't have an ownerId
			this.PageManagerInstance = PageManager.getInstance(
				PersonalisationUtils.getPersContainerId(this._getPanel()),
				PersonalisationUtils.getOwnerComponent(this._getPanel()) as Component
			);
		}
		this.aAllPages = await this.PageManagerInstance.fetchAllAvailablePages();
		this.aFavPages = await this.PageManagerInstance.getFavoritePages();
		this.aSpaces = await this.PageManagerInstance.fetchAllAvailableSpaces();
		this._showMessageStrip();
		this._showToolbar();
		this._showPagesList();
	}

	private _showMessageStrip() {
		const oMessageStripVBox = new VBox(`${this.getId()}--msgStripContainer`, {
			width: "100%"
		}).addStyleClass("sapUiNoPadding sapUiNoMarginEnd");
		this.oMessage = new Text(`${this.getId()}--msgStripText`).addStyleClass("sapUiSmallMargin");
		this._seHeaderMessage();
		oMessageStripVBox.addItem(this.oMessage);
		this.oWrapperVBox.addItem(oMessageStripVBox);
	}

	private _seHeaderMessage() {
		this.oMessage.setText(
			this.aFavPages.length >= PAGE_SELECTION_LIMIT
				? this._i18nBundle.getText("myInterestwarning")
				: this._i18nBundle.getText("myInterestinfo")
		);
	}

	private _showToolbar() {
		const oTitle = new Title(`${this.getId()}--pagesListTitle`, {
			text: this._i18nBundle.getText("pageGroupHeader"),
			titleStyle: "H5"
		}).addStyleClass("sapUiSmallMarginBottom");

		this.oSearchField = new SearchField(`${this.getId()}--pagesListSearch`, {
			liveChange: (oEvent) => this._onPagesSearch(oEvent),
			width: "13.75rem"
		}).addStyleClass("sapUiSmallMarginBottom");

		const oToolbar = new Toolbar(`${this.getId()}--pagesListToolbar`, {
			width: "calc(100% - 2rem)",
			height: "3rem",
			design: "Solid",
			content: [oTitle, new ToolbarSpacer(`${this.getId()}--pagesHeaderToolbarSpacer`), this.oSearchField]
		}).addStyleClass("sapUiSmallMarginBegin pagesToolbarNoPadding");
		this.oWrapperVBox.addItem(oToolbar);
	}

	private _showPagesList() {
		this.oPagesListVBox = new VBox(`${this.getId()}--pagesListVBox`, {
			width: "calc(100% - 2rem)"
		}).addStyleClass("sapUiSmallMarginBegin");
		this._renderPages(this.aSpaces);
		this.oWrapperVBox.addItem(this.oPagesListVBox);
	}

	private _createPagesList(oPage: IPage): CustomListItem {
		const oText = new Text({
			text: oPage.label
		});
		const oToggleBtn = new ToggleButton({
			tooltip: oPage.selected ? this._i18nBundle.getText("hideBtn") : this._i18nBundle.getText("showBtn"),
			icon: "sap-icon://show",
			type: "Emphasized",
			pressed: !oPage.selected,
			enabled: oPage.selected || this.aFavPages.length < PAGE_SELECTION_LIMIT,
			press: (oEvent) => void this._pageSelectHandler(oPage.id as string, oEvent)
		});
		const oHBox = new HBox({
			justifyContent: "SpaceBetween",
			alignItems: "Center",
			items: [oText, oToggleBtn]
		});
		const oCustomListItem = new CustomListItem({
			content: [oHBox]
		}).addStyleClass("pagesPanelItem");
		return oCustomListItem;
	}

	private _renderPages(aSpaces: ISpace[]) {
		const pageSettingsPage = this.oPagesListVBox.getParent()?.getParent() as Page;
		const scrollContainerDomRef = pageSettingsPage?.getDomRef()?.childNodes[1] as Element;
		const currentScrollPosition = scrollContainerDomRef?.scrollTop || 0;
		this.oPagesListVBox.removeAllItems();
		if (!aSpaces.length) {
			if (!this.oNoDataHBox) {
				this.oNoDataHBox = new HBox(`${this.getId()}--noSpacePageHBox`, {
					height: "3rem",
					justifyContent: "Center",
					alignItems: "Center",
					items: [
						new Text({
							text: this._i18nBundle.getText("noData")
						})
					]
				}).addStyleClass("pagesBottomBorder");
				this.oWrapperVBox.addItem(this.oNoDataHBox);
			}
			this.oNoDataHBox.setVisible(true);
		} else if (this.oNoDataHBox) {
			this.oNoDataHBox.setVisible(false);
		}

		aSpaces.forEach((oSpace) => {
			const aPagesList: CustomListItem[] = [];
			oSpace.children.forEach((oPage) => {
				oPage.selected = this.aFavPages.find((oFavPage) => oFavPage.pageId === oPage.id) ? true : false;
				aPagesList.push(this._createPagesList(oPage));
			});
			const oHeaderToolbar = this._createHeaderToolbar(oSpace);
			const oPanel = new Panel("", {
				expandable: true,
				expanded: true,
				width: "auto",
				headerToolbar: oHeaderToolbar,
				content: new List({
					items: aPagesList
				})
			}).addStyleClass("pagesPanel");
			this.oPagesListVBox.addItem(oPanel);
		});
		if (currentScrollPosition >= 0 && pageSettingsPage) {
			setTimeout(() => {
				pageSettingsPage.scrollTo(currentScrollPosition);
			}, 0);
		}
	}

	private _createHeaderToolbar(oSpace: ISpace) {
		const oTitle = new Title({
			wrapping: true,
			width: "16rem",
			text: oSpace.label
		}).addStyleClass("dialogPanelTitle");
		const oToolbar = new Toolbar({
			design: "Solid",
			content: [oTitle]
		});
		return oToolbar;
	}

	private async _pageSelectHandler(sPageId: string, oEvent: { getSource: () => { getPressed: () => boolean } }) {
		const bIsCheckBoxSelected = !oEvent.getSource().getPressed();
		const oPageObj = this.aAllPages.find((oPage) => oPage.pageId === sPageId);
		if (!oPageObj) {
			return false;
		}

		if (bIsCheckBoxSelected) {
			this.aFavPages.push(oPageObj);
		} else {
			const iIndex = this.aFavPages.findIndex((oPage) => oPage.pageId === sPageId);
			this.aFavPages.splice(iIndex, 1);
		}
		this._seHeaderMessage();
		await this.PageManagerInstance.getFavPages(this.aFavPages, true);
		let aFilteredSpaces;
		if (this.sSearchQuery?.length) {
			aFilteredSpaces = this._filterSpacesPages();
		}
		this._renderPages(aFilteredSpaces || this.aSpaces);
		void (this._getPanel() as PagePanel).getData();
	}

	private _onPagesSearch(oEvent: Event) {
		this.sSearchQuery = oEvent.getSource<SearchField>().getValue().toLowerCase();
		const aFilteredSpaces = this._filterSpacesPages();
		this._renderPages(aFilteredSpaces);
	}

	private _filterSpacesPages() {
		const aFilteredSpaces: ISpace[] = [];
		this.aSpaces.forEach((oSpace) => {
			const children: IPage[] = [];
			const spaceLabel = oSpace.label;
			oSpace.children.forEach((oPage) => {
				if (oPage.label?.toLowerCase().includes(this.sSearchQuery) || spaceLabel?.toLowerCase().includes(this.sSearchQuery)) {
					children.push(oPage);
				}
			});
			if (children.length) {
				aFilteredSpaces.push({
					...oSpace,
					children
				});
			}
		});
		return aFilteredSpaces;
	}
}
