/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/mdc/LinkIntegrationTesting/test/PageObjectJourney",
	"testutils/opa/TestLibrary"
], function(
	Opa5,
	RTAJourney
) {
	"use strict";

	Opa5.extendConfig({
		autoWait: true,
		async: true,
		appParams: {
			"sap-ui-animation": false
		},
		testLibs: {
			mdcTestLibrary: {
				viewName: "sap.ui.mdc.LinkIntegrationTesting.appUnderTestPageObject.view.App"
			}
		}
	});

});
