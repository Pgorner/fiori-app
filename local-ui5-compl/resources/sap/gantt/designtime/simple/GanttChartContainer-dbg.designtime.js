/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides the Design Time Metadata for the sap.gantt.simple.GanttChartContainer class
sap.ui.define([
	"sap/gantt/changeHandlers/simple/GanttChartContainer",
	"sap/gantt/utils/GanttCustomisationUtils"],
	function(
		GanttChartContainer,
		GanttCustomisationUtils) {
	"use strict";

	return {
		actions: {
			settings: GanttCustomisationUtils.designTimeSettings.bind(null, "TXT_DT_GANTT_CHART_CONTAINER", GanttChartContainer.fnConfigureContainerSettings)
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