/*global QUnit */
sap.ui.define([
	"sap/gantt/config/Locale",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/format/DateFormat",
	"sap/gantt/simple/GanttChartContainer",
	"sap/base/i18n/date/TimezoneUtils"
], function (Locale, TimeHorizon, GanttChartConfigurationUtils, DateFormat, GanttChartContainer, TimezoneUtils) {
	"use strict";

	QUnit.module("Create config.Locale with default values.", {
		beforeEach: function () {
			this.oConfig = new Locale();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	/**
	* @deprecated Since version 1.120
	*/
	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getTimeZone(), GanttChartConfigurationUtils.getTimezone());
		assert.strictEqual(this.oConfig.getUtcdiff(), "000000");
		assert.strictEqual(this.oConfig.getUtcsign(), "+");
		assert.deepEqual(this.oConfig.getDstHorizons(), []);
	});

	QUnit.test("Test labels from the date formatter", function (assert) {
		var oContainer = new GanttChartContainer();
		var oDateFormat = DateFormat.getDateTimeWithTimezoneInstance({ pattern: oContainer.getStatusBarDatePattern(), showTimezone: false });

		assert.equal(this.oConfig.getFormattedDate(oDateFormat, this.oTestDate), oDateFormat.format(this.oTestDate), "Axistime is converted to configuration timezone");
		assert.equal(this.oConfig.getFormattedDate(oDateFormat, this.oTestDate), oDateFormat.format(this.oTestDate), "Axistime is converted to configured timezone");
	});

	/**
	* @deprecated Since version 1.120
	*/
	QUnit.module("Create config.Locale with customized values.", {
		beforeEach: function () {
			this.dstHorizons = [new TimeHorizon({
				startTime: "20150401000000",
				endTime: "20151024000000"
			}), new TimeHorizon({
				startTime: "20140402000000",
				endTime: "20141031000000"
			})
			];
			this.oConfig = new Locale({
				timeZone: "UST",
				utcdiff: "000010",
				utcsign: "-",
				dstHorizons: this.dstHorizons
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getTimeZone(), "UST");
		assert.strictEqual(this.oConfig.getUtcdiff(), "000010");
		assert.strictEqual(this.oConfig.getUtcsign(), "-");
		assert.deepEqual(this.oConfig.getDstHorizons(), this.dstHorizons);
	});

	QUnit.module("Test timezone configurations", {
		beforeEach: function () {
			this.oConfig = new Locale({
				timeZone: null
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("should return correct timezone config by default", function (assert) {
		assert.strictEqual(this.oConfig.getTimeZone(), TimezoneUtils.getLocalTimezone());
	});

	QUnit.test("should return correct timezone config for the specified timezone", function (assert) {
		this.oConfig.setTimeZone("UTC");

		assert.strictEqual(this.oConfig.getTimeZone(), "UTC");
	});
});
