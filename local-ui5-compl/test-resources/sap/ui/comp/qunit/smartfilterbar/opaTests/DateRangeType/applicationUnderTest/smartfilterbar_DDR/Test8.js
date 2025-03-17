//.../S4-FIORI-FIN/fin.fc.grir.reconcile/blob/main/webapp/daterange/CustomDateRangeType.js

sap.ui.define([
		//"sap/ui/comp/config/condition/FiscalDateRangeType",
		"./FiscalDateRangeType",
		"sap/ui/comp/config/condition/DateRangeType",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/resource/ResourceModel"],
	function(FiscalDateRangeType, DateRangeType, ODataModel, Filter, FilterOperator,ResourceModel) {
		"use strict";

		/**
		 * @class
		 * The CustomDateRangeType is the implementation of a customized ConditionType for providing
		 * date ranges based on the fiscal calendar as filter criteria. It is used in the ControlConfiguration
		 * of the SmartFilterBar.
		 *
		 * Requires UI5 1.36.3 and higher
		 *
		 * @extends sap.ui.comp.config.condition.DateRangeType
		 * @constructor
		 * @public
		 * @alias sap.fin.central.lib.daterange.CustomDateRangeType
		 */
		var CustomDateRangeType = FiscalDateRangeType.extend("Test8",
			/** @lends fin.fc.grir.reconcile.CustomDateRangeType.prototype */ {

				/**
				 * list for arguments: sFieldName, oFilterProvider, oFieldViewMetadata
				 */
				constructor: function() {
					FiscalDateRangeType.apply(this, arguments);
				}
			});

		CustomDateRangeType.Operations = {};

		CustomDateRangeType.CustomOperations = ["GRIR_LAST_14",   // 0-14
			"GRIR_14_TO_30",  // 15-30
			"GRIR_30_TO_90",  // 31-90
			"GRIR_90_TO_180", // 91-180
			"GRIR_MORE_THAN_180" ]; // 181+

		CustomDateRangeType.initializeOperations = function() {

			CustomDateRangeType.CustomOperations.forEach(function(el){
				//FiscalDataRangeType doesn't have the function getFixedRangeOperation
				CustomDateRangeType.Operations[el] = DateRangeType.getFixedRangeOperation(el, "", "GRIR");
			});

			var today = new Date();

			CustomDateRangeType.Operations["GRIR_LAST_14"].defaultValues = [
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14, 0, 0, 0),
				new Date(today.getFullYear(), today.getMonth(), today.getDate())];

			CustomDateRangeType.Operations["GRIR_14_TO_30"].defaultValues = [
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30, 0, 0, 0),
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15, 0, 0, 0)];

			CustomDateRangeType.Operations["GRIR_30_TO_90"].defaultValues = [
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90, 0, 0, 0),
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 31, 0, 0, 0)];

			CustomDateRangeType.Operations["GRIR_90_TO_180"].defaultValues = [
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 180, 0, 0, 0),
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 91, 0, 0, 0)];

			CustomDateRangeType.Operations["GRIR_MORE_THAN_180"].defaultValues = [
				new Date(1900, 0, 1, 0, 0, 0),
				new Date(today.getFullYear(), today.getMonth(), today.getDate() - 181, 0, 0, 0)];
			var oBundle =  new ResourceModel({
				bundleName: "applicationUnderTest/smartfilterbar_DDR/i18n/i18n"
			}).getResourceBundle();

			CustomDateRangeType.Operations["GRIR_LAST_14"].languageText = oBundle.getText("DR_GRIR_LOWER_15");
			CustomDateRangeType.Operations["GRIR_14_TO_30"].languageText = oBundle.getText("DR_GRIR_15_TO_30");
			CustomDateRangeType.Operations["GRIR_30_TO_90"].languageText = oBundle.getText("DR_GRIR_31_TO_90");
			CustomDateRangeType.Operations["GRIR_90_TO_180"].languageText = oBundle.getText("DR_GRIR_91_TO_180");
			CustomDateRangeType.Operations["GRIR_MORE_THAN_180"].languageText = oBundle.getText("DR_GRIR_MORE_THAN_180");

		};

		CustomDateRangeType.initializeOperations();

		CustomDateRangeType.prototype.getOperations = function() {
			var aOperations = FiscalDateRangeType.prototype.getOperations.apply(this,[]);
			CustomDateRangeType.CustomOperations.forEach(function(el){
				aOperations.push(CustomDateRangeType.Operations[el]);
			});
			return aOperations;
		};

		/**
		 * the existence check for the entity sets cannot be done in this method, because the entity sets for the value helps
		 * are not necessarily processed. The same is true for the first call of method providerDataUpdated.
		 * @param oSettings
		 */
		CustomDateRangeType.prototype.applySettings = function(oSettings) {

			FiscalDateRangeType.prototype.applySettings.apply(this, arguments);

			if (oSettings.defaultOperation) {
				this._sDefaultOperation = oSettings.defaultOperation;
			} else {
				this._sDefaultOperation = "DATERANGE";
			}
		};

		//FiscalDateRangeType.Operations doesn't exist, that's why we need this from DateRangeType
		CustomDateRangeType.prototype.getDefaultOperation = function() {
			if (CustomDateRangeType.Operations[this._sDefaultOperation] !== undefined) {
				return CustomDateRangeType.Operations[this._sDefaultOperation];
			} else if (DateRangeType.Operations[this._sDefaultOperation] !== undefined) {
				return DateRangeType.Operations[this._sDefaultOperation];
			} else {
				return DateRangeType.Operations["DATERANGE"];
			}
		};

		return CustomDateRangeType;
	}, /* bExport= */true);
