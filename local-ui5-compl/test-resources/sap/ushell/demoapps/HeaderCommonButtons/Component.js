// Copyright (c) 2009-2023 SAP SE, All Rights Reserved


sap.ui.define([
    "sap/ui/core/Component",
    "sap/ushell/Container"
], function (Component, Container) {
    "use strict";

    return Component.extend("sap.ushell.demo.HeaderCommonButtons.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.HeaderCommonButtons"
        },

        init: function () {
            Container.getRendererInternal("fiori2").addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                id: "xraybtn",
                tooltip: "This button simulates the xray help",
                icon: "sap-icon://sys-help",
                visible: true
            }, true, false);

            Container.getRendererInternal("fiori2").addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                id: "copilotBtn",
                tooltip: "This button simulates CoPilot",
                icon: "sap-icon://co",
                visible: true
            }, true, false);
        }
    });
});

