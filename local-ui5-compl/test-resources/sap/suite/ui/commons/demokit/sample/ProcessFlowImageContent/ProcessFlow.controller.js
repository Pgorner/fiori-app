sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/ui/core/Fragment'
], function(jQuery, Controller, JSONModel, MessageToast, Fragment) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.sample.ProcessFlowImageContent.ProcessFlow", {
		onInit: function () {
			var sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlowImageContent/ProcessFlowNodes.json");
			var oModel = new JSONModel(sDataPath);
			this.getView().setModel(oModel);

			this.oProcessFlow = this.getView().byId("processflow");
			this.oProcessFlow.updateModel();
		},

		onZoomIn: function () {
			this.oProcessFlow.zoomIn();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
		},

		onZoomOut: function () {
			this.oProcessFlow.zoomOut();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
		},

		onNodePress: function(oEvent) {
			var oNode = oEvent.getParameters();
			var sPath = oNode.getBindingContext().getPath() + "/quickView";

			if (!this.oQuickView) {
				Fragment.load({
					name: "sap.suite.ui.commons.sample.ProcessFlowImageContent.QuickView",
					type: "XML"
				}).then(function(oFragment) {
					this.oQuickView = oFragment;
					this.getView().addDependent(this.oQuickView);

					this.oQuickView.bindElement(sPath);
					this.oQuickView.openBy(oNode);
				}.bind(this));
			} else {
				this.oQuickView.bindElement(sPath);
				this.oQuickView.openBy(oNode);
			}
		},

		onExit: function () {
			if (this.oQuickView) {
				this.oQuickView.destroy();
			}
		}
	});
});
