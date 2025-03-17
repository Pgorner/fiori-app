sap.ui.define(['sap/ui/core/UIComponent'], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.StatusIndicatorShapesLibrary.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.StatusIndicatorShapesLibrary.App",
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
						"App.controller.js",
						"Popover.fragment.xml"
					]
				}
			}
		}
	});

}, true);
