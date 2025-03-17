/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/core/util/MockServer',
	'sap/ui/comp/navpopover/FakeFlpConnector',
	'sap/ui/comp/navpopover/SemanticObjectController'
], function(UIComponent, ODataModel, MockServer, FakeFlpConnector, SemanticObjectController) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_07.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_07_SemanticObject': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_07_SemanticObject_00#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Name"
						}, {
							action: "create",
							intent: "?demokit_smartlink_example_07_SemanticObject_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Create",
							tags: [
								"superiorAction"
							]
						}, {
							action: "edit",
							intent: "?demokit_smartlink_example_07_SemanticObject_02#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Edit"
						}
					]
				}
			});

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_07/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_07/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_07/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("demokit.smartlink.example_07", true);
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
