sap.ui.define(
	["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageToast", "sap/ui/core/message/Message", "sap/ui/core/message/MessageType"],
	function (ControllerExtension, MessageToast, Message, MessageType) {
		"use strict";
		return ControllerExtension.extend("sap.fe.core.fpmExplorer.extendOP", {
			// this section allows to extend lifecycle hooks or override public methods of the base controller
			override: {
				routing: {
					onBeforeBinding: function (oBindingContext, mParameters) {
						MessageToast.show("onBeforeBinding: Context about to be bound");
					},
					onAfterBinding: function (oBindingContext, mParameters) {
						var extensionAPI = this.base.getExtensionAPI(),
							messages = [
								new Message({
									message: "onAfterBinding: Context bound",
									type: MessageType.Information
								})
							];
						extensionAPI.showMessages(messages);
					}
				}
			}
		});
	}
);
