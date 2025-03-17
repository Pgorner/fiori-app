sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/comp/sample/smarttable/mockserver/DemoMockServer'
], function (Controller, ODataModel, DemoMockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.mtableCustom.SmartTable", {
		onInit: function () {
			this._oMockServer = new DemoMockServer();

			const oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline"
			});

			const oView = this.getView();
			oView.setModel(oModel);
		},
		onBeforeExport: function (oEvt) {
			const mExcelSettings = oEvt.getParameter("exportSettings");
			// GW export
			if (mExcelSettings.url) {
				return;
			}
			// UI5 Client Export
			mExcelSettings.fileName = mExcelSettings.fileName + "V2"; // example to modify fileName

			// Sample customization
			if (mExcelSettings.workbook && mExcelSettings.workbook.columns) {
				mExcelSettings.workbook.columns.some(function (oColumnConfiguration) {
					// Customize output for Dmbtr column to match the text on the UI, instead of showing the currency
					if (oColumnConfiguration.property === "Dmbtr") {
						oColumnConfiguration.unitProperty = "Hwaer"; // Decimal handling
						oColumnConfiguration.textAlign = "Right";
						oColumnConfiguration.displayUnit = false;
						oColumnConfiguration.type = "currency"; // Change type of column
						oColumnConfiguration.width = 18; // Set desired width
						return true;
					}

					return false;
				});
			}

			// Add sample context information
			if (mExcelSettings.workbook) {
				mExcelSettings.workbook.context = {
					application: 'Debug Test Application',
					version: '1.54',
					title: 'Some random title',
					modifiedBy: 'John Doe',
					metaSheetName: 'Custom metadata',
					metainfo: [
						{
							name: 'Grouped Properties',
							items: [
								{ key: 'administrator', value: 'Foo Bar' },
								{ key: 'user', value: 'John Doe' },
								{ key: 'server', value: 'server.domain.local' }
							]
						},
						{
							name: 'Another Group',
							items: [
								{ key: 'property', value: 'value' },
								{ key: 'some', value: 'text' },
								{ key: 'fu', value: 'bar' }
							]
						}
					]
				};
			}

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},
		onExit: function () {
			this._oMockServer.destroy(this.getView());
		}
	});
});
