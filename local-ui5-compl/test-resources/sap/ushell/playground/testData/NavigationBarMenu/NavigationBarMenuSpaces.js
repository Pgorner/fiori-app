// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
], function () {
    "use strict";

    var menu = [
        {
            id: "SAP_BASIS_SP_UI_MYHOME",
            title: "My Home",
            "help-id": "Space-SAP_BASIS_SP_UI_MYHOME",
            description: "SAP Fiori Launchpad My Home",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    {
                        name: "spaceId",
                        value: "SAP_BASIS_SP_UI_MYHOME"
                    },
                    {
                        name: "pageId",
                        value: "SAP_BASIS_PG_UI_MYHOME"
                    }
                ]
            },
            isHomeEntry: true,
            pinned: true,
            pinnedSortOrder: "0",
            menuEntries: [],
            uid: "id-1681978473328-252"
        },
        {
            type: "separator",
            pinned: true,
            pinnedSortOrder: 1
        },
        {
            id: "ZSJW_TEST_SPACE_01",
            title: "WOLFSEB's Test Space",
            "help-id": "Space-ZSJW_TEST_SPACE_01",
            description: "WOLFSEB's Test Space",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    {
                        name: "spaceId",
                        value: "ZSJW_TEST_SPACE_01"
                    },
                    {
                        name: "pageId",
                        value: "ZSJW_TEST_PAGE"
                    }
                ]
            },
            isHomeEntry: false,
            pinned: false,
            pinnedSortOrder: "-1",
            menuEntries: [
                {
                    title: "WOLFSEB's Test Page",
                    "help-id": "Page-ZSJW_TEST_PAGE",
                    description: "WOLFSEB's Test Page",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "ZSJW_TEST_SPACE_01"
                            },
                            {
                                name: "pageId",
                                value: "ZSJW_TEST_PAGE"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-254"
                }
            ],
            uid: "id-1681978473328-253"
        },
        {
            id: "ZSY_DEMO_SPACE",
            title: "Demo",
            "help-id": "Space-ZSY_DEMO_SPACE",
            description: "Demo space for demo role",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    {
                        name: "spaceId",
                        value: "ZSY_DEMO_SPACE"
                    },
                    {
                        name: "pageId",
                        value: "ZSY_DEMO_PAGE"
                    }
                ]
            },
            isHomeEntry: false,
            pinned: false,
            pinnedSortOrder: "-1",
            menuEntries: [],
            uid: "id-1681978473328-256"
        },
        {
            id: "SAP_BASIS_SP_FLP_TEST",
            title: "FLP Test Space",
            "help-id": "Space-SAP_BASIS_SP_FLP_TEST",
            description: "FLP Test Space",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    {
                        name: "spaceId",
                        value: "SAP_BASIS_SP_FLP_TEST"
                    },
                    {
                        name: "pageId",
                        value: "SAP_BASIS_PG_FLP_TEST"
                    }
                ]
            },
            isHomeEntry: false,
            pinned: true,
            pinnedSortOrder: "2",
            menuEntries: [
                {
                    title: "FLP Test Page",
                    "help-id": "Page-SAP_BASIS_PG_FLP_TEST",
                    description: "FLP Test Page",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "SAP_BASIS_SP_FLP_TEST"
                            },
                            {
                                name: "pageId",
                                value: "SAP_BASIS_PG_FLP_TEST"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-258"
                },
                {
                    title: "FLP Tile Types Demo",
                    "help-id": "Page-SAP_BASIS_PG_FLP_DEMO",
                    description: "FLP Tile Types Demo",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "SAP_BASIS_SP_FLP_TEST"
                            },
                            {
                                name: "pageId",
                                value: "SAP_BASIS_PG_FLP_DEMO"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-259"
                }
            ],
            uid: "id-1681978473328-257"
        },
        {
            id: "ZPERFORMANCE_KPI_SPACE",
            title: "Performance KPI Space",
            "help-id": "Space-ZPERFORMANCE_KPI_SPACE",
            description: "Performance KPI Space",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    {
                        name: "spaceId",
                        value: "ZPERFORMANCE_KPI_SPACE"
                    },
                    {
                        name: "pageId",
                        value: "ZPERFORMANCE_KPI_PAGE"
                    }
                ]
            },
            isHomeEntry: false,
            pinned: false,
            pinnedSortOrder: "-1",
            menuEntries: [],
            uid: "id-1681978473328-260"
        },
        {
            id: "Z_STABLE_SPACE_01",
            title: "StableIds Space",
            "help-id": "Space-Z_STABLE_SPACE_01",
            description: "Space for Testing StableIds",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    {
                        name: "spaceId",
                        value: "Z_STABLE_SPACE_01"
                    },
                    {
                        name: "pageId",
                        value: "Z_STABLE_PAGE_01"
                    }
                ]
            },
            isHomeEntry: false,
            pinned: false,
            pinnedSortOrder: "-1",
            menuEntries: [
                {
                    title: "StableIds Page",
                    "help-id": "Page-Z_STABLE_PAGE_01",
                    description: "Page for Testing StableIds",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "Z_STABLE_SPACE_01"
                            },
                            {
                                name: "pageId",
                                value: "Z_STABLE_PAGE_01"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-262"
                },
                {
                    title: "Pers",
                    "help-id": "Page-Z_STABLE_PAGE_02",
                    description: "Page for Testing the Migration of StableIds",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "Z_STABLE_SPACE_01"
                            },
                            {
                                name: "pageId",
                                value: "Z_STABLE_PAGE_02"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-263"
                }
            ],
            uid: "id-1681978473328-261"
        },
        {
            id: "ZUH_TEST_SPACE",
            title: "This is a space to test stuff",
            "help-id": "Space-ZUH_TEST_SPACE",
            description: "Some Description",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    {
                        name: "spaceId",
                        value: "ZUH_TEST_SPACE"
                    },
                    {
                        name: "pageId",
                        value: "Z_TEST"
                    }
                ]
            },
            isHomeEntry: false,
            pinned: true,
            pinnedSortOrder: "3",
            menuEntries: [
                {
                    title: "Z_TEST",
                    "help-id": "Page-Z_TEST",
                    description: "Z_TEST",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "ZUH_TEST_SPACE"
                            },
                            {
                                name: "pageId",
                                value: "Z_TEST"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-265"
                },
                {
                    title: "FLP Tile Types Demo",
                    "help-id": "Page-SAP_BASIS_PG_FLP_DEMO",
                    description: "FLP Tile Types Demo",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "ZUH_TEST_SPACE"
                            },
                            {
                                name: "pageId",
                                value: "SAP_BASIS_PG_FLP_DEMO"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-266"
                }
            ],
            uid: "id-1681978473328-264"
        },
        {
            id: "Z_TEST",
            title: "Z_TEST",
            "help-id": "Space-Z_TEST",
            description: "Z_TEST",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    {
                        name: "spaceId",
                        value: "Z_TEST"
                    },
                    {
                        name: "pageId",
                        value: "Z_TEST"
                    }
                ]
            },
            isHomeEntry: false,
            pinned: false,
            pinnedSortOrder: "-1",
            menuEntries: [
                {
                    title: "Z_TEST",
                    "help-id": "Page-Z_TEST",
                    description: "Z_TEST",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "Z_TEST"
                            },
                            {
                                name: "pageId",
                                value: "Z_TEST"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-268"
                },
                {
                    title: "Z_TEST_EMPTY",
                    "help-id": "Page-Z_TEST_EMPTY",
                    description: "Z_TEST_EMPTY",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "Z_TEST"
                            },
                            {
                                name: "pageId",
                                value: "Z_TEST_EMPTY"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-269"
                },
                {
                    title: "test page title",
                    "help-id": "Page-Z_UH_0",
                    description: "test page",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "Z_TEST"
                            },
                            {
                                name: "pageId",
                                value: "Z_UH_0"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-270"
                },
                {
                    title: "Support Test Page",
                    "help-id": "Page-Z_TESTPAGE",
                    description: "Test Page01",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "Z_TEST"
                            },
                            {
                                name: "pageId",
                                value: "Z_TESTPAGE"
                            }
                        ]
                    },
                    menuEntries: [],
                    uid: "id-1681978473328-271"
                }
            ],
            uid: "id-1681978473328-267"
        },
        {
            id: "ZEXT_URL",
            title: "External URL",
            "help-id": "Space-ZEXT_URL",
            description: "Test external URL",
            type: "URL",
            target: {
                url: "http://external.url"
            },
            isHomeEntry: false,
            pinned: false,
            pinnedSortOrder: "-1",
            menuEntries: [],
            uid: "id-1681978473328-830"
        }
    ];

    return menu;
});
