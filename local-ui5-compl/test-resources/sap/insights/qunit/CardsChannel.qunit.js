/*global QUnit, sinon */
sap.ui.define([
    'sap/insights/CardsChannel'
], function (CardsChannel) {
    "use strict";

    function TestProvider(sId) {
        this.sId = sId;
        this.onConsumerConnected = function () { };
        this.onConsumerDisconnected = function () { };
        this.onCardRequested = function () { };
    }

    function TestConsumer(sId) {
        this.sId = sId;
        this.onCardsAvailable = function () { };
        this.onCardProvided = function () { };
    }

    var postMessageSpy;
    var oCardsChannel;

    QUnit.module("CardsChannel test cases", {
        before: function () {
            this.postMessageOrg = window.parent.postMessage;
        },
        beforeEach: function () {
            this.oSandbox = sinon.sandbox.create();
            postMessageSpy = sinon.spy(this.postMessageOrg);
            window.parent.postMessage = postMessageSpy;
            oCardsChannel = new CardsChannel();
        },
        afterEach: function (assert) {
            var done = assert.async();
            this.oSandbox.restore();
            window.parent.postMessage = this.postMessageOrg;
            oCardsChannel.destroy().then(function () {
                done();
            });
        }
    });

    QUnit.test("init / isEnabled", function (assert) {
        var done = assert.async();
        assert.notOk(oCardsChannel.isEnabled(), "isEnabled is false");
        oCardsChannel.init().then(function () {
            assert.ok(oCardsChannel.isEnabled(), "isEnabled is true");
            done();
        });
    });

    QUnit.test("registerConsumer", function (assert) {
        var done = assert.async();
        oCardsChannel.init().then(function () {
            var testConsumer = new TestConsumer("#consumer");
            oCardsChannel.registerConsumer(testConsumer.sId, testConsumer).then(function () {
                assert.strictEqual(postMessageSpy.callCount, 4);
                var args = [
                    JSON.parse(postMessageSpy.getCall(0).args[0]),
                    JSON.parse(postMessageSpy.getCall(3).args[0])
                ];
                assert.equal(args[0].body.messageName, "connect");
                assert.equal(args[1].body.messageName, "subscribe");
                done();
            });
        });
    });

    QUnit.test("registerProvider", function (assert) {
        var done = assert.async();
        oCardsChannel.init().then(function () {
            var testProvider = new TestProvider("#provider");
            oCardsChannel.registerProvider(testProvider.sId, testProvider).then(function () {
                assert.strictEqual(postMessageSpy.callCount, 4);
                var args = [
                    JSON.parse(postMessageSpy.getCall(1).args[0]),
                    JSON.parse(postMessageSpy.getCall(3).args[0])
                ];
                assert.equal(args[0].body.clientId, testProvider.sId);
                assert.equal(args[0].body.messageName, "connect");
                assert.equal(args[1].body.clientId, testProvider.sId);
                assert.equal(args[1].body.messageName, "subscribe");
                done();
            });
        });
    });

    QUnit.test("publishCard", function (assert) {
        var done = assert.async();
        oCardsChannel.init().then(function () {
            var testProvider = new TestProvider("#provider");
            var testConsumer = new TestConsumer("#consumer");
            oCardsChannel.registerConsumer(testConsumer.sId, testConsumer).then(function () {
                oCardsChannel.registerProvider(testProvider.sId, testProvider).then(function () {
                    postMessageSpy.reset();
                    var testCard = { hello: "world" };
                    oCardsChannel.publishCard("#provider", testCard, "#consumer").then(function () {
                        assert.ok(postMessageSpy.called);
                        var args = JSON.parse(postMessageSpy.getCall(0).args[0]);
                        assert.equal(args.body.messageName, "cardProvided");
                        assert.propEqual(args.body.data, testCard);
                        done();
                    });
                });
            });
        });
    });

    QUnit.test("publishAvailableCards", function (assert) {
        var done = assert.async();
        oCardsChannel.init().then(function () {
            var testProvider = new TestProvider("#provider");
            oCardsChannel.registerProvider(testProvider.sId, testProvider).then(function () {
                postMessageSpy.reset();
                var testCard = { hello: "world" };
                oCardsChannel.publishAvailableCards("#provider", testCard, "#consumer").then(function () {
                    assert.ok(postMessageSpy.called);
                    var args = JSON.parse(postMessageSpy.getCall(0).args[0]);
                    assert.equal(args.body.messageName, "cardsAvailable");
                    assert.propEqual(args.body.data, testCard);
                    done();
                });
            });
        });
    });

    QUnit.test("requestCard", function (assert) {
        var done = assert.async();
        oCardsChannel.init().then(function () {
            var testConsumer = new TestConsumer("#consumer");

            oCardsChannel.registerConsumer(testConsumer.sId, testConsumer).then(function () {
                postMessageSpy.reset();
                var testCard = { hello: "world" };
                oCardsChannel.requestCard(testConsumer.sId, testCard, "#Provider").then(function () {
                    assert.ok(postMessageSpy.called);
                    var args = JSON.parse(postMessageSpy.getCall(0).args[0]);
                    assert.equal(args.body.messageName, "cardRequested");
                    assert.propEqual(args.body.data, testCard);
                    done();
                });
            });
        });
    });

    QUnit.test("unregister", function (assert) {
        var done = assert.async();
        oCardsChannel.init().then(function () {
            var testProvider = new TestProvider("#provider");
            oCardsChannel.registerProvider(testProvider.sId, testProvider).then(function () {
                postMessageSpy.reset();
                oCardsChannel.unregister("#provider").then(function () {
                    assert.ok(postMessageSpy.called);
                    var args = JSON.parse(postMessageSpy.getCall(0).args[0]);
                    assert.equal(args.body.messageName, "unsubscribe");
                    done();
                });
            });
        });
    });
});