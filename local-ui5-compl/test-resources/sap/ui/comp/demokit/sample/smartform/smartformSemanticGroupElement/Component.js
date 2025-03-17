sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/odata/v2/ODataModel',
	"sap/ui/model/BindingMode"
], function (UIComponent, MockServer, ODataModel, BindingMode) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartform.smartformSemanticGroupElement.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			this.oMockServer = new MockServer({
				rootUri: "smartformSemanticGroupElement.SemanticGroupElement/"
			});

			var sMockdataUrl = sap.ui.require.toUrl("mockserver");
			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			this.oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"Products"
				]
			});
			this.oMockServer.start();

			this.oModel = new ODataModel("smartformSemanticGroupElement.SemanticGroupElement", true);

			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			this.setModel(this.oModel);

			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function () {
			if (this.oMockServer) {
				this.oMockServer.stop();
			}
			if (this.oModel) {
				this.oModel.destroy();
			}
			this.oMockServer = null;
			this.oModel = null;
		}
	});
});
