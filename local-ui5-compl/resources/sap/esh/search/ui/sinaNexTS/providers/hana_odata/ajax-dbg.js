/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../core/AjaxClient", "./ajaxErrorFactory", "./ajaxErrorFactoryDeprecated", "../../core/defaultAjaxErrorFactory"], function (____core_AjaxClient, ___ajaxErrorFactory, ___ajaxErrorFactoryDeprecated, ____core_defaultAjaxErrorFactory) {
  "use strict";

  const AjaxClient = ____core_AjaxClient["AjaxClient"];
  const ajaxErrorFactory = ___ajaxErrorFactory["ajaxErrorFactory"];
  const deprecatedAjaxErrorFactory = ___ajaxErrorFactoryDeprecated["deprecatedAjaxErrorFactory"];
  const createDefaultAjaxErrorFactory = ____core_defaultAjaxErrorFactory["createDefaultAjaxErrorFactory"];
  function createAjaxClient(properties) {
    const defaultProperties = {
      errorFactories: [ajaxErrorFactory, deprecatedAjaxErrorFactory, createDefaultAjaxErrorFactory({
        allowedStatusCodes: [200, 201, 204, 300]
      })],
      errorFormatters: []
    };
    return new AjaxClient(Object.assign(defaultProperties, properties));
  }
  var __exports = {
    __esModule: true
  };
  __exports.createAjaxClient = createAjaxClient;
  return __exports;
});
})();