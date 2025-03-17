sap.ui.define("SalesOrderSmartList.ext.controller.ListReportInternalNavigationExtension", [],
	function () {
		"use strict";
		return {
			onListNavigationExtension: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				var oExtensionAPI = this.extensionAPI;
				var fnNavigate = function () {
					return new Promise(function (fnResolve) {
						var oModel = oBindingContext.getModel();
						oModel.createBindingContext("to_BusinessPartner", oBindingContext, {}, function (oTarget) {
							var oNavigationController = oExtensionAPI.getNavigationController();
							oNavigationController.navigateInternal(oTarget);
							fnResolve();
						});
					});
				};
				oExtensionAPI.securedExecution(fnNavigate);
				return true;
			},
			onChildOpenedExtension: function (oSelectionInfo, fnSetPath) {
				var oModel = this.getView().getModel();
				oModel.createBindingContext(oSelectionInfo.path + "/to_SalesOrder", null, null, function (oContext) {
					fnSetPath(oContext.getPath());
				});
			}
		};
	});
