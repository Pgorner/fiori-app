// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
], function () {
    "use strict";

    var oVisualizationData = {
        visualizations: {
            nodes: [
                {
                    id: "provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "Do nothing",
                                subTitle: "Does nothing",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "97176e7f-b2ea-4e31-842a-3efa5086b336#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "Do all the work",
                                subTitle: "Does all the work instantly",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "97176e7f-b2ea-4e31-842a-3efa5086b335#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "App 2",
                                subTitle: "My second app",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "97176e7f-b2ea-4e31-842a-3efa5086b334#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "Emergency delete",
                                subTitle: "Deleted everything very fast",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "97176e7f-b2ea-4e31-842a-3efa5086b333#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "Inbox",
                                subTitle: "Not your inbox",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "97176e7f-b2ea-4e31-842a-3efa5086b332#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "Pay everything",
                                subTitle: "Reset all the debt",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "97176e7f-b2ea-4e31-842a-3efa5086b331#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "Secret hidden Projects",
                                subTitle: "Projects you should not know about.",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "97176e7f-b2ea-4e31-842a-3efa5086b330#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "Special Projects",
                                subTitle: "You should not know about",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "provider2_97176e7f-b2ea-4e31-842a-3efa5086b630#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "Capital Projects",
                                subTitle: "All about Finance",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "97176e7f-b2ea-4e99-842a-3efa5086b329#Default-VizId",
                    type: "sap.ushell.DynamicAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                title: "I am a nasty tile",
                                subTitle: "All about tiles",
                                info: "desktop only"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://capital-projects"
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "compact",
                                            "flat",
                                            "flatWide"
                                        ],
                                        default: "standard"
                                    }
                                },
                                target: {
                                    semanticObject: "Action",
                                    action: "toappnavsample"
                                },
                                indicatorDataSource: {
                                    path: "../../test/counts/v2/$count.txt",
                                    refresh: 300
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "app-id-0001",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                id: "F0001",
                                title: "I am the best app in the world",
                                subTitle: "Even though, I don't have an icon.",
                                info: "But I have a lot of information to share with you."
                            },
                            "sap.flp": {
                                target: {
                                    type: "URL",
                                    url: "www.sap.com"
                                },
                                indicatorDataSource: {
                                    path: "test",
                                    refresh: 60
                                },
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ],
                                        default: "standard"
                                    }
                                }
                            },
                            "sap.ui": {

                            }
                        }
                    }
                },
                {
                    id: "provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                id: "tile1",
                                title: "I am hungry",
                                subTitle: "lets eat"
                            },
                            "sap.flp": {
                                target: {
                                    type: "URL",
                                    url: "https://fiorilaunchpad.sap.com/sites#lunch-menu&/favorites/?language=de"
                                },
                                indicatorDataSource: {
                                    path: "/mockbackend/dynamictile",
                                    refresh: 60
                                },
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ],
                                        default: "standard"
                                    }
                                }
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://meal"
                                }
                            }
                        }
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
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://full-stacked-column-chart"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "card.explorer.stacked.column.card",
                                info: "Additional information about this Card",
                                tags: {
                                    keywords: [
                                        "Analytical",
                                        "Card",
                                        "Stacked Column",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "Sample of a Stacked Column Chart",
                                subTitle: "Sample of a Stacked Column Chart",
                                shortTitle: "A short title for this Card",
                                description: "A long description for this Card",
                                applicationVersion: {
                                    version: "1.0.0"
                                }
                            },
                            _version: "1.14.0",
                            "sap.card": {
                                type: "Analytical",
                                header: {
                                    data: {
                                        json: {
                                            n: "84",
                                            u: "%",
                                            trend: "Up",
                                            valueColor: "Good"
                                        }
                                    },
                                    type: "Numeric",
                                    title: "Digital Practice",
                                    details: "Based on planned project dates",
                                    subTitle: "Current and Forecasted Utilization",
                                    mainIndicator: {
                                        unit: "{u}",
                                        state: "{valueColor}",
                                        trend: "{trend}",
                                        number: "{n}"
                                    },
                                    sideIndicators: [
                                        {
                                            unit: "%",
                                            title: "Target",
                                            number: "85"
                                        },
                                        {
                                            unit: "%",
                                            title: "Deviation",
                                            number: "15"
                                        }
                                    ],
                                    unitOfMeasurement: "%"
                                },
                                content: {
                                    data: {
                                        json: {
                                            list: [
                                                {
                                                    Cost: 230000,
                                                    Week: "Mar",
                                                    Cost1: 24800.63,
                                                    Cost2: 205199.37,
                                                    Cost3: 199999.37,
                                                    Budget: 210000,
                                                    Target: 500000,
                                                    Revenue: 78
                                                },
                                                {
                                                    Cost: 238000,
                                                    Week: "Apr",
                                                    Cost1: 99200.39,
                                                    Cost2: 138799.61,
                                                    Cost3: 200199.37,
                                                    Budget: 224000,
                                                    Target: 500000,
                                                    Revenue: 80
                                                },
                                                {
                                                    Cost: 221000,
                                                    Week: "May",
                                                    Cost1: 70200.54,
                                                    Cost2: 150799.46,
                                                    Cost3: 80799.46,
                                                    Budget: 238000,
                                                    Target: 500000,
                                                    Revenue: 82
                                                },
                                                {
                                                    Cost: 280000,
                                                    Week: "Jun",
                                                    Cost1: 158800.73,
                                                    Cost2: 121199.27,
                                                    Cost3: 108800.46,
                                                    Budget: 252000,
                                                    Target: 500000,
                                                    Revenue: 91
                                                },
                                                {
                                                    Cost: 325000,
                                                    Week: "Jul",
                                                    Cost1: 237200.74,
                                                    Cost2: 87799.26,
                                                    Cost3: 187799.26,
                                                    Budget: 294000,
                                                    Target: 600000,
                                                    Revenue: 95
                                                }
                                            ]
                                        },
                                        path: "/list"
                                    },
                                    feeds: [
                                        {
                                            uid: "categoryAxis",
                                            type: "Dimension",
                                            values: [
                                                "Weeks"
                                            ]
                                        },
                                        {
                                            uid: "valueAxis",
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
                                        },
                                        {
                                            name: "Cost"
                                        }
                                    ],
                                    chartType: "stacked_column",
                                    dimensions: [
                                        {
                                            name: "Weeks",
                                            value: "{Week}"
                                        }
                                    ],
                                    chartProperties: {
                                        title: {
                                            text: "Utilization Projection",
                                            alignment: "left"
                                        },
                                        plotArea: {
                                            dataLabel: {
                                                visible: false,
                                                showTotal: true
                                            }
                                        },
                                        valueAxis: {
                                            title: {
                                                visible: false
                                            }
                                        },
                                        legendGroup: {
                                            position: "bottom",
                                            alignment: "topLeft"
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
                        baseUrl: "",
                        descriptorPath: ""
                    }
                },
                {
                    id: "provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId",
                    type: "sap.card",
                    descriptor: {
                        value: {
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://table-view"
                                },
                                technology: "UI5"
                            },
                            "sap.app": {
                                id: "card.explorer.table.card",
                                info: "Additional information about this Card",
                                tags: {
                                    keywords: [
                                        "Table",
                                        "Card",
                                        "Sample"
                                    ]
                                },
                                type: "card",
                                title: "Sample of a Table Card",
                                subTitle: "Sample of a Table Card",
                                shortTitle: "A short title for this Card",
                                description: "A long description for this Card",
                                applicationVersion: {
                                    version: "1.0.0"
                                }
                            },
                            _version: "1.15.0",
                            "sap.card": {
                                data: {
                                    json: [
                                        {
                                            status: "Canceled",
                                            netAmount: "29",
                                            salesOrder: "5000010050",
                                            statusState: "Error",
                                            customerName: "Robert Brown",
                                            deliveryProgress: 59
                                        },
                                        {
                                            status: "Starting",
                                            netAmount: "30 | 230",
                                            salesOrder: "5000010051",
                                            statusState: "Warning",
                                            customerName: "SAP ERP Metraneo",
                                            deliveryProgress: 85
                                        },
                                        {
                                            status: "In Progress",
                                            netAmount: "12 | 69",
                                            salesOrder: "5000010052",
                                            statusState: "Error",
                                            customerName: "4KG AG",
                                            deliveryProgress: 50
                                        },
                                        {
                                            status: "Delayed",
                                            netAmount: "84",
                                            salesOrder: "5000010052",
                                            statusState: "Warning",
                                            customerName: "Clonemine",
                                            deliveryProgress: 41
                                        }
                                    ]
                                },
                                type: "Table",
                                header: {
                                    title: "Project Staffing Watchlist",
                                    subTitle: "Today",
                                    actions: []
                                },
                                content: {
                                    row: {
                                        actions: [],
                                        columns: [
                                            {
                                                title: "Project",
                                                value: "{salesOrder}",
                                                identifier: true
                                            },
                                            {
                                                title: "Customer",
                                                value: "{customerName}"
                                            },
                                            {
                                                title: "Staffing",
                                                value: "{netAmount}",
                                                hAlign: "End"
                                            },
                                            {
                                                state: "{statusState}",
                                                title: "Status",
                                                value: "{status}"
                                            },
                                            {
                                                title: "Staffing",
                                                progressIndicator: {
                                                    text: "{= format.percent(${deliveryProgress} / 100)}",
                                                    state: "{statusState}",
                                                    percent: "{deliveryProgress}"
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    descriptorResources: {
                        baseUrl: "",
                        descriptorPath: ""
                    }
                }
            ],
            totalCount: 14
        }
    };

    return oVisualizationData;
});
