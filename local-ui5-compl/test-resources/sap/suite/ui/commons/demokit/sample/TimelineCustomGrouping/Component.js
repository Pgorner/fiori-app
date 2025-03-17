sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.TimelineCustomGrouping.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.TimelineCustomGrouping.Timeline",
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
						"Timeline.view.xml",
						"Timeline.controller.js",
						"data.json"
					]
				}
			}
		}
	});
});
