// Copyright (c) 2009-2023 SAP SE, All Rights Reserved


sap.ui.define([
    "sap/ushell/opa/testSiteData/WorkPageBuilder/tiles/DynamicTile",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/tiles/StaticTile",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/tiles/LunchTile",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/tiles/StaticTile2",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/cards/StackedColumnCard",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/cards/TableCard",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/vizTypes/StaticTile",
    "sap/ushell/opa/testSiteData/WorkPageBuilder/vizTypes/DynamicTile"
], function (
    DescriptorDynamicTile,
    DescriptorStaticTile,
    DescriptorLunchTile,
    DescriptorStaticTile2,
    DescriptorStackedColumnCard,
    DescriptorTableCard
) {
    "use strict";

    return {
        workPage: {
            id: "wp0001",
            contents: {
                id: "wp0001",
                descriptor: {
                    value: {
                        title: "CEP Standard workPage",
                        description: ""
                    },
                    schemaVersion: "3.2.0"
                },
                rows: [
                    {
                        id: "row0",
                        configurations: [],
                        descriptor: {
                            value: {
                                title: "First Section: Tiles"
                            },
                            schemaVersion: "3.2.0"
                        },
                        columns: [
                            {
                                id: "row0_col0",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 24
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: [
                                    {
                                        id: "row0_col0_cell0",
                                        tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                        instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                        descriptor: {
                                            value: {
                                                mode: "Section"
                                            },
                                            schemaVersion: "3.2.0"
                                        },
                                        configurations: [],
                                        widgets: [
                                            {
                                                id: "dynamic_tile_0",
                                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                                configurations: [],
                                                visualization: {
                                                    id: "provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId"
                                                }
                                            }, {
                                                id: "static_tile_0",
                                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                                configurations: [],
                                                visualization: {
                                                    id: "provider1_f95ad84a-65d0-4c39-9a67-09a4efe04f92#Default-VizId"
                                                }
                                            }, {
                                                id: "lunch_tile_0",
                                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                                configurations: [],
                                                visualization: {
                                                    id: "provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId"
                                                }
                                            }, {
                                                id: "static_tile_1",
                                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                                configurations: [],
                                                visualization: {
                                                    id: "provider1_a152d792-a43e-48eb-aafd-51451a6168e9#Default-VizId"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "row1",
                        configurations: [],
                        descriptor: {
                            value: {
                                title: "Second Section: Cards"
                            },
                            schemaVersion: "3.2.0"
                        },
                        columns: [
                            {
                                id: "row1_col0",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 12
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: [
                                    {
                                        id: "row1_col0_cell0",
                                        descriptor: {
                                            value: {},
                                            schemaVersion: "3.2.0"
                                        },
                                        configurations: [],
                                        widgets: [
                                            {
                                                id: "stacked-column-card",
                                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                                configurations: [{
                                                    id: "conf_widget_0",
                                                    level: "PG",
                                                    settings: {
                                                        value: {
                                                            "/sap.card/configuration/parameters/title/value": "Sample title (Widget - PG)"
                                                        }
                                                    }
                                                }, {
                                                    id: "conf_widget_1",
                                                    level: "CO",
                                                    settings: {
                                                        value: {
                                                            "/sap.card/configuration/parameters/title/value": "Sample title (Widget - CO)",
                                                            "/sap.card/configuration/parameters/subtitle/value": "Sample subtitle (Widget - CO)"
                                                        }
                                                    }
                                                }, {
                                                    id: "conf_widget_2",
                                                    level: "PR",
                                                    settings: {
                                                        value: {
                                                            "/sap.card/configuration/parameters/details/value": "Sample details (Widget - PR)",
                                                            "/sap.card/configuration/parameters/title/value": "Sample title (Widget - PR)",
                                                            "/sap.card/configuration/parameters/subtitle/value": "Sample subtitle (Widget - PR)"

                                                        }
                                                    }
                                                }],
                                                visualization: {
                                                    id: "provider2_1e504721-8532-4a80-8fdd-0d88744c336f#Default-VizId"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "row1_col1",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 12
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: [
                                    {
                                        id: "row1_col0_cell0",
                                        tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                        instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                        descriptor: {
                                            value: {},
                                            schemaVersion: "3.2.0"
                                        },
                                        configurations: [],
                                        widgets: [
                                            {
                                                id: "table-card",
                                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                                configurations: [{
                                                    id: "conf_widget_0",
                                                    level: "PG",
                                                    settings: {
                                                        value: {
                                                            "/sap.card/configuration/parameters/title/value": "Sample title (Widget - PG)"
                                                        }
                                                    }
                                                }, {
                                                    id: "conf_widget_1",
                                                    level: "CO",
                                                    settings: {
                                                        value: {
                                                                "/sap.card/configuration/parameters/title/value": "Sample title (Widget - CO)",
                                                            "/sap.card/configuration/parameters/subtitle/value": "Sample subtitle (Widget - CO)",
                                                            "/sap.card/configuration/parameters/titleMaxLines/value": 20
                                                        }
                                                    }
                                                }, {
                                                    id: "conf_widget_2",
                                                    level: "PR",
                                                    settings: {
                                                        value: {
                                                            "/sap.card/configuration/parameters/title/value": "Sample title (Widget - PR)",
                                                            "/sap.card/configuration/parameters/subtitle/value": "Sample subtitle (Widget - PR)",
                                                            "/sap.card/configuration/parameters/titleMaxLines/value": 30
                                                        }
                                                    }
                                                }],
                                                visualization: {
                                                    id: "provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "row2",
                        configurations: [],
                        descriptor: {
                            value: {
                                title: "Third Section: Empty"
                            },
                            schemaVersion: "3.2.0"
                        },
                        columns: [
                            {
                                id: "row2_col0",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a2",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 24
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: []
                            }
                        ]
                    },
                    {
                        id: "row3",
                        configurations: [],
                        descriptor: {
                            value: {
                                title: "Fourth Section: 6 columns"
                            },
                            schemaVersion: "3.2.0"
                        },
                        columns: [
                            {
                                id: "row3_col0",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a2",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 4
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: []
                            },
                            {
                                id: "row3_col1",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a2",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 4
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: []
                            },
                            {
                                id: "row3_col2",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a2",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 4
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: []
                            },
                            {
                                id: "row3_col3",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a2",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 4
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: []
                            },
                            {
                                id: "row3_col4",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a2",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 4
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: []
                            },
                            {
                                id: "row3_col5",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a2",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {
                                        columnWidth: 4
                                    },
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                cells: []
                            }
                        ]
                    }
                ]
            },
            usedVisualizations: {
                nodes: [
                    {
                        id: "provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId",
                        type: "sap.ushell.DynamicAppLauncher",
                        descriptor: {
                            value: DescriptorDynamicTile
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
                            value: DescriptorStaticTile
                        },
                        descriptorResources: {
                            baseUrl: "",
                            descriptorPath: ""
                        }
                    },
                    {
                        id: "provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId",
                        type: "sap.ushell.StaticAppLauncher",
                        descriptor: {
                            value: DescriptorLunchTile
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
                            value: DescriptorStaticTile2
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
                            value: DescriptorStackedColumnCard
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
                            value: DescriptorTableCard
                        },
                        descriptorResources: {
                            baseUrl: "",
                            descriptorPath: ""
                        },
                        configurations: [{
                            id: "conf_viz_0",
                            level: "PG",
                            settings: {
                                value: {
                                    "/sap.card/configuration/parameters/title/value": "Sample title (Viz - PG)",
                                    "/sap.card/configuration/parameters/subtitle/value": "Sample subtitle (Viz - PG)",
                                    "/sap.card/configuration/parameters/titleMaxLines/value": 3
                                }
                            }
                        }, {
                            id: "conf_viz_1",
                            level: "CO",
                            settings: {
                                value: {
                                    "/sap.card/configuration/parameters/title/value": "Sample title (Viz - CO)",
                                    "/sap.card/configuration/parameters/subtitle/value": "Sample subtitle (Viz - CO)",
                                    "/sap.card/configuration/parameters/titleMaxLines/value": 2
                                }
                            }
                        }, {
                            id: "conf_viz_2",
                            level: "PR",
                            settings: {
                                value: {
                                    "/sap.card/configuration/parameters/title/value": "Sample title (Viz - PR)",
                                    "/sap.card/configuration/parameters/subtitle/value": "Sample subtitle (Viz - PR)",
                                    "/sap.card/configuration/parameters/titleMaxLines/value": 1

                                }
                            }
                        }]
                    }
                ]
            }
        }
    };
});
