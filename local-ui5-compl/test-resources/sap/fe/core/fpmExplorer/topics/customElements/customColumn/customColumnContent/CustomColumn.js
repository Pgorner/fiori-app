sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
	"use strict";
	return {
		buttonPressed: function (oEvent) {
			MessageToast.show("Button pressed for item " + oEvent.getSource().getBindingContext().getObject().ID);
		},
		onSelectionChange: function (oEvent) {
			MessageToast.show(
				"Segmented button item '" +
					oEvent.getParameter("item").getText() +
					"' selected for item " +
					oEvent.getSource().getBindingContext().getObject().ID
			);
		}
	};
});
