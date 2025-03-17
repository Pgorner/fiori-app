// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

var aUI5requestIds = [];

/**
 * Attach listener to HTML app
 */
function onLoad () {
    "use strict";

    addEventListener("click", onButtonClick,false);
    addEventListener("message", processMessages);
}

/**
 * Handle communication of HTML app, nested UI5 app and FLP
 */
function onButtonClick(event) {
    "use strict";

    var srcElement = event.srcElement,
        functions = {
            open: openApp,
            close: closeApp
        };

    if (srcElement.className.match(/htmlAppButton/)) {
        var idParts = srcElement.id.split("_");
        functions[idParts[1]].call(this, idParts[0]);
    }
}

/**
 * Handle communication of HTML app, nested UI5 app and FLP
 */
function processMessages(oMessage) {
    "use strict";

    var oMessageData = JSON.parse(oMessage.data),
        messageSource = oMessage.source,
        FLPshell = window.parent,
        UI5appIframe = document.getElementById("appFrame");

    if (UI5appIframe) {
        UI5appIframe = UI5appIframe.contentWindow;
    }

    if (messageSource === UI5appIframe) {
        // nested UI5 application -> FLP
        switch (oMessageData.type) {
            case "request":
                // filter requests according to the allowed PostMessages list
                // ...
                aUI5requestIds.push(oMessageData.request_id);
                sendPostMessage(FLPshell, oMessageData);
                break;
            case "response":
                sendPostMessage(FLPshell, oMessageData);
                break;
        }
    } else if (messageSource === FLPshell) {
        // FLP -> all applications
        switch (oMessageData.type) {
            case "request":
                // handle general requests from FLP to iframes
                // filter requests according to the allowed PostMessages list
                // ...
                // 1. take action on HTML app side
                // ....
                // 2. pass to UI5
                sendPostMessage(UI5appIframe, oMessageData);
                break;
            case "response":
                // response to UI5
                if (aUI5requestIds.indexOf(oMessageData.request_id) > -1) {
                    sendPostMessage(UI5appIframe, oMessageData);
                } else {
                    // take action on HTML app side
                    // ....
                }
                break;
        }
    }
}

/**
 * Open an application
 *
 * @param {string} appId The id of the application DOM reference
 */
function openApp(appId) {
    "use strict";

    var iframeWrapper = document.getElementById("iframeWrapper"),
        iframe = document.getElementById("appFrame"),
        appIntents = {
            AppNavSample: "Action-toappnavsample",
            AppRuntimeRendererSample: "Renderer-Sample"
        };

    var iframeUrl = window.location.origin + "/ushell/test-resources/sap/ushell/shells/demo/ui5appruntime.html";
    iframeUrl += "?sap-ui-app-id=sap.ushell.demo." + appId;
    iframeUrl += "&sap-startup-params=sap-ushell-defaultedParameterNames%3D%5B%22";
    iframeUrl += "sap-ushell-innerAppRouteDisabled%22%2C%22";
    iframeUrl += "sap-ushell-navmode%22%5D%26sap-ushell-innerAppRouteDisabled";
    iframeUrl += "%3DView1%252F&sap-shell=FLP&sap-touch=1&sap-ui-versionedLibCss=true&sap-plugins=BlueBoxPlugin";
    iframeUrl += "&sap-theme=sap_horizon&sap-locale=en-US&sap-iframe-hint=UI5";
    iframeUrl += "#" + appIntents[appId] + "?sap-ui-app-id-hint=sap.ushell.demo." + appId;

    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "appFrame";
        iframe.src = iframeUrl;
        iframeWrapper.append(iframe);
    }

    var oMessageData = {
            sCacheId: "application-" + appIntents[appId],
            sUrl: iframeUrl,
            sHash: appIntents[appId] + "?sap-ui-app-id-hint=sap.ushell.demo." + appId
        },
        oData = {
            type: "request",
            service: "sap.ushell.services.appLifeCycle.create",
            request_id: "HTML_MSG_" + Date.now(),
            body: oMessageData
        };
    // send create request to appruntime
    sendPostMessage(iframe.contentWindow, oData);

    iframe.addEventListener("load", function () {
        var html = this.contentWindow.document.getElementsByTagName("html")[0];
        html.style.overflow = "hidden";
    });
}

/**
 * Close an application
 *
 * @param {string} appId The id of the application DOM reference
 */
function closeApp(appId) {
    "use strict";

    // send destroy request to appruntime
    var iframe = document.getElementById("appFrame");
    if (iframe) {
        var oData = {
            type: "request",
            service: "sap.ushell.services.appLifeCycle.destroy",
            request_id: "HTML_MSG_" + Date.now(),
            body: {}
        };

        iframe = iframe.contentWindow;
        sendPostMessage(iframe, oData);
    }
}

/**
 * util function to send post message request
 */
function sendPostMessage(oTarget, oData) {
    "use strict";

    if (oTarget) {
        oTarget.postMessage(JSON.stringify(oData), "*");
    }
}

window.onload = onLoad;
