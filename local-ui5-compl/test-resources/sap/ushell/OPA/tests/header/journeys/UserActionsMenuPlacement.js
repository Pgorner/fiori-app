// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ui/thirdparty/sinon-4",
    "sap/ui/Device"
], function (
    opaTest,
    ShellHeader,
    sinon,
    Device
) {
    "use strict";

    /* global QUnit */

    const sandbox = sinon.createSandbox();

    QUnit.module("UserActionsMenu placement", {
        before: function () {
            this.fiori3Config = {
                renderers: {
                    fiori2: {
                        componentData: {
                            config: {
                                moveEditHomePageActionToShellHeader: true,
                                moveAppFinderActionToShellHeader: true,
                                moveUserSettingsActionToShellHeader: true,
                                enableSearch: true
                            }
                        }
                    }
                }
            };
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];

    aAdapters.forEach(function (sAdapter) {
        opaTest("Should show UserActionsMenu in Shell Header End Items in Fiori 3", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyMockServer("/sap/opu/odata/sap/ESH_SEARCH_SRV/", [
                {
                    method: "GET",
                    path: /.*./,
                    response: function (oXhr) {
                        oXhr.respond(200);
                    }
                }
            ]);

            Given.iStartMyMockServer("/sap/es/ina/", [
                {
                    method: "GET",
                    path: /.*./,
                    response: function (oXhr) {
                        oXhr.respond(200);
                    }
                }
            ]);

            Given.iStartMyFLP(sAdapter, this.fiori3Config);

            // Assertions
            Then.onShellHeader.iShouldSeeHeaderItems(0); // No UserActionsMenu
            Then.onShellHeader.iShouldSeeSettingsIcon() //Settings component are loaded the last
                .and.iShouldSeeHeaderEndItems(5); // UserActionsMenu + edit button + appFinder + setting + search
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Should show UserActionsMenu in Shell Header End Items in Fiori 3 on a Phone", function (Given, When, Then) {
            // Arrangements
            sandbox.stub(Device.media, "getCurrentRange").returns({name: "Phone"});
            Given.iStartMyFLP(sAdapter, this.fiori3Config);

            // Assertions
            Then.onShellHeader.iShouldSeeHeaderItems(0); // No UserActionsMenu
            Then.onShellHeader.iShouldSeeHeaderEndItems(2); // UserActionsMenu + overflow button
            Then.waitFor({
                success: () => {
                    sandbox.restore();
                }
            });
            Then.iTeardownMyFLP();
        });
    });
});
