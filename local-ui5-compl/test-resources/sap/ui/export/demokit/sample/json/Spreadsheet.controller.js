sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast"
], function(Controller, JSONModel, exportLibrary, Spreadsheet, MessageToast) {
	"use strict";

	const EdmType = exportLibrary.EdmType;

	return Controller.extend("sap.ui.export.sample.json.Spreadsheet", {

		onInit: function() {
			const oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/export/sample/localService/mockdata/Users.json"));
			this.getView().setModel(oModel);
		},

		createColumnConfig: function() {
			return [
				{
					label: "User ID",
					property: "UserID",
					type: EdmType.Number,
					scale: 0
				},
				{
					label: "Firstname",
					property: "Firstname",
					width: "25"
				},
				{
					label: "Lastname",
					property: "Lastname",
					width: "25"
				},
				{
					label: "Salary",
					property: "Salary",
					type: EdmType.Currency,
					unitProperty: "Currency",
					width: "18"
				},
				{
					label: "Active",
					property: "Active",
					type: EdmType.String
				}];
		},

		onExport: function() {
			const oTable = this.byId("exportTable");
			const oBinding = oTable.getBinding("items");
			const aCols = this.createColumnConfig();
			const oSettings = {
				workbook: { columns: aCols },
				dataSource: oBinding
			};
			const oSheet = new Spreadsheet(oSettings);

			oSheet.build()
				.then(function() {
					MessageToast.show("Spreadsheet export has finished");
				}).finally(function() {
					oSheet.destroy();
				});
		}
	});
});
