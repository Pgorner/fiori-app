/*global QUnit, sinon */
sap.ui.define(["sap/gantt/simple/BaseRectangle",
"sap/gantt/simple/test/GanttQUnitUtils",	"sap/gantt/simple/GanttRowSettings",
"sap/ui/core/RenderManager",
"sap/gantt/simple/test/nextUIUpdate"
], function (BaseRectangle,utils,GanttRowSettings,
	RenderManager,
	nextUIUpdate) {
    "use strict";
	QUnit.module("Property", {
		beforeEach: function () {
			this.oRectangle = new BaseRectangle({
				x:0,
				rowYCenter: 10
			});
			this.oRectangle._iBaseRowHeight = 48.79999923706055;
		},
		afterEach: function () {
			this.oRectangle = null;
		}
	});
	QUnit.test("Verify Default values", function (assert) {
        assert.strictEqual(this.oRectangle.getTitle(), "", "Default Title is empty");
        assert.strictEqual(this.oRectangle.getShowTitle(), true, "Default showtitle is True");
		assert.strictEqual(this.oRectangle.getTitleColor(), undefined, "Default Title color is undefined");
		assert.strictEqual(this.oRectangle.getOpacity(), 1, "Default opacity is 1");
	});

	QUnit.test("Rendering", function (assert) {
		var oRm = new RenderManager();
		this.oRectangle.setProperty("opacity", 0.5);
		this.oRectangle.renderElement(oRm, this.oRectangle);
		oRm.flush(document.getElementById("qunit-fixture"));
		oRm.destroy();
		assert.strictEqual(document.getElementById("qunit-fixture").children[0].getAttribute("opacity"), "0.5", "base rectangle opcacity is correct");
	});

	QUnit.test("Verify the title property", async function (assert) {
		assert.strictEqual(this.oRectangle.getTitle(), "", "Default value for title is set");
		this.oRectangle.setTitle("Test Title");
		this.oRectangle.setTitleColor("blue");
		await nextUIUpdate();
		assert.strictEqual(this.oRectangle.getTitle(), "Test Title", "Value of the title property is set");
		assert.strictEqual(this.oRectangle.getTitleColor(), "blue", "Value of the title color is set");
	});

	QUnit.test("Verify the showTitle property", async function (assert) {
		assert.strictEqual(this.oRectangle.getShowTitle(), true, "Default value for the showTitle is true");
		this.oRectangle.setShowTitle(false);
		await nextUIUpdate();
		assert.strictEqual(this.oRectangle.getShowTitle(), false, "Value of the showTitle property is false");
	});

	QUnit.test("getY for alignshape", function (assert) {
		var y;

		this.oRectangle.setAlignShape("Top");
		y = -13;
		assert.strictEqual(this.oRectangle.getY(), y, "In RTL mode, for alignShape = top the return value is '" + y + "'");

		this.oRectangle.setAlignShape("Middle");
		y = -5;
		assert.strictEqual(this.oRectangle.getY(), y, "In RTL mode, for alignShape = middle the return value is '" + y + "'");

		this.oRectangle.setAlignShape("Bottom");
		y = 2;
		assert.strictEqual(this.oRectangle.getY(), y, "In RTL mode, for alignShape = bottom the return value is '" + y + "'");
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
					deltaX: 200,
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
		    this.oGantt.getTable().getRows()[0].getAggregation("_settings").addAggregation("shapes1",new BaseRectangle({
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

});
