sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer'

], function (UIComponent, MockServer) {
	"use strict";

	return UIComponent.extend("test.app.Component", {
		metadata: {
		    manifest: "json"
		},
		init: function () {
			this.oMockServer = new MockServer({
				rootUri: "smartfield.CurrencyScale.Main/"
			});

			var sMockdataUrl = sap.ui.require.toUrl("localService");
			// OData Mockserver
			var oMockServer = new MockServer({
				rootUri: "/foo/"
			});

			// Speed up OPA test execution - default delay is 500ms
			MockServer.config({autoRespondAfter: 0});

			this._oMockServer = oMockServer;
			var sMockdataUrl = sap.ui.require.toUrl("test/app/localService");
			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"ZEPM_C_SALESORDERITEMQUERYResults", "ZEPM_C_SALESORDERITEMQUERY", "StringVH", "StringNoTextVH", "StringVHVLTX", "StringInOutVH", "StringVHStringAuto", "StringInOutVHDeprecationCode", "WhiteSpace"
				]
			});

			var fnCustom = function (oEvent) {

				// filter according to the parameter. simulate table binding
				var sCurrency = this._oFilterBar.getFilterData()["$Parameter.P_DisplayCurrency"];
				var aResults = [];
				oEvent.getParameter("oFilteredData").results.forEach(function (item) {
					if (item.DisplayCurrency === sCurrency) {
						aResults.push(item);
					}
				});

				oEvent.getParameter("oFilteredData").results = aResults;
			}.bind(this);
			oMockServer.attachAfter("GET", fnCustom, "ZEPM_C_SALESORDERITEMQUERY");
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
