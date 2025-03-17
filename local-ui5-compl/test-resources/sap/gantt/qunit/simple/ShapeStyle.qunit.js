

/*global QUnit */
sap.ui.define([
	"sap/gantt/simple/ShapeStyle"
], function (ShapeStyle) {
	"use strict";

	QUnit.module("Create ShapeStyle with default values.", {
		beforeEach: function () {
			this.oShapeStyle = new ShapeStyle();
		},
		afterEach: function () {
			this.oShapeStyle.destroy();
			this.oShapeStyle = undefined;
		}
	});

	QUnit.test("Test default configuration values." , function (assert) {
		assert.strictEqual(this.oShapeStyle.getName(), undefined);
		assert.strictEqual(this.oShapeStyle.getEventState(), undefined);
		assert.strictEqual(this.oShapeStyle.getStroke(), undefined);
		assert.strictEqual(this.oShapeStyle.getStrokeWidth(), 1);
		assert.strictEqual(this.oShapeStyle.getStrokeDasharray(), undefined);
        assert.strictEqual(this.oShapeStyle.getFill(), undefined);
        assert.strictEqual(this.oShapeStyle.getTextFill(), undefined);
        assert.strictEqual(this.oShapeStyle.getVisible(), true);

	});

	QUnit.module("Create config.Mode with customized values.", {
		beforeEach: function () {
			this.oShapeStyle = new ShapeStyle({
                name: "ghostDrag1",
                eventState: "DragDrop",
                fill: "#DC143C",
				stroke: "#DC143C",
				strokeWidth: 2,
				strokeDasharray: "5,5",
                textFill: "#DC143C"
			});
		},
		afterEach: function () {
			this.oShapeStyle.destroy();
			this.oShapeStyle = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oShapeStyle.getName(), "ghostDrag1");
		assert.strictEqual(this.oShapeStyle.getEventState(), "DragDrop");
		assert.strictEqual(this.oShapeStyle.getStroke(), "#DC143C");
		assert.strictEqual(this.oShapeStyle.getStrokeWidth(), 2);
		assert.strictEqual(this.oShapeStyle.getStrokeDasharray(), "5,5");
        assert.strictEqual(this.oShapeStyle.getFill(), "#DC143C");
        assert.strictEqual(this.oShapeStyle.getTextFill(), "#DC143C");
        assert.strictEqual(this.oShapeStyle.getVisible(), true);
	});
});
