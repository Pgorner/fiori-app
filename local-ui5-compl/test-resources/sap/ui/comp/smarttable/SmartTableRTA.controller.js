sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Lib"
], function(
	Controller, Library
) {
	"use strict";

	function enableRta(oRoot) {
		Library.load({name: "sap/ui/rta"}).then(function () {
			sap.ui.require(["sap/ui/rta/api/startKeyUserAdaptation"], function (startKeyUserAdaptation) {
				startKeyUserAdaptation({
					rootControl: oRoot
				});
			});
		});
	}

	return Controller.extend("test.sap.ui.comp.smarttable.SmartTableRTA", {
		onInit: function() {
		},

		startRTA: function() {
			enableRta(this.getView());
		},

		recreateToolbar: function() {
			this.getView().byId("smarttable")._createToolbarContent();
		}
	});
});
