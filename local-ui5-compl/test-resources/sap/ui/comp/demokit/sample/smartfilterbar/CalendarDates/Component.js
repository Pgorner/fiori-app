sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/export/test/util/FetchToXHRBridge"
], function(UIComponent, MockServer, FetchToXHRBridge) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar.CalendarDates.Component", {

		_oMockServer: null,

		metadata: {
			manifest: "json"
		},
		init: function () {

			/* Export requires an absolute path */
			const SERVICE_URL = "https://fake.host.com/localService/";

			/** Start Mockserver using unique "rootUri" key string to avoid
				shared metadata caching. */
			this._oMockServer = new MockServer({
				rootUri: SERVICE_URL
			});
			const sMockdataUrl = sap.ui.require.toUrl("mockserver");
			const sMetadataUrl = sMockdataUrl + "/metadata.xml";

			this._oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"MainEntitySet"
				]
			});
			this._oMockServer.start();
			FetchToXHRBridge.activate();

			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			UIComponent.prototype.destroy.apply(this, arguments);
			FetchToXHRBridge.deactivate();

			if (this._oMockServer) {
				this._oMockServer.stop();
			}
		}
	});
});
