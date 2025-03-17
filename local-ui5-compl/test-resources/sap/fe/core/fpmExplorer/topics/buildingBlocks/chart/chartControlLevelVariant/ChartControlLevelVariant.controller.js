sap.ui.define(["sap/fe/core/PageController", "sap/m/MessageToast"], function (PageController, MessageToast) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.chartControlLevelVariant.chartControlLevelVariant", {
		handlers: {
			onVariantSaved: function () {
				MessageToast.show("Variant Saved");
			},

			onVariantSelected: function (oEvent) {
				MessageToast.show("Variant Selected");
			}
		}
	});
});
