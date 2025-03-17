// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ui/thirdparty/sinon-4",
    "sap/ui/Device"
], function (
    opaTest,
    ShellHeader,
    Homepage,
    sinon,
    Device
) {
    "use strict";

    /* global QUnit */

    const sandbox = sinon.createSandbox();

    QUnit.module("EndItems overflow button", {
        before: function () {
            this.defaultConfig = {
                renderers: {
                    fiori2: {
                        componentData: {
                            config: {
                                moveEditHomePageActionToShellHeader: true,
                                moveAppFinderActionToShellHeader: true,
                                moveUserSettingsActionToShellHeader: true,
                                enableSearch: false,
                                esearch: { sinaConfiguration: "sample" }
                            }
                        }
                    }
                },
                services: {
                    Search: {
                        adapter: {
                            module: "sap.ushell.adapters.local.SearchAdapter",
                            searchResultPath: "./searchResults/record.json"
                        }
                    }
                }
            };
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Should show all configured end header items", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Assertions
            Then.onShellHeader.iShouldSeeSettingsIcon() //need time to load flp components
                .and.iShouldSeeHeaderEndItems(4); //edit button + appFinder + setting + UserActionsMenu
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Should show hidden end items in popover", function (Given, When, Then) {
            // Arrangements
            sandbox.stub(Device.media, "getCurrentRange").returns({name: "Phone"});
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onShellHeader.iPressOnTheEndItemsOverflowBtn();

            // Assertions
            Then.onShellHeader.iShouldSeeHeaderEndItems(2) //overflow button + UserActionsMenu
                .and.iShouldSeeHiddenHeaderEndItemsInPopover(3); //edit button + appFinder + setting
            Then.waitFor({
                success: () => {
                    sandbox.restore();
                }
            });
            Then.iTeardownMyFLP();
        });
    });

});
