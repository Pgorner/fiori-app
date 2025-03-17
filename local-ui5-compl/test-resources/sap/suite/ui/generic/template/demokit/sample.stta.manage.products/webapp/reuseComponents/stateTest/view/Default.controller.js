sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var oController = Controller.extend("STTA_MP.reuseComponents.stateTest.view.Default", {
		stateChanged: function () {
			var oComponentModel = this.getView().getModel("component");
			var oExtensionAPI = oComponentModel.getProperty("/api");
			oExtensionAPI.onCustomStateChange();
		}
	});
	return oController;
});
