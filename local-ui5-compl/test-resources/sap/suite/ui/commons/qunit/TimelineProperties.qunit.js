sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineItem",
	"./TimelineTestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/base/i18n/Localization"
], function (jQuery, suiteLibrary, Timeline, TimelineItem, TestUtils, createAndAppendDiv, nextUIUpdate, Localization) {
	"use strict";

	var TimelineAlignment = suiteLibrary.TimelineAlignment,
		TimelineAxisOrientation = suiteLibrary.TimelineAxisOrientation,
		TimelineGroupType = suiteLibrary.TimelineGroupType;

	var styleElement = document.createElement("style");
	styleElement.textContent =
		".TimelineHeight {" +
		"		height: 100%;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "TimelineHeight";

	var checkAlignment = function (assert, timeline, alignment) {
		assert.equal(timeline.getAlignment(), alignment, 'alignment property is set to ' + alignment);
	};

	var checkItemsAlignment = function (assert, timeline, alignment, itemCount) {
		var cssClass;
		if (alignment === TimelineAlignment.Left) {
			cssClass = 'div.sapSuiteUiCommonsTimelineItemWrapperVLeft';
		} else if (alignment === TimelineAlignment.Right) {
			cssClass = 'div.sapSuiteUiCommonsTimelineItemWrapperVRight';
		} else if (alignment === TimelineAlignment.Top) {
			cssClass = 'li.sapSuiteUiCommonsTimelineItemHTop';
		} else if (alignment === TimelineAlignment.Bottom) {
			cssClass = 'li.sapSuiteUiCommonsTimelineItemHBottom';
		}

		assert.equal(timeline.$().find('' + cssClass).length, itemCount, '' + cssClass + ' class is used for ' + itemCount + ' items');
	};

	var checkOrientation = function (assert, timeline, orientation) {
		assert.equal(timeline.getAxisOrientation(), orientation, 'axisOrientation property is set to ' + orientation);

		var cssClass;
		if (orientation === TimelineAxisOrientation.Horizontal) {
			cssClass = 'sapSuiteUiCommonsTimelineH';
		} else if (orientation === TimelineAxisOrientation.Vertical) {
			cssClass = 'sapSuiteUiCommonsTimeline';
		}

		assert.ok(timeline.$().hasClass(cssClass), '' + cssClass + ' class is used for ' + orientation + ' orientation');
	};

	var noItems = [];

	var oneItems = [
		{
			dateTime: new Date(2016, 0, 1),
			visible: true,
			title: "Item 1"
		}
	];

	var fiveItems = [
		{
			dateTime: new Date(2016, 0, 1),
			visible: true,
			title: "Item 1"
		}, {
			dateTime: new Date(2016, 1, 1),
			visible: true,
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 1, 5),
			visible: true,
			title: "Item 3"
		}, {
			dateTime: new Date(2017, 7, 1),
			visible: true,
			title: "Item 4"
		}, {
			dateTime: new Date(2017, 8, 30),
			visible: true,
			title: "Item 5"
		}
	];

	QUnit.module("TimelinePropertiesTest");

	QUnit.test("Default values.", async function (assert) {
		var timeline = new Timeline();
		timeline.placeAt("content");
		await nextUIUpdate();
		assert.equal(timeline.getAlignment(), TimelineAlignment.Right, "Timeline default alignment is Right.");
		assert.equal(timeline.getAxisOrientation(), TimelineAxisOrientation.Vertical, "Timeline default axisOrientation is Vertical.");
		assert.equal(timeline.getEnableBusyIndicator(), true, "Timeline default enableBusyIndicator is true.");
		assert.equal(timeline.getEnableDoubleSided(), false, "Timeline default enableDoubleSided is false.");
		assert.equal(timeline.getEnableScroll(), true, "Timeline default enableScroll is true.");
		assert.equal(timeline.getEnableModelFilter(), true, "Timeline default getEnableModelFilter is true.");
		assert.equal(timeline.getEnableSocial(), false, "Timeline default getEnableSocial is false.");
		assert.equal(timeline.getForceGrowing(), false, "Timeline default getForceGrowing is false."); // obsolete, removed
		assert.equal(timeline.getGroupBy(), '', "Timeline default getGroupBy is empty.");
		assert.equal(timeline.getGroupByType(), TimelineGroupType.None, "Timeline default getGroupByType is None.");
		assert.equal(timeline.getGrowingThreshold(), 5, "Timeline default getGrowingThreshold is 5.");
		assert.equal(timeline.getHeight(), '', "Timeline default getHeight is empty.");
		assert.equal(timeline.getLazyLoading(), false, "Timeline default getLazyLoading is false.");
		assert.equal(timeline.getNoDataText(), 'No items are currently available', "Timeline default getNoDataText is undefined.");
		assert.equal(timeline.getShowHeaderBar(), true, "Timeline default getShowHeaderBar is true.");
		assert.equal(timeline.getShowIcons(), true, "Timeline default getShowIcons is true.");
		assert.equal(timeline.getShowSearch(), true, "Timeline default getShowSearch is true.");
		assert.equal(timeline.getShowTimeFilter(), true, "Timeline default getShowTimeFilter is true.");
		assert.equal(timeline.getSort(), true, "Timeline default getSort is true.");
		assert.equal(timeline.getSortOldestFirst(), false, "Timeline default getSortOldestFirst is false.");
		assert.equal(timeline.getTextHeight(), '', "Timeline default getTextHeight is empty.");
		assert.equal(timeline.getVisible(), true, "Timeline default getVisible is true.");
		assert.equal(timeline.getWidth(), '100%', "Timeline default getWidth is 100%.");
		timeline.destroy();
	});


	QUnit.test("Timeline Right alignment.", async function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false});
		timeline.placeAt("content");
		await nextUIUpdate();
		checkAlignment(assert, timeline, TimelineAlignment.Right);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Right, fiveItems.length);

		timeline.destroy();
	});

	QUnit.test("Timeline Left alignment.", async function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false, alignment: "Left"});
		timeline.placeAt("content");
		await nextUIUpdate();
		checkAlignment(assert, timeline, TimelineAlignment.Left);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, fiveItems.length);

		timeline.destroy();
	});

	QUnit.test("Timeline Top alignment.", async function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false, alignment: "Top"});
		timeline.placeAt("content");
		await nextUIUpdate();
		checkAlignment(assert, timeline, TimelineAlignment.Top);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Top, 0);

		timeline.destroy();
	});

	QUnit.test("Timeline Bottom alignment.", async function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false, alignment: "Bottom"});
		timeline.placeAt("content");
		await nextUIUpdate();
		checkAlignment(assert, timeline, TimelineAlignment.Bottom);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Bottom, 0);

		timeline.destroy();
	});

	QUnit.test("Timeline alignment change.", async function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false});
		timeline.placeAt("content");
		await nextUIUpdate();
		timeline.setAlignment(TimelineAlignment.Left);
		await nextUIUpdate();
		checkAlignment(assert, timeline, TimelineAlignment.Left);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, fiveItems.length);

		timeline.destroy();
	});

	QUnit.test("Timeline vertical double-sided mode.", async function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {enableDoubleSided: true});
		timeline.placeAt("content");
		await nextUIUpdate();

		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, 3);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Right, 2);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Top, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Bottom, 0);
		checkOrientation(assert, timeline, TimelineAxisOrientation.Vertical);

		timeline.destroy();
	});

	QUnit.test("Timeline horizontal double-sided mode.", async function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {enableDoubleSided: true, axisOrientation: "Horizontal"});
		timeline.placeAt("content");
		await nextUIUpdate();

		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Right, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Top, 3);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Bottom, 2);
		checkOrientation(assert, timeline, TimelineAxisOrientation.Horizontal);

		timeline.destroy();
	});

	QUnit.test("Timeline double sided horizontal mode activated after rendering.", async function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {});
		timeline.placeAt("content");
		await nextUIUpdate();
		timeline.setEnableDoubleSided(true);
		timeline.setAxisOrientation(TimelineAxisOrientation.Horizontal);
		await nextUIUpdate();

		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Right, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Top, 3);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Bottom, 2);
		checkOrientation(assert, timeline, TimelineAxisOrientation.Horizontal);

		timeline.destroy();
	});

	// Header bar filter visibility

	function isToolbarElementVisible(oTimeline, sElementIdSufix) {
		var oElement = oTimeline.getHeaderBar().getContent().filter(function (oElement) {
			return jQuery.sap.endsWith(oElement.getId(), sElementIdSufix);
		})[0];
		if (oElement) {
			return oElement.getVisible();
		}
		return false;
	}

	QUnit.test("Timeline sort button - show", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSort: false
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowSort(true);
		await nextUIUpdate();

		assert.ok(isToolbarElementVisible(oTimeline, "-sortIcon"), "Sort icon should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline sort button - hide", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSort: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowSort(false);
		await nextUIUpdate();

		assert.ok(!isToolbarElementVisible(oTimeline, "-sortIcon"), "Sort icon should not be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline sort button - hide & show", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSort: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowSort(false);
		await nextUIUpdate();
		oTimeline.setShowSort(true);
		await nextUIUpdate();

		assert.ok(isToolbarElementVisible(oTimeline, "-sortIcon"), "Sort icon should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline sort button - Enable & Disable", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSort: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();
		if (oTimeline.getContent().length > 1) {
			assert.ok(oTimeline._objects.getSortIcon().getEnabled(), "Sort icon should be enable");
		}
		oTimeline = TestUtils.buildTimeline(oneItems, {
			showIcons: false,
			showSort: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();
		if (oTimeline.getContent().length === 1) {
			assert.ok(!oTimeline._objects.getSortIcon().getEnabled(), "Sort icon should be disable");
		}
		oTimeline = TestUtils.buildTimeline(noItems, {
			showIcons: false,
			showSort: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();
		if (oTimeline.getContent().length === 0) {
			assert.ok(!oTimeline._objects.getSortIcon().getEnabled(), "Sort icon should be disable");
		}
		oTimeline.destroy();
	});

	QUnit.test("Timeline filter button - show", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showItemFilter: false,
			showTimeFilter: false
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowItemFilter(true);
		oTimeline.setShowTimeFilter(true);
		await nextUIUpdate();

		assert.ok(isToolbarElementVisible(oTimeline, "-filterIcon"), "Filter icon should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline filter button - hide", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showItemFilter: true,
			showTimeFilter: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowItemFilter(false);
		oTimeline.setShowTimeFilter(false);
		await nextUIUpdate();

		assert.ok(!isToolbarElementVisible(oTimeline, "-filterIcon"), "Filter icon should not be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline filter button - hide & show", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showItemFilter: true,
			showTimeFilter: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowItemFilter(false);
		oTimeline.setShowTimeFilter(false);
		await nextUIUpdate();
		oTimeline.setShowItemFilter(true);
		oTimeline.setShowTimeFilter(true);
		await nextUIUpdate();

		assert.ok(isToolbarElementVisible(oTimeline, "-filterIcon"), "Filter icon should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline search field - show", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSearch: false
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowSearch(true);
		await nextUIUpdate();

		assert.ok(isToolbarElementVisible(oTimeline, "-searchField"), "Search field should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline search field - hide", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSearch: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowSearch(false);
		await nextUIUpdate();

		assert.ok(!isToolbarElementVisible(oTimeline, "-searchField"), "Search field should not be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline search field - hide & show", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSearch: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowSearch(false);
		await nextUIUpdate();
		oTimeline.setShowSearch(true);
		await nextUIUpdate();

		assert.ok(isToolbarElementVisible(oTimeline, "-searchField"), "Search field should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline header bar - show", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showHeaderBar: false
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();
		assert.equal(oTimeline.oItemNavigation.iFocusedIndex, 0, "Focus index is set to 0");

		oTimeline.setShowHeaderBar(true);
		await nextUIUpdate();

		assert.ok(oTimeline.getHeaderBar().getVisible(), "Header bar should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline header bar - hide", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showHeaderBar: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowHeaderBar(false);
		await nextUIUpdate();

		assert.ok(!oTimeline.getHeaderBar().getVisible(), "Header bar should not be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline header bar - hide & show", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showHeaderBar: true
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.setShowHeaderBar(false);
		await nextUIUpdate();
		oTimeline.setShowHeaderBar(true);
		await nextUIUpdate();

		assert.ok(oTimeline.getHeaderBar().getVisible(), "Header bar should be visible.");

		oTimeline.destroy();
	});
	var checkHeaderBarContentOrder = function(assert, oHeaderBarContent) {
		var oResultControl = ["sap.m.ToolbarSpacer", "sap.ui.core.InvisibleText", "sap.m.SearchField", "sap.m.OverflowToolbarButton", "sap.m.OverflowToolbarButton"];
		for (var i = 0; i < oHeaderBarContent.length; i++) {
			assert.ok((oHeaderBarContent[i].getMetadata().getName() === oResultControl[i]), "The child in position " + i + " is of type " + oResultControl[i]);
		}
	};
	//Deals with AxisOrientation set as Vertical Initially and then changed to Horizontal - in RTL and non RTL mode
	QUnit.module("AxisOrientation and Placement of SearchField : Vertical->Horizontal", {
		beforeEach: async function() {
			this.oTimeline = TestUtils.buildTimeline(fiveItems, {
				showIcons: true,
				showSearch: true,
				axisOrientation: "Vertical"
			});
			this.oTimeline.placeAt("content");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oTimeline.destroy();
		}
	});
	QUnit.test("Non RTL Mode", async function (assert) {
		checkHeaderBarContentOrder(assert, this.oTimeline.getHeaderBar().getContent());
		this.oTimeline.setAxisOrientation("Horizontal");
		await nextUIUpdate();
		checkHeaderBarContentOrder(assert, this.oTimeline.getHeaderBar().getContent());
	});
	QUnit.test("RTL Mode", async function (assert) {
		Localization.setRTL(true);
		await nextUIUpdate();

		checkHeaderBarContentOrder(assert, this.oTimeline.getHeaderBar().getContent());
		this.oTimeline.setAxisOrientation("Horizontal");
		await nextUIUpdate();
		checkHeaderBarContentOrder(assert, this.oTimeline.getHeaderBar().getContent());

		Localization.setRTL(false);
		await nextUIUpdate();
	});
	//Deals with AxisOrientation set as Horizontal Initially and then changed to Vertical - in RTL and non RTL mode
	QUnit.module("AxisOrientation and Placement of SearchField : Horizontal->Vertical", {
		beforeEach: async function() {
			this.oTimeline = TestUtils.buildTimeline(fiveItems, {
				showIcons: true,
				showSearch: true,
				axisOrientation: "Horizontal"
			});
			this.oTimeline.placeAt("content");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oTimeline.destroy();
		}
	});
	QUnit.test("Non RTL Mode", async function (assert) {
		checkHeaderBarContentOrder(assert, this.oTimeline.getHeaderBar().getContent());
		this.oTimeline.setAxisOrientation("Vertical");
		await nextUIUpdate();
		checkHeaderBarContentOrder(assert, this.oTimeline.getHeaderBar().getContent());
	});

	QUnit.test("RTL Mode", async function (assert) {
		Localization.setRTL(true);
		await nextUIUpdate();

		checkHeaderBarContentOrder(assert, this.oTimeline.getHeaderBar().getContent());
		this.oTimeline.setAxisOrientation("Vertical");
		await nextUIUpdate();
		checkHeaderBarContentOrder(assert, this.oTimeline.getHeaderBar().getContent());

		Localization.setRTL(false);
		await nextUIUpdate();
	});

});
