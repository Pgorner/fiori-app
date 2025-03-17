// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview This file contains miscellaneous test utility functions for iframes.
 */
sap.ui.define([
    "sap/base/util/Deferred",
    "sap/ushell/utils"
], function (
    Deferred,
    ushellUtils
) {
    "use strict";

    const iCheckInterval = 100;
    const iResolveCheckTimeout = 500;

    const IframeUtils = {};

    /**
     * Creates an iframe element with the given url.
     * @param {string} sUrl full path to the iframe
     * @returns {HTMLIFrameElement} the iframe.
     *
     * @since 1.131.0
     * @private
     */
    IframeUtils.createIframe = function (sUrl) {
        const sFullUrl = sap.ui.require.toUrl(sUrl);
        const oWrapper = document.createElement("div");
        oWrapper.innerHTML = `<iframe id="flp" src="${sFullUrl}" width="1000px" height="400px"></iframe>`;
        return oWrapper.children[0];
    };

    /**
     * Appends the iframe to the qunit fixture.
     * @param {HTMLIFrameElement} oIframe The iframe.
     *
     * @since 1.131.0
     * @private
     */
    IframeUtils.appendToQunitFixture = function (oIframe) {
        document.getElementById("qunit-fixture")?.appendChild(oIframe);
    };

    /**
     * Sets the hash on the provided iframe.
     * @param {HTMLIFrameElement} oIframe The iframe.
     * @param {string} sHash The hash to set.
     *
     * @since 1.131.0
     * @private
     */
    IframeUtils.setHash = function (oIframe, sHash) {
        oIframe.contentWindow.document.location.hash = sHash;
    };

    /**
     * Sets the ushell config on the provided iframe.
     * @param {HTMLIFrameElement} oIframe The iframe.
     * @param {object} oConfig The config to set.
     *
     * @since 1.131.0
     * @private
     */
    IframeUtils.setConfig = function (oIframe, oConfig) {
        oIframe.contentWindow["sap-ushell-config"] = oConfig;
    };

    /**
     * Gets the global object of the iframe.
     * @param {HTMLIFrameElement} oIframe The iframe.
     * @returns {Window} The global object of the iframe.
     *
     * @since 1.131.0
     * @private
     */
    IframeUtils.getGlobalThis = function (oIframe) {
        return oIframe.contentWindow;
    };

    /**
     * Requires requested module in the scope of the iframe.
     * @param {HTMLIFrameElement} oIframe The iframe.
     * @param {string} sModulePath The module path (e.g. "sap/ui/core/Element").
     * @returns {Promise<object>} The requested module.
     *
     * @since 1.131.0
     * @private
     */
    IframeUtils.requireAsync = function (oIframe, sModulePath) {
        return new Promise((resolve, reject) => {
            oIframe.contentWindow.sap.ui.require([sModulePath], resolve, reject);
        });
    };

    /**
     * Waits for the control with the given id to be loaded in the iframe.
     * The <code>sIframeSelector</code> parameter is optional and should be used
     * when the control is inside an inner iframe.
     * @param {HTMLIFrameElement} oIframe The iframe.
     * @param {string} sControlId The control id.
     * @param {string} [sIframeSelector] The selector of the inner iframe.
     * @returns {Promise<sap.ui.core.Control>} The control.
     *
     * @since 1.131.0
     * @private
     */
    IframeUtils.waitForControl = function (oIframe, sControlId, sIframeSelector) {
        const oDeferred = new Deferred();
        const fnCheck = async function () {
            let Element;
            if (sIframeSelector) {
                const oInnerIframe = oIframe.contentDocument.querySelector(sIframeSelector);
                if (oInnerIframe?.contentWindow) {
                    Element = await IframeUtils.requireAsync(oInnerIframe, "sap/ui/core/Element");
                } else if (oInnerIframe) { // regular dom node
                    Element = await IframeUtils.requireAsync(oIframe, "sap/ui/core/Element");
                }
            } else {
                Element = await IframeUtils.requireAsync(oIframe, "sap/ui/core/Element");
            }

            if (!Element) {
                console.log(`Did not sap/ui/core/Element. Waiting for '${sIframeSelector}' to be loaded...`);
                setTimeout(fnCheck, iCheckInterval);
                return;
            }

            const oControl = Element.getElementById(sControlId);
            if (oControl) {
                // Tests run unstable if we resolve immediately, so we wait a bit
                await ushellUtils.awaitTimeout(iResolveCheckTimeout);
                oDeferred.resolve(oControl);
            } else {
                console.log(`Did not find the target control. Waiting for '${sControlId}' to be loaded...`);
                setTimeout(fnCheck, iCheckInterval);
            }
        };
        fnCheck();
        return oDeferred.promise;
    };

    /**
     * Waits for the dom node with the given id to be loaded in the iframe.
     * The <code>sIframeSelector</code> parameter is optional and should be used
     * when the dom node is inside an inner iframe.
     * @param {HTMLIFrameElement} oIframe The iframe.
     * @param {string} sCssSelector The css selector.
     * @param {string} [sIframeSelector] The selector of the inner iframe.
     * @returns {Promise<HTMLElement>} The dom node.
     *
     * @since 1.131.0
     * @private
     */
    IframeUtils.waitForCssSelector = function (oIframe, sCssSelector, sIframeSelector) {
        const oDeferred = new Deferred();
        const fnCheck = async function () {
            let oTargetDom;
            if (sIframeSelector) {
                const oInnerIframe = oIframe.contentDocument.querySelector(sIframeSelector);
                if (oInnerIframe?.contentDocument) {
                    oTargetDom = oInnerIframe?.contentDocument;
                } else if (oInnerIframe) { // regular dom node
                    oTargetDom = oInnerIframe;
                }
            } else {
                oTargetDom = oIframe?.contentDocument;
            }

            if (!oTargetDom) {
                console.log(`Did not find the target dom. Waiting for '${sIframeSelector}' to be loaded...`);
                setTimeout(fnCheck, iCheckInterval);
                return;
            }

            const oNode = oTargetDom.querySelector(sCssSelector);
            if (oNode) {
                // Tests run unstable if we resolve immediately, so we wait a bit
                await ushellUtils.awaitTimeout(iResolveCheckTimeout);
                oDeferred.resolve(oNode);
            } else {
                console.log(`Did not find the target dom node. Waiting for '${sCssSelector}' to be loaded...`);
                setTimeout(fnCheck, iCheckInterval);
            }
        };
        fnCheck();
        return oDeferred.promise;
    };

    /**
     * Gets the control with the given id from the iframe.
     * The <code>sIframeSelector</code> parameter is optional and should be used
     * when the control is inside an inner iframe.
     * @param {HTMLIFrameElement} oIframe The iframe.
     * @param {string} sCssSelector The css selector.
     * @param {string} [sIframeSelector] The selector of the inner iframe.
     * @returns {HTMLElement} The dom node.
     *
     * @since 1.131.0
     * @private
     */
    IframeUtils.getWithCssSelector = function (oIframe, sCssSelector, sIframeSelector) {
        let oTargetDom;
        if (sIframeSelector) {
            const oInnerIframe = oIframe.contentDocument.querySelector(sIframeSelector);
            if (oInnerIframe?.contentDocument) {
                oTargetDom = oInnerIframe?.contentDocument;
            } else if (oInnerIframe) { // regular dom node
                oTargetDom = oInnerIframe;
            }
        } else {
            oTargetDom = oIframe?.contentDocument;
        }

        if (!oTargetDom) {
            return;
        }

        const oNode = oTargetDom.querySelector(sCssSelector);
        return oNode;
    };

    return IframeUtils;
});
