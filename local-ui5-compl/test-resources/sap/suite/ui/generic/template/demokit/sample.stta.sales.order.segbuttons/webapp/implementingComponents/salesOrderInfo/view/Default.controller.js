sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var oController = Controller.extend("ManageSalesOrderWithSegButtons.implementingComponents.salesOrderInfo.view.Default", {
		onInit: function () {
			var oComponent = this.getOwnerComponent();
			var oComponentModel = oComponent.getComponentModel();
			oComponentModel.setProperty("/View", this.getView());
		}
	});
	return oController;
});
