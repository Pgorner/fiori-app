/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FacetResultSet", "./FacetType"], function (___FacetResultSet, ___FacetType) {
  "use strict";

  const FacetResultSet = ___FacetResultSet["FacetResultSet"];
  const FacetType = ___FacetType["FacetType"];
  class HierarchyResultSet extends FacetResultSet {
    type = (() => FacetType.Hierarchy)();
    node;
    constructor(properties) {
      super(properties);
      this.node = properties.node;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.HierarchyResultSet = HierarchyResultSet;
  return __exports;
});
})();