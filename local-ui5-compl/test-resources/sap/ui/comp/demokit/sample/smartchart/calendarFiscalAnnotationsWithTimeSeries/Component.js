sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/BindingMode"
], function (UIComponent, ODataModel, MockServer, BindingMode) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartchart.calendarFiscalAnnotationsWithTimeSeries.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			var sMockdataBaseUrl = "test-resources/sap/ui/comp/demokit/sample/smartchart/calendarFiscalAnnotationsWithTimeSeries/mockserver/";
			this.oMockServer = new MockServer({	rootUri: "sapuicompsmartchartcalendarisfacel/" });
			this.oMockServer.simulate( sMockdataBaseUrl + "metadata.xml",
				{
					sMockdataBaseUrl: sMockdataBaseUrl,
					bGenerateMissingMockData: false
				}
			);
			this.oMockServer.start();

			this.oModel = new ODataModel("sapuicompsmartchartcalendarisfacel", {defaultBindingMode: BindingMode.TwoWay});
			this.setModel(this.oModel);

			UIComponent.prototype.init.apply(this, arguments);
		}

	});
});
