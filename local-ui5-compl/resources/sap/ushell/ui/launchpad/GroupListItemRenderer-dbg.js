// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * GroupListItem renderer.
 * @private
 */
sap.ui.define([
    "sap/m/ListItemBaseRenderer",
    "sap/ui/core/Renderer"
], function (ListItemBaseRenderer, Renderer) {
    "use strict";

    /**
     * GroupListItem renderer.
     * @namespace
     * @static
     */
    var GroupListItemRenderer = Renderer.extend(ListItemBaseRenderer);

    GroupListItemRenderer.apiVersion = 2;

    GroupListItemRenderer.renderLIAttributes = function (rm) {
        rm.class("sapUshellGroupLI");
        rm.class("sapUshellGroupListItem");
    };

    /**
     * Renders the HTML for the list content part of the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oLI an object representation of the list item control that should be rendered
     */
    GroupListItemRenderer.renderLIContent = function (oRm, oLI) {
        oRm.openStart("div", oLI);
        oRm.class("sapMSLIDiv");
        oRm.class("sapMSLITitleDiv");

        if (!oLI.getVisible()) {
            oRm.style("display", "none");
        }
        oRm.openEnd();

        // List item text (also written when no title for keeping the space)
        oRm.openStart("div", oLI);
        oRm.class("sapMSLITitleOnly");
        oRm.openEnd();
        oRm.text(oLI.getTitle());
        oRm.close("div");

        oRm.close("div");
    };

    return GroupListItemRenderer;
}, /* bExport= */ true);
