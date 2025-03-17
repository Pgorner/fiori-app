sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'./mockserver/DemoMockServer',
	'sap/ui/model/json/JSONModel'
], function (Controller, ODataModel, DemoMockServer, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartmultiinput.inSmartTable.SmartMultiInput", {
		onInit: function () {
			var oModel, oView;
			var oControl = {
				smiEditable: false
			};
			this._oMockServer = new DemoMockServer();
			oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline"
			});
			this.getView().setModel(new JSONModel(oControl), "controls");
			oView = this.getView();
			oView.setModel(oModel);
		},
		toggleVisibility: function (oEvt) {
			var editable = this.getView().byId("LineItemsSmartTable").getEditable();
			this.getView().getModel("controls").setProperty("/smiEditable", editable);
		},
		onExit: function () {
			this._oMockServer.stop();
		}
	});
});