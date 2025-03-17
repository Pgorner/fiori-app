// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
], function (
) {
    "use strict";

    /**
     * ContentNodeSelector renderer.
     * @namespace
     */
    var ContentNodeSelectorRenderer = {
        apiVersion: 2
    };

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
     * @param {sap.ushell.ui.ContentNodeSelector} oSelector The control.
     */
    ContentNodeSelectorRenderer.render = function (oRenderManager, oSelector) {
        oRenderManager.openStart("div", oSelector);
        oRenderManager.openEnd(); // div - tag

        oRenderManager.renderControl(oSelector.getAggregation("content"));

        oRenderManager.close("div");
    };

    return ContentNodeSelectorRenderer;
});
