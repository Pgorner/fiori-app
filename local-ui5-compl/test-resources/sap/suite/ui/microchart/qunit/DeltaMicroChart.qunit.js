/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/microchart/DeltaMicroChart",
	"sap/m/library",
	"sap/suite/ui/microchart/ComparisonMicroChart",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/ColumnListItem",
	"sap/m/FlexBox",
	"sap/m/MessageToast",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/ui/core/TooltipBase",
	"sap/suite/ui/microchart/library",
	"sap/m/Table",
	"sap/m/Text",
	"./TestUtils",
	"sap/ui/util/Mobile",
	"sap/ui/core/Core",
	"sap/ui/core/Lib",
	"sap/ui/core/Theming"
], function(nextUIUpdate, jQuery, DeltaMicroChart, mobileLibrary, ComparisonMicroChart, JSONModel, Button, ColumnListItem, FlexBox, MessageToast, GenericTile, TileContent, TooltipBase, microchartLibrary, Table, Text, TestUtils, Mobile, Core, CoreLib, Theming) {
	"use strict";

	var Size = mobileLibrary.Size;
	var oRb = CoreLib.getResourceBundleFor("sap.suite.ui.microchart");

	Mobile.init();

	var DeltaMicroChartViewType = microchartLibrary.DeltaMicroChartViewType;

	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.fnSpyReady = sinon.spy(Core, "ready");
			this.fnSpyHandleCoreInitialized = sinon.spy(DeltaMicroChart.prototype, "_handleCoreInitialized");
			this.fnStubAttachThemeApplied = sinon.stub(Theming, "attachApplied").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.fnSpyHandleThemeApplied = sinon.spy(DeltaMicroChart.prototype, "_handleThemeApplied");
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
		var oChart = new DeltaMicroChart();

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
		var oChart = new DeltaMicroChart();

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
		var oChart = new DeltaMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyReady.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core loaded and theme loaded", function(assert) {
		//Act
		var oChart = new DeltaMicroChart();

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
	 * @deprecated Since version 1.61.0
	 */
	QUnit.test("Setting size property to sap.m.Size.Responsive leads to isResponsive === true", async function(assert) {
		//Arrange
		this.oChart = new DeltaMicroChart({
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
		this.oChart = new DeltaMicroChart();
		//Act
		var oResult = this.oChart.setSize(Size.Responsive);
		//Assert
		assert.deepEqual(oResult, this.oChart, "Control instance returned");
	});

	QUnit.test("setSize does nothing in case of same value", function(assert) {
		//Arrange
		this.oChart = new DeltaMicroChart({
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
	 * @deprecated Since version 1.61.0
	 */
	QUnit.test("sap.m.Size.Responsive leads to isResponsive === true", async function(assert) {
		//Arrange
		this.oChart = new DeltaMicroChart({
			size: Size.Responsive
		}).placeAt("qunit-fixture");
		//Act
		await nextUIUpdate();
		//Assert
		assert.ok(this.oChart._isResponsive(), "Chart is in Responsive mode for size Responsive");
	});

	/**
	 * @deprecated Since version 1.61.0
	 */
	QUnit.test("sap.m.Size.Responsive changed to sap.m.Size.L leads to isResponsive === false", async function(assert) {
		//Arrange
		this.oChart = new DeltaMicroChart({
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

	QUnit.module("Calculate chart configuration - sap.suite.ui.microchart.DeltaMicroChart", {
		beforeEach: function() {
			this.oDmc = new DeltaMicroChart({
				value1: 0,
				value2: 0
			});
		},
		afterEach: function() {
			this.oDmc.destroy();
		}
	});

	QUnit.test("calcChartData - empty & equal values", function(assert) {
		var oDimensions = this.oDmc._calcChartData();

		assert.equal(oDimensions.delta.left, true, "The delta bar is on the left.");
		assert.equal(oDimensions.delta.width, 0, "The delta bar width is 0.");
		assert.equal(oDimensions.delta.isFirstStripeUp, false, "The first delta stripe is down.");
		assert.equal(oDimensions.delta.isMax, false, "The delta has not max width.");
		assert.equal(oDimensions.delta.isZero, true, "The both values are 0.");
		assert.equal(oDimensions.delta.isEqual, true, "The both values are equal.");

		assert.equal(oDimensions.bar1.left, true, "The bar1 is on the left.");
		assert.equal(oDimensions.bar1.width, 0, "The bar1 width is 0.");
		assert.equal(oDimensions.bar1.isSmaller, false, "The bar1 is not smaller.");

		assert.equal(oDimensions.bar2.left, true, "The bar2 is on the left.");
		assert.equal(oDimensions.bar2.width, 0, "The bar2 width is 0.");
		assert.equal(oDimensions.bar2.isSmaller, false, "The bar2 is not smaller.");
	});

	QUnit.test("calcChartData - positive values", function(assert) {
		this.oDmc.setValue1(100);
		this.oDmc.setValue2(200);

		var oDimensions = this.oDmc._calcChartData();

		assert.equal(oDimensions.delta.left, false, "The delta bar is on the right.");
		assert.equal(oDimensions.delta.width, 50, "The delta bar width is 50%.");
		assert.equal(oDimensions.delta.isFirstStripeUp, true, "The first delta stripe is up.");
		assert.equal(oDimensions.delta.isMax, false, "The delta has not max width.");
		assert.equal(oDimensions.delta.isZero, false, "The both values are 0.");
		assert.equal(oDimensions.delta.isEqual, false, "The both values are not equal.");

		assert.equal(oDimensions.bar1.left, true, "The bar1 is on the left.");
		assert.equal(oDimensions.bar1.width, 50, "The bar1 width is 50%.");
		assert.equal(oDimensions.bar1.isSmaller, true, "The bar1 is smaller.");

		assert.equal(oDimensions.bar2.left, true, "The bar2 is on the left.");
		assert.equal(oDimensions.bar2.width, 100, "The bar2 width is 100%.");
		assert.equal(oDimensions.bar2.isSmaller, false, "The bar2 is not smaller.");
	});

	QUnit.test("calcChartData - negative values", function(assert) {
		this.oDmc.setValue1(-100);
		this.oDmc.setValue2(-200);

		var oDimensions = this.oDmc._calcChartData();

		assert.equal(oDimensions.delta.left, true, "The delta bar is on the left.");
		assert.equal(oDimensions.delta.width, 50, "The delta bar width is 50%.");
		assert.equal(oDimensions.delta.isFirstStripeUp, false, "The first delta stripe is down.");
		assert.equal(oDimensions.delta.isMax, false, "The delta has not max width.");
		assert.equal(oDimensions.delta.isZero, false, "The both values are 0.");
		assert.equal(oDimensions.delta.isEqual, false, "The both values are not equal.");

		assert.equal(oDimensions.bar1.left, false, "The bar1 is on the right.");
		assert.equal(oDimensions.bar1.width, 50, "The bar1 width is 50%.");
		assert.equal(oDimensions.bar1.isSmaller, true, "The bar1 is smaller.");

		assert.equal(oDimensions.bar2.left, false, "The bar2 is on the right.");
		assert.equal(oDimensions.bar2.width, 100, "The bar2 width is 100%.");
		assert.equal(oDimensions.bar2.isSmaller, false, "The bar2 is not smaller.");
	});

	QUnit.test("calcChartData - negative values", function(assert) {
		this.oDmc.setValue1(-100);
		this.oDmc.setValue2(-200);

		var oDimensions = this.oDmc._calcChartData();

		assert.equal(oDimensions.delta.left, true, "The delta bar is on the left.");
		assert.equal(oDimensions.delta.width, 50, "The delta bar width is 50%.");
		assert.equal(oDimensions.delta.isFirstStripeUp, false, "The first delta stripe is down.");
		assert.equal(oDimensions.delta.isMax, false, "The delta has not max width.");
		assert.equal(oDimensions.delta.isZero, false, "The both values are 0.");
		assert.equal(oDimensions.delta.isEqual, false, "The both values are not equal.");

		assert.equal(oDimensions.bar1.left, false, "The bar1 is on the right.");
		assert.equal(oDimensions.bar1.width, 50, "The bar1 width is 50%.");
		assert.equal(oDimensions.bar1.isSmaller, true, "The bar1 is smaller.");

		assert.equal(oDimensions.bar2.left, false, "The bar2 is on the right.");
		assert.equal(oDimensions.bar2.width, 100, "The bar2 width is 100%.");
		assert.equal(oDimensions.bar2.isSmaller, false, "The bar2 is not smaller.");
	});

	QUnit.test("calcChartData - mixed values", function(assert) {
		this.oDmc.setValue1(50);
		this.oDmc.setValue2(-200);

		var oDimensions = this.oDmc._calcChartData();

		assert.equal(oDimensions.delta.left, false, "The delta bar is on the right.");
		assert.equal(oDimensions.delta.width, 100, "The delta bar width is 100%.");
		assert.equal(oDimensions.delta.isFirstStripeUp, false, "The first delta stripe is down.");
		assert.equal(oDimensions.delta.isMax, true, "The delta has max width.");
		assert.equal(oDimensions.delta.isZero, false, "The both values are 0.");
		assert.equal(oDimensions.delta.isEqual, false, "The both values are not equal.");

		assert.equal(oDimensions.bar1.left, false, "The bar1 is on the right.");
		assert.equal(oDimensions.bar1.width, 20, "The bar1 width is 50%.");
		assert.equal(oDimensions.bar1.isSmaller, true, "The bar1 is smaller.");

		assert.equal(oDimensions.bar2.left, true, "The bar2 is on the left.");
		assert.equal(oDimensions.bar2.width, 80, "The bar2 width is 80%.");
		assert.equal(oDimensions.bar2.isSmaller, false, "The bar2 is not smaller.");
	});

	QUnit.test("Test digits after decimal point has been rendered", function(assert) {
		var iDigitsAfterDecimalPoint = this.oDmc._digitsAfterDecimalPoint();
		assert.equal(iDigitsAfterDecimalPoint, 0, "digits after decimal point were rendered");
	});

	QUnit.module("Rendering - sap.suite.ui.microchart.DeltaMicroChart", {
		beforeEach: async function() {
			this.oDmc = new DeltaMicroChart("dmc01", {
				value1: 5,
				value2: 20,
				title1: "title1",
				title2: "title2",
				press: function(oEvent) {
					MessageToast.show("The delta micro chart is pressed.");
				}
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oDmc.destroy();
		}
	});

	QUnit.test("Test labels", function(assert) {
		assert.equal(this.oDmc.$().find(".sapSuiteDMCPositionTop").text(), "title1", "title1 was rendered");
		assert.equal(this.oDmc.$().find(".sapSuiteDMCPositionBtm").text(), "title2", "title2 was rendered");
		assert.equal(this.oDmc.$("value1").text(), "5", "value1 was rendered");
		assert.equal(this.oDmc.$("value2").text(), "20", "value2 was rendered");
		assert.equal(this.oDmc.$("delta").text(), "15", "delta was rendered");
	});

	QUnit.test("Correct classes are used for zero values", async function(assert) {
		// Arrange
		this.oDmc.setValue2(0);
		// Act
		await nextUIUpdate();
		var $UniqueNonzeroBar = jQuery(this.oDmc.$().find('.sapSuiteDMCBar1')),
			$UniqueZeroBar = jQuery(this.oDmc.$().find('.sapSuiteDMCBar2'));
		// Assert
		assert.ok($UniqueNonzeroBar.hasClass("sapSuiteDMCBarUniqueNonzero"), "Unique non zero bar has correct class");
		assert.ok($UniqueZeroBar.hasClass("sapSuiteDMCBarZeroWidth"), "Zero bar has correct class");
	});

	QUnit.test("Test Aria-label and Aria-labelledBy superseding", async function(assert) {
		assert.ok(this.oDmc.$().attr("aria-label"), "By default, the aria-label attribute is rendered");
		assert.equal(this.oDmc.$().attr("aria-labelledBy"), null, "By default, the aria-labelledBy attribute is not rendered");

		this.oDmc.addAriaLabelledBy(new Text());
		await nextUIUpdate();
		assert.equal(this.oDmc.$().attr("aria-label"), null, "When first Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oDmc.$().attr("aria-labelledBy").split(" ").length, 1, "When first Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and cointains 1 ID");

		this.oDmc.addAriaLabelledBy(new Button());
		await nextUIUpdate();
		assert.equal(this.oDmc.$().attr("aria-label"), null, "When second Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oDmc.$().attr("aria-labelledBy").split(" ").length, 2, "When second Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and contains 2 IDs");

		this.oDmc.removeAllAriaLabelledBy();
		await nextUIUpdate();
		assert.ok(this.oDmc.$().attr("aria-label"), "When removed all ariaLabelledBy, the aria-label attribute is rendered");
		assert.equal(this.oDmc.$().attr("aria-labelledBy"), null, "When removed all ariaLabelledBy, the aria-labelledBy attribute is not rendered");
	});

	QUnit.test("Width property is taken into account", async function(assert) {
		// Arrange
		this.oDmc.setWidth("500px");
		// Act
		await nextUIUpdate();
		// Assert
		assert.equal(this.oDmc.$().width(), 500, "Correct width is set");
	});

	QUnit.module("Title attribute is added and removed when mouse enters and leaves", {
		beforeEach: async function() {
			this.oDmc = new DeltaMicroChart("dmc", {
				value1: 5,
				value2: 20,
				title1: "title1",
				title2: "title2"
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oDmc.destroy();
			this.oDmc = null;
		}
	});

	QUnit.test("Tooltip is showed when mouse enters chart", async function(assert) {
		// Arrange
		this.oDmc.setTooltip("This is dmc tooltip");
		await nextUIUpdate();
		// Act
		this.oDmc.$().trigger("mouseenter");
		// Assert
		assert.equal("This is dmc tooltip", this.oDmc.$().attr("title"), "The title attribute is added when mouse enters the chart");
	});

	QUnit.test("Tooltip is removed when mouse leaves chart", async function(assert) {
		// Arrange
		this.oDmc.setTooltip("This is dmc tooltip");
		await nextUIUpdate();
		// Act
		this.oDmc.$().trigger("mouseenter");
		this.oDmc.$().trigger("mouseleave");
		// Assert
		assert.equal(null, this.oDmc.$().attr("title"), "The title attribute is removed when mouse leaves the chart");
	});

	/**
	 * @deprecated Since version 1.61.0
	 */
	QUnit.module("Responsiveness - sap.suite.ui.microchart.DeltaMicroChart", {
		beforeEach: async function() {
			this.oDmc = new DeltaMicroChart("dmc01", {
				value1: 5,
				value2: 20,
				title1: "title1",
				title2: "title2",
				size: Size.Responsive,
				press: function(oEvent) {
					MessageToast.show("The delta micro chart is pressed.");
				}
			});
			this._oFB = new FlexBox("cc-fb", {
				items: [this.oDmc],
				renderType: "Bare"
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oDmc.destroy();
			this._oFB.destroy();
		}
	});

	QUnit.test("Vertical responsiveness: vertically centered at large hight", async function(assert) {
		//Arrange
		this._oFB.setWidth("12rem");
		this._oFB.setHeight("8.5rem");
		await nextUIUpdate();
		var emptySpaceTotalHeight = this.oDmc.$().height() - this.oDmc.$().find(".sapSuiteDMCVerticalAlignmentContainer").height();
		var internalRelativeTopShiftOfChart = this.oDmc.$().find(".sapSuiteDMCVerticalAlignmentContainer")[0].getBoundingClientRect().top - this.oDmc.$()[0].getBoundingClientRect().top;
		var internalRelativeBottomShiftOfChart = this.oDmc.$()[0].getBoundingClientRect().bottom - this.oDmc.$().find(".sapSuiteDMCVerticalAlignmentContainer")[0].getBoundingClientRect().bottom;

		//Assert
		assert.equal(internalRelativeTopShiftOfChart > 0 && internalRelativeBottomShiftOfChart > 0 && emptySpaceTotalHeight > 0, true, "Empty space exists, can proceed with ");
		assert.equal(Math.round(emptySpaceTotalHeight), Math.round(internalRelativeTopShiftOfChart * 2), "Offset from top is equal to half of empty space");
		assert.equal(Math.round(emptySpaceTotalHeight), Math.round(internalRelativeBottomShiftOfChart * 2), "Offset from bottom is equal to half of empty space");
	});

	QUnit.test("Vertical responsiveness: decreasing fonts", async function(assert) {
		//Arrange
		this._oFB.setWidth("12rem");
		this._oFB.setHeight("6.5rem");
		await nextUIUpdate();
		var mediumFont = parseFloat(this.oDmc.$().find(".sapSuiteDMCLabel ").css("font-size"));
		this._oFB.setWidth("10rem");
		this._oFB.setHeight("4.5rem");
		await nextUIUpdate();
		var smallFont = parseFloat(this.oDmc.$().find(".sapSuiteDMCLabel ").css("font-size"));

		//Assert
		assert.ok(this.oDmc.$().hasClass("sapSuiteDMCLookM"), "Added CSS class that commands to use small fonts");
		assert.ok(smallFont < mediumFont, "Font size decrease had actually occured");
	});

	QUnit.test("All labels visible when width and height big enough", async function(assert) {
		// Arrange
		this._oFB.setHeight("150px");
		this._oFB.setWidth("97px");
		// Act
		await nextUIUpdate();
		// Assert
		var bVisible = jQuery(".sapSuiteDMCLabel").toArray().every(function(oLabel){
			return jQuery(oLabel).is(":visible");
		});
		assert.ok(bVisible, "all labels are visible");
	});

	QUnit.test("All labels hidden when width small", async function(assert) {
		// Arrange
		this._oFB.setHeight("150px");
		this._oFB.setWidth("96px");
		// Act
		await nextUIUpdate();
		// Assert
		var bNotVisible = jQuery(".sapSuiteDMCLabel").toArray().every(function(oLabel){
			return !(jQuery(oLabel).is(":visible"));
		});
		assert.ok(bNotVisible, "all labels are hidden");
	});

	QUnit.test("All labels hidden when height small", async function(assert) {
		// Arrange
		this._oFB.setHeight("18px");
		this._oFB.setWidth("97px");
		// Act
		await nextUIUpdate();
		// Assert
		var bNotVisible = jQuery(".sapSuiteDMCLabel").toArray().every(function(oLabel){
			return !(jQuery(oLabel).is(":visible"));
		});
		assert.ok(bNotVisible, "all labels are hidden");
	});

	QUnit.test("Only delta label shown when height under 56px", async function(assert) {
		// Arrange
		this._oFB.setHeight("55px");
		this._oFB.setWidth("97px");
		// Act
		await nextUIUpdate();
		// Assert
		var bNotVisible = jQuery(".sapSuiteDMCLabel").toArray().filter(function(oLabel){
			return !(jQuery(oLabel).hasClass("sapSuiteDMCDelta"));
		}).every(function(oLabel){
			return !(jQuery(oLabel).is(":visible"));
		});

		assert.ok(bNotVisible, "labels are hidden");
		assert.ok(jQuery(".sapSuiteDMCDelta").is(":visible"), "delta label is shown");
	});

	QUnit.test("Right titles are hidden when truncated", async function(assert) {
		// Arrange
		this.oDmc.setDisplayValue1("very very long title");
		this._oFB.setHeight("100px");
		this._oFB.setWidth("140px");
		// Act
		await nextUIUpdate();
		// Assert
		assert.notOk(jQuery(".sapSuiteDMCLbls").is(":visible"), "right label hidden");
	});

	QUnit.test("Left spacer is displayed higher then XS in Wide view", async function(assert) {
		// Arrange
		this.oDmc.setView(DeltaMicroChartViewType.Wide);
		this.oDmc.setWidth("100px");
		this.oDmc.setHeight("70px");
		// Act
		await nextUIUpdate();

		// Assert
		assert.ok(this.oDmc.$().find(".sapSuiteDMCSpacerLeft").is(":visible"), "left spacer visible");
	});

	QUnit.test("Left spacer is hidden smaller then XS in Wide view", async function(assert) {
		// Arrange
		this.oDmc.setView(DeltaMicroChartViewType.Wide);
		this.oDmc.setWidth("100px");
		this.oDmc.setHeight("40px");
		// Act
		await nextUIUpdate();

		// Assert
		assert.notOk(this.oDmc.$().find(".sapSuiteDMCSpacerLeft").is(":visible"), "left spacer hidden");
	});

	QUnit.module("Tooltip behavior", {
		beforeEach: function() {
			this.oChart = new ComparisonMicroChart();
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
		assert.deepEqual(this.oChart.getTooltip(), "((AltText))", "Default value set correctly");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, tooltip is not bound", async function(assert) {
		this.oChart.setModel(this.oModel);
		await nextUIUpdate();

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
					cells : [new DeltaMicroChart({
						value1: 4.20,
						value2: 23,
						title1: "Value1",
						title2: "Value2",
						displayValue1: "Dispaly value 1",
						displayValue2: "Dispaly value 2"
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
			this.oChart = new DeltaMicroChart().placeAt("qunit-fixture");
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
			this.oChart = new DeltaMicroChart();
			this.oChart.setAggregation("tooltip", "DeltaMicroChart");
		},
		afterEach : function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function(assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "DeltaMicroChart",
			type: oRb.getText("ACC_CTR_TYPE_MICROCHART")
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: async function() {
			this.oChart = new DeltaMicroChart("deltaMicroChart").placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("No data rendered when no value given", function(assert) {
		assert.ok(document.getElementById("deltaMicroChart"), "Control was rendered");
		var a$NoDataElement = this.oChart.$().find(".sapSuiteUiMicroChartNoData");
		assert.equal(a$NoDataElement.length, 1, "No data placeholder shold be rendered");
	});

	QUnit.test("No data in aria-label", function(assert) {
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

	QUnit.test("Width property is taken into account", async function(assert) {
		// Arrange
		this.oChart.setWidth("500px");
		// Act
		await nextUIUpdate();
		// Assert
		assert.equal(this.oChart.$().width(), 500, "Correct width is set");
	});

	QUnit.module("View types", {
		beforeEach : async function() {
			this.oChart = new DeltaMicroChart({
				value1: 5,
				value2: 20,
				title1: "title1",
				title2: "title2"
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach : function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Default view is Normal", function(assert) {
		assert.equal(this.oChart.getView(), DeltaMicroChartViewType.Normal, "Default view is normal");
	});

	QUnit.test("Wide view", async function(assert) {
		// Arrange
		this.oChart.setView(DeltaMicroChartViewType.Wide);
		// Act
		await nextUIUpdate();
		// Assert
		assert.ok(this.oChart.$().hasClass("sapSuiteDMCWideMode"), "Wide view class is set");
	});

	QUnit.test("Responsive view", async function(assert) {
		this.oChart.setView(DeltaMicroChartViewType.Responsive);
		assert.notOk(this.oChart.$().hasClass("sapSuiteDMCWideMode"), "Wide view class is not set for small width");

		this.oChart.setWidth("13rem");
		await nextUIUpdate();
		assert.ok(this.oChart.$().hasClass("sapSuiteDMCWideMode"), "Wide view class is set for big width");
	});

	QUnit.module("Minimum sizes of bars", {
		beforeEach : async function() {
			this.oChart = new DeltaMicroChart({
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach : function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Value bars has to be at least 4px wide", async function(assert) {
		this.oChart.setWidth("150px");
		this.oChart.setValue1(100);
		this.oChart.setValue2(1);
		await nextUIUpdate();
		assert.equal(jQuery(".sapSuiteDMCBarInternal")[1].offsetWidth, 4);

		this.oChart.setValue1(1);
		this.oChart.setValue2(100);
		await nextUIUpdate();
		assert.equal(jQuery(".sapSuiteDMCBarInternal")[0].offsetWidth, 4);

		this.oChart.setValue1(5000);
		this.oChart.setValue2(-5);
		await nextUIUpdate();
		assert.ok(jQuery(".sapSuiteDMCBarInternal")[0].offsetWidth < 150);
	});

	QUnit.test("Delta bar has to be at least 4px wide", async function(assert) {
		this.oChart.setValue1(40);
		this.oChart.setValue2(39);
		await nextUIUpdate();
		assert.equal(jQuery(".sapSuiteDMCBarDeltaInt")[0].offsetWidth, 4);

		this.oChart.setValue1(39);
		this.oChart.setValue2(40);
		await nextUIUpdate();
		assert.equal(jQuery(".sapSuiteDMCBarDeltaInt")[0].offsetWidth, 4);

		this.oChart.setValue1(-90);
		this.oChart.setValue2(-89);
		await nextUIUpdate();
		assert.equal(jQuery(".sapSuiteDMCBarDeltaInt")[0].offsetWidth, 4);

		this.oChart.setValue1(-89);
		this.oChart.setValue2(-90);
		await nextUIUpdate();
		assert.equal(jQuery(".sapSuiteDMCBarDeltaInt")[0].offsetWidth, 4);
	});

	TestUtils.initSizeModule(DeltaMicroChart, "sapSuiteDMCSize");
});

