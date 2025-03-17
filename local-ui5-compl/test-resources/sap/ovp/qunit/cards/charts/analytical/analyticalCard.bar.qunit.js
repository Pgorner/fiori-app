/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/charts/VizAnnotationManager",
    "sap/ui/core/Element"
], function (cardUtils, oChartUtils, mockservers, OvpVizAnnotationManager, Element) {
    "use strict";

    // Preloading the VIZ library before executing the tests to prevent the time out issue during the execution of tests.

    var chartUtils = oChartUtils;
    var parameterTestCase = "Bar chart - With Input Parameters";

    QUnit.module("sap.ovp.cards.charts.Bar", {
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

    QUnit.test("Bar chart - Without Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_1",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Bar_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
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
                        vizType: "bar",
                        dataSet: {
                            data: { path: "/SalesShare", sorter: [{ path: "Sales", descending: true }] },
                            dimensions: [
                                {
                                    name: "Product",
                                    value: "{Product}",
                                    displayValue: "{Product}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales Share",
                                    value: "{SalesShare}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales Share",
                                },
                                {
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: "Product",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = cardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        cardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
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
            
                // assert.ok(
                //     chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                //     "VIZ Frame - see that there is a VIZFrame for bar chart"
                // );
                assert.ok(
                    chartUtils.genericDimensionItemsNodeExists(
                        cardViz,
                        expectedListRes.VizFrame.dataSet.dimensions
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

    QUnit.test("Bar chart - With Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_2",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Bar_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
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
                        vizType: "bar",
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
                                    name: "Product",
                                    value: "{Product}",
                                    displayValue: "{Product}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales Share",
                                    value: "{SalesShare}",
                                },
                            ],
                            feeds: [
                                {
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: "Sales Share",
                                },
                                {
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: "Product",
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
                chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Bar chart"
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

    QUnit.test("Bar chart - With Filters Without Sorters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_3",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Bar_Eval_by_CtryCurr",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
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
                        vizType: "bar",
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
                                    name: "Product",
                                    value: "{Product}",
                                    displayValue: "{Product}",
                                },
                                {
                                    name: "Country",
                                    value: "{Country}",
                                    displayValue: "{Country}",
                                },
                                {
                                    name: "Region",
                                    value: "{Region}",
                                    displayValue: "{Region}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales Share",
                                    value: "{SalesShare}",
                                },
                                {
                                    name: "Total Sales",
                                    value: "{TotalSales}",
                                },
                                {
                                    name: "Sales",
                                    value: "{Sales}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Product,Country,Region",
                            },
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Sales Share,Total Sales,Sales",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Bar chart"
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

    QUnit.test(parameterTestCase, function (assert) {
        var cardTestData = {
            card: {
                id: "chart_4",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesOrder",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Bar_Eval_by_Country",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                },
            },
            dataSource: {
                baseUrl: chartUtils.odataBaseUrl2,
                rootUri: chartUtils.odataRootUrl_InputParameters,
                annoUri: chartUtils.odataBaseUrl2 + "annotations_InputParamets.xml",
            },
            expectedResult: {
                Body: {
                    VizFrame: {
                        vizType: "bar",
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
                                    name: "Product",
                                    value: "{Product}",
                                    displayValue: "{Product}",
                                },
                                {
                                    name: "Country",
                                    value: "{Country}",
                                    displayValue: "{Country}",
                                },
                                {
                                    name: "Region",
                                    value: "{Region}",
                                    displayValue: "{Region}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Net Amount",
                                    value: "{NetAmount}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Product,Country,Region",
                            },
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Net Amount",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Bar chart"
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

    QUnit.test("Bar chart - With faulty filter configuration", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_5",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#NON_EXISTENT",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Bar_Eval_by_Currency",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
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
                        vizType: "bar",
                        dataSet: {
                            data: { path: "/SalesShare" },
                            dimensions: [
                                {
                                    name: "Product",
                                    value: "{Product}",
                                    displayValue: "{Product}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales Share",
                                    value: "{SalesShare}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Product",
                            },
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Sales Share",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Bar chart"
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

    QUnit.test("Bar chart - Without DataPoint Annotation", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_6",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Bar_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
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
                        vizType: "bar",
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
                                    name: "Product",
                                    value: "{Product}",
                                    displayValue: "{Product}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales Share",
                                    value: "{SalesShare}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Product",
                            },
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Sales Share",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Bar chart"
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

    QUnit.test("Bar chart - With DataPoint, Without Title and Value", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_7",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Bar_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
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
                        vizType: "bar",
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
                                    name: "Product",
                                    value: "{Product}",
                                    displayValue: "{Product}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales Share",
                                    value: "{SalesShare}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Product",
                            },
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Sales Share",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Bar chart"
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

    QUnit.test("Bar chart - With ObjectStream Filters", function (assert) {
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
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Bar_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
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
                        vizType: "bar",
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
                                length: 3,
                            },
                            dimensions: [
                                {
                                    name: "Product",
                                    value: "{Product}",
                                    displayValue: "{Product}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Sales Share",
                                    value: "{SalesShare}",
                                },
                            ],
                        },
                        feeds: [
                            {
                                uid: "categoryAxis",
                                type: "Dimension",
                                values: "Product",
                            },
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Sales Share",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Bar chart"
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

    QUnit.test("Bar chart - With MeasureAttributes and DimensionAttributes missing", function (assert) {
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
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Bar_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
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
                        vizType: "bar",
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
                chartUtils.vizNodeNotExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is no VIZFrame rendered for Bar chart"
            );
            fnDone();
        });
    });

    function chartFunctions(oController, card, cardViz, oView, chartAnnotationPath, dimensionProperty) {
        oController.getView = function () {
            return {
                byId: function (id) {
                    if (id === "analyticalChart") {
                        var vizCard = cardViz;

                        var oModel = {
                            entityType: {
                                "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country": {
                                    MaxItems: {
                                        Int: 5,
                                    },
                                    SortOrder: [
                                        {
                                            Descending: {
                                                Boolean: true,
                                            },
                                        },
                                        {
                                            Property: {
                                                PropertyPath: "Sales",
                                            },
                                        },
                                    ],
                                    Visualizations: [
                                        {
                                            AnnotationPath: "@" + chartAnnotationPath,
                                        },
                                    ],
                                },
                            },
                            presentationAnnotationPath:
                                "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                            chartAnnotationPath: chartAnnotationPath,
                            dataStep: 11,
                        };
                        vizCard.setModel(oView.getModel("ovpCardProperties"), "ovpCardProperties");
                        var binding = vizCard.getParent().getBinding("data");
                        binding.mParameters = { select: dimensionProperty + ",SalesShare" };

                        var newAggrBinding = {};
                        newAggrBinding.path = "/SalesShare";
                        newAggrBinding.parameters = {
                            select: "SalesShare",
                        };
                        newAggrBinding.length = 1;
                        newAggrBinding.template = new Element();
                        vizCard.getParent().bindAggregation("aggregateData", newAggrBinding);
                        vizCard.getParent().setDependentDataReceived(true);

                        return vizCard;
                    }
                },
            };
        };
    }
});
