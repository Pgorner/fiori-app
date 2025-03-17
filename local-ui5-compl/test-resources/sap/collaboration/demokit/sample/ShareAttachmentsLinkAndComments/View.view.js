sap.ui.define([
	"sap/m/Button",
	"sap/ui/core/mvc/View"
], function(Button, View) {
	"use strict";

	return View.extend("sap.collaboration.sample.ShareAttachmentsLinkAndComments.View", {
		getControllerName: function() {
			return "sap.collaboration.sample.ShareAttachmentsLinkAndComments.Controller";
		},
		createContent: function(oController) {
			return new Button({
				id: this.createId("btnShare"),
				text: "Share Attachments, Link and Comments",
				enabled: false, // will be enabled after share component has been instantiated
				press: [oController.onPress, oController]
			});
		}
	});
});
