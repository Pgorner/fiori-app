// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
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
                actions: [
                    {
                        type: "Navigation",
                        parameters: {
                            ibnTarget: {
                                semanticObject: "Action",
                                action: "toappnavsample"
                            },
                            ibnParams: {
                                SalesOrganization: "001",
                                SalesOffice: "FRA"
                            },
                            inboundIdentifier: "ccf_FE593DEA7C61B944C7821CBC5A5222D8_0894EF4576511EDA89C2B89E7C59C756_TM"
                        }
                    }
                ],
                title: "Project Staffing Watchlist",
                subTitle: "Today"
            },
            content: {
                row: {
                    actions: [{
                        type: "Navigation",
                        parameters: {
                            ibnTarget: {
                                semanticObject: "PurchaseContract",
                                action: "change"
                            },
                            ibnParams: {
                                SalesOrganization: "001",
                                SalesOffice: "FRA"
                            },
                            inboundIdentifier: "ccf_FE593DEA7C61B944C7821CBC5A5222D8_0894EF4576511EDA89C2B89E7C59C756_TM"
                        }
                    }],
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
    };
});
