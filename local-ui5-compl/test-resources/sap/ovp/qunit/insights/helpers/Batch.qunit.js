sap.ui.define([
    "sap/ovp/insights/helpers/Batch",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/AnnotationHelper" // This is needed for the qunits to run
], function(
    BatchHelper,
    utils,
    mockservers,
    CardAnnotationHelper
) {
    "use strict";

    QUnit.test("BatchHelper Utility - _removeQueryParam, remove requested query parameter from card binding url when there are multiple parameters", function (assert) {
        var sUrl = "/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked?$select=Sales%2cSales_CURRENCY&_requestFrom=ovp_internal";
        var sExpectedUrl = "/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked?$select=Sales%2cSales_CURRENCY";
        assert.ok(BatchHelper._removeQueryParam(sUrl, "_requestFrom") === sExpectedUrl, "_requestFrom parameter is removed from url parameters");
    });

    QUnit.test("BatchHelper Utility - _removeQueryParam, remove requested query parameter from card binding url when there is single parameter", function (assert) {
        var sUrl = "/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked?_requestFrom=ovp_internal";
        var sExpectedUrl = "/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked";
        assert.ok(BatchHelper._removeQueryParam(sUrl, "_requestFrom") === sExpectedUrl, "_requestFrom parameter is removed from url parameters");
    });

    QUnit.test("BatchHelper Utility - _removeQueryParam, remove requested query parameter from card binding url when there are multiple parameters, remove first parameter and correct ? and & position", function (assert) {
        var sUrl = "/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked?$select=Sales%2cSales_CURRENCY&_requestFrom=ovp_internal";
        var sExpectedUrl = "/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked?_requestFrom=ovp_internal";
        assert.ok(BatchHelper._removeQueryParam(sUrl, "$select") === sExpectedUrl, "$select parameter is removed from url parameters");
    });

    QUnit.test("BatchHelper Utility - _getQueryParam, get requested query parameter(format=>key=value)", function (assert) {
        var sUrl = "/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked?$select=Sales%2cSales_CURRENCY&_requestFrom=ovp_internal";
        assert.ok(BatchHelper._getQueryParam(sUrl, "$select") === "$select=Sales%2cSales_CURRENCY", "Received the correct value for $select");
    });

    QUnit.test("BatchHelper - enhanceHeaderAndContentURL, _headerDataUrl and _contentDataUrl are unchanged when _mandatoryODataParameters and _mandatoryODataFilters are both empty", function (assert) {
        var oCardConfig = {
            "configuration": {
                "parameters": {
                    "_mandatoryODataParameters": { 
                        "value": [] 
                    },
                    "_mandatoryODataFilters": { 
                        "value": [] 
                    },
                    "_headerDataUrl": {
                        "value": "SalesShareColumnStacked?$select=Sales%2cSales_CURRENCY&$skip=0&$top=1"
                    },
                    "_contentDataUrl": {
                        "value": "SalesShareColumnStacked?$orderby=Region%20asc&$select=StatusCriticality%2cRegion%2cTotalSales%2cTotalSales_CURRENCY&$skip=0&$top=20"
                    }
                }
            }
        };
        var sExpectedHeaderDataUrl = "SalesShareColumnStacked?$select=Sales%2cSales_CURRENCY&$skip=0&$top=1";
        var sExpectedContentDataUrl = "SalesShareColumnStacked?$orderby=Region%20asc&$select=StatusCriticality%2cRegion%2cTotalSales%2cTotalSales_CURRENCY&$skip=0&$top=20"
        BatchHelper.enhanceHeaderAndContentURL(oCardConfig);
        assert.ok(oCardConfig.configuration.parameters._headerDataUrl.value === sExpectedHeaderDataUrl, "Header Data Url should be unchanged");
        assert.ok(oCardConfig.configuration.parameters._contentDataUrl.value === sExpectedContentDataUrl, "Content Data Url should be unchanged");
    });

    QUnit.test("BatchHelper - enhanceHeaderAndContentURL, _headerDataUrl and _contentDataUrl should be set to empty string when one of _mandatoryODataParameters or _mandatoryODataFilters has a value but associated parameter values are empty, _mandatoryODataParameters value is empty", function (assert) {
        var oCardConfig = {
            "configuration": {
                "parameters": {
                    "P_ExchangeRateType": {
                        "value": "",
                        "type": "string"
                    },
                    "_mandatoryODataParameters": { 
                        "value": [
                            "P_ExchangeRateType"
                        ] 
                    },
                    "_mandatoryODataFilters": { 
                        "value": [] 
                    },
                    "_headerDataUrl": {
                        "value": "SalesShareColumnStacked?$select=Sales%2cSales_CURRENCY&$skip=0&$top=1"
                    },
                    "_contentDataUrl": {
                        "value": "SalesShareColumnStacked?$orderby=Region%20asc&$select=StatusCriticality%2cRegion%2cTotalSales%2cTotalSales_CURRENCY&$skip=0&$top=20"
                    }
                }
            }
        };
        BatchHelper.enhanceHeaderAndContentURL(oCardConfig);
        assert.ok(oCardConfig.configuration.parameters._headerDataUrl.value === "", "Header Data Url should be empty");
        assert.ok(oCardConfig.configuration.parameters._contentDataUrl.value === "", "Content Data Url should be empty");
    });

    QUnit.test("BatchHelper - enhanceHeaderAndContentURL, _headerDataUrl and _contentDataUrl should be set to empty string when one of _mandatoryODataParameters or _mandatoryODataFilters has a value but associated parameter values are empty, _mandatoryODataFilters value is empty", function (assert) {
        var oCardConfig = {
            "configuration": {
                "parameters": {
                    "ExchangeRateType": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"ExchangeRateType\",\"Ranges\":[]}]}",
                        "type": "string"
                    },
                    "_mandatoryODataParameters": { 
                        "value": [] 
                    },
                    "_mandatoryODataFilters": { 
                        "value": [
                            "ExchangeRateType"
                        ] 
                    },
                    "_headerDataUrl": {
                        "value": "SalesShareColumnStacked?$select=Sales%2cSales_CURRENCY&$skip=0&$top=1"
                    },
                    "_contentDataUrl": {
                        "value": "SalesShareColumnStacked?$orderby=Region%20asc&$select=StatusCriticality%2cRegion%2cTotalSales%2cTotalSales_CURRENCY&$skip=0&$top=20"
                    }
                }
            }
        };
        BatchHelper.enhanceHeaderAndContentURL(oCardConfig);
        assert.ok(oCardConfig.configuration.parameters._headerDataUrl.value === "", "Header Data Url should be empty");
        assert.ok(oCardConfig.configuration.parameters._contentDataUrl.value === "", "Content Data Url should be empty");
    });

    QUnit.test("BatchHelper - getBatchObject, Add _contentDataUrl to sap.card configuration, when KPI Annotation is missing", function (assert) {
        var oCardDefinition = {
            "entitySet": {
                "name": "SalesShareColumnStacked"
            },
            "cardComponentData": {
                "settings": {
                    title: "Sales by Country and Region",
                    subTitle: "Sales by Country and Region",

                }
            }
        };
        var oConfigParams = {
            parameters: {}
        };
        var getRequestUrlAndEntityInfoStub = sinon.stub(BatchHelper, "_getRequestUrlAndEntityInfo").returns({
            sPath: "SalesShareColumnStacked?$orderby=Region%20asc",
            _entitySet: {
                value: "SalesShareColumnStacked"
            },
            _urlSuffix: {
                value: ""
            }
        });

        var sExpectedContentDataUrl = "SalesShareColumnStacked?$orderby=Region%20asc";
        var oBatch= BatchHelper.getBatchObject(oCardDefinition, oConfigParams);
        assert.equal(oConfigParams.parameters._contentDataUrl.value, sExpectedContentDataUrl, "Content Data Url value is set");
        assert.equal(oBatch.content.url, sExpectedContentDataUrl, "Batch.content.url value is set")
        getRequestUrlAndEntityInfoStub.restore();
    });

    QUnit.test("BatchHelper - getBatchRequestPath - returns the correct path for a batch call", function (assert) {
        var sPath = "/content/d/results",
            sV4RequestPath = "/content/value",
            oEntityModel = {
                getODataVersion: function () {
                    return "2.0";
                }
            };
        assert.ok(BatchHelper.getBatchRequestPath(sPath, oEntityModel) === sPath, "No change in case of V2");

        oEntityModel.getODataVersion = function () {
            return "4.0";
        };
        assert.ok(BatchHelper.getBatchRequestPath(sPath, oEntityModel) === sV4RequestPath, "correct batch request path is returned");
    });

    QUnit.test("BatchHelper - getBatchResultCount - returns the correct count for a batch call", function (assert) {
        var sCountPath = "/content/d/__count",
            sV4RequestCountPath = "/content/@odata.count",
            oEntityModel = {
                getODataVersion: function () {
                    return "2.0";
                }
            };
        assert.ok(BatchHelper.getBatchResultCount(sCountPath, oEntityModel) === sCountPath, "No change in case of V2");

        oEntityModel.getODataVersion = function () {
            return "4.0";
        };
        assert.ok(BatchHelper.getBatchResultCount(sCountPath, oEntityModel) === sV4RequestCountPath, "correct batch request count is returned");
    });

    QUnit.test("BatchHelper - _getRequestUrlAndEntityInfo - validate path and entity info for Table card", function (assert) {
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
                getGlobalFilter: function() {
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
            var oConfigParams = {
                parameters : {
                    _mandatoryODataFilters: {
                        value: []
                    }
                }
            };
            var oResult = {
                "sPath": "SalesOrderSet?$inlinecount=allpages&$skip=0&$top=13",
                "_entitySet": {
                    "value": "SalesOrderSet"
                },
                "_urlSuffix": {
                    "value": ""
                }
            };
            assert.deepEqual(BatchHelper._getRequestUrlAndEntityInfo(oCardDefinition, oConfigParams, false), oResult, "Returns the correct URL and entity for the card");

            fnDone();
            mockservers.close();
        });
    });

});
