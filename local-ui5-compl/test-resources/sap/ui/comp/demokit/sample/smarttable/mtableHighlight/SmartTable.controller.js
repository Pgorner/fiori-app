sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/comp/sample/smarttable/mockserver/DemoMockServer'
], function (Controller, ODataModel, DemoMockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.mtableHighlight.SmartTable", {
		onInit: function () {
			var oModel, oView;

			this._oMockServer = new DemoMockServer();

			oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline"
			});

			oView = this.getView();
			oView.setModel(oModel);
		},

		formatRowHighlight: function (oValue) {
			// Your logic for rowHighlight goes here
			if (oValue < 2) {
				return "Error";
			} else if (oValue < 3) {
				return "Warning";
			} else if (oValue < 5) {
				return "None";
			}
			return "Success";
		},

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},

		onExit: function () {
			this._oMockServer.destroy(this.getView());
		}
	});
});
