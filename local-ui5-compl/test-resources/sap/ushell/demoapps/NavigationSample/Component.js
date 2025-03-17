// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (UIComponent, JSONModel, Container) {
    "use strict";

    // new Component
    return UIComponent.extend("sap.ushell.demo.NavigationSample.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },


        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            // this component should automatically initialize the router!
            this.getRouter().initialize();

            // trigger direct inner-app navigation if intent parameter navTo set
            // we use this for testing the correct stopping of the previous app's
            // router upon cross-app navigation
            var oStartupParameters = this.getComponentData().startupParameters,
                sNavTo = oStartupParameters && oStartupParameters.navTo && oStartupParameters.navTo[0];

            if (sNavTo) {
                this.getRouter().navTo(sNavTo, null, true);
            }

            /* StartupParameters (2) */
            /* http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#Action-toappnavsample?AAA=BBB&DEF=HIJ */
            /* results in { AAA: ["BBB"], DEF: ["HIJ"] }  */
            var oComponentData = this.getComponentData && this.getComponentData();

            this.rootControlLoaded().then(function (view) {
                var oStartupData = this.createStartupParametersData(oComponentData && oComponentData.startupParameters || {});


                view.setModel(new JSONModel(oStartupData), "startupParameters");
                view.setModel(new JSONModel({ appstate: " no app state " }), "AppState");

                Container.getServiceAsync("CrossApplicationNavigation")
                    .then(function (oCAN) {
                        return oCAN.getStartupAppState(this);
                    }.bind(this)).then(function (oAppState) {
                        var oAppStateData = oAppState.getData(),
                            oModelData = { parameters: [] };

                        oModelData.stringifiedAppstate = JSON.stringify(oAppState.getData() || " no app state ");
                        oModelData.appStateKey = oAppState.getKey();

                        // array or object
                        if (typeof oAppStateData === "object") {
                            Object.keys(oAppStateData).forEach(function (sParamName) {
                                oModelData.parameters.push({ name: sParamName, value: JSON.stringify(oAppStateData[sParamName]) });
                            });
                        }
                        view.getModel("AppState").setProperty("/appstate", oModelData);
                    });
            }.bind(this));

        },

        createStartupParametersData: function (oComponentData) {
            // convert the raw componentData into a model that is consumed by the UI
            return {
                parameters: Object.keys(oComponentData).map(function (key) {
                    if (key === "CRASHME") {
                        throw new Error("Deliberately crashed on startup");
                    }
                    return {
                        key: key,
                        value: oComponentData[key].toString()
                    };
                })
            };
        },

        getAutoPrefixId: function () {
            return true;
        }

    });
});
