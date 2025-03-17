sap.ui.define([
	"sap/m/Button",
	"sap/ui/core/mvc/View"
], function(Button, View) {
	"use strict";

	return View.extend("sap.collaboration.sample.ShareLinkAndComments.View", {
		getControllerName: function() {
			return "sap.collaboration.sample.ShareLinkAndComments.Controller";
		},
		createContent: function(oController) {
			return new Button({
				id: this.createId("btnShare"),
				text: "Share Link and Comments",
				enabled: false, // will be enabled after share component has been instantiated
				press: [oController.onPress, oController]
			});
		}
	});
});
