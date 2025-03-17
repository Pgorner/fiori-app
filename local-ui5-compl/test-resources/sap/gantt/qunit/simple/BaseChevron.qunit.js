/*global QUnit */
sap.ui.define(["sap/gantt/simple/BaseChevron", "sap/gantt/utils/GanttChartConfigurationUtils",
"sap/gantt/simple/test/nextUIUpdate"], function (BaseChevron, GanttChartConfigurationUtils, nextUIUpdate) {
	"use strict";

	QUnit.module("Property", {
		beforeEach: function () {
			this.oChevron = new BaseChevron();
		},
		afterEach: function () {
			this.oChevron = null;
		}
	});

	QUnit.test("default values", function (assert) {
		assert.strictEqual(this.oChevron.getHeadWidth(), 10, "Default headWidth is 10");
		assert.strictEqual(this.oChevron.getTailWidth(), 10, "Default tailWidth is 10");
	});

	QUnit.module("Function", {
		beforeEach: function () {
			this.oChevron = new BaseChevron({
				x: 0,
				y: 0,
				width: 100,
				height: 20,
				headWidth: 20,
				tailWidth: 10,
				rowYCenter: 10
			});
			this.oChevron._iBaseRowHeight = 48.79999923706055;
		},
		afterEach: function () {
			this.oChevron = null;
		}
	});

	QUnit.test("getD", function (assert) {
		var sPath;

		GanttChartConfigurationUtils.setRTL(true);
		sPath = "M 0 10 l 20 -10 h 80 l -10 10 l 10 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In RTL mode, the return value is '" + sPath + "'");

		GanttChartConfigurationUtils.setRTL(false);
		sPath = "M 10 10 l -10 -10 h 80 l 20 10 l -20 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In non RTL mode, the return value is '" + sPath + "'");
	});

	QUnit.test("Verify the title property", async function (assert) {
		assert.strictEqual(this.oChevron.getTitle(), "", "Default value for title is set");
		this.oChevron.setTitle("Test Title");
		await nextUIUpdate();
		assert.strictEqual(this.oChevron.getTitle(), "Test Title", "Value of the title property is set");
	});

	QUnit.test("Verify the showTitle property", async function (assert) {
		assert.strictEqual(this.oChevron.getShowTitle(), false, "Default value for showTitle is false");
		this.oChevron.setShowTitle(true);
		await nextUIUpdate();
		assert.strictEqual(this.oChevron.getShowTitle(), true, "Value of the showTitle property is true");
	});

	QUnit.test("getD for alignshape", function (assert) {
		var sPath;

		GanttChartConfigurationUtils.setRTL(true);
		this.oChevron.setAlignShape("Top");
		sPath = "M 0 -3 l 20 -10 h 80 l -10 10 l 10 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In RTL mode, for alignShape = top the return value is '" + sPath + "'");

		this.oChevron.setAlignShape("Middle");
		sPath = "M 0 10 l 20 -10 h 80 l -10 10 l 10 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In RTL mode, for alignShape = middle the return value is '" + sPath + "'");

		this.oChevron.setAlignShape("Bottom");
		sPath = "M 0 23 l 20 -10 h 80 l -10 10 l 10 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In RTL mode, for alignShape = bottom the return value is '" + sPath + "'");

		GanttChartConfigurationUtils.setRTL(false);
		this.oChevron.setAlignShape("Top");
		sPath = "M 10 -3 l -10 -10 h 80 l 20 10 l -20 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In non RTL mode, for alignShape = top the return value is '" + sPath + "'");

		this.oChevron.setAlignShape("Middle");
		sPath = "M 10 10 l -10 -10 h 80 l 20 10 l -20 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In non RTL mode, for alignShape = middle the return value is '" + sPath + "'");

		this.oChevron.setAlignShape("Bottom");
		sPath = "M 10 23 l -10 -10 h 80 l 20 10 l -20 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In non RTL mode, for alignShape = bottom the return value is '" + sPath + "'");
	});

});
