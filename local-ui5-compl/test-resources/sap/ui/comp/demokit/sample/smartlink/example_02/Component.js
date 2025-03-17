/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer',
	'sap/ui/comp/navpopover/FakeFlpConnector',
	'sap/ui/comp/navpopover/SemanticObjectController',
	'sap/ui/model/odata/v2/ODataModel'
], function(UIComponent, MockServer, FakeFlpConnector, SemanticObjectController, ODataModel) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_02.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_02_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_02_SemanticObjectName01#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Name"
						}, {
							action: "anyAction02",
							intent: "?demokit_smartlink_example_02_SemanticObjectName02#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "Change Product Name",
							tags: [
								"superiorAction"
							]
						}, {
							action: "anyAction03",
							intent: "?demokit_smartlink_example_02_SemanticObjectName03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Display Product details"
						}
					]
				},
				'demokit_smartlink_example_02_SemanticObjectProductId': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_02_SemanticObjectProductId01#/sample/sap.ui.comp.sample.smartlink.listPage/preview",
							text: "FactSheet of ProductId"
						}, {
							action: "anyAction02",
							intent: "?demokit_smartlink_example_02_SemanticObjectProductId02#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "Change Material Costs",
							tags: [
								"superiorAction"
							]
						}, {
							action: "anyAction03",
							intent: "?demokit_smartlink_example_02_SemanticObjectProductId03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Display Material Costs"
						}

					]
				}
			});

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_02/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_02/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_02/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("demokit.smartlink.example_02", true);
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
