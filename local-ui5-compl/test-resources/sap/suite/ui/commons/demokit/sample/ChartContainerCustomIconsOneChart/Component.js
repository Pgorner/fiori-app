sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.ChartContainerCustomIconsOneChart.Component", {
		metadata : {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.ChartContainerCustomIconsOneChart.ChartContainer",
				"type": "XML",
				"async": true
			},
			dependencies : {
				libs : [
					"sap.m",
					"sap.ui.core",
					"sap.suite.ui.commons"
				]
			},
			config : {
				sample : {
					files : [
						"ChartContainer.view.xml",
						"ChartContainer.controller.js",
						"ChartContainerData.json",
						"ChartContainerData1.json"
					]
				}
			}
		}
	});
});
