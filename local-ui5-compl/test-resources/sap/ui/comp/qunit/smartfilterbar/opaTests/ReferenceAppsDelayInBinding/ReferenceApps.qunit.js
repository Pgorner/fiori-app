/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function (
	Opa5,
	opaTest
) {
	"use strict";

	Opa5.extendConfig({
		viewName: "myTest.MyTestApplication.view.MyApplication",
		viewNamespace: "",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyAppInAFrame(
						sap.ui.require.toUrl(
							"sap/ui/comp/qunit/smartfilterbar/opaTests/ReferenceAppsDelayInBinding/applicationUnderTest/ReferenceAppDelayInBinding.html"
						));
					this._myApplicationIsRunning = true;
				}
			},
			iStopMyApp: function () {
				this._myApplicationIsRunning = false;
				return this.iTeardownMyAppFrame();
			}
		}),
		assertions: new Opa5({
			theFiltersShouldMatch: function (oFilters, sErrorMessage) {
				return this.waitFor({
					id: "SFBFilterResult",
					success: function (oText) {
						Opa5.assert.deepEqual(
							JSON.parse(oText.getText()),
							oFilters,
							sErrorMessage ? sErrorMessage : "Filters should match"
						);
					}
				});
			}
		})
	});

	QUnit.module("Default");

	opaTest("Search is executed with the correct filters", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.theFiltersShouldMatch({"Combo": "1"});
	});

	opaTest("ComboBox is not in error state", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.waitFor({
			id: "smartFilterBar",
			success: function (oSFB) {
				var aFilterItems = oSFB.getAllFilterItems();
				aFilterItems.forEach(function(oItem) {
					if (oItem.getName() === "Combo") {
						Opa5.assert.deepEqual(oSFB._determineControlByFilterItem(oItem).getValueState(), "None");
					}
				});
			}
		});

		// Cleanup
		Given.iStopMyApp();
	});
});
