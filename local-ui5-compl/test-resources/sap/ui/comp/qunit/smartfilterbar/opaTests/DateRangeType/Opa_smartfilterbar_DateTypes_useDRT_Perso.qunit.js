/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/date/UniversalDateUtils",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/actions/DateRangeActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/DateStorage"
], function(
	Library,
	Opa5,
	opaTest,
	UniversalDateUtils,
	Actions,
	Assertions,
	DateStorage
) {
	"use strict";

	const oMResourceBundle = Library.getResourceBundleFor("sap.m"),
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
		},
		oToday = UniversalDateUtils.ranges.today(),
		sTodayStart = getDateAsDateTimeString(oToday[0]),
		oTomorrow = UniversalDateUtils.ranges.tomorrow(),
		sTomorrowStart = getDateAsDateTimeString(oTomorrow[0]),
		sTomorrowStartAsString = getDateAsString(oTomorrow[0]);

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
		const oExpectedFieldTypes = [{
			label: "DateTime Single display Date",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_SINGLE_d-f_Date",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "DateTime Multiple display Date",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_MULTIPLE_d-f_Date",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "DateTime Interval display Date",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_INTERVAL_d-f_Date",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "DateTime Auto display Date",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_AUTO_d-f_Date",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "DateTime Single",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_SINGLE",
			type: "sap.m.Input"
		}, {
			label: "DateTime Multiple",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_MULTIPLE",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "DateTime Interval",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_INTERVAL",
			type: "sap.m.Input"
		}, {
			label: "DateTime Auto",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_AUTO",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "DTOffset Single",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_SINGLE",
			type: "sap.m.DateTimePicker"
		}, {
			label: "DTOffset Multiple",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_MULTIPLE",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "DTOffset Interval",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_INTERVAL",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "DTOffset Single with controlType 'date'",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_SINGLE_DATE",
			type: "sap.m.DatePicker"
		}, {
			label: "DTOffset Interval with controlType 'date'",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_INTERVAL_DATE",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "StringDate Single",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-STRINGDATE_SINGLE",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "StringDate Multiple",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-STRINGDATE_MULTIPLE",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "StringDate Interval",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-STRINGDATE_INTERVAL",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "StringDate Auto",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-STRINGDATE_AUTO",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "Time Single",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-TIME_SINGLE",
			type: "sap.m.TimePicker"
		}, {
			label: "Time Multiple",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-TIME_MULTIPLE",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "Time Interval",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-TIME_INTERVAL",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "Time Auto",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-TIME_AUTO",
			type: "sap.ui.comp.smartfilterbar.SFBMultiInput"
		}, {
			label: "DTOffset Precision=0",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision0",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "DTOffset Precision=1",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision1",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "DTOffset Precision=2",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision2",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "DTOffset Precision=3",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision3",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "DTOffset Precision=4",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision4",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "DTOffset Precision=5",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision5",
			type: "sap.m.DynamicDateRange"
		}, {
			label: "DTOffset Precision=6",
			id: "FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision6",
			type: "sap.m.DynamicDateRange"
		}];

		// Arrange
		Given.iEnsureMyAppIsRunning();

		//Actions
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));

		oExpectedFieldTypes.forEach((oItem) => {
			When.iAddFilter(oItem.label);
			Then.theFilterWithIdShouldBeOfType(oItem.id, oItem.type);
		});

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_CANCEL"));
		// When.iPressAButtonOnTheWarningDialog(oMResourceBundle.getText("P13NDIALOG_OK"));
	});

	opaTest("Check filtered single operations", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();
		const sFilterId = "FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_SINGLE_d-f_Date";

		//Actions
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));

		//Actions
		When.iAddFilter("DateTime Single display Date");
		When.iOpenTheVHDPerso(sFilterId + "-input");

		// Assert
		Then.theOptionsShouldBeCountPerso(sFilterId, 12);
		Then.theOptionShouldBeInTheListPerso(sFilterId,"DATE");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"TOMORROW");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"YESTERDAY");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"TODAY");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"LASTDAYWEEK");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"FIRSTDAYWEEK");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"LASTDAYMONTH");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"FIRSTDAYMONTH");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"FIRSTDAYQUARTER");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"LASTDAYQUARTER");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"LASTDAYYEAR");
		Then.theOptionShouldBeInTheListPerso(sFilterId,"FIRSTDAYYEAR");

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));
	});

	opaTest("Check single date filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iAddFilter("DateTime Single display Date");
		When.iOpenTheVHDPerso("FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_SINGLE_d-f_Date-input");

		When.iSelectDateOperationByKey("TOMORROW");
		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DATETIME_SINGLE_d-f_Date",
				"sOperator": "EQ",
				"oValue1": sTomorrowStart + ".000Z",
				"_bMultiFilter": false
			}
		]);

		// Act
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("StringDate Single");
		When.iOpenTheVHDPerso("FilterPanel-filterItemControlA_-IDSmartTable-STRINGDATE_SINGLE-input");
		When.iSelectDateOperationByKey("TOMORROW");
		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "STRINGDATE_SINGLE",
				"sOperator": "EQ",
				"oValue1": sTomorrowStartAsString,
				"_bMultiFilter": false
			}
		]);

	});

	opaTest("Check interval date filter query", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DateTime Interval display Date");
		When.iOpenTheVHDPerso("FilterPanel-filterItemControlA_-IDSmartTable-DATETIME_INTERVAL_d-f_Date-input");
		When.iSelectDateOperationByKey("TODAYFROMTO");
		When.iSetValueToSelectedOperation([-1, -1]);
		When.iClickApply();
		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DATETIME_INTERVAL_d-f_Date",
				"sOperator": "BT",
				"oValue1": sTodayStart + ".000Z",
				"oValue2": sTomorrowStart + ".000Z",
				"_bMultiFilter": false
			}
		]);
	});

	opaTest("Check interval date filter query with new options - Next minutes", function(Given, When, Then) {
		const sOperation = "NEXTMINUTES";
		//Actions

		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Interval with controlType 'date'");
		When.iOpenTheVHDPerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_INTERVAL_DATE-input");
		When.iSelectDateOperationByKey(sOperation);
		When.iSetValueToSelectedOperation([10], sOperation);
		When.iClickApply();
		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		Then.waitFor({
			id: "dataTable",
			success: function(oData) {

				const oNextMinutes = DateStorage.getNextMinutes(sOperation),
					sNextMinutes = getDateTimeAsDateTimeString(oNextMinutes[0]),
					sNextNowMinutes = getDateTimeAsDateTimeString(oNextMinutes[1]),
					oResult = JSON.parse(oData.getValue())[0];

				oResult.oValue1 = oResult.oValue1.slice(0, -7) + "00Z";
				oResult.oValue2 = oResult.oValue2.slice(0, -7) + "00Z";

				Opa5.assert.strictEqual(
					JSON.stringify(oResult),
					JSON.stringify({
						"sPath": "DTOFFSET_INTERVAL_DATE",
						"sOperator": "BT",
						"oValue1": sNextMinutes,
						"oValue2": sNextNowMinutes,
						"_bMultiFilter": false
					})
				);
			}
		});
	});

	opaTest("Check interval date filter query with new options - LAST minutes", function(Given, When, Then) {
		const sOperation = "LASTMINUTES";
		//Actions

		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Interval with controlType 'date'");
		When.iOpenTheVHDPerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_INTERVAL_DATE-input");
		When.iSelectDateOperationByKey(sOperation);
		When.iSetValueToSelectedOperation([10], sOperation);
		When.iClickApply();
		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		Then.waitFor({
			id: "dataTable",
			success: function(oData) {

				const oLastMinutes = DateStorage.getLastMinutes(sOperation),
					sLastMinutes = getDateTimeAsDateTimeString(oLastMinutes[0]),
					sLastNowMinutes = getDateTimeAsDateTimeString(oLastMinutes[1]),
					oResult = JSON.parse(oData.getValue())[0];

				oResult.oValue1 = oResult.oValue1.slice(0, -7) + "00Z";
				oResult.oValue2 = oResult.oValue2.slice(0, -7) + "00Z";

				Opa5.assert.strictEqual(
					JSON.stringify(oResult),
					JSON.stringify({
						"sPath": "DTOFFSET_INTERVAL_DATE",
						"sOperator": "BT",
						"oValue1": sLastMinutes,
						"oValue2": sLastNowMinutes,
						"_bMultiFilter": false
					})
				);
			}
		});
	});

	QUnit.module("DateTimeOffset with Precision");

	opaTest("Check filter query for precision 0", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Precision=0");
		When.iEnterValuePerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision0", 'Dec 6, 2023, 2:21:34 PM', false);

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DTOFFSET_Precision0",
				"sOperator": "BT",
				"oValue1": "2023-12-06T14:21:34.000Z",
				"oValue2": "2023-12-06T14:21:34.000Z",
				"_bMultiFilter": false
			}
		]);
	});
	opaTest("Check filter query for precision 1", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Precision=1");
		When.iEnterValuePerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision1", 'Dec 6, 2023, 2:21:34 PM', false);

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DTOFFSET_Precision1",
				"sOperator": "BT",
				"oValue1": "2023-12-06T14:21:34.000Z",
				"oValue2": "2023-12-06T14:21:34.900Z",
				"_bMultiFilter": false
			}
		]);
	});
	opaTest("Check filter query for Precision 2", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Precision=2");
		When.iEnterValuePerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision2", 'Dec 6, 2023, 2:21:34 PM', false);

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DTOFFSET_Precision2",
				"sOperator": "BT",
				"oValue1": "2023-12-06T14:21:34.000Z",
				"oValue2": "2023-12-06T14:21:34.990Z",
				"_bMultiFilter": false
			}
		]);
	});
	opaTest("Check filter query for Precision 3", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Precision=3");
		When.iEnterValuePerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision3", 'Dec 6, 2023, 2:21:34 PM', false);

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DTOFFSET_Precision3",
				"sOperator": "BT",
				"oValue1": "2023-12-06T14:21:34.000Z",
				"oValue2": "2023-12-06T14:21:34.999Z",
				"_bMultiFilter": false
			}
		]);
	});
	opaTest("Check filter query for Precision 4", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Precision=4");
		When.iEnterValuePerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision4", 'Dec 6, 2023, 2:21:34 PM', false);

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DTOFFSET_Precision4",
				"sOperator": "BT",
				"oValue1": "2023-12-06T14:21:34.000Z",
				"oValue2": "2023-12-06T14:21:34.999Z",
				"_bMultiFilter": false,
				"sFractionalSeconds2": "9"
			}
		]);
	});
	opaTest("Check filter query for Precision 5", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Precision=5");
		When.iEnterValuePerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision5", 'Dec 6, 2023, 2:21:34 PM', false);

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DTOFFSET_Precision5",
				"sOperator": "BT",
				"oValue1": "2023-12-06T14:21:34.000Z",
				"oValue2": "2023-12-06T14:21:34.999Z",
				"_bMultiFilter": false,
				"sFractionalSeconds2": "99"
			}
		]);
	});
	opaTest("Check filter query for Precision 6", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Precision=6");
		When.iEnterValuePerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision6", 'Dec 6, 2023, 2:21:34 PM', false);

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DTOFFSET_Precision6",
				"sOperator": "BT",
				"oValue1": "2023-12-06T14:21:34.000Z",
				"oValue2": "2023-12-06T14:21:34.999Z",
				"_bMultiFilter": false,
				"sFractionalSeconds2": "999"
			}
		]);

	});

	opaTest("Check filter query for Precision 7", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iClearDDRValue("smartFilterBar-filterItemControlA_-DATETIME_SINGLE_d-f_Date");
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(oMResourceBundle.getText("VIEWSETTINGS_TITLE_FILTER"));
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("DTOffset Precision=7");
		When.iEnterValuePerso("FilterPanel-filterItemControlA_-IDSmartTable-DTOFFSET_Precision7", 'Dec 6, 2023, 2:21:34 PM', false);

		When.iPressAButtonOnTheP13nDialog(oMResourceBundle.getText("P13NDIALOG_OK"));

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("dataTable",
		[
			{
				"sPath": "DTOFFSET_Precision7",
				"sOperator": "BT",
				"oValue1": "2023-12-06T14:21:34.000Z",
				"oValue2": "2023-12-06T14:21:34.999Z",
				"_bMultiFilter": false,
				"sFractionalSeconds2": "9999"
			}
		]);

		Given.iStopMyApp();
	});
});
