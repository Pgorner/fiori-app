// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
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
    };
});
