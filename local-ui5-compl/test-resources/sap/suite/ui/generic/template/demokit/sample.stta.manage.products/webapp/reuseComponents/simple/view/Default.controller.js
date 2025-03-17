sap.ui.define(["sap/ui/core/mvc/Controller", "sap/suite/ui/generic/template/extensionAPI/extensionAPI"],
	function (Controller, extensionAPI) {
		"use strict";
		return Controller.extend("STTA_MP.reuseComponents.simple.view.Default", {
			//setAsTitleOwner
			SalesPriceInitialise: function (oEvent) {
				var oSmartTable = oEvent.getSource();
				var oExtensionAPIPromise = extensionAPI.getExtensionAPIPromise(oSmartTable);
				oExtensionAPIPromise.then(function (oExtensionAPI) {
					oExtensionAPI.setAsTitleOwner(oSmartTable);
				});
			}
		});
	}
);