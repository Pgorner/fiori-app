sap.ui.define([
	"sap/m/Button",
	"sap/m/SelectDialog",
	"sap/m/StandardListItem",
	"sap/ui/Device"
], function(
	Button,
	SelectDialog,
	StandardListItem,
	Device
) {
	sap.ui.jsview("sap.apf.demokit.app.controls.view.reportingCurrency", {
		getControllerName : function() {
			return "sap.apf.demokit.app.controls.controller.reportingCurrency";
		},
		createContent : function(oController) {
			var self = this;
			this.oApi = this.getViewData().oApi;
			/**
			 * Select Dialog to hold list of currencies
			 * */
			this.oDialog = new SelectDialog({
				title : this.oApi.getTextNotHtmlEncoded("reportingCurrency"),
				rememberSelections : true,
				growingThreshold : 500,
				items : {
					path : "/",
					template : new StandardListItem({
						title : "{text}",
						selected : "{selected}"
					})
				},
				confirm : oController.onConfirmPress.bind(oController),
				search : oController.doSearchItems.bind(oController),
				liveChange : oController.doSearchItems.bind(oController),
				cancel : oController.onCancelPress.bind(oController)
			});
			/**
			 * The Button that gets added to the footer on press of which
			 * the above dialog will open.
			 * */
			this.oButton = new Button({
				text : this.oApi.getTextNotHtmlEncoded("reportingCurrency"),
				width : "100%",
				type : "Transparent",
				press : function() {
					if (Device.system.desktop) {
						self.oDialog.addStyleClass("sapUiSizeCompact");
					}
					self.oDialog.open();
				}
			});
			return this.oButton;
		}
	});
});
