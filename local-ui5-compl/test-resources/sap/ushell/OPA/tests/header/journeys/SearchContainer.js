// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/homepage/pages/Homepage"
], function (opaTest, jQuery) {
    "use strict";

    /* global QUnit */

    // for the sap/esh/SearchInput control that still uses global $:
    if (!window.$) {
        window.$ = jQuery;
    }

    QUnit.module("test the search container", {
        before: function () {
            this.flpConfig = {
                renderers: {
                    fiori2: {
                        componentData: {
                            config: {
                                moveEditHomePageActionToShellHeader: false,
                                moveAppFinderActionToShellHeader: false,
                                moveUserSettingsActionToShellHeader: false,
                                enableSearch: true,
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
        opaTest("Open Search", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.flpConfig);

            // Actions
            When.onShellHeader.iPressTheSearchBtn();

            // Assertions
            Then.onShellHeader.iShouldSeeOpenSearch()
                .and.iShouldNotSeeSearchOverlay()
                .and.iShouldSeeHeaderEndItems(1);
        });

        opaTest("Close Search", function (Given, When, Then) {
            // Actions
            When.onTheHomepage.iPressOnTheOpenedSearchButton();

            // Assertions
            Then.onShellHeader.iShouldSeeHeaderEndItem("sap-icon://search");
            Then.iTeardownMyFLP();
        });

    });
});
