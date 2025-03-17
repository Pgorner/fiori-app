// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/ui/core/EventBus",
    "sap/ushell/Container"
], function (
    Log,
    Component,
    EventBus,
    Container
) {
    "use strict";

    return Component.extend("sap.ushell.demo.PluginAddButtonToActionSheet.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: {
            manifest: "json"
        },

        init: function () {
            // the module could be loaded asynchronously, the shell does not guarantee a loading order;
            // therefore, we have to consider both cases, i.e. renderer is loaded before or after this module
            if (Container.getRendererInternal("fiori2")) {
                // fiori renderer already loaded, apply extensions directly
                this.addOptionsActionSheetButton();
            } else {
                // fiori renderer not yet loaded, register handler for the loaded event
                EventBus.getInstance().subscribe("sap.ushell", "rendererLoaded", this.addOptionsActionSheetButton, this);
            }
        },

        addOptionsActionSheetButton: function () {
            Log.debug("PluginAddButtonToActionSheet - inserting a sample button onto the shell's action sheet after renderer was loaded");

            const oRenderer = Container.getRendererInternal("fiori2");
            if (oRenderer) {
                sap.ui.require([
                    "sap/m/Button",
                    "sap/m/MessageToast"
                ], function (
                    Button,
                    MessageToast
                ) {
                    oRenderer.addOptionsActionSheetButton(
                        new Button("newButtonId", {
                            text: "New_Button",
                            press: function () {
                                MessageToast.show("new_button_clicked");
                            }
                        }),
                        "home"
                    );
                    Log.debug("PluginAddButtonToActionSheet - Added a sample button onto the shell's action ONLY for Home state");
                });
            } else {
                Log.error("BootstrapPluginSample - failed to apply renderer extensions, because the Renderer is not available");
            }
        }
    });
});
