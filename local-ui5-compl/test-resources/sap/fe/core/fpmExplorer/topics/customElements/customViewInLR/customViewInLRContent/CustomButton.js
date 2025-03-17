sap.ui.define(["sap/ui/core/Component", "sap/m/MessageBox"], function (Component, MessageBox) {
	"use strict";

	return {
		someHandler: function (oEvent) {
			// Do something here
		},
		onPress(oEvent) {
			MessageBox.show("You pressed the custom action");
		}
	};
});
