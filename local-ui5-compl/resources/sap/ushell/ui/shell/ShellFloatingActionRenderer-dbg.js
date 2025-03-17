// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * ShellFloatingAction renderer.
 * @private
 */
sap.ui.define([
    "sap/ui/core/Renderer",
    "sap/m/ButtonRenderer"
], function (
    Renderer,
    ButtonRenderer
) {
    "use strict";

    /**
     * Renderer for the sap.ushell.ui.shell.ShellFloatingAction
     * @namespace
     */
    var ShellFloatingActionRenderer = Renderer.extend(ButtonRenderer);

    ShellFloatingActionRenderer.apiVersion = 2;

    return ShellFloatingActionRenderer;

}, /* bExport= */ true);
