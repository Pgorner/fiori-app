/*global QUnit*/
(function () {
	"use strict";
	QUnit.config.autostart = false;

	sap.ui.define([
		'sap/ui/comp/odata/type/CalendarDate',
		"sap/ui/model/ValidateException"
	], function (CalendarDateType, ValidateException) {

		function fnFormattingParsingHandler(assert, sCalendarType, sInputData) {
			var oCalendarDate = new CalendarDateType(null, null, {
				calendarType: sCalendarType
			});
			var vFormattedValue = oCalendarDate.formatValue(sInputData, "string");
			var vParsedValue = oCalendarDate.parseValue(vFormattedValue, "string");

			assert.equal(sInputData, vParsedValue, "The parsing is reversing the input of the formatting.");
			oCalendarDate.destroy();
			oCalendarDate = null;
		}

		function fnFormattingParsingHandlerWithDigitSequence(assert, sCalendarType, sInputData) {
			var oCalendarDate = new CalendarDateType(null, { isDigitSequence:true }, {
				calendarType: sCalendarType
			});
			var vFormattedValue = oCalendarDate.formatValue(sInputData, "string");
			var vParsedValue = oCalendarDate.parseValue(vFormattedValue, "string");

			if (sInputData !== "000") {
				assert.equal(sInputData, vParsedValue, "The parsing is reversing the input of the formatting.");
			} else {
				assert.equal(null, vParsedValue, "The parsing should return null");
			}
			oCalendarDate.destroy();
			oCalendarDate = null;
		}

		function fnValidationHandler(assert, sCalendarType, sInputData) {
			var oCalendarDate = new CalendarDateType(null, null, {
				calendarType: sCalendarType
			});

			assert.throws(function() {
				oCalendarDate.validateValue(oCalendarDate.parseValue(sInputData, "string"));
			}, function(oError) {
				return oError instanceof ValidateException;
			});
		}

		QUnit.module("CalendarDate Formatting and Parsing");

		QUnit.test("Formatting/Parsing IsCalendarYear", function (assert) {
			fnFormattingParsingHandler(assert, "IsCalendarYear", "2012");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsCalendarYear", "2012");
		});

		QUnit.test("Formatting/Parsing IsCalendarWeek", function (assert) {
			fnFormattingParsingHandler(assert, "IsCalendarWeek", "51");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsCalendarWeek", "51");
		});

		QUnit.test("Formatting/Parsing IsCalendarMonth", function (assert) {
			fnFormattingParsingHandler(assert, "IsCalendarMonth", "12");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsCalendarMonth", "12");
		});


		QUnit.test("Formatting/Parsing IsCalendarYearWeek", function (assert) {
			fnFormattingParsingHandler(assert, "IsCalendarYearWeek", "201251");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsCalendarYearWeek", "201251");
		});

		QUnit.test("Formatting/Parsing IsCalendarYearMonth", function (assert) {
			fnFormattingParsingHandler(assert, "IsCalendarYearMonth", "202211");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsCalendarYearMonth", "202211");
		});

		QUnit.test("Formatting/Parsing IsCalendarYearQuarter", function (assert) {
			fnFormattingParsingHandler(assert, "IsCalendarYearQuarter", "20123");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsCalendarYearQuarter", "20123");
		});


		QUnit.module("CalendarDate Validation");

		QUnit.test("Formatting/Parsing IsCalendarYear", function (assert) {
			fnValidationHandler(assert, "IsCalendarYear", "-2022");
			fnValidationHandler(assert, "IsCalendarYear", "0123");
			fnValidationHandler(assert, "IsCalendarYear", "12345");
		});

		QUnit.test("Formatting/Parsing IsCalendarWeek", function (assert) {
			fnValidationHandler(assert, "IsCalendarWeek", "-1");
			fnValidationHandler(assert, "IsCalendarWeek", "54");
			fnValidationHandler(assert, "IsCalendarWeek", "0");
		});

		QUnit.test("Formatting/Parsing IsCalendarMonth", function (assert) {
			fnValidationHandler(assert, "IsCalendarMonth", "-1");
			fnValidationHandler(assert, "IsCalendarMonth", "13");
			fnValidationHandler(assert, "IsCalendarMonth", "0");
		});

		QUnit.test("Formatting/Parsing IsCalendarQuarter", function (assert) {
			fnValidationHandler(assert, "IsCalendarQuarter", "-1");
			fnValidationHandler(assert, "IsCalendarQuarter", "11");
			fnValidationHandler(assert, "IsCalendarQuarter", "5");
			fnValidationHandler(assert, "IsCalendarQuarter", "0");
		});

		QUnit.test("Formatting/Parsing IsCalendarYearWeek", function (assert) {
			fnValidationHandler(assert, "IsCalendarYearWeek", "-202253");
			fnValidationHandler(assert, "IsCalendarYearWeek", "001224");
			fnValidationHandler(assert, "IsCalendarYearWeek", "2022324");
			fnValidationHandler(assert, "IsCalendarYearWeek", "202254");
			fnValidationHandler(assert, "IsCalendarYearWeek", "20220");
			fnValidationHandler(assert, "IsCalendarYearWeek", "2022544");
		});

		QUnit.test("Formatting/Parsing IsCalendarYearMonth", function (assert) {
			fnValidationHandler(assert, "IsCalendarYearMonth", "-202212");
			fnValidationHandler(assert, "IsCalendarYearMonth", "001212");
			fnValidationHandler(assert, "IsCalendarYearMonth", "2022314");
			fnValidationHandler(assert, "IsCalendarYearMonth", "202213");
			fnValidationHandler(assert, "IsCalendarYearMonth", "20220");
			fnValidationHandler(assert, "IsCalendarYearMonth", "2022144");
		});

		QUnit.test("Formatting/Parsing IsCalendarYearQuarter", function (assert) {
			fnValidationHandler(assert, "IsCalendarYearQuarter", "-20224");
			fnValidationHandler(assert, "IsCalendarYearQuarter", "00124");
			fnValidationHandler(assert, "IsCalendarYearQuarter", "202254");
			fnValidationHandler(assert, "IsCalendarYearQuarter", "202221");
			fnValidationHandler(assert, "IsCalendarYearQuarter", "20225");
			fnValidationHandler(assert, "IsCalendarYearQuarter", "20220");
		});

		QUnit.test("CalendarDate#getFormatter returns an instance of PeriodDateFormat", function(assert) {
			var oFormatter, oCalendarDate;

			oCalendarDate = new CalendarDateType(null, null, {
				calendarType: "IsCalendarYear"
			});
			assert.ok(typeof oCalendarDate.getFormatter === "function", "Function getFormatter exists");

			oFormatter = oCalendarDate.getFormatter();
			assert.ok(typeof oFormatter === "object", "Formatter object returned");
			assert.ok(typeof oFormatter.isA === "function", "Formatter extends sap/ui/base/Object");
			assert.ok(oFormatter.isA("sap.ui.comp.odata.PeriodDateFormat"), "Formatter is an instance of sap/ui/comp/odata/CalendarFormat");
		});

		QUnit.start();
	});

})();
