/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(['sap/ui/core/theming/Parameters', 'sap/gantt/misc/Utility', "sap/gantt/utils/GanttChartConfigurationUtils"], function (Parameters, Utility, GanttChartConfigurationUtils) {
	"use strict";

	/**
	 * Gantt Chart with table renderer.
	 *
	 * @namespace
	 */
	var GanttChartWithTableRenderer = {};

	GanttChartWithTableRenderer.render = function (oRenderManager, oGanttChartWithTable) {
		oRenderManager.write("<div");
		oRenderManager.writeControlData(oGanttChartWithTable);
		//oRenderManager.addClass("sapUiTableHScr");  //force horizontal scroll bar to show
		oRenderManager.addClass("sapGanttChartWithTable");
		oRenderManager.writeClasses();
		oRenderManager.addStyle("width", oGanttChartWithTable.getWidth());
		oRenderManager.addStyle("height", oGanttChartWithTable.getHeight());
		oRenderManager.writeStyles();
		oRenderManager.write(">");

		this._setTableColumnHeaderHeight(oGanttChartWithTable);
		oRenderManager.renderControl(oGanttChartWithTable._oSplitter);
		oRenderManager.write("</div>");

	};

	GanttChartWithTableRenderer._setTableColumnHeaderHeight = function(oGanttChartWithTable) {

		var bHasNoLocalToolbar = oGanttChartWithTable._oToolbar.getAllToolbarItems().length === 0;
		if (bHasNoLocalToolbar) {
			var sMode = Utility.findSapUiSizeClass(),
				bHcbTheme = GanttChartConfigurationUtils.getTheme().endsWith("hcb"),
				iHeight = 0,
				iPaddingTop = bHcbTheme ? 4 : 2;
			if (sMode === "sapUiSizeCozy") {
				iHeight = parseInt(Parameters.get("_sap_gantt_Gantt_HeaderHeight")) - iPaddingTop;
			} else {
				iHeight = parseInt(Parameters.get("_sap_gantt_Gantt_CompactHeaderHeight")) - iPaddingTop;
			}
			oGanttChartWithTable._oTT.setColumnHeaderHeight(iHeight);
		}
	};

	return GanttChartWithTableRenderer;
}, /* bExport= */ true);
