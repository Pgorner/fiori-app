sap.ui.define([
    "sap/ovp/insights/IntegrationCard",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
    "sap/fe/navigation/NavigationHandler",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/insights/helpers/CardAction",
    "sap/ovp/insights/helpers/Batch",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (IntegrationCard, utils, mockservers, SmartFilterBar, oNavigationHandler, CommonUtils, CardActionHelper, BatchHelper, JSONModel, UshellContainer) {
    "use strict";

    QUnit.module("sap.ovp.insights.helpers.CardAction", {
        beforeEach: function () {
            mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
            mockservers.loadMockServer(utils.odataBaseUrl_salesShare, utils.odataRootUrl_salesShare);
        },
        afterEach: function () {
            mockservers.close();
        },
    });

    QUnit.test("Integration Card - getFilterDetails Test the function for a list card", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7_list",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                "filters": {
                    "SupplierName": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"SupplierName\",\"Ranges\":[]}]}",
                        "type": "string",
                        "description": ""
                    },
                    "CurrencyCode": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CurrencyCode\",\"Ranges\":[]}]}",
                        "type": "string",
                        "description": ""
                    },
                    "_relevantODataFilters": {
                        "value": [
                            "SupplierName",
                            "CurrencyCode"
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
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var uiModel = new JSONModel({globalFilterEntityType: "GWSAMPLE_BASIC.GlobalFilters"});

        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            oCardComponentData.mainComponent = oCardController;

            var oGlobalFilter = new SmartFilterBar();
            oGlobalFilter.setModel(oModel);
            oGlobalFilter.setModel(uiModel, "ui");
            oCardComponentData.mainComponent.oGlobalFilter = oGlobalFilter;

            var oCardDefinition = {
                entitySet: oCardController.getEntitySet(),
                entityType: oCardController.getEntityType(),
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };
            var oFilters = IntegrationCard.getFilterDetails(oCardDefinition);
            assert.deepEqual(oFilters,cardTestData.expectedResult, "The filters are generated properly for the given card.");
            fnDone();
        });
    });

    QUnit.test("Integration Card - getFilterDetails Test the function for a Analytical card when getConsiderAnalyticParameter is true", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7_Analytical",
                model: "salesOrder",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier"
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                "filters": {
                    "CurrencyCode": {
                    "description": "",
                    "type": "string",
                    "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CurrencyCode\",\"Ranges\":[]}]}"
                    },
                    "P_DisplayCurrency": {
                    "description": "",
                    "label": "",
                    "type": "string",
                    "value": "EUR"
                    },
                    "P_KeyDate": {
                    "description": "",
                    "label": "",
                    "type": "datetime",
                    "value": ""
                    },
                    "SupplierName": {
                    "description": "",
                    "type": "string",
                    "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"SupplierName\",\"Ranges\":[]}]}"
                    },
                    "_mandatoryODataFilters": {
                    "value": []
                    },
                    "_mandatoryODataParameters": {
                    "value": []
                    },
                    "_relevantODataFilters": {
                    "value": [
                        "SupplierName",
                        "CurrencyCode"
                    ]
                    },
                    "_relevantODataParameters": {
                    "value": [
                        "P_KeyDate",
                        "P_DisplayCurrency"
                    ]
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var uiModel = new JSONModel({globalFilterEntityType: "GWSAMPLE_BASIC.GlobalFilters"});

        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            oCardComponentData.mainComponent = oCardController;

            var oGlobalFilter = new SmartFilterBar();
            oGlobalFilter.setModel(oModel);
            oGlobalFilter.setModel(uiModel, "ui");
            var considerAnalyticalParam = sinon.stub(oGlobalFilter, "getConsiderAnalyticalParameters").returns(true);
            var aAnalyticalParam = sinon.stub(oGlobalFilter, "getAnalyticalParameters").returns(
                [
                    {name: "P_KeyDate", type: "Edm.DateTime", nullable: 'false', precision: '0', "sap:display-format": "Date", _filterRestriction: "single-value"},
                    {name: "P_DisplayCurrency", type: "Edm.String", nullable: 'false', precision: '0', defaultValue: "EUR"},
                    {name: "P_ExchangeRateType", type: "Edm.String", nullable: 'false', precision: '0', defaultValue: "M"}
                ]);

            oCardComponentData.mainComponent.oGlobalFilter = oGlobalFilter;

            oCardController.getCardItemsBinding = function() {
                return {
                    getPath : function() {
                        return "/GlobalFilters(P_KeyDate=,P_DisplayCurrency=%27EUR%27)";
                    }
                }
            };

            var oCardDefinition = {
                entitySet: oCardController.getEntitySet(),
                entityType: oCardController.getEntityType(),
                cardComponentName: "Analytical",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };
            var oFilters = IntegrationCard.getFilterDetails(oCardDefinition);
            assert.deepEqual(oFilters,cardTestData.expectedResult, "The filters are generated properly for the given card.");
            considerAnalyticalParam.restore();
            aAnalyticalParam.restore();
            fnDone();
        });
    });

    QUnit.test("Integration Card - getFilterDetails Test the function for a list card for semantic date range fields in RT Mode", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7_list_SemanticDate",
                model: "salesOrder",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    listType: "extended",
                    entitySet: "SalesOrderSet_Insights",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1"
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                "filters": {
                    "DeliveryDate": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"DeliveryDate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"2023-03-02T00:00:00.000\",\"High\":\"2023-03-02T23:59:59.999\"}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"DeliveryDate\",\"operator\":\"DATE\",\"values\":[\"2023-03-01T18:30:00.000Z\"]}"
                    },
                    "CreatedDate": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CreatedDate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"TODAY\",\"High\":null}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"CreatedDate\",\"operator\":\"TODAY\",\"values\":[]}"
                    },
                    "UpdatedDate": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"UpdatedDate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"2023-03-01T00:00:00.000\",\"High\":\"2023-03-03T23:59:59.999\"}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"UpdatedDate\",\"operator\":\"DATERANGE\",\"values\":[\"2023-02-28T18:30:00.000Z\",\"2023-03-03T18:29:59.999Z\"]}"
                    },
                    "StartDate": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"StartDate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"LASTMONTH\",\"High\":null}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"StartDate\",\"operator\":\"LASTMONTH\",\"values\":[]}"
                    },
                    "EndDate": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"EndDate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"TODAYFROMTO\",\"High\":\"2,3\"}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"EndDate\",\"operator\":\"TODAYFROMTO\",\"values\":[2,3]}"
                    },
                    "DeliveryDate1": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"DeliveryDate1\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"LASTMONTHS\",\"High\":\"2\"}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"DeliveryDate1\",\"operator\":\"LASTMONTHS\",\"values\":[2]}"
                    },
                    "CreatedDate1": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CreatedDate1\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"GE\",\"Low\":\"2023-03-01T00:00:00.000\",\"High\":null}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"CreatedDate1\",\"operator\":\"FROM\",\"values\":[\"2023-02-28T18:30:00.000Z\"]}"
                    },
                    "UpdatedDate1": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"UpdatedDate1\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"LASTQUARTER\",\"High\":null}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"UpdatedDate1\",\"operator\":\"LASTQUARTER\",\"values\":[]}"
                    },
                    "StartDate1": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"StartDate1\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"QUARTER3\",\"High\":null}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"StartDate1\",\"operator\":\"QUARTER3\",\"values\":[]}"
                    },
                    "EndDate1": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"EndDate1\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"LASTWEEK\",\"High\":null}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"EndDate1\",\"operator\":\"LASTWEEK\",\"values\":[]}"
                    },
                    "DeliveryDate2": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"DeliveryDate2\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"NEXTQUARTERS\",\"High\":\"2\"}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"DeliveryDate2\",\"operator\":\"NEXTQUARTERS\",\"values\":[2]}"
                    },
                    "CreatedDate2": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CreatedDate2\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"YEARTODATE\",\"High\":null}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"CreatedDate2\",\"operator\":\"YEARTODATE\",\"values\":[]}"
                    },
                    "UpdatedDate2": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"UpdatedDate2\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"LE\",\"Low\":\"2023-03-22T23:59:59.999\",\"High\":null}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"UpdatedDate2\",\"operator\":\"TO\",\"values\":[\"2023-03-21T18:30:00.000Z\"]}"
                    },
                    "StartDate2": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"StartDate2\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"LASTYEAR\",\"High\":null}]}]}",
                        "type": "datetime",
                        "description": "{\"key\":\"StartDate2\",\"operator\":\"LASTYEAR\",\"values\":[]}"
                    },
                    "EndDate2": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"EndDate2\",\"Ranges\":[]}]}",
                        "type": "datetime",
                        "description": "{\"operator\":\"\",\"values\":[]}"
                    },
                    "CityName": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CityName\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"EU\",\"High\":null}]}]}",
                        "type": "string",
                        "description": ""
                    },
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
                            "DeliveryDate",
                            "CreatedDate",
                            "UpdatedDate",
                            "CityName",
                            "CurrencyCode",
                            "NetAmount",
                            "StartDate",
                            "EndDate",
                            "DeliveryDate1",
                            "CreatedDate1",
                            "UpdatedDate1",
                            "StartDate1",
                            "EndDate1",
                            "DeliveryDate2",
                            "CreatedDate2",
                            "UpdatedDate2",
                            "StartDate2",
                            "EndDate2"
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
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var uiModel = new JSONModel({globalFilterEntityType: "GWSAMPLE_BASIC.GlobalFilters"});

        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            oCardComponentData.mainComponent = oCardController;

            var oGlobalFilter = new SmartFilterBar();
            oGlobalFilter.setModel(oModel);
            oGlobalFilter.setModel(uiModel, "ui");
            var oGetFilterDataStub = sinon.stub(oGlobalFilter, "getFilterData").returns(
                {
                    "$Parameter.P_DisplayCurrency": "EUR",
                    "DeliveryDate": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "DATE",
                                "value1": "2023-03-01T18:30:00.000Z",
                                "value2": null,
                                "key": "DeliveryDate",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2023-03-01T18:30:00.000Z",
                                "value2": "2023-03-02T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "DeliveryDate"
                            }
                        ],
                        "items": []
                    },
                    "CreatedDate": {
                        "conditionTypeInfo": {
                            "name": "procurement.ext.customDateRangeType",
                            "data": {
                                "operation": "TODAY",
                                "value1": null,
                                "value2": null,
                                "key": "CreatedDate",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2023-03-01T18:30:00.000Z",
                                "value2": "2023-03-02T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "CreatedDate"
                            }
                        ],
                        "items": []
                    },
                    "UpdatedDate": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "DATERANGE",
                                "value1": "2023-02-28T18:30:00.000Z",
                                "value2": "2023-03-03T18:29:59.999Z",
                                "key": "UpdatedDate",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2023-02-28T18:30:00.000Z",
                                "value2": "2023-03-03T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "UpdatedDate"
                            }
                        ],
                        "items": []
                    },
                    "CreatedDate1": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "FROM",
                                "value1": "2023-02-28T18:30:00.000Z",
                                "value2": null,
                                "key": "CreatedDate1",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "GE",
                                "value1": "2023-02-28T18:30:00.000Z",
                                "exclude": false,
                                "keyField": "CreatedDate1"
                            }
                        ],
                        "items": []
                    },
                    "CreatedDate2": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "YEARTODATE",
                                "value1": null,
                                "value2": null,
                                "key": "CreatedDate2",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2022-12-31T18:30:00.000Z",
                                "value2": "2023-03-02T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "CreatedDate2"
                            }
                        ],
                        "items": []
                    },
                    "DeliveryDate1": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "LASTMONTHS",
                                "value1": 2,
                                "value2": null,
                                "key": "DeliveryDate1",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2022-12-31T18:30:00.000Z",
                                "value2": "2023-02-28T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "DeliveryDate1"
                            }
                        ],
                        "items": []
                    },
                    "DeliveryDate2": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "NEXTQUARTERS",
                                "value1": 2,
                                "value2": null,
                                "key": "DeliveryDate2",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2023-03-31T18:30:00.000Z",
                                "value2": "2023-09-30T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "DeliveryDate2"
                            }
                        ],
                        "items": []
                    },
                    "EndDate": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "TODAYFROMTO",
                                "value1": 2,
                                "value2": 3,
                                "key": "EndDate",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2023-02-27T18:30:00.000Z",
                                "value2": "2023-03-05T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "EndDate"
                            }
                        ],
                        "items": []
                    },
                    "EndDate1": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "LASTWEEK",
                                "value1": null,
                                "value2": null,
                                "key": "EndDate1",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2023-02-19T18:30:00.000Z",
                                "value2": "2023-02-26T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "EndDate1"
                            }
                        ],
                        "items": []
                    },
                    "StartDate": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "LASTMONTH",
                                "value1": null,
                                "value2": null,
                                "key": "StartDate",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2023-01-31T18:30:00.000Z",
                                "value2": "2023-02-28T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "StartDate"
                            }
                        ],
                        "items": []
                    },
                    "StartDate1": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "QUARTER3",
                                "value1": null,
                                "value2": null,
                                "key": "StartDate1",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2023-06-30T18:30:00.000Z",
                                "value2": "2023-09-30T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "StartDate1"
                            }
                        ],
                        "items": []
                    },
                    "StartDate2": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "LASTYEAR",
                                "value1": null,
                                "value2": null,
                                "key": "StartDate2",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2021-12-31T18:30:00.000Z",
                                "value2": "2022-12-31T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "StartDate2"
                            }
                        ],
                        "items": []
                    },
                    "UpdatedDate1": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "LASTQUARTER",
                                "value1": null,
                                "value2": null,
                                "key": "UpdatedDate1",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "BT",
                                "value1": "2022-09-30T18:30:00.000Z",
                                "value2": "2022-12-31T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "UpdatedDate1"
                            }
                        ],
                        "items": []
                    },
                    "UpdatedDate2": {
                        "conditionTypeInfo": {
                            "name": "sap.ui.comp.config.condition.DateRangeType",
                            "data": {
                                "operation": "TO",
                                "value1": "2023-03-21T18:30:00.000Z",
                                "value2": null,
                                "key": "UpdatedDate2",
                                "calendarType": "Gregorian"
                            }
                        },
                        "ranges": [
                            {
                                "operation": "LE",
                                "value1": "2023-03-22T18:29:59.999Z",
                                "exclude": false,
                                "keyField": "UpdatedDate2"
                            }
                        ],
                        "items": []
                    },
                    "CityName": {
                        "value": null,
                        "ranges": [
                            {
                                "exclude": false,
                                "operation": "EQ",
                                "value1": "EU",
                                "keyField": "CityName",
                                "tokenText": "=EU"
                            }
                        ],
                        "items": []
                    },
                    "_CUSTOM": {
                        "ProductID": "",
                        "SalesOrderID": ""
                    }
                }
            );

            var oGlobalFilterAllItemStub = sinon.stub(oGlobalFilter, "getAllFilterItems").returns([
                { getProperty: function () { return '$Parameter.P_DisplayCurrency' }, getControl: function () { } },
                { getProperty: function () { return 'SupplierName' }, getControl: function () { } },
                { getProperty: function () { return 'Land1' }, getControl: function () { } },
                { getProperty: function () { return 'MaterialName' }, getControl: function () { } },
                { getProperty: function () { return 'MaterialGroup' }, getControl: function () { } },
                { getProperty: function () { return 'PurchasingCategory' }, getControl: function () { } },
                { getProperty: function () { return 'PurchasingGroup' }, getControl: function () { } },
                { 
                    getProperty: function () { 
                        return 'DeliveryDate' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                            return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "DeliveryDate",
                                    "operator": "DATE",
                                    "values": [
                                        "2023-03-01T18:30:00.000Z"
                                    ]
                                }
                            }
                        };
                    }
                },
                { 
                    getProperty: function () { 
                        return 'UpdatedDate' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "UpdatedDate",
                                    "operator": "DATERANGE",
                                    "values": [
                                        "2023-02-28T18:30:00.000Z",
                                        "2023-03-03T18:29:59.999Z"
                                    ]
                                }
                            }
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'CreatedDate' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "CreatedDate",
                                    "operator": "TODAY",
                                    "values": []
                                }
                            }  
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'StartDate' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "StartDate",
                                    "operator": "LASTMONTH",
                                    "values": []
                                };
                            }
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'EndDate' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "EndDate",
                                    "operator": "TODAYFROMTO",
                                    "values": [
                                        2,
                                        3
                                    ]
                                }
                            }
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'DeliveryDate1' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                            return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "DeliveryDate1",
                                    "operator": "LASTMONTHS",
                                    "values": [
                                        2
                                    ]
                                }
                            }
                        };
                    }
                },
                { 
                    getProperty: function () { 
                        return 'UpdatedDate1' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "UpdatedDate1",
                                    "operator": "LASTQUARTER",
                                    "values": []
                                }
                            }
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'CreatedDate1' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "CreatedDate1",
                                    "operator": "FROM",
                                    "values": [
                                        "2023-02-28T18:30:00.000Z"
                                    ]
                                }
                            }  
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'StartDate1' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "StartDate1",
                                    "operator": "QUARTER3",
                                    "values": []
                                }
                            }
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'EndDate1' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "EndDate1",
                                    "operator": "LASTWEEK",
                                    "values": []
                                }
                            }
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'DeliveryDate2' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                            return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "DeliveryDate2",
                                    "operator": "NEXTQUARTERS",
                                    "values": [
                                        2
                                    ]
                                }
                            }
                        };
                    }
                },
                { 
                    getProperty: function () { 
                        return 'UpdatedDate2' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "UpdatedDate2",
                                    "operator": "TO",
                                    "values": [
                                        "2023-03-21T18:30:00.000Z"
                                    ]
                                }
                            }
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'CreatedDate2' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "CreatedDate2",
                                    "operator": "YEARTODATE",
                                    "values": []
                                }
                            }  
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'StartDate2' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {
                                return {
                                    "key": "StartDate2",
                                    "operator": "LASTYEAR",
                                    "values": []
                                };
                            }
                        }
                    }
                },
                { 
                    getProperty: function () { 
                        return 'EndDate2' 
                    }, 
                    getControl: function () { 
                        return { 
                            getMetadata: function () { 
                                return { 
                                    getName: function () { 
                                        return 'sap.m.DynamicDateRange' 
                                    } 
                                }
                            },
                            getValue: function() {},
                            getStandardOptions: function() {
                                return ['DATE', 'DATERANGE', 'YESTERDAY', 'TODAY', 'TOMORROW', 'FIRSTDAYWEEK', 'LASTDAYWEEK', 'FIRSTDAYMONTH', 'LASTDAYMONTH', 'FIRSTDAYQUARTER', 'LASTDAYQUARTER', 'FIRSTDAYYEAR', 'LASTDAYYEAR']
                            }
                        }
                    }
                },
                { getProperty: function () { return 'CityName' }, getControl: function () { } }
            ]);

            var oUIStateStub = sinon.stub(oGlobalFilter, "getUiState").returns({
                getSelectionVariant: function() {
                    return {
                        SelectOptions: [
                            {
                                "PropertyName": "DeliveryDate",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-03-02T00:00:00.000",
                                        "High": "2023-03-02T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "CreatedDate",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-03-02T00:00:00.000",
                                        "High": "2023-03-02T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "UpdatedDate",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-03-01T00:00:00.000",
                                        "High": "2023-03-03T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "CreatedDate1",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "GE",
                                        "Low": "2023-03-01T00:00:00.000",
                                        "High": null
                                    }
                                ]
                            },
                            {
                                "PropertyName": "CreatedDate2",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-01-01T00:00:00.000",
                                        "High": "2023-03-02T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "DeliveryDate1",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-01-01T00:00:00.000",
                                        "High": "2023-02-28T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "DeliveryDate2",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-04-01T00:00:00.000",
                                        "High": "2023-09-30T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "EndDate",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-02-28T00:00:00.000",
                                        "High": "2023-03-05T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "EndDate1",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-02-20T00:00:00.000",
                                        "High": "2023-02-26T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "StartDate",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-02-01T00:00:00.000",
                                        "High": "2023-02-28T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "StartDate1",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2023-07-01T00:00:00.000",
                                        "High": "2023-09-30T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "StartDate2",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2022-01-01T00:00:00.000",
                                        "High": "2022-12-31T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "UpdatedDate1",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "BT",
                                        "Low": "2022-10-01T00:00:00.000",
                                        "High": "2022-12-31T23:59:59.999"
                                    }
                                ]
                            },
                            {
                                "PropertyName": "UpdatedDate2",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "LE",
                                        "Low": "2023-03-22T23:59:59.999",
                                        "High": null
                                    }
                                ]
                            },
                            {
                                "PropertyName": "CityName",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "EQ",
                                        "Low": "EU",
                                        "High": null
                                    }
                                ]
                            },
                            {
                                "PropertyName": "ProductID",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "EQ",
                                        "Low": "",
                                        "High": null
                                    }
                                ]
                            },
                            {
                                "PropertyName": "SalesOrderID",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "EQ",
                                        "Low": "",
                                        "High": null
                                    }
                                ]
                            },
                            {
                                "PropertyName": "$.basicSearch",
                                "Ranges": [
                                    {
                                        "Sign": "I",
                                        "Option": "EQ",
                                        "Low": "",
                                        "High": null
                                    }
                                ]
                            }
                        ]
                    };
                }
            });
            var ovpCardProperties = oView.getModel('ovpCardProperties');
            ovpCardProperties.oData.bInsightRTEnabled = true;

            oCardComponentData.mainComponent.oGlobalFilter = oGlobalFilter;

            var oCardDefinition = {
                entitySet: oCardController.getEntitySet(),
                entityType: oCardController.getEntityType(),
                cardComponentName: "list",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };
            var oFilters = IntegrationCard.getFilterDetails(oCardDefinition);
            assert.deepEqual(oFilters,cardTestData.expectedResult, "The filters are generated correctly for the given card.");
            oGetFilterDataStub.restore();
            oGlobalFilterAllItemStub.restore();
            oUIStateStub.restore();
            fnDone();
        });
    });

    QUnit.test("Integration Card - getFilterDetails Test the function for a list card in DT Mode for card filters having path with '/' format", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7_list_MultiPath",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Multipath"
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                "filters": {
                    "SupplierName": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"SupplierName\",\"Ranges\":[]}]}",
                        "type": "string",
                        "description": ""
                    },
                    "CurrencyCode": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CurrencyCode\",\"Ranges\":[]}]}",
                        "type": "string",
                        "description": ""
                    },
                    "ToBusinessPartner.CompanyName": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"ToBusinessPartner.CompanyName\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"SAP\",\"High\":null},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"SAP AG\",\"High\":null}]}]}",
                        "type": null,
                        "description": ""
                    },
                    "_relevantODataFilters": {
                        "value": [
                            "SupplierName",
                            "CurrencyCode",
                            "ToBusinessPartner.CompanyName"
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
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var uiModel = new JSONModel({globalFilterEntityType: "GWSAMPLE_BASIC.GlobalFilters"});

        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            oCardComponentData.mainComponent = oCardController;

            var oGlobalFilter = new SmartFilterBar();
            oGlobalFilter.setModel(oModel);
            oGlobalFilter.setModel(uiModel, "ui");
            var oOwnerComponent =  oCardController.getOwnerComponent();
            var oRouterStub = sinon.stub(oOwnerComponent, "getRouter").returns({});
            var oNavigationHandlerStub = sinon.stub(CommonUtils, "getNavigationHandler").returns(new oNavigationHandler(oCardController));

            oCardComponentData.mainComponent.oGlobalFilter = oGlobalFilter;

            var oCardDefinition = {
                entitySet: oCardController.getEntitySet(),
                entityType: oCardController.getEntityType(),
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };
            var oFilters = IntegrationCard.getFilterDetails(oCardDefinition);
            assert.deepEqual(oFilters,cardTestData.expectedResult, "The filters are generated properly for the given card.");
            oNavigationHandlerStub.restore();
            oRouterStub.restore();
            fnDone();
        });
    });

    QUnit.test("Integration Card - getFilterDetails Test the function for Range Filters for which the property is potentailly sensitive", function (assert) {
        var cardTestData = {
            card: {
                id: "card_6",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#RangeFilter_Insight"
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                "filters": {
                    "SupplierName": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"SupplierName\",\"Ranges\":[]}]}",
                        "type": "string",
                        "description": ""
                    },
                    "CurrencyCode": {
                        "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CurrencyCode\",\"Ranges\":[]}]}",
                        "type": "string",
                        "description": ""
                    },
                    "_relevantODataFilters": {
                        "value": [
                            "SupplierName",
                            "CurrencyCode"
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
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var uiModel = new JSONModel({globalFilterEntityType: "GWSAMPLE_BASIC.GlobalFilters"});

        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            oCardComponentData.mainComponent = oCardController;

            var oGlobalFilter = new SmartFilterBar();
            oGlobalFilter.setModel(oModel);
            oGlobalFilter.setModel(uiModel, "ui");
            var oOwnerComponent =  oCardController.getOwnerComponent();
            var oRouterStub = sinon.stub(oOwnerComponent, "getRouter").returns({});
            var oNavigationHandlerStub = sinon.stub(CommonUtils, "getNavigationHandler").returns(new oNavigationHandler(oCardController));

            oCardComponentData.mainComponent.oGlobalFilter = oGlobalFilter;

            var oCardDefinition = {
                entitySet: oCardController.getEntitySet(),
                entityType: oCardController.getEntityType(),
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };
            var oFilters = IntegrationCard.getFilterDetails(oCardDefinition);
            assert.deepEqual(oFilters,cardTestData.expectedResult, "The filters are generated properly for the given card, Price is not a part of filters as it is a range filter and potentially sensitive property.");
            oNavigationHandlerStub.restore();
            oRouterStub.restore();
            fnDone();
        });
    });

    QUnit.test("Integration Card - UpdateManifestStateValue Test the function for list/table card when customParams is enabled", function (assert) {
        var cardTestData = {
            card: {
                id: "card_61",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                    customParams: "getParameters",
                    staticParameters: {
                        "name": "Abhishek",
                        "surname": "Waghela"
                    },
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1"
                },
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
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };
            var oEnhanceHeaderAndContentURLForSemanticDateStub = sinon.stub(BatchHelper, "enhanceHeaderAndContentURLForSemanticDate").returns({});
            var oEnhanceHeaderAndContentURLStub = sinon.stub(BatchHelper, "enhanceHeaderAndContentURL").returns({});
            var ovpCardProperties = oView.getModel('ovpCardProperties');
            ovpCardProperties.oData.bInsightRTEnabled = true;

            var oSapCard = {
                configuration: {
                    parameters: {}
                }
            };

            var GetServiceAsyncStub = sinon.stub(UshellContainer, "getServiceAsync").returns(
                Promise.resolve({
                    getCurrentApplication: function () {
                        return Promise.resolve({
                            getIntent: function () {
                                return Promise.resolve({
                                    semanticObject: "SO",
                                    action: "so_action",
                                    params: {
                                        a: ["b"]
                                    }
                                })
                            }
                        })
                    }
                })
            );
           
            CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            var oManifest = {};
            oManifest["sap.card"] = oSapCard;
            oManifest["sap.app"] = {};
            oManifest["sap.app"]["i18n"] = {};
            IntegrationCard.UpdateManifestDeltaChanges(oManifest, oCardDefinition).then((oUpdatedmanifest) => {
                assert.ok(oUpdatedmanifest["sap.card"].configuration.parameters.headerState.value === '{"ibnTarget":{"semanticObject":"SO","action":"so_action"},"ibnParams":{},"sensitiveProps":[]}', "headerState updaated for given list card under configuration parameters.");
                assert.ok(oUpdatedmanifest["sap.card"].configuration.parameters.lineItemState.value === '{"ibnTarget":{"semanticObject":"SO","action":"so_action"},"ibnParams":{},"sensitiveProps":[]}', "lineItemState updated for given list card under configuration parameters.");
                assert.ok(oUpdatedmanifest["sap.card"].content.item.actions[0].parameters === '{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value})}', "context of the action parameters.");
            })
            oEnhanceHeaderAndContentURLForSemanticDateStub.restore();
            oEnhanceHeaderAndContentURLStub.restore();
            GetServiceAsyncStub.restore();
            fnDone();
        });
    });

    QUnit.test("Integration Card - UpdateManifestStateValue Test the function for Analytical card when customParams is enabled", function (assert) {
        var cardTestData = {
            card: {
                id: "card_11",
                model: "salesOrder",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "ProductSet",
                    customParams: "getParameters",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#reordersoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }

                },
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
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "Analytical",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };
            var oEnhanceHeaderAndContentURLForSemanticDateStub = sinon.stub(BatchHelper, "enhanceHeaderAndContentURLForSemanticDate").returns({});
            var oEnhanceHeaderAndContentURLStub = sinon.stub(BatchHelper, "enhanceHeaderAndContentURL").returns({});
            var ovpCardProperties = oView.getModel('ovpCardProperties');
            ovpCardProperties.oData.bInsightRTEnabled = true;

            var oSapCard = {
                configuration: {
                    parameters: {}
                }
            };

            var GetServiceAsyncStub = sinon.stub(UshellContainer, "getServiceAsync").returns(
                Promise.resolve({
                    getCurrentApplication: function () {
                        return Promise.resolve({
                            getIntent: function () {
                                return Promise.resolve({
                                    semanticObject: "SO",
                                    action: "so_action",
                                    params: {
                                        a: ["b"]
                                    }
                                })
                            }
                        })
                    }
                })
            );
            CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            var oManifest = {};
            oManifest["sap.card"] = oSapCard;
            oManifest["sap.app"] = {};
            oManifest["sap.app"]["i18n"] = {};

            IntegrationCard.UpdateManifestDeltaChanges(oManifest, oCardDefinition).then((oUpdatedmanifest) => {
                assert.ok(oUpdatedmanifest["sap.card"].configuration.parameters.state.value === '{"ibnTarget":{"semanticObject":"SO","action":"so_action"},"ibnParams":{},"sensitiveProps":[]}', "state value updated for given analytical card under configuration parameters.");
                assert.ok(oUpdatedmanifest["sap.card"].content.actions[0].parameters === '{= extension.formatters.getNavigationContext(${parameters>/state/value})}', "context from the action parameters.");
            })
            oEnhanceHeaderAndContentURLForSemanticDateStub.restore();
            oEnhanceHeaderAndContentURLStub.restore();
            GetServiceAsyncStub.restore();
            fnDone();
        });
    });
});