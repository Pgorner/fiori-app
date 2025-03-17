/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
  "use strict";

  class ProviderHelper {
    provider;
    sina;
    constructor(provider) {
      this.provider = provider;
      this.sina = provider.sina;
    }
    calculateMultiDataSourceLabel(label, provider) {
      if (provider.label) {
        const identify = provider.label || provider.id;
        return label + " - " + identify;
      }
      return label;
    }
    calculateMultiDataSourceId(id, identify) {
      return identify + "_" + id;
    }
    updateProviderId(childSina) {
      let i = 0;
      for (;;) {
        if (i !== 0) {
          childSina.provider.id = childSina.provider.id + "_" + i;
        }
        const duplicateSina = this.findSinaById(childSina.provider.id);
        if (duplicateSina) {
          i++;
          continue;
        } else {
          break;
        }
      }
    }

    //input: multiDataSource id, dataSource with child provider, output: dataSource with multi provider
    createMultiDataSource(id, dataSource) {
      return this.sina._createDataSource({
        id: id,
        label: this.calculateMultiDataSourceLabel(dataSource.label, dataSource.sina.provider),
        labelPlural: this.calculateMultiDataSourceLabel(dataSource.labelPlural, dataSource.sina.provider),
        type: dataSource.type,
        hidden: dataSource.hidden,
        attributesMetadata: dataSource.attributesMetadata
      });
    }
    findSinaById(providerId) {
      for (let i = 0; i < this.provider.multiSina.length; i++) {
        const childSina = this.provider.multiSina[i];
        if (providerId === childSina.provider.id) {
          return childSina;
        }
      }
      return undefined;
    }
    updateAttributesMetadata(dataSourceWithMetadata, dataSource) {
      dataSource.attributesMetadata = dataSourceWithMetadata.attributesMetadata;
      dataSource.attributeMetadataMap = dataSourceWithMetadata.attributeMetadataMap;
    }
    updateSuggestionDataSource(results) {
      for (let i = 0; i < results.items.length; i++) {
        const item = results.items[i];
        if (item.childSuggestions) {
          for (let j = 0; j < item.childSuggestions.length; j++) {
            const childSuggestion = item.childSuggestions[j];
            const dataSourceId = this.calculateMultiDataSourceId(childSuggestion.dataSource.id, childSuggestion.sina.provider.id);
            childSuggestion.dataSource = this.sina.dataSourceMap[dataSourceId];
            childSuggestion.filter.dataSource = this.sina.dataSourceMap[dataSourceId];
          }
        }
        //update dataSource for dataSource suggestion type
        if (item.dataSource) {
          item.label = this.calculateMultiDataSourceLabel(item.label, item.sina.provider);
          const multiDataSourceId = this.calculateMultiDataSourceId(item.dataSource.id, item.sina.provider.id);
          // const multiDataSource = this.createMultiDataSource(multiDataSourceId, item.dataSource);
          const multiDataSource = this.sina.dataSourceMap[multiDataSourceId];
          item.dataSource = multiDataSource;
          item.sina = this.sina;
        }
      }
      return results;
    }
    createMultiChartResultSet(chartResultSet) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const multiChartResultSet = that.sina._createChartResultSet({
        id: chartResultSet.id,
        items: [],
        query: chartResultSet.query,
        title: chartResultSet.title
      });
      for (let i = 0; i < chartResultSet.items.length; i++) {
        const childChartResultSetItem = chartResultSet.items[i];
        const childFilterCondition = that.sina.parseConditionFromJson(childChartResultSetItem.filterCondition.toJson());
        multiChartResultSet.items.push(that.sina._createChartResultSetItem({
          filterCondition: childFilterCondition,
          dimensionValueFormatted: childChartResultSetItem.dimensionValueFormatted,
          measureValue: childChartResultSetItem.measureValue,
          measureValueFormatted: childChartResultSetItem.measureValueFormatted
        }));
      }
      return multiChartResultSet;
    }
    updateDataSourceFacets(resultSetFacets) {
      for (let j = 0; j < resultSetFacets[0].items.length; j++) {
        const facetItem = resultSetFacets[0].items[j];
        if (facetItem.dataSource) {
          const facetItemMultiId = this.calculateMultiDataSourceId(facetItem.dataSource.id, facetItem.sina.provider.id);
          //new Category, should be insert to multi provider
          if (!this.provider.multiDataSourceMap[facetItemMultiId]) {
            this.createMultiDataSource(facetItemMultiId, facetItem.dataSource);
            this.provider.multiDataSourceMap[facetItemMultiId] = facetItem.dataSource;
          }
          //set the facet result item dataSource as multi provider dataSource
          facetItem.dataSource = this.sina.dataSourceMap[facetItemMultiId];
        }
      }
      return resultSetFacets;
    }

    // update rootCondition sina as childSina
    updateRootCondition(rootCondition, childSina) {
      rootCondition.sina = childSina;
      if (rootCondition.conditions && rootCondition.conditions.length > 0) {
        for (let i = 0; i < rootCondition.conditions.length; i++) {
          this.updateRootCondition(rootCondition.conditions[i], childSina);
        }
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ProviderHelper = ProviderHelper;
  return __exports;
});
})();