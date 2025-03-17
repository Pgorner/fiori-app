// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.MessageBroker}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (
    AppRuntimeService
) {
    "use strict";

    var oClientData = {};

    /**
     * @alias sap.ushell.appRuntime.ui5.services.MessageBroker
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.MessageBroker}.
     *
     * @hideconstructor
     *
     * @private
     */
    var MessageBrokerProxy = function () {};

    MessageBrokerProxy.prototype.connect = function (sClientId) {
        return new Promise(function (fnResolve, fnReject) {
            AppRuntimeService.postMessageToFLP("sap.ushell.services.MessageBroker", {
                channelId: "sap.ushell.MessageBroker",
                clientId: sClientId,
                messageName: "connect"
            }).then(fnResolve).catch(fnReject);
        });
    };

    MessageBrokerProxy.prototype.disconnect = function (sClientId) {
        return new Promise(function (fnResolve, fnReject) {
            oClientData = {};
            AppRuntimeService.postMessageToFLP("sap.ushell.services.MessageBroker", {
                channelId: "sap.ushell.MessageBroker",
                clientId: sClientId,
                messageName: "disconnect"
            }).then(fnResolve).catch(fnReject);
        });
    };

    MessageBrokerProxy.prototype.subscribe = function (
        sClientId,
        aSubscribedChannels,
        fnMessageCallback,
        fnClientConnectionCallback
    ) {
        return new Promise(function (fnResolve, fnReject) {
            oClientData = {
                fnMessageCallback: fnMessageCallback,
                fnClientConnectionCallback: fnClientConnectionCallback
            };

            AppRuntimeService.postMessageToFLP("sap.ushell.services.MessageBroker", {
                channelId: "sap.ushell.MessageBroker",
                clientId: sClientId,
                messageName: "subscribe",
                subscribedChannels: aSubscribedChannels
            }).then(fnResolve).catch(fnReject);
        });
    };

    MessageBrokerProxy.prototype.unsubscribe = function (sClientId, aUnsubscribedChannels) {
        return new Promise(function (fnResolve, fnReject) {
            oClientData = {};
            AppRuntimeService.postMessageToFLP("sap.ushell.services.MessageBroker", {
                channelId: "sap.ushell.MessageBroker",
                clientId: sClientId,
                messageName: "unsubscribe",
                subscribedChannels: aUnsubscribedChannels
            }).then(fnResolve).catch(fnReject);
        });
    };

    MessageBrokerProxy.prototype.publish = function (
        sChannelId,
        sClientId,
        sMessageId,
        sMessageName,
        aTargetClientIds,
        data
    ) {
        return new Promise(function (fnResolve, fnReject) {
            AppRuntimeService.postMessageToFLP("sap.ushell.services.MessageBroker", {
                clientId: sClientId,
                channelId: sChannelId,
                targetClientIds: aTargetClientIds,
                messageName: sMessageName,
                data: data
            }, sMessageId).then(fnResolve).catch(fnReject);
        });
    };

    MessageBrokerProxy.prototype.addAcceptedOrigin = function (sOrigin) {
        //should be empty in AppRuntime
    };

    MessageBrokerProxy.prototype.removeAcceptedOrigin = function (sOrigin) {
        //should be empty in AppRuntime
    };

    MessageBrokerProxy.prototype.getAcceptedOrigins = function () {
        //should be empty in AppRuntime
    };

    MessageBrokerProxy.prototype.getAcceptedOrigins = function () {
        //should be empty in AppRuntime
    };

    MessageBrokerProxy.prototype.handleMessage = function (oBody) {
        return new Promise(function (fnResolve, fnReject) {
            switch (oBody.messageName) {
                case "clientSubscribed":
                case "clientUnsubscribed":
                    oClientData.fnClientConnectionCallback(oBody.messageName, oBody.clientId, oBody.channels);
                    break;
                default:
                    oClientData.fnMessageCallback(oBody.clientId, oBody.channelId, oBody.messageName, oBody.data);
                    break;

            }
            fnResolve({"_noresponse_": true});
        });
    };

    MessageBrokerProxy.hasNoAdapter = true;
    return MessageBrokerProxy;
}, false);
