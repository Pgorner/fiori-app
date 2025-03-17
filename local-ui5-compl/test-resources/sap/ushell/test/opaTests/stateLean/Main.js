// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/Opa5"
], function (Opa5) {

    "use strict";

    Opa5.createPageObjects({
        onTheMainPage: {
            actions: {

                ClickOnAppTitle: function (sAppTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellAppTitle",
                        success: function (appTitles) {
                            appTitles.forEach(function (appTitle) {
                                if (appTitle.getText() === sAppTitle) {
                                    appTitle.$().trigger("click");
                                    Opa5.assert.ok(true, "App Title '" + sAppTitle + "' Clicked");
                                }
                            });
                        },
                        errorMessage: "Action1 error"
                    });
                }
            },

            assertions: {

                CheckHeaderItems: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.ShellHeader",
                        success: function (headers) {
                            Opa5.assert.ok(headers && headers.length === 1, "shell header exists in the page");
                            Opa5.assert.ok(headers[0].getVisible() === true, "shell header is visible");
                            Opa5.assert.ok(headers[0].getShowLogo() === true, "shell header logo is visible");
                            Opa5.assert.ok(headers[0].getDomRef("logo").tagName === "DIV", "shell header logo is rendered as a DIV element");
                            Opa5.assert.ok(headers[0].getHeadItems().length === 0, "shell header does not contain");
                            Opa5.assert.ok(headers[0].getHeadEndItems().some(function (oItem) {
                                return oItem.getId() === "userActionsMenuHeaderButton";
                            }), "'userActionsMenuHeaderButton' is shown on the right side");
                        },
                        errorMessage: "CheckHeaderItems test failed"
                    });
                },

                CheckThatInAppTitleMenuShown: function () {
                    return this.waitFor({
                        controlType: "sap.m.Popover",
                        success: function (popOvers) {
                            popOvers.forEach(function (popOver) {
                                if (popOver.getId() === "sapUshellAppTitlePopover") {
                                    Opa5.assert.ok(true, "Application title pop over menu opened");
                                }
                            });
                        },
                        errorMessage: "CheckThatInAppTitleMenuShown test failed"
                    });
                },

                CheckThatRelatedApplicationIsHidden: function () {
                    return this.waitFor({
                        controlType: "sap.m.VBox",
                        success: function (vBoxes) {
                            var bFound = false;
                            vBoxes.forEach(function (vBox) {
                                if (vBox.getId() === "sapUshellRelatedAppsItems") {
                                    bFound = true;
                                }
                            });
                            Opa5.assert.ok(bFound === false, "Related applications vbox is hidden");
                        },
                        errorMessage: "CheckThatRelatedApplicationIsHidden test failed"
                    });
                },

                CheckThatAllMyAppsIsHidden: function () {
                    return this.waitFor({
                        controlType: "sap.m.Bar",
                        success: function (bars) {
                            var bFound = false;
                            bars.forEach(function (bar) {
                                if (bar.getId() === "shellpopoverFooter") {
                                    bFound = true;
                                }
                            });
                            Opa5.assert.ok(bFound === false, "All my apps bar is hidden");
                        },
                        errorMessage: "CheckThatAllMyAppsIsHidden test failed"
                    });
                }
            }
        }
    });
});
