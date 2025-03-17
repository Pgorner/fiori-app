/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  function encodeUrlParameters(parameters) {
    const result = [];
    for (const name in parameters) {
      const value = parameters[name];
      result.push(encodeURIComponent(name) + "=" + encodeURIComponent(value + ""));
    }
    return result.join("&");
  }
  function addEncodedUrlParameters(url, parameters) {
    if (!parameters) {
      return url;
    }
    const encodedParameters = encodeUrlParameters(parameters);
    if (encodedParameters.length > 0) {
      const index = url.indexOf("?");
      if (index >= 0) {
        url = url.slice(0, index) + "?" + encodedParameters + "&" + url.slice(index + 1);
      } else {
        url += "?" + encodedParameters;
      }
    }
    return url;
  }
  function parseHeaders(header) {
    const headers = {};
    const lines = header.split("\n");
    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      const index = line.indexOf(":");
      if (index >= 0) {
        const name = line.slice(0, index).toLowerCase(); // headers are case insensitive -> normalize to lower case
        const value = line.slice(index + 1);
        headers[name] = value.trim();
      }
    }
    return headers;
  }
  function isNumberStringBooleanRecord(data) {
    for (const entry in data) {
      if (typeof data[entry] !== "boolean" && typeof data[entry] !== "string" && typeof data[entry] !== "number") {
        return false;
      }
    }
    return true;
  }
  var __exports = {
    __esModule: true
  };
  __exports.encodeUrlParameters = encodeUrlParameters;
  __exports.addEncodedUrlParameters = addEncodedUrlParameters;
  __exports.parseHeaders = parseHeaders;
  __exports.isNumberStringBooleanRecord = isNumberStringBooleanRecord;
  return __exports;
});
})();