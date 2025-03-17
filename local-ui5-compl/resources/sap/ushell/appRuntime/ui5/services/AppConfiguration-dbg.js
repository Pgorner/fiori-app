// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview This module is a iframe safe version of the AppConfiguration service.
 * The inner frame service has to be required explicitly or accessed via the global on the original path.
 * The require calls to the original file will NOT be replaced.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/m/library",
    "sap/ui/core/IconPool",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/EventHub",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/RendererExtensions",
    "sap/ushell/resources",
    "sap/ushell/services/AppConfiguration"
], function (
    ObjectPath,
    mobileLibrary,
    IconPool,
    AppRuntimeService,
    EventHub,
    RendererExtensions,
    resources,
    AppConfiguration
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    /**
     * @alias sap.ushell.appRuntime.ui5.services.AppConfiguration
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.AppConfiguration}.
     *
     * @hideconstructor
     *
     * @private
     */
    function AppConfigurationProxy () {
        var aIdsOfAddedButtons = [];

        var vGetFullWidthParamFromManifest = false;
        ObjectPath.set("sap.ushell.services.AppConfiguration", this);
        AppConfiguration.constructor.call(this);

        EventHub.on("appWidthChange").do(function (bValue) {
            var oBody = document.body;
            oBody.classList.toggle("sapUiSizeCompact", bValue);
            oBody.classList.toggle("sapUShellApplicationContainerLimitedWidth", !bValue);
            oBody.classList.toggle("sapUShellApplicationContainer", !bValue);
        });

        // Letter boxing is set on the document.body, so it should be managed correspondingly on the setApplicationWidth event.
        // This part is used by the My Inbox application only, because it uses sap/ushell/services/AppConfiguration even in iframe.
        // To the contrary, in the embedded scenario, the CSS class is set on the application container and not on document.body.
        EventHub.on("setApplicationFullWidth").do(function (oData) {
            document.body.classList.toggle("sapUShellApplicationContainerLimitedWidth", !oData.bValue);
        });

        /**
         * Sets the application screen size to full width
         *
         * @param {boolean} bValue A Boolean value indicating if the application fills the full width of the screen
         *
         * @private
         * @deprecated since 1.120.0. Use the "sap.ui/fullWidth" property in the application's manifest.json instead.
         * @alias sap.ushell.services.AppConfiguration#setApplicationFullWidth
         * @alias sap.ushell.appRuntime.ui5.services.AppConfiguration#setApplicationFullWidth
         */
        this.setApplicationFullWidth = function (bValue) {
            if (vGetFullWidthParamFromManifest === true || vGetFullWidthParamFromManifest === "true") {
                EventHub.emit("appWidthChange", bValue);
            } else {
                AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.AppConfiguration.setApplicationFullWidth", {
                    bValue: bValue
                });
            }
        };

        this.setFullWidthFromManifest = function (sVal) {
            vGetFullWidthParamFromManifest = sVal;
        };

        /**
         * Adds buttons to the action sheet in the shell header.
         * This function always overrides the already existing application settings buttons with the new buttons.
         * It is meant to be used by applications that want to add their own settings button to the shell header.
         *
         * @param {sap.m.Button[]} aButtons List of sap.m.Button controls
         *
         * @private
         * @deprecated since 1.120. Use {@link sap.ushell.services.Extension#addUserAction} instead.
         * @alias sap.ushell.services.AppConfiguration#addApplicationSettingsButtons
         * @alias sap.ushell.appRuntime.ui5.services.AppConfiguration#addApplicationSettingsButtons
         */
        this.addApplicationSettingsButtons = function (aButtons) {
            for (var i = 0; i < aButtons.length; i++) {
                var oCurrentButton = aButtons[i];
                oCurrentButton.setIcon(oCurrentButton.getIcon() || IconPool.getIconURI("customize"));
                // in case the button has the text "Settings" we change it to "App Setting" in order prevent name collision
                if (resources.i18n.getText("userSettings") === oCurrentButton.getProperty("text")) {
                    oCurrentButton.setProperty("text", resources.i18n.getText("userAppSettings"));
                }
                oCurrentButton.setType(ButtonType.Unstyled);
            }

            RendererExtensions.removeOptionsActionSheetButton(aIdsOfAddedButtons, "app").then(function () {
                aIdsOfAddedButtons = aButtons;
                RendererExtensions.addOptionsActionSheetButton(aIdsOfAddedButtons, "app");
            });
        };
    }

    return new AppConfigurationProxy();
}, true);
