sap.ui.define([
	"sap/ui/test/generic/GenericTestCollection"
], function(GenericTestCollection) {
	"use strict";

	var oConfig = GenericTestCollection.createTestsuiteConfig({
		library: "sap.me",
		skipTests: [GenericTestCollection.Test.EnforceSemanticRendering]
	});

	return oConfig;
});