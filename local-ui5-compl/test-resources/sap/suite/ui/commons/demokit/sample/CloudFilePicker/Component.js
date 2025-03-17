sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	// TODO what sample category, Display/Input?
	return UIComponent.extend("sap.suite.ui.commons.sample.CloudFilePicker.Component", {
		metadata: {
			rootView: "sap.suite.ui.commons.sample.CloudFilePicker.CloudFilePicker",
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
						"CloudFilePicker.view.xml",
						"CloudFilePicker.controller.js",
						"mockserver/metadata.xml",
						"mockserver/FileShares.json",
						"mockserver/FileShareItems.json"
					]
				}
			}
		},
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
		}
	});
});