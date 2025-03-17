sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"./TimelineTestUtils",
	"sap/ui/events/KeyCodes",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/Timeline",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/date/UI5Date",
	"sap/suite/ui/commons/TimelineItem",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/core/Lib",
	"sap/base/i18n/Localization"
], function ($, TestUtils, KeyCodes, createAndAppendDiv, JSONModel, Timeline, DateFormat, UI5Date, TimelineItem, nextUIUpdate, CoreLib, Localization) {
	"use strict";

	var styleElement = document.createElement("style");
	styleElement.textContent =
		".TimelineHeight {" +
		"		height: 100%;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "TimelineHeight";

	QUnit.module("TimelineTest", {
		beforeEach: function () {
			this.sinon = sinon.sandbox.create();
		},
		afterEach: function () {
			this.sinon.restore();
		}
	});

	var aData = [
		{
			dateTime: UI5Date.getInstance(2016, 0, 1),
			title: "Item 1"
		}, {
			dateTime: UI5Date.getInstance(2016, 0, 2),
			title: "Item 2"
		}, {
			dateTime: UI5Date.getInstance(2016, 0, 3),
			title: "Item 3"
		}
	];

	var aData2 = [
		{
			dateTime: UI5Date.getInstance(2016, 0, 1),
			title: "Item 1"
		}, {
			dateTime: UI5Date.getInstance(2016, 0, 2),
			title: "Item 2"
		}, {
			dateTime: UI5Date.getInstance(2016, 0, 3),
			title: "Item 3"
		}, {
			dateTime: UI5Date.getInstance(2016, 0, 3),
			title: "Item 4"
		}, {
			dateTime: UI5Date.getInstance(2016, 0, 3),
			title: "Item 5"
		}
	];

	var aDataScroll = [
		{
			dateTime: UI5Date.getInstance(2016, 0, 1),
			visible: true,
			filterValue: "1",
			title: "Item 1"
		},
		{
			dateTime: UI5Date.getInstance(2016, 0, 2),
			visible: false,
			filterValue: "1",
			title: "Item 2"
		}, {
			dateTime: UI5Date.getInstance(2016, 1, 10),
			visible: true,
			filterValue: "3",
			title: "Item 3"
		}, {
			dateTime: UI5Date.getInstance(2016, 1, 7),
			visible: true,
			filterValue: "4",
			title: "Item 4"
		}, {
			dateTime: UI5Date.getInstance(2017, 8, 30),
			visible: true,
			filterValue: "5",
			title: "Item 5"
		},
		{
			dateTime: UI5Date.getInstance(2019, 0, 1),
			visible: true,
			filterValue: "1",
			title: "Item 1"
		},
		{
			dateTime: UI5Date.getInstance(2019, 0, 2),
			visible: false,
			filterValue: "1",
			title: "Item 2"
		}, {
			dateTime: UI5Date.getInstance(2019, 0, 10),
			visible: true,
			filterValue: "3",
			title: "Item 3"
		}, {
			dateTime: UI5Date.getInstance(2019, 1, 7),
			visible: true,
			filterValue: "4",
			title: "Item 4"
		}, {
			dateTime: UI5Date.getInstance(2018, 8, 30),
			visible: true,
			filterValue: "5",
			title: "Item 5"
		},
		{
			dateTime: UI5Date.getInstance(2018, 0, 1),
			visible: true,
			filterValue: "1",
			title: "Item 1"
		},
		{
			dateTime: UI5Date.getInstance(2018, 0, 2),
			visible: false,
			filterValue: "1",
			title: "Item 2"
		}, {
			dateTime: UI5Date.getInstance(2018, 0, 10),
			visible: true,
			filterValue: "3",
			title: "Item 3"
		}, {
			dateTime: UI5Date.getInstance(2018, 1, 7),
			visible: true,
			filterValue: "4",
			title: "Item 4"
		}, {
			dateTime: UI5Date.getInstance(2020, 8, 30),
			visible: true,
			filterValue: "5",
			title: "Item 5"
		}
	];

	var oOptions = {
		sortOldestFirst: true,
		showIcons: false
	};

	var oData = {
		content:[]
	};

	QUnit.test("Select fired by click", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);

		oTimeline.attachSelect(function (oEvent) {
			assert.ok(oEvent.getParameter("userAction"), "Click should fire select with userAction = true");
		});
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline.getContent()[0].$("outline").mousedown().mouseup().click();

		oTimeline.destroy();
	});

	QUnit.test("Enter key fires select", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);

		oTimeline.placeAt("content");
		await nextUIUpdate();

		var oItem = oTimeline.getContent()[0];
		oItem.$("outline").mousedown().mouseup().click();
		oTimeline.attachSelect(function (oEvent) {
			assert.ok(oEvent.getParameter("userAction"), "Enter should fire select with userAction = true");
		});
		var oEvent = $.Event("keypress");
		oEvent.which = KeyCodes.ENTER;
		oEvent.target = oItem.getDomRef("outline");
		oTimeline.oItemNavigation.onsapenter(oEvent);

		oTimeline.destroy();
	});

	QUnit.test("Arrow key fires select without userAction", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);

		oTimeline.placeAt("content");
		await nextUIUpdate();

		var oItem = oTimeline.getContent()[0];
		oItem.$("outline").mousedown().mouseup().click();
		oTimeline.attachSelect(function (oEvent) {
			assert.ok(!oEvent.getParameter("userAction"), "Enter should fire select with userAction = true");
		});
		var oEvent = $.Event("keypress");
		oEvent.which = KeyCodes.ARROW_DOWN;
		oEvent.target = oItem.getDomRef("outline");
		oTimeline.oItemNavigation.onsapnext(oEvent);

		oTimeline.destroy();
	});

	QUnit.test("alt + right/left is not handled", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		var oModifiers = oTimeline.oItemNavigation.getDisabledModifiers();
		assert.ok(oModifiers["sapnext"], "sapnext has disabled modifiers");
		assert.ok(oModifiers["sapprevious"], "sapprevious has disabled modifiers");
		assert.equal(oModifiers["sapnext"][0], "alt", "alt is not handled when right is pressed");
		assert.equal(oModifiers["sapprevious"][0], "alt", "alt is not handled when left is pressed");

		oTimeline.destroy();
	});

	/**
	 * @deprecated Since version 1.46.0
	 */
	QUnit.test("BindingChange", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData2);
		oTimeline.setEnableScroll(false);
		oTimeline.setGrowingThreshold(2);

		oTimeline.placeAt("content");
		await nextUIUpdate();

		oTimeline._loadMore();
		await nextUIUpdate();

		// check load
		assert.equal(oTimeline.getContent().length, 4, "Items count");
		assert.equal(oTimeline._iItemCount, 4, "Items count");

		var oModel = new JSONModel({
			Items: aData
		});
		oTimeline.setModel(oModel);

		await nextUIUpdate();

		assert.equal(oTimeline._iItemCount, 2, "Items count");

		oTimeline.destroy();
	});

	QUnit.test("Timeline Sort Icon Aria-Label Validation - sortOldestFirst: true", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData, { sortOldestFirst: true, showIcons: true });
		oTimeline.placeAt("content");
		await nextUIUpdate();

		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Ascending", "Tooltip has default value as Sort Ascending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Ascending", "aria-label has value as Sort Descending.");

		oTimeline._sortClick();
		await nextUIUpdate();
		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Descending", "Tooltip has value changed to Sort Descending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Descending", "aria-label has value as Sort Descending.");

		oTimeline._sortClick();
		await nextUIUpdate();
		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Ascending", "Tooltip has value changed to Sort Ascending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Ascending", "aria-label has value as Sort Ascending.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline Sort Icon Aria-Label Validation - sortOldestFirst: false", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData, { sortOldestFirst: false, showIcons: true });
		oTimeline.placeAt("content");
		await nextUIUpdate();

		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Descending", "Tooltip has value changed to Sort Descending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Descending", "aria-label has value as Sort Descending.");

		oTimeline._sortClick();
		await nextUIUpdate();
		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Ascending", "Tooltip has default value as Sort Ascending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Ascending", "aria-label has value as Sort Descending.");

		oTimeline._sortClick();
		await nextUIUpdate();
		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Descending", "Tooltip has value changed to Sort Descending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Descending", "aria-label has value as Sort Descending.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline Sorting Icon Validation", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData, { sortOldestFirst: true, showIcons: true });
		oTimeline.placeAt("content");
		await nextUIUpdate();

		assert.equal(oTimeline._objects.getSortIcon().getIcon(), "sap-icon://sort-ascending", "For Ascending sorted timeline, we have sort-ascending icon.");

		oTimeline._sortClick();
		await nextUIUpdate();
		assert.equal(oTimeline._objects.getSortIcon().getIcon(), "sap-icon://sort-descending", "For Descending sorted timeline, we have sort-descending icon.");

		oTimeline.destroy();
	});

	/**
	 * @deprecated Since version 1.46.0
	 */
	QUnit.test("Mannual size limit", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData2);
		oTimeline.setEnableScroll(false);
		oTimeline.setGrowingThreshold(2);

		oTimeline.placeAt("content");
		await nextUIUpdate();



		var oModel1 = new JSONModel({
			Items: aData
		});
		var iManualSizeLimit = 2;
		oModel1.setSizeLimit(iManualSizeLimit);
		oTimeline.setModel(oModel1);

		await nextUIUpdate();

		assert.equal(oTimeline._getMaxItemsCount(), iManualSizeLimit);

		oTimeline.destroy();
	});

	QUnit.test("ariaLabelledBy for Timeline", function (assert) {
		var oLabel = new sap.m.Label({
			id: "testLabel",
			text: "Timeline ARIA-Label"
		});
		var oLabel2 = new sap.m.Label({
			id: "testLabel2",
			text: "Timeline ARIA-Label"
		});
		oLabel.placeAt("content");
		oLabel2.placeAt("content");
		var oTimeline = TestUtils.buildTimeline(aData, { sortOldestFirst: false, showIcons: true });
		oTimeline.addAriaLabelledBy(oLabel);
		oTimeline.placeAt("content");
		assert.equal(oTimeline.getAriaLabelledBy()[0], oLabel.sId, "ariaLabelledBy property is set for Timeline");
		oTimeline.addAriaLabelledBy(oLabel2);
		var aLabelIds = [];
		aLabelIds.push(oLabel.sId);
		aLabelIds.push(oLabel2.sId);
		assert.equal(oTimeline.getAriaLabelledBy().join(" "), aLabelIds.join(" "), "Multiple associations added to Timeline");
		oTimeline.removeAllAriaLabelledBy();
		assert.equal(oTimeline.getAriaLabelledBy().length, 0, "All ariaLabelledBy associations are removed using removeAllAriaLabelledBy()");
		oTimeline.destroy();
		oLabel.destroy();
		oLabel2.destroy();
	});

	QUnit.test("Grow on scroll", async function (assert) {
		oOptions.lazyLoading = true;
		oOptions.growingThreshold = 5;
		var oTimeline = TestUtils.buildTimeline(aDataScroll, oOptions);
		oTimeline.placeAt("content");
		await nextUIUpdate();
		var fnDone = assert.async();
		var oTimelineDom = oTimeline.getDomRef().querySelector(".sapSuiteUiCommonsTimelineContents");
		var oSpy = sinon.spy(oTimeline, "_moveScrollBar");
		oTimelineDom.scrollTop = oTimelineDom.scrollHeight;
		var iScrollPosition = oTimelineDom.scrollTop;
		var afterRenderDelegate = {
			onAfterRendering: function () {
				assert.equal(oSpy.called, true, "Move Scroll Bar method is called");
				assert.equal(oTimeline._$content.scrollTop(), iScrollPosition, "Scroll postions is not changed after data is loaded");
				assert.equal(oTimeline.oItemNavigation.iFocusedIndex, -1, "Focus index is set to default -1");
				oTimeline.removeEventDelegate(afterRenderDelegate);
				oTimeline.destroy();
				fnDone();
			}

		};
		oTimeline.addEventDelegate(afterRenderDelegate);
	});

	QUnit.test("Enable busy indicator when updating the timeline or loading more items", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aDataScroll, oOptions);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		//on applyChanges ececution, onAfterRendering being called at the end, so we are checking busy to be false.(by default its true)
		assert.equal(oTimeline.getBusy(), false, "checking the busy indicator is false onAfterRendring");

		//every time we load data by calling refreshContent, the busy should be true
		oTimeline.refreshContent();
		assert.equal(oTimeline.getBusy(), true, "Busy indicator must be setted up after refreshContent");


		oTimeline.destroy();
	});

	QUnit.test("Height of Load More Button for Cozy Mode", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aDataScroll, {
			axisOrientation: "Horizontal"
		});
		var element1 = document.querySelector("body");
		element1.classList.remove("sapUiSizeCompact");
		element1.classList.add("sapUiSizeCozy");
		oTimeline.placeAt("content");
		await nextUIUpdate();
		assert.equal(getComputedStyle(document.querySelector(".sapSuiteUiCommonsTimelineItemGetMoreButtonH")).height, "40px", "The height is applied in Cozy mode");

		oTimeline.destroy();
		element1.classList.remove("sapUiSizeCozy");
		element1.classList.add("sapUiSizeCompact");
	});

	QUnit.test("Height of Load More Button for Condensed Mode", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aDataScroll, {
			axisOrientation: "Horizontal"
		});
		var element1 = document.querySelector("body");
		element1.classList.remove("sapUiSizeCompact");
		element1.classList.add("sapUiSizeCondensed");
		oTimeline.placeAt("content");
		await nextUIUpdate();
		assert.equal(getComputedStyle(document.querySelector(".sapSuiteUiCommonsTimelineItemGetMoreButtonH")).height, "40px", "The height is applied in Condensed mode");

		oTimeline.destroy();
		element1.classList.remove("sapUiSizeCondensed");
		element1.classList.add("sapUiSizeCompact");
	});

	QUnit.test("Enable IANA time zones for Custome Time Range Filter", async function (assert) {
		var oCoreSpy = this.spy(CoreLib, "getResourceBundleFor");
		this.sinon.stub(Localization, 'getTimezone').returns("Japan");

		var oTimeline = TestUtils.buildTimeline(aData2);
		var fromDate = UI5Date.getInstance(2016, 0, 1), toDate = UI5Date.getInstance(2016, 0, 2);
		oTimeline.placeAt("content");
		await nextUIUpdate();
		oTimeline.setCurrentTimeFilter({
			from: fromDate,
			to: toDate,
			type: "None"
		});

		var sExpectedMessage = "Time Range (" + DateFormat.getDateTimeWithTimezoneInstance().format(fromDate) + " - " + DateFormat.getDateTimeWithTimezoneInstance().format(toDate) + ")";
		var str = oTimeline._getRangeMessage();
		assert.equal(oTimeline._getRangeMessage(), sExpectedMessage, str);

		oCoreSpy.restore();
		oTimeline.destroy();
	});

	/**
	 * @deprecated Since version 1.46.0
	 */
	QUnit.test("Focus should be restored to the new loaded item when we press show more button in odata binding", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData2);
		oTimeline.setEnableScroll(false);
		oTimeline.setGrowingThreshold(2);
		oTimeline.placeAt("content");
		await nextUIUpdate();
		this.stub(oTimeline, "getBinding").returns({
			getLength: function () {
				return 5;
			},
			getContexts: function () {
				return {
					dataRequested: true
				};
			},
			getModel: function () {
				return {};
			}
		});
		var oSpy = sinon.spy(oTimeline.oItemNavigation, "refocusOnNextUpdate");
		oTimeline._loadMore();
		assert.ok(oSpy.calledOnce, "Focus has been set as expected after pressing load more button");
		oTimeline.destroy();
	});

	QUnit.test("Aria-live attribute should not be present", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData2);
		oTimeline.placeAt("content");
		await nextUIUpdate();
		assert.notOk(oTimeline.getDomRef().getAttribute("aria-live", "Aria-live should not be present on the timeline"));
		oTimeline.destroy();
	});

	QUnit.test("CustomListItem within Timeline - Vertical", async function (assert) {
		var sUserName = "User Name",
			sText = "Implementing new Public Cloud ERP Financials system into his company and keeping it aligned with business.",
			oTimeline = new Timeline({
				content: new TimelineItem({
					userName: sUserName,
					text: sText,
					embeddedControl: new sap.m.List({
						items: [
							new sap.m.CustomListItem({
								content: [
									new sap.ui.core.Icon({
										id: "icon",
										src: "sap-icon://attachment-photo",
										size: "1rem"
									}),
									new sap.m.Text({
										id: "text1",
										text: "text"
									}),
									new sap.m.Label({
										id: "text2",
										text: "text"
									})
								]
							})
						]
					})
				})
			});

		oTimeline.placeAt("content");
		await nextUIUpdate();
		assert.equal(getComputedStyle(document.getElementById("icon")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(document.getElementById("text1")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(document.getElementById("text2")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(oTimeline.getDomRef().querySelectorAll(".sapSuiteUiCommonsTimelineItemBox")[0])["min-height"], "0px" ,"No min height set.");
		oTimeline.destroy();
	});

	QUnit.test("CustomListItem within Timeline - Horizontal", async function (assert) {
		var sUserName = "User Name",
			sText = "Implementing new Public Cloud ERP Financials system into his company and keeping it aligned with business.",
			oTimeline = new Timeline({
				axisOrientation: "Horizontal",
				content: new TimelineItem({
					userName: sUserName,
					text: sText,
					embeddedControl: new sap.m.List({
						items: [
							new sap.m.CustomListItem({
								content: [
									new sap.ui.core.Icon({
										id: "icon",
										src: "sap-icon://attachment-photo",
										size: "1rem"
									}),
									new sap.m.Text({
										id: "text1",
										text: "text"
									}),
									new sap.m.Label({
										id: "text2",
										text: "text"
									})
								]
							})
						]
					})
				})
			});

		oTimeline.placeAt("content");
		await nextUIUpdate();
		assert.equal(getComputedStyle(document.getElementById("icon")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(document.getElementById("text1")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(document.getElementById("text2")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(oTimeline.getDomRef().querySelectorAll(".sapSuiteUiCommonsTimelineItemBox")[0])["min-height"], "0px" ,"No min height set.");
		oTimeline.destroy();
	});

	QUnit.test("CustomListItem within Tim	tical", async function (assert) {
		var sUserName = "User Name",
			sText = "Implementing new Public Cloud ERP Financials system into his company and keeping it aligned with business.",
			oTimeline = new Timeline({
				content: new TimelineItem({
					userName: sUserName,
					text: sText,
					embeddedControl: new sap.m.List({
						items: [
							new sap.m.CustomListItem({
								content: [
									new sap.ui.core.Icon({
										id: "icon",
										src: "sap-icon://attachment-photo",
										size: "1rem"
									}),
									new sap.m.Text({
										id: "text1",
										text: "text"
									}),
									new sap.m.Label({
										id: "text2",
										text: "text"
									})
								]
							})
						]
					})
				})
			});

		oTimeline.placeAt("content");
		await nextUIUpdate();
		assert.equal(getComputedStyle(document.getElementById("icon")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(document.getElementById("text1")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(document.getElementById("text2")).cursor, "pointer", "Value set correctly.");
		oTimeline.destroy();
	});

	QUnit.test("CustomListItem within Timeline - Horizontal", async function (assert) {
		var sUserName = "User Name",
			sText = "Implementing new Public Cloud ERP Financials system into his company and keeping it aligned with business.",
			oTimeline = new Timeline({
				axisOrientation: "Horizontal",
				content: new TimelineItem({
					userName: sUserName,
					text: sText,
					embeddedControl: new sap.m.List({
						items: [
							new sap.m.CustomListItem({
								content: [
									new sap.ui.core.Icon({
										id: "icon",
										src: "sap-icon://attachment-photo",
										size: "1rem"
									}),
									new sap.m.Text({
										id: "text1",
										text: "text"
									}),
									new sap.m.Label({
										id: "text2",
										text: "text"
									})
								]
							})
						]
					})
				})
			});

		oTimeline.placeAt("content");
		await nextUIUpdate();
		assert.equal(getComputedStyle(document.getElementById("icon")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(document.getElementById("text1")).cursor, "pointer", "Value set correctly.");
		assert.equal(getComputedStyle(document.getElementById("text2")).cursor, "pointer", "Value set correctly.");
		oTimeline.destroy();
	});


	QUnit.test("Timeline filterMessage tooltip check", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData),
			sMessageText = "This is a Tooltip";

		this.sinon.stub(oTimeline, '_getFilterMessage').returns(sMessageText);

		oTimeline.placeAt("content");
		await nextUIUpdate();

		var oFilterMessage = oTimeline._objects.getFilterMessageText();

		assert.equal(oFilterMessage.getText(), sMessageText, "Text is set.");
		assert.equal(oFilterMessage.getTooltip(), sMessageText, "Tooltip is set.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline filterMessage icon aria-hodden check", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);
		oTimeline.placeAt("content");
		await nextUIUpdate();
		var oFilterMessage = oTimeline._objects.getFilterMessage();

		assert.equal(oFilterMessage.getContent()[2].getDecorative(), false, "Decorative is false.");
		oTimeline.destroy();
	});

	QUnit.test("Timeline Search check", async function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData, { sortOldestFirst: true, showIcons: true });
		oTimeline.placeAt("content");
		oTimeline._search("Item 2");
		assert.strictEqual(oTimeline._searchValue, "Item 2", "Search value should be set to 'Item 2'");
		oTimeline._search("");
		assert.strictEqual(oTimeline._searchValue, "", "Search value should be an empty string");
		await nextUIUpdate();
		oTimeline.destroy();
	});

	QUnit.test("Timeline FilterIcon disabled when no data available ", async function (assert){
		var oTimeline = TestUtils.buildTimeline(oData);
		oTimeline.placeAt("content");
		oTimeline.updateContent();
		assert.strictEqual(oTimeline._objects.getFilterIcon().getEnabled(),false, "FilterIcon should be disabled");
		await nextUIUpdate();
		oTimeline.destroy();
	});
	QUnit.test("The role of the UL should be set as list", async function(assert){
		var oTimeline = TestUtils.buildTimeline(aData);
		oTimeline.placeAt("content");
		await nextUIUpdate();
		var sId = oTimeline.getId() + "-scroll";
		var oUl = document.getElementById(sId).childNodes[0];
		assert.equal(oUl.role,"list","Role of the UL must be set to list");
	});

	QUnit.test("Refresh content and update aggregation correctly on model update", async function (assert) {
		var done = assert.async(); // Use QUnit's async feature
		var oTimeline = TestUtils.buildTimeline(aData);
		var oModel = new JSONModel({
			Items: aData
		});
		oTimeline.setModel(oModel);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		var oUpdateAggregationSpy = this.spy(oTimeline, "updateAggregation");
		// Call refreshContent
		oTimeline.refreshContent();

		// Ensure updateAggregation is not called immediately
		assert.ok(oUpdateAggregationSpy.notCalled, "updateAggregation should not be called immediately");

		// Simulate async behavior by waiting for the next UI update
		await nextUIUpdate();
		// Simulate the model update
		oModel.updateBindings(true);
		await nextUIUpdate();
		// Ensure updateAggregation is called after data is received
		assert.ok(oUpdateAggregationSpy.calledOnce, "updateAggregation should be called once after data is received");
		assert.ok(oUpdateAggregationSpy.calledWith("content"), "updateAggregation should be called with 'content' after data is received");

		// Clean up
		oUpdateAggregationSpy.restore();
		oTimeline.destroy();
		done(); // Signal that the async test is complete
	});
});
