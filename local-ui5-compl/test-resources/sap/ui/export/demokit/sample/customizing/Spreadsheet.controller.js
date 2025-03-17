sap.ui.define([
	"sap/base/i18n/Formatting",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet",
	"sap/ui/export/test/util/FetchToXHRBridge",
	"sap/ui/model/odata/v2/ODataModel"
], function(Formatting, Controller, MockServer, exportLibrary, Spreadsheet, FetchToXHRBridge, ODataModel) {
	"use strict";

	const EdmType = exportLibrary.EdmType;

	return Controller.extend("sap.ui.export.sample.customizing.Spreadsheet", {

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

			Formatting.addCustomCurrencies({
				EUR: {"digits": 3},
				CNY: {"digits": 0},
				JPY: {"digits": 2},
				ILS: {"digits": 1},
				RUB: {"digits": 4},
				USD: {"digits": 1}
			});

			/* Fake service specific unit of measure code list due to MockServer */
			oModel.getMetaModel().requestUnitsOfMeasure = function() {
				return Promise.resolve({
					"kg": {"StandardCode" : "KGM", "Text" : "Kilogram", "UnitSpecificScale" : 3}
				});
			};
		},

		createColumnConfig: function() {
			const aCols = [];

			/* 1. Add a simple text column */
			aCols.push({
				label: "Text",
				type: EdmType.String,
				property: "SampleString",
				width: 20,
				wrap: true
			});

			/* 2. Add Number column with fixed scale */
			aCols.push({
				label: "Number (fixed)",
				type: EdmType.Number,
				property: "SampleDecimal",
				scale: 2,
				unit: "kg"
			});

			/* 3. Add Number column with autoScale */
			aCols.push({
				label: "Number (dynamic)",
				type: EdmType.Number,
				property: "SampleDecimal",
				autoScale: true,
				scale: 2,
				unit: "kg"
			});

			/* 3. Add a simple Currency column */
			aCols.push({
				label: "Currency",
				type: EdmType.Currency,
				property: "SampleDecimal",
				unitProperty: "SampleCurrency",
				displayUnit: true,
				width: 20
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
				workbook: { columns: aCols },
				dataSource: oRowBinding,
				fileName: "Customizing Demokit sample.xlsx",
				worker: false // We need to disable worker because we are using a Mockserver as OData Service
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
