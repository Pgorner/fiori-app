sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.NetworkGraphBidirectionalCollapsing.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.NetworkGraphBidirectionalCollapsing.NetworkGraph",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.commons"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"NetworkGraph.view.xml",
						"NetworkGraph.controller.js",
						"graph.json"
					]
				}
			}
		}
	});
});
