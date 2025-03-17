/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Button from "sap/m/Button";
import ColorPalette, { ColorPalette$ColorSelectEvent } from "sap/m/ColorPalette";
import Dialog from "sap/m/Dialog";
import FlexBox from "sap/m/FlexBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Label from "sap/m/Label";
import List from "sap/m/List";
import ScrollContainer from "sap/m/ScrollContainer";
import SearchField, { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import StandardListItem from "sap/m/StandardListItem";
import Switch, { Switch$ChangeEvent } from "sap/m/Switch";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import VBox from "sap/m/VBox";
import Component from "sap/ui/core/Component";
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import Icon from "sap/ui/core/Icon";
import Parameters, { Value } from "sap/ui/core/theming/Parameters";
import Context from "sap/ui/model/Context";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import JSONListBinding from "sap/ui/model/json/JSONListBinding";
import JSONModel from "sap/ui/model/json/JSONModel";
import Column from "sap/ui/table/Column";
import { Table$RowSelectionChangeEvent } from "sap/ui/table/Table";
import TreeTable from "sap/ui/table/TreeTable";
import BaseLayout from "./BaseLayout";
import BaseSettingsPanel from "./BaseSettingsPanel";
import { CHANGE_TYPES } from "./flexibility/Layout.flexibility";
import { IKeyUserChange, ISpacePagePersonalization } from "./interface/KeyUserInterface";
import { IColor, IPage, ISpace } from "./interface/PageSpaceInterface";
import NewsAndPagesContainer from "./NewsAndPagesContainer";
import PagePanel from "./PagePanel";
import { DEFAULT_BG_COLOR, END_USER_COLORS, FALLBACK_ICON, KEYUSER_SETTINGS_PANELS_KEYS } from "./utils/Constants";
import { ICONS } from "./utils/IconList";
import PageManager from "./utils/PageManager";
import PersonalisationUtils from "./utils/PersonalisationUtils";

/**
 *
 * Class for Pages Settings Panel for KeyUser Settings Dialog.
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
 * @alias sap.cux.home.KeyUserPagesSettingsPanel
 */
export default class KeyUserPagesSettingsPanel extends BaseSettingsPanel {
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home"
	};

	private controlMap!: Map<string, Control | Element>;
	private controlModel!: JSONModel;
	private pageManagerInstance!: PageManager;
	private selectedContext!: Context;
	private _eventBus!: EventBus;
	private keyuserSpaceColorChanges: Array<ISpacePagePersonalization> = [];
	private keyuserPageColorChanges: Array<ISpacePagePersonalization> = [];
	private keyuserSpaceIconChanges: Array<ISpacePagePersonalization> = [];
	private keyuserPageIconChanges: Array<ISpacePagePersonalization> = [];

	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		super.init();
		this.controlMap = new Map();
		this.controlModel = new JSONModel({
			spaces: [],
			selectedSpacePage: {},
			iconList: []
		});

		// setup panel
		this.setProperty("key", KEYUSER_SETTINGS_PANELS_KEYS.PAGES);
		this.setProperty("title", this._i18nBundle.getText("editPages"));

		// Setup Event Bus
		this._eventBus = EventBus.getInstance();

		// setup layout content
		this.addAggregation("content", this.getContent());

		// fired every time on panel navigation
		this.attachPanelNavigated(() => this.loadSettings());
	}

	/**
	 * Returns the content for the KeyUser Pages Settings Panel.
	 *
	 * @private
	 * @returns {VBox} The control containing the KeyUser Pages Settings Panel content.
	 */
	private getContent(): Dialog {
		const dialogId = `${this.getId()}-keyUserPagesSettingsDialog`;
		if (!this.controlMap.get(dialogId)) {
			const oDialog = new Dialog(dialogId, {
				title: this._i18nBundle.getText("editPages"),
				contentWidth: "47rem",
				contentHeight: "90%",
				verticalScrolling: false,
				endButton: new Button(`${this.getId()}-keyUserPagesSettingsCloseButton`, {
					text: this._i18nBundle.getText("Close"),
					press: this._handleDialogClose.bind(this),
					type: "Transparent"
				})
			}).addStyleClass("sapContrastPlus");
			this.controlMap.set(dialogId, oDialog);

			this.addDialogContent();
		}
		return this.controlMap.get(dialogId) as Dialog;
	}

	/**
	 * Load settings for the panel.
	 *
	 * @private
	 */
	private loadSettings(): void {
		if (!this.pageManagerInstance) {
			this.pageManagerInstance = PageManager.getInstance(
				PersonalisationUtils.getPersContainerId(this._getPanel()),
				PersonalisationUtils.getOwnerComponent(this._getPanel()) as Component
			);
		}
		// setup layout content
		void this.prepareSpacesPagesData();
		this.prepareIconList();
	}

	/**
	 * Add Dialog Content.
	 *
	 * @private
	 */
	private addDialogContent(): void {
		const dialog = this.controlMap.get(`${this.getId()}-keyUserPagesSettingsDialog`) as Dialog;
		const wrapperFlexBox = new FlexBox(`${this.getId()}-wrapperFlexBox`, {
			alignItems: "Start",
			justifyContent: "Start",
			height: "100%",
			width: "100%",
			direction: "Row"
		});
		wrapperFlexBox.setModel(this.controlModel);
		wrapperFlexBox.addItem(this.getSpacePagesListItems());
		wrapperFlexBox.addItem(this.getDetailsView());
		dialog.addContent(wrapperFlexBox);
	}

	/**
	 * Get Space Pages List Items.
	 *
	 * @private
	 * @returns {FlexBox} The control containing the Space Pages List Items.
	 */
	private getSpacePagesListItems(): FlexBox {
		const flexBox = new FlexBox(`${this.getId()}-spacePagesFlexBox`, {
			direction: "Column",
			alignItems: "Start",
			height: "100%",
			width: "24rem",
			justifyContent: "Start"
		}).addStyleClass("spacePagesFlexBox");

		const title = new Title(`${this.getId()}-spacePagesTitle`, {
			text: this._i18nBundle.getText("pageGroupHeader"),
			titleStyle: "H4"
		}).addStyleClass("sapUiSmallMarginBottom");
		flexBox.addItem(title);

		const treeTableWrapper = new VBox(`${this.getId()}-treeTableWrapper`, {
			height: "100%"
		});

		const treeTableId = `${this.getId()}-spacePagesTreeTable`;
		const treeTable = new TreeTable(treeTableId, {
			selectionMode: "Single",
			selectionBehavior: "RowOnly",
			rows: "{path:'/spaces', parameters: {arrayNames:['children'], numberOfExpandedLevels: 1}}",
			id: "idEditIntrestTreeTable",
			groupHeaderProperty: "label",
			columnHeaderVisible: false,
			rowMode: "Auto",
			rowSelectionChange: this.handleTreeTableRowSelection.bind(this),
			width: "22rem",
			layoutData: new FlexItemData({
				growFactor: 1
			}),
			columns: [
				new Column({
					template: new HBox({
						alignItems: "Center",
						justifyContent: "SpaceBetween",
						width: "100%",
						items: [
							new Text({
								text: "{label}"
							}),
							new HBox({
								alignItems: "Center",
								items: [
									new Icon({
										tooltip: "{label}",
										src: "{icon}",
										backgroundColor: "{BGColor/value}",
										width: "2.5rem",
										height: "2.5rem",
										size: "1.5rem",
										color: "white"
									}).addStyleClass("sapUiTinyMargin")
								]
							})
						]
					})
				})
			]
		}).addStyleClass("spacePageTable");
		this.controlMap.set(treeTableId, treeTable);
		treeTableWrapper.addItem(treeTable);

		flexBox.addItem(treeTableWrapper);
		return flexBox;
	}

	/**
	 * Get details view for the selected space or page.
	 *
	 * @private
	 * @returns {FlexBox} The control containing the Details.
	 */
	private getDetailsView(): FlexBox {
		// Create Wrapper FlexBox
		const flexBox = new FlexBox(`${this.getId()}-personalisationDetailsWrapperFlex`, {
			height: "100%",
			width: "23rem",
			direction: "Column",
			visible: "{= ${/spaces/length} === 0 ? false : true}"
		}).addStyleClass("personalisationDetailsWrapperFlex");

		// Create Color Palette and add to wrapper FlexBox
		flexBox.addItem(this.getColorPalette());

		// Create Icon List and add to wrapper FlexBox
		flexBox.addItem(this.getIconList());
		return flexBox;
	}

	/**
	 * Get Color Palette.
	 *
	 * @private
	 * @returns {VBox} The control containing the Color Palette.
	 */
	private getColorPalette(): VBox {
		const wrapperVBox = new VBox(`${this.getId()}-colorPaletteWrapperVBox`, {
			width: "100%"
		}).addStyleClass("sapUiSmallMarginBottom");

		// Create Title and add to wrapper VBox
		const title = new Title(`${this.getId()}-colorPaletteTitle`, {
			text: "{/selectedSpacePage/label}",
			titleStyle: "H4"
		});
		wrapperVBox.addItem(title);

		// Create Label and add to wrapper VBox
		const label = new Label(`${this.getId()}-colorPaletteSpacePageLabel`, {
			wrapping: true,
			text:
				"{= ${/selectedSpacePage/type} === 'Space' ? '" +
				this._i18nBundle.getText("space") +
				"' : '" +
				this._i18nBundle.getText("page") +
				"' }"
		}).addStyleClass("personalisationDetailsLabel");
		wrapperVBox.addItem(label);

		// Create Color Palette VBox and add to wrapper VBox
		const colorPaletteVBox = new VBox(`${this.getId()}-colorPaletteVBox`, {
			width: "100%"
		}).addStyleClass("sapUiMargin-26Top");
		wrapperVBox.addItem(colorPaletteVBox);

		// Create Color Palette Label and add to Color Palette VBox
		const colorPaletteLabel = new Label(`${this.getId()}-colorPaletteLabel`, {
			wrapping: true,
			design: "Bold",
			text: this._i18nBundle.getText("selectColor")
		}).addStyleClass("personalisationDetailsLabel");
		colorPaletteVBox.addItem(colorPaletteLabel);

		// Create Color Palette and add to Color Palette VBox
		const colorPalette = new ColorPalette(`${this.getId()}-colorPalette`, {
			colors: END_USER_COLORS().map((color) => color.value as string),
			colorSelect: this._handleColorSelect.bind(this)
		}).addStyleClass("sapContrastPlus sapUiTinyMarginBottom");
		this.controlMap.set(`${this.getId()}-colorPalette`, colorPalette);
		colorPaletteVBox.addItem(colorPalette);

		// Create Switch Wrapper HBox and add to wrapper VBox
		const switchWrapperHBox = new HBox(`${this.getId()}-switchWrapperHBox`, {
			alignItems: "Center",
			justifyContent: "SpaceBetween",
			height: "2rem",
			width: "100%"
		});
		wrapperVBox.addItem(switchWrapperHBox);

		// Create Text and add to Switch Wrapper HBox
		const switchText = new Text(`${this.getId()}-switchText`, {
			text: this._i18nBundle.getText("editPagesColorMessage")
		});
		switchWrapperHBox.addItem(switchText);

		// Create Switch HBox and add to Switch Wrapper HBox
		const switchHBox = new HBox(`${this.getId()}-switchHBox`, {
			alignItems: "Center"
		});
		switchWrapperHBox.addItem(switchHBox);

		// Create Switch and add to Switch HBox
		const switchId = `${this.getId()}-Switch`;
		const switchControl = new Switch(switchId, {
			state: "{ path: '/selectedSpacePage/applyColorToAllPages', mode: 'TwoWay' }",
			change: this._handleSwitchChange.bind(this),
			enabled: "{= ${/selectedSpacePage/spaceId} ? false : true }",
			customTextOn: " ",
			customTextOff: " "
		});
		this.controlMap.set(switchId, switchControl);
		switchHBox.addItem(switchControl);

		return wrapperVBox;
	}

	/**
	 * Get Icon List.
	 *
	 * @private
	 * @returns {VBox} The control containing the Icon List.
	 */
	private getIconList(): VBox {
		const wrapperVBox = new VBox(`${this.getId()}-iconListWrapperVBox`, {
			width: "100%",
			height: "calc(100% - 15rem)"
		});

		// Create Label and add to wrapper VBox
		const label = new Label(`${this.getId()}-iconListLabel`, {
			wrapping: true,
			design: "Bold",
			text: this._i18nBundle.getText("icon")
		}).addStyleClass("personalisationDetailsLabel");
		wrapperVBox.addItem(label);

		// Create SearchField and add to wrapper VBox
		const searchFieldId = `${this.getId()}-iconListSearchField`;
		const searchField = new SearchField(searchFieldId, {
			width: "100%",
			liveChange: this.handleIconSearch.bind(this)
		});
		this.controlMap.set(searchFieldId, searchField);
		wrapperVBox.addItem(searchField);

		// Create Scroll Container For List of Icons and add to wrapper VBox
		const iconListScrollContainer = new ScrollContainer(`${this.getId()}-iconListScrollContainer`, {
			vertical: true,
			horizontal: false,
			height: "95%"
		});
		wrapperVBox.addItem(iconListScrollContainer);

		// Create List of Icons and add to Scroll Container
		const iconListId = `${this.getId()}-iconList`;
		const iconList = new List(iconListId, {
			items: {
				path: "/iconList",
				template: new StandardListItem(`${this.getId()}-iconStandardListItem`, {
					title: "{title}",
					icon: "{icon}",
					type: "Active",
					press: (event) => this._handleIconSelect(event.getSource()),
					iconDensityAware: false,
					iconInset: false
				})
			}
		});
		this.controlMap.set(iconListId, iconList);
		iconListScrollContainer.addContent(iconList);

		return wrapperVBox;
	}

	/**
	 * Prepare spaces and pages data.
	 *
	 * @private
	 */
	private async prepareSpacesPagesData(): Promise<void> {
		const aSpaces = await this.pageManagerInstance.fetchAllAvailableSpaces();
		if (!Array.isArray(aSpaces)) {
			return;
		}
		//Prepare Spaces and Pages Data
		aSpaces.forEach((oSpace) => {
			oSpace.BGColor = oSpace.BGColor ? this.refreshColor(oSpace.BGColor) : DEFAULT_BG_COLOR();
			oSpace.isSpacePersonalization = oSpace.BGColor || oSpace.icon ? true : false;
			oSpace.icon = oSpace.icon || FALLBACK_ICON;
			oSpace.persistedApplyColorToAllPages = oSpace.applyColorToAllPages;
			oSpace.children.forEach((oPage) => {
				if (oSpace.applyColorToAllPages) {
					oPage.BGColor = this.refreshColor(oSpace.BGColor as IColor) as IColor;
					oPage.oldColor = oPage.isPagePersonalization
						? this.refreshColor(oPage.oldColor as { key: string; value: Value; assigned: boolean })
						: DEFAULT_BG_COLOR();
				} else {
					oPage.BGColor = oPage.BGColor ? (this.refreshColor(oPage.BGColor as IColor) as IColor) : DEFAULT_BG_COLOR();
				}
				oPage.spaceId = oSpace.id;
				oPage.personalizationState = oPage.isPagePersonalization;
				oPage.iconPersonalizationState = oPage.isPageIconPersonalization;
				oPage.icon = oPage.icon || oSpace.icon || FALLBACK_ICON;
			});
		});

		this.controlModel.setProperty("/spaces", aSpaces);
		// Select the first item in list selected by default
		const treeTable = this.controlMap.get(`${this.getId()}-spacePagesTreeTable`) as TreeTable;
		const selectedIndices = treeTable.getSelectedIndices();
		if (!selectedIndices.includes(0)) {
			treeTable.setSelectedIndex(0);
		}
	}

	/**
	 * Refresh color.
	 *
	 * @param {string} sColor The color to refresh.
	 * @returns {string} The refreshed color.
	 */
	private refreshColor(oColorObject: IColor): {
		key: string;
		value: Value;
		assigned: boolean;
	} {
		// Refresh color object with new color value in case of theme switching.
		const newObject = { ...oColorObject } as IColor;
		newObject.value = Parameters.get({ name: oColorObject.key }) as string;
		return newObject;
	}

	/**
	 * Handle Tree Table Row Selection.
	 *
	 * @param {Event} oEvent The event object.
	 * @private
	 */
	private handleTreeTableRowSelection(oEvent: Table$RowSelectionChangeEvent): void {
		interface IControlWithBlockedProperty {
			getBlocked: () => boolean;
			setBlocked: (val: boolean) => void;
		}
		const bindingContext = oEvent.getParameter("rowContext") as Context;
		const selectedObject = bindingContext?.getObject() as ISpace | IPage;

		const prevSelectedObject = this.controlModel.getProperty("/selectedSpacePage") as ISpace | IPage;
		const colorPalette = this.controlMap.get(`${this.getId()}-colorPalette`) as unknown as IControlWithBlockedProperty; // setBlocked is not available in ColorPalette
		const searchField = this.controlMap.get(`${this.getId()}-iconListSearchField`) as unknown as IControlWithBlockedProperty; // setBlocked is not available in SearchField
		const iconList = this.controlMap.get(`${this.getId()}-iconList`) as unknown as IControlWithBlockedProperty; // setBlocked is not available in List
		const switchControl = this.controlMap.get(`${this.getId()}-Switch`) as unknown as IControlWithBlockedProperty; // setBlocked is not available in Switch
		let spaceObject = undefined;
		let controlsDisabled: boolean = colorPalette.getBlocked();

		if (selectedObject.type === "Page") {
			const contextPath = bindingContext.getPath();
			const spaceContextPath = contextPath.replace(/\/children\/\d*/, "");
			spaceObject = this.controlModel.getProperty(spaceContextPath) as ISpace;
		}

		controlsDisabled =
			prevSelectedObject?.type === selectedObject.type && prevSelectedObject?.id === selectedObject.id ? !controlsDisabled : false;
		colorPalette.setBlocked(controlsDisabled ? true : (spaceObject?.applyColorToAllPages as boolean));
		searchField.setBlocked(controlsDisabled);
		iconList.setBlocked(controlsDisabled);
		switchControl.setBlocked(controlsDisabled);

		this.controlModel.setProperty("/selectedSpacePage", selectedObject);
		this.selectedContext = bindingContext;
	}

	/**
	 * Prepare icon list.
	 *
	 * @private
	 */
	private prepareIconList(): void {
		interface IiconList {
			title: string;
			icon: string;
			tags: string;
			categoryId: string;
		}
		const iconList = this.controlModel.getProperty("/iconList") as IiconList[];
		if (!iconList.length) {
			let icon: string;
			const aIcons: IiconList[] = [];
			Object.keys(ICONS).forEach((oIconCategory) => {
				Object.keys(ICONS[oIconCategory].icons).forEach(function (oIcon) {
					switch (oIconCategory) {
						case "SAP-icons":
							icon = "sap-icon://" + oIcon;
							break;
						case "SAP-icons-TNT":
							icon = "sap-icon://" + oIconCategory + "/" + oIcon;
							break;
						case "BusinessSuiteInAppSymbols":
							icon = "sap-icon://" + oIconCategory + "/icon-" + oIcon;
							break;
					}
					aIcons.push({
						title: oIcon,
						icon: icon,
						tags: ICONS[oIconCategory].icons[oIcon].concat([oIcon]).toString(),
						categoryId: oIconCategory
					});
				});
			});
			this.controlModel.setProperty("/iconList", aIcons);
		}
	}

	/**
	 * Handle Icon Search.
	 *
	 * @param {Event} oEvent The event object.
	 * @private
	 */
	private handleIconSearch(oEvent: SearchField$LiveChangeEvent): void {
		const sQuery = oEvent.getSource().getValue();
		const aFilters = [];
		if (sQuery && sQuery.length > 0) {
			aFilters.push(new Filter("tags", FilterOperator.Contains, sQuery));
		}
		const oList = this.controlMap.get(`${this.getId()}-iconList`) as List;
		const oBinding = oList.getBinding("items") as JSONListBinding;
		oBinding?.filter(aFilters);
	}

	/**
	 * Handle Color Select.
	 *
	 * @param {Event} oEvent The event object.
	 * @private
	 */
	private _handleColorSelect(oEvent: ColorPalette$ColorSelectEvent | null, color?: string): void {
		const selectedColor = (oEvent?.getParameter("value") as string) || color || "";
		const selectedObject = this.selectedContext.getObject() as ISpace | IPage;
		const isSpaceColorChanged = !(selectedObject as IPage).spaceId;
		const legendColor = this._convertColorToLegend(selectedColor);
		const oldLegendColor = (selectedObject?.BGColor as { key: string })?.key;

		// Handle color change for space
		if (isSpaceColorChanged) {
			const spaceObject: ISpace = selectedObject as ISpace;
			//Check if existing personalization is available
			const oExistingChange = this.keyuserSpaceColorChanges.find((changes) => {
				return changes.spaceId === spaceObject.id;
			});
			if (oExistingChange) {
				oExistingChange.BGColor = legendColor;
				oExistingChange.applyColorToAllPages = spaceObject.applyColorToAllPages as boolean;
				oExistingChange.oldApplyColorToAllPages = spaceObject.persistedApplyColorToAllPages as boolean;
			} else {
				this.keyuserSpaceColorChanges.push({
					spaceId: spaceObject.id,
					BGColor: legendColor,
					oldColor: oldLegendColor,
					applyColorToAllPages: spaceObject.applyColorToAllPages,
					oldApplyColorToAllPages: spaceObject.persistedApplyColorToAllPages
				});
			}

			// Apply color to all pages
			if (spaceObject.applyColorToAllPages) {
				this._applyInnerPageColoring(spaceObject, legendColor, selectedColor, true);
			}

			// Update View Model
			this.controlModel.setProperty("BGColor/key", legendColor, this.selectedContext);
			this.controlModel.setProperty("BGColor/value", selectedColor, this.selectedContext);
			this.controlModel.setProperty("isSpacePersonalization", true, this.selectedContext);
		} else {
			// Handle color change for page
			const pageObject: IPage = selectedObject as IPage;
			// Check if existing personalization is available
			const oExistingChange = this.keyuserPageColorChanges.find((changes) => {
				return changes.pageId === pageObject.id;
			});

			const spaceObject = (this.controlModel.getProperty("/spaces") as ISpace[]).find((oSpace: ISpace) => {
				return oSpace.id === pageObject.spaceId;
			});
			const isSpaceColorChangedBefore = spaceObject?.isSpacePersonalization;
			const existingSpacePersData = this.keyuserSpaceColorChanges.find((changes) => {
				return changes.spaceId === spaceObject?.id;
			});

			if (oExistingChange) {
				oExistingChange.BGColor = legendColor;
			} else {
				this.keyuserPageColorChanges.push({
					pageId: pageObject.id,
					spaceId: pageObject.spaceId,
					BGColor: legendColor,
					oldColor:
						isSpaceColorChangedBefore && !pageObject.isPagePersonalization
							? (existingSpacePersData as { oldColor: string })?.oldColor
							: oldLegendColor
				});
			}

			// Update View Model
			this.controlModel.setProperty("BGColor/key", legendColor, this.selectedContext);
			this.controlModel.setProperty("BGColor/value", selectedColor, this.selectedContext);
			this.controlModel.setProperty("isPagePersonalization", true, this.selectedContext);
		}
	}

	/**
	 * Handle Icon Select.
	 *
	 * @param {Event} oEvent The event object.
	 * @private
	 */
	private _handleIconSelect(listItem: StandardListItem): void {
		const sIcon = listItem.getIcon();
		const selectedObject = this.selectedContext.getObject() as ISpace | IPage;
		const isSpaceIconChanged = !(selectedObject as IPage).spaceId;

		// Handle icon change for space
		if (isSpaceIconChanged) {
			const spaceObject = selectedObject as ISpace;
			// Check if existing personalization is available
			const oExistingChange = this.keyuserSpaceIconChanges.find((change) => change.spaceId === spaceObject.id);
			if (oExistingChange) {
				oExistingChange.icon = sIcon;
			} else {
				this.keyuserSpaceIconChanges.push({
					spaceId: spaceObject.id,
					icon: sIcon,
					oldIcon: spaceObject.icon
				});
			}

			// Apply icon to all pages if page icon is not personalized
			const filteredPages = this._getInnerPages(spaceObject).filter((spaceObject) => !spaceObject.page.isPageIconPersonalization);
			filteredPages.forEach((page) => {
				this.controlModel.setProperty(page.bindingPath + "/icon", sIcon);
			});

			// Update View Model
			this.controlModel.setProperty("icon", sIcon, this.selectedContext);
			this.controlModel.setProperty("isSpaceIconPersonalization", true, this.selectedContext);
		} else {
			// Handle icon change for page
			const pageObject = selectedObject as IPage;
			// Check if existing personalization is available
			const oExistingChange = this.keyuserPageIconChanges.find((change) => change.pageId === pageObject.id);

			const spaceObject = (this.controlModel.getProperty("/spaces") as ISpace[]).find((oSpace: ISpace) => {
				return oSpace.id === pageObject.spaceId;
			});
			const isSpaceIconChangedBefore = spaceObject?.isSpaceIconPersonalization;
			const existingSpacePersData = this.keyuserSpaceIconChanges.find((changes) => {
				return changes.spaceId === spaceObject?.id;
			});

			if (oExistingChange) {
				oExistingChange.icon = sIcon;
			} else {
				this.keyuserPageIconChanges.push({
					pageId: pageObject.id,
					spaceId: pageObject.spaceId,
					icon: sIcon,
					oldIcon:
						isSpaceIconChangedBefore && !pageObject.isPageIconPersonalization
							? existingSpacePersData?.oldIcon
							: selectedObject.icon
				});
			}

			// Update View Model
			this.controlModel.setProperty("icon", sIcon, this.selectedContext);
			this.controlModel.setProperty("isPageIconPersonalization", true, this.selectedContext);
		}
	}

	/**
	 * Convert color to legend.
	 *
	 * @param {string} sColor The color to convert.
	 * @returns {string} The converted color.
	 * @private
	 */
	private _convertColorToLegend(color: string): string {
		let oLegendColor = END_USER_COLORS().find(function (endUserColor) {
			return endUserColor.value === color;
		});
		return oLegendColor ? oLegendColor.key : DEFAULT_BG_COLOR().key;
	}

	/**
	 * Handle Switch Change.
	 *
	 * @param {Event} oEvent The event object.
	 * @private
	 */
	private _handleSwitchChange(oEvent: Switch$ChangeEvent): void {
		const selectedObject = this.selectedContext.getObject() as ISpace;
		const switchValue = oEvent.getParameter("state");

		//Check if existing personalization is available
		const oExistingChange = this.keyuserSpaceColorChanges.find((changes) => {
			return changes.spaceId === selectedObject.id;
		});

		if (oExistingChange) {
			oExistingChange.applyColorToAllPages = selectedObject.applyColorToAllPages as boolean;
		} else {
			this._handleColorSelect(null, selectedObject.BGColor?.value as string);
		}

		const colorKey = switchValue ? (selectedObject.BGColor?.key as string) : DEFAULT_BG_COLOR().key;
		const colorValue = switchValue ? (selectedObject.BGColor?.value as string) : DEFAULT_BG_COLOR().value;

		// Apply color to all pages
		this._applyInnerPageColoring(selectedObject, colorKey, colorValue as string, switchValue as boolean);
	}

	/**
	 * Apply inner page coloring.
	 *
	 * @param {ISpace} oSpace The space object.
	 * @param {string} sColorKey The color key.
	 * @param {string} sColorValue The color value.
	 * @param {boolean} bApplyColorToAllPages The flag to apply color to all pages.
	 * @private
	 */
	private _applyInnerPageColoring(oSpace: ISpace, sColorKey: string, sColorValue: string, bApplyColorToAllPages: boolean): void {
		const innerPages = this._getInnerPages(oSpace);

		innerPages.forEach((oPage) => {
			if (!bApplyColorToAllPages && oPage.page.isPagePersonalization) {
				const oExistingChange = this.keyuserPageColorChanges.find(function (oChange) {
					return oChange.pageId === oPage.page.id;
				});
				if (oExistingChange) {
					const BGColor = oExistingChange.BGColor;
					this.controlModel.setProperty(oPage.bindingPath + "/BGColor/key", BGColor);
					this.controlModel.setProperty(oPage.bindingPath + "/BGColor/value", Parameters.get({ name: BGColor as string }));
				} else {
					this.controlModel.setProperty(oPage.bindingPath + "/BGColor/key", (oPage.page.oldColor as IColor)?.key);
					this.controlModel.setProperty(oPage.bindingPath + "/BGColor/value", (oPage.page.oldColor as IColor)?.value);
				}
			} else {
				this.controlModel.setProperty(oPage.bindingPath + "/BGColor/key", sColorKey);
				this.controlModel.setProperty(oPage.bindingPath + "/BGColor/value", sColorValue);
			}
		});
	}

	/**
	 * Get Inner Pages of Space.
	 *
	 * @returns {ISpace} Space.
	 * @private
	 */

	private _getInnerPages(oSpace: ISpace) {
		return oSpace.children.map((oPage, index) => {
			return {
				page: oPage,
				bindingPath: this.selectedContext.getPath() + "/children/" + index
			};
		});
	}

	/**
	 * Merge Key User Changes.
	 *
	 * @private
	 */
	private _mergeKeyUserChanges(): void {
		const pagePanel = this._getPanel() as PagePanel;
		const wrapperContainer = pagePanel.getParent() as NewsAndPagesContainer;
		const layout = wrapperContainer.getParent() as BaseLayout;

		// Add Space Color Changes to KeyUser Changes
		if (this.keyuserSpaceColorChanges.length) {
			const keyuserSpaceColorChanges: IKeyUserChange = {
				selectorControl: layout,
				changeSpecificData: {
					changeType: CHANGE_TYPES.SPACE_COLOR,
					content: [...this.keyuserSpaceColorChanges]
				}
			};
			this.addKeyUserChanges(keyuserSpaceColorChanges);
		}

		// Add Page Color Changes to KeyUser Changes
		if (this.keyuserPageColorChanges.length) {
			const keyuserPageColorChanges: IKeyUserChange = {
				selectorControl: layout,
				changeSpecificData: {
					changeType: CHANGE_TYPES.PAGE_COLOR,
					content: [...this.keyuserPageColorChanges]
				}
			};
			this.addKeyUserChanges(keyuserPageColorChanges);
		}

		// Add Space Icon Changes to KeyUser Changes
		if (this.keyuserSpaceIconChanges.length) {
			const keyuserSpaceIconChanges: IKeyUserChange = {
				selectorControl: layout,
				changeSpecificData: {
					changeType: CHANGE_TYPES.SPACE_ICON,
					content: [...this.keyuserSpaceIconChanges]
				}
			};
			this.addKeyUserChanges(keyuserSpaceIconChanges);
		}

		// Add Page Icon Changes to KeyUser Changes
		if (this.keyuserPageIconChanges.length) {
			const keyuserPageIconChanges: IKeyUserChange = {
				selectorControl: layout,
				changeSpecificData: {
					changeType: CHANGE_TYPES.PAGE_ICON,
					content: [...this.keyuserPageIconChanges]
				}
			};
			this.addKeyUserChanges(keyuserPageIconChanges);
		}
	}

	/**
	 * Handle Dialog Close.
	 *
	 * @private
	 */
	private _handleDialogClose(): void {
		this._mergeKeyUserChanges();
		// Add All Changes to KeyUser Dialog
		this._eventBus.publish("KeyUserChanges", "addNewsPagesChanges", { changes: this.getKeyUserChanges() });

		const dialogId = `${this.getId()}-keyUserPagesSettingsDialog`;
		(this.controlMap.get(dialogId) as Dialog).close();
	}
}
