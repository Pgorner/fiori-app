/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"../DefBase",
	"sap/gantt/misc/Format",
	"sap/gantt/simple/AggregationUtils"
], function (DefBase,Format, AggregationUtils) {
	"use strict";

	/**
	 * Creates and initializes a calendar defined and embedded in a 'defs' tag for later reuse.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A calendar that contains a list of time interval definitions.
	 *
	 * <p>
	 * A pattern definition is generated per calendar key.
	 * </p>
	 *
	 * @extends sap.gantt.def.DefBase
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.def.cal.Calendar
	 */
	var Calendar = DefBase.extend("sap.gantt.def.cal.Calendar", /** @lends sap.gantt.def.cal.Calendar */ {
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * Key of the calendar. Note that this value is used to generate the referencing string of the calendar pattern.
				 */
				key: {type : "string", defaultValue : "calendar"},

				/**
				 * Background color of time intervals.
				 */
				backgroundColor: {type : "sap.gantt.ValueSVGPaintServer", defaultValue: "#e5e5e5"}
			},
			defaultAggregation: "timeIntervals",
			aggregations: {

				/**
				 * Time intervals that should be painted with the value of <code>backgroundColor</code>.
				 */
				timeIntervals: {type: "sap.gantt.def.cal.TimeInterval", multiple: true,
					singularName: "timeInterval",bindable: "bindable"}
			}
		}
	});

	Calendar.prototype.getDefNode = function () {
		var oParentGantt = (this.getParent() && this.getParent().getParent()) ? this.getParent().getParent() : null;
		var aTimeIntervals = this.getTimeIntervals();
		var oStatusSet = oParentGantt ? oParentGantt._oStatusSet : null;
		var oViewBoundary = oStatusSet ? oStatusSet.aViewBoundary : null;
		var oTimeBoundary = oStatusSet ? oStatusSet.aTimeBoundary : null;

		var aFilteredTimeIntervals = aTimeIntervals;
		if (oTimeBoundary && oStatusSet) {
			aFilteredTimeIntervals = aTimeIntervals.filter(function(oItem) {
				var startTime = Format.abapTimestampToDate(oItem.getStartTime());
				var endTime = Format.abapTimestampToDate(oItem.getEndTime());
				var startBoundary = oStatusSet.bRTL ? oTimeBoundary[1] : oTimeBoundary[0],
					endBoundary = oStatusSet.bRTL ? oTimeBoundary[0] : oTimeBoundary[1];

				return endTime > startBoundary && startTime < endBoundary;
			});
		}
		var width = (oViewBoundary && oViewBoundary.length > 1 ) ? (oViewBoundary[1] - oViewBoundary[0]) : 1;
		var patternObj = {
			id: this.generateRefId(),
			x: 0,
			y: 0,
			width: width,
			timeIntervals: []
		};

		var aAllRows = (oParentGantt && oParentGantt.getAggregation("table")) ? oParentGantt.getTable().getRows() : null;
		if (aAllRows && aAllRows.length > 0) {
			aAllRows.forEach(function(aRow){
				if (!patternObj.title || patternObj.title === "") {
					var oRowSetting = aRow.getAggregation("_settings");
					if (oRowSetting) {
						var mAggregations = AggregationUtils.getAllNonLazyAggregations(oRowSetting);
						var aMultiCalendarsInRow = Object.keys(mAggregations).filter(function(sName){
							return (sName.indexOf("calendars") === 0);
						}).map(function(sName){
							return oRowSetting.getAggregation(sName) || [];
						});

						aMultiCalendarsInRow.forEach(function(aBaseCalendars) {
							if (aBaseCalendars && aBaseCalendars.length > 0) {
								var aCalendar = aBaseCalendars.filter(function(cal){
									return this.getKey() === cal.getCalendarName();
								}.bind(this));

								var title = (aCalendar && aCalendar.length > 0) ? aCalendar[0].getTitle() : null;
								var calendarNode = (aCalendar && aCalendar.length > 0) ? aCalendar[0] : null;
								patternObj['title'] = title;
								patternObj['baseCalender'] = calendarNode;
							}
						}.bind(this));
					}
				}
			}.bind(this));
		}

		//Filter out calendars in the visible time range
		if (oParentGantt && oParentGantt.isA("sap.gantt.simple.GanttChartWithTable")) {
			aFilteredTimeIntervals = aTimeIntervals.filter(function(oTimeInterval) {
				return oParentGantt.isCalendarTimeIntervalVisible(oTimeInterval);
			});
		}

		for (var i = 0; i < aFilteredTimeIntervals.length; i++) {
			var oInterval = aFilteredTimeIntervals[i].getDefNode();
			oInterval.fill = this.getBackgroundColor();
			patternObj.timeIntervals.push(oInterval);
		}

		return patternObj;
	};

	Calendar.prototype.generateRefId = function () {
		var sId = (this.getParent() && this.getParent().getParent()) ? this.getParent().getParent().getId() : "";
		return sId + "_" + this.getKey();
	};

	return Calendar;
}, true);
