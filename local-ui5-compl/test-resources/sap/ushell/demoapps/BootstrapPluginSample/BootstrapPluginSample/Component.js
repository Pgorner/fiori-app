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

    return Component.extend("sap.ushell.demo.BootstrapPluginSample.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: {
            manifest: "json"
        },

        init: function () {
            // the module could be loaded asynchronously, the shell does not guarantee a loading order;
            // therefore, we have to consider both cases, i.e. renderer is loaded before or after this module
            if (Container.getRendererInternal("fiori2")) {
                // fiori renderer already loaded, apply extensions directly
                this.addHeaderItem();
            } else {
                // fiori renderer not yet loaded, register handler for the loaded event
                EventBus.getInstance().subscribe("sap.ushell", "rendererLoaded", this.addHeaderItem, this);
            }
        },

        exit: function () {
            EventBus.getInstance().unsubscribe("sap.ushell", "rendererLoaded", this.addHeaderItem, this);
        },

        addHeaderItem: function () {
            Log.debug("BootstrapPluginSample - inserting a sample button onto the shell header after renderer was loaded");

            const oRenderer = Container.getRendererInternal("fiori2");
            if (oRenderer) {
                sap.ui.require([
                    "sap/ushell/ui/shell/ShellHeadItem",
                    "sap/ui/core/IconPool",
                    "sap/m/MessageToast"
                ], function (
                    ShellHeadItem,
                    IconPool,
                    MessageToast
                ) {
                    oRenderer.addHeaderItem(new ShellHeadItem({
                        tooltip: "Sample Shell Header Item",
                        icon: IconPool.getIconURI("example"),
                        press: function () {
                            MessageToast.show("Sample shell header item pressed");
                        }
                    }));
                });
            } else {
                Log.error("BootstrapPluginSample - failed to apply renderer extensions, because the Renderer is not available");
            }
        }
    });
});
