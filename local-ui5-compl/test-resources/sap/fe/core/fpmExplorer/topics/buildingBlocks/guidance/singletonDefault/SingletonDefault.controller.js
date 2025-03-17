sap.ui.define(["sap/fe/core/PageController", "sap/ui/model/json/JSONModel"], function (PageController, JSONModel) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.singletonDefault.SingletonDefault", {
		onInit: function () {
			PageController.prototype.onInit.apply(this);
			var dialogModel = new JSONModel();
			this.getView().getModel("ui").setProperty("/isEditable", true);
			dialogModel.setProperty("/VHproperty", "");
			dialogModel.setProperty("/MVFproperty", []);

			this.getView().setModel(dialogModel, "dialogModel");
		}
	});
});
