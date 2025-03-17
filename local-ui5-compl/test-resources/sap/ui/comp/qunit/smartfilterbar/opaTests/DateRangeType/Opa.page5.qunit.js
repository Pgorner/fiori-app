/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/actions/DateRangeActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions"
], function(
	Library,
	Opa5,
	opaTest,
	Actions,
	Assertions
) {
	"use strict";
    var sId = "Comp1---IDView--smartFilterBar-filterItemControl_BASIC-DDR_Mandatory";
	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "applicationUnderTest.smartfilterbar_DDR_mandatory",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/SmartFilterBar_DDR_mandatory.html"
					));
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			}
		}),
		actions: Actions,
		assertions: Assertions
	});

	QUnit.module("Defaults operations");

	opaTest("Empty mandatory DDr should have correct ValueState error text", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iPressTheFilterGoButton();

		// Assert
        Then.iShouldSeeFilterWithValueStateText(sId, Library.getResourceBundleFor("sap.ui.comp").getText("MANDATORY_FIELD_WITH_LABEL_ERROR", ["DDR Mandatory filter"]));

        // Act
        When.iEnterValue(sId, "asd", false);

        // Assert
        Then.iShouldSeeFilterWithValueStateText(sId, '');
		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Filters should be highlighted in error state", function (Given, When, Then) {
		var aFilterNames = [
			"Comp1---IDView--smartFilterBar-filterItemControl_BASIC-DATETIME_SINGLE",
			"Comp1---IDView--smartFilterBar-filterItemControl_BASIC-DATETIME_MULTIPLE",
			"Comp1---IDView--smartFilterBar-filterItemControl_BASIC-DTOFFSET_SINGLE",
			"Comp1---IDView--smartFilterBar-filterItemControl_BASIC-DISPLAY_CURRENCY"
		];

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iPressTheFilterGoButton();

		// Assert
		Then.iShouldSeeFiltersWithValueState(aFilterNames, "Error");

		// Cleanup
		When.iPressTheRestoreButton();
	});

});
