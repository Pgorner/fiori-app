// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

var bUseService = false,
    oParentWindow;
function onLoad () {
    "use strict";

    var wrapper = document.getElementById("wrapper"),
        channelId = document.getElementById("txtChannelId"),
        oParams = new URLSearchParams(window.location.search),
        sClient = oParams.get("client"),
        sTarget = oParams.get("target");

    window.addEventListener("message", processMessages);
    oParentWindow = (window.parent.parent.sap.ushell.Container.inAppRuntime() ? window.parent.parent : window.parent);
    setValue("txtClientId", sClient);
    setValue("txtTargetClientId", sTarget);
    bUseService = (sClient === "AppUI5");

    wrapper.addEventListener("click", (event) => {
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

    channelId.addEventListener("keyup", (event) => {

        if (event.target.value === "app.context") {
            setValue("txtMessageName", "get-context");
            setValue("txtMessage", '{"messageType": "request"}');
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

    var oMessageData;

    document.getElementById("txtStatusId").innerHTML = "";
    if (bUseService) {
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
    } else {
        oMessageData = {
            type: "request",
            service: "sap.ushell.services.MessageBroker",
            request_id: getValue("txtMessageId") || Date.now().toString(),
            body: {
                channelId: "sap.ushell.MessageBroker",
                clientId: getValue("txtClientId"),
                messageName: "connect"
            }
        };

        sendMessageToBroker(oMessageData);
    }
}

/**
 * disconnect from msg broker channel
 */
function disconnectFromMessageBroker () {
    "use strict";

    var oMessageData;

    if (bUseService) {
        addToLog("'MessageBroker::disconnect' called");
        getBrokerService().then(function (oService) {
            oService.disconnect(getValue("txtClientId"));
                addToLog("'MessageBroker::disconnect' response: success");
                document.getElementById("txtStatusId").innerHTML = "Not Connected";
            }, function (sError) {
                addToLog("'MessageBroker::disconnect' called, response: failed, error: " + sError);
            });
    } else {
        oMessageData = {
            type: "request",
            service: "sap.ushell.services.MessageBroker",
            request_id: getValue("txtMessageId") || Date.now().toString(),
            body: {
                channelId: "sap.ushell.MessageBroker",
                clientId: getValue("txtClientId"),
                messageName: "disconnect"
            }
        };

        sendMessageToBroker(oMessageData);
    }
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

    if (bUseService) {
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
    } else {
        oMessageData = {
            type: "request",
            service: "sap.ushell.services.MessageBroker",
            request_id: getValue("txtMessageId") || Date.now().toString(),
            body: {
                channelId: "sap.ushell.MessageBroker",
                clientId: getValue("txtClientId"),
                messageName: "subscribe",
                subscribedChannels: subscribedChannels
            }
        };

        sendMessageToBroker(oMessageData);
    }
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

    if (bUseService) {
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
    } else {
        oMessageData = {
            type: "request",
            service: "sap.ushell.services.MessageBroker",
            request_id: getValue("txtMessageId") || Date.now().toString(),
            body: {
                channelId: "sap.ushell.MessageBroker",
                clientId: getValue("txtClientId"),
                messageName: "unsubscribe",
                subscribedChannels: subscribedChannels
            }
        };

        sendMessageToBroker(oMessageData);
    }
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

    if (bUseService) {
        getBrokerService().then(function (oService) {
            oService.publish(
                sChannelId,
                sClientId,
                sMessageId,
                sMessageName,
                sTargetClients.split(","),
                oMessageData
            ).then(function () {
                oMessage = {
                    channelId: sChannelId,
                    clientId: sClientId,
                    messageId: sMessageId,
                    messageName: sMessageName,
                    targetClientIds: sTargetClients.split(","),
                    data: oMessageData
                };

                addToLog("'MessageBroker::publish' called:", JSON.stringify(oMessage));
            }).catch(function (err) {
                addToLog("'MessageBroker::publish' failed:", err);
            });
        });
    } else {
        oMessage = {
            type: "request",
            service: "sap.ushell.services.MessageBroker",
            request_id: sMessageId,
            body: {
                clientId: sClientId,
                channelId: sChannelId,
                targetClientIds: sTargetClients.split(","),
                messageName: sMessageName,
                data: oMessageData
            }
        };

        sendMessageToBroker(oMessage);
    }
}

function sendMessageToBroker (oMessageData) {
    "use strict";

    var sMessage = JSON.stringify(oMessageData);

    oParentWindow.parent.postMessage(sMessage);
    addToLog("Sent:", sMessage);
}

function getBrokerService () {
    "use strict";
    return oParentWindow.parent.parent.sap.ushell.Container.getServiceAsync("MessageBroker");
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

function processMessages (oMessage) {
    "use strict";

    var oMessageData;
    if (typeof oMessage.data === "string" && oMessage.data.indexOf("sap.ushell.services.MessageBroker") > 0) {
        try {
            oMessageData = JSON.parse(oMessage.data);
            if (oMessageData.service === "sap.ushell.services.MessageBroker") {
                addToLog("Received:", oMessage.data);
                if (oMessageData.body.channelId !== "sap.ushell.MessageBroker") {
                    if (oMessageData.type === "request") {
                        showRequest(oMessageData);
                        respondWithAppContext(oMessageData);
                    }
                }
            }
        } catch (e) {
            return;
        }
    }
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

    respondWithAppContext({ body: oMessageData });
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

function respondWithAppContext (oMessage) {
    "use strict";

    var sChannelId = oMessage.body.channelId,
        oMessageData = oMessage.body.data;

    if (sChannelId === "app.context" && oMessageData.messageType
        && oMessageData.messageType === "request") {

        var sMessageId = oMessage.request_id || Date.now().toString(),
            sTargetClientId = oMessage.body.clientId,
            sClientId = getValue("txtClientId"),
            sMessageName = oMessage.body.messageName,
            sMessageData = JSON.stringify({
                theme: "sap_horizon",
                languageTag: "en",
                appIntent: "AppNav-SAP1?sap-ui-app-id-hint=sap.ushell.demo.AppSample",
                appFrameworkId: "UI5",
                appSupportInfo: "CA-FLP-FE-UI",
                technicalAppComponentId: "sap.ushell.demo.AppSample",
                appId: "F6407",
                appVersion: "1.1.0",
                productName: "",
                "sap-fiori-id": "F6407",
                "sap-ach": "CA-FLP-FE-UI"
            });

        doPublishMessage(sClientId, sChannelId, sMessageId, sTargetClientId, sMessageName, sMessageData);
    }
}

window.onload = onLoad;
