// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/Container"
], function (
    Controller,
    Container
) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppInfoSample.Main", {
        onInit: function () {
            Container.getServiceAsync("AppLifeCycle").then((AppLifeCycle) => {
                AppLifeCycle.attachAppLoaded(this._setCustomAttributes, this);
            });
        },

        _setCustomAttributes: async function () {
            const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");
            // only set the custom attributes once
            AppLifeCycle.detachAppLoaded(this._setCustomAttributes, this);

            AppLifeCycle.setAppInfo({
                info: {
                    customProperties: {
                        "custom.info": {
                            showInAbout: true,
                            value: "Value #1",
                            label: "Label #1"
                        },
                        "custom.info.default": {
                            value: "Value #2",
                            label: "Label #2"
                        },
                        "custom.info.empty.value": {
                            label: "Label #3"
                        },
                        "custom.info.error": {
                            value: "Value #4"
                        },
                        "custom.info.hidden": {
                            showInAbout: false,
                            value: "Value #5",
                            label: "Label #5"
                        }
                    }
                }
            });
        }
    });
});
