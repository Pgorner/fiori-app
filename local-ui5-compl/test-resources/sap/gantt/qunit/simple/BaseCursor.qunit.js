/*global QUnit*/
sap.ui.define(["sap/gantt/simple/BaseCursor", "sap/gantt/utils/GanttChartConfigurationUtils"], function (BaseCursor, GanttChartConfigurationUtils) {
	"use strict";

	QUnit.test("default values", function (assert) {
		var oShape = new BaseCursor();
		assert.strictEqual(oShape.getLength(), 10, "Default length is 10");
		assert.strictEqual(oShape.getWidth(), 5, "Default width is 5");
		assert.strictEqual(oShape.getPointHeight(), 5, "Default pointHeight is 5");
	});

	QUnit.test("getD", function (assert) {
		var oShape = new BaseCursor({
			length:20,
			width: 15,
			pointHeight: 15,
			x: 0,
			rowYCenter: 10
		});
		var sPath;

		GanttChartConfigurationUtils.setRTL(true);
		sPath = "M 0 10 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In RTL mode, the return value is '" + sPath + "'");

		GanttChartConfigurationUtils.setRTL(false);
		sPath = "M 0 10 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In non RTL mode, the return value is '" + sPath + "'");
	});

	QUnit.test("getD for alignshape", function (assert) {
		var sPath;
		var oShape = new BaseCursor({
			length:20,
			width: 15,
			pointHeight: 15,
			x: 0,
			rowYCenter: 10
		});
		oShape._iBaseRowHeight = 48.79999923706055;
		GanttChartConfigurationUtils.setRTL(true);
		oShape.setAlignShape("Top");
		sPath = "M 0 -3 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In RTL mode, for alignShape = top the return value is '" + sPath + "'");

		oShape.setAlignShape("Middle");
		sPath = "M 0 10 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In RTL mode, for alignShape = middle the return value is '" + sPath + "'");

		oShape.setAlignShape("Bottom");
		sPath = "M 0 23 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In RTL mode, for alignShape = bottom the return value is '" + sPath + "'");

		GanttChartConfigurationUtils.setRTL(false);
		oShape.setAlignShape("Top");
		sPath = "M 0 -3 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In non RTL mode, for alignShape = top the return value is '" + sPath + "'");

		oShape.setAlignShape("Middle");
		sPath = "M 0 10 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In non RTL mode, for alignShape = middle the return value is '" + sPath + "'");

		oShape.setAlignShape("Bottom");
		sPath = "M 0 23 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In non RTL mode, for alignShape = bottom the return value is '" + sPath + "'");
	});

});
