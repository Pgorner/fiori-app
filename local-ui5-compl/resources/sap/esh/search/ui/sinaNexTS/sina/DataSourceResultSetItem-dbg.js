/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FacetResultSetItem"], function (___FacetResultSetItem) {
  "use strict";

  const FacetResultSetItem = ___FacetResultSetItem["FacetResultSetItem"];
  class DataSourceResultSetItem extends FacetResultSetItem {
    // _meta: {
    //     properties: {
    //         dataSource: {
    //             required: true
    //         }
    //     }
    // }
    dataSource;
    constructor(properties) {
      super(properties);
      this.dataSource = properties.dataSource ?? this.dataSource;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.DataSourceResultSetItem = DataSourceResultSetItem;
  return __exports;
});
})();