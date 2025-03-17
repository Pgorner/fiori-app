sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageToast',
	'sap/ui/mdc/condition/ConditionModel',
	'sap/ui/mdc/p13n/StateUtil',
	'sap/m/MessageBox'
], function(Controller, MessageToast, ConditionModel, StateUtil, MessageBox) {
	"use strict";

	/**
	 * Please keep in mind that this is only an example in order to give an impression how you can use Charts.
	 * The logic of controller in productive code would be much complex depending on requirements like: TBD
	 */
	return Controller.extend("sap.ui.mdc.internal.chart.Test", {

		onInit: function() {
			var oChart = this.getView().byId("mdcChart");
			oChart.oChartPromise.then(function(oVizChart) {
				var oCM = new ConditionModel();
				oChart.setModel(oCM, "cmodel");
			});

			oChart.attachDataPointsSelected(function(oEvent){
				console.log(oEvent.getParameter("dataContext"));
			});
		},
		onSelectionDetailsActionPressed: function(oEvent) {
			var sText = oEvent.getParameter("action").getText();
			MessageToast.show("Event risen: " + sText);
		},

		onRetrieveChartState: function(oEvent) {
			var oChart = this.getView().byId("mdcChart");
			if (oChart) {
				StateUtil.retrieveExternalState(oChart).then(function(oState) {
					var oOutput = this.getView().byId("CEretrieveChartState");
					if (oOutput) {
						oOutput.setValue(JSON.stringify(oState, null, "  "));
					}
				}.bind(this));
			}
		},

		onApplyChartState: function(oEvt) {
			var oChart = this.getView().byId("mdcChart");
			var oInputput = this.getView().byId("CEapplyChartState"), oInputJSON;
			if (oInputput) {
				oInputJSON = JSON.parse(oInputput.getValue());
			}
			if (oChart) {
				StateUtil.applyExternalState(oChart, oInputJSON).then(function(){

				});
			}
		},

		onCopyPressed: function() {
			var oSrc = this.getView().byId("CEretrieveChartState");
			if (oSrc) {
				oSrc.getValue();

				var oTrg = this.getView().byId("CEapplyChartState");
				if (oTrg) {
					oTrg.setValue(oSrc.getValue());
				}
			}
		},

		onPaste: function(oEvent) {
			var strData = oEvent.getParameter("data").map(function(row) {return row.join(", ");}).join("\n");
			MessageBox.information("Paste data:\n" + strData);
		}
	});
});
