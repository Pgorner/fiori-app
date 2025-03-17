// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define("sap.ushell.demo.PluginAddToolAreaWithTextOnly", [
    "sap/base/Log",
    "sap/m/MessageToast",
    "sap/ui/core/EventBus",
    "sap/ui/core/IconPool",
    "sap/ushell/Container",
    "sap/ushell/state/ShellModel"
], function (
    Log,
    MessageToast,
    EventBus,
    IconPool,
    Container,
    ShellModel
) {
    "use strict";

    Log.debug("PluginAddToolAreaWithTextOnly - module loaded");

    function applyRenderer () {
        Log.debug("PluginAddToolAreaWithTextOnly - inserting a sample button onto the shell's side bar after renderer was loaded");

        var oRenderer = Container.getRendererInternal("fiori2");
        if (oRenderer) {
            oRenderer.addToolAreaItem({
                id: "sideBarButton",
                //icon: "sap-icon://documents",
                text: "Overview",
                expandable: false,
                press: function (evt) {
                    window.alert("Press");
                },
                expand: function (evt) {
                    window.alert("Expand");
                }
            }, true, false, ["home"]);
            oRenderer.addToolAreaItem({
                id: "sideBarButton1",
                //icon: "sap-icon://newspaper",
                expandable: false,
                text: "Destinations",
                press: function (evt) {
                    window.alert("Press");
                },
                expand: function (evt) {
                    window.alert("Expand");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem({
                id: "sideBarButton2",
                //icon: "sap-icon://settings",
                expandable: false,
                text: "Logging",
                press: function (evt) {
                    window.alert("Press");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem({
                id: "sideBarButton3",
                //icon: "sap-icon://wrench",
                expandable: false,
                text: "Data Source Binding",
                press: function (evt) {
                    window.alert("Press");
                },
                expand: function (evt) {
                    window.alert("Expand");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem({
                id: "sideBarButton4",
                //icon: "sap-icon://employee-approvals",
                expandable: false,
                text: "Roles",
                press: function (evt) {
                    window.alert("Press");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem({
                id: "sideBarButton5",
                //icon: "sap-icon://employee-approvals",
                expandable: false,
                text: "JMX Console",
                press: function (evt) {
                    window.alert("Press");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem({
                id: "sideBarButton6",
                //icon: "sap-icon://employee-approvals",
                expandable: false,
                text: "Resources",
                press: function (evt) {
                    window.alert("Press");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem({
                id: "sideBarButton7",
                //icon: "sap-icon://employee-approvals",
                expandable: false,
                text: "Performance Statistics",
                press: function (evt) {
                    window.alert("Press");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem({
                id: "sideBarButton8",
                //icon: "sap-icon://employee-approvals",
                expandable: false,
                text: "Monitoring",
                press: function (evt) {
                    window.alert("Press");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                tooltip: "Sample Shell Header Item",
                icon: IconPool.getIconURI("action-settings"),
                press: function () {
                    MessageToast.show("Sample shell header item pressed");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                tooltip: "Sample Shell Header Item",
                icon: IconPool.getIconURI("sys-help"),
                press: function () {
                    MessageToast.show("Sample shell header item pressed");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                tooltip: "Sample Shell Header Item",
                icon: IconPool.getIconURI("marketing-campaign"),
                press: function () {
                    MessageToast.show("Sample shell header item pressed");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addHeaderItem("sap.ushell.ui.shell.ShellHeadItem", {
                id: "toggleToolArea",
                icon: IconPool.getIconURI("menu2"),
                press: function (oEvent) {
                    var bState = ShellModel.getModel().getProperty("/toolArea/visible");
                    oRenderer.showToolArea("home", !bState);
                    oRenderer.showToolArea("app", !bState);
                }
            }, true, true);

            oRenderer.setHeaderTitle("SAP HANA Cloud Platform Cockpit");

            Log.debug("PluginAddToolAreaWithTextOnly - Added a sample button onto the shell's side bar ONLY for Home state");
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
});
