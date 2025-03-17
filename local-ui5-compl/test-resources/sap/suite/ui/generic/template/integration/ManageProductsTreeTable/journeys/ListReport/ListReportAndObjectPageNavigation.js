sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Tree Table List Report");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproductstreetable");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.iShouldSeeTheExcelButton()
				.and
				.theResultListContainsTheCorrectNumberOfItems(6);
		});
		//Not relevant anymore as we are removing fitcontent property
		// opaTest("Loading tree table and verify property fitContent=true for Tree Table", function (Given, When, Then) {
		// 	Then.onTheListReportPage
		// 		.iCheckTableProperties({"visible": true}, "treeTable")
		// 		.and
		// 		.iCheckTableColumnVisibility("BreakoutColumn", true, "treeTable")
		// 		.and
		// 		.iCheckDynamicPageProperty("fitContent",true);
		// });

		opaTest("Trigger search in filterbar", function (Given, When, Then) {
			When.onTheListReportPage
				.iSearchInTableToolbarOrSearchInputField("Electronics", "STTAMPTT::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--listReportFilter-btnBasicSearch");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(1);
			When.onTheListReportPage
				.iSearchInTableToolbarOrSearchInputField("", "STTAMPTT::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--listReportFilter-btnBasicSearch");
		});


		opaTest("Trigger filtering in filterbar", function(Given, When, Then){
			When.onTheGenericListReport
				.iSetTheFilter({Field:"Supplier", Value:"100000046"});
			Then.onTheGenericListReport
				.iCheckOverlayForTable("TreeTable" , true);
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Go");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(3);
			When.onTheGenericListReport
				.iSetTheFilter({Field:"Supplier", Value:""});
		});

		opaTest("Check filtering tab in table personalization", function(Given, When, Then){
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://action-settings");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Cancel");
		});

		opaTest("Trigger custom action in filterbar", function(Given, When, Then){
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Custom action");
			Then.onTheGenericListReport
				.iSeeTheDialogWithTitle("Success");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("OK");
			Then.iTeardownMyApp();
		});
	}
);
