sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function(Controller) {
	"use strict";
	return Controller.extend("ManageSalesOrderWithSegButtons.reuseComponents.tableTest.view.Default", {
	
		onItemPress: function(oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();
			var oProduct = oBindingContext.getObject();
			var oComponentModel = oEvent.getSource().getModel("componentModel");
			var oExtensionAPI = oComponentModel.getProperty("/extensionApi");;
			var oNavigationController = oExtensionAPI.getNavigationController();
			var oNavigationData = {
				routeName: "to_Product"
			};
			oNavigationController.navigateInternal(oProduct.ProductID, oNavigationData);
		}
	});
});