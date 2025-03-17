sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfield.SmartFieldWithCompositeKeys.Main", {
		changeSF: function (oEvent) {
			this.getView().getModel().attachRequestSent(this.onRequestSent, this);
		},
		onRequestSent: function(oEvent){
			var oTextArea = this.byId("request");
			oTextArea.setValue(decodeURIComponent(oEvent.mParameters.url));
		}
	});
});
