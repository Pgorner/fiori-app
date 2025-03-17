sap.ui.define([
	"sap/base/i18n/Localization",
	'sap/ui/model/odata/ODataUtils',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/SeparatorItem',
	'sap/ui/core/date/UI5Date'
], function(Localization, ODataUtils, ODataModel, JSONModel, Controller, SeparatorItem, UI5Date) {
	"use strict";

	return Controller.extend("applicationUnderTest.smarttable_Timezone_UTC.SmartTable", {
		oResults: {
			filterQueryInput: "",
			variantInput: "",
			uiStateInput: "",
			filterModelInput: "",
			isUsingUI5DateInput: ""
		},

		onInit: function() {
			this._oDateToSet1 = UI5Date.getInstance(2023, 1, 1); // 1st of February 2023
			this._sDateToSet1 = "2023-02-01T00:00:00";
			this._oDateToSet2 = UI5Date.getInstance(2023, 1, 8, 23, 59, 59, 999); // 8th of February 2023
			this._sDateToSet2 = "2023-02-08T23:59:59.999";
			this._sStringDate1 = "20230201";
			this._sStringDate2 = "20230208";
			this._oDateTimeToSet1 = UI5Date.getInstance(Date.UTC(2023, 1, 1, 13, 30));
			this._oDateTimeToSet2 = UI5Date.getInstance(Date.UTC(2023, 1, 1, 13, 30));
			this._sDateTimeToSet1 = this._oDateTimeToSet1.toISOString();
			this._oTimeToSet1 = UI5Date.getInstance(1970, 0, 1, 13, 30);
			this._sTimeToSet1 = "1970-01-01T13:30:00.000";
			this._oTimeToSet2 = UI5Date.getInstance(1970, 0, 1, 14, 30);
			this._sTimeToSet2 = "1970-01-01T14:30:00.000";
			this._oSmartTable = this.getView().byId("smartTable");
			this._oChangeVisibleField = this.getView().byId("changeVisibleField");
			this._sSelectedKey = "";
			this._oSelectedField;

			this.getView().setModel(new ODataModel("/smarttable_Timezone_UTC", true));
			this.getView().byId("FLPtimezoneText").setText(Localization.getTimezone());
			this.getView().byId("systemTimezoneText").setText(new Intl.DateTimeFormat().resolvedOptions().timeZone);
		},

		onChangeVisibleField: function (oEvent) {
			this._sSelectedKey = oEvent.getSource().getSelectedKey();
			this._oSelectedField = this.getView().getModel("fieldTypes").getData().find(function (oField) {
				return oField.key === this._sSelectedKey;
			}, this);
		},

		onUpdateResults: function() {
			this.oResults = {
				filterQueryInput: this._printFilters(this._oSmartTable._getTablePersonalisationData().filters),
				variantInput: this._getVariantValue(this._oSmartTable.fetchVariant().filter.filterItems[0]),
				uiStateInput: this._getUiStateValue(this._oSmartTable.getUiState().getSelectionVariant().SelectOptions[0].Ranges[0]),
				filterModelInput: this._getFilterModelValue(this._oSmartTable._oCurrentVariant.filter.filterItems[0]),
				isUsingUI5DateInput: this._getIsUsingUI5DateValue(this._oSmartTable._oCurrentVariant.filter.filterItems[0])
			};
			this.getView().getModel("resultsView").refresh(true);
		},

		onReset: function () {
			this._clearInputs();
			this._oSmartTable.applyVariant({});
			this._oChangeVisibleField.setSelectedKey("none");
		},

		onApplyVariant: function (bWithDate) {
			this._clearInputs();

			var sType = this._oSelectedField.type,
				sOperation = sType.includes("ranges") ? "BT" : "EQ",
				vDate1 = bWithDate ? this._oDateToSet1 : this._sDateToSet1,
				vDate2 = bWithDate ? this._oDateToSet2 : this._sDateToSet2;

			if (sType === "datetime" || sType === "datetimeranges") {
				vDate1 = bWithDate ? this._oDateTimeToSet1 : this._sDateTimeToSet1;
				vDate2 = bWithDate ? this._oDateTimeToSet2 : this._sDateTimeToSet1;
			}

			if (sType === "time" || sType === "timeranges") {
				vDate1 = bWithDate ? this._oTimeToSet1 : this._sTimeToSet1;
				vDate2 = bWithDate ? this._oTimeToSet1 : this._sTimeToSet1;
			}

			if (sType === "stringdate" || sType === "stringranges") {
				vDate1 = this._sStringDate1;
				vDate2 = this._sStringDate2;
			}

			this._oSmartTable.applyVariant({
				"filter": {
					"filterItems": [{
						"exclude": false,
						"columnKey": this._sSelectedKey,
						"operation": sOperation,
						"value1": vDate1,
						"value2": sOperation === "BT" ? vDate2 : null
					}]
				}
			});

			this.onUpdateResults();
		},

		onApplyVariantFetchVariant: function () {
			this._clearInputs();
			this._oSmartTable.applyVariant(this._oSmartTable.fetchVariant());
			this.onUpdateResults();
		},

		onSetUiStateGetUiState: function () {
			this._clearInputs();
			this._oSmartTable.setUiState(this._oSmartTable.getUiState());
			this.onUpdateResults();
		},

		_formatInputValue: function (sInputId) {
			return this.oResults[sInputId];
		},

		_getGroup: function (oContext) {
			return oContext.getProperty("groupTitle");
		},

		_getGroupHeader: function (oGroup) {
			return new SeparatorItem({
				key: oGroup.key + ".key",
				text: oGroup.key
			});
		},

		_printFilters: function(aFilters) {
			if (aFilters.length === 0) {
				return "";
			}

			var oDataModelMetadata = this._oSmartTable.getModel().oMetadata,
				oMetadataAnalyser = this._oSmartTable._oTableProvider._oMetadataAnalyser,
				sEntitySet = this._oSmartTable.getEntitySet(),
				sEntityType = oMetadataAnalyser.getEntityTypeNameFromEntitySetName(sEntitySet),
				sText = ODataUtils._createFilterParams(aFilters, oDataModelMetadata, oMetadataAnalyser._getEntityDefinition(sEntityType));

			return sText ? decodeURIComponent(sText) : "";
		},

		_getVariantValue: function (oData) {
			var sResult = oData.value1 instanceof Date ? oData.value1.toISOString() : oData.value1;

			if (oData.value2) {
				sResult += "-" + (oData.value2 instanceof Date ? oData.value2.toISOString() : oData.value2);
			}

			return sResult;
		},

		_getUiStateValue: function (oData) {
			var sResult = oData.Low;

			if (oData.High) {
				sResult += "-" + oData.High;
			}

			return sResult;
		},

		_getFilterModelValue: function (oData) {
			var sResult = oData.value1 instanceof Date ? oData.value1.toISOString() : oData.value1;

			if (oData.value2) {
				sResult += "-" + (oData.value2 instanceof Date ? oData.value2.toISOString() : oData.value2);
			}

			return sResult;
		},

		_getIsUsingUI5DateValue: function (oData) {
			var sType = this._oSelectedField.type,
				sResult = "" + (oData.value1 instanceof UI5Date);

			if (sType.includes("string")) {
				sResult = "N/A";
			}

			return sResult;
		},

		_clearInputs: function () {
			this.oResults = {
				filterQueryInput: "",
				variantInput: "",
				uiStateInput: "",
				filterModelInput: "",
				isUsingUI5DateInput: ""
			};
			this.getView().getModel("resultsView").refresh(true);
		}
	});
});
