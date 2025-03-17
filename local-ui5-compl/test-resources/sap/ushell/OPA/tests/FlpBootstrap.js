// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/utils/OpaUtils"
], function (Opa5, opaTest, OpaUtils) {
    "use strict";

    /* global QUnit */

    QUnit.module("Launch FLP in an iFrame ('real' bootstrap)");

    opaTest("Should start and teardown an iFrame with CDM-based FLP", function (Given, When, Then) {
        // Arrangements
        var sUrl = OpaUtils.normalizeConfigPath("../shells/cdm/fiori-LOCAL-FLP-RtSpaces-10Tiles.html");
        Given.iStartMyAppInAFrame(sUrl).done(function () {
            Opa5.assert.ok(document.getElementById("OpaFrame"), "The frame was loaded");
        });

        // execute your tests
        Then.waitFor({
            controlType: "sap.ushell.ui.ShellHeader",
            success: function (oControl) {
                Opa5.assert.ok(true, "Shell Header Found.");
            }
        });
        Then.waitFor({
            controlType: "sap.m.GenericTile",
            success: function (oControl) {
                Opa5.assert.ok(true, "GenericTile Found.");
            }
        }).
            and.iTeardownMyAppFrame();
    });

    opaTest("Should start and teardown an iFrame with Sandbox-based FLP", function (Given, When, Then) {
        // Arrangements
        var sUrl = OpaUtils.normalizeConfigPath("../shells/sandbox/fioriSandbox.html");
        Given.iStartMyAppInAFrame(sUrl).done(function () {
            Opa5.assert.ok(document.getElementById("OpaFrame"), "The frame was loaded");
        });

        // execute your tests
        Then.waitFor({
            controlType: "sap.ushell.ui.ShellHeader",
            success: function (oControl) {
                Opa5.assert.ok(true, "Shell Header Found.");
            }
        });
        Then.waitFor({
            controlType: "sap.m.GenericTile",
            success: function (oControl) {
                Opa5.assert.ok(true, "GenericTile Found.");
            }
        }).
            and.iTeardownMyAppFrame();
    });
});
