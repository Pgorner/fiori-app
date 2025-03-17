sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.ChartContainerDimensionsMultiCharts.Component", {
		metadata : {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.ChartContainerDimensionsMultiCharts.ChartContainer",
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
						"ChartContainerData1.json",
						"ChartContainerData2.json",
						"ChartContainerData3.json"
					]
				}
			}
		}
	});
});
