sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - List Report");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesorderitemaggr");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(182, "_tab1")
				.and
				.theResultListFieldHasTheCorrectValue({Line:1, Field:"ProductId", Value:"HT-1003"}, "_tab1")
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1,182);
		});

		opaTest("Switching to _tab2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("_tab2");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {"visible": true})
				.and
				/* TODO: Checking the customData of a control should not be done in an OPA test case as it is not a 
				   blackbox test. It should get refactored and OPA should be added on the features dependant on the 
				   used customData. */
				.iCheckCustomDataOfControl("sap.ui.comp.smartchart.SmartChart", "listReport-_tab2", {"presentationVariantQualifier": "Chart1", "chartQualifier": "Chart1"})
				.and
				.iCheckCustomDataOfControl("sap.m.IconTabFilter", "IconTabFilter-_tab2", {"variantAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#Chart1", "text": "Chart1"});
		});

		opaTest("Switching to _tab3", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("_tab3");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Switching to _tab4", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("_tab4");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {"visible": true})
			Then.iTeardownMyApp();
		});
	}
);
