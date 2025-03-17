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

	return Controller.extend("applicationUnderTest.smartfilterbar_Timezone_UTC.SmartFilterBar", {
		oResults: {
			filterQueryInput: "",
			variantInput: "",
			uiStateInput: "",
			filterModelInput: "",
			isUsingUI5DateInput: ""
		},

		onInit: function() {
			this._oDateToSet1 = UI5Date.getInstance(2023, 1, 1); // 1st of February 2023
			this._sDateToSet1 = this._oDateToSet1.toISOString();
			this._oDateToSet2 = UI5Date.getInstance(2023, 1, 8, 23, 59, 59, 999); // 8th of February 2023
			this._sDateToSet2 = this._oDateToSet2.toISOString();
			this._sStringDate1 = "20230201";
			this._sStringDate2 = "20230208";
			this._oDateTimeToSet1 = UI5Date.getInstance(Date.UTC(2023, 1, 1, 13, 30));
			this._sDateTimeToSet1 = this._oDateTimeToSet1.toISOString();
			this._oTimeToSet = UI5Date.getInstance(1970, 0, 1, 13, 30);
			this._sTimeToSet = "1970-01-01T13:30:00.000";
			this._sSelectedKey = "none";
			this._oSFB = this.getView().byId("smartFilterBar");
			this._sModelStoreFormat;

			this.getView().setModel(new ODataModel("/smartfilterbar_Timezone_UTC", true));
			this.getView().byId("FLPtimezoneText").setText(Localization.getTimezone());
			this.getView().byId("systemTimezoneText").setText(new Intl.DateTimeFormat().resolvedOptions().timeZone);
		},

		onChangeVisibleField: function (oEvent) {
			this._sSelectedKey = oEvent.getSource().getSelectedKey();

			this._oSFB.getFilterGroupItems().forEach(function (oFilterGroupItem) {
				oFilterGroupItem.setVisibleInFilterBar(oFilterGroupItem.getName() === this._sSelectedKey);
			}, this);

			this._sModelStoreFormat = this.getView().getModel("fieldTypes").getData().find(function (oFieldType) {
				return oFieldType.key === this._sSelectedKey;
			}, this).modelStoreFormat;

			this._oSFB.fireClear();
		},

		onSetFilterDataWithDate: function () {
			var oData = {};
			oData[this._sSelectedKey] = this._prepareModelData();
			this._oSFB.setFilterData(oData);
			this._oSFB.fireSearch();
		},

		onSetFilterDataWithString: function () {
			var oData = {};
			oData[this._sSelectedKey] = this._prepareModelData(true);
			this._oSFB.setFilterData(oData);
			this._oSFB.fireSearch();
		},

		onSetFilterDataGetFilterData: function () {
			this._oSFB.setFilterData(this._oSFB.getFilterData());
			this._oSFB.fireSearch();
		},

		onSetUiStateGetUiStatePress: function () {
			this._oSFB.setUiState(this._oSFB.getUiState());
			this._oSFB.fireSearch();
		},

		onSearch: function() {
			this.oResults = {
				filterQueryInput: this._printFilters(this._oSFB.getFilters()),
				variantInput: this._getVariantValue(this._oSFB.fetchVariant().filterBarVariant),
				uiStateInput: this._getUiStateValue(this._oSFB.getUiState().getSelectionVariant().SelectOptions[0].Ranges[0]),
				filterModelInput: this._getFilterModelValue(this._oSFB.getFilterData()),
				isUsingUI5DateInput: this._getIsUsingUI5DateValue(this._oSFB.getFilterData())
			};
			this.getView().getModel("resultsView").refresh(true);
		},

		onClear: function () {
			this.oResults = {
				filterQueryInput: "",
				variantInput: "",
				uiStateInput: "",
				filterModelInput: "",
				isUsingUI5DateInput: ""
			};
			this.getView().getModel("resultsView").refresh(true);
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

			var oFilterProvider = this._oSFB._oFilterProvider;
			var sText = ODataUtils._createFilterParams(aFilters, oFilterProvider._oParentODataModel.oMetadata, oFilterProvider._oMetadataAnalyser._getEntityDefinition(oFilterProvider.sEntityType));

			return sText ? decodeURIComponent(sText) : "";
		},

		_prepareModelData: function (bUseStringValue) {
			var oResult,
				vDate1 = bUseStringValue ? this._sDateToSet1 : this._oDateToSet1,
				vDate2 = bUseStringValue ? this._sDateToSet2 : this._oDateToSet2,
				vDateTime1 = bUseStringValue ? this._sDateTimeToSet1 : this._oDateTimeToSet1,
				vTime = bUseStringValue ? this._sTimeToSet : this._oTimeToSet;

			switch (this._sModelStoreFormat) {
				case "date":
					oResult = vDate1;
					break;
				case "datevalue":
					oResult = { value: vDate1 };
					break;
				case "low/high":
					oResult = { low: vDate1, high: vDate2 };
					break;
				case "ranges":
					oResult = {
						ranges: [{
							"exclude": false,
							"operation": "EQ",
							"keyField": this._sSelectedKey,
							"value1": vDate1,
							"value2": null
						}]
					};
					break;
				case "stringdate":
					oResult = this._sStringDate1;
					break;
				case "stringranges":
					oResult = {
						ranges: [{
							"exclude": false,
							"operation": "EQ",
							"keyField": this._sSelectedKey,
							"value1": this._sStringDate1,
							"value2": null
						}]
					};
					break;
				case "stringlow/high":
					oResult = { low: this._sStringDate1, high: this._sStringDate2 };
					break;
				case "daterangetype":
					oResult = {
						conditionTypeInfo: {
							name: "sap.ui.comp.config.condition.DateRangeType",
							data: {
								operation: "DATE",
								value1: vDate1,
								value2: null,
								key: this._sSelectedKey,
								calendarType: "Gregorian"
							}
						}
					};
					break;
				case "daterangetype/ddtoffset/interval":
					oResult = {
						conditionTypeInfo: {
							name: "sap.ui.comp.config.condition.DateRangeType",
							data: {
								operation: "DATETIME",
								value1: vDateTime1,
								value2: vDateTime1,
								key: this._sSelectedKey,
								calendarType: "Gregorian"
							}
						}
					};
					break;
				case "daterangetype/interval":
					oResult = {
						conditionTypeInfo: {
							name: "sap.ui.comp.config.condition.DateRangeType",
							data: {
								operation: "DATE",
								value1: vDate1,
								value2: vDate2,
								key: this._sSelectedKey,
								calendarType: "Gregorian"
							}
						}
					};
					break;
				case "daterangetype/stringdate":
					oResult = {
						conditionTypeInfo: {
							name: "sap.ui.comp.config.condition.DateRangeType",
							data: {
								operation: "DATE",
								value1: this._sStringDate1,
								value2: null,
								key: this._sSelectedKey,
								calendarType: "Gregorian"
							}
						}
					};
					break;
				case "daterangetype/interval/stringdate":
					oResult = {
						conditionTypeInfo: {
							name: "sap.ui.comp.config.condition.DateRangeType",
							data: {
								operation: "DATERANGE",
								value1: this._sStringDate1,
								value2: this._sStringDate2,
								key: this._sSelectedKey,
								calendarType: "Gregorian"
							}
						}
					};
					break;
				case "datetime":
					oResult = vDateTime1;
					break;
				case "datetimeranges":
					oResult = {
						ranges: [{
							"exclude": false,
							"operation": "EQ",
							"keyField": this._sSelectedKey,
							"value1": vDateTime1,
							"value2": null
						}]
					};
					break;
				case "time":
					oResult = vTime;
					break;
				case "timeranges":
					oResult = {
						ranges: [{
							"exclude": false,
							"operation": "EQ",
							"keyField": this._sSelectedKey,
							"value1": vTime,
							"value2": null
						}]
					};
					break;
			}

			return oResult;
		},

		_getVariantValue: function (sData) {
			var sResult = "",
				oData = JSON.parse(sData);

			switch (this._sModelStoreFormat) {
				case "date":
				case "stringdate":
				case "datetime":
				case "time":
					sResult = oData[this._sSelectedKey];
					break;
				case "datevalue":
					sResult = oData[this._sSelectedKey].value;
					break;
				case "low/high":
					var oFieldValue = oData[this._sSelectedKey];
					sResult = oFieldValue.low/* + "-" + oFieldValue.high*/; // TODO: existing behaviour resets the time for second date to 00:00:00 when setUiState/getUiState is called. Initially it is 23:59:59. The initial behaviour is not correct but it is working fo years like now and we will fix this later.
					break;
				case "stringlow/high":
					var oFieldValue = oData[this._sSelectedKey];
					sResult = oFieldValue.low + "-" + oFieldValue.high;
					break;
				case "ranges":
				case "stringranges":
				case "datetimeranges":
				case "timeranges":
					sResult = oData[this._sSelectedKey].ranges[0].value1;
					break;
				case "daterangetype":
				case "daterangetype/interval":
				case "daterangetype/ddtoffset/interval":
					sResult = oData[this._sSelectedKey].conditionTypeInfo.data.value1;
					break;
				case "daterangetype/stringdate":
					sResult = oData[this._sSelectedKey].conditionTypeInfo.data.value1;
					break;
				case "daterangetype/interval/stringdate":
					sResult = oData[this._sSelectedKey].conditionTypeInfo.data.value1 + "-" + oData[this._sSelectedKey].conditionTypeInfo.data.value2;
					break;
			}

			return sResult;
		},

		_getUiStateValue: function (oData) {
			var sResult = "";
			switch (this._sModelStoreFormat) {
				case "date":
				case "datevalue":
				case "stringdate":
				case "ranges":
				case "stringranges":
				case "daterangetype":
				case "daterangetype/ddtoffset/interval":
				case "daterangetype/stringdate":
				case "datetime":
				case "datetimeranges":
				case "time":
				case "timeranges":
					sResult = oData.Low;
					break;
				case "daterangetype/interval":
				case "daterangetype/interval/stringdate":
					sResult = oData.Low + "-" + oData.High;
					break;
				case "low/high":
					sResult = oData.Low/* + "-" + oData.High*/; // TODO: existing behaviour resets the time for second date to 00:00:00 when setUiState/getUiState is called. Initially it is 23:59:59. The initial behaviour is not correct but it is working fo years like now and we will fix this later.
					break;
				case "stringlow/high":
					sResult = oData.Low + "-" + oData.High;
					break;
			}

			return sResult;
		},

		_getFilterModelValue: function (oData) {
			var sResult = "";
			switch (this._sModelStoreFormat) {
				case "date":
				case "datetime":
				case "time":
					sResult = oData[this._sSelectedKey].toISOString();
					break;
				case "datevalue":
					sResult = oData[this._sSelectedKey].value.toISOString();
					break;
				case "low/high":
					var oFieldValue = oData[this._sSelectedKey];
					sResult = oFieldValue.low.toISOString()/* + "-" + oFieldValue.high.toISOString()*/; // TODO: existing behaviour resets the time for second date to 00:00:00 when setUiState/getUiState is called. Initially it is 23:59:59. The initial behaviour is not correct but it is working fo years like now and we will fix this later.
					break;
				case "ranges":
				case "datetimeranges":
				case "timeranges":
					sResult = oData[this._sSelectedKey].ranges[0].value1.toISOString();
					break;
				case "stringdate":
					sResult = oData[this._sSelectedKey];
					break;
				case "stringranges":
					sResult = oData[this._sSelectedKey].ranges[0].value1;
					break;
				case "stringlow/high":
					var oFieldValue = oData[this._sSelectedKey];
					sResult = oFieldValue.low + "-" + oFieldValue.high;
					break;
				case "daterangetype":
				case "daterangetype/interval":
				case "daterangetype/ddtoffset/interval":
					sResult = oData[this._sSelectedKey].conditionTypeInfo.data.value1.toISOString();
					break;
				case "daterangetype/stringdate":
					sResult = oData[this._sSelectedKey].conditionTypeInfo.data.value1;
					break;
				case "daterangetype/interval/stringdate":
					sResult = oData[this._sSelectedKey].conditionTypeInfo.data.value1 + "-" + oData[this._sSelectedKey].conditionTypeInfo.data.value2;
					break;
			}

			return sResult.replaceAll('"', "");
		},

		_getIsUsingUI5DateValue: function (oData) {
			var sResult = "",
				oFieldValue = oData[this._sSelectedKey];

			switch (this._sModelStoreFormat) {
				case "date":
				case "datetime":
				case "time":
					sResult = oFieldValue instanceof UI5Date;
					break;
				case "datevalue":
					sResult = oData[this._sSelectedKey].value instanceof UI5Date;
					break;
				case "low/high":
					sResult = (oFieldValue.low instanceof UI5Date)/* + "-" + (oFieldValue.high instanceof UI5Date)*/; // TODO: existing behaviour resets the time for second date to 00:00:00 when setUiState/getUiState is called. Initially it is 23:59:59. The initial behaviour is not correct but it is working fo years like now and we will fix this later.
					break;
				case "ranges":
				case "datetimeranges":
				case "timeranges":
					sResult = oFieldValue.ranges[0].value1 instanceof UI5Date;
					break;
				case "stringdate":
				case "stringranges":
				case "stringlow/high":
				case "daterangetype/stringdate":
				case "daterangetype/interval/stringdate":
					sResult = "N/A";
					break;
				case "daterangetype":
				case "daterangetype/interval":
				case "daterangetype/ddtoffset/interval":
					sResult = oFieldValue.conditionTypeInfo.data.value1 instanceof UI5Date;
					break;
			}

			return sResult;
		}
	});
});
