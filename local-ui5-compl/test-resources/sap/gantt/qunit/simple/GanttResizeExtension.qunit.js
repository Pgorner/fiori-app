/*global QUnit sinon*/
sap.ui.define([
	"sap/ui/events/KeyCodes",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/BaseConditionalShape",
	"sap/ui/core/theming/Parameters",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseText",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Theming"
], function (KeyCodes, qutils, BaseRectangle, GanttRowSettings, utils, BaseConditionalShape, Parameters,BaseGroup,BaseText, GanttChartConfigurationUtils,
	Theming) {
	"use strict";

	QUnit.module("Interaction - Shape selection and resizing", {
		beforeEach: function () {
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
		getFourthShape: function () {
			return this.oGantt.getTable().getRows()[3].getAggregation("_settings").getShapes1()[0];
		},
		createEventParam: function(x, y, button) {
			var oEventParams = {};
			oEventParams.button = button ? button : 0;
			oEventParams.pageX = x;
			oEventParams.clientX = x;
			oEventParams.pageY = y;
			oEventParams.clientY = y;
			return oEventParams;
		},
		mousedown: function(oShape, x, y, button) {
			var oEventParams = this.createEventParam(x, y, button);
			qutils.triggerEvent("mousedown", oShape, oEventParams);
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousemove", oShape, oEventParams);
		},
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		},
		colorAsserts: function (assert, oDomElement, attributeType, attributeValue) {
			assert.ok(oDomElement.getAttribute(attributeType).includes(attributeValue), attributeType + " color is correct : " + attributeValue);
		}
	});

	QUnit.test("Interaction - Resizable outline rendering", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			this.oGantt.setShapeSelectionSettings({
				color: "red",
				strokeWidth: 4,
				shapeColor: "green",
				fillOpacity: 0.5,
				strokeDasharray: "1,0"
			});
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRect = this.getFirstShape();
			assert.strictEqual(document.getElementById(oRect.sId).style.fill, "rgb(0, 143, 211)", "Shape Color before setting");
			assert.strictEqual(document.getElementById(oRect.sId).style.fillOpacity, "1", "Fill Opacity before setting");
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			var $BorderTop = $ShapeSelectionRoot.find(".border.topLine");
			var $BorderRight = $ShapeSelectionRoot.find(".border.rightLine");
			var $BorderBottom = $ShapeSelectionRoot.find(".border.bottomLine");
			var $BorderLeft = $ShapeSelectionRoot.find(".border.leftLine");
			var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
			var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
			var $RectTriggerLeft = $ShapeSelectionRoot.find(".rectTrigger.leftTrigger");
			var $RectTriggerRight = $ShapeSelectionRoot.find(".rectTrigger.rightTrigger");
			var $ResizeCover = $ShapeSelectionRoot.find(".resizeCover");
			//Assert
			assert.strictEqual($ShapeSelectionRoot.length, 1, "Shape selection root node is rendered");
			assert.strictEqual($BorderTop.length, 1, "Top outline is rendered");
			assert.strictEqual($BorderRight.length, 1, "Right outline is rendered");
			assert.strictEqual($BorderBottom.length, 1, "Bottom outline is rendered");
			assert.strictEqual($BorderLeft.length, 1, "Left outline is rendered");
			assert.strictEqual($LineTriggerLeft.length, 1, "Left line trigger is rendered");
			assert.strictEqual($LineTriggerRight.length, 1, "Right line trigger is rendered");
			assert.strictEqual($RectTriggerLeft.length, 0, "Left Rect trigger is rendered");
			assert.strictEqual($RectTriggerRight.length, 0, "Right Rect trigger is rendered");
			assert.strictEqual($ResizeCover.length, 1, "Resize cover is rendered");
			assert.strictEqual(oResizeOutline.getSelectionSettings().shapeColor, "green", "Shape Color after setting");
			assert.strictEqual(oResizeOutline.getSelectionSettings().fillOpacity, 0.5, "Fill Opacity after setting");
		}.bind(this));
	});

	QUnit.test("Interaction - Trigger cursor style", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
			var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
			qutils.triggerEvent("mouseover", $LineTriggerLeft);
			//Assert
			assert.strictEqual($LineTriggerRight.css("cursor"), "ew-resize", "Mouse cursor style of left resize trigger");
			//Act
			qutils.triggerEvent("mouseover", $LineTriggerRight);
			//Assert
			assert.strictEqual($LineTriggerRight.css("cursor"), "ew-resize", "Mouse cursor style of left resize trigger");
		}.bind(this));
	});

	QUnit.test("Interaction - Resize shape", function (assert) {
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
			var oRectFourthShape = this.getFourthShape();
			var sRectFourthShapeElementId = oRectFourthShape.getShapeUid();
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
			this.mousemove($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

			//Assert
			assert.ok(oResizeOutline.isResizing(), "Right Resizing");

			//Act
			this.mouseup($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

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
			this.mousemove($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);

			//Assert
			assert.ok(oResizeOutline.isResizing(), "Left Resizing");

			this.mouseup($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);

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
			this.mousemove($LineTriggerRight, oPositionTriggerRightX + 10, oPositionTriggerRightY);

			//Assert
			assert.ok(oResizeOutline.isResizing(), "Right Resizing");

			//Act
			qutils.triggerKeydown($Svg, KeyCodes.ESCAPE);

			//Assert
			assert.strictEqual(oResizeOutline.isResizing(), false, "Resizing cancelled");

			//Clean-up
			this.mouseup($LineTriggerRight, oPositionTriggerLeftX + 10, oPositionTriggerRightY);

			oRectFourthShape.setSelected(true, true);
			oResizeOutline.toggleOutline(oRectFourthShape);
			oSelectionDom = document.getElementById(sRectFourthShapeElementId + "-selected");
			var oLineTriggerRight = oSelectionDom.querySelector(".lineTrigger.rightTrigger");
			oPositionTriggerRightX = oLineTriggerRight.getBBox().x;
			oPositionTriggerRightY = oLineTriggerRight.getBBox().y;
			this.mousedown(oLineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY, 2);
			this.mousemove(oLineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);
			assert.strictEqual(oResizeOutline.isResizing(), false, "No resizing when triggered by right mouse button");
			this.mouseup(oLineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

			done();
		}.bind(this));
	});

	QUnit.test("Test property ShapeSelectionSetting - Implicit Colors", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var sImplicitColor = "red",
				sImplicitShapeColor = "green";
			this.oGantt.setShapeSelectionSettings({
				color: sImplicitColor,
				strokeWidth: 4,
				shapeColor: sImplicitShapeColor,
				fillOpacity: 0.5,
				strokeDasharray: "1,0"
			});
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRectFirstShape = this.getFirstShape();
			var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();

			oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRectFirstShape);

			var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			var resizeCover = oSelectionDom.querySelector(".resizeCover");

			//Assert
			this.colorAsserts(assert, borderTop, "stroke", sImplicitColor);
			this.colorAsserts(assert, borderRight, "stroke", sImplicitColor);
			this.colorAsserts(assert, borderBottom, "stroke", sImplicitColor);
			this.colorAsserts(assert, borderLeft, "stroke", sImplicitColor);
			this.colorAsserts(assert, borderTop, "fill", sImplicitShapeColor);
			this.colorAsserts(assert, borderRight, "fill", sImplicitShapeColor);
			this.colorAsserts(assert, borderBottom, "fill", sImplicitShapeColor);
			this.colorAsserts(assert, borderLeft, "fill", sImplicitShapeColor);
			this.colorAsserts(assert, resizeCover, "fill", sImplicitShapeColor);
			done();
		}.bind(this));
	});

	QUnit.test("Test property ShapeSelectionSetting - Hexa Colors", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var	sHexaColor = "#d5dadc",
				sHexaShapeColor = "#74abe2";
			this.oGantt.setShapeSelectionSettings({
				color: sHexaColor,
				strokeWidth: 4,
				shapeColor: sHexaShapeColor,
				fillOpacity: 0.5,
				strokeDasharray: "1,0"
			});
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRectFirstShape = this.getFirstShape();
			var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();

			oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRectFirstShape);

			var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			var resizeCover = oSelectionDom.querySelector(".resizeCover");

			//Assert
			this.colorAsserts(assert, borderTop, "stroke", sHexaColor);
			this.colorAsserts(assert, borderRight, "stroke", sHexaColor);
			this.colorAsserts(assert, borderBottom, "stroke", sHexaColor);
			this.colorAsserts(assert, borderLeft, "stroke", sHexaColor);
			this.colorAsserts(assert, borderTop, "fill", sHexaShapeColor);
			this.colorAsserts(assert, borderRight, "fill", sHexaShapeColor);
			this.colorAsserts(assert, borderBottom, "fill", sHexaShapeColor);
			this.colorAsserts(assert, borderLeft, "fill", sHexaShapeColor);
			this.colorAsserts(assert, resizeCover, "fill", sHexaShapeColor);
			done();
		}.bind(this));
	});


	QUnit.test("Check resize Outline for xBias/yBias", function (assert) {
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

				assert.equal(oNewPositionTriggerLeftX - oPositionTriggerLeftX, 10, "LeftTriggers x coordinate are places correctly");
				assert.equal(oNewPositionTriggerLeftY - oPositionTriggerLeftY, -5, "LeftTriggers y coordinate are places correctly");

				assert.equal(oNewPositionTriggerRightX - oPositionTriggerRightX, 10, "RightTriggers x coordinate are places correctly");
				assert.equal(oNewPositionTriggerRightY - oPositionTriggerRightY, -5, "RightTriggers y coordinate are places correctly");

				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Interaction - Resize shape on hover", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			var oEndResizingSpy = sinon.spy(oResizeOutline, "_fireShapeResizeEvent");
			var $Svg = jQuery(document.getElementById(this.oGantt.getId() + "-svg"));

			this.oGantt.attachEventOnce("shapeResize", function (oEvent) {
				var aOldTimes = oEvent.getParameter("oldTime");
				var aNewTimes = oEvent.getParameter("newTime");
				assert.ok(
					(aOldTimes[0].getTime() === aNewTimes[0].getTime()) || (aOldTimes[1].getTime() === aNewTimes[1].getTime()),
					"Time for the non-dragged side should not change in shapeResize event's parameters."
				);
			});

			//Act
			oResizeOutline.addResizerOnMouseOver(oRect);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var oLineTriggerRight = oSelectionDom.querySelector(".lineTrigger.rightTrigger");
			var oPositionTriggerRightX = oLineTriggerRight.getBBox().x;
			var oPositionTriggerRightY = oLineTriggerRight.getBBox().y;
			this.mousedown(oLineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
			this.mousemove(oLineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

			//Assert
			assert.ok(oResizeOutline.isResizing(), "Right Resizing");

			//Act
			qutils.triggerMouseEvent($Svg, "mouseup", 0, 0, oPositionTriggerRightX - 2, 10, 0);

			//Assert
			assert.ok(oEndResizingSpy.called, "Right Resizing End");

			//Act
			oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var oLineTriggerLeft = oSelectionDom.querySelector(".lineTrigger.leftTrigger");
			var oPositionTriggerLeftX = oLineTriggerLeft.getBBox().x;
			var oPositionTriggerLeftY = oLineTriggerLeft.getBBox().y;
			this.mousedown(oLineTriggerLeft, oPositionTriggerLeftX, oPositionTriggerLeftY);
			this.mousemove(oLineTriggerLeft, oPositionTriggerLeftX + 16, oPositionTriggerLeftY);

			//Assert
			assert.ok(oResizeOutline.isResizing(), "Left Resizing");

			//Act
			qutils.triggerKeydown($Svg, KeyCodes.ESCAPE);

			//Assert
			assert.strictEqual(oResizeOutline.isResizing(), false, "Resizing cancelled");

			//Clean-up
			qutils.triggerMouseEvent($Svg, "mouseup", 0, 0, oPositionTriggerLeftX - 2, 0, 0);
		}.bind(this));
	});

	QUnit.test("Interaction - Deselect shape", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			//Assert
			assert.strictEqual($ShapeSelectionRoot.length, 1, "Shape selection outline is rendered");
			oRect.setSelected(false, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			oSelectionDom = document.getElementById(sRectElementId + "-selected");
			$ShapeSelectionRoot = jQuery(oSelectionDom);
			//Assert
			assert.strictEqual($ShapeSelectionRoot.length, 0, "Shape selection outline is removed");

			//Act
			oRect.setResizable(false, true/**suppressInvalidate*/);
			oRect.setSelected(true, true/**suppressInvalidate*/);

			return utils.waitForGanttRendered(this.oGantt).then(function () {

				oResizeOutline.toggleOutline(oRect);
				oSelectionDom = document.getElementById(sRectElementId + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				//Assert
				assert.strictEqual($ShapeSelectionRoot.length, 1, "Default non-resizable outline is rendered");
				oRect.setSelected(false, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRect);
				oSelectionDom = document.getElementById(sRectElementId + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				//Assert
				assert.strictEqual($ShapeSelectionRoot.length, 0, "Default non-resizable outline is removed");
			});
		}.bind(this));
	});

	QUnit.module("Interaction - Basegroup shape selection and resizing outline", {
		beforeEach: function () {
			var date = new Date();
			var date1 = new Date();
			date1.setDate(date.getDate() + 1);
			this.oRect = new BaseRectangle({shapeId: "rect01", selectable: true,time:date,endTime:date1,fill:"#008FD3",resizable: true});
			this.oText = new BaseText({shapeId: "text01", selectable: true,text: "Test1",isLabel:true,time:date1,fill:"#008FD3",resizable: true});
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new  BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						shapes: [this.oRect,this.oText],
						fill:"#008FD3",
						resizable: true
					})
				]
			}));
			this.oGantt.setSelectOnlyGraphicalShape(true);
		},
		afterEach: function () {
			this.oRect = null;
			this.oText = null;
			utils.destroyGantt();
		},
		getFirstShape: function () {
			return this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
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

	QUnit.test("Interaction - Resizable outline rendering for basegroup", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oGroup = this.getFirstShape();
			var sRectElementId = oGroup.getShapeUid();
			//Act
			oGroup.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oGroup);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $BorderTop = oSelectionDom.querySelector(".border.topLine");
			var $BorderRight = oSelectionDom.querySelector(".border.rightLine");
			var $BorderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var $BorderLeft = oSelectionDom.querySelector(".border.leftLine");
			var $LineTriggerLeft = oSelectionDom.querySelector(".lineTrigger.leftTrigger");
			var $LineTriggerRight = oSelectionDom.querySelector(".lineTrigger.rightTrigger");
			var $RectTriggerLeft = oSelectionDom.querySelector(".rectTrigger.leftTrigger");
			var $RectTriggerRight = oSelectionDom.querySelector(".rectTrigger.rightTrigger");
			var $ResizeCover = oSelectionDom.querySelector(".resizeCover");
			//Assert
			assert.ok($BorderTop, "Top outline is rendered");
			assert.ok($BorderRight, "Right outline is rendered");
			assert.ok($BorderBottom, "Bottom outline is rendered");
			assert.ok($BorderLeft, "Left outline is rendered");
			assert.ok($LineTriggerLeft, "Left line trigger is rendered");
			assert.ok($LineTriggerRight, "Right line trigger is rendered");
			assert.equal($RectTriggerLeft,null, "Left Rect trigger is rendered");
			assert.equal($RectTriggerRight,null, "Right Rect trigger is rendered");
			assert.ok($ResizeCover, "Resize cover is rendered");
		}.bind(this));
	});

	QUnit.test("Interaction - Trigger cursor style on basegroup", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oGroup = this.getFirstShape();
			var sRectElementId = oGroup.getShapeUid();
			//Act
			oGroup.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oGroup);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $LineTriggerLeft = oSelectionDom.querySelector(".lineTrigger.leftTrigger");
			var $LineTriggerRight = oSelectionDom.querySelector(".lineTrigger.rightTrigger");
			qutils.triggerEvent("mouseover", $LineTriggerLeft);
			//Assert
			assert.strictEqual($LineTriggerLeft.style.cursor, "ew-resize", "Mouse cursor style of left resize trigger");
			//Act
			qutils.triggerEvent("mouseover", $LineTriggerRight);
			//Assert
			assert.strictEqual($LineTriggerRight.style.cursor, "ew-resize", "Mouse cursor style of right resize trigger");
		}.bind(this));
	});

	QUnit.test("Check resize Outline for xBias/yBias on basegroup", function (assert) {
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
			var $LineTriggerLeft = oSelectionDom.querySelector(".lineTrigger.leftTrigger").getBoundingClientRect();
			var oPositionTriggerLeftX = $LineTriggerLeft.left;
			var oPositionTriggerLeftY = $LineTriggerLeft.top;

			var $LineTriggerRight = oSelectionDom.querySelector(".lineTrigger.rightTrigger").getBoundingClientRect();
			var oPositionTriggerRightX = $LineTriggerRight.left;
			var oPositionTriggerRightY = $LineTriggerRight.top;

			oRectFirstShape.setYBias(-5);
			oRectFirstShape.setXBias(10);
			return utils.waitForGanttRendered(this.oGantt).then(function () {
				var oResizeOutline = this.oGantt._getResizeExtension();
				var oRectFirstShape = this.getFirstShape();
				var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();
				oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectFirstShape);
				var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
				var $LineTriggerLeft = oSelectionDom.querySelector(".lineTrigger.leftTrigger").getBoundingClientRect();
				var oNewPositionTriggerLeftX = $LineTriggerLeft.left;
				var oNewPositionTriggerLeftY = $LineTriggerLeft.top;

				var $LineTriggerRight = oSelectionDom.querySelector(".lineTrigger.rightTrigger").getBoundingClientRect();
				var oNewPositionTriggerRightX = $LineTriggerRight.left;
				var oNewPositionTriggerRightY = $LineTriggerRight.top;

				assert.equal(oNewPositionTriggerLeftX - oPositionTriggerLeftX, 10, "LeftTriggers x coordinate are places correctly");
				assert.equal(oNewPositionTriggerLeftY - oPositionTriggerLeftY, -5, "LeftTriggers y coordinate are places correctly");

				assert.equal(oNewPositionTriggerRightX - oPositionTriggerRightX, 10, "RightTriggers x coordinate are places correctly");
				assert.equal(oNewPositionTriggerRightY - oPositionTriggerRightY, -5, "RightTriggers y coordinate are places correctly");

				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Interaction - Deselect basegroup ", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			//Assert
			assert.ok(oSelectionDom, "Shape selection outline is rendered");
			oRect.setSelected(false, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			oSelectionDom = document.getElementById(sRectElementId + "-selected");
			//Assert
			assert.equal(oSelectionDom,null, "Shape selection outline is removed");

		}.bind(this));
	});

	QUnit.module("Interaction - Delta line selection and resizing", {
		beforeEach: function () {

			this.oShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						id: "r1",
						shapeId: "r1",
						x: 0,
						y: 0,
						rx: 10,
						ry: 10
					})
				]
			});
			utils.createGanttWithLines(
				this.oShape,
				"20180101000000",
				"20180105000000"
			);

			window.oGanttChart.placeAt("qunit-fixture");
			this.oGanttChart = window.oGanttChart;
		},
		afterEach: function () {
			this.oGanttChart.destroy(true/**bSuppressInvalidate*/);
			this.oGanttChart = null;
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
		getDeltaLine: function () {
			return this.oGanttChart.getDeltaLines()[0];
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

	QUnit.test("Interaction - Trigger cursor style Deltaline", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			//Arrange
			var oResizeOutline = this.oGanttChart._getResizeExtension();
			var oDeltaLine = this.getDeltaLine();
			oDeltaLine.setResizable(true);
			oDeltaLine._setIsSelected(true);
			var deltaMarker = oDeltaLine._getHeaderDeltaArea();
			oResizeOutline.addDeltaLineResizer(deltaMarker);
			var oSelectionDom = document.getElementById(deltaMarker.getId() + "-selected");
			var $DeltaSelectionRoot = jQuery(oSelectionDom);
			var $LineTriggerLeft = $DeltaSelectionRoot.find(".lineTrigger.leftTrigger");
			var $LineTriggerRight = $DeltaSelectionRoot.find(".lineTrigger.rightTrigger");
			qutils.triggerEvent("mouseover", $LineTriggerLeft);
			//Assert
			assert.strictEqual($LineTriggerRight.css("cursor"), "ew-resize", "Mouse cursor style of left resize trigger");
			//Act
			qutils.triggerEvent("mouseover", $LineTriggerRight);
			//Assert
			assert.strictEqual($LineTriggerRight.css("cursor"), "ew-resize", "Mouse cursor style of left resize trigger");
		}.bind(this));
	});

	QUnit.test("Interaction - Resize DeltaLine", function (assert) {
		// var done = assert.async();
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
				//Arrange
				var oResizeOutline = this.oGanttChart._getResizeExtension();
				var oEndResizingSpy = sinon.spy(oResizeOutline, "onDeltaResize");
				var oDeltaLine = this.getDeltaLine();
				oDeltaLine.setResizable(true);
				oDeltaLine._setIsSelected(true);
				var deltaMarker = oDeltaLine._getHeaderDeltaArea();
				var $Svg = jQuery(document.getElementById(this.oGanttChart.getId() + "-svg"));

				this.oGanttChart.attachEvent("deltalineResize", function (oEvent) {
					var newTimeStamp = oEvent.getParameter("newTimeStamp");
					var newEndTimeStamp = oEvent.getParameter("newEndTimeStamp");
					var oldTimeStamp = oEvent.getParameter("oldTimeStamp");
					var oldEndTimeStamp = oEvent.getParameter("oldEndTimeStamp");
					assert.ok(
						(newTimeStamp === oldTimeStamp) || (newEndTimeStamp === oldEndTimeStamp),
						"Time for the non-dragged side should not change in deltalineResize event's parameters."
					);
					assert.ok(
						(oldTimeStamp !== newTimeStamp) || (oldEndTimeStamp !== newEndTimeStamp),
						"Time for the dragged side should change in deltalineResize event's parameters."
					);
				});

				//Act
				oResizeOutline.addDeltaLineResizer(deltaMarker);
				var oSelectionDom = document.getElementById(deltaMarker.getId() + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				var oPositionTriggerRightX = $LineTriggerRight.position().left;
				var oPositionTriggerRightY = $LineTriggerRight.position().top;

				this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
				this.mousemove($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Right Resizing");

				//Act
				this.mouseup($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

				//Assert
				assert.ok(oEndResizingSpy.called, "Right Resizing End");

				//Act
				oResizeOutline.addDeltaLineResizer(deltaMarker);
				oSelectionDom = document.getElementById(deltaMarker.getId() + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
				var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

				this.mousedown($LineTriggerLeft, oPositionTriggerLeftX, oPositionTriggerLeftY);
				this.mousemove($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Left Resizing");

				this.mouseup($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);

				//Assert
				assert.ok(oEndResizingSpy.called, "Left Resizing End");


				oResizeOutline.addDeltaLineResizer(deltaMarker);
				oSelectionDom = document.getElementById(deltaMarker.getId() + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				$LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				oPositionTriggerRightX = $LineTriggerRight.position().left;
				oPositionTriggerRightY = $LineTriggerRight.position().top;

				this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
				this.mousemove($LineTriggerRight, oPositionTriggerRightX + 10, oPositionTriggerRightY);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Right Resizing");

				//Act
				qutils.triggerKeydown($Svg, KeyCodes.ESCAPE);

				//Assert
				assert.strictEqual(oResizeOutline.isResizing(), false, "Resizing cancelled");

				//Clean-up
				this.mouseup($LineTriggerRight, oPositionTriggerLeftX + 10, oPositionTriggerRightY);


			}.bind(this));
	});

	QUnit.module("Theme Adaptation", {
		before: function () {
			this.oTheme = GanttChartConfigurationUtils.getTheme();
		},
		beforeEach: function () {
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
		},
		after: function () {
			Theming.setTheme(this.oTheme);
		},
		getFirstShape: function () {
			return this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
		},
		colorAsserts: function (assert, oDomElement, attributeType, attributeValue) {
			assert.ok(oDomElement.getAttribute(attributeType).includes(attributeValue), attributeType + " color is correct : " + attributeValue);
		}
	});
	/**
	 * @deprecated since 1.120.0
	 */
	QUnit.test("adaptToHcbTheme", function (assert) {
		Theming.setTheme("sap_hcb");
		this.oGantt.setShapeSelectionSettings({
			color: "@sapUiChartPaletteSequentialHue1Dark2",
			strokeWidth: 4,
			shapeColor: "sapUiChartPaletteSequentialHue2Dark2",
			fillOpacity: 0.5,
			strokeDasharray: "1,0"
		});
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			var sColor = Parameters.get("sapUiChartPaletteSequentialHue1Dark2"), sShapeColor = Parameters.get("sapUiChartPaletteSequentialHue2Dark2");
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);

			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			var resizeCover = oSelectionDom.querySelector(".resizeCover");

			//Assert
			this.colorAsserts(assert, borderTop, "stroke", sColor);
			this.colorAsserts(assert, borderRight, "stroke", sColor);
			this.colorAsserts(assert, borderBottom, "stroke", sColor);
			this.colorAsserts(assert, borderLeft, "stroke", sColor);
			this.colorAsserts(assert, borderTop, "fill", sShapeColor);
			this.colorAsserts(assert, borderRight, "fill", sShapeColor);
			this.colorAsserts(assert, borderBottom, "fill", sShapeColor);
			this.colorAsserts(assert, borderLeft, "fill", sShapeColor);
			this.colorAsserts(assert, resizeCover, "fill", sShapeColor);
		}.bind(this));
	});

	QUnit.test("adaptToHcwTheme", function (assert) {
		Theming.setTheme("sap_fiori_3_hcw");
		this.oGantt.setShapeSelectionSettings({
			color: "sapUiChartPaletteSequentialHue1Dark2",
			strokeWidth: 4,
			shapeColor: "@sapUiChartPaletteSequentialHue2Dark2",
			fillOpacity: 0.5,
			strokeDasharray: "1,0"
		});
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			var sColor = Parameters.get("sapUiChartPaletteSequentialHue1Dark2"), sShapeColor = Parameters.get("sapUiChartPaletteSequentialHue2Dark2");
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			var resizeCover = oSelectionDom.querySelector(".resizeCover");
			//Assert
			this.colorAsserts(assert, borderTop, "stroke", sColor);
			this.colorAsserts(assert, borderRight, "stroke", sColor);
			this.colorAsserts(assert, borderBottom, "stroke", sColor);
			this.colorAsserts(assert, borderLeft, "stroke", sColor);
			this.colorAsserts(assert, borderTop, "fill", sShapeColor);
			this.colorAsserts(assert, borderRight, "fill", sShapeColor);
			this.colorAsserts(assert, borderBottom, "fill", sShapeColor);
			this.colorAsserts(assert, borderLeft, "fill", sShapeColor);
			this.colorAsserts(assert, resizeCover, "fill", sShapeColor);
		}.bind(this));
	});

	QUnit.test("adaptToDarkTheme", function (assert) {
		Theming.setTheme("sap_fiori_3_dark");
		this.oGantt.setShapeSelectionSettings({
			color: "@sapUiChartPaletteSequentialHue1Dark2",
			strokeWidth: 4,
			shapeColor: "@sapUiChartPaletteSequentialHue2Dark2",
			fillOpacity: 0.5,
			strokeDasharray: "1,0"
		});
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			var sColor = Parameters.get("sapUiChartPaletteSequentialHue1Dark2"), sShapeColor = Parameters.get("sapUiChartPaletteSequentialHue2Dark2");
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			var resizeCover = oSelectionDom.querySelector(".resizeCover");
			//Assert
			this.colorAsserts(assert, borderTop, "stroke", sColor);
			this.colorAsserts(assert, borderRight, "stroke", sColor);
			this.colorAsserts(assert, borderBottom, "stroke", sColor);
			this.colorAsserts(assert, borderLeft, "stroke", sColor);
			this.colorAsserts(assert, borderTop, "fill", sShapeColor);
			this.colorAsserts(assert, borderRight, "fill", sShapeColor);
			this.colorAsserts(assert, borderBottom, "fill", sShapeColor);
			this.colorAsserts(assert, borderLeft, "fill", sShapeColor);
			this.colorAsserts(assert, resizeCover, "fill", sShapeColor);
		}.bind(this));
	});

	QUnit.test("adaptTosap_horizonTheme", function (assert) {
		Theming.setTheme("sap_horizon");
		this.oGantt.setShapeSelectionSettings({
			color: "@sapUiChartPaletteSequentialHue1Dark2",
			strokeWidth: 4,
			shapeColor: "@sapUiChartPaletteSequentialHue2Dark2",
			fillOpacity: 0.5,
			strokeDasharray: "1,0"
		});
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			var sColor = Parameters.get("sapUiChartPaletteSequentialHue1Dark2"), sShapeColor = Parameters.get("sapUiChartPaletteSequentialHue2Dark2");
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			var resizeCover = oSelectionDom.querySelector(".resizeCover");
			//Assert
			this.colorAsserts(assert, borderTop, "stroke", sColor);
			this.colorAsserts(assert, borderRight, "stroke", sColor);
			this.colorAsserts(assert, borderBottom, "stroke", sColor);
			this.colorAsserts(assert, borderLeft, "stroke", sColor);
			this.colorAsserts(assert, borderTop, "fill", sShapeColor);
			this.colorAsserts(assert, borderRight, "fill", sShapeColor);
			this.colorAsserts(assert, borderBottom, "fill", sShapeColor);
			this.colorAsserts(assert, borderLeft, "fill", sShapeColor);
			this.colorAsserts(assert, resizeCover, "fill", sShapeColor);
		}.bind(this));
	});

	QUnit.test("adaptTosap_horizon_darkTheme", function (assert) {
		Theming.setTheme("sap_horizon_dark");
		this.oGantt.setShapeSelectionSettings({
			color: "@sapUiChartPaletteSequentialHue1Dark2",
			strokeWidth: 4,
			shapeColor: "@sapUiChartPaletteSequentialHue2Dark2",
			fillOpacity: 0.5,
			strokeDasharray: "1,0"
		});
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			var sColor = Parameters.get("sapUiChartPaletteSequentialHue1Dark2"), sShapeColor = Parameters.get("sapUiChartPaletteSequentialHue2Dark2");
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			var resizeCover = oSelectionDom.querySelector(".resizeCover");
			//Assert
			this.colorAsserts(assert, borderTop, "stroke", sColor);
			this.colorAsserts(assert, borderRight, "stroke", sColor);
			this.colorAsserts(assert, borderBottom, "stroke", sColor);
			this.colorAsserts(assert, borderLeft, "stroke", sColor);
			this.colorAsserts(assert, borderTop, "fill", sShapeColor);
			this.colorAsserts(assert, borderRight, "fill", sShapeColor);
			this.colorAsserts(assert, borderBottom, "fill", sShapeColor);
			this.colorAsserts(assert, borderLeft, "fill", sShapeColor);
			this.colorAsserts(assert, resizeCover, "fill", sShapeColor);
		}.bind(this));
	});
});
