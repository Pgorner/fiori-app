/*global QUnit */
sap.ui.define([
	"sap/gantt/simple/BaseConditionalShape",
	"./GanttQUnitUtils",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseText",
	"sap/gantt/misc/Format",
	"sap/ui/core/Element",
	"sap/gantt/simple/test/nextUIUpdate"
], function (BaseConditionalShape, GanttUtils, BaseRectangle, BaseGroup,BaseText, Format, Element,
	nextUIUpdate) {
	"use strict";

	QUnit.module("Conditional Shape", {
		beforeEach: function () {
			this.oShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						id: "r1",
						shapeId: "r1",
						title: "r1",
						time: Format.abapTimestampToDate("20180101100000"),
						endTime: Format.abapTimestampToDate("20180101900000")
					}),
					new BaseRectangle({
						id: "r2",
						shapeId: "r2",
						title: "r2",
						time: Format.abapTimestampToDate("20180101100000"),
						endTime: Format.abapTimestampToDate("20180101900000")
					}),
					new BaseGroup({
						shapes: [
							new BaseRectangle({
								id: "r3",
								shapeId: "r3",
								title: "r3",
								time: Format.abapTimestampToDate("20180101100000"),
								endTime: Format.abapTimestampToDate("20180101900000")
							}),
							new BaseText({
								id: "t1",
								shapeId: "t2",
								title: "t1",
								time: Format.abapTimestampToDate("20180101100000"),
								endTime: Format.abapTimestampToDate("20180101900000")
							})
						]
					})
				]
			});
			this.oGantt = GanttUtils.createSimpleGantt(this.oShape, "20180101000000", "20180110000000");
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oShape = null;
			this.oGantt.destroy();
			this.oGantt = null;
		}
	});

	QUnit.test("Active shape selects correct value", function (assert) {
		var oGantt = this.oGantt;
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(async function(){
				var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				assert.equal($element.attr("data-sap-gantt-shape-id"), "r1", "First shape should be selected by default.");
				var oShape = Element.getElementById($element.attr("id")).getParent();
				oShape.setActiveShape(1);
				await nextUIUpdate();
				setTimeout(function(){
					$element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
					assert.equal($element.attr("data-sap-gantt-shape-id"), "r2", "Second shape should be selected by default.");
					done();
				}, 500);
			}, 500); // need to wait because Table updates its rows async
		});
	});

	QUnit.test("Active shape out of bounds doesn't render any shape", function (assert) {
		var oGantt = this.oGantt;
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(async function(){
				var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				var oShape = Element.getElementById($element.attr("id")).getParent();
				oShape.setActiveShape(-1);
				await nextUIUpdate();
				setTimeout(async function(){
					$element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
					assert.equal($element.length, 0, "No shape should be rendered.");
					oShape.setActiveShape(3);
					await nextUIUpdate();
					setTimeout(function(){
						$element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
						assert.equal($element.length, 0, "No shape should be rendered.");
						done();
					}, 500);
				}, 500);
			}, 500); // need to wait because Table updates its rows async
		});
	});

	QUnit.test("countInBirdEye property", function (assert) {
		var oGantt = this.oGantt;
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				var oConShape = Element.getElementById($element.attr("id")).getParent();
				var aShapes = oConShape.getShapes();
				oConShape.setActiveShape(-1);
				assert.equal(oConShape.getCountInBirdEye(), false);

				oConShape.setActiveShape(0);
				assert.equal(oConShape.getCountInBirdEye(), false);
				aShapes[0].setCountInBirdEye(true);
				assert.equal(aShapes[0].getCountInBirdEye(), true);
				assert.equal(oConShape.getCountInBirdEye(), true);
				oConShape.setActiveShape(1);
				assert.equal(oConShape.getCountInBirdEye(), false);
				done();
			}, 500); // need to wait because Table updates its rows async
		});
	});

	QUnit.test("countInBirdEye StartTime/EndTime Validations", function (assert) {
		var oGantt = this.oGantt;
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				var oConShape = Element.getElementById($element.attr("id")).getParent();
				var aShapes = oConShape.getShapes();
				var oHorizonRange = {};
				oConShape.setActiveShape(-1);
				assert.equal(oConShape.getCountInBirdEye(), false);

				oConShape.setActiveShape(0);
				assert.equal(oConShape.getCountInBirdEye(), false);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(oHorizonRange.startTime, undefined, "Horizon Range StartDate has not been set.");
				assert.equal(oHorizonRange.endTime, undefined, "Horizon Range EndDate has not been set.");

				oHorizonRange = {};
				oConShape._getActiveShapeElement().setCountInBirdEye(true);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(aShapes[0].getCountInBirdEye(), true);
				assert.equal(oConShape.getCountInBirdEye(), true);
				assert.notEqual(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been set.");
				assert.notEqual(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been set.");

				oHorizonRange = {};
				oConShape._getActiveShapeElement().setCountInBirdEye(false);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(oConShape._getActiveShapeElement().getCountInBirdEye(), false);
				assert.equal(oConShape.getCountInBirdEye(), false);
				assert.equal(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been reset.");
				assert.equal(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been reset.");

				oHorizonRange = {};
				oConShape.setActiveShape(1);
				oConShape._getActiveShapeElement().setCountInBirdEye(true);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(oConShape._getActiveShapeElement().getCountInBirdEye(), true);
				assert.equal(oConShape.getCountInBirdEye(), true);
				assert.notEqual(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been set.");
				assert.notEqual(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been set.");

				oHorizonRange = {};
				oConShape.setActiveShape(1);
				oConShape._getActiveShapeElement().setCountInBirdEye(false);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(oConShape._getActiveShapeElement().getCountInBirdEye(), false);
				assert.equal(oConShape.getCountInBirdEye(), false);
				assert.equal(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been reset.");
				assert.equal(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been reset.");

				oHorizonRange = {};
				oConShape.setActiveShape(2);
				oConShape._getActiveShapeElement().getShapes()[0].setCountInBirdEye(true);
				oConShape._getActiveShapeElement().getShapes()[1].setCountInBirdEye(true);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(oConShape._getActiveShapeElement().getShapes()[0].getCountInBirdEye(), true);
				assert.equal(oConShape._getActiveShapeElement().getShapes()[1].getCountInBirdEye(), true);
				assert.notEqual(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been set.");
				assert.notEqual(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been set.");

				oHorizonRange = {};
				oConShape.setActiveShape(2);
				oConShape._getActiveShapeElement().getShapes()[0].setCountInBirdEye(false);
				oConShape._getActiveShapeElement().getShapes()[1].setCountInBirdEye(false);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(oConShape._getActiveShapeElement().getShapes()[0].getCountInBirdEye(), false);
				assert.equal(oConShape._getActiveShapeElement().getShapes()[1].getCountInBirdEye(), false);
				assert.equal(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been set.");
				assert.equal(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been set.");
				done();
			}, 500); // need to wait because Table updates its rows async
		});
	});

	QUnit.module("Conditional Shape Rendering with visible false on initial", {
		beforeEach: function () {
			this.oShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						id: "r1",
						shapeId: "r1",
						title: "r1",
						time: Format.abapTimestampToDate("20180101100000"),
						endTime: Format.abapTimestampToDate("20180101900000"),
						visible:false
					}),
					new BaseRectangle({
						id: "r2",
						shapeId: "r2",
						title: "r2",
						time: Format.abapTimestampToDate("20180101100000"),
						endTime: Format.abapTimestampToDate("20180101900000"),
						visible:false
					}),
					new BaseGroup({
						shapes: [
							new BaseRectangle({
								id: "r3",
								shapeId: "r3",
								title: "r3",
								time: Format.abapTimestampToDate("20180101100000"),
								endTime: Format.abapTimestampToDate("20180101900000"),
								visible:false
							}),
							new BaseText({
								id: "t1",
								shapeId: "t2",
								title: "t1",
								time: Format.abapTimestampToDate("20180101100000"),
								endTime: Format.abapTimestampToDate("20180101900000"),
								visible:false
							})
						],
						visible:false
					})
				],
				visible:false
			});
			this.oGantt = GanttUtils.createSimpleGantt(this.oShape, "20180101000000", "20180110000000");
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oShape = null;
			this.oGantt.destroy();
			this.oGantt = null;
		}
	});
	QUnit.test("Test Visibility", function (assert) {
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function(){
						assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), false, "Visibility is false for BaseConditionalShape");
						assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']").children, undefined, "Shape has not been created");
						this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setActiveShape(0);
						this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setVisible(true);
						return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
							setTimeout(function(){
								assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), true, "Visibility is true for BaseConditionalShape");
								assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']").children, undefined, "First Active Shape has not been created.");
								this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setActiveShape(0);
								return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
									setTimeout(function(){
										assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), true, "Visibility is true for BaseConditionalShape");
										assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getVisible(), false, "Visibility is false for the first Active Element");
										assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']").children, undefined, "First Active Shape has not been created.");
										this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setActiveShape(0);
										this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().setVisible(true);
										return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
											setTimeout(function(){
												assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), true, "Visibility is true for BaseConditionalShape");
												assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getVisible(), true, "Visibility is true for the first Active Element");
												assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']")[0].children.length, 2, "First Active Shape has been created.");
												this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setActiveShape(1);
												return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
													setTimeout(function(){
														assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), true, "Visibility is true for BaseConditionalShape");
														assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getVisible(), false, "Visibility is false for the second Active Element");
														assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']").children, undefined, "First Active Shape has not been created.");
														this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setActiveShape(1);
														this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().setVisible(true);
														return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
															setTimeout(function(){
																assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), true, "Visibility is true for BaseConditionalShape");
																assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getVisible(), true, "Visibility is true for the second Active Element");
																assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']")[0].children.length, 2, "First Active Shape has been created.");
																this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setActiveShape(2);
																return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
																	setTimeout(function(){
																		assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), true, "Visibility is true for BaseConditionalShape");
																		assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getVisible(), false, "Visibility is false for the third Active Element");
																		assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']").children, undefined, "First Active Shape has been created.");
																		this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setActiveShape(2);
																		this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().setVisible(true);
																		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
																			setTimeout(function(){
																				assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), true, "Visibility is true for BaseConditionalShape");
																				assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getVisible(), true, "Visibility is true for the third Active Element");
																				assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']")[0].children.length, 1, "First Active Shape BaseGroup has been created.");
																				assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']")[0].children[0].children.length, 0, "First Active Shape BaseGroup's Children has not been created.");
																				this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setActiveShape(2);
																				this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getShapes()[0].setVisible(true);
																				return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
																					setTimeout(function(){
																						assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), true, "Visibility is true for BaseConditionalShape");
																						assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getVisible(), true, "Visibility is true for the third Active Element");
																						assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']")[0].children.length, 1, "First Active Shape BaseGroup has been created.");
																						assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']")[0].children[0].children.length, 2, "First Active Shape BaseGroup's First Child has been created.");
																						this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].setActiveShape(2);
																						this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getShapes()[1].setVisible(true);
																						return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
																							setTimeout(function(){
																								assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getVisible(), true, "Visibility is true for BaseConditionalShape");
																								assert.equal(this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0]._getActiveShapeElement().getVisible(), true, "Visibility is true for the third Active Element");
																								assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']")[0].children.length, 1, "First Active Shape BaseGroup has been created.");
																								assert.equal(this.oGantt.getDomRef().querySelectorAll("[data-sap-gantt-row-id='row1']")[0].children[0].children.length, 3, "First Active Shape BaseGroup's Children has been created.");
																								done();
																							}.bind(this), 500); // need to wait because Table updates its rows async
																						}.bind(this));
																					}.bind(this), 500); // need to wait because Table updates its rows async
																				}.bind(this));
																			}.bind(this), 500); // need to wait because Table updates its rows async
																		}.bind(this));
																	}.bind(this), 500); // need to wait because Table updates its rows async
																}.bind(this));
															}.bind(this), 500); // need to wait because Table updates its rows async
														}.bind(this));
													}.bind(this), 500); // need to wait because Table updates its rows async
												}.bind(this));
											}.bind(this), 500); // need to wait because Table updates its rows async
										}.bind(this));
									}.bind(this), 500); // need to wait because Table updates its rows async
								}.bind(this));
							}.bind(this), 500); // need to wait because Table updates its rows async
						}.bind(this));
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.module("Stand Alone");

	QUnit.test("Important properties get propagated", function (assert) {
		var oInnerShape = new BaseRectangle();
		var oShape = new BaseConditionalShape({
			shapes: oInnerShape
		});
		oShape.setRowYCenter(5);
		oShape.setSelected(true);
		oShape.setProperty("shapeUid", "test");
		assert.equal(oInnerShape.getRowYCenter(), 5, "rowYCenter should be propagated.");
		assert.equal(oInnerShape.getSelected(), true, "selected should be propagated.");
		assert.equal(oInnerShape.getShapeUid(), "test", "shapeUid should be propagated.");
		oShape.destroy();
	});

	QUnit.test("ShapeId is propagated only if not set", function (assert) {
		var oInnerShapeWith = new BaseRectangle({
				shapeId: "inner"
			}),
			oInnerShapeWithout = new BaseRectangle(),
			oShape = new BaseConditionalShape({
				shapes: [oInnerShapeWith, oInnerShapeWithout]
			});
		oShape.setShapeId("test");
		assert.equal(oInnerShapeWith.getShapeId(), "inner", "Shape with defined rowId should keep the row ID.");
		assert.equal(oInnerShapeWithout.getShapeId(), "test", "Shape without defined rowId should get propagated ID.");
		oShape.destroy();
	});

	QUnit.module("Conditional Shape Propagting Shape Id", {
		beforeEach: function () {
			this.oShape = new BaseConditionalShape({
							shapes: [],
							shapeId:"CustomShapeId"
						});
		},
		afterEach: function () {
			this.oShape = null;
		}
	});


	QUnit.test("Active shape has ShapeId from parent when it doesnt have shapeId", function (assert) {
		this.oShape.addAggregation("shapes",new BaseGroup({
			shapes: [
				new BaseRectangle({
					title: "r3",
					time: Format.abapTimestampToDate("20180101100000"),
					endTime: Format.abapTimestampToDate("20180101900000")
				}),
				new BaseText({
					title: "t1",
					time: Format.abapTimestampToDate("20180101100000"),
					endTime: Format.abapTimestampToDate("20180101900000")
				})
			]
		}),true);
		var ashape = this.oShape.clone();
		var activeShape = ashape._getActiveShapeElement();
		assert.equal(activeShape.getProperty("shapeId"),ashape.getProperty("shapeId"),"shapeId is propagted");
	});

	QUnit.test("Active shape has ShapeId of its own", function (assert) {
		this.oShape.addAggregation("shapes",new BaseGroup({
			shapes: [
				new BaseRectangle({
					title: "r3",
					time: Format.abapTimestampToDate("20180101100000"),
					endTime: Format.abapTimestampToDate("20180101900000")
				}),
				new BaseText({
					title: "t1",
					time: Format.abapTimestampToDate("20180101100000"),
					endTime: Format.abapTimestampToDate("20180101900000")
				})
			],
			shapeId:"customChildShapeId"
		}),true);
		var ashape = this.oShape.clone();
		var activeShape = ashape._getActiveShapeElement();
		assert.equal(activeShape.getProperty("shapeId"),"customChildShapeId","shapeId is propagted");
	});
});
