sap.ui.define([
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineItem",
	"./TimelineTestUtils",
	"sap/m/FlexBox",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/ui/core/CustomData",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/utils/nextUIUpdate"
], function (Timeline, TimelineItem, TestUtils, FlexBox, List, StandardListItem, CustomData, createAndAppendDiv, nextUIUpdate) {
	"use strict";

	var styleElement = document.createElement("style");
	styleElement.textContent =
		".TimelineHeight {" +
		"		height: 100%;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "TimelineHeight";

	QUnit.module("TimelineOldIssuesTest");
	QUnit.test("Timeline with invisible items.", async function (assert) {
		//Invisible items broke Timeline rendering.
		var data = [
			{
				dateTime: new Date(2016, 0, 1),
				visible: true,
				title: "Item 1"
			}, {
				dateTime: new Date(2016, 0, 2),
				visible: false,
				title: "Item 2"
			}, {
				dateTime: new Date(2016, 0, 3),
				visible: true,
				title: "Item 3"
			}
		];
		var timeline = TestUtils.buildTimeline(data, {sortOldestFirst: true, showIcons: false});
		timeline.placeAt("content");
		await nextUIUpdate();
		var $lis = timeline.$().find("li.sapSuiteUiCommonsTimelineItem");
		assert.equal($lis.length, 2, "Timeline should render 2 items.");
		assert.equal($lis.eq(0).find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), "Item 1", "The first item should be Item 1.");
		assert.equal($lis.eq(1).find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), "Item 3", "The last item should be Item 3.");
		timeline.destroy();
	});

	QUnit.test("Multiple timelines in single container.", async function (assert) {
		//Make sure that all jQurey.find are done on single Timeline and not the entire page.
		var data1 = [
			{
				dateTime: new Date(2016, 0, 1),
				title: "Item 1"
			}
		];
		var data2 = [
			{
				dateTime: new Date(2016, 0, 1),
				title: "Item 2"
			}
		];
		var timeline1 = TestUtils.buildTimeline(data1);
		var timeline2 = TestUtils.buildTimeline(data2);
		var box = new FlexBox({
			fitContainer: true,
			items: [timeline1, timeline2]
		});
		box.placeAt("content");
		await nextUIUpdate();
		var title1 = timeline1.$().find("li.sapSuiteUiCommonsTimelineItem").find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim();
		var title2 = timeline2.$().find("li.sapSuiteUiCommonsTimelineItem").find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim();
		assert.equal(title1, "Item 1", "First Timeline should be rendered correctly.");
		assert.equal(title2, "Item 2", "Second Timeline should be rendered correctly.");
		box.destroy();
	});

	QUnit.test("Timeline with list as a custom control.", async function (assert) {
		//List renders li elements just like Timeline. People forget to narrow jQuery.find.
		var list = new List({
			items: [
				new StandardListItem({
					title: "Item 1"
				}),
				new StandardListItem({
					title: "Item 2"
				})
			]
		});
		var itemWithList = new TimelineItem({
			dateTime: new Date(2016, 0, 1),
			embeddedControl: list
		});
		var item = new TimelineItem({
			dateTime: new Date(2016, 0, 2),
			title: "Item 2"
		});
		var timeline = new Timeline({
			showIcons: false,
			sortOldestFirst: true,
			content: [itemWithList, item]
		});
		timeline.placeAt("content");
		await nextUIUpdate();
		var $lis = timeline.$().find("li.sapSuiteUiCommonsTimelineItem");
		assert.equal($lis.eq(1).find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), "Item 2", "The last item should get rendered.");
		timeline.destroy();
	});

	QUnit.test("Timeline with custom action an enableSocial = false.", async function (assert) {
		//Reply button shouldn't be visible.
		var item = new TimelineItem({
			dateTime: new Date(2016, 0, 1),
			customAction: [
				new CustomData({
					key: "Action",
					value: "Action"
				})
			]
		});
		var timeline = new Timeline({
			content: [item]
		});
		timeline.placeAt("content");
		await nextUIUpdate();
		var aAction = timeline.getDomRef().querySelectorAll(".sapSuiteUiCommonsTimelineItemActionLink");
		assert.equal(aAction.length, 1, "Only one action should be rendered.");
		assert.equal(aAction[0].text, "Action", "Custom action should be displayed.");
		assert.notOk(aAction[0].title, "Title is absent.");
		timeline.destroy();
	});

	QUnit.test("Timeline with custom action which modify custom actions.", async function (assert) {
		//If custom action changes, the item should display the new actions only.
		//Custom "show more" "show less".
		var action1 = new CustomData({
			key: "Action 1",
			value: "Action 1"
		});
		var action2 = new CustomData({
			key: "Action 2",
			value: "Action 2"
		});
		var item = new TimelineItem({
			dateTime: new Date(2016, 0, 1),
			customAction: [action1]
		});
		item.attachCustomActionClicked(function (args) {
			item.removeAllCustomAction();
			if (args.getParameter("key") === action1.getKey()) {
				item.addCustomAction(action2);
			} else {
				item.addCustomAction(action1);
			}
		});
		var timeline = new Timeline({
			content: [item]
		});
		timeline.placeAt("content");
		await nextUIUpdate();
		var $links = timeline.$().find("li.sapSuiteUiCommonsTimelineItem").eq(0).find("div.sapSuiteUiCommonsTimelineItemShellBottom").find("a");
		assert.equal($links.length, 1, "Only one custom action link should be visible.");
		assert.equal($links.first().text(), "Action 1", "First custom action should get rendered.");
		$links.first().mousedown().mouseup().click();
		await nextUIUpdate();

		$links = timeline.$().find("li.sapSuiteUiCommonsTimelineItem").eq(0).find("div.sapSuiteUiCommonsTimelineItemShellBottom").find("a");
		assert.equal($links.length, 1, "Only one custom action link should be visible.");
		assert.equal($links.first().text(), "Action 2", "First custom action should get rendered.");
		$links.first().mousedown().mouseup().click();
		await nextUIUpdate();

		$links = timeline.$().find("li.sapSuiteUiCommonsTimelineItem").eq(0).find("div.sapSuiteUiCommonsTimelineItemShellBottom").find("a");
		assert.equal($links.length, 1, "Only one custom action link should be visible.");
		assert.equal($links.first().text(), "Action 1", "First custom action should get rendered.");
		timeline.destroy();
	});

	QUnit.test("TimelineItem renders alone.", async function (assert) {
		var item = new TimelineItem({
			title: "Item"
		});
		item.placeAt("content");
		await nextUIUpdate();
		assert.equal(item.$().find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), "Item", "TimelineItem should render without Timeline.");
		item.destroy();
	});

	QUnit.test("TimelineItem: \\n in text converts to BR.", async function (assert) {
		var item = new TimelineItem({
			text: "Line 1\nLine 2\nLine 3"
		});
		item.placeAt("content");
		await nextUIUpdate();
		assert.equal(item.$().find("div.sapSuiteUiCommonsTimelineItemTextWrapper").find("br").length, 2, "2 BR should be rendered.");
		item.destroy();
	});

	QUnit.test("Timeline with custom style class.", async function (assert) {
		var timeline = TestUtils.buildTimelineWithoutBinding([]);
		timeline.addStyleClass("customClass");
		timeline.placeAt("content");
		await nextUIUpdate();

		assert.ok(timeline.$().hasClass("customClass"), "Custom style class wasn't rendered.");
		timeline.destroy();
	});
});
