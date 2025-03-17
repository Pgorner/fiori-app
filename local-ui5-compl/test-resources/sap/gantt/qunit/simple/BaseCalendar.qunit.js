/*global QUnit */

sap.ui.define([
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/Calendar",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/ui/core/RenderManager"
], function(BaseCalendar, GanttChartWithTable, CalendarDefs, Calendar, utils, GanttRowSettings, BaseRectangle,
	RenderManager) {
	"use strict";

	QUnit.module("Create calendar shape.", {
		beforeEach: function () {
			this.oGantt = new GanttChartWithTable({
				calendarDef: new CalendarDefs({
				})
			});
			this.oCalendar = new BaseCalendar({
				calendarName : "PublicHoliday"
			});

			this.stub = window.sinon.stub(this.oCalendar, "getGanttChartBase");
			this.stub.returns(this.oGantt);
		},
		afterEach: function () {
			this.oCalendar = undefined;
			this.oGantt.destroy();
			this.stub.restore();
		}
	});

	QUnit.test("Verify RenderUtils is called to create base text title", function (assert) {
		var renderElementTitleSpy = window.sinon.spy(sap.gantt.simple.RenderUtils, "renderElementTitle");
		var oRm = new RenderManager();
		var sText = "Test Title";

		this.oCalendar.setTime(new Date());
		this.oCalendar.setTitle(sText);
		this.oCalendar.setCalendarName(null);
		this.oCalendar.renderElement(oRm, this.oCalendar);

		assert.ok(renderElementTitleSpy.calledWithMatch(oRm, this.oCalendar, window.sinon.match.func), "Called with render manager and element");

		var spyCall = renderElementTitleSpy.getCall(0);
		var fnTitleCreator = spyCall.args[2];

		assert.ok(fnTitleCreator({text: sText}).getText() === sText, "Called with title creator function");

		oRm.destroy();
		renderElementTitleSpy.restore();
	});

	QUnit.test("Test get<Property>() methods." , function (assert) {
		assert.strictEqual(this.oCalendar.getX(), 0);
		assert.strictEqual(this.oCalendar.getWidth(), this.oGantt.iGanttRenderedWidth);
		assert.strictEqual(this.oCalendar.getFill(), "url(#" + this.oGantt.sId + "_PublicHoliday)");
		var oStartDate = new Date(),
			oEndDate = new Date(oStartDate.getTime() + 10 * 24 * 60 * 60 * 1000);
		this.oCalendar.setTime(oStartDate);
		this.oCalendar.setEndTime(oEndDate);
		assert.strictEqual(this.oCalendar.getX(), 0);
		assert.strictEqual(this.oCalendar.getWidth(), this.oGantt.iGanttRenderedWidth);
		assert.strictEqual(this.oCalendar.getFill(), "url(#" + this.oGantt.sId + "_PublicHoliday)");
		this.oCalendar.setCalendarName();
		var oAxisTime = this.oGantt.getAxisTime();
		var oExpectedX1 = oAxisTime.timeToView(oStartDate),
			oExpectedX2 = oAxisTime.timeToView(oEndDate),
			oExpectedWidth = Math.abs(oExpectedX2 - oExpectedX1);
		assert.strictEqual(this.oCalendar.getX(), oExpectedX1);
		assert.strictEqual(this.oCalendar.getWidth(), oExpectedWidth);
		assert.strictEqual(this.oCalendar.getOpacity(), 1, "Default opacity is 1");
	});

	QUnit.test("Rendering", function (assert) {
		var oRm = new RenderManager();
		this.oCalendar.setProperty("opacity", 0.5);
		this.oCalendar.renderElement(oRm, this.oCalendar);
		oRm.flush(document.getElementById("qunit-fixture"));
		oRm.destroy();
		assert.strictEqual(document.getElementById("qunit-fixture").children[0].getAttribute("opacity"), "0.5", "base calendar opcacity is correct");
	});

	QUnit.module("Create calendar shape with Title.", {
		beforeEach: function () {
			this.oGantt = utils.createGanttWithODataModelForCalendar(new GanttRowSettings({
				rowId: "{data>ObjectID}",
				calendars: [
					new BaseCalendar({
						id: "NonWorkingTime",
						calendarName: "NonWorkingTime",
						title: "Non Working Time"
					}),
					new BaseCalendar({
						id: "DownTime",
						calendarName: "DownTime",
						title: "Down Time"
					})
				],
				shapes1: [
					new BaseRectangle({
						shapeId: "{data>ObjectID}",
						time: "{data>StartDate}",
						endTime: "{data>EndDate}",
						title: "{data>ObjectName}",
						fill: "#008FD3",
						selectable: true
					})
				]
			}));
		},
		afterEach: function () {
			this.oGantt.destroy();
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 1000);
		}
	});

	QUnit.test("Calender Title", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var calendars = this.oGantt.getTable().getRowSettingsTemplate().getCalendars();
			var textNodes = document.querySelectorAll(".calendarPattern")[0].querySelectorAll('text');
			assert.strictEqual(calendars.length, textNodes.length, "Two calendars with title creates two text nodes in each pattern.");
			assert.strictEqual(calendars[0].getHorizontalTextAlignment(), textNodes[0].getAttribute('text-anchor'), "horizontalTextAlignment property sets the text-anchor of text node.");
			assert.strictEqual(calendars[1].getHorizontalTextAlignment(), textNodes[1].getAttribute('text-anchor'), "horizontalTextAlignment property sets the text-anchor of text node.");
			assert.strictEqual(calendars[0].getTitle(), "Non Working Time");
			assert.strictEqual(calendars[1].getTitle(), "Down Time");
			assert.strictEqual(calendars[0].getVerticalTextAlignment(), "Center", "default value");
			var defaultYPos = textNodes[0].getAttribute('y');
			assert.strictEqual(textNodes[0].getAttribute('y'), defaultYPos, "Default yPos on center aligned.");

			//Act
			var calendarsInRow = this.oGantt.getTable().getRows()[0].getAggregation('_settings').getCalendars();
			calendarsInRow[0].setVerticalTextAlignment("Top");
			calendarsInRow[0].setHorizontalTextAlignment("Middle");
			return utils.waitForGanttRendered(this.oGantt).then(function () {
				this.delayedAssert(function () {
					//assert
					assert.ok(textNodes[0].getAttribute('y') < defaultYPos, "yPos decreases from default value when text is Top Aligned.");
					assert.strictEqual(textNodes[0].getAttribute('text-anchor'), "Middle", "text-achor property changed based on horizontalTextAlignment");
					//act
					calendarsInRow[0].setVerticalTextAlignment("Bottom");
					calendarsInRow[0].setHorizontalTextAlignment("End");
					return utils.waitForGanttRendered(this.oGantt).then(function () {
						this.delayedAssert(function () {
							//assert
							assert.ok(textNodes[0].getAttribute('y') > defaultYPos, "yPos increase from default value when text is Top Aligned.");
							assert.strictEqual(textNodes[0].getAttribute('text-anchor'), "End", "text-achor property changed based on horizontalTextAlignment");
							fnDone();

						});
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Calenders are created with IDs", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.oGantt.getTable().getRows().forEach(function(oRow) {
				var aCalendar = oRow.getAggregation("_settings").getCalendars();
				aCalendar.forEach(function(oCalendar) {
					assert.equal(oCalendar.getDomRef().id, oCalendar.getId(), "Calendars are rendered with ID");
				});
			});
			fnDone();
		}.bind(this));
	});
	QUnit.module("Row based calendar", {
		beforeEach: function () {
			this.oGantt = utils.createGanttWithOData(null, new GanttRowSettings({
				rowId: "1",
				calendars: [
					new BaseCalendar({
						shapeId:"shapeCalendar",
						time: new Date(1430000000000),
						endTime: new Date(1431000000000),
						fill:"#001AD3",
						tooltip :"Calendar's tooltip"
					})
				]
			}));
		},
		afterEach: function () {
			this.oGantt.destroy();
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 1000);
		}
	});
	QUnit.test("Tooltip for calender", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var calendars = this.oGantt.getTable().getRowSettingsTemplate().getCalendars();
			assert.strictEqual(calendars[0].getCalendarName(), undefined);
			assert.strictEqual(document.getElementsByClassName("sapGanttChartCalendar")[0].firstChild.firstChild.innerHTML, "Calendar's tooltip");
			assert.notEqual(document.getElementsByClassName("sapGanttChartCalendar")[0].firstChild.style.pointerEvents, "none");
		}.bind(this));
	});
});
