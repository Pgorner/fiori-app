sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var oController = Controller.extend("ManageSalesOrderWithSegButtons.implementingComponents.salesOrderListInfo.view.Default", {
		onInit: function () {
			var oComponent = this.getOwnerComponent();
			var oComponentModel = oComponent.getComponentModel();
			oComponentModel.setProperty("/View", this.getView());
		},
		getNavigationController: function () {
			var oComponent = this.getOwnerComponent();
			var oComponentModel = oComponent.getComponentModel();
			var oExtensionAPI = oComponentModel.getProperty("/extensionAPI");
			var oNavigationController = oExtensionAPI.getNavigationController();
			return oNavigationController;
		},
		getSelectedSalesOrders: function () {
			var oComponent = this.getOwnerComponent();
			var oComponentModel = oComponent.getComponentModel();
			var aSalesOrderIds = oComponentModel.getProperty("/SalesOrderIdArray");
			return aSalesOrderIds;
		},
		navigateToFirstSalesOrder: function () {
			var aSelectedSalesOrderIds = this.getSelectedSalesOrders();
			var sFirstSalesOrderId = aSelectedSalesOrderIds[0];
			var oNavigationData = {
				routeName: "SalesOrderListInfo",
				isAbsolute: true
			};
			var oNavigationController = this.getNavigationController();
			oNavigationController.navigateInternal(sFirstSalesOrderId, oNavigationData);
		},
		navigateToLastSalesOrder: function () {
			var aSelectedSalesOrderIds = this.getSelectedSalesOrders();
			var sLastSalesOrderId = aSelectedSalesOrderIds[aSelectedSalesOrderIds.length - 1];
			var oNavigationData = {
				routeName: "SalesOrderListInfo",
				isAbsolute: true
			};
			var oNavigationController = this.getNavigationController();
			oNavigationController.navigateInternal(sLastSalesOrderId, oNavigationData);
		}
	});
	return oController;
});