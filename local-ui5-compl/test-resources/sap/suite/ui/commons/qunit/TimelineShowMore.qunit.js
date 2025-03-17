sap.ui.define([
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineItem",
	"./TimelineTestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/utils/nextUIUpdate"
], function (Timeline, TimelineItem, TestUtils, createAndAppendDiv, nextUIUpdate) {
	"use strict";

	var styleElement = document.createElement("style");
	styleElement.textContent =
		".TimelineHeight {" +
		"		height: 100%;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "TimelineHeight";

	QUnit.module("TimelineShowMore");

	var aData = [
		{
			dateTime: new Date(2016, 0, 1),
			visible: true,
			filterValue: "1",
			title: "Item 1"
		},
		{
			dateTime: new Date(2016, 0, 2),
			visible: false,
			filterValue: "1",
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 0, 10),
			visible: true,
			filterValue: "3",
			title: "Item 3"
		}, {
			dateTime: new Date(2016, 1, 7),
			visible: true,
			filterValue: "4",
			title: "Item 4"
		}, {
			dateTime: new Date(2017, 8, 30),
			visible: true,
			filterValue: "5",
			title: "Item 5"
		}
	];

	var oOptions = {
		sortOldestFirst: true,
		showIcons: false
	};

	async function createTimeline(iGrowingThreshold) {
		oOptions.enableModelFilter = true;
		oOptions.growingThreshold = iGrowingThreshold;

		var oTimeline = TestUtils.buildTimeline(aData, oOptions);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		return oTimeline;
	}

	async function createTimelineWithODataModel(iGrowingThreshold, sOperationMode) {
		var oTimelineItem = new TimelineItem({
			title: "{Title}"
		});
		var oTimeLine = new Timeline({
			growingThreshold: iGrowingThreshold
		});
		var url = "https://cors-anywhere.herokuapp.com/https://services.odata.org/V2/Northwind/Northwind.svc";
		var oModel = new sap.ui.model.odata.v2.ODataModel(url, true);
		oTimeLine.setModel(oModel);
		oTimeLine.bindAggregation("content", {
			path: "/Employees",
			template: oTimelineItem
		});
		oTimeLine.getBinding("content").sOperationMode = sOperationMode;
		var oRefTimeLine = oTimeLine;
		oRefTimeLine.placeAt("content");
		await nextUIUpdate();
		return oRefTimeLine;
	}

	async function createTimelineWithClientFilter(iGrowingThreshold) {
		oOptions.enableModelFilter = false;
		oOptions.growingThreshold = iGrowingThreshold;


		var oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		return oTimeline;
	}

	function hasShowMore(oTimeline) {
		return oTimeline.$().find(".sapSuiteUiCommonsTimelineItemGetMoreButton").length > 0;
	}

	async function filterValue(oTimeline, aItems) {
		oTimeline.setCurrentFilter(aItems);
		oTimeline._filterData();
		await nextUIUpdate();
	}

	async function testA(oTimeline, assert) {
		assert.equal(hasShowMore(oTimeline), true, "1 item");

		oTimeline._loadMore();
		await nextUIUpdate();

		assert.equal(hasShowMore(oTimeline), true, "2 items");
		oTimeline._loadMore();
		oTimeline._loadMore();
		await nextUIUpdate();
		assert.equal(hasShowMore(oTimeline), true, "4 items");
		oTimeline._loadMore();
		await nextUIUpdate();
		assert.equal(hasShowMore(oTimeline), false, "5 items");

		await filterValue(oTimeline, ["1"]);
		assert.equal(hasShowMore(oTimeline), false, "1 filtered items");
	}

	async function testB(oTimeline, assert) {
		assert.equal(hasShowMore(oTimeline), false, "5 item");

		await filterValue(oTimeline, ["1", "3", "4", "5"]);
		assert.equal(hasShowMore(oTimeline), false, "5 item");

		await filterValue(oTimeline, ["1"]);
		assert.equal(hasShowMore(oTimeline), false, "1 item");

	}

	async function testC(oTimeline, assert) {
		assert.equal(hasShowMore(oTimeline), true, "1 item");

		await filterValue(oTimeline, ["1"]);
		assert.equal(hasShowMore(oTimeline), true, "2 item");

		oTimeline._loadMore();
		await nextUIUpdate();
		assert.equal(hasShowMore(oTimeline), false, "1 item");
	}

	async function testD(oTimeline, assert) {
		oTimeline._loadMore();
		oTimeline._sortClick();
		oTimeline.refreshContent();
		await nextUIUpdate();
		assert.equal(oTimeline._iItemCount, 0, "For oDataModel with operation mode default/Server the item count need to be reset to initial on sort");
	}

	async function testForceGrowing(oTimeline, assert) {
		assert.equal(hasShowMore(oTimeline), true, "all items");

		oTimeline.setGrowingThreshold(1);
		oTimeline.invalidate();
		await nextUIUpdate();

		assert.equal(hasShowMore(oTimeline), true, "1 item");

		oTimeline.setGrowingThreshold(10);
		oTimeline.invalidate();
		await nextUIUpdate();

		assert.equal(hasShowMore(oTimeline), true, "10 item");
		oTimeline.destroy();
	}


	QUnit.test("Show more ", async function (assert) {
		var oTimeline = await createTimeline(1);
		await testA(oTimeline, assert);
	});

	QUnit.test("Show more after sorting - ODataModel (Operation Mode : Default)", async function (assert) {
		var oTimeline = await createTimelineWithODataModel(4, "Default");
		await testD(oTimeline, assert);
	});

	QUnit.test("Show more after sorting - ODataModel (Operation Mode : Server)", async function (assert) {
		var oTimeline = await createTimelineWithODataModel(4, "Server");
		await testD(oTimeline, assert);
	});

	QUnit.test("Show more 5 growing", async function (assert) {
		var oTimeline = await createTimeline(5);
		await testB(oTimeline, assert);
	});

	QUnit.test("Filtered 1 growing", async function (assert) {
		var oTimeline = await createTimeline(1);
		await testC(oTimeline, assert);

	});

	QUnit.test("Show more - client filter", async function (assert) {
		var oTimeline = await createTimelineWithClientFilter(1);
		await testA(oTimeline, assert);
	});

	QUnit.test("Show more 5 growing - client filter", async function (assert) {
		var oTimeline = await createTimelineWithClientFilter(5);
		await testB(oTimeline, assert);
	});

	QUnit.test("Filtered 1 growing - client filter", async function (assert) {
		var oTimeline = await createTimelineWithClientFilter(1);
		await testC(oTimeline, assert);
	});

	QUnit.test("Force growing - client filter", async function (assert) {
		oOptions.forceGrowing = true;
		var oTimeline = await createTimelineWithClientFilter(0);
		await testForceGrowing(oTimeline, assert);
	});

	QUnit.test("Force growing - model filter", async function (assert) {
		oOptions.forceGrowing = true;
		var oTimeline = await createTimeline(0);
		await testForceGrowing(oTimeline, assert);
	});
});
