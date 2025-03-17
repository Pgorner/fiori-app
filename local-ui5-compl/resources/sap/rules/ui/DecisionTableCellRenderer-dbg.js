/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([],

	function() {
		"use strict";

		/**
		 * DecisionTableCellExpressionAdvanced renderer.
		 * @namespace
		 */
		var DecisionTableCellRenderer = {
				apiVersion: 2
		};
		/**
		 * Renders the HTML for the given control, using the provided
		 * {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm
		 *            the RenderManager that can be used for writing to
		 *            the Render-Output-Buffer
		 * @param {sap.rules.ui.ExpressionAdvanced} oControl
		 *            the control to be rendered
		 */
		DecisionTableCellRenderer.render = function(oRm, oControl) {

			if (!oControl.getVisible()) {
				return;
			}

			oRm.openStart("div", oControl);
			oRm.class("sapRULDecisionTableSCell");
			oRm.openEnd();
			oRm.renderControl(oControl.getAggregation("_displayedControl"));
			oRm.close("div");
		};

		return DecisionTableCellRenderer;

	}, /* bExport= */ true);