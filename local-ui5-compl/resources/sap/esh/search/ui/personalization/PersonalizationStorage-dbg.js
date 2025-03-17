/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Personalizer"], function (__Personalizer) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Personalizer = _interopRequireDefault(__Personalizer);
  class PersonalizationStorage {
    constructor(keyValueStore, searchModel, prefix = "default") {
      this.keyValueStore = keyValueStore;
      this.searchModel = searchModel;
      this.prefix = prefix;
    }
    isStorageOfPersonalDataAllowed() {
      return this.keyValueStore.isStorageOfPersonalDataAllowed({
        searchModel: this.searchModel
      });
    }
    saveNotDelayed() {
      return Promise.resolve();
    }
    save() {
      return this.keyValueStore.save({
        searchModel: this.searchModel
      });
    }
    getPersonalizer(key) {
      return new Personalizer(key, this);
    }
    deleteItem(key) {
      this.keyValueStore.deleteItem(key, {
        searchModel: this.searchModel
      });
    }
    getItem(key) {
      return this.keyValueStore.getItem(key, {
        searchModel: this.searchModel
      });
    }
    setItem(key, data) {
      return this.keyValueStore.setItem(key, data, {
        searchModel: this.searchModel
      });
    }
  }
  return PersonalizationStorage;
});
})();