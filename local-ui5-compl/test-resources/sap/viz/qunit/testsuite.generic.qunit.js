sap.ui.define([
	"sap/ui/test/generic/GenericTestCollection"
], function(GenericTestCollection) {
	"use strict";

	var oConfig = GenericTestCollection.createTestsuiteConfig({
		library: "sap.viz",
		objectCapabilities: {
			"sap.viz.ui5.controls.VizFrame": {
				properties: {
					legendVisible: GenericTestCollection.ExcludeReason.CantSetDefaultValue // Can't GET (default) value
				}
			},
			"sap.viz.ui5.data.FlattenedDataset": {
				aggregations: {
					data: GenericTestCollection.ExcludeReason.OnlyChangeableViaBinding
				}
			}
		}
	});

	return oConfig;
});