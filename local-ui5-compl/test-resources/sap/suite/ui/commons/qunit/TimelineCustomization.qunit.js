sap.ui.define([
	"./TimelineTestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/core/date/UI5Date",
	"sap/ui/qunit/utils/nextUIUpdate"
], function (TestUtils, createAndAppendDiv, UI5Date, nextUIUpdate) {
	"use strict";

	var styleElement = document.createElement("style");
	styleElement.textContent =
		".TimelineHeight {" +
		"		height: 100%;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "TimelineHeight";

	QUnit.module("TimelineCustomization");

	var data = [
		{
			filterValue: "A",
			dateTime: UI5Date.getInstance(2016, 0, 1),
			name: "A"
		}, {
			filterValue: "B",
			dateTime: UI5Date.getInstance(2016, 0, 2),
			name: "B"
		}, {
			filterValue: "C",
			dateTime: UI5Date.getInstance(2016, 0, 3),
			name: "C"
		}, {
			filterValue: "D",
			dateTime: UI5Date.getInstance(2016, 0, 4),
			name: "D"
		}, {
			filterValue: "E",
			dateTime: UI5Date.getInstance(2016, 0, 5),
			name: "E"
		}
	];

	QUnit.test("Time filter data - model", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}"
		});
		timeline.placeAt("content");
		await nextUIUpdate();
		return timeline._getTimeFilterData().then(function () {
			assert.equal(UI5Date.getInstance(2016, 0, 1).getTime(), timeline._minDate.getTime(), true, " min date OK");
			assert.equal(UI5Date.getInstance(2016, 0, 5).getTime(), timeline._maxDate.getTime(), true, " max date OK");
			timeline.destroy();
		});

	});

	QUnit.test("Time filter data - client", async function (assert, done) {
		var timeline = TestUtils.buildTimeline(data, { enableModelFilter: false }, {
			dateTime: "{dateTime}"
		});
		timeline.placeAt("content");
		await nextUIUpdate();
		return timeline._getTimeFilterData().then(function () {
			assert.equal(UI5Date.getInstance(2016, 0, 1).getTime(), timeline._minDate.getTime(), true, " min date OK");
			assert.equal(UI5Date.getInstance(2016, 0, 5).getTime(), timeline._maxDate.getTime(), true, " max date OK");
			timeline.destroy();
		});
	});

	QUnit.test("Time custom filter model", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, { enableModelFilter: false }, {
			dateTime: "{dateTime}"
		});

		timeline.placeAt("content");
		await nextUIUpdate();

		timeline.setCustomModelFilter("testFilter", new sap.ui.model.Filter({
			path: "dateTime",
			operator: sap.ui.model.FilterOperator.EQ,
			value1: UI5Date.getInstance(2016, 0, 1)
		}));

		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 1, true);
		assert.equal(timeline.getContent()[0].getProperty("dateTime").getTime(), UI5Date.getInstance(2016, 0, 1).getTime());

		// clear
		timeline.setCustomModelFilter("testFilter", null);
		await nextUIUpdate();

		assert.equal(timeline.getContent().length, 5, true);
		timeline.destroy();
	});

	QUnit.test("Time custom model filter, not found", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, { growingThreshold: 2, enableDoubleSided: true, lazyLoading: false }, {
			dateTime: "{dateTime}"
		});

		timeline.placeAt("content");
		await nextUIUpdate();

		timeline.setCustomModelFilter("testFilter", new sap.ui.model.Filter({
			path: "dateTime",
			operator: sap.ui.model.FilterOperator.EQ,
			value1: UI5Date.getInstance(1, 0, 1)
		}));
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 0, true);
		timeline.destroy();
	});

	QUnit.test("Time model filter, not found", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, { growingThreshold: 2, enableDoubleSided: true, lazyLoading: false }, {
			dateTime: "{dateTime}"
		});

		timeline.placeAt("content");
		await nextUIUpdate();

		timeline.setModelFilter({
			type: "Search",
			filter: new sap.ui.model.Filter({
				path: "dateTime",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: UI5Date.getInstance(1, 0, 1)
			})
		});
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 0, true);
		timeline.destroy();
	});

	QUnit.test("Re-stting timeline and model filter", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}"
		});
		timeline.placeAt("content");
		await nextUIUpdate();

		timeline.setModelFilter({
			type: "Data",
			filter: new sap.ui.model.Filter({
				path: "filterValue",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "A"
			})
		});
		timeline.setCurrentFilter(["A"]);
		timeline._filterData();
		await nextUIUpdate();
		var oSpy = sinon.spy(timeline, "_setupFilterDialog");
		
		assert.equal(timeline.getCurrentFilter().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "A");

		timeline.reset();
		assert.equal(oSpy.called, true, "Setup filter dialog method is called");
		assert.equal(timeline.getCurrentFilter().length, 0);
		
		timeline._clearFilter();
		assert.equal(timeline.getContent().length, 5);
		timeline.destroy();
	});

	QUnit.test("Time model filter", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}"
		});
		timeline.placeAt("content");
		await nextUIUpdate();

		timeline.setModelFilter({
			type: "Data",
			filter: new sap.ui.model.Filter({
				path: "filterValue",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "A"
			})
		});
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "A");

		timeline._clearFilter();
		assert.equal(timeline.getContent().length, 5);

		await nextUIUpdate();

		timeline.setModelFilter({
			type: "Time",
			filter: new sap.ui.model.Filter({
				path: "dateTime",
				operator: sap.ui.model.FilterOperator.GT,
				value1: UI5Date.getInstance(2016, 0, 3)
			})
		});

		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 2);

		timeline.setModelFilter({
			type: "Data",
			filter: new sap.ui.model.Filter({
				path: "filterValue",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "D"
			})
		});
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "D", true);

		timeline.setModelFilter({
			type: "Data",
			filter: null
		});

		timeline.setModelFilter({
			type: "Time",
			filter: null
		});
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 5);

		timeline.setModelFilter({
			type: "Search",
			filter: new sap.ui.model.Filter({
				path: "dateTime",
				operator: sap.ui.model.FilterOperator.GT,
				value1: UI5Date.getInstance(2016, 0, 3)
			})
		});
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 2);

		timeline.setModelFilter({
			type: "Data",
			filter: new sap.ui.model.Filter({
				path: "filterValue",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "D"
			})
		});
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "D", true);

		timeline.setModelFilter({
			type: "Data",
			filter: null
		});
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 2);

		timeline.setModelFilter({
			type: "Search",
			filter: null
		});
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 5);

		timeline.destroy();
	});

	QUnit.test("Time model filter null filter for date range", async function (assert) {
		const timeline = TestUtils.buildTimeline(data, { growingThreshold: 2, enableDoubleSided: true, lazyLoading: false }, {
			dateTime: "{dateTime}"
		});
		timeline._startDate = UI5Date.getInstance(2016, 0, 3);
		timeline.setModelFilter({
			type: "Time",
			filter: null
		});
		await nextUIUpdate();
		assert.equal(timeline._startDate, null, true);
		timeline.destroy();
	});

	QUnit.test("Timeline filter click simulation", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}"
		});
		timeline.placeAt("content");
		await nextUIUpdate();

		timeline.setCurrentFilter(["A"]);
		timeline._filterData();
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "A", true);

		timeline.setCurrentTimeFilter({
			from: UI5Date.getInstance(2016, 0, 1),
			to: UI5Date.getInstance(2016, 0, 2),
			type: "Day"
		});
		timeline._filterData(true);
		await nextUIUpdate();

		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "A", true);

		timeline.setCurrentTimeFilter({
			from: UI5Date.getInstance(2016, 0, 3),
			to: UI5Date.getInstance(2016, 0, 5),
			type: "Day"
		});
		timeline._filterData(true);
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 0);

		timeline.setCurrentFilter([]);
		timeline._filterData(true);
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 3);

		timeline._clearFilter();
		await nextUIUpdate();
		assert.equal(timeline.getContent().length, 5);
		timeline.destroy();

	});

	QUnit.test("Timeline search", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}",
			userName: "{name}"
		});

		timeline.placeAt("content");
		await nextUIUpdate();

		timeline.setCurrentSearch("A");
		timeline._search("A");

		timeline.placeAt("content");
		await nextUIUpdate();

		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("userName"), "A");

		timeline.destroy();
	});

	/**
	 * @deprecated Since version 1.46.0
	 */
	QUnit.test("Timeline set data", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}",
			userName: "{name}"
		});

		timeline.placeAt("content");
		await nextUIUpdate();

		assert.equal(timeline.getContent().length, 5);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "E");

		timeline.destroy();
	});

	QUnit.test("Timeline suspend social", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, {
			enableSocial: true
		}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}",
			userName: "{name}"
		});

		timeline.placeAt("content");
		await nextUIUpdate();

		var sAriaDisabled = timeline.getContent()[0].$("replyLink").attr("aria-disabled");
		assert.equal(sAriaDisabled, undefined, "attr aria-disabled not set by default");

		timeline.setSuspendSocialFeature(true);
		await nextUIUpdate();

		var sAriaDisabledAfterSuspend = timeline.getContent()[0].$("replyLink").attr("aria-disabled");
		assert.equal(sAriaDisabledAfterSuspend, "true", "attr aria-disabled is string 'true'");

		timeline.destroy();
	});

	QUnit.test("Hiding controls", async function (assert) {
		var timeline = TestUtils.buildTimeline(data, {
			axisOrientation: "Horizontal"
		}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}",
			userName: "{name}"
		});

		timeline.placeAt("content");
		await nextUIUpdate();

		assert.equal(timeline.$("searchField").length, 1, "search");
		assert.equal(timeline.$("filterIcon").length, 1, "filter");
		assert.equal(timeline.$("sortIcon").length, 1, "sort");

		timeline.setShowSearch(false);
		await nextUIUpdate();
		assert.equal(timeline.$("searchField").length, 0, "search");

		timeline.setShowSort(false);
		await nextUIUpdate();
		assert.equal(timeline.$("sortIcon").length, 0, "sort");

		timeline.setShowItemFilter(false);
		timeline.setShowTimeFilter(false);
		await nextUIUpdate();
		assert.equal(timeline.$("filterIcon").length, 0, "sort");

		timeline.setShowHeaderBar(false);
		await nextUIUpdate();
		assert.equal(timeline.$("headerBar").length, 0, "header bar");

		timeline.destroy();
	});

	QUnit.test("Hiding filters", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}",
			userName: "{name}"
		}),
			aItems;

		timeline.placeAt("content");
		timeline._openFilterDialog();
		aItems = timeline._objects.getFilterContent().getAggregation("filterItems");

		assert.equal(aItems.length, 2, "both filters");

		timeline.setShowItemFilter(false);
		aItems = timeline._objects.getFilterContent().getAggregation("filterItems");

		assert.equal(aItems.length, 1, "time");
		assert.equal(aItems[0].getProperty("key"), "range", "both filters");

		timeline.setShowItemFilter(true);
		timeline.setShowTimeFilter(false);
		aItems = timeline._objects.getFilterContent().getAggregation("filterItems");

		assert.equal(aItems.length, 1, "item");
		assert.equal(aItems[0].getProperty("key"), "items", "both filters");

		timeline.destroy();
	});
});
