/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/library"
],function (library) {
	"use strict";

	var GanttChartWithTableRenderer = {
		apiVersion: 2    // enable in-place DOM patching
	};

	GanttChartWithTableRenderer.render = function (oRm, oControl) {
		// determine whether to delta update DOMs
		this.renderSplitter(oRm, oControl);
	};

	GanttChartWithTableRenderer.renderSplitter = function(oRm, oControl) {
		oRm.openStart("div", oControl);
		oRm.style("width", oControl.getWidth());
		oRm.style("height", oControl.getHeight());
		oRm.class("sapGanttChartWithSingleTable");
		if (oControl.getDisplayType() === library.simple.GanttChartWithTableDisplayType.Chart) {
			oRm.class("sapGanttChartWithTableShowOnlyChart");
		} else if (oControl.getDisplayType() === library.simple.GanttChartWithTableDisplayType.Table) {
			oRm.class("sapGanttChartWithTableShowOnlyTable");
		}
		oRm.openEnd();

		var oSplitter = oControl.getAggregation("_splitter");
		oSplitter.getContentAreas()[0].getLayoutData().setSize(oControl.getSelectionPanelSize());
		oSplitter.triggerResize(true); // recalculate Splitter sizes before rendering it
		oRm.renderControl(oSplitter);

		oRm.close("div");
	};

	return GanttChartWithTableRenderer;

}, /* bExport= */ true);
