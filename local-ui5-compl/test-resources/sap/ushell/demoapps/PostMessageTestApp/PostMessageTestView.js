// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/uid",
    "sap/m/Button",
    "sap/m/FlexBox",
    "sap/m/Label",
    "sap/m/library",
    "sap/m/ObjectHeader",
    "sap/m/Page",
    "sap/m/Panel",
    "sap/m/TextArea",
    "sap/m/Toolbar",
    "sap/m/VBox",
    "sap/ui/core/HTML",
    "sap/ui/core/mvc/View",
    "sap/ui/performance/Measurement"
], function (
    Log,
    uid,
    Button,
    FlexBox,
    Label,
    mobileLibrary,
    ObjectHeader,
    Page,
    Panel,
    TextArea,
    Toolbar,
    VBox,
    HTML,
    View,
    Measurement
) {
    "use strict";

    // shortcut for sap.m.LabelDesign
    var LabelDesign = mobileLibrary.LabelDesign;

    var aTestData;

    function onMessage (oEvent) {
        var oMeasurement = Measurement.end("FLP:PostMessageTestView");
        var sMessage;
        if (oMeasurement) {
            sMessage = "Received message from origin '" + oEvent.origin + "' after '" + oMeasurement.duration + "' ms. Data: " + oEvent.data;
        } else {
            sMessage = "Received message from origin '" + oEvent.origin + "': " + oEvent.data;
        }
        Log.debug(sMessage, undefined, "sap.ushell.demo.PostMessageTestApp");
        try {
            var oParsedEvent = JSON.parse(oEvent.data);
            if (oMeasurement) {
                oParsedEvent.duration = Math.round(oMeasurement.duration) + " ms";
            }
            this.oTextArea.setValue(JSON.stringify(oParsedEvent, null, 3));
        } catch (e) {
            this.oTextArea.setValue("ERROR: " + e);

            // could be some message which is not meant for us, so we just log with debug level
            Log.debug(
                "Message received from origin '" + oEvent.origin + "' cannot be parsed: " + e,
                oEvent.data,
                "sap.ushell.components.container.ApplicationContainer"
            );
            return;
        }
    }

    /**
     * Creates a button to trigger a post message for the given action and message. Optionally,
     * the message is not stringified and the text of the button can be set to a value different
     * from the action. IE9 is not capable of passing objects as parameter, but is applying
     * toString() on these objects. Sending unstringified objects on IE9 would therefore results
     * in incorrect strings ("[object Object]").
     * @param {object} oMessage
     *   the message to be sent
     * @param {boolean} [bNoStringify=false]
     *   indicates that messages is not stringified
     * @param {string} [sText=oMessage.action]
     *   text of the button
     * @param {function} [fnMessageCallback]
     *   message callback function
     * @returns {sap.m.Button}
     *   instance of a button to send post message
     */
    function createPostMessageButton (oMessage, bNoStringify, sText, fnMessageCallback) {
        return new Button({
            text: sText || oMessage.action,
            press: function () {
                var sMessage = JSON.stringify(oMessage);
                if (typeof fnMessageCallback === "function") {
                    oMessage = fnMessageCallback();
                }
                Log.debug("Sending message to top frame: " + sMessage, undefined, "sap.ushell.demo.PostMessageTestApp");
                Measurement.start("FLP:PostMessageTestView", "PostMessageTestViewFirePostMessageStart", "FLP");
                window.top.postMessage(bNoStringify ? oMessage : sMessage, "*");
            }
        });
    }

    /**
     * Create a UI5 control to render a test scenario with description texts and buttons to
     * execute.
     *
     * @param {object} oTestData
     *   texts and button data needed to render the control
     * @returns {sap.ui.core.Control}
     *   instance of a panel control
     */
    function createPanel (oTestData) {
        var aButtons,
            sHtml;

        aButtons = oTestData.buttons && oTestData.buttons.map(
            function (oButtonData) {
                return createPostMessageButton(oButtonData.message, oButtonData.noStringify,
                    oButtonData.text, oButtonData.messageCallback);
            }
        );

        if (oTestData.description && oTestData.behavior) {
            sHtml = "<div><b>Description:</b> " +
                oTestData.description + "<br>" +
                "<b>Expected Behavior:</b> " +
                oTestData.behavior + "</div>";
        } else if (oTestData.text) {
            sHtml = "<div>" + oTestData.text + "</div>";
        }

        return new Panel({
            expandable: true,
            expanded: false,
            headerToolbar: new Toolbar({
                content: [new Label({
                    text: oTestData.title,
                    design: LabelDesign.Bold
                })]
            }),
            content: [new HTML({ content: sHtml }),
            new Toolbar({ content: aButtons })]
        });
    }

    // relax domain to create a stricter separation to parent frame
    document.domain = document.domain.substring(document.domain.indexOf(".") + 1);

    aTestData = [
        {
            title: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal",
            description: "This service function returns a string representing the URL hash " +
                "top perform a cross application navigation. ",
            behavior: "Shows the return value as message toast.",
            buttons: [{
                text: "GenericWrapperTest-open?A=B",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal",
                    request_id: uid(),
                    body: {
                        oArgs: {
                            target: { semanticObject: "GenericWrapperTest", action: "open" },
                            params: { A: "B" }
                        }
                    }
                }
            }, {
                text: "Action-showBookmark",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal",
                    request_id: uid(),
                    body: {
                        oArgs: {
                            target: { semanticObject: "Action", action: "showBookmark" }
                        }
                    }
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
            description: "Resolves a given semantic object and business parameters to a list " +
                "of links, taking into account the form factor of the current device.",
            behavior: "Shows the return value as message toast.",
            buttons: [{
                text: "GenericWrapperTest",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                    request_id: uid(),
                    body: {
                        sSemanticObject: "GenericWrapperTest",
                        mParameters: { A: "B" },
                        bIgnoreFormFactors: false
                    }
                }
            }, {
                text: "Action",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                    request_id: uid(),
                    body: {
                        sSemanticObject: "Action",
                        bIgnoreFormFactors: false
                    }
                }
            }, {
                text: "Error",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                    request_id: uid(),
                    body: {
                        sSemanticObject: "Action?fail_on_me=true",
                        bIgnoreFormFactors: false
                    }
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
            description: "Tells whether the given intent(s) are supported, taking into account " +
                "the form factor of the current device. 'Supported' means that navigation " +
                "to the intent is possible.",
            behavior: "Shows the return value as message toast.",
            buttons: [{
                text: "only supported intents",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
                    request_id: uid(),
                    body: {
                        aIntents: ["#Action-toappperssample", "#Action-toappnavsample"]
                    }
                }
            }, {
                text: "with unsupported intents",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
                    request_id: uid(),
                    body: {
                        aIntents: ["#Action-toappperssample", "#Action-toappnavsample", "#Action-invalidAction"]
                    }
                }
            }]
        }, {
            title: "sap.ushell.services.Container.getFLPUrl",
            description: "Provides the current URL without the Hash Fragment.",
            behavior: "Shows the return value as message toast.",
            buttons: [{
                text: "getFLPUrl",
                message: {
                    type: "request",
                    service: "sap.ushell.services.Container.getFLPUrl",
                    request_id: uid(),
                    body: {}
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
            description: "Tells whether the given navigation intent(s) are supported, taking into account " +
                "the form factor of the current device. 'Supported' means that navigation " +
                "to the intent is possible.",
            behavior: "Shows the return value as message toast.",
            buttons: [{
                text: "only supported intents",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
                    request_id: uid(),
                    body: {
                        aIntents: [
                            { target: { semanticObject: "Action", action: "toappperssample" } },
                            { target: { semanticObject: "Action", action: "toappnavsample" } }
                        ]
                    }
                }
            }, {
                text: "with unsupported intents",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
                    request_id: uid(),
                    body: {
                        aIntents: [
                            { target: { semanticObject: "Action", action: "toappperssample" } },
                            { target: { semanticObject: "Action", action: "toappnavsample" } },
                            { target: { semanticObject: "Action", action: "invalidAction" } }
                        ]
                    }
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.toExternal",
            description: "This service function navigates to a specified target.",
            behavior: "Triggers a direct navigation. Navigation targets might not exist depending on platform and assigned user roles.",
            buttons: [{
                text: "Action-showBookmark",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.toExternal",
                    request_id: uid(),
                    body: {
                        oArgs: {
                            target: { semanticObject: "Action", action: "showBookmark" }
                        }
                    }
                }
            }, {
                text: "Action-toappnavsample",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.toExternal",
                    request_id: uid(),
                    body: {
                        oArgs: {
                            target: { semanticObject: "Action", action: "toappnavsample" }
                        }
                    }
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.backToPreviousApp",
            description: "This service function causes the FLP to navigate to a previous app",
            behavior: "Triggers a back navigation. If the page is opened in a new window, it navigates to the Shell-home in place",
            buttons: [{
                text: "backToPreviousApp",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.backToPreviousApp",
                    request_id: uid(),
                    body: {}
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.historyBack",
            description: "This service function causes the FLP to navigate back in the browser history",
            behavior: "Triggers a back navigation. If a number of steps is provided it called underlying browser api with that. The examples shows how to call with 3 steps",
            buttons: [{
                text: "historyBack",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.historyBack",
                    request_id: uid(),
                    body: { iSteps: 3 }
                }
            }]
        }, {
            title: "sap.ushell.ui5service.ShellUIService.setTitle",
            description: "This service function navigates to a specified target.",
            behavior: "Sets the title",
            buttons: [{
                text: "setPurchaseOrder",
                message: {
                    type: "request",
                    service: "sap.ushell.ui5service.ShellUIService.setTitle",
                    request_id: uid(),
                    body: { sTitle: "Purchase Order" }
                }
            }, {
                text: "setSalesOrder",
                message: {
                    type: "request",
                    service: "sap.ushell.ui5service.ShellUIService.setTitle",
                    request_id: uid(),
                    body: { sTitle: "Sales Order" }
                }
            }]
        }, {
            title: "sap.ushell.ui5service.ShellUIService.setBackNavigation",
            description: "This service is used by applications to display the back navigation button in the shell header and register a callback called when the button is clicked",
            behavior: "Displays the shell back navigation button",
            buttons: [{
                text: "setBackNavigation",
                message: {
                    type: "request",
                    service: "sap.ushell.ui5service.ShellUIService.setBackNavigation",
                    request_id: uid(),
                    body: {
                        callbackMessage: {
                            service: "sap.postmessagetest.backNavigation",
                            supportedProtocolVersions: ["1"]
                        }
                    }
                }
            }, {
                text: "clearBackNavigation (empty callback)",
                message: {
                    type: "request",
                    service: "sap.ushell.ui5service.ShellUIService.setBackNavigation",
                    request_id: uid(),
                    body: { callbackMessage: {} }
                }
            }]
        }, {
            title: "sap.ushell.services.Container.setDirtyFlag",
            description: "This service function sets the dirty flag on behalf of SAP GUI transaction",
            behavior: "Shows the return value",
            buttons: [{
                text: "true",
                message: {
                    type: "request",
                    service: "sap.ushell.services.Container.setDirtyFlag",
                    request_id: uid(),
                    body: { bIsDirty: true }
                }
            }, {
                text: "false",
                message: {
                    type: "request",
                    service: "sap.ushell.services.Container.setDirtyFlag",
                    request_id: uid(),
                    body: { bIsDirty: false }
                }
            }]
        }, {
            title: "Additional Information",
            text: "document.domain: " + document.domain + "<br>" +
                "location.search: " + window.location.search + "<br>"
        }
    ];

    return View.extend("sap.ushell.demo.PostMessageTestApp.PostMessageTest", {
        init: function () {
            window.addEventListener("message", onMessage.bind(this));
        },
        exit: function () {
            window.removeEventListener("message", onMessage.bind(this));
        },

        /**
         * Is initially called once after the Controller has been instantiated. It is the place
         * where the UI is constructed. Since the Controller is given to this method, its event
         * handlers can be attached right away.
         */
        createContent: function () {
            var that = this;
            this.oTextArea = new TextArea({
                value: "Please perform one post message request to obtain the corresponding response message.",
                width: "100%",
                height: "20em"
            });

            var aPostMessageRequestPanels = aTestData.map(function (oTestData) {
                return createPanel(oTestData);
            });
            aPostMessageRequestPanels.unshift(
                new ObjectHeader({
                    title: "PostMessage request"
                })
            );

            return new Page({
                content: [
                    new FlexBox({
                        fitContainer: true,
                        alignItems: "Stretch",
                        items: [
                            new VBox({
                                width: "50%",
                                items: aPostMessageRequestPanels
                            }),
                            new VBox({
                                width: "50%",
                                items: [
                                    new ObjectHeader({ title: "PostMessage response" }),
                                    that.oTextArea
                                ]
                            })
                        ]
                    })
                ]
            });
        }
    });
});
