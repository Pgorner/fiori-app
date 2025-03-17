/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Query"], function (___Query) {
  "use strict";

  const Query = ___Query["Query"];
  class FacetQuery extends Query {
    constructor(properties) {
      super(properties);
      this.properties = properties;
    }
    clone() {
      return new FacetQuery(this.properties);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _execute(query) {
      return Promise.resolve(null);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _formatResultSetAsync(resultSet) {
      return Promise.resolve(null);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.FacetQuery = FacetQuery;
  return __exports;
});
})();