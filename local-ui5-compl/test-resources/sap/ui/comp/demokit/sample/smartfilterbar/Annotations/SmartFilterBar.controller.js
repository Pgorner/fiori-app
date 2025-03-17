sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataUtils"
], function (Controller, ODataUtils) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar.Annotations.SmartFilterBar", {
		onInit: function () {
			this.getView().bindElement("/MainEntitySet('001')");
		},
		onSearch: function() {
			var oSmartFilterBar = this.byId("smartFilterBar"),
				oFilterResult = this.byId("filterResult"),
				oFilterProvider = oSmartFilterBar._oFilterProvider;
			/** The following code is used only for the purpose of the demo to visualize the filter query
				and since private controls are invoked it shouldn't be used in application scenarios! */
			oFilterResult.setText(decodeURIComponent(
				ODataUtils.createFilterParams(
					oSmartFilterBar.getFilters(),
					oFilterProvider._oParentODataModel.oMetadata,
					oFilterProvider._oMetadataAnalyser._getEntityDefinition(oFilterProvider.sEntityType)
				)
			));
		}
	});
});
