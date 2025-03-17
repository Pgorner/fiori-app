sap.ui.define([
	"sap/ui/core/UIComponent",
	'sap/ui/core/util/MockServer'
], function(UIComponent, MockServer){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.recommended.Component", {
		_oMockServer: null,

		metadata: {
			manifest: "json"
		},
		init: function () {
			var sMockdataUrl = sap.ui.require.toUrl("mockserver"),
				sMetadataUrl = sMockdataUrl + "/metadata.xml";

			//Start Mockserver
			// using unique 'rootUri' key string to avoid shared metadata caching
			this._oMockServer = new MockServer({
				rootUri: "/MockDataService/"
			});

			this._oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"ZSALESREPORT", "ZSALESREPORTSuggestions", "ZSALESREPORTWhitespace"
				]
			});
			this._oMockServer.start();

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function () {
			if (this._oMockServer) {
				this._oMockServer.stop();
			}
		}
	});
}, true);