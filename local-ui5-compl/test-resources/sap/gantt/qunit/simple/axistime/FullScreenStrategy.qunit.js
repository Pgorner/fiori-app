/*global QUnit */
sap.ui.define("FullScreenStrategyTestCase", [
	"sap/gantt/axistime/FullScreenStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/library",
	"sap/gantt/axistime/ProportionTimeLineOptions",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/misc/Format",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/thirdparty/sinon"
], function (FullScreenStrategy, TimeHorizon, library, ProportionTimeLineOptions, BaseRectangle, Format, GanttQUnitUtils, sinon) {
	"use strict";

	var oShape = [
		new BaseRectangle({
			shapeId: "0",
			time: Format.abapTimestampToDate("20150929000000"),
			endTime: Format.abapTimestampToDate("20151001000000"),
			height: 20
		})
	];

	var oStrategy = new FullScreenStrategy({
		visibleHorizon: new TimeHorizon({
			startTime: "20150918000000",
			endTime: "20151027000000"
		}),
		coarsestTimeLineOption: ProportionTimeLineOptions["5min"],
		finestTimeLineOption: ProportionTimeLineOptions["1month"],
		timeLineOptions: library.config.DEFAULT_TIME_ZOOM_STRATEGY,
		timeLineOption: ProportionTimeLineOptions["30min"]
	});

	var oGanttChart = GanttQUnitUtils.createSimpleGanttwithAxisTimeStratergy(oShape, oStrategy);
	oGanttChart.placeAt("content");
	QUnit.module("Create axistime.FullScreenStrategy.");

	QUnit.test("Test initial visible horizon.", function (assert) {
		var oVisibleHorizon = oStrategy.getVisibleHorizon();

		assert.strictEqual(oVisibleHorizon.getStartTime(), "20150918000000");
		assert.strictEqual(oVisibleHorizon.getEndTime(), "20151027000000");
	});

	QUnit.test("Test syncContext function.", function (assert) {
		var oSyncResult = oStrategy.syncContext(400);

		assert.ok(!oSyncResult.zoomLevelChanged, "zoomLevelChanged is correct");
		assert.ok(oSyncResult.axisTimeChanged, "axisTimeChanged is correct");
	});

	QUnit.test("Test default configuration values.", function (assert) {
		oStrategy = new FullScreenStrategy();
		assert.strictEqual(oStrategy.getCoarsestTimeLineOption(), ProportionTimeLineOptions["1month"], "coarsestTimeLineOption's defaultvalue is correct");
		assert.strictEqual(oStrategy.getFinestTimeLineOption(), ProportionTimeLineOptions["5min"], "finestTimeLineOption's defaultvalue is correct");
		assert.strictEqual(oStrategy.getTimeLineOptions(), ProportionTimeLineOptions, "TimeLineOptions's defaultvalue is correct");
		assert.strictEqual(oStrategy.getTimeLineOption(), ProportionTimeLineOptions["4day"], "TimeLineOption's defaultvalue is correct");
		assert.strictEqual(oStrategy.getMouseWheelZoomType(), library.MouseWheelZoomType.None, "mouseWheelZoomType defaultvalue is correct");
	});
	QUnit.test("Test setMouseWheelZoomType method", function(assert) {
		var result = oStrategy.setMouseWheelZoomType(library.MouseWheelZoomType.FineGranular);
		assert.deepEqual(result, oStrategy, "setter method return 'this' correctly.");
		assert.strictEqual(oStrategy.getMouseWheelZoomType(), library.MouseWheelZoomType.None, "mouseWheelZoomType value is not changed.");
	});

	QUnit.module("Test Update timeline options for FullScreenStrategy", {
		beforeEach: function () {
			this.oStrategy = new FullScreenStrategy({
			});
		},
		afterEach: function () {
			this.oStrategy = null;
		}
	});

	QUnit.test("Update timeline option should use the AxisTime continuousScale", function (assert) {
		const oAxisTime = {
			continuousScale: () => {},
			timeToView: () => {}
		};

		const fnGetAxisTimeStub = sinon.stub(this.oStrategy, "getAxisTime");
		const fnGetTimelineOptionsStub = sinon.stub(this.oStrategy, "getTimeLineOptions");
		const fnTimeToViewSpy = sinon.stub(oAxisTime, "timeToView");

		fnGetAxisTimeStub.returns({
			continuousScale: oAxisTime.continuousScale,
			timeToView: fnTimeToViewSpy
		});

		fnGetTimelineOptionsStub.returns({
			"1min": ProportionTimeLineOptions["1min"]
		});

		this.oStrategy._updateTimeLineOption();

		assert.equal(fnTimeToViewSpy.callCount, 2, "Time to view called for start and end time");
		assert.equal(fnTimeToViewSpy.getCall(0).args[2], oAxisTime.continuousScale, "Called with continuous scale");
		assert.equal(fnTimeToViewSpy.getCall(1).args[2], oAxisTime.continuousScale, "Called with continuous scale");

		fnGetAxisTimeStub.restore();
		fnGetTimelineOptionsStub.restore();
		fnTimeToViewSpy.restore();
	});
});
