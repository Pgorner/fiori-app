sap.ui.define(["sap/m/MessageToast", "sap/ui/core/message/Message", "sap/ui/core/Messaging"], function (MessageToast, Message, Messaging) {
	"use strict";

	return {
		message: function (oContext, aSelectedContexts) {
			var sMsgText;
			if (this.getModel("ui").getProperty("/isEditable")) {
				sMsgText = "This action can't be triggered in edit mode";
				MessageToast.show(sMsgText);
			} else if (oContext) {
				// we assume with context = OP, without context = LR
				// Object Page
				sMsgText = "Custom Header action invoked for object '" + oContext.getObject().TitleProperty;
				if (aSelectedContexts.length > 0) {
					sMsgText +=
						"' with selected context \n" +
						aSelectedContexts
							.map(function (ctx) {
								return ctx.getPath();
							})
							.join(",\n");
				}
				MessageToast.show(sMsgText);
			}
		},
		securedExecution: function (oContext, aSelectedContexts) {
			/* This action is encapsulated using the securedExecution method. This ensures the inner function is called
			   only after all previous tasks are fulfilled. By default it sets the UI to busy during execution.
			   Once the task is done, the message handler checks for any new unbound message to be shown to the user.
			   In this example updatesDocument is set to true. As a result, the draft status is updated
			   and the user has to confirm the cancellation of the editing process.
			 */

			this.editFlow.securedExecution(
				function () {
					MessageToast.show("This operation will take a few seconds");
					return new Promise(function (resolve, reject) {
						setTimeout(function () {
							// Adding an unbound message to the message handler which is shown after execution.
							// Same also works for unbound messages sent by any service call.
							Messaging.addMessages(
								new Message({
									message: "The operation was successful",
									target: "",
									persistent: true,
									type: "Success",
									code: "123"
								})
							);
							resolve();
						}, 5000);
					});
				},
				{
					updatesDocument: true
				}
			);
		},
		alertHeader: function (oContext, aSelectedContexts) {
			MessageToast.show("Triggered from header");
		},
		alertSection: function (oContext, aSelectedContexts) {
			MessageToast.show("Triggered from subsection");
		},
		alertTable: function (oContext, aSelectedContexts) {
			MessageToast.show("Triggered from table");
		},
		alertFooter: function (oContext, aSelectedContexts) {
			MessageToast.show("Triggered from footer");
		},
		alertToolbar: function (oContext, aSelectedContexts) {
			MessageToast.show("Triggered from Table Toolbar");
		}
	};
});
