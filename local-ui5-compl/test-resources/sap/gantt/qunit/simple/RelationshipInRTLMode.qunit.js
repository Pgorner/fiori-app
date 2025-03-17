/*global QUnit*/

sap.ui.define([
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function (GanttRowSettings, BaseRectangle, Relationship, utils, GanttChartConfigurationUtils) {
	"use strict";

	QUnit.module("Connector Overlap", {
		before: function(){
			GanttChartConfigurationUtils.setRTL(true);
		},
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
		},
		after: function(){
			GanttChartConfigurationUtils.setRTL(false);
		}
	});
	QUnit.test("Start Connector Shapes Overlap in RTL mode", function (assert) {
		var done = assert.async();

			var oRls = new Relationship({
				shapeId: "rel-1",
				type: "StartToFinish",
				predecessor: "0",
				successor: "1",
				shapeTypeStart: "Square",
				_lMarker: ""
			});
			var oRls1 = new Relationship({
				shapeId: "rel-2",
				type: "StartToFinish",
				predecessor: "0",
				successor: "2",
				shapeTypeStart: "Square",
				_lMarker: ""
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "Square", "Connector shape will remain same  on overlap with same shape");
			oRls.setProperty("shapeTypeStart", "Circle", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "HorizontalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with different shape");
			done();
	});

	QUnit.test("End Connector Shape Overlap in RTL mode", function (assert) {
		var done = assert.async();

			var oRls = new Relationship({
				shapeId: "rel-1",
				type: "StartToFinish",
				predecessor: "3",
				successor: "1",
				shapeTypeEnd: "Square"
			});
			var oRls1 = new Relationship({
				shapeId: "rel-2",
				type: "StartToFinish",
				predecessor: "4",
				successor: "1",
				shapeTypeEnd: "Square"
			});
			oRls.setProperty("_lMarker", "", true);
			oRls1.setProperty("_lMarker", "", true);
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end"), "Square", "Connector shape will remain same  on overlap with same shape");
			oRls.setProperty("shapeTypeEnd", "Circle", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end"), "HorizontalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with different shape");
			done();

	});

	QUnit.test("End Connector Overlap in L-shape up/down position in RTL mode", function (assert) {

		var done = assert.async();

			var oRls = new Relationship({
				shapeId: "rel-1",
				type: "StartToFinish",
				predecessor: "0",
				successor: "1",
				shapeTypeEnd: "Square"
			});
			var oRls1 = new Relationship({
				shapeId: "rel-2",
				type: "StartToFinish",
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

	QUnit.test("Start Connector Shapes Overlap with End shape Connector of other Relation in RTL mode", function (assert) {
		var done = assert.async();

			var oRls = new Relationship({
				shapeId: "rel-1",
				type: "StartToFinish",
				predecessor: "0",
				successor: "1",
				shapeTypeStart: "Arrow",
				shapeTypeEnd: "Circle"
			});
			var oRls1 = new Relationship({
				shapeId: "rel-2",
				type: "FinishToStart",
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

});
