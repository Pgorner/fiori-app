// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * Open for the first time - preparations
 */
function onLoad () {
    "use strict";

    setEventHandlers();
    setTimeValues();
    addEventListener("message", processMessages);

    /**
     * Inform FLP that this iframe supports stateful container
     * (this is not needed in case the indication exists in
     * the URL template of the app).
     * In case the stateful container for this iframe is already
     * enabled though the URL Template, we do not need to do anything.
     */
    sendRequestToFLP("sap.ushell.services.appLifeCycle.setup", {
        isStateful: true,
        session: {
            bLogoutSupport: true
        }
    });

    /**
     * the first time the iframe is launched, its for a specific
     * app so we need to create it
     */
    openApp(getApplicationID(document.URL));
}

/**
 * Set event handlers
 */
function setEventHandlers () {
    "use strict";

    document.getElementById("idA2B").addEventListener("click", function () { navToApp("B", true); });
    document.getElementById("idA2C").addEventListener("click", function () { navToApp("C", true); });

    document.getElementById("idB2A").addEventListener("click", function () { navToApp("A", true); });
    document.getElementById("idB2C").addEventListener("click", function () { navToApp("C", true); });

    document.getElementById("idC2A").addEventListener("click", function () { navToApp("A", true); });
    document.getElementById("idC2B").addEventListener("click", function () { navToApp("B", true); });
}

/**
 * Handle stateful container events from FLP
 */
function processMessages (oMessage) {
    "use strict";

    var oMessageData = JSON.parse(oMessage.data);

    if (oMessageData.service === "sap.ushell.services.appLifeCycle.create") {
        openApp(getApplicationID(oMessageData.body.sUrl));
        sendSuccessToFLP(oMessageData);
    } else if (oMessageData.service === "sap.ushell.services.appLifeCycle.destroy") {
        closeApp();
        sendSuccessToFLP(oMessageData);
    } else if (oMessageData.service === "sap.ushell.appRuntime.innerAppRouteChange") {
        navToApp(oMessageData.body.oHash.newHash);
        sendSuccessToFLP(oMessageData);
    } else if (oMessageData.service === "sap.ushell.sessionHandler.logout") {
        //do whatever is needed to logout
        sendSuccessToFLP(oMessageData);
    } else if (oMessageData.service === "sap.ushell.appRuntime.handleBackNavigation") {
        sendRequestToFLP("sap.ushell.services.CrossApplicationNavigation.backToPreviousApp", {});
    }

    // if (oMessageData.service === "sap.ushell.sessionHandler.beforeApplicationHide") {
    //     alert("we are about to hide this application iframe");
    // } else if (oMessageData.service === "sap.ushell.sessionHandler.afterApplicationShow") {
    //     setTimeout(function () {
    //         alert("we just showed back this application iframe");
    //     }, 100);
    // }
}

/**
 * Open an application
 *
 * @param {string} sID The id of the application DOM reference
 */
function openApp (sID) {
    "use strict";

    document.getElementById("idTimeOpened").textContent = new Date().toLocaleTimeString();
    document.getElementById("idApp").textContent = sID;
    var oIDElement = document.getElementById(sID);
    document.getElementById("canvas").prepend(oIDElement);
    document.getElementById("idAppArea").style.backgroundColor = oIDElement.getAttribute("color");

    sendRequestToFLP("sap.ushell.ui5service.ShellUIService.setBackNavigation", {
        callbackMessage: {
            service: "sap.ushell.appRuntime.handleBackNavigation"
        }
    });
}

/**
 * Close an application
 */
function closeApp () {
    "use strict";

    document.getElementById("Apps").prepend(document.getElementById("canvas").children[0]);
}

/**
 * internal navigation from App to App
 */
function navToApp (sID, bUpdateFLPRoute) {
    "use strict";

    closeApp();
    openApp(sID);
    if (bUpdateFLPRoute) {
        sendRequestToFLP("sap.ushell.services.CrossApplicationNavigation.setInnerAppRoute", {
            appSpecificRoute: "&/" + sID
        });
    }
}

/**
 * util function to post message to FLP
 */
function sendRequestToFLP (sService, oData) {
    "use strict";

    window.parent.postMessage(JSON.stringify({
        type: "request",
        service: sService,
        body: oData
    }), "*");
}

/**
 * util function to send respond to FLP
 */
function sendSuccessToFLP (oMessageData) {
    "use strict";

    window.parent.postMessage(JSON.stringify({
        type: "response",
        service: oMessageData.service,
        request_id: oMessageData.request_id,
        status: "success",
        body: {}
    }), "*");
}

/**
 * Extract the application ID from the URL
 */
function getApplicationID (sUrl) {
    "use strict";

    var sHash = sUrl.substr(sUrl.indexOf("#"));
    return sHash.substr(sHash.indexOf("&/") + 2);
}

/**
 * util function to show time
 */
function setTimeValues () {
    "use strict";

    function showCurrentTime () {
        document.getElementById("idCurrentTime").textContent = new Date().toLocaleTimeString();
    }

    document.getElementById("idTimeCreated").textContent = new Date().toLocaleTimeString();
    showCurrentTime();
    setInterval(showCurrentTime, 1000);
}

window.onload = onLoad;
