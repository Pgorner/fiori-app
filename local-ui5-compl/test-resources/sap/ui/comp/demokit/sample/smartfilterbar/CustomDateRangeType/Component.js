sap.ui.define([
	"sap/ui/core/UIComponent",
	'sap/ui/core/util/MockServer'
], function(
	UIComponent,
	MockServer
){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar.CustomDateRangeType.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			var sMockdataUrl, sMetadataUrl;

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			/** Start Mockserver
				using unique 'rootUri' key string to avoid
				shared metadata caching. */
			this._oMockServer = new MockServer({
				rootUri: "/MockDataServiceCustomDateRangeType/"
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
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
			if (this._oMockServer) {
				this._oMockServer.stop();
			}
		}
	});
});
