/*global QUnit, sinon*/
sap.ui.define([
	"sap/base/Log",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseGroup",
	"sap/ui/core/theming/Parameters",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/RenderManager"
], function (Log, BaseText, BaseRectangle,utils,GanttRowSettings,BaseGroup, Parameters, GanttUtils, GanttChartConfigurationUtils,
	RenderManager) {
	"use strict";

	QUnit.test("default values", function (assert) {
		var oShape = new BaseText();
		assert.strictEqual(oShape.getFontSize(), 13, "Default fontSize is 13");
		assert.strictEqual(oShape.getFontFamily(),"Arial", "Default fontFamily is Arial");
		assert.strictEqual(oShape.getTextAnchor(), "start", "Default textAnchor is start");
		assert.strictEqual(oShape.getTruncateWidth(), undefined, "Default truncateWidth is undefined");
		assert.strictEqual(oShape.getShowEllipsis(), true, "Default showEllipsis is true");
		assert.strictEqual(oShape.getIsLabel(), false, "Default label marking is false");
		assert.strictEqual(oShape.getOpacity(), 1, "Default opacity is 1");
	});

	QUnit.module("Functions - BaseText", {
		beforeEach: function() {
			this.sText = "abcdefg1234567890";
			this.oShape = new BaseText({
				text: this.sText,
				truncateWidth: 56,
				rowYCenter: 20,
				time: new Date(Date.UTC(2018, 2, 22)),
				endTime: new Date(Date.UTC(2018, 2, 22, 0, 0, 51))
			});
			this.getXByTimeStub = sinon.stub(this.oShape, "getXByTime", function(time){return time ? time / 1000 : 0;});
			this.textBox = new BaseRectangle({
				time: new Date(Date.UTC(2018, 2, 22)),
				endTime: new Date(Date.UTC(2018, 2, 22, 0, 0, 50))
			});
			this.getXByTimeStub2 = sinon.stub(this.textBox, "getXByTime", function(time){return time / 1000;});
			this.groupBox =	new  BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						shapes: [this.textBox,this.oShape]
			});
			this.oShape._iBaseRowHeight = 48.79999923706055;
		},
		afterEach: function() {
			this.sText = null;
			this.oShape = null;

			this.getXByTimeStub.restore();
			this.getXByTimeStub2.restore();
		}
	});

	QUnit.test("Rendering", function (assert) {
		var oRm = new RenderManager();
		this.oShape.setProperty("opacity", 0.5);
		this.oShape.renderElement(oRm, this.oShape);
		oRm.flush(document.getElementById("qunit-fixture"));
		oRm.destroy();
		assert.strictEqual(document.getElementById("qunit-fixture").children[0].getAttribute("opacity"), "0.5", "base text opcacity is correct");
	});

	QUnit.test("Functions - getTruncateWidth", function (assert) {
		// getTruncateWidth
		var getParentStub = sinon.stub(this.oShape, "getParent").returns(null);
		assert.strictEqual(this.oShape.getTruncateWidth(), 56, "BaseText without parent, truncateWidth is 56");
		getParentStub.restore();

		getParentStub = sinon.stub(this.oShape, "getParent").returns(this.textBox);

		var getWidthStub = sinon.stub(this.textBox, "getWidth").returns(56);

		assert.strictEqual(this.oShape.getTruncateWidth(), 56, "BaseText with parent, truncateWidth is 56");
		this.textBox.setEndTime(new Date(Date.UTC(2018, 2, 22, 0, 0, 20)));
		getWidthStub.restore();

		getWidthStub = sinon.stub(this.textBox, "getWidth").returns(20);
		assert.strictEqual(this.oShape.getTruncateWidth(), 20, "BaseText with parent, truncateWidth is 20");
		getParentStub.restore();
		getWidthStub.restore();

		getParentStub = sinon.stub(this.oShape, "getParent").returns(this.groupBox);
		assert.strictEqual(this.oShape.getTruncateWidth(), 56, "BaseText with parent as basegroup having no start and end time defined, truncateWidth is 56");
		getParentStub.restore();
	});

	QUnit.test("Functions - getStyle", function (assert) {
		// getStyle
		assert.strictEqual(this.oShape.getStyle(), "stroke-width:0; pointer-events:none; font-size:13px; fill:" + Parameters.get("sapUiBaseText") + "; font-family:Arial; font-weight:normal; ");
	});

	QUnit.test("Functions - getX", function (assert) {
		var fnWarning = sinon.spy(Log, "warning");
		var aWarnings = [];
		// getX
		this.oShape.setProperty("x", 10);
		assert.strictEqual(this.oShape.getX(), 10, "BaseText.getX() is: 10");
		aWarnings = filterLogWarnings(fnWarning);
		assert.equal(aWarnings.length, 0, "Warning was not logged so far");
		this.oShape.setProperty("x", null);
		assert.strictEqual(this.oShape.getX(), 1521676800, "BaseText.getX() is: 1521676800");
		aWarnings = filterLogWarnings(fnWarning);
		assert.equal(aWarnings.length, 0, "Warning was not logged so far");

		this.oShape.setTime({test: "test"});
		assert.ok(isNaN(this.oShape.getX()), "BaseText.getX() is: NaN");
		aWarnings = filterLogWarnings(fnWarning);
		assert.ok(aWarnings.length, "call getX gets assert warning");
		assert.equal(aWarnings[0][0], "couldn't convert timestamp to x with value: [object Object]", "Waring is: couldn't convert timestamp to x with value: [object Object]");
		GanttChartConfigurationUtils.setRTL(true);
		assert.strictEqual(this.oShape.getX(), 1521676851, "In RTL mode, BaseText.getX() is: 1521676851");
		GanttChartConfigurationUtils.setRTL(false);

		// getX from parent
		var getParentStub = sinon.stub(this.oShape, "getParent").returns(this.textBox);
		var getXStub = sinon.stub(this.textBox, "getX").returns(null);
		this.oShape.setTime(null);
		this.oShape.setEndTime(null);
		assert.strictEqual(this.oShape.getX(), 1521676800, "BaseText with parent, BaseText.getX() is: 1521676800");

		GanttChartConfigurationUtils.setRTL(true);
		assert.strictEqual(this.oShape.getX(), 1521676850, "BaseText with parent, in RTL mode from parent fallback, BaseText.getX() is: 1521676850");
		GanttChartConfigurationUtils.setRTL(false);
		this.textBox.setProperty("x", 12);
		assert.strictEqual(this.oShape.getX(), 12, "BaseText with parent, BaseText.getX() is: 12");
		getXStub.restore();
		getParentStub.restore();

		function filterLogWarnings(fnWarning) {
			return fnWarning.args.filter(function(arg){
				return arg[0].indexOf("couldn't convert timestamp to x with value:") == 0;
			});
		}

	});

	QUnit.test("Functions - getY", function (assert) {
		assert.strictEqual(this.oShape.getY(), 26, "BaseText.getY() is: 26.5");
		this.oShape.setProperty("y", 10);
		assert.strictEqual(this.oShape.getY(), 10, "BaseText.getY() is: 10");
	});

	QUnit.test("getY for alignshape", function (assert) {
		var y;
		this.oShape.setAlignShape("Top");
		y = 8;
		assert.strictEqual(this.oShape.getY(), y, "In non RTL mode, for alignShape = top the return value is '" + y + "'");

		this.oShape.setAlignShape("Middle");
		y = 26;
		assert.strictEqual(this.oShape.getY(), y, "In non RTL mode, for alignShape = middle the return value is '" + y + "'");

		this.oShape.setAlignShape("Bottom");
		y = 43;
		assert.strictEqual(this.oShape.getY(), y, "In non RTL mode, for alignShape = bottom the return value is '" + y + "'");
	});

	QUnit.test("Functions - geNumberOfTruncatedCharacters", function (assert) {
		var nTotalWidth = this.oShape.measureTextWidth(this.sText);
		// _geNumberOfTruncatedCharacters
		assert.strictEqual(GanttUtils.geNumberOfTruncatedCharacters(nTotalWidth, 50, this.sText, this.oShape, this.oShape.measureTextWidth), 7, "When target width is 50, number of truncated characters is 7");
		assert.strictEqual(GanttUtils.geNumberOfTruncatedCharacters(nTotalWidth, 100, this.sText, this.oShape, this.oShape.measureTextWidth), 14, "When target width is 100, number of truncated characters is 14");
		assert.strictEqual(GanttUtils.geNumberOfTruncatedCharacters(nTotalWidth, 120, this.sText, this.oShape, this.oShape.measureTextWidth), this.sText.length, "When target width bigger than total width, return source string's length");
	});

	QUnit.test("Functions - measureTextWidth", function (assert) {
		this.oShape.setFontWeight("normal");
		var sNormalTitle = this.oShape._truncateText(this.sText).truncatedText;
		var iNormalTextLength = this.oShape.measureTextWidth(this.sText);
		this.oShape.setFontWeight("bold");
		var sBoldTitle = this.oShape._truncateText(this.sText).truncatedText;
		var iBoldTextLength = this.oShape.measureTextWidth(this.sText);
		assert.equal(sNormalTitle.length > sBoldTitle.length, true, "Bold truncated text should be smaller than normal truncated text");
		assert.equal(iBoldTextLength > iNormalTextLength, true, "Bold text should be wider than normal text");
	});

	QUnit.module("IsLabel - BaseText", {
		beforeEach: function() {
			var date = new Date();
			var date1 = new Date();
			var date2 = new Date();
			date1.setDate(date.getDate() + 1);
			date2.setDate(date1.getDate() + 1);
			this.oRect = new BaseRectangle({shapeId: "rect01", selectable: true,time:date,endTime:date1});
			this.oText1 = new BaseText({shapeId: "text01", selectable: true,text: "Test1",isLabel:true,time:date1});
			this.oText2 = new BaseText({shapeId: "text02", selectable: true,text: "Test2",isLabel:false,time:date2});
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new  BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						shapes: [this.oRect,this.oText1,this.oText2]
					})
				]
			}));
			this.oGantt.setSelectOnlyGraphicalShape(true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.oRect = null;
			this.oText1 = null;
			this.oText2 = null;
			utils.destroyGantt();
		}
	});

	QUnit.test("BaseText when SelectOnlyGraphicalShape enabled ", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
		var testElements = document.getElementsByClassName("sapGanttTextNoPointerEvents");
		var textTest1List = Array.prototype.filter.call(testElements, function(testElement){
		return testElement.nodeName === 'text' && testElement.textContent == "Test1";
		});
		var textTest2List = Array.prototype.filter.call(testElements, function(testElement){
			return testElement.nodeName === 'text' && testElement.textContent == "Test2";
		});
		assert.ok(textTest1List.length > 0, "Pointer Event None is applied to baseText which is label");
		assert.ok(textTest2List.length == 0, "Pointer Event None is Not applied to baseText which is not label");
		});
	});

	QUnit.test("BaseText when SelectOnlyGraphicalShape disabled ", function (assert) {
		this.oGantt.setSelectOnlyGraphicalShape(false);
		return utils.waitForGanttRendered(this.oGantt).then(function () {
		var testElements = document.getElementsByClassName("sapGanttTextNoPointerEvents");
		var textTest1List = Array.prototype.filter.call(testElements, function(testElement){
		return testElement.nodeName === 'text' && testElement.textContent == "Test1";
		});
		var textTest2List = Array.prototype.filter.call(testElements, function(testElement){
			return testElement.nodeName === 'text' && testElement.textContent == "Test2";
		});
		assert.ok(textTest1List.length == 0, "Pointer Event None is not applied to baseText which is label");
		assert.ok(textTest2List.length == 0, "Pointer Event None is not applied to baseText");
		});
	});

});
