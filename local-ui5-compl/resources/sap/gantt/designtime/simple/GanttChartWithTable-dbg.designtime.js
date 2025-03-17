/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides the Design Time Metadata for the sap.gantt.simple.GanttChartWithTable class
sap.ui.define([
	"sap/gantt/changeHandlers/simple/GanttChartWithTable",
	"sap/gantt/utils/GanttCustomisationUtils"],
	function(
		GanttChartWithTable,
		GanttCustomisationUtils) {
	"use strict";

	return {
		actions: {
			remove: {
				changeType: "hideControl",
				isEnabled: true
			},
			reveal: {
				changeType: "unhideControl",
				isEnabled: true
			},
			settings: GanttCustomisationUtils.designTimeSettings.bind(null, "TXT_DT_GANTT_CHART_WITH_TABLE", GanttChartWithTable.fnConfigureContainerSettings)
        },
		tool: {
			start: function(oControl) {
				oControl.setProperty("_isAppRunningInRTA", true);
			},
			stop: function(oControl) {
				oControl.setProperty("_isAppRunningInRTA", false);
			}
		}
	};
});
