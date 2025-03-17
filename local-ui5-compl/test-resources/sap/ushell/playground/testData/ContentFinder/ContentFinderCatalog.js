// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/library"
], function (ushellLibrary) {
    "use strict";

    var oCatalog = [{
        id: "8adf91e9-b17a-425e-8053-f39b62f0c31e",
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
                            supported: ["standard", "standardWide", "flat", "flatWide", "compact"],
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
        }
    }, {

        id: "8adf91e9-b17a-425e-8053-f39b62f0c123",
        type: "sap.ushell.StaticAppLauncher",
        descriptor: {
            value: {
                "sap.ui": {
                    icons: {
                        icon: "sap-icon://Fiori9/F1354"
                    }
                },
                "sap.app": {
                    ach: "SLC-EVL",
                    title: "Translate Evaluation Templates",
                    subTitle: "Evaluation"
                },
                "sap.flp": {
                    vizOptions: {
                        displayFormats: {
                            supported: ["standard", "standardWide", "flat", "flatWide", "compact"],
                            default: "flat"
                        }
                    },
                    target: {
                        type: "IBN",
                        appId: "uyz200pp_0D3DD649E4DE6B79D2AF02C3D904A3AF",
                        inboundId: "ET090PW4NWFHYIXAAGVEZB82L",
                        parameters: {
                            "sap-ui-tech-hint": {
                                value: {
                                    value: "UI5",
                                    format: "plain"
                                }
                            }
                        }
                    }
                },
                "sap.fiori": {
                    registrationIds: ["F2198"]
                }
            }
        }
    },

    {
        id: "1e504721-8532-4a80-8fdd-0d88744c336f",
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
        }
    }];

    return oCatalog;
});
