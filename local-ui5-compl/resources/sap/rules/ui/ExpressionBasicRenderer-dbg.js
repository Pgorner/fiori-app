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
        var ExpressionBasicRenderer = {
        		apiVersion: 2
        };

        /*
         * Renders the HTML for the given control, using the provided
         * {@link sap.ui.core.RenderManager}.
         *
         * @param {sap.ui.core.RenderManager} oRm
         *            the RenderManager that can be used for writing to
         *            the Render-Output-Buffer
         * @param {sap.ui.core.Control} oExpressionBasic
         *            the ExpressionBasic  to be rendered
         */
        ExpressionBasicRenderer.render = function(oRm, oExpressionBasic) {
        	oRm.openStart("div", oExpressionBasic);
    		oRm.class("sapRULTextRule");
    		oRm.openEnd();
            oRm.renderControl(oExpressionBasic.getAggregation("_instructionRenderer"));
            oRm.close("div");
        };

        return ExpressionBasicRenderer;

    }, /* bExport= */ true);