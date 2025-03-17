/*global QUnit */
sap.ui.define([
	"sap/gantt/simple/AdhocLine",
	"sap/gantt/AdhocLine",
	"sap/gantt/simple/BaseDiamond",
	"sap/gantt/misc/Format",
	"sap/gantt/misc/AxisTime",
	"sap/ui/core/Core",
	"sap/gantt/simple/BaseConditionalShape",
	"./GanttQUnitUtils",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseLine",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/AdhocLineRenderer",
	"sap/ui/core/RenderManager"
], function (AdhocLine, sapGanttAdhocLine, BaseDiamond, Format, AxisTime, Core, BaseConditionalShape, GanttQUnitUtils, BaseRectangle, BaseLine, QUnitUtils, AdhocLineRenderer,
	RenderManager) {
	"use strict";

	QUnit.module("Create AdhocLine with default values.", {
		beforeEach: function () {
			this.oAdhocLine = new AdhocLine();
		},
		afterEach: function () {
			this.oAdhocLine.destroy();
			this.oAdhocLine = undefined;
		}
	});

	QUnit.test("Test default configuration values." , function (assert) {
		assert.strictEqual(this.oAdhocLine.getStroke(), undefined);
		assert.strictEqual(this.oAdhocLine._getStrokeWidth(), 1);
		assert.strictEqual(this.oAdhocLine.getStrokeDasharray(), undefined);
		assert.strictEqual(this.oAdhocLine.getStrokeOpacity(), 1);
		assert.strictEqual(this.oAdhocLine.getTimeStamp(), undefined);
		assert.strictEqual(this.oAdhocLine.getDescription(), undefined);
	});

	QUnit.module("Create config.Mode with customized values.", {
		beforeEach: function () {
			this.oAdhocLine = new AdhocLine({
				stroke: "#DC143C",
				strokeDasharray: "5,5",
				strokeOpacity: 0.5,
				timeStamp: "20170315000000",
				description: "Product Release."
			});
		},
		afterEach: function () {
			this.oAdhocLine.destroy();
			this.oAdhocLine = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oAdhocLine.getStroke(), "#DC143C");
		assert.strictEqual(this.oAdhocLine.getStrokeDasharray(), "5,5");
		assert.strictEqual(this.oAdhocLine.getStrokeOpacity(), 0.5);
		assert.strictEqual(this.oAdhocLine.getTimeStamp(), "20170315000000");
		assert.strictEqual(this.oAdhocLine.getDescription(), "Product Release.");
	});

	/**
	 * @deprecated since 1.84
	 */
	QUnit.test("Test Adhoc Lines when timestamp is empty." , function (assert) {
		var done = assert.async();
		this.gantt = GanttQUnitUtils.createGantt();
		this.gantt.placeAt("qunit-fixture");

		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.addAdhocLine(new sapGanttAdhocLine({
					stroke: "#DC143C",
					strokeWidth: 2,
					strokeDasharray: "5,5",
					strokeOpacity: 0.5,
					timeStamp: Format.dateToAbapTimestamp(new Date((new Date()).getTime() + 500000000) ),
					description: "Test Adhoc Line1",
					markerType: sap.gantt.simple.MarkerType.Diamond
				}));
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						assert.equal(this.gantt.getAdhocLines().length, 1, "1 Adhoc lines added to the Gantt Aggregation.");
						this.gantt.addAdhocLine(new sapGanttAdhocLine({
							stroke: "#DC143C",
							strokeWidth: 2,
							strokeDasharray: "5,5",
							strokeOpacity: 0.5,
							timeStamp: "",
							description: "Test Adhoc Line2",
							markerType: sap.gantt.simple.MarkerType.Diamond
						}));
						return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
							setTimeout(function(){
								assert.equal(this.gantt.getAdhocLines().length, 2, "2 Adhoc lines added to the Gantt Aggregation.");
								assert.equal(this.gantt.getAdhocLines()[1].getTimeStamp(), "", "Adhoc Line 2 has no timeStamp. ");
								this.gantt.destroy();
								done();
							}.bind(this), 500); // need to wait because Table updates its rows async
						}.bind(this));
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.module("Rendering.", {
		beforeEach: function () {
			this.oAdhocLine = new AdhocLine({
				stroke: "#DC143C",
				strokeDasharray: "5,5",
				strokeOpacity: 0.5,
				timeStamp: "20170315000000",
				endTimeStamp: "20170315000000",
				description: "Product Release."
			});
			this.oShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						id: "r1",
						shapeId: "r1",
						x: 0,
						y: 0,
						rx: 10,
						ry: 10
					}),
					new BaseRectangle({
						id: "r2",
						shapeId: "r2",
						x: 0,
						y: 0,
						rx: 10,
						ry: 10
					})
				]
			});
			this.oGantt = GanttQUnitUtils.createSimpleGantt(
				this.oShape,
				"20180101000000",
				"20180105000000"
			);
			this.oGantt.placeAt("content");
		},
		afterEach: function () {
			this.oAdhocLine.destroy();
			this.oAdhocLine = undefined;
			this.oGantt.destroy();
			this.oGantt = undefined;
		},
		delayedAssert: function(fnAssertion) {
			setTimeout(function(){
				fnAssertion();
			}, 2000);
		}
	});

	QUnit.test("Render Marker.", function (assert) {
		var oRm = new RenderManager();
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function () {
				AdhocLineRenderer.renderMarker(oRm, this.oAdhocLine, this.oGantt, 20, 13);
				return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function () {
						oRm.flush(window.document.getElementById("content"));
						oRm.destroy();
						assert.ok(jQuery('#content').find("path").length === 1, "Rendering marker is OK");
						done();
					}, 500); // need to wait because Table updates its rows async
				});
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Render Line.", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function () {
				var oRm = new RenderManager();
				AdhocLineRenderer.renderMarker(oRm, this.oAdhocLine, this.oGantt, 20, 13);
				AdhocLineRenderer.renderLine(oRm, this.oAdhocLine, this.oGantt);
				return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function() {
						oRm.flush(window.document.getElementById("content"));
						oRm.destroy();
						assert.ok(jQuery('#content').find("line").length === 2, "Rendering line is OK");
						done();
					}, 500); // need to wait because Table updates its rows async
				});
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Re-Render Line.", function (assert) {
		this.oAdhocLine._setLine( new BaseLine({
			stroke: "#DC143C",
			strokeWidth: 2,
			strokeDasharray: "5,5",
			strokeOpacity: 0.5,
			timeStamp: "20170315000000",
			description: "Product Release."
		}));
		var oRm = new RenderManager();
		AdhocLineRenderer.renderLine(oRm, this.oAdhocLine, this.oGantt);
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		assert.ok(jQuery('#content').find("line").length === 1, "Rendering line is OK");
	});

	QUnit.test("Event Click.",function (assert){
		var oRm = new RenderManager();
		AdhocLineRenderer.renderMarker(oRm, this.oAdhocLine, this.oGantt, 20, 13);
		AdhocLineRenderer.renderLine(oRm, this.oAdhocLine, this.oGantt);
		assert.strictEqual(this.oAdhocLine._getLine().getStrokeWidth(), 1);
		this.oAdhocLine.setMarkerType("Diamond");
		this.oAdhocLine._setSelected(true);
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		this.oAdhocLine.attachMarkerPress(function(oEvent){
			assert.strictEqual(oEvent.getSource().getDescription(), "Product Release.");
			assert.strictEqual(parseInt(document.getElementById(oEvent.getSource()._getLine().sId).style.strokeWidth), 2);
			done();
		});

		this.oAdhocLine._getMarker().firePress(new jQuery.Event("sapselect"));
	});

	QUnit.test("Event Hover.",function (assert){
		var oRm = new RenderManager();
		AdhocLineRenderer.renderMarker(oRm, this.oAdhocLine, this.oGantt, 20, 13);
		AdhocLineRenderer.renderLine(oRm, this.oAdhocLine, this.oGantt);
		assert.strictEqual(this.oAdhocLine._getLine().getStrokeWidth(), 1);
		this.oAdhocLine.setMarkerType("Diamond");
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		this.oAdhocLine.attachMarkerMouseEnter(function(oEvent){
			assert.strictEqual(oEvent.getSource().getDescription(), "Product Release.");
			assert.strictEqual(parseInt(document.getElementById(oEvent.getSource()._getLine().sId).style.strokeWidth), 2);
			var oMarker = this.oAdhocLine._getMarker();
			assert.strictEqual(oMarker.getTooltip(), "Product Release.");
			done();
		}.bind(this));

		this.oAdhocLine._getMarker().fireMouseEnter(new jQuery.Event("mouseenter"));
	});

	QUnit.test("Event Mouse Leave.",function (assert){
		var oRm = new RenderManager();
		AdhocLineRenderer.renderMarker(oRm, this.oAdhocLine, this.oGantt, 20, 13);
		AdhocLineRenderer.renderLine(oRm, this.oAdhocLine, this.oGantt);
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		var oMarker = this.oAdhocLine._getMarker();

		this.oAdhocLine.attachMarkerMouseLeave(function(oEvent){
			assert.strictEqual(oEvent.getSource().getDescription(), "Product Release.");
			done();
		});

		oMarker.fireMouseLeave(new jQuery.Event("mouseout"));
	});

	QUnit.test("Event AdhocDiamond Click.",function (assert){
		var oRm = new RenderManager();
		AdhocLineRenderer.renderMarker(oRm, this.oAdhocLine, this.oGantt, 20, 13);
		AdhocLineRenderer.renderLine(oRm, this.oAdhocLine, this.oGantt);
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		var oMarker = this.oAdhocLine._getMarker();

		oMarker.attachPress(function(oEvent){
			assert.strictEqual(1, 1);
			done();
		});
		oMarker.onclick(new jQuery.Event("sapselect"));
	});

	QUnit.test("Event AdhocDiamond Mouse Enter.",function (assert){
		var oRm = new RenderManager();
		AdhocLineRenderer.renderMarker(oRm, this.oAdhocLine, this.oGantt, 20, 13);
		AdhocLineRenderer.renderLine(oRm, this.oAdhocLine, this.oGantt);
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		var oMarker = this.oAdhocLine._getMarker();

		this.oAdhocLine._getMarker().attachMouseEnter(function(oEvent){
			assert.strictEqual(1, 1);
			done();
		});

		oMarker.onmouseover(new jQuery.Event("mouseenter"));
	});

	QUnit.test("Event AdhocDiamond Mouse Leave.",function (assert){
		var oRm = new RenderManager();
		AdhocLineRenderer.renderMarker(oRm, this.oAdhocLine, this.oGantt, 20, 13);
		AdhocLineRenderer.renderLine(oRm, this.oAdhocLine, this.oGantt);
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		var oMarker = this.oAdhocLine._getMarker();

		oMarker.attachMouseLeave(function(oEvent){
			assert.strictEqual(1, 1);
			done();
		});
		oMarker.onmouseout(new jQuery.Event("mouseout"));
	});

});
