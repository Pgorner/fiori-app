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
    var sWarningMessage = "You have reached the maximum limit of 27 cards. To add a new card, you first have to deselect one from the list or hide a card if you are in key user mode.";
    var sManageCardsPanel = "application-sales-overview-component---mainView--manageCardsSelectionPanel";
    var sOkButton = "application-sales-overview-component---mainView--manageCardsDialog-confirmBtn";
	var sResetButton = "application-sales-overview-component---mainView--manageCardsDialog-resetBtn";
    
    opaTest("#0: Open App", function (Given, When, Then) {
        Given.iStartMyApp("sales-overview");
        Then.checkAppTitle("Sales Overview Page");
    });

    opaTest("Click on default user avatar", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sDefaultUser);
    });

    opaTest("Click on manage cards. Verify if it warning message is being displayed. Verify if number of cards selected is same as card limit passed", function (Given, When, Then) {
        When.iClickOnDefaultUserListItems("Manage Cards");
        //number of cards passed here is the limit provided in sales/webapp/ext/customFilter.controller.js
        Then.iCheckNumberOfCardsSelected(sManageCardsPanel, 27);
        Then.iCheckIfMessageStripTextIsSetAndVisible(sManageCardsPanel, sWarningMessage);
    });

    opaTest("Deselect a card. Verify if warning message is not being displayed", function (Given, When, Then) {
        When.iClickCheckboxInManageCard("(Analytical) Dual Combination Chart - Time Series");
        Then.iCheckNumberOfCardsSelected(sManageCardsPanel, 26);
        Then.iCheckIfMessageStripIsHidden(sManageCardsPanel);
    });

    opaTest("Select the same card. Verify if warning message is displayed and ok button is enabled", function (Given, When, Then) {
        When.iClickCheckboxInManageCard("(Analytical) Dual Combination Chart - Time Series");
        Then.iCheckNumberOfCardsSelected(sManageCardsPanel, 27);
        Then.iCheckIfMessageStripTextIsSetAndVisible(sManageCardsPanel, sWarningMessage);
        Then.iCheckIfOkButtonIsDisabledOrEnabled(sOkButton, true);
    });

    opaTest("Select 1 more card. Verify if warning message is displayed and ok button is disabled", function (Given, When, Then) {
        When.iClickCheckboxInManageCard("(Analytical) Waterfall Chart - Time Series");
        Then.iCheckNumberOfCardsSelected(sManageCardsPanel, 28);
        Then.iCheckIfMessageStripTextIsSetAndVisible(sManageCardsPanel, sWarningMessage);
        Then.iCheckIfOkButtonIsDisabledOrEnabled(sOkButton, false);
    });

    opaTest("Deselect a card. Verify if ok button is enabled, click on ok", function (Given, When, Then) {
        When.iClickCheckboxInManageCard("(Analytical) Waterfall Chart - Time Series");
        Then.iCheckNumberOfCardsSelected(sManageCardsPanel, 27);
        Then.iCheckIfOkButtonIsDisabledOrEnabled(sOkButton, true);
        When.iClickTheButtonWithId(sOkButton);
    });
    opaTest("Click on Reset. Verify if number of cards selected is upto the threshold value", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sDefaultUser);
        When.iClickOnDefaultUserListItems("Manage Cards");
        When.iClickCheckboxInManageCard("(Analytical) Dual Combination Chart - Time Series");
		When.iClickTheButtonWithId(sResetButton);
		Then.iCheckForOkAndCancelButtonOnReset("__mbox-btn-0", "__mbox-btn-1");
		When.iClickTheButtonWithId("__mbox-btn-0");
        Then.iCheckNumberOfCardsSelected(sManageCardsPanel, 27);
        Then.iCheckIfMessageStripTextIsSetAndVisible(sManageCardsPanel, sWarningMessage);
        Then.iCheckIfOkButtonIsDisabledOrEnabled(sOkButton, true);
        When.iClickTheButtonWithId(sOkButton);
    });

});