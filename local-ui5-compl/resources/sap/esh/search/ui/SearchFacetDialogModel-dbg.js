/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./i18n", "sap/m/MessageBox", "./SearchModel", "sap/ui/core/library", "./hierarchydynamic/SearchHierarchyDynamicFacet", "./SearchFacetDialogHelperDynamicHierarchy"], function (__i18n, MessageBox, __SearchModel, sap_ui_core_library, __SearchHierarchyDynamicFacet, ___SearchFacetDialogHelperDynamicHierarchy) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const SearchModel = _interopRequireDefault(__SearchModel);
  const TextDirection = sap_ui_core_library["TextDirection"];
  const SearchHierarchyDynamicFacet = _interopRequireDefault(__SearchHierarchyDynamicFacet);
  const createFilterFacetItemForDynamicHierarchy = ___SearchFacetDialogHelperDynamicHierarchy["createFilterFacetItemForDynamicHierarchy"];
  class SearchFacetDialogModel extends SearchModel {
    aFilters;
    chartQuery;
    searchModel;
    constructor(settings) {
      super({
        searchModel: settings.searchModel,
        configuration: settings.searchModel.config
      });
      this.searchModel = settings.searchModel;
      this.aFilters = [];
    }
    prepareFacetList() {
      const metaData = this.getDataSource();
      this.setProperty("/facetDialog", this.oFacetFormatter.getDialogFacetsFromMetaData(metaData, this));
      this.initialFillFiltersForDynamicHierarchyFacets();
    }
    initialFillFiltersForDynamicHierarchyFacets() {
      const filter = this.getProperty("/uiFilter");
      const facets = this.getProperty("/facetDialog");
      for (const facet of facets) {
        if (!(facet instanceof SearchHierarchyDynamicFacet)) {
          continue;
        }
        const conditions = filter.rootCondition.getAttributeConditions(facet.attributeId);
        for (const condition of conditions) {
          const simpleCondition = condition;
          const facetItem = createFilterFacetItemForDynamicHierarchy(facet, simpleCondition);
          this.aFilters.push(facetItem);
        }
      }
    }

    // properties: sAttribute, sBindingPath
    facetDialogSingleCall(properties) {
      this.chartQuery.dimension = properties.sAttribute;
      this.chartQuery.top = properties.sAttributeLimit;
      this.chartQuery.setNlq(this.searchModel.isNlqActive());
      return this.chartQuery.getResultSetAsync().then(resultSet => {
        let oFacet;
        if (properties.bInitialFilters) {
          oFacet = this.oFacetFormatter.getDialogFacetsFromChartQuery(resultSet, this, this.chartQuery.dimension);
        } else {
          oFacet = this.oFacetFormatter.getDialogFacetsFromChartQuery(resultSet, this, this.chartQuery.dimension, this.aFilters);
        }
        const oFacet2 = jQuery.extend(true, {}, oFacet); // clone of oFacet
        oFacet.items4pie = oFacet2.items;
        let amountInPie = 0,
          amountNotInPie = 0,
          percentageMissingInPie = 0,
          averageSliceValue = 0;
        for (let i = 0; i < oFacet.items4pie.length; i++) {
          if (i < 9) {
            oFacet.items4pie[i]["pieReady"] = true;
            if (parseInt(oFacet.items4pie[i].value) > 0) {
              amountInPie += parseInt(oFacet.items4pie[i].value);
            }
          } else {
            oFacet.items4pie[i]["pieReady"] = false;
            if (parseInt(oFacet.items4pie[i].value) > 0) {
              amountNotInPie += parseInt(oFacet.items4pie[i].value);
            }
          }
        }
        percentageMissingInPie = amountNotInPie * 100 / (amountInPie + amountNotInPie);
        percentageMissingInPie = Math.ceil(percentageMissingInPie);
        averageSliceValue = amountInPie / 9;
        averageSliceValue = Math.floor(averageSliceValue);
        if (percentageMissingInPie > 0) {
          const newItem = oFacet.items4pie[0].clone();
          newItem.value = averageSliceValue.toString(); // ToDo, why do we need 'toString' here?
          newItem.label = i18n.getText("facetPieChartOverflowText2", [percentageMissingInPie.toString(), "9"]);
          newItem["pieReady"] = true;
          newItem.valueLabel = "" + averageSliceValue;
          newItem["isPieChartDummy"] = true;
          oFacet.items4pie.push(newItem);
        }
        for (let j = 0; j < oFacet.items4pie.length; j++) {
          oFacet.items4pie[j]["percentageMissingInBigPie"] = percentageMissingInPie;
        }
        this.setProperty(properties.sBindingPath + "/items4pie", oFacet.items4pie);
        this.setProperty(properties.sBindingPath + "/items", oFacet.items);
      }, error => {
        const errorTitle = i18n.getText("searchError");
        const errorText = error.message;
        MessageBox.error(errorText, {
          title: errorTitle,
          actions: MessageBox.Action.OK,
          onClose: null,
          styleClass: "",
          initialFocus: null,
          textDirection: TextDirection.Inherit
        });
      });
    }
    resetChartQueryFilterConditions() {
      if (this.chartQuery) {
        this.chartQuery.resetConditions();
      }
      // add static hierachy facets
      const nonFilterByConditions = this.getNonFilterByFilterConditions();
      if (nonFilterByConditions.length > 0) {
        for (const nonFilterByCondition of nonFilterByConditions) {
          this.chartQuery.autoInsertCondition(nonFilterByCondition);
        }
      }
    }
    hasFilterCondition(filterCondition) {
      for (let i = 0; i < this.aFilters.length; i++) {
        if (this.aFilters[i].filterCondition.equals && this.aFilters[i].filterCondition.equals(filterCondition)) {
          return true;
        }
      }
      return false;
    }
    hasFilter(item) {
      const filterCondition = item.filterCondition;
      return this.hasFilterCondition(filterCondition);
    }
    addFilter(item) {
      if (!this.hasFilter(item)) {
        this.aFilters.push(item);
      }
    }
    removeFilter(item) {
      const filterCondition = item.filterCondition;
      for (let i = 0; i < this.aFilters.length; i++) {
        if (this.aFilters[i].filterCondition.equals && this.aFilters[i].filterCondition.equals(filterCondition)) {
          this.aFilters.splice(i, 1);
          return;
        }
      }
    }
    changeFilterAdvaced(item, bAdvanced) {
      const filterCondition = item.filterCondition;
      for (let i = 0; i < this.aFilters.length; i++) {
        if (this.aFilters[i].filterCondition.equals && this.aFilters[i].filterCondition.equals(filterCondition)) {
          this.aFilters[i].advanced = bAdvanced;
          return;
        }
      }
    }
    addFilterCondition(filterCondition) {
      this.chartQuery.filter.autoInsertCondition(filterCondition);
    }

    // determinate the attribute list data type
    getAttributeDataType(facet) {
      switch (facet.dataType) {
        case "Integer":
          return "integer";
        case "Double":
          return "number";
        case "Timestamp":
          return "timestamp";
        case "Date":
          return "date";
        case "String":
          if (facet.matchingStrategy === this.sinaNext.MatchingStrategy.Text) {
            return "text";
          }
          return "string";
        default:
          return "string";
      }
    }
    destroy() {
      super.destroy();
      this.oFacetFormatter.destroy();
    }
  }
  return SearchFacetDialogModel;
});
})();