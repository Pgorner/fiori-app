/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function(
	Library,
	Opa5,
	opaTest
) {
	"use strict";

	Opa5.extendConfig({
		viewName: "MyView",
		viewNamespace: "",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/IgnorePresentationVariant/applicationUnderTest/IgnorePresentationVariant.html"
					));
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			},
			iStopMyApp: function () {
				this._myApplicationIsRunning = false;
				return this.iTeardownMyAppFrame();
			}
		}),
		assertions: new Opa5({
			iShouldSeeABackendRequestWithSortOrderBy: function(sEntitySet, sOrderBy){
				return this.waitFor({
					id: "log",
					controlType: "sap.m.List",
					success: function (oList) {
						var oItem = oList.getItems().find((o) => o.getTitle().startsWith("testService/" + sEntitySet));
						Opa5.assert.ok(oItem.getTitle().includes("$orderby=" + sOrderBy + " asc"));
					}
				});
			}
		})
	});

	QUnit.module("Default values");

	opaTest("SNOW: CS20240008313767 PresentationVariant annotation is ignored", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.iShouldSeeABackendRequestWithSortOrderBy("StringVH", "KEY");
		Then.iShouldSeeABackendRequestWithSortOrderBy("DescVH", "KEY");
	});

	opaTest("LAST-The purpose of this test is to Cleanup after all the tests", function (Given) {
		Opa5.assert.ok(true); // We need one assertion

		// Cleanup
		Given.iStopMyApp();
	});
});
