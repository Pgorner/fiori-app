/*global opaTest QUnit */
//Variant Management Journey
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

    var sAppliedVariant = "application-procurement-overview-component---mainView--ovpPageVariant-vm-text";
    var sVariantDropdown = "application-procurement-overview-component---mainView--ovpPageVariant-vm-trigger";
    var sManageButton = "application-procurement-overview-component---mainView--ovpPageVariant-vm-manage";
    var sVariantSaveButton = "application-procurement-overview-component---mainView--ovpPageVariant-vm-variantsave";
    var sManageSaveButton = "application-procurement-overview-component---mainView--ovpPageVariant-vm-managementsave";
    var sSaveAsButton = "application-procurement-overview-component---mainView--ovpPageVariant-vm-saveas";
    var sRadioButtonVar1 = "application-procurement-overview-component---mainView--ovpPageVariant-vm-manage-def-1";
    var sCheckBoxVar1 = "application-procurement-overview-component---mainView--ovpPageVariant-vm-manage-exe-1";
    var sDelVar1 = "application-procurement-overview-component---mainView--ovpPageVariant-vm-manage-del-1-img";
    var sDelVar2 = "application-procurement-overview-component---mainView--ovpPageVariant-vm-manage-del-2-img";
    var sSwitchToVar2 = "application-procurement-overview-component---mainView--ovpPageVariant-vm-list-2";
    var sSearchField = "application-procurement-overview-component---mainView--ovpPageVariant-vm-name";
    var sSupplierName = "application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControl_BASIC-SupplierName";
    var sDisplayCurrency = "application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControlA_-_Parameter.P_DisplayCurrency";
    var sGoButton = "application-procurement-overview-component---mainView--ovpGlobalFilter-btnGo";


    opaTest("#0: Open App", function (Given, When, Then) {
		Given.iStartMyApp("procurement-overview");
		Then.checkAppTitle("Procurement Overview Page");
	});

    opaTest("#1: Check default variant", function (Given, When, Then) {
        Then.iCheckVariantText(sAppliedVariant,"Standard");
        Then.iCheckCardKpiInfo("card009", "101.3K", "KPIValue");
    });

    opaTest("#2: Apply filter and save new variant", function (Given, When, Then) {
        When.iEnterValueInField('SAP', sSupplierName);
        When.iClickTheGoButton(sGoButton);
        Then.iCheckCardKpiInfo("card009", "10.3K", "KPIValue");
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickTheButtonWithId(sSaveAsButton);
        When.iEnterValueInField("Standard1",sSearchField);
        When.iClickTheButtonWithId(sVariantSaveButton);
        Then.iCheckDialogState("sap.m.Dialog","Save View","Close");
        Given.iTeardownMyApp();
    });

    opaTest("#3 : Relaunch App by Adding Filter Param in URL", function (Given, When, Then) {   
        Given.iStartMyApp("procurement-overview");
        Then.iCheckVariantText(sAppliedVariant,"Standard");
        When.iEnterValueInField('TECUM',sSupplierName);
        When.iClickTheGoButton(sGoButton);
        Then.iCheckCardKpiInfo("card009", "25.4K", "KPIValue");
    });

    opaTest("#4: Save as new variant", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickTheButtonWithId(sSaveAsButton);
        When.iEnterValueInField("Standard2",sSearchField);
        When.iClickTheButtonWithId(sVariantSaveButton);
        Then.iCheckDialogState("sap.m.Dialog","Save View","Close");
    });
       
    opaTest("#5: Select Default Variant from Manage View Dialog", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickTheButtonWithId(sManageButton);
        When.iClickDefaultRadioButton(sRadioButtonVar1,"Standard1");
        When.iClickOnCheckBoxWithId(sCheckBoxVar1, "Standard1");
        When.iClickTheButtonWithId(sManageSaveButton);   
        Given.iTeardownMyApp();     
    });

    opaTest("#6: Relaunch App and check the Default Variant", function (Given, When, Then) {
        Given.iStartMyApp("procurement-overview");
        Then.iCheckVariantText(sAppliedVariant,"Standard1");
        Then.iCheckCardKpiInfo("card009", "10.3K", "KPIValue");
    });

    opaTest("#7: Switch between Variants", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickOnVariantWithText(sSwitchToVar2,"Standard2");
        When.iClickTheGoButton(sGoButton);
        Then.iCheckVariantText(sAppliedVariant,"Standard2");
        Then.iCheckCardKpiInfo("card009", "25.4K", "KPIValue");
    });

    opaTest("#8: Delete the newly added variants", function (Given, When, Then) {
        When.iClickOnMenuItemWithId(sVariantDropdown);
        When.iClickTheButtonWithId(sManageButton);
        When.iDeleteVariantFromManageVariant(sDelVar1,"Standard1");
        When.iDeleteVariantFromManageVariant(sDelVar2,"Standard2");
        When.iClickTheButtonWithId(sManageSaveButton);  
        Given.iTeardownMyApp();    
    });

    opaTest("#9: Relaunch App and check the Default Variant", function (Given, When, Then) {
        Given.iStartMyApp("procurement-overview");
        Then.iCheckVariantText(sAppliedVariant,"Standard");
        Then.iCheckCardKpiInfo("card009", "101.3K", "KPIValue");
        Given.iTeardownMyApp(); 
    });
    
});
