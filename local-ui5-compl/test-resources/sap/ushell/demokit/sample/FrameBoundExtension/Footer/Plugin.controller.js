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

            await FrameBoundExtension.createFooter({
                id: "footer1",
                contentLeft: [
                    new Button({
                        text: "Footer contentLeftBtn",
                        press: () => {
                            MessageToast.show("Press footer1 contentLeft");
                        }
                    })
                ],
                contentMiddle: [
                    new Button({
                        text: "Footer contentMiddleBtn",
                        press: () => {
                            MessageToast.show("Press footer1 contentMiddle");
                        }
                    })
                ],
                contentRight: [
                    new Button({
                        text: "Footer contentRightBtn",
                        press: () => {
                            MessageToast.show("Press footer1 contentRight");
                        }
                    })
                ]
            });
        }
    };
});
