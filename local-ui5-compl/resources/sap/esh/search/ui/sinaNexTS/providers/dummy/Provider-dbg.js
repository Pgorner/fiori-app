/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/errors", "../AbstractProvider"], function (____core_errors, ___AbstractProvider) {
  "use strict";

  const NotImplementedError = ____core_errors["NotImplementedError"];
  const AbstractProvider = ___AbstractProvider["AbstractProvider"];
  class Provider extends AbstractProvider {
    executeSearchQuery() {
      throw new NotImplementedError();
    }
    executeChartQuery() {
      throw new NotImplementedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeHierarchyQuery(query) {
      throw new NotImplementedError();
    }
    async executeSuggestionQuery() {
      throw new NotImplementedError();
    }
    id = "dummy";
    async initAsync() {
      return Promise.resolve();
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Provider = Provider;
  return __exports;
});
})();