/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/GanttPopoverExtension",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/core/Element"
], function (GanttPopoverExtension, BaseRectangle, GanttRowSettings, qutils, utils, Element) {
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
					resizable: true,
					height: 30
				})
			]
		});
	};

	QUnit.test("default values", function (assert) {
		var popoverExt = new GanttPopoverExtension({});
		assert.strictEqual(popoverExt._iOffsetX, 10, "Default _iOffsetX is 10");
		assert.strictEqual(popoverExt._iOffsetY, 32, "Default _iOffsetY is 32");
		assert.strictEqual(popoverExt._bNeedReverse, false, "Default _bNeedReverse is false");
		assert.strictEqual(popoverExt.oTimePopover, undefined, "Default oTimePopover is undefined");
	});

	QUnit.module("Interactions - GanttPopoverExtension", {
		beforeEach: function() {
			jQuery(document.getElementById("qunit-fixture")).css("height", "300px");

			utils.createGantt(true, fnCreateShapeBindingSettings());
			this.oGanttChart = window.oGanttChart;
			this.oGanttChart.setProperty("showShapeTimeOnDrag", true, true);
			this.oGanttChart.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
			jQuery(document.getElementById("qunit-fixture")).css("height", "100%");
		},
		getSvgOffset: function() {
			var popoverExt = window.oGanttChart._getPopoverExtension(),
				$svgCtn = jQuery(popoverExt.getDomRefs().gantt),
				$vsb = jQuery(window.oGanttChart.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar)),
				svgOffset = $svgCtn.offset(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top,
				iSvgRight = iSvgLeft + $svgCtn.width() - $vsb.width();

			return {left: iSvgLeft, top: iSvgTop, right: iSvgRight};
		},
		getDoms: function() {
			var targetShape = jQuery("rect[data-sap-gantt-shape-id=0]").get(0);
			var oRect = jQuery(targetShape).control(0, true);
			var sRectElementId = oRect.getShapeUid();

			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
			var $anchor = jQuery(document.getElementById("sapGanttPopoverAnchor"));

			return {
				targetShape: targetShape,
				anchor: $anchor,
				selection: $ShapeSelectionRoot,
				LineTriggerRight: $LineTriggerRight,
				startTime: $anchor.find(".sapGanttPopoverStartTime")
			};
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

	QUnit.test("Popover when DnD", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var iSvgRight = oSvgOffset.right;

			var popoverExt = this.oGanttChart._getPopoverExtension();
			var oDragShapeDom = this.getDoms().targetShape;
			var fnGetDragDropOrResizingDom = sinon.spy(popoverExt, "_getDragDropOrResizingDom");

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			var that = this;
			var checkAnchorExisted = function(count, desc) {
				var $anchor = that.getDoms().anchor;
				assert.equal($anchor.length, count, desc);
			};

			checkAnchorExisted(0, "Popover anchor not built after mousedown");
			assert.equal(popoverExt.oTimePopover, undefined, "oTimePopover is undefined after mousedown");

			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			checkAnchorExisted(0, "Popover not built before DnD");
			assert.equal(popoverExt.oTimePopover, undefined, "oTimePopover is undefined before DnD");

			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY + 20);
			checkAnchorExisted(1, "Build popover after DnD");
			assert.equal(popoverExt.oTimePopover != undefined, true, "oTimePopover is not undefined after DnD");
			assert.equal(popoverExt.oCountPopover, null, "oCountPopover is undefined while dragging single shape");

			this.mousemove(oDragShapeDom, iSvgLeft + 40, iPageY + 40);

			assert.equal(fnGetDragDropOrResizingDom.callCount, 2, "Update popover time when drag shape");

			this.mousemove(oDragShapeDom, iSvgRight - 10, iPageY + 40);
			var bExpectedNeedReverse = iSvgRight - 10 + popoverExt.oTimePopover.width() + 10 > popoverExt.pageWidth;
			assert.equal(popoverExt._bNeedReverse, bExpectedNeedReverse, "popoverExt._bNeedReverse is true when move to right edge");
			assert.equal(fnGetDragDropOrResizingDom.callCount, 3, "Update popover time when drag shape");

			// test time format
			var sStartTime = this.getDoms().startTime.html();
			assert.equal(sStartTime.search(/(\d{2}\:){2}\d{2}/), -1, "The time intervel is day");

			var axisTimeStrategy = this.oGanttChart.getAxisTimeStrategy();
			axisTimeStrategy.setZoomLevel(9);
			return new Promise(function (fnResolve) {
				oDragShapeDom = this.getDoms().targetShape;
				this.mousemove(oDragShapeDom, iSvgLeft + 40, iPageY + 40);

				sStartTime = this.getDoms().startTime.html();
				assert.equal(sStartTime.search(/(\d{2}\:){2}\d{2}/) > -1, true, "The time intervel is minute");

				this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
				checkAnchorExisted(0, "Popover anchor removed after Dnd");
				assert.equal(popoverExt.oTimePopover, null, "Remove popover after Dnd");

				fnGetDragDropOrResizingDom.restore();
				fnResolve();
			}.bind(this));

		}.bind(this));

	});

	QUnit.test("Popover when DnD in SnapMode", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var popoverExt = this.oGanttChart._getPopoverExtension();
			var oDragShapeDom = this.getDoms().targetShape;
			this.oGanttChart.setSnapMode("Left");
			this.oGanttChart.setSnapTimeInterval({"4hour":{timeInterval:3600}});
			//select shape
			Element.getElementById(oDragShapeDom.id).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			var that = this;
			var checkAnchorExisted = function(count, desc) {
				var $anchor = that.getDoms().anchor;
				assert.equal($anchor.length, count, desc);
			};

			checkAnchorExisted(0, "Popover anchor not built after mousedown");
			assert.equal(popoverExt.oTimePopover, undefined, "oTimePopover is undefined after mousedown");

			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			checkAnchorExisted(0, "Popover not built before DnD");
			assert.equal(popoverExt.oTimePopover, undefined, "oTimePopover is undefined before DnD");

			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY + 20);
			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			return new Promise(function (fnResolve) {
				setTimeout(function(){
					checkAnchorExisted(1, "Build popover after DnD");
					assert.equal(popoverExt.oTimePopover != undefined, true, "oTimePopover is not undefined after DnD");
					assert.equal(popoverExt.oCountPopover, null, "oCountPopover is undefined while dragging single shape");
					fnResolve();
				}, 1500);
			});

		}.bind(this));

	});

	QUnit.test("Popover when resizing", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var iSvgRight = oSvgOffset.right;
			var documetHTML = document.children ? document.children[0] : document.body.children[0];

			var popoverExt = this.oGanttChart._getPopoverExtension();
			var oResizeDom = this.getDoms().targetShape;
			var fnGetDragDropOrResizingDom = sinon.spy(popoverExt, "_getDragDropOrResizingDom");
			this.getDoms().anchor.remove();

			//select shape
			var oRect = jQuery(oResizeDom).control(0, true);
			oRect.setSelected(true);

			var $LineTriggerRight = this.getDoms().LineTriggerRight;
			this.mousedown($LineTriggerRight, iSvgLeft + 15, iPageY);

			var that = this;
			var checkAnchorExisted = function(count, desc) {
				var $anchor = that.getDoms().anchor;
				assert.equal($anchor.length, count, desc);
			};

			checkAnchorExisted(0, "Popover anchor not built after mousedown");
			assert.equal(popoverExt.oTimePopover, undefined, "oTimePopover is undefined after mousedown");

			this.mousemove(documetHTML, iSvgLeft + 16, iPageY);
			checkAnchorExisted(1, "Build popover when resizing");
			assert.equal(popoverExt.oTimePopover != undefined, true, "oTimePopover is not undefined when resizing shape");

			this.mousemove(documetHTML, iSvgLeft + 40, iPageY + 40);
			assert.equal(fnGetDragDropOrResizingDom.callCount, 2, "Update popover time when resizing shape");

			this.mousemove(documetHTML, iSvgRight - 10, iPageY + 40);
			var bExpectedNeedReverse = iSvgRight - 10 + popoverExt.oTimePopover.width() + 10 > popoverExt.pageWidth;
			assert.equal(popoverExt._bNeedReverse, bExpectedNeedReverse, "popoverExt._bNeedReverse is true when move to right edge");

			this.mouseup(documetHTML, iSvgLeft + 75, iPageY);
			checkAnchorExisted(0, "Popover anchor removed after resizing");
			assert.equal(popoverExt.oTimePopover, null, "Remove popover after resizing");

			fnGetDragDropOrResizingDom.restore();

		}.bind(this));
	});

	QUnit.test("Object count Popover when dragging multiple shapes", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var popoverExt = this.oGanttChart._getPopoverExtension();
			var oDragShapeDom = this.getDoms().targetShape;
			var oShapeDom1 = jQuery("rect[data-sap-gantt-shape-id=1]").get(0);
			var oShapeDom2 = jQuery("rect[data-sap-gantt-shape-id=2]").get(0);

			var oShapeUid = Element.getElementById(oDragShapeDom.id).getShapeUid();
			var oShape1Uid = Element.getElementById(oShapeDom1.id).getShapeUid();
			var oShape2Uid = Element.getElementById(oShapeDom2.id).getShapeUid();

			//select shapes
			window.oGanttChart.setSelectedShapeUid([oShapeUid, oShape1Uid, oShape2Uid]);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			var that = this;
			var checkAnchorExisted = function(count, desc) {
				var $anchor = that.getDoms().anchor;
				assert.equal($anchor.length, count, desc);
			};

			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY + 20);
			checkAnchorExisted(1, "Single count popover on dragging multiple shapes");
			assert.equal(popoverExt.oCountPopover != undefined, true, "oCountPopover is not undefined while dragging multiple shapes");
			assert.equal(popoverExt.oTimePopover, null, "oTimePopover is undefined while dragging multiple shapes");
			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			checkAnchorExisted(0, "Popover anchor removed after Dnd");
			assert.equal(popoverExt.oCountPopover, null, "Remove count popover after Dnd");
		}.bind(this));
	});
});
