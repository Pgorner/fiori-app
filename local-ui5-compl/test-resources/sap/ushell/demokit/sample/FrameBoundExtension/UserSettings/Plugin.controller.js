// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ushell/Container",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (
    MessageToast,
    Container,
    Fragment,
    JSONModel
) {
    "use strict";

    return {
        runCode: async function () {
            const FrameBoundExtension = await Container.getServiceAsync("FrameBoundExtension");

            let bStoredValue = false;
            const oModel = new JSONModel({ someSettingState: bStoredValue });

            FrameBoundExtension.addUserSettingsEntry({
                id: "myEntry-01",
                entryHelpID: "myEntry-01-help-id",
                title: "My Entry Title",
                icon: "sap-icon://e-care",

                value: function () {
                    return new Promise((resolve) => {
                        resolve("some subTitle 01");
                    });
                },

                content: function () {
                    return Fragment.load({
                        id: "entry01",
                        name: "sap.ushell.sample.FrameBoundExtension.UserSettings.CustomSettingsEntry"
                    }).then(function (oFragment) {
                        oFragment.setModel(oModel, "config");
                        return oFragment;
                    });
                },

                onSave: function () {
                    MessageToast.show("Changes in entry01 have been saved.");

                    // Note that the setting should be saved on the server, so a reload does not lose it.
                    bStoredValue = oModel.getProperty("/someSettingState");
                    return Promise.resolve();

                },
                onCancel: function () {
                    MessageToast.show("Changes in entry01 have been reset.");
                    oModel.setProperty("/someSettingState", bStoredValue);
                },

                provideEmptyWrapper: false
            });
        }
    };
});
