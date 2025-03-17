// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (Log, UIComponent, JSONModel, Container) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.CrossAppStateSample.Component", {
        metadata: {
            library: "sap.ushell.demo.CrossAppStateSample",
            version: "1.132.1",
            includes: [ "css/style.css" ],
            dependencies: {
                libs: [ "sap.m" ],
                components: []
            },
            config: {
                title: "Application state sample",
                icon: "sap-icon://Fiori2/F0002",
                favIcon: "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0002_My_Accounts.ico",
                homeScreenIconPhone: "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/57_iPhone_Desktop_Launch.png",
                "homeScreenIconPhone@2": "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/114_iPhone-Retina_Web_Clip.png",
                homeScreenIconTablet: "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/72_iPad_Desktop_Launch.png",
                "homeScreenIconTablet@2": "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/144_iPad_Retina_Web_Clip.png"
            },
            routing: {
                config: {
                    viewType: "XML",
                    viewPath: "", // leave empty, common prefix
                    targetControl: "app",
                    clearTarget: false
                },
                routes: [
                    {
                        pattern: "ShowMain", // will be the url and from has to be provided in the data
                        view: "sap.ushell.demo.CrossAppStateSample.Main",
                        name: "toMain" // name used for listening or navigating to this route
                    }
                ]
            },
            rootView: {
                viewName: "sap.ushell.demo.CrossAppStateSample.Main",
                type: "XML",
                async: true
            }
        },
        /**
         * Move application state data into the model.
         * This is called on startup of the application
         * for sap-xapp-state passed data.
         *
         * @param {object} oModel
         *   Model which should be used to allocate the data from oAppState
         * @param {object} oAppState
         *   AppState including the data
         * @param {string} sComment
         *   Comment for logging purposes
         * @returns {boolean}
         *   Returns true if data of the AppState has been set to the model
         *
         * @private
         */
        updateModelFromAppstate: function (oModel, oAppState, sComment) {
            var oData = oAppState.getData();
            if (oData && (JSON.stringify(oData) !== JSON.stringify(oModel.getProperty("/appState"))) && oModel) {
                Log.info(sComment);
                oModel.setProperty("/appState", oData);
                return true;
            }
            return false;
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments); //triggers createContent and by that initializes controllers that are mentioned there
            Log.setLevel(Log.Level.INFO);
            // we create and register models prior to the createContent method invocation
            // note that actual population with model data is performed later
            this.oAppStateModel = new JSONModel({
                appState: {
                    filter: "",
                    CollectionName: "no collection name yet"
                }
            });
            this.setModel(this.oAppStateModel, "AppState");
            this.getRouter().initialize();
            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCANService) {
                    return oCANService.getStartupAppState(this);
                }.bind(this))
                .then(function (oStartupAppStateContainer) {
                    this.updateModelFromAppstate(this.oAppStateModel, oStartupAppStateContainer, "Setting values for CrossAppState of CrossAppStateSample Application");
                }.bind(this));
        }
    });
});
