// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ui/core/IconPool",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    Log,
    ObjectPath,
    IconPool,
    UIComponent,
    JSONModel,
    jQuery,
    Container
) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.AppStateSample.Component", {
        metadata: {
            manifest: "json"
        },

        // To implement autoprefixing, overwrite the getAutoPrefixId() method with {return true}
        getAutoPrefixId: function () {
            return true;
        },

        /**
         * Extract an inner AppState key from a present route
         *
         * @param {string} sInnerAppStateKey
         *   The InnerAppStateKey of Application
         * @param {string} sCurrentRouteName
         *   The currently route name e.g. "toCatIcons"
         *
         * @private
         */
        extractInnerAppStateFromURL: function (sInnerAppStateKey, sCurrentRouteName) {
            // if the key is distinct from our (new instantiation key), it must be an old
            // "old" (= initial) key passed to us
            if (sInnerAppStateKey === this.getInnerAppStateKey()) {
                this.oInnerAppStatePromise.resolve(sCurrentRouteName);
                return;
            }
            // we have a distinct appstate key -> generate a new model
            this.createANewAppStateModel();
            // we must apply the inner App State *after* treating CrossAppState (x-app-state)
            Log.info("applying inner app state " + sInnerAppStateKey + " in instance #" + this.INSTANCECOUNTER);
            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCANService) {
                    return oCANService.getAppState(this, sInnerAppStateKey);
                }.bind(this))
                .then(function (oStartupInnerAppState) {
                    this.updateModelFromAppstate(this.oAppStateModel, oStartupInnerAppState, "Setting filter value from InnerAppState");
                    this.oInnerAppStatePromise.resolve(sCurrentRouteName);
                }.bind(this));
            this.oInnerAppStatePromise.done(function () {
                this.setInnerAppStateIntoInnerAppHash(sCurrentRouteName);
            }.bind(this));
        },

        getInnerAppStateKey: function () {
            return (this.oAppState && this.oAppState.getKey()) || " key not set yet ";
        },

        /**
         * Move application state data into the model.
         * This is called on startup of the application
         * for sap-xapp-state passed data and sap-iapp-state passed data.
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
                Log.info(sComment + " in instance #" + this.INSTANCECOUNTER);
                oModel.setProperty("/appState", oData);
                return true;
            }
            return false;
        },
        /**
         * Update the application state with the current application data that is called on any model change
         *
         * @private
         */
        updateAppStateFromAppStateModel: function () {
            this.oAppState.setData(this.oAppStateModel.getProperty("/appState"));
            this.oAppState.save().fail(function () {
                Log.error("saving of application state failed");
            });
        },

        /**
         * Marks the component in case of initialization issues will happen
         *
         * @private
         */
        markOurComponent: function () {
            // don't use this in productive coding, global static!
            var oAppStateSampleComponent = ObjectPath.create("sap.ushell.demo.AppStateSample.Component");
            oAppStateSampleComponent.INSTANCECOUNTER = (oAppStateSampleComponent.INSTANCECOUNTER || 0) + 1;
            this.INSTANCECOUNTER = oAppStateSampleComponent.INSTANCECOUNTER;
        },

        /**
         * Creates a new AppState and calculate links for the bottom section of List.controller.js
         *
         * @private
         */
        createANewAppStateModel: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                // create a new Application state (this.oAppState) for this Application instance
                this.oAppState = oCANService.createEmptyAppState(this);
                // now that we know the key, we can calculate the CrossApplication links
                this.calculateCrossAppLinks(oCANService); // we recalculate the model as the links are updated
                Log.info("Create a new appstate model " + this.oAppState.getKey() + " in instance #" + this.INSTANCECOUNTER);
            }.bind(this));
        },

        /**
         * Initialization phase of component
         *
         * @private
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments); // invokes createContent of Component
            // and thus creation of the child tree

            this.markOurComponent();

            // Model creation
            // we create and register models prior to the createContent method invocation
            // note that actual population with model data is performed later
            this.oAppStateModel = new JSONModel({
                appState: {
                    filter: "",
                    CollectionName: (IconPool.getIconCollectionNames())[0] || "no collection name"
                }
            });
            this.setModel(this.oAppStateModel, "AppState");

            // create a model containing the generated links for cross application navigation in our model
            // we use the Application state key to pass information to the called applications
            // the actual links of the model are filled below, using the application state key
            this.oNavTargetsModel = new JSONModel({ toOurAppWithState: "", toOurAppNoState: "" });
            this.setModel(this.oNavTargetsModel, "navTargets");

            this.oInnerAppStatePromise = new jQuery.Deferred(); // Done when above and startup InnerAppState transferred into the model

            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCANService) {
                    // create a new Application state (this.oAppState) for this Application instance
                    this.oAppState = oCANService.createEmptyAppState(this);

                    // now that we know the key, we can calculate the CrossApplication links
                    this.calculateCrossAppLinks(oCANService); // because we have the same key for the whole session we need to initialize it only once

                    return oCANService.getStartupAppState(this);
                }.bind(this))
                .then(function (oStartupCrossAppState) {
                    this.updateModelFromAppstate(this.oAppStateModel, oStartupCrossAppState, "Set Model from StartupAppState");
                }.bind(this));

            Log.info("Router initialized for instance #" + this.INSTANCECOUNTER);

            this.getRouter().initialize();
            this.getRouter().getRoute("toCatIcons").attachMatched(function (oEvt) {
                this.extractInnerAppStateFromURL(oEvt.getParameter("arguments").iAppState, oEvt.getParameter("name"));
            }.bind(this));

            // register a handler to set the current InnerAppStateKey into the inner-app-hash
            // (via a navigation to the "same/inital" route but with a different inner-app-state)
            // This must be done *after* we have processed a potential inner app state from initial invocation (thus the promise)
            this.oInnerAppStatePromise.done(function (sInitialRouteName) {
                //saving data on the current application state after it has been initialized by the "passed" application state
                //to assure that even in case user has not changed anything newly created application state is saved in the backend
                this.updateAppStateFromAppStateModel();

                // register an event handler on the model, to track future changes
                this.oAppStateModel.bindTree("/").attachChange(function () {
                    this.updateAppStateFromAppStateModel();
                }.bind(this));
            }.bind(this));
        },

        setInnerAppStateIntoInnerAppHash: function (sInitialRouteName) {
            // we have to set a current route, if there is no correct inner app state key in the url
            if (sInitialRouteName === "catchall") {
                sInitialRouteName = "toCatIcons";
            }
            // A previous application is still active while the new application is started,
            // the old application will "see" the hash-change too, and attempt to react on it, as the hashchanger is a global entity.
            // Applications are thus advised not to trigger a navto synchronously!
            //
            setTimeout(function () {
                Log.info("Setting inner app hash " + this.getInnerAppStateKey() + " in URL in instance #" + this.INSTANCECOUNTER);
                this.navTo(sInitialRouteName, true);
            }.bind(this), 0); //400
        },

        // calculate links for cross application navigation targets
        calculateCrossAppLinks: function (oCANService) {
            this.oNavTargetsModel.setProperty("/toOurAppWithState", oCANService.hrefForExternal({
                target: {
                    semanticObject: "Action",
                    action: "toappstatesample"
                },
                params: { zdate: Number(new Date()) }, // assures distinct, not relevant for functionality!
                appStateKey: this.oAppState.getKey() //<<< pass x-app state!
            }, this) || "");

            // 2nd link, no app state transferred
            this.oNavTargetsModel.setProperty("/toOurAppNoState", oCANService.hrefForExternal({
                target: {
                    semanticObject: "Action",
                    action: "toappstatesample"
                },
                params: { date: Number(new Date()) } // assures distinct
            }, this) || "");

            this.oNavTargetsModel.setProperty("/toCrossAppWithState", oCANService.hrefForExternal({
                target: {
                    semanticObject: "Action",
                    action: "tocrossappstatesample"
                },
                params: { date: Number(new Date()) }, // assures distinct
                appStateKey: this.oAppState.getKey() // pass x-app state to external app!
            }, this) || "");
        },

        // note how this central navTo route takes care of setting the current inner app state key correctly
        navTo: function (sRouteName, noHistory) {
            Log.info("NavTo " + sRouteName + "with AppStateKey" + this.getInnerAppStateKey() + " in URL in instance #" + this.INSTANCECOUNTER);
            if (this.getRouter()) {
                this.getRouter().navTo(sRouteName, { iAppState: this.getInnerAppStateKey() }, noHistory);
            }
        }
    });
});
