/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/syncStyleClass"
],  function(jQuery, syncStyleClass) {
		"use strict";

	/**
	 * OdataTextRuleTable renderer.
	 * @namespace
	 */
	var oTextRuleRenderer = {
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
    oTextRuleRenderer.render = function(oRm, oControl) {

		if (oControl.getParent() instanceof jQuery){
			syncStyleClass("sapUiSizeCozy", oControl.getParent(), this.oControl);
		}

		oRm.openStart("div", oControl);
		oRm.class("sapRULTextRule");
		oRm.openEnd();
		oRm.renderControl(oControl.getAggregation("_toolbar"));
		oRm.renderControl(oControl.getAggregation("_verticalLayout"));
		oRm.close("div");

	};

	return oTextRuleRenderer;

}, /* bExport= */ true);