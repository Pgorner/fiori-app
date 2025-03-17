sap.ui.define(['sap/m/MessageToast', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'require'],
	function (MessageToast, Controller, JSONModel, require) {
	"use strict";

	var PageController = Controller.extend("sap.suite.ui.microchart.sample.LineMicroChartGenericTile.Page", {
		onInit: function () {
			// set mock data
			var sPath = require.toUrl("./SampleData.json");
			var oModel = new JSONModel(sPath);
			this.getView().setModel(oModel);
		},

		press: function (oEvent) {
			MessageToast.show("The Generic Tile has been pressed.");
		}
	});

	return PageController;

});
