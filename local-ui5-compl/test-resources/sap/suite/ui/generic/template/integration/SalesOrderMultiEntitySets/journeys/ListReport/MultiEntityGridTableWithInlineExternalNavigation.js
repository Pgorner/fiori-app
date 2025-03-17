sap.ui.define([
	"sap/ui/test/opaQunit"
], function (opaTest) {
	"use strict";

	QUnit.module("Sales Order Multi EntitySets - Grid Table With Inline External Navigation Configured");
	
	opaTest("Starting the app with the dynamic manifest", function (Given, When, Then) {
		Given.iStartMyAppInSandbox("EPMProduct-manage_st,SalesOrder-MultiViews#SalesOrder-MultiViews", "manifestGridTableWithExternalNavigation");
		When.onTheGenericListReport
			.iExecuteTheSearch();
		Then.onTheGenericListReport
			.theResultListContainsTheCorrectNumberOfItems(11, 1);
	});

	opaTest("Navigating to scheduled lines tab and checking the external navigation", function (Given, When, Then) {
		When.onTheGenericListReport
			.iClickOnIconTabFilter("4");
		Then.onTheGenericListReport
			.theResultListContainsTheCorrectNumberOfItems(10, 4);
		When.onTheGenericListReport
			.iNavigateFromListItemByLineNo(1, "listReport-4");
		Then.onTheGenericListReport
			.iSeeShellHeaderWithTitle("Manage Products (Technical Application)");
		Then.iTeardownMyApp();
	});

});
