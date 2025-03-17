sap.ui.define(
	["./BaseController", "sap/fe/core/internal/fpmExplorer/model/InternalExperimentsModel"],
	function (BaseController, InternalExperimentsModel) {
		"use strict";

		return BaseController.extend("sap.fe.core.fpmExplorer.controller.InternalExperiments", {
			/**
			 * Called when the controller is instantiated.
			 */
			onInit: function () {
				BaseController.prototype.onInit.call(this);
				this.getRouter().getRoute("internalExperiments").attachMatched(this._onRouteMatched, this);
			},

			getNavigationModel: async function () {
				// eslint-disable-next-line @typescript-eslint/return-await
				return await InternalExperimentsModel.init();
			},

			getTopicUrl: function () {
				return "sap/fe/core/internal/fpmExplorer/topics/internalExperiments/";
			}
		});
	}
);
