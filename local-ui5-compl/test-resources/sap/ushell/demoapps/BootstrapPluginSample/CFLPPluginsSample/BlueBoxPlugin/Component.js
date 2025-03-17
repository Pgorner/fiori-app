// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "sap/ui/thirdparty/jquery"
], function (Component, ComponentContainer, jQuery) {
    "use strict";

    var oPostMessageInterface,
        bInit = false;

    return Component.extend("sap.ushell.demo.BootstrapPluginSample.CFLPPluginsSample.blueBoxPlugin.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.CFLPPluginsSample.blueBoxPlugin"
        },

        init: function () {
            let iIntervalID;
            oPostMessageInterface = this.getComponentData().oPostMessageInterface;

            oPostMessageInterface.registerPostMessageAPIs({
                "user.postapi.bbactions": {
                    inCalls: {
                        helloFromParent: {
                            executeServiceCallFn: function (oServiceParams) {
                                if (!bInit) {
                                    jQuery("<div id='idHelloFromParent'></div>").appendTo("body");
                                    bInit = true;
                                    clearInterval(iIntervalID);
                                }
                                return new jQuery.Deferred().resolve({ result: "Response from Plugin 1234" }).promise();
                            }
                        }
                    }
                }
            });

            // Repeat sending the message in case the YellowBoxPlugin is not ready yet
            let iAttempts = 0;
            iIntervalID = setInterval(function () {
                oPostMessageInterface.postMessageToFlp(
                    "user.postapi.ybactions",
                    "agentStarted");

                // Stop trying after some time
                iAttempts++;
                if (iAttempts > 60) {
                    clearInterval(iIntervalID);
                }
            }, 1000);

            function treatHashChanged (newHash/*, oldHash*/) {
                if (newHash && typeof newHash === "string" && newHash.length > 0) {
                    oPostMessageInterface.postMessageToFlp(
                        "user.postapi.ybactions",
                        "writeLog",
                        {
                            sMsg: newHash
                        });
                }
            }
            window.hasher.changed.add(treatHashChanged.bind(this), this);
        },

        exit: function () { }
    });
});
