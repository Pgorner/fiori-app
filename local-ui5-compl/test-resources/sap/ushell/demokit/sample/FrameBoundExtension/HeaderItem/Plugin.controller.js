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

            const HeaderItemStart = await FrameBoundExtension.createHeaderItem({
                id: "myTestButton1",
                ariaLabel: "ariaLabel",
                ariaHaspopup: "dialog",
                icon: "sap-icon://action-settings",
                tooltip: "tooltip-start",
                text: "myStartButton",
                press: () => {
                    MessageToast.show("Press HeaderItem Start Button");
                }
            }, {
                position: "begin"
            });
            HeaderItemStart.showOnHome();

            const HeaderItemEnd = await FrameBoundExtension.createHeaderItem({
                id: "myTestButton2",
                ariaLabel: "ariaLabel",
                ariaHaspopup: "dialog",
                icon: "sap-icon://documents",
                tooltip: "tooltip-end",
                text: "myEndButton",
                press: () => {
                    MessageToast.show("Press HeaderItem End Button");
                }
            }, {
                position: "end"
            });
            HeaderItemEnd.showOnHome();
        }
    };
});
