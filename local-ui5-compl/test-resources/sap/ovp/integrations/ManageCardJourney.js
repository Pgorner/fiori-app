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

	var sDefaultUser = "userActionsMenuHeaderButton";
	var sOkButton = "application-procurement-overview-component---mainView--manageCardsDialog-confirmBtn";
	var sCancelButton = "application-procurement-overview-component---mainView--manageCardsDialog-cancelBtn";
	var sResetButton = "application-procurement-overview-component---mainView--manageCardsDialog-resetBtn";
	var sDeselectAll = "application-procurement-overview-component---mainView--manageCardsSelectionPanel-innerSelectionPanelTable-clearSelection";
	var sTableId = "application-procurement-overview-component---mainView--manageCardsSelectionPanel-innerSelectionPanelTable";
	var sCardTitle = "Sales by Country and Region";
	var sCardTitleId = "application-procurement-overview-component---Vcard16_cardchartscolumnstackedOriginal_Tab1--ovpHeaderTitle"; 
	
	var Journey = {
		start: function () {
			QUnit.module("Journey - OVP - Card Actions Journey for Card");
			opaTest("#0: Start", function (Given, When, Then) {
				Given.iStartMyApp("procurement-overview");
				Then.checkAppTitle("Procurement Overview Page");
			});
			return Journey;
		},

		testAndEnd: function () {
			opaTest("#1 Click on default user avatar", function (Given, When, Then) {
				When.iClickOnMenuItemWithId(sDefaultUser);
			});

			opaTest("#2 Click on manage cards. Verify if it is opened and all checkboxes are selected", function (Given, When, Then) {
				When.iClickOnDefaultUserListItems("Manage Cards");
				Then.iCheckDialogState("sap.m.p13n.Popup", "Manage Cards", "Open");
				Then.iCheckIfAllCheckBoxesAreChecked();
			});

			opaTest("#3 Verify if correct title is rendered. Remove a card and verify if same card is removed", function (Given, When, Then) {
				Then.iVerifyTheDialogTitleText("Manage Cards");
				When.iClickCheckboxInManageCard(sCardTitle);
				When.iClickTheButtonWithId(sOkButton);
				Then.iCheckForCardRemoved(sCardTitle, sCardTitleId);
			});

			opaTest("#4 Open manage cards and select a card. Verify if its not added on cancel", function (Given, When, Then) {
				When.iClickOnMenuItemWithId(sDefaultUser);
				When.iClickOnDefaultUserListItems("Manage Cards");
				Then.iCheckIfOneCheckBoxIsUnchecked();
				When.iClickCheckboxInManageCard(sCardTitle);
				When.iClickTheButtonWithId(sCancelButton);
				Then.iCheckForCardRemoved(sCardTitle, sCardTitleId);            //Sales by Country and Region card is still removed and not added on cancel	
			});

			opaTest("#5 Open manage cards verify if one checkbox is unchecked. Add a card and verify if same card is added", function (Given, When, Then) {
				When.iClickOnMenuItemWithId(sDefaultUser);
				When.iClickOnDefaultUserListItems("Manage Cards");
				Then.iCheckIfOneCheckBoxIsUnchecked();
				When.iClickCheckboxInManageCard(sCardTitle);
				When.iClickTheButtonWithId(sOkButton);
				Then.iCheckForCardAdded(sCardTitle, sCardTitleId);             //It gets added only on click of ok button
			});

			opaTest("#6 Open manage cards and click on deselect all and cancel. Verify if checkboxes and cards are same as before click of deselect", function (Given, When, Then) {
				When.iClickOnMenuItemWithId(sDefaultUser);
				When.iClickOnDefaultUserListItems("Manage Cards");
				When.iClickDeselectAllButtonOfP13NDialog(sTableId, sDeselectAll);;
				When.iClickTheButtonWithId(sCancelButton);
				When.iClickOnMenuItemWithId(sDefaultUser);
				When.iClickOnDefaultUserListItems("Manage Cards");
				Then.iCheckIfAllCheckBoxesAreChecked();
			});

			opaTest("#7 Click on deselect all. Select a card and click on ok. Verify if the same card is selected", function (Given, When, Then) {
				When.iClickDeselectAllButtonOfP13NDialog(sTableId, sDeselectAll);
				When.iClickCheckboxInManageCard(sCardTitle);
				When.iClickTheButtonWithId(sOkButton);
				Then.iCheckForCardAdded(sCardTitle, sCardTitleId);
			});

			opaTest("#8 Open manage cards and click on reset. Verify if ok and cancel buttons are available on the next popup", function (Given, When, Then) {
				When.iClickOnMenuItemWithId(sDefaultUser);
				When.iClickOnDefaultUserListItems("Manage Cards");
				When.iClickTheButtonWithId(sResetButton);
				Then.iCheckForOkAndCancelButtonOnReset("__mbox-btn-0", "__mbox-btn-1");
			});

			opaTest("#9 After reset click on ok. Verify if manage cards is still open and all checkboxes are selected", function (Given, When, Then) {
				When.iClickTheButtonWithId("__mbox-btn-0");
				Then.iCheckDialogState("sap.m.p13n.Popup", "Manage Cards", "Open");
				Then.iCheckIfAllCheckBoxesAreChecked();
			});

			opaTest("#10 Remove one card and verify if the same card is removed", function (Given, When, Then) {
				When.iClickCheckboxInManageCard(sCardTitle);
				When.iClickTheButtonWithId(sOkButton);
				Then.iCheckForCardRemoved(sCardTitle, sCardTitleId);
			});

			opaTest("11 Verify if the same card is still removed, after list card header navigation", function (Given, When, Then) {
				When.iClickTheCardHeader("application-procurement-overview-component---card002Original--ovpCardHeader", false);
				Then.checkAppTitle("Sales Overview Page");
				When.iClickBackButton();
				Then.checkAppTitle("Procurement Overview Page");
				Given.iTeardownMyApp();
				Given.iStartMyApp("procurement-overview");
				Then.iCheckForCardRemoved(sCardTitle, sCardTitleId);
			});

			opaTest("#12 Click on any list item and navigate to other app, come back to ovp. Verify if the same card is still removed", function (Given, When, Then) {
				When.iClickTheCardItem("card003Original--tableItem", 2, "New Contracts", "sap.m.ColumnListItem");
				Then.checkAppTitle("Sales Overview Page");
				When.iClickBackButton();
				Then.checkAppTitle("Procurement Overview Page");
				Given.iTeardownMyApp();
				Given.iStartMyApp("procurement-overview");
				Then.iCheckForCardRemoved(sCardTitle, sCardTitleId);
			});

			opaTest("#13 Click on the back button and navigate to home page, come back to ovp. Verify if the same card is still removed", function (Given, When, Then) {
				When.iClickBackButton();
				Then.checkAppTitle("Home");
				Given.iTeardownMyApp();
				Given.iStartMyApp("procurement-overview");
				Then.iCheckForCardRemoved(sCardTitle, sCardTitleId);
			});

			opaTest("#14 Add the removed card and Verify if the same card is added", function (Given, When, Then) {
				When.iClickOnMenuItemWithId(sDefaultUser);
				When.iClickOnDefaultUserListItems("Manage Cards");
				When.iClickCheckboxInManageCard(sCardTitle);
				When.iClickTheButtonWithId(sOkButton);
				Then.iCheckForCardAdded(sCardTitle, sCardTitleId);
				Given.iTeardownMyApp();
			});

			opaTest("#15 Check the Manage card button visibility in sap-keep-alive mode", function (Given, When, Then) {
				Given.iStartAppInKeepAliveMode("procurement-overview");
				Then.checkAppTitle("Procurement Overview Page");
				When.iClickOnMenuItemWithId(sDefaultUser);
				When.iClickOnDefaultUserListItems("Manage Cards");
				Then.iCheckDialogState("sap.m.p13n.Popup", "Manage Cards", "Open");
				Then.iCheckIfAllCheckBoxesAreChecked();
				When.iClickTheButtonWithId(sCancelButton);
				When.iClickTheCardItem("card003Original--tableItem", 2, "New Contracts", "sap.m.ColumnListItem");
				Then.checkAppTitle("Sales Overview Page");
				When.iClickBackButton();
				Then.checkAppTitle("Procurement Overview Page");
				When.iClickOnMenuItemWithId(sDefaultUser);
				When.iClickOnDefaultUserListItems("Manage Cards");
				Then.iCheckDialogState("sap.m.p13n.Popup", "Manage Cards", "Open");
				Then.iCheckIfAllCheckBoxesAreChecked();
				When.iClickTheButtonWithId(sCancelButton);
				Given.iTeardownMyApp();
			});

			return Journey;
		}
	};
	Journey.start().testAndEnd();
});