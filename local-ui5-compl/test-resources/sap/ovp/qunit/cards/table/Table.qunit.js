/*global QUnit*/

sap.ui.define([
    "sap/ovp/cards/CommonUtils",
    "test-resources/sap/ovp/qunit/cards/utils",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "test-resources/sap/ovp/mockservers",
    "sap/ui/core/mvc/Controller",
    "sap/m/Table",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/Lib"
], function (
    CommonUtils,
    utils,
    OVPCardAsAPIUtils,
    mockservers,
    Controller,
    Table,
    ColumnListItem,
    Label,
    JSONModel,
    Popover,
    jQuery,
    CoreLib
) {
    "use strict";

    var oController;
    var CardController;

    QUnit.module("sap.ovp.cards.Table", {
        beforeEach: function () {
            mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
            mockservers.loadMockServer(utils.odataBaseUrl_salesShare, utils.odataRootUrl_salesShare);
            var pCardController = Controller.create({
                name: "sap.ovp.cards.generic.Card"
            }).then(function(controller) { 
                CardController = controller;
            });
            var pController = Controller.create({
                name: "sap.ovp.cards.table.Table"
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
        },
    });

    QUnit.test("Table Card Test - testing Parameterized EntitySet - Valid Parameterized configuration (annotations & card settings)- formatItems should parse it correctly", function (assert) {
        var cardTestData = {
            card: {
                id: "card_1",
                model: "salesShare",
                template: "sap.ovp.cards.table",
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
                        itemsAggregationBinding: "{path: '/SalesShareParameters(P_Currency=%27EUR%27,P_Country=%27IN%27)/Results', length: 5, parameters: {custom: {_requestFrom: 'ovp_internal'}}}",
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");
                
                var tableNodeXml = utils.getTableItemsNode(cardXml);
                assert.ok(tableNodeXml !== undefined, "Existence check to XML Node of List");

                var itemsAggregationValue = tableNodeXml.getAttribute("items");
                assert.ok(
                    itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding,
                    "Table XML items-aggregation's value Includes the Parameterized-Entity-Set"
                );
                fnDone();
            });
    });

    QUnit.test("Table Card Test - testing Parameterized EntitySet - Invalid Parameterized configuration - No Selection Variant in card settings, Valid Selection Variant in Annotations", function (assert) {
        var cardTestData = {
            card: {
                id: "card_2",
                model: "salesShare",
                template: "sap.ovp.cards.table",
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

            var tableNodeXml = utils.getTableItemsNode(cardXml);
            assert.ok(tableNodeXml !== undefined, "Existence check to XML Node of List");

            var itemsAggregationValue = tableNodeXml.getAttribute("items");
            assert.ok(
                itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding,
                "Table XML items-aggregation's value Includes the Parameterized-Entity-Set"
            );
            fnDone();
        });
    });

    QUnit.test("Table Card Test - testing Parameterized EntitySet - Invalid Parameterized configuration - Invalid Selection Variant value in card settings, Valid Selection Variant annotations", function (assert) {
        var cardTestData = {
            card: {
                id: "card_3",
                model: "salesShare",
                template: "sap.ovp.cards.table",
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

            var tableNodeXml = utils.getTableItemsNode(cardXml);
            assert.ok(tableNodeXml !== undefined, "Existence check to XML Node of List");

            var itemsAggregationValue = tableNodeXml.getAttribute("items");
            assert.ok(
                itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding,
                "Table XML items-aggregation's value Includes the Parameterized-Entity-Set"
            );
            fnDone();
        });
    });

    QUnit.test("Table Test - simple card", function (assert) {
        var cardTestData = {
            card: {
                id: "card_4",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "SalesOrderLineItemSet",
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
                    Table: {
                        columns: [
                            {
                                text: "Item",
                            },
                            {
                                text: "Product ID",
                            },
                            {
                                text: "Quantity",
                            },
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    { text: /\{path: *'SalesOrderID'.*\}/ },
                                    { text: /\{path: *'ProductID'.*\}/ },
                                    { text: /\{path: *'Quantity'.*\}/ },
                                ],
                            },
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

            var cardCfg = cardTestData.card;
            var expectedTableRes = cardTestData.expectedResult.Body.Table;

            // basic table XML structure tests
            assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
            assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
            assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
            assert.ok(
                utils.tableColumnListItemNodeExists(cardXml),
                "Basic XML check - see that there is a ColumnListItem node"
            );
            assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

            // specific XML property binding value test
            assert.ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            fnDone();
        });
    });

    QUnit.test("Table Test - semantic object check for smartlink", function (assert) {
        var cardTestData = {
            card: {
                id: "card_4a",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "SalesOrderLineItemSet",
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
                    Table: {
                        items: {
                            ColumnListItem: {
                                cells: [
                                    { text: /\{path: *'SalesOrderID'.*\}/ },
                                    { text: /\{path: *'ProductID'.*\}/, semanticObject: "OVP" },
                                    { text: /\{path: *'Quantity'.*\}/ },
                                ],
                            },
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

            var cardCfg = cardTestData.card;
            var expectedTableRes = cardTestData.expectedResult.Body.Table;

            // basic table XML structure tests
            assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
            assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
            assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
            assert.ok(
                utils.tableColumnListItemNodeExists(cardXml),
                "Basic XML check - see that there is a ColumnListItem node"
            );
            assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

            // specific XML property binding value test
            assert.ok(utils.validateTableSemanticObjectValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            fnDone();
        });
    });

    QUnit.test("Table Test - Contact annotation check", function (assert) {
        var cardTestData = {
            card: {
                id: "card_contact_annotation_test",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "SalesOrderSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#TableContactAnnotaionTest",
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
                    Table: {
                        items: {
                            ColumnListItem: {
                                cells: [{ quickViewElement: "true" }],
                            },
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

            var cardCfg = cardTestData.card;
            var expectedTableRes = cardTestData.expectedResult.Body.Table;

            // basic table XML structure tests
            assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
            assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
            assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
            assert.ok(
                utils.tableColumnListItemNodeExists(cardXml),
                "Basic XML check - see that there is a ColumnListItem node"
            );
            assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

            // specific XML property binding value test
            assert.ok(utils.validateTableContactAnnotationValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            fnDone();
        });
    });

    QUnit.test("Table Test - center alignment check for table card", function (assert) {
        var cardTestData = {
            card: {
                id: "card_4b",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "SalesOrderSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#TableCenterAlignmentTest",
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
                    Table: {
                        items: {
                            ColumnListItem: {
                                cells: [{ className: "textAlignLeft sapOvpObjectNumber" }],
                            },
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

            var cardCfg = cardTestData.card;
            var expectedTableRes = cardTestData.expectedResult.Body.Table;

            // basic table XML structure tests
            assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
            assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
            assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
            assert.ok(
                utils.tableColumnListItemNodeExists(cardXml),
                "Basic XML check - see that there is a ColumnListItem node"
            );
            assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

            // specific XML property binding value test
            assert.ok(utils.validateTableCenterAlignment(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            fnDone();
        });
    });

    QUnit.test("Table Test - data point with 'sap:text' attribute", function (assert) {
        var cardTestData = {
            card: {
                id: "card_5",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "ProductSet",
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
                    Table: {
                        columns: [
                            {
                                text: "Product ID",
                            },
                            {
                                text: "Category",
                            },
                            {
                                text: "Weight",
                            },
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    { text: /\{path: *'ProductID'.*\}/ },
                                    { number: /\{path: *'MeasureUnit'.*\}/, state: "None" },
                                    { text: /\{path: *'Category'.*\}/ },
                                ],
                            },
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

            var cardCfg = cardTestData.card;
            var expectedTableRes = cardTestData.expectedResult.Body.Table;

            // basic table XML structure tests
            assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
            assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
            assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
            assert.ok(
                utils.tableColumnListItemNodeExists(cardXml),
                "Basic XML check - see that there is a ColumnListItem node"
            );
            assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

            // specific XML property binding value test
            assert.ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            fnDone();
        });
    });

    QUnit.test("Table Test -  Quicklink for Table", function (assert) {
        var cardTestData = {
            card: {
                id: "card_029",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "SalesOrderLineItemSet",
                    showLineItemDetail: true,
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#QuickLinkTest",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_Table.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            assert.ok(utils.getTableItemsNode(cardXml), "Basic XML check - see that there is a cells node");
            assert.ok(utils.tableQuickNodeExists(cardXml), "Check if the Quick View is present");
            fnDone();
        });
    });

    QUnit.test("Table Test - Flexibility of columns", function (assert) {
        var cardTestData = {
            card: {
                id: "card_6",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "ProductSet",
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
                    Table: {
                        columns: [
                            {
                                text: "Product ID",
                            },
                            {
                                text: "Weight",
                            },
                            {
                                text: "Category",
                            },
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    { text: /\{path: *'ProductID'.*\}/ },
                                    { number: /\{path: *'MeasureUnit'.*\}/, state: "None" },
                                    { text: /\{path: *'Category'.*\}/ },
                                ],
                            },
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

            var cardCfg = cardTestData.card;
            var expectedTableRes = cardTestData.expectedResult.Body.Table;

            // basic table XML structure tests
            assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
            assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
            assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
            assert.ok(
                utils.tableColumnListItemNodeExists(cardXml),
                "Basic XML check - see that there is a ColumnListItem node"
            );
            assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

            // specific XML property binding value test
            assert.ok(utils.validateFlexibleTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            fnDone();
        });
    });

    QUnit.test("Table Test - one data field with empty mapping", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "SalesOrderSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_lineItemSet_1_dataFields_emptyMapping.xml",
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        columns: [
                            {
                                text: "Customer",
                            },
                            {
                                text: "Order ID",
                            },
                            {
                                text: "Gross Amt.",
                            },
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    { text: /\{path: *'CustomerName'.*\}/ },
                                    { text: /\{path: *'SalesOrderID'.*\}/ },
                                    { text: null },
                                ],
                            },
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

            var cardCfg = cardTestData.card;
            var expectedTableRes = cardTestData.expectedResult.Body.Table;

            // basic table XML structure tests
            assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
            assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
            assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
            assert.ok(
                utils.tableColumnListItemNodeExists(cardXml),
                "Basic XML check - see that there is a ColumnListItem node"
            );
            assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

            // specific XML property binding value test
            assert.ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            fnDone();
        });
    });

    QUnit.test("Table Test - use annotationPath with FieldGroup", function (assert) {
        var cardTestData = {
            card: {
                id: "card_8",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "SalesOrderLineItemSet",
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
                    Table: {
                        columns: [
                            {
                                text: "SalesOrderID",
                            },
                            {
                                text: "Time Stamp",
                            },
                            {
                                text: "Gross Amt.",
                            },
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    { text: /\{path: *'SalesOrderID'.*\}/ },
                                    { text: /\{path: *'DeliveryDate'.*\}/ },
                                    { text: /\{path: *'GrossAmount'.*\}/ },
                                ],
                            },
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

            var cardCfg = cardTestData.card;
            var expectedTableRes = cardTestData.expectedResult.Body.Table;

            // basic table XML structure tests
            assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
            assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
            assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
            assert.ok(
                utils.tableColumnListItemNodeExists(cardXml),
                "Basic XML check - see that there is a ColumnListItem node"
            );
            assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

            // specific XML property binding value test
            assert.ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            fnDone();
        });
    });
    
    QUnit.test("Table Card Test - Counter in header exists only if all items are not displayed", function (assert) {
        var cardTestData = {
            card: {
                id: "card_81",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    title: "New Sales Orders",
                    subTitle: "Today",
                    entitySet: "SalesOrderSet",
                    category: "Sales Order Line Items - Table",
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

    QUnit.test("Table Card Test - Counter in header reads from event if binding is not final", function (assert) {
        var cardTestData = {
            card: {
                id: "card_811",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    title: "New Sales Orders",
                    subTitle: "Today",
                    entitySet: "SalesOrderSet",
                    category: "Sales Order Line Items - Table",
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
    QUnit.test("Table Card Test - Counter in header does not exists if all the items are displayed", function (assert) {
        var cardTestData = {
            card: {
                id: "card_82",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    title: "New Sales Orders",
                    subTitle: "Today",
                    entitySet: "SalesOrderSet",
                    category: "Sales Order Line Items - Table",
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
   
    QUnit.test("Table Card Test - navigation from line item", function (assert) {
        var cardTestData = {
            card: {
                id: "card_10",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
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
                    };
                },
            };
            oController.onColumnListItemPress(oEvent);
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

    QUnit.test("image card Screen reader test", function (assert) {
        var cardTestData = {
            card: {
                id: "card_11",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "SalesOrderLineItemSet",
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
                    Table: {
                        columns: [
                            {
                                text: "Item",
                            },
                            {
                                text: "Product ID",
                            },
                            {
                                text: "Quantity",
                            },
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    { text: /\{path: *'SalesOrderID'.*\}/ },
                                    { text: /\{path: *'ProductID'.*\}/ },
                                    { text: /\{path: *'Quantity'.*\}/ },
                                ],
                            },
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            document.body.insertAdjacentHTML("beforeend", '<div id="testContainer" style="display: none;">');
            var testContainer = document.querySelector("#testContainer");
            oView.placeAt("testContainer");
            oView.invalidate();
            oView.onAfterRendering = function () {
                var cardHtml = oView.getDomRef();
                var cardListContent = testContainer.querySelector(".sapMList");
                assert.ok(
                    cardListContent.getAttribute("aria-label") ==
                    CoreLib.getResourceBundleFor("sap.ovp").getText("tableCard"),
                    "Table Card type is accessble"
                );
                oView.destroy();
                fnDone();
            };
        });
    });

    QUnit.test("Table Card Test - annotation with expand", function (assert) {
        var cardTestData = {
            card: {
                id: "card_12",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Sales Order Line Items - Table",
                    entitySet: "SalesOrderLineItemSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.FieldGroup#ToTestExpand/Data",
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
                    Table: {
                        columns: [
                            {
                                text: "SalesOrderID",
                            },
                            {
                                text: "Time Stamp",
                            },
                            {
                                text: "ProductId",
                            },
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    { text: /\{path: *'SalesOrderID'.*\}/ },
                                    { text: /\{path: *'DeliveryDate'.*\}/ },
                                    { text: /\{path: *'ToProduct\/ProductID'.*\}/ },
                                ],
                            },
                        },
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                assert.ok(
                    utils.tableColumnListItemNodeExists(cardXml),
                    "Basic XML check - see that there is a ColumnListItem node"
                );
                assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                assert.ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
                fnDone();
            });
    });

    QUnit.test("Card Test - Full annotations - With KPI Header with DP, Filter And Selection", function (assert) {
        var cardTestData = {
            card: {
                id: "card_13",
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
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#line",
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
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card.settings;

                // validate KPI Header
                var expectedHeaderRes = cardTestData.expectedResult.Header;
                // assert.ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // basic table XML structure tests
                assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                assert.ok(
                    utils.tableColumnListItemNodeExists(cardXml),
                    "Basic XML check - see that there is a ColumnListItem node"
                );
                assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");
                fnDone();
            });
    });

    QUnit.test("Card Test - Full annotations - With KPI Header with DP and Filter-By Values (No SortBy)", function (assert) {
        var cardTestData = {
            card: {
                id: "card_14",
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
                        sortBy: false,
                        filterBy: true,
                    },
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card.settings;

                // validate KPI Header
                var expectedHeaderRes = cardTestData.expectedResult.Header;
                // assert.ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // basic table XML structure tests
                assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                assert.ok(
                    utils.tableColumnListItemNodeExists(cardXml),
                    "Basic XML check - see that there is a ColumnListItem node"
                );
                assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");
                fnDone();
            });
    });

    QUnit.test("Card Test - Full annotations - With KPI Header with DP And Sort (No Filter-By-values)", function (assert) {
        var cardTestData = {
            card: {
                id: "card_15",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    category: "Contract Monitoring",
                    title: "Contract Expiry, Consumption and Target Value",
                    description: "",
                    showSortingInHeader: true,
                    showFilterInHeader: false,
                    listFlavor: "bar",
                    listType: "extended",
                    entitySet: "SalesOrderSet",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#line",
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
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card.settings;

                // validate KPI Header
                var expectedHeaderRes = cardTestData.expectedResult.Header;
                assert.ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // basic table XML structure tests
                assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                assert.ok(
                    utils.tableColumnListItemNodeExists(cardXml),
                    "Basic XML check - see that there is a ColumnListItem node"
                );
                assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");
                fnDone();
            });
    });

    QUnit.test("Card Test - Full annotations - With KPI Header with NO DP but with Filter And Selection", function (assert) {
        var cardTestData = {
            card: {
                id: "card_16",
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
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card.settings;

                // validate KPI Header
                var expectedHeaderRes = cardTestData.expectedResult.Header;
                assert.ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // basic table XML structure tests
                assert.ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                assert.ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                assert.ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                assert.ok(
                    utils.tableColumnListItemNodeExists(cardXml),
                    "Basic XML check - see that there is a ColumnListItem node"
                );
                assert.ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");
                fnDone();
            });
    });
    
    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for item Binding Function
     *  ------------------------------------------------------------------------------
     */

    QUnit.test("Card Test - Testing card item binding info", function (assert) {
        oController.getView = function () {
            return {
                byId: function (arg) {
                    if (arg && arg === "ovpTable") {
                        return {
                            getBindingInfo: function (arg) {
                                if (arg && arg === "items") {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                        };
                    } else {
                        return {
                            getBindingInfo: function () {
                                return false;
                            },
                        };
                    }
                },
            };
        };
        var expectedResult = true;
        assert.deepEqual(oController.getCardItemBindingInfo() == true, expectedResult);
    });

    QUnit.test("Card Test - Testing card item binding info", function (assert) {
        var tableData = {
            results: [
                {
                    BusinessProcess: "FI",
                },
            ],
        };
        var oTable = new Table({
            id: "ovpTable",
            headerText: "JavaScript",
            inset: true,
        });
        var oTemplate = new ColumnListItem({
            cells: [
                new Label({
                    text: "{test>BusinessProcess}",
                }),
            ],
        });
        var model = new JSONModel();
        model.setData(tableData);
        oTable.setModel(model, "test");
        oTable.bindItems("test>/results", oTemplate);
        oController.getView = function () {
            return {
                byId: function () {
                    return oTable;
                },
            };
        };
        assert.ok(oController.getCardItemBindingInfo().path == "/results", "To check the items path");
        oTable.destroy();
    });

    /**
     *  ------------------------------------------------------------------------------
     *  End of Test Cases for item Binding Function
     *  ------------------------------------------------------------------------------
     */

    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for onItemPress Function
     *  ------------------------------------------------------------------------------
     */

    QUnit.test("table Card Test - On Content click of OVP Cards used as an API in other Applications", function (assert) {
        var oOVPCardAsAPIUtilsStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed", function () {
            return true;
        });
        var oCommonUtilsStub = sinon.stub(CommonUtils, "onContentClicked", function () {
            return undefined;
        });
        oController.checkAPINavigation = function () {
            return 1;
        };
        var actualValue = oController.onColumnListItemPress();
        assert.ok(actualValue === undefined, "Valid semantic object and action are not available");
        oOVPCardAsAPIUtilsStub.restore();
        oCommonUtilsStub.restore();
    });

    /**
     *  ------------------------------------------------------------------------------
     *  Test Cases for OnContact Details Press
     *  ------------------------------------------------------------------------------
     */

    QUnit.test("Table Card Test - navigation from contact details", function (assert) {
        var oBindingContext = {
            getPath: function () {
                return "/BusinessPartnerSet('0100000004')";
            },
        };
        var oPopover = [
            new Popover({
                title: "Sample Popover",
            }),
        ];

        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return oBindingContext;
                    },
                    getParent: function () {
                        return {
                            getAggregation: function (arg) {
                                if (arg == "items") {
                                    return oPopover;
                                }
                            },
                        };
                    },
                };
            },
        };
        var openByStub = sinon.stub(oPopover[0], "openBy");
        openByStub.returns(null);
        oController.onContactDetailsLinkPress(oEvent);
        assert.ok(
            oPopover[0].mObjectBindingInfos.undefined.path === "/BusinessPartnerSet('0100000004')",
            "Binding path is fetched for Popover"
        );
    });

    QUnit.test("Table Card Test - navigation from contact details When binding context is null", function (assert) {
        var oBindingContext = null;
        var oPopover = [
            new Popover({
                title: "Sample Popover",
            }),
        ];
        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return oBindingContext;
                    },
                    getParent: function () {
                        return {
                            getAggregation: function (arg) {
                                if (arg == "items") {
                                    return oPopover;
                                }
                            },
                        };
                    },
                };
            },
        };
        var actualValue = oController.onContactDetailsLinkPress(oEvent);
        assert.ok(actualValue === undefined, "Function returns undefined if the binding context is null");
    });

    /**
     *  ------------------------------------------------------------------------------
     *  Test Cases for OnAfterRendering Details Press
     *  ------------------------------------------------------------------------------
     */

    QUnit.test("Card Test - onAfterRendering, when Layout type is resizable", function (assert) {

        var oViewStub = sinon.stub(oController, "getView").returns({
            byId: function() {
                return {
                    getBinding: function() {
                        return {
                            getPath: function() { return "sBindingPath";},
                            attachDataReceived: function() {}
                        }
                    },
                    attachBrowserEvent: function() {}
                };
            }
        });

        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (path) {
                    if (path == "/layoutDetail") {
                        return "resizable";
                    }
                },
            };
        };
        var getOwnercomponent = sinon.stub(CardController.__proto__, "getOwnerComponent", function () {
            return {
                getComponentData: function () {
                    return {
                        cardId: "card_10",
                    };
                },
            };
        });
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
        var testContainer = jQuery(
            '<div id="mainView--ovpLayout--card056" class="sapOvpWrapper1" style="height:320px; width:1500px"><div class="sapOvpWrapper"></div></div>'
        ).appendTo("body");
        jQuery("#container").append(testContainer);

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
        var expectedValue1 = "79px";
        var expectedValue2 = "sapOvpMinHeightContainer";
        assert.ok(actualValue1 === expectedValue1, "setting the height in SapOvpWrapper class");
        assert.deepEqual(actualValue2[1], expectedValue2, "added height container class");
        getOwnercomponent.restore();
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
});
