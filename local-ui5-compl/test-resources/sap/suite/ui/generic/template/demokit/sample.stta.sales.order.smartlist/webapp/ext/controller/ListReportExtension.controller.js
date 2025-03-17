sap.ui.define("SalesOrderSmartList.ext.controller.ListReportExtension", [],
	function () {
		"use strict";
		return {
			onListNavigationExtension: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				var oObject = oBindingContext.getObject();
				if (oObject.SalesOrder === "500000008") {
					// for  SalesOrder 500000008,  we trigger external navigation
					var oNavigationController = this.extensionAPI.getNavigationController();
					oNavigationController.navigateExternal("SalesOrderWD");
					return true;
				}
				return false;
			}
		};
	}
);
