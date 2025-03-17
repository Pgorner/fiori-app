// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/Log",
    "sap/m/Button",
    "sap/m/Page",
    "sap/ui/core/Component",
    "sap/ui/core/EventBus",
    "sap/ushell/Container"
], function (
    Log,
    Button,
    Page,
    Component,
    EventBus,
    Container
) {
    "use strict";

    return Component.extend("sap.ushell.demo.PluginAddMinimalFloatingContainer.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: {
            manifest: "json"
        },

        init: function () {
            this.bContainerVisible = false;

            if (Container.getRendererInternal("fiori2")) {
                // fiori renderer already loaded, apply extensions directly
                this.applyRenderer();
            } else {
                // fiori renderer not yet loaded, register handler for the loaded event
                EventBus.getInstance().subscribe("sap.ushell", "rendererLoaded", this.applyRenderer, this);
            }
        },

        applyRenderer: function () {
            const oRenderer = Container.getRendererInternal("fiori2");
            if (oRenderer) {
                this.bContainerVisible = oRenderer.getFloatingContainerVisiblity();
                // A shell header button that controls the visibility of the Floating Container
                oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                    id: "FloatingContainerButton",
                    icon: "sap-icon://S4Hana/S0011",
                    press: function (oEvent) {
                        oRenderer.setFloatingContainerDragSelector("#ContentPage-intHeader");
                        oRenderer.setFloatingContainerVisibility(!this.bContainerVisible);
                        this.bContainerVisible = !this.bContainerVisible;
                    }
                }, true, false, ["home", "app"]);

                var oContent = new Page("ContentPage", {
                    content: [new Button("button")],
                    title: "Header of a Page",
                    showHeader: true
                }).addStyleClass("listCSSClass");

                // The content is added to the container in all states
                oRenderer.setFloatingContainerContent(oContent, false);
            } else {
                Log.error("BootstrapPluginSample - failed to apply renderer extensions, because the Renderer is not available");
            }
        }
    });
});
