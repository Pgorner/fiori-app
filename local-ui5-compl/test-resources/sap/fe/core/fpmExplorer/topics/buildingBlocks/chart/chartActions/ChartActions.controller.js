sap.ui.define(["sap/fe/core/PageController", "sap/m/MessageBox"], function (PageController, MessageBox) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.chartActions.ChartActions", {
		onPressMenuAction(oEvent) {
			MessageBox.show("You pressed the custom action: " + oEvent.getSource().getProperty("text"));
		},
		onPressAction(oEvent) {
			MessageBox.show("You pressed the custom action: " + oEvent.getSource().getProperty("text"));
		},
		onPressActionSelection(oEvent) {
			var oChart = this.byId("chartActions");
			var oSelectedContexts = oChart.getSelectedContexts();
			var oData = oSelectedContexts.map(function (oContext) {
				return oContext.getObject();
			});
			MessageBox.show("You selected below contexts:", { details: oData });
		}
	});
});
