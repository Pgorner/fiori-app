sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/Log"
], function (MockServer, Log) {
	"use strict";

	return {

		init: function (sODataServiceUrl) {
			var oMockServer, sLocalServicePath;

			// create
			oMockServer = new MockServer({
				rootUri: sODataServiceUrl
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 1000
			});

			sLocalServicePath = sap.ui.require.toUrl("sap/gantt/sample/GanttChartContainer/localService");

			// simulate
			oMockServer.simulate(sLocalServicePath + "/metadata.xml", {
				sMockdataBaseUrl : sLocalServicePath + "/mockdata",
				bGenerateMissingMockData: true
			});

			// start
			oMockServer.start();

			return oMockServer;
		},

		refreshResource: function(oModel, sResourceId, fnSuccessCallback) {
			oModel.read("/Resources('" + sResourceId + "')", {
				urlParameters: {
					"$expand": "ResourceToRequirements"
				},

				success: function(oData) {
					if (fnSuccessCallback) {
						fnSuccessCallback(oData);
					}
				},
				error: function(pError){
					Log.error("Error when refresh resource: " + sResourceId);
				}
			});
		}

	};

});
