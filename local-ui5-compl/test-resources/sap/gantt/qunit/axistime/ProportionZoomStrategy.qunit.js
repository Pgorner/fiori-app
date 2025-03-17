/*global QUnit */
sap.ui.define([
	"sap/gantt/axistime/AxisTimeStrategyBase",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/misc/Format",
	"sap/gantt/qunit/data/DataProducer",
	"sap/ui/thirdparty/sinon",
	"sap/gantt/qunit/simple/GanttQUnitUtils",
	"sap/gantt/misc/AxisTime",
	"sap/gantt/axistime/ProportionTimeLineOptions"
], function (AxisTimeStrategyBase, ProportionZoomStrategy, TimeHorizon, GanttChart, Format, DataProducer, sinon, GanttQUnitUtils, AxisTime, ProportionTimeLineOptions) {
	"use strict";
	var oDataProducer = new DataProducer();
	oDataProducer.produceData("RESOURCES");
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oDataProducer.getData("RESOURCES"));

	var oGanttChart = new GanttChart({
		shapeDataNames: ["activity"],
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		},
		axisTimeStrategy: new ProportionZoomStrategy({
			coarsestTimeLineOption: ProportionTimeLineOptions["1month"],
			finestTimeLineOption: ProportionTimeLineOptions["5min"],
			timeLineOptions: ProportionTimeLineOptions,
			timeLineOption: ProportionTimeLineOptions["2week"],
			zoomLevel: 10,
			zoomLevels: 20,
			totalHorizon: new TimeHorizon({
				startTime: new Date(2015, 12, 1),
				endTime: new Date(2017, 11, 15)
			})
		})
	});
	oGanttChart.setModel(oModel, "test");
	oGanttChart.placeAt("content");

	QUnit.module("ProportionZoomStrategy", {
		beforeEach: function () {
			this.oStrategy = new ProportionZoomStrategy({
				coarsestTimeLineOption: ProportionTimeLineOptions["1month"],
				finestTimeLineOption: ProportionTimeLineOptions["5min"],
				timeLineOptions: ProportionTimeLineOptions,
				timeLineOption: ProportionTimeLineOptions["2week"],
				zoomLevel: 10,
				zoomLevels: 20,
				totalHorizon: new TimeHorizon({
					startTime: new Date(2015, 12, 1),
					endTime: new Date(2017, 11, 15)
				})
			});
			oGanttChart.setAxisTimeStrategy(this.oStrategy);
		}
	});

	QUnit.test("Test isLowerRowTickHourSensitive  function width customed configuration values.", function (assert) {
		var oCustomedVisibleHorizonStartTime = new Date(2016, 3, 21);
		var oCustomedVisibleHorizonEndTime = new Date(2016, 10, 15);
		this.oCustomedVisibleHorizon = new TimeHorizon({
			startTime: oCustomedVisibleHorizonStartTime,
			endTime: oCustomedVisibleHorizonEndTime
		});
		this.oStrategy.setVisibleHorizon(this.oCustomedVisibleHorizon);
		var oStrategy = this.oStrategy;

		assert.strictEqual(oStrategy.getVisibleHorizon().getStartTime(), Format.dateToAbapTimestamp(oCustomedVisibleHorizonStartTime), "startTime is set successfully after setVisibleHorizon");
		assert.strictEqual(oStrategy.getVisibleHorizon().getEndTime(), Format.dateToAbapTimestamp(oCustomedVisibleHorizonEndTime), "endTime is set successfully after setVisibleHorizon");

		var done = assert.async();
		setTimeout(function () {
			// we need some time to wait for the time line option being updated
			// assert.strictEqual(oStrategy.getTimeLineOption(), sap.gantt.axistime.ProportionTimeLineOptions["2week"], "function getTimeLineOption which is set into GanttChart works successfully");
			assert.ok(!oStrategy.isLowerRowTickHourSensitive(), "isLowerRowTickHourSensitive works successfully");
			done();
		}, 500);
	});

	QUnit.test("test createAxisTime", function (assert) {
		var oCustomedTotolHorizonStartTime = new Date(2016, 11, 1);
		var oCustomedTotolHorizonEndTime = new Date(2017, 10, 17);
		this.oCustomedTotalHorizon = new TimeHorizon({
			startTime: oCustomedTotolHorizonStartTime,
			endTime: oCustomedTotolHorizonEndTime
		});

		// set a new Totalhorizon will invoke createAxisTime
		this.oStrategy.setTotalHorizon(this.oCustomedTotalHorizon);
		this.oAxisTime = this.oStrategy.getAxisTime();
		assert.ok(this.oAxisTime instanceof AxisTime, "createAxisTime retval's type is correct");
		assert.strictEqual(oCustomedTotolHorizonStartTime.getTime(), this.oAxisTime.timeRange[0].getTime(), "oAxisTime's startTime is correct");
		assert.strictEqual(oCustomedTotolHorizonEndTime.getTime(), this.oAxisTime.timeRange[1].getTime(), "oAxisTime's endTime is correct");
		assert.strictEqual(this.oAxisTime.viewRange[0], 0, "oAxisTime's ViewRange startPoint is correct");
		assert.strictEqual(this.oAxisTime.viewRange[1], 1020, "oAxisTime's ViewRange endPoint is correct");
		assert.strictEqual(this.oAxisTime.locale, oGanttChart.getLocale(), "locale is correct");
	});

	QUnit.test("Test setZoomLevel setZoomLevels", function (assert) {
		var oReturn = this.oStrategy.setZoomLevel(2);
		assert.ok(oReturn instanceof ProportionZoomStrategy, "overwritten setZoomLevel return intance");
		this.oStrategy.setZoomLevels(3);
		assert.strictEqual(this.oStrategy.getProperty("zoomLevel"), 2, "setZoomLevel is correct");
		assert.strictEqual(this.oStrategy.getProperty("zoomLevels"), 3, "setZoomLevels is correct");
	});

	QUnit.test("Test updateStopInfo getTimeLineOption", function (assert) {
		var oStopInfo = {
			index: 100,
			text: "10 minutes interval"
		};

		this.oStrategy.updateStopInfo(oStopInfo);
		assert.strictEqual(this.oStrategy.getZoomLevel(), 100, "updateStopInfo works successfully");
	});

	QUnit.test("Test setTotalHorizon", function (assert) {
		var oAxisTimeStrategyBasePrivateSetTotalHorizonSpy = sinon.spy(AxisTimeStrategyBase.prototype, "_setTotalHorizon");
		var oCurrentVisibleHorizon = this.oStrategy.getVisibleHorizon();
		this.oStrategy.setTotalHorizon(oCurrentVisibleHorizon);
		var done = assert.async();

		assert.ok(oAxisTimeStrategyBasePrivateSetTotalHorizonSpy.calledOnce, "AxisTimeStrategyBase.prototype._setTotalHorizon should be called once.");
		oAxisTimeStrategyBasePrivateSetTotalHorizonSpy.restore();
		setTimeout(function () {
			//we must get the dom element just before we use it
			var $hsb = jQuery(oGanttChart.getTTHsbDom());
			assert.equal($hsb.scrollLeft(), 0, "Test HSB whether exists");
			done();
		}, 1000);
	});

	QUnit.test("Test disableAutoProportion ", function (assert) {
		this.oStrategy._bHorizontalScroll = null;
		this.oStrategy.setDisableAutoProportion(true);
		this.oStrategy.syncContext(1024);
		assert.ok(this.oStrategy._bHorizontalScroll === null, "_bHorizontalScroll is not set");
		this.oStrategy.setDisableAutoProportion(false);
		this.oStrategy.syncContext(1024);
		assert.ok(this.oStrategy._bHorizontalScroll !== null, "_bHorizontalScroll is set");
	});

	QUnit.module("ProportionZoomStrategy getRenderedVisibleHorizon API", {
		beforeEach: function () {
			this.gantt = GanttQUnitUtils.createGantt(true);
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Test RenderedVisibleHorizon has buffer or not", function (assert) {
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20210101000000",
				endTime: "20220101000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20210501000000",
				endTime: "20210601000000"
			})
		}));

		this.gantt.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var oAxisTimeStrategy = this.gantt.getAxisTimeStrategy();
			var oRenderedVisibleHorizon = oAxisTimeStrategy.getRenderedVisibleHorizon();
			var oCurrentVisibleHorizon = oAxisTimeStrategy.getCurrentVisibleHorizon();
			var bRenderedVisibleHorizonHasBuffer = false;
			if (oRenderedVisibleHorizon.getStartTime() <= oCurrentVisibleHorizon.getStartTime()
				&& oRenderedVisibleHorizon.getEndTime() >= oCurrentVisibleHorizon.getEndTime()) {
				bRenderedVisibleHorizonHasBuffer = true;
			}
			assert.equal(bRenderedVisibleHorizonHasBuffer, true, "Rendered Visible Horizon contains the buffer");
		}.bind(this));
	});

	QUnit.test("Test RenderedVisibleHorizon gets updated", function (assert) {
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20210101000000",
				endTime: "20220101000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20210101000000",
				endTime: "20210201000000"
			})
		}));

		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {
				this.gantt.attachEventOnce("visibleHorizonUpdate", function (oEvent) {
					var oCurrentRenderedVisibleHorizon = oEvent.getParameter("currentRenderedVisibleHorizon");
					var oLastRenderedVisibleHorizon = oEvent.getParameter("lastRenderedVisibleHorizon");
					var oCurrentVisibleHorizon = oEvent.getParameter("currentVisibleHorizon");
					var bRenderedVisibleHorizonShouldUpdate = (oCurrentVisibleHorizon.getStartTime() < oLastRenderedVisibleHorizon.getStartTime()
						|| oCurrentVisibleHorizon.getEndTime() > oLastRenderedVisibleHorizon.getEndTime());
					var bRenderedVisibleHorizonIsUpdated = (oCurrentRenderedVisibleHorizon.getStartTime() !== oLastRenderedVisibleHorizon.getStartTime()
						|| oCurrentRenderedVisibleHorizon.getEndTime() !== oLastRenderedVisibleHorizon.getEndTime());
					assert.equal(bRenderedVisibleHorizonShouldUpdate, bRenderedVisibleHorizonIsUpdated, "Rendered visible horizon gets updated");
					done();
				}, this);
				var hsb = this.gantt.getDomRef("hsb");
				hsb.scrollTo(hsb.scrollLeft + 250, 0);
				this.gantt.getAxisTimeStrategy().setZoomLevel(1);
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.module("ProportionZoomStrategy with millisecond enableMillisecondSupport", {
		beforeEach: function () {
			this.gantt = GanttQUnitUtils.createGantt(true);

			this.oStrategy = new ProportionZoomStrategy({
				enableMillisecondSupport: true,
				totalHorizon: new TimeHorizon({
					startTime: "20210101000000003",
					endTime: "20220101000000512"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20210101000000003",
					endTime: "20210201000000512"
				})
			});

			this.gantt.setAxisTimeStrategy(this.oStrategy);
			this.gantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oStrategy = null;
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Test ProportionZoomStrategy has millisecond support", function (assert) {
		var oTotalHorizon = this.oStrategy.getTotalHorizon();

		assert.strictEqual(Format.abapTimestampToDate(oTotalHorizon.getStartTime()).getMilliseconds(), 3);
		assert.strictEqual(Format.abapTimestampToDate(oTotalHorizon.getEndTime()).getMilliseconds(), 512);
	});

	QUnit.module("Test Update timeline options for ProportionZoomStrategy", {
		beforeEach: function () {
			this.oStrategy = new ProportionZoomStrategy({
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
