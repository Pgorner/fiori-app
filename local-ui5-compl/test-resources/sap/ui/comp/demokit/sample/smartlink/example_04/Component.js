/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	'sap/ui/core/UIComponent', "sap/ui/model/odata/v2/ODataModel", 'sap/ui/core/util/MockServer', 'sap/ui/comp/navpopover/FakeFlpConnector', 'sap/ui/comp/navpopover/SemanticObjectController'
], function(UIComponent, ODataModel, MockServer, FakeFlpConnector, SemanticObjectController) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_04.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_04_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_04_SemanticObjectName01#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet"
						}, {
							action: "anyAction02",
							intent: "?demokit_smartlink_example_04_SemanticObjectName02#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "Change Material Costs",
							tags: [
								"superiorAction"
							]
						}, {
							action: "anyAction03",
							intent: "?demokit_smartlink_example_04_SemanticObjectName03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Display Material Costs"
						}
					]
				}
			});

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_04/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_04/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_04/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("demokit.smartlink.example_04", true);
			this.setModel(this.oModel);

			UIComponent.prototype.init.apply(this, arguments);
		},

		exit: function() {
			FakeFlpConnector.disableFakeConnector();
			this.oMockServer.stop();
			this.oModel.destroy();
		}
	});

	return Component;
});
