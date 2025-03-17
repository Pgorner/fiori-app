/* global opaSkip */

sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Arrangement',
	'./Action',
	'./Assertion',
	"sap/ui/core/date/UniversalDateUtils",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/DateStorage"
], function (
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion,
	UniversalDateUtils,
	DateStorage
) {
	"use strict";

	Opa5.extendConfig({
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});
	const getDateAsDateTimeString = function (oDate) {
			const sDate = oDate.oDate ? oDate.oDate.toISOString() : oDate.toISOString();
			return sDate.substring(0, sDate.length - 13) + "00:00:00";
		},
		getDateTimeAsDateTimeString = function (oDate) {
			var oCurrentDate = oDate.oDate ? oDate.oDate : oDate;
			var sPadString = "0",
				sDate = oCurrentDate.getUTCFullYear().toString().padStart(4, sPadString) + "-" +
						(oCurrentDate.getUTCMonth() + 1).toString().padStart(2, sPadString) + "-" +
						oCurrentDate.getUTCDate().toString().padStart(2, sPadString) + "T" +
						oCurrentDate.getHours().toString().padStart(2, sPadString) + ":" +
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

	opaTest("Check single date filter query", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/appUnderTestFilterDDR_useDRT/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iAddFilter("DateTime Single display Date");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-appUnderTestFilterDDR_useDRT---IDView--IDSmartTable-DATETIME_SINGLE_d-f_Date-input");
		When.iSelectDateOperationByKey("TOMORROW");
		When.iPressOkButton();

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("appUnderTestFilterDDR_useDRT---IDView--dataTable",
		[
			{
				"sPath": "DATETIME_SINGLE_d-f_Date",
				"sOperator": "EQ",
				"oValue1": sTomorrowStart + ".000Z",
				"_bMultiFilter": false
			}
		]);

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');
		When.iAddFilter("StringDate Single");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-appUnderTestFilterDDR_useDRT---IDView--IDSmartTable-STRINGDATE_SINGLE-input");
		When.iSelectDateOperationByKey("TOMORROW");
		When.iPressOkButton();

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("appUnderTestFilterDDR_useDRT---IDView--dataTable",
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

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');

		When.iAddFilter("DateTime Interval display Date");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-appUnderTestFilterDDR_useDRT---IDView--IDSmartTable-DATETIME_INTERVAL_d-f_Date-input");
		When.iSelectDateOperationByKey("TODAYFROMTO");
		When.iSetValueToSelectedOperation([-1, -1]);
		When.iClickApply();
		When.iPressOkButton();

		// Assert
		Then.iShouldSeeFilterValueInCodeEditor("appUnderTestFilterDDR_useDRT---IDView--dataTable",
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

	opaSkip("Check interval date filter query with new options - Next minutes", function(Given, When, Then) {
		const sOperation = "NEXTMINUTES";
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');

		When.iAddFilter("DTOffset Interval with controlType 'date'");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-appUnderTestFilterDDR_useDRT---IDView--IDSmartTable-DTOFFSET_INTERVAL_DATE-input");
		When.iSelectDateOperationByKey(sOperation);
		When.iSetValueToSelectedOperation([10], sOperation);
		When.iClickApply();
		When.iPressOkButton();

		Then.waitFor({
			id: "appUnderTestFilterDDR_useDRT---IDView--dataTable",
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

	opaSkip("Check interval date filter query with new options - Last minutes", function(Given, When, Then) {
		const sOperation = "LASTMINUTES";
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressOnButtonWithIcon('sap-icon://decline');

		When.iAddFilter("DTOffset Interval with controlType 'date'");
		When.iOpenTheVHD("FilterPanel-filterItemControlA_-appUnderTestFilterDDR_useDRT---IDView--IDSmartTable-DTOFFSET_INTERVAL_DATE-input");
		When.iSelectDateOperationByKey(sOperation);
		When.iSetValueToSelectedOperation([10], sOperation);
		When.iClickApply();
		When.iPressOkButton();

		Then.waitFor({
			id: "appUnderTestFilterDDR_useDRT---IDView--dataTable",
			success: function(oData) {

				const oLastMinutes = DateStorage.getLastMinutes(sOperation),
					sLastMinutes = getDateTimeAsDateTimeString(oLastMinutes[0]),
					sLastNowMinutes = getDateTimeAsDateTimeString(oLastMinutes[1]),
					oResult = JSON.parse(oData.getValue())[0];

				oResult.oValue1 = oResult.oValue1.slice(0, -7) + "00Z";
				oResult.oValue2 = oResult.oValue2.slice(0, -7) + "00Z";

				Opa5.assert.equal(
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

		//Cleanup
		Then.iTeardownMyAppFrame();
	});

});
