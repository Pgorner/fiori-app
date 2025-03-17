//.../S4-FIORI-FIN/fin.gl.profitcenter.manage.v2/blob/main/webapp/ext/controller/DateRangeforMPCOnly.js
//.../S4-FIORI-FIN/fin.gl.profitcenter.whereused/blob/main/webapp/ext/controller/DateRangeWithDefault.js
//.../S4-FIORI-FIN/fin.ps.grantobj/blob/main/webapp/ext/controller/SingleDateDateRange.js
//.../S4-FIORI-FIN/fin.co.activitytype.manage.v2/blob/main/webapp/ext/controller/SingleDateDateRange.js
//.../S4-FIORI-FIN/fin.co.costcenter.manage.v2/blob/main/webapp/ext/controller/SingleDateDateRange.js
//.../S4-FIORI-FIN/fin.co.costcenter.whereused/blob/main/webapp/ext/controller/SingleDateDateRange.js
//.../S4-FIORI-CORE-7/scm.ewm.whseclerkovps1/blob/main/webapp/ext/DateRangeWithTodayAsDefault.js
//.../S4-FIORI-CORE-7/scm.ewm.leanwhseclerkovps1/blob/main/webapp/ext/DateRangeWithTodayAsDefault.js
sap.ui.define([
	"sap/ui/comp/config/condition/DateRangeType"
], function(DateRangeType) {
	"use strict";

	var DateRangeforMPCOnly = DateRangeType.extend("Test3", {
		constructor: function(sFieldName, oFilterProvider, oFieldViewMetadata) {
			DateRangeType.apply(this, [
				sFieldName, oFilterProvider, oFieldViewMetadata
			]);
		}
	});

	DateRangeforMPCOnly.prototype.getDefaultOperation = function () {
		return this.getOperation("TODAY");
	};

	return DateRangeforMPCOnly;
}, /* bExport= */ true);
