sap.ui.define(
	["./BaseController", "../model/ControllerExtensionNavigationModel"],
	function (BaseController, ControllerExtensionNavigationModel) {
		"use strict";

		return BaseController.extend("sap.fe.core.fpmExplorer.controller.ControllerExtensions", {
			/**
			 * Called when the controller is instantiated.
			 */
			onInit: function () {
				BaseController.prototype.onInit.call(this);
				this.getRouter().getRoute("controllerExtensions").attachMatched(this._onRouteMatched, this);
			},

			getNavigationModel: function () {
				return ControllerExtensionNavigationModel;
			},

			getTopicUrl: function () {
				return "sap/fe/core/fpmExplorer/topics/controllerExtensions/";
			}
		});
	}
);
