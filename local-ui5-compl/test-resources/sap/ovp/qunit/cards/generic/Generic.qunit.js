/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ui/core/mvc/Controller",
    "sap/ovp/cards/NavigationHelper"
], function (
    CardUtils, 
    mockservers, 
    Controller, 
    NavigationHelper
) {
    "use strict";

    var oController;
    QUnit.module("sap.ovp.cards.Generic", {
        beforeEach: function () {
            mockservers.loadMockServer(CardUtils.odataBaseUrl_salesOrder, CardUtils.odataRootUrl_salesOrder);
            return Controller.create({
                name: "sap.ovp.cards.generic.Card"
            }).then(function(controller) { 
                oController = controller;
            });
        },
        afterEach: function () {
            mockservers.close();
        },
    });

    QUnit.test("function onInit - CardController", function (assert) {
        var cardTestData = {
            card: {
                id: "card_0",
                template: "sap.ovp.cards.table",
                settings: {
                    entitySet: "SalesOrderSet",
                    category: "Static Category",
                    title: "Static Title",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    title: "Static Title",
                    subTitle: "Static Description",
                },
            }
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
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
                    !oController.GloabalEventBus.subscribe.calledOnce,
                    "The global Event bus is not subscribed as the maincomponent is present."
                );
                fnDone();
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Test - Full annotations - With Entity Path - Header Config Only", function (assert) {
        var cardTestData = {
            card: {
                id: "card_1",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderSet",
                    category: "Static Category",
                    title: "Static Title",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    title: "Static Title",
                    subTitle: "Static Description",
                },
            },
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");
                assert.ok(CardUtils.isValidTitle(cardTestData, cardXml), "Header's Title property Value"); // validate the card's header XML
                assert.ok(CardUtils.isValidSub(cardTestData, cardXml), "Header's Description property Value");
                fnDone();
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Test - Full annotations - With Entity Path - Header Config Only Description", function (assert) {
        var cardTestData = {
            card: {
                id: "card_2",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderSet",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    subTitle: "Static Description",
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");
                // validate the card's header XML
                assert.ok(CardUtils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                assert.ok(CardUtils.isValidSub(cardTestData, cardXml), "Header's Description property Value");
                fnDone();
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Test - Full annotations - With Entity Path - Header Config Only SubTitle", function (assert) {
        var cardTestData = {
            card: {
                id: "card_3",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderSet",
                    subTitle: "Static Subtitle",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    subTitle: "Static Subtitle",
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");
                // validate the card's header XML
                assert.ok(CardUtils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                assert.ok(CardUtils.isValidSub(cardTestData, cardXml), "Header's Subtitle property Value");
                fnDone();
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Test - Full annotations - With Entity Path - Header Config with SubTitle and Description", function (assert) {
        var cardTestData = {
            card: {
                id: "card_4",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderSet",
                    subTitle: "Static Subtitle",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    subTitle: "Static Subtitle",
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");
                // validate the card's header XML
                assert.ok(CardUtils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                assert.ok(CardUtils.isValidSub(cardTestData, cardXml), "Header's Subtitle property Value");
                fnDone();
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Test - Full annotations - With Entity Path - Header Config Only Title", function (assert) {
        var cardTestData = {
            card: {
                id: "card_5",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderSet",
                    title: "Static Title",
                    subTitle: "Static Subtitle",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    title: "Static Title",
                    subTitle: "Static Subtitle",
                },
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");
                // validate the card's header XML
                assert.ok(CardUtils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                assert.ok(CardUtils.isValidSub(cardTestData, cardXml), "Header's Description property Value");
                fnDone();
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Navigation Test- getEntityIntents without identificationAnnotationPath", function (assert) {
        var oView,
            oController,
            aIntents,
            cardTestData = {
                card: {
                    id: "card_6",
                    model: "salesOrder",
                    template: "sap.ovp.cards.list",
                    settings: {
                        entitySet: "SalesOrderSet",
                        title: "Static Title",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
                },
                expectedResult: {
                    Header: {
                        title: "Static Title",
                    },
                },
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                oController = oView.getController();
                aIntents = NavigationHelper.getEntityNavigationEntries(
                    null,
                    oController.getModel(),
                    oController.getEntityType(),
                    oController.getCardPropertiesModel()
                );

                fnDone();

                assert.ok(
                    aIntents.length === 3,
                    "identification annotation should contain 3 records of DataFieldForIntentBasedNavigation"
                );
                assert.ok(aIntents[0].action === "toappnavsample2");
                assert.ok(aIntents[0].semanticObject === "Action2");
                assert.ok(aIntents[1].action === "toappnavsample1");
                assert.ok(aIntents[1].semanticObject === "Action1");
                assert.ok(aIntents[2].action === "toappnavsample3");
                assert.ok(aIntents[2].semanticObject === "Action3");

                aIntents = 
                    NavigationHelper.getEntityNavigationEntries(
                        undefined,
                        oController.getModel(),
                        oController.getEntityType(),
                        oController.getCardPropertiesModel(),
                        "com.sap.vocabularies.UI.v1.LineItem"
                    );
                assert.ok(
                    aIntents.length === 2,
                    "identification annotation should contain 2 records of DataFieldForIntentBasedNavigation"
                );
                assert.ok(aIntents[0].action === "AC1");
                assert.ok(aIntents[0].semanticObject === "SO1");
                assert.ok(aIntents[1].action === "AC2");
                assert.ok(aIntents[1].semanticObject === "SO2");
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Navigation Test- getEntityIntents with identificationAnnotationPath", function (assert) {
        var oView,
            oController,
            aIntents,
            cardTestData = {
                card: {
                    id: "card_7",
                    model: "salesOrder",
                    template: "sap.ovp.cards.quickview",
                    settings: {
                        entitySet: "SalesOrderSet",
                        type: "sap.ovp.cards.quickview.Quickview",
                        entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#ToTest",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
                },
                expectedResult: {
                    Header: {
                        title: "Static Title",
                    },
                },
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                oController = oView.getController();
                aIntents = NavigationHelper.getEntityNavigationEntries(
                    undefined,
                    oController.getModel(),
                    oController.getEntityType(),
                    oController.getCardPropertiesModel()
                );

                fnDone();

                assert.ok(
                    aIntents.length === 3,
                    "identification annotation should contain 3 records of DataFieldForIntentBasedNavigation"
                );
                assert.ok(aIntents[0].action === "TestToappnavsample2", "Validate first action");
                assert.ok(aIntents[0].semanticObject === "TestAction2", "Validate first action");
                assert.ok(aIntents[1].action === "TestToappnavsample1", "Validate second action");
                assert.ok(aIntents[1].semanticObject === "TestAction1", "Validate second action");
                assert.ok(aIntents[2].action === "TestToappnavsample3", "Validate third action");
                assert.ok(aIntents[2].semanticObject === "TestAction3", "Validate third action");
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Check for getting correct selection and presentation path's with selectionPresentationAnnotationPath", function (assert) {
        var oView,
            oController,
            oCardPropertiesModel,
            oData,
            cardTestData = {
                card: {
                    id: "card_100",
                    model: "salesOrder",
                    template: "sap.ovp.cards.quickview",
                    settings: {
                        entitySet: "SalesOrderSet",
                        type: "sap.ovp.cards.quickview.Quickview",
                        entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                        selectionPresentationAnnotationPath:
                            "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
                },
                expectedResult: {
                    Header: {
                        title: "Static Title",
                    },
                },
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                oController = oView.getController();
                oCardPropertiesModel = oController.getCardPropertiesModel();
                oData = oCardPropertiesModel.getData();
                fnDone();

                assert.ok(
                    oData.selectionPresentationAnnotationPath ===
                    "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                    "selectionPresentationAnnotationPath should be com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation"
                );
                assert.ok(
                    oData.selectionAnnotationPath === "com.sap.vocabularies.UI.v1.SelectionVariant#SP2",
                    "selectionAnnotationPath should be com.sap.vocabularies.UI.v1.SelectionVariant#SP2"
                );
                assert.ok(
                    oData.presentationAnnotationPath === "com.sap.vocabularies.UI.v1.PresentationVariant#customer",
                    "presentationAnnotationPath should be com.sap.vocabularies.UI.v1.PresentationVariant#customer"
                );
                assert.ok(
                    oData.annotationPath === "com.sap.vocabularies.UI.v1.LineItem#View2",
                    "annotationPath should be com.sap.vocabularies.UI.v1.LineItem#View2"
                );
                assert.ok(
                    oData.chartAnnotationPath === "com.sap.vocabularies.UI.v1.Chart#line",
                    "chartAnnotationPath should be com.sap.vocabularies.UI.v1.Chart#line"
                );
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Navigation Test- doIntentBasedNavigation", function (assert) {
        var oController,
            cardTestData = {
                card: {
                    id: "card_8",
                    model: "salesOrder",
                    template: "sap.ovp.cards.list",
                    settings: {
                        entitySet: "SalesOrderSet",
                        title: "Static Title",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
                },
                expectedResult: {
                    Header: {
                        title: "Static Title",
                    }
                }
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                oController = oView.getController();
                oController.enableClick = true;
                var doIntentBasedNavigationStub = sinon.stub(oController, "doNavigation");
                var getBindingContextStub = sinon.stub(oView, "getBindingContext");

                var oEvent = {};
                oController.onHeaderClick(oEvent);
                assert.equal(doIntentBasedNavigationStub.callCount, 1, "doIntentBasedNavigation call count");
                assert.equal(getBindingContextStub.callCount, 1, "getBindingContext call count");
                assert.equal(
                    doIntentBasedNavigationStub.args[0][0],
                    undefined,
                    "doIntentBasedNavigation was called with undefine context"
                );

                var context = { ctx: 1 };
                getBindingContextStub.returns(context);
                oController.onHeaderClick(oEvent);
                assert.equal(doIntentBasedNavigationStub.callCount, 2, "doIntentBasedNavigation call count");
                assert.equal(getBindingContextStub.callCount, 2, "getBindingContext call count");
                assert.deepEqual(
                    doIntentBasedNavigationStub.args[1][0],
                    context,
                    "doIntentBasedNavigation was called with the context"
                );
                fnDone();
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Navigation Test- do Url navigation - getEntity with identificationAnnotationPath", function (assert) {
        var oView,
            oController,
            navigationEntities,
            cardTestData = {
                card: {
                    id: "card_11",
                    model: "salesOrder",
                    template: "sap.ovp.cards.list",
                    settings: {
                        entitySet: "SalesOrderSet",
                        title: "Static Title",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations_for_url_navigation.xml",
                },
                expectedResult: {
                    Header: {
                        title: "Static Title",
                    },
                },
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                oController = oView.getController();
                navigationEntities = NavigationHelper.getEntityNavigationEntries(
                    undefined,
                    oController.getModel(),
                    oController.getEntityType(),
                    oController.getCardPropertiesModel()
                );

                fnDone();

                assert.ok(
                    navigationEntities.length === 2,
                    "identification annotation should contain 2 records of DataFieldForIntentBasedNavigationa and DataFieldWithUrl"
                );
                assert.ok(
                    navigationEntities[0].type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
                    "Validate first datafield"
                );
                assert.ok(navigationEntities[0].url === "https://www.google.com", "Validate first datafield");
                assert.ok(
                    navigationEntities[1].type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                    "Validate second datafield"
                );
                assert.ok(navigationEntities[1].action === "toappnavsample", "Validate second datafield");
                assert.ok(navigationEntities[1].semanticObject === "Action", "Validate second datafield");
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Navigation Test- do intent navigation", function (assert) {
        var oView,
            oController,
            aIntents,
            cardTestData = {
                card: {
                    id: "card_12",
                    model: "salesOrder",
                    template: "sap.ovp.cards.list",
                    settings: {
                        entitySet: "BusinessPartnerSet",
                        title: "Static Title",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations_for_url_navigation.xml",
                },
                expectedResult: {
                    Header: {
                        title: "Static Title",
                    },
                },
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                fnDone();

                oController = oView.getController();
                oController.enableClick = true;
                oController.oMainComponent = {};
                var doIntentBasedNavigationStub = sinon.stub(oController, "doIntentBasedNavigation");
                var getBindingContextStub = sinon.stub(oView, "getBindingContext");
                var oHeader = oView.byId("ovpCardHeader");
                oController.onHeaderClick({});
                assert.equal(doIntentBasedNavigationStub.callCount, 1, "doNavigation call count");
                assert.equal(getBindingContextStub.callCount, 1, "getBindingContext call count");
                assert.equal(
                    doIntentBasedNavigationStub.args[0][1].action,
                    "toappnavsample",
                    "doNavigation was called with intent"
                );
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Navigation Test- do intent navigation - getEntity with identificationAnnotationPath", function (assert) {
        var oView,
            oController,
            navigationEntities,
            cardTestData = {
                card: {
                    id: "card_14",
                    model: "salesOrder",
                    template: "sap.ovp.cards.list",
                    settings: {
                        entitySet: "BusinessPartnerSet",
                        title: "Static Title",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations_for_url_navigation.xml",
                },
                expectedResult: {
                    Header: {
                        title: "Static Title",
                    },
                },
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                oController = oView.getController();
                navigationEntities = NavigationHelper.getEntityNavigationEntries(
                    undefined,
                    oController.getModel(),
                    oController.getEntityType(),
                    oController.getCardPropertiesModel()
                );

                fnDone();

                assert.ok(
                    navigationEntities.length === 2,
                    "identification annotation should contain 2 records of DataFieldForIntentBasedNavigationa and DataFieldWithUrl"
                );
                assert.ok(
                    navigationEntities[0].type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                    "Validate second datafield"
                );
                assert.ok(navigationEntities[0].action === "toappnavsample", "Validate first datafield");
                assert.ok(navigationEntities[0].semanticObject === "Action", "Validate first datafield");
                assert.ok(
                    navigationEntities[1].type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
                    "Validate second datafield"
                );
                assert.ok(navigationEntities[1].url === "https://www.google.com", "Validate second datafield");
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Footer Action Test", function (assert) {
        var oView,
            oController,
            oNavParams,
            cardTestData = {
                card: {
                    id: "card_25",
                    model: "salesOrder",
                    template: "sap.ovp.cards.quickview",
                    settings: {
                        category: "Contact",
                        entitySet: "SalesOrderSet",
                        entityPath: "('0500000008')",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
                },
                expectedResult: {
                    Footer: {
                        actions: [
                            {
                                type: /DataFieldForIntentBasedNavigation/,
                                semanticObj: "Action2",
                                action: "toappnavsample2",
                                label: "SO Navigation (M)",
                            },
                            {
                                type: /DataFieldForAction/,
                                action: /SalesOrder_Confirm/,
                                label: "Confirm H",
                            },
                            {
                                type: /DataFieldForAction/,
                                action: /SalesOrder_Cancel/,
                                label: "Cancel H",
                            },
                            {
                                type: /DataFieldForIntentBasedNavigation/,
                                semanticObj: "Action1",
                                action: "toappnavsample1",
                                label: "SO Navigation (M)",
                            },
                            {
                                type: /DataFieldForIntentBasedNavigation/,
                                semanticObj: "Action3",
                                action: "toappnavsample3",
                                label: "SO Navigation (M)",
                            },
                            {
                                type: /DataFieldForAction/,
                                action: /SalesOrder_Confirm/,
                                label: "Confirm",
                            },
                            {
                                type: /DataFieldForAction/,
                                action: /SalesOrder_Cancel/,
                                label: "Cancel",
                            },
                        ],
                    },
                },
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                fnDone();

                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedFooterRes = cardTestData.expectedResult.Footer;

                // basic list XML structure tests
                assert.ok(CardUtils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
                var actions = CardUtils.getActionsCount(cardXml);
                assert.ok(actions > 0, "Basic XML check - see that there are action nodes");
                assert.ok(actions == expectedFooterRes.actions.length, "Basic XML check - validate buttons length");

                // specific XML property binding value test
                assert.ok(CardUtils.validateActionFooterXmlValues(cardXml, expectedFooterRes), "Action Footer XML Values");
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Footer Action Test - validate one action", function (assert) {
        var oView,
            oController,
            oNavParams,
            cardTestData = {
                card: {
                    id: "card_26",
                    model: "salesOrder",
                    template: "sap.ovp.cards.quickview",
                    settings: {
                        category: "Contact",
                        entitySet: "SalesOrderSet",
                        entityPath: "('0500000008')",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations_one_action_in_identification.xml",
                },
                expectedResult: {
                    Footer: {
                        actions: [
                            {
                                type: /DataFieldForAction/,
                                action: /SalesOrder_Confirm/,
                                label: "Confirm",
                            },
                        ],
                    },
                },
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                fnDone();

                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedFooterRes = cardTestData.expectedResult.Footer;

                // basic list XML structure tests
                assert.ok(CardUtils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
                var actions = CardUtils.getActionsCount(cardXml);
                assert.ok(actions > 0, "Basic XML check - see that there are action nodes");
                assert.ok(actions == 1, "Basic XML check - validate buttons length");

                // specific XML property binding value test
                assert.ok(CardUtils.validateActionFooterXmlValues(cardXml, expectedFooterRes), "Action Footer XML Values");
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Footer Action Test - validate two actions", function (assert) {
        var oView,
            oController,
            oNavParams,
            cardTestData = {
                card: {
                    id: "card_27",
                    model: "salesOrder",
                    template: "sap.ovp.cards.quickview",
                    settings: {
                        category: "Contact",
                        entitySet: "SalesOrderSet",
                        entityPath: "('0500000008')",
                    },
                },
                dataSource: {
                    baseUrl: CardUtils.odataBaseUrl_salesOrder,
                    rootUri: CardUtils.odataRootUrl_salesOrder,
                    annoUri: CardUtils.testBaseUrl + "data/annotations_two_actions_in_identification.xml",
                },
                expectedResult: {
                    Footer: {
                        actions: [
                            {
                                type: /DataFieldForAction/,
                                action: /SalesOrder_Confirm/,
                                label: "Confirm H",
                            },
                            {
                                type: /DataFieldForAction/,
                                action: /SalesOrder_Confirm/,
                                label: "Confirm",
                            },
                        ],
                    },
                },
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        
        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                fnDone();

                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");

                var expectedFooterRes = cardTestData.expectedResult.Footer;

                // basic list XML structure tests
                assert.ok(CardUtils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
                var actions = CardUtils.getActionsCount(cardXml);
                assert.ok(actions > 0, "Basic XML check - see that there are action nodes");
                assert.ok(actions == 2, "Basic XML check - validate buttons length");

                // specific XML property binding value test
                assert.ok(CardUtils.validateActionFooterXmlValues(cardXml, expectedFooterRes), "Action Footer XML Values");
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Footer Action Test - validate no actions", function (assert) {
        var cardTestData = {
                card: {
                    id: "card_28",
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
                    annoUri: CardUtils.testBaseUrl + "data/annotations_one_action_in_identification.xml",
                },
                expectedResult: {},
            };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        
        CardUtils.createCardView(cardTestData, oModel)
            .then(function (oView) {
                fnDone();

                var cardXml = oView._xContent;
                assert.ok(cardXml !== undefined, "Existence check to XML parsing");
                // basic list XML structure tests
                assert.ok(!CardUtils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is no Footer node");
                assert.ok(CardUtils.validateActionFooterXmlValues(cardXml), "Action Footer XML Values");
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("Card Footer Actions test", function (assert) {
        var doIntentBasedNavigationStub = sinon.stub(oController, "doNavigation");
        var doActionStub = sinon.stub(oController, "doAction");
        var oBindingContext = { id: "bindingContext" };
        function CustomData(key, value) {
            return {
                getKey: function () {
                    return key;
                },
                getValue: function () {
                    return value;
                },
            };
        }
        var oCustomData = {
            type: "DataFieldForIntentBasedNavigation",
            label: "label1",
            action: "action1",
            semanticObject: "semanticObject1",
        };
        var aCustomData = [
            new CustomData("type", oCustomData.type),
            new CustomData("label", oCustomData.label),
            new CustomData("action", oCustomData.action),
            new CustomData("semanticObject", oCustomData.semanticObject),
        ];
        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return oBindingContext;
                    },
                    getCustomData: function () {
                        return aCustomData;
                    },
                };
            },
        };
        oController.onActionPress(oEvent);
        assert.equal(doIntentBasedNavigationStub.callCount, 1, "doNavigation.callCount");
        assert.equal(doActionStub.callCount, 0, "doAction.callCount");
        assert.deepEqual(
            doIntentBasedNavigationStub.args[0][0],
            oBindingContext,
            "doIntentBasedNavigation first arg is the binding context"
        );
        assert.deepEqual(
            doIntentBasedNavigationStub.args[0][1],
            oCustomData,
            "doIntentBasedNavigation first arg is the custom data"
        );

        oCustomData = {
            type: "DataFieldForAction",
            label: "label2",
            action: "action2",
        };
        var aCustomData = [
            new CustomData("type", oCustomData.type),
            new CustomData("label", oCustomData.label),
            new CustomData("action", oCustomData.action),
        ];
        oController.onActionPress(oEvent);
        assert.equal(doIntentBasedNavigationStub.callCount, 1, "doNavigation.callCount");
        assert.equal(doActionStub.callCount, 1, "doAction.callCount");
        assert.deepEqual(
            doActionStub.args[0][0],
            oBindingContext,
            "doIntentBasedNavigation first arg is the binding context"
        );
        assert.deepEqual(doActionStub.args[0][1], oCustomData, "doIntentBasedNavigation first arg is the custom data");
    });

    QUnit.test("check doIntentBaseNavigation oContext and oIntent are null ", function (assert) {
        var cardTestData = {
            card: {
                id: "card_29",
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
                annoUri: CardUtils.testBaseUrl + "data/annotations_one_action_in_identification.xml",
            },
            expectedResult: {},
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                var oController = oView.getController();
                fnDone();
                try {
                    oController.doNavigation(null, null);
                } catch (err) {
                    assert.ok(false, "expected not to throw");
                }
                assert.ok(true);
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("check doIntentBaseNavigation with oIntent and null oContext", function (assert) {
        var cardTestData = {
            card: {
                id: "card_30",
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
                annoUri: CardUtils.testBaseUrl + "data/annotations_one_action_in_identification.xml",
            },
            expectedResult: {},
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                var oController = oView.getController();
                oController.enableClick = true;
                oController.oMainComponent = {};
                oController.doIntentBasedNavigation = sinon.spy();

                oController.doNavigation(null, {
                    type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                    semanticObject: "sem",
                    action: "action",
                });
                setTimeout(function () {
                    fnDone();
                    var oToExternalArgs = oController.doIntentBasedNavigation.args[0];
                    assert.ok(oToExternalArgs[0] === null, "params argument should be null");
                    assert.deepEqual(oToExternalArgs[1], {
                        type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                        semanticObject: "sem",
                        action: "action",
                    });
                }, 100);
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("check drop down in the card - Present", function (assert) {
        var cardTestData = {
            card: {
                id: "card_31",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "ContactSet",
                    tabs: [{}],
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations_one_action_in_identification.xml",
            },
            expectedResult: true,
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                fnDone();
                try {
                    assert.ok(CardUtils.validateDropDown(oView._xContent, cardTestData.expectedResult));
                } catch (err) {
                    assert.ok(false, "expected not to throw");
                }
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });

    QUnit.test("check drop down in the card - Absent", function (assert) {
        var cardTestData = {
            card: {
                id: "card_32",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "ContactSet",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations_one_action_in_identification.xml",
            },
            expectedResult: false,
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        CardUtils
            .createCardView(cardTestData, oModel)
            .then(function (oView) {
                fnDone();
                try {
                    assert.ok(CardUtils.validateDropDown(oView._xContent, cardTestData.expectedResult));
                } catch (err) {
                    assert.ok(false, "expected not to throw");
                }
            })
            .catch(function (oError) {
                console.log(oError);
            });
    });
});
