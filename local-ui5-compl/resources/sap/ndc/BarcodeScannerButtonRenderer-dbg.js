/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define([],
	function() {
	"use strict";


	/**
	 * BarcodeScannerButton renderer.
	 * @namespace
	 */
	var BarcodeScannerButtonRenderer = {
		apiVersion: 2
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ndc.BarcodeScannerButton}
	 *            oControl an object representation of the control that should be rendered
	 */
	BarcodeScannerButtonRenderer.render = function(oRm, oControl) {

		oControl._setTooltip();
		//we need this additional wrapping element to be able to control this button from our controller.
		oRm.openStart("span", oControl);
		// we need to change the containing span tag's width instead of the button
		oRm.style("display", "inline-block");
		oRm.style("width", oControl.getWidth());
		oRm.openEnd();
		oRm.renderControl(oControl.getAggregation("_btn"));
		oRm.close("span");
	};


	return BarcodeScannerButtonRenderer;

}, /* bExport= */ true);