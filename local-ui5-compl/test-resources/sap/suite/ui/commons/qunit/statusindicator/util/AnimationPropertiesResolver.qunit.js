sap.ui.define([
	"sap/suite/ui/commons/statusindicator/util/AnimationPropertiesResolver",
	"sap/suite/ui/commons/statusindicator/StatusIndicator",
	"sap/suite/ui/commons/statusindicator/ShapeGroup",
	"sap/suite/ui/commons/statusindicator/Rectangle",
	"sap/suite/ui/commons/statusindicator/PropertyThreshold",
	"sap/suite/ui/commons/statusindicator/DiscreteThreshold",
	"sap/ui/Device",
	"sap/suite/ui/commons/statusindicator/util/ThemingUtil",
	"sap/m/library",
	"sap/ui/thirdparty/sinon",
	"sap/suite/ui/commons/library"
], function (AnimationPropertiesResolver, StatusIndicator, ShapeGroup, Rectangle, PropertyThreshold,
             DiscreteThreshold, Device, ThemingUtil, mobileLibrary, sinon, commonsLibrary) {
	"use strict";

	var ValueColor = mobileLibrary.ValueColor;
	var oSemanticColorType = commonsLibrary.SemanticColorType;
	var oSandbox = sinon.sandbox.create();

	var sSemanticGood = ThemingUtil.resolveColor(oSemanticColorType.Good);
	var sSemanticError = ThemingUtil.resolveColor(oSemanticColorType.Error);
	var sSemanticInformation = ThemingUtil.resolveColor(oSemanticColorType.Information);
	var sSemanticCritical = ThemingUtil.resolveColor(oSemanticColorType.Critical);

	function createStubRenderer() {
		return {
			_updateDom: oSandbox.stub(),
			_updateDomGradient: oSandbox.stub(),
			_updateDomColor: oSandbox.stub()
		};
	}

	QUnit.module("AnimationPropertiesResolver", {
		afterEach: function () {
			oSandbox.verifyAndRestore();
		}
	});

	QUnit.test("Get Value - two groups with same weight", function (assert) {
		var oRectangle1 = new Rectangle();
		var oRectangle2 = new Rectangle();
		var oRectangle3 = new Rectangle();

		var oGroup1 = new ShapeGroup({
			shapes: [oRectangle1, oRectangle2],
			weight: 1
		});
		var oGroup2 = new ShapeGroup({
			shapes: [oRectangle3],
			weight: 1
		});

		var oStatusIndicator = new StatusIndicator({
			groups: [oGroup1, oGroup2]
		});

		var oResolver = new AnimationPropertiesResolver(oStatusIndicator);

		var iResolvedValue = oResolver.getValue(oRectangle1, 50);
		assert.equal(iResolvedValue, 50);

		iResolvedValue = oResolver.getValue(oRectangle3, 50);
		assert.equal(iResolvedValue, 50);
	});

	QUnit.test("Get Value - two groups with different weight and discrete thresholds", function (assert) {
		var oRectangle1 = new Rectangle();
		var oRectangle2 = new Rectangle();
		var oRectangle3 = new Rectangle();

		var oGroup1 = new ShapeGroup({
			shapes: [oRectangle1, oRectangle2],
			weight: 3
		});
		var oGroup2 = new ShapeGroup({
			shapes: [oRectangle3],
			weight: 1
		});

		var oStatusIndicator = new StatusIndicator({
			groups: [oGroup1, oGroup2],
			discreteThresholds: [
				new DiscreteThreshold({
					value: 33
				}),
				new DiscreteThreshold({
					value: 80
				})
			]
		});

		var oResolver = new AnimationPropertiesResolver(oStatusIndicator);

		assert.equal(oResolver.getValue(oRectangle1, 43), 0);
		assert.equal(oResolver.getValue(oRectangle1, 44), 44);
		assert.equal(oResolver.getValue(oRectangle1, 50), 44);
		assert.equal(oResolver.getValue(oRectangle1, 100), 44);

		assert.equal(oResolver.getValue(oRectangle2, 43), 0);
		assert.equal(oResolver.getValue(oRectangle2, 44), 44);
		assert.equal(oResolver.getValue(oRectangle2, 50), 44);
		assert.equal(oResolver.getValue(oRectangle2, 100), 44);

		assert.equal(oResolver.getValue(oRectangle3, 19), 0);
		assert.equal(oResolver.getValue(oRectangle3, 20), 20);
		assert.equal(oResolver.getValue(oRectangle3, 40), 20);
		assert.equal(oResolver.getValue(oRectangle3, 100), 20);
	});

	QUnit.test("color specified by threshold", function (assert) {
		var oRectangle1 = new Rectangle({
			fillColor: 'Neutral'
		});
		var oRectangle2 = new Rectangle({
			fillColor: 'Neutral'
		});
		var oRectangle3 = new Rectangle({
			fillColor: 'Neutral'
		});

		var oGroup1 = new ShapeGroup({
			shapes: [
				oRectangle1,
				oRectangle2
			],
			weight: 1
		});
		var oGroup2 = new ShapeGroup({
			shapes: [
				oRectangle3
			],
			weight: 1
		});

		var oStatusIndicator = new StatusIndicator({
			groups: [oGroup1, oGroup2],
			propertyThresholds: [
				new PropertyThreshold({
					fillColor: 'Error',
					toValue: 25
				}),
				new PropertyThreshold({
					fillColor: 'Critical',
					toValue: 50
				}),
				new PropertyThreshold({
					fillColor: 'Good',
					toValue: 75
				})]
		});

		var oResolver = new AnimationPropertiesResolver(oStatusIndicator),
			sErrorColor = ThemingUtil.resolveColor(ValueColor.Error),
			sCriticalColor = ThemingUtil.resolveColor(ValueColor.Critical),
			sGoodColor = ThemingUtil.resolveColor(ValueColor.Good),
			sNeutralColor = ThemingUtil.resolveColor(oSemanticColorType.Neutral);

		oStatusIndicator.setValue(25);
		assert.equal(oResolver.getColor(oRectangle1, 25), sErrorColor);
		assert.equal(oResolver.getColor(oRectangle2, 25), sErrorColor);
		assert.equal(oResolver.getColor(oRectangle3, 25), sErrorColor);
		oStatusIndicator.setValue(26);
		assert.equal(oResolver.getColor(oRectangle1, 26), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle2, 26), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle3, 26), sCriticalColor);
		oStatusIndicator.setValue(49);
		assert.equal(oResolver.getColor(oRectangle1, 49), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle2, 49), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle3, 49), sCriticalColor);
		oStatusIndicator.setValue(50);
		assert.equal(oResolver.getColor(oRectangle1, 50), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle2, 50), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle3, 50), sCriticalColor);
		oStatusIndicator.setValue(51);
		assert.equal(oResolver.getColor(oRectangle1, 51), sGoodColor);
		assert.equal(oResolver.getColor(oRectangle2, 51), sGoodColor);
		assert.equal(oResolver.getColor(oRectangle3, 51), sGoodColor);
		oStatusIndicator.setValue(75);
		assert.equal(oResolver.getColor(oRectangle1, 75), sGoodColor);
		assert.equal(oResolver.getColor(oRectangle2, 75), sGoodColor);
		assert.equal(oResolver.getColor(oRectangle3, 75), sGoodColor);
		oStatusIndicator.setValue(76);
		assert.equal(oResolver.getColor(oRectangle1, 76), sNeutralColor);
		assert.equal(oResolver.getColor(oRectangle2, 76), sNeutralColor);
		assert.equal(oResolver.getColor(oRectangle3, 76), sNeutralColor);
		oStatusIndicator.setValue(100);
		assert.equal(oResolver.getColor(oRectangle1, 100), sNeutralColor);
		assert.equal(oResolver.getColor(oRectangle2, 100), sNeutralColor);
		assert.equal(oResolver.getColor(oRectangle3, 100), sNeutralColor);
	});

	QUnit.test("Test distribution with multiple groups and discrete thresholds", function (assert) {
		var oRectangle1 = new Rectangle();
		var oRectangle2 = new Rectangle();
		var oGroup1 = new ShapeGroup({
			shapes: [
				oRectangle1
			],
			weight: 3
		});
		var oGroup2 = new ShapeGroup({
			shapes: [
				oRectangle2
			],
			weight: 1
		});

		var oStatusIndicator = new StatusIndicator({
			groups: [oGroup1, oGroup2],
			discreteThresholds: [
				new DiscreteThreshold({
					value: 30
				}),
				new DiscreteThreshold({
					value: 54
				}),
				new DiscreteThreshold({
					value: 72
				}),
				new DiscreteThreshold({
					value: 84
				}),
				new DiscreteThreshold({
					value: 92
				}),
				new DiscreteThreshold({
					value: 96
				}),
				new DiscreteThreshold({
					value: 100
				})]
		});

		var oResolver = new AnimationPropertiesResolver(oStatusIndicator);

		assert.equal(oResolver.getValue(oRectangle1, 30), 0);
		assert.equal(oResolver.getValue(oRectangle1, 50), 40);
		assert.equal(oResolver.getValue(oRectangle1, 75), 72);
		assert.equal(oResolver.getValue(oRectangle1, 90), 72);
		assert.equal(oResolver.getValue(oRectangle1, 100), 96);

		assert.equal(oResolver.getValue(oRectangle2, 20), 0);
		assert.equal(oResolver.getValue(oRectangle2, 40), 36);
		assert.equal(oResolver.getValue(oRectangle2, 50), 36);
		assert.equal(oResolver.getValue(oRectangle2, 75), 68);
		assert.equal(oResolver.getValue(oRectangle2, 90), 84);
		assert.equal(oResolver.getValue(oRectangle2, 100), 100);
	});

	function createStatusIndicator(aGroups, aDiscreteThresholds, aPropertyThresholds) {
		var oStatusIndicator = new StatusIndicator({
			groups: aGroups,
			discreteThresholds: aDiscreteThresholds,
			propertyThresholds: aPropertyThresholds
		});

		aGroups.forEach(function (oGroup) {
			oGroup._injectAnimationPropertiesResolver(oStatusIndicator._oAnimationPropertiesResolver);
		});

		return oStatusIndicator;
	}

	function createGroup(aShapes) {
		var oGroup = new ShapeGroup({
			shapes: aShapes
		});
		return oGroup;
	}

	function createDiscreteThreshold(iValue) {
		var oThreshold = new DiscreteThreshold({
			value: iValue
		});
		return oThreshold;
	}

	function createPropertyThreshold(iValue, sColor) {
		var oThreshold = new PropertyThreshold({
			toValue: iValue,
			fillColor: sColor
		});
		return oThreshold;
	}

	function createRectangle() {
		var oShape = new Rectangle({
			fullAnimationDuration: 500
		});
		return oShape;
	}

	function setInitialValue(oStatusIndicator, iValue) {
		oStatusIndicator.setValue(iValue);
		var aGroupsWithValues = oStatusIndicator._computeGroupValueDistribution();
		aGroupsWithValues.forEach(function (oGroupWithValue) {
			oGroupWithValue.group._setInitialValue(oGroupWithValue.newValue);
		});
	}

	function isRising(aValues) {
		for (var i = 0; i < aValues.length - 1; i++) {
			if (aValues[i] > aValues[i + 1]) {
				return false;
			}
		}
		return true;
	}

	function isFalling(aValues) {
		return !isRising(aValues);
	}

	function getValueFromUpdateDomGradientStub(oStub) {
		return oStub.args.map(function (aArguments) {
			return aArguments[1];
		});
	}

	function valueDistributionTest(oTestSuiteData) {
		QUnit.test("Test updates in advanced setup from " + oTestSuiteData.testing.fromValue +
			" to " + oTestSuiteData.testing.toValue, function (assert) {

			var oShape1 = createRectangle();
			var oShape2 = createRectangle();
			var oShape3 = createRectangle();
			var oShape4 = createRectangle();
			var oStatusIndicator = createStatusIndicator(
				[createGroup([oShape1, oShape2]), createGroup([oShape3, oShape4])],
				[createDiscreteThreshold(15), createDiscreteThreshold(30), createDiscreteThreshold(50), createDiscreteThreshold(80)],
				[]
			);

			var oShape1StubRenderer = createStubRenderer();
			oSandbox.stub(oShape1, "getRenderer", function () {
				return oShape1StubRenderer;
			});

			var oShape2StubRenderer = createStubRenderer();
			oSandbox.stub(oShape2, "getRenderer", function () {
				return oShape2StubRenderer;
			});

			var oShape3StubRenderer = createStubRenderer();
			oSandbox.stub(oShape3, "getRenderer", function () {
				return oShape3StubRenderer;
			});

			var oShape4StubRenderer = createStubRenderer();
			oSandbox.stub(oShape4, "getRenderer", function () {
				return oShape4StubRenderer;
			});

			var oUpdateDomGradient1Stub = oShape1StubRenderer._updateDomGradient;
			var oUpdateDomGradient2Stub = oShape2StubRenderer._updateDomGradient;
			var oUpdateDomGradient3Stub = oShape3StubRenderer._updateDomGradient;
			var oUpdateDomGradient4Stub = oShape4StubRenderer._updateDomGradient;

			setInitialValue(oStatusIndicator, oTestSuiteData.testing.fromValue);
			oStatusIndicator.setValue(oTestSuiteData.testing.toValue);
			return oStatusIndicator._propagateValueToGroups().then(function () {

				function checkParameters(oUpdateDomGradientStub, oExpectedValues) {
					var aUpdateDomGradientCallsValues = getValueFromUpdateDomGradientStub(oUpdateDomGradientStub);
					if (oExpectedValues.rising) {
						assert.equal(isRising(aUpdateDomGradientCallsValues), oExpectedValues.rising, "UpdateDomGradient arguments are rising");
					} else {
						assert.equal(isFalling(aUpdateDomGradientCallsValues), !oExpectedValues.rising, "UpdateDomGradient arguments are falling");
					}

					assert.equal(oUpdateDomGradientStub.called, oExpectedValues.called);
				}

				var aExpectedBehaviour = oTestSuiteData.expected.groups;
				checkParameters(oUpdateDomGradient1Stub, aExpectedBehaviour[0]);
				checkParameters(oUpdateDomGradient2Stub, aExpectedBehaviour[1]);
				checkParameters(oUpdateDomGradient3Stub, aExpectedBehaviour[2]);
				checkParameters(oUpdateDomGradient4Stub, aExpectedBehaviour[3]);
			});
		});
	}

	var oUpdateTestSuiteData1 = {
		testing: {
			fromValue: 20,
			toValue: 50
		},
		expected: {
			groups: [
				{
					called: true,
					rising: true,
					falling: false
				},
				{
					called: true,
					rising: true,
					falling: false
				},
				{
					called: false,
					rising: true,
					falling: true
				},
				{
					called: false,
					rising: true,
					falling: true
				}
			]
		}
	};
	var oUpdateTestSuiteData2 = {
		testing: {
			fromValue: 50,
			toValue: 100
		},
		expected: {
			groups: [
				{
					called: false,
					rising: true,
					falling: true
				},
				{
					called: false,
					rising: true,
					falling: true
				},
				{
					called: true,
					rising: true,
					falling: false
				},
				{
					called: true,
					rising: true,
					falling: false
				}
			]
		}
	};
	var oUpdateTestSuiteData3 = {
		testing: {
			fromValue: 100,
			toValue: 0
		},
		expected: {
			groups: [
				{
					called: true,
					rising: false,
					falling: true
				},
				{
					called: true,
					rising: false,
					falling: true
				},
				{
					called: true,
					rising: false,
					falling: true
				},
				{
					called: true,
					rising: false,
					falling: true
				}
			]
		}
	};

	valueDistributionTest(oUpdateTestSuiteData1);
	valueDistributionTest(oUpdateTestSuiteData2);
	valueDistributionTest(oUpdateTestSuiteData3);

	/**
		* @deprecated Since version 1.120
	*/
	function colorDistributionTest(oTestSuiteData) {
		QUnit.test("Test color distribution in advanced setup from " + oTestSuiteData.testing.fromValue +
			" to " + oTestSuiteData.testing.toValue, function (assert) {
				oSandbox.stub(window, "requestAnimationFrame", function (callback) {
					setTimeout(function () {
						var iLastUpdate = performance.now();
						callback(iLastUpdate);
					}, 1);
				});

				var oShape1 = createRectangle();
				var oShape2 = createRectangle();
				var oShape3 = createRectangle();
				var oShape4 = createRectangle();
				var oStatusIndicator = createStatusIndicator(
					[createGroup([oShape1, oShape2]), createGroup([oShape3, oShape4])],
					[],
					[
						createPropertyThreshold(15, "red"), createPropertyThreshold(30, "orange"),
						createPropertyThreshold(50, "blue"), createPropertyThreshold(80, "green"), createPropertyThreshold(100, "gold")
					]
				);

				var oShape1StubRenderer = createStubRenderer();
				oSandbox.stub(oShape1, "getRenderer", function () {
					return oShape1StubRenderer;
				});

				var oShape2StubRenderer = createStubRenderer();
				oSandbox.stub(oShape2, "getRenderer", function () {
					return oShape2StubRenderer;
				});

				var oShape3StubRenderer = createStubRenderer();
				oSandbox.stub(oShape3, "getRenderer", function () {
					return oShape3StubRenderer;
				});

				var oShape4StubRenderer = createStubRenderer();
				oSandbox.stub(oShape4, "getRenderer", function () {
					return oShape4StubRenderer;
				});

				var oUpdateDomColor1Stub = oShape1StubRenderer._updateDomColor;
				var oUpdateDomColor2Stub = oShape2StubRenderer._updateDomColor;
				var oUpdateDomColor3Stub = oShape3StubRenderer._updateDomColor;
				var oUpdateDomColor4Stub = oShape4StubRenderer._updateDomColor;

				setInitialValue(oStatusIndicator, oTestSuiteData.testing.fromValue);
				oStatusIndicator.setValue(oTestSuiteData.testing.toValue);
				return oStatusIndicator._propagateValueToGroups().then(function () {
					var aExpectedBehaviour = oTestSuiteData.expected.groups;

					function checkParameters(oShape, oUpdateDomColorStubs, oExpected) {
						assert.equal(oUpdateDomColorStubs.called, oExpected.called,
							"Shape's updateDomColor should be called");
						assert.ok(oExpected.colors.includes(oShape.getDisplayedFillColor()),
							"Shape's updateDomColor was called with correct color");
					}

					checkParameters(oShape1, oUpdateDomColor1Stub, aExpectedBehaviour[0]);
					checkParameters(oShape2, oUpdateDomColor2Stub, aExpectedBehaviour[1]);
					checkParameters(oShape3, oUpdateDomColor3Stub, aExpectedBehaviour[2]);
					checkParameters(oShape4, oUpdateDomColor4Stub, aExpectedBehaviour[3]);
				});
			});
	}
	/**
		* @deprecated Since version 1.120
	*/
	var oColorTestSuiteData1 = {
		testing: {
			fromValue: 16,
			toValue: 50
		},
		expected: {
			groups: [
				{
					colors: ["orange", "blue"],
					called: true
				},
				{
					colors: ["orange", "blue"],
					called: true
				},
				{
					colors: ["orange", "blue"],
					called: false
				},
				{
					colors: ["orange", "blue"],
					called: false
				}
			]
		}
	};
	/**
		* @deprecated Since version 1.120
	*/
	var oColorTestSuiteData2 = {
		testing: {
			fromValue: 31,
			toValue: 100
		},
		expected: {
			groups: [
				{
					colors: ["blue", "green", "gold"],
					called: true
				},
				{
					colors: ["blue", "green", "gold"],
					called: true
				},
				{
					colors: ["blue", "green", "gold"],
					called: true
				},
				{
					colors: ["blue", "green", "gold"],
					called: true
				}
			]
		}
	};
	/**
		* @deprecated Since version 1.120
	*/
	var oColorTestSuiteData3 = {
		testing: {
			fromValue: 100,
			toValue: 0
		},
		expected: {
			groups: [
				{
					colors: ["red"],
					called: true
				},
				{
					colors: ["red"],
					called: true
				},
				{
					colors: ["red"],
					called: true
				},
				{
					colors: ["red"],
					called: true
				}
			]
		}
	};

	/**
		* @deprecated Since version 1.120
	*/
	colorDistributionTest(oColorTestSuiteData1);
	/**
		* @deprecated Since version 1.120
	*/
	colorDistributionTest(oColorTestSuiteData2);
	/**
		* @deprecated Since version 1.120
	*/
	colorDistributionTest(oColorTestSuiteData3);

	function colorDistributionTestSemantic(oTestSuiteData) {
		QUnit.test("Test SemanticColor distribution in advanced setup from " + oTestSuiteData.testing.fromValue +
			" to " + oTestSuiteData.testing.toValue, function (assert) {
				oSandbox.stub(window, "requestAnimationFrame", function (callback) {
					setTimeout(function () {
						var iLastUpdate = performance.now();
						callback(iLastUpdate);
					}, 1);
				});

				var oShape1 = createRectangle();
				var oShape2 = createRectangle();
				var oShape3 = createRectangle();
				var oShape4 = createRectangle();
				var oStatusIndicator = createStatusIndicator(
					[createGroup([oShape1, oShape2]), createGroup([oShape3, oShape4])],
					[],
					[
						createPropertyThreshold(15, "Critical"), createPropertyThreshold(30, "Error"),
						createPropertyThreshold(50, "Good"), createPropertyThreshold(80, "Error"), createPropertyThreshold(100, "Information")
					]
				);

				var oShape1StubRenderer = createStubRenderer();
				oSandbox.stub(oShape1, "getRenderer", function () {
					return oShape1StubRenderer;
				});

				var oShape2StubRenderer = createStubRenderer();
				oSandbox.stub(oShape2, "getRenderer", function () {
					return oShape2StubRenderer;
				});

				var oShape3StubRenderer = createStubRenderer();
				oSandbox.stub(oShape3, "getRenderer", function () {
					return oShape3StubRenderer;
				});

				var oShape4StubRenderer = createStubRenderer();
				oSandbox.stub(oShape4, "getRenderer", function () {
					return oShape4StubRenderer;
				});

				var oUpdateDomColor1Stub = oShape1StubRenderer._updateDomColor;
				var oUpdateDomColor2Stub = oShape2StubRenderer._updateDomColor;
				var oUpdateDomColor3Stub = oShape3StubRenderer._updateDomColor;
				var oUpdateDomColor4Stub = oShape4StubRenderer._updateDomColor;

				setInitialValue(oStatusIndicator, oTestSuiteData.testing.fromValue);
				oStatusIndicator.setValue(oTestSuiteData.testing.toValue);
				return oStatusIndicator._propagateValueToGroups().then(function () {
					var aExpectedBehaviour = oTestSuiteData.expected.groups;

					function checkParameters(oShape, oUpdateDomColorStubs, oExpected) {
						assert.equal(oUpdateDomColorStubs.called, oExpected.called,
							"Shape's updateDomColor should be called");
						assert.ok(oExpected.colors.includes(oShape.getDisplayedFillColor()),
							"Shape's updateDomColor was called with correct color");
					}

					checkParameters(oShape1, oUpdateDomColor1Stub, aExpectedBehaviour[0]);
					checkParameters(oShape2, oUpdateDomColor2Stub, aExpectedBehaviour[1]);
					checkParameters(oShape3, oUpdateDomColor3Stub, aExpectedBehaviour[2]);
					checkParameters(oShape4, oUpdateDomColor4Stub, aExpectedBehaviour[3]);
				});
			});
	}

	var oSemanticColorTestSuiteData1 = {
		testing: {
			fromValue: 16,
			toValue: 50
		},
		expected: {
			groups: [
				{
					colors: [sSemanticGood, sSemanticError],
					called: true
				},
				{
					colors: [sSemanticGood, sSemanticError],
					called: true
				},
				{
					colors: [sSemanticGood, sSemanticError],
					called: false
				},
				{
					colors: [sSemanticGood, sSemanticError],
					called: false
				}
			]
		}
	};
	var oSemanticColorTestSuiteData2 = {
		testing: {
			fromValue: 31,
			toValue: 100
		},
		expected: {
			groups: [
				{
					colors:[sSemanticGood, sSemanticError, sSemanticInformation],
					called: true
				},
				{
					colors:[sSemanticGood, sSemanticError, sSemanticInformation],
					called: true
				},
				{
					colors:[sSemanticGood, sSemanticError, sSemanticInformation],
					called: true
				},
				{
					colors:[sSemanticGood, sSemanticError, sSemanticInformation],
					called: true
				}
			]
		}
	};
	var oSemanticColorTestSuiteData3 = {
		testing: {
			fromValue: 100,
			toValue: 0
		},
		expected: {
			groups: [
				{
					colors: [sSemanticCritical],
					called: true
				},
				{
					colors:  [sSemanticCritical],
					called: true
				},
				{
					colors:  [sSemanticCritical],
					called: true
				},
				{
					colors:  [sSemanticCritical],
					called: true
				}
			]
		}
	};

	colorDistributionTestSemantic(oSemanticColorTestSuiteData1);
	colorDistributionTestSemantic(oSemanticColorTestSuiteData2);
	colorDistributionTestSemantic(oSemanticColorTestSuiteData3);


	QUnit.test("Test of propagateColorChange", function (assert) {
		var oShape1 = createRectangle();
		var oShape2 = createRectangle();
		var oGroup1 = createGroup([oShape1]);
		var oGroup2 = createGroup([oShape2]);
		var oStatusIndicator = createStatusIndicator(
			[oGroup1,oGroup2],
			[],
			[
				createPropertyThreshold(15, "Critical"), createPropertyThreshold(30, "Error"),
				createPropertyThreshold(50, "Good"), createPropertyThreshold(80, "Error"), createPropertyThreshold(100, "Information")
			]
		);

		var oAnimationPropertiesResolver = oStatusIndicator._oAnimationPropertiesResolver;
		var oStub1 = oSandbox.stub();
		var oStub2 = oSandbox.stub();
		oAnimationPropertiesResolver.addPropertyThresholdChange(oStub1);
		oAnimationPropertiesResolver.addPropertyThresholdChange(oStub2);

		oAnimationPropertiesResolver.propagateColorChange(oShape1, 100);

		assert.equal(oStub1.args.toString(), oStub2.args.toString(), "Both event was called with same arguments");
		assert.ok(oStub1.withArgs(sSemanticGood).calledOnce, "Stub1 was called with correct color");
		assert.ok(oStub2.withArgs(sSemanticGood).calledOnce, "Stub2 was called with correct color");

		oAnimationPropertiesResolver.propagateColorChange(oShape2, 100);

		assert.equal(oStub1.args.toString(), oStub2.args.toString(), "Both event was called with same arguments");
		assert.ok(oStub1.withArgs(sSemanticInformation).calledOnce, "Stub1 was called with correct color");
		assert.ok(oStub1.withArgs(sSemanticInformation).calledOnce, "Stub2 was called with correct color");
	});

	QUnit.test("Test of propertyThresholdEvent calling", function (assert) {
		var oShape1 = createRectangle();
		var oShape2 = createRectangle();
		var oGroup1 = createGroup([oShape1]);
		var oGroup2 = createGroup([oShape2]);
		var oStatusIndicator = createStatusIndicator(
			[oGroup1,oGroup2],
			[],
			[
				createPropertyThreshold(15, "Critical"), createPropertyThreshold(30, "Error"),
				createPropertyThreshold(50, "Good"), createPropertyThreshold(80, "Error"), createPropertyThreshold(100, "Information")
			]
		);

		var oAnimationPropertiesResolver = oStatusIndicator._oAnimationPropertiesResolver;
		var oStub1 = oSandbox.stub();
		var oStub2 = oSandbox.stub();
		oAnimationPropertiesResolver.addPropertyThresholdChange(oStub1);
		oAnimationPropertiesResolver.addPropertyThresholdChange(oStub2);

		setInitialValue(oStatusIndicator, 51);

		oAnimationPropertiesResolver.propagateColorChange(oShape2, 60);

		assert.ok(oStub1.notCalled, "Stub1 was not called");
		assert.ok(oStub2.notCalled, "Stub2 was not called");

		oAnimationPropertiesResolver.propagateColorChange(oShape2, 62);

		assert.ok(oStub1.called, "Stub1 was called");
		assert.ok(oStub2.called, "Stub2 was called");
	});

	QUnit.test("Test of propagateValueChange", function (assert) {
		var oShape1 = createRectangle();
		var oShape2 = createRectangle();
		var oGroup1 = createGroup([oShape1]);
		var oGroup2 = createGroup([oShape2]);
		var oStatusIndicator = createStatusIndicator(
			[oGroup1,oGroup2],
			[createDiscreteThreshold(15), createDiscreteThreshold(30), createDiscreteThreshold(50), createDiscreteThreshold(80)],
			[]
		);

		var oAnimationPropertiesResolver = oStatusIndicator._oAnimationPropertiesResolver;
		var oStub1 = oSandbox.stub();
		var oStub2 = oSandbox.stub();
		oAnimationPropertiesResolver.addDiscreteThresholdChange(oStub1);
		oAnimationPropertiesResolver.addDiscreteThresholdChange(oStub2);

		oAnimationPropertiesResolver.propagateValueChange(oShape2, 80);

		assert.equal(oStub1.args.toString(), oStub2.args.toString(), "Both event was called with same arguments");
		assert.ok(oStub1.withArgs(80).calledOnce, "Stub1 was called with correct value");
		assert.ok(oStub2.withArgs(80).calledOnce, "Stub2 was called with correct value");
	});

	QUnit.test("Test of discreteThresholdEvent calling", function (assert) {
		var oShape1 = createRectangle();
		var oShape2 = createRectangle();
		var oGroup1 = createGroup([oShape1]);
		var oGroup2 = createGroup([oShape2]);
		var oStatusIndicator = createStatusIndicator(
			[oGroup1,oGroup2],
			[createDiscreteThreshold(15), createDiscreteThreshold(30), createDiscreteThreshold(50), createDiscreteThreshold(80)],
			[]
		);

		var oAnimationPropertiesResolver = oStatusIndicator._oAnimationPropertiesResolver;
		var oStub1 = oSandbox.stub();
		var oStub2 = oSandbox.stub();
		oAnimationPropertiesResolver.addDiscreteThresholdChange(oStub1);
		oAnimationPropertiesResolver.addDiscreteThresholdChange(oStub2);

		setInitialValue(oStatusIndicator, 51);

		oAnimationPropertiesResolver.propagateValueChange(oShape2, 59);

		assert.ok(oStub1.notCalled, "Stub1 was not called");
		assert.ok(oStub2.notCalled, "Stub2 was not called");

		oAnimationPropertiesResolver.propagateValueChange(oShape2, 60);

		assert.ok(oStub1.called, "Stub1 was called");
		assert.ok(oStub2.called, "Stub2 was called");
	});
});
