sap.ui.define([
	"sap/m/Image",
	"sap/ui/core/mvc/View",
	"require"
], function(Image, View, require) {
	"use strict";

	return View.extend("sap.collaboration.sample.FeedDialogComponent.View", {
		createContent: function(oController) {
			return new Image({
				"src": require.toUrl("./discuss_dialog_screenshot.png")
			});
		}
	});
});
