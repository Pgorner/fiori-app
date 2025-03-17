// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

function getUrlParams () {
    "use strict";

    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });

    // Change homepage content (fioriDemoConfigCards includes several Cards)
    vars.demoConfig = "fioriDemoConfigCards";
    return vars;
}

var configFileUrl = decodeURIComponent(getUrlParams().configFileUrl),
    sapUshellConfig = {
        ushell: {
            spaces: {
                enabled: true
            },
            contentProviders: {
                providerInfo: {
                    enabled: true
                }
            }
        },
        defaultRenderer: "fiori2",
        renderers: {
            fiori2: {
                componentData: {
                    config: {
                        applications: {
                            "Shell-home": {
                                optimizeTileLoadingThreshold: 200,
                                enableEasyAccess: true,
                                enableEasyAccessSAPMenu: true,
                                enableEasyAccessSAPMenuSearch: true,
                                enableEasyAccessUserMenu: true,
                                enableEasyAccessUserMenuSearch: true,
                                enableCatalogSearch: true,
                                enableCatalogTagFilter: true,
                                disableSortedLockedGroups: false,
                                enableTileActionsIcon: false,
                                appFinderDisplayMode: "appBoxes", //"tiles"
                                enableHideGroups: true,
                                homePageGroupDisplay: "scroll",
                                enableHomePageSettings: true
                            }
                        },
                        rootIntent: "Shell-home"
                    }
                }
            }
        },
        services: {
            Personalization: {
                adapter: {
                    module: "sap.ushell.adapters.local.PersonalizationAdapter"
                }
            },
            CommonDataModel: {
                adapter: {
                    module: "sap.ushell.adapters.cdm.PagesCommonDataModelAdapter"
                }
            },
            LaunchPage: {
                adapter: {
                    module: "sap.ushell.adapters.local.FlpLaunchPageAdapter",
                    config: {
                        catalogs: [{
                            id: "/UI2/FLP_DEMO_TILE_TYPES",
                            title: "Sample Application Catalog",
                            tiles: [{
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TR99M0M2CG9A3QQQSRILN",
                                properties: {
                                    title: "News tile",
                                    subtitle: "Custom tile",
                                    info: "Not supported on local",
                                    icon: ""
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.DynamicTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKOBI78HSAT",
                                properties: {
                                    title: "Dynamic Tile Catalogs Count",
                                    info: "CDM Autotest: Dyn Tile",
                                    icon: "sap-icon://heating-cooling",
                                    targetURL: "#DynamicTileCount-display",
                                    serviceUrl: "ServiceUrlMock"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.DynamicTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TIH53H32KCRLQQ0N2LS33",
                                properties: {
                                    title: "Dynamic App Launcher",
                                    info: "",
                                    icon: "sap-icon://lateness",
                                    targetURL: "#Action-toappstatesample",
                                    serviceUrl: "ServiceUrlMock"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.DynamicTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_PAGE_COMPOSITION:00O2TIH53H32S2V2L1LMYJKDQ",
                                properties: {
                                    title: "Maintain Pages",
                                    info: "",
                                    icon: "sap-icon://Fiori2/F0006",
                                    targetURL: "#FLPPageTemplate-manage",
                                    serviceUrl: "ServiceUrlMock"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKKYF3GFMV5",
                                properties: {
                                    title: "App Navigation Sample 2",
                                    info: "CDM Autotest: UI5",
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-data-access",
                                    targetURL: "#Action-toappnavsample2"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TIRMU88BQCQ5RDZWPE3R1",
                                properties: {
                                    title: "Bookmark Sample",
                                    info: "",
                                    icon: "sap-icon://favorite",
                                    targetURL: "#Action-toBookmark"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8PAVERE5Y6X",
                                properties: {
                                    title: "App Dependency Test 1",
                                    info: "",
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-face-very-happy",
                                    targetURL: "#Action-toappdeptest1"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8PJ7NM5WCX8",
                                properties: {
                                    title: "App Dependency Test 2",
                                    info: "",
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-face-okey-dokey",
                                    targetURL: "#Action-toappdeptest2"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M46KL4UDA5UXC6W",
                                properties: {
                                    title: "App Dependency Test Failure",
                                    info: "",
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-face-bad",
                                    targetURL: "#Action-toappdeptestfail"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRLX119LRGXY",
                                properties: {
                                    title: "App Personalization Sample 1",
                                    info: "",
                                    icon: "sap-icon://multi-select",
                                    targetURL: "#Action-toappperssample"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRLX0DBYV1JA",
                                properties: {
                                    title: "App Personalization Sample 2",
                                    info: "",
                                    icon: "sap-icon://table-chart",
                                    targetURL: "#Action-toappperssample2"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRMNPODMDLFC",
                                properties: {
                                    title: "App Personalization Sample 3",
                                    info: "",
                                    icon: "sap-icon://undefined/table-view",
                                    targetURL: "#Action-toappperssample3"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRMVU6Y78NGL",
                                properties: {
                                    title: "Appstate - Fiori Icons",
                                    info: "",
                                    icon: "sap-icon://undefined/picture",
                                    targetURL: "#Action-toappstatesample"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                                properties: {
                                    title: "Start SU01",
                                    info: "",
                                    icon: "sap-icon://undefined/role",
                                    targetURL: "#Action-tosu01"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M2CG7HQSW9YW5N1",
                                properties: {
                                    title: "Product Search",
                                    info: "",
                                    icon: "sap-icon://Fiori2/F0344",
                                    targetURL: "#Action-toWdaProductSearch"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_EXT_NAV:00O2TR99M0M2CFA8A0PYWDCK8",
                                properties: {
                                    title: "Bridge",
                                    info: "static URL in tile",
                                    icon: "sap-icon://forward",
                                    targetURL: "https://host/#/"
                                }
                            }]
                        }]
                    }
                }
            },
            VisualizationDataProvider: {
                adapter: {
                    module: "sap.ushell.adapters.local.FlpLaunchPageAdapter",
                    config: {
                        catalogs: [{
                            id: "/UI2/FLP_DEMO_TILE_TYPES",
                            title: "Sample Application Catalog",
                            tiles: [{
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TR99M0M2CG9A3QQQSRILN",
                                properties: {
                                    title: "News tile",
                                    subtitle: "Custom tile",
                                    info: "Not supported on local",
                                    icon: ""
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.DynamicTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKOBI78HSAT",
                                properties: {
                                    title: "Dynamic Tile Catalogs Count",
                                    info: "CDM Autotest: Dyn Tile",
                                    icon: "sap-icon://heating-cooling",
                                    targetURL: "#DynamicTileCount-display",
                                    serviceUrl: "ServiceUrlMock"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.DynamicTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TIH53H32KCRLQQ0N2LS33",
                                properties: {
                                    title: "Dynamic App Launcher",
                                    info: "",
                                    icon: "sap-icon://lateness",
                                    targetURL: "#Action-toappstatesample",
                                    serviceUrl: "ServiceUrlMock"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.DynamicTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_PAGE_COMPOSITION:00O2TIH53H32S2V2L1LMYJKDQ",
                                properties: {
                                    title: "Maintain Pages",
                                    info: "",
                                    icon: "sap-icon://Fiori2/F0006",
                                    targetURL: "#FLPPageTemplate-manage",
                                    serviceUrl: "ServiceUrlMock"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKKYF3GFMV5",
                                properties: {
                                    title: "App Navigation Sample 2",
                                    info: "CDM Autotest: UI5",
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-data-access",
                                    targetURL: "#Action-toappnavsample2"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TIRMU88BQCQ5RDZWPE3R1",
                                properties: {
                                    title: "Bookmark Sample",
                                    info: "",
                                    icon: "sap-icon://favorite",
                                    targetURL: "#Action-toBookmark"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8PAVERE5Y6X",
                                properties: {
                                    title: "App Dependency Test 1",
                                    info: "",
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-face-very-happy",
                                    targetURL: "#Action-toappdeptest1"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8PJ7NM5WCX8",
                                properties: {
                                    title: "App Dependency Test 2",
                                    info: "",
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-face-okey-dokey",
                                    targetURL: "#Action-toappdeptest2"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M46KL4UDA5UXC6W",
                                properties: {
                                    title: "App Dependency Test Failure",
                                    info: "",
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-face-bad",
                                    targetURL: "#Action-toappdeptestfail"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRLX119LRGXY",
                                properties: {
                                    title: "App Personalization Sample 1",
                                    info: "",
                                    icon: "sap-icon://multi-select",
                                    targetURL: "#Action-toappperssample"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRLX0DBYV1JA",
                                properties: {
                                    title: "App Personalization Sample 2",
                                    info: "",
                                    icon: "sap-icon://table-chart",
                                    targetURL: "#Action-toappperssample2"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRMNPODMDLFC",
                                properties: {
                                    title: "App Personalization Sample 3",
                                    info: "",
                                    icon: "sap-icon://undefined/table-view",
                                    targetURL: "#Action-toappperssample3"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRMVU6Y78NGL",
                                properties: {
                                    title: "Appstate - Fiori Icons",
                                    info: "",
                                    icon: "sap-icon://undefined/picture",
                                    targetURL: "#Action-toappstatesample"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                                properties: {
                                    title: "Start SU01",
                                    info: "",
                                    icon: "sap-icon://undefined/role",
                                    targetURL: "#Action-tosu01"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M2CG7HQSW9YW5N1",
                                properties: {
                                    title: "Product Search",
                                    info: "",
                                    icon: "sap-icon://Fiori2/F0344",
                                    targetURL: "#Action-toWdaProductSearch"
                                }
                            }, {
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_EXT_NAV:00O2TR99M0M2CFA8A0PYWDCK8",
                                properties: {
                                    title: "Bridge",
                                    info: "static URL in tile",
                                    icon: "sap-icon://forward",
                                    targetURL: "https://host/#/"
                                }
                            }]
                        }]
                    }
                }
            },
            PagePersistence: {
                adapter: {
                    module: "sap.ushell.adapters.local.PagePersistenceAdapter",
                    config: {
                        dataLoad: {
                            "/UI2/FLP_DEMO_PAGE": {
                                page: {
                                    id: "/UI2/FLP_DEMO_PAGE",
                                    title: "UI2 FLP Demo - Test Page",
                                    description: "This page is used for testing the pages runtime",
                                    sections: [{
                                        id: "id-1566210576050-45",
                                        title: "Custom & Dynamic Tiles",
                                        sectionIndex: 1,
                                        viz: [{
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TR99M0M2CG9A3QQQSRILN",
                                            id: "00O2TIH53H32S6MBXW7CNI5UX",
                                            itemIndex: 1,
                                            targetMappingId: "",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TR99M0M2CG9A3QQQSRILN"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKOBI78HSAT",
                                            id: "00O2TIH53H32S6MBXW7CNIC6H",
                                            itemIndex: 2,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKOQK5LN79H",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKOBI78HSAT"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TIH53H32KCRLQQ0N2LS33",
                                            id: "00O2TIH53H32S6MBXW7CNIII1",
                                            itemIndex: 3,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFROG2SBFAVCC",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TIH53H32KCRLQQ0N2LS33"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_PAGE_COMPOSITION:00O2TIH53H32S2V2L1LMYJKDQ",
                                            id: "00O2TIH53H32S6MBXW7CNIOTL",
                                            itemIndex: 4,
                                            targetMappingId: "",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_PAGE_COMPOSITION:00O2TIH53H32S2V2L1LMYJKDQ"
                                        }]
                                    }, {
                                        id: "id-1566214947284-79",
                                        title: "Navigation",
                                        sectionIndex: 2,
                                        viz: [{
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKKYF3GFMV5",
                                            id: "00O2TIH53H32S6MBXW7CNIV55",
                                            itemIndex: 1,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKKOFCWT7Y7",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKKYF3GFMV5"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TIRMU88BQCQ5RDZWPE3R1",
                                            id: "00O2TIH53H32S6MBXW7CNJ1GP",
                                            itemIndex: 2,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TIRMU88BQCQ5BICIVK9D8",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TIRMU88BQCQ5RDZWPE3R1"
                                        }]
                                    }, {
                                        id: "id-1566215847905-200",
                                        title: "Empty Group 1",
                                        sectionIndex: 3,
                                        viz: []
                                    }, {
                                        id: "id-1566215854800-201",
                                        title: "Empty Group 2",
                                        sectionIndex: 4,
                                        viz: []
                                    }, {
                                        id: "id-1566214976737-80",
                                        title: "Application Dependencies",
                                        sectionIndex: 5,
                                        viz: [{
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8PAVERE5Y6X",
                                            id: "00O2TIH53H32S6MBXW7CNJ7S9",
                                            itemIndex: 1,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8OPKFG65MAX",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8PAVERE5Y6X"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8PJ7NM5WCX8",
                                            id: "00O2TIH53H32S6MBXW7CNJE3T",
                                            itemIndex: 2,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8OSDFPPKROS",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M2FG8PJ7NM5WCX8"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M46KL4UDA5UXC6W",
                                            id: "00O2TIH53H32S6MBXW7CNJKFD",
                                            itemIndex: 3,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M46KL4RJ04WN5YQ",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_AppDependencies:00O2TR99M0M46KL4UDA5UXC6W"
                                        }]
                                    }, {
                                        id: "id-1566215082839-82",
                                        title: "App Personalization",
                                        sectionIndex: 6,
                                        viz: [{
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRLX119LRGXY",
                                            id: "00O2TIH53H32S6MBXW7CNJQQX",
                                            itemIndex: 1,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRNRKRQZL88Y",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRLX119LRGXY"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRLX0DBYV1JA",
                                            id: "00O2TIH53H32S6MBXW7CNJX2H",
                                            itemIndex: 2,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRNTOF27F8JP",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRLX0DBYV1JA"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRMNPODMDLFC",
                                            id: "00O2TIH53H32S6MBXW7CNK3E1",
                                            itemIndex: 3,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRNVLK5FQ3NS",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRMNPODMDLFC"
                                        }]
                                    }, {
                                        id: "id-1566215110400-83",
                                        title: "App State",
                                        sectionIndex: 7,
                                        viz: [{
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRMVU6Y78NGL",
                                            id: "00O2TIH53H32S6MBXW7CNK9PL",
                                            itemIndex: 1,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFROG2SBFAVCC",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRMVU6Y78NGL"
                                        }]
                                    }, {
                                        id: "id-1566215201774-84",
                                        title: "WDA & WebGUI",
                                        sectionIndex: 8,
                                        viz: [{
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                                            id: "00O2TIH53H32S6MBXW7CNKG15",
                                            itemIndex: 1,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9ELFP30JMOE",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M2CG7HQSW9YW5N1",
                                            id: "00O2TIH53H32S6MBXW7CNKMCP",
                                            itemIndex: 2,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M2CG7HLUUA24E4K",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M2CG7HQSW9YW5N1"
                                        }]
                                    }, {
                                        id: "id-1566215863686-202",
                                        title: "URL Tiles",
                                        sectionIndex: 9,
                                        viz: [{
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_EXT_NAV:00O2TR99M0M2CFA8A0PYWDCK8",
                                            id: "00O2TIH53H32S6MBXW7CNKSO9",
                                            itemIndex: 1,
                                            targetMappingId: "",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_EXT_NAV:00O2TR99M0M2CFA8A0PYWDCK8"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_DOCUMENTATION:00O2TIH53H32S2V2VHIJ067MZ",
                                            id: "00O2TIH53H32S6MBXW7CNKYZT",
                                            itemIndex: 2,
                                            targetMappingId: "",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_DOCUMENTATION:00O2TIH53H32S2V2VHIJ067MZ"
                                        }]
                                    }]
                                },
                                visualizations: {},
                                vizTypes: {}
                            },
                            ZPAGE2: {
                                page: {
                                    id: "ZPAGE2",
                                    title: "ZPAGE2",
                                    description: "This page is used for testing the pages runtime",
                                    sections: [{
                                        id: "id-1566210576050-45",
                                        title: "Demo Section",
                                        sectionIndex: 1,
                                        viz: [{
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TIH53H32KCRLQQ0N2LS33",
                                            id: "00O2TIH53H32S6MBXW7CNIII1",
                                            itemIndex: 3,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFROG2SBFAVCC",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_TILE_TYPES:00O2TIH53H32KCRLQQ0N2LS33"
                                        }, {
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_PAGE_COMPOSITION:00O2TIH53H32S2V2L1LMYJKDQ",
                                            id: "00O2TIH53H32S6MBXW7CNIOTL",
                                            itemIndex: 4,
                                            targetMappingId: "",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_PAGE_COMPOSITION:00O2TIH53H32S2V2L1LMYJKDQ"
                                        }]
                                    }, {
                                        id: "id-1566214947284-79",
                                        title: "Autotest Section",
                                        sectionIndex: 2,
                                        viz: [{
                                            catalogTileId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKKYF3GFMV5",
                                            id: "00O2TIH53H32S6MBXW7CNIV55",
                                            itemIndex: 1,
                                            targetMappingId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKKOFCWT7Y7",
                                            vizId: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H34ATOKKYF3GFMV5"
                                        }]
                                    }]
                                },
                                visualizations: {},
                                vizTypes: {}
                            },
                            EMPTY_PAGE: {
                                page: {
                                    id: "EMPTY_PAGE",
                                    title: "Empty Page",
                                    description: "This page is empty",
                                    sections: []
                                },
                                visualizations: {},
                                vizTypes: {}
                            }
                        }
                    }
                }
            },
            Menu: {
                adapter: {
                    module: "sap.ushell.adapters.local.MenuAdapter",
                    config: {
                        enabled: true,
                        menuData: [{
                            id: "/UI2/FLP_DEMO_SPACE",
                            label: "Test Space 1",
                            type: "Space",
                            isContainer: false,
                            children: [{
                                id: "/UI2/FLP_DEMO_PAGE",
                                label: "UI2 FLP Demo - Test Page",
                                type: "Page",
                                isContainer: true,
                                children: []
                            }]
                        }, {
                            id: "ZSPACE2",
                            label: "Test Space 2",
                            type: "Space",
                            isContainer: false,
                            children: [{
                                id: "ZPAGE2",
                                label: "Page 2",
                                type: "Page",
                                isContainer: true,
                                children: []
                            }]
                        }, {
                            id: "EMPTY_SPACE",
                            label: "Empty Space",
                            type: "Space",
                            isContainer: false,
                            children: [{
                                id: "EMPTY_PAGE",
                                label: "Empty Page",
                                type: "Page",
                                isContainer: true,
                                children: []
                            }]
                        }, {
                            id: "BROKEN_SPACE",
                            label: "Broken Space",
                            type: "Space",
                            isContainer: false,
                            children: [{
                                id: "BROKEN_PAGE",
                                label: "Broken Page",
                                type: "Page",
                                isContainer: true,
                                children: []
                            }]
                        }, {
                            id: "ZSPACE5",
                            label: "Test Space 5",
                            type: "Space",
                            isContainer: false,
                            children: [{
                                id: "ZPAGE2",
                                label: "Test Page 2",
                                type: "Page",
                                isContainer: true,
                                children: []
                            }, {
                                id: "EMPTY_PAGE",
                                label: "Empty Page",
                                type: "Page",
                                isContainer: true,
                                children: []
                            }]
                        }]

                    }
                }
            },
            Ui5ComponentLoader: {
                config: {
                    loadDefaultDependencies: false
                }
            },
            Notifications: {
                config: {
                    enabled: true,
                    serviceUrl: "/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model",
                    //serviceUrl: "/sap/opu/odata4/iwngw/notification/default/iwngw/notification_srv/0001",
                    pollingIntervalInSeconds: 30
                }
            },
            UserInfo: {
                adapter: {
                    config: {
                        themes: [
                            { id: "sap_belize_plus", name: "SAP Belize Plus"},
                            { id: "sap_belize", name: "SAP Belize"},
                            { id: "theme1_id", name: "Custom Theme"},
                            { id: "sap_fiori_3_hcb", name: "SAP Quartz HCB"},
                            { id: "sap_fiori_3_hcw", name: "SAP Quartz HCW"},
                            { id: "sap_fiori_3", name: "SAP Quartz Light"},
                            { id: "sap_fiori_3_dark", name: "SAP Quartz Dark"},
                            { id: "sap_horizon", name: "SAP Morning Horizon"},
                            { id: "sap_horizon_dark", name: "SAP Evening Horizon"},
                            { id: "sap_horizon_hcw", name: "SAP HCW (SAP Horizon)"},
                            { id: "sap_horizon_hcb", name: "SAP HCB (SAP Horizon)"}
                        ]
                    }
                }
            },
            ClientSideTargetResolution: {
                adapter: {
                    module: "sap.ushell.adapters.local.ClientSideTargetResolutionAdapter",
                    config: {
                        inbounds: {
                            "Action-toappnavsample": {
                                semanticObject: "Action",
                                action: "toappnavsample",
                                title: "App Navigation Sample 1",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                    ui5ComponentName: "sap.ushell.demo.AppNavSample",
                                    url: "/sap/bc/ui5_ui5/ui2/appnavsample/"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "DynamicTileCount-display": {
                                semanticObject: "DynamicTileCount",
                                action: "display",
                                title: "App Navigation Sample 1",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                    ui5ComponentName: "sap.ushell.demo.AppNavSample",
                                    url: "/sap/bc/ui5_ui5/ui2/appnavsample/"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappstatesample": {
                                semanticObject: "Action",
                                action: "toappstatesample",
                                title: "Application State Example (Icons)",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                                    ui5ComponentName: "sap.ushell.demo.AppStateSample",
                                    url: "/sap/bc/ui5_ui5/ui2/appstate/"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappnavsample2": {
                                semanticObject: "Action",
                                action: "toappnavsample2",
                                title: "App Navigation Sample 2",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample2",
                                    ui5ComponentName: "sap.ushell.demo.AppNavSample2",
                                    url: "/ushell/test-resources/sap/ushell/demoapps/AppNavSample2"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toBookmark": {
                                semanticObject: "Action",
                                action: "toBookmark",
                                title: "Bookmark Sample",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.bookmark",
                                    ui5ComponentName: "sap.ushell.demo.bookmark",
                                    url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/BookmarkSample"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappdeptest1": {
                                semanticObject: "Action",
                                action: "toappdeptest1",
                                title: "App Dependency Test 1 (Original App)",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.test.AppDepTest1",
                                    ui5ComponentName: "sap.ushell.test.AppDepTest1",
                                    url: "/sap/bc/ui5_ui5/ui2/app_dep_test_1"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappdeptest2": {
                                semanticObject: "Action",
                                action: "toappdeptest2",
                                title: "App Dependency Test 2 (Extension App)",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.test.AppDepTest2",
                                    ui5ComponentName: "sap.ushell.test.AppDepTest2",
                                    url: "/sap/bc/ui5_ui5/ui2/app_dep_test_2"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappdeptestfail": {
                                semanticObject: "Action",
                                action: "toappdeptestfail",
                                title: "App Dependency Test provoking load failure",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.test.AppDepTestF",
                                    ui5ComponentName: "sap.ushell.test.AppDepTestF",
                                    url: "/sap/bc/ui5_ui5/ui2/app_dep_test_f"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappperssample": {
                                semanticObject: "Action",
                                action: "toappperssample",
                                title: "App Personalization Sample 1",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample",
                                    ui5ComponentName: "sap.ushell.demo.AppPersSample",
                                    url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppPersSample"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappperssample2": {
                                semanticObject: "Action",
                                action: "toappperssample2",
                                title: "App Personalization Sample 2",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample2",
                                    ui5ComponentName: "sap.ushell.demo.AppPersSample2",
                                    url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppPersSample2"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappperssample3": {
                                semanticObject: "Action",
                                action: "toappperssample3",
                                title: "App Personalization Sample 3",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample3",
                                    ui5ComponentName: "sap.ushell.demo.AppPersSample3",
                                    url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppPersSample3"
                                },
                                signature: {
                                    parameters: {}
                                }
                            }
                        }
                    }
                }
            },
            NavTargetResolution: {
                config: {
                    enableClientSideTargetResolution: true
                }
            },
            NavigationDataProvider: {
                adapter: {
                    module: "sap.ushell.adapters.local.ClientSideTargetResolutionAdapter",
                    config: {
                        inbounds: {
                            "Action-toappnavsample": {
                                semanticObject: "Action",
                                action: "toappnavsample",
                                title: "App Navigation Sample 1",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                    ui5ComponentName: "sap.ushell.demo.AppNavSample",
                                    url: "/sap/bc/ui5_ui5/ui2/appnavsample/"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "DynamicTileCount-display": {
                                semanticObject: "DynamicTileCount",
                                action: "display",
                                title: "App Navigation Sample 1",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                    ui5ComponentName: "sap.ushell.demo.AppNavSample",
                                    url: "/sap/bc/ui5_ui5/ui2/appnavsample/"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappstatesample": {
                                semanticObject: "Action",
                                action: "toappstatesample",
                                title: "Application State Example (Icons)",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                                    ui5ComponentName: "sap.ushell.demo.AppStateSample",
                                    url: "/sap/bc/ui5_ui5/ui2/appstate/"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappnavsample2": {
                                semanticObject: "Action",
                                action: "toappnavsample2",
                                title: "App Navigation Sample 2",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample2",
                                    ui5ComponentName: "sap.ushell.demo.AppNavSample2",
                                    url: "/ushell/test-resources/sap/ushell/demoapps/AppNavSample2"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toBookmark": {
                                semanticObject: "Action",
                                action: "toBookmark",
                                title: "Bookmark Sample",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.bookmark",
                                    ui5ComponentName: "sap.ushell.demo.bookmark",
                                    url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/BookmarkSample"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappdeptest1": {
                                semanticObject: "Action",
                                action: "toappdeptest1",
                                title: "App Dependency Test 1 (Original App)",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.test.AppDepTest1",
                                    ui5ComponentName: "sap.ushell.test.AppDepTest1",
                                    url: "/sap/bc/ui5_ui5/ui2/app_dep_test_1"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappdeptest2": {
                                semanticObject: "Action",
                                action: "toappdeptest2",
                                title: "App Dependency Test 2 (Extension App)",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.test.AppDepTest2",
                                    ui5ComponentName: "sap.ushell.test.AppDepTest2",
                                    url: "/sap/bc/ui5_ui5/ui2/app_dep_test_2"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappdeptestfail": {
                                semanticObject: "Action",
                                action: "toappdeptestfail",
                                title: "App Dependency Test provoking load failure",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.test.AppDepTestF",
                                    ui5ComponentName: "sap.ushell.test.AppDepTestF",
                                    url: "/sap/bc/ui5_ui5/ui2/app_dep_test_f"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappperssample": {
                                semanticObject: "Action",
                                action: "toappperssample",
                                title: "App Personalization Sample 1",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample",
                                    ui5ComponentName: "sap.ushell.demo.AppPersSample",
                                    url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppPersSample"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappperssample2": {
                                semanticObject: "Action",
                                action: "toappperssample2",
                                title: "App Personalization Sample 2",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample2",
                                    ui5ComponentName: "sap.ushell.demo.AppPersSample2",
                                    url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppPersSample2"
                                },
                                signature: {
                                    parameters: {}
                                }
                            },
                            "Action-toappperssample3": {
                                semanticObject: "Action",
                                action: "toappperssample3",
                                title: "App Personalization Sample 3",
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample3",
                                    ui5ComponentName: "sap.ushell.demo.AppPersSample3",
                                    url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppPersSample3"
                                },
                                signature: {
                                    parameters: {}
                                }
                            }
                        }
                    }
                }
            }
        },
        bootstrapPlugins: {
            NotificationsSampleData: {
                component: "sap.ushell.demo.NotificationsSampleData",
                url: "../../../../../test-resources/sap/ushell/demoapps/NotificationsSampleData"
            }
        }
    };

var oXHR = new XMLHttpRequest();
if (configFileUrl !== "undefined") {
    oXHR.open("GET", configFileUrl, false);
    oXHR.onreadystatechange = function () {
        "use strict";
        if (this.status === 200 && this.readyState === 4) {
            sapUshellConfig = JSON.parse(oXHR.responseText);
        }
    };
    oXHR.send();
}

window["sap-ushell-config"] = sapUshellConfig;
