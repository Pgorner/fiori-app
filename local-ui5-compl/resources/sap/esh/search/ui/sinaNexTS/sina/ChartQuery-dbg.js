/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../core/core", "./DataSourceType", "./FacetQuery"], function (core, ___DataSourceType, ___FacetQuery) {
  "use strict";

  const DataSourceSubType = ___DataSourceType["DataSourceSubType"];
  const DataSourceType = ___DataSourceType["DataSourceType"];
  const FacetQuery = ___FacetQuery["FacetQuery"];
  class ChartQuery extends FacetQuery {
    // _meta: {
    //     properties: {
    //         top: {
    //             default: 5 // top is defined in base class query, this just overwrites the default value
    //         },
    //         dimension: {
    //             required: true
    //         }
    //     }
    // }

    top = 5;
    dimension;
    constructor(properties) {
      super(properties);
      this.top = properties.top ?? this.top;
      this.dimension = properties.dimension ?? this.dimension;
    }
    equals(other) {
      return other instanceof ChartQuery && super.equals(other) && this.dimension === other.dimension;
    }
    clone() {
      return new ChartQuery({
        label: this.label,
        icon: this.icon,
        skip: this.skip,
        top: this.top,
        nlq: this.nlq,
        sortOrder: this.sortOrder,
        filter: this.filter.clone(),
        sina: this.sina,
        dimension: this.dimension
      });
    }
    async _formatResultSetAsync(resultSet) {
      return core.executeSequentialAsync(this.sina.chartResultSetFormatters, function (formatter) {
        return formatter.formatAsync(resultSet);
      });
    }
    async _execute(query) {
      return this._doExecuteChartQuery(query);
    }
    async _doExecuteChartQuery(query) {
      const transformedQuery = this._filteredQueryTransform(query);
      const resultSet = await this.sina.provider.executeChartQuery(transformedQuery);
      return this._filteredQueryBackTransform(query, resultSet);
    }
    _filteredQueryTransform(query) {
      return this._genericFilteredQueryTransform(query);
    }
    _filteredQueryBackTransform(query, resultSet) {
      if (query.filter.dataSource.type !== DataSourceType.BusinessObject || query.filter.dataSource.subType !== DataSourceSubType.Filtered) {
        return resultSet;
      }
      resultSet.query = query;
      return resultSet;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ChartQuery = ChartQuery;
  return __exports;
});
})();