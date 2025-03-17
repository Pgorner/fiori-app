// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

function onAppLoaded () {
    "use strict";

    document.addEventListener("click", (event) => {
        if (event.target.id === "btnBrokerConnect") {
            connectToMessageBroker();
        } else if (event.target.id === "btnBrokerDisconnect") {
            disconnectFromMessageBroker();
        } else if (event.target.id === "btnSubscribe") {
            SubscribeChannels();
        } else if (event.target.id === "btnUnsubscribe") {
            UnsubscribeChannels();
        } else if (event.target.id === "btnSendMessage") {
            publishMessage();
        } else if (event.target.id === "btnSendResponse") {
            sendResponse();
        } else if (event.target.id === "btnClearLog") {
            setValue("txtLog", "");
        }
    });
}

function getValue (id) {
    "use strict";
    return document.getElementById(id).value;
}

function setValue (id, val) {
    "use strict";
    document.getElementById(id).value = val;
}

/**
 * connect to msg broker channel
 */
function connectToMessageBroker () {
    "use strict";
    document.getElementById("txtStatusId").innerHTML = "";
    addToLog("'MessageBroker::connect' called");
    getBrokerService().then(function (oService) {
        oService.connect(getValue("txtClientId")).then(function () {
            addToLog("'MessageBroker::connect' response: success");
            document.getElementById("txtStatusId").innerHTML = "Connected";
        }, function (sError) {
            addToLog("'MessageBroker::connect' called, response: failed, error: " + sError);
            document.getElementById("txtStatusId").innerHTML = "Not Connected";
        });
    });
}

/**
 * disconnect from msg broker channel
 */
function disconnectFromMessageBroker () {
    "use strict";
    addToLog("'MessageBroker::disconnect' called");
    getBrokerService().then(function (oService) {
        oService.disconnect(getValue("txtClientId"));
        addToLog("'MessageBroker::disconnect' response: success");
        document.getElementById("txtStatusId").innerHTML = "Not Connected";
    }, function (sError) {
        addToLog("'MessageBroker::disconnect' called, response: failed, error: " + sError);
    });
}

function SubscribeChannels () {
    "use strict";

    var oMessageData,
        channelIds = getValue("txtChannels").split(","),
        subscribedChannels = [];

    channelIds.forEach(function (sChannelId) {
        subscribedChannels.push({
            channelId: sChannelId,
            version: "1.0"
        });
    });

    getBrokerService().then(function (oService) {
        oMessageData = {
            clientId: getValue("txtClientId"),
            subscribedChannels: subscribedChannels
        };
        addToLog("'MessageBroker::subscribe' called: ", JSON.stringify(oMessageData));
        oService.subscribe(
            getValue("txtClientId"),
            subscribedChannels,
            ServiceMessageCallback,
            ServiceClientConnectionCallback).then(function () {
            addToLog("'MessageBroker::subscribe' response: success");
        }, function (sError) {
            addToLog("'MessageBroker::subscribe' called, response: failed, error: " + sError);
        });
    });
}

function UnsubscribeChannels () {
    "use strict";

    var oMessageData,
        channelIds = getValue("txtChannels").split(","),
        subscribedChannels = [];

    channelIds.forEach(function (sChannelId) {
        subscribedChannels.push({
            channelId: sChannelId,
            version: "1.0"
        });
    });

    getBrokerService().then(function (oService) {
        oMessageData = {
            clientId: getValue("txtClientId"),
            subscribedChannels: subscribedChannels
        };
        addToLog("'MessageBroker::unsubscribe' called: ", JSON.stringify(oMessageData));
        oService.unsubscribe(
            getValue("txtClientId"),
            subscribedChannels).then(function () {
            addToLog("'MessageBroker::unsubscribe' response: success");
        }, function (sError) {
            addToLog("'MessageBroker::unsubscribe' called, response: failed, error: " + sError);
        });
    });
}

/**
 * transfer msg
 */
function publishMessage () {
    "use strict";

    doPublishMessage(
        getValue("txtClientId"),
        getValue("txtChannelId"),
        getValue("txtMessageId") || Date.now().toString(),
        getValue("txtTargetClientId"),
        getValue("txtMessageName"),
        getValue("txtMessage"));
}

function sendResponse () {
    "use strict";

    doPublishMessage(
        getValue("txtClientId"),
        getValue("txtFromChannelId"),
        getValue("txtFromMessageId"),
        getValue("txtFromClientId"),
        getValue("txtFromMessageName"),
        getValue("txtResponse"));
}

function doPublishMessage (sClientId, sChannelId, sMessageId, sTargetClients, sMessageName, sMessageData) {
    "use strict";

    var oMessage,
        oMessageData = JSON.parse(sMessageData);

    getBrokerService().then(function (oService) {
        oService.publish(
            sChannelId,
            sClientId,
            sMessageId,
            sMessageName,
            sTargetClients.split(","),
            oMessageData
        );

        oMessage = {
            channelId: sChannelId,
            clientId: sClientId,
            messageId: sMessageId,
            messageName: sMessageName,
            targetClientIds: sTargetClients.split(","),
            data: oMessageData
        };

        addToLog("'MessageBroker::publish' called:", JSON.stringify(oMessage));
    });
}

function getBrokerService () {
    "use strict";
    const oContainer = sap.ui.require("sap/ushell/Container");
    return oContainer ? oContainer.getServiceAsync("MessageBroker") : undefined;
}
/**
 * Handle the events
 */
/**
 * present msg in log list
 */
function addToLog (sMessage, sData) {
    "use strict";

    if (sData === undefined) {
        setValue("txtLog", getValue("txtLog") + sMessage + "\r\r");
    } else {
        sData = sData
            .replace("\"body\":", "\n\"body\":")
            .replace("\"appIntent\":", "\n\"appIntent\":")
            .replace("\"technicalAppComponentId\":", "\n\"technicalAppComponentId\":");

        setValue("txtLog", getValue("txtLog") + sMessage + " " + sData + "\r\r");
    }
}

function showRequest (oMessageData) {
    "use strict";

    setValue("txtFromMessageId", oMessageData.request_id || Date.now().toString());
    setValue("txtFromClientId", oMessageData.body.clientId);
    setValue("txtFromChannelId", oMessageData.body.channelId);
    setValue("txtFromMessageName", oMessageData.body.messageName);
    setValue("txtFromMessage", JSON.stringify(oMessageData.body.data));
}

function ServiceMessageCallback (sClientId, sChannelId, sMessageName, data) {
    "use strict";

    var oMessageData = {
        clientId: sClientId,
        channelId: sChannelId,
        messageName: sMessageName,
        data: data
    };

    showRequest({ body: oMessageData });

    addToLog("Received message:", JSON.stringify(oMessageData));
}

function ServiceClientConnectionCallback (sMessageName, sClientId, aSubscribedChannels) {
    "use strict";

    var oMessageData = {
        messageName: sMessageName,
        clientId: sClientId,
        subscribedChannels: aSubscribedChannels
    };

    addToLog("Received event:", JSON.stringify(oMessageData));
}

onAppLoaded();
