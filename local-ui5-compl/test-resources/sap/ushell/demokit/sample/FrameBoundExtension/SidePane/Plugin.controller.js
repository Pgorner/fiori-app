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

            const SidePane = await FrameBoundExtension.getSidePane();
            const SidePaneItem = await SidePane.createItem({
                id: "sidePaneContent1",
                text: "SidePaneContent Button",
                press: () => {
                    MessageToast.show("Press SidePaneContent Button");
                }
            }, {
                controlType: "sap.m.Button"
            });
            SidePane.showOnHome();
            SidePaneItem.showOnHome();
        }
    };
});
