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
    "use strict";
    Log.info("Load typeUtilsCopy");
    var class2type = {
      "[object Boolean]": "boolean",
      "[object Number]": "number",
      "[object String]": "string",
      "[object Function]": "function",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object RegExp]": "regexp",
      "[object Object]": "object"
    };
    var type = function(obj) {
      return !obj ? String(obj) : class2type[Object.prototype.toString.call(obj)] || "object";
    };
    /**
     * Type Utilities for common variable type related tasks
     *
     * @name sap.viz.base.utils.TypeUtils
     * @class
     */
    var typeUtils = {
      /**
       * Returns a boolean value indicating whether the parameter is of type
       * function
       *
       * @param {object}
       * @returns {boolean}
       */
      // See test/unit/core.js for details concerning isFunction.
      // Since version 1.3, DOM methods and functions like alert
      // aren't supported. They return false on IE (#2968).
      isFunction: function(obj) {
        return type(obj) === "function";
      },
      /**
       * Returns a boolean value indicating whether the parameter is of type
       * array
       *
       * @param {object}
       * @returns {boolean}
       */
      isArray: Array.isArray || function(obj) {
        return type(obj) === "array";
      },
      /**
       * Returns a boolean value indicating whether the parameter is undefined or null
       *
       * @param {object}
       * @returns {boolean}
       */
      isExist: function(o) {
        if ((typeof(o) === "undefined") || (o === null)) {
          return false;
        }
        return true;
      }
    };
    return typeUtils;
  }
);
