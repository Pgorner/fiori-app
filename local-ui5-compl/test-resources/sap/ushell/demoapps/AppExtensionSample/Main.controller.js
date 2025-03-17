// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ushell/utils"
], function (
    Button,
    MessageToast,
    Controller,
    ushellUtils
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppExtensionSample.Main", {
        onInit: function () {
            /**
             * @deprecated since 1.120
             */
            this._addDeprecatedExtensions();
        },

        /**
         * @deprecated since 1.120
         */
        _addDeprecatedExtensions: async function () {
            const oButton = new Button({
                text: "Hello World #1",
                press: this._handleOptionsActionSheetButtonPress.bind(this)
            });

            /*
             * In older SAPUI5 versions this module was available via the global object.
             * Since the "remove global" refactorings the module has to be required explicitly.
             */
            let RendererExtensions;
            if (sap.ushell.renderers.fiori2.RendererExtensions) {
                RendererExtensions = sap.ushell.renderers.fiori2.RendererExtensions;
            } else {
                [ RendererExtensions ] = await ushellUtils.requireAsync(["sap/ushell/appRuntime/ui5/renderers/fiori2/RendererExtensions"]);
            }

            const { LaunchpadState } = RendererExtensions;
            RendererExtensions.addOptionsActionSheetButton(oButton, LaunchpadState.App);
        },

        /**
         * @deprecated since 1.120
         */
        _handleOptionsActionSheetButtonPress: function () {
            MessageToast.show("Hello World #1");
        },

        onExit: function () {
        }
    });
});
