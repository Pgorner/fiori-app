sap.ui.define([
	"sap/ui/test/generic/GenericTestCollection"
], function(GenericTestCollection) {
	"use strict";

	var oConfig = GenericTestCollection.createTestsuiteConfig({
		library: "sap.suite.ui.microchart",
		objectCapabilities: {
			"sap.suite.ui.microchart.StackedBarMicroChartBar": {
				properties: {
					value: GenericTestCollection.ExcludeReason.CantSetDefaultValue
				}
			}
		}
	});

	return oConfig;
});