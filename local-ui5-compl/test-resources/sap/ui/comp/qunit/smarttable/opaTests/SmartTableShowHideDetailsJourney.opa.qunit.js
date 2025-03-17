sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion'
], function(
	Opa5,
	opaTest,
	Action,
	Assertion) {
	"use strict";

	if (window.blanket) {
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		actions: new Action(),
		assertions: new Assertion(),
		asyncPolling: true,
		timeout: 30
	});

	const sTableId = "__xmlview0--LineItemsSmartTable";

	opaTest("Start the test application", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/smarttable/opaTests/applicationUnderTestSmartTable/start.html?sap-ui-xx-persistShowDetails=true"));
		Then.iShouldSeeATable();
	});

	opaTest("When I press the Show More/Less per Row button, the variant should indicate it's modified", function (Given, When, Then) {
		Then.iShouldSeeAVariant(sTableId, false);
		Then.iShouldSeeShowMorePerRowButton(sTableId);
		// State true  => Show More Per Row
		// State false => Show Less Per Row
		Then.iShouldSeeShowMorePerRowButton(sTableId, false); // default state
		When.iSelectShowMoreShowLessPerRow(sTableId, true);
		Then.iShouldSeeAVariant(sTableId, true);
	});

	opaTest("When I load a variant, the saved show/hide details state should be loaded as well", function (Given, When, Then) {
		When.iSaveVariantAs("Standard", "showHideTrue");
		When.iSelectVariantByVariantManagerID(`${sTableId}-variant`, "Standard");
		Then.iShouldSeeShowMorePerRowButton(sTableId, false);
		When.iSelectVariantByVariantManagerID(`${sTableId}-variant`, "showHideTrue");
		Then.iShouldSeeShowMorePerRowButton(sTableId, true);
	});
});