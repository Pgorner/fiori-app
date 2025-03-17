sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/BindingMode",
	"sap/base/Log"
], function(
	UIComponent,
	ODataModel,
	MockServer,
	BindingMode,
	Log
) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartchart.fiscalYearPeriod.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);
			this.oMockServer = new MockServer({
				rootUri: "sapuicompsmartchartfiscalyearperiod/"
			});
			var sMetadataRelativePath = "test-resources/sap/ui/comp/demokit/sample/smartchart/fiscalYearPeriod/mockserver/metadata.xml";
			var oMockSettings = {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartchart/fiscalYearPeriod/mockserver/",
				bGenerateMissingMockData: false
			};
			var oMockServer = this.oMockServer;

			oMockServer.simulate(sMetadataRelativePath, oMockSettings);
			oMockServer.start();
			Log.info('Running the "Smart Chart with Common.v1.IsFiscalYearPeriod annotation" sample with mock data');
			this.oModel = new ODataModel("sapuicompsmartchartfiscalyearperiod");
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			this.setModel(this.oModel);
		},

		exit: function() {

			if (this.oMockServer) {
				this.oMockServer.stop();
				this.oMockServer = null;
			}

			if (this.oModel) {
				this.oModel.destroy();
				this.oModel = null;
			}
		}
	});
});
