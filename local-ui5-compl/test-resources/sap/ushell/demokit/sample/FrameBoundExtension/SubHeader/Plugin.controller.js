// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/ushell/Container"
], function (
    Button,
    MessageToast,
    Container
) {
    "use strict";

    return {
        runCode: async function () {
            const FrameBoundExtension = await Container.getServiceAsync("FrameBoundExtension");

            const SubHeader = await FrameBoundExtension.createSubHeader({
                id: "subheader1",
                contentLeft: [
                    new Button({
                        text: "SubHeader ContentLeftBtn",
                        press: () => {
                            MessageToast.show("Press subheader1 contentLeft");
                        }
                    })
                ],
                contentMiddle: [
                    new Button({
                        text: "SubHeader contentMiddleBtn",
                        press: () => {
                            MessageToast.show("Press subheader1 contentMiddle");
                        }
                    })
                ],
                contentRight: [
                    new Button({
                        text: "SubHeader contentRightBtn",
                        press: () => {
                            MessageToast.show("Press subheader1 contentRight");
                        }
                    })
                ]
            }, {
                controlType: "sap.m.Bar"
            });
            SubHeader.showOnHome();
        }
    };
});
