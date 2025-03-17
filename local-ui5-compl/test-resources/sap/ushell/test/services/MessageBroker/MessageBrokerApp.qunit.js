// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
QUnit.config.testTimeout = 400000;
/* eslint-disable max-len */

/**
 * @fileOverview QUnit tests for sap.ushell.services.MessageBroker
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery"
], function (jQuery) {
    "use strict";

    /* global QUnit */

    var flpIframe;

    QUnit.module("Testing API with embedded Clients", {
       beforeEach: function () {
           var sUrl = sap.ui.require.toUrl("sap/ushell/shells/demo/FioriLaunchpadIsolationBroker.html#Shell-home");
           flpIframe = jQuery("<iframe id=\"flp\" src=\"" + sUrl + "\" width=\"1000px\" height=\"800px\"></iframe>");
           flpIframe.appendTo("body");
       },

       afterEach: function () {
           jQuery(flpIframe).remove();
       }
    });

    function getElementById(oIframe, sElementId) {
        return jQuery("#" + sElementId, oIframe.contents());
    }

    function setElementVal(oIframe, sElementId, sVal) {
        getElementById(oIframe, sElementId).val(sVal);
    }

    function openApp(sHash) {
        flpIframe[0].contentWindow.document.location.hash = "#" + sHash;
    }

    function waitForAppOpen(sApp, sIframeId, sControlToFind, bIsHomepage, fnTest) {
        var hInterval,
            checkAppLoaded = function () {
                var appIframe, nItems;

                if (bIsHomepage === true) {
                    nItems = jQuery("#" + sControlToFind, flpIframe.contents()).length;
                } else {
                    appIframe = jQuery("#application-" + sIframeId, flpIframe.contents());
                    nItems = jQuery("#" + sControlToFind, appIframe.contents()).length;
                }
                if (nItems > 0) {
                    clearInterval(hInterval);
                    setTimeout(fnTest, 2000);
                }
            };

        openApp(sApp);
        hInterval = setInterval(checkAppLoaded, 4000);
    }

    QUnit.test("open app and plugin, connect them to a channel, disconnect plugin", function (assert) {

        var done = assert.async();

        function maskResponseIds(sRes) {
            return sRes
                .replace(/(?:"request_id":)([^&,"]+)/, "\"request_id\":0")
                .replace(/(?:"messageId":)([^&,"]+)/, "\"messageId\":0");
        }

        function connectPlugin() {
            var oPluginContainer = getElementById(flpIframe, "sapUshellFloatingContainerWrapper"),
                oIframe = jQuery("iframe", oPluginContainer);

            //oPluginContainer.removeClass("sapUshellShellHidden");
            setElementVal(oIframe, "txtMessageId", "5678");
            setElementVal(oIframe, "txtClientId", "client2");
            setElementVal(oIframe, "txtClientType", "plugin");
            setElementVal(oIframe, "txtChannels", "a,b,c,d,e");
            getElementById(oIframe, "btnBrokerConnect").click();

            setTimeout(function () {
                assert.strictEqual(getElementById(oIframe,"idLogList").children("li").length, 2);
                assert.strictEqual(getElementById(oIframe,"logline1").text(),
                    '{"type":"request","service":"sap.ushell.services.MessageBroker","request_id":"5678","body":{"channelId":"sap.ushell.MessageBroker","clientId":"client2","messageId":"5678","messageType":"request","messageName":"connect","clientType":"plugin","subscribedChannels":[{"channelId":"a","version":"1.0"},{"channelId":"b","version":"1.0"},{"channelId":"c","version":"1.0"},{"channelId":"d","version":"1.0"},{"channelId":"e","version":"1.0"}],"data":{"dummy":"connect"}}}');
                assert.strictEqual(maskResponseIds(getElementById(oIframe,"logline2").text()),
                    '{"type":"response","service":"sap.ushell.services.MessageBroker","request_id":0,"status":"success","body":{"result":{"channelId":"sap.ushell.MessageBroker","clientId":"client2","messageId":0,"correlationMessageId":"5678","messageType":"response","messageName":"accepted","data":{},"activeClients":[{"clientId":"client1","clientType":"app","subscribedChannels":[{"channelId":"a","version":"1.0"},{"channelId":"b","version":"1.0"},{"channelId":"c","version":"1.0"},{"channelId":"d","version":"1.0"}]}]}}}');

                oIframe = getElementById(flpIframe, "application-Message-Broker");
                assert.strictEqual(getElementById(oIframe,"idLogList").children("li").length, 3);
                assert.strictEqual(maskResponseIds(getElementById(oIframe,"logline3").text()),
                    '{"type":"request","service":"sap.ushell.services.MessageBroker","request_id":0,"body":{"channelId":"sap.ushell.MessageBroker","clientId":"client2","messageId":0,"messageType":"event","messageName":"clientConnected","clientType":"plugin","subscribedChannels":[{"channelId":"a","version":"1.0"},{"channelId":"b","version":"1.0"},{"channelId":"c","version":"1.0"},{"channelId":"d","version":"1.0"},{"channelId":"e","version":"1.0"}],"data":{"dummy":"connect"}}}');
                //disconnectApp();
                done();
            }, 8000);
        }

        function connectApp() {
            var oIframe = getElementById(flpIframe, "application-Message-Broker");

            setElementVal(oIframe, "txtMessageId", "1234");
            setElementVal(oIframe, "txtClientId", "client1");
            setElementVal(oIframe, "txtClientType", "app");
            setElementVal(oIframe, "txtChannels", "a,b,c,d");
            getElementById(oIframe, "btnBrokerConnect").click();

            setTimeout(function () {
                assert.strictEqual(getElementById(oIframe,"idLogList").children("li").length, 2);
                assert.strictEqual(getElementById(oIframe,"logline1").text(),
                    '{"type":"request","service":"sap.ushell.services.MessageBroker","request_id":"1234","body":{"channelId":"sap.ushell.MessageBroker","clientId":"client1","messageId":"1234","messageType":"request","messageName":"connect","clientType":"app","subscribedChannels":[{"channelId":"a","version":"1.0"},{"channelId":"b","version":"1.0"},{"channelId":"c","version":"1.0"},{"channelId":"d","version":"1.0"}],"data":{"dummy":"connect"}}}');
                assert.strictEqual(maskResponseIds(getElementById(oIframe,"logline2").text()),
                    '{"type":"response","service":"sap.ushell.services.MessageBroker","request_id":0,"status":"success","body":{"result":{"channelId":"sap.ushell.MessageBroker","clientId":"client1","messageId":0,"correlationMessageId":"1234","messageType":"response","messageName":"accepted","data":{},"activeClients":[]}}}');
                connectPlugin();
            }, 8000);
        }

        // open FLP in iframe and open embedded app inside FLP
        waitForAppOpen("Shell-Home", undefined, "viewPortContainer", true, function () {
            waitForAppOpen("Message-Broker", "Message-Broker", "btnBrokerConnect", false, connectApp);
        });
    });

    /*
    QUnit.test("open plugin and app, connect them to a channel, disconnect app", function (assert) {

        var done = assert.async();

        function connectClient(sIframeId, sClientId, sChannelId, aActiveClients, callback) {

            // Arrange
            var oLogList,
                appIframe = getElementById(flpIframe, sIframeId),
                oConnectButton = getElementById(appIframe, "btnBrokerConnect"),
                oClientIdInput = getElementById(appIframe,"txtClientId"),
                oChannelIdInput = getElementById(appIframe,"txtChannels");
            oClientsLogs[sClientId] = oLogList = getElementById(appIframe,"idLogList");

            // Act
            oClientIdInput.val(sClientId);
            oChannelIdInput.val(sChannelId);
            oConnectButton.click();

            setTimeout(function () {

                // Assert
                assert.strictEqual(oLogList.children("li").length, 2, "request and response printed for client: " + sClientId);

                if (oLogList.children("li").length >= 2) {

                    var oAppRequest = JSON.parse(oLogList.children("li").eq(0).text()),
                        oAppResponse = JSON.parse(oLogList.children("li").eq(1).text()),
                        oAppResponseBody = oAppResponse.body.result,
                        oAppRequestMessageId = oAppRequest.body.messageId,
                        oAppRequestClientType = oAppRequest.body.clientType,
                        oAppRequestSubChannels = oAppRequest.body.subscribedChannels,
                        oAppRequestClientId = oAppRequest.body.clientId;

                    // assert response
                    assertMessageHeader(assert, oAppResponse, "response");

                    var oAssertParams = {
                        clientId: oAppRequestClientId,
                        correlationMessageId: oAppRequestMessageId,
                        messageType: "response",
                        messageName: "accepted",
                        data: {},
                        activeClients: aActiveClients
                    };

                    assertMessageBody(assert, oAppResponseBody, oAssertParams);

                    // assert event message
                    if (oAppResponseBody.activeClients.length) {
                        oAppResponseBody.activeClients.forEach(function (oActiveClient) {

                            var oClientLogList = oClientsLogs[oActiveClient.clientId];
                            assert.strictEqual(oClientLogList.children("li").length, 3, "event message printed for client: " + oActiveClient.clientId);

                            if (oClientLogList.children("li").length >= 3) {

                                var oEventMessage = JSON.parse(oClientLogList.children("li").eq(2).text()),
                                    oEventMessageBody = oEventMessage.body;

                                // assert
                                assertMessageHeader(assert, oEventMessage, "request");

                                var oAssertParams = {
                                    clientId: oAppRequestClientId,
                                    messageType: "event",
                                    messageName: "clientConnected",
                                    clientType: oAppRequestClientType,
                                    subscribedChannels: oAppRequestSubChannels
                                };

                                assertMessageBody(assert, oEventMessageBody, oAssertParams);
                            }
                        });
                    }

                    callback();
                }

            }, 8000);
        }

        function disconnectClient(sIframeId, sClientId, sChannelId, aActiveClients) {

            // Arrange
            var oLogList,
                appIframe = getElementById(flpIframe, sIframeId),
                oDisconnectButton = getElementById(appIframe, "btnBrokerDisconnect");
            oClientsLogs[sClientId] = oLogList = getElementById(appIframe,"idLogList");

            // Act
            oDisconnectButton.click();

            setTimeout(function () {

                // Assert
                assert.strictEqual(oLogList.children("li").length, 4, "request and response printed for client: " + sClientId);

                if (oLogList.children("li").length >= 4) {

                    var oAppRequest = JSON.parse(oLogList.children("li").eq(2).text()),
                        oAppResponse = JSON.parse(oLogList.children("li").eq(3).text()),
                        oAppResponseBody = oAppResponse.body.result,
                        oAppRequestMessageId = oAppRequest.body.messageId,
                        oAppRequestSubChannels = [{
                            channelId: "channel-1",
                            version: "1.0"
                        }],
                        oAppRequestClientId = oAppRequest.body.clientId;

                    // assert response
                    assertMessageHeader(assert, oAppResponse, "response");

                    var oAssertParams = {
                        clientId: oAppRequestClientId,
                        correlationMessageId: oAppRequestMessageId,
                        messageType: "response",
                        messageName: "accepted",
                        data: {}
                    };

                    assertMessageBody(assert, oAppResponseBody, oAssertParams);

                    // assert event message
                    if (aActiveClients.length) {

                        aActiveClients.forEach(function (oActiveClient) {

                            var oClientLogList = oClientsLogs[oActiveClient.clientId];
                            assert.strictEqual(oClientLogList.children("li").length, 4, "event message printed for client: " + oActiveClient.clientId);

                            if (oClientLogList.children("li").length >= 4) {

                                var oEventMessage = JSON.parse(oClientLogList.children("li").eq(3).text()),
                                    oEventMessageBody = oEventMessage.body;

                                // assert
                                assertMessageHeader(assert, oEventMessage, "request");

                                var oAssertParams = {
                                    clientId: oAppRequestClientId,
                                    messageType: "event",
                                    messageName: "clientDisconnected",
                                    subscribedChannels: oAppRequestSubChannels
                                };

                                assertMessageBody(assert, oEventMessageBody, oAssertParams);
                            }
                        });
                    }

                    done();
                }

            }, 8000);
        }

        function openIframeApp() {

            waitForAppOpen("Message-Broker", "Message-Broker", "btnBrokerConnect", false, function () {

                var aActiveClients = [{
                        clientId: "plugin",
                        clientType: "plugin",
                        subscribedChannels: [{
                            channelId: "channel-2",
                            version: "1.0"
                        }]
                    }],
                    sIframeId = "application-Message-Broker",
                    disconnectClientCallback = disconnectClient.bind(this, sIframeId, "app", "channel-1", aActiveClients);

                connectClient(sIframeId, "app", "channel-1", aActiveClients, disconnectClientCallback);
            });
        }

        function openPlugin() {

            var oShellContainer = getElementById(flpIframe, "sapUshellFloatingContainerWrapper"),
                oIframe = jQuery("iframe", oShellContainer),
                sIframeId = oIframe.attr("id");

            oShellContainer.removeClass("sapUshellShellHidden");

            connectClient(sIframeId, "plugin", "channel-2", [], openIframeApp);
        }

        // open FLP in iframe and open embedded app inside FLP
        waitForAppOpen("Shell-Home", undefined, "sapUshellDashboardPage", true, openPlugin);
    });
    */
});
