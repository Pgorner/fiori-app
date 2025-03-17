// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ui/test/Opa5",
    "sap/ushell/test/opaTests/stateLean/Common",
    "sap/ushell/test/opaTests/stateLean/Main"
], function (opaTest, Opa5, Common) {
    "use strict";

    Opa5.extendConfig({
        arrangements: new Common(),
        autoWait: true
    });

    /* global QUnit */

    QUnit.module("FLPRT - App - lean state");

    opaTest("Test 1: Launch application in lean state and check header items", function (Given, When, Then) {
        Given.StartFLPAppInLeanState();
        Then.onTheMainPage.CheckHeaderItems();
    });

    opaTest("Test 1: Check that title click window shows only in app navigation option", function (Given, When, Then) {
        When.onTheMainPage.ClickOnAppTitle("Sample Application For Navigation");
        Then.onTheMainPage.CheckThatInAppTitleMenuShown();
        Then.onTheMainPage.CheckThatRelatedApplicationIsHidden();
        Then.onTheMainPage.CheckThatAllMyAppsIsHidden();
    });

    opaTest("Close application", function (Given, When, Then) {
        Given.iTeardownMyApp();
        Opa5.assert.expect(0);
    });
});
