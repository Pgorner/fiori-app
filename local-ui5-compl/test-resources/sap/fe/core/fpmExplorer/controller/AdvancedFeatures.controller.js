sap.ui.define(["./BaseController", "../model/AdvancedFeaturesNavigationModel"], function (BaseController, AdvancedFeaturesNavigationModel) {
	"use strict";

	return BaseController.extend("sap.fe.core.fpmExplorer.controller.AdvancedFeatures", {
		/**
		 * Called when the controller is instantiated.
		 */
		onInit: function () {
			BaseController.prototype.onInit.call(this);
			this.getRouter().getRoute("advancedFeatures").attachMatched(this._onRouteMatched, this);
		},

		getNavigationModel: function () {
			return AdvancedFeaturesNavigationModel;
		},

		getTopicUrl: function () {
			return "sap/fe/core/fpmExplorer/topics/advancedFeatures/";
		}
	});
});
