/* global QUnit */
(function () {
	"use strict";
	QUnit.config.autostart = false;

	sap.ui.define([
		'sap/ui/comp/odata/CalendarFormat',
		"sap/ui/model/ValidateException"
	], function (CalendarFormat, ValidateException) {

		function fnFormattingParsingHandler(assert, sFormat, sInputData) {
			var oCalendar =  CalendarFormat.getDateInstance({ format: sFormat, calendarType: "Gregorian" });
			var vFormattedValue = oCalendar.format(sInputData);
			var vParsedValue = oCalendar.parse(vFormattedValue);

			assert.equal(sInputData, vParsedValue, "The parsing is reversing the input of the formatting.");
			oCalendar.destroy();
			oCalendar = null;
		}

		function fnValidationHandler(assert, sFormat, sInputData) {
			var oCalendar = CalendarFormat.getDateInstance({ format: sFormat, calendarType: "Gregorian" });
			assert.equal(oCalendar.validate(oCalendar.parse(sInputData)), false, "The validation fails.");

			oCalendar.destroy();
			oCalendar = null;
		}

		QUnit.module("Calendar Formatting and Parsing");
		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarYear", function (assert) {
			fnFormattingParsingHandler(assert, "YYYY", "2022");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarWeek", function (assert) {
			fnFormattingParsingHandler(assert, "WW", "04");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarMonth", function (assert) {
			fnFormattingParsingHandler(assert, "MM", "11");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarYearWeek", function (assert) {
			fnFormattingParsingHandler(assert, "YYYYWW", "202253");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarYearMonth", function (assert) {
			fnFormattingParsingHandler(assert, "YYYYMM", "202211");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarYearQuarter", function (assert) {
			fnFormattingParsingHandler(assert, "YYYYQ", "20223");
		});

		QUnit.module("Calendar Validation");

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarYear", function (assert) {
			fnValidationHandler(assert, "YYYY", "-2022");
			fnValidationHandler(assert, "YYYY", "0123");
			fnValidationHandler(assert, "YYYY", "12345");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarWeek", function (assert) {
			fnValidationHandler(assert, "WW", "-1");
			fnValidationHandler(assert, "WW", "54");
			fnValidationHandler(assert, "WW", "0");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarMonth", function (assert) {
			fnValidationHandler(assert, "MM", "-1");
			fnValidationHandler(assert, "MM", "13");
			fnValidationHandler(assert, "MM", "0");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarQuarter", function (assert) {
			fnValidationHandler(assert, "Q", "-1");
			fnValidationHandler(assert, "Q", "11");
			fnValidationHandler(assert, "Q", "5");
			fnValidationHandler(assert, "Q", "0");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarYearWeek", function (assert) {
			fnValidationHandler(assert, "YYYYWW", "-202253");
			fnValidationHandler(assert, "YYYYWW", "001224");
			fnValidationHandler(assert, "YYYYWW", "2022324");
			fnValidationHandler(assert, "YYYYWW", "202254");
			fnValidationHandler(assert, "YYYYWW", "20220");
			fnValidationHandler(assert, "YYYYWW", "2022544");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarYearMonth", function (assert) {
			fnValidationHandler(assert, "YYYYMM", "-202212");
			fnValidationHandler(assert, "YYYYMM", "001212");
			fnValidationHandler(assert, "YYYYMM", "2022314");
			fnValidationHandler(assert, "YYYYMM", "202213");
			fnValidationHandler(assert, "YYYYMM", "20220");
			fnValidationHandler(assert, "YYYYMM", "2022144");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsCalendarYearQuarter", function (assert) {
			fnValidationHandler(assert, "YYYYQ", "-20224");
			fnValidationHandler(assert, "YYYYQ", "00124");
			fnValidationHandler(assert, "YYYYQ", "202254");
			fnValidationHandler(assert, "YYYYQ", "202221");
			fnValidationHandler(assert, "YYYYQ", "20225");
			fnValidationHandler(assert, "YYYYQ", "20220");
		});

		QUnit.start();
	});

})();
