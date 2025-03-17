sap.ui.define([
	'sap/ui/model/odata/ODataUtils', 'sap/ui/model/odata/v2/ODataModel', 'sap/ui/core/mvc/Controller', 'sap/m/MessageToast', "./SelectionVariant", 'sap/ui/comp/state/UIState', 'sap/ui/comp/filterbar/VariantConverterFrom', 'sap/ui/model/Filter'

], function(ODataUtils, ODataModel, Controller, MessageToast, SelectionVariant, UIState, VariantConverterFrom, Filter) {
	"use strict";

	return Controller.extend("applicationUnderTest.smartfilterbar_CalendarWeekNumbering.SmartFilterBar", {

		onInit: function() {
			// Change the date format to one of the ABAP date formats
			// id of the ABAP data format (one of '1','2','3','4','5','6','7','8','9','A','B','C')
			//sap.ui.getCore().getConfiguration().getFormatSettings().setLegacyDateFormat("A");

			var oModel = new ODataModel("/DateRangeType", true);
			oModel.setDefaultCountMode("None");
			this.getView().setModel(oModel);
			this._oFilterBar = this.getView().byId("smartFilterBar");
		},

		onSearch: function(oEvent) {
			MessageToast.show("Search triggered");

			var sParamBinding = this._oFilterBar.getAnalyticBindingPath();
			this._oOutputParam.setText(decodeURIComponent(sParamBinding));

			var sFilters = this._printFilters(this._oFilterBar.getFilters());

			this._oOutputFilters.setText(decodeURIComponent(sFilters));

			var oDataSuite = this._getUiState();
			this._oOutputDataSuite.setValue(JSON.stringify(JSON.parse(oDataSuite.selectionVariant), null, '  '));
			this._oOutputValueTexts.setValue(oDataSuite.valueTexts ? JSON.stringify(JSON.parse(oDataSuite.valueTexts), null, '  ') : "");

			this._outputAreaToSelectionVariant.setValue("");

			this._outputAreaFilterProviderOData.setValue(JSON.stringify(this._oFilterBar._oFilterProvider.oModel.oData, null, '  '));
			this._outputAreagetFilterData.setValue(JSON.stringify(this._oFilterBar.getFilterData(), null, '  '));
		},

		onClear: function(oEvent) {
			MessageToast.show("Clear pressed!");
		},

		onRestore: function(oEvent) {
			MessageToast.show("Restore pressed!");
		},

		onCancel: function(oEvent) {
			MessageToast.show("Cancel pressed!");
		},

		onShowAllFilterFields: function(oEvent) {
			var aFilterGroupItems = this._oFilterBar.getFilterGroupItems();
			for (var i = aFilterGroupItems.length - 1; i > -1; --i) {
				aFilterGroupItems[i].setVisibleInFilterBar(true);
			}
		}
	});
});
