/*global QUnit*/

sap.ui.define(["sap/ovp/cards/PersonalizationUtils",
    "sap/ovp/cards/CommonUtils",
    "sap/ui/model/json/JSONModel"
], function (PersonalizationUtils, CommonUtils, JSONModel) {
    "use strict";
    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ovp.cards.PersonalizationUtils", {
        beforeEach: function () { },
        afterEach: function () { },
    });

    QUnit.test("mergeChanges function - ", function (assert) {
        var aCards = [{
            id: "i2d.ps.projfincontroller.ovps1_card00",
            visibility: true,
            dashboardLayout: {
                C4: {
                    row: 1,
                    col: 1,
                    rowSpan: 12,
                    colSpan: 1,
                    maxColSpan: 1,
                    noOfItems: 5,
                    autoSpan: true,
                    showOnlyHeader: false
                }
            }
        }, {
            id: "i2d_ps_projfincontroller_ovps1_card05",
            visibility: true,
            dashboardLayout: {
                C4: {
                    row: 13,
                    col: 2,
                    rowSpan: 12,
                    colSpan: 1,
                    maxColSpan: 1,
                    noOfItems: 5,
                    autoSpan: true,
                    showOnlyHeader: false
                }
            }
        }];
        var deltachanges = [{
            getChangeType: function () {
                return "dragOrResize";
            },
            getContent: function () {
                return {
                    cardId: "i2d_ps_projfincontroller_ovps1_card05",
                    dashboardLayout: {
                        C4: {
                            row: 9,
                            oldRow: 32,
                            column: 3,
                            oldColumn: 5,
                            rowSpan: 12,
                            oldRowSpan: 10,
                            colSpan: 5,
                            maxColSpan: 2,
                            oldColSpan: 5,
                            noOfItems: 8,
                            autoSpan: false,
                            showOnlyHeader: true
                        }
                    }
                };
            },
            getLayer: function () {
                return "USER";
            }
        }];
        var expectedResults = {
            row: 9,
            col: 3,
            rowSpan: 12,
            colSpan: 5,
            maxColSpan: 2,
            noOfItems: 8,
            autoSpan: false,
            showOnlyHeader: true,
        };
        var actualResults = PersonalizationUtils.mergeChanges(aCards, deltachanges);
        assert.ok(JSON.stringify(actualResults[1].dashboardLayout["C4"]) == JSON.stringify(expectedResults));
    });

    QUnit.test("mergeChanges function - View switch changes", function (assert) {
        var aCards = [{
            id: "i2d.ps.projfincontroller.ovps1_card00",
            oldKey: 2,
            selectedKey: 3,
        }, {
            id: "i2d_ps_projfincontroller_ovps1_card05",
            oldKey: 3,
            selectedKey: 1,
        }];
        var deltachanges = [{
            getChangeType: function () {
                return "viewSwitch";
            },
            getContent: function () {
                return {
                    cardId: "i2d_ps_projfincontroller_ovps1_card05",
                    selectedKey: 5,
                };
            },
            getLayer: function () {
                return "USER";
            }
        }];
        var actualResults = PersonalizationUtils.mergeChanges(aCards, deltachanges);
        assert.ok(JSON.stringify(actualResults[1].selectedKey) == "5");
    });

    QUnit.test("addMissingmanifest function - two cards of Different Id", function (assert) {
        var oManifestcards = [{
            id: "card002",
            visibility: true,
        }];
        var oDeltaCards = [{
            id: "card005",
            visibility: true
        }];
        var expectedResults = [
            { id: "card005", visibility: true },
            { id: "card002", visibility: true }
        ];
        var actualResults = PersonalizationUtils.addMissingCardsFromManifest(oManifestcards, oDeltaCards);
        assert.ok(JSON.stringify(expectedResults) == JSON.stringify(actualResults));
    });

    QUnit.test("addMissingmanifest function - two cards of same Id", function (assert) {
        var oManifestcards = [{
            id: "card002",
            visibility: true,
        }];
        var oDeltaCards = [{
            id: "card002",
            visibility: true
        }];
        var expectedResults = [{ id: "card002", visibility: true }];
        var actualResults = PersonalizationUtils.addMissingCardsFromManifest(oManifestcards, oDeltaCards);
        assert.ok(JSON.stringify(actualResults) == JSON.stringify(expectedResults));
    });

    QUnit.test("mergeChanges function - Position changes, Cards should not be swapped", function (assert) {
        var aCards = [{
            id: "i2d.ps.projfincontroller.ovps1_card00",
            visibility: true,
        }, {
            id: "i2d_ps_projfincontroller_ovps1_card05",
            visibility: true,
        }];
        var deltachanges = [{
            getChangeType: function () {
                return "position";
            },
            getContent: function () {
                return {
                    cardId: "i2d_ps_projfincontroller_ovps1_card05",
                    index: 2,
                };
            },
            getLayer: function () {
                return "USER";
            }
        }];
        var actualResults = PersonalizationUtils.mergeChanges(aCards, deltachanges);
        assert.ok(actualResults[1].visibility === true);
    });

    QUnit.test("savePersonalization function for Fixed Layout - Position changes should be created with correct position", function (assert) {
        var aChanges = [
            {
                "changeType": "position",
                "content": {
                    "cardId": "card_OrdersForPlanning",
                    "position": 3
                },
                "isUserDependent": true
            },
            {
                "changeType": "position",
                "content": {
                    "cardId": "card_MaterialMissingDelivery",
                    "position": 2
                },
                "isUserDependent": true
            },
            {
                "changeType": "position",
                "content": {
                    "cardId": "card_NotificationsForScreening",
                    "position": 1
                },
                "isUserDependent": true
            },
            {
                "changeType": "position",
                "content": {
                    "cardId": "card_OverdueOrders",
                    "position": 2
                },
                "isUserDependent": true
            }
        ];

        var oMainComponent = {
            getView: sandbox.stub().returns({
                byId: sinon.stub().returns(this.oCard)
            }),
            getLayout: sinon.stub().returns({
                invalidate: this.fnLayoutRerenderSpy
            }),
            deltaChanges: [
                {
                    getChangeType: sinon.stub().returns("position"),
                    getContent: sinon.stub().returns({
                        cardId: "card_OrdersForCompletion",
                        position: 3
                    }),
                    getLayer: sinon.stub().returns("USER")
                },
                {
                    getChangeType: sinon.stub().returns("position"),
                    getContent: sinon.stub().returns({
                        cardId: "card_MaterialMissingDelivery",
                        position: 1
                    }),
                    getLayer: sinon.stub().returns("USER")
                }
            ],
            getUIModel: sinon.stub().returns(new JSONModel({
                bRTAActive: false,
                aOrderedCards: [
                    {
                        "id": "card_OrdersForCompletion",
                        "visibility": true
                    },
                    {
                        "id": "card_NotificationsForScreening",
                        "visibility": true
                    },
                    {
                        "id": "card_MaterialMissingDelivery",
                        "visibility": true
                    },
                    {
                        "id": "card_OrdersForPlanning",
                        "visibility": true
                    },
                    {
                        "id": "card_OverdueOrders",
                        "visibility": true
                    }
                ]
            })),
            bWarningDisplayedOnUnhidingCards: false,
            getOwnerComponent: function () {
                return {
                    oOvpConfig: {
                        bInsightDTEnabled: false
                    }
                }
            }
        };
        var oMainComponentStub = sandbox.stub(CommonUtils, "getApp").returns(oMainComponent);
        var oView = {
            byId: function () { }
        };
        PersonalizationUtils.savePersonalization(aChanges, oView);

        assert.ok(aChanges.length === 5);
        assert.deepEqual(aChanges,
            [
                {
                  "changeType": "position",
                  "content": {
                    "cardId": "card_OrdersForPlanning",
                    "position": 3
                  },
                  "isUserDependent": true,
                  "jsOnly": true
                },
                {
                  "changeType": "position",
                  "content": {
                    "cardId": "card_MaterialMissingDelivery",
                    "position": 2
                  },
                  "isUserDependent": true,
                  "jsOnly": true
                },
                {
                  "changeType": "position",
                  "content": {
                    "cardId": "card_NotificationsForScreening",
                    "position": 1
                  },
                  "isUserDependent": true,
                  "jsOnly": true
                },
                {
                  "changeType": "position",
                  "content": {
                    "cardId": "card_OverdueOrders",
                    "position": 4
                  },
                  "isUserDependent": true,
                  "jsOnly": true
                },
                {
                  "changeType": "position",
                  "content": {
                    "cardId": "card_OrdersForCompletion",
                    "position": 0
                  },
                  "isUserDependent": true,
                  "jsOnly": true
                }
        ]);
        var aCards = [
            {
                "id": "card_MaterialMissingDelivery",
                "visibility": true
            },
            {
                "id": "card_NotificationsForScreening",
                "visibility": true
            },
            {
                "id": "card_OrdersForCompletion",
                "visibility": true
            },
            {
                "id": "card_OrdersForPlanning",
                "visibility": true
            },
            {
                "id": "card_OverdueOrders",
                "visibility": true
            }
        ];

        aChanges.forEach(function (oChange) {
            oChange.getLayer = sinon.stub().returns("USER");
            oChange.getChangeType = sinon.stub().returns("position");
            oChange.getContent = sinon.stub().returns({
                cardId: oChange.content.cardId,
                position: oChange.content.position
            });
        });

        var actualResults = PersonalizationUtils.mergeChanges(aCards, aChanges);
        assert.deepEqual(actualResults, oMainComponent.getUIModel().getProperty("/aOrderedCards"));
        oMainComponentStub.restore();
    });

});
