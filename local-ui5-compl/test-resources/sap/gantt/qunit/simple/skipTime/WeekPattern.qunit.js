/*global QUnit, sinon */
sap.ui.define([
	"sap/gantt/library",
	"sap/gantt/skipTime/WeekPattern",
	"sap/gantt/skipTime/DayInterval",
	"sap/gantt/skipTime/SkipInterval",
	"sap/base/i18n/date/TimezoneUtils",
	"sap/gantt/misc/Utility"
], function (library, WeekPattern, DayInterval, SkipInterval, TimezoneUtils, Utility) {
	"use strict";

	QUnit.module("WeekPattern", {});

	QUnit.test("Test WeekPattern skip pattern", function (assert) {
		var oSkipTimePattern = new WeekPattern();
		assert.equal(oSkipTimePattern.getDiscontinuityProvider(), null, "Discontinuity provider is null by default");
		var oDailyInterval1 = new DayInterval({ day: "Monday" });
		oDailyInterval1.addAggregation("skipIntervals", new SkipInterval({ startTime: "000000", endTime: "090000" }));
		oDailyInterval1.addAggregation("skipIntervals", new SkipInterval({ startTime: "173000", endTime: "235959" }));
		var oDailyInterval2 = new DayInterval({ day: "Saturday" });
		oDailyInterval2.addAggregation("skipIntervals", new SkipInterval({ startTime: "000000", endTime: "235959" }));
		oSkipTimePattern.addAggregation("dailyIntervals", oDailyInterval1);
		oSkipTimePattern.addAggregation("dailyIntervals", oDailyInterval2);
		oSkipTimePattern.addAggregation("weeklyIntervals", new SkipInterval({ startTime: "120000", endTime: "140000" }));
		oSkipTimePattern.addAggregation("weeklyIntervals", new SkipInterval({ startTime: "180000", endTime: "190000" }));

		var mPattern = {
			"Sunday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Monday": [
				[
					"SOD",
					"09:00:00"
				],
				[
					"17:30:00",
					"EOD"
				]
			],
			"Tuesday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Wednesday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Thursday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Friday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Saturday": [
				[
					"SOD",
					"EOD"
				]
			]
		};

		var mSkipPattern = oSkipTimePattern._getWeekPattern();
		assert.strictEqual(JSON.stringify(mSkipPattern), JSON.stringify(mPattern), "Generated skip week pattern is correct");
		assert.strictEqual(oSkipTimePattern.getEnabled(), true, "Skip pattern is enabled by default");
		assert.strictEqual(oSkipTimePattern.getDiscontinuityProvider().tradingWeekdays.length, 6, "Only 6 working days as Saturday is completely removed");
		var oNewPattern = oSkipTimePattern.clone();
		oNewPattern.getDailyIntervals()[1].getSkipIntervals()[0].setEndTime('220000');
		var oDiscontinuousProvider = oNewPattern.getDiscontinuityProvider();
		assert.strictEqual(oDiscontinuousProvider.tradingWeekdays.length, 7, "All 7 working days");
		assert.strictEqual(oDiscontinuousProvider.useDiscontinuousScale(sap.gantt.config.TimeUnit.week), false, "Discontinuous scale should not be used for weekly timelineOption");
		assert.strictEqual(oDiscontinuousProvider.useDiscontinuousScale(sap.gantt.config.TimeUnit.day), true, "Discontinuous scale should be used for daily timelineOption");
	});

	QUnit.test("Test WeekPattern discontinuity should null when the pattern is disabled", function (assert) {
		var oSkipTimePattern = new WeekPattern();
		oSkipTimePattern.setEnabled(false);
		assert.equal(oSkipTimePattern.getDiscontinuityProvider(), null, "Discontinuity provider is null when the pattern is disabled");
	});

	QUnit.test("Test WeekPattern setLocale to listen Timezone changed delegate", function (assert) {
		let timezoneChangeHandler = null;

		const oSkipTimePattern = new WeekPattern();
		const locale = {
			getTimeZone: () => "some/timezone",
			addDelegate: (value) => {
				timezoneChangeHandler = value;
			},
			removeDelegate: () => {
				//
			}
		};

		const utilityStub = sinon.stub(Utility, "getNonDSTOffsetInfo").returns({});
		const addDelegateSpy = sinon.spy(locale, "addDelegate");
		const removeDelegateSpy = sinon.spy(locale, "removeDelegate");
		const setTimezoneStub = sinon.stub(oSkipTimePattern, "_setTimezone");

		oSkipTimePattern.setLocale(locale);
		oSkipTimePattern.setLocale(locale);

		assert.ok(addDelegateSpy.calledOnce && addDelegateSpy.args[0][0] === oSkipTimePattern._oLocaleDelegate,  "Timezone changed delegate registered");
		assert.ok(setTimezoneStub.calledOnce && setTimezoneStub.args[0][0] === "some/timezone",  "Set Timezone called with correct locale timezone");

		addDelegateSpy.resetHistory();
		setTimezoneStub.resetHistory();

		assert.ok(timezoneChangeHandler["onTimezoneChanged"]);

		locale.getTimeZone = () => "some/timezone2";
		timezoneChangeHandler["onTimezoneChanged"]();

		assert.ok(setTimezoneStub.calledOnce && setTimezoneStub.args[0][0] === "some/timezone2", "Set Timezone called with correct locale timezone when timezone changes");

		oSkipTimePattern.clone();
		assert.ok(removeDelegateSpy.calledOnce && removeDelegateSpy.args[0][0] === oSkipTimePattern._oLocaleDelegate,  "Timezone changed delegate removed on clone");

		removeDelegateSpy.resetHistory();

		oSkipTimePattern.exit();
		assert.ok(removeDelegateSpy.calledOnce && removeDelegateSpy.args[0][0] === oSkipTimePattern._oLocaleDelegate,  "Timezone changed delegate removed on exit");

		addDelegateSpy.restore();
		setTimezoneStub.restore();
		removeDelegateSpy.restore();
		utilityStub.restore();
	});

	QUnit.test("Test WeekPattern skip pattern config for default and same timezone", function (assert) {
		var oSkipTimePattern = new WeekPattern();

		var mPattern = {
			"Sunday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Monday": [
				[
					"SOD",
					"09:00:00"
				],
				[
					"17:30:00",
					"EOD"
				]
			],
			"Tuesday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Wednesday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Thursday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Friday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Saturday": [
				[
					"SOD",
					"EOD"
				]
			]
		};

		oSkipTimePattern._getWeekPattern = () => mPattern;

		var config = oSkipTimePattern._getPatternConfig();
		assert.strictEqual(JSON.stringify(config.pattern), JSON.stringify(config.localPattern), "Generated skip week pattern is correct when the timezone is set to default");

		oSkipTimePattern._getTimezone = () => TimezoneUtils.getLocalTimezone();

		config = oSkipTimePattern._getPatternConfig();
		assert.strictEqual(JSON.stringify(config.pattern), JSON.stringify(config.localPattern), "Generated skip week pattern is correct when the local timezone is same as the pattern timezone");
	});

	QUnit.test("Test WeekPattern skip pattern config for various patterns", function (assert) {
		var oSkipTimePattern = new WeekPattern();

		const utilityStub = sinon.stub(Utility, "getNonDSTOffsetInfo").returns({
			month: 6,
			offset: 16200000 // 4.5 hrs
		});

		oSkipTimePattern._getTimezone = () => "some/timezone";
		oSkipTimePattern._getWeekPattern = () => ({
			"Sunday": [[
				"SOD",
				"EOD"
			]],
			"Monday": [[
				"SOD",
				"EOD"
			]],
			"Tuesday": [[
				"SOD",
				"EOD"
			]],
			"Wednesday": [[
				"SOD",
				"EOD"
			]],
			"Thursday": [[
				"SOD",
				"EOD"
			]],
			"Friday": [[
				"SOD",
				"EOD"
			]],
			"Saturday": [[
				"SOD",
				"EOD"
			]]
		});

		var config = oSkipTimePattern._getPatternConfig();

		assert.strictEqual(JSON.stringify(config.pattern), JSON.stringify(config.localPattern), "Generated skip week pattern is correct when all the days are excluded");

		oSkipTimePattern._getWeekPattern = () => ({
			"Sunday": [],
			"Monday": [],
			"Tuesday": [],
			"Wednesday": [],
			"Thursday": [],
			"Friday": [],
			"Saturday": []
		});

		config = oSkipTimePattern._getPatternConfig();

		assert.strictEqual(JSON.stringify(config.pattern), JSON.stringify(config.localPattern), "Generated skip week pattern is correct when there is no exclusion");

		oSkipTimePattern._getWeekPattern = () => ({
			"Sunday": [[
				"SOD",
				"EOD"
			]],
			"Monday": [],
			"Tuesday": [],
			"Wednesday": [],
			"Thursday": [],
			"Friday": []
		});

		config = oSkipTimePattern._getPatternConfig();

		assert.strictEqual(JSON.stringify(config.pattern), JSON.stringify({
			"Sunday": [[
				"04:30:00",
				"EOD"
			]],
			"Monday": [[
				"SOD",
				"04:29:59"
			]],
			"Tuesday": [],
			"Wednesday": [],
			"Thursday": [],
			"Friday": [],
			"Saturday": []
		}), "Generated skip week pattern is correct for excluding Saturday");

		oSkipTimePattern._getWeekPattern = () => ({
			"Sunday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Monday": [
				[
					"SOD",
					"09:00:00"
				],
				[
					"17:30:00",
					"EOD"
				]
			],
			"Tuesday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Wednesday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Thursday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Friday": [
				[
					"12:00:00",
					"14:00:00"
				],
				[
					"18:00:00",
					"19:00:00"
				]
			],
			"Saturday": [
				[
					"SOD",
					"EOD"
				]
			]
		});

		config = oSkipTimePattern._getPatternConfig();

		assert.strictEqual(JSON.stringify(config.pattern), JSON.stringify({
			"Sunday": [[
				"SOD",
				"04:29:59"
			],[
				"16:30:00",
				"18:30:00"
			],[
				"22:30:00",
				"23:30:00"
			]],
			"Monday": [[
				"04:30:00",
				"13:30:00"
			],[
				"22:00:00",
				"EOD"
			]],
			"Tuesday": [[
				"SOD",
				"04:29:59"
			],[
				"16:30:00",
				"18:30:00"
			],[
				"22:30:00",
				"23:30:00"
			]],
			"Wednesday": [[
				"16:30:00",
				"18:30:00"
			],[
				"22:30:00",
				"23:30:00"
			]],
			"Thursday": [[
				"16:30:00",
				"18:30:00"
			],[
				"22:30:00",
				"23:30:00"
			]],
			"Friday": [[
				"16:30:00",
				"18:30:00"
			],[
				"22:30:00",
				"23:30:00"
			]],
			"Saturday": [[
				"04:30:00",
				"EOD"
			]]
		}), "Generated skip week pattern is correct for the given pattern");

		utilityStub.restore();
	});

	QUnit.test("Test WeekPattern skip pattern config for small duration", function (assert) {
		var oSkipTimePattern = new WeekPattern();

		const utilityStub = sinon.stub(Utility, "getNonDSTOffsetInfo").returns({
			month: 6,
			offset: 1000 // 1 sec
		});

		oSkipTimePattern._getTimezone = () => "some/timezone";
		oSkipTimePattern._getWeekPattern = () => ({
			"Sunday": [[
				"SOD",
				"EOD"
			]]
		});

		var config = oSkipTimePattern._getPatternConfig();

		assert.strictEqual(JSON.stringify(config.pattern), JSON.stringify({
			"Sunday": [[
				"00:00:01",
				"EOD"
			]],
			"Monday": [],
			"Tuesday": [],
			"Wednesday": [],
			"Thursday": [],
			"Friday": [],
			"Saturday": []
		}), "Generated skip week pattern is correct for excluding Sunday");

		utilityStub.restore();
	});
});