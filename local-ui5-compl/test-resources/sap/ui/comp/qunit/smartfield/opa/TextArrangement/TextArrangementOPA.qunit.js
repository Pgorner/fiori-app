/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	CoreLibrary
) {
	"use strict";

	var ValueState = CoreLibrary.ValueState;

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/TextArrangement/applicationUnderTest/TextArrangement.html?data-sap-ui-xx-disableTextArrangementReadCache=true"
			}
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 30
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/TextArrangement/applicationUnderTest/test/pages/Application"
	], function() {

		QUnit.module("ValueList single KEY relationship");

		opaTest("Requests are only for Key - no substringof in the request", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("Name", "2");

			// Assert
			Then.onTheApplicationPage.iShouldCheckTheRequestParameters();
		});

		opaTest("Only one request is made per value change", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("Name", "3");

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");

			// Act
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("Name", "1");

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");

			// Act - value does not exist in value list
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("Name", "7");

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");

			// Shutdown
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.module("ValueListNoValidation compound KEY relationship");

		opaTest("Requests are only for Key - no substringof in the request", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "2 (ValueList 2)");
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '2' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA' and KEY3 eq 'BBB')");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("ProductName", "3");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "3 (ValueList 3)");
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '3' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA' and KEY3 eq 'BBB')");
			Then.onTheApplicationPage.iCheckTheRequestHasNoSubstringText();
		});

		opaTest("Request with empty compound keys -> InitialValueIsSignificant=true KEY2 nullable=false and KEY3 nullable=true", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iEmptyModelValuesForCompoundKeys();
			When.onTheApplicationPage.iChangeTheValueTo("ProductName", "3");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "3 (ValueList 3)");
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '3' and (CONSTANT eq 'Bulgaria' and KEY2 eq '' and (KEY3 eq '' or KEY3 eq null))");
		});

		opaTest("Request with empty compound keys -> InitialValueIsSignificant=false KEY2 nullable=false and KEY3 nullable=true", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iEmptyModelValuesForCompoundKeys();
			When.onTheApplicationPage.iChangeTheValueTo("FacilityName", "3");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("FacilityName", "3 (ValueList 3)");
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '3' and CONSTANT eq 'Bulgaria'");

			// Shutdown
			// Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.module("ValueListNoValidation synchronous model update");

		opaTest("Value written to the model synchronous", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "2 (ValueList 2)");
			Then.waitFor({
				id: "ProductName",
				success: function (oSmartField) {
					Opa5.assert.strictEqual(
						oSmartField.getTextInEditModeSource(), "ValueListNoValidation",
						"SmartField is in ValueListNoValidation mode");
				}
			});

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("ProductName", "3");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': 3", 0);
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '3' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA' and KEY3 eq 'BBB')", 1);

			// Act - non existing value
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("ProductName", "7");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': 7", 0);
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '7' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA' and KEY3 eq 'BBB')", 1);
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "7");

			// Act - existing value
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("ProductName", "1");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': 1", 0);
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '1' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA' and KEY3 eq 'BBB')", 1);
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "1 (ValueList 1)");

			// Act - initial value
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("ProductName", "2");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': undefined", 0);
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '2' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA' and KEY3 eq 'BBB')", 1);
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "2 (ValueList 2)");
		});

		QUnit.module("ValueListNoValidation description update on model change");

		opaTest("Value written to the model synchronous", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iClearTheLog();

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("productNameInput", "1");

			// Assert
			Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': 1", null, 0);
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "1 (ValueList 1)");
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '1' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA' and KEY3 eq 'BBB')", 0);

			// Act - non existing value
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheInputValueTo("productNameInput", "9");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "9");
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '9' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA' and KEY3 eq 'BBB')", 0);

			// Act - existing value
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheInputValueTo("productNameInput", "4");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "4 (ValueList 4)");
			Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,KEY2,KEY3,CONSTANT,TXT&$top=2&$filter=KEY eq '4' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA' and KEY3 eq 'BBB')", 0);
		});

		QUnit.module("Skip description request");

		opaTest("Suggestions", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iClearTheLog();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("CompanyName", 0);
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("CompanyName", 1);
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("CompanyName", 2);
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("CompanyName", 3);
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("CompanyName", 4);
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("CompanyName", 5);

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(0, "ProductVH");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("productNameInput", "9");

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "ProductVH");
		});

		opaTest("ValueHelp", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iClearTheLog();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--CompanyName-input", 0);
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--CompanyName-input", 1);
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--CompanyName-input", 2);
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--CompanyName-input", 3);
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--CompanyName-input", 4);
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--CompanyName-input", 5);

			// Assert
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(0, "ProductVH");
		});

		QUnit.module("InOut parameters");

		opaTest("Dependent fields with TextArrangement with ValueHelp dialog selection", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--NameInOut1-input", 0);

			// Assert
			Then.waitFor({
				id: "idView--NameInOut1",
				success: function (oSF) {
					Opa5.assert.notOk(oSF.getControlFactory().oTextArrangementDelegate.getDataForNextDescriptionRequest(),
						"Cache should be disabled for this field");
				}
			});
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameInOut1", "ValueList 1");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameInOut2", "ValueList 2");
			Then.onTheApplicationPage.iShouldNotSeeRequest("testService/StringVH?$select=KEY,KEY2,TXT,DeprecationCode&$top=2&$filter=KEY eq '1'");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");
			Then.onTheApplicationPage.iShouldSeeRequest("testService/StringVH?$select=KEY,KEY2,TXT,DeprecationCode&$top=2&$filter=KEY eq '2' and KEY2 eq '1'", 0);
		});

		opaTest("Dependent fields with TextArrangement with Suggestions selection", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("idView--NameInOut1", 1);

			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameInOut1", "ValueList 2");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameInOut2", "ValueList 1");
			Then.onTheApplicationPage.iShouldNotSeeRequest("testService/StringVH?$select=KEY,KEY2,TXT,DeprecationCode&$top=2&$filter=KEY eq '2'");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");
			Then.onTheApplicationPage.iShouldSeeRequest("testService/StringVH?$select=KEY,KEY2,TXT,DeprecationCode&$top=2&$filter=KEY eq '1' and KEY2 eq '2'", 0);
		});

		QUnit.module("TextArrangement value updated by model");

		opaTest("No Common.Text annotation", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Description: On value change from the model (external input) proper description is retrieved from
			// the value list.

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "2 (ValueList 2)");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("productNameInput", "3");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "3 (ValueList 3)");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("productNameInput", "4");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "4 (ValueList 4)");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("productNameInput", "2");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("ProductName", "2 (ValueList 2)");
		});

		opaTest("Common.Text annotation", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Description: Initial value is taken from Common.Text and after several updates it's updated back to the
			// initial value and for it now the description from the value list is used.

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText", "1 (Local Text)");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("NameWithLocalTextInput", "2");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText", "2 (ValueList 2)");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("NameWithLocalTextInput", "3");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText", "3 (ValueList 3)");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("NameWithLocalTextInput", "1");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText", "1 (ValueList 1)");

			// Shutdown
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.module("TextArrangementRead");

		opaTest("TextArrangementRead cache is working", function (Given, When, Then) {
			// Arrange -> start the app without disabling cache
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning("test-resources/sap/ui/comp/qunit/smartfield/opa/TextArrangement/applicationUnderTest/TextArrangement.html");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("Name", "2");
			When.onTheApplicationPage.iChangeTheValueTo("Name", "3");
			When.onTheApplicationPage.iChangeTheValueTo("Name", "4");
			When.onTheApplicationPage.iClearTheLog();

			// Act & Assert -> Repeat the already send requests
			When.onTheApplicationPage.iChangeTheValueTo("Name", "1");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Name", "1 (ValueList 1)");

			// Act & Assert
			When.onTheApplicationPage.iChangeTheValueTo("Name", "2");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Name", "2 (ValueList 2)");

			// Act & Assert
			When.onTheApplicationPage.iChangeTheValueTo("Name", "3");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Name", "3 (ValueList 3)");

			// Act & Assert
			When.onTheApplicationPage.iChangeTheValueTo("Name", "4");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Name", "4 (ValueList 4)");

			// Assert - no VH requests made
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(0, "StringVH");

			// Act & Assert
			When.onTheApplicationPage.iChangeTheValueTo("Name", "5");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");

			// Act & Assert
			When.onTheApplicationPage.iChangeTheValueTo("Name", "6");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Name", "6");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(2, "StringVH");

			// Act -> detach and re-attach the binding context
			When.onTheApplicationPage.iClearTheLog();
			When.waitFor({
				id: "Name",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {
					oSmartField.setBindingContext(null);
				},
				errorMessage: "Could not find SmartField with id 'Name'"
			});

			When.waitFor({
				id: "Name",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {
					oSmartField.setBindingContext();
				},
				errorMessage: "Could not find SmartField with id 'Name'"
			});

			// Act & Assert -> Repeat the already send requests
			When.onTheApplicationPage.iChangeTheValueTo("Name", "1");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Name", "1 (ValueList 1)");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(0, "StringVH");
		});

		opaTest("TextArrangementRead singleton cache is working", function (Given, When, Then) {
			// Arrange -> start the app without disabling cache
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning("test-resources/sap/ui/comp/qunit/smartfield/opa/TextArrangement/applicationUnderTest/TextArrangement.html");

			// Act
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iBindTARFields();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("TAR0", "1 (ValueList 1)");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("TAR1", "1 (ValueList 1)");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("TAR2", "1 (ValueList 1)");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("TAR3", "1 (ValueList 1)");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(2, "StringVH");

			// Act -> detach and re-attach the binding context
			When.onTheApplicationPage.iClearTheLog();
			When.waitFor({
				id: "TARForm",
				success: function (oForm) {
					oForm.setEditable(false);
				},
				errorMessage: "Could not find SmartForm"
			});

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("TAR0", "1 (ValueList 1)");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("TAR1", "1 (ValueList 1)");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("TAR2", "1 (ValueList 1)");
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("TAR3", "1 (ValueList 1)");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(0, "StringVH");

			// Shutdown
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.module("ValueListWarning");

		opaTest("Wrong value is stored in local model and as pending change", function (Given, When, Then) {
			// Arrange -> start the app without disabling cache
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning("test-resources/sap/ui/comp/qunit/smartfield/opa/TextArrangement/applicationUnderTest/TextArrangement.html");

			// Act
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("NameVLFO", "a");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameVLFO", "a");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");

			When.waitFor({
				id: "NameVLFO",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {
					Opa5.assert.strictEqual(oSmartField.getBinding("value").getValue(), "a",
						"Wrong value is stored in the local model");

					Opa5.assert.ok(oSmartField.getModel().hasPendingChanges(),
						"Model has pending changes");

					Opa5.assert.strictEqual(
						oSmartField.getFirstInnerControl().getValueState(),
						ValueState.Warning,
						"Value state of inner control is warning"
					);
				},
				errorMessage: "Could not find SmartField with id 'NameVLFO'"
			});

			// Cleanup
			When.onTheApplicationPage.iResetTheODataModel();
		});

		opaTest("Changing values valid/invalid will reset text arrangement", function (Given, When, Then) {
			// Arrange -> start the app without disabling cache
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning("test-resources/sap/ui/comp/qunit/smartfield/opa/TextArrangement/applicationUnderTest/TextArrangement.html");

			// Act
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("NameVLFO", "a");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameVLFO", "a");

			// Act
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("NameVLFO", "b");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameVLFO", "b");

			// Act
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("NameVLFO", "a");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameVLFO", "a");

			// Act
			When.onTheApplicationPage.iClearTheLog();
			When.onTheApplicationPage.iChangeTheValueTo("NameVLFO", "1");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameVLFO", "1 (ValueList 1)");

			// Shutdown
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.module("Common.Text");

		opaTest("ValueList", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText2", "1 (Local Text)");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("NameWithLocalText2", "2");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText2", "2 (ValueList 2)");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("NameWithLocalText2", "3");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText2", "3 (ValueList 3)");

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("NameWithLocalText2", "1");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText2", "1 (ValueList 1)");

			// Shutdown
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("ValueList model change", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText2", "1 (Local Text)");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("NameWithLocalText2Input", "2");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText2", "2 (ValueList 2)");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("NameWithLocalText2Input", "3");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText2", "3 (ValueList 3)");

			// Act
			When.onTheApplicationPage.iChangeTheInputValueTo("NameWithLocalText2Input", "1");

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameWithLocalText2", "1 (ValueList 1)");

			// Shutdown
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.module("Suppress Common.Text");

		opaTest("Creating instances for display and edit mode with transient entry", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Act
			When.onTheApplicationPage.iChangeSuppressToEdit();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSuppressField("2 (ValueList 2)", "edit");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");

			// Act
			When.onTheApplicationPage.iChangeSuppressToDisplay();

			// Assert
			Then.onTheApplicationPage.iShouldSeeSuppressField("2 (ValueList 2)", "display");
			Then.onTheApplicationPage.iShouldSeeNumberOfRequests(2, "StringVH");
		});

		opaTest("Additional filters send", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("idView--NameInOut1", 1);
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameInOut1", "ValueList 2");
			When.onTheApplicationPage.iSelectAnItemFromValueHelp("idView--NameInOut3-input", 0);
			Then.onTheApplicationPage.iShouldSeeRequest("testService/StringVH?$select=KEY,KEY2,TXT,DeprecationCode&$top=2&$filter=KEY2 eq '1' and KEY eq '2'", 1);
		});

		QUnit.module("SNOW: DINC0181926");

		opaTest("After clearing the field there is no leftover description in display mode", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iToggleSmartFormEditMode("leftoverDescription");
			When.onTheApplicationPage.iChangeTheValueTo("leftoverDescriptionField", "");
			When.onTheApplicationPage.iToggleSmartFormEditMode("leftoverDescription");

			// Assert
			Then.waitFor({
				id: "leftoverDescriptionField",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {
					Opa5.assert.ok(!!oSmartField.getDomRef().querySelector(".sapMEmptyIndicator"), "Empty indicator should be rendered");
				}
			});
		});

		QUnit.module("SNOW: DINC0092248");

		opaTest("Fiscal field with proper TextArrangement annotation is not throwing error and is rendered", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Then.waitFor({
				id: "FiscalField",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {
					var oDomRef = oSmartField.getDomRef();
					Opa5.assert.ok(!!oDomRef, "Control is rendered");
					Opa5.assert.strictEqual(oDomRef.innerText, "2024", "Control has value rendered");
				}
			});
		});

		QUnit.module("SNOW: DINC0232609");

		opaTest("Entering space in a field block's it in busy state", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("SpaceField", " ");

			// Assert
			Then.waitFor({
				id: "SpaceField",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {
					Opa5.assert.strictEqual(oSmartField.getFirstInnerControl().getBusy(), false,
						"Control is not in busy state");
				}
			});
		});

		QUnit.module("IsConfigurationDeprecationCode");

		opaTest("ValueListNoValidation: Selecting Deprecated value should result in ValueState Warning and Value is saved in model", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("NameVLFO", 5);

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameVLFO", "7 (ValueList 7)");

			When.waitFor({
				id: "NameVLFO",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {

					Opa5.assert.strictEqual(oSmartField.getBinding("value").getValue(), "7",
						"Wrong value is stored in the local model");

					Opa5.assert.strictEqual(
						oSmartField.getValueState(),
						ValueState.Warning,
						"Value state for deprecated value is Warning"
					);
				},
				errorMessage: "Could not find SmartField with id 'NameVLFO'"
			});
		});

		opaTest("ValueListNoValidation: Selecting Revoked value should result in ValueState Error and Value is saved in model", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iSelectAnItemFromSuggestions("NameVLFO", 6);

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("NameVLFO", "8 (ValueList 8)");

			When.waitFor({
				id: "NameVLFO",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {

					Opa5.assert.strictEqual(oSmartField.getBinding("value").getValue(), "8",
						"Wrong value is stored in the local model");

					Opa5.assert.strictEqual(
						oSmartField.getValueState(),
						ValueState.Error,
						"Value state for revoked value is Error"
					);
				},
				errorMessage: "Could not find SmartField with id 'NameVLFO'"
			});
		});

		opaTest("ValueList: Selecting Deprecated value should result in ValueState Warning and Value is saved in model", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("Name", 7);

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Name", "7 (ValueList 7)");

			When.waitFor({
				id: "Name",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {

					Opa5.assert.strictEqual(oSmartField.getBinding("value").getValue(), "7",
						"Wrong value is stored in the local model");

					Opa5.assert.strictEqual(
						oSmartField.getValueState(),
						ValueState.Warning,
						"Value state for deprecated value is Warning"
					);
				},
				errorMessage: "Could not find SmartField with id 'Name'"
			});
		});

		opaTest("ValueList: Selecting Revoked value should result in ValueState Error and Value is not saved in model", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheApplicationPage.iChangeTheValueTo("Name", 8);

			// Assert
			Then.onTheSmartField.iShouldSeeSmartFieldWithIdAndValue("Name", "8 (ValueList 8)");

			When.waitFor({
				id: "Name",
				controlType: "sap.ui.comp.smartfield.SmartField",
				success: function (oSmartField) {

					Opa5.assert.strictEqual(oSmartField.getBinding("value").getValue(), "7", // 7 is the last valid value
						"Wrong value is stored in the local model");

					Opa5.assert.strictEqual(
						oSmartField.getValueState(),
						ValueState.Error,
						"Value state for revoked value is Error"
					);
				},
				errorMessage: "Could not find SmartField with id 'Name'"
			});
		});

		opaTest("LAST-The purpose of this test is to Cleanup after all the tests", function (Given) {
			Opa5.assert.ok(true); // We need one assertion

			// Cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});


		/*QUnit.module("SNOW: DINC0046629");

		opaTest("We send correct request to backend", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheApplicationPage.iResetTheODataModel();
			When.onTheApplicationPage.iClearTheLog();

			// Act
			When.onTheApplicationPage.iToggleSmartFormEditMode("CorrectPath");
			When.onTheApplicationPage.iSelectSmartFieldItemByKey("CorrectPathField", "2");
			When.onTheApplicationPage.iToggleSmartFormEditMode("CorrectPath");

			// Assert
			Then.onTheApplicationPage.iShouldNotSeeRequest("testService/StringVH?$select=KEY,KEY2,TXT&$top=2&$filter=KEY eq 'Local Text'");
		});*/

		QUnit.start();
	});
});
