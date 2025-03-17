/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/core/date/UniversalDateUtils",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/actions/DateRangeActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions"
], function(
	Library,
	Opa5,
	opaTest,
	Press,
	EnterText,
	UniversalDateUtils,
	Actions,
	Assertions
) {
	"use strict";

	var oMResourceBundle = Library.getResourceBundleFor("sap.m"),
		oCompResourceBundle = Library.getResourceBundleFor("sap.ui.comp"),
		gatDateAsString = function (oDate) {
			var sDate = oDate.oDate ? oDate.oDate.toISOString() : oDate.toISOString();

			return sDate.substring(0, sDate.length - 13) + "00:00:00";
		};
	var oToday = UniversalDateUtils.ranges.today(),
		sTodayStart = gatDateAsString(oToday[0]),
		oTomorrow = UniversalDateUtils.ranges.tomorrow(),
		sTomorrowStart = gatDateAsString(oTomorrow[0]),
		oYesterday = UniversalDateUtils.ranges.yesterday(),
		sYesterdayStart = gatDateAsString(oYesterday[0]);

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "applicationUnderTest.smartfilterbar_DateRangeConfiguration",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/SmartFilterBar_DateRangeConfiguration.html"
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
			"smartFilterBar-filterItemControlA_-DTR_SINGLE": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTR_MULTIPLE": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTR_INTERVAL": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTR_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DTR_SINGLE_d-f_Date": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTR_MULTIPLE_d-f_Date": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTR_INTERVAL_d-f_Date": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTR_AUTO_d-f_Date": "sap.m.DynamicDateRange"
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

	opaTest("Check single date default operator", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		//sap:filter-restriction="single-value"
		var sFilterId = "smartFilterBar-filterItemControlA_-DTR_SINGLE";

		// Assert
		Then.theDefaultOptionShouldBe(sFilterId,"YESTERDAY");

		// Act
		//sap:filter-restriction="single-value" sap:display-format="Date"
		sFilterId = "smartFilterBar-filterItemControlA_-DTR_SINGLE_d-f_Date";

		// Assert
		Then.theDefaultOptionShouldBe(sFilterId,undefined);

		When.iPressTheFilterGoButton();

		var sResult = "DTR_SINGLE eq datetime'" + sYesterdayStart + "'";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check filtered single operations", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		//sap:filter-restriction="single-value"
		var sFilterId = "smartFilterBar-filterItemControlA_-DTR_SINGLE";
		When.iOpenTheVHD(sFilterId + "-input");

		// Assert
		Then.theOptionsShouldBeCount(sFilterId,11);
		Then.theOptionShouldBeInTheList(sFilterId,"DATE");
		Then.theOptionShouldBeInTheList(sFilterId,"TOMORROW");
		Then.theOptionShouldBeInTheList(sFilterId,"YESTERDAY");
		Then.theOptionShouldBeInTheList(sFilterId,"LASTDAYWEEK");
		Then.theOptionShouldBeInTheList(sFilterId,"FIRSTDAYWEEK");
		Then.theOptionShouldBeInTheList(sFilterId,"LASTDAYMONTH");
		Then.theOptionShouldBeInTheList(sFilterId,"FIRSTDAYMONTH");
		Then.theOptionShouldBeInTheList(sFilterId,"FIRSTDAYQUARTER");
		Then.theOptionShouldBeInTheList(sFilterId,"LASTDAYQUARTER");
		Then.theOptionShouldBeInTheList(sFilterId,"LASTDAYYEAR");
		Then.theOptionShouldBeInTheList(sFilterId,"FIRSTDAYYEAR");
		Then.theOptionShouldNotBeInTheList(sFilterId,"TODAY");

		When.iOpenTheVHD(sFilterId + "-input");

		// Act
		//sap:filter-restriction="single-value" sap:display-format="Date"
		sFilterId = "smartFilterBar-filterItemControlA_-DTR_SINGLE_d-f_Date";
		When.iOpenTheVHD(sFilterId + "-input");

		// Asserts
		Then.theOptionsShouldBeCount(sFilterId,12);
		Then.theOptionShouldBeInTheList(sFilterId,"DATE");
		Then.theOptionShouldBeInTheList(sFilterId,"TOMORROW");
		Then.theOptionShouldBeInTheList(sFilterId,"YESTERDAY");
		Then.theOptionShouldBeInTheList(sFilterId,"TODAY");
		Then.theOptionShouldBeInTheList(sFilterId,"LASTDAYWEEK");
		Then.theOptionShouldBeInTheList(sFilterId,"FIRSTDAYWEEK");
		Then.theOptionShouldBeInTheList(sFilterId,"LASTDAYMONTH");
		Then.theOptionShouldBeInTheList(sFilterId,"FIRSTDAYMONTH");
		Then.theOptionShouldBeInTheList(sFilterId,"FIRSTDAYQUARTER");
		Then.theOptionShouldBeInTheList(sFilterId,"LASTDAYQUARTER");
		Then.theOptionShouldBeInTheList(sFilterId,"LASTDAYYEAR");
		Then.theOptionShouldBeInTheList(sFilterId,"FIRSTDAYYEAR");
		When.iOpenTheVHD(sFilterId + "-input");

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check single date filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-DTR_SINGLE-input");
		When.iSelectDateOperationByKey("TOMORROW");
		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DTR_SINGLE eq datetime'" + sTomorrowStart + "'";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check single date second filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-DTR_SINGLE_d-f_Date-input");
		When.iSelectDateOperationByKey("TODAY");
		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DTR_SINGLE eq datetime'" + sYesterdayStart + "' and DTR_SINGLE_d-f_Date eq datetime'" + sTodayStart + "'";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Single date operation from variant management", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTR_SINGLE", oMResourceBundle.getText("DYNAMIC_DATE_TOMORROW_FORMAT"), false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTR_SINGLE_d-f_Date-input", oMResourceBundle.getText("DYNAMIC_DATE_TODAY_FORMAT"), false);
		When.iPressTheFilterGoButton();

		var sResult = "DTR_SINGLE eq datetime'" + sTomorrowStart + "' " +
			"and DTR_SINGLE_d-f_Date eq datetime'" + sTodayStart + "'";
		Then.theFiltersShouldMatch(sResult);

		// Act
		var sVariantName = "DDR_Single_Test" + new Date().toISOString();
		When.iSaveVariantAs(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), sVariantName);
		When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));
		//When.iPressTheRestoreButton();
		When.iPressTheFilterGoButton();

		// Assert
		var sResultStandard = "DTR_SINGLE eq datetime'" + sYesterdayStart + "'";
		Then.theFiltersShouldMatch(sResultStandard);

		// Act
		When.iSelectVariant(sVariantName);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});
	opaTest("DynamicDateRange control is reset from the adapt filters dialog", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iPressAdaptFiletrsDialogButton();
		When.iPressTheAdaptFiltersShowValuesButton();
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTR_AUTO_d-f_Date-input", "Incorrect text", false);
		When.iResetAdaptFiltersDialog();

		// Assert
		Then.theFilterShouldContainsText("smartFilterBar-filterItemControlA_-DTR_AUTO_d-f_Date-input", "");

		// Cleanup
		When.iCloseAdaptFiltersDialog();
		Given.iStopMyApp();
	});
	opaTest("DynamicDateRange control state is cleared when having invalid value in the adapt filters dialog", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iPressAdaptFiletrsDialogButton();
		When.iPressTheAdaptFiltersShowValuesButton();
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTR_AUTO_d-f_Date-input", "Incorrect text", false);

		// Assert
		Then.iShouldSeeFilterWithValueState("smartFilterBar-filterItemControlA_-DTR_AUTO_d-f_Date-input", "Error");
		Then.iCheckIfItemIsWithGivenValueStateFromDialog("DTR_AUTO", "None", "ZEPM_C_SALESORDERITEMQUERYResults");

		// Act
		When.iCloseAdaptFiltersDialog();

		// Assert
		Then.iCheckIfItemIsWithGivenValueState("DTR_AUTO", "None");

		// Act
		When.iPressAdaptFiletrsDialogButton();
		When.iPressTheAdaptFiltersShowValuesButton();

		// Assert
		Then.theFilterShouldContainsText("smartFilterBar-filterItemControlA_-DTR_AUTO_d-f_Date-input", "");
		Then.iShouldSeeFilterWithValueState("smartFilterBar-filterItemControlA_-DTR_AUTO_d-f_Date-input", "None");
		Then.iCheckIfItemIsWithGivenValueStateFromDialog("DTR_AUTO", "None", "ZEPM_C_SALESORDERITEMQUERYResults");

		// Cleanup
		When.iCloseAdaptFiltersDialog();
		Given.iStopMyApp();
	});
});
