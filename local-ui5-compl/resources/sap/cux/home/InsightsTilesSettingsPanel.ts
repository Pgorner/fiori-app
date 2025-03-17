/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Button from "sap/m/Button";
import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import FlexBox from "sap/m/FlexBox";
import HBox from "sap/m/HBox";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import ScrollContainer from "sap/m/ScrollContainer";
import SearchField from "sap/m/SearchField";
import Switch from "sap/m/Switch";
import Table from "sap/m/Table";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import VBox from "sap/m/VBox";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import Icon from "sap/ui/core/Icon";
import DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import { DropInfo$DropEvent } from "sap/ui/core/dnd/DropInfo";
import BaseSettingsPanel from "./BaseSettingsPanel";
import TilesPanel, { DisplayFormat } from "./TilesPanel";
import { ICustomVisualization, IPersConfig, ISectionAndVisualization } from "./interface/AppsInterface";
import AppManager from "./utils/AppManager";
import { MYHOME_PAGE_ID, SETTINGS_PANELS_KEYS } from "./utils/Constants";

interface IDragEvent {
	draggedControl: ColumnListItem;
	droppedControl: ColumnListItem;
}

/**
 *
 * Class for My Home Insights Tiles Settings Panel.
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
 * @alias sap.cux.home.InsightsTilesSettingsPanel
 */
export default class InsightsTilesSettingsPanel extends BaseSettingsPanel {
	private _wrapperId!: string;
	private _controlMap!: Map<string, Control | Element>;
	private _allInsightsApps!: ICustomVisualization[];
	private appManagerInstance!: AppManager;
	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public async init() {
		super.init();
		this._controlMap = new Map();

		//setup panel
		this.setProperty("key", SETTINGS_PANELS_KEYS.INSIGHTS_TILES);
		this.setProperty("title", this._i18nBundle.getText("insightsTiles"));
		this.setProperty("icon", "sap-icon://manager-insight");

		//Fetch Data
		this.appManagerInstance = AppManager.getInstance();
		this._allInsightsApps = await this.appManagerInstance.fetchInsightApps(true, this._i18nBundle.getText("insights") as string);

		//setup Container & content Aggregation
		this._wrapperId = `${this.getId()}-tilesSettingsWrapper`;
		this._controlMap.set(
			this._wrapperId,
			new FlexBox(this._wrapperId, {
				alignItems: "Start",
				justifyContent: "Start",
				height: "100%",
				width: "100%",
				direction: "Column"
			}).addStyleClass("flexContainerCards")
		);
		this.addAggregation("content", this._controlMap.get(this._wrapperId) as FlexBox);

		//setup content for the settings panel
		this._showMessageStrip();
		this._showToolbar();
		this._showTilesList();

		//fired every time on panel navigation
		this.attachPanelNavigated(() => {
			(this._controlMap.get(`${this._wrapperId}--searchField`) as SearchField).setValue("");
			void this.appManagerInstance.fetchInsightApps(false, this._i18nBundle.getText("insights") as string).then((insightsApps) => {
				this._allInsightsApps = insightsApps;
				(this._controlMap.get(`${this._wrapperId}--title`) as Title).setText(
					`${this._i18nBundle.getText("insightsTilesTitle")} (${this._allInsightsApps.length})`
				);
				this._createTableRows(this._allInsightsApps);
			});
		});
	}

	/**
	 * Add the Message Strip to the wrapper FlexBox.
	 *
	 * @private
	 */

	private _showMessageStrip() {
		const oMessageStripVBox = new VBox(`${this._wrapperId}--msgStripContainer`, {
			width: "calc(100% - 2rem)"
		}).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBegin");
		oMessageStripVBox.addItem(
			new Text(`${this._wrapperId}--msgStripText`, {
				text: this._i18nBundle.getText("insightAppsTabText")
			})
		);
		this._getWrapperFlexBox().addItem(oMessageStripVBox);
	}

	/**
	 * Add the Header ToolBar to the wrapper FlexBox.
	 *
	 * @private
	 */
	private _showToolbar() {
		this._controlMap.set(
			`${this._wrapperId}--title`,
			new Title(`${this._wrapperId}--title`, {
				text: `${this._i18nBundle.getText("insightsTilesTitle")} (${this._allInsightsApps.length})`,
				titleStyle: "H5",
				width: "100%"
			})
		);

		this._controlMap.set(
			`${this._wrapperId}--searchField`,
			new SearchField(`${this._wrapperId}--pagesListSearch`, {
				liveChange: (oEvent) => this._onTilesSearch(oEvent),
				width: "100%"
			}).addStyleClass("sapUiTinyMarginTop")
		);

		const titleContainer = new HBox(`${this._wrapperId}--titleContainer`, {
			alignItems: "Center",
			justifyContent: "SpaceBetween",
			width: "100%"
		});
		titleContainer.addItem(this._controlMap.get(`${this._wrapperId}--title`) as Title);
		const toolbarContainer = new VBox(`${this._wrapperId}--toolbarContainer`, {
			width: "calc(100% - 2rem)",
			items: [titleContainer, this._controlMap.get(`${this._wrapperId}--searchField`) as SearchField]
		}).addStyleClass("sapUiSmallMarginTop sapUiSmallMarginBegin");
		this._getWrapperFlexBox().addItem(toolbarContainer);
	}

	/**
	 * Handles Search Field change
	 * @private
	 */
	private _onTilesSearch(event: Event) {
		const sSearchQuery = event.getSource<SearchField>().getValue().toLowerCase();
		const filteredTiles = this._allInsightsApps.filter((app) => app.visualization?.title?.toLowerCase().includes(sSearchQuery));
		this._createTableRows(filteredTiles);
	}

	/**
	 * Adds Tiles List Table to Wrapper FlexBox
	 * @private
	 */
	private _showTilesList() {
		this._createTableWithContainer();
		this._createTableRows(this._allInsightsApps);
	}

	/**
	 * Creates Table to Render Tiles List
	 * @private
	 */
	private _createTableWithContainer() {
		this._controlMap.set(
			`${this._wrapperId}-table`,
			new Table(`${this._wrapperId}-table`, {
				columns: [
					new Column(`${this._wrapperId}-table-dndIcon`, {
						hAlign: "Center",
						width: "6%"
					}),
					new Column(`${this._wrapperId}-table-title`, {
						width: "94%"
					})
				],
				dragDropConfig: new DragDropInfo(`${this._wrapperId}-dragDropInfo`, {
					sourceAggregation: "items",
					targetAggregation: "items",
					groupName: "insightsTilesSettingsItems",
					dropPosition: "On",
					drop: (event: DropInfo$DropEvent) => void this._handleTilesDrop(event)
				})
			}).addStyleClass("sapContrastPlus")
		);
		const scrollContainer = new ScrollContainer(`${this._wrapperId}-scrollContainer`, {
			vertical: true,
			horizontal: false,
			height: "100%",
			width: "100%",
			content: [this._controlMap.get(`${this._wrapperId}-table`) as Table]
		});
		const containerVBox = new VBox(`${this._wrapperId}-containerVBox`, {
			height: "100%",
			width: "100%",
			justifyContent: "Start",
			direction: "Column",
			items: [scrollContainer]
		});
		const containerFlexBox = new FlexBox(`${this._wrapperId}-containerFlexBox`, {
			alignItems: "Start",
			justifyContent: "Start",
			height: "100%",
			width: "calc(100% - 2rem)",
			direction: "Row",
			items: [containerVBox]
		}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTop flexContainerCards");

		this._getWrapperFlexBox().addItem(containerFlexBox);
	}

	/**
	 * Handles Drag Drop of Tiles
	 * @private
	 */
	private async _handleTilesDrop(oEvent: DropInfo$DropEvent | IDragEvent) {
		const oDragItem = ((oEvent as DropInfo$DropEvent).getParameter?.("draggedControl") ||
				(oEvent as IDragEvent).draggedControl) as ColumnListItem,
			iDragItemIndex = (oDragItem.getParent() as Table)?.indexOfItem(oDragItem),
			oDropItem = ((oEvent as DropInfo$DropEvent).getParameter?.("droppedControl") ||
				(oEvent as IDragEvent).droppedControl) as ColumnListItem,
			iDropItemIndex = (oDragItem.getParent() as Table)?.indexOfItem(oDropItem),
			oDragItemPersConfig = oDragItem.data("persConfig") as IPersConfig,
			oDropItemPersConfig = oDropItem.data("persConfig") as IPersConfig;
		if (iDragItemIndex !== iDropItemIndex) {
			this._getWrapperFlexBox().setBusy(true);
			const moveConfigs = {
				pageId: MYHOME_PAGE_ID,
				sourceSectionIndex: oDragItemPersConfig.sectionIndex as number,
				sourceVisualizationIndex: oDragItemPersConfig.visualizationIndex as number,
				targetSectionIndex: oDropItemPersConfig.sectionIndex as number,
				targetVisualizationIndex: oDropItemPersConfig.visualizationIndex as number
			};
			await this.appManagerInstance.moveVisualization(moveConfigs);
			this._allInsightsApps = await this.appManagerInstance.fetchInsightApps(true, this._i18nBundle.getText("insights") as string);
			this._createTableRows(this._allInsightsApps);
			await this._getTilePanel().refreshData();
			this._getWrapperFlexBox().setBusy(false);
		}
	}

	/**
	 * Create Table Rows
	 * @private
	 */
	private _createTableRows(insightsApps: ICustomVisualization[]) {
		const table = this._controlMap.get(`${this._wrapperId}-table`) as Table;
		table.removeAllItems();
		let filteredTiles = insightsApps;
		const sSearchQuery = (this._controlMap.get(`${this._wrapperId}--searchField`) as SearchField).getValue();
		if (sSearchQuery) {
			filteredTiles = this._allInsightsApps.filter((app) => app.visualization?.title?.toLowerCase().includes(sSearchQuery));
		}
		filteredTiles.forEach((filteredTile, index) => {
			table.addItem(this._createColumnListItem(filteredTile, index));
		});
	}

	/**
	 * Create ColumnListItem for each Insights App
	 * @private
	 */
	private _createColumnListItem(insightsApp: ICustomVisualization, index: number): ColumnListItem {
		const id = `insightsTiles-${index}-listItem`;
		const existingControl = UI5Element.getElementById(id);
		if (existingControl) {
			existingControl.destroy();
		}
		// Create Column List Item
		const columnListItem = new ColumnListItem({
			id,
			type: "Inactive"
		}).addStyleClass("insightsListItem insightsListMargin manageSectionsTable");

		// Add first cell as Drag & Drop Icon
		columnListItem.addCell(
			new HBox({
				items: [
					new Icon({
						src: "sap-icon://BusinessSuiteInAppSymbols/icon-grip"
					}).addStyleClass("tilesDndIcon")
				]
			})
		);

		//Create Convert Switch
		const aSupportedDisplayFormats = insightsApp.visualization?.supportedDisplayFormats || "";
		let convertSwitchContainer;
		// if it is not static tile and standard/standardWide display format is supported, display convert switch
		if (
			(insightsApp.isCount || insightsApp.isSmartBusinessTile) &&
			aSupportedDisplayFormats.length > 1 &&
			aSupportedDisplayFormats.indexOf(DisplayFormat.Standard) > -1 &&
			aSupportedDisplayFormats.indexOf(DisplayFormat.StandardWide) > -1
		) {
			convertSwitchContainer = new HBox({
				id: `${id}-convertSwitchContainer`,
				alignItems: "Center",
				items: [
					new Text({
						id: `${id}-switchAppSizeLabel`,
						text: this._i18nBundle.getText("wide"),
						wrapping: false
					}),
					new Switch({
						id: `${id}-convertSwitch`,
						// ariaLabelledBy="switchAppSizeLabel"
						state: insightsApp.visualization?.displayFormatHint !== DisplayFormat.Standard,
						change: () => void this._onConvertTilePress(insightsApp),
						customTextOn: " ",
						customTextOff: " ",
						tooltip:
							insightsApp.visualization?.displayFormatHint === DisplayFormat.Standard
								? this._i18nBundle.getText("ConvertToWideTile")
								: this._i18nBundle.getText("ConvertToTile")
					})
				]
			});
		}

		const deleteBtn = new Button({
			id: `${id}-deleteAppBtn`,
			type: "Transparent",
			icon: "sap-icon://decline",
			press: () => this._onDeleteApp(insightsApp),
			tooltip: this._i18nBundle.getText("removeFromInsights")
		});

		const buttonsWrapper = new HBox({
			id: `${id}-buttonsWrapper`,
			alignItems: "Center"
		}).addStyleClass("sapUiSmallMarginEnd");

		if (convertSwitchContainer) {
			buttonsWrapper.addItem(convertSwitchContainer);
		}
		buttonsWrapper.addItem(deleteBtn);

		columnListItem.addCell(
			new HBox({
				id: `${id}-cell`,
				alignItems: "Center",
				justifyContent: "SpaceBetween",
				items: [
					new ObjectIdentifier({
						title: insightsApp.visualization?.title as string,
						text: insightsApp.visualization?.subtitle as string,
						tooltip: insightsApp.visualization?.title as string
					}).addStyleClass("objectIdentifierMargin"),
					buttonsWrapper
				]
			})
		);
		columnListItem.data("persConfig", insightsApp.persConfig);

		return columnListItem;
	}

	/**
	 * Handles Convert Tile
	 * @private
	 */
	private async _onConvertTilePress(app: ICustomVisualization) {
		const displayFormatHint = app.visualization?.displayFormatHint,
			updateConfigs = {
				pageId: MYHOME_PAGE_ID,
				sourceSectionIndex: app.persConfig?.sectionIndex as number,
				sourceVisualizationIndex: app.persConfig?.visualizationIndex as number,
				oVisualizationData: {
					displayFormatHint: displayFormatHint === DisplayFormat.Standard ? DisplayFormat.StandardWide : DisplayFormat.Standard
				}
			};

		this._getWrapperFlexBox().setBusy(true);
		await this.appManagerInstance.updateVisualizations(updateConfigs);
		await this._getTilePanel().refreshData();
		if (app.visualization) {
			app.visualization.displayFormatHint = updateConfigs.oVisualizationData.displayFormatHint;
		}
		this._getWrapperFlexBox().setBusy(false);
	}

	/**
	 * Deletes Insights App
	 * @private
	 */
	private _onDeleteApp(app: ICustomVisualization) {
		MessageBox.show(this._i18nBundle.getText("remove_tile_confirmation_title", [app.title]) as string, {
			id: "removeTileConfirmation",
			styleClass: "msgBoxWidth",
			icon: MessageBox.Icon.QUESTION,
			title: this._i18nBundle.getText("remove") as string,
			actions: [this._i18nBundle.getText("remove") as string, MessageBox.Action.CANCEL],
			emphasizedAction: this._i18nBundle.getText("remove"),
			onClose: (action: string) => this._handleDeleteApp(action, app)
		});
	}

	/**
	 * Handle Delete App Confirmation Decision
	 * @private
	 */
	private async _handleDeleteApp(action: string, app: ISectionAndVisualization) {
		if (action === this._i18nBundle.getText("remove")) {
			this._getWrapperFlexBox().setBusy(true);
			await this.appManagerInstance.removeVisualizations({
				sectionId: app.persConfig?.sectionId as string,
				vizIds: [app.visualization?.id as string]
			});
			MessageToast.show(this._i18nBundle.getText("appRemovedInsights") as string);
			this._allInsightsApps = await this.appManagerInstance.fetchInsightApps(true, this._i18nBundle.getText("insights") as string);
			(this._controlMap.get(`${this._wrapperId}--title`) as Title).setText(
				`${this._i18nBundle.getText("insightsTilesTitle")} (${this._allInsightsApps.length})`
			);
			this._createTableRows(this._allInsightsApps);
			await this._getTilePanel().refreshData();
			this._getWrapperFlexBox().setBusy(false);
		}
	}

	/**
	 * Returns wrapper FlexBox
	 * @private
	 */
	private _getWrapperFlexBox(): FlexBox {
		return this._controlMap.get(this._wrapperId) as FlexBox;
	}

	/**
	 * Returns Tiles Panel
	 * @private
	 */
	private _getTilePanel(): TilesPanel {
		return this._getPanel() as TilesPanel;
	}
}
