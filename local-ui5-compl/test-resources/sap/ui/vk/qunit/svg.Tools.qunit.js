/* global QUnit, sinon*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/svg/ViewStateManager",
	"sap/ui/vk/svg/Viewport",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/svg/Ellipse",
	"sap/ui/vk/svg/Path",
	"sap/ui/vk/svg/Text",
	"sap/ui/vk/tools/CreateRectangleTool",
	"sap/ui/vk/tools/CreateEllipseTool",
	"sap/ui/vk/tools/CreatePathTool",
	"sap/ui/vk/tools/CreateTextTool",
	"sap/ui/vk/tools/TransformSvgElementTool"
], function(
	nextUIUpdate,
	ViewStateManager,
	Viewport,
	Scene,
	Element,
	Rectangle,
	Ellipse,
	Path,
	Text,
	CreateRectangleTool,
	CreateEllipseTool,
	CreatePathTool,
	CreateTextTool,
	TransformSvgElementTool
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	var scene = new Scene();

	viewport._setScene(scene);
	viewStateManager._setScene(scene);

	QUnit.test("SVG Tools", async function(assert) {
		assert.ok(viewport instanceof Viewport, "The SVG viewport is created.");

		var maxDifference = 1e-6;
		function assertClose(actual, expected, message) {
			var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
			assert.push(passes, actual, expected, message);
		}

		function testArray(a, b, message) {
			a.forEach(function(v, i) {
				assertClose(v, b[i], message + ":" + i);
			});
		}

		viewport.getCamera()._zoomTo({ min: { x: 0, y: 0 }, max: { x: 300, y: 300 } }, 300, 300, 0);
		viewport.rerender();
		await nextUIUpdate();

		function event(x, y) {
			var rectangle = viewport.getDomRef().getBoundingClientRect();
			var offset = {
				x: rectangle.left + window.pageXOffset,
				y: rectangle.top + window.pageYOffset
			};
			return { x: x + offset.x, y: y + offset.y, buttons: 1 };
		}

		function rightClickEvent(x, y) {
			var payload = event(x, y);
			payload.buttons = 2;
			return payload;
		}

		function mouseWheelEvent(x, y) {
			var payload = event(x, y);
			delete payload.buttons;
			payload["scroll"] = 12;
			return payload;
		}

		var root = viewport.getScene().getRootElement();

		var createRectangleTool = new CreateRectangleTool({ parentNode: root });
		var createEllipseTool = new CreateEllipseTool({ parentNode: root });
		var createPathTool = new CreatePathTool({ parentNode: root });
		var createTextTool = new CreateTextTool({ parentNode: root });
		var transformSvgElementTool = new TransformSvgElementTool();
		viewport.addTool(createRectangleTool);
		viewport.addTool(createEllipseTool);
		viewport.addTool(createPathTool);
		viewport.addTool(createTextTool);
		viewport.addTool(transformSvgElementTool);

		var lineStyle = { colour: new Float32Array([0.1, 0.2, 0.3, 0.7]), width: 1.23 };
		var fillStyle = { colour: new Float32Array([0.4, 0.5, 0.6, 0.8]) };
		createRectangleTool.setMaterial(null, lineStyle, fillStyle);
		createEllipseTool.setMaterial(null, lineStyle, fillStyle);
		createPathTool.setMaterial(null, lineStyle, fillStyle);
		createTextTool.setMaterial(null, lineStyle, fillStyle);
		function testMaterial(element) {
			assert.deepEqual(element.stroke, lineStyle.colour, element.parent.name + " stroke");
			assert.strictEqual(element.strokeWidth, lineStyle.width, element.parent.name + " strokeWidth");
			assert.deepEqual(element.fill, fillStyle.colour, element.parent.name + " fill");
		}

		var rect, ellipse, path;

		var done1 = assert.async();

		var rectangleToolCompletedHandler = function(event) {
			rect = event.getParameter("node");
			assert.ok((rect instanceof Element) && (rect.children.length === 1) && (rect.children[0] instanceof Rectangle), "Rectangle created");
			assert.deepEqual(rect.matrix, new Float32Array([1, 0, 0, 1, 50, 100]), "Rectangle matrix");
			rect = rect.children[0];
			testMaterial(rect);
			assert.strictEqual(rect.width, 100, "Rectangle width");
			assert.strictEqual(rect.height, 50, "Rectangle height");
			done1();
		};

		var rectattachCompletedSpy = sinon.spy(rectangleToolCompletedHandler);
		createRectangleTool.attachCompleted(rectattachCompletedSpy);

		createRectangleTool.setActive(true, viewport);
		assert.equal(createRectangleTool.getActive(), true, "createRectangleTool is active");
		createRectangleTool._handler.beginGesture(event(50, 100));
		createRectangleTool._handler.move(event(150, 150));
		createRectangleTool._handler.endGesture(event(150, 150));
		assert.equal(createRectangleTool.getActive(), true, "createRectangleTool is still active");
		assert.ok(rectattachCompletedSpy.calledOnce, "Completed fired by createRectangleTool once");

		createRectangleTool.setActive(true, viewport);
		assert.equal(createRectangleTool.getActive(), true, "createRectangleTool is active");
		createRectangleTool._handler.beginGesture(rightClickEvent(50, 100));
		createRectangleTool._handler.move(event(150, 150));
		createRectangleTool._handler.endGesture(event(150, 150));
		assert.equal(createRectangleTool.getActive(), true, "createRectangleTool is active since gesture never started");
		createRectangleTool.setActive(false, viewport);
		assert.equal(createRectangleTool.getActive(), false, "createRectangleTool is not active");
		assert.ok(rectattachCompletedSpy.calledOnce, "Completed not fired by createRectangleTool again");

		createRectangleTool.setActive(true, viewport);
		assert.equal(createRectangleTool.getActive(), true, "createRectangleTool is active");
		createRectangleTool._handler.beginGesture(mouseWheelEvent(50, 100));
		createRectangleTool._handler.move(event(150, 150));
		createRectangleTool._handler.endGesture(event(150, 150));
		assert.equal(createRectangleTool.getActive(), true, "createRectangleTool is active since gesture never started");
		createRectangleTool.setActive(false, viewport);
		assert.equal(createRectangleTool.getActive(), false, "createRectangleTool is not active");
		assert.ok(rectattachCompletedSpy.calledOnce, "Completed not fired by createRectangleTool again");

		var done2 = assert.async();

		var ellipseToolCompletedHandler = function(event) {
			ellipse = event.getParameter("node");
			assert.ok((ellipse instanceof Element) && (ellipse.children.length === 1) && (ellipse.children[0] instanceof Ellipse), "Ellipse created");
			var f = Math.sqrt(0.5);
			assert.deepEqual(ellipse.matrix, new Float32Array([f, f, -f, f, 200, 150]), "Ellipse matrix");
			ellipse = ellipse.children[0];
			testMaterial(ellipse);
			assert.strictEqual(ellipse.rx, 100 * f, "Ellipse rx");
			assert.strictEqual(ellipse.ry, 50 * f, "Ellipse ry");
			done2();
		};
		var ellipseToolSpy = sinon.spy(ellipseToolCompletedHandler);
		createEllipseTool.attachCompleted(ellipseToolSpy);

		createEllipseTool.setActive(true, viewport);
		assert.equal(createEllipseTool.getActive(), true, "createEllipseTool is active");
		createEllipseTool._handler.beginGesture(event(150, 100));
		createEllipseTool._handler.move(event(250, 200));
		createEllipseTool._handler.endGesture(event(250, 200));
		assert.equal(createEllipseTool.getActive(), true, "createEllipseTool is still active");
		assert.ok(ellipseToolSpy.calledOnce, "Completed fired by createEllipseTool once");

		createEllipseTool.setActive(true, viewport);
		assert.equal(createEllipseTool.getActive(), true, "createEllipseTool is active");
		createEllipseTool._handler.beginGesture(rightClickEvent(150, 100));
		createEllipseTool._handler.move(event(250, 200));
		createEllipseTool._handler.endGesture(event(250, 200));
		assert.equal(createEllipseTool.getActive(), true, "createEllipseTool is still active since gesture never began");
		createEllipseTool.setActive(false, viewport);
		assert.equal(createEllipseTool.getActive(), false, "createEllipseTool is not active");
		assert.ok(ellipseToolSpy.calledOnce, "Completed fired by createEllipseTool once");

		createEllipseTool.setActive(true, viewport);
		assert.equal(createEllipseTool.getActive(), true, "createEllipseTool is active");
		createEllipseTool._handler.beginGesture(mouseWheelEvent(150, 100));
		createEllipseTool._handler.move(event(250, 200));
		createEllipseTool._handler.endGesture(event(250, 200));
		assert.equal(createEllipseTool.getActive(), true, "createEllipseTool is still active since gesture never began");
		createEllipseTool.setActive(false, viewport);
		assert.equal(createEllipseTool.getActive(), false, "createEllipseTool is not active");
		assert.ok(ellipseToolSpy.calledOnce, "Completed fired by createEllipseTool once");

		var done3 = assert.async();
		createPathTool.attachCompleted(function(event) {
			path = event.getParameter("node");
			assert.ok((path instanceof Element) && (path.children.length === 1) && (path.children[0] instanceof Path), "Path created");
			assert.deepEqual(path.matrix, new Float32Array([1, 0, 0, 1, 0, 0]), "Path matrix");
			path = path.children[0];
			testMaterial(path);
			var segments = path.segments;
			assert.strictEqual(segments.length, 2, "number of path segments");
			assert.strictEqual(segments[0].type, "move", "segment[0].type");
			assert.deepEqual(segments[0].points, [50, 50, 100, 30, 150, 30, 200, 50, 50, 150, 200, 150], "segment[0].points");
			assert.strictEqual(segments[1].type, "close", "segment[1].type");
			done3();
		});

		createPathTool.setActive(true, viewport);
		assert.equal(createPathTool.getActive(), true, "createPathTool is active");
		createPathTool._handler.beginGesture(event(50, 50));
		createPathTool._handler.move(event(100, 30));
		createPathTool._handler.move(event(101, 29));
		createPathTool._handler.move(event(150, 30));
		createPathTool._handler.move(event(149, 31));
		createPathTool._handler.endGesture(event(151, 69));
		createPathTool._handler.beginGesture(event(200, 50));
		createPathTool._handler.endGesture(event(200, 50));
		createPathTool._handler.beginGesture(event(50, 150));
		createPathTool._handler.endGesture(event(50, 150));
		createPathTool._handler.beginGesture(event(200, 150));
		createPathTool._handler.endGesture(event(200, 150));
		createPathTool._handler.beginGesture(event(49, 51));
		assert.equal(createPathTool.getActive(), true, "createPathTool is still active");

		var moving, moved, rotating, rotated, scaling, scaled;

		function getParameters(event) {
			var params = Object.assign({}, event.getParameters());
			if (params.nodesProperties) {
				params.nodesProperties = params.nodesProperties.map(function(nodesProperty) {
					nodesProperty = Object.assign({}, nodesProperty);
					nodesProperty.node = nodesProperty.node && nodesProperty.node.uid;
					return nodesProperty;
				});
			}
			return params;
		}

		transformSvgElementTool.attachMoving(function(event) { moving = getParameters(event); });
		transformSvgElementTool.attachMoved(function(event) { moved = getParameters(event); });
		transformSvgElementTool.attachRotating(function(event) { rotating = getParameters(event); });
		transformSvgElementTool.attachRotated(function(event) { rotated = getParameters(event); });
		transformSvgElementTool.attachScaling(function(event) { scaling = getParameters(event); });
		transformSvgElementTool.attachScaled(function(event) { scaled = getParameters(event); });
		transformSvgElementTool.setActive(true, viewport);
		rect = rect.parent; // rect(50, 100, 150, 150)
		viewStateManager.setSelectionStates([rect], [], false);

		transformSvgElementTool._handler.beginGesture(mouseWheelEvent(100, 125));
		assert.equal(transformSvgElementTool._handler._handle, null);
		transformSvgElementTool._handler.move(mouseWheelEvent(100, 125));
		assert.equal(transformSvgElementTool._handler._handle, null);

		transformSvgElementTool._handler.beginGesture(event(100, 125));

		transformSvgElementTool._handler.move(event(60, 105));
		assert.ok(moving && !moved && !rotating && !rotated && !scaling && !scaled, "Rectangle moving1");
		assert.equal(moving.x, -40, "moving.x");
		assert.equal(moving.y, -20, "moving.y");
		assert.deepEqual(moving.nodesProperties, [{ x: -40, y: -20, node: rect.uid }], "moving.nodesProperties");
		assert.deepEqual(rect.matrix, new Float32Array([1, 0, 0, 1, 10, 80]), "rect.matrix");
		moving = null;

		transformSvgElementTool._handler.move(event(50, 75));
		assert.ok(moving && !moved && !rotating && !rotated && !scaling && !scaled, "Rectangle moving2");
		assert.equal(moving.x, -50, "moving.x");
		assert.equal(moving.y, -50, "moving.y");
		assert.deepEqual(moving.nodesProperties, [{ x: -50, y: -50, node: rect.uid }], "moving.nodesProperties");
		moving = null;

		transformSvgElementTool._handler.endGesture(event(50, 75));
		assert.ok(!moving && moved && !rotating && !rotated && !scaling && !scaled, "Rectangle moved");
		assert.equal(moved.x, -50, "moved.x");
		assert.equal(moved.y, -50, "moved.y");
		assert.deepEqual(moved.nodesProperties, [{ x: -50, y: -50, node: rect.uid }], "moved.nodesProperties");
		moved = null;

		assert.deepEqual(rect.matrix, new Float32Array([1, 0, 0, 1, 0, 50]), "rect.matrix"); // rect(0, 50, 100, 100)

		transformSvgElementTool._handler.beginGesture(event(105, 95));

		transformSvgElementTool._handler.move(event(155, 95));
		assert.ok(!moving && !moved && !rotating && !rotated && scaling && !scaled, "Rectangle scaling");
		assert.equal(scaling.x, 1.5, "scaling.x");
		assert.equal(scaling.y, 1, "scaling.y");
		assert.deepEqual(scaling.nodesProperties, [{ x: 1.5, y: 1, node: rect.uid }], "scaling.nodesProperties");
		scaling = null;

		transformSvgElementTool._handler.move(event(155, 145));
		assert.ok(!moving && !moved && !rotating && !rotated && scaling && !scaled, "Rectangle scaling");
		assert.equal(scaling.x, 1.5, "scaling.x");
		assert.equal(scaling.y, 2, "scaling.y");
		assert.deepEqual(scaling.nodesProperties, [{ x: 1.5, y: 2, node: rect.uid }], "scaling.nodesProperties");
		scaling = null;

		transformSvgElementTool._handler.endGesture(event(155, 145));
		assert.ok(!moving && !moved && !rotating && !rotated && !scaling && scaled, "Rectangle scaled");
		assert.equal(scaled.x, 1.5, "scaled.x");
		assert.equal(scaled.y, 2, "scaled.y");
		assert.deepEqual(scaled.nodesProperties, [{ x: 1.5, y: 2, node: rect.uid }], "scaled.nodesProperties");
		scaled = null;

		assert.deepEqual(rect.matrix, new Float32Array([1.5, 0, 0, 2, 0, 50]), "rect.matrix"); // rect(0, 50, 150, 150)

		transformSvgElementTool._handler.beginGesture(event(5, 95));

		transformSvgElementTool._handler.move(event(55, 195));
		assert.ok(!moving && !moved && !rotating && !rotated && scaling && !scaled, "Rectangle scaling");
		assertClose(scaling.x, 2 / 3, "scaling.x");
		assert.equal(scaling.y, 1, "scaling.y");
		assert.deepEqual(scaling.nodesProperties, [{ x: 1, y: 2, node: rect.uid }], "scaling.nodesProperties");
		scaling = null;

		transformSvgElementTool._handler.endGesture(event(80, 195));
		assert.ok(!moving && !moved && !rotating && !rotated && !scaling && scaled, "Rectangle scaled");
		assertClose(scaled.x, 2 / 3, "scaled.x");
		assert.equal(scaled.y, 1, "scaled.y");
		assert.deepEqual(scaled.nodesProperties, [{ x: 1, y: 2, node: rect.uid }], "scaled.nodesProperties");
		scaled = null;

		assert.deepEqual(rect.matrix, new Float32Array([1, 0, 0, 2, 50, 50]), "rect.matrix"); // rect(50, 50, 150, 150)

		transformSvgElementTool._handler.beginGesture(event(100, 2));

		transformSvgElementTool._handler.move(event(200, 100));
		assert.ok(!moving && !moved && rotating && !rotated && !scaling && !scaled, "Rectangle rotating");
		assertClose(rotating.angle, -Math.PI / 2, "rotating.angle");
		assert.deepEqual(rotating.nodesProperties, [{ angle: -Math.PI / 2, node: rect.uid }], "rotating.nodesProperties");
		rotating = null;

		transformSvgElementTool._handler.endGesture(event(200, 100));
		assert.ok(!moving && !moved && !rotating && rotated && !scaling && !scaled, "Rectangle rotated");
		assertClose(rotated.angle, -Math.PI / 2, "rotated.angle");
		assert.deepEqual(rotated.nodesProperties, [{ angle: -Math.PI / 2, node: rect.uid }], "rotated.nodesProperties");
		rotated = null;

		testArray(rect.matrix, [0, 1, -2, 0, 150, 50], "rect.matrix");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
