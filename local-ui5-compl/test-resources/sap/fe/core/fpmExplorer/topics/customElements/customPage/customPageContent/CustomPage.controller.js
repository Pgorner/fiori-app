sap.ui.define(["sap/fe/core/PageController"], function (PageController) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.customPageContent.CustomPage", {
		onInit: function () {
			//make sure to call prototype onInit before adding custom code here
			PageController.prototype.onInit.apply(this);
			//custom code added here
		},
		onPressed: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();
			this.routing.navigate(oContext);
		}
	});
});
