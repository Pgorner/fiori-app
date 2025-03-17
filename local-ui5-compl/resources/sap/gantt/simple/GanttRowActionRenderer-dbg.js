/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
//Provides default renderer for control sap.ui.table.RowAction
sap.ui.define(['sap/ui/table/Row'],
	function(Row) {
	"use strict";
	/**
	 * RowAction renderer.
	 * @namespace
	 */
	var GanttRowActionRenderer = {};
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oAction an object representation of the control that should be rendered
	 */
	GanttRowActionRenderer.render = function (rm, oAction) {
		rm.openStart("div", oAction);
		rm.class("sapUiGanttTableAction");
		rm.style("height", "100%");
		rm.style("width", "100%");
		if (!(oAction.getParent() instanceof Row)) {
			rm.style("display", "none");
		}
		if (!oAction.getVisible()) {
			rm.class("sapUiTableActionHidden");
		}
		rm.openEnd();
		var oControl = oAction.getAggregation("controlTemplate");
		rm.renderControl(oControl);
		rm.close("div");
	};
	return GanttRowActionRenderer;
}, /* bExport= */ true);