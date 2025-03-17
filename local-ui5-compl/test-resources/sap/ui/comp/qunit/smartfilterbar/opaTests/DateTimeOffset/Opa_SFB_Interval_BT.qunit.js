/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateTimeOffset/actions/Actions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/actions/DateRangeActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions"
], function (
	Library,
	Opa5,
	opaTest,
	Actions,
	DateRangeActions,
	Assertions
) {
	"use strict";
	var oCompResourceBundle = Library.getResourceBundleFor("sap.ui.comp"),
		sStandardVariantName = oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD");

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "applicationUnderTest.smartfilterbar_DateTimeOffset",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/DateTimeOffset/applicationUnderTest/SmartFilterBar_DateTimeOffset.html"
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
		actions: Object.assign(Actions, DateRangeActions),
		assertions: Assertions
	});

	function fSetConditionValues(When, aControlName, sViewName, sOperation, aDate, bExclude) {
		for (var i = 0; i < aControlName.length; i++) {
			var sControlName = sViewName + aControlName[i];

			When.iOpenTheVHD(sControlName);
			When.iSelectOperation(sOperation, bExclude);
			if (aDate.length === 2) {
				When.iSelectDateTimeConditionValue("from", aDate[0]);
				When.iSelectDateTimeConditionValue("to", aDate[1]);
			} else {
				When.iSelectDateTimeConditionValue("Value", aDate[0]);
			}
			When.iPressTheVHDOK(sControlName);
		}
	}
	function fReturnMilliseconds(sControlName) {
		var sPrecision = sControlName[sControlName.length - 1],
			iPrecision = parseInt(sPrecision);
		switch (iPrecision) {
			case 0:
				return "Z";
			case 1:
				return ".900Z";
			case 2:
				return ".990Z";
			case 3:
				return ".999Z";
			case 4:
				return ".9999Z";
			case 5:
				return ".99999Z";
			case 6:
				return ".999999Z";
			case 7:
				return ".9999999Z";
			default:
				return ".999Z";
		}
	}

	QUnit.module("DateTimeOffset Interval with BT");

    opaTest("Check with condition BT send query with precision", function(Given, When, Then) {
        // Arrange
        Given.iEnsureMyAppIsRunning();
        var aControlName = ["DTOFFSET_INTERVAL", "DTOFFSET_INTERVAL_PRECISION0", "DTOFFSET_INTERVAL_PRECISION1", "DTOFFSET_INTERVAL_PRECISION2", "DTOFFSET_INTERVAL_PRECISION3",
                "DTOFFSET_INTERVAL_PRECISION4", "DTOFFSET_INTERVAL_PRECISION5", "DTOFFSET_INTERVAL_PRECISION6", "DTOFFSET_INTERVAL_PRECISION7"],
            sViewName = "smartFilterBar-filterItemControlA_-",
            sDateFrom = "1/12/24, 5:25 PM",
            sDateTo = "1/13/24, 11:16 AM",
            sLow = new Date(sDateFrom).toJSON(),
            sHigh = new Date(sDateTo).toJSON(),
            sDateStartResult = sLow.substring(0,19) + "Z",
            sDateEndResult = sHigh.substring(0,19);

        // Act
        When.iClickShowAll();
        fSetConditionValues(When, aControlName, sViewName, "BT",[sDateFrom, sDateTo]);
        When.iPressTheFilterGoButton();

        var sResult = "(DTOFFSET_INTERVAL ge datetimeoffset'" + sDateStartResult + "' and " +
                "DTOFFSET_INTERVAL le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL") + "') and " +
                "(DTOFFSET_INTERVAL_PRECISION0 ge datetimeoffset'" + sDateStartResult +
                "' and DTOFFSET_INTERVAL_PRECISION0 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION0") + "') and " +
                "(DTOFFSET_INTERVAL_PRECISION1 ge datetimeoffset'" + sDateStartResult +
                "' and DTOFFSET_INTERVAL_PRECISION1 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION1") + "') and " +
                "(DTOFFSET_INTERVAL_PRECISION2 ge datetimeoffset'" + sDateStartResult +
                "' and DTOFFSET_INTERVAL_PRECISION2 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION2") + "') and " +
                "(DTOFFSET_INTERVAL_PRECISION3 ge datetimeoffset'" + sDateStartResult +
                "' and DTOFFSET_INTERVAL_PRECISION3 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION3") + "') and " +
                "(DTOFFSET_INTERVAL_PRECISION4 ge datetimeoffset'" + sDateStartResult +
                "' and DTOFFSET_INTERVAL_PRECISION4 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION4") + "') and " +
                "(DTOFFSET_INTERVAL_PRECISION5 ge datetimeoffset'" + sDateStartResult +
                "' and DTOFFSET_INTERVAL_PRECISION5 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION5") + "') and " +
                "(DTOFFSET_INTERVAL_PRECISION6 ge datetimeoffset'" + sDateStartResult +
                "' and DTOFFSET_INTERVAL_PRECISION6 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION6") + "') and " +
                "(DTOFFSET_INTERVAL_PRECISION7 ge datetimeoffset'" + sDateStartResult +
                "' and DTOFFSET_INTERVAL_PRECISION7 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION7") + "')",
            oRange = {
                "Sign": "I",
                "Option": "BT",
                "Low": sLow,
                "High": sHigh
            };

        Then.theFiltersShouldMatch(sResult);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_INTERVAL", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_INTERVAL_PRECISION0", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_INTERVAL_PRECISION1", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_INTERVAL_PRECISION2", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_INTERVAL_PRECISION3", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_INTERVAL_PRECISION4", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_INTERVAL_PRECISION5", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_INTERVAL_PRECISION6", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_INTERVAL_PRECISION7", oRange);

        // Cleanup
        When.iPressTheRestoreButton();
    });

    opaTest("Saving and restoring variant with condition BT", function(Given, When, Then) {
        // Arrange
        Given.iEnsureMyAppIsRunning();
        var aControlName = ["DTOFFSET_INTERVAL", "DTOFFSET_INTERVAL_PRECISION0", "DTOFFSET_INTERVAL_PRECISION1", "DTOFFSET_INTERVAL_PRECISION2", "DTOFFSET_INTERVAL_PRECISION3",
                "DTOFFSET_INTERVAL_PRECISION4", "DTOFFSET_INTERVAL_PRECISION5", "DTOFFSET_INTERVAL_PRECISION6", "DTOFFSET_INTERVAL_PRECISION7"],
            sViewName = "smartFilterBar-filterItemControlA_-",
            sViewName = "smartFilterBar-filterItemControlA_-",
            sDateFrom = "1/12/24, 5:25 PM",
            sDateTo = "1/13/24, 11:16 AM",
            sLow = new Date(sDateFrom).toJSON(),
            sHigh = new Date(sDateTo).toJSON(),
            sDateStartResult = sLow.substring(0,19) + "Z",
            sDateEndResult = sHigh.substring(0,19);

        // Act
        When.iClickShowAll();
        fSetConditionValues(When, aControlName, sViewName, "BT",[sDateFrom, sDateTo]);
        When.iPressTheFilterGoButton();

        var sResult = "(DTOFFSET_INTERVAL ge datetimeoffset'" + sDateStartResult + "' and " +
            "DTOFFSET_INTERVAL le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL") + "') and " +
            "(DTOFFSET_INTERVAL_PRECISION0 ge datetimeoffset'" + sDateStartResult +
            "' and DTOFFSET_INTERVAL_PRECISION0 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION0") + "') and " +
            "(DTOFFSET_INTERVAL_PRECISION1 ge datetimeoffset'" + sDateStartResult +
            "' and DTOFFSET_INTERVAL_PRECISION1 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION1") + "') and " +
            "(DTOFFSET_INTERVAL_PRECISION2 ge datetimeoffset'" + sDateStartResult +
            "' and DTOFFSET_INTERVAL_PRECISION2 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION2") + "') and " +
            "(DTOFFSET_INTERVAL_PRECISION3 ge datetimeoffset'" + sDateStartResult +
            "' and DTOFFSET_INTERVAL_PRECISION3 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION3") + "') and " +
            "(DTOFFSET_INTERVAL_PRECISION4 ge datetimeoffset'" + sDateStartResult +
            "' and DTOFFSET_INTERVAL_PRECISION4 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION4") + "') and " +
            "(DTOFFSET_INTERVAL_PRECISION5 ge datetimeoffset'" + sDateStartResult +
            "' and DTOFFSET_INTERVAL_PRECISION5 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION5") + "') and " +
            "(DTOFFSET_INTERVAL_PRECISION6 ge datetimeoffset'" + sDateStartResult +
            "' and DTOFFSET_INTERVAL_PRECISION6 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION6") + "') and " +
            "(DTOFFSET_INTERVAL_PRECISION7 ge datetimeoffset'" + sDateStartResult +
            "' and DTOFFSET_INTERVAL_PRECISION7 le datetimeoffset'" + sDateEndResult + fReturnMilliseconds("DTOFFSET_INTERVAL_PRECISION7") + "')";
        Then.theFiltersShouldMatch(sResult);

        // Act
        var sVariantName = "DTOFFSET_INTERVAL_BT" + new Date().toISOString();
        When.iSaveVariantAs(sStandardVariantName, sVariantName);
        When.iSelectVariant(sStandardVariantName);
        //When.iPressTheRestoreButton();
        When.iPressTheFilterGoButton();

        // Assert
        var sResultStandard = "";
        Then.theFiltersShouldMatch(sResultStandard);

        // Act
        When.iSelectVariant(sVariantName);
        When.iPressTheFilterGoButton();

        // Assert
        Then.theFiltersShouldMatch(sResult);

        // Cleanup
        When.iSelectVariant(sStandardVariantName);
        When.iPressTheRestoreButton();
        Given.iStopMyApp();
    });

});
