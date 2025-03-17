sap.ui.define([
	'sap/base/Log',
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/m/TextArea',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/ui/comp/state/UIState',
	"sap/ui/core/Lib",
	"sap/ui/comp/util/FullScreenUtil"
], function(Log, Controller, MessageBox, MessageToast, TextArea, Button, Dialog, UIState, Library, FullScreenUtil) {
	"use strict";

	return Controller.extend("test.sap.ui.comp.smartchart.Example", {

		onInit: function() {
			// handle selection details actions
			this.byId("smartChart01").attachSelectionDetailsActionPress(function(oEvent) {
				MessageToast.show(oEvent.getParameter("action").getText() + " is pressed" + "\n " + oEvent.getParameter("itemContexts").length + " items selected" + "\n level is: " + oEvent.getParameter("level"));
				//Example for getting binding context object
				//oEvent.getParameter("itemContexts");
			});

			this.byId("mdcOdataV2Chart").attachSelectionDetailsActionPressed(function(oEvent) {
				MessageToast.show(oEvent.getParameter("action").getText() + " is pressed" + "\n " + oEvent.getParameter("itemContexts").length + " items selected" + "\n level is: " + oEvent.getParameter("level"));
				//Example for getting binding context object
				//oEvent.getParameter("itemContexts");
			});

			// log chart data change event on console
			this.byId("smartChart01").attachChartDataChanged(function(oEvent){
				Log.info(JSON.stringify(oEvent.getParameter("changeTypes")));
			});
		},

		onBeforeRebindChart: function(oEvent) {
			Log.info("onBeforeRebind");
			//var oSmartChart = oEvent.getSource();
			//oSmartChart.setRequestAtLeastFields("SupplierName");
		},

		onNavigate: function(oEvent) {
			var oParameters = oEvent.getParameters();
			if (oParameters.text === "Homepage") {
				return;
			}
			MessageBox.show(oParameters.text + " has been pressed", {
				icon: MessageBox.Icon.INFORMATION,
				title: "SmartChart demo",
				actions: [
					MessageBox.Action.OK
				]
			});
		},

		onPressUIState: function() {
			var oSmartChart = this.byId("smartChart01");
			var oTextArea = new TextArea({
				rows: 20,
				width: "700px"
			});
			var oUIState = oSmartChart.getUiState();
			oTextArea.setValue("presentationVariant:\n" + JSON.stringify(oUIState.getPresentationVariant()) + "\nselectionVariant:\n" + JSON.stringify(oUIState.getSelectionVariant()) + "\nvariantName:\n" + oUIState.getVariantName());
			var oDialog = new Dialog({
				title: "Edit 'Data Suite Format'",
				content: oTextArea,
				beginButton: new Button({
					text: 'OK',
					press: function() {
						var sPresentationVariant = oTextArea.getValue().substring(0, oTextArea.getValue().indexOf("selectionVariant:"));
						var sSelectionVariant = oTextArea.getValue().substring(oTextArea.getValue().indexOf("selectionVariant:"), oTextArea.getValue().indexOf("variantName:"));
						var sVariantName = oTextArea.getValue().substring(oTextArea.getValue().indexOf("variantName:"));
						oSmartChart.setUiState(new UIState({
							presentationVariant: JSON.parse(sPresentationVariant.substring(sPresentationVariant.indexOf("{"))),
							selectionVariant: JSON.parse(sSelectionVariant.substring(sSelectionVariant.indexOf("{"))),
							variantName: sVariantName.substring(sVariantName.indexOf(":") + 1)
						}));
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						oDialog.close();
					}
				})
			});
			oDialog.open();
		},

		onPressRTA: function() {
            const oOwnerComponent = this.getOwnerComponent();
            Library.load({name: "sap/ui/rta"}).then(function () {
                sap.ui.require(["sap/ui/rta/api/startKeyUserAdaptation"], function (startKeyUserAdaptation) {
                    startKeyUserAdaptation({
                        rootControl: oOwnerComponent.getAggregation("rootControl")
                    });
                });
            });
        },

		onPressGo: function() {
			var oSmartChart = this.byId("smartChart01");
			oSmartChart._reBindChart({getId: function() { return "search";}});
        },

		onFullscreen: function(oEvent) {
			this.setFullscreen(!this.bFullScreen, false);
		},

		setFullscreen: function(bValue, bForced) {
			const oMdcChart = this.byId("mdcOdataV2Chart");
			const oFullScreenButton = this.byId("FullScreenBtn");

			if (!oFullScreenButton || (bValue === this.bFullScreen && !bForced)) {
				return;
			}

			// if (bValue == true && this._oChart) {
			// 	// store old chart Height
			// 	this._sChartHeight = this._oChart.getHeight();
			// 	this._oChart.setHeight("100%");
			// }

			this.bFullScreen = bValue;
			FullScreenUtil.toggleFullScreen(oMdcChart, this.bFullScreen, oFullScreenButton, this.setFullscreen, "sapContrastPlus", true);

			// if (!bValue)  {
			// 	this._adjustHeight();
			// }

			// this._renderFullScreenButton();
			// Fire the fullScreen Event
			// this.fireFullScreenToggled({
			// 	fullScreen: bValue
			// });

			// if (bValue == false && this._oChart) {
			// 	this._oChart.setHeight(this._sChartHeight);
			// }

		}
	});
});
