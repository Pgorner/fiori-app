sap.ui.define(["./BaseController", "../model/MacroNavigationModel"], function (BaseController, MacroNavigationModel) {
	"use strict";

	return BaseController.extend("sap.fe.core.fpmExplorer.controller.MacrosPage", {
		/**
		 * Called when the controller is instantiated.
		 */
		onInit: function () {
			BaseController.prototype.onInit.call(this);
			this.getRouter().getRoute("buildingBlocks").attachMatched(this._onRouteMatched, this);
		},

		getNavigationModel: async function () {
			return MacroNavigationModel.init();
		},

		getTopicUrl: function () {
			return "sap/fe/core/fpmExplorer/topics/buildingBlocks/";
		}
	});
});
