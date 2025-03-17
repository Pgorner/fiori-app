sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/comp/sample/smarttable/mockserver/DemoMockServer'
], function (Controller, ODataModel, DemoMockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.smarttablesmartmicrochart.App", {
		onInit: function () {
			var oModel, oView;

			this._oMockServer = new DemoMockServer(false, "sap/ui/comp/demokit/sample/smarttable/smarttablesmartmicrochart/mockserver");

			oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline"
			});

			oView = this.getView();
			oView.setModel(oModel);
		},

		onExit: function () {
			this._oMockServer.destroy(this.getView());
		},

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},

		onBeforeRebindTable: function (oEvent) {
			var bindingParams = oEvent.getParameter("bindingParams");
			bindingParams.parameters.select += ",Revenue,TargetRevenue,ForecastRevenue,DeviationRangeLow,DeviationRangeHigh,ToleranceRangeLow,ToleranceRangeHigh,MinValue,MaxValue";
		}
	});
});
