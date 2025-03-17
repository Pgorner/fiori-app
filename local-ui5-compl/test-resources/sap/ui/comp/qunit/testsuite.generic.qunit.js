sap.ui.define([
	"sap/ui/test/generic/GenericTestCollection"
], function(GenericTestCollection) {
	"use strict";

	var oConfig = GenericTestCollection.createTestsuiteConfig({
		library: "sap.ui.comp",
		objectCapabilities: {
			"sap.ui.comp.SmartToggle": {
				moduleName: "sap/ui/comp/providers/ControlProvider"
			},
			"sap.ui.comp.smartmicrochart.SmartMicroChart": {
				properties: {
					chartType: GenericTestCollection.ExcludeReason.NotChangeableAfterInit
				}
			},
			"sap.ui.comp.smartvariants.SmartVariantManagementAdapter": {
				properties: {
					selectionPresentationVariants: GenericTestCollection.ExcludeReason.CantSetDefaultValue
				}
			}
		}
	});

	return oConfig;
});