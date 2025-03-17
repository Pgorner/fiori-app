sap.ui.define(
	["sap/fe/core/PageController", "sap/ui/model/json/JSONModel", "sap/fe/core/controllerextensions/Paginator"],
	function (PageController, JSONModel, Paginator) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.paginatorDefault.PaginatorDefault", {
			onRowPressed: function (oEvent) {
				var oCurrentContext = oEvent.getSource().getBindingContext();
				this.getView().bindObject(oCurrentContext.getPath());
				var oListBinding = this.getView().byId("LineItemTable").getBinding("items");
				this.paginator.initialize(oListBinding, oCurrentContext);
				this.byId("wizardNavContainer").to(this.byId("PaginatorPage"));
			},
			onNavBack: function (oEvent) {
				this.byId("wizardNavContainer").to(this.byId("mdcTablePage"));
			},
			paginator: Paginator.override({
				onContextUpdate: function (oContext) {
					var sPath = oContext.getPath();
					this.getView().bindObject(sPath);
				}
			})
		});
	}
);
