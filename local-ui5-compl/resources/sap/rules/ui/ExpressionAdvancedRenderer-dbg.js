            /*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([],
    function() {
        "use strict";

        /**
         * ExpressionAdvanced renderer.
         * @namespace
         */
        var ExpressionAdvancedRenderer = {
        		apiVersion: 2
        };

        /*
         * Renders the HTML for the given control, using the provided
         * {@link sap.ui.core.RenderManager}.
         *
         * @param {sap.ui.core.RenderManager} oRm
         *            the RenderManager that can be used for writing to
         *            the Render-Output-Buffer
         * @param {sap.ui.core.Control} oExpressionAdvanced 
         *            the ExpressionAdvanced  to be rendered
         */
        ExpressionAdvancedRenderer.render = function(oRm, oExpressionAdvanced) {
        	oRm.openStart("div", oExpressionAdvanced);
    		oRm.class("sapRULExpressionAdvanced");
    		oRm.openEnd();
            oRm.renderControl(oExpressionAdvanced.getAggregation("_expressionArea"));
            oRm.close("div");
        };

    return ExpressionAdvancedRenderer;

}, /* bExport= */ true);