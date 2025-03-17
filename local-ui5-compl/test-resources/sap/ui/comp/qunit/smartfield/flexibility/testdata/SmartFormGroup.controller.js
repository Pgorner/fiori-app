sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel"
], function(
	Controller,
	MockServer,
	ODataModel
) {
	"use strict";

	return Controller.extend("sap.ui.comp.test.flexibility.SmartFormGroup", {
		onInit : function () {
			var oMockServer = new MockServer({
				rootUri: "/"
			});
			var sResourcePath = sap.ui.require.toUrl("sap/ui/comp/test/flexibility") + "/mockserver";
			oMockServer.simulate( sResourcePath + "/metadata.xml", {
				sMockdataBaseUrl: sResourcePath,
				bGenerateMissingMockData: true,
				aEntitySetsNames: ["EntityTypes"]
			});
			oMockServer.start();

			var oModel = new ODataModel("/");

			var oView = this.getView();
			oView.setModel(oModel);
			this._data = new Promise(function (resolve) {
				oView.bindElement({
					path: "/EntityTypes(Property01='propValue01')",
					events: {
						dataReceived: resolve
					}
				});
			});
		},
		isDataReady: function () {
			return this._data;
		}
	});
});
