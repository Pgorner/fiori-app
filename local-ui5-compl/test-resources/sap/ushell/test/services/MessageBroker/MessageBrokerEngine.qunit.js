// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.MessageBrokerEngine
 */
sap.ui.define([
    "sap/ushell/services/MessageBroker/MessageBrokerEngine",
    "sap/base/Log",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ushell/Container"
], function (MessageBrokerEngine, Log, PostMessageUtils, Container) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox(),
        oClients = {
            client1: {
                clientId: "client-1",
                subscribedChannels: [{ channelId: "channel-1", version: "1.0" }],
                data: {},
                messageCallback: sandbox.stub().returns(Promise.resolve({ message: "client-1 context" })),
                clientConnectionCallback: sandbox.stub().returns(Promise.resolve()),
                iframe: {},
                origin: "",
                isUI5: true
            },
            client2: {
                clientId: "client-2",
                subscribedChannels: [{ channelId: "channel-1", version: "1.0" }],
                data: {},
                messageCallback: sandbox.stub().returns(Promise.resolve({ message: "client-2 context" })),
                clientConnectionCallback: sandbox.stub().returns(Promise.resolve()),
                iframe: {},
                origin: "",
                isUI5: true
            },
            client3: {
                clientId: "client-3",
                subscribedChannels: [{ channelId: "channel-1", version: "1.0" }],
                messageCallback: null,
                clientConnectionCallback: null,
                data: {},
                iframe: {},
                origin: "http://localhost:8080",
                isUI5: false
            }
        },
        oPostMessage = {
            oMessageData: {
                request_id: "12345",
                body: {
                    channelId: "sap.ushell.MessageBroker",
                    clientId: oClients.client3.clientId,
                    messageName: "connect",
                    subscribedChannels: oClients.client3.subscribedChannels,
                    data: {}
                }
            },
            oMessage: {
                origin: oClients.client3.origin,
                source: oClients.client3.iframe
            }
        },
        oPublishParams = {
            client1: {
                channelId: "channel-1",
                clientId: oClients.client1.clientId,
                messageId: Date.now().toString(),
                messageName: "get-context",
                targetClientsIds: [
                    oClients.client2.clientId
                ],
                data: {
                    message: "give me context"
                }
            },
            client2: {
                channelId: "channel-1",
                clientId: oClients.client2.clientId,
                messageId: Date.now().toString(),
                messageName: "get-context",
                targetClientsIds: [
                    oClients.client1.clientId
                ],
                data: {
                    message: "give me context"
                }
            },
            client3: {
                channelId: "channel-1",
                clientId: oClients.client3.clientId,
                requestId: Date.now().toString(),
                messageName: "get-context",
                targetClientsIds: [
                    oClients.client2.clientId
                ],
                data: {
                    message: "give me context"
                }
            }
        };

    QUnit.module("Testing Message Broker Engine functions", {

        beforeEach: function () {
            return Container.init("local").then(function () {
                this.oLogErrorStub = sandbox.stub(Log, "error");
                this.oLogWarningStub = sandbox.stub(Log, "warning");
                this.oEmitEventStub = sandbox.stub(MessageBrokerEngine, "_emitEvent");
                MessageBrokerEngine.setEnabled(true);
            }.bind(this));
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Testing 'processPostMessage' function with expected arguments", function (assert) {

        var done = assert.async(),
            oBody = oPostMessage.oMessageData.body,
            oMessage = oPostMessage.oMessage,
            oSendPostMessageToClientStub = sandbox.stub(MessageBrokerEngine, "_handlePostMessageRequest").returns(Promise.resolve());

        MessageBrokerEngine.processPostMessage(oPostMessage)
            .then(function (oReponse) {
                assert.strictEqual(this.oLogErrorStub.called, false, "Log.error was not called");
                assert.ok(oSendPostMessageToClientStub.calledWith(
                    oBody,
                    oMessage.source,
                    oMessage.origin
                ), "handlePostMessageRequest was called with correct parameters");
                done();
            }.bind(this))
            .catch(function (sError) {
                assert.notOk(true, "The promise should have been resolved");
                done();
            });
    });

    QUnit.test("Testing 'processPostMessage' function with missing iframe object argument", function (assert) {

        var done = assert.async(),
            oHandleRequestStub = sandbox.stub(MessageBrokerEngine, "_handlePostMessageRequest").returns(Promise.resolve());

        oPostMessage.oMessage.source = null;

        MessageBrokerEngine.processPostMessage(oPostMessage)
            .then(function (oReponse) {
                assert.notOk(true, "The promise should have been rejected");
                done();
            })
            .catch(function (sError) {
                assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
                assert.strictEqual(oHandleRequestStub.called, false, "_handlePostMessageRequest function was not called");
                oPostMessage.oMessage.source = {};
                done();
            }.bind(this));
    });

    QUnit.test("Testing 'connect' function with missing parameter 'sClientId'", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        MessageBrokerEngine.connect("")
            .then(function () {
                assert.notOk(true, "The promise should have been rejected");
                done();
            }).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "Missing required parameter client id", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'subscribe' function with client not connected", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.subscribe(
            oClient.clientId,
            oClient.subscribedChannels,
            oClient.messageCallback,
            oClient.clientConnectionCallback
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            var oStoredClients = MessageBrokerEngine.getSubscribedClients();
            // Assert
            assert.strictEqual(sError, "Client is not connected", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "No connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'unsubscribe' function with client not connected", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.unsubscribe(
            oClient.clientId,
            [oClient.subscribedChannels[0]]
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            var oStoredClients = MessageBrokerEngine.getSubscribedClients();
            // Assert
            assert.strictEqual(sError, "Client is not connected", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "No connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'publish' function with client not connected", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oPublishParams.client1;

        // Act
        MessageBrokerEngine.publish(
            oClient.channelId,
            oClient.clientId,
            oClient.messageId,
            oClient.messageName,
            oClient.targetClientsIds,
            oClient.data
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "Client is not connected", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'connect' with first UI5 client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.connect(oClient.clientId)
            .then(function () {
                // Assert
                assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
                done();
            }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing 'connect' with attempt to connect twice", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.connect(oClient.clientId)
            .then(function () {
                assert.notOk(true, "The promise should have been rejected");
                done();
            }).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "Client is already connected", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'subscribe' function with missing 'sClientId' argument", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.subscribe(
            "",
            oClient.subscribedChannels,
            oClient.messageCallback,
            oClient.clientConnectionCallback
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            var oStoredClients = MessageBrokerEngine.getSubscribedClients();
            // Assert
            assert.strictEqual(sError, "Missing required parameter(s)", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "no connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'subscribe' function with 'aSubscribedChannels' empty", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.subscribe(
            oClient.clientId,
            [],
            oClient.messageCallback,
            oClient.clientConnectionCallback
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            var oStoredClients = MessageBrokerEngine.getSubscribedClients();
            // Assert
            assert.strictEqual(sError, "Missing required parameter(s)", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "no connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'subscribe' function with 'fnMessageCallback' not a function", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.subscribe(
            oClient.clientId,
            oClient.subscribedChannels,
            {},
            oClient.clientConnectionCallback
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            var oStoredClients = MessageBrokerEngine.getSubscribedClients();
            // Assert
            assert.strictEqual(sError, "Missing required parameter(s)", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "no connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'subscribe' function with 'fnClientConnectionCallback' not a function", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.subscribe(
            oClient.clientId,
            oClient.subscribedChannels,
            oClient.messageCallback,
            {}
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            var oStoredClients = MessageBrokerEngine.getSubscribedClients();
            // Assert
            assert.strictEqual(sError, "Missing required parameter(s)", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "no connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'subscribe' function with first client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.subscribe(
            oClient.clientId,
            oClient.subscribedChannels,
            oClient.messageCallback,
            oClient.clientConnectionCallback
        ).then(function () {

            var sChannelId = oClient.subscribedChannels[0].channelId,
                oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                aChannelClients = oStoredClients[sChannelId] || [];

            // Assert

            assert.strictEqual(Object.keys(oStoredClients).length, 1, "Only one channel exists");
            assert.strictEqual(aChannelClients.length, 1, "total 1 client connected");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(aChannelClients[0].clientId, oClient.clientId, "Client Id saved successfully");
            assert.deepEqual(aChannelClients[0].subscribedChannels, oClient.subscribedChannels, "Client channels saved successfully");
            assert.deepEqual(aChannelClients[0].messageCallback, oClient.messageCallback, "Client message callback saved successfully");
            assert.deepEqual(aChannelClients[0].clientConnectionCallback, oClient.clientConnectionCallback, "Client connection callback saved successfully");
            done();
        }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing 'connect' with second UI5 client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client2;

        // Act
        MessageBrokerEngine.connect(oClient.clientId)
            .then(function () {
                // Assert
                assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
                done();
            }.bind(this)).catch(function (sError) {
                assert.notOk(true, "The promise should have been resolved");
                done();
        });
    });

    QUnit.test("Testing 'publish' function with client not subscribed", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        MessageBrokerEngine.publish(
            oPublishParams.client2.channelId,
            oPublishParams.client2.clientId,
            oPublishParams.client2.messageId,
            oPublishParams.client2.messageName,
            oPublishParams.client2.targetClientsIds,
            oPublishParams.client2.data
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "Client is not subscribed to the provided channel", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'subscribe' function with second client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client2;

        // Act
        MessageBrokerEngine.subscribe(
            oClient.clientId,
            oClient.subscribedChannels,
            oClient.messageCallback,
            oClient.clientConnectionCallback
        ).then(function () {

            var sChannelId = oClient.subscribedChannels[0].channelId,
                oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                aChannelClients = oStoredClients[sChannelId] || [];

            // Assert
            assert.strictEqual(Object.keys(oStoredClients).length, 1, "Only one channel exists");
            assert.strictEqual(aChannelClients.length, 2, "2 clients connected");
            assert.strictEqual(this.oEmitEventStub.called, true, "Notify was called");
            assert.strictEqual(aChannelClients[1].clientId, oClient.clientId, "Client Id saved successfully");
            assert.deepEqual(aChannelClients[1].subscribedChannels, oClient.subscribedChannels, "Client channels saved successfully");
            assert.deepEqual(aChannelClients[1].messageCallback, oClient.messageCallback, "Client message callback saved successfully");
            assert.deepEqual(aChannelClients[1].clientConnectionCallback, oClient.clientConnectionCallback, "Client connection callback saved successfully");

            setTimeout(function () {
                assert.ok(oClient.clientConnectionCallback.calledWith(
                    "clientSubscribed",
                    oClients.client1.clientId,
                    oClients.client1.subscribedChannels
                ), "Callback was called with the expected arguments");
                done();
            }, 1000);
        }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing 'publish' function with unknown channel id", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        MessageBrokerEngine.publish(
            "new-channel",
            oPublishParams.client1.clientId,
            oPublishParams.client1.messageId,
            oPublishParams.client1.messageName,
            oPublishParams.client1.targetClientsIds,
            oPublishParams.client1.data
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "Unknown channel Id: new-channel", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'publish' function with unknown target client id", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        MessageBrokerEngine.publish(
            oPublishParams.client1.channelId,
            oPublishParams.client1.clientId,
            oPublishParams.client1.messageId,
            oPublishParams.client1.messageName,
            ["not-a-client"],
            oPublishParams.client1.data
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "Target client(s) not found in the provided channel", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'publish' function with single target client", function (assert) {

        var done = assert.async();

        MessageBrokerEngine.publish(
            oPublishParams.client1.channelId,
            oPublishParams.client1.clientId,
            oPublishParams.client1.messageId,
            oPublishParams.client1.messageName,
            oPublishParams.client1.targetClientsIds,
            oPublishParams.client1.data
        ).then(function () {
            assert.strictEqual(this.oLogErrorStub.called, false, "Log.error was not called");
            assert.ok(oClients.client2.messageCallback.calledWith(
                oPublishParams.client1.clientId,
                oPublishParams.client1.channelId,
                oPublishParams.client1.messageName,
                oPublishParams.client1.data
            ), "Client 2 received context request from client 1");
            done();
        }.bind(this))
        .catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing 'addAcceptedOrigin'", function (assert) {

        assert.strictEqual(MessageBrokerEngine.getAcceptedOrigins().length, 1, "initiated with 1 accepted origins");
        MessageBrokerEngine.addAcceptedOrigin("");
        assert.strictEqual(this.oLogWarningStub.called, true, "Log.warning was called");
        assert.strictEqual(MessageBrokerEngine.getAcceptedOrigins().length, 1, "no new origin added");

        this.oLogWarningStub.reset();
        let sOrigin = "http://localhost:8081";
        MessageBrokerEngine.addAcceptedOrigin(sOrigin);
        assert.strictEqual(this.oLogWarningStub.called, false, "Log.warning was not called");
        assert.strictEqual(MessageBrokerEngine.getAcceptedOrigins().length, 2, "2 accepted origin");
        assert.strictEqual(MessageBrokerEngine.getAcceptedOrigins()[1], sOrigin, "origin added successfully");

        this.oLogWarningStub.reset();
        sOrigin = "https://test.com:443";
        MessageBrokerEngine.addAcceptedOrigin(sOrigin);
        assert.strictEqual(this.oLogWarningStub.called, false, "Log.warning was not called");
        assert.strictEqual(MessageBrokerEngine.getAcceptedOrigins().length, 4, "2 accepted origin");
        assert.strictEqual(MessageBrokerEngine.getAcceptedOrigins()[2], sOrigin, "origin added successfully");
        assert.strictEqual(MessageBrokerEngine.getAcceptedOrigins()[3], "https://test.com", "origin added successfully");

        this.oLogWarningStub.reset();
        sOrigin = "http://localhost:8081";
        MessageBrokerEngine.removeAcceptedOrigin(sOrigin);
        assert.strictEqual(MessageBrokerEngine.getAcceptedOrigins().length, 3, "origin removed successfully");
    });

    QUnit.test("Testing 'getSubscribedClients' function", function (assert) {

        var oExpectedObject = {},
            sChannelId = oPublishParams.client1.channelId,
            oConnectedClients = MessageBrokerEngine.getSubscribedClients();

        delete oClients.client1.data;
        delete oClients.client2.data;

        oExpectedObject[sChannelId] = [
            oClients.client1,
            oClients.client2
        ];

        assert.deepEqual(oConnectedClients, oExpectedObject, "the number of connected clients is correct");

        oClients.client1.data = {};
        oClients.client2.data = {};
    });

    QUnit.test("Testing '_emitEvent' function for UI5 client", function (assert) {

        var oClient = oClients.client1,
            aParams = [
                "clientSubscribed",
                oClient.clientId,
                oClient.subscribedChannels
            ];

        this.oEmitEventStub.restore();
        MessageBrokerEngine._emitEvent.apply(this, aParams);

        assert.strictEqual(this.oLogErrorStub.called, false, "Log.error was not called");
        assert.ok(oClients.client2.clientConnectionCallback.calledWith(
            "clientSubscribed",
            oClient.clientId,
            oClient.subscribedChannels
        ), "Client 2 was notified");
    });

    QUnit.test("Testing 'unsubscribe' function with missing 'sClientId' argument", function (assert) {

        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.unsubscribe(
            "",
            [oClient.subscribedChannels[0]]
        ).then(function () {
                assert.notOk(true, "The promise should have been rejected");
            }).catch(function (sError) {
            // Assert
            var sChannelId = oClient.subscribedChannels[0].channelId,
                oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                aChannelClients = oStoredClients[sChannelId] || [];

            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(aChannelClients.length, 2, "Number of connected clients is correct");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'unsubscribe' function with missing 'aUnsubscribedChannels'argument", function (assert) {

        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.unsubscribe(
            oClient.clientId,
            []
        ).then(function () {
            assert.notOk(true, "The promise should have been rejected");
        }).catch(function (sError) {
            // Assert
            var sChannelId = oClient.subscribedChannels[0].channelId,
                oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                aChannelClients = oStoredClients[sChannelId] || [];

            assert.strictEqual(sError, "Missing required parameter(s)", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(aChannelClients.length, 2, "Number of connected clients is correct");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'unsubscribe' function with expected arguments", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.unsubscribe(
            oClient.clientId,
            [oClient.subscribedChannels[0]]
        ).then(function () {
                var sChannelId = oClient.subscribedChannels[0].channelId,
                    oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                    aChannelClients = oStoredClients[sChannelId] || [];

                // Assert
                assert.ok(this.oEmitEventStub.calledWith(
                    "clientUnsubscribed",
                    oClient.clientId,
                    [oClient.subscribedChannels[0]]
                ), "Notify was called with the expected arguments");

                assert.strictEqual(aChannelClients.length, 1, "Number of remaining clients is correct");
                done();
            }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing 'connect' with third client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client3;

        // Act
        MessageBrokerEngine.connect(oClient.clientId)
            .then(function () {
                // Assert
                assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
                done();
            }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing 'subscribe' function with third client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client3;

        // Act
        MessageBrokerEngine.subscribe(
            oClient.clientId,
            oClient.subscribedChannels,
            oClient.messageCallback,
            oClient.clientConnectionCallback,
            oClient.iframe,
            oClient.origin
        ).then(function () {

            var sChannelId = oClient.subscribedChannels[0].channelId,
                oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                aChannelClients = oStoredClients[sChannelId] || [];

            // Assert
            assert.strictEqual(Object.keys(oStoredClients).length, 1, "Only one channel exists");
            assert.strictEqual(aChannelClients.length, 2, "total 2 clients connected");
            assert.strictEqual(this.oEmitEventStub.called, true, "Notify was called");
            assert.strictEqual(aChannelClients[1].clientId, oClient.clientId, "Client Id saved successfully");
            assert.deepEqual(aChannelClients[1].subscribedChannels, oClient.subscribedChannels, "Client channels saved successfully");
            assert.deepEqual(aChannelClients[1].messageCallback, oClient.messageCallback, "Client message callback saved successfully");
            assert.deepEqual(aChannelClients[1].clientConnectionCallback, oClient.clientConnectionCallback, "Client connection callback saved successfully");
            done();
        }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing 'subscribe' function with first client again", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        MessageBrokerEngine.subscribe(
            oClient.clientId,
            oClient.subscribedChannels,
            oClient.messageCallback,
            oClient.clientConnectionCallback
        ).then(function () {

            var sChannelId = oClient.subscribedChannels[0].channelId,
                oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                aChannelClients = oStoredClients[sChannelId] || [];

            // Assert
            assert.strictEqual(Object.keys(oStoredClients).length, 1, "Only one channel exists");
            assert.strictEqual(aChannelClients.length, 3, "total 3 clients connected");
            assert.strictEqual(this.oEmitEventStub.called, true, "Notify was called");
            assert.strictEqual(aChannelClients[2].clientId, oClient.clientId, "Client Id saved successfully");
            assert.deepEqual(aChannelClients[2].subscribedChannels, oClient.subscribedChannels, "Client channels saved successfully");
            assert.deepEqual(aChannelClients[2].messageCallback, oClient.messageCallback, "Client message callback saved successfully");
            assert.deepEqual(aChannelClients[2].clientConnectionCallback, oClient.clientConnectionCallback, "Client connection callback saved successfully");
            done();
        }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing 'publish' function with all clients in channel", function (assert) {

        var done = assert.async(),
            oPluginData = oPostMessage.oMessage,
            oRequestParams = {
                clientId: oPublishParams.client1.clientId,
                channelId: oPublishParams.client1.channelId,
                messageName: oPublishParams.client1.messageName,
                data: oPublishParams.client1.data
            },
            oSendPostMessageToClientStub = sandbox.stub(PostMessageUtils, "postMessageToIframeObject");

        MessageBrokerEngine.publish(
            oPublishParams.client1.channelId,
            oPublishParams.client1.clientId,
            oPublishParams.client1.messageId,
            oPublishParams.client1.messageName,
            ["*"],
            oPublishParams.client1.data
        ).then(function () {
            assert.strictEqual(this.oLogErrorStub.called, false, "Log.error was not called");
            assert.ok(oClients.client2.messageCallback.calledWith(
                oPublishParams.client1.clientId,
                oPublishParams.client1.channelId,
                oPublishParams.client1.messageName,
                oPublishParams.client1.data
            ), "Client 2 received context request from client 1");

            var oPostMessageRequest = MessageBrokerEngine._buildPostMessageObject("request", oRequestParams),
                oPmObjectArgument = oSendPostMessageToClientStub.getCall(0).args[0],
                oIframeArgument = oSendPostMessageToClientStub.getCall(0).args[1],
                sOriginArgument = oSendPostMessageToClientStub.getCall(0).args[2];

            // remove dynamic properties
            delete oPostMessageRequest.request_id;
            delete oPmObjectArgument.request_id;

            assert.deepEqual(oPmObjectArgument, oPostMessageRequest, "first argument in triggered SendPostMessage function is correct");
            assert.deepEqual(oIframeArgument, oPluginData.source, "second argument in triggered SendPostMessage function is correct");
            assert.deepEqual(sOriginArgument, oPluginData.origin, "third argument in triggered SendPostMessage function is correct");
            done();
        }.bind(this))
        .catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing '_emitEvent' function for iframe client", function (assert) {

        var oClient = oClients.client1,
            oParams = {
                clientId: oClient.clientId,
                channelId: "sap.ushell.MessageBroker",
                messageName: "clientUnsubscribed",
                channels: [oClient.subscribedChannels[0]]
            },
            oPluginData = oPostMessage.oMessage;

        this.oEmitEventStub.restore();
        var oSendPostMessageToClientStub = sandbox.stub(PostMessageUtils, "postMessageToIframeObject");

        MessageBrokerEngine._emitEvent(
            "clientUnsubscribed",
            oClients.client1.clientId,
            [oClient.subscribedChannels[0]]
        );

        var oSamplePostMessageObject = MessageBrokerEngine._buildPostMessageObject("event", oParams),
            oPmObjectArgument = oSendPostMessageToClientStub.getCall(0).args[0],
            oIframeArgument = oSendPostMessageToClientStub.getCall(0).args[1],
            sOriginArgument = oSendPostMessageToClientStub.getCall(0).args[2];

        // remove dynamic properties
        delete oSamplePostMessageObject.request_id;
        delete oPmObjectArgument.request_id;

        assert.deepEqual(oPmObjectArgument, oSamplePostMessageObject, "first argument in triggered SendPostMessage function is correct");
        assert.deepEqual(oIframeArgument, oPluginData.source, "second argument in triggered SendPostMessage function is  correct");
        assert.deepEqual(sOriginArgument, oPluginData.origin, "third argument in triggered SendPostMessage function is  correct");
    });

    QUnit.test("Testing '_sendMessage' function to UI5 client", function (assert) {

        MessageBrokerEngine._sendMessage(
            [oClients.client2],
            oPublishParams.client1.channelId,
            oPublishParams.client1.messageId,
            oPublishParams.client1.messageName,
            oPublishParams.client1.clientId,
            oPublishParams.client1.data
        );

        assert.strictEqual(this.oLogErrorStub.called, false, "Log.error was not called");
        assert.ok(oClients.client2.messageCallback.calledWith(
            oPublishParams.client1.clientId,
            oPublishParams.client1.channelId,
            oPublishParams.client1.messageName,
            oPublishParams.client1.data
        ), "Client 2 received context request from client 1");
    });

    QUnit.test("Testing '_sendMessage' function to iframe client", function (assert) {

        var oPluginData = oPostMessage.oMessage,
            oParams = {
                clientId: oClients.client1.clientId,
                channelId: oPublishParams.client1.channelId,
                messageName: oPublishParams.client1.messageName,
                data: oPublishParams.client1.data,
                requestId: oPublishParams.client1.messageId
            },
            oSendPostMessageToClientStub = sandbox.stub(PostMessageUtils, "postMessageToIframeObject");

        MessageBrokerEngine._sendMessage(
            [oClients.client3],
            oPublishParams.client1.channelId,
            oPublishParams.client1.messageId,
            oPublishParams.client1.messageName,
            oPublishParams.client1.clientId,
            oPublishParams.client1.data
        );

        assert.strictEqual(this.oLogErrorStub.called, false, "Log.error was not called");

        var oSamplePostMessageObject = MessageBrokerEngine._buildPostMessageObject("request", oParams),
            oPmObjectArgument = oSendPostMessageToClientStub.getCall(0).args[0],
            oIframeArgument = oSendPostMessageToClientStub.getCall(0).args[1],
            sOriginArgument = oSendPostMessageToClientStub.getCall(0).args[2];

        // remove dynamic properties
        delete oSamplePostMessageObject.request_id;
        delete oPmObjectArgument.request_id;

        assert.deepEqual(oPmObjectArgument, oSamplePostMessageObject, "first argument in triggered SendPostMessage function is correct");
        assert.deepEqual(oIframeArgument, oPluginData.source, "second argument in triggered SendPostMessage function is correct");
        assert.deepEqual(sOriginArgument, oPluginData.origin, "third argument in triggered SendPostMessage function is correct");
    });

    QUnit.test("Testing '_handlePostMessageRequest' function", function (assert) {

        var done = assert.async(),
            oPlugin = oPostMessage.oMessageData.body,
            oPluginData = oPostMessage.oMessage,
            oSendPostMessageToClientStub = sandbox.stub(PostMessageUtils, "postMessageToIframeObject");

        oPlugin.messageName = "disconnect";
        var oParams = {
            clientId: oPlugin.clientId,
            channelId: oPlugin.channelId,
            messageName: oPlugin.messageName,
            requestId: oPostMessage.oMessageData.request_id,
            status: "accepted"
        };

        MessageBrokerEngine._handlePostMessageRequest(
            oPlugin,
            oPluginData.source,
            oPluginData.origin
        ).then(function () {
            assert.strictEqual(this.oLogErrorStub.called, false, "Log.error was not called");

            setTimeout(function () {
                var oSamplePostMessageObject = MessageBrokerEngine._buildPostMessageObject("response", oParams),
                    oPmObjectArgument = oSendPostMessageToClientStub.getCall(0).args[0],
                    oIframeArgument = oSendPostMessageToClientStub.getCall(0).args[1],
                    sOriginArgument = oSendPostMessageToClientStub.getCall(0).args[2];

                // remove dynamic properties
                delete oSamplePostMessageObject.request_id;
                delete oPmObjectArgument.request_id;

                oSamplePostMessageObject.body.status = "accepted";
                assert.deepEqual(oPmObjectArgument, oSamplePostMessageObject, "first argument in triggered SendPostMessage function is correct");
                assert.deepEqual(oIframeArgument, oPluginData.source, "second argument in triggered SendPostMessage function is correct");
                assert.deepEqual(sOriginArgument, oPluginData.origin, "third argument in triggered SendPostMessage function is correct");
                done();
            }, 2000);
        }.bind(this))
            .catch(function (sError) {
                assert.notOk(true, "The promise should have been resolved");
                done();
            });
    });

    QUnit.test("Testing '_buildFunctionName' function", function (assert) {

        var sFunctionName = MessageBrokerEngine._buildFunctionName("createPostMessage", "response");
        assert.strictEqual(sFunctionName, "createPostMessageResponse", "function name is correct");
    });

    QUnit.test("Testing '_buildPostMessageObject' function", function (assert) {

        var oClient = oPublishParams.client1,
            sServiceName = "sap.ushell.services.MessageBroker",
            oMessageBody = {
                request: {
                    expect: {
                        type: "request",
                        service: sServiceName,
                        body: {}
                    },
                    params: {
                        clientId: oClient.clientId,
                        channelId: oClient.channelId,
                        messageName: oClient.messageName,
                        data: oClient.data
                    }
                },
                response: {
                    expect: {
                        type: "response",
                        service: sServiceName,
                        status: "success",
                        body: {}
                    },
                    params: {
                        channelId: oClient.channelId,
                        clientId: oClient.clientId,
                        messageName: oClient.messageName
                    }
                },
                event: {
                    expect: {
                        type: "request",
                        service: sServiceName,
                        body: {}
                    },
                    params: {
                        clientId: oClient.channelId,
                        channelId: "sap.ushell.MessageBroker",
                        messageName: "clientSubscribed",
                        channels: oClient.subscribedChannels
                    }
                }
            };

        for (var sKey in oMessageBody) {

            oMessageBody[sKey].expect.body = oMessageBody[sKey].params;
            var oExpectedObject = oMessageBody[sKey].expect,
                oPostMessage = MessageBrokerEngine._buildPostMessageObject(sKey, oMessageBody[sKey].params);

            delete oPostMessage.body.correlationMessageId;
            delete oPostMessage.request_id;

            assert.deepEqual(oPostMessage, oExpectedObject, sKey + " object is correct");
        }
    });

    QUnit.test("Testing 'disconnect' function with missing parameter 'sClientId'", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        MessageBrokerEngine.disconnect("")
            .then(function (oResponse) {
                assert.notOk(true, "The promise should have been rejected");
                done();
            }).catch(function (sError) {
            var oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                aChannelClients = oStoredClients["channel-1"];
            // Assert
            assert.strictEqual(sError, "Missing required parameter client id", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(Object.keys(aChannelClients).length, 2, "2 connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("Testing 'disconnect' function with second client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client2;

        // Act
        assert.strictEqual(MessageBrokerEngine.getSubscribedClients()["channel-1"].length, 2, "2 clients connected");
        MessageBrokerEngine.disconnect(
            oClient.clientId,
            ["channel-1"]
        ).then(function () {

                // Assert
                assert.strictEqual(this.oEmitEventStub.called, true, "Notify was called");
                assert.strictEqual(MessageBrokerEngine.getSubscribedClients()["channel-1"].length, 1, "client disconnected successfully");
                done();
            }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing '_callApi' function", function (assert) {

        var oEndpointParams = {
            subscribe: {
                stub: sandbox.stub(MessageBrokerEngine, "subscribe"),
                params: [
                    oClients.client3.clientId,
                    oClients.client3.subscribedChannels,
                    oClients.client3.data,
                    oClients.client3.messageCallback,
                    oClients.client3.clientConnectionCallback,
                    oClients.client3.iframe,
                    oClients.client3.origin
                ]
            },
            unsubscribe: {
                stub: sandbox.stub(MessageBrokerEngine, "unsubscribe"),
                params: [
                    oClients.client3.clientId,
                    ["channel-1"]
                ]
            },
            publish: {
                stub: sandbox.stub(MessageBrokerEngine, "publish"),
                params: [
                    oPublishParams.client3.channelId,
                    oPublishParams.client3.clientId,
                    oPostMessage.oMessageData.request_id,
                    oPublishParams.client3.messageName,
                    oPublishParams.client3.targetClientIds,
                    oPublishParams.client3.data
                ]
            }
        };

        for (var sEndpoint in oEndpointParams) {

            MessageBrokerEngine._callApi(sEndpoint, oEndpointParams[sEndpoint].params);
            assert.deepEqual(oEndpointParams[sEndpoint].stub.getCall(0).args, oEndpointParams[sEndpoint].params, "Api '" + sEndpoint + "' was called with correct parameters");
        }
    });

    QUnit.test("Testing disabled message broker", function (assert) {
        var done = assert.async();
        MessageBrokerEngine.setEnabled(false);
        MessageBrokerEngine.connect("testClient1234")
            .then(function () {
                assert.ok(false, "The promise should have been rejected");
                done();
            }).catch(function (sError) {
                assert.ok(true);
                done();
            });
    });
});
