// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/shells/cdm/cep/CardDescriptors/StackedColumnCard",
    "sap/ushell/shells/cdm/cep/CardDescriptors/TableCard",
    "sap/ushell/shells/cdm/cep/TileDescriptors/DynamicTile",
    "sap/ushell/shells/cdm/cep/TileDescriptors/DynamicTile2",
    "sap/ushell/shells/cdm/cep/TileDescriptors/StaticTile",
    "sap/ushell/shells/cdm/cep/TileDescriptors/StaticTile2",
    "sap/ushell/shells/cdm/cep/TileDescriptors/LunchTile"
], function (
    DescriptorStackedColumnCard,
    DescriptorTableCard,
    DescriptorDynamicTile,
    DescriptorDynamicTile2,
    DescriptorStaticTile,
    DescriptorStaticTile2,
    DescriptorLunchTile
) {
    "use strict";

    /* eslint-disable max-len */
    var data = {
        visualizations: {
            nodes: [
                {
                    id: "1fac2d11-e9d3-4f23-8ef5-57475030c5c3#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://disconnected"
                                },
                                deviceTypes: {
                                    phone: true,
                                    tablet: true,
                                    desktop: true
                                }
                            },
                            "sap.app": {
                                info: "",
                                title: "Dynamic Tile for Testing",
                                subTitle: "Northwind V2",
                                dataSources: {
                                    dataSource: {
                                        uri: "/dynamic_dest/NorthwindV2",
                                        type: "JSON"
                                    },
                                    NorthwindV2: {
                                        uri: "/dynamic_dest/NorthwindV2",
                                        type: "JSON"
                                    }
                                },
                                description: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "1fac2d11-e9d3-4f23-8ef5-57475030c5c3",
                                    inboundId: "1fac2d11-e9d3-4f23-8ef5-57475030c5c3___GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "Products/$count",
                                    refresh: 0,
                                    dataSource: "NorthwindV2"
                                }
                            }
                        },
                        schemaVersion: "3.2.0"
                    },
                    descriptorResources: null,
                    indicatorDataSource: {
                        url: "/dynamic_dest/NorthwindV2/Products/$count",
                        refreshInterval: 0
                    },
                    targetAppIntent: {
                        semanticObject: "Action",
                        action: "toappnavsample"
                    }
                },
                {
                    id: "provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {}
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "provider1_f95ad84a-65d0-4c39-9a67-09a4efe04f92#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {}
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "provider1_a152d792-a43e-48eb-aafd-51451a6168e9#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {}
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {}
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "provider2_2ce8c859-b668-40d8-9c22-3a7dc018afd3#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {}
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "provider2_1e504721-8532-4a80-8fdd-0d88744c336f#Default-VizId",
                    type: "sap.card",
                    descriptor: {
                        value: {}
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId",
                    type: "sap.card",
                    descriptor: {
                        value: {}
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "0a05ce64-1564-4a9f-9689-9b10ddd5502b#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "Local",
                                title: "Local application",
                                subTitle: "Local application"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "0a05ce64-1564-4a9f-9689-9b10ddd5502b",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "1c9a003c-2021-4d5d-806f-04a9392026a3_Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "",
                                title: "1!@#$%^&*(",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "1c9a003c-2021-4d5d-806f-04a9392026a3",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "43f6c18e-b071-40b7-88d1-d382abcc90ec_Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "",
                                title: "Manage Central Purchase Contract",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "43f6c18e-b071-40b7-88d1-d382abcc90ec",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "6bad6182-3907-4583-8e30-38c2a7f461ea#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "info",
                                title: "CEP Search - Google search",
                                subTitle: "subtitle"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "6bad6182-3907-4583-8e30-38c2a7f461ea",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "7fa75b6d-1068-4340-ad1a-0470bf9cd6cc_Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "",
                                title: "Analyze Detailed Statement Purchasing Rebates",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "7fa75b6d-1068-4340-ad1a-0470bf9cd6cc",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "904f4584-6db3-435f-8914-e718dd211562#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://general-leave-request"
                                }
                            },
                            "sap.app": {
                                info: "Success Factors",
                                title: "My Leave Request",
                                subTitle: "Request some time off"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "904f4584-6db3-435f-8914-e718dd211562",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "9aa8531a-9da6-441f-9f11-bee659865acd_Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "",
                                title: "Display Business Volume",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "9aa8531a-9da6-441f-9f11-bee659865acd",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "be8d57e3-6bef-4515-b54a-a4d4c3e2d059_Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "",
                                title: "yael local app",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "be8d57e3-6bef-4515-b54a-a4d4c3e2d059",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "c68476c6-b21e-4805-9c41-71e1ccf68c80_Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://settings"
                                }
                            },
                            "sap.app": {
                                info: "Site Editor",
                                title: "Manage Site",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "c68476c6-b21e-4805-9c41-71e1ccf68c80",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cep.basic1_APP-7B49C959003D4BA682DBE84ACE54_42F2E9AFC4EF1EE99CCED5F62F9E0EF6_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://drill-down"
                                }
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                title: "WDA static - Analyze Detailed Statement Purchasing Rebates"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cep.basic1_APP-7B49C959003D4BA682DBE84ACE54",
                                    inboundId: "42F2E9AFC4EF1EE99CCED5F62F9E0EF6_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cep.basic1_APP-8794C43AD1EB242883E11D593FE8_6FMR9SFQJTA0DANFPS0FWZ03B",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0021"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR-PO",
                                title: "UI5 Static - My Purchasing Document Items - Professional"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cep.basic1_APP-8794C43AD1EB242883E11D593FE8",
                                    inboundId: "6FMR9SFQJTA0DANL7RF9V48YU"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0547B"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cep.basic1_APP-GUID8C89830A8A811EBF8C1384E8_FA163EDF73161ED59DE8784EC3AA40D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0002"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "SAP GUI - Assign and Process Purchase Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cep.basic1_APP-GUID8C89830A8A811EBF8C1384E8",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AA40D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cep.basic1_wda04761F3076438994B367369A2AB_42F2E9AFC4EF1EE99CCED5F62F9E0EF6_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://drill-down"
                                }
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                title: "WDA static - Analyze Detailed Statement Purchasing Rebates"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cep.basic1_wda04761F3076438994B367369A2AB",
                                    inboundId: "42F2E9AFC4EF1EE99CCED5F62F9E0EF6_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cep.basic2_APP-GUID8C89830A8A811EBF8C1384E8_FA163EDF73161ED59DE8784EC3AA40D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0002"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "SAP GUI - Assign and Process Purchase Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cep.basic2_APP-GUID8C89830A8A811EBF8C1384E8",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AA40D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cep.basic2_test_catalog_app_RandomURL-Launcher",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "",
                                title: "test_catalog_app",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cep.basic2_test_catalog_app",
                                    inboundId: "semantic_object-action",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.cdm32_workpage_APP_SFSF_DEMO_COMP_BUDGET_VIZ_SFSF_DEMO_COMP_BUDGET",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "Compensation Budget",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.cdm32_workpage_APP_SFSF_DEMO_COMP_BUDGET",
                                    inboundId: "9dcdb659-dc37-4b89-96f0-4fdeed68d135"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.cdm32_workpage_APP_SFSF_DEMO_COMP_FORMS_VIZ_SFSF_DEMO_COMP_FORMS",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "Compensation Forms",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.cdm32_workpage_APP_SFSF_DEMO_COMP_FORMS",
                                    inboundId: "47652c6f-48c0-4923-81a9-a93cb07b2bf0"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.cdm32_workpage_APP_SFSF_DEMO_ORGCHART_VIZ_SFSF_DEMO_ORGCHART",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "My Org Chart",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.cdm32_workpage_APP_SFSF_DEMO_ORGCHART",
                                    inboundId: "7988a5b6-b37f-487b-8b34-901fbb1e0481"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.cdm32_workpage_APP_SFSF_DEMO_PEOPLEPROFILE_VIZ_SFSF_DEMO_PEOPLEPROFILE",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://employee"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "My Profile",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.cdm32_workpage_APP_SFSF_DEMO_PEOPLEPROFILE",
                                    inboundId: "c6416d5f-b814-497b-9436-4c99473b70e0"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.cdm32_workpage_APP_SFSF_DEMO_RECRUITING_CAREERS_VIZ_SFSF_DEMO_RECRUITING_CAREERS",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "Careers",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.cdm32_workpage_APP_SFSF_DEMO_RECRUITING_CAREERS",
                                    inboundId: "d271cc11-c975-45f3-a919-2874de3c9187"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.img_card_APPWCARD_TEST_IMAGE_IMAGE_CARD_TEST",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://technical-object"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "com.sap.myhome.imageCard2",
                                i18n: "i18n/i18n.properties",
                                info: "Image Card Sample",
                                tags: {
                                    keywords: [
                                        "Component",
                                        "Card",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "MyHome Image Card",
                                subTitle: "Just wraps an image",
                                shortTitle: "Image Card",
                                description: "A Component Card rendering an image",
                                applicationVersion: {
                                    version: "1.2.1"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                rootView: {
                                    id: "app",
                                    type: "XML",
                                    async: true,
                                    viewName: "com.sap.myhome.imageCard2.View"
                                },
                                dependencies: {
                                    libs: {
                                        "sap.m": {}
                                    },
                                    minUI5Version: "1.38"
                                }
                            },
                            _version: "1.15.0",
                            "sap.card": {
                                type: "Component",
                                header: {
                                    title: ""
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/com.sap.myhome.imageCard2/81283cc4ac3c356f2e5963ef2243a896",
                        descriptorPath: ""
                    }
                },
                {
                    id: "cpkg.sf.qacand_APP_SFSF_DEMO_COMP_BUDGET_VIZ_SFSF_DEMO_COMP_BUDGET",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "Compensation Budget",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.sf.qacand_APP_SFSF_DEMO_COMP_BUDGET",
                                    inboundId: "9dcdb659-dc37-4b89-96f0-4fdeed68d135"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.sf.qacand_APP_SFSF_DEMO_COMP_FORMS_VIZ_SFSF_DEMO_COMP_FORMS",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "Compensation Forms",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.sf.qacand_APP_SFSF_DEMO_COMP_FORMS",
                                    inboundId: "47652c6f-48c0-4923-81a9-a93cb07b2bf0"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.sf.qacand_APP_SFSF_DEMO_ORGCHART_VIZ_SFSF_DEMO_ORGCHART",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "My Org Chart",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.sf.qacand_APP_SFSF_DEMO_ORGCHART",
                                    inboundId: "7988a5b6-b37f-487b-8b34-901fbb1e0481"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.sf.qacand_APP_SFSF_DEMO_PEOPLEPROFILE_VIZ_SFSF_DEMO_PEOPLEPROFILE",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://employee"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "My Profile",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.sf.qacand_APP_SFSF_DEMO_PEOPLEPROFILE",
                                    inboundId: "c6416d5f-b814-497b-9436-4c99473b70e0"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "cpkg.sf.qacand_APP_SFSF_DEMO_RECRUITING_CAREERS_VIZ_SFSF_DEMO_RECRUITING_CAREERS",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "Careers",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "cpkg.sf.qacand_APP_SFSF_DEMO_RECRUITING_CAREERS",
                                    inboundId: "d271cc11-c975-45f3-a919-2874de3c9187"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "e09bed4d-5874-45c7-a99d-9ee5ba237aa8#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "Local",
                                title: "Local application demo",
                                subTitle: "Local application demo"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "e09bed4d-5874-45c7-a99d-9ee5ba237aa8",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "my.comp.ns.cpkg_my.company.ns.bubble.chart.card.app#my.company.ns.bubble.chart.card.viz",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "my.company.ns.bubble.chart.card",
                                i18n: "i18n/i18n.properties",
                                info: "Bubble Chart Card Info",
                                tags: {
                                    keywords: [
                                        "Bubble",
                                        "Card",
                                        "Sample",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "Bubble Chart Card",
                                subTitle: "Bubble Chart Card",
                                shortTitle: "Bubble Card",
                                description: "Bubble Chart Card Description",
                                artifactVersion: {
                                    version: "1.0.0"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            _version: "1.14.0",
                            "sap.card": {
                                type: "Analytical",
                                header: {
                                    title: "Milk Stores - Revenue, Cost and Consumption"
                                },
                                content: {
                                    data: {
                                        path: "/milk",
                                        request: {
                                            url: "./data.json"
                                        }
                                    },
                                    feeds: [
                                        {
                                            uid: "valueAxis",
                                            type: "Measure",
                                            values: [
                                                "Revenue"
                                            ]
                                        },
                                        {
                                            uid: "valueAxis2",
                                            type: "Measure",
                                            values: [
                                                "Cost"
                                            ]
                                        },
                                        {
                                            uid: "bubbleWidth",
                                            type: "Measure",
                                            values: [
                                                "Consumption"
                                            ]
                                        },
                                        {
                                            uid: "color",
                                            type: "Dimension",
                                            values: [
                                                "Store Name"
                                            ]
                                        }
                                    ],
                                    popover: {
                                        active: true
                                    },
                                    measures: [
                                        {
                                            name: "Cost",
                                            value: "{Cost}"
                                        },
                                        {
                                            name: "Revenue",
                                            value: "{Revenue}"
                                        },
                                        {
                                            name: "Consumption",
                                            value: "{Consumption}"
                                        }
                                    ],
                                    chartType: "bubble",
                                    minHeight: "20rem",
                                    dimensions: [
                                        {
                                            name: "Store Name",
                                            value: "{Store Name}"
                                        }
                                    ],
                                    chartProperties: {
                                        title: {
                                            visible: false
                                        },
                                        legendGroup: {
                                            layout: {
                                                position: "right",
                                                alignment: "topLeft"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/my.company.ns.bubble.chart.card/dd3bda38a33e75bdb5fd276b62329cc0",
                        descriptorPath: ""
                    }
                },
                {
                    id: "my.comp.ns.cpkg_my.company.ns.data.list.card.app#my.company.ns.data.list.card.viz",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {},
                            "sap.app": {
                                id: "my.company.ns.data.list.card",
                                i18n: "i18n/i18n.properties",
                                info: "Dynamic List Card Info",
                                tags: {
                                    keywords: [
                                        "List",
                                        "Card",
                                        "Sample",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "Dynamic List Card",
                                subTitle: "Dynamic List Card",
                                shortTitle: "List Card",
                                description: "Dynamic List Card Description",
                                artifactVersion: {
                                    version: "1.0.0"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            _version: "1.14.0",
                            "sap.card": {
                                type: "List",
                                header: {
                                    icon: {
                                        src: "sap-icon://product"
                                    },
                                    title: "Products",
                                    subTitle: "In Stock Information"
                                },
                                content: {
                                    data: {
                                        path: "/value",
                                        request: {
                                            url: "https://services.odata.org/V4/Northwind/Northwind.svc/Products",
                                            parameters: {
                                                $format: "json"
                                            }
                                        }
                                    },
                                    item: {
                                        title: "{ProductName}",
                                        highlight: "{= ${Discontinued} ? 'Error' : 'Success'}",
                                        description: "{UnitsInStock} units in stock"
                                    },
                                    maxItems: 5
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/my.company.ns.data.list.card/0f3e15a828b2eeab683fd3e35fc6700c",
                        descriptorPath: ""
                    }
                },
                {
                    id: "my.comp.ns.cpkg_my.company.ns.data.object.card.app#my.company.ns.data.object.card.viz",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://switch-classes"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "my.company.ns.data.object.card",
                                i18n: "i18n/i18n.properties",
                                info: "Dynamic Object Card Info",
                                tags: {
                                    keywords: [
                                        "Object",
                                        "Card",
                                        "Sample",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "Dynamic Object Card",
                                subTitle: "Dynamic Object Card",
                                shortTitle: "Object Card",
                                description: "Dynamic Object Card Description",
                                artifactVersion: {
                                    version: "1.0.0"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            _version: "1.15.0",
                            "sap.card": {
                                data: {
                                    request: {
                                        url: "./data.json"
                                    }
                                },
                                type: "Object",
                                header: {
                                    icon: {
                                        src: "{photo}"
                                    },
                                    title: "{firstName} {lastName}",
                                    subTitle: "{position}"
                                },
                                content: {
                                    groups: [
                                        {
                                            items: [
                                                {
                                                    label: "First Name",
                                                    value: "{firstName}"
                                                },
                                                {
                                                    label: "Last Name",
                                                    value: "{lastName}"
                                                },
                                                {
                                                    label: "Phone",
                                                    value: "{phone}",
                                                    actions: [
                                                        {
                                                            type: "Navigation",
                                                            parameters: {
                                                                url: "tel:{phone}"
                                                            }
                                                        }
                                                    ],
                                                    tooltip: "{phoneTooltip}"
                                                },
                                                {
                                                    label: "EMail",
                                                    value: "{email}",
                                                    actions: [
                                                        {
                                                            type: "Navigation",
                                                            parameters: {
                                                                url: "mailto:{email}"
                                                            }
                                                        }
                                                    ],
                                                    tooltip: "{emailTooltip}"
                                                },
                                                {
                                                    label: "Agenda",
                                                    value: "Book a meeting",
                                                    actions: [
                                                        {
                                                            type: "Navigation",
                                                            enabled: "{= ${agendaUrl}}",
                                                            parameters: {
                                                                url: "{agendaUrl}"
                                                            }
                                                        }
                                                    ],
                                                    tooltip: "{agendaTooltip}"
                                                }
                                            ],
                                            title: "Contact Details"
                                        },
                                        {
                                            items: [
                                                {
                                                    label: "Company Name",
                                                    value: "{company/name}"
                                                },
                                                {
                                                    label: "Adresse",
                                                    value: "{company/address}"
                                                },
                                                {
                                                    label: "EMail",
                                                    value: "{company/email}",
                                                    actions: [
                                                        {
                                                            type: "Navigation",
                                                            parameters: {
                                                                url: "mailto:{company/email}?subject={company/emailSubject}"
                                                            }
                                                        }
                                                    ],
                                                    tooltip: "{company/emailTooltip}"
                                                },
                                                {
                                                    label: "Webpage",
                                                    value: "{company/website}",
                                                    actions: [
                                                        {
                                                            type: "Navigation",
                                                            parameters: {
                                                                url: "{company/url}"
                                                            }
                                                        }
                                                    ],
                                                    tooltip: "{company/websiteTooltip}"
                                                }
                                            ],
                                            title: "Company Details"
                                        },
                                        {
                                            items: [
                                                {
                                                    icon: {
                                                        src: "{manager/photo}"
                                                    },
                                                    label: "Direct Manager",
                                                    value: "{manager/firstName} {manager/lastName}"
                                                }
                                            ],
                                            title: "Organization Details"
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/my.company.ns.data.object.card/762bb74e375acf3ad7b34f334ef7a2a1",
                        descriptorPath: ""
                    }
                },
                {
                    id: "my.comp.ns.cpkg_my.company.ns.donut.chart.card.app#my.company.ns.donut.chart.card.viz",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://donut-chart"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "my.company.ns.donut.chart.card",
                                i18n: "i18n/i18n.properties",
                                info: "Donut Chart Card Info",
                                tags: {
                                    keywords: [
                                        "Donut",
                                        "Chart",
                                        "Analytical",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "Donut Chart Card",
                                subTitle: "Donut Chart Card",
                                shortTitle: "Donut Card",
                                description: "Donut Chart Card Description",
                                artifactVersion: {
                                    version: "1.0.0"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            _version: "1.14.0",
                            "sap.card": {
                                type: "Analytical",
                                header: {
                                    title: "January Milk Revenue"
                                },
                                content: {
                                    data: {
                                        json: {
                                            milk: [
                                                {
                                                    Revenue: 345292.06,
                                                    "Store Name": "24-Seven",
                                                    "Fat Percentage": "2 Percent"
                                                },
                                                {
                                                    Revenue: 1564235.29,
                                                    "Store Name": "A&A",
                                                    "Fat Percentage": "2 Percent"
                                                },
                                                {
                                                    Revenue: 1085567.22,
                                                    "Store Name": "Alexei's Specialities",
                                                    "Fat Percentage": "2 Percent"
                                                },
                                                {
                                                    Revenue: 82922.07,
                                                    "Store Name": "24-Seven",
                                                    "Fat Percentage": "1 Percent"
                                                },
                                                {
                                                    Revenue: 157913.07,
                                                    "Store Name": "A&A",
                                                    "Fat Percentage": "1 Percent"
                                                },
                                                {
                                                    Revenue: 245609.486884,
                                                    "Store Name": "Alexei's Specialities",
                                                    "Fat Percentage": "1 Percent"
                                                }
                                            ]
                                        },
                                        path: "/milk"
                                    },
                                    feeds: [
                                        {
                                            uid: "color",
                                            type: "Dimension",
                                            values: [
                                                "Store Name"
                                            ]
                                        },
                                        {
                                            uid: "size",
                                            type: "Measure",
                                            values: [
                                                "Revenue"
                                            ]
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Revenue",
                                            value: "{Revenue}"
                                        }
                                    ],
                                    chartType: "Donut",
                                    dimensions: [
                                        {
                                            name: "Store Name",
                                            value: "{Store Name}"
                                        }
                                    ],
                                    chartProperties: {
                                        title: {
                                            visible: false
                                        },
                                        legend: {
                                            visible: false
                                        },
                                        plotArea: {
                                            dataLabel: {
                                                visible: true,
                                                showTotal: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/my.company.ns.donut.chart.card/7cf9e417f16278f4de4feb81bf859b20",
                        descriptorPath: ""
                    }
                },
                {
                    id: "my.comp.ns.cpkg_my.company.ns.line.chart.card.app#my.company.ns.line.chart.card.viz",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://line-chart"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "my.company.ns.line.chart.card",
                                i18n: "i18n/i18n.properties",
                                info: "Additional information about this Card",
                                tags: {
                                    keywords: [
                                        "{{DONUT_CHART_KEYWORD1}}",
                                        "{{DONUT_CHART_KEYWORD2}}",
                                        "{{DONUT_CHART_KEYWORD3}}",
                                        "{{DONUT_CHART_KEYWORD4}}"
                                    ]
                                },
                                type: "card",
                                title: "Line Chart Card",
                                subTitle: "Sample of a Line Chart",
                                shortTitle: "A short title for this Card",
                                description: "A long description for this Card",
                                artifactVersion: {
                                    version: "1.0.0"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            _version: "1.14.0",
                            "sap.card": {
                                type: "Analytical",
                                header: {
                                    data: {
                                        json: {
                                            unit: "K",
                                            state: "Error",
                                            trend: "Down",
                                            number: "65.34",
                                            target: {
                                                unit: "K",
                                                number: 100
                                            },
                                            details: "Q1, 2018",
                                            deviation: {
                                                state: "Critical",
                                                number: 34.7
                                            }
                                        }
                                    },
                                    type: "Numeric",
                                    title: "Project Cloud Transformation",
                                    details: "{details}",
                                    subTitle: "Revenue",
                                    mainIndicator: {
                                        unit: "{unit}",
                                        state: "{state}",
                                        trend: "{trend}",
                                        number: "{number}"
                                    },
                                    sideIndicators: [
                                        {
                                            unit: "{target/unit}",
                                            title: "Target",
                                            number: "{target/number}"
                                        },
                                        {
                                            unit: "%",
                                            state: "{deviation/state}",
                                            title: "Deviation",
                                            number: "{deviation/number}"
                                        }
                                    ],
                                    unitOfMeasurement: "EUR"
                                },
                                content: {
                                    data: {
                                        json: {
                                            list: [
                                                {
                                                    Cost: 230000,
                                                    Week: "CW14",
                                                    Cost1: 24800.63,
                                                    Cost2: 205199.37,
                                                    Cost3: 199999.37,
                                                    Budget: 210000,
                                                    Target: 500000,
                                                    Revenue: 431000.22
                                                },
                                                {
                                                    Cost: 238000,
                                                    Week: "CW15",
                                                    Cost1: 99200.39,
                                                    Cost2: 138799.61,
                                                    Cost3: 200199.37,
                                                    Budget: 224000,
                                                    Target: 500000,
                                                    Revenue: 494000.3
                                                },
                                                {
                                                    Cost: 221000,
                                                    Week: "CW16",
                                                    Cost1: 70200.54,
                                                    Cost2: 150799.46,
                                                    Cost3: 80799.46,
                                                    Budget: 238000,
                                                    Target: 500000,
                                                    Revenue: 491000.17
                                                },
                                                {
                                                    Cost: 280000,
                                                    Week: "CW17",
                                                    Cost1: 158800.73,
                                                    Cost2: 121199.27,
                                                    Cost3: 108800.46,
                                                    Budget: 252000,
                                                    Target: 500000,
                                                    Revenue: 536000.34
                                                },
                                                {
                                                    Cost: 230000,
                                                    Week: "CW18",
                                                    Cost1: 140000.91,
                                                    Cost2: 89999.09,
                                                    Cost3: 100099.09,
                                                    Budget: 266000,
                                                    Target: 600000,
                                                    Revenue: 675000
                                                },
                                                {
                                                    Cost: 250000,
                                                    Week: "CW19",
                                                    Cost1: 172800.15,
                                                    Cost2: 77199.85,
                                                    Cost3: 57199.85,
                                                    Budget: 280000,
                                                    Target: 600000,
                                                    Revenue: 680000
                                                },
                                                {
                                                    Cost: 325000,
                                                    Week: "CW20",
                                                    Cost1: 237200.74,
                                                    Cost2: 87799.26,
                                                    Cost3: 187799.26,
                                                    Budget: 294000,
                                                    Target: 600000,
                                                    Revenue: 659000.14
                                                }
                                            ],
                                            legend: {
                                                visible: true,
                                                position: "bottom",
                                                alignment: "topLeft"
                                            },
                                            measures: {
                                                costLabel: "Costs",
                                                revenueLabel: "Revenue"
                                            },
                                            dimensions: {
                                                weekLabel: "Weeks"
                                            }
                                        },
                                        path: "/list"
                                    },
                                    feeds: [
                                        {
                                            uid: "valueAxis",
                                            type: "Measure",
                                            values: [
                                                "{measures/revenueLabel}",
                                                "{measures/costLabel}"
                                            ]
                                        },
                                        {
                                            uid: "categoryAxis",
                                            type: "Dimension",
                                            values: [
                                                "{dimensions/weekLabel}"
                                            ]
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "{measures/revenueLabel}",
                                            value: "{Revenue}"
                                        },
                                        {
                                            name: "{measures/costLabel}",
                                            value: "{Cost}"
                                        }
                                    ],
                                    chartType: "Line",
                                    dimensions: [
                                        {
                                            name: "{dimensions/weekLabel}",
                                            value: "{Week}"
                                        }
                                    ],
                                    chartProperties: {
                                        title: {
                                            text: "Line Chart",
                                            visible: true,
                                            alignment: "left"
                                        },
                                        legend: {
                                            visible: "{legend/visible}"
                                        },
                                        plotArea: {
                                            dataLabel: {
                                                visible: true
                                            }
                                        },
                                        valueAxis: {
                                            title: {
                                                visible: false
                                            }
                                        },
                                        legendGroup: {
                                            layout: {
                                                position: "{legend/position}",
                                                alignment: "{legend/alignment}"
                                            }
                                        },
                                        categoryAxis: {
                                            title: {
                                                visible: false
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/my.company.ns.line.chart.card/e1087df0d5fcc0818a58d0ef778ee683",
                        descriptorPath: ""
                    }
                },
                {
                    id: "my.comp.ns.cpkg_my.company.ns.static.list.card.app#my.company.ns.static.list.card.viz",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://list"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "my.company.ns.static.list.card",
                                i18n: "i18n/i18n.properties",
                                info: "Static List Card Info",
                                tags: {
                                    keywords: [
                                        "List",
                                        "Card",
                                        "Sample",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "Static List Card",
                                subTitle: "Static List Card",
                                shortTitle: "List Card",
                                description: "Static List Card Description",
                                artifactVersion: {
                                    version: "1.0.0"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            _version: "1.14.0",
                            "sap.card": {
                                type: "List",
                                header: {
                                    icon: {
                                        src: "sap-icon://desktop-mobile"
                                    },
                                    title: "List Card with Top 4 Products",
                                    status: {
                                        text: "{parameters>/maxItems/value} of 20"
                                    },
                                    subTitle: "These are the top sellers this month"
                                },
                                content: {
                                    data: {
                                        json: [
                                            {
                                                Name: "Comfort Easy",
                                                Highlight: "Error",
                                                Description: "32 GB Digital Assistant with high-resolution color screen"
                                            },
                                            {
                                                Name: "ITelO Vault",
                                                Highlight: "Warning",
                                                Description: "Digital Organizer with State-of-the-Art Storage Encryption"
                                            },
                                            {
                                                Name: "Notebook Professional 15",
                                                Highlight: "Success",
                                                Description: "Notebook Professional 15 with 2,80 GHz quad core, 15\" Multitouch LCD, 8 GB DDR3 RAM, 500 GB SSD - DVD-Writer (DVD-R/+R/-RW/-RAM),Windows 8 Pro"
                                            },
                                            {
                                                Name: "Ergo Screen E-I",
                                                Highlight: "Information",
                                                Description: "Optimum Hi-Resolution max. 1920 x 1080 @ 85Hz, Dot Pitch: 0.27mm"
                                            },
                                            {
                                                Name: "Laser Professional Eco",
                                                Highlight: "None",
                                                Description: "Print 2400 dpi image quality color documents at speeds of up to 32 ppm (color) or 36 ppm (monochrome), letter/A4. Powerful 500 MHz processor, 512MB of memory"
                                            }
                                        ]
                                    },
                                    item: {
                                        title: "{Name}",
                                        highlight: "{Highlight}",
                                        description: "{Description}"
                                    },
                                    maxItems: "{parameters>/maxItems/value}"
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/my.company.ns.static.list.card/9a8e15fdf3f4e7dd3fdea5bc4a0010a4",
                        descriptorPath: ""
                    }
                },
                {
                    id: "my.comp.ns.cpkg_my.company.ns.static.object.card.app#my.company.ns.static.object.card.viz",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://switch-classes"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "my.company.ns.static.object.card",
                                i18n: "i18n/i18n.properties",
                                info: "Static Object Card Info",
                                tags: {
                                    keywords: [
                                        "Object",
                                        "Card",
                                        "Sample",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "Static Object Card",
                                subTitle: "Static Object Card",
                                shortTitle: "Object Card",
                                description: "Static Object Card Description",
                                artifactVersion: {
                                    version: "1.0.0"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.card": {
                                type: "Object",
                                footer: {
                                    actionsStrip: [
                                        {
                                            text: "Pay Bill",
                                            buttonType: "Accept"
                                        },
                                        {
                                            text: "Block Payment",
                                            buttonType: "Reject"
                                        }
                                    ]
                                },
                                header: {
                                    icon: {
                                        src: "sap-icon://building",
                                        shape: "Square"
                                    },
                                    title: "ACME Consulting",
                                    subTitle: "ACME Consulting"
                                },
                                content: {
                                    data: {
                                        json: {
                                            contacts: [
                                                {
                                                    name: "Alain Chevalier",
                                                    photo: "./AlainChevalier.png"
                                                },
                                                {
                                                    name: "Donna Moore",
                                                    photo: "./DonnaMoore.png"
                                                }
                                            ]
                                        }
                                    },
                                    groups: [
                                        {
                                            items: [
                                                {
                                                    type: "Status",
                                                    state: "Error",
                                                    value: "Overdue by 20 days"
                                                },
                                                {
                                                    value: "USD 10,000.00 was to be billed on 23rd August, 2021."
                                                }
                                            ],
                                            alignment: "Stretch"
                                        },
                                        {
                                            items: [
                                                {
                                                    label: "Billing Element",
                                                    value: "RN47565.0.1"
                                                },
                                                {
                                                    label: "Customer",
                                                    value: "Domestic US Customer 1"
                                                }
                                            ]
                                        },
                                        {
                                            items: [
                                                {
                                                    label: "Project",
                                                    value: "RN4765"
                                                },
                                                {
                                                    path: "contacts",
                                                    type: "IconGroup",
                                                    label: "Contacts",
                                                    template: {
                                                        icon: {
                                                            src: "{photo}",
                                                            text: "{= format.initials(${name})}"
                                                        },
                                                        actions: [
                                                            {
                                                                type: "Navigation",
                                                                parameters: {
                                                                    url: "/contacts-service?name={= encodeURIComponent(${name}) }"
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/my.company.ns.static.object.card/62346e374a13e2e88be758ddd3f94279",
                        descriptorPath: ""
                    }
                },
                {
                    id: "saas_approuter_e2estdlts_com.sap.bpm.tc.admin_taskcenteradmin-display",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://sys-monitor"
                                },
                                technology: "URL",
                                deviceTypes: {
                                    phone: true,
                                    tablet: true,
                                    desktop: true
                                }
                            },
                            "sap.app": {
                                title: "Task Center Administration"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "saas_approuter_e2estdlts_com.sap.bpm.tc.admin",
                                    inboundId: "taskcenteradmin-display"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "saas_approuter_e2estdlts_com.sap.bpm.tc.inbox_taskcenter-display",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://inbox"
                                },
                                technology: "URL",
                                deviceTypes: {
                                    phone: true,
                                    tablet: true,
                                    desktop: true
                                }
                            },
                            "sap.app": {
                                title: "Task Center",
                                dataSources: {
                                    mainService: {
                                        uri: "/comsapbpminbox-service.comsapbpmtcinbox/~100822145331+0000~/oneinbox/tcm/",
                                        type: "OData",
                                        settings: {
                                            localUri: "localService/mockdataMyTasks/metadata.xml",
                                            odataVersion: "2.0"
                                        }
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "saas_approuter_e2estdlts_com.sap.bpm.tc.inbox",
                                    inboundId: "taskcenter-display"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "/comsapbpminbox-service.comsapbpmtcinbox/oneinbox/tcm/TaskCollection/$count/?$filter=Status eq 'READY' or Status eq 'RESERVED' or Status eq 'IN_PROGRESS' or Status eq 'EXECUTED'&onlineOnly=true",
                                    refresh: 15,
                                    dataSource: "mainService"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "saas_approuter_e2estdlts_html5simple.static_action-display",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL",
                                deviceTypes: {
                                    phone: true,
                                    tablet: true,
                                    desktop: true
                                }
                            },
                            "sap.app": {
                                title: "{{flpTitle}}",
                                subTitle: "{{flpSubtitle}}"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "saas_approuter_e2estdlts_html5simple.static",
                                    inboundId: "action-display"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "search_providers_mainline.search.provider.google_defaultLauncher",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://nutrition-activity"
                                }
                            },
                            "sap.app": {
                                info: "Google.com (New Tab)",
                                title: "Google.com"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "search_providers_mainline.search.provider.google",
                                    inboundId: "home",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "search_providers_mainline.search.provider.office_defaultLauncher",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://nutrition-activity"
                                }
                            },
                            "sap.app": {
                                info: "Office.com (New Tab)",
                                title: "Office.com"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "search_providers_mainline.search.provider.office",
                                    inboundId: "home",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_006D68AE77A1B60786C3E5693C368BB6#B3CF757E935F4AC4AEC196979DDBBDFE",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Supplier Evaluation By Questionnaire",
                                subTitle: "Based on Supplier Scorecards",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_SUPLREVALBYQNAIREQRY_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_SUPLREVALBYQNAIREQRY_CDS',Version='0001')/Annotations(TechnicalName='0894EF4590B11EEB859FA6F8CB71F93D',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_006D68AE77A1B60786C3E5693C368BB6",
                                    inboundId: "3WO90XU7M6Y86EYUVQ4YS1TQE",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.SEBYQUESTIONAIRE.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2234A"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1636964909218",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"B3CF757E935F4AC4AEC196979DDBBDFE\\\",\\\"instanceId\\\":\\\"B3CF757E935F4AC4AEC196979DDBBDFE\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.SEBYQUESTIONAIRE.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.SEBYQUESTIONAIRE.EVAL\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"analyzeQuestionnaire\\\",\\\"title\\\":\\\"Supplier Evaluation By Questionnaire\\\",\\\"subtitle\\\":\\\"Based on Supplier Scorecards\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1603437321152\\\",\\\"fioriId\\\":\\\"F2234A\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU7M6Y86EYUVQ4YS1TQE\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.SEBYQUESTIONAIRE.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_SUPLREVALBYQNAIREQRY_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_SUPLREVALBYQNAIREQRYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"0894EF4590B11EEB859FA6F8CB71F93D\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_SUPLREVALBYQNAIREQRY_CDS_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_SUPLREVALBYQNAIREQRY_CDS.C_SUPLREVALBYQNAIREQRYResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_SEBYQUESTIONAIRE_EVAL",
                                    dataPoint: "C_SUPLREVALBYQNAIREQRY_CDS.C_SUPLREVALBYQNAIREQRYResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_SEBYQUESTIONAIRE_EVAL",
                                    selectionVariant: "C_SUPLREVALBYQNAIREQRY_CDS.C_SUPLREVALBYQNAIREQRYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_SEBYQUESTIONAIRE_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_016245178F60C3B833941A177B7DA80E#ET091I2703HZNCZKC4B05ASDB",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Supplier Invoice Inbound Automation Rate",
                                subTitle: "By Origin",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_INVOICEINBOUNDAUTOMNRATE_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 0,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_INVOICEINBOUNDAUTOMNRATE_CDS',Version='0001')/Annotations(TechnicalName='63CC7038510F1ED9BD91B17B7D7A1D89',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_016245178F60C3B833941A177B7DA80E",
                                    inboundId: "ET091I2703HZNCZKB7N8FSAHO",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.KPI.INVOICEAUTOMATIONRATE",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4518"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1573581176624",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET091I2703HZNCZKC4B05ASDB\\\",\\\"instanceId\\\":\\\"ET091I2703HZNCZKC4B05ASDB\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.KPI.INVOICEAUTOMATIONRATE\\\",\\\"reportId\\\":\\\".SAP.KPI.INVOICEAUTOMATIONRATE\\\",\\\"semanticObject\\\":\\\"Invoice\\\",\\\"semanticAction\\\":\\\"analyzeAutomationRate\\\",\\\"title\\\":\\\"Supplier Invoice Inbound Automation Rate\\\",\\\"subtitle\\\":\\\"By Origin\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":0,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1573581031532\\\",\\\"fioriId\\\":\\\"F4518\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"ET091I2703HZNCZKB7N8FSAHO\\\",\\\"tileType\\\":\\\"DT-CM\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"COLUMN_NAMES\\\":[{\\\"COLUMN_NAME\\\":\\\"NmbrOfManualInvoiceInbound\\\",\\\"semanticColor\\\":\\\"Critical\\\"},{\\\"COLUMN_NAME\\\":\\\"NmbrOfAutomatedInvoiceInbound\\\",\\\"semanticColor\\\":\\\"Warning\\\"},{\\\"COLUMN_NAME\\\":\\\"NmbrOfSelfBillingInvoicesInb\\\",\\\"semanticColor\\\":\\\"Good\\\"}]}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.KPI.INVOICEAUTOMATIONRATE\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_INVOICEINBOUNDAUTOMNRATE_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_INVOICEINBOUNDAUTOMNRATEResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"63CC7038510F1ED9BD91B17B7D7A1D89\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_INVOICEINBOUNDAUTOMNRATE_C_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_INVOICEINBOUNDAUTOMNRATE_CDS.C_INVOICEINBOUNDAUTOMNRATEResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_KPI_INVOICEAUTOMATIONRATE",
                                    dataPoint: "C_INVOICEINBOUNDAUTOMNRATE_CDS.C_INVOICEINBOUNDAUTOMNRATEResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_KPI_INVOICEAUTOMATIONRATE",
                                    selectionVariant: "C_INVOICEINBOUNDAUTOMNRATE_CDS.C_INVOICEINBOUNDAUTOMNRATEResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_KPI_INVOICEAUTOMATIONRATE"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_08247240D69CCFB84D187B454DF397AE#00O2TPKTQCDUX5BN58RO6AT16",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Spend Variance",
                                subTitle: "Since the beginning of last year",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_SUPLRCOMPRNVIAPURVALS_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_SUPLRCOMPRNVIAPURVALS_CDS',Version='0001')/Annotations(TechnicalName='005056AC156F1ED68A94D50DB8D520C6',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_08247240D69CCFB84D187B454DF397AE",
                                    inboundId: "ET090PW4NWFHYIBMXH9ND2QXB",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.SPENDVARIANCEEVALUATION",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1377"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583157825271",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQCDUX5BN58RO6AT16\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX5BN58RO6AT16\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.SPENDVARIANCEEVALUATION\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.SPENDVARIANCEEVALUATION\\\",\\\"semanticObject\\\":\\\"PurchaseOrder\\\",\\\"semanticAction\\\":\\\"analyzeFulfillmentRatio\\\",\\\"title\\\":\\\"Spend Variance\\\",\\\"subtitle\\\":\\\"Since the beginning of last year\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1473923299601\\\",\\\"fioriId\\\":\\\"F1377\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYIBMXH9ND2QXB\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.SPENDVARIANCEEVALUATION\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_SUPLRCOMPRNVIAPURVALS_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_SUPLRCOMPRNVIAPURVALSResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"005056AC156F1ED68A94D50DB8D520C6\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_SUPLRCOMPRNVIAPURVALS_CDS.C_SUPLRCOMPRNVIAPURVALSResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_SPENDVARIANCEEVALUATION",
                                    dataPoint: "C_SUPLRCOMPRNVIAPURVALS_CDS.C_SUPLRCOMPRNVIAPURVALSResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_SPENDVARIANCEEVALUATION",
                                    selectionVariant: "C_SUPLRCOMPRNVIAPURVALS_CDS.C_SUPLRCOMPRNVIAPURVALSResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_SPENDVARIANCEEVALUATION"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_0D3DD649E4DE6B79D2AF02C3D904A3AF#ET090PW4NWFHYIXAS540P38XS",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori9/F1354"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-EVL",
                                title: "Translate Evaluation Templates",
                                subTitle: "Evaluation"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_0D3DD649E4DE6B79D2AF02C3D904A3AF",
                                    inboundId: "ET090PW4NWFHYIXAAGVEZB82L",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "UI5",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2198"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_0E308AA4AD26F65C8D0460E230C2FE3C#42010AEE2A311EDCBCA70E5D6D9D0384",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://instance"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                info: "Supplier Rebates",
                                tags: {
                                    keywords: [
                                        "Jobs Scheduling Automation"
                                    ]
                                },
                                title: "Schedule Update Settlement Calendar"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_0E308AA4AD26F65C8D0460E230C2FE3C",
                                    inboundId: "42010AEE2A311EDCBCA70E5D6D9CE384_TM",
                                    parameters: {
                                        JobCatalogEntryName: {
                                            value: {
                                                value: "SAP_LO_CCS_SETTLMT_CAL_UPD_SUPR",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F6873"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_1416D3EEC080046CD6583A417B3714EB#6FMR9SFQJTA08Q6YFHSFFHB3X",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://instance"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-OA-CON",
                                tags: {
                                    keywords: [
                                        "Jobs Scheduling Automation"
                                    ]
                                },
                                title: "Monitor Mass Changes",
                                subTitle: "Purchase Contracts"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_1416D3EEC080046CD6583A417B3714EB",
                                    inboundId: "6FMR9SFQJTA08XIQR6ZO01CMC",
                                    parameters: {
                                        JobCatalogEntryName: {
                                            value: {
                                                value: "SAP_MM_PUR_MASSCTRBG_J",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4393"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_1459A9E04F0C2DFDD10B7644EB5CCBB5#F8F02681F37A4D11AD1519F56A170EFF",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Supplier Evaluation By Time",
                                subTitle: "Based on Delivery and Goods Receipt Date",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_TIMEVARIANCEQUERY_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_TIMEVARIANCEQUERY_CDS',Version='0001')/Annotations(TechnicalName='506B4BC345E01EEB81F2604F0E6DB27C',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_1459A9E04F0C2DFDD10B7644EB5CCBB5",
                                    inboundId: "3WO90XU7M6Y86FI7P84FOPHX9",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".E.1601960854399",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1664A"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1613713910064",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"MaterialGroup\\\",\\\"Label\\\":\\\"Material Group\\\"},{\\\"Id\\\":\\\"Plant\\\",\\\"Label\\\":\\\"Plant\\\"},{\\\"Id\\\":\\\"PurchasingGroup\\\",\\\"Label\\\":\\\"Purch. Group\\\"},{\\\"Id\\\":\\\"PurchasingOrganization\\\",\\\"Label\\\":\\\"Purchasing Org.\\\"},{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"F8F02681F37A4D11AD1519F56A170EFF\\\",\\\"instanceId\\\":\\\"F8F02681F37A4D11AD1519F56A170EFF\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".E.1601960854399\\\",\\\"reportId\\\":\\\".E.1601960854399\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"analyzeTimeVar\\\",\\\"title\\\":\\\"Supplier Evaluation By Time\\\",\\\"subtitle\\\":\\\"Based on Delivery and Goods Receipt Date\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1603861395354\\\",\\\"fioriId\\\":\\\"F1664A\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU7M6Y86FI7P84FOPHX9\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".E.1601960854399\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_TIMEVARIANCEQUERY_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_TIMEVARIANCEQUERYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"506B4BC345E01EEB81F2604F0E6DB27C\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_TIMEVARIANCEQUERY_CDS_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_TIMEVARIANCEQUERY_CDS.C_TIMEVARIANCEQUERYResult/@com.sap.vocabularies.UI.v1.KPI#_E_1601960854399",
                                    dataPoint: "C_TIMEVARIANCEQUERY_CDS.C_TIMEVARIANCEQUERYResult/@com.sap.vocabularies.UI.v1.DataPoint#_E_1601960854399",
                                    selectionVariant: "C_TIMEVARIANCEQUERY_CDS.C_TIMEVARIANCEQUERYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_E_1601960854399"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_19E7FAF68F6C90316966980481BF32CA#CD4AD8996B29458C93B5F2354005FA94",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Supplier Evaluation By Price",
                                subTitle: "Based on PO and Invoice Price",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PRICEVARIANCEQUERY_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PRICEVARIANCEQUERY_CDS',Version='0001')/Annotations(TechnicalName='0894EF4577411EEB82926DF0221E5731',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_19E7FAF68F6C90316966980481BF32CA",
                                    inboundId: "3WO90XU7M6Y6G5NM12VUKQKDL",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".E.1602070523527",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1663A"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1615801213582",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"},{\\\"Id\\\":\\\"MaterialGroup\\\",\\\"Label\\\":\\\"Material Group\\\"},{\\\"Id\\\":\\\"PurchasingGroup\\\",\\\"Label\\\":\\\"Purch. Group\\\"},{\\\"Id\\\":\\\"Plant\\\",\\\"Label\\\":\\\"Plant\\\"},{\\\"Id\\\":\\\"PurchasingOrganization\\\",\\\"Label\\\":\\\"Purchasing Org.\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"CD4AD8996B29458C93B5F2354005FA94\\\",\\\"instanceId\\\":\\\"CD4AD8996B29458C93B5F2354005FA94\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".E.1602070523527\\\",\\\"reportId\\\":\\\".E.1602070523527\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"analyzePriceVarianceQry\\\",\\\"title\\\":\\\"Supplier Evaluation By Price\\\",\\\"subtitle\\\":\\\"Based on PO and Invoice Price\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1604297825255\\\",\\\"fioriId\\\":\\\"F1663A\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU7M6Y6G5NM12VUKQKDL\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".E.1602070523527\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PRICEVARIANCEQUERY_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PRICEVARIANCEQUERYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"0894EF4577411EEB82926DF0221E5731\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_PRICEVARIANCEQUERY_CDS_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PRICEVARIANCEQUERY_CDS.C_PRICEVARIANCEQUERYResult/@com.sap.vocabularies.UI.v1.KPI#_E_1602070523527",
                                    dataPoint: "C_PRICEVARIANCEQUERY_CDS.C_PRICEVARIANCEQUERYResult/@com.sap.vocabularies.UI.v1.DataPoint#_E_1602070523527",
                                    selectionVariant: "C_PRICEVARIANCEQUERY_CDS.C_PRICEVARIANCEQUERYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_E_1602070523527"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_1BD661DA22D7D1EE2352A7AF9B92654A#FA163EDF73161ED59DE8784EC3A9A0D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori6/F0869"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME31L"
                                    ]
                                },
                                title: "Create Scheduling Agreement"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_1BD661DA22D7D1EE2352A7AF9B92654A",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A9A0D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_203EF43A147980AAEDA1FC9984A641AE#FA163EDF73161ED59DE8784EC3AB20D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori6/F0870"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME9L"
                                    ]
                                },
                                title: "Print Scheduling Agreements"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_203EF43A147980AAEDA1FC9984A641AE",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AB20D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_2228F3D8B8AA94E078EE785C1CED7C22#506B4BC345C41EDCA98FD660C256BD81_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://drill-down"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                tags: {
                                    keywords: [
                                        "WDA_WLF_DETSTMNTPURGRBTEQR"
                                    ]
                                },
                                title: "Analyze Detailed Statement Purchasing Rebates"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_2228F3D8B8AA94E078EE785C1CED7C22",
                                    inboundId: "506B4BC345C41EDCA98FD660C256BD81_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "W0148"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_232043AC0CC80816F873325610E3B525#0894EF4577A91EE981E85C3B9D2EE51F_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "MEKP"
                                    ]
                                },
                                title: "Price Change: Info Records"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_232043AC0CC80816F873325610E3B525",
                                    inboundId: "0894EF4577A91EE981E85C3B9D2EE51F_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_23EFFD63817AFAD3EE526094CDCB902F#42010AEE28151EDCA9CCDD6813AC17B1",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://product"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-MD-MM",
                                tags: {
                                    keywords: [
                                        "Product List"
                                    ]
                                },
                                title: "Product List"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_23EFFD63817AFAD3EE526094CDCB902F",
                                    inboundId: "42010AEE28151EDCA9CCD997EF06B7B1_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F6518"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_258EBA3B239FF337C79C488BDA9CFA67#ET090M0NO76W9G4ROXHPTVM7T",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0842-1"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-PO",
                                title: "Manage Purchase Orders"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_258EBA3B239FF337C79C488BDA9CFA67",
                                    inboundId: "ET090M0NO76W9G4S159ZQUD0I"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0842A"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_2599D87ACF3F4DD3E5E4346E46E3AA72#FA163EDF73161EE5B5963CC508430DED_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori6/F0870"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-GF-OC",
                                tags: {
                                    keywords: [
                                        "ME9FF"
                                    ]
                                },
                                title: "Print Scheduled Purchase Orders"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_2599D87ACF3F4DD3E5E4346E46E3AA72",
                                    inboundId: "FA163EDF73161EE5B5963CC508430DED_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_264BA56785AC1BFDCAE07332D21D1BC1#00O2TO3SH4DA4DDRDQQ1AR7U0",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://complete"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "CA-INB-FIO",
                                tags: {
                                    keywords: [
                                        "Workflow, Inbox, Approval, Approve"
                                    ]
                                },
                                title: "My Inbox",
                                subTitle: "All Items",
                                dataSources: {
                                    "viz.00O2TO3SH4DA4DDRDQQ1AR7U0.indicator": {
                                        uri: "/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_264BA56785AC1BFDCAE07332D21D1BC1",
                                    inboundId: "00O2TO3SH4DA4DDRAGK1T6X4M",
                                    parameters: {
                                        allItems: {
                                            value: {
                                                value: "true",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "TaskCollection/$count/?$filter=Status eq 'READY' or Status eq 'RESERVED' or Status eq 'IN_PROGRESS' or Status eq 'EXECUTED'",
                                    refresh: 0,
                                    dataSource: "viz.00O2TO3SH4DA4DDRDQQ1AR7U0.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0862"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_2785BE2C6E92B0729531332FE2F675AB#6FMR9SFQJTA1YZNQVSUKSD01D",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-OA-CON",
                                title: "Mass Changes to Purchase Contracts"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_2785BE2C6E92B0729531332FE2F675AB",
                                    inboundId: "6FMR9SFQJTA1YZNQ545J4NRS1"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2669"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_2867E0BA050E4AC23502D0E4B734D43E#41DCDD708A8D41138693067DBB3ED766",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Operational Supplier Evaluation",
                                subTitle: "Based on Score and Variance",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_OPERATIONALSUPLREVALQRY_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_OPERATIONALSUPLREVALQRY_CDS',Version='0001')/Annotations(TechnicalName='0894EF4590B11EDB838D1B3A1532213B',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_2867E0BA050E4AC23502D0E4B734D43E",
                                    inboundId: "3WO90XU7M6Y6G5NN6WA4OP9RM",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".E.1602491356076",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1662A"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1614682600256",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"MaterialGroup\\\",\\\"Label\\\":\\\"Material Group\\\"},{\\\"Id\\\":\\\"Plant\\\",\\\"Label\\\":\\\"Plant\\\"},{\\\"Id\\\":\\\"PurchasingOrganization\\\",\\\"Label\\\":\\\"Purchasing Org.\\\"},{\\\"Id\\\":\\\"PurchasingGroup\\\",\\\"Label\\\":\\\"Purch. Group\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"41DCDD708A8D41138693067DBB3ED766\\\",\\\"instanceId\\\":\\\"41DCDD708A8D41138693067DBB3ED766\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".E.1602491356076\\\",\\\"reportId\\\":\\\".E.1602491356076\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"analyzeOperationalScoreQry\\\",\\\"title\\\":\\\"Operational Supplier Evaluation\\\",\\\"subtitle\\\":\\\"Based on Score and Variance\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1604299265439\\\",\\\"fioriId\\\":\\\"F1662A\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU7M6Y6G5NN6WA4OP9RM\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".E.1602491356076\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_OPERATIONALSUPLREVALQRY_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_OPERATIONALSUPLREVALQRYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"0894EF4590B11EDB838D1B3A1532213B\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_OPERATIONALSUPLREVALQRY_CD_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_OPERATIONALSUPLREVALQRY_CDS.C_OPERATIONALSUPLREVALQRYResult/@com.sap.vocabularies.UI.v1.KPI#_E_1602491356076",
                                    dataPoint: "C_OPERATIONALSUPLREVALQRY_CDS.C_OPERATIONALSUPLREVALQRYResult/@com.sap.vocabularies.UI.v1.DataPoint#_E_1602491356076",
                                    selectionVariant: "C_OPERATIONALSUPLREVALQRY_CDS.C_OPERATIONALSUPLREVALQRYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_E_1602491356076"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_2D5D2015FEB538B082A8D2DE55948A72#6377748B811142DE845EAAD3BAB59707",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Parts per Million",
                                subTitle: "By Returns and Quality Notifications",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/MMPUR_ANA_PARTSPERMILLION_SRV",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='MMPUR_ANA_PARTSPERMILLION_SRV',Version='0001')/Annotations(TechnicalName='0894EF4577411EDAA0DCBBDB07403630',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_2D5D2015FEB538B082A8D2DE55948A72",
                                    inboundId: "3WO90XU7M6Y6CNC5KYD1FLT3V",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".E.SAP.MM.ANA.SE.PPM",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4885"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1615378010192",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"PurchasingGroup\\\",\\\"Label\\\":\\\"Purch. Group\\\"},{\\\"Id\\\":\\\"PurchasingOrganization\\\",\\\"Label\\\":\\\"Purchasing Org.\\\"},{\\\"Id\\\":\\\"Plant\\\",\\\"Label\\\":\\\"Plant\\\"},{\\\"Id\\\":\\\"MaterialGroup\\\",\\\"Label\\\":\\\"Material Group\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"6377748B811142DE845EAAD3BAB59707\\\",\\\"instanceId\\\":\\\"6377748B811142DE845EAAD3BAB59707\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".E.SAP.MM.ANA.SE.PPM\\\",\\\"reportId\\\":\\\".E.SAP.MM.ANA.SE.PPM\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"analyzePartsPerMillion\\\",\\\"title\\\":\\\"Parts per Million\\\",\\\"subtitle\\\":\\\"By Returns and Quality Notifications\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1587378371682\\\",\\\"fioriId\\\":\\\"F4885\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU7M6Y6CNC5KYD1FLT3V\\\",\\\"tileType\\\":\\\"DT-CT\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".E.SAP.MM.ANA.SE.PPM\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/MMPUR_ANA_PARTSPERMILLION_SRV\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PARTSPERMILLIONQUERYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"0894EF4577411EDAA0DCBBDB07403630\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PARTSPERMILLIONQUERY_CDS.C_PARTSPERMILLIONQUERYResult/@com.sap.vocabularies.UI.v1.KPI#_E_SAP_MM_ANA_SE_PPM",
                                    dataPoint: "C_PARTSPERMILLIONQUERY_CDS.C_PARTSPERMILLIONQUERYResult/@com.sap.vocabularies.UI.v1.DataPoint#_E_SAP_MM_ANA_SE_PPM",
                                    selectionVariant: "C_PARTSPERMILLIONQUERY_CDS.C_PARTSPERMILLIONQUERYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_E_SAP_MM_ANA_SE_PPM"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_328D54F785B514D85A9B8CEC4B523B35#6FMR9SFQJTA09L22AM7FPGOEN",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0246"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Material Price Variance"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_328D54F785B514D85A9B8CEC4B523B35",
                                    inboundId: "6FMR9SFQJTA09L22LYKDLW412"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3294"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_35F1E9E7EDABD24755B6AAAD6173DCB6#42010AEE2A311EECA9A4EA818BA805F7",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://calendar"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                title: "Display Settlement Dates"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_35F1E9E7EDABD24755B6AAAD6173DCB6",
                                    inboundId: "42010AEE2A311EECA9A4EA818BA7E5F7_TM",
                                    parameters: {
                                        CndnContrProcessCategory: {
                                            value: {
                                                value: "1",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4964"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_3A5944BAA9B06B34C437E12C80333538#6FMR9SFQJTA231UQXVL8BYTM0",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://supplier"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-SUP",
                                title: "Display Suppliers",
                                subTitle: "Procurement"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_3A5944BAA9B06B34C437E12C80333538",
                                    inboundId: "6FMR9SFQJTA0CQD4XIE23SOQ9"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3371"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_3AB4EEB0FB595080E6D8BFE9089EE46E#FA163EDF73161ED690D4DCC1DEAAAA98_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME84"
                                    ]
                                },
                                title: "Create Scheduling Agreement Releases"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_3AB4EEB0FB595080E6D8BFE9089EE46E",
                                    inboundId: "FA163EDF73161ED690D4DCC1DEAAAA98_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_3AFE0E5CFC02E3522971D80C0C4CC011#FA163EDF73161ED59DE8784EC3A760D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0763"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-QUA",
                                tags: {
                                    keywords: [
                                        "/SRMSMC/WDA_QLB_OVP_MAIN"
                                    ]
                                },
                                title: "Manage Questions",
                                subTitle: "Evaluation"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_3AFE0E5CFC02E3522971D80C0C4CC011",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A760D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_3C6B76D8568CA47B5CB51EBCCCBFEE52#ET090PW4NWFG4OAR84QC6GSBE",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori8/F1332"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-REQ",
                                tags: {
                                    keywords: [
                                        "User Defaults"
                                    ]
                                },
                                title: "Default Settings for Users",
                                subTitle: "Purchase Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_3C6B76D8568CA47B5CB51EBCCCBFEE52",
                                    inboundId: "ET090PW4NWFG4OARABKN1ETEM",
                                    parameters: {
                                        mode: {
                                            value: {
                                                value: "admin",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1995"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_407636AEF2B1819D90D01F54F6CEA485#FA163EDF73161ED59DE8784EC3AA60D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0842-2"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME58"
                                    ]
                                },
                                title: "Create Purchase Order via Purchase Requisition Assignment List"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_407636AEF2B1819D90D01F54F6CEA485",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AA60D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_42C8F4D1218A8EED9060BE733E239350#00O2TPKTQCDUX5BH8UKACX32X",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Contract Expiry",
                                subTitle: "In the next 90 days",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PURCHASECONTRACTEXPIRY_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PURCHASECONTRACTEXPIRY_CDS',Version='0001')/Annotations(TechnicalName='005056AC156F1ED68A94DD30340DA0F4',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_42C8F4D1218A8EED9060BE733E239350",
                                    inboundId: "ET090M0NO76W9UE5VOXKW6G8I",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.CONTRACTEXPIRY.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0574"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583145726560",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQCDUX5BH8UKACX32X\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX5BH8UKACX32X\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.CONTRACTEXPIRY.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.CONTRACTEXPIRY.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseContract\\\",\\\"semanticAction\\\":\\\"analyzeExpiringContract\\\",\\\"title\\\":\\\"Contract Expiry\\\",\\\"subtitle\\\":\\\"In the next 90 days\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1478759327084\\\",\\\"fioriId\\\":\\\"F0574\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090M0NO76W9UE5VOXKW6G8I\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.CONTRACTEXPIRY.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PURCHASECONTRACTEXPIRY_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PurchaseContractExpiryResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"005056AC156F1ED68A94DD30340DA0F4\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PURCHASECONTRACTEXPIRY_CDS.C_PurchaseContractExpiryResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_CONTRACTEXPIRY_EVAL",
                                    dataPoint: "C_PURCHASECONTRACTEXPIRY_CDS.C_PurchaseContractExpiryResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_CONTRACTEXPIRY_EVAL",
                                    selectionVariant: "C_PURCHASECONTRACTEXPIRY_CDS.C_PurchaseContractExpiryResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_CONTRACTEXPIRY_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_4327D5F6C360A4B1269FEFD63C7D7F03#ET090PW4NWFG4NNNE05LFX3N2",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-VM-REC",
                                tags: {
                                    keywords: [
                                        "manage, purchasing, info record"
                                    ]
                                },
                                title: "Manage Purchasing Info Records"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_4327D5F6C360A4B1269FEFD63C7D7F03",
                                    inboundId: "ET090PW4NWFG4NNOIREIIPCED"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1982"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_435EDAA12FF28E310B706707BF1440D2#562C8862BFF4454EA60E052AA41A3FDF",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Supplier Evaluation By Quality",
                                subTitle: "Based on Quality Notification",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_SUPLREVALBYQLTYNOTIFQRY_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_SUPLREVALBYQLTYNOTIFQRY_CDS',Version='0001')/Annotations(TechnicalName='0894EF4577411EEAA1DC1FCFB7FD01CB',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_435EDAA12FF28E310B706707BF1440D2",
                                    inboundId: "3WO90XU7XL2X47NUTBDM8X0BI",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".E.SAP.MM.A.SE.QUALITYNOTIF",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3295A"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1615377909782",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"PurchasingGroup\\\",\\\"Label\\\":\\\"Purch. Group\\\"},{\\\"Id\\\":\\\"PurchasingOrganization\\\",\\\"Label\\\":\\\"Purchasing Org.\\\"},{\\\"Id\\\":\\\"Plant\\\",\\\"Label\\\":\\\"Plant\\\"},{\\\"Id\\\":\\\"MaterialGroup\\\",\\\"Label\\\":\\\"Material Group\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"562C8862BFF4454EA60E052AA41A3FDF\\\",\\\"instanceId\\\":\\\"562C8862BFF4454EA60E052AA41A3FDF\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".E.SAP.MM.A.SE.QUALITYNOTIF\\\",\\\"reportId\\\":\\\".E.SAP.MM.A.SE.QUALITYNOTIF\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"analyzeQualityNotifScore\\\",\\\"title\\\":\\\"Supplier Evaluation By Quality\\\",\\\"subtitle\\\":\\\"Based on Quality Notification\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1587959998461\\\",\\\"fioriId\\\":\\\"F3295A\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU7XL2X47NUTBDM8X0BI\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".E.SAP.MM.A.SE.QUALITYNOTIF\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_SUPLREVALBYQLTYNOTIFQRY_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_SUPLREVALBYQLTYNOTIFQRYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"0894EF4577411EEAA1DC1FCFB7FD01CB\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_SUPLREVALBYQLTYNOTIFQRY_CD_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_SUPLREVALBYQLTYNOTIFQRY_CDS.C_SUPLREVALBYQLTYNOTIFQRYResult/@com.sap.vocabularies.UI.v1.KPI#_E_SAP_MM_A_SE_QUALITYNOTIF",
                                    dataPoint: "C_SUPLREVALBYQLTYNOTIFQRY_CDS.C_SUPLREVALBYQLTYNOTIFQRYResult/@com.sap.vocabularies.UI.v1.DataPoint#_E_SAP_MM_A_SE_QUALITYNOTIF",
                                    selectionVariant: "C_SUPLREVALBYQLTYNOTIFQRY_CDS.C_SUPLREVALBYQLTYNOTIFQRYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_E_SAP_MM_A_SE_QUALITYNOTIF"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_445C8B62F43687729319CB02552D119B#FA163EDF73161ED59DE8784EC3A900D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://table-view"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME2K"
                                    ]
                                },
                                title: "Display Purch. Docs by Account Assignment"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_445C8B62F43687729319CB02552D119B",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A900D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_44BA697F46D7B4394C5A009E5723FB61#FA163EDF73161ED690D4DCC1DEAC4A98_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "MEK2"
                                    ]
                                },
                                title: "Change Price Conditions",
                                subTitle: "Purchasing"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_44BA697F46D7B4394C5A009E5723FB61",
                                    inboundId: "FA163EDF73161ED690D4DCC1DEAC4A98_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_463B9FC4AFDB9EA9B511D90FF24FACD3#FA163EDF73161ED59DE8784EC3AAC0D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori6/F0870"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME9E"
                                    ]
                                },
                                title: "Print Scheduling Agreement Releases"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_463B9FC4AFDB9EA9B511D90FF24FACD3",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AAC0D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_46F9BA6AB9D1E10800B9F1757CE40E67#9C16F4664C974BABAF499ABFC77BE0FE",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Supplier Evaluation By Quantity",
                                subTitle: "Based on Ordered and Received Quantity",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_SUPLREVALBYQUANTITYQRY_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_SUPLREVALBYQUANTITYQRY_CDS',Version='0001')/Annotations(TechnicalName='506B4BC345CC1EEB8292D237309D75D7',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_46F9BA6AB9D1E10800B9F1757CE40E67",
                                    inboundId: "3WO90XU7M6Y86FJ2512T8IYNQ",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.SUPLREVAL.QUANTITY",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1661A"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1615377583742",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"Plant\\\",\\\"Label\\\":\\\"Plant\\\"},{\\\"Id\\\":\\\"PurchasingGroup\\\",\\\"Label\\\":\\\"Purch. Group\\\"},{\\\"Id\\\":\\\"PurchasingOrganization\\\",\\\"Label\\\":\\\"Purchasing Org.\\\"},{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"},{\\\"Id\\\":\\\"MaterialGroup\\\",\\\"Label\\\":\\\"Material Group\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"9C16F4664C974BABAF499ABFC77BE0FE\\\",\\\"instanceId\\\":\\\"9C16F4664C974BABAF499ABFC77BE0FE\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.SUPLREVAL.QUANTITY\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.SUPLREVAL.QUANTITY\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"analyzeQuantity\\\",\\\"title\\\":\\\"Supplier Evaluation By Quantity\\\",\\\"subtitle\\\":\\\"Based on Ordered and Received Quantity\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1603899131673\\\",\\\"fioriId\\\":\\\"F1661A\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU7M6Y86FJ2512T8IYNQ\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.SUPLREVAL.QUANTITY\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_SUPLREVALBYQUANTITYQRY_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_SUPLREVALBYQUANTITYQRYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"506B4BC345CC1EEB8292D237309D75D7\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_SUPLREVALBYQUANTITYQRY_CDS_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_SUPLREVALBYQUANTITYQRY_CDS.C_SUPLREVALBYQUANTITYQRYResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_SUPLREVAL_QUANTITY",
                                    dataPoint: "C_SUPLREVALBYQUANTITYQRY_CDS.C_SUPLREVALBYQUANTITYQRYResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_SUPLREVAL_QUANTITY",
                                    selectionVariant: "C_SUPLREVALBYQUANTITYQRY_CDS.C_SUPLREVALBYQUANTITYQRYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_SUPLREVAL_QUANTITY"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_473682D169F8FF5DD0373858D519D5BF#00O2TPKTQCDUX5BH9PZZYFAOS",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Contract Leakage",
                                subTitle: " Purchasing Spend without Contract Reference",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PURCHASECONTRACTLEAKAGE_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PURCHASECONTRACTLEAKAGE_CDS',Version='0001')/Annotations(TechnicalName='6EAE8B4B94A71EE68A95351E1912BDCC',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_473682D169F8FF5DD0373858D519D5BF",
                                    inboundId: "ET090M0NO76Y069DT5LEWEVZP",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.CONTRACTLEAKAGE.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0681"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583156961892",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQCDUX5BH9PZZYFAOS\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX5BH9PZZYFAOS\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.CONTRACTLEAKAGE.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.CONTRACTLEAKAGE.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseContract\\\",\\\"semanticAction\\\":\\\"analyzeLeakage\\\",\\\"title\\\":\\\"Contract Leakage\\\",\\\"subtitle\\\":\\\" Purchasing Spend without Contract Reference\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1479804735460\\\",\\\"fioriId\\\":\\\"F0681\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090M0NO76Y069DT5LEWEVZP\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.CONTRACTLEAKAGE.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PURCHASECONTRACTLEAKAGE_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PURCHASECONTRACTLEAKAGEResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"6EAE8B4B94A71EE68A95351E1912BDCC\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PURCHASECONTRACTLEAKAGE_CDS.C_PURCHASECONTRACTLEAKAGEResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_CONTRACTLEAKAGE_EVAL",
                                    dataPoint: "C_PURCHASECONTRACTLEAKAGE_CDS.C_PURCHASECONTRACTLEAKAGEResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_CONTRACTLEAKAGE_EVAL",
                                    selectionVariant: "C_PURCHASECONTRACTLEAKAGE_CDS.C_PURCHASECONTRACTLEAKAGEResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_CONTRACTLEAKAGE_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_48716EB25034AAF405DB6A387EB2DAFA#00O2TPKTQCDUX5BH66VMIGWCI",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Unused Contracts",
                                subTitle: "Unchanged and Unreleased Contracts",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_UNUSEDPURCHASECONTRACTQ_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_UNUSEDPURCHASECONTRACTQ_CDS',Version='0001')/Annotations(TechnicalName='FA163EDF73161ED68A94E45D5847FB86',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_48716EB25034AAF405DB6A387EB2DAFA",
                                    inboundId: "ET090M0NO76Y069DQ6JX5IHCX",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.UNUSEDCONTRACT.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0575"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583145834585",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQCDUX5BH66VMIGWCI\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX5BH66VMIGWCI\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.UNUSEDCONTRACT.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.UNUSEDCONTRACT.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseContract\\\",\\\"semanticAction\\\":\\\"analyzeUnusedContracts\\\",\\\"title\\\":\\\"Unused Contracts\\\",\\\"subtitle\\\":\\\"Unchanged and Unreleased Contracts\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1479804635201\\\",\\\"fioriId\\\":\\\"F0575\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090M0NO76Y069DQ6JX5IHCX\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.UNUSEDCONTRACT.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_UNUSEDPURCHASECONTRACTQ_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_UnusedPurchaseContractQResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"FA163EDF73161ED68A94E45D5847FB86\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_UNUSEDPURCHASECONTRACTQ_CDS.C_UnusedPurchaseContractQResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_UNUSEDCONTRACT_EVAL",
                                    dataPoint: "C_UNUSEDPURCHASECONTRACTQ_CDS.C_UnusedPurchaseContractQResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_UNUSEDCONTRACT_EVAL",
                                    selectionVariant: "C_UNUSEDPURCHASECONTRACTQ_CDS.C_UnusedPurchaseContractQResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_UNUSEDCONTRACT_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_48789DDDAFA0CFD7657E7670A6D2E648#FA163EDF73161ED59DE8784EC3A9E0D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://FioriNonNative/FN0003"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME32L"
                                    ]
                                },
                                title: "Change Scheduling Agreement"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_48789DDDAFA0CFD7657E7670A6D2E648",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A9E0D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_4A3C9A7DAB668D9EB86F17027B83C00B#0894EF4577A91EDAA7D16B9193AFB771_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0343"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME16"
                                    ]
                                },
                                title: "Maintain Deletion Proposals of Purchasing Info Record"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_4A3C9A7DAB668D9EB86F17027B83C00B",
                                    inboundId: "0894EF4577A91EDAA7D16B9193AFB771_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_4A9104362B36C73EF2BEB68E4761619C#ET090M0NO76Y0DYJQT0W6LZ08",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-PO",
                                title: "Mass Changes to Purchase Orders"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_4A9104362B36C73EF2BEB68E4761619C",
                                    inboundId: "ET090M0NO76Y0DYJV3NQ43LAC"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2593"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_4AFDAEB9B8D1D31D8E44DE72E9DEF513#42010AEE2A7C1EDAB2E2D93649F80441",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://supplier"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-PO",
                                title: "Manage Supplier Confirmations"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_4AFDAEB9B8D1D31D8E44DE72E9DEF513",
                                    inboundId: "42010AEE2A7C1EDAB2E2BEB0123A2440_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F5039"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_4BA920FF3D1DA2AF33AB96070B26E3D4#ET090M0NO76W68G7EYAZBULEW",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0006"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-RFQ",
                                title: "Manage Supplier Quotations"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_4BA920FF3D1DA2AF33AB96070B26E3D4",
                                    inboundId: "ET090M0NO76W68G769OXOWO8H"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1991"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_4C36F809BF96537B6601D334CD802614#8CDCD4008ED01ED7B895F0976B20EB60_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0955"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "BW-RUI-FPM",
                                tags: {
                                    keywords: [
                                        "FPM_BICS_OVP"
                                    ]
                                },
                                title: "Service Spend"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_4C36F809BF96537B6601D334CD802614",
                                    inboundId: "8CDCD4008ED01ED7B895F0976B20EB60_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_4CB21BD23CA3D4C119E831C7C22B1345#00O2TPKTQCDUX68OYD12VXH8H",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchasing Spend",
                                subTitle: "Comparison of Spend",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PURGSPENDCOMPRN_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PURGSPENDCOMPRN_CDS',Version='0001')/Annotations(TechnicalName='FA163EDF73161ED68A94C1CE26F7BACF',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_4CB21BD23CA3D4C119E831C7C22B1345",
                                    inboundId: "ET090M0NO76Y069E8XTUOTIBG",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.PURCHASINGSPENDEVALUATION",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0683"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583160842199",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQCDUX68OYD12VXH8H\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX68OYD12VXH8H\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.PURCHASINGSPENDEVALUATION\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.PURCHASINGSPENDEVALUATION\\\",\\\"semanticObject\\\":\\\"PurchaseOrder\\\",\\\"semanticAction\\\":\\\"analyzePurchasingSpend\\\",\\\"title\\\":\\\"Purchasing Spend\\\",\\\"subtitle\\\":\\\"Comparison of Spend\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1479805281326\\\",\\\"fioriId\\\":\\\"F0683\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090M0NO76Y069E8XTUOTIBG\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.PURCHASINGSPENDEVALUATION\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PURGSPENDCOMPRN_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PURGSPENDCOMPRNResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"FA163EDF73161ED68A94C1CE26F7BACF\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PURGSPENDCOMPRN_CDS.C_PURGSPENDCOMPRNResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_PURCHASINGSPENDEVALUATION",
                                    dataPoint: "C_PURGSPENDCOMPRN_CDS.C_PURGSPENDCOMPRNResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_PURCHASINGSPENDEVALUATION",
                                    selectionVariant: "C_PURGSPENDCOMPRN_CDS.C_PURGSPENDCOMPRNResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_PURCHASINGSPENDEVALUATION"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_4EBC75A63C8E237F788B5A630692D8C5#42010AEE2A7C1EDAB399C053E664C865",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Supplier Evaluation Score Output"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_4EBC75A63C8E237F788B5A630692D8C5",
                                    inboundId: "42010AEE2A7C1EDAB399A931B119E862_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F5061"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_520EB921C87AB0498D5EEB0D9B491536#ET090PW4NWFHUWYW8VLLTD6NZ",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchase Requisition To Order Cycle Time",
                                subTitle: "Release Strategy",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_REQNTOORDERCYCLETIME_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_REQNTOORDERCYCLETIME_CDS',Version='0001')/Annotations(TechnicalName='005056AC4BF11ED68A9434EA936CEF91',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_520EB921C87AB0498D5EEB0D9B491536",
                                    inboundId: "ET090M0NO76Y069ENFSVDRPGK",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.REQNTOORDERCYCLETIME.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2017"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583161466054",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET090PW4NWFHUWYW8VLLTD6NZ\\\",\\\"instanceId\\\":\\\"ET090PW4NWFHUWYW8VLLTD6NZ\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.REQNTOORDERCYCLETIME.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.REQNTOORDERCYCLETIME.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseRequisitionItem\\\",\\\"semanticAction\\\":\\\"analyzeOrderToCycleTime\\\",\\\"title\\\":\\\"Purchase Requisition To Order Cycle Time\\\",\\\"subtitle\\\":\\\"Release Strategy\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1479805780327\\\",\\\"fioriId\\\":\\\"F2017\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090M0NO76Y069ENFSVDRPGK\\\",\\\"tileType\\\":\\\"DT-CM\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"COLUMN_NAMES\\\":[{\\\"COLUMN_NAME\\\":\\\"ApprovalDaysForMediumCostItems\\\",\\\"semanticColor\\\":\\\"Neutral\\\"},{\\\"COLUMN_NAME\\\":\\\"ApprovalDaysForHighCostItems\\\",\\\"semanticColor\\\":\\\"Neutral\\\"},{\\\"COLUMN_NAME\\\":\\\"_none^\\\",\\\"semanticColor\\\":\\\"Neutral\\\"}]}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.REQNTOORDERCYCLETIME.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_REQNTOORDERCYCLETIME_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_ReqnToOrderCycleTimeResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"005056AC4BF11ED68A9434EA936CEF91\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_REQNTOORDERCYCLETIME_CDS.C_ReqnToOrderCycleTimeResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_REQNTOORDERCYCLETIME_EVAL",
                                    dataPoint: "C_REQNTOORDERCYCLETIME_CDS.C_ReqnToOrderCycleTimeResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_REQNTOORDERCYCLETIME_EVAL",
                                    selectionVariant: "C_REQNTOORDERCYCLETIME_CDS.C_ReqnToOrderCycleTimeResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_REQNTOORDERCYCLETIME_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_56134001CFD5E369B343CEAEB443F5A2#ET090M0NO76W9MOT2AOBMBFGC",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://customer"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-PO",
                                info: "Pending Confirmations",
                                title: "Monitor Supplier Confirmations",
                                dataSources: {
                                    "viz.ET090M0NO76W9MOT2AOBMBFGC.indicator": {
                                        uri: "/sap/opu/odata/sap/MM_PUR_SUPLRCONF_MNTR_SRV",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_56134001CFD5E369B343CEAEB443F5A2",
                                    inboundId: "ET090M0NO76W9MOT8CQ8GWF8O"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "C_PurgDocSuplrConfMain(P_DisplayCurrency=%27EUR%27)/Results/$count",
                                    refresh: 60,
                                    dataSource: "viz.ET090M0NO76W9MOT2AOBMBFGC.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2359"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_56C6B2A7476C51560EFEF0A10E32EBEE#ET090PW4NWFHUWF9TEQV8V6PD",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchase Requisition No Touch Rate",
                                subTitle: "PR Items Processed Automatically",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_REQUISITIONNOTOUCHRATE_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_REQUISITIONNOTOUCHRATE_CDS',Version='0001')/Annotations(TechnicalName='005056AC4BF11ED68A94201C1A66EF2D',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_56C6B2A7476C51560EFEF0A10E32EBEE",
                                    inboundId: "ET090M0NO76W9UE557E02OCDY",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.REQUISITIONNOTOUCHRATE.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2018"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1550736963108",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET090PW4NWFHUWF9TEQV8V6PD\\\",\\\"instanceId\\\":\\\"ET090PW4NWFHUWF9TEQV8V6PD\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.REQUISITIONNOTOUCHRATE.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.REQUISITIONNOTOUCHRATE.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseRequisitionItem\\\",\\\"semanticAction\\\":\\\"analyzeNoTouchRate\\\",\\\"title\\\":\\\"Purchase Requisition No Touch Rate\\\",\\\"subtitle\\\":\\\"PR Items Processed Automatically\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1478758413036\\\",\\\"fioriId\\\":\\\"F2018\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090M0NO76W9UE557E02OCDY\\\",\\\"tileType\\\":\\\"DT-CM\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"COLUMN_NAMES\\\":[{\\\"COLUMN_NAME\\\":\\\"HighTouchRatio\\\",\\\"semanticColor\\\":\\\"Neutral\\\"},{\\\"COLUMN_NAME\\\":\\\"LowTouchRatio\\\",\\\"semanticColor\\\":\\\"Neutral\\\"},{\\\"COLUMN_NAME\\\":\\\"_none^\\\",\\\"semanticColor\\\":\\\"Neutral\\\"}],\\\"dimension\\\":\\\"CalendarMonth\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.REQUISITIONNOTOUCHRATE.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_REQUISITIONNOTOUCHRATE_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_REQUISITIONNOTOUCHRATEResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"005056AC4BF11ED68A94201C1A66EF2D\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"sadlAnnotationModelName\\\":\\\"\\\",\\\"sadlAnnotationModelVersion\\\":\\\"\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_REQUISITIONNOTOUCHRATE_CDS.C_REQUISITIONNOTOUCHRATEResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_REQUISITIONNOTOUCHRATE_EVAL",
                                    dataPoint: "C_REQUISITIONNOTOUCHRATE_CDS.C_REQUISITIONNOTOUCHRATEResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_REQUISITIONNOTOUCHRATE_EVAL",
                                    selectionVariant: "C_REQUISITIONNOTOUCHRATE_CDS.C_REQUISITIONNOTOUCHRATEResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_REQUISITIONNOTOUCHRATE_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_5709A145575DC4B01C2DEB8F2A0C07D5#6FMR9SFQJTA08OPYQ9C5LJS8D",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-VM-REC",
                                title: "Mass Changes to Purchasing Info Records"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_5709A145575DC4B01C2DEB8F2A0C07D5",
                                    inboundId: "6FMR9SFQJTA08OPYXACROTN7M"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2667"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_5BF65193D31BBD6A708DC9A8738F9DD4#ET090PW4NWFG4OAZ5YCA7GUK0",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://list"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-SQ-SLI",
                                title: "Manage Source Lists"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_5BF65193D31BBD6A708DC9A8738F9DD4",
                                    inboundId: "ET090PW4NWFG4OAZ8LX0O24ZF"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1859"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_5F39AEBC47A7C09AB42072130FDFB730#8CDCD4008ED01ED7B895E6EE7BE0EAF1_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0955"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "BW-RUI-FPM",
                                tags: {
                                    keywords: [
                                        "FPM_BICS_OVP"
                                    ]
                                },
                                title: "Purchasing Spend"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_5F39AEBC47A7C09AB42072130FDFB730",
                                    inboundId: "8CDCD4008ED01ED7B895E6EE7BE0EAF1_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6231B41EBFFC60747A575E7585AFD8BD#ET090M0NO76Y0EJSUB8FPQV8N",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0260"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Supplier Evaluation Weighting and Scoring"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6231B41EBFFC60747A575E7585AFD8BD",
                                    inboundId: "ET090M0NO76Y0EJT0JVFYXXHX"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2551"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_634661A897DF749040FA411DCD2E4FF2#506B4BC345C41EDCA98FF10B9D8B3E93_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://batch-payments"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                tags: {
                                    keywords: [
                                        "WB2R_BUSVOL"
                                    ]
                                },
                                title: "Display Business Volume",
                                subTitle: "Condition Contracts"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_634661A897DF749040FA411DCD2E4FF2",
                                    inboundId: "506B4BC345C41EDCA98FF10B9D8B3E93_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6490CBE555BF21063B36FA107C56042D#42010AEE28151EDD8C838D983B9249D8",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-PO-OM",
                                tags: {
                                    keywords: [
                                        "Job, Scheduling, Automation"
                                    ]
                                },
                                title: "Schedule Order Acknowledgement output for Purchase Orders"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6490CBE555BF21063B36FA107C56042D",
                                    inboundId: "42010AEE28151EDD8C838D983B9229D8_TM",
                                    parameters: {
                                        JobCatalogEntryName: {
                                            value: {
                                                value: "SAP_MM_PUR_ORD_ACKNOWLEDGEMENT",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F7082"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_64CACDF279AEDAF5526F798829F9F358#ET090M0NO76W9M1S3LQTYHD75",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0260"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-HBA",
                                title: "Adjust Operational Supplier Evaluation Score"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_64CACDF279AEDAF5526F798829F9F358",
                                    inboundId: "ET090M0NO76W9M1S6QLBK9O9Y"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2312"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6520803F8496438F4255BBDEFA73152F#ET090M0NO76XZNNY39G4QU4PU",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori3/F0510"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-CAT",
                                title: "Manage Purchasing Categories"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6520803F8496438F4255BBDEFA73152F",
                                    inboundId: "ET090PW4NWFG7YZKM9PJ8IHXH"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0337"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6AAAF3CF99873254D0C38658A9E932E3#ET090M0NO76W68G7DCDW3H9T0",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0006"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-RFQ",
                                title: "Manage RFQs"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6AAAF3CF99873254D0C38658A9E932E3",
                                    inboundId: "ET090M0NO76W68G738S2MC4A1"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2049"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6B9742B8EB7D45F56F736FA111F13BA5#ET090PW4NWFHYMMD3MH1R62WY",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-REQ",
                                title: "Monitor Purchase Requisition Items"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6B9742B8EB7D45F56F736FA111F13BA5",
                                    inboundId: "ET090PW4NWFHYMMDCPO00YYKM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2424"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6CCC75DD1E6BFA866FB58B83259DEF39#3WO90XZ14NGLDA6FOA5FZIC64",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://source-code"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-SQ-CON",
                                title: "Custom Manage Purchase Contract",
                                subTitle: "UYZBasic for sap-app-origin dev project"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6CCC75DD1E6BFA866FB58B83259DEF39",
                                    inboundId: "3WO90XZ14NGLDA6FHJEGJEMKO"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1600A"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6D2091BC31D9E65A8D03D2065C3891E5#0894EF4577A91EE986DFA9C214510911_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME05"
                                    ]
                                },
                                title: "Generate Source List"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6D2091BC31D9E65A8D03D2065C3891E5",
                                    inboundId: "0894EF4577A91EE986DFA9C214510911_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6D4574D5A186CF7B69EAF6CD27B52B65#ET091I2703I1AFXTNDWPU65R1",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori4/F0587"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Manage User-Defined Criteria for Supplier Evaluation"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6D4574D5A186CF7B69EAF6CD27B52B65",
                                    inboundId: "ET091I2703I1AFXTSN7GLHQFI"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3812"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6D851338C3F4A3669679CFEE8A30F3EC#42010AEE28151EEC80842199D623BDB3",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://decision"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Display Purchasing Document Items",
                                subTitle: "Without GR-Based Invoice Verification",
                                dataSources: {
                                    "viz.42010AEE28151EEC80842199D623BDB3.indicator": {
                                        uri: "/sap/opu/odata/sap/C_MNTRDOCWTHGRIRFLAGNOTSET_CDS",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6D851338C3F4A3669679CFEE8A30F3EC",
                                    inboundId: "42010AEE28151EEBBFDF1FE39D1A1B7D_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "C_MntrDocWthGRIRFlagNotSet(P_DateFunction=%27PREVIOUSYEARTODATE%27)/Set/$count",
                                    refresh: 60,
                                    dataSource: "viz.42010AEE28151EEC80842199D623BDB3.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F6096"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_6ED225A2A35954CC07DF15C15DA5518B#ET090M0NO76W9MOS7JPVD615E",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0343"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-PO",
                                info: "Overdue",
                                title: "Monitor Purchase Order Items",
                                dataSources: {
                                    "viz.ET090M0NO76W9MOS7JPVD615E.indicator": {
                                        uri: "/sap/opu/odata/SAP/MM_PUR_POITEMS_MONI_SRV",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_6ED225A2A35954CC07DF15C15DA5518B",
                                    inboundId: "ET090M0NO76W9MOST5159J9OA"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "C_PurchaseOrderItemMoni(P_DisplayCurrency=%27EUR%27)/Results/$count?$filter=(DeliveryStatus%20eq%20%2701%27)",
                                    refresh: 7200,
                                    dataSource: "viz.ET090M0NO76W9MOS7JPVD615E.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2358"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_705171A6509BACEB424A907872AAEC11#42010AEE2A311EEB8B9E01A88E888F9D",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "CA-VCM-MON",
                                title: "Monitor Value Chains"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_705171A6509BACEB424A907872AAEC11",
                                    inboundId: "42010AEE2A311EEB8B9DF43DE02F0F9B_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4854"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_717C2856A033CBCDE1843EA598A9B1F7#00O2TO9JBQW5AB9M82PTT4W53",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchasing Group Activities",
                                subTitle: "Purchasing Documents by Purchasing Group",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PURCHASINGGROUPANALYSIS_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PURCHASINGGROUPANALYSIS_CDS',Version='0001')/Annotations(TechnicalName='FA163E5855D81ED68A9467FD5181EFAD',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_717C2856A033CBCDE1843EA598A9B1F7",
                                    inboundId: "ET090PW4NWFHYOCDQCURBK4OA",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.PURCHASINGGROUPANALYSIS",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1660"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583159870005",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TO9JBQW5AB9M82PTT4W53\\\",\\\"instanceId\\\":\\\"00O2TO9JBQW5AB9M82PTT4W53\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.PURCHASINGGROUPANALYSIS\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.PURCHASINGGROUPANALYSIS\\\",\\\"semanticObject\\\":\\\"PurchasingGroup\\\",\\\"semanticAction\\\":\\\"analyze\\\",\\\"title\\\":\\\"Purchasing Group Activities\\\",\\\"subtitle\\\":\\\"Purchasing Documents by Purchasing Group\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1478758935004\\\",\\\"fioriId\\\":\\\"F1660\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYOCDQCURBK4OA\\\",\\\"tileType\\\":\\\"DT-CT\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"dimension\\\":\\\"PurchasingGroup\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.PURCHASINGGROUPANALYSIS\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PURCHASINGGROUPANALYSIS_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PurchasingGroupAnalysisResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"FA163E5855D81ED68A9467FD5181EFAD\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_PURCHASINGGROUPANALYSIS_CD_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PURCHASINGGROUPANALYSIS_CDS.C_PurchasingGroupAnalysisResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_PURCHASINGGROUPANALYSIS",
                                    dataPoint: "C_PURCHASINGGROUPANALYSIS_CDS.C_PurchasingGroupAnalysisResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_PURCHASINGGROUPANALYSIS",
                                    selectionVariant: "C_PURCHASINGGROUPANALYSIS_CDS.C_PurchasingGroupAnalysisResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_PURCHASINGGROUPANALYSIS"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_75D1551AEDD18EA1C4CA4BDF7A79C348#FA163EDF73161ED59DE8784EC3A940D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://table-view"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME2M"
                                    ]
                                },
                                title: "Display Purchasing Documents by Material"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_75D1551AEDD18EA1C4CA4BDF7A79C348",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A940D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_76F305E23E7909647DC00DCCA4C9A6B9#ET091I2703I1AHEVNCROQ1Q6D",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Overall Supplier Evaluation",
                                subTitle: "Score",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/MM_PUR_ANA_SUPPLEVALOVERALL_SRV",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='MM_PUR_ANA_SUPPLEVALOVERALL_SRV',Version='0001')/Annotations(TechnicalName='42F2E9AFC3DF1EE9B0FCCA590234538E',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_76F305E23E7909647DC00DCCA4C9A6B9",
                                    inboundId: "ET091I2703I1AHEVMR036ZQV6",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.OVERALLSUPPLIEREVAL.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2019"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1613713710838",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"},{\\\"Id\\\":\\\"MaterialGroup\\\",\\\"Label\\\":\\\"Material Group\\\"},{\\\"Id\\\":\\\"PurchasingGroup\\\",\\\"Label\\\":\\\"Purch. Group\\\"},{\\\"Id\\\":\\\"PurchasingOrganization\\\",\\\"Label\\\":\\\"Purchasing Org.\\\"},{\\\"Id\\\":\\\"Plant\\\",\\\"Label\\\":\\\"Plant\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET091I2703I1AHEVNCROQ1Q6D\\\",\\\"instanceId\\\":\\\"ET091I2703I1AHEVNCROQ1Q6D\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.OVERALLSUPPLIEREVAL.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.OVERALLSUPPLIEREVAL.EVAL\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticActon\\\":\\\"analyzeOverallScore\\\",\\\"title\\\":\\\"Overall Supplier Evaluation\\\",\\\"subtitle\\\":\\\"Score\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1566386107851\\\",\\\"fioriId\\\":\\\"F2019\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"ET091I2703I1AHEVMR036ZQV6\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.OVERALLSUPPLIEREVAL.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/MM_PUR_ANA_SUPPLEVALOVERALL_SRV\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_SUPPLIEREVALOVERALLQRYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"42F2E9AFC3DF1EE9B0FCCA590234538E\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_SUPPLIEREVALOVERALLQRY_CDS.C_SUPPLIEREVALOVERALLQRYResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_OVERALLSUPPLIEREVAL_EVAL",
                                    dataPoint: "C_SUPPLIEREVALOVERALLQRY_CDS.C_SUPPLIEREVALOVERALLQRYResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_OVERALLSUPPLIEREVAL_EVAL",
                                    selectionVariant: "C_SUPPLIEREVALOVERALLQRY_CDS.C_SUPPLIEREVALOVERALLQRYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_OVERALLSUPPLIEREVAL_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_778DD9E2143553433391B4EBFB2BE219#42010AEE28151EED8C8422AEC9030FD1",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-PO-OM",
                                tags: {
                                    keywords: [
                                        "Job, Scheduling, Automation,Reminder,Dunning"
                                    ]
                                },
                                title: "Schedule Dunning Reminder output for Purchase Orders"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_778DD9E2143553433391B4EBFB2BE219",
                                    inboundId: "42010AEE28151EED8C8422AEC902EFD1_TM",
                                    parameters: {
                                        JobCatalogEntryName: {
                                            value: {
                                                value: "SAP_MM_PUR_PO_REMINDER",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F7083"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_782CED7F74963C6D63E5EFF57826795E#FA163EDF73161ED59DE8784EC3AA20D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0002"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-REQ",
                                tags: {
                                    keywords: [
                                        "ME51N"
                                    ]
                                },
                                title: "Create Purchase Requisition",
                                subTitle: "Advanced"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_782CED7F74963C6D63E5EFF57826795E",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AA20D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        },
                                        "sap-ushell-innerAppRoute": {
                                            value: {
                                                value: "h4screen=advanced",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_7A81998BF9B11EE42D44DF27E2F2FD05#42010AEE28151EEB98AFA6BC6F255DD3",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0023"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-SPQ",
                                title: "Manage Preferred Supplier Lists"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_7A81998BF9B11EE42D44DF27E2F2FD05",
                                    inboundId: "42010AEE28151EEB98AFA0DDDDB15DD3_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4333"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_7FF46792890FBFAA1B0C738E26D2AC05#FA163EDF73161ED59DE8784EC3A960D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://table-view"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME2ON"
                                    ]
                                },
                                title: "Display Subcontracting Stocks by Supplier"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_7FF46792890FBFAA1B0C738E26D2AC05",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A960D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_81A278273425CE89D1BE233F431374EC#00O2TPKTQCDUX4UFXHK2OOYDL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0002"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-REQ-SOC",
                                title: "Process Purchase Requisitions",
                                subTitle: "Formerly Manage Purchase Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_81A278273425CE89D1BE233F431374EC",
                                    inboundId: "00O2TPKTQCDUX4UFXB6UNJFGP",
                                    parameters: {
                                        source: {
                                            value: {
                                                value: "lpd",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1048"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_835B9F7448284F53BCD375BFB180409F#ET090M0NO76W9SNOH9W7Y3SCX",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://decision"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-HBA",
                                info: "Expiring",
                                title: "Monitor Purchase Contract Items",
                                dataSources: {
                                    "viz.ET090M0NO76W9SNOH9W7Y3SCX.indicator": {
                                        uri: "/sap/opu/odata/sap/MM_PUR_CTRITEM_MNTR_SRV_01",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_835B9F7448284F53BCD375BFB180409F",
                                    inboundId: "ET090M0NO76W9SNOPNHYD1ZTG"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "C_ContractStatusValueHelp/$count?$filter=(PurchaseContractValidityStatus eq '01')",
                                    refresh: 60,
                                    dataSource: "viz.ET090M0NO76W9SNOH9W7Y3SCX.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2423"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_83BB0F2D8F916052238313A83F90D139#FA163EDF73161ED59DE8784EC3AC60D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0002"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-REQ",
                                tags: {
                                    keywords: [
                                        "ME53N"
                                    ]
                                },
                                title: "Display and Maintain Purchase Requisition",
                                subTitle: "Advanced"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_83BB0F2D8F916052238313A83F90D139",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AC60D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_87AB41FC3EFE241EEF4846722762EF32#42010AEF4C9F1EDD8BA11A7280C5E955_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://activities"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-GF-OC",
                                tags: {
                                    keywords: [
                                        "ME91FF"
                                    ]
                                },
                                title: "Dunning Reminder on Purchase Order",
                                subTitle: "Advanced"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_87AB41FC3EFE241EEF4846722762EF32",
                                    inboundId: "42010AEF4C9F1EDD8BA11A7280C5E955_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_87F9958292BE4F226D697159AE74F981#506B4BC345C41EDCA990056EF1E87F48_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://present"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                tags: {
                                    keywords: [
                                        "WB2R_EXTENSION"
                                    ]
                                },
                                title: "Extend Condition Contracts"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_87F9958292BE4F226D697159AE74F981",
                                    inboundId: "506B4BC345C41EDCA990056EF1E87F48_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_88D8A5225C853387A53542C7EB4F9C18#FA163EDF73161ED59DE8784EC3A8C0D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0842-2"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME21N"
                                    ]
                                },
                                title: "Create Purchase Order",
                                subTitle: "Advanced"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_88D8A5225C853387A53542C7EB4F9C18",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A8C0D2_TM",
                                    parameters: {
                                        uitype: {
                                            value: {
                                                value: "advanced",
                                                format: "plain"
                                            }
                                        },
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_89DA587F2747B948F7243438F0B569B0#FA163EDF73161EE5B8BB848D4B460E7B_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME39"
                                    ]
                                },
                                title: "Display Scheduling Agreement Schedule"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_89DA587F2747B948F7243438F0B569B0",
                                    inboundId: "FA163EDF73161EE5B8BB848D4B460E7B_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_8AE8D7B750AB111ECFE8DE78454D6BB6#0894EF4577A91EDAA7D2487BB1CE7B9B_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0343"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "MEKA"
                                    ]
                                },
                                title: "Maintain Purchasing Conditions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_8AE8D7B750AB111ECFE8DE78454D6BB6",
                                    inboundId: "0894EF4577A91EDAA7D2487BB1CE7B9B_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_8C12B7A05A10914A214E90382ACF7FE6#506B4BC345C41EDCA98FF5A2569DBEED_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://per-diem"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                tags: {
                                    keywords: [
                                        "WB2R_SETTL_CAL"
                                    ]
                                },
                                title: "Display Settlement Calendars",
                                subTitle: "Condition Contracts"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_8C12B7A05A10914A214E90382ACF7FE6",
                                    inboundId: "506B4BC345C41EDCA98FF5A2569DBEED_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_8E228EA810EE5216877E229CE112255C#FA163EDF73161ED690D4DCC1DEAB6A98_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME1W"
                                    ]
                                },
                                title: "Display Purchasing Info Record by Material Group"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_8E228EA810EE5216877E229CE112255C",
                                    inboundId: "FA163EDF73161ED690D4DCC1DEAB6A98_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9019918F248A6447BDD6409D92B64A40#ET090PW4NWFG7XYCR9CMV3C5N",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0406"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-REQ-PRF",
                                title: "Manage Purchase Requisitions",
                                subTitle: "Professional"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9019918F248A6447BDD6409D92B64A40",
                                    inboundId: "ET090PW4NWFG7XYD0O427O3NO"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2229"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_924F8982F8F96432AF12D8F0C744242C#FA163EDF73161ED59DE8784EC3AA00D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://FioriNonNative/FN0003"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME38"
                                    ]
                                },
                                title: "Manage SA Delivery Schedule"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_924F8982F8F96432AF12D8F0C744242C",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AA00D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_92D73E96B4999EC09E9C5C4FD2D4E391#ET091VRSCA1TJSSPBFBKKBPQN",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Request For Quotation Types",
                                subTitle: "RFQ Target Value and Types",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_RFQSOURCINGEVENTTYPES_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_RFQSOURCINGEVENTTYPES_CDS',Version='0001')/Annotations(TechnicalName='42F2E9AFBE7F1ED99DC286FD0FA713CA',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_92D73E96B4999EC09E9C5C4FD2D4E391",
                                    inboundId: "ET091VRSCA1TJSSPAIOK35823",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".E.1557816314717",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4149"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583160582413",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET091VRSCA1TJSSPBFBKKBPQN\\\",\\\"instanceId\\\":\\\"ET091VRSCA1TJSSPBFBKKBPQN\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".E.1557816314717\\\",\\\"reportId\\\":\\\".E.1557816314717\\\",\\\"semanticObject\\\":\\\"RequestForQuotation\\\",\\\"semanticAction\\\":\\\"analyze\\\",\\\"title\\\":\\\"Request For Quotation Types\\\",\\\"subtitle\\\":\\\"RFQ Target Value and Types\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1557821554014\\\",\\\"fioriId\\\":\\\"F4149\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"ET091VRSCA1TJSSPAIOK35823\\\",\\\"tileType\\\":\\\"DT-CM\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"COLUMN_NAMES\\\":[{\\\"COLUMN_NAME\\\":\\\"InternalSourcingReqTargetAmt\\\",\\\"semanticColor\\\":\\\"Good\\\"},{\\\"COLUMN_NAME\\\":\\\"ExternalSourcingReqTargetAmt\\\",\\\"semanticColor\\\":\\\"Good\\\"},{\\\"COLUMN_NAME\\\":\\\"ExternalPricingReqTargetAmt\\\",\\\"semanticColor\\\":\\\"Good\\\"}]}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".E.1557816314717\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_RFQSOURCINGEVENTTYPES_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_RFQSourcingEventTypesResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"42F2E9AFBE7F1ED99DC286FD0FA713CA\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_RFQSOURCINGEVENTTYPES_CDS_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_RFQSOURCINGEVENTTYPES_CDS.C_RFQSourcingEventTypesResult/@com.sap.vocabularies.UI.v1.KPI#_E_1557816314717",
                                    dataPoint: "C_RFQSOURCINGEVENTTYPES_CDS.C_RFQSourcingEventTypesResult/@com.sap.vocabularies.UI.v1.DataPoint#_E_1557816314717",
                                    selectionVariant: "C_RFQSOURCINGEVENTTYPES_CDS.C_RFQSourcingEventTypesResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_E_1557816314717"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9763DC4E4762B0DC8BE4BD5D3F74B3F2#ET090M0NO76W9M7LF36F8G7FX",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0735"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-EVL",
                                title: "Manage Evaluation Questionnaires",
                                subTitle: "Evaluation"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9763DC4E4762B0DC8BE4BD5D3F74B3F2",
                                    inboundId: "ET090M0NO76W9M7LPOEKXFFN4",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "UI5",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2194"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9917E675F6522C28674FD6F7CDDF8358#ET090PW4NWFHUWYWNXQ33M2CH",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0842-1"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-SVC-SES",
                                title: "Manage Service Entry Sheets",
                                subTitle: "Lean Services"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9917E675F6522C28674FD6F7CDDF8358",
                                    inboundId: "ET090PW4NWFHUWYWWD5F480HW"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2027"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9A2F7230CD9DCE8AF3C20AE201BC2507#00O2TPKTQNBJCE5Z875JCPW3S",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchase Order Average Delivery Time",
                                subTitle: "Weighted (In Days)",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PURORDAVGDELIVTIME_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PURORDAVGDELIVTIME_CDS',Version='0001')/Annotations(TechnicalName='FA163EAA1C9C1ED68A9484FD2450DB62',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9A2F7230CD9DCE8AF3C20AE201BC2507",
                                    inboundId: "ET090PW4NWFHYOCDTSC6O1DQU",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.PURORDAVGDLVRYTIMEEVALUATION",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1380"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583158765143",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQNBJCE5Z875JCPW3S\\\",\\\"instanceId\\\":\\\"00O2TPKTQNBJCE5Z875JCPW3S\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.PURORDAVGDLVRYTIMEEVALUATION\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.PURORDAVGDLVRYTIMEEVALUATION\\\",\\\"semanticObject\\\":\\\"PurchaseOrder\\\",\\\"semanticAction\\\":\\\"analyzeAverageDeliveryTime\\\",\\\"title\\\":\\\"Purchase Order Average Delivery Time\\\",\\\"subtitle\\\":\\\"Weighted (In Days)\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1478759050149\\\",\\\"fioriId\\\":\\\"F1380\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYOCDTSC6O1DQU\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.PURORDAVGDLVRYTIMEEVALUATION\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PURORDAVGDELIVTIME_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PURORDAVGDELIVTIMEResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"FA163EAA1C9C1ED68A9484FD2450DB62\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PURORDAVGDELIVTIME_CDS.C_PURORDAVGDELIVTIMEResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_PURORDAVGDLVRYTIMEEVALUATION",
                                    dataPoint: "C_PURORDAVGDELIVTIME_CDS.C_PURORDAVGDELIVTIMEResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_PURORDAVGDLVRYTIMEEVALUATION",
                                    selectionVariant: "C_PURORDAVGDELIVTIME_CDS.C_PURORDAVGDELIVTIMEResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_PURORDAVGDLVRYTIMEEVALUATION"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9BBDD6C84C413242ED80878B5E9656E3#FA163EDF73161ED59DE8784EC3A8E0D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0343"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME22N"
                                    ]
                                },
                                title: "Change Purchase Order",
                                subTitle: "Advanced"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9BBDD6C84C413242ED80878B5E9656E3",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A8E0D2_TM",
                                    parameters: {
                                        uitype: {
                                            value: {
                                                value: "advancedNoPar",
                                                format: "plain"
                                            }
                                        },
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9C9D26D600CCEA31FEF0D818A60773C9#0894EF4577A91EDAA7D18C8ECCCE37F2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0343"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME1E"
                                    ]
                                },
                                title: "Maintain Quotation Price History"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9C9D26D600CCEA31FEF0D818A60773C9",
                                    inboundId: "0894EF4577A91EDAA7D18C8ECCCE37F2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9D01B72E651BEC7CFE514E80CA758CD5#0894EF4577A91EDAA7D12BF6BA1ED61D_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0343"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME14"
                                    ]
                                },
                                title: "Maintain Changes to Purchasing Info Records"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9D01B72E651BEC7CFE514E80CA758CD5",
                                    inboundId: "0894EF4577A91EDAA7D12BF6BA1ED61D_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9E0BF89AFF78728234263806DE5D0B49#ET091I2703I1AO4SFN0A289EW",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "CA-GTF-SB-S4H-RT",
                                title: "PO Output Automation Rate",
                                subTitle: "By Output Channel",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PURORDOUTPUTAUTOMNRATE_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PURORDOUTPUTAUTOMNRATE_CDS',Version='0001')/Annotations(TechnicalName='40F2E9AFBE791ED9AA90E498A1F04385',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9E0BF89AFF78728234263806DE5D0B49",
                                    inboundId: "ET091I2703I1AO4SEOKDWB0KM",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".E.1563363289758",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4378"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1622800108296",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"Supplier\\\",\\\"Label\\\":\\\"Supplier\\\"},{\\\"Id\\\":\\\"PurchasingGroup\\\",\\\"Label\\\":\\\"Purch. Group\\\"},{\\\"Id\\\":\\\"PurchasingOrganization\\\",\\\"Label\\\":\\\"Purchasing Org.\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET091I2703I1AO4SFN0A289EW\\\",\\\"instanceId\\\":\\\"ET091I2703I1AO4SFN0A289EW\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".E.1563363289758\\\",\\\"reportId\\\":\\\".E.1563363289758\\\",\\\"semanticObject\\\":\\\"PurchaseOrder\\\",\\\"semanticAction\\\":\\\"analyzeAutomationRate\\\",\\\"title\\\":\\\"PO Output Automation Rate\\\",\\\"subtitle\\\":\\\"By Output Channel\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1571905116859\\\",\\\"fioriId\\\":\\\"F4378\\\",\\\"applicationComponent\\\":\\\"\\\",\\\"targetmappingInstanceId\\\":\\\"ET091I2703I1AO4SEOKDWB0KM\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".E.1563363289758\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PURORDOUTPUTAUTOMNRATE_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PURORDOUTPUTAUTOMNRATEResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"40F2E9AFBE791ED9AA90E498A1F04385\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_PURORDOUTPUTAUTOMNRATE_CDS_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PURORDOUTPUTAUTOMNRATE_CDS.C_PURORDOUTPUTAUTOMNRATEResult/@com.sap.vocabularies.UI.v1.KPI#_E_1563363289758",
                                    dataPoint: "C_PURORDOUTPUTAUTOMNRATE_CDS.C_PURORDOUTPUTAUTOMNRATEResult/@com.sap.vocabularies.UI.v1.DataPoint#_E_1563363289758",
                                    selectionVariant: "C_PURORDOUTPUTAUTOMNRATE_CDS.C_PURORDOUTPUTAUTOMNRATEResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_E_1563363289758"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9E271C891F5A203E44BA68F121B4D0D1#6FMR9SFQJTA1ZPRK4R51JDHVE",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchase Order Value and Scheduling Agreement Value",
                                subTitle: "Since the beginning of last year",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/MM_PUR_PO_SPEND_ANALYSIS/",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='MM_PUR_PO_SPEND_ANALYSIS',Version='0001')/Annotations(TechnicalName='40F2E9AFBE781EE7989776C8DF57A746',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9E271C891F5A203E44BA68F121B4D0D1",
                                    inboundId: "6FMR9SFQJTA1ZPRK4D5ATOB07",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.PURCHASEORDERVALUE.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1378"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583137285132",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"6FMR9SFQJTA1ZPRK4R51JDHVE\\\",\\\"instanceId\\\":\\\"6FMR9SFQJTA1ZPRK4R51JDHVE\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.PURCHASEORDERVALUE.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.PURCHASEORDERVALUE.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseOrder\\\",\\\"semanticAction\\\":\\\"analyzeValueKPI\\\",\\\"title\\\":\\\"Purchase Order Value and Scheduling Agreement Value\\\",\\\"subtitle\\\":\\\"Since the beginning of last year\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1511438799987\\\",\\\"fioriId\\\":\\\"F1378\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"6FMR9SFQJTA1ZPRK4D5ATOB07\\\",\\\"tileType\\\":\\\"DT-CT\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.PURCHASEORDERVALUE.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/MM_PUR_PO_SPEND_ANALYSIS/\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PurOrdValueWithPlndResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"40F2E9AFBE781EE7989776C8DF57A746\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "MM_PUR_PO_SPEND_ANALYSIS.C_PurOrdValueWithPlndResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_PURCHASEORDERVALUE_EVAL",
                                    dataPoint: "MM_PUR_PO_SPEND_ANALYSIS.C_PurOrdValueWithPlndResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_PURCHASEORDERVALUE_EVAL",
                                    selectionVariant: "MM_PUR_PO_SPEND_ANALYSIS.C_PurOrdValueWithPlndResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_PURCHASEORDERVALUE_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_9EEB1037CC3FD1B5D091FA756D088B0F#6FMR9SFQJTA1Z1O5FZ7NR245H",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://sales-document"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-SQ-CON",
                                info: "Purchasing Documents",
                                title: "Redistribute Workload"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_9EEB1037CC3FD1B5D091FA756D088B0F",
                                    inboundId: "6FMR9SFQJTA1Z1O676YUJMZSE"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2504"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_A13633B39CFD45AF1B778DEE4BC2DF77#ET090PW4NWFG4KZTP8NWVM622",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Value Contract Consumption",
                                subTitle: "{{viz.ET090PW4NWFG4KZTP8NWVM622.subTitle}}",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_VALUECONTRACTCNSMPN_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_VALUECONTRACTCNSMPN_CDS',Version='0001')/Annotations(TechnicalName='6EAE8B4B94A71EE68A954A7FBB943E21',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_A13633B39CFD45AF1B778DEE4BC2DF77",
                                    inboundId: "ET090PW4NWFHYOCD4K1BQAARI",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.VALUECONTRACTCNSMPN.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2013"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583159124148",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET090PW4NWFG4KZTP8NWVM622\\\",\\\"instanceId\\\":\\\"ET090PW4NWFG4KZTP8NWVM622\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.VALUECONTRACTCNSMPN.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.VALUECONTRACTCNSMPN.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseContract\\\",\\\"semanticAction\\\":\\\"analyzeValueContractCnsmpn\\\",\\\"title\\\":\\\"Value Contract Consumption\\\",\\\"subtitle\\\":\\\"\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1478758185133\\\",\\\"fioriId\\\":\\\"F2013\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYOCD4K1BQAARI\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"PurchaseContract\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.VALUECONTRACTCNSMPN.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_VALUECONTRACTCNSMPN_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_VALUECONTRACTCNSMPNResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"6EAE8B4B94A71EE68A954A7FBB943E21\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_VALUECONTRACTCNSMPN_CDS.C_VALUECONTRACTCNSMPNResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_VALUECONTRACTCNSMPN_EVAL",
                                    dataPoint: "C_VALUECONTRACTCNSMPN_CDS.C_VALUECONTRACTCNSMPNResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_VALUECONTRACTCNSMPN_EVAL",
                                    selectionVariant: "C_VALUECONTRACTCNSMPN_CDS.C_VALUECONTRACTCNSMPNResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_VALUECONTRACTCNSMPN_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_A16043D0C43B4D36E4592F8E2575A36A#42010AEE2A311EECBCC49FF57353506F",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://instance"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "CA-VCM-MON",
                                tags: {
                                    keywords: [
                                        "Jobs Scheduling Automation"
                                    ]
                                },
                                title: "Schedule Resolution of Value Chain Issues"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_A16043D0C43B4D36E4592F8E2575A36A",
                                    inboundId: "42010AEE2A311EECBCC49FF57353306F_TM",
                                    parameters: {
                                        JobCatalogEntryName: {
                                            value: {
                                                value: "SAP_CA_VCM_RESOLVE",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F6868"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_A172E088BB3003B6620BCB44E49DAAB6#00O2TPKTQCDUX5BIE8AYZFEMU",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Overdue Purchase Order Items",
                                subTitle: "Number and Value",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_OVERDUEPO_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_OVERDUEPO_CDS',Version='0001')/Annotations(TechnicalName='FA163EAA1C9C1ED68A9477DB4BE4FB36',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_A172E088BB3003B6620BCB44E49DAAB6",
                                    inboundId: "ET090PW4NWFHYOCDX5AZI4AGI",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.OVERDUEPO",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0343"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583136190782",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQCDUX5BIE8AYZFEMU\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX5BIE8AYZFEMU\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.OVERDUEPO\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.OVERDUEPO\\\",\\\"semanticObject\\\":\\\"PurchaseOrderItem\\\",\\\"semanticAction\\\":\\\"analyzeOverduePurOrdItems\\\",\\\"title\\\":\\\"Overdue Purchase Order Items\\\",\\\"subtitle\\\":\\\"Number and Value\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1478759170546\\\",\\\"fioriId\\\":\\\"F0343\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYOCDX5AZI4AGI\\\",\\\"tileType\\\":\\\"DT-CM\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"COLUMN_NAMES\\\":[{\\\"COLUMN_NAME\\\":\\\"NumberOfOpenItems\\\",\\\"semanticColor\\\":\\\"Good\\\"},{\\\"COLUMN_NAME\\\":\\\"OpenPurchaseOrderNetAmount\\\",\\\"semanticColor\\\":\\\"Good\\\"},{\\\"COLUMN_NAME\\\":\\\"_none^\\\",\\\"semanticColor\\\":\\\"Good\\\"}]}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.OVERDUEPO\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_OVERDUEPO_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_OverduePOResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"FA163EAA1C9C1ED68A9477DB4BE4FB36\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_OVERDUEPO_CDS.C_OverduePOResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_OVERDUEPO",
                                    dataPoint: "C_OVERDUEPO_CDS.C_OverduePOResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_OVERDUEPO",
                                    selectionVariant: "C_OVERDUEPO_CDS.C_OverduePOResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_OVERDUEPO"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_A1823F19F72C9B81F520419016203532#ET090PW4NWFHYY86CPF6ZC2HT",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://instance"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-GF-MAS",
                                title: "Monitor Mass Changes",
                                subTitle: "Purchase Orders"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_A1823F19F72C9B81F520419016203532",
                                    inboundId: "6FMR9SFQJTA0CJRGFHMFB45Q0"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3332"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_A23B8794C43AD1EB242883E11D593FE8#6FMR9SFQJTA0DANFPS0FWZ03B",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0021"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-PO",
                                title: "My Purchasing Document Items",
                                subTitle: "Professional"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_A23B8794C43AD1EB242883E11D593FE8",
                                    inboundId: "6FMR9SFQJTA0DANL7RF9V48YU"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0547B"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_A3FB3A85B9BA9D34ED9CE92EE92B2DE1#FA163EDF73161ED59DE8784EC3A8A0D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0859"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME11"
                                    ]
                                },
                                title: "Create Purchasing Info Record"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_A3FB3A85B9BA9D34ED9CE92EE92B2DE1",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A8A0D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_A5D2CEA78EA58EE91E3EE64A2B04C3CF#00O2TPKTQNBL2OZRRCYN56I7Y",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://decision"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-SQ-CON",
                                title: "Manage Purchase Contracts"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_A5D2CEA78EA58EE91E3EE64A2B04C3CF",
                                    inboundId: "00O2TPKTQCDUX5R6AH0BV7NVZ"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1600A"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_A6411CDA9EE081789F999C06CEB44C64#6FMR9SFQJTA08Q6YBGIPELNOW",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://instance"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-OA-SCH",
                                tags: {
                                    keywords: [
                                        "Jobs Scheduling Automation"
                                    ]
                                },
                                title: "Monitor Mass Changes",
                                subTitle: "Purchase Scheduling Agreements"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_A6411CDA9EE081789F999C06CEB44C64",
                                    inboundId: "ET091VRSCA1TJRNXGTQZZD0Q4",
                                    parameters: {
                                        JobCatalogEntryName: {
                                            value: {
                                                value: "SAP_MM_PUR_MASSSABG_J",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4392"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_A7E0FC6600E457945256F35929BAC1C5#42010AEE2A311EECA9A4EA818BA825F7",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://calendar"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                info: "Requiring Attention",
                                title: "Due Settlement Dates",
                                subTitle: "Supplier Contracts",
                                dataSources: {
                                    "viz.42010AEE2A311EECA9A4EA818BA825F7.indicator": {
                                        uri: "/sap/opu/odata4/sap/ui_lo_setman_cc_setdates/srvd/sap/ui_lo_setman_cc_setdates/0001",
                                        type: "OData",
                                        settings: {
                                            odataVersion: "4.0"
                                        }
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_A7E0FC6600E457945256F35929BAC1C5",
                                    inboundId: "42010AEE2A311EECA9A4EA818BA7E5F7_TM",
                                    parameters: {
                                        CndnContrSettlmtStatus: {
                                            value: {
                                                value: [
                                                    "6",
                                                    "5",
                                                    "4",
                                                    "3"
                                                ],
                                                format: "array"
                                            }
                                        },
                                        CndnContrProcessCategory: {
                                            value: {
                                                value: "1",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "DspSettlmtDates/$count?$filter=((CndnContrSettlmtStatus eq '3') or (CndnContrSettlmtStatus eq '4') or (CndnContrSettlmtStatus eq '5') or (CndnContrSettlmtStatus eq '6')) and (CndnContrProcessCategory eq '1')",
                                    refresh: 300,
                                    dataSource: "viz.42010AEE2A311EECA9A4EA818BA825F7.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4964"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_AB5741A4374866F70D1AFA82790C3656#6FMR9SFQJTA1YZ49AX9E68PLC",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-OA-SCH",
                                title: "Mass Changes to Purchase Scheduling Agreements"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_AB5741A4374866F70D1AFA82790C3656",
                                    inboundId: "6FMR9SFQJTA1YZ49E24JRL1I6"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2668"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_ABDCAE7E6082124AF4F6D33EB3F8893E#FA163EDF73161ED59DE8784EC3AAE0D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0343"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME9F"
                                    ]
                                },
                                title: "Print Purchase Orders"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_ABDCAE7E6082124AF4F6D33EB3F8893E",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AAE0D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_ABEF589D149FAAE89452CE7A255E194D#42010AEF4C961EED87F0F84587648FAE_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-MD-BP-VM",
                                tags: {
                                    keywords: [
                                        "MK05"
                                    ]
                                },
                                title: "Block Vendor (Purchasing)"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_ABEF589D149FAAE89452CE7A255E194D",
                                    inboundId: "42010AEF4C961EED87F0F84587648FAE_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_B016D1D3C9B67AEDD724B08F14FB095E#ET090PW4NWFHYMQ56IWTBRKA3",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0006"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-RFQ",
                                info: "Overdue",
                                title: "Monitor RFQ Items",
                                dataSources: {
                                    "viz.ET090PW4NWFHYMQ56IWTBRKA3.indicator": {
                                        uri: "/sap/opu/odata/SAP/MM_PUR_RFQITEM_MNTR_SRV",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_B016D1D3C9B67AEDD724B08F14FB095E",
                                    inboundId: "ET090PW4NWFHYMQ5KIY9H9VX0"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "C_RequestForQuotationItemMntr(P_DisplayCurrency=%27EUR%27)/Results/$count?$filter=(IsCriticallyOverdue%20ne%20%272%27)",
                                    refresh: 60,
                                    dataSource: "viz.ET090PW4NWFHYMQ56IWTBRKA3.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2425"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_B1B369C21989B08F8BEC10364DDF6573#ET090PW4NWFG4LH3ZABXT14GN",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchase Requisition Item Changes",
                                subTitle: "Total Number of Item Changes",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_REQUISITIONCHANGE_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_REQUISITIONCHANGE_CDS',Version='0001')/Annotations(TechnicalName='005056AC4BF11ED68A941811903BAF20',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_B1B369C21989B08F8BEC10364DDF6573",
                                    inboundId: "ET090PW4NWFHYOCDGIGABQTLU",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.PURCHASEREQUISITIONCHANGES",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2015"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1550740436810",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET090PW4NWFG4LH3ZABXT14GN\\\",\\\"instanceId\\\":\\\"ET090PW4NWFG4LH3ZABXT14GN\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.PURCHASEREQUISITIONCHANGES\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.PURCHASEREQUISITIONCHANGES\\\",\\\"semanticObject\\\":\\\"PurchaseRequisitionItem\\\",\\\"semanticAction\\\":\\\"analyzeItemChanges\\\",\\\"title\\\":\\\"Purchase Requisition Item Changes\\\",\\\"subtitle\\\":\\\"Total Number of Item Changes\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1478758593267\\\",\\\"fioriId\\\":\\\"F2015\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYOCDGIGABQTLU\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"CalendarMonth\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.PURCHASEREQUISITIONCHANGES\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_REQUISITIONCHANGE_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_RequisitionChangeResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"005056AC4BF11ED68A941811903BAF20\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"sadlAnnotationModelName\\\":\\\"\\\",\\\"sadlAnnotationModelVersion\\\":\\\"\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_REQUISITIONCHANGE_CDS.C_RequisitionChangeResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_PURCHASEREQUISITIONCHANGES",
                                    dataPoint: "C_REQUISITIONCHANGE_CDS.C_RequisitionChangeResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_PURCHASEREQUISITIONCHANGES",
                                    selectionVariant: "C_REQUISITIONCHANGE_CDS.C_RequisitionChangeResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_PURCHASEREQUISITIONCHANGES"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_B235A5D934AEA2389FEE141E0A0CF258#ET090PW4NWFHUYLFINDX72P13",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0859"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-SQ",
                                tags: {
                                    keywords: [
                                        "source of supply"
                                    ]
                                },
                                title: "Manage Sources Of Supply"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_B235A5D934AEA2389FEE141E0A0CF258",
                                    inboundId: "ET090PW4NWFHUYNNZ5KB66Y9M"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0840A"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_B5B4167C650D8BD3BA3B6CC0C178903B#42010AEE28151EEB8FDB32529C49791C",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://product"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-MPS",
                                title: "Manage Model Product Specifications"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_B5B4167C650D8BD3BA3B6CC0C178903B",
                                    inboundId: "42010AEE28151EEB8FDB19DEC660191A_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F5079"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_B88C2E069DF76E8CA5C28D9508419665#ET090PW4NWFHYIXAVX1KDGHF0",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori9/F1354"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-EVL",
                                title: "Translate Questionnaire Names",
                                subTitle: "Evaluation"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_B88C2E069DF76E8CA5C28D9508419665",
                                    inboundId: "ET090PW4NWFHYIXAKI4UDE8R9",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "UI5",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2199"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_B92199DD94F791A1422D4081C8586732#ET090PW4NWFG7Z1Y030TNGILF",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0842-1"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-SQ-SCH",
                                info: "Expiring",
                                title: "Manage Purchase Scheduling Agreements",
                                dataSources: {
                                    "viz.ET090PW4NWFG7Z1Y030TNGILF.indicator": {
                                        uri: "/sap/opu/odata/SAP/MM_PUR_SCHEDG_AGRMT_SRV",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_B92199DD94F791A1422D4081C8586732",
                                    inboundId: "ET090PW4NWFG7Z1YAHCX0W6KM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "C_Schedgagrmthdr/$count?$filter=(ValidityEndDate ge datetime'9999-12-30T00:00:00')",
                                    refresh: 60,
                                    dataSource: "viz.ET090PW4NWFG7Z1Y030TNGILF.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2179"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_BD0EA52733BD59AB325478A3271F7789#756101D8DBC54FE2893EF29D71E543E2",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Product Carbon Footprint",
                                subTitle: "By Requested Products",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PFMCARBONFPRNTANLYTSQRY_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PFMCARBONFPRNTANLYTSQRY_CDS',Version='0001')/Annotations(TechnicalName='506B4BC345C41EDBB6B1C92D19F8B410',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_BD0EA52733BD59AB325478A3271F7789",
                                    inboundId: "3WO90XU5C600YPL7R2HH44RNA",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.PRODUCTCARBONFOOTPRINT.KPI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F6046"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1628835652535",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"756101D8DBC54FE2893EF29D71E543E2\\\",\\\"instanceId\\\":\\\"756101D8DBC54FE2893EF29D71E543E2\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.PRODUCTCARBONFOOTPRINT.KPI\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.PRODUCTCARBONFOOTPRINT.KPI\\\",\\\"semanticObject\\\":\\\"Material\\\",\\\"semanticAction\\\":\\\"analyzeFootprints\\\",\\\"title\\\":\\\"Product Carbon Footprint\\\",\\\"subtitle\\\":\\\"By Requested Products\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1628511522885\\\",\\\"fioriId\\\":\\\"F6046\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU5C600YPL7R2HH44RNA\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Product\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.PRODUCTCARBONFOOTPRINT.KPI\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PFMCARBONFPRNTANLYTSQRY_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PFMCARBONFPRNTANLYTSQRYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"506B4BC345C41EDBB6B1C92D19F8B410\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PFMCARBONFPRNTANLYTSQRY_CDS.C_PFMCARBONFPRNTANLYTSQRYResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_PRODUCTCARBONFOOTPRINT_KPI",
                                    dataPoint: "C_PFMCARBONFPRNTANLYTSQRY_CDS.C_PFMCARBONFPRNTANLYTSQRYResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_PRODUCTCARBONFOOTPRINT_KPI",
                                    selectionVariant: "C_PFMCARBONFPRNTANLYTSQRY_CDS.C_PFMCARBONFPRNTANLYTSQRYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_PRODUCTCARBONFOOTPRINT_KPI"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_BD7EE8D7C76010C80B4E993CE79B2CE8#ET090M0NO76W9BQPN7V0EG0LA",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0366"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-SQ-QTA",
                                title: "Manage Quota Arrangements"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_BD7EE8D7C76010C80B4E993CE79B2CE8",
                                    inboundId: "ET090M0NO76W9BQPHSFLSSZXM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1877"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_BF2430961CFC3165D9EC2970B2F1D72D#506B4BC345D81EDC82ADB3D74544EA4E_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-SRV",
                                tags: {
                                    keywords: [
                                        "MLRP"
                                    ]
                                },
                                title: "Update Invoicing Plans",
                                subTitle: "Purchase Order"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_BF2430961CFC3165D9EC2970B2F1D72D",
                                    inboundId: "506B4BC345D81EDC82ADB3D74544EA4E_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_BF7EC15058A991640B72BC489DF0F4F3#ET090M0NO76Y0DYIGV3D7M41T",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-REQ",
                                title: "Mass Changes to Purchase Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_BF7EC15058A991640B72BC489DF0F4F3",
                                    inboundId: "ET090M0NO76Y0DYIR9I5WGMDN"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2594"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_C0C99A2D50EDB56FA0AFC19DD46C725A#00O2TPKTQCDUX5BIBBPKQW6H7",
                    type: "ssuite.smartbusiness.tiles.deviation",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Invoice Price Variance",
                                subTitle: "Since the beginning of last year",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PURGMATLPRICECHANGE_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PURGMATLPRICECHANGE_CDS',Version='0001')/Annotations(TechnicalName='FA163EC90EE61EE68AAF633DDEFD07D7',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_C0C99A2D50EDB56FA0AFC19DD46C725A",
                                    inboundId: "ET090M0NO76Y069EF1A6JTSUF",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.INVOICEPRICEVARIANCE",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0682"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583157540450",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQCDUX5BIBBPKQW6H7\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX5BIBBPKQW6H7\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.INVOICEPRICEVARIANCE\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.INVOICEPRICEVARIANCE\\\",\\\"semanticObject\\\":\\\"PurchaseOrder\\\",\\\"semanticAction\\\":\\\"analyzePriceHistory\\\",\\\"title\\\":\\\"Invoice Price Variance\\\",\\\"subtitle\\\":\\\"Since the beginning of last year\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1479805490777\\\",\\\"fioriId\\\":\\\"F0682\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090M0NO76Y069EF1A6JTSUF\\\",\\\"tileType\\\":\\\"AT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.INVOICEPRICEVARIANCE\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PURGMATLPRICECHANGE_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PURGMATLPRICECHANGEResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"FA163EC90EE61EE68AAF633DDEFD07D7\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PURGMATLPRICECHANGE_CDS.C_PURGMATLPRICECHANGEResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_INVOICEPRICEVARIANCE",
                                    dataPoint: "C_PURGMATLPRICECHANGE_CDS.C_PURGMATLPRICECHANGEResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_INVOICEPRICEVARIANCE",
                                    selectionVariant: "C_PURGMATLPRICECHANGE_CDS.C_PURGMATLPRICECHANGEResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_INVOICEPRICEVARIANCE"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_C13AFAC4F2AC4DB04B704B69C1FF2235#6FMR9SFQJTA0CLWZVI9G1DWTN",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-RFQ",
                                info: "Deprecated",
                                title: "Monitor Materials Without Purchase Contract"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_C13AFAC4F2AC4DB04B704B69C1FF2235",
                                    inboundId: "6FMR9SFQJTA22VS7EBJDXGAHM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3356"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_C13D2E1D95543176D8BE0E995B4B40BD#6FMR9SFQJTA1ZB1W7NTYSP1BZ",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0381"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-PO",
                                title: "Purchasing Documents by Requirement Tracking Number"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_C13D2E1D95543176D8BE0E995B4B40BD",
                                    inboundId: "6FMR9SFQJTA1ZA4UNTTS4DLPT"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2905"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_C1C02834316E29AC5522D05F33432E31#42010AEE2A311EECA9A4FBA3352705F8",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-contract"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                info: "Active Contracts",
                                title: "Manage Condition Contracts",
                                subTitle: "Supplier Rebates",
                                dataSources: {
                                    "viz.42010AEE2A311EECA9A4FBA3352705F8.indicator": {
                                        uri: "/sap/opu/odata4/sap/ui_lo_setman_cc_supr_man/srvd/sap/ui_lo_setman_cc_supr_man/0001",
                                        type: "OData",
                                        settings: {
                                            odataVersion: "4.0"
                                        }
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_C1C02834316E29AC5522D05F33432E31",
                                    inboundId: "42010AEE2A311EECA9A4FBA33526E5F8_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "ConditionContract/$count?$filter=(CndnContrActvtnStatus eq '')",
                                    refresh: 300,
                                    dataSource: "viz.42010AEE2A311EECA9A4FBA3352705F8.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F6740"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_C2B08CBC8687BE567A7B327A933DF21D#ET090PW4NWFHYY86GUNB3LM9B",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://instance"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-REQ",
                                tags: {
                                    keywords: [
                                        "Jobs Scheduling Automation"
                                    ]
                                },
                                title: "Monitor Mass Changes",
                                subTitle: "Purchase Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_C2B08CBC8687BE567A7B327A933DF21D",
                                    inboundId: "ET091VRSCA1TJRNXFEN0NWJXM",
                                    parameters: {
                                        JobCatalogEntryName: {
                                            value: {
                                                value: "SAP_MM_PUR_MASSPRBG_J",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4391"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_C3DD0EB41FFDC7C69CE2A05A260B02FA#FA163EDF73161ED59DE8784EC3A980D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0744"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME31K"
                                    ]
                                },
                                title: "Create Purchase Contract"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_C3DD0EB41FFDC7C69CE2A05A260B02FA",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A980D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_C709AB457FA0CD5535F86E1551F82E34#6FMR9SFQJTA08Q6Y4EQN69ZA7",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://instance"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-VM-REC",
                                tags: {
                                    keywords: [
                                        "Jobs Scheduling Automation"
                                    ]
                                },
                                title: "Monitor Mass Changes",
                                subTitle: "Purchasing Info Records"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_C709AB457FA0CD5535F86E1551F82E34",
                                    inboundId: "ET091VRSCA1TJRNXFWBFSYAY2",
                                    parameters: {
                                        JobCatalogEntryName: {
                                            value: {
                                                value: "SAP_MM_PUR_MASSPICBG_J",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4394"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_C7DE987B82A04E2A376B2D09D02470F4#FA163EDF73161ED59DE8784EC3AA80D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori6/F0866"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME5A"
                                    ]
                                },
                                title: "Display Purchase Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_C7DE987B82A04E2A376B2D09D02470F4",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AA80D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_C897DD810EFB0AEC172E4EF7C8A60858#ET090M0NO76W9M7LI2U2A1135",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0551"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-EVL",
                                title: " Manage Evaluation Templates",
                                subTitle: "Evaluation"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_C897DD810EFB0AEC172E4EF7C8A60858",
                                    inboundId: "ET090M0NO76W9M7M8KX7TWOR0",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "UI5",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2193"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_CB05DA7AADB8D0F9E8855E5EE264D2AC#0894EF4577A91EEAA8B4A38107E53096_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME06"
                                    ]
                                },
                                title: "Analyze Source List"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_CB05DA7AADB8D0F9E8855E5EE264D2AC",
                                    inboundId: "0894EF4577A91EEAA8B4A38107E53096_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_CC3F7CC32A0BC61EF63D0C5489A454F5#FA163EDF73161ED690D4DCC1DEAB2A98_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME1L"
                                    ]
                                },
                                title: "Display Purchasing Info Record by Supplier"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_CC3F7CC32A0BC61EF63D0C5489A454F5",
                                    inboundId: "FA163EDF73161ED690D4DCC1DEAB2A98_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_CC46E8F19091044E3D2608DB33326C3A#FA163EDF73161ED690D4DCC1DEAC0A98_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "MEK1"
                                    ]
                                },
                                title: "Create Price Conditions",
                                subTitle: "Purchasing"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_CC46E8F19091044E3D2608DB33326C3A",
                                    inboundId: "FA163EDF73161ED690D4DCC1DEAC0A98_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_CD68F3CC33B02284A6E7377F4C38B6DD#00O2TOBXDLX6WBPTUQZNWOZ6R",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://instance"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR",
                                tags: {
                                    keywords: [
                                        "jobs, scheduling, automation"
                                    ]
                                },
                                title: "Schedule Purchasing Jobs",
                                subTitle: "Advanced"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_CD68F3CC33B02284A6E7377F4C38B6DD",
                                    inboundId: "ET091VRSCA1TJRNXL2CAWP6CF",
                                    parameters: {
                                        JobCatalogEntryName: {
                                            value: {
                                                value: "SAP_MM_PUR_ME59N_J,SAP_MM_PUR_ME84_J,SAP_MM_PUR_SES_MAINT_CATS_J,SAP_MM_PUR_ME85_J",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1702"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_CEE0247C872C30572657840EA881EFF4#6FMR9SFQJTA0DHJC57EGI0FV0",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0003"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Supplier Evaluation Score History"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_CEE0247C872C30572657840EA881EFF4",
                                    inboundId: "6FMR9SFQJTA23P6OH3VSEBWTT"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3811"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_CF204993ED81164BBA83246295DDB08B#ET090PW4NWFG4KZTRKHWN9QUS",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Quantity Contract Consumption",
                                subTitle: "Release Amount/Target Amount",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_QUANTITYCONTRACTCNSMPN_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_QUANTITYCONTRACTCNSMPN_CDS',Version='0001')/Annotations(TechnicalName='6EAE8B4B94A71EE68A95444C91ED5E1F',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_CF204993ED81164BBA83246295DDB08B",
                                    inboundId: "ET090PW4NWFHYOCDCNF14LCMJ",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.QUANTITYCONTRACTCNSMPN.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2012"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583158957149",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET090PW4NWFG4KZTRKHWN9QUS\\\",\\\"instanceId\\\":\\\"ET090PW4NWFG4KZTRKHWN9QUS\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.QUANTITYCONTRACTCNSMPN.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.QUANTITYCONTRACTCNSMPN.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseContract\\\",\\\"semanticAction\\\":\\\"analyzeQuantityContractCnsmpn\\\",\\\"title\\\":\\\"Quantity Contract Consumption\\\",\\\"subtitle\\\":\\\"Release Amount/Target Amount\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1478758465262\\\",\\\"fioriId\\\":\\\"F2012\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYOCDCNF14LCMJ\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"FormattedPurchaseContractItem\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.QUANTITYCONTRACTCNSMPN.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_QUANTITYCONTRACTCNSMPN_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_QUANTITYCONTRACTCNSMPNResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"6EAE8B4B94A71EE68A95444C91ED5E1F\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_QUANTITYCONTRACTCNSMPN_CDS_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_QUANTITYCONTRACTCNSMPN_CDS.C_QUANTITYCONTRACTCNSMPNResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_QUANTITYCONTRACTCNSMPN_EVAL",
                                    dataPoint: "C_QUANTITYCONTRACTCNSMPN_CDS.C_QUANTITYCONTRACTCNSMPNResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_QUANTITYCONTRACTCNSMPN_EVAL",
                                    selectionVariant: "C_QUANTITYCONTRACTCNSMPN_CDS.C_QUANTITYCONTRACTCNSMPNResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_QUANTITYCONTRACTCNSMPN_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_CF30CE455976F3C344B49BDFB90D3842#FA163EDF73161ED59DE8784EC3A920D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://table-view"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME2L"
                                    ]
                                },
                                title: "Display Purchasing Documents by Supplier"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_CF30CE455976F3C344B49BDFB90D3842",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A920D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_CF6DE5D02D57D6E893745489778DCE85#0894EF4577A91EEAADBE4CDACE4F70ED_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0343"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME12"
                                    ]
                                },
                                title: "Change Purchasing Info Record"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_CF6DE5D02D57D6E893745489778DCE85",
                                    inboundId: "0894EF4577A91EEAADBE4CDACE4F70ED_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_CFEF88F47D573B51ECCC09809CD22749#FA163EDF73161ED59DE8784EC3A7E0D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori9/F1354"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-QUA",
                                tags: {
                                    keywords: [
                                        "/SRMSMC/WDA_QLB_OVP_TRNS"
                                    ]
                                },
                                title: "Translate Questions",
                                subTitle: "Evaluation"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_CFEF88F47D573B51ECCC09809CD22749",
                                    inboundId: "FA163EDF73161ED59DE8784EC3A7E0D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_D02DBEDD8C89830A8A811EBF8C1384E8#FA163EDF73161ED59DE8784EC3AA40D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0002"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME57"
                                    ]
                                },
                                title: "Assign and Process Purchase Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_D02DBEDD8C89830A8A811EBF8C1384E8",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AA40D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_D6C6E6EF5E89012BE7405627F698494F#ET091I2703HZJW9UJSZPDWTZX",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori4/F0594"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-AB",
                                tags: {
                                    keywords: [
                                        "Purchasing Rebate"
                                    ]
                                },
                                title: "Monitor Settlement Documents"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_D6C6E6EF5E89012BE7405627F698494F",
                                    inboundId: "ET091VRSCA1TJS3RDDB18XE03",
                                    parameters: {
                                        CndnContrProcessCategory: {
                                            value: {
                                                value: "1",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F4165"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_D845BC589DE21B09DFF464DD9EC82F7E#6FMR9SFQJTA1Z27KYPAMMUIAV",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://compare-2"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-RFQ",
                                title: "Compare Supplier Quotations"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_D845BC589DE21B09DFF464DD9EC82F7E",
                                    inboundId: "6FMR9SFQJTA1Z27KPUS3WKUZC"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2324"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_DAC760214C2DA407ABE85025308393E5#ET090PW4NWFG4MKDPC7BM6JNG",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchase Requisition  Average Approval Time",
                                subTitle: "Release Strategy",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_REQNAVGAPPROVALTIME_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_REQNAVGAPPROVALTIME_CDS',Version='0001')/Annotations(TechnicalName='005056AC4BF11ED68A942A2388280F6F',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_DAC760214C2DA407ABE85025308393E5",
                                    inboundId: "ET090PW4NWFHYOCDJFAFAIAGV",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.REQUISITIONSAVGAPPROVALTIME",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2014"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583158523464",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET090PW4NWFG4MKDPC7BM6JNG\\\",\\\"instanceId\\\":\\\"ET090PW4NWFG4MKDPC7BM6JNG\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.REQUISITIONSAVGAPPROVALTIME\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.REQUISITIONSAVGAPPROVALTIME\\\",\\\"semanticObject\\\":\\\"PurchaseRequisitionItem\\\",\\\"semanticAction\\\":\\\"analyzeAverageApprovalTime\\\",\\\"title\\\":\\\"Purchase Requisition  Average Approval Time\\\",\\\"subtitle\\\":\\\"Release Strategy\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1478758694969\\\",\\\"fioriId\\\":\\\"F2014\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYOCDJFAFAIAGV\\\",\\\"tileType\\\":\\\"DT-CM\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"COLUMN_NAMES\\\":[{\\\"COLUMN_NAME\\\":\\\"ApprovalDaysForMediumCostItems\\\",\\\"semanticColor\\\":\\\"Neutral\\\"},{\\\"COLUMN_NAME\\\":\\\"ApprovalDaysForHighCostItems\\\",\\\"semanticColor\\\":\\\"Neutral\\\"},{\\\"COLUMN_NAME\\\":\\\"ApprvlDaysForVeryHighCostItems\\\",\\\"semanticColor\\\":\\\"Neutral\\\"}]}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.REQUISITIONSAVGAPPROVALTIME\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_REQNAVGAPPROVALTIME_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_ReqnAvgApprovalTimeResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"005056AC4BF11ED68A942A2388280F6F\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_REQNAVGAPPROVALTIME_CDS.C_ReqnAvgApprovalTimeResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_REQUISITIONSAVGAPPROVALTIME",
                                    dataPoint: "C_REQNAVGAPPROVALTIME_CDS.C_ReqnAvgApprovalTimeResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_REQUISITIONSAVGAPPROVALTIME",
                                    selectionVariant: "C_REQNAVGAPPROVALTIME_CDS.C_ReqnAvgApprovalTimeResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_REQUISITIONSAVGAPPROVALTIME"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_DBFE3347449878629073B617C2F41DF8#6FMR9SFQJTA26VAJOT36FVX0V",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                title: "Purchase Requisition Average Approval Time",
                                subTitle: "Flexible Workflow",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_WRKFLWREQNAVGAPPRVLTIME_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_WRKFLWREQNAVGAPPRVLTIME_CDS',Version='0001')/Annotations(TechnicalName='0894EF4577A91EE98AEFA1FEAEFC3192',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_DBFE3347449878629073B617C2F41DF8",
                                    inboundId: "6FMR9SFQJTA26VAJNTMPXJDGM",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.WRKFLWREQNSAVGAPPROVALTIME",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3980"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1551064390913",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"6FMR9SFQJTA26VAJOT36FVX0V\\\",\\\"instanceId\\\":\\\"6FMR9SFQJTA26VAJOT36FVX0V\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.WRKFLWREQNSAVGAPPROVALTIME\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.WRKFLWREQNSAVGAPPROVALTIME\\\",\\\"semanticObject\\\":\\\"PurchaseRequisitionItem\\\",\\\"semanticAction\\\":\\\"analyzeWorkflowAverageApprovalTime\\\",\\\"title\\\":\\\"Purchase Requisition Average Approval Time\\\",\\\"subtitle\\\":\\\"Flexible Workflow\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1549617582244\\\",\\\"fioriId\\\":\\\"F3980\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"6FMR9SFQJTA26VAJNTMPXJDGM\\\",\\\"tileType\\\":\\\"DT-CM\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"COLUMN_NAMES\\\":[{\\\"COLUMN_NAME\\\":\\\"ApprovalDaysForMediumCostItems\\\",\\\"semanticColor\\\":\\\"Neutral\\\"},{\\\"COLUMN_NAME\\\":\\\"ApprovalDaysForHighCostItems\\\",\\\"semanticColor\\\":\\\"Neutral\\\"},{\\\"COLUMN_NAME\\\":\\\"ApprvlDaysForVeryHighCostItems\\\",\\\"semanticColor\\\":\\\"Neutral\\\"}],\\\"dimension\\\":\\\"CalendarMonth\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.WRKFLWREQNSAVGAPPROVALTIME\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_WRKFLWREQNAVGAPPRVLTIME_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_WrkflwReqnAvgApprvlTimeResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"0894EF4577A91EE98AEFA1FEAEFC3192\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"sadlAnnotationModelName\\\":\\\"\\\",\\\"sadlAnnotationModelVersion\\\":\\\"\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_WRKFLWREQNAVGAPPRVLTIME_CDS.C_WrkflwReqnAvgApprvlTimeResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_WRKFLWREQNSAVGAPPROVALTIME",
                                    dataPoint: "C_WRKFLWREQNAVGAPPRVLTIME_CDS.C_WrkflwReqnAvgApprvlTimeResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_WRKFLWREQNSAVGAPPROVALTIME",
                                    selectionVariant: "C_WRKFLWREQNAVGAPPRVLTIME_CDS.C_WrkflwReqnAvgApprvlTimeResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_WRKFLWREQNSAVGAPPROVALTIME"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_DEA0C1EA203CA741434EBA1042985121#6FMR9SFQJTA0DE8P9OR12B7GH",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "CA-GTF-SB-S4H-RT",
                                title: "Purchase Order Changes",
                                subTitle: "Purchase Order Changes",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_POITEMCHANGECOUNT_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_POITEMCHANGECOUNT_CDS',Version='0001')/Annotations(TechnicalName='0894EF4577A91EE8B8CA8D009D0F5A2E',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_DEA0C1EA203CA741434EBA1042985121",
                                    inboundId: "6FMR9SFQJTA0DE8P93Q2PRNGD",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".E.1541571104021",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3791"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1542694910391",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"\\\",\\\"instanceId\\\":\\\"6FMR9SFQJTA0DE8P9OR12B7GH\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".E.1541571104021\\\",\\\"semanticObject\\\":\\\"PurchaseOrderItem\\\",\\\"semanticAction\\\":\\\"analyzeItemChanges\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1541760513242\\\",\\\"targetmappingInstanceId\\\":\\\"6FMR9SFQJTA0DE8P93Q2PRNGD\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"CalendarMonth\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".E.1541571104021\\\",\\\"INDICATOR\\\":\\\".K.1541569709926\\\",\\\"INDICATOR_TYPE\\\":\\\"KPI\\\",\\\"INDICATOR_TITLE\\\":\\\"Purchase Order Changes\\\",\\\"GOAL_TYPE\\\":\\\"MI\\\",\\\"TITLE\\\":\\\"Purchase Order Item Changes\\\",\\\"SCALING\\\":0,\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_POITEMCHANGECOUNT_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_POItemChangeCountResults\\\",\\\"VIEW_NAME\\\":\\\"C_POITEMCHANGECOUNT\\\",\\\"COLUMN_NAME\\\":\\\"TotalNoOfPOItemChanges\\\",\\\"OWNER_NAME\\\":\\\"\\\",\\\"VALUES_SOURCE\\\":\\\"FIXED\\\",\\\"ANNOTATION_MODEL\\\":\\\"0894EF4577A91EE8B8CA8D009D0F5A2E\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_POITEMCHANGECOUNT_CDS.C_POItemChangeCountResult/@com.sap.vocabularies.UI.v1.KPI#_E_1541571104021",
                                    dataPoint: "C_POITEMCHANGECOUNT_CDS.C_POItemChangeCountResult/@com.sap.vocabularies.UI.v1.DataPoint#_E_1541571104021",
                                    selectionVariant: "C_POITEMCHANGECOUNT_CDS.C_POItemChangeCountResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_E_1541571104021"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E1E0238C2886AB56785A2457ED372282#6FMR9SFQJTA098WGWU2A3S20Q",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://order-status"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-GF-SCR",
                                title: "Monitor Subcontracting Documents"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E1E0238C2886AB56785A2457ED372282",
                                    inboundId: "6FMR9SFQJTA098WH177QLGA4W",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "UI5",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3095"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E25FFEFD8EB31E11E653B5076407243D#E41FA8D6489A496AB082898A0B7B36D5",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Supplier Eval by User Defined Criteria",
                                subTitle: "Based on Average of Total Weighted Score",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/MMPUR_ANA_USRDFNDCRITRAQRY_SRV",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='MMPUR_ANA_USRDFNDCRITRAQRY_SRV',Version='0001')/Annotations(TechnicalName='0894EF4590B11EEB81DF0AAECBA1CB74',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E25FFEFD8EB31E11E653B5076407243D",
                                    inboundId: "3WO90XU7M6Y86WZGWL0MM51NY",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.SEUSRDEFCRITQRY.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3842A"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1617874226288",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"E41FA8D6489A496AB082898A0B7B36D5\\\",\\\"instanceId\\\":\\\"E41FA8D6489A496AB082898A0B7B36D5\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.SEUSRDEFCRITQRY.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.SEUSRDEFCRITQRY.EVAL\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"analyzeUserDfndScore\\\",\\\"title\\\":\\\"Supplier Eval by User Defined Criteria\\\",\\\"subtitle\\\":\\\"Based on Average of Total Weighted Score\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1617871854968\\\",\\\"fioriId\\\":\\\"F3842A\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU7M6Y86WZGWL0MM51NY\\\",\\\"tileType\\\":\\\"DT-CT\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.SEUSRDEFCRITQRY.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/MMPUR_ANA_USRDFNDCRITRAQRY_SRV\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_SUPLREVALUSRCRITRAGRPQRYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"0894EF4590B11EEB81DF0AAECBA1CB74\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_SUPLREVALUSRCRITRAGRPQRY_CDS.C_SUPLREVALUSRCRITRAGRPQRYResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_SEUSRDEFCRITQRY_EVAL",
                                    dataPoint: "C_SUPLREVALUSRCRITRAGRPQRY_CDS.C_SUPLREVALUSRCRITRAGRPQRYResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_SEUSRDEFCRITQRY_EVAL",
                                    selectionVariant: "C_SUPLREVALUSRCRITRAGRPQRY_CDS.C_SUPLREVALUSRCRITRAGRPQRYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_SEUSRDEFCRITQRY_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E3C5EFAEB6B7FD643D04E69DE7DD4073#42010AEF4CA31EED8CCB66BFE445A71C_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://activities"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-GF-OC",
                                tags: {
                                    keywords: [
                                        "ME92FF"
                                    ]
                                },
                                title: "Order Acknowledgement on Purchase Order",
                                subTitle: "Advanced"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E3C5EFAEB6B7FD643D04E69DE7DD4073",
                                    inboundId: "42010AEF4CA31EED8CCB66BFE445A71C_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E4B8EDF3E64CAD0D9C62E6DCEAF235FD#42010AEE2A311EECA9A507FBA88905F9",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://BusinessSuiteInAppSymbols/icon-contract"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                info: "Active Contracts",
                                title: "Monitor Condition Contracts",
                                subTitle: "Supplier Rebates",
                                dataSources: {
                                    "viz.42010AEE2A311EECA9A507FBA88905F9.indicator": {
                                        uri: "/sap/opu/odata4/sap/ui_lo_setman_suplrcc_man/srvd/sap/ui_lo_setman_suplrcc_man/0001",
                                        type: "OData",
                                        settings: {
                                            odataVersion: "4.0"
                                        }
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E4B8EDF3E64CAD0D9C62E6DCEAF235FD",
                                    inboundId: "42010AEE2A311EECA9A507FBA888E5F9_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "ConditionContract/$count?$filter=(CndnContrActvtnStatus eq '')",
                                    refresh: 300,
                                    dataSource: "viz.42010AEE2A311EECA9A507FBA88905F9.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F6884"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E60F27D5B073D2A72C390D7C66DA039A#ET090M0NO76XZNNYA23HV7YIA",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori9/F1354"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-CAT",
                                title: "Translate Purchasing Categories"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E60F27D5B073D2A72C390D7C66DA039A",
                                    inboundId: "ET090M0NO76W9CXMNVXIW1QGX"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2197"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E6A0BCE73837F69573D3B2F11250DDC8#ET090PW4NWFHUX6F6915KJNGD",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0674"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-HBA",
                                title: "Procurement Overview"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E6A0BCE73837F69573D3B2F11250DDC8",
                                    inboundId: "ET090PW4NWFHUX6F9CAF5O617"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1990"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E6DE331E08CC18B4D516773C6A8F8EE1#6FMR9SFQJTA093YMK62F6SZHK",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F1408"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR-VM-REC",
                                title: "Monitor Purchasing Info Record Price History"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E6DE331E08CC18B4D516773C6A8F8EE1",
                                    inboundId: "6FMR9SFQJTA093YMUADGQWZCY"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2988"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E71988710C44F50C153E4994F50AA4EC#ET090M0NO76W9M7LKY9N2HQDM",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0549"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-EVL",
                                title: "Display Scorecards",
                                subTitle: "Evaluation Questionnaires"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E71988710C44F50C153E4994F50AA4EC",
                                    inboundId: "ET090M0NO76W9M7MDFU62DA3J",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "UI5",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2191"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E75A30268CB2CB5C4FD9829B36126BF9#42010AEE28151EED81B38B43629C2269",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0002"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-REQ-SOC",
                                title: "Process Purchase Requisitions (V2)"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E75A30268CB2CB5C4FD9829B36126BF9",
                                    inboundId: "42010AEE28151EED81B3850B8696C1A4_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1048A"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_E8AE4440A478F0C4BF4D2F9384C22407#ET090PW4NWFHYOB1TTTF512V4",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchase Requisition Item Types",
                                subTitle: "Number of Items by Type",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_REQUISITIONTYPEANALYSIS_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_REQUISITIONTYPEANALYSIS_CDS',Version='0001')/Annotations(TechnicalName='005056AC4BF11ED68A940CE4A0C16EF2',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_E8AE4440A478F0C4BF4D2F9384C22407",
                                    inboundId: "ET090PW4NWFHYOB1T53443FLP",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.REQUISITIONTYPEANALYSIS.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2016"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1550736644465",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"ET090PW4NWFHYOB1TTTF512V4\\\",\\\"instanceId\\\":\\\"ET090PW4NWFHYOB1TTTF512V4\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.REQUISITIONTYPEANALYSIS.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.REQUISITIONTYPEANALYSIS.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseRequisitionItem\\\",\\\"semanticAction\\\":\\\"analyzeItemTypes\\\",\\\"title\\\":\\\"Purchase Requisition Item Types\\\",\\\"subtitle\\\":\\\"Number of Items by Type\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1478699520021\\\",\\\"fioriId\\\":\\\"F2016\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYOB1T53443FLP\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"CalendarMonth\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.REQUISITIONTYPEANALYSIS.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_REQUISITIONTYPEANALYSIS_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_RequisitionTypeAnalysisResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"005056AC4BF11ED68A940CE4A0C16EF2\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"sadlAnnotationModelName\\\":\\\"\\\",\\\"sadlAnnotationModelVersion\\\":\\\"\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_REQUISITIONTYPEANALYSIS_CDS.C_RequisitionTypeAnalysisResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_REQUISITIONTYPEANALYSIS_EVAL",
                                    dataPoint: "C_REQUISITIONTYPEANALYSIS_CDS.C_RequisitionTypeAnalysisResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_REQUISITIONTYPEANALYSIS_EVAL",
                                    selectionVariant: "C_REQUISITIONTYPEANALYSIS_CDS.C_RequisitionTypeAnalysisResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_REQUISITIONTYPEANALYSIS_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_EBCF2F8D586CCB37E307E1D4C2230FAE#FA163EDF73161EE5B8BB768998410E71_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME33L"
                                    ]
                                },
                                title: "Display Scheduling Agreement"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_EBCF2F8D586CCB37E307E1D4C2230FAE",
                                    inboundId: "FA163EDF73161EE5B8BB768998410E71_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_EDB23ED95BE3C01AABCDC6DBF86041A0#ET090M0NO76XZNNXVM5VW1BNV",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori4/F0671"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-ACT",
                                title: "Monitor Procurement-Related Tasks",
                                subTitle: "Deprecated"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_EDB23ED95BE3C01AABCDC6DBF86041A0",
                                    inboundId: "ET090M0NO76W9CXMHKTYXZSIN"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2195"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_EDCB86BAFF6A4B7994CAD71C91B4DD56#0894EF4577A91EEAA69E3BBE2FCBE0C3_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0343"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME15"
                                    ]
                                },
                                title: "Delete Purchasing Info Record"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_EDCB86BAFF6A4B7994CAD71C91B4DD56",
                                    inboundId: "0894EF4577A91EEAA69E3BBE2FCBE0C3_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_EF95CEC30EA93CE6EB934816837C2DCA#00O2TPKTQCDUX5BFYJH2K1OX4",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Off-Contract Spend",
                                subTitle: "Since the beginning of last year",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_PURGSPENDOFFCONTRACT_CDS/",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_PURGSPENDOFFCONTRACT_CDS',Version='0001')/Annotations(TechnicalName='FA163EC90EE61EE68AAE06668BA66125',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_EF95CEC30EA93CE6EB934816837C2DCA",
                                    inboundId: "ET090PW4NWFHYOCE50OACSEHB",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.OFFCONTRACTSPEND.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0572"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583145971258",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQCDUX5BFYJH2K1OX4\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX5BFYJH2K1OX4\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.OFFCONTRACTSPEND.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.OFFCONTRACTSPEND.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseOrder\\\",\\\"semanticAction\\\":\\\"analyzeOffContractSpend\\\",\\\"title\\\":\\\"Off-Contract Spend\\\",\\\"subtitle\\\":\\\"Since the beginning of last year\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1478759439757\\\",\\\"fioriId\\\":\\\"F0572\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090PW4NWFHYOCE50OACSEHB\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.OFFCONTRACTSPEND.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_PURGSPENDOFFCONTRACT_CDS/\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PURGSPENDOFFCONTRACTResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"FA163EC90EE61EE68AAE06668BA66125\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_PURGSPENDOFFCONTRACT_CDS.C_PURGSPENDOFFCONTRACTResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_OFFCONTRACTSPEND_EVAL",
                                    dataPoint: "C_PURGSPENDOFFCONTRACT_CDS.C_PURGSPENDOFFCONTRACTResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_OFFCONTRACTSPEND_EVAL",
                                    selectionVariant: "C_PURGSPENDOFFCONTRACT_CDS.C_PURGSPENDOFFCONTRACTResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_OFFCONTRACTSPEND_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_F12A907755ED8CF9E24C1518509779D4#C87BEB98821F43A2A73B7877B803C125",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Supplier Evaluation by Quality",
                                subTitle: "Inspection lot",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_SUPLREVALBYQUALITYQRY_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_SUPLREVALBYQUALITYQRY_CDS',Version='0001')/Annotations(TechnicalName='506B4BC345D41EDB86B56E4FD787A1AB',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_F12A907755ED8CF9E24C1518509779D4",
                                    inboundId: "3WO90XU7M6Y86FKB3V1BUFAM9",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".E.1603950786144",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2309A"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1615378241541",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"PurchasingGroup\\\",\\\"Label\\\":\\\"Purch. Group\\\"},{\\\"Id\\\":\\\"PurchasingOrganization\\\",\\\"Label\\\":\\\"Purchasing Org.\\\"},{\\\"Id\\\":\\\"Plant\\\",\\\"Label\\\":\\\"Plant\\\"},{\\\"Id\\\":\\\"MaterialGroup\\\",\\\"Label\\\":\\\"Material Group\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"C87BEB98821F43A2A73B7877B803C125\\\",\\\"instanceId\\\":\\\"C87BEB98821F43A2A73B7877B803C125\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".E.1603950786144\\\",\\\"reportId\\\":\\\".E.1603950786144\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"analyzeInspectionLot\\\",\\\"title\\\":\\\"Supplier Evaluation by Quality\\\",\\\"subtitle\\\":\\\"Inspection lot\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"sap.ssb.report.1603954879840\\\",\\\"fioriId\\\":\\\"F2309A\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"3WO90XU7M6Y86FKB3V1BUFAM9\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".E.1603950786144\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_SUPLREVALBYQUALITYQRY_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_SUPLREVALBYQUALITYQRYResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"506B4BC345D41EDB86B56E4FD787A1AB\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"C_SUPLREVALBYQUALITYQRY_CDS_VAN\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_SUPLREVALBYQUALITYQRY_CDS.C_SUPLREVALBYQUALITYQRYResult/@com.sap.vocabularies.UI.v1.KPI#_E_1603950786144",
                                    dataPoint: "C_SUPLREVALBYQUALITYQRY_CDS.C_SUPLREVALBYQUALITYQRYResult/@com.sap.vocabularies.UI.v1.DataPoint#_E_1603950786144",
                                    selectionVariant: "C_SUPLREVALBYQUALITYQRY_CDS.C_SUPLREVALBYQUALITYQRYResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_E_1603950786144"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_F3421A9627A0C91E1301DEF587392AEC#00O2TPKTQNBL2PL351RTXC3XP",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori4/F0629"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-EVL",
                                title: "Monitor Responses",
                                subTitle: "Evaluation"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_F3421A9627A0C91E1301DEF587392AEC",
                                    inboundId: "00O2TPKTQCDUX6AOCO7OJGDO5"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1649"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_F3EA383E08D8E792F069813167CD3D58#FA163EDF73161ED59DE8784EC3AC40D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0842-2"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME59N"
                                    ]
                                },
                                title: "Automatic Creation of Purchase Orders from Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_F3EA383E08D8E792F069813167CD3D58",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AC40D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_F479C70D10448C61EEA494CCA00F309E#FA163EDF73161ED59DE8784EC3AB00D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://decision"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME9K"
                                    ]
                                },
                                title: "Print Purchase Contracts"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_F479C70D10448C61EEA494CCA00F309E",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AB00D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_F515172D25A42DD9476B834B1116C350#ET090PW4NWFG7WVG5MHLUHZG2",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0247"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "SLC-ACT",
                                info: "Open Activities",
                                title: "Manage Procurement-Related Activities",
                                subTitle: "Deprecated",
                                dataSources: {
                                    "viz.ET090PW4NWFG7WVG5MHLUHZG2.indicator": {
                                        uri: "/sap/opu/odata/sap/C_SUPPLIERACTIVITY_FS_SRV",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_F515172D25A42DD9476B834B1116C350",
                                    inboundId: "ET090M0NO76W9CXM7L1I2TAEY"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "C_SupplierActivityFs/$count?$filter=( SuplrActyLifecycleStatus  ne '04')",
                                    refresh: 300,
                                    dataSource: "viz.ET090PW4NWFG7WVG5MHLUHZG2.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2192"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_F541859F6DB4C2DFC0C9DA6A1C59261D#00O2TPKTQCDUX68P4QWZYDIG9",
                    type: "ssuite.smartbusiness.tiles.numeric",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Non-Managed Spend",
                                subTitle: "Invoices Without Purchase Orders",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_NONMNGDPURGSPEND_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_NONMNGDPURGSPEND_CDS',Version='0001')/Annotations(TechnicalName='FA163EC90EE61EE68AF7D82C8D724615',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_F541859F6DB4C2DFC0C9DA6A1C59261D",
                                    inboundId: "ET090M0NO76Y069ECX1YWLTSV",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.NONMANAGEDSPENDEVALUATION",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0571"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583157323404",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"00O2TPKTQCDUX68P4QWZYDIG9\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX68P4QWZYDIG9\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.NONMANAGEDSPENDEVALUATION\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.NONMANAGEDSPENDEVALUATION\\\",\\\"semanticObject\\\":\\\"PurchaseOrder\\\",\\\"semanticAction\\\":\\\"analyzeNonManagedSpend\\\",\\\"title\\\":\\\"Non-Managed Spend\\\",\\\"subtitle\\\":\\\"Invoices Without Purchase Orders\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1479805417780\\\",\\\"fioriId\\\":\\\"F0571\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"ET090M0NO76Y069ECX1YWLTSV\\\",\\\"tileType\\\":\\\"NT\\\",\\\"frameType\\\":\\\"OneByOne\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.NONMANAGEDSPENDEVALUATION\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_NONMNGDPURGSPEND_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_NONMNGDPURGSPENDResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"FA163EC90EE61EE68AF7D82C8D724615\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_NONMNGDPURGSPEND_CDS.C_NONMNGDPURGSPENDResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_NONMANAGEDSPENDEVALUATION",
                                    dataPoint: "C_NONMNGDPURGSPEND_CDS.C_NONMNGDPURGSPENDResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_NONMANAGEDSPENDEVALUATION",
                                    selectionVariant: "C_NONMNGDPURGSPEND_CDS.C_NONMNGDPURGSPENDResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_NONMANAGEDSPENDEVALUATION"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_F72F45ED5258942B0C188CEC944D27AD#6FMR9SFQJTA09AOXG4L8XNS1C",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori7/F0842-1"
                                },
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                info: "Overdue",
                                title: "Monitor Purchase Scheduling Agreement Items",
                                dataSources: {
                                    "viz.6FMR9SFQJTA09AOXG4L8XNS1C.indicator": {
                                        uri: "/sap/opu/odata/sap/MM_PUR_SCHAGMT_MNTR",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_F72F45ED5258942B0C188CEC944D27AD",
                                    inboundId: "6FMR9SFQJTA1ZL36WERK5YE8Z"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "C_SchedgAgrmtItemMonitor(P_DisplayCurrency=%27EUR%27)/Results/$count?$filter=(SchedAgrmtItemIsOverdue eq 'X')",
                                    refresh: 0,
                                    dataSource: "viz.6FMR9SFQJTA09AOXG4L8XNS1C.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3143"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_F73B15FBDB84D265A56F88132733F3BD#6FMR9SFQJTA09AZ72QBUE5KCH",
                    type: "ssuite.smartbusiness.tiles.contribution",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                title: "Scheduling Agreement Consumption",
                                subTitle: "{{viz.6FMR9SFQJTA09AZ72QBUE5KCH.subTitle}}",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_SCHEDGAGRMTITMCNSMPN_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/ServiceNames(Namespace='SAP',Name='C_SCHEDGAGRMTITMCNSMPN_CDS',Version='0001')/Annotations(TechnicalName='40F2E9AFC5011ED7AC82B82D30905559',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_F73B15FBDB84D265A56F88132733F3BD",
                                    inboundId: "6FMR9SFQJTA09AZ71OP32VI9D",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.SCHEDGAGRMT.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F3192"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583159319069",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"6FMR9SFQJTA09AZ72QBUE5KCH\\\",\\\"instanceId\\\":\\\"6FMR9SFQJTA09AZ72QBUE5KCH\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.SCHEDGAGRMT.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.SCHEDGAGRMT.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseSchedulingAgreement\\\",\\\"semanticAction\\\":\\\"analyze\\\",\\\"title\\\":\\\"Scheduling Agreement Consumption\\\",\\\"subtitle\\\":\\\"\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1507899833908\\\",\\\"fioriId\\\":\\\"F3192\\\",\\\"applicationComponent\\\":\\\"MM-PUR\\\",\\\"targetmappingInstanceId\\\":\\\"6FMR9SFQJTA09AZ71OP32VI9D\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"SchedulingAgreement\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.SCHEDGAGRMT.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_SCHEDGAGRMTITMCNSMPN_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_SCHEDGAGRMTITMCNSMPNResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"40F2E9AFC5011ED7AC82B82D30905559\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_SCHEDGAGRMTITMCNSMPN_CDS.C_SCHEDGAGRMTITMCNSMPNResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_SCHEDGAGRMT_EVAL",
                                    dataPoint: "C_SCHEDGAGRMTITMCNSMPN_CDS.C_SCHEDGAGRMTITMCNSMPNResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_SCHEDGAGRMT_EVAL",
                                    selectionVariant: "C_SCHEDGAGRMTITMCNSMPN_CDS.C_SCHEDGAGRMTITMCNSMPNResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_SCHEDGAGRMT_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "uyz_200_FC623E2386FD5CF1A5A2A5ECD2B42324#0894EF4577A91EEAA8B49099BD4A902F_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME04"
                                    ]
                                },
                                title: "Maintain Changes to Source List"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "uyz_200_FC623E2386FD5CF1A5A2A5ECD2B42324",
                                    inboundId: "0894EF4577A91EEAA8B49099BD4A902F_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_05ACA04761F3076438994B367369A2AB#42F2E9AFC3DF1EE6ADC11E38D66102EB_AL",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://customer-order-entry"
                                }
                            },
                            "sap.app": {
                                ach: "EHS-SUS-HS",
                                tags: {
                                    keywords: [
                                        "EHHSS_COMPL_REQ_ENTRY_OIF"
                                    ]
                                },
                                title: "wda dynamic - Manage Compliance Requirements",
                                subTitle: "Regulations, Policies",
                                dataSources: {
                                    "viz.42F2E9AFC3DF1EE6ADC11E38D66102EB_AL.indicator": {
                                        uri: "/sap/opu/odata/sap/EHFND_FIORI_TILE_SRV",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_05ACA04761F3076438994B367369A2AB",
                                    inboundId: "42F2E9AFC3DF1EE6ADC11E38D66102EB_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "FioriTiles('ehs.hs.compl.req ')",
                                    refresh: 0,
                                    dataSource: "viz.42F2E9AFC3DF1EE6ADC11E38D66102EB_AL.indicator"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_9E271C891F5A203E44BA68F121B4D0D1#6FMR9SFQJTA1ZPRK4R51JDHVE",
                    type: "ssuite.smartbusiness.tiles.dual",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                technology: "URL"
                            },
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "Purchase Order Value and Scheduling Agreement Value",
                                subTitle: "Since the beginning of last year",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/MM_PUR_PO_SPEND_ANALYSIS/",
                                        type: "OData",
                                        settings: {
                                            maxAge: 86400,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/Annotations(TechnicalName='40F2E9AFBE781EE7989776C8DF57A746',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_9E271C891F5A203E44BA68F121B4D0D1",
                                    inboundId: "6FMR9SFQJTA1ZPRK4D5ATOB07",
                                    parameters: {
                                        EvaluationId: {
                                            value: {
                                                value: ".SAP.MM.PUR.PURCHASEORDERVALUE.EVAL",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1378"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1583137285132",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"DEFAULT_PARAMETERS\":\"[{\\\"Id\\\":\\\"DisplayCurrency\\\",\\\"Label\\\":\\\"Display Currency\\\"}]\",\"NAVIGATION_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"6FMR9SFQJTA1ZPRK4R51JDHVE\\\",\\\"instanceId\\\":\\\"6FMR9SFQJTA1ZPRK4R51JDHVE\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE:SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.PURCHASEORDERVALUE.EVAL\\\",\\\"reportId\\\":\\\".SAP.MM.PUR.PURCHASEORDERVALUE.EVAL\\\",\\\"semanticObject\\\":\\\"PurchaseOrder\\\",\\\"semanticAction\\\":\\\"analyzeValueKPI\\\",\\\"title\\\":\\\"Purchase Order Value and Scheduling Agreement Value\\\",\\\"subtitle\\\":\\\"Since the beginning of last year\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"DAY\\\",\\\"appVariantId\\\":\\\"k1511438799987\\\",\\\"fioriId\\\":\\\"F1378\\\",\\\"applicationComponent\\\":\\\"MM-FIO-PUR-ANA\\\",\\\"targetmappingInstanceId\\\":\\\"6FMR9SFQJTA1ZPRK4D5ATOB07\\\",\\\"tileType\\\":\\\"DT-CT\\\",\\\"frameType\\\":\\\"TwoByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.PURCHASEORDERVALUE.EVAL\\\",\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/MM_PUR_PO_SPEND_ANALYSIS/\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_PurOrdValueWithPlndResults\\\",\\\"ANNOTATION_MODEL\\\":\\\"40F2E9AFBE781EE7989776C8DF57A746\\\",\\\"ANNOTATION_MODEL_VERSION\\\":\\\"0001\\\",\\\"SADL_ANNOTATION_MODEL\\\":\\\"\\\",\\\"SADL_ANNOTATION_MODEL_VERSION\\\":\\\"0000\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "MM_PUR_PO_SPEND_ANALYSIS.C_PurOrdValueWithPlndResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_PURCHASEORDERVALUE_EVAL",
                                    dataPoint: "MM_PUR_PO_SPEND_ANALYSIS.C_PurOrdValueWithPlndResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_PURCHASEORDERVALUE_EVAL",
                                    selectionVariant: "MM_PUR_PO_SPEND_ANALYSIS.C_PurOrdValueWithPlndResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_PURCHASEORDERVALUE_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APP-4001CFD5E369B343CEAEB443F5A2#ET090M0NO76W9MOT2AOBMBFGC",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://customer"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR-PO",
                                info: "Pending Confirmations",
                                title: "Dynamic ui5 - Monitor Supplier Confirmations",
                                dataSources: {
                                    "viz.ET090M0NO76W9MOT2AOBMBFGC.indicator": {
                                        uri: "/sap/opu/odata/sap/MM_PUR_SUPLRCONF_MNTR_SRV",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APP-4001CFD5E369B343CEAEB443F5A2",
                                    inboundId: "ET090M0NO76W9MOT8CQ8GWF8O"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "C_PurgDocSuplrConfMain(P_DisplayCurrency=%27EUR%27)/Results/$count",
                                    refresh: 60,
                                    dataSource: "viz.ET090M0NO76W9MOT2AOBMBFGC.indicator"
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F2359"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APP-7B49C959003D4BA682DBE84ACE54#42F2E9AFC4EF1EE99CCED5F62F9E0EF6_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://drill-down"
                                }
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                tags: {
                                    keywords: [
                                        "WDA_WLF_DETSTMNTPURGRBTEQR"
                                    ]
                                },
                                title: "WDA static - Analyze Detailed Statement Purchasing Rebates"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APP-7B49C959003D4BA682DBE84ACE54",
                                    inboundId: "42F2E9AFC4EF1EE99CCED5F62F9E0EF6_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APP-8794C43AD1EB242883E11D593FE8#6FMR9SFQJTA0DANFPS0FWZ03B",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori2/F0021"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR-PO",
                                title: "UI5 Static - My Purchasing Document Items",
                                subTitle: "Professional"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APP-8794C43AD1EB242883E11D593FE8",
                                    inboundId: "6FMR9SFQJTA0DANL7RF9V48YU"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F0547B"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APP-8B02A9355CB56F187DC506A781A7#00O2TPKTQCDUX5BFVMAYMUKB2",
                    type: "viztpyes.ns.customTile",
                    descriptor: {
                        value: {
                            "sap.ui": {},
                            "sap.app": {
                                ach: "MM-FIO-PUR-ANA",
                                title: "SMB - Supplier Evaluation By Quantity",
                                subTitle: "Based on Ordered and Received Quantity",
                                dataSources: {
                                    SSB: {
                                        uri: "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV",
                                        type: "OData"
                                    },
                                    mainService: {
                                        uri: "/sap/opu/odata/sap/C_QUANTITYVARIANCE_CDS",
                                        type: "OData",
                                        settings: {
                                            maxAge: 60,
                                            annotations: [
                                                "mainServiceAnnotation"
                                            ],
                                            odataVersion: "2.0"
                                        }
                                    },
                                    mainServiceAnnotation: {
                                        uri: "/sap/opu/odata/iwfnd/catalogservice;v=2/Annotations(TechnicalName='FA163EDF73161ED68A934B7A982812CB',Version='0001')/$value",
                                        type: "ODataAnnotation"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APP-8B02A9355CB56F187DC506A781A7",
                                    inboundId: "ET090M0NO76W9UE5EG9CB9JQ4"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                models: {
                                    "": {
                                        settings: {
                                            useBatch: true,
                                            defaultCountMode: "None",
                                            bindableResponseHeaders: [
                                                "age",
                                                "cache-control"
                                            ]
                                        },
                                        dataSource: "mainService"
                                    },
                                    SSB: {
                                        type: "sap.ui.model.odata.v2.ODataModel",
                                        settings: {
                                            useBatch: false
                                        },
                                        dataSource: "SSB"
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1661"
                                ]
                            },
                            "sap.ui.smartbusiness.app": {
                                tile: {
                                    timeStamp: "1494493229479",
                                    tileConfiguration: "{\"ADDITIONAL_APP_PARAMETERS\":\"{}\",\"TILE_PROPERTIES\":\"{\\\"id\\\":\\\"\\\",\\\"instanceId\\\":\\\"00O2TPKTQCDUX5BFVMAYMUKB2\\\",\\\"catalogId\\\":\\\"X-SAP-UI2-CATALOGPAGE: SAP_TC_PRC_COMMON\\\",\\\"evaluationId\\\":\\\".SAP.MM.PUR.QUANTITYVARIANCE.EVAL\\\",\\\"semanticObject\\\":\\\"SupplierPerformance\\\",\\\"semanticAction\\\":\\\"AnalyzeQuantityScore\\\",\\\"navType\\\":\\\"0\\\",\\\"cacheMaxAge\\\":1,\\\"cacheMaxAgeUnit\\\":\\\"MIN\\\",\\\"appVariantId\\\":\\\"k1478758732485\\\",\\\"targetmappingInstanceId\\\":\\\"ET090M0NO76W9UE5EG9CB9JQ4\\\",\\\"tileType\\\":\\\"CT\\\",\\\"frameType\\\":\\\"OneByOne\\\",\\\"dimension\\\":\\\"Supplier\\\",\\\"sortOrder\\\":\\\"MD\\\",\\\"semanticColorContribution\\\":\\\"Neutral\\\"}\",\"EVALUATION\":\"{\\\"ID\\\":\\\".SAP.MM.PUR.QUANTITYVARIANCE.EVAL\\\",\\\"INDICATOR\\\":\\\".SAP.MM.PUR.QUANTITYVARIANCE\\\",\\\"INDICATOR_TYPE\\\":\\\"KPI\\\",\\\"INDICATOR_TITLE\\\":\\\"SupplierEvaluationQuantityVariance\\\",\\\"GOAL_TYPE\\\":\\\"MA\\\",\\\"TITLE\\\":\\\"BasedonOrderedandReceivedQuantity\\\",\\\"SCALING\\\":0,\\\"ODATA_URL\\\":\\\"/sap/opu/odata/sap/C_QUANTITYVARIANCE_CDS\\\",\\\"ODATA_ENTITYSET\\\":\\\"C_QuantityVarianceResults\\\",\\\"VIEW_NAME\\\":\\\"ODATA_MM_ANALYTICS: : C_QUANTITYVARIANCE\\\",\\\"COLUMN_NAME\\\":\\\"QuantityVarianceScore\\\",\\\"OWNER_NAME\\\":\\\"\\\",\\\"VALUES_SOURCE\\\":\\\"FIXED\\\",\\\"ANNOTATION_MODEL\\\":\\\"FA163EDF73161ED68A934B7A982812CB\\\"}\",\"TAGS\":\"[]\"}"
                                },
                                annotationFragments: {
                                    kpi: "C_QUANTITYVARIANCE_CDS.C_QuantityVarianceResult/@com.sap.vocabularies.UI.v1.KPI#_SAP_MM_PUR_QUANTITYVARIANCE_EVAL",
                                    dataPoint: "C_QUANTITYVARIANCE_CDS.C_QuantityVarianceResult/@com.sap.vocabularies.UI.v1.DataPoint#_SAP_MM_PUR_QUANTITYVARIANCE_EVAL",
                                    selectionVariant: "C_QUANTITYVARIANCE_CDS.C_QuantityVarianceResult/@com.sap.vocabularies.UI.v1.SelectionVariant#_SAP_MM_PUR_QUANTITYVARIANCE_EVAL"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APP-c9-4342-kalman-7fe0c4fBoris#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "",
                                title: "native Android",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APP-c9-4342-kalman-7fe0c4fBoris",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_app-dd49-42da-8b15-2871547075dc#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: ""
                                }
                            },
                            "sap.app": {
                                info: "",
                                title: "static url",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_app-dd49-42da-8b15-2871547075dc",
                                    inboundId: "__GenericDefaultSemantic-__GenericDefaultAction",
                                    parameters: {}
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APP-GUID8C89830A8A811EBF8C1384E8#FA163EDF73161ED59DE8784EC3AA40D2_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://S4Hana/S0002"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR",
                                tags: {
                                    keywords: [
                                        "ME57"
                                    ]
                                },
                                title: "SAP GUI - Assign and Process Purchase Requisitions"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APP-GUID8C89830A8A811EBF8C1384E8",
                                    inboundId: "FA163EDF73161ED59DE8784EC3AA40D2_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "GUI",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APP_SFSF_DEMO_COMP_BUDGET#VIZ_SFSF_DEMO_COMP_BUDGET",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "Compensation Budget",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APP_SFSF_DEMO_COMP_BUDGET",
                                    inboundId: "9dcdb659-dc37-4b89-96f0-4fdeed68d135"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APP_SFSF_DEMO_ORGCHART#VIZ_SFSF_DEMO_ORGCHART",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://org-chart"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "My Org Chart",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APP_SFSF_DEMO_ORGCHART",
                                    inboundId: "7988a5b6-b37f-487b-8b34-901fbb1e0481"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APP_SFSF_DEMO_PEOPLEPROFILE#VIZ_SFSF_DEMO_PEOPLEPROFILE",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://employee"
                                }
                            },
                            "sap.app": {
                                tags: {
                                    keywords: [
                                        ""
                                    ]
                                },
                                title: "My Profile",
                                subTitle: ""
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APP_SFSF_DEMO_PEOPLEPROFILE",
                                    inboundId: "c6416d5f-b814-497b-9436-4c99473b70e0"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_APPWCARD_TEST_CDM32#CARD_TEST_CDM32",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "./logo.png"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "card.explorer.bulletChart.list.card9",
                                info: "Additional information about this Card",
                                tags: {
                                    keywords: [
                                        "List",
                                        "Chart",
                                        "Card",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "Sample of a List with Bullet Chart",
                                subTitle: "Sample of a List with Bullet Chart",
                                shortTitle: "A short title for this Card",
                                description: "A long description for this Card",
                                applicationVersion: {
                                    version: "1.0.0"
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_APPWCARD_TEST_CDM32",
                                    inboundId: "FA163EDF73161ED59DEC2783E12A7309_TM"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.card": {
                                type: "List",
                                header: {
                                    icon: {
                                        src: "sap-icon://product"
                                    },
                                    title: "Actual income from products",
                                    status: {
                                        text: "5 of 20"
                                    },
                                    actions: [
                                        {
                                            type: "Navigation",
                                            parameters: {
                                                ibnTarget: {
                                                    action: "displayList",
                                                    semanticObject: "PurchasingDocumentItem"
                                                }
                                            }
                                        }
                                    ]
                                },
                                content: {
                                    data: {
                                        request: {
                                            url: "./data.json"
                                        }
                                    },
                                    item: {
                                        info: {
                                            state: "{Highlight}",
                                            value: "{= format.currency(${Actual} - ${Target}, 'EUR', {currencyCode:false})} {= ${Actual} - ${Target} >= 0 ? 'Profit' : 'Loss' }"
                                        },
                                        chart: {
                                            type: "Bullet",
                                            color: "{ChartColor}",
                                            scale: "€",
                                            value: "{Actual}",
                                            target: "{Target}",
                                            maxValue: "{Expected}",
                                            minValue: 0,
                                            displayValue: "{= format.currency(${Actual}, 'EUR', {currencyCode:false})}"
                                        },
                                        title: "{Name}",
                                        description: "{Description}"
                                    },
                                    maxItems: 5
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/card.explorer.bulletChart.list.card9/ceb3d97ecaa30569b1bf36a88b1be109",
                        descriptorPath: ""
                    }
                },
                {
                    id: "wcontent_4_demo_APPWCARD_TEST_IMAGE#IMAGE_CARD_TEST",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://technical-object"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "com.sap.myhome.imageCard2",
                                i18n: "i18n/i18n.properties",
                                info: "Image Card Sample",
                                tags: {
                                    keywords: [
                                        "Component",
                                        "Card",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "MyHome Image Card",
                                subTitle: "Just wraps an image",
                                shortTitle: "Image Card",
                                description: "A Component Card rendering an image",
                                applicationVersion: {
                                    version: "1.2.1"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                rootView: {
                                    id: "app",
                                    type: "XML",
                                    async: true,
                                    viewName: "com.sap.myhome.imageCard2.View"
                                },
                                dependencies: {
                                    libs: {
                                        "sap.m": {}
                                    },
                                    minUI5Version: "1.38"
                                }
                            },
                            _version: "1.15.0",
                            "sap.card": {
                                type: "Component",
                                header: {
                                    title: ""
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/com.sap.myhome.imageCard2/81283cc4ac3c356f2e5963ef2243a896",
                        descriptorPath: ""
                    }
                },
                {
                    id: "wcontent_4_demo_APPWCARD_TEST_MYHOME#CARD_TEST_MYHOME",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://technical-object"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "com.sap.bpm.tc.widget.cards9",
                                i18n: {
                                    bundleUrl: "i18n/i18n.properties",
                                    fallbackLocale: "en",
                                    supportedLocales: [
                                        "ar",
                                        "bg",
                                        "ca",
                                        "cs",
                                        "cy",
                                        "da",
                                        "de",
                                        "el",
                                        "en_GB",
                                        "en",
                                        "es_MX",
                                        "es",
                                        "et",
                                        "fi",
                                        "fr_CA",
                                        "fr",
                                        "he",
                                        "hi",
                                        "hr",
                                        "hu",
                                        "id",
                                        "it",
                                        "ja",
                                        "kk",
                                        "ko",
                                        "lt",
                                        "lv",
                                        "ms",
                                        "nl",
                                        "no",
                                        "pl",
                                        "pt_PT",
                                        "pt",
                                        "ro",
                                        "ru",
                                        "sh",
                                        "sk",
                                        "sl",
                                        "sv",
                                        "th",
                                        "tr",
                                        "uk",
                                        "vi",
                                        "zh_CN",
                                        "zh_TW"
                                    ]
                                },
                                info: "",
                                tags: {
                                    keywords: [
                                        "Task Center",
                                        "Tasks"
                                    ]
                                },
                                type: "card",
                                title: "Task Center Widget",
                                subTitle: "Task Center Integration widget based on a Component card",
                                shortTitle: "Task Center Widget",
                                description: "Task Center integration widget based on a Component card",
                                applicationVersion: {
                                    version: "1.1.0"
                                }
                            },
                            "sap.flp": {
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.ui5": {
                                rootView: {
                                    id: "app",
                                    type: "XML",
                                    async: true,
                                    viewName: "com.sap.bpm.tc.widget.cards.View"
                                },
                                dependencies: {
                                    libs: {
                                        "sap.m": {}
                                    },
                                    minUI5Version: "1.100"
                                }
                            },
                            "sap.card": {
                                type: "Component",
                                content: {
                                    minHeight: "calc(17.75rem + 13px)"
                                },
                                extension: "./CustomFormattersExtension",
                                configuration: {
                                    csrfTokens: {
                                        token1: {
                                            data: {
                                                request: {
                                                    url: "{context>sap.workzone/currentCompany/webHost/value}/{parameters>/taskCenterHTML5BusinessSolution/value}.{parameters>/taskCenterHTML5AppName/value}/task-center-service/v1/tasks/$count",
                                                    method: "GET",
                                                    headers: {
                                                        "X-CSRF-Token": "Fetch"
                                                    },
                                                    withCredentials: true
                                                }
                                            }
                                        }
                                    },
                                    parameters: {
                                        viewMode: {
                                            type: "string",
                                            value: "Line"
                                        },
                                        workzoneHostname: {
                                            type: "string",
                                            value: "{context>sap.workzone/currentCompany/webHost/value}"
                                        },
                                        taskCenterHTML5AppName: {
                                            type: "string",
                                            value: "comsapbpmtcinbox"
                                        },
                                        taskCenterHTML5BusinessSolution: {
                                            type: "string",
                                            value: "comsapbpminbox-service"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "/content-repository/v2/cards/com.sap.bpm.tc.widget.cards9/48c886de0f9f8490498d47c91069402f",
                        descriptorPath: ""
                    }
                },
                {
                    id: "wcontent_4_demo_bussinessapp_direct_id#42F2E9AFC3DF1EE6ADC11E38D66102EB_AL",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://customer-order-entry"
                                }
                            },
                            "sap.app": {
                                ach: "EHS-SUS-HS",
                                tags: {
                                    keywords: [
                                        "EHHSS_COMPL_REQ_ENTRY_OIF"
                                    ]
                                },
                                title: "wda dynamic - Manage Compliance Requirements",
                                subTitle: "Regulations, Policies",
                                dataSources: {
                                    "viz.42F2E9AFC3DF1EE6ADC11E38D66102EB_AL.indicator": {
                                        uri: "/sap/opu/odata/sap/EHFND_FIORI_TILE_SRV",
                                        type: "OData"
                                    }
                                }
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_bussinessapp_direct_id",
                                    inboundId: "42F2E9AFC3DF1EE6ADC11E38D66102EB_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                },
                                indicatorDataSource: {
                                    path: "FioriTiles('ehs.hs.compl.req ')",
                                    refresh: 0,
                                    dataSource: "viz.42F2E9AFC3DF1EE6ADC11E38D66102EB_AL.indicator"
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_E6A0BCE73837F69573D3B2F11250DDC6#ET090PW4NWFHUX6F6915KJNGF",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0674"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR-HBA",
                                title: "native-Android-launch App"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_E6A0BCE73837F69573D3B2F11250DDC6",
                                    inboundId: "ET090PW4NWFHUX6F9CAF5O619"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1990"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_E6A0BCE73837F69573D3B2F11250DDC7#ET090PW4NWFHUX6F6915KJNGE",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0674"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR-HBA",
                                title: "native-Android-install App"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_E6A0BCE73837F69573D3B2F11250DDC7",
                                    inboundId: "ET090PW4NWFHUX6F9CAF5O618"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1990"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_E6A0BCE73837F69573D3B2F11250DDC8#ET090PW4NWFHUX6F6915KJNGD",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0674"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR-HBA",
                                title: "native-iOS-install App"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_E6A0BCE73837F69573D3B2F11250DDC8",
                                    inboundId: "ET090PW4NWFHUX6F9CAF5O617"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1990"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_E6A0BCE73837F69573D3B2F11250DDC9#ET090PW4NWFHUX6F6915KJNGC",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://Fiori5/F0674"
                                }
                            },
                            "sap.app": {
                                ach: "MM-PUR-HBA",
                                title: "native-iOS-launch App"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_E6A0BCE73837F69573D3B2F11250DDC9",
                                    inboundId: "ET090PW4NWFHUX6F9CAF5O616"
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "F1990"
                                ]
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "wcontent_4_demo_wda04761F3076438994B367369A2AB#42F2E9AFC4EF1EE99CCED5F62F9E0EF6_AL",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://drill-down"
                                }
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                tags: {
                                    keywords: [
                                        "WDA_WLF_DETSTMNTPURGRBTEQR"
                                    ]
                                },
                                title: "WDA static - Analyze Detailed Statement Purchasing Rebates"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_wda04761F3076438994B367369A2AB",
                                    inboundId: "42F2E9AFC4EF1EE99CCED5F62F9E0EF6_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                },
                {
                    id: "error-tile",
                    type: "non.existant.viztype",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://drill-down"
                                }
                            },
                            "sap.app": {
                                ach: "LO-GT-CHB",
                                tags: {
                                    keywords: [
                                        "WDA_WLF_DETSTMNTPURGRBTEQR"
                                    ]
                                },
                                title: "WDA static - Analyze Detailed Statement Purchasing Rebates"
                            },
                            "sap.flp": {
                                target: {
                                    type: "IBN",
                                    appId: "wcontent_4_demo_wda04761F3076438994B367369A2AB",
                                    inboundId: "42F2E9AFC4EF1EE99CCED5F62F9E0EF6_TM",
                                    parameters: {
                                        "sap-ui-tech-hint": {
                                            value: {
                                                value: "WDA",
                                                format: "plain"
                                            }
                                        }
                                    }
                                },
                                vizOptions: {
                                    displayFormats: {
                                        default: "standard",
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: null
                }
            ]
        }
    };

    // Add descriptors
    function addDescriptorToVisualizationById (aNodes, sId, oDescriptorValue) {
        aNodes.forEach(function (oViz) {
            if (oViz.id === sId) {
                oViz.descriptor.value = oDescriptorValue;
            }
        });
    }

    addDescriptorToVisualizationById(data.visualizations.nodes, "provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId", DescriptorLunchTile);
    addDescriptorToVisualizationById(data.visualizations.nodes, "provider1_f95ad84a-65d0-4c39-9a67-09a4efe04f92#Default-VizId", DescriptorStaticTile);
    addDescriptorToVisualizationById(data.visualizations.nodes, "provider1_a152d792-a43e-48eb-aafd-51451a6168e9#Default-VizId", DescriptorStaticTile2);
    addDescriptorToVisualizationById(data.visualizations.nodes, "provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId", DescriptorDynamicTile);
    addDescriptorToVisualizationById(data.visualizations.nodes, "provider2_2ce8c859-b668-40d8-9c22-3a7dc018afd3#Default-VizId", DescriptorDynamicTile2);
    addDescriptorToVisualizationById(data.visualizations.nodes, "provider2_1e504721-8532-4a80-8fdd-0d88744c336f#Default-VizId", DescriptorStackedColumnCard);
    addDescriptorToVisualizationById(data.visualizations.nodes, "provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId", DescriptorTableCard);

    return {
        data: data
    };
});
