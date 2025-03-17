/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
    "sap/base/Log"
], function (Log) {
    "use strict";

    let oLogger = Log.getLogger("sap.suite.ui.commons.windowmessages.CollaborationMessageConsumer");
    let oCollaborationProviderConfig;
    let fnResolve;

    const CLIENT_ID = "sap-suite-ui-commons-collaboration-client-appruntime";
    const CHANNEL_ID = "collaboration-channel";
    var MSG_NAME = "get-provider-config";
    const SUBSCRIBED_CHANNELS = [
        {
            channelId: CHANNEL_ID,
            version: "1.0"
        }
    ];
    const TARGET_CLIENT_IDS = ["sap-suite-ui-commons-collaboration-message-broker"]; //Id of the client from where to receive the provider config

    var fnMessageCallback = function(sClientId, sChannelId, sMessageName, data) {
        oLogger.info("Message Received from CLIENT_ID: " + sClientId + " on CHANNEL_ID: " + sChannelId);

        //verify that the message sent is the one we support
        if (sMessageName === MSG_NAME) {
            oCollaborationProviderConfig = JSON.parse(data);
            fnResolve(oCollaborationProviderConfig);
        } else {
            oLogger.info("Message: '" + sMessageName + "' is not supported");
        }
    };


    return {
        getProviderConfiguration: function () {
            return new Promise(async function(resolve) {
                if (oCollaborationProviderConfig) {
                    resolve(oCollaborationProviderConfig);
                    return;
                }

                fnResolve = resolve;
                // Register & Request for the provider configuration
                const UshellContainer = sap.ui.require("sap/ushell/Container");
                if (!UshellContainer) {
                    oLogger.info("UShell Container instance doesn't exist");
                    oCollaborationProviderConfig = {};
                    resolve(oCollaborationProviderConfig);
                    return;
                }
                try {
                    var oMessageBrokerService = await UshellContainer.getServiceAsync("MessageBroker");
                    try {
                        await oMessageBrokerService.connect(CLIENT_ID);
                    } catch {
                        oCollaborationProviderConfig = {};
                        resolve(oCollaborationProviderConfig);
                    }
                    oLogger.info("Client ID: " + CLIENT_ID + " is connected successfully");
                    await oMessageBrokerService.subscribe(CLIENT_ID, SUBSCRIBED_CHANNELS, fnMessageCallback, Function.prototype);
                    await oMessageBrokerService.publish(CHANNEL_ID, CLIENT_ID, Date.now().toString(), MSG_NAME, TARGET_CLIENT_IDS);
                    try {
                        oMessageBrokerService.disconnect(CLIENT_ID);
                    } catch (error) {
                        resolve(oCollaborationProviderConfig);
                    }
                } catch (error) {
                    oLogger.info("Provider Configuration doesn't exist");
                    oMessageBrokerService.disconnect(CLIENT_ID);
                    oCollaborationProviderConfig = {};
                    resolve(oCollaborationProviderConfig);
                }
            });
        }
    }
});