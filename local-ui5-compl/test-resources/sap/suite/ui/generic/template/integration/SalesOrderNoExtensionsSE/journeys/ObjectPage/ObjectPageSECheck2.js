sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Local SideEffects Journey 2");

		opaTest("Entity Refresh:Checking Local Side effect Get Call and Preparation call when hit enter", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20SE-STTASOWD20SE#STTASOWD20SE-STTASOWD20SE&/C_STTA_SalesOrder_WD_20(SalesOrder='500000001',DraftUUID=guid'00505691-2ec5-1ee6-b990-e386f7cdbdd3',IsActiveEntity=false)");

			When.onTheObjectPage
				.iEnterValueInField("100", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::Amount::TaxAmount::Field-input", true);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Preparation call message");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("1 call Side effect message:whole entity refresh");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");

		});
		opaTest("Entity Refresh:Checking Local Side effect Get Call when tab out ", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("200", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::Amount::TaxAmount::Field-input");
			When.onTheObjectPage
				.iEnterValueInField("100000006", "C_STTA_SalesOrder_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::BusinessPartnerID::Field-input");

			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("2 call Side effect message:whole entity refresh");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");

		});

		opaTest("Navigation target refresh when hit enter ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_Item", 0);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrderItem_WD_20");
			When.onTheObjectPage
				.iEnterValueInField("400", "C_STTA_SalesOrderItem_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::Identification::TaxAmount::Field-input", true)
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Preparation call message");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("1 call Side effect message:Refresh the navigation target to_Item");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("Navigation target refresh when tab out", function (Given, When, Then) {
			When.onTheObjectPage
				.iEnterValueInField("200", "C_STTA_SalesOrderItem_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::Identification::TaxAmount::Field-input")
				.and
				.iEnterValueInField("HT-1000", "C_STTA_SalesOrderItem_WD_20--com.sap.vocabularies.UI.v1.FieldGroup::Identification::Product::Field-input")

			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("2 call Side effect message:Refresh the navigation target to_Item");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");
		});
		opaTest("Structural Change (Delete):Checking the side effect when the item is deleted", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 20?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("1 call Side effect message:Side effect on structural changes of a 1:n association");
			When.onTheObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.iTeardownMyApp();

		});

	}
);
