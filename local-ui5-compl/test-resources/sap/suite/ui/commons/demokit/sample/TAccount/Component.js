sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.TAccount.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.TAccount.TAccount",
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
						"TAccount.view.xml",
						"TAccount.controller.js",
						"data.json"
					]
				}
			}
		}
	});
});
