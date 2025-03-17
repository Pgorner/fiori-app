/* global QUnit */
sap.ui.define([
	"sap/base/i18n/Formatting",
	"sap/ui/comp/smartfield/type/Currency",
	"sap/ui/model/ValidateException",
	"sap/ui/comp/smartfield/UoMValidateException",
	"sap/ui/model/ParseException"
], function(Formatting, Currency, ValidateException, UoMValidateException, ParseException) {
	"use strict";

	QUnit.module("");

	QUnit.test("it should return the name of the data type class", function(assert) {

		// assert
		assert.strictEqual(Currency.prototype.getName.call(), "sap.ui.comp.smartfield.type.Currency");
	});

	QUnit.module("parseValue and validateValue", {
		beforeEach: function() {
			this.oFormatOptions = {
				showMeasure: false,
				parseAsString: true,
				emptyString: 0
			};
		},
		afterEach: function() {
			this.oFormatOptions = null;
		}
	});

	QUnit.test("", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3
		};

		var aCurrentValues = [undefined, "EUR"];

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		var aValues = oCurrencyType.parseValue("123", "string", aCurrentValues);
		oCurrencyType.validateValue(aValues);

		// assert
		assert.ok(Array.isArray(aValues));
		assert.strictEqual(aValues[0], "123");
		assert.strictEqual(aValues[1], "EUR");

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("parsing should remove plus sign from the amount if any", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3
		};

		var aCurrentValues = [undefined, "EUR"];

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		var aValues = oCurrencyType.parseValue("+123", "string", aCurrentValues);

		// assert
		assert.strictEqual(aValues[0], "123");

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("parsing should not change the currency amount sign", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3
		};

		var aCurrentValues = [undefined, "EUR"];

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		var aValues = oCurrencyType.parseValue("123", "string", aCurrentValues);

		// assert
		assert.strictEqual(aValues[0], "123");

		// act
		aValues = oCurrencyType.parseValue("-123", "string", aCurrentValues);

		// assert
		assert.strictEqual(aValues[0], "-123");

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test('calling .validateValue(["123", "EUR"]) should NOT raise a validate exception ' +
	           'given (Precision=3 and Scale=0)', function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3
			// scale is not specified (the default Scale is 0)
		};

		var CURRENT_VALUES = [undefined, "EUR"];

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		var aValues = oCurrencyType.parseValue("123", "string", CURRENT_VALUES);
		oCurrencyType.validateValue(aValues);

		// assert
		assert.ok(Array.isArray(aValues));
		var MESSAGE = "123 is an allowed value given the Precision=3 and Scale=0";
		assert.strictEqual(aValues[0], "123", MESSAGE);
		assert.strictEqual(aValues[1], "EUR");

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test('calling .validateValue(["123", "EUR"]) should raise a validate exception ' +
	           'given (Precision=3 and Scale=2)', function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3,
			maxFractionDigits: 2
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3,
			scale: 2
		};

		var CURRENT_VALUES = [undefined, "EUR"];

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		var aValues = oCurrencyType.parseValue("123", "string", CURRENT_VALUES);

		try {
			oCurrencyType.validateValue(aValues);
		} catch (oException) {

			// assert
			// "123 is not an allowed value given the Precision=3 and Scale=2"
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test('calling .validateValue(["12.345", "EUR"]) should raise a validate exception ' +
	           'given (Precision=3 and Scale=2)', function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 5,
			maxFractionDigits: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3,
			scale: 2
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		try {
			oCurrencyType.validateValue(["12.345", "EUR"]);
		} catch (oException) {

			// assert
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should raise a validate exception when the number of decimals places for a currency " +
	           "are exceeded (test case 1)", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 5,
			maxFractionDigits: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 5,
			scale: 3
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		try {
			oCurrencyType.validateValue(["12.123", "EUR"]);
		} catch (oException) {

			// assert
			// a maximum of 2 decimal places for the euro (EUR) currency are allowed
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should raise a validate exception when the number of decimals places for a currency are " +
	           "exceeded (test case 2)", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 5,
			maxFractionDigits: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 5,
			scale: 3
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		try {
			oCurrencyType.validateValue(["12.1", "HUF"]);
		} catch (oException) {

			// assert
			// no decimal places for the Hungarian forint (HUF) currency are allowed
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should raise a validate exception when the value is NOT a string", function(assert) {

		// system under test
		var oCurrencyType = new Currency(this.oFormatOptions, this.oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		try {
			oCurrencyType.validateValue([99.9, "EUR"]);
		} catch (oException) {

			// assert
			assert.ok(oException instanceof ValidateException);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should NOT raise a validate exception when the nullable constraint is set to true and the value " +
	           "is empty", function(assert) {

		// arrange
		var oConstraints = Object.assign({
			nullable: true
		}, this.oConstraints);

		// system under test
		var oCurrencyType = new Currency(this.oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		try {
			var aValues = oCurrencyType.parseValue("", "string", [undefined, "EUR"]),
				sValue = aValues[0];

			oCurrencyType.validateValue([sValue, "EUR"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(true);

		// cleanup
		oCurrencyType.destroy();
	});

	// BCP: 1970394800
	QUnit.test("it should NOT raise a validate exception when the nullable constraint is set to true, the value " +
	           "is empty, and emptyString format option is set to null", function(assert) {

		// arrange
		var oFormatOptions = {
			showMeasure: false,
			parseAsString: true,
			emptyString: null
		};

		var oConstraints = {
			nullable: true
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		try {
			var aValues = oCurrencyType.parseValue("", "string", [undefined, "EUR"]),
				sValue = aValues[0];

			oCurrencyType.validateValue([sValue, "EUR"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(true);

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test('it should NOT raise a validate exception when the nullable constraint is set to true, the value ' +
				'is empty, and emptyString format option is set to ""', function(assert) {

		// arrange
		var oFormatOptions = {
			showMeasure: false,
			parseAsString: true,
			emptyString: ""
		};

		var oConstraints = {
			nullable: true
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		try {
		var aValues = oCurrencyType.parseValue("", "string", [undefined, "EUR"]),
			sValue = aValues[0];

			oCurrencyType.validateValue([sValue, "EUR"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(true);

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should NOT raise a validate exception when the value has a fraction part that is equal to zero, even though the currency has no fraction part", function(assert) {

		// system under test
		var oCurrencyType = new Currency(this.oFormatOptions, this.oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		try {
			var aValues = oCurrencyType.parseValue("1000.00", "string", [undefined, "HUF"]),
				sValue = aValues[0];

				oCurrencyType.validateValue([sValue, "HUF"]);

				// assert
				assert.ok(sValue === "1000");
			} catch (oException) {

				// assert
				assert.notOk(oException instanceof ValidateException);
			}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should raise a validate exception when the value has a fraction part that is NOT equal to zero and the currency has no fraction part", function(assert) {

		// system under test
		var oCurrencyType = new Currency(this.oFormatOptions, this.oConstraints);
		oCurrencyType.mCustomUnits = null;

		// act
		try {
			var aValues = oCurrencyType.parseValue("1000.01", "string", [undefined, "HUF"]),
				sValue = aValues[0];

				oCurrencyType.validateValue([sValue, "HUF"]);
			} catch (oException) {

				// assert
				assert.ok(oException instanceof ValidateException);
			}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should raise a UoMValidateException only when the entered currency code value is not a part of the currency code customizing list", function(assert) {
		// Arrange
		var bHasRaizedExeption = false,
			oCurrencyType = new Currency(this.oFormatOptions, this.oConstraints),
			oCustomizingList = {
				"USD": {
					decimals: 2,
					displayName: "USD"
				}
			};

		oCurrencyType.oFormatOptions.customCurrencies = oCustomizingList;
		oCurrencyType.mCustomUnits = oCustomizingList;

		// act
		try {
			oCurrencyType.validateValue(["1000", "EEE"]);
		} catch (oException) {
			// assert
			assert.ok(oException instanceof UoMValidateException);
		}

		// act
		try {
			oCurrencyType.validateValue(["1000", "USD"]);
		} catch (oException) {
			if (oException instanceof UoMValidateException) {
				bHasRaizedExeption = true;
			}
		}

		// assert
		assert.notOk(bHasRaizedExeption);

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should not raise a UoMValidateException when the entered currency code is invalid and there is no currency code customizing list", function(assert) {
		// system under test
		var bHasRaizedExeption = false,
			oCurrencyType = new Currency(this.oFormatOptions, this.oConstraints);

		// act
		try {
			oCurrencyType.validateValue(["1000", "EEE"]);
		} catch (oException) {
			if (oException instanceof UoMValidateException) {
				bHasRaizedExeption = true;
			}
		}

		// assert
		assert.notOk(bHasRaizedExeption);

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should not raise a validate exception when the entered unit value is to lowercase", function(assert) {

		// system under test
		var oCurrencyType = new Currency(this.oFormatOptions, this.oConstraints);
		oCurrencyType.mCustomUnits = {
			"USD": {
				decimals: 2,
				displayName: "USD"
			}
		};

		// act
		try {
			// var aValues = oUnitType.parseValue("1000", "string", [undefined, "g/l"]),
			// 	sValue = aValues[0];

			oCurrencyType.validateValue(["1000", "usd"]);

			assert.ok(true);
			var bHasAssert = true;
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(bHasAssert);
		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should not raise a parse exception when the entered unit value is to lowercase", function(assert) {

		// system under test
		var oCurrencyType = new Currency(this.oFormatOptions, this.oConstraints);
		oCurrencyType.mCustomUnits = {
			"USD": {
				decimals: 2,
				displayName: "USD"
			}
		};

		// act
		try {
			oCurrencyType.parseValue("1000", "string", [undefined, "usd"]);

				assert.ok(true);
			var bHasAssert = true;
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ParseException);
		}

		assert.ok(bHasAssert);
		// cleanup
		oCurrencyType.destroy();
	});


	QUnit.module("Currency validateValue", {
		beforeEach: function () {
			// Set custom currencies
			Formatting.setCustomCurrencies({
				"DEFAULT": {"digits": 2},
				"MY10": {"digits": 10},
				"MY5": {"digits": 5},
				"MY3": {"digits": 3},
				"MY2": {"digits": 2},
				"MY0": {"digits": 0}
			});

			this.oCT = new Currency();
			this.oCT.mCustomUnits = null;

		},
		afterEach: function () {
			this.oCT.destroy();

			// Reset custom currencies
			Formatting.setCustomCurrencies();
		},
		assertOk: function (assert, sAmount, sCurrency, iScale, iPrecision, bVariableScale) {
			// Arrange
			this.oCT.oConstraints = {
				precision: iPrecision,
				scale: iScale,
				variableScale: bVariableScale
			};

			try {
				// Assert
				this.oCT.validateValue([sAmount, sCurrency]);
			} catch (oError) {
				assert.ok(false, this.getSettings(arguments) + " ValidateException is thrown with '" + oError.message + "'");

				// Cleanup
				this.oCT.oConstraints = {};
				return;
			}

			// Print result
			assert.ok(true, this.getSettings(arguments));

			// Cleanup
			this.oCT.oConstraints = {};
		},
		assertThrows: function (assert, sAmount, sCurrency, iScale, iPrecision, bVariableScale) {
			// Arrange
			this.oCT.oConstraints = {
				precision: iPrecision,
				scale: iScale,
				variableScale: bVariableScale
			};

			try {
				this.oCT.validateValue([sAmount, sCurrency]);
			} catch (oError) {
				assert.ok(oError.name === "ValidateException", this.getSettings(arguments) + " ValidateException is thrown with '" + oError.message + "'");

				// Cleanup
				this.oCT.oConstraints = {};
				return;
			}

			assert.ok(false, "Error should be thrown with: " + this.getSettings(arguments));

			// Cleanup
			this.oCT.oConstraints = {};
		},
		getSettings: function (aArguments) {
			return JSON.stringify({
				Amount: aArguments[1],
				Currency: aArguments[2],
				Scale: aArguments[3],
				Precision: aArguments[4],
				VariableScale: aArguments[5]
			}, null,1);
		}
	});

	QUnit.test("Metadata Scale", function (assert) {
		this.assertOk(assert, "100", "MY0", 3, 10, false);
		this.assertOk(assert, "100.001", "MY3", 3, 10, false);
		this.assertThrows(assert, "100.00001", "MY5", 3, 10, false);
		this.assertOk(assert, "100.00001", "MY5", 5, 10, false);
		this.assertOk(assert, "100.00001", "MY5", 3, 10, true);
		this.assertOk(assert, "0.00001", "MY5", 5, 5, false);
		this.assertOk(assert, "0.00001", "MY5", 0, 5, true);
		this.assertOk(assert, "1.00001", "MY5", 0, 6, true);
	});

	QUnit.test("Currency Scale", function (assert) {
		this.assertOk(assert, "100", "MY0", 3, 10, false);

		// Note: Not sure this should fail as there actually are no significant digits to the right of the decimal
		// separator. For now we keep it as is but it should be discussed and probably adjusted.
		this.assertThrows(assert, "100.00", "MY0", 3, 10, false);

		this.assertThrows(assert, "100.01", "MY2", 0, 10, false);
		this.assertOk(assert, "100.01", "MY2", 0, 10, true);
		this.assertThrows(assert, "100.001", "MY2", 0, 10, true);
		this.assertOk(assert, "0.0000000001", "MY10", 0, 10, true);
		this.assertOk(assert, "1.0000000001", "MY10", 0, 20, true);
		this.assertThrows(assert, "1.00000000001", "MY10", 0, 20, true);
		this.assertOk(assert, "1.1", "MY10", 0, 20, true);
		this.assertOk(assert, "1", "MY10", 0, 20, true);
		this.assertOk(assert, "0", "MY10", 0, 20, true);
		this.assertOk(assert, "1", "MY10", 20, 20, false);
	});

	QUnit.test("Precision", function (assert) {
		this.assertOk(assert, "100", "MY0", 3, 3, false);
		this.assertThrows(assert, "0.1", "MY0", 3, 0, false);
		this.assertThrows(assert, "1", "MY0", 1, 0, false);
		this.assertThrows(assert, "1", "MY5", 0, 0, false);
		this.assertOk(assert, "0", "MY0", 1, 0, false);
		this.assertOk(assert, "0", "MY0", 0, 0, false);
		this.assertOk(assert, "1000000000.0000000001", "MY10", 20, 20, false);
		this.assertThrows(assert, "10000000000.0000000001", "MY10", 20, 20, false);
		this.assertThrows(assert, "1000000000.00000000001", "MY10", 20, 20, false);
	});

	QUnit.test("Scale exceeds precision", function (assert) {
		this.assertOk(assert, "10000", "MY0", 10, 5, false);
		this.assertThrows(assert, "100000", "MY0", 10, 5, false);
		this.assertOk(assert, "0.00001", "MY10", 10, 5, true);
		this.assertThrows(assert, "0.000001", "MY10", 10, 5, true);
		this.assertThrows(assert, "0.000001", "MY10", 10, 5, false);
		this.assertThrows(assert, "0.000001", "MY10", 5, 0, false);
		this.assertThrows(assert, "1", "MY5", 5, 0, false);
		this.assertOk(assert, "0", "MY5", 5, 0, false);
		this.assertThrows(assert, "0.1", "MY5", 5, 0, false);
		this.assertThrows(assert, "0.1", "MY5", 5, 0, true);
	});

	QUnit.test("Corner cases", function (assert) {
		this.assertOk(assert, "0", "MY0", 0, 0, true);
		this.assertThrows(assert, "1", "MY0", 0, 0, true);
		this.assertThrows(assert, "1", "MY0", 0, 0, false);
	});
});
