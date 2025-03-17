sap.ui.define([
   'test/sap/ui/comp/smartfield/SmartFieldTypes/controller/BaseController'
], function(BaseController) {
	"use strict";

	return BaseController.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.controller.PageListItem", {
		onInit: function () {
			var oRouter = this.getRouter();

			oRouter.getRoute("pageListItem").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched : function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");

			this.getRouter().getTargets().display(oArgs.pageId);
		}
	});
});