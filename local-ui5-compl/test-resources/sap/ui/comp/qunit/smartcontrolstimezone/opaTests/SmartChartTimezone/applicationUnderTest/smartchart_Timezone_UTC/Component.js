sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer'

], function (UIComponent, MockServer) {
	"use strict";

	return UIComponent.extend("applicationUnderTest.smartchart_Timezone_UTC.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			// OData Mockserver
			var oMockServer = new MockServer({
				rootUri: "/smartchart_Timezone_UTC/"
			});
			this._oMockServer = oMockServer;
			var sMockdataUrl = sap.ui.require.toUrl("applicationUnderTest/smartchart_Timezone_UTC/mockserver");

			var oURIParameters = new URLSearchParams(window.location.search);
			MockServer.config({
				autoRespondAfter: oURIParameters.get("serverDelay") || 0
			});

			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"ZEPM_C_SALESORDERITEMQUERYNoParamsResults", "ZEPM_C_SALESORDERITEMQUERYResults", "ZEPM_C_SALESORDERITEMQUERY"
				]
			});

			oMockServer.start();

			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function () {
			// OData Mockserver
			this._oMockServer.stop();

			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
