sap.ui.define(["sap/fe/core/PageController", "sap/ui/model/json/JSONModel"], function (PageController, JSONModel) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.rteDefault.Main", {
		onBeforeRendering() {
			this.getView().setModel(new JSONModel(), "custom");
			this.getView().getModel("custom").setProperty("/myHtmlValue", "<p>Hello World!</p>");
			this.getView().getModel("ui").setProperty("/isEditable", true);
			this.getView().getModel("custom").setProperty("/isReadOnly", false);
		},
		onEditModeCheckBoxSelected(oEvent) {
			this.getView().getModel("ui").setProperty("/isEditable", oEvent.getParameter("selected"));
		},
		onReadOnlyPropertyCheckBoxSelected(oEvent) {
			this.getView().getModel("custom").setProperty("/isReadOnly", oEvent.getParameter("selected"));
		}
	});
});
