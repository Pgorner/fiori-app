/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([],

    function () {
        "use strict";

        /**
         * DecisionTableSettings renderer.
         *  @namespace
         */
        var AutoCompleteSuggestionContentRenderer = {
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
        AutoCompleteSuggestionContentRenderer.render = function (oRm, oControl) {

        	oRm.openStart("div", oControl);
    		oRm.class("sapAstAutoCompleteSuggestionContentRenderer");
    		oRm.openEnd();
    		var AutoCompleteSuggestionContentRenderer = oControl.getAggregation("mainLayout");
            oRm.renderControl(AutoCompleteSuggestionContentRenderer);
    		oRm.close("div");
        };

        return AutoCompleteSuggestionContentRenderer;

    }, /* bExport= */ true);