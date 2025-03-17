/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/date/UI5Date",
	"sap/ui/thirdparty/d3"
], function (DateFormat, UI5Date) {
	"use strict";

	/**
	 * A dummy constructor for Format. Do not construct a Format object; instead, call static methods abapTimestampToDate, dateToAbapTimestamp, and abapTimestampToTimeLabel directly.
	 *
	 * @class
	 * The Format class provides static methods for formatting dates, times, and timestamps to be used in sap.gantt
	 *
	 * @public
	 * @alias sap.gantt.misc.Format
	 */

	var Format = function() {
		// Do not use the constructor
		throw new Error();
	};

	Format._oDefaultDateTimeFormat = DateFormat.getDateTimeWithTimezoneInstance({
		showTimezone: false
	});

	Format._enableMillisecondSupport = false;

	/**
	 * Set the value to enable or disable millisecond support.
	 * @param {boolean} bValue The value to be set
	 *
	 * @private
	 */
	Format._setEnableMillisecondSupport = function (bValue) {
		Format._enableMillisecondSupport = bValue;
	};

	/**
	 * Returns the whether millisecond support is enabled.
	 * @return {boolean} The value of the flag
	 *
	 * @private
	 */
	Format._getEnableMillisecondSupport = function () {
		return Format._enableMillisecondSupport;
	};

	/**
	 * Converts an ABAP timestamp(eg:"20150909000000" ) into a Date instance.
	 *
	 * @param {string} sTimestamp The ABAP timestamp to convert
	 * @return {Date} The output date instance
	 * @static
	 * @public
	 */

	Format.abapTimestampToDate = function (sTimestamp) {
		if (typeof sTimestamp === "string") {
			// for the timestamp format such as "20150909000000"
			var date = new Date(sTimestamp.substr(0, 4),
					parseInt(sTimestamp.substr(4, 2)) - 1,
					sTimestamp.substr(6, 2),
					sTimestamp.substr(8, 2),
					sTimestamp.substr(10, 2),
					sTimestamp.substr(12, 2));
			//In case ts is in format of "Fri Jun 12 2015 08:00:00 GMT+0800 (China Standard Time)"
			if (isNaN(date.getTime())){
				date = new Date(sTimestamp);
				//In case ts is in ISO format of "2021-04-19T17:13:10.000Z"
				if (!isNaN(date.getTime()) && (date.toISOString() === sTimestamp)) {
					return this.abapTimestampToDate(this.isoTimestampToAbapTimestamp(sTimestamp));
				}
			} else if (Format._getEnableMillisecondSupport()) {
				var millisecond = sTimestamp.substr(14, 3);

				if (millisecond.length > 0) {
					date.setMilliseconds(parseInt(millisecond));
				}
			}
			return date;
		} else if (sTimestamp instanceof Date){
			return sTimestamp;
		}
		return null;
	};

	/**
	 * Converts an ABAP timestamp that is in UTC (eg:"20150909000000") into a date instance.
	 *
	 * @param {string} sTimestamp The ABAP timestamp to convert
	 * @return {Date} The output date instance
	 * @static
	 * @since 1.129
	 * @public
	 */
	Format.abapTimestampInUTCToDate = function (sTimestamp) {
		// Not for internal use; for formatting, use Format.abapTimestampToDate instead.
		// This API is provided for applications to format the ABAP timestamp and can be referenced by applications if needed.
		// Ref SNOW: DINC0194243
		if (typeof sTimestamp === "string") {
			var date = new Date();

			date.setUTCFullYear(
				sTimestamp.substr(0, 4),
				parseInt(sTimestamp.substr(4, 2)) - 1,
				sTimestamp.substr(6, 2));

			date.setUTCHours(
				sTimestamp.substr(8, 2),
				sTimestamp.substr(10, 2),
				sTimestamp.substr(12, 2));

			if (Format._getEnableMillisecondSupport()) {
				var millisecond = sTimestamp.substr(14, 3);

				if (millisecond.length > 0) {
					date.setUTCMilliseconds(parseInt(millisecond));
				}
			}

			return date;
		} else if (sTimestamp instanceof Date) {
			return sTimestamp;
		}

		return null;
	};

	/**
	 * Converts an ISO timestamp (example: "2021-04-19T17:13:10.000Z") into an ABAP timestamp.
	 *
	 * @param {string} sTimestamp The ISO timestamp to convert
	 * @return {string} The output ABAP timestamp
	 * @static
	 * @public
	 */

		Format.isoTimestampToAbapTimestamp = function (sTimestamp) {
		if (sTimestamp) {
			var oDate = new Date(sTimestamp);
			var sValue = "" + oDate.getUTCFullYear() +
				(oDate.getUTCMonth() < 9 ? "0" : "") + (oDate.getUTCMonth() + 1) +
				(oDate.getUTCDate() < 10 ? "0" : "") + oDate.getUTCDate() +
				(oDate.getUTCHours() < 10 ? "0" : "") + oDate.getUTCHours() +
				(oDate.getUTCMinutes() < 10 ? "0" : "") + oDate.getUTCMinutes() +
				(oDate.getUTCSeconds() < 10 ? "0" : "") + oDate.getUTCSeconds();

			if (Format._getEnableMillisecondSupport()) {
				sValue += ('00' + oDate.getUTCMilliseconds()).slice(-3);
			}

			return sValue;
		}
		return "";
	};


	/**
	 * Converts a Date instance into an ABAP timestamp.
	 *
	 * @param {Date} oDate The date instance to convert
	 * @return {string} The output ABAP timestamp
	 * @static
	 * @public
	 */
	Format.dateToAbapTimestamp = function (oDate) {
		if (oDate) {
			var oLocalDateTime = oDate;

			if (oDate instanceof UI5Date) {
				oLocalDateTime = new Date(oDate.getTime());
			}

			var sTimestamp = "" + oLocalDateTime.getFullYear() +
				(oLocalDateTime.getMonth() < 9 ? "0" : "") + (oLocalDateTime.getMonth() + 1) +
				(oLocalDateTime.getDate() < 10 ? "0" : "") + oLocalDateTime.getDate() +
				(oLocalDateTime.getHours() < 10 ? "0" : "") + oLocalDateTime.getHours() +
				(oLocalDateTime.getMinutes() < 10 ? "0" : "") + oLocalDateTime.getMinutes() +
				(oLocalDateTime.getSeconds() < 10 ? "0" : "") + oLocalDateTime.getSeconds();

			if (Format._getEnableMillisecondSupport()) {
				sTimestamp += ('00' + oDate.getMilliseconds()).slice(-3);
			}

			return sTimestamp;
		}
		return "";
	};


	/**
	 * Converts an ABAP timestamp into a time label to be used in Gantt.
	 *
	 * @param {string} sTimestamp The ABAP timestamp to convert
	 * @param {sap.gantt.config.Locale} oLocale The locale object has the time zone and DST info; this determines how the function converts the timestamp into a locale-specific time label
	 * @return {string} The output time label
	 * @static
	 * @public
	 */
	Format.abapTimestampToTimeLabel = function (sTimestamp, oLocale) {
		var localDate = Format.abapTimestampToDate(sTimestamp, oLocale);
		var sLabel = Format._oDefaultDateTimeFormat.format(localDate, oLocale.getTimeZone());

		return sLabel;
	};

	/**
	 * Converts a relative time object into an absolute time object. Use this method only in relative time axis mode.
	 *
	 * @param {int} iIntervalDays difference in the day segment between the target time and base time
	 * @param {int} iIntervalHours difference in the hour segment between the target time and base time
	 * @param {int} iIntervalMinutes difference in the minute segment between the target time and base time
	 * @param {int} iIntervalSeconds difference in the second segment between the target time and base time
	 * @return {Date} converted absolute time object
	 * @static
	 * @public
	 */

	Format.relativeTimeToAbsolutTime = function (iIntervalDays, iIntervalHours, iIntervalMinutes, iIntervalSeconds) {
		iIntervalDays = iIntervalDays !== undefined ? iIntervalDays : 0;
		iIntervalHours = iIntervalHours !== undefined ? iIntervalHours : 0;
		iIntervalMinutes = iIntervalMinutes !== undefined ? iIntervalMinutes : 0;
		iIntervalSeconds = iIntervalSeconds !== undefined ? iIntervalSeconds : 0;

		var oBaseTime = this.abapTimestampToDate("20120101000000");
		var oTargetTime = new Date();
		oTargetTime.setTime(oBaseTime.getTime() + iIntervalSeconds * 1000 + iIntervalMinutes * 60 * 1000 + iIntervalHours * 3600 * 1000 + iIntervalDays * 24 * 3600 * 1000);

		return oTargetTime;
	};

	/**
	 * Converts an absolute time object into a relative time object, which contains the following properties:
	 *  {
			intervalDays: * difference in the day segment between the target time and base time*,
			intervalHours: * difference in the hour segment between the target time and base time*,
			intervalMinutes: * difference in the minute segment between the target time and base time*,
			intervalSecond: * difference in the segment segment between the target time and base time*
		}
	 * Use this method only in relative time axis mode.
	 *
	 * @param {Date} oTime the absolute time object will be converted
	 * @return {object} relative time information object
	 * @static
	 * @public
	 */

	Format.absolutTimeToRelativeTime = function (oTime) {
		var oBaseTime = this.abapTimestampToDate("20120101000000");
		var iMiliseciondInterval = oTime.getTime() - oBaseTime.getTime();

		var iIntervalDays = Math.floor(iMiliseciondInterval / (24 * 3600 * 1000));
		var iRemainder = iMiliseciondInterval % (24 * 3600 * 1000);

		var iIntervalHours = Math.floor(iRemainder / (3600 * 1000));
		iRemainder = iRemainder % (3600 * 1000);

		var iIntervalMinutes = Math.floor(iRemainder / (60 * 1000));
		iRemainder = iRemainder % (60 * 1000);

		var iIntervalSeconds = Math.floor(iRemainder / 1000);

		var oResult = {
			intervalDays: iIntervalDays,
			intervalHours: iIntervalHours,
			intervalMinutes: iIntervalMinutes,
			intervalSecond: iIntervalSeconds
		};

		return oResult;
	};

	Format._convertUTCToLocalTime = function (sTimeStamp, oLocale) {

		//convert utc date to local date
		//code is from axistime.js
		var timeZoneOffset = 0;
		var utcDate = sap.gantt.misc.Format.abapTimestampToDate(sTimeStamp);
		var localDate = d3.time.second.offset(utcDate, timeZoneOffset);
		return localDate;
	};

	Format._timestampFormatter = {
		parse: function (sTimeStamp) {
			var bMillisecondFormat = Format._getEnableMillisecondSupport();
			var oValue;

			if (bMillisecondFormat) {
				oValue = d3.time.format("%Y%m%d%H%M%S%L").parse(sTimeStamp.padEnd(17, "0"));
			} else {
				oValue = d3.time.format("%Y%m%d%H%M%S").parse(sTimeStamp);
			}

			return oValue;
		}
	};

	Format.getTimeStampFormatter = function () {
		return Format._timestampFormatter;
	};

	return Format;
}, true);
