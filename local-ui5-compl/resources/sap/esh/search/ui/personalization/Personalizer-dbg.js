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

  class Personalizer {
    constructor(key, personalizationStorageInstance) {
      this.key = key;
      this.personalizationStorageInstance = personalizationStorageInstance;
      this.key = key;
      this.personalizationStorageInstance = personalizationStorageInstance;
    }
    getKey() {
      return this.key;
    }
    setPersData(data) {
      // sap.m.TablePersoController uses deferred.done()
      // NOT to convert to promise
      return jQuery.Deferred().resolve(this.personalizationStorageInstance.setItem(this.key, data));
    }
    getPersData() {
      // sap.m.TablePersoController uses deferred.done()
      // NOT to convert to promise
      return jQuery.Deferred().resolve(this.personalizationStorageInstance.getItem(this.key));
    }
    getResetPersData() {
      // sap.m.TablePersoController uses deferred.done()
      // NOT to convert to promise
      return jQuery.Deferred().resolve(this.personalizationStorageInstance.getItem(this.key + "INITIAL"));
    }
  }
  return Personalizer;
});
})();