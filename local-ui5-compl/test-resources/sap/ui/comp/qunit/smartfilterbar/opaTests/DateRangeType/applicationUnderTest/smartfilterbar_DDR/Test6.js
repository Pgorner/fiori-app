//.../S4-FIORI-TRAINING/i2d.le.st.delivery.log/blob/main/webapp/ext/controllers/CustomDateFilter.js

sap.ui.define([
		"sap/ui/comp/config/condition/DateRangeType"],
	function(DateRangeType) {
		"use strict";

		var CustomDateFilter = DateRangeType.extend("Test6",{
			constructor: function(sFieldName, oFilterProvider, oFieldViewMetadata) {
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
		CustomDateFilter.initializeOperations = function() {

			/*Functions for date handling*/
			var getShiftedDate = function(iShift){
				var oDate = new Date();
				var oReturnDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate() + iShift);
				return oReturnDate;
			};

			/*prepare date range arrays for custom date ranges*/
			var oDate = new Date();
			var oToday = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
			// var oFirstDayOfTheMonth = new Date(oDate.getFullYear(), oDate.getMonth(), 1);

			var aYesterdayAndToday = [getShiftedDate(-1), oToday];
			var aLastSevenDays = [getShiftedDate(-6),oToday];
			// var aThisMonthUpUntilToday = [oFirstDayOfTheMonth, oToday];
			var aLastThirtyDays = [getShiftedDate(-30), oToday];

			/*create operations for custom date filter*/
			CustomDateFilter.Operations.YesterdayAndToday = DateRangeType.getFixedRangeOperation(
				"YesterdayAndToday",{
					key: "YesterdayAndToday", // Text Key
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n" //bundle, internally used function looks for a messagebundle.properties file
				},
				"DynamicRange"	//Category
			);
			CustomDateFilter.Operations.YesterdayAndToday.defaultValues = aYesterdayAndToday;


			CustomDateFilter.Operations.LastSevenDays = DateRangeType.getFixedRangeOperation(
				"LastSevenDays",{
					key: "LastSevenDays", // Text Key
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n" //bundle, internally used function looks for a messagebundle.properties file
				},
				"DynamicRange"	//Category
			);
			CustomDateFilter.Operations.LastSevenDays.defaultValues = aLastSevenDays;

			CustomDateFilter.Operations.LastThirtyDays = DateRangeType.getFixedRangeOperation(
				"LastThirtyDays",{
					key: "LastThirtyDays", // Text Key
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n" //bundle, internally used function looks for a messagebundle.properties file
				},
				"DynamicRange"	//Category
			);
			CustomDateFilter.Operations.LastThirtyDays.defaultValues = aLastThirtyDays;

		};

		CustomDateFilter.initializeOperations();

		/****************************************************************
		 * return custom operations
		 * @returns {array}
		 ****************************************************************/
		CustomDateFilter.prototype.getOperations = function() {
			/*updates list due to excludes in the condition type*/
			var aOperations = DateRangeType.prototype.getOperations.apply(this,[]);
			var oCustomDateFilterOperations = CustomDateFilter.Operations;

			for (var prop in oCustomDateFilterOperations){
				if (oCustomDateFilterOperations[prop]){
					var currentOperation = oCustomDateFilterOperations[prop];
					if (currentOperation.defaultValues){
						aOperations.push(currentOperation);
					}
				}
			}

			return aOperations;
		};

		return CustomDateFilter;

	},/* bExport= */ true);
