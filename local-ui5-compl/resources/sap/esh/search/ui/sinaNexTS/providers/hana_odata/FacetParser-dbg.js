/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SearchQuery", "./typeConverter", "../../sina/LogicalOperator", "../../sina/ComparisonOperator", "../../sina/ChartQuery", "../../core/Log", "../../core/errors", "./HierarchyParser"], function (____sina_SearchQuery, typeConverter, ____sina_LogicalOperator, ____sina_ComparisonOperator, ____sina_ChartQuery, ____core_Log, ____core_errors, ___HierarchyParser) {
  "use strict";

  const SearchQuery = ____sina_SearchQuery["SearchQuery"];
  const LogicalOperator = ____sina_LogicalOperator["LogicalOperator"];
  const ComparisonOperator = ____sina_ComparisonOperator["ComparisonOperator"];
  const ChartQuery = ____sina_ChartQuery["ChartQuery"];
  const Log = ____core_Log["Log"];
  const FacetsParseError = ____core_errors["FacetsParseError"];
  const HierarchyParser = ___HierarchyParser["HierarchyParser"];
  class FacetParser {
    log;
    provider;
    sina;
    constructor(provider) {
      this.provider = provider;
      this.sina = provider.sina;
      this.log = new Log("hana_odata facet parser");
    }
    async parse(query, data) {
      const hierarchyParser = new HierarchyParser();
      const value = data["@com.sap.vocabularies.Search.v1.Facets"];
      if (!value) {
        return Promise.resolve([]);
      }
      if (data.error) {
        this.log.warn("Server-side Warning: " + data.error.message);
      }
      const facets = [];
      for (let i = 0; i < value.length; i++) {
        const facetData = value[i];

        // var dimension = '';
        // if (query.dimension) {
        //     dimension = query.dimension;
        // } else if (facetData["@com.sap.vocabularies.Search.v1.Facet"] && facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions && facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0] && facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0].PropertyName) {
        //     dimension = facetData["@com.sap.vocabularies.Search.v1.Facet"]["Dimensions"][0].PropertyName;
        // }

        let resultSet;
        if (query.filter.dataSource === query.sina.getAllDataSource()) {
          try {
            resultSet = this.parseDataSourceFacet(query, facetData);
          } catch (e1) {
            this.log.warn("Error occurred by parsing dataource item number " + i + ": " + e1.message);
            continue;
          }
        } else {
          if (query.filter.dataSource.type === query.sina.DataSourceType.Category) {
            continue; // ignore common attributes facets
          }
          if (facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0].PropertyType === "GeometryPolygonFacet") {
            continue;
          }
          try {
            const attributeMetadata = this.parseFacetAttribute(query, facetData);
            if (attributeMetadata.isHierarchy) {
              resultSet = hierarchyParser.parseHierarchyFacet(query, attributeMetadata, facetData);
            } else {
              resultSet = this.parseChartFacet(query, attributeMetadata, facetData);
            }
          } catch (e1) {
            let itemsInString = "";
            if (facetData.Items && Array.isArray(facetData.Items)) {
              itemsInString = JSON.stringify(facetData);
            }
            this.log.warn("Error occurred by parsing facet " + (facetData["@com.sap.vocabularies.Common.v1.Label"] || "") + "', facet position: " + i + ": " + e1.message + "; item data: " + itemsInString);
            continue;
          }
        }
        facets.push(resultSet);
      }
      return Promise.all(facets);
    }
    parseDataSourceFacet(query, facetData) {
      // for search query with datasource facet: create corresponding datasource query
      let dataSourceQuery = query;
      if (query instanceof SearchQuery) {
        dataSourceQuery = this.sina.createDataSourceQuery({
          dataSource: query.filter.dataSource,
          filter: query.filter.clone(),
          nlq: query.nlq
        });
      }

      // assemble results set items
      const items = [];
      for (let i = 0; i < facetData.Items.length; i++) {
        const cell = facetData.Items[i];

        // create filter (used when clicking on the item)
        let dataSource = this.sina.getDataSource(cell.scope);
        if (!dataSource) {
          dataSource = this.sina.createDataSource({
            type: this.sina.DataSourceType.Category,
            id: cell.ValueLow,
            label: cell.Description
          });
        }

        // create item
        items.push(this.sina._createDataSourceResultSetItem({
          dataSource: dataSource,
          dimensionValueFormatted: dataSource.labelPlural,
          measureValue: cell._Count,
          measureValueFormatted: cell._Count.toString()
        }));
      }

      // create result set
      const resultSet = this.sina._createDataSourceResultSet({
        title: query.filter.dataSource.label,
        items: items,
        query: dataSourceQuery
      });

      // init query with result set
      if (query instanceof SearchQuery) {
        return dataSourceQuery._setResultSet(resultSet);
      }
      return resultSet;
    }
    createAttributeFilterCondition(attributeId, metadata, cell) {
      if (typeof cell[attributeId] === "object" && (Object.prototype.hasOwnProperty.call(cell[attributeId], "From") || Object.prototype.hasOwnProperty.call(cell[attributeId], "From"))) {
        // Range Condition
        const finalCondition = this.sina.createComplexCondition({
          attributeLabel: metadata.label,
          valueLabel: this.formatFacetValue(cell[attributeId]),
          operator: LogicalOperator.And,
          conditions: []
        });
        let lowBoundCondition, upperBoundCondition;
        if (!cell[attributeId].From) {
          upperBoundCondition = this.sina.createSimpleCondition({
            attribute: attributeId,
            operator: ComparisonOperator.Le,
            value: typeConverter.odata2Sina(metadata.type, cell[attributeId].To)
          });
          finalCondition.conditions.push(upperBoundCondition);
        } else if (!cell[attributeId].To) {
          lowBoundCondition = this.sina.createSimpleCondition({
            attribute: attributeId,
            operator: ComparisonOperator.Ge,
            value: typeConverter.odata2Sina(metadata.type, cell[attributeId].From)
          });
          finalCondition.conditions.push(lowBoundCondition);
        } else {
          lowBoundCondition = this.sina.createSimpleCondition({
            attribute: attributeId,
            operator: ComparisonOperator.Ge,
            value: typeConverter.odata2Sina(metadata.type, cell[attributeId].From)
          });
          finalCondition.conditions.push(lowBoundCondition);
          upperBoundCondition = this.sina.createSimpleCondition({
            attribute: attributeId,
            operator: ComparisonOperator.Le,
            value: typeConverter.odata2Sina(metadata.type, cell[attributeId].To)
          });
          finalCondition.conditions.push(upperBoundCondition);
        }
        return finalCondition;
      }
      // Single Condition
      let valueLabel = typeConverter.convertValueToString(typeConverter.odata2Sina(metadata.type, cell[attributeId]));
      const textElementValue = cell[attributeId + "@com.sap.vocabularies.Common.v1.Text"];
      if (typeof textElementValue === "string" && textElementValue.length > 0) {
        if (textElementValue.startsWith("sap-icon://") === false) {
          valueLabel = textElementValue;
        }
      }
      return this.sina.createSimpleCondition({
        attributeLabel: metadata.label,
        attribute: attributeId,
        value: cell[attributeId],
        valueLabel: valueLabel
      });
    }
    formatFacetValue(value /**metadata*/) {
      const initialValue = "";
      // if (metadata.type === 'Double' || metadata.type === 'Integer') {
      //     initialValue = 0;
      // }

      if (value["@com.sap.vocabularies.Common.v1.Label"]) {
        return value["@com.sap.vocabularies.Common.v1.Label"];
      }
      if (typeof value === "object" && (Object.prototype.hasOwnProperty.call(value, "From") || Object.prototype.hasOwnProperty.call(value, "To"))) {
        value = (value.From || initialValue) + "..." + (value.To || initialValue);
      }
      return value;
    }
    parseFacetAttribute(query, facetData) {
      const dataSource = query.filter.dataSource;
      let attributeId = "";
      if (query instanceof ChartQuery && query.dimension) {
        attributeId = query.dimension;
      } else {
        if (facetData["@com.sap.vocabularies.Search.v1.Facet"] && facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions && facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0] && facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0].PropertyName) {
          attributeId = facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0].PropertyName;
        } else {
          throw new FacetsParseError();
        }
      }
      const metadata = dataSource.getAttributeMetadata(attributeId);
      return metadata;
    }
    async parseChartFacet(query, attributeMetadata, facetData) {
      const dataSource = query.filter.dataSource;
      const items = [];
      // for search query with attribute facet: create corresponding chart query
      let chartQuery = query;
      const filter = query.filter.clone();
      filter.setDataSource(dataSource); // relevant only for common attribute facets
      filter.setRootCondition(query.filter.rootCondition.clone()); // changing ds removes condition
      chartQuery = this.sina.createChartQuery({
        filter: filter,
        dimension: attributeMetadata.id,
        nlq: query.nlq
      });
      // Check whether items contains at least one icon
      // If yes, placeholder sap-icon://none shall be applied for items that have no icon in this facet

      // TODO: attributeMetadata.id + "@com.sap.vocabularies.Common.v1.Text" for facet icon is used in repo as a workaround
      // and will be replaced by attributeMetadata.usage?.AdvancedSearch?.iconUrlAttributeName
      // Facet doesn't need to be checked becaused Facet is always AdvancedSearch
      const iconPropertyName = attributeMetadata.usage?.AdvancedSearch?.iconUrlAttributeName || attributeMetadata.id + "@com.sap.vocabularies.Common.v1.Text";
      const isIconContained = facetData.Items.findIndex(item => item[iconPropertyName]?.startsWith("sap-icon://")) > -1;
      // create result set items
      for (let i = 0; i < facetData.Items.length; i++) {
        const cell = facetData.Items[i];
        const textElementValue = cell[attributeMetadata.id + "@com.sap.vocabularies.Common.v1.Text"];
        let icon = "";
        if (isIconContained === true) {
          icon = "sap-icon://none";
        }
        let dimensionValueFormatted = this.formatFacetValue(cell[attributeMetadata.id]);
        if (typeof textElementValue === "string" && textElementValue.length > 0) {
          if (textElementValue.startsWith("sap-icon://")) {
            icon = textElementValue;
          } else {
            dimensionValueFormatted = textElementValue;
            icon = cell[attributeMetadata.usage?.AdvancedSearch?.iconUrlAttributeName] || icon;
          }
        } else {
          icon = cell[attributeMetadata.usage?.AdvancedSearch?.iconUrlAttributeName] || icon;
        }
        items.push(this.sina._createChartResultSetItem({
          filterCondition: this.createAttributeFilterCondition(attributeMetadata.id, attributeMetadata, cell),
          dimensionValueFormatted: dimensionValueFormatted,
          measureValue: cell._Count,
          measureValueFormatted: cell._Count,
          icon: icon
        }));
      }

      // create result set
      const resultSet = this.sina._createChartResultSet({
        title: attributeMetadata.label,
        items: items,
        query: chartQuery
      });

      // init query with result set
      if (query instanceof SearchQuery) {
        return chartQuery._setResultSet(resultSet);
      }
      return resultSet;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.FacetParser = FacetParser;
  return __exports;
});
})();