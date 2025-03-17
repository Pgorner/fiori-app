/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./ajaxUtil"], function (___ajaxUtil) {
  "use strict";

  const addEncodedUrlParameters = ___ajaxUtil["addEncodedUrlParameters"];
  function requestNodePlain(properties) {
    return new Promise(resolve => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const https = properties.url.startsWith("https") ? require("https") : require("http");
      const url = addEncodedUrlParameters(properties.url, properties.parameters);
      const urlObj = new URL(url);
      const options = {
        rejectUnauthorized: false,
        //requestCert: true,
        //agent: false,
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        port: urlObj.port,
        method: properties.method,
        headers: properties.headers
      };
      if (properties.data) {
        options.headers["Content-Length"] = "" + Buffer.byteLength(properties.data);
      }
      const req = https.request(options, res => {
        let responseData = "";
        res.on("data", chunk => {
          responseData += chunk;
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            data: responseData,
            headers: res.headers
          });
        });
      });
      req.on("error", error => {
        resolve({
          status: 0,
          statusText: "" + error,
          data: "",
          headers: {}
        });
      });
      if (properties.data) {
        req.write(properties.data);
      }
      req.end();
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.requestNodePlain = requestNodePlain;
  return __exports;
});
})();