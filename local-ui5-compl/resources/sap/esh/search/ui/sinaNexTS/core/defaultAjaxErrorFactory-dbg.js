/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../sina/i18n", "./errors"], function (___sina_i18n, ___errors) {
  "use strict";

  const getText = ___sina_i18n["getText"];
  const ServerErrorCode = ___errors["ServerErrorCode"];
  const ServerError = ___errors["ServerError"];
  const NoConnectionError = ___errors["NoConnectionError"];
  function createDefaultAjaxErrorFactory(props) {
    const allowedStatusCodes = props?.allowedStatusCodes ?? [200, 201, 204];
    return function defaultAjaxErrorFactory(request, response) {
      if (allowedStatusCodes.indexOf(response.status) >= 0) {
        return; // no error
      }
      if (response.status == 0) {
        return new NoConnectionError(request.url);
      }
      return new ServerError({
        request: request,
        response: response,
        code: ServerErrorCode.E001,
        message: getText("error.sina.generalServerError", [request.url, "" + response.status, response.statusText, response.data])
      });
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.createDefaultAjaxErrorFactory = createDefaultAjaxErrorFactory;
  return __exports;
});
})();