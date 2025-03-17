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
  class ChartResultSetItem extends FacetResultSetItem {
    // _meta: {
    //     properties: {
    //         filterCondition: {
    //             required: true
    //         }
    //     }
    // }

    filterCondition;
    icon;
    constructor(properties) {
      super(properties);
      this.filterCondition = properties.filterCondition ?? this.filterCondition;
      this.icon = properties.icon;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ChartResultSetItem = ChartResultSetItem;
  return __exports;
});
})();