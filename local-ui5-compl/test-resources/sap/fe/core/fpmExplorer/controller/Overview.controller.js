sap.ui.define(["./BaseController", "../model/OverviewNavigationModel"], function (BaseController, OverviewNavigationModel) {
	"use strict";

	return BaseController.extend("sap.fe.core.fpmExplorer.controller.Overview", {
		/**
		 * Called when the controller is instantiated.
		 */
		onInit: function () {
			BaseController.prototype.onInit.call(this);
			this.getRouter().getRoute("overview").attachMatched(this._onTopicMatched, this);
		},

		getNavigationModel: function () {
			return OverviewNavigationModel;
		},

		getTopicUrl: function () {
			return "sap/fe/core/fpmExplorer/topics/overview/";
		}
	});
});
