sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/m/Dialog",
		"sap/m/library",
		"sap/m/Text",
		"sap/m/Button",
		"sap/m/MessageToast",
		"sap/ui/core/message/MessageType",
		"sap/m/library"
	],
	function (ControllerExtension, MessageToast, MessageType) {
		"use strict";
		return ControllerExtension.extend("sap.fe.core.fpmExplorer.extendLR", {
			// this section allows to extend lifecycle hooks or override public methods of the base controller
			override: {
				onViewNeedsRefresh: function (parameters) {
					let table = this.getView()
						.byId(`sap.fe.core.fpmExplorer::sample--${parameters.currentTabId}--LineItemTable`)
						.getContent();
					let binding = table.getRowBinding();
					binding.requestRefresh(binding.getGroupId());
				}
			},
			onPressRatingUpdate: function (context, selectedContexts) {
				this.base.editFlow
					.invokeAction("Service.updateRating", {
						contexts: selectedContexts
					})
					.then(
						function () {
							this.base.getExtensionAPI().refreshTabsCount();
							this.base.getExtensionAPI().setTabContentToBeRefreshedOnNextOpening(["tab2", "tab3"]);
						}.bind(this)
					);
			},
			onPressStatusUpdate: function (context, selectedContexts) {
				this.base.editFlow
					.invokeAction("Service.updateStatus", {
						contexts: selectedContexts
					})
					.then(
						function () {
							this.base.getExtensionAPI().refreshTabsCount(["tab4", "tab5"]);
							this.base.getExtensionAPI().setTabContentToBeRefreshedOnNextOpening(["tab4", "tab5", "tab6"]);
						}.bind(this)
					);
			}
		});
	}
);
