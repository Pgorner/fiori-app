/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./BrowserPersonalizationStorage", "./FLPPersonalizationStorage", "./MemoryPersonalizationStorage"], function (__BrowserPersonalizationStorage, __FLPPersonalizationStorage, __MemoryPersonalizationStorage) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BrowserPersonalizationStorage = _interopRequireDefault(__BrowserPersonalizationStorage);
  const FLPPersonalizationStorage = _interopRequireDefault(__FLPPersonalizationStorage);
  const MemoryPersonalizationStorage = _interopRequireDefault(__MemoryPersonalizationStorage);
  async function create(personalizationStorage, isUshell, prefix) {
    if (typeof personalizationStorage === "object") {
      return personalizationStorage;
    }
    switch (personalizationStorage) {
      case "auto":
        if (isUshell) {
          return FLPPersonalizationStorage.create();
        } else {
          return BrowserPersonalizationStorage.create(prefix);
        }
      case "browser":
        return BrowserPersonalizationStorage.create(prefix);
      case "flp":
        return FLPPersonalizationStorage.create();
      case "memory":
        return MemoryPersonalizationStorage.create();
      default:
        {
          let personalizationStorageTypes = `    - 'auto' (automatic)\n    - 'browser' (browser storage)\n    - 'memory' (browser session storage)`;
          if (!isUshell) {
            personalizationStorageTypes += `\n    - 'flp' (Fiori Lauchpad, user storage service)`;
          }
          const errorText = `Unknown Personalization Storage: '${personalizationStorage}'\n\nDetails:\n${personalizationStorageTypes}\n\nYou can also provide a custom personalization storage (instance of a class, implementing the interface 'IKeyValueStore').`;
          return Promise.reject(new Error(errorText));
        }
    }
  }
  const module = {
    create: create
  };
  return module;
});
})();