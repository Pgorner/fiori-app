sap.ui.define(
	["sap/fe/core/PageController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
	function (PageController, JSONModel, MessageToast) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.fieldEvents.FieldEvents", {
			onInit: function () {
				PageController.prototype.onInit.apply(this);
				this.getView().getModel("ui").setProperty("/isEditable", true);
			},

			onFieldChange: function (oEvent) {
				MessageToast.show(`The field value is ${oEvent.getParameter("value")}`);
				this.uiModel.setProperty("/currentValue", oEvent.getParameter("value"));
			},

			getFieldValue: function () {
				MessageToast.show(`The field value is ${this.byId("StringProperty").getValue()}`);
			}
		});
	}
);
