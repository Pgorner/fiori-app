sap.ui.define([
    "sap/ovp/insights/helpers/CardAction",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/app/NavigationHelper"
], function(CardActionHelper, utils, mockservers, NavigationHelper) {
    "use strict";

    QUnit.module("sap.ovp.insights.helpers.CardAction", {
        beforeEach: function () {
            mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
            mockservers.loadMockServer(utils.odataBaseUrl_salesShare, utils.odataRootUrl_salesShare);
        },
        afterEach: function () {
            mockservers.close();
        },
    });

    QUnit.test("Integration Card - getActions test the action generated for list card (V2) when both header and line item annotations are enabled", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7_list",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);

        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            var oCardDefinition = {
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {
                var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(oCardActions.header.enabled, "Header Action is enabled for the given card.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given card.");

                assert.ok(oHeaderAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}", "Header Action should have parameter > headerState > value as a parameter, current context should not be passed for header actions.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}", "For content actions current context and lineItemState should be passed to the extension.");

                assert.ok(oSapCard.configuration.parameters.headerState.value === '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "headerState generated for given list card under configuration parameters.");
                assert.ok(oSapCard.configuration.parameters.lineItemState.value === '{"ibnTarget":{"semanticObject":"sales","action":"overview"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "lineItemState generated for given list card under configuration parameters.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            })
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for list card (V2) when both header and line item annotations are enabled and no presentation variant exists", function (assert) {
        var cardTestData = {
            card: {
                id: "card_8_list",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);

        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            var oCardDefinition = {
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {
                var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(oCardActions.header.enabled, "Header Action is enabled for the given card.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given card.");

                assert.ok(oHeaderAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}", "Header Action should have parameter > headerState > value as a parameter, current context should not be passed for header actions.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}", "For content actions current context and lineItemState should be passed to the extension.");

                assert.ok(oSapCard.configuration.parameters.headerState.value === '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "headerState generated for given list card under configuration parameters.");
                assert.ok(oSapCard.configuration.parameters.lineItemState.value === '{"ibnTarget":{"semanticObject":"sales","action":"overview"},"ibnParams":{"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "lineItemState generated for given list card under configuration parameters.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            })
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for list card (V2) when only header annotation is present", function (assert) {
        var cardTestData = {
            card: {
                id: "card_8",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;

            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {

                var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(oCardActions.header.enabled, "Header Action is enabled for the given card.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given card.");

                assert.ok(oHeaderAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}", "Header Action should have parameter > headerState > value as a parameter, current context should not be passed for header actions.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}", "Content Action should have parameter > lineItemState > value as a parameter, current context should not be passed for header actions.");

                var sHeaderConfigParam = '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}';

                assert.ok(oSapCard.configuration.parameters.headerState.value === sHeaderConfigParam, "headerState generated for given list card under configuration parameters.");
                assert.ok(oSapCard.configuration.parameters.lineItemState.value === sHeaderConfigParam, "lineItemState state generated as same of headerState.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for list card (V2) when only line item annotation is enabled", function (assert) {
        var cardTestData = {
            card: {
                id: "card_9",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    listType: "extended",
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;

            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {


                var oContentAction = oCardActions.content.actions[0];

                assert.ok(!oCardActions.header.enabled, "Header Action should not be enabled for List card as there does not exist an identification annotation.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given card.");

                assert.ok(!oCardActions.header.actions.length, "No Parameters should exists for header actions");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}", "For content actions current context and parameters should be passed to the extension.");

                assert.ok(!oSapCard.configuration.parameters.headerState, "Header State should not be generated for list card as identification annotation is not enabled.");
                assert.ok(oSapCard.configuration.parameters.lineItemState.value === '{"ibnTarget":{"semanticObject":"sales","action":"overview"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "lineItemState generated for given list card under configuration parameters.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for Analytical card (V2) when no identification annotation is enabled", function (assert) {
        var cardTestData = {
            card: {
                id: "card_10",
                model: "salesOrder",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#reordersoon",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);

        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;

            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "Analytical",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {


                var aHeaderAction = oCardActions.header.actions;
                var aContentAction = oCardActions.content.actions;

                assert.ok(!oCardActions.header.enabled, "Header Action is not enabled for the given analytical card.");
                assert.ok(!oCardActions.content.enabled, "content Action is not enabled for the given analytical card.");
                assert.ok(!aHeaderAction.length, "There does not exists any header action for analytical card.");
                assert.ok(!aContentAction.length, "There does not exists any content action for analytical card.");
                assert.ok(!oSapCard.configuration.parameters.state, "There Should not be any state generated for Analytical card.");
                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for Analytical card (V2) when identification annotation is enabled", function (assert) {
        var cardTestData = {
            card: {
                id: "card_11",
                model: "salesOrder",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#reordersoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }

                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "Analytical",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {


                var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(oCardActions.header.enabled, "Header Action is enabled for the given analytical card.");
                assert.ok(oCardActions.content.enabled, "content Action is  enabled for the given analytical card.");

                assert.ok(oHeaderAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/state/value})}", "Header Action parameters should call extension function with parameter > state > value as input.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/state/value}, ${})}", "The extension function should have both parameters and current context as parameters.");
                assert.ok(oSapCard.configuration.parameters.state.value === '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "The state value generated properly for Analytical card.");
                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for Analytical card (V2) when header navigation is disabled using noHeaderNav and both identificationAnnotationPath and annotationPath exists", function (assert) {
        var cardTestData = {
            card: {
                id: "card_15",
                model: "salesOrder",
                template: "sap.ovp.cards.charts.analytical",
                settings: {
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#reordersoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    navigation: "noHeaderNav",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "Analytical",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {


                var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(!oCardActions.header.enabled, "Header Action is disabled for the given analytical card as noHeaderNav is true.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given analytical card.");

                assert.ok(!oHeaderAction, "Header Action should not generate for the analytical card as header navigation is disabled.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/state/value}, ${})}", "The extension function should have both parameters and current context as parameters.");
                assert.ok(oSapCard.configuration.parameters.state.value === '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "The state value is generated under configuration parameters for analytical chart.")
                assert.ok(!oSapCard.configuration.parameters.headerState, "headerState should not be generated for analytical card as this is generated for list / table card.");
                assert.ok(!oSapCard.configuration.parameters.lineItemState, "lineItemState should not be generated for given analytical card under configuration parameters as this is generated for list / table card.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for table card (V2) when both header and line item annotations are enabled", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7_table",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);

        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {


                var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(oCardActions.header.enabled, "Header Action is enabled for the given card.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given card.");

                assert.ok(oHeaderAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}", "Header Action should have parameter > headerState > value as a parameter, current context should not be passed for header actions.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}", "For content actions current context and lineItemState should be passed to the extension.");

                assert.ok(oSapCard.configuration.parameters.headerState.value === '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "headerState generated for given list card under configuration parameters.");
                assert.ok(oSapCard.configuration.parameters.lineItemState.value === '{"ibnTarget":{"semanticObject":"sales","action":"overview"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "lineItemState generated for given list card under configuration parameters.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for table card (V2) when only header annotation is enabled", function (assert) {
        var cardTestData = {
            card: {
                id: "card_8_table",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    entitySet: "ProductSet",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;

            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {


                var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(oCardActions.header.enabled, "Header Action is enabled for the given card.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given card.");

                assert.ok(oHeaderAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}", "Header Action should have parameter > headerState > value as a parameter, current context should not be passed for header actions.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}", "Content Action should have parameter > headerState > value as a parameter, current context should not be passed for content actions.");

                assert.ok(oSapCard.configuration.parameters.headerState.value === '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "headerState generated for given table card under configuration parameters.");
                assert.ok(oSapCard.configuration.parameters.lineItemState.value === '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "lineItemState generated for given table card under configuration parameters same as of headerstate.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for table card (V2) when only header annotation is enabled and no static parameters and PV", function (assert) {
        var cardTestData = {
            card: {
                id: "card_8_table1",
                model: "salesOrder",
                template: "sap.ovp.cards.table",
                settings: {
                    entitySet: "ProductSet",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1"
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;

            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {


                var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(oCardActions.header.enabled, "Header Action is enabled for the given card.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given card.");

                assert.ok(oHeaderAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}", "Header Action should have parameter > headerState > value as a parameter, current context should not be passed for header actions.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}", "Content Action should have parameter > headerState > value as a parameter, current context should not be passed for content actions.");

                assert.ok(oSapCard.configuration.parameters.headerState.value === '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{},"sensitiveProps":["Name","Price"]}', "headerState generated for given table card under configuration parameters.");
                assert.ok(oSapCard.configuration.parameters.lineItemState.value === '{"ibnTarget":{"semanticObject":"sales_header","action":"overview_header"},"ibnParams":{},"sensitiveProps":["Name","Price"]}', "lineItemState generated for given table card under configuration parameters same as of headerstate.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for table card (V2) when only line item annotation is enabled", function (assert) {
        var cardTestData = {
            card: {
                id: "card_9_table",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;

            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {


                //var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(!oCardActions.header.enabled, "Header Action is not enabled only lineitem annotation is enabled for given card.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given card.");

                assert.ok(!oCardActions.header.actions.length, "No action generated for given card under headers.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}", "For content actions current context and parameters should be passed to the extension.");

                assert.ok(!oSapCard.configuration.parameters.headerState, "headerState shouuld not be genearated for given card.");
                assert.ok(oSapCard.configuration.parameters.lineItemState.value === '{"ibnTarget":{"semanticObject":"sales","action":"overview"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "lineItemState generated for given table card under configuration parameters.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });

    QUnit.test("Integration Card - getActions test the action generated for table card (V2) when only line item annotation is enabled and no static parameters", function (assert) {
        var cardTestData = {
            card: {
                id: "card_9_table1",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "ProductSet",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#supplier",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController();
            var oCardComponentData = oCardController.oCardComponentData;

            var oCardDefinition = {
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var oSapCard = {
                configuration : {
                    parameters : {}
                }
            };

            var oCardActionsPromise = CardActionHelper.getCardActions(oCardDefinition, oSapCard);
            oCardActionsPromise.then(function (oCardActions) {

                //var oHeaderAction = oCardActions.header.actions[0];
                var oContentAction = oCardActions.content.actions[0];

                assert.ok(!oCardActions.header.enabled, "Header Action is not enabled only lineitem annotation is enabled for given card.");
                assert.ok(oCardActions.content.enabled, "content Action is enabled for the given card.");

                assert.ok(!oCardActions.header.actions.length, "No action generated for given card under headers.");
                assert.ok(oContentAction.parameters === "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}", "For content actions current context and parameters should be passed to the extension.");

                assert.ok(!oSapCard.configuration.parameters.headerState, "headerState shouuld not be genearated for given card.");
                assert.ok(oSapCard.configuration.parameters.lineItemState.value === '{"ibnTarget":{"semanticObject":"sales","action":"overview"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"SupplierName","Descending":true}]},"SupplierName":"Talpa","CustomerName":"TECUM"},"sensitiveProps":["Name","Price"]}', "lineItemState generated for given table card under configuration parameters.");

                fnDone();
            }, function (oError) {
                assert.ok(false, oError);
                fnDone();
            });
        });
    });
});
