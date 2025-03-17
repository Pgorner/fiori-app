// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/Opa5",
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/utils/OpaUtils"
], function (
    Press,
    PropertiesMatcher,
    Opa5,
    opaTest,
    OpaUtils
) {
    "use strict";

    /* global QUnit */

    QUnit.module("Sandbox2SmokeTest");

    Opa5.createPageObjects({
        onTheMainPage: {
            actions: {
                iPressOnTheGenericTileWithTitle: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: sTitle
                        }),
                        actions: new Press(),
                        errorMessage: "No tile with this title: " + sTitle + " was found"
                    });
                }
            },
            assertions: {
                iSeeShellHeader: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.ShellHeader",
                        success: function (oControl) {
                            Opa5.assert.ok(true, "Shell Header Found.");
                        },
                        errorMessage: "Shell is not rendered"
                    });
                },
                iSeeAppOpened: function (sAppTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellAppTitle",
                        matchers: new PropertiesMatcher({
                            text: sAppTitle
                        }),
                        success: function (aTitles) {
                            Opa5.assert.ok(aTitles && aTitles.length === 1, "Correct title is shown in the app");
                        },
                        errorMessage: "Application start test has failed"
                    });
                }
            }
        }
    });


    opaTest("Start sandbox, open application, teardown", function (Given, When, Then) {
        // Arrangements: start Sandbox with additional configuration
        var sUrl = OpaUtils.normalizeConfigPath("../shells/sandbox2/FioriSandbox.html?sap-language=EN&sap-ushell-sandbox-config=./configFiles/several-apps");
        Given.iStartMyAppInAFrame(sUrl).done(() => {
            Opa5.assert.ok(document.getElementById("OpaFrame"), "The sandbox page is loaded");
        });

        // Tests
        Then.onTheMainPage.iSeeShellHeader();

        When.onTheMainPage.iPressOnTheGenericTileWithTitle("Custom App 1");

        Then.onTheMainPage.iSeeAppOpened("Fiori Sandbox Default App");

        Then.iTeardownMyAppFrame();
    });

});
