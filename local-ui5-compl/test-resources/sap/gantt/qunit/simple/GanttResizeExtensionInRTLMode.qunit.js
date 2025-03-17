/*global QUnit sinon*/
sap.ui.define([
	"sap/ui/events/KeyCodes",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function (KeyCodes, qutils, BaseRectangle, GanttRowSettings, utils, GanttChartConfigurationUtils) {
	"use strict";

	QUnit.module("Interaction - Shape selection and resizing in RTL", {
		beforeEach: function () {
			GanttChartConfigurationUtils.setRTL(true);
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						resizable: true
					})
				]
			}));
		},
		afterEach: function () {
			utils.destroyGantt();
			GanttChartConfigurationUtils.setRTL(false);
		},
		getFirstShape: function () {
			return this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
		},
		getSecondShape: function () {
			return this.oGantt.getTable().getRows()[1].getAggregation("_settings").getShapes1()[0];
		},
		getThirdShape: function () {
			return this.oGantt.getTable().getRows()[2].getAggregation("_settings").getShapes1()[0];
		},
		createEventParam: function(x, y) {
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.pageX = x;
			oEventParams.clientX = x;
			oEventParams.pageY = y;
			oEventParams.clientY = y;
			return oEventParams;
		},
		mousedown: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousedown", oShape, oEventParams);
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousemove", oShape, oEventParams);
		},
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		}
	});
	QUnit.test("Interaction - Resize shape in RTL mode", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRectFirstShape = this.getFirstShape();
			var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();
			var oRectSecondShape = this.getSecondShape();
			var sRectSecondShapeElementId = oRectSecondShape.getShapeUid();
			var oRectThirdShape = this.getThirdShape();
			var sRectThirdShapeElementId = oRectThirdShape.getShapeUid();
			var oEndResizingSpy = sinon.spy(oResizeOutline, "_fireShapeResizeEvent");
			var $Svg = jQuery(document.getElementById(this.oGantt.getId() + "-svg"));

			this.oGantt.attachEvent("shapeResize", function (oEvent) {
				var aOldTimes = oEvent.getParameter("oldTime");
				var aNewTimes = oEvent.getParameter("newTime");
				assert.ok(
					(aOldTimes[0].getTime() === aNewTimes[0].getTime()) || (aOldTimes[1].getTime() === aNewTimes[1].getTime()),
					"Time for the non-dragged side should not change in shapeResize event's parameters."
				);
				assert.ok(
					(aOldTimes[0].getTime() !== aNewTimes[0].getTime()) || (aOldTimes[1].getTime() !== aNewTimes[1].getTime()),
					"Time for the dragged side should change in shapeResize event's parameters."
				);
			});

			//Act
			oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRectFirstShape);
			var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
			var oPositionTriggerRightX = $LineTriggerRight.position().left;
			var oPositionTriggerRightY = $LineTriggerRight.position().top;

			this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
			//qutils.triggerEvent("mousedown", $LineTriggerRight);

			this.mousemove($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);
			//qutils.triggerMouseEvent($Svg, "mousemove", 0, 0, oPositionTriggerRightX, 10, 0);

			//Assert
			assert.ok(oResizeOutline.isResizing(), "Right Resizing");

			//Act
			this.mouseup($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);
			//qutils.triggerMouseEvent($Svg, "mouseup", 0, 0, oPositionTriggerRightX - 2, 10, 0);

			//Assert
			assert.ok(oEndResizingSpy.called, "Right Resizing End");

			//Act
			oRectSecondShape.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRectSecondShape);
			oSelectionDom = document.getElementById(sRectSecondShapeElementId + "-selected");
			$ShapeSelectionRoot = jQuery(oSelectionDom);
			var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
			var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
			var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

			this.mousedown($LineTriggerLeft, oPositionTriggerLeftX, oPositionTriggerLeftY);
			//qutils.triggerEvent("mousedown", $LineTriggerLeft);

			this.mousemove($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);
				//qutils.triggerMouseEvent($Svg, "mousemove", oPositionTriggerLeftX - 2, 10, 0, 0, 0);

				//Assert
			assert.ok(oResizeOutline.isResizing(), "Left Resizing");

			this.mouseup($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);
				//qutils.triggerMouseEvent($Svg, "mouseup", oPositionTriggerLeftX - 2, 10, 0, 0, 0);

				//Assert
			assert.ok(oEndResizingSpy.called, "Left Resizing End");

			oRectThirdShape.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRectThirdShape);
			oSelectionDom = document.getElementById(sRectThirdShapeElementId + "-selected");
			$ShapeSelectionRoot = jQuery(oSelectionDom);
			$LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
			oPositionTriggerRightX = $LineTriggerRight.position().left;
			oPositionTriggerRightY = $LineTriggerRight.position().top;

			this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
			// /qutils.triggerEvent("mousedown", $LineTriggerRight);
			this.mousemove($LineTriggerRight, oPositionTriggerRightX + 10, oPositionTriggerRightY);
			//qutils.triggerMouseEvent($Svg, "mousemove", oPositionTriggerRightX - 2, 10, 0, 0, 0);

			//Assert
			assert.ok(oResizeOutline.isResizing(), "Right Resizing");

			//Act
			qutils.triggerKeydown($Svg, KeyCodes.ESCAPE);

			//Assert
			assert.strictEqual(oResizeOutline.isResizing(), false, "Resizing cancelled");

			//Clean-up
			this.mouseup($LineTriggerRight, oPositionTriggerLeftX + 10, oPositionTriggerRightY);
			//qutils.triggerMouseEvent($Svg, "mouseup", 0, 0, oPositionTriggerRightX - 2, 0, 0);

			done();
		}.bind(this));
	});

	QUnit.test("Check resize Outline for xBias/yBias - RTL Mode", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRectFirstShape = this.getFirstShape();
			var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();

			//Act
			oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRectFirstShape);
			var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
			var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
			var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

			var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
			var oPositionTriggerRightX = $LineTriggerRight.position().left;
			var oPositionTriggerRightY = $LineTriggerRight.position().top;

			oRectFirstShape.setYBias(-5);
			oRectFirstShape.setXBias(10);
			return utils.waitForGanttRendered(this.oGantt).then(function () {
				var oResizeOutline = this.oGantt._getResizeExtension();
				var oRectFirstShape = this.getFirstShape();
				var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();
				oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectFirstShape);
				var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
				var oNewPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oNewPositionTriggerLeftY = $LineTriggerLeft.position().top;

				var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				var oNewPositionTriggerRightX = $LineTriggerRight.position().left;
				var oNewPositionTriggerRightY = $LineTriggerRight.position().top;

				assert.equal(oPositionTriggerLeftX - oNewPositionTriggerLeftX, 10, "LeftTriggers x coordinate are places correctly");
				assert.equal(oPositionTriggerLeftY - oNewPositionTriggerLeftY, 5, "LeftTriggers y coordinate are places correctly");

				assert.equal(oPositionTriggerRightX - oNewPositionTriggerRightX, 10, "RightTriggers x coordinate are places correctly");
				assert.equal(oPositionTriggerRightY - oNewPositionTriggerRightY, 5, "RightTriggers y coordinate are places correctly");
				done();
			}.bind(this));
		}.bind(this));
	});
});
