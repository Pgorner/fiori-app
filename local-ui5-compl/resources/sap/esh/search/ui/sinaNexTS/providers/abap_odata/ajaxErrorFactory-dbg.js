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
  function ajaxErrorFactory(request, response) {
    //
    // check for repsonse data
    if (!response.data) {
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
    if (!parsedError?.error?.code) {
      return;
    }

    // parse messages
    const messages = [];
    messages.push(getText("error.sina.generalServerError2"));
    messages.push(getText("error.sina.errorCode", [parsedError.error.code]));
    if (parsedError?.error?.message?.value) {
      const value = parsedError.error.message.value.trim();
      messages.push(value);
    }

    // parse details
    const details = [];
    if (parsedError?.error?.innererror) {
      const innererror = parsedError?.error?.innererror;
      if (innererror?.application?.component_id) {
        details.push(getText("error.sina.applicationComponent", [innererror?.application?.component_id]));
      }
      if (innererror?.Error_Resolution?.SAP_Note) {
        details.push(getText("error.sina.solutionNote", [innererror?.Error_Resolution?.SAP_Note]));
      }
    }

    // create error
    return new ServerError({
      request: request,
      response: response,
      code: ServerErrorCode.E001,
      message: messages.join("\n"),
      details: details.join("\n")
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.ajaxErrorFactory = ajaxErrorFactory;
  return __exports;
});
})();