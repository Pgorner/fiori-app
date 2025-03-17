sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Local SideEffects Journey");

		opaTest("SmartField:Checking Local Side effect Get Call and Prepartion call when hit enter", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20SE-STTASOWD20SE#STTASOWD20SE-STTASOWD20SE&/C_STTA_SalesOrder_WD_20(SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			When.onTheObjectPage
				.iEnterValueInField("006", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::OpportunityID::Field-input", true);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Preparation call message");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("1 call Side effect message:SmartField as source");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Trigger Action Called");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("Cancel");

		});
		opaTest("SmartField:Checking Local Side effect Get Call when tab out ", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("007", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::OpportunityID::Field-input");
			When.onTheObjectPage
				.iEnterValueInField("100000004", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::BusinessPartnerID::Field-input");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("2 call Side effect message:SmartField as source");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Trigger Action Called");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
		});
		opaTest("Checkbox:Checking Local Side effect Get Call and Prepartion call when hit enter", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterCheckbox("EnabledStatus::Field-cBoxBool");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Preparation call message");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("1 call Side effect message:CheckBox as source");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");
		});
		opaTest("Checkbox:Checking Local Side effect Get Call when tab out ", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnCheckboxWithText("Enabled", "EnabledStatus::Field-cBoxBool");
			When.onTheObjectPage
				.iEnterValueInField("100000005", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::BusinessPartnerID::Field-input");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("2 call Side effect message:CheckBox as source");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");
		});
		opaTest("Checking Local Side effect when there is an error in the field ", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("007007007007007007007007007007007007007007007007007007007007007007", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::OpportunityID::Field-input", true);
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Preparation call message");
		});
		opaTest("Checking ValueHelp select side effect ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheControlWhichContainsId("SOwoExtSE::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::Amount::CurrencyCode::Field-input-vhi");
			When.onTheObjectPage
				.iSelectFirstItemInVhWithId("Field-input-valueHelpDialog-table-ui5table-rows-row0");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("1 call Side effect value help message:SmartField as source");
			Then.iTeardownMyApp();
		});
	}
);
