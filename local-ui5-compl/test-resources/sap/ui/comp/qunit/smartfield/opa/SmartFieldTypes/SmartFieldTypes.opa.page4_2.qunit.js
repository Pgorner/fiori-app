/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/model/Filter",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	Filter,
	coreLibrary
) {
	"use strict";
	var ValueState = coreLibrary.ValueState,
		sComponent = "__component0---textArrangement--";

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/textArrangement"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("When I select an item from suggestions list, no request for description should be sent", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheSmartFieldTypesPage.iClearRequestsLog(sComponent + "requests");

			//Action
			When.onTheSmartFieldTypesPage.iOpenSmartFieldSuggestions(sComponent + "languageCode1", "B");
			When.onTheSmartField.iSelectAnItemFromTheSuggest(0);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfRequests(sComponent + "requests", 0, {
				path: "/LanguageName",
				filters: [
					new Filter({
						path: "CODE",
						operator: "EQ",
						value1: "BG"
					})
				],
				urlParameters: {
					"$select": "CODE,NAME",
					"$top": 2
				}
			});

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I select an item from ValueHelpDialog, no request for description should be sent", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheSmartFieldTypesPage.iClearRequestsLog(sComponent + "requests");

			//Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "languageCode1-input");
			When.onTheSmartFieldTypesPage.iSelectRowInVHDTable(0);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfRequests(sComponent + "requests", 0, {
				path: "/LanguageName",
				filters: [
					new Filter({
						path: "CODE",
						operator: "EQ",
						value1: "BG"
					})
				],
				urlParameters: {
					"$select": "CODE,NAME",
					"$top": 2
				}
			});

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with TextArrangement type, the description path should stay consistent on changing Edit/Display mode when I switch multiple times", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode1", "CN");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode1", "CN (China)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode1", "CN (China)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode1", "EN");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode1", "EN (England)");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "languageCode1", "EN (England)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with TextArrangement type which is TextSeparate, the back-end service validation of the user input should be performed", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheSmartFieldTypesPage.iClearRequestsLog(sComponent + "requests");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode14", "DD");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfRequests(sComponent + "requests", 1, {
				filters: [
					new Filter({
						value1: "DD",
						path: "CODE",
						operator: "EQ"
					})
				],
				path: "/LanguageName",
				urlParameters: {
					"$select": "NAME,CODE,CONTINENT,CONTINENT1",
					"$top": 2
				}
			});
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "languageCode14", ValueState.Error);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with TextArrangement type which is TextSeparate and ValueListNoValidation, the only client side validation of the user input should be performed", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheSmartFieldTypesPage.iClearRequestsLog(sComponent + "requests");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode23", "DD");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "languageCode23", ValueState.None);
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfRequests(sComponent + "requests", 0, {
				filters: [
					new Filter({
						value1: "DD",
						path: "CODE",
						operator: "EQ"
					})
				],
				path: "/LanguageName",
				urlParameters: {
					"$select": "NAME,CODE,CONTINENT,CONTINENT1",
					"$top": 2
				}
			});

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with TextArrangement type which is TextSeparate and ValueListNoValidation, no requests should be performed when switching to Display mode.", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheSmartFieldTypesPage.iClearRequestsLog(sComponent + "requests");

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode23", "DD");

			// Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfRequests(sComponent + "requests", 0, {
				filters: [
					new Filter({
						value1: "DD",
						path: "CODE",
						operator: "EQ"
					})
				],
				path: "/LanguageName",
				urlParameters: {
					"$select": "NAME,CODE,CONTINENT,CONTINENT1",
					"$top": 2
				}
			});

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When the back-end service responds successfully to TextArrangement request the SmartField._bValueNotInitial should be changed to true", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithInitialValue(sComponent + "languageCode1", false);

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode1", "DE");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithInitialValue(sComponent + "languageCode1", true);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When when the base controls get destroyed, the corresponding properties of the internal State of the SmartField should be reset. When the base controls get recreated the TextArrangement description should get fetched", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode1", "DE");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode1", "DE (Germany)");

			// Action
			// We go to Display mode, so that both base control for Edit and Display mode get created.
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);
			// We remove the bindingContext, so that the base controls get destroyed.
			When.onTheSmartFieldTypesPage.iPressButton(sComponent + "btnRemoveBindingContext-button");
			// This step is not necessary but it is a part of the application flow that we fix. We go back to edit mode.
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);
			// We set new bindingContext, so that the base controls get created.
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1001");

			// We check if the Description is updated properly for both base controls.
			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode1", "DE (Germany)");

			// Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode1", "DE (Germany)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with Value List fixed-values and TextArrangement type, the internal ComboBox control should have width 100%", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeInnerControlWith(sComponent + "languageCode3", "width", "100%");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use mandatory SmartFields with ValueList fixed-values and additional in parameters, I should see an updated description on binding context change", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "languageCode21", "PL");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode21", "PL (Poland)");

			// Action
			When.onTheSmartFieldTypesPage.iPressSelectProduct("1002");

			//Assertion
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndBindingValue(sComponent + "languageCode21", "DE");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sComponent + "languageCode21", "DE (Germany - Central Europe)");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartFields with ValueList fixed-values, if an invalid key is set to the ComboBox, the selected item should get reset", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheSmartField.iSelectSmartFieldItemByKey(sComponent + "languageCode3", "CN");
			When.onTheSmartFieldTypesPage.iUpdateTheValueFromDataModel(sComponent + "languageCode3", "");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBaseControlValue(sComponent + "languageCode3", "");
			Then.onTheSmartFieldTypesPage.iShouldSeeComboBoxWithSelectedItem(sComponent + "languageCode3", null);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use SmartField with suppressEmptyStringRequest set to true/default value - there should be no request send", function (Given, When, Then) {

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheSmartFieldTypesPage.iClearRequestsLog(sComponent + "requests");
			When.onTheSmartField.iSetSmartFieldControlProperty(sComponent + "languageCode1", "suppressEmptyStringRequest", true);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "languageCode1", "");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeNumberOfRequests(sComponent + "requests", 0,  {
				path: "/LanguageName",
				filters: [
					new Filter({
						path: "CODE",
						operator: "EQ",
						value1: "BG"
					})
				],
				urlParameters: {
					"$select": "CODE,NAME",
					"$top": 2
				}
			});

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});
