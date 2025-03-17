/*global QUnit,sinon */
sap.ui.define([
	"sap/gantt/simple/ExpandModel",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/MultiActivityRowSettings",
	"sap/gantt/test/simple/SteppedTask",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/AggregationUtils",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseDiamond",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/simple/ShapeScheme",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/MultiActivityGroup",
	"sap/gantt/simple/FindAndSelectUtils",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/BasePseudoShape",
	"sap/gantt/simple/GanttPrinting",
	"sap/gantt/simple/BaseImage",
	"sap/gantt/overlays/GanttRowOverlay",
	"sap/gantt/overlays/Overlay",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/misc/Utility",
	"sap/ui/core/Core",
	"sap/gantt/simple/Relationship",
	"sap/m/Text",
	"sap/gantt/misc/Format",
	"sap/gantt/library",
	"sap/base/util/isEmptyObject",
    "sap/gantt/simple/StockChart",
	"sap/gantt/simple/StockChartDimension",
	"sap/gantt/simple/StockChartPeriod",
	"sap/ui/core/Element",
	"sap/ui/core/Theming",
	"sap/ui/core/library",
	"sap/gantt/simple/test/nextUIUpdate",
	"sap/ui/model/json/JSONModel"
], function(ExpandModel, GanttRowSettings, MultiActivityRowSettings, SteppedTask, BaseRectangle, utils, AggregationUtils, BaseGroup, BaseDiamond, GanttUtils, ShapeScheme,GanttChartContainer, ContainerToolbar,
	GanttQUnitUtils, MultiActivityGroup, FindAndSelectUtils,qutils, BasePseudoShape, GanttPrinting, BaseImage,GanttRowOverlay,Overlay,BaseText,BaseChevron,Utility,Core,Relationship,Text,Format,ganttLibrary,isEmptyObject,
    StockChart,
    StockChartDimension,
    StockChartPeriod, Element, Theming, library,
	nextUIUpdate, JSONModel) {
	"use strict";

	// shortcut for sap.ui.table.SortOrder
	var SortOrder = library.SortOrder;

	// shortcut for sap.gantt.SelectionMode
	var SelectionMode = ganttLibrary.SelectionMode;

	// shortcut for sap.gantt.dragdrop.GhostAlignment
	var GhostAlignment = ganttLibrary.dragdrop.GhostAlignment;

	function resetGanttPrinting(gantt){
		gantt._ganttChartClone.destroy();
		gantt._ganttChartContainer.destroy();
		document.body.removeChild(gantt._oClonedGanttDiv);
		gantt._oDialog.close();
		gantt._oDialog.destroy();
		gantt.destroy();
	}
	QUnit.module("Pseudo shape", {
		before: function() {
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: function() {
			this.sut = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					showSearchButton: true,
					content: [
						new Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [GanttQUnitUtils.createGanttWithODataModelMultiactivity(null, new MultiActivityRowSettings({
					rowId: "{data>ProjectElemID}",
					highlight:"{data>Status}",
					shapes1: {
						templateShareable: true,
						path: "data>ProjectShapes",
						template: new BaseRectangle({
								expandable: true,
								tooltip:"{data>Tooltip}",
								draggable:true,
								connectable:true,
								hoverable:false ,
								countInBirdEye:true,
								resizable:true,
								highlightable:true,
							selectable: true,
							scheme:"main_row_shape",
							shapeId: "{data>TaskID}",
							time: "{data>StartDate}",
							endTime: "{data>EndDate}"
						})},
					tasks: {
						templateShareable: true,
						path: "data>ProjectTasks",
						template: new MultiActivityGroup({
								expandable: true,
								tooltip:"{data>Tooltip}",
								draggable:true,
								connectable:true,
								hoverable:false ,
								countInBirdEye:true,
								resizable:true,
								highlightable:true,
							selectable: true,
							scheme:"main_row_shape",
							shapeId: "{data>TaskID}",
							time: "{data>StartDate}",
							endTime: "{data>EndDate}",
							indicators:{
								path: "data>TaskToSteps",
								templateShareable: false,
								template: new BaseRectangle({
									scheme:"task_to_step",
									shapeId: "{data>StepID}",
									time: "{data>StartDate}",
									endTime: "{data>EndDate}",
									title: "{data>ObjectName}",
									fill: "#008FD3",
									selectable: true
								})
							},
							subTasks:{
								path: "data>TaskToSteps",
								templateShareable: false,
								template: new BaseRectangle({
									scheme:"task_to_step",
									shapeId: "{data>StepID}",
									time: "{data>StartDate}",
									endTime: "{data>EndDate}",
									title: "{data>ObjectName}",
									fill: "#008FD3",
									selectable: true
								})
							},
							task: new BaseGroup({
								selectable: true,
								resizable:true,
								draggable:true,
								shapeId:"{data>TaskID}",
								tooltip:"{data>Tooltip}",
								hoverable:true,
								connectable:true,
								scheme:"main_row_shape",
								highlightable:true,
								shapes: [
											new BaseRectangle({
												shapeId: "{data>TaskID}",
												time: "{data>StartDate}",
												endTime: "{data>EndDate}",
												title: "{data>TaskDesc}",
												fill: "#008FD3",
												scheme:"main_row_shape",
												selectable: true
											}),
											new BaseImage({
												src:"sap-icon://alert",
												isLabel:true,
												shapeId:"{data>TaskID}",
												time:"{data>StartDate}",
												endTime:"{data>EndDate}",
												fill:"red"
											})
								]
							})
						})
					}
				})
				), GanttQUnitUtils.createGanttWithODataModelMultiactivity("table1", new GanttRowSettings({
					rowId: "{data>ProjectElemID}",
					highlight:"{data>Status}",
					shapes1: {
						templateShareable: true,
						path: "data>ProjectLazyShapes",
						template: new BaseRectangle({
								expandable: true,
								tooltip:"{data>Tooltip}",
								draggable:true,
								hoverable:false ,
								countInBirdEye:true,
								resizable:true,
								highlightable:true,
							selectable: true,
							scheme:"main_row_shape",
							shapeId: "{data>TaskID}",
							time: "{data>StartDate}",
							endTime: "{data>EndDate}"
						})},
						shapes2: {
							templateShareable: true,
							path: "data>ProjectCustomPathShapes",
							template: new BaseRectangle({
									expandable: true,
									tooltip:"{data>Tooltip}",
									draggable:true,
									hoverable:false ,
									countInBirdEye:true,
									resizable:true,
									highlightable:true,
								selectable: true,
								scheme:"main_row_shape",
								shapeId: "{data>TaskID}",
								time: "{data>StartDate}",
								endTime: "{data>EndDate}"
							})}
				}))]
			});
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.sut.placeAt("qunit-fixture");
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
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		},
		mousedown: function(oShape, x, y, button) {
			var oEventParams = this.createEventParam(x, y, button);
			qutils.triggerEvent("mousedown", oShape, oEventParams);//"mousedown.sapGanttResizing"
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousemove", oShape, oEventParams);
		},
		getSvgOffset: function() {
			var popoverExt = this.sut.getGanttCharts()[0]._getPopoverExtension(),
				svgCtn = popoverExt.getDomRefs().header.getBoundingClientRect(),
				iSvgLeft = svgCtn.left,
				iSvgTop = svgCtn.top;

			return {left: iSvgLeft, top: iSvgTop};
		},
		triggerDrag: function(oDragShapeDom, iMousedownSvgLeft, iMousemoveSvgLeft, iMouseupSvgLeft, iPageY){
			this.mousedown(oDragShapeDom, iMousedownSvgLeft, iPageY);
			this.mousemove(oDragShapeDom, iMousemoveSvgLeft, iPageY);
			this.mouseup(oDragShapeDom, iMouseupSvgLeft, iPageY);
		},
		afterEach: function() {
			this.sut.destroy();
		},
		after: function() {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		}
	});
	QUnit.test("Labels in ghost image of dragging shape", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setEnablePseudoShapes(false);
		oGantt.setSelectOnlyGraphicalShape(true);
		var createDragGhostSpy = sinon.spy(oGantt._getDragDropExtension(), "createDragGhost");
		return utils.waitForGanttRendered(oGantt).then(function () {
			var oDragShapeDom = document.querySelector("g[data-sap-gantt-shape-id='0_task_3']"),
				oDragShape = Element.getElementById(oDragShapeDom.id);
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			oDragShape.setSelected(true);
			this.triggerDrag(oDragShapeDom, iSvgLeft - 15, iSvgLeft - 20, iSvgLeft - 60, iPageY);
			assert.notEqual(createDragGhostSpy.args[0][0].lastElementChild.style.fontFamily,'SAP-icons', "Alert icon should not be displayed in ghost image of dragging shape because it is a label");
			createDragGhostSpy.restore();
			done();
		}.bind(this));
		}.bind(this));
	});

	QUnit.test("Zoom rate change on jump to horizon", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setEnablePseudoShapes(false);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oAxisStrategy = oGantt.getAxisTimeStrategy();
			this.sut.getToolbar().setZoomLevel(4);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				var currentZoomRate = oAxisStrategy.getAxisTime().getZoomRate();
				oGantt.jumpToPosition(Format.abapTimestampToDate(oGantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime()));
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					var newZoomRate = oAxisStrategy.getAxisTime().getZoomRate();
					assert.equal(currentZoomRate, newZoomRate, "Zoom rate should not change");
					done();
				});
			});
		}.bind(this));
	});

	QUnit.test("ShapeRenderOrder with subtasks", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "task_to_step",
			rowSpan: 1
		}));
		var aShapeRenderOrder = ["tasks","shapes1"];
		oGantt.setShapeRenderOrder(aShapeRenderOrder, false);
		oGantt.setShowParentRowOnExpand(true);
		oGantt.setUseParentShapeOnExpand(false);
		oGantt.setEnablePseudoShapes(false);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable()._aRowHeights[0],33, "Row height on collapse");
				oGantt.expand(["task_to_step","main_row_shape"], 0);
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getTasks()[0].getSubTasks()[0]._level,1, "Subtasks are rendered first");
					assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._level,3, "Shape1 is displayed in level 3 on expand");
					assert.equal(oGantt.getTable()._aRowHeights[0],132, "Row height on expand");
					done();
				});
			});
	});
	QUnit.test("Testing shapes in expanded row after rebinding of rows", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setEnablePseudoShapes(false);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.expand("main_row_shape", 0);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			assert.notEqual(oGantt.oExpandedShapesMap[0][0].getX() , 0, "Expanded shape has valid x position in row");
			assert.notEqual(oGantt.oExpandedShapesMap[0][0].getWidth() , 0, "Shape is visible in expanded row");

			oGantt.oExpandedShapesMap[0][0].setParent(null);
			this.sut.getToolbar().setZoomLevel(1);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.notEqual(oGantt.oExpandedShapesMap[0][0].getX() , 0, "Expanded shape has valid x position in row after rebinding of rows");
				assert.notEqual(oGantt.oExpandedShapesMap[0][0].getWidth() , 0, "Shape is visible in expanded row after rebinding of rows");
				done();
			});
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("expand and collapse extended for other kind off shapes along with multiactivity tasks", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setEnablePseudoShapes(false);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable()._aRowHeights[0],33, "Row height on collapse");
				oGantt.expand("main_row_shape", 0);
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="holding_time"]').length,1, "Shapes under Shape1 aggregation is displayed on expand with tasks");
					assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._level,1, "Shape1 is displayed in level 1 on expand");
					assert.equal(oGantt.getTable()._aRowHeights[0],99, "Row height on expand");
					assert.equal(oGantt._oExpandModel.rowMaxLevelMap.row0,3, "Number of levels on expand");

					oGantt.collapse("main_row_shape", 0);
					return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
						oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
							key: "shape1",
							rowSpan: 1
						}));
						oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setScheme("shape1");
						return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
							oGantt.expand(["main_row_shape","shape1"], 0);
							return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
								assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="holding_time"]').length,1, "Shapes under Shape1 aggregation is displayed on expand when expanded with more than one expand schemes");
								assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._level,1, "Shape1 is displayed in level 1 on expand");
								assert.equal(oGantt.getTable()._aRowHeights[0],99, "Row height on expand");
								assert.equal(oGantt._oExpandModel.rowMaxLevelMap.row0,3, "Number of levels on expand");
								oGantt.collapse(["main_row_shape","shape1"], 0);
								oGantt.setShowParentRowOnExpand(false);
								oGantt.setUseParentShapeOnExpand(false);
								oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
									key: "task_to_step",
									rowSpan: 1
								}));
								return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
									oGantt.expand(["task_to_step","shape1"], 0);
									return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
										assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="holding_time"]').length,1, "Shapes under Shape1 aggregation is displayed on expand with subtasks");
										assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._level,1, "Shape1 is displayed in level 1 on expand");
										assert.equal(oGantt.getTable()._aRowHeights[0],99, "Row height on expand");
										assert.equal(oGantt._oExpandModel.rowMaxLevelMap.row0,3, "Number of levels on expand");
										oGantt.collapse(["task_to_step","shape1"], 0);
										oGantt.setShowParentRowOnExpand(true);
										oGantt.setUseParentShapeOnExpand(false);
										return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
											oGantt.expand(["task_to_step","shape1"], 0);
											return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
												assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="holding_time"]').length,1, "Shapes under Shape1 aggregation is displayed on expand with subtasks and its parent task");
												assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._level,1, "Shape1 is displayed in level 1 on expand");
												assert.equal(oGantt.getTable()._aRowHeights[0],132, "Row height on expand");
												assert.equal(oGantt._oExpandModel.rowMaxLevelMap.row0,3, "Number of levels on expand");
												done();
											});
										});
									});
								});
							});
						});
					});
				});
			});
	});
	QUnit.test("expand and collapse extended for all kind of shapes in Gantt", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[1];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setEnablePseudoShapes(false);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable()._aRowHeights[0],33, "Row height on collapse");
				oGantt.expand("main_row_shape", 0);
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="rectangle"]').length,1, "Shapes under Shape1 aggregation is displayed on expand");
					assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="customPath"]').length,1, "Shapes under Shape2 aggregation is displayed on expand");
					assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._level,1, "Shape1 is displayed in level 1 on expand");
					assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes2()[0]._level,3, "Shape2 is displayed in level 2 on expand");
					assert.equal(oGantt.getTable()._aRowHeights[0],231, "Row height on expand");
					assert.equal(oGantt._oExpandModel.rowMaxLevelMap.row0,7, "Number of levels on expand");
					oGantt.collapse("main_row_shape", 0);
					return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
						oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
							key: "shape1",
							rowSpan: 1
						}));
						oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setScheme("shape1");
						return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
							oGantt.expand(["main_row_shape","shape1"], 0);
							return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
								assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="rectangle"]').length,1, "Shapes under Shape1 aggregation is displayed on expand when expanded with more than one expand schemes");
								assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="customPath"]').length,1, "Shapes under Shape2 aggregation is displayed on expand when expanded with more than one expand schemes");
								assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._level,1, "Shape1 is displayed in level 1 on expand");
								assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes2()[0]._level,3, "Shape2 is displayed in level 2 on expand");
								assert.equal(oGantt.getTable()._aRowHeights[0],231, "Row height on expand");
								assert.equal(oGantt._oExpandModel.rowMaxLevelMap.row0,7, "Number of levels on expand");
								done();
							});
						});
					});
				});
			});
	});
	QUnit.test("Collapse behaviour of a row with Pseudo shapes and normal shapes", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setShapeRenderOrder(["tasks","shapes1"]);
		oGantt.setEnablePseudoShapes(true);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.getTable().getRowSettingsTemplate().getBindingInfo("shapes1").template.setScheme("main_row_shape1");
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.expand("main_row_shape", 0);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable()._aRowHeights[0],66, "1st Row expanded successfully");
				oGantt.collapse("main_row_shape", 0);
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					assert.equal(oGantt.getTable()._aRowHeights[0],33, "1st Row collapsed successfully");
					oGantt.getTable().getRowSettingsTemplate().getBindingInfo("shapes1").template.setScheme("main_row_shape");
					done();
					});
				});
			});
		});
	});
	QUnit.test("Dynamic setting of enablePseudoShapes property", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setEnablePseudoShapes(false);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.collapse("main_row_shape", 0);
			assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length,5, "5 Tasks were displayed when PseudoShapesDisplay is not enabled");
			assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("shapes1").length, 1, "1 Shapes were displayed in 1st row when PseudoShapesDisplay is enabled");
			assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes"), null, "Pseudo shape is not created");
			oGantt.setEnablePseudoShapes(true);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length, 2, "2 Tasks were displayed in 1st row when PseudoShapesDisplay is enabled");
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length, 1, "Pseudo shape is created");
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].aShapeIds.length, 4, "4 shapes are part of Pseudo shape");
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("shapes1"), null, "Shape is not displayed");
				oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
				assert.equal(oGantt.oOverlapShapeIds[3].length ,3, "Pseudo shape 3 is expanded");
				oGantt.expand("main_row_shape", 1);
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					assert.equal(oGantt.getTable()._aRowHeights[3],132, "Pseudo shape expanded (4th)row height is updated");
					assert.equal(oGantt.getTable()._aRowHeights[1],66, "2nd Row expanded");
					oGantt.setEnablePseudoShapes(false);
					return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
						assert.equal(oGantt.getTable()._aRowHeights[1],66, "2nd Row remain expanded");
						assert.equal(oGantt.oOverlapShapeIds, null,"4th row Pseudo shape is collapsed");
						assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length,5, "Normal tasks are displayed when EnablePseudoShapes is disabled");
						done();
					});
				});
			});
		});
	});
	QUnit.test("expand and collapse", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setEnablePseudoShapes(false);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length,5, "5 Shapes were displayed when PseudoShapesDisplay is not enabled");
			oGantt.setEnablePseudoShapes(true);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length,2, "2 Tasks were displayed in 1st row when PseudoShapesDisplay is enabled");
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length, 1, "1 Pseudo shape is created in 1st row");
				assert.equal(oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes").length,2, "2 Pseudo Shapes were displayed in 4th row when PseudoShapesDisplay is enabled");
				//expand 1st row pseudoshape
				oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
				assert.equal(oGantt.oOverlapShapeIds[0].length,4, "Pseudo shape 0 is expanded");
				// //expand 4th row pseudoshape
				oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
				assert.equal(oGantt.oOverlapShapeIds[3].length ,3, "Pseudo shape 3 is expanded");
				//collapse 1st row pseudoshape
				oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
				assert.equal(oGantt.oOverlapShapeIds[0], null,"Pseudo shape 0 is collapsed");
				assert.equal(oGantt.oOverlapShapeIds[3].length,3, "Pseudo shape 3 remain expanded");
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("button")[0].getSrc(), 'sap-icon://expand', "Expand icon is shown when pseudoshape is collapsed");
				assert.equal(oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("button")[0].getSrc(), 'sap-icon://collapse', "collapse icon is shown when pseudoshape is expanded");
				//expand 3rd row 2nd pseudoshape
				oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[1].onclick();
				assert.equal(oGantt.oOverlapShapeIds[3].length ,2, "In 4th row, 1st pseudo shape is collapsed on 2nd pseudo shape's expand");
				oGantt.getAxisTimeStrategy().getVisibleHorizon().setStartTime(20140101000000);
				oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[0].setHorizontalTextAlignment("Middle");
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					var id1 = oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[0].getId();
					var diff = document.getElementById(id1).children[2].getAttribute('x') - oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[0].getXByTime(oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("task").getTime());
					assert.ok(diff == 4, "Icon is aligned in start position of pseudo shape(4px padding)");
					diff = document.getElementById(id1).children[1].getAttribute('x') - oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[0].getXByTime(oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("task").getTime());
					assert.ok(diff == 18, "Icon is alignmed with text on pseudo shape");
					var icon = document.getElementById(id1).children[2];
					assert.equal(icon.style.fill , "rgb(255, 255, 255)", "Icon color is white");
					assert.equal(icon.style.fontWeight , "bold", "Icon font-weight is bold");
					assert.equal(icon.style.fontSize , "12px", "Icon font size is 12px");
					assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].getTypeOfOverlapIndicator(),"Gradient", "OverlapIndicator type is gradient");
					assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("indicators").length,0,"Indicator is not available");
					var id = oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes")[1].getId();
					assert.equal(document.getElementById(id).children.length,2,"expand icon disappears on pseudoshape as its width decreases");
					assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("task").getFill(),"url(#" + oGantt.getId() + "_row-0group-0)", "Gradient fill available");
					var oRowSettings = oGantt.getTable().getRowSettingsTemplate();
					// TODO: Uncomment below assert statements when pseudoShapeTemplate aggregation becomes public
					// oRowSettings.setAggregation("pseudoShapeTemplate", new BasePseudoShape({typeOfOverlapIndicator: "Both",task: new BaseRectangle(),indicators:[new BaseRectangle()] }));
					oGantt.setRowSettingsTempWithInvalid(oRowSettings);
					return GanttQUnitUtils.waitForGanttRendered(oGantt).then(async function () {
						// assert.equal(window.getComputedStyle(document.getElementsByClassName("sapGanttPseudoShapeOverlapIndicatorStyle")[0]).height,"4px","Indicator's  height is as specified default value");
						Theming.setTheme("sap_fiori_3_hcw");
						await nextUIUpdate();
						return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
						// assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks")[0].getTypeOfOverlapIndicator(),"Both", "OverlapIndicator type is gradient + indicator");
						assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("task").getFill(),"url(#" + oGantt.getId() + "_row-0group-0)", "Gradient fill available");
						assert.notEqual(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("indicators"),null,"Indicator is also available");
						// oRowSettings.setAggregation("pseudoShapeTemplate", new BasePseudoShape({typeOfOverlapIndicator: "Indicator",task: new BaseRectangle(),indicators:[new BaseRectangle()] }));
						oGantt.setRowSettingsTempWithInvalid(oRowSettings);
						return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
							// assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks")[0].getTypeOfOverlapIndicator(),"Indicator", "OverlapIndicator type is only indicator");
							assert.notEqual(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("task").getFill(),"url(#row-0group-0)", "Gradient fill not available");
							assert.notEqual(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].getAggregation("indicators"),null,"Indicator is available");
							return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
								// assert.equal(window.getComputedStyle(document.getElementsByClassName("sapGanttPseudoShapeOverlapIndicatorStyle")[0]).height,"6px","Indicator's  height is as specified default value for hcw and hcb");
								var oAxisTimeStrategy1 =  oGantt.getAxisTimeStrategy();
								var oVisibleHorizonStartTime = oAxisTimeStrategy1.getVisibleHorizon().getStartTime(),
								oVisibleHorizonEndTime = oAxisTimeStrategy1.getVisibleHorizon().getEndTime();
								oGantt.getParent().getToolbar()._oBirdEyeButton.firePress();
								return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
									var oBirdEyeVisibleHorizonStartTime = oAxisTimeStrategy1.getVisibleHorizon().getStartTime(),
										oBirdEyeVisibleHorizonEndTime = oAxisTimeStrategy1.getVisibleHorizon().getEndTime();
									assert.notEqual(oVisibleHorizonStartTime, oBirdEyeVisibleHorizonStartTime, "Start time of visible horizon updated as per countInBirdEye value set");
									assert.notEqual(oVisibleHorizonEndTime, oBirdEyeVisibleHorizonEndTime, "End time of visible horizon updated as per countInBirdEye value set");
									done();
								});
							});
						});
					});
					});
				});
			});
		});
	});
	QUnit.test("Context menu operation - Task deletion", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setUseParentShapeOnExpand(true);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.expand("main_row_shape", 0);
			var oDataModel = oGantt.getModel("data");
			var oRow = oGantt.getTable().getRows()[0];
			var oRowSettings = oRow.getAggregation("_settings");
			var oShape = oRowSettings.getAggregation("tasks")[0];
			var mParameters = {
				context: oRow.getBindingContext("data"),
				success: function(oData) {
					oDataModel.read("/ProjectElems('" + oRowSettings.getRowId() + "')", {
						urlParameters: {
							"$expand": "ProjectTasks"
						}
					});
				}
			};
			oDataModel.remove("/Tasks('" + oShape.getShapeId() + "')", mParameters);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length, 4, "deleted task reflected successfully in view");
				done();
			});
		});
	});
	QUnit.test("PDF Export - Validate missing bindinginfo of tasks in multiactivity", function (assert) {
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setEnablePseudoShapes(true);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: oGantt
			});
			return this.printGantt.open().then(function () {
				assert.ok(this.printGantt._ganttChartClone.getTable().getRowSettingsTemplate().getBindingInfo("tasks"), "Rowsettings binding info is present in clonned gantt");
				assert.equal(this.printGantt._ganttChartClone.getTable().getRows()[0].getAggregation("_settings").getTasks().length,2, "Tasks are displayed in print screen");
				assert.equal(this.printGantt._ganttChartClone.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length,1, "1 Pseudo shape displayed in print screen");
				assert.ok(document.getElementById(this.printGantt._ganttChartClone.getId() + "_row-0group-0").nodeName, 'linearGradient', "Gradients successfully applied for clonned gantt in priniting screen");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate useParentShapeOnExpand and pseudoShapeDisplay set to true", function (assert) {
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setEnablePseudoShapes(true);
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.getShapeSchemes()[0].setPrimary(false);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oRows = oGantt.getTable().getRows();
			// oGantt.getInnerGantt().attachEventOnce("ganttReady",function(){
			oRows[0] && oRows[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
			oGantt.expand("main_row_shape", 1);
			this.printGantt = new GanttPrinting({
				ganttChart: oGantt
			});
			return this.printGantt.open().then(function () {
				var oClonedGantt = this.printGantt._ganttChartClone;
				var oClonedRows = oClonedGantt.getTable().getRows();
				var oPseudoRowheight = window.getComputedStyle(oRows[0].getDomRef()).height;
				var oClonedPseudoRowheight = window.getComputedStyle(oClonedRows[0].getDomRef()).height;
				var oExpandedRowheight = window.getComputedStyle(oRows[1].getDomRef()).height;
				var oClonedExpandedRowheight = window.getComputedStyle(oClonedRows[1].getDomRef()).height;
				assert.equal(oClonedGantt.oOverlapShapeIds[0].length, oGantt.oOverlapShapeIds[0].length, "Pseudo shape should be expanded");
				assert.equal(oClonedGantt._aExpandedIndices.length, oGantt._aExpandedIndices.length, "Same rows should be expanded");
				assert.notEqual(oClonedGantt._oExpandModel.mExpanded, {}, "Rows should be expanded according to correct shape scheme");
				assert.equal(oExpandedRowheight, oClonedExpandedRowheight, "Cloned expanded row height should be same as original gantt");
				assert.equal(oPseudoRowheight, oClonedPseudoRowheight, "Cloned pseudo row height should be same as original gantt");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		// }.bind(this));
		}.bind(this));
	});
	QUnit.test("Pseudo shape extended for all kind of shapes in Gantt", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[1];
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setEnablePseudoShapes(true);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length,1, "Overlapped shapes combined to create Pseudo shape");
				oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].aShapeIds.length,8, "8 Shapes under Pseudo shapes");
				assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="rectangle"]').length,0, "Shape is not displayed on pseudo shape collapse");
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="rectangle"]').length,1, "Shape is displayed on pseudo shape expand");
					assert.equal(oGantt.oOverlapShapeIds[0] ,oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].aShapeIds, "Pseudo shape is expanded");
					done();
				});
			});
	});
	QUnit.test("Pseudo shape extended for all kind of shapes in Gantt along with multiactivity tasks", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setEnablePseudoShapes(true);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length,1, "Overlapped shapes combined to create Pseudo shape");
				assert.ok(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].aShapeIds.indexOf("holding_time") > -1, "Shape under shapes1 aggr is part of Pseudo shape");
				assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="holding_time"]').length,0, "Shapes under Shape1 aggregation is not displayed on pseudo shape collapse");
				oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					assert.equal(document.querySelectorAll('[data-sap-gantt-shape-id="holding_time"]').length,1, "Shapes under Shape1 aggregation is displayed on pseudo shape expand with tasks");
					done();
				});
			});
	});
	QUnit.test("Relationships in Pseudo shape", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setEnablePseudoShapes(true);
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					var oRls = new Relationship({
						predecessor: "0_task_0",
						successor: "1_task_0",
						shapeId: "rel-1",
						type: "FinishToStart"
					});
					oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
					return GanttQUnitUtils.waitForGanttRendered(oGantt).then(async function () {
						await nextUIUpdate();
						assert.ok(oGantt.relSet["rel-1"].mRelatedShapes.predecessor.sParentAggregationName == "pseudoShapes" && oGantt.relSet["rel-1"].mRelatedShapes.successor.sParentAggregationName == "tasks", "Relationship drawn from Pseudo shape to normal shape in collapsed mode");
						assert.ok(oGantt.relSet["rel-1"].mProperties.d != undefined, "Relationship drawn from Pseudo shape to normal shape in collapsed mode is visible");

						oRls = new Relationship({
							predecessor: "0_task_0",
							successor: "0_task_1",
							shapeId: "rel-2",
							type: "FinishToStart"
						});
						oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
						return GanttQUnitUtils.waitForGanttRendered(oGantt).then(async function () {
							await nextUIUpdate();
							assert.ok(oGantt.relSet["rel-2"].mRelatedShapes.predecessor.sParentAggregationName == "pseudoShapes" && oGantt.relSet["rel-2"].mRelatedShapes.successor.sParentAggregationName == "pseudoShapes" && oGantt.relSet["rel-2"].mRelatedShapes.successor == oGantt.relSet["rel-2"].mRelatedShapes.predecessor, "Relationship from Pseudo shape to itself in collapse mode");
							assert.ok(oGantt.relSet["rel-2"].mProperties.d == undefined, "Relationship not drawn from Pseudo shape to itself in collapsed mode so it is not visible");

							oRls = new Relationship({
								predecessor: "3_task_1",
								successor: "3_task_4",
								shapeId: "rel-3",
								type: "FinishToStart"
							});
							oGantt.getTable().getRows()[3].getAggregation('_settings').addRelationship(oRls);
							return GanttQUnitUtils.waitForGanttRendered(oGantt).then(async function () {
								await nextUIUpdate();
								assert.ok(oGantt.relSet["rel-3"].mRelatedShapes.predecessor.sParentAggregationName == "pseudoShapes" && oGantt.relSet["rel-3"].mRelatedShapes.successor.sParentAggregationName == "pseudoShapes" && oGantt.relSet["rel-3"].mRelatedShapes.successor != oGantt.relSet["rel-3"].mRelatedShapes.predecessor, "Relationship drawn from Pseudo shape to other Pseudo shape in collapsed mode");
								assert.ok(oGantt.relSet["rel-3"].mProperties.d != undefined, "Relationship drawn from Pseudo shape to other Pseudo shape in collapsed mode is visible");

								oRls = new Relationship({
									predecessor: "1_task_1",
									successor: "9_task_0",
									shapeId: "rel-4",
									type: "FinishToStart"
								});
								oGantt.getTable().getRows()[7].getAggregation('_settings').addRelationship(oRls);

								return GanttQUnitUtils.waitForGanttRendered(oGantt).then(async function () {
									await nextUIUpdate();
									assert.ok(oGantt.relSet["rel-4"].mRelatedShapes.predecessor.sParentAggregationName == "pseudoShapes" && oGantt.relSet["rel-4"].mRelatedShapes.successor == undefined && oGantt.relSet["rel-4"].mAnchors.prompter.x != undefined, "Relationship drawn from Pseudo shape to other shape that is not visible on screen so Pin symbol is displayed");
									assert.ok(oGantt.relSet["rel-4"].mProperties.d != undefined, "Relationship drawn with Pin");

									oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
									return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
										assert.ok(oGantt.relSet["rel-1"].mRelatedShapes.predecessor.sParentAggregationName == "task" && oGantt.relSet["rel-1"].mRelatedShapes.successor.sParentAggregationName == "tasks", "Relationship drawn from normal shape to other normal shape in expand mode of Pseudo shape");
										assert.ok(oGantt.relSet["rel-1"].mProperties.d != undefined, "Relationship drawn from normal shape to other normal shape in expand mode is visible");
										oGantt.getTable().getRows()[7].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
										return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
											assert.ok(oGantt.relSet["rel-2"].mRelatedShapes.predecessor.sParentAggregationName == "task" && oGantt.relSet["rel-2"].mRelatedShapes.successor.sParentAggregationName == "task", "Relationship between different tasks under Pseudo shape in its expand mode");
											assert.ok(oGantt.relSet["rel-2"].mProperties.d != undefined, "Relationship between different tasks under Pseudo shape in its expand mode should visible");
											done();
										});
									});
								});
							});
						});
					});
				});
	});
	QUnit.module("Pseudo shape with edit", {
		before: function() {
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: function() {
			this.sut = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					showSearchButton: true,
					content: [
						new Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [GanttQUnitUtils.createGanttWithODataModelMultiactivity(null, new MultiActivityRowSettings({
					rowId: "{data>ProjectElemID}",
					highlight:"{data>Status}",
					tasks: {
						templateShareable: true,
						path: "data>ProjectTasks",
						template: new MultiActivityGroup({
								expandable: true,
								tooltip:"{data>Tooltip}",
								draggable:true,
								hoverable:false ,
								countInBirdEye:true,
								resizable:true,
								highlightable:true,
							selectable: true,
							scheme:"main_row_shape",
							shapeId: "{data>TaskID}",
							time: "{data>StartDate}",
							endTime: "{data>EndDate}",
							task: new BaseRectangle({
									shapeId: "{data>TaskID}",
									time: "{data>StartDate}",
									endTime: "{data>EndDate}",
									title: "{data>TaskDesc}",
									fill: "#008FD3",
									scheme:"main_row_shape",
									selectable: true,
									draggable:true
							})
						})
					}
				})
				)]
			});
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.sut.placeAt("qunit-fixture");
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
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		},
		getSvgOffset: function() {
			var popoverExt = this.sut.getGanttCharts()[0]._getPopoverExtension(),
				svgCtn = popoverExt.getDomRefs().header.getBoundingClientRect(),
				iSvgLeft = svgCtn.left,
				iSvgTop = svgCtn.top;

			return {left: iSvgLeft, top: iSvgTop};
		},
		mousedown: function(oShape, x, y, button) {
			var oEventParams = this.createEventParam(x, y, button);
			qutils.triggerEvent("mousedown", oShape, oEventParams);//"mousedown.sapGanttResizing"
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousemove", oShape, oEventParams);
		},
		triggerDrag: function(oDragShapeDom, iMousedownSvgLeft, iMousemoveSvgLeft, iMouseupSvgLeft, iPageY){
			this.mousedown(oDragShapeDom, iMousedownSvgLeft, iPageY);
			this.mousemove(oDragShapeDom, iMousemoveSvgLeft, iPageY);
			this.mouseup(oDragShapeDom, iMouseupSvgLeft, iPageY);
		},
		afterEach: function() {
			this.sut.destroy();
		},
		after: function() {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		}
	});
	QUnit.test("Drag and drop", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setShowParentRowOnExpand(true);
		oGantt.setEnablePseudoShapes(true);
			return utils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length,3, "3 Tasks were displayed in 1st row when PseudoShapesDisplay is enabled");
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length, 1, "1 Pseudo shape is created in 1st row");

				oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
				return utils.waitForGanttRendered(oGantt).then(function () {
						assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length,5, "Pseudo shape is expanded");

						var oDragShapeDom = document.querySelector("rect[data-sap-gantt-shape-id='0_task_0']"),
						oDragShape = Element.getElementById(oDragShapeDom.id);
						var oSvgOffset = this.getSvgOffset();
						var iSvgLeft = oSvgOffset.left;
						var iSvgTop = oSvgOffset.top;
						var iPageY = iSvgTop + 10;
						oDragShape.setSelected(true);
						oGantt.attachEvent("shapeDrop", function (oEvent) {
							var oDataModel = oGantt.getModel("data");
							var oNewDateTime = oEvent.getParameter("newDateTime");
							var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
							var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");
							var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
							var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
							var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
							if (oGantt.getGhostAlignment() === GhostAlignment.End) {
								iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
							}

							var getBindingContextPath = function (sShapeUid) {
								var oParsedUid = Utility.parseUid(sShapeUid);
								return oParsedUid.shapeDataName;
							};

							Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
								var sPath = getBindingContextPath(sShapeUid);
								var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
								var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
								var oNewDateTime = new Date(oOldDateTime.getTime() + iMoveWidthInMs);
								var oNewEndDateTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
								oDataModel.setProperty(sPath + "/StartDate", oNewDateTime, true);
								oDataModel.setProperty(sPath + "/EndDate", oNewEndDateTime, true);
							});
						}, this);

						this.triggerDrag(oDragShapeDom, iSvgLeft + 15, iSvgLeft + 20, iSvgLeft + 1170, iPageY);
						return utils.waitForGanttRendered(oGantt).then(function () {
								oGantt.getInnerGantt().attachEventOnce("ganttReady",function(){
									assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length,5, "Pseudo shape is destroyed after shape inside pseudo shape is dragged out");
									var oDragShapeDom = document.querySelector("g[data-sap-gantt-shape-id='0_task_1']"),
									oDragShape = Element.getElementById(oDragShapeDom.id);
									oDragShape.setSelected(true);
									this.triggerDrag(oDragShapeDom, iSvgLeft + 15, iSvgLeft + 20, iSvgLeft + 150, iPageY);
									return utils.waitForGanttRendered(oGantt).then(function () {
										oGantt.getInnerGantt().attachEventOnce("ganttReady",function(){
											assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length, 3, "3 Tasks displayed");
											assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length, 1, "Pseudo shape is created after shape drop");
											var oDragShapeDom = document.querySelector("g[data-sap-gantt-shape-id='0_task_3']"),
											oDragShape = Element.getElementById(oDragShapeDom.id);
											oDragShape.setSelected(true);
											this.triggerDrag(oDragShapeDom, iSvgLeft - 15, iSvgLeft - 20, iSvgLeft - 60, iPageY);
											return utils.waitForGanttRendered(oGantt).then(function () {
												oGantt.getInnerGantt().attachEventOnce("ganttReady",function(){
													assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length, 2, "Pseudo shape is updated after shape drop on existing(collapsed) pseudo shape");
													oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
													return utils.waitForGanttRendered(oGantt).then(function () {
														var oDragShapeDom = document.querySelector("rect[data-sap-gantt-shape-id='0_task_3']"),
														oDragShape = Element.getElementById(oDragShapeDom.id);
														oDragShape.setSelected(true);
														this.triggerDrag(oDragShapeDom, iSvgLeft + 15, iSvgLeft + 20, iSvgLeft + 60, iPageY);
														return utils.waitForGanttRendered(oGantt).then(function () {
															assert.equal(oGantt.oOverlapShapeIds[0].length, 3, "Expanded Pseudo shape is updated after one shape is dragged out of it");
															var oDragShapeDom = document.querySelector("g[data-sap-gantt-shape-id='6_task_0']"),
															oDragShape = Element.getElementById(oDragShapeDom.id);
															oDragShape.setSelected(true);
															this.triggerDrag(oDragShapeDom, iSvgLeft + 15, iSvgLeft + 20, iSvgLeft + 60, iPageY);
															return utils.waitForGanttRendered(oGantt).then(function () {
																oGantt.getInnerGantt().attachEventOnce("ganttReady",function(){
																	oGantt.getTable().getRows()[9].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
																	var oDragShapeDom = document.querySelector("g[data-sap-gantt-shape-id='7_task_0']"),
																	oDragShape = Element.getElementById(oDragShapeDom.id);
																	oDragShape.setSelected(true);
																	this.triggerDrag(oDragShapeDom, iSvgLeft + 15, iSvgLeft + 20, iSvgLeft + 60, iPageY);
																	return utils.waitForGanttRendered(oGantt).then(function () {
																		oGantt.getTable().getRows()[10].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
																		return utils.waitForGanttRendered(oGantt).then(function () {
																			assert.equal(oGantt.oOverlapShapeIds[9].length, 2, "9th row pseudo shape is expanded");
																			assert.equal(oGantt.oOverlapShapeIds[10].length, 2, "9th row pseudo shape is expanded");
																			oGantt.oSelection.setSelectionMode(SelectionMode.Multiple);
																			var oDragShapeDom1 = document.querySelector("rect[data-sap-gantt-shape-id='7_task_1']"),
																			oDragShape1 = Element.getElementById(oDragShapeDom1.id);
																			oDragShape1.setSelected(true);
																			var oDragShapeDom2 = document.querySelector("rect[data-sap-gantt-shape-id='6_task_1']"),
																			oDragShape2 = Element.getElementById(oDragShapeDom2.id);
																			oDragShape2.setSelected(true);
																			var oDragShapeDom3 = document.querySelector("rect[data-sap-gantt-shape-id='6_task_0']"),
																			oDragShape3 = Element.getElementById(oDragShapeDom3.id);
																			oDragShape3.setSelected(true);
																			this.triggerDrag(oDragShapeDom1, iSvgLeft - 15, iSvgLeft - 20, iSvgLeft - 60, iPageY);
																			return utils.waitForGanttRendered(oGantt).then(function () {
																					assert.equal(oGantt.getTable().getRows()[10].getAggregation("_settings").getAggregation("tasks").length, 5, "Multiple row and shapes drag drop succesfull");
																					assert.equal(oGantt.getTable().getRows()[9].getAggregation("_settings").getAggregation("tasks").length, 5, "Multiple row and shapes drag drop succesfull");
																					done();
																			});
																		}.bind(this));
																	}.bind(this));
																}.bind(this));
															}.bind(this));
														}.bind(this));
													}.bind(this));
												}.bind(this));
											}.bind(this));
										}.bind(this));
									}.bind(this));
								}.bind(this));
						}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Resize", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setShowParentRowOnExpand(true);
		oGantt.setEnablePseudoShapes(true);
		return utils.waitForGanttRendered(oGantt).then(function () {
			assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks").length,3, "3 Tasks were displayed in 1st row when PseudoShapesDisplay is enabled");
			assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length, 1, "1 Pseudo shape is created in 1st row");
			assert.equal(oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes").length,2, "2 Pseudo Shapes were displayed in 4th row when PseudoShapesDisplay is enabled");

				return utils.waitForGanttRendered(oGantt).then(function () {
					var oResizeOutline = oGantt._getResizeExtension();
					var oRectFirstShape = Element.getElementById(document.querySelector("g[data-sap-gantt-shape-id='0_task_3']").id);
					oRectFirstShape.setProperty("resizable",true, true);
					oGantt.attachEvent("shapeResize", function (oEvent) {
						var oDataModel = oGantt.getModel("data");
						var aNewTime = oEvent.getParameter("newTime"),
						oShape = oEvent.getParameter("shape");
						var getBindingContextPath = function (sShapeUid) {
							var oParsedUid = Utility.parseUid(sShapeUid);
							return oParsedUid.shapeDataName;
						};
						var sPath = getBindingContextPath(oShape.getShapeUid());
						oDataModel.setProperty(sPath + "/StartDate", aNewTime[0], true);
						oDataModel.setProperty(sPath + "/EndDate", aNewTime[1], true);
					}, this);
					oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
					oResizeOutline.toggleOutline(oRectFirstShape);
					var oLineTriggerRight = document.getElementsByClassName("lineTrigger rightTrigger")[0];
					var oLineTriggerRightBound = oLineTriggerRight.getBoundingClientRect();
					var oPositionTriggerRightX = oLineTriggerRightBound.left;
					var oPositionTriggerRightY = oLineTriggerRightBound.top;
					this.triggerDrag(oLineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightX + 16, oPositionTriggerRightX + 196, oPositionTriggerRightY);

					return utils.waitForGanttRendered(oGantt).then(function () {
						oGantt.getInnerGantt().attachEventOnce("ganttReady",function(){
							assert.equal(oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes").length, 2, "Pseudo shape is created");
							var oRectFirstShape = Element.getElementById(document.querySelector("g[data-sap-gantt-shape-id='0_task_2']").id);
							oRectFirstShape.setProperty("resizable",true, true);
							oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
							oResizeOutline.toggleOutline(oRectFirstShape);
							var oLineTriggerRight = document.getElementsByClassName("lineTrigger rightTrigger")[0];
							var oLineTriggerRightBound = oLineTriggerRight.getBoundingClientRect();
							var oPositionTriggerRightX = oLineTriggerRightBound.left;
							var oPositionTriggerRightY = oLineTriggerRightBound.top;
							this.triggerDrag(oLineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightX + 16, oPositionTriggerRightX + 196, oPositionTriggerRightY);

							return utils.waitForGanttRendered(oGantt).then(function () {
								oGantt.getInnerGantt().attachEventOnce("ganttReady",function(){
									assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length, 2, "Pseudo shape is updated");
									oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].onclick();
									return utils.waitForGanttRendered(oGantt).then(function () {
										var oRectFirstShape = Element.getElementById(document.querySelector("rect[data-sap-gantt-shape-id='0_task_0']").id);
										oRectFirstShape.setProperty("resizable",true, true);
										oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
										oResizeOutline.toggleOutline(oRectFirstShape);
										var oLineTriggerRight = document.getElementsByClassName("lineTrigger rightTrigger")[0];
										var oLineTriggerRightBound = oLineTriggerRight.getBoundingClientRect();
										var oPositionTriggerRightX = oLineTriggerRightBound.left;
										var oPositionTriggerRightY = oLineTriggerRightBound.top;
										this.triggerDrag(oLineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightX - 86, oPositionTriggerRightX - 396, oPositionTriggerRightY);
										return utils.waitForGanttRendered(oGantt).then(function () {
											oGantt.getInnerGantt().attachEventOnce("ganttReady",function(){
												assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes").length, 1, "Pseudo shape is destroyed");
												done();
											});
										});
									}.bind(this));
								}.bind(this));
							}.bind(this));
						}.bind(this));
					}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Find and select for pseudo shapes", function(assert){
		var done = assert.async();
		var oToolbar = this.sut.getToolbar();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.setShowParentRowOnExpand(true);
		oGantt.setEnablePseudoShapes(true);
		oGantt.setFindBy(["TaskDesc"]);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("Task");
			oToolbar._searchFlexBox.getItems()[0].fireSearch();
			setTimeout(function() {
				assert.strictEqual(FindAndSelectUtils._ganttSearchResults.length, 95, "Correct results found when all shapes are collapsed");
				assert.equal(oGantt.oOverlapShapeIds, undefined, "1st row pseudo shapes are collapsed");
				oToolbar._searchFlexBox.getItems()[1].firePress();
				assert.equal(oGantt.oOverlapShapeIds[0].length, 2, "1st row pseudo shape auto expanded");
				assert.equal(oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("pseudoShapes")[0].aShapeIds, oGantt.oOverlapShapeIds[0], "Pseudo shape is auto expanded");
				oToolbar._searchFlexBox.getItems()[0].fireSearch();
				setTimeout(function() {
					assert.strictEqual(FindAndSelectUtils._ganttSearchResults.length, 95, "Correct results found when pseudo shape is expanded");
					assert.equal(oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("pseudoShapes").length, 2, "3rd row pseudo shapes are collapsed");
					FindAndSelectUtils.scrollToShape(FindAndSelectUtils._ganttSearchResults[11], oGantt);
					assert.equal(oGantt.oOverlapShapeIds[3].length, 3, "3rd row pseudo shape auto expanded");
					assert.equal(oGantt.getTable().getRows()[3].getAggregation("_settings").getAggregation("tasks").length, 3, "Pseudo shape is auto expanded");
					done();
				}, 500);
			}, 500);
		});
	});
	QUnit.test("Drag drop after vertical scroll", function (assert) {
        var done = assert.async();
        var oGantt = this.sut.getGanttCharts()[0];
        oGantt.setProperty("enablePseudoShapes", false, true);
        oGantt.getTable().setFirstVisibleRow(6);
        return utils.waitForGanttRendered(oGantt).then(function () {
                var oDragShapeDom = document.querySelector("g[data-sap-gantt-shape-id='6_task_0']"),
				shapePosition = oDragShapeDom.children[2].getBoundingClientRect().left,
                oDragShape = Element.getElementById(oDragShapeDom.id);
                var oSvgOffset = this.getSvgOffset();
                var iSvgLeft = oSvgOffset.left;
                var iSvgTop = oSvgOffset.top;
                var iPageY = iSvgTop + 10;
                oDragShape.setSelected(true);
				oGantt.attachEvent("shapeDrop", function (oEvent) {
					var oDataModel = oGantt.getModel("data");
					var oNewDateTime = oEvent.getParameter("newDateTime");
					var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
					var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");
					var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
					var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
					var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
					if (oGantt.getGhostAlignment() === GhostAlignment.End) {
						iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
					}

					var getBindingContextPath = function (sShapeUid) {
						var oParsedUid = Utility.parseUid(sShapeUid);
						return oParsedUid.shapeDataName;
					};

					Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
						var sPath = getBindingContextPath(sShapeUid);
						var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
						var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
						var oNewDateTime = new Date(oOldDateTime.getTime() + iMoveWidthInMs);
						var oNewEndDateTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
						oDataModel.setProperty(sPath + "/StartDate", oNewDateTime);
						oDataModel.setProperty(sPath + "/EndDate", oNewEndDateTime);
					});
				}, this);
                this.triggerDrag(oDragShapeDom, iSvgLeft + 15, iSvgLeft + 20, iSvgLeft + 60, iPageY);
                return utils.waitForGanttRendered(oGantt).then(function () {
					setTimeout(function() {
						assert.notEqual(oDragShapeDom.children[2].getBoundingClientRect().left, shapePosition, "Shape is dropped to new position successfully");
						done();
					}, 500);
                });
        }.bind(this));
    });

	QUnit.test("Testing the flow of rendering in case of disabled Pseudo shape", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setShowParentRowOnExpand(true);
		oGantt.setUseParentShapeOnExpand(true);
		return utils.waitForGanttRendered(oGantt).then(function () {
			var addBackTasksToRowsSpy = sinon.spy(oGantt, "_addBackTasksToRows");
			oGantt.toggleFullScreen(true);
			return utils.waitForGanttRendered(oGantt).then(function () {
				assert.equal(addBackTasksToRowsSpy.callCount,0, "addBackTasksToRows should not be triggered when Pseudo shape is disabled");
				addBackTasksToRowsSpy.restore();
				oGantt.toggleFullScreen(false);
				done();
			});
		});
	});
	QUnit.test("Row's data update for actions on table side", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		var iExpandIndex = 0;
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.setEnablePseudoShapes(true);
		oGantt.setShowParentRowOnExpand(true);
		oGantt.setUseParentShapeOnExpand(true);
		return utils.waitForGanttRendered(oGantt).then(function () {
			var fnColumnSort = function (oEvent) {
				oGantt.setSelectedShapeUid("");
					var aExpandedRows = oGantt._aExpandedIndices;
					if (aExpandedRows.length !== 0) {
						for (var j = 0; j < aExpandedRows.length; j++) {
							oGantt.collapse("main_row_shape", aExpandedRows[j]);
						}
					}
			};
			oGantt.getTable().attachEvent("sort", fnColumnSort, this);
			var iFirstRowTaskId = oGantt.getTable().getRows()[0].getAggregation("_settings").getTasks()[2].getTask().getShapeId();
			oGantt.expand("main_row_shape", iExpandIndex);
			return utils.waitForGanttRendered(oGantt).then(function () {
				var oColumn = oGantt.getTable().getColumns()[2];
				oGantt.getTable().sort(oColumn, SortOrder.Descending);
				return utils.waitForGanttRendered(oGantt).then(function () {
					assert.notEqual(oGantt.getTable().getRows()[0].getAggregation("_settings").getTasks()[2].getTask().getShapeId(),iFirstRowTaskId, "Rows are Sorted successfully");

					oGantt.expand("main_row_shape", 0);
					return utils.waitForGanttRendered(oGantt).then(function () {
						var oRowSettings = oGantt.getTable().getRowSettingsTemplate();
						var addBackTasksToRowsSpy = sinon.spy(oGantt, "_addBackTasksToRows");
						oGantt.collapse("main_row_shape", 0);
						oGantt.setRowSettingsTempWithInvalid(oRowSettings);
						return utils.waitForGanttRendered(oGantt).then(function () {
							assert.equal(addBackTasksToRowsSpy.callCount,2, "addBackTasksToRows is called twice to update new row settings");
							addBackTasksToRowsSpy.restore();

							oGantt.expand("main_row_shape", 0);
							return utils.waitForGanttRendered(oGantt).then(function () {
								var addBackTasksToRowsSpy = sinon.spy(oGantt, "_addBackTasksToRows");
								oGantt.collapse("main_row_shape", 0);
								oGantt.getTable().fireFilter({
									column:oGantt.getTable().getColumns()[2],
									value:"05"
								});
								return utils.waitForGanttRendered(oGantt).then(function () {
									assert.equal(addBackTasksToRowsSpy.callCount, 2, "addBackTasksToRows is called twice to update filter data");
									addBackTasksToRowsSpy.restore();
									done();
								});
							});
						});
					});
				});
			});
		});
	});

	QUnit.module("Basic ExpandModel", {
		beforeEach: function(){
			this.sut = new ExpandModel({
				baseRowHeight: 49
			});
		},
		afterEach: function() {
			this.sut.destroy();
		},
		mockExpaned: function() {
			this.sut.mExpanded = {
				"rowUid1": [
					{scheme: "main_scheme", metadata: {rowSpan: 1, main: true, rowSpanSum: 3}},
					{scheme: "expand_scheme", metadata: {rowSpan: 1, main:false, numberOfRows: 2}}
				]
			};
		}
	});
	QUnit.test("initial values", function(assert){
		assert.ok(this.sut.getBaseRowHeight() === 49, "baseRowHeight is set correctly");
		assert.ok(isEmptyObject(this.sut.mExpanded), "initial mExpanded is empty object");
	});
	QUnit.test("expand model states", function(assert){
		var bExpanded = this.sut.hasExpandedRows();
		// Initial assertion
		assert.ok(!bExpanded, "no expand rows");
		assert.equal(this.sut.isRowExpanded("rowUid1"), false, "no row is expanded");
		assert.equal(this.sut.hasNoExpandRows(), true, "hasNoExpandRows is true");
		assert.equal(this.sut.hasExpandedRows(), false, "no row expanded at all");
		// Action: Set internal value
		this.mockExpaned();
		// new assertion
		assert.ok(this.sut.hasExpandedRows(), "row with uid rowUid1 is expanded");
		assert.ok(this.sut.isRowExpanded("rowUid1"), "rowUid1 is expanded");
		assert.equal(this.sut.isRowExpanded("rowUid2"), false, "rowUid2 is not expanded");
		assert.equal(this.sut.hasExpandScheme("rowUid1", "sap_overlap"), false, "no expand scheme sap_overlap");
	});
	QUnit.test("expand scheme", function(assert){
		var sMainRowScheme = this.sut.getMainRowScheme();
		assert.equal(sMainRowScheme, undefined, "there is no main row scheme defined yet");
		sMainRowScheme = this.sut.getMainRowScheme("rowUid1");
		assert.equal(sMainRowScheme, undefined, "there is no main row scheme for rowUid1");
		assert.deepEqual(this.sut.getExpandSchemeKeys("rowUid1"), [], "expand scheme key is empty array");
		this.mockExpaned();
		sMainRowScheme = this.sut.getMainRowScheme("rowUid1");
		assert.deepEqual(sMainRowScheme, {
			key: "main_scheme",
			value: {rowSpan: 1, main: true, rowSpanSum: 3}
		});
		assert.deepEqual(this.sut.getExpandSchemeKeys("rowUid1"), ["expand_scheme"], "expand scheme found");
	});
	QUnit.module("Rescheduling of shapes", {
		beforeEach: function() {
			this.oStartDate = new Date();
			this.oEndDate = new Date();
			this.oEndDate.setDate(this.oStartDate.getDate() + 5);
			this.sut = utils.createGantt(true, new MultiActivityRowSettings({
				rowId: "row01",
				tasks: [
					new sap.gantt.simple.MultiActivityGroup({
						expandable: true,
						scheme: "main-row-scheme",
						task: [
							new BaseRectangle({
								shapeId: "task01",
								selectable: true,
								title: "Main Task1"
							})
						],
						indicators: [
							new BaseRectangle({
								shapeId: "indicator011",
								selectable: true
							}),
							new BaseRectangle({
								shapeId: "indicator012",
								selectable: true
							})
						],
						subTasks: [
							new BaseRectangle({
								time:this.oStartDate,
								endTime:this.oEndDate,
								scheme: "main-row-scheme",
								shapeId: "subtask011",
								selectable: true,
								title: "SubTask_1"
							})
						]
					})
					,
					new sap.gantt.simple.MultiActivityGroup({
						expandable: true,
						scheme: "main-row-scheme",
						task: [
							new BaseRectangle({
								shapeId: "task02",
								selectable: true,
								title: "Main Task2"
							})
						],
						indicators: [
							new BaseRectangle({
								shapeId: "indicator021",
								selectable: true
							}),
							new BaseRectangle({
								shapeId: "indicator022",
								selectable: true
							})
						],
						subTasks: [
							new BaseRectangle({
								id:"subtask012",
								time:this.oStartDate,
								endTime:this.oEndDate,
								scheme: "main-row-scheme",
								shapeId: "subtask021",
								selectable: true,
								title: "SubTask_2"
							})
						]
					})
				]
			}), true);
			this.sut.addShapeScheme(new sap.gantt.simple.ShapeScheme({
				key: "main-row-scheme",
				rowSpan: 1
			}));
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.sut.destroy();
			utils.destroyGantt();
		}
	});
	QUnit.test("Maxlevel update on reschedule", function (assert) {
		var iExpandIndex = 0;
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.setExpandedRowHeight(25);
			var prevNumOfRows, oMain;
			this.sut.expand("main-row-scheme", iExpandIndex);
			return utils.waitForGanttRendered(this.sut).then(function () {
				return new Promise(function (resolve1) {
					var newTime = new Date();
					newTime.setDate(new Date().getDate() + 45);
					this.sut.getTable().getRows()[0].getAggregation("_settings").getTasks()[1].getSubTasks()[0].setTime(newTime);
					var oRowSettings = this.sut.getTable().getRows()[0].getAggregation("_settings");
					var sUid = oRowSettings.getRowUid();
					oMain = this.sut._oExpandModel.getMainRowScheme(sUid);
					prevNumOfRows = oMain.value.numberOfRows;
					setTimeout(function () {
						assert.ok(this.sut._oExpandModel.rowMaxLevelMap["row0"] != prevNumOfRows, "Maxlevel of row is updated");
						resolve1();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("expand after scroll", function (assert) {
		this.sut.getTable().setFirstVisibleRow(2);
		var iExpandIndex = 3;
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.expand("main-row-scheme", iExpandIndex);
			assert.ok(this.sut.getTable().getFirstVisibleRow() != 0);
			assert.ok(this.sut.getTable().getRows()[0].getIndex() != 0);
			assert.ok(this.sut._oExpandModel.rowMaxLevelMap["row3"] != undefined);
		}.bind(this));
	});
	QUnit.test("Rendering gantt chart incase of lazy loading", function (assert) {
		var iExpandIndex = 10;
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.setExpandedRowHeight(25);
			this.sut.expand("main-row-scheme", iExpandIndex);
			return utils.waitForGanttRendered(this.sut).then(function () {
				return new Promise(function (resolve1) {
					assert.ok(true, "InnerGanttChart has rendered successfully");
					resolve1();
				});
			});
		}.bind(this));
	});
	QUnit.module("interactive expand chart", {
		beforeEach: function() {
			this.sut = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new SteppedTask({
						shapeId: "{Id}",
						expandable: true,
						task: new BaseRectangle({
							time: "{StartDate}",
							endTime: "{EndDate}",
							fill: "#008FD3",
							height: 20
						}),
						breaks: {
							path: "breaks",
							template: new BaseRectangle({
								scheme: "break",
								time: "{StartDate}",
								endTime: "{EndDate}",
								fill: "red",
								height: 20
							}),
							templateShareable: true
						}
					})
				]
			}), true/**bCreate expand data */);
			this.sut.addShapeScheme(new sap.gantt.simple.ShapeScheme({
				key: "break",
				rowSpan: 1
			}));
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getMainShape: function(iIndex) {
			var oRowSettings = this.sut.getTable().getRows()[iIndex].getAggregation("_settings");
			return oRowSettings.getShapes1()[0];
		}
	});
	QUnit.test("expand & collapse single row", function (assert) {
		var iExpandIndex = 0;
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.expand("break", iExpandIndex);
			return new Promise(function (resolve1) {
				setTimeout(function () {
					var oMainShape = this.getMainShape(iExpandIndex);
					assert.ok(oMainShape != null, "the main shape can be found");
					assert.ok(oMainShape.getBreaks().length > 1, "there has lazy and expandable shapes");
					var aExpandableShapes = oMainShape.getParent().getAllExpandableShapes();
					var aAllBreaks = [];
					aExpandableShapes.forEach(function(oMainshape){ // eslint-disable-line
						var aBreaks = AggregationUtils.getLazyElementsByScheme(oMainshape, oMainShape.getParent().getParentGantt().getShapeSchemes()[1].getKey());
						aAllBreaks = aAllBreaks.concat(aBreaks);
					});
					aAllBreaks.forEach(function (oBreak) {
						assert.equal(oBreak.getParent().getParent().getDomRef().querySelectorAll("#" + oBreak.getId()).length, 1, "each expand shape has DOM ref");
					});
					// assertion that the mExpanded
					var mExpanded = this.sut._oExpandModel.mExpanded;
					assert.notEqual(mExpanded, null, "mExpanded has values");
					assert.equal(Object.keys(mExpanded).length, 1, "only 1 key exists");
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolveFinal) {
					this.sut.collapse("break", iExpandIndex);
					setTimeout(function () {
						this.getMainShape(iExpandIndex).getBreaks().forEach(function (oBreak) {
							assert.equal(oBreak.getDomRef(), null, "expand shape DOM refs are removed");
						});
						resolveFinal();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Shapes in row calculation", function (assert) {
		var iExpandIndex = 0;
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.expand("break", iExpandIndex);
			return new Promise(function (resolve1) {
				setTimeout(function () {
					var oMainShape = this.getMainShape(iExpandIndex);
					var aExpandableShapes = oMainShape.getParent().getAllExpandableShapes();
					aExpandableShapes.forEach(function(oMainshape){ // eslint-disable-line
						var aBreaks = AggregationUtils.getLazyElementsByScheme(oMainshape, oMainShape.getParent().getParentGantt().getShapeSchemes()[1].getKey());
						var startTime1 = aBreaks[0].getTime().getTime();
						var endTime1 = aBreaks[0].getEndTime().getTime();
						var startTime2 = aBreaks[2].getTime().getTime();
						var endTime2 = aBreaks[2].getEndTime().getTime();
						var iDuration = endTime1 - startTime1;
						var aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						assert.ok(aRanges != null, "the main shape can be found");
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row - startTime same as endTime");
						aBreaks[0].setEndTime(new Date(endTime1 + 10));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[0].setEndTime(new Date(endTime1));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row - endTime > startTime but less than 1 second");
						aBreaks[1].setEndTime(new Date(startTime1));
						aBreaks[1].setTime(new Date(startTime1 - iDuration));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[1].setTime(new Date(endTime1));
						aBreaks[1].setEndTime(new Date(startTime2));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row - endTime <= startTime");
						aBreaks[1].setEndTime(new Date(startTime1 + 10));
						aBreaks[1].setTime(new Date(startTime1 - iDuration));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[1].setTime(new Date(endTime1));
						aBreaks[1].setEndTime(new Date(startTime2));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row - endTime > startTime but less than 1 second");
						aBreaks[2].setTime(new Date(startTime2 - 1000));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[2].setTime(new Date(startTime2));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row - startTime < endTime but less than 1 second");
						aBreaks[1].setEndTime(new Date(endTime2));
						aBreaks[1].setTime(new Date(startTime2));
						aBreaks[2].setEndTime(new Date(startTime2));
						aBreaks[2].setTime(new Date(endTime1));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[1].setEndTime(new Date(startTime2));
						aBreaks[1].setTime(new Date(endTime1));
						aBreaks[2].setEndTime(new Date(endTime2));
						aBreaks[2].setTime(new Date(startTime2));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row - current shape's startTime >= prev shape's endtime and current shape's endtime <= next shape's startTime");
						aBreaks[1].setEndTime(new Date(endTime2));
						aBreaks[1].setTime(new Date(startTime2));
						aBreaks[2].setEndTime(new Date(startTime2 + 10));
						aBreaks[2].setTime(new Date(endTime1 - 1000));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[1].setEndTime(new Date(startTime2));
						aBreaks[1].setTime(new Date(endTime1));
						aBreaks[2].setEndTime(new Date(endTime2));
						aBreaks[2].setTime(new Date(startTime2));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row - current shape's startTime < prev shape's endtime and current shape's endtime > next shape's startTime but less than 1 second");
						aBreaks[2].setEndTime(new Date(startTime1));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[2].setEndTime(new Date(endTime2));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row - endTime <= startTime");
						aBreaks[2].setEndTime(new Date(startTime1 + 10));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[2].setEndTime(new Date(endTime2));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row - endTime > startTime but less than 1 second");
						aBreaks[1].setEndTime(new Date(endTime2));
						aBreaks[1].setTime(new Date(startTime2));
						aBreaks[2].setEndTime(new Date(startTime2 + 10000));
						aBreaks[2].setTime(new Date(endTime1 - 10000));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[1].setEndTime(new Date(startTime2));
						aBreaks[1].setTime(new Date(endTime1));
						aBreaks[2].setEndTime(new Date(endTime2));
						aBreaks[2].setTime(new Date(startTime2));
						assert.ok(aRanges[0].length === 2 && aRanges[1].length === 1, "2 shapes in 1st row and 3rd shape in 2nd row");
						aBreaks[1].setEndTime(new Date(startTime1));
						aBreaks[1].setTime(new Date(startTime1));
						aBreaks[0].setEndTime(new Date(startTime1));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[1].setTime(new Date(endTime1));
						aBreaks[1].setEndTime(new Date(startTime2));
						aBreaks[0].setEndTime(new Date(endTime1));
						assert.ok(aRanges[0].length === 2 && aRanges[1].length === 1, "2 shapes with same start and endtime(endtime-startTime=0) displayed in different rows");
						aBreaks[2].setEndTime(new Date(startTime1 + 1000));
						aBreaks[2].setTime(new Date(startTime1));
						aBreaks[0].setEndTime(new Date(startTime1 + 1000));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[2].setTime(new Date(startTime2));
						aBreaks[2].setEndTime(new Date(endTime2));
						aBreaks[0].setEndTime(new Date(endTime1));
						assert.ok(aRanges[0].length === 2 && aRanges[1].length === 1, "2 shapes with same start and endtime(endtime-startTime=1 sec) displayed in different rows");
						aBreaks[1].setEndTime(new Date(endTime2));
						aBreaks[1].setTime(new Date(startTime2));
						aBreaks[2].setTime(new Date(endTime1 - 1000));
						aBreaks[2].setEndTime(new Date(startTime2 - 1000));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[2].setTime(new Date(startTime2));
						aBreaks[2].setEndTime(new Date(endTime2));
						aBreaks[1].setEndTime(new Date(startTime2));
						aBreaks[1].setTime(new Date(endTime1));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row");
						aBreaks[1].setEndTime(new Date(endTime2));
						aBreaks[1].setTime(new Date(startTime2));
						aBreaks[2].setTime(new Date(endTime1 + 2000));
						aBreaks[2].setEndTime(new Date(startTime2 + 1000));
						aRanges = GanttUtils._partitionShapesIntoOverlappingRanges(aBreaks, "time", "endTime").shapesWithRowLevels;
						aBreaks[2].setTime(new Date(startTime2));
						aBreaks[2].setEndTime(new Date(endTime2));
						aBreaks[1].setEndTime(new Date(startTime2));
						aBreaks[1].setTime(new Date(endTime1));
						assert.ok(aRanges[0].length === 3, "3 shapes displayed in same row");
					});
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolveFinal) {
					this.sut.collapse("break", iExpandIndex);
					resolveFinal();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("expand & collapse multiple rows", function (assert) {
		var aExpandIndex = [0, 2];
		return utils.waitForGanttRendered(this.sut).then(function () {
			return new Promise(function (resolve1) {
				setTimeout(function () {
					this.sut.expand("break", aExpandIndex);
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolve2) {
					setTimeout(function () {
						aExpandIndex.forEach(function (iIndex) {
							var oMainShape = this.getMainShape(iIndex);
							var aExpandableShapes = oMainShape.getParent().getAllExpandableShapes();
							var aAllBreaks = [];
							aExpandableShapes.forEach(function(oMainshape){ // eslint-disable-line
								var aBreaks = AggregationUtils.getLazyElementsByScheme(oMainshape, oMainShape.getParent().getParentGantt().getShapeSchemes()[1].getKey());
								aAllBreaks = aAllBreaks.concat(aBreaks);
							});
							aAllBreaks.forEach(function (oBreak) {
								assert.equal(oBreak.getParent().getParent().getDomRef().querySelectorAll("#" + oBreak.getId()).length, 1, "expand row: " + iIndex + " has DOM");
							});
						}.bind(this));
						resolve2();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this)).then(function () {
					this.sut.collapse("break", [2]);
					return new Promise(function (resolveFinal) {
						setTimeout(function () {
							var oFirstRowMainShape = this.getMainShape(0);
							oFirstRowMainShape.getBreaks().forEach(function (oBreak) {
								assert.notEqual(oBreak.getDomRef(), null, "expand row: " + oFirstRowMainShape.getId() + " has no DOM because of not collapsed");
							});
							var oThirdRowMainShape = this.getMainShape(2);
							oThirdRowMainShape.getBreaks().forEach(function (oBreak) {
								assert.equal(oBreak.getDomRef(), null, "expand row: " + oThirdRowMainShape.getId() + " has no DOM after collapse");
							});
							resolveFinal();
						}.bind(this), 400); // leave 400 ms to render completely
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("expand & collapse single row - hidden parent row", function (assert) {
		var iExpandIndex = 0;
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.setShowParentRowOnExpand(false);
			this.sut.setExpandedRowHeight(25);
			this.sut.expand("break", iExpandIndex);
			return new Promise(function (resolve1) {
				setTimeout(function () {
					var oMainShape = this.getMainShape(iExpandIndex);
					assert.ok(oMainShape != null, "the main shape can be found");
					assert.ok(oMainShape.getBreaks().length > 1, "there has lazy and expandable shapes");
					var aExpandableShapes = oMainShape.getParent().getAllExpandableShapes();
					var aAllBreaks = [];
					aExpandableShapes.forEach(function(oMainshape){ // eslint-disable-line
						var aBreaks = AggregationUtils.getLazyElementsByScheme(oMainshape, oMainShape.getParent().getParentGantt().getShapeSchemes()[1].getKey());
						aAllBreaks = aAllBreaks.concat(aBreaks);
					});
					aAllBreaks.forEach(function (oBreak) {
						assert.equal(oBreak.getParent().getParent().getDomRef().querySelectorAll("#" + oBreak.getId()).length, 1, "each expand shape has DOM ref");
					});
					// assertion that the mExpanded
					var mExpanded = this.sut._oExpandModel.mExpanded;
					assert.notEqual(mExpanded, null, "mExpanded has values");
					assert.equal(Object.keys(mExpanded).length, 1, "only 1 key exists");
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolveFinal) {
					this.sut.collapse("break", iExpandIndex);
					setTimeout(function () {
						this.getMainShape(iExpandIndex).getBreaks().forEach(function (oBreak) {
							assert.equal(oBreak.getDomRef(), null, "expand shape DOM refs are removed");
						});
						resolveFinal();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Test after gantt rerenders expand state is maintained", function (assert) {
		var aExpandIndex = [0, 2];
		return utils.waitForGanttRendered(this.sut).then(function () {
			return new Promise(function (resolve1) {
				setTimeout(function () {
					this.sut.expand("break", aExpandIndex);
					var oRowSettings = new GanttRowSettings({
						rowId: "{Id}",
						shapes1: [
							new SteppedTask({
								shapeId: "{Id}",
								expandable: true,
								task: new BaseRectangle({
									time: "{StartDate}",
									endTime: "{EndDate}",
									fill: "#008FD3",
									height: 20
								}),
								breaks: {
									path: "breaks",
									template: new BaseRectangle({
										scheme: "break",
										time: "{StartDate}",
										endTime: "{EndDate}",
										fill: "red",
										height: 20
									}),
									templateShareable: true
								}
							})
						]
					});
					this.sut.getTable().setRowSettingsTemplate(oRowSettings);
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolve2) {
					setTimeout(function () {
						aExpandIndex.forEach(function (iIndex) {
							var oMainShape = this.getMainShape(iIndex);
							var aExpandableShapes = oMainShape.getParent().getAllExpandableShapes();
							var aAllBreaks = [];
							aExpandableShapes.forEach(function(oMainshape){ // eslint-disable-line
								var aBreaks = AggregationUtils.getLazyElementsByScheme(oMainshape, oMainShape.getParent().getParentGantt().getShapeSchemes()[1].getKey());
								aAllBreaks = aAllBreaks.concat(aBreaks);
							});
							aAllBreaks.forEach(function (oBreak) {
								assert.equal(oBreak.getParent().getParent().getDomRef().querySelectorAll("#" + oBreak.getId()).length, 1, "expand row: " + iIndex + " has DOM");
							});
						}.bind(this));
						resolve2();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this)).then(function () {
					this.sut.collapse("break", [2]);
					return new Promise(function (resolveFinal) {
						setTimeout(function () {
							var oFirstRowMainShape = this.getMainShape(0);
							oFirstRowMainShape.getBreaks().forEach(function (oBreak) {
								assert.notEqual(oBreak.getDomRef(), null, "expand row: " + oFirstRowMainShape.getId() + " has no DOM because of not collapsed");
							});
							var oThirdRowMainShape = this.getMainShape(2);
							oThirdRowMainShape.getBreaks().forEach(function (oBreak) {
								assert.equal(oBreak.getDomRef(), null, "expand row: " + oThirdRowMainShape.getId() + " has no DOM after collapse");
							});
							resolveFinal();
						}.bind(this), 400); // leave 400 ms to render completely
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.module("MultiAcitivtyGroup - Expand", {
		beforeEach: function() {
			this.oStartDate = new Date();
			this.oEndDate = new Date();
			this.oEndDate.setDate(this.oStartDate.getDate() + 5);
			this.oStartDate2 = new Date();
			this.oEndDate2 = new Date();
			this.oStartDate2.setDate(new Date().getDate() + 10);
			this.oEndDate2.setDate(new Date().getDate() + 15);
			this.sut = utils.createGantt(true, new MultiActivityRowSettings({
				rowId: "row01",
				tasks: [
					new sap.gantt.simple.MultiActivityGroup({
						expandable: true,
						task: [
								new BaseRectangle({
									shapeId: "task01",
									selectable: true,
									title: "Main Task",
									time: this.oStartDate,
									endTime: this.oEndDate2,
									fill: "red"
								})
						],
						indicators: [
								new BaseRectangle({
									scheme: "subtasks",
									shapeId: "indicator01",
									selectable: true,
									time: this.oStartDate2,
									endTime: this.oEndDate2
								})
							],
						subTasks: [
								new BaseGroup({
									expandable: true,
									scheme: "subtasks",
									shapes: [
										new BaseRectangle({
											scheme: "subtasks",
											shapeId: "subtask01",
											selectable: true,
											title: "SubTask_1",
											time: this.oStartDate,
											endTime: this.oEndDate,
											fill: "blue"
										}),
										new BaseRectangle({
											scheme: "subtasks",
											shapeId: "subtask02",
											selectable: true,
											title: "SubTask_2",
											time: this.oStartDate2,
											endTime: this.oEndDate2,
											fill: "blue"
										})
									]
								})
							]
					})
				]
			}), true);
			this.sut.addShapeScheme(new sap.gantt.simple.ShapeScheme({
				key: "subtasks",
				rowSpan: 1
			}));
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getMainShape: function(iIndex) {
			var oRowSettings = this.sut.getTable().getRows()[iIndex].getAggregation("_settings");
			return oRowSettings.getTasks()[0];
		}
	});
	QUnit.test("expand & collapse single row", function (assert) {
		var iExpandIndex = 0;
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.getMainShape(iExpandIndex);
			this.sut.expand("subtasks", iExpandIndex);
			return utils.waitForGanttRendered(this.sut).then(function () {
				return new Promise(function (resolve1) {
					setTimeout(function () {
						var oMainShape = this.getMainShape(iExpandIndex);
						assert.ok(oMainShape != null, "The main shape can be found");
						assert.ok(oMainShape.getSubTasks()[0].getShapes().length > 1, "There has lazy and expandable shapes");
						assert.ok(oMainShape.getSubTasks()[0].getTime() , "StartTime is set for the Group");
						assert.ok(oMainShape.getSubTasks()[0].getEndTime() , "EndTime is set for the Group");
						assert.equal(oMainShape.getSubTasks()[0].getTime().toString(), this.oStartDate.toString(), "StartTime is correct for the Group");
						assert.equal(oMainShape.getSubTasks()[0].getEndTime().toString(), this.oEndDate2.toString(), "EndTime is correct for the Group");
						var aExpandableShapes = oMainShape.getParent().getAllExpandableShapes();
						var aAllSubTasks = [];
						aExpandableShapes.forEach(function(oMainshape){ // eslint-disable-line
							var aBreaks = AggregationUtils.getLazyElementsByScheme(oMainshape, oMainShape.getParent().getParentGantt().getShapeSchemes()[1].getKey());
							aAllSubTasks = aAllSubTasks.concat(aBreaks);
						});
						aAllSubTasks.forEach(function (oSubTask) {
							assert.equal(oSubTask.getParent().getParent().getDomRef().querySelectorAll("#" + oSubTask.getId()).length, 1, "each expand shape has DOM ref");
						});
						// assertion that the mExpanded
						var mExpanded = this.sut._oExpandModel.mExpanded;
						assert.notEqual(mExpanded, null, "mExpanded has values");
						assert.equal(Object.keys(mExpanded).length, 1, "only 1 key exists");
						resolve1();
					}.bind(this), 1000); // leave 400 ms to render completely
				}.bind(this)).then(function () {
					return new Promise(function (resolveFinal) {
						this.sut.collapse("subtasks", iExpandIndex);
						setTimeout(function () {
							this.getMainShape(iExpandIndex).getSubTasks().forEach(function (oSubTask) {
								assert.equal(oSubTask.getDomRef(), null, "expand shape DOM refs are removed");
							});
							resolveFinal();
						}.bind(this), 1000); // leave 400 ms to render completely
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.module("MultiAcitivtyGroup - Expand with relation", {
        beforeEach: function() {
            this.oStartDate = new Date();
            this.oEndDate = new Date();
            this.oEndDate.setDate(this.oStartDate.getDate() + 5);
            this.oStartDate2 = new Date();
            this.oEndDate2 = new Date();
            this.oStartDate2.setDate(new Date().getDate() + 10);
            this.oEndDate2.setDate(new Date().getDate() + 15);
            this.sut = utils.createGantt(true, new MultiActivityRowSettings({
                rowId: "row01",
				 tasks: [
                    new sap.gantt.simple.MultiActivityGroup({
                        expandable: true,
                        task: [
                                new BaseRectangle({
                                    shapeId: "task01",
                                    selectable: true,
                                    title: "Main Task",
                                    time: this.oStartDate,
                                    endTime: this.oEndDate2,
                                    fill: "red"
                                })
                            ],
							 subTasks: [
                                new BaseRectangle({
                                    scheme: "subtasks",
                                    expandable: true,
                                    shapeId: "subtask01",
                                    selectable: true,
                                    title: "SubTask_1",
                                    time: this.oStartDate,
                                    endTime: this.oStartDate2,
                                    fill: "blue"
                                }),
                                new BaseRectangle({
                                    scheme: "subtasks",
                                    expandable: true,
                                    shapeId: "subtask02",
                                    selectable: true,
                                    title: "SubTask_2",
                                    time: this.oStartDate,
                                    endTime: this.oEndDate2,
                                    fill: "green"
                                }),
								new BaseRectangle({
                                    scheme: "subtasks",
                                    expandable: true,
                                    shapeId: "subtask03",
                                    selectable: true,
                                    title: "SubTask_3",
                                    time: this.oEndDate,
                                    endTime: this.oEndDate2,
                                    fill: "red"
                                })
                            ]
							 })
                ]
            }), true);
            this.sut.addShapeScheme(new sap.gantt.simple.ShapeScheme({
                key: "subtasks",
                rowSpan: 1
            }));
            this.sut.placeAt("qunit-fixture");
        },
        afterEach: function() {
            utils.destroyGantt();
        },
        getMainShape: function(iIndex) {
            var oRowSettings = this.sut.getTable().getRows()[iIndex].getAggregation("_settings");
            return oRowSettings.getTasks()[0];
        }
    });
    QUnit.test("expand & collapse single row with relation", function (assert) {
        var iExpandIndex = 0;
        return utils.waitForGanttRendered(this.sut).then(function () {
            this.getMainShape(iExpandIndex);
            this.sut.expand("subtasks", iExpandIndex);
            var oRls = new sap.gantt.simple.Relationship({
                type: "StartToStart",
                predecessor: "subtask03",
                successor: "subtask02",
                shapeTypeStart: "Square",
                shapeTypeEnd: "Circle",
				relationshipOverDivider:true
            });
            this.sut.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
            return utils.waitForGanttRendered(this.sut).then(function () {
				assert.ok(oRls.getD().includes(NaN) == false, " U Relationship instance is drawn properly.");
				return utils.waitForGanttRendered(this.sut).then(function () {
					this.sut.expand("subtasks", iExpandIndex);
					var oRls1 = new sap.gantt.simple.Relationship({
						type: "StartToFinish",
						predecessor: "subtask01",
						successor: "subtask03",
						shapeTypeStart: "Square",
						shapeTypeEnd: "Circle",
						relationshipOverDivider:true
					});
					this.sut.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls1);
					return utils.waitForGanttRendered(this.sut).then(function () {
						assert.ok(oRls1.getD().includes(NaN) == false, " S Relationship instance is drawn properly.");
					});
				}.bind(this));
            }.bind(this));
        }.bind(this));
	});
	QUnit.module("MultiAcitivtyGroup - showParentRowOnExpand and useParentRowOnExpand", {
		beforeEach: function() {
			//Set the dates
			var currentDate = new Date(),
					iMilliSecPerDay = 86400000;
			this.firstTaskStartDate = currentDate;
			this.firstTaskEndDate = new Date(currentDate.getTime() + 15 * iMilliSecPerDay);
			this.secondTaskStartDate = new Date(currentDate.getTime() + 5 * iMilliSecPerDay);
			this.secondTaskEndDate = new Date(currentDate.getTime() + 10 * iMilliSecPerDay);
			//Create the schemes
			var oSubTaskScheme = new ShapeScheme({
				key: "subtasks",
				rowSpan: 1
			});
			//Create the gantt
			this.sut = utils.createGantt(true, new MultiActivityRowSettings({
				rowId: "row01",
				tasks: [
					new sap.gantt.simple.MultiActivityGroup({
						scheme: "default",
						expandable: true,
						task: [
							new BaseRectangle("task01",{
								scheme: "default",
								shapeId: "task01",
								title: "Main Task 1",
								time: this.firstTaskStartDate,
								endTime: this.firstTaskEndDate,
								fill: "red",
								selectable: true
							})
						],
						indicators: [
							new BaseRectangle({
								scheme: "subtasks",
								shapeId: "indicator01",
								time: this.firstTaskStartDate,
								endTime: this.firstTaskEndDate
							})
						],
						subTasks: [
							new BaseRectangle({
								expandable: true,
								scheme: "subtasks",
								shapeId: "subtask01",
								title: "Sub Task 1",
								time: this.firstTaskStartDate,
								endTime: this.firstTaskEndDate,
								fill: "red",
								selectable: true
							})
						]
					})
				]
			}), true);
			//Set the schemes
			this.sut.addShapeScheme(oSubTaskScheme);
			//Place Gantt at Qunit fixture
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getMainShape: function(iIndex) {
			var oRowSettings = this.sut.getTable().getRows()[iIndex].getAggregation("_settings");
			return oRowSettings.getTasks()[0];
		}
	});
	QUnit.test("Expand - showParentRow - true and useParentRow - false", function (assert) {
		var done = assert.async();
		var iExpandIndex = 0;
		return utils.waitForGanttRendered(this.sut).then(function () {
            var oMainShape = this.getMainShape(iExpandIndex);
            this.sut.expand("subtasks", iExpandIndex);
			var oInnerGanttRenderSpy = sinon.spy(this.sut.getInnerGantt().getRenderer(), "render");
			return utils.waitForGanttRendered(this.sut).then(function () {
				assert.ok(oInnerGanttRenderSpy.calledOnce, "Render called only once");
				var oParentRowSettingDomRef = oMainShape.getParentRowSettings().getDomRef();
				assert.equal(oParentRowSettingDomRef.querySelectorAll("#" + oMainShape.getId()).length, 1, "Parent task is rendered");
				assert.equal(oParentRowSettingDomRef.querySelectorAll("#" + oMainShape.getSubTasks()[0].getId()).length, 1, "Sub task is rendered");
				oInnerGanttRenderSpy.restore();
				done();
			});
        }.bind(this));
	});
	QUnit.test("Expand - showParentRow - false and useParentRow - false", function (assert) {
		var done = assert.async();
		var iExpandIndex = 0;
		this.sut.setShowParentRowOnExpand(false);
		return utils.waitForGanttRendered(this.sut).then(function () {
            var oMainShape = this.getMainShape(iExpandIndex);
            this.sut.expand("subtasks", iExpandIndex);
			var oInnerGanttRenderSpy = sinon.spy(this.sut.getInnerGantt().getRenderer(), "render");
			return utils.waitForGanttRendered(this.sut).then(function () {
				assert.ok(oInnerGanttRenderSpy.calledOnce, "Render called only once");
				var oParentRowSettingDomRef = oMainShape.getParentRowSettings().getDomRef();
				assert.equal(oParentRowSettingDomRef.querySelectorAll("#" + oMainShape.getId()).length, 0, "Parent task is not rendered");
				assert.equal(oParentRowSettingDomRef.querySelectorAll("#" + oMainShape.getSubTasks()[0].getId()).length, 1, "Sub task is rendered");
				oInnerGanttRenderSpy.restore();
				done();
			});
        }.bind(this));
	});
	QUnit.test("Expand - showParentRow - false and useParentRow - true", function (assert) {
		var done = assert.async();
		var iExpandIndex = 0;
		this.sut.setUseParentShapeOnExpand(true);
		this.sut.setShowParentRowOnExpand(false);
		return utils.waitForGanttRendered(this.sut).then(function () {
			var oMainShape = this.getMainShape(iExpandIndex);
			var oTask = oMainShape.getTask();
			this.sut.expand("default", iExpandIndex);
			var oInnerGanttRenderSpy = sinon.spy(this.sut.getInnerGantt().getRenderer(), "render");
			return utils.waitForGanttRendered(this.sut).then(function () {
				assert.ok(oInnerGanttRenderSpy.calledOnce, "Render called only once");
				oTask.setSelected(true);
				return utils.waitForGanttRendered(this.sut).then(function () {
					var oParentRowSettingDomRef = oMainShape.getParentRowSettings().getDomRef();
					oTask.setSelected(true);
					var oSelectionModel = this.sut.oSelection.mSelected;
					var sSelectedShapeUid = Object.keys(oSelectionModel.uid)[0];
					assert.equal(sSelectedShapeUid, oTask.getShapeUid(), "Task is selected after expand");
					assert.equal(oParentRowSettingDomRef.querySelectorAll("#" + oMainShape.getId()).length, 0, "Parent row is not rendered");
					assert.equal(oParentRowSettingDomRef.querySelectorAll("#" + oMainShape.getSubTasks()[0].getId()).length, 0, "Expanded shape doesn't use SubTasks");
					oInnerGanttRenderSpy.restore();
					done();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Expand - showParentRow - true and useParentRow - true", function (assert) {
		var done = assert.async();
		var iExpandIndex = 0;
		this.sut.setUseParentShapeOnExpand(true);
		return utils.waitForGanttRendered(this.sut).then(function () {
            var oMainShape = this.getMainShape(iExpandIndex);
            this.sut.expand("default", iExpandIndex);
			var oInnerGanttRenderSpy = sinon.spy(this.sut.getInnerGantt().getRenderer(), "render");
			return utils.waitForGanttRendered(this.sut).then(function () {
				assert.ok(oInnerGanttRenderSpy.calledOnce, "Render called only once");
				var oParentRowSettingDomRef = oMainShape.getParentRowSettings().getDomRef();
				assert.equal(oParentRowSettingDomRef.querySelectorAll("#" + oMainShape.getId()).length, 0, "Parent row is not rendered");
				assert.equal(oParentRowSettingDomRef.querySelectorAll("#" + oMainShape.getSubTasks()[0].getId()).length, 0, "Expanded shape doesn't use SubTasks");
				oInnerGanttRenderSpy.restore();
				done();
			});
        }.bind(this));
	});

	QUnit.module("Overlay shape", {
		beforeEach: function() {
			const overlay5 = new GanttRowOverlay({
				expandedOverlay:{
					path: "overlayData>overlays/expandedOverlays",
					templateShareable: true,
					template: new Overlay({
						shape: new BaseImage({
									src:"{overlayData>Src}",
									time:"{overlayData>StartDate}",
									endTime:"{overlayData>EndDate}",
									fill:"sapUiCriticalElement",
									selectable: true,
									scheme:"main_row_shape",
									shapeId:"{overlayData>shapeId}"

								})
					})
				},
				staticOverlay:{
					path: "overlayData>overlays/staticOverlays",
					templateShareable: true,
					template: new Overlay({
						shape: new BaseImage({
							src:"{overlayData>Src}",
							time:"{overlayData>StartDate}",
							endTime:"{overlayData>EndDate}",
							fill:"sapUiCriticalElement",
							selectable: true,
							scheme:"main_row_shape",
							shapeId:"{overlayData>shapeId}"
								})
					})
				}
			});
			overlay5.bindObject("overlayData>/");
			this.sut = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					showSearchButton: true,
					content: [
						new Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [GanttQUnitUtils.createGanttWithODataModelMultiactivity(null, new MultiActivityRowSettings({
					rowId: "{data>ProjectElemID}",
					highlight:"{data>Status}",
					overlays1: {
						templateShareable: true,
						path: "data>ProjectOverlays1Shapes",
						template: new GanttRowOverlay({
							expandedOverlay:{
								path: "data>Overlays1ToOverlay",
								templateShareable: true,
								template: new Overlay({
									overlayLevel: "{data>overlayLevel}",
									shape: new BaseGroup({
										selectable: true,
										shapeId:"{data>shapeId}",
										scheme:"main_row_shape",
										shapes: [
													new BaseText({
														time: "{data>EndDate}",
														text: "{data>Tooltip}" ,
														fill: "#red",
														selectable: true
													}),
													new BaseImage({
														src:"{data>Src}",
														time:"{data>StartDate}",
														fill:"red",
														selectable: true
													})
										]
									})
								})
							},
							staticOverlay:{
								path: "data>Overlays1ToOverlay",
								templateShareable: true,
								template: new Overlay({
									shape: new BaseImage({
												src:"{data>Src}",
												time:"{data>StartDate}",
												shapeId:"{data>shapeId}",
												fill:"red",
												selectable: true
											})
								})
							}
						})
					},
					overlays2: {
						templateShareable: true,
						path: "data>ProjectOverlays2Shapes",
						template: new GanttRowOverlay({
							expandedOverlay:{
								path: "data>Overlays2ToOverlay",
								templateShareable: true,
								template: new Overlay({
									overlayLevel: "{data>overlayLevel}",
									overlayShapeId: "{data>overlayShapeId}",
									shape: new BaseImage({
												src:"{data>Src}",
												time:"{data>StartDate}",
												fill:"red",
												selectable: true,
												scheme:"main_row_shape",
												shapeId:"{data>shapeId}"

											})
								})
							},
							staticOverlay:{
								path: "data>Overlays2ToOverlay",
								templateShareable: true,
								template: new Overlay({
									shape: new BaseImage({
												src:"{data>Src}",
												time:"{data>StartDate}",
												shapeId:"{data>shapeId}",
												fill:"red",
												selectable: true
											})
								})
							}
						})
					},
					overlays3: {
						templateShareable: true,
						path: "data>ProjectOverlays3Shapes",
						template: new GanttRowOverlay({
							expandedOverlay:{
								path: "data>Overlays3ToOverlay",
								templateShareable: true,
								template: new Overlay({
									overlayLevel: "{data>overlayLevel}",
									shape: new BaseChevron({
												endTime:"{data>EndDate}",
												time:"{data>StartDate}",
												fill:"red",
												selectable: true,
												scheme:"main_row_shape",
												shapeId:"{data>shapeId}"
											})
								})
							}
						})
					},
					overlays4: {
						templateShareable: true,
						path: "data>ProjectOverlays4Shapes",
						template: new GanttRowOverlay({
							expandedOverlay:{
								path: "data>Overlays4ToOverlay",
								templateShareable: true,
								template: new Overlay({
									overlayLevel: "{data>overlayLevel}",
									shape: new StockChart({
										shapeId: "{data>ResourceID}",
										title:"{data>ResourceName}",
										time:"{data>ValidityFrom}",
										endTime:"{data>ValidityTo}",
										minValue:"{data>minValue}",
										maxValue:"{data>maxValue}",
										scheme:"main_row_shape",
										relativeMiddleLinePoint:"{data>relativeMiddleLinePoint}",
										stockChartDimensions: {
											path :"data>ResourceToUtilization",
											templateShareable: true,
                                            template: new StockChartDimension({
												name:"{data>UtilizationName}",
												relativePoint:"{data>relativeMidPoint}",
												dimensionPathColor:"{data>Color}",
												stockChartPeriods: {
													path :"data>UtilizationToItems",
													templateShareable: true,
													template: new StockChartPeriod({
														from:"{data>StartDateTime}",
														to:"{data>EndDateTime}",
														value:"{data>Value}"
													}),
													templateSharable: true
												}
											})
										}
									})
								})
							}
						})
					},
					overlays5: overlay5,
					tasks: {
						templateShareable: false,
						path: "data>ProjectTasks",
						template: new MultiActivityGroup({
								expandable: true,
								selectable: true,
								scheme:"main_row_shape",
								shapeId: "{data>TaskID}",
								time: "{data>StartDate}",
								endTime: "{data>EndDate}",
								task: new BaseRectangle({
											time: "{data>StartDate}",
											endTime: "{data>EndDate}",
											title: "{data>TaskDesc}",
											fill: "#008FD3",
											scheme:"main_row_shape",
											selectable: true,
											shapeId: "{data>TaskID}"
										})

							})
						}
					})
				)]
			});
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("Check property values on collapse", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		return utils.waitForGanttRendered(oGantt).then(function () {
			var oRowSettings = oGantt.getTable().getRows()[0].getAggregation("_settings"),
				oRowSettings1 = oGantt.getTable().getRows()[1].getAggregation("_settings"),
				overlays1 = oRowSettings.getOverlays1()[0], overlays2 = oRowSettings.getOverlays2()[0], overlays3 = oRowSettings1.getOverlays3()[0],
				overlays4 = oRowSettings1.getOverlays4()[0];
			assert.equal(overlays1.getStaticOverlay().length,5,"collpased aggregations shapes are added");
			assert.equal(overlays1.getExpandedOverlay().length,0,"expanded aggregations shapes are not added");
			assert.equal(overlays2.getStaticOverlay().length,5,"collpased aggregations shapes are added");
			assert.equal(overlays2.getExpandedOverlay().length,0,"expanded aggregations shapes are not added");
			assert.equal(overlays3.getStaticOverlay().length,0,"collpased aggregations shapes are not added for overlays 3");
			assert.equal(overlays3.getExpandedOverlay().length,0,"expanded aggregations shapes are not added");
			assert.equal(overlays4.getStaticOverlay().length,0,"collpased aggregations shapes are not added for overlays 4");
			assert.equal(overlays4.getExpandedOverlay().length,0,"expanded aggregations shapes are not added");
			done();
		});
	});

	QUnit.test("Check property values on expand", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		return utils.waitForGanttRendered(oGantt).then(function () {
			oGantt.expand("main_row_shape", [0,1]);
			return utils.waitForGanttRendered(oGantt).then(function () {
				setTimeout(function(){
					var oRowSettings = oGantt.getTable().getRows()[0].getAggregation("_settings"),
						oRowSettings1 = oGantt.getTable().getRows()[1].getAggregation("_settings"),
					overlays1 = oRowSettings.getOverlays1()[0], overlays2 = oRowSettings.getOverlays2()[0], overlays3 = oRowSettings1.getOverlays3()[0], overlays4 = oRowSettings.getOverlays4()[0];
					assert.equal(overlays1.getStaticOverlay().length,0,"collpased aggregation shapes are removed");
					assert.equal(overlays1.getExpandedOverlay().length,5,"expanded aggregations shapes are added");
					assert.equal(overlays2.getStaticOverlay().length,0,"collpased aggregations shapes are removed");
					assert.equal(overlays2.getExpandedOverlay().length,5,"expanded aggregations shapes are added");
					assert.equal(overlays3.getStaticOverlay().length,0,"collpased aggregations shapes are not added for overlays 3");
					assert.equal(overlays3.getExpandedOverlay().length,5,"expanded aggregations shapes are added");
					assert.equal(overlays4.getExpandedOverlay()[0].getOverlayLevel(),1,"Default Overlay level value is assigned to overlay4 shape");
					assert.equal(overlays4.getExpandedOverlay()[0].getShape()._level,3,"Default level is set properly to overlay4 shape");
					assert.ok(overlays4.getExpandedOverlay()[0].getShape().isA('sap.gantt.simple.StockChart') && document.getElementsByClassName("sapGanttStock").length > 0,"Chart is displayed in expand mode");
					assert.ok(oGantt.getTable()._aRowHeights[0] > 66, "Chart is displayed in expand mode along with other shapes");
					var nodes = document.querySelectorAll("g[data-sap-gantt-row-id='0'] text[class='baseShapeSelection sapGanttTextNoPointerEvents']"), count = 0;
					nodes.forEach(function(node) {
						if (node.innerHTML == "Task 0_task_4"){ count++;}
					});
					assert.ok(count == 1,"No Duplicate elemets rendered");
					done();
				},1500);
			});
		});
	});
	QUnit.test("Only chart is displayed on expand", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setUseParentShapeOnExpand(false);
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "overlay4",
			rowSpan: 2
		}));
		oGantt.getTable().getRowSettingsTemplate().getBindingInfo("overlays4").template.getBindingInfo("expandedOverlay").template.getShape().setScheme("overlay4");
		return utils.waitForGanttRendered(oGantt).then(function () {
			oGantt.expand("overlay4", 0);
			return utils.waitForGanttRendered(oGantt).then(function () {
				oGantt.getInnerGantt().attachEventOnce("ganttReady",function(){
				// setTimeout(function(){
					var oRowSettings = oGantt.getTable().getRows()[0].getAggregation("_settings"), overlays4 = oRowSettings.getOverlays4()[0];
					assert.ok(overlays4.getExpandedOverlay()[0].getShape().isA('sap.gantt.simple.StockChart') && document.getElementsByClassName("sapGanttStock").length > 0,"Chart is displayed in expand mode");
					assert.ok(oGantt.getTable()._aRowHeights[0] == 99, "Only Chart is displayed with rowspan of 2 in expand mode along with parent row");
					done();
				});
			});
		});
	});

	QUnit.test("Time bound overlays", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		return utils.waitForGanttRendered(oGantt).then(function () {
			var oShapeDom1 = document.querySelector("text[data-sap-gantt-shape-id='4']"),
				oShape1 = Element.getElementById(oShapeDom1.id),
				oShapeDom3 = document.querySelector("text[data-sap-gantt-shape-id='23']");
				assert.ok(oShape1.getParent().getMetadata().isA("sap.gantt.overlays.Overlay"),"overlay rendered");
				assert.notEqual(oShapeDom1,null,"overlay1 shape exist on collapse");
				assert.equal(oShapeDom3,null,"overlay3 shape doesnt exist on collapse");
				oGantt.expand("main_row_shape", [0,1]);
				return utils.waitForGanttRendered(oGantt).then(function () {
					setTimeout(function(){
						oShapeDom1 = document.querySelector("g[data-sap-gantt-shape-id='4']");
						oShape1 = Element.getElementById(oShapeDom1.id);
						assert.equal(oShape1._level,7,"overlay1 level is set properly");
						oShapeDom3 = document.querySelector("path[data-sap-gantt-shape-id='27']");
						var oShape3 = Element.getElementById(oShapeDom3.id);
						assert.ok(oShapeDom3,"overlay3 shape exist on expand");
						assert.equal(oShape3._level,5,"overlay3 level is set properly");
						done();
					},500);
				});
		});
	});

	QUnit.test("Shape bound overlays", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		oGantt.getTable().getRowSettingsTemplate().getBindingInfo("overlays4").template.getBindingInfo("expandedOverlay").template.getShape().setScheme("overlay4");
		return utils.waitForGanttRendered(oGantt).then(function () {
			var overlayShapeDom1 = document.querySelector("text[data-sap-gantt-shape-id='14']"), oRowSettings = oGantt.getTable().getRows()[0].getAggregation("_settings"),
				overlayShape1 = Element.getElementById(overlayShapeDom1.id), overlays4 = oRowSettings.getOverlays4()[0];
				assert.ok(overlayShape1.getParent().getMetadata().isA("sap.gantt.overlays.Overlay"),"overlay rendered");
				oGantt.expand("main_row_shape", 0);
				return utils.waitForGanttRendered(oGantt).then(function () {
					setTimeout(function(){
						overlayShapeDom1 = document.querySelector("text[data-sap-gantt-shape-id='14']");
						overlayShape1 = Element.getElementById(overlayShapeDom1.id);
						var oShapeDom = document.querySelector("rect[data-sap-gantt-shape-id='0_task_3']");
						var oShape = Element.getElementById(oShapeDom.id);
						assert.equal(overlayShape1._level,oShape._level,"overlay level is set as shape level properly");
						assert.ok(overlays4.getExpandedOverlay()[0].getShape().isA('sap.gantt.simple.StockChart') && document.getElementsByClassName("sapGanttStock").length == 0,"Chart is not displayed in expand mode");
						done();
					},500);
			});
		});
	});
	QUnit.test("Dynamic Alert", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setUseParentShapeOnExpand(true);
		oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
			key: "main_row_shape",
			primary: true
		}));
		return utils.waitForGanttRendered(oGantt).then(function () {
			oGantt.expand("main_row_shape", 0);
				return utils.waitForGanttRendered(oGantt).then(function () {
					setTimeout(function(){
						const oOverlayModel = new JSONModel({
							overlays: {
								staticOverlays: [
									{
										OverlayRowID: "overlay1_row_0",
										StartDate: new Date(2015, 0, 1, 0, 0, 0),
										EndDate: new Date(2015, 0, 1, 0, 0, 0),
										overlayLevel: 21,
										Tooltip: "Tooltip for 0_task_1",
										Src: "sap-icon://alert",
										scheme: "scheme_for_overlay1"
									}
								],
								expandedOverlays: [
									{
										OverlayRowID: "overlay1_row_0",
										StartDate: new Date(2015, 0, 1, 0, 0, 0),
										EndDate: new Date(2015, 0, 1, 0, 0, 0),
										overlayLevel: 21,
										Tooltip: "Tooltip for 0_task_1",
										Src: "sap-icon://alert",
										scheme: "scheme_for_overlay1"
									}
								]
							}
						});
						assert.ok(oGantt.getTable().getRows()[0].getAggregation("_settings").getOverlays5()[0].getExpandedOverlay().length === 0,"No alerts in Overlay5");
						oGantt.setModel(oOverlayModel, "overlayData");
						return utils.waitForGanttRendered(oGantt).then(function () {
							setTimeout(function(){
								assert.ok(oGantt.getTable().getRows()[0].getAggregation("_settings").getOverlays5()[0].getExpandedOverlay().length > 0,"Added Dynamic alerts under Overlay5");
								done();
							},500);
						});
					},500);
			});
		});
	});
});
