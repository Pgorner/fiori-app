/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/GanttDragDropExtension",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/BaseConditionalShape",
	"sap/gantt/def/SvgDefs",
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/BaseGroup",
	"sap/ui/events/KeyCodes",
	"sap/ui/core/Element",
	"sap/gantt/simple/BaseDiamond",
	"sap/gantt/simple/ShapeStyle"
], function (GanttDragDropExtension, BaseRectangle, GanttRowSettings, qutils, utils, BaseConditionalShape, SvgDefs, SlashPattern, GanttChartContainer, ContainerToolbar,BaseText,BaseGroup, KeyCodes, Element, BaseDiamond, ShapeStyle) {
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

	QUnit.test("default values", function (assert) {
		var dragDropExt = new GanttDragDropExtension({});
		assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Default oMouseDownTarget is null");
		assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "Default oLastDraggedShape is null");
		assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Default mDragPoint.shapeX is undefined");
		assert.strictEqual(dragDropExt.dragGhost, null, "Default dragGhost is null");
		assert.strictEqual(dragDropExt.isSnapping, false, "Snapping is disabled by Default");
		assert.strictEqual(dragDropExt.snapVal, 0, "Default snap value is zero");
		assert.strictEqual(dragDropExt.snapTimer, null, "Default snapTimer is null");
	});

	QUnit.module("GanttChartWithTable Functions - GanttDragDropExtension", {
		beforeEach: function(assert){
			utils.createGantt(true, fnCreateShapeBindingSettings());
			window.oGanttChart.placeAt("qunit-fixture");
			this.oGanttChart = window.oGanttChart;
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

			return {
				sourceRow:  jQuery("rect[data-sap-ui-index=0]").get(0),
				droppedRow:  jQuery("rect[data-sap-ui-index=4]").get(0),
				draggedShape: jQuery("rect[data-sap-gantt-shape-id=0]").get(0),
				header: jQuery(".sapGanttChartHeader").get(0),
				ghost: jQuery(document.getElementById("sapGanttDragGhostWrapper"))
			};
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
		triggerEscape: function(oShape) {
			qutils.triggerKeydown(oShape, KeyCodes.ESCAPE);
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
		afterEach: function(assert) {
			utils.destroyGantt();
		}
	});

	QUnit.test("Drag In Free Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oSourceRowDom = this.getDoms().sourceRow;
			var oHeader = this.getDoms().header;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");
			var fnIsPointerInGanttChart = sinon.stub(window.oGanttChart._getPointerExtension(), "isPointerInGanttChart").returns(false);

			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Before mousedown: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "Before mousedown: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Before mousedown: mDragPoint.shapeX is undefined");

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.equal(oSourceRowDom.getAttribute("data-sap-ui-index"), 0, "Mouse Pointer is at row 0 when shape is selected.");

			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");

			var sShapUid = "PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]";
			assert.strictEqual(dragDropExt.oLastDraggedShapeData.shapeUid, sShapUid, "After mousedown: The last dragged shape uid is '" + sShapUid + "'");
			assert.strictEqual(jQuery(dragDropExt.oMouseDownTarget).data("sapGanttShapeId"), 0, "After mousedown: The loMouseDownTarget shape id is '0'");
			assert.ok(dragDropExt.mDragPoint.shapeX > 0, "After mousedown: mDragPoint.shapeX > 0");

			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			this.mouseup(oHeader, iSvgLeft + 16, iPageY);
			assert.equal(fnGetGhostTime.callCount, 0, "Before mouseup, drag not ended, no shapeDrop event fired");

			oDragShapeDom = this.getDoms().draggedShape;
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iSvgTop - 30);
			this.mouseup(oHeader, iSvgLeft + 20, iSvgTop - 30);
			assert.equal(fnGetGhostTime.callCount, 1, "Drop to invalide area, no shapeDrop event fired");
			oDragShapeDom = this.getDoms().draggedShape;
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY);

			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");

			var iOriginalShapeDuration = dragDropExt.oLastDraggedShapeData.endTime - dragDropExt.oLastDraggedShapeData.startTime;
			var iCurrentShapeDuration = fnGetGhostTime.returnValues[0].endTime - fnGetGhostTime.returnValues[0].time;
			assert.equal(iOriginalShapeDuration, iCurrentShapeDuration, "Shape Duration remains same on drag");

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 50, iPageY - 30);
			assert.equal(window.oGanttChart._getPointerExtension().isPointerInGanttChart() , false, "Pointer not in GanttChart");
			assert.equal(document.body.style.cursor, "not-allowed", "Document Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttSvg.style.cursor, "not-allowed", "Gantt Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().headerSvg.style.cursor, "not-allowed", "GanttHeader Cursor changed to not-allowed");


			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);

			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 50, iPageY - 30);
			assert.equal(window.oGanttChart._getPointerExtension().isPointerInGanttChart() , false, "Pointer not in GanttChart");
			assert.equal(document.body.style.cursor, "not-allowed", "Document Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttSvg.style.cursor, "not-allowed", "Gantt Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().headerSvg.style.cursor, "not-allowed", "GanttHeader Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttChartContainerToolbar, null, "Gantt Container Toolbar changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().gantt.style.pointerEvents, "auto", "Gantt Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttChart.style.pointerEvents, "none", "Entire GanttChart Cursor changed to not-allowed");
			fnIsPointerInGanttChart.restore();

			this.mousemove(oDragShapeDom, iSvgLeft + 50, iPageY + 70);
			assert.equal(document.body.style.cursor, "move", "Document Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttSvg.style.cursor, "move", "Gantt Cursor changed back");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttChartContainerToolbar, null, "Gantt Container Toolbar changed back");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().gantt.style.pointerEvents, "", "Gantt Cursor changed back");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttChart.style.pointerEvents, "", "Entire GanttChart Cursor changed back");
			this.mouseup(oDragShapeDom, iSvgLeft + 50, iPageY + 70);

			// set shape undraggable
			var oDraggedShape = dragDropExt.getShapeElementByTarget(oDragShapeDom);
			assert.ok(oDraggedShape !== null, "Dragged shape is not null");
			oDraggedShape.setDraggable(false);
			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			return new Promise(function (fnResolve) {
				assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mousedown on a undraggable shape: oMouseDownTarget is null");
				assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mousedown on a undraggable shape: oLastDraggedShapeData is null");
				assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mousedown on a undraggable shape: mDragPoint.shapeX is undefined");
				fnResolve();
			});
		}.bind(this));

	});

	QUnit.test("Drag In Horizontal Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oDropppedRowDom = this.getDoms().droppedRow;
			var oSourceRowDom = this.getDoms().sourceRow;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");
			this.oGanttChart.setDragOrientation(sap.gantt.DragOrientation.Horizontal);
			var fnIsPointerInGanttChart = sinon.stub(window.oGanttChart._getPointerExtension(), "isPointerInGanttChart").returns(false);

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.equal(oSourceRowDom.getAttribute("data-sap-ui-index"), 0, "Mouse Pointer is at row 0 when shape is selected.");
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY + 100);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY + 200);
			var iTop = dragDropExt.dragGhost.position().top;
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY + 300);
			var iCurrentTop = dragDropExt.dragGhost.position().top;
			assert.equal(iTop, iCurrentTop, "When drag in horizontal direction, axis-y will not change");
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY + 400);
			iCurrentTop = dragDropExt.dragGhost.position().top;
			assert.equal(iTop, iCurrentTop, "When drag in horizontal direction, axis-y will not change");
			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 50, iPageY - 30);
			assert.equal(window.oGanttChart._getPointerExtension().isPointerInGanttChart() , false, "Pointer not in GanttChart");
			assert.equal(document.body.style.cursor, "not-allowed", "Document Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttSvg.style.cursor, "not-allowed", "Gantt Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().headerSvg.style.cursor, "not-allowed", "GanttHeader Cursor changed to not-allowed");
			fnIsPointerInGanttChart.restore();

			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.equal(oEvent.mParameters.targetRow.getIndex(), 0, "Target Row has data for Row of Index 0");
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);
			this.mouseup(oDropppedRowDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");
			assert.equal(oDragShapeDom.getAttribute("data-sap-gantt-shape-id"), 0, "Dragged Shape is from row 0.");
			assert.equal(oDropppedRowDom.getAttribute("data-sap-ui-index"), 4, "Mouse Pointer is at row 4 when shape is dropped.");
		}.bind(this));

	});

	QUnit.test("Drag In Vertical Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oDropppedRowDom = this.getDoms().droppedRow;
			var oSourceRowDom = this.getDoms().sourceRow;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");
			this.oGanttChart.setDragOrientation(sap.gantt.DragOrientation.Vertical);
			var fnIsPointerInGanttChart = sinon.stub(window.oGanttChart._getPointerExtension(), "isPointerInGanttChart").returns(false);

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.equal(oSourceRowDom.getAttribute("data-sap-ui-index"), 0, "Mouse Pointer is at row 0 when shape is selected.");
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY + 100);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY + 200);
			var iLeft = dragDropExt.dragGhost.position().left;
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY + 300);
			var iCurrentLeft = dragDropExt.dragGhost.position().left;
			assert.equal(iLeft, iCurrentLeft, "When drag in vertical direction, axis-x will not change");

			this.mousemove(oDragShapeDom, iSvgLeft + 175, iPageY + 300);
			iCurrentLeft = dragDropExt.dragGhost.position().left;

			assert.equal(iLeft, iCurrentLeft, "When drag in vertical direction, axis-x will not change");
			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 50, iPageY - 30);
			assert.equal(window.oGanttChart._getPointerExtension().isPointerInGanttChart() , false, "Pointer not in GanttChart");
			assert.equal(document.body.style.cursor, "not-allowed", "Document Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttSvg.style.cursor, "not-allowed", "Gantt Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().headerSvg.style.cursor, "not-allowed", "GanttHeader Cursor changed to not-allowed");
			fnIsPointerInGanttChart.restore();

			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.equal(oEvent.mParameters.targetRow.getIndex(), 4, "TargetRow has data for Row of Index 4");
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);
			this.mouseup(oDropppedRowDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");
			assert.equal(oDragShapeDom.getAttribute("data-sap-gantt-shape-id"), 0, "Dragged Shape is from row 0.");
			assert.equal(oDropppedRowDom.getAttribute("data-sap-ui-index"), 4, "Mouse Pointer is at row 4 when shape is dropped.");
		}.bind(this));

	});

	QUnit.test("Drag In Free Direction - Shape with SlashPattern", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgDefs = new SvgDefs({
				defs: [
					new SlashPattern("testing1", {
					stroke: "#CAC7BA"
					})
				]
			});
			window.oGanttChart.setSvgDefs(oSvgDefs);
			window.oGanttChart.getTable().getRows().forEach(function(oRow) {
				oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
					oShape.setFill("url(#testing1)");
				});
			});
			window.oGanttChart.getTable().getRowSettingsTemplate().getShapes1()[0].setFill("url(#testing1)");
			return utils.waitForGanttRendered(window.oGanttChart).then(function () {
				var oSvgOffset = this.getSvgOffset();
				var iSvgLeft = oSvgOffset.left;
				var iSvgTop = oSvgOffset.top;
				var iPageY = iSvgTop + 10;
				var dragDropExt = this.oGanttChart._getDragDropExtension();
				var oDragShapeDom = this.getDoms().draggedShape;
				 Element.getElementById(oDragShapeDom.id).setSelected(true);

				this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
				this.mousemove(oDragShapeDom, iSvgLeft + 100, iPageY + 10);

				assert.ok(dragDropExt.dragGhost, "Drag Ghost is created.");
				assert.ok(dragDropExt.dragGhost.find(".sapGanttDragGhostImg"), "Drag Ghost image is created.");
				window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
					assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
					fnDone();
				}, this);
				this.mouseup(oDragShapeDom, iSvgLeft + 100, iPageY + 10);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Drag In Horizontal Direction - Shape with SlashPattern", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgDefs = new SvgDefs({
				defs: [
					new SlashPattern("testing1", {
					stroke: "#CAC7BA"
					})
				]
			});
			window.oGanttChart.setSvgDefs(oSvgDefs);
			window.oGanttChart.getTable().getRows().forEach(function(oRow) {
				oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
					oShape.setFill("url(#testing1)");
				});
			});
			window.oGanttChart.getTable().getRowSettingsTemplate().getShapes1()[0].setFill("url(#testing1)");
			window.oGanttChart.setDragOrientation(sap.gantt.DragOrientation.Horizontal);
			return utils.waitForGanttRendered(window.oGanttChart).then(function () {
				var oSvgOffset = this.getSvgOffset();
				var iSvgLeft = oSvgOffset.left;
				var iSvgTop = oSvgOffset.top;
				var iPageY = iSvgTop + 10;
				var dragDropExt = this.oGanttChart._getDragDropExtension();
				var oDragShapeDom = this.getDoms().draggedShape;
				Element.getElementById(oDragShapeDom.id).setSelected(true);

				this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
				this.mousemove(oDragShapeDom, iSvgLeft + 100, iPageY);

				assert.ok(dragDropExt.dragGhost, "Drag Ghost is created.");
				assert.ok(dragDropExt.dragGhost.find(".sapGanttDragGhostImg"), "Drag Ghost image is created.");
				window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
					assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
					fnDone();
				}, this);
				this.mouseup(oDragShapeDom, iSvgLeft + 100, iPageY);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Drag In Vertical Direction - Shape with SlashPattern", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgDefs = new SvgDefs({
				defs: [
					new SlashPattern("testing1", {
					stroke: "#CAC7BA"
					})
				]
			});
			window.oGanttChart.setSvgDefs(oSvgDefs);
			window.oGanttChart.getTable().getRows().forEach(function(oRow) {
				oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
					oShape.setFill("url(#testing1)");
				});
			});
			window.oGanttChart.getTable().getRowSettingsTemplate().getShapes1()[0].setFill("url(#testing1)");
			window.oGanttChart.setDragOrientation(sap.gantt.DragOrientation.Vertical);
			return utils.waitForGanttRendered(window.oGanttChart).then(function () {
				var oSvgOffset = this.getSvgOffset();
				var iSvgLeft = oSvgOffset.left;
				var iSvgTop = oSvgOffset.top;
				var iPageY = iSvgTop + 10;
				var dragDropExt = this.oGanttChart._getDragDropExtension();
				var oDragShapeDom = this.getDoms().draggedShape;
				Element.getElementById(oDragShapeDom.id).setSelected(true);

				this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
				this.mousemove(oDragShapeDom, iSvgLeft + 15, iPageY + 50);

				assert.ok(dragDropExt.dragGhost, "Drag Ghost is created.");
				assert.ok(dragDropExt.dragGhost.find(".sapGanttDragGhostImg"), "Drag Ghost image is created.");
				window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
					assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
					fnDone();
				}, this);
				this.mouseup(oDragShapeDom, iSvgLeft + 15, iPageY + 50);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("isEventTargetDraggable", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.target = oDragShapeDom;
			this.oGanttChart.setEnableSelectAndDrag(true);
			oEventParams.ctrlKey = false;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), false, "The unselected shape is not draggable without ctrl key in MultiWithKeyboard mode");
			oEventParams.ctrlKey = true;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), false, "The unselected shape is not draggable with ctrl key in MultiWithKeyboard mode");
			this.oGanttChart.setEnableSelectAndDrag(false);
			oEventParams.ctrlKey = false;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), true, "The unselected shape can be dragged without ctrl key in MultiWithKeyboard mode if EnableSelectAndDrag set as false");
			oEventParams.ctrlKey = true;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), true, "The unselected shape can be dragged with ctrl key in MultiWithKeyboard mode if EnableSelectAndDrag set as false");
		}.bind(this));
	});

	QUnit.test("isValidDropZone", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oEvent = {};
			var oDragShapeDom = this.getDoms().draggedShape;
			var oHeader = this.getDoms().header;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			oEvent.target = oDragShapeDom;
			assert.strictEqual(dragDropExt.isValidDropZone(oEvent), true, "valid drop area");
			oEvent.target = oHeader;
			assert.strictEqual(dragDropExt.isValidDropZone(oEvent), false, "invalid drop area");
		}.bind(this));
	});

	QUnit.test("Multiple ghost shapes with text on them while dragging multiple shapes", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGanttChart).then(function() {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var oShape1 = jQuery("rect[data-sap-gantt-shape-id=0]").get(0);
			var oShape2 = jQuery("rect[data-sap-gantt-shape-id=1]").get(0);
			var oShape3 = jQuery("rect[data-sap-gantt-shape-id=2]").get(0);

			var oShape1Uid = Element.getElementById(oShape1.id).getShapeUid();
			var oShape2Uid = Element.getElementById(oShape2.id).getShapeUid();
			var oShape3Uid = Element.getElementById(oShape3.id).getShapeUid();
			this.oGanttChart.setSelectedShapeUid([oShape1Uid, oShape2Uid, oShape3Uid]);

			this.mousedown(oShape1, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1, iSvgLeft + 250, iPageY);
			this.mousemove(oShape1, iSvgLeft + 350, iPageY);

			assert.equal(this.oGanttChart._getDragDropExtension()._bGhostsPositioned, true, "Ghost positions are updated");
			assert.equal(!!this.oGanttChart._getDragDropExtension().iGhostTimer, true, "Ghost timer fired");

			window.clearTimeout(this.oGanttChart._getDragDropExtension().iGhostTimer);

			this.oGanttChart._getDragDropExtension()._updateGhostShapesPosition();

			assert.equal(window.getComputedStyle(document.getElementById("sapGanttDragGhostWrapper")).visibility, "visible", "Ghost wrapper visible after updating the ghost positions");
			var aGhosts = document.getElementsByClassName("sapGanttDragGhost");
			assert.equal(aGhosts.length , 3, "Ghosts of all the selected shapes");
			var aGhostLabel = document.getElementsByClassName("sapGanttDragGhostLabel");
			assert.equal(aGhostLabel.length , 3, "All ghost's have shape label on them");
			var aObjectCountPopover = document.getElementsByClassName("sapGanttPopoverObjectCount");
			assert.equal(aObjectCountPopover.length , 1, "Object count popover visible");
			this.mouseup(oShape1, iSvgLeft + 75, iPageY);
			done();
		}.bind(this));
	});

	QUnit.test("No text on ghosts when showTextOnGhost property set to false", function (assert) {
		window.oGanttChart.setShowTextOnGhost(false);
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var oShape1 = jQuery("rect[data-sap-gantt-shape-id=0]").get(0);
			var oShape2 = jQuery("rect[data-sap-gantt-shape-id=1]").get(0);
			var oShape3 = jQuery("rect[data-sap-gantt-shape-id=2]").get(0);

			var oShape1Uid = Element.getElementById(oShape1.id).getShapeUid();
			var oShape2Uid = Element.getElementById(oShape2.id).getShapeUid();
			var oShape3Uid = Element.getElementById(oShape3.id).getShapeUid();
			window.oGanttChart.setSelectedShapeUid([oShape1Uid, oShape2Uid, oShape3Uid]);

			this.mousedown(oShape1, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1, iSvgLeft + 250, iPageY);
			this.mousemove(oShape1, iSvgLeft + 350, iPageY);

			var done = assert.async();
			var aGhosts = document.getElementsByClassName("sapGanttDragGhost");
			assert.equal(aGhosts.length , 3, "Ghosts of all the selected shapes");
			var aGhostLabel = document.getElementsByClassName("sapGanttDragGhostLabel");
			assert.equal(aGhostLabel.length , 0, "Ghosts do not have shape label on them");
			this.mouseup(oShape1, iSvgLeft + 75, iPageY);
			done();
		}.bind(this));
	});

	QUnit.test("Dragging shapes with x and y bias", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var oShape1Dom = jQuery("rect[data-sap-gantt-shape-id=0]").get(0);
			var oShape2Dom = jQuery("rect[data-sap-gantt-shape-id=1]").get(0);
			var oShape3Dom = jQuery("rect[data-sap-gantt-shape-id=2]").get(0);

			var oShape1 = Element.getElementById(oShape1Dom.id);
			var oShape2 = Element.getElementById(oShape2Dom.id);
			var oShape3 = Element.getElementById(oShape3Dom.id);

			oShape1.setXBias(500);
			oShape1.setYBias(30);

			window.oGanttChart.setSelectedShapeUid([oShape1.getShapeUid(), oShape2.getShapeUid(), oShape3.getShapeUid()]);

			this.mousedown(oShape1Dom, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1Dom, iSvgLeft + 250, iPageY);
			this.mousemove(oShape1Dom, iSvgLeft + 350, iPageY);

			var done = assert.async();
			assert.equal(this.oGanttChart._getDragDropExtension()._bGhostsPositioned, true, "Ghost positions are updated");
			assert.equal(!!this.oGanttChart._getDragDropExtension().iGhostTimer, true, "Ghost timer fired");

			window.clearTimeout(this.oGanttChart._getDragDropExtension().iGhostTimer);

			this.oGanttChart._getDragDropExtension()._updateGhostShapesPosition();
			var aGhosts = document.getElementsByClassName("sapGanttDragGhost");
			assert.equal(parseInt(aGhosts[1].style.left), parseInt(oShape2.getX() - (oShape1.getX() + 500)), "Ghost shape should consider x and y bias");
			assert.equal(parseInt(aGhosts[2].style.left), parseInt(oShape3.getX() - (oShape1.getX() + 500)), "Ghost shape should consider x and y bias");
			this.mouseup(oShape1Dom, iSvgLeft + 75, iPageY);
			done();
		}.bind(this));
	});

	QUnit.test("Test Row highlight behavior", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var oShape1Dom = document.querySelector("rect[data-sap-gantt-shape-id='0']");
			var oShape2Dom = document.querySelector("rect[data-sap-gantt-shape-id='1']");

			var oShape1 = Element.getElementById(oShape1Dom.id);
			var oShape2 = Element.getElementById(oShape2Dom.id);

			oShape1.setDragHighlightRows(["0","1","2","3","4"]);
			oShape2.setDragHighlightRows(["5","6"]);
			window.oGanttChart.setSelectedShapeUid([oShape1.getShapeUid()]);
			window.oGanttChart.setRowHighlightFill("rgb(0, 128, 0)");

			this.mousedown(oShape1Dom, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1Dom, iSvgLeft + 250, iPageY);
			this.mousemove(oShape1Dom, iSvgLeft + 350, iPageY);
			var aHighlightedRows = document.getElementsByClassName("sapGanttBackgroundSVGRowHighlighted");
			assert.equal(aHighlightedRows.length , 5, "All the valid rows are highlighted");
			assert.equal(document.body.style.cursor, "move", "Cursor set to move on valid rows");
			assert.equal(window.getComputedStyle(aHighlightedRows[0]).fill, "rgb(0, 128, 0)", "Correct color set for highlighted rows");
			this.mouseup(oShape1Dom, iSvgLeft + 100, iPageY + 175);

			window.oGanttChart.setSelectedShapeUid([oShape2.getShapeUid()]);
			this.mousedown(oShape2Dom, iSvgLeft + 75, iPageY);
			this.mousemove(oShape2Dom, iSvgLeft + 250, iPageY);
			this.mousemove(oShape2Dom, iSvgLeft + 350, iPageY);
			aHighlightedRows = document.getElementsByClassName("sapGanttBackgroundSVGRowHighlighted");
			assert.equal(aHighlightedRows.length , 2, "All the valid rows are highlighted");
			this.mouseup(oShape2Dom, iSvgLeft + 100, iPageY + 175);

			window.oGanttChart.setSelectedShapeUid([oShape1.getShapeUid(), oShape2.getShapeUid()]);
			this.mousedown(oShape1Dom, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1Dom, iSvgLeft + 250, iPageY);
			this.mousemove(oShape1Dom, iSvgLeft + 350, iPageY);
			aHighlightedRows = document.getElementsByClassName("sapGanttBackgroundSVGRowHighlighted");
			assert.equal(aHighlightedRows.length , 0, "No rows are highlighted because of multiple shapes dragging");
			this.mouseup(oShape2Dom, iSvgLeft + 100, iPageY + 175);
		}.bind(this));
	});

	QUnit.test("Test shape drop event on row highlight", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var oShape1Dom = document.querySelector("rect[data-sap-gantt-shape-id='0']");
			var oRowDom = document.querySelector("rect[data-sap-ui-index='4']");
			var oShape1 = Element.getElementById(oShape1Dom.id);
			var iShapeDropCount = 0;
			oShape1.setDragHighlightRows(["0","1","2","3","4"]);
			window.oGanttChart.attachEvent("shapeDrop", function (oEvent) {
				assert.strictEqual(!!oEvent.mParameters.targetRow, true, "Shape drop event triggered");
				iShapeDropCount++;
			}, this);
			var oRow = window.oGanttChart.getTable().getRows()[0];
			var oParametersForShapeDrop = {
				targetRow: oRow
			};
			window.oGanttChart.fireShapeDrop(oParametersForShapeDrop);
			this.mousedown(oShape1Dom, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1Dom, iSvgLeft + 250, iPageY);
			this.mouseup(oRowDom, iSvgLeft + 100, iPageY + 175);
			assert.equal(iShapeDropCount, 2, "Shape drop event triggered twice");
			fnDone();
		}.bind(this));
	});

	QUnit.test("Test shape drop cancel event on row highlight", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var oShape1Dom = document.querySelector("rect[data-sap-gantt-shape-id='0']");
			var oShape1 = Element.getElementById(oShape1Dom.id);

			oShape1.setDragHighlightRows(["0","1","2","3","4"]);

			this.mousedown(oShape1Dom, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1Dom, iSvgLeft + 250, iPageY);

			var aHighlightedRows = document.getElementsByClassName("sapGanttBackgroundSVGRowHighlighted");
			assert.equal(aHighlightedRows.length , 5, "All the valid rows are highlighted");

			this.triggerEscape(oShape1Dom);

			aHighlightedRows = document.getElementsByClassName("sapGanttBackgroundSVGRowHighlighted");

			assert.equal(aHighlightedRows.length , 0, "No rows are highlighted because of drag cancelled");
			fnDone();
		}.bind(this));
	});


	QUnit.test("Drag with SnapMode Left", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			this.oGanttChart.setSnapMode("Left");
			Element.getElementById(oDragShapeDom.id).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.strictEqual(dragDropExt.isSnapping, false, "Before mouseMove: isSnapping is false");
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY);
			var sleft = dragDropExt.dragGhost.position().left;

			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);

			assert.equal(this.oGanttChart.getSnapMode(), "Left", "Snap mode is set to left");
			assert.equal(!!this.oGanttChart._getDragDropExtension().snapTimer, true, "Snap timer fired");

			window.clearTimeout(this.oGanttChart._getDragDropExtension().snapTimer);

			var oEvent = this.createEventParam(iSvgLeft + 35, iPageY);
			this.oGanttChart._getDragDropExtension().showGhost(oEvent, true);
			assert.strictEqual(dragDropExt.isSnapping, true, "After mouseMove: isSnapping is true");
			assert.strictEqual(Math.round(dragDropExt.snapVal),
			Math.round(sleft - dragDropExt.dragGhost.position().left),
			"SnapVal is the differnce between original position of shape and snapped Position.");
			this.mouseup(this.getDoms().draggedShape, iSvgLeft + 35 - dragDropExt.snapVal, iPageY);
		}.bind(this));
	});

	QUnit.test("Drag when triggered by left/right mouse button", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oDragShape = Element.getElementById(oDragShapeDom.id);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY, 2);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			assert.strictEqual(oDragShape.getSelected(), false, "Shape not selected when mousedown triggered by right mouse button");
			assert.strictEqual(dragDropExt.isDragging(), false, "No dragging when triggered by right mouse button");
			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);

			oDragShape.setSelected(false);
			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			assert.strictEqual(oDragShape.getSelected(), true, "Shape selected when mousedown triggered by left mouse button");
			assert.strictEqual(dragDropExt.isDragging(), true, "Drag happening when triggered by left mouse button");
			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
		}.bind(this));

	});

	QUnit.test("Drag with SnapMode Right", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			this.oGanttChart.setSnapMode("Right");
			Element.getElementById(oDragShapeDom.id).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.strictEqual(dragDropExt.isSnapping, false, "Before mouseMove: isSnapping is false");
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY);
			var sleft = dragDropExt.dragGhost.position().left;

			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);

			assert.equal(this.oGanttChart.getSnapMode(),	"Right", "Snap mode is set to right");
			assert.equal(!!this.oGanttChart._getDragDropExtension().snapTimer, true, "Snap timer fired");

			window.clearTimeout(this.oGanttChart._getDragDropExtension().snapTimer);

			var oEvent = this.createEventParam(iSvgLeft + 35, iPageY);
			this.oGanttChart._getDragDropExtension().showGhost(oEvent, true);
			assert.strictEqual(dragDropExt.isSnapping, true, "After mouseMove: isSnapping is true");
			assert.strictEqual(Math.round(dragDropExt.snapVal),
			Math.round(sleft - dragDropExt.dragGhost.position().left),
			"SnapVal is the differnce between original position of shape and snapped Position.");
			this.mouseup(this.getDoms().draggedShape, iSvgLeft + 35 - dragDropExt.snapVal, iPageY);
		}.bind(this));
	});

	QUnit.test("Drag with SnapMode Both", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			this.oGanttChart.setSnapMode("Both");
			Element.getElementById(oDragShapeDom.id).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.strictEqual(dragDropExt.isSnapping, false, "Before mouseMove: isSnapping is false");
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY);
			var sleft = dragDropExt.dragGhost.position().left;

			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);

			assert.equal(this.oGanttChart.getSnapMode(), "Both", "Snap mode is set to both");
			assert.equal(!!this.oGanttChart._getDragDropExtension().snapTimer, true, "Snap timer fired");

			window.clearTimeout(this.oGanttChart._getDragDropExtension().snapTimer);

			var oEvent = this.createEventParam(iSvgLeft + 35, iPageY);
			this.oGanttChart._getDragDropExtension().showGhost(oEvent, true);
			assert.strictEqual(dragDropExt.isSnapping, true, "After mouseMove: isSnapping is true");
			assert.strictEqual(Math.round(dragDropExt.snapVal),
			Math.round(sleft - dragDropExt.dragGhost.position().left),
			"SnapVal is the differnce between original position of shape and snapped Position.");
			this.mouseup(this.getDoms().draggedShape, iSvgLeft + 35 - dragDropExt.snapVal, iPageY);
		}.bind(this));

	});

	QUnit.test("Drag source row should be destroyed properly", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;

			// first selection
			assert.equal(dragDropExt.oSourceRow, undefined, "Source row not cloned");

			// first mouse down selection, clone the source row
			this.mousedown(oDragShapeDom, 0, 0);
			assert.notEqual(dragDropExt.oSourceRow, undefined, "New Source row cloned");

			// second mouse down selection, destroy the current row clone and clone the new source row
			var oCurrentSource = dragDropExt.oSourceRow;
			var fnDestroyHandler = sinon.spy(oCurrentSource, "destroy");
			this.mousedown(oDragShapeDom, 0, 0);
			assert.equal(fnDestroyHandler.callCount, 1, "Current row source destroyed");
			assert.notEqual(dragDropExt.oSourceRow, undefined, "New Source row cloned");

			// third mouse down on non-draggable element, destroy the current row clone
			oCurrentSource = dragDropExt.oSourceRow;
			fnDestroyHandler = sinon.spy(oCurrentSource, "destroy");
			var oRowDom = document.querySelector("rect[data-sap-ui-index='1']");
			this.mousedown(oRowDom, 0, 0);
			assert.equal(fnDestroyHandler.callCount, 1, "Current row source destroyed");
			assert.equal(dragDropExt.oSourceRow, undefined, "New Source row not cloned");
		}.bind(this));
	});

	QUnit.test("Drag shape when shape is selectable", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oDragShapeDom = this.getDoms().draggedShape;
			Element.getElementById(oDragShapeDom.id).setSelectable(true);
			var updateshapeSpy = sinon.spy(window.oGanttChart.getSelection(), "updateShape");
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			assert.equal(updateshapeSpy.getCall(0).args[2], false, "update shape called with false");
			updateshapeSpy.restore();
		}.bind(this));
	});

	QUnit.test("Drag shape when shape is not selectable" ,function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oDragShapeDom = this.getDoms().draggedShape;
			Element.getElementById(oDragShapeDom.id).setSelectable(false);
			var updateshapeSpy = sinon.spy(window.oGanttChart.getSelection(), "updateShape");
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			assert.equal(updateshapeSpy.getCall(0).args[2], true, "update shape called with true");
			updateshapeSpy.restore();
		}.bind(this));
	});
	QUnit.module("Functions - Lines - GanttDragDropExtension", {
		beforeEach: function(assert){
			//utils.createGantt(true, fnCreateShapeBindingSettings());
			this.oShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						id: "r1",
						shapeId: "r1",
						x: 0,
						y: 0,
						rx: 10,
						ry: 10
					}),
					new BaseRectangle({
						id: "r2",
						shapeId: "r2",
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
		getSvgOffset: function() {
			var popoverExt = window.oGanttChart._getPopoverExtension(),
				$svgCtn = jQuery(popoverExt.getDomRefs().header),
				svgOffset = $svgCtn.offset(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top;

			return {left: iSvgLeft, top: iSvgTop};
		},
		getDoms: function() {

			return {
				chart: jQuery(".sapGanttChartSvg").get(0),
				header: jQuery(".sapGanttChartHeaderSvg").get(0),
				table: jQuery(".sapGanttChartLayoutBG").get(0),
				adhocMarker: jQuery("path.sapGanntChartMarkerCursorPointer").get(0),
				deltaMarker: jQuery('rect.sapGanntChartMarkerCursorPointer').get(0),
				ghost: jQuery(document.getElementById("sapGanttDragGhostWrapper"))
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
		getMouseEvent: function(event, oTarget, x, y) {
			var oEvent = jQuery.Event({type : event});
			oEvent.target = oTarget;
			var oParams = this.createEventParam(x,y);
			if (oParams) {
				for (var x in oParams) {
					oEvent[x] = oParams[x];
					oEvent.originalEvent[x] = oParams[x];
				}
			}
			return oEvent;
		},
		afterEach: function(assert) {
			this.oGanttChart.destroy(true/**bSuppressInvalidate*/);
			this.oGanttChart = null;
		}
	});

	QUnit.test("DeltaLine Chart Area position", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oChartDeltaLineClass = this.getDoms().chart.children[0].getAttribute("class");
			assert.ok(oChartDeltaLineClass.indexOf("sapGanttChartAreaDeltaLine") == 0, "Delta Line Chart Area is the first element.");
			done();
		}.bind(this));
	});

	QUnit.test("isValidDropZoneForLines", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oEvent = {};
			var oChart = this.getDoms().chart;
			var oHeader = this.getDoms().header;
			var oTable = this.getDoms().table;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			oEvent.target = oChart;
			assert.strictEqual(dragDropExt.isValidDropZoneForLines(oEvent), true, "Chart is valid drop area");
			oEvent.target = oHeader;
			assert.strictEqual(dragDropExt.isValidDropZoneForLines(oEvent), true, "Header is valid drop area");
			oEvent.target = oTable;
			assert.strictEqual(dragDropExt.isValidDropZoneForLines(oEvent), false, "Table is an invalid drop area");
		}.bind(this));
	});

	QUnit.test("isAdhocLineDraggable", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oEvent = {};
			var adhocMarkar = this.getDoms().adhocMarker;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			oEvent.target = adhocMarkar;
			assert.strictEqual(dragDropExt.isAdhocLineDraggable(oEvent), false, "By default adhoc Line is not Draggable");
			var adhocLines = this.oGanttChart.getSimpleAdhocLines()[0];
			adhocLines.setDraggable(true);
			adhocLines._setSelected(true);
			assert.strictEqual(dragDropExt.isAdhocLineDraggable(oEvent), true, "Selected adhocLine can be dragged if draggable property is set to true");
			adhocLines._setSelected(false);
			assert.strictEqual(dragDropExt.isAdhocLineDraggable(oEvent), false, "Unselected adhocLine cannot be dragged if draggable property is set to true");
		}.bind(this));
	});

	QUnit.test("isDeltaLineDraggable", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oEvent = {};
			var deltaMarker = this.getDoms().deltaMarker;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			oEvent.target = deltaMarker;
			assert.strictEqual(dragDropExt.isDeltaLineDraggable(oEvent), false, "By default Delta Line is not Draggable");
			var deltaLines = this.oGanttChart.getDeltaLines()[0];
			deltaLines.setDraggable(true);
			deltaLines._setIsSelected(true);
			assert.strictEqual(dragDropExt.isDeltaLineDraggable(oEvent), true, "Selected delta line can be dragged if draggable property is set to true");
			deltaLines._setIsSelected(false);
			assert.strictEqual(dragDropExt.isDeltaLineDraggable(oEvent), false, "Unselected adhocLine cannot be dragged if draggable property is set to true");
		}.bind(this));
	});

	QUnit.test("Adhoc Line Drag", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oTarget = this.getDoms().adhocMarker;
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Before mousedown: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.dragGhost, null, "Before mousedown: Ghost image is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Before mousedown: mDragPoint.shapeX is undefined");

			jQuery(oTarget).control(0, true).getParent().setDraggable(true);
			jQuery(oTarget).control(0, true).getParent()._setSelected(true);
			var mouseDownEvent = this.getMouseEvent("mousedown", oTarget, iSvgLeft, iPageY);
			dragDropExt.onAdhocMarkerMouseDown(mouseDownEvent);
			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");
			assert.ok(dragDropExt.mDragPoint.shapeX != undefined,"After mousedown: mDragPoint.shapeX is not undefined");
			assert.strictEqual(dragDropExt.adhocLineDrag, true, "AdhocLineDrag falg is set to true");

			var mouseMoveEvent = this.getMouseEvent("mousemove", oTarget, iSvgLeft + 10, iPageY);
			dragDropExt.onAdhocLineMove(mouseMoveEvent);
			assert.strictEqual(dragDropExt.adhocLineDragStart, true, "adhocLineDragStart flag is set to true");
			assert.ok(dragDropExt.dragGhost != null,"Ghost image is not null after drag started");
			assert.strictEqual(dragDropExt.isAdhocLineDragging(), true, "Adhocline dragging started");

			var mouseUpEvent = this.getMouseEvent("mouseup", oTarget, iSvgLeft + 10, iPageY);
			dragDropExt.onAdhocLineDrop(mouseUpEvent);
			assert.strictEqual(dragDropExt.dragGhost, null, "after mouseup: Ghost image is null");
			dragDropExt._initDragStates();
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "after mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "after mouseup: mDragPoint.shapeX is undefined");
		}.bind(this));
	});

	QUnit.test("Delta Line Drag", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oTarget = this.getDoms().deltaMarker;
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Before mousedown: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.dragGhost, null, "Before mousedown: Ghost image is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Before mousedown: mDragPoint.shapeX is undefined");

			jQuery(oTarget).control(0, true).getParent().setDraggable(true);
			jQuery(oTarget).control(0, true).getParent()._setIsSelected(true);
			var mouseDownEvent = this.getMouseEvent("mousedown", oTarget, iSvgLeft, iPageY);
			dragDropExt.onDeltaAreaMouseDown(mouseDownEvent);
			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");
			assert.ok(dragDropExt.mDragPoint.shapeX != undefined,"After mousedown: mDragPoint.shapeX is not undefined");
			assert.strictEqual(dragDropExt.deltaLineDrag, true, "deltaLineDrag falg is set to true");

			var mouseMoveEvent = this.getMouseEvent("mousemove", oTarget, iSvgLeft + 10, iPageY);
			dragDropExt.onDeltaLineMove(mouseMoveEvent);
			assert.strictEqual(dragDropExt.deltaLineDragStart, true, "deltaLineDragStart falg is set to true");
			assert.ok(dragDropExt.dragGhost != null,"Ghost image is not null after drag started");
			assert.strictEqual(dragDropExt.isDeltaLineDragging(), true, "Deltaline dragging started");

			var mouseUpEvent = this.getMouseEvent("mouseup", oTarget, iSvgLeft + 10, iPageY);
			dragDropExt.onDeltaLineDrop(mouseUpEvent);
			assert.strictEqual(dragDropExt.dragGhost, null, "after mouseup: Ghost image is null");
			dragDropExt._initDragStates();
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "after mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "after mouseup: mDragPoint.shapeX is undefined");
		}.bind(this));
	});

	QUnit.module("GanttChartContainer: Functions - GanttDragDropExtension ", {
		beforeEach: function(assert){
			utils.createGantt(true, fnCreateShapeBindingSettings());
			this.oGanttChartContainer = new GanttChartContainer({
				ganttCharts : [
					window.oGanttChart
				],
				toolbar: new ContainerToolbar({

				})
			});
			this.oGanttChartContainer.placeAt("qunit-fixture");
			this.oGanttChart = window.oGanttChart;
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
			return {
				sourceRow:  jQuery("rect[data-sap-ui-index=0]").get(0),
				droppedRow:  jQuery("rect[data-sap-ui-index=4]").get(0),
				draggedShape: jQuery("rect[data-sap-gantt-shape-id=0]").get(0),
				header: jQuery(".sapGanttChartHeader").get(0),
				ghost: jQuery(document.getElementById("sapGanttDragGhostWrapper"))
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
		},
		afterEach: function(assert) {
			utils.destroyGantt();
			this.oGanttChartContainer.destroy();
		}
	});

	QUnit.test("Drag In Free Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oSourceRowDom = this.getDoms().sourceRow;
			var oHeader = this.getDoms().header;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");
			var fnIsPointerInGanttChart = sinon.stub(window.oGanttChart._getPointerExtension(), "isPointerInGanttChart").returns(false);

			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Before mousedown: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "Before mousedown: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Before mousedown: mDragPoint.shapeX is undefined");

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.equal(oSourceRowDom.getAttribute("data-sap-ui-index"), 0, "Mouse Pointer is at row 0 when shape is selected.");

			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");

			var sShapUid = "PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]";
			assert.strictEqual(dragDropExt.oLastDraggedShapeData.shapeUid, sShapUid, "After mousedown: The last dragged shape uid is '" + sShapUid + "'");
			assert.strictEqual(jQuery(dragDropExt.oMouseDownTarget).data("sapGanttShapeId"), 0, "After mousedown: The loMouseDownTarget shape id is '0'");
			assert.ok(dragDropExt.mDragPoint.shapeX > 0, "After mousedown: mDragPoint.shapeX > 0");

			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			this.mouseup(oHeader, iSvgLeft + 16, iPageY);
			assert.equal(fnGetGhostTime.callCount, 0, "Before mouseup, drag not ended, no shapeDrop event fired");

			oDragShapeDom = this.getDoms().draggedShape;
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iSvgTop - 30);
			this.mouseup(oHeader, iSvgLeft + 20, iSvgTop - 30);
			assert.equal(fnGetGhostTime.callCount, 1, "Drop to invalide area, no shapeDrop event fired");
			oDragShapeDom = this.getDoms().draggedShape;
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY);

			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");

			var iOriginalShapeDuration = dragDropExt.oLastDraggedShapeData.endTime - dragDropExt.oLastDraggedShapeData.startTime;
			var iCurrentShapeDuration = fnGetGhostTime.returnValues[0].endTime - fnGetGhostTime.returnValues[0].time;
			assert.equal(iOriginalShapeDuration, iCurrentShapeDuration, "Shape Duration remains same on drag");

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 50, iPageY - 30);
			assert.equal(window.oGanttChart._getPointerExtension().isPointerInGanttChart() , false, "Pointer not in GanttChart");
			assert.equal(document.body.style.cursor, "not-allowed", "Document Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttSvg.style.cursor, "not-allowed", "Gantt Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().headerSvg.style.cursor, "not-allowed", "GanttHeader Cursor changed to not-allowed");

			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);

			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 50, iPageY - 70);
			assert.equal(window.oGanttChart._getPointerExtension().isPointerInGanttChart() , false, "Pointer not in GanttChart");
			assert.equal(document.body.style.cursor, "not-allowed", "Document Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttSvg.style.cursor, "not-allowed", "Gantt Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().headerSvg.style.cursor, "not-allowed", "GanttHeader Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttChartContainerToolbar.style.pointerEvents, "none", "Gantt Container Toolbar changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().gantt.style.pointerEvents, "auto", "Gantt Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttChart.style.pointerEvents, "none", "Entire GanttChart Cursor changed to not-allowed");
			fnIsPointerInGanttChart.restore();
			this.mousemove(oDragShapeDom, iSvgLeft + 50, iPageY + 100);
			assert.equal(document.body.style.cursor, "move", "Document Cursor changed to not-allowed");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttSvg.style.cursor, "move", "Gantt Cursor changed back");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttChartContainerToolbar.style.pointerEvents, "", "Gantt Container Toolbar changed back");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().gantt.style.pointerEvents, "", "Gantt Cursor changed back");
			assert.equal(window.oGanttChart._getDragDropExtension().getDomRefs().ganttChart.style.pointerEvents, "", "Entire GanttChart Cursor changed back");
			this.mouseup(oDragShapeDom, iSvgLeft + 50, iPageY + 100);

			// set shape undraggable
			var oDraggedShape = dragDropExt.getShapeElementByTarget(oDragShapeDom);
			assert.ok(oDraggedShape !== null, "Dragged shape is not null");
			oDraggedShape.setDraggable(false);
			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			return new Promise(function (fnResolve) {
				assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mousedown on a undraggable shape: oMouseDownTarget is null");
				assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mousedown on a undraggable shape: oLastDraggedShapeData is null");
				assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mousedown on a undraggable shape: mDragPoint.shapeX is undefined");
				fnResolve();
			});
		}.bind(this));

	});

	QUnit.module("GanttChartWithTable Functions - GanttDragDropExtension with BaseGroup", {
		beforeEach: function(assert){
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new  BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						connectable: true,
						draggable:true,
						shapes: [ new BaseRectangle({shapeId: "rect01", selectable: true,time:"{StartDate}",draggable:true,connectable: true,endTime:"{EndDate}"}),
						new BaseText({shapeId: "text01", selectable: true,	text: "Test1",isLabel:true,draggable:true,connectable: true,time: "{EndDate}"})]
					})
				]
			}));
			this.oGantt.setSelectOnlyGraphicalShape(true);
			this.oGantt.placeAt("qunit-fixture");
		},
		getSvgOffset: function() {
			var popoverExt = window.oGanttChart._getPopoverExtension(),
				$svgCtn = popoverExt.getDomRefs().gantt,
				$vsb = this.oGantt.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar),
				svgOffset = $svgCtn.getBoundingClientRect(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top,
				iSvgRight = iSvgLeft + $svgCtn.width - $vsb.clientWidth;

			return {left: iSvgLeft, top: iSvgTop, right: iSvgRight};
		},
		getDoms: function() {

			return {
				sourceRow: document.querySelector("rect[data-sap-ui-index=0]"),
				droppedRow: document.querySelector("rect[data-sap-ui-index=4]"),
				draggedShape: document.querySelector("g[data-sap-gantt-shape-id='0']"),
				header:document.querySelector(".sapGanttChartHeader"),
				ghost: document.getElementById("sapGanttDragGhostWrapper")
			};
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
		afterEach: function(assert) {
			utils.destroyGantt();
		}
	});

	QUnit.test("ghost shapes without label on them while dragging multiple shapes", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var oShape1 = document.querySelector("g[data-sap-gantt-shape-id='0']");
			var oShape2 = document.querySelector("g[data-sap-gantt-shape-id='1']");
			var oShape3 = document.querySelector("g[data-sap-gantt-shape-id='2']");

			var oShape1Uid = Element.getElementById(oShape1.id).getShapeUid();
			var oShape2Uid = Element.getElementById(oShape2.id).getShapeUid();
			var oShape3Uid = Element.getElementById(oShape3.id).getShapeUid();
			window.oGanttChart.setSelectedShapeUid([oShape1Uid, oShape2Uid, oShape3Uid]);

			this.mousedown(oShape1, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1, iSvgLeft + 250, iPageY);
			this.mousemove(oShape1, iSvgLeft + 350, iPageY);

			var done = assert.async();
			var aGhosts = document.getElementsByClassName("sapGanttDragGhost");
			assert.equal(aGhosts.length , 3, "Ghosts of all the selected shapes");
			var aObjectCountPopover = document.getElementsByClassName("sapGanttPopoverObjectCount");
			assert.equal(aObjectCountPopover.length , 1, "Object count popover visible");
			var drag = window.oGanttChart._getDragDropExtension();
			assert.equal(drag.oTargetDom,oShape1.children[0],"Ghost dom contains nonlabel values");
			this.mouseup(oShape1, iSvgLeft + 75, iPageY);
			done();
		}.bind(this));
	});

	QUnit.module("Time data update for baseGroup shape in GanttDragDropExtension", {
		beforeEach: function(assert){
			this.oStartTime = new Date();
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new  BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						connectable: true,
						draggable:true,
						shapes: [ new BaseRectangle({shapeId: "rect01", selectable: true,time:new Date(this.oStartTime.getTime() + 48 * 3600000),draggable:true,connectable: true,endTime:new Date(this.oStartTime.getTime() + 78 * 3600000)}),
						new BaseText({shapeId: "text01", selectable: true,	text: "Test1",isLabel:true,draggable:true,connectable: true,time: new Date(this.oStartTime.getTime() + 78 * 3600000)})]
					})
				]
			}));
			this.oGantt.setSelectOnlyGraphicalShape(true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function(assert) {
			utils.destroyGantt();
		}
	});

	QUnit.test("Start and end time update for BaseGroup shape from it's child elements", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGantt._getDragDropExtension();
			var oShape1 = document.querySelector("g[data-sap-gantt-shape-id='0']");
			var oShape1Uid = Element.getElementById(oShape1.id).getShapeUid();
			this.oGantt.setSelectedShapeUid([oShape1Uid]);
			var selectedShapeDate = dragDropExt._getDraggedShapeDates();
			assert.deepEqual(selectedShapeDate[oShape1Uid].time.getTime(), new Date(this.oStartTime.getTime() + 48 * 3600000).getTime(), "Start time of BaseGroup has been set");
			assert.deepEqual(selectedShapeDate[oShape1Uid].endTime.getTime(), new Date(this.oStartTime.getTime() + 78 * 3600000).getTime(), "End time of BaseGroup has been set");
		}.bind(this));
	});

	QUnit.module("Test childElement property", {
		beforeEach: function(assert){
			var oStartTime = new Date();
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseGroup({
						selected: false,
						selectable: true,
						draggable: true,
						shapeId: "0",
						shapes: [
							new BaseConditionalShape({
								draggable: true,
								selectable: true,
								activeShape: 1,
								shapeId: "0",
								shapes: [
									new BaseRectangle({
										id: "t1",
										shapeId: "t1",
										time: new Date(oStartTime.getTime() + 48 * 3600000),
										endTime: new Date(oStartTime.getTime() + 72 * 3600000),
										draggable: true,
										selectable: true
									}),
									new BaseGroup({
										draggable: true,
										selectable: true,
										shapeId: "1",
										shapes: [
											new BaseRectangle({
												id: "r3",
												shapeId: "r3",
												time: new Date(oStartTime.getTime() + 24 * 3600000),
												endTime: new Date(oStartTime.getTime() + 48 * 3600000),
												draggable: true,
												selectable: true
											})
										]
									})
								]
							})
						]
					})
				]
			}));
			this.oGantt.placeAt("qunit-fixture");
		},
		getSvgOffset: function() {
			var popoverExt = window.oGanttChart._getPopoverExtension(),
				$svgCtn = popoverExt.getDomRefs().gantt,
				$vsb = this.oGantt.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar),
				svgOffset = $svgCtn.getBoundingClientRect(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top,
				iSvgRight = iSvgLeft + $svgCtn.width - $vsb.clientWidth;

			return {left: iSvgLeft, top: iSvgTop, right: iSvgRight};
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
		afterEach: function(assert) {
			utils.destroyGantt();
		}
	});

	QUnit.test("Test drag and drop if childElement of a basegroup is a BaseConditional shape", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var oShape1 = document.querySelector("g[data-sap-gantt-shape-id='0']");

			this.mousedown(oShape1, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1, iSvgLeft + 250, iPageY);
			this.mousemove(oShape1, iSvgLeft + 350, iPageY);

			var done = assert.async();
			var aGhosts = document.getElementsByClassName("sapGanttDragGhost");
			assert.equal(aGhosts.length , 1, "Ghosts of the selected baseconditional shape");
			var dragDropExt = this.oGantt._getDragDropExtension();
			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");
			this.mouseup(oShape1, iSvgLeft + 75, iPageY);
			done();
		}.bind(this));
	});

	QUnit.module("GanttDragDropExtension - Ghost Configuration", {
		beforeEach: function(assert){
			this.oStartTime = new Date();
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new  BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						connectable: true,
						draggable:true,
						shapes: [
							new BaseRectangle({
								shapeId: "rect01",
								fill:"@sapUiChartPaletteQualitativeHue6",
								selectable: true,
								time: new Date(this.oStartTime.getTime() + 48 * 3600000),
								draggable: true,
								endTime: new Date(this.oStartTime.getTime() + 78 * 3600000),
								styleName: "ghostStyle1"
							}),
							new BaseDiamond({
								shapeId: "diamond01",
								fill:"@sapUiChartPaletteQualitativeHue7",
								selectable: true,
								isLabel: true,
								draggable: true,
								time: new Date(this.oStartTime.getTime() + 78 * 3600000),
								styleName: "ghostStyle12"
							})
						]
					})
				]
			}));
			this.oGantt.addAggregation("shapeStyles",
				new ShapeStyle({
					name: "ghostStyle1",
					eventState: "DragDrop",
					fill: "red",
					stroke: "green",
					strokeWidth: 2,
					strokeDasharray: "2,2",
					textFill: "green"
				})
			);
			this.oGantt.addAggregation("shapeStyles",
				new ShapeStyle({
					name: "ghostStyle2",
					eventState: "DragDrop",
					visible: false
				})
			);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function(assert) {
			utils.destroyGantt();
		},
		getSvgOffset: function() {
			var popoverExt = window.oGanttChart._getPopoverExtension(),
				$svgCtn = popoverExt.getDomRefs().gantt,
				$vsb = this.oGantt.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar),
				svgOffset = $svgCtn.getBoundingClientRect(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top,
				iSvgRight = iSvgLeft + $svgCtn.width - $vsb.clientWidth;

			return {left: iSvgLeft, top: iSvgTop, right: iSvgRight};
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
		}
	});

	QUnit.test("Ghost Config values ", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGantt._getDragDropExtension();
			dragDropExt._oGhostStyleConfigs = dragDropExt._getGhostStyleConfig();
			assert.ok(dragDropExt._oGhostStyleConfigs[window.oGanttChart.getShapeStyles()[0].getName()] != null, "Ghost style config is available with name ghostStyle1");
			assert.ok(dragDropExt._oGhostStyleConfigs[window.oGanttChart.getShapeStyles()[1].getName()] != null, "Ghost style config is available with name ghostStyle2");
			assert.equal(dragDropExt._oGhostStyleConfigs["ghostStyle1"].getFill(), "red", "Ghost style config fill value is red");
			assert.equal(dragDropExt._oGhostStyleConfigs["ghostStyle1"].getStroke(), "green", "Ghost style config stroke value is green");
			assert.equal(dragDropExt._oGhostStyleConfigs["ghostStyle1"].getStrokeWidth(), 2, "Ghost style config stroke width value is 2");
			assert.equal(dragDropExt._oGhostStyleConfigs["ghostStyle1"].getStrokeDasharray(), "2,2", "Ghost style config stroke dash array value is 2,2");
			assert.equal(dragDropExt._oGhostStyleConfigs["ghostStyle1"].getTextFill(), "green", "Ghost style config text fill value is green");
			assert.equal(dragDropExt._oGhostStyleConfigs["ghostStyle1"].getVisible(), true, "Ghost style config visible value is true");
			assert.equal(dragDropExt._oGhostStyleConfigs["ghostStyle2"].getVisible(), false, "Ghost style config visible value is false");
		}.bind(this));
	});

	QUnit.test("Test Updated ghost image", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var oShape1 = document.querySelector("g[data-sap-gantt-shape-id='0']");

			this.mousedown(oShape1, iSvgLeft + 75, iPageY);
			this.mousemove(oShape1, iSvgLeft + 100, iPageY);
			this.mousemove(oShape1, iSvgLeft + 150, iPageY);

			var done = assert.async();
			var aGhosts = document.getElementsByClassName("sapGanttDragGhost");
			assert.equal(aGhosts.length , 1, "Ghosts of the selected shape");
			var dragDropExt = this.oGantt._getDragDropExtension();
			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");
			this.mouseup(oShape1, iSvgLeft + 75, iPageY);
			done();
		}.bind(this));
	});
});
