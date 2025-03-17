// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global sum, oDetails */

sap.ui.define([
    "sap/ui/core/Component"
], function (Component) {
    "use strict";

    var oPostMessageInterface;

    return Component.extend("sap.ushell.demo.BootstrapPluginSample.CFLPPluginsSample.WikiBasicSample.YellowBoxPlugin.Component", {
        init: function () {
            //get the post message api interface
            oPostMessageInterface = this.getComponentData().oPostMessageInterface;

            //register the agent plugin supported apis
            this.registerPostMessages();

            //inform the parent plugin we are alive
            this.informParentPluginWeStarted();
        },

        registerPostMessages: function () {
            oPostMessageInterface.registerPostMessageAPIs({
                "user.postapi.sample": {
                    inCalls: {
                        agentStarted: {
                            executeServiceCallFn: function (oServiceParams) {
                                return oPostMessageInterface.createPostMessageResult({ sum: sum });
                            }
                        },
                        getIframeDetails: {
                            executeServiceCallFn: function (oServiceParams) {
                                return oPostMessageInterface.createPostMessageResult(oDetails);
                            }
                        }
                    },
                    outCalls: {
                        add2Numbers: {},
                        getIframeDetails: {}
                    }
                }
            });
        },

        informParentPluginWeStarted: function () {
            oPostMessageInterface.postMessageToFlp(
                "user.postapi.sample",
                "agentStarted");
        },

        exit: function () {
            //do exit actions
        }
    });
});
