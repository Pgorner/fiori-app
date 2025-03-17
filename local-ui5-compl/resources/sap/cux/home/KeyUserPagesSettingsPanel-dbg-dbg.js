/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/Button", "sap/m/ColorPalette", "sap/m/Dialog", "sap/m/FlexBox", "sap/m/FlexItemData", "sap/m/HBox", "sap/m/Label", "sap/m/List", "sap/m/ScrollContainer", "sap/m/SearchField", "sap/m/StandardListItem", "sap/m/Switch", "sap/m/Text", "sap/m/Title", "sap/m/VBox", "sap/ui/core/EventBus", "sap/ui/core/Icon", "sap/ui/core/theming/Parameters", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/json/JSONModel", "sap/ui/table/Column", "sap/ui/table/TreeTable", "./BaseSettingsPanel", "./flexibility/Layout.flexibility", "./utils/Constants", "./utils/IconList", "./utils/PageManager", "./utils/PersonalisationUtils"], function (Button, ColorPalette, Dialog, FlexBox, FlexItemData, HBox, Label, List, ScrollContainer, SearchField, StandardListItem, Switch, Text, Title, VBox, EventBus, Icon, Parameters, Filter, FilterOperator, JSONModel, Column, TreeTable, __BaseSettingsPanel, ___flexibility_Layoutflexibility, ___utils_Constants, ___utils_IconList, __PageManager, __PersonalisationUtils) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseSettingsPanel = _interopRequireDefault(__BaseSettingsPanel);
  const CHANGE_TYPES = ___flexibility_Layoutflexibility["CHANGE_TYPES"];
  const DEFAULT_BG_COLOR = ___utils_Constants["DEFAULT_BG_COLOR"];
  const END_USER_COLORS = ___utils_Constants["END_USER_COLORS"];
  const FALLBACK_ICON = ___utils_Constants["FALLBACK_ICON"];
  const KEYUSER_SETTINGS_PANELS_KEYS = ___utils_Constants["KEYUSER_SETTINGS_PANELS_KEYS"];
  const ICONS = ___utils_IconList["ICONS"];
  const PageManager = _interopRequireDefault(__PageManager);
  const PersonalisationUtils = _interopRequireDefault(__PersonalisationUtils);
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
  const KeyUserPagesSettingsPanel = BaseSettingsPanel.extend("sap.cux.home.KeyUserPagesSettingsPanel", {
    constructor: function constructor() {
      BaseSettingsPanel.prototype.constructor.apply(this, arguments);
      this.keyuserSpaceColorChanges = [];
      this.keyuserPageColorChanges = [];
      this.keyuserSpaceIconChanges = [];
      this.keyuserPageIconChanges = [];
    },
    metadata: {
      library: "sap.cux.home"
    },
    /**
     * Init lifecycle method
     *
     * @public
     * @override
     */
    init: function _init() {
      BaseSettingsPanel.prototype.init.call(this);
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
    },
    /**
     * Returns the content for the KeyUser Pages Settings Panel.
     *
     * @private
     * @returns {VBox} The control containing the KeyUser Pages Settings Panel content.
     */
    getContent: function _getContent() {
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
      return this.controlMap.get(dialogId);
    },
    /**
     * Load settings for the panel.
     *
     * @private
     */
    loadSettings: function _loadSettings() {
      if (!this.pageManagerInstance) {
        this.pageManagerInstance = PageManager.getInstance(PersonalisationUtils.getPersContainerId(this._getPanel()), PersonalisationUtils.getOwnerComponent(this._getPanel()));
      }
      // setup layout content
      void this.prepareSpacesPagesData();
      this.prepareIconList();
    },
    /**
     * Add Dialog Content.
     *
     * @private
     */
    addDialogContent: function _addDialogContent() {
      const dialog = this.controlMap.get(`${this.getId()}-keyUserPagesSettingsDialog`);
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
    },
    /**
     * Get Space Pages List Items.
     *
     * @private
     * @returns {FlexBox} The control containing the Space Pages List Items.
     */
    getSpacePagesListItems: function _getSpacePagesListItems() {
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
        columns: [new Column({
          template: new HBox({
            alignItems: "Center",
            justifyContent: "SpaceBetween",
            width: "100%",
            items: [new Text({
              text: "{label}"
            }), new HBox({
              alignItems: "Center",
              items: [new Icon({
                tooltip: "{label}",
                src: "{icon}",
                backgroundColor: "{BGColor/value}",
                width: "2.5rem",
                height: "2.5rem",
                size: "1.5rem",
                color: "white"
              }).addStyleClass("sapUiTinyMargin")]
            })]
          })
        })]
      }).addStyleClass("spacePageTable");
      this.controlMap.set(treeTableId, treeTable);
      treeTableWrapper.addItem(treeTable);
      flexBox.addItem(treeTableWrapper);
      return flexBox;
    },
    /**
     * Get details view for the selected space or page.
     *
     * @private
     * @returns {FlexBox} The control containing the Details.
     */
    getDetailsView: function _getDetailsView() {
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
    },
    /**
     * Get Color Palette.
     *
     * @private
     * @returns {VBox} The control containing the Color Palette.
     */
    getColorPalette: function _getColorPalette() {
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
        text: "{= ${/selectedSpacePage/type} === 'Space' ? '" + this._i18nBundle.getText("space") + "' : '" + this._i18nBundle.getText("page") + "' }"
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
        colors: END_USER_COLORS().map(color => color.value),
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
    },
    /**
     * Get Icon List.
     *
     * @private
     * @returns {VBox} The control containing the Icon List.
     */
    getIconList: function _getIconList() {
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
            press: event => this._handleIconSelect(event.getSource()),
            iconDensityAware: false,
            iconInset: false
          })
        }
      });
      this.controlMap.set(iconListId, iconList);
      iconListScrollContainer.addContent(iconList);
      return wrapperVBox;
    },
    /**
     * Prepare spaces and pages data.
     *
     * @private
     */
    prepareSpacesPagesData: function _prepareSpacesPagesData() {
      try {
        const _this = this;
        return Promise.resolve(_this.pageManagerInstance.fetchAllAvailableSpaces()).then(function (aSpaces) {
          if (!Array.isArray(aSpaces)) {
            return;
          }
          //Prepare Spaces and Pages Data
          aSpaces.forEach(oSpace => {
            oSpace.BGColor = oSpace.BGColor ? _this.refreshColor(oSpace.BGColor) : DEFAULT_BG_COLOR();
            oSpace.isSpacePersonalization = oSpace.BGColor || oSpace.icon ? true : false;
            oSpace.icon = oSpace.icon || FALLBACK_ICON;
            oSpace.persistedApplyColorToAllPages = oSpace.applyColorToAllPages;
            oSpace.children.forEach(oPage => {
              if (oSpace.applyColorToAllPages) {
                oPage.BGColor = _this.refreshColor(oSpace.BGColor);
                oPage.oldColor = oPage.isPagePersonalization ? _this.refreshColor(oPage.oldColor) : DEFAULT_BG_COLOR();
              } else {
                oPage.BGColor = oPage.BGColor ? _this.refreshColor(oPage.BGColor) : DEFAULT_BG_COLOR();
              }
              oPage.spaceId = oSpace.id;
              oPage.personalizationState = oPage.isPagePersonalization;
              oPage.iconPersonalizationState = oPage.isPageIconPersonalization;
              oPage.icon = oPage.icon || oSpace.icon || FALLBACK_ICON;
            });
          });
          _this.controlModel.setProperty("/spaces", aSpaces);
          // Select the first item in list selected by default
          const treeTable = _this.controlMap.get(`${_this.getId()}-spacePagesTreeTable`);
          const selectedIndices = treeTable.getSelectedIndices();
          if (!selectedIndices.includes(0)) {
            treeTable.setSelectedIndex(0);
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Refresh color.
     *
     * @param {string} sColor The color to refresh.
     * @returns {string} The refreshed color.
     */
    refreshColor: function _refreshColor(oColorObject) {
      // Refresh color object with new color value in case of theme switching.
      const newObject = {
        ...oColorObject
      };
      newObject.value = Parameters.get({
        name: oColorObject.key
      });
      return newObject;
    },
    /**
     * Handle Tree Table Row Selection.
     *
     * @param {Event} oEvent The event object.
     * @private
     */
    handleTreeTableRowSelection: function _handleTreeTableRowSelection(oEvent) {
      const bindingContext = oEvent.getParameter("rowContext");
      const selectedObject = bindingContext?.getObject();
      const prevSelectedObject = this.controlModel.getProperty("/selectedSpacePage");
      const colorPalette = this.controlMap.get(`${this.getId()}-colorPalette`); // setBlocked is not available in ColorPalette
      const searchField = this.controlMap.get(`${this.getId()}-iconListSearchField`); // setBlocked is not available in SearchField
      const iconList = this.controlMap.get(`${this.getId()}-iconList`); // setBlocked is not available in List
      const switchControl = this.controlMap.get(`${this.getId()}-Switch`); // setBlocked is not available in Switch
      let spaceObject = undefined;
      let controlsDisabled = colorPalette.getBlocked();
      if (selectedObject.type === "Page") {
        const contextPath = bindingContext.getPath();
        const spaceContextPath = contextPath.replace(/\/children\/\d*/, "");
        spaceObject = this.controlModel.getProperty(spaceContextPath);
      }
      controlsDisabled = prevSelectedObject?.type === selectedObject.type && prevSelectedObject?.id === selectedObject.id ? !controlsDisabled : false;
      colorPalette.setBlocked(controlsDisabled ? true : spaceObject?.applyColorToAllPages);
      searchField.setBlocked(controlsDisabled);
      iconList.setBlocked(controlsDisabled);
      switchControl.setBlocked(controlsDisabled);
      this.controlModel.setProperty("/selectedSpacePage", selectedObject);
      this.selectedContext = bindingContext;
    },
    /**
     * Prepare icon list.
     *
     * @private
     */
    prepareIconList: function _prepareIconList() {
      const iconList = this.controlModel.getProperty("/iconList");
      if (!iconList.length) {
        let icon;
        const aIcons = [];
        Object.keys(ICONS).forEach(oIconCategory => {
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
    },
    /**
     * Handle Icon Search.
     *
     * @param {Event} oEvent The event object.
     * @private
     */
    handleIconSearch: function _handleIconSearch(oEvent) {
      const sQuery = oEvent.getSource().getValue();
      const aFilters = [];
      if (sQuery && sQuery.length > 0) {
        aFilters.push(new Filter("tags", FilterOperator.Contains, sQuery));
      }
      const oList = this.controlMap.get(`${this.getId()}-iconList`);
      const oBinding = oList.getBinding("items");
      oBinding?.filter(aFilters);
    },
    /**
     * Handle Color Select.
     *
     * @param {Event} oEvent The event object.
     * @private
     */
    _handleColorSelect: function _handleColorSelect(oEvent, color) {
      const selectedColor = oEvent?.getParameter("value") || color || "";
      const selectedObject = this.selectedContext.getObject();
      const isSpaceColorChanged = !selectedObject.spaceId;
      const legendColor = this._convertColorToLegend(selectedColor);
      const oldLegendColor = selectedObject?.BGColor?.key;

      // Handle color change for space
      if (isSpaceColorChanged) {
        const spaceObject = selectedObject;
        //Check if existing personalization is available
        const oExistingChange = this.keyuserSpaceColorChanges.find(changes => {
          return changes.spaceId === spaceObject.id;
        });
        if (oExistingChange) {
          oExistingChange.BGColor = legendColor;
          oExistingChange.applyColorToAllPages = spaceObject.applyColorToAllPages;
          oExistingChange.oldApplyColorToAllPages = spaceObject.persistedApplyColorToAllPages;
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
        const pageObject = selectedObject;
        // Check if existing personalization is available
        const oExistingChange = this.keyuserPageColorChanges.find(changes => {
          return changes.pageId === pageObject.id;
        });
        const spaceObject = this.controlModel.getProperty("/spaces").find(oSpace => {
          return oSpace.id === pageObject.spaceId;
        });
        const isSpaceColorChangedBefore = spaceObject?.isSpacePersonalization;
        const existingSpacePersData = this.keyuserSpaceColorChanges.find(changes => {
          return changes.spaceId === spaceObject?.id;
        });
        if (oExistingChange) {
          oExistingChange.BGColor = legendColor;
        } else {
          this.keyuserPageColorChanges.push({
            pageId: pageObject.id,
            spaceId: pageObject.spaceId,
            BGColor: legendColor,
            oldColor: isSpaceColorChangedBefore && !pageObject.isPagePersonalization ? existingSpacePersData?.oldColor : oldLegendColor
          });
        }

        // Update View Model
        this.controlModel.setProperty("BGColor/key", legendColor, this.selectedContext);
        this.controlModel.setProperty("BGColor/value", selectedColor, this.selectedContext);
        this.controlModel.setProperty("isPagePersonalization", true, this.selectedContext);
      }
    },
    /**
     * Handle Icon Select.
     *
     * @param {Event} oEvent The event object.
     * @private
     */
    _handleIconSelect: function _handleIconSelect(listItem) {
      const sIcon = listItem.getIcon();
      const selectedObject = this.selectedContext.getObject();
      const isSpaceIconChanged = !selectedObject.spaceId;

      // Handle icon change for space
      if (isSpaceIconChanged) {
        const spaceObject = selectedObject;
        // Check if existing personalization is available
        const oExistingChange = this.keyuserSpaceIconChanges.find(change => change.spaceId === spaceObject.id);
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
        const filteredPages = this._getInnerPages(spaceObject).filter(spaceObject => !spaceObject.page.isPageIconPersonalization);
        filteredPages.forEach(page => {
          this.controlModel.setProperty(page.bindingPath + "/icon", sIcon);
        });

        // Update View Model
        this.controlModel.setProperty("icon", sIcon, this.selectedContext);
        this.controlModel.setProperty("isSpaceIconPersonalization", true, this.selectedContext);
      } else {
        // Handle icon change for page
        const pageObject = selectedObject;
        // Check if existing personalization is available
        const oExistingChange = this.keyuserPageIconChanges.find(change => change.pageId === pageObject.id);
        const spaceObject = this.controlModel.getProperty("/spaces").find(oSpace => {
          return oSpace.id === pageObject.spaceId;
        });
        const isSpaceIconChangedBefore = spaceObject?.isSpaceIconPersonalization;
        const existingSpacePersData = this.keyuserSpaceIconChanges.find(changes => {
          return changes.spaceId === spaceObject?.id;
        });
        if (oExistingChange) {
          oExistingChange.icon = sIcon;
        } else {
          this.keyuserPageIconChanges.push({
            pageId: pageObject.id,
            spaceId: pageObject.spaceId,
            icon: sIcon,
            oldIcon: isSpaceIconChangedBefore && !pageObject.isPageIconPersonalization ? existingSpacePersData?.oldIcon : selectedObject.icon
          });
        }

        // Update View Model
        this.controlModel.setProperty("icon", sIcon, this.selectedContext);
        this.controlModel.setProperty("isPageIconPersonalization", true, this.selectedContext);
      }
    },
    /**
     * Convert color to legend.
     *
     * @param {string} sColor The color to convert.
     * @returns {string} The converted color.
     * @private
     */
    _convertColorToLegend: function _convertColorToLegend(color) {
      let oLegendColor = END_USER_COLORS().find(function (endUserColor) {
        return endUserColor.value === color;
      });
      return oLegendColor ? oLegendColor.key : DEFAULT_BG_COLOR().key;
    },
    /**
     * Handle Switch Change.
     *
     * @param {Event} oEvent The event object.
     * @private
     */
    _handleSwitchChange: function _handleSwitchChange(oEvent) {
      const selectedObject = this.selectedContext.getObject();
      const switchValue = oEvent.getParameter("state");

      //Check if existing personalization is available
      const oExistingChange = this.keyuserSpaceColorChanges.find(changes => {
        return changes.spaceId === selectedObject.id;
      });
      if (oExistingChange) {
        oExistingChange.applyColorToAllPages = selectedObject.applyColorToAllPages;
      } else {
        this._handleColorSelect(null, selectedObject.BGColor?.value);
      }
      const colorKey = switchValue ? selectedObject.BGColor?.key : DEFAULT_BG_COLOR().key;
      const colorValue = switchValue ? selectedObject.BGColor?.value : DEFAULT_BG_COLOR().value;

      // Apply color to all pages
      this._applyInnerPageColoring(selectedObject, colorKey, colorValue, switchValue);
    },
    /**
     * Apply inner page coloring.
     *
     * @param {ISpace} oSpace The space object.
     * @param {string} sColorKey The color key.
     * @param {string} sColorValue The color value.
     * @param {boolean} bApplyColorToAllPages The flag to apply color to all pages.
     * @private
     */
    _applyInnerPageColoring: function _applyInnerPageColoring(oSpace, sColorKey, sColorValue, bApplyColorToAllPages) {
      const innerPages = this._getInnerPages(oSpace);
      innerPages.forEach(oPage => {
        if (!bApplyColorToAllPages && oPage.page.isPagePersonalization) {
          const oExistingChange = this.keyuserPageColorChanges.find(function (oChange) {
            return oChange.pageId === oPage.page.id;
          });
          if (oExistingChange) {
            const BGColor = oExistingChange.BGColor;
            this.controlModel.setProperty(oPage.bindingPath + "/BGColor/key", BGColor);
            this.controlModel.setProperty(oPage.bindingPath + "/BGColor/value", Parameters.get({
              name: BGColor
            }));
          } else {
            this.controlModel.setProperty(oPage.bindingPath + "/BGColor/key", oPage.page.oldColor?.key);
            this.controlModel.setProperty(oPage.bindingPath + "/BGColor/value", oPage.page.oldColor?.value);
          }
        } else {
          this.controlModel.setProperty(oPage.bindingPath + "/BGColor/key", sColorKey);
          this.controlModel.setProperty(oPage.bindingPath + "/BGColor/value", sColorValue);
        }
      });
    },
    /**
     * Get Inner Pages of Space.
     *
     * @returns {ISpace} Space.
     * @private
     */
    _getInnerPages: function _getInnerPages(oSpace) {
      return oSpace.children.map((oPage, index) => {
        return {
          page: oPage,
          bindingPath: this.selectedContext.getPath() + "/children/" + index
        };
      });
    },
    /**
     * Merge Key User Changes.
     *
     * @private
     */
    _mergeKeyUserChanges: function _mergeKeyUserChanges() {
      const pagePanel = this._getPanel();
      const wrapperContainer = pagePanel.getParent();
      const layout = wrapperContainer.getParent();

      // Add Space Color Changes to KeyUser Changes
      if (this.keyuserSpaceColorChanges.length) {
        const keyuserSpaceColorChanges = {
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
        const keyuserPageColorChanges = {
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
        const keyuserSpaceIconChanges = {
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
        const keyuserPageIconChanges = {
          selectorControl: layout,
          changeSpecificData: {
            changeType: CHANGE_TYPES.PAGE_ICON,
            content: [...this.keyuserPageIconChanges]
          }
        };
        this.addKeyUserChanges(keyuserPageIconChanges);
      }
    },
    /**
     * Handle Dialog Close.
     *
     * @private
     */
    _handleDialogClose: function _handleDialogClose() {
      this._mergeKeyUserChanges();
      // Add All Changes to KeyUser Dialog
      this._eventBus.publish("KeyUserChanges", "addNewsPagesChanges", {
        changes: this.getKeyUserChanges()
      });
      const dialogId = `${this.getId()}-keyUserPagesSettingsDialog`;
      this.controlMap.get(dialogId).close();
    }
  });
  return KeyUserPagesSettingsPanel;
});
//# sourceMappingURL=KeyUserPagesSettingsPanel-dbg-dbg.js.map
