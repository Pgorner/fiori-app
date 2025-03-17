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
    // check for response data
    if (!response?.data) {
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
    if (!parsedError?.Error?.Code || !parsedError?.Error?.Message) {
      return;
    }

    // parse error details
    const detailMessages = [];
    if (parsedError?.ErrorDetails) {
      for (let i = 0; i < parsedError.ErrorDetails.length; ++i) {
        const errorDetail = parsedError.ErrorDetails[i];
        detailMessages.push(errorDetail.Code + ": " + errorDetail.Message);
      }
    }

    // parse additional messages
    if (parsedError?.Messages) {
      for (let j = 0; j < parsedError.Messages.length; ++j) {
        const errorMessage = parsedError.Messages[j];
        detailMessages.push(errorMessage.Number + ": " + errorMessage.Text + " (" + errorMessage.Type + ")");
      }
    }

    // create error
    return new ServerError({
      request: request,
      response: response,
      code: ServerErrorCode.E001,
      message: getText("error.sina.serverError", [parsedError.Error.Code, parsedError.Error.Message]),
      details: detailMessages.join("\n")
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.ajaxErrorFactory = ajaxErrorFactory;
  return __exports;
});
})();