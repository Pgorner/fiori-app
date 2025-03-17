//.../smrdp/smrdp-packagingfeesvolumes-ui/blob/master/webapps/epranalytics/ext/controller/customDateRangeType.js
//.../S4-FIORI-FIN/fin.co.internalorder.whereused/blob/main/webapp/lib/DefaultDateRange.js
//.../S4-FIORI-FIN/fin.co.statisticalkeyfigure.whereused/blob/main/webapp/lib/DefaultDateRange.js
//.../S4-FIORI-FIN/fin.co.activitytypewhereused/blob/main/webapp/lib/DefaultDateRange.js
//.../S4-FIORI-CORE-6/ca.fl.managelogisticss1/blob/main/webapp/ext/controller/customDateRangeType.js

sap.ui.define([
	"sap/ui/comp/config/condition/DateRangeType"
], function(DateRangeType) {
	"use strict";

	var DefaultDateRange = DateRangeType.extend("Test1", {

	});

	DefaultDateRange.prototype.getDefaultOperation = function () {
		return this.getOperation("YEARTODATE");
	};

	return DefaultDateRange;

}, /* bExport= */ true);
