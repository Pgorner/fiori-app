sap.ui.define("STTA_MP.ext.controller.ListReportInternalNavigationExtension", [],
	function () {
	"use strict";
	return {	
		onListNavigationExtension: function(oEvent) {
			var oNavigationController = this.extensionAPI.getNavigationController();
			var oBindingContext = oEvent.getSource().getBindingContext();

            var oModel = oBindingContext.getModel();
			oModel.createBindingContext("to_ProductTextInOriginalLang", oBindingContext, {}, function (oTarget) {
                oNavigationController.navigateInternal(oTarget);
			});
			// return true is necessary to prevent further default navigation
			return true;
		},
        onChildOpenedExtension: function(oSelectionInfo, fnSetPath) {
            var oModel = this.getView().getModel();
			oModel.createBindingContext(oSelectionInfo.path + "/to_Product", null, null, function(oContext) { 
				fnSetPath(oContext.getPath());
			});
        }
	};
});
