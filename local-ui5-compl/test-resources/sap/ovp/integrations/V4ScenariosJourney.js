/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ovp/integrations/pages/CommonArrangements",
	"test-resources/sap/ovp/integrations/pages/CommonActions",
	"test-resources/sap/ovp/integrations/pages/CommonAssertions",
], function (
	Opa5,
	opaTest,
	CommonArrangements,
	CommonActions,
	CommonAssertions
) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new CommonArrangements(),
		actions: new CommonActions(),
		assertions: new CommonAssertions(),
		autoWait: true,
		viewNamespace: "view."
	});

	var sCountryValueHelp = "application-saphanaoverview-display-component---mainView--ovpGlobalMacroFilter::FilterField::countryKey-inner-vhi";
	var sVHSearch = "application-saphanaoverview-display-component---mainView--ovpGlobalMacroFilter::FilterFieldValueHelp::countryKey::Dialog::qualifier::-search-inner";
	var sVHCheckBox = "application-saphanaoverview-display-component---mainView--ovpGlobalMacroFilter::FilterFieldValueHelp::countryKey::Dialog::qualifier::::Table-innerTable";
	var sGoButtonId = "application-saphanaoverview-display-component---mainView--ovpGlobalMacroFilter-content-btnSearch";

	opaTest("#0: Open App", function (Given, When, Then) {
		Given.iStartMyApp("saphanaoverview-display");
		Then.checkAppTitle("SAP Hana Demo");
	});

	opaTest("#1 Check for Macro Filter Bar Loaded", function (Given, When, Then) {
		Then.iCheckControlWithIdExists("application-saphanaoverview-display-component---mainView--ovpGlobalMacroFilter-content");
	});

	opaTest("#2 Check KPI value before applying filter", function (Given, When, Then) {
		When.iClickTheGoButton(sGoButtonId);
		Then.iCheckCardKpiInfo("analysisCardOriginal", "2K", "KPIValue");
	});

	opaTest("#3 Select value from filter valuehelp and click Go button", function (Given, When, Then) {
		When.iClickTheButtonWithId(sCountryValueHelp, "sap.ui.core.Icon");
		When.iClickTheEnterKey(sVHSearch, 'Uni');
		When.iClickCheckboxInVH(sVHCheckBox)
		When.iClickTheButtonWithId("__dialog1-ok");
		When.iClickTheGoButton(sGoButtonId);
	});

	opaTest("#4 Check KPI value after applying filter", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("analysisCardOriginal", "234", "KPIValue");
	});

});