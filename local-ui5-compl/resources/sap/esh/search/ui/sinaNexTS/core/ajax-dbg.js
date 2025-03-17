/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./requestNodePlain", "./requestBrowser", "./core", "./Log"], function (___requestNodePlain, ___requestBrowser, ___core, ___Log) {
  "use strict";

  /* eslint-disable @typescript-eslint/no-this-alias */
  const requestNodePlain = ___requestNodePlain["requestNodePlain"];
  const requestBrowser = ___requestBrowser["requestBrowser"];
  const isBrowserEnv = ___core["isBrowserEnv"];
  const Log = ___Log["Log"];
  async function request(properties) {
    let result;
    if (isBrowserEnv()) {
      result = await requestBrowser(properties);
    } else {
      result = await requestNodePlain(properties);
    }
    try {
      delete result.dataJSON;
      result.dataJSON = JSON.parse(result.data);
    } catch (e) {
      const log = new Log("ajax");
      log.warn("Could not parse response data as JSON: " + result?.data + " (" + e + ")");
    }
    return result;
  }
  function applyResponseFormattersAndUpdateJSON(request, response, formatters) {
    const data = response.data;
    for (const formatter of formatters) {
      response = formatter(request, response);
    }
    if (response.data !== data) {
      // in case data changed also update dataJSON
      try {
        delete response.dataJSON;
        response.dataJSON = JSON.parse(response.data);
      } catch (e) {
        const log = new Log("ajax");
        log.warn("Could not parse response data as JSON: " + response?.data + " (" + e + ")");
      }
    }
    return response;
  }
  var __exports = {
    __esModule: true
  };
  __exports.request = request;
  __exports.applyResponseFormattersAndUpdateJSON = applyResponseFormattersAndUpdateJSON;
  return __exports;
});
})();