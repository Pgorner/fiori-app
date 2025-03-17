/*global opaTest QUnit */
//Manage Cards V4 Journey
sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/opaQunit",
    "test-resources/sap/ovp/integrations/pages/CommonArrangements",
    "test-resources/sap/ovp/integrations/pages/CommonActions",
    "test-resources/sap/ovp/integrations/pages/CommonAssertions",
    "test-resources/sap/ovp/integrations/pages/Main",
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
        viewNamespace: "view.",
    });
	
	var sDefaultUser = "userActionsMenuHeaderButton";
	var sOkButton = "application-saphanaoverview-display-component---mainView--manageCardsDialog-confirmBtn";
	var sCancelButton = "application-saphanaoverview-display-component---mainView--manageCardsDialog-cancelBtn";
	var sResetButton = "application-saphanaoverview-display-component---mainView--manageCardsDialog-resetBtn";
	var sDeselectAll = "application-saphanaoverview-display-component---mainView--manageCardsSelectionPanel-innerSelectionPanelTable-clearSelection";
	var sTableId = "application-saphanaoverview-display-component---mainView--manageCardsSelectionPanel-innerSelectionPanelTable";
	var sGoButtonId = "application-saphanaoverview-display-component---mainView--ovpGlobalMacroFilter-content-btnSearch";
	var sCardId = "application-saphanaoverview-display-component---addOnDonutOriginal--ovpHeaderTitle";
	var sCardTitle = "Incompatible Add-On";

	opaTest("#0 : Open app", function (Given, When, Then) {
		Given.iStartMyApp("saphanaoverview-display");
		Then.checkAppTitle("SAP Hana Demo");
		When.iClickTheGoButton(sGoButtonId);
	});

	opaTest("#1 Click on default user avatar", function (Given, When, Then) {
		When.iClickOnMenuItemWithId(sDefaultUser);
	});

	opaTest("#2 Click on manage cards. Verify if it is opened and all checkboxes are selected", function (Given, When, Then) {
		When.iClickOnDefaultUserListItems("Manage Cards");
		Then.iCheckDialogState("sap.m.p13n.Popup","Manage Cards","Open");
		Then.iVerifyTheDialogTitleText("Manage Cards");
		Then.iCheckIfAllCheckBoxesAreChecked();
	});

	opaTest("#3 Verify if correct title is rendered. Remove a card and verify if same card is removed", function (Given, When, Then) {
		When.iClickCheckboxInManageCard(sCardTitle);
		When.iClickTheButtonWithId(sOkButton);
		Then.iCheckForCardRemoved(sCardTitle, sCardId);
	});

	opaTest("#4 Open manage cards and select a card. Verify if its not added on cancel", function (Given, When, Then) {
		When.iClickOnMenuItemWithId(sDefaultUser);
		When.iClickOnDefaultUserListItems("Manage Cards");
		Then.iCheckIfOneCheckBoxIsUnchecked();
		When.iClickCheckboxInManageCard(sCardTitle);
		When.iClickTheButtonWithId(sCancelButton);
		Then.iCheckForCardRemoved(sCardTitle, sCardId);
	});

	opaTest("#5 Open manage cards verify if one checkbox is unchecked. Add a card and verify if same card is added", function (Given, When, Then) {
		When.iClickOnMenuItemWithId(sDefaultUser);
		When.iClickOnDefaultUserListItems("Manage Cards");
		Then.iCheckIfOneCheckBoxIsUnchecked();
		When.iClickCheckboxInManageCard(sCardTitle);
		When.iClickTheButtonWithId(sOkButton);
		Then.iCheckForCardAdded(sCardTitle, sCardId);
	});

	opaTest("#6 Open manage cards and click on deselect all and cancel. Verify if checkboxes and cards are same as before click of deselect", function (Given, When, Then) {
		When.iClickOnMenuItemWithId(sDefaultUser);
		When.iClickOnDefaultUserListItems("Manage Cards");
		When.iClickDeselectAllButtonOfP13NDialog(sTableId, sDeselectAll);
		When.iClickTheButtonWithId(sCancelButton);
		When.iClickOnMenuItemWithId(sDefaultUser);
		When.iClickOnDefaultUserListItems("Manage Cards");
		Then.iCheckIfAllCheckBoxesAreChecked();
	});

	opaTest("#7 Click on deselect all. Select a card and click on ok. Verify if the same card is selected", function (Given, When, Then) {
		When.iClickDeselectAllButtonOfP13NDialog(sTableId, sDeselectAll);
		When.iClickCheckboxInManageCard(sCardTitle);
		When.iClickTheButtonWithId(sOkButton);
		Then.iCheckForCardAdded(sCardTitle, sCardId);
	});

	opaTest("#8 Open manage cards and click on reset. Verify if ok and cancel buttons are available on the next popup", function (Given, When, Then) {
		When.iClickOnMenuItemWithId(sDefaultUser);
		When.iClickOnDefaultUserListItems("Manage Cards");
		When.iClickTheButtonWithId(sResetButton);
		Then.iCheckForOkAndCancelButtonOnReset("__mbox-btn-0", "__mbox-btn-1");
	});

	opaTest("#9 After reset click on ok. Verify if manage cards is still open and all checkboxes are selected", function (Given, When, Then) {
		When.iClickTheButtonWithId("__mbox-btn-0");
		Then.iCheckDialogState("sap.m.p13n.Popup","Manage Cards","Open");
		Then.iCheckIfAllCheckBoxesAreChecked();
	});

	opaTest("#10 Remove one card and verify if the same card is removed", function (Given, When, Then) {
		When.iClickCheckboxInManageCard(sCardTitle);
		When.iClickTheButtonWithId(sOkButton);
		Then.iCheckForCardRemoved(sCardTitle, sCardId);
	});

	opaTest("#11 Click on the back button and navigate to home page, come back to ovp. Verify if the same card is still removed", function (Given, When, Then) {
		When.iClickBackButton();
		Then.checkAppTitle("Home");
		Given.iTeardownMyApp();
		Given.iStartMyApp("saphanaoverview-display");
		When.iClickTheGoButton(sGoButtonId);
		Then.iCheckForCardRemoved(sCardTitle, sCardId);
	});

	opaTest("#12 Add the removed card and Verify if the same card is added", function (Given, When, Then) {
		When.iClickOnMenuItemWithId(sDefaultUser);
		When.iClickOnDefaultUserListItems("Manage Cards");
		When.iClickCheckboxInManageCard(sCardTitle);
		When.iClickTheButtonWithId(sOkButton);
		Then.iCheckForCardAdded(sCardTitle, sCardId)
		Given.iTeardownMyApp();
	});

});