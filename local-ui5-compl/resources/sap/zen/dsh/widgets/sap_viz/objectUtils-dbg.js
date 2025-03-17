/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log"
  ],
  function(Log) {
    Log.info("Load objectUtils");
    return {
      clone: function(obj) {
        if (typeof(obj) !== "object"){
          return obj;
        }
        if (obj === null)
          return obj;
        var o = obj.constructor === Array ? [] : {};
        for (var i in obj) {
          o[i] = typeof obj[i] === "object" ? arguments.callee.call(null, obj[i]) : obj[i];
        }
        return o;
      }
    };
  }
);
