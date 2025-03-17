// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/library",
    "sap/ushell/Container"
], function (Controller, mobileLibrary, Container) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    var sXKey;
    var sIKey;

    return Controller.extend("sap.ushell.demo.bookmarkstate.bookmark", {
        onInit: function () {
            var oView = this.getView();
            oView.byId("txtXAppState").setValue("{\"a\":1, \"b\":2, \"c\":3, \"d\":4}");
            oView.byId("txtIAppState").setValue("This is a dummy state string");

            sXKey = undefined;
            sIKey = undefined;

            var sHash = window.hasher && window.hasher.getHash();
            if (sHash && sHash.length > 0 && sHash.indexOf("sap-xapp-state=") > 0) {
                var aParams = /(?:sap-xapp-state=)([^&/]+)/.exec(sHash);
                if (aParams && aParams.length === 2) {
                    sXKey = aParams[1];
                }
                aParams = /(?:sap-iapp-state=)([^&/]+)/.exec(sHash);
                if (aParams && aParams.length === 2) {
                    sIKey = aParams[1];
                }
            }

            this._loadStateData();
        },

        onCreateNewStateTransient: function () {
            this.onCreateNewState(true);
        },

        onCreateNewStatePersistent: function () {
            this.onCreateNewState(false);
        },

        onUpdateStateTransient: function () {
            this.onUpdateState(true);
        },

        onUpdateStatePersistent: function () {
            this.onUpdateState(false);
        },

        onCreateNewState: function (bTransient) {
            Container.getServiceAsync("AppState").then(function (oService) {
                var oView = this.getView();

                var oState = oService.createEmptyAppState(undefined, bTransient);
                oState.setData(oView.byId("txtXAppState").getValue());
                oState.save();
                sXKey = oState.getKey();
                oState = oService.createEmptyAppState(undefined, bTransient);
                oState.setData(oView.byId("txtIAppState").getValue());
                oState.save();
                sIKey = oState.getKey();

                var sHash = window.hasher.getHash().split("&/")[0];
                sHash += "&/sap-xapp-state=" + sXKey + "/sap-iapp-state=" + sIKey;
                window.hasher.replaceHash(sHash);
            }.bind(this));
        },

        onUpdateState: function (bTransient) {
            Container.getServiceAsync("AppState").then(function (oService) {
                var oView = this.getView();

                if (sXKey) {
                    Promise.all([
                        oService.getAppState(sXKey),
                        oService.getAppState(sIKey)
                    ]).then(function (values) {
                        var oXState = values[0];
                        var oIState = values[1];
                        var oNewXState = oService.createEmptyAppState(undefined, bTransient);
                        var oNewIState = oService.createEmptyAppState(undefined, bTransient);

                        oNewXState._sKey = oXState._sKey;
                        oNewXState._iPersistencyMethod = "PersonalState";
                        oNewXState._oPersistencySettings = undefined;
                        oNewXState.setData(oView.byId("txtXAppState").getValue());
                        oNewXState.save();

                        oNewIState._sKey = oIState._sKey;
                        oNewIState._iPersistencyMethod = "PersonalState";
                        oNewIState._oPersistencySettings = undefined;
                        oNewIState.setData(oView.byId("txtIAppState").getValue());
                        oNewIState.save();
                    });
                } else {
                    this.onCreateNewState(bTransient);
                }
            }.bind(this));
        },

        onLoadStateData: function () {
            this._showStateDataInCtrl(sXKey, "txtXAppStateRead");
            this._showStateDataInCtrl(sIKey, "txtIAppStateRead");
        },

        onDeleteStateData: function () {
            if (sXKey) {
                Container.getServiceAsync("AppState").then(function (oService) {
                    Promise.all([
                        oService.deleteAppState(sXKey),
                        oService.deleteAppState(sIKey)
                    ]).then(function () {
                        this._loadStateData().then(function () {
                            sXKey = undefined;
                            sIKey = undefined;
                            window.hasher.replaceHash(window.hasher.getHash().split("&/")[0]);
                        });
                    }.bind(this));
                }.bind(this));
            }
        },

        _loadStateData: function () {
            return Promise.all([
                this._showStateDataInCtrl(sXKey, "txtXAppStateRead"),
                this._showStateDataInCtrl(sIKey, "txtIAppStateRead")
            ]);
        },

        _showStateDataInCtrl: function (sKey, sCtrlId) {
            return new Promise(function (resolve) {
                var oView = this.getView();
                var oEditCtrl = oView.byId(sCtrlId);

                if (sKey) {
                    Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                        oService.getAppStateData(sKey).then(function (sValue) {
                            if (sValue === undefined) {
                                oEditCtrl.setValue("[ERROR] no value found for state key " + sKey);
                            } else if (typeof sValue === "string") {
                                oEditCtrl.setValue(sValue);
                            } else {
                                try {
                                    oEditCtrl.setValue(JSON.stringify(sValue));
                                } catch (oError) {
                                    oEditCtrl.setValue("[ERROR] value of state key " + sKey + " could not be converted to string");
                                }
                            }
                            resolve();
                        });
                    });
                } else {
                    oEditCtrl.setValue("[INFO] state key found in URL");
                    resolve();
                }
            }.bind(this));
        },

        sendAsEmailS4: function () {
            URLHelper.triggerEmail(null, "This is the email of FLP", document.URL);
        },

        openThemeManager: function () {
            var sMsgValue = "{\"type\":\"request\",\"service\":\"sap.ushell.services.UserInfo.openThemeManager\",\"body\":{},\"request_id\":\"SAPUI5_ISOLATION_MSGID_1\"}";
            window.parent.postMessage(sMsgValue, "*");
        }
    });
});
