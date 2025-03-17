/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/charts/VizAnnotationManager"
], function (
    CardUtils, 
    ChartUtils, 
    Mockserver, 
    OvpVizAnnotationManager
) {
    "use strict";

    var parameterTestCase = "Waterfall chart - With Input Parameters";

    QUnit.module("sap.ovp.cards.charts.Waterfall", {
        beforeEach: function (test) {
            var baseURL = ChartUtils.odataBaseUrl;
            var rootURL = ChartUtils.odataRootUrl;
            if (test.test.testName == parameterTestCase) {
                baseURL = ChartUtils.odataBaseUrl2;
                rootURL = ChartUtils.odataRootUrl_InputParameters;
            }
            Mockserver.loadMockServer(baseURL, rootURL);
        },
        afterEach: function () {
            Mockserver.close();
        }
    });

    QUnit.test("Waterfall chart - Without Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_1",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Waterfall_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                },
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "waterfall",
                        dataSet: {
                            data: { path: "/SalesShare", sorter: [{ path: "Sales", descending: true }] },
                            dimensions: [
                                {
                                    name: "Spend Type",
                                    value: "{SpendType}",
                                    displayValue: "{SpendType}"
                                },
                                {
                                    name: "Type",
                                    value: "{Type}"
                                }
                            ],
                            measures: [
                                {
                                    name: "Revenue",
                                    value: "{Revenue}",
                                }
                            ]
                        },
                        feeds: [
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Revenue",
                            },
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Spend Type",
                            },
                            {
                                uid: "waterfallType",
                                type: "Dimension",
                                values: "Type",
                            }
                        ]
                    }
                }
            }
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            
            var expectedListRes = cardTestData.expectedResult.Body;
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                },
            };
            OvpVizAnnotationManager.buildVizAttributes(cardViz, null, oController);

            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Waterfall chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions, false),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds, false),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     ChartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Waterfall chart - With Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_2",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Waterfall_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
                },
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "waterfall",
                        dataSet: {
                            // make sure to check the blank spaces
                            data: {
                                path: "/SalesShare",
                                filters: [
                                    { path: "Country", operator: "EQ", value1: "IN" },
                                    { path: "Country", operator: "EQ", value1: "US" },
                                ],
                                sorter: [{ path: "Sales", descending: true }],
                            },
                            dimensions: [
                                {
                                    name: "Spend Type",
                                    value: "{SpendType}",
                                    displayValue: "{SpendType}",
                                },
                                {
                                    name: "Type",
                                    value: "{Type}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Revenue",
                                    value: "{Revenue}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Revenue",
                            },
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Spend Type",
                            },
                            {
                                uid: "waterfallType",
                                type: "Dimension",
                                values: "Type",
                            },
                        ],
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            
            var expectedListRes = cardTestData.expectedResult.Body;
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                },
            };
            OvpVizAnnotationManager.buildVizAttributes(cardViz, null, oController);
            var feeds = cardViz.getFeeds();

            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Waterfall chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions, false),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds, false),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     ChartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Waterfall chart - With Filters Without Sorters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_3",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Waterfall_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                },
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nosorter.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "waterfall",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                filters: [
                                    { path: "Country", operator: "EQ", value1: "IN" },
                                    { path: "Currency", operator: "EQ", value1: "EUR" },
                                ],
                            },
                            dimensions: [
                                {
                                    name: "Spend Type",
                                    value: "{SpendType}",
                                    displayValue: "{SpendType}",
                                },
                                {
                                    name: "Type",
                                    value: "{Type}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Revenue",
                                    value: "{Revenue}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Revenue",
                            },
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Spend Type",
                            },
                            {
                                uid: "waterfallType",
                                type: "Dimension",
                                values: "Type",
                            },
                        ],
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async()

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                }
            };
            OvpVizAnnotationManager.buildVizAttributes(cardViz, null, oController);
           
            var expectedListRes = cardTestData.expectedResult.Body;
            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Waterfall chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions, false),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds, false),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     ChartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test(parameterTestCase, function (assert) {
        var cardTestData = {
            card: {
                id: "chart_4",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesOrder",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Waterfall_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                },
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl2,
                rootUri: ChartUtils.odataRootUrl_InputParameters,
                annoUri: ChartUtils.odataBaseUrl2 + "annotations_InputParamets.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "waterfall",
                        dataSet: {
                            data: {
                                path: "/SalesOrderParameters(P_Currency=%27EUR%27,P_CountryCode=%27IN%27)/Results",
                                filters: [],
                                sorter: [],
                                parameters: { select: "Country,NetAmount" },
                                length: 4,
                            },
                            dimensions: [
                                {
                                    name: "Spend Type",
                                    value: "{SpendType}",
                                    displayValue: "{SpendType}",
                                },
                                {
                                    name: "Type",
                                    value: "{Type}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Revenue",
                                    value: "{Revenue}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Revenue",
                            },
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Spend Type",
                            },
                            {
                                uid: "waterfallType",
                                type: "Dimension",
                                values: "Type",
                            }
                        ]
                    }
                }
            }
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                },
            };
            OvpVizAnnotationManager.buildVizAttributes(cardViz, null, oController);

            var expectedListRes = cardTestData.expectedResult.Body;
            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Waterfall chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions, false),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds, false),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     ChartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Waterfall chart - With faulty filter configuration", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_5",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#NON_EXISTENT",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Waterfall_Eval_by_Currency",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                },
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "waterfall",
                        dataSet: {
                            data: { path: "/SalesShare" },
                            dimensions: [
                                {
                                    name: "Spend Type",
                                    value: "{SpendType}",
                                    displayValue: "{SpendType}",
                                },
                                {
                                    name: "Type",
                                    value: "{Type}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Revenue",
                                    value: "{Revenue}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Revenue",
                            },
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Spend Type",
                            },
                            {
                                uid: "waterfallType",
                                type: "Dimension",
                                values: "Type",
                            }
                        ]
                    }
                }
            }
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                }
            };
            OvpVizAnnotationManager.buildVizAttributes(cardViz, null, oController);
           
            var expectedListRes = cardTestData.expectedResult.Body;
            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Waterfall chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions, false),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds, false),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     ChartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Waterfall chart - Without DataPoint Annotation", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_6",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Waterfall_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                }
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_NoDataPoint.xml"
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "waterfall",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                sorter: [{ path: "Sales", descending: true }],
                                filters: [
                                    { path: "Country", operator: "EQ", value1: "IN" },
                                    { path: "Country", operator: "EQ", value1: "US" },
                                    { path: "Currency", operator: "EQ", value1: "EUR" }
                                ]
                            },
                            dimensions: [
                                {
                                    name: "Spend Type",
                                    value: "{SpendType}",
                                    displayValue: "{SpendType}"
                                },
                                {
                                    name: "Type",
                                    value: "{Type}"
                                },
                            ],
                            measures: [
                                {
                                    name: "Revenue",
                                    value: "{Revenue}"
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Revenue",
                            },
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Spend Type",
                            },
                            {
                                uid: "waterfallType",
                                type: "Dimension",
                                values: "Type",
                            }
                        ]
                    }
                }
            }
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                },
            };
            OvpVizAnnotationManager.buildVizAttributes(cardViz, null, oController);
            var feeds = cardViz.getFeeds();
            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body;
            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Waterfall chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions, false),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds, false),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     ChartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Waterfall chart - With DataPoint, Without Title and Value", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_7",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Waterfall_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                },
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_NoDataPoint.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "waterfall",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                sorter: [{ path: "Sales", descending: true }],
                                filters: [
                                    { path: "Country", operator: "EQ", value1: "IN" },
                                    { path: "Country", operator: "EQ", value1: "US" },
                                    { path: "Currency", operator: "EQ", value1: "EUR" },
                                ],
                            },
                            dimensions: [
                                {
                                    name: "Spend Type",
                                    value: "{SpendType}",
                                    displayValue: "{SpendType}",
                                },
                                {
                                    name: "Type",
                                    value: "{Type}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Revenue",
                                    value: "{Revenue}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Revenue",
                            },
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Spend Type",
                            },
                            {
                                uid: "waterfallType",
                                type: "Dimension",
                                values: "Type",
                            }
                        ]
                    }
                }
            }
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                }
            };
            OvpVizAnnotationManager.buildVizAttributes(cardViz, null, oController);
            var feeds = cardViz.getFeeds();
            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body;
            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Waterfall chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions, false),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds, false),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     ChartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Waterfall chart - With ObjectStream Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_8",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    filters: [
                        {
                            path: "Region",
                            operator: "EQ",
                            value1: "APJ",
                        },
                    ],
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Waterfall_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                },
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "waterfall",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                sorter: [{ path: "Sales", descending: true }],
                                filters: [
                                    { path: "Country", operator: "EQ", value1: "IN" },
                                    { path: "Country", operator: "EQ", value1: "US" },
                                    { path: "Currency", operator: "EQ", value1: "EUR" },
                                    { path: "Region", operator: "EQ", value1: "APJ" },
                                ],
                            },
                            dimensions: [
                                {
                                    name: "Spend Type",
                                    value: "{SpendType}",
                                    displayValue: "{SpendType}",
                                },
                                {
                                    name: "Type",
                                    value: "{Type}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Revenue",
                                    value: "{Revenue}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Revenue",
                            },
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Spend Type",
                            },
                            {
                                uid: "waterfallType",
                                type: "Dimension",
                                values: "Type",
                            }
                        ]
                    }
                }
            }
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async()

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                },
            };
            OvpVizAnnotationManager.buildVizAttributes(cardViz, null, oController);
            var feeds = cardViz.getFeeds();
            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body;
            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Waterfall chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions, false),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds, false),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     ChartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Waterfall chart - With MeasureAttributes and DimensionAttributes missing", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_9",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    filters: [
                        {
                            path: "Region",
                            operator: "EQ",
                            value1: "APJ",
                        },
                    ],
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Vertical_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                },
            },
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_NoDimMeas.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "waterfall",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                sorter: [{ path: "Sales", descending: true }],
                                filters: [
                                    { path: "Country", operator: "EQ", value1: "IN" },
                                    { path: "Country", operator: "EQ", value1: "US" },
                                    { path: "Currency", operator: "EQ", value1: "EUR" },
                                    { path: "Region", operator: "EQ", value1: "APJ" },
                                ],
                            },
                            dimensions: [],
                            measures: [],
                        },
                        feeds: [],
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var expectedListRes = cardTestData.expectedResult.Body;

            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeNotExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is no VIZFrame rendered for Waterfall chart"
            );
            fnDone();
        });
    });
});
