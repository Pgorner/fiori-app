sap.ui.define([
	"sap/ui/core/UIComponent",
	'sap/ui/comp/navpopover/FakeFlpConnector'
], function(
	UIComponent,
	FakeFlpConnector
	){
	"use strict";

	return UIComponent.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();

			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_01_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_01_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Name"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'A'",
							tags: [
								"superiorAction"
							]
						}
					]
				}
			});
		},
		exit: function(){
			FakeFlpConnector.disableFakeConnector();
		}
	});
});