sap.ui.define([
	"sap/suite/ui/commons/TimelineItem",
	"sap/suite/ui/commons/Timeline",
	"sap/ui/core/Control",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/base/Object",
	"sap/ui/core/format/DateFormat",
	"./TimelineTestUtils",
	"sap/m/Link",
	"sap/ui/events/KeyCodes",
	"sap/ui/core/date/UI5Date",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/core/Lib",
	"sap/ui/core/Element",
	"sap/base/i18n/Localization"
], function (TimelineItem, Timeline, Control, createAndAppendDiv, BaseObject, DateFormat, TestUtils, Link, KeyCodes, UI5Date, nextUIUpdate, CoreLib, Element, Localization) {
	"use strict";

	var styleElement = document.createElement("style");
	styleElement.textContent =
		".TimelineItemHeight {" +
		"		height: 700px;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "TimelineItemHeight";

	QUnit.module("TimelineItemTest");

	var oTestData = [
		{
			dateTime: "2021-08-17T13:47:16Z",
			dateParts: [2016, 0, 1],
			firstName: "First1",
			lastName: "Last1",
			fullName: "First1 Last1",
			title: "Item 1",
			itemNumber: 1,
			text: "Item text 1",
			text1: "word1",
			text2: "word2"
		}
	];

	function FakeEvent(oGraph, mParameters) {
		var sKey;
		this._bPreventDefaultCalled = false;
		this._bStopPropagationCalled = false;
		this.target = oGraph;
		if (mParameters) {
			for (sKey in mParameters) {
				if (mParameters.hasOwnProperty(sKey)) {
					this[sKey] = mParameters[sKey];
				}
			}
		}
	}

	FakeEvent.prototype.preventDefault = function () {
		this._bPreventDefaultCalled = true;
	};

	FakeEvent.prototype.stopPropagation = function () {
		this._bStopPropagationCalled = true;
	};

	function createSpaceEvent(oItem) {
		return new FakeEvent(oItem, {
			key: "Space",
			which: KeyCodes.SPACE
		});
	}

	function createEnterEvent(oItem) {
		return new FakeEvent(oItem, {
			key: "Enter",
			which: KeyCodes.ENTER
		});
	}

	QUnit.test("getDateTime test", function (assert) {
		var oMockItem = {
			dateTime: UI5Date.getInstance(),
			getProperty: function (sPropName) {
				if (sPropName !== "dateTime") {
					throw new Error("Cannot return property: " + sPropName);
				}
				return this.dateTime;
			}
		},
			fnGetDateTime = (new TimelineItem()).getDateTime.bind(oMockItem),
			iDateNumber = 1475154256914;
		assert.equal(fnGetDateTime(), oMockItem.dateTime, "Date type should be returned right away.");
		oMockItem.dateTime = iDateNumber;
		assert.equal(fnGetDateTime().valueOf(), iDateNumber, "Number date should be converted to date.");
		oMockItem.dateTime = "Date(" + iDateNumber + ")";
		assert.equal(typeof fnGetDateTime(), "object", "String date should be parsed to date.");
		assert.equal(fnGetDateTime().valueOf(), iDateNumber, "String date should be parsed to date.");

		oMockItem.dateTime = "incorrect 12345566";
		assert.equal(fnGetDateTime(), oMockItem.dateTime, "Mall formatted string should be returned as is.");
	});

	QUnit.test("getDateTime returns Date instance for different language codes", async function (assert) {
		var timeline = TestUtils.buildTimeline(oTestData, { sortOldestFirst: true, showIcons: false }, {
			dateTime: {
				parts: ["dateTime"],
				formatter: function () {
					return "08/17/2021, 07:15:49 午後";
				}
			},
			userName: {
				parts: ["firstName", "lastName"]
			},
			title: "{itemNumber}",
			text: {
				parts: ["text1", "text2"],
				formatter: function (t1, t2) {
					return t1 + "\n" + t2;
				}
			}
		});
		timeline.placeAt("content");
		await nextUIUpdate();

		var $items = timeline.$().find(".sapSuiteUiCommonsTimelineItem");
		assert.equal($items.length, 1, "1 item must be rendered.");

		var oItem = timeline.getContent()[0],
			oItemDateValue = oItem.getDateTime();

		assert.ok(oItemDateValue instanceof Date, "Date value must be returned by getDateTime.");
		timeline.destroy();
	});

	QUnit.test("Short text renders all.", async function (assert) {
		var sText = Array(500).join("a");
		var oItem = new TimelineItem({
			text: sText
		});
		oItem.placeAt("content");
		await nextUIUpdate();

		var renderedStr = oItem.$("realtext").text();
		assert.equal(renderedStr, sText, "Short text should render completely.");
		oItem.destroy();
	});

	QUnit.test("Long text renders partially.", async function (assert) {
		var sText = Array(1000).join("a"),
			oItem = new TimelineItem({
				text: sText
			}),
			oTimeline = new Timeline(),
			sRenderedStr,
			$button;
		oItem._orientation = "H";
		oTimeline.addContent(oItem);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		sRenderedStr = oItem.$("realtext").text();
		assert.ok(sRenderedStr.length < sText.length, "Long text should be rendered partially.");
		assert.equal(sRenderedStr, sText.substr(0, sRenderedStr.length), "Rendered text should be a substring of the original text.");
		$button = oItem.$("fullTextBtn");
		assert.equal($button.length, 1, "Show more button should be rendered.");

		$button.mousedown().mouseup().click();
		await nextUIUpdate();
		sRenderedStr = oItem._objects.getFullTextPopover().getContent()[0].getText();
		assert.equal(sRenderedStr, sText, "Popover text should have full text.");
		oTimeline.destroy();
	});

	QUnit.test("Reply link.", async function (assert) {
		var oTimeline = new Timeline({ enableSocial: true }),
			oItem = new TimelineItem({ replyCount: 3 });
		oTimeline.addContent(oItem);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		assert.equal(oItem.$("replyLink").text(), "Reply (3)", "Reply cound should be set.");
		oTimeline.destroy();
	});

	QUnit.test("Post reply.", async function (assert) {
		var fnDone = assert.async(),
			sExpectedMessage = "Testing message",
			oTimeline = new Timeline({ enableSocial: true }),
			oItem = new TimelineItem({
				replyPost: replyPost
			});

		function replyPost(oEvent) {
			assert.equal(oEvent.getParameter("value"), sExpectedMessage, "Generated message differs from input.");
			setTimeout(function () {
				oTimeline.destroy();
				fnDone();
			}, 0);
		}

		oTimeline.addContent(oItem);
		oTimeline.placeAt("content");
		await nextUIUpdate();

		oItem.$("replyLink").mousedown().mouseup().click();
		oItem._objects.getReplyPop().attachAfterOpen(function (oEvent) {
			var oInputArea = oItem._objects.getReplyInputArea();
			oInputArea.setValue(sExpectedMessage);

			setTimeout(function () {
				oItem.$("replyButton").mousedown().mouseup().click();
			}, 0);
		});
	});

	QUnit.test("User name click event works.", async function (assert) {
		var fnDone = assert.async(),
			sUserName = "User Name",
			oItem = new TimelineItem({
				userNameClickable: true,
				userName: sUserName,
				embeddedControl: new Link({
					text: "First Link"
				})
			});

		oItem.attachUserNameClicked(function (oevent) {
			assert.ok(true, "User name clicked event raised.");
			assert.ok(oevent.getParameter("uiElement") instanceof Control, "Returned uiElement is Control.");
			oItem.destroy();
			fnDone();
		});

		oItem.placeAt("content");
		await nextUIUpdate();
		oItem._getUserNameLinkControl().firePress();
	});

	QUnit.test("Embedded control press event works.", async function (assert) {
		var fnDone = assert.async(),
			sUserName = "User Name",
			oItem = new TimelineItem({
				userNameClickable: true,
				userName: sUserName,
				embeddedControl: new Link({
					text: "First Link"
				})
			});

		oItem.attachPress(function (oevent) {
			assert.equal(oevent.getSource().getDomRef("outline"), oItem.getDomRef("outline"), "Outline is clicked");
			oItem.destroy();
			fnDone();
		});

		oItem.placeAt("content");
		await nextUIUpdate();
		oItem.getEmbeddedControl().getDomRef().click();
	});

	QUnit.test("Timeline clickable items works.", async function (assert) {
		var fnDone = assert.async(),
			sUserName = "User Name",
			sText = "Implementing new Public Cloud ERP Financials system into his company and keeping it aligned with business.",
			oItem = new TimelineItem({
				userNameClickable: true,
				userName: sUserName,
				text: sText
			});

		oItem.placeAt("content");
		await nextUIUpdate();

		oItem.attachSelect(function (oevent) {
			assert.equal(oevent.getSource().getDomRef("outline"), oItem.getDomRef("outline"), "Outline is clicked");
			oItem.destroy();
			fnDone();
		});

		oItem.getFocusDomRef().click();
	});

	QUnit.test("keyboard handling - Enter and Space key for clickable item", async function (assert) {
		var fnDone = assert.async(),
			sUserName = "User Name",
			sText = "Implementing new Public Cloud ERP Financials system into his company and keeping it aligned with business.",
			oItem = new TimelineItem({
				userNameClickable: true,
				userName: sUserName,
				text: sText
			});

		oItem.placeAt("content");
		await nextUIUpdate();

		var oEvent = createSpaceEvent(oItem);

		oItem.attachSelect(function (oEvent) {
			assert.ok(true, "User name clicked event raised.");
			assert.ok(oEvent.getSource().getDomRef(), oItem.getDomRef(), "Space and Enter is triggered");
			oItem.destroy();
			fnDone();
		});

		oEvent.srcControl = oItem;
		oItem.onkeydown(oEvent);

		oEvent = createEnterEvent(oItem);
		oEvent.srcControl = oItem;
		oItem.onkeydown(oEvent);
	});

	QUnit.test("keyboard handling - For embeddedControl press event", async function (assert) {
		var fnDone = assert.async(),
			sUserName = "User Name",
			sText = "Implementing new Public Cloud ERP Financials system into his company and keeping it aligned with business.",
			oItem = new TimelineItem({
				userNameClickable: true,
				userName: sUserName,
				text: sText,
				embeddedControl: new Link({
					text: "First Link"
				})
			});

		oItem.placeAt("content");
		await nextUIUpdate();

		var oEvent = createEnterEvent(oItem.getEmbeddedControl());
		oItem.attachPress(function (oevent) {
			assert.ok(true, "User name clicked event raised.");
			assert.equal(oevent.getSource().getDomRef("outline"), oItem.getDomRef("outline"), "Outline is clicked");
			oItem.destroy();
			fnDone();
		});

		oEvent.srcControl = oItem.getEmbeddedControl();
		oItem.onkeydown(oEvent);
	});

	QUnit.test("Test default properties related to icon", function (assert) {
		var oItem = new TimelineItem();
		var oIcon = oItem._getLineIcon();

		assert.equal(oIcon.getTooltip(), null);
		assert.ok(oIcon.getUseIconTooltip());
	});

	QUnit.test("Properties are passed to icon", function (assert) {
		var sExpectedIconId = "icon-01";
		var sExpectedTooltip = "Cool Tooltip 1";
		var oItem = new TimelineItem({
			icon: sExpectedIconId,
			iconTooltip: sExpectedTooltip,
			useIconTooltip: false
		});

		var oIcon = oItem._getLineIcon();

		assert.equal(oIcon.getSrc(), sExpectedIconId);
		assert.equal(oIcon.getTooltip(), sExpectedTooltip);
		assert.notOk(oIcon.getUseIconTooltip());
	});

	QUnit.test("Avatar properties are passed", async function (assert) {
		var sExpectedIcon = "icon-01";
		var sExpectedTooltip = "User picture";
		var oItem = new TimelineItem({
			userPicture: sExpectedIcon,
			initials: "IT",
			displayShape: "Circle",
			displaySize: "XS"
		});

		oItem.placeAt("content");
		await nextUIUpdate();

		var sId = oItem.getId();
		var oIcon = oItem._getUserPictureControl();

		assert.equal(oIcon.getId(), sId + "-userPictureControl");
		assert.equal(oIcon.getSrc(), sExpectedIcon);
		assert.equal(oIcon.getTooltip(), sExpectedTooltip);
		assert.equal(oIcon.getInitials(), "");
		assert.equal(oIcon.getDisplayShape(), "Circle");
		assert.equal(oIcon.getDisplaySize(), "XS");

		oItem.destroy();
	});

	QUnit.test("ariaLabelledBy for TimelineItem", function (assert) {
		var oLabel = new sap.m.Label({
			id: "testLabel",
			text: "TimelineItem ARIA-Label"
		});
		var oLabel2 = new sap.m.Label({
			id: "testLabel2",
			text: "TimelineItem ARIA-Label"
		});
		oLabel.placeAt("content");
		oLabel2.placeAt("content");
		var oItem = new TimelineItem({
			ariaLabelledBy: "testLabel"
		});
		oItem.placeAt("content");
		assert.equal(oItem.getAriaLabelledBy()[0], oLabel.sId, "ariaLabelledBy property is set for TimelineItem");
		oItem.addAriaLabelledBy(oLabel2);
		var labelSIds = [];
		labelSIds.push(oLabel.sId);
		labelSIds.push(oLabel2.sId);
		assert.equal(JSON.stringify(oItem.getAriaLabelledBy()), JSON.stringify(labelSIds), "Multiple associations added to TimelineItem");
		oItem.removeAllAriaLabelledBy();
		assert.equal(oItem.getAriaLabelledBy().length, 0, "All ariaLabelledBy associations are removed using removeAllAriaLabelledBy()");
		oItem.destroy();
		oLabel.destroy();
		oLabel2.destroy();
	});

	QUnit.test("Status property added to ariaDescribedBy for TimelineItem", async function (assert) {
		var oTimelineItem = new TimelineItem();
		oTimelineItem.placeAt("content");
		assert.equal(oTimelineItem.$().find("[aria-describedby]").length, 0, "Status of timeline item is added to aria-describedBy");

		oTimelineItem.setStatus("Warning");
		await nextUIUpdate();
		assert.ok(oTimelineItem.$().find("[aria-describedby]").length > 0, "Status of timeline item is added to aria-describedBy");
	});

	QUnit.test("setDateTime test with MilliSeconds", function (assert) {
		var oTimeLineItem = new TimelineItem();

		var sDateTime = "2020-01-01T15:29:04.";
		var sMilliSec = "";

		for (var i = 0; i <= 10; i++) {
			sMilliSec = sMilliSec + i;
			oTimeLineItem.setDateTime(sDateTime + sMilliSec + "Z");
			createAsserts_setDateTime(assert, sDateTime, oTimeLineItem, true);
		}

		sDateTime = "2021-08-17T13:47:16Z";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem, true);

		sDateTime = "11-11-2020 11:00:00";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = "Date(1371020400000)";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem, true);

		oTimeLineItem.destroy();
	});

	QUnit.test("setDateTime test.", function (assert) {
		var oTimeLineItem = new TimelineItem();

		var sDateTime = "2020-01-01T15:29:04";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem, true);

		sDateTime = "2020-01-01T15:29";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = "2020-01-01";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = "Date(1371020400000)";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem, true);

		sDateTime = "";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = null;
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = undefined;
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = "Apr 22, 2020, 11:12:46";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = "5/7/2021, 11:12:46 AM";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = UI5Date.getInstance("5/7/2021, 11:12:46 AM");
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem, true);
		oTimeLineItem.destroy();
	});

	/** we can test with any time zone as per FLP's timezone: { @lends Localization.getTimezone() }  */
	QUnit.test("setDateTime as per the FLP timezone.", function (assert) {
		var localTimeZone = Localization.getTimezone();
		Localization.setTimezone("Japan");
		var oTimeLineItem = new TimelineItem();

		var sDateTime = "2020-01-01T15:29:04";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem, true);

		sDateTime = "2020-01-01T15:29";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = "2020-01-01";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = "Date(1371020400000)";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem, true);

		sDateTime = "";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = null;
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = undefined;
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = "Apr 22, 2020, 11:12:46";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		sDateTime = "5/7/2021, 11:12:46 AM";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem);

		Localization.setTimezone(localTimeZone);
		oTimeLineItem.destroy();
	});

	QUnit.test("More & Less text renders in small size", async function (assert) {
		var sText = Array(800).join("a"),
			oItem = new TimelineItem({
				text: sText
			}),
			oTimeline = new Timeline({
				alignment: "Right",
				textHeight: "7",
				width: "100px",
				height: "150px",
				content: [oItem]
			}),
			$button;
		oItem._orientation = "H";
		oTimeline.placeAt("qunit-fixture");
		await nextUIUpdate();

		$button = oItem.$("fullTextBtn");
		assert.equal($button.parent().css("display"), "block", "Show more button should be visible.");
		oTimeline.destroy();
	});

	QUnit.test("More & Less text should not render in large size", async function (assert) {
		var sText = Array(500).join("a"),
			oItem = new TimelineItem({
				text: sText
			}),
			oTimeline = new Timeline({
				alignment: "Right",
				textHeight: "7",
				width: "1000px",
				height: "1000px",
				content: [oItem]
			}),
			$button;
		oItem._orientation = "H";
		oTimeline.placeAt("qunit-fixture");
		await nextUIUpdate();

		$button = oItem.$("fullTextBtn");
		assert.equal($button.parent().css("display"), "none", "Show more button should not be visible.");
		oTimeline.destroy();
	});

	QUnit.test("Aria-live should not be present on the TimelineItem level", async function (assert) {
		var sText = Array(500).join("a"),
			oItem = new TimelineItem({
				text: sText
			}),
			oTimeline = new Timeline({
				alignment: "Right",
				textHeight: "7",
				width: "1000px",
				height: "1000px",
				content: [oItem]
			});
		oTimeline.placeAt("qunit-fixture");
		await nextUIUpdate();
		assert.notOk(oItem.getDomRef("outline").getAttribute("aria-live"), "Aria-live has been removed on the item level");
		oTimeline.destroy();
	});

	//Function to create asserts for the SetDateTime Qunit
	function createAsserts_setDateTime(assert, sDateTime, oTimeLineItem, bIsDateFormat) {
		var bIsDate = true;
		var oPropertyDateTime = oTimeLineItem.getProperty("dateTime");
		var oGetDateTime = oTimeLineItem.getDateTime();
		var bIsStringOrDate = typeof (oPropertyDateTime) === "string" || oPropertyDateTime instanceof Date;
		sDateTime ? assert.ok(sDateTime, "Date is " + sDateTime) : assert.ok(true, "Date is not set");
		oPropertyDateTime ? assert.ok(bIsStringOrDate, "Date should be set correctly." + oPropertyDateTime) : assert.ok(true, "Date is not set.");
		bIsDate = oGetDateTime && oGetDateTime instanceof Date ? oGetDateTime.getTime() : false;
		bIsDate ? assert.ok(oGetDateTime instanceof Date, "Date should be parsed correctly and should be Date Object." + oGetDateTime) : assert.ok(true, "Date is not set.");
		if (oPropertyDateTime) {
			var sDateTimeRendererValue = oTimeLineItem.getRenderer()._getFormatedDateTime(oTimeLineItem);
			var oDateFormat = DateFormat.getDateInstance({ style: "short" });
			var oTimeFormat = DateFormat.getTimeInstance({ style: "short" });
			var oResourceBundle = CoreLib.getResourceBundleFor("sap.suite.ui.commons");
			var sFormattedDateTime = oDateFormat.format(oGetDateTime) + " " + oResourceBundle.getText("TIMELINE_AT") + " " + oTimeFormat.format(oGetDateTime);
			bIsDateFormat
				? assert.equal(sDateTimeRendererValue, sFormattedDateTime, "Date is formatted Correctly: " + sDateTimeRendererValue)
				: assert.equal(sDateTimeRendererValue, oPropertyDateTime, "Date is set Correctly: " + sDateTimeRendererValue);
		}
	}

	QUnit.module("TimelineTest", {
		beforeEach: async function () {
			var sUserName = "User Name",
				sText = "Implementing new Public Cloud ERP Financials system into his company and keeping it aligned with business.";
			this.oItem = new TimelineItem({
				userNameClickable: true,
				userName: sUserName,
				text: sText
			});

			this.oItem.placeAt("content");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.oItem.destroy();
		}
	});

	QUnit.test("keyboard handling - Enter and Space key for userNameLink event", function (assert) {
		var fnDone = assert.async(),
			iCallCount = 1;

		var oEvent = createSpaceEvent(this.oItem);
		oEvent.target = Element.getElementById(this.oItem.getId() + "-userNameLink").getDomRef();
		oEvent.setMarked = function () { };
		this.oItem.attachUserNameClicked(function (oevent) {
			assert.ok(true, "User name clicked event raised.");
			assert.ok(oevent.getParameter("uiElement") instanceof Control, "Returned uiElement is Control.");
			if (iCallCount == 2) {
				fnDone();
			} else {
				iCallCount++;
			}
		});

		oEvent.srcControl = Element.getElementById(this.oItem.getId() + "-userNameLink");
		Element.getElementById(this.oItem.getId() + "-userNameLink").onkeyup(oEvent);
		oEvent = createEnterEvent(this.oItem);
		oEvent.target = Element.getElementById(this.oItem.getId() + "-userNameLink").getDomRef();
		oEvent.setMarked = function () { };
		oEvent.srcControl = Element.getElementById(this.oItem.getId() + "-userNameLink");
		Element.getElementById(this.oItem.getId() + "-userNameLink").onsapenter(oEvent);
	});

	QUnit.test("Timeline item should have the role listitem", function (assert) {
		var sId = this.oItem.getId() + "-outline";
		var oFocusedDiv = document.getElementById(sId);
		assert.equal(oFocusedDiv.role,"listitem","Role has been set to listitem");
	});

	QUnit.module("Focus Test for different Themes", {
		beforeEach: function() {
			TestUtils.applyTheme();
		},
		afterEach: function(assert) {
			TestUtils.resetTheme(assert);
		},
		createTimeline: async function() {
			this.oItem = new TimelineItem({
				text: "This is TimelineItem"
			});
			this.oItem.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		applyAsserts: function(assert, oItem) {
			var oItemDomRef = oItem.getFocusDomRef();
			assert.equal(document.activeElement, oItemDomRef, "Focus is set correctly.");
		}
	});

	QUnit.test("Focus Test - sap_horizon", async function (assert) {
		var done = assert.async();
		await this.createTimeline();
		TestUtils.applyTheme("sap_horizon", async function() {
			this.oItem.getFocusDomRef().focus();
			await nextUIUpdate();
			this.applyAsserts(assert, this.oItem);
			done();
		}.bind(this));
	});

	QUnit.test("Focus Test - sap_fiori_3", async function (assert) {
		var done = assert.async();
		await this.createTimeline();
		TestUtils.applyTheme("sap_fiori_3", async function() {
			this.oItem.getFocusDomRef().focus();
			await nextUIUpdate();
			this.applyAsserts(assert, this.oItem);
			done();
		}.bind(this));
	});
});
