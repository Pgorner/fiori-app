sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	"sap/ui/rta/api/startKeyUserAdaptation"
], function(
	Controller,
	ODataModel,
	startKeyUserAdaptation
) {
	"use strict";

	var oController = Controller.extend("view.Main", {

		onInit: function() {
			// create and set ODATA Model
			this.oModel = new ODataModel("/mockserver");
			this.getView().setModel(this.oModel);
		},

		onPressRTA: function() {
			startKeyUserAdaptation({
				rootControl: this.getOwnerComponent().getAggregation("rootControl")
			});
		},

		onExit: function() {
			this.oModel.destroy();
		}
	});

	return oController;
});
