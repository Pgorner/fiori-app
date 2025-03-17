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

	return UIComponent.extend("sap.ui.comp.sample.smartchart.calendarYear.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);
			this.oMockServer = new MockServer({
				rootUri: "sapuicompsmartchartcalendar/"
			});
			var sMetadataRelativePath = "test-resources/sap/ui/comp/demokit/sample/smartchart/calendarYear/mockserver/metadata.xml";
			var oMockSettings = {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartchart/calendarYear/mockserver/",
				bGenerateMissingMockData: false
			};

			var oMockServer = this.oMockServer;
			oMockServer.simulate(sMetadataRelativePath, oMockSettings);
			oMockServer.start();
			Log.info('Running the "Smart Chart with Common.IsCalendarYear annotation" sample with mock data');
			this.oModel = new ODataModel("sapuicompsmartchartcalendar");
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
