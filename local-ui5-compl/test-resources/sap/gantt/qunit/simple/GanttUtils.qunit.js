/*global QUnit */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/ui/table/library",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/m/Panel",
	"sap/gantt/simple/GanttChartContainer",
	"sap/ui/table/rowmodes/Auto",
	"sap/ui/core/RenderManager"
], function (
	Core,
	GanttUtils,
	GanttQUnitUtils,
	Relationship,
	BaseRectangle,
	BaseChevron,
	GanttRowSettings,
	ContainerToolbar,
	ProportionZoomStrategy,
	TimeHorizon,
	JSONModel,
	GanttChartWithTable,
	tableLibrary,
	TreeTable,
	Column,
	Label,
	Panel,
	GanttChartContainer,
	AutoRowMode,
	RenderManager
) {
	"use strict";

	const TableSelectionMode = tableLibrary.SelectionMode;

	QUnit.module("BaseShape - Chain Selection", {
		beforeEach: function () {
			this.sut = GanttQUnitUtils.createGantt(true);
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		getFirstShape: function () {
			var oFirstShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			oFirstShape.setEnableChainSelection(true);
			return oFirstShape;
		},
		getSecondShape: function () {
			var oSecondShape = this.sut.getTable().getRows()[1].getAggregation("_settings").getShapes1()[0];
			oSecondShape.setEnableChainSelection(true);
			return oSecondShape;
		},
		createRelationship: function () {
			var oFirstShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			var oSecondShape = this.sut.getTable().getRows()[1].getAggregation("_settings").getShapes1()[0];
			var oRls = new Relationship({
				type: "FinishToStart",
				shapeId: "rls-1",
				selectable: true,
				predecessor: oFirstShape.getShapeId(),
				successor: oSecondShape.getShapeId()
			});
			this.sut.getTable().getRows()[0].getAggregation("_settings").addRelationship(oRls);
			this.sut.getTable().getRows()[1].getAggregation("_settings").addRelationship(oRls);

			var oChart = this.sut;
			var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
			var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
			var oRm = new RenderManager();
			oRls.renderElement(oRm, oRls, oChart.getId());
			oRm.flush(oRlsCnt);
		},

		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 2000);
		}
	});

	QUnit.test("Chain selection", function (assert) {
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			assert.expect(1);
			var oRect = this.getFirstShape();
			this.createRelationship();
			var aShapes = GanttUtils.selectAssociatedShapes({
				shape: oRect,
				ctrlOrMeta: true
			}, this.sut);
			assert.strictEqual(aShapes.length > 0, true, "Associated shapes have been selected");
		}.bind(this));
	});

	QUnit.test("Get Predecessors", function (assert) {
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			assert.expect(1);
			this.createRelationship();
			var oRect = this.getSecondShape();
			var aShapes = GanttUtils.getShapePredeccessors(oRect, this.sut);
			assert.strictEqual(aShapes.length > 0, true, "Predecessors are fetched");
		}.bind(this));
	});

	QUnit.test("Get Successors", function (assert) {
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			assert.expect(1);
			this.createRelationship();
			var oRect = this.getFirstShape();
			var aShapes = GanttUtils.getShapeSuccessors(oRect, this.sut);
			assert.strictEqual(aShapes.length > 0, true, "Successors are fetched");
		}.bind(this));
	});

	QUnit.module("functions", {
		beforeEach: function () {
			var oCurrentDate = new Date();
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new BaseRectangle({
						title: "Shape01",
						shapeId: "Shape01",
						time: oCurrentDate,
						endTime: new Date(oCurrentDate.setDate(oCurrentDate.getDate() + 1))
					}),
					new BaseChevron({
						title: "shape02",
						shapeId: "shape02",
						time: oCurrentDate,
						endTime: new Date(oCurrentDate.setDate(oCurrentDate.getDate() + 10)),
						showAnimation: true
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oGantt.destroy();
		}
	});

	QUnit.test("getShapeByShapeId", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var aShapes = GanttUtils.getShapeByShapeId(this.oGantt.getId(),['Shape01', "shape02"]);
			assert.strictEqual(aShapes.length === 2, true, "returns shape by given id");
			aShapes = GanttUtils.getShapeByShapeId(this.oGantt.getId(),['Shape01']);
			assert.strictEqual(aShapes[0].getShapeId(), "Shape01", "Shape id should be Shape01");
		}.bind(this));
	});

	QUnit.test("getShapesInRowsById", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var aShapes = GanttUtils.getShapesInRowsById(this.oGantt.getId(),['row01']);
			assert.strictEqual(aShapes.length === 2, true, "returns all shapes in the row");
		}.bind(this));
	});

	QUnit.module("ProportionZoomStrategy", {
		beforeEach: function () {
			this.oGanttChartContainer = new GanttChartContainer("container", {
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					content: [
						new sap.m.Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [
					new GanttChartWithTable({
						id:"gantt1",
						table: new TreeTable({
							columns: [
								new Column({
									label: new Label({
										text: "Name"
									}),
									template: new Label({
										text: "{name}"
									})
								}),
								new Column({
									label: new Label({
										text: "Description"
									}),
									template: new Label({
										text: "{description}"
									})
								})
							],
							selectionMode: TableSelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowMode: new AutoRowMode({
								minRowCount: 3
							}),
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape1ID}",
								shapes1: new BaseRectangle({
									shapeId: "{Rectangle1ID}",
									time: "{Rectangle1StartDate}",
									endTime: "{Rectangle1EndDate}",
									title: "{Rectangle1Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new ProportionZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20140628000000",
								endTime: "20190101000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20150101000000",
								endTime: "20150315000000"
							})
						})
					})
				],
				enableStatusBar: true
			});
			this.aGanttCharts = this.oGanttChartContainer.getGanttCharts();
			this.oGantt1 = this.aGanttCharts[0];

			var sHeight = "500px";
			document.getElementById("qunit-fixture").style.height = sHeight;
			var oPanel = new Panel({
				height: sHeight,
				content: [this.oGanttChartContainer]
			});

			var oData = {
				root : {
					name: "root",
					description: "root description",
					0: {
						name: "item1",
						description: "item1 description",
						Shape1ID: "0",
						Rectangle1ID: "0-1",
						Rectangle1StartDate: new Date(2015, 1, 6,12,0),
						Rectangle1EndDate: new Date(2015, 1, 6,12,7),
						Rectangle1Desc: "1"
					}
				}
			};

			var oModel = new JSONModel();
			oModel.setData(oData);
			oPanel.setModel(oModel);

			oPanel.placeAt("qunit-fixture");
			return GanttQUnitUtils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0], true);
		},
		afterEach: function () {
			this.oGanttChartContainer.destroy();
			this.oGanttChartContainer = undefined;
		}
	});

	QUnit.test("Test for multiple Zoom level updates", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt1).then(function () {
			this.oGantt1.getInnerGantt().attachEventOnce("ganttReady",function(){
			var oZoomInButton = this.oGanttChartContainer.getToolbar()._oZoomInButton;
			oZoomInButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(this.oGantt1).then(function () {
				this.oGantt1.getInnerGantt().attachEventOnce("ganttReady",function(){
					oZoomInButton.firePress();
					return GanttQUnitUtils.waitForGanttRendered(this.oGantt1).then(function () {
						this.oGantt1.getInnerGantt().attachEventOnce("ganttReady",function(){
							oZoomInButton.firePress();
							return GanttQUnitUtils.waitForGanttRendered(this.oGantt1).then(function () {
								this.oGantt1.getInnerGantt().attachEventOnce("ganttReady",function(){
									oZoomInButton.firePress();
									return GanttQUnitUtils.waitForGanttRendered(this.oGantt1).then(function () {
										this.oGantt1.getInnerGantt().attachEventOnce("ganttReady",function(){
											oZoomInButton.firePress();
											return GanttQUnitUtils.waitForGanttRendered(this.oGantt1).then(function () {
												this.oGantt1.getInnerGantt().attachEventOnce("ganttReady",function(){
													this.oGanttChartContainer.getToolbar().attachEventOnce("birdEyeButtonPress", function(oEvent){
															assert.ok(true);
																done();
															});
													this.oGanttChartContainer.getToolbar()._oBirdEyeButton.firePress();

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
});
