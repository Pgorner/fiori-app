/* eslint-disable no-extra-bind */
/*global QUnit, sinon */
sap.ui.define([
	"sap/gantt/simple/RenderUtils",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/UtilizationLineChart",
	"sap/gantt/simple/UtilizationDimension",
	"sap/gantt/simple/UtilizationPeriod",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/simple/BaseShape",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseLine",
	"sap/gantt/simple/shapes/Task",
	"sap/ui/core/Core",
	"sap/gantt/library",
	"sap/base/Log",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/BaseConditionalShape",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/MultiActivityGroup",
	"sap/gantt/simple/MultiActivityRowSettings",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Theming",
	"sap/ui/core/Lib",
	"sap/ui/core/RenderManager",
	"sap/gantt/simple/test/nextUIUpdate"
], function(
	RenderUtils,
	GanttRowSettings,
	GanttQUnitUtils,
	BaseGroup,
	UtilizationLineChart,
	UtilizationDimension,
	UtilizationPeriod,
	BaseChevron,
	BaseShape,
	BaseText,
	BaseRectangle,
	BaseLine,
	Task,
	Core,
	library,
	Log,
	GanttUtils,
	Relationship,
	BaseConditionalShape,
	QUnitUtils, MultiActivityGroup,
	MultiActivityRowSettings,
	GanttChartContainer,
	ContainerToolbar,
	BaseCalendar,
	GanttChartConfigurationUtils,
	Theming,
	Lib,
	RenderManager,
	nextUIUpdate
	) {
	"use strict";

	var verticalTextAlignment = library.simple.verticalTextAlignment;
	var horizontalTextAlignment = library.simple.horizontalTextAlignment;
	var ShapeAlignment = library.simple.shapes.ShapeAlignment;

	QUnit.module("RenderUtils.pushOrUnshift");

	QUnit.test("Item is prepended at the beginning of the given array when bUnshift is set to true ", function (assert) {
		var aArray = ["b", "c"];
		var aExpectedArray = ["a", "b", "c"];

		RenderUtils.pushOrUnshift(aArray, "a", true);

		assert.deepEqual(aArray, aExpectedArray, "Item was inserted at the beginning of the array.");
	});

	QUnit.test("Item is prepended at the end of the given array when bUnshift is undefined", function (assert) {
		var aArray = ["b", "c"];
		var aExpectedArray = ["b", "c", "d"];

		RenderUtils.pushOrUnshift(aArray, "d", undefined);

		assert.deepEqual(aArray, aExpectedArray, "Item was inserted at the end of the array.");
	});

	QUnit.test("Item is prepended at the end of the given array when bUnshift is set to false", function (assert) {
		var aArray = ["b", "c"];
		var aExpectedArray = ["b", "c", "d"];
		RenderUtils.pushOrUnshift(aArray, "d", false);

		assert.deepEqual(aArray, aExpectedArray, "Item was inserted at the end of the array.");
	});

	var fn1, fn2, fn3, fn4;
	QUnit.module("RenderUtils.createOrderedListOfRenderFunctions", {
		before: function() {
			fn1 = function(){};
			fn2 = function(){};
			fn3 = function(){};
			fn4 = function(){};
		},
		after: function() {
			fn1 = undefined;
			fn2 = undefined;
			fn3 = undefined;
			fn4 = undefined;
		}
	});

	QUnit.test("When bUnshift is undefined, then the item is added at the end of the array", function(assert) {
		var aTemplateForOrderedRenderFunctions = [
			{fnCallback: fn1},
			{fnCallback: fn2}
		];
		var aExpectedOrderedList = [
			fn1, fn2
		];

		var aOrderedList = RenderUtils.createOrderedListOfRenderFunctionsFromTemplate(
			aTemplateForOrderedRenderFunctions
		);

		assert.deepEqual(aOrderedList, aExpectedOrderedList, "The item was put at the end of the array");
	});

	QUnit.test("When bUnshift is set to true, then the item is put at the beginning of the array", function(assert) {
		var aTemplateForOrderedRenderFunctions = [
			{fnCallback: fn1},
			{fnCallback: fn2, bUnshift: true}
		];
		var aExpectedOrderedList = [
			fn2, fn1
		];

		var aOrderedList = RenderUtils.createOrderedListOfRenderFunctionsFromTemplate(
			aTemplateForOrderedRenderFunctions
		);

		assert.deepEqual(aOrderedList, aExpectedOrderedList, "The item was put at the beginning of the array");
	});

	QUnit.test("When bUnshift is true, then the last item is put at the beginning of the array", function(assert) {
		var aTemplateForOrderedRenderFunctions = [
			{fnCallback: fn1},
			{fnCallback: fn2},
			{fnCallback: fn3},
			{fnCallback: fn4, bUnshift: true}
		];
		var aExpectedOrderedList = [
			fn4, fn1, fn2, fn3
		];

		var aOrderedList = RenderUtils.createOrderedListOfRenderFunctionsFromTemplate(
			aTemplateForOrderedRenderFunctions
		);

		assert.deepEqual(aOrderedList, aExpectedOrderedList, "The last item was put at the beginning of the array");
	});

	QUnit.test("When bUnshift set to true for the fn2 and fn4, then fn2 will be second and fn4 will be the first in the ordered array.", function(assert) {
		var aTemplateForOrderedRenderFunctions = [
			{fnCallback: fn1},
			{fnCallback: fn2, bUnshift: true},
			{fnCallback: fn3},
			{fnCallback: fn4, bUnshift: true}
		];
		var aExpectedOrderedList = [
			fn4, fn2, fn1, fn3
		];

		var aOrderedList = RenderUtils.createOrderedListOfRenderFunctionsFromTemplate(
			aTemplateForOrderedRenderFunctions
		);

		assert.deepEqual(aOrderedList, aExpectedOrderedList, "List of functions was ordered according to the given template");
	});

	var ProjectUtilization = BaseGroup.extend("sap.gantt.simple.test.ProjectUtilization", {
		metadata: {
			aggregations: {
				utilizationLine: {
					type: "sap.gantt.simple.UtilizationLineChart",
					multiple: false,
					sapGanttOrder: 1
				},
				chevron: {
					type: "sap.gantt.simple.BaseChevron",
					multiple: false,
					sapGanttLazy: true
				}
			}
		}
	});

	QUnit.module("RenderUtils.setSpecialProperties", {
		beforeEach: function() {
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new ProjectUtilization({
						utilizationLine: new UtilizationLineChart({
							dimensions: new UtilizationDimension({
								periods: new UtilizationPeriod()
							})
						}),
						chevron: new BaseChevron()
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			if (this.oGantt.getParent().isA("sap.gantt.simple.GanttChartContainer")) {
				this.oGantt.getParent().destroy();
			}
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("When main row shape is an instance of utilization chart reduce height by a pixel ", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var aRowStates = this.oGantt.getSyncedControl().getRowStates();
			var oRowSetting = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var mPosition = RenderUtils.calcRowDomPosition(oRowSetting, aRowStates);
			var oShape = oRowSetting.getShapes1()[0];
			assert.deepEqual(mPosition.rowHeight - 1 , oShape._iBaseRowHeight, "Main row height reduced by a pixel");
		}.bind(this));
	});

	QUnit.test("Test Bid Eye On UtiliaztionChart", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			var oHorizonRange = {};
			oHorizonRange = this.oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
			var fnError = sinon.spy(Log, "error");
			var aErrors = fnError.args.filter(function(arg){
				return arg[0].indexOf("oShape.getCountInBirdEye is not a function") == 0;
			});
			assert.equal(aErrors.length, 0, "Error was not logged so far");
			assert.equal(oHorizonRange.startTime, undefined, "Horizon Range StartDate has not been set.");
			assert.equal(oHorizonRange.endTime, undefined, "Horizon Range EndDate has not been set.");
			done();
		}.bind(this));
	});

	QUnit.test("Test find and select on gantt chart with time continuous shapes - UtilizationChart", function(assert) {
		var done = assert.async();

		var oResourceBundle = Lib.getResourceBundleFor("sap.gantt");
		var oGanttContainer = new GanttChartContainer({
			toolbar: new ContainerToolbar({
				showSearchButton: true,
				content: [
					new sap.m.Text({
						text: "This is gantt toolbar--"
					})
				]
			}),
			ganttCharts: [this.oGantt]
		});
		oGanttContainer.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oToolbar = oGanttContainer.getToolbar();
			assert.equal(this.oGantt._bTimeContinuousShapes, null, "Time continuous shape flag is null by default");
			this.oGantt.getParent().attachEvent("customGanttSearchResult", function (oEvent) {
				assert.equal(this.oGantt._bTimeContinuousShapes, true, "Time continuous shape flag is set to true");
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), oResourceBundle.getText("GNT_EMPTY_RESULT_INFO_TOOLBAR"), "No results found");
				done();
			}.bind(this));
			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("A");
			oToolbar._searchFlexBox.getItems()[0].fireSearch();
		}.bind(this));
	});

	QUnit.module("RenderUtils.renderElementTitle", {
		beforeEach: function() {
			this.sText = "abcdefg1234567890";
			this.oText = new BaseText({
				x: 100
			});
			this.oShape = new BaseShape({
				title: this.sText,
				horizontalTextAlignment: horizontalTextAlignment.Start,
				verticallTextAlignment: verticalTextAlignment.Center,
				textRepetition: false
			});
			this.oRectangle = new BaseRectangle({
				width: 50
			});
			this.mTextSettings = {
				title: "",
				textAnchor: "",
				verticallTextAlignment: "",
				textRepetition: false,
				fontFamily: "",
				fontSize: 0,
				fontWeight: ""
			};
			this.oRm = new RenderManager();
			this.oTitle = new BaseText(this.mTextSettings);
			this.oTitle.addStyleClass("sapGanttTextNoPointerEvents");
			this.oTitle.setProperty("childElement", true, true);
		},
		afterEach: async function() {
			this.sText = null;
			this.oText = null;
			this.oShape = null;
			this.oRectangle = null;
			this.mTextSettings = null;
			this.oRm = null;
			this.oTitle = null;
			GanttChartConfigurationUtils.setRTL(false);
			await nextUIUpdate();
		}
	});

	QUnit.test("Expect render title to use the base text element creator", function (assert) {
		var fTitleCreator = function(mTextSettings) {
			assert.strictEqual(mTextSettings.text, this.sText, "Text settings has correct text");
			return new BaseText(mTextSettings);
		}.bind(this);

		var fTitleCreatorSpy = sinon.spy(fTitleCreator);
		this.oRectangle.setTitle(this.sText);

		RenderUtils.renderElementTitle(this.oRm, this.oRectangle, fTitleCreatorSpy);

		assert.ok(fTitleCreatorSpy.called, "Title creator called");
		assert.ok(fTitleCreatorSpy.returnValues[0].hasStyleClass("sapGanttTextNoPointerEvents"), "Expected creator instance has sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Expect render calendar title to use the base text element creator", function (assert) {
		var fTitleCreator = function(mTextSettings) {
			assert.strictEqual(mTextSettings.text, this.sText, "Text settings has correct text");
			return new BaseText(mTextSettings);
		}.bind(this);

		var fTitleCreatorSpy = sinon.spy(fTitleCreator);
		var oNode = {
			title: this.sText,
			baseCalender: new BaseCalendar({})
		};
		var oIt = {};

		RenderUtils.renderCalenderTitle(this.oRm, oNode, oIt, fTitleCreatorSpy);

		assert.ok(fTitleCreatorSpy.called, "Title creator called");
		assert.ok(fTitleCreatorSpy.returnValues[0].hasStyleClass("sapGanttTextNoPointerEvents"), "Expected creator instance has sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is false and horizontalTextAlignment is Start", async function (assert) {
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		GanttChartConfigurationUtils.setRTL(false);
		await nextUIUpdate();
		var iCornerPaddingPixel = 2;
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(102, this.oText.getX() + iCornerPaddingPixel, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is Start");
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is false and horizontalTextAlignment is End", async function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.End;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		GanttChartConfigurationUtils.setRTL(false);
		await nextUIUpdate();
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(148, this.oText.getX() + this.oRectangle.getWidth() - 2, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is End" );
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is false and horizontalTextAlignment is Middle", async function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.Middle;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		GanttChartConfigurationUtils.setRTL(false);
		await nextUIUpdate();
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(125, this.oText.getX() + this.oRectangle.getWidth() / 2, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is End" );
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});


	QUnit.test("Font family for the title - default", function (assert) {
		assert.equal(this.oShape.getFontFamily(), "Arial", "Default font-family for the title is Arial");
	});

	QUnit.test("Set font family for the title", function (assert) {
		this.oShape.setFontFamily("SAP-icons");
		this.mTextSettings.fontFamily = this.oShape.getFontFamily();
		assert.equal(this.mTextSettings.fontFamily, "SAP-icons", "SAP-icons font-family for the title is set");
	});

	QUnit.test("Font weight for the title - default", function (assert) {
		assert.equal(this.oShape.getFontWeight(), "normal", "Default font-weight for the title is Normal");
	});

	QUnit.test("Set font weight for the title", function (assert) {
		this.oShape.setFontWeight("bold");
		this.mTextSettings.fontWeight = this.oShape.getFontWeight();
		assert.equal(this.mTextSettings.fontWeight, "bold", "Bold font-weight for the title is set");
	});

	QUnit.test("Font size for the title - default", function (assert) {
		assert.equal(this.oShape.getFontSize(), 13, "Default font-size for the title is 13px");
	});

	QUnit.test("Set font size for the title", function (assert) {
		this.oShape.setFontSize(10);
		this.mTextSettings.fontSize = this.oShape.getFontSize();
		assert.equal(this.mTextSettings.fontSize, 10, "Updated font-size for the title is set");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is false and horizontalTextAlignment is Dynamic", async function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.Dynamic;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		GanttChartConfigurationUtils.setRTL(false);
		await nextUIUpdate();
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(148, this.oText.getX() + this.oRectangle.getWidth() - 2, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is Dynamic");
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Test Dynamic Text Movement on horizontal scroll", function (assert) {
       var done = assert.async();
       this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
           rowId: "{Id}",
           shapes1: [
               new BaseRectangle({
                   shapeId: "{Id}",
                   time: "{StartDate}",
                   endTime: "{EndDate}",
                   title: "{Name}",
                   fill: "#008FD3",
                   height: 15,
                   selectable: true,
                   alignShape: ShapeAlignment.Top,
                   verticalTextAlignment: verticalTextAlignment.Top,
                   horizontalTextAlignment: horizontalTextAlignment.Start
               })
           ]
       }));
	   var sTestContainerWidth = document.getElementById("qunit-fixture").style.width;
	   document.getElementById("qunit-fixture").style.width = "1920px";
       this.oGantt.placeAt("qunit-fixture");
       return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
           setTimeout(function(){
               var oShape = this.oGantt.getTable().getRows()[0].getAggregation('_settings').getShapes1()[0];
               var oTextXPos = document.getElementById(oShape.getId()).nextSibling.getAttribute('x');
               var $hsb = this.oGantt.getDomRef("hsb");
               var scrollLeft = $hsb.scrollLeft;
               $hsb.scrollTo(scrollLeft + 50, 0);
               return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
                   setTimeout(function(){
                       var oTextXPosNew = document.getElementById(oShape.getId()).nextSibling.getAttribute('x');
                       assert.strictEqual(Number(oTextXPos).toFixed(2), Number(oTextXPosNew).toFixed(2), "Text Does't Moves with scroll when horizontalTextAligment is set to Start");
                       this.oGantt.getInnerGantt().attachEventOnce("ganttReady", function () {
                           var oTextXPosDynamic = document.getElementById(oShape.getId()).nextSibling.getAttribute('x');
                           assert.ok(Number(oTextXPos).toFixed(2) !== Number(oTextXPosDynamic).toFixed(2), "Text Moves with scroll when horizontalTextAligment is set to Dynamic");
                           done();
						   document.getElementById("qunit-fixture").style.width = sTestContainerWidth;
                           this.oGantt.destroy();
                       }.bind(this));
                       this.oGantt.getTable().getRows()[0].getAggregation('_settings').getShapes1()[0].setHorizontalTextAlignment('Dynamic');
                   }.bind(this), 500);
               }.bind(this));
           }.bind(this), 500);
       }.bind(this));
   });

	QUnit.module("RenderUtils.setVerticalAlignment", {
		beforeEach: function() {
			var oStartDate = new Date();
			var oEndDate = new Date();
			oEndDate.setDate(oStartDate.getDate() + 10);
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new BaseRectangle({
						title: "row01",
						time: oStartDate,
						endTime: oEndDate
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
        },
        afterEach: function() {
			this.oGantt.destroy();
        }
	});

	QUnit.test("Validate y coordinate when verticalTextAlignment is Top", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			this.oBaseRectangle = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			var oBaseRectangleDom = this.oBaseRectangle.getDomRef().getBoundingClientRect();
			this.oBaseRectangle.setVerticalTextAlignment("Top");
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				this.oText = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getDomRef().querySelector("g > text").getBoundingClientRect();
				var iTextY =  Math.round(this.oText.y);
				var iTextYs = [iTextY, iTextY + 1];
				assert.ok((iTextYs.indexOf(Math.round(oBaseRectangleDom.y)) !== -1), "Y coordinate is valid when verticalTextAlignment is Top");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Validate y coordinate when verticalTextAlignment is Bottom", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			this.oBaseRectangle = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			var oBaseRectangleDom = this.oBaseRectangle.getDomRef().getBoundingClientRect();
			this.oBaseRectangle.setVerticalTextAlignment("Bottom");
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				var iTextFontSize = this.oBaseRectangle.getFontSize();
				this.oText = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getDomRef().querySelector("g > text").getBoundingClientRect();
				var iTextY = parseInt(oBaseRectangleDom.y + oBaseRectangleDom.height);
				var iTextYs = [iTextY, iTextY - 1];
				assert.ok((iTextYs.indexOf(Math.round(this.oText.y + iTextFontSize)) !== -1),  "Y coordinate is valid when verticalTextAlignment is Bottom");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Validate y coordinate when verticalTextAlignment is Center", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			this.oBaseRectangle = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			var oBaseRectangleDom = this.oBaseRectangle.getDomRef().getBoundingClientRect();
			this.oBaseRectangle.setVerticalTextAlignment("Center");
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				var iTextFontSize = this.oBaseRectangle.getFontSize();
				this.oText = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getDomRef().querySelector("g > text").getBoundingClientRect();
				var iTextY = parseInt((oBaseRectangleDom.y + (this.oBaseRectangle.getHeight() / 2)) - iTextFontSize / 2);
				var iTextYs = [iTextY, iTextY - 1];
				assert.ok((iTextYs.indexOf(Math.round(this.oText.y)) !== -1),  "Y coordinate is valid when verticalTextAlignment is Center");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Text alignment - when xBias and yBias are set", {
		beforeEach: function() {
			var oStartDate = new Date();
			var oEndDate = new Date();
			oEndDate.setDate(oStartDate.getDate() + 10);
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new BaseRectangle({
						title: "row01",
						time: oStartDate,
						endTime: oEndDate
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
        },
        afterEach: function() {
			this.oGantt.destroy();
        }
	});

	QUnit.test("Test text alignment with xBias and yBias in non RTL mode", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				this.oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
				this.oBaseRectangle = this.oRowSettings.getShapes1()[0];
				this.oText = this.oRowSettings.getDomRef().querySelector("g > text");
				var nPrevTextX = this.oText.getAttribute("x"),
					nPrevTextY = this.oText.getAttribute("y");
				this.oBaseRectangle.setXBias(10);
				this.oBaseRectangle.setYBias(-5);
				return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
						await nextUIUpdate();
						var nCurTextX = this.oText.getAttribute("x"),
							nCurTextY = this.oText.getAttribute("y");
						assert.equal(nCurTextX - nPrevTextX, 10, "Text x coordinate aligned with the shape");
						assert.equal(nCurTextY - nPrevTextY, -5, "Text y coordinate aligned with the shape");
				}.bind(this));
		}.bind(this));
	});

	QUnit.module("RenderUtils.renderElementAnimation", {
		beforeEach: function() {
        },
        afterEach: function() {
			this.oGantt.destroy();
        }
	});

	QUnit.test("Shape flickering enable/disable", function (assert) {
		var done = assert.async();
		this.mAnimationSettings = {
			values: "#800;#f00;#800;#800",
			duration: "2s",
			repeatCount: "indefinite"
		};
		var oStartDate = new Date();
		var oEndDate = new Date();
		oEndDate.setDate(oStartDate.getDate() + 10);
		this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
			rowId: "row01",
			shapes1: [
				new BaseRectangle({
					animationSettings: this.mAnimationSettings,
					time: oStartDate,
					endTime: oEndDate,
					showAnimation: true
				}),
				new BaseChevron({
					animationSettings: this.mAnimationSettings,
					time: oStartDate,
					endTime: oEndDate,
					showAnimation: true
				}),
				new BaseText({
					animationSettings: this.mAnimationSettings,
					text: "abcdefg1234567890",
					time: oStartDate,
					endTime: oEndDate,
					showAnimation: true
				}),
				new BaseLine({
					x1: 413.87,
					y1: 30,
					x2: 413.87,
					y2: 40
				})
			]
		}), true);
		this.oGantt.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			var mAnimationSettings = {
				values: "#800;#f00;#800;#800",
				duration: "2s",
				repeatCount: "indefinite"
			};
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oBaseRectangle = oRowSettings.getShapes1()[0],
				oBaseChevron = oRowSettings.getShapes1()[1],
				oBaseText = oRowSettings.getShapes1()[2],
				oBaseLine = oRowSettings.getShapes1()[3];
			oBaseLine.setAnimationSettings(mAnimationSettings);
			oBaseLine.setShowAnimation(true);
			assert.deepEqual(oBaseRectangle.getAnimationSettings(), mAnimationSettings, "animationSettings property is set for the shape");
			assert.strictEqual(oBaseRectangle.getShowAnimation(), true, "Show animation is set to true for the shape");
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				assert.strictEqual(oBaseRectangle.getDomRef().childNodes[0].tagName, "animate", "BaseRectangle contains animate element");
				assert.strictEqual(oBaseChevron.getDomRef().childNodes[0].tagName, "animate", "BaseChevron contains animate element");
				assert.strictEqual(oBaseText.getDomRef().childNodes[0].tagName, "animate", "BaseText contains animate element");
				assert.strictEqual(oBaseLine.getDomRef().childNodes[0].tagName, "animate", "BaseLine contains animate element");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Shape flickering disabled when animationSettings values property don't exists", function (assert) {
		var done = assert.async();
		this.mAnimationSettings = {
			duration: "2s",
			repeatCount: "indefinite"
		};
		var oStartDate = new Date();
		var oEndDate = new Date();
		oEndDate.setDate(oStartDate.getDate() + 10);
		this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
			rowId: "row01",
			shapes1: [
				new BaseRectangle({
					animationSettings: this.mAnimationSettings,
					time: oStartDate,
					endTime: oEndDate,
					showAnimation: true
				})
			]
		}), true);
		this.oGantt.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oBaseRectangle = oRowSettings.getShapes1()[0];
			assert.strictEqual(oBaseRectangle.getShowAnimation(), true, "Show animation is set to true for the shape");
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				assert.strictEqual(oBaseRectangle.getDomRef().childNodes[0], undefined, "BaseRectangle do not contains animate element");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Gantt chart tasks flickering enable/disable", function (assert) {
		var done = assert.async();
		var oStartDate = new Date();
		var oEndDate = new Date();
		oEndDate.setDate(oStartDate.getDate() + 10);
		this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
			rowId: "row01",
			shapes1: [
				new Task({
					shapeId: "0",
					time: oStartDate,
					endTime: oEndDate,
					type: "SummaryExpanded",
					height: 20,
					animationSettings: {values:'#800;#f00;#800;#800'},
					showAnimation: true
				}),
				new Task({
					shapeId: "1",
					time: oStartDate,
					endTime: oEndDate,
					type: "SummaryCollapsed",
					height: 20,
					animationSettings: {values:'#800;#f00;#800;#800'},
					showAnimation: true
				}),
				new Task({
					shapeId: "2",
					time: oStartDate,
					endTime: oEndDate,
					type: "Normal",
					height: 20,
					animationSettings: {values:'#800;#f00;#800;#800'},
					showAnimation: true
				}),
				new Task({
					shapeId: "3",
					time: oStartDate,
					endTime: oEndDate,
					type: "Error",
					height: 20,
					animationSettings: {values:'#800;#f00;#800;#800'},
					showAnimation: true
				})
			]
		}), true);
		this.oGantt.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			var aShapes = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1();
			aShapes.forEach(function(oShape) {
				var oShapeDom = oShape.getDomRef().querySelector("path > animate");
				assert.strictEqual(oShapeDom.tagName, "animate", oShape.getType() + " task contains the animate element");
				assert.strictEqual(oShapeDom.getAttribute("dur"), '1s', "animation duration is set");
				assert.strictEqual(oShapeDom.getAttribute("repeatCount"), 'indefinite', "repeatCount for animation is set");
			});
			done();
		}.bind(this));
	});

	QUnit.module("Test Align Shape with verticalTextAlignment", {
		beforeEach: function() {
			this.aAllNonExpandedShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
				"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
				"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
				"PATH:3|SCHEME:default[3]|DATA:/tree/rows/3[3]",
				"PATH:4|SCHEME:default[4]|DATA:/tree/rows/4[4]",
				"PATH:5|SCHEME:default[5]|DATA:/tree/rows/5[5]",
				"PATH:6|SCHEME:default[6]|DATA:/tree/rows/6[6]",
				"PATH:7|SCHEME:default[7]|DATA:/tree/rows/7[7]"
			];
        },
        afterEach: function() {
			this.oGantt.destroy();
        },
		assertAlignShape: function(assert, sVerticalAlignment, sShapeAlignment, oRelationshipAnchors) {
			var iDefaultFontSize = 13, iExpectedShapeYCord = 0, iExpectedTextYCord = 0;
			GanttUtils.getShapesWithUid(this.oGantt.getId(), this.aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var iActualShapeYCord, iActualTextYCord, oBaseRectangle, oText, iSuccessorShapeCord, iPredecessorShapeCord;

				oBaseRectangle = oShape.getDomRef();
				oText = oShape.getParent().getDomRef().querySelector("g > text");

				iActualShapeYCord = oBaseRectangle.getAttribute("y");
				iActualTextYCord = parseInt(oText.getAttribute("y"));
				if (sShapeAlignment == ShapeAlignment.Top) {
					iExpectedShapeYCord = (index == 0
												? iExpectedShapeYCord + 1
												: iExpectedShapeYCord + oShape._iBaseRowHeight);
					iPredecessorShapeCord = parseInt(oShape.getDomRef().getBBox().height / 2);
					iSuccessorShapeCord = parseInt(oShape.getDomRef().getBBox().height / 2) + parseInt(oShape._iBaseRowHeight);
				} else if (sShapeAlignment == ShapeAlignment.Middle) {
					iExpectedShapeYCord = (index == 0
												? iExpectedShapeYCord +  oShape._iBaseRowHeight / 2  - oShape.getHeight() / 2
												: iExpectedShapeYCord + oShape._iBaseRowHeight);
					iExpectedShapeYCord = Math.round(iExpectedShapeYCord);
					iPredecessorShapeCord = parseInt(oShape.getRowYCenter());
					iSuccessorShapeCord = parseInt(oShape.getRowYCenter())  + parseInt(oShape._iBaseRowHeight);
				} else if (sShapeAlignment == ShapeAlignment.Bottom) {
					iExpectedShapeYCord = (index == 0
											? iExpectedShapeYCord +  oShape._iBaseRowHeight - oShape.getHeight() - 1
											: iExpectedShapeYCord + oShape._iBaseRowHeight);
					iPredecessorShapeCord = parseInt(oShape._iBaseRowHeight) - parseInt(oShape.getDomRef().getBBox().height / 2);
					iSuccessorShapeCord = parseInt(oShape._iBaseRowHeight) * 2 - parseInt(oShape.getDomRef().getBBox().height / 2);
				}
				if (sVerticalAlignment == verticalTextAlignment.Top) {
					iExpectedTextYCord = parseInt(iActualShapeYCord) + iDefaultFontSize - 1;
				} else if (sVerticalAlignment == verticalTextAlignment.Center) {
					iExpectedTextYCord = parseInt(iActualShapeYCord) + (parseInt(oShape.getHeight() / 2)) + (iDefaultFontSize / 2.5);
				} else if (sVerticalAlignment == verticalTextAlignment.Bottom) {
					iExpectedTextYCord = parseInt(iActualShapeYCord) + parseInt(oShape.getHeight()) - 1;
				}
				var iShapeXCord = oShape.getDomRef().getBBox().x;
				var iResizeCoverXCord = document.getElementsByClassName("sapGanttChartSelection")[0].children[index].getBBox().x;
				var iDiffXCord = iShapeXCord - iResizeCoverXCord;
				var iDiffPredecessorShapeCord = Math.abs(oRelationshipAnchors.predecessor.y - iPredecessorShapeCord);
				var iDiffSuccessorShapeCord = Math.abs(oRelationshipAnchors.successor.y - iSuccessorShapeCord);
				iExpectedTextYCord = parseInt(iExpectedTextYCord);
				assert.equal(parseInt(iActualShapeYCord), parseInt(iExpectedShapeYCord), "Shape y coordinate aligned to the" + sShapeAlignment + " at " + parseInt(iActualShapeYCord));
				assert.equal(parseInt(iActualTextYCord), iExpectedTextYCord, "Text y coordinate aligned to the " + sVerticalAlignment + " at " + parseInt(iActualTextYCord));
				assert.ok(iDiffXCord < 2 , "Resize Cover is placed correctly.");
				if (index == 0) {
					assert.ok(iDiffPredecessorShapeCord < 2,"Predecessor Relationship moves to the " + sShapeAlignment);
					assert.ok(iDiffSuccessorShapeCord < 2, "Successor Relationship moves to the " + sShapeAlignment);
				}
			});
		},
		createRelationship: function() {
			var oRls = new Relationship({
				predecessor: "0",
				successor: "1"
			});
			var oShapes = oRls.getRelatedInRowShapes(this.oGantt.getId()), oRelationshipAnchors;
			oRls.setProperty("type", "FinishToFinish");
			oRelationshipAnchors = oRls.getRlsAnchors(0, oShapes);
			return oRelationshipAnchors;
		}
	});

	QUnit.test("Test AlignShape - Top with different verticalTextAlignment", function (assert) {
		var done = assert.async();
		this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					height: 15,
					selectable: true,
					alignShape: ShapeAlignment.Top,
					verticalTextAlignment: verticalTextAlignment.Top
				})
			]
		}));
		this.oGantt.placeAt("qunit-fixture");
		var oRelationshipAnchors;
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			this.oGantt.setSelectedShapeUid(this.aAllNonExpandedShapeUids); // exclusive parameter is not specified
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				oRelationshipAnchors = this.createRelationship();
				this.assertAlignShape(assert,verticalTextAlignment.Top, ShapeAlignment.Top, oRelationshipAnchors);
				this.oGantt.getTable().getRows().forEach(function(oRow) {
					oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
						oShape.setVerticalTextAlignment(verticalTextAlignment.Center);
					});
				});
				return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
					await nextUIUpdate();
					oRelationshipAnchors = this.createRelationship();
					this.assertAlignShape(assert, verticalTextAlignment.Center, ShapeAlignment.Top, oRelationshipAnchors);
					this.oGantt.getTable().getRows().forEach(function(oRow) {
						oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
							oShape.setVerticalTextAlignment(verticalTextAlignment.Bottom);
						});
					});
					return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
						await nextUIUpdate();
						oRelationshipAnchors = this.createRelationship();
						this.assertAlignShape(assert, verticalTextAlignment.Bottom, ShapeAlignment.Top, oRelationshipAnchors);
						this.oGantt.getTable().getRows().forEach(function(oRow) {
							oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
								oShape.setHeight(18);
								oShape.setVerticalTextAlignment(verticalTextAlignment.Top);
							});
						});
						return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
							await nextUIUpdate();
							oRelationshipAnchors = this.createRelationship();
							this.assertAlignShape(assert,verticalTextAlignment.Top, ShapeAlignment.Top, oRelationshipAnchors);
							this.oGantt.getTable().getRows().forEach(function(oRow) {
								oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
									oShape.setVerticalTextAlignment(verticalTextAlignment.Center);
								});
							});
							return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
								await nextUIUpdate();
								oRelationshipAnchors = this.createRelationship();
								this.assertAlignShape(assert, verticalTextAlignment.Center, ShapeAlignment.Top, oRelationshipAnchors);
								this.oGantt.getTable().getRows().forEach(function(oRow) {
									oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
										oShape.setVerticalTextAlignment(verticalTextAlignment.Bottom);
									});
								});
								return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
									await nextUIUpdate();
									oRelationshipAnchors = this.createRelationship();
									this.assertAlignShape(assert, verticalTextAlignment.Bottom, ShapeAlignment.Top, oRelationshipAnchors);
									this.oGantt.getTable().getRows().forEach(function(oRow) {
										oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
											oShape.setHeight(23);
											oShape.setVerticalTextAlignment(verticalTextAlignment.Top);
										});
									});
									return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
										await nextUIUpdate();
										oRelationshipAnchors = this.createRelationship();
										this.assertAlignShape(assert,verticalTextAlignment.Top, ShapeAlignment.Top, oRelationshipAnchors);
										this.oGantt.getTable().getRows().forEach(function(oRow) {
											oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
												oShape.setVerticalTextAlignment(verticalTextAlignment.Center);
											});
										});
										return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
											await nextUIUpdate();
											oRelationshipAnchors = this.createRelationship();
											this.assertAlignShape(assert, verticalTextAlignment.Center, ShapeAlignment.Top, oRelationshipAnchors);
											this.oGantt.getTable().getRows().forEach(function(oRow) {
												oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
													oShape.setVerticalTextAlignment(verticalTextAlignment.Bottom);
												});
											});
											return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
													await nextUIUpdate();
													oRelationshipAnchors = this.createRelationship();
													this.assertAlignShape(assert, verticalTextAlignment.Bottom, ShapeAlignment.Top, oRelationshipAnchors);
													done();
											}.bind(this));
										}.bind(this));
									}.bind(this));
								}.bind(this));
							}.bind(this));
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Test AlignShape - Middle with different verticalTextAlignment", function (assert) {
		var done = assert.async();
		this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					height: 15,
					selectable: true,
					alignShape: ShapeAlignment.Middle,
					verticalTextAlignment: verticalTextAlignment.Top
				})
			]
		}));
		this.oGantt.placeAt("qunit-fixture");
		var oRelationshipAnchors;
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			this.oGantt.setSelectedShapeUid(this.aAllNonExpandedShapeUids); // exclusive parameter is not specified
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				oRelationshipAnchors = this.createRelationship();
				this.assertAlignShape(assert,verticalTextAlignment.Top, ShapeAlignment.Middle, oRelationshipAnchors);
				this.oGantt.getTable().getRows().forEach(function(oRow) {
					oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
						oShape.setVerticalTextAlignment(verticalTextAlignment.Center);
					});
				});
				return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
					await nextUIUpdate();
					oRelationshipAnchors = this.createRelationship();
					this.assertAlignShape(assert, verticalTextAlignment.Center, ShapeAlignment.Middle, oRelationshipAnchors);
					this.oGantt.getTable().getRows().forEach(function(oRow) {
						oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
							oShape.setVerticalTextAlignment(verticalTextAlignment.Bottom);
						});
					});
					return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
						await nextUIUpdate();
						oRelationshipAnchors = this.createRelationship();
						this.assertAlignShape(assert, verticalTextAlignment.Bottom, ShapeAlignment.Middle, oRelationshipAnchors);
						this.oGantt.getTable().getRows().forEach(function(oRow) {
							oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
								oShape.setHeight(18);
								oShape.setVerticalTextAlignment(verticalTextAlignment.Top);
							});
						});
						return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
							await nextUIUpdate();
							oRelationshipAnchors = this.createRelationship();
							this.assertAlignShape(assert, verticalTextAlignment.Top, ShapeAlignment.Middle, oRelationshipAnchors);
							this.oGantt.getTable().getRows().forEach(function(oRow) {
								oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
									oShape.setVerticalTextAlignment(verticalTextAlignment.Center);
								});
							});
							return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
								await nextUIUpdate();
								oRelationshipAnchors = this.createRelationship();
								this.assertAlignShape(assert, verticalTextAlignment.Center, ShapeAlignment.Middle, oRelationshipAnchors);
								this.oGantt.getTable().getRows().forEach(function(oRow) {
									oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
										oShape.setVerticalTextAlignment(verticalTextAlignment.Bottom);
									});
								});
								return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
									await nextUIUpdate();
									oRelationshipAnchors = this.createRelationship();
									this.assertAlignShape(assert, verticalTextAlignment.Bottom, ShapeAlignment.Middle, oRelationshipAnchors);
									this.oGantt.getTable().getRows().forEach(function(oRow) {
										oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
											oShape.setHeight(23);
											oShape.setVerticalTextAlignment(verticalTextAlignment.Top);
										});
									});
									return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
										await nextUIUpdate();
										oRelationshipAnchors = this.createRelationship();
										this.assertAlignShape(assert, verticalTextAlignment.Top, ShapeAlignment.Middle, oRelationshipAnchors);
										this.oGantt.getTable().getRows().forEach(function(oRow) {
											oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
												oShape.setVerticalTextAlignment(verticalTextAlignment.Center);
											});
										});
										return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
											await nextUIUpdate();
											oRelationshipAnchors = this.createRelationship();
											this.assertAlignShape(assert, verticalTextAlignment.Center, ShapeAlignment.Middle, oRelationshipAnchors);
											this.oGantt.getTable().getRows().forEach(function(oRow) {
												oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
													oShape.setVerticalTextAlignment(verticalTextAlignment.Bottom);
												});
											});
											return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
												await nextUIUpdate();
												oRelationshipAnchors = this.createRelationship();
												this.assertAlignShape(assert, verticalTextAlignment.Bottom, ShapeAlignment.Middle, oRelationshipAnchors);
												done();
											}.bind(this));
										}.bind(this));
									}.bind(this));
								}.bind(this));
							}.bind(this));
						}.bind(this));
					}.bind(this));
				}.bind(this));
		    }.bind(this));
		}.bind(this));
	});

	QUnit.test("Test AlignShape - Bottom with different verticalTextAlignment", function (assert) {
		var done = assert.async();
		this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					height: 15,
					selectable: true,
					alignShape: ShapeAlignment.Bottom,
					verticalTextAlignment: verticalTextAlignment.Top
				})
			]
		}));
		this.oGantt.placeAt("qunit-fixture");
		var oRelationshipAnchors;
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			this.oGantt.setSelectedShapeUid(this.aAllNonExpandedShapeUids); // exclusive parameter is not specified
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				oRelationshipAnchors = this.createRelationship();
				this.assertAlignShape(assert,verticalTextAlignment.Top, ShapeAlignment.Bottom, oRelationshipAnchors);
				this.oGantt.getTable().getRows().forEach(function(oRow) {
					oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
						oShape.setVerticalTextAlignment(verticalTextAlignment.Center);
					});
				});
				return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
					await nextUIUpdate();
					oRelationshipAnchors = this.createRelationship();
					this.assertAlignShape(assert, verticalTextAlignment.Center, ShapeAlignment.Bottom, oRelationshipAnchors);
					this.oGantt.getTable().getRows().forEach(function(oRow) {
						oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
							oShape.setVerticalTextAlignment(verticalTextAlignment.Bottom);
						});
					});
					return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
						await nextUIUpdate();
						oRelationshipAnchors = this.createRelationship();
						this.assertAlignShape(assert, verticalTextAlignment.Bottom, ShapeAlignment.Bottom, oRelationshipAnchors);
						this.oGantt.getTable().getRows().forEach(function(oRow) {
							oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
								oShape.setHeight(18);
								oShape.setVerticalTextAlignment(verticalTextAlignment.Top);
							});
						});
						return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
							await nextUIUpdate();
							oRelationshipAnchors = this.createRelationship();
							this.assertAlignShape(assert, verticalTextAlignment.Top, ShapeAlignment.Bottom, oRelationshipAnchors);
							this.oGantt.getTable().getRows().forEach(function(oRow) {
								oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
									oShape.setVerticalTextAlignment(verticalTextAlignment.Center);
								});
							});
							return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
								await nextUIUpdate();
								oRelationshipAnchors = this.createRelationship();
								this.assertAlignShape(assert, verticalTextAlignment.Center, ShapeAlignment.Bottom, oRelationshipAnchors);
								this.oGantt.getTable().getRows().forEach(function(oRow) {
									oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
										oShape.setVerticalTextAlignment(verticalTextAlignment.Bottom);
									});
								});
								return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
									await nextUIUpdate();
									oRelationshipAnchors = this.createRelationship();
									this.assertAlignShape(assert, verticalTextAlignment.Bottom, ShapeAlignment.Bottom, oRelationshipAnchors);
									this.oGantt.getTable().getRows().forEach(function(oRow) {
										oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
											oShape.setHeight(23);
											oShape.setVerticalTextAlignment(verticalTextAlignment.Top);
										});
									});
									return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
										await nextUIUpdate();
										oRelationshipAnchors = this.createRelationship();
										this.assertAlignShape(assert, verticalTextAlignment.Top, ShapeAlignment.Bottom, oRelationshipAnchors);
										this.oGantt.getTable().getRows().forEach(function(oRow) {
											oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
												oShape.setVerticalTextAlignment(verticalTextAlignment.Center);
											});
										});
									    return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
											await nextUIUpdate();
											oRelationshipAnchors = this.createRelationship();
											this.assertAlignShape(assert, verticalTextAlignment.Center, ShapeAlignment.Bottom, oRelationshipAnchors);
											this.oGantt.getTable().getRows().forEach(function(oRow) {
												oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
													oShape.setVerticalTextAlignment(verticalTextAlignment.Bottom);
												});
											});
										    return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
												await nextUIUpdate();
												oRelationshipAnchors = this.createRelationship();
												this.assertAlignShape(assert, verticalTextAlignment.Bottom, ShapeAlignment.Bottom, oRelationshipAnchors);
												done();
											}.bind(this));
										}.bind(this));
									}.bind(this));
								}.bind(this));
							}.bind(this));
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("RenderUtils.renderExpandShapesIfNecessary", {
		beforeEach: function() {
			this.aAllExpandedShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
				"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
				"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
				"PATH:3|SCHEME:default[3]|DATA:/tree/rows/3[3]",
				"PATH:4|SCHEME:default[4]|DATA:/tree/rows/4[4]",
				"PATH:5|SCHEME:default[5]|DATA:/tree/rows/5[5]",
				"PATH:6|SCHEME:default[6]|DATA:/tree/rows/6[6]",
				"PATH:7|SCHEME:default[7]|DATA:/tree/rows/7[7]"
			];
        },
        afterEach: function() {
			this.oGantt.destroy();
        },
		getAllExpandedShapes: function() {
			return GanttUtils.getShapesWithUid(this.oGantt.getId(), this.aAllExpandedShapeUids);
		}
	});
	QUnit.test("Verify if MainShape is equal to the last visible shape in DOM", function (assert) {
		var done = assert.async();
		this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					_isSubTasks: true,
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "Row_7",
					fill: "#008FD3",
					selectable: true
				})
			]
		}));
		this.oGantt.placeAt("qunit-fixture");
		var aAllExpandedShapes = [];
		var oMainShapeTitle = "";
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			this.oGantt.setSelectedShapeUid(this.aAllExpandedShapeUids); // exclusive parameter is not specified
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				aAllExpandedShapes = this.getAllExpandedShapes();
				aAllExpandedShapes.forEach(function (shape, index) {
					if (this.oGantt.isShapeVisible(shape)) {
						this.lastVisibleShapeIndex = index;
					}
				}.bind(this));
				oMainShapeTitle = this.oGantt.getTable().getRowSettingsTemplate().getShapes1()[0].getTitle();
				assert.equal(oMainShapeTitle, aAllExpandedShapes[this.lastVisibleShapeIndex].getTitle());
				done();
			}.bind(this));
		}.bind(this));
	});
	QUnit.module("RenderUtils.updateShapeSelection - BaseConditionalShape", {
		beforeEach: function() {
			var oBaseConditionalShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						shapeId: "r1",
						time: new Date(),
						endTime: new Date(new Date().getTime() - 1000000000),
						selectable: true
					}),
					new BaseChevron({
						shapeId: "r2",
						time: new Date(),
						endTime: new Date(new Date().getTime() - 1000000000),
						selectable: true
					})
				]
			});
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: oBaseConditionalShape
			}), true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		},
		getFirstRowSettingAggregation: function(iIndex) {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			return {
				"oBaseConditionalShape": oRowSettings.getShapes1()[0]
			};
		}
	});

	QUnit.test("Verify if all Shapes are selected/deselected on click of base conditional active shape", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			this.oBaseConditionalShape = this.getFirstRowSettingAggregation().oBaseConditionalShape;
			this.oGantt.attachEventOnce("shapeSelectionChange", function () {
				assert.ok(this.oBaseConditionalShape.getShapes()[0].getSelected(), "All child shapes are selected");
				this.oBaseConditionalShape.setActiveShape(1);
				return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
					await nextUIUpdate();
					this.oGantt.attachEventOnce("shapeSelectionChange", function () {
						assert.ok(this.oBaseConditionalShape.getShapes()[0].getSelected(), "All child shapes are deselected");
						this.oBaseConditionalShape.setActiveShape(0);
						return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
							await nextUIUpdate();
							this.oGantt.attachEventOnce("shapeSelectionChange", function () {
								this.oBaseConditionalShape.getShapes().forEach(function (oShape) {
									assert.ok(oShape.getSelected(), "All child shapes are selected");
								});
								done();
							}.bind(this));
							QUnitUtils.triggerEvent("click", this.oBaseConditionalShape._getActiveShapeElement().getId());
						}.bind(this));
					}.bind(this));
					QUnitUtils.triggerEvent("click", this.oBaseConditionalShape._getActiveShapeElement().getId());
				}.bind(this));
			}.bind(this));
			QUnitUtils.triggerEvent("click", this.oBaseConditionalShape._getActiveShapeElement().getId());
		}.bind(this));
	});

	QUnit.module("Shape's title color - Theme Adaptation", {
		before: function () {
			this.oTheme = GanttChartConfigurationUtils.getTheme();
		},
		beforeEach: function () {
			this.oGantt = GanttQUnitUtils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true
					})
				]
			}));
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		after: function () {
			Theming.setTheme(this.oTheme);
		}
	});
	/**
	 * @deprecated since 1.120.0
	 */
	QUnit.test("adaptToHcbTheme", function (assert) {
		var done = assert.async();
		Theming.setTheme("sap_hcb");
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oShapeTitle = oRowSettings.getDomRef().querySelector("g > text");
			assert.equal(oShapeTitle.style.fill, "rgb(255, 255, 255)", "Shape's title color is correct");
			done();
		}.bind(this));
	});

	QUnit.test("adaptToHcwTheme", function (assert) {
		Theming.setTheme("sap_fiori_3_hcw");
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oShapeTitle = oRowSettings.getDomRef().querySelector("g > text");
			assert.equal(oShapeTitle.style.fill, "rgb(0, 0, 0)", "Shape's title color is correct");
		}.bind(this));
	});

	QUnit.test("adaptToDarkTheme", function (assert) {
		Theming.setTheme("sap_fiori_3_dark");
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oShapeTitle = oRowSettings.getDomRef().querySelector("g > text");
			assert.equal(oShapeTitle.style.fill, "rgb(250, 250, 250)", "Shape's title color is correct");
		}.bind(this));
	});

	QUnit.test("adaptTosap_horizonTheme", function (assert) {
		Theming.setTheme("sap_horizon");
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oShapeTitle = oRowSettings.getDomRef().querySelector("g > text");
			assert.equal(oShapeTitle.style.fill, "rgb(29, 45, 62)", "Shape's title color is correct");
		}.bind(this));
	});

	QUnit.test("adaptTosap_horizon_darkTheme", function (assert) {
		Theming.setTheme("sap_horizon_dark");
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oShapeTitle = oRowSettings.getDomRef().querySelector("g > text");
			assert.equal(oShapeTitle.style.fill, "rgb(234, 236, 238)", "Shape's title color is correct");
		}.bind(this));
	});

	QUnit.module("RenderUtils._updateShapeSelectionStyle - BaseRectangle with title", {
		beforeEach: function() {
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						titleColor: "red",
						fill: "blue",
						height: 15,
						selectable: true
					})
				]
			}));
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Shape's fill and title color should be set correctly on shape selection", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings1 = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oRowSettings2 = this.oGantt.getTable().getRows()[1].getAggregation("_settings");
			var oShape1 = oRowSettings1.getShapes1()[0];
			var oShape2 = oRowSettings2.getShapes1()[0];
			assert.equal(oShape1.getSelectedFill(), undefined, "No selectedFill by default");
			assert.equal(oShape1.getSelectedTitleColor(), undefined, "No selectedTitleColor by default");
			oShape1.setSelectedFill("green");
			oShape1.setSelectedTitleColor("white");
			this.oGantt.setSelectedShapeUid([oShape1.getShapeUid(), oShape2.getShapeUid()]);
			var oShape1DomRef = oShape1.getDomRef();
			var oShape1Title = oRowSettings1.getDomRef().querySelector("g > text");
			var oShape2DomRef = oShape2.getDomRef();
			var oShape2Title = oRowSettings2.getDomRef().querySelector("g > text");
			assert.equal(oShape1DomRef.style.fill, "green", "selectedFill applied to the shape");
			assert.equal(oShape1Title.style.fill, "white", "selectedTitleColor applied to the shape title");
			assert.equal(oShape2DomRef.style.fill, "blue", "Original fill applied to the shape because selectedFill is not set");
			assert.equal(oShape2Title.style.fill, "red", "Original titleColor applied to the shape title because selectedTitleColor is not set");
			var oResizeContainers = document.querySelector(".sapGanttChartSelection").children;
			assert.equal(window.getComputedStyle(oResizeContainers[0]).strokeWidth, "0px", "No border around the shape with selection properties set");
			assert.equal(window.getComputedStyle(oResizeContainers[1]).strokeWidth, "1px", "Border visible around the shape with selection properties not set");
			this.oGantt.setSelectedShapeUid([]);
			assert.equal(oShape1DomRef.style.fill, "blue", "shape fill back to original after shape is deselected");
			assert.equal(oShape1Title.style.fill, "red", "shape title color back to original after shape is deselected");
		}.bind(this));
	});

	QUnit.module("RenderUtils._updateShapeSelectionStyle - BaseGroup", {
		beforeEach: function() {
			var date = new Date();
			var date1 = new Date();
			var date2 = new Date();
			date1.setDate(date.getDate() + 2);
			date2.setDate(date1.getDate() + 7);
			var oChevron = new BaseChevron({shapeId: "chevron", selectable: true, time: date1, endTime: date2, fill: "blue", selectedFill: "pink"});
			var oText1 = new BaseText({shapeId: "text01", selectable: true, text: "Test1", time: date, fill:"red"});
			var oText2 = new BaseText({shapeId: "text02", selectable: true, text: "Test2", time: date2, fill: "green", selectedFill: "blue", selectedTitleColor: "yellow"});
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						shapes: [oText1, oChevron, oText2],
						selectedFill: "grey",
						selectedTitleColor: "orange"
					})
				]
			}));
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Individual shape's fill and title color should be set correctly", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings1 = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oShape = oRowSettings1.getShapes1()[0];
			this.oGantt.setSelectedShapeUid([oShape.getShapeUid()]);
			var oShapeDomRefs = oShape.getDomRef().children;
			assert.equal(oShapeDomRefs[0].style.fill, "orange", "shape's text color set as parent's selectedTitleColor because selection properties are not set for the shape");
			assert.equal(oShapeDomRefs[1].style.fill, "pink", "selectedFill applied to the shape");
			assert.equal(oShapeDomRefs[2].style.fill, "yellow", "selectedTitleColor applied to the shape because shape is a text");
			var oResizeContainer = document.querySelector(".sapGanttChartSelection").children[0];
			assert.equal(window.getComputedStyle(oResizeContainer).strokeWidth, "0px", "No border around the shape on selection");
			this.oGantt.setSelectedShapeUid([]);
			assert.equal(oShapeDomRefs[0].style.fill, "red", "shape fill reset correctly after deselect");
			assert.equal(oShapeDomRefs[1].style.fill, "blue", "shape fill reset correctly after deselect");
			assert.equal(oShapeDomRefs[2].style.fill, "green", "shape fill reset correctly after deselect");
		}.bind(this));
	});

	QUnit.module("RenderUtils._updateShapeSelectionStyle - Shapes with visibility set to false", {
		beforeEach: function() {
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						titleColor: "red",
						fill: "blue",
						height: 15,
						selectable: true
					})
				]
			}));
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Invisible shape's fill and title color should not be updated", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings1 = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oRowSettings2 = this.oGantt.getTable().getRows()[1].getAggregation("_settings");
			var oShape1 = oRowSettings1.getShapes1()[0];
			var oShape2 = oRowSettings2.getShapes1()[0];
			var oUpdateShapeStyleSpy = sinon.spy(RenderUtils, "_updateShapeStyle");
			oShape2.setSelectedFill("green");
			oShape2.setSelectedTitleColor("white");
			oShape2.setVisible(false);
			this.oGantt.setSelectedShapeUid([oShape1.getShapeUid()]);
			assert.equal(oUpdateShapeStyleSpy.callCount, 0, "RenderUtils._updateShapeStyle should not be called for shape without selectedFill and selectedTitleColor");
			var oUpdateShapeSelectionStyleSpy = sinon.spy(RenderUtils, "_updateShapeSelectionStyle");
			this.oGantt.setSelectedShapeUid([oShape2.getShapeUid()]);
			assert.equal(oUpdateShapeSelectionStyleSpy.callCount, 0, "RenderUtils._updateShapeSelectionStyle should not be called for invisible shape");
			var oShape2DomRef = oShape2.getDomRef();
			var oShape2Title = oRowSettings2.getDomRef().querySelector("g > text");
			assert.equal(oShape2DomRef.style.fill, "blue", "Original fill applied to the invisible shape");
			assert.equal(oShape2Title.style.fill, "red", "Original titleColor applied to the invisible shape");
		}.bind(this));
	});

	QUnit.module("Title alignment - when titleSpacing is set", {
		beforeEach: function() {
			var oStartDate = new Date();
			var oEndDate = new Date();
			oEndDate.setDate(oStartDate.getDate() + 10);
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new BaseRectangle({
						title: "row01",
						time: oStartDate,
						endTime: oEndDate
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
        },
        afterEach: function() {
			this.oGantt.destroy();
        }
	});

	QUnit.test("Title alignment when titleSpacing is set in non RTL mode", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			this.oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			this.oBaseRectangle = this.oRowSettings.getShapes1()[0];
			this.oText = this.oRowSettings.getDomRef().querySelector("g > text");
			var nPrevTextX = this.oText.getAttribute("x");
			this.oBaseRectangle.setTitleSpacing(10);
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				var nCurTextX = this.oText.getAttribute("x");
				assert.equal(nCurTextX - nPrevTextX, 10, "Text x coordinate aligned with the shape");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("MultiAcitivtyGroup - showParentRowOnExpand and useParentRowOnExpand", {
		beforeEach: function() {
			//Set the dates
			var currentDate = new Date(),
				iMilliSecPerDay = 86400000;

			this.firstTaskStartDate = currentDate;
			this.firstTaskEndDate = new Date(currentDate.getTime() + 15 * iMilliSecPerDay);

			this.oMultiActivityrowSetting = new MultiActivityRowSettings({
				rowId: "row01",
				tasks: [
					new MultiActivityGroup({
						scheme: "default",
						expandable: true,
						task: [
							new BaseRectangle("task01",{
								scheme: "default",
								shapeId: "task01",
								time: this.firstTaskStartDate,
								endTime: this.firstTaskEndDate,
								fill: "red"
							})
						],
						indicators: [
							new BaseRectangle({
								scheme: "subtasks",
								shapeId: "indicator01",
								time: this.firstTaskStartDate,
								endTime: this.firstTaskEndDate
							})
						]
					}),
					new MultiActivityGroup({
						scheme: "default",
						expandable: true,
						task: [
							new BaseRectangle("task02",{
								scheme: "default",
								shapeId: "task02",
								time: this.firstTaskStartDate,
								endTime: this.firstTaskEndDate,
								fill: "red"
							})
						],
						indicators: [
							new BaseRectangle({
								scheme: "subtasks",
								shapeId: "indicator02",
								time: this.firstTaskStartDate,
								endTime: this.firstTaskEndDate
							})
						]
					}),
					new MultiActivityGroup({
						scheme: "default",
						expandable: true,
						task: [
							new BaseRectangle("task03",{
								scheme: "default",
								shapeId: "task03",
								time: this.firstTaskStartDate,
								endTime: this.firstTaskEndDate,
								fill: "red"
							})
						],
						indicators: [
							new BaseRectangle({
								scheme: "subtasks",
								shapeId: "indicator03",
								time: this.firstTaskStartDate,
								endTime: this.firstTaskEndDate
							})
						]
					})
				]
			});
			//Create the gantt
			this.sut = GanttQUnitUtils.createGantt(true, this.oMultiActivityrowSetting, true);

			//Place Gantt at Qunit fixture
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		},
		getMainShape: function(iIndex) {
			var oRowSettings = this.sut.getTable().getRows()[iIndex].getAggregation("_settings");
			return oRowSettings.getTasks();
		}
	});
	QUnit.test("Expand with parent row shapes - Ensure task renders only once", function (assert) {
		var done = assert.async();
		var iExpandIndex = 0;
		this.sut.setUseParentShapeOnExpand(true);
		this.sut.setShowParentRowOnExpand(false);
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var aMainShape = this.getMainShape(iExpandIndex);
			var arrRenderSpy = [];
			aMainShape.forEach(function(oTask) {
				arrRenderSpy.push(sinon.spy(oTask.getTask(),"renderElement"));
			});
            this.sut.expand("default", iExpandIndex);
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				arrRenderSpy.forEach(function(oSpy){
					assert.ok(oSpy.calledOnce, "Rendering of tasks only done once");
				});
				done();
			}.bind(this));
        }.bind(this));
	});
});
