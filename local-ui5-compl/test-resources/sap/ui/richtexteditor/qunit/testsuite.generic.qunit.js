sap.ui.define([
	"sap/ui/test/generic/GenericTestCollection"
], function(GenericTestCollection) {
	"use strict";

	var oConfig = GenericTestCollection.createTestsuiteConfig({
		library: "sap.ui.richtexteditor",
		objectCapabilities: {
			"sap.ui.richtexteditor.ToolbarWrapper": {
				rendererHasDependencies: true
			}
		}
	});

	// Add sap.m library because "sap.ui.richtexteditor.ToolbarWrapper" expects a toolbar
	// and currently the aggregation _toolbar is only filled in case "sap.m" lib is available
	oConfig.defaults.ui5.libs.push("sap.m");

	return oConfig;
});