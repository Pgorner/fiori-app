/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/AnnotationHelper",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/CommonUtils",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Lib"
], function (
    utils,
    mockservers,
    AnnotationHelper,
    OVPCardAsAPIUtils,
    CommonUtils,
    Controller,
    UIComponent,
    CoreLib
) {
    "use strict";

    var testContainer;
    var oController;
    var CardController;

    QUnit.module("sap.ovp.cards.List", {
        beforeEach: function () {
            mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
            mockservers.loadMockServer(utils.odataBaseUrl_salesShare, utils.odataRootUrl_salesShare);
            document.body.insertAdjacentHTML("beforeend", '<div id="testContainer" style="display: none;">');
            testContainer = document.querySelector("#testContainer");
            var workingArea = '<div id="root">' + '<div id="container"> </div>' + "</div>";
            document.body.insertAdjacentHTML("beforeend", workingArea);
            var pCardController = Controller.create({
                name: "sap.ovp.cards.generic.Card"
            }).then(function(controller) { 
                CardController = controller;
            });
            var pController = Controller.create({
                name: "sap.ovp.cards.list.List"
            }).then(function(controller) { 
                oController = controller;
            });
            return Promise.all([pCardController, pController])
            .then(function(values) {
                return values;
            });
        },
        afterEach: function () {
            mockservers.close();
            testContainer.parentNode.removeChild(testContainer);
            oController.destroy();
        },
    });

    QUnit.test("Card Test - testing Parameterized EntitySet - Valid Parameterized configuration (annotations & card settings)- formatItems should parse it correctly", function (assert) {
        var cardTestData = {
            card: {
                id: "card_1",
                model: "salesShare",
                template: "sap.ovp.cards.list",
                settings: {
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant",
                    entitySet: "SalesShare",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesShare,
                rootUri: utils.odataRootUrl_salesShare,
                annoUri: utils.testBaseUrl + "data/salesshare/annotations_parameterized_ES_Valid.xml",
            },
            expectedResult: {
                Body: {
                    List: {
                        itemsAggregationBinding:
                        "{path: '/SalesShareParameters(P_Currency=%27EUR%27,P_Country=%27IN%27)/Results', length: 5, parameters: {custom: {_requestFrom: 'ovp_internal'}}}",
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            var listNodeXml = utils.getListItemsNode(cardXml);
            assert.ok(listNodeXml !== undefined, "Existence check to XML Node of List");

            var itemsAggregationValue = listNodeXml.getAttribute("items");
            assert.ok(
                itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding,
                "List XML items-aggregation's value Includes the Parameterized-Entity-Set"
            );
            fnDone();
        });
    });

    QUnit.test("Card Test - testing Parameterized EntitySet - Invalid Parameterized configuration - No Selection Variant in card settings, Valid Selection Variant in Annotations", function (assert) {
        var cardTestData = {
            card: {
                id: "card_2",
                model: "salesShare",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesShare",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesShare,
                rootUri: utils.odataRootUrl_salesShare,
                annoUri: utils.testBaseUrl + "data/salesshare/annotations_parameterized_ES_Valid.xml",
            },
            expectedResult: {
                Body: {
                    List: {
                        itemsAggregationBinding: "{path: '/SalesShare', length: 5, parameters: {custom: {_requestFrom: 'ovp_internal'}}}",
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            var listNodeXml = utils.getListItemsNode(cardXml);
            assert.ok(listNodeXml !== undefined, "Existence check to XML Node of List");

            var itemsAggregationValue = listNodeXml.getAttribute("items");
            assert.ok(
                itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding,
                "List XML items-aggregation's value Includes the Parameterized-Entity-Set"
            );
            fnDone();
        });
    });

    QUnit.test("Card Test - testing Parameterized EntitySet - Invalid Parameterized configuration - Invalid Selection Variant value in card settings, Valid Selection Variant annotations", function (assert) {
        var cardTestData = {
            card: {
                id: "card_3",
                model: "salesShare",
                template: "sap.ovp.cards.list",
                settings: {
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariantInvalidValue",
                    entitySet: "SalesShare",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesShare,
                rootUri: utils.odataRootUrl_salesShare,
                annoUri: utils.testBaseUrl + "data/salesshare/annotations_parameterized_ES_Valid.xml",
            },
            expectedResult: {
                Body: {
                    List: {
                        itemsAggregationBinding: "{path: '/SalesShare', length: 5, parameters: {custom: {_requestFrom: 'ovp_internal'}}}",
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");
            var listNodeXml = utils.getListItemsNode(cardXml);
            assert.ok(listNodeXml !== undefined, "Existence check to XML Node of List");

            var itemsAggregationValue = listNodeXml.getAttribute("items");
            assert.ok(
                itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding,
                "List XML items-aggregation's value Includes the Parameterized-Entity-Set"
            );
            fnDone();
        });
    });

    QUnit.test("Card Test - Full annotations - With Entity Path - Header Config No Properties - with listType=extended", function (assert) {
        var cardTestData = {
            card: {
                id: "card_4",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "SalesOrderLineItemSet",
                    type: "sap.ovp.cards.list.List",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\} *\/ *\{*ItemPosition.*\}/,
                            number: /\{*Quantity.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*GrossAmount.*\}/,
                                    state: "None",
                                },
                                {
                                    text: /\{*NetAmount.*\}/,
                                    state: "None",
                                },
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*ProductID.*\}/,
                                },
                                {
                                    text: /\{*DeliveryDate.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full annotations - With Entity Path - Header Config No Properties - NO listType (check default is ObjectListItem)", function (assert) {
        var cardTestData = {
            card: {
                id: "card_5",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderLineItemSet",
                    type: "sap.ovp.cards.list.List",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\} *\/ *\{*ItemPosition.*\}/,
                            description: /\{*ProductID.*\}/,
                            info: /\{*Quantity.*\}/,
                            infoState: "None",
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full annotations - With Entity Path - Header Config No Properties - listType=condensed", function (assert) {
        var cardTestData = {
            card: {
                id: "card_6",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "condensed",
                    entitySet: "SalesOrderLineItemSet",
                    type: "sap.ovp.cards.list.List",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\} *\/ *\{*ItemPosition.*\}/,
                            description: /\{*ProductID.*\}/,
                            info: /\{*Quantity.*\}/,
                            infoState: "None",
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full Annotations - No Entity Path - Header Config No Properties - listType=extended", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    // e.g. no header properties in the XML
                    title: undefined,
                    subTitle: undefined,
                    category: undefined,
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*ProductID.*\}/,
                            number: /\{*MeasureUnit.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*Name.*\}/,
                                    state: "None",
                                },
                                {
                                    text: /\{path: *'Price'.*\}/,
                                    state: "None",
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*Category.*\}/,
                                },
                                {
                                    text: /\{*SupplierName.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full Annotations - No Entity Path - Header Config No Properties - listType=extended", function (assert) {
        var cardTestData = {
            card: {
                id: "card_8",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    // e.g. no header properties in the XML
                    title: undefined,
                    subTitle: undefined,
                    category: undefined,
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*ProductID.*\}/,
                            number: /\{*MeasureUnit.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*Name.*\}/,
                                    state: "None",
                                },
                                {
                                    text: /\{*Price.*\}/,
                                    state: "None",
                                },
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*Category.*\}/,
                                },
                                {
                                    text: /\{*SupplierName.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Sort By Importance - listType=extended", function (assert) {
        var cardTestData = {
            card: {
                id: "card_9",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "BusinessPartnerSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    // e.g. no header properties in the XML
                    title: undefined,
                    subTitle: undefined,
                    category: undefined,
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*BusinessPartnerID.*\}/,
                            number: /\{*CurrencyCode.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*PhoneNumber.*\}/,
                                    state: "None",
                                },
                                {
                                    text: "",
                                    state: "None",
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*CompanyName.*\}.*\{*LegalForm.*\}/,
                                },
                                {
                                    text: /\{*BusinessPartnerRole.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full Annotations - No Entity Path - Header Config No Properties - listType=condensed, listFlavor=bar", function (assert) {
        var cardTestData = {
            card: {
                id: "card_10",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Sales Orders - listType = Condensed Bar List",
                    title: "Bar List Card",
                    description: "",
                    listType: "condensed",
                    listFlavor: "bar",
                    entitySet: "ProductSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        CustomListItem: {
                            title: /\{*ProductID.*\}/,
                            progressIndicator: /\{*Price.*\}/,
                            firstDataPoint: /\{*Price.*\}/,
                            SecondDataPoint: /\{*CurrencyCode.*\}/,
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        
        var fnDone = assert.async();
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full Annotations - No Entity Path - Header Config No Properties - listType=extended, listFlavor=bar", function (assert) {
        var cardTestData = {
            card: {
                id: "card_11",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Sales Orders - listType = Extended Bar List",
                    title: "Bar List Card",
                    description: "",
                    listType: "extended",
                    listFlavor: "bar",
                    entitySet: "ProductSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml",
            },
            expectedResult: {
                Header: {
                    // e.g. no header properties in the XML
                },
                Body: {
                    List: {
                        CustomListItem: {
                            firstDataFiled: /\{*ProductID.*\}/,
                            secondDataFiled: /\{*Category.*\}/,
                            progressIndicator: /\{*Price.*\}/,
                            firstDataPoint: /\{*Price.*\}/,
                            secondDataPoint: /\{*MeasureUnit.*\}/,
                            thirdDataPoint: /\{*Depth.*\}/,
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Without third data point annotations - No Entity Path - Header Config No Properties - listType=extended, listFlavor=bar", function (assert) {
        var cardTestData = {
            card: {
                id: "card_12",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Sales Orders - listType = Extended Bar List",
                    title: "Bar List Card",
                    description: "",
                    listType: "extended",
                    listFlavor: "bar",
                    entitySet: "SalesOrderSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml",
            },
            expectedResult: {
                Header: {
                    // e.g. no header properties in the XML
                },
                Body: {
                    List: {
                        CustomListItem: {
                            firstDataFiled: /\{*SalesOrderID.*\}/,
                            secondDataFiled: /\{*CustomerName.*\}/,
                            progressIndicator: /\{*GrossAmount.*\}/,
                            firstDataPoint: /\{*GrossAmount.*\}/,
                            secondDataPoint: /\{*LifecycleStatus.*\}/,
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - semantic object and contact annotation check - listType=extended, listFlavor=bar", function (assert) {
        var cardTestData = {
            card: {
                id: "card_barlist_smartlink",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Sales Orders - listType = Extended Bar List",
                    title: "Bar List Card",
                    description: "",
                    listType: "extended",
                    listFlavor: "bar",
                    entitySet: "SalesOrderSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#BarListSmartLinkTest",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    // e.g. no header properties in the XML
                },
                Body: {
                    List: {
                        CustomListItem: {
                            firstDataFieldSemanticObject: "OVP",
                            secondDataFieldSemanticObject: "OVP",
                            firstContactAnnotationQuickViewElement: "true",
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateBarListSmartLinkValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit", function (assert) {
        var oView,
            oController,
            oSavePromise,
            cardTestData = {
                card: {
                    id: "card_13",
                    model: "salesOrder",
                    template: "sap.ovp.cards.list",
                    settings: {
                        category: "Sales Orders - listType = Condensed Bar List",
                        title: "Bar List Card",
                        description: "",
                        listType: "condensed",
                        listFlavor: "bar",
                        entitySet: "ProductSet",
                    },
                },
                dataSource: {
                    baseUrl: utils.odataBaseUrl_salesOrder,
                    rootUri: utils.odataRootUrl_salesOrder,
                    annoUri: utils.testBaseUrl + "data/annotations.xml",
                },
                expectedResult: {},
            };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oView = utils.createCardView(cardTestData, oModel).then(function (oView) {
            oController = oView.getController();
            oController.getOwnerComponent = function () {
                return new UIComponent();
            };
            assert.ok(oController.returnBarChartValue(70) == "70", "value is returned with no change");
            fnDone();
        });
    });

    QUnit.test("List Card Test - use annotationPath with FieldGroup", function (assert) {
        var cardTestData = {
            card: {
                id: "card_14",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "SalesOrderLineItemSet",
                    type: "sap.ovp.cards.list.List",
                    annotationPath: "com.sap.vocabularies.UI.v1.FieldGroup#ForCard/Data",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\}/,
                            number: /\{*GrossAmount.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*Quantity.*\}/,
                                    state: "None",
                                },
                                {
                                    text: /\{*NetAmount.*\}/,
                                    state: "None",
                                },
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*DeliveryDate.*\}/,
                                },
                                {
                                    text: /\{*ProductID.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("List Card Test - Counter in header exists only if all items are not displayed", function (assert) {
        var cardTestData = {
            card: {
                id: "card_16",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    title: "Reorder Soon",
                    subTitle: "Less than 10 in stock",
                    listType: "extended",
                    entitySet: "SalesOrderLineItemSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var oItemsBinding = oController.getCardItemsBinding();
            oItemsBinding.isLengthFinal = function () {
                return true;
            };
            oItemsBinding.getLength = function () {
                return 6;
            };
            oItemsBinding.getCurrentContexts = function () {
                return [1, 2, 3];
            };

            oController.onAfterRendering();
            //CreateData Change event
            oItemsBinding.fireDataReceived();

            var footerString = oView.byId("ovpCountHeader").getText();
            assert.ok(footerString.match(/3{1} .* 6{1}$/));
            fnDone();
        });
    });

    QUnit.test("List Card Test - Counter in header reads from event if binding is not final", function (assert) {
        var cardTestData = {
            card: {
                id: "card_161",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    title: "Reorder Soon",
                    subTitle: "Less than 10 in stock",
                    listType: "extended",
                    entitySet: "SalesOrderLineItemSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var oItemsBinding = oController.getCardItemsBinding();
            var mockData = { data: { results: [1, 2, 3, 4] } };
            oItemsBinding.isLengthFinal = function () {
                return false;
            };
            oItemsBinding.getLength = function () {
                return 6;
            };
            oItemsBinding.getCurrentContexts = function () {
                return [1, 2, 3];
            };

            oController.onAfterRendering();
            //CreateData Change event
            oItemsBinding.fireDataReceived(mockData);

            var footerString = oView.byId("ovpCountHeader").getText();
            assert.ok(footerString.match(/3{1} .* 4{1}$/));
            fnDone();
        });
    });
    QUnit.test("List Card Test - Counter in header does not exists if all the items are displayed", function (assert) {
        var cardTestData = {
            card: {
                id: "card_165",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    title: "Reorder Soon",
                    subTitle: "Less than 10 in stock",
                    listType: "extended",
                    entitySet: "SalesOrderLineItemSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var oItemsBinding = oController.getCardItemsBinding();
            oItemsBinding.getLength = function () {
                return 3;
            };
            oItemsBinding.getCurrentContexts = function () {
                return [1, 2, 3];
            };

            oController.onAfterRendering();
            //CreateData Change event
            oItemsBinding.fireDataReceived();
            var footerString = oView.byId("ovpCountHeader").getText();
            assert.ok(footerString.match(""));
            fnDone();
        });
    });

    QUnit.test("List Card Test - navigation from line item", function (assert) {
        var cardTestData = {
            card: {
                id: "card_162",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderLineItemSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var doIntentBasedNavigationStub = sinon.stub(oController, "doNavigation");
            var oBindingContext = { id: "bindingcontext" };
            var oEvent = {
                getSource: function () {
                    return {
                        getBindingContext: function () {
                            return oBindingContext;
                        },
                        getType: function () {
                            return "Active";
                        },
                        setType: function () {
                            return "Inactive";
                        },
                    };
                },
            };
            oController.onListItemPress(oEvent);
            assert.equal(doIntentBasedNavigationStub.callCount, 1, "doIntentBasedNavigationStub call count");
            assert.deepEqual(
                doIntentBasedNavigationStub.args[0][0],
                oBindingContext,
                "doIntentBasedNavigationStub conetxt parameter"
            );
            assert.equal(
                doIntentBasedNavigationStub.args[0][1].label,
                "Navigation from line item",
                "doIntentBasedNavigationStub intent parameter"
            );
            fnDone();
        });
    });

    QUnit.test("List Card Test - navigation to url from line item", function (assert) {
        var cardTestData = {
            card: {
                id: "card_17",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "BusinessPartnerSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_for_url_navigation.xml",
            },
        };
        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        oModel.read("/BusinessPartnerSet");

        var functionWasAlreadyCalled;
        oModel.attachBatchRequestCompleted(function () {
            if (functionWasAlreadyCalled) {
                return;
            }
            functionWasAlreadyCalled = true;

            utils.createCardView(cardTestData, oModel).then(function (oView) {
                var oController = oView.getController();
                var doNavigationStub = sinon.stub(oController, "doNavigation");
                var oBindingContext = oModel.createBindingContext("/BusinessPartnerSet('0100000000')");
                var oEvent = {
                    getSource: function () {
                        return {
                            getBindingContext: function () {
                                return oBindingContext;
                            },
                            getType: function () {
                                return "Active";
                            },
                            setType: function () {
                                return "Inactive";
                            },
                        };
                    },
                };
                oController.onListItemPress(oEvent);
                assert.equal(doNavigationStub.callCount, 1, "doNavigationStub call count");
                assert.deepEqual(doNavigationStub.args[0][0], oBindingContext, "doNavigationStub conetxt parameter");
                assert.equal(doNavigationStub.args[0][1].label, "Link to", "doNavigationStub parameter");
                assert.equal(
                    doNavigationStub.args[0][1].url,
                    "https://www.google.de/maps/place/%27Dietmar-Hopp-Allee%27,%27Walldorf%27",
                    "doNavigationStub parameter"
                );
                fnDone();
            });
        });
    });

    QUnit.test("List Card Screen reader attribute test", function (assert) {
        var cardTestData = {
            card: {
                id: "card_18",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "SalesOrderLineItemSet",
                    type: "sap.ovp.cards.list.List",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        ListItem: {
                            title: /\{path: *'SalesOrderID'.*\} *\/ *\{path: *'ItemPosition'.*\}/,
                            number: /\{path: *'Quantity'.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{path: *'GrossAmount'.*\}/,
                                    state: "None",
                                },
                                {
                                    text: /\{path: *'NetAmount'.*\}/,
                                    state: "None",
                                },
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{path: *'ProductID'.*\}/,
                                },
                                {
                                    text: /\{path: *'DeliveryDate'.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            oView.placeAt("testContainer");
            oView.onAfterRendering = function () {
                var cardListContent = testContainer.querySelector(".sapMList");
                assert.ok(
                    cardListContent.getAttribute("aria-label") ==
                    CoreLib.getResourceBundleFor("sap.ovp").getText("listCard"),
                    "List Card type is accessble"
                );
                oView.destroy();
                fnDone();
            };
        });
    });

    QUnit.test("Bar Chart Card Screen Reader attribute test", function (assert) {
        var cardTestData = {
            card: {
                id: "card_19",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Sales Orders - listType = Condensed Bar List",
                    title: "Bar List Card",
                    description: "",
                    listType: "condensed",
                    listFlavor: "bar",
                    entitySet: "ProductSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        CustomListItem: {
                            title: /\{path: *'ProductID'.*\}/,
                            progressIndicator: /\{path: *'Price'.*\}/,
                            firstDataPoint: /\{path: *'Price'.*\}/,
                            SecondDataPoint: /\{path: *'WeightMeasure'.*\}/,
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            oView.placeAt("testContainer");

            oView.onAfterRendering = function () {
                var jqView = testContainer.querySelector("#" + oView.sId);
                var cardListContent = jqView.querySelector(".sapMList");

                assert.ok(
                    cardListContent.getAttribute("aria-label") ==
                    CoreLib.getResourceBundleFor("sap.ovp").getText("barChartCard"),
                    "Bar Chart Card type is accessble"
                );
                oView.destroy();
                fnDone();
            };
        });
    });

    QUnit.test("List Card Test - annotation with expand", function (assert) {
        var cardTestData = {
            card: {
                id: "card_20",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "condensed",
                    entitySet: "SalesOrderSet",
                    type: "sap.ovp.cards.list.List",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ToTestExpand",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*ToBusinessPartner\/EmailAddress.*\}/,
                            description: /\{*SalesOrderID.*\}/,
                            info: /\{*CustomerName.*\}/,
                            infoState: "None",
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;

            // basic list XML structure tests
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full annotations - With KPI Header with DP, Filter And Selection", function (assert) {
        var cardTestData = {
            card: {
                id: "card_21",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Contract Monitoring",
                    title: "Contract Expiry, Consumption and Target Value",
                    description: "",
                    listType: "extended",
                    entitySet: "SalesOrderSet",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#line",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#line",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotationsKPI.xml",
            },
            expectedResult: {
                Header: {
                    KPI: {
                        number: true,
                        headerTitleContent: "Sales Orders Amounts by Status",
                        numberAggregateNumberContent: {
                            filters: [
                                ['"path":"GrossAmount"', '"operator":"BT"', '"value1":"0"', '"value2":"800000"'],
                            ],
                        },
                        numberNumericContentValue: /\{path: *'GrossAmount'.*\}/,
                        numberUOM: /\{path: *'CurrencyCode'.*\}/,
                        sortBy: true,
                        sortByContent: "By Lifecycle Descript., Delivery Description",
                        filterBy: true,
                    },
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{path: *'SalesOrderID'.*\}/,
                            number: /\{path: *'LifecycleStatus'.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{path: *'GrossAmount'.*\}/,
                                    state: /\{path: *'GrossAmount'.*\}/,
                                },
                                {
                                    text: /\{path: *'LifecycleStatus'.*\}/,
                                    state: "None",
                                },
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{path: *'CustomerName'.*\}/,
                                },
                                {
                                    text: /\{path: *'NetAmount'.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;
            var expectedHeaderRes = cardTestData.expectedResult.Header;

            // basic list XML structure tests and KPI
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");
            // assert.ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

            // specific XML property binding value test
            // assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full annotations - With KPI Header with DP and Filter-By Values (No SortBy)", function (assert) {
        var cardTestData = {
            card: {
                id: "card_22",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Contract Monitoring",
                    title: "Contract Expiry, Consumption and Target Value",
                    description: "",
                    listType: "extended",
                    entitySet: "SalesOrderSet",
                    showSortingInHeader: false,
                    showFilterInHeader: true,
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#line",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#line",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotationsKPI.xml",
            },
            expectedResult: {
                Header: {
                    KPI: {
                        number: true,
                        headerTitleContent: "Sales Orders Amounts by Status",
                        numberAggregateNumberContent: {
                            filters: [
                                ['"path":"GrossAmount"', '"operator":"BT"', '"value1":"0"', '"value2":"800000"'],
                            ],
                        },
                        numberNumericContentValue: /\{path:'GrossAmount'.*\,/,
                        numberUOM: /\{path: *'CurrencyCode'.*\}/,
                        sortBy: false,
                        filterBy: true,
                    },
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{path: *'SalesOrderID'.*\}/,
                            number: /\{path: *'LifecycleStatus'.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{path: *'GrossAmount'.*\}/,
                                    state: /\{path: *'GrossAmount'.*\}/,
                                },
                                {
                                    text: /\{path: *'LifecycleStatus'.*\}/,
                                    state: "None",
                                },
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{path: *'CustomerName'.*\}/,
                                },
                                {
                                    text: /\{path: *'NetAmount'.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;
            var expectedHeaderRes = cardTestData.expectedResult.Header;

            // basic list XML structure tests and KPI
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");
            // assert.ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

            // specific XML property binding value test
            // assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full annotations - With KPI Header with DP And Sort (No Filter-By-values)", function (assert) {
        var cardTestData = {
            card: {
                id: "card_23",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Contract Monitoring",
                    title: "Contract Expiry, Consumption and Target Value",
                    description: "",
                    listType: "extended",
                    showSortingInHeader: true,
                    showFilterInHeader: false,
                    entitySet: "SalesOrderSet",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#line",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#line",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotationsKPI.xml",
            },
            expectedResult: {
                Header: {
                    KPI: {
                        number: true,
                        headerTitleContent: "Sales Orders Amounts by Status",
                        numberAggregateNumberContent: {
                            filters: [],
                        },
                        numberNumericContentValue:
                            /\{parts:\s*\[\s*{path:\s*'\w*'},\s*{\s*value:\s*{\s*"NumberOfFractionalDigits":\s*[0-2],\s*"percentageAvailable"\s*:(true|false)\s*},\s*model:\s*'\w*'}],\s*formatter:\s*'CardAnnotationhelper.KpiValueFormatter'\s*}/,
                        numberUOM: /\{path: *'CurrencyCode'.*\}/,
                        sortBy: true,
                        sortByContent: "By Lifecycle Descript., Delivery Description",
                        filterBy: false,
                    },
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\}/,
                            number: /\{*LifecycleStatus.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*GrossAmount.*\}/,
                                    state: /\{*GrossAmount.*\}/,
                                },
                                {
                                    text: /\{*LifecycleStatus.*\}/,
                                    state: "None",
                                },
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*CustomerName.*\}/,
                                },
                                {
                                    text: /\{*NetAmount.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;
            var expectedHeaderRes = cardTestData.expectedResult.Header;

            // basic list XML structure tests and KPI
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");
            assert.ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

            // specific XML property binding value test
            assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    QUnit.test("Card Test - Full annotations - With KPI Header with NO DP but with Filter And Selection", function (assert) {
        var cardTestData = {
            card: {
                id: "card_24",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Contract Monitoring",
                    title: "Contract Expiry, Consumption and Target Value",
                    description: "",
                    listType: "extended",
                    entitySet: "SalesOrderSet",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#line",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotationsKPI.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\}/,
                            number: /\{*LifecycleStatus.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*GrossAmount.*\}/,
                                    state: /\{*GrossAmount.*\}/,
                                },
                                {
                                    text: /\{*CurrencyCode.*\}/,
                                    state: "None",
                                },
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*CustomerName.*\}/,
                                },
                                {
                                    text: /\{*NetAmount.*\}/,
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedListRes = cardTestData.expectedResult.Body.List;
            var expectedHeaderRes = cardTestData.expectedResult.Header;

            // basic list XML structure tests and KPI
            assert.ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
            assert.ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");
            assert.ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

            // specific XML property binding value test
            // assert.ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            fnDone();
        });
    });

    /**
     *  ------------------------------------------------------------------------------
     *  Start of test cases to update minMaxModel and barChart value
     *  ------------------------------------------------------------------------------
     */
    function genericFunctions(oController, value) {
        oController.minMaxModel.setData = function (val) {
            return null;
        };
        oController.minMaxModel.refresh = function () {
            return true;
        };

        oController.getEntityType = function () {
            return {
                $path: "/dataServices/schema/0/entityType/1",
                "com.sap.vocabularies.UI.v1.LineItem": [
                    {
                        Label: { String: "Unit Price" },
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                        Target: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Price" },
                    },
                ],
            };
        };
        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (val) {
                    return "com.sap.vocabularies.UI.v1.LineItem";
                },
            };
        };
        oController.getMetaModel = function () {
            return {
                createBindingContext: function (val) { },
            };
        };

        oController.getView = function () {
            return {
                byId: function (val) {
                    return {
                        getBinding: function (items) {
                            return {
                                getCurrentContexts: function () {
                                    return [{ Price: value }];
                                },
                            };
                        },
                    };
                },
            };
        };
        oController.getModel = function () {
            return {
                getOriginalProperty: function (val1, val2) {
                    return value;
                },
            };
        };
    }

    QUnit.test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit when value is greater then zero", function (assert) {
        oController._updateMinMaxModel = function () {
            return {
                minValue: 0,
                maxValue: 100,
            };
        };
        assert.ok(oController.returnBarChartValue(70) == 70, "show minimal value in negative");
    });

    QUnit.test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit  when both Max is equal to zero and min is equal to zero", function (assert) {
        oController._updateMinMaxModel = function () {
            return {
                minValue: 0,
                maxValue: 0,
            };
        };
        assert.ok(oController.returnBarChartValue(0) == 0, "Show value as it is.");
    });

    QUnit.test("Card List Controller Test- Update min and max value in case of Data Point has Percentage Unit", function (assert) {
        var expectedResult = {
            minValue: 0,
            maxValue: 100,
            isPercentage: true
        };
        genericFunctions(oController, "");
        var oFirstDataPointPercentageUnitStub = sinon.stub(
            AnnotationHelper,
            "isFirstDataPointPercentageUnit",
            function () {
                return true;
            }
        );
        var actualResult = oController._updateMinMaxModel(undefined);
        assert.deepEqual(actualResult, expectedResult, "Show value with percentage");
        oFirstDataPointPercentageUnitStub.restore();
    });

    QUnit.test("Card List Controller Test- return BarChart Value when First Data Point is not Percentage Unit, when max value is very high", function (assert) {
        genericFunctions(oController, "1650.0");
        var expectedResult = {
            minValue: 0,
            maxValue: 1650,
        };
        var oFirstDataPointPercentageUnitStub = sinon.stub(
            AnnotationHelper,
            "isFirstDataPointPercentageUnit",
            function () {
                return false;
            }
        );
        var oGetFirstDataPointValueStub = sinon.stub(AnnotationHelper, "getFirstDataPointValue", function () {
            return "Price";
        });

        var actualResult = oController._updateMinMaxModel(undefined);
        assert.deepEqual(actualResult, expectedResult, "Show min and max value");
        oFirstDataPointPercentageUnitStub.restore();
        oGetFirstDataPointValueStub.restore();
    });

    QUnit.test("Card List Controller Test- return BarChart Value when First Data Point is not Percentage Unit, when min value is very less", function (assert) {
        genericFunctions(oController, "-20");
        var expectedResult = {
            minValue: -20,
            maxValue: 0,
        };
        var oFirstDataPointPercentageUnitStub = sinon.stub(
            AnnotationHelper,
            "isFirstDataPointPercentageUnit",
            function () {
                return false;
            }
        );
        var oGetFirstDataPointValueStub = sinon.stub(AnnotationHelper, "getFirstDataPointValue", function () {
            return "Price";
        });

        var actualResult = oController._updateMinMaxModel(undefined);
        assert.deepEqual(actualResult, expectedResult, "Show min and max value");
        oFirstDataPointPercentageUnitStub.restore();
        oGetFirstDataPointValueStub.restore();
    });

    /**
     *  ------------------------------------------------------------------------------
     *  End of test cases to update minMaxModel and barChart value
     *  ------------------------------------------------------------------------------
     */

    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for resize cards
     *  ------------------------------------------------------------------------------
     */
    function testResizeCard(oController, lengthVal, card) {
        var classList = {
            remove: function () {
                return ["sapMFlexItem", "sapOvpCardContentContainer", "sapOvpWrapper"];
            },
            add: function () {
                return ["sapMFlexItem", "sapOvpContentHidden", "sapOvpCardContentContainer", "sapOvpWrapper"];
            },
        };
        oController.cardId = card;
        oController.oDashboardLayoutUtil = {
            getCardDomId: function () {
                return "mainView--ovpLayout--" + oController.cardId;
            },
        };
        oController.getCardItemBindingInfo = function () {
            return { length: lengthVal };
        };
        oController.getCardItemsBinding = function () {
            return {
                refresh: function () {
                    return true;
                },
            };
        };
        oController.getHeaderHeight = function () {
            return 82;
        };
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getDomRef: function () {
                            return {
                                classList: classList,
                                style: {
                                    height: "",
                                },
                            };
                        },
                    };
                },
            };
        };
        oController.minMaxModel.refresh = function () {
            return true;
        };
    }

    QUnit.test("Card Test - resize card, when showOnlyHeader is false, No change in number of rows", function (assert) {
        var newCardLayout = {
            showOnlyHeader: false,
            rowSpan: 20,
            iRowHeightPx: 16,
            iCardBorderPx: 8,
            noOfItems: 3,
        };
        var cardSizeProperties = {
            dropDownHeight: 0,
            itemHeight: 111,
        };
        document.body.insertAdjacentHTML(
            "beforeend",
            '<div id="mainView--ovpLayout--card001" style="height:320px; width:1500px">'
        );
        var testContainer = document.querySelector("#mainView--ovpLayout--card001");
        document.querySelector("#container").appendChild(testContainer);

        testResizeCard(oController, 2, "card001");
        var iNoOfItems = 2;
        oController.resizeCard(newCardLayout, cardSizeProperties);
        assert.ok(oController.getCardItemBindingInfo().length === iNoOfItems, "No change in number of rows");
    }),
        QUnit.test("Card Test - resize card, when showOnlyHeader is false, Show more less of rows", function (assert) {
            var newCardLayout = {
                showOnlyHeader: false,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3,
            };
            var cardSizeProperties = {
                dropDownHeight: 0,
                itemHeight: 111,
            };
            document.body.insertAdjacentHTML(
                "beforeend",
                '<div id="mainView--ovpLayout--card002" style="height:320px; width:1500px">'
            );
            var testContainer = document.querySelector("#mainView--ovpLayout--card002");
            document.querySelector("#container").appendChild(testContainer);
            testResizeCard(oController, 4, "card002");
            var iNoOfItems = 2;
            oController.resizeCard(newCardLayout, cardSizeProperties);
            assert.ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show less number of rows");
        }),
        QUnit.test("Card Test - resize card, when showOnlyHeader is false, Show more number of rows", function (assert) {
            var newCardLayout = {
                showOnlyHeader: false,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3,
            };
            var cardSizeProperties = {
                dropDownHeight: 0,
                itemHeight: 111,
            };
            document.body.insertAdjacentHTML(
                "beforeend",
                '<div id="mainView--ovpLayout--card003" style="height:320px; width:1500px">'
            );
            var testContainer = document.querySelector("#mainView--ovpLayout--card003");
            document.querySelector("#container").appendChild(testContainer);
            testResizeCard(oController, 2, "card003");
            var iNoOfItems = 4;
            oController.resizeCard(newCardLayout, cardSizeProperties);
            assert.ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show more number of rows");
        }),
        QUnit.test("Card Test - resize card, when showOnlyHeader is true", function (assert) {
            var newCardLayout = {
                showOnlyHeader: true,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3,
            };
            var cardSizeProperties = {
                dropDownHeight: 0,
                itemHeight: 111,
            };
            document.body.insertAdjacentHTML(
                "beforeend",
                '<div id="mainView--ovpLayout--card004" style="height:320px; width:1500px">'
            );
            var testContainer = document.querySelector("#mainView--ovpLayout--card004");
            document.querySelector("#container").appendChild(testContainer);
            testResizeCard(oController, 2, "card004");
            var iNoOfItems = 4;
            oController.resizeCard(newCardLayout, cardSizeProperties);
            assert.ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show more number of rows");
        });
    /**
     *  ------------------------------------------------------------------------------
     *  End of Test Cases for resize cards
     *  ------------------------------------------------------------------------------
     */
    QUnit.test("Card Test - Testing card item binding info", function (assert) {
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getBindingInfo: function (val) {
                            return {};
                        },
                    };
                },
            };
        };
        var expectedResult = {};
        assert.deepEqual(oController.getCardItemBindingInfo(), expectedResult);
    });

    QUnit.test("Card Test - Testing card item binding", function (assert) {
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getBinding: function (val) {
                            return {};
                        },
                    };
                },
            };
        };
        var expectedResult = {};
        assert.deepEqual(oController.getCardItemsBinding(), expectedResult);
    });

    /**
     *  Start of test cases
     *  This function does some CSS changes after the card is rendered
     */
    function ImageStyle(oController, desc, icon) {
        oController.byId = function (ovpList) {
            return {
                getItems: function () {
                    return [
                        {
                            getIcon: function () {
                                return icon;
                            },
                            getDomRef: function () {
                                return {
                                    children: [
                                        {
                                            id: "ovpIconImage",
                                            children: [
                                                {
                                                    getAttribute: function (val1) {
                                                        return "sapMImg sapMSLIImgThumb";
                                                    },
                                                    setAttribute: function (val1, val2) {
                                                        oController.attributeClass = val2;
                                                        return val2;
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    getAttribute: function (val) {
                                        return val;
                                    },
                                    insertBefore: function (val1, val2) {
                                        oController.placeHolderClass = val1.className;
                                        return "";
                                    },
                                };
                            },
                            getDescription: function () {
                                return desc;
                            },
                            getTitle: function () {
                                return "Electronics Retail & Co.";
                            },
                            addStyleClass: function (val) {
                                oController.class = val;
                                return val;
                            },
                        },
                    ];
                },
                getDomRef: function () {
                    return {
                        getAttribute: function () {
                            return "sapMList sapMListBGSolid";
                        },
                        setAttribute: function (val1, val2) {
                            oController.densityClass = val2;
                            return val2;
                        },
                    };
                },
            };
        };
    }

    QUnit.test("Card Test - onAfterRendering, when density style = compact and imageDensity = true", function (assert) {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "Smart Firewall", image);
        oController._addImageCss("compact");
        var expectedValue = "sapOvpListWithImageIconCompact";
        assert.ok(oController.densityClass.indexOf("sapOvpListImageCompact") != -1, "Set the list image compact css");
        assert.ok(oController.class === expectedValue, "Set the compact css when image is present");
    });

    QUnit.test("Card Test - onAfterRendering, when density style = cozy and imageDensity = true", function (assert) {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "Smart Firewall", image);
        oController._addImageCss("cozy");
        var expectedValue1 = "sapOvpListWithImageIconCozy";
        assert.ok(oController.densityClass.indexOf("sapOvpListImageCozy") != -1, "Set the list image cozy css");
        assert.ok(oController.class === expectedValue1, "Set the css when image is present");
        assert.ok(oController.attributeClass.indexOf("sapOvpImageCozy") != -1, "Set the attribute css");
    });

    QUnit.test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true, no description and icon is present", function (assert) {
        var icon = "https://www.w3schools.com/css/trolltunga/icon.jpg";
        ImageStyle(oController, "", icon);
        oController._addImageCss("cozy");
        var expectedValue = "sapOvpListWithIconNoDescCozy";
        assert.ok(oController.densityClass.indexOf("sapOvpListImageCozy") != -1, "Set the list image cozy css");
        assert.ok(oController.class === expectedValue, "Set the css when icon is present");
    });

    QUnit.test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true and no description", function (assert) {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "", image);
        oController._addImageCss("cozy");
        var expectedValue1 = "sapOvpListWithImageNoDescCozy";
        assert.ok(oController.class === expectedValue1, "Set the css when image is present");
    });

    QUnit.test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true and no image and icon is present", function (assert) {
        var image = "";
        ImageStyle(oController, "", image);
        oController._addImageCss("cozy");
        assert.ok(oController.placeHolderClass.indexOf("sapOvpImageCozy") != -1, "There is no image and icon present");
    });
    /**
     *  End of test cases
     *  This function does some CSS changes after the card is rendered
     */

    /**
     *
     * Start of test cases of onAfterRendering
     */
    QUnit.test("Card Test - onAfterRendering", function (assert) {
        var onAfterRenderingStub = sinon.stub(CardController.__proto__, "onAfterRendering", function () {
            return undefined;
        });

        var oViewStub = sinon.stub(oController, "getView").returns({
            byId: function() {
                return {
                    getBinding: function() {
                        return {
                            getPath: function() { return "sBindingPath";},
                            attachDataReceived: function() {}
                        }
                    }
                };
            }
        });

        var oControllerByIDStub = sinon.stub(oController, "byId").returns({
            attachBrowserEvent: function() {},
            attachUpdateFinished: function() {}
        });

        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (path) {
                    if (path == "/imageSupported") {
                        return true;
                    } else if (path == "/densityStyle") {
                        return "compact";
                    }
                },
            };
        };
        var actualValue = oController.onAfterRendering();
        assert.ok(actualValue === undefined, "list updated");
        onAfterRenderingStub.restore();
        oViewStub.restore();
        oControllerByIDStub.restore();
    });

    QUnit.test("Card Test - onAfterRendering, when OVP used as API and layout type is resizable", function (assert) {

        var oViewStub = sinon.stub(oController, "getView").returns({
            byId: function() {
                return {
                    getBinding: function() {
                        return {
                            getPath: function() { return "sBindingPath";},
                            attachDataReceived: function() {}
                        }
                    }
                };
            }
        });

        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (path) {
                    if (path == "/imageSupported") {
                        return false;
                    } else if (path == "/densityStyle") {
                        return "compact";
                    } else if (path == "/layoutDetail") {
                        return "resizable";
                    }
                },
            };
        };
        oController.cardId = "card056";
        oController.oDashboardLayoutUtil = {
            ROW_HEIGHT_PX: 16,
            CARD_BORDER_PX: 8,
            dashboardLayoutModel: {
                getCardById: function (id) {
                    return {
                        dashboardLayout: {
                            headerHeight: 82,
                            autoSpan: false,
                            rowSpan: 12,
                            showOnlyHeader: true,
                        },
                    };
                },
            },
            getCardDomId: function () {
                return "mainView--ovpLayout--card056";
            },
        };
        oController.getHeaderHeight = function () {
            return 98;
        };
        document.body.insertAdjacentHTML(
            "beforeend",
            '<div id="mainView--ovpLayout--card056" class="sapOvpWrapper1" style="height:320px; width:1500px"><div class="sapOvpWrapper"></div></div>'
        );
        var testContainer = document.querySelector("#mainView--ovpLayout--card056");
        document.querySelector("#container").appendChild(testContainer);

        var onAfterRenderingStub = sinon.stub(CardController.__proto__, "onAfterRendering", function () {
            return undefined;
        });

        var checkIfAPIIsUsedStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed", function () {
            return false;
        });

        oController.onAfterRendering();
        onAfterRenderingStub.restore();
        checkIfAPIIsUsedStub.restore();
        oViewStub.restore();
        var actualValue1 = document
            .getElementById("mainView--ovpLayout--card056")
            .getElementsByClassName("sapOvpWrapper")[0].style.height;
        var actualValue2 = document.getElementById("mainView--ovpLayout--card056").classList;
        var expectedValue1 = "78px";
        var expectedValue2 = "sapOvpMinHeightContainer";
        assert.ok(actualValue1 === expectedValue1, "setting the height in SapOvpWrapper class");
        assert.deepEqual(actualValue2[1], expectedValue2, "added height container class");
    });
    /**
     *
     * End of test cases of onAfterRendering method
     */

    /**
     *
     * Start of test cases onListItemPress
     */
    QUnit.test("List Card Test - On Content click of OVP Cards used as an API in other Applications", function (assert) {
        var oOVPCardAsAPIUtilsStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed", function () {
            return true;
        });
        var oCommonUtilsStub = sinon.stub(CommonUtils, "onContentClicked", function () {
            return undefined;
        });
        oController.checkAPINavigation = function () {
            return 1;
        };
        var actualValue = oController.onListItemPress();
        assert.ok(actualValue === undefined, "Valid semantic object and action are not available");
        oOVPCardAsAPIUtilsStub.restore();
        oCommonUtilsStub.restore();
    });

    QUnit.test("Check enablement of insight button for list card", function (assert) {
        var cardTestData = {
            card: {
                id: "card_29",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    category: "Contract Monitoring",
                    title: "Contract Expiry, Consumption and Target Value",
                    description: "",
                    listType: "extended",
                    entitySet: "SalesOrderSet",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    chartAnnotationPath: "com.sap.vocabularies.UI.v1.Chart#line",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotationsKPI.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var bAddToInsightsEnabled = false;
            oController.additionalCardActionsMenu = Promise.resolve({enabled: bAddToInsightsEnabled, openBy : function(){}});

            var byIdStub = sinon.stub(oView, "byId", function() {
                return {
                    getEnabled : function() { return false; },
                    setEnabled : function() {bAddToInsightsEnabled = true;}
                };
            });

            oController.onShowAdditionalCardActions({getSource : function() {}, cancelBubble: function() {}});

            setTimeout(function() {
                assert.ok(!bAddToInsightsEnabled, "The button Add Card To Insights is not enabled as data received is not called yet.");
                oController.onDataReceived(oController);
                oController.onShowAdditionalCardActions({getSource : function() {}, cancelBubble: function() {}});

                setTimeout(function() {
                    assert.ok(bAddToInsightsEnabled, "The button Add Card To Insights is enabled as data received is called and then after tripple dot is clicked.");
                    byIdStub.restore();
                    fnDone();
                });
            });
        });
    });

    QUnit.test("onShowInsightCardPreview - check if error messagebox is displayed & called with the correct arguments, when IBN Navigation does not exist for the card", function (assert) {
        oController.getView = function () {
            return {
                getController: function () {
                    return { oCardComponentData: {} };
                },
            };
        };
        sinon.stub(oController, "checkIBNNavigationExistsForCard").returns(false);
        var spyMessageBoxError = sinon.spy(sap.m.MessageBox, "error");
        oController.onShowInsightCardPreview();
        assert.ok(spyMessageBoxError.calledOnce, "MessageBox.error was called once");
        spyMessageBoxError.restore();
        oController.checkIBNNavigationExistsForCard.restore();
    });

    /**
     *
     * End of test cases onListItemPress
     */
});
