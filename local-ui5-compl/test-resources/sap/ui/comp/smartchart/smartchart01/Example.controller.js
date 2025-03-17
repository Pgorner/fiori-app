sap.ui.define([
	'sap/base/Log',
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/m/TextArea',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/ui/comp/state/UIState',
	"sap/ui/core/Lib"
], function(Log, Controller, MessageBox, MessageToast, TextArea, Button, Dialog, UIState, Library) {
	"use strict";

	return Controller.extend("test.sap.ui.comp.smartchart.Example", {

		onInit: function() {
			// handle selection details actions
			this.byId("smartChart01").attachSelectionDetailsActionPress(function(oEvent) {
				MessageToast.show(oEvent.getParameter("action").getText() + " is pressed" + "\n " + oEvent.getParameter("itemContexts").length + " items selected" + "\n level is: " + oEvent.getParameter("level"));
				//Example for getting binding context object
				//oEvent.getParameter("itemContexts");
			});
			// log chart data change event on console
			this.byId("smartChart01").attachChartDataChanged(function(oEvent){
				Log.info(oEvent.getParameter("changeTypes"));
			});
		},

		onBeforeRebindChart: function(oEvent) {
			// const oSmartChart = oEvent.getSource();
			// const oBindingParams = oEvent.getParameter("bindingParams");
			// oBindingParams.preventChartBind = true;
			// return oSmartChart.getChartAsync()
			// 	.then(function (oChart) {
			// 		// if (!this._chartAxisTitlesHidden) {
			// 		// 	_hideAxisTitles(oChart);
			// 		// 	this._chartAxisTitlesHidden = true;
			// 		// }
			// 		var fnBindMethod = oChart.bindData.bind(oChart);
			// 		oBindingParams.path = oSmartChart.getChartBindingPath() || ("/" + oSmartChart.getEntitySet());
			// 		fnBindMethod(oBindingParams);
			// 	});
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
        }
	});
});
