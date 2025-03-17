/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/Mockserver/MockServerHelper",
    "sap/ui/core/mvc/Controller",
    "sap/m/Popover",
    "sap/ovp/cards/NavigationHelper",
    "sap/ovp/cards/v4/V4AnnotationHelper"
], function (
    MockServerHelper,
    Controller,
    Popover,
    NavigationHelper,
    V4AnnotationHelper
) {
    "use strict";

    var oController;
    var oView, oModel, oConfig;

    QUnit.module("sap.ovp.qunit.cards.v4.list.list.controller", {
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
            
            return Controller.create({
                name: "sap.ovp.cards.v4.list.List"
            }).then(function(controller) { 
                oController = controller;
                oController.oLoadedComponents = {};
            });
        },
        afterEach: function () {
            MockServerHelper.closeServer();
        },
    });

    QUnit.test("function onInit - v4ListController", function (assert) {
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

    QUnit.test("function onContactDetailsLinkPress - v4ListController", function (assert) {
        var oPopOver = new Popover();
        oPopOver.openBy = sinon.spy();
        var oEvent = {
            getSource: function () {
                return {
                    getParent: function () {
                        return {
                            getAggregation: function (sPropertyName) {
                                return [oPopOver];
                            },
                        };
                    },
                    getBindingContext: function () {
                        return {
                            getPath: function () {
                                return "";
                            },
                        };
                    },
                };
            },
        };
        oController.onContactDetailsLinkPress(oEvent);
        assert.ok(oPopOver.openBy.calledOnce === true, "onContactDetailsLinkPress method executed successfully");
    });

    QUnit.test("function onInit & getCardItemsBinding - v4ListController", function (assert) {
        var fnAddViewData = function () {
            oView = MockServerHelper.getCardData()["oView"];
            oModel = MockServerHelper.getCardData()["oModel"];
        };
        var fnQunitTest = function () {
            oView.getController().onInit();
            assert.ok(true, "onInit method executed successfully");
            var sBinding = oView.getController().getCardItemsBinding();
            assert.ok(sBinding.getPath() === "/Books", "Cards Item binding formed correctly");
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

    QUnit.test("function _addImageCss - v4ListController", function (assert) {
        var fnSetAttribute = sinon.spy();
        var fnAddStyleClass1 = sinon.spy();
        var fnAddStyleClass2 = sinon.spy();
        var fnAddViewData = function () {
            oView = MockServerHelper.getCardData()["oView"];
            oModel = MockServerHelper.getCardData()["oModel"];
        };
        var fnQunitTest = function () {
            var ovpList = oView.getController().byId("ovpList");
            ovpList.getDomRef = function () {
                return {
                    getAttribute: function (sName) {
                        return "sapMFlexItem";
                    },
                    setAttribute: fnSetAttribute,
                    removeAttribute: function () { },
                    querySelectorAll: function () {
                        return [{ id: "ovpList" }];
                    },
                    contains: function () { return false }
                };
            };
            ovpList.getItems = function () {
                return [
                    {
                        getDomRef: function () {
                            return {
                                getAttribute: function (sName) {
                                    return "sapMFlexItem";
                                },
                                setAttribute: fnSetAttribute,
                                removeAttribute: function () { },
                                querySelectorAll: function () {
                                    return [{ id: "ovpListItem1" }];
                                },
                                children: {},
                            };
                        },
                        getDescription: function () { },
                        getIcon: function () {
                            return "sap//icon:title";
                        },
                        getTitle: function () {
                            return "Item1";
                        },
                        addStyleClass: fnAddStyleClass1,
                    },
                    {
                        getDomRef: function () {
                            return {
                                getAttribute: function (sName) {
                                    return "sapMFlexItem";
                                },
                                setAttribute: fnSetAttribute,
                                removeAttribute: function () { },
                                querySelectorAll: function () {
                                    return [{ id: "ovpListItem2" }];
                                },
                                children: {},
                            };
                        },
                        getDescription: function () { },
                        getIcon: function () {
                            return "sap//icon:title";
                        },
                        getTitle: function () {
                            return "Item1";
                        },
                        addStyleClass: fnAddStyleClass2,
                    },
                ];
            };
            oView.getController()._addImageCss();
            assert.ok(fnSetAttribute.calledOnce === true, "Class Attribute set");
            assert.ok(fnAddStyleClass1.calledOnce === true, "Style Class is added to first item");
            assert.ok(fnAddStyleClass2.calledOnce === true, "Style Class is added to Second item");
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

    QUnit.test("function onListItemPress - v4ListController", function (assert) {
        var fnNavigate = sinon.spy();
        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (sKey) {
                    return "test";
                },
            };
        };
        oController.getView = function() {
            return {
                getModel: function() {
                    return null;
                }
            }
        };
        NavigationHelper.getEntityNavigationEntries = function () {
            return true;
        };
        oController.doNavigation = fnNavigate;
        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return {};
                    },
                };
            },
        };
        oController.onListItemPress(oEvent);
        assert.ok(fnNavigate.calledOnce === true, "Navigation is done for list card");
    });

    QUnit.test("function _getMinMaxObjectFromContext, _updateMinMaxModel, returnBarChartValue - v4ListController", function (assert) {
        var fnAddViewData = function () {
            oView = MockServerHelper.getCardData()["oView"];
            oModel = MockServerHelper.getCardData()["oModel"];
        };
        var fnQunitTest = function () {
            var oController = oView.getController();
            oController.getCardPropertiesModel().getProperty = function (sKey) {
                if (sKey === "/annotationPath") {
                    return "com.sap.vocabularies.UI.v1.LineItem#View4";
                } else if (sKey === "/entitySet") {
                    return "Books";
                }
            };
            var oResult = oController._getMinMaxObjectFromContext();
            assert.ok(oResult.maxValue === 0, "_getMinMaxObjectFromContext executed and got the object");
            assert.ok(oResult.minValue === 0, "_getMinMaxObjectFromContext executed and got the object");

            var barList = oView.byId("ovpList");
            var listItems = barList.getBinding("items");
            listItems.getCurrentContexts = function () {
                return [
                    {
                        getValue: function () {
                            return 2400;
                        },
                    },
                    {
                        getValue: function () {
                            return 1400;
                        },
                    },
                ];
            };

            var oResult1 = oController._updateMinMaxModel();
            assert.ok(oResult1.maxValue === 2400, "_updateMinMaxModel executed and got the object");
            assert.ok(oResult1.minValue === 0, "_updateMinMaxModel executed and got the object");

            var Result2 = oController.returnBarChartValue(1500);
            assert.ok(Result2 === 1500, "returnBarChartValue executed and got the value");
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

    QUnit.test("function resizeCard - v4ListController", function (assert) {
        document.body.insertAdjacentHTML("beforeend", '<div id="card002" style="display: none;">');
        document.body.insertAdjacentHTML(
            "beforeend",
            '<div id="card002Original--ovpCardContentContainer" style="display: none;">'
        );
        var testContainer = document.querySelector("#card002");
        var testContainer1 = document.querySelector("#card002Original--ovpCardContentContainer");
        var newCardLayout = {
            rowSpan: 50,
            colSpan: 1,
            maxColSpan: 1,
            noOfItems: 5,
            autoSpan: false,
            showOnlyHeader: false,
            visible: true,
            itemHeight: 65,
            headerHeight: 140,
            column: 4,
            row: 1,
            top: "0px",
            width: "317.6px",
            height: "800px",
            left: "952.8000000000001px",
            containerLayout: "resizable",
            iRowHeightPx: 16,
            iCardBorderPx: 8,
        };
        var cardSizeProperties = {
            headerHeight: 140,
            dropDownHeight: 0,
            itemHeight: 71,
            minCardHeight: 211,
            leastHeight: 140,
        };

        var fnAddViewData = function () {
            oView = MockServerHelper.getCardData()["oView"];
            oModel = MockServerHelper.getCardData()["oModel"];
        };
        var fnQunitTest = function (oView) {
            var oController = oView.getController();
            oController.oDashboardLayoutUtil = {};
            oController.oDashboardLayoutUtil.getCardDomId = function () {
                return "card002";
            };
            oController.getHeaderHeight = function () {
                return 140;
            };
            oController.resizeCard(newCardLayout, cardSizeProperties);
            assert.ok(
                testContainer.attributes["style"].value.indexOf("height: 800px;") > -1,
                "The card height is changed onresize"
            );
            assert.ok(
                testContainer1.attributes["style"].value.indexOf("height: 644px;") > -1,
                "The card height is changed onresize"
            );
            testContainer.parentNode.removeChild(testContainer);
            testContainer1.parentNode.removeChild(testContainer1);
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
});
