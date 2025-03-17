sap.ui.define([
		"sap/ui/comp/config/condition/DateRangeType",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/base/Log"
	],
	function (DateRangeType, ODataModel, Filter, FilterOperator, Log) {
		"use strict";

		/**
		 * @class
		 * The FiscalDateRangeType is the implementation of a customized ConditionType for providing
		 * date ranges based on the fiscal calendar as filter criteria. It is used in the ControlConfiguration
		 * of the SmartFilterBar.
		 *
		 * Requires UI5 1.36.3 and higher
		 *
		 * @extends sap.ui.comp.config.condition.DateRangeType
		 * @constructor
		 * @public
		 * @alias sap.fin.central.lib.daterange.FiscalDateRangeType
		 */
		var FiscalDateRangeType = DateRangeType.extend("FiscalDateRangeType",
			/** @lends sap.fin.central.lib.daterange.FiscalDateRangeType.prototype */
			{

				/**
				 * list for arguments: sFieldName, oFilterProvider, oFieldViewMetadata
				 */
				constructor: function () {
					DateRangeType.apply(this, arguments);
					this._sFiscalYearVariant = "";
					this._bEntitySetExists = true;
					this._sDefaultOperation = "DATERANGE";
					// Order is important! First, set async to true, then set pending to true, because setPending is only executed in the asynchronous mode.
					this.setAsync(true);
					this.setPending(true);
				}
			});

		FiscalDateRangeType.Operations = {};

		FiscalDateRangeType.FiscalOperations = [
			"FISCAL_YEAR_TO_DATE",
			"THIS_FISCAL_PERIOD",
			"LAST_FISCAL_PERIOD",
			"THIS_FISCAL_QUARTER",
			"LAST_FISCAL_QUARTER",
			"THIS_FISCAL_YEAR",
			"LAST_FISCAL_YEAR"
		];

		/**
		 * used for Operations definition available from FiscalDateRangeType control
		 * where number is than "translated" into FiscalOperation
		 * in method processSingleAdditionalFiscalPeriod
		 */
		FiscalDateRangeType.prevFiscalPeriodsVocebulary = {
			"1": "FIRST_FISCAL_QUARTER",
			"2": "SECOND_FISCAL_QUARTER",
			"3": "THIRD_FISCAL_QUARTER",
			"4": "FOURTH_FISCAL_QUARTER"
		};

		FiscalDateRangeType.initializeOperations = function () {
			var order = 30;
			FiscalDateRangeType.FiscalOperations.forEach(function (el) {
				order++;
				FiscalDateRangeType.Operations[el] = DateRangeType.getFixedRangeOperation(
					el, {
						key: "DR_" + el,
						bundle: "sap.fin.central.lib"
					},
					"FISCAL", undefined, undefined, order);
			});

		};

		FiscalDateRangeType.initializeOperations();

		FiscalDateRangeType.prototype.getOperations = function () {
			var aOperations = DateRangeType.prototype.getOperations.apply(this, []);
			if (this.getFiscalYearVariant() !== "" && !this.isPending()) {
				// add the fiscal operations
				FiscalDateRangeType.FiscalOperations.forEach(function (el) {
					if (FiscalDateRangeType.Operations[el].visible) {
						aOperations.push(FiscalDateRangeType.Operations[el]);
					}
				});
			}
			return aOperations;
		};

		// check if new fields are already added to avoid adding duplicit options
		FiscalDateRangeType.prototype.checkExtentendOperations = function () {
			var extendedOperation = "FIRST_FISCAL_QUARTER";
			var resArr = FiscalDateRangeType.FiscalOperations.filter(function(item) {
				if (item === extendedOperation) {
					return true;
				}
			});
			// returns true if new operations are not added yet
			return resArr.length === 0;
		};

		/**
		 * the existence check for the entity sets cannot be done in this method, because the entity sets for the value helps
		 * are not necessarily processed. The same is true for the first call of method providerDataUpdated.
		 * @param oSettings
		 */
		FiscalDateRangeType.prototype.applySettings = function (oSettings) {
			DateRangeType.prototype.applySettings.apply(this, arguments);
			this.extendedDataVersion = false;
			var warningText = "";

			this._entitySetForFiscalYearVariant = oSettings.entitySetForFiscalYearVariant;
			// to ensure the independency of FE & BE, the XML-set property entitySetForFiscalYearVariant has to be kept for fallback reasons and
			// new XML property can be set (named entitySetForFiscalYearProperties)
			this._entitySetForFiscalYearProperties = oSettings.entitySetForFiscalYearProperties;

			// indicates whether extended version of control is used
			if (this._entitySetForFiscalYearProperties !== undefined && this.getParent().getModel().getMetaModel().getODataEntitySet(this._entitySetForFiscalYearProperties) !== null) {
				this.extendedDataVersion = true;
				// if entity sets are available use extended verison of control automaticaly - there is no need to chnage control definition
				// in each application and adding new entity set into project is then enaugh
			} else if (this.getParent().getModel().getMetaModel().getODataEntitySet("I_FiscCalendarDateForCompCode") !== null) {
				this.extendedDataVersion = true;
				this._entitySetForFiscalYearProperties = oSettings.entitySetForFiscalYearProperties = "I_FiscCalendarDateForCompCode";
				warningText = "FiscalDateRangeType.providerDataUpdated: extended control version used, although UI property _entitySetForFiscalYearProperties was not yet maintained.";
			} else if (this.getParent().getModel().getMetaModel().getODataEntitySet("I_FiscalCalendarDateForLedger") !== null) {
				this.extendedDataVersion = true;
				this._entitySetForFiscalYearProperties = oSettings.entitySetForFiscalYearProperties = "I_FiscalCalendarDateForLedger";
				warningText = "FiscalDateRangeType.providerDataUpdated: extended control version used, although UI property _entitySetForFiscalYearProperties was not yet maintained.";
			}

			if (this.extendedDataVersion && this.checkExtentendOperations()) {
				// add dynamically additional fields when new/extended version of control is defined
				FiscalDateRangeType.FiscalOperations = FiscalDateRangeType.FiscalOperations.concat([
					"FIRST_FISCAL_QUARTER",
					"SECOND_FISCAL_QUARTER",
					"THIRD_FISCAL_QUARTER",
					"FOURTH_FISCAL_QUARTER"
				]);
				FiscalDateRangeType.initializeOperations();
				Log.warning(warningText);
			}

			// entity set for the second call to retrieve exact values
			this._entitySetForFiscalCalendar = oSettings.entitySetForFiscalCalendar || "I_FiscalCalendarDtePrevPeriods";
			if (oSettings.defaultOperation) {
				this._sDefaultOperation = oSettings.defaultOperation;
				this._sDefaultOperation = oSettings.defaultOperation;
			}
		};

		FiscalDateRangeType.prototype.getDefaultOperation = function () {
			if (this.getFiscalYearVariant() !== "" && FiscalDateRangeType.Operations[this._sDefaultOperation] !== undefined) {
				return FiscalDateRangeType.Operations[this._sDefaultOperation];
			} else if (DateRangeType.Operations[this._sDefaultOperation] !== undefined) {
				return DateRangeType.Operations[this._sDefaultOperation];
			} else {
				return DateRangeType.Operations["DATERANGE"];
			}
		};

		FiscalDateRangeType.prototype.setFiscalYearVariant = function (sFiscalYearVariant) {
			this._sFiscalYearVariant = sFiscalYearVariant;
		};

		FiscalDateRangeType.prototype.getFiscalYearVariant = function () {
			return this._sFiscalYearVariant;
		};

		FiscalDateRangeType.prototype.setFiscalDataProperties = function (sFiscalDataProp) {
			this._additionalFiscalDateProperties = sFiscalDataProp;
		};

		FiscalDateRangeType.prototype.getFiscalDataProperties = function () {
			return this._additionalFiscalDateProperties;
		};

		FiscalDateRangeType.prototype.providerDataUpdated = function (aFieldNames, oData) {
			var firstCallEntitySet;
			var retVal = false;
			var warningText = "";
			if (this._bEntitySetExists === false) {
				return;
			}
			if (!aFieldNames) {
				Log.info("FiscalDateRangeType.providerDataUpdated: no field names provided");
				this.setPending(false);
				return;
			}
			// the fiscal year variant depends on CompanyCode and Ledger.
			// If any of the 2 fields changes, we need to update the fiscal year variant. Otherwise we ignore the filter change.
			var bUpdate = false;
			for (var i = 0; i < aFieldNames.length; i++) {
				if (aFieldNames[i] === "CompanyCode" || aFieldNames[i] === "Ledger") {
					bUpdate = true;
					break;
				}
			}
			if (!bUpdate) {
				// no update necessary
				this.setPending(false);
				return;
			} else if (this.getParent().getFilters(["CompanyCode"]).length === 0) {
				// if the fields are listed as having changed, then check if there is a filter value for the field CompanyCode.
				// if the filter is empty, then ignore the filter change. This happens e.g. when the app starts and the filter bar is initialized,
				// or when the field CompanyCode is empty and the user changes the Ledger.
				this.setPending(false);
				this.setFiscalYearVariant("");
				this.setFiscalDataProperties(null);
				this.updateOperations();
				return;
			}

			// check if there is property defined and entity set provided for a new solution
			if (this.getParent().getFilters(["CompanyCode"]).length !== 0 && this.getParent().getFilters(["Ledger"]).length !== 0) {
				// BOTH company code and ledger filters are filled
				if (this.getParent().getModel().getMetaModel().getODataEntitySet("I_FiscalCalendarDateForLedger") !== null && this.extendedDataVersion) {
					// I_FiscalCalendarDateForLedger available - new solution to retrieve more info
					if ((this._entitySetForFiscalYearProperties !== "I_FiscCalendarDateForCompCode") && (this._entitySetForFiscalYearProperties !== "I_FiscalCalendarDateForLedger")) {
						retVal = true;
						warningText = "FiscalDateRangeType.providerDataUpdated: newly filled property does not contain valid value.";
					}
					firstCallEntitySet = "I_FiscalCalendarDateForLedger";
				} else if (this.getParent().getModel().getMetaModel().getODataEntitySet("I_FiscCalendarDateForCompCode") !== null && this.extendedDataVersion) {
					// I_FiscCalendarDateForCompCode available - new solution to retrieve more info
					if ((this._entitySetForFiscalYearProperties !== "I_FiscCalendarDateForCompCode") && (this._entitySetForFiscalYearProperties !== "I_FiscalCalendarDateForLedger")) {
						retVal = true;
						warningText = "FiscalDateRangeType.providerDataUpdated: newly filled property does not contain valid value.";
					}
					firstCallEntitySet = "I_FiscCalendarDateForCompCode";
				} else {
					// old behaviour
					// check if the entity set is available in the ODataModel
					// this is possibly not the case if the app is started and the valuelists are not loaded yet
					if (this.getParent().getModel().getMetaModel().getODataEntitySet(this._entitySetForFiscalYearVariant) === null) {
						retVal = true;
						warningText =
							"FiscalDateRangeType.providerDataUpdated: the entity set for the fiscal year variant does not exist or is not loaded yet.";
					}
					firstCallEntitySet = this._entitySetForFiscalYearVariant;
				}
			} else if (this.getParent().getFilters(["CompanyCode"]).length !== 0 && this.getParent().getFilters(["Ledger"]).length === 0) {
				// ONLY company code filter is filled
				if (this.getParent().getModel().getMetaModel().getODataEntitySet("I_FiscCalendarDateForCompCode") !== null && this.extendedDataVersion) {
					// I_FiscCalendarDateForCompCode available - new solution to retrieve more info
					if ((this._entitySetForFiscalYearProperties !== "I_FiscCalendarDateForCompCode") && (this._entitySetForFiscalYearProperties !== "I_FiscalCalendarDateForLedger")) {
						retVal = true;
						warningText = "FiscalDateRangeType.providerDataUpdated: newly filled property does not contain valid value.";
					}
					firstCallEntitySet = "I_FiscCalendarDateForCompCode";
				} else {
					// old behaviour
					// check if the entity set is available in the ODataModel
					// this is possibly not the case if the app is started and the valuelists are not loaded yet
					if (this.getParent().getModel().getMetaModel().getODataEntitySet(this._entitySetForFiscalYearVariant) === null) {
						retVal = true;
						warningText =
							"FiscalDateRangeType.providerDataUpdated: the entity set for the fiscal year variant does not exist or is not loaded yet.";
					}
					firstCallEntitySet = this._entitySetForFiscalYearVariant;
				}
			} else {
				// only ledger filter filled
				retVal = true;
			}

			if (retVal) {
				this.setPending(false);
				this.setFiscalYearVariant("");
				this.setFiscalDataProperties(null);
				this.updateOperations();
				Log.warning(warningText);
				return;
			}

			this.setPending(true);
			var filters;
			// entity set I_FiscCalendarDateForCompCode does not contain Ledger property
			if (firstCallEntitySet === "I_FiscCalendarDateForCompCode") {
				filters = this.getParent().getFilters(["CompanyCode"]);
			} else {
				filters = this.getParent().getFilters(["Ledger", "CompanyCode"]);
			}
			/* eslint-disable no-unused-expressions */
			this.extendedDataVersion && filters.push(new Filter("CalendarDate", FilterOperator.EQ, new Date()));
			/* eslint-enable no-unused-expressions */

			// fetch fiscal year variant
			this.getParent().getModel().read("/" + firstCallEntitySet, {
				filters: filters,
				success: function (oDataResponse) {
					var sFiscalYearVariant = "";
					if (oDataResponse.results && oDataResponse.results.length >= 1 &&
						oDataResponse.results.every(function (el) {
							return (el.FiscalYearVariant === oDataResponse.results[0].FiscalYearVariant);
						})) {
						sFiscalYearVariant = oDataResponse.results[0].FiscalYearVariant;
					}
					this.setFiscalYearVariant(sFiscalYearVariant);
					this.setFiscalDataProperties(oDataResponse.results[0]);
					if (sFiscalYearVariant !== "") {
						// fetch the fiscal year data & update the periods
						this.updateFiscalPeriods();
					} else {
						this.setPending(false);
						this.updateOperations();
					}
				}.bind(this),
				error: function (oResponse) {
					if (oResponse.statusCode === "404") {
						this._bEntitySetExists = false;
						this.setPending(false);
						this.setAsync(false);
						Log.error(
							"FiscalDateRangeType.providerDataUpdated: the entity set for the fiscal year variant does not exist.");
					} else {
						Log.error(
							"FiscalDateRangeType.providerDataUpdated: request for fiscal year variant of company codes failed (" + oResponse.statusCode +
							")");
						this.setPending(false);
					}
					this.setFiscalYearVariant("");
					this.setFiscalDataProperties(null);
					this.updateOperations();
				}.bind(this)
			});
		};

		FiscalDateRangeType.prototype.convertODataDate = function (oData, sProperty) {
			if (oData[sProperty]) {
				return new Date(oData[sProperty].getTime() + oData[sProperty].getTimezoneOffset() * 60000);
			}
			return null;
		};

		FiscalDateRangeType.prototype.updateFiscalOperation = function (sOperation, oStartDate, oEndDate) {

			if (oStartDate && oEndDate) {
				FiscalDateRangeType.Operations[sOperation].defaultValues = [
					oStartDate,
					oEndDate
				];
				FiscalDateRangeType.Operations[sOperation].visible = true;
				delete FiscalDateRangeType.Operations[sOperation].textValue;
			} else {
				FiscalDateRangeType.Operations[sOperation].visible = false;
			}

		};

		FiscalDateRangeType.prototype.updateFiscalPeriods = function () {
			var sFiscalYearVariant = this.getFiscalYearVariant();
			var today = new Date();
			// request is sent in UTC so actual time is shifted (due to timezone) and periods could be wrong
			today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
			if (!sFiscalYearVariant || typeof sFiscalYearVariant !== "string") {
				Log.error("FiscalDateRangeType.updateFiscalPeriods: invalid parameter sFiscalYearVariant: " + sFiscalYearVariant);
				return;
			}

			var sSelect = "FiscalYearStartDate,FiscalYearEndDate,FiscalPeriodStartDate,FiscalPeriodEndDate,PreviousFiscalPeriodStartDate,"
				+ "PreviousFiscalPeriodEndDate,FiscalQuarterStartDate,FiscalQuarterEndDate,PreviousFiscalQuarterStartDate,"
				+ "PreviousFiscalQuarterEndDate,PreviousFiscalYearStartDate,PreviousFiscalYearEndDate";

			if (this.extendedDataVersion) {
				sSelect += ",FiscalQuarterStartDate,FiscalQuarterEndDate,FiscalQuarter,CalendarDate";
			}

			this.getParent().getModel().read("/" + this._entitySetForFiscalCalendar, {
				filters: this.getFiscalCalenderFilters(today),
				urlParameters: {
					"$select": sSelect
				},
				success: function (oData) {
					if (oData.results) {
						if (this.extendedDataVersion) {
							// if _additionalFiscalDateProperties are empty, do not perform further calculation
							if (this.getFiscalDataProperties()){
								oData = this.calculateAdditionalFiscalPeriods(oData);
							}
						} else {
							oData = oData.results[0];
						}

						// dates are provided by the OData service in UTC with time 00:00:00, which equals e.g. 02:00:00 GMT+0200 (CEST)
						// this clashes with the date handling in the SmartFilterBar, when UTC is used for the dateFormatSettings
						// so we have to remove the timezone offset for correct date handling.
						// The timezone offset has to be taken from each date separately because of winter/summer time

						var FiscalYearStartDate = this.convertODataDate(oData, "FiscalYearStartDate");
						var FiscalYearEndDate = this.convertODataDate(oData, "FiscalYearEndDate");
						var FiscalPeriodStartDate = this.convertODataDate(oData, "FiscalPeriodStartDate");
						var FiscalPeriodEndDate = this.convertODataDate(oData, "FiscalPeriodEndDate");
						var PreviousFiscalPeriodStartDate = this.convertODataDate(oData, "PreviousFiscalPeriodStartDate");
						var PreviousFiscalPeriodEndDate = this.convertODataDate(oData, "PreviousFiscalPeriodEndDate");
						var FiscalQuarterStartDate = this.convertODataDate(oData, "FiscalQuarterStartDate");
						var FiscalQuarterEndDate = this.convertODataDate(oData, "FiscalQuarterEndDate");
						var PreviousFiscalQuarterStartDate = this.convertODataDate(oData, "PreviousFiscalQuarterStartDate");
						var PreviousFiscalQuarterEndDate = this.convertODataDate(oData, "PreviousFiscalQuarterEndDate");
						var PreviousFiscalYearStartDate = this.convertODataDate(oData, "PreviousFiscalYearStartDate");
						var PreviousFiscalYearEndDate = this.convertODataDate(oData, "PreviousFiscalYearEndDate");

						this.updateFiscalOperation("FISCAL_YEAR_TO_DATE", FiscalYearStartDate, new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
						this.updateFiscalOperation("THIS_FISCAL_PERIOD", FiscalPeriodStartDate, FiscalPeriodEndDate);
						this.updateFiscalOperation("LAST_FISCAL_PERIOD", PreviousFiscalPeriodStartDate, PreviousFiscalPeriodEndDate);
						this.updateFiscalOperation("THIS_FISCAL_QUARTER", FiscalQuarterStartDate, FiscalQuarterEndDate);
						this.updateFiscalOperation("LAST_FISCAL_QUARTER", PreviousFiscalQuarterStartDate, PreviousFiscalQuarterEndDate);
						this.updateFiscalOperation("THIS_FISCAL_YEAR", FiscalYearStartDate, FiscalYearEndDate);
						this.updateFiscalOperation("LAST_FISCAL_YEAR", PreviousFiscalYearStartDate, PreviousFiscalYearEndDate);

					} else {

						Log.error("FiscalDateRangeType.updateFiscalPeriods: could not load periods for fiscal year variant " +
							sFiscalYearVariant);
						this.setFiscalYearVariant("");
						this.setFiscalDataProperties(null);

					}

					this.setPending(false);
					this.updateOperations();

				}.bind(this),
				error: function (oResponse) {
					if (oResponse.statusCode === "404") {
						this._bEntitySetExists = false;
						this.setPending(false);
						this.setAsync(false);
						Log.error("FiscalDateRangeType.updateFiscalPeriods: the entity set for the fiscal calendar does not exist.");
					} else {
						Log.error("FiscalDateRangeType.updateFiscalPeriods: could not load periods for " +
							"fiscal year variant " + sFiscalYearVariant + " (" + oResponse.statusCode + ")");
						this.setPending(false);
					}
					this.setFiscalYearVariant("");
					this.setFiscalDataProperties(null);
					this.updateOperations();
				}.bind(this)
			});
		};

		FiscalDateRangeType.prototype.getFiscalCalenderFilters = function (today) {
			var filters = [];
			if (this.extendedDataVersion) {
				filters.push(new Filter("FiscalYearVariant", FilterOperator.EQ, this.getFiscalYearVariant()));
				filters.push(new Filter("FiscalYear", FilterOperator.EQ, this.getFiscalDataProperties().FiscalYear));
				filters.push(new Filter("FiscalQuarter", FilterOperator.BT, 1, 4));
			} else {
				filters.push(new Filter("FiscalYearVariant", FilterOperator.EQ, this.getFiscalYearVariant()));
				filters.push(new Filter("CalendarDate", FilterOperator.EQ, today));
			}
			return filters;
		};

		// process additional fiscal information
		FiscalDateRangeType.prototype.calculateAdditionalFiscalPeriods = function (oData) {
			var prevFiscalPeriods = {};
			oData.results.forEach(function (item) {
				if (prevFiscalPeriods[item.FiscalQuarter] === undefined) {
					prevFiscalPeriods[item.FiscalQuarter] = item;
				}
			});
			Object.keys(prevFiscalPeriods).forEach(function (key) {
				this.processSingleAdditionalFiscalPeriod(prevFiscalPeriods[key], key);
			}.bind(this));
			if (Object.keys(prevFiscalPeriods).length > 0) {
				FiscalDateRangeType.FiscalOperations.forEach(function (el) {
					delete FiscalDateRangeType.Operations[el].textValue;
				});
			}
			/**
			 * In old version there were only one result returned from query but in new/extended version of implementation
			 * could be more results returned because there is parametr today missing in backend call so this filter is used to
			 * determine data for actual date
			 */
			return oData.results.filter(function (item) {
				if (item.CalendarDate.toLocaleDateString() === this.getFiscalDataProperties().CalendarDate.toLocaleDateString()) {
					return true;
				}
				return false;
			}.bind(this))[0];
		};

		// calculare start and end date for each fiscal quarter
		FiscalDateRangeType.prototype.processSingleAdditionalFiscalPeriod = function (oData, key) {

			var FiscalQuarterStartDate = this.convertODataDate(oData, "FiscalQuarterStartDate");
			var FiscalQuarterEndDate = this.convertODataDate(oData, "FiscalQuarterEndDate");

			this.updateFiscalOperation(FiscalDateRangeType.prevFiscalPeriodsVocebulary[key], FiscalQuarterStartDate, FiscalQuarterEndDate);

		};

		return FiscalDateRangeType;
	}, /* bExport= */ true);
