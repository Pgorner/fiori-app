sap.ui.define(["sap/fe/core/PageController", "sap/ui/core/message/MessageType"], function (PageController, MessageType) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.fieldMessages.FieldMessages", {
		onInit: function () {
			PageController.prototype.onInit.apply(this);
			this.getView().getModel("ui").setProperty("/isEditable", true);
		},
		onAddMessage() {
			var oControl = this.byId("StringProperty");
			var myparameters = {
				type: MessageType.Error,
				message: "This is an error message"
			};

			if (this.addMessage === undefined) {
				this.addMessage = [];
			}

			this.addMessage.push(oControl.addMessage(myparameters));
		},
		onRemoveAll() {
			var oControl = this.byId("StringProperty");

			this.addMessage.forEach((element) => oControl.removeMessage(element));
			this.addMessage = [];
		}
	});
});
