/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../i18n", "sap/esh/search/ui/SearchHelper", "sap/esh/search/ui/SearchFacetDialogHelper", "sap/esh/search/ui/SearchFacetDialogHelper_SearchAdvancedCondition_ModuleLoader", "sap/esh/search/ui/SearchFacetDialogHelperCharts", "sap/esh/search/ui/controls/SearchAdvancedCondition", "sap/esh/search/ui/FacetItem", "sap/m/library", "sap/m/Page", "sap/m/Dialog", "sap/m/Select", "sap/m/CheckBox", "sap/m/SearchField", "sap/m/ToggleButton", "sap/m/Button", "sap/m/StandardListItem", "sap/m/SplitContainer", "sap/ui/core/Item", "sap/m/List", "sap/m/HBox", "sap/m/VBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/ScrollContainer", "sap/m/Toolbar", "sap/m/IconTabBar", "sap/m/IconTabFilter", "sap/ui/model/json/JSONModel", "sap/esh/search/ui/SearchModel", "../../eventlogging/UserEvents", "../../hierarchydynamic/SearchHierarchyDynamicFacet", "./types/SearchFacetHierarchyDynamic", "./FacetTypeUI", "sap/ui/core/Element", "sap/ui/base/ManagedObject", "sap/base/Log"], function (__i18n, SearchHelper, SearchFacetDialogHelper, SearchFacetDialogHelper_SearchAdvancedCondition_ModuleLoader, SearchFacetDialogHelperCharts, SearchAdvancedCondition, FacetItem, sap_m_library, Page, Dialog, Select, CheckBox, SearchField, ToggleButton, Button, StandardListItem, SplitContainer, Item, List, HBox, VBox, Filter, FilterOperator, ScrollContainer, Toolbar, IconTabBar, IconTabFilter, JSONModel, SearchModel, ____eventlogging_UserEvents, __SearchHierarchyDynamicFacet, __SearchFacetHierarchyDynamic, ___FacetTypeUI, Element, ManagedObject, Log) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ButtonType = sap_m_library["ButtonType"];
  const ListMode = sap_m_library["ListMode"];
  const ListSeparators = sap_m_library["ListSeparators"];
  const FlexAlignItems = sap_m_library["FlexAlignItems"];
  const FlexJustifyContent = sap_m_library["FlexJustifyContent"];
  const BackgroundDesign = sap_m_library["BackgroundDesign"];
  const UserEventType = ____eventlogging_UserEvents["UserEventType"];
  const SearchHierarchyDynamicFacet = _interopRequireDefault(__SearchHierarchyDynamicFacet);
  const SearchFacetHierarchyDynamic = _interopRequireDefault(__SearchFacetHierarchyDynamic);
  const FacetTypeUI = ___FacetTypeUI["FacetTypeUI"];
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFacetDialog = Dialog.extend("sap.esh.search.ui.controls.SearchFacetDialog", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      properties: {
        tabBarItems: {
          type: "object" // Array<IconTabFilter>
        },
        selectedAttribute: {
          type: "string"
        },
        selectedTabBarIndex: {
          type: "int"
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const loaderDummy = new SearchFacetDialogHelper_SearchAdvancedCondition_ModuleLoader();
      Dialog.prototype.constructor.call(this, sId, settings);
      const oSettings = typeof sId === "object" ? sId : settings;
      this.bConditionValidateError = false;
      this.bShowCharts = true; // change this to completely turn off charts in show more dialog
      this.bOldPieChart = true;
      this.chartOnDisplayIndex = oSettings.selectedTabBarIndex; // charts
      this.facetOnDisplayIndex = 0; // charts
      this.chartOnDisplayIndexByFilterArray = []; // charts
      this.aItemsForBarChart = []; // charts
      this.SearchFacetDialogHelperCharts = new SearchFacetDialogHelperCharts(this);
      if (!this.getProperty("tabBarItems")) {
        SearchFacetDialogHelperCharts.setDummyTabBarItems(this);
      }
      this.setShowHeader(true);
      this.setTitle(i18n.getText("dialogTitle"));
      this.setHorizontalScrolling(false);
      this.setVerticalScrolling(false);
      this.setContentHeight("35rem");
      this.setBeginButton(new Button({
        text: i18n.getText("okDialogBtn"),
        type: ButtonType.Emphasized,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        press: oEvent => {
          this.onOkClick();
          this.close();
          this.getModel().destroy();
          this.destroy();
        }
      }));
      this.setEndButton(new Button({
        text: i18n.getText("cancelDialogBtn"),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        press: oEvent => {
          this.onCancelClick();
          this.close();
          this.getModel().destroy();
          this.destroy();
        }
      }));
      this.addContent(this.createContainer());
      SearchFacetDialogHelper.init(this);
      this.addStyleClass("sapUshellSearchFacetDialog");
      this.onSearchFieldLiveChangeDelayed = SearchHelper.delayedExecution(this.onSearchFieldLiveChange, 1000);
    },
    createContainer: function _createContainer() {
      // create SplitContainer with masterPages
      this.oSplitContainer = new SplitContainer({
        masterPages: this.createMasterPages()
      });
      // binding detailPages in SplitContainer
      this.oSplitContainer.bindAggregation("detailPages", {
        path: "/facetDialog",
        factory: (sId, oContext) => {
          return this.createDetailPage(sId, oContext);
        }
      });
      this.oSplitContainer.addStyleClass("sapUshellSearchFacetDialogContainer");
      return this.oSplitContainer;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setModel: function _setModel(oModel, sName) {
      // this/SearchFacetDialog not working as return type
      Dialog.prototype.setModel.call(this, oModel, sName);
      if (oModel instanceof SearchModel && typeof oModel.config !== "undefined") {
        if (oModel.config.optimizeForValueHelp) {
          this.addStyleClass("sapUshellSearchFacetDialogValueHelp");
        }
      }
      return this;
    },
    // create masterPages in splitContainer (we only have one master page)
    createMasterPages: function _createMasterPages() {
      // create facet list
      const oFacetList = new List({
        mode: ListMode.SingleSelectMaster,
        selectionChange: oEvent => {
          this.onMasterPageSelectionChange(oEvent);
        }
      });
      oFacetList.addStyleClass("sapUshellSearchFacetDialogFacetList");
      oFacetList.bindItems({
        path: "/facetDialog",
        factory: (sId, oContext) => {
          const facet = oContext.getObject();
          if (facet instanceof SearchHierarchyDynamicFacet) {
            const oListItem = new StandardListItem({
              title: {
                path: "title"
              },
              counter: {
                path: "filterCount"
              },
              visible: {
                path: "visible"
              }
            });
            return oListItem;
          } else {
            const oListItem = new StandardListItem({
              title: {
                path: "title"
              },
              counter: {
                path: "count"
              },
              visible: {
                path: "visible"
              }
            });
            return oListItem;
          }
        }
      });
      // create a scrollContainer, content is the facet list
      const oResetButton = new Button({
        icon: "sap-icon://clear-filter",
        tooltip: i18n.getText("resetFilterButton_tooltip"),
        type: ButtonType.Transparent,
        enabled: {
          path: "/facetDialogOverallCounter"
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        press: oEvent => {
          this.resetAllFilters();
        }
      });
      oResetButton.addStyleClass("sapUshellSearchFacetDialogFilterResetButton");
      const oMasterPage = new Page({
        title: i18n.getText("filters"),
        headerContent: oResetButton,
        content: [oFacetList]
      }).addStyleClass("sapUshellSearchFacetDialogMasterContainer");
      oMasterPage.addEventDelegate({
        onAfterRendering: () => {
          if (this.getProperty("selectedAttribute")) {
            for (let i = 0; i < oFacetList.getItems().length; i++) {
              const oListItem = oFacetList.getItems()[i];
              const oFacetItem = oListItem.getBindingContext().getObject(); // ToDo 'any'
              if (this.getProperty("selectedAttribute") === oFacetItem.dimension) {
                oFacetList.setSelectedItem(oListItem);
                this.facetOnDisplayIndex = i;
                this.chartOnDisplayIndexByFilterArray.push(this.chartOnDisplayIndex); // initial setting of array
              } else {
                let n = 0;
                const ar = oListItem.getBindingContext().getModel().getData().facets;
                for (let j = 0; j < ar.length; j++) {
                  if (ar[j].chartIndex && ar[j].dimension === oFacetItem.dimension && !isNaN(ar[j].chartIndex)) {
                    n = ar[j].chartIndex;
                  }
                }
                this.chartOnDisplayIndexByFilterArray.push(n); // initial setting of array
              }
            }
          }
          if (!oFacetList.getSelectedItem()) {
            oFacetList.setSelectedItem(oFacetList.getItems()[0]);
          }
          const oSelectedItem = oFacetList.getSelectedItem();
          if (oSelectedItem) {
            // can be empty, if no facets are loaded (i.e. value help mode or search model w/o any facets)
            SearchFacetDialogHelper.updateDetailPage(oSelectedItem, null, true);
          }
          this.resetEnabledForFilterResetButton();
        }
      });
      // masterPages has only one page
      return [oMasterPage];
    },
    resetAllFilters: function _resetAllFilters() {
      // if 'show selected on top' is checked, uncheck
      const $checkbox = $(".sapUshellSearchFacetDialogSettingsContainer").find(".sapMCbBg.sapMCbHoverable.sapMCbMark");
      if ($checkbox.length === 1) {
        const id = $checkbox[0].parentNode["id"]; // ToDo
        const oCheckbox = Element.getElementById(id); // ToDo
        oCheckbox.setSelected(false);
        oCheckbox.setEnabled(false);
      }
      const oModel = this.getModel();
      oModel.aFilters = [];
      // none of the above work since selections in all lists are physically counted to addFilterCondition
      SearchFacetDialogHelper.bResetFilterIsActive = true;
      const oMasterPageList = SearchFacetDialogHelper.getFacetList();
      const aFacets = oMasterPageList.getItems();
      for (let j = 0; j < aFacets.length; j++) {
        aFacets[j].setCounter(0);
      }
      this.resetAdvancedConditionFilters();
      SearchFacetDialogHelper.resetChartQueryFilters();
      SearchFacetDialogHelper.updateDetailPage(oMasterPageList.getSelectedItem());
      this.resetEnabledForFilterResetButton();
      SearchFacetDialogHelper.bResetFilterIsActive = false;
    },
    resetAdvancedConditionFilters: function _resetAdvancedConditionFilters() {
      let oAdvancedContainer, condition1, n1, n2, oParent, oChild;
      const oDetailPages = this.oSplitContainer.getDetailPages();
      for (let i = 0; i < oDetailPages.length; i++) {
        const oDetailPage = oDetailPages[i];
        const facet = oDetailPage.getBindingContext().getObject();
        if (facet instanceof SearchHierarchyDynamicFacet) {
          continue;
        }
        n1 = SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER;
        oAdvancedContainer = oDetailPage.getContent()[n1]; //for numbers, dates etc, not strings or texts
        if (oAdvancedContainer) {
          for (let j = oAdvancedContainer.getContent().length - 2; j > 0; j--) {
            condition1 = oAdvancedContainer.getContent()[j];
            oParent = condition1.getParent();
            oChild = condition1;
            oParent.removeContent(oChild);
          }
        } else {
          n1 = SearchFacetDialogHelper.POS_ICONTABBAR;
          n2 = SearchFacetDialogHelper.POS_TABBAR_CONDITION;
          oAdvancedContainer = oDetailPage.getContent()[n1].getItems()[n2].getContent()[0]; // for numbers, dates etc, not strings or texts
          if (oAdvancedContainer) {
            for (let j = oAdvancedContainer.getContent().length - 1; j > -1; j--) {
              condition1 = oAdvancedContainer.getContent()[j];
              if (condition1.getContent && condition1.getContent()[1]) {
                const conditionItem = condition1.getContent()[1].getContent()[1]; //condition1 = [a box, a layout, and an x button]
                const conditionValue = conditionItem.getValue();
                if (conditionValue && ("" + conditionValue).length > 0) {
                  oParent = condition1.getParent();
                  oChild = condition1;
                  oParent.removeContent(oChild);
                }
              }
            }
          }
        }
      }
    },
    resetEnabledForFilterResetButton: function _resetEnabledForFilterResetButton(bForceEnabled) {
      let bFiltersExist = false;
      let overallCounter = 0;
      const oMasterPageList = SearchFacetDialogHelper.getFacetList();
      const aFacets = oMasterPageList.getItems();
      for (let i = 0; i < aFacets.length; i++) {
        overallCounter += aFacets[i].getCounter();
      }
      const oModel = this.getModel();
      if (oModel.aFilters && oModel.aFilters.length > 0 || bForceEnabled || overallCounter > 0) {
        bFiltersExist = true;
      }
      oModel.setProperty("/facetDialogOverallCounter", bFiltersExist);
    },
    // event: select listItems in masterPage
    onMasterPageSelectionChange: function _onMasterPageSelectionChange(oEvent) {
      const oListItem = oEvent.getParameter("listItem");
      this.facetOnDisplayIndex = oListItem.getParent().indexOfItem(oListItem.getParent().getSelectedItem());
      this.setChartOnDisplayIndexForFacetListItem(this.facetOnDisplayIndex);
      const oModel = oListItem.getParent().getModel();
      const sBindingPath = oListItem.getBindingContext().getPath();
      this.resetIcons(oModel, sBindingPath, this);
      SearchFacetDialogHelper.updateDetailPage(oListItem);
      if (this.oSplitContainer.getMode() === "ShowHideMode") {
        this.oSplitContainer.hideMaster();
      }
      this.controlChartVisibility(this, this.chartOnDisplayIndex);
    },
    createDetailPage: function _createDetailPage(sId, oContext) {
      const facet = oContext.getObject();
      switch (facet.facetType) {
        case FacetTypeUI.Attribute:
          return this.createAttributeDetailPage(sId, oContext);
        case FacetTypeUI.Hierarchy:
          return this.createDynamicHierarchyAttributeDetailPage(sId, oContext);
      }
    },
    createDynamicHierarchyAttributeDetailPage: function _createDynamicHierarchyAttributeDetailPage(sId, oContext) {
      const facetControl = new SearchFacetHierarchyDynamic("", {
        showTitle: false
      });
      const facet = oContext.getObject();
      const page = new Page({
        title: facet.title,
        showHeader: true,
        content: [facetControl]
      }).addStyleClass("sapUshellSearchFacetDialogDetailPage").addStyleClass("sapUshellSearchFacetDialogHierarchyTreeDetailPage");
      return page;
    },
    // create pages of 'detailPages' in splitContainer, using data binding
    createAttributeDetailPage: function _createAttributeDetailPage(sId, oContext) {
      const sFacetType = oContext.getModel().getProperty(oContext.getPath()).facetType;
      const sDataType = oContext.getModel()["getAttributeDataType"](oContext.getModel().getProperty(oContext.getPath()));
      // create a settings container with select and checkBox, initial is not visible
      const oSelect = new Select({
        items: [new Item({
          text: i18n.getText("notSorted"),
          key: "notSorted"
        }), new Item({
          text: i18n.getText("sortByCount"),
          key: "sortCount"
        }), new Item({
          text: i18n.getText("sortByName"),
          key: "sortName"
        })],
        selectedKey: sDataType === "string" || sDataType === "text" ? "sortCount" : "notSorted",
        change: oEvent => {
          this.onSelectChange(oEvent);
        }
      }).addStyleClass("sapUshellSearchFacetDialogSettingsSelect");
      const oHBox = new HBox({
        alignItems: FlexAlignItems.End,
        justifyContent: FlexJustifyContent.End,
        items: [oSelect]
      });
      const oCheckBox = new CheckBox({
        text: i18n.getText("showSelectedOnTop"),
        enabled: false,
        select: oEvent => {
          this.onCheckBoxSelect(oEvent);
        }
      });
      const oSettings = new VBox({
        items: [oHBox, oCheckBox]
      }).addStyleClass("sapUshellSearchFacetDialogSettingsContainer");
      oSettings.setVisible(false);
      // create the attribute list for each facet
      const oList = new List({
        backgroundDesign: BackgroundDesign.Transparent,
        includeItemInSelection: true,
        showNoData: false,
        showSeparators: ListSeparators.None,
        selectionChange: oEvent => {
          this.onDetailPageSelectionChange(oEvent);
        }
      });
      oList.addStyleClass("sapUshellSearchFacetDialogDetailPageList");
      oList.addStyleClass("largeChart0");
      if (sFacetType === FacetTypeUI.Attribute) {
        oList.setMode(ListMode.MultiSelect);
      }
      const oBindingInfo = {
        path: "items",
        factory: (sId, oContext) => {
          const oFacetItem = oContext.oModel.getProperty(oContext.sPath);
          const oListItem = new StandardListItem({
            title: {
              path: "label"
            },
            tooltip: i18n.getText("facetListTooltip", [ManagedObject.escapeSettingsValue(oFacetItem.label), ManagedObject.escapeSettingsValue(oFacetItem.valueLabel)]),
            info: {
              path: "valueLabel"
            },
            selected: {
              path: "selected"
            }
          });
          // prepare the local filterConditions array in facet dialog
          if (oFacetItem.selected) {
            oContext.oModel.addFilter(oFacetItem);
          }
          return oListItem;
        }
      };
      if (sDataType === "number" || sDataType === "integer") {
        oSelect.removeItem(2);
      }
      oBindingInfo["filters"] = new Filter("advanced", FilterOperator.NE, true); // ToDo
      oList.bindAggregation("items", oBindingInfo);
      oList.data("dataType", sDataType);
      if (this.bShowCharts) {
        oList.addEventDelegate({
          onAfterRendering: oEvent => {
            this.hideSelectively(oEvent, this, 0);
          }
        });
      }
      let oListContainer, oChartPlaceholder2;
      const oChartPlaceholder1 = SearchFacetDialogHelperCharts.getBarChartPlaceholder();
      oChartPlaceholder1.addEventDelegate({
        onAfterRendering: oEvent => {
          this.hideSelectively(oEvent, this, 1);
        }
      });
      oChartPlaceholder1.data("dataType", sDataType);
      if (this.bOldPieChart) {
        oChartPlaceholder2 = SearchFacetDialogHelperCharts.getPieChartPlaceholder();
      } else {
        oChartPlaceholder2 = {};
      }
      oChartPlaceholder2.addEventDelegate({
        onAfterRendering: oEvent => {
          this.hideSelectively(oEvent, this, 2);
        }
      });
      if (this.bShowCharts && (sDataType === "string" || sDataType === "text")) {
        oListContainer = new ScrollContainer({
          height: "67.2%",
          horizontal: false,
          vertical: true,
          content: [oList, oChartPlaceholder1, oChartPlaceholder2]
        });
      } else {
        oListContainer = new ScrollContainer({
          height: "calc(100% - 0.25rem)",
          horizontal: false,
          vertical: true,
          content: [oList]
        });
        if (sDataType === "number" || sDataType === "integer") {
          oListContainer.addStyleClass("sapUshellSearchFacetDialogDetailPageListContainerNumber");
        } else {
          oListContainer.addStyleClass("sapUshellSearchFacetDialogDetailPageListContainerDate");
        }
      }
      oListContainer.addStyleClass("sapUshellSearchFacetDialogDetailPageListContainer");
      oListContainer.addStyleClass("searchFacetLargeChartContainer");
      oListContainer.setBusyIndicatorDelay(0);
      // create advanced search
      const oAdvancedCondition = new SearchAdvancedCondition("", {
        type: sDataType
      });
      let oPage;
      if (sDataType === "string" || sDataType === "text") {
        const oAdvancedContainer = new ScrollContainer({
          horizontal: false,
          vertical: true,
          content: [oAdvancedCondition]
        });
        oAdvancedContainer.addStyleClass("sapUshellSearchFacetDialogDetailPageAdvancedContainer");
        const oPlusButton = new Button({
          icon: "sap-icon://add",
          type: ButtonType.Transparent,
          press: oEvent => {
            this.onPlusButtonPress(oEvent, sDataType);
          }
        });
        oPlusButton.addStyleClass("sapUshellSearchFacetDialogDetailPageAdvancedContainerPlusButton");
        oAdvancedContainer.addContent(oPlusButton);
        oAdvancedContainer.data("dataType", sDataType);
        oAdvancedContainer.data("initial", true);
        // create a page for type string or text, content include settings container and attribute list, head toolbar has a setting button and a search field
        oListContainer.setHeight("calc(100% - 0.25rem)");
        oAdvancedContainer.setHeight("100%");
        const oChartSelectionButton = SearchFacetDialogHelperCharts.getDropDownButton(this);
        const subheader = new Toolbar({
          content: [new SearchField({
            placeholder: i18n.getText("filterPlaceholder"),
            liveChange: oEvent => {
              this.onSearchFieldLiveChangeDelayed(oEvent["oSource"].getValue()); // ToDo
            }
          }), new ToggleButton({
            icon: "sap-icon://sort",
            press: oEvent => {
              this.onSettingButtonPress(oEvent);
            }
          }).addStyleClass("sapUshellSearchFacetDialogSortButton")]
        }).addStyleClass("sapUshellSearchFacetDialogSubheaderToolbar");
        subheader.addEventDelegate({
          onAfterRendering: () => {
            $(".sapUshellSearchFacetDialogSubheaderToolbar").removeClass("sapContrastPlus");
          }
        });
        if (this.bShowCharts) {
          subheader.addContent(oChartSelectionButton);
        }
        const oTabListPage = new Page({
          showHeader: false,
          subHeader: subheader,
          content: [oSettings, oListContainer]
        }).addStyleClass("sapUshellSearchFacetDialogDetailPage");
        const oIconTabBar = new IconTabBar({
          expandable: false,
          stretchContentHeight: true,
          backgroundDesign: BackgroundDesign.Transparent,
          applyContentPadding: false,
          select: () => {
            this.controlChartVisibility(this, this.chartOnDisplayIndex);
          },
          items: [new IconTabFilter({
            text: i18n.getText("selectFromList"),
            content: [oTabListPage]
          }), new IconTabFilter({
            text: i18n.getText("defineCondition"),
            content: [oAdvancedContainer]
          })]
        });
        oIconTabBar.addStyleClass("sapUshellSearchFacetDialogIconTabBar");
        oPage = new Page({
          showHeader: true,
          title: oContext.getModel().getProperty(oContext.getPath()).title,
          content: [oIconTabBar]
        });
        oPage.addStyleClass("sapUshellSearchFacetDialogDetailPageString");
      } else {
        oListContainer.addContent(oAdvancedCondition);
        oListContainer.data("dataType", sDataType);
        oListContainer.data("initial", true);
        // create a page for type number or date
        if (this.bShowCharts) {
          const title = oContext.getModel().getProperty(oContext.getPath()).title;
          oPage = new Page({
            title: title,
            showHeader: true,
            content: [oSettings, oListContainer]
          });
        } else {
          oPage = new Page({
            showHeader: true,
            title: oContext.getModel().getProperty(oContext.getPath()).title,
            content: [oSettings, oListContainer]
          });
        }
        oPage.addStyleClass("sapUshellSearchFacetDialogDetailPage");
      }
      oPage.addEventDelegate({
        onAfterRendering: () => {
          this.controlChartVisibility(this, this.chartOnDisplayIndex);
        }
      });
      return oPage;
    },
    // event: select listItems in detailPages
    onDetailPageSelectionChange: function _onDetailPageSelectionChange(oEvent) {
      const oSelectedItem = oEvent.getParameter("listItem");
      // update aFilters
      const oFacetItem = oSelectedItem.getBindingContext().getObject();
      const oModel = this.getModel();
      if (oSelectedItem.getSelected()) {
        oFacetItem.listed = true;
        oModel.addFilter(oFacetItem);
      } else {
        oFacetItem.listed = false;
        oModel.removeFilter(oFacetItem);
      }
      // update the count info in masterPageList
      const oList = oEvent.getSource();
      let oDetailPage;
      if (oList.data("dataType") === "string" || oList.data("dataType") === "text") {
        oDetailPage = oList.getParent().getParent().getParent().getParent().getParent().getParent();
      } else {
        oDetailPage = oList.getParent().getParent();
      }
      SearchFacetDialogHelper.updateCountInfo(oDetailPage);
      // deselect setting check box
      const oSettings = oList.getParent().getParent().getContent()[
      // ToDo
      SearchFacetDialogHelper.POS_SETTING_CONTAINER];
      const oCheckbox = oSettings.getItems()[SearchFacetDialogHelper.POS_SHOWONTOP_CHECKBOX];
      const oSelect = oSettings.getItems()[SearchFacetDialogHelper.POS_SORTING_SELECT].getItems()[0];
      if (oCheckbox.getSelected()) {
        oCheckbox.setSelected(false);
        oSelect.setSelectedKey("notSorted");
      }
      if (oList.getSelectedContexts().length > 0) {
        oCheckbox.setEnabled(true);
      } else {
        oCheckbox.setEnabled(false);
      }
    },
    // event: search in detailPages
    onSearchFieldLiveChange: function _onSearchFieldLiveChange(value) {
      const oSelectedItem = SearchFacetDialogHelper.getFacetList().getSelectedItem();
      SearchFacetDialogHelper.updateDetailPage(oSelectedItem, value);
    },
    // event: click setting button
    onSettingButtonPress: function _onSettingButtonPress(oEvent) {
      const oSettingsButton = oEvent.getSource();
      const bPressed = oSettingsButton.getPressed();
      const oSettings = oSettingsButton.getParent().getParent()["getContent"]()[SearchFacetDialogHelper.POS_SETTING_CONTAINER];
      const oListContainer = oSettingsButton.getParent().getParent()["getContent"]()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER];
      if (bPressed) {
        oSettings.setVisible(true);
        oListContainer.setHeight("calc(100% - 4.25rem)");
      } else {
        oSettings.setVisible(false);
        oListContainer.setHeight("calc(100% - 0.25rem)");
      }
    },
    // event: change select box in settings
    onSelectChange: function _onSelectChange(oEvent) {
      const oSelect = oEvent.getSource();
      SearchFacetDialogHelper.sortingAttributeList(oSelect.getParent().getParent().getParent());
    },
    // e­­­­vent: select check box in settings
    onCheckBoxSelect: function _onCheckBoxSelect(oEvent) {
      const oCheckbox = oEvent.getSource();
      SearchFacetDialogHelper.sortingAttributeList(oCheckbox.getParent().getParent());
    },
    // event: advanced condition plus button pressed
    onPlusButtonPress: function _onPlusButtonPress(oEvent, type) {
      const oPlusButton = oEvent.getSource();
      const oAdvancedContainer = oPlusButton.getParent();
      const oNewAdvancedCondition = new SearchAdvancedCondition("", {
        type: type
      });
      const insertIndex = oAdvancedContainer.getContent().length - 1;
      oAdvancedContainer.insertContent(oNewAdvancedCondition, insertIndex);
    },
    // event: click ok button
    onOkClick: function _onOkClick() {
      const oModel = this.getModel();
      const oSearchModel = this.getModel("searchModel");
      oSearchModel.resetFilterByFilterConditions(false);
      const aDetailPages = this.oSplitContainer.getDetailPages();
      // no advanced filter
      for (let m = 0; m < oModel.aFilters.length; m++) {
        const item = oModel.aFilters[m];
        if (!item.advanced || item.listed) {
          oSearchModel.addFilterCondition(item.filterCondition, false);
        }
      }
      // advanced filter
      for (let i = 0; i < aDetailPages.length; i++) {
        const detailPage = aDetailPages[i];
        const facet = detailPage.getBindingContext().getObject();
        if (facet instanceof SearchHierarchyDynamicFacet) {
          continue;
        }
        if (SearchFacetDialogHelper.getFacetList().getItems()[i]) {
          SearchFacetDialogHelper.applyAdvancedCondition(detailPage, SearchFacetDialogHelper.getFacetList().getItems()[i].getBindingContext().getObject(), oSearchModel);
        }
      }
      if (!this.bConditionValidateError) {
        oSearchModel.filterChanged = true;
        oSearchModel.invalidateQuery();
        oSearchModel.fireSearchQuery();
      }
      oSearchModel.eventLogger.logEvent({
        type: UserEventType.FACET_SHOW_MORE_CLOSE
      });
    },
    onCancelClick: function _onCancelClick() {
      const oSearchModel = this.getModel("searchModel");
      oSearchModel.eventLogger.logEvent({
        type: UserEventType.FACET_SHOW_MORE_CLOSE
      });
    },
    setChartOnDisplayIndexForFacetListItem: function _setChartOnDisplayIndexForFacetListItem(facetOnDisplayIndex) {
      let res = 0;
      try {
        res = this.chartOnDisplayIndexByFilterArray[facetOnDisplayIndex];
      } catch (e) {
        Log.warning("Error in setChartOnDisplayIndexForFacetListItem: " + e);
        res = 0;
      }
      if (res === undefined) {
        res = 0;
      }
      this.chartOnDisplayIndex = res;
    },
    // ensure dropdown icons are correct //used in SearchFacetDialogHelper.js:89
    resetIcons: function _resetIcons(oModel, sPath, oControl) {
      let isTextDataType = false;
      const sDataType = oModel.getAttributeDataType(oModel.getProperty(sPath));
      if (this.bShowCharts && (sDataType === "string" || sDataType === "text")) {
        isTextDataType = true;
      }
      const allDropdownbuttons = $(".sapUshellSearchFacetDialogTabBarButton");
      if (isTextDataType) {
        allDropdownbuttons.css("display", "block");
        for (let i = 0; i < allDropdownbuttons.length; i++) {
          const id = allDropdownbuttons[i].id;
          const oDropDownButton = Element.getElementById(id); // ToDo
          // reset the main button
          const btn = oControl.getProperty("tabBarItems")[oControl.chartOnDisplayIndex].getIcon();
          oDropDownButton.setIcon(btn);
          const asWhat = oControl.getProperty("tabBarItems")[oControl.chartOnDisplayIndex].getText();
          // reset the main button tooltip
          const displayAs = i18n.getText("displayAs", [asWhat]); // ToolTipBase
          oDropDownButton.setTooltip(displayAs);
        }
      } else {
        allDropdownbuttons.css("display", "none");
      }
    },
    // event: select chart elements
    onDetailPageSelectionChangeCharts: function _onDetailPageSelectionChangeCharts(oEvent) {
      let cnt = 0;
      let context, model, data, isSelected, becomesSelected, oSelectedItem, sSelectedBindingPath, oFacetItem, sPath;
      let itemIndex, ar, oNode, oMasterPageListItem;
      if (oEvent.getSource && oEvent.getId() === "press") {
        context = oEvent.getSource().getBindingContext();
        model = context.getModel();
        data = context.getObject();
        isSelected = data.selected;
        becomesSelected = !isSelected;
        // first set the selected value in model
        oSelectedItem = oEvent.getSource();
        sSelectedBindingPath = oSelectedItem.getBindingContext().sPath + "/selected";
        model.setProperty(sSelectedBindingPath, becomesSelected);
        // update aFilters
        oFacetItem = oSelectedItem.getBindingContext().getObject();
        if (becomesSelected) {
          model.addFilter(oFacetItem);
        } else {
          model.removeFilter(oFacetItem);
        }
        // count the number of selected items in the model
        sPath = sSelectedBindingPath.replace(/\/items.+/, ""); //"/facetDialog/1/items/11/selected"
        sPath += "/items";
        ar = model.getProperty(sPath);
        cnt = 0;
        for (let i = 0; i < ar.length; i++) {
          oNode = ar[i];
          if (oNode.selected === true) {
            cnt++;
          }
        }
      } else if (oEvent.getSource && (oEvent.getId() === "selectData" || oEvent.getId() === "deselectData")) {
        // new pie chart
        context = oEvent.getSource().getBindingContext(); // ToDo
        model = context.getModel();
        data = context.getObject();
        becomesSelected = oEvent.getId() === "selectData";
        // first set the selected value in model
        oSelectedItem = oEvent.getSource();
        sSelectedBindingPath = oSelectedItem.getBindingContext().sPath + "/items/"; // have "/facetDialog/1/", want "/facetDialog/1/items/11/selected"
        for (let j = 0; j < oEvent.getParameter("data").length; j++) {
          itemIndex = oEvent.getParameter("data")[j].data._context_row_number;
          sSelectedBindingPath += itemIndex + "/selected";
          model.setProperty(sSelectedBindingPath, becomesSelected);
          // update aFilters
          oFacetItem = oSelectedItem.getBindingContext().getObject().items[itemIndex];
          if (becomesSelected) {
            model.addFilter(oFacetItem);
          } else {
            model.removeFilter(oFacetItem);
          }
        }
        // count the number of selected items in the model
        sPath = sSelectedBindingPath.replace(/\/items.+/, ""); //"/facetDialog/1/items/11/selected"
        sPath += "/items";
        ar = model.getProperty(sPath);
        cnt = 0;
        for (let i = 0; i < ar.length; i++) {
          if (ar[i].selected === true) {
            cnt++;
          }
        }
        // if we deselect all at once by clicking the white background then this cnt is incomplete
        // bug! now adjust
        const curCntOfAffectedWedges = oEvent.getParameter("data").length;
        if (!becomesSelected && curCntOfAffectedWedges > 1) {
          cnt = 0;
          for (let i = 0; i < ar.length; i++) {
            ar[i].selected = false;
          }
        }
      } else {
        // old pie chart
        data = oEvent["dataObject"]; // ToDo
        isSelected = data.selected;
        becomesSelected = !isSelected;
        cnt = oEvent["cnt"]; // ToDo
        model = oEvent["model"]; // ToDo
        oFacetItem = new FacetItem();
        oFacetItem.facetAttribute = ManagedObject.escapeSettingsValue(data.dimension);
        oFacetItem.filterCondition = ManagedObject.escapeSettingsValue(data.filterCondition);
        oFacetItem.label = ManagedObject.escapeSettingsValue(data.label);
        oFacetItem.selected = ManagedObject.escapeSettingsValue(data.selected);
        oFacetItem.listed = ManagedObject.escapeSettingsValue(data.selected);
        oFacetItem.value = ManagedObject.escapeSettingsValue(data.value);
        oFacetItem.valueLabel = ManagedObject.escapeSettingsValue(data.valueLabel);
        // bar chart
        // - update aItemsForBarChart
        for (let j = 0; j < this.aItemsForBarChart.length; j++) {
          const item = this.aItemsForBarChart[j];
          if (item.label === ManagedObject.escapeSettingsValue(data.label)) {
            item.selected = data.selected;
          }
        }
        const oModel = this.getModel();
        if (isSelected) {
          oModel.addFilter(oFacetItem);
        } else {
          oModel.removeFilter(oFacetItem);
        }
      }
      // update the count info in masterPageList
      const oMasterPageList = SearchFacetDialogHelper.getFacetList();
      oMasterPageListItem = oMasterPageList.getSelectedItem();
      if (!oMasterPageListItem) {
        oMasterPageListItem = oMasterPageList.getItems()[0];
      }
      oMasterPageListItem.setCounter(cnt);
      this.resetEnabledForFilterResetButton();
    },
    updateDetailPageCharts: function _updateDetailPageCharts(aItems) {
      if (this.bShowCharts === false) {
        return;
      }
      this.aItemsForBarChart = aItems;
      const listContainers = SearchFacetDialogHelperCharts.getListContainersForDetailPage();
      const oListContainer = listContainers[1];
      if (!oListContainer) {
        return;
      }
      const contents = oListContainer.getContent();
      // update pie chart (only for oPieChart.directUpdate ie old pie)
      if (contents && this.chartOnDisplayIndex === 2) {
        const oPieChart = contents[2];
        const elemChart = listContainers[5];
        let relevantContainerHeight = listContainers[2];
        relevantContainerHeight = 0.9 * relevantContainerHeight;
        if (oPieChart.directUpdate) {
          // == old pie chart
          const piechartOptions = {
            relevantContainerHeight: relevantContainerHeight,
            oSearchFacetDialog: this
          };
          const oModel1 = new JSONModel();
          oModel1.setData(aItems);
          $("#" + elemChart.id).empty(); // elemChart.innerHTML = "";
          oPieChart.directUpdate(aItems, elemChart, oModel1, piechartOptions);
        }
      }
      // take care to adjust visibility of pie and bar chart
      // pie chart
      if (contents && this.chartOnDisplayIndex === 1) {
        // hide pie chart if exits
        const elem2 = contents[2].getDomRef();
        if (elem2) {
          const $elem2 = $("#" + elem2.id);
          $elem2.css("display", "none");
        }
      }
      // bar chart
      if (contents && this.chartOnDisplayIndex === 2) {
        // hide pie chart if exits
        const elem1 = contents[1].getDomRef();
        if (elem1) {
          const $elem1 = $("#" + elem1.id);
          $elem1.css("display", "none");
        }
      }
    },
    // this is for the button that toggles the charts but also calls updateDetailPageCharts() for pie chart
    controlChartVisibility: function _controlChartVisibility(oControl, chartIndexToShow, forcePie) {
      let elem, $elem, classNames, isChart;
      if (this.bShowCharts === false) return;
      const listContainers = SearchFacetDialogHelperCharts.getListContainersForDetailPage();
      const oListContainer = listContainers[1];
      if (!oListContainer || !oListContainer.getContent) return;
      const contents2 = oListContainer.getContent();
      for (let i = 0; i < contents2.length; i++) {
        elem = contents2[i].getDomRef();
        if (!elem) return;
        classNames = elem.className;
        isChart = false;
        if (classNames.indexOf("largeChart") > -1) {
          isChart = true;
        }
        $elem = $("#" + elem.id);
        if (isChart && i !== chartIndexToShow) {
          $elem.css("display", "none");
        } else {
          $elem.css("display", "block");
        }
      }
      if (oControl.bOldPieChart) {
        if (isChart && chartIndexToShow === 2 && forcePie) {
          const aItems = this.aItemsForBarChart;
          this.updateDetailPageCharts(aItems);
        }
        if (isChart && chartIndexToShow === 2) {
          oListContainer.setVertical(false);
        } else {
          oListContainer.setVertical(true);
        }
      }
      const oSortButtonSet = listContainers[6];
      const oInputFieldForFilterTextSet = listContainers[7];
      if (oSortButtonSet) {
        if (chartIndexToShow === 0) {
          oSortButtonSet.css("display", "block");
          oInputFieldForFilterTextSet.css("visibility", "visible");
        } else {
          oSortButtonSet.css("display", "none");
          oInputFieldForFilterTextSet.css("visibility", "hidden");
        }
      }
    },
    hideSelectively: function _hideSelectively(oEvent, oControl, chartIndex) {
      const elem = $("#" + oEvent["srcControl"].sId);
      const chartIndexToShow = oControl.chartOnDisplayIndex;
      const listContainers = SearchFacetDialogHelperCharts.getListContainersForDetailPage();
      const oListContainer = listContainers[1];
      if (listContainers[0].firstChild.children.length != 3) return;
      if (chartIndexToShow !== undefined) {
        if (oControl.chartOnDisplayIndex !== chartIndex) {
          elem.css("display", "none");
        } else {
          elem.css("display", "block");
        }
      } else {
        elem.css("display", "block");
      }
      if (chartIndexToShow === 2) {
        if (!listContainers[0].firstChild.children[2] || !listContainers[0].firstChild.children[2].firstChild) {
          oControl.controlChartVisibility(oControl, oControl.chartOnDisplayIndex, true);
        }
        if (oControl.bOldPieChart) {
          oListContainer.setVertical(false);
        }
      } else {
        oListContainer.setVertical(true);
      }
      const oSortButton = listContainers[6];
      if (oSortButton) {
        const elemSortButton = $("#" + oSortButton.sId);
        if (chartIndexToShow === 0) {
          elemSortButton.css("display", "block");
        } else {
          elemSortButton.css("display", "none");
        }
      }
    }
  });
  return SearchFacetDialog;
});
})();