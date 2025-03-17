sap.ui.define([
	"sap/ui/test/generic/GenericTestCollection"
], function(GenericTestCollection) {
	"use strict";

	var oConfig = GenericTestCollection.createTestsuiteConfig({
		library: "sap.makit",
		objectCapabilities: {
			"sap.makit.CombinationChart": {
				create: false,
				apiVersion: 1
			},
			"sap.makit.Chart": {
				create: false,
				apiVersion: 1
			},
			"sap.makit.Layer": {
				aggregations: {
					rows: GenericTestCollection.ExcludeReason.OnlyChangeableViaBinding
				}
			}
		}
	});

	return oConfig;
});