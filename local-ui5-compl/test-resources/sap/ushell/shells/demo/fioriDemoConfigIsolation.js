// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview This file contains a sample Fiori sandbox application configuration.
 */
sap.ui.define("sap.ushell.shells.demo.fioriDemoConfig", [
    "sap/base/util/ObjectPath"
], function (
    ObjectPath
) {
    "use strict";

    var sUshellTestRootPath = sap.ui.require.toUrl("sap/ushell").replace("resources", "test-resources");
    var oUriParameters = new URLSearchParams(window.location.search);
    var sIframeURL = oUriParameters.get("iframe-url");

    if (sIframeURL === null) {
        sIframeURL = sUshellTestRootPath + "/shells/demo/ui5appruntime.html";
    }

    var oTestContent = {
        groups: [{
            id: "group_0",
            title: "KPIs",
            isPreset: true,
            isVisible: true,
            isDefaultGroup: true,
            isGroupLocked: false,
            tiles: [{
                id: "tile_01",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Test App",
                    info: "SPA",
                    targetURL: "#AppNotIsolated-Action"
                }
            }, {
                id: "tile_02",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Test App",
                    info: "iframe",
                    targetURL: "#Action-todefaultapp"
                }
            }, {
                id: "tile_03",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Letter Box",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    info: "iframe",
                    targetURL: "#Action-toLetterBoxing"
                }
            }, {
                id: "tile_04",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "App Nav Sample",
                    info: "iframe",
                    targetURL: "#Action-toappnavsample"
                }
            }, {
                id: "tile_05",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Test ToExternal App",
                    info: "SPA",
                    targetURL: "#FioriToExtApp-Action"
                }
            }, {
                id: "tile_06",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Test ToExternal App Target",
                    info: "SPA",
                    targetURL: "#FioriToExtAppTarget-Action"
                }
            }, {
                id: "tile_07",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Test UI5 Isolated App",
                    info: "iframe",
                    targetURL: "#FioriToExtAppIsolated-Action"
                }
            }, {
                id: "tile_08",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Test UI5 Target Isolated App",
                    info: "iframe",
                    targetURL: "#FioriToExtAppTargetIsolated-Action"
                }
            }, {
                id: "tile_09",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Bookmarks Isolated",
                    info: "iframe",
                    targetURL: "#BookmarksIsolated-Action"
                }
            }, {
                id: "tile_10",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "State Isolated",
                    info: "iframe",
                    targetURL: "#Action-toappcontextsample"
                }
            }, {
                id: "tile_11",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "App Runtime Renderer API Sample",
                    info: "iframe",
                    targetURL: "#Renderer-Sample"
                }
            }, {
                id: "tile_12",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Bookmark With State",
                    info: "SPA",
                    targetURL: "#BookmarkState-Sample"
                }
            }, {
                id: "tile_13",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Bookmark With State",
                    info: "iframe",
                    targetURL: "#BookmarkStateIso-Sample"
                }
            }, {
                id: "tile_15",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "App For On Close",
                    info: "iframe",
                    targetURL: "#AppBeforeCloseEvent-Action"
                }
            }, {
                id: "tile_16",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "App Nav Sample - ui5appruntime-min (CF)",
                    info: "iframe",
                    targetURL: "#AppNavSample-MinCF"
                }
            }, {
                id: "tile_17",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "App Nav Sample - ui5appruntime-min (ABAP)",
                    info: "iframe",
                    targetURL: "#AppNavSample-MinABAP"
                }
            }, {
                id: "tile_18",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Camera & Location Sample",
                    info: "iframe",
                    targetURL: "#CameraAndLocation-Action"
                }
            }, {
                id: "tile_19",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "BB1 - Application A",
                    info: "iframe",
                    targetURL: "#Application-A"
                }
            }, {
                id: "tile_20",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "BB1 - Application B",
                    info: "iframe",
                    targetURL: "#Application-B"
                }
            }, {
                id: "tile_21",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "BB1 - Application C",
                    info: "iframe",
                    targetURL: "#Application-C"
                }
            }, {
                id: "tile_22",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "SAPUI5=<view>",
                    info: "SPA",
                    targetURL: "#SAPUI5-JSView"
                }
            }, {
                id: "tile_23",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "SAPUI5=<component>",
                    info: "SPA",
                    targetURL: "#SAPUI5-Component"
                }
            }, {
                id: "tile_24",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "Get Component Data Sample",
                    info: "SPA",
                    targetURL: "#ComponentDataApp-Sample"
                }
            }, {
                id: "tile_25",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "App Nav Sample SPA1",
                    info: "SPA",
                    targetURL: "#AppNav-SAP1"
                }
            }, {
                id: "tile_26",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "App Nav Sample SPA2",
                    info: "SPA",
                    targetURL: "#AppNav-SAP2"
                }
            }]
        }],
        catalogs: [],
        applications: {
            "AppNotIsolated-Action": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/FioriSandboxDefaultApp",
                description: "Navigation App - Non Isolated"
            },
            "Action-todefaultapp": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.FioriSandboxDefaultApp#Action-todefaultapp",
                description: "Navigation App - Isolated",
                navigationMode: "embedded"
            },
            "Action-toLetterBoxing": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.letterBoxing#Action-toLetterBoxing",
                description: "LetterBoxing demo app - Isolated",
                navigationMode: "embedded"
            },
            "Action-toappnavsample": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.AppNavSample#Action-toappnavsample",
                description: "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) ",
                navigationMode: "embedded"
            },
            "FioriToExtApp-Action": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriToExtApp",
                url: sUshellTestRootPath + "/demoapps/FioriToExtApp",
                applicationType: "URL",
                description: "App Source"
            },
            "FioriToExtApp-NewWindow": {
                applicationType: "URL",
                url: sUshellTestRootPath + "/shells/demo/FioriLaunchpad.Isolation.html?sap-isolation-enabled=true#FioriToExtApp-Action",
                navigationMode: "newWindow"
            },
            "FioriToExtAppTarget-Action": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriToExtAppTarget",
                url: sUshellTestRootPath + "/demoapps/FioriToExtAppTarget",
                applicationType: "URL",
                description: "App Target"
            },
            "FioriToExtAppIsolated-Action": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.FioriToExtApp#FioriToExtApp-Action",
                description: "App Source (Isolated)",
                navigationMode: "embedded"
            },
            "FioriToExtAppIsolated-NewWindow": {
                applicationType: "URL",
                url: sUshellTestRootPath + "/shells/demo/FioriLaunchpad.Isolation.html?sap-isolation-enabled=true#FioriToExtAppIsolated-Action",
                navigationMode: "newWindow"
            },
            "FioriToExtAppTargetIsolated-Action": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.FioriToExtAppTarget#FioriToExtAppTarget-Action",
                description: "App Target (Isolated)",
                navigationMode: "embedded"
            },
            "BookmarksIsolated-Action": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.bookmark#BookmarkSample-Action",
                description: "Bookmarks (Isolated)",
                navigationMode: "embedded"
            },
            "Action-toappcontextsample": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.AppContextSample#Action-toappcontextsample",
                description: "AppContext (Isolated)",
                navigationMode: "embedded"
            },
            "Renderer-Sample": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.AppRuntimeRendererSample#Renderer-Sample",
                description: "App Runtime Renderer Sample - Isolated",
                navigationMode: "embedded"
            },
            "BookmarkState-Sample": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.bookmarkstate",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/BookmarkAndStateApp",
                description: ""
            },
            "BookmarkStateIso-Sample": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.bookmarkstate#BookmarkStateIso-Sample",
                description: "",
                navigationMode: "embedded"
            },
            "AppBeforeCloseEvent-Action": {
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppBeforeCloseEvent/AppBeforeCloseEvent.html?p=1",
                navigationMode: "embedded"
            },
            "AppNavSample-MinCF": {
                applicationType: "URL",
                url: sIframeURL.replace("ui5appruntime", "ui5appruntime-minCF") + "?sap-ui-app-id=sap.ushell.demo.AppNavSample#Action-toappnavsample",
                description: "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) ",
                navigationMode: "embedded"
            },
            "AppNavSample-MinABAP": {
                applicationType: "URL",
                url: sIframeURL.replace("ui5appruntime", "ui5appruntime-minABAP") + "?sap-ui-app-id=sap.ushell.demo.AppNavSample#Action-toappnavsample",
                description: "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) ",
                navigationMode: "embedded"
            },
            "Application-A": {
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/IframeReuseSample/IframeReuseSample.html?#X-Y&/A",
                navigationMode: "embedded"
            },
            "Application-B": {
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/IframeReuseSample/IframeReuseSample.html?#X-Y&/B",
                navigationMode: "embedded"
            },
            "Application-C": {
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/IframeReuseSample/IframeReuseSample.html?#X-Y&/C",
                navigationMode: "embedded"
            },
            "CameraAndLocation-Action": {
                applicationType: "URL",
                url: sIframeURL + "?sap-ui-app-id=sap.ushell.demo.CameraAndLocationSample#CameraAndLocation-Action",
                description: "",
                navigationMode: "embedded"
            },
            "SAPUI5-JSView": {
                applicationType: "URL",
                additionalInformation: "SAPUI5=shells.demo.apps.jsViewApp.AppLaunch.view.js",
                url: sUshellTestRootPath,
                navigationMode: "embedded"
            },
            "SAPUI5-Component": {
                applicationType: "URL",
                additionalInformation: "SAPUI5=shells.demo.apps.jsViewApp",
                url: sUshellTestRootPath,
                navigationMode: "embedded"
            },
            "ComponentDataApp-Sample": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppComponentData",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppComponentData",
                description: "ComponentData demo app",
                navigationMode: "embedded"
            },
            "AppNav-SAP1": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppNavSample",
                description: "App Nav Sample SPA1",
                navigationMode: "embedded"
            },
            "AppNav-SAP2": {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationType: "URL",
                url: sUshellTestRootPath + "/demoapps/AppNavSample",
                description: "App Nav Sample SPA2",
                navigationMode: "embedded"
            }
        },
        // data for the personalization service
        personalizationStorageType: "MEMORY",
        pathToLocalizedContentResources: sUshellTestRootPath + "/test/services/resources/resources.properties",
        personalizationData: {
            "sap.ushell.personalization#sap.ushell.services.UserRecents": {
                "ITEM#RecentActivity": [],
                "ITEM#RecentApps": [],
                "ITEM#RecentSearches": []
            }
        },
        search: {
            searchResultPath: "./searchResults/record.json"
        }
    };

    var oLaunchPageAdapterConfig = ObjectPath.create("sap-ushell-config.services.LaunchPage.adapter.config");
    oLaunchPageAdapterConfig.groups = oTestContent.groups;
    oLaunchPageAdapterConfig.catalogs = oTestContent.catalogs;
    ObjectPath.create("sap-ushell-config.services.NavTargetResolution.adapter.config").applications = oTestContent.applications;
    var oPersonalizationAdapterConfig = ObjectPath.create("sap-ushell-config.services.Personalization.adapter.config");
    oPersonalizationAdapterConfig.personalizationData = oTestContent.personalizationData;
    oPersonalizationAdapterConfig.storageType = oTestContent.personalizationStorageType;
    ObjectPath.create("sap-ushell-config.services.Search.adapter.config").searchResultPath = oTestContent.search.searchResultPath;
    // TODO: temp work-around, "" should be removed from apps
    delete ObjectPath.get("sap-ushell-config.services.NavTargetResolution.adapter.config", 0).applications[""];
});
