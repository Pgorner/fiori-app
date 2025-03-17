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
  class FacetResultSet extends ResultSet {
    type;
    constructor(properties) {
      super(properties);
    }
    toString() {
      const result = [];
      result.push("--Facet");
      result.push(super.toString());
      return result.join("\n");
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.FacetResultSet = FacetResultSet;
  return __exports;
});
})();