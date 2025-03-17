sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Discard Draft Journey");

		opaTest("Starting the app and navigate to OP of draft Object with dynamic header", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,EPMManageProduct-displayFactSheet,BusinessPartner-displayFactSheet#STTASOWD20-STTASOWD20", "manifestDraftPopup", { "bWithChange": true });
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({ Field: "BusinessPartnerID", Value: "100000004" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001")
				.and
				.theObjectPageIsInEditMode()
				.and
				.iShouldSeeTheButtonWithLabel("Discard Draft");
		});

		opaTest("Check the Draft and Active version popover list on the OP header", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", { "text": "Draft", "icon": "sap-icon://navigation-down-arrow", "visible": true, "enabled": true, });
			When.onTheObjectPage
				.iClickTheControlByControlType("sap.m.Button", { "text": "Draft", "icon": "sap-icon://navigation-down-arrow" });
			Then.onTheObjectPage
				.iCheckTheItemPresentInTheDraftAndActiveObjectPopOverList("Saved Version")
				.and
				.iCheckTheItemPresentInTheDraftAndActiveObjectPopOverList("Draft");
		});

		opaTest("Checking the confirmation popup for IBN navigation when there is no draft settings in manifest", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLink("100000004");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
		});

		opaTest("Check for discard draft confirmation popup for Paginator navigation when there is no draft settings in manifest", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel")
				.and
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
		});

		opaTest("Check for discard draft confirmation popup for Chevron navigation when there is no draft settings in manifest", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_Item", 1);
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
		});

		opaTest("Check for discard draft confirmation popup for back navigation from OP to LR when there is no draft settings in manifest", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel")
				.and
				.iClickTheBackButtonOnFLP();
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
			Then.iTeardownMyApp();
		});

		opaTest("Starting the app, loading data and Check no discard draft popup appears incase of IBN navigation when set to never in manifest", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,EPMManageProduct-displayFactSheet,BusinessPartner-displayFactSheet#STTASOWD20-STTASOWD20", "manifestNavDraftPopup");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
			When.onTheGenericObjectPage
				.iClickTheLink("100000004");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Business Partner");
		});

		opaTest("Check no discard draft popup appears incase of Chevron navigation when set to never in manifest", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_Item", 1);
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Product");
			Then.iTeardownMyApp();
		});
	}
);
