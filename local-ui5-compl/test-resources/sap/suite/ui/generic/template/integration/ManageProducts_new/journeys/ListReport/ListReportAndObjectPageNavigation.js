sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Navigations For List Report and Object Page");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("The navigation from the List Report to the Object Page is correct", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(3);
			Then.onTheObjectPage
				.thePageContextShouldBeCorrect();
		});
		opaTest("Check for Check the Weight field displays the decimal values as per the annotation", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::Weight1::Weight::Value-text", {"text": "4.12300 "});
			When.onTheObjectPage
				.iClickTheControlWithId("STTA_C_MP_Product--back");
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(7);
			Then.onTheObjectPage
				.iCheckControlPropertiesById("header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::Weight1::Weight::Value-text", {"text": "4.12345 "});
		});

		opaTest("The navigation from the Object Page to the List Report is correct", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheControlWithId("STTA_C_MP_Product--back");
			Then.onTheListReportPage
				.theTableIsInTheSameStateAsBefore();
		});

		opaTest("Check the row, against which navigation to OP is triggered, is highlighted", function (Given, When, Then) {
			Then.onTheListReportPage
				.iShouldSeeTheNavigatedRowHighlighted(7, true)
				.and
				.iShouldSeeTheNavigatedRowHighlighted(2, false);
		});

		opaTest("The navigation from the List Report to the Object Page with a different item is correct", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(2);
			Then.onTheObjectPage
				.thePageContextShouldBeCorrect();
		});

		opaTest("Check if Validation message popover comes up when weight is given a value not aligned with Decimal Formatter configuration in Annotation", function(Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("4.123456", "headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::Weight::Field-input")  //Enter Incorrect values to generate errors
			When.onTheGenericObjectPage
				.iSaveTheDraft(false);
			Then.onTheObjectPage
				.iShouldSeeTheMessagePopUpWithTitle("Error")
				.and
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Dialog", [{"type":"Error", "title":"Enter a number with a maximum of 5 decimal places", "subTitle":"Weight", "description":""}]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
		});
		
		opaTest("Check for discard draft confirmation popup during back navigation", function(Given, When, Then) {
			When.onTheObjectPage
				.iClickTheControlWithId("STTA_C_MP_Product--back");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
		});

		opaTest("TC1: Draft Activate Confirmation Dialogs", function(Given, When, Then) {
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1);
			When.onTheObjectPage
				.iEnterValueInField("68@#", "headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::Weight::Field-input")  //Enter Incorrect values to generate errors
				.and
				.iToggleMessagePopoverDialog()
				.and
				.iAddMessagesToMessageDialogOrPopOver("sap.m.PopOver", [{"msg": "New Warning Message", "description": "This is the Description of the Warning Message", "msgType": "Warning", "target": "/STTA_C_MP_Product", "persistent": false},
														{"msg": "New Error Message", "description": "This is the Description of the Error Message", "msgType": "Error", "target": "/STTA_C_MP_Product", "persistent": false}]);
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Save");
			Then.onTheObjectPage
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Dialog", [{"type":"Warning", "title":"New Warning Message", "subTitle":"", "description": "This is the Description of the Warning Message"},
															{"type":"Error", "title":"New Error Message", "subTitle":"", "description": "This is the Description of the Error Message"}])
				.and
				.theDraftActivateConfirmationDialogIsRenderedWithSaveButton(false);
		});

		opaTest("TC2: Draft Activate Confirmation Dialog", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
            When.onTheObjectPage
                .iAddMessagesToMessageDialogOrPopOver("sap.m.PopOver", [{"msg": "New Warning Message", "description": "This is the Description of the Warning Message", "msgType": "Warning", "target": "/STTA_C_MP_Product", "persistent": false}]); //To show warnings in the confirmation popup
            When.onTheGenericObjectPage
                .iClickTheButtonHavingLabel("Save");
            Then.onTheObjectPage
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Dialog", [{"type":"Warning", "title":"New Warning Message", "subTitle":"", "description": "This is the Description of the Warning Message"}])
				.and
				.theDraftActivateConfirmationDialogIsRenderedWithSaveButton(true);
        });

        opaTest("TC3: Draft Activate Confirmation Dialog-Back Navigation and App Tear Down", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://nav-back");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
            Then.iTeardownMyApp();
        });
	}
    }
);
