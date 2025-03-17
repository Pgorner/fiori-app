sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer'

], function (UIComponent, MockServer) {
	"use strict";

	return UIComponent.extend("applicationUnderTest.smartfilterbar_DDR_OutParameters.Component", {
		metadata: {
		    manifest: "json"
		},
		init: function () {
			// OData Mockserver
			var oMockServer = new MockServer({
					rootUri: "/DateRangeType/"
				}),
				sMockdataUrl = sap.ui.require.toUrl("applicationUnderTest/smartfilterbar_DDR_OutParameters/mockserver"),
				sMetadataUrl = sMockdataUrl + "/metadata.xml";

			this._oMockServer = oMockServer;

			// Speed up OPA test execution - default delay is 500ms
			MockServer.config({autoRespondAfter: 0});

			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"ZEPM_C_SALESORDERITEMQUERYResults", "StringInOutVH", "StringMultiInOutVH", "I_CostCenterVH"
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
