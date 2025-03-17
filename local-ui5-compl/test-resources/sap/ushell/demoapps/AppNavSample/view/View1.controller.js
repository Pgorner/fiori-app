// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/util/Storage",
    "sap/ushell/Container"
], function (Log, Controller, JSONModel, Storage, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppNavSample.view.View1", {
        oApplication: null,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof view.Detail
         */
        onInit: function () {
            var oModelData;
            try {
                oModelData = JSON.parse(new Storage(Storage.Type.local).get("sap.ushell.AppNavSample.v1"));
            } catch (ex) {
                Log.debug(ex);
            }
            this.oModel = new JSONModel(oModelData || {
                SO: "Action",
                action: "toshowparameters",
                params: "A=B&C=D",
                addLongParams: false,
                appStateOn: false,
                appStateAsText: false,
                appStateText: "",
                P1: true,
                P2: false,
                P1New: false,
                PX: ""
            });
            this.getView().setModel(this.oModel, "v1");

            this.oModel2 = new JSONModel({
                textOK: "Success",
                tooltip: "Enter a valid json object",
                data: "",
                appStateAsSelectionVariant: false
            });
            this.getView().setModel(this.oModel2, "v2");

            // this.updateAppStateFromModelInitial();
            // register an event handler on the model, to track future changes
            this.oModel.bindTree("/").attachChange(function () {
                this.updateUrlFromModel();
                new Storage(Storage.Type.local).put("sap.ushell.AppNavSample.v1", JSON.stringify(this.oModel.getData()));
            }.bind(this));
            setTimeout(this.updateUrlFromModel.bind(this), 200);
        },

        updateUrlFromModel: function () {
            Container.getServiceAsync("URLParsing").then(function (oURLParsing) {
                var sSemanticObject = this.getView().getModel("v1").getProperty("/SO");
                var sAction = this.getView().getModel("v1").getProperty("/action");

                var oModel = this.getView().getModel("v1");
                var bAppStateOn = this.getView().getModel("v1").getProperty("/appStateOn");

                this.getView().getModel("v2").setProperty("/appStateAsSelectionVariant", bAppStateOn && !this.getView().getModel("v1").getProperty("/appStateAsText"));
                this.getView().getModel("v2").setProperty("/appStateAsTextOn", bAppStateOn && this.getView().getModel("v1").getProperty("/appStateAsText"));

                var sAppStateKey;

                if (bAppStateOn) {
                    Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                        var oAppState = oCANService.createEmptyAppState(this.getMyComponent());
                        var oAppStateData;

                        sAppStateKey = oAppState.getKey();

                        if (this.getView().getModel("v1").getProperty("/appStateAsText")) {
                            try {
                                oAppStateData = JSON.parse(oModel.getProperty("/appStateText"));
                                this.getView().getModel("v2").setProperty("/textOK", "Success");
                                this.getView().getModel("v2").setProperty("/tooltip", "");
                            } catch (ex) {
                                this.getView().getModel("v2").setProperty("/textOK", "Error");
                                this.getView().getModel("v2").setProperty("/tooltip", ex.toString());
                            }
                        } else {
                            oAppStateData = { selectionVariant: { SelectOptions: [] } };
                            if (oModel.getProperty("/P1")) {
                                oAppStateData.selectionVariant.SelectOptions.push({
                                    PropertyName: "P1",
                                    Ranges: [{
                                        Sign: "I",
                                        Option: "EQ",
                                        Low: "INT",
                                        High: null
                                    }]
                                });
                            }
                            if (oModel.getProperty("/P2")) {
                                oAppStateData.selectionVariant.SelectOptions.push({
                                    PropertyName: "P2",
                                    Ranges: [{
                                        Sign: "I",
                                        Option: "BT",
                                        Low: "P2ValueLow",
                                        High: "P2ValueHigh"
                                    }]
                                });
                            }
                            if (oModel.getProperty("/P1New")) {
                                oAppStateData.selectionVariant.SelectOptions.push({
                                    PropertyName: "P1New",
                                    Ranges: [{
                                        Sign: "I",
                                        Option: "BT",
                                        Low: "P1NewValueLow",
                                        High: "P1NewValueHigh"
                                    }]
                                });
                            }
                            if (oModel.getProperty("/PX")) {
                                oAppStateData.selectionVariant.SelectOptions.push({
                                    PropertyName: oModel.getProperty("/PX"),
                                    Ranges: [{
                                        Sign: "I",
                                        Option: "BT",
                                        Low: "PXValueLow",
                                        High: "PXValueHigh"
                                    }]
                                });
                            }
                        }
                        oAppState.setData(oAppStateData);
                        this.getView().getModel("v2").setProperty("/data", JSON.stringify(oAppStateData));
                        oAppState.save();
                    }.bind(this));
                }
                var oParams = oURLParsing.parseParameters("?" + this.getView().getModel("v1").getProperty("/params") || "");
                if (this.getView().getModel("v1").getProperty("/addLongParams")) {
                    var sLongString, k, i;
                    oParams.Cx = ["X"];
                    sLongString = "A1234";
                    for (k = 0; k < 20; k = k + 1) {
                        sLongString = "A" + i + sLongString;
                        for (i = 0; i < 4; i = i + 1) { //4000
                            sLongString = sLongString + "xx" + i;
                        }
                        sLongString = sLongString + i;
                        oParams.Cx.push(sLongString);
                        oParams["C" + k] = [sLongString];
                    }
                }
                this.args = {
                    target: {
                        semanticObject: sSemanticObject,
                        action: sAction
                    },
                    appStateKey: sAppStateKey,
                    params: oParams
                };
                Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                    var sHref = oCANService.hrefForExternal(this.args, this.getMyComponent());
                    if (this.getView().getModel()) {
                        this.getView().getModel().setProperty("/toGeneratedLink", sHref);
                    }
                }.bind(this));
            }.bind(this));
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        handleBtn1Press: function () {
            this.oApplication.navigate("toView", "View2");
        },

        handleBtnGenPress: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.toExternal(this.args, this.getMyComponent());
            }.bind(this));
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberof view.Detail
         */
        onExit: function () {
            Log.info("sap.ushell.demo.AppNavSample: onExit of View1");
        }
    });
});
