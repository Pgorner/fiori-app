/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([], function () {
	"use strict";

	/**
	 * GanttSearchPanel renderer.
	 * @namespace
	 */
	var GanttSearchPanelRenderer = {
		apiVersion: 2    // enable in-place DOM patching
	};

	GanttSearchPanelRenderer.render = function(oRm, oControl) {
		oRm.openStart("div", oControl);
		oRm.style("height", "auto");
		oRm.openEnd();
		oRm.renderControl(oControl._oSearchSidePanel);
		oRm.close("div");
	};

	return GanttSearchPanelRenderer;
}, /* bExport= */ true);
