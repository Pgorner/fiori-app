/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ui/core/mvc/Controller",
    "sap/ovp/cards/charts/VizAnnotationManager",
    "sap/ui/core/Element"
], function (cardUtils, oChartUtils, mockservers, Controller, OvpVizAnnotationManager, Element) {
    "use strict";

    // Preloading the VIZ library before executing the tests to prevent the time out issue during the execution of tests.

    var chartUtils = oChartUtils;
    var parameterTestCase = "Donut chart - With Input Parameters";
    var oController;

    QUnit.module("sap.ovp.cards.charts.Donut", {
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
            return Controller.create({
                name: "sap.ovp.cards.charts.analytical.analyticalChart"
            }).then(function(controller) { 
                oController = controller;
            });
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        afterEach: function () {
            mockservers.close();
        },
    });

    QUnit.test("Donut chart - Without Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_1",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    type: "sap.ovp.cards.charts.donut.DonutChart",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
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
                        vizType: "donut",
                        dataSet: {
                            // make sure to check the blank spaces
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
                                    uid: "size",
                                    type: "Measure",
                                    values: "Sales Share",
                                },
                                {
                                    uid: "color",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");

            assert.ok(
                chartUtils.vizNodeExists(cardXml, "donut"),
                "VIZ Frame - see that there is a VIZFrame for Donut chart"
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

    QUnit.test("Donut chart - With Filters", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_2",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    type: "sap.ovp.cards.charts.donut.DonutChart",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
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
                        vizType: "donut",
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
                                    uid: "size",
                                    type: "Measure",
                                    values: "Sales Share",
                                },
                                {
                                    uid: "color",
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
                chartUtils.vizNodeExists(cardXml, "donut"),
                "VIZ Frame - see that there is a VIZFrame for Donut chart"
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

    QUnit.test("Donut chart - With Filters Without Sorter", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_3",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    type: "sap.ovp.cards.charts.donut.DonutChart",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
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
                        vizType: "donut",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                filters: [{ path: "Country", operator: "EQ", value1: "IN" }],
                            },
                            dimensions: [
                                {
                                    name: "Supplier Company",
                                    value: "{SupplierCompany}",
                                    displayValue: "{SupplierCompany}",
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
                                    uid: "size",
                                    type: "Measure",
                                    values: "Sales Share",
                                },
                                {
                                    uid: "color",
                                    type: "Dimension",
                                    values: "Supplier Company",
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
                chartUtils.vizNodeExists(cardXml, "donut"),
                "VIZ Frame - see that there is a VIZFrame for Donut chart"
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

    QUnit.test(parameterTestCase, function (assert) {
        var cardTestData = {
            card: {
                id: "chart_4",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesOrder",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country2",
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
                        vizType: "donut",
                        dataSet: {
                            data: {
                                path: "/SalesOrderParameters(P_Currency=%27EUR%27,P_CountryCode=%27IN%27)/Results",
                                filters: [],
                                sorter: [],
                                parameters: { select: "Country,NetAmount" },
                                length: 5,
                            },
                            dimensions: [
                                {
                                    name: "Product ID",
                                    value: "{ProductID}",
                                    displayValue: "{Product}",
                                },
                            ],
                            measures: [
                                {
                                    name: "Net Amount",
                                    value: "{NetAmount}",
                                },
                            ],

                            feeds: [
                                {
                                    uid: "size",
                                    type: "Measure",
                                    values: "Net Amount",
                                },
                                {
                                    uid: "color",
                                    type: "Dimension",
                                    values: "Product ID",
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
                chartUtils.vizNodeExists(cardXml, "donut"),
                "VIZ Frame - see that there is a VIZFrame for Donut chart"
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

    QUnit.test("Donut chart - With faulty filter configuration", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_5",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    type: "sap.ovp.cards.charts.donut.DonutChart",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#NON_EXISTENT",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
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
                        vizType: "donut",
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
                            feeds: [
                                {
                                    uid: "size",
                                    type: "Measure",
                                    values: "Sales Share",
                                },
                                {
                                    uid: "color",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");

            assert.ok(
                chartUtils.vizNodeExists(cardXml, "donut"),
                "VIZ Frame - see that there is a VIZFrame for Donut chart"
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

    QUnit.test("Donut chart - Without DataPoint Annotation", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_6",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    type: "sap.ovp.cards.charts.donut.DonutChart",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
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
                        vizType: "donut",
                        dataSet: {
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
                                    uid: "size",
                                    type: "Measure",
                                    values: "Sales Share",
                                },
                                {
                                    uid: "color",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");

            assert.ok(
                chartUtils.vizNodeExists(cardXml, "donut"),
                "VIZ Frame - see that there is a VIZFrame for Donut chart"
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

    QUnit.test("Donut chart - With DataPoint, Without Title and Value", function (assert) {
        var cardTestData = {
            card: {
                id: "chart_7",
                model: "salesShare",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "SalesShare",
                    type: "sap.ovp.cards.charts.donut.DonutChart",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
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
                        vizType: "donut",
                        dataSet: {
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
                                    uid: "size",
                                    type: "Measure",
                                    values: "Sales Share",
                                },
                                {
                                    uid: "color",
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
            assert.ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");

            assert.ok(
                chartUtils.vizNodeExists(cardXml, "donut"),
                "VIZ Frame - see that there is a VIZFrame for Donut chart"
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

    QUnit.test("Donut chart - With ObjectStream Filters", function (assert) {
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
                    type: "sap.ovp.cards.charts.donut.DonutChart",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
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
                        vizType: "donut",
                        dataSet: {
                            data: {
                                path: "/SalesShare",
                                filters: [
                                    { path: "Country", operator: "EQ", value1: "IN" },
                                    { path: "Country", operator: "EQ", value1: "US" },
                                    { path: "Region", operator: "EQ", value1: "APJ" },
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
                                    uid: "size",
                                    type: "Measure",
                                    values: "Sales Share",
                                },
                                {
                                    uid: "color",
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
                chartUtils.vizNodeExists(cardXml, "donut"),
                "VIZ Frame - see that there is a VIZFrame for Donut chart"
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

        QUnit.test("Donut chart - With MeasureAttributes and DimensionAttributes missing", function (assert) {
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
                        type: "sap.ovp.cards.charts.donut.DonutChart",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                        presentationAnnotationPath:
                            "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
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
                            vizType: "donut",
                            dataSet: {
                                data: {
                                    path: "/SalesShare",
                                    filters: [
                                        { path: "Country", operator: "EQ", value1: "IN" },
                                        { path: "Country", operator: "EQ", value1: "US" },
                                        { path: "Region", operator: "EQ", value1: "APJ" },
                                    ],
                                    sorter: [{ path: "Sales", descending: true }],
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

                // basic list XML structure tests
                assert.ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
                assert.ok(
                    chartUtils.vizNodeNotExists(cardXml, "donut"),
                    "VIZ Frame - see that there is no VIZFrame rendered for Donut chart"
                );
                fnDone();
            });
        });

        QUnit.test("Donut chart - With Zero MeasureAttributes and DimensionAttributes", function (assert) {
            var cardTestData = {
                card: {
                    id: "chart_10",
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
                        type: "sap.ovp.cards.charts.donut.DonutChart",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency2",
                        presentationAnnotationPath:
                            "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
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
                            vizType: "donut",
                            dataSet: {
                                // make sure to check the blank spaces
                                data: {
                                    path: "/SalesShare",
                                    filters: [
                                        { path: "Country", operator: "EQ", value1: "IN" },
                                        { path: "Country", operator: "EQ", value1: "US" },
                                        { path: "Region", operator: "EQ", value1: "APJ" },
                                    ],
                                    sorter: [{ path: "Sales", descending: true }],
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
                    chartUtils.vizNodeNotExists(cardXml, "donut"),
                    "VIZ Frame - see that there is no VIZFrame rendered for Donut chart"
                );
                fnDone();
            });
        });

        function chartFunctions(oController, card, cardViz, oView) {
            oController.getView = function () {
                return {
                    byId: function (id) {
                        if (id === "analyticalChart") {
                            var vizCard = cardViz;

                            var oModel = {
                                entityType: {
                                    "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr": {
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
                                                AnnotationPath:
                                                    "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut",
                                            },
                                        ],
                                    },
                                },
                                presentationAnnotationPath:
                                    "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                                chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut",
                                dataStep: 11,
                            };
                            vizCard.setModel(oView.getModel("ovpCardProperties"), "ovpCardProperties");
                            var binding = vizCard.getParent().getBinding("data");
                            binding.mParameters = { select: "ProductID,Sales" };

                            var newAggrBinding = {};
                            newAggrBinding.path = "/SalesShare";
                            newAggrBinding.parameters = {
                                select: "Sales",
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
        QUnit.test("Donut chart - Customizing with stable Array colorPalette - 20 colors", function (assert) {
            var cardTestData = {
                card: {
                    id: "chart_11",
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                        presentationAnnotationPath:
                            "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                        type: "sap.ovp.cards.charts.donut.DonutChart",
                        bEnableStableColors: true,
                        colorPalette: [
                            {
                                color: "sapUiChartPaletteSemanticNeutral",
                                dimensionValue: "HT-1210",
                            },
                            {
                                color: "sapUiChartPaletteSemanticBadDark1",
                                dimensionValue: "HT-8002",
                            },
                            {
                                color: "sapUiChartPaletteSemanticCriticalDark2",
                                dimensionValue: "HT-2002",
                            },
                            {
                                color: "sapUiChartPaletteSemanticCritical",
                                dimensionValue: "HT-3001",
                            },
                            {
                                color: "sapUiChartPaletteSemanticGoodLight2",
                                dimensionValue: "HT-1019",
                            },
                            {
                                color: "sapUiChartPaletteSemanticNeutral",
                                dimensionValue: "HT-1211",
                            },
                            {
                                color: "sapUiChartPaletteSemanticBadDark1",
                                dimensionValue: "HT-8003",
                            },
                            {
                                color: "sapUiChartPaletteSemanticCriticalDark2",
                                dimensionValue: "HT-2003",
                            },
                            {
                                color: "sapUiChartPaletteSemanticCritical",
                                dimensionValue: "HT-3002",
                            },
                            {
                                color: "sapUiChartPaletteSemanticGoodLight2",
                                dimensionValue: "HT-1020",
                            },
                            {
                                color: "sapUiChartPaletteSemanticNeutral",
                                dimensionValue: "HT-1212",
                            },
                            {
                                color: "sapUiChartPaletteSemanticBadDark1",
                                dimensionValue: "HT-8004",
                            },
                            {
                                color: "sapUiChartPaletteSemanticCriticalDark2",
                                dimensionValue: "HT-2004",
                            },
                            {
                                color: "sapUiChartPaletteSemanticCritical",
                                dimensionValue: "HT-3003",
                            },
                            {
                                color: "sapUiChartPaletteSemanticGoodLight2",
                                dimensionValue: "HT-1021",
                            },
                            {
                                color: "sapUiChartPaletteSemanticNeutral",
                                dimensionValue: "HT-1213",
                            },
                            {
                                color: "sapUiChartPaletteSemanticBadDark1",
                                dimensionValue: "HT-8005",
                            },
                            {
                                color: "sapUiChartPaletteSemanticCriticalDark2",
                                dimensionValue: "HT-2005",
                            },
                            {
                                color: "sapUiChartPaletteSemanticCritical",
                                dimensionValue: "HT-3004",
                            },
                            {
                                color: "sapUiChartPaletteSemanticGoodLight2",
                                dimensionValue: "HT-1022",
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
                            vizType: "donut",
                            dataSet: {
                                data: {
                                    path: "/SalesShare",
                                    sorter: [{ path: "Sales", descending: true }],
                                    filters: [
                                        { path: "Country", operator: "EQ", value1: "IN" },
                                        { path: "Country", operator: "EQ", value1: "US" },
                                    ],
                                    length: 4,
                                },
                                dimensions: [
                                    {
                                        name: "Product ID",
                                        value: "{ProductID}",
                                        displayValue: "{Product}",
                                    },
                                ],
                                measures: [
                                    {
                                        name: "Sales",
                                        value: "{Sales}",
                                    },
                                ],
                            },
                            feeds: [
                                {
                                    uid: "size",
                                    type: "Measure",
                                    values: "Sales",
                                },
                                {
                                    uid: "color",
                                    type: "Dimension",
                                    values: "Product ID",
                                },
                            ],
                            vizRules: {
                                "rules": [
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-1210"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticNeutral"
                                        },
                                        "displayName": "Alpha"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-8002"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticBadDark1"
                                        },
                                        "displayName": "Beta"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-2002"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticCriticalDark2"
                                        },
                                        "displayName": "Gama"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-3001"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticCritical"
                                        },
                                        "displayName": "UV"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-1019"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticGoodLight2"
                                        },
                                        "displayName": "Xray"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-1211"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticNeutral"
                                        },
                                        "displayName": "Alpha1"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-8003"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticBadDark1"
                                        },
                                        "displayName": "Beta1"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-2003"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticCriticalDark2"
                                        },
                                        "displayName": "Gama1"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-3002"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticCritical"
                                        },
                                        "displayName": "UV1"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-1020"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticGoodLight2"
                                        },
                                        "displayName": "Xray1"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-1212"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticNeutral"
                                        },
                                        "displayName": "Alpha2"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-8004"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticBadDark1"
                                        },
                                        "displayName": "Beta2"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-2004"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticCriticalDark2"
                                        },
                                        "displayName": "Gama2"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-3003"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticCritical"
                                        },
                                        "displayName": "UV2"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-1021"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticGoodLight2"
                                        },
                                        "displayName": "Xray2"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-1213"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticNeutral"
                                        },
                                        "displayName": "Alpha3"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-8005"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticBadDark1"
                                        },
                                        "displayName": "Beta3"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-2005"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticCriticalDark2"
                                        },
                                        "displayName": "Gama3"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-3004"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticCritical"
                                        },
                                        "displayName": "UV3"
                                    },
                                    {
                                        "dataContext": {
                                            "Product ID": "HT-1022"
                                        },
                                        "properties": {
                                            "color": "sapUiChartPaletteSemanticGoodLight2"
                                        },
                                        "displayName": "Xray3"
                                    }
                                ]
                            }
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
                    chartUtils.vizNodeExists(cardXml, "donut"),
                    "VIZ Frame - see that there is a VIZFrame for donut chart"
                );
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
                    chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds),
                    "VIZ Frame - see that there is feed binding"
                );
                assert.ok(
                    cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                    "legends are set with the correct item margin"
                );
                //chartFunctions(oController, "chart_11", cardViz, oView);
                var oItemsBinding = oView.getController().getCardItemsBinding();

                oItemsBinding.fireDataReceived({
                    data: {
                        results: [
                            {
                                ProductID: "HT-1210",
                                Sales: "97680",
                                Product: "Alpha"
                            },
                            {
                                ProductID: "HT-8002",
                                Sales: "79800",
                                Product: "Beta"
                            },
                            {
                                ProductID: "HT-2002",
                                Sales: "136800",
                                Product: "Gama"
                            },
                            {
                                ProductID: "HT-3001",
                                Sales: "126800",
                                Product: "UV"
                            },
                            {
                                ProductID: "HT-1019",
                                Sales: "145800",
                                Product: "Xray"
                            },
                            {
                                ProductID: "HT-1211",
                                Sales: "97680",
                                Product: "Alpha1"
                            },
                            {
                                ProductID: "HT-8003",
                                Sales: "79800",
                                Product: "Beta1"
                            },
                            {
                                ProductID: "HT-2003",
                                Sales: "136800",
                                Product: "Gama1"
                            },
                            {
                                ProductID: "HT-3002",
                                Sales: "126800",
                                Product: "UV1"
                            },
                            {
                                ProductID: "HT-1020",
                                Sales: "145800",
                                Product: "Xray1"
                            },
                            {
                                ProductID: "HT-1212",
                                Sales: "97680",
                                Product: "Alpha2"
                            },
                            {
                                ProductID: "HT-8004",
                                Sales: "79800",
                                Product: "Beta2"
                            },
                            {
                                ProductID: "HT-2004",
                                Sales: "136800",
                                Product: "Gama2"
                            },
                            {
                                ProductID: "HT-3003",
                                Sales: "126800",
                                Product: "UV2"
                            },
                            {
                                ProductID: "HT-1021",
                                Sales: "145800",
                                Product: "Xray2"
                            },
                             {
                                ProductID: "HT-1213",
                                Sales: "97680",
                                Product: "Alpha3"
                            },
                            {
                                ProductID: "HT-8005",
                                Sales: "79800",
                                Product: "Beta3"
                            },
                            {
                                ProductID: "HT-2005",
                                Sales: "136800",
                                Product: "Gama3"
                            },
                            {
                                ProductID: "HT-3004",
                                Sales: "126800",
                                Product: "UV3"
                            },
                            {
                                ProductID: "HT-1022",
                                Sales: "145800",
                                Product: "Xray3"
                            },
                        ],
                        __count: 20
                    },
                });

                cardViz
                    .getParent()
                    .getBinding("aggregateData")
                    .fireDataReceived({
                        data: {
                            results: [
                                {
                                    Sales: "97680",
                                },
                            ],
                            __count: 1,
                        },
                    });

                var result = cardViz.getVizProperties().plotArea.dataPointStyle;
                assert.deepEqual(
                    result,
                    expectedListRes.VizFrame.vizRules,
                    "Coloring rules should be present as per color palette"
                );
                // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
                // assert.ok(
                //     chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data),
                //     "VIZ Frame - see that there is data binding after colors are set"
                // );
                fnDone();
            });
        });

        QUnit.test("Donut chart - Customizing with stable Map colorPalette - 5 colors", function (assert) {
            var cardTestData = {
                card: {
                    id: "chart_12",
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                        presentationAnnotationPath:
                            "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                        type: "sap.ovp.cards.charts.donut.DonutChart",
                        bEnableStableColors: true,
                        colorPalette: {
                            "HT-1210": "sapUiChartPaletteSemanticNeutral",
                            "HT-8002": "sapUiChartPaletteSemanticBadDark1",
                            "HT-2002": "sapUiChartPaletteSemanticCriticalDark2",
                            "HT-3001": "sapUiChartPaletteSemanticCritical",
                            "HT-1019": "sapUiChartPaletteSemanticGoodLight2",
                        },
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
                            vizType: "donut",
                            dataSet: {
                                data: {
                                    path: "/SalesShare",
                                    sorter: [{ path: "Sales", descending: true }],
                                    filters: [
                                        { path: "Country", operator: "EQ", value1: "IN" },
                                        { path: "Country", operator: "EQ", value1: "US" },
                                    ],
                                    length: 4,
                                },
                                dimensions: [
                                    {
                                        name: "Product ID",
                                        value: "{ProductID}",
                                        displayValue: "{Product}",
                                    },
                                ],
                                measures: [
                                    {
                                        name: "Sales",
                                        value: "{Sales}",
                                    },
                                ],
                            },
                            feeds: [
                                {
                                    uid: "size",
                                    type: "Measure",
                                    values: "Sales",
                                },
                                {
                                    uid: "color",
                                    type: "Dimension",
                                    values: "Product ID",
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

                var newAggrBinding = {};
                newAggrBinding.path = "/SalesShare";
                newAggrBinding.parameters = {
                    select: "Sales",
                };
                newAggrBinding.length = 1;
                newAggrBinding.template = new Element();
                cardViz.getParent().bindAggregation("aggregateData", newAggrBinding);
                cardViz.getParent().setDependentDataReceived(true);

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
                assert.ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
                // assert.ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for donut chart");
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
                    chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds),
                    "VIZ Frame - see that there is feed binding"
                );
                assert.ok(
                    cardViz.getVizProperties()["legend"].itemMargin === 1.25,
                    "legends are set with the correct item margin"
                );
                // chartFunctions(oController, "chart_12", cardViz, oView);
                // var oItemsBinding = oController.getCardItemsBinding();

                // oItemsBinding.fireDataReceived({
                //     data: {
                //         results: [
                //             {
                //                 ProductID: "HT-1210",
                //                 Sales: "97680",
                //             },
                //             {
                //                 ProductID: "HT-8002",
                //                 Sales: "79800",
                //             },
                //             {
                //                 ProductID: "HT-2002",
                //                 Sales: "136800",
                //             },
                //             {
                //                 ProductID: "HT-3001",
                //                 Sales: "126800",
                //             },
                //             {
                //                 ProductID: "HT-1019",
                //                 Sales: "145800",
                //             },
                //         ],
                //         __count: 5,
                //     },
                // });

                // cardViz
                //     .getParent()
                //     .getBinding("aggregateData")
                //     .fireDataReceived({
                //         data: {
                //             results: [
                //                 {
                //                     Sales: "97680",
                //                 },
                //             ],
                //             __count: 1,
                //         },
                //     });
                // Read explaination for commenting out at sap/ovp/qunit/cards/charts/utils -> dataBinding function.
                //assert.ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding after colors are set");
                fnDone();
            });
        });
    });
});
