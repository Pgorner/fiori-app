/* global QUnit */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseDiamond",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/BaseConditionalShape",
	"sap/gantt/misc/Format",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/core/RenderManager"
], function (Core, BaseGroup, BaseRectangle, BaseDiamond, utils, GanttRowSettings, BaseText, BaseConditionalShape, Format, QUnitUtils,
	RenderManager) {
	"use strict";

	BaseRectangle.prototype.getXByTime = function(vTime) {
		return 0;
	};

	BaseRectangle.prototype.getWidth = function () {
		return 20;
	};

	QUnit.module("BaseGroup", {
		assertFalseDefaultValue: function(assert, oShape, sProp) {
			assert.equal(oShape.getProperty(sProp), false, "default value: " + sProp + " in BaseGroup is false");
		}
	});

	QUnit.test("Property - default values", function(assert) {
		var oGroup = new BaseGroup();
		assert.strictEqual(oGroup.getShapes().length, 0, "no default shapes in group shape");
	});

	QUnit.module("Rendering - BaseGroup", {
		beforeEach: function(){
			this.oDiamond = new BaseDiamond({shapeId: "diamond01", selectable: true, x:0});
			this.oDiamond2 = new BaseDiamond({shapeId: "diamond02", selectable: true, x:1});
			this.oDiamond3 = new BaseDiamond({shapeId: "diamond03", selectable: true, x:2});
			this.oRect = new BaseRectangle({shapeId: "rect01", selectable: true, x:0});
		},
		afterEach: function() {
			this.oDiamond = null;
			this.oDiamond2 = null;
			this.oDiamond3 = null;
			this.oRect = null;
		}
	});

	QUnit.test("Rendering - renderElement without shapes", function(assert){
		var oGroup = new BaseGroup({
			shapeId: "group01",
			selectable: true,
			showAnimation: true,
			animationSettings: {values:'#e9730c;#fabd64;#e9730c;#e9730c', duration:'1s'}
		});
		var oRm = new RenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();
		assert.ok(jQuery('#qunit-fixture').find("g").length === 1, "Render 'g' element when rendering empty base group");
		assert.equal(oGroup.getDomRef().children[0].tagName.toLowerCase(), 'animate', "Animate tag is created.");
		assert.equal(oGroup.getDomRef().children[0].getAttribute("values"), '#e9730c;#fabd64;#e9730c;#e9730c', "Animate values are correct");
		assert.equal(oGroup.getDomRef().children[0].getAttribute("dur"), '1s', "Animate dutation are correct");
	});

	QUnit.test("Rendering - renderElement with a Diamond", function(assert){

		var oGroup = new BaseGroup({
			shapeId: "group01",
			selectable: true,
			shapes: [this.oDiamond],
			showAnimation: true,
			animationSettings: {values:'#e9730c;#fabd64;#e9730c;#e9730c', duration:'1s'}
		});

		var oRm = new RenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 1, "BaseGroup with shapes has one 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("path").length, 1, "BaseGroup with a BaseDiamond has one 'path' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 2, "BaseGroup with a BaseDiamond only has one child");
		assert.equal(oGroup.getDomRef().children[1].tagName.toLowerCase(), 'animate', "Animate tag is created.");
		assert.equal(oGroup.getDomRef().children[1].getAttribute("values"), '#e9730c;#fabd64;#e9730c;#e9730c', "Animate values are correct");
		assert.equal(oGroup.getDomRef().children[1].getAttribute("dur"), '1s', "Animate dutation are correct");
	});

	QUnit.test("Rendering - renderElement with two Diamonds", function(assert){

		var oGroup = new BaseGroup({
			shapeId: "group01",
			selectable: true,
			shapes: [this.oDiamond, this.oDiamond2],
			showAnimation: true,
			animationSettings: {values:'#e9730c;#fabd64;#e9730c;#e9730c', duration:'1s'}
		});

		var oRm = new RenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		// oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 1, "BaseGroup with shapes has one 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("path").length, 2, "BaseGroup with two BaseDiamonds has two 'path' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 3, "BaseGroup with two BaseDiamonds has two children");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").attr("data-sap-gantt-shape-id"), "group01", "Selectable BaseGroup has shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("path[data-sap-gantt-shape-id]").length, 0, "Child shapes within BaseGroup does not have shape ID");
		assert.equal(oGroup.getDomRef().children[2].tagName.toLowerCase(), 'animate', "Animate tag is created.");
		assert.equal(oGroup.getDomRef().children[2].getAttribute("values"), '#e9730c;#fabd64;#e9730c;#e9730c', "Animate values are correct");
		assert.equal(oGroup.getDomRef().children[2].getAttribute("dur"), '1s', "Animate dutation are correct");
	});

	QUnit.test("Rendering - renderElement with Diamond and Rectangle", function(assert){

		var oGroup = new BaseGroup({
			shapeId: "group01",
			selectable: true,
			shapes: [this.oDiamond, this.oRect],
			showAnimation: true,
			animationSettings: {values:'#e9730c;#fabd64;#e9730c;#e9730c', duration:'1s'}
		});

		var oRm = new RenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 1, "BaseGroup with shapes has one 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g path").length, 1, "BaseGroup with Diamond and Rectangle has one 'path' tage");
		assert.strictEqual(jQuery('#qunit-fixture').find("g rect").length, 1, "BaseGroup with Diamond and Rectangle has one 'rect' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 3, "BaseGroup with two BaseDiamonds has two children");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").attr("data-sap-gantt-shape-id"), "group01", "Selectable BaseGroup has shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("path[data-sap-gantt-shape-id]").length, 0, "Child shapes within BaseGroup does not have shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("g path").next().is("rect"), true, "BaseGroup'children sorted by sapGanttOrder");
		assert.strictEqual(jQuery('#qunit-fixture').find("g rect").prev().is("path"), true, "BaseGroup'children sorted by sapGanttOrder");
		assert.equal(oGroup.getDomRef().children[2].tagName.toLowerCase(), 'animate', "Animate tag is created.");
		assert.equal(oGroup.getDomRef().children[2].getAttribute("values"), '#e9730c;#fabd64;#e9730c;#e9730c', "Animate values are correct");
		assert.equal(oGroup.getDomRef().children[2].getAttribute("dur"), '1s', "Animate dutation are correct");

	});

	QUnit.test("Rendering - renderElement with cascade groups", function(assert){

		var oGroup1 = new BaseGroup({
			shapeId: "group01",
			selectable: true,
			shapes: [this.oDiamond]
		});

		var oGroup2 = new BaseGroup({
			shapeId: "group02",
			selectable: true,
			shapes: [this.oDiamond2, oGroup1]
		});

		var oGroup = new BaseGroup({
			shapeId: "group00",
			selectable: true,
			shapes: [this.oDiamond3, oGroup2],
			showAnimation: true,
			animationSettings: {values:'#e9730c;#fabd64;#e9730c;#e9730c', duration:'1s'}
		});

		var oRm = new RenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 3, "Cascade groups with shapes has three 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("path").length, 3, "Cascade groups with Diamond has three 'path' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 6, "Cascade groups with Diamond has five children in total");
		assert.strictEqual(jQuery('#qunit-fixture').find("g:first").attr("data-sap-gantt-shape-id"), "group00", "Selectable BaseGroup has shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("g:last").attr("data-sap-gantt-shape-id"), undefined, "Child BaseGroups do not have shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("g[data-sap-gantt-shape-id]").length, 1, "Child shapes within BaseGroup does not have shape ID");
		assert.strictEqual(jQuery('#qunit-fixture').find("path[data-sap-gantt-shape-id]").length, 0, "Child shapes within BaseGroup does not have shape ID");
		assert.equal(oGroup.getDomRef().children[2].tagName.toLowerCase(), 'animate', "Animate tag is created.");
		assert.equal(oGroup.getDomRef().children[2].getAttribute("values"), '#e9730c;#fabd64;#e9730c;#e9730c', "Animate values are correct");
		assert.equal(oGroup.getDomRef().children[2].getAttribute("dur"), '1s', "Animate dutation are correct");

	});

	QUnit.module("Extending - BaseGroup", {
		beforeEach: function(){
			this.oDiamond = new BaseDiamond({shapeId: "diamond01", selectable: true, x:0});
			this.oDiamond2 = new BaseDiamond({shapeId: "diamond02", selectable: true, x:1});
			this.oDiamond3 = new BaseDiamond({shapeId: "diamond03", selectable: true, x:2});
			this.oRect = new BaseRectangle({shapeId: "rect01", selectable: true, x:0});
		},
		afterEach: function() {
			this.oDiamond = null;
			this.oDiamond2 = null;
			this.oDiamond3 = null;
			this.oRect = null;
		}
	});

	var ExtGroup = BaseGroup.extend("sap.gantt.simple.test.SteppedTask", {
		metadata: {
			aggregations: {
				tasks: {
					type: "sap.gantt.simple.BaseRectangle",
					multiple: true,
					sapGanttOrder: 1
				},
				steps: {
					type: "sap.gantt.simple.BaseDiamond",
					multiple: true,
					sapGanttOrder: 2
				}
			}
		}
	});

	QUnit.test("Extending - renderChildElements within group", function(assert){
		var oGroup = new ExtGroup({
			tasks: [this.oRect],
			steps: [this.oDiamond, this.oDiamond2]
		});

		var oRm = new RenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("g").length, 1, "Extended group with Diamond has one 'g' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("path").length, 2, "Extended group with Diamond has three 'path' tag");
		assert.strictEqual(jQuery('#qunit-fixture').find("g").children().length, 3, "Extended group with Diamond has 3 children in total");
		assert.ok(jQuery('#qunit-fixture').find("g rect").next().is("path"), "BaseGroup'children sorted by sapGanttOrder");

	});

	QUnit.test("Extending - render order in renderChildElements within group", function(assert){
		var oGroup = new ExtGroup({
			steps: [this.oDiamond, this.oDiamond2],
			tasks: [this.oRect]
		});

		var oRm = new RenderManager();
		oGroup.renderElement(oRm, oGroup);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();

		assert.ok(jQuery('#qunit-fixture').find("g rect").next().is("path"), "BaseGroup'children sorted by sapGanttOrder");
	});

	QUnit.module("BaseGroup render with label and nonlabel group", {
		beforeEach: function() {
			this.oRect = new BaseRectangle({shapeId: "rect10", selectable: true,x:400});
			this.oText = new BaseText({shapeId: "text01", selectable: true,	text: "Test1",isLabel:true,x:450});
			this.oRect1 = new BaseRectangle({shapeId: "rect01", selectable: true,x:500});
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new  BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						shapes: [this.oRect1,this.oRect,this.oText]
					})
				]
			}));
			this.oGantt.setSelectOnlyGraphicalShape(true);
			this.oGantt.placeAt("qunit-fixture");
		},
		getFirstShape: function () {
			return this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
		},
		afterEach: function() {
			this.oRect = null;
			this.oRect1 = null;
			this.oText = null;
			utils.destroyGantt();
		}
	});

	QUnit.test("Rendering basegroup with Label exclusion", function(assert){
		return utils.waitForGanttRendered(this.oGantt).then(function () {
		var oGroup = this.getFirstShape();
		assert.ok(oGroup.getDomRef("nonLabelGroup"),"NonLabel group is added");
		}.bind(this));
	});

	QUnit.test("Rendering basegroup with Label exclusion having some shapes as invisible", function(assert){
		return utils.waitForGanttRendered(this.oGantt).then(function () {
		this.getFirstShape().getShapes()[0].setVisible(false);
			return utils.waitForGanttRendered(this.oGantt).then(function () {
				assert.equal(this.getFirstShape().getShapes()[0].getVisible(),false,"first row one of the shape is hidden");
				assert.ok(this.getFirstShape().getDomRef("nonLabelGroup"),"Visible shapes rendered");
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Rendering basegroup without Label exclusion", function(assert){
		return utils.waitForGanttRendered(this.oGantt).then(function () {
		this.oGantt.setSelectOnlyGraphicalShape(false);
			return utils.waitForGanttRendered(this.oGantt).then(function () {
			var oGroup = this.getFirstShape();
			assert.equal(oGroup.getDomRef("nonLabelGroup"),null,"NonLabel group is  not added");
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Base Group with Conditional Shape Rendering", {
		beforeEach: function () {
			this.oShape = new BaseGroup({
				id: "base-group",
				visible: false,
				shapes: [
					new BaseConditionalShape({
						id: "base-conditional-shape",
						shapes: [
							new BaseRectangle({
								id: "r1",
								shapeId: "r1",
								title: "r1",
								time: Format.abapTimestampToDate("20180101100000"),
								endTime: Format.abapTimestampToDate("20180101900000"),
								visible: false
							}),
							new BaseRectangle({
								id: "r2",
								shapeId: "r2",
								title: "r2",
								time: Format.abapTimestampToDate("20180101100000"),
								endTime: Format.abapTimestampToDate("20180101900000"),
								visible: true
							})
						],
						visible: false
					})
				]
			});

			this.oGantt = utils.createSimpleGantt(this.oShape, "20180101000000", "20180110000000");
			this.oGantt.placeAt("qunit-fixture");
			this.oHandler = utils.createGanttHandler(this, this.oGantt);

			this.getBaseGroup = function () {
				return this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			};

			this.getConditionalShape = function () {
				return this.getBaseGroup().getShapes()[0];
			};

			this.getActiveShape = function () {
				return this.getConditionalShape()._getActiveShapeElement();
			};
		},
		afterEach: function () {
			this.oShape = null;
			this.oHandler.destroy();
			this.oHandler = null;
		}
	});

	QUnit.test("Test Visibility of conditional shape with in the base group", function (assert) {
		var step1 = function (_results, callback) {
			assert.equal(this.oHandler.getRowContent("row1").length, 0, "Conditional Shape has not been created");
			callback();
		};

		var step2 = function (_results, callback) {
			this.getBaseGroup().setVisible(true);
			this.getConditionalShape().setVisible(true);

			this.oHandler.onReady(function () {
				assert.equal(this.oHandler.getRowShapes("row1").length, 0, "Default invisible active element not created");
				callback();
			});
		};

		var step3 = function (_results, callback) {
			this.getConditionalShape().setActiveShape(1);

			this.oHandler.onReady(function () {
				assert.equal(this.oHandler.getRowShapes("row1").length, 0, "Invisible active element not created");
				callback();
			});
		};

		var step4 = function (_results, callback) {
			this.getConditionalShape().setActiveShape(0);
			this.getActiveShape().setVisible(true);

			this.oHandler.onReady(function () {
				assert.equal(this.oHandler.getRowShapes("row1").length > 1, true, "Visible active element created");
				callback();
			});
		};

		var step5 = function (_results, callback) {
			this.getConditionalShape().setActiveShape(-1);

			this.oHandler.onReady(function () {
				assert.equal(this.oHandler.getRowShapes("row1").length, 0, "Invisible active element not created");
				callback();
			}, 500);
		};


		this.oHandler.runSeries([step1, step2, step3, step4, step5], assert.async(), 100);
	});

	QUnit.test("Test selection of base group with conditional shapes", function (assert) {
		var setup = function (_results, callback) {
			this.getBaseGroup().setVisible(true);
			this.getBaseGroup().setSelectable(true);
			this.getConditionalShape().setVisible(true);

			// Click event is called immediately when double click is disabled
			this.oGantt.setDisableShapeDoubleClickEvent(true);
			callback();
		};

		var step1 = function (_results, callback) {
			QUnitUtils.triggerEvent("click", this.getBaseGroup().getId());

			assert.equal(this.getBaseGroup().getSelected(), true, "BaseShape with hidden active conditional shape selectable");
			callback();
		};

		var step2 = function (_results, callback) {
			this.getBaseGroup().setSelected(false);
			this.getConditionalShape().setActiveShape(0);

			this.oHandler.onReady(function () {
				QUnitUtils.triggerEvent("click", this.getBaseGroup().getId());

				assert.equal(this.getBaseGroup().getSelected(), true, "BaseShape with active conditional shape selectable");
				callback();
			});
		};

		var step3 = function (_results, callback) {
			this.getBaseGroup().setSelected(false);
			this.getConditionalShape().setActiveShape(-1);

			this.oHandler.onReady(function () {
				QUnitUtils.triggerEvent("click", this.getBaseGroup().getId());

				assert.equal(this.getBaseGroup().getSelected(), true, "BaseShape with no active shape selectable");
				callback();
			});
		};

		this.oHandler.runSeries([setup, step1, step2, step3], assert.async(), 100);
	});
});
