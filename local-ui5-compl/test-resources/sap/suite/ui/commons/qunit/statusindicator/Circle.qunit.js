sap.ui.define([
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/statusindicator/Circle",
	"./StubsFactory",
	"sap/ui/core/theming/Parameters",
	"sap/suite/ui/commons/statusindicator/ShapeGroup",
	"./Utils",
	"sap/ui/thirdparty/sinon",
	"sap/ui/qunit/utils/nextUIUpdate"
], function (library, Circle, StubsFactory, Parameters, ShapeGroup, Utils, sinon, nextUIUpdate) {
	"use strict";

	// add svg element to document.body
	var svgElem = document.createElement("svg");
	svgElem.id = "svg-container";
	svgElem.version = "1.1";
	svgElem.xlmns = "http://www.w3.org/2000/svg";
	document.body.appendChild(svgElem);

	var FillingType = library.statusindicator.FillingType;

	var FillingDirectionType = library.statusindicator.FillingDirectionType;

	QUnit.module("Circle Test", {
		beforeEach: function () {
			this.sandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			this.sandbox.verifyAndRestore();
		}
	});

	function prepareCircle(oCircle) {
		oCircle.setCx(20);
		oCircle.setCy(10);
		oCircle.setR(50);
		oCircle.setStrokeWidth(2);
		oCircle.setStrokeColor("Good");
		oCircle.setFillColor("Error");
		oCircle.setFillingType(FillingType.Linear);
		oCircle._injectAnimationPropertiesResolver(StubsFactory.createDummyPropertiesResolver());
		return oCircle;
	}

	function prepareCircleSemantic(oCircle) {
		oCircle.setCx(20);
		oCircle.setCy(10);
		oCircle.setR(50);
		oCircle.setStrokeWidth(2);
		oCircle.setStrokeColor("Sequence2");
		oCircle.setFillColor("Sequence1");
		oCircle.setFillingType(FillingType.Linear);
		oCircle._injectAnimationPropertiesResolver(StubsFactory.createDummyPropertiesResolver(true));
		return oCircle;
	}

	QUnit.test("Test default values", function (assert) {
		// Given
		var oCircle = new Circle();
		// Then
		assert.equal(oCircle.getCx(), 0, "Default value of Cx is 0");
		assert.equal(oCircle.getCy(), 0, "Default value of Cy is 0");
		assert.equal(oCircle.getR(), 0, "Default value of R is 0");
	});

	/**
		* @deprecated Since version 1.120
	*/
	QUnit.test("Changing values", function (assert) {
		// Given
		var oCircle = new Circle();
		oCircle = prepareCircle(oCircle);
		// Then
		assert.equal(oCircle.getCx(), 20, "Value of Cx is 20");
		assert.equal(oCircle.getCy(), 10, "Value of Cy is 10");
		assert.equal(oCircle.getR(), 50, "Value of r is 50");
		assert.equal(oCircle.getStrokeWidth(), 2, "Value of StrokeWidth is 2");
		assert.equal(oCircle.getStrokeColor(), "Good", "Value of StrokeColor is red");
		assert.equal(oCircle.getFillColor(), "Error", "Value of FillColor is black");
	});

	QUnit.test("Changing values using SemanticColor", function (assert) {
		// Given
		var oCircle = new Circle();
		oCircle = prepareCircleSemantic(oCircle);
		// Then
		assert.equal(oCircle.getCx(), 20, "Value of Cx is 20");
		assert.equal(oCircle.getCy(), 10, "Value of Cy is 10");
		assert.equal(oCircle.getR(), 50, "Value of r is 50");
		assert.equal(oCircle.getStrokeWidth(), 2, "Value of StrokeWidth is 2");
		assert.equal(oCircle.getStrokeColor(), "Sequence2", "Value of StrokeColor is red");
		assert.equal(oCircle.getFillColor(), "Sequence1", "Value of FillColor is black");
	});

	/**
		* @deprecated Since version 1.120
	*/
	QUnit.test("Test of Rendering", async function (assert) {
		// Given
		var oCircle = new Circle();
		oCircle = prepareCircle(oCircle);
		oCircle._oAnimationPropertiesResolver.getValue.returns(20);

		var getCssParamStub = sinon.stub(Parameters, "get");
		getCssParamStub.withArgs("sapNeutralColor").returns("#222");
		oCircle.setFillColor("Critical");
		oCircle.setStrokeColor("Neutral");

		// When
		oCircle.placeAt("svg-container");
		await nextUIUpdate();

		// Then
		var oRootElement = jQuery(document.getElementById(oCircle.getId()))[0];
		var oCircleElement = oRootElement.childNodes[1];

		assert.equal(oCircleElement.getAttribute("cx"), 20, "Value of cx is 20");
		assert.equal(oCircleElement.getAttribute("cy"), 10, "Value of cy is 10");
		assert.equal(oCircleElement.getAttribute("r"), 50, "Value of r is 50");
		assert.equal(oCircleElement.getAttribute("stroke-width"), 0, "Value of strokeWidth is 2");
		assert.equal(oCircleElement.getAttribute("stroke"), "#222", "Value of stroke has been converted according to theme");
		assert.equal(oCircleElement.getAttribute("fill"), "#123456", "Value of fill has been determined by resolver");

		var oCircleBorderElement = oRootElement.childNodes[2];
		assert.equal(oCircleBorderElement.tagName, "circle");
		assert.equal(oCircleBorderElement.getAttribute("stroke-width"), 2);
		assert.equal(oCircleBorderElement.getAttribute("fill"), "transparent");

		getCssParamStub.restore();
	});

	QUnit.test("Test of Rendering using SemanticColor", async function (assert) {
		// Given
		var oCircle = new Circle();
		oCircle = prepareCircleSemantic(oCircle);
		oCircle._oAnimationPropertiesResolver.getValue.returns(20);

		// When
		oCircle.placeAt("svg-container");
		await nextUIUpdate();

		// Then
		var oRootElement = jQuery(document.getElementById(oCircle.getId()))[0];
		var oCircleElement = oRootElement.childNodes[1];

		assert.equal(oCircleElement.getAttribute("cx"), 20, "Value of cx is 20");
		assert.equal(oCircleElement.getAttribute("cy"), 10, "Value of cy is 10");
		assert.equal(oCircleElement.getAttribute("r"), 50, "Value of r is 50");
		assert.equal(oCircleElement.getAttribute("stroke-width"), 0, "Value of strokeWidth is 2");
		assert.ok(oCircleElement.getAttribute("class").includes("strokeSemanticColorSequence2"), "Value of stroke has been converted according to theme");
		assert.ok(oCircleElement.getAttribute("class").includes("fillSemanticColorCritical"), "Value of fill has been determined by resolver");

		var oCircleBorderElement = oRootElement.childNodes[2];
		assert.equal(oCircleBorderElement.tagName, "circle");
		assert.equal(oCircleBorderElement.getAttribute("stroke-width"), 2);
		assert.equal(oCircleBorderElement.getAttribute("fill"), "transparent");

	});

	/**
		* @deprecated Since version 1.120
	*/
	QUnit.test("Test of Rendering Mask", async function (assert) {
		// Given
		var oCircle = new Circle();
		oCircle = prepareCircle(oCircle);
		oCircle._oAnimationPropertiesResolver.getValue.returns(20);
		oCircle.setFillingType(FillingType.Radial);

		oCircle.placeAt("svg-container");
		await nextUIUpdate();

		var oRootElement = oCircle.$()[0];
		var defsChildren = oRootElement.childNodes[0].childNodes;
		var gradientElement = defsChildren[0];
		var gradientElementChildren = gradientElement.childNodes;
		var maskElement = defsChildren[1];
		var maskShapeElement = maskElement.childNodes[0];
		var circleElement = oRootElement.childNodes[1];

		assert.equal(defsChildren.length, 2, "Length of defs is 2");
		assert.equal(defsChildren[0].tagName, "radialGradient", "sName of First element is radialGradient");
		assert.equal(defsChildren[1].tagName, "mask", "sName of Second element is mask");
		assert.equal(gradientElementChildren[0].tagName, "stop", "Filling : First sName is equal to stop");
		assert.equal(gradientElementChildren[1].tagName, "stop", "Filling : Second sName is equal to stop");
		assert.equal(gradientElementChildren[0].getAttribute("offset"), 0, "Offset is equal to 0");
		assert.equal(gradientElementChildren[1].getAttribute("offset"), 0, "Second Offset is equal to 0");
		assert.equal(gradientElementChildren[0].getAttribute("stop-color"), "white", "First StopColor is White");
		assert.equal(gradientElementChildren[1].getAttribute("stop-color"), "transparent", "Second StopColor is transpanent");

		assert.equal(maskShapeElement.tagName, "circle", "Mask shape is circle element");
		assert.equal(Utils.getUrlId(circleElement.getAttribute("mask")), maskElement.getAttribute("id"), "Mask of Circle points to Mask element");

		assert.equal(maskShapeElement.getAttribute("cx"), 20, "Value of cx is 20");
		assert.equal(maskShapeElement.getAttribute("cy"), 10, "Value of cy is 10");
		assert.equal(maskShapeElement.getAttribute("r"), 50, "Value of r is 50");
		assert.equal(maskShapeElement.getAttribute("stroke-width"), 0, "Value of strokeWidth is 2");
		assert.equal(maskShapeElement.getAttribute("stroke"), "white", "Shape inside mask has to have always white stroke");
		assert.equal(Utils.getUrlId(maskShapeElement.getAttribute("fill")), gradientElement.getAttribute("id"), "Value of fill is correct");
	});

	QUnit.test("Test of Rendering Mask using SemanticColor", async function (assert) {
		// Given
		var oCircle = new Circle();
		oCircle = prepareCircle(oCircle);
		oCircle._oAnimationPropertiesResolver.getValue.returns(20);
		oCircle.setFillingType(FillingType.Radial);

		oCircle.placeAt("svg-container");
		await nextUIUpdate();

		var oRootElement = oCircle.$()[0];
		var defsChildren = oRootElement.childNodes[0].childNodes;
		var gradientElement = defsChildren[0];
		var gradientElementChildren = gradientElement.childNodes;
		var maskElement = defsChildren[1];
		var maskShapeElement = maskElement.childNodes[0];
		var circleElement = oRootElement.childNodes[1];

		assert.equal(defsChildren.length, 2, "Length of defs is 2");
		assert.equal(defsChildren[0].tagName, "radialGradient", "sName of First element is radialGradient");
		assert.equal(defsChildren[1].tagName, "mask", "sName of Second element is mask");
		assert.equal(gradientElementChildren[0].tagName, "stop", "Filling : First sName is equal to stop");
		assert.equal(gradientElementChildren[1].tagName, "stop", "Filling : Second sName is equal to stop");
		assert.equal(gradientElementChildren[0].getAttribute("offset"), 0, "Offset is equal to 0");
		assert.equal(gradientElementChildren[1].getAttribute("offset"), 0, "Second Offset is equal to 0");
		assert.equal(gradientElementChildren[0].getAttribute("stop-color"), "white", "First StopColor is White");
		assert.equal(gradientElementChildren[1].getAttribute("stop-color"), "transparent", "Second StopColor is transpanent");

		assert.equal(maskShapeElement.tagName, "circle", "Mask shape is circle element");
		assert.equal(Utils.getUrlId(circleElement.getAttribute("mask")), maskElement.getAttribute("id"), "Mask of Circle points to Mask element");

		assert.equal(maskShapeElement.getAttribute("cx"), 20, "Value of cx is 20");
		assert.equal(maskShapeElement.getAttribute("cy"), 10, "Value of cy is 10");
		assert.equal(maskShapeElement.getAttribute("r"), 50, "Value of r is 50");
		assert.equal(maskShapeElement.getAttribute("stroke-width"), 0, "Value of strokeWidth is 2");
		assert.equal(maskShapeElement.getAttribute("stroke"), "white", "Shape inside mask has to have always white stroke");
		assert.equal(Utils.getUrlId(maskShapeElement.getAttribute("fill")), gradientElement.getAttribute("id"), "Value of fill is correct");
	});

	/**
		* @deprecated Since version 1.120
	*/
	function directionTest(direction, x1, x2, y1, y2) {
		QUnit.test("Test of Filling Direction " + direction, async function (assert) {
			// Given
			var oCircle = new Circle({
				fillingType: FillingType.Linear,
				fillingDirection: direction
			});
			prepareCircleSemantic(oCircle);

			oCircle.placeAt("svg-container");
			await nextUIUpdate();

			var oGradientElement = oCircle.$()[0].childNodes[0].childNodes[0];

			assert.equal(oGradientElement.getAttribute("x1"), x1, x1 === 1 ? "Filling Direction is Left " : "Filling Direction is not Left ");
			assert.equal(oGradientElement.getAttribute("x2"), x2, x2 === 1 ? "Filling Direction is Right " : "Filling Direction is not Right ");
			assert.equal(oGradientElement.getAttribute("y1"), y1, y1 === 1 ? "Filling Direction is Up " : "Filling Direction is not Up ");
			assert.equal(oGradientElement.getAttribute("y2"), y2, y2 === 1 ? "Filling Direction is Down " : "Filling Direction is not Down ");
		});
	}

	/**
		* @deprecated Since version 1.120
	*/
	directionTest(FillingDirectionType.Left, 1, 0, 0, 0);
	/**
		* @deprecated Since version 1.120
	*/
	directionTest(FillingDirectionType.Right, 0, 1, 0, 0);
	/**
		* @deprecated Since version 1.120
	*/
	directionTest(FillingDirectionType.Up, 0, 0, 1, 0);
	/**
		* @deprecated Since version 1.120
	*/
	directionTest(FillingDirectionType.Down, 0, 0, 0, 1);

	function directionTestSemantic(direction, x1, x2, y1, y2) {
		QUnit.test("Test of Filling Direction using SemanticColor " + direction, async function (assert) {
			// Given
			var oCircle = new Circle({
				fillingType: FillingType.Linear,
				fillingDirection: direction
			});
			prepareCircleSemantic(oCircle);

			oCircle.placeAt("svg-container");
			await nextUIUpdate();

			var oGradientElement = oCircle.$()[0].childNodes[0].childNodes[0];

			assert.equal(oGradientElement.getAttribute("x1"), x1, x1 === 1 ? "Filling Direction is Left " : "Filling Direction is not Left ");
			assert.equal(oGradientElement.getAttribute("x2"), x2, x2 === 1 ? "Filling Direction is Right " : "Filling Direction is not Right ");
			assert.equal(oGradientElement.getAttribute("y1"), y1, y1 === 1 ? "Filling Direction is Up " : "Filling Direction is not Up ");
			assert.equal(oGradientElement.getAttribute("y2"), y2, y2 === 1 ? "Filling Direction is Down " : "Filling Direction is not Down ");
		});
	}

	directionTestSemantic(FillingDirectionType.Left, 1, 0, 0, 0);
	directionTestSemantic(FillingDirectionType.Right, 0, 1, 0, 0);
	directionTestSemantic(FillingDirectionType.Up, 0, 0, 1, 0);
	directionTestSemantic(FillingDirectionType.Down, 0, 0, 0, 1);

});
