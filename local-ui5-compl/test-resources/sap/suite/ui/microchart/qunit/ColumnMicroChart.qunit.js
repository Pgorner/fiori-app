/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/microchart/ColumnMicroChart",
	"sap/suite/ui/microchart/ColumnMicroChartData",
	"sap/suite/ui/microchart/ColumnMicroChartLabel",
	"sap/m/library",
	"sap/m/FlexBox",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/ColumnListItem",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/m/Table",
	"sap/m/Text",
	"sap/ui/core/TooltipBase",
	"sap/suite/ui/microchart/library",
	"./TestUtils",
	"sap/base/Log",
	"sap/ui/util/Mobile",
	"sap/ui/core/Core",
	"sap/ui/core/Lib",
	"sap/ui/core/Theming"
], function(nextUIUpdate, jQuery, ColumnMicroChart, ColumnMicroChartData, ColumnMicroChartLabel, mobileLibrary, FlexBox, JSONModel, Button, ColumnListItem, GenericTile, TileContent, Table, Text, TooltipBase, microchartLibrary, TestUtils, Log, Mobile, Core, CoreLib, Theming) {
	"use strict";

	var Size = mobileLibrary.Size;
	var oRb = CoreLib.getResourceBundleFor("sap.suite.ui.microchart");

	Mobile.init();


	function pressChart() {
		Log.info("Chart pressed");
	}

	function pressBar() {
		Log.info("Bar pressed");
	}

	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.fnSpyReady = sinon.spy(Core, "ready");
			this.fnSpyHandleCoreInitialized = sinon.spy(ColumnMicroChart.prototype, "_handleCoreInitialized");
			this.fnStubAttachThemeApplied = sinon.stub(Theming, "attachApplied").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.fnSpyHandleThemeApplied = sinon.spy(ColumnMicroChart.prototype, "_handleThemeApplied");
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
	QUnit.test("Core not loaded and theme not loaded", function(assert) {
		//Act
		var oChart = new ColumnMicroChart();

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
	QUnit.test("Core not loaded and theme loaded", function(assert) {
		//Act
		var oChart = new ColumnMicroChart();

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
	QUnit.test("Core loaded and theme not loaded", function(assert) {
		//Act
		var oChart = new ColumnMicroChart();

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
	QUnit.test("Core loaded and theme loaded", function(assert) {
		//Act
		var oChart = new ColumnMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyReady.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.module("Handling of sap.m.Size.Repsonsive", {
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	/**
		* @deprecated since 1.58
	*/
	QUnit.test("Setting size property to sap.m.Size.Responsive leads to isResponsive === true", async function(assert) {
		//Arrange
		this.oChart = new ColumnMicroChart({
			size: Size.M
		}).placeAt("qunit-fixture");
		await nextUIUpdate();
		var bIsResponsive = this.oChart._isResponsive();
		//Act
		this.oChart.setSize(Size.Responsive);
		await nextUIUpdate();
		//Assert
		assert.ok(!bIsResponsive, "Chart is not in Responsive mode for size M");
		assert.ok(this.oChart._isResponsive(), "Chart is in Responsive mode for size 'Responsive'");
	});

	QUnit.test("setSize return instance", function(assert) {
		//Arrange
		this.oChart = new ColumnMicroChart();
		//Act
		var oResult = this.oChart.setSize(Size.Responsive);
		//Assert
		assert.deepEqual(oResult, this.oChart, "Control instance returned");
	});

	QUnit.test("setSize does nothing in case of same value", function(assert) {
		//Arrange
		this.oChart = new ColumnMicroChart({
			size: Size.L
		});
		var oSpy = sinon.spy(this.oChart, "invalidate");
		//Act
		var oResult = this.oChart.setSize(Size.L);
		//Assert
		assert.deepEqual(oResult, this.oChart, "Control instance returned");
		assert.equal(oSpy.callCount, 0, "Chart not invalidated");
	});

	/**
		* @deprecated since 1.58
	*/
	QUnit.test("sap.m.Size.Responsive leads to isResponsive === true", async function(assert) {
		//Arrange
		this.oChart = new ColumnMicroChart({
			size: Size.Responsive
		}).placeAt("qunit-fixture");
		//Act
		await nextUIUpdate();
		//Assert
		assert.ok(this.oChart._isResponsive(), "Chart is in Responsive mode for size Responsive");
	});

	/**
		* @deprecated since 1.58
	*/
	QUnit.test("sap.m.Size.Responsive changed to sap.m.Size.L leads to isResponsive === false", async function(assert) {
		//Arrange
		this.oChart = new ColumnMicroChart({
			size: Size.Responsive
		}).placeAt("qunit-fixture");
		await nextUIUpdate();
		var oSpy = sinon.spy(this.oChart, "invalidate");
		//Act
		this.oChart.setSize(Size.L);
		await nextUIUpdate();
		//Assert
		assert.ok(!this.oChart._isResponsive(), "Chart is no longer in Responsive mode for size L");
		assert.equal(oSpy.callCount, 1, "Chart invalidated");
	});

	QUnit.module("events", {
		beforeEach: async function() {
			this.oChart = new ColumnMicroChart("test-chart-ev", {
				columns: [{value: 0}, {value: 10}, {value: 10}, {value: 10}, {value: 10}]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("events handling test", function(assert) {
		assert.ok(!this.oChart.hasListeners("press"), "No press event attached to control");
		this.oChart.attachPress(pressChart);
		assert.ok(this.oChart.hasListeners("press"), "Press event attached to control");
		this.oChart.detachPress(pressChart);
		assert.ok(!this.oChart.hasListeners("press"), "Press event detached from control");
		assert.ok(!this.oChart.getColumns()[2].hasListeners("press"), "No press event attached to column 2");
		this.oChart.getColumns()[2].attachPress(pressBar);
		assert.ok(this.oChart.getColumns()[2].hasListeners("press"), "Press event attached to column 2");
		this.oChart.getColumns()[2].detachPress(pressBar);
		assert.ok(!this.oChart.getColumns()[2].hasListeners("press"), "Press event detached from column 2");
	});

	QUnit.module("calcColumnsHeight", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart("test-chart");
			this.aBars = [];
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("regular", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0.1
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 50
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -0.1
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -50
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(this.aBars[0].height, "1.00%", "Column height");

		assert.equal(this.aBars[1].height, "1.00%", "Column height");

		assert.equal(this.aBars[2].height, "50.00%", "Column height");

		assert.equal(this.aBars[3].height, "1.00%", "Column height");

		assert.equal(this.aBars[4].height, "50.00%", "Column height");
	});

	QUnit.test("not all values are zero", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 100
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(parseInt(this.aBars[0].height), 1, "Column height is set");
		assert.equal(parseInt(this.aBars[0].top), 99, "Column top is set");
	});

	QUnit.test("all values are zero", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(this.aBars[0].height, "1px", "Column height is 1px");
		assert.equal(this.aBars[0].top, "calc(100% - 1px)", "Column top is set");
	});

	QUnit.test("shiftTop", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -100
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -0.1
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(this.aBars[0].height, "1.00%", "Column height");
		assert.equal(this.aBars[0].top, "0.00%", "Column top");

		assert.equal(this.aBars[1].height, "99.00%", "Column height");
		assert.equal(this.aBars[1].top, "1.00%", "Column top");

		assert.equal(this.aBars[2].height, "1.00%", "Column height");
		assert.equal(this.aBars[2].top, "1.00%", "Column top");
	});

	QUnit.test("shiftBottom", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 100
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 50
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -0.1
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(this.aBars[0].height, "1.00%", "Column height");
		assert.equal(this.aBars[0].top, "98.00%", "Column top");

		assert.equal(this.aBars[1].height, "99.00%", "Column height");
		assert.equal(this.aBars[1].top, "0.00%", "Column top");

		assert.equal(this.aBars[2].height, "49.05%", "Column height");
		assert.equal(this.aBars[2].top, "49.95%", "Column top");

		assert.equal(this.aBars[3].height, "1.00%", "Column height");
		assert.equal(this.aBars[3].top, "99.00%", "Column top");

	});

	QUnit.module("rendering", {
		beforeEach: async function() {
			this.oChart = new ColumnMicroChart({
				width: "100px",
				height: "50px",
				leftTopLabel: new ColumnMicroChartLabel({ label: "Left", color: "Critical"}),
				rightBottomLabel: new ColumnMicroChartLabel({ label: "Right", color: "Error"}),
				columns: [
					{value: 0, color: "Good"}, {value: 10, color: "Error"},
					{value: -10, color: "Critical"},
					{value: 0 , color: "None"},
					{value: 0 , color: "#d58215"}
				]
			});
			this.oChart.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("rendering test", function(assert) {
		var aColumns = this.oChart.getColumns();
		assert.equal(aColumns[4].$().find(".sapSuiteClMCLabel").css('background-color'), undefined, "No background color applied to label of CSS colored chart" );
		assert.equal(aColumns[4].$().find(".sapSuiteClMCInnerBar").css('background-color'), 'rgb(213, 130, 21)', "Custom color applied to the chart bar");
		assert.equal(aColumns[4].$().find(".sapSuiteClMCLabel").css('color'), undefined, "Custom color not applied to label");
                assert.equal(this.oChart.$().css("width"), "100px", "Chart width");
		assert.equal(this.oChart.$().css("height"), "50px", "Chart height");
		assert.ok(aColumns[0].$().find(".sapSuiteClMCInnerBar").hasClass("sapSuiteClMCSemanticColorGood"));
		assert.ok(aColumns[1].$().find(".sapSuiteClMCInnerBar").hasClass("sapSuiteClMCSemanticColorError"));
		assert.ok(aColumns[2].$().find(".sapSuiteClMCInnerBar").hasClass("sapSuiteClMCSemanticColorCritical"));
		assert.ok(aColumns[3].$().find(".sapSuiteClMCInnerBar").hasClass("sapSuiteClMCSemanticColorNone"));
		assert.equal(this.oChart.$("left-top-lbl").text(), "Left", "Left top label text");
		assert.equal(this.oChart.$("right-btm-lbl").text(), "Right", "Right bottom label text");
	});

	QUnit.test("Aria-label only includes the standard chart information", async function(assert) {
		// Arrange
		var sAriaLabel = this.oChart.getTooltip_AsString();
		this.oChart.setTooltip("This is tooltip");
		// Act
		await nextUIUpdate();
		// Assert
		assert.equal(sAriaLabel,sAriaLabel, "The aria-label includes only chart information");
		assert.equal(null, this.oChart.$().attr("title"), "The title attribute is not rendered");
	});

	QUnit.test("Test Aria-label and Aria-labelledBy superseding", async function(assert) {
		assert.ok(this.oChart.$().attr("aria-label"), "By default, the aria-label attribute is rendered");
		assert.equal(this.oChart.$().attr("aria-labelledBy"), null, "By default, the aria-labelledBy attribute is not rendered");

		this.oChart.addAriaLabelledBy(new Text());
		await nextUIUpdate();
		assert.equal(this.oChart.$().attr("aria-label"), null, "When first Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oChart.$().attr("aria-labelledBy").split(" ").length, 1, "When first Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and cointains 1 ID");

		this.oChart.addAriaLabelledBy(new Button());
		await nextUIUpdate();
		assert.equal(this.oChart.$().attr("aria-label"), null, "When second Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oChart.$().attr("aria-labelledBy").split(" ").length, 2, "When second Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and contains 2 IDs");

		this.oChart.removeAllAriaLabelledBy();
		await nextUIUpdate();
		assert.ok(this.oChart.$().attr("aria-label"), "When removed all ariaLabelledBy, the aria-label attribute is rendered");
		assert.equal(this.oChart.$().attr("aria-labelledBy"), null, "When removed all ariaLabelledBy, the aria-labelledBy attribute is not rendered");
	});

	QUnit.module("Title attribute is added and removed when mouse enters and leaves", {
		beforeEach: async function() {
			this.oCmc = new ColumnMicroChart("cmc", {
				width: "100px",
				height: "50px",
				leftTopLabel: new ColumnMicroChartLabel({ label: "Left", color: "Critical"}),
				rightBottomLabel: new ColumnMicroChartLabel({ label: "Right", color: "Error"}),
				columns: [{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"}]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oCmc.destroy();
			this.oCmc = null;
		}
	});

	QUnit.test("Tooltip is showed when mouse enters chart", async function(assert) {
		// Arrange
		this.oCmc.setTooltip("This is cmc tooltip");
		await nextUIUpdate();
		// Act
		this.oCmc.$().trigger("mouseenter");
		// Assert
		assert.equal(this.oCmc.getTooltip_AsString(), this.oCmc.$().attr("title"), "The title attribute is added when mouse enters the chart");
	});

	QUnit.test("Tooltip is removed when mouse leaves chart", async function(assert) {
		// Arrange
		this.oCmc.setTooltip("This is cmc tooltip");
		await nextUIUpdate();
		// Act
		this.oCmc.$().trigger("mouseenter");
		this.oCmc.$().trigger("mouseleave");
		// Assert
		assert.equal(null, this.oCmc.$().attr("title"), "The title attribute is removed when mouse leaves the chart");
	});

	QUnit.module("Responsiveness", {
		beforeEach: async function() {
			this.oChart = new ColumnMicroChart("mCMChart", {
				size: Size.Responsive,
				columns: [{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"}]
			});
			this.oFlexBox = new FlexBox("FlexBox-cmc", {
				items: [this.oChart],
				renderType: "Bare",
				width: "6rem",
				height: "5rem"
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Chart is rendered with the proper width and height higher than the thresholds", function(assert) {
		//Arrange
		var iChartHeightExpected = this.oFlexBox.$().height();
		var iChartWidthExpected = this.oFlexBox.$().width();
		//Act
		//Assert
		assert.equal(this.oChart.$().height(), iChartHeightExpected, "Chart is rendered with expected height");
		assert.equal(this.oChart.$().width(), iChartWidthExpected, "Chart is rendered with expected width");
	});


	//Responsiveness: do not show the labels if they are truncated or do not show the top label if the height of the chart is less than 3.5rem
	//before hiding the labels, reduce the font from 14px to 12px
	QUnit.module("Responsiveness -- Labels and Fonts", {
		beforeEach: async function() {
			this.oChart = new ColumnMicroChart("mCMChart", {
				size: Size.Responsive,
				leftTopLabel : {
					label : "June 1",
					color : "Good"
				},
				leftBottomLabel : {
					label : "0M",
					color : "Good"
				},
				rightTopLabel : {
					label : "June 30",
					color : "Critical"
				},
				rightBottomLabel : {
					label : "80M",
					color : "Critical"
				},
				columns: [{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"}]
			});
			this.oFlexBox = new FlexBox("FlexBox-cmc", {
				items: [this.oChart],
				renderType: "Bare",
				width: "15rem",
				height: "15rem"
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
		var sTopLabelStyle = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").attr("style");
		var sBottomLabelStyle = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").attr("style");
		//Assert
		assert.ok(!sTopLabelStyle || sTopLabelStyle.indexOf("display: none;") === -1, "Chart is properly rendered with the top labels visible");
		assert.ok(!sBottomLabelStyle || sBottomLabelStyle.indexOf("display: none;") === -1, "Chart is properly rendered with the bottom labels visible");
		assert.ok(!this.oChart.hasStyleClass("sapSuiteClMCNoTopLabels"), "Chart is properly rendered with the labels having the standard font size");
	});

	QUnit.test("Chart is rendered with the labels visible having font resized to smallFont for height shrinking", async function(assert) {
		//the font is resized when the threshold for height is reached (4.5rem)
		//Arrange
		this.oFlexBox.setHeight("4.5rem");
		await nextUIUpdate();
		//Act
		var sTopLabelStyle = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").attr("style");
		//Assert
		assert.ok(!sTopLabelStyle || sTopLabelStyle.indexOf("display: none") === -1, "Chart is properly rendered with the top label visible");
		assert.ok(this.oChart.$().hasClass("sapSuiteClMCLookM"), "Chart is properly rendered with the labels having the standard font size");
	});

	QUnit.test("Chart is rendered with the top labels hidden and bottom labels present whene some top label should get truncated", async function(assert) {
		//Arrange
		this.oChart.getRightTopLabel().setLabel("some very long label");
		this.oFlexBox.setHeight("150px");
		//Act
		await nextUIUpdate();
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Chart is rendered with the top labels hidden and no bottom labels - height shrinking", async function(assert) {
		//top label is hidden when the threshold for height is reached (55px) and there are no bottom labels
		//Arrange
		this.oFlexBox.setHeight("55px");
		this.oChart.setRightBottomLabel(null);
		this.oChart.setLeftBottomLabel(null);
		await nextUIUpdate();
		//Act
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Chart is rendered with the bottom labels hidden - height shrinking", async function(assert) {
		//bottom label is hidden when the threshold for height is reached (55px)
		//Arrange
		this.oFlexBox.setHeight("55px");
		await nextUIUpdate();
		//Act
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the bottom labels hidden");
	});

	QUnit.test("Chart is rendered with the top labels hidden when allowed column labels and there is enough space", async function(assert) {
		//Arrange
		this.oChart.setAllowColumnLabels(true);
		await nextUIUpdate();
		//Act
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels hidden");
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the bottom labels shown");
		assert.equal(this.oChart.$().find(".sapSuiteClMCLabelColumn").length, 3, "Column labels are all rendered");
		this.oChart.$().find(".sapSuiteClMCLabelColumn").each(function() {
			assert.ok(jQuery(this).is(":visible"), "Column label is visible");
		});
	});

	QUnit.test("Chart is rendered with the top labels shown when allowed column labels and height is small", async function(assert) {
		//Arrange
		this.oFlexBox.setHeight("70px");
		this.oChart.setAllowColumnLabels(true);
		await nextUIUpdate();
		//Act
		//Assert
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels shown");
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the bottom labels shown");
		assert.equal(this.oChart.$().find(".sapSuiteClMCLabelColumn").length, 3, "Column labels are all rendered");
		this.oChart.$().find(".sapSuiteClMCLabelColumn").each(function() {
			assert.notOk(jQuery(this).is(":visible"), "Column label not visible");
		});
	});

	QUnit.test("Chart is rendered with the top labels shown when allowed column labels and width is too small", async function(assert) {
		//Arrange
		this.oChart.getColumns()[0].setValue(123456789);
		this.oFlexBox.setWidth("100px");
		this.oChart.setAllowColumnLabels(true);
		await nextUIUpdate();
		//Act
		//Assert
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels shown");
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the bottom labels shown");
		assert.equal(this.oChart.$().find(".sapSuiteClMCLabelColumn").length, 3, "Column labels are all rendered");
		this.oChart.$().find(".sapSuiteClMCLabelColumn").each(function() {
			assert.notOk(jQuery(this).is(":visible"), "Column label not visible");
		});
	});

	QUnit.test("Columns gets hidden if there is not enough space for them", async function(assert) {
		//Arrange
		for (var i = 0; i < 10; i++) {
			this.oChart.addColumn(new ColumnMicroChartData({value: 10}));
		}
		this.oFlexBox.setWidth("64px");

		var aColumns = this.oChart.getColumns();
		//Act
		await nextUIUpdate();
		//Assert
		for (var j = 0; j < aColumns.length; j++) {
			if (j < 8) {
				assert.ok(aColumns[j].$().is(":visible"), "column is visible");
			} else {
				assert.notOk(aColumns[j].$().is(":visible"), "column is hidden");
			}
		}
	});

	QUnit.module("Responsiveness -- Chart inside a simple div", {
		beforeEach : async function() {
			var $fixture = jQuery("#qunit-fixture");
			$fixture.css("width", "500px");
			$fixture.css("height", "300px");
			this.oChart = new ColumnMicroChart("mCMChart", {size: Size.Responsive}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Chart inside a simple div", function(assert) {
		//Arrange
		// Two pixels subtracted, otherwise there's not enough space for the outline and the chart won't be rendered properly
		var iChartHeightExpected = parseFloat(this.oChart.getParent().oRootNode.getAttribute("style").split(" ")[3]);
		var iChartWidthExpected = parseFloat(this.oChart.getParent().oRootNode.getAttribute("style").split(" ")[1]);
		//Act
		//Assert
		assert.equal(this.oChart.$().height(), iChartHeightExpected, "Chart is rendered with the parent height");
		assert.equal(this.oChart.$().width(), iChartWidthExpected, "Chart is rendered with the parent width");
	});

	QUnit.module("Tooltip behavior", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart();
			this.oModel = new JSONModel({
				size : "M",
				Tooltip : "Custom Tooltip"
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
			items : {
				path : "/data",
				template : new ColumnListItem({
					cells : [new ColumnMicroChart({
						columns : [new ColumnMicroChartData({
							value : 4.20
						})]
					})]
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

	QUnit.module("Execution of functions onAfterRendering", {
		beforeEach: async function() {
			this.oChart = new ColumnMicroChart().placeAt("qunit-fixture");
			await nextUIUpdate();
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
			this.oChart = new ColumnMicroChart();
			this.oChart.setAggregation("tooltip", "ColumnMicroChart");
		},
		afterEach : function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function(assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "ColumnMicroChart",
			type: oRb.getText("ACC_CTR_TYPE_MICROCHART")
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: async function() {
			this.oChart = new ColumnMicroChart("columnMicroChart").placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("No data rendered when no columns given", function(assert) {
		//Arrange
		//Act
		//Assert
		assert.ok(document.getElementById("columnMicroChart"), "Control was rendered");
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

	TestUtils.initSizeModule(ColumnMicroChart, "sapSuiteClMCSize");

	QUnit.module("Allow column labels", {
		beforeEach: async function() {
			this.oChart = new ColumnMicroChart("mCMChart", {
				allowColumnLabels: true,
				leftTopLabel : {
					label : "June 1",
					color : "Good"
				},
				leftBottomLabel : {
					label : "0M",
					color : "Good"
				},
				rightTopLabel : {
					label : "June 30",
					color : "Critical"
				},
				rightBottomLabel : {
					label : "80M",
					color : "Critical"
				},
				columns: [
					{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"},
					{value: 0, displayValue: "nul", color: "Critical"}
				]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Column labels are shown", function(assert) {
		var aColumns = this.oChart.getColumns();

		assert.equal(aColumns[0].$().find(".sapSuiteClMCLabelColumn").text(), "0");
		assert.equal(aColumns[1].$().find(".sapSuiteClMCLabelColumn").text(), "10");
		assert.equal(aColumns[2].$().find(".sapSuiteClMCLabelColumn").text(), "-10");
		assert.equal(aColumns[3].$().find(".sapSuiteClMCLabelColumn").text(), "nul");
	});

	QUnit.test("Basic bottom labels shown if no colum has its label", function(assert) {
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionBtm").is(":visible"));
	});

	QUnit.test("Basic bottom labels if some column has its label", async function(assert) {
		this.oChart.getColumns()[0].setLabel("test");
		await nextUIUpdate();

		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionBtm").is(":visible"));
	});

	QUnit.test("Bottom column labels are shown", async function(assert) {
		var sLabel = "testLabel";
		var aColumns = this.oChart.getColumns();

		aColumns.forEach(function(oColumn) {
			oColumn.setLabel(sLabel);
		});

		await nextUIUpdate();


		var $labels = this.oChart.$().find(".sapSuiteClMCBottomColumnLabel");

		assert.equal($labels.length, aColumns.length, "correct number of labels is rendered");
		$labels.toArray().forEach(function(oLabel) {
			assert.equal(oLabel.textContent, sLabel, "label is correct");
		});
	});



	QUnit.module("Show top/bottom labels", {
		beforeEach: async function() {
			this.oChart = new ColumnMicroChart("mCMChart", {
				allowColumnLabels: true,
				leftTopLabel : {
					label : "June 1",
					color : "Good"
				},
				leftBottomLabel : {
					label : "0M",
					color : "Good"
				},
				rightTopLabel : {
					label : "June 30",
					color : "Critical"
				},
				rightBottomLabel : {
					label : "80M",
					color : "Critical"
				},
				columns: [
					{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"},
					{value: 0, displayValue: "nul", color: "Critical"}
				]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Top labels hidden", function(assert) {
		//Arrange
		//Act
		this.oChart.setShowTopLabels(false);
		var aTopLabels = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels");
		var aBottomLabels = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels");
		//Assert
		assert.ok(aTopLabels.length, 0,  "Top labels not rendered");
		assert.ok(aBottomLabels.length, 2, "Bottom labels rendered");
	});

	QUnit.test("Bottom labels hidden", function(assert) {
		//Arrange
		//Act
		this.oChart.setShowBottomLabels(false);
		var aTopLabels = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels");
		var aBottomLabels = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels");
		//Assert
		assert.ok(aTopLabels.length, 2,  "Top labels rendered");
		assert.ok(aBottomLabels.length, 0, "Bottom labels not rendered");
	});

	QUnit.test("Bottom and top labels hidden", function(assert) {
		//Arrange
		//Act
		this.oChart.setShowBottomLabels(false);
		var aTopLabels = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels");
		var aBottomLabels = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels");
		//Assert
		assert.ok(aTopLabels.length, 2,  "Top labels not rendered");
		assert.ok(aBottomLabels.length, 2, "Bottom labels not rendered");
	});

	QUnit.test("Top labels hidden with allowColumnLabels true", function(assert) {
		//Arrange
		//Act
		this.oChart.setAllowColumnLabels(true);
		this.oChart.setShowTopLabels(false);
		var aTopLabels = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels");
		var aBottomLabels = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels");
		//Assert
		assert.ok(aTopLabels.length, 0,  "Top labels not rendered");
		assert.ok(aBottomLabels.length, 2, "Bottom labels rendered");
	});

});
