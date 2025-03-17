/*global QUnit, sinon */

sap.ui.define([
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseShape",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/MultiActivityRowSettings",
	"sap/gantt/simple/MultiActivityGroup",
	"../../simple/CustomRowSettings",
	"sap/ui/core/dnd/DragDropInfo",
	"sap/gantt/simple/AggregationUtils"
], function(GanttRowSettings, BaseShape, BaseRectangle, GanttQUnitUtils, MultiActivityRowSettings, MultiActivityGroup, CustomRowSettings, DragDropInfo, AggregationUtils) {
	"use strict";

	QUnit.module("function - getShapeUids and MultiActivity", {
		beforeEach: function() {
			this.sut = GanttQUnitUtils.createGantt(true, new MultiActivityRowSettings({
				rowId: "row01",
				tasks: [
					new sap.gantt.simple.MultiActivityGroup({
						task: [
							new BaseRectangle({
								shapeId: "task01",
								selectable: true,
								title: "Main Task"
							})
						],
						indicators: [
							new BaseRectangle({
								shapeId: "indicator01",
								selectable: true
							}),
							new BaseRectangle({
								shapeId: "indicator02",
								selectable: true
							})
						],
						subTasks: [
							new BaseRectangle({
								shapeId: "subtask01",
								selectable: true,
								title: "SubTask_1"
							}),
							new BaseRectangle({
								shapeId: "subtask02",
								selectable: true,
								title: "SubTask_2"
							})
						]
					})
				]
			}), true);
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Shall return correct Row Index from shapeUid", function(assert){
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var aTableRows = this.sut.getTable().getRows();
			aTableRows.forEach(function(oTableRow){
				var oRowSetting = oTableRow.getAggregation("_settings"),
					oMainGroup = oRowSetting.getTasks()[0],
					oMainTask = oMainGroup.getTask(),
					aSubTasks = oMainGroup.getSubTasks(),
					sExpectedRowUid;
				//Check for ShapeUids and RowIndex of Main Task
				sExpectedRowUid = "PATH:" + oRowSetting.getRowId() + "|SCHEME:default[" + oTableRow.getIndex() + "]|DATA:" + oRowSetting.getShapeBindingContextPath(oMainTask) + "[" + oMainTask.getShapeId() + "]";
				assert.equal(oRowSetting.getShapeUid(oMainTask), sExpectedRowUid, "Shape Uid is constructed correctly for Main Task");
				aSubTasks.forEach(function(oSubTask) {
					sExpectedRowUid = "PATH:" + oRowSetting.getRowId() + "|SCHEME:default[" + oTableRow.getIndex() + "]|DATA:" + oRowSetting.getShapeBindingContextPath(oSubTask) + "[" + oSubTask.getShapeId() + "]";
					assert.equal(oRowSetting.getShapeUid(oSubTask), sExpectedRowUid, "Shape Uid is constructed correctly for Sub Task");
				});
			});
		}.bind(this));
	});

	QUnit.module("GanttRowSettings", {
		beforeEach: function() {
			this.oFirstShape = new BaseShape({
				shapeId: "shape-01",
				scheme: "main"
			});
			this.oSecondShape = new BaseShape({
				shapeId: "shape-02",
				scheme: "main"
			});
			this.sut = new GanttRowSettings({
				rowId: "row-01",
				shapes1: [this.oFirstShape, this.oSecondShape],
				dragDropConfig: new DragDropInfo({
					sourceAggregation: "shapes1",
					targetAggregation: "shapes1"
				})
			});

			this.stub = sinon.stub(this.sut, "getBindingModelName");
			this.stub.returns("test");

			this.stub2 = sinon.stub(this.sut, "getShapeBindingContextPath");
			this.stub2.returns("binding-path");
		},
		afterEach: function(){
			this.sut.destroy();
			this.stub.restore();
			this.stub2.restore();
			this.sut = null;
		}
	});

	QUnit.test("shall return null if no rowId set", function(assert){
		var oRowSetting = new GanttRowSettings();
		assert.equal(oRowSetting.getRowUid(), null, "return null when no rowId specified");
	});

	QUnit.test("test - getRowUid", function(assert){
		//need chnage
		var oGantt = GanttQUnitUtils.createGantt();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aTableRows = oGantt.getTable().getRows();
			aTableRows.forEach(function(oTableRow){
				var oRowSetting = oTableRow.getAggregation("_settings");
				var sExpectedRowUid = "PATH:" + oRowSetting.getRowId() + "|SCHEME:default[" + oTableRow.getIndex() + "]";
				assert.equal(oRowSetting.getRowUid(), sExpectedRowUid, "Row Uid is constructed correctly");
			});
			oGantt.destroy();
		});
	});

	QUnit.test("shall return correct shapeUid", function(assert){
		var oGantt = GanttQUnitUtils.createGantt();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aTableRows = oGantt.getTable().getRows();
			aTableRows.forEach(function(oTableRow){
				var oRowSetting = oTableRow.getAggregation("_settings"),
					oShape = oRowSetting.getShapes1()[0];
				var sExpectedRowUid = "PATH:" + oRowSetting.getRowId() + "|SCHEME:default[" + oTableRow.getIndex() + "]|DATA:" + oRowSetting.getShapeBindingContextPath(oShape) + "[" + oShape.getShapeId() + "]";
				assert.equal(oRowSetting.getShapeUid(oShape), sExpectedRowUid, "Shape Uid is constructed correctly");
			});
			oGantt.destroy();
		});
	});

	QUnit.test("shall return no expandable shapes", function(assert){
		var aExpandableShapes = this.sut.getAllExpandableShapes();
		assert.equal(aExpandableShapes.length, 0, "no shape marked as expandable");
	});

	QUnit.test("shall return 2 expandable shapes", function(assert){
		this.oFirstShape.setExpandable(true);
		this.oFirstShape.setExpandable(true);

		var aExpandableShapes = this.sut.getAllExpandableShapes();
		assert.equal(aExpandableShapes.length, 2, "2 expandable shapes found");
	});

	QUnit.test("rowId update shall surpress invalidating", function(assert){
		var fnSpySetProperty = sinon.spy(this.sut, "setProperty");

		this.sut.setRowId("row-01-new");
		assert.ok(fnSpySetProperty.calledOnce, "setProperty only called once");
	});

	QUnit.test("should not return dragDropConfig aggregation upon AggregationUtils methods", function(assert){
		var aAllNonLazyAggregations = AggregationUtils.getAllNonLazyAggregations(this.sut);
		var aNonLazyAggregations = AggregationUtils.getNonLazyAggregations(this.sut);
		var aLazyAggregations = AggregationUtils.getLazyAggregations(this.sut);
		assert.equal(aAllNonLazyAggregations.dragDropConfig, null, "dragDropConfig aggregation should not be in the array");
		assert.equal(aNonLazyAggregations.dragDropConfig, null, "dragDropConfig aggregation should not be in the array");
		assert.equal(aLazyAggregations.dragDropConfig, null, "dragDropConfig aggregation should not be in the array");
	});

	QUnit.module("function - getShapeUids and MultiActivity", {
		beforeEach: function() {
			this.sut = GanttQUnitUtils.createGantt(true, new MultiActivityRowSettings({
				rowId: "row01",
				tasks: [
					new sap.gantt.simple.MultiActivityGroup({
						task: [
							new BaseRectangle({
								shapeId: "task01",
								selectable: true,
								title: "Main Task"
							})
						],
						indicators: [
							new BaseRectangle({
								shapeId: "indicator01",
								selectable: true
							}),
							new BaseRectangle({
								shapeId: "indicator02",
								selectable: true
							})
						],
						subTasks: [
							new BaseRectangle({
								shapeId: "subtask01",
								selectable: true,
								title: "SubTask_1"
							}),
							new BaseRectangle({
								shapeId: "subtask02",
								selectable: true,
								title: "SubTask_2"
							})
						]
					})
				]
			}), true);
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.sut.destroy();
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Shall return correct Row Index from shapeUid", function(assert){
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var aTableRows = this.sut.getTable().getRows();
			aTableRows.forEach(function(oTableRow){
				var oRowSetting = oTableRow.getAggregation("_settings"),
					oMainGroup = oRowSetting.getTasks()[0],
					oMainTask = oMainGroup.getTask(),
					aSubTasks = oMainGroup.getSubTasks(),
					sExpectedRowUid;
				//Check for ShapeUids and RowIndex of Main Task
				sExpectedRowUid = "PATH:" + oRowSetting.getRowId() + "|SCHEME:default[" + oTableRow.getIndex() + "]|DATA:" + oRowSetting.getShapeBindingContextPath(oMainTask) + "[" + oMainTask.getShapeId() + "]";
				assert.equal(oRowSetting.getShapeUid(oMainTask), sExpectedRowUid, "Shape Uid is constructed correctly for Main Task");
				aSubTasks.forEach(function(oSubTask) {
					sExpectedRowUid = "PATH:" + oRowSetting.getRowId() + "|SCHEME:default[" + oTableRow.getIndex() + "]|DATA:" + oRowSetting.getShapeBindingContextPath(oSubTask) + "[" + oSubTask.getShapeId() + "]";
					assert.equal(oRowSetting.getShapeUid(oSubTask), sExpectedRowUid, "Shape Uid is constructed correctly for Sub Task");
				});
			});
		}.bind(this));
	});

	QUnit.module("CustomGanttRowSettings", {
		beforeEach: function() {
			GanttRowSettings.extend("sap.gantt.CustomRowSettings", {
				metadata: {
					aggregations: {
						rectangles: {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "rectangle"}
					}
				}
			});
			this.oFirstShape = new BaseRectangle({
				shapeId: "shape-01",
				time:  new Date((new Date()).getTime() - 31536000000),
				endTime: new Date((new Date()).getTime() + 31536000000),
				scheme: "main"
			});
			this.oSecondShape = new BaseRectangle({
				shapeId: "shape-02",
				time:  new Date((new Date()).getTime() - 31536000000),
				endTime: new Date((new Date()).getTime() + 31536000000),
				scheme: "main"
			});
			this.rowSettingsTemplate = new CustomRowSettings({
				rowId: "row-01",
				shapes1: [this.oFirstShape, this.oSecondShape]
			});

		this.oGantt = GanttQUnitUtils.createGantt(true, this.rowSettingsTemplate);
		this.oGantt.setAxisTimeStrategy(new sap.gantt.axistime.ProportionZoomStrategy({
			totalHorizon: new sap.gantt.config.TimeHorizon({
				startTime:  new Date((new Date()).getTime() - 31536000000),
				endTime: new Date((new Date()).getTime() + 31536000000)
			}),
			visibleHorizon: new sap.gantt.config.TimeHorizon({
				startTime:  new Date((new Date()).getTime() - 31536000000),
				endTime: new Date((new Date()).getTime() + 31536000000)
			})
		}));
		this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function(){
			this.oGantt.destroy();
			//GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Test rendering of default aggregation of GanttRowSettings", function(assert){
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var sShapeId = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getId();
				assert.notEqual(document.getElementById(sShapeId), null, "Default Aggregation shapes1 is rendered");
				done();
			}.bind(this), 500);
		}.bind(this));
	});
});
