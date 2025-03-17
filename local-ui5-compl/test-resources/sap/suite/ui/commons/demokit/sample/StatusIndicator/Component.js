sap.ui.define(['sap/ui/core/UIComponent'], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.StatusIndicator.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.StatusIndicator.App",
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
				stretch: true,
				sample: {
					files: [
						"App.view.xml",
						"App.controller.js"
					]
				}
			}
		}
	});

}, true);
