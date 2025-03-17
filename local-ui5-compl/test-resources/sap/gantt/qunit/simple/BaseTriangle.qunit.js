/*global QUnit */
sap.ui.define(["sap/gantt/simple/BaseTriangle", "sap/gantt/utils/GanttChartConfigurationUtils",
"sap/ui/core/RenderManager"], function (
	BaseTriangle,
	GanttChartConfigurationUtils,
	RenderManager
) {
	"use strict";

	QUnit.module("Property", {
		beforeEach: function () {
			this.oTriangle = new BaseTriangle();
		},
		afterEach: function () {
			this.oTriangle = null;
		}
	});

	QUnit.test("default values of properties", function (assert) {
		assert.strictEqual(this.oTriangle.getWidth(), 0, "Default width is 0");
		assert.strictEqual(this.oTriangle.getHeight(), 0, "Default height is 0");
		assert.strictEqual(
			this.oTriangle.getOrientation(),
			"right",
			"Default orientation is right"
		);
	});

	QUnit.module("Function", {
		beforeEach: function () {
			this.oTriangle = new BaseTriangle({
				x: 0,
				y: 0,
				width: 30,
				height: 20,
				rowYCenter: 10,
				orientation: "left",
				selectable: true
			});
		},
		afterEach: function () {
			this.oTriangle = null;
		}
	});

	QUnit.test("getD for left orientation", function (assert) {
		var sPath;

		GanttChartConfigurationUtils.setRTL(true);
		sPath = "M 1 10 l -30 10 l 30 10 Z";
		assert.strictEqual(
			this.oTriangle.getD(),
			sPath,
			"In RTL mode, the return value is '" + sPath + "'"
		);

		GanttChartConfigurationUtils.setRTL(false);
		sPath = "M 1 10 l -30 10 l 30 10 Z";
		assert.strictEqual(
			this.oTriangle.getD(),
			sPath,
			"In non RTL mode, the return value is '" + sPath + "'"
		);
	});

	QUnit.test("getD for right orientation", function (assert) {
		this.oTriangle = new BaseTriangle({
			x: 0,
			y: 0,
			width: 30,
			height: 20,
			rowYCenter: 10,
			orientation: "right"
		});
		var sPath;

		GanttChartConfigurationUtils.setRTL(true);
		sPath = "M -1 10 l 30 10 l -30 10 Z";
		assert.strictEqual(
			this.oTriangle.getD(),
			sPath,
			"In RTL mode, the return value is '" + sPath + "'"
		);

		GanttChartConfigurationUtils.setRTL(false);
		sPath = "M -1 10 l 30 10 l -30 10 Z";
		assert.strictEqual(
			this.oTriangle.getD(),
			sPath,
			"In non RTL mode, the return value is '" + sPath + "'"
		);
	});

	QUnit.test("Rendering", function (assert) {
		var oRm = new RenderManager();
		this.oTriangle.renderElement(oRm, this.oTriangle);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();
		assert.ok(
			jQuery("#qunit-fixture").find("path").length === 1,
			"Rendering triangle is OK"
		);
	});

	QUnit.test("Event Click.", function (assert) {
		var oRm = new RenderManager();
		this.oTriangle.renderElement(oRm, this.oTriangle);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();
		this.oTriangle.attachPress(function (oEvent) {
			assert.ok("Click triggered from Press Event.");
			assert.strictEqual(oEvent.getSource().getWidth(), 30);
			done();
		});
		var done = assert.async();
		var oEvent = jQuery.Event({type : "sapselect"});
		oEvent.target = this.oTriangle.getDomRef();
		var aTriangleClass = this.oTriangle.getDomRef().getAttribute("class").split(" ");
		aTriangleClass.push("sapGanntChartMarkerCursorPointer");
		this.oTriangle.getDomRef().setAttribute("class", aTriangleClass.toString().replaceAll(",", " "));
		oEvent.target = this.oTriangle.getDomRef();
		this.oTriangle.onclick(oEvent);

	});

	QUnit.test("Event Mouse Enter.", function (assert) {
		var oRm = new RenderManager();
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		this.oTriangle.attachMouseEnter(function (oEvent) {
			assert.strictEqual(oEvent.getSource().getWidth(), 30);
			done();
		});
		this.oTriangle.onmouseover(new jQuery.Event("mouseenter"));
	});

	QUnit.test("Event Mouse Leave.", function (assert) {
		var oRm = new RenderManager();
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		this.oTriangle.attachMouseLeave(function (oEvent) {
			assert.strictEqual(oEvent.getSource().getWidth(), 30);
			done();
		});
		this.oTriangle.onmouseout(new jQuery.Event("mouseout"));
	});

	QUnit.module("Test Align Shape", {
		beforeEach: function () {
			this.oTriangle = new BaseTriangle({
				x: 0,
				width: 30,
				height: 20,
				rowYCenter: 10,
				orientation: "left",
				time: new Date(Date.UTC(2018, 2, 22)),
				endTime: new Date(Date.UTC(2018, 2, 22, 0, 0, 51))
			});
			this.oTriangle._iBaseRowHeight = 48.79999923706055;
		},
		afterEach: function () {
			this.oTriangle = null;
		}
	});
	QUnit.test("getD for left orientation", function (assert) {
		var sPath;

		GanttChartConfigurationUtils.setRTL(true);

		this.oTriangle.setAlignShape("Top");
		sPath = "M 1 -13 l -30 10 l 30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = top the return value is '" + sPath + "'");

		this.oTriangle.setAlignShape("Middle");
		sPath = "M 1 0 l -30 10 l 30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = middle the return value is '" + sPath + "'");

		this.oTriangle.setAlignShape("Bottom");
		sPath = "M 1 13 l -30 10 l 30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = bottom the return value is '" + sPath + "'");

		GanttChartConfigurationUtils.setRTL(false);

		this.oTriangle.setAlignShape("Top");
		sPath = "M 1 -13 l -30 10 l 30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath,	"In non RTL mode, for alignShape = top the return value is '" + sPath + "'");

		this.oTriangle.setAlignShape("Middle");
		sPath = "M 1 0 l -30 10 l 30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = middle the return value is '" + sPath + "'");

		this.oTriangle.setAlignShape("Bottom");
		sPath = "M 1 13 l -30 10 l 30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = bottom the return value is '" + sPath + "'");
	});

	QUnit.test("getD for right orientation", function (assert) {
		var sPath;

		this.oTriangle.setOrientation("right");
		GanttChartConfigurationUtils.setRTL(true);

		this.oTriangle.setAlignShape("Top");
		sPath = "M -1 -13 l 30 10 l -30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = top the return value is '" + sPath + "'");

		this.oTriangle.setAlignShape("Middle");
		sPath = "M -1 0 l 30 10 l -30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = middle the return value is '" + sPath + "'");

		this.oTriangle.setAlignShape("Bottom");
		sPath = "M -1 13 l 30 10 l -30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = bottom the return value is '" + sPath + "'");

		GanttChartConfigurationUtils.setRTL(false);
		this.oTriangle.setAlignShape("Top");
		sPath = "M -1 -13 l 30 10 l -30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath,	"In non RTL mode, for alignShape = top the return value is '" + sPath + "'");

		this.oTriangle.setAlignShape("Middle");
		sPath = "M -1 0 l 30 10 l -30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = middle the return value is '" + sPath + "'");

		this.oTriangle.setAlignShape("Bottom");
		sPath = "M -1 13 l 30 10 l -30 10 Z";
		assert.strictEqual(this.oTriangle.getD(),sPath, "In RTL mode, for alignShape = bottom the return value is '" + sPath + "'");
	});
});
