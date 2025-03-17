sap.ui.define(["sap/fe/core/PageController", "sap/m/MessageToast"], function (PageController, MessageToast) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.chartDefault.ChartDefault", {
		onChartSelectionChanged: function () {
			MessageToast.show("Selection changed");
		}
	});
});
