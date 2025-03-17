sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/odata/v2/ODataModel'
], function(Controller, MockServer, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartchart.chartQualifier.SmartChart", {

		onInit: function() {

			var oMockServer = new MockServer({
				rootUri: "sapuicompsmartchartwithchartqualifier/"
			});
			this._oMockServer = oMockServer;
			oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartchart/chartQualifier/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartchart/chartQualifier/mockserver/");
			oMockServer.start();

			// create and set ODATA Model
			this._oModel = new ODataModel("sapuicompsmartchartwithchartqualifier", true);
			this.getView().setModel(this._oModel);
		},

		onExit: function() {
			this._oMockServer.stop();
			this._oModel.destroy();
		}
	});
});
