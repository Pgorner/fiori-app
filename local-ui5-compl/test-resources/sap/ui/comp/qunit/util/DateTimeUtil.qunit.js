/* global QUnit */
sap.ui.define([
	"sap/ui/comp/util/DateTimeUtil"
], function(DateTimeUtil) {
	"use strict";

	function compareUtcToLocal(oUtcDate, oLocalDate) {
		return oUtcDate.getUTCFullYear() === oLocalDate.getFullYear() &&
			oUtcDate.getUTCMonth() === oLocalDate.getMonth() &&
			oUtcDate.getUTCDate() === oLocalDate.getDate() &&
			oUtcDate.getUTCHours() === oLocalDate.getHours() &&
			oUtcDate.getUTCMinutes() === oLocalDate.getMinutes() &&
			oUtcDate.getUTCSeconds() === oLocalDate.getSeconds() &&
			oUtcDate.getUTCMilliseconds() === oLocalDate.getMilliseconds();
	}

	function createDateFromString(sDate){
		var aDateParts = sDate.split(/T|:|\./),
			/// sDate pattern is "YYYY-MM-DDTHH:mm:ss.sss"
			// We create the date part passing a string to the Date constructor,
			// because this is the only way that I found to create dates with years starting with zeros like "0010".
			oParsedDate = new Date(aDateParts[0] + "T00:00:00.000");

			// When dates are created from string, Safari may create dates with wrong milliseconds.
			// Just to be sure we set the whole time part explicitlly
			if (aDateParts[1]) {
				oParsedDate.setHours(aDateParts[1]);
			}
			if (aDateParts[2]) {
				oParsedDate.setMinutes(aDateParts[2]);
			}
			if (aDateParts[3]) {
				oParsedDate.setSeconds(aDateParts[3]);
			}
			if (aDateParts[4]) {
				oParsedDate.setMilliseconds(aDateParts[4]);
			}

		return oParsedDate;
	}

	function createUTCDateFromString(sDate){
		var aDateParts = sDate.split(/T|:|\.|Z/),
			/// sDate pattern is "YYYY-MM-DDTHH:mm:ss.sssZ"
			// We create the date part passing a string to the Date constructor,
			// because this is the only way that I found to create dates with years starting with zeros like "0010".
			oParsedDate = new Date(aDateParts[0] + "T00:00:00.000Z");

			// When dates are created from string, Safari may create dates with wrong milliseconds.
			// Just to be sure we set the whole time part explicitlly
			if (aDateParts[1]) {
				oParsedDate.setUTCHours(aDateParts[1]);
			}
			if (aDateParts[2]) {
				oParsedDate.setUTCMinutes(aDateParts[2]);
			}
			if (aDateParts[3]) {
				oParsedDate.setUTCSeconds(aDateParts[3]);
			}
			if (aDateParts[4]) {
				oParsedDate.setUTCMilliseconds(aDateParts[4]);
			}

		return oParsedDate;
	}

	var aTestDates = [
		"0001-01-01",
		"0001-12-01",
		"0001-12-13",
		"0002-11-26",
		"0003-01-15",
		"1111-10-16",
		"1200-11-07",
		"1300-04-25",
		"4011-12-19",
		"1333-01-08",
		"5555-07-14",
		"1111-08-06",
		"0999-02-28",
		"0088-11-24",
		"0011-05-08",
		"0111-01-30",
		"0022-11-18",
		"0222-01-11",
		"2222-10-28",
		"0003-11-04",
		"0033-03-10",
		"0333-03-31",
		"0444-02-01",
		"1973-12-13",
		"1975-11-26",
		"1977-01-15",
		"1978-10-16",
		"1980-11-07",
		"1984-04-25",
		"1985-12-19",
		"1993-01-08",
		"1994-07-14",
		"1999-08-06",
		"2000-02-29",
		"2005-11-24",
		"2007-05-08",
		"2013-01-30",
		"2016-11-18",
		"2017-01-11",
		"2018-10-28",
		"2018-11-04",
		"2019-03-10",
		"2019-03-31",
		"1893-02-01"
	];

	var aTestDateTimes = [
		"2018-09-16T15:50:00.563Z",
		"2018-10-28T01:23:44.733Z",
		"2018-10-28T02:53:11.724Z",
		"2018-10-28T03:20:17.325Z",
		"2018-11-04T01:23:44.733Z",
		"2018-11-04T02:53:11.724Z",
		"2018-11-04T03:20:17.325Z",
		"2019-03-10T01:22:14.633Z",
		"2019-03-10T02:51:20.196Z",
		"2019-03-10T03:20:35.367Z",
		"2019-03-31T01:22:14.633Z",
		"2019-03-31T02:51:20.196Z",
		"2019-03-31T03:20:35.367Z",
		"2019-04-09T12:51:02.522Z",
		"2019-05-10T09:46:00.310Z",
		"2019-05-23T17:04:02.930Z",
		"2019-05-26T12:51:26.656Z",
		"2019-05-31T13:57:22.018Z",
		"2019-07-11T02:21:48.738Z",
		"2019-08-19T03:13:16.093Z",
		"1893-02-01T01:00:00.087Z"
	];

	var aTestTimes = [
		"1970-01-01T00:06:02.698Z",
		"1970-01-01T03:03:31.792Z",
		"1970-01-01T03:16:16.119Z",
		"1970-01-01T03:34:03.630Z",
		"1970-01-01T06:43:57.932Z",
		"1970-01-01T07:13:50.467Z",
		"1970-01-01T07:31:49.380Z",
		"1970-01-01T08:43:56.379Z",
		"1970-01-01T09:17:45.685Z",
		"1970-01-01T11:55:23.369Z",
		"1970-01-01T12:20:34.451Z",
		"1970-01-01T13:15:59.064Z",
		"1970-01-01T13:20:10.240Z",
		"1970-01-01T13:52:38.807Z",
		"1970-01-01T15:26:45.120Z",
		"1970-01-01T16:22:48.463Z",
		"1970-01-01T16:25:17.409Z",
		"1970-01-01T18:44:31.469Z",
		"1970-01-01T21:18:17.498Z",
		"1970-01-01T22:05:38.098Z"
	];

	var aTestEdmTimes = [
		{__edmType: "Edm.Time", ms: 362698},
		{__edmType: "Edm.Time", ms: 11011792},
		{__edmType: "Edm.Time", ms: 11776119},
		{__edmType: "Edm.Time", ms: 12843630},
		{__edmType: "Edm.Time", ms: 24237932},
		{__edmType: "Edm.Time", ms: 26030467},
		{__edmType: "Edm.Time", ms: 27109380},
		{__edmType: "Edm.Time", ms: 31436379},
		{__edmType: "Edm.Time", ms: 33465685},
		{__edmType: "Edm.Time", ms: 42923369},
		{__edmType: "Edm.Time", ms: 44434451},
		{__edmType: "Edm.Time", ms: 47759064},
		{__edmType: "Edm.Time", ms: 48010240},
		{__edmType: "Edm.Time", ms: 49958807},
		{__edmType: "Edm.Time", ms: 55605120},
		{__edmType: "Edm.Time", ms: 58968463},
		{__edmType: "Edm.Time", ms: 59117409},
		{__edmType: "Edm.Time", ms: 67471469},
		{__edmType: "Edm.Time", ms: 76697498},
		{__edmType: "Edm.Time", ms: 79538098}
	];

	QUnit.module("Convert between UTC and local time");

	QUnit.test("localToUtc", function(assert) {
		aTestDates.forEach(function(sDate) {
			var oLocalDate = createDateFromString(sDate),
				oUTCDate = DateTimeUtil.localToUtc(oLocalDate);

			assert.ok(compareUtcToLocal(oUTCDate, oLocalDate), ["Date does compare successful ", sDate, oLocalDate.toString(), oUTCDate.toString()].join(", ") );
		});
	});

	QUnit.test("utcToLocal", function(assert) {
		aTestDates.forEach(function(sDate) {
			var oUTCDate = createDateFromString(sDate),
				oLocalDate = DateTimeUtil.utcToLocal(oUTCDate);
			assert.ok(compareUtcToLocal(oUTCDate, oLocalDate), ["Date does compare successful ", sDate, oLocalDate.toString(), oUTCDate.toString()].join(", "));
		});
	});

	QUnit.test("localToUtc with time", function(assert) {
		aTestTimes.forEach(function(sDate) {
			var oLocalDate = createUTCDateFromString(sDate),
				oUTCDate = DateTimeUtil.localToUtc(oLocalDate);
			assert.ok(compareUtcToLocal(oUTCDate, oLocalDate), ["Date does compare successful ", sDate, oLocalDate.toString(), oUTCDate.toString()].join(", "));
		});
	});

	QUnit.test("utcToLocal with time", function(assert) {
		aTestTimes.forEach(function(sDate) {
			var oUTCDate = createUTCDateFromString(sDate),
				oLocalDate = DateTimeUtil.utcToLocal(oUTCDate);
			assert.ok(compareUtcToLocal(oUTCDate, oLocalDate), ["Date does compare successful ", sDate, oLocalDate.toString(), oUTCDate.toString()].join(", "));
		});
	});

	QUnit.test("dateToEdmTime", function(assert) {
		aTestTimes.forEach(function(sDate, i) {
			var oDate = createUTCDateFromString(sDate),
				oEdmTime = DateTimeUtil.dateToEdmTime(oDate);
			assert.deepEqual(oEdmTime, aTestEdmTimes[i], ["Time does compare successful ", sDate, oDate.toString(), oEdmTime.ms, aTestEdmTimes[i].ms].join(", "));
		});
	});

	QUnit.test("edmTimeToDate", function(assert) {
		aTestEdmTimes.forEach(function(oTime, i) {
			var oDate = DateTimeUtil.edmTimeToDate(oTime);
			assert.deepEqual(oDate.toISOString(), aTestTimes[i], ["Time does compare successful ", oTime.ms, oDate.toString()].join(", "));
		});
	});

	QUnit.module("Check for dates");

	QUnit.test("_isValidDateObject", function(assert) {
		assert.ok(DateTimeUtil._isValidDateObject(new Date(aTestDates[0])));
		assert.notOk(DateTimeUtil._isValidDateObject(aTestDates[0]));
		assert.notOk(DateTimeUtil._isValidDateObject(""));
		assert.notOk(DateTimeUtil._isValidDateObject(undefined));
		assert.notOk(DateTimeUtil._isValidDateObject(null));
		assert.notOk(DateTimeUtil._isValidDateObject(true));
		assert.notOk(DateTimeUtil._isValidDateObject(false));
		assert.notOk(DateTimeUtil._isValidDateObject(0));
		assert.notOk(DateTimeUtil._isValidDateObject(100));
		assert.notOk(DateTimeUtil._isValidDateObject(-100));
	});

	QUnit.test("isDate", function(assert) {
		aTestDates.forEach(function(sDate) {
			var oDate = DateTimeUtil.utcToLocal(createUTCDateFromString(sDate));
			assert.ok(DateTimeUtil.isDate(oDate), ["Date has time 00:00:00.000 ", sDate, oDate.toString()].join(", "));
		});
		aTestDateTimes.forEach(function(sDate) {
			var oDate = DateTimeUtil.utcToLocal(createUTCDateFromString(sDate));
			assert.notOk(DateTimeUtil.isDate(oDate), ["Date does have a time part ", sDate, oDate.toString()].join(", "));
		});
	});

	QUnit.test("isDate UTC", function(assert) {
		aTestDates.forEach(function(sDate) {
			var oUTCDate = new Date(sDate);
			assert.ok(DateTimeUtil.isDate(oUTCDate, true), ["Date has time 00:00:00.000 ", sDate, oUTCDate.toString()].join(", "));
		});
		aTestDateTimes.forEach(function(sDate) {
			var oDate = DateTimeUtil.utcToLocal(new Date(sDate));
			assert.notOk(DateTimeUtil.isDate(oDate, true), ["Date does have a time part ", sDate, oDate.toString()].join(", "));
		});
	});

	QUnit.module("Adapt time");

	QUnit.test("normalizeDate", function(assert) {
		aTestDateTimes.forEach(function(sDate) {
			var oDate = DateTimeUtil.normalizeDate(new Date(sDate));
			assert.ok(DateTimeUtil.isDate(oDate), ["Date has been normalized ", sDate, oDate.toString()].join(", "));
		});
	});

	QUnit.test("normalizeDate UTC", function(assert) {
		aTestDateTimes.forEach(function(sDate) {
			var oDate = DateTimeUtil.normalizeDate(new Date(sDate), true);
			assert.ok(DateTimeUtil.isDate(oDate, true), ["Date has been normalized ", sDate, oDate.toString()].join(", "));
		});
	});

	QUnit.test("adaptPrecision", function(assert) {
		aTestDateTimes.forEach(function(sDate) {
			var oDate = DateTimeUtil.adaptPrecision(new Date(sDate), 0);
			assert.equal(oDate.getMilliseconds(), 0, ["Precision adapted to 0 ", sDate, oDate.toString()].join(", "));
		});
		aTestDateTimes.forEach(function(sDate) {
			var oDate = DateTimeUtil.adaptPrecision(new Date(sDate), 1),
				fTest = oDate.getMilliseconds() / 100;
			assert.equal(fTest, Math.floor(fTest), ["Precision adapted to 1 ", sDate, oDate.toString(), fTest].join(", "));
		});
		aTestDateTimes.forEach(function(sDate) {
			var oDate = DateTimeUtil.adaptPrecision(new Date(sDate), 2),
			fTest = oDate.getMilliseconds() / 10;
			assert.equal(fTest, Math.floor(fTest), ["Precision adapted to 2 ", sDate, oDate.toString(), fTest].join(", "));
		});
	});

	QUnit.module("Misc");

	QUnit.test("_hasJsonDateString should correctly detect JSON date strings", function (assert) {
		// Act & Assert
		assert.notOk(DateTimeUtil._hasJsonDateString("Date(1612908000000)"), "Date(1612908000000) is not a JSON date string");
		assert.notOk(DateTimeUtil._hasJsonDateString("new Date(1612908000000)"), "new Date(1612908000000) is not a JSON date string");
		assert.notOk(DateTimeUtil._hasJsonDateString("/Date(1612908000000)"), "/Date(1612908000000) is not a JSON date string");
		assert.notOk(DateTimeUtil._hasJsonDateString("Date(1612908000000)/"), "Date(1612908000000)/ is not a JSON date string");
		assert.notOk(DateTimeUtil._hasJsonDateString("Date(1612908000000)"), "Date(1612908000000) is not a JSON date string");
		assert.notOk(DateTimeUtil._hasJsonDateString("Date(2021, 1, 10)"), "Date(2021, 1, 10) is not a JSON date string");
		assert.ok(DateTimeUtil._hasJsonDateString("/Date(1612908000000)/"), "/Date(1612908000000)/ is a JSON date string");
	});

	QUnit.test("_parseJsonDateString should correctly parses JSON date strings", function (assert) {
		// Act & Assert
		assert.deepEqual(DateTimeUtil._parseJsonDateString("/Date(1612908000000)/"), new Date(1612908000000));
		assert.equal(DateTimeUtil._parseJsonDateString("new Date(1612908000000)"), undefined);
		assert.equal(DateTimeUtil._parseJsonDateString("/Date(1612908000000)"), undefined);
		assert.equal(DateTimeUtil._parseJsonDateString("Date(1612908000000)/"), undefined);
		assert.equal(DateTimeUtil._parseJsonDateString("Date(1612908000000)"), undefined);
		assert.equal(DateTimeUtil._parseJsonDateString("Date(2021, 1, 10)"), undefined);
	});
});
