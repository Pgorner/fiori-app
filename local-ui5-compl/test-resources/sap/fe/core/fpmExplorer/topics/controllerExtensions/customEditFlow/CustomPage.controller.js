sap.ui.define(["sap/fe/core/PageController", "sap/fe/core/controllerextensions/EditFlow"], function (PageController, EditFlow) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.customEditFlow.CustomPage", {
		onSelectionChange: function (oEvent) {
			const currentContext = oEvent.getParameter("bindingContext") ?? oEvent.getSource().getSelectedContexts()[0];
			if (currentContext && currentContext.getObject("IsActiveEntity") === false) {
				this.getView().getModel("ui").setProperty("/isEditable", true);
			} else {
				this.getView().getModel("ui").setProperty("/isEditable", false);
			}
			const model = currentContext.getModel();
			const contextBinding = model.bindContext(currentContext.getPath());
			const targetContext = contextBinding.getBoundContext();

			this.getView().setBindingContext(targetContext);
		},
		onEditPressed: async function () {
			const targetContext = await this.editFlow.editDocument(this.getView().getBindingContext());
			this.getView().setBindingContext(targetContext);
			this.getExtensionAPI().byId("rootEntityTable").refresh();
		},
		onSavePressed: async function () {
			await this.editFlow.saveDocument(this.getView().getBindingContext());
			this.getExtensionAPI().byId("rootEntityTable").refresh();
		},
		onCancelPressed: async function (oEvent) {
			await this.editFlow.cancelDocument(this.getView().getBindingContext(), { cancelButton: oEvent.getSource() });
			this.getExtensionAPI().byId("rootEntityTable").refresh();
		}
	});
});
