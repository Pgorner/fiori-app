sap.ui.define([
    "sap/ovp/insights/helpers/TableContentHelper",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/AnnotationHelper" // This is needed for the qunits to run
], function (
    TableContentHelper,
    utils,
    mockservers,
    CardAnnotationHelper
) {
    "use strict";

    QUnit.test("TableContentHelper - getTableContent - validate table content without card definition.", function (assert) {
        assert.deepEqual(TableContentHelper.getTableContent(), {}, "Returns an empty object if no card definition is passed");
    });

    QUnit.test("TableContentHelper - getTableContent - Validate table content with valid card definition.", function (assert) {
        mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
        var cardTestData = {
            card: {
                id: "card_01",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    title: "New Sales Orders",
                    subTitle: "Today",
                    entitySet: "SalesOrderSet",
                    category: "Sales Order Line Items - Table"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var oItemsBinding = oController.getCardItemsBinding();
            oController.onAfterRendering();
            //CreateData Change event
            oItemsBinding.fireDataReceived();
            var itemBindingInfo = oView.byId('ovpTable').getBindingInfo('items');
            oView.getController().oMainComponent = {
                getGlobalFilter: function () {
                    return null;
                }
            };
            oView.getController().oCardComponentData.mainComponent = oView.getController().oMainComponent;
            var oCardDefinition = {
                entitySet: oController.entitySet,
                entityType: oController.entityType,
                cardComponentName: "Table",
                cardComponentData: oController.oCardComponentData,
                cardComponent: oController.oCardComponent,
                itemBindingInfo: itemBindingInfo,
                view: oView
            };
            var oSapCard = {
                "extension": "module:sap/insights/CardExtension",
                "type": "Table",
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
                            "value": "SalesOrderSet?$inlinecount=allpages&$skip=0&$top=13"
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
                "row": {
                    "columns": [
                        {
                            "actions": undefined,
                            "hAlign": "Left",
                            "state": undefined,
                            "title": "Order ID",
                            "value": "{SalesOrderID}",
                        },
                        {
                            "actions": undefined,
                            "hAlign": "Left",
                            "state": undefined,
                            "title": "Customer",
                            "value": "{CustomerName}",
                        },
                        {
                            "actions": undefined,
                            "hAlign": "Left",
                            "state": undefined,
                            "title": "Net Amt.",
                            "value": "{= extension.formatters.formatCurrency({'numberOfFractionalDigits':0},false,${NetAmount},${CurrencyCode},${CurrencyCode})}",
                        }
                    ]
                }
            };
            assert.deepEqual(TableContentHelper.getTableContent(oCardDefinition, oSapCard), oResult, "Returns the Table card content");
            fnDone();
            mockservers.close();
        });

    });

    QUnit.test("TableContentHelper - getCellValue - Validate valueStateExpression for the provided text and state cell value, when controlType is of sap.m.ObjectStatus", function (assert) {
        var oCell = {
            getMetadata: function () {
                 return {
                    getName: function() {
                        return "sap.m.ObjectStatus";
                    }
                };
            },
            getBindingInfo: function(sPath) {
                if (sPath === "text") {
                    return {
                        parts: [
                            {
                                path: "LifecycleStatusDescription"
                            }
                        ]
                    }
                } else if (sPath === "state") {
                   return {
                        parts: [
                            {
                                path: "LifecycleStatus"
                            }
                        ]
                    }
                }
            }
        }
        var oResult = {
            "value": "{LifecycleStatusDescription}",
            "state": "{= extension.formatters.formatCriticality(${LifecycleStatus}, 'state')}"
        }

        assert.deepEqual(TableContentHelper.getCellValue(oCell, {}), oResult, "Returns value with the correct valueStateExpression for the provided text and state value");  
    });

});
