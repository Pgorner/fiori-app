// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.cards.RecentActivitiesExtension
 */

/* global QUnit, sinon */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/ui/cards/RecentActivitiesExtension",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ui/integration/widgets/Card",
    "sap/ushell/Container"
], function (jQuery, RecentActivitiesCard, EventHub, Config, Card, Container) {
    "use strict";

    var DOM_RENDER_LOCATION = "qunit-fixture";
    var sandbox = sinon.createSandbox({});

    var oManifest = {
        "sap.app": {
            id: "RecentCard",
            type: "card"
        },
        "sap.card": {
            extension: "RecentActivitiesExtension",
            data: {
                extension: {
                    method: "getData"
                }
            },
            type: "List",
            header: {
                title: "Recently Used",
                status: { text: "Top 3" },
                actions: [{
                    type: "Navigation",
                    parameters: { openUI: "RecentActivities" }
                }]
            },
            content: {
                maxItems: 4,
                item: {
                    title: { value: "{Name}" },
                    description: { value: "{Description}" },
                    highlight: "{Highlight}",
                    icon: {
                        src: "{Icon}",
                        label: "icon"
                    },
                    actions: [{
                        type: "Navigation",
                        enabled: "{Enabled}",
                        parameters: {
                            title: "{Name}",
                            url: "{Url}",
                            intentSemanticObject: "{Intent/SemanticObject}",
                            intentAction: "{Intent/Action}",
                            intentAppRoute: "{Intent/AppSpecificRoute}",
                            intentParameters: "{Intent/Parameters}"
                        }
                    }]
                }
            }
        }
    };
    QUnit.module("The function getData", {
        beforeEach: function () {
            this.oGetRecentActivityStub = sandbox.stub();
            this.aRecentActivities = [{
                appId: "#Bank-manage",
                appType: "Application",
                timestamp: 1550484010831,
                title: "Application Navigation Sample",
                url: "#Bank-manage?sap-ui-app-id-hint=fin.cash.bankmaster.manage&version=basic"
            }];
            this.aExpectedCardItems = [{
                Name: "Application Navigation Sample",
                Description: "Application",
                Intent: {
                    SemanticObject: "Bank",
                    Action: "manage",
                    Parameters: {
                        a: ["b"]
                    }
                }
            }];
            var oDeferred = new jQuery.Deferred().resolve(this.aRecentActivities).promise();
            sandbox.stub(Container, "getServiceAsync").resolves({
                getRecentActivity: this.oGetRecentActivityStub.returns(oDeferred)
            });
            this.oGetActivitiesAsCardItemsStub = sandbox.stub(RecentActivitiesCard.prototype, "_getActivitiesAsCardItems").returns(this.aExpectedCardItems);
            this.oConfigStub = sandbox.stub(Config, "last").returns(true);
            this.oCardUserRecents = new RecentActivitiesCard();
        },
        afterEach: function () {
            sandbox.restore();
            this.oGetActivitiesAsCardItemsStub.restore();
            this.oCardUserRecents.destroy();
            this.oCardUserRecents = null;
        }
    });

    QUnit.test("Calls getRecentActivity of the UserRecentsService", function (assert) {
        return this.oCardUserRecents.getData().then(function () {
            assert.strictEqual(this.oGetRecentActivityStub.callCount, 1, "The function getData calls the getRecentActivity function of the UserRecentsService once.");
        }.bind(this));
    });

    QUnit.test("Calls _getActivitiesAsCardItems of Card Extension", function (assert) {
        return this.oCardUserRecents.getData().then(function () {
            assert.strictEqual(this.oGetActivitiesAsCardItemsStub.callCount, 1, "The function getData calls the _getActivitiesAsCardItems function of the UserRecentsService once.");
        }.bind(this));
    });

    QUnit.test("Returns a promise containing an array of recent card items", function (assert) {
        return this.oCardUserRecents.getData().then(function (CardUserRecentsResult) {
            assert.deepEqual(CardUserRecentsResult, this.aExpectedCardItems, "The function getData returns a promise with the expected card items.");
        }.bind(this));
    });

    QUnit.module("The function onCardReady", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync").resolves();
            this.refreshSpy = sandbox.spy(Card.prototype, "refreshData");
            this.oCard = new Card("cardInstance", {
                baseUrl: "resources/sap/ushell/ui/cards/",
                manifest: oManifest
            });

            this.oCard.placeAt(DOM_RENDER_LOCATION);
        },
        afterEach: function () {
            Card.prototype.refreshData.restore();
            sandbox.restore();
            this.oCard.destroy();
            document.getElementById(DOM_RENDER_LOCATION).removeChild(document.getElementById("sap-ui-destroyed-cardInstance"));
        }
    });

    QUnit.test("Executes the refreshData function on the newUserRecentsItem and userRecentsCleared event from the EventHub", function (assert) {
        var done = assert.async();
        var done1 = assert.async();
        var eventHubSpy = sandbox.spy(EventHub, "on");

        this.oCard.attachEvent("manifestApplied", function () {

            assert.strictEqual(eventHubSpy.withArgs("newUserRecentsItem").calledOnce, true, "newUserRecentsItem Event was registered during onCardReady.");
            assert.strictEqual(eventHubSpy.withArgs("userRecentsCleared").calledOnce, true, "userRecentsCleared Event was registered during onCardReady.");

            EventHub.once("newUserRecentsItem").do(function () {
                assert.strictEqual(this.refreshSpy.calledAfter(eventHubSpy), true, "RefreshData was called after EventHub event newUserRecentsItem");
                assert.strictEqual(this.refreshSpy.callCount, 1, "The callback calls the refreshData function of the widget card once.");
                done();

                EventHub.once("userRecentsCleared").do(function () {
                    assert.strictEqual(this.refreshSpy.calledAfter(eventHubSpy), true, "RefreshData was called after EventHub event userRecentsCleared");
                    assert.strictEqual(this.refreshSpy.callCount, 2, "The callback calls the refreshData function of the widget card 2nd time.");
                    done1();
                }.bind(this));
                EventHub.emit("userRecentsCleared");
            }.bind(this));
            EventHub.emit("newUserRecentsItem");
        }.bind(this));
    });
});
