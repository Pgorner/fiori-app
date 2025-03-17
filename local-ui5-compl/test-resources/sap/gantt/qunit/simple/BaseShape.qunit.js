/*global QUnit, sinon */

sap.ui.define([
	"sap/base/Log",
	"sap/gantt/simple/BaseShape",
	"sap/gantt/simple/CoordinateUtils",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/Relationship",
	"sap/ui/core/RenderManager"
], function(Log, BaseShape, CoordinateUtils, qutils, utils, BaseRectangle,
	Relationship, RenderManager) {
	"use strict";

	QUnit.module("BaseShape", {
		assertFalseDefaultValue: function(assert, oShape, sProp) {
			assert.equal(oShape.getProperty(sProp), false, "default value: " + sProp + " in BaseShape is false");
		}
	});

	QUnit.test("Property - default values", function(assert) {
		var oShape = new BaseShape();
		this.assertFalseDefaultValue(assert, oShape, "expandable");
		this.assertFalseDefaultValue(assert, oShape, "selectable");
		this.assertFalseDefaultValue(assert, oShape, "draggable");
		this.assertFalseDefaultValue(assert, oShape, "selected");
		this.assertFalseDefaultValue(assert, oShape, "resizable");
		this.assertFalseDefaultValue(assert, oShape, "hoverable");
	});
	QUnit.test("Alignment of shapes", function(assert) {
		var oShapeIn1stRow = new BaseRectangle({
			height: 21,
			rowYCenter: 13.5
		});
		oShapeIn1stRow._iBaseRowHeight = 49;
		var oIndicatorIn1stRow = new BaseRectangle({
			height: 4,
			rowYCenter: 13.5
		});
		oIndicatorIn1stRow._iBaseRowHeight = 49;
		var oShapeIn2ndRow = new BaseRectangle({
			height: 21,
			rowYCenter: 311
		});
		oShapeIn2ndRow._iBaseRowHeight = 49;
		var oIndicatorIn2ndRow = new BaseRectangle({
			height: 4,
			rowYCenter: 311
		});
		oIndicatorIn2ndRow._iBaseRowHeight = 49;
		assert.ok((oShapeIn1stRow.getY() - oIndicatorIn1stRow.getY()) == (oShapeIn2ndRow.getY() - oIndicatorIn2ndRow.getY()), "Gap between the indicator and its shape in any row should be same");
	});

	QUnit.test("BaseShape enabled CustomStyleClassSupport", function(assert){
		var oShape = new BaseShape();
		assert.ok(oShape.hasStyleClass != null, "has hasStyleClass");
		assert.ok(oShape.toggleStyleClass != null, "has toggleStyleClass");
		assert.ok(oShape.removeStyleClass != null, "has removeStyleClass");
	});

	QUnit.test("Property - setShapeUid is disabled", function(assert){
		var oShape = new BaseShape();
		var fnError = sinon.spy(Log, "error");
		var aErrors = [];
		assert.equal(aErrors.length, 0, "Error was not logged so far");
		oShape.setShapeUid("fakeUid");
		aErrors = filterLogWarnings(fnError);
		assert.equal(aErrors[0][0], "The control manages the shapeUid generation. The method \"setShapeUid\" cannot be used programmatically!", "setShapeUid error logged");
		assert.ok(aErrors.length, "call shapeUid gets assert error");

		oShape.setProperty("shapeUid", "UID");
		aErrors = filterLogWarnings(fnError);
		assert.equal(oShape.getProperty("shapeUid"), "UID", "getShapeUid is enabled");
		assert.equal(aErrors.length, 1, "No error logged when calling setProperty");
		fnError.restore();

		function filterLogWarnings(fnError) {
			return fnError.args.filter(function(arg){
				return arg[0].indexOf("The control manages the shapeUid generation.") == 0;
			});
		}
	});

	QUnit.test("Verify the title property", function (assert) {
		var oShape = new BaseShape();
		assert.strictEqual(oShape.getTitle(), "", "Default value for title is set");
		oShape.setTitle("Test Title");
		assert.strictEqual(oShape.getTitle(), "Test Title", "Value of the title property is set");
	});

	QUnit.test("Verify the fontSize property", function (assert) {
		var oShape = new BaseShape();
		assert.strictEqual(oShape.getFontSize(), 13, "Default fontsize is 13");
		oShape.setFontSize(10);
		assert.strictEqual(oShape.getFontSize(), 10, "Value of the fontSize property is set");
	});

	QUnit.test("Verify the fontWeight property", function (assert) {
		var oShape = new BaseShape();
		assert.strictEqual(oShape.getFontWeight(), "normal", "Default value for fontWeight is normal");
		oShape.setFontWeight("bold");
		assert.strictEqual(oShape.getFontWeight(), "bold", "Value of the fontWeight property is set");
	});

	QUnit.test("Verify the showTitle property", function (assert) {
		var oShape = new BaseShape();
		assert.strictEqual(oShape.getShowTitle(), true, "Default value for the showTitle is true");
		oShape.setShowTitle(false);
		assert.strictEqual(oShape.getShowTitle(), false, "Value of the showTitle property is false");
	});

	QUnit.test("Verify the verticalTextAlignment property", function (assert) {
		var oShape = new BaseShape();
		assert.strictEqual(oShape.getVerticalTextAlignment(), "Center", "Default value for the verticalTextAlignment is Center");
		oShape.setVerticalTextAlignment("Top");
		assert.strictEqual(oShape.getVerticalTextAlignment(), "Top", "Top value of the verticalTextAlignment property is Top");
		oShape.setVerticalTextAlignment("Bottom");
		assert.strictEqual(oShape.getVerticalTextAlignment(), "Bottom", "Bottom value of the verticalTextAlignment property is Bottom");
	});

	QUnit.test("Verify the horizontalTextAlignment property", function (assert) {
		var oShape = new BaseShape();
		assert.strictEqual(oShape.getHorizontalTextAlignment(), "Start", "Default value for the horizontalTextAlignment is Start");
		oShape.setHorizontalTextAlignment("Middle");
		assert.strictEqual(oShape.getHorizontalTextAlignment(), "Middle", "Middle value of the horizontalTextAlignment property is Middle");
		oShape.setHorizontalTextAlignment("End");
		assert.strictEqual(oShape.getHorizontalTextAlignment(), "End", "End value of the horizontalTextAlignment property is End");
	});

	QUnit.test("Property - getTransform", function(assert) {
		var oShape = new BaseShape({
			xBias: 1, yBias: 2
		});
		assert.equal(oShape.getTransform(), "translate(1 2)", "getTransform concat correctly");
	});

	QUnit.test("Property - setTransform", function(assert) {
		var sTransformValue = "translate(10,20)";
		var oShape = new BaseShape({transform: sTransformValue});
		assert.equal(oShape.getTransform(), sTransformValue, "getTransform() is correct");
		assert.equal(oShape.getXBias(), 10, "xBias was set to 10");
		assert.equal(oShape.getYBias(), 20, "yBias was set to 20");
	});

	QUnit.test("Rendering - renderElement", function(assert){
		var oShape = new BaseShape();
		var oRm = new RenderManager();
		oShape.renderElement(oRm, oShape);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();
		assert.ok(jQuery('#qunit-fixture').is(':empty'), "do nothing when rendering base shape");
	});

	QUnit.test("Verify anchorPosition properties", function (assert) {
		var oShape = new BaseShape();
		assert.strictEqual(oShape.getLeftAnchorPosition(), 50, "Default value for leftAnchorPosition is set");
		assert.strictEqual(oShape.getRightAnchorPosition(), 50, "Default value for rightAnchorPosition is set");
		oShape.setLeftAnchorPosition("-25");
		oShape.setRightAnchorPosition("110");
		assert.strictEqual(oShape.getLeftAnchorPosition(), 0, "Value for leftAnchorPosition is set within the allowed range");
		assert.strictEqual(oShape.getRightAnchorPosition(), 100, "Value for rightAnchorPosition is set within the allowed range");
	});

	QUnit.module("Interaction - BaseShape", {
		beforeEach: function(){
			this.sut = utils.createGantt(true);
			this.sut.placeAt("qunit-fixture");

			this.oHandler = utils.createGanttHandler(this, this.sut);
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getFirstShape: function(){
			var oFirstShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			oFirstShape.setSelectable(false);
			return oFirstShape;
		},

		delayedAssert: function(fnAssertion) {
			setTimeout(function(){
				fnAssertion();
			}, 2000);
		}
	});

	QUnit.test("Interaction - onclick", function(assert) {
		var done1 = assert.async(),
			done2 = assert.async();

		utils.waitForGanttRendered(this.sut).then(function () {
			this.delayedAssert(function() {
				var oFirstShape = this.getFirstShape();
				assert.ok(oFirstShape != null, "Shape instance is found");
				assert.equal(oFirstShape.getSelectable(), false, "Shape selectable is false");
				assert.ok(oFirstShape.getDomRef() != null, "First shape dom is visible");

				var oClickSpy = sinon.spy(oFirstShape, "onclick");
				var oHandleShapePress = sinon.spy(this.sut, "handleShapePress");
				qutils.triggerEvent("click", oFirstShape.getId());

				assert.ok(oClickSpy.calledOnce, "user had clicked on the first shape");
				assert.ok(oHandleShapePress.notCalled, "_setShapeSelected doesn't get called");

				oFirstShape.setSelectable(true);
				this.sut.setDisableShapeDoubleClickEvent(true);
				qutils.triggerEvent("click", oFirstShape.getId());
				assert.ok(oHandleShapePress.calledOnce, "event is called immediately");

				this.sut.setDisableShapeDoubleClickEvent(false);
				this.sut.attachEventOnce("shapePress", function (oEvent) {
					assert.ok(true, "event is called with delay");
					assert.equal(oEvent.mParameters.hasOwnProperty("ctrlOrMeta"), true, "event is called with ctrlOrMeta parameter");
					assert.equal(oEvent.mParameters.hasOwnProperty("pageX"), true, "event has pageX parameter");
					assert.equal(oEvent.mParameters.hasOwnProperty("pageY"), true, "event has pageY parameter");
					assert.equal(oEvent.mParameters.hasOwnProperty("originEvent"), true, "event has original event parameter");
					done2();
				});
				qutils.triggerEvent("click", oFirstShape.getId());

				oClickSpy.restore();
				oHandleShapePress.restore();
				done1();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Onclick - test prevent selection", function(assert) {
		var done = assert.async();

		utils.waitForGanttRendered(this.sut).then(function () {
			this.delayedAssert(function() {
				var oFirstShape = this.getFirstShape();

				// Click event is called immediately when double click is disabled
				this.sut.setDisableShapeDoubleClickEvent(true);
				oFirstShape.setSelectable(true);

				qutils.triggerEvent("click", oFirstShape.getId());
				assert.ok(oFirstShape.getSelected(), "shape is selected");

				oFirstShape.setSelected(false);
				assert.notOk(oFirstShape.getSelected(), "shape is not selected");

				this.sut.attachEventOnce("shapePress", function (oEvent) {
					oEvent.preventDefault();
				});
				qutils.triggerEvent("click", oFirstShape.getId());
				assert.notOk(oFirstShape.getSelected(), "shape is not selected");

				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Interaction - dblclick", function(assert) {
		var done = assert.async();

		utils.waitForGanttRendered(this.sut).then(function () {
			this.delayedAssert(function() {
				var oFirstShape = this.getFirstShape();

				var oClickSpy = sinon.spy(oFirstShape, "onclick");
				var oDblClickSpy = sinon.spy(oFirstShape, "ondblclick");
				qutils.triggerEvent("dblclick", oFirstShape.getId());

				assert.ok(oClickSpy.notCalled, "dblclick won't call onclick");
				assert.ok(oDblClickSpy.calledOnce, "ondblclick calls once");

				this.sut.attachEventOnce("shapeDoubleClick", function (oEvent) {
					assert.ok(true, "event is called");
					assert.equal(oEvent.mParameters.hasOwnProperty("pageX"), true, "event has pageX parameter");
					assert.equal(oEvent.mParameters.hasOwnProperty("pageY"), true, "event has pageY parameter");
				});
				qutils.triggerEvent("dblclick", oFirstShape.getId());

				this.sut.setDisableShapeDoubleClickEvent(true);
				this.sut.attachEventOnce("shapeDoubleClick", function () {
					assert.ok(false, "event should be disabled");
				});
				qutils.triggerEvent("dblclick", oFirstShape.getId());

				oClickSpy.restore();
				oDblClickSpy.restore();
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Interaction - oncontextmenu", function(assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(function () {
			this.delayedAssert(function(){
				var oFirstShape = this.getFirstShape(),
					oGantt = window.oGanttChart;

				var oRightClickSpy = sinon.spy(oFirstShape, "oncontextmenu");
				var tableOnAfterRenderingSpy = sinon.spy(this.sut.getTable(), "onAfterRendering");
				sinon.stub(oFirstShape, "getGanttChartBase").returns(oGantt);

				oGantt.attachShapeContextMenu(function(oEvent){
					assert.equal(oEvent.getSource().getId(), oGantt.getId(), "shape context menu event fired with correct gantt");
					assert.equal(oFirstShape.getId(), oEvent.getParameter("shape").getId());
					assert.equal(oEvent.mParameters.hasOwnProperty("originEvent"), true, "event has original event parameter");
				});

				qutils.triggerEvent("contextmenu", oFirstShape.getId());

				assert.ok(oRightClickSpy.calledOnce, "oncontext menu is called when right click on the shape");
				assert.ok(tableOnAfterRenderingSpy.notCalled, "Table OnafterRendering not triggered after ContextMenu Selection.");
				oFirstShape.getGanttChartBase.restore();
				oRightClickSpy.restore();
				tableOnAfterRenderingSpy.restore();
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Interaction - onmouseover and onmouseout", function(assert) {
		var oFirstShape;

		var setup = function (_result, callback) {
			oFirstShape = this.getFirstShape();
			oFirstShape.setHoverable(true);

			assert.ok(oFirstShape.getDomRef() != null, "First shape dom is visible");
			callback();
		};

		var testDefault = function (_result, callback) {
			var oHandleShapeMouseEnter = sinon.stub(this.sut, "handleShapeMouseEnter").returns(undefined);
			var oHandleShapeMouseLeave = sinon.stub(this.sut, "handleShapeMouseLeave").returns(undefined);
			var oGetCursorElementStub = sinon.stub(CoordinateUtils, "getCursorElement").returns(oFirstShape);

			// trigger mouse enter event
			qutils.triggerEvent("mouseenter", oFirstShape.getId());

			assert.ok(oHandleShapeMouseEnter.notCalled, "Wait for the 500 millisecond enter delay");

			utils
				.timeoutSeries()
				.next(function () {
					assert.ok(oHandleShapeMouseEnter.notCalled, "Wait for the enter timeout");
				}, 400)
				.next(function () {
					assert.ok(oHandleShapeMouseEnter.calledOnce, "User has hovered on the first shape");
					qutils.triggerEvent("mouseout", oFirstShape.getId());
					assert.ok(oHandleShapeMouseLeave.notCalled, "Wait for the 500 millisecond leave delay");
				}, 100)
				.next(function () {
					assert.ok(oHandleShapeMouseLeave.notCalled, "Wait for the leave timeout");
				}, 400)
				.next(function () {
					assert.ok(oHandleShapeMouseLeave.calledOnce, "User has moved out of the first shape");
				}, 100)
				.run(callback);

			// teardown
			return function () {
				oHandleShapeMouseEnter.restore();
				oHandleShapeMouseLeave.restore();
				oGetCursorElementStub.restore();
			};
		};

		var testLeaveBeforeEnter = function (_result, callback) {
			var oHandleShapeMouseEnter = sinon.stub(this.sut, "handleShapeMouseEnter").returns(undefined);
			var oGetCursorElementStub = sinon.stub(CoordinateUtils, "getCursorElement").returns(oFirstShape);

			this.sut.setShapeMouseLeaveDelay(100);

			this.oHandler.onReady(function () {
				// trigger mouse enter event
				qutils.triggerEvent("mouseenter", oFirstShape.getId());

				utils
					.timeoutSeries()
					.next(function () {
						qutils.triggerEvent("mouseout", oFirstShape.getId());
					}, 100)
					.next(function () {
						assert.ok(oHandleShapeMouseEnter.notCalled, "Mouse enter event not fired");
					}, 400)
					.run(callback);
			});

			// teardown
			return function () {
				oHandleShapeMouseEnter.restore();
				oGetCursorElementStub.restore();
			};
		};

		var testLeaveWithoutEnter = function (_result, callback) {
			var oHandleShapeMouseLeave = sinon.stub(this.sut, "handleShapeMouseLeave").returns(undefined);

			// fire mouse out without mouse enter
			qutils.triggerEvent("mouseout", oFirstShape.getId());

			utils
				.timeoutSeries()
				.next(function () {
					assert.ok(oHandleShapeMouseLeave.notCalled, "Mouse leave event not fired");
				}, 500)
				.run(callback);

			// teardown
			return function () {
				oHandleShapeMouseLeave.restore();
			};
		};

		var testCustomSameDelay = function (_result, callback) {
			var oHandleShapeMouseEnter, oHandleShapeMouseLeave, oGetCursorElementStub;

			this.sut.setShapeMouseEnterDelay(100);
			this.sut.setShapeMouseLeaveDelay(100);

			this.oHandler.onReady(function () {
				oHandleShapeMouseEnter = sinon.stub(this.sut, "handleShapeMouseEnter").returns(undefined);
				oHandleShapeMouseLeave = sinon.stub(this.sut, "handleShapeMouseLeave").returns(undefined);
				oGetCursorElementStub = sinon.stub(CoordinateUtils, "getCursorElement").returns(oFirstShape);

				// trigger mouse enter event
				qutils.triggerEvent("mouseenter", oFirstShape.getId());

				assert.ok(oHandleShapeMouseEnter.notCalled, "Wait for the 100 millisecond delay");

				utils
					.timeoutSeries()
					.next(function () {
						assert.ok(oHandleShapeMouseEnter.notCalled, "Wait for the enter timeout");
					}, 50)
					.next(function () {
						assert.ok(oHandleShapeMouseEnter.calledOnce, "User has hovered on the first shape");
						qutils.triggerEvent("mouseout", oFirstShape.getId());
						assert.ok(oHandleShapeMouseLeave.notCalled, "Wait for the 100 millisecond leave delay");
					}, 50)
					.next(function () {
						assert.ok(oHandleShapeMouseLeave.notCalled, "Wait for the leave timeout");
					}, 50)
					.next(function () {
						assert.ok(oHandleShapeMouseLeave.calledOnce, "User has moved out of the first shape");
					}, 50)
					.run(callback);
			});

			// teardown
			return function () {
				oHandleShapeMouseEnter.restore();
				oHandleShapeMouseLeave.restore();
				oGetCursorElementStub.restore();
			};
		};

		var testCrossEventDelay = function (_result, callback) {
			var oHandleShapeMouseEnter, oHandleShapeMouseLeave, oGetCursorElementStub;

			this.sut.setShapeMouseEnterDelay(100);
			this.sut.setShapeMouseLeaveDelay(300);

			this.oHandler.onReady(function () {
				oHandleShapeMouseEnter = sinon.stub(this.sut, "handleShapeMouseEnter").returns(undefined);
				oHandleShapeMouseLeave = sinon.stub(this.sut, "handleShapeMouseLeave").returns(undefined);
				oGetCursorElementStub = sinon.stub(CoordinateUtils, "getCursorElement").returns(oFirstShape);
				// trigger mouse enter event
				qutils.triggerEvent("mouseenter", oFirstShape.getId());

				utils
					.timeoutSeries()
					.next(function () {
						assert.ok(oHandleShapeMouseEnter.calledOnce, "User has hovered on the first shape");
						qutils.triggerEvent("mouseout", oFirstShape.getId());
					}, 100)
					.next(function () {
						qutils.triggerEvent("mouseenter", oFirstShape.getId());
					}, 50)
					.next(function () {
						assert.ok(oHandleShapeMouseEnter.calledTwice, "User has hovered on the first shape again");
						qutils.triggerEvent("mouseout", oFirstShape.getId());
					}, 100)
					.next(function () {
						assert.ok(oHandleShapeMouseLeave.notCalled, "Wait for the second leave timeout");
					}, 200)
					.next(function () {
						assert.ok(oHandleShapeMouseLeave.calledOnce, "User has moved out of the first shape again");
					}, 100)
					.run(callback);
			});

			// teardown
			return function () {
				oHandleShapeMouseEnter.restore();
				oHandleShapeMouseLeave.restore();
				oGetCursorElementStub.restore();
			};
		};

		var testCrossEventDelayInOutIn = function (_result, callback) {
			var oHandleShapeMouseEnter, oHandleShapeMouseLeave, oGetCursorElementStub;
			this.sut.attachShapeMouseEnter(function (oEvent) {
				if (oEvent.getParameter("shape").isA('sap.gantt.simple.Relationship')){
					assert.deepEqual(oEvent.getParameter("isPinConnector"), (document.querySelector("[data-sap-gantt-shape-id='" + oEvent.mParameters.shape.getPredecessor() + "']") == null ||
						document.querySelector("[data-sap-gantt-shape-id='" + oEvent.mParameters.shape.getSuccessor() + "']") == null), "Connector type(Pin/Not) is correctly passed on ShapeMouseEnter event");
					if (oEvent.getParameter("isPinConnector")){
						assert.deepEqual(oEvent.getParameter("isPinConnector"),true, "This relationship is a Pin connector");
					} else {
						assert.deepEqual(oEvent.getParameter("isPinConnector"),false, "This relationship is a not a Pin connector");
					}
				}

			});
			var oRls = new Relationship({
				id:"Rln1",
				type: "FinishToStart",
				predecessor: "0",
				successor: "8"
			});
			this.sut.getTable().getRows()[0].getAggregation('_settings').addRelationship(oRls);
			var oRlnShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getRelationships()[0];
			oRlnShape.setHoverable(true);
			this.sut.setShapeMouseEnterDelay(500);
			this.sut.setShapeMouseLeaveDelay(500);

			this.oHandler.onReady(function () {
				oHandleShapeMouseEnter = sinon.stub(this.sut, "handleShapeMouseEnter").returns(undefined);
				oHandleShapeMouseLeave = sinon.stub(this.sut, "handleShapeMouseLeave").returns(undefined);
				oGetCursorElementStub = sinon.stub(CoordinateUtils, "getCursorElement").returns(oRlnShape);

				utils
					.timeoutSeries()
					.next(function () {
						qutils.triggerEvent("mouseenter", oRlnShape.getId());

					}, 100)
					.next(function () {
						qutils.triggerEvent("mouseout", oRlnShape.getId());

					}, 100).next(function () {
						qutils.triggerEvent("mouseenter", oRlnShape.getId());
					}, 200)
					.next(function () {
						assert.ok(oHandleShapeMouseEnter.calledOnce, "User has hovered on the Pin Relationship");
					}, 500).next(function () {
						qutils.triggerEvent("mouseout", oRlnShape.getId());
						oRlnShape.setSuccessor("1");
					}, 100).next(function () {
						qutils.triggerEvent("mouseenter", oRlnShape.getId());
					}, 200).next(function () {
						assert.ok(oHandleShapeMouseEnter.calledTwice, "User has hovered on the normal Relationship");
					}, 500)
					.run(callback);
			});

			// teardown
			return function () {
				oHandleShapeMouseEnter.restore();
				oHandleShapeMouseLeave.restore();
				oGetCursorElementStub.restore();
			};
		};

		this.oHandler.runSeries([
			setup,
			testDefault,
			testLeaveBeforeEnter,
			testLeaveWithoutEnter,
			testCustomSameDelay,
			testCrossEventDelay,
			testCrossEventDelayInOutIn
		], assert.async(), 100);
	});

	QUnit.test("Verify the animationSettings property", function (assert) {
		var oShape = new BaseShape();
		var mAnimationSettings = {
			"values": "#800;#f00;#800;#800",
			"duration": "2s",
			"repeatCount": "indefinite"
		};
		assert.strictEqual(oShape.getAnimationSettings(), null, "Default value for animationSettings is set");
		oShape.setAnimationSettings(mAnimationSettings);
		assert.deepEqual(oShape.getAnimationSettings(), mAnimationSettings, "Value of the animationSettings property is set");
	});

	QUnit.test("Verify the showAnimation property", function (assert) {
		var oShape = new BaseShape();
		assert.strictEqual(oShape.getShowAnimation(), false, "Default value for the showAnimation is false");
		oShape.setShowAnimation(true);
		assert.strictEqual(oShape.getShowAnimation(), true, "Value of the showAnimation property is true");
	});

	QUnit.test("Verify the default animationSettings properties", function (assert) {
		var oShape = new BaseShape();
		var mAnimationSettings = {
			"values": "#800;#f00;#800;#800"
		};
		oShape.setAnimationSettings(mAnimationSettings);
		assert.strictEqual(oShape.getAnimationSettings(), mAnimationSettings, "Value of the animationSettings property is set");
		oShape.setShowAnimation(true);
		assert.strictEqual(oShape.getShowAnimation(), true, "Value of the showAnimation property is true");
	});

	QUnit.test("Rerender on shape's setTime and setEndTime", function(assert){
		var done = assert.async();
		utils.waitForGanttRendered(this.sut).then(function () {
			var oShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			var oInvalidateSpy = sinon.spy(this.sut.getInnerGantt(), "invalidate");
			oShape.setTime(new Date());
			assert.equal(oInvalidateSpy.calledOnce, true, "Invalidate should be called on setTime");
			oShape.setEndTime(new Date());
			assert.equal(oInvalidateSpy.calledTwice, true, "Invalidate should be called on setEndTime");
			done();
		}.bind(this));
	});


});
