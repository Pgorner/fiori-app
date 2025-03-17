sap.ui.define([
	"sap/suite/ui/commons/TimelineItemRenderer",
	"sap/suite/ui/commons/TimelineItem",
	"./TimelineTestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/core/date/UI5Date",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/core/theming/Parameters"
], function (TimelineItemRenderer, TimelineItem, TestUtils, createAndAppendDiv, UI5Date, nextUIUpdate, Parameters) {
	"use strict";

	var styleElement = document.createElement("style");
	styleElement.textContent =
		".TimelineHeight {" +
		"		height: 100%;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "TimelineHeight";

	function getTabbables(oElement) {
		return jQuery(oElement).find(":sapTabbable");
	}

	QUnit.module("TimelineItemRendererTest");

	QUnit.test("_getFormatedDateTime test", function (assert) {
		var today = (UI5Date.getInstance()).valueOf();

		var oControl = {
			dateTime: UI5Date.getInstance(today),
			getDateTime: function () {
				return this.dateTime;
			},
			getDateTimeWithoutStringParse: function () {
				return this.dateTime;
			}
		};
		var oOptions = {
			dateFormat: {
				format: function () {
					return "<DATE_VALUE>";
				}
			},
			timeFormat: {
				format: function () {
					return "<TIME_VALUE>";
				}
			},
			resBundle: {
				getText: function (sStr) {
					return sStr;
				}
			}
		};
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "TIMELINE_TODAY TIMELINE_AT <TIME_VALUE>", "Today formatting.");
		oControl.dateTime = UI5Date.getInstance(today);
		oControl.dateTime.setDate(oControl.dateTime.getDate() - 1);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "TIMELINE_YESTERDAY TIMELINE_AT <TIME_VALUE>", "Yeasterday formatting.");
		oControl.dateTime = UI5Date.getInstance(today);
		oControl.dateTime.setDate(oControl.dateTime.getDate() - 2);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "<DATE_VALUE> TIMELINE_AT <TIME_VALUE>", "To days ago formatting.");
		oControl.dateTime = UI5Date.getInstance(today);
		oControl.dateTime.setDate(oControl.dateTime.getDate() + 1);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "<DATE_VALUE> TIMELINE_AT <TIME_VALUE>", "Tomorrow formatting.");
		oControl.dateTime = UI5Date.getInstance(today);
		oControl.dateTime.setHours(0, 0, 1, 0);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "TIMELINE_TODAY TIMELINE_AT <TIME_VALUE>", "Today 1 sec after midnight.");
		oControl.dateTime = UI5Date.getInstance(today);
		oControl.dateTime.setDate(oControl.dateTime.getDate() - 1);
		oControl.dateTime.setHours(23, 59, 59, 0);
		assert.equal(TimelineItemRenderer._getFormatedDateTime(oControl, oOptions), "TIMELINE_YESTERDAY TIMELINE_AT <TIME_VALUE>", "Yeasterday 1 sec before midnight.");
	});

	QUnit.test("TimelineItem with custom style class.", async function (assert) {
		var item = new TimelineItem();
		item.addStyleClass("customClass");
		item.placeAt("content");
		await nextUIUpdate();

		assert.ok(item.$().hasClass("customClass"), "Custom style class wasn't rendered.");
		item.destroy();
	});

	QUnit.test("TimelineItem with custom message.", async function (assert) {
		var customMessage = "Custom message";
		var item = new TimelineItem();
		item.setCustomMessage(customMessage);
		item.placeAt("content");
		await nextUIUpdate();

		assert.equal(item.$("infoBar").text(), customMessage, "Custom message should be visible.");
		item.destroy();
	});

	QUnit.test("Correct single item invalidation", async function (assert) {
		// test that after items' invalidation the whole recalculation is done
		var data = [
			{
				dateTime: UI5Date.getInstance(2016, 0, 1)
			}, {
				dateTime: UI5Date.getInstance(2016, 0, 2)
			}, {
				dateTime: UI5Date.getInstance(2016, 0, 3)
			}, {
				dateTime: UI5Date.getInstance(2016, 0, 4)
			}, {
				dateTime: UI5Date.getInstance(2016, 0, 5)
			}
		];

		var timeline = TestUtils.buildTimeline(data, {
			enableDoubleSided: true
		}, {
			dateTime: "{dateTime}"
		});
		timeline.placeAt("content");
		await nextUIUpdate();

		timeline.getContent()[0].invalidate();
		timeline.getContent()[1].invalidate();
		timeline.getContent()[2].invalidate();
		await nextUIUpdate();

		var $oddItems = timeline.$().find(".sapSuiteUiCommonsTimelineItemOdd");
		var $evenItems = timeline.$().find(".sapSuiteUiCommonsTimelineItemEven");
		assert.equal($oddItems.length, 3, "1 odd items must be rendered.");
		assert.equal($evenItems.length, 2, "1 even items must be rendered.");
		timeline.destroy();
	});

	QUnit.test("Test tab button event", async function (assert) {
		var aData = [
			{
				dateTime: UI5Date.getInstance(2016, 0, 1),
				title: "Item 1"
			}
		];
		var oTimeline = TestUtils.buildTimeline(aData);
		oTimeline.placeAt("content");
		await nextUIUpdate();
		oTimeline.oItemNavigation.getItemDomRefs()[0].focus();
		var oEvt = {
			preventDefault: function () {
			},
			target: oTimeline.oItemNavigation.getItemDomRefs()[0]
		};
		oTimeline.oItemNavigation.onsaptabnext(oEvt);
		var oOutlineDomRef = oTimeline.$().find(".sapSuiteUiCommonsTimelineItemOutline").get(0);
		assert.equal(document.activeElement, oOutlineDomRef, "Focus comes on the timeline item");
		assert.ok(getComputedStyle(oOutlineDomRef).outline.indexOf(Parameters.get("sapUiContentFocusStyle")), "Focus Style applied.");
		assert.ok(getComputedStyle(oOutlineDomRef).outline.indexOf(Parameters.get("sapUiContentFocusColor")), "Focus Color applied.");
		assert.ok(getComputedStyle(oOutlineDomRef).outline.indexOf(Parameters.get("sapUiContentFocusWidth")), "Focus Width applied.");
		oTimeline.destroy();
	});

	QUnit.test("Checking nodetype for itemlineitem header and groupid for itemlineitem element", async function (assert) {
		var data = [
			{
				dateTime: UI5Date.getInstance(2016, 0, 1)
			}, {
				dateTime: UI5Date.getInstance(2016, 0, 2)
			}, {
				dateTime: UI5Date.getInstance(2016, 0, 3)
			}, {
				dateTime: UI5Date.getInstance(2016, 0, 4)
			}, {
				dateTime: UI5Date.getInstance(2016, 0, 5)
			}
		];

		var timeline = TestUtils.buildTimeline(data, {
			groupBy: "dateTime",
			groupByType: "Day"
		}, {
			dateTime: "{dateTime}"
		});
		timeline.placeAt("content");
		await nextUIUpdate();

		// var $oddItems = timeline.$().find(".sapSuiteUiCommonsTimelineItemOdd");
		assert.equal(timeline.getContent()[0].$()[0].attributes["nodetype"].value, "GroupHeader", "Before sorting Timeline Item header have nodetype attribute(GroupHeader)");
		if (timeline.getContent()[0].$()[0].attributes["groupid"]) {
			assert.equal(timeline.getContent()[0].$()[0].attributes["groupid"].value, "2016/01/05", "Before sorting Timeline Item header have nodetype attribute(GroupHeader)");
		}
		timeline._sortClick();
		await nextUIUpdate();
		assert.equal(timeline.getContent()[0].$()[0].attributes["nodetype"].value, "GroupHeader", "After sorting Timeline Item header have nodetype attribute(GroupHeader)");
		if (timeline.getContent()[0].$()[0].attributes["groupid"]) {
			assert.equal(timeline.getContent()[0].$()[0].attributes["groupid"].value, "2016/01/01", "After sorting Timeline Item header have nodetype attribute(GroupHeader)");
		}
		timeline.destroy();
	});

	QUnit.test("TimelineItem Rendering for groups", async function (assert) {
		var data = [
			{
				dateTime: UI5Date.getInstance(2019, 0, 1)
			}, {
				dateTime: UI5Date.getInstance(2018, 0, 2)
			}, {
				dateTime: UI5Date.getInstance(2017, 0, 3)
			}, {
				dateTime: UI5Date.getInstance(2016, 0, 4)
			}
		];
		var timeline = TestUtils.buildTimeline(data, {
			groupBy: "dateTime",
			groupByType: "Year"
		}, {
			dateTime: "{dateTime}"
		});
		timeline.placeAt("content");
		await nextUIUpdate();

		var oTimelineItem = timeline.getContent()[1];
		if (oTimelineItem) {
			assert.equal(timeline.getContent()[1].getDomRef().classList.contains("sapSuiteUiCommonsTimelineItemUlWrapper"), true, "Class is added");
			assert.ok(timeline.getContent()[1].getDomRef().getAttribute("id"), "Id is added");
			assert.ok(timeline.getContent()[1].getDomRef().getAttribute("data-sap-ui"), "data-sap-ui is present");
		}
		timeline.destroy();
	});

	QUnit.test("No errors for Timeline in axisOrientation:Horizontal", async function (assert) {
		var data = [
			{
				dateTime: UI5Date.getInstance(2016, 0, 1)
			}
		];

		var oSpyLogError = this.stub(console, "assert");

		var oTimeline = TestUtils.buildTimeline(data, {
			enableDoubleSided: true,
			axisOrientation: "Horizontal"
		}, {
			dateTime: "{dateTime}"
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		assert.equal(oSpyLogError.callCount, 0, "There should be no error in console.");
		var oTimelineItem = oTimeline.getContent()[0];
		if (oTimelineItem && oTimelineItem.getDomRef() && oTimelineItem.getDomRef().children
			&& oTimelineItem.getDomRef().children[0] && oTimelineItem.getDomRef().children[0].classList) {
			assert.equal(oTimelineItem.getDomRef().children[0].classList.contains("sapSuiteUiCommonsTimelineItemWrapperH"), true, "Respective class is present");
			assert.equal(oTimelineItem.getDomRef().children[0].classList.contains("sapSuiteUiCommonsTimelineItemBaseLength"), true, "Respective class is present");
		}
		oTimeline.destroy();
	});

});
