/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./ajaxUtil"], function (___ajaxUtil) {
  "use strict";

  const addEncodedUrlParameters = ___ajaxUtil["addEncodedUrlParameters"];
  const parseHeaders = ___ajaxUtil["parseHeaders"];
  async function requestBrowser(properties) {
    return new Promise(function (resolve) {
      // Browser
      // new http request
      const xhttp = new XMLHttpRequest();

      // todo
      // document github
      // pull request
      // manual test
      // - search request
      // - chart request
      // - suggestion request
      // - hierarchy request
      // - error without result set
      // - test csrf renewal
      // - s/4
      // - repoexplorer
      // - initial duplicate error siutation
      // - fallback abap_odata, dummy

      // callback handler
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          resolve({
            data: xhttp.responseText,
            headers: parseHeaders(xhttp.getAllResponseHeaders()),
            status: xhttp.status,
            statusText: xhttp.statusText
          });
          return;
        }
      };

      // add url parameters to url
      const url = addEncodedUrlParameters(properties.url, properties.parameters);

      // write headers to http request
      xhttp.open(properties.method, url, true);
      for (const headerName in properties.headers) {
        const headerValue = properties.headers[headerName];
        xhttp.setRequestHeader(headerName, headerValue);
      }

      // send
      xhttp.send(properties.data);
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.requestBrowser = requestBrowser;
  return __exports;
});
})();