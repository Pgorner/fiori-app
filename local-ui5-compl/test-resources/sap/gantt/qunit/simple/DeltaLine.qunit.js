/*global QUnit */
sap.ui.define(
	[
		"sap/gantt/simple/DeltaLine",
		"sap/gantt/simple/DeltaLineRenderer",
		"sap/ui/core/Core",
		"sap/gantt/simple/BaseConditionalShape",
		"./GanttQUnitUtils",
		"sap/gantt/simple/BaseRectangle",
		"sap/ui/core/RenderManager"
	],
	function (
		DeltaLine,
		DeltaLineRenderer,
		Core,
		BaseConditionalShape,
		GanttUtils,
		BaseRectangle,
		RenderManager
	) {
		"use strict";

		QUnit.module("Create DeltaLine with default values.", {
			beforeEach: function () {
				this.oDeltaLine = new DeltaLine();
			},
			afterEach: function () {
				this.oDeltaLine.destroy();
				this.oDeltaLine = undefined;
			}
		});

		QUnit.test("Test default configuration values.", function (assert) {
			assert.strictEqual(this.oDeltaLine.getStroke(), undefined);
			assert.strictEqual(this.oDeltaLine._getStrokeWidth(), 1);
			assert.strictEqual(this.oDeltaLine.getStrokeDasharray(), undefined);
			assert.strictEqual(this.oDeltaLine.getStrokeOpacity(), 1);
			assert.strictEqual(this.oDeltaLine.getTimeStamp(), undefined);
			assert.strictEqual(this.oDeltaLine.getDescription(), undefined);
			assert.strictEqual(this.oDeltaLine.getVisibleDeltaStartEndLines(), true);
		});

		QUnit.module("Create config.Mode with customized values.", {
			beforeEach: function () {
				this.oDeltaLine = new DeltaLine({
					stroke: "#DC143C",
					strokeDasharray: "5,5",
					strokeOpacity: 0.5,
					timeStamp: "20170315000000",
					endTimeStamp: "20170330000000",
					description: "DeltaLine Creation"
				});
			},
			afterEach: function () {
				this.oDeltaLine.destroy();
				this.oDeltaLine = undefined;
			}
		});

		QUnit.test("Test customized configuration values.", function (assert) {
			assert.strictEqual(this.oDeltaLine.getStroke(), "#DC143C");
			assert.strictEqual(this.oDeltaLine.getStrokeDasharray(), "5,5");
			assert.strictEqual(this.oDeltaLine.getStrokeOpacity(), 0.5);
			assert.strictEqual(this.oDeltaLine.getTimeStamp(), "20170315000000");
			assert.strictEqual(this.oDeltaLine.getEndTimeStamp(), "20170330000000");
			assert.strictEqual(
				this.oDeltaLine.getDescription(),
				"DeltaLine Creation"
			);
		});
		QUnit.module("Events on Delta Line in Gantt Chart.", {
			beforeEach: function () {
				this.oDeltaLine = new DeltaLine({
					stroke: "#DC143C",
					strokeDasharray: "5,5",
					strokeOpacity: 0.5,
					timeStamp: "20170315000000",
					endTimeStamp: "20170315000000",
					description: "Delta Line Demo"
				});

				this.oShape = new BaseConditionalShape({
					shapes: [
						new BaseRectangle({
							id: "r1",
							shapeId: "r1",
							x: 0,
							y: 0,
							rx: 10,
							ry: 10
						}),
						new BaseRectangle({
							id: "r2",
							shapeId: "r2",
							x: 0,
							y: 0,
							rx: 10,
							ry: 10
						})
					]
				});
				this.oGantt = GanttUtils.createSimpleGantt(
					this.oShape,
					"20180101000000",
					"20180102000000"
				);
				this.oGantt.placeAt("content");
			},
			afterEach: function () {
				this.oDeltaLine.destroy();
				this.oDeltaLine = undefined;
				this.oGantt.destroy();
				this.oGantt = undefined;
			}
		});

		QUnit.test("Click Event", function (assert) {
			var oRm = new RenderManager();
			DeltaLineRenderer.renderDeltaLineHeader(
				oRm,
				this.oDeltaLine,
				this.oGantt,
				60,
				20
			);
			DeltaLineRenderer.renderDeltaLines(oRm, this.oDeltaLine, this.oGantt);
			DeltaLineRenderer.renderChartAreaOfDeltaLines(oRm, this.oDeltaLine, this.oGantt);
			assert.strictEqual(this.oDeltaLine._getStartLine().getStrokeWidth(), 1);
			this.oDeltaLine._setIsSelected(true);
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			var done = assert.async();
			this.oDeltaLine.attachPress(function (oEvent) {
				assert.strictEqual(
					oEvent.getSource().getDescription(),
					"Delta Line Demo"
				);
				assert.strictEqual(parseInt(document.getElementById(oEvent.getSource()._getStartLine().sId).style.strokeWidth), 2);
				done();
			});

			this.oDeltaLine
				._getHeaderDeltaArea()
				.firePress(new jQuery.Event("click"));
		});
		QUnit.test("Event Mouse Leave.", function (assert) {
			var oRm = new RenderManager();
			DeltaLineRenderer.renderDeltaLineHeader(
				oRm,
				this.oDeltaLine,
				this.oGantt,
				60,
				20
			);
			DeltaLineRenderer.renderDeltaLines(oRm, this.oDeltaLine, this.oGantt);
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			var done = assert.async();
			this.oDeltaLine.attachMouseLeave(function (oEvent) {
				assert.strictEqual(
					oEvent.getSource().getDescription(),
					"Delta Line Demo"
				);
				done();
			});
			this.oDeltaLine
				._getHeaderDeltaArea()
				.fireMouseLeave(new jQuery.Event("mouseout"));
		});
		QUnit.test("Event Mouse Enter.", function (assert) {
			var oRm = new RenderManager();
			DeltaLineRenderer.renderDeltaLineHeader(
				oRm,
				this.oDeltaLine,
				this.oGantt,
				60,
				20
			);
			DeltaLineRenderer.renderDeltaLines(oRm, this.oDeltaLine, this.oGantt);
			assert.strictEqual(this.oDeltaLine._getStartLine().getStrokeWidth(), 1);
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			var done = assert.async();
			this.oDeltaLine.attachMouseEnter(function (oEvent) {
				assert.strictEqual(
					oEvent.getSource().getDescription(),
					"Delta Line Demo"
				);
				assert.strictEqual(parseInt(document.getElementById(oEvent.getSource()._getStartLine().sId).style.strokeWidth), 2);
				var oHeaderMarker = this.oDeltaLine._getHeaderDeltaArea();
				assert.strictEqual(oHeaderMarker.getTooltip(), "Delta Line Demo");
				done();
			}.bind(this));
			this.oDeltaLine
				._getHeaderDeltaArea()
				.fireMouseEnter(new jQuery.Event("mouseenter"));
		});
	}
);
