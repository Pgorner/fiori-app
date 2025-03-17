/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Element"
], function (BaseRectangle, GanttRowSettings, qutils, utils, GanttChartConfigurationUtils, Element) {
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

    QUnit.test("Drag with SnapMode - RTL", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oRTLStub = sinon.stub(GanttChartConfigurationUtils, "getRTL").returns(true);
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgRight = oSvgOffset.right;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			this.oGanttChart.setSnapMode("Left");
			Element.getElementById(oDragShapeDom.id).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgRight - 15, iPageY);
			assert.strictEqual(dragDropExt.isSnapping, false, "Before mouseMove: isSnapping is false");
			this.mousemove(oDragShapeDom, iSvgRight - 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgRight - 35, iPageY);

			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);
            assert.equal(this.oGanttChart.getSnapMode(), "Left", "Snap mode is set to left");
            assert.equal(!!this.oGanttChart._getDragDropExtension().snapTimer, true, "Snap timer fired");
			window.clearTimeout(this.oGanttChart._getDragDropExtension().snapTimer);

			var oEvent = this.createEventParam(iSvgRight - 35, iPageY);
			this.oGanttChart._getDragDropExtension().showGhost(oEvent, true);
			assert.strictEqual(dragDropExt.isSnapping, true, "After mouseMove: isSnapping is true");
			this.mouseup(this.getDoms().draggedShape, iSvgRight - 35 - dragDropExt.snapVal, iPageY);
			oRTLStub.restore();
		}.bind(this));
	});
});