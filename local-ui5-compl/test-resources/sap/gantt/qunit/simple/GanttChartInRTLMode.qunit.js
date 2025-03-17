/*global QUnit,sinon */

sap.ui.define([
	"sap/gantt/library",
	"sap/gantt/misc/Format",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/simple/shapes/Task",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function (
	library,
	Format,
	BaseRectangle,
	GanttQUnitUtils,
	GanttUtils,
	Task,
	GanttChartConfigurationUtils
) {
	"use strict";

	var VisibleHorizonUpdateType = library.simple.VisibleHorizonUpdateType;


	//qunits for testing align shapes value
	QUnit.module("GanttChart Tasks", {
		beforeEach: function () {},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	//qunit for alignShape as default
	QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be set as default which would be on middle", function (assert) {
		var oShape = [
			new Task({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				type: "SummaryExpanded",
				height: 20
			}),
			new Task({
				shapeId: "1",
				time: Format.abapTimestampToDate("20181102000000"),
				endTime: Format.abapTimestampToDate("20181122000000"),
				type: "SummaryCollapsed",
				height: 20
			})
		];
		this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
		this.gantt.placeAt("qunit-fixture");
		var fnDone = assert.async();

		var oGantt = this.gantt;
		var aAllNonExpandedShapeUids = [
			"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
			"PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
		];
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var oRTLStub = sinon.stub(GanttChartConfigurationUtils, "getRTL").returns(true);
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXStart is set correctly in RTL Mode");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXEnd is set correctly in RTL Mode");
				oRTLStub.restore();
			});
			fnDone(); // need to wait because Table updates its rows async
		});
	});

	//qunit for alignShape as botttom
	QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be alligned to the bottom", function (assert) {
		var oShape = [
			new Task({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				type: "SummaryExpanded",
				height: 20,
				alignShape: sap.gantt.simple.shapes.ShapeAlignment.Bottom
			}),
			new Task({
				shapeId: "1",
				time: Format.abapTimestampToDate("20181102000000"),
				endTime: Format.abapTimestampToDate("20181122000000"),
				type: "SummaryCollapsed",
				height: 20,
				alignShape: sap.gantt.simple.shapes.ShapeAlignment.Bottom
			})
		];
		this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
		this.gantt.placeAt("qunit-fixture");
		var oGantt = this.gantt;
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var oRTLStub = sinon.stub(GanttChartConfigurationUtils, "getRTL").returns(true);
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXStart is set correctly in RTL Mode");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXEnd is set correctly in RTL Mode");
				oRTLStub.restore();
			});
			fnDone(); // need to wait because Table updates its rows async
		});
	});

	//qunit for alignShape as top
	QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be alligned to the top", function (assert) {
		var oShape = [
			new Task({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				type: "SummaryExpanded",
				height: 20,
				alignShape: sap.gantt.simple.shapes.ShapeAlignment.Top
			}),
			new Task({
				shapeId: "1",
				time: Format.abapTimestampToDate("20181102000000"),
				endTime: Format.abapTimestampToDate("20181122000000"),
				type: "SummaryCollapsed",
				height: 20,
				alignShape: sap.gantt.simple.shapes.ShapeAlignment.Top
			})
		];
		this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
		this.gantt.placeAt("qunit-fixture");
		var oGantt = this.gantt;
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var oRTLStub = sinon.stub(GanttChartConfigurationUtils, "getRTL").returns(true);
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXStart is set correctly in RTL Mode");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXEnd is set correctly in RTL Mode");
				oRTLStub.restore();
			});
			fnDone();
		});
	});

	//qunit for alignShape as center
	QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be alligned to the Middle", function (assert) {
		var oShape = [
			new Task({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				type: "SummaryExpanded",
				height: 20,
				alignShape: sap.gantt.simple.shapes.ShapeAlignment.Middle
			}),
			new Task({
				shapeId: "1",
				time: Format.abapTimestampToDate("20181102000000"),
				endTime: Format.abapTimestampToDate("20181122000000"),
				type: "SummaryCollapsed",
				height: 20,
				alignShape: sap.gantt.simple.shapes.ShapeAlignment.Middle
			})
		];
		this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
		this.gantt.placeAt("qunit-fixture");
		var oGantt = this.gantt;
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var oRTLStub = sinon.stub(GanttChartConfigurationUtils, "getRTL").returns(true);
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXStart is set correctly in RTL Mode");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXEnd is set correctly in RTL Mode");
				oRTLStub.restore();
			});
			fnDone();
		});
	});

	//qunit for type normal. It should always be middle aligned
	QUnit.test("Gantt Chart Tasks for type normal with Bottom Alignment", function (assert) {
		var oShape = [
			new Task({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				type: "Normal",
				height: 20,
				alignShape: sap.gantt.simple.shapes.ShapeAlignment.Bottom
			})
		];
		this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
		this.gantt.placeAt("qunit-fixture");
		var oGantt = this.gantt;
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var oRTLStub = sinon.stub(GanttChartConfigurationUtils, "getRTL").returns(true);
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXStart is set correctly in RTL Mode");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXEnd is set correctly in RTL Mode");
				oRTLStub.restore();
			});
			fnDone();
		});
	});

	//qunit for task for type error. It should always be middle aligned.
	QUnit.test("Gantt Chart Tasks for type error with Top Alignment", function (assert) {
		var oShape = [
			new Task({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				type: "Error",
				height: 20,
				alignShape: sap.gantt.simple.shapes.ShapeAlignment.Top
			})
		];
		this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
		this.gantt.placeAt("qunit-fixture");
		var oGantt = this.gantt;
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var oRTLStub = sinon.stub(GanttChartConfigurationUtils, "getRTL").returns(true);
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXStart is set correctly in RTL Mode");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXEnd is set correctly in RTL Mode");
				oRTLStub.restore();
			});
			fnDone();
		});
	});

	//qunit with default align shape with type as error. It should be middle aligned
	QUnit.test("Gantt Chart Tasks for type error", function (assert) {
		var oShape = [
			new Task({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				type: "Error",
				height: 20
			})
		];
		this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
		this.gantt.placeAt("qunit-fixture");
		var oGantt = this.gantt;
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var oRTLStub = sinon.stub(GanttChartConfigurationUtils, "getRTL").returns(true);
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXStart is set correctly in RTL Mode");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXEnd is set correctly in RTL Mode");
				oRTLStub.restore();
			});
			fnDone();
		});
	});

	QUnit.test("HorizontalScroll fired for RTL Mode", function (assert) {
		var oShape = [
			new BaseRectangle({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				height: 20
			})
		];
		this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20131001000000", "20251129000000");
		this.gantt.placeAt("qunit-fixture");
		var fnDone = assert.async();
		var oOriginalHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone();
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var oRTLStub = sinon.stub(GanttChartConfigurationUtils, "getRTL").returns(true);
			var oHandler = GanttQUnitUtils.debounce(function (oEvent) {
				assert.equal(oEvent.getParameter("type"), VisibleHorizonUpdateType.HorizontalScroll, "HorizontalScroll event should have happened.");
				assert.ok(oOriginalHorizon.equals(oEvent.getParameter("lastVisibleHorizon")), "HorizontalScroll event should have happened.");
				assert.ok(this.gantt.getAxisTimeStrategy().getVisibleHorizon().equals(oEvent.getParameter("currentVisibleHorizon")), "Current VisibleHorizon should be correct.");
				assert.notOk(oEvent.getParameter("lastVisibleHorizon").equals(oEvent.getParameter("currentVisibleHorizon")), "Visible horizon should have changed.");
				oRTLStub.restore();
				fnDone();
			}.bind(this), 50);

			this.gantt.attachEventOnce("visibleHorizonUpdate", oHandler, this);
			this.gantt.$("hsb").scrollLeft(1000);
		}.bind(this));
	});
});
