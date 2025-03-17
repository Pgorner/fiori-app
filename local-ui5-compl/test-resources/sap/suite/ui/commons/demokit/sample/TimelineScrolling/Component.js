sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.TimelineScrolling.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.TimelineScrolling.Timeline",
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
					scrollX: true,
					files: [
						"Timeline.view.xml",
						"Timeline.controller.js"
					]
				}
			}
		}
	});
});
