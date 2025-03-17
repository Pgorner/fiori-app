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

	QUnit.module("DateTimeOffset Auto LE");

    opaTest("Check with condition LE send query with precision", function(Given, When, Then) {
        // Arrange
        Given.iEnsureMyAppIsRunning();
        var aControlName = ["DTOFFSET_AUTO", "DTOFFSET_AUTO_PRECISION0", "DTOFFSET_AUTO_PRECISION1", "DTOFFSET_AUTO_PRECISION2", "DTOFFSET_AUTO_PRECISION3",
                "DTOFFSET_AUTO_PRECISION4", "DTOFFSET_AUTO_PRECISION5", "DTOFFSET_AUTO_PRECISION6", "DTOFFSET_AUTO_PRECISION7"],
            sViewName = "smartFilterBar-filterItemControlA_-",
            sDate = "1/12/24, 5:25 PM",
            sLow = new Date(sDate).toJSON(),
            sDateResult = "2024-01-12T17:25:00";

        // Act
        When.iClickShowAll();
        fSetConditionValues(When, aControlName, sViewName, "LE",[sDate]);
        When.iPressTheFilterGoButton();
        // Assert

        var sResult = "DTOFFSET_AUTO le datetimeoffset'" + sDateResult + fReturnMilliseconds("DTOFFSET_AUTO") +
                "' and DTOFFSET_AUTO_PRECISION0 le datetimeoffset'" + sDateResult + fReturnMilliseconds("DTOFFSET_AUTO_PRECISION0") +
                "' and DTOFFSET_AUTO_PRECISION1 le datetimeoffset'" + sDateResult + fReturnMilliseconds("DTOFFSET_AUTO_PRECISION1") +
                "' and DTOFFSET_AUTO_PRECISION2 le datetimeoffset'" + sDateResult + fReturnMilliseconds("DTOFFSET_AUTO_PRECISION2") +
                "' and DTOFFSET_AUTO_PRECISION3 le datetimeoffset'" + sDateResult + fReturnMilliseconds("DTOFFSET_AUTO_PRECISION3") +
                "' and DTOFFSET_AUTO_PRECISION4 le datetimeoffset'" + sDateResult + fReturnMilliseconds("DTOFFSET_AUTO_PRECISION4") +
                "' and DTOFFSET_AUTO_PRECISION5 le datetimeoffset'" + sDateResult + fReturnMilliseconds("DTOFFSET_AUTO_PRECISION5") +
                "' and DTOFFSET_AUTO_PRECISION6 le datetimeoffset'" + sDateResult + fReturnMilliseconds("DTOFFSET_AUTO_PRECISION6") +
                "' and DTOFFSET_AUTO_PRECISION7 le datetimeoffset'" + sDateResult + fReturnMilliseconds("DTOFFSET_AUTO_PRECISION7") + "'",
            oRange = {
                "Sign": "I",
                "Option": "LE",
                "Low": sLow,
                "High": null
            };

        Then.theFiltersShouldMatch(sResult);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_AUTO", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_AUTO_PRECISION0", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_AUTO_PRECISION1", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_AUTO_PRECISION2", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_AUTO_PRECISION3", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_AUTO_PRECISION4", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_AUTO_PRECISION5", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_AUTO_PRECISION6", oRange);
        Then.theUiStateShouldContainSelectOptions("DTOFFSET_AUTO_PRECISION7", oRange);

        // Cleanup
        When.iPressTheRestoreButton();
        Given.iStopMyApp();
    });
});
