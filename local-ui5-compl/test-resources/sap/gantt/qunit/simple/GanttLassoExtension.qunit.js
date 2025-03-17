/*global QUnit, sinon */
sap.ui.define([
	"sap/gantt/simple/GanttLassoExtension",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseText"
], function (GanttLassoExtension, BaseRectangle, GanttRowSettings, qunits, utils,BaseGroup,BaseText) {
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

	QUnit.module("Basic - GanttLassoExtension");

	QUnit.test("default values", function (assert) {
		var oLassoExt = new GanttLassoExtension({});
		assert.strictEqual(oLassoExt.mDom.lassoRect, undefined, "Default mDom.lassoRect is undefined");
		assert.strictEqual(oLassoExt.isLassoDrawing(), false, "Default _bShapeConnecting is false");
		assert.strictEqual(oLassoExt._oLassoStartPoint.x, undefined, "Default _oLassoStartPoint.x is undefined");
		assert.strictEqual(oLassoExt._oLassoStartPoint.y, undefined, "Default _oLassoStartPoint.y is undefined");
	});

	QUnit.module("Interaction - GanttLassoExtension", {
		beforeEach: function() {
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
			var oShapeDom = jQuery(".baseShapeSelection").get(5);
			var oShape = jQuery(oShapeDom).control(0, true);
			var oRowArea = jQuery(".sapGanttBackgroundSVGRow").get(0);
			return {
				svg: this.oGanttChart._getLassoExtension().getDomRefs().ganttSvg,
				shapeDom: oShapeDom,
				shape: oShape,
				rowArea: oRowArea
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
		afterEach: function(assert) {
			utils.destroyGantt();
		}
	});

	QUnit.test("Lasso in different selection modes", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 30;
			var oSelection = this.oGanttChart.getSelection();

			this.mousemove(document, iSvgLeft + 216, iPageY);

			var lassoExt = this.oGanttChart._getLassoExtension();

			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Before mousedown: _bLassoDrawing is false");
			assert.strictEqual(lassoExt.mDom.lassoRect, undefined, "Before mousedown: mDom.lassoRect is undefined");

			var oRowArea = this.getDoms().rowArea;
			var oSvg = this.getDoms().svg;
			var oShapeDom = this.getDoms().shapeDom;

			oSelection.setSelectionMode("Single");
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start in Single shape selecion mode");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

			oSelection.setSelectionMode("Multiple");
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start in Multiple shape selecion mode");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

			oSelection.setSelectionMode("MultiWithKeyboard");
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start in MultiWithKeyboard shape selecion mode");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

			oSelection.setSelectionMode("MultipleWithLasso");
			this.mousedown(oShapeDom, iSvgLeft + 115, iPageY);
			this.mousemove(this.getDoms().svg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start as starting point is on a shape");
			this.mouseup(this.getDoms().svg, iSvgLeft + 650, iPageY + 150);

			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20, 2);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start because mousedown triggered by right mouse button");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), true, "Lasso started in MultipleWithLasso shape selecion mode");
			assert.strictEqual(jQuery(".lassoRect").length, 1, "Lasso DOM exists");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

			oSelection.setSelectionMode("MultiWithKeyboardAndLasso");
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), true, "Lasso started in MultiWithKeyboardAndLasso shape selecion mode");
			assert.strictEqual(jQuery(".lassoRect").length, 1, "Lasso DOM exists");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);
		}.bind(this));
	});

	QUnit.test("Test Lasso in different selection modes doesn't selects non selectable shapes", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 30;
			this.oSelection = this.oGanttChart.getSelection();
			this.oShape2 = this.oGanttChart.getTable().getRows()[1].getAggregation("_settings").getShapes1()[0];
			this.oShape2.setProperty("selectable", false);
			return utils.waitForGanttRendered(this.oGanttChart).then(function () {
				setTimeout(function(){
					this.mousemove(document, iSvgLeft + 216, iPageY);

					var lassoExt = this.oGanttChart._getLassoExtension();

					assert.strictEqual(lassoExt.isLassoDrawing(), false, "Before mousedown: _bLassoDrawing is false");
					assert.strictEqual(lassoExt.mDom.lassoRect, undefined, "Before mousedown: mDom.lassoRect is undefined");

					var oRowArea = this.getDoms().rowArea;
					var oSvg = this.getDoms().svg;
					var oShapeDom = this.getDoms().shapeDom;

					this.oSelection.setSelectionMode("MultipleWithLasso");
					this.mousedown(oShapeDom, iSvgLeft + 115, iPageY);
					this.mousemove(this.getDoms().svg, iSvgLeft + 650, iPageY + 150);
					assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start as starting point is on a shape");
					this.mouseup(this.getDoms().svg, iSvgLeft + 650, iPageY + 150);

					this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20, 2);
					this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
					assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start because mousedown triggered by right mouse button");
					this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

					this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
					this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
					assert.strictEqual(lassoExt.isLassoDrawing(), true, "Lasso started in MultipleWithLasso shape selecion mode");
					assert.strictEqual(jQuery(".lassoRect").length, 1, "Lasso DOM exists");
					this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);
					return utils.waitForGanttRendered(this.oGanttChart).then(function () {
						setTimeout(function(){
							this.aSelectedShapeUids = this.oGanttChart.getSelectedShapeUid();
							this.sShapeUid = this.oShape2.getShapeUid();
							this.aSelectedShapeUids.forEach(function (sShapeId) {
								assert.notEqual(sShapeId, this.sShapeUid, "Selected shape is not the shape with selectable set to false ");
							}.bind(this));
							done();
						}.bind(this), 500);
					}.bind(this));
				}.bind(this), 500);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Lasso shape selection", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 30;
			var oSelection = this.oGanttChart.getSelection();

			this.mousemove(document, iSvgLeft + 216, iPageY);

			var oRowArea = this.getDoms().rowArea;
			var oSvg = this.getDoms().svg;
			var oShape = this.getDoms().shape;
			var oShapeDom = this.getDoms().shapeDom;

			var oShapeUid1 = oShape.getShapeUid();
			var oShapeUid2 = jQuery(jQuery(".baseShapeSelection").get(11)).control(0, true).getShapeUid();

			oSelection.setSelectionMode("MultipleWithLasso");
			this.oGanttChart.setSelectedShapeUid([oShapeUid1, oShapeUid2]);
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 350, iPageY + 50);
			this.mouseup(oShapeDom, iSvgLeft + 350, iPageY + 50);
			assert.strictEqual(oSelection.allUid().length, 3, "Shapes inside lasso and already selected shapes outside lasso got selected");

			this.oGanttChart.setSelectedShapeUid([oShapeUid1, oShapeUid2]);
			this.oGanttChart.setEnableLassoInvert(true);

			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 350, iPageY + 50);
			this.mouseup(oShapeDom, iSvgLeft + 350, iPageY + 50);
			assert.strictEqual(oSelection.allUid().length, 2, "Already selected shapes inside lasso got deselected when invert is true");

			oSelection.setSelectionMode("MultiWithKeyboardAndLasso");
			this.oGanttChart.setEnableLassoInvert(false);

			this.oGanttChart.setSelectedShapeUid([oShapeUid1, oShapeUid2]);
			this.oGanttChart.attachEventOnce("shapeSelectionChange", function (oEvent) {
				assert.ok(true);
				assert.strictEqual(oEvent.getParameter("shapeUids").length, 0, "ShapeSelectionChange event fired and shapes got deselected");
			});
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);

			this.oGanttChart.setSelectedShapeUid([oShapeUid1, oShapeUid2]);
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			assert.strictEqual(oSelection.allUid().length, 0, "Already selected shapes got deselected as Ctrl isn't pressed");
            this.mousemove(oSvg, iSvgLeft + 250, iPageY + 50);
            this.mousemove(oSvg, iSvgLeft + 350, iPageY + 50);
			this.mouseup(oShapeDom, iSvgLeft + 350, iPageY + 50);
			assert.strictEqual(oSelection.allUid().length, 2, "Shapes inside lasso got selected");

			var oPointerExtension = this.oGanttChart._getPointerExtension();
			var oDomRefs = oPointerExtension.getDomRefs();
			var $svgCtn = jQuery(oDomRefs.gantt);
			var eGanttSvg = jQuery("rect.sapGanttBackgroundSVGRow")[0];
			var oEventParams = {
				button: 0,
				pageX: $svgCtn.offset().left + 20,
				pageY: $svgCtn.offset().top + 100,
				ctrlKey: true
			};
			this.oGanttChart.setShapeSelectionMode("MultiWithKeyboard");
			qunits.triggerEvent("click", eGanttSvg, oEventParams);
			assert.ok(oSelection.allUid().length === 2 && this.oGanttChart.getShapeSelectionMode() === "MultiWithKeyboard", "Already selected shapes remain selected as the Ctrl key is pressed, and the selected mode is MultiWithKeyboard");
			this.oGanttChart.setShapeSelectionMode("MultiWithKeyboardAndLasso");
			qunits.triggerEvent("click", eGanttSvg, oEventParams);
			assert.ok(oSelection.allUid().length === 2 && this.oGanttChart.getShapeSelectionMode() === "MultiWithKeyboardAndLasso", "Already selected shapes remain selected as the Ctrl key pressed, and the selected mode is MultiWithKeyboardAndLasso");

		}.bind(this));
	});

	QUnit.test("Lasso selection on shapes with x and y bias", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			setTimeout(function(){
				var oSvgOffset = this.getSvgOffset();
				var iSvgLeft = oSvgOffset.left;
				var iSvgTop = oSvgOffset.top;
				var iPageY = iSvgTop + 30;
				var oSelection = this.oGanttChart.getSelection();

				var oRowArea = this.getDoms().rowArea;
				var oSvg = this.getDoms().svg;
				var oShapeDom = this.getDoms().shapeDom;

				var oShape = jQuery(jQuery(".baseShapeSelection").get(3)).control(0, true);
				oShape.setXBias(500);
				oShape.setYBias(30);
				oSelection.setSelectionMode("MultipleWithLasso");
				return utils.waitForGanttRendered(this.oGanttChart).then(function () {
					setTimeout(function(){
						this.mousedown(oRowArea, iSvgLeft + 150, iPageY - 20);
						this.mousemove(oSvg, iSvgLeft + 300, iPageY + 25);
						this.mouseup(oShapeDom, iSvgLeft + 300, iPageY + 25);
						assert.strictEqual(oSelection.allUid().length, 0, "Shape with x and y bias not selected when lasso drawn at original position");

						this.oGanttChart.setSelectedShapeUid([]);
						this.mousedown(oRowArea, iSvgLeft + 650, iPageY + 10);
						this.mousemove(oSvg, iSvgLeft + 800, iPageY + 55);
						this.mouseup(oShapeDom, iSvgLeft + 800, iPageY + 55);
						assert.strictEqual(oSelection.allUid().length, 1, "Shape with x and y bias selected when lasso drawn at new position");
						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("Lasso selection on shapes with missing shapeUid", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
				var oSvgOffset = this.getSvgOffset();
				var iSvgLeft = oSvgOffset.left;
				var iSvgTop = oSvgOffset.top;
				var iPageY = iSvgTop + 30;
				var oSelection = this.oGanttChart.getSelection();

				var oRowArea = this.getDoms().rowArea;
				var oSvg = this.getDoms().svg;
				var oShapeDom = this.getDoms().shapeDom;
				var oShape1 = jQuery(jQuery(".baseShapeSelection").get(3)).control(0, true);
				var oShape2 = this.getDoms().shape;

				oSelection.setSelectionMode("MultipleWithLasso");
				sinon.stub(oShape1, "getShapeUid").returns(null);
				sinon.stub(oShape2, "getShapeUid").returns(null);

				this.mousedown(oRowArea, iSvgLeft + 150, iPageY - 20);
				this.mousemove(oSvg, iSvgLeft + 600, iPageY + 85);
				this.mouseup(oShapeDom, iSvgLeft + 600, iPageY + 85);
				assert.strictEqual(oSelection.allUid().length, 3, "Shapes with missing shapeUid selected");
		}.bind(this));
	});

	QUnit.module("Interaction - GanttLassoExtension - Basegroup select only graphical shape", {
		beforeEach: function() {
			var date = new Date();
			var date1 = new Date();
			date1.setDate(date.getDate() + 1);
			this.oRect = new BaseRectangle({shapeId: "rect01", selectable: true,time:date,endTime:date1,fill:"#008FD3",resizable: true});
			this.oText1 = new BaseText({shapeId: "text01", selectable: true,text: "Test1",isLabel:true,time:date1,fill:"#008FD3",resizable: true});
			this.oGanttChart = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new  BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						shapes: [this.oRect,this.oText1],
						fill:"#008FD3",
						resizable: true
					})
				]
			}));
			this.oGanttChart.setSelectOnlyGraphicalShape(true);
			this.oGanttChart.placeAt("qunit-fixture");
		},
		getDoms: function() {
			var oShapeDom = document.querySelectorAll(".baseShapeSelection")[1];
			var oShapeDom1 = document.querySelectorAll(".baseShapeSelection")[2];
			var oRowArea = document.querySelector(".sapGanttBackgroundSVGRow");
			return {
				svg: this.oGanttChart._getLassoExtension().getDomRefs().ganttSvg,
				shapeDom: oShapeDom,
				shapeDom1: oShapeDom1,
				rowArea: oRowArea
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
		afterEach: function(assert) {
			this.oRect = null;
			this.oText1 = null;
			utils.destroyGantt();
		}
	});

	QUnit.test("Lasso starting from shape and label", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oSelection = this.oGanttChart.getSelection();

			var lassoExt = this.oGanttChart._getLassoExtension();
			var oRowArea = this.getDoms().rowArea;
			var oShapeDom = this.getDoms().shapeDom;
			var oShapeDom1 = this.getDoms().shapeDom1;
			var coordinateShapedom = oShapeDom1.getBoundingClientRect();
            var coordinateShapedom1 = oShapeDom1.getBoundingClientRect();
			oSelection.setSelectionMode("MultipleWithLasso");

			this.mousedown(oShapeDom, coordinateShapedom.x,coordinateShapedom.y);
			this.mousemove(this.getDoms().svg, coordinateShapedom.x + 150,  coordinateShapedom.y + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start as starting point is on a shape");
			this.mouseup(this.getDoms().svg, coordinateShapedom.x + 450, coordinateShapedom.y + 150);

			oSelection.updateShape(null, {selected: false,ctrl: false});

			this.mousedown(oRowArea, coordinateShapedom1.x + 10 , coordinateShapedom1.y);
			this.mousemove(this.getDoms().svg, coordinateShapedom1.x + 150,  coordinateShapedom1.y  + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), true, "Lasso started as starting point is on a shape which is label");
			this.mouseup(this.getDoms().svg, coordinateShapedom1.x + 450, coordinateShapedom1.y + 150);

		}.bind(this));
	});

	QUnit.test("Lasso shape selection when label is present", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oSelection = this.oGanttChart.getSelection();
			var oRowArea = this.getDoms().rowArea;
			oSelection.setSelectionMode("MultipleWithLasso");
			var oShapeDom = this.getDoms().shapeDom;
			var oShapeDom1 = this.getDoms().shapeDom1;
			var coordinateShapedom = oShapeDom.getBoundingClientRect();
            var coordinateShapedom1 = oShapeDom1.getBoundingClientRect();

			this.mousedown(oRowArea, coordinateShapedom.x - 1 , coordinateShapedom.y - 1);
			this.mousemove(this.getDoms().svg, coordinateShapedom1.right + 1,  coordinateShapedom1.bottom  + 1);
			this.mouseup(this.getDoms().svg, coordinateShapedom1.right + 1,  coordinateShapedom1.bottom  + 1);
			assert.strictEqual(oSelection.allUid().length, 1, "Shapes inside lasso got selected as lasso included part of non-label shape");

			oSelection.updateShape(null, {selected: false,ctrl: false});

			this.mousedown(oRowArea, coordinateShapedom1.x + 10, coordinateShapedom1.y);
			this.mousemove(this.getDoms().svg, coordinateShapedom1.right + 1,  coordinateShapedom1.bottom  + 1);
			this.mouseup(this.getDoms().svg, coordinateShapedom1.right + 1, coordinateShapedom1.bottom + 1);
			assert.strictEqual(oSelection.allUid().length, 0, "Shapes inside lasso wont get selected as lasso  not including any part of non-label shape");

		}.bind(this));
	});

	QUnit.test("Lasso shape selection when baseGroup shapes have biases", function (assert) {
		this.oRect.setYBias(-15);
		this.oRect.setXBias(-10);
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oSelection = this.oGanttChart.getSelection();
			var oRowArea = this.getDoms().rowArea;
			oSelection.setSelectionMode("MultipleWithLasso");
			var oShapeDom = this.getDoms().shapeDom;
			var coordinateShapedom = oShapeDom.getBoundingClientRect();

			this.mousedown(oRowArea, coordinateShapedom.x - 1 , coordinateShapedom.y - 1);
			this.mousemove(this.getDoms().svg, coordinateShapedom.x + 10,  coordinateShapedom.y  + 10);
			this.mouseup(this.getDoms().svg, coordinateShapedom.x + 10,  coordinateShapedom.y  + 10);
			assert.strictEqual(oSelection.allUid().length, 1, "Shapes inside lasso should get selected");
		}.bind(this));
	});
});