// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/I18NText"
], function (Opa5, I18NTextMatcher) {
    "use strict";

    Opa5.createPageObjects({
        onTheHomeAppErrorComponent: {
            actions: {},
            assertions: {
                iSeeTheCopyButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "HomeApp.CannotLoadApp.CopyButton"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "Found the copy button.");
                        }
                    });
                }
            }
        },
        onTheHomeApp: {
            actions: {},
            assertions: {
                iSeeTheNavigateButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "navigation.navigate"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "Found the navigation button.");
                        }
                    });
                }
            }
        }
    });
});
