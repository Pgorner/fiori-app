sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel'
], function(Controller, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar.CalendarDates.SmartFilterBar", {

		onInit: function() {
			this._oModel = new ODataModel("https://fake.host.com/localService/", true);
			this.getView().setModel(this._oModel);
			this._oSmartFilterBar  = this.byId("smartFilterBar");
		},

		onBeforeExport: function(oEvent) {
			var mExcelSettings = oEvent.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},

		onExit: function () {
			this._oModel.destroy();
			this._oModel = null;
		}
	});
});
