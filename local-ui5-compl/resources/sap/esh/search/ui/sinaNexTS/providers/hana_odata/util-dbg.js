/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../core/Log"], function (____core_Log) {
  "use strict";

  const Log = ____core_Log["Log"];
  async function handleError(fetcher, parser) {
    //
    async function handleError(error) {
      let serverError;
      switch (error.name) {
        case "ServerError":
          serverError = error;
          if (!serverError.response.dataJSON) {
            throw error;
          }
          try {
            const resultSet = await parser(serverError.response.dataJSON);
            resultSet.addError(error);
            return resultSet;
          } catch (parseError) {
            const log = new Log("hana odata util");
            log.warn("Error while parsing error response: " + parseError);
            throw error;
          }
        default:
          throw error;
      }
    }
    let response;
    try {
      response = await fetcher();
    } catch (e) {
      return await handleError(e);
    }
    return await parser(response);
  }
  var __exports = {
    __esModule: true
  };
  __exports.handleError = handleError;
  return __exports;
});
})();