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
            const Extension = await Container.getServiceAsync("Extension");

            const UserAction = await Extension.createUserAction({
                id: "exampleButton",
                text: "Example Button",
                icon: "sap-icon://refresh",
                press: () => {
                    MessageToast.show("Example Button was pressed!");
                }
            }, {
                controlType: "sap.m.Button"
            });
            UserAction.showOnHome();
        }
    };
});
