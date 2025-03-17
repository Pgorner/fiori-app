sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	// TODO what sample category, Display/Input?
	return UIComponent.extend("sap.suite.ui.commons.sample.ImageEditorContainerDialog.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.commons.sample.ImageEditorContainerDialog.ImageEditorContainer",
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
						"ImageEditorContainer.view.xml",
						"ImageEditorContainer.controller.js"
					]
				}
			}
		}
	});
});
