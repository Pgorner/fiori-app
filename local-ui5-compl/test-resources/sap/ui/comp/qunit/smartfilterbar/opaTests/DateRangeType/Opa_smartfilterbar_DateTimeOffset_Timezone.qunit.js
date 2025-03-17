/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/core/date/UniversalDateUtils",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/actions/DateRangeActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions"
], function(
	Library,
	Opa5,
	opaTest,
	Press,
	EnterText,
	PropertyStrictEquals,
	UniversalDateUtils,
	Actions,
	Assertions
) {
	"use strict";

	var oCompResourceBundle = Library.getResourceBundleFor("sap.ui.comp");
	var fGetDateTimeOffsetWithMiliseconds = function(sDate){
		var iEndIndex = sDate.length - 1;
		sDate = sDate.slice(0,iEndIndex);
		return sDate + '.999Z';
	};

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "applicationUnderTest.smartfilterbar_DateTimeOffset_Timezone",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function (sTimezone) {
				var sUrl = "sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/SmartFilterBar_DateTimeOffset_Timezone.html";

				if (sTimezone) {
					sUrl += "?sap-ui-timezone=" + sTimezone;
				}
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(sUrl)
				);
			},
			iEnsureMyAppIsRunning: function (sTimezone) {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp(sTimezone);
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

	function executeTests(sTimezone, sCurrentStringDate) {
		opaTest("Check filter query", function(Given, When, Then) {
			// Arrange
			Given.iEnsureMyAppIsRunning(sTimezone);

			// Act
			When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_DDR", "May 23, 2022, 2:59:12 PM", false);
			When.iPressTheFilterGoButton();

			// Assert
			var sResult = "(DTOFFSET_DDR ge datetimeoffset'" + sCurrentStringDate + "' and DTOFFSET_DDR le datetimeoffset'" + fGetDateTimeOffsetWithMiliseconds(sCurrentStringDate) + "')";
			Then.theFiltersShouldMatch(sResult);

			// Cleanup
			When.iPressTheRestoreButton();
			When.iClickShowAll();

			// Act
			When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_DDR_Kolkata", "May 23, 2022, 2:59:12 PM", false);
			When.iPressTheFilterGoButton();

			// Assert
			var sResult = "(DTOFFSET_DDR_Kolkata ge datetimeoffset'2022-05-23T20:29:12Z' and DTOFFSET_DDR_Kolkata le datetimeoffset'" + fGetDateTimeOffsetWithMiliseconds('2022-05-23T20:29:12Z') + "')";
			Then.theFiltersShouldMatch(sResult);

			// Cleanup
			When.iPressTheRestoreButton();
			When.iClickShowAll();

			// Act
			When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_DDR_Berlin", "May 23, 2022, 2:59:12 PM", false);
			When.iPressTheFilterGoButton();

			// Assert
			sResult = "(DTOFFSET_DDR_Berlin ge datetimeoffset'2022-05-23T16:59:12Z' and DTOFFSET_DDR_Berlin le datetimeoffset'" + fGetDateTimeOffsetWithMiliseconds('2022-05-23T16:59:12Z') + "')";
			Then.theFiltersShouldMatch(sResult);

			// Cleanup
			When.iPressTheRestoreButton();
			When.iClickShowAll();
		});

		opaTest("From variant management", function(Given, When, Then) {
			// Arrange
			Given.iEnsureMyAppIsRunning(sTimezone);

			// Act
			When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_DDR", "May 23, 2022, 2:59:12 PM", false);
			When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_DDR_Kolkata", "May 23, 2022, 2:59:12 PM", false);
			When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_DDR_Berlin", "May 23, 2022, 2:59:12 PM", false);

			When.iPressTheFilterGoButton();

			var sResult = "(DTOFFSET_DDR ge datetimeoffset'" + sCurrentStringDate + "' and DTOFFSET_DDR le datetimeoffset'" + fGetDateTimeOffsetWithMiliseconds(sCurrentStringDate) + "')" +
				" and (DTOFFSET_DDR_Kolkata ge datetimeoffset'2022-05-23T20:29:12Z' and DTOFFSET_DDR_Kolkata le datetimeoffset'" + fGetDateTimeOffsetWithMiliseconds('2022-05-23T20:29:12Z') + "')" +
				" and (DTOFFSET_DDR_Berlin ge datetimeoffset'2022-05-23T16:59:12Z' and DTOFFSET_DDR_Berlin le datetimeoffset'" + fGetDateTimeOffsetWithMiliseconds('2022-05-23T16:59:12Z') + "')";

			Then.theFiltersShouldMatch(sResult);

			// Act
			var sVariantName = "DDR_Test" + new Date().toISOString();
			When.iSaveVariantAs(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), sVariantName);
			When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));
			//When.iPressTheRestoreButton();
			When.iPressTheFilterGoButton();

			// Assert
			var sResultStandart = "";
			Then.theFiltersShouldMatch(sResultStandart);

			// Act
			When.iSelectVariant(sVariantName);
			When.iPressTheFilterGoButton();

			// Assert
			Then.theFiltersShouldMatch(sResult);

			// Cleanup
			When.iPressTheRestoreButton();
		});

		opaTest("Close", function(Given) {
			// Arrange
			Given.iEnsureMyAppIsRunning(sTimezone);

			QUnit.assert.ok(true, "app closed");

			// Cleanup
			Given.iStopMyApp();
		});
	}

	QUnit.module("Defaults");

	executeTests("", "2022-05-23T14:59:12Z");

	QUnit.module("Defaults in Honolulu -10:00");

	executeTests("Pacific/Honolulu", "2022-05-24T00:59:12Z");

	QUnit.module("Defaults in UTC 0");

	executeTests("Etc/UTC", "2022-05-23T14:59:12Z");

	QUnit.module("Defaults in Pacific/Tarawa +12:00");

	executeTests("Pacific/Tarawa", "2022-05-23T02:59:12Z");
});
