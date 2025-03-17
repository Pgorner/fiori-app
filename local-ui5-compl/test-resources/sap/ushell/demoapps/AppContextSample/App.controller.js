// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Sample app to demo the inner app state.
 *
 * Note:
 * (1)
 * This app, as of 11-2021, is not covered by catalog <code>/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK</code>
 * as other demo apps are and therefore cannot be called with the FLP standard demo role.
 *
 * However, for a test it can be operated in the <code>fioriSandbox.html</code> using the FLP reverse proxy
 * as a local server via URL
 * <code>http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html?#Shell-home<code>
 *
 * (2)
 * All in all the app, as of 11-2021, seems not to work as expected.
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Component",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/model/json/JSONModel",
    "sap/base/Log",
    "sap/ushell/Container"
], function (Controller, Component, HashChanger, JSONModel, Log, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppContextSample.App", {
        getComponent: function () {
            var sComponentId = Component.getOwnerIdFor(this.getView());
            return Component.getComponentById(sComponentId);
        },

        onInit: function () {
            // Read potentially existing personalization favorites.
            var sInnerAppStateKey = "";
            var myComponent;
            this.sKeyPrefix = "/UI2/USHELL/AppCSmp";
            // standard pattern to obtain the enclosing component
            myComponent = this.getComponent();
            // set received parameter state
            this.initFruitFavorites(myComponent);

            // restore an Inner App State, if present
            sInnerAppStateKey = this.getInnerAppStateKey();
            this.restoreAppState(sInnerAppStateKey); // hashkey

            // below, we document two distinct models for the state
            // model a) on every state change, we generate a *new* uid and alter the links
            //        (this is used for the app state which is passed to the next app!
            //         compare the makeURL method,
            //         note that there is a slight latency as the model update is only performed after the new container has been obtained
            //         (asynchronously)
            //
            // model b) we generate one uid per app invocation, keep it stable during app runtime
            //          and change the context underneath

            // preparing passing app context:
            // -> we generate urls in a model
            // the link tags are bound to the model

            this.oURLModel = new JSONModel({ toApp_href: "<dummy>" });
            this.makeURLModel(""); // update model with empty key!
            this.getView().setModel(this.oURLModel);

            // model b), our unique app context key
            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCrossAppService) {
                    return oCrossAppService.createEmptyAppStateAsync(this.getComponent());
                }.bind(this))
                .then(function (oAppStateContainer) {
                    this.oAppContext = oAppStateContainer;
                    this.sOurAppInstanceContextKey = this.oAppContext.getKey();
                    HashChanger.getInstance().replaceHash("/key/" + this.sOurAppInstanceContextKey);
                    this.onSelectedFruitChanged();
                }.bind(this));
        },

        getInnerAppStateKey: function () {
            var sHash = HashChanger.getInstance().getHash();
            var res;
            if (sHash && sHash.match("/key/(.*)")) {
                res = new RegExp("/key/(.*)").exec(sHash);
                return res[1];
            }
            return "";
        },

        makeURLModel: function (sKey) {
            // shell compliant cross application navigation link generation
            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCrossAppService) {
                    return oCrossAppService.hrefForExternalAsync({
                        target: {
                            semanticObject: "Action",
                            action: "toappcontextsample"
                        },
                        appStateKey: sKey
                    });
                })
                .then(function (sToOurApp) {
                    this.oURLModel.setData({ toApp_href: sToOurApp });
                }.bind(this))
                .catch(function () {
                    this.oURLModel.setData({ toApp_href: "" });
                }.bind(this));
        },

        generateId: function () {
            return String(Number(new Date())) + this.createId("ctx");
        },

        // received context (if any)
        initFruitFavorites: function (oComponent) {
            var i;
            var that = this;
            var aPanelMilkshakeFavorites = that.getView().byId("PanelFruitFavorites").getContent();
            for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                aPanelMilkshakeFavorites[i].setEnabled(false);
            }
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossAppService) {
                oCrossAppService.getStartupAppState(oComponent).done(
                    function (oContainer) {
                        that.transferAppStateToPanel(oContainer, "PanelFruitFavorites", "Fruits");
                    }
                );
            });
        },

        restoreAppState: function (sKey) {
            var that = this;
            var i, aPanelMilkshakeFavorites;
            this.disableInput("PanelSelectedFruitFavorites");
            this.disableInput("PanelMilkshakeFavorites");
            // restore an old state
            aPanelMilkshakeFavorites = that.getView().byId("PanelMilkshakeFavorites").getContent();
            for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                //aPanelMilkshakeFavorites[i].setSelected(that.oIceCreamContainer.getItemValue(aPanelMilkshakeFavorites[i].getId()) || false);
                aPanelMilkshakeFavorites[i].setEnabled(false);
            }
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossAppService) {
                oCrossAppService.getAppState(that.getComponent(), sKey)
                    .done(function (oContainer) {
                        that.disableInput("PanelSelectedFruitFavorites", true);
                        that.disableInput("PanelMilkshakeFavorites", true);
                        that.transferAppStateToPanel(oContainer, "PanelSelectedFruitFavorites", "Fruits");
                        that.transferAppStateToPanel(oContainer, "PanelMilkshakeFavorites", "Milkshakes");
                    });
            });
        },

        transferContainerToPanel: function (oContainer, sPanel, sItemPrefix) {
            var i, val;
            var aPanel = this.getView().byId(sPanel).getContent();
            for (i = 0; i < aPanel.length; i = i + 1) {
                val = (oContainer && oContainer.getItemValue(sItemPrefix + String(i))) || false;
                aPanel[i].setSelected(val);
            }
        },

        transferPanelToContainer: function (oContainer, sPanel, sItemPrefix) {
            // the button is only available if we have loaded the data
            var aPanel = this.getView().byId(sPanel).getContent();
            var i;
            for (i = 0; i < aPanel.length; i = i + 1) {
                oContainer.setItemValue(sItemPrefix + String(i), aPanel[i].getSelected());
            }
            // not saved yet!
        },

        transferAppStateToPanel: function (oContainer, sPanel, sItemPrefix) {
            var i, val;
            var aPanel = this.getView().byId(sPanel).getContent();
            for (i = 0; i < aPanel.length; i = i + 1) {
                val = (oContainer && oContainer.getData() && oContainer.getData()[sItemPrefix + String(i)]) || false;
                aPanel[i].setSelected(val);
            }
        },

        transferPanelToAppState: function (oContainer, sPanel, sItemPrefix) {
            // the button is only available if we have loaded the data
            var aPanel = this.getView().byId(sPanel).getContent();
            var i, o;
            o = oContainer.getData() || {};
            for (i = 0; i < aPanel.length; i = i + 1) {
                o[sItemPrefix + String(i)] = aPanel[i].getSelected();
            }
            oContainer.setData(o);
            // not saved yet!
        },

        disableInput: function (sPanel, boolNewState) {
            var i;
            var aPanel = this.getView().byId(sPanel).getContent();
            boolNewState = boolNewState || false;
            for (i = 0; i < aPanel.length; i = i + 1) {
                aPanel[i].setEnabled(boolNewState);
            }
        },

        /**
         * Gets the favorites from browser storage
         */
        applyExistingFruitFavorites: function () {
            this.oPersonalizer
                .getPersData()
                .done(this.onFruitFavoritesRead.bind(this))
                .fail(
                    function () {
                        Log.error("Reading personalization data failed.");
                    }
                );
        },

        /**
         * Called when "Save ice cream favorites is changed
         */
        onMilkshakeChanged: function () {
            this.transferPanelToAppState(this.oAppContext, "PanelMilkshakeFavorites", "Milkshakes");
            this.oAppContext.save();
        },

        onSelectedFruitChanged: function () {
            this.transferPanelToAppState(this.oAppContext, "PanelSelectedFruitFavorites", "Fruits"); // update app context
            this.oAppContext.save();
            this.updateURLTargets();
        },

        updateURLTargets: function () {
            // generate a new uid
            var oComponent = this.getComponent();

            // create new context and transfer the state
            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCrossAppService) {
                    return oCrossAppService.createEmptyAppStateAsync(oComponent);
                })
                .then(function (oAppStateContainer) {
                    this.transferPanelToAppState(oAppStateContainer, "PanelSelectedFruitFavorites", "Fruits"); // update app context
                    this.makeURLModel(oAppStateContainer.getKey());
                    oAppStateContainer.save();
                }.bind(this));
        },

        onDestroy: function () {
        }
    });
});
