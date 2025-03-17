/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FacetQuery"], function (___FacetQuery) {
  "use strict";

  const FacetQuery = ___FacetQuery["FacetQuery"];
  class DataSourceQuery extends FacetQuery {
    dataSource;
    constructor(properties) {
      super(properties);
      this.dataSource = properties.dataSource ?? this.dataSource;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.DataSourceQuery = DataSourceQuery;
  return __exports;
});
})();