// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/base/Log", "sap/ui/core/UIComponent"], function (Log, UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.AppContextSample.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.AppContextSample",
            dependencies: {
                libs: ["sap.m"],
                components: []
            },
            config: {
                title: "App Context Sample",
                icon: "sap-icon://Fiori2/F0429"
            },
            rootView: {
                viewName: "sap.ushell.demo.AppContextSample.App",
                type: "XML",
                async: true
            }
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            /* StartupParameters (2) */
            /* http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#Action-toappnavsample?AAA=BBB&DEF=HIJ */
            /* results in { AAA: ["BBB"], DEF: ["HIJ"] } */
            var oComponentData = this.getComponentData && this.getComponentData() || {};
            Log.info("sap.ushell.demo.AppNavSample: app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
            this.sFruitFavsContextKey = (oComponentData.startupParameters && oComponentData.startupParameters.fruitfavscontextkey && oComponentData.startupParameters.fruitfavscontextkey[0]) || "";
        }
    });
});
