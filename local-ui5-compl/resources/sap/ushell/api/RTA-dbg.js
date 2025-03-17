// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview Utility functions for RTA.
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/EventHub"
], function (
    Container,
    EventHub
) {
    "use strict";

    /**
     * @alias sap.ushell.api.RTA
     * @namespace
     *
     * @since 1.120.0
     * @private
     * @ui5-restricted sap.ui.fl, sap.ui.rta
     */
    const RtaUtils = {};

    /**
     * Returns the shell header control.
     * @returns {sap.ui.core.Control} The shellHeader
     *
     * @since 1.120.0
     * @private
     * @ui5-restricted sap.ui.fl, sap.ui.rta
     */
    RtaUtils.getShellHeader = function () {
        const oRenderer = Container.getRendererInternal();
        return oRenderer.getRootControl().getShellHeader();
    };

    /**
     * Sets the visibility of the shell header.
     * @param {boolean} visible Whether the shell header should be visible in all states.
     *
     * @since 1.120.0
     * @private
     * @ui5-restricted sap.ui.fl, sap.ui.rta
     */
    RtaUtils.setShellHeaderVisibility = function (visible) {
        const oRenderer = Container.getRendererInternal();
        oRenderer.setHeaderVisibility(visible, false);
    };

    /**
     * Adds a placeholder for the shell header within the iframe.
     *
     * @since 1.121.0
     * @private
     * @ui5-restricted sap.ui.fl, sap.ui.rta
     */
    RtaUtils.addTopHeaderPlaceHolder = function () {
        const oRenderer = Container.getRendererInternal();
        oRenderer.addTopHeaderPlaceHolder();
    };

    /**
     * Removes the placeholder for the shell header within the iframe.
     *
     * @since 1.121.0
     * @private
     * @ui5-restricted sap.ui.fl, sap.ui.rta
     */
    RtaUtils.removeTopHeaderPlaceHolder = function () {
        const oRenderer = Container.getRendererInternal();
        oRenderer.removeTopHeaderPlaceHolder();
    };

    /**
     * Sets the property enabled of the navigation bar.
     * @param {boolean} bEnable Whether the navigation bar should be enabled or not.
     * @since 1.126.0
     * @private
     * @ui5-restricted sap.ui.fl, sap.ui.rta
     */
    RtaUtils.setNavigationBarEnabled = function (bEnable) {
        EventHub.emit("enableMenuBarNavigation", bEnable);
    };
    return RtaUtils;

});
