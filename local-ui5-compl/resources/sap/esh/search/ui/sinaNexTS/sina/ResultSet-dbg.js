/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject", "../core/Log", "../core/core"], function (___SinaObject, ___core_Log, core) {
  "use strict";

  const SinaObject = ___SinaObject["SinaObject"];
  const Log = ___core_Log["Log"];
  class ResultSet extends SinaObject {
    // _meta: {
    //     properties: {
    //         id: {
    //             required: false,
    //             default: function () {
    //                 return core.generateId();
    //             }
    //         },
    //         title: {
    //             required: true
    //         },
    //         items: {
    //             required: false,
    //             default: function () {
    //                 return [];
    //             },
    //             aggregation: true
    //         },
    //         query: {
    //             required: true
    //         },
    //         log: {
    //             required: false,
    //             default: function () {
    //                 return new Log();
    //             }
    //         }
    //     }
    // },

    id = (() => core.generateId())();
    title;
    items = [];
    query;
    log = (() => new Log())();
    errors = [];
    constructor(properties) {
      super(properties);
      this.id = properties.id ?? this.id;
      this.title = properties.title ?? this.title;
      this.setItems(properties.items || []);
      this.query = properties.query ?? this.query;
      this.log = properties.log ?? this.log;
    }
    setItems(items) {
      if (!Array.isArray(items) || items.length < 1) {
        return this;
      }
      this.items = [];
      for (let i = 0; i < items?.length; i++) {
        const item = items[i];
        item.parent = this;
        this.items.push(item);
      }
      return this;
    }
    toString() {
      const result = [];
      for (let i = 0; i < this.items.length; ++i) {
        const item = this.items[i];
        result.push(item.toString());
      }
      return result.join("\n");
    }
    hasErrors() {
      return this.errors.length > 0;
    }
    getErrors() {
      return this.errors;
    }
    addError(error) {
      this.errors.push(error);
    }
    addErrors(errors) {
      this.errors.push(...errors);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ResultSet = ResultSet;
  return __exports;
});
})();