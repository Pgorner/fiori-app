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
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/DateStorage"
], function(
	Library,
	Opa5,
	opaTest,
	Press,
	EnterText,
	PropertyStrictEquals,
	UniversalDateUtils,
	Actions,
	Assertions,
	DateStorage
) {
	"use strict";

	var oMResourceBundle = Library.getResourceBundleFor("sap.m"),
		oCompResourceBundle = Library.getResourceBundleFor("sap.ui.comp"),
		getDateAsDateTimeString = function (oDate) {
			var sDate = oDate.oDate ? oDate.oDate.toISOString() : oDate.toISOString();

			return sDate.substring(0, sDate.length - 13) + "00:00:00";
		},
		getDateTimeAsDateTimeString = function (oDate) {
			var oCurrentDate = oDate.oDate ? oDate.oDate : oDate;
			var sPadString = "0",
				sDate = oCurrentDate.getUTCFullYear().toString().padStart(4, sPadString) + "-" +
						(oCurrentDate.getUTCMonth() + 1).toString().padStart(2, sPadString) + "-" +
						oCurrentDate.getUTCDate().toString().padStart(2, sPadString) + "T" +
						oCurrentDate.getUTCHours().toString().padStart(2, sPadString) + ":" +
						oCurrentDate.getUTCMinutes().toString().padStart(2, sPadString) + ":00Z";


			return sDate;
		},
		getDateAsString = function (oDate) {
			var sMonth = (oDate.getMonth() + 1).toString(),
				sDate = oDate.getDate().toString();

			sMonth = sMonth.length === 1 ? "0" + sMonth : sMonth;
			sDate = sDate.length === 1 ? "0" + sDate : sDate;

			return oDate.getFullYear().toString() + sMonth + sDate;
		};
	var oToday = UniversalDateUtils.ranges.today(),
		sTodayStart = getDateAsDateTimeString(oToday[0]),
		oTomorrow = UniversalDateUtils.ranges.tomorrow(),
		sTomorrowStart = getDateAsDateTimeString(oTomorrow[0]),
		sTomorrowStartAsString = getDateAsString(oTomorrow[0]),
		oYesterday = UniversalDateUtils.ranges.yesterday(),
		sYesterdayStart = getDateAsDateTimeString(oYesterday[0]);

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "applicationUnderTest.smartfilterbar_DateTypes_useDRT",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/SmartFilterBar_DateTypes_UseDRT.html"
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
			"smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate2": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DATETIME_MULTIPLE_d-f_Date": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DATETIME_AUTO_d-f_Date": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DATETIME_SINGLE": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-DATETIME_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DATETIME_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-DATETIME_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DTOFFSET_SINGLE": "sap.m.DateTimePicker",
			"smartFilterBar-filterItemControlA_-DTOFFSET_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL_DATE": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTOFFSET_SINGLE_DATE": "sap.m.DatePicker",
			"smartFilterBar-filterItemControlA_-STRINGDATE_SINGLE": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-STRINGDATE_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRINGDATE_INTERVAL": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-STRINGDATE_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-TIME_SINGLE": "sap.m.TimePicker",
			"smartFilterBar-filterItemControlA_-TIME_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-TIME_INTERVAL": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-TIME_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DTOFFSET_Precision0": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTOFFSET_Precision1": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTOFFSET_Precision2": "sap.m.DynamicDateRange",
			"smartFilterBar-filterItemControlA_-DTOFFSET_Precision3": "sap.m.DynamicDateRange"
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

	opaTest("Check filtered single operations", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		//sap:filter-restriction="single-value" sap:semantics="parameters"
		var sFilterId = "smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate";
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
		//sap:filter-restriction="single-value"
		sFilterId = "smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date";
		When.iOpenTheVHD(sFilterId + "-input");

		// Assert
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

	opaTest("Check setUiState with No semantic Date", function(Given, When, Then) {
		// Arrange
		var sDefaultFilterValue = "2018-12-01T00:00:00",
			sFormattedDefaultFilterDate = new Date(sDefaultFilterValue).toISOString().substr(0,19),
			sToday = oToday[0].oDate.toISOString().slice(0, -5);

		Given.iEnsureMyAppIsRunning();

		// Act
		When.iPressTheSetUiStateWithNoSemanticDateButton();
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_KeyDate=datetime'"
			+ sFormattedDefaultFilterDate + "',P_KeyDate2=datetime'"
			+ sToday + "')/Results"
		);

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check single date default operator", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		sFilterId = "smartFilterBar-filterItemControlA_-STRINGDATE_SINGLE";

		// Assert
		Then.theDefaultOptionShouldBe(sFilterId,undefined);
		Then.theValueToShouldBe(sFilterId, undefined);

		// Act
		//sap:filter-restriction="single-value" sap:semantics="parameters"
		var sParameterId = "smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate",
			sDefaultFilterValue = "2018-12-01T00:00:00",
			sFormattedDefaultFilterDate = new Date(sDefaultFilterValue).toISOString().substr(0,19),
			sToday = oToday[0].oDate.toISOString().slice(0, -5);

		When.iPressTheFilterGoButton();

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Assert
		Then.theDefaultOptionShouldBe(sParameterId,"DATE");
		Then.theValueToShouldBe(sParameterId, sDefaultFilterValue);
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_KeyDate=datetime'" +
			sFormattedDefaultFilterDate + "',P_KeyDate2=datetime'" + sToday + "')/Results");


		// Act
		var sFilterId = "smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date";

		// Assert
		Then.theDefaultOptionShouldBe(sFilterId,"YESTERDAY");

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check single date filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date-input");
		When.iSelectDateOperationByKey("TOMORROW");
		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sTomorrowStart + "'";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRINGDATE_SINGLE-input");
		When.iSelectDateOperationByKey("TOMORROW");
		When.iPressTheFilterGoButton();

		// Assert
		sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and STRINGDATE_SINGLE eq '" + sTomorrowStartAsString + "'";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();

	});

	opaTest("Check single date second filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRINGDATE_SINGLE-input");
		When.iSelectDateOperationByKey("TOMORROW");
		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and STRINGDATE_SINGLE eq '" + sTomorrowStartAsString + "'";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();

	});

	opaTest("Check interval date filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-DATETIME_INTERVAL_d-f_Date-input");
		When.iSelectDateOperationByKey("TODAYFROMTO");
		When.iSetValueToSelectedOperation([-1, -1]);
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DATETIME_INTERVAL_d-f_Date ge datetime'" + sTodayStart + "' and DATETIME_INTERVAL_d-f_Date le datetime'" + sTomorrowStart + "')";

		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check interval date filter query with new options - Next minutes", function(Given, When, Then) {
		var sOperation = "NEXTMINUTES";

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("__xmlview0--smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL_DATE-input");
		When.iSelectDateOperationByKey(sOperation);
		When.iSetValueToSelectedOperation([10], sOperation);
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		Then.waitFor({
			id: "outputAreaFilters",
			success: function (oText) {
				var oNextMinutes = DateStorage.getNextMinutes(sOperation),
					sNextMinutes = getDateTimeAsDateTimeString(oNextMinutes[0]),
					sNextNowMinutes = getDateTimeAsDateTimeString(oNextMinutes[1]),
					sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL_DATE ge datetimeoffset'" + sNextMinutes + "' and DTOFFSET_INTERVAL_DATE le datetimeoffset'" + sNextNowMinutes + "')";

				var sFilterText = oText.getText().replace(/:([0-9]+)Z'/g, ":00Z'");
				Opa5.assert.strictEqual(
					sFilterText,
					sResult
				);
			}
		});

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check interval date filter query with new options - Last minutes", function(Given, When, Then) {
		var sOperation = "LASTMINUTES";

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("__xmlview0--smartFilterBar-filterItemControlA_-DTOFFSET_INTERVAL_DATE-input");
		When.iSelectDateOperationByKey(sOperation);
		When.iSetValueToSelectedOperation([10], sOperation);
		When.iClickApply();

		When.iPressTheFilterGoButton();

		// Assert
		Then.waitFor({
			id: "outputAreaFilters",
			success: function (oText) {
				var oLastMinutes = DateStorage.getLastMinutes(sOperation),
					sLastMinutes = getDateTimeAsDateTimeString(oLastMinutes[0]),
					sLastNowMinutes = getDateTimeAsDateTimeString(oLastMinutes[1]),
					sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and (DTOFFSET_INTERVAL_DATE ge datetimeoffset'" + sLastMinutes + "' and DTOFFSET_INTERVAL_DATE le datetimeoffset'" + sLastNowMinutes + "')";

				var sFilterText = oText.getText().replace(/:([0-9]+)Z'/g, ":00Z'");
				Opa5.assert.strictEqual(
					sFilterText,
					sResult
				);
			}
		});

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Single date operation from variant management", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iEnterValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date", oMResourceBundle.getText("DYNAMIC_DATE_TOMORROW_FORMAT"), false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-STRINGDATE_SINGLE", oMResourceBundle.getText("DYNAMIC_DATE_TOMORROW_FORMAT"), false);

		When.iPressTheFilterGoButton();

		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sTomorrowStart + "' and " +
			"STRINGDATE_SINGLE eq '" + sTomorrowStartAsString + "'";
		Then.theFiltersShouldMatch(sResult);

		// Act
		var sVariantName = "DDR_Single_Test" + new Date().toISOString();
		When.iSaveVariantAs(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), sVariantName);
		When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));
		//When.iPressTheRestoreButton();
		When.iPressTheFilterGoButton();

		// Assert
		var sResultStandart = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "'";
		Then.theFiltersShouldMatch(sResultStandart);

		// Act
		When.iSelectVariant(sVariantName);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iPressTheRestoreButton();
	});

	// BCP: 2180425522
	opaTest("Single date parameter check UiState", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		var sDefaultFilterValue = "2018-12-01T00:00:00",
			sFormattedDefaultFilterDate = new Date(sDefaultFilterValue).toISOString().substr(0,23);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theUiStateShouldContain("P_KeyDate", sFormattedDefaultFilterDate);


		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("String date multiple has only operation EQ", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		var sControlName = "smartFilterBar-filterItemControlA_-STRINGDATE_MULTIPLE";

		When.iOpenTheVHD(sControlName);

		// Assert
		Then.thereIsConditionOperation("STRINGDATE_MULTIPLE", "EQ", oMResourceBundle.getText("CONDITIONPANEL_OPTION_DATE_EQ"));
		Then.theConditionOptionsShouldBeCount("STRINGDATE_MULTIPLE", 2);

		// Cleanup
		When.iPressTheVHDOK(sControlName);
	});

	opaTest("DateTime auto conditions should be with correct text", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		var sControlName = "smartFilterBar-filterItemControlA_-DATETIME_AUTO";

		When.iOpenTheVHD(sControlName);

		// Assert
		Then.thereIsConditionOperation("DATETIME_AUTO", "LT", oMResourceBundle.getText("CONDITIONPANEL_OPTION_DATE_LT"));
		Then.thereIsConditionOperation("DATETIME_AUTO", "GT", oMResourceBundle.getText("CONDITIONPANEL_OPTION_DATE_GT"));

		// Cleanup
		When.iPressTheVHDOK(sControlName);
	});

	opaTest("String date conditions should be with correct text", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		var sControlName = "smartFilterBar-filterItemControlA_-STRINGDATE_AUTO";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.thereIsConditionOperation("STRINGDATE_AUTO", "LT", oMResourceBundle.getText("CONDITIONPANEL_OPTION_DATE_LT"));
		Then.thereIsConditionOperation("STRINGDATE_AUTO", "GT", oMResourceBundle.getText("CONDITIONPANEL_OPTION_DATE_GT"));

		// Cleanup
		When.iPressTheVHDOK(sControlName);
	});

	QUnit.module("DateTimeOffset with Precision");
	opaTest("Check filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_Precision0", 'Dec 6, 2023, 2:21:34 PM', false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_Precision1", 'Dec 6, 2023, 2:21:34 PM', false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_Precision2", 'Dec 6, 2023, 2:21:34 PM', false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_Precision3", 'Dec 6, 2023, 2:21:34 PM', false);


		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sTomorrowStart + "' and " +
			"STRINGDATE_SINGLE eq '" + sTomorrowStartAsString + "' and " +
			"(DTOFFSET_Precision0 ge datetimeoffset'2023-12-06T14:21:34Z' and DTOFFSET_Precision0 le datetimeoffset'2023-12-06T14:21:34Z') and " +
			"(DTOFFSET_Precision1 ge datetimeoffset'2023-12-06T14:21:34Z' and DTOFFSET_Precision1 le datetimeoffset'2023-12-06T14:21:34.900Z') and " +
			"(DTOFFSET_Precision2 ge datetimeoffset'2023-12-06T14:21:34Z' and DTOFFSET_Precision2 le datetimeoffset'2023-12-06T14:21:34.990Z') and " +
			"(DTOFFSET_Precision3 ge datetimeoffset'2023-12-06T14:21:34Z' and DTOFFSET_Precision3 le datetimeoffset'2023-12-06T14:21:34.999Z')";


		Then.theFiltersShouldMatch(sResult);

		// Clean
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});

	opaTest("Check variant and UiState", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));
		//When.iPressTheRestoreButton();
		When.iClickShowAll();
		When.iPressTheFilterGoButton();

		When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_Precision0", 'Dec 6, 2023, 2:21:34 PM', false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_Precision1", 'Dec 6, 2023, 2:21:34 PM', false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_Precision2", 'Dec 6, 2023, 2:21:34 PM', false);
		When.iEnterValue("smartFilterBar-filterItemControlA_-DTOFFSET_Precision3", 'Dec 6, 2023, 2:21:34 PM', false);

		When.iPressTheFilterGoButton();

		// Assert
		var sResult = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "' and " +
			"(DTOFFSET_Precision0 ge datetimeoffset'2023-12-06T14:21:34Z' and DTOFFSET_Precision0 le datetimeoffset'2023-12-06T14:21:34Z') and " +
			"(DTOFFSET_Precision1 ge datetimeoffset'2023-12-06T14:21:34Z' and DTOFFSET_Precision1 le datetimeoffset'2023-12-06T14:21:34.900Z') and " +
			"(DTOFFSET_Precision2 ge datetimeoffset'2023-12-06T14:21:34Z' and DTOFFSET_Precision2 le datetimeoffset'2023-12-06T14:21:34.990Z') and " +
			"(DTOFFSET_Precision3 ge datetimeoffset'2023-12-06T14:21:34Z' and DTOFFSET_Precision3 le datetimeoffset'2023-12-06T14:21:34.999Z')";

		Then.theFiltersShouldMatch(sResult);

		// Act
		var sVariantName = "DTOFFSET_Precision_Test" + new Date().toISOString();
		When.iSaveVariantAs(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), sVariantName);
		When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));
		//When.iPressTheRestoreButton();
		When.iPressTheFilterGoButton();

		// Assert
		var sResultStandard = "DATETIME_SINGLE_d-f_Date eq datetime'" + sYesterdayStart + "'";
		Then.theFiltersShouldMatch(sResultStandard);

		// Act
		When.iSelectVariant(sVariantName);
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch(sResult);

		var sLow = new Date('Dec 6, 2023, 2:21:34 PM').toJSON(),
			sHigh = new Date('Dec 6, 2023, 2:21:34 PM');
		sHigh.setMilliseconds(999);
		sHigh = sHigh.toJSON();

		var oRange = {
				"High": sHigh,
				"Low": sLow,
				"Option": "BT",
				"Sign": "I"
			};

		// Assert
		Then.theUiStateShouldContainSelectOptions("DTOFFSET_Precision3", oRange);

		// Cleanup
		When.iPressTheRestoreButton();
		When.iClickShowAll();
	});


	QUnit.module("Validation");

	opaTest("When pressing Go with empty mandatory filter and setting an UIState after that, the validation error should be cleared", function (Given, When, Then) {
			var sFilterName = "smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate",
				sErrorText =  oCompResourceBundle.getText("MANDATORY_FIELD_WITH_LABEL_ERROR", ["Key Date"]);
			// Arrange
			Given.iEnsureMyAppIsRunning();

			// Act - enter an emty string
			When.iEnterValue(sFilterName, '', false);

			When.iPressTheFilterGoButton();

			// Assert - error
			Then.iShouldSeeFilterWithValueState(sFilterName, "Error");
			Then.iShouldSeeFilterWithValueStateText(sFilterName, sErrorText);

			// Act - set UiState
			When.iPressButton('__xmlview0--setUiState');

			// Assert - no error
			Then.iShouldSeeFilterWithValueState(sFilterName, "None");

			// Cleanup
			When.iPressTheRestoreButton();
			When.iClickShowAll();

			Given.iStopMyApp();
		});

});
