sap.ui.define(["sap/fe/core/PageController"], function (PageController) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.tableUpload.TableUpload", {
		onInit: function () {
			PageController.prototype.onInit.apply(this);
			this.getView().getModel("ui").setProperty("/isEditable", true);
		},
		onSelectEdit: function (event) {
			this.getView().getModel("ui").setProperty("/isEditable", event.getParameter("selected"));
		}
	});
});
