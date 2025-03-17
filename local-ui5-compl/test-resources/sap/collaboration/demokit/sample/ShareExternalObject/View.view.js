sap.ui.define([
	"sap/m/Button",
	"sap/ui/core/mvc/View"
], function(Button, View) {
	"use strict";

	return View.extend("sap.collaboration.sample.ShareExternalObject.View", {
		getControllerName: function() {
			return "sap.collaboration.sample.ShareExternalObject.Controller";
		},
		createContent: function(oController) {
			return new Button({
				id: this.createId("btnShare"),
				text: "Share External Object",
				enabled: false, // will be enabled after share component has been instantiated
				press: [oController.onPress, oController]
			});
		}
	});
});