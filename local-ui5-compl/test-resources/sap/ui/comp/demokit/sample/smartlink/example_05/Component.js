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

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_05.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'another_semantic_object': {
					links: []
				}
			});

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_05/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_05/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_05/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("demokit.smartlink.example_05", true);
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
