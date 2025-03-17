sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/util/MockServer",
	"sap/ui/export/qunit/util/FetchToXHRBridge"
], function (Controller, ODataModel, MockServer, FetchToXHRBridge) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.SmartTable", {
		onInit: function () {
			var oModel, oView, sServiceUrl;

			/* Export requires an absolute path */
			sServiceUrl = "https://fake.host.com/localService/";

			var oMockServer = new MockServer({
				rootUri: sServiceUrl
			});

			this._oMockServer = oMockServer;
			oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			oMockServer.start();
			FetchToXHRBridge.activate();

			oModel = new ODataModel(sServiceUrl, {
				defaultCountMode: "Inline"
			});

			oView = this.getView();
			oView.setModel(oModel);
		},
		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");
			// GW export
			if (mExcelSettings.url) {
				return;
			}
			// For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel

			// Disable Worker as Mockserver is used in Demokit sample --> Do not use this for real applications!
			mExcelSettings.worker = false;
		},
		onExit: function () {
			FetchToXHRBridge.deactivate();
			this._oMockServer.stop();
		}
	});
});
