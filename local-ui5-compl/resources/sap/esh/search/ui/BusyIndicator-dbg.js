/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  class DummyBusyIndicator {
    show() {
      //
    }
    hide() {
      //
    }
    setBusy() {
      //
    }
  }
  class BusyIndicator {
    model;
    constructor(model) {
      this.model = model;
      this.model.setProperty("/isBusy", false);
    }
    show() {
      this.model.setProperty("/isBusy", true);
    }
    hide() {
      this.model.setProperty("/isBusy", false);
    }
    setBusy(isBusy) {
      if (isBusy) {
        this.show();
      } else {
        this.hide();
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.DummyBusyIndicator = DummyBusyIndicator;
  __exports.BusyIndicator = BusyIndicator;
  return __exports;
});
})();