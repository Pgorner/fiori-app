sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/BindingMode"
], function (UIComponent, MockServer, ODataModel, BindingMode) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfield.WithSideEffects.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			var sMockdataUrl = sap.ui.require.toUrl("mockserver");
			//initialize a mockserver
			this.oMockServer = new MockServer({
				rootUri: "smartfield.WithSideEffects.Main/"
			});

			this.oMockServer.simulate(sMockdataUrl + "/metadata.xml", {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"Data"
				]
			});
			this.oMockServer.start();

			//define the model for the data, using the mockserver
			this.oModel = new ODataModel("smartfield.WithSideEffects.Main");
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			this.setModel(this.oModel);

			// call the init function of the parent
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
