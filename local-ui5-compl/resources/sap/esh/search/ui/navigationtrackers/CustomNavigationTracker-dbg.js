/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../error/errors"], function (__errors) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const errors = _interopRequireDefault(__errors);
  function generateCustomNavigationTracker(model) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return navigationTarget => {
      try {
        model.config.beforeNavigation(model);
      } catch (err) {
        const oError = new errors.ConfigurationExitError("beforeNavigation", model.config.applicationComponent, err);
        throw oError;
      }
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.generateCustomNavigationTracker = generateCustomNavigationTracker;
  return __exports;
});
})();