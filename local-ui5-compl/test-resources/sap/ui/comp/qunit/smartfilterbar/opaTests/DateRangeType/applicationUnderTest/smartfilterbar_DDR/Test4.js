//.../S4-FIORI-FIN/fin.co.directactivityallocation.manage/blob/main/webapp/model/RecentMonthsDateRange.js
//.../S4-FIORI-FIN/fin.co.statisticalkeyfigurevalues.manage/blob/7eec90c351bf667b3d9c9c683c15f3c163bdbe1b/webapp/model/RecentMonthsDateRange.js
//.../S4-FIORI-FIN/fin.co.reassigncostrevenues/blob/554ac1d687724dee576a8587e43f4dfe24b69647/webapp/model/RecentMonthsDateRange.js

sap.ui.define([
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/comp/config/condition/DateRangeType"
	],
	function(ResourceModel, DateRangeType) {
		"use strict";
		var _resourceBundle;

		function _getActualDateRange() {
			var startDate = new Date();
			var endDate = new Date();
			startDate.setMonth(startDate.getMonth() - 3);
			startDate.setHours(0);
			startDate.setMinutes(0);
			endDate.setHours(23);
			endDate.setMinutes(59);
			return [startDate, endDate];
		}

		function _getResourceBundle() {
			if (!_resourceBundle) {
				var model = new ResourceModel({
					bundleName: "applicationUnderTest/smartfilterbar_DDR/i18n/i18n"
				});
				_resourceBundle = model.getResourceBundle();
			}
			return _resourceBundle;
		}
		function _createCustomOperation() {
			var operation = DateRangeType.getFixedRangeOperation(
				"RECENT3MONTHS",
				_getResourceBundle().getText("recent3Months"),
				"FISCAL",
				_getActualDateRange());
			operation.order = 0;
			return operation;
		}

		var RecentFiscalPeriodsDateRange = DateRangeType.extend("Test4", {
			constructor: function(sFieldName, oFilterProvider, oFieldViewMetadata) {
				DateRangeType.apply(this, [
					sFieldName, oFilterProvider, oFieldViewMetadata
				]);
			}
		});

		RecentFiscalPeriodsDateRange.Operations = {
			RECENT3MONTHS: _createCustomOperation()
		};

		RecentFiscalPeriodsDateRange.prototype.getOperations = function() {
			var aOperations = DateRangeType.prototype.getOperations();
			aOperations.push(RecentFiscalPeriodsDateRange.Operations.RECENT3MONTHS);
			return aOperations;
		};

		return RecentFiscalPeriodsDateRange;
	}, /* bExport= */ true);
