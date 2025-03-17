/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([],

    function() {
        "use strict";

        /**
         * autoSuggestionOperationsRenderer renderer.
         *  @namespace
         */
        var autoSuggestionOperationsPanelRenderer = {
        		apiVersion: 2
        };

        /**
         * Renders the HTML for the given control, using the provided
         * {@link sap.ui.core.RenderManager}.
         *
         * @param {sap.ui.core.RenderManager} oRm
         *            the RenderManager that can be used for writing to
         *            the Render-Output-Buffer
         * @param {sap.ui.core.Control} oControl
         *            the control to be rendered
         */
        autoSuggestionOperationsPanelRenderer.render = function(oRm, oControl) {

        	oRm.openStart("div", oControl);
    		oRm.class("sapAstOperationsPanel");
    		oRm.openEnd();
    		var autoSuggestionOperationsPanelRenderer = oControl.getAggregation("PanelLayout");
            oRm.renderControl(autoSuggestionOperationsPanelRenderer);
    		oRm.close("div");
        };

        return autoSuggestionOperationsPanelRenderer;

    }, /* bExport= */ true);