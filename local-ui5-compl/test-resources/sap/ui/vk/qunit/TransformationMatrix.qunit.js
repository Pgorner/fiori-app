/* global QUnit */

sap.ui.define([
	"sap/ui/vk/TransformationMatrix"
], function(
	TransformationMatrix
) {
	"use strict";

	QUnit.test("Test TransformationMatrix", function(assert) {
		var exactValues = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		var withinTolerance = [
			1, 0, 0, 0.00000001,
			0, 1, 0, 0.00000001,
			0, 0, 1, 0.00000001,
			0, 0, 0, 0.99999999
		];
		var badAtIndex3 = [
			1, 0, 0, 3,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		var badAtIndex7 = [
			1, 0, 0, 0,
			0, 1, 0, 3,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		var badAtIndex11 = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 3,
			0, 0, 0, 1
		];
		var badAtIndex15 = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			3, 0, 0, 3
		];

		assert.equal(TransformationMatrix.canConvertTo4x3(exactValues), true, "values match exactly");
		assert.equal(TransformationMatrix.canConvertTo4x3(withinTolerance), true, "values within tolerance");

		assert.equal(TransformationMatrix.canConvertTo4x3(badAtIndex3), false, "m[3] differs by more than tolerance");
		assert.equal(TransformationMatrix.canConvertTo4x3(badAtIndex7), false, "m[7] differs by more than tolerance");
		assert.equal(TransformationMatrix.canConvertTo4x3(badAtIndex11), false, "m[11] differs by more than tolerance");
		assert.equal(TransformationMatrix.canConvertTo4x3(badAtIndex15), false, "m[15] differs by more than tolerance");
	});
});
