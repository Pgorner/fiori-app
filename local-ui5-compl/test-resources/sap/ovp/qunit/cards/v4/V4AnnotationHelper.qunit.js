/*global QUnit*/

sap.ui.define([
    "sap/ovp/cards/v4/V4AnnotationHelper",
    "sap/ui/model/odata/v4/AnnotationHelper",
    "test-resources/sap/ovp/Mockserver/MockServerHelper",
    "sap/ovp/cards/AnnotationHelper",
    "sap/ui/core/format/DateFormat"
], function (V4AnnotationHelper, OdataAnnotationHelper, MockServerHelper, CardAnnotationHelper, DateFormat) {
    "use strict";

    var oView, oModel, oContext;
    var oConfig;
    var fnAddViewData;

    QUnit.module("sap.ovp.qunit.cards.v4.V4AnnotationHelper", {
        beforeEach: function () {
            oConfig = {
                template: "sap.ovp.cards.v4.list",
                id: "card002",
                settings: {
                    title: "Extended List Card With Bar",
                    subTitle: "V4 card",
                    listType: "extended",
                    listFlavor: "bar",
                    entitySet: "Books",
                    showFilterInHeader: true,
                    valueSelectionInfo: "value selection",
                    tabs: [
                        {
                            annotationPath: "com.sap.vocabularies.UI.v1.LineItem#View4",
                            dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#header",
                            identificationAnnotationPath:
                                "com.sap.vocabularies.UI.v1.Identification#navigationIntentBased",
                            value: "With KPI",
                        },
                        {
                            annotationPath: "com.sap.vocabularies.UI.v1.LineItem#View4",
                            identificationAnnotationPath:
                                "com.sap.vocabularies.UI.v1.Identification#navigationIntentBased",
                            value: "Without KPI",
                        },
                        {
                            selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#View1",
                            identificationAnnotationPath:
                                "com.sap.vocabularies.UI.v1.Identification#navigationIntentBased",
                            value: "Filter with ID 201",
                        },
                    ],
                },
            };
            fnAddViewData = function () {
                oView = MockServerHelper.getCardData()["oView"];
                oModel = MockServerHelper.getCardData()["oModel"];
                oView.getSetting = function (sPropertyName) {
                    return sPropertyName === "ovpCardProperties" ? oModel : false;
                };
                oModel.getProperty = function (sPropertyName) {
                    if (sPropertyName === "/metaModel") {
                        return oModel.getMetaModel();
                    } else if (sPropertyName === "/entityType") {
                        var oEntityType = oModel.getMetaModel().getObject("/CatalogService.Books");
                        oEntityType.$Type = "CatalogService.Books";
                        return oEntityType;
                    } else if (sPropertyName === "contentFragment") {
                        return "sap.ovp.cards.v4.list";
                    } else if (sPropertyName === "/entitySet") {
                        return "Books";
                    } else if (sPropertyName === "/parameters") {
                        return undefined;
                    }
                };
                oView.getPath = function () {
                    return "#View4";
                };
                oContext = {
                    getSetting: function (sKey) {
                        return sKey === "ovpCardProperties" ? oModel : false;
                    },
                    getModel: function () {
                        return undefined;
                    },
                    getPath: function () {
                        return undefined;
                    },
                    getInterface: function (Key) {
                        if (Key === 0) {
                            return {
                                getSetting: function (sKey) {
                                    return sKey === "ovpCardProperties" ? oModel : false;
                                },
                                getModel: function () {
                                    return oModel.getMetaModel();
                                },
                                getPath: function () {
                                    return "/CatalogService.Books/@com.sap.vocabularies.UI.v1.LineItem";
                                },
                                getInterface: function (Key) {
                                    throw new Error("composite binding.");
                                },
                            };
                        }
                    },
                };
            };
        },
        afterEach: function () {
            MockServerHelper.closeServer();
        },
    });

    QUnit.test("Table function getLabelForDataItem - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function () {
            var oDataItem = oView
                .getModel()
                .getMetaModel()
                .getObject("/Books/@com.sap.vocabularies.UI.v1.LineItem")[0];
            var cardXml = oView._xContent;
            var iContext = {
                getModel: function() {
                    return {
                        oModel: oView.getModel()
                    }
                },
                getSetting: function(sName) {
                    return oView.getModel(sName);
                }
            };
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(
                CardAnnotationHelper.getLabelForDataItem(iContext, oDataItem) === "Stock",
                "The data label is found for the data item stock"
            );
            
            var oDataPoint = {
                Criticality : {
                    $Path : "stock"
                }
            };
            assert.ok(
                CardAnnotationHelper.formatKPIHeaderState(iContext, oDataPoint) === "{parts: [{path:'stockAgg', type:'sap.ui.model.odata.type.Decimal'}], formatter: 'CardAnnotationhelper.kpiValueCriticality'}",
                "The expression is generated for formatKPIHeaderState."
            );
        };

        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                fnAddViewData();
                fnQunitTest();
                fnDone();
            });
        });
    });

    QUnit.test("Table function colorPaletteForComparisonMicroChart - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function () {
            var aDataItem = oView
                .getModel()
                .getMetaModel()
                .getObject("/Books/@com.sap.vocabularies.UI.v1.LineItem");
            assert.ok(
                CardAnnotationHelper.colorPaletteForComparisonMicroChart(oView, aDataItem) ===
                "sapUiChartPaletteQualitativeHue1",
                "The color palette for chart is sapUiChartPaletteQualitativeHue1"
            );
        };
        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                fnAddViewData();
                fnQunitTest();
                fnDone();
            });
        });
    });

    QUnit.test("Table function formatField - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function () {
            var oDataItem = oView
                .getModel()
                .getMetaModel()
                .getObject("/Books/@com.sap.vocabularies.UI.v1.LineItem")[1];
            assert.ok(
                V4AnnotationHelper.formatField(oContext, oDataItem) === "{salary}",
                "The formatField function is executed and the binding string is formed correctly."
            );
        };
        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                fnAddViewData();
                fnQunitTest();
                fnDone();
            });
        });
    });

    QUnit.test("Table function checkFilterPreference - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function () {
            oModel.getData = function () {
                return {
                    tabs: [{}, { mFilterPreference: false }, {}],
                    selectedKey: 2,
                };
            };
            assert.ok(
                CardAnnotationHelper.checkFilterPreference(oModel) === false,
                "checkFilterPreference function has been executed successfully."
            );
        };
        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                fnAddViewData();
                fnQunitTest();
                fnDone();
            });
        });
    });
    
    QUnit.test("Table function formatItems - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function () {
            var oEntitySet = oView.getModel().getMetaModel().getObject("/Books");
            assert.ok(
                V4AnnotationHelper.formatItems(oContext, oEntitySet) ===
                "{path: '/Books', length: 5, parameters: {$count:true}}",
                "The formatItems method is called and binding string is formed correctly."
            );
        };
        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                fnAddViewData();
                fnQunitTest();
                fnDone();
            });
        });
    });

    QUnit.test("Table function formThePathForTrendIcon - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function (oContext, oDataPoint) {
            var sResult = CardAnnotationHelper.formThePathForTrendIcon(oContext, oDataPoint);
            assert.ok(
                sResult ===
                `{parts: [{path:'stockAgg', type:'sap.ui.model.odata.type.Decimal'},{value:{"referenceValue":"1000","downDifference":10,"upDifference":50,"bIsRefValBinding":false,"bIsDownDiffBinding":false,"bIsUpDiffBinding":false,"bODataV4":true}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.formatTrendIcon'}`,
                "The formThePathForTrendIcon method is called and binding string is formed correctly."
            );
        };
        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oDataPoint = oView
                    .getModel()
                    .getMetaModel()
                    .getObject("/CatalogService.Books/stock@com.sap.vocabularies.UI.v1.DataPoint#header");
                fnAddViewData();
                var oContext = {
                    getSetting: function (sKey) {
                        return sKey === "ovpCardProperties" ? oModel : false;
                    },
                    getModel: function () {
                        return {
                            oModel: oView.getModel()
                        };
                    },
                    getPath: function () {
                        return "/CatalogService.Books/@com.sap.vocabularies.UI.v1.DataPoint#header";
                    },
                    getInterface: function (Key) { },
                };
                fnQunitTest(oContext, oDataPoint);
                fnDone();
            });
        });
    });

    QUnit.test("Table function getAggregateNumber - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function (oContext, oDataPoint, oEntitySet) {
            var sResult = V4AnnotationHelper.getAggregateNumber(oContext, oEntitySet, oDataPoint);
            assert.ok(
                sResult ===
                "{path: '/Books', length: 1, parameters:{'$$aggregation' : {'aggregate' : {'stockAgg' : { 'name' : 'stock', 'with' : 'sum'}}}}}",
                "The getAggregateNumber method is called and binding string is formed correctly."
            );
        };
        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oDataPoint = oView
                    .getModel()
                    .getMetaModel()
                    .getObject("/CatalogService.Books/stock@com.sap.vocabularies.UI.v1.DataPoint#header");
                var oEntitySet = oView.getModel().getMetaModel().getObject("/Books");
                fnAddViewData();
                oContext = {
                    getSetting: function (sKey) {
                        return sKey === "ovpCardProperties" || sKey === "dataModel" ? oModel : false;
                    },
                    getModel: function (sKey) {
                        return oModel.getMetaModel();
                    },
                    getPath: function () {
                        return undefined;
                    },
                    getInterface: function (Key) {
                        if (Key === 0) {
                            return {
                                getSetting: function (sKey) {
                                    return sKey === "ovpCardProperties" ? oModel : false;
                                },
                                getModel: function () {
                                    return oModel.getMetaModel();
                                },
                                getPath: function () {
                                    return "/Books";
                                },
                                getInterface: function (Key) {
                                    throw new Error("composite binding.");
                                },
                            };
                        }
                    },
                };
                fnQunitTest(oContext, oDataPoint, oEntitySet);
                fnDone();
            });
        });
    });

    QUnit.test("Table function getAggregateNumber - V4AnnotationHelper, when measureAggregate is given in manifest with or without tabs", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oDataPoint = {
                    "$Type": "com.sap.vocabularies.UI.v1.DataPointType",
                    "Title": "stock",
                    "Value": {
                        "$Path": "stock"
                    },
                    "Description": {
                        "$Path": "title"
                    },
                    "CriticalityCalculation": {
                        "$Type": "com.sap.vocabularies.UI.v1.CriticalityCalculationType",
                        "ImprovementDirection": {
                            "$EnumMember": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
                        },
                        "ToleranceRangeLowValue": "100",
                        "DeviationRangeLowValue": "2000"
                    },
                    "ValueFormat": {
                        "$Type": "com.sap.vocabularies.UI.v1.NumberFormat",
                        "ScaleFactor": 1000,
                        "NumberOfFractionalDigits": 1
                    },
                    "TrendCalculation": {
                        "$Type": "com.sap.vocabularies.UI.v1.TrendCalculationType",
                        "ReferenceValue": "1000",
                        "UpDifference": {
                            "$Decimal": "50"
                        },
                        "StrongUpDifference": {
                            "$Decimal": "10"
                        },
                        "DownDifference": {
                            "$Decimal": "10"
                        },
                        "StrongDownDifference": {
                            "$Decimal": "20"
                        }
                    }
                };
                var oEntitySet = oView.getModel().getMetaModel().getObject("/Books");
                fnAddViewData();
                oContext = {
                    getSetting: function (sKey) {
                        if (sKey === "ovpCardProperties") {
                            return {
                                getProperty: function(sKey) {
                                    if (sKey === "/measureAggregate") {
                                       return { stock: 'average' };
                                    } else if (sKey === "/metaModel") {
                                        return oModel.getMetaModel();
                                    } else if (sKey === "/entityType") {
                                        var oEntityType = oModel.getMetaModel().getObject("/CatalogService.Books");
                                        oEntityType.$Type = "CatalogService.Books";
                                        return oEntityType;
                                    } else if (sKey === "contentFragment") {
                                        return "sap.ovp.cards.v4.list";
                                    } else if (sKey === "/entitySet") {
                                        return "Books";
                                    } else if (sKey === "/parameters") {
                                        return undefined;
                                    } 
                                }
                            }
                        } else if (sKey === "dataModel") {
                            return oModel;
                        }
                    },
                    getModel: function (sKey) {
                        return oModel.getMetaModel();
                    },
                    getPath: function () {
                        return undefined;
                    },
                    getInterface: function (Key) {
                        if (Key === 0) {
                            return {
                                getSetting: function (sKey) {
                                    return sKey === "ovpCardProperties" ? oModel : false;
                                },
                                getModel: function () {
                                    return oModel.getMetaModel();
                                },
                                getPath: function () {
                                    return "/Books";
                                },
                                getInterface: function (Key) {
                                    throw new Error("composite binding.");
                                },
                            };
                        }
                    },
                };
                var sResult = V4AnnotationHelper.getAggregateNumber(oContext, oEntitySet, oDataPoint);
                assert.ok(
                    sResult ===
                    "{path: '/Books', length: 1, parameters:{'$$aggregation' : {'aggregate' : {'stockAgg' : { 'name' : 'stock', 'with' : 'average'}}}}}",
                    "The getAggregateNumber method is called and binding string is formed correctly."
                );    
                fnDone();
            });
        });
    });

    QUnit.test("Function getAggregateNumber - V4AnnotationHelper, when aggregation is from cds", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oDataPoint = {
                    "$Type": "com.sap.vocabularies.UI.v1.DataPointType",
                    "Title": "stock",
                    "Value": {
                        "$Path": "stock"
                    },
                    "Description": {
                        "$Path": "title"
                    },
                    "CriticalityCalculation": {
                        "$Type": "com.sap.vocabularies.UI.v1.CriticalityCalculationType",
                        "ImprovementDirection": {
                            "$EnumMember": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
                        },
                        "ToleranceRangeLowValue": "100",
                        "DeviationRangeLowValue": "2000"
                    },
                    "ValueFormat": {
                        "$Type": "com.sap.vocabularies.UI.v1.NumberFormat",
                        "ScaleFactor": 1000,
                        "NumberOfFractionalDigits": 1
                    },
                    "TrendCalculation": {
                        "$Type": "com.sap.vocabularies.UI.v1.TrendCalculationType",
                        "ReferenceValue": "1000",
                        "UpDifference": {
                            "$Decimal": "50"
                        },
                        "StrongUpDifference": {
                            "$Decimal": "10"
                        },
                        "DownDifference": {
                            "$Decimal": "10"
                        },
                        "StrongDownDifference": {
                            "$Decimal": "20"
                        }
                    }
                };
                var oEntitySet = oView.getModel().getMetaModel().getObject("/Books");
                fnAddViewData();
                oContext = {
                    getSetting: function (sKey) {
                        if (sKey === "ovpCardProperties") {
                            return {
                                getProperty: function(sKey) {
                                    if (sKey === "/metaModel") {
                                        return oModel.getMetaModel();
                                    } else if (sKey === "/entityType") {
                                        var oEntityType = oModel.getMetaModel().getObject("/CatalogService.Books");
                                        oEntityType.$Type = "CatalogService.Books";
                                        return oEntityType;
                                    } else if (sKey === "contentFragment") {
                                        return "sap.ovp.cards.v4.list";
                                    } else if (sKey === "/entitySet") {
                                        return "Books";
                                    } else if (sKey === "/parameters") {
                                        return undefined;
                                    } 
                                }
                            }
                        } else if (sKey === "dataModel") {
                            return oModel;
                        }
                    },
                    getModel: function (sKey) {
                        return oModel.getMetaModel();
                    },
                    getPath: function () {
                        return undefined;
                    },
                    getInterface: function (Key) {
                        if (Key === 0) {
                            return {
                                getSetting: function (sKey) {
                                    return sKey === "ovpCardProperties" ? oModel : false;
                                },
                                getModel: function () {
                                    return oModel.getMetaModel();
                                },
                                getPath: function () {
                                    return "/Books";
                                },
                                getInterface: function (Key) {
                                    throw new Error("composite binding.");
                                },
                            };
                        }
                    },
                };
                var sResult = V4AnnotationHelper.getAggregateNumber(oContext, oEntitySet, oDataPoint);
                assert.ok(
                    sResult ===
                    "{path: '/Books', length: 1, parameters:{'$$aggregation' : {'aggregate' : {'stockAgg' : { 'name' : 'stock', 'with' : 'sum'}}}}}",
                    "The getAggregateNumber method is called and binding string is formed correctly."
                );    
                fnDone();
            });
        });
    });

    QUnit.test("Table function getCardSelections - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function (oModel) {
            var sResult = CardAnnotationHelper.getCardSelections(oModel, true);
            assert.ok(
                sResult.parameters.length === 0,
                "The getCardSelections method is called and Parameter array is empty."
            );
            assert.ok(sResult.filters.length === 0, "The getCardSelections method is called and filter array is empty.");
        };

        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                fnAddViewData();
                fnQunitTest(oView.getModel());
                fnDone();
            });
        });
    });

    QUnit.test("Table function removeDuplicateDataField - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function (oView) {
            var oContext = oView
                .getModel()
                .getMetaModel()
                .getContext("/CatalogService.Books/@com.sap.vocabularies.UI.v1.LineItem#TableView");
            var sResult = CardAnnotationHelper.removeDuplicateDataField(oContext);
            assert.ok(
                sResult === "/CatalogService.Books/@com.sap.vocabularies.UI.v1.LineItem#TableView",
                "The removeDuplicateDataField method is called and the path formed correctly."
            );
        };

        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                fnAddViewData();
                fnQunitTest(oView);
                fnDone();
            });
        });
    });

    QUnit.test("Table function getCardSorters - V4AnnotationHelper", function (assert) {
        var fnQunitTest = function (oModel) {
            var sResult = CardAnnotationHelper.getCardSorters(oModel, true);
            assert.ok(sResult === undefined, "The getCardSorters method is called.");
        };

        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                fnAddViewData();
                fnQunitTest(oView.getModel());
                fnDone();
            });
        });
    });

    QUnit.test("Table function formatTrendIcon - V4AnnotationHelper", function (assert) {
        var argument = "2,028";
        var oStaticValues = {
            referenceValue: "1000",
            downDifference: 10,
            upDifference: 50,
            bIsRefValBinding: false,
            bIsDownDiffBinding: false,
            bIsUpDiffBinding: false,
            bODataV4: true
        };
        var sResult = CardAnnotationHelper.formatTrendIcon(argument, oStaticValues);
        assert.ok(sResult === "Up", "The method formatTrendIcon is called successfully, The Trend type is UP");

        argument = "1009";
        oStaticValues.upDifference = 1029;
        sResult = CardAnnotationHelper.formatTrendIcon(argument, oStaticValues);
        assert.ok(sResult === "Down", "The method formatTrendIcon is called successfully, The Trend type is Down");

        argument = "2,028.12";
        oStaticValues.upDifference = 50;
        sResult = CardAnnotationHelper.formatTrendIcon(argument, oStaticValues);
        assert.ok(sResult === "Up", "The method formatTrendIcon is called successfully, The Trend type is UP");
    });

    QUnit.test("Table function getGroupID - V4AnnotationHelper", function (assert) {
        assert.ok(
            CardAnnotationHelper.getGroupID(true) === undefined,
            "property is part of selection field, hence true is returned"
        );
        assert.ok(
            CardAnnotationHelper.getGroupID() === "_BASIC",
            "property is not part of selection field, hence false is returned"
        );
        assert.ok(
            CardAnnotationHelper.getGroupID(false) === "_BASIC",
            "property is not part of selection field, hence false is returned"
        );
    });

    QUnit.module("Support for Semantic Date", {
        beforeEach: function () {
            this.oDateSettings = {
                DeliveryDate: {
                    selectedValues: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
                    exclude: true,
                },
                SubmittedDate: {
                    filter: [{ path: "key", contains: "TOMORROW", exclude: false }],
                },
                CreatedDate: {
                    customDateRangeImplementation: "sap.ovp.demo.ext.customDateRangeType",
                },
                LastUpdatedDate: {
                    selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                    exclude: true,
                },
                StartDate: {
                    selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                    exclude: true,
                },
                EndDate: {
                    selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                    exclude: true,
                },
            };
            this.allControlConfiguration = [
                { PropertyPath: "SupplierName" },
                { PropertyPath: "Land1" },
                { PropertyPath: "MaterialName" },
                { PropertyPath: "MaterialGroup" },
                { PropertyPath: "PurchasingCategory" },
                { PropertyPath: "PurchasingGroup" },
                { PropertyPath: "PurchasingOrganization" },
                { PropertyPath: "CurrencyCode" },
                { PropertyPath: "DeliveryDate" },
                { PropertyPath: "CreatedDate" },
                { PropertyPath: "LastUpdatedDate" },
                { PropertyPath: "StartDate", bNotPartOfSelectionField: true },
                { PropertyPath: "EndDate", bNotPartOfSelectionField: true },
            ];
            this.allDateControlConfiguration = [
                { PropertyPath: "DeliveryDate" },
                { PropertyPath: "SubmittedDate" },
                { PropertyPath: "CreatedDate" },
                { PropertyPath: "LastUpdatedDate" },
                { PropertyPath: "StartDate", bNotPartOfSelectionField: true },
                { PropertyPath: "EndDate", bNotPartOfSelectionField: true },
            ];
        },
        afterEach: function () {
            this.oDateSettings = {};
            this.allControlConfiguration = [];
            this.allDateControlConfiguration = [];
        },
    });

    QUnit.test("Table function getConditionTypeForDateProperties - V4AnnotationHelper", function (assert) {
        var oExpectedResult = {
            DeliveryDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: [
                        {
                            path: "key",
                            contains: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
                            exclude: true,
                        },
                    ],
                },
            }),
            SubmittedDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: this.oDateSettings.SubmittedDate.filter,
                },
            }),
            CreatedDate: "sap.ovp.demo.ext.customDateRangeType",
            LastUpdatedDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: [
                        {
                            path: "key",
                            contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                            exclude: true,
                        },
                    ],
                },
            }),
            StartDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: [
                        {
                            path: "key",
                            contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                            exclude: true,
                        },
                    ],
                },
            }),
            EndDate: JSON.stringify({
                module: "sap.ui.comp.config.condition.DateRangeType",
                operations: {
                    filter: [
                        {
                            path: "key",
                            contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
                            exclude: true,
                        },
                    ],
                },
            }),
        },
        bResult;
        for (var i = 0; i < this.allDateControlConfiguration.length; i++) {
            bResult = CardAnnotationHelper.getConditionTypeForDateProperties(
                this.allDateControlConfiguration[i].PropertyPath,
                this.oDateSettings
            );
            assert.ok(bResult === oExpectedResult[this.allDateControlConfiguration[i].PropertyPath]);
        }
    });

    QUnit.test("Annotation Helper - isDateRangeType", function (assert) {
        var oExpectedResult = {
            SupplierName: false,
            Land1: false,
            MaterialName: false,
            MaterialGroup: false,
            PurchasingCategory: false,
            PurchasingGroup: false,
            PurchasingOrganization: false,
            CurrencyCode: false,
            DeliveryDate: true,
            CreatedDate: true,
            LastUpdatedDate: true,
            StartDate: true,
            EndDate: true,
        },
            bResult;
        for (var i = 0; i < this.allControlConfiguration.length; i++) {
            bResult = CardAnnotationHelper.isDateRangeType(
                this.allControlConfiguration[i].PropertyPath,
                this.oDateSettings
            );
            assert.ok(bResult === oExpectedResult[this.allControlConfiguration[i].PropertyPath]);
        }
    });

    QUnit.test("Annotation Helper - criticality2state", function (assert) {
        var oCriticallity = {
            $EnumMember: "Positive",
        };
        var oCriticallity1 = {
            $EnumMember: "Negative",
        };
        var oCriticallity2 = {
            $EnumMember: "Critical",
        };
        var oCriticalityConfigValues = {
            None: "Neutral",
            Negative: "Error",
            Critical: "Critical",
            Positive: "Good",
        };

        var bResult = CardAnnotationHelper._criticality2state(oCriticallity, oCriticalityConfigValues, true);
        var bResult1 = CardAnnotationHelper._criticality2state(oCriticallity1, oCriticalityConfigValues, true);
        var bResult2 = CardAnnotationHelper._criticality2state(oCriticallity2, oCriticalityConfigValues, true);
        assert.ok(bResult === "Good", "Result is Good for positive criticality");
        assert.ok(bResult1 === "Error", "Result is Error for Negative criticality");
        assert.ok(bResult2 === "Critical", "Result is Critical for Critical criticality");
    });

    QUnit.test("Annotation Helper - calculateCriticalityState", function (assert) {
        var sImproveDirection = "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Minimize";
        var sImproveDirection1 = "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize";
        var oCriticalityConfigValues = {
            None: "None",
            Negative: "Error",
            Critical: "Warning",
            Positive: "Success",
        };
        var sResult_1 = CardAnnotationHelper._calculateCriticalityState(
            null,
            sImproveDirection,
            "",
            2000,
            "",
            500,
            oCriticalityConfigValues,
            true
        );
        var sResult_2 = CardAnnotationHelper._calculateCriticalityState(
            null,
            sImproveDirection1,
            2000,
            "",
            500,
            "",
            oCriticalityConfigValues,
            true
        );
        var sResult_3 = CardAnnotationHelper._calculateCriticalityState(
            '1,111.12',
            sImproveDirection1,
            2000,
            "",
            500,
            "",
            oCriticalityConfigValues,
            true
        );
        var sResult_4 = CardAnnotationHelper._calculateCriticalityState(
            '1,111',
            sImproveDirection1,
            2000,
            "",
            500,
            "",
            oCriticalityConfigValues,
            true
        );
        assert.ok(sResult_1 === "Success", "Result is Success for Minimize direction");
        assert.ok(sResult_2 === "Error", "Result is Error for Maximize direction");
        assert.ok(sResult_3 === "Success", "Result is Success for Maximize direction for a string argument in the float format");
        assert.ok(sResult_4 === "Success", "Result is Success for Maximize direction for a string argument in the integer format");
    });

    QUnit.test('format with sap:text or com.sap.vocabularies.Common.v1.Text annotation',function(assert){
        var fnQunitTest = function (oView) {
            var oMetaModel = oView.getModel().getMetaModel();
	        var oEntityType = oView.getModel().getProperty("/entityType");
            var sUnitPath = 'title';
            var sTextPath = 'category';
            var iContext = {
                getModel: function() {
                    return { oModel: oView.getModel() }
                }
            }
            var sResult = CardAnnotationHelper.getSapTextPathForUOM(sUnitPath, oMetaModel, oEntityType, iContext);
            assert.ok(
                sResult.indexOf(sTextPath) === -1, "A UOM property without Text Annotation should not return text path"
            );

            oEntityType[sUnitPath]['@com.sap.vocabularies.Common.v1.Text'] = {$Path: sTextPath};
            var sResult = CardAnnotationHelper.getSapTextPathForUOM(sUnitPath, oMetaModel, oEntityType, iContext);
            assert.ok(
                sResult.indexOf(sTextPath) > -1, "A UOM property with Text Annotation should return Text path"
            );
        };

        assert.ok(true, "Mockserver starting");
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                fnAddViewData();
                fnQunitTest(oView);
                fnDone();
            });
        });
    });

    QUnit.test("Table function generatePathForField - V4AnnotationHelper", function (assert) {
        var aParts = ['stockAgg'];
        var sFormatterName = 'CardAnnotationhelper.KpiValueFormatter';
        var oStaticValues = {
            NumberOfFractionalDigits: 2, 
            percentageAvailable: false
        };
        var sResult = CardAnnotationHelper._generatePathForField(aParts, sFormatterName, oStaticValues, "String");
        assert.ok(sResult === `{parts:[{path: 'stockAgg',type:'sap.ui.model.odata.type.String'}, {value:{"NumberOfFractionalDigits":2,"percentageAvailable":false}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.KpiValueFormatter'}`);
        sResult =  CardAnnotationHelper._generatePathForField(aParts, sFormatterName, oStaticValues);
        assert.ok(sResult === `{parts:[{path: 'stockAgg'}, {value:{"NumberOfFractionalDigits":2,"percentageAvailable":false}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.KpiValueFormatter'}`);
    });

    QUnit.test("date function generatePathForField with useInternalValues - V4AnnotationHelper", function (assert) {
        var aParts = ['createdAt'];
        var dateFormat = {
            relative: true,
            relativeScale: "auto"
        };
        var sFormatterName = 'CardAnnotationhelper.formatDate';
        var oStaticValues = {
            dateFormat: dateFormat,
            bUTC: false
        };
        var sResult = CardAnnotationHelper._generatePathForField(aParts, sFormatterName, oStaticValues, "", true);
        assert.ok(sResult === `{parts:[{path: 'createdAt'}, {value:{"dateFormat":{"relative":true,"relativeScale":"auto"},"bUTC":false}, model: 'ovpCardProperties'}], useInternalValues:true, formatter: 'CardAnnotationhelper.formatDate'}`);
        sResult = CardAnnotationHelper._generatePathForField(aParts, sFormatterName, oStaticValues, "", false);
        assert.ok(sResult === `{parts:[{path: 'createdAt'}, {value:{"dateFormat":{"relative":true,"relativeScale":"auto"},"bUTC":false}, model: 'ovpCardProperties'}], formatter: 'CardAnnotationhelper.formatDate'}`);
    });

    QUnit.test("Table function KpiValueFormatter - V4AnnotationHelper", function (assert) {
        var sArg1 = "2028";
        var oArg2 = {
            NumberOfFractionalDigits: 2, 
            percentageAvailable: false,
            bODataV4: true
        };
        var sResult = CardAnnotationHelper.KpiValueFormatter(sArg1, oArg2);
        assert.ok(sResult === `2.03K`);
        sArg1 = "2.028";
        oArg2 = {
            NumberOfFractionalDigits: 2, 
            percentageAvailable: false,
            bODataV4: true
        };
        sResult = CardAnnotationHelper.KpiValueFormatter(sArg1, oArg2);
        assert.ok(sResult === `2.03`);
        sArg1 = "1.123";
        oArg2 = {
            NumberOfFractionalDigits: 1, 
            percentageAvailable: false,
            bODataV4: true
        };
        sResult = CardAnnotationHelper.KpiValueFormatter(sArg1, oArg2);
        assert.ok(sResult === `1.1`);
    });

    QUnit.test("getTextArrangementBinding - V4AnnotationHelper, return property binding path if text arrangement does not exists.", function (assert) {
        var oContext = {
            getPath: function() {},
            getInterface: function() {},
        };
        var oEntity = {
            "$kind": "EntitySet",
            "$Type": "CatalogService.Books"
        };
        var oPropertyMetadata = {
            "@com.sap.vocabularies.Analytics.v1.Dimension": true,
            "@com.sap.vocabularies.Common.v1.Label": "Title",
            "@com.sap.vocabularies.UI.v1.DataFieldDefault": {
                "$Type": "com.sap.vocabularies.UI.v1.DataField",
                "Value": {
                    "$Path": "title"
                }
            },
            "$kind": "Property",
            "$Type": "Edm.String",
            "annotations": {
                "@com.sap.vocabularies.Analytics.v1.Dimension": true,
                "@com.sap.vocabularies.Common.v1.Label": "Title",
                "@com.sap.vocabularies.UI.v1.DataFieldDefault": {
                    "$Type": "com.sap.vocabularies.UI.v1.DataField",
                    "Value": {
                        "$Path": "title"
                    }
                }
            }
        };
        var sPropertyBindingPath = "{title}";
        var sTextArrangementBinding = V4AnnotationHelper.getTextArrangementBinding(oContext, oEntity, oPropertyMetadata, sPropertyBindingPath);
        assert.strictEqual(sTextArrangementBinding, sPropertyBindingPath, "property binding path is returned if text arrangement annotation is missing");
    });
    QUnit.test('getTextArrangementBinding - V4AnnotationHelper, sDescriptionBinding as {conclusionName}', function(assert) {
        var iContext = {
            getInterface: function() {
                return {};
            },
            getPath: function() {
                return '';
            }
        };
        var oEntityType = {
            $Type: 'IssueAndRemediationManagementAnalyticsService.IssuesByConclusion',
            $kind: 'EntitySet'
        };
        var oProperty = {
            $Nullable: false,
            $Type: 'Edm.String',
            $kind: 'Property',
            '@com.sap.vocabularies.Common.v1.Label': 'Conclusion',
            '@com.sap.vocabularies.Common.v1.Text': { $Path: 'conclusionName' },
            '@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement': {
                $EnumMember: 'com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly'
            }
        };
        var sIdBinding = '{conclusion_code}';
        sinon.stub(OdataAnnotationHelper, "format").returns('{conclusionName}');
        var result = V4AnnotationHelper.getTextArrangementBinding(iContext, oEntityType, oProperty, sIdBinding);
    
        assert.equal(result, '{conclusionName}', 'Result should be {conclusionName} because sDescriptionBinding is {conclusionName}');
    });

    QUnit.test ('formatDate should return the correct formatted value when the provided value is in english language', function (assert) {
        var sValue = 'Jul 21, 2024, 4:02:09 PM';
        var oStaticValues = {
            dateFormat: {
                style: 'medium',
            },
            bUTC: false,
        };
        var stubAnnotationHelper = {};
      
        var expectedFormattedDate = 'Jul 21, 2024';
        var result = V4AnnotationHelper.formatDate.call(stubAnnotationHelper, sValue, oStaticValues);
      
        assert.strictEqual(result, expectedFormattedDate, 'Date is getting formatted correctly');
    });

    QUnit.test ('formatDate should return the correct formatted value when the provided value is in chinese language', function (assert) {
        var mockDateFormat = {
          oFormatOptions: {
            style: 'medium',
            relativeScale: 'day',
            relativeStyle: 'wide',
            calendarType: 'Gregorian',
            pattern: 'y年M月d日',
          },
          oLocale: {
            oLanguageTag: {
              language: 'zh',
              script: null,
              region: 'CN'
            },
            sLocaleId: 'zh-CN',
            language: 'zh',
            script: null,
            region: 'CN',
            sLanguage: 'zh',
          },
          format: function (date, bUTC) {
            return '2024年7月21日';
          },
        };
        sinon.stub(DateFormat, 'getInstance').returns(mockDateFormat);
        var sValue = '2024年7月21日 16:02:09';
        var oStaticValues = {
            dateFormat: {
                style: 'medium',
            },
            bUTC: false,
        };
        var stubAnnotationHelper = {
            mBindingInfos: {
                text: {
                    binding: {
                        getRawValue: function () {
                            return [
                                '2024-07-21T10:32:09Z',
                                {
                                    dateFormat: {
                                        style: 'medium'
                                    },
                                    bUTC: false
                                }
                            ];
                        }
                    }
                }
            },
        };
        var expectedFormattedDate = '2024年7月21日';
        var result = V4AnnotationHelper.formatDate.call(stubAnnotationHelper, sValue, oStaticValues);
      
        assert.strictEqual(result, expectedFormattedDate, 'Date is getting formatted correctly');
        DateFormat.getInstance.restore();
    });

    QUnit.test ('formatDate should return the correct formatted value when the provided value is in french language', function (assert) {
        var mockDateFormat = {
            oFormatOptions: {
              style: "medium",
              relativeScale: "day",
              relativeStyle: "wide",
              calendarType: "Gregorian",
              pattern: "d MMM y",
            },
            oLocale: {
              oLanguageTag: {
                language: "fr"
              },
              sLocaleId: "fr",
              language: "fr",
              sLanguage: "fr",
            },
            format: function (date, bUTC) {
              return "21 juil. 2024";
            }
        };
        sinon.stub(DateFormat, 'getInstance').returns(mockDateFormat);
        var sValue = '21 juil. 2024, 16:02:09';
        var oStaticValues = {
            dateFormat: {
                style: 'medium',
            },
            bUTC: false,
        };
        var stubAnnotationHelper = {
            mBindingInfos: {
                text: {
                    binding: {
                        getRawValue: function () {
                            return [
                                '2024-07-21T10:32:09Z',
                                {
                                    dateFormat: {
                                        style: 'medium'
                                    },
                                    bUTC: false
                                }
                            ];
                        }
                    }
                }
            },
        };
        var expectedFormattedDate = '21 juil. 2024';
        var result = V4AnnotationHelper.formatDate.call(stubAnnotationHelper, sValue, oStaticValues);
      
        assert.strictEqual(result, expectedFormattedDate, 'Date is getting formatted correctly');
        DateFormat.getInstance.restore();
    });
    
});
