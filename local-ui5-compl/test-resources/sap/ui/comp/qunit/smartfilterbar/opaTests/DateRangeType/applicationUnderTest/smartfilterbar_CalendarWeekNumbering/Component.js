sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer'

], function (UIComponent, MockServer) {
	"use strict";

	return UIComponent.extend("applicationUnderTest.smartfilterbar_CalendarWeekNumbering.Component", {
		metadata: {
			rootView: {
				"viewName": "applicationUnderTest.smartfilterbar_CalendarWeekNumbering.SmartFilterBar",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m", "sap.ui.comp"
				]
			}
		},
		init: function () {

			// OData Mockserver
			var oMockServer = new MockServer({
				rootUri: "/DateRangeType/"
			});
			this._oMockServer = oMockServer;
			var sMockdataUrl = sap.ui.require.toUrl("applicationUnderTest/smartfilterbar_CalendarWeekNumbering/mockserver");

			var oURIParameters = new URLSearchParams(window.location.search);
			MockServer.config({
				autoRespondAfter: oURIParameters.get("serverDelay") || 0
			});

			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"ZEPM_C_SALESORDERITEMQUERYResults"
				]
			});

			var fnCustom = function (oEvent) {};

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
