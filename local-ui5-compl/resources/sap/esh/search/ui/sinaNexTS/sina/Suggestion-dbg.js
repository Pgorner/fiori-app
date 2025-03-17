/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ResultSetItem"], function (___ResultSetItem) {
  "use strict";

  const ResultSetItem = ___ResultSetItem["ResultSetItem"];
  class Suggestion extends ResultSetItem {
    // _meta: {
    //     properties: {
    //         calculationMode: {
    //             required: true
    //         },
    //         label: {
    //             required: true
    //         }
    //     }
    // }

    type;
    calculationMode;
    label;
    object;
    constructor(properties) {
      super(properties);
      this.calculationMode = properties.calculationMode;
      this.label = properties.label;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Suggestion = Suggestion;
  return __exports;
});
})();