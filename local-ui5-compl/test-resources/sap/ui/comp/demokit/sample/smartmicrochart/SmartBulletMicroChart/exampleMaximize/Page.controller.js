sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer", "sap/ui/core/mvc/Controller"
], function(ODataModel, MockServer, Controller) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartmicrochart.SmartBulletMicroChart.exampleMaximize.Page", {
		onInit: function() {
			this._initMockServer();

			var oMaximizeModel = new ODataModel("smartmicrochart.SmartBulletMicroChart/maximize", true);

			var oMaximizeSmartChart = this.getView().byId("maximizeSmartChart");
			oMaximizeSmartChart.bindElement("/Products('PC')");

			var oMaximizeSmartChartWarning = this.getView().byId("maximizeSmartChartWarning");
			oMaximizeSmartChartWarning.bindElement("/Products('Mouse')");

			var oMaximizeSmartChartError = this.getView().byId("maximizeSmartChartError");
			oMaximizeSmartChartError.bindElement("/Products('Chair')");

			oMaximizeSmartChart.setModel(oMaximizeModel);
			oMaximizeSmartChartWarning.setModel(oMaximizeModel);
			oMaximizeSmartChartError.setModel(oMaximizeModel);
		},

		onExit: function() {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		},

		_initMockServer: function() {
			this._oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartBulletMicroChart/maximize/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleMaximize/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleMaximize/mockserver"
			});

			this._oMockServer.start();
		}
	});
});
