/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){"use strict";class s{show(){}hide(){}setBusy(){}}class e{model;constructor(s){this.model=s;this.model.setProperty("/isBusy",false)}show(){this.model.setProperty("/isBusy",true)}hide(){this.model.setProperty("/isBusy",false)}setBusy(s){if(s){this.show()}else{this.hide()}}}var t={__esModule:true};t.DummyBusyIndicator=s;t.BusyIndicator=e;return t})})();
//# sourceMappingURL=BusyIndicator.js.map