sap.ui.define("STTA_MP.ext.controller.DetailsInternalNavigationExtension", [],
	function () {
	"use strict";

	return {
		onListNavigationExtension: function(oEvent) {
			var oNavigationController = this.extensionAPI.getNavigationController();
			var oBindingContext = oEvent.getSource().getBindingContext();
			var oObject = oBindingContext.getObject();

            var oModel = oBindingContext.getModel();
			oModel.createBindingContext("to_ProductTextInOriginalLang", oBindingContext, {}, function (oTarget) {
                oNavigationController.navigateInternal(oTarget || oBindingContext);
			});
			// return true is necessary to prevent further default navigation
			return true;
		},
		onChildOpenedExtension: function(oSelectionInfo, fnSetPath) {
			var sPath = "/STTA_C_MP_ProductText(" + oSelectionInfo.keys[2] + ")";
			fnSetPath(sPath);
        }
	};
});
