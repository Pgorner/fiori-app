sap.ui.define([
	'sap/ui/model/odata/ODataUtils',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageToast',
	'sap/ui/comp/state/UIState',
	'sap/ui/comp/filterbar/VariantConverterFrom',
	'sap/ui/model/Filter'

], function(ODataUtils, ODataModel, Controller, MessageToast, UIState, VariantConverterFrom, Filter) {
	"use strict";

	return Controller.extend("applicationUnderTest.smartfilterbar_DDR_OutParameters.SmartFilterBar", {

		onInit: function() {
			var oModel = new ODataModel("/DateRangeType", true);
			this.getView().setModel(oModel);

			this._oFilterBar = this.byId("smartFilterBar");
			this._oOutputParam = this.byId("outputAreaUrl");
			this._oOutputFilters = this.byId("outputAreaFilters");
			this._oOutputDataSuite = this.byId("outputAreaDataSuite");
			this._oOutputValueTexts = this.byId("outputAreaValueTexts");
			this._outputAreaToSelectionVariant = this.byId("outputAreaToSelectionVariant");
			this._outputAreaFromSelectionVariant = this.byId("outputAreaFromSelectionVariant");
			this._outputAreaFilterProviderOData = this.byId("filterProviderOdata");
			this._outputAreagetFilterData = this.byId("outputAreagetFilterData");
			this._oStatusText = this.byId("statusText");
			this._oToggleUTCButton = this.byId("toggleUTC");
			this._bStrictMode = true;
		},

		_getUiState: function() {
			var oUIState = this._oFilterBar.getUiState(),
				oDataSuite = oUIState.getSelectionVariant(),
				oValueTexts = oUIState.getValueTexts();

			return {
				selectionVariant: JSON.stringify(oDataSuite),
				valueTexts: JSON.stringify(oValueTexts)
			};
		},

		_setUiState: function(oData, sValueTexts) {

			var oUiState = new UIState({
					selectionVariant: oData,
					valueTexts: JSON.parse(sValueTexts)
				}),
				oParameter = {
					strictMode: this._bStrictMode,
					replace: true
				};

			this._oFilterBar.setUiState(oUiState, oParameter);
		},

		onSearchForFilters: function(oEvent) {
			MessageToast.show("Search triggered with filters: '" + oEvent.getParameters().newValue);
		},

		_printFilters: function(aFilters) {
			var sText,
				oFilterProvider = this._oFilterBar._oFilterProvider;

			if (aFilters.length == 0) {
				return "";
			}

			sText = ODataUtils._createFilterParams(aFilters, oFilterProvider._oParentODataModel.oMetadata, oFilterProvider._oMetadataAnalyser._getEntityDefinition(oFilterProvider.sEntityType));

			return sText ? decodeURI(sText) : "";
		},

		onSearch: function(oEvent) {
			var sParamBinding,
				sFilters,
				oDataSuite = this._getUiState();


			MessageToast.show("Search triggered");

			sParamBinding = this._oFilterBar.getAnalyticBindingPath();
			this._oOutputParam.setText(decodeURIComponent(sParamBinding));

			sFilters = this._printFilters(this._oFilterBar.getFilters());

			this._oOutputFilters.setText(decodeURIComponent(sFilters));

			this._oOutputDataSuite.setValue(JSON.stringify(JSON.parse(oDataSuite.selectionVariant), null, '  '));
			this._oOutputValueTexts.setValue(oDataSuite.valueTexts ? JSON.stringify(JSON.parse(oDataSuite.valueTexts), null, '  ') : "");

			this._outputAreaToSelectionVariant.setValue("");

			this._outputAreaFilterProviderOData.setValue(JSON.stringify(this._oFilterBar._oFilterProvider.oModel.oData, null, '  '));
			this._outputAreagetFilterData.setValue(JSON.stringify(this._oFilterBar.getFilterData(), null, '  '));
		},

		onClear: function(oEvent) {
			MessageToast.show("Clear pressed!");
		},

		onCancel: function(oEvent) {
			MessageToast.show("Cancel pressed!");
		},

		onCreateToSelectionVariant: function() {
			this._outputAreaToSelectionVariant.setValue("");
			this._outputAreaFromSelectionVariant.setValue("");
		},

		onSetFilterData: function() {
			this._oFilterBar.setFilterData(this._oFilterBar.getFilterData());
			//this._oFilterBar.setFilterData(JSON.parse(this._outputAreagetFilterData.getValue()));
		},

		onSetFilterDataAsString: function() {
			this._oFilterBar.setFilterDataAsString(this._outputAreagetFilterData.getValue());
		},

		onCreatetFromSelectionVariant: function() {
			var sPayload,
				oUiState = {},
				sTextAreaText = this._outputAreaToSelectionVariant.getValue(),
				oConverter = new VariantConverterFrom(),
				oContent = oConverter.convert(oUiState.selectionVariant, this._oFilterBar, this._bStrictMode);

			this._outputAreaFromSelectionVariant.setValue("");
			if (sTextAreaText) {
				var oSelVariant = JSON.parse(sTextAreaText),
					sValueTexts = this._oOutputValueTexts.getValue();

				oUiState.SelectionVariant = oSelVariant;
				if (oSelVariant.Parameters) {
					oUiState.Parameters = oSelVariant.Parameters;
				}
				if (oSelVariant.SelectOptions) {
					oUiState.SelectOptions = oSelVariant.SelectOptions;
				}

				this._setUiState(oUiState.SelectionVariant, sValueTexts ? sValueTexts : null);

				oUiState = this._getUiState();
				if (oContent && oContent.payload) {
					sPayload = UIState.enrichWithValueTexts(oContent.payload, JSON.parse(sValueTexts ? sValueTexts : null));
				}

				this._outputAreaFromSelectionVariant.setValue(JSON.stringify(JSON.parse(sPayload), null, '  '));
			}
		},

		onAssignedFiltersChanged: function(oEvent) {
			var sText;
			if (this._oFilterBar) {
				sText = this._oFilterBar.retrieveFiltersWithValuesAsText();
				this._oStatusText.setText(sText);
			}
		},

		onInitialized: function(oEvent) {
			// set initial UTC switch state
			var bUtc = !!this._oFilterBar._oFilterProvider._oDateFormatSettings["UTC"];
			this.getView().byId("UtcModeSwitch").setState(bUtc);
		},

		onChangeModelDefaultCountMode: function(oEvent) {
			this.getView().getModel().setDefaultCountMode("None");
		},

		onChangeModelDefaultCountModeRequest: function(oEvent) {
			this.getView().getModel().setDefaultCountMode("Request");
		}
	});
});
