sap.ui.define(["./BaseController", "../model/CustomElementNavigationModel"], function (BaseController, CustomElementsNavigationModel) {
	"use strict";

	return BaseController.extend("sap.fe.core.fpmExplorer.controller.CustomElements", {
		/**
		 * Called when the controller is instantiated.
		 */
		onInit: function () {
			BaseController.prototype.onInit.call(this);
			this.getRouter().getRoute("customElements").attachMatched(this._onRouteMatched, this);
		},

		getNavigationModel: async function () {
			return CustomElementsNavigationModel.init();
		},

		getTopicUrl: function () {
			return "sap/fe/core/fpmExplorer/topics/customElements/";
		}
	});
});
