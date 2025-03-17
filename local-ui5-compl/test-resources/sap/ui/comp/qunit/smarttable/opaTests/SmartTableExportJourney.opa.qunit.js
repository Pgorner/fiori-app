sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/comp/qunit/personalization/opaTests/Action",
	"sap/ui/comp/qunit/personalization/opaTests/Assertion",
	"sap/ui/core/Lib"
], function(
	Opa5,
	opaTest,
	Action,
	Assertion,
	Library
) {
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

	var oResourceBundle = Library.getResourceBundleFor("sap.ui.export");

	opaTest("Start the test application", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/smarttable/opaTests/applicationUnderTestSmartTable/start.html"));
		Then.iShouldSeeATable();
	});

	opaTest("Export XLSX document", function(Given, When, Then) {
		When.iPressOnButtonWithIcon("sap-icon://excel-attachment");

		When.iChangeDownloadLimit(10);
		When.iPressOnButtonWithIcon("sap-icon://excel-attachment");
		const aText = [oResourceBundle.getText("MSG_WARNING_CELL_COUNT", [10, 7, 70])];
		aText.push(oResourceBundle.getText("MSG_WARNING_ROW_LIMIT", [10, "Microsoft Excel (*.xlsx)"]));
		aText.push(oResourceBundle.getText("MSG_WARNING_EXPORT_ANYWAY"));
		Then.iShouldSeeExportWarningDialog(aText.join("\n\n").toString());
		When.iPressOnExportButton();

		Then.iTeardownMyApp();
	});
});