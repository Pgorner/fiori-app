/*global QUnit, sinon*/
sap.ui.define(
	["sap/gantt/simple/BaseDeltaRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils",	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/core/RenderManager",
	"sap/gantt/simple/test/nextUIUpdate"],
	function (BaseDeltaRectangle,utils,GanttRowSettings,
		RenderManager,
		nextUIUpdate) {
		"use strict";
		QUnit.module("Property", {
			beforeEach: function () {
				this.oRectangle = new BaseDeltaRectangle();
			},
			afterEach: function () {
				this.oRectangle = null;
			}
		});
		QUnit.test("Verify Default values", function (assert) {
			assert.strictEqual(this.oRectangle.getRx(), 0);
			assert.strictEqual(this.oRectangle.getRy(), 0);
			assert.strictEqual(
				this.oRectangle.getTitle(),
				"",
				"Default Title is empty"
			);
			assert.strictEqual(
				this.oRectangle.getShowTitle(),
				true,
				"Default showtitle is True"
			);
		 });

		QUnit.test("Verify width property", async function (assert) {
			this.oRectangle.setWidth("10");
			await nextUIUpdate();
			assert.strictEqual(
				this.oRectangle.getWidth(),
				"10",
				"Value of the width property is set"
			);
		});
		QUnit.test("Verify width property by providing null value", async function (
			assert
		) {
			this.oRectangle.setWidth(null);
			await nextUIUpdate();
			assert.ok(
				this.oRectangle.getWidth() !== null,
				"Value of the width property is set"
			);
			assert.strictEqual(
				this.oRectangle.getWidth(),
				0,
				"Value of the width property is 0"
			);
		});

		QUnit.test("Verify the title property", async function (assert) {
			assert.strictEqual(
				this.oRectangle.getTitle(),
				"",
				"Default value for title is set"
			);
			this.oRectangle.setTitle("Test Title");
			await nextUIUpdate();
			assert.strictEqual(
				this.oRectangle.getTitle(),
				"Test Title",
				"Value of the title property is set"
			);
		});

		QUnit.test("Verify the showTitle property", async function (assert) {
			assert.strictEqual(
				this.oRectangle.getShowTitle(),
				true,
				"Default value for the showTitle is true"
			);
			this.oRectangle.setShowTitle(false);
			await nextUIUpdate();
			assert.strictEqual(
				this.oRectangle.getShowTitle(),
				false,
				"Value of the showTitle property is false"
			);
		});

		QUnit.test("Verify RenderUtils is called to create base text title", function (assert) {
			var renderElementTitleSpy = sinon.spy(sap.gantt.simple.RenderUtils, "renderElementTitle");
			var oRm = new RenderManager();
			var sText = "Test Title";

			this.oRectangle.renderElement(oRm, this.oRectangle);

			assert.ok(renderElementTitleSpy.calledWithMatch(oRm, this.oRectangle, sinon.match.func), "Called with render manager and element");

			var spyCall = renderElementTitleSpy.getCall(0);
			var fnTitleCreator = spyCall.args[2];

			assert.ok(fnTitleCreator({text: sText}).getText() === sText, "Called with title creator function");

			oRm.destroy();
			renderElementTitleSpy.restore();
		});

		QUnit.module("Function", {
			beforeEach: function () {
				this.oRectangle = new BaseDeltaRectangle({
					x: 10.0,
					y: 20.0,
					height: 15,
					width: 30,
					opacity: 0.4
				});
			},
			afterEach: function () {
				this.oRectangle = null;
			}
		});

		QUnit.test("Render Element", function (assert) {
			var oRm = new RenderManager();
			this.oRectangle.renderElement(oRm, this.oRectangle);
			oRm.flush(window.document.getElementById("qunit-fixture"));
			oRm.destroy();
			assert.ok(
				jQuery("#qunit-fixture").find("rect").length === 1,
				"Rendering Rectangle is OK"
			);
		});

		QUnit.test("Event Click.", function (assert) {
			var oRm = new RenderManager();
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			var done = assert.async();
			this.oRectangle.attachPress(function (oEvent) {
				assert.strictEqual(oEvent.getSource().getX(), 10);
				done();
			});
			this.oRectangle.onclick(new jQuery.Event("sapselect"));
		});
		QUnit.test("Event Mouse Enter.", function (assert) {
			var oRm = new RenderManager();
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			var done = assert.async();
			this.oRectangle.attachMouseEnter(function (oEvent) {
				assert.strictEqual(oEvent.getSource().getX(), 10);
				done();
			});
			this.oRectangle.onmouseover(new jQuery.Event("mouseenter"));
		});
		QUnit.test("Event Mouse Leave.", function (assert) {
			var oRm = new RenderManager();
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			var done = assert.async();
			this.oRectangle.attachMouseLeave(function (oEvent) {
				assert.strictEqual(oEvent.getSource().getX(), 10);
				done();
			});
			this.oRectangle.onmouseout(new jQuery.Event("mouseout"));
		});


	QUnit.module("caching of Values", {
		before: function() {
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: function () {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}"
			}));
			document.getElementById("qunit-fixture").style.width = "1920px";
		},
		afterEach: function () {
			utils.destroyGantt();
		},
		after: function() {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		},
		fnGetFakedEvent : function () {
			return {
				originalEvent: {
					shiftKey: true,
					ctrlKey: true,
					detail: 100,
					deltaX: 20,
					deltaY: 300,
					pageX: 450
				},
				preventDefault: function () { },
				stopPropagation: function () { }
			};
		}
	});

	QUnit.test("caching of width", function (assert) {
		var done  = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function(){
			var cacheMap  = this.oGantt.getAxisTime()._shapeWidthValue,
			cacheMapSpy = sinon.spy(cacheMap,"add");
		    this.oGantt.getTable().getRows()[0].getAggregation("_settings").addAggregation("shapes1",new BaseDeltaRectangle({
				shapeId: "{Id}",
				time: "{StartDate}",
				endTime: "{EndDate}",
				title: "{Name}",
				fill: "#008FD3",
				selectable: true,
				resizable: true
			}));
			return utils.waitForGanttRendered(this.oGantt).then(function(){
				setTimeout(function() {
					this.rectangle = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
					assert.equal(cacheMapSpy.callCount, 1,"caled once");
					assert.equal(cacheMap.values.length,1,"width values is added in cache");
					var oAxisTime = this.oGantt.getAxisTime();
					var oAxisTimeStrategy = this.oGantt.getAxisTimeStrategy();
					var timeDiff = Math.abs(this.rectangle.getTime().valueOf() - this.rectangle.getEndTime().valueOf());
					var iZoomRate = oAxisTime.getZoomRate();
					var viewOffset = oAxisTime.getViewOffset();
					var viewRange = oAxisTime.getViewRange()[1];
					var iZoomLevel = oAxisTimeStrategy.getZoomLevel();
					var iWidth = this.rectangle.getWidth();
					assert.equal(cacheMap.keyStore[0][0],iZoomRate,"aInput key is set correctly");
					assert.equal(cacheMap.keyStore[0][1],timeDiff,"aInput key is set correctly");
					assert.equal(cacheMap.keyStore[0][2],viewOffset,"aInput key is set correctly");
					assert.equal(cacheMap.keyStore[0][3],viewRange,"aInput key is set correctly");
					this.oGantt.attachEventOnce("visibleHorizonUpdate", function (oEvent) {
						assert.notEqual(iZoomRate,  oAxisTime.getZoomRate(),"zoom rate should change");
						assert.equal(iZoomLevel, oAxisTimeStrategy.getZoomLevel(),"zoom level should not change");
						assert.notEqual(iWidth, this.rectangle.getWidth(),"Width should change");
					}, this);
					var oZoomExtension = this.oGantt._getZoomExtension();
					var oEvent = this.fnGetFakedEvent();
					oZoomExtension.onMouseWheelZooming(oEvent,oAxisTimeStrategy, oAxisTime.timeToView(new Date()), -200);
					done();
				}.bind(this), 0);
			}.bind(this));
		}.bind(this));
	});

	}
);
