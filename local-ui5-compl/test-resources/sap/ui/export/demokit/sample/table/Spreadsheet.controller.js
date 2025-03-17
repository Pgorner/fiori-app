sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet",
	"sap/ui/export/test/util/FetchToXHRBridge",
	"sap/ui/model/odata/v2/ODataModel"
], function(Controller, MockServer, exportLibrary, Spreadsheet, FetchToXHRBridge, ODataModel) {
	"use strict";

	const EdmType = exportLibrary.EdmType;

	return Controller.extend("sap.ui.export.sample.table.Spreadsheet", {

		onInit: function() {

			/* Export requires an absolute path */
			const sServiceUrl = "https://fake.host.com/localService/";
			const sPath = sap.ui.require.toUrl("sap/ui/export/sample/localService");

			this._oMockServer = new MockServer({
				rootUri: sServiceUrl
			});

			this._oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");
			this._oMockServer.start();
			FetchToXHRBridge.activate();

			const oModel = new ODataModel(sServiceUrl);
			const oView = this.getView();

			oView.setModel(oModel);
		},

		createColumnConfig: function() {
			const aCols = [];

			aCols.push({
				label: "Full name",
				property: ["Lastname", "Firstname"],
				type: EdmType.String,
				template: "{0}, {1}"
			});

			aCols.push({
				label: "ID",
				type: EdmType.Number,
				property: "UserID",
				scale: 0
			});

			aCols.push({
				property: "Firstname",
				type: EdmType.String
			});

			aCols.push({
				property: "Lastname",
				type: EdmType.String
			});

			aCols.push({
				property: "Birthdate",
				type: EdmType.Date
			});

			aCols.push({
				property: "Salary",
				type: EdmType.Number,
				scale: 2,
				delimiter: true
			});

			aCols.push({
				property: "Currency",
				type: EdmType.String
			});

			aCols.push({
				property: "Active",
				type: EdmType.Boolean,
				trueValue: "YES",
				falseValue: "NO"
			});

			return aCols;
		},

		onExport: function() {
			if (!this._oTable) {
				this._oTable = this.byId("exportTable");
			}

			const oTable = this._oTable;
			const oRowBinding = oTable.getBinding("items");
			const aCols = this.createColumnConfig();
			const oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: "Level"
				},
				dataSource: oRowBinding,
				fileName: "Table export sample.xlsx",
				worker: false // We need to disable worker because we are using a MockServer as OData Service
			};

			const oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});
		},

		onExit: function() {
			FetchToXHRBridge.deactivate();
			this._oMockServer.stop();
		}
	});
});
