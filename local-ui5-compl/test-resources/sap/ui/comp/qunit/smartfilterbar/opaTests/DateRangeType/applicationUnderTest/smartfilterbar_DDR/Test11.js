//.../S4-FIORI-FIN/fin.gl.incomingorders/blob/main/webapp/model/RecentFiscalPeriodsDateRange.js

sap.ui.define([
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/comp/config/condition/DateRangeType"
	],
	function(ResourceModel, DateRangeType) {
		"use strict";

		var _resourceBundle;

		var _meaningfullCategories = ["DYNAMIC.DATERANGE", "DYNAMIC.MONTH.INT", "DYNAMIC.QUARTER.INT", "FIXED.QUARTER"];
		var _meaningfullKeys = ["YEARTODATE"];

		function _getActualDateRange() {
			var startDate = new Date();
			startDate.setMonth(startDate.getMonth() - 4);
			return [startDate, new Date()];
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
				"RECENTFISCALPERIODS",
				_getResourceBundle().getText("recentFiscalPeriods"),
				"FISCAL",
				_getActualDateRange());
			operation.order = 0;
			return operation;
		}

		var RecentFiscalPeriodsDateRange = DateRangeType.extend("Test11", {
			constructor: function(sFieldName, oFilterProvider, oFieldViewMetadata) {
				DateRangeType.apply(this, [
					sFieldName, oFilterProvider, oFieldViewMetadata
				]);
			}
		});

		RecentFiscalPeriodsDateRange.Operations = {
			RECENTFISCALPERIODS: _createCustomOperation()
		};

		RecentFiscalPeriodsDateRange.prototype.getOperations = function() {
			var aOperations = DateRangeType.prototype.getOperations.apply(this, []).filter(function(operation) {
				return _meaningfullCategories.indexOf(operation.category) > -1 || _meaningfullKeys.indexOf(operation.key) > -1;
			});

			aOperations.push(RecentFiscalPeriodsDateRange.Operations.RECENTFISCALPERIODS);
			return aOperations;
		};

		return RecentFiscalPeriodsDateRange;
	}, /* bExport= */ true);
