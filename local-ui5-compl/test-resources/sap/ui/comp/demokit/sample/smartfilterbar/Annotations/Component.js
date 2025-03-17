sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/BindingMode"
], function (UIComponent, MockServer, ODataModel, BindingMode) {
	"use strict";

	return UIComponent.extend("smartfilterbar.Annotations.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			var sMockdataUrl, sMetadataUrl;

			// initialize a mockserver
			this.oMockServer = new MockServer({
				rootUri: "smartfilterbar.Annotations.SmartFilterBar/"
			});

			// simulate the test data
			sMockdataUrl = sap.ui.require.toUrl("mockserver");
			sMetadataUrl = sMockdataUrl + "/metadata.xml";
			this.oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"VL1", "VL2", "VL3", "MainEntitySet"
				]
			});
			this.oMockServer.start();

			/** define the model for the data, using the mockserver
				and default Binding Mode set to TwoWay as condition to
				use TextInEditModeSource.  */
			this.oModel = new ODataModel(
				"smartfilterbar.Annotations.SmartFilterBar",
				{ defaultBindingMode: "TwoWay" }
			);

			this.setModel(this.oModel);

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function () {
			this.oMockServer.stop();
			this.oModel.destroy();
			this.oMockServer = null;
			this.oModel = null;
		}
	});
});
