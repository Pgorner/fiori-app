sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel"
], function (Controller, MockServer, JSONModel, ODataModel) {
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.MicroProcessFlowSmartForm.MicroProcessFlow", {
		onInit: function () {
			var oMockServer = new MockServer({
				rootUri: "microprocessflow.Products/"
			});
			this._oMockServer = oMockServer;
			oMockServer.simulate(
				"test-resources/sap/suite/ui/commons/demokit/sample/MicroProcessFlowSmartForm/mockserver/metadata.xml",
				"test-resources/sap/suite/ui/commons/demokit/sample/MicroProcessFlowSmartForm/mockserver/");
			oMockServer.start();

			var oModel = new ODataModel("microprocessflow.Products", true);
			var oView = this.getView();
			oView.setModel(oModel);

			var that = this;
			oModel.getMetaModel().loaded().then(function () {
				that.getView().byId("smartForm").bindElement("/Products('1239102')");
			});

			var oJsonModel = new JSONModel("test-resources/sap/suite/ui/commons/demokit/sample/MicroProcessFlowSmartForm/mockserver/ProcessFlow.json");
			oView.setModel(oJsonModel, "json");
		},
		onExit: function () {
			this._oMockServer.stop();
		}
	});
	return oPageController;
});
