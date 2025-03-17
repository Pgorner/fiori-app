/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/actions/DateRangeActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions"
], function (
	Opa5,
	opaTest,
	Actions,
	Assertions
) {
	"use strict";

	var sResult,
		sControlId,
		sFilterId;

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "applicationUnderTest.smartfilterbar_DDR_OutParameters",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/SmartFilterBar_DDR_OutParameters.html"
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
		actions: Actions,
		assertions: Assertions
	});

	QUnit.module("Defaults");

	opaTest("Input types", function (Given, When, Then) {
		var oExpectedFieldTypes = {
			"__xmlview0--smartFilterBar-filterItemControlDateTimeRange.Group-DTR_SINGLE": "sap.m.DynamicDateRange",
			"__xmlview0--smartFilterBar-filterItemControlDateTimeRange.Group-DTR_MULTIPLE": "sap.m.DynamicDateRange",
			"__xmlview0--smartFilterBar-filterItemControlDateTimeRange.Group-DTR_AUTO": "sap.m.DynamicDateRange",
			"__xmlview0--smartFilterBar-filterItemControlDateTimeRange.Group-DTR_INTERVAL": "sap.m.DynamicDateRange",
			"__xmlview0--smartFilterBar-filterItemControlDateTimeRangeInOut.Group-DTR_SINGLE_INOUT": "sap.m.DynamicDateRange",
			"__xmlview0--smartFilterBar-filterItemControlDateTimeRangeInOut.Group-DTR_MULTIPLE_INOUT": "sap.m.DynamicDateRange",
			"__xmlview0--smartFilterBar-filterItemControlDateTimeRangeInOut.Group-DTR_AUTO_INOUT": "sap.m.DynamicDateRange",
			"__xmlview0--smartFilterBar-filterItemControlDateTimeRangeInOut.Group-DTR_INTERVAL_INOUT": "sap.m.DynamicDateRange"
		};

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Object.keys(oExpectedFieldTypes).forEach(function (sKey) {
			var sType = oExpectedFieldTypes[sKey];
			Then.waitFor({
				id: sKey,
				success: function (oControl) {
					Opa5.assert.strictEqual(oControl.getMetadata().getName(), sType,
						"Control with ID '" + sKey + "' is of expected type '" + sType + "'");
				}
			});
		});
	});

	QUnit.module("DDR_SINGLE");

	opaTest("Select single value and check filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		sControlId = "smartFilterBar-filterItemControlString.Group-STRING_OUT";

		// Act
		When.iEnterValue(sControlId, "1", false);
		When.iPressTheFilterGoButton();

		sResult = "DTR_SINGLE eq datetime'2014-12-13T00:00:00'";

		// Assert
		Then.theFiltersShouldMatch("STRING_OUT eq '1' and " + sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		sControlId = "smartFilterBar-filterItemControlString.Group-STRING_MULTI_OUT";

		// Act
		When.iEnterValue(sControlId, "1", false);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_MULTI_OUT eq '1' and " + sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iEnterValue(sControlId, "1", false);
		When.iEnterValue(sControlId, "2", false);
		When.iPressTheFilterGoButton();

		sResult = "(STRING_MULTI_OUT eq '1' or STRING_MULTI_OUT eq '2') and DTR_SINGLE eq datetime'2014-12-14T00:00:00'";

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iEnterValue(sControlId, "2", false);
		When.iEnterValue(sControlId, "1", false);
		When.iPressTheFilterGoButton();

		sResult = "(STRING_MULTI_OUT eq '2' or STRING_MULTI_OUT eq '1') and DTR_SINGLE eq datetime'2014-12-13T00:00:00'";

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Single TwoWay", function (Given, When, Then) {
		sControlId = "__xmlview0--smartFilterBar-filterItemControlStringInOut.Group-STRING_INOUT";

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD(sControlId);

		// Assert
		Then.iShouldSeeValueHelpDialogWithRows(4);

		// Act
		When.iSelectSingleRowFromVHD(sControlId, "2");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_INOUT eq '2' and DTR_SINGLE_INOUT eq datetime'2014-12-14T00:00:00'");

		// Act
		When.iOpenTheVHD(sControlId);

		// Assert
		Then.iShouldSeeValueHelpDialogWithRows(1);

		// Cleanup
		When.iPressTheVHDCancel(sControlId);
		When.iPressTheRestoreButton();
	});

	QUnit.module("DDR_MULTIPLE");

	opaTest("Select single value and check filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		sControlId = "smartFilterBar-filterItemControlString.Group-STRING_OUT_MULTIPLE";

		// Act
		When.iEnterValue(sControlId, "1", false);
		When.iPressTheFilterGoButton();

		sResult = "(DTR_MULTIPLE ge datetime'2014-12-13T00:00:00' and DTR_MULTIPLE le datetime'2014-12-13T00:00:00')";

		// Assert
		Then.theFiltersShouldMatch("STRING_OUT_MULTIPLE eq '1' and " + sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		sControlId = "smartFilterBar-filterItemControlString.Group-STRING_MULTI_OUT_MULTIPLE";

		// Act
		When.iEnterValue(sControlId, "1", false);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_MULTI_OUT_MULTIPLE eq '1' and " + sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iEnterValue(sControlId, "1", false);
		When.iEnterValue(sControlId, "2", false);
		When.iPressTheFilterGoButton();

		sResult = "(STRING_MULTI_OUT_MULTIPLE eq '1' or STRING_MULTI_OUT_MULTIPLE eq '2') and (DTR_MULTIPLE ge datetime'2014-12-14T00:00:00' and DTR_MULTIPLE le datetime'2014-12-14T00:00:00')";

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iEnterValue(sControlId, "2", false);
		When.iEnterValue(sControlId, "1", false);
		When.iPressTheFilterGoButton();

		sResult = "(STRING_MULTI_OUT_MULTIPLE eq '2' or STRING_MULTI_OUT_MULTIPLE eq '1') and (DTR_MULTIPLE ge datetime'2014-12-13T00:00:00' and DTR_MULTIPLE le datetime'2014-12-13T00:00:00')";

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Multiple TwoWay", function (Given, When, Then) {
		sControlId = "__xmlview0--smartFilterBar-filterItemControlStringInOut.Group-STRING_INOUT_MULTIPLE";

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD(sControlId);

		// Assert
		Then.iShouldSeeValueHelpDialogWithRows(4);

		// Act
		When.iSelectSingleRowFromVHD(sControlId, "2");
		When.iPressTheVHDOK(sControlId);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_INOUT_MULTIPLE eq '2' and (DTR_MULTIPLE_INOUT ge datetime'2014-12-14T00:00:00' and DTR_MULTIPLE_INOUT le datetime'2014-12-14T00:00:00')");

		// Act
		When.iOpenTheVHD(sControlId);

		// Assert
		Then.iShouldSeeValueHelpDialogWithRows(1);

		// Cleanup
		When.iPressTheVHDCancel(sControlId);
		When.iPressTheRestoreButton();
	});

	QUnit.module("DDR_INTERVAL");

	opaTest("Select single value and check filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		sControlId = "smartFilterBar-filterItemControlString.Group-STRING_OUT_INTERVAL";

		// Act
		When.iEnterValue(sControlId, "3", false);
		When.iPressTheFilterGoButton();

		sResult = "(DTR_INTERVAL ge datetime'2014-12-15T00:00:00' and DTR_INTERVAL le datetime'2014-12-15T00:00:00')";

		// Assert
		Then.theFiltersShouldMatch("STRING_OUT_INTERVAL eq '3' and " + sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		sControlId = "smartFilterBar-filterItemControlString.Group-STRING_MULTI_OUT_INTERVAL";

		// Act
		When.iEnterValue(sControlId, "3", false);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_MULTI_OUT_INTERVAL eq '3' and " + sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iEnterValue(sControlId, "1", false);
		When.iEnterValue(sControlId, "2", false);
		When.iPressTheFilterGoButton();

		sResult = "(STRING_MULTI_OUT_INTERVAL eq '1' or STRING_MULTI_OUT_INTERVAL eq '2') and (DTR_INTERVAL ge datetime'2014-12-14T00:00:00' and DTR_INTERVAL le datetime'2014-12-14T00:00:00')";

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iEnterValue(sControlId, "2", false);
		When.iEnterValue(sControlId, "1", false);
		When.iPressTheFilterGoButton();

		sResult = "(STRING_MULTI_OUT_INTERVAL eq '2' or STRING_MULTI_OUT_INTERVAL eq '1') and (DTR_INTERVAL ge datetime'2014-12-13T00:00:00' and DTR_INTERVAL le datetime'2014-12-13T00:00:00')";

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});


	QUnit.module("DDR_AUTO");

	opaTest("Select single value and check filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();
		sControlId = "smartFilterBar-filterItemControlString.Group-STRING_OUT_AUTO";

		// Act
		When.iEnterValue(sControlId, "3", false);
		When.iPressTheFilterGoButton();

		sResult = "(DTR_AUTO ge datetime'2014-12-15T00:00:00' and DTR_AUTO le datetime'2014-12-15T00:00:00')";

		// Assert
		Then.theFiltersShouldMatch("STRING_OUT_AUTO eq '3' and " + sResult);

		// Cleanup
		When.iPressTheRestoreButton();
		sControlId = "smartFilterBar-filterItemControlString.Group-STRING_MULTI_OUT_AUTO";

		// Act
		When.iEnterValue(sControlId, "3", false);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_MULTI_OUT_AUTO eq '3' and " + sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iEnterValue(sControlId, "1", false);
		When.iEnterValue(sControlId, "2", false);
		When.iPressTheFilterGoButton();

		sResult = "(STRING_MULTI_OUT_AUTO eq '1' or STRING_MULTI_OUT_AUTO eq '2') and (DTR_AUTO ge datetime'2014-12-14T00:00:00' and DTR_AUTO le datetime'2014-12-14T00:00:00')";

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();

		// Act
		When.iEnterValue(sControlId, "2", false);
		When.iEnterValue(sControlId, "1", false);
		When.iPressTheFilterGoButton();

		sResult = "(STRING_MULTI_OUT_AUTO eq '2' or STRING_MULTI_OUT_AUTO eq '1') and (DTR_AUTO ge datetime'2014-12-13T00:00:00' and DTR_AUTO le datetime'2014-12-13T00:00:00')";

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Auto TwoWay", function (Given, When, Then) {
		sControlId = "__xmlview0--smartFilterBar-filterItemControlStringInOut.Group-STRING_INOUT_AUTO";

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD(sControlId);

		// Assert
		Then.iShouldSeeValueHelpDialogWithRows(4);

		// Act
		When.iSelectSingleRowFromVHD(sControlId, "2");
		When.iPressTheVHDOK(sControlId);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_INOUT_AUTO eq '2' and (DTR_AUTO_INOUT ge datetime'2014-12-14T00:00:00' and DTR_AUTO_INOUT le datetime'2014-12-14T00:00:00')");

		// Act
		When.iOpenTheVHD(sControlId);

		// Assert
		Then.iShouldSeeValueHelpDialogWithRows(1);

		// Cleanup
		When.iPressTheVHDCancel(sControlId);
		When.iPressTheRestoreButton();
	});

	QUnit.module("DatePicker");

	opaTest("as OUT parameter of DynamicDateRange", function (Given, When, Then) {
		sControlId = "__xmlview0--smartFilterBar-filterItemControlA_-CostCenter";

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD(sControlId);

		// Assert
		Then.iShouldSeeValueHelpDialogWithRows(1);

		// Act
		When.iSelectSingleRowFromVHD(sControlId, "1");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("CostCenter eq '1' and (FixedDate_DDR ge datetime'2014-12-13T00:00:00' and FixedDate_DDR le datetime'2014-12-13T23:59:59') and FixedDate_DatePicker eq datetime'2014-12-13T00:00:00'");

		sFilterId = "__xmlview0--smartFilterBar-filterItemControlA_-CostCenter-valueHelpDialog-smartFilterBar-filterItemControlA_-ValidityStartDate";

		// Act
		When.iOpenTheVHD(sControlId);
		When.iExpandVHDFilters(sControlId);

		// Assert
		Then.iShouldSeeValueHelpDialogWithRows(1);
		Then.theValueToShouldBe(sFilterId, "12/13/14");

		sFilterId = "__xmlview0--smartFilterBar-filterItemControlA_-CostCenter-valueHelpDialog-smartFilterBar-filterItemControlA_-ValidityStartDate2";

		// Assert
		Then.theValueToShouldBe(sFilterId, "12/13/14");

		// Cleanup
		When.iPressTheVHDCancel(sControlId);
		When.iPressTheRestoreButton();

		Given.iStopMyApp();
	});
});
