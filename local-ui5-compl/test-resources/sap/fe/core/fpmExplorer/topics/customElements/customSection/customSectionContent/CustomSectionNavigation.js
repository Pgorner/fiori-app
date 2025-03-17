sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
	"use strict";

	return {
		onPress: function (oEvent) {
			var oItem = oEvent.getParameter("listItem"),
				oContext = oItem.getBindingContext();
			this.routing.navigate(oContext);
		},
		onChange: function () {
			MessageToast.show("You changed the value for the date picker");
		}
	};
});
