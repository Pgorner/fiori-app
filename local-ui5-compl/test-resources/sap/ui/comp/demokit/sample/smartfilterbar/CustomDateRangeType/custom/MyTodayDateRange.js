/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

// Provides sap.ui.comp.config.condition.DateRangeType.
sap.ui.define([
		'sap/ui/comp/config/condition/DateRangeType'
	],
	function(DateRangeType) {
		"use strict";

		var MyTodayDateRange = DateRangeType.extend("sap.ui.comp.sample.smartfilterbar.CustomDateRangeType.custom.MyTodayDateRange");


		/**
		 * function to create a new operation for a dynamic int value with a single int value.
		 *
		 * @public
		 * @since 1.60.0
		 * @param {string} sKey unique key for the new operation
		 * @param {string} sTextKey text for the new operation
		 * @param {string} sSingularTextKey singular text for the new operation
		 * @param {string} sCategory category of the operation
		 * @param {int} iDefault the default int value for the operation
		 * @param {string[]} aDescriptionTextKeys array of two descriptions text (multiple/singular text)
		 * @param {int} iOrder the order value of the new operation in the operations list
		 *
		 * @returns {object} object for the new created operation. The getDateRange on this object must be implemented.
		 */
		MyTodayDateRange.Operation = DateRangeType.createSingleIntRangeOperation(
			"TODAYPLUSMINUSX",
			"Today -/+ {0} years",
			"Today -/+ 1 years",
			"YEAR", 20, ["year", "years"],
			0
		);

		/**
		 * function to determine the date values that are used in the filter request.
		 *
		 * Normally the returned values are based on the conditions value1 and value2.
		 *
		 * @public
		 * @since 1.60.0
		 * @param {object} oCondition current DateRange condition (operation, value1, value2)
		 * @param {string} oCondition.operation Name of the custom operation
		 * @param {any} oCondition.value1 value of a condition
		 * @param {any} oCondition.value2 second value of a condition (if exist)
		 *
		 * @returns {object | null} object with operation and value1, value2 or null if value is not set.
		 */
		MyTodayDateRange.Operation.getDateRange = function(oCondition) {
			var oToday = new Date(),
				oFromDate = new Date(),
				oToDate = new Date();

			if (!oCondition.value1) {
				return null;
			}
			oFromDate.setFullYear(oToday.getFullYear() - oCondition.value1);
			oToDate.setFullYear(oToday.getFullYear() + oCondition.value1);
			return { operation: "BT", value1: oFromDate, value2: oToDate };
		};

		MyTodayDateRange.prototype.getOperations = function() {
			var aOperations = DateRangeType.prototype.getOperations.apply(this, []);
			aOperations.push(MyTodayDateRange.Operation);
			return aOperations;
		};

		return MyTodayDateRange;
	}, /* bExport= */ true);
