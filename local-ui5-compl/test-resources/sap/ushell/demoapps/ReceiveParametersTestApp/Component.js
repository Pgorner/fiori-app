// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (Log, UIComponent, JSONModel, Container) {
    "use strict";

    return UIComponent.extend("sap.ushell.demoapps.ReceiveParametersTestApp.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: { manifest: "json" },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            Log.info("sap.ushell.demoapps.ReceiveParametersTestApp: Component.createContent");

            // this.oRouter.initialize(); // router initialization must be done after view construction

            /* *StartupParameters* (2)   */
            /* http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#Action-toappnavsample?AAA=BBB&DEF=HIJ */
            /* results in   { AAA : [ "BBB"], DEF: ["HIJ"] }  */
            var oComponentData = this.getComponentData && this.getComponentData();
            Log.info("sap.ushell.demoapps.ReceiveParametersTestApp: app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));

            var oStartupParametersData = this.createStartupParametersData(oComponentData && oComponentData.startupParameters || {});
            this.setModel(new JSONModel(oStartupParametersData), "startupParameters");

            if (oComponentData && oComponentData.startupParameters
                && (oComponentData.startupParameters.block
                    || oComponentData.startupParameters["block-count"]
                    || oComponentData.startupParameters["block-waves"])
            ) {
                var iBlock = oComponentData.startupParameters.block && oComponentData.startupParameters.block[0] || 1000;
                var iBlockCount = oComponentData.startupParameters["block-count"] && oComponentData.startupParameters["block-count"][0] || 1;
                var iBlockWaves = oComponentData.startupParameters["block-waves"] && oComponentData.startupParameters["block-waves"][0] || 1;
                var iBlockDelay = oComponentData.startupParameters["block-delay"] && oComponentData.startupParameters["block-delay"][0] || 1;

                this._makeWave(0, iBlock, iBlockCount, iBlockWaves, iBlockDelay);
                this._syncBlock(iBlock); // block once synchronous
            }

            this.rootControlLoaded().then(function (view) {
                view.setHeight("100%");
                view.setModel(new JSONModel({
                    appstate: " no app state "
                }), "AppState");

                Container.getServiceAsync("CrossApplicationNavigation")
                    .then(function (oCrossApplicationNavigationService) {
                        return oCrossApplicationNavigationService.getStartupAppState(this);
                    }.bind(this))
                    .then(function (oAppState) {
                        var sAppState = JSON.stringify(oAppState.getData() || " no app state ", undefined, 2);
                        view.getModel("AppState").setProperty("/appstate", sAppState);
                    });
            }.bind(this));
        },
        _syncBlock: function (block) {
            var tmI = new Date().getTime();
            var ts = 0;
            var k = 3;
            while (ts < block) {
                k = k + 1;
                ts = (new Date().getTime()) - tmI;
                k = k + ts;
            }
        },
        /**
         * Processes waves of blocks.
         *
         * @param {int} wave The current wave index
         * @param {int} block The current block index
         * @param {int} blockCount The number of blocks
         * @param {int} blockWaves The number of blocks per wave
         * @param {int} blockDelay The configured delay for each block
         */
        _makeWave: function (wave, block, blockCount, blockWaves, blockDelay) {
            if (wave >= blockWaves) {
                return;
            }
            for (var i = 0; i < blockCount; ++i) {
                var sFunctionName = "w" + wave + "_" + i;
                // eslint-disable-next-line no-loop-func
                this[sFunctionName] = function () {
                    var tmI = new Date().getTime();
                    var ts = 0;
                    var k = 3;
                    while (ts < block) {
                        k = k + 1;
                        ts = (new Date().getTime()) - tmI;
                        k = k + ts;
                    }
                    Log.error("wavew" + wave + "_" + i + " done " + k);
                    if (i === 0) {
                        this._makeWave(wave + 1, block);
                    }
                };
                Log.error("schedule wave" + sFunctionName);
                setTimeout(this[sFunctionName], blockDelay);
            }
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
        exit: function () {
            Log.info("sap.ushell.demoapps.ReceiveParametersTestApp: Component.js exit called : this.getId():" + this.getId());
        }
    });
});
