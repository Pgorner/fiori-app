sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/comp/sample/smarttable/refAppMockServer/DemoMockServer'
], function (Controller, ODataModel, DemoMockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.smartTableWithCriticality.SmartTable", {
		onInit: function () {
			var oModel, oView;

			this._oMockServer = new DemoMockServer();

			oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline",
				annotationURI: [
					this._oMockServer.getAnnotationUrl()
				]
			});

			oView = this.getView();
			oView.setModel(oModel);
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
