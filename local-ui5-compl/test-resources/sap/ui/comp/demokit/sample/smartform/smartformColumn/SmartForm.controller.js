sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageBox',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/v2/ODataModel'
], function (Controller, MessageBox, MockServer, JSONModel, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartform.smartformColumn.SmartForm", {

		onInit: function () {
			/*
			 * LRep request are mocked in file: sap.ui.comp.sample.smartform.Component
			 */

			var oMockServer = new MockServer({
				rootUri: "smartform.SmartForm/"
			});
			var sMockdataUrl = sap.ui.require.toUrl("mockserver");
			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"VL_SH_H_CATEGORY", "VL_SH_H_TCURC", "Products"
				]
			});
			oMockServer.start();
			var oModel = new ODataModel("smartform.SmartForm", true);
			oModel.setDefaultBindingMode("TwoWay");

			this.getView().setModel(oModel);

			var that = this;
			oModel.getMetaModel().loaded().then(function () {
				that.getView().byId("smartFormColumn").bindElement("/Products('1239102')");
			});

			// set explored app's demo model on this sample
			var oViewModel = new JSONModel();
			oViewModel.setProperty("/visible", true);
			this.getView().setModel(oViewModel, "test");
		},
		handleEditToggled: function (oEvent) {
			// just dummy function to activate input validation in SmartForm.
		}
	});
});
