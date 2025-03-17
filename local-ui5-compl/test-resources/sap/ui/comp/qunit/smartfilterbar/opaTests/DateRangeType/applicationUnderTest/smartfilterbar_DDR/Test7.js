//.../S4-FIORI-CORE-2/ehs.em.mypermitss1/blob/main/webapp/ext/control/ThisYearDateRange.js
//.../S4-FIORI-CORE-2/ehs.em.cmplreqmans1/blob/main/webapp/ext/control/ThisYearDateRange.js

sap.ui.define([
	"sap/ui/comp/config/condition/DateRangeType"
], function(DateRangeType) {
	"use strict";

	var DefaultDateRange = DateRangeType.extend("Test7", {

	});

	DefaultDateRange.prototype.getDefaultOperation = function () {
	    return this.getOperation("THISYEAR");
	};

	DefaultDateRange.prototype.setOperationCustom = function(sOperation,val1,val2) {
		var oOperation = this.getOperation(sOperation);
		if (oOperation) {
			this.setCondition({
				operation: oOperation.key,
				key: this.sFieldName,
				value1: val1 || null,
				value2: val2 || null
			});
			this.getModel().checkUpdate(true);
		} else {
			//log error -> operation is not possible
		}
	};
	return DefaultDateRange;

}, /* bExport= */ true);
