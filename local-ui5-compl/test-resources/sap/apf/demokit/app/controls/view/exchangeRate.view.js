sap.ui.define([
	"sap/m/Button",
	"sap/m/DatePicker",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/library",
	"sap/m/Select",
	"sap/ui/Device",
	"sap/ui/core/Item",
	"sap/ui/core/ListItem",
	"sap/ui/layout/VerticalLayout"
], function(
	Button,
	DatePicker,
	Dialog,
	Label,
	mobileLibrary,
	Select,
	Device,
	Item,
	ListItem,
	VerticalLayout
) {
	"use strict";

	var DialogType = mobileLibrary.DialogType,
		LabelDesign = mobileLibrary.LabelDesign;

	sap.ui.jsview("sap.apf.demokit.app.controls.view.exchangeRate", {
		getControllerName : function() {
			return "sap.apf.demokit.app.controls.controller.exchangeRate";
		},
		createContent : function(oController) {
			// Store references.
			var self = this;
			this.oApi = this.getViewData().oApi;
			// Exchange Rate Label.
			var oExchangeRateLabel = new Label({
				text : this.oApi.getTextNotHtmlEncoded("P_ExchangeRateType"),
				tooltip : {
					visible : false
				},
				design : LabelDesign.Bold
			});
			// Exchange Rate Drop down
			var oExchangeRateDropdown = new Select({
				width : "100%",
				items : {
					path : "/aExchangeRateTypes",
					template : new ListItem({
						key : '{key}',
						text : '{text}'
					})
				},
				selectedKey : "{/sSelectedExchangeRateKey}"
			});
			// Exchange Rate Content Holder.
			var oExchangeRateContent = new VerticalLayout({
				width : "80%",
				content : [ oExchangeRateLabel, oExchangeRateDropdown ]
			}).addStyleClass("dropdownLayout");
			// Date Type Label.
			var oDateTypeLabel = new Label({
				text : self.oApi.getTextNotHtmlEncoded("P_ExchangeRateDate"),
				tooltip : {
					visible : false
				},
				design : LabelDesign.Bold
			});
			// Date Picker.
			var oDatePicker = new DatePicker({
				placeholder : self.oApi.getTextNotHtmlEncoded("enterDate") + "(dd.mm.yyyy)",
				width : "100%",
				enabled : false,
				editable : false,
				value : '{/sSelectedDate}',
				valueFormat : 'dd.MM.yyyy',
				displayFormat : 'dd.MM.yyyy',
				change : oController.handleChangeForDatePicker.bind(oController)
			});
			// Date Type Drop down.
			var oDateTypeDropdown = new Select({
				width : "100%",
				items : {
					path : "/aDateTypes",
					template : new Item({
						text : "{text}",
						key : "{key}"
					})
				},
				selectedKey : "{/sSelectedDateType}",
				change : function(oEvt) {
					var oSelectedItem = oEvt.getParameter('selectedItem');
					if (oSelectedItem.getKey() === "keyDate") {
						self.showDatePicker();
					} else {
						self.hideDatePicker();
					}
				}
			});
			// Date Type Content Holder.
			var oDateTypeContent = new VerticalLayout({
				width : "80%",
				content : [ oDateTypeLabel, oDateTypeDropdown ]
			}).addStyleClass("dropdownLayout");
			// Dialog Content Holder.
			var oDialogContent = new VerticalLayout({
				width : "100%",
				content : [ oExchangeRateContent, oDateTypeContent ]
			}).addStyleClass("exchangeRateLayout");
			// Dialog.
			var oDialog = new Dialog({
				type : DialogType.Standard,
				title : this.oApi.getTextNotHtmlEncoded("exchangeRateSettings"),
				content : oDialogContent,
				beginButton : new Button({
					text : self.oApi.getTextNotHtmlEncoded("ok"),
					press : oController.handleOkPress.bind(oController)
				}),
				endButton : new Button({
					text : self.oApi.getTextNotHtmlEncoded("cancel"),
					press : oController.handleCancelPress.bind(oController)
				}),
				beforeOpen : oController.handleDialogOpen.bind(oController)
			});
			// Button on press of which dialog will open.
			var oButton = new Button({
				text : this.oApi.getTextNotHtmlEncoded("exchangeRate"),
				type : "Transparent",
				width : "100%",
				press : function() {
					if(Device.system.desktop) {   
						oDialog.addStyleClass("sapUiSizeCompact");
					}
					oDialog.setInitialFocus(oDialog);
					oDialog.open();
				}
			});
			// Revealing/Exposing necessary controls to the controller by hosting them on view instance.
			Object.assign(this, {
				oExchangeRateDropdown : oExchangeRateDropdown,
				oDateTypeDropdown : oDateTypeDropdown,
				oDatePicker : oDatePicker,
				oDateTypeContent : oDateTypeContent,
				oDialog : oDialog
			});
			return oButton;
		},
		/**
		 * Displays Date Picker control by adding it into the view.
		 * */
		showDatePicker : function() {
			this.oDateTypeContent.addContent(this.oDatePicker);
			this.oDatePicker.setEnabled(true);
			this.oDatePicker.setEditable(true);
		},
		/**
		 * Hides Date Picker control by removing it from the view.
		 * */
		hideDatePicker : function() {
			this.oDateTypeContent.removeContent(this.oDatePicker);
			this.oDatePicker.setEnabled(false);
			this.oDatePicker.setEditable(false);
		}
	});
});
