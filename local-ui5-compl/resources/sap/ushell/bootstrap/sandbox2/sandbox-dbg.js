// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

const OBJECT_PROTOTYPE_KEYS = Object.getOwnPropertyNames(Object.prototype);

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ushell/bootstrap/common/common.util",
    "sap/ushell/Container"
], (
    Log,
    ObjectPath,
    commonUtils,
    Container
) => {
    "use strict";

    const Sandbox = {
        _loadJSON: async function (sUrl) {
            function logError () {
                Log.error("Failed to load Fiori Launchpad Sandbox configuration", sUrl);
            }
            try {
                const response = await fetch(sUrl, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {
                    const oData = await response.json();
                    return oData;
                }
                logError();
            } catch (e) {
                logError();
            }
        },

        mergeConfig: function (oBaseConfig, oCustomConfig, bCloneCustom) {
            if (typeof oCustomConfig !== "object") {
                return;
            }

            const oConfigToMerge = bCloneCustom ? JSON.parse(JSON.stringify(oCustomConfig)) : oCustomConfig;

            Object.entries(oConfigToMerge).forEach(([sKey, oValue]) => {
                // Prevent overriding of object prototype properties to avoid prototype pollution attacks
                if (OBJECT_PROTOTYPE_KEYS.includes(sKey)) {
                    return;
                }

                if (Object.prototype.toString.apply(oBaseConfig[sKey]) === "[object Object]" &&
                    Object.prototype.toString.apply(oValue) === "[object Object]") {
                    this.mergeConfig(oBaseConfig[sKey], oValue, false);
                    return;
                }
                oBaseConfig[sKey] = oValue;
            });
        },

        /**
         * Add custom applications and tiles from the provided custom configuration to the template site:
         * 1. Applications and tiles from oConfig.applications (documented way, My Home section)
         * 2. Applications from oConfig.services.NavTargetResolutionInternal.adapter.config.applications
         * 3. Applications from oConfig.services.ClientSideTargetResolution.adapter.config.inbounds
         * 4. Groups and tiles from oConfig.services.LaunchPage.adapter.config.groups (a new section is created for each group)
         *
         * @param {object} oConfig The current ushell configuration
        */
        _addAppsToSite: function (oConfig) {
            const oApplicationConfig = {};

            function getComponentName (oApplication) {
                return oApplication.additionalInformation.replace("SAPUI5.Component=", "");
            }

            function createApp (oApplication, sKey) {
                const sComponentName = getComponentName(oApplication);
                const sApplicationTitle = oApplication.title || sComponentName.split(".").pop();
                const aNavTarget = sKey.split("-"); // Convention: application key must be in form of "SemanticObject-action"

                /* eslint-disable quote-props */
                const oApp = {
                    "sap.app": {
                        "id": sComponentName,
                        "title": sApplicationTitle,
                        "subTitle": oApplication.description || "",
                        "ach": "CA-FLP-FE-COR",
                        "applicationVersion": {
                            "version": "1.0.0"
                        },
                        "crossNavigation": {
                            "inbounds": {
                                "target": {
                                    "semanticObject": aNavTarget[0],
                                    "action": aNavTarget[1],
                                    "signature": {
                                        "parameters": {},
                                        "additionalParameters": "allowed"
                                    }
                                }
                            }
                        },
                        "tags": {
                            "keywords": sApplicationTitle.split(" ")
                        }
                    },
                    "sap.flp": {
                        "type": "application"
                    },
                    "sap.ui": {
                        "technology": "UI5",
                        "icons": {
                            "icon": "sap-icon://Fiori2/F0018"
                        },
                        "deviceTypes": {
                            "desktop": true,
                            "tablet": true,
                            "phone": true
                        }
                    },
                    "sap.ui5": {
                        "componentName": sComponentName
                    },
                    "sap.platform.runtime": {
                        "componentProperties": {
                            "url": oApplication.url
                        }
                    }
                };
                /* eslint-enable quote-props */
                return oApp;
            }

            function createAppFromInbound (oInbound) {
                const oApplication = oInbound.resolutionResult || {};
                const sComponentName = oApplication.ui5ComponentName || getComponentName(oApplication);
                const sApplicationTitle = oInbound.title || sComponentName.split(".").pop();

                /* eslint-disable quote-props */
                const oApp = {
                    "sap.app": {
                        "id": sComponentName,
                        "title": sApplicationTitle,
                        "subTitle": oApplication.description || "",
                        "ach": "CA-FLP-FE-COR",
                        "applicationVersion": {
                            "version": "1.0.0"
                        },
                        "crossNavigation": {
                            "inbounds": {
                                "target": {
                                    "semanticObject": oInbound.semanticObject,
                                    "action": oInbound.action,
                                    "signature": oInbound.signature
                                }
                            }
                        },
                        "tags": {
                            "keywords": sApplicationTitle.split(" ")
                        }
                    },
                    "sap.flp": {
                        "type": "application"
                    },
                    "sap.ui": {
                        "technology": "UI5",
                        "icons": {
                            "icon": "sap-icon://Fiori2/F0018"
                        },
                        "deviceTypes": oInbound.deviceTypes
                    },
                    "sap.ui5": {
                        "componentName": sComponentName
                    },
                    "sap.platform.runtime": {
                        "componentProperties": {
                            "url": oApplication.url
                        }
                    }
                };
                /* eslint-enable quote-props */
                return oApp;
            }

            function createViz (oApplication, sKey) {
                const sComponentName = getComponentName(oApplication);
                const sApplicationTitle = oApplication.title || sComponentName.split(".").pop();

                /* eslint-disable quote-props */
                const oViz = {
                    "vizType": "sap.ushell.StaticAppLauncher",
                    "businessApp": sComponentName || "sap.ushell.sandbox.BusinessApp",
                    "vizConfig": {
                        "sap.app": {
                            "title": sApplicationTitle,
                            "subTitle": oApplication.description || ""
                        },
                        "sap.ui": {
                            "icons": {
                                "icon": oApplication.icon
                            },
                            "deviceTypes": {
                                "desktop": true,
                                "tablet": true,
                                "phone": true
                            }
                        },
                        "sap.flp": {
                            "target": {
                                "type": "URL",
                                "url": "#" + sKey
                            }
                        }
                    }
                };
                /* eslint-enable quote-props */
                return oViz;
            }

            // predefined site is found here
            const oSiteData = oConfig.services.CommonDataModel.adapter.config.siteData;

            // generate applications and tiles from oConfig.applications and add them to the site
            const oApplications = ObjectPath.get("applications", oConfig) || {};
            for (const [sAppKey, oApplication] of Object.entries(oApplications)) {
                const sVizId = "custom_viz_" + sAppKey;
                const oSection = oSiteData.pages.page1.payload.sections.APPS; // predefined section for custom apps
                oSiteData.applications[sAppKey] = createApp(oApplication, sAppKey);
                oSiteData.visualizations[sAppKey] = createViz(oApplication, sAppKey);
                oSection.layout.vizOrder.push(sVizId);
                oSection.viz[sVizId] = {
                    id: sVizId,
                    vizId: sAppKey
                };
            }

            // generate applications from NavTargetResolutionInternal config
            const oNavTargetApps = JSON.parse(JSON.stringify(ObjectPath.get("services.NavTargetResolutionInternal.adapter.config.applications", oConfig) || {}));
            ObjectPath.set("services.NavTargetResolutionInternal.adapter.config.applications", oNavTargetApps, oApplicationConfig);
            for (const [sNTAppKey, oNTApp] of Object.entries(oNavTargetApps)) {
                if (oNTApp.additionalInformation) {
                    oSiteData.applications[sNTAppKey] = createApp(oNTApp, sNTAppKey);
                }
            }

            // generate applications from ClientSideTargetResolution config (application dependencies not taken into account yet)
            const oClientTargetApps = JSON.parse(JSON.stringify(ObjectPath.get("services.ClientSideTargetResolution.adapter.config.inbounds", oConfig) || {}));
            ObjectPath.set("services.ClientSideTargetResolution.adapter.config.inbounds", oClientTargetApps, oApplicationConfig);
            for (const oInbound of Object.values(oClientTargetApps)) {
                oSiteData.applications[oInbound.semanticObject + "-" + oInbound.action] = createAppFromInbound(oInbound);
            }

            // generate sections and tiles from the LaunchPage adapter config and add them to the site
            const aGroups = JSON.parse(JSON.stringify(ObjectPath.get("services.LaunchPage.adapter.config.groups", oConfig) || []));
            ObjectPath.set("services.LaunchPage.adapter.config.groups", aGroups, oApplicationConfig);
            aGroups.forEach((oGroup, index) => {
                const sGroupId = oGroup.id || "GROUP_" + index;
                const oPage = oSiteData.pages.page1; // predefined page
                oPage.payload.layout.sectionOrder.splice(index + 1, 0, sGroupId); // insert groups between my home and sample apps
                oPage.payload.sections[sGroupId] = {
                    id: sGroupId,
                    title: oGroup.title,
                    layout: {vizOrder: []},
                    viz: {}
                };
                const oSection = oPage.payload.sections[sGroupId];
                (oGroup.tiles || []).forEach((oTile, tileIndex) => {
                    const sTileId = oTile.id || sGroupId + "_tile_" + tileIndex;
                    oSection.layout.vizOrder.push(sTileId);

                    /* eslint-disable quote-props */
                    const sFormFactor = oTile.formFactor || "Desktop,Tablet,Phone";
                    const oTileProperties = oTile.properties || {};
                    const oViz = {
                        "vizType": "sap.ushell.StaticAppLauncher", // always static tiles, no matter how it is configured
                        "businessApp": "sap.ushell.sandbox.BusinessApp",
                        "vizConfig": {
                            "sap.app": {
                                "title": oTile.title || oTileProperties.title || "",
                                "subTitle": oTileProperties.subtitle || ""
                            },
                            "sap.ui": {
                                "icons": {
                                    "icon": oTileProperties.icon
                                },
                                "deviceTypes": {
                                    "desktop": sFormFactor.indexOf("Desktop") > -1,
                                    "tablet": sFormFactor.indexOf("Tablet") > -1,
                                    "phone": sFormFactor.indexOf("Phone") > -1
                                }
                            },
                            "sap.flp": {
                                "target": {
                                    "type": "URL",
                                    "url": oTileProperties.targetURL || oTileProperties.href || "#"
                                }
                            }
                        }
                    };
                    oSiteData.visualizations[sTileId] = oViz;
                    oSection.viz[sTileId] = {
                        id: sTileId,
                        vizId: sTileId
                    };
                    /* eslint-enable quote-props */
                });
            });
            delete oConfig.applications;

            const oServiceMigration = commonUtils.getV2ServiceMigrationConfig(oApplicationConfig);
            this.mergeConfig(oConfig, oServiceMigration, true);
            this.mergeConfig(oConfig, oApplicationConfig, true);

            return oConfig;
        },

        /**
         * Apply the default Ushell Config and merge into
         * window["sap-ushell-config"].
         *
         * @param {object} oConfig The config to be merged into the window object
         * @param {object} oUshellConfig The current ushell configuration
         */
        _applyDefaultUshellConfig: function (oConfig, oUshellConfig) {
            const oDefaultApplicationMigration = commonUtils.getV2ServiceMigrationConfig(oConfig);

            this.mergeConfig(oUshellConfig, oDefaultApplicationMigration, true);
            this.mergeConfig(oUshellConfig, oConfig, true);
        },

        /**
         * Apply the default site data and delete the siteDataUrl from the adapter config.
         *
         * @param {object} oSiteData The site data to be merged into the window object
         * @param {object} oUshellConfig The current ushell configuration
         */
        _applyDefaultSiteData: function (oSiteData, oUshellConfig) {
            const oAdapterConfig = oUshellConfig.services.CommonDataModel.adapter.config;
            oAdapterConfig.siteData = oSiteData;
            delete oAdapterConfig.siteDataUrl;
        },

        /**
         * Read a new JSON application config defined by its URL and merge into
         * window["sap-ushell-config"].
         *
         * @param {string} sUrlPrefix URL of JSON file to be merged into the configuration
         * @param {object} oUshellConfig The current ushell configuration
         */
        _applyJsonApplicationConfig: async function (sUrlPrefix, oUshellConfig) {
            const sUrl = /\.json/i.test(sUrlPrefix) ? sUrlPrefix : sUrlPrefix + ".json";
            const oAppConfig = await this._loadJSON(sUrl);
            if (oAppConfig) {
                const oDefaultApplicationMigration = commonUtils.getV2ServiceMigrationConfig(oAppConfig);

                this.mergeConfig(oUshellConfig, oDefaultApplicationMigration, true);
                this.mergeConfig(oUshellConfig, oAppConfig, true);
            }
        },

        /**
         * Get the path of our own script; module paths are registered relative to this path, not
         * relative to the HTML page we introduce an ID for the bootstrap script, similar to UI5;
         * allows to reference it later as well
         * @returns {string} path of the bootstrap script
         */
        _getBootstrapScriptPath: function () {
            const oBootstrapScript = window.document.getElementById("sap-ushell-bootstrap");
            const sBootstrapScriptPath = oBootstrapScript.src.split("?")[0].split("/").slice(0, -1).join("/") + "/";
            return sBootstrapScriptPath;
        },

        /**
         * Perform sandbox bootstrap of local platform. The promise will make sure to call the UI5
         * callback in case of success.
         */
        bootstrap: async function () {
            const aConfigFiles = new URLSearchParams(window.location.search).getAll("sap-ushell-sandbox-config");
            const sBootstrapPath = this._getBootstrapScriptPath(); // default config files are located in the sandbox2 subfolder
            const sDefaultConfigUrl = sBootstrapPath + "./sandbox2/sandboxConfig.json";
            const sDefaultSiteUrl = sBootstrapPath + "./sandbox2/sandboxSite.json";

            // if one or more configuration files are specified explicitly via URL parameter, read them;
            // otherwise, /appconfig/fioriSandboxConfig.json is the convention for WebIDE developers
            if (aConfigFiles.length === 0) {
                aConfigFiles.push("/appconfig/fioriSandboxConfig.json");
                aConfigFiles.push("../appconfig/fioriSandboxConfig.json"); // some configurations work with relative path only
            }

            if (!window["sap-ushell-config"]) {
                window["sap-ushell-config"] = {};
            }
            const oUshellConfig = window["sap-ushell-config"];
            // migrate config set via window object
            commonUtils.migrateV2ServiceConfig(oUshellConfig);

            // load the predefined ushell configuration and site contents
            const [oDefaultConfig, oDefaultSite] = await Promise.all([this._loadJSON(sDefaultConfigUrl), this._loadJSON(sDefaultSiteUrl)]);
            this._applyDefaultUshellConfig(oDefaultConfig, oUshellConfig);
            this._applyDefaultSiteData(oDefaultSite, oUshellConfig);

            // merge with the custom configuration
            for (const sConfigFile of aConfigFiles) {
                await this._applyJsonApplicationConfig(sConfigFile, oUshellConfig);
            }

            // convert custom data to the site data
            this._addAppsToSite(oUshellConfig);

            // check if sample apps path is correctly configured in the HTML bootstrap (redirect demo to demoapps)
            const sDemoAppsPath = sap.ui.require.toUrl("sap/ushell/demo");
            if (sDemoAppsPath.indexOf("sap/ushell/demoapps") === -1) {
                // The path to sample apps is not configured or configured incorrectly
                sap.ui.loader.config({paths: {"sap/ushell/demo": "/ushell/test-resources/sap/ushell/demoapps"}});
            }

            // merge custom application module paths for the loader, if provided
            if (oUshellConfig.modulePaths) {
                const oModules = Object.keys(oUshellConfig.modulePaths).reduce((result, sModulePath) => {
                    result[sModulePath.replace(/\./g, "/")] = oUshellConfig.modulePaths[sModulePath];
                    return result;
                }, {});
                sap.ui.loader.config({
                    paths: oModules
                });
            }
            return Container.init("cdm");
        }
    };

    return Sandbox;
});
