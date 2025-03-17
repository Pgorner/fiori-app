sap.ui.define(["sap/fe/core/PageController", "sap/ui/model/json/JSONModel"], function (PageController, JSONModel) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.shareDefault.Share", {
		onInit: function () {
			var testModel = new JSONModel({
				showSendEmail: true
			});
			this.getView().setModel(testModel, "testModel");
		}
	});
});
