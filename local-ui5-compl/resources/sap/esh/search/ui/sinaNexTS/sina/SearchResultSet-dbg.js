/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ResultSet"], function (___ResultSet) {
  "use strict";

  const ResultSet = ___ResultSet["ResultSet"];
  class SearchResultSet extends ResultSet {
    // _meta: {
    //     properties: {
    //         facets: {
    //             required: false,
    //             default: function () {
    //                 return [];
    //             }
    //         },
    //         totalCount: {
    //             required: true
    //         },
    //     }
    // },
    facets = [];
    totalCount;
    nlqResult;
    hierarchyNodePaths = [];
    constructor(properties) {
      super(properties);
      this.facets = properties.facets ?? this.facets;
      this.totalCount = properties.totalCount ?? this.totalCount;
      this.hierarchyNodePaths = properties.hierarchyNodePaths ?? this.hierarchyNodePaths;
      this.nlqResult = properties.nlqResult;
    }
    toString(...args) {
      const result = [];
      result.push(ResultSet.prototype.toString.apply(this, args));
      for (let i = 0; i < this.facets.length; ++i) {
        const facet = this.facets[i];
        result.push(facet.toString());
      }
      return result.join("\n");
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SearchResultSet = SearchResultSet;
  return __exports;
});
})();