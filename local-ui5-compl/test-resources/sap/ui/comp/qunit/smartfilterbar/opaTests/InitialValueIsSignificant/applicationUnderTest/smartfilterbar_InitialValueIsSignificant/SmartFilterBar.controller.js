sap.ui.define([
	'sap/ui/model/odata/ODataUtils', 'sap/ui/model/odata/v2/ODataModel', 'sap/ui/core/mvc/Controller', 'sap/m/MessageToast', "./SelectionVariant", 'sap/ui/comp/state/UIState', 'sap/ui/comp/filterbar/VariantConverterFrom', 'sap/ui/model/Filter'

], function(ODataUtils, ODataModel, Controller, MessageToast, SelectionVariant, UIState, VariantConverterFrom, Filter) {
	"use strict";

	return Controller.extend("applicationUnderTest.smartfilterbar_InitialValueIsSignificant.SmartFilterBar", {

		onInit: function() {
			// Change the date format to one of the ABAP date formats
			// id of the ABAP data format (one of '1','2','3','4','5','6','7','8','9','A','B','C')
			//sap.ui.getCore().getConfiguration().getFormatSettings().setLegacyDateFormat("A");

			var oModel = new ODataModel("/foo", true);
			oModel.setDefaultCountMode("None");
			oModel.setDefaultCountMode("None");
			this.getView().setModel(oModel);

			this._oFilterBar = this.getView().byId("smartFilterBar");
			this.oFilterResult = this.byId("filterResult");
		},

		onSearch: function(oEvent) {
			var oFP = this._oFilterBar._oFilterProvider;

			this.oFilterResult.setText(
				decodeURIComponent(
					ODataUtils._createFilterParams(
						this._oFilterBar.getFilters(),
						oFP._oParentODataModel.oMetadata,
						oFP._oMetadataAnalyser._getEntityDefinition(oFP.sEntityType)
					)
				)
			);
		}
	});
});
