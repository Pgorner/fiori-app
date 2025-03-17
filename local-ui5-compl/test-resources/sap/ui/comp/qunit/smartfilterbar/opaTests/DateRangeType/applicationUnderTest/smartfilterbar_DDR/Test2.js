//.../S4-FIORI-CORE-5/rfm.assortment.module.manages1/blob/main/webapp/ext/model/ValidityEndDateRange.js

sap.ui.define([
	"sap/ui/comp/config/condition/DateRangeType",
	"sap/base/i18n/ResourceBundle",
	"sap/ui/model/resource/ResourceModel"
], function (DateRangeType, ResourceBundle,ResourceModel) {
	"use strict";

	var oResourceBundle = new ResourceModel({
		bundleName: "applicationUnderTest/smartfilterbar_DDR/i18n/i18n"
	}).getResourceBundle();


	var ValidityEndDateRange = DateRangeType.extend("Test2");

	ValidityEndDateRange.allowedOperators = [
		"TODAYUNTILINF",
		"DATERANGE",
		"DATE",
		"FROM",
		"TO"
	];

	var fromTodayOperation = DateRangeType.getFixedRangeOperation("TODAYUNTILINF",
		oResourceBundle.getText("todayToInfinityFilterText"), "DYNAMIC.DATERANGE",
		function() {
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			return [today, new Date(9999, 11, 31)];
		},
		undefined, 2);

	fromTodayOperation.display = "start";

	ValidityEndDateRange.Operation = fromTodayOperation;

	ValidityEndDateRange.Operation.getDateRange = function (oCondition) {
		return {
			operation: "BT",
			value1: oCondition.value1,
			value2: oCondition.value2
		};
	};

	ValidityEndDateRange.prototype.getOperations = function () {
		var aOperations = DateRangeType.prototype.getOperations.apply(this, []);
		aOperations.push(ValidityEndDateRange.Operation);
		aOperations = aOperations.filter(function(op) {
			return ValidityEndDateRange.allowedOperators.indexOf(op.key) !== -1;
		});
		return aOperations;
	};

	return ValidityEndDateRange;
}, /* bExport= */ true);
