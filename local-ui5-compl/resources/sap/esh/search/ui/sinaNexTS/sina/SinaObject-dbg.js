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

  class SinaObject {
    sina;
    /**
     * @deprecated use native private properties instead
     */
    _private = {};
    constructor(properties = {}) {
      this.sina = properties.sina ?? this.sina;
      this._private = properties._private ?? this._private;
    }
    getSina() {
      return this.sina;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SinaObject = SinaObject;
  return __exports;
});
})();