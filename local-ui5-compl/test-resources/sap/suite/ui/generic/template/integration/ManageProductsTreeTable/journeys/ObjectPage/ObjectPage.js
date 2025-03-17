sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Tree Table Object Page");

		opaTest("Check Object page title and table column visibility", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproductstreetable");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iNavigateUsingUITable(1, "TreeTable");
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information"])
				.and
				.theObjectPageHeaderTitleIsCorrect("Electronics");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "treeTable")
				.and
				.iCheckTableCustomColumnVisibility("BreakoutColumn", true, "treeTable");
		});

		opaTest("Tree table is visible edit mode and sections are visible and check table column width for FE rendered column", function (Given, When, Then) {
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Edit");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "treeTable");
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Cancel");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode()
				.and
				.iShouldSeeTheSections(["General Information", "Sales Price table", "Simple text facet"]);
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "treeTable")
				.and
				.iCheckControlPropertiesById("23Rating1", { "visible": true, "width": "6.875rem"});
			Then.iTeardownMyApp();
		});
	}
);
