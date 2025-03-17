// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/Image",
    "sap/ui/core/Component",
    "sap/ui/core/EventBus",
    "sap/ushell/Container"
], function (
    Log,
    Image,
    Component,
    EventBus,
    Container
) {
    "use strict";

    return Component.extend("sap.ushell.demo.FloatingContainerPlugin.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.FloatingContainerPlugin"
        },

        init: function () {
            let bContainerVisible = false;

            function applyRenderer () {
                const oRenderer = Container.getRendererInternal("fiori2");
                if (oRenderer) {
                    bContainerVisible = oRenderer.getFloatingContainerVisiblity();

                    // A shell header button that controls the visibility of the Floating Container
                    oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                        id: "FloatingContainerButton",
                        icon: "sap-icon://S4Hana/S0011",
                        press: function (oEvent) {
                            oRenderer.setFloatingContainerVisibility(!bContainerVisible);
                            bContainerVisible = !bContainerVisible;
                        }
                    }, true, false, ["home", "app"]);

                    var oContent = new Image({
                        src: "/sap/bc/ui5_demokit/test-resources/sap/ushell/shells/demo/img/Chat_Participants_Messages_002.png"
                    });

                    // Setting the content of the Floating Container for the states "home" and "app"

                    // The content is added to the container only in the current state
                    //oRenderer.setFloatingContainerContent(oContent, true);

                    // The content is added to the container in "home" and "app" states
                    //oRenderer.setFloatingContainerContent(oContent, false , ["home", "app"]);

                    // The content is added to the container in all states
                    oRenderer.setFloatingContainerContent(oContent, false);
                } else {
                    Log.error("BootstrapPluginSample - failed to apply renderer extensions, because the Renderer is not available");
                }
            }

            // the module could be loaded asynchronously, the shell does not guarantee a loading order;
            // therefore, we have to consider both cases, i.e. renderer is loaded before or after this module
            if (Container.getRendererInternal("fiori2")) {
                // fiori renderer already loaded, apply extensions directly
                applyRenderer();
            } else {
                // fiori renderer not yet loaded, register handler for the loaded event
                EventBus.getInstance().subscribe("sap.ushell", "rendererLoaded", applyRenderer, this);
            }
        }

    });
});

