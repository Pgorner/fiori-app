sap.ui.define(
	["sap/fe/core/PageController", "sap/m/MessageToast", "sap/ui/model/json/JSONModel"],
	function (PageController, MessageToast, JSONModel) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.customDialogContent.customDialog", {
			onChartSelectionChanged: function () {
				MessageToast.show("Selection changed");
			},
			onShowDialogOneClicked: function () {
				if (!this.fragmentOne) {
					this.fragmentOne = this.getExtensionAPI().loadFragment({
						id: "fragmentOne",
						name: "sap.fe.core.fpmExplorer.customDialogContent.DialogOne",
						controller: this
					});
				}
				this.fragmentOne.then(function (dialog) {
					dialog.open();
				});
			},
			onShowDialogTwoClicked: function () {
				if (!this.fragmentTwo) {
					this.fragmentTwo = this.getExtensionAPI().loadFragment({
						id: "fragmentTwo",
						name: "sap.fe.core.fpmExplorer.customDialogContent.DialogTwo",
						controller: this
					});
				}
				this.fragmentTwo.then(function (dialog) {
					dialog.open();
				});
			},
			onShowDialogThreeClicked: function () {
				const view = this.getView();
				const salesOrderNumber = view.byId("salesOrderNumber").getProperty("selectedKey");

				this.fragmentThree = this.getExtensionAPI()
					.loadFragment({
						id: "fragmentThree",
						name: "sap.fe.core.fpmExplorer.customDialogContent.DialogThree",
						controller: this
					})
					.then(function (dialog) {
						dialog.attachEventOnce("afterClose", function () {
							dialog.destroy();
						});
						// set form bindingContext
						dialog
							.getAggregation("content")[0]
							.getAggregation("items")[0]
							.bindContext({ path: `/RootEntity('${salesOrderNumber}')` });

						dialog.open();
					});
			},
			closeDialog: function (closeBtn) {
				closeBtn.getSource().getParent().close();
			}
		});
	}
);
