/*global QUnit */
sap.ui.define([
	"sap/gantt/simple/GanttHeader",
	"sap/gantt/simple/RenderUtils",
	"./GanttQUnitUtils",
	"sap/gantt/misc/Format",
	"sap/m/Panel",
	"sap/m/Button",
	"sap/gantt/simple/DeltaLine",
	"sap/gantt/simple/AdhocLine",
	"sap/ui/core/Element",
	"sap/ui/core/Theming",
	"sap/ui/core/RenderManager"
], function (GanttHeader, RenderUtils, GanttQUnitUtils, Format, Panel, Button, DeltaLine, AdhocLine, Element,
	Theming,
	RenderManager) {
	"use strict";

	QUnit.module("Basic", {
		beforeEach: function () {
			this.ganttHeader = new GanttHeader();
		},
		afterEach: function () {
			this.ganttHeader.destroy();
			this.ganttHeader = undefined;
		}
	});

	QUnit.test("Test default configuration values." , function (assert) {
		assert.strictEqual(this.ganttHeader.iHeaderMinheight, undefined);
        assert.strictEqual(this.ganttHeader._getIHeaderHeight(), 0, "default height");
	});
	QUnit.test("Test header text color in gantt according to theme change." , function (assert) {
		this.gantt = GanttQUnitUtils.createGantt();
		this.gantt.placeAt("qunit-fixture");
		Theming.setTheme("sap_horizon");
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var oHeaderText = document.querySelector('.sapGanttTimeHeaderSvgText');
			var style = getComputedStyle(oHeaderText);
			var hex = sap.ui.core.theming.Parameters.get("sapUiContentMarkerTextColor");
			var red = parseInt(hex[1] + hex[2],16);
			var green = parseInt(hex[3] + hex[4],16);
			var blue = parseInt(hex[5] + hex[6],16);
			assert.equal("rgb(" + red + ", " + green + ", " + blue + ")", style.fill);
			Theming.setTheme("sap_horizon_dark");
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var oHeaderText = document.querySelector('.sapGanttTimeHeaderSvgText');
				var style = getComputedStyle(oHeaderText);
				var hex = sap.ui.core.theming.Parameters.get("sapUiContentMarkerTextColor");
				var red = parseInt(hex[1] + hex[2],16);
				var green = parseInt(hex[3] + hex[4],16);
				var blue = parseInt(hex[5] + hex[6],16);
				assert.equal("rgb(" + red + ", " + green + ", " + blue + ")", style.fill);
				Theming.setTheme("sap_fiori_3_dark");
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					var oHeaderText = document.querySelector('.sapGanttTimeHeaderSvgText');
					var style = getComputedStyle(oHeaderText);
					var hex = sap.ui.core.theming.Parameters.get("sapUiContentMarkerTextColor");
					var red = parseInt(hex[1] + hex[2],16);
					var green = parseInt(hex[3] + hex[4],16);
					var blue = parseInt(hex[5] + hex[6],16);
					assert.equal("rgb(" + red + ", " + green + ", " + blue + ")", style.fill);
					this.gantt.destroy();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Test chart width and header width", function(assert) {
		this.gantt = GanttQUnitUtils.createGantt();
		this.gantt.placeAt("qunit-fixture");

		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var domRef = this.gantt.getDomRef();
			var ganttHeaderSvgWidth = Math.round(domRef.querySelector('.sapGanttChartHeaderSvg').getBoundingClientRect().width);
			var ganttChartSvgWidth = Math.round(domRef.querySelector('.sapGanttChartSvg').getBoundingClientRect().width);
			assert.equal(ganttChartSvgWidth, ganttHeaderSvgWidth, "Chart width and header width should be same");
			this.gantt.destroy();
		}.bind(this));
	}.bind(this));

	QUnit.test("Test gantt header large interval labels", function(assert) {
		this.gantt = GanttQUnitUtils.createGantt();
		this.gantt.getAxisTimeStrategy().getTotalHorizon().setStartTime("20200524122440");
		this.gantt.getAxisTimeStrategy().getTotalHorizon().setEndTime("20220524122440");
		this.gantt.getAxisTimeStrategy().getVisibleHorizon().setStartTime("20210312121318");
		this.gantt.getAxisTimeStrategy().getVisibleHorizon().setEndTime("20210512121318");
		var sWidth = "1500px";
		document.getElementById("qunit-fixture").style.width = sWidth;
		var oPanel = new Panel({
			width: sWidth,
			content: [this.gantt]
		});
		oPanel.placeAt("qunit-fixture");

		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var oGantt = this.gantt;
			var oAxisTime = oGantt.getAxisTime();
			var oAxisTimeStrategy = oGantt.getAxisTimeStrategy();
			assert.equal(oAxisTime.largeIntervalLabel, true, "Large interval label present on top of first visible small interval tick");
			var iHeaderWidth = RenderUtils.getGanttRenderWidth(oGantt);
			var oTimelineOption   = oAxisTimeStrategy.getTimeLineOption();

			var aTicks = oAxisTime.getTickTimeIntervalLabel(oTimelineOption, null, [0, iHeaderWidth]);
			var aSmallIntervalTicks = aTicks[1];
			var aLargeIntervalTicks = aTicks[0];
			var startTime = oGantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime();
			var iFirstIndex = oAxisTime.getFirstSmallIntervalIndex(aSmallIntervalTicks, startTime);
			var sFirstIntervalLabel = aSmallIntervalTicks[iFirstIndex].largeLabel;
			var iFirstTickPosition = aSmallIntervalTicks[iFirstIndex].value;

			for (var i = 0; i < aLargeIntervalTicks.length; i++) {
				if (aLargeIntervalTicks[i].label === sFirstIntervalLabel) {
					assert.equal(aLargeIntervalTicks[i].value, iFirstTickPosition, "Large interval label placed at correct position");
					break;
				}
			}
			oAxisTimeStrategy.getVisibleHorizon().setStartTime("20210326121318");
			oAxisTimeStrategy.getVisibleHorizon().setEndTime("20210523121318");
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				assert.equal(this.gantt.getAxisTime().largeIntervalLabel, false, "No large interval label on first visible small interval tick due to overlap");

				oAxisTimeStrategy.getVisibleHorizon().setStartTime("20210409121318");
				oAxisTimeStrategy.getVisibleHorizon().setEndTime("20210606121318");
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					assert.equal(this.gantt.getAxisTime().largeIntervalLabel, true, "Large interval label present on top of first visible small interval tick");
					this.gantt.destroy();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	}.bind(this));

	QUnit.test("Test content within the overflow toolbar", function (assert) {
		var oGantt = {
			getId: function(){
				return "gantt1";
			},
			getOverflowToolbarItems: function() {
				return [
					new sap.m.Button("button1").addStyleClass("sapGanttChartOverflowToolbarItems"),
					new sap.m.Button("button2").addStyleClass("sapGanttChartOverflowToolbarItems")
				];
			}
		};
		var oRm = new RenderManager();
		new sap.gantt.simple.GanttHeader().renderOverflowToolbar(oRm, oGantt);
		var oOverflowToolbar = Element.getElementById(oGantt.getId() + "-ganttHeaderOverflowToolbar");
		assert.equal(!!oOverflowToolbar, true, "Overflow toolbar exists");
		var i = 0;
		oOverflowToolbar.getContent().forEach(function(item) {
			item["aCustomStyleClasses"].forEach(function(sClassName) {
				if (sClassName === "sapGanttChartOverflowToolbarItems") {
					i++;
				}
			});
		});
		assert.equal(!!oOverflowToolbar.getContent(), true, "Overflow toolbar contains content");
		assert.equal(i, 2, "Overflow toolbar items are added as the content");
		oRm.destroy();
	});
	QUnit.module("Test property update for overflowtoolbar items", {
		beforeEach: function() {
			this.oGantt = GanttQUnitUtils.createGantt(true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Visibility update for button in overflow toolbar", function (assert) {
		var oGantt = this.oGantt;
		oGantt.setEnableChartOverflowToolbar(true);
		oGantt.placeAt("qunit-fixture");
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.addAggregation("overflowToolbarItems",
				new Button({
					id: "button",
					type: "Transparent",
					text: "Press",
					visible: true
				})
			);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				var oGanttDom = oGantt.getDomRef();
				setTimeout(function(){
					assert.notEqual(oGanttDom.querySelector('[id="button"]'), null, "Button is visible");
					Element.getElementById("button").setVisible(false);
					setTimeout(function(){
						assert.strictEqual(oGanttDom.querySelector('[id="button"]'), null, "Button is not visible");
						fnDone();
					}, 100);
				}, 100);
			});
		});
	});

	QUnit.module("Deltalines and Adhoclines overlap", {
		beforeEach: function () {
			this.oGantt = GanttQUnitUtils.createSimpleGantt(null,"20180101000000","20180120000000");
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oGantt.destroy();
			this.oGantt = undefined;
		}
	});

	QUnit.test("Test deltaLines and adhocLines overlap in gantt header", function (assert) {
		var oGantt = this.oGantt;
		var oDeltaLine1 = new DeltaLine({
			stroke: "red",
			timeStamp: "20180109000000",
			endTimeStamp: "20180115000000"
		});
		var oDeltaLine2 = new DeltaLine({
			stroke: "blue",
			timeStamp: "20180111000000",
			endTimeStamp: "20180117000000"
		});
		var oAdhocLine1 = new AdhocLine({
			markerType: "Diamond",
			stroke: "green",
			timeStamp: "20180107000000"
		});
		var oAdhocLine2 = new AdhocLine({
			markerType: "Diamond",
			stroke: "red",
			timeStamp: "20180107000000"
		});
		var oAdhocLine3 = new AdhocLine({
			markerType: "Diamond",
			stroke: "blue",
			timeStamp: "20180116000000"
		});
		oGantt.addAggregation("deltaLines", oDeltaLine1);
		oGantt.addAggregation("deltaLines", oDeltaLine2);
		oGantt.addAggregation("simpleAdhocLines", oAdhocLine1);
		oGantt.addAggregation("simpleAdhocLines", oAdhocLine2);
		oGantt.addAggregation("simpleAdhocLines", oAdhocLine3);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAdhocLines = oGantt.getSimpleAdhocLines();
			var aDeltaLines = oGantt.getDeltaLines();
			assert.equal(aAdhocLines[0]._getLevel(), 1, "Correct _level set for adhocLine");
			assert.equal(aAdhocLines[1]._getLevel(), 2, "Correct _level set for adhocLine");
			assert.equal(aAdhocLines[2]._getLevel(), 1, "Correct _level set for adhocLine");
			assert.equal(aDeltaLines[0]._getLevel(), 1, "Correct _level set for deltaLine");
			assert.equal(aDeltaLines[1]._getLevel(), 2, "Correct _level set for deltaLine");
		});
	});
});
