// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.MessageBroker
 */
sap.ui.define([
    "sap/ushell/services/MessageBroker",
    "sap/ushell/services/MessageBroker/MessageBrokerEngine",
    "sap/ushell/services/AppConfiguration",
    "sap/base/Log",
    "sap/ushell/Container"
], function (
    MessageBroker,
    MessageBrokerEngine,
    AppConfiguration,
    Log,
    Container
) {

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
                data: {},
                messageCallback: sandbox.stub().returns(Promise.resolve({message: "client-2 context"})),
                clientConnectionCallback: sandbox.stub().returns(Promise.resolve()),
                iframe: {},
                origin: "",
                isUI5: true
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
                messageName: "inform",
                targetClientsIds: [
                    "*"
                ],
                data: {
                    message: "give me context"
                }
            }
        };

    QUnit.module("Testing API with UI5 Clients", {

        beforeEach: function () {
            return Container.init("local").then(function () {
                return Container.getServiceAsync("MessageBroker").then(function (oMessageBroker) {
                    this.oMessageBroker = oMessageBroker;
                    this.oLogErrorStub = sandbox.stub(Log, "error");
                    this.oLogWarningStub = sandbox.stub(Log, "warning");
                    this.oEmitEventStub = sandbox.stub(MessageBrokerEngine, "_emitEvent");
                    MessageBrokerEngine.setEnabled(true);
                }.bind(this));
            }.bind(this));
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("publish throws an error when client is not connected", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        this.oMessageBroker.publish(
            oPublishParams.client1.channelId,
            oPublishParams.client1.clientId,
            oPublishParams.client1.messageId,
            oPublishParams.client1.messageName,
            oPublishParams.client1.targetClientsIds,
            oPublishParams.client1.data
        ).then(function (oResponse) {
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

    QUnit.test("connect throws an error when parameter 'sClientId' is not provided", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        this.oMessageBroker.connect("")
            .then(function (oResponse) {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            var oStoredClients = MessageBrokerEngine.getSubscribedClients();
            // Assert
            assert.strictEqual(sError, "Missing required parameter client id", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "No connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("subscribe throws an error when client is not connected", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.subscribe(
            oClient.clientId,
            oClient.subscribedChannels,
            oClient.messageCallback,
            oClient.clientConnectionCallback
        ).then(function (oResponse) {
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

    QUnit.test("unsubscribe throws an error when client is not connected", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.unsubscribe(
            oClient.clientId,
            [oClient.subscribedChannels[0]]
        ).then(function (oResponse) {
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

    QUnit.test("connects first UI5 client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.connect(oClient.clientId)
            .then(function () {
            // Assert
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            done();
        }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("connect throws an error on attempt to connect twice", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.connect(oClient.clientId)
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

    QUnit.test("subscribe throws an error when parameter 'sClientId' is not provided", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.subscribe(
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
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "No connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("subscribe throws an error when parameter 'aSubscribedChannels' is empty", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.subscribe(
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
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "No connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("subscribe throws an error when parameter 'fnMessageCallback' is not a function", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.subscribe(
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
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "No connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("subscribe throws an error when parameter 'fnClientConnectionCallback' is not a function", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.subscribe(
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
            assert.strictEqual(Object.keys(oStoredClients).length, 0, "No connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("subscribes first UI5 client", function (assert) {

            // Arrange
            var done = assert.async(),
                oClient = oClients.client1;

            // Act
            this.oMessageBroker.subscribe(
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
                assert.strictEqual(aChannelClients.length, 1, "Only one client connected");
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

    QUnit.test("connects second UI5 client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client2;

        // Act
        this.oMessageBroker.connect(oClient.clientId)
            .then(function () {
                // Assert
                assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
                done();
            }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("publish throws an error when client is not subscribed", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        this.oMessageBroker.publish(
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

    QUnit.test("subscribes second UI5 client and notifies first client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client2;

        // Act
        this.oMessageBroker.subscribe(
            oClient.clientId,
            oClient.subscribedChannels,
            oClient.messageCallback,
            oClient.clientConnectionCallback
        ).then(function () {

            var sChannelId = oClient.subscribedChannels[0].channelId,
                oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                aChannelClients = oStoredClients[sChannelId] || [];

            // Assert
            assert.ok(this.oEmitEventStub.calledWith(
                "clientSubscribed",
                oClient.clientId,
                oClient.subscribedChannels
                ), "Notify was called with the expected arguments");

            assert.strictEqual(aChannelClients.length, 2, "Number of connected clients is correct");
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

    QUnit.test("unsubscribe throws an error when parameter 'sClientId' is not provided", function (assert) {

        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.unsubscribe(
            "",
            [oClient.subscribedChannels[0]]
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

    QUnit.test("unsubscribe throws an error when parameter 'aUnsubscribedChannels' is not provided", function (assert) {

        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.unsubscribe(
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

    QUnit.test("unsubscribes first UI5 client and notifies second client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient1 = oClients.client1,
            oClient2 = oClients.client2;

        // Act
        this.oMessageBroker.unsubscribe(
            oClient1.clientId,
            [oClient1.subscribedChannels[0]]
        ).then(function () {
                var sChannelId = oClient2.subscribedChannels[0].channelId,
                    oStoredClients = MessageBrokerEngine.getSubscribedClients(),
                    aChannelClients = oStoredClients[sChannelId] || [];

                // Assert
                assert.ok(this.oEmitEventStub.calledWith(
                    "clientUnsubscribed",
                    oClient1.clientId,
                    [oClient1.subscribedChannels[0]]
                ), "Notify was called with the expected arguments");

                assert.strictEqual(aChannelClients.length, 1, "Number of remaining clients is correct");
                assert.strictEqual(aChannelClients[0].clientId, oClient2.clientId, "Remaining client is the expected client");
                done();
            }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("subscribes first UI5 client again and notifies second client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client1;

        // Act
        this.oMessageBroker.subscribe(
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
            assert.strictEqual(aChannelClients.length, 2, "2 clients connected altogether");
            assert.ok(this.oEmitEventStub.calledWith(
                "clientSubscribed",
                oClient.clientId,
                oClient.subscribedChannels
            ), "Notify was called with the expected arguments");
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

    QUnit.test("publish throws an error when channelId is not recognized", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        this.oMessageBroker.publish(
            "new-channel",
            oPublishParams.client1.clientId,
            oPublishParams.client1.messageId,
            oPublishParams.client1.messageName,
            oPublishParams.client1.targetClientsIds,
            oPublishParams.client1.data
        ).then(function (oResponse) {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "Unknown channel Id: new-channel", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            done();
        }.bind(this));
    });

    QUnit.test("publish throws an error when target client id is not found", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        this.oMessageBroker.publish(
            oPublishParams.client1.channelId,
            oPublishParams.client1.clientId,
            oPublishParams.client1.messageId,
            oPublishParams.client1.messageName,
            ["not-a-client"],
            oPublishParams.client1.data
        ).then(function (oResponse) {
            assert.notOk(true, "The promise should have been rejected");
            done();
        }).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "Target client(s) not found in the provided channel", "Correct error thrown");
            assert.strictEqual(this.oLogErrorStub.called, true, "Log.error was called");
            assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
            done();
        }.bind(this));
    });

    QUnit.test("publishes message from first UI5 client to the second to obtain client's context", function (assert) {

        var done = assert.async();

        this.oMessageBroker.publish(
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

    QUnit.test("connects third UI5 client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client3;

        // Act
        this.oMessageBroker.connect(oClient.clientId)
            .then(function () {
                // Assert
                assert.strictEqual(this.oEmitEventStub.called, false, "Notify was not called");
                done();
            }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("subscribes third UI5 client and notifies all clients", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client3;

        // Act
        this.oMessageBroker.subscribe(
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
            assert.strictEqual(aChannelClients.length, 3, "3 clients connected altogether");

            assert.ok(this.oEmitEventStub.calledWith(
                "clientSubscribed",
                oClient.clientId,
                oClient.subscribedChannels
            ), "Notify was called with the expected arguments");
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

    QUnit.test("publishes message from first UI5 client to all clients in the channel", function (assert) {

        var done = assert.async();

        this.oMessageBroker.publish(
            oPublishParams.client3.channelId,
            oPublishParams.client3.clientId,
            oPublishParams.client3.requestId,
            oPublishParams.client3.messageName,
            oPublishParams.client3.targetClientsIds,
            oPublishParams.client3.data
        ).then(function () {
            assert.strictEqual(this.oLogErrorStub.called, false, "Log.error was not called");
            assert.ok(oClients.client2.messageCallback.calledWith(
                oPublishParams.client3.clientId,
                oPublishParams.client3.channelId,
                oPublishParams.client3.messageName,
                oPublishParams.client3.data
            ), "Client 2 received context request from client 3");
            assert.ok(oClients.client1.messageCallback.calledWith(
                oPublishParams.client3.clientId,
                oPublishParams.client3.channelId,
                oPublishParams.client3.messageName,
                oPublishParams.client3.data
            ), "Client 1 received context request from client 3");
            done();
        }.bind(this))
        .catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("addAcceptedOrigin throws an error when origin is empty", function (assert) {

        assert.strictEqual(this.oMessageBroker.getAcceptedOrigins().length, 1, "1 accepted origin exists");

        this.oMessageBroker.addAcceptedOrigin("");
        assert.strictEqual(this.oLogWarningStub.called, true, "Log.warning was called");

        assert.strictEqual(this.oMessageBroker.getAcceptedOrigins().length, 1, "no new origin accepted");
    });

    QUnit.test("addAcceptedOrigin adds new origin", function (assert) {

        var sOrigin = "http://localhost:8081";

        assert.strictEqual(this.oMessageBroker.getAcceptedOrigins().length, 1, "1 accepted origin exists");

        this.oMessageBroker.addAcceptedOrigin(sOrigin);
        assert.strictEqual(this.oLogWarningStub.called, false, "Log.warning was not called");

        assert.strictEqual(this.oMessageBroker.getAcceptedOrigins()[1], sOrigin, "origin added successfully");
    });

    QUnit.test("removeAcceptedOrigin removes origin", function (assert) {

        var sOrigin = "http://localhost:8081";

        this.oMessageBroker.addAcceptedOrigin(sOrigin);
        assert.strictEqual(this.oMessageBroker.getAcceptedOrigins()[1], sOrigin, "origin accepted");
        this.oMessageBroker.removeAcceptedOrigin(sOrigin);
        assert.strictEqual(this.oMessageBroker.getAcceptedOrigins().length, 1, "origin removed successfully");
    });

    QUnit.test("disconnect throws an error when parameter 'sClientId' is not provided", function (assert) {

        // Arrange
        var done = assert.async();

        // Act
        this.oMessageBroker.disconnect("")
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
            assert.strictEqual(Object.keys(aChannelClients).length, 3, "3 connected clients");
            done();
        }.bind(this));
    });

    QUnit.test("disconnects third UI5 client", function (assert) {

        // Arrange
        var done = assert.async(),
            oClient = oClients.client3;

        // Act

        assert.strictEqual(MessageBrokerEngine.getSubscribedClients()["channel-1"].length, 3, "3 clients connected");
        this.oMessageBroker.disconnect(oClient.clientId)
            .then(function () {

                // Assert
                assert.strictEqual(this.oEmitEventStub.called, true, "Notify was called");
                assert.strictEqual(MessageBrokerEngine.getSubscribedClients()["channel-1"].length, 2, "client disconnected successfully");
                done();
            }.bind(this)).catch(function (sError) {
            assert.notOk(true, "The promise should have been resolved");
            done();
        });
    });

    QUnit.test("Testing disabled message broker", function (assert) {
        var done = assert.async();
        sandbox.stub(this.oMessageBroker, "isEnabled").returns(false);
        MessageBrokerEngine.setEnabled(false);
        this.oMessageBroker.connect("testClient1234")
            .then(function () {
                assert.ok(false, "The promise should have been rejected");
                done();
            }).catch(function (sError) {
                assert.ok(true);
                done();
            });
    });
});
