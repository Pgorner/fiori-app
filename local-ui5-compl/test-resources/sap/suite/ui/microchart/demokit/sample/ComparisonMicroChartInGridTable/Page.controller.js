sap.ui.define([
		'sap/m/MessageToast',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'require'
	],
	function (MessageToast, Controller, JSONModel, require) {
		"use strict";

		var PageController = Controller.extend("sap.suite.ui.microchart.sample.ComparisonMicroChartInGridTable.Page", {
			onInit: function() {
				var sPath = require.toUrl("./SampleData.json");
				this.oModel = new JSONModel(sPath);
				this.getView().setModel(this.oModel);
			},
			press: function (oEvent) {
				MessageToast.show("The comparison micro chart is pressed.");
			}
		});

		return PageController;

	});
