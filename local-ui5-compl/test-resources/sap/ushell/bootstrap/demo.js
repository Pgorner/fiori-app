// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's bootstrap code for standalone demos.
 * @version 1.132.1
 */
 (function () {
    "use strict";

    window["sap-ui-config"] = {
        "xx-bootTask": function (fnCallback) {

            sap.ui.loader.config({
                paths: {
                    "sap/ushell/shells/demo": ".",
                    "sap/ushell/adapters/local/searchResults": "./searchResults" // TODO: quick fix for search adapter test data
                }
            });

            //Load configuration for fiori demo
            var urlParams = window.getUrlParams().demoConfig;
            var demoConfig = decodeURIComponent(urlParams || "fioriDemoConfig");
            sap.ui.require([
                "sap/ushell/shells/demo/" + demoConfig.split("#")[0],
                "sap/ushell/bootstrap/common/common.util",
                "sap/base/util/ObjectPath"
            ], function (demoConfig, commonUtils, ObjectPath) {
                var oUshellConfig = window["sap-ushell-config"];

                // migrate adapter config
                commonUtils.migrateV2ServiceConfig(oUshellConfig);

                var oUi5ComponentLoaderConfig = ObjectPath.create("services.Ui5ComponentLoader.config", oUshellConfig);
                // by default we disable the loading of default dependencies for the sandbox
                if (!oUi5ComponentLoaderConfig.hasOwnProperty("loadDefaultDependencies")) {
                    oUi5ComponentLoaderConfig.loadDefaultDependencies = false;
                }

                if (oUshellConfig && oUshellConfig.modulePaths) {
                    var oModules = Object.keys(oUshellConfig.modulePaths).reduce(function (result, sModulePath) {
                        result[sModulePath.replace(/\./g, "/")] = oUshellConfig.modulePaths[sModulePath];
                        return result;
                    }, {});
                    sap.ui.loader.config({
                        paths: oModules
                    });
                }

                // tell SAPUI5 that this boot task is done once the container has loaded
                sap.ui.require(["sap/ushell/Container"], function (oContainer) {
                    oContainer.init("local").then(fnCallback);
                });
            });
        }
    };
}());
