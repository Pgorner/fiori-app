/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  var AvailableProviders = /*#__PURE__*/function (AvailableProviders) {
    AvailableProviders["ABAP_ODATA"] = "abap_odata";
    AvailableProviders["HANA_ODATA"] = "hana_odata";
    AvailableProviders["INAV2"] = "inav2";
    AvailableProviders["MULTI"] = "multi";
    AvailableProviders["SAMPLE"] = "sample";
    AvailableProviders["DUMMY"] = "dummy";
    return AvailableProviders;
  }(AvailableProviders || {});
  async function _normalizeConfiguration(configuration) {
    // check whether configuration is a string with a javascript module name
    if (typeof configuration === "string") {
      configuration = configuration.trim();

      // configuration is a string with a url -> load configuration dynamically via require
      if (configuration.indexOf("/") >= 0 && configuration.indexOf("Provider") < 0 && configuration[0] !== "{") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        configuration = require(configuration);
        return await _normalizeConfiguration(configuration);
      }

      // configuration is a string with the provider name -> assemble json
      if (configuration[0] !== "{") {
        configuration = '{ "provider" : "' + configuration + '"}';
      }

      // parse json
      configuration = JSON.parse(configuration);
    }
    return configuration;
  }
  var __exports = {
    __esModule: true
  };
  __exports.AvailableProviders = AvailableProviders;
  __exports._normalizeConfiguration = _normalizeConfiguration;
  return __exports;
});
})();