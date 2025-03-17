sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Arrangement',
	'./Action',
	'./Assertion',
	"sap/ui/core/date/UniversalDateUtils"
], function (
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion,
	UniversalDateUtils
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
		oToday = UniversalDateUtils.ranges.today(),
		sTodayStart = getDateAsDateTimeString(oToday[0]),
		oTomorrow = UniversalDateUtils.ranges.tomorrow();

		opaTest("Check single date filter query", function(Given, When, Then) {
			//Arrangements
			Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/appUnderTestFilterDDR_Types/start.html"));

			//Actions
			When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
			When.iAddFilter("DateRangeType DateTime Single");
			When.iOpenTheVHD("FilterPanel-filterItemControlA_-appUnderTestFilterDDR_Types---IDView--IDSmartTable-DTR_SINGLE-input");
			When.iSelectDateOperationByKey("TOMORROW");
			When.iPressOkButton();

			// Assert
			Then.iShouldSeeFilterValueInCodeEditor("appUnderTestFilterDDR_Types---IDView--dataTable",
			[
				{
					"sPath": "DTR_SINGLE",
					"sOperator": "EQ",
					"oValue1": oTomorrow[0].oDate.toISOString(),
					"_bMultiFilter": false
				}
			]);
		});

		opaTest("Check single date second filter query", function(Given, When, Then) {

			//Actions
			When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
			When.iPressOnButtonWithIcon('sap-icon://decline');
			When.iAddFilter("DateRangeType DateTime Single display Date");
			When.iOpenTheVHD("FilterPanel-filterItemControlA_-appUnderTestFilterDDR_Types---IDView--IDSmartTable-DTR_SINGLE_d-f_Date-input");
			When.iSelectDateOperationByKey("TODAY");
			When.iPressOkButton();

			// Assert
			Then.iShouldSeeFilterValueInCodeEditor("appUnderTestFilterDDR_Types---IDView--dataTable",
			[
				{
					"sPath": "DTR_SINGLE_d-f_Date",
					"sOperator": "EQ",
					"oValue1": sTodayStart + ".000Z",
					"_bMultiFilter": false
				}
			]);

			//Cleanup
			Then.iTeardownMyAppFrame();
		});
});
