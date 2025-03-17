sap.ui.define("ManageSalesOrderWithSegButtons.ext.controller.ListReportExtension", [	
], function () {
	"use strict";

	return {
		onEnableWithExt: function () {
			this.extensionAPI.invokeActions("STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Setenabledstatus", this.extensionAPI.getSelectedContexts());
		},
		onDisableWithExt: function () {
			this.extensionAPI.invokeActions("STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Setdisabledstatus", this.extensionAPI.getSelectedContexts());
		},
		adaptNavigationParameterExtension: function(oSelectionVariant, oObjectInfo) {
			if (oObjectInfo.semanticObject === "SalesOrder" && oObjectInfo.action === "MultiViews")  {
				oSelectionVariant.addParameter("SalesOrderType", "Master");
			} 
		},
		onItemsSelected: function () {
			var oApi = this.extensionAPI;
			var oNavigationController = oApi.getNavigationController();
			var aItemContexts = oApi.getSelectedContexts();
			var aSalesOrderIds = aItemContexts.map(function (oItemContext) {
				return oItemContext.getObject().SalesOrder;
			});
			var sKeys = aSalesOrderIds.join(",");
			oNavigationController.navigateInternal(sKeys || "None", { routeName: "SalesOrderListInfo" });
		}
	};
});