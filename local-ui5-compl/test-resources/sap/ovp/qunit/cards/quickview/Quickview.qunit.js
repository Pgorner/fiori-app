/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Lib"
], function (
    CardUtils, 
    mockservers, 
    Controller,
    CoreLib
) {
    "use strict";

    var oController;
    QUnit.module("sap.ovp.cards.Quickview", {
        beforeEach: function () {
            mockservers.loadMockServer(CardUtils.odataBaseUrl_salesOrder, CardUtils.odataRootUrl_salesOrder);
            return Controller.create({
                name: "sap.ovp.cards.quickview.Quickview"
            }).then(function(controller) { 
                oController = controller;
            });
        },
        afterEach: function () {
            mockservers.close();
        },
    });

    QUnit.test("Quickview Test - simple card", function (assert) {
        var cardTestData = {
            card: {
                id: "card_1",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "ContactSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Contacts",
                            title: /\{path: *'FirstName'.*\} *\{path: *'LastName'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Contact Info",
                                    props: [
                                        {
                                            label: "Phone",
                                            value: /\{path: *'PhoneNumber'.*\}/,
                                            type: "phone",
                                            url: "",
                                        },
                                        {
                                            label: "Email",
                                            value: /\{path: *'EmailAddress'.*\}/,
                                            type: "email",
                                            url: "",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        };

        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (val) {
                    return false;
                },
            };
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        
        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;
                // basic list XML structure tests
                assert.ok(CardUtils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                assert.ok(CardUtils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");
                assert.ok(
                    CardUtils.quickviewGroupElementNodeExists(cardXml),
                    "Basic XML check - see that there are GroupElement nodes"
                );
                // specific XML property binding value test
                assert.ok(CardUtils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
                fnDone();
            });
    });

    QUnit.test("Quickview card - screen reader attribute tests", function (assert) {
        var cardTestData = {
            card: {
                id: "card_2",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "ContactSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Contacts",
                            title: /\{path: *'FirstName'.*\} *\{path: *'LastName'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Contact Info",
                                    props: [
                                        {
                                            label: "Phone",
                                            value: /\{path: *'PhoneNumber'.*\}/,
                                            type: "phone",
                                            url: "",
                                        },
                                        {
                                            label: "Email",
                                            value: /\{path: *'EmailAddress'.*\}/,
                                            type: "email",
                                            url: "",
                                        },
                                    ],
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
            document.body.insertAdjacentHTML("beforeend", '<div id="testContainer" style="display: none;">');
            var testContainer = document.querySelector("#testContainer");
            oView.placeAt("testContainer");
            oView.invalidate();
            oView.onAfterRendering = function () {
                var cardHtml = oView.getDomRef();
                var cardListContent = testContainer.querySelector(".sapMQuickViewCard");
                assert.ok(
                    cardListContent.getAttribute("aria-label") ==
                    CoreLib.getResourceBundleFor("sap.ovp").getText("quickViewCard"),
                    "Quick view Card type is accessble"
                );
                oView.destroy();
                fnDone();
            };
        });
    });

    QUnit.test("Quickview Test - no groups", function (assert) {
        var cardTestData = {
            card: {
                id: "card_3",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "BusinessPartnerSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Business Partners",
                            title: /\{path: *'CompanyName'.*\} *\{path: *'LegalForm'.*\}/,
                            description: "",
                            icon: "",
                            groups: [],
                        },
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                assert.ok(CardUtils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                assert.ok(!CardUtils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");

                // specific XML property binding value test
                assert.ok(CardUtils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
                fnDone();
            });
    });

    QUnit.test("Quickview Test - empty group", function (assert) {
        var cardTestData = {
            card: {
                id: "card_4",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "SalesOrderSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Sales Orders",
                            title: /\{path: *'SalesOrderID'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Order Note",
                                    props: [],
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                assert.ok(CardUtils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                assert.ok(CardUtils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");

                // specific XML property binding value test
                assert.ok(CardUtils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
                fnDone();
            });
    });

    QUnit.test("Quickview Test - many properties", function (assert) {
        var cardTestData = {
            card: {
                id: "card_5",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "ProductSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations_many_dataFields_in_groupFields.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Products",
                            title: /\{path: *'Name'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Dimensions",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Height",
                                            value: /\{path: *'Height'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Height",
                                            value: /\{path: *'Height'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Height",
                                            value: /\{path: *'Height'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Height",
                                            value: /\{path: *'Height'.*\}/,
                                            url: "",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                assert.ok(CardUtils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                assert.ok(CardUtils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");
                assert.ok(
                    CardUtils.quickviewGroupElementNodeExists(cardXml),
                    "Basic XML check - see that there are GroupElement nodes"
                );

                // specific XML property binding value test
                assert.ok(CardUtils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
                fnDone();
            });
    });

    QUnit.test("Quickview Test - many groups", function (assert) {
        var cardTestData = {
            card: {
                id: "card_6",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "ProductSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations_many_groups_in_facets.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Products",
                            title: /\{path: *'Name'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Dimensions1",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                    ],
                                },
                                {
                                    header: "Dimensions2",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                    ],
                                },
                                {
                                    header: "Dimensions3",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                    ],
                                },
                                {
                                    header: "Dimensions4",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                    ],
                                },
                                {
                                    header: "Dimensions5",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                    ],
                                },
                                {
                                    header: "Dimensions6",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: "",
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: "",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                assert.ok(CardUtils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                assert.ok(CardUtils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");
                assert.ok(
                    CardUtils.quickviewGroupElementNodeExists(cardXml),
                    "Basic XML check - see that there are GroupElement nodes"
                );

                // specific XML property binding value test
                assert.ok(CardUtils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
                fnDone();
            });
    });

    QUnit.test("Quickview Test - use annotationPath with Qualifier", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "ContactSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                    annotationPath: "com.sap.vocabularies.UI.v1.Facets#Contacts",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Contacts",
                            title: /\{path: *'FirstName'.*\} *\{path: *'LastName'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Contact Info",
                                    props: [
                                        {
                                            label: "Phone",
                                            value: /\{path: *'PhoneNumber'.*\}/,
                                            type: "phone",
                                            url: "",
                                        },
                                        {
                                            label: "Email",
                                            value: /\{path: *'EmailAddress'.*\}/,
                                            type: "email",
                                            url: "",
                                        },
                                    ],
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
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var cardCfg = cardTestData.card.settings;
            var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

            // basic list XML structure tests
            assert.ok(CardUtils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
            assert.ok(CardUtils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");
            assert.ok(
                CardUtils.quickviewGroupElementNodeExists(cardXml),
                "Basic XML check - see that there are GroupElement nodes"
            );

            // specific XML property binding value test
            assert.ok(CardUtils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
            fnDone();
        });
    });

    QUnit.test("Quickview footer Test - use identificationAnnotationPath with Qualifier", function (assert) {
        var cardTestData = {
            card: {
                id: "card_8",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "SalesOrderSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#StackTest",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {},
                Footer: {
                    actions: [
                        {
                            type: /DataFieldForIntentBasedNavigation/,
                            action: /toappnavsample1/,
                            label: "SO Navigation (M) StackTest",
                            semanticObj: "Action1",
                        },
                        {
                            type: /DataFieldForAction/,
                            action: /SalesOrder_Confirm/,
                            label: "Confirm StackTest",
                        },
                        {
                            type: /DataFieldForAction/,
                            action: /SalesOrder_Cancel/,
                            label: "Cancel StackTest",
                        },
                    ],
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var expectedFooterRes = cardTestData.expectedResult.Footer;

            // basic list XML structure tests
            assert.ok(CardUtils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
            var actions = CardUtils.getActionsCount(cardXml);
            assert.ok(actions > 0, "Basic XML check - see that there are action nodes");
            assert.ok(actions == 3, "Basic XML check - validate buttons length");

            // specific XML property binding value test
            assert.ok(CardUtils.validateActionFooterXmlValues(cardXml, expectedFooterRes), "Action Footer XML Values");
            fnDone();
        });
    });

    QUnit.test("Quickview Test - group with formatted currency field which contains UOM", function (assert) {
        var cardTestData = {
            card: {
                id: "card_9",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "SalesOrderSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "('0500000000')",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations_forFormatField_in_isSummaryFacet.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Sales Orders",
                            title: /\{path: *'SalesOrderID'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Order Note",
                                    props: [
                                        {
                                            label: "SalesOrderID",
                                            value: /\{path: *'SalesOrderID'.*\}/,
                                            type: null,
                                            url: "",
                                        },
                                        {
                                            label: "GrossAmount",
                                            value: /\{path: *'GrossAmount'.*\} *\{path: *'CurrencyCode'.*\}/,
                                            type: null,
                                            url: "",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                assert.ok(CardUtils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                assert.ok(CardUtils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");

                // specific XML property binding value test
                assert.ok(CardUtils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
                fnDone();
            });
    });

    QUnit.test("Quickview footer Test - check if showFirstActionInFooter is false then first button setvisible is false", function (assert) {
        var cardTestData = {
            card: {
                id: "card_10",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "SalesOrderSet",
                    type: "sap.ovp.cards.quickview.Quickview",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#StackTest",
                    objectStreamCardsSettings: {
                        showFirstActionInFooter: false,
                    },
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {},
                Footer: {
                    actions: [
                        {
                            visible: false,
                        },
                    ],
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            oView.onBeforeRendering();
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            var expectedFooterRes = cardTestData.expectedResult.Footer;

            // basic list XML structure tests
            assert.ok(CardUtils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
            var actions = CardUtils.getActionsCount(cardXml);
            assert.ok(actions > 0, "Basic XML check - see that there are action nodes");
            assert.ok(actions == 3, "Basic XML check - validate buttons length");

            // specific XML property binding value test
            assert.ok(
                CardUtils.validateActionFooterButtonVisibility(cardXml, oView, expectedFooterRes),
                "Action Footer first button visibility"
            );
            fnDone();
        });
    });
});
