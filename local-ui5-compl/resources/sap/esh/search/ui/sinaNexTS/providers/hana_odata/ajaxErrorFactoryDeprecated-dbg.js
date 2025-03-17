/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../core/errors", "../../sina/i18n"], function (____core_errors, ____sina_i18n) {
  "use strict";

  const ServerErrorCode = ____core_errors["ServerErrorCode"];
  const ServerError = ____core_errors["ServerError"];
  const getText = ____sina_i18n["getText"];
  function deprecatedAjaxErrorFactory(request, response) {
    //
    // check for response data and http status
    if (response.status !== 500 || !response.data) {
      return;
    }

    // check for json
    const parsedError = response.dataJSON;
    if (!parsedError) {
      return;
    }

    // check for error
    if (typeof parsedError !== "object") {
      return;
    }
    if (!parsedError.code && !parsedError.message && !parsedError.details) {
      return;
    }

    // parse messages
    const messages = [];
    messages.push(getText("error.sina.searchServiceCallFailed"));
    if (parsedError?.code) {
      messages.push(getText("error.sina.errorCode", [parsedError.code]));
    }
    if (parsedError?.message) {
      messages.push(getText("error.sina.errorMessage", [parsedError.message]));
    }

    // create error
    return new ServerError({
      request: request,
      response: response,
      code: ServerErrorCode.E001,
      message: messages.join("\n"),
      details: "" + parsedError.details
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.deprecatedAjaxErrorFactory = deprecatedAjaxErrorFactory;
  return __exports;
});
})();