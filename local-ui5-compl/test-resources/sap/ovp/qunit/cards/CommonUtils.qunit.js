/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/CommonUtils",
    "sap/ui/core/ComponentContainer",
    "sap/m/VBox",
    "sap/base/Log",
    "sap/fe/navigation/SelectionVariant",
    "sap/ui/core/Element"
], function (
    Utils,
    ChartUtils,
    Mockservers,
    CommonUtils,
    ComponentContainer,
    VBox,
    Log,
    SelectionVariant,
    CoreElement
) {
    "use strict";

    var errorSpy;

    QUnit.module("CommonUtils", {
         beforeEach: function () {
            Mockservers.loadMockServer(Utils.odataBaseUrl_salesOrder, Utils.odataRootUrl_salesOrder);
            Mockservers.loadMockServer(ChartUtils.odataBaseUrl, ChartUtils.odataRootUrl);
            errorSpy = sinon.spy(Log, "error");
            document.body.insertAdjacentHTML("beforeend", '<div id="testContainer" style="display: none;">');
        },
        afterEach: function () {
            Mockservers.close();
            errorSpy.restore();
			if (document.getElementById("testContainer")) {
				document.getElementById("testContainer").remove();
			}
        }
    });

    QUnit.test("Null Checks for API", function (assert) {
        CommonUtils.createCardComponent(null, null, null);
        assert.ok(errorSpy.calledWith("Second argument oManifest is null"), "Second argument, oManifest is not present");

        var oManifest = {
            cards: {}
        };
        CommonUtils.createCardComponent(null, oManifest, null);
        assert.ok(errorSpy.calledWith("Cards manifest entry or cardId is null"), "Cards manifest entry or cardId is not present");

        oManifest = {
            cards: {
                card_name: {
                    template: "sap.ovp.cards.stack",
                    settings: {}
                }
            }
        };
        CommonUtils.createCardComponent(null, oManifest, null);
        assert.ok(errorSpy.calledWith("Cards template or model or settings are not defined"), "Cards model is not present");

        oManifest = {
            cards: {
                card_name: {
                    model: "salesOrder",
                    template: "sap.ovp.cards.stack"
                }
            }
        };
        CommonUtils.createCardComponent(null, oManifest, null);
        assert.ok(errorSpy.calledWith("Cards template or model or settings are not defined"), "Cards settings are not present");

        oManifest = {
            cards: {
                card_name: {
                    model: "salesOrder",
                    settings: {}
                }
            }
        };
        CommonUtils.createCardComponent(null, oManifest, null);
        assert.ok(errorSpy.calledWith("Cards template or model or settings are not defined"), "Cards template is not present");

        oManifest = {
            cards: {
                card_name: {
                    model: "salesOrder",
                    template: "sap.ovp.cards.map",
                    settings: {}
                }
            }
        };
        var oTemplate = oManifest.cards["card_name"].template;
        CommonUtils.createCardComponent(null, oManifest, null);
        assert.ok(errorSpy.calledWith(oTemplate + " card type is not supported in the API"), "card type is not supported in the API");

        oManifest = {
            cards: {
                card006_NewSalesOrders: {
                    model: "salesOrder",
                    template: "sap.ovp.cards.table",
                    settings: {}
                }
            }
        };
        CommonUtils.createCardComponent(null, oManifest, null);
        assert.ok(errorSpy.calledWith("ContainerId should be of type string and not null"), "ContainerId is null");

        oManifest = {
            cards: {
                card006_NewSalesOrders: {
                    model: "salesOrder",
                    template: "sap.ovp.cards.table",
                    settings: {}
                }
            }
        };
        CommonUtils.createCardComponent(null, oManifest, {});
        assert.ok(errorSpy.calledWith("ContainerId should be of type string and not null"), "ContainerId is not of type string");

        oManifest = {
            cards: {
                card006_NewSalesOrders: {
                    model: "salesOrder",
                    template: "sap.ovp.cards.table",
                    settings: {}
                }
            }
        };
        CommonUtils.createCardComponent(null, oManifest, "card002_ReorderSoon");
        assert.ok(errorSpy.calledWith("First argument oView is null"), "First argument oView is not present");
    });

    QUnit.test("Card Test - For API - Table Card", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: Utils.odataBaseUrl_salesOrder,
                rootUri: Utils.odataRootUrl_salesOrder,
                annoUri: Utils.testBaseUrl + "data/annotationsKPI.xml"
            }
        };
        var oManifest = {
            cards: {
                card_14: {
                    model: "salesOrder",
                    template: "sap.ovp.cards.table",
                    settings: {
                        category: "Contract Monitoring",
                        title: "Contract Expiry, Consumption and Target Value",
                        description: "",
                        listFlavor: "bar",
                        listType: "extended",
                        entitySet: "SalesOrderSet",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#line"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox2");
                oView.setModel(oModel, "salesOrder");
                var oComponentContainer = new ComponentContainer("card_14");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "card_14");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - List Card", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: Utils.odataBaseUrl_salesOrder,
                rootUri: Utils.odataRootUrl_salesOrder,
                annoUri: Utils.testBaseUrl + "data/annotations_barListCard.xml"
            }
        };
        var oManifest = {
            cards: {
                card002_ReorderSoon: {
                    model: "salesOrder",
                    template: "sap.ovp.cards.list",
                    settings: {
                        category: "Sales Orders - listType = Condensed Bar List",
                        title: "Bar List Card",
                        description: "",
                        listType: "condensed",
                        listFlavor: "bar",
                        entitySet: "ProductSet"
                    },
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox1");
                oView.setModel(oModel, "salesOrder");
                var oComponentContainer = new ComponentContainer("card002_ReorderSoon1");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "card002_ReorderSoon1");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Analytical Card - Bubble Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_15: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr1",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                        type: "sap.ovp.cards.charts.bubble.BubbleChart"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox3");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_15");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_15");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Analytical Card - Column Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_16: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Column_Eval_by_Currency",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                    }
                }
            }
        };
        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox4");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_16");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_16");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Analytical Card - Combination Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_17: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Combination",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Combination",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Combination",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Combination"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox5");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_17");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_17");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Analytical Card - Donut Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_18: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        type: "sap.ovp.cards.charts.donut.DonutChart",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox6");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_18");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_18");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Analytical Card - Line Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_19: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                    }
                }
            }
        };
        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox7");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_19");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_19");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Analytical Card - Scatter Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_20: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Scatter",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Scatter",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Scatter",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Scatter",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        
        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox8");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_20");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_20");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Analytical Card - Stacked Column Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_21: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox9");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_21");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_21");
                assert.ok(true, "createCardComponent function was executed");
                fnDone()
            });
    });

    QUnit.test("Card Test - For API - Analytical Card - Vertical Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_22: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#VerticalEval_by_Currency",
                        presentationAnnotationPath:
                            "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        
        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox10");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_22");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_22");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Bubble Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_23: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.bubble",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                        type: "sap.ovp.cards.charts.bubble.BubbleChart"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox11");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_23");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_23");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Donut Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_24: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.donut",
                    settings: {
                        entitySet: "SalesShare",
                        type: "sap.ovp.cards.charts.donut.DonutChart",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        
        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox12");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_24");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_24");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Line Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_25: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.line",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr",
                        type: "sap.ovp.cards.charts.line.LineChart",
                        presentationAnnotationPath:
                            "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox13");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_25");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_25");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Card Test - For API - Smart Chart Card - Semantic Line Chart", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_mock.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_27: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.smart.chart",
                    settings: {
                        dataStep: "11",
                        title: "(SC) Semantic Line Chart - Static",
                        subTitle: "Sales and Total Sales by Country",
                        valueSelectionInfo: "value selection info",
                        cardLayout: {
                            colSpan: 1,
                        },
                        entitySet: "SalesShareSemanticSmartChart",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Empty",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#SemanticLineChart",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#SemanticLineChart",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#SalesKPI",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#ToProcurement"
                    }
                }
            }
        };

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox16");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_27");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_27");
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("OVP Card API called with selectionVariant Object as Fourth argument for filtering", function (assert) {
        var cardTestData = {
            dataSource: {
                baseUrl: ChartUtils.odataBaseUrl,
                rootUri: ChartUtils.odataRootUrl,
                annoUri: ChartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
            }
        };
        var oManifest = {
            cards: {
                chart_100: {
                    model: "salesShare",
                    template: "sap.ovp.cards.charts.analytical",
                    settings: {
                        entitySet: "SalesShare",
                        selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Scatter",
                        chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Scatter",
                        presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Scatter",
                        dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Scatter",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
                    }
                }
            }
        };

        var oSelectionVariant = new SelectionVariant();
        oSelectionVariant.addSelectOption("TotalSalesForecast", "I", "BT", "3000", "3500");
        oSelectionVariant.addSelectOption("TotalSalesForecast", "I", "BT", "3500", "4000");
        oSelectionVariant.addParameter("Product", "Silverberry");

        var oModel = Utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        
        oModel.getMetaModel().loaded()
            .then(function () {
                var oView = new VBox("TestVBox14");
                oView.setModel(oModel, "salesShare");
                var oComponentContainer = new ComponentContainer("chart_100");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return CoreElement.getElementById(id);
                };
                oView.placeAt("testContainer");
                CommonUtils.createCardComponent(oView, oManifest, "chart_100", oSelectionVariant);
                assert.ok(true, "createCardComponent function was executed");
                fnDone();
            });
    });

    QUnit.test("Shows the error messages from the body of an HTTP response", function (assert) {
        var oCommonUtils = CommonUtils;
        assert.ok(oCommonUtils.showODataErrorMessages(null) === "", "Null Error Scenario");

        var oError = { responseText: "Just Text", };
        assert.ok(oCommonUtils.showODataErrorMessages(oError) === "", "With Some Response Text Scenario");
        
        oError = {
            responseText: '{"error": {"innererror": {"errordetails": [{"message": "Some Error.", "severity": "error"}]}, "message": {"value": "ABAP Error:"}}}',
        };
        assert.ok(oCommonUtils.showODataErrorMessages(oError) === "ABAP Error: Some Error ", "Correct BackEnd error Scenario");
    });

    QUnit.test("Get card id without component prefix", function(assert) {
        assert.ok(CommonUtils.removePrefixAndReturnLocalId("application-sa-obj-component---mainView--card01") === "mainView--card01", "Component prefix is removed from id");
        assert.ok(CommonUtils.removePrefixAndReturnLocalId("mainView--card01") === "mainView--card01", "Id is returned as it is without component prefix");
    });
    QUnit.test("Get all custom cards", function (assert) {
        var oCommonUtils = CommonUtils;
        var aCards = [
            {
                "model": "CATALOG_MODEL_V2",
                "template": "bookshop.ext.simpleV2CustomCard",
                "id": "card201"
            },
            {
                "model": "CATALOG_MODEL_V2",
                "template": "bookshop.ext.table",
                "id": "card201_custom_v2"
            },
            {
                "model": "CATALOG_MODEL_V4",
                "template": "bookshop.ext.tableV4",
                "id": "card201_custom_v4"
            },
            {
                "model": "CATALOG_MODEL_V2",
                "template": "sap.ovp.cards.list",
                "id": "card_01_v2"
            },
            {
                "model": "CATALOG_MODEL_V2",
                "template": "sap.ovp.cards.list",
                "id": "card_01_v2_Exclude_Filters"
            },
            {
                "model": "CATALOG_MODEL_V4",
                "template": "sap.ovp.cards.v4.list",
                "id": "card_01_v4"
            }
        ];
        var aCustomCards = oCommonUtils.getCustomCards(aCards);
        assert.ok(aCustomCards.length === 3, "Valid number of custom cards filtered.");
    });
});
