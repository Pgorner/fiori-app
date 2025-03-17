/*global QUnit, sinon */

sap.ui.define([
	"sap/ui/core/ComponentContainer",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/core/theming/Parameters",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/CoordinateUtils",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Element",
	"sap/ui/core/Theming",
	"sap/ui/core/RenderManager",
	"./nextUIUpdate"
], function (ComponentContainer, GanttRowSettings, BaseRectangle, Relationship, utils, Parameters, BaseGroup, BaseText, CoordinateUtils, qutils, GanttUtils, GanttChartConfigurationUtils, Element,
	Theming,
	RenderManager, nextUIUpdate) {
	"use strict";

	QUnit.module("Functional", {
		beforeEach: function () {
			this.RELATION_TYPE = {
				"FinishToFinish": 0,
				"FinishToStart": 1,
				"StartToFinish": 2,
				"StartToStart": 3
			};
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						resizable: true
					})
				]
			}));
			this.sD = undefined;
			this.oRls = new Relationship();
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("getLinePathD", function (assert) {
		this.sD = this.oRls.getLinePathD([
			[5, 5],
			[35, 35]
		]);
		assert.equal(this.sD, "M5,5L35,35Z", "Line path is '" + this.sD + "'");
	});

	QUnit.test("calcIRlsPathD", function (assert) {
		this.sD = this.oRls.calcIRlsPathD(5, 5, 35, 5);
		assert.equal(this.sD, "M5,5L35,5Z", "Line path is '" + this.sD + "'");
	});

	QUnit.test("calcLRlsPathD", function (assert) {
		this.sD = this.oRls.calcLRlsPathD(5, 5, 35, 35);
		assert.equal(this.sD, "M5,5L35,5L35,35L35,5Z", "Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", true, true);
		this.sD = this.oRls.calcLRlsPathD(5, 5, 35, 35);
		assert.equal(this.sD, "M5,5L35,5L35,35", "Curved Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", false, true);
	});

	QUnit.test("calcURlsPathD", function (assert) {

		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.oRls = new Relationship({
				predecessor: "0",
				successor: "1"
			});

			this.oRls.mRelatedShapes = this.oRls.getRelatedInRowShapes(this.oGantt.getId());

			this.oRls.sucRowHeight = this.oRls.mRelatedShapes.successor.getParentRowSettings().getParent().getDomRef().clientHeight;
			this.oRls.sucYTop = this.oRls.mRelatedShapes.successor.getParentRowSettings().getParent().getDomRef().offsetTop;
			this.oRls.sucYBottom = this.oRls.sucYTop + this.oRls.sucRowHeight;

			this.oRls.predRowHeight = this.oRls.mRelatedShapes.predecessor.getParentRowSettings().getParent().getDomRef().clientHeight;
			this.oRls.predYTop = this.oRls.mRelatedShapes.predecessor.getParentRowSettings().getParent().getDomRef().offsetTop;
			this.oRls.predYBottom = this.oRls.predYTop + this.oRls.predRowHeight;

			this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35, false, 3);
			assert.equal(this.sD, "M5,5L53,5L53,35L35,35L53,35L53,5Z", "Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35, false, 2);
			assert.equal(this.sD, "M5,5L47,5L47,35L35,35L47,35L47,5Z", "Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", true, true);
			this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35, false, 3);
			assert.equal(this.sD, "M5,5L53,5L53,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35, false, 2);
			assert.equal(this.sD, "M5,5L47,5L47,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", false, true);

			//connector over divider is set to true.
			this.oRls.setProperty("relationshipOverDivider", true, true);
			this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35, false, 3);
			assert.equal(this.sD, "M5,5L23,5L23,33L53,33L53,35L35,35L53,35L53,33L23,33L23,5Z", "Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35, false, 2);
			assert.equal(this.sD, "M5,5L17,5L17,33L47,33L47,35L35,35L47,35L47,33L17,33L17,5Z", "Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", true, true);
			this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35, false, 3);
			assert.equal(this.sD, "M5,5L23,5L23,33L53,33L53,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35, false, 2);
			assert.equal(this.sD, "M5,5L17,5L17,33L47,33L47,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", false, true);
			this.oRls.setProperty("relationshipOverDivider", false, true);
			done();
		}.bind(this));
	});

	QUnit.test("calcSRlsPathDSF", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {

			this.oRls = new Relationship({
				predecessor: "0",
				successor: "1"
			});
			this.oRls.mRelatedShapes = this.oRls.getRelatedInRowShapes(this.oGantt.getId());
			this.oRls.predRowHeight = this.oRls.mRelatedShapes.predecessor.getParentRowSettings().getParent().getDomRef().clientHeight;
			this.oRls.predYTop = this.oRls.mRelatedShapes.predecessor.getParentRowSettings().getParent().getDomRef().offsetTop;
			this.oRls.predYBottom = this.oRls.predYTop + this.oRls.predRowHeight;
			this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 2, 3);
			assert.equal(this.sD, "M5,5L-13,5L-13,33L53,33L53,35L35,35L53,35L53,33L-13,33L-13,5Z", "Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 2, 2);
			assert.equal(this.sD, "M5,5L-7,5L-7,33L47,33L47,35L35,35L47,35L47,33L-7,33L-7,5Z", "Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", true, true);
			this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 2, 3);
			assert.equal(this.sD, "M5,5L-13,5L-13,33L53,33L53,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 2, 2);
			assert.equal(this.sD, "M5,5L-7,5L-7,33L47,33L47,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", false, true);
			done();
		}.bind(this));
	});


	QUnit.test("calcSRlsPathDFS", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.oRls = new Relationship({
				predecessor: "1",
				successor: "0"
			});
			this.oRls.mRelatedShapes = this.oRls.getRelatedInRowShapes(this.oGantt.getId());
			this.oRls.predRowHeight = this.oRls.mRelatedShapes.predecessor.getParentRowSettings().getParent().getDomRef().clientHeight;
			this.oRls.predYTop = this.oRls.mRelatedShapes.predecessor.getParentRowSettings().getParent().getDomRef().offsetTop;
			this.oRls.predYBottom = this.oRls.predYTop + this.oRls.predRowHeight;
			this.sD = this.oRls.calcSRlsPathD(35, 35, 5, 5, 1, 3);
			assert.equal(this.sD, "M35,35L53,35L53,33L-13,33L-13,5L5,5L-13,5L-13,33L53,33L53,35Z", "Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcSRlsPathD(35, 35, 5, 5, 1, 2);
			assert.equal(this.sD, "M35,35L47,35L47,33L-7,33L-7,5L5,5L-7,5L-7,33L47,33L47,35Z", "Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", true, true);
			this.sD = this.oRls.calcSRlsPathD(35, 35, 5, 5, 1, 3);
			assert.equal(this.sD, "M35,35L53,35L53,33L-13,33L-13,5L5,5", "Curved Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcSRlsPathD(35, 35, 5, 5, 1, 2);
			assert.equal(this.sD, "M35,35L47,35L47,33L-7,33L-7,5L5,5", "Curved Line path is '" + this.sD + "'");
			done();
		}.bind(this));
	});

	QUnit.test("calcZRlsPathD", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {

			this.oRls = new Relationship({
				predecessor: "0",
				successor: "1"
			});
			this.oRls.mRelatedShapes = this.oRls.getRelatedInRowShapes(this.oGantt.getId());
			this.oRls.sucRowHeight = this.oRls.mRelatedShapes.successor.getParentRowSettings().getParent().getDomRef().clientHeight;
			this.oRls.sucYTop = this.oRls.mRelatedShapes.successor.getParentRowSettings().getParent().getDomRef().offsetTop;
			this.oRls.sucYBottom = this.oRls.sucYTop + this.oRls.sucRowHeight;
			this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35, 3);
			assert.equal(this.sD, "M5,5L23,5L23,35L35,35L23,35L23,5Z", "Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35, 2);
			assert.equal(this.sD, "M5,5L17,5L17,35L35,35L17,35L17,5Z", "Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", true, true);
			this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35, 3);
			assert.equal(this.sD, "M5,5L23,5L23,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35, 2);
			assert.equal(this.sD, "M5,5L17,5L17,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", false, true);

			//connector over divider is set to true.
			this.oRls.setProperty("relationshipOverDivider", true, true);
			this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35, 3);
			assert.equal(this.sD, "M5,5L23,5L23,33L17,33L17,35L35,35L17,35L17,33L23,33L23,5Z", "Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35, 2);
			assert.equal(this.sD, "M5,5L17,5L17,33L23,33L23,35L35,35L23,35L23,33L17,33L17,5Z", "Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", true, true);
			this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35, 3);
			assert.equal(this.sD, "M5,5L23,5L23,33L17,33L17,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35, 2);
			assert.equal(this.sD, "M5,5L17,5L17,33L23,33L23,35L35,35", "Curved Line path is '" + this.sD + "'");
			this.oRls.setProperty("enableCurvedEdge", false, true);
			this.oRls.setProperty("relationshipOverDivider", false, true);
			done();
		}.bind(this));
	});

	QUnit.test("Shapes with same y values for StartToStart", function (assert) {
		const rls = new Relationship();
	   rls.oGantt = this.oGantt;
	   rls.predYTop = 5; rls.predYBottom = 15;
	   rls.oGantt._edgePoint = 2;
	   const mAnchors = {
		   predecessor: {
			   x: 25,
			   y: 10
		   },
		   successor: {
			   x: 35,
			   y: 10
		   }
	   };
	   const sRlsSpy = sinon.spy(rls, "calcSRlsPathD");
	   const sD = sinon.spy(rls, "getLinePathD");
	   rls.calcLinePathD(mAnchors,3);
	   assert.ok(sRlsSpy.calledOnce, "calcSRlsPathD is called");
	   assert.equal(JSON.stringify(sD.getCall(0).args[0]),JSON.stringify([[25,10],[13,10],[13,15],[23,15],[23,10],[35,10]]), "Line path is correct");
	   sRlsSpy.restore();
	   sD.restore();
	});

	QUnit.test("Shapes with same y values for FinishToStart with successor ahead of predecessor", function (assert) {
	   const rls = new Relationship();
	   rls.oGantt = this.oGantt;
	   rls.oGantt._edgePoint = 2;
	   const mAnchors = {
		   predecessor: {
			   x: 25,
			   y: 10
		   },
		   successor: {
			   x: 35,
			   y: 10
		   }
	   };
	   const iRlsSpy = sinon.spy(rls, "calcIRlsPathD");
	   const sD = sinon.spy(rls, "getLinePathD");
	   rls.calcLinePathD(mAnchors,1);
	   assert.ok(iRlsSpy.calledOnce, "calcIRlsPathD is called");
	   assert.equal(JSON.stringify(sD.getCall(0).args[0]),JSON.stringify([[25,10],[35,10]]), "Line path is correct");
	   iRlsSpy.restore();
	   sD.restore();
	});

	QUnit.test("Shapes with same y values for FinishToStart with predecessor ahead of successor", function (assert) {
	   const rls = new Relationship();
	   rls.oGantt = this.oGantt;
	   rls.oGantt._edgePoint = 2;
	   rls.predYTop = 5; rls.predYBottom = 15;
	   const mAnchors = {
		   predecessor: {
			   x: 35,
			   y: 10
		   },
		   successor: {
			   x: 25,
			   y: 10
		   }
	   };
	   const iRlsSpy = sinon.spy(rls, "calcIRlsPathD");
	   const sRlsSpy = sinon.spy(rls, "calcSRlsPathD");
	   const sD = sinon.spy(rls, "getLinePathD");
	   rls.calcLinePathD(mAnchors,1);
	   assert.notOk(iRlsSpy.calledOnce, "calcIRlsPathD is not called");
	   assert.ok(sRlsSpy.calledOnce,"calcSRlsPathD is called");
	   assert.equal(JSON.stringify(sD.getCall(0).args[0]),JSON.stringify([[35,10],[47,10],[47,15],[13,15],[13,10],[25,10]]), "Line path is correct");
	   iRlsSpy.restore();
	   sD.restore();
	});

	QUnit.test("Shapes with same y values for StartToFinish with predecessor ahead of successorr", function (assert) {
		const rls = new Relationship();
		rls.oGantt = this.oGantt;
		rls.oGantt._edgePoint = 2;
		const mAnchors = {
			predecessor: {
				x: 35,
				y: 10
			},
			successor: {
				x: 25,
				y: 10
			}
		};
		const iRlsSpy = sinon.spy(rls, "calcIRlsPathD");
		const sD = sinon.spy(rls, "getLinePathD");
		rls.calcLinePathD(mAnchors,2);
		assert.ok(iRlsSpy.calledOnce, "calcIRlsPathD is called");
		assert.equal(JSON.stringify(sD.getCall(0).args[0]),JSON.stringify([[35,10],[25,10]]), "Line path is correct");
		iRlsSpy.restore();
		sD.restore();
	 });

	 QUnit.test("Shapes with same y values for StartToFinish with successor ahead of predecessor", function (assert) {
		const rls = new Relationship();
		rls.oGantt = this.oGantt;
		rls.oGantt._edgePoint = 2;
		rls.predYTop = 5; rls.predYBottom = 15;
		const mAnchors = {
			predecessor: {
				x: 25,
				y: 10
			},
			successor: {
				x: 35,
				y: 10
			}
		};
		const iRlsSpy = sinon.spy(rls, "calcIRlsPathD");
		const sRlsSpy = sinon.spy(rls, "calcSRlsPathD");
		const sD = sinon.spy(rls, "getLinePathD");
		rls.calcLinePathD(mAnchors,2);
		assert.notOk(iRlsSpy.calledOnce, "calcIRlsPathD is not called");
		assert.ok(sRlsSpy.calledOnce,"calcSRlsPathD is called");
		assert.equal(JSON.stringify(sD.getCall(0).args[0]),JSON.stringify([[25,10],[13,10],[13,15],[47,15],[47,10],[35,10]]), "Line path is correct");
		iRlsSpy.restore();
		sD.restore();
	 });

	QUnit.test("getConnectorEndPath", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var aRelationType = ["FinishToStart", "StartToFinish"];
			var oRm = new RenderManager();
			aRelationType.forEach(function (sType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Arrow",
					endShapeColor: "red",
					selectedEndShapeColor: "blue",
					type: sType
				});
				var relationshipShapeSize = sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				var sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,11L32,11Z", "small sized up arrow and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,29L32,29Z", "small sized down arrow and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L39,13L31,13Z", "medium sized up arrow and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L40,15L30,15Z", "large sized up arrow and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), "red", "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), "blue", "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Square",
					endShapeColor: "blue",
					selectedEndShapeColor: "green",
					type: sType
				});

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,5L38,11L32,11L32,5Z", "small sized Square upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,35L38,29L32,29L32,35Z", "small sized Square downward's and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L39,5L39,13L31,13L31,5Z", "medium sized Square upward's and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), "blue", "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), "green", "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Diamond",
					endShapeColor: "green",
					selectedEndShapeColor: "yellow",
					type: sType
				});

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,8L35,11L32,8Z", "small sized Diamond upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,32L35,29L32,32Z", "small sized Diamond downward's and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L40,30L35,25L30,30Z", "large sized Diamond downward's and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), "green", "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), "yellow", "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Circle",
					endShapeColor: "yellow",
					selectedEndShapeColor: "red",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M37,10C36,11,34,11,33,10C32,9,32,7,32.5,5.999999999999999C33,5,34,5,35,4.999999999999999C36,5,37,5,37.5,5.999999999999999C38,7,38,9,37,10", "Circle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M37,29.999999999999996C36,29,34,29,33,29.999999999999996C32,31,32,33,32.5,34C33,35,34,35,35,35C36,35,37,35,37.5,34C38,33,38,31,37,29.999999999999996", "Circle downward's and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), "yellow", "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), "red", "Color is set Correctly");
				// Horizontal rectangle size remains same irrespective of changes in shape size
				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "HorizontalRectangle",
					endShapeColor: "#FF0000",
					selectedEndShapeColor: "#0000FF",
					type: sType
				});
				// Horizontal rectangle size remains constant with shape size as small;
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L41,5L41,11L29,11L29,5Z", "Horizontal Rectangle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L41,35L41,29L29,29L29,35Z", "Horizontal Rectangle downward's and relation type is " + sType + "");
				relationshipShapeSize.restore();
				// Horizontal rectangle size remains constant with shape size as medium;
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L41,5L41,11L29,11L29,5Z", "Horizontal Rectangle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L41,35L41,29L29,29L29,35Z", "Horizontal Rectangle downward's and relation type is " + sType + "");
				relationshipShapeSize.restore();
				// Horizontal rectangle size remains constant with shape size as large;
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L41,5L41,11L29,11L29,5Z", "Horizontal Rectangle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L41,35L41,29L29,29L29,35Z", "Horizontal Rectangle downward's and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), "#FF0000", "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), "#0000FF", "Color is set Correctly");
				// Vertical rectangle size remains same irrespective of changes in shape size
				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "VerticalRectangle",
					endShapeColor: "#0000FF",
					selectedEndShapeColor: "#00FF00",
					type: sType
				});
				// Vertical rectangle size remains constant with shape size as small;
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());

				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,5L38,17L32,17L32,5Z", "Vertical Rectangle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,35L38,23L32,23L32,35Z", "Vertical Rectangle downward's and relation type is " + sType + "");
				relationshipShapeSize.restore();
				// Vertical rectangle size remains constant with shape size as medium;
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,5L38,17L32,17L32,5Z", "Vertical Rectangle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,35L38,23L32,23L32,35Z", "Vertical Rectangle downward's and relation type is " + sType + "");

				relationshipShapeSize.restore();
				// Vertical rectangle size remains constant with shape size as large;
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,5L38,17L32,17L32,5Z", "Vertical Rectangle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,35L38,23L32,23L32,35Z", "Vertical Rectangle downward's and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), "#0000FF", "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), "#00FF00", "Color is set Correctly");

			}.bind(this));

			aRelationType = ["FinishToFinish", "StartToFinish"];
			aRelationType.forEach(function (sType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Arrow",
					endShapeColor: "#00FF00",
					selectedEndShapeColor: "#FFFF00",
					type: sType
				});
				var relationshipShapeSize = sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				var sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L11,2L11,8Z", "small sized left arrow and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L13,1L13,9Z", "medium sized left arrow and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), "#00FF00", "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), "#FFFF00", "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Square",
					endShapeColor: "#FFFF00",
					selectedEndShapeColor: "#FF0000",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,2L11,2L11,8L5,8Z", "small sized Square and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,0L15,0L15,10L5,10Z", "large sized Square and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), "#FFFF00", "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), "#FF0000", "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Diamond",
					endShapeColor: "@sapUiChartSequence1",
					selectedEndShapeColor: "@sapUiChartSequence2",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L9,1L13,5L9,9Z", "medium sized Diamond and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L10,0L15,5L10,10Z", "large sized Diamond and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiChartSequence1"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiChartSequence2"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Circle",
					endShapeColor: "@sapUiChartSequence2",
					selectedEndShapeColor: "@sapUiChartSequence3",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M10,3C11,4,11,6,10,6.999999999999999C9,8,7,8,5.999999999999999,7.499999999999999C5,7,5,6,4.999999999999999,4.999999999999999C5,3.9999999999999996,5,3,5.999999999999999,2.5C7,2,9,2,10,3", "Circle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiChartSequence2"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiChartSequence3"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "HorizontalRectangle",
					endShapeColor: "@sapUiChartSequence3",
					selectedEndShapeColor: "@sapUiChartSequence4",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,2L17,2L17,8L5,8Z", "Horizontal Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,2L17,2L17,8L5,8Z", "Horizontal Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,2L17,2L17,8L5,8Z", "Horizontal Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiChartSequence3"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiChartSequence4"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "VerticalRectangle",
					endShapeColor: "@sapUiChartSequence4",
					selectedEndShapeColor: "@sapUiChartSequence1",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,-1L11,-1L11,11L5,11Z", "Vertical Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,-1L11,-1L11,11L5,11Z", "Vertical Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,-1L11,-1L11,11L5,11Z", "Vertical Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiChartSequence4"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiChartSequence1"), "Color is set Correctly");
			}.bind(this));

			aRelationType = ["FinishToStart", "StartToStart"];
			aRelationType.forEach(function (sType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Arrow",
					endShapeColor: "sapUiChartSequence1",
					selectedEndShapeColor: "sapUiChartSequence2",
					type: sType
				});
				var relationshipShapeSize = sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				var sD = oRls.getConnectorEndPath(("M5,5L35,5Z"), this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L29,2L29,8Z", "small sized right arrow and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiChartSequence1"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiChartSequence2"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Square",
					endShapeColor: "sapUiChartSequence2",
					selectedEndShapeColor: "sapUiChartSequence3",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,1L27,1L27,9L35,9Z", "medium Square and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiChartSequence2"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiChartSequence3"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Diamond",
					endShapeColor: "sapUiChartSequence3",
					selectedEndShapeColor: "sapUiChartSequence4",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L30,0L25,5L30,10Z", "large sized Diamond and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiChartSequence3"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiChartSequence4"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Circle",
					endShapeColor: "sapUiChartSequence4",
					selectedEndShapeColor: "sapUiChartSequence1",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M29.999999999999996,3C29,4,29,6,29.999999999999996,6.999999999999999C31,8,33,8,34,7.499999999999999C35,7,35,6,35,4.999999999999999C35,3.9999999999999996,35,3,34,2.5C33,2,31,2,29.999999999999996,3", "Circle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiChartSequence4"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiChartSequence1"), "Color is set Correctly");


				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "HorizontalRectangle",
					endShapeColor: "@sapUiPositiveText",
					selectedEndShapeColor: "@sapUiNegativeText",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,2L23,2L23,8L35,8Z", "Horizontal Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,2L23,2L23,8L35,8Z", "Horizontal Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiPositiveText"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiNegativeText"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "VerticalRectangle",
					endShapeColor: "sapUiNegativeText",
					selectedEndShapeColor: "sapUiPositiveText",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,-1L29,-1L29,11L35,11Z", "Vertical Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,-1L29,-1L29,11L35,11Z", "Vertical Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getEndShapeColor(), Parameters.get("sapUiNegativeText"), "Color is set Correctly");
				assert.equal(oRls.getSelectedEndShapeColor(), Parameters.get("sapUiPositiveText"), "Color is set Correctly");
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("getConnectorStartPath", function (assert) {
		var oRm = new RenderManager();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var aRelationType = ["FinishToFinish", "FinishToStart"];
			aRelationType.forEach(function (sType, iType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Arrow",
					startShapeColor: "red",
					selectedStartShapeColor: "blue",
					type: sType
				});
				var relationshipShapeSize = sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				var sD = oRls.getConnectorStartPath("M5,5L35,5Z", this.oGantt.getId(), iType);
				assert.equal(sD, "M5,5L5,2L11,5L5,8Z", "small sized right arrow and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), "red", "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), "blue", "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Square",
					startShapeColor: "green",
					selectedStartShapeColor: "yellow",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,1L13,1L13,9L5,9Z", "medium sized Square and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), "green", "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), "yellow", "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Diamond",
					startShapeColor: "#0000FF",
					selectedStartShapeColor: "#00FF00",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L10,0L15,5L10,10Z", "large sized Diamond and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), "#0000FF", "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), "#00FF00", "Color is set Correctly");


				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Circle",
					startShapeColor: "#00FF00",
					selectedStartShapeColor: "#0000FF",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M10,3C11,4,11,6,10,6.999999999999999C9,8,7,8,5.999999999999999,7.499999999999999C5,7,5,6,4.999999999999999,4.999999999999999C5,3.9999999999999996,5,3,5.999999999999999,2.5C7,2,9,2,10,3", "Circle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), "#00FF00", "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), "#0000FF", "Color is set Correctly");
			}.bind(this));

			aRelationType = ["StartToFinish", "StartToStart"];
			aRelationType.forEach(function (sType, iType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Arrow",
					startShapeColor: "@sapUiPositiveText",
					selectedStartShapeColor: "@sapUiNegativeText",
					type: sType
				});
				var relationshipShapeSize = sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				var sD = oRls.getConnectorStartPath(("M35,5L5,5Z"), this.oGantt.getId(), iType + 2);
				assert.equal(sD, "M35,5L35,2L29,5L35,8Z", "small sized left arrow and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), Parameters.get("sapUiPositiveText"), "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), Parameters.get("sapUiNegativeText"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Square",
					startShapeColor: "@sapUiNegativeText",
					selectedStartShapeColor: "@sapUiPositiveText",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,0L25,0L25,10L35,10Z", "Large sized Square and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), Parameters.get("sapUiNegativeText"), "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), Parameters.get("sapUiPositiveText"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Diamond",
					startShapeColor: "sapUiNegativeText",
					selectedStartShapeColor: "sapUiPositiveText",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L31,1L27,5L31,9Z", "medium sized Diamond and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), Parameters.get("sapUiNegativeText"), "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), Parameters.get("sapUiPositiveText"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Circle",
					startShapeColor: "sapUiPositiveText",
					selectedStartShapeColor: "sapUiNegativeText",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M29.999999999999996,3C29,4,29,6,29.999999999999996,6.999999999999999C31,8,33,8,34,7.499999999999999C35,7,35,6,35,4.999999999999999C35,3.9999999999999996,35,3,34,2.5C33,2,31,2,29.999999999999996,3", "Circle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), Parameters.get("sapUiPositiveText"), "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), Parameters.get("sapUiNegativeText"), "Color is set Correctly");
				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "HorizontalRectangle",
					startShapeColor: "@sapUiChartSequence4",
					selectedStartShapeColor: "@sapUiChartSequence1",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,2L23,2L23,8L35,8Z", "Horizontal Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,2L23,2L23,8L35,8Z", "Horizontal Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), Parameters.get("sapUiChartSequence4"), "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), Parameters.get("sapUiChartSequence1"), "Color is set Correctly");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "VerticalRectangle",
					startShapeColor: "sapUiChartSequence1",
					selectedStartShapeColor: "sapUiChartSequence4",
					type: sType
				});
				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Medium");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,-1L29,-1L29,11L35,11Z", "Vertical Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
				oRls.renderElement(oRm, oRls, this.oGantt.getId());
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,-1L29,-1L29,11L35,11Z", "Vertical Rectangle and relation type is " + sType + "");
				relationshipShapeSize.restore();

				assert.equal(oRls.getStartShapeColor(), Parameters.get("sapUiChartSequence1"), "Color is set Correctly");
				assert.equal(oRls.getSelectedStartShapeColor(), Parameters.get("sapUiChartSequence4"), "Color is set Correctly");
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("getEdgePoint from shape Size of Relationship", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var relationshipShapeSize = sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Small");
			var oRls = new Relationship({
				predecessor: "0",
				successor: "1",
				shapeTypeEnd: "Arrow",
				type: "FinishToStart"
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
			var edgePoint = GanttUtils.getEdgePoint(this.oGantt);
			assert.equal(edgePoint, 2, "edge point should be 2");
			relationshipShapeSize.restore();
			sinon.stub(this.oGantt, "getRelationshipShapeSize").returns("Large");
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
			edgePoint = GanttUtils.getEdgePoint(this.oGantt);
			assert.equal(edgePoint, 3, "edge point should be 3");
		}.bind(this));
	});

	QUnit.module("Relationship render", {
		beforeEach: function () {
			utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true
					})
				]
			}));
			return utils.waitForGanttRendered(window.oGanttChart);
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("Relationship Rendering when parent is not defined", function (assert) {
		var fnDone = assert.async();
		var oRls = new Relationship({
			shapeId: "rel-1",
			type: "FinishToStart",
			predecessor: "0",
			successor: "1"
		});
		sinon.stub(oRls, "getParent").returns(undefined);
		//Assert
		assert.equal(oRls._shallWriteElementData(oRls), true, "When parent is not set relation rendering properly");
		fnDone();
	});

	QUnit.test("Relationship Rendering when anchors not present", function (assert) {
		var fnDone = assert.async();
		var oGantt = window.oGanttChart;
		var oRls = new Relationship({
			shapeId: "rel-1",
			type: "FinishToStart",
			predecessor: "0",
			successor: "1"
		});
		oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
		oGantt.getAxisTimeStrategy().setZoomLevel(9);
		//Assert
		assert.equal(oRls.getD(), undefined, "When anchors not set relation not rendered");
		fnDone();
	});

	QUnit.test("Relationship Rendering checks relation exists", function (assert) {
		var fnDone = assert.async();
		var oGantt = window.oGanttChart;
		var oRls = new Relationship({
			shapeId: "rel-1",
			type: "FinishToStart",
			predecessor: "0",
			successor: "1"
		});
		//Assert
		assert.equal(GanttUtils.relationexist(oGantt, oRls), true, "relation exists");
		oRls.setVisible(false);
		assert.equal(GanttUtils.relationexist(oGantt, oRls), false, "relation does not exists");
		oRls.setVisible(true);
		sinon.stub(oRls, "getRelatedInRowShapes").returns({
			predecessor: null,
			successor: null
		});
		assert.equal(GanttUtils.relationexist(oGantt, oRls), false, "relation does not exists");
		sinon.stub(oRls, "getRlsAnchors").returns({
			predecessor: null,
			successor: null
		});
		assert.equal(GanttUtils.relationexist(oGantt, oRls), false, "relation does not exists");
		fnDone();
	});

	QUnit.test("Relationship Rendering checks l marker is set while setting it manually", function (assert) {
		var fnDone = assert.async();
		var oGantt = window.oGanttChart;
		var oRls = new Relationship({
			shapeId: "rel-1",
			type: "FinishToStart",
			predecessor: "0",
			successor: "1"
		});
		var oRls1 = new Relationship({
			shapeId: "rel-2",
			type: "StartToFinish",
			predecessor: "1",
			successor: "0"
		});
		var oRls2 = new Relationship({
			shapeId: "rel-3",
			type: "StartToFinish",
			predecessor: "2",
			successor: "1"
		});
		var oRls3 = new Relationship({
			shapeId: "rel-4",
			type: "StartToStart",
			predecessor: "3",
			successor: "2"
		});
		//Assert
		GanttUtils.relationexist(oGantt, oRls);
		GanttUtils.setLmarker(oGantt, oRls, true);
		assert.equal(oRls._getLMarker(), "rightDown", 'L marker set properly');
		GanttUtils.relationexist(oGantt, oRls1);
		GanttUtils.setLmarker(oGantt, oRls1, true);
		assert.equal(oRls1._getLMarker(), "leftUp", 'L marker set properly');
		assert.equal(Object.keys(oGantt.relSet).length, 2, "Relation added in relset");
		GanttUtils.relationexist(oGantt, oRls2);
		GanttUtils.setLmarker(oGantt, oRls2, false);
		assert.equal(Object.keys(oGantt.relSetFake).length, 1, "Relation added in relset Fake");
		GanttUtils.relationexist(oGantt, oRls3);
		GanttUtils.setLmarker(oGantt, oRls3, true);
		assert.equal(oRls3._getLMarker(), "", 'L marker set to empty string');
		fnDone();

	});

	QUnit.test("Relationship Rendering checks l marker is set while Rendering from inner Gantt render", function (assert) {
		var fnDone = assert.async();
		var oGantt = window.oGanttChart;
		var oRls = new Relationship({
			shapeId: "rel-1",
			type: "FinishToStart",
			predecessor: "0",
			successor: "1"
		});
		var oRls1 = new Relationship({
			shapeId: "rel-2",
			type: "StartToFinish",
			predecessor: "2",
			successor: "1"
		});
		oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
		oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls1);
		return utils.waitForGanttRendered(oGantt).then(async function () {
			await nextUIUpdate();
			//Assert
			assert.equal(oRls._getLMarker(), "rightDown", 'L marker set to rightDown');
			assert.equal(oRls1._getLMarker(), "leftUp", 'L marker set to leftUp ');
			fnDone();

		});
	});

	QUnit.test("Relationship Rendering For all relation Types", function (assert) {
		var fnDone = assert.async();
		var oGantt = window.oGanttChart;
		var oRls = new Relationship({
			shapeId: "rel-1",
			type: "FinishToStart",
			predecessor: "0",
			successor: "1",
			shapeTypeStart: "Square",
			shapeTypeEnd: "Circle"
		});
		var oRls1 = new Relationship({
			shapeId: "rel-2",
			type: "FinishToFinish",
			predecessor: "1",
			successor: "2",
			shapeTypeStart: "Diamond",
			shapeTypeEnd: "Arrow"
		});
		var oRls2 = new Relationship({
			shapeId: "rel-3",
			type: "StartToFinish",
			predecessor: "2",
			successor: "3",
			shapeTypeStart: "HorizontalRectangle",
			shapeTypeEnd: "VerticalRectangle"
		});
		var oRls3 = new Relationship({
			shapeId: "rel-4",
			type: "FinishToStart",
			predecessor: "4",
			successor: "5",
			lShapeForTypeFS: false
		});
		var oRls4 = new Relationship({
			shapeId: "rel-5",
			type: "StartToFinish",
			predecessor: "1",
			successor: "0"
		});

		var shapeSizeSmall = sinon.stub(oGantt, "getRelationshipShapeSize").returns("Small");
		oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
		oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls4);
		oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls1);
		oGantt.getTable().getRows()[2].getAggregation('_settings').addRelationship(oRls2);
		oGantt.getTable().getRows()[4].getAggregation('_settings').addRelationship(oRls3);
		return utils.waitForGanttRendered(oGantt).then(async function () {
			await nextUIUpdate();
			//Assert
			shapeSizeSmall.restore();
			assert.ok(oRls.getD().includes(NaN) == false, " L Relationship instance is drawn properly with small sized icons.");
			assert.ok(oRls4.getD().includes(NaN) == false, " L Relationship instance is drawn properly with small sized icons.");
			assert.ok(oRls1.getD().includes(NaN) == false, "U Relationship instance is drawn properly with small sized icons.");
			assert.ok(oRls2.getD().includes(NaN) == false, "S Relationship instance is drawn properly with small sized icons.");
			assert.ok(oRls3.getD().includes(NaN) == false, "Z Relationship instance is drawn properly with small sized icons.");
			var shapeSizeMedium = sinon.stub(oGantt, "getRelationshipShapeSize").returns("Medium");
			oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
			oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls1);
			oGantt.getTable().getRows()[2].getAggregation('_settings').addRelationship(oRls2);
			//Assert
			shapeSizeMedium.restore();
			assert.ok(oRls.getD().includes(NaN) == false, " L Relationship instance is drawn properly with medium sized icons.");
			assert.ok(oRls1.getD().includes(NaN) == false, "U Relationship instance is drawn properly with medium sized icons.");
			assert.ok(oRls2.getD().includes(NaN) == false, "S Relationship instance is drawn properly with medium sized icons.");
			sinon.stub(oGantt, "getRelationshipShapeSize").returns("Large");
			oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
			oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls1);
			oGantt.getTable().getRows()[2].getAggregation('_settings').addRelationship(oRls2);
			//Assert
			assert.ok(oRls.getD().includes(NaN) == false, " L Relationship instance is drawn properly with large sized icons.");
			assert.ok(oRls1.getD().includes(NaN) == false, "U Relationship instance is drawn properly with large sized icons.");
			assert.ok(oRls2.getD().includes(NaN) == false, "S Relationship instance is drawn properly with large sized icons.");
			fnDone();
		});
	});


	QUnit.test("getRelatedInRowShapes", function (assert) {
		var done = assert.async();
		var oRls = new Relationship({
			predecessor: "0",
			successor: "1"
		});
		var oChart = window.oGanttChart;
		var oShapes = oRls.getRelatedInRowShapes(oChart.getId());
		assert.equal(oShapes.predecessor.getShapeId(), "0", "Shape instance is found");
		assert.equal(oShapes.successor.getShapeId(), "1", "Shape instance is found");
		done();
	});

	QUnit.test("getRlsAnchors", function (assert) {
		var done = assert.async();
		var oRls = new Relationship({
			predecessor: "0",
			successor: "1"
		});
		var oChart = window.oGanttChart;
		var oShapes = oRls.getRelatedInRowShapes(oChart.getId()),
			oAnchors;
		var aRelationType = ["FinishToFinish", "FinishToStart", "StartToFinish", "StartToStart"];
		aRelationType.forEach(function (sType, iType) {
			oRls.setProperty("type", sType);
			oAnchors = oRls.getRlsAnchors(iType, oShapes);
			assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
			oAnchors = oRls.getRlsAnchors(iType, {
				"predecessor": oShapes.predecessor,
				"successor": null
			});
			assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
			oAnchors = oRls.getRlsAnchors(iType, {
				"predecessor": null,
				"successor": oShapes.successor
			});
			assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
		});
		done();
	});

	QUnit.test("Test Anchors for FinishToFinish relation when xbias and ybias are set", function (assert) {
		var done = assert.async();
		var oRls = new Relationship({
			predecessor: "0",
			successor: "1"
		});
		var oChart = window.oGanttChart;
		var oShapes = oRls.getRelatedInRowShapes(oChart.getId()),
			oOldAnchors, oNewAnchors;
		oRls.setProperty("type", "FinishToFinish");
		oOldAnchors = oRls.getRlsAnchors(0, oShapes);
		for (var key in oShapes) {
			oShapes[key].setXBias(10);
			oShapes[key].setYBias(5);
		}
		oNewAnchors = oRls.getRlsAnchors(0, oShapes);
		assert.equal(oNewAnchors.predecessor.x - oOldAnchors.predecessor.x, 10, "Relation anchor aligned with the predecessor shape");
		assert.equal(oNewAnchors.successor.x - oOldAnchors.successor.x, 10, "Relation anchor aligned with the successor shape");
		assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the predecessor shape");
		assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the successor shape");
		done();
	});

	QUnit.test("Test Anchors for FinishToStart relation when xbias and ybias are set", function (assert) {
		var done = assert.async();
		var oRls = new Relationship({
			predecessor: "0",
			successor: "1"
		});
		var oChart = window.oGanttChart;
		var oShapes = oRls.getRelatedInRowShapes(oChart.getId()),
			oOldAnchors, oNewAnchors;
		oRls.setProperty("type", "FinishToStart");
		oOldAnchors = oRls.getRlsAnchors(1, oShapes);
		for (var key in oShapes) {
			oShapes[key].setXBias(10);
			oShapes[key].setYBias(5);
		}
		oNewAnchors = oRls.getRlsAnchors(1, oShapes);
		assert.equal(oNewAnchors.predecessor.x - oOldAnchors.predecessor.x, 10, "Relation anchor aligned with the predecessor shape");
		assert.equal(oNewAnchors.successor.x - oOldAnchors.successor.x, 10, "Relation anchor aligned with the successor shape");
		assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the predecessor shape");
		assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the successor shape");
		done();
	});

	QUnit.test("Test Anchors for StartToFinish relation when xbias and ybias are set", function (assert) {
		var done = assert.async();
		var oRls = new Relationship({
			predecessor: "0",
			successor: "1"
		});
		var oChart = window.oGanttChart;
		var oShapes = oRls.getRelatedInRowShapes(oChart.getId()),
			oOldAnchors, oNewAnchors;
		oRls.setProperty("type", "StartToFinish");
		oOldAnchors = oRls.getRlsAnchors(2, oShapes);
		for (var key in oShapes) {
			oShapes[key].setXBias(10);
			oShapes[key].setYBias(5);
		}
		oNewAnchors = oRls.getRlsAnchors(2, oShapes);
		assert.equal(oNewAnchors.predecessor.x - oOldAnchors.predecessor.x, 10, "Relation anchor aligned with the predecessor shape");
		assert.equal(oNewAnchors.successor.x - oOldAnchors.successor.x, 10, "Relation anchor aligned with the successor shape");
		assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the predecessor shape");
		assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the successor shape");
		done();
	});

	QUnit.test("Test Anchors for StartToStart relation when xbias and ybias are set", function (assert) {
		var done = assert.async();
		var oRls = new Relationship({
			predecessor: "0",
			successor: "1"
		});
		var oChart = window.oGanttChart;
		var oShapes = oRls.getRelatedInRowShapes(oChart.getId()),
			oOldAnchors, oNewAnchors;
		oRls.setProperty("type", "StartToStart");
		oOldAnchors = oRls.getRlsAnchors(3, oShapes);
		for (var key in oShapes) {
			oShapes[key].setXBias(10);
			oShapes[key].setYBias(5);
		}
		oNewAnchors = oRls.getRlsAnchors(3, oShapes);
		assert.equal(oNewAnchors.predecessor.x - oOldAnchors.predecessor.x, 10, "Relation anchor aligned with the predecessor shape");
		assert.equal(oNewAnchors.successor.x - oOldAnchors.successor.x, 10, "Relation anchor aligned with the successor shape");
		assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the predecessor shape");
		assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the successor shape");
		done();
	});


	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var clr = result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;

		if (clr) {
			return "rgb(" + clr.r + ", " + clr.g + ", " + clr.b + ")";
		}

		return hex;
	}

	QUnit.test("renderElement", function (assert) {
		var done = assert.async();

		var oRls = new Relationship({
			type: "FinishToStart",
			shapeId: "rls-1",
			selectable: true,
			predecessor: "0",
			successor: "1",
			stroke: "#ff0000",
			strokeOpacity: 0.8,
			strokeWidth: 4,
			strokeDasharray: "1 4"
		});
		var oChart = window.oGanttChart;
		var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
		var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);


		var oRm = new RenderManager();
		oRls.renderElement(oRm, oRls, oChart.getId());
		oRm.flush(oRlsCnt);

		var $path = oRls.$();

		assert.equal(true, $path.css("stroke-width") === "4px" || $path.css("stroke-width") === "4", "stroke width");
		assert.equal(hexToRgb($path.css("stroke")), "rgb(255, 0, 0)", "stroke color");
		assert.equal($path.css("opacity"), "0.8", "stroke opacity");

		var sArray = $path[0].style["stroke-dasharray"],
			bCondition = sArray === "1, 4" || sArray === "1px, 4px" || sArray === "1,4" || sArray === "1px,4px",
			arrowStrokeDashArray = $path[0].children[2].style.strokeDasharray === "none";

		assert.equal(bCondition, true, "stroke dasharray");
		assert.equal(arrowStrokeDashArray, true, "stroke dasharray for arrow should be none");

		assert.ok(jQuery(oRlsCnt).find("[data-sap-gantt-shape-id='rls-1']").get(0) != null, "Relationship dom element is found");
		oRm.destroy();
		done();
	});

	QUnit.test("visibility", function (assert) {
		var done = assert.async();

		var oRls = new Relationship({
			type: "FinishToStart",
			shapeId: "rls-1",
			selectable: true,
			predecessor: "0",
			successor: "1",
			stroke: "#ff0000",
			strokeOpacity: 0.8,
			strokeWidth: 4,
			strokeDasharray: "1 4",
			visible: false
		});
		var oChart = window.oGanttChart;
		var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
		var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);

		var oRm = new RenderManager();
		oRls.renderElement(oRm, oRls, oChart.getId());
		oRm.flush(oRlsCnt);
		var $path = oRls.$();
		assert.equal($path.length, 0);
		oRm.destroy();
		done();

	});

	QUnit.module("Connector Overlap", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						resizable: true
					})
				]
			}));
			return utils.waitForGanttRendered(window.oGanttChart);

		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("Start Connector Shapes Overlap", function (assert) {
		var done = assert.async();
		var oRls = new Relationship({
			type: "FinishToStart",
			predecessor: "0",
			successor: "1",
			shapeTypeStart: "Square",
			_lMarker: ""
		});
		var oRls1 = new Relationship({
			type: "FinishToStart",
			predecessor: "0",
			successor: "2",
			shapeTypeStart: "Square",
			_lMarker: ""
		});
		this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
		assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "Square", "Connector shape will remain same  on overlap with same shape");
		oRls.setProperty("shapeTypeStart", "Circle", true);
		assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "HorizontalRectangle", "Connector shape will change to horizonatl rectangle shape on overlap with different shape");
		done();

	});

	QUnit.test("End Connector Shape Overlap", async function (assert) {
		var done = assert.async();

		var oRls = new Relationship({
			type: "FinishToStart",
			predecessor: "0",
			successor: "1",
			shapeTypeEnd: "Square"
		});
		var oRls1 = new Relationship({
			type: "FinishToStart",
			predecessor: "2",
			successor: "1",
			shapeTypeEnd: "Square"
		});
		oRls.setProperty("_lMarker", "", true);
		oRls1.setProperty("_lMarker", "", true);
		this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
		await nextUIUpdate();
		assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end"), "Square", "Connector shape will remain same  on overlap with same shape");
		oRls.setProperty("shapeTypeEnd", "Circle", true);
		assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end"), "HorizontalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with different shape");
		done();

	});

	QUnit.test("End Connector Overlap in L-shape up/down position", function (assert) {
		var done = assert.async();

		var oRls = new Relationship({
			type: "FinishToStart",
			predecessor: "0",
			successor: "1",
			shapeTypeEnd: "Square"
		});
		var oRls1 = new Relationship({
			type: "FinishToStart",
			predecessor: "2",
			successor: "1",
			shapeTypeEnd: "Square"
		});
		oRls.setProperty("_lMarker", "leftUp", true);
		oRls1.setProperty("_lMarker", "leftUp", true);
		this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
		assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end", "leftUp"), "Square", "Connector shape will remain same  on overlap with same shape");
		oRls.setProperty("shapeTypeEnd", "Circle", true);
		assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end", "leftUp"), "VerticalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with  different shape in L-shape Up position");
		oRls.setProperty("_lMarker", "leftDown", true);
		oRls1.setProperty("_lMarker", "leftDown", true);
		assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end", "leftDown"), "VerticalRectangle", "Connector will change to horizontal rectangle shape on overlap with  different shape in L-shape down position");
		done();

	});

	QUnit.test("Start Connector Shapes Overlap with End shape Connector of other Relation", function (assert) {
		var done = assert.async();

		var oRls = new Relationship({
			shapeId: "rel-1",
			type: "FinishToStart",
			predecessor: "0",
			successor: "1",
			shapeTypeStart: "Arrow",
			shapeTypeEnd: "Circle"
		});
		var oRls1 = new Relationship({
			shapeId: "rel-2",
			type: "FinishToFinish",
			predecessor: "3",
			successor: "0",
			shapeTypeStart: "Arrow",
			shapeTypeEnd: "Diamond"
		});
		oRls.setProperty("_lMarker", "", true);
		oRls1.setProperty("_lMarker", "", true);
		this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
		assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "HorizontalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with different shape");
		done();

	});

	QUnit.module("Interaction", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						resizable: true
					})
				]
			}));
			return utils.waitForGanttRendered(this.oGantt);
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("Interaction - Hover", function (assert) {
		var fnDone = assert.async();
		var oRls = new Relationship({
			type: "FinishToStart",
			predecessor: "0",
			successor: "1"
		});
		this.oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);

		return utils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			//Assert
			assert.ok(oRls !== null, "Relationship instance is found.");
			assert.ok(oRls.getDomRef() !== null, "Relationship dom is visible");
			assert.strictEqual(oRls.getStrokeWidth(), 0, "Default value of strokeWidth is 0.");
			assert.strictEqual(oRls.getSelectedStrokeWidth(), 2, "Default value of selectedStrokeWidth is 2.");
			//Act
			var oHoverSpy = sinon.spy(oRls, "onmouseover");
			sinon.stub(CoordinateUtils, "getCursorElement").returns(oRls.getDomRef());
			qutils.triggerEvent("mouseenter", oRls.getId());
			//Assert
			assert.ok(oHoverSpy.calledOnce, "hovered on the Relationship");
			assert.strictEqual(oRls.getHoverable(), false, "Default value of hoverable is false.");
			assert.ok(oRls.getDomRef().style['stroke-width'] !== oRls.getSelectedStrokeWidth().toString(), "Stroke width did not change on hover as hoverable property is set as false.");
			//Act
			oRls.setHoverable(true);
			qutils.triggerEvent("mouseenter", oRls.getId());
			//Assert
			assert.ok(parseFloat(oRls.getDomRef().style['stroke-width']) === parseFloat(oRls.getSelectedStrokeWidth()), "Stroke width is changed to selectedStokeWidth on hover.");
			//Act
			var oHoverOutSpy = sinon.spy(oRls, "onmouseout");
			qutils.triggerEvent("mouseout", oRls.getId());
			//Assert
			assert.ok(oHoverOutSpy.calledOnce, "Hovered out of the relationship.");
			assert.ok(oRls.getDomRef().style['stroke-width'] !== oRls.getSelectedStrokeWidth().toString(), "Stroke width is changed to original stoke width on mouseout.");
			fnDone();

		});
	});

	QUnit.test("Interaction - onclick with isConnectorDetailsVisible is set to true", function (assert) {
		var done = assert.async();
		var oRls1 = new Relationship({
			shapeId: "rel-1",
			type: "FinishToStart",
			predecessor: "0",
			successor: "1",
			selectable: true
		});
		var oRls2 = new Relationship({
			shapeId: "rel-2",
			type: "FinishToStart",
			predecessor: "0",
			successor: "1",
			selectable: true
		});
		this.oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls1);
		this.oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls2);

		return utils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			//check for click event to be called.
			var oClickSpy = sinon.spy(oRls1, "onclick"),
				oHandleShapePress = sinon.spy(this.oGantt, "handleShapePress"),
				oPredecessorShapeDom = this.oGantt.getTable().getRows()[0].getAggregation('_settings').getShapes1()[0].getDomRef().getBoundingClientRect(),
				pageX = oPredecessorShapeDom.x + oPredecessorShapeDom.width + 1,
				pageY = oPredecessorShapeDom.y + oPredecessorShapeDom.height / 2;
			this.oGantt.setProperty("isConnectorDetailsVisible", true, true);
			sinon.stub(CoordinateUtils, "getLatestCursorPosition").returns({
				pageX: pageX,
				pageY: pageY
			});
			sinon.stub(oRls1, "getGanttChartBase").returns(this.oGantt);
			this.oGantt.attachShapeConnectorList(function (oEvent) {
				assert.deepEqual(oEvent.getParameter("connectorList"), [oRls2, oRls1], "Connector details at the cursor position is shared correctly");
				assert.strictEqual(this.oGantt.getIsConnectorDetailsVisible(), true, "Connector details visible property is set");
				done();
			}.bind(this));
			qutils.triggerEvent("click", oRls1);
			assert.ok(oClickSpy.calledOnce, "clicked on the Relationship");
			assert.ok(oHandleShapePress.notCalled, "HandleShapePress doesn't get called");
			oClickSpy.restore();

		}.bind(this));
	});

	QUnit.test("Interaction - onclick with isConnectorDetailsVisible is set to false", function (assert) {
		var done = assert.async();
		var oRls1 = new Relationship({
			shapeId: "rel-1",
			type: "FinishToStart",
			predecessor: "1",
			successor: "2",
			selectable: true
		});
		var oRls2 = new Relationship({
			shapeId: "rel-2",
			type: "FinishToStart",
			predecessor: "1",
			successor: "2",
			selectable: true
		});
		this.oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls1);
		this.oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls2);
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//check for click event to be called.
			var oClickSpy = sinon.spy(oRls1, "onclick");
			this.oGantt.setProperty("isConnectorDetailsVisible", false, true);
			sinon.stub(oRls1, "getGanttChartBase").returns(this.oGantt);
			this.oGantt.attachEventOnce("shapePress", function (oEvent) {
				assert.equal(oEvent.getParameter('shape'), oRls1, "shape press event fired on correct relationship");
				oClickSpy.restore();
				done();
			});
			qutils.triggerEvent("click", oRls1);
			assert.ok(oClickSpy.calledOnce, "clicked on the Relationship");

		}.bind(this));
	});


	QUnit.module("Theme Adaptation", {
		before: function () {
			this.oTheme = GanttChartConfigurationUtils.getTheme();
		},
		beforeEach: function () {
			utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true
					})
				]
			}));
		},
		afterEach: function () {
			utils.destroyGantt();
		},
		after: function () {
			Theming.setTheme(this.oTheme);
		}
	});
	/**
	 * @deprecated since 1.120.0
	 */
	QUnit.test("adaptToHcbTheme", function (assert) {
		var done = assert.async();
		Theming.setTheme("sap_hcb");
		utils.waitForGanttRendered(window.oGanttChart).then(function () {

			var oRls = new Relationship({
				type: "FinishToStart",
				shapeId: "rls-1",
				selectable: true,
				predecessor: "0",
				successor: "1"
			});

			var oChart = window.oGanttChart;
			var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
			var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
			var oRm = new RenderManager();
			oRls.renderElement(oRm, oRls, oChart.getId());
			oRm.flush(oRlsCnt);

			var $path = oRls.$();
			assert.equal(hexToRgb($path.css("stroke")), "rgb(255, 255, 255)", "stroke color is correct");

			oRm.destroy();
			done();

		});
	});

	QUnit.test("adaptToHcwTheme", function (assert) {
		var done = assert.async();
		Theming.setTheme("sap_fiori_3_hcw");
		utils.waitForGanttRendered(window.oGanttChart).then(function () {

			var oRls = new Relationship({
				type: "FinishToStart",
				shapeId: "rls-1",
				selectable: true,
				predecessor: "0",
				successor: "1"
			});

			var oChart = window.oGanttChart;
			var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
			var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
			var oRm = new RenderManager();
			oRls.renderElement(oRm, oRls, oChart.getId());
			oRm.flush(oRlsCnt);

			var $path = oRls.$();
			assert.equal(hexToRgb($path.css("stroke")), "rgb(0, 0, 0)", "stroke color is correct");

			oRm.destroy();
			done();

		});
	});

	QUnit.test("adaptToDarkTheme", function (assert) {
		var done = assert.async();
		Theming.setTheme("sap_fiori_3_dark");
		utils.waitForGanttRendered(window.oGanttChart).then(function () {

			var oRls = new Relationship({
				type: "FinishToStart",
				shapeId: "rls-1",
				selectable: true,
				predecessor: "0",
				successor: "1"
			});

			var oChart = window.oGanttChart;
			var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
			var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
			var oRm = new RenderManager();
			oRls.renderElement(oRm, oRls, oChart.getId());
			oRm.flush(oRlsCnt);

			var $path = oRls.$();
			assert.equal(hexToRgb($path.css("stroke")), "rgb(250, 250, 250)", "stroke color is correct");

			oRm.destroy();
			done();

		});
	});

	QUnit.test("adaptTosap_horizonTheme", function (assert) {
		var done = assert.async();
		Theming.setTheme("sap_horizon");
		utils.waitForGanttRendered(window.oGanttChart).then(function () {

			var oRls = new Relationship({
				type: "FinishToStart",
				shapeId: "rls-1",
				selectable: true,
				predecessor: "0",
				successor: "1"
			});

			var oChart = window.oGanttChart;
			var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
			var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
			var oRm = new RenderManager();
			oRls.renderElement(oRm, oRls, oChart.getId());
			oRm.flush(oRlsCnt);

			var $path = oRls.$();
			assert.equal(hexToRgb($path.css("stroke")), "rgb(29, 45, 62)", "stroke color is correct");

			oRm.destroy();
			done();

		});
	});

	QUnit.test("adaptTosap_horizon_darkTheme", function (assert) {
		var done = assert.async();
		Theming.setTheme("sap_horizon_dark");
		utils.waitForGanttRendered(window.oGanttChart).then(function () {

			var oRls = new Relationship({
				type: "FinishToStart",
				shapeId: "rls-1",
				selectable: true,
				predecessor: "0",
				successor: "1"
			});

			var oChart = window.oGanttChart;
			var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
			var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
			var oRm = new RenderManager();
			oRls.renderElement(oRm, oRls, oChart.getId());
			oRm.flush(oRlsCnt);

			var $path = oRls.$();
			assert.equal(hexToRgb($path.css("stroke")), "rgb(234, 236, 238)", "stroke color is correct");

			oRm.destroy();
			done();

		});
	});

	QUnit.module("OData Gantt render", {
		beforeEach: function () {
			this.oComponentContainer = new ComponentContainer({
				height: "300px", // limit height so we can test incoming relationship from a shape which won't be visible after we scroll down
				name: "sap.gantt.simple.test.GanttChart2OData",
				settings: {
					id: "sap.gantt.sample.GanttChart2OData"
				},
				async: true
			});
			return new Promise(function (fnResolve) {
				this.oComponentContainer.attachComponentCreated(function () {
					this.oComponentContainer.getComponentInstance().getRootControl().loaded().then(function (oView) {
						this.oGantt = oView.byId("gantt1");
						utils.waitForGanttRendered(this.oGantt).then(fnResolve);
					}.bind(this));
				}.bind(this));
				this.oComponentContainer.placeAt("qunit-fixture");
			}.bind(this));
		},
		afterEach: function () {
			this.oComponentContainer.destroy();
		}
	});

	/**
	 * The relationships tested here should look like this:
	 *         ______________
	 *   —>🔗 |    shape    | —>🔗
	 *        ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅
	 */
	QUnit.test("relationship prompts (links)", function (assert) {
		return new Promise(function (fnResolve) {
			this.oGantt.getTable().setFirstVisibleRow(5);
			return utils.waitForGanttRendered(this.oGantt).then(function () {
					this.oGantt.getInnerGantt().attachEventOnce("ganttReady", function () {
						var oLeftRls = document.querySelector("[data-sap-gantt-shape-id='rls-X1']");
						assert.ok(oLeftRls, "Left relationship should be visible.");
						assert.strictEqual(oLeftRls.childElementCount, 6, "Left relationship should have correct number of children.");
						assert.strictEqual(escape(oLeftRls.querySelector("text").textContent), "%uE088", "Left relationship should have link icon rendered.");
						var oRightRls = document.querySelector("[data-sap-gantt-shape-id='rls-X2']");
						assert.ok(oRightRls, "Right relationship should be visible.");
						assert.strictEqual(oRightRls.childElementCount, 6, "Right relationship should have correct number of children.");
						assert.strictEqual(escape(oRightRls.querySelector("text").textContent), "%uE088", "Right relationship should have link icon rendered.");
						fnResolve();
					});
				}.bind(this));
			}.bind(this));
		});

	QUnit.module("Relationship render - JSON Model", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true
					})
				]
			}));
			return utils.waitForGanttRendered(this.oGantt);
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("Relationship Rendering", async function (assert) {
		var fnDone = assert.async();
		var oRls = new Relationship({
			shapeId: "rel-1",
			type: "FinishToFinish",
			predecessor: "0_SUB_0",
			successor: "1_SUB_0"
		});
		var oRls1 = new Relationship({
			shapeId: "rel-2",
			type: "FinishToFinish",
			predecessor: "1_SUB_1",
			successor: "0_SUB_1"
		});
		var oRlsCnt, oRel1, oRel2;
		this.oGantt.getTable().expandToLevel(1);
		await nextUIUpdate();
		this.oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls);
		this.oGantt.getTable().getRows()[5].getAggregation('_settings').addRelationship(oRls1);
		return utils.waitForGanttRendered(this.oGantt).then(async function () {
			await nextUIUpdate();
			oRlsCnt = document.getElementsByClassName("sapGanttChartRls")[0];
			oRel1 = document.querySelector("[data-sap-gantt-shape-id='rel-1']");
			oRel2 = document.querySelector("[data-sap-gantt-shape-id='rel-2']");
			assert.equal(oRlsCnt.children.length, 2, "2 Relationships have been added.");
			assert.strictEqual(oRel1.querySelector("text"), null, "Relationship has no Link Icon.");
			assert.strictEqual(oRel2.querySelector("text"), null, "Relationship has no Link Icon.");
			Element.getElementById("table").collapse(3);
			return utils.waitForGanttRendered(this.oGantt).then(async function () {
				await nextUIUpdate();
				oRlsCnt = document.getElementsByClassName("sapGanttChartRls")[0];
				oRel1 = document.querySelector("[data-sap-gantt-shape-id='rel-1']");
				oRel2 = document.querySelector("[data-sap-gantt-shape-id='rel-2']");
				assert.equal(oRlsCnt.children.length, 2, "2 Relationships are still present after collapse.");
				assert.strictEqual(escape(oRel1.querySelector("text").textContent), "%uE088", "Relationship has Link Icon.");
				assert.strictEqual(escape(oRel2.querySelector("text").textContent), "%uE088", "Relationship has Link Icon.");
				Element.getElementById("table").expand(3);
				return utils.waitForGanttRendered(this.oGantt).then(async function () {
					await nextUIUpdate();
					oRlsCnt = document.getElementsByClassName("sapGanttChartRls")[0];
					oRel1 = document.querySelector("[data-sap-gantt-shape-id='rel-1']");
					oRel2 = document.querySelector("[data-sap-gantt-shape-id='rel-2']");
					assert.equal(oRlsCnt.children.length, 2, "2 Relationships are still present after expand.");
					assert.strictEqual(oRel1.querySelector("text"), null, "Relationship has no Link Icon.");
					assert.strictEqual(oRel2.querySelector("text"), null, "Relationship has no Link Icon.");
					fnDone();
				});
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Relationship Rendering when predcessor is undefined", function (assert) {
		var fnDone = assert.async();
		var oRls = new Relationship({
			shapeId: "rel-1",
			type: "StartToStart",
			predecessor: "0_SUB_0",
			successor: "0_SUB_0"
		});
		this.oGantt.getTable().expandToLevel(1);
		this.oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls);
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var oRm = new RenderManager();
			var mRelatedShapes = oRls.getRelatedInRowShapes(this.oGantt.getId());
			mRelatedShapes.predecessor = null;
			sinon.stub(oRls, "getRelatedInRowShapes").returns(mRelatedShapes);
			oRls.renderElement(oRm, oRls, this.oGantt.getId());
			assert.ok(oRls, "relationship exist");
			fnDone();
		}.bind(this));
	});

	QUnit.module("Relationship render with Basegroup", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						shapes: [new BaseRectangle({
								shapeId: "rect01",
								selectable: true,
								time: "{StartDate}",
								endTime: "{EndDate}"
							}),
							new BaseText({
								shapeId: "text01",
								selectable: true,
								text: "Test1",
								isLabel: true,
								time: "{EndDate}"
							})
						]
					})
				]
			}));
			utils.waitForGanttRendered(this.oGantt);
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});


	QUnit.test("getRlsAnchors with BaseGroup having labels", function (assert) {
		var done = assert.async();
		this.oGantt.setSelectOnlyGraphicalShape(true);
		utils.waitForGanttRendered(this.oGantt).then(function () {
			var oRls = new Relationship({
				predecessor: "0",
				successor: "1"
			});
			var oChart = this.oGantt;
			var oShapes = oRls.getRelatedInRowShapes(oChart.getId()),
				oAnchors;
			var aRelationType = ["FinishToFinish", "FinishToStart", "StartToFinish", "StartToStart"];
			aRelationType.forEach(function (sType, iType) {
				oRls.setProperty("type", sType);
				oAnchors = oRls.getRlsAnchors(iType, oShapes);
				assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
				oAnchors = oRls.getRlsAnchors(iType, {
					"predecessor": oShapes.predecessor,
					"successor": null
				});
				assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
				oAnchors = oRls.getRlsAnchors(iType, {
					"predecessor": null,
					"successor": oShapes.successor
				});
				assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
			});
			done();
		}.bind(this));
	});

	QUnit.test("Relationship Rendering For all relation Types in BaseGroup With graphical selection flag as false", function (assert) {
		var fnDone = assert.async();
		var oGantt = this.oGantt;
		this.oGantt.setSelectOnlyGraphicalShape(false);
		return utils.waitForGanttRendered(oGantt).then(async function () {
			var oRls = new Relationship({
				shapeId: "rel-1",
				type: "FinishToStart",
				predecessor: "0",
				successor: "2"
			});
			var oRls1 = new Relationship({
				shapeId: "rel-2",
				type: "FinishToFinish",
				predecessor: "1",
				successor: "2"
			});
			var oRls2 = new Relationship({
				shapeId: "rel-3",
				type: "StartToFinish",
				predecessor: "2",
				successor: "3"
			});
			var oRls3 = new Relationship({
				shapeId: "rel-4",
				type: "FinishToStart",
				predecessor: "3",
				successor: "5",
				lShapeForTypeFS: false
			});
			var oRls4 = new Relationship({
				shapeId: "rel-5",
				type: "StartToFinish",
				predecessor: "2",
				successor: "0"
			});

			oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
			oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls4);
			oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls1);
			oGantt.getTable().getRows()[2].getAggregation('_settings').addRelationship(oRls2);
			oGantt.getTable().getRows()[4].getAggregation('_settings').addRelationship(oRls3);
			await nextUIUpdate();
			return utils.waitForGanttRendered(oGantt).then(async function () {
				await nextUIUpdate();
				//Assert
				assert.ok(oRls.getD().includes(NaN) == false, " L Relationship instance is drawn properly.");
				assert.ok(oRls4.getD().includes(NaN) == false, " L Relationship instance is drawn properly.");
				assert.ok(oRls1.getD().includes(NaN) == false, "U Relationship instance is drawn properly.");
				assert.ok(oRls2.getD().includes(NaN) == false, "S Relationship instance is drawn properly.");
				assert.ok(oRls3.getD().includes(NaN) == false, "Z Relationship instance is drawn properly.");
				fnDone();

			});
		});
	});

	QUnit.test("Relationship Rendering For all relation Types in BaseGroup With graphical selection flag as true", function (assert) {
		var fnDone = assert.async();
		var oGantt = this.oGantt;
		this.oGantt.setSelectOnlyGraphicalShape(true);
		return utils.waitForGanttRendered(oGantt).then(function () {
			var oRls = new Relationship({
				shapeId: "rel-1",
				type: "FinishToStart",
				predecessor: "0",
				successor: "1"
			});
			var oRls1 = new Relationship({
				shapeId: "rel-2",
				type: "FinishToFinish",
				predecessor: "1",
				successor: "2"
			});
			var oRls2 = new Relationship({
				shapeId: "rel-3",
				type: "StartToFinish",
				predecessor: "2",
				successor: "3"
			});
			var oRls3 = new Relationship({
				shapeId: "rel-4",
				type: "FinishToStart",
				predecessor: "4",
				successor: "5",
				lShapeForTypeFS: false
			});
			var oRls4 = new Relationship({
				shapeId: "rel-5",
				type: "StartToFinish",
				predecessor: "1",
				successor: "0"
			});

			oGantt.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
			oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls4);
			oGantt.getTable().getRows()[1].getAggregation('_settings').addRelationship(oRls1);
			oGantt.getTable().getRows()[2].getAggregation('_settings').addRelationship(oRls2);
			oGantt.getTable().getRows()[4].getAggregation('_settings').addRelationship(oRls3);

			return utils.waitForGanttRendered(oGantt).then(async function () {
				await nextUIUpdate();
				//Assert
				assert.ok(oRls.getD().includes(NaN) == false, " L Relationship instance is drawn properly.");
				assert.ok(oRls4.getD().includes(NaN) == false, " L Relationship instance is drawn properly.");
				assert.ok(oRls1.getD().includes(NaN) == false, "U Relationship instance is drawn properly.");
				assert.ok(oRls2.getD().includes(NaN) == false, "S Relationship instance is drawn properly.");
				assert.ok(oRls3.getD().includes(NaN) == false, "Z Relationship instance is drawn properly.");
				fnDone();

			});
		});
	});
});
