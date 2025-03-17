// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5"
], function (Opa5) {
    "use strict";

    function loadOpaPluginFromIframe (oIframe) {
        const oIframeContext = oIframe.contentWindow;
        oIframeContext.sap.ui.require(["sap/ui/test/OpaPlugin"], () => {});
    }

    /**
     * The OpaPlugin operates on the scope of the inner frame.
     * It can be used to find controls and interact with them.
     * @param {Node} oIframe The iframe element
     * @returns {sap.ui.test.OpaPlugin} The OpaPlugin instance
     */
    function getOpaPluginFromIframe (oIframe) {
        const oIframeContext = oIframe.contentWindow;
        const OpaPlugin = oIframeContext.sap.ui.require("sap/ui/test/OpaPlugin");
        if (OpaPlugin) {
            return new OpaPlugin();
        }
    }

    Opa5.createPageObjects({
        onTheAppExtensionApp: {
            actions: {},
            assertions: {
                iSeeTheText: function (sText) {
                    this.waitFor({
                        controlType: "sap.ushell.components.container.ApplicationContainer",
                        id: /application-/,
                        check: function (aApplicationContainer) {
                            const oIframe = aApplicationContainer[0].getDomRef();
                            const oPlugin = getOpaPluginFromIframe(oIframe);
                            if (!oPlugin) {
                                loadOpaPluginFromIframe(oIframe);
                                return false;
                            }

                            const aControls = oPlugin.getMatchingControls({
                                controlType: "sap.m.Text"
                            });

                            return aControls.some((oControl) => oControl.getText() === sText);
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The text was found");
                        }
                    });
                },
                iSeeTheMessageToast: function (sMessage) {
                    this.waitFor({
                        controlType: "sap.ushell.components.container.ApplicationContainer",
                        id: /application-/,
                        check: function (aApplicationContainer) {
                            const oIframe = aApplicationContainer[0].getDomRef();
                            const oPlugin = getOpaPluginFromIframe(oIframe);
                            if (!oPlugin) {
                                loadOpaPluginFromIframe(oIframe);
                                return false;
                            }

                            const oMessageToast = oIframe.contentDocument.querySelector(".sapMMessageToast");
                            return oMessageToast?.innerText === sMessage;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The message toast was shown.");
                        }
                    });
                }
            }
        }
    });
});
