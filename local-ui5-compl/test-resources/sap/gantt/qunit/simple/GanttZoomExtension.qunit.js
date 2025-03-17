/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/GanttZoomExtension",
	"sap/gantt/simple/BaseRectangle",
	"sap/ui/core/ComponentContainer",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils"
], function (GanttZoomExtension, BaseRectangle, ComponentContainer, GanttRowSettings, qutils, utils) {
	"use strict";

	var fnCreateShapeBindingSettings = function() {
		return new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					draggable: true,
					selectable: true,
					resizable: true
				})
			]
		});
	};

	QUnit.module("Functions - GanttDragDropExtension", {
		beforeEach: function(assert){
			this.oGanttChart = utils.createGantt(true, fnCreateShapeBindingSettings());
			window.oGanttChart.placeAt("qunit-fixture");
		},
		afterEach: function(assert) {
			utils.destroyGantt();
		},
		fnGetFakedEvent : function () {
			return {
				originalEvent: {
					shiftKey: false,
					ctrlKey: false,
					detail: 100,
					deltaX: 200,
					deltaY: 300,
					pageX: 450
				},
				preventDefault: function () { },
				stopPropagation: function () { }
			};
		}
	});


	QUnit.test("Test GanttZoomExtension --  decideMouseWheelZoom", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oZoomExtension = this.oGanttChart._getZoomExtension();
			var onMouseWheelZoomingStub =  sinon.stub(oZoomExtension, "onMouseWheelZooming");

			var oEvent = this.fnGetFakedEvent();
			oZoomExtension.decideMouseWheelZoom(oEvent, -100);
			assert.equal(onMouseWheelZoomingStub.called, true, "Decide MouseWheelZoom is triggered.");
			assert.equal(oZoomExtension.iMouseWheelZoomDelayedCallId, undefined, "GanttZoomExtension.decideMouseWheelZoom successfully excuted without time out.");

			oZoomExtension.iLastMouseWheelZoomTimeInMs = Date.now();
			oZoomExtension.decideMouseWheelZoom(oEvent, -100);
			assert.ok(oZoomExtension.iMouseWheelZoomDelayedCallId !== undefined, "GanttZoomExtension.decideMouseWheelZoom successfully excuted in a time out.");

			oZoomExtension.iLastMouseWheelZoomTimeInMs = Date.now();
			oZoomExtension.decideMouseWheelZoom(oEvent, -100);
			assert.ok(oZoomExtension.iMouseWheelZoomDelayedCallId !== undefined, "GanttZoomExtension.decideMouseWheelZoom successfully excuted in a time out.");

			oZoomExtension.iLastMouseWheelZoomTimeInMs = Date.now();
			oZoomExtension.decideMouseWheelZoom(oEvent, -100);
			assert.ok(oZoomExtension.iMouseWheelZoomDelayedCallId !== undefined, "GanttZoomExtension.decideMouseWheelZoom successfully excuted in a time out.");
		}.bind(this));
	});

	QUnit.module("Bird eye range", {
		beforeEach: function () {
			this.oComponentContainer = new ComponentContainer({
				height: "300px", // limit height so we can have a scroll bar
				name: "sap.gantt.simple.test.GanttChart2OData",
				settings: {
					id: "sap.gantt.sample.GanttChart2OData"
				},
				async: true
			});
			return new Promise(function (fnResolve) {
				this.oComponentContainer.attachComponentCreated(function () {
					this.oComponentContainer.getComponentInstance().getRootControl().loaded().then(function (oView) {
						this.oGanttChart = oView.byId("gantt1");
						utils.waitForGanttRendered(this.oGanttChart).then(fnResolve);
					}.bind(this));
				}.bind(this));
				this.oComponentContainer.placeAt("qunit-fixture");
			}.bind(this));
		},
		afterEach: function () {
			this.oComponentContainer.destroy();
		}
	});

	QUnit.test("Test Bird eye range of last row", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			document.querySelector(".sapUiTableVSbExternal").scrollTop = 1000;
			var oZoomExtension = this.oGanttChart._getZoomExtension();
			var iRowCount = this.oGanttChart.getTable().getRows().length;
			var aRows = this.oGanttChart.getTable().getRows();
			var oRowSettings = aRows[aRows.length - 1].getAggregation("_settings");
			var aShapesInRow = [];
			aShapesInRow = oZoomExtension._getShapeInRow(oRowSettings, aShapesInRow);
			aShapesInRow[2].setCountInBirdEye(true);
			var oBirdEyeRange = oZoomExtension.calculateBirdEyeRange(iRowCount - 1);
			assert.notEqual(oBirdEyeRange.startTime, undefined, "BirdEye Range StartDate has been set.");
			assert.notEqual(oBirdEyeRange.endTime, undefined, "BirdEye Range EndDate has been set.");
		}.bind(this));
	});

	QUnit.test("Test Bird eye range of first row", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oZoomExtension = this.oGanttChart._getZoomExtension();
			var aRows = this.oGanttChart.getTable().getRows();
			var oRowSettings = aRows[0].getAggregation("_settings");
			var aShapesInRow = [];
			aShapesInRow = oZoomExtension._getShapeInRow(oRowSettings, aShapesInRow);
			aShapesInRow[2].setCountInBirdEye(true);
			var oBirdEyeRange = oZoomExtension.calculateBirdEyeRange(0);
			assert.notEqual(oBirdEyeRange.startTime, undefined, "BirdEye Range StartDate has been set.");
			assert.notEqual(oBirdEyeRange.endTime, undefined, "BirdEye Range EndDate has been set.");
		}.bind(this));
	});

	QUnit.test("Test Bird eye range when not triggered by button press", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oAxisTime = this.oGanttChart.getAxisTime(), oZoomExtension = this.oGanttChart._getZoomExtension();
			var oRowSettings = this.oGanttChart.getTable().getRows()[0].getAggregation("_settings"), aShapesInRow = [];
			aShapesInRow = oZoomExtension._getShapeInRow(oRowSettings, aShapesInRow);
			var oShape = aShapesInRow[2];
			oShape.setCountInBirdEye(true);
			var oBirdEyeRange = oZoomExtension.calculateBirdEyeRange();
			var oShapeStartTime = oShape.getTime(), oShapeEndTime = oShape.getEndTime();
			var iTimeRangePerPixel = (oShapeEndTime - oShapeStartTime) / this.oGanttChart.getVisibleWidth();
			assert.strictEqual(Math.floor(oBirdEyeRange.startTime.getTime()), Math.floor(oAxisTime.viewToTime(oAxisTime.timeToView(oShapeStartTime) - 5).getTime()), "Correct bird eye range start time");
			assert.strictEqual(Math.floor(oBirdEyeRange.endTime.getTime()), Math.floor(oAxisTime.viewToTime(oAxisTime.timeToView(oShapeEndTime) + 5).getTime()), "Correct bird eye range end time");
			oBirdEyeRange = oZoomExtension.calculateBirdEyeRange(null, true);
			assert.strictEqual(Math.floor(oBirdEyeRange.startTime.getTime()), Math.floor(oShapeStartTime.getTime() - (iTimeRangePerPixel * 5)), "Correct bird eye range start time");
			assert.strictEqual(Math.floor(oBirdEyeRange.endTime.getTime()), Math.floor(oShapeEndTime.getTime() + (iTimeRangePerPixel * 5)), "Correct bird eye range end time");
		}.bind(this));
	});
});
