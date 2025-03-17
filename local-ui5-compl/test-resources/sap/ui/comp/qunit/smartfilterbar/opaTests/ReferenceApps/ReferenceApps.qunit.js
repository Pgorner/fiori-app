/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function(
	Library,
	Opa5,
	opaTest,
	PropertyStrictEquals
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
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/ReferenceApps/applicationUnderTest/ReferenceAppDefaultValues.html"
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
			theFiltersShouldMatch: function (sFilters, sErrorMessage) {
				return this.waitFor({
					id: "SFBFilterResult",
					success: function (oText) {
						Opa5.assert.deepEqual(
							JSON.parse(oText.getText()),
							{
								"exclude": false,
								"operation": "EQ",
								"keyField": "Name",
								"value1": "2",
								"value2": null,
								"tokenText": null
							},
							sErrorMessage ? sErrorMessage : "Filters should match"
						);
					}
				});
			},
			iCheckAdaptFiltersCountText: function(sFiltersText){
				return this.waitFor({
					id : "smartFilterBar-btnFilters",
					controlType: "sap.m.Button",
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: sFiltersText
						})
					],
					success: function (oFiltersButton) {
						var sFiltersButtonText = oFiltersButton.getText();
						Opa5.assert.strictEqual(
							sFiltersButtonText,
							sFiltersText,
							"Adapt Filters text should be " + sFiltersText
						);
					}
				});
			}
		})
	});

	QUnit.module("Default values");

	opaTest("Synchronisation", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.waitFor({
			id: "myModal",
			searchOpenDialogs: true,
			success: function (oMessageBox) {

				var oPerformance = Opa5.getWindow().performance,
				oSFBApplicationModifyStateEnd = oPerformance.getEntriesByName("SFBApplicationModifyStateEnd")[0],
				oSFBInitialized = oPerformance.getEntriesByName("SFBInitialized")[0],
				oSFBSearchStart = oPerformance.getEntriesByName("SFBSearchStart")[0];

				Opa5.assert.ok(oSFBApplicationModifyStateEnd.startTime < oSFBSearchStart.startTime,
					"SmartFilterBar search triggered after the SmartFilterBar initialized promise is resolved");

				Opa5.assert.ok(oSFBInitialized.startTime < oSFBSearchStart.startTime,
					"SmartFilterBar search triggered from Variant Management after the SmartFilterBar initialized promise is resolved");

				oMessageBox.close();

			}
		});
	});

	opaTest("Check Filters Count when associateValueLists is called in case of ComboBox control", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();
		var _oRb = Library.getResourceBundleFor("sap.ui.comp");
		var sFilterText = _oRb.getText("FILTER_BAR_ACTIVE_FILTERS", [
			2
		]);

		// Assert
		Then.iCheckAdaptFiltersCountText(sFilterText);
	});

	opaTest("Filters", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.theFiltersShouldMatch("123");

		// Cleanup
		Given.iStopMyApp();
	});
});
