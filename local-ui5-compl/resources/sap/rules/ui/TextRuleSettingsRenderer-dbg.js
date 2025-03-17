/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([],

	function() {
		"use strict";

		/**
		 * TextRuleSettings renderer.
		 *  @namespace
		 */
		var oTextRuleSettingsRenderer = {
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
		oTextRuleSettingsRenderer.render = function(oRm, oControl) {

			oRm.openStart("div", oControl);
			oRm.class("sapRULTDecisionTableSettings");
			oRm.openEnd();
			var settings = oControl.getAggregation("mainLayout");
			oRm.renderControl(settings);
			oRm.close("div");

		};

		return oTextRuleSettingsRenderer;

	}, /* bExport= */ true);