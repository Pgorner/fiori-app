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

  class MemoryPersonalizationStorage {
    static async create() {
      return Promise.resolve(new MemoryPersonalizationStorage());
    }
    dataMap;
    constructor() {
      this.dataMap = {};
    }
    isStorageOfPersonalDataAllowed() {
      return true;
    }
    save() {
      return Promise.resolve();
    }
    getItem(key) {
      return this.dataMap[key];
    }
    setItem(key, data) {
      this.dataMap[key] = data;
      return true;
    }
    deleteItem(key) {
      delete this.dataMap[key];
    }
  }
  return MemoryPersonalizationStorage;
});
})();