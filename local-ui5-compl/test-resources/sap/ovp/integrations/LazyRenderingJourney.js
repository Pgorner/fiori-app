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
    
    opaTest("#0: Open App", function (Given, When, Then) {
        Given.iStartLazyRenderedApp("sales-overview");
        Then.checkAppTitle("Sales Overview Page");
    });

    opaTest("Number of Cards", function (Given, When, Then) {
        Then.iCheckForNumberOfLazilyLoadedCards({minCount: 1, maxCount: 20}, "sap.viz.ui5.controls.VizFrame");
    });

    opaTest("Scroll to bottom of page", function (Given, When, Then) {
        When.iSimulateUserScroll();
    });

    opaTest("Number of Cards", function (Given, When, Then) {
        Then.iCheckForNumberOfLazilyLoadedCards({minCount: 15, maxCount: 28}, "sap.viz.ui5.controls.VizFrame");
    });

});