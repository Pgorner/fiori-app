sap.ui.define(["sap/fe/core/PageController", "sap/ui/model/json/JSONModel"], function (PageController, JSONModel) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.multiValueField.MultiValueField", {
		onInit: function () {
			PageController.prototype.onInit.apply(this);
			this.getView().getModel("ui").setProperty("/isEditable", true);
			var jsonModel = new JSONModel();
			this.getView().setModel(jsonModel, "jsonModel");
			this.getView()
				.getModel("jsonModel")
				.setProperty("/Students", [
					{ ID: "1", name: "John" },
					{ ID: "2", name: "Garfield" }
				]);
		},
		onSelect: function (event) {
			this.getView().getModel("ui").setProperty("/isEditable", event.getParameter("selected"));
		}
	});
});
