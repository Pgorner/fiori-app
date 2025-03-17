/*global QUnit*/
(function () {
	"use strict";
	QUnit.config.autostart = false;

	sap.ui.define([
		'sap/ui/comp/odata/type/FiscalDate',
		"sap/ui/model/ValidateException"
	], function (FiscalDateType, ValidateException) {

		function fnFormattingParsingHandler(assert, sFiscalType, sInputData) {
			var oFiscalDate = new FiscalDateType(null, null, {
				fiscalType: sFiscalType
			});
			var vFormatedValueg = oFiscalDate.formatValue(sInputData, "string");
			var vParsedValue = oFiscalDate.parseValue(vFormatedValueg, "string");

			assert.equal(sInputData, vParsedValue, "The parsing is reversing the input of the formatting.");
			oFiscalDate.destroy();
			oFiscalDate = null;
		}

		function fnFormattingParsingHandlerWithDigitSequence(assert, sFiscalType, sInputData) {
			var oFiscalDate = new FiscalDateType(null, { isDigitSequence:true }, {
				fiscalType: sFiscalType
			});
			var vFormatedValueg = oFiscalDate.formatValue(sInputData, "string");
			var vParsedValue = oFiscalDate.parseValue(vFormatedValueg, "string");

			if (sInputData !== "000") {
				assert.equal(sInputData, vParsedValue, "The parsing is reversing the input of the formatting.");
			} else {
				assert.equal(null, vParsedValue, "The parsing should return null");
			}
			oFiscalDate.destroy();
			oFiscalDate = null;
		}

		function fnValidationHandler(assert, sFiscalType, sInputData) {
			var oFiscalDate = new FiscalDateType(null, null, {
				fiscalType: sFiscalType
			});

			assert.throws(function() {
				oFiscalDate.validateValue(oFiscalDate.parseValue(sInputData, "string"));
			}, function(oError) {
				return oError instanceof ValidateException;
			});
		}

		QUnit.module("FiscalDate Formatting and Parsing");

		QUnit.test("Formatting/Parsing IsFiscalYear", function (assert) {
			fnFormattingParsingHandler(assert, "IsFiscalYear", "2012");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsFiscalYear", "2012");
		});

		QUnit.test("Formatting/Parsing IsFiscalPeriod", function (assert) {
			fnFormattingParsingHandler(assert, "IsFiscalPeriod", "002");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsFiscalPeriod", "002");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsFiscalPeriod", "000");
		});

		QUnit.test("Formatting/Parsing IsFiscalYearPeriod", function (assert) {
			fnFormattingParsingHandler(assert, "IsFiscalYearPeriod", "2012002");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsFiscalYearPeriod", "2012002");

		});

		QUnit.test("Formatting/Parsing IsFiscalQuarter", function (assert) {
			fnFormattingParsingHandler(assert, "IsFiscalQuarter", "3");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsFiscalQuarter", "3");
		});

		QUnit.test("Formatting/Parsing IsFiscalYearQuarter", function (assert) {
			fnFormattingParsingHandler(assert, "IsFiscalYearQuarter", "20123");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsFiscalYearQuarter", "20123");
		});

		QUnit.test("Formatting/Parsing IsFiscalWeek", function (assert) {
			fnFormattingParsingHandler(assert, "IsFiscalWeek", "51");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsFiscalWeek", "51");
		});

		QUnit.test("Formatting/Parsing IsFiscalYearWeek", function (assert) {
			fnFormattingParsingHandler(assert, "IsFiscalYearWeek", "201251");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsFiscalYearWeek", "201251");
		});

		QUnit.test("Formatting/Parsing IsDayOfFiscalYear", function (assert) {
			fnFormattingParsingHandler(assert, "IsDayOfFiscalYear", "342");
			fnFormattingParsingHandlerWithDigitSequence(assert, "IsDayOfFiscalYear", "342");
		});

		// QUnit.test("Formatting/Parsing IsFiscalYearVariant", function (assert) {
		// 	fnFormattingParsingHandler(assert, "IsFiscalYearVariant", "");
		// });

		QUnit.module("FiscalDate Validation");

		QUnit.test("Formatting/Parsing IsFiscalYear", function (assert) {
			fnValidationHandler(assert, "IsFiscalYear", "-2012");
			fnValidationHandler(assert, "IsFiscalYear", "0123");
			fnValidationHandler(assert, "IsFiscalYear", "20125");
		});

		QUnit.test("Formatting/Parsing IsFiscalPeriod", function (assert) {
			fnValidationHandler(assert, "IsFiscalPeriod", "-1");
			// fnValidationHandler(assert, "IsFiscalPeriod", "1");
			// fnValidationHandler(assert, "IsFiscalPeriod", "12");
			fnValidationHandler(assert, "IsFiscalPeriod", "1234");
		});

		QUnit.test("Formatting/Parsing IsFiscalYearPeriod", function (assert) {
			fnValidationHandler(assert, "IsFiscalYearPeriod", "-2012003");
			// Invalid year and valid period
			fnValidationHandler(assert, "IsFiscalYearPeriod", "0012002");
			fnValidationHandler(assert, "IsFiscalYearPeriod", "22012002");
			// Valid year and invalid period
			fnValidationHandler(assert, "IsFiscalYearPeriod", "20121");
			fnValidationHandler(assert, "IsFiscalYearPeriod", "201212");
			fnValidationHandler(assert, "IsFiscalYearPeriod", "20121234");
		});

		QUnit.test("Formatting/Parsing IsFiscalQuarter", function (assert) {
			fnValidationHandler(assert, "IsFiscalQuarter", "-4");
			fnValidationHandler(assert, "IsFiscalQuarter", "21");
			fnValidationHandler(assert, "IsFiscalQuarter", "5");
			fnValidationHandler(assert, "IsFiscalQuarter", "0");
		});

		QUnit.test("Formatting/Parsing IsFiscalYearQuarter", function (assert) {
			fnValidationHandler(assert, "IsFiscalYearQuarter", "-20124");
			// Inalid year and invalid quarter
			fnValidationHandler(assert, "IsFiscalYearQuarter", "00124");
			fnValidationHandler(assert, "IsFiscalYearQuarter", "201254");
			// Valid year and invalid quarter
			fnValidationHandler(assert, "IsFiscalYearQuarter", "201221");
			fnValidationHandler(assert, "IsFiscalYearQuarter", "20125");
			fnValidationHandler(assert, "IsFiscalYearQuarter", "20120");
		});

		QUnit.test("Formatting/Parsing IsFiscalWeek", function (assert) {
			fnValidationHandler(assert, "IsFiscalWeek", "-1");
			fnValidationHandler(assert, "IsFiscalWeek", "0");
			fnValidationHandler(assert, "IsFiscalWeek", "54");
			fnValidationHandler(assert, "IsFiscalWeek", "123");
		});

		QUnit.test("Formatting/Parsing IsFiscalYearWeek", function (assert) {
			fnValidationHandler(assert, "IsFiscalYearWeek", "-201253");
			// Inalid year and valid week
			fnValidationHandler(assert, "IsFiscalYearWeek", "001224");
			fnValidationHandler(assert, "IsFiscalYearWeek", "2012324");
			// Valid year and invalid week
			fnValidationHandler(assert, "IsFiscalYearWeek", "201254");
			fnValidationHandler(assert, "IsFiscalYearWeek", "20120");
			fnValidationHandler(assert, "IsFiscalYearWeek", "2012544");
		});

		QUnit.test("Formatting/Parsing IsDayOfFiscalYear", function (assert) {
			fnValidationHandler(assert, "IsDayOfFiscalYear", "-1");
			fnValidationHandler(assert, "IsDayOfFiscalYear", "0");
			fnValidationHandler(assert, "IsDayOfFiscalYear", "372");
		});

		QUnit.test("FiscalDate#getFormatter returns an instance of PeriodDateFormat", function(assert) {
			var oFormatter, oFiscalDate;

			oFiscalDate = new FiscalDateType(null, null, {
				fiscalType: "IsFiscalYearPeriod"
			});
			assert.ok(typeof oFiscalDate.getFormatter === "function", "Function getFormatter exists");

			oFormatter = oFiscalDate.getFormatter();
			assert.ok(typeof oFormatter === "object", "Formatter object returned");
			assert.ok(typeof oFormatter.isA === "function", "Formatter extends sap/ui/base/Object");
			assert.ok(oFormatter.isA("sap.ui.comp.odata.PeriodDateFormat"), "Formatter is an instance of sap/ui/comp/odata/FiscalFormat");
		});

		QUnit.start();
	});

})();
