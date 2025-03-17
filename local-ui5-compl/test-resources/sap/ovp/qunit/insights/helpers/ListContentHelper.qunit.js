sap.ui.define([
    "sap/ovp/insights/helpers/ListContentHelper",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/AnnotationHelper" // This is needed for the qunits to run
], function (
    ListContentHelper,
    Utils,
    Mockservers,
    CardAnnotationHelper
) {
    "use strict";

    QUnit.test("ListContentHelper - getListContent - validate list content without card definition.", function (assert) {
        assert.deepEqual(ListContentHelper.getListContent(), {}, "Returns an empty object if no card definition is passed");
    });

    QUnit.test("ListContentHelper - getListContent - Validate condensed type list content with valid card definition.", function (assert) {
        Mockservers.loadMockServer(Utils.odataBaseUrl_salesOrder, Utils.odataRootUrl_salesOrder);
        var cardTestData = {
            card: {
                id: "card_04",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    title: "Reorder Soon",
                    subTitle: "Less than 10 in stock",
                    entitySet: "SalesOrderSet",
                    listType: "condensed"
                }
            },
            dataSource: {
                baseUrl: Utils.odataBaseUrl_salesOrder,
                rootUri: Utils.odataRootUrl_salesOrder,
                annoUri: Utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        Utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var oItemsBinding = oController.getCardItemsBinding();
            oController.onAfterRendering();
            //CreateData Change event
            oItemsBinding.fireDataReceived();
            var itemBindingInfo = oView.byId('ovpList').getBindingInfo('items');
            oView.getController().oMainComponent = {
                getGlobalFilter: function () {
                    return null;
                }
            };
            oView.getController().oCardComponentData.mainComponent = oView.getController().oMainComponent;
            var oCardDefinition = {
                entitySet: oController.entitySet,
                entityType: oController.entityType,
                cardComponentName: "List",
                cardComponentData: oController.oCardComponentData,
                cardComponent: oController.oCardComponent,
                itemBindingInfo: itemBindingInfo,
                view: oView
            };
            var oSapCard = {
                "extension": "module:sap/insights/CardExtension",
                "type": "List",
                "configuration": {
                    "parameters": {
                        "CurrencyCode": {
                            "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CurrencyCode\",\"Ranges\":[]}]}",
                            "type": "string",
                            "description": ""
                        },
                        "NetAmount": {
                            "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"NetAmount\",\"Ranges\":[]}]}",
                            "type": "number",
                            "description": ""
                        },
                        "_relevantODataFilters": {
                            "value": [
                                "CurrencyCode",
                                "NetAmount"
                            ]
                        },
                        "_relevantODataParameters": {
                            "value": []
                        },
                        "_mandatoryODataParameters": {
                            "value": []
                        },
                        "_mandatoryODataFilters": {
                            "value": []
                        },
                        "_contentDataUrl": {
                            "value": "SalesOrderSet?$orderby=Availability_Status%20desc&$inlinecount=allpages&$skip=0&$top=13"
                        },
                        "_entitySet": {
                            "value": "SalesOrderSet"
                        },
                        "_urlSuffix": {
                            "value": ""
                        },
                        "_contentSkipQuery": {
                            "value": "$skip=0"
                        },
                        "_contentTopQuery": {
                            "value": "$top=13"
                        },
                        "_contentSortQuery": {
                            "value": ""
                        },
                        "_contentSelectQuery": {
                            "value": ""
                        },
                        "_contentExpandQuery": {
                            "value": ""
                        }
                    },
                    "destinations": {
                        "service": {
                            "name": "(default)",
                            "defaultUrl": "/"
                        }
                    },
                    "csrfTokens": {
                        "token1": {
                            "data": {
                                "request": {
                                    "url": "{{destinations.service}}/sap/opu/odata/IWBEP/GWSAMPLE_BASIC",
                                    "method": "HEAD",
                                    "headers": {
                                        "X-CSRF-Token": "Fetch"
                                    }
                                }
                            }
                        }
                    }
                },
                "data": {
                    "request": {
                        "method": "GET",
                        "url": "{{destinations.service}}/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/{{parameters._contentDataUrl}}",
                        "headers": {
                            "Accept": "application/json",
                            "Accept-Language": "{{parameters.LOCALE}}",
                            "X-CSRF-Token": "{{csrfTokens.token1}}"
                        }
                    }
                },
                "header": {
                    "type": "Default",
                    "title": "New Sales Orders",
                    "subTitle": "Today",
                    "status": {
                        "text": "{= ${/d/__count} === '0' ? '' : extension.formatters.formatHeaderCount( ${/d/__count}) }"
                    }
                }
            };
            var oResult = {
                "data": {
                    "path": "/d/results"
                },
                "item": {
                    "title": "{SalesOrderID}",
                    "info": {
                        "value": "{= extension.formatters.formatNumber(null,[0,' ',1],${LifecycleStatus},${LifecycleStatusDescription})}",
                        "state": "{= extension.formatters.formatCriticality('None', 'state')}"
                    },
                    "description": "{CustomerName}"
                }
            };
            assert.deepEqual(ListContentHelper.getListContent(oCardDefinition, oSapCard), oResult, "Returns the condensed List card content");
            fnDone();
            Mockservers.close();
        });

    });

    QUnit.test("ListContentHelper - getListContent - Validate extended type list content with valid card definition.", function (assert) {
        Mockservers.loadMockServer(Utils.odataBaseUrl_salesOrder, Utils.odataRootUrl_salesOrder);
        var cardTestData = {
            card: {
                id: "card_03",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    title: "Reorder Soon",
                    subTitle: "Less than 30 in stock",
                    entitySet: "SalesOrderSet",
                    listType: "extended"
                }
            },
            dataSource: {
                baseUrl: Utils.odataBaseUrl_salesOrder,
                rootUri: Utils.odataRootUrl_salesOrder,
                annoUri: Utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        Utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var oItemsBinding = oController.getCardItemsBinding();
            oController.onAfterRendering();
            //CreateData Change event
            oItemsBinding.fireDataReceived();
            var itemBindingInfo = oView.byId('ovpList').getBindingInfo('items');
            oView.getController().oMainComponent = {
                getGlobalFilter: function () {
                    return null;
                }
            };
            oView.getController().oCardComponentData.mainComponent = oView.getController().oMainComponent;
            var oCardDefinition = {
                entitySet: oController.entitySet,
                entityType: oController.entityType,
                cardComponentName: "List",
                cardComponentData: oController.oCardComponentData,
                cardComponent: oController.oCardComponent,
                itemBindingInfo: itemBindingInfo,
                view: oView
            };
            var oSapCard = {
                "extension": "module:sap/insights/CardExtension",
                "type": "List",
                "configuration": {
                    "parameters": {
                        "CurrencyCode": {
                            "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CurrencyCode\",\"Ranges\":[]}]}",
                            "type": "string",
                            "description": ""
                        },
                        "NetAmount": {
                            "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"NetAmount\",\"Ranges\":[]}]}",
                            "type": "number",
                            "description": ""
                        },
                        "_relevantODataFilters": {
                            "value": [
                                "CurrencyCode",
                                "NetAmount"
                            ]
                        },
                        "_relevantODataParameters": {
                            "value": []
                        },
                        "_mandatoryODataParameters": {
                            "value": []
                        },
                        "_mandatoryODataFilters": {
                            "value": []
                        },
                        "_contentDataUrl": {
                            "value": "SalesOrderSet?$orderby=Availability_Status%20desc&$inlinecount=allpages&$skip=0&$top=13"
                        },
                        "_entitySet": {
                            "value": "SalesOrderSet"
                        },
                        "_urlSuffix": {
                            "value": ""
                        },
                        "_contentSkipQuery": {
                            "value": "$skip=0"
                        },
                        "_contentTopQuery": {
                            "value": "$top=13"
                        },
                        "_contentSortQuery": {
                            "value": ""
                        },
                        "_contentSelectQuery": {
                            "value": ""
                        },
                        "_contentExpandQuery": {
                            "value": ""
                        }
                    },
                    "destinations": {
                        "service": {
                            "name": "(default)",
                            "defaultUrl": "/"
                        }
                    },
                    "csrfTokens": {
                        "token1": {
                            "data": {
                                "request": {
                                    "url": "{{destinations.service}}/sap/opu/odata/IWBEP/GWSAMPLE_BASIC",
                                    "method": "HEAD",
                                    "headers": {
                                        "X-CSRF-Token": "Fetch"
                                    }
                                }
                            }
                        }
                    }
                },
                "data": {
                    "request": {
                        "method": "GET",
                        "url": "{{destinations.service}}/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/{{parameters._contentDataUrl}}",
                        "headers": {
                            "Accept": "application/json",
                            "Accept-Language": "{{parameters.LOCALE}}",
                            "X-CSRF-Token": "{{csrfTokens.token1}}"
                        }
                    }
                },
                "header": {
                    "type": "Default",
                    "title": "New Sales Orders",
                    "subTitle": "Today",
                    "status": {
                        "text": "{= ${/d/__count} === '0' ? '' : extension.formatters.formatHeaderCount( ${/d/__count}) }"
                    }
                }
            };
            var oResult =
            {
                data: {
                    "path": "/d/results"
                },
                item: {
                    "attributes": [
                        {
                            value: "{CustomerName}"
                        },
                        {
                            state: "{= extension.formatters.formatValueColor(${GrossAmount},{\"deviationLow\":500,\"deviationHigh\":\"\",\"toleranceLow\":5000,\"toleranceHigh\":\"\",\"bIsDeviationLowBinding\":false,\"bIsDeviationHighBinding\":false,\"bIsToleranceLowBinding\":false,\"bIsToleranceHighBinding\":false,\"sImprovementDirection\":\"com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize\",\"oCriticalityConfigValues\":{\"None\":\"None\",\"Negative\":\"Error\",\"Critical\":\"Warning\",\"Positive\":\"Success\"},\"functionName\":\"CardAnnotationhelper.formatColor\",\"bODataV4\":false})}",
                            value: "{= extension.formatters.formatCurrency({'numberOfFractionalDigits':0},false,${GrossAmount},${CurrencyCode},${CurrencyCode})}"
                        },
                        {
                            value: "{= extension.formatters.formatCurrency({'numberOfFractionalDigits':0},false,${NetAmount},${CurrencyCode},${CurrencyCode})}"
                        },
                        {
                            state: "None",
                            value: "{= extension.formatters.formatNumber(null,[0,' (',1,')'],${LifecycleStatus},${LifecycleStatusDescription})}"
                        }
                    ],
                    attributesLayoutType: "TwoColumns",
                    info: {
                        state: "{= extension.formatters.formatCriticality('None', 'state')}",
                        value: "{= extension.formatters.formatNumber(null,[0,' ',1],${LifecycleStatus},${LifecycleStatusDescription})}"
                    },
                    title: "{SalesOrderID}"
                }
            };
            assert.deepEqual(ListContentHelper.getListContent(oCardDefinition, oSapCard), oResult, "Returns the extended List card content");
            fnDone();
            Mockservers.close();
        });

    });
});
