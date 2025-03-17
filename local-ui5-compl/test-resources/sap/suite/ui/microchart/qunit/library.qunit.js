/*global QUnit, sinon */
/*eslint no-undef:1, no-unused-vars:1, strict: 1 */

sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/core/Theming",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/util/Mobile",
	"sap/ui/performance/Measurement",
	"sap/suite/ui/microchart/AreaMicroChart",
	"sap/suite/ui/microchart/ComparisonMicroChart",
	"sap/suite/ui/microchart/ComparisonMicroChartData",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/suite/ui/microchart/BulletMicroChart",
	"sap/ui/comp/smartmicrochart/SmartMicroChart",
	"sap/suite/ui/microchart/library",
	"sap/m/FlexBox",
	"sap/m/Label",
	"sap/m/library",
	"sap/ui/layout/FixFlex",
	"sap/suite/ui/microchart/MicroChartUtils",
	"sap/ui/core/IntervalTrigger",
	// used by SmartMicroChart, chartType bullet,
	"sap/ui/comp/smartmicrochart/SmartBulletMicroChart"
], function(Lib, Theming, nextUIUpdate, Mobile, Measurement, AreaMicroChart, ComparisonMicroChart, ComparisonMicroChartData, GenericTile, TileContent, BulletMicroChart, SmartMicroChart, microchartLibrary, FlexBox, Label, mobileLibrary, FixFlex, MicroChartUtils, IntervalTrigger) {
	"use strict";

	// shortcut for sap.m.FrameType
	var FrameType = mobileLibrary.FrameType;

	var oRb = Lib.getResourceBundleFor("sap.suite.ui.microchart");

	Mobile.init();

	QUnit.module("Chart Accessibility", {
		beforeEach: async function() {
			this.oCC = new ComparisonMicroChart("comparison-chart", {
				scale: "M",
				data: [new ComparisonMicroChartData({
					title: "Americas",
					value: 10,
					color: "Good",
					displayValue: "10M"
				}), new ComparisonMicroChartData({
					title: "EMEA",
					value: 20,
					color: "Critical",
					displayValue: "18M"
				})],
				shrinkable: false,
				height: "400px"
			}).placeAt("qunit-fixture");
			this.oCC.setSize('Responsive');
			MicroChartUtils.extendMicroChart(ComparisonMicroChart);
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oCC.destroy();
		}
	});

	QUnit.test("Redudant information of chart not announced", function(assert) {
		assert.equal(this.oCC.getAccessibilityInfo().type, oRb.getText("ACC_CTR_TYPE_MICROCHART"));
	});

	QUnit.module("Passing parent context to the child in case of using responsiveness for annotated charts", {
		beforeEach : function() {
			this.bDependencyLoaded = true;
			if (!Lib.all()["sap.ui.comp"]) {
				this.bDependencyLoaded = false;
				return;
			}
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet : "Products"
			});
			this.oSmartMicroChart._oChartViewMetadata = {
				chartType : "bullet",
				annotation : {
					ChartType : {
						EnumMember : "UiVoca/Bullet"
					}
				}
			};
			this.oSmartMicroChart._createInnerChart();
			this.oBulletSMC = this.oSmartMicroChart.getAggregation("_chart");
			this.oBulletMC = this.oBulletSMC.getAggregation("_chart");
			this.oFlexBox = new FlexBox({
				items: [this.oSmartMicroChart]
			});
		},
		afterEach : function() {
			if (this.oSmartMicroChart) {
				this.oSmartMicroChart.destroy();
			}
			this.oFlexBox.destroy();
		}
	});

	QUnit.test("Passing parent context from SmartMicroChart to SmartBulletMicrochart", function(assert) {
		if (!this.bDependencyLoaded) {
			assert.expect(0);
			return;
		}
		//Arrange
		//Act
		microchartLibrary._passParentContextToChild(this.oSmartMicroChart, this.oBulletSMC);
		//Assert
		assert.equal(this.oBulletSMC.data("_parentRenderingContext").getId(), this.oFlexBox.getId(), "The parent context has the same id as the relevant flexbox : " + this.oFlexBox.getId() + " = " + this.oBulletSMC.data("_parentRenderingContext").getId());
	});

	QUnit.test("Passing parent context from SmartBulletMicrochart to BulletMicrochart", function(assert) {
		if (!this.bDependencyLoaded) {
			assert.expect(0);
			return;
		}
		//Arrange
		microchartLibrary._passParentContextToChild(this.oSmartMicroChart, this.oBulletSMC);
		//Act
		microchartLibrary._passParentContextToChild(this.oBulletSMC, this.oBulletMC);
		//Assert
		assert.equal(this.oBulletMC.data("_parentRenderingContext").getId(), this.oFlexBox.getId(), "The parent context has the same id as the relevant flexbox : " + this.oFlexBox.getId() + " = " + this.oBulletSMC.data("_parentRenderingContext").getId());
	});

	QUnit.module("Function _isTooltipSuppressed");

	QUnit.test("Tooltip should be suppressed if it consists of whitespace characters only", function(assert) {
		//Assert
		assert.ok(microchartLibrary._isTooltipSuppressed("       "), "Tooltip containing spaces should be suppressed");
		assert.ok(microchartLibrary._isTooltipSuppressed("		"), "Tooltip containing tabs should be suppressed");
		assert.ok(microchartLibrary._isTooltipSuppressed(""), "Tooltip containing empty string should be suppressed");
		assert.ok(microchartLibrary._isTooltipSuppressed("   		\n\n\n"), "Tooltip containing mixture of whitespace characters should be suppressed");
		assert.ok(!microchartLibrary._isTooltipSuppressed("Meaningful text		"), "Tooltip containing non-whitespace characters should not be suppressed");
	});

	QUnit.test("Tooltip should not be suppressed if it consists of null or undefined values", function(assert) {
		//Assert
		assert.equal(microchartLibrary._isTooltipSuppressed(null), false, "Tooltip containing null should not be suppressed");
		assert.equal(microchartLibrary._isTooltipSuppressed(), false, "Tooltip containing undefined should not be suppressed");
	});

	QUnit.module("Function _checkControlIsVisible", {
		beforeEach: async function() {
			this.oControl = new Label({text:"Lorem ipsum"});
			this.oControl.placeAt("qunit-fixture");
			this.sMeasureId = this.oControl.getId() + "-qunit-check-visible";
			await nextUIUpdate();

			Measurement.setActive(true);
		},
		afterEach: function() {
			this.oControl.destroy();
			Measurement.setActive(false);
		}
	});

	QUnit.test("If control is visible callback is directly called", function(assert) {
		microchartLibrary._checkControlIsVisible(this.oControl, function() {
			assert.ok(true, "Callback directly called.");
		});
	});

	QUnit.test("The visibility check is performed", function(assert) {
		//Arrange
		this.oControl.setVisible(false);
		var oControlSpy = sinon.spy(this.oControl, "getVisible");
		var done = assert.async();

		//Act
		microchartLibrary._checkControlIsVisible(this.oControl);

		setTimeout(function() {
			//Assert
			assert.ok(oControlSpy.called, "At least one check has been performed.");

			done();
		}, 500);
	});

	QUnit.test("Early control destruction", function(assert) {
		//Arrange
		this.oControl.setVisible(false);
		var oRemoveListenerSpy = sinon.spy(IntervalTrigger.prototype, "removeListener");
		var fnControlSpy = sinon.spy(this.oControl, "exit");
		var done = assert.async();

		//Act
		microchartLibrary._checkControlIsVisible(this.oControl);

		setTimeout(function() {
			this.oControl.destroy();
			//Assert
			assert.ok(oRemoveListenerSpy.calledOnce, "The detach interval handler is called when the control is destroyed");
			assert.ok(fnControlSpy.calledOnce, "The exit function is finally called in the chart itself");
			// Restore
			oRemoveListenerSpy.restore();

			done();
		}.bind(this), 200);
	});

	QUnit.test("Control found when css display is changed", function(assert) {
		//Arrange
		var done = assert.async();
		var that = this;
		this.oControl.$().css("display", "none");
		Measurement.start(this.sMeasureId);

		setTimeout(function() {
			this.oControl.$().css("display", "block");
		}.bind(this), 200);

		//Act
		microchartLibrary._checkControlIsVisible(this.oControl, function() {
			//Assert
			var oMeasure = Measurement.end(that.sMeasureId);
			assert.ok(oMeasure.duration > 200, "Duration is above delay.");
			assert.ok(this.$().is(":visible"), "Control is visible.");

			done();
		});
	});

	QUnit.test("Css visibility does not influence check", function(assert) {
		//Arrange
		var done = assert.async();
		var that = this;
		this.oControl.$().css("visibility", "hidden");
		Measurement.start(this.sMeasureId);

		setTimeout(function() {
			this.oControl.$().css("visibility", "visible");
		}.bind(this), 200);

		//Act
		microchartLibrary._checkControlIsVisible(this.oControl, function() {
			//Assert
			var oMeasure = Measurement.end(that.sMeasureId);
			assert.ok(oMeasure.duration < 200, "Duration is below delay.");

			done();
		});
	});

	QUnit.module("Function _isThemeHighContrast", {
		beforeEach: function() {
			this.oStubGetTheme = sinon.stub(Theming, "getTheme");
			MicroChartUtils.extendMicroChart(BulletMicroChart);
			this.oUtils = new BulletMicroChart();
		},
		afterEach: function() {
			this.oStubGetTheme.restore();
		}
	});

	QUnit.test("Non-contrast theme", function(assert) {
		//Arrange
		this.oStubGetTheme.returns("sap_belize");

		//Assert
		assert.equal(this.oUtils._isThemeHighContrast(), false, "Theme has been correctly identified as not being high contrast.");
	});

	QUnit.test("High Contrast Black is correct", function(assert) {
		//Arrange
		this.oStubGetTheme.returns("sap_belize_hcb");

		//Assert
		assert.equal(this.oUtils._isThemeHighContrast(), true, "Theme has been correctly identified as high contrast.");
	});

	QUnit.test("High Contrast White is correct", function(assert) {
		//Arrange
		this.oStubGetTheme.returns("sap_belize_hcw");

		//Assert
		assert.equal(this.oUtils._isThemeHighContrast(), true, "Theme has been correctly identified as high contrast.");
	});

	QUnit.module("Function _overrideGetAccessibilityInfo", {
		beforeEach: function() {
			this.fnMicroChart = function() {};
			MicroChartUtils.extendMicroChart(this.fnMicroChart);
			this.fnMicroChart.prototype._getAccessibilityControlType = function() {
				return "Type";
			};
			this.oChart = new this.fnMicroChart();
			sinon.stub(this.oChart, "getTooltip_AsString").returns("Tooltip");
		},
		afterEach: function() {
			this.fnMicroChart = null;
			this.oChart.getTooltip_AsString.restore();
		}
	});

	QUnit.test("Adds method getAccessibilityInfo to MicroChart's prototype", function(assert) {
		// Act


		//Assert
		assert.ok(this.fnMicroChart.prototype.hasOwnProperty("getAccessibilityInfo"), "Method added to prototype.");
	});

	QUnit.test("Method getAccessibilityInfo returns expected object", function(assert) {
		// Arrange

		var oExpectedAccessibilityInfo = {
			type: oRb.getText("ACC_CTR_TYPE_MICROCHART"),
			description: "Tooltip"
		};

		// Act
		var oAccessibilityInfo = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInfo, oExpectedAccessibilityInfo, "Both accessibility objects have the same values.");
	});
});

