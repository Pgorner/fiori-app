/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./ajaxUtil"], function (___ajaxUtil) {
  "use strict";

  const addEncodedUrlParameters = ___ajaxUtil["addEncodedUrlParameters"];
  async function requestNodeFetch(properties) {
    // Node.js for testing only!!!
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fetch = require("node-fetch");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const https = properties.url.startsWith("https") ? require("https") : require("http");
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    const config = {
      agent,
      headers: properties.headers,
      method: properties.method
    };
    if (typeof properties.data !== "undefined") {
      config.body = properties.data;
    }
    const url = addEncodedUrlParameters(properties.url, properties.parameters);
    const mapToObj = headerMap => {
      // node-fetch puts every value in an array somehow.
      // here we unpack it if array only has one value.
      const responseHeaders = {};
      for (const key in headerMap) {
        const value = headerMap[key];
        if (value instanceof Array && value.length === 1) {
          responseHeaders[key] = value[0];
        } else {
          responseHeaders[key] = value;
        }
      }
      return responseHeaders;
    };
    try {
      const res = await fetch(url, config);
      const text = await res.text();
      return {
        status: res.status,
        statusText: res.statusText,
        data: text || "",
        headers: mapToObj(res.headers.raw())
      };
    } catch (error) {
      return {
        status: 0,
        statusText: "" + error,
        data: "",
        headers: {}
      };
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.requestNodeFetch = requestNodeFetch;
  return __exports;
});
})();