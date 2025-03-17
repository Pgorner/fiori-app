/*global opaTest QUnit */
//AnalyticalCard Journey
sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
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
        viewNamespace: "view.",
    });
    opaTest("Open app", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyApp("procurement-overview");
        Then.checkAppTitle("Procurement Overview Page");
    });

    opaTest("Click on Search", function (Given, When, Then) {
        When.iEnterValueInField('EUR',"application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControlA_-_Parameter.P_DisplayCurrency");
        When.iClickTheGoButton("application-procurement-overview-component---mainView--ovpGlobalFilter-btnGo");
    });

    opaTest("Number of Analyticals Cards", function (Given, When, Then) {
        Then.iCheckForNumberOFCards("Analytical",9,"sap.viz.ui5.controls.VizFrame");
    });

    opaTest("Analytical Card Header Title", function (Given, When, Then) {
        Then.iCheckCardText("Total Purchase Order Value","--ovpHeaderTitle","Title");
    });

    opaTest("Analytical Card Header SubTitle", function (Given, When, Then) {
        Then.iCheckCardText("In the current quarter ","--SubTitle-Text","SubTitle");
    });

    opaTest("Analytical Card Header Value Selection Info", function (Given, When, Then) {
        Then.iCheckCardText("Categorized by products","--ovpValueSelectionInfo","Value Selection Info");
    });

    opaTest("Analytical Card Header KPI Info", function (Given, When, Then) {
        Then.iCheckCardKpiInfo("card004","34K","KPIValue");
    });

    opaTest("Analytical Card Header KPI Info Colouring", function (Given, When, Then) {
		Then.iCheckCardKpiInfo("card004","Error","KPIColour");
    });

    opaTest("Analytical Card MessageBox When navigation is not supported for card", function(Given, When, Then) {
        When.iClickTheCardHeader("application-procurement-overview-component---Vcard16_cardchartscolumnstackedOriginal_Tab1--ovpCardHeader", false);
        Then.iVerifyNavigationError("Navigation to this application is not supported.");
        Given.iTeardownMyApp();
    });
});