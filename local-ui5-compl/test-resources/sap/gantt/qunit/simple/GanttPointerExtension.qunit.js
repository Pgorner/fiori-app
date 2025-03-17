/*global QUnit, sinon */

sap.ui.define([
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/CoordinateUtils",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/test/nextUIUpdate"
], function(GanttRowSettings, CoordinateUtils, qutils, utils, GanttChartContainer,
	nextUIUpdate) {
	"use strict";

	QUnit.module("Interaction", {
		beforeEach: function(){
			this.sut = utils.createGantt(
				true,
				new GanttRowSettings({
					rowId: "{Id}",
					shapes1: [
						new sap.gantt.simple.BaseRectangle({
							shapeId: "{Id}",
							time: "{StartDate}",
							endTime: "{EndDate}",
							title: "{Name}",
							fill: "#008FD3",
							draggable: true,
							resizable: true,
							selectable: true
						})
					]
				})
			);
			this.sut.setDragOrientation("Free");

			// set the fixture to 300px to show vertical scroll bar
			jQuery(document.getElementById("qunit-fixture")).css("height", "300px");

			this.sut.placeAt("qunit-fixture");
		},

		afterEach: function(assert) {
			utils.destroyGantt();
			jQuery(document.getElementById("qunit-fixture")).css("height", "100%");
		},

		getSvgCtn: function(){
			var oScrollExtension = this.sut._getScrollExtension();
			var $svgCtn = jQuery(oScrollExtension.getDomRefs().gantt);
			var $vsb = jQuery(this.sut.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar));
			return {
				hsb: jQuery(document.getElementById(this.sut.getId() + "-hsb")),
				vsb: $vsb,
				height: $svgCtn.height(),
				left: $svgCtn.offset().left,
				right: $svgCtn.offset().left + $svgCtn.width(),
				top: $svgCtn.offset().top,
				bottom: $svgCtn.offset().top + jQuery(".sapGanttBackgroundTableContent").height(),
				shape: jQuery("rect[data-sap-gantt-shape-id=0]").get(0),
				scrollExtension: oScrollExtension,
				svgGanttCtn: $svgCtn
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

		drag: function(eShape, fromX, fromY, toX, toY){
			var oEventParams = this.createEventParam(fromX, fromY);
			qutils.triggerEvent("mousedown", eShape, oEventParams);
			oEventParams = this.createEventParam(toX, toY);
			qutils.triggerEvent("mousemove", eShape, oEventParams);
			qutils.triggerEvent("mousemove", eShape, oEventParams);
		},

		selectShape: function(oShape) {
			var oEventParams = {
				button: 0,
				pageX: 0,
				pageY: 0
			};
			qutils.triggerEvent("click", oShape, oEventParams);
		},

		mousedown: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousedown", oShape, oEventParams);
		},

		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		}
	});

	QUnit.test("Cursor positions", async function (assert) {
		await nextUIUpdate();

		var mXy = CoordinateUtils.getLatestCursorPosition();
		assert.ok(jQuery.isEmptyObject(mXy), "no x y position");

		var oRect = this.sut.getDomRef().getBoundingClientRect();
		qutils.triggerEvent("mousemove", this.sut.getDomRef(), {
			pageX: oRect.left + 1,
			pageY: oRect.top + 1
		});

		mXy = CoordinateUtils.getLatestCursorPosition();
		assert.ok(!jQuery.isEmptyObject(mXy), "x y position is not empty");
		assert.ok(mXy.pageX != null, "pageX is set");
		assert.ok(mXy.pageY != null, "pageY is set");

		assert.ok(mXy.clientX == null, "clientX value is ignored");
	});

	QUnit.test("gantt mouseover/mouseout", function (assert) {
		var done = assert.async();
		var that = this;
		utils.waitForGanttRendered(this.sut).then(function () {
			var $svg = jQuery(document.getElementById(this.sut.getId() + "-svg")),
				$bgRects = $svg.find("rect.sapGanttBackgroundSVGRow");
			var oFirstRow = that.sut.getTable().getRows()[0].getDomRef();
			oFirstRow.dispatchEvent(new MouseEvent('mouseover'));
			var bTableRowHovered = oFirstRow.classList.contains("sapUiTableRowHvr");
			var bGanttRowHovered = $bgRects.eq(0).hasClass("sapGanttBackgroundSVGRowHovered");
			assert.equal(bTableRowHovered, true, "Table Row 1 is highlighted");
			assert.equal(bGanttRowHovered, true, "Gantt Row 1 is highlighted");


			oFirstRow.dispatchEvent(new MouseEvent('mouseout'));
			bTableRowHovered = oFirstRow.classList.contains("sapUiTableRowHvr");
			bGanttRowHovered = $bgRects.eq(0).hasClass("sapGanttBackgroundSVGRowHovered");
			assert.equal(bTableRowHovered, false, "Table Row 1 is not highlighted anymore");
			assert.equal(bGanttRowHovered, false, "Gantt Row 1 is not highlighted anymore");

			var oAnotherRow = that.sut.getTable().getRows()[3].getDomRef();
			oAnotherRow.dispatchEvent(new MouseEvent('mouseover'));
			bTableRowHovered = oAnotherRow.classList.contains("sapUiTableRowHvr");
			bGanttRowHovered = $bgRects.eq(3).hasClass("sapGanttBackgroundSVGRowHovered");
			assert.equal(bTableRowHovered, true, "Table Row 4 is highlighted");
			assert.equal(bGanttRowHovered, true, "Gantt Row 4 is highlighted");
			done();
		}.bind(this));
	});

	QUnit.test("gantt single/double click, contextmenu", function (assert) {
		var done = assert.async();
		var that = this;
		utils.waitForGanttRendered(this.sut).then(function () {
			var oPointerExtension = that.sut._getPointerExtension();
			var onGanttSingleClickSpy = sinon.spy(oPointerExtension, "onGanttSingleClick");
			var onGanttDoubleClickSpy = sinon.spy(oPointerExtension, "onGanttDoubleClick");
			var fireShapeContextMenuSpy = sinon.spy(that.sut, "fireShapeContextMenu");
			var tableOnAfterRenderingSpy = sinon.spy(that.sut.getTable(), "onAfterRendering");
			var oDomRefs = oPointerExtension.getDomRefs();
			var $svgCtn = jQuery(oDomRefs.gantt);
			var eGanttSvg = jQuery("rect.sapGanttBackgroundSVGRow")[0];
			var oEventParams = {
				button: 0,
				pageX: $svgCtn.offset().left + 20,
				pageY: $svgCtn.offset().top + 100
			};
			oEventParams.clientX = oEventParams.pageX;
			oEventParams.clientY = oEventParams.pageY;
			qutils.triggerEvent("mousemove", document, oEventParams);

			that.sut.attachEventOnce("shapeDoubleClick", function () {
				assert.ok(true, "ShapeDoubleClick event is called");
			});
			that.sut.attachEventOnce("shapePress", function (oEvent) {
				assert.ok(true, "ShapePress event is called");
				assert.equal(oEvent.mParameters.hasOwnProperty("ctrlOrMeta"), true, "ShapePress event has ctrlOrMeta parameter");
				assert.equal(oEvent.mParameters.hasOwnProperty("originEvent"), true, "ShapePress event has original event parameter");
			});
			// ShapePress event is called immediately when double click is disabled
			that.sut.setDisableShapeDoubleClickEvent(true);
			qutils.triggerEvent("click", eGanttSvg, oEventParams);

			var oRowElement = that.sut.getTable().getRows()[0].getDomRef();
			var bRowSelected = oRowElement.classList.contains("sapUiTableRowSel");
			assert.equal(bRowSelected, true, "Target Row 1 selected");

			that.sut.setDisableShapeDoubleClickEvent(false);
			qutils.triggerEvent("dblclick", eGanttSvg, oEventParams);

			that.sut.attachEventOnce("shapeContextMenu", function (oEvent) {
				assert.ok(true, "ShapeContextMenu event is called");
				assert.equal(oEvent.mParameters.hasOwnProperty("originEvent"), true, "ShapeContextMenu event has original event parameter");
			});
			qutils.triggerEvent("contextmenu", eGanttSvg, oEventParams);

			assert.ok(onGanttSingleClickSpy.calledOnce, "Called single click once");
			assert.ok(onGanttDoubleClickSpy.calledOnce, "Called double click once");
			assert.ok(fireShapeContextMenuSpy.calledOnce, "Called contextMenu once");
			assert.ok(tableOnAfterRenderingSpy.notCalled, "Table OnafterRendering not triggered after ContextMenu Selection.");
			that.sut.attachEventOnce("shapeDoubleClick", function () {
				assert.ok(true, "ShapeDoubleClick event is called");
			});
			that.sut.attachEventOnce("shapePress", function () {
				assert.ok(true, "ShapePress event is called");
			});

			that.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setSelectable(false);
			// ShapePress event is called immediately when double click is disabled
			that.sut.setDisableShapeDoubleClickEvent(true);
			qutils.triggerEvent("click", eGanttSvg, oEventParams);
			that.sut.setDisableShapeDoubleClickEvent(false);
			qutils.triggerEvent("dblclick", eGanttSvg, oEventParams);

			onGanttSingleClickSpy.restore();
			onGanttDoubleClickSpy.restore();
			fireShapeContextMenuSpy.restore();
			tableOnAfterRenderingSpy.restore();
			done();
		});
	});

	QUnit.test("auto scroll right", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(async function () {
			var mSvgCtn = this.getSvgCtn();
			this.mousedown(mSvgCtn.shape, 0, 0);
			this.selectShape(mSvgCtn.shape);
			var iMoveX = mSvgCtn.right - 5;
			var iMoveY = mSvgCtn.top + mSvgCtn.height / 2;
			this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + mSvgCtn.height / 2, iMoveX, iMoveY);
			await nextUIUpdate();
			assert.ok(this.sut._getPointerExtension().ifAutoScrollToRight() === true, "auto scroll to right correctly!");
			this.mouseup(document.body, iMoveX, iMoveY);
			done();
		}.bind(this));
	});

	QUnit.test("auto scroll left", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(async function () {
			var mSvgCtn = this.getSvgCtn();
			this.mousedown(mSvgCtn.shape, mSvgCtn.left + 20, mSvgCtn.top + 20);
			this.selectShape(mSvgCtn.shape);
			var iMoveX = mSvgCtn.left + 5;
			var iMoveY = mSvgCtn.top + mSvgCtn.height / 2;
			this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + 20, iMoveX, iMoveY);
			await nextUIUpdate();
			assert.ok(this.sut._getPointerExtension().ifAutoScrollToLeft() === true, "auto scroll to left correctly!");
			this.mouseup(document.body, iMoveX, iMoveY);
			done();
		}.bind(this));
	});

	QUnit.test("auto scroll bottom", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(async function () {
			var fnStopAutoScroll = sinon.spy(this.sut._getDragDropExtension(), "_stopAutoScroll");
			var mSvgCtn = this.getSvgCtn();
			this.selectShape(mSvgCtn.shape);
			var iMoveX = mSvgCtn.left + 100;
			var iMoveY = mSvgCtn.bottom - 5;
			this.sut._getPointerExtension()._bIsMouseOnCorrectRow = false;
			this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + mSvgCtn.height / 2, iMoveX, iMoveY);
			await nextUIUpdate();
			assert.ok(this.sut._getPointerExtension().ifAutoScrollToDown() === true, "auto scroll to bottom correctly!");
			assert.ok(fnStopAutoScroll.notCalled, "auto scrolling happening even if hovered row is not a correct row for drop");
			this.mouseup(document.body, iMoveX, iMoveY);
			var oScrollExtension = mSvgCtn.scrollExtension;
			var nScrollLeft = oScrollExtension._visibleHorizonToScrollLeft();
			var nScrollPosition = nScrollLeft - oScrollExtension.mOffsetWidth.svgOffset;
			assert.ok(!(Math.abs(mSvgCtn.svgGanttCtn.scrollLeft() - nScrollPosition) > (oScrollExtension.getGantt()._iDiff || 0)),"Unnecesarry update of scrollLeft for ganttChart is avoided");
			done();
		}.bind(this));
	});

	QUnit.test("auto scroll top", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(async function () {
			var mSvgCtn = this.getSvgCtn();
			mSvgCtn.vsb.scrollTop(20);
			mSvgCtn = this.getSvgCtn(); // get shape again because DOM element can be replaced
			this.selectShape(mSvgCtn.shape);
			var iMoveX = mSvgCtn.left + 100;
			var iMoveY = mSvgCtn.top + 5;
			this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + mSvgCtn.height / 2, iMoveX, iMoveY);
			await nextUIUpdate();
			assert.ok(this.sut._getPointerExtension().ifAutoScrollToUp() === true, "auto scroll to top correctly!");
			this.mouseup(document.body, iMoveX, iMoveY);
			done();
		}.bind(this));
	});

	QUnit.test("No auto scroll right when drag orientation is vertical", function (assert) {
		var done = assert.async();
		this.sut.setDragOrientation("Vertical");
		utils.waitForGanttRendered(this.sut).then(async function () {
			var mSvgCtn = this.getSvgCtn();
			var iScrollLeftHistory = mSvgCtn.hsb.scrollLeft();
			this.mousedown(mSvgCtn.shape, 0, 0);
			this.selectShape(mSvgCtn.shape);
			var iMoveX = mSvgCtn.right - 5;
			var iMoveY = mSvgCtn.top + mSvgCtn.height / 2;
			this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + mSvgCtn.height / 2, iMoveX, iMoveY);
			await nextUIUpdate();
			var mSvgCtn2 = this.getSvgCtn();
			assert.ok(iScrollLeftHistory === mSvgCtn2.hsb.scrollLeft(), "No auto scrolling to right");
			this.mouseup(document.body, iMoveX, iMoveY);
			done();
		}.bind(this));
	});

	QUnit.test("No auto scroll left when drag orientation is vertical", function (assert) {
		var done = assert.async();
		this.sut.setDragOrientation("Vertical");
		utils.waitForGanttRendered(this.sut).then(async function () {
			var mSvgCtn = this.getSvgCtn();
			var iScrollLeftHistory = mSvgCtn.hsb.scrollLeft();
			this.mousedown(mSvgCtn.shape, mSvgCtn.left + 20, mSvgCtn.top + 20);
			this.selectShape(mSvgCtn.shape);
			var iMoveX = mSvgCtn.left + 5;
			var iMoveY = mSvgCtn.top + mSvgCtn.height / 2;
			this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + 20, iMoveX, iMoveY);
			await nextUIUpdate();
			assert.ok(iScrollLeftHistory === this.getSvgCtn().hsb.scrollLeft(), "No auto scrolling to left");
			this.mouseup(document.body, iMoveX, iMoveY);
			done();
		}.bind(this));
	});

	QUnit.test("No auto scroll bottom when drag orientation is horizontal", function (assert) {
		var done = assert.async();
		this.sut.setDragOrientation("Horizontal");
		utils.waitForGanttRendered(this.sut).then(async function () {
			var mSvgCtn = this.getSvgCtn();
			var iScrollTopHistory = mSvgCtn.vsb.scrollTop();
			this.selectShape(mSvgCtn.shape);
			var iMoveX = mSvgCtn.left + 100;
			var iMoveY = mSvgCtn.bottom - 5;
			this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + mSvgCtn.height / 2, iMoveX, iMoveY);
			await nextUIUpdate();
			this.mouseup(document.body, iMoveX, iMoveY);
			var mSvgCtn2 = this.getSvgCtn();
			assert.ok(iScrollTopHistory === mSvgCtn2.vsb.scrollTop(), "No auto scrolling to bottom");
			done();
		}.bind(this));
	});

	QUnit.test("No auto scroll top when drag orientation is horizontal", function (assert) {
		var done = assert.async();
		this.sut.setDragOrientation("Horizontal");
		utils.waitForGanttRendered(this.sut).then(async function () {
			var mSvgCtn = this.getSvgCtn();
			mSvgCtn.vsb.scrollTop(20);
			var iScrollTopHistory = mSvgCtn.vsb.scrollTop();
			mSvgCtn = this.getSvgCtn(); // get shape again because DOM element can be replaced
			this.selectShape(mSvgCtn.shape);
			var iMoveX = mSvgCtn.left + 100;
			var iMoveY = mSvgCtn.top + 5;
			this.drag(mSvgCtn.shape, mSvgCtn.left + 1, mSvgCtn.top + mSvgCtn.height / 2, iMoveX, iMoveY);
			await nextUIUpdate();
			var mSvgCtn2 = this.getSvgCtn();
			assert.ok(iScrollTopHistory === mSvgCtn2.vsb.scrollTop(), "No auto scrolling to top");
			this.mouseup(document.body, iMoveX, iMoveY);
			done();
		}.bind(this));
	});

	QUnit.module("Functional", {
		fnCreateGanttContainer: function () {
			this.oGanttChartContainer = new GanttChartContainer("container", {
				ganttCharts: [
					utils.createGantt(false, new GanttRowSettings({
						rowId: "{Id}",
						shapes1: [
							new sap.gantt.simple.BaseRectangle({
								shapeId: "{Id}",
								time: "{StartDate}",
								endTime: "{EndDate}",
								title: "{Name}",
								fill: "#008FD3",
								selectable: true,
								resizable: true
							})
						]
					}))
				]
			});

			this.oStatusBar = this.oGanttChartContainer.getStatusBar();
			this.aGanttCharts = this.oGanttChartContainer.getGanttCharts();
			this.oGantt1 = this.aGanttCharts[0];
			jQuery(document.getElementById("qunit-fixture")).css("height", "300px");

			this.oGantt1.placeAt("qunit-fixture");
		},
		beforeEach: function () {
			this.fnCreateGanttContainer();
		},
		afterEach: function () {
			this.oGanttChartContainer.destroy();
			this.oGanttChartContainer = undefined;
		}
	});

	QUnit.test("Date and Time set on StatusBar", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.oGantt1).then( function () {
			var pExt = this.oGantt1._getPointerExtension();
			var date = new Date(2015, 10, 2, 14, 10, 0, 0);
			pExt.customBar(this.oGanttChartContainer,true, date);
			assert.equal(this.oGanttChartContainer.dateTimeText.getText(), this.oStatusBar.getItems()[1].getText(), "Date and Time is set on StatusBar");
			done();
		}.bind(this));
	});

});
