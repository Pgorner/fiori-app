sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/ui/core/util/MockServer",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/BindingMode"
	],
	function (UIComponent, MockServer, ODataModel, BindingMode) {
		"use strict";

		return UIComponent.extend("test.sap.ui.comp.valuehelpdialog.Component", {
			metadata: {
				manifest: "json"
			},

			init: function () {
				// call the init function of the parent
				UIComponent.prototype.init.apply(this, arguments);

				// call the init function of the parent

				this.oMockServer = new MockServer({
					rootUri: "odata/"
				});

				this.oMockServer.simulate("mockserver/metadata.xml", {
					sMockdataBaseUrl: "mockserver/",
					aEntitySetsNames: ["Employees", "VL_NAMES"]
				});
				this.oMockServer.start();
				this.oModel = new ODataModel("odata", true);
				this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
				this.setModel(this.oModel);
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
	}
);
