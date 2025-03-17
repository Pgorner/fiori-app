/*global QUnit, sinon */

sap.ui.define([
	"sap/gantt/simple/shapes/Task",
    "sap/gantt/misc/Format",
    "sap/gantt/library",
    "sap/gantt/simple/InnerGanttChartRenderer",
	"sap/ui/core/RenderManager"
], function(Task, Format, ganttLib, InnerGanttChartRenderer, RenderManager) {
	"use strict";

    var TaskType = ganttLib.simple.shapes.TaskType;

	QUnit.module("Rendering", {
		beforeEach: function () {
			this.oTask = new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                height: 20,
                tooltip: "Sample Tooltip"
            });
            this.oRm = new RenderManager();
		},
		afterEach: function () {
			this.oTask = undefined;
            this.oRm = undefined;
		}
	});

	QUnit.test("Render Tooltip for normal tasks", function (assert) {
        this.oTask.renderElement(this.oRm);
        this.oRm.flush(window.document.getElementById("qunit-fixture"));
        this.oRm.destroy();
        assert.ok(this.oTask.$().find("title").text() === "Sample Tooltip", "Correctly Rendered Tooltip");
    });
    QUnit.test("Render Tooltip for Error tasks", function (assert) {
        this.oTask.setType(TaskType.Error);
        //Setup
        sinon.stub(InnerGanttChartRenderer, "renderHelperDefs");
        this.oTask.renderElement(this.oRm);
        this.oRm.flush(window.document.getElementById("qunit-fixture"));
        this.oRm.destroy();
        assert.ok(this.oTask.$().find("title").text() === "Sample Tooltip", "Correctly Rendered Tooltip");
    });
    QUnit.test("Render Tooltip for Summary Expanded tasks", function (assert) {
        this.oTask.setType(TaskType.SummaryExpanded);
        this.oTask.renderElement(this.oRm);
        this.oRm.flush(window.document.getElementById("qunit-fixture"));
        this.oRm.destroy();
        assert.ok(this.oTask.$().find("title").text() === "Sample Tooltip", "Correctly Rendered Tooltip");
    });
    QUnit.test("Render Tooltip for Summary Collapsed tasks", function (assert) {
        this.oTask.setType(TaskType.SummaryCollapsed);
        this.oTask.renderElement(this.oRm);
        this.oRm.flush(window.document.getElementById("qunit-fixture"));
        this.oRm.destroy();
        assert.ok(this.oTask.$().find("title").text() === "Sample Tooltip", "Correctly Rendered Tooltip");
    });

});
