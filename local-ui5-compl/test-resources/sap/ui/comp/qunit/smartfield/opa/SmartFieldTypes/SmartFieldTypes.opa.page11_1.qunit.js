/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest
) {
	"use strict";

	var sComponent = "__component0---analytical--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/analytical"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("SmartField with TextArrangement handling analytical parameters", function(Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheSmartFieldTypesPage.iClearRequestsLog(sComponent + "requests");

			// Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "languageCode22-input");
			When.onTheValueHelpDialog.iCloseTheValueHelpDialog(true);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfRequests(sComponent + "requests", 1, {
				filters: undefined,
				path: "/LanguageNameParameters(P_INT=90,P_STR=%27A%27)/RESULTS",
				urlParameters: [
					"$skip=0&$top=137",
					"$orderby=CODE%20asc",
					"$filter=CONTINENT%20eq%20%27Europe%27",
					"search-focus=CODE&search=&$select=CODE%2cNAME"
				]
			});

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
