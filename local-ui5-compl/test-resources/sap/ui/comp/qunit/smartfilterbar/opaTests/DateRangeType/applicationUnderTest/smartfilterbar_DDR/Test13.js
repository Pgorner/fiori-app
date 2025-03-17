//.../S4-FIORI-CORE-5/rsh.eam.lib.common/blob/main/src/sap/rsh/eam/lib/common/utils/DateRangeGantt.js
//.../S4-FIORI-CORE-5/rsh.eam.lib.common/blob/main/src/sap/rsh/eam/lib/common/utils/DateRangeAsgn.js
//.../S4-FIORI-CORE-5/rsh.eam.lib.common/blob/main/src/sap/rsh/eam/lib/common/utils/DateRangeAsgn.js
//.../S4-FIORI-CORE-5/rsh.eam.lib.common/blob/main/src/sap/rsh/eam/lib/common/utils/DateRangeGantt.js

sap.ui.define([
		"sap/ui/comp/config/condition/DateRangeType"
	],
	function (DateRangeType) {
		"use strict";
		var oDateRange = DateRangeType.extend("Test13", {
			constructor: function (sFieldName, oFilterProvider, oFieldViewMetadata) {
				DateRangeType.apply(this, [
					sFieldName, oFilterProvider, oFieldViewMetadata
				]);
				this.setAsync(false);
				this.setPending(false);
			}
		});
		oDateRange.Operations = {};
		oDateRange.initializeOperations = function () {

			oDateRange.Operations.FISCALPERIOD0 = DateRangeType.getFixedRangeOperation(
				"FISCALPERIOD0", {
					key: "Next4Week",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n"
				},
				"FISCAL");

		};
		oDateRange.initializeOperations();

		oDateRange.prototype.providerDataUpdated = function (aFieldNames) {
			DateRangeType.prototype.providerDataUpdated.apply(this, arguments);

			var sField = aFieldNames[0];
			if (aFieldNames.indexOf(sField) > -1) {
				var oStartDateNext = new Date();
				var oEndDateNext = new Date();
				oEndDateNext.setDate(oEndDateNext.getDate() + 28);
				oEndDateNext.setDate(oEndDateNext.getDate() - (oEndDateNext.getDay() + 7) % 7);
				this.updateFiscalPeriods([
					[oStartDateNext, oEndDateNext]
				]);
				this.setPending(false);
			}
		};
		oDateRange.prototype.updateFiscalPeriods = function (aRanges) {

			var oFiscalPeriodOperation = oDateRange.Operations.FISCALPERIOD0;
			oFiscalPeriodOperation.defaultValues = aRanges && aRanges[0] ? aRanges[0] : null;

			// method of the control which is being extended
			this.updateOperations();
			this.setPending(false);
		};
		oDateRange.prototype.getOperations = function () {
			var aOperations = DateRangeType.prototype.getOperations.apply(this, []);
			var aOp;
			//If there are two operations, retain them
			if (aOperations.length === 2) {
				aOp = null;
			} else {
				aOp = aOperations.length;
			}
			//Removing all the operations accept DateRange
			if (aOp) {
				var aUpdatedOperation = [];
				for (var i = 0; i < aOp; i++) {
					if (aOperations[i].key === "DATERANGE" || aOperations[i].key === "TODAYFROMTO") {
						aUpdatedOperation.push(aOperations[i]);
					}
				}
				aOperations = aUpdatedOperation;
			}
			for (var sFiscalPeriodOperation in oDateRange.Operations) {
				var oFiscalPeriodOperation = oDateRange.Operations[sFiscalPeriodOperation];
				if (oFiscalPeriodOperation.defaultValues) {
					aOperations.push(oFiscalPeriodOperation);
				}
			}
			return aOperations;
		};

		return oDateRange;
	}, true);
