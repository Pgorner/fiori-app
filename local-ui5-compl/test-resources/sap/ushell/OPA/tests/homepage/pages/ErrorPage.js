// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ushell/opa/tests/homepage/pages/i18n/resources"
], function (Opa5, Press, Properties, resources) {
    "use strict";

    var sViewName = "ErrorPage";

    Opa5.createPageObjects({
        onTheErrorPage: {
            actions: {
                iGoBack: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellHeadItem",
                        matchers: new Properties({ id: "backBtn" }),
                        check: function (aControls) {
                            return (aControls.length === 1);
                        },
                        success: function (aControls) {
                            new Press().executeOn(aControls[0]);
                        }
                    });
                }
            },
            assertions: {
                iShouldSeeErrorLink: function () {
                    return this.waitFor({
                        controlType: "sap.m.Link",
                        viewName: sViewName,
                        check: function (aControls) {
                            return aControls.length === 1
                                && aControls[0].getText() === resources.i18n.getText("ErrorPage.Link");
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The error link should exist on the page.");
                        }
                    });
                },
                iShouldSeeErrorText: function (errorText) {
                    return this.waitFor({
                        controlType: "sap.m.MessagePage",
                        viewName: sViewName,
                        matchers: new Properties({ text: errorText }),
                        success: function () {
                            Opa5.assert.ok(true, "The error text should exist on the page.");
                        }
                    });
                }
            }
        }
    });
});
