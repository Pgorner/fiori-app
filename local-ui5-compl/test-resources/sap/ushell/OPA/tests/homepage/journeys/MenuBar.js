// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/homepage/pages/Homepage"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("test the MenuBar", {
        before: function () {
            this.flpConfig = {
                ushell: { menu: { enabled: true } },
                services: {
                    Menu: {
                        adapter: {
                            module: "sap.ushell.adapters.local.MenuAdapter",
                            config: {
                                enabled: true,
                                menuData: [{
                                    id: "SPACE_1",
                                    label: "Test Space 1",
                                    type: "Space",
                                    isContainer: false,
                                    children: [{
                                        id: "PAGE_1",
                                        label: "Test Page 1",
                                        type: "Page",
                                        isContainer: true,
                                        children: []
                                    }]
                                }, {
                                    id: "SPACE_2",
                                    label: "Test Space 2",
                                    type: "Space",
                                    isContainer: false,
                                    children: [{
                                        id: "PAGE_2",
                                        label: "Test Page 2",
                                        type: "Page",
                                        isContainer: true,
                                        children: []
                                    }]
                                }]
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
        opaTest("MenuBar is loaded", function (Given, When, Then) {
            // Arrangements & Actions
            Given.iStartMyFLP(sAdapter, this.flpConfig);

            // Assertions
            Then.onTheHomepage.iShouldSeeTheMenuBar()
                .and.iShouldSeeMenuEntries(2);

            Then.iTeardownMyFLP();
        });
    });
});
