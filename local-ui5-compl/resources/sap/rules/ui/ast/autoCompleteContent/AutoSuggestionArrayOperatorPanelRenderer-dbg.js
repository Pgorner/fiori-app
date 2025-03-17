/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([],

    function() {
        "use strict";

        /**
         * autoSuggestionArrayOperatorPanelRenderer renderer.
         *  @namespace
         */
        var autoSuggestionArrayOperatorPanelRenderer = {
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
        autoSuggestionArrayOperatorPanelRenderer.render = function(oRm, oControl) {

        	oRm.openStart("div", oControl);
    		oRm.class("sapAstArrayOperatorPanel");
    		oRm.openEnd();
    		var autoSuggestionArrayOperatorPanelRenderer = oControl.getAggregation("PanelLayout");
            oRm.renderControl(autoSuggestionArrayOperatorPanelRenderer);
    		oRm.close("div");

        };

        return autoSuggestionArrayOperatorPanelRenderer;

    }, /* bExport= */ true);