sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.gantt.sample.GanttChartTimezone.Component", {

		metadata : {
			rootView: {
				"viewName": "sap.gantt.sample.GanttChartTimezone.GanttChartTimezone",
				"type": "XML",
				"async": true
			},
			dependencies : {
				libs : [
					"sap.gantt",
					"sap.ui.table",
					"sap.m"
				]
			},
			config : {
				sample : {
					files : [
						"GanttChartTimezone.view.xml",
						"GanttChartTimezone.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
