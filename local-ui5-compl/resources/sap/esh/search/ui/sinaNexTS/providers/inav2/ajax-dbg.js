/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../core/AjaxClient", "../../core/defaultAjaxErrorFactory", "./ajaxErrorFactory"], function (____core_AjaxClient, ____core_defaultAjaxErrorFactory, ___ajaxErrorFactory) {
  "use strict";

  const AjaxClient = ____core_AjaxClient["AjaxClient"];
  const createDefaultAjaxErrorFactory = ____core_defaultAjaxErrorFactory["createDefaultAjaxErrorFactory"];
  const ajaxErrorFactory = ___ajaxErrorFactory["ajaxErrorFactory"];
  function createAjaxClient(properties) {
    const defaultProperties = {
      csrf: true,
      csrfByPassCache: true,
      errorFactories: [ajaxErrorFactory, createDefaultAjaxErrorFactory()]
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