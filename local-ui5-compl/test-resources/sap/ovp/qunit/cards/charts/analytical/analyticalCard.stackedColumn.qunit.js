/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/charts/VizAnnotationManager"
], function (CardUtils, oChartUtils, mockservers, OvpVizAnnotationManager) {
    "use strict";

    // Preloading the VIZ library before executing the tests to prevent the time out issue during the execution of tests.
    var ChartUtils = oChartUtils;
    var parameterTestCase = "StackedColumn chart - With Input Parameters";

   QUnit. module("sap.ovp.cards.charts.stackedColumn", {
        /**
         * This method is called before each test
         */
        beforeEach: function (test) {
            var baseURL = ChartUtils.odataBaseUrl;
            var rootURL = ChartUtils.odataRootUrl;
            if (test.test.testName == parameterTestCase) {
                baseURL = ChartUtils.odataBaseUrl2;
                rootURL = ChartUtils.odataRootUrl_InputParameters;
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

    QUnit.test("StackedColumn chart - Without Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_1",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
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
                        vizType: "stacked_column",
                        dataSet: {
                            data: { path: "/SalesShare", sorter: [{ path: "Sales", descending: true }] },
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
                                {
                                    uid: "color",
                                    type: "Dimension",
                                    values: "Country",
                                },
                            ],
                        },
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
            assert.ok(ChartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for stacked column chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
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

    QUnit.test("StackedColumn chart - With Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_2",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
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
                        vizType: "stacked_column",
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
                                {
                                    name: "Country",
                                    value: "{Country}",
                                    displayValue: "{Country}",
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
                                {
                                    uid: "color",
                                    type: "Dimension",
                                    values: "Country",
                                },
                            ],
                        },
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
            assert.ok(ChartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Stacked Column chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
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

    QUnit.test("Stacked Column chart - With Filters Without Sorters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_3",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_CtryCurr",
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
                        vizType: "stacked_column",
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
                                values: "Product,Region",
                            },
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Sales Share,Total Sales,Sales",
                            },
                            {
                                uid: "color",
                                type: "Dimension",
                                values: "Country",
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
                "VIZ Frame - see that there is a VIZFrame for stacked Column chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds),
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
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Country",
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
                        vizType: "stacked_column",
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
                                values: "Product,Region",
                            },
                            {
                                uid: "valueAxis",
                                type: "Measure",
                                values: "Net Amount",
                            },
                            {
                                uid: "color",
                                type: "Dimension",
                                values: "Country",
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
                "VIZ Frame - see that there is a VIZFrame for Stacked Column chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds),
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

    QUnit.test("Stacked Column chart - With faulty filter configuration", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_5",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#NON_EXISTENT",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
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
                        vizType: "stacked_column",
                        dataSet: {
                            data: { path: "/SalesShare" },
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
                            {
                                uid: "color",
                                type: "Dimension",
                                values: "Country",
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
            assert.ok(ChartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is a VIZFrame for Stacked Column chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds),
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

    QUnit.test("Stacked Column chart - Without DataPoint Annotation", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_6",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
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
                        vizType: "stacked_column",
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
                "VIZ Frame - see that there is a VIZFrame for Stacked Column chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds),
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

    QUnit.test("Stacked Column chart - With DataPoint, Without Title and Value", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_7",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
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
                        vizType: "stacked_column",
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
                "VIZ Frame - see that there is a VIZFrame for Stacked Column chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds),
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

    QUnit.test("Stacked Column chart - With ObjectStream Filters", function (assert) {
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
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
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
                        vizType: "stacked_column",
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
                                {
                                    name: "Country",
                                    value: "{Country}",
                                    displayValue: "{Country}",
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
                            {
                                uid: "color",
                                type: "Dimension",
                                values: "Country",
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
                "VIZ Frame - see that there is a VIZFrame for Stacked Column chart"
            );
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds),
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

    QUnit.test("Stacked Column chart - With MeasureAttributes and DimensionAttributes missing", function (assert) {
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
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
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
                        vizType: "stacked_column",
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

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body;

            // basic list XML structure tests
            assert.ok(ChartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.vizNodeNotExists(cardXml, expectedListRes.VizFrame.vizType),
                "VIZ Frame - see that there is no VIZFrame rendered for Stacked Column chart"
            );
            fnDone();
        });
    });

    QUnit.test("StackedColumn chart - stable colors, without indexing", function (assert) {
        var oCardSettings = {
            card: {
                id: "card_stackedColumn",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
                    bEnableStableColors: true,
                    colorPalette: {
                        dimensionSettings: {
                            Country: {
                                rule1: {
                                    color: "sapUiChartPaletteSemanticGood",
                                    dimensionValue: "AR",
                                },
                                rule2: {
                                    color: "sapUiChartPaletteSemanticNeutral",
                                    dimensionValue: "CA",
                                },
                            },
                        },
                    },
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
                        vizType: "stacked_column",
                        dataSet: {
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
                                {
                                    uid: "color",
                                    type: "Dimension",
                                    values: "Country",
                                },
                            ],
                        },
                        dataPointStyle: {
                            rules: [
                                {
                                    properties: {
                                        color: "sapUiChartPaletteSemanticGood",
                                    },
                                    dataContext: {
                                        Country: "AR",
                                    },
                                    displayName: "AR",
                                },
                                {
                                    properties: {
                                        color: "sapUiChartPaletteSemanticNeutral",
                                    },
                                    dataContext: {
                                        Country: "CA",
                                    },
                                    displayName: "CA",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(oCardSettings);
        var fnDone = assert.async();

        CardUtils.createCardView(oCardSettings, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");

            var expectedListRes = oCardSettings.expectedResult.Body;
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
            assert.ok(ChartUtils.ovpNodeExists(cardXml, false, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );

            // test dataPointStyle for coloring rules
            var oVizProperties = cardViz.getVizProperties();
            var oDataPointStyle = oVizProperties.plotArea.dataPointStyle;
            assert.deepEqual(
                expectedListRes.VizFrame.dataPointStyle,
                oDataPointStyle,
                "Coloring rules should be present as per color palette"
            );
            assert.ok(
                oVizProperties["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            fnDone();
        });
    });

    QUnit.test("StackedColumn chart - stable colors, with indexing", function (assert) {
        var oCardSettings = {
            card: {
                id: "card_stackedColumn1",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
                    bEnableStableColors: true,
                    colorPalette: {
                        dimensionSettings: {
                            Country: {
                                rule1: {
                                    color: "sapUiChartPaletteSemanticGood",
                                    dimensionValue: "AR",
                                    index: 0,
                                },
                                rule2: {
                                    color: "sapUiChartPaletteSemanticNeutral",
                                    dimensionValue: "CA",
                                    index: 1,
                                },
                            },
                        },
                    },
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
                        vizType: "stacked_column",
                        dataSet: {
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
                                {
                                    uid: "color",
                                    type: "Dimension",
                                    values: "Country",
                                },
                            ],
                        },
                        dataPointStyle: {
                            rules: [
                                {
                                    properties: {
                                        color: "sapUiChartPaletteSemanticGood",
                                    },
                                    dataContext: {
                                        Country: "AR",
                                    },
                                    displayName: "AR",
                                },
                                {
                                    properties: {
                                        color: "sapUiChartPaletteSemanticNeutral",
                                    },
                                    dataContext: {
                                        Country: "CA",
                                    },
                                    displayName: "CA",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(oCardSettings);
        var fnDone = assert.async();

        CardUtils.createCardView(oCardSettings, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");

            var expectedListRes = oCardSettings.expectedResult.Body;
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
            assert.ok(ChartUtils.ovpNodeExists(cardXml, false, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );

            // test dataPointStyle for coloring rules
            var oVizProperties = cardViz.getVizProperties();
            var oDataPointStyle = oVizProperties.plotArea.dataPointStyle;
            assert.deepEqual(
                expectedListRes.VizFrame.dataPointStyle.rules[0],
                oDataPointStyle.rules[0],
                "Coloring rules should be in same order as colorPalette setting with index 0"
            );
            assert.deepEqual(
                expectedListRes.VizFrame.dataPointStyle.rules[1],
                oDataPointStyle.rules[1],
                "Coloring rules should be in same order as colorPalette setting with index 1"
            );
            assert.ok(
                oVizProperties["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            fnDone();
        });
    });

    QUnit.test("StackedColumn chart - Legends order by card manifest", function (assert) {
        var oCardSettings = {
            card: {
                id: "card_stackedColumn2",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
                    bEnableStableColors: true,
                    colorPalette: {
                        dimensionSettings: {
                            Country: {
                                rule1: {
                                    dimensionValue: "AR",
                                    index: 0,
                                },
                                rule2: {
                                    dimensionValue: "CA",
                                    index: 1,
                                },
                            },
                        },
                    },
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
                        vizType: "stacked_column",
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
                                {
                                    name: "Country",
                                    value: "{Country}",
                                    displayValue: "{Country}",
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
                                {
                                    uid: "color",
                                    type: "Dimension",
                                    values: "Country",
                                },
                            ],
                        },
                        dataPointStyle: {
                            rules: [
                                {
                                    properties: {
                                        color: "sapUiChartPaletteSemanticGood",
                                    },
                                    dataContext: {
                                        Country: "AR",
                                    },
                                    displayName: "AR",
                                },
                                {
                                    properties: {
                                        color: "sapUiChartPaletteSemanticNeutral",
                                    },
                                    dataContext: {
                                        Country: "CA",
                                    },
                                    displayName: "CA",
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(oCardSettings);
        var fnDone = assert.async();

        CardUtils.createCardView(oCardSettings, oModel).then(function (oView) {
            var cardViz = oView.byId("analyticalChart");
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            assert.ok(cardViz !== undefined, "Existence check to VizFrame");

            var expectedListRes = oCardSettings.expectedResult.Body;
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
            assert.ok(ChartUtils.ovpNodeExists(cardXml, false, false), "OVP Card - see that there is a OVP Card Format");
            assert.ok(
                ChartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions),
                "VIZ Frame - see that there is dimensions binding"
            );
            assert.ok(
                ChartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures),
                "VIZ Frame - see that there is measures binding"
            );
            assert.ok(
                ChartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds),
                "VIZ Frame - see that there is feed binding"
            );
            assert.ok(
                cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                "legends are set with the correct item margin"
            );
            fnDone();
        });
    });
});
