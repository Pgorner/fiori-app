// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";
    return {
        "sap.card": {
            extension: "module:sap/insights/CardExtension",
            type: "List",
            configuration: {
                parameters: {
                    SoldToParty: {
                        value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"SoldToParty\",\"Ranges\":[]}]}",
                        type: "string"
                    },
                    SalesOrganization: {
                        value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"SalesOrganization\",\"Ranges\":[]}]}",
                        type: "string"
                    },
                    DistributionChannel: {
                        value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"DistributionChannel\",\"Ranges\":[]}]}",
                        type: "string"
                    },
                    OrganizationDivision: {
                        value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"OrganizationDivision\",\"Ranges\":[]}]}",
                        type: "string"
                    },
                    CustomerClassification: {
                        value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CustomerClassification\",\"Ranges\":[]}]}",
                        type: "string"
                    },
                    CreatedByUser: {
                        value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CreatedByUser\",\"Ranges\":[]}]}",
                        type: "string"
                    },
                    LastChangedByUser: {
                        value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"LastChangedByUser\",\"Ranges\":[]}]}",
                        type: "string"
                    },
                    SalesOffice: {
                        value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"SalesOffice\",\"Ranges\":[]}]}",
                        type: "string"
                    },
                    SalesGroup: {
                        value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"SalesGroup\",\"Ranges\":[]}]}",
                        type: "string"
                    },
                    _relevantODataFilters: {
                        value: [
                            "SoldToParty",
                            "SalesOrganization",
                            "DistributionChannel",
                            "OrganizationDivision",
                            "CustomerClassification",
                            "CreatedByUser",
                            "LastChangedByUser",
                            "SalesOffice",
                            "SalesGroup"
                        ]
                    },
                    _relevantODataParameters: {
                        value: []
                    },
                    _mandatoryODataParameters: {
                        value: []
                    },
                    _mandatoryODataFilters: {
                        value: []
                    },
                    _contentDataUrl: {
                        value: "C_OpenSalesOrders_F2200?$skip=0&$top=6&$orderby=LastChangeDateTime%20desc&$filter=OverallSDProcessStatus%20eq%20%27A%27%" +
                            "20or%20OverallSDProcessStatus%20eq%20%27B%27%20or%20OverallSDProcessStatus%20eq%20%27%27&$select=SalesOrder%2cOverallSDProcessStatusDesc" +
                            "%2cLastChangeDateTime%2cCriticalityCode%2cTotalNetAmount%2cTransactionCurrency&$inlinecount=allpages"
                    },
                    _entitySet: {
                        value: "C_OpenSalesOrders_F2200"
                    },
                    _urlSuffix: {
                        value: ""
                    },
                    _contentSkipQuery: {
                        value: "$skip=0"
                    },
                    _contentTopQuery: {
                        value: "$top=6"
                    },
                    _contentSortQuery: {
                        value: "$orderby=LastChangeDateTime%20desc"
                    },
                    _contentSelectQuery: {
                        value: "$select=SalesOrder,TotalNetAmount,TransactionCurrency"
                    },
                    state: {
                        value: "{\"presentationVariant\":{\"SortOrder\":[{\"Property\":\"LastChangeDateTime\",\"Descending\":true}]},\"sensitiveProps\":{}}"
                    }
                },
                destinations: {
                    service: {
                        name: "SAP_Start_S4_IC",
                        defaultUrl: "/"
                    }
                },
                csrfTokens: {
                    token1: {
                        data: {
                            request: {
                                url: "{{destinations.service}}/sap/opu/odata/sap/SD_F2200_OVP_ISR_SRV",
                                method: "HEAD",
                                headers: {
                                    "X-CSRF-Token": "Fetch"
                                }
                            }
                        }
                    }
                }
            },
            data: {
                request: {
                    url: "{{destinations.service}}/sap/opu/odata/sap/SD_F2200_OVP_ISR_SRV/$batch",
                    method: "POST",
                    headers: {
                        "X-CSRF-Token": "{{csrfTokens.token1}}"
                    },
                    batch: {
                        content: {
                            method: "GET",
                            url: "{{parameters._contentDataUrl}}",
                            headers: {
                                Accept: "application/json",
                                "Accept-Language": "{{parameters.LOCALE}}"
                            }
                        }
                    }
                }
            },
            header: {
                type: "Default",
                title: "Open Sales Orders",
                subTitle: "Sorted By: Last Changed / Created Date",
                data: {
                    path: "/header/d/results/0"
                },
                status: {
                    text: {
                        format: {
                            translationKey: "i18n>CARD.COUNT_X_OF_Y",
                            parts: [
                                "parameters>/visibleItems",
                                "/content/d/__count"
                            ]
                        }
                    }
                },
                actions: [
                    {
                        type: "Navigation",
                        parameters: {
                            ibnTarget: {
                                semanticObject: "SalesOrder",
                                action: "manage"
                            },
                            ibnParams: {
                                "sap-xapp-state-data": "{= extension.formatters.addPropertyValueToAppState(${parameters>/state/value}) }"
                            },
                            area: "header"
                        }
                    }
                ]
            },
            content: {
                data: {
                    path: "/content/d/results"
                },
                item: {
                    title: "{SalesOrder}",
                    info: {
                        value: "{= format.dateTime(${LastChangeDateTime}, {relative:true}) }",
                        state: "{= (${CriticalityCode} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${CriticalityCode} === '1') || " +
                            "(${CriticalityCode} === 1) ? 'Error' : (${CriticalityCode} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || " +
                            "(${CriticalityCode} === '2') || (${CriticalityCode} === 2) ? 'Warning' : (${CriticalityCode} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || " +
                            "(${CriticalityCode} === '3') || (${CriticalityCode} === 3) ? 'Success' : 'None' }"
                    },
                    attributesLayoutType: "TwoColumns",
                    attributes: [
                        {
                            value: "{OverallSDProcessStatusDesc}"
                        },
                        {
                            value: "{= format.float(${TotalNetAmount}, {decimals:1, style:'short'})}\n{TransactionCurrency}"
                        }
                    ],
                    actions: [
                        {
                            type: "Navigation",
                            parameters: {
                                ibnTarget: {
                                    semanticObject: "SalesOrder",
                                    action: "manage"
                                },
                                ibnParams: {
                                    "sap-xapp-state-data": "{= extension.formatters.addPropertyValueToAppState(${parameters>/state/value}, ${})}"
                                },
                                area: "content"
                            }
                        }
                    ]
                }
            }
        },
        "sap.app": {
            id: "cus.sd.ovp.isr.cards.openSalesOrders",
            type: "card",
            embeddedBy: "../../",
            i18n: "../../i18n/i18n.properties",
            tags: {
                keywords: [
                    "Analytical",
                    "Card",
                    "Line",
                    "Sample"
                ]
            },
            crossNavigation: {
                inbounds: {
                    intent: {
                        signature: {
                            additionalParameters: "allowed",
                            parameters: {
                                P_DisplayCurrency: "EUR"
                            }
                        },
                        semanticObject: "SalesOrder",
                        action: "manage"
                    }
                }
            },
            dataSources: {
                SD_F2200_OVP_ISR_ANNO_MDL: {
                    uri: "localService/SD_F2200_OVP_ISR_SRV/SD_F2200_OVP_ISR_ANNO_MDL.xml",
                    type: "XML"
                },
                filterService: {
                    uri: "/sap/opu/odata/sap/SD_F2200_OVP_ISR_SRV/",
                    settings: {
                        annotations: [
                            "SD_F2200_OVP_ISR_ANNO_MDL"
                        ],
                        odataVersion: "2.0"
                    },
                    type: "ODataAnnotation"
                }
            },
            title: "My Sales Overview"
        },
        "sap.insights": {
            parentAppId: "cus.sd.ovp.isr",
            filterEntitySet: "C_GlobalFiltersOVP_F2200Set",
            cardType: "DT",
            versions: {
                ui5: "1.104.0-SNAPSHOT-202206040316-manual",
                dtMiddleware: "0.1.14"
            }
        },
        "sap.ui5": {
            _version: "1.1.0",
            contentDensities: {
                compact: true,
                cozy: true
            },
            dependencies: {
                libs: {
                    "sap.insights": {
                        lazy: false
                    }
                }
            }
        }
    };
});
