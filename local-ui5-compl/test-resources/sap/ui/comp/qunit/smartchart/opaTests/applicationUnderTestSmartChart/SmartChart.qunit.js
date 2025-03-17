/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/core/util/MockServer",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function(
	Opa5, MockServer
) {
	"use strict";

	// Start Mockserver and Fake-LREP
	var oMockServer = new MockServer({
		rootUri: "/my/mock/data/"
	});
	oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
	oMockServer.start();

	Opa5.extendConfig({
		autoWait: true,
		async: true,
		appParams: {
			"sap-ui-animation": false
		},
		testLibs: {
			compTestLibrary: {
				viewName: "applicationUnderTestSmartChart.view.Main"
			}
		}
	});

	sap.ui.require([
		"applicationUnderTestSmartChart/test/SmartChartJourney"
	], function() {
		QUnit.start();
	});
});
