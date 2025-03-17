/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/chart/TimeUnitType","sap/ui/core/format/DateFormat","sap/base/i18n/date/CalendarType"],function(e,a,t){"use strict";var r={};r[e.yearmonthday]="yyyyMMdd";r[e.yearquarter]="yyyyQQQQQ";r[e.yearmonth]="yyyyMM";r[e.yearweek]="yyyyww";function n(n){var y=r[n];if(y){if(y===r[e.yearweek]){return a.getDateInstance({pattern:y,calendarType:t.Gregorian})}return a.getDateInstance({pattern:y})}else{return null}}return{getInstance:n}});
//# sourceMappingURL=DateFormatUtil.js.map