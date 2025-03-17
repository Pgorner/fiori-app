/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([], function () {
	"use strict";

	/**
	 * LegendContainer renderer.
	 * @namespace
	 */
	var LegendContainerRenderer = {
		apiVersion: 2    // enable in-place DOM patching
	};

	LegendContainerRenderer.render = function(oRm, oControl) {
		oRm.openStart("div", oControl);
		oRm.class("sapGanttChartLegend");
		oRm.style("width", oControl.getWidth());
		oRm.style("height",  oControl.getHeight());
		oRm.openEnd();
		oRm.renderControl(oControl._oNavContainer);
		oRm.close("div");
	};

	return LegendContainerRenderer;
}, /* bExport= */ true);
