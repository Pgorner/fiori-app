/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Element"
], function (Element) {
	"use strict";

	var DateInterval = Element.extend("sap.gantt.sample.GanttChart2HideNonWorkingDateRanges.DateInterval", /** @lends sap.ui.core.Element.prototype */ {
		metadata: {
			properties: {
				/**
				 * Start date from which the time is going be skipped.
				 */
				startDate: { type: "object" },

				/**
				 * End date till which the time is going to be skipped.
				 */
				endDate: { type: "object" }
			}
		}
	});

	DateInterval.prototype.setStartDate = function (oDate) {
		this.setProperty("startDate", oDate, true);
		var oRangePattern = this.getParent();
		if (oRangePattern && oRangePattern.getEnabled()){
			oRangePattern.updateDiscontinuousProvider(oRangePattern.getDiscontinuityProvider());
		}
	};

	DateInterval.prototype.setEndDate = function (oDate) {
		this.setProperty("endDate", oDate, true);
		var oRangePattern = this.getParent();
		if (oRangePattern && oRangePattern.getEnabled()){
			oRangePattern.updateDiscontinuousProvider(oRangePattern.getDiscontinuityProvider());
		}
	};

	return DateInterval;
});
