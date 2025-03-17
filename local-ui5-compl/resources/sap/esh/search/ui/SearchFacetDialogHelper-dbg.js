/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./i18n", "sap/ui/model/Sorter", "sap/ui/core/format/NumberFormat", "sap/ui/core/message/MessageType", "./hierarchydynamic/SearchHierarchyDynamicFacet", "./SearchFacetDialogHelperDynamicHierarchy", "./sinaNexTS/sina/SimpleCondition", "sap/ui/core/format/DateFormat", "./controls/facets/FacetTypeUI"], function (__i18n, Sorter, NumberFormat, MessageType, __SearchHierarchyDynamicFacet, ___SearchFacetDialogHelperDynamicHierarchy, ___sinaNexTS_sina_SimpleCondition, DateFormat, ___controls_facets_FacetTypeUI) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const SearchHierarchyDynamicFacet = _interopRequireDefault(__SearchHierarchyDynamicFacet);
  const updateDetailPageforDynamicHierarchy = ___SearchFacetDialogHelperDynamicHierarchy["updateDetailPageforDynamicHierarchy"];
  const SimpleCondition = ___sinaNexTS_sina_SimpleCondition["SimpleCondition"];
  const FacetTypeUI = ___controls_facets_FacetTypeUI["FacetTypeUI"]; // ToDo, static?  -> alt3ernative: create instances instead of singleton
  class SearchFacetDialogHelper {
    static searchAdvancedCondition; // ToDo class SearchAdvancedCondition

    static dialog;
    static POS_FACET_LIST;
    static POS_TOOLBAR_SEARCHFIELD;
    static POS_TOOLBAR_TOGGLEBUTTON;
    static POS_SETTING_CONTAINER;
    static POS_ATTRIBUTE_LIST_CONTAINER;
    static POS_ICONTABBAR;
    static POS_TABBAR_LIST;
    static POS_TABBAR_CONDITION;
    static POS_SORTING_SELECT;
    static POS_SHOWONTOP_CHECKBOX;
    static POS_ADVANCED_CHECKBOX;
    static POS_ADVANCED_INPUT_LAYOUT;
    static POS_ADVANCED_BUTTON;
    static bResetFilterIsActive;
    static oFloatNumberFormat;
    static oIntegernumberFormat;
    static oNumberFormat;
    static oDateFormatOptions;
    static oTimestampFormatOptions;
    static oDateFormat;
    static oTimestampFormat;
    static oDateTimeFormat;
    static injectSearchAdvancedCondition(_SearchAdvancedCondition) {
      // ToDo SearchAdvancedCondition (the class, not an instance)
      SearchFacetDialogHelper.searchAdvancedCondition = _SearchAdvancedCondition;
    }
    constructor() {
      throw new Error("Cannot instantiate static class 'SearchFacetDialogHelper'");
    }
    static init(dialog) {
      // ToDo, support multiple instances and merge init into constructor
      // ToDo: add type SearchFacetDialog when converted to TS
      // the position index of elements in parent aggregation:
      // first masterPage: masterPages[0]->scrollContainer->content[]
      SearchFacetDialogHelper.POS_FACET_LIST = 0;
      // every detailPage->subHeader->content[]
      SearchFacetDialogHelper.POS_TOOLBAR_SEARCHFIELD = 0;
      SearchFacetDialogHelper.POS_TOOLBAR_TOGGLEBUTTON = 1;
      // every detailPage->content[]
      // old layout (number, date facet)
      SearchFacetDialogHelper.POS_SETTING_CONTAINER = 0;
      SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER = 1;
      // new layout (string, text facet)
      SearchFacetDialogHelper.POS_ICONTABBAR = 0;
      // tabBar->items[]
      SearchFacetDialogHelper.POS_TABBAR_LIST = 0;
      SearchFacetDialogHelper.POS_TABBAR_CONDITION = 1;
      // settingContainer->content[]
      SearchFacetDialogHelper.POS_SORTING_SELECT = 0;
      SearchFacetDialogHelper.POS_SHOWONTOP_CHECKBOX = 1;
      // advancedCondition->content[]
      SearchFacetDialogHelper.POS_ADVANCED_CHECKBOX = 0;
      SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT = 1;
      SearchFacetDialogHelper.POS_ADVANCED_BUTTON = 2;
      SearchFacetDialogHelper.bResetFilterIsActive = false;
      const oNumberFormatOptions = {
        decimals: 2
      };
      SearchFacetDialogHelper.oFloatNumberFormat = NumberFormat.getFloatInstance(oNumberFormatOptions);
      SearchFacetDialogHelper.oIntegernumberFormat = NumberFormat.getIntegerInstance();
      //format: 2015-07-14 00:00:00.0000000
      SearchFacetDialogHelper.oDateFormatOptions = {
        pattern: "yyyy/MM/dd",
        UTC: false
      };
      SearchFacetDialogHelper.oTimestampFormatOptions = {
        pattern: "yyyy-MM-dd HH:mm:ss.SSSSSSS",
        UTC: true
      };
      SearchFacetDialogHelper.oDateFormat = DateFormat.getDateTimeInstance(SearchFacetDialogHelper.oDateFormatOptions);
      SearchFacetDialogHelper.oTimestampFormat = DateFormat.getDateTimeInstance(SearchFacetDialogHelper.oTimestampFormatOptions);
      SearchFacetDialogHelper.dialog = dialog;
    }

    // get the facet list in masterPage
    static getFacetList() {
      // ToDo
      const facetListPage = SearchFacetDialogHelper.dialog.oSplitContainer.getMasterPages()[0];
      return facetListPage.getContent()[SearchFacetDialogHelper.POS_FACET_LIST];
    }

    //according masterPageListItem, send a single facet pespective call, update the detail page
    static updateDetailPage(oListItem, sFilterTerm, bInitialFilters) {
      const oModel = SearchFacetDialogHelper.dialog.getModel();
      const oSearchModel = SearchFacetDialogHelper.dialog.getModel("searchModel");
      const sBindingPath = oListItem.getBindingContext().sPath;
      const oSelectedListItem = oModel.getProperty(sBindingPath);
      const sDataType = oModel.getAttributeDataType(oSelectedListItem);
      const index = SearchFacetDialogHelper.getFacetList().indexOfAggregation("items", oListItem);
      const oDetailPage = SearchFacetDialogHelper.dialog.oSplitContainer.getDetailPages()[index];
      const facet = oDetailPage.getBindingContext().getObject();
      if (facet.facetType === FacetTypeUI.Hierarchy) {
        const dynamicHierarchyFacet = facet;
        updateDetailPageforDynamicHierarchy(oModel, dynamicHierarchyFacet, oModel.aFilters);
        SearchFacetDialogHelper.dialog.oSplitContainer.toDetail(oDetailPage.getId(), "show", null, null); // ToDo 'null, null'
        return;
      }
      let oDetailPageAttributeListContainer, oDetailPageAttributeList, oAdvancedContainer, oSettings;
      if (sDataType === "string" || sDataType === "text") {
        oDetailPageAttributeListContainer = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ICONTABBAR].getAggregation("items")[SearchFacetDialogHelper.POS_TABBAR_LIST].getContent()[0].getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER];
        oDetailPageAttributeList = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ICONTABBAR].getAggregation("items")[SearchFacetDialogHelper.POS_TABBAR_LIST].getContent()[0].getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
        oAdvancedContainer = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ICONTABBAR].getAggregation("items")[SearchFacetDialogHelper.POS_TABBAR_CONDITION].getContent()[0];
        oSettings = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ICONTABBAR].getAggregation("items")[SearchFacetDialogHelper.POS_TABBAR_LIST].getContent()[0].getContent()[SearchFacetDialogHelper.POS_SETTING_CONTAINER];
      } else {
        oDetailPageAttributeListContainer = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER];
        oDetailPageAttributeList = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER]
        // ToDo 'any'
        .getContent()[0];
        oAdvancedContainer = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER]; //from index 1
        oSettings = oDetailPage.getContent()[SearchFacetDialogHelper.POS_SETTING_CONTAINER];
      }
      const sNaviId = oDetailPage.getId();
      SearchFacetDialogHelper.dialog.oSplitContainer.toDetail(sNaviId, "show", null, null); // ToDo 'null, null'
      SearchFacetDialogHelper.dialog.resetIcons(oModel, sBindingPath, SearchFacetDialogHelper.dialog);
      oDetailPageAttributeListContainer.setBusy(true);
      const properties = {
        sAttribute: oSelectedListItem.dimension,
        sBindingPath: sBindingPath,
        sAttributeLimit: 1000,
        bInitialFilters: bInitialFilters
      };
      if (sDataType === "number") {
        properties.sAttributeLimit = 20;
      }
      if (!oModel.chartQuery) {
        oModel.chartQuery = oModel.sinaNext.createChartQuery({
          filter: oModel.getProperty("/uiFilter").clone(),
          dimension: oSelectedListItem.dimension,
          top: 1000
        });
      }
      // apply the facet query filter, except itself
      SearchFacetDialogHelper.applyChartQueryFilter(index); // TODO
      // add the filter term in search field
      if (sFilterTerm) {
        const filterCondition = oModel.sinaNext.createSimpleCondition({
          attribute: oSelectedListItem.dimension,
          operator: oModel.sinaNext.ComparisonOperator.Bw,
          value: sFilterTerm
        });
        if (!SearchFacetDialogHelper.bResetFilterIsActive) {
          oModel.chartQuery.filter.autoInsertCondition(filterCondition);
        }
      } else {
        if (sFilterTerm === undefined && (sDataType === "string" || sDataType === "text")) {
          oDetailPage.getContent()[SearchFacetDialogHelper.POS_ICONTABBAR].getAggregation("items")[SearchFacetDialogHelper.POS_TABBAR_LIST].getContent()[0].getSubHeader().getContent()[SearchFacetDialogHelper.POS_TOOLBAR_SEARCHFIELD].setValue("");
        }
      }
      oModel.chartQuery.filter.searchTerm = oSearchModel.getSearchBoxTerm();
      // send the single call
      oModel.facetDialogSingleCall(properties).then(() => {
        const aItems = oModel.getProperty(oDetailPage.getBindingContext().getPath()).items;
        // initiate advanced container
        if (oAdvancedContainer.data("initial")) {
          SearchFacetDialogHelper.initiateAdvancedConditions(oAdvancedContainer, aItems, oAdvancedContainer.data("dataType"));
        }
        // enable setting check box
        const oCheckbox = oSettings.getItems()[SearchFacetDialogHelper.POS_SHOWONTOP_CHECKBOX];
        if (oDetailPageAttributeList.getSelectedContexts().length > 0) {
          oCheckbox.setEnabled(true);
        }
        // update detail page list items select
        SearchFacetDialogHelper.updateDetailPageListItemsSelected(oDetailPageAttributeList, oAdvancedContainer);
        // update possible charts avr
        SearchFacetDialogHelper.dialog.updateDetailPageCharts(aItems);
      });
    }
    // collect all filters in dialog for single facet call
    static applyChartQueryFilter(excludedIndex) {
      const oFacetModel = SearchFacetDialogHelper.dialog.getModel();
      oFacetModel.resetChartQueryFilterConditions();
      const aDetailPages = SearchFacetDialogHelper.dialog.oSplitContainer.getDetailPages();
      for (let i = 0; i < aDetailPages.length; i++) {
        const detailPage = aDetailPages[i];
        if (i === excludedIndex || detailPage.getContent().length === 0) {
          continue;
        }
        const facet = detailPage.getBindingContext().getObject();
        if (facet instanceof SearchHierarchyDynamicFacet) {
          this.applyDynamicHierarchyChartQueryFilter(facet, oFacetModel);
          continue;
        }
        let oList;
        if (!detailPage.getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER]) {
          // new layout
          oList = detailPage.getContent()[SearchFacetDialogHelper.POS_ICONTABBAR].getAggregation("items")[SearchFacetDialogHelper.POS_TABBAR_LIST].getContent()[0].getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
        } else {
          // old layout
          oList = detailPage.getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
        }
        for (let j = 0; j < oList.getItems().length; j++) {
          const oListItem = oList.getItems()[j];
          const oListItemBindingObject = oListItem.getBindingContext().getObject();
          const filterCondition = oListItemBindingObject.filterCondition;
          if (filterCondition.attribute || filterCondition.conditions) {
            if (oListItem.getSelected() && !SearchFacetDialogHelper.bResetFilterIsActive) {
              oFacetModel.chartQuery.filter.autoInsertCondition(filterCondition);
            }
          }
        }
        SearchFacetDialogHelper.applyAdvancedCondition(detailPage, SearchFacetDialogHelper.getFacetList().getItems()[i].getBindingContext().getObject(), SearchFacetDialogHelper.dialog.getModel());
      }
    }
    static applyDynamicHierarchyChartQueryFilter(facet, model) {
      for (const filter of model.aFilters) {
        const facetItem = filter;
        const filterCondition = facetItem.filterCondition;
        if (filterCondition instanceof SimpleCondition && filterCondition.attribute === facet.attributeId) {
          model.chartQuery.filter.autoInsertCondition(filterCondition.clone());
        }
      }
    }

    // removes all filters in dialog for single facet call
    static resetChartQueryFilters() {
      const oFacetModel = SearchFacetDialogHelper.dialog.getModel();
      oFacetModel.resetChartQueryFilterConditions();
      const aDetailPages = SearchFacetDialogHelper.dialog.oSplitContainer.getDetailPages();
      for (let i = 0; i < aDetailPages.length; i++) {
        if (aDetailPages[i].getContent().length === 0) {
          continue;
        }
        const facet = aDetailPages[i].getBindingContext().getObject();
        if (facet instanceof SearchHierarchyDynamicFacet) {
          continue;
        }
        let oList;
        if (!aDetailPages[i].getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER]) {
          // new layout
          oList = aDetailPages[i].getContent()[SearchFacetDialogHelper.POS_ICONTABBAR].getAggregation("items")[SearchFacetDialogHelper.POS_TABBAR_LIST].getContent()[0].getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
        } else {
          // old layout
          oList = aDetailPages[i].getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
        }
        for (let j = 0; j < oList.getItems().length; j++) {
          const oListItem = oList.getItems()[j];
          const oListItemBindingObject = oListItem.getBindingContext().getObject();
          const filterCondition = oListItemBindingObject.filterCondition;
          if (filterCondition.attribute || filterCondition.conditions) {
            if (oListItem.getSelected()) {
              oListItem.setSelected(false);
            }
          }
        }
      }
    }

    // collect all advanced filter condition in a detail page
    static applyAdvancedCondition(oDetailPage, oFacetItemBinding, oAppliedObject) {
      const oFacetModel = SearchFacetDialogHelper.dialog.getModel();
      let sDataType, oAdvancedConditionList, k, oAdvancedCondition, oAdvancedCheckBox, fromCondition, toCondition, oConditionGroup;
      if (oDetailPage.getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER]) {
        // old layout, number and date layout
        const oListAndConditionContainer = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER];
        sDataType = oListAndConditionContainer.data("dataType");
        oAdvancedConditionList = oListAndConditionContainer.getContent(); // from index 1
        switch (sDataType) {
          case "timestamp":
          case "date":
            SearchFacetDialogHelper.oDateTimeFormat = sDataType === "timestamp" ? SearchFacetDialogHelper.oTimestampFormat : SearchFacetDialogHelper.oDateFormat;
            for (k = 1; k < oAdvancedConditionList.length; k++) {
              oAdvancedCondition = oAdvancedConditionList[k];
              oAdvancedCheckBox = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_CHECKBOX];
              const oDateRangeSelection = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT];
              if (oAdvancedCheckBox.getSelected() && oDateRangeSelection.getDateValue() && oDateRangeSelection.getSecondDateValue()) {
                const secondDateObject = new Date(oDateRangeSelection.getSecondDateValue().getFullYear(), oDateRangeSelection.getSecondDateValue().getMonth(), oDateRangeSelection.getSecondDateValue().getDate(), 23, 59, 59);
                const dateValue = SearchFacetDialogHelper.oDateTimeFormat.format(oDateRangeSelection.getDateValue());
                const secondDateValue = SearchFacetDialogHelper.oDateTimeFormat.format(secondDateObject);
                fromCondition = oFacetModel.sinaNext.createSimpleCondition({
                  attribute: oFacetItemBinding.dimension,
                  attributeLabel: oFacetItemBinding.title,
                  operator: oFacetModel.sinaNext.ComparisonOperator.Ge,
                  value: sDataType === "timestamp" ? oDateRangeSelection.getDateValue() : dateValue,
                  valueLabel: dateValue
                });
                toCondition = oFacetModel.sinaNext.createSimpleCondition({
                  attribute: oFacetItemBinding.dimension,
                  attributeLabel: oFacetItemBinding.title,
                  operator: oFacetModel.sinaNext.ComparisonOperator.Le,
                  value: sDataType === "timestamp" ? secondDateObject : secondDateValue,
                  valueLabel: secondDateValue
                });
                oConditionGroup = oFacetModel.sinaNext.createComplexCondition({
                  valueLabel: oDateRangeSelection.getValue(),
                  operator: oFacetModel.sinaNext.LogicalOperator.And,
                  conditions: [fromCondition, toCondition],
                  userDefined: true
                });
                if (!SearchFacetDialogHelper.bResetFilterIsActive) {
                  oAppliedObject.addFilterCondition(oConditionGroup, false);
                }
              }
            }
            break;
          case "integer":
          case "number":
            SearchFacetDialogHelper.oNumberFormat = sDataType === "integer" ? SearchFacetDialogHelper.oIntegernumberFormat : SearchFacetDialogHelper.oFloatNumberFormat;
            for (k = 1; k < oAdvancedConditionList.length; k++) {
              oAdvancedCondition = oAdvancedConditionList[k];
              oAdvancedCheckBox = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_CHECKBOX];
              const oAdvancedInputLeft = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT].getContent()[0];
              const oAdvancedInputRight = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT].getContent()[2];
              const oAdvancedLebel = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT].getContent()[1];
              const oAdvancedInputLeftValue = SearchFacetDialogHelper.oNumberFormat.parse(oAdvancedInputLeft.getValue());
              const oAdvancedInputRightValue = SearchFacetDialogHelper.oNumberFormat.parse(oAdvancedInputRight.getValue());
              if (oAdvancedCheckBox.getSelected()) {
                if (!isNaN(oAdvancedInputLeftValue) &&
                // ToDo
                !isNaN(oAdvancedInputRightValue) &&
                // ToDo
                oAdvancedInputRightValue >= oAdvancedInputLeftValue) {
                  fromCondition = oFacetModel.sinaNext.createSimpleCondition({
                    attribute: oFacetItemBinding.dimension,
                    attributeLabel: oFacetItemBinding.title,
                    operator: oFacetModel.sinaNext.ComparisonOperator.Ge,
                    value: oAdvancedInputLeftValue,
                    // ToDo
                    valueLabel: SearchFacetDialogHelper.oNumberFormat.format(oAdvancedInputLeftValue),
                    // ToDo
                    userDefined: true
                  });
                  toCondition = oFacetModel.sinaNext.createSimpleCondition({
                    attribute: oFacetItemBinding.dimension,
                    attributeLabel: oFacetItemBinding.title,
                    operator: oFacetModel.sinaNext.ComparisonOperator.Le,
                    value: oAdvancedInputRightValue,
                    // ToDo
                    valueLabel: SearchFacetDialogHelper.oNumberFormat.format(oAdvancedInputRightValue),
                    // ToDo
                    userDefined: true
                  });
                  oConditionGroup = oFacetModel.sinaNext.createComplexCondition({
                    valueLabel: SearchFacetDialogHelper.oNumberFormat.format(oAdvancedInputLeftValue) +
                    // ToDo
                    oAdvancedLebel.getText() + SearchFacetDialogHelper.oNumberFormat.format(oAdvancedInputRightValue),
                    // ToDo
                    operator: oFacetModel.sinaNext.LogicalOperator.And,
                    conditions: [fromCondition, toCondition],
                    userDefined: true
                  });
                  if (!SearchFacetDialogHelper.bResetFilterIsActive) {
                    oAppliedObject.addFilterCondition(oConditionGroup, false);
                  }
                } else {
                  const oSearchModel = SearchFacetDialogHelper.dialog.getModel("searchModel");
                  const messageItem = {
                    type: MessageType.Error,
                    title: i18n.getText("filterInputErrorTitle"),
                    description: i18n.getText("filterInputError")
                  };
                  oSearchModel.pushUIMessage(messageItem);
                  SearchFacetDialogHelper.dialog.bConditionValidateError = true;
                }
              }
            }
            break;
          default:
            break;
        }
      } else {
        // new layout, string and text facet
        const oAdvancedContainer = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ICONTABBAR].getItems()[SearchFacetDialogHelper.POS_TABBAR_CONDITION].getContent()[0];
        sDataType = oAdvancedContainer.data("dataType");
        oAdvancedConditionList = oAdvancedContainer.getContent();
        let oAdvancedSelect, oAdvancedInput, sConditionTerm, oFilterCondition, sOperator;
        switch (sDataType) {
          case "string":
            for (k = 0; k < oAdvancedConditionList.length - 1; k++) {
              oAdvancedCondition = oAdvancedConditionList[k];
              oAdvancedSelect = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT].getContent()[0];
              oAdvancedInput = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT].getContent()[1];
              sConditionTerm = oAdvancedInput.getValue();
              switch (oAdvancedSelect.getSelectedKey()) {
                case "eq":
                  // sConditionTerm = oAdvancedInput.getValue();
                  sOperator = oFacetModel.sinaNext.ComparisonOperator.Eq;
                  break;
                case "ew":
                  // sConditionTerm = "*" + oAdvancedInput.getValue();
                  sOperator = oFacetModel.sinaNext.ComparisonOperator.Ew;
                  break;
                case "bw":
                  // sConditionTerm = oAdvancedInput.getValue() + "*";
                  sOperator = oFacetModel.sinaNext.ComparisonOperator.Bw;
                  break;
                case "co":
                  // sConditionTerm = "*" + oAdvancedInput.getValue() + "*";
                  sOperator = oFacetModel.sinaNext.ComparisonOperator.Co;
                  break;
                default:
                  sOperator = oFacetModel.sinaNext.ComparisonOperator.Eq;
                  break;
              }
              if (oAdvancedInput.getValue()) {
                oFilterCondition = oFacetModel.sinaNext.createSimpleCondition({
                  attribute: oFacetItemBinding.dimension,
                  attributeLabel: oFacetItemBinding.title,
                  operator: sOperator,
                  value: sConditionTerm,
                  valueLabel: sConditionTerm,
                  userDefined: true
                });
                if (!SearchFacetDialogHelper.bResetFilterIsActive) {
                  oAppliedObject.addFilterCondition(oFilterCondition, false);
                }
              }
            }
            break;
          case "text":
            for (k = 0; k < oAdvancedConditionList.length - 1; k++) {
              oAdvancedCondition = oAdvancedConditionList[k];
              oAdvancedSelect = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT].getContent()[0];
              oAdvancedInput = oAdvancedCondition.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT].getContent()[1];
              sConditionTerm = oAdvancedInput.getValue();
              switch (oAdvancedSelect.getSelectedKey()) {
                case "co":
                  sOperator = oFacetModel.sinaNext.ComparisonOperator.Co;
                  break;
                default:
                  sOperator = oFacetModel.sinaNext.ComparisonOperator.Eq;
              }
              if (oAdvancedInput.getValue()) {
                oFilterCondition = oFacetModel.sinaNext.createSimpleCondition({
                  attribute: oFacetItemBinding.dimension,
                  attributeLabel: oFacetItemBinding.title,
                  operator: sOperator,
                  value: sConditionTerm,
                  valueLabel: sConditionTerm,
                  userDefined: true
                });
                if (!SearchFacetDialogHelper.bResetFilterIsActive) {
                  oAppliedObject.addFilterCondition(oFilterCondition, false);
                }
              }
            }
            break;
          default:
            break;
        }
      }
    }

    // update advanced conditions after detail page factory
    static initiateAdvancedConditions(oAdvancedContainer, aItems, type) {
      let aConditions, oConditionLayout, oCheckBox, oInputLayout, operator;
      const oFacetModel = SearchFacetDialogHelper.dialog.getModel();
      for (let i = aItems.length; i > 0; i--) {
        const item = aItems[i - 1];
        if (item.advanced) {
          aConditions = oAdvancedContainer.getContent();
          if (type === "string" || type === "text") {
            oConditionLayout = aConditions[aConditions.length - 2];
          } else {
            oConditionLayout = aConditions[aConditions.length - 1];
          }
          oCheckBox = oConditionLayout.getContent()[SearchFacetDialogHelper.POS_ADVANCED_CHECKBOX];
          oCheckBox.setSelected(true);
          oInputLayout = oConditionLayout.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT];
          switch (type) {
            case "integer":
            case "number":
              {
                const oInputBoxLeft = oInputLayout.getContent()[0];
                const oInputBoxRight = oInputLayout.getContent()[2];
                if (item.filterCondition.conditions) {
                  for (let j = 0; j < item.filterCondition.conditions.length; j++) {
                    const condition = item.filterCondition.conditions[j];
                    if (condition.operator === "Ge") {
                      oInputBoxLeft.setValue(condition.valueLabel || SearchFacetDialogHelper.oNumberFormat.format(condition.value));
                    }
                    if (condition.operator === "Le") {
                      oInputBoxRight.setValue(condition.valueLabel || SearchFacetDialogHelper.oNumberFormat.format(condition.value));
                    }
                  }
                }
                break;
              }
            case "string":
              operator = item.filterCondition.operator;
              if (operator === "Co") {
                oInputLayout.getContent()[0].setSelectedKey("co");
              } else if (operator === "Ew") {
                oInputLayout.getContent()[0].setSelectedKey("ew");
              } else if (operator === "Bw") {
                oInputLayout.getContent()[0].setSelectedKey("bw");
              }
              oInputLayout.getContent()[1].setValue(item.filterCondition.valueLabel);
              break;
            case "text":
              operator = item.filterCondition.operator;
              if (operator === "Co") {
                oInputLayout.getContent()[0].setSelectedKey("co");
              }
              oInputLayout.getContent()[1].setValue(item.filterCondition.valueLabel);
              break;
            default:
              oInputLayout.setValue(item.label);
              break;
          }
          SearchFacetDialogHelper.insertNewAdvancedCondition(oConditionLayout, type);
          oFacetModel.changeFilterAdvaced(item, true);
        }
      }
      oAdvancedContainer.data("initial", false);
    }

    // callback function, update selected property after model changed
    static updateDetailPageListItemsSelected(oDetailPageAttributeList, oAdvancedContainer) {
      const sDataType = oAdvancedContainer.data("dataType");
      SearchFacetDialogHelper.sortingAttributeList(oDetailPageAttributeList.getParent().getParent());
      oDetailPageAttributeList.getParent().setBusy(false);
      if (sDataType === "date" || sDataType === "timestamp" || sDataType === "number" || sDataType === "integer") {
        oDetailPageAttributeList.focus();
      }
    }

    // remove duplicate advanced condition
    static removeAdvancedCondition(oAdvancedContainer, oListItem, type) {
      const aConditions = oAdvancedContainer.getContent();
      let oConditionLayout, oInputBox, index;
      if (type === "string" || type === "text") {
        for (let i = 0; i < aConditions.length - 1; i++) {
          oConditionLayout = aConditions[i];
          oInputBox = oConditionLayout.getContent()[SearchFacetDialogHelper.POS_ADVANCED_INPUT_LAYOUT].getContent()[1];
          if (oInputBox.getProperty("value")) {
            const value = oInputBox.getValue();
            const oListItemBindingObject = oListItem.getBindingContext().getObject();
            if (value === oListItemBindingObject.filterCondition.value) {
              index = i;
              break;
            }
          }
        }
      }
      oAdvancedContainer.removeContent(index);
    }

    // sorting the attribute list
    static sortingAttributeList(oDetailPage) {
      const oSettings = oDetailPage.getContent()[SearchFacetDialogHelper.POS_SETTING_CONTAINER];
      const oSelect = oSettings.getItems()[SearchFacetDialogHelper.POS_SORTING_SELECT].getItems()[0];
      const oCheckBox = oSettings.getItems()[SearchFacetDialogHelper.POS_SHOWONTOP_CHECKBOX];
      const oList = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER].getContent()[0];
      const sDataType = oList.data("dataType");
      const oBinding = oList.getBinding("items");
      const aSorters = [];
      if (oCheckBox.getSelected()) {
        aSorters.push(new Sorter("selected", true, false));
      }
      switch (oSelect.getSelectedKey()) {
        case "sortName":
          aSorters.push(new Sorter("label", false, false));
          break;
        case "sortCount":
          aSorters.push(new Sorter("value", true, false));
          if (sDataType === "string" || sDataType === "text") {
            aSorters.push(new Sorter("label", false, false));
          }
          break;
        default:
          break;
      }
      oBinding.sort(aSorters);
    }

    // insert new advanced condition
    static insertNewAdvancedCondition(oAdvancedCondition, type) {
      const oAdvancedContainer = oAdvancedCondition.getParent();
      const oNewAdvancedCondition = new SearchFacetDialogHelper.searchAdvancedCondition("", {
        type: type
      });
      if (type === "string" || type === "text") {
        const insertIndex = oAdvancedContainer.getContent().length - 1;
        oAdvancedContainer.insertContent(oNewAdvancedCondition, insertIndex);
      } else {
        const index = oAdvancedContainer.indexOfContent(oAdvancedCondition);
        if (index === oAdvancedContainer.getContent().length - 1) {
          oAdvancedContainer.addContent(oNewAdvancedCondition);
        }
      }
    }

    // helper function
    static deleteAdvancedCondition(oAdvancedCondition) {
      const oAdvancedContainer = oAdvancedCondition.getParent();
      const oDetailPage = oAdvancedCondition.getParent().getParent().getParent().getParent().getParent();
      oAdvancedContainer.removeContent(oAdvancedCondition);
      SearchFacetDialogHelper.updateCountInfo(oDetailPage);
    }

    // set count info in master page facet list
    static updateCountInfo(oDetailPage) {
      const oMasterPageList = SearchFacetDialogHelper.getFacetList();
      let oMasterPageListItem = oMasterPageList.getSelectedItem();
      if (!oMasterPageListItem) {
        oMasterPageListItem = oMasterPageList.getItems()[0];
      }
      const oFacetModel = oMasterPageListItem.getBindingContext().getModel();
      const sMasterBindingPath = oMasterPageListItem.getBindingContext().getPath();
      const sDimension = oFacetModel.getProperty(sMasterBindingPath).dimension;
      const aFilters = oFacetModel.aFilters;
      let countNormalCondition = 0;
      for (const filter of aFilters) {
        if (!filter.advanced && filter.facetAttribute === sDimension) {
          countNormalCondition++;
        }
      }
      let oAdvancedContainer;
      const sDataType = oFacetModel.getAttributeDataType(oFacetModel.getProperty(sMasterBindingPath));
      if (sDataType === "string" || sDataType === "text") {
        oAdvancedContainer = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ICONTABBAR].getItems()[SearchFacetDialogHelper.POS_TABBAR_CONDITION].getContent()[0];
      } else {
        oAdvancedContainer = oDetailPage.getContent()[SearchFacetDialogHelper.POS_ATTRIBUTE_LIST_CONTAINER];
      }
      const advancedConditions = oAdvancedContainer.getContent();
      let countAdvancedCondition = 0;
      for (const advancedCondition of advancedConditions) {
        if (typeof advancedCondition.getContent === "function" /* skip first item (list of ranges) */) {
          const oAdvancedConditionCheckbox = advancedCondition.getContent()[0];
          if (oAdvancedConditionCheckbox.getSelected()) {
            countAdvancedCondition++;
          }
        }
      }
      const sFacetType = oFacetModel.getProperty(sMasterBindingPath).facetType;
      if (sFacetType === FacetTypeUI.Attribute) {
        const count = countNormalCondition + countAdvancedCondition;
        oFacetModel.setProperty(sMasterBindingPath + "/count", count);
        SearchFacetDialogHelper.dialog.resetEnabledForFilterResetButton();
      }
    }
  }
  return SearchFacetDialogHelper;
});
})();