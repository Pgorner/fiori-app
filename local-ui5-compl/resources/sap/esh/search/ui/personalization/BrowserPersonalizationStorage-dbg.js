/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/util/Storage", "../error/errors", "sap/base/Log"], function (Storage, ___error_errors, Log) {
  "use strict";

  const ESHUIError = ___error_errors["ESHUIError"];
  class BrowserPersonalizationStorage {
    static async create(prefix) {
      return Promise.resolve(new BrowserPersonalizationStorage(prefix));
    }
    storage;
    _oLogger = (() => Log.getLogger("sap.esh.search.ui.personalization.BrowserPersonalizationStorage"))();
    constructor(prefix = "default", type = "local") {
      this.prefix = prefix;
      this.prefix = prefix + ".Search.Personalization.";
      this._oLogger.debug("Using BrowserPersonalizationStorage with prefix: " + this.prefix);
      this.storage = new Storage(type);
      if (!this.storage.isSupported()) {
        throw new Error(`Storage of type ${type} is not supported by UI5 in this environment`);
      }
    }
    isStorageOfPersonalDataAllowed() {
      return true;
    }
    save() {
      return Promise.resolve();
    }
    getItem(key) {
      this._oLogger.debug("getItem: " + this.prefix + key);
      return this.storage.get(this.prefix + key);
    }
    setItem(key, data) {
      this._oLogger.debug("setItem: " + this.prefix + key);
      // officially this store only accepts data which can be serialized using JSON.stringify, see
      // https://sapui5.hana.ondemand.com/#/api/module:sap/ui/util/Storage
      try {
        JSON.stringify(data);
        return this.storage.put(this.prefix + key, data);
      } catch (err) {
        const serializationError = new ESHUIError("data with key '" + key + "' is not serializable");
        serializationError.previous = err;
        this._oLogger.error(serializationError.message);
      }
    }
    deleteItem(key) {
      this._oLogger.debug("deleteItem: " + this.prefix + key);
      this.storage.remove(this.prefix + key);
    }
  }
  return BrowserPersonalizationStorage;
});
})();