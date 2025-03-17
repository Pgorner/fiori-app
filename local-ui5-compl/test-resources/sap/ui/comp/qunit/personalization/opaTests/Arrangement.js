/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/ui/test/Opa5"
], function(
	Opa5
) {
	"use strict";

	return Opa5.extend("sap.ui.comp.qunit.personalization.test.Arrangement", {
		iClearTheLocalStorageFromRtaRestart: function() {
			window.localStorage.removeItem("sap.ui.rta.restart.CUSTOMER");
			window.localStorage.removeItem("sap.ui.rta.restart.USER");
			window.localStorage.clear();
		},
		iStartMyUIComponentInViewMode: function(sComponentName) {
			return this.iStartMyUIComponent({
				componentConfig: {
					name: sComponentName,
					async: true
				},
				hash: "",
				autowait: true
			});
		}
	});

}, true);
