/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/AnimationMath"
], function(
	jQuery,
	AnimationMath
) {
	"use strict";

	QUnit.test("AnimationMath - Cartesian <---> Polar", function(assert) {
		var epsilon = 1e-5;

		var normalize = function(vector) {
			var length2 = vector.reduce(function(accumulator, value) { return accumulator + value * value; }, 0);
			var length = Math.sqrt(length2);

			return vector.map(function(value) { return value / length; });
		};

		var setVectorLength = function(vector, length) {
			var normalized = normalize(vector);
			return normalized.map(function(value) { return value * length; });
		};

		var compareFloats = function(value1, value2, text) {
			assert.equal(Math.abs(value1 - value2) < epsilon, true, text + " " + value1 + " vs " + value2);

		};

		var compareVectors = function(vector1, vector2, text) {
			compareFloats(vector1[0], vector2[0], text + " X:");
			compareFloats(vector1[1], vector2[1], text + " Y:");
			compareFloats(vector1[2], vector2[2], text + " Z:");
		};

		// ---------------------------------------------------
		var axis = [0, 0, 1];
		var polar = AnimationMath.cartesianToPolar(axis);
		compareFloats(polar.azimuth, 0, "[0, 0, 1] -> (0, 0) azimuth");
		compareFloats(polar.elevation, 0, "[0, 0, 1] -> (0, 0) elevation");

		var axisConverted = AnimationMath.polarToCartesian(polar);
		assert.ok(axisConverted[0] === 0 && axisConverted[1] === 0 && axis[2] === 1, "(0, 0) -> [0, 0, 1]");

		// ---------------------------------------------------
		axis = [0, 1, 1];
		polar = AnimationMath.cartesianToPolar(axis);
		compareFloats(polar.azimuth, 0, "[0, 1, 1] -> (0, PI / 4), azimuth");
		compareFloats(polar.elevation, Math.PI / 4, "[0, 1, 1] -> (0, PI / 4), elevation");

		var axisNormalized = normalize(axis);
		polar.radius = 1.0;
		axisConverted = AnimationMath.polarToCartesian(polar);
		compareVectors(axisNormalized, axisConverted, "(0, PI / 4) -> [0, 1, 1]");

		// ---------------------------------------------------
		axis = [1, 0, 1];
		polar = AnimationMath.cartesianToPolar(axis);
		compareFloats(polar.azimuth, Math.PI / 4, "[1, 0, 1] -> (PI / 4, 0), azimuth");
		compareFloats(polar.elevation, 0, "[1, 0, 1] -> (PI / 4, 0), elevation");

		axisNormalized = normalize(axis);
		polar.radius = 1.0;
		axisConverted = AnimationMath.polarToCartesian(polar);
		compareVectors(axisNormalized, axisConverted, "(PI / 4, 0) -> [1, 0, 1]");

		// ---------------------------------------------------
		axis = [1, 1, 1];
		polar = AnimationMath.cartesianToPolar(axis);
		compareFloats(polar.azimuth, Math.PI / 4, "[1, 1, 1] -> (PI / 4, 0.61547), azimuth");
		compareFloats(polar.elevation, 0.61547, "[1, 1, 1] -> (PI / 4, 0.61547), elevation");

		axisNormalized = normalize(axis);
		delete polar.radius;
		axisConverted = AnimationMath.polarToCartesian(polar);
		compareVectors(axisNormalized, axisConverted, "(PI / 4, 0.61547) -> [1, 1, 1]");

		// ---------------------------------------------------
		axis = [-3, -3, -3];
		polar = AnimationMath.cartesianToPolar(axis);
		compareFloats(polar.radius, Math.sqrt(3 * 3 * 3), "radius");
		compareFloats(polar.azimuth, -Math.PI * 3 / 4, "[-1, -1, -1] -> (-3 * PI / 4, -0.61547), azimuth");
		compareFloats(polar.elevation, -0.61547, "[-1, -1, -1] -> (-3 * PI / 4, -0.61547), elevation");

		axisNormalized = setVectorLength(axis, 2);
		polar.radius = 2.0;
		axisConverted = AnimationMath.polarToCartesian(polar);
		compareVectors(axisNormalized, axisConverted, "(-3 * PI / 4, -0.61547) -> [-1, -1, -1]");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
