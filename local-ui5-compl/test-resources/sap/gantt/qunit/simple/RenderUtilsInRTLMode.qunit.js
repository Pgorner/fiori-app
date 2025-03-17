/*global QUnit*/

sap.ui.define([
	"sap/gantt/library",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/core/Core",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseShape",
	"sap/gantt/simple/BaseText",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/RenderManager",
	"sap/gantt/simple/test/nextUIUpdate"
], function (
	library,
	BaseRectangle,
	GanttQUnitUtils,
	Core,
	GanttRowSettings,
	BaseShape,
	BaseText,
	GanttChartConfigurationUtils,
	RenderManager,
	nextUIUpdate
) {
	"use strict";


	var horizontalTextAlignment = library.simple.horizontalTextAlignment;
	var verticalTextAlignment = library.simple.verticalTextAlignment;

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

	QUnit.test(" Validate x coordinate for text when RTL mode is true and horizontalTextAlignment is Start", async function (assert) {
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		GanttChartConfigurationUtils.setRTL(true);
		await nextUIUpdate();
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(148, this.oText.getX() + this.oRectangle.getWidth() - 2, "X coordinate is valid when RTL mode is true and horizontalTextAlignment is Start" );
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is true and horizontalTextAlignment is End", async function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.End;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		GanttChartConfigurationUtils.setRTL(true);
		await nextUIUpdate();
		var iCornerPaddingPixel = 2;
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(102, this.oText.getX() + iCornerPaddingPixel, "X coordinate is valid when RTL mode is true and horizontalTextAlignment is End");
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is true and horizontalTextAlignment is Middle", async function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.Middle;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		GanttChartConfigurationUtils.setRTL(true);
		await nextUIUpdate();
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(125, this.oText.getX() + this.oRectangle.getWidth() / 2, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is End" );
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is true and horizontalTextAlignment is Dynamic", async function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.Dynamic;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		var iCornerPaddingPixel = 2;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		GanttChartConfigurationUtils.setRTL(true);
		await nextUIUpdate();
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(102, this.oText.getX() + iCornerPaddingPixel, "X coordinate is valid when RTL mode is true and horizontalTextAlignment is Dynamic");
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.module("Text alignment", {
		before: function(){
			GanttChartConfigurationUtils.setRTL(true);
		},
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
		},
		after: function(){
			GanttChartConfigurationUtils.setRTL(false);
		}
	});

	QUnit.test("Test text alignment with xBias and yBias in RTL mode", function (assert) {
		var done = assert.async();
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
				this.oNewText = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getDomRef().querySelector("g > text");
				var nCurTextX = this.oNewText.getAttribute("x"),
					nCurTextY = this.oNewText.getAttribute("y");
				assert.equal(nPrevTextX - nCurTextX, 10, "Text x coordinate aligned with the shape");
				assert.equal(nPrevTextY - nCurTextY, 5, "Text y coordinate aligned with the shape");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Title alignment when titleSpacing is set in RTL mode", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			this.oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			this.oBaseRectangle = this.oRowSettings.getShapes1()[0];
			this.oText = this.oRowSettings.getDomRef().querySelector("g > text");
			if (this.oText) {
				var nPrevTextX = this.oText.getAttribute("x");
				this.oBaseRectangle.setTitleSpacing(10);
				return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(async function () {
					await nextUIUpdate();
					this.oNewText = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getDomRef().querySelector("g > text");
					var nCurTextX = this.oNewText.getAttribute("x");
					assert.equal(nPrevTextX - nCurTextX, 10, "Text x coordinate aligned with the shape");
					done();
				}.bind(this));
			}
		}.bind(this));
	});
});
