sap.ui.define([
	"sap/ui/test/generic/GenericTestCollection"
], function(GenericTestCollection) {
	"use strict";

	var oConfig = GenericTestCollection.createTestsuiteConfig({
		library: "sap.chart",
		objectCapabilities: {
			"sap.chart.Chart": {
				aggregations: {
					data: GenericTestCollection.ExcludeReason.OnlyChangeableViaBinding
				}
			}
		}
	});

	return oConfig;
});