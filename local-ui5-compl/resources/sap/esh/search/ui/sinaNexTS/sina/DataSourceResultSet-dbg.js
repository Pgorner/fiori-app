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
  class DataSourceResultSet extends FacetResultSet {
    type = (() => FacetType.DataSource)();
  }
  var __exports = {
    __esModule: true
  };
  __exports.DataSourceResultSet = DataSourceResultSet;
  return __exports;
});
})();