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

	/* Filter Bar Locators */
	var sGoButtonId = "application-books-overview-component---mainView--ovpGlobalMacroFilter-content-btnSearch";
	var sMacroFBId = "application-books-overview-component---mainView--ovpGlobalMacroFilter";
	var sNoCardsId = "application-books-overview-component---mainView--ovpFilterNotFulfilledPage";
	var sButtonName = "Go Button";
	var sControlType = "sap.m.Button";
	var sTitleFilterId = "application-books-overview-component---mainView--ovpGlobalMacroFilter::FilterField::title";
	var sTitleValueHelp = "application-books-overview-component---mainView--ovpGlobalMacroFilter::FilterField::title-inner-vhi";
	var sIDFilterId = "application-books-overview-component---mainView--ovpGlobalMacroFilter::FilterField::ID";
	var sIDFilterDropdown = "application-books-overview-component---mainView--ovpGlobalMacroFilter::FilterField::ID-inner-vhi";
	var sAmountId = "application-books-overview-component---mainView--ovpGlobalMacroFilter::FilterField::amount-inner";
	var sGoButtonId = "application-books-overview-component---mainView--ovpGlobalMacroFilter-content-btnSearch";

	/* Variant Management Locators */
	var sAppliedVariant = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-text";
    var sVariantDropdown = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-trigger";
    var sManageButton = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-manage";
    var sVariantSaveButton = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-variantsave";
    var sManageSaveButton = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-managementsave";
    var sSaveAsButton = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-saveas";
    var sRadioButtonVar1 = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-manage-def-1";
    var sDelVar1 = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-manage-del-1-img";
    var sDelVar2 = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-manage-del-2-img";
    var sSwitchToVar2 = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-list-1";
	var sSearchField = "application-books-overview-component---mainView--ovpGlobalMacroFilterVariantMGMT-vm-name";
	var sNewVariant = "Standard With ID Filter";
	var sNewVariant2 = "Standard With Amount Filter";

	opaTest("#0: Open App", function (Given, When, Then) {
		Given.iStartMyApp("books-overview");
		Then.checkAppTitle("Books App V4");
	});

	opaTest("#1 Check for Macro Filter Bar Loaded", function (Given, When, Then) {
		Then.iCheckControlWithIdExists(sMacroFBId);
	});

	opaTest("#2 Check for Go button", function (Given, When, Then) {
		Then.iCheckIdExists(sGoButtonId, sButtonName, sControlType);
	});

	opaTest("#3 Check cards are not autoloaded when no preset filters present in ifAnyFilterExist data load case", function (Given, When, Then) {
		Then.iCheckForNoCards(sNoCardsId);
	});

	opaTest("#4 Check card records before applying filters", function (Given, When, Then) {
		When.iClickTheGoButton(sGoButtonId);
		Then.iCheckForCardHeaderCount("card_01_v4Original--ovpCountHeader", "Extended List Card With Bar", "3 of 11");
	});

	// TODO : Enable these two test cases the id of value help is dynamic
	// opaTest("#5 Select value from Country filter valuehelp and click Go button", function (Given, When, Then) {
	// 	When.iClickControlOnMacroFilterBar(sTitleFilterId, sTitleValueHelp);
	// 	When.iClickControlOnValueHelp("operator-inner-vhi", "sap.ui.core.Icon");
	// 	When.iClickControlOnValueHelp("rowSelect-help-pop-fl-List-0", "sap.m.DisplayListItem");
	// 	When.iClickEnterKeyForMDCFilterField("/^__conditions.*DCP--0-values0-inner/", 'the');
	// 	When.iClickTheButtonWithId("__dialog0-ok");
	// 	When.iClickTheGoButton(sGoButtonId);
	// });

	// opaTest("#6 Check card records after applying filter for Title field", function (Given, When, Then) {
	// 	Then.iCheckForCardHeaderCount("card_01_v4Original--ovpCountHeader", "Extended List Card With Bar", "3 of 4");
	// });

	opaTest("#7 Select value from ID filter dropdown and click Go button", function (Given, When, Then) {
		When.iClickControlOnMacroFilterBar(sIDFilterId, sIDFilterDropdown);
		When.iClickOnCheckBox(0);
		When.iClickOnCheckBox(3);
		When.iClickTheEnterKey(sIDFilterId);
	});

	opaTest("#8 Check card records after applying filter for ID field", function (Given, When, Then) {
		Then.iCheckForNumberOfRecordsInCard("sap.m.CustomListItem", "card_01_v4Original--listItem", 2);
	});

	opaTest("#9: Save as new variant", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickTheButtonWithId(sSaveAsButton);
        When.iEnterValueInField(sNewVariant,sSearchField);
        When.iClickTheButtonWithId(sVariantSaveButton);
        Then.iCheckDialogState("sap.m.Dialog","Save View","Close");
    });
       
    opaTest("#10: Select Default Variant from Manage View Dialog", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickTheButtonWithId(sManageButton);
        When.iClickDefaultRadioButton(sRadioButtonVar1, sNewVariant);
        When.iClickTheButtonWithId(sManageSaveButton);   
    });

	opaTest("#11 Enter value in Amount filter and click Go button", function (Given, When, Then) {
		When.iClickTheEnterKey(sAmountId, '2400');
		When.iClickTheGoButton(sGoButtonId);
	});

	opaTest("#12 Check card records after applying filter for Amount field", function (Given, When, Then) {
		Then.iCheckForNumberOfRecordsInCard("sap.m.CustomListItem", "card_01_v4Original--listItem", 1);
	});		

	opaTest("#13: Save as new variant", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickTheButtonWithId(sSaveAsButton);
        When.iEnterValueInField(sNewVariant2, sSearchField);
        When.iClickTheButtonWithId(sVariantSaveButton);
        Then.iCheckDialogState("sap.m.Dialog","Save View","Close");
		Given.iTeardownMyApp(); 
    });

    opaTest("#14: Relaunch App and check the Default Variant", function (Given, When, Then) {
        Given.iStartMyApp("books-overview");
        Then.iCheckVariantText(sAppliedVariant, sNewVariant);
		When.iClickTheGoButton(sGoButtonId);
		Then.iCheckForNumberOfRecordsInCard("sap.m.CustomListItem", "card_01_v4Original--listItem", 2);
    });

    opaTest("#15: Switch between Variants", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickOnVariantWithText(sSwitchToVar2, sNewVariant2);
        When.iClickTheGoButton(sGoButtonId);
        Then.iCheckVariantText(sAppliedVariant, sNewVariant2);
        Then.iCheckForNumberOfRecordsInCard("sap.m.CustomListItem", "card_01_v4Original--listItem", 1);
    });

    opaTest("#16: Delete the newly added variants", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickTheButtonWithId(sManageButton);
        When.iDeleteVariantFromManageVariant(sDelVar1,sNewVariant);
        When.iDeleteVariantFromManageVariant(sDelVar2, sNewVariant2);
        When.iClickTheButtonWithId(sManageSaveButton);  
        Given.iTeardownMyApp();    
    });

    opaTest("#17: Relaunch App and check the Default Variant", function (Given, When, Then) {
        Given.iStartMyApp("books-overview");
        Then.iCheckVariantText(sAppliedVariant,"Standard");
		When.iClickTheGoButton(sGoButtonId);
        Then.iCheckForCardHeaderCount("card_01_v4Original--ovpCountHeader", "Extended List Card With Bar", "3 of 11");
        Given.iTeardownMyApp(); 
    });

});  