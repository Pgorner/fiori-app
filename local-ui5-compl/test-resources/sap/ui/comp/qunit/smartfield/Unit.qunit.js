/* global QUnit */
sap.ui.define([
	"sap/base/i18n/Formatting",
	"sap/ui/comp/smartfield/type/Unit",
	"sap/ui/model/ValidateException",
	"sap/ui/comp/smartfield/UoMValidateException"
], function(Formatting, Unit, ValidateException, UoMValidateException) {
	"use strict";

	QUnit.module("");

	QUnit.test("it should return the name of the data type class", function(assert) {

		// assert
		assert.strictEqual(Unit.prototype.getName.call(), "sap.ui.comp.smartfield.type.Unit");
	});

	QUnit.module("parseValue and validateValue", {
		beforeEach: function() {
			this.oFormatOptions = {
				showMeasure: false,
				parseAsString: true,
				emptyString: 0
			};
			this.oConstraints = {
				scale: 2
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

		var aCurrentValues = [undefined, "KG"];

		// system under test
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		var aValues = oUnitType.parseValue("123", "string", aCurrentValues);
		oUnitType.validateValue(aValues);

		// assert
		assert.ok(Array.isArray(aValues));
		assert.strictEqual(aValues[0], "123");
		assert.strictEqual(aValues[1], "KG");

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("parsing should remove plus sign from the amount if any", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3
		};

		var aCurrentValues = [undefined, "KG"];

		// system under test
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		var aValues = oUnitType.parseValue("+123", "string", aCurrentValues);

		// assert
		assert.strictEqual(aValues[0], "123");

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("parsing should not change the Unit amount sign", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3
		};

		var aCurrentValues = [undefined, "KG"];

		// system under test
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		var aValues = oUnitType.parseValue("123", "string", aCurrentValues);

		// assert
		assert.strictEqual(aValues[0], "123");

		// act
		aValues = oUnitType.parseValue("-123", "string", aCurrentValues);

		// assert
		assert.strictEqual(aValues[0], "-123");

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test('calling .validateValue(["123", "KG"]) should NOT raise a validate exception ' +
	           'given (Precision=3 and Scale=0)', function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3
			// scale is not specified (the default Scale is 0)
		};

		var CURRENT_VALUES = [undefined, "KG"];

		// system under test
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		var aValues = oUnitType.parseValue("123", "string", CURRENT_VALUES);
		oUnitType.validateValue(aValues);

		// assert
		assert.ok(Array.isArray(aValues));
		var MESSAGE = "123 is an allowed value given the Precision=3 and Scale=0";
		assert.strictEqual(aValues[0], "123", MESSAGE);
		assert.strictEqual(aValues[1], "KG");

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test('calling .validateValue(["123", "KG"]) should raise a validate exception ' +
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

		var CURRENT_VALUES = [undefined, "KG"];

		// system under test
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		var aValues = oUnitType.parseValue("123", "string", CURRENT_VALUES);

		try {
			oUnitType.validateValue(aValues);
		} catch (oException) {

			// assert
			// "123 is not an allowed value given the Precision=3 and Scale=2"
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test('calling .validateValue(["12.345", "KG"]) should raise a validate exception ' +
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
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		try {
			oUnitType.validateValue(["12.345", "KG"]);
		} catch (oException) {

			// assert
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("it should raise a validate exception when the number of decimals places for a Unit " +
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
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = {
			"KG": {
				decimals: 2,
				displayName: "Kilogram"
			}
		};

		// act
		try {
			oUnitType.validateValue(["12.123", "KG"]);
		} catch (oException) {

			// assert
			// a maximum of 2 decimal places for the KGo (KG) Unit are allowed
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("it should raise a validate exception when the number of decimals places for a Unit are " +
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
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = {
			"G/L": {
				decimals: 0,
				displayName: "G/L"
			}
		};

		// act
		try {
			oUnitType.validateValue(["12.1", "G/L"]);
		} catch (oException) {

			// assert
			// no decimal places for G/L Unit are allowed
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("it should not raise a validate exception when the value is NOT a string", function(assert) {

		// system under test
		var oUnitType = new Unit(this.oFormatOptions, this.oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		try {
			oUnitType.validateValue([99.9, "KG"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}
		assert.ok(true);
		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("it should NOT raise a validate exception when the nullable constraint is set to true and the value " +
	           "is empty", function(assert) {

		// arrange
		var oConstraints = Object.assign({
			nullable: true
		}, this.oConstraints);

		// system under test
		var oUnitType = new Unit(this.oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		try {
			var aValues = oUnitType.parseValue("", "string", [undefined, "KG"]),
				sValue = aValues[0];

			oUnitType.validateValue([sValue, "KG"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(true);

		// cleanup
		oUnitType.destroy();
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
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		try {
			var aValues = oUnitType.parseValue("", "string", [undefined, "KG"]),
				sValue = aValues[0];

			oUnitType.validateValue([sValue, "KG"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(true);

		// cleanup
		oUnitType.destroy();
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
		var oUnitType = new Unit(oFormatOptions, oConstraints);
		oUnitType.mCustomUnits = null;

		// act
		try {
		var aValues = oUnitType.parseValue("", "string", [undefined, "KG"]),
			sValue = aValues[0];

			oUnitType.validateValue([sValue, "KG"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(true);

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("it should NOT raise a validate exception when the value has a fraction part that is equal to zero, even though the Unit has no fraction part", function(assert) {

		// system under test
		this.oConstraints = { scale: 2};
		var oUnitType = new Unit(this.oFormatOptions, this.oConstraints);
		oUnitType.mCustomUnits = {
			"G/L": {
				decimals: 0,
				displayName: "G/L"
			}
		};

		// act
		try {
			var aValues = oUnitType.parseValue("1000.00", "string", [undefined, "G/L"]),
				sValue = aValues[0];

				oUnitType.validateValue([sValue, "G/L"]);

				// assert
				assert.ok(sValue === "1000");
			} catch (oException) {

				// assert
				assert.notOk(oException instanceof ValidateException);
			}

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("it should raise a validate exception when the value has a fraction part that is NOT equal to zero and the Unit has no fraction part", function(assert) {

		// system under test
		var oUnitType = new Unit(this.oFormatOptions, this.oConstraints);
		oUnitType.mCustomUnits = {
			"G/L": {
				decimals: 0,
				displayName: "G/L"
			}
		};

		// act
		try {
			var aValues = oUnitType.parseValue("1000.01", "string", [undefined, "G/L"]),
				sValue = aValues[0];

				oUnitType.validateValue([sValue, "G/L"]);
			} catch (oException) {

				// assert
				assert.ok(oException instanceof ValidateException);
			}

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("it should not raise a validate exception or UoMValidateException when the entered unit value is to lowercase", function(assert) {

		// system under test
		var oUnitType = new Unit(this.oFormatOptions, this.oConstraints);
		oUnitType.mCustomUnits = {
			"G/L": {
				decimals: 0,
				displayName: "G/L"
			}
		};

		// act
		try {
			var aValues = oUnitType.parseValue("1000", "string", ["1000", "g/l"]);

			oUnitType.validateValue(aValues);

			assert.ok(true);
			var bHasAssert = true;
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
			assert.notOk(oException instanceof UoMValidateException);
		}

		assert.ok(bHasAssert);
		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("it should raise a UoMValidateException only when the entered unit value is not a part of the unit customizing list", function(assert) {
		// Arrange
		var bHasRaizedExeption = false,
			oUnitType = new Unit(this.oFormatOptions, this.oConstraints),
			oCustomizingList = {
				"KGF": {
					"decimals": 0,
					"displayName": "Kilogram/Square meter",
					"unitPattern-count-other": "{0} KGF"
				}
			};

		oUnitType.oFormatOptions.customUnits = oCustomizingList;
		oUnitType.mCustomUnits = oCustomizingList;

		// act
		try {
			oUnitType.validateValue(["1", "KG"]);
		} catch (oException) {
			// assert
			assert.ok(oException instanceof UoMValidateException);
		}

		// act
		try {
			oUnitType.validateValue(["1", "KGF"]);
		} catch (oException) {
			if (oException instanceof UoMValidateException) {
				bHasRaizedExeption = true;
			}
		}

		assert.notOk(bHasRaizedExeption);

		// cleanup
		oUnitType.destroy();
	});

	QUnit.test("it should not raise a UoMValidateException when the entered unit is invalid and there is no unit customizing list", function(assert) {
		// Arrange
		var bHasRaizedExeption = false,
			oUnitType = new Unit(this.oFormatOptions, this.oConstraints);

		// act
		try {
			oUnitType.validateValue(["1", "EE"]);
		} catch (oException) {
			if (oException instanceof UoMValidateException) {
				bHasRaizedExeption = true;
			}
		}

		// assert
		assert.notOk(bHasRaizedExeption);

		// cleanup
		oUnitType.destroy();
	});

	QUnit.module("Unit validateValue", {
		beforeEach: function () {
			this.oFormatOptions = {
				showMeasure: false,
				parseAsString: true,
				emptyString: 0
			};
			this.oConstraints = {scale: 2};
			this.oUT = new Unit(this.oFormatOptions, this.oConstraints);
			this.oUT.mCustomUnits = {
				"G/L": {
					decimals: 0,
					displayName: "G/L"
				},
				"KG": {
					decimals: 2,
					displayName: "KG"
				}
			};
		},
		afterEach: function () {
			this.oUT.destroy();

			// Reset custom currencies
			Formatting.setCustomCurrencies();
		},
		assertOk: function (assert, sAmount, sUnit, iScale, iPrecision, bVariableScale) {
			// Arrange
			this.oUT.oConstraints = {
				precision: iPrecision,
				scale: iScale,
				variableScale: bVariableScale
			};

			try {
				// Assert
				this.oUT.validateValue([sAmount, sUnit]);
			} catch (oError) {
				assert.ok(false, this.getSettings(arguments) + " ValidateException is thrown with '" + oError.message + "'");

				// Cleanup
				this.oUT.oConstraints = {};
				return;
			}

			// Print result
			assert.ok(true, this.getSettings(arguments));

			// Cleanup
			this.oUT.oConstraints = {};
		},
		assertThrows: function (assert, sAmount, sUnit, iScale, iPrecision, bVariableScale) {
			// Arrange
			this.oUT.oConstraints = {
				precision: iPrecision,
				scale: iScale,
				variableScale: bVariableScale
			};

			try {
				this.oUT.validateValue([sAmount, sUnit]);
			} catch (oError) {
				assert.ok(oError.name === "ValidateException", this.getSettings(arguments) + " ValidateException is thrown with '" + oError.message + "'");

				// Cleanup
				this.oUT.oConstraints = {};
				return;
			}

			assert.ok(false, "Error should be thrown with: " + this.getSettings(arguments));

			// Cleanup
			this.oUT.oConstraints = {};
		},
		getSettings: function (aArguments) {
			return JSON.stringify({
				Amount: aArguments[1],
				Unit: aArguments[2],
				Scale: aArguments[3],
				Precision: aArguments[4],
				VariableScale: aArguments[5]
			}, null,1);
		}
	});

	QUnit.test("Metadata Scale", function (assert) {
		this.assertOk(assert, "100", "KG", 2, 10, false);
		this.assertOk(assert, "100.01", "KG", 2, 10, false);
		this.assertThrows(assert, "100.00001", "KG", 2, 10, false);
		this.assertThrows(assert, "100.00001", "G/L", 0, 10, false);
		this.assertOk(assert, "100", "G/L", 0, 10, true);
	});

	QUnit.test("Unit Scale", function (assert) {
		this.assertOk(assert, "100", "KG", 2, 10, false);
		this.assertOk(assert, "100.00", "KG", 2, 10, false);
		this.assertThrows(assert, "100.001", "KG", 2, 10, false);
	});


	QUnit.test("Scale exceeds precision", function (assert) {
		this.assertOk(assert, "10000.11", "KG", 2, 10, false);
		this.assertThrows(assert, "10000.111", "KG", 2, 10, false);
		this.assertOk(assert, "1", "G/L", 0, 10, false);
		this.assertThrows(assert, "1.1", "G/L", 0, 10, false);
	});
});
