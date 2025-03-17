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

    function TileJson (sId) {
        return {
            id: sId,
            title: sId,
            size: "1x1",
            tileType: "sap.ushell.ui.tile.DynamicTile",
            keywords: [],
            formFactor: "Desktop",
            chipId: sId,
            properties: {
                title: sId,
                targetURL: "#" + sId + "-Action"
            }
        };
    }

    function AppImbededJson (sComp, sUrl) {
        return {
            additionalInformation: "SAPUI5.Component=" + sComp,
            applicationType: "URL",
            url: sUshellTestRootPath + sUrl,
            description: ""
        };
    }

    function AppIsolatedJson (sComp) {
        return {
            applicationType: "URL",
            url: sUshellTestRootPath + "/shells/demo/ui5appruntime.html?sap-ui-app-id=" + sComp,
            description: "",
            navigationMode: "embedded"
        };
    }

    var tilesArray = [
        TileJson("AppContextSample"),
        TileJson("AppLetterBoxing"),
        TileJson("AppNavSample"),
        TileJson("AppNavSample2"),
        TileJson("AppPersSample"),
        TileJson("AppPersSample2"),
        TileJson("AppPersSample3"),
        TileJson("AppShellUIRouter"),
        TileJson("AppShellUIServiceSample"),
        TileJson("AppStateFormSample"),
        TileJson("AppStateSample"),
        TileJson("BookmarkSample"),
        TileJson("ClickjackingSample"),
        TileJson("ComponentEmbeddingSample"),
        TileJson("CrossAppStateSample"),
        TileJson("demoTiles"),
        TileJson("Fiori2AdaptationSampleApp"),
        TileJson("Fiori2AdaptationSampleApp2"),
        TileJson("FioriIframeApp"),
        TileJson("FioriSandboxDefaultApp"),
        TileJson("FioriToExtApp"),
        TileJson("FioriToExtAppTarget"),
        TileJson("HeaderCommonButtons"),
        TileJson("HelloWorldSampleApp"),
        TileJson("LaunchpadConfigFileExamples"),
        TileJson("LinkList"),
        TileJson("PersSrv2Test"),
        TileJson("PersSrvTest"),
        TileJson("PostMessageTestApp"),
        TileJson("ReceiveParametersTestApp"),
        TileJson("RTATestApp"),
        TileJson("TargetResolutionTool"),
        TileJson("UserDefaults"),
        TileJson("ValidateUrlMessagePopoverSample")
    ];

    var oTestContent = {
        groups: [{
            id: "group_00",
            title: "Not isolated",
            isPreset: true,
            isVisible: true,
            isDefaultGroup: true,
            isGroupLocked: false,
            tiles: tilesArray
        }, {
            id: "group_01",
            title: "Vis_Locked",
            isPreset: true,
            isVisible: true,
            isDefaultGroup: false,
            isGroupLocked: true,
            tiles: tilesArray
        }, {
            id: "group_02",
            title: "NotVis_NotLocked",
            isPreset: true,
            isVisible: false,
            isDefaultGroup: false,
            isGroupLocked: false,
            tiles: tilesArray
        }, {
            id: "group_03",
            title: "NotVis_Locked",
            isPreset: true,
            isVisible: false,
            isDefaultGroup: false,
            isGroupLocked: true,
            tiles: tilesArray
        }, {
            id: "group_04",
            title: "Vis_NotLocked",
            isPreset: true,
            isVisible: true,
            isDefaultGroup: false,
            isGroupLocked: false,
            tiles: tilesArray
        }],
        catalogs: [{
            id: "catalog_00",
            title: "Catalog 1",
            tiles: tilesArray
        }],
        applications: {
            "AppContextSample-Action": AppImbededJson("sap.ushell.demo.AppContextSample", "/demoapps/AppContextSample"),
            "AppLetterBoxing-Action": AppImbededJson("sap.ushell.demo.AppLetterBoxing", "/demoapps/AppLetterBoxing"),
            "AppNavSample-Action": AppImbededJson("sap.ushell.demo.AppNavSample", "/demoapps/AppNavSample"),
            "AppNavSample2-Action": AppImbededJson("sap.ushell.demo.AppNavSample2", "/demoapps/AppNavSample2"),
            "AppPersSample-Action": AppImbededJson("sap.ushell.demo.AppPersSample", "/demoapps/AppPersSample"),
            "AppPersSample2-Action": AppImbededJson("sap.ushell.demo.AppPersSample2", "/demoapps/AppPersSample2"),
            "AppPersSample3-Action": AppImbededJson("sap.ushell.demo.AppPersSample3", "/demoapps/AppPersSample3"),
            "AppShellUIRouter-Action": AppImbededJson("sap.ushell.demo.AppShellUIRouter", "/demoapps/AppShellUIRouter"),
            "AppShellUIServiceSample-Action": AppImbededJson("sap.ushell.demo.AppShellUIServiceSample", "/demoapps/AppShellUIServiceSample"),
            "AppStateFormSample-Action": AppImbededJson("sap.ushell.demo.AppStateFormSample", "/demoapps/AppStateFormSample"),
            "AppStateSample-Action": AppImbededJson("sap.ushell.demo.AppStateSample", "/demoapps/AppStateSample"),
            "BookmarkSample-Action": AppImbededJson("sap.ushell.demo.bookmark", "/demoapps/BookmarkSample"),
            "ClickjackingSample-Action": AppImbededJson("sap.ushell.demo.ClickjackingSample", "/demoapps/ClickjackingSample"),
            "ComponentEmbeddingSample-Action": AppImbededJson("sap.ushell.demo.ComponentEmbeddingSample", "/demoapps/ComponentEmbeddingSample"),
            "CrossAppStateSample-Action": AppImbededJson("sap.ushell.demo.CrossAppStateSample", "/demoapps/CrossAppStateSample"),
            "demoTiles-Action": AppImbededJson("sap.ushell.demo.demoTiles", "/demoapps/demoTiles"),
            "Fiori2AdaptationSampleApp-Action": AppImbededJson("sap.ushell.demo.Fiori2AdaptationSampleApp", "/demoapps/Fiori2AdaptationSampleApp"),
            "Fiori2AdaptationSampleApp2-Action": AppImbededJson("sap.ushell.demo.Fiori2AdaptationSampleApp2", "/demoapps/Fiori2AdaptationSampleApp2"),
            "FioriIframeApp-Action": AppImbededJson("sap.ushell.demo.FioriIframeApp", "/demoapps/FioriIframeApp"),
            "FioriSandboxDefaultApp-Action": AppImbededJson("sap.ushell.demo.FioriSandboxDefaultApp", "/demoapps/FioriSandboxDefaultApp"),
            "FioriToExtApp-Action": AppImbededJson("sap.ushell.demo.FioriToExtApp", "/demoapps/FioriToExtApp"),
            "FioriToExtAppTarget-Action": AppImbededJson("sap.ushell.demo.FioriToExtAppTarget", "/demoapps/FioriToExtAppTarget"),
            "HeaderCommonButtons-Action": AppImbededJson("sap.ushell.demo.HeaderCommonButtons", "/demoapps/HeaderCommonButtons"),
            "HelloWorldSampleApp-Action": AppImbededJson("sap.ushell.demo.HelloWorldSampleApp", "/demoapps/HelloWorldSampleApp"),
            "LaunchpadConfigFileExamples-Action": AppImbededJson("sap.ushell.demo.LaunchpadConfigFileExamples", "/demoapps/LaunchpadConfigFileExamples"),
            "PersSrv2Test-Action": AppImbededJson("sap.ushell.demo.PersSrv2Test", "/demoapps/PersSrv2Test"),
            "PersSrvTest-Action": AppImbededJson("sap.ushell.demo.PersSrvTest", "/demoapps/PersSrvTest"),
            "PostMessageTestApp-Action": AppImbededJson("sap.ushell.demo.PostMessageTestApp", "/demoapps/PostMessageTestApp"),
            "ReceiveParametersTestApp-Action": AppImbededJson("sap.ushell.demoapps.ReceiveParametersTestApp", "/demoapps/ReceiveParametersTestApp"),
            "RTATestApp-Action": AppImbededJson("sap.ushell.demo.RTATestApp", "/demoapps/RTATestApp"),
            "TargetResolutionTool-Action": AppImbededJson("sap.ushell.demo.TargetResolutionTool", "/demoapps/TargetResolutionTool"),
            "UserDefaults-Action": AppImbededJson("sap.ushell.demo.UserDefaults", "/demoapps/UserDefaults"),
            "ValidateUrlMessagePopoverSample-Action": AppImbededJson("sap.ushell.demo.ValidateUrlMessagePopoverSample", "/demoapps/ValidateUrlMessagePopoverSample"),
            "Action-toappnavsample": AppImbededJson("sap.ushell.demo.AppNavSample", "/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2"),
            "Action-toappcontextsample": AppImbededJson("sap.ushell.demo.AppContextSample", "/demoapps/AppContextSample"),
            "FioriToExtAppTargetIsolated-Action": AppImbededJson("sap.ushell.demo.FioriToExtAppTarget", "/demoapps/FioriToExtAppTarget")
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

    var oTestContentIsolated = {
        groups: [{
            id: "group_00",
            title: "Isolated",
            isPreset: true,
            isVisible: true,
            isDefaultGroup: true,
            isGroupLocked: false,
            tiles: tilesArray
        }, {
            id: "group_01",
            title: "Vis_Locked",
            isPreset: true,
            isVisible: true,
            isDefaultGroup: false,
            isGroupLocked: true,
            tiles: tilesArray
        }, {
            id: "group_02",
            title: "NotVis_NotLocked",
            isPreset: true,
            isVisible: false,
            isDefaultGroup: false,
            isGroupLocked: false,
            tiles: tilesArray
        }, {
            id: "group_03",
            title: "NotVis_Locked",
            isPreset: true,
            isVisible: false,
            isDefaultGroup: false,
            isGroupLocked: true,
            tiles: tilesArray
        }, {
            id: "group_04",
            title: "Vis_NotLocked",
            isPreset: true,
            isVisible: true,
            isDefaultGroup: false,
            isGroupLocked: false,
            tiles: tilesArray
        }],
        catalogs: [{
            id: "catalog_00",
            title: "Catalog 1",
            tiles: tilesArray
        }],
        applications: {
            "AppContextSample-Action": AppIsolatedJson("sap.ushell.demo.AppContextSample"),
            "AppLetterBoxing-Action": AppIsolatedJson("sap.ushell.demo.AppLetterBoxing"),
            "AppNavSample-Action": AppIsolatedJson("sap.ushell.demo.AppNavSample"),
            "AppNavSample2-Action": AppIsolatedJson("sap.ushell.demo.AppNavSample2"),
            "AppPersSample-Action": AppIsolatedJson("sap.ushell.demo.AppPersSample"),
            "AppPersSample2-Action": AppIsolatedJson("sap.ushell.demo.AppPersSample2"),
            "AppPersSample3-Action": AppIsolatedJson("sap.ushell.demo.AppPersSample3"),
            "AppShellUIRouter-Action": AppIsolatedJson("sap.ushell.demo.AppShellUIRouter"),
            "AppShellUIServiceSample-Action": AppIsolatedJson("sap.ushell.demo.AppShellUIServiceSample"),
            "AppStateFormSample-Action": AppIsolatedJson("sap.ushell.demo.AppStateFormSample"),
            "AppStateSample-Action": AppIsolatedJson("sap.ushell.demo.AppStateSample"),
            "BookmarkSample-Action": AppIsolatedJson("sap.ushell.demo.bookmark"),
            "ClickjackingSample-Action": AppIsolatedJson("sap.ushell.demo.ClickjackingSample"),
            "ComponentEmbeddingSample-Action": AppIsolatedJson("sap.ushell.demo.ComponentEmbeddingSample"),
            "CrossAppStateSample-Action": AppIsolatedJson("sap.ushell.demo.CrossAppStateSample"),
            "demoTiles-Action": AppIsolatedJson("sap.ushell.demo.demoTiles"),
            "Fiori2AdaptationSampleApp-Action": AppIsolatedJson("sap.ushell.demo.Fiori2AdaptationSampleApp"),
            "Fiori2AdaptationSampleApp2-Action": AppIsolatedJson("sap.ushell.demo.Fiori2AdaptationSampleApp2"),
            "FioriIframeApp-Action": AppIsolatedJson("sap.ushell.demo.FioriIframeApp"),
            "FioriSandboxDefaultApp-Action": AppIsolatedJson("sap.ushell.demo.FioriSandboxDefaultApp"),
            "FioriToExtApp-Action": AppIsolatedJson("sap.ushell.demo.FioriToExtApp"),
            "FioriToExtAppTarget-Action": AppIsolatedJson("sap.ushell.demo.FioriToExtAppTarget"),
            "HeaderCommonButtons-Action": AppIsolatedJson("sap.ushell.demo.HeaderCommonButtons"),
            "HelloWorldSampleApp-Action": AppIsolatedJson("sap.ushell.demo.HelloWorldSampleApp"),
            "LaunchpadConfigFileExamples-Action": AppIsolatedJson("sap.ushell.demo.LaunchpadConfigFileExamples"),
            "PersSrv2Test-Action": AppIsolatedJson("sap.ushell.demo.PersSrv2Test"),
            "PersSrvTest-Action": AppIsolatedJson("sap.ushell.demo.PersSrvTest"),
            "PostMessageTestApp-Action": AppIsolatedJson("sap.ushell.demo.PostMessageTestApp"),
            "ReceiveParametersTestApp-Action": AppIsolatedJson("sap.ushell.demoapps.ReceiveParametersTestApp"),
            "RTATestApp-Action": AppIsolatedJson("sap.ushell.demo.RTATestApp"),
            "TargetResolutionTool-Action": AppIsolatedJson("sap.ushell.demo.TargetResolutionTool"),
            "UserDefaults-Action": AppIsolatedJson("sap.ushell.demo.UserDefaults"),
            "ValidateUrlMessagePopoverSample-Action": AppIsolatedJson("sap.ushell.demo.ValidateUrlMessagePopoverSample"),
            "Action-toappnavsample": AppIsolatedJson("sap.ushell.demo.AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2#Action-toappnavsample"),
            "Action-toappcontextsample": AppIsolatedJson("sap.ushell.demo.AppContextSample"),
            "FioriToExtAppTargetIsolated-Action": AppIsolatedJson("sap.ushell.demo.FioriToExtAppTarget")
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

    function writeToUshellConfig (oConfig) {
        var oLaunchPageAdapterConfig = ObjectPath.create("sap-ushell-config.services.LaunchPage.adapter.config");
        oLaunchPageAdapterConfig.groups = oConfig.groups;
        oLaunchPageAdapterConfig.catalogs = oConfig.catalogs;
        ObjectPath.create("sap-ushell-config.services.NavTargetResolution.adapter.config").applications = oConfig.applications;
        var oPersonalizationAdapterConfig = ObjectPath.create("sap-ushell-config.services.Personalization.adapter.config");
        oPersonalizationAdapterConfig.personalizationData = oConfig.personalizationData;
        oPersonalizationAdapterConfig.storageType = oConfig.personalizationStorageType;
        ObjectPath.create("sap-ushell-config.services.Search.adapter.config").searchResultPath = oConfig.search.searchResultPath;
    }

    var oUriParameters = new URLSearchParams(window.location.search);
    if (oUriParameters.get("sap-isolation-enabled") === "true") {
        writeToUshellConfig(oTestContentIsolated);
    } else {
        writeToUshellConfig(oTestContent);
    }

    // TODO: temp work-around, "" should be removed from apps
    delete ObjectPath.get("sap-ushell-config.services.NavTargetResolution.adapter.config").applications[""];
});
