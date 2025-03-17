/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject"], function (___SinaObject) {
  "use strict";

  const SinaObject = ___SinaObject["SinaObject"];
  class Capabilities extends SinaObject {
    fuzzy = false;
    nlq = false;
    constructor(properties) {
      super(properties);
      this.fuzzy = properties.fuzzy ?? false;
      this.nlq = properties.nlq ?? false;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Capabilities = Capabilities;
  return __exports;
});
})();