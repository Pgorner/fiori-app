//.../S4-FIORI-CORE-4/i2d.le.st.delivery.output/blob/main/webapp/ext/controller/CustomDateFilter.js
//.../S4-FIORI-CORE-4/i2d.le.st.delivery.manage/blob/main/webapp/ext/controllers/CustomDateFilter.js

sap.ui.define([
		"sap/ui/comp/config/condition/DateRangeType"
	],
	function (DateRangeType) {
		"use strict";

		/****************************************************************
		 * extends DateRangeType with CustomDateFilter.js
		 ****************************************************************/
		var CustomDateFilter = DateRangeType.extend("Test5", {
			constructor: function (sFieldName, oFilterProvider, oFieldViewMetadata) {
				DateRangeType.apply(this, [
					sFieldName, oFilterProvider, oFieldViewMetadata
				]);
				this.setAsync(true);
			}
		});

		CustomDateFilter.Operations = {};

		/****************************************************************
		 * initialize custom filters and default values
		 ****************************************************************/
		CustomDateFilter.initializeOperations = function () {

			/*-----------------------------------------------
			Functions for date handling
			------------------------------------------------*/
			var getShiftedDate = function (iShift) {
				var oDate = new Date();
				var oReturnDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate() + iShift);
				return oReturnDate;
			};

			var getNextWeek = function (oDate) {
				var oReturnDate = new Date(oDate || new Date());
				oReturnDate.setDate(oReturnDate.getDate() + (7 - 1 - oReturnDate.getDay() + 7) % 7 + 1);
				return oReturnDate;
			};

			/*-----------------------------------------------
			prepare date range arrays for custom date ranges
			these arrays will be used to set the default
			values for the custom filters
			------------------------------------------------*/
			var oToday = new Date();
			var aTodayAndTomorrow = [getShiftedDate(0), getShiftedDate(1)];
			var aDueUpUntilNextWeek = [new Date("2002", oToday.getMonth(), oToday.getDate()), getNextWeek(getShiftedDate(7))];
			var aDueUpUntilTomorrow = [new Date("2002", oToday.getMonth(), oToday.getDate()), getShiftedDate(1)];

			/*-----------------------------------------------
			create operations for custom date filter
			------------------------------------------------*/
			CustomDateFilter.Operations.TodayAndTomorrow = DateRangeType.getFixedRangeOperation(
				"TodayAndTomorrow", {
					key: "TodayAndTomorrow",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n" //messagebundle.properties is used
				},
				"DynamicRange" //Category
			);
			CustomDateFilter.Operations.TodayAndTomorrow.defaultValues = aTodayAndTomorrow;

			CustomDateFilter.Operations.DueUpUntilNextWeek = DateRangeType.getFixedRangeOperation(
				"DueUpUntilNextWeek", {
					key: "DueUpUntilNextWeek",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n" //messagebundle.properties is used
				},
				"DynamicRange" //Category
			);
			CustomDateFilter.Operations.DueUpUntilNextWeek.defaultValues = aDueUpUntilNextWeek;

			CustomDateFilter.Operations.DueUpUntilTomorrow = DateRangeType.getFixedRangeOperation(
				"DueUpUntilTomorrow", {
					key: "DueUpUntilTomorrow",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n" //messagebundle.properties is used
				},
				"DynamicRange" //Category
			);
			CustomDateFilter.Operations.DueUpUntilTomorrow.defaultValues = aDueUpUntilTomorrow;
		};

		CustomDateFilter.initializeOperations();

		// /****************************************************************
		//  * set default value to be selected in the control
		//  * @returns {object}
		// ****************************************************************/
		// CustomDateFilter.prototype.getDefaultOperation = function() {
		// 	return CustomDateFilter.Operations.TodayAndTomorrow;
		// };

		/****************************************************************
		 * return custom operations
		 * @returns {array}
		 ****************************************************************/
		CustomDateFilter.prototype.getOperations = function () {
			/*updates list due to excludes in the condition type*/
			var aOperations = DateRangeType.prototype.getOperations.apply(this, []);
			var oCustomDateFilterOperations = CustomDateFilter.Operations;

			/*pushes custom filter fields to dynamic date control*/
			for (var prop in oCustomDateFilterOperations) {
				if (oCustomDateFilterOperations[prop]) {
					var currentOperation = oCustomDateFilterOperations[prop];
					if (currentOperation.defaultValues) {
						aOperations.push(currentOperation);
					}
				}
			}

			return aOperations;
		};

		return CustomDateFilter;

	}, /* bExport= */ true);
