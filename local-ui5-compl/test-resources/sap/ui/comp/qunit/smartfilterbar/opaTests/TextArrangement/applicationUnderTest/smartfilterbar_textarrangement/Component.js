sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer'

], function (UIComponent, MockServer) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar_textarrangement.Component", {
		metadata: {
		    manifest: "json"
		},
		init: function () {

			var sMockdataUrl = sap.ui.require.toUrl("mockserver");
			// OData Mockserver
			var oMockServer = new MockServer({
				rootUri: "/foo/"
			});

			// Speed up OPA test execution - default delay is 500ms
			MockServer.config({autoRespondAfter: 0});

			this._oMockServer = oMockServer;
			var sMockdataUrl = sap.ui.require.toUrl("sap/ui/comp/sample/smartfilterbar_textarrangement/mockserver");
			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"MyEntitySet", "ZEPM_C_SALESORDERITEMQUERY", "StringVH", "StringVHVLTX", "StringVHVLTX_ID",  "StringVHVLTX_TF",  "StringVHVLTX_TL"
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
