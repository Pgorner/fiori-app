/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - Regression Test 1 - Journey");

	opaTest("Check for condensed mode", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics2");
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheDialogWithTitle("Adapt Filters");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheTable.iShouldSeeTheComponent("condensed mode", "sap.ui.comp.smarttable.SmartTable", { styleClass: "sapUiSizeCondensed" }, undefined, "analytics2", "sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage", "ZCOSTCENTERCOSTSQUERY0020");
		Then.iTeardownMyApp();
	});
	opaTest("Check for compact mode", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("analytics3");
		Then.onTheTable.iShouldSeeTheComponent("compact mode", "sap.ui.comp.smarttable.SmartTable", { styleClass: "sapUiSizeCompact" }, undefined, "analytics3", "sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage", "ZCOSTCENTERCOSTSQUERY0020");
		Then.iTeardownMyApp();
	});
});
