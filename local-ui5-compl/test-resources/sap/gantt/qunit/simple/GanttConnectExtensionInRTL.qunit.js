/*global QUnit*/
sap.ui.define([
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/core/Core",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/gantt/simple/test/nextUIUpdate"
], function (BaseRectangle, GanttRowSettings, qunits, utils,Core, GanttChartConfigurationUtils,
	nextUIUpdate) {
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
					selectable: true,
					connectable: true
				})
			]
		});
	};


	QUnit.module("Interaction - GanttConnectExtension - RTL", {
		beforeEach: async function() {
			GanttChartConfigurationUtils.setRTL(true);
			await nextUIUpdate();
			this.oGanttChart = utils.createGantt(true, fnCreateShapeBindingSettings());
			this.oGanttChart.placeAt("qunit-fixture");
		},
		getSvgOffset: function() {
			var popoverExt = this.oGanttChart._getPopoverExtension(),
				$svgCtn = jQuery(popoverExt.getDomRefs().gantt),
				$vsb = jQuery(this.oGanttChart.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar)),
				svgOffset = $svgCtn.offset(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top,
				iSvgRight = iSvgLeft + $svgCtn.width() - $vsb.width();

			return {left: iSvgLeft, top: iSvgTop, right: iSvgRight};
		},
		getDoms: function() {
			var oDragShapeDom = jQuery("rect[data-sap-gantt-shape-id=0]").get(0);
			var oShape = jQuery(oDragShapeDom).control(0, true);
			var sRightTriggerSelector = ".sapGanttChartSelection g[sap-gantt-select-for='" + oShape.getShapeUid() + "'].resizeContainer .shapeConnectTrigger.rightTrigger";
			var oDestShapeDom = jQuery("rect[data-sap-gantt-shape-id=1]").get(0);
			var oDestShape = jQuery(oDestShapeDom).control(0, true);
			var sDestIndicatorSelector = ".sapGanttChartShapeConnect g[sap-gantt-shape-connect-for='" + oDestShape.getId() + "'].shapeConnectContainer .rightIndicator";

			return {
				svg: this.oGanttChart._getConnectExtension().getDomRefs().ganttSvg,
				sourceShape: oDragShapeDom,
				rightTrigger: jQuery(sRightTriggerSelector).get(0),
				rightIndicator: jQuery(sDestIndicatorSelector).get(0)
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
			qunits.triggerEvent("mousedown", oShape, oEventParams);
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qunits.triggerEvent("mousemove", oShape, oEventParams);
		},
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qunits.triggerEvent("mouseup", oShape, oEventParams);
		},
		afterEach: async function(assert) {
			utils.destroyGantt();
			GanttChartConfigurationUtils.setRTL(false);
			await nextUIUpdate();
		}
	});

	QUnit.test("Connect - xBias/yBias RTL", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.oGanttChart).then(function () {
				var oSvgOffset = this.getSvgOffset();
				var iSvgLeft = oSvgOffset.left;
				var iSvgTop = oSvgOffset.top;
				var iPageY = iSvgTop + 30;

				this.mousemove(document, iSvgLeft + 216, iPageY);

				//select shape
				var oShape = jQuery(this.getDoms().sourceShape).control(0, true);
				var sRectFirstShapeElementId = oShape.getShapeUid();
				oShape.setSelected(true);

				var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);

				var $LineTriggerLeft = $ShapeSelectionRoot.find(".rectTrigger.leftTrigger");
				var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

				var $LineTriggerRight = $ShapeSelectionRoot.find(".rectTrigger.rightTrigger");
				var oPositionTriggerRightX = $LineTriggerRight.position().left;
				var oPositionTriggerRightY = $LineTriggerRight.position().top;

				oShape.setYBias(-5);
				oShape.setXBias(10);
				return utils.waitForGanttRendered(this.oGanttChart).then(async function () {
					await nextUIUpdate();
						var oShape = jQuery(this.getDoms().sourceShape).control(0, true);
						var sRectFirstShapeElementId = oShape.getShapeUid();
						oShape.setSelected(true);
						var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
						var $ShapeSelectionRoot = jQuery(oSelectionDom);

						var $LineTriggerLeft = $ShapeSelectionRoot.find(".rectTrigger.leftTrigger");
						var oNewPositionTriggerLeftX = $LineTriggerLeft.position().left;
						var oNewPositionTriggerLeftY = $LineTriggerLeft.position().top;

						var $LineTriggerRight = $ShapeSelectionRoot.find(".rectTrigger.rightTrigger");
						var oNewPositionTriggerRightX = $LineTriggerRight.position().left;
						var oNewPositionTriggerRightY = $LineTriggerRight.position().top;

						assert.equal(oPositionTriggerLeftX - oNewPositionTriggerLeftX , 10, "LeftTriggers x coordinate are places correctly");
						assert.equal(oPositionTriggerLeftY - oNewPositionTriggerLeftY, 5, "LeftTriggers y coordinate are places correctly");

						assert.equal(oPositionTriggerRightX - oNewPositionTriggerRightX, 10, "LeftTriggers x coordinate are places correctly");
						assert.equal(oPositionTriggerRightY - oNewPositionTriggerRightY, 5, "LeftTriggers y coordinate are places correctly");
						done();
			}.bind(this));

		}.bind(this));
	});

});
