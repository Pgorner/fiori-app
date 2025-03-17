sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Global SideEffects Journey");

		opaTest("Global Side Effect Get Call and Preparation call when hit enter with new value", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20SE-STTASOWD20SE#STTASOWD20SE-STTASOWD20SE?manifest=manifestwithGlobalSE&/C_STTA_SalesOrder_WD_20(SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			When.onTheObjectPage
				.iEnterValueInField("test.txt", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::ThisFileName::Field-input", true);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Preparation call message");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("1 call Side effect message:SmartField as source");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("Global Side Effect Get Call and Preparation call when hit enter without any new value", function (Given, When, Then) {

			When.onTheObjectPage
				.iEnterValueInField("EUR", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::Amount::TaxAmount::Field-sfEdit-input", true);
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Preparation call message");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("2 call Side effect message:SmartField as source");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.iTeardownMyApp();
		});

	}
);
