sap.ui.define(["sap/fe/core/PageController", "sap/m/MessageToast"], function (PageController, MessageToast) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.customPageContent.CustomDetailPage", {
		tilePressed: function (evt) {
			MessageToast.show("Freestyle page tile pressed.");
		},
		toolbarPressed: function (evt) {
			MessageToast.show("Form Element Toolbar Button pressed.");
		}
	});
});
