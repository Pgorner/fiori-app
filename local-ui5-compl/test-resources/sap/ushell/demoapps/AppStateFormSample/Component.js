// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (Log, UIComponent, JSONModel, jQuery, Container) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.AppStateFormSample.Component", {
        metadata: {
            manifest: "json"
        },

        getAutoPrefixId: function () {
            return true;
        },

        // extract an inner AppState key from a present route
        setInnerAppState: function (sInnerAppStateKey, sCurrentRouteName) {
            this.sCurrentRouteName = sCurrentRouteName;
            // if the key is distinct from our (new instantiation key), it must be an old "old" (= initial) key passed to us
            if (sInnerAppStateKey === this.getInnerAppStateKey()) {
                this.oInnerAppStateKeyProcessed.resolve(sCurrentRouteName);
                return;
            }

            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCANService) {
                    return oCANService.getAppState(this, sInnerAppStateKey);
                }.bind(this))
                .then(function (oStartupInnerAppState) {
                    this.updateModelFromAppState(oStartupInnerAppState, "Setting filter value from InnerAppState");
                    this.oInnerAppStateKeyProcessed.resolve(sCurrentRouteName);
                }.bind(this));
            // on every initial start, we have to set the innerAppState key to our new key!
        },

        getInnerAppStateKey: function () {
            return (this.oAppStateContainer && this.oAppStateContainer.getKey()) || " key not set yet ";
        },

        /**
         * Moves application state data into the model.
         * This is called on startup of the application for an "sap-xapp-state" passed data and "sap-iapp-state" passed data.
         */
        updateModelFromAppState: function (oAppState, sComment) {
            var data = oAppState.getData();
            if (data) {
                this.inEvent = true;
                Log.error(sComment);
                this.oAppStateModel.setProperty("/appState", data || "");
                this.getEventBus().publish("sap.ushell.demoapps", "restoreUIState", {});
                this.inEvent = false;
            }
        },

        /**
         * Updates the application state container with the current application data.
         * This is called on any model change.
         */
        updateAppStateFromModelInitial: function () {
            this.oAppStateContainer.setData(this.oAppStateModel.getProperty("/appState"));
        },

        updateAppStateFromModel: function () {
            if (this.inEvent) {
                return;
            }

            this.inEvent = true;

            // push a history state; get the ui state!
            this.getEventBus().publish("sap.ushell.demoapps", "serializeUIState", {});

            // do we have a significant change?
            var oData = this.oAppStateModel.getProperty("/appState");
            var aUndoStack = this.oAppStateModel.getProperty("/appState/uiState/editForm/undoStack");
            if (JSON.stringify(this.oLastEditFormUndoRelevantData) === JSON.stringify(oData.chatList)) {
                // no relevant change
                this.inEvent = false;
                return;
            }
            // create a new container!
            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCANService) {
                    this.oAppStateContainer = oCANService.createEmptyAppState(this);
                    aUndoStack = this.oAppStateModel.getProperty("/appState/undoStack") || [];
                    aUndoStack.push(this.oAppStateContainer.getKey());
                    Log.error("pushing undo stack");
                    this.oAppStateModel.setProperty("/appState/uiState/editForm/undoStack", aUndoStack);
                    this.oAppStateModel.setProperty("/appState/uiState/editForm/undoStackPresent", true);
                    this.oLastEditFormUndoRelevantData = (oData.chatList === undefined) ? undefined : JSON.parse(JSON.stringify(oData.chatList));
                    this.oAppStateContainer.setData(oData);
                    this.oAppStateContainer.save();
                    this.calculateCrossAppLinks(oCANService);
                    this.inEvent = false;
                    this.updateHashInURL();
                }.bind(this));
        },

        updateHashInURL: function () {
            this.navTo(this.sCurrentRouteName);
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments); // invokes createContent of Component

            // Model creation
            // create and register models prior to the createContent method invocation; actual population with model data is performed later
            this.oAppStateModel = new JSONModel({
                appState: {
                    filter: "",
                    editEnabled: false,
                    undoStack: [],
                    focusInfo1: {},
                    focusInfo2: {},
                    chatList: [
                        { text: "What do we do?" },
                        { text: "Save the state before it's to late!" },
                        { text: "When do we save?" },
                        { text: "Always, always, on every state change!" },
                        { text: "" },
                        { text: "If it's worth asking the user, it's worth remembering." },
                        { text: "  Alan Cooper" }
                    ],
                    uiState: {
                        editForm: {
                            undoStack: [],
                            undoStackPresent: true,
                            chatList: {
                                focusInfos: [],
                                focusInfo: null
                            },
                            focusIndex: 1,
                            focusInfo: {}
                        }
                    },
                    editRecord: {
                        Key: "AKEY",
                        CollectionName: "Fury1",
                        id: "ABC",
                        name: "a name",
                        description: "a description",
                        semanticName: "a semantic name"
                    },
                    editForm: {
                        T01: "SAP UI5 is the new UI technology for SAP",
                        T02: "Fiori is T222 222"
                    }
                },
                other: { editButtonText: "Edit Icon" },
                pers: {
                    myicons: [
                        { Key: "ABC", CollectionName: "XXX", name: "aaaa", description: "jjjj" },
                        { Key: "HIJ", CollectionName: "XXX", name: "sss", description: "xxxxs" }
                    ]
                }
            });
            this.setModel(this.oAppStateModel, "AppState");

            // create a model containing the generated links for cross application navigation in our model;
            // we use the Application state key to pass information to the called applications;
            // the actual links of the model are filled below, using the application state key
            this.oNavTargetsModel = new JSONModel({ toOurAppWithState: "", toOurAppNoState: "" });
            this.setModel(this.oNavTargetsModel, "navTargets");

            this.oInnerAppStateKeyProcessed = new jQuery.Deferred();
            // execution order

            // oInnerAppStateKeyProcessed: done when above and innerAppStateKey processed

            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCANService) {
                    // create a new Application state (this.oAppStateContainer) for this Application instance

                    this.oAppStateContainer = oCANService.createEmptyAppState(this);
                    // now that we know the key, we can calculate the CrossApplication links
                    this.calculateCrossAppLinks(oCANService);

                    return oCANService.getStartupAppState(this);
                }.bind(this))
                .then(function (oStartupAppStateContainer) {
                    var fFilter = oStartupAppStateContainer.getData() && oStartupAppStateContainer.getData().filter;
                    this.oAppStateModel.setProperty("/appState/filter", fFilter || "");
                    this.oAppStateModelInitializationPromise.resolve();
                }.bind(this));

            // this component should automatically initialize the router!
            this.getRouter().initialize();

            this.getRouter().attachRouteMatched(function (oRoute, oArguments, oConfig, oControl, oView) {
                oArguments = oRoute.mParameters.arguments;
                oView = oRoute.mParameters.view;
                oConfig = oRoute.mParameters.config;
                oControl = oRoute.mParameters.targetControl;
                // AppState (1.1) Route handling extracts inner app state;
                // if further arguments are used, all arguments would have to be passed here to able to reconstruct the same route with a different iAppStateKey
                oView.oController.getMyComponent().setInnerAppState(oArguments.iAppState, oConfig.name);
                if (typeof oView.oController.setTab === "function") {
                    oView.oController.setTab(oConfig.name);
                }
                oControl.toDetail(oView.getId());
            });

            // registers a handler to set the current InnerAppStateKey into the inner-app-hash
            // (via a navigation to the "same/initial" route but with a different inner-app-state)
            // this must be done *after* we have processed a potential inner app state from initial invocation (thus the promise)
            this.oInnerAppStateKeyProcessed.done(function (sInitialRouteName) {
                // we have to set a current route, as there is no correct inner app state key in the url
                if (sInitialRouteName === "catchall") {
                    sInitialRouteName = "editForm";
                }
                // we must assure the current state is persisted at least once, even if no data is changed
                // TODO: check whether this can be avoided by properly timing the registration of the initial model update to avoid "double" initial update sometimes
                // that.updateAppStateFromModelInitial();

                // register an event handler on the model, to track future changes
                this.oAppStateModel.bindTree("/").attachChange(function () {
                    this.updateAppStateFromModel();
                });
                this.navTo(sInitialRouteName, true);
            }.bind(this));
            this.loadFromBackend();
        },

        loadFromBackend: function () {
            Container.getServiceAsync("Personalization")
                .then(function (oPersService) {
                    return oPersService.getContainer("sap.ushell.demo.AppStateForm", undefined, this);
                }.bind(this))
                .then(function (oContainer) {
                    var data = oContainer.getItemValue("myicons");
                    this.oPersContainer = oContainer;
                    this.getModel("AppState").setProperty("/pers/myicons", data);
                }.bind(this));
        },

        updateBackend: function () {
            var oMyIconList = this.getModel("AppState").getProperty("/pers/myicons");
            this.oPersContainer.setItemValue("myicons", oMyIconList);
            this.oPersContainer.save();
        },

        calculateCrossAppLinks: function (oCANService) {
            // calculate links for cross application navigation targets
            this.oNavTargetsModel.setProperty("/toOurAppWithState", oCANService.hrefForExternal({
                target: {
                    semanticObject: "Action",
                    action: "toappstatesample"
                },
                params: { zdate: Number(new Date()) }, // assures distinct
                appStateKey: this.oAppStateContainer.getKey() // pass x-app state!
            }, this) || "");

            // 2nd link, no app state transferred
            this.oNavTargetsModel.setProperty("/toOurAppNoState", oCANService.hrefForExternal({
                target: {
                    semanticObject: "Action",
                    action: "toappstatesample"
                },
                params: { date: Number(new Date()) } // assures distinct
                // appStateKey: this.oAppStateContainer.getKey() // example no state passed
            }, this) || "");
        },

        // this central navTo route takes care of setting the current inner app state key correctly
        navTo: function (sRouteName, noHistory) {
            this.getRouter().navTo(sRouteName, { iAppState: this.getInnerAppStateKey() }, noHistory);
        }
    });
});
