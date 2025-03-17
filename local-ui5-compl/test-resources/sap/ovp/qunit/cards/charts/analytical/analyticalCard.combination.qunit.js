/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/charts/VizAnnotationManager"
], function (cardUtils, oChartUtils, mockservers, OvpVizAnnotationManager) {
    "use strict";

    // Preloading the VIZ library before executing the tests to prevent the time out issue during the execution of tests.

    var chartUtils = oChartUtils;
    var parameterTestCase = "Combination chart - With Input Parameters";

    QUnit.module("sap.ovp.cards.charts.Combination", {
        /**
         * This method is called before each test
         */
        beforeEach: function (test) {
            var baseURL = chartUtils.odataBaseUrl;
            var rootURL = chartUtils.odataRootUrl;
            if (test.test.testName == parameterTestCase) {
                baseURL = chartUtils.odataBaseUrl2;
                rootURL = chartUtils.odataRootUrl_InputParameters;
            }
            mockservers.loadMockServer(baseURL, rootURL);
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        afterEach: function () {
            mockservers.close();
        },
    });

    QUnit.test("Combination chart - Without Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_1",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Combination",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination",
                    presentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Combination",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Combination",
                    identificationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Combination",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "combination",
                        dataSet: {
                            data: { path: "/SalesShare", sorter: [{ path: "Quarter", descending: false }] },
                            dimensions: [
                                {
                                    name: "Quarter",
                                    value: "{Quarter}",
                                    displayValue: "{Quarter}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales,Total Sales",
                                },
                                {
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: "Quarter",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var cardCfg = cardTestData.card.settings;
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, "combination"),
                "VIZ Frame - see that there is a VIZFrame for combination chart"
            );
            assert.ok(
                chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Combination chart - With Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_2",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Combination",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination",
                    presentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Combination",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Combination",
                    identificationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Combination",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "combination",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                sorter: [{ path: "Quarter", descending: false }],
                                filters: [{ path: "Year", operator: "EQ", value1: "2012" }],
                            },
                            dimensions: [
                                {
                                    name: "Quarter",
                                    value: "{Quarter}",
                                    displayValue: "{Quarter}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales,Total Sales",
                                },
                                {
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: "Quarter",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var cardCfg = cardTestData.card.settings;
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
            assert.ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, "combination"),
                "VIZ Frame - see that there is a VIZFrame for combination chart"
            );
            assert.ok(
                chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Combination chart - With Filters Without Sorter", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_3",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Combination",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination",
                    presentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Combination",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Combination",
                    identificationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Combination",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nosorter.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "combination",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                filters: [{ path: "Year", operator: "EQ", value1: "2012" }],
                            },
                            dimensions: [
                                {
                                    name: "Quarter",
                                    value: "{Quarter}",
                                    displayValue: "{Quarter}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales,Total Sales",
                                },
                                {
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: "Quarter",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var cardCfg = cardTestData.card.settings;
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
            assert.ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, "combination"),
                "VIZ Frame - see that there is a VIZFrame for combination chart"
            );
            assert.ok(
                chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Combination chart - With faulty filter configuration", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_4",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#NON_EXISTENT",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Combination",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "combination",
                        dataSet: {
                            data: { path: "/SalesShare" },
                            dimensions: [
                                {
                                    name: "Quarter",
                                    value: "{Quarter}",
                                    displayValue: "{Quarter}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales,Total Sales",
                                },
                                {
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: "Quarter",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var cardCfg = cardTestData.card.settings;
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, "combination"),
                "VIZ Frame - see that there is a VIZFrame for combination chart"
            );
            assert.ok(
                chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Combination chart - Without DataPoint Annotation", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_5",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Combination",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination",
                    presentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Combination",
                    identificationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Combination",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_NoDataPoint.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "combination",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                sorter: [{ path: "Quarter", descending: false }],
                                filters: [{ path: "Year", operator: "EQ", value1: "2012" }],
                            },
                            dimensions: [
                                {
                                    name: "Quarter",
                                    value: "{Quarter}",
                                    displayValue: "{Quarter}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales,Total Sales",
                                },
                                {
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: "Quarter",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var cardCfg = cardTestData.card.settings;
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, "combination"),
                "VIZ Frame - see that there is a VIZFrame for combination chart"
            );
            assert.ok(
                chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Combination chart - With DataPoint, Without Title and Value", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_6",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Combination",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Combination",
                    presentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Combination",
                    identificationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Combination",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_NoDataPoint.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "combination",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                sorter: [{ path: "Quarter", descending: false }],
                                filters: [{ path: "Year", operator: "EQ", value1: "2012" }],
                            },
                            dimensions: [
                                {
                                    name: "Quarter",
                                    value: "{Quarter}",
                                    displayValue: "{Quarter}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales,Total Sales",
                                },
                                {
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: "Quarter",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var cardCfg = cardTestData.card.settings;
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, "combination"),
                "VIZ Frame - see that there is a VIZFrame for combination chart"
            );
            assert.ok(
                chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Combination chart - With ObjectStream Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_7",
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
                    selectionAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Combination",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination",
                    presentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Combination",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Combination",
                    identificationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Combination",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "combination",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                sorter: [{ path: "Quarter", descending: false }],
                                filters: [{ path: "Year", operator: "EQ", value1: "2012" }],
                            },
                            dimensions: [
                                {
                                    name: "Quarter",
                                    value: "{Quarter}",
                                    displayValue: "{Quarter}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales,Total Sales",
                                },
                                {
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: "Quarter",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var cardCfg = cardTestData.card.settings;
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
            assert.ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, "combination"),
                "VIZ Frame - see that there is a VIZFrame for combination chart"
            );
            assert.ok(
                chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Combination chart - With MeasureAttributes and DimensionAttributes missing", function (assert) {
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
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_NoDimMeas.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "combination",
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
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body;

            // basic list XML structure tests
            assert.ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeNotExists(cardXml, "combination"),
                "VIZ Frame - see that there is no VIZFrame rendered for combination chart"
            );
            fnDone();
        });
    });

    QUnit.test("Combination chart - Axis title visibility when header exists.", function (assert) {
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
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml",
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var handler = cardViz.getParent();
            var oController = {
                getView: function () {
                    return null;
                },
                getOwnerComponent: function () {
                    return null;
                },
            };
            OvpVizAnnotationManager.buildVizAttributes(cardViz, handler, oController);
            assert.ok(
                chartUtils.checkAxisTitleVisibility(cardViz, true),
                "Check if axis titles are hidden when header exists"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            fnDone();
        });
    });

    QUnit.test("Combination chart - With Timeseries", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_10",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath:
                        "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Combination_timeseries",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination_timeseries",
                    presentationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Combination_timeseries",
                    dataPointAnnotationPath:
                        "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Combination_timeseries",
                    identificationAnnotationPath:
                        "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Combination_timeseries",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "timeseries_combination",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                sorter: [{ path: "Sales", descending: false }],
                                filters: [
                                    { path: "Country", operator: "EQ", value1: "IN" },
                                    { path: "Quarter", operator: "EQ", value1: "01" },
                                    { path: "Year", operator: "EQ", value1: "2010" },
                                ],
                            },
                            dimensions: [
                                {
                                    name: "Date",
                                    value: "{Date}",
                                    datType: "date",
                                },
                            ],
                            measures: [
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales,Total Sales",
                                },
                                {
                                    uid: "timeAxis",
                                    type: "Dimension",
                                    values: "Date",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            var cardCfg = cardTestData.card.settings;
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for combination chart"
            );
            assert.ok(
                chartUtils.genericDimensionItemsNodeExists(
                    cardViz,
                    expectedListRes.VizFrame.dataSet.dimensions,
                    false
                ),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });

    QUnit.test("Combination chart - Customizing with colorPalette - 4 colors", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_11",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination_Customized",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                    colorPalette: [
                        {
                            color: "sapUiChartPaletteSemanticNeutral",
                            legendText: "{{OTHERS}}",
                        },
                        {
                            color: "sapUiChartPaletteSemanticBadDark1",
                            legendText: "{{BAD}}",
                        },
                        {
                            color: "sapUiChartPaletteSemanticCriticalDark2",
                            legendText: "{{CRITICAL}}",
                        },
                        {
                            color: "sapUiChartPaletteSemanticCritical",
                            legendText: "{{GOOD}}",
                        },
                    ],
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl,
                rootUri: chartUtils.odataRootUrl,
                annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "combination",
                        dataSet: {
                            data: { path: "/SalesShare", sorter: [{ path: "Sales", descending: true }] },
                            dimensions: [
                                {
                                    name: "Criticality",
                                    value: "{StatusCriticality}",
                                    displayValue: "{StatusCriticality}",
                                },
                                {
                                    name: "Region",
                                    value: "{Region}",
                                    displayValue: "{Region}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Region",
                            },
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Sales,Total Sales",
                            },
                            {
                                uid: "color",
                                type: "Dimension",
                                values: "Criticality",
                            },
                        ],
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, "combination"),
                "VIZ Frame - see that there is a VIZFrame for combination chart"
            );
            assert.ok(
                chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
            // assert.ok(
            //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
            //     "VIZ Frame - see that there is data binding"
            // );
            fnDone();
        });
    });
});
