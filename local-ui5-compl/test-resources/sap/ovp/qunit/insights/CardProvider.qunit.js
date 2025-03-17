sap.ui.define([
    "sap/ovp/insights/CardProvider",
    "sap/ui/model/json/JSONModel",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/insights/IntegrationCard"
], function(
    CardProvider,
    JSONModel,
    CommonUtils,
    IntegrationCard
) {
    "use strict";

    var enableAppToCommonUtils = function() {
        var app = {
            getOwnerComponent: function() {
                return {
                    getOvpConfig: function() {
                        return {
                            "cards": {
                                "card001": {
                                    "settings": {
                                        "title": "Reorder Soon",
                                        "subTitle": "Less than 10 in stock"
                                    }
                                },
                                "card002": {
                                    "settings": {
                                        "title": "Contract Monitoring",
                                        "subTitle": "Total contract volume"
                                    }
                                },
                                "card003": {
                                    "settings": {
                                        "title": "Recent Contacts",
                                        "subTitle": "Per supplier and compared to last year"
                                    }
                                },
                                "card004": {
                                    "settings": {
                                        "title": "Custom Orders",
                                        "subTitle": "In the last six months"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            getView: function() {
                return {
                    byId: function() {
                        return {
                            getComponentInstance: function() {
                                return {
                                    getRootControl: function() {
                                        return {
                                            getController: function() {
                                                return {
                                                    entitySet: "",
                                                    entityType: "",
                                                    oCardComponentData: "",
                                                    oCardComponent: "",
                                                    getView: function() {
                                                        return {getControllerName: function() {}}
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    getCardItemBindingInfo: function() {},
                                    vizFrame: {}
                                }
                            }
                        }
                    }
                }
            }
        };

        CommonUtils.enable(app);
    }

    var addInsightCardsToCardProvider = function() {
        var oOvpCardPropertiesModel1 = new JSONModel({
            "bInsightRTEnabled": true, 
            "enableAddToInsights": true,
            "cardId": "card001"
        });
        var oOvpCardPropertiesModel2 = new JSONModel({
            "bInsightRTEnabled": true, 
            "enableAddToInsights": true,
            "cardId": "card002"
        });
        var oOvpCardPropertiesModel3 = new JSONModel({
            "bInsightRTEnabled": false, 
            "enableAddToInsights": true,
            "cardId": "card003"
        });
        CardProvider.addInsightCard(oOvpCardPropertiesModel1, "procurement");
        CardProvider.addInsightCard(oOvpCardPropertiesModel2, "procurement");
        CardProvider.addInsightCard(oOvpCardPropertiesModel3, "procurement");
    };

    QUnit.module("sap.ovp.insight.CardProvider", {
        before: function() {
            enableAppToCommonUtils();
        }
    });

    QUnit.test("CardProvider - Unregister, onCardRequested and getCardDetails the card provider.", function (assert) {
        
            sinon.stub(IntegrationCard, "createManifestFor").callsFake(function () {
                return Promise.resolve({});
            });
            sinon.stub(IntegrationCard, "UpdateManifestDeltaChanges").callsFake(function () {
                return Promise.resolve({});
            });
            CardProvider.consumers = {"sap-collabration-manager": true};
            CardProvider.channel = {
                publishCard: function() {}
            };
            CardProvider.onCardRequested("sap-collabration-manager", "card001");
            assert.ok(true, "The function onCardRequested is called successfully");
    });

    QUnit.test("CardProvider - onConsumerConnected and onConsumerDisconnected.", function (assert) {
        CardProvider.consumers = {};
        assert.deepEqual(CardProvider.consumers, {}, "There are no consumers at card provider initialization");
        CardProvider.consumers = {"sap-collabration-manager": true};
        CardProvider.onConsumerConnected("sap-collabration-manager");
        assert.deepEqual(CardProvider.consumers, {"sap-collabration-manager": true}, "There consumer is connnected sussessfully");
        CardProvider.onConsumerDisconnected("sap-collabration-manager");
        assert.deepEqual(CardProvider.consumers, {}, "There consumer is disconnnected sussessfully");
    });

    QUnit.test("CardProvider - function addInsightCard, init, shareAvaialableCards, onViewUpdated, unregister card provider Card Provider is getting initialized correctly", function (assert) {
        
        var aSharedCards = [
            {
                "description": "Less than 10 in stock",
                "title": "Reorder Soon",
                "id": "card001",
                "parentAppId": "procurement"
            },
            {
                "description": "Total contract volume",
                "title": "Contract Monitoring",
                "id": "card002",
                "parentAppId": "procurement"
            }
        ];
        var aSharedCards1 = [
            {
                "description": "Less than 10 in stock",
                "title": "Reorder Soon",
                "id": "card001",
                "parentAppId": "procurement"
            },
            {
                "description": "Total contract volume",
                "title": "Contract Monitoring",
                "id": "card002",
                "parentAppId": "procurement"
            },
            {
                "description": "In the last six months",
                "title": "Custom Orders",
                "id": "card004",
                "parentAppId": "procurement"
            }
        ];

        CardProvider.resetInsightCards();
        addInsightCardsToCardProvider();
        CardProvider.sharedCards = [];

        assert.ok(CardProvider.sharedCards.length === 0, "The Card lenght is 0 before calling shareAvailableCards");
        assert.deepEqual(CardProvider.sharedCards, [], "The sharedCards is empty before calling shareAvailableCards");

        CardProvider.channel = {
            publishAvailableCards: function() {}
        };
        CardProvider.shareAvailableCards();

        CardProvider.consumers = {"sap-collabration-manager": {}};
        CardProvider.shareAvailableCards();

        assert.ok(CardProvider.sharedCards.length === 2, "The Cards has been added to the card provider");
        assert.deepEqual(CardProvider.sharedCards, aSharedCards, "The Cards are added correctly to the card provider");



        CardProvider.sharedCards = [];
        CardProvider.resetInsightCards();
        addInsightCardsToCardProvider();
        assert.deepEqual(CardProvider.sharedCards, [], "The Cards are still referring to old shared card array");
        CardProvider.shareAvailableCards();
        assert.deepEqual(CardProvider.sharedCards, aSharedCards, "The view has been updated with the latest added card");

        CardProvider.sharedCards = [];
        CardProvider.resetInsightCards();
        addInsightCardsToCardProvider();

        var oOvpCardPropertiesModel4 = new JSONModel({
            "bInsightRTEnabled": true, 
            "enableAddToInsights": true,
            "cardId": "card004"
        });
        CardProvider.addInsightCard(oOvpCardPropertiesModel4, "procurement");

        assert.deepEqual(CardProvider.sharedCards, [], "The Cards are added correctly to the card provider");

        CardProvider.registered = true;
        CardProvider.onViewUpdate("procurement.ovp.app.component");
        assert.deepEqual(CardProvider.sharedCards, [], "The view has not been updated as it is called for provider procurement.ovp.app.component");
        CardProvider.shareAvailableCards();
        assert.deepEqual(CardProvider.sharedCards, aSharedCards1, "The view has been updated as function shareAvailableCards is called for this provider");
    });

    QUnit.test("CardProvider - Unregister, onCardRequested and getCardDetails the card provider.", function (assert) {
        CardProvider.registered = true;
        CardProvider.sharedCards = [{}];
        CardProvider.consumers = {"sap-collabration-manager": true};
        assert.ok(CardProvider.registered, "The Card provider is registered");
        CardProvider.unregisterProvider("procurement.ovp.app.component1");
        assert.deepEqual(CardProvider.sharedCards, [{}], "No change in shared cards");
        assert.deepEqual(CardProvider.consumers, {"sap-collabration-manager": true}, "The consumer is still there as unregisterProvider was called for different card provider");
        assert.ok(CardProvider.registered, "The Card provider is registered as it is not provider procurement.ovp.app.component1");
    });

});
