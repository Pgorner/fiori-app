// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ushell/Container"
], function (
    MessageToast,
    Container
) {
    "use strict";

    return {
        runCode: async function () {
            const FrameBoundExtension = await Container.getServiceAsync("FrameBoundExtension");

            const ToolArea = await FrameBoundExtension.getToolArea();
            const ToolAreaItem = await ToolArea.createItem({
                id: "toolArea1",
                icon: "sap-icon://documents",
                text: "My ToolArea Item1",
                expandable: true,
                press: () => {
                    MessageToast.show("Press toolArea1");
                },
                expand: () => {
                    MessageToast.show("Expand toolArea1");
                }
            });
            ToolArea.showOnHome();
            ToolAreaItem.showOnHome();
        }
    };
});
