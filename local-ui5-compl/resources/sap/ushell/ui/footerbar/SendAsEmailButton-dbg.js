// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.footerbar.SendAsEmailButton.
sap.ui.define([
    "sap/base/Log",
    "sap/m/Button",
    "sap/m/ButtonRenderer",
    "sap/m/library",
    "sap/ushell/resources",
    "sap/ushell/Container",
    "sap/ushell/state/ShellModel"
], function (
    Log,
    Button,
    ButtonRenderer,
    mobileLibrary,
    resources,
    Container,
    ShellModel
) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    /**
     * @alias sap.ushell.ui.footerbar.SendAsEmailButton
     * @class
     * @classdesc Constructor for a new ui/footerbar/SendAsEmailButton.
     * Add your documentation for the new ui/footerbar/SendAsEmailButton
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.m.Button
     *
     * @since 1.71.0
     * @private
     */
    var SendAsEmailButton = Button.extend("sap.ushell.ui.footerbar.SendAsEmailButton", /** @lends sap.ushell.ui.footerbar.SendAsEmailButton.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                beforePressHandler: { type: "function", group: "Misc", defaultValue: null },
                afterPressHandler: { type: "function", group: "Misc", defaultValue: null }
            }
        },
        renderer: ButtonRenderer
    });

    SendAsEmailButton.prototype.init = function () {
        // call the parent sap.m.Button init method
        if (Button.prototype.init) {
            Button.prototype.init.apply(this, arguments);
        }
        this.setIcon("sap-icon://email");
        this.setText(resources.i18n.getText("sendEmailBtn"));
        this.setTooltip(resources.i18n.getText("sendEmailBtn_tooltip"));

        this.attachPress(function () {
            var fnBeforePressHandler = this.getBeforePressHandler();
            if (fnBeforePressHandler) {
                fnBeforePressHandler();
            }
            this.sendAsEmailPressed(this.getAfterPressHandler());
        }.bind(this));
    };

    /**
     * @param {function} [fnCallback] if provided, is called after the process of sending an email is triggered.
     */
    SendAsEmailButton.prototype.sendAsEmailPressed = function (fnCallback) {
        // If we're running over an IFrame...
        if (Container.inAppRuntime()) {
            // DO NOT CHANGE the line below, this is to optimize the bundle build process
            sap.ui.require(["sap/ushell/appRuntime/ui5/AppRuntimeService"], function (AppRuntimeService) {
                AppRuntimeService.sendMessageToOuterShell(
                    "sap.ushell.services.ShellUIService.sendEmailWithFLPButton",
                    { bSetAppStateToPublic: true });
            });
        } else {
            var sURL = document.URL;
            const sAppName = ShellModel.getModel().getProperty("/application/title");
            var sSubject = (sAppName === undefined) ?
                resources.i18n.getText("linkToApplication") :
                resources.i18n.getText("linkTo") + " '" + sAppName + "'";
            Container.getServiceAsync("AppState")
                .then(function (oAppStateService) {
                    oAppStateService.setAppStateToPublic(sURL)
                        .done(function (sNewURL) {
                            URLHelper.triggerEmail(
                                null,
                                sSubject,
                                sNewURL
                            );
                        }).fail(Log.error);
                });
        }

        if (fnCallback) {
            fnCallback();
        }
    };

    return SendAsEmailButton;
});
