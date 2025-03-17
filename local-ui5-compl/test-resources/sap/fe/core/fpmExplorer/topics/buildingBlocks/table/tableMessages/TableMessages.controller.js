sap.ui.define(["sap/fe/core/PageController", "sap/ui/core/message/MessageType"], function (PageController, MessageType) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.tableMessages.TableMessages", {
		onInit: function () {
			PageController.prototype.onInit.apply(this);
			this.getView().getModel("ui").setProperty("/isEditable", true);
		},
		onAddMessage() {
			var oTable = this.byId("LineItemTableRowPress");

			var myparameters = {
				type: MessageType.Error,
				message: "This is an error message"
			};
			if (this.addMessage === undefined) {
				this.addMessage = [];
			}

			this.addMessage.push(oTable.addMessage(myparameters));
		},

		onRemoveAll() {
			var oTable = this.byId("LineItemTableRowPress");

			this.addMessage.forEach((element) => oTable.removeMessage(element));
			this.addMessage = [];
		}
	});
});
