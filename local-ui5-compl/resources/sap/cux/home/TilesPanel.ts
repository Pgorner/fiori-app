/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import GridContainer from "sap/f/GridContainer";
import GridContainerItemLayoutData from "sap/f/GridContainerItemLayoutData";
import Button from "sap/m/Button";
import CustomListItem from "sap/m/CustomListItem";
import Dialog from "sap/m/Dialog";
import FlexBox from "sap/m/FlexBox";
import HBox from "sap/m/HBox";
import HeaderContainer from "sap/m/HeaderContainer";
import IllustratedMessage from "sap/m/IllustratedMessage";
import Label from "sap/m/Label";
import List from "sap/m/List";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import Title from "sap/m/Title";
import { ButtonType } from "sap/m/library";
import Event from "sap/ui/base/Event";
import ManagedObject from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import Icon from "sap/ui/core/Icon";
import Lib from "sap/ui/core/Lib";
import DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import { DropInfo$DropEventParameters } from "sap/ui/core/dnd/DropInfo";
import { dnd } from "sap/ui/core/library";
import Context from "sap/ui/model/Context";
import JSONModel from "sap/ui/model/json/JSONModel";
import Config from "sap/ushell/Config";
import Container from "sap/ushell/Container";
import S4MyHome from "sap/ushell/api/S4MyHome";
import Navigation from "sap/ushell/services/Navigation";
import VisualizationInstantiation from "sap/ushell/services/VisualizationInstantiation";
import BasePanel from "./BasePanel";
import InsightsContainer from "./InsightsContainer";
import MenuItem from "./MenuItem";
import { $TilesPanelSettings } from "./TilesPanel";
import { ICustomVisualization, ISectionAndVisualization, IVisualization } from "./interface/AppsInterface";
import AppManager from "./utils/AppManager";
import { DEFAULT_BG_COLOR, END_USER_COLORS, MYHOME_PAGE_ID, MYINSIGHT_SECTION_ID, SETTINGS_PANELS_KEYS } from "./utils/Constants";
import { DeviceType, fetchElementProperties } from "./utils/Device";
import { attachKeyboardHandler } from "./utils/DragDropUtils";
import { addFESRId, addFESRSemanticStepName, FESR_EVENTS } from "./utils/FESRUtil";

export enum tilesMenuItems {
	REFRESH = "tiles-refresh",
	ADD_APPS = "tiles-addSmartApps",
	EDIT_TILES = "tiles-editTiles"
}

export enum DisplayFormat {
	Standard = "standard",
	StandardWide = "standardWide"
}

const _showAddApps = () => {
	return (Config.last("/core/shell/enablePersonalization") || Config.last("/core/catalog/enabled")) as boolean;
};

/**
 *
 * Tiles Panel class for managing and storing Insights Tiles.
 *
 * @extends sap.cux.home.BasePanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.122.0
 *
 * @internal
 * @experimental Since 1.122
 * @public
 *
 * @alias sap.cux.home.TilesPanel
 */

export default class TilesPanel extends BasePanel {
	constructor(idOrSettings?: string | $TilesPanelSettings);
	constructor(id?: string, settings?: $TilesPanelSettings);
	/**
	 * Constructor for a new Tiles Panel.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $TilesPanelSettings) {
		super(id, settings);
	}
	private _oData!: Record<string, unknown>;
	private _insightsSectionTitle: string = this._i18nBundle.getText("insights") as string;
	private _addFromFavDialogId: string = `${this.getId()}-addFromFavDialog`;
	private appManagerInstance!: AppManager;
	private VizInstantiationService!: VisualizationInstantiation;
	private tilesContainer!: GridContainer | HeaderContainer;
	private aInsightsApps!: ICustomVisualization[];
	private _controlModel!: JSONModel;
	public _controlMap!: Map<string, Control | Element>;
	public menuItems!: MenuItem[];
	public actionButtons!: Button[];
	private oEventBus!: EventBus;
	private insightsContainer!: InsightsContainer;
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Title for the tiles panel
			 */
			title: { type: "string", group: "Misc", defaultValue: "", visibility: "hidden" },
			/**
			 * Key for the tiles panel
			 */
			key: { type: "string", group: "Misc", defaultValue: "", visibility: "hidden" },
			/**
			 * The name of the URL parameter used to expand the container into full-screen mode.
			 */
			fullScreenName: { type: "string", group: "Misc", defaultValue: "SI1", visibility: "hidden" }
		},
		defaultAggregation: "tiles",
		aggregations: {
			/**
			 * Aggregation of tiles available within the tiles Panel
			 */
			tiles: { type: "sap.cux.home.App", multiple: true, singularName: "tile", visibility: "hidden" }
		},
		events: {
			handleHidePanel: {
				parameters: {}
			},
			handleUnhidePanel: {
				parameters: {}
			}
		}
	};

	async init() {
		super.init();
		this._controlMap = new Map();
		//Initialise Tiles Model
		this._oData = {
			tiles: [] as ICustomVisualization[],
			activateInsightsTiles: true
		};
		this._controlModel = new JSONModel(this._oData);
		this.appManagerInstance = AppManager.getInstance();
		this.setProperty("title", `${this._i18nBundle?.getText("insights")} ${this._i18nBundle.getText("insightsTilesTitle")}`);
		const refreshMenuItem = new MenuItem(tilesMenuItems.REFRESH, {
			title: this._i18nBundle.getText("refresh"),
			icon: "sap-icon://refresh",
			press: () => void this.refreshData(true)
		});
		addFESRId(refreshMenuItem, "tilesRefresh");
		const addfromFavAppMenuItem = new MenuItem(tilesMenuItems.ADD_APPS, {
			title: this._i18nBundle.getText("addSmartApps"),
			icon: "sap-icon://duplicate",
			press: () => void this._handleAddFromFavApps()
		});
		addFESRId(addfromFavAppMenuItem, "smartAppsDialog");
		const editTilesMenuItem = new MenuItem(tilesMenuItems.EDIT_TILES, {
			title: this._i18nBundle.getText("editLinkTiles"),
			icon: "sap-icon://edit",
			press: (event: Event) => this.handleEditTiles(event)
		});
		addFESRId(editTilesMenuItem, "manageTiles");

		this.menuItems = [refreshMenuItem, addfromFavAppMenuItem, editTilesMenuItem];

		const addTilesButton = new Button({
			id: `${this.getId()}-addTilesButton`,
			text: this._i18nBundle.getText("appFinderLink"),
			press: () => void this._handleAddFromFavApps()
		});
		addFESRId(addTilesButton, "smartAppsDialog");

		this.actionButtons = [addTilesButton];

		// Setup Header Content
		this._setupHeader();
		this.VizInstantiationService = await Container.getServiceAsync<VisualizationInstantiation>("VisualizationInstantiation");

		this.oEventBus = EventBus.getInstance();
		// Subscribe to the event
		this.oEventBus.subscribe(
			"importChannel",
			"tilesImport",
			async (sChannelId?: string, sEventId?: string, oData?) => {
				await this.appManagerInstance.createInsightSection(this._i18nBundle.getText("insightsTiles") as string);
				await this._addSectionViz(oData as IVisualization[], MYINSIGHT_SECTION_ID);

				this._adjustLayout();
				this._importdone();
			},
			this
		);

		// Toggles the activity of tiles
		this._toggleTileActivity();
	}

	/**
	 * Toggles the activity of tiles on route change.
	 *
	 * @private
	 * @returns {void}
	 */
	private _toggleTileActivity(): void {
		const toggleUserActions = async (event: Event<{ isMyHomeRoute: boolean }>) => {
			const show = event.getParameter("isMyHomeRoute");
			this._controlModel.setProperty("/activateInsightsTiles", show);
			if (show) {
				await this.refreshData(true);
			}
		};

		S4MyHome.attachRouteMatched({}, toggleUserActions, this);
	}

	/**
	 * Takes the visualizations and add it to the provided section id
	 * @param {IVisualization[]} aSectionViz - array of visualizations
	 * @param {string} sSectionId - section id where the visualizations to be added
	 * @returns {any}
	 */
	private _addSectionViz(aSectionViz: IVisualization[], sSectionId: string) {
		return aSectionViz.reduce((promiseChain, oViz) => {
			return promiseChain.then(() => {
				if (oViz.isBookmark) {
					return this.appManagerInstance.addBookMark(oViz);
				} else {
					return sSectionId
						? this.appManagerInstance.addVisualization(oViz.vizId, sSectionId)
						: this.appManagerInstance.addVisualization(oViz.vizId);
				}
			});
		}, Promise.resolve());
	}

	private _importdone() {
		const stateData = { status: true };
		this.oEventBus.publish("importChannel", "tilesImported", stateData);
	}

	private _setupHeader() {
		this.menuItems.forEach((menuItem) => this.addAggregation("menuItems", menuItem));
		this.actionButtons.forEach((actionButton) => this.addAggregation("actionButtons", actionButton));
		this.setProperty("enableFullScreen", true);
	}

	public async renderPanel(bRefresh: boolean = false): Promise<void> {
		try {
			if (!this.tilesContainer || bRefresh) {
				this._createWrapperFlexBox();
				return await this.refreshData();
			}
		} catch (error) {
			console.error(error);
			this.fireHandleHidePanel();
		}
		return Promise.resolve();
	}

	public async refreshData(refreshTiles: boolean = false) {
		this.aInsightsApps = await this.appManagerInstance.fetchInsightApps(true, this._insightsSectionTitle);
		const bIsSmartBusinessTilePresent = this.aInsightsApps.some((oApp) => oApp.isSmartBusinessTile);
		if (bIsSmartBusinessTilePresent) {
			await Lib.load({ name: "sap.cloudfnd.smartbusiness.lib.reusetiles" });
		}
		this._controlModel.setProperty("/tiles", this.aInsightsApps);
		if (this.aInsightsApps?.length) {
			this.fireHandleUnhidePanel();
			if (refreshTiles && this.tilesContainer) {
				const sDefaultAggreName = this.tilesContainer.getMetadata().getDefaultAggregationName();
				const dynamicTiles = (this.tilesContainer.getAggregation(sDefaultAggreName) as ManagedObject[]) || [];
				dynamicTiles.forEach((tiles) => (tiles as ICustomVisualization).refresh?.());
			}
			this.fireHandleUnhidePanel();
			this._getInsightsContainer().updatePanelsItemCount(this.aInsightsApps.length, this.getMetadata().getName());
			if (this.getProperty("title")) {
				this.setProperty(
					"title",
					`${this._i18nBundle?.getText("insights")} ${this._i18nBundle.getText("insightsTilesTitle")} (${this.aInsightsApps.length})`
				);
			}
		} else {
			this.fireHandleHidePanel();
		}

		//adjust layout
		this._adjustLayout();
	}

	private _createWrapperFlexBox() {
		if (!this.tilesContainer) {
			if (this.getDeviceType() === DeviceType.Mobile) {
				this.tilesContainer = new HeaderContainer(`${this.getId()}-insightsTilesMobileContainer`, {
					scrollStep: 0,
					scrollStepByItem: 1,
					gridLayout: true,
					scrollTime: 1000,
					showDividers: false
				}).addStyleClass("sectionMarginTopTilesInsight sapMHeaderContainerAlign sapMHeaderContainerMarginBottom tilesBoxShadow");
			} else {
				this.tilesContainer = new GridContainer(`${this.getId()}-insightsTilesContainer`, {}).addStyleClass(
					"insightTiles sapUiSmallMarginTop sapUiSmallMarginBottom"
				);
			}
			this.tilesContainer.setModel(this._controlModel);
			const sDefaultAggreName = this.tilesContainer.getMetadata().getDefaultAggregationName();
			this.tilesContainer.bindAggregation(sDefaultAggreName, {
				path: "/tiles",
				factory: (id: string, context: Context): ManagedObject => {
					const oApp = context.getObject() as ICustomVisualization,
						oVisualization = this.VizInstantiationService.instantiateVisualization(oApp.visualization) as ICustomVisualization;
					oVisualization.setLayoutData?.(
						new GridContainerItemLayoutData({
							minRows: 2,
							columns: oVisualization.getDisplayFormat?.() === DisplayFormat.Standard ? 2 : 4
						})
					);
					oVisualization?.bindProperty?.("active", "/activateInsightsTiles");
					return oVisualization as ManagedObject;
				}
			});
			this.tilesContainer
				.addDragDropConfig(
					new DragDropInfo({
						sourceAggregation: "items",
						targetAggregation: "items",
						dropPosition: dnd.DropPosition.Between,
						dropLayout: dnd.DropLayout.Horizontal,
						drop: (oEvent) => this._handleTilesDnd(oEvent)
					})
				)
				.attachBrowserEvent("keydown", (event: KeyboardEvent) => {
					const disablenavigation = event.metaKey || event.ctrlKey;
					void attachKeyboardHandler(event, disablenavigation, (dragDropEvent: Event) => this._handleTilesDnd(dragDropEvent));
				});
		}
		this._addContent(this.tilesContainer);
	}

	private _handleTilesDnd(oEvent: Event<DropInfo$DropEventParameters>) {
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
			void this._DragnDropTiles(iDragItemIndex, iDropItemIndex, sInsertPosition as string);
		}
	}

	private async _DragnDropTiles(iDragItemIndex: number, iDropItemIndex: number, sInsertPosition: string) {
		if (sInsertPosition === "Before" && iDragItemIndex < iDropItemIndex) {
			iDropItemIndex--;
		} else if (sInsertPosition === "After" && iDragItemIndex > iDropItemIndex) {
			iDropItemIndex++;
		}
		const oDisplacedItem = this.aInsightsApps[iDropItemIndex],
			oItemMoved = this.aInsightsApps.splice(iDragItemIndex, 1)[0];
		this.aInsightsApps.splice(iDropItemIndex, 0, oItemMoved);
		const moveConfigs = {
			pageId: MYHOME_PAGE_ID,
			sourceSectionIndex: oItemMoved.persConfig?.sectionIndex as number,
			sourceVisualizationIndex: oItemMoved.persConfig?.visualizationIndex as number,
			targetSectionIndex: oDisplacedItem.persConfig?.sectionIndex as number,
			targetVisualizationIndex: oDisplacedItem.persConfig?.visualizationIndex as number
		};
		this._controlModel.setProperty("/tiles", this.aInsightsApps);
		await this.appManagerInstance.moveVisualization(moveConfigs);
		await this.renderPanel(true);
	}

	private handleEditTiles(event: Event) {
		/* If called from Panel Header event.source() will return TilesPanel, if called from Insights Container event.source() will return InsightsContainer.
		_getLayout is available at Container Level*/
		let parent: ManagedObject = event.getSource<TilesPanel>().getParent() || this;
		if (parent?.isA("sap.cux.home.TilesPanel")) {
			parent = parent.getParent() as ManagedObject;
		}
		(parent as InsightsContainer)?._getLayout().openSettingsDialog(SETTINGS_PANELS_KEYS.INSIGHTS_TILES);
	}

	public handleRemoveActions() {
		this.setProperty("title", "");
		this.setProperty("enableSettings", false);
		this.setProperty("enableFullScreen", false);
		this.removeAllAggregation("actionButtons");
		this.removeAllAggregation("menuItems");
	}

	public handleAddActions() {
		this.setProperty(
			"title",
			`${this._i18nBundle?.getText("insights")} ${this._i18nBundle.getText("insightsTilesTitle")} (${this.aInsightsApps.length})`
		);
		this.setProperty("enableSettings", true);
		this.setProperty("enableFullScreen", true);
		this._setupHeader();
	}

	private _closeAddFromFavDialog() {
		(this._controlMap.get(this._addFromFavDialogId) as Dialog)?.close();
	}

	/**
	 * Navigates to the App Finder with optional group Id.
	 * @async
	 * @private
	 * @param {string} [groupId] - Optional group Id
	 */
	private async navigateToAppFinder(groupId?: string) {
		const navigationService = await Container.getServiceAsync<Navigation>("Navigation");
		const navigationObject: { pageID: string; sectionID?: string } = {
			pageID: MYHOME_PAGE_ID,
			sectionID: MYINSIGHT_SECTION_ID
		};
		if (groupId) {
			navigationObject.sectionID = groupId;
		}
		await navigationService.navigate({
			target: {
				shellHash: `Shell-appfinder?&/catalog/${JSON.stringify(navigationObject)}`
			}
		});
	}

	/**
	 * Retrieves the key of the legend color based on the provided color value.
	 * @param {string} color - The color value for which to retrieve the legend color key.
	 * @returns {string} The legend color key corresponding to the provided color value, or the default background color key if not found.
	 * @private
	 */
	private _getLegendColor(color: string) {
		return END_USER_COLORS().find((oColor) => oColor.value === color) || DEFAULT_BG_COLOR();
	}

	/**
	 * Handles the addition of tiles from favorite apps.
	 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
	 * @private
	 */
	private async _handleAddFromFavApps() {
		const appsToAdd = await this._getFavToAdd();
		const dialog = this._generateAddFromFavAppsDialog();
		(this._controlMap.get(`${this._addFromFavDialogId}-errorMessage`) as IllustratedMessage)?.setVisible(appsToAdd.length === 0);
		this._generateAddFromFavAppsListItems(appsToAdd);
		dialog.open();
	}

	private async _getFavToAdd(): Promise<ISectionAndVisualization[]> {
		const aFavApps: ISectionAndVisualization[] = await this.appManagerInstance.fetchFavVizs(false, true);
		const aDynamicApps = aFavApps.filter(function (oDynApp) {
			return oDynApp.isCount || oDynApp.isSmartBusinessTile;
		});

		const aFilteredFavApps = aDynamicApps.filter((oDynApp) => {
			const iAppIndex = this.aInsightsApps.findIndex(function (oInsightApps) {
				return (
					(!oDynApp.visualization?.isBookmark && oInsightApps.visualization?.vizId === oDynApp.visualization?.vizId) ||
					(oDynApp.visualization?.isBookmark && oInsightApps.visualization?.targetURL === oDynApp.visualization?.targetURL)
				);
			});
			return iAppIndex === -1;
		});

		return aFilteredFavApps;
	}

	/**
	 * Retrieves the selected Apps from the dialog.
	 * @returns {sap.m.ListItemBase[]} An array of selected Apps.
	 * @private
	 */
	private _getSelectedInsights() {
		const list = this._controlMap.get(`${this._addFromFavDialogId}-list`) as List;
		return list.getSelectedItems() || [];
	}

	private _generateAddFromFavAppsListItems(appsToAdd: ISectionAndVisualization[]) {
		const id = this._addFromFavDialogId;
		const list = this._controlMap.get(`${id}-list`) as List;
		if (appsToAdd.length) {
			list.destroyItems();
			const listItems = appsToAdd.map(
				(app, index) =>
					new CustomListItem({
						id: `${id}-listItem-${index}`,
						content: [
							new HBox({
								id: `${id}-listItem-${index}-content`,
								alignItems: "Center",
								items: [
									new Icon({
										id: `${id}-listItem-${index}-content-icon`,
										src: app.icon,
										backgroundColor: this._getLegendColor(app.BGColor || "").value,
										color: "white",
										width: "2.25rem",
										height: "2.25rem",
										size: "1.25rem"
									}).addStyleClass("sapUiRoundedBorder sapUiTinyMargin"),
									new ObjectIdentifier({
										id: `${id}-listItem-${index}-content-identifier`,
										title: app.title,
										text: app.subtitle,
										tooltip: app.title
									}).addStyleClass("sapUiTinyMargin")
								]
							})
						]
					})
						.addStyleClass("sapUiContentPadding")
						.data("app", app) as CustomListItem
			);
			listItems.forEach((item) => list.addItem(item));
		}
		list?.setVisible(appsToAdd.length !== 0);
	}

	private _generateAddFromFavAppsDialog(): Dialog {
		const id = this._addFromFavDialogId;
		if (!this._controlMap.get(id)) {
			const getAppFinderBtn = (id: string, btnType?: ButtonType) => {
				const appFinderBtn = new Button(id, {
					icon: "sap-icon://action",
					text: this._i18nBundle.getText("appFinderBtn"),
					press: () => {
						this._closeAddFromFavDialog();
						void this.navigateToAppFinder();
					},
					visible: _showAddApps(),
					type: btnType || ButtonType.Default
				});
				addFESRSemanticStepName(appFinderBtn, FESR_EVENTS.PRESS, "tilesAppFinder");
				return appFinderBtn;
			};
			const setAddBtnEnabled = () => {
				const selectedItems = this._getSelectedInsights();
				(this._controlMap.get(`${id}-addBtn`) as Button).setEnabled(selectedItems.length > 0);
			};
			this._controlMap.set(
				`${id}-list`,
				new List({
					id: `${id}-list`,
					mode: "MultiSelect",
					selectionChange: setAddBtnEnabled
				})
			);
			const addButton = new Button({
				id: `${id}-addBtn`,
				text: this._i18nBundle.getText("addBtn"),
				type: "Emphasized",
				press: () => {
					void this._addFromFavApps();
				},
				enabled: false
			});
			addFESRSemanticStepName(addButton, FESR_EVENTS.PRESS, "addSmartApps");
			this._controlMap.set(`${id}-addBtn`, addButton);
			this._controlMap.set(
				`${id}-errorMessage`,
				new IllustratedMessage({
					id: `${id}-errorMessage`,
					illustrationSize: "Spot",
					illustrationType: "sapIllus-AddDimensions",
					title: this._i18nBundle.getText("noAppsTitle"),
					description: this._i18nBundle.getText("tilesSectionNoDataDescription"),
					visible: true
				}).addStyleClass("sapUiLargeMarginTop")
			);
			this._controlMap.set(
				id,
				new Dialog(id, {
					title: this._i18nBundle.getText("addSmartApps"),
					content: [
						new Label({
							id: `${id}-label`,
							text: this._i18nBundle.getText("suggTileDialogLabel"),
							wrapping: true
						}).addStyleClass("sapMTitleAlign sapUiTinyMarginTopBottom sapUiSmallMarginBeginEnd"),
						new HBox({
							id: `${id}-textContainer`,
							justifyContent: "SpaceBetween",
							alignItems: "Center",
							items: [
								new Title({
									id: `${id}-text`,
									text: this._i18nBundle.getText("suggTileDialogTitle")
								}),
								getAppFinderBtn(`${id}-addAppsBtn`, ButtonType.Transparent)
							]
						}).addStyleClass("sapUiTinyMarginTop dialogHeader sapUiSmallMarginBeginEnd"),
						this._controlMap.get(`${id}-list`) as List,
						this._controlMap.get(`${id}-errorMessage`) as IllustratedMessage
					],
					contentWidth: "42.75rem",
					contentHeight: "32.5rem",
					endButton: new Button({
						text: this._i18nBundle.getText("closeBtn"),
						press: this._closeAddFromFavDialog.bind(this)
					}),
					escapeHandler: this._closeAddFromFavDialog.bind(this),
					buttons: [
						this._controlMap.get(`${id}-addBtn`) as Button,
						new Button({
							id: `${id}-cancelBtn`,
							text: this._i18nBundle.getText("cancelBtn"),
							press: this._closeAddFromFavDialog.bind(this)
						})
					]
				}).addStyleClass("sapContrastPlus sapCuxAddFromInsightsDialog")
			);
		}
		return this._controlMap.get(id) as Dialog;
	}

	private async _addFromFavApps() {
		const dialog = this._controlMap.get(this._addFromFavDialogId) as Dialog;
		dialog.setBusy(true);
		const selectedItems = this._getSelectedInsights();
		await selectedItems.reduce(async (promise, oApp) => {
			await promise;
			const app = oApp.data("app") as ISectionAndVisualization;
			const oMovingConfig = {
				pageId: MYHOME_PAGE_ID,
				sourceSectionIndex: app.persConfig?.sectionIndex as number,
				sourceVisualizationIndex: app.persConfig?.visualizationIndex as number,
				targetSectionIndex: this.appManagerInstance.insightsSectionIndex,
				targetVisualizationIndex: -1
			};
			if (app.visualization?.displayFormatHint !== "standard" && app.visualization?.displayFormatHint !== "standardWide") {
				if (app.visualization?.supportedDisplayFormats?.includes("standard")) {
					app.visualization.displayFormatHint = "standard";
				} else if (app.visualization?.supportedDisplayFormats?.includes("standardWide")) {
					app.visualization.displayFormatHint = "standardWide";
				}
			}
			// Add Selected App to Insights Section
			if (!app.visualization?.vizId) {
				(app.visualization as IVisualization).vizId = app.visualization?.targetURL || "";
			}
			if (app.visualization?.isBookmark === true) {
				await this.appManagerInstance.addBookMark(app.visualization, oMovingConfig);
			} else {
				await this.appManagerInstance.addVisualization(app.visualization?.vizId as string, MYINSIGHT_SECTION_ID);
			}
		}, Promise.resolve());

		await this.refreshData();
		dialog.setBusy(false);
		dialog.close();
	}

	/**
	 * Calculates the number of visible tiles that can fit within the available width of the parent container.
	 *
	 * @private
	 * @param {ICustomVisualization[]} insightsApps - An array of custom visualizations to be displayed as tiles.
	 * @returns {number} - The number of visible tiles.
	 */
	private _calculateVisibleTileCount(insightsApps: ICustomVisualization[]): number {
		const layoutDomRef = this._getInsightsContainer()?._getLayout()?.getDomRef();
		const apps = insightsApps || [];
		let count = 0;

		if (layoutDomRef && apps.length) {
			const sectionDomRef = layoutDomRef.childNodes[0] as Element;
			const domProperties = fetchElementProperties(sectionDomRef, ["width", "padding-left", "padding-right"]);
			let availableWidth = domProperties.width - domProperties["padding-left"] - domProperties["padding-right"];
			const widthMap = {} as Record<DisplayFormat, number>;

			widthMap[DisplayFormat.Standard] = 176 + 16; // Width + Gap
			widthMap[DisplayFormat.StandardWide] = 368 + 16; // Width + Gap

			let nextTileWidth = widthMap[(apps[count].visualization?.displayFormatHint || DisplayFormat.Standard) as DisplayFormat];
			do {
				availableWidth -= nextTileWidth;
				++count;
				nextTileWidth =
					widthMap[((apps[count] && apps[count].visualization?.displayFormatHint) || DisplayFormat.Standard) as DisplayFormat];
			} while (availableWidth > nextTileWidth);
		}

		return count || 1;
	}

	/**
	 * Adjusts the layout of the tiles panel based on the current layout and device type.
	 *
	 * @private
	 * @override
	 */
	public _adjustLayout() {
		const layout = this._getInsightsContainer()?._getLayout();
		const isFullScreenEnabled = this.getProperty("enableFullScreen") as boolean;
		const isMobileDevice = this.getDeviceType() === DeviceType.Mobile;

		if (layout && isFullScreenEnabled) {
			const visibleTileCount = isMobileDevice ? this.aInsightsApps?.length : this._calculateVisibleTileCount(this.aInsightsApps);
			const isElementExpanded = layout._getCurrentExpandedElementName() === this.getProperty("fullScreenName");
			this._controlModel.setProperty(
				"/tiles",
				isElementExpanded ? this.aInsightsApps : this.aInsightsApps?.slice(0, visibleTileCount)
			);

			//Show/Hide Full Screen Button if available
			this._getInsightsContainer()?.toggleFullScreenElements(this, this.aInsightsApps?.length > visibleTileCount, isElementExpanded);
		}
	}

	private _getInsightsContainer(): InsightsContainer {
		if (!this.insightsContainer) {
			this.insightsContainer = this.getParent() as InsightsContainer;
		}
		return this.insightsContainer;
	}
}
