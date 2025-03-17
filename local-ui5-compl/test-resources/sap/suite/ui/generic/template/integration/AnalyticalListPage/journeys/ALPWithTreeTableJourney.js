/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - ALPWithTreeTableJourney");
	opaTest("Check if the Analytical List Page with TreeTable App is up", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics5");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
	});

	opaTest("Check if the table is Tree Table", function (Given, When, Then) {
		Then.onTheTable.iCheckControlPropertiesByControlType("sap.ui.table.TreeTable", { "visible": true });
	});

	opaTest("Check the ALP table cell visibility for the columns 'Price per Unit' based on the path value 'Validation'", function (Given, When, Then) {
		Then.onTheMainPage
			.iCheckRenderedColumnTextOnNthRowOfTable(1, [6], ["Yes"], "treeTable", "treeTable")
			.and
			.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(1, 3, false, "treeTable", "treeTable")
			.and
			.iCheckRenderedColumnTextOnNthRowOfTable(2, [6], ["No"], "treeTable", "treeTable")
			.and
			.iCheckTheCellVisibilityOfNthColumnOnNthRowOfTable(2, 3, true, "treeTable", "treeTable");
	});

	opaTest("Check the heading level value for the table when there is no KPI Tag overflow toolbar exists", function (Given, When, Then) {
		Then.onTheMainPage.iCheckControlPropertiesById("table", { "visible": true, "header": "Title", "headerLevel": "H3" });
		Then.iTeardownMyApp();
	});
});
