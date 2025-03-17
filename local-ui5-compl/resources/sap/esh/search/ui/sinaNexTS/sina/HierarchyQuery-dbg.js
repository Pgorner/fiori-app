/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DataSourceType", "./FacetQuery"], function (___DataSourceType, ___FacetQuery) {
  "use strict";

  const DataSourceSubType = ___DataSourceType["DataSourceSubType"];
  const DataSourceType = ___DataSourceType["DataSourceType"];
  const FacetQuery = ___FacetQuery["FacetQuery"];
  class HierarchyQuery extends FacetQuery {
    attributeId;
    nodeId;
    constructor(properties) {
      super(properties);
      this.top = properties.top ?? 30;
      this.attributeId = properties.attributeId;
      this.nodeId = properties.nodeId;
    }
    equals(other) {
      return other instanceof HierarchyQuery && super.equals(other) && this.nodeId === other.nodeId;
    }
    clone() {
      return new HierarchyQuery({
        label: this.label,
        icon: this.icon,
        top: this.top,
        skip: this.skip,
        nlq: this.nlq,
        sortOrder: this.sortOrder,
        filter: this.filter.clone(),
        searchTerm: this.getSearchTerm(),
        sina: this.sina,
        attributeId: this.attributeId,
        nodeId: this.nodeId
      });
    }
    async _execute(query) {
      return this._doExecuteHierarchyQuery(query);
    }
    async _doExecuteHierarchyQuery(query) {
      const transformedQuery = this._filteredQueryTransform(query);
      const resultSet = await this.sina.provider.executeHierarchyQuery(transformedQuery);
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
  __exports.HierarchyQuery = HierarchyQuery;
  return __exports;
});
})();