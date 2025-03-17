/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  let navigationServicePromise;
  function getNavigationService() {
    if (navigationServicePromise) {
      return navigationServicePromise;
    }
    const getServiceAsync = typeof window !== "undefined" ? window?.sap?.ushell?.["Container"]?.["getServiceAsync"] : null; // not available for sina on node.js
    if (getServiceAsync) {
      navigationServicePromise = getServiceAsync("CrossApplicationNavigation");
    } else {
      navigationServicePromise = Promise.resolve(undefined);
    }
    return navigationServicePromise;
  }
  var __exports = {
    __esModule: true
  };
  __exports.getNavigationService = getNavigationService;
  return __exports;
});
})();