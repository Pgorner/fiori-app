/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([],

    function() {
        "use strict";

        /**
         * autoSuggestionRangeOperatorPanelRenderer renderer.
         *  @namespace
         */
        var autoSuggestionRangeOperatorPanelRenderer = {
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
        autoSuggestionRangeOperatorPanelRenderer.render = function(oRm, oControl) {

        	oRm.openStart("div", oControl);
    		oRm.class("sapAstRangeOperatorPanel");
    		oRm.openEnd();
    		var autoSuggestionRangeOperatorPanelRenderer = oControl.getAggregation("PanelLayout");
            oRm.renderControl(autoSuggestionRangeOperatorPanelRenderer);
    		oRm.close("div");
        };

        return autoSuggestionRangeOperatorPanelRenderer;

    }, /* bExport= */ true);