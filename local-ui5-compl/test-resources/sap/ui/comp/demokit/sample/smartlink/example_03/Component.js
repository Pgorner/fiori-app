/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer',
	'sap/ui/comp/navpopover/FakeFlpConnector',
	'sap/ui/comp/navpopover/SemanticObjectController',
	"sap/ui/model/odata/v2/ODataModel"
], function(
	UIComponent,
	 MockServer,
	 FakeFlpConnector,
	 SemanticObjectController,
	 ODataModel
) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_03.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_03_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet_",
							intent: "?demokit_smartlink_example_03_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Name",
							subTitle: "test"
						}
					]
				}
			});

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_03/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_03/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_03/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("demokit.smartlink.example_03", true);
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
