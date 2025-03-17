sap.ui.define([
	"./TimelineTestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/core/date/UI5Date",
	"sap/ui/qunit/utils/nextUIUpdate"
], function ( TestUtils, createAndAppendDiv, UI5Date, nextUIUpdate) {
	"use strict";

	var styleElement = document.createElement("style");
	styleElement.textContent =
		".TimelineHeight {" +
		"		height: 100%;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "TimelineHeight";

	QUnit.module("TimelineGroupingTest");

	var aData = [
		{
			dateTime: UI5Date.getInstance(2016, 0, 1),
			visible: true,
			title: "Item 1"
		}, {
			dateTime: UI5Date.getInstance(2016, 0, 2),
			visible: true,
			title: "Item 2"
		}, {
			dateTime: UI5Date.getInstance(2016, 0, 10),
			visible: true,
			title: "Item 3"
		}, {
			dateTime: UI5Date.getInstance(2016, 1, 7),
			visible: true,
			title: "Item 4"
		}, {
			dateTime: UI5Date.getInstance(2017, 8, 30),
			visible: true,
			title: "Item 5"
		}
	];

	var oOptions = {
		sortOldestFirst: true,
		showIcons: false,
		groupBy: "dateTime",
		axisOrientation: "Horizontal",
		groupByType: "Year"
	};


	function yearTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016", "Year - First group key is '2016'");
		assert.equal(aGroups[1]._groupID, "2017", "Year - First group key is '2017'");
		assert.equal(aGroups.length, "2", "Year - Group count is 2");
	}

	function monthTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016/01", "Month - First group key is '2016/01'");
		assert.equal(aGroups[1]._groupID, "2016/02", "Month - First group key is '2016/02'");
		assert.equal(aGroups[2]._groupID, "2017/09", "Month - First group key is '2017/09'");
		assert.equal(aGroups.length, "3", "Month - Group count is 3");
	}

	function quarterTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016/01", "Quarter - First group key is '2016/01'");
		assert.equal(aGroups[1]._groupID, "2017/03", "Quarter - First group key is '2017/03'");
		assert.equal(aGroups.length, "2", "Quarter - Group count is 2");
	}

	function weekTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016/01/1", "Week - First group key is '2016/1'");
		assert.equal(aGroups[1]._groupID, "2016/01/3", "Week - First group key is '2016/3'");
		assert.equal(aGroups[2]._groupID, "2016/02/7", "Week - First group key is '2016/7'");
		assert.equal(aGroups.length, "4", "Week - Group count is 4");
	}

	function dayTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016/01/01", "Day - First group key is '2016/01/01'");
		assert.equal(aGroups[1]._groupID, "2016/01/02", "Day - First group key is '2016/01/02'");
		assert.equal(aGroups[2]._groupID, "2016/01/10", "Day - First group key is '2016/01/10'");
		assert.equal(aGroups.length, "5", "Day - Group count is 5l");
	}

	async function customGroupingTest(assert, oTimeline) {
		oTimeline.setCustomGrouping(function (oDate) {
			return {
				key: oDate.getFullYear() + "/" + (oDate.getMonth() < 6 ? 1 : 2),
				title: oDate.getFullYear() + "/" + (oDate.getMonth() < 6 ? "1. half" : "2. half"),
				date: oDate
			};
		});

		oTimeline.placeAt("content");
		await nextUIUpdate();

		var aGroups = oTimeline.getGroups();
		assert.equal(aGroups[0]._groupID, "2016/1", "Custom group - First group key is '2016/1'");
		assert.equal(aGroups[1]._groupID, "2017/2", "Custom group - First group key is '2017/2'");
		assert.equal(aGroups.length, "2", "Custom group - Group count is 2");
		oTimeline.destroy();
	}

	async function createTimeline(sGroupType) {
		oOptions.groupByType = sGroupType;

		var oTimeline = TestUtils.buildTimeline(aData, oOptions);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		return oTimeline;
	}

	async function createTimelineNoBinding(sGroupType) {
		oOptions.groupByType = sGroupType;

		var oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		return oTimeline;
	}

	QUnit.test("Timeline binding grouping - Year", async function (assert) {
		var oTimeline;

		oTimeline = await createTimeline("Year");
		assert.equal(oTimeline.getContent().length, 7, "Year - content contains 7 items(5 base + 2 groups)");
		yearTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Month", async function (assert) {
		var oTimeline;

		oTimeline = await createTimeline("Month");
		assert.equal(oTimeline.getContent().length, 8, "content contains 8 items(5 base + 3 groups)");
		monthTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Quarter", async function (assert) {
		var oTimeline;

		oTimeline = await createTimeline("Quarter");
		assert.equal(oTimeline.getContent().length, 7, "content contains 8 items(5 base + 2 groups)");
		quarterTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Week", async function (assert) {
		var oTimeline;

		oTimeline = await createTimeline("Week");
		assert.equal(oTimeline.getContent().length, 9, "WEEK - content contains 8 items(5 base + 4 groups)");
		weekTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Day", async function (assert) {
		var oTimeline;

		oTimeline = await createTimeline("Day");
		assert.equal(oTimeline.getContent().length, 10, "DAY - content contains 10 items(5 base + 5 groups)");
		dayTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Custom grouping", async function (assert) {
		var oTimeline;

		oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		await customGroupingTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Year", async function (assert) {
		var oTimeline;

		oTimeline = await createTimelineNoBinding("Year");
		yearTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "YEAR - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Month", async function (assert) {
		var oTimeline;

		oTimeline = await createTimelineNoBinding("Month");
		monthTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "MONTH - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Quarter", async function (assert) {
		var oTimeline;

		oTimeline = await createTimelineNoBinding("Quarter");
		quarterTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "QUARTER - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Week", async function (assert) {
		var oTimeline;

		oTimeline = await createTimelineNoBinding("Week");
		weekTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "WEEK - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Day", async function (assert) {
		var oTimeline;

		oTimeline = await createTimelineNoBinding("Day");
		dayTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "DAY - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Custom grouping", async function (assert) {
		var oTimeline;

		oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		await customGroupingTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Custom grouping", async function (assert) {
		var oTimeline;

		oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		await customGroupingTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline Expanding", async function (assert) {
		var oTimeline = await createTimelineNoBinding("Year");

		oTimeline.placeAt("content");
		await nextUIUpdate();

		return oTimeline.getGroups()[0]._performExpandCollapse("2016").then(function () {
			assert.equal(jQuery("[groupid=2016]:hidden").length, 8, " 8 hidden items after collapse (4 lines + 4 items)");

			return oTimeline.getGroups()[0]._performExpandCollapse("2016").then(function () { //eslint-disable-line
				assert.equal(jQuery("[groupid=2016]:hidden").length, 1, "1 hidden item after expand (group line)");
				oTimeline.destroy();
			});
		});
	});

	QUnit.test("Horizontal grouping", async function (assert) {
		oOptions.axisOrientation = "Horizontal";
		oOptions.enableDoubleSided = true;

		var oTimeline = await createTimeline("Year");

		assert.equal(oTimeline.getContent().length, 7, "Year - content contains 7 items(5 base + 2 groups)");
		oTimeline.destroy();
	});

	QUnit.test("Aria-Label for Timeline Group Header", async function (assert) {
		var oTimeline = await createTimelineNoBinding("Year");
		oTimeline.placeAt("content");
		var oGroups = oTimeline.getGroups();
		assert.equal(oGroups[0].$()[0].childNodes[0].children[0].getAttribute("aria-label"), "Posts from: 2016 Expanded", "Aria Label present for Timeline Group Header 1");
		assert.equal(oGroups[1].$()[0].childNodes[0].children[0].getAttribute("aria-label"), "Posts from: 2017 Expanded", "Aria Label present for Timeline Group Header 2");
		oTimeline.destroy();
	});

	QUnit.test("Aria properties when Group is Expanded/Collapsed for Vertical orientation", async function (assert) {

		var oTimeline = await createTimelineNoBinding("Year");
		oTimeline.placeAt("content");
		oTimeline.setAxisOrientation("Vertical");
		await nextUIUpdate();
		var oGroups = oTimeline.getGroups();

		assert.equal(oGroups[0].getDomRef().getAttribute("role"), "treeitem", "role is set to treeitem");
		assert.equal(oGroups[0].getDomRef().getAttribute("aria-level"), "1", "role is set to treeitem");

		return oGroups[0]._performExpandCollapse("2016").then(function () {
			assert.equal(oGroups[0].getDomRef().getAttribute("aria-expanded"), "false", "aria-expanded is false when the group is collapsed");

			return oGroups[0]._performExpandCollapse("2016").then(function () {
				assert.equal(oGroups[0].getDomRef().getAttribute("aria-expanded"), "true", "aria-expanded is true when the group is expanded");
				oTimeline.destroy();
			});
		});
	});

	QUnit.test("Horizontal grouping - Padding", async function (assert) {
		oOptions.axisOrientation = "Horizontal";

		var oTimeline = await createTimeline("Year");
		await nextUIUpdate();

		assert.equal(oTimeline.getContent().length, 7, "Year - content contains 7 items(5 base + 2 groups)");
		var oTimelineGroupHeader = oTimeline.getDomRef().querySelector(".sapSuiteUiCommonsTimelineGroupHeader");
		var oTimelineContent= oTimeline.getDomRef().querySelector(".sapSuiteUiCommonsTimelineContentsH");
		assert.equal(getComputedStyle(oTimelineGroupHeader).paddingTop, "20.25px", "Correct Padding applied.");
		assert.equal(getComputedStyle(oTimelineContent).paddingBottom, "60.25px", "Correct Padding applied.");
		oTimeline.destroy();
	});

	QUnit.module("Timeline binding grouping - Year with Focus on Button", {
		beforeEach: function() {
			TestUtils.applyTheme();
		},
		afterEach: function(assert) {
			TestUtils.resetTheme(assert);
			this.oTimeline.destroy();
		},
		createCustomTimeline: async function() {
			this.oTimeline = await createTimeline("Year");
			await nextUIUpdate();
		},
		applyAsserts: function(assert, oTimeline) {
			var oTimelineMainWrapper = oTimeline.getDomRef().querySelector(".sapSuiteUiCommonsTimelineGroupHeaderMainWrapper");
			assert.ok(getComputedStyle(oTimelineMainWrapper).outline.indexOf(sap.ui.core.theming.Parameters.get("sapUiContentFocusStyle")), "Focus Style applied.");
			assert.ok(getComputedStyle(oTimelineMainWrapper).outline.indexOf(sap.ui.core.theming.Parameters.get("sapUiContentFocusColor")), "Focus Color applied.");
			assert.ok(getComputedStyle(oTimelineMainWrapper).outline.indexOf(sap.ui.core.theming.Parameters.get("sapUiContentFocusWidth")), "Focus Width applied.");
		}
	});

	QUnit.test("Focus Test - sap_horizon", async function (assert) {
		var done = assert.async();
		await this.createCustomTimeline();
		TestUtils.applyTheme("sap_horizon", async function() {
			this.oTimeline.getDomRef().querySelector(".sapSuiteUiCommonsTimelineGroupHeaderMainWrapper").focus();
			await nextUIUpdate();
			this.applyAsserts(assert, this.oTimeline);
			done();
		}.bind(this));
	});

	QUnit.test("Focus Test - sap_fiori_3", async function (assert) {
		var done = assert.async();
		await this.createCustomTimeline();
		TestUtils.applyTheme("sap_fiori_3", async function() {
			this.oTimeline.getDomRef().querySelector(".sapSuiteUiCommonsTimelineGroupHeaderMainWrapper").focus();
			await nextUIUpdate();
			this.applyAsserts(assert, this.oTimeline);
			done();
		}.bind(this));
	});

});
