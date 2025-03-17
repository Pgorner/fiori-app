/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([],

	function() {
		"use strict";

		/**
		 * DecisionTableSettings renderer.
		 *  @namespace
		 */
		var DecisionTableSettingsRenderer = {
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
		DecisionTableSettingsRenderer.render = function(oRm, oControl) {

			oRm.openStart("div", oControl);
			oRm.class("sapRULTDecisionTableSettings");
			oRm.openEnd();
			var settings = oControl.getAggregation("mainLayout");
			oRm.renderControl(settings);
			oRm.close("div");
		};

		return DecisionTableSettingsRenderer;

	}, /* bExport= */ true);