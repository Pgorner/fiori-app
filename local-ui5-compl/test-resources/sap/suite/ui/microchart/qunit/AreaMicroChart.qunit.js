/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/microchart/AreaMicroChart",
	"sap/suite/ui/microchart/AreaMicroChartItem",
	"sap/suite/ui/microchart/AreaMicroChartLabel",
	"sap/suite/ui/microchart/AreaMicroChartPoint",
	"sap/m/Button",
	"sap/m/FlexBox",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/ui/model/json/JSONModel",
	"sap/m/ColumnListItem",
	"sap/ui/core/TooltipBase",
	"sap/m/Table",
	"sap/m/Text",
	"sap/suite/ui/microchart/library",
	"./TestUtils",
	"sap/ui/util/Mobile",
	"sap/m/library",
	"sap/ui/core/Core",
	"sap/ui/core/Lib",
	"sap/ui/core/Theming"
], function(nextUIUpdate, jQuery, AreaMicroChart, AreaMicroChartItem, AreaMicroChartLabel, AreaMicroChartPoint, Button, FlexBox, GenericTile, TileContent, JSONModel, ColumnListItem, TooltipBase, Table, Text, microchartLibrary, TestUtils, Mobile, mobileLibrary, Core, CoreLib, Theming) {
	"use strict";

	var Size = mobileLibrary.Size;
	var oRb = CoreLib.getResourceBundleFor("sap.suite.ui.microchart");
	Mobile.init();

	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.fnSpyReady = sinon.spy(Core, "ready");
			this.fnSpyHandleCoreInitialized = sinon.spy(AreaMicroChart.prototype, "_handleCoreInitialized");
			this.fnStubAttachThemeApplied = sinon.stub(Theming, "attachApplied").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.fnSpyHandleThemeApplied = sinon.spy(AreaMicroChart.prototype, "_handleThemeApplied");
		},
		afterEach: function() {
			this.fnSpyReady.restore();
			this.fnSpyHandleCoreInitialized.restore();
			this.fnStubAttachThemeApplied.restore();
			this.fnSpyHandleThemeApplied.restore();
		}
	});

	/**
		* @deprecated Since version 1.119
	*/
	QUnit.test("Core initialization check - no core, no theme", function(assert) {
		//Act
		var oChart = new AreaMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyReady.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	/**
		* @deprecated Since version 1.119
	*/
	QUnit.test("Core initialization check - no core, but theme", function(assert) {
		//Act
		var oChart = new AreaMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyReady.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	/**
		* @deprecated Since version 1.119
	*/
	QUnit.test("Core initialization check - core, but no theme", function(assert) {
		//Act
		var oChart = new AreaMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyReady.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	/**
		* @deprecated Since version 1.119
	*/
	QUnit.test("Core initialization check - core and theme", function(assert) {
		//Act
		var oChart = new AreaMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyReady.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.module("Theme change handling", {
		beforeEach: async function() {
			this.sStartTheme = Theming.getTheme();
			this.oChart = new AreaMicroChart().placeAt("qunit-fixture");
			await nextUIUpdate();

			this.applyTheme = function (sTheme, fnCallBack) {
				var fnThemeApplied = (oEvent) => {
					Theming.detachApplied(fnThemeApplied.bind(this));
					if (typeof fnCallBack === "function") {
						fnCallBack.bind(this)();
						fnCallBack = undefined;
					}
				};
				Theming.setTheme(sTheme);
				Theming.attachApplied(fnThemeApplied.bind(this));
			};
		},
		afterEach: function(assert) {
			this.oChart.destroy();
			this.oChart = null;
			Theming.setTheme(this.sStartTheme);
			Theming.attachApplied(assert.async());
		}
	});

	QUnit.test("Chart will be rerendered when theme is changed", function(assert) {
		//Arrange
		this.oSpyInvalidate = sinon.spy(this.oChart, "invalidate");
		//Assert
		var sTheme = this.sStartTheme === "sap_belize" ? "sap_hcb" : "sap_belize";
		var done = assert.async();

		this.applyTheme(sTheme, function() {
			var oDelegateFirstRendering = {
				onAfterRendering: function() {
					assert.ok(this.oSpyInvalidate.calledOnce, "The chart is rerendered");
					this.oChart.removeEventDelegate(oDelegateFirstRendering);
					done();
				}.bind(this)
			};
			this.oChart.addEventDelegate(oDelegateFirstRendering);
		}.bind(this));
	});

	/**
	 * @deprecated Since version 1.60
	 */
	QUnit.module("Responsiveness tests - chart appearance", {
		beforeEach: async function() {
			this.oChart = new AreaMicroChart("mChart", {
				size: Size.Responsive,
				chart: new AreaMicroChartItem({ points: [ {x: 0, y: 0}, {x: 60, y: 20}, {x: 100, y: 80} ] }),
				lines: [ new AreaMicroChartItem({ points: [ {x: 0, y: 100}, {x: 100, y: 0} ] }) ]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "5rem",
				height: "5rem",
				renderType: "Bare",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("The chart is rendered when given width and height are higher than the thresholds", function(assert) {
		//Arrange
		//Act
		var iChartWidth = this.oChart.$().width();
		var iChartHeight = this.oChart.$().height();
		//Assert
		assert.equal(iChartWidth, 80, "Chart is rendered with expected width and height");
		assert.equal(iChartHeight, 80, "Chart is rendered with expected width and height");
	});


	/**
	 * @deprecated Since version 1.60
	 */
	QUnit.module("Responsiveness tests - labels and fonts", {
		beforeEach: async function() {
			this.oChart = new AreaMicroChart("mChart", {
				size: Size.Responsive,
				firstXLabel: {label: "firstXLabel"},
				lastXLabel: {label: "lastXLabel"},
				firstYLabel: {label: "firstYLabel"},
				lastYLabel: {label: "lastYLabel"},
				chart: new AreaMicroChartItem({ points: [ {x: 0, y: 0}, {x: 60, y: 20}, {x: 100, y: 80} ] }),
				lines: [ new AreaMicroChartItem({ points: [ {x: 0, y: 100}, {x: 100, y: 0} ] }) ]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				// AreaMicroChart.THRESHOLD_WIDTH_RESIZEFONT = 168; // Corresponds to M size 10.5rem
				// AreaMicroChart.THRESHOLD_HEIGHT_RESIZEFONT = 72; // Corresponds to M size 4.5rem
				width: "15rem",
				height: "15rem",
				renderType: "Bare",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Chart is rendered with the top and bottom labels visible and proper font size", function(assert) {
		//Arrange
		//Act
		var sTopLabelStyle = this.oChart.$().find(".sapSuiteAMCPositionTop.sapSuiteAMCLabels").attr("style"),
			sBottomLabelStyle = this.oChart.$().find(".sapSuiteAMCPositionBtm.sapSuiteAMCLabels").attr("style");
		//Assert
		assert.ok(!sTopLabelStyle || sTopLabelStyle.indexOf("display: none;") === -1, "Chart is properly rendered with the top labels visible");
		assert.ok(!sBottomLabelStyle || sBottomLabelStyle.indexOf("display: none;") === -1, "Chart is properly rendered with the bottom labels visible");
		assert.ok(!this.oChart.hasStyleClass("smallFont"), "Chart is properly rendered with the labels having the standard font size");
	});

	QUnit.test("Chart is rendered with the labels visible having font resized if height less than threshold", async function(assert) {
		//Arrange
		this.oFlexBox.setHeight("4.5rem");
		await nextUIUpdate();
		//Act
		var sTopLabelStyle = this.oChart.$().find(".sapSuiteAMCPositionTop.sapSuiteAMCLabels").attr("style"),
			sBottomLabelStyle = this.oChart.$().find(".sapSuiteAMCPositionBtm.sapSuiteAMCLabels").attr("style");
		//Assert
		assert.ok(!sTopLabelStyle || this.oChart.$().indexOf("display: none") === -1, "Chart is properly rendered with the top label visible");
		assert.ok(!sBottomLabelStyle || this.oChart.$().indexOf("display: none;") === -1, "Chart is properly rendered with the bottom labels visible");
	});

	QUnit.test("Chart containing top and bottom labels is rendered with top labels hidden if height less than threshold", async function(assert) {
		// Top labels are hidden when the threshold for height is reached (3.5rem)
		//Arrange
		this.oFlexBox.setHeight("3.4rem");
		await nextUIUpdate();
		//Act
		var $Labels = this.oChart.$().find(".sapSuiteAMCPositionTop.sapSuiteAMCLabels");
		//Assert
		assert.notOk($Labels.is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Chart containing top labels only is rendered with top labels hidden if height less than threshold", async function(assert) {
		// Top labels are hidden when the threshold for height is reached (3.5rem)
		//Arrange
		this.oFlexBox.setHeight("1rem");
		this.oChart.setFirstXLabel(null);
		this.oChart.setLastXLabel(null);
		await nextUIUpdate();
		//Act
		var $Labels = this.oChart.$().find(".sapSuiteAMCPositionTop.sapSuiteAMCLabels");
		//Assert
		assert.notOk($Labels.is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Chart containing bottom labels only is rendered with bottom labels hidden if height less than threshold", async function(assert) {
		// Bottom labels are hidden when the threshold for height is reached (3.5rem)
		//Arrange
		this.oFlexBox.setHeight("1rem");
		this.oChart.setFirstYLabel(null);
		this.oChart.setLastYLabel(null);
		await nextUIUpdate();
		//Act
		var $Labels = this.oChart.$().find(".sapSuiteAMCPositionBtm.sapSuiteAMCLabels");
		//Assert
		assert.notOk($Labels.is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Chart is rendered with the top labels hidden when label text truncated", async function(assert) {
		// Top labels are hidden when the label text is truncated
		//Arrange
		this.oFlexBox.setWidth("2.2rem");
		await nextUIUpdate();
		//Act
		var $Labels = this.oChart.$().find(".sapSuiteAMCPositionTop.sapSuiteAMCLabels");
		//Assert
		assert.notOk($Labels.is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Chart is rendered with the top labels visible having font resized when label text truncated", async function(assert) {
		// Top labels are hidden when the label text is truncated
		//Arrange
		this.oFlexBox.setWidth("10.5rem");
		await nextUIUpdate();
		//Act
		var sTopLabelStyle = this.oChart.$().find(".sapSuiteAMCPositionTop.sapSuiteAMCLabels").attr("style");
		//Assert
		assert.ok(!sTopLabelStyle || this.oChart.$().attr("style").indexOf("display: none") === -1, "Chart is properly rendered with the top labels visible");
	});

	QUnit.test("Chart is rendered with the min max labels visible when labels not truncated", async function(assert) {
		// Top labels are hidden when the label text is truncated
		//Arrange
		this.oChart.setMinLabel(new AreaMicroChartLabel({ label: "minlabel" }));
		this.oChart.setMaxLabel(new AreaMicroChartLabel({ label: "maxlabel" }));
		await nextUIUpdate();
		//Act
		var $minLabel = this.oChart.$().find(".sapSuiteAMCPositionBtm .sapSuiteAMCPositionCenter");
		var $maxLabel = this.oChart.$().find(".sapSuiteAMCPositionTop .sapSuiteAMCPositionCenter");
		//Assert
		assert.equal($minLabel.text(), "minlabel", "Min label should be rendered with correct text");
		assert.equal($maxLabel.text(), "maxlabel", "Max label should be rendered with correct text");

		assert.equal($minLabel.css("visibility"), "visible", "Min label should be visible");
		assert.equal($maxLabel.css("visibility"), "visible", "Max label should be visible");
	});

	QUnit.test("Chart is rendered with the min max labels hidden when labels truncated", async function(assert) {
		// Top labels are hidden when the label text is truncated
		//Arrange
		this.oFlexBox.setHeight("4rem");
		await nextUIUpdate();
		this.oChart.setMinLabel(new AreaMicroChartLabel({ label: "minlabel12345678901234567890" }));
		this.oChart.setMaxLabel(new AreaMicroChartLabel({ label: "maxlabel12345678901234567890" }));
		await nextUIUpdate();
		//Act
		var $minLabel = this.oChart.$().find(".sapSuiteAMCPositionBtm .sapSuiteAMCPositionCenter");
		var $maxLabel = this.oChart.$().find(".sapSuiteAMCPositionTop .sapSuiteAMCPositionCenter");
		//Assert
		assert.equal($minLabel.text(), "minlabel12345678901234567890", "Min label should be rendered with correct text");
		assert.equal($maxLabel.text(), "maxlabel12345678901234567890", "Max label should be rendered with correct text");

		assert.notOk($minLabel.is(":visible"), "Min label should be hidden");
		assert.notOk($maxLabel.is(":visible"), "Max label should be hidden");
	});

	QUnit.test("Chart adjusts size when top and bottom label hidden", async function(assert) {
		// Top and Bottom labels are hidden and chart adjusts its size
		//Arrange
		this.oFlexBox.setWidth("2.2rem");
		await nextUIUpdate();
		//Act
		var bHasBottomLabelsClass = this.oChart.$().hasClass("sapSuiteAMCBtmLbls");
		var bHasTopLabelsClass = this.oChart.$().hasClass("sapSuiteAMCTopLbls");
		//Assert
		assert.ok(!bHasBottomLabelsClass && !bHasTopLabelsClass, "Chart rendered without spacer at the top and bottom");
	});


	QUnit.module("Calculate coordinates", {
		beforeEach: function() {
			this.oChart = new AreaMicroChart({
				target: new AreaMicroChartItem({ points: [ {x: 0, y: 0}, {x: 60, y: 40}, {x: 100, y: 90} ] }),
				innerMinThreshold: new AreaMicroChartItem({ color: "Good" }),
				innerMaxThreshold: new AreaMicroChartItem({ color: "Good" }),
				minThreshold: new AreaMicroChartItem({ color: "Error", points: [ {x: 0, y: 0}, {x: 60, y: 30}, {x: 100, y: 70} ] }),
				maxThreshold: new AreaMicroChartItem({ color: "Good", points: [ {x: 0, y: 0}, {x: 60, y: 50}, {x: 100, y: 100} ] }),
				chart: new AreaMicroChartItem({ points: [ {x: 0, y: 0}, {x: 60, y: 20}, {x: 100, y: 80} ] }),
				lines: [ new AreaMicroChartItem({ points: [ {x: 0, y: 100}, {x: 100, y: 0} ] }) ]
			});
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("calculateDimensions - normal", function(assert) {
		var oDimensions = this.oChart._calculateDimensions(100, 100);

		assert.equal(oDimensions.minY, 0, "The min Y coordinate from all lines.");
		assert.equal(oDimensions.minX, 0, "The min X coordinate from all lines.");
		assert.equal(oDimensions.maxY, 100, "The max Y coordinate from all lines.");
		assert.equal(oDimensions.maxX, 100, "The max X coordinate from all lines.");

		assert.equal(oDimensions.chart.length, 3, "3 points for Chart.");
		assert.equal(oDimensions.innerMaxThreshold.length, 0, "No points for Inner Max Threshold");
		assert.equal(oDimensions.innerMinThreshold.length, 0, "No points for Inner Min Threshold");
		assert.equal(oDimensions.maxThreshold.length, 3, "3 points for maxThreshold.");
		assert.equal(oDimensions.minThreshold.length, 3, "3 points for minThreshold.");
		assert.equal(oDimensions.target.length, 3, "3 points for Target.");

		assert.equal(oDimensions.chart[0].x, 0, "The first X Chart coordinate");
		assert.equal(oDimensions.chart[0].y, 100, "The first Y Chart coordinate");
		assert.equal(oDimensions.chart[1].x, 60, "The second X Chart coordinate");
		assert.equal(oDimensions.chart[1].y, 80, "The second Y Chart coordinate");
		assert.equal(oDimensions.chart[2].x, 100, "The third X Chart coordinate");
		assert.equal(oDimensions.chart[2].y, 20, "The third Y Chart coordinate");

		assert.equal(oDimensions.maxThreshold[0].x, 0, "The first X maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[0].y, 100, "The first Y maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[1].x, 60, "The second X maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[1].y, 50, "The second Y maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[2].x, 100, "The third X maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[2].y, 0, "The third Y maxThreshold coordinate");

		assert.equal(oDimensions.minThreshold[0].x, 0, "The first X minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[0].y, 100, "The first Y minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[1].x, 60, "The second X minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[1].y, 70, "The second Y minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[2].x, 100, "The third X minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[2].y, 30, "The third Y minThreshold coordinate");

		assert.equal(oDimensions.target[0].x, 0, "The first X target coordinate");
		assert.equal(oDimensions.target[0].y, 100, "The first Y target coordinate");
		assert.equal(oDimensions.target[1].x, 60, "The second X target coordinate");
		assert.equal(oDimensions.target[1].y, 60, "The second Y target coordinate");
		assert.equal(oDimensions.target[2].x, 100, "The third X target coordinate");
		assert.equal(oDimensions.target[2].y, 10, "The third Y target coordinate");

		assert.equal(oDimensions.lines[0][0].x, 0, "The first X line coordinate");
		assert.equal(oDimensions.lines[0][0].y, 0, "The first Y line coordinate");
		assert.equal(oDimensions.lines[0][1].x, 100, "The second X line coordinate");
		assert.equal(oDimensions.lines[0][1].y, 100, "The second Y line coordinate");
	});

	QUnit.test("calculateDimensions - range", function(assert) {
		this.oChart.setMinXValue(50);
		this.oChart.setMaxXValue(150);
		this.oChart.setMinYValue(-50);
		this.oChart.setMaxYValue(150);

		var oDimensions = this.oChart._calculateDimensions(100, 100);

		assert.equal(oDimensions.chart.length, 3, "3 points for Chart.");
		assert.equal(oDimensions.innerMaxThreshold.length, 0, "No points for Inner Max Threshold");
		assert.equal(oDimensions.innerMinThreshold.length, 0, "No points for Inner Min Threshold");
		assert.equal(oDimensions.maxThreshold.length, 3, "3 points for maxThreshold.");
		assert.equal(oDimensions.minThreshold.length, 3, "3 points for minThreshold.");
		assert.equal(oDimensions.target.length, 3, "3 points for Target.");

		assert.equal(oDimensions.chart[0].x, -50, "The first X Chart coordinate");
		assert.equal(oDimensions.chart[0].y, 75, "The first Y Chart coordinate");
		assert.equal(oDimensions.chart[1].x, 10, "The second X Chart coordinate");
		assert.equal(oDimensions.chart[1].y, 65, "The second Y Chart coordinate");
		assert.equal(oDimensions.chart[2].x, 50, "The third X Chart coordinate");
		assert.equal(oDimensions.chart[2].y, 35, "The third Y Chart coordinate");

		assert.equal(oDimensions.maxThreshold[0].x, -50, "The first X maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[0].y, 75, "The first Y maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[1].x, 10, "The second X maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[1].y, 50, "The second Y maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[2].x, 50, "The third X maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[2].y, 25, "The third Y maxThreshold coordinate");

		assert.equal(oDimensions.minThreshold[0].x, -50, "The first X minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[0].y, 75, "The first Y minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[1].x, 10, "The second X minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[1].y, 60, "The second Y minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[2].x, 50, "The third X minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[2].y, 40, "The third Y minThreshold coordinate");

		assert.equal(oDimensions.target[0].x, -50, "The first X target coordinate");
		assert.equal(oDimensions.target[0].y, 75, "The first Y target coordinate");
		assert.equal(oDimensions.target[1].x, 10, "The second X target coordinate");
		assert.equal(oDimensions.target[1].y, 55, "The second Y target coordinate");
		assert.equal(oDimensions.target[2].x, 50, "The third X target coordinate");
		assert.equal(oDimensions.target[2].y, 30, "The third Y target coordinate");

		assert.equal(oDimensions.lines[0][0].x, -50, "The first X line coordinate");
		assert.equal(oDimensions.lines[0][0].y, 25, "The first Y line coordinate");
		assert.equal(oDimensions.lines[0][1].x, 50, "The second X line coordinate");
		assert.equal(oDimensions.lines[0][1].y, 75, "The second Y line coordinate");
	});

	QUnit.test("calculateDimensions - one coordinate", function(assert) {
		var oChart = new AreaMicroChart({
			target: new AreaMicroChartItem({ points: [new AreaMicroChartPoint({ y: -50 })] }),
			innerMinThreshold: new AreaMicroChartItem({ points: [new AreaMicroChartPoint({ y: 50 })] }),
			innerMaxThreshold: new AreaMicroChartItem({ points: [new AreaMicroChartPoint({ y: 0 })]}),
			minThreshold: new AreaMicroChartItem({ points: [new AreaMicroChartPoint({ x: 0 })] }),
			maxThreshold: new AreaMicroChartItem({ points: [new AreaMicroChartPoint({ x: -50 })]}),
			chart: new AreaMicroChartItem({ points: [new AreaMicroChartPoint({ x: 50 })] }),
			lines: [new AreaMicroChartItem({ points: [new AreaMicroChartPoint({ x: 50 })] })]
		});

		var oDimensions = oChart._calculateDimensions(100, 100);

		assert.equal(oDimensions.chart.length, 2, "2 points for Chart.");
		assert.equal(oDimensions.innerMaxThreshold.length, 2, "2 points for Inner Max Threshold");
		assert.equal(oDimensions.innerMinThreshold.length, 2, "2 points for Inner Min Threshold");
		assert.equal(oDimensions.maxThreshold.length, 2, "2 points for maxThreshold.");
		assert.equal(oDimensions.minThreshold.length, 2, "2 points for minThreshold.");
		assert.equal(oDimensions.target.length, 2, "2 points for Target.");

		assert.equal(oDimensions.chart[0].x, 100, "The first X Chart coordinate");
		assert.equal(oDimensions.chart[0].y, 0, "The first Y Chart coordinate");
		assert.equal(oDimensions.chart[1].x, 100, "The second X Chart coordinate");
		assert.equal(oDimensions.chart[1].y, 100, "The second Y Chart coordinate");

		assert.equal(oDimensions.maxThreshold[0].x, 0, "The first X maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[0].y, 0, "The first Y maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[1].x, 0, "The second X maxThreshold coordinate");
		assert.equal(oDimensions.maxThreshold[1].y, 100, "The second Y maxThreshold coordinate");

		assert.equal(oDimensions.minThreshold[0].x, 50, "The first X minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[0].y, 0, "The first Y minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[1].x, 50, "The second X minThreshold coordinate");
		assert.equal(oDimensions.minThreshold[1].y, 100, "The second Y minThreshold coordinate");

		assert.equal(oDimensions.target[0].x, 0, "The first X target coordinate");
		assert.equal(oDimensions.target[0].y, 100, "The first Y target coordinate");
		assert.equal(oDimensions.target[1].x, 100, "The second X target coordinate");
		assert.equal(oDimensions.target[1].y, 100, "The second Y target coordinate");

		assert.equal(oDimensions.lines[0][0].x, 100, "The first X line coordinate");
		assert.equal(oDimensions.lines[0][0].y, 0, "The first Y line coordinate");
		assert.equal(oDimensions.lines[0][1].x, 100, "The second X line coordinate");
		assert.equal(oDimensions.lines[0][1].y, 100, "The second Y line coordinate");
	});

	QUnit.module("Calculate", {
		beforeEach: async function() {
			this.oChart = new AreaMicroChart({
				target: new AreaMicroChartItem({ points: [new AreaMicroChartPoint({ x: 10, y: -50 })] }),
				innerMinThreshold: new AreaMicroChartItem({
					points: [
						new AreaMicroChartPoint({ y: 50 }),
						new AreaMicroChartPoint({ x: 0, y: 50 })
					]
				}),
				innerMaxThreshold: new AreaMicroChartItem({
					points: [
						new AreaMicroChartPoint({ x: 10, y: 50 }),
						new AreaMicroChartPoint({ y: 0 })
					]
				}),
				minThreshold: new AreaMicroChartItem({
					points: [new AreaMicroChartPoint()]
				}),
				maxThreshold: new AreaMicroChartItem({
					points: [
						new AreaMicroChartPoint({ x: -50 }),
						new AreaMicroChartPoint({ y: 0 })
					]
				}),
				lines: [new AreaMicroChartItem({
					points: [
						new AreaMicroChartPoint({ x: 50}),
						new AreaMicroChartPoint({ y: 0})
					]
				})]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("calculateDimensions - broken points filtering", function(assert) {
		var oDimensions = this.oChart._calculateDimensions(100, 100);

		assert.equal(oDimensions.chart.length, 0, "No points for Chart.");
		assert.equal(oDimensions.innerMaxThreshold.length, 1, "1 point for Inner Max Threshold");
		assert.equal(oDimensions.innerMinThreshold.length, 1, "1 point for Inner Max Threshold");
		assert.equal(oDimensions.maxThreshold.length, 0, "No points for maxThreshold.");
		assert.equal(oDimensions.minThreshold.length, 0, "No points for minThreshold.");
		assert.equal(oDimensions.target.length, 0, "No points for Target.");
		assert.equal(oDimensions.lines[0].length, 0, "No points for Lines.");
	});

	QUnit.module("Function enableXIndexing", {
		beforeEach: async function() {
			this.oMicroChart = new AreaMicroChart("mac", {
				width: "164px",
				height: "74px",
				target: new AreaMicroChartItem({ color: "Neutral", points: [ {x: 0, y: 0}, {x: 60, y: 40}, {x: 100, y: 90} ] }),
				innerMinThreshold: new AreaMicroChartItem({ color: "Good", points: [ {x: 0, y: 0}, {x: 60, y: 35}, {x: 100, y: 80} ]}),
				innerMaxThreshold: new AreaMicroChartItem({ color: "Good", points: [ {x: 0, y: 0}, {x: 60, y: 40}, {x: 100, y: 90} ] }),
				minThreshold: new AreaMicroChartItem({ color: "Error", points: [ {x: 0, y: 0}, {x: 60, y: 30}, {x: 100, y: 70} ] }),
				maxThreshold:  new AreaMicroChartItem({ color: "Error", points: [ {x: 0, y: 0}, {x: 60, y: 50}, {x: 100, y: 100} ] }),
				chart: new AreaMicroChartItem({ points: [ {x: 0, y: 0}, {x: 60, y: 20}, {x: 100, y: 80} ] })
			}).placeAt("qunit-fixture");
			this.oMicroChart.enableXIndexing(true);
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oMicroChart.destroy();
		}
	});

	QUnit.test("X values in 'chart' aggregation are indices", function(assert) {
		//Arrange
		var oPoints = this.oMicroChart.getAggregation("chart").getPoints();
		//Assert
		for (var i = 0; i < oPoints.length; i++) {
			assert.equal(oPoints[i].getX(), i, "The x value of point " + i + " is correct");
		}
	});

	QUnit.test("X values in 'target' aggregation are indices", function(assert) {
		//Arrange
		var oPoints = this.oMicroChart.getAggregation("target").getPoints();
		//Assert
		for (var i = 0; i < oPoints.length; i++) {
			assert.equal(oPoints[i].getX(), i, "The x value of point " + i + " is correct");
		}
	});

	QUnit.test("X values in 'minThreshold' aggregation are indices", function(assert) {
		//Arrange
		var oPoints = this.oMicroChart.getAggregation("minThreshold").getPoints();
		//Assert
		for (var i = 0; i < oPoints.length; i++) {
			assert.equal(oPoints[i].getX(), i, "The x value of point " + i + " is correct");
		}
	});

	QUnit.test("X values in 'maxThreshold' aggregation are indices", function(assert) {
		//Arrange
		var oPoints = this.oMicroChart.getAggregation("maxThreshold").getPoints();
		//Assert
		for (var i = 0; i < oPoints.length; i++) {
			assert.equal(oPoints[i].getX(), i, "The x value of point " + i + " is correct");
		}
	});

	QUnit.test("X values in 'innerMinThreshold' aggregation are indices", function(assert) {
		//Arrange
		var oPoints = this.oMicroChart.getAggregation("innerMinThreshold").getPoints();
		//Assert
		for (var i = 0; i < oPoints.length; i++) {
			assert.equal(oPoints[i].getX(), i, "The x value of point " + i + " is correct");
		}
	});

	QUnit.test("X values in 'innerMaxThreshold' aggregation are indices", function(assert) {
		//Arrange
		var oPoints = this.oMicroChart.getAggregation("innerMaxThreshold").getPoints();
		//Assert
		for (var i = 0; i < oPoints.length; i++) {
			assert.equal(oPoints[i].getX(), i, "The x value of point " + i + " is correct");
		}
	});

	QUnit.module("Rendering", {
		beforeEach: async function() {
			this.oMicroChart = new AreaMicroChart("mac", {
				width: "164px",
				height: "74px",
				target: new AreaMicroChartItem({
					color: "Neutral",
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 40 },
						{ x: 100, y: 90 }
					]
				}),
				innerMinThreshold: new AreaMicroChartItem({ color: "Good" }),
				innerMaxThreshold: new AreaMicroChartItem({ color: "Good" }),
				minThreshold: new AreaMicroChartItem({
					color: "Error",
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 30 },
						{ x: 100, y: 70 }
					]
				}),
				maxThreshold: new AreaMicroChartItem({
					color: "Good",
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 50 },
						{ x: 100, y: 100 }
					]
				}),
				chart: new AreaMicroChartItem({
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 20 },
						{ x: 100, y: 80 }
					]
				}),
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				firstXLabel: new AreaMicroChartLabel({ label: "June 1", color: "Good" }),
				lastXLabel: new AreaMicroChartLabel({ label: "June 30", color: "Critical" }),
				firstYLabel: new AreaMicroChartLabel({ label: "0M", color: "Good" }),
				lastYLabel: new AreaMicroChartLabel({ label: "80M", color: "Critical" }),
				lines: [
					new AreaMicroChartItem({
						title: "Line 0",
						color: "Error",
						points: [{ x: 0, y: 100 }, { x: 100, y: 0 }]
					})
				]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oMicroChart.destroy();
		}
	});

	QUnit.test("Test labels", function(assert) {
		assert.equal(jQuery("#mac-top-left-lbl").text(), "0M", "left top label was rendered");
		assert.equal(jQuery("#mac-top-center-lbl").text(), "", "No Label");
		assert.equal(jQuery("#mac-top-right-lbl").text(), "80M", "right top label was rendered");
		assert.equal(jQuery("#mac-btm-left-lbl").text(), "June 1", "left btm label was rendered");
		assert.equal(jQuery("#mac-btm-center-lbl").text(), "", "No Label");
		assert.equal(jQuery("#mac-btm-right-lbl").text(), "June 30", "right btm label was rendered");
	});

	QUnit.test("Test showLabel by default", function(assert) {
		assert.ok(this.oMicroChart.getShowLabel(), "The default value of showLabel is correct");
	});

	QUnit.test("Test showLabel is false", async function(assert) {
		this.oMicroChart.setShowLabel(false);
		await nextUIUpdate();
		assert.strictEqual(this.oMicroChart.getShowLabel(), false,  "The value of showLabel has been changed to false correctly");
		assert.ok(jQuery("#mac-top-left-lbl").length === 0, "left top label is not here");
		assert.ok(jQuery("#mac-top-center-lbl").length === 0, "center top label is not here");
		assert.ok(jQuery("#mac-top-right-lbl").length === 0, "right top label is not here");
		assert.ok(jQuery("#mac-btm-left-lbl").length === 0, "left btm label is not here");
		assert.ok(jQuery("#mac-btm-center-lbl").length === 0, "center btm label is not here");
		assert.ok(jQuery("#mac-btm-right-lbl").length === 0, "right btm label is not here");
	});

	QUnit.test("Test showLabel is false for wide mode", async function(assert) {
		this.oMicroChart.setShowLabel(false);
		this.oMicroChart.setView("Wide");
		await nextUIUpdate();
		assert.strictEqual(this.oMicroChart.getShowLabel(), false,  "The value of showLabel has been changed to false correctly");
		assert.ok(jQuery("#mac-top-left-lbl").length === 0, "left top label is not here");
		assert.ok(jQuery("#mac-top-center-lbl").length === 0, "center top label is not here");
		assert.ok(jQuery("#mac-top-right-lbl").length === 0, "right top label is not here");
		assert.ok(jQuery("#mac-btm-left-lbl").length === 0, "left btm label is not here");
		assert.ok(jQuery("#mac-btm-center-lbl").length === 0, "center btm label is not here");
		assert.ok(jQuery("#mac-btm-right-lbl").length === 0, "right btm label is not here");
	});

	QUnit.test("Test if the css property 'display' is set correctly on the canvas element", function(assert) {
		// Arrange
		var $Canvas = this.oMicroChart.$("canvas");

		// Act
		var sDisplayValue = $Canvas.css("display");

		// Assert
		assert.equal(sDisplayValue, "block", "The display property has been set correctly on the canvas element");
	});

	QUnit.test("Test threshold is present", function(assert) {
		//Arrange
		var oDimensions = this.oMicroChart._calculateDimensions(100, 100);
		//Act
		var bThresholdPresent = this.oMicroChart._isThresholdPresent(oDimensions);
		//Assert
		assert.ok(bThresholdPresent, "Chart has at least one threshold");
	});

	QUnit.test("Test thresholds are not present", function(assert) {
		//Arrange
		//remove the active thresholds
		this.oMicroChart.setMaxThreshold(new AreaMicroChartItem({ color: "Good" }));
		this.oMicroChart.setMinThreshold(new AreaMicroChartItem({ color: "Good" }));
		var oDimensions = this.oMicroChart._calculateDimensions(100, 100);
		//Act
		var bThresholdPresent = this.oMicroChart._isThresholdPresent(oDimensions);
		//Assert
		assert.ok(!bThresholdPresent, "Chart has no thresholds");
	});

	QUnit.test("Test css class for neutral item target when threshold is present", function(assert) {
		//Arrange
		var oDimensions = this.oMicroChart._calculateDimensions(100, 100);
		//Act
		var sItemColor = this.oMicroChart._getItemColor(oDimensions, true);
		//Assert
		assert.equal(sItemColor, "sapSuiteAMCSemanticColorNeutral", "Chart target has 'Neutral' as css class color for neutral color when thresholds are present");
	});

	QUnit.test("Test css class for neutral item target when no threshold is present", function(assert) {
		//Arrange
		//remove the active thresholds
		this.oMicroChart.setMaxThreshold(new AreaMicroChartItem({ color: "Neutral" }));
		this.oMicroChart.setMinThreshold(new AreaMicroChartItem({ color: "Neutral" }));
		var oDimensions = this.oMicroChart._calculateDimensions(100, 100);
		//Act
		var sItemColor = this.oMicroChart._getItemColor(oDimensions, true);
		//Assert
		assert.equal(sItemColor, "sapSuiteAMCNeutralNoThreshold", "Chart target has 'sapSuiteAMCNeutralNoThreshold' as css class color for neutral color when no thresholds are present");
	});

	QUnit.test("Test css class for other than neutral item target when threshold is present", function(assert) {
		//Arrange
		this.oMicroChart.setTarget(new AreaMicroChartItem({ color: "Good", points: [ {x: 0, y: 0}, {x: 60, y: 40}, {x: 100, y: 90} ] }));
		var oDimensions = this.oMicroChart._calculateDimensions(100, 100);
		//Act
		var sItemColor = this.oMicroChart._getItemColor(oDimensions, true);
		//Assert
		assert.equal(sItemColor, "sapSuiteAMCSemanticColorGood", "Chart target has 'Good' as css class color for good color when thresholds are present");
	});

	QUnit.test("Test css class for other than neutral item target when no threshold is present", function(assert) {
		//Arrange
		this.oMicroChart.setTarget(new AreaMicroChartItem({ color: "Good", points: [ {x: 0, y: 0}, {x: 60, y: 40}, {x: 100, y: 90} ] }));
		//remove the active thresholds
		this.oMicroChart.setMaxThreshold(new AreaMicroChartItem({ color: "Good" }));
		this.oMicroChart.setMinThreshold(new AreaMicroChartItem({ color: "Good" }));
		var oDimensions = this.oMicroChart._calculateDimensions(100, 100);
		//Act
		var sItemColor = this.oMicroChart._getItemColor(oDimensions, true);
		//Assert
		assert.equal(sItemColor, "sapSuiteAMCSemanticColorGood", "Chart target has 'Good' as css class color for good color when no thresholds are present");
	});

	QUnit.test("If no targetValue is present, no color could be set", function(assert) {
		//Arrange
		this.oMicroChart.setTarget(null);
		//remove the active thresholds
		this.oMicroChart.setMaxThreshold(new AreaMicroChartItem({ color: "Good" }));
		this.oMicroChart.setMinThreshold(new AreaMicroChartItem({ color: "Good" }));
		var oDimensions = this.oMicroChart._calculateDimensions(100, 100);
		//Act
		var sItemColor = this.oMicroChart._getItemColor(oDimensions, true);
		//Assert
		assert.equal(sItemColor, undefined);
	});

	QUnit.module("Rendering - Label width", {
		beforeEach: async function() {
			this.oMicroChart = new AreaMicroChart({
				width: "250px",
				height: "94px",
				firstXLabel: new AreaMicroChartLabel({ label: "June 1", color: "Good" }),
				lastXLabel: new AreaMicroChartLabel({ label: "June 30", color: "Critical" }),
				firstYLabel: new AreaMicroChartLabel({ label: "0M", color: "Good" }),
				lastYLabel: new AreaMicroChartLabel({ label: "80M", color: "Critical" }),
				minLabel: new AreaMicroChartLabel({ label: "London0123" }),
				maxLabel: new AreaMicroChartLabel({ label: "Hamburg456" }),
				chart: new AreaMicroChartItem({ points: [ {x: 0, y: 0}, {x: 60, y: 20}, {x: 100, y: 80} ] }),
				lines: [ new AreaMicroChartItem({ points: [ {x: 0, y: 100}, {x: 100, y: 0} ] }) ]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oMicroChart.destroy();
		}
	});

	QUnit.test("Labels should take 50% width when no min/max labels present", async function(assert) {
		//Arrange
		this.oMicroChart.setMinLabel();
		this.oMicroChart.setMaxLabel();
		//Act
		await nextUIUpdate();
		//Assert
		var $Labels = this.oMicroChart.$().find(".sapSuiteAMCLabels.sapSuiteAMCPositionTop").children();
		assert.equal($Labels[0].getBoundingClientRect().width, 250 / 2, "correct width");
		assert.equal($Labels[1].getBoundingClientRect().width, 250 / 2, "correct width");
	});

	QUnit.test("Labels should take 1/3 width when min/max labels present", function(assert) {
		//Arrange
		//Act
		//Assert
		var $Labels = this.oMicroChart.$().find(".sapSuiteAMCLabels.sapSuiteAMCPositionTop").children();
		assert.equal(Math.round($Labels[0].getBoundingClientRect().width), Math.round(250 / 3), "correct width");
		assert.equal(Math.round($Labels[1].getBoundingClientRect().width), Math.round(250 / 3), "correct width");
		assert.equal(Math.round($Labels[2].getBoundingClientRect().width), Math.round(250 / 3), "correct width");
	});

	QUnit.module("Rendering Wide", {
		beforeEach: async function() {
			this.oMicroChartWide = new AreaMicroChart("mac-wide", {
				width: "164px",
				height: "74px",
				target: new AreaMicroChartItem({
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 40 },
						{ x: 100, y: 90 }
					]
				}),
				innerMinThreshold: new AreaMicroChartItem({ color: "Good" }),
				innerMaxThreshold: new AreaMicroChartItem({ color: "Good" }),
				minThreshold: new AreaMicroChartItem({
					color: "Error",
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 30 },
						{ x: 100, y: 70 }
					]
				}),
				maxThreshold: new AreaMicroChartItem({
					color: "Good",
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 50 },
						{ x: 100, y: 100 }
					]
				}),
				chart: new AreaMicroChartItem({
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 20 },
						{ x: 100, y: 80 }
					]
				}),
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				firstXLabel: new AreaMicroChartLabel({ label: "June 1", color: "Good" }),
				lastXLabel: new AreaMicroChartLabel({ label: "June 30", color: "Critical" }),
				firstYLabel: new AreaMicroChartLabel({ label: "0M", color: "Good" }),
				lastYLabel: new AreaMicroChartLabel({ label: "80M", color: "Critical" }),
				minLabel: new AreaMicroChartLabel({ label: "London0123" }),
				maxLabel: new AreaMicroChartLabel({ label: "Hamburg456" }),
				view: "Wide"
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oMicroChartWide.destroy();
		}
	});

	QUnit.test("Labels shown when height not less than threshold", async function(assert) {
		this.oMicroChartWide.setHeight("2.5rem");
		await nextUIUpdate();

		var $Labels = this.oMicroChartWide.$().find(".sapSuiteAMCPositionTop.sapSuiteAMCLabels");
		//Assert
		assert.ok($Labels.is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Labels hidden when height less than threshold", async function(assert) {
		this.oMicroChartWide.setHeight("2.2rem");
		await nextUIUpdate();

		var $Labels = this.oMicroChartWide.$().find(".sapSuiteAMCPositionTop.sapSuiteAMCLabels");
		//Assert
		assert.notOk($Labels.is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Aria-label only includes the standard chart information", async function(assert) {
		// Arrange
		var sAriaLabel = this.oMicroChartWide.getTooltip_AsString();
		this.oMicroChartWide.setTooltip("This is tooltip");
		// Act
		await nextUIUpdate();
		// Assert
		assert.equal(sAriaLabel,sAriaLabel , "The aria-label includes only chart information");
		assert.equal(this.oMicroChartWide.$().attr("title"), null, "The title attribute is not rendered");
	});

	QUnit.test("Test labels Wide", function(assert) {
		assert.equal(jQuery("#mac-wide-top-left-lbl").text(), "0M", "left top label was rendered");
		assert.equal(jQuery("#mac-wide-top-center-lbl").text(), "Hamburg456", "No Label");
		assert.equal(jQuery("#mac-wide-top-right-lbl").text(), "80M", "right top label was rendered");
		assert.equal(jQuery("#mac-wide-btm-left-lbl").text(), "June 1", "left btm label was rendered");
		assert.equal(jQuery("#mac-wide-btm-center-lbl").text(), "London0123", "No Label");
		assert.equal(jQuery("#mac-wide-btm-right-lbl").text(), "June 30", "right btm label was rendered");
	});

	QUnit.test("Test Aria-label and Aria-labelledBy superseding", async function(assert) {
		assert.ok(this.oMicroChartWide.$().attr("aria-label"), "By default, the aria-label attribute is rendered");
		assert.equal(this.oMicroChartWide.$().attr("aria-labelledBy"), null, "By default, the aria-labelledBy attribute is not rendered");

		this.oMicroChartWide.addAriaLabelledBy(new Text());
		await nextUIUpdate();
		assert.equal(this.oMicroChartWide.$().attr("aria-label"), null, "When first Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oMicroChartWide.$().attr("aria-labelledBy").split(" ").length, 1, "When first Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and cointains 1 ID");

		this.oMicroChartWide.addAriaLabelledBy(new Button());
		await nextUIUpdate();
		assert.equal(this.oMicroChartWide.$().attr("aria-label"), null, "When second Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oMicroChartWide.$().attr("aria-labelledBy").split(" ").length, 2, "When second Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and contains 2 IDs");

		this.oMicroChartWide.removeAllAriaLabelledBy();
		await nextUIUpdate();
		assert.ok(this.oMicroChartWide.$().attr("aria-label"), "When removed all ariaLabelledBy, the aria-label attribute is rendered");
		assert.equal(this.oMicroChartWide.$().attr("aria-labelledBy"), null, "When removed all ariaLabelledBy, the aria-labelledBy attribute is not rendered");
	});

	QUnit.module("Title attribute is added and removed when mouse enters and leaves", {
		beforeEach: async function() {
			this.oMicroChart = new AreaMicroChart("amc", {
				width: "164px",
				height: "74px",
				target: new AreaMicroChartItem({
					color: "Neutral",
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 40 },
						{ x: 100, y: 90 }
					]
				}),
				innerMinThreshold: new AreaMicroChartItem({
					color: "Good",
					points: [
						{x: 0, y: 0},
						{x: 60, y: 35},
						{x: 100, y: 80}
					]
				}),
				innerMaxThreshold: new AreaMicroChartItem({
					color: "Good",
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 40 },
						{ x: 100, y: 90 }
					]
				}),
				minThreshold: new AreaMicroChartItem({
					color: "Error",
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 30 },
						{ x: 100, y: 70 }
					]
				}),
				maxThreshold:  new AreaMicroChartItem({
					color: "Error",
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 50 },
						{ x: 100, y: 100 }
					]
				}),
				chart: new AreaMicroChartItem({
					points: [
						{ x: 0, y: 0 },
						{ x: 60, y: 20 },
						{ x: 100, y: 80 }
					]
				})
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oMicroChart.destroy();
			this.oMicroChart = null;
		}
	});

	QUnit.test("Tooltip is showed when mouse enters chart", async function(assert) {
		// Arrange
		this.oMicroChart.setTooltip("This is amc tooltip");
		await nextUIUpdate();
		// Act
		this.oMicroChart.$().trigger("mouseenter");
		// Assert
		assert.equal(this.oMicroChart.$().attr("title"), "This is amc tooltip", "The title attribute is added when mouse enters the chart");
	});

	QUnit.test("Tooltip is removed when mouse leaves chart", async function(assert) {
		// Arrange
		this.oMicroChart.setTooltip("This is amc tooltip");
		await nextUIUpdate();
		// Act
		this.oMicroChart.$().trigger("mouseenter");
		this.oMicroChart.$().trigger("mouseleave");
		// Assert
		assert.equal(this.oMicroChart.$().attr("title"), null, "The title attribute is removed when mouse leaves the chart");
	});

	QUnit.module("Tooltip behavior", {
		beforeEach: function() {
			this.oChart = new AreaMicroChart();
			this.oModel = new JSONModel({
				size: "M",
				Tooltip: "Custom Tooltip"
			});
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oModel.destroy();
		}
	});

	QUnit.test("Default value for tooltip", function(assert) {
		//Arrange
		//Act
		//Assert
		assert.deepEqual(this.oChart.getTooltip(), "((AltText))", "Default value set correctly");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, tooltip is not bound", async function(assert) {
		//Arrange
		//Act
		this.oChart.setModel(this.oModel);
		await nextUIUpdate();
		//Assert
		assert.deepEqual(this.oChart.getTooltip(), "((AltText))", "Default value set correctly");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, control is bound, tooltip is not bound", async function(assert) {
		//Arrange
		this.oChart.setAggregation("tooltip", new TooltipBase({
			text : "{/Tooltip}"
		}));
		//Act
		this.oChart.setModel(this.oModel);
		await nextUIUpdate();
		//Assert
		assert.ok(this.oChart.getTooltip(), "Tooltip exists");
		assert.deepEqual(this.oChart.getTooltip().getText(), "Custom Tooltip", "Tooltip exists");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, control is bound", async function(assert) {
		//Arrange
		var oModel = new JSONModel({
			data : [{
				size : "M",
				Tooltip : "Custom Tooltip"
			}]
		});
		var oTable = new Table({
			items: {
				path: "/data",
				template: new ColumnListItem({
					cells: new AreaMicroChart({
						chart: new AreaMicroChartItem({
							points: [
								{ x: 0, y: 0 },
								{ x: 30, y: 20 },
								{ x: 60, y: 20 },
								{ x: 100, y: 80 }
							]
						})
					})
				})
			}
		}).setModel(oModel);
		//Act
		await nextUIUpdate();
		var oChart = oTable.getItems()[0].getCells()[0];
		//Assert
		assert.deepEqual(oChart.getTooltip(), "((AltText))", "Binding is empty, so tooltip aggregation is also empty.");
		assert.ok(oChart.getTooltip_AsString(), "Tooltip is empty, default tooltip as string appears");
		assert.notOk(oChart.isBound("tooltip"), "Tooltip is bound");
		//Cleanup
		oTable.destroy();
		oModel.destroy();
	});

	QUnit.module("Line rendering functions");

	QUnit.test("The _drawDashedLine function draws the correct amount of dashes", function(assert) {
		//Arrange
		var oContextMock = {
			lineTo: sinon.stub(),
			moveTo: sinon.stub()
		};

		//Act
		AreaMicroChart.prototype._drawDashedLine.call(oContextMock, 0, 0, 100, 0, [ 5, 5 ]);

		//Assert
		assert.equal(oContextMock.lineTo.callCount, 10, "For the given dasharray, the lineTo function has been called 10 times.");
		assert.equal(oContextMock.moveTo.callCount, 11, "For the given dasharray, the moveTo function has been called 11 times.");
	});

	QUnit.test("The _renderDashedLine function uses native functionality for dashed lines", function(assert) {
		//Arrange
		var oMicroChartMock = {
			_renderLine: sinon.stub()
		};
		var oContextMock = {
			setLineDash: sinon.stub()
		};

		//Act
		AreaMicroChart.prototype._renderDashedLine.call(oMicroChartMock, oContextMock, [], [ 5, 5 ]);

		//Assert
		assert.equal(oMicroChartMock._renderLine.callCount, 1, "The function _renderLine has been called once.");
		assert.equal(oContextMock.setLineDash.callCount, 2, "The dasharray has been set twice.");
		assert.deepEqual(oContextMock.setLineDash.firstCall.args[0], [ 5, 5 ], "The dasharray has been set using the native line dash setting.");
		assert.deepEqual(oContextMock.setLineDash.secondCall.args[0], [], "The dasharray has been reset using the native line dash setting.");
	});

	QUnit.test("The _renderDashedLine function uses custom functionality for dashed lines", function(assert) {
		//Arrange
		var oContextMock = {
			beginPath: sinon.stub(),
			_dashedLine: sinon.stub(),
			stroke: sinon.stub()
		};
		var aPoints = [
			{ x: 0, y: 0 },
			{ x: 0, y: 0 }
		];

		//Act
		AreaMicroChart.prototype._renderDashedLine.call(null, oContextMock, aPoints, [ 5, 5 ]);

		//Assert
		assert.equal(oContextMock._dashedLine.callCount, 1, "The function _dashedLine has been called once.");
	});

	QUnit.module("Execution of functions onAfterRendering", {
		beforeEach: function() {
			this.oChart = new AreaMicroChart();
			sinon.spy(microchartLibrary, "_checkControlIsVisible");
		},
		afterEach: function() {
			microchartLibrary._checkControlIsVisible.restore();
			this.oChart.destroy();
		}
	});

	QUnit.test("Visibility check", function(assert) {
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(microchartLibrary._checkControlIsVisible.calledOnce, "Method _checkControlIsVisible has been called once.");
	});

	QUnit.module("Control provides accessibility information", {
		beforeEach : function() {
			this.oChart = new AreaMicroChart();
			this.oChart.setAggregation("tooltip", "AreaMicroChart");
		},
		afterEach : function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function(assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "AreaMicroChart",
			type: oRb.getText("ACC_CTR_TYPE_MICROCHART")
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: async function() {
			this.oChart = new AreaMicroChart("areaMicroChart").placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("No data rendered when no item given", function(assert) {
		//Arrange
		//Act
		//Assert
		assert.ok(document.getElementById("areaMicroChart"), "Control was rendered");
		var a$NoDataElement = this.oChart.$().find(".sapSuiteUiMicroChartNoData");
		assert.equal(a$NoDataElement.length, 1, "No data placeholder shold be rendered");
	});

	QUnit.test("No data in aria-label", function(assert) {
		//Arrange
		//Act
		//Assert
		assert.equal(this.oChart.$().attr("role"), "figure", "chart aria role was rendered successfully");
		assert.ok(this.oChart.$().attr("aria-label").indexOf("No data") > -1, "The aria-label includes no data");
	});

	QUnit.test("Control not rendered when no data is present and hideOnNoData is set to true", async function(assert) {
		//Arrange
		this.oChart.setHideOnNoData(true);
		//Act
		await nextUIUpdate();

		//Assert
		assert.equal(this.oChart.getDomRef(), null , "chart not rendered");
	});

	TestUtils.initSizeModule(AreaMicroChart, "sapSuiteAMCSize");
});

