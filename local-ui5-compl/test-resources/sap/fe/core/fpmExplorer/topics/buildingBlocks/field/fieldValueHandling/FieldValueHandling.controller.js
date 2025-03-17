sap.ui.define(["sap/fe/core/PageController", "sap/m/MessageToast"], function (PageController, MessageToast) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.fieldValueHandling.FieldValueHandling", {
		onInit: function () {
			PageController.prototype.onInit.apply(this);
			this.getView().getModel("ui").setProperty("/isEditable", true);
		},

		updateFieldValue: function () {
			this.byId("stringProperty").setValue("NewValue");
		},

		getFieldValue: function () {
			MessageToast.show(`The field value is ${this.byId("integerValue").getValue()}`);
		},

		setStringPropertyDisabled: function () {
			this.byId("stringProperty").setEnabled(false);
		},

		setStringPropertyEnabled: function () {
			this.byId("stringProperty").setEnabled(true);
		}
	});
});
