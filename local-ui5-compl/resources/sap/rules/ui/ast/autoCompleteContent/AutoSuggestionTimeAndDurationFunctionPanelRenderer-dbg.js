/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([],

    function () {
        "use strict";

        /**
         * autoSuggestionTimeAndDurationFunctionPanelRenderer renderer.
         *  @namespace
         */
        var autoSuggestionTimeAndDurationFunctionPanelRenderer = {
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
        autoSuggestionTimeAndDurationFunctionPanelRenderer.render = function (oRm, oControl) {

        	oRm.openStart("div", oControl);
    		oRm.class("sapAstAdvancedFunctionPanel");
    		oRm.openEnd();
    		var autoSuggestionTimeAndDurationFunctionPanelRenderer = oControl.getAggregation("PanelLayout");
            oRm.renderControl(autoSuggestionTimeAndDurationFunctionPanelRenderer);
    		oRm.close("div");
    		
        };

        return autoSuggestionTimeAndDurationFunctionPanelRenderer;

    }, /* bExport= */ true);