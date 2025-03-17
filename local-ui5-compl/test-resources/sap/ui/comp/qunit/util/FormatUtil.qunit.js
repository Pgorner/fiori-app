/* global QUnit, sinon */
sap.ui.define([
	"sap/base/i18n/Formatting",
	"sap/ui/comp/util/FormatUtil",
	"sap/ui/model/odata/type/Currency",
	"sap/base/strings/whitespaceReplacer"
], function(Formatting, FormatUtil, Currency, fnWhitespaceReplacer) {
	"use strict";

	var fSpy;
	var mQUnitOptions = {
		afterEach: function() {
			if (fSpy && typeof fSpy.restore === "function") {
				fSpy.restore();
			}
		}
	};

	// add global configuration for Currency Symbol test
	Formatting.addCustomCurrencies({
		"DOLLAR": {
			"symbol": "$",
			"digits": 2
		},
		"EURO": {
			"symbol": "€",
			"digits": 2
		}
	});

	/**
	 * Texts Start
	 */
	QUnit.module("sap.ui.comp.util.FormatUtil - Texts", mQUnitOptions);

	QUnit.test("getFormatterFunctionFromDisplayBehaviour", function(assert) {
		var testFunction = function(mResult, sId, sDesc) {
			var sDisplayBehaviour, fnFormatter, sResult;
			for (sDisplayBehaviour in mResult) {
				fnFormatter = FormatUtil.getFormatterFunctionFromDisplayBehaviour(sDisplayBehaviour);
				assert.ok(fnFormatter);

				sResult = fnFormatter(sId, sDesc);
				assert.strictEqual(sResult, mResult[sDisplayBehaviour]);
			}
		};

		// Execution - 1 (Both Id & Desc are available)
		testFunction({
			descriptionAndId: "d (i)",
			idAndDescription: "i (d)",
			descriptionOnly: "d",
			idOnly: "i"
		}, "i", "d");

		// Execution - 2 (Only Id is available)
		testFunction({
			descriptionAndId: "i",
			idAndDescription: "i",
			descriptionOnly: undefined,
			idOnly: "i"
		}, "i");
	});

	QUnit.test("getFormattedExpressionFromDisplayBehaviour", function(assert) {
		var testFunction = function(mResult, sId, sDesc) {
			var sDisplayBehaviour, sResult;
			for (sDisplayBehaviour in mResult) {
				sResult = FormatUtil.getFormattedExpressionFromDisplayBehaviour(sDisplayBehaviour, sId, sDesc);
				assert.strictEqual(sResult, mResult[sDisplayBehaviour]);
			}
		};

		// Execution - 1 (Both Id & Desc are available)
		testFunction({
			descriptionAndId: "d (i)",
			idAndDescription: "i (d)",
			descriptionOnly: "d",
			idOnly: "i"
		}, "i", "d");

		// Execution - 2 (Only Id is available)
		testFunction({
			descriptionAndId: "i",
			idAndDescription: "i",
			descriptionOnly: undefined,
			idOnly: "i"
		}, "i");
	});

	QUnit.test("getTextsFromDisplayBehaviour", function(assert) {
		var testFunction = function(mResult, sId, sDesc) {
			var sDisplayBehaviour, sResult;
			for (sDisplayBehaviour in mResult) {
				sResult = FormatUtil.getTextsFromDisplayBehaviour(sDisplayBehaviour, sId, sDesc);
				assert.deepEqual(sResult, mResult[sDisplayBehaviour]);
			}
		};

		// Execution - 1 (Both Id & Desc are available)
		testFunction({
			descriptionAndId: {
				firstText: "d",
				secondText: "i"
			},
			idAndDescription: {
				firstText: "i",
				secondText: "d"
			},
			descriptionOnly: {
				firstText: "d",
				secondText: undefined
			},
			idOnly: {
				firstText: "i",
				secondText: undefined
			}
		}, "i", "d");

		// Execution - 2 (Only Id is available)
		testFunction({
			descriptionAndId: {
				firstText: "i",
				secondText: undefined
			},
			idAndDescription: {
				firstText: "i",
				secondText: undefined
			},
			descriptionOnly: {
				firstText: undefined,
				secondText: undefined
			},
			idOnly: {
				firstText: "i",
				secondText: undefined
			}
		}, "i");

	});

	QUnit.test("getFormattedRangeText", function(assert) {
		var done = assert.async();
		sap.ui.require([
			"sap/m/P13nConditionPanel"
		], function(P13nConditionPanel) {
			var sResult;
			fSpy = this.spy(P13nConditionPanel, "getFormatedConditionText");

			assert.ok(fSpy.notCalled);

			sResult = FormatUtil.getFormattedRangeText("EQ", "10");

			assert.ok(fSpy.calledOnce);
			assert.equal(sResult, "=10");

			sResult = FormatUtil.getFormattedRangeText("BT", "1", "2", false);

			assert.ok(fSpy.calledTwice);
			assert.equal(sResult, "1...2");

			sResult = FormatUtil.getFormattedRangeText("BT", "1", "2", true);

			assert.ok(fSpy.calledThrice);
			assert.equal(sResult, "!(1...2)");

			done();
		}.bind(this));
	});
	/**
	 * Texts End
	 */

	/**
	 * Resume other FormatUtil module
	 */
	QUnit.module("sap.ui.comp.util.FormatUtil", mQUnitOptions);

	QUnit.test("getAmountCurrencyFormatter", function(assert) {
		var vValue = 123, sCurrency, sResult;

		fSpy = this.spy(FormatUtil, "_initialiseCurrencyFormatter");

		assert.ok(fSpy.notCalled);

		var fFormatter = FormatUtil.getAmountCurrencyFormatter(false);

		assert.ok(typeof fFormatter === "function");
		assert.ok(fSpy.calledOnce);
		assert.ok(typeof FormatUtil._fAmountCurrencyFormatter === "function");
		assert.notEqual(fFormatter, FormatUtil._fAmountCurrencyFormatter); // dynamic code list wrapper vs. static formatter

		// EUR
		sCurrency = "EUR";
		sResult = fFormatter(vValue, sCurrency);
		assert.strictEqual(sResult, "123.00" + FormatUtil.CHAR_FIGURE_SPACE);

		// JPY
		sCurrency = "JPY";
		sResult = fFormatter(vValue, sCurrency);
		assert.strictEqual(sResult, "123" + FormatUtil.CHAR_PUNCTUATION_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE);

		// *
		sCurrency = "*";
		sResult = fFormatter(vValue, sCurrency);
		assert.strictEqual(sResult, "");

		// EUR but no value
		sCurrency = "EUR";
		sResult = fFormatter(undefined, sCurrency);
		assert.strictEqual(sResult, "");


		/* Test code list specific formatting */
		var mCodeList = {
			EUR: {
				UnitSpecificScale: 1
			},
			USD: {
				UnitSpecificScale: 3
			}
		};

		var mAdditionalCodeList = {
			EUR: {
				UnitSpecificScale: 3
			},
			USD: {
				UnitSpecificScale: 4
			}
		};

		var fAdditionalFormatter = FormatUtil.getAmountCurrencyFormatter(false);
		assert.notEqual(fFormatter, fAdditionalFormatter, "FormatUtil.getAmountCurrencyFormatter returns a new formatter on each call");


		// Initialize with currency code list
		sResult = fFormatter(vValue, "EUR", mCodeList);
		assert.strictEqual(sResult, "123.0" + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE, "Scale 1 received 2 additional spacer");
		sResult = fFormatter(vValue, "USD", mCodeList);
		assert.strictEqual(sResult, "123.000", "Scale 3 received 0 additional spacer");

		// Call initialized formatter with different currecy code list
		assert.notEqual(mCodeList, mAdditionalCodeList, "Currency code lists are different");
		sResult = fFormatter(vValue, "EUR", mAdditionalCodeList);
		assert.strictEqual(sResult, "123.0" + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE, "Scale 1 received 2 additional spacer");
		sResult = fFormatter(vValue, "USD", mAdditionalCodeList);
		assert.strictEqual(sResult, "123.000", "Scale 3 received 0 additional spacer");

		// Initialize additional formatter with currency code list
		sResult = fAdditionalFormatter(vValue, undefined, mAdditionalCodeList);
		assert.strictEqual(sResult, "123.00" + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE, "Default scale in case there is no unit");
		sResult = fAdditionalFormatter(vValue, "EUR", mAdditionalCodeList);
		assert.strictEqual(sResult, "123.000" + FormatUtil.CHAR_FIGURE_SPACE, "Scale 3 received 1 additional spacer");
		sResult = fAdditionalFormatter(vValue, "USD", mAdditionalCodeList);
		assert.strictEqual(sResult, "123.0000", "Scale 4 received 0 additional spacer");
	});

	QUnit.test("getAmountCurrencyFormatter with preserveDecimals='true'", function(assert) {
		var sResult, sExpectedResult;
		var fFormatter = FormatUtil.getAmountCurrencyFormatter(true);
		var mCodeList = {
			EUR: {
				UnitSpecificScale: 1
			},
			USD: {
				UnitSpecificScale: 3
			},
			JPY: {
				UnitSpecificScale: 0
			}
		};

		sResult = fFormatter(123.123456, "EUR", mCodeList);
		sExpectedResult = "123.123456";
		assert.strictEqual(sResult, sExpectedResult, "Decimals are preserved, the fraction part is greater than the MaxFractionDigit=3, so no spaces added");

		sResult = fFormatter(123.1, "USD", mCodeList);
		sExpectedResult = "123.100";
		assert.strictEqual(sResult, sExpectedResult, "Decimals are preserved, two 0 are added to the fraction part since UnitSpecificScale=3 for USD");

		sResult = fFormatter(123.1, "JPY", mCodeList);
		sExpectedResult = "123.1" + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Decimals are preserved, 2 spaces are added for alignment");

		sResult = fFormatter(123, "JPY", mCodeList);
		sExpectedResult = "123" + FormatUtil.CHAR_PUNCTUATION_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE;
	});

	QUnit.test("getCurrencySymbolFormatter", function(assert) {
		var sCurrency, sResult;

		fSpy = this.spy(FormatUtil, "_initialiseCurrencyFormatter");

		assert.ok(fSpy.notCalled);
		assert.ok(!FormatUtil._fCurrencySymbolFormatter);

		var fFormatter = FormatUtil.getCurrencySymbolFormatter();

		assert.ok(typeof fFormatter === "function");
		assert.ok(fSpy.calledOnce);
		assert.ok(FormatUtil._fCurrencySymbolFormatter);
		assert.strictEqual(fFormatter, FormatUtil._fCurrencySymbolFormatter);

		// Locale dependent - so uses the custom definition done at the beginning of this class
		// EUR
		sCurrency = "EURO";
		sResult = fFormatter(sCurrency);
		assert.strictEqual(sResult, "€");

		// USD
		sCurrency = "DOLLAR";
		sResult = fFormatter(sCurrency);
		assert.strictEqual(sResult, "$");

		// *
		sCurrency = "*";
		sResult = fFormatter(sCurrency);
		assert.strictEqual(sResult, "");
	});

	QUnit.test("_getUnitFormatter", function(assert) {
		let oFormatter = FormatUtil._getUnitFormatter();

		/* Formatter without preserveDecimals and scale */
		assert.equal(oFormatter.format("1234"), "1,234", "Raw scale was used");
		assert.equal(oFormatter.format("1234.5"), "1,234.5", "Raw scale was used");
		assert.equal(oFormatter.format("1234.56"), "1,234.56", "Raw scale was used");
		assert.equal(oFormatter.format("1234.567"), "1,234.567", "Raw scale was used");
		assert.equal(oFormatter.format("1234.5678"), "1,234.568", "Scale does not exceed 3");

		/* Formatter with preserveDecimals and without scale */
		oFormatter = FormatUtil._getUnitFormatter(true /* preserveDecimals */);

		assert.equal(oFormatter.format("1234"), "1,234", "Raw scale was used");
		assert.equal(oFormatter.format("1234.5"), "1,234.5", "Raw scale was used");
		assert.equal(oFormatter.format("1234.56"), "1,234.56", "Raw scale was used");
		assert.equal(oFormatter.format("1234.567"), "1,234.567", "Raw scale was used");
		assert.equal(oFormatter.format("1234.5678"), "1,234.5678", "PreserveDecimals overrules maxFractionDigits");

		/* Formatter without preserveDecimals and with scale */
		oFormatter = FormatUtil._getUnitFormatter(undefined, 1);

		assert.equal(oFormatter.format("1234"), "1,234.0", "Correct scale applied");
		assert.equal(oFormatter.format("1234.5"), "1,234.5", "Correct scale applied");
		assert.equal(oFormatter.format("1234.52"), "1,234.5", "Correct scale applied");
		assert.equal(oFormatter.format(1234.52), "1,234.5", "Value has been rounded correctly");
		assert.equal(oFormatter.format("1234.58"), "1,234.6", "Value has been rounded correctly");
		assert.equal(oFormatter.format(1234.58), "1,234.6", "Value has been rounded correctly");
		assert.equal(oFormatter.format("1234.567"), "1,234.6", "Value has been rounded correctly");

		/* Formatter without preserveDecimals and with scale */
		oFormatter = FormatUtil._getUnitFormatter(undefined, 0);

		assert.equal(oFormatter.format("1234"), "1,234", "Correct scale applied");
		assert.equal(oFormatter.format("1234.5"), "1,235", "Value has been rounded correctly");
		assert.equal(oFormatter.format(1234.8), "1,235", "Value has been rounded correctly");
		assert.equal(oFormatter.format("1234.42"), "1,234", "Value has been rounded correctly");
		assert.equal(oFormatter.format("1234.567"), "1,235", "Value has been rounded correctly");

		/* Formatter with preserveDecimals and scale */
		oFormatter = FormatUtil._getUnitFormatter(true, 1);

		assert.equal(oFormatter.format("1234"), "1,234.0", "Correct scale applied");
		assert.equal(oFormatter.format("1234.5"), "1,234.5", "Correct scale applied");
		assert.equal(oFormatter.format("1234.58"), "1,234.58", "PreserveDecimals overrules maxFractionDigits");
		assert.equal(oFormatter.format(1234.58), "1,234.58", "PreserveDecimals overrules maxFractionDigits");
		assert.equal(oFormatter.format("1234.567"), "1,234.567", "PreserveDecimals overrules maxFractionDigits");

		/* Formatter with preserveDecimals and scale higher 3 - less than 0 or higher than 3 is being ignored */
		oFormatter = FormatUtil._getUnitFormatter(true, 5);

		assert.equal(oFormatter.format("1234"), "1,234", "Raw scale was used");
		assert.equal(oFormatter.format("1234.5"), "1,234.5", "Raw scale was used");
		assert.equal(oFormatter.format("1234.58"), "1,234.58", "Raw scale was used");
		assert.equal(oFormatter.format("1234.5678"), "1,234.5678", "PreserveDecimals overrules initial maxFractionDigits");
	});

	QUnit.test("getMeasureUnitFormatter", function(assert) {
		var vValue = 123.321456, sUnit, sResult, sExpectedResult;

		assert.ok(!FormatUtil._fMeasureFormatter);

		var fFormatter = FormatUtil.getMeasureUnitFormatter(false);

		assert.ok(typeof fFormatter === "function");

		// Except *, Unit is irrelevant
		sUnit = "HUGO";
		sResult = fFormatter(vValue, sUnit);
		assert.strictEqual(sResult, "123.321" + FormatUtil.CHAR_FIGURE_SPACE, "Maximum scale of 3 is applied");

		sUnit = "KG";
		assert.equal(fFormatter("1234"), "1,234" + FormatUtil.CHAR_FIGURE_SPACE, "Preformatted scale is used");
		assert.equal(fFormatter("1234.1"), "1,234.1" + FormatUtil.CHAR_FIGURE_SPACE, "Preformatted scale is used");
		assert.equal(fFormatter("1234.12"), "1,234.12" + FormatUtil.CHAR_FIGURE_SPACE, "Preformatted scale is used");
		assert.equal(fFormatter("1234.123"), "1,234.123" + FormatUtil.CHAR_FIGURE_SPACE, "Preformatted scale is used");

		// *
		sUnit = "*";
		sResult = fFormatter(vValue, sUnit);
		assert.strictEqual(sResult, "");

		// Unit but no value
		sUnit = "FOO";
		sResult = fFormatter(undefined, sUnit);
		assert.strictEqual(sResult, "");

		/* Test code list specific formatting */
		var mCodeList = {
			km: {
				UnitSpecificScale: 3
			},
			m: {
				UnitSpecificScale: 2
			},
			cm: {
				UnitSpecificScale: 0
			},
			kg: {
				UnitSpecificScale: 99
			}
		};

		var mAdditionalCodeList = {
			km: {
				UnitSpecificScale: 0
			},
			m: {
				UnitSpecificScale: 1
			},
			cm: {
				UnitSpecificScale: 2
			},
			kg: {
				UnitSpecificScale: 0
			}
		};

		var mCustomCodeList = {
			km: {
				UnitSpecificScale: 0
			},
			m: {
				UnitSpecificScale: 0
			},
			cm: {
				UnitSpecificScale: 0
			},
			kg: {
				UnitSpecificScale: 0
			}
		};

		var fAdditionalFormatter = FormatUtil.getMeasureUnitFormatter(false);
		assert.notEqual(fFormatter, fAdditionalFormatter, "FormatUtil.getMeasureUnitFormatter returns a new formatter on each call");

		// Initialize with code list
		sResult = fFormatter(vValue, "km", mCodeList);
		assert.strictEqual(sResult, "123.321", "Formatted with scale 3");

		sResult = fFormatter(vValue, "m", mCodeList);
		sExpectedResult = "123.32" + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 2, additionally 1 space character is added to support alignment of decimal point");

		sResult = fFormatter(vValue, "cm", mCodeList);
		sExpectedResult = "123" + FormatUtil.CHAR_PUNCTUATION_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 0, additionally, 1 punctution + 3 space characters are added to support alignment of decimal point");

		sResult = fFormatter(vValue, "kg", mCodeList);
		assert.strictEqual(sResult, "123.321", "Formatted with scale 3 and not 99, max 3 fraction digits are supported with Units");

		// Call initialized formatter with different currency code list
		assert.notDeepEqual(mCodeList, mAdditionalCodeList, "Currency code lists are different");

		sResult = fFormatter(vValue, "km", mAdditionalCodeList);
		assert.strictEqual(sResult, "123.321", "Formatted with scale 3");

		sResult = fFormatter(vValue, "m", mAdditionalCodeList);
		sExpectedResult = "123.32" + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 2, additionally 1 space character is added to support alignment of decimal point");

		sResult = fFormatter(vValue, "cm", mAdditionalCodeList);
		sExpectedResult = "123" + FormatUtil.CHAR_PUNCTUATION_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 0, additionally, 1 punctution + 3 space characters are added to support alignment of decimal point");

		// Initialize additional formatter with currency code list
		sResult = fAdditionalFormatter(vValue, "km", mAdditionalCodeList);
		sExpectedResult = "123" + FormatUtil.CHAR_PUNCTUATION_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 0, additionally, 1 punctution + 3 space characters are added to support alignment of decimal point");

		sResult = fAdditionalFormatter(vValue, "m", mAdditionalCodeList);
		sExpectedResult = "123.3" + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 1, additionally 2 space character is added to support alignment of decimal point");

		sResult = fAdditionalFormatter(vValue, "cm", mAdditionalCodeList);
		sExpectedResult = "123.32";
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 2, additionally 1 space character is added to support alignment of decimal point");

		fAdditionalFormatter = FormatUtil.getMeasureUnitFormatter(false);

		// Call initialized formatter with different code list
		assert.notEqual(mCodeList, mCustomCodeList, "Currency code lists are different");

		sResult = fFormatter(vValue, "km", mCustomCodeList);
		assert.strictEqual(sResult, "123.321", "Formatted with scale 3");

		sResult = fFormatter(vValue, "m", mCustomCodeList);
		sExpectedResult = "123.32" + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 2, additionally 1 space character is added to support alignment of decimal point");

		sResult = fFormatter(vValue, "cm", mCustomCodeList);
		sExpectedResult = "123" + FormatUtil.CHAR_PUNCTUATION_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 0, additionally, 1 punctution + 3 space characters are added to support alignment of decimal point");

		// Initialize additional formatter with custom code list
		sResult = fAdditionalFormatter(vValue, "km", mCustomCodeList);
		sExpectedResult = "123";
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 0, no additional punctation and no additional space character added");

		sResult = fAdditionalFormatter(vValue, "m", mCustomCodeList);
		sExpectedResult = "123";
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 0, no additional punctation and no additional space character added");

		sResult = fAdditionalFormatter(vValue, "cm", mCustomCodeList);
		sExpectedResult = "123";
		assert.strictEqual(sResult, sExpectedResult, "Formatted with scale 0, no additional punctation and no additional space character added");
	});

	QUnit.test("getMeasureUnitFormatter with preserveDecimals='true'", function(assert) {
		var sResult, sExpectedResult;
		var fFormatter = FormatUtil.getMeasureUnitFormatter(true);
		var mCodeList = {
			km: {
				UnitSpecificScale: 3
			},
			m: {
				UnitSpecificScale: 2
			},
			cm: {
				UnitSpecificScale: 0
			}
		};

		sResult = fFormatter(123.321456, "km", mCodeList);
		sExpectedResult = "123.321456";
		assert.strictEqual(sResult, sExpectedResult, "Decimals are preserved, the fraction part is greater than the MaxFractionDigit=3, so no spaces added");

		sResult = fFormatter(123.1, "m", mCodeList);
		sExpectedResult = "123.10" + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Decimals are preserved and 0 is added to the fraction part since UnitSpecficScale=2 for 'm' and a space is added for alignment");

		sResult = fFormatter(123.1, "cm", mCodeList);
		sExpectedResult = "123.1" + FormatUtil.CHAR_FIGURE_SPACE + FormatUtil.CHAR_FIGURE_SPACE;
		assert.strictEqual(sResult, sExpectedResult, "Decimals are preserved and 2 spaces are added for alignment");
	});

	QUnit.test("getMeasureUnitFormatter with default scale", function(assert) {
		var fnFormatter = FormatUtil.getMeasureUnitFormatter(true, 2);

		assert.strictEqual(fnFormatter("123", "KG"), "123.00" + FormatUtil.CHAR_FIGURE_SPACE, "Default scale is applied");
		assert.strictEqual(fnFormatter("1234", "KG"), "1,234.00" + FormatUtil.CHAR_FIGURE_SPACE, "Default scale is applied");
		assert.strictEqual(fnFormatter("1234.1", "KG"), "1,234.10" + FormatUtil.CHAR_FIGURE_SPACE, "Default scale is applied");
		assert.strictEqual(fnFormatter("1234.321456", "KG"), "1,234.321456" + FormatUtil.CHAR_FIGURE_SPACE, "Decimals are preserved, the fraction part is greater than the MaxFractionDigit=3, so no spaces added");
	});

	QUnit.test("getInlineMeasureUnitFormatter", function(assert) {
		var vValue = 123.456, sMeasure, sResult;
		var mCodeList = {
			PCS: {
				UnitSpecificScale: 0
			}
		};

		assert.ok(!FormatUtil._fInlineMeasureFormatter);

		var fFormatter = FormatUtil.getInlineMeasureUnitFormatter();

		assert.ok(typeof fFormatter === "function");

		// Unit is suffixed to the value
		sMeasure = "PCS";
		sResult = fFormatter(vValue, sMeasure);
		assert.strictEqual(sResult, vValue + FormatUtil.CHAR_FIGURE_SPACE + sMeasure);

		// call formatter with codeList
		sResult = fFormatter(vValue, sMeasure, mCodeList);
		assert.strictEqual(sResult, "123" + FormatUtil.CHAR_FIGURE_SPACE + sMeasure);

		// call formatter with preserveDecimals=true
		var fFormatter2 = FormatUtil.getInlineMeasureUnitFormatter(true);
		sResult = fFormatter2(vValue, sMeasure, mCodeList);
		assert.strictEqual(sResult, vValue + FormatUtil.CHAR_FIGURE_SPACE + sMeasure);

		// *
		sMeasure = "*";
		sResult = fFormatter(vValue, sMeasure);
		assert.strictEqual(sResult, "");

		// Unit but no value
		sMeasure = "FOO";
		vValue = undefined;
		sResult = fFormatter(vValue, sMeasure);
		assert.strictEqual(sResult, "");

		// Value but no unit
		sMeasure = undefined;
		vValue = 123.456;
		sResult = fFormatter(vValue, sMeasure);
		assert.strictEqual(sResult, vValue);
	});

	QUnit.test("getInlineAmountFormatter", function(assert) {
		var vValue = 123, sCurrency, sResult;
		var mCodeList = {
			EUR: {
				UnitSpecificScale: 3
			},
			JPY: {
				UnitSpecificScale: 0
			}
		};

		fSpy = this.spy(FormatUtil, "_initialiseCurrencyFormatter");

		assert.ok(fSpy.notCalled);
		assert.ok(!FormatUtil._fInlineAmountFormatter);

		var fFormatter = FormatUtil.getInlineAmountFormatter();

		assert.ok(typeof fFormatter === "function");
		assert.ok(fSpy.calledOnce);
		assert.ok(FormatUtil._fInlineAmountFormatter);

		// EUR
		sCurrency = "EUR";
		sResult = fFormatter(vValue, sCurrency);
		assert.strictEqual(sResult, vValue + ".00" + FormatUtil.CHAR_FIGURE_SPACE + sCurrency);

		// EUR with codeList
		sResult = fFormatter(vValue, sCurrency, mCodeList);
		assert.strictEqual(sResult, vValue + ".000" + FormatUtil.CHAR_FIGURE_SPACE + sCurrency);

		// JPY
		sCurrency = "JPY";
		sResult = fFormatter(vValue, sCurrency);
		assert.strictEqual(sResult, vValue + FormatUtil.CHAR_FIGURE_SPACE + sCurrency);

		// JPY with preserveDecimals=true
		var vValue2 = 123.123;
		var fFormatter2 = FormatUtil.getInlineAmountFormatter(true);
		sResult = fFormatter2(vValue2, sCurrency, mCodeList);
		assert.strictEqual(sResult, vValue2 + FormatUtil.CHAR_FIGURE_SPACE + sCurrency);

		// *
		sCurrency = "*";
		sResult = fFormatter(vValue, sCurrency);
		assert.strictEqual(sResult, "");

		// EUR but no value
		sCurrency = "EUR";
		vValue = undefined;
		sResult = fFormatter(vValue, sCurrency);
		assert.strictEqual(sResult, "");
	});

	QUnit.test("getInlineGroupFormatterFunction", function(assert) {
		var done = assert.async();
		sap.ui.require([
			"sap/ui/model/odata/type/Byte",
			"sap/ui/model/odata/type/Decimal",
			"sap/ui/model/odata/type/String",
			"sap/ui/model/odata/type/DateTime",
			"sap/ui/comp/odata/type/NumericText"
		], function(Byte, Decimal, String, DateTime, NumericText) {
			var fFormatter;
			FormatUtil.getInlineAmountFormatter();
			FormatUtil.getInlineMeasureUnitFormatter();

			var fAmountSpy = this.spy(FormatUtil, "_fInlineAmountFormatter");
			var fMeasureSpy = this.spy(FormatUtil, "_fInlineMeasureFormatter");
			var fDescriptionSpy = this.spy(FormatUtil, "_getTextFormatterForIdOnly");
			var fDescriptionOnlySpy = this.spy(FormatUtil, "_getTextFormatterForDescriptionOnly");
			var fDescriptionAndIdSpy = this.spy(FormatUtil, "_getTextFormatterForDescriptionAndId");

			var oAmountField = {
				name: "foo",
				type: "Edm.Decimal",
				unit: "PathToUnit",
				isCurrencyField: true,
				precision: 10,
				scale: 3,
				modelType: sinon.createStubInstance(Decimal)
			};

			var oMeasureField = {
				name: "foo",
				type: "Edm.Decimal",
				unit: "PathToUnit",
				isCurrencyField: false,
				precision: 10,
				scale: 3,
				modelType: sinon.createStubInstance(Decimal)
			};

			var oDescriptionField = {
				name: "foo",
				type: "Edm.String",
				description: "PathToDescription",
				modelType: sinon.createStubInstance(String)
			};

			var oIdFieldWithDescription = {
				name: "foo",
				description: "bar",
				type: "Edm.Byte",
				displayBehaviour: "descriptionOnly",
				modelType: sinon.createStubInstance(Byte)
			};

			var oNumericIdWithDescription = {
				name: "foo",
				description: "bar",
				type: "Edm.String",
				isDigitSequence: true,
				displayBehaviour: "descriptionAndId",
				modelType: sinon.createStubInstance(NumericText)
			};

			var oTypedField = {
				name: "foo",
				type: "Edm.String",
				modelType: sinon.createStubInstance(String)
			};

			var oUnknownField = {
				name: "foo"
			};

			var oDateTimeField = {
				name: "foo",
				type: "Edm.DateTime",
				displayFormat: "Date",
				isCalendarDate: false,
				modelType: sinon.createStubInstance(DateTime)
			};

			var mCurrencyCodes = {
				EUR: {
					UnitSpecificScale: 3
				}
			};

			var mMeasureUnitsCodeList = {
				PCS: {
					UnitSpecificScale: 3
				}
			};

			var iRequestCurrencyCodes = 0, iRequestUnitsOfMeasure = 0;
			var oMetaModel = {
				requestCurrencyCodes: function() {
					iRequestCurrencyCodes++;
					return Promise.resolve(mCurrencyCodes);
				},
				requestUnitsOfMeasure: function() {
					iRequestUnitsOfMeasure++;
					return Promise.resolve(mMeasureUnitsCodeList);
				}
			};

			// Test amount
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oAmountField);

			// Formatter exists
			assert.ok(fFormatter);
			assert.ok(fAmountSpy.notCalled);
			assert.ok(oAmountField.modelType.formatValue.notCalled);

			fFormatter(1234.567, "EUR");

			assert.ok(fAmountSpy.calledOnce);
			// modelType is not used, even if it exists
			assert.ok(oAmountField.modelType.formatValue.notCalled);

			// Test amount with CodeList
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oAmountField, undefined, undefined, true, true, oMetaModel);
			fFormatter(1234.567, "EUR");
			assert.strictEqual(iRequestCurrencyCodes, 1, "formatter function call with the CodeList");

			// Test measure
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oMeasureField);

			// Formatter exists
			assert.ok(fFormatter);
			assert.ok(fMeasureSpy.notCalled);
			assert.ok(oMeasureField.modelType.formatValue.notCalled);

			fFormatter(1234.567, "PCS");

			assert.ok(fMeasureSpy.calledOnce);
			// modelType is used, if it exists
			assert.ok(oMeasureField.modelType.formatValue.calledOnce);

			// Test measure without modelType
			delete oMeasureField.modelType;
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oMeasureField);

			// Formatter exists
			assert.ok(fFormatter);
			assert.ok(!fMeasureSpy.calledTwice);
			fFormatter(1234.567, "PCS");
			assert.ok(fMeasureSpy.calledTwice);

			// Test Measure field with CodeList
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oMeasureField, undefined, undefined, true, true, oMetaModel);
			fFormatter(1234.567, "PCS");
			assert.strictEqual(iRequestUnitsOfMeasure, 1, "formatter function call with the CodeList");

			// Test description
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oDescriptionField);

			// Formatter exists
			assert.ok(fFormatter);
			assert.ok(fDescriptionSpy.notCalled);
			assert.ok(oDescriptionField.modelType.formatValue.notCalled);

			fFormatter("id", "desc");

			assert.ok(fDescriptionSpy.calledOnce);
			// modelType is not used, even if it exists
			assert.ok(oDescriptionField.modelType.formatValue.notCalled);

			fDescriptionSpy.reset();
			// Test description field by disabling description
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oDescriptionField, true);

			// Formatter exists
			assert.ok(fFormatter);
			assert.ok(fDescriptionSpy.notCalled);
			assert.ok(oDescriptionField.modelType.formatValue.notCalled);

			fFormatter("id", "desc");

			// description is not used, even if it exists as it is disabled
			assert.ok(fDescriptionSpy.notCalled);
			// modelType is used, as description is disabled
			assert.ok(oDescriptionField.modelType.formatValue.calledOnce);

			// Test Id field with description and displayBehaviour
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oIdFieldWithDescription);
			assert.equal(typeof fFormatter, "function", "Formatter function was returned");
			assert.ok(fDescriptionOnlySpy.notCalled);
			assert.ok(oIdFieldWithDescription.modelType.formatValue.notCalled);

			fFormatter(1, "Priority High");
			assert.ok(fDescriptionOnlySpy.calledOnce, "Description formatter was applied");
			assert.ok(oIdFieldWithDescription.modelType.formatValue.notCalled);
			fDescriptionOnlySpy.reset();

			// Test sap:display-format="NonNegative" in combination with sap:text annotation
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oNumericIdWithDescription);
			assert.equal(typeof fFormatter, "function", "Numeric id & description formatter function was returned");

			fFormatter("01", "Sample Description");
			assert.ok(oNumericIdWithDescription.modelType.formatValue.calledWith("01"), "Type specific formatter was called with id");
			assert.ok(fDescriptionAndIdSpy.calledOnce, "Description formatter was applied");
			fDescriptionAndIdSpy.reset();

			// Test Typed Field
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oTypedField);

			// Formatter exists
			assert.ok(fFormatter);
			assert.ok(oTypedField.modelType.formatValue.notCalled);

			fFormatter("foo");

			// only modelType is used
			assert.ok(oTypedField.modelType.formatValue.calledOnce);

			// Test unknown field
			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oUnknownField);

			// no formatter for unknown field
			assert.ok(!fFormatter);

			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oDateTimeField, false, {
				"UTC": true,
				"style": "medium"
			});

			assert.ok(fFormatter);
			var oDate = new Date();
			fFormatter(oDate);
			assert.ok(oDateTimeField.modelType.formatValue.notCalled, "modelType property's formatValue function not called since UTC=true");

			fFormatter = FormatUtil.getInlineGroupFormatterFunction(oDateTimeField, false, {
				"UTC": false,
				"style": "medium"
			});
			var oDate = new Date();
			fFormatter(oDate);
			assert.ok(oDateTimeField.modelType.formatValue.calledOnce, "modelType property's formatValue function called since UTC=false");

			fAmountSpy.restore();
			fMeasureSpy.restore();
			fDescriptionSpy.restore();
			fDescriptionOnlySpy.restore();
			fDescriptionAndIdSpy.restore();

			done();
		}.bind(this));
	});

	QUnit.test("getWidth", function(assert) {
		var sWidth;

		// maxLength
		sWidth = FormatUtil.getWidth({
			name: "foo",
			maxLength: 5
		});
		assert.strictEqual(sWidth, "5.75em");

		sWidth = FormatUtil.getWidth({
			name: "foo",
			maxLength: 255
		});
		assert.strictEqual(sWidth, "30em", "Max Limit");

		// precision
		sWidth = FormatUtil.getWidth({
			name: "foo",
			precision: 10
		});
		assert.strictEqual(sWidth, "10.75em");

		sWidth = FormatUtil.getWidth({
			name: "foo",
			precision: 32
		});
		assert.strictEqual(sWidth, "30em", "Max Limit");

		// DateTime
		sWidth = FormatUtil.getWidth({
			name: "foo",
			type: "Edm.DateTime",
			displayFormat: "Date"
		});
		assert.strictEqual(sWidth, "9em", "Date");
		// CalendarDate
		sWidth = FormatUtil.getWidth({
			name: "foo",
			type: "Edm.String",
			isCalendarDate: true
		});
		assert.strictEqual(sWidth, "9em", "Date");

		// String with DescriptionOnlt
		sWidth = FormatUtil.getWidth({
			name: "foo",
			type: "Edm.String",
			description: "textPath",
			displayBehaviour: "descriptionAndId"
		});
		assert.strictEqual(sWidth, "30em", "Max Limit");
		// other properties ignored for description fields
		sWidth = FormatUtil.getWidth({
			name: "foo",
			type: "Edm.String",
			maxLength: 5,
			description: "textPath",
			displayBehaviour: "descriptionAndId"
		});
		assert.strictEqual(sWidth, "30em", "Max Limit");

		// Boolean fields
		sWidth = FormatUtil.getWidth({
			name: "foo",
			type: "Edm.Boolean"
		});
		assert.strictEqual(sWidth, "3.25em", "Min Limit");

		// Metadata below Min limit
		sWidth = FormatUtil.getWidth({
			name: "foo",
			maxLength: "2"
		});
		assert.strictEqual(sWidth, "3em", "Min Limit");

		// Metadata "Max" value
		sWidth = FormatUtil.getWidth({
			name: "foo",
			maxLength: "Max"
		}, 25, 10);
		assert.strictEqual(sWidth, "25em", "Custom Max Limit");

		// Metadata "Unknown" value
		sWidth = FormatUtil.getWidth({
			name: "foo",
			maxLength: "?"
		}, 25, 10);
		assert.strictEqual(sWidth, "25em", "Custom Max Limit");

		// Custom Min, Max
		sWidth = FormatUtil.getWidth({
			name: "foo",
			type: "Edm.Boolean"
		}, 10, 5);
		assert.strictEqual(sWidth, "5em", "Custom Min Limit");

		// Custom Min, Max (undeterminate width)
		sWidth = FormatUtil.getWidth({
			name: "foo",
			type: "Edm.String"
		}, 10, 5);
		assert.strictEqual(sWidth, "10em", "Custom Max Limit");
	});

	QUnit.test("_getFractionDigitDifference", function(assert) {
		let sValue = "";
		const oCurrencyInstance = new Currency();
		assert.strictEqual(FormatUtil._getFractionDigitDifference(oCurrencyInstance, sValue, 1, 3), 0, "returns 0, for empty value");

		sValue = "1";
		assert.strictEqual(FormatUtil._getFractionDigitDifference(oCurrencyInstance, sValue, 1, 3), 0, "returns 0, if value contains no decimal digits");

		sValue = "1.1";
		assert.strictEqual(FormatUtil._getFractionDigitDifference(oCurrencyInstance, sValue, 1, 3), 0, "returns 0, decimal digit are acceptable according to the Max decimal digits");

		sValue = "1.11";
		assert.strictEqual(FormatUtil._getFractionDigitDifference(oCurrencyInstance, sValue, 1, 3), 1, "returns 1, since there is 1 additional fraction digit than suggested");

		sValue = "1.1111";
		assert.strictEqual(FormatUtil._getFractionDigitDifference(oCurrencyInstance, sValue, 1, 3), 2, "returns 2, there are more digits than the Max fractional digits");

	});

	QUnit.test("_getMaxMeasureUnitFractionDigit", function(assert) {
		assert.equal(FormatUtil._getMaxMeasureUnitFractionDigit(), 0, "Maximum scale is 0 without CodeList");

		let oCodeList = {
			A: { UnitSpecificScale: 0 },
			B: { UnitSpecificScale: 1 },
			C: { UnitSpecificScale: 2 }
		};

		assert.equal(FormatUtil._getMaxMeasureUnitFractionDigit(oCodeList), 2, "Maximum scale of the CodeList is 2");

		oCodeList = {
			A: { UnitSpecificScale: -5 },
			B: { UnitSpecificScale: -3 },
			C: { UnitSpecificScale: -1 }
		};

		assert.equal(FormatUtil._getMaxMeasureUnitFractionDigit(oCodeList), 0, "Negative scale needs to be ignored");

		oCodeList = {
			A: { UnitSpecificScale: 0 },
			B: { UnitSpecificScale: 1 },
			C: { UnitSpecificScale: 2 },
			D: { UnitSpecificScale: 5 },
			E: { UnitSpecificScale: 10 },
			F: { UnitSpecificScale: 99 }
		};

		const oCodeListCopy = JSON.parse(JSON.stringify(oCodeList));

		assert.equal(FormatUtil._getMaxMeasureUnitFractionDigit(oCodeList), 3, "Maximum scale of the CodeList is 3");
		assert.deepEqual(oCodeList, oCodeListCopy, "CodeList must not be changed during scale evaluation");
	});

	QUnit.module("whitespace replacer");

	QUnit.test("getFormatterFunctionFromDisplayBehaviour input values containing whitespace", function(assert) {
		var testFunction = function(mResult, sId, sDesc) {
			var sDisplayBehaviour, fnFormatter, sResult;
			for (sDisplayBehaviour in mResult) {
				fnFormatter = FormatUtil.getFormatterFunctionFromDisplayBehaviour(sDisplayBehaviour);
				assert.ok(fnFormatter);

				sResult = fnFormatter(sId, sDesc);
				assert.ok(sResult !== mResult[sDisplayBehaviour], "Resulting value not formatted as per sap.base.strings.whitespaceReplacer");
			}
		};

		// Execution - 1 (Both Id & Desc are available)
		testFunction({
			descriptionAndId: fnWhitespaceReplacer("\td (\ti)"),
			idAndDescription: fnWhitespaceReplacer("\ti (\td)"),
			descriptionOnly: fnWhitespaceReplacer("\td"),
			idOnly: fnWhitespaceReplacer("\ti")
		}, "\ti", "\td");
	});

	QUnit.test("getFormatterFunctionFromDisplayBehaviour input values containing whitespace", function(assert) {
		var testFunction = function(mResult, sId, sDesc) {
			var sDisplayBehaviour, fnFormatter, sResult;
			for (sDisplayBehaviour in mResult) {
				fnFormatter = FormatUtil.getFormatterFunctionFromDisplayBehaviour(sDisplayBehaviour);
				assert.ok(fnFormatter);

				sResult = fnFormatter(sId, sDesc);
				assert.ok(sResult !== mResult[sDisplayBehaviour], "Resulting value not formatted as per sap.base.strings.whitespaceReplacer");
			}
		};

		// Execution - 1 (Both Id & Desc are available)
		testFunction({
			descriptionAndId: fnWhitespaceReplacer("\td (\ti)"),
			idAndDescription: fnWhitespaceReplacer("\ti (\td)"),
			descriptionOnly: fnWhitespaceReplacer("\td"),
			idOnly: fnWhitespaceReplacer("\ti")
		}, "\ti", "\td");
	});

	QUnit.test("getFormatterFunctionFromDisplayBehaviour for whitespaceReplacer", function(assert) {
		var testFunction = function(mResult, sId, sDesc) {
			var sDisplayBehaviour, fnFormatter, sResult;
			for (sDisplayBehaviour in mResult) {
				fnFormatter = FormatUtil.getFormatterFunctionFromDisplayBehaviour(sDisplayBehaviour, true /* bReplaceWhitespace */);
				assert.ok(fnFormatter);

				sResult = fnFormatter(sId, sDesc);
				assert.ok(sResult === mResult[sDisplayBehaviour], "Resulting value not formatted as per sap.base.strings.whitespaceReplacer");
			}
		};

		// Execution - 1 (Both Id & Desc are available)
		testFunction({
			descriptionAndId: fnWhitespaceReplacer("\td (\ti)"),
			idAndDescription: fnWhitespaceReplacer("\ti (\td)"),
			descriptionOnly: fnWhitespaceReplacer("\td"),
			idOnly: fnWhitespaceReplacer("\ti")
		}, "\ti", "\td");
	});

	QUnit.test("getInlineGroupFormatterFunction for whitespaceReplacer", function(assert) {
		var done = assert.async();
		sap.ui.require([
			"sap/ui/model/odata/type/String"
		], function(String) {
			var oFieldMetadata = {
				name: "foo",
				type: "Edm.String",
				description: "PathToDescription",
				modelType: sinon.createStubInstance(String),
				displayBehaviour: "descriptionAndId"
			};

			var fnGetFormatterFunctionFromDisplayBehaviour = sinon.spy(FormatUtil, "getFormatterFunctionFromDisplayBehaviour");
			var fnFormatter = FormatUtil.getInlineGroupFormatterFunction(oFieldMetadata, undefined, undefined, undefined, true /* bReplaceWhitespace */);
			assert.ok(fnGetFormatterFunctionFromDisplayBehaviour.calledWith("descriptionAndId", true), "fnGetFormatterFunctionFromDisplayBehaviour called with correct aruguments 'descriptionAndId' & 'true' (bReplaceWhitespace)");
			assert.ok(fnFormatter, "formatter function available");

			var sResult = fnFormatter("\tid", "\tdesc");
			assert.strictEqual(sResult, fnWhitespaceReplacer("\tdesc (\tid)"));
			done();
		});
	});

	QUnit.module("DateTimeWithTimezone");

	QUnit.test("Test formatter", function(assert) {
		assert.notOk(FormatUtil._oDateTimeWithTimezone, "sap.ui.model.odata.type.DateTimeWithTimezone instance is not created yet");
		var fnFormatter = FormatUtil.getDateTimeWithTimezoneFormatter();
		assert.ok(FormatUtil._oDateTimeWithTimezone, "DateFormat.getDateTimeWithTimezoneInstance created");
		var fnDateTimeWithTimezoneFormatSpy = sinon.spy(FormatUtil._oDateTimeWithTimezone, "format"),
			oSampleDate = new Date(Date("1758751200000+0000")),
			sSampleTimezone = "America/New_York";

		fnFormatter(oSampleDate, sSampleTimezone);
		assert.ok(fnDateTimeWithTimezoneFormatSpy.calledWith(oSampleDate, sSampleTimezone), "formatter called Date and Timezone parameters");

		fnFormatter(oSampleDate, null);
		assert.ok(fnDateTimeWithTimezoneFormatSpy.calledWith(oSampleDate, null), "timezone is null, and should use the user timezone");
	});

	QUnit.test("Test formatter with FormatOptions with pattern", function(assert) {
		var fnFormatter = FormatUtil.getDateTimeWithTimezoneFormatter({UTC: true, style: "short", pattern:"dd.MM.yyyy HH:mm:ss VV"}),
			oSampleDate = new Date(1416851212345),
			sSampleTimezone = "Europe/Berlin";
		var sFormattedValue = fnFormatter(oSampleDate, sSampleTimezone);
		assert.equal(sFormattedValue, "24.11.2014 18:46:52 Europe, Berlin");
	});

	QUnit.test("Test formatter with FormatOptions show time zone only", function(assert) {
		var fnFormatter = FormatUtil.getDateTimeWithTimezoneFormatter({UTC: true, style: "short", showTimezone: true, showDate: false, showTime: false}),
			oSampleDate = new Date(1416851212345),
			sSampleTimezone = "Europe/Berlin";
		var sFormattedValue = fnFormatter(oSampleDate, sSampleTimezone);
		assert.equal(sFormattedValue, "Europe, Berlin");
	});

	QUnit.test("Test formatter with FormatOptions show time zone hide", function(assert) {
		var fnFormatter = FormatUtil.getDateTimeWithTimezoneFormatter({UTC: true, style: "short", showTimezone: false, pattern:"dd.MM.yyyy HH:mm:ss"}),
			oSampleDate = new Date(1416851212345),
			sSampleTimezone = "Europe/Berlin";
		var sFormattedValue = fnFormatter(oSampleDate, sSampleTimezone);
		assert.equal(sFormattedValue, "24.11.2014 18:46:52");
	});

	QUnit.module("NotAssigned formatters");

	QUnit.test("Id only formatter", function(assert){
		var fnFormatter = FormatUtil.getFormatterFunctionFromDisplayBehaviour("idOnly", false, {getNotAssignedText: function(){return "Not assigned";}});

		var sSampleId = "";
		var sSampleDesc = "Anything";

		assert.equal(fnFormatter(sSampleId, sSampleDesc), "Not assigned", "Not assigned returned");

		sSampleId = "12345";
		assert.equal(fnFormatter(sSampleId, sSampleDesc), "12345", "Correct value returned");

	});

	QUnit.test("Desc only formatter", function(assert){
		var fnFormatter = FormatUtil.getFormatterFunctionFromDisplayBehaviour("descriptionOnly", false, {getNotAssignedText: function(){return "Not assigned";}});

		var sSampleId = "Anything";
		var sSampleDesc = "";

		assert.equal(fnFormatter(sSampleId, sSampleDesc), "Not assigned", "Not assigned returned");

		sSampleDesc = "12345";
		assert.equal(fnFormatter(sSampleId, sSampleDesc), "12345", "Correct value returned");

	});

	QUnit.test("Id & Desc formatter", function(assert){
		var fnFormatter = FormatUtil.getFormatterFunctionFromDisplayBehaviour("idAndDescription", false, {getNotAssignedText: function(){return "Not assigned";}});

		var sSampleId = "";
		var sSampleDesc = "";

		assert.equal(fnFormatter(sSampleId, sSampleDesc), "Not assigned", "Not assigned returned");

		sSampleId = "12345";
		sSampleDesc = "ABC";
		assert.equal(fnFormatter(sSampleId, sSampleDesc), "12345 (ABC)", "Correct value returned");

	});

	QUnit.test("Desc & Id  formatter", function(assert){
		var fnFormatter = FormatUtil.getFormatterFunctionFromDisplayBehaviour("descriptionAndId", false, {getNotAssignedText: function(){return "Not assigned";}});

		var sSampleId = "";
		var sSampleDesc = "";

		assert.equal(fnFormatter(sSampleId, sSampleDesc), "Not assigned", "Not assigned returned");

		sSampleId = "12345";
		sSampleDesc = "ABC";
		assert.equal(fnFormatter(sSampleId, sSampleDesc), "ABC (12345)", "Correct value returned");

	});
});
