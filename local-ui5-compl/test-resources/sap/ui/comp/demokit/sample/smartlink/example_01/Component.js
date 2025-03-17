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

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_01.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_01_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_01_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Name"
						}, {
							action: "anyAction00",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'A'",
							tags: [
								"superiorAction"
							]
						}, {
							action: "anyAction01",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_02#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'B'"
						}, {
							action: "anyAction02",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'C'"
						}, {
							action: "anyAction03",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_04#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'D'"
						}, {
							action: "anyAction04",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_05#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'E'"
						}, {
							action: "anyAction05",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_06#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'F'"
						}, {
							action: "anyAction06",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_07#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'G'"
						}, {
							action: "anyAction07",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_08#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'H'"
						}, {
							action: "anyAction08",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_09#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'I'"
						}, {
							action: "anyAction09",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_10#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'J'"
						}, {
							action: "anyAction10",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_11#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'K'"
						}
					]
				},
				'demokit_smartlink_example_01_SemanticObjectPrice': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_01_SemanticObjectPrice01#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Price"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectPrice02#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Price",
							tags: [
								"superiorAction"
							]
						}
					]
				}
			});

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_01/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_01/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_01/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("demokit.smartlink.example_01", true);
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
