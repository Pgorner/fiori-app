// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/Router",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (Log, UIComponent, Router, JSONModel, Container) {
    "use strict";

    // new Component
    return UIComponent.extend("sap.ushell.demo.AppNavSample.Component", {
        metadata: { manifest: "json" },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCANService) {
                    return oCANService.getDistinctSemanticObjects().done(function (aSO) {
                        this.setModel(new JSONModel({
                            suggestions: aSO.map(function (sSO) {
                                return { name: sSO };
                            })
                        }), "SOmodel");
                    }.bind(this));
                }.bind(this));

            /* Nav (1) declare a route config  */
            /* this example separate the actual view management from the route dispatch */
            /* we only specify route names and encoding here
             * we do not specify view names or model bindings
             */
            /* Nav (2) and construct the router instance */
            this.oRouter = new Router([{
                /* we encode the viewname in the path */
                pattern: "{viewName}/",
                name: "toaView" // name of the single route
            }, {
                /* we encode the viewname in the path */
                pattern: ":all*:", // catchall
                name: "_home" // name of the single route
            }]);
            this.oRouter.register("sap.ushell.demo.AppNavSample"); // unique name of router (!)
            this.oRouter.initialize(); // router initialization must be done after view construction

            /* StartupParameters (2) */
            /* http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#Action-toappnavsample?AAA=BBB&DEF=HIJ */
            /* results in { AAA: ["BBB"], DEF: ["HIJ"] }  */
            var oComponentData = this.getComponentData && this.getComponentData();
            var oUserDefaultsData = {
                firstName: "",
                lastName: "",
                communityActivityLow: 0,
                communityActivityHigh: 0
            };

            if (oComponentData && oComponentData.startupParameters) {
                if (oComponentData.startupParameters.FirstName) {
                    oUserDefaultsData.firstName = oComponentData.startupParameters.FirstName[0];
                }
                if (oComponentData.startupParameters.LastName) {
                    oUserDefaultsData.lastName = oComponentData.startupParameters.LastName[0];
                }
            }

            Log.info("sap.ushell.demo.AppNavSample: app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));

            this.rootControlLoaded().then(function (view) {
                var oStartupData = this.createStartupParametersData(oComponentData && oComponentData.startupParameters || {});

                view.setModel(new JSONModel(oUserDefaultsData), "UserDefaults");
                view.setModel(new JSONModel(oStartupData), "startupParameters");
                view.setModel(new JSONModel({ appstate: " no app state " }), "AppState");

                Container.getServiceAsync("CrossApplicationNavigation")
                    .then(function (oCAN) {
                        return oCAN.getStartupAppState(this);
                    }.bind(this)).then(function (oAppState) {
                        var oAppStateData = oAppState.getData(),
                            oUserDefaultsModel = view.getModel("UserDefaults"),
                            oModelData = { parameters: [] };

                        if ((typeof oAppStateData === "object") && oAppStateData.selectionVariant && oAppStateData.selectionVariant.SelectOptions) {
                            for (var j = 0; j < oAppStateData.selectionVariant.SelectOptions.length; j++) {
                                if (oAppStateData.selectionVariant.SelectOptions[j].PropertyName === "CommunityActivity") {
                                    oUserDefaultsModel.setProperty("/communityActivityLow", parseInt(oAppStateData.selectionVariant.SelectOptions[j].Ranges[0].Low, 10));
                                    oUserDefaultsModel.setProperty("/communityActivityHigh", parseInt(oAppStateData.selectionVariant.SelectOptions[j].Ranges[0].High, 10));
                                    oUserDefaultsModel.refresh(true);
                                }
                            }
                        }
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

        // important: override the standard method in UIComponent
        getRouter: function () {
            return this.oRouter;
        },

        /**
         * if a component implements this method, the Unified shell will invoke it during creation.
         * and, depending on the result proceed as follows:
         *
         * @returns {Promise<string> | undefined}
         *   returns undefined, if the component is handled normally and the component is put into the container.
         *   returns a promise, if it is not yet turned visible,
         *   when the promise is rejected, it is then turned visible.
         *   when the promise is successful, it returns a new shell (internal) shell hash to which the
         *   FLP navigates.
         *
         *   The whole navigation process in the promise success case appears like one navigation
         */
        navigationRedirect: function () {
            var oComponentData = this.getComponentData();
            var oStartupParameters = oComponentData && oComponentData.startupParameters;
            var sRedirectHash = oStartupParameters.redirectIntent && oStartupParameters.redirectIntent[0];
            var sTimeout = (oStartupParameters.redirectDelay && oStartupParameters.redirectDelay[0]) || "500";

            var iTimeout = 500;
            try {
                iTimeout = Number.parseInt(sTimeout, 10);
            } catch (e) {
                // do nothing
            }

            if (sRedirectHash) {
                return new Promise(function (resolve, reject) {
                    if (sRedirectHash.indexOf("#") === 0) {
                        setTimeout(function () {
                            resolve(sRedirectHash);
                        }, iTimeout);
                    } else {
                        setTimeout(reject, iTimeout);
                    }
                });
            }
            return undefined;
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

        suspend: function () {
            Log.info("suspend was called", null, "sap.ushell.demo.AppNavSample.Component");
        },

        restore: function () {
            Log.info("restore was called", null, "sap.ushell.demo.AppNavSample.Component");
        },

        exit: function () {
            Log.error("sap.ushell.demo.AppNavSample: Component.js exit called : this.getId():" + this.getId());
        }
    });
});
