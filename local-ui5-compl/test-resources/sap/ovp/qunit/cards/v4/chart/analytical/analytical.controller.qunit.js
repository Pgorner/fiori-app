/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/Mockserver/MockServerHelper",
    "sap/ovp/cards/v4/charts/VizAnnotationManager",
    "sap/ovp/cards/charts/VizAnnotationManager",
    "sap/ovp/filter/FilterUtils",
    "sap/viz/ui5/controls/VizFrame",
    "sap/ui/model/odata/v4/ODataListBinding",
    "sap/m/VBox",
    "sap/ovp/cards/v4/V4AnnotationHelper"
], function (
    MockServerHelper,
    V4VizAnnotationManager,
    V2VizAnnotationManager,
    FilterUtils,
    VizFrame,
    ODataListBinding,
    VBox,
    V4AnnotationHelper
) {
    "use strict";

    var oConfig, oVizFrame, oLayout;

    QUnit.module("sap.ovp.qunit.cards.v4.chart.analytical.analytical.controller", {
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
                id: "card010",
            };
        },
        afterEach: function () {
            MockServerHelper.closeServer();
        },
    });

    QUnit.test("function onAfterRendering - v4AnalyticalController", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var createFilterUtilsStub = sinon.stub(FilterUtils, "applyFiltersToV4AnalyticalCard");
                oView.getController().getOwnerComponent().getModel = function (sName) {
                    return {
                        getData: function () {
                            return {
                                cards: [
                                    {
                                        model: "CATALOG_MODEL_V4",
                                        template: "sap.ovp.cards.v4.charts.analytical",
                                        settings: {
                                            title: "Most Popular Products V4",
                                            subTitle: "In the last six months",
                                            entitySet: "Books",
                                            chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#donutchart",
                                        },
                                        id: "card010",
                                    },
                                ],
                            };
                        },
                        getProperty: function(sParam) {
                            if (sParam === "/bRTAActive") {
                                return false;
                            }
                        }
                    };
                };
                oView.getController().oCardComponentData.mainComponent = {
                    getGlobalFilter: function () {
                        return true;
                    },
                    oGlobalFilter: {
                        getFilters: function () {
                            return [];
                        },
                    },
                    getMacroFilterBar: function () {
                        return false;
                    },
                };

                oView.getController().onAfterRendering();
                assert.ok(
                    !oView.getController().selectionVaraintFilter.length,
                    "Selection variant filter is not initialized"
                );
                assert.ok(
                    !FilterUtils.applyFiltersToV4AnalyticalCard.calledOnce,
                    "applyFiltersToV4AnalyticalCard method is not called succesfully for analytical chart after rendering."
                );

                document.body.insertAdjacentHTML(
                    "beforeend",
                    '<div id="card010-DomRef" style="display: none;"><div class="sapOvpWrapper"></div></div>'
                );
                var testContainer = document.querySelector("#card010-DomRef");

                oView.getController().getCardPropertiesModel().oData.layoutDetail = "resizable";

                var oController = oView.getController();
                oController.cardId = "card010";
                oController.oDashboardLayoutUtil = {
                    aCards: {
                        model: "CATALOG_MODEL_V4",
                        template: "sap.ovp.cards.v4.charts.analytical",
                        settings: {
                            title: "Most Popular Products V4",
                            subTitle: "In the last six months",
                            entitySet: "Books",
                            chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#donutchart",
                        },
                        id: "card010",
                    },
                    dashboardLayoutModel: {
                        getCardById: function (sCardId) {
                            return {
                                model: "CATALOG_MODEL_V4",
                                template: "sap.ovp.cards.v4.charts.analytical",
                                settings: {
                                    title: "Most Popular Products V4",
                                    subTitle: "In the last six months",
                                    entitySet: "Books",
                                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#donutchart",
                                },
                                id: "card010",
                                dashboardLayout: {
                                    rowSpan: 2,
                                    showOnlyHeader: true,
                                },
                            };
                        },
                    },
                    getCardDomId: function (sCardId) {
                        return "card010-DomRef";
                    },
                    isCardAutoSpan: function () { },
                    ROW_HEIGHT_PX: 3,
                    CARD_BORDER_PX: 2,
                };
                oController.getHeaderHeight = function () {
                    return 2;
                };
                oView.getController().onAfterRendering();

                var ovpWrapperHeight = document
                    .getElementById("card010-DomRef")
                    .getElementsByClassName("sapOvpWrapper")[0].style.height;
                var aCardClassList = document.getElementById("card010-DomRef").classList;
                assert.ok(ovpWrapperHeight === "2px", "The ovp wrapper height is calculated, layout is resizable");
                assert.ok(
                    aCardClassList.value === "sapOvpMinHeightContainer",
                    "The header class is added successfully for the card, as showOnlyHeader is true"
                );
                testContainer.parentNode.removeChild(testContainer);
                createFilterUtilsStub.restore();
                fnDone();
            });
        });
    });

    QUnit.test("function onInit - v4AnalyticalController", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oController = oView.getController();
                oController.GloabalEventBus.subscribe = sinon.spy();
                oController.onInit();
                assert.ok(
                    !oController.GloabalEventBus.subscribe.calledOnce,
                    "The global Event bus is not subscribed as the maincomponent is not initialized."
                );
                oController.oCardComponentData.mainComponent = {
                    oGlobalFilter: true,
                };
                oController.onInit();
                assert.ok(
                    oController.GloabalEventBus.subscribe.calledOnce === true,
                    "The global Event bus is subscribed as the maincomponent is present."
                );
                fnDone();
            });
        });
    });

    QUnit.test("function onBeforeRendering, onDataRequested, getCardItemsBinding - v4AnalyticalController", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oController = oView.getController();
                assert.ok(!oController.bCardProcessed, "Controller is not yet processed.");
                assert.ok(!oController.isVizPropSet, "viz Properties are not yet set vizFrame is not present.");
                assert.ok(!oController.vizFrame, "Viz Frame is not present.");
                oController.onBeforeRendering();
                assert.ok(oController.bCardProcessed, "controller is processed.");

                oController.getCardPropertiesModel().oData.layoutDetail = "resizable";
                oView.byId = function (sPath) {
                    if (sPath === "analyticalChart") {
                        if (!oVizFrame) {
                            oVizFrame = new VizFrame(
                                "Vcard010_cardchartsdonut--analyticalChart",
                                {
                                    uiConfig: { applicationSet: "fiori" },
                                    vizCustomizations: null,
                                    vizProperties: null,
                                    vizScales: null,
                                    vizType: "donut",
                                    width: "100%",
                                }
                            );
                            oVizFrame.setModel(oController.getCardPropertiesModel(), "ovpCardProperties");
                            oVizFrame.addEventDelegate = sinon.spy();
                            oVizFrame.getParent = function () {
                                return {
                                    getBinding: function (sPath) {
                                        return new ODataListBinding(
                                            oView.getModel(),
                                            "/Books"
                                        );
                                    },
                                    invalidate: function (sPath) {
                                        return false;
                                    },
                                    isInvalidateSuppressed: function() {
                                        return false;
                                    }
                                };
                            };
                        }
                        return oVizFrame;
                    } else if (sPath === "vbLayout") {
                        oLayout = new VBox("Vcard010_cardchartsdonut--vbLayout1", { direction: "Column" });
                        return oLayout;
                    }
                };
                assert.ok(
                    !oController.onBeforeRendering(),
                    "controller is processed already no need to call onBeforeRendering again"
                );

                oController.bCardProcessed = false;

                oController.getOwnerComponent().getComponentData().appComponent.getDashboardLayoutUtil =
                    function () {
                        return {
                            dashboardLayoutModel: {
                                getCardById: function (sCardId) {
                                    return {
                                        model: "CATALOG_MODEL_V4",
                                        template: "sap.ovp.cards.v4.charts.analytical",
                                        settings: {
                                            title: "Most Popular Products V4",
                                            subTitle: "In the last six months",
                                            entitySet: "Books",
                                            chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#donutchart",
                                        },
                                        id: "card010",
                                        dashboardLayout: {
                                            rowSpan: 2,
                                            showOnlyHeader: true,
                                            autoSpan: true,
                                        },
                                    };
                                },
                            },
                        };
                    };
                oController.onBeforeRendering();
                assert.ok(oVizFrame.mProperties.height === "21rem", "default height set for viz Frame.");
                assert.ok(oVizFrame.addEventDelegate.calledOnce === true, "viz Frame's event delegate is called.");
                assert.ok(oController.bCardProcessed, "Card controller is processed.");
                assert.ok(oController.getCardItemsBinding().sPath === "/Books", "Binding is formed for card");

                oView.byId = function (sPath) {
                    if (sPath === "analyticalChart") {
                        oVizFrame.getParent = function () {
                            return false;
                        };
                        return oVizFrame;
                    } else if (sPath === "vbLayout") {
                        return oLayout;
                    }
                };
                oController.bCardProcessed = false;
                oController.vbLayout = oLayout;
                oLayout.setBusy(false);
                assert.ok(oLayout.getBusy() === false, "onDataRequested is not yet called.");
                oController.onDataRequested();
                assert.ok(oLayout.getBusy() === true, "onDataRequested is called.");
                assert.ok(
                    oController.getCardItemsBinding() === null,
                    "binding formed for the card is null, as vizFrame does not have a parent node"
                );
                fnDone();
            });
        });
    });

    QUnit.test("function resizeCard, refreshCard - v4AnalyticalController", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oController = oView.getController();
                var newCardLayout = {
                    rowSpan: 6,
                    colSpan: 1,
                    maxColSpan: 1,
                    noOfItems: 0,
                    autoSpan: false,
                    showOnlyHeader: true,
                    visible: true,
                    itemHeight: 0,
                    headerHeight: 79,
                    column: 5,
                    row: 35,
                    top: "544px",
                    width: "317.6px",
                    height: "96px",
                    left: "1270.4px",
                    containerLayout: "resizable",
                    iRowHeightPx: 16,
                    iCardBorderPx: 8,
                };
                var ovpCardContentContainer = oView.byId("ovpCardContentContainer");
                oController.getHeaderHeight = function () {
                    return 2;
                };
                oController.getCardPropertiesModel().getProperty = function (sPath) {
                    return {
                        iRowHeightPx: 2,
                        iCardBorderPx: 4,
                        colSpan: 2,
                    };
                };
                oController.oDataSet = {
                    bindData: function (sPath) { },
                };
                oView.byId = function (sPath) {
                    if (sPath === "analyticalChart") {
                        if (!oVizFrame) {
                            oVizFrame = new VizFrame(
                                "Vcard010_cardchartsdonut--analyticalChart",
                                {
                                    uiConfig: { applicationSet: "fiori" },
                                    vizCustomizations: null,
                                    vizProperties: null,
                                    vizScales: null,
                                    vizType: "bubble",
                                    width: "100%",
                                }
                            );
                            oVizFrame.setModel(oController.getCardPropertiesModel(), "ovpCardProperties");
                            oVizFrame.addEventDelegate = sinon.spy();
                            oVizFrame.getParent = function () {
                                return {
                                    getBinding: function (sPath) {
                                        return new ODataListBinding(
                                            oView.getModel(),
                                            "/Books"
                                        );
                                    },
                                    invalidate: function (sPath) {
                                        return false;
                                    },
                                    isInvalidateSuppressed: function() {
                                        return false;
                                    }
                                };
                            };
                        }
                        return oVizFrame;
                    } else if (sPath === "vbLayout") {
                        oLayout = new Box("Vcard010_cardchartsdonut--vbLayout", { direction: "Column" });
                        return oLayout;
                    } else if (sPath === "bubbleText") {
                        return {
                            setVisible: function () { },
                        };
                    } else if (sPath === "ovpCardContentContainer") {
                        return ovpCardContentContainer;
                    }
                };
                oController.oDashboardLayoutUtil = {
                    aCards: {
                        model: "CATALOG_MODEL_V4",
                        template: "sap.ovp.cards.v4.charts.analytical",
                        settings: {
                            title: "Most Popular Products V4",
                            subTitle: "In the last six months",
                            entitySet: "Books",
                            chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#donutchart",
                        },
                        id: "card010",
                    },
                    dashboardLayoutModel: {
                        getCardById: function (sCardId) {
                            return {
                                model: "CATALOG_MODEL_V4",
                                template: "sap.ovp.cards.v4.charts.analytical",
                                settings: {
                                    title: "Most Popular Products V4",
                                    subTitle: "In the last six months",
                                    entitySet: "Books",
                                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#donutchart",
                                },
                                id: "card010",
                                dashboardLayout: {
                                    rowSpan: 6,
                                    showOnlyHeader: true,
                                },
                            };
                        },
                    },
                    getCardDomId: function (sCardId) {
                        return "card010-DomRef";
                    },
                    isCardAutoSpan: function () { },
                    ROW_HEIGHT_PX: 7,
                    CARD_BORDER_PX: 2,
                };
                oController.vizFrame = {
                    setDataset: function () { },
                };
                V2VizAnnotationManager.reprioritizeContent = sinon.spy();
                document.body.insertAdjacentHTML(
                    "beforeend",
                    '<div id="card010Original" style="display:none;"><div class="sapOvpWrapper"></div></div>'
                );
                document.body.insertAdjacentHTML(
                    "beforeend",
                    '<div id="card010Original--ovpCardContentContainer" style="display:none;"></div>'
                );
                var testContainer = document.querySelector("#card010Original");
                var testContainer1 = document.querySelector("#card010Original--ovpCardContentContainer");
                oController.resizeCard(newCardLayout);
                assert.ok(
                    V2VizAnnotationManager.reprioritizeContent.calledOnce === true,
                    "VizAnnotationManager's reprioritizeContent is called once using resize card"
                );

                var ovpWrapperHeight = document
                    .getElementById("card010Original")
                    .getElementsByClassName("sapOvpWrapper")[0].style.height;
                var aCardClassList = document.getElementById("card010Original--ovpCardContentContainer").classList;
                assert.ok(ovpWrapperHeight === "4px", "Height of ovp wrapper is set.");
                assert.ok(
                    aCardClassList.value === "sapOvpContentHidden",
                    "class set on card content container as showOnlyHeader is true."
                );

                var newCardLayout1 = {
                    rowSpan: 6,
                    colSpan: 1,
                    maxColSpan: 1,
                    noOfItems: 0,
                    autoSpan: false,
                    showOnlyHeader: false,
                    visible: true,
                    itemHeight: 0,
                    headerHeight: 79,
                    column: 5,
                    row: 35,
                    top: "544px",
                    width: "317.6px",
                    height: "96px",
                    left: "1270.4px",
                    containerLayout: "resizable",
                    iRowHeightPx: 16,
                    iCardBorderPx: 8,
                };
                oController.resizeCard(newCardLayout1);
                assert.ok(
                    aCardClassList.value === "",
                    "class removed from card content container as as showOnlyHeader is false."
                );
                assert.ok(aCardClassList.length === 0, "class length is 0 as the class has been removed.");

                oView.invalidate = sinon.spy();
                oController.refreshCard();
                assert.ok(oView.invalidate.calledOnce === true, "card is refreshed view rerendered.");
                testContainer.parentNode.removeChild(testContainer);
                testContainer1.parentNode.removeChild(testContainer1);
                fnDone();
            });
        });
    });

    QUnit.test("function onDataReceived - v4AnalyticalController", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oEvent = {
                    getSource: function () {
                        return {
                            getCurrentContexts: function () {
                                return [
                                    {
                                        test: "",
                                        getObject: function () {
                                            return {};
                                        },
                                    },
                                    {
                                        getObject: function () {
                                            return {};
                                        },
                                    },
                                ];
                            },
                        };
                    },
                };
                var oController = oView.getController();
                oController.oDataSet = {
                    bindData: function () { },
                };
                oView.byId = function (sPath) {
                    if (sPath === "analyticalChart") {
                        if (!oVizFrame) {
                            oVizFrame = new VizFrame(
                                "Vcard010_cardchartsdonut--analyticalChart",
                                {
                                    uiConfig: { applicationSet: "fiori" },
                                    vizCustomizations: null,
                                    vizProperties: null,
                                    vizScales: null,
                                    vizType: "donut",
                                    width: "100%",
                                }
                            );
                            oVizFrame.setModel(oController.getCardPropertiesModel(), "ovpCardProperties");
                            oVizFrame.addEventDelegate = sinon.spy();
                            oVizFrame.getParent = function () {
                                return {
                                    getBinding: function (sPath) {
                                        return new ODataListBinding(
                                            oView.getModel(),
                                            "/Books"
                                        );
                                    },
                                    invalidate: function (sPath) {
                                        return false;
                                    },
                                    isInvalidateSuppressed: function() {
                                        return false;
                                    }
                                };
                            };
                        }
                        oVizFrame.setDataset = function () { };
                        return oVizFrame;
                    } else if (sPath === "bubbleText") {
                        return {
                            setVisible: function () { },
                        };
                    } else if (sPath === "vbLayout") {
                        oLayout = new VBox("Vcard010_cardchartsdonut--vbLayout", { direction: "Column" });
                        return oLayout;
                    }
                };
                oController.vbLayout = oView.byId("vbLayout");
                oLayout.setBusy(true);
                assert.ok(oLayout.getBusy(), "Layout is Set to busy");
                oController.onDataReceived(oEvent);
                assert.ok(oLayout.getBusy(), "Layout is busy");
                oView.getController().getCardPropertiesModel().oData.colorPalette = true;
                var vizFrame = oView.byId("analyticalChart");
                vizFrame.mProperties.vizType = "stacked_column";
                vizFrame.getDataset = function () {
                    return {
                        getDimensions: function () {
                            return [
                                {
                                    getName: function () {
                                        return "Negative";
                                    },
                                    setSorter: function () { },
                                },
                                {
                                    getName: function () {
                                        return "Positive";
                                    },
                                    setSorter: function () { },
                                },
                            ];
                        },
                    };
                };
                vizFrame.getFeeds = function () {
                    return [
                        {
                            getUid: function () {
                                return "color";
                            },
                            getValues: function () {
                                return ["Positive", "Negative"];
                            },
                        },
                    ];
                };
                oController.bFlag = true;
                oController.onDataReceived(oEvent);
                assert.ok(!oLayout.getBusy(), "Layout is set to non-busy");
                fnDone();
            });
        });
    });

    QUnit.test("function _calculateVizLegendGroupHeight - v4AnalyticalController", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oController = oView.getController();
                var iVizFrameHeight = 270;
                var expectedHeight = 0.1;
                var updatedVizHeight = oController._calculateVizLegendGroupHeight(iVizFrameHeight);
                var actualHeight = updatedVizHeight.legendGroup.layout.height;
                assert.ok(expectedHeight === actualHeight, "The Legendgroup height is updated succesfully");
                fnDone();
            });
        });
    });

    QUnit.test("function _calculateVizLegendGroupWidth - v4AnalyticalController", function (assert) {
        var fnDone = assert.async();
        MockServerHelper.startServer().then(function (oModel) {
            MockServerHelper.createXMLView(oConfig, oModel).then(function (oView) {
                var oController = oView.getController();
                var cardWidth = 650;
                var expectedVizWidth = 0.55;
                var updatedVizWidth = oController._calculateVizLegendGroupWidth(cardWidth);
                var actualWidth = updatedVizWidth.legendGroup.layout.maxWidth;
                assert.ok(expectedVizWidth === actualWidth, "The Legendgroup max width is updated succesfully");
                fnDone();
            });
        });
    });
});
