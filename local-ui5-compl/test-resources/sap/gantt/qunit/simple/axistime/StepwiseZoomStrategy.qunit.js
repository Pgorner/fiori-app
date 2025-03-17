/*global QUnit */
sap.ui.define("StepwiseZoomStrategyTestCase", [
	"sap/gantt/axistime/AxisTimeStrategyBase",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/misc/Format",
	"sap/ui/thirdparty/sinon",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/gantt/library"
], function (AxisTimeStrategyBase, StepwiseZoomStrategy, BaseRectangle, GanttQUnitUtils, TimeHorizon, Format, sinon, GanttChartConfigurationUtils, library) {
	"use strict";

	var oShape = [
		new BaseRectangle({
			shapeId: "0",
			time: Format.abapTimestampToDate("20160929000000"),
			endTime: Format.abapTimestampToDate("20161001000000"),
			height: 20
		})
	];

	var oStrategy = new StepwiseZoomStrategy({});

	var oGanttChart = GanttQUnitUtils.createSimpleGanttwithAxisTimeStratergy(oShape, oStrategy);

	QUnit.module("StepwiseZoomStrategy", {
		beforeEach: function () {
			oGanttChart.setAxisTimeStrategy(new StepwiseZoomStrategy({}));
			this.oStrategy = oGanttChart.getAxisTimeStrategy();
			this.oStrategy.createAxisTime(library.config.DEFAULT_LOCALE.clone());
			GanttChartConfigurationUtils.setRTL(false);
		},
		afterEach: function () {
			GanttChartConfigurationUtils.setRTL(false);
		}
	});

	QUnit.test("Test setZoomLevels: value remains unchanged after calling setter", function (assert) {
		this.oStrategy.setZoomLevels(100);
		assert.strictEqual(this.oStrategy.getZoomLevels(), 11, "value changed after calling setter to support mouse wheel");
	});
	QUnit.test("Test setCoarsestTimeLineOption: value remains unchanged after calling setter", function (assert) {
		this.oStrategy.setCoarsestTimeLineOption({});
		assert.strictEqual(this.oStrategy.getCoarsestTimeLineOption(), undefined, "value remains unchanged after calling setter, default value is undefined");
	});
	QUnit.test("Test setFinestTimeLineOption: value remains unchanged after calling setter", function (assert) {
		this.oStrategy.setFinestTimeLineOption({});
		assert.strictEqual(this.oStrategy.getFinestTimeLineOption(), undefined, "value remains unchanged after calling setter, default value is undefined");
	});
	QUnit.test("Test _updateZoomRateArray: this._aZoomRate array is updated according to timeLineOptions property", function (assert) {
		this.oStrategy = new StepwiseZoomStrategy({
			timeLineOptions: {
				"option1": {
					innerInterval: {
						unit: library.config.TimeUnit.day,
						span: 1,
						range: 32
					}
				}
			}
		});
		assert.strictEqual(this.oStrategy._aZoomRate.length, 1, "this._aZoomRate's length equals to the account of timeLineOptions properties");

		this.oStrategy.setTimeLineOptions(
			{
				"option2": {
					innerInterval: {
						unit: library.config.TimeUnit.week,
						span: 1,
						range: 48
					}
				},
				"option3": {
					innerInterval: {
						unit: library.config.TimeUnit.day,
						span: 1,
						range: 32
					}
				}
			}
		);
		assert.strictEqual(this.oStrategy._aZoomRate.length, 2, "this._aZoomRate's length equals to the account of timeLineOptions properties");
	});

	QUnit.test("Test setTotalHorizon: should call AxisTimeStrategyBase._setTotalHorizon", function (assert) {
		var oAxisTimeStrategyBasePrivateSetTotalHorizonSpy = sinon.spy(AxisTimeStrategyBase.prototype, "_setTotalHorizon");

		this.oStrategy.setTotalHorizon(new TimeHorizon({
			startTime: "20140101000000",
			endTime: "20160101000000"
		}));

		assert.ok(oAxisTimeStrategyBasePrivateSetTotalHorizonSpy.calledOnce, "AxisTimeStrategyBase.prototype._setTotalHorizon should be called once.");
		oAxisTimeStrategyBasePrivateSetTotalHorizonSpy.restore();
	});

	QUnit.test("Test setTotalHorizon: The time range and view range of this.getAxisTime() will also be updated, the rate will remain unchanged.", function (assert) {
		this.oStrategy.setTotalHorizon(new TimeHorizon({
			startTime: "20140101000000",
			endTime: "20160101000000"
		}));

		var oAxisTime = this.oStrategy.getAxisTime();
		var iRate = oAxisTime.getZoomRate();
		var aTimeRange = oAxisTime.getTimeRange();
		var aViewRange = oAxisTime.getViewRange();

		this.oStrategy.setTotalHorizon(new TimeHorizon({
			startTime: "20130601000000",
			endTime: "20170101000000"
		}));

		assert.notEqual(oAxisTime.getTimeRange()[0].getTime(), aTimeRange[0].getTime(), "The timeRange[0] of this.getAxisTime() is also updated.");
		assert.notEqual(oAxisTime.getTimeRange()[1].getTime(), aTimeRange[1].getTime(), "The timeRange[1] of this.getAxisTime() is also updated.");
		assert.strictEqual(oAxisTime.getViewRange()[0], 0, "The viewRange[0] of this.getAxisTime() is always 0.");
		assert.notEqual(oAxisTime.getViewRange()[1], aViewRange[1], "The view range of this.getAxisTime() is updated.");
		assert.strictEqual(oAxisTime.getZoomRate(), iRate, "The rate of this.getAxisTime() is unchanged.");
	});
	QUnit.test("Test setZoomLevel: zoom rate and visible horizon will be changed", function (assert) {
		sap.gantt.axistime.AxisTimeStrategyBase.prototype.updateGanttVisibleWidth.call(this.oStrategy, 900);
		this.oStrategy.setZoomLevel(1);
		var oAxisTime = this.oStrategy.getAxisTime();
		var iRate = oAxisTime.getZoomRate();
		var sStartTime = this.oStrategy.getVisibleHorizon().getStartTime();
		var sEndTime = this.oStrategy.getVisibleHorizon().getEndTime();

		this.oStrategy.setZoomLevel(2);

		assert.notEqual(this.oStrategy.getAxisTime().getZoomRate(), iRate, "zoom rate changed");
		assert.notEqual(this.oStrategy.getVisibleHorizon().getStartTime(), sStartTime, "visible horizon start time changed");
		assert.notEqual(this.oStrategy.getVisibleHorizon().getEndTime(), sEndTime, "visible horizon end time changed");
	});
	QUnit.test("Test setTimeLineOptions: this._aZoomRate array is updated according to timeLineOptions property", function (assert) {
		assert.strictEqual(true, true, "See the test of _updateZoomRateArray");
	});
	QUnit.test("Test _getIndexOfTimeLineOption and _getTimeLineOptionByIndex", function (assert) {
		var oTimeLineOptions = this.oStrategy.getTimeLineOptions();
		var iIndex = 0;
		for (var i in oTimeLineOptions) {
			assert.strictEqual(this.oStrategy._getIndexOfTimeLineOption(oTimeLineOptions[i], oTimeLineOptions), iIndex, "index: " + iIndex + " is correct");
			assert.strictEqual(this.oStrategy._getIndexOfTimeLineOption(oTimeLineOptions[i]), iIndex, "index: " + iIndex + " is correct");
			assert.strictEqual(this.oStrategy._getTimeLineOptionByIndex(iIndex), oTimeLineOptions[i], "oTimeLineOption got by index: " + iIndex + " is correct");

			iIndex++;
		}
	});
	QUnit.test("Test _getWidthOfTotalHorizon", function (assert) {
		var oTotalHorizon = this.oStrategy.getTotalHorizon();
		var startTime = Format.getTimeStampFormatter().parse(oTotalHorizon.getStartTime());
		var endTime = Format.getTimeStampFormatter().parse(oTotalHorizon.getEndTime());
		var oAxisTime = this.oStrategy.getAxisTime();
		var start = oAxisTime.timeToView(startTime);
		var end = oAxisTime.timeToView(endTime);

		assert.strictEqual(end - start, this.oStrategy._getWidthOfTotalHorizon(), "OK");
		assert.strictEqual(this.oStrategy._getWidthOfTotalHorizon() > 0, true, "_getWidthOfTotalHorizon returns positive value");
	});
	QUnit.test("(RTL) Test _getWidthOfTotalHorizon", function (assert) {
		GanttChartConfigurationUtils.setRTL(true);
		var oTotalHorizon = this.oStrategy.getTotalHorizon();
		var startTime = Format.getTimeStampFormatter().parse(oTotalHorizon.getStartTime());
		var endTime = Format.getTimeStampFormatter().parse(oTotalHorizon.getEndTime());
		var oAxisTime = this.oStrategy.getAxisTime();
		var start = oAxisTime.timeToView(startTime);
		var end = oAxisTime.timeToView(endTime);

		assert.strictEqual(Math.abs(end - start), this.oStrategy._getWidthOfTotalHorizon(), "OK");
		assert.strictEqual(this.oStrategy._getWidthOfTotalHorizon() > 0, true, "_getWidthOfTotalHorizon returns positive value");
	});
	QUnit.test("Test _extendTotalHorizon: end time of total horizon will be extended when the given width is larger than the width of total horizon", function (assert) {
		var iWidthOfTotalHorizon = this.oStrategy._getWidthOfTotalHorizon();
		var oTotalHorizonBeforeExtension = this.oStrategy.getTotalHorizon();
		var dEndTimeBeforeExtension = Format.getTimeStampFormatter().parse(oTotalHorizonBeforeExtension.getEndTime());
		this.oStrategy._extendTotalHorizon(iWidthOfTotalHorizon + 100);
		var oTotalHorizonAfterExtension = this.oStrategy.getTotalHorizon();
		var dEndTimeAfterExtension = Format.getTimeStampFormatter().parse(oTotalHorizonAfterExtension.getEndTime());

		assert.strictEqual(dEndTimeAfterExtension.getTime() > dEndTimeBeforeExtension.getTime(), true, "end time of total horizon is extended.");
	});
	QUnit.test("(RTL mode) Test _extendTotalHorizon: end time of total horizon will be extended when the given width is larger than the width of total horizon", function (assert) {
		GanttChartConfigurationUtils.setRTL(true);
		var iWidthOfTotalHorizon = this.oStrategy._getWidthOfTotalHorizon();
		var oTotalHorizonBeforeExtension = this.oStrategy.getTotalHorizon();
		var dEndTimeBeforeExtension = Format.getTimeStampFormatter().parse(oTotalHorizonBeforeExtension.getEndTime());
		this.oStrategy._extendTotalHorizon(iWidthOfTotalHorizon + 100);
		var oTotalHorizonAfterExtension = this.oStrategy.getTotalHorizon();
		var dEndTimeAfterExtension = Format.getTimeStampFormatter().parse(oTotalHorizonAfterExtension.getEndTime());

		assert.strictEqual(dEndTimeAfterExtension.getTime() > dEndTimeBeforeExtension.getTime(), true, "end time of total horizon is extended.");
	});
	QUnit.test("Test TimeLineOptions: in different zoom control type cases", function (assert) {
		var oTimeLineOptions = {
			"option1": {
				innerInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					range: 32
				}
			},
			"option2": {
				innerInterval: {
					unit: library.config.TimeUnit.week,
					span: 1,
					range: 48
				}
			}
		};
		this.oStrategy = new StepwiseZoomStrategy({
			timeLineOptions: oTimeLineOptions
		});

		this.oStrategy._updateZoomControlType(library.config.ZoomControlType.SliderWithButtons);
		assert.deepEqual(oTimeLineOptions["option2"], this.oStrategy._getTimeLineOptionByIndex(0), "this timeLineOptions are set from small granularity to big granularity in slider mode");
		assert.deepEqual(oTimeLineOptions["option1"], this.oStrategy._getTimeLineOptionByIndex(1), "this timeLineOptions are set from small granularity to big granularity in slider mode");

		oTimeLineOptions = {
			"option3": {
				innerInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					range: 32
				}
			},
			"option4": {
				innerInterval: {
					unit: library.config.TimeUnit.week,
					span: 1,
					range: 48
				}
			}
		};
		this.oStrategy = new StepwiseZoomStrategy({
			timeLineOptions: oTimeLineOptions
		});
		this.oStrategy._updateZoomControlType(library.config.ZoomControlType.Select);
		assert.deepEqual(oTimeLineOptions["option3"], this.oStrategy._getTimeLineOptionByIndex(0), "this timeLineOptions are set from big granularity to small granularity in select mode");
		assert.deepEqual(oTimeLineOptions["option4"], this.oStrategy._getTimeLineOptionByIndex(1), "this timeLineOptions are set from big granularity to small granularity in select mode");
	});

	QUnit.test("Test Zoom Level: in different zoom control type cases", function (assert) {
		var oTimeLineOptions = {
			"option1": {
				innerInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					range: 32
				}
			},
			"option2": {
				innerInterval: {
					unit: library.config.TimeUnit.week,
					span: 1,
					range: 48
				}
			}
		};
		this.oStrategy = new StepwiseZoomStrategy({
			timeLineOptions: oTimeLineOptions,
			zoomLevel: 1
		});

		this.oStrategy._updateZoomControlType(library.config.ZoomControlType.SliderWithButtons);
		assert.deepEqual(1, this.oStrategy.getZoomLevel(), "this zoomLevel is set initially in slider mode");

		oTimeLineOptions = {
			"option3": {
				innerInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					range: 32
				}
			},
			"option4": {
				innerInterval: {
					unit: library.config.TimeUnit.week,
					span: 1,
					range: 48
				}
			}
		};
		this.oStrategy = new StepwiseZoomStrategy({
			timeLineOptions: oTimeLineOptions,
			zoomLevel: 0
		});
		this.oStrategy._updateZoomControlType(library.config.ZoomControlType.Select);
		assert.deepEqual(oTimeLineOptions["option3"], this.oStrategy._getTimeLineOptionByIndex(this.oStrategy.getZoomLevel()), "this zoomLevel is set initially in select mode");
	});
	QUnit.test("Test default Timeline option setting with given timeline option is not in the set of timeline options", function (assert) {
		var oTimeLineOptions = {
			"option1": {
				innerInterval: {
					unit: library.config.TimeUnit.minute,
					span: 1,
					range: 90
				},
				largeInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					format: "yyMMMEEEEd"
				},
				smallInterval: {
					unit: library.config.TimeUnit.minute,
					span: 1,
					pattern: "HH:mm"
				}
			},
			"option2": {
				innerInterval: {
					unit: library.config.TimeUnit.minute,
					span: 5,
					range: 90
				},
				largeInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					format: "yyMMMEEEEd"
				},
				smallInterval: {
					unit: library.config.TimeUnit.minute,
					span: 5,
					pattern: "HH:mm"
				}
			},
			"option3": {
				innerInterval: {
					unit: library.config.TimeUnit.minute,
					span: 10,
					range: 90
				},
				largeInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					format: "yyMMMEEEEd"
				},
				smallInterval: {
					unit: library.config.TimeUnit.minute,
					span: 10,
					pattern: "HH:mm"
				}
			},
			"option4": {
				innerInterval: {
					unit: library.config.TimeUnit.minute,
					span: 30,
					range: 90
				},
				largeInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					format: "yyMMMEEEEd"
				},
				smallInterval: {
					unit: library.config.TimeUnit.minute,
					span: 30,
					pattern: "HH:mm"
				}
			}
		};
		this.oStrategy = new StepwiseZoomStrategy({
			timeLineOptions: oTimeLineOptions
		});

		assert.deepEqual(this.oStrategy.getTimeLineOption(), oTimeLineOptions["option2"], "The Default timline set is the middle element of the set of all timeline options");

		oTimeLineOptions = {
			"option1": {
				innerInterval: {
					unit: library.config.TimeUnit.minute,
					span: 1,
					range: 90
				},
				largeInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					format: "yyMMMEEEEd"
				},
				smallInterval: {
					unit: library.config.TimeUnit.minute,
					span: 1,
					pattern: "HH:mm"
				}
			},
			"option2": {
				innerInterval: {
					unit: library.config.TimeUnit.minute,
					span: 5,
					range: 90
				},
				largeInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					format: "yyMMMEEEEd"
				},
				smallInterval: {
					unit: library.config.TimeUnit.minute,
					span: 5,
					pattern: "HH:mm"
				}
			},
			"option3": {
				innerInterval: {
					unit: library.config.TimeUnit.minute,
					span: 10,
					range: 90
				},
				largeInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					format: "yyMMMEEEEd"
				},
				smallInterval: {
					unit: library.config.TimeUnit.minute,
					span: 10,
					pattern: "HH:mm"
				}
			},
			"option4": {
				innerInterval: {
					unit: library.config.TimeUnit.minute,
					span: 30,
					range: 90
				},
				largeInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					format: "yyMMMEEEEd"
				},
				smallInterval: {
					unit: library.config.TimeUnit.minute,
					span: 30,
					pattern: "HH:mm"
				}
			},
			"option5": {
				innerInterval: {
					unit: library.config.TimeUnit.minute,
					span: 30,
					range: 90
				},
				largeInterval: {
					unit: library.config.TimeUnit.day,
					span: 1,
					format: "yyMMMEEEEd"
				},
				smallInterval: {
					unit: library.config.TimeUnit.minute,
					span: 30,
					pattern: "HH:mm"
				}
			}
		};
		this.oStrategy = new StepwiseZoomStrategy({
			timeLineOptions: oTimeLineOptions
		});

		assert.deepEqual(this.oStrategy.getTimeLineOption(), oTimeLineOptions["option3"], "The Default timline set is the middle element of the set of all timeline options");
	});
});
