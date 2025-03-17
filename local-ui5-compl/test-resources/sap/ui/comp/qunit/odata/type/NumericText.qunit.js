/* global QUnit, sinon */
(function () {
	"use strict";
	QUnit.config.autostart = false;

	sap.ui.define([
		'sap/ui/comp/odata/type/NumericText'
	], function (NumericText) {

		QUnit.module("oNumericText Formatting", {
			beforeEach: function () {
				this.oNumericText = new NumericText(null, {isDigitSequence: true});
			},
			afterEach: function () {
				this.oNumericText.destroy();
			}
		});

		QUnit.test("Formatting null", function (assert) {
			var sFormatedValue = this.oNumericText.formatValue(null, "int");
			assert.equal(sFormatedValue, null);
		});

		QUnit.test("Parsing empty string", function (assert) {
			var sFormatedValue = this.oNumericText.formatValue("", "int");
			assert.equal(sFormatedValue, "");
		});

		QUnit.test("Parsing empty string when parseKeepsEmptyString is set", function (assert) {
			var oNumericText = new NumericText(
				{parseKeepsEmptyString: true},
				{isDigitSequence: true}
			);
			assert.strictEqual(oNumericText.parseValue("", "int"), "");
		});

		QUnit.test("Formatting 00", function (assert) {
			var sFormatedValue = this.oNumericText.formatValue("00");
			assert.equal(sFormatedValue, "");
		});

		QUnit.test("Formatting 0", function (assert) {
			var sFormatedValue = this.oNumericText.formatValue("0");
			assert.equal(sFormatedValue, "");
		});

		QUnit.test("Formatting 0 with TextArrangement", function (assert) {
			this.oNumericText.oFormatOptions = { textArrangement: true };
			var sFormatedValue = this.oNumericText.formatValue("0");
			assert.equal(sFormatedValue, "");
		});

		QUnit.test("Formatting 00 with TextArrangement", function (assert) {
			this.oNumericText.oFormatOptions = { textArrangement: true };
			var sFormatedValue = this.oNumericText.formatValue("00");
			assert.equal(sFormatedValue, "00");
		});

		QUnit.test("Formatting 1", function (assert) {
			var sFormatedValue = this.oNumericText.formatValue("1", "int");
			assert.equal(sFormatedValue, "01");
		});

		QUnit.module("oNumericText Parsing", {
			beforeEach: function () {
				this.oNumericText = new NumericText(null,  {isDigitSequence: true});
			},
			afterEach: function () {
				this.oNumericText.destroy();
			}
		});

		QUnit.test("Parsing empty string", function (assert) {
			var sParsedValue = this.oNumericText.parseValue("", "int");
			assert.equal(sParsedValue, null);
		});

		QUnit.test("Parsing empty string should call fieldControl", function (assert) {

			// Arrange
			this.oNumericText.oFieldControl = function() {};
			sinon.spy(this.oNumericText, "oFieldControl");

			// Act
			this.oNumericText.parseValue("", "sString");

			// Assert
			assert.ok(this.oNumericText.oFieldControl.calledWith("", "sString"), "oFieldControl was called with correct arguments");
		});

		QUnit.test("Parsing 00", function (assert) {
			var sParsedValue = this.oNumericText.parseValue("00");
			assert.equal(sParsedValue, null);
		});

		QUnit.test("Parsing 0", function (assert) {
			var sParsedValue = this.oNumericText.parseValue("0");
			assert.equal(sParsedValue, null);
		});

		QUnit.test("Parsing 1", function (assert) {
			var sParsedValue = this.oNumericText.parseValue("01", "int");
			assert.equal(sParsedValue, "1");
		});

		QUnit.start();
	});

})();
