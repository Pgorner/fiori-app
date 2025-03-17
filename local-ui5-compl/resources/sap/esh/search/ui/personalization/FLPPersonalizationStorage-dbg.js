/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ushell/Container"], function (Container) {
  "use strict";

  class FLPPersonalizationStorage {
    static async create() {
      const service = await Container.getServiceAsync("PersonalizationV2");
      const container = await service.getContainer("ushellSearchPersoServiceContainer", {
        validity: Infinity
      },
      // store data forever
      null);
      return new FLPPersonalizationStorage(container);
    }
    eshIsStorageOfPersonalDataAllowedKey = "ESH-IsStorageOfPersonalDataAllowed";
    constructor(container) {
      this.container = container;
    }
    async deletePersonalData() {
      //
    }
    setIsStorageOfPersonalDataAllowed(isAllowed) {
      this.setItem(this.eshIsStorageOfPersonalDataAllowedKey, isAllowed);
    }
    isStorageOfPersonalDataAllowed() {
      const isAllowed = this.getItem(this.eshIsStorageOfPersonalDataAllowedKey);
      if (typeof isAllowed === "boolean") {
        return isAllowed;
      }
      return true;
    }
    save() {
      return this.container.save(0);
    }
    getItem(key) {
      key = this.limitLength(key);
      return this.container.getItemValue(key);
    }
    setItem(key, data) {
      key = this.limitLength(key);
      const oldData = this.getItem(key);
      if (JSON.stringify(oldData) === JSON.stringify(data)) {
        return true;
      }
      this.container.setItemValue(key, data);
      this.save();
      return true;
    }
    deleteItem(key) {
      this.container.deleteItem(key);
    }
    limitLength(key) {
      return key.slice(-40);
    }
  }
  return FLPPersonalizationStorage;
});
})();