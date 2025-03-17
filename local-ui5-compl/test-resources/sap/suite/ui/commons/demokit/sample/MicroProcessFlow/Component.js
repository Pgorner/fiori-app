sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.MicroProcessFlow.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.MicroProcessFlow.MicroProcessFlow",
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
					files: [
						"MicroProcessFlow.view.xml",
						"MicroProcessFlow.controller.js"
					]
				}
			}
		}
	});
});
