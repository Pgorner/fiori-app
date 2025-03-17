/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
  "use strict";

  // =========================================================================
  // create object with prototype
  // =========================================================================
  function object(prototype) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const TmpFunction = function () {};
    TmpFunction.prototype = prototype;
    return new TmpFunction();
  }

  // =========================================================================
  // extend object
  // =========================================================================
  function extend(o1, o2) {
    for (const key in o2) {
      o1[key] = o2[key];
    }
    return o1;
  }

  // =========================================================================
  // first character to upper
  // =========================================================================
  function firstCharToUpper(text, removeUnderscore) {
    if (removeUnderscore) {
      if (text[0] === "_") {
        text = text.slice(1);
      }
    }
    return text[0].toUpperCase() + text.slice(1);
  }

  // =========================================================================
  // is list
  // =========================================================================
  function isList(obj) {
    if (Object.prototype.toString.call(obj) === "[object Array]") {
      return true;
    }
    return false;
  }

  // =========================================================================
  // is object (array!=object)
  // =========================================================================
  function isObject(obj) {
    if (isList(obj)) {
      return false;
    }
    return typeof obj === "object";
  }

  // =========================================================================
  // is empty object
  // =========================================================================
  function isEmptyObject(obj) {
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }

  // =========================================================================
  // is function
  // =========================================================================
  function isFunction(obj) {
    return typeof obj === "function";
  }

  // =========================================================================
  // is string
  // =========================================================================
  function isString(obj) {
    return typeof obj === "string";
  }

  // =========================================================================
  // is simple (= string, number  but not list, object, function)
  // =========================================================================
  function isSimple(obj) {
    return typeof obj !== "object" && typeof obj !== "function";
  }

  // =========================================================================
  // generic equals
  // =========================================================================
  function equals(o1, o2, ordered) {
    if (isList(o1)) {
      return _equalsList(o1, o2, ordered);
    }
    if (isObject(o1)) {
      return _equalsObject(o1, o2, ordered);
    }
    return o1 === o2;
  }
  function _equalsList(l1, l2, ordered) {
    if (ordered === undefined) {
      ordered = true;
    }
    if (l1.length !== l2.length) {
      return false;
    }
    if (ordered) {
      // 1) consider order
      for (let i = 0; i < l1.length; ++i) {
        if (!equals(l1[i], l2[i], ordered)) {
          return false;
        }
      }
      return true;
    }
    // 2) do not consider order
    const matched = {};
    for (let j = 0; j < l1.length; ++j) {
      const element1 = l1[j];
      let match = false;
      for (let k = 0; k < l2.length; ++k) {
        const element2 = l2[k];
        if (matched[k]) {
          continue;
        }
        if (equals(element1, element2, ordered)) {
          match = true;
          matched[k] = true;
          break;
        }
      }
      if (!match) {
        return false;
      }
    }
    return true;
  }
  function _equalsObject(o1, o2, ordered) {
    if (o1.equals) {
      return o1.equals(o2);
    }
    if (!isObject(o2)) {
      return false;
    }
    for (const property in o1) {
      const propertyValue1 = o1[property];
      const propertyValue2 = o2[property];
      if (!equals(propertyValue1, propertyValue2, ordered)) {
        return false;
      }
    }
    return true;
  }

  // =========================================================================
  // generic clone
  // =========================================================================
  function clone(obj) {
    if (isList(obj)) {
      return _cloneList(obj);
    }
    if (isObject(obj)) {
      return _cloneObject(obj);
    }
    return obj;
  }
  function _cloneList(list) {
    const cloned = [];
    for (let i = 0; i < list.length; ++i) {
      const element = list[i];
      cloned.push(clone(element));
    }
    return cloned;
  }
  function _cloneObject(obj) {
    if (obj.clone) {
      return obj.clone();
    }
    const cloned = {};
    for (const property in obj) {
      const value = obj[property];
      cloned[property] = clone(value);
    }
    return cloned;
  }

  // =========================================================================
  // generate id
  // =========================================================================
  let maxId = 0;
  function generateId() {
    return "#" + ++maxId;
  }

  // =========================================================================
  // generate guid
  // =========================================================================
  function generateGuid() {
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c == "x" ? r : r & 0x3 | 0x8;
      return v.toString(16).toUpperCase();
    });
  }

  // =========================================================================
  // executeSequentialAsync
  // =========================================================================
  async function executeSequentialAsync(tasks, caller) {
    if (!tasks) {
      return Promise.resolve(); // eslint-disable-line new-cap
    }
    const execute = function (index) {
      if (index >= tasks.length) {
        return undefined;
      }
      const task = tasks[index];
      return Promise.resolve().then(function () {
        if (caller) {
          return caller(task);
        }
        return task();
      }).then(function () {
        return execute(index + 1);
      });
    };
    return execute(0);
  }

  // =========================================================================
  // access deep property in object
  // =========================================================================
  function getProperty(obj, path) {
    let result = obj;
    for (const pathPart of path) {
      result = result[pathPart];
      if (typeof result === "undefined") {
        return undefined;
      }
    }
    return result;
  }
  function isBrowserEnv() {
    return typeof window !== "undefined";
  }
  var __exports = {
    __esModule: true
  };
  __exports.object = object;
  __exports.extend = extend;
  __exports.firstCharToUpper = firstCharToUpper;
  __exports.isList = isList;
  __exports.isObject = isObject;
  __exports.isEmptyObject = isEmptyObject;
  __exports.isFunction = isFunction;
  __exports.isString = isString;
  __exports.isSimple = isSimple;
  __exports.equals = equals;
  __exports._equalsList = _equalsList;
  __exports._equalsObject = _equalsObject;
  __exports.clone = clone;
  __exports._cloneList = _cloneList;
  __exports._cloneObject = _cloneObject;
  __exports.generateId = generateId;
  __exports.generateGuid = generateGuid;
  __exports.executeSequentialAsync = executeSequentialAsync;
  __exports.getProperty = getProperty;
  __exports.isBrowserEnv = isBrowserEnv;
  return __exports;
});
})();