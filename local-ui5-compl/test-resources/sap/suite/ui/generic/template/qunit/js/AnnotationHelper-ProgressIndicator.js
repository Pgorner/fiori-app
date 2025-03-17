sap.ui.define([
	"sap/suite/ui/generic/template/js/AnnotationHelper",
	"sap/ui/model/odata/AnnotationHelper"],
	function (AnnotationHelper, ODataAnnotationHelper) {
		this.oAnnotationHelper = AnnotationHelper;
		var oAnnotationHelper = this.oAnnotationHelper;
		QUnit.module("Test Methods for ProgressIndicator Display Value", {
			beforeEach: function () {


				sinon.stub(ODataAnnotationHelper, "simplePath", function (oInterface, oProperty) {
					return "{State}";
				});
			},

			afterEach: function () {
				this.oAnnotationHelper = null;
				ODataAnnotationHelper.simplePath.restore();
			},

			oInterface: {
				getModel: function () {
					return undefined;
				},
				getPath: function () {
					return "";
				},
				getSetting: function () {
					return "";
				}
			},

			oDataPoint: {
				Value: {
					EdmType: "Edm.Decimal",
					Path: "Progress"
				}
			}
		});


		QUnit.module("Test Methods for Progress Indicator Criticality", {
			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
				sinon.stub(ODataAnnotationHelper, "simplePath", function (oInterface, oProperty) {
					return "{State}";
				});
			},

			afterEach: function () {
				this.oAnnotationHelper = null;
				ODataAnnotationHelper.simplePath.restore();
			},

			oInterface: {
				getModel: function () {
					return undefined;
				},
				getPath: function () {
					return "";
				},
				getSetting: function () {
					return "";
				}
			},

			oDataPoint: {
				Criticality: {
					EdmType: "Edm.String",
					Path: "State"
				}
			}
		});

		QUnit.test("Method buildExpressionForProgressIndicatorCriticality: Criticality is EnumMember", function (assert) {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					EnumMember: "UI.CriticalityType/Negative"
				}
			};

			var sExpectedExpression = "{= ('UI.CriticalityType/Negative' === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || ('UI.CriticalityType/Negative' === '1') || ('UI.CriticalityType/Negative' === 1) ? 'Error' : ('UI.CriticalityType/Negative' === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || ('UI.CriticalityType/Negative' === '2') || ('UI.CriticalityType/Negative' === 2) ? 'Warning' : ('UI.CriticalityType/Negative' === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || ('UI.CriticalityType/Negative' === '3') || ('UI.CriticalityType/Negative' === 3) ? 'Success' : 'None' }";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			assert.equal(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		QUnit.test("Method buildExpressionForProgressIndicatorCriticality: Criticality is path (EnumMember or Value)", function (assert) {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					Path: "State"
				}
			};

			var sExpectedExpression = "{= (${State} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${State} === '1') || (${State} === 1) ? 'Error' : (${State} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${State} === '2') || (${State} === 2) ? 'Warning' : (${State} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${State} === '3') || (${State} === 3) ? 'Success' : 'None' }";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			assert.equal(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		QUnit.test("Method buildExpressionForProgressIndicatorCriticality: Negative Test Criticality is String", function (assert) {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					String: "UI.CriticalityType/Negative"
				}
			};

			var sExpectedExpression = "None";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			assert.equal(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		QUnit.test("Method buildExpressionForProgressIndicatorCriticality: Negative Test Criticality is Value", function (assert) {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					Value: "2"
				}
			};

			var sExpectedExpression = "None";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			assert.equal(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		QUnit.test("Method buildExpressionForProgressIndicatorCriticality: Negative Test Criticality is not EnumMember or Path", function (assert) {
			var oInterface = this.oInterface;
			var oDataPoint = {
				Criticality: {
					Negative: "Test"
				}
			};

			var sExpectedExpression = "None";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			assert.equal(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});

		QUnit.test("Method buildExpressionForProgressIndicatorCriticality: Negative Test Criticality is undefined", function (assert) {
			var oInterface = this.oInterface;
			var oDataPoint = {};

			var sExpectedExpression = "None";
			var sExpression = oAnnotationHelper.buildExpressionForProgressIndicatorCriticality(oInterface, oDataPoint);
			assert.equal(sExpression, sExpectedExpression, "Returned the expected expression: " + sExpectedExpression);
		});
	});
