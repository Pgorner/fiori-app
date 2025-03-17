sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], 	function(
	Controller,
	JSONModel
) {
	"use strict";

	return Controller.extend("view.Main", {

		onInit: function() {

			var oJsonModel = new JSONModel();
			oJsonModel.setData([{
				"Bukrs": "0001",
				"Kunnr": "J001",
				"BUDAT": new Date("2/1/22"),
				"Cnt": 3,
				"MyBoolean": true,
				"Time": null
			},
			{
				"Bukrs": "0002",
				"Kunnr": "J002",
				"BUDAT": new Date("2/1/22"),
				"Cnt": 3,
				"MyBoolean": false,
				"Time": null
			}]);
			this.getView().setModel(oJsonModel);
			this.getView().setModel(oJsonModel, "oModelMNA");

		}
	});
});
