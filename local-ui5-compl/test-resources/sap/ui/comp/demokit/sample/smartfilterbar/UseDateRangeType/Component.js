sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer'
], function(UIComponent, MockServer) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar.UseDateRangeType.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			var sMockdataUrl, sMetadataUrl;

			UIComponent.prototype.init.apply(this, arguments);

			/** Start Mockserver using unique 'rootUri' key string to avoid shared
				metadata caching. */
			this._oMockServer = new MockServer({
				rootUri: "/MockDataServiceUseDateRangeType/"
			});
			sMockdataUrl = sap.ui.require.toUrl("mockserver");
			sMetadataUrl = sMockdataUrl + "/metadata.xml";
			this._oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"MainEntitySet", "VL1", "VL2"
				]
			});
			this._oMockServer.start();
		},

		destroy: function() {
			UIComponent.prototype.destroy.apply(this, arguments);
			if (this._oMockServer) {
				this._oMockServer.stop();
			}
		}
	});
});
