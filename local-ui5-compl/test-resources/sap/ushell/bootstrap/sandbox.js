// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's bootstrap code for development sandbox scenarios.
 *
 * @version 1.132.1
 */

(function () {
    "use strict";
    window.sap = window.sap || {};
    window.sap.ushell = window.sap.ushell || {};
    window.sap.ushell.__sandbox__ = window.sap.ushell.__sandbox__ || {};
    window.sap.ushell.__sandbox__.init = init;


    // ushell bootstrap is registered as sapui5 boot task; would not be required for the sandbox case, but we stick to the ABAP pattern for consistency
    // on ABAP, this is required, because some ui5 settings (e.g. theme) are retrieved from the back-end and have to be set early in the ui5 bootstrap
    window["sap-ui-config"] = {
        "xx-bootTask": function (fnCallback) {
            init().then(function (bootstrap) {
                bootstrap(fnCallback);
            });
        }
    };

    function init () {
        return new Promise(function (resolve) {

            sap.ui.require([
                "sap/base/Log",
                "sap/base/util/ObjectPath",
                "sap/ushell/bootstrap/common/common.util",
                "sap/ushell/Container"
            ], function (
                Log,
                ObjectPath,
                commonUtils,
                Container
            ) {
                /*
                 * Function copied from boottask.js
                 * The original function could be moved to sap.ushell_abap.pbServices.ui2.Utils
                 */
                function mergeConfig (oMutatedBaseConfig, oConfigToMerge, bCloneConfigToMerge) {
                    const oActualConfigToMerge = bCloneConfigToMerge ? JSON.parse(JSON.stringify(oConfigToMerge)) : oConfigToMerge;

                    if (typeof oConfigToMerge !== "object") {
                        return;
                    }

                    Object.keys(oActualConfigToMerge).forEach(function (sKey) {
                        if (Object.prototype.toString.apply(oMutatedBaseConfig[sKey]) === "[object Object]" &&
                            Object.prototype.toString.apply(oActualConfigToMerge[sKey]) === "[object Object]") {
                            mergeConfig(oMutatedBaseConfig[sKey], oActualConfigToMerge[sKey], false);
                            return;
                        }
                        oMutatedBaseConfig[sKey] = oActualConfigToMerge[sKey];
                    });
                }

                /**
                 * Check the format of the downloaded configuration and adjust it if necessary. The
                 * recommended format changed with release 1.28 to store the adapter-specific configuration
                 * of the sandbox in the sap-ushell-config format.
                 *
                 * @param {object} oUshellConfig
                 *   ushell configuration JSON object to be adjusted
                 * @returns {string[]} Array of application keys
                 * @since 1.28
                 * @private
                 *
                 */
                function adjustApplicationConfiguration (oUshellConfig) {
                    const oApplicationConfig = {};

                    function getApplicationKeys (oCfg) {
                        var aAppKeys = [],
                            sApplicationKey;

                        if (!oCfg || !oCfg.applications || typeof oCfg.applications !== "object") {
                            return aAppKeys;
                        }

                        // create an array containing all valid navigation targets
                        for (sApplicationKey in oCfg.applications) {
                            // skip the application key "" as it would disrupt the rendering of the fiori2 renderer
                            if (oCfg.applications.hasOwnProperty(sApplicationKey) && sApplicationKey !== "") {
                                aAppKeys.push(sApplicationKey);
                            }
                        }

                        return aAppKeys;
                    }

                    function createTile (oApplication, iIdSuffix, sKey) {
                        var sApplicationTitle = oApplication.title || oApplication.additionalInformation.replace("SAPUI5.Component=", "").split(".").pop();
                        return {
                            id: "sap_ushell_generated_tile_id_" + iIdSuffix,
                            title: sApplicationTitle,
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            properties: {
                                chipId: "sap_ushell_generated_chip_id",
                                title: sApplicationTitle,
                                info: oApplication.description,
                                targetURL: "#" + sKey
                            }
                        };
                    }

                    const aApplicationKeys = getApplicationKeys(oUshellConfig);

                    if (aApplicationKeys.length) {
                        // make sure we have the place for the tiles
                        const oLaunchPageAdapterConfig = JSON.parse(JSON.stringify(ObjectPath.get("services.LaunchPage.adapter.config", oUshellConfig) || {}));
                        ObjectPath.set("services.LaunchPage.adapter.config", oLaunchPageAdapterConfig, oApplicationConfig);

                        // make sure group exists
                        if (!oLaunchPageAdapterConfig.groups) {
                            oLaunchPageAdapterConfig.groups = [];
                        }

                        const oAutoGeneratedGroup = {
                            id: "sap_ushell_generated_group_id",
                            title: "Generated Group",
                            tiles: []
                        };
                        oLaunchPageAdapterConfig.groups.unshift(oAutoGeneratedGroup);

                        // generate the tile
                        aApplicationKeys.forEach(function (sApplicationKey, iSuffix) {
                            oAutoGeneratedGroup.tiles.push(
                                createTile(oUshellConfig.applications[sApplicationKey], iSuffix, sApplicationKey)
                            );
                        });

                        // generate NavTargetResolution data from .applications
                        const oNavTargetResolutionConfig = ObjectPath.create("services.NavTargetResolution.adapter.config.applications", oApplicationConfig);
                        mergeConfig(oNavTargetResolutionConfig, oUshellConfig.applications, true);
                        delete oUshellConfig.applications;

                        const oServiceMigration = commonUtils.getV2ServiceMigrationConfig(oApplicationConfig);
                        mergeConfig(oUshellConfig, oServiceMigration, true);
                        mergeConfig(oUshellConfig, oApplicationConfig, true);
                    }
                    return oUshellConfig;
                }

                /**
                 * Read a new JSON application config defined by its URL and merge into
                 * provided config.
                 * @param {object} oUshellConfig The ushell config
                 */
                function applyDefaultApplicationConfig (oUshellConfig) {
                    var sUrl = getBootstrapScriptPath() + "../shells/sandbox/fioriSandboxConfig.json";

                    Log.info("Mixing/Overwriting sandbox configuration from " + sUrl + ".");
                    jQuery.ajax({
                        async: false,
                        url: sUrl,
                        dataType: "json",
                        success: function (data) {
                            Log.debug("Evaluating fiori launchpad sandbox config JSON: " + JSON.stringify(data));

                            const oDefaultApplicationConfig = adaptInboundUrl(data);
                            const oDefaultApplicationMigration = commonUtils.getV2ServiceMigrationConfig(oDefaultApplicationConfig);

                            mergeConfig(oUshellConfig, oDefaultApplicationMigration, true);
                            mergeConfig(oUshellConfig, oDefaultApplicationConfig, true);
                        },
                        error: function (xhr) {
                            if (xhr.status !== 404) {
                                Log.error("Failed to load Fiori Launchpad Sandbox configuration from " + sUrl + ": status: " + xhr.status + "; error: " + xhr.statusText);
                            }
                        }
                    });

                    function adaptInboundUrl (data) {
                        var oInbounds = data.services.ClientSideTargetResolution.adapter.config.inbounds,
                            sBasePath = sap.ui.require.toUrl("").substring(0, sap.ui.require.toUrl("").indexOf("resources")),
                            sInboundUrl;
                        Object.keys(oInbounds).forEach(function (sKey) {
                            sInboundUrl = oInbounds[sKey].resolutionResult.url;
                            sInboundUrl = sBasePath + sInboundUrl;
                            oInbounds[sKey].resolutionResult.url = sInboundUrl;
                        });
                        return data;
                    }
                }

                /**
                 * Read a new JSON application config defined by its URL and merge into
                 * provide config.
                 *
                 * @param {string} sUrlPrefix URL of JSON file to be merged into the configuration
                 * @param {object} oUshellConfig The ushell config
                 */
                function applyJsonApplicationConfig (sUrlPrefix, oUshellConfig) {
                    var sUrl = /\.json/i.test(sUrlPrefix) ? sUrlPrefix : sUrlPrefix + ".json";

                    Log.info("Mixing/Overwriting sandbox configuration from " + sUrl + ".");
                    jQuery.ajax({
                        async: false,
                        url: sUrl,
                        dataType: "json",
                        success: function (data) {
                            Log.debug("Evaluating fiori launchpad sandbox config JSON: " + JSON.stringify(data));

                            const oConfigMigration = commonUtils.getV2ServiceMigrationConfig(data);

                            mergeConfig(oUshellConfig, oConfigMigration, true);
                            mergeConfig(oUshellConfig, data, true);
                        },
                        error: function (xhr) {
                            if (xhr.status !== 404) {
                                Log.error("Failed to load Fiori Launchpad Sandbox configuration from " + sUrl + ": status: " + xhr.status + "; error: " + xhr.statusText);
                            }
                        }
                    });
                }

                /**
                 * Get the path of our own script; module paths are registered relative to this path, not
                 * relative to the HTML page we introduce an ID for the bootstrap script, similar to UI5;
                 * allows to reference it later as well
                 * @returns {string} path of the bootstrap script
                 */
                function getBootstrapScriptPath () {
                    var oScripts, oBootstrapScript, sBootstrapScriptUrl, sBootstrapScriptPath;
                    oBootstrapScript = window.document.getElementById("sap-ushell-bootstrap");
                    if (!oBootstrapScript) {
                        // fallback to last script element, if no ID set (should work on most browsers)
                        // it might happen that script tags are loaded lazily and are not available yet at this point
                        oScripts = window.document.getElementsByTagName("script");
                        oBootstrapScript = oScripts[oScripts.length - 1];
                    }
                    sBootstrapScriptUrl = oBootstrapScript.src;
                    sBootstrapScriptPath = sBootstrapScriptUrl.split("?")[0].split("/").slice(0, -1).join("/") + "/";
                    return sBootstrapScriptPath;
                }

                /*
                 * The config needs to be adjusted depending on the renderer specified in the URL parameter
                 * sap-ushell-sandbox-renderer. We have to make sure that no navigation target "" is defined
                 * in the NavTargetResolutionAdapter config, if any other renderer than "fiorisandbox" is
                 * specified. Any renderer specified as URL parameter will also override the renderer defined
                 * in the configuration.
                 */
                function evaluateCustomRenderer (sRenderer, oUshellConfig) {
                    var oApplications;

                    if (typeof sRenderer === "string" && sRenderer !== "") {
                        oUshellConfig.defaultRenderer = sRenderer;
                    }

                    oApplications = ObjectPath.get("services.NavTargetResolution.adapter.config.applications", oUshellConfig);
                    if (typeof oApplications === "object" && oUshellConfig.defaultRenderer !== "fiorisandbox") {
                        delete oApplications[""];
                    }

                    oApplications = ObjectPath.get("services.NavTargetResolutionInternal.adapter.config.applications", oUshellConfig);
                    if (typeof oApplications === "object" && oUshellConfig.defaultRenderer !== "fiorisandbox") {
                        delete oApplications[""];
                    }
                }


                /*
                 * Perform sandbox bootstrap of local platform. The promise will make sure to call the UI5
                 * callback in case of success.
                 *
                 */
                function bootstrap (fnBootstrapCallback) {
                    const aConfigFiles = new URLSearchParams(window.location.search).getAll("sap-ushell-sandbox-config");
                    const sCustomRenderer = new URLSearchParams(window.location.search).get("sap-ushell-sandbox-renderer");

                    sap.ui.loader.config({
                        paths: {
                            "sap/ushell/renderers/fiorisandbox": getBootstrapScriptPath() + "../renderers/fiorisandbox/"
                        }
                    });

                    if (!window["sap-ushell-config"]) {
                        window["sap-ushell-config"] = {};
                    }
                    const oUshellConfig = window["sap-ushell-config"];
                    // migrate config set via window object
                    commonUtils.migrateV2ServiceConfig(oUshellConfig);

                    // fill first with sandbox base application config
                    applyDefaultApplicationConfig(oUshellConfig);

                    // if one or more configuration files are specified explicitly via URL parameter,
                    // we just read these (JSON only); otherwise, we use the fixed path /appconfig/fioriSandboxConfig
                    if (aConfigFiles && aConfigFiles.length > 0) {
                        for (let i = 0; i < aConfigFiles.length; i = i + 1) {
                            applyJsonApplicationConfig(aConfigFiles[i], oUshellConfig);
                        }
                    } else {
                        // try to read from local appconfig (default convention)
                        applyJsonApplicationConfig("/appconfig/fioriSandboxConfig.json", oUshellConfig);
                        applyJsonApplicationConfig("../appconfig/fioriSandboxConfig.json", oUshellConfig); // some configurations work with relative path only
                    }

                    // the config needs to be adjusted depending on parameter sap-ushell-sandbox-renderer
                    evaluateCustomRenderer(sCustomRenderer);

                    adjustApplicationConfiguration(oUshellConfig);
                    const oRendererConfig = ObjectPath.create("renderers.fiori2.componentData.config", oUshellConfig);
                    if (!oRendererConfig.rootIntent) {
                        oRendererConfig.rootIntent = "Shell-home";
                    }

                    // by default we disable the loading of default dependencies for the sandbox
                    const oUi5ComponentLoaderConfig = ObjectPath.create("services.Ui5ComponentLoader.config", oUshellConfig);
                    if (!oUi5ComponentLoaderConfig.hasOwnProperty("loadDefaultDependencies")) {
                        oUi5ComponentLoaderConfig.loadDefaultDependencies = false;
                    }

                    // copy the NavTargetResolutionInternal.adapter.config.applications part to the ClientSideTargetResolution.config.targetMappings
                    // in order to be able to transform it to the inbounds format
                    // We assume that the content of the applications object is identical in the three following services
                    // Some scenarios (e.g. Fiori Elements tests) depend on the fact that the applications object is the same _reference_ in the following service configs
                    const oApplications = JSON.parse(JSON.stringify(ObjectPath.get("services.NavTargetResolutionInternal.adapter.config.applications", oUshellConfig) || {}));
                    ObjectPath.set("services.NavTargetResolution.adapter.config.applications", oApplications, oUshellConfig);
                    ObjectPath.set("services.NavTargetResolutionInternal.adapter.config.applications", oApplications, oUshellConfig);
                    ObjectPath.set("services.ClientSideTargetResolution.adapter.config.applications", oApplications, oUshellConfig);

                    if (oUshellConfig && oUshellConfig.modulePaths) {
                        var oModules = Object.keys(oUshellConfig.modulePaths).reduce(function (result, sModulePath) {
                            result[sModulePath.replace(/\./g, "/")] = oUshellConfig.modulePaths[sModulePath];
                            return result;
                        }, {});
                        sap.ui.loader.config({
                            paths: oModules
                        });
                    }

                    Container.init("local").then(fnBootstrapCallback);
                }

                // Attach private functions which should be testable to the public namespace
                // to make them available outside for testing.
                var oSandbox = ObjectPath.get("sap.ushell.__sandbox__");
                oSandbox._adjustApplicationConfiguration = adjustApplicationConfiguration;
                oSandbox._applyJsonApplicationConfig = applyJsonApplicationConfig;
                oSandbox._evaluateCustomRenderer = evaluateCustomRenderer;
                oSandbox._bootstrap = bootstrap;


                resolve(bootstrap);
            });
        });
    }
}());
