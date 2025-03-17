/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  class TreeCache {
    data;
    active;
    constructor() {
      this.data = {};
      this.active = false;
    }
    activate() {
      this.active = true;
    }
    deActivate() {
      this.clear();
      this.active = false;
    }
    set(key, value) {
      if (!this.active) {
        return;
      }
      this.data[key] = value;
    }
    get(key) {
      if (!this.active) {
        return undefined;
      }
      return this.data[key];
    }
    clear() {
      this.data = {};
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.TreeCache = TreeCache;
  return __exports;
});
})();