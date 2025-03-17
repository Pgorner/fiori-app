// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/Core",
    "sap/ui/core/EventBus",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    Component,
    ComponentContainer,
    Core,
    EventBus,
    jQuery,
    Container
) {
    "use strict";

    const oRenderer = Container.getRendererInternal("fiori2");

    return Component.extend("sap.ushell.demo.BootstrapPluginSample.CFLPPluginsSample.yellowBoxPlugin.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.CFLPPluginsSample.yellowBoxPlugin"
        },

        init: function () {
            this.createLogScreen();
            oRenderer.addHeaderEndItem(
                "sap.ushell.ui.shell.ShellHeadItem", {
                    icon: "sap-icon://co",
                    id: "copilotBtn",
                    press: function () {
                        oRenderer.setFloatingContainerVisibility(!oRenderer.getFloatingContainerVisiblity());
                    }
                },
                true,
                false
            );
        },

        createLogScreen: async function () {
            const oComponent = await Component.create({
                name: "sap.ushell.demo.BootstrapPluginSample.CFLPPluginsSample.yellowBoxPlugin.floatingWindow"
            });

            this._oCopilotCoreComponentContainer = new ComponentContainer({
                height: this._calculateCopilotContainerHeight(),
                width: "100%",
                component: oComponent
            });

            oRenderer.setFloatingContainerContent(this._oCopilotCoreComponentContainer);
            setTimeout(function () {
                oRenderer.setFloatingContainerDragSelector(".copilotDragableHandle");
            }, 1000);
            oRenderer.setFloatingContainerVisibility(false);

            EventBus.getInstance().publish("ybplugin", "registerPostMessages", this.getComponentData().oPostMessageInterface);
        },

        _calculateCopilotContainerHeight: function (iModify) {
            const nWindowREMHeight = parseInt(jQuery(window).height() / parseFloat(jQuery("html").css("font-size")), 10) - 8;
            return Math.min(nWindowREMHeight, 46) + "rem";
        },

        exit: function () { }
    });
});
