/*global QUnit*/


sap.ui.define([
    "sap/ovp/cards/generic/base/analytical/Utils",
    "test-resources/sap/ovp/Mockserver/MockServerHelper",
    "sap/ovp/cards/v4/V4AnnotationHelper"
], function (V4ChartUtils, MockServerHelper, V4AnnotationHelper) {
    "use strict";

    var oConfig;

    QUnit.module("sap.ovp.qunit.cards.v4.charts.Utils", {
        beforeEach: function () {
            oConfig = {
                model: "CATALOG_MODEL_V4",
                template: "sap.ovp.cards.v4.charts.analytical",
                settings: {
                    title: "Most Popular Products V4",
                    subTitle: "In the last six months",
                    entitySet: "Books",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#donutchart",
                },
            };
        },
        afterEach: function () {
            MockServerHelper.closeServer();
        }
    });

    QUnit.test("V4 chart utils - functions formDimensionPath and cacheODataMetadata.", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oModel = oView.getModel("ovpCardProperties");
                var oEntityType;
                oModel.getProperty = function (sType) {
                    if (sType.indexOf("entityType") > -1) {
                        oEntityType = oView.getModel().getMetaModel().getObject("/CatalogService.Books");
                        oEntityType.property = [];
                        for (var key in oEntityType) {
                            if (
                                oEntityType[key] &&
                                oEntityType[key].hasOwnProperty("$kind") &&
                                oEntityType[key].$kind === "Property"
                            ) {
                                oEntityType.property.push(oEntityType[key]);
                                oEntityType.property[oEntityType.property.length - 1].name = key;
                            }
                        }
                        oEntityType.property.push({
                            type: "com.sap.vocabularies.Common.v1.Label",
                            "sap:text": "labelPath",
                            name: "test",
                            String: "test",
                            test: "test",
                        });
                        oEntityType.property.push({
                            type: "Edm.DateTime",
                            name: "createdDate",
                            String: "created Date",
                        });
                        return oEntityType;
                    }
                };
                assert.ok(
                    V4ChartUtils.formDimensionPath.call(oView, "category") === "{category}",
                    "the dimension path is formed."
                );
                assert.ok(
                    V4ChartUtils.formDimensionPath.call(oView, "test") === "{labelPath}",
                    "the dimension path is formed correctly."
                );
                assert.ok(
                    V4ChartUtils.formDimensionPath.call(oView, "createdDate") ===
                    "{path:'createdDate', formatter: 'sap.ovp.cards.charts.VizAnnotationManager.returnDateFormat'}",
                    "V4 chart utils function formDimensionPath the dimension path is formed correctly for date."
                );

                assert.ok(
                    V4ChartUtils.cacheODataMetadata(oView.getModel()).Books,
                    "entity Books is present after calling cacheODataMetadata."
                );
                fnDone();
            });
        });
    });

    QUnit.test("V4 chart utils - function checkIfDataExistInEvent & getConfig.", function (assert) {
        var oEvent = {
            getSource: function () {
                return {
                    getCurrentContexts: function () {
                        return [
                            {
                                getObject: function () {
                                    return { test: "" };
                                },
                            },
                        ];
                    },
                };
            },
        };
        var oEvent1 = {
            getSource: function () {
                return {
                    getCurrentContexts: function () {
                        return false;
                    },
                };
            },
        };
        var oEvent2 = {
            getSource: function () {
                return {
                    getCurrentContexts: function () {
                        return [];
                    },
                };
            },
        };

        var oEvent3 = {
            getSource: function () {
                return {
                    getCurrentContexts: function () {
                        return undefined;
                    },
                };
            },
        };

        assert.ok(V4ChartUtils.checkIfDataExistInEvent(oEvent), "Data exists in oEvent.");
        assert.ok(!V4ChartUtils.checkIfDataExistInEvent(oEvent1), "Data does exists in oEvent.");
        assert.ok(V4ChartUtils.checkIfDataExistInEvent(oEvent2), "Data is empty in oEvent display - No data");
        assert.ok(!V4ChartUtils.checkIfDataExistInEvent(oEvent3), "Data is undefined for the context element.");
        var oConfig = V4ChartUtils.getConfig();
        assert.ok(oConfig.Line && oConfig.Bubble, "general configuration is set for chart.");
        var oConfigBubble = V4ChartUtils.getConfig({ $EnumMember: "chartType/Bubble" }, true);
        assert.ok(
            !oConfigBubble.Line && oConfigBubble.default,
            "configuration is set for enum member bubble, no configuuration present for line type."
        );
    });

    QUnit.test("V4 chart utils - function validateMeasuresDimensions.", function (assert) {
        var vizFrame = {
            getDataset: function () {
                return false;
            },
        };
        var vizFrame1 = {
            getDataset: function () {
                return {
                    getMeasures: function () {
                        return [
                            {
                                getName: function () { },
                            },
                        ];
                    },
                    getDimensions: function () {
                        return [{}];
                    },
                };
            },
        };
        assert.ok(
            !V4ChartUtils.validateMeasuresDimensions(vizFrame),
            "data set is not defined for chart, Mesaure dimensions are not valid."
        );
        assert.ok(
            !V4ChartUtils.validateMeasuresDimensions(vizFrame1, "Bubble"),
            "data set is not defined for Bubble chart, Mesaure dimensions are not valid."
        );
        assert.ok(
            !V4ChartUtils.validateMeasuresDimensions(vizFrame1, "Donut"),
            "data set is not defined for Donut chart, Mesaure dimensions are not valid."
        );
        assert.ok(
            !V4ChartUtils.validateMeasuresDimensions(vizFrame1, "Line"),
            "data set is not defined for Line chart, Mesaure dimensions are not valid."
        );
        assert.ok(V4ChartUtils.validateMeasuresDimensions(vizFrame1, "test"), "Measure dimensions are valid for chart.");
    });

    QUnit.test("V4 chart utils - function getSortAnnotationCollection.", function (assert) {
        var dataModel = {
            getServiceAnnotations: function () {
                return {
                    "catalogservice.Books": {
                        "com.sap.v1.u1.text": "test",
                    },
                };
            },
        };
        var presentationVariant = {
            SortOrder: {
                Path: "@com.sap.v1.u1.text",
            },
        };
        var entitySet = {
            entityType: "catalogservice.Books",
        };

        var presentationVariant1 = {
            SortOrder: false,
        };
        assert.ok(
            V4ChartUtils.getSortAnnotationCollection(dataModel, presentationVariant, entitySet) === "test",
            "presentationVariant annotation value is getting set properly."
        );
        assert.ok(
            !V4ChartUtils.getSortAnnotationCollection(dataModel, presentationVariant1, entitySet),
            "sortorder is not defined for presentationVariant, hence function return false."
        );
    });

    QUnit.test("V4 chart utils - functions V4ChartUtils.LineChart.", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oModel = oView.getModel("ovpCardProperties");
                var oEntityType;
                oModel.getProperty = function (sType) {
                    if (sType.indexOf("entityType") > -1) {
                        oEntityType = oView.getModel().getMetaModel().getObject("/CatalogService.Books");
                        oEntityType.property = [];
                        for (var key in oEntityType) {
                            if (
                                oEntityType[key] &&
                                oEntityType[key].hasOwnProperty("$kind") &&
                                oEntityType[key].$kind === "Property"
                            ) {
                                oEntityType.property.push(oEntityType[key]);
                                oEntityType.property[oEntityType.property.length - 1].name = key;
                            }
                        }
                        return oEntityType;
                    }
                };
                var oEntityType;
                var iContext = {
                    getSetting: function () {
                        return oModel;
                    },
                };

                var dimension = { Role: { EnumMember: "/Series" }, Dimension: { PropertyPath: "category" } };
                var colorFeed = V4ChartUtils.LineChart.getColorFeed(iContext, [dimension]);
                assert.ok(colorFeed === "category", "getColorFeed's binding expression is formed.");
                dimension = { Role: { EnumMember: "/Series" }, Dimension: { PropertyPath: "stock" } };
                assert.ok(
                    V4ChartUtils.LineChart.testColorFeed(iContext, [dimension]) === true,
                    "testColorFeed returns true as getColorFeed is not blank."
                );

                dimension = { Role: { EnumMember: "/Category" }, Dimension: { PropertyPath: "category" } };
                var sResult = V4ChartUtils.LineChart.getVizProperties(
                    iContext,
                    [dimension],
                    [{ Measure: { PropertyPath: "stock" } }]
                );
                assert.ok(
                    sResult ===
                    "{ valueAxis:{  layout: { maxWidth : 0.4 }, title:{   visible:false,   text: 'stock'  },  label:{   formatString:'axisFormatter'  } }, categoryAxis:{  title:{   visible:false,   text: 'category'  },  label:{   formatString:'axisFormatter'  } }, legend: {  isScrollable: false, itemMargin: 1.25 }, title: {  visible: false }, general: { groupData: false }, interaction:{  noninteractiveMode: false,  selectability: {   legendSelection: false,   axisLabelSelection: false,   mode: 'EXCLUSIVE',   plotLassoSelection: false,   plotStdSelection: true  }, zoom:{   enablement: 'disabled'} } }",
                    "function getVizProperties is called successfully and binding expression is formed."
                );

                dimension = { Role: { EnumMember: "/" }, Dimension: { PropertyPath: "category" } };
                var categoryAxisFeed = V4ChartUtils.LineChart.getCategoryAxisFeed(iContext, [dimension]);
                assert.ok(categoryAxisFeed === "category", "getCategoryAxisFeed's binding expression is formed.");

                dimension = { Role: { EnumMember: "/Series" }, Dimension: { PropertyPath: "category" } };
                var colorFeed = V4ChartUtils.LineChart.getColorFeed(iContext, [dimension]);
                assert.ok(colorFeed === "", "getColorFeed is blank as no dimension of type series.");
                assert.ok(
                    V4ChartUtils.LineChart.testColorFeed(iContext, [dimension]) === false,
                    "testColorFeed returns true as getColorFeed is blank."
                );
                fnDone();
            });
        });
    });

    QUnit.test("V4 chart utils - functions V4ChartUtils.BubbleChart.", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oModel = oView.getModel("ovpCardProperties");
                var oEntityType;
                oModel.getProperty = function (sType) {
                    if (sType.indexOf("entityType") > -1) {
                        oEntityType = oView.getModel().getMetaModel().getObject("/CatalogService.Books");
                        oEntityType.property = [];
                        for (var key in oEntityType) {
                            if (
                                oEntityType[key] &&
                                oEntityType[key].hasOwnProperty("$kind") &&
                                oEntityType[key].$kind === "Property"
                            ) {
                                oEntityType.property.push(oEntityType[key]);
                                oEntityType.property[oEntityType.property.length - 1].name = key;
                            }
                        }
                        return oEntityType;
                    }
                };
                var oEntityType;
                var iContext = {
                    getSetting: function () {
                        return oModel;
                    },
                };

                var dimension = { Role: { EnumMember: "/Series" }, Dimension: { PropertyPath: "category" } };
                var colorFeed = V4ChartUtils.BubbleChart.getColorFeed(iContext, [dimension]);
                assert.ok(colorFeed === "category", "function getColorFeed return the dimension property.");
                dimension = { Role: { EnumMember: "/Series" }, Dimension: { PropertyPath: "stock" } };
                assert.ok(
                    V4ChartUtils.BubbleChart.testColorFeed(iContext, [dimension]) === true,
                    "function testColorFeed returns true as getColorFeed does not return blank."
                );

                dimension = { Role: { EnumMember: "/Category" }, Dimension: { PropertyPath: "category" } };
                var sResult = V4ChartUtils.BubbleChart.getVizProperties(
                    iContext,
                    [dimension],
                    [
                        { Role: { EnumMember: "/Axis1" }, Measure: { PropertyPath: "stock" } },
                        { Role: { EnumMember: "/Axis1" }, Measure: { PropertyPath: "stock_date" } },
                    ]
                );
                assert.ok(
                    sResult ===
                    "{ valueAxis:{  layout: { maxWidth : 0.4 }, title:{ visible:true, text: 'stock'  },  label:{ formatString:'axisFormatter'  } }, valueAxis2:{  title:{ visible:true, text: 'stock_date'  },  label:{ formatString:'axisFormatter'  } }, categoryAxis:{  title:{ visible:true  },  label:{ formatString:'axisFormatter'  } }, legend: {  isScrollable: false, itemMargin: 1.25 }, title: {  visible: false }, interaction:{  noninteractiveMode: false,  selectability: { legendSelection: false, axisLabelSelection: false, mode: 'EXCLUSIVE', plotLassoSelection: false, plotStdSelection: true  }, zoom:{   enablement: 'disabled'} } }",
                    "function getVizProperties is called successfully and binding expression is formed."
                );

                dimension = { Role: { EnumMember: "/Category" }, Dimension: { PropertyPath: "category" } };
                var sResult = V4ChartUtils.BubbleChart.getBubbleWidthFeed(iContext, [
                    { Role: { EnumMember: "/Axis1" }, Measure: { PropertyPath: "stock" } },
                    { Role: { EnumMember: "/Axis2" }, Measure: { PropertyPath: "stock_date" } },
                    { Role: { EnumMember: "/Axis3" }, Measure: { PropertyPath: "stock1" } },
                ]);
                assert.ok(sResult === "stock1", "function getBubbleWidthFeed is callled and path os formed");
                assert.ok(
                    V4ChartUtils.BubbleChart.getShapeFeed(iContext, [dimension]) === "category",
                    "function getShapeFeed returns the dimension value"
                );
                assert.ok(
                    V4ChartUtils.BubbleChart.testShapeFeed(iContext, [dimension]) === true,
                    "function testShapeFeed is executed returns true as getShapeFeed return dimension value"
                );
                fnDone();
            });
        });
    });
});
