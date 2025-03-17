sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/BindingMode"
], function (
	UIComponent,
	MockServer,
	FakeFlpConnector,
	ODataModel,
	BindingMode
) {
	"use strict";
	return UIComponent.extend("applicationUnderTest.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'smartlink_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?smartlink_SemanticObjectName#/factSheetPage/preview",
							text: "FactSheet of Category"
						}, {
							action: "anyAction",
							intent: "?smartlink_SemanticObjectName_01#/productPage/preview",
							text: "Show Specific Details of Category 'A'",
							tags: [
								"superiorAction"
							]
						}
					]
				}
			});

			this.oMockServer = new MockServer({
				rootUri: "odata/"
			});

			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();
			this.oModel = new ODataModel("odata", true);
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			this.setModel(this.oModel);

			UIComponent.prototype.init.apply(this, arguments);

		},
		exit: function() {
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
