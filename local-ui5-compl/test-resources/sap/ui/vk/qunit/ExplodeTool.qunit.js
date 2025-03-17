/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/tools/ExplodeTool",
	"sap/ui/vk/tools/ExplodeAxis",
	"sap/ui/vk/tools/ExplodeDirection",
	"sap/ui/vk/tools/ExplodeItemGroup",
	"sap/ui/vk/tools/ExplodeType",
	"sap/ui/vk/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/TransformationMatrix"
], function(
	nextUIUpdate,
	Viewport,
	ViewStateManager,
	ExplodeTool,
	ExplodeAxis,
	ExplodeDirection,
	ExplodeItemGroup,
	ExplodeType,
	THREE,
	loader,
	TransformationMatrix
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager;
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	QUnit.moduleWithContentConnector("ExplodeTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("ExplodeTool", function(assert) {
		var tool = new ExplodeTool();
		assert.ok(tool !== null, "Tool created");

		tool.setActive(true, viewport);

		assert.strictEqual(tool.getType(), ExplodeType.Linear, "default type");
		assert.strictEqual(tool.getAxis(), undefined, "default axis");
		assert.strictEqual(tool.getDirection(), undefined, "default direction");
		assert.strictEqual(tool.getMagnitude(), 0, "default magnitude");

		var eventId, moveUp, magnitudeAdjustmentMultiplier;
		function eventHandler(event) {
			eventId = event.getId();
			var params = event.getParameters();
			switch (eventId) {
				case "axisSelected":
					assert.strictEqual(params.axis, tool.getAxis(), "event.axis");
					assert.strictEqual(params.direction, tool.getDirection(), "event.direction");
					break;
				case "magnitudeChanging":
				case "magnitudeChanged":
					assert.strictEqual(params.type, tool.getType(), "event.type");
					assert.strictEqual(params.axis, tool.getAxis(), "event.axis");
					assert.strictEqual(params.direction, tool.getDirection(), "event.direction");
					assert.strictEqual(params.magnitude, tool.getMagnitude(), "event.magnitude");
					break;
				case "itemSequenceChangePressed":
					assert.strictEqual(params.item && params.item.getId(), tool.getSelectedItem(), "event.item");
					moveUp = params.moveUp;
					assert.notEqual(params.moveUp, undefined, "event.moveUp exists");
					break;
				case "itemPositionAdjusting":
				case "itemPositionAdjusted":
					assert.strictEqual(params.item && params.item.getId(), tool.getSelectedItem(), "event.item");
					assert.notEqual(params.magnitudeAdjustmentMultiplier, undefined, "event.magnitudeAdjustmentMultiplier exists");
					magnitudeAdjustmentMultiplier = params.magnitudeAdjustmentMultiplier;
					break;
				default:
					assert.ok(false, "unexpected event fired: " + eventId);
					break;
			}
		}
		["axisSelected", "magnitudeChanging", "magnitudeChanged", "itemSequenceChangePressed", "itemPositionAdjusting", "itemPositionAdjusted"].forEach(function(eventName) {
			tool.attachEvent(eventName, eventHandler);
		});

		var scene = viewport.getScene();
		var nodeHierarchy = scene.getDefaultNodeHierarchy();
		var root = scene.getSceneRef();

		var names = ["Torus1", "Cylinder", "Box", "Sphere", "Cone", "Dodecahedron"];
		var items = names.map(function(name) {
			var node = root.getObjectByName(name);
			assert.ok(node, name + " found");
			return node;
		});
		var pos = items.map(function(node) { return node.position.clone(); });

		var g1 = new ExplodeItemGroup();
		var g2 = new ExplodeItemGroup();
		var g3 = new ExplodeItemGroup();
		var restOffset = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
		tool.addItem(g1).addItem(g2).addItem(g3);

		g1.addItem(nodeHierarchy.createNodeProxy(items[0]));
		g1.addItem(nodeHierarchy.createNodeProxy(items[1]));
		g2.addItem(nodeHierarchy.createNodeProxy(items[2]));
		g2.addItem(nodeHierarchy.createNodeProxy(items[3]));
		g3.addItem(nodeHierarchy.createNodeProxy(items[4]));
		g3.addItem(nodeHierarchy.createNodeProxy(items[5]));

		var initialJson = tool.generateRequestData({});

		var gizmo = tool.getGizmo();
		eventId = undefined;
		gizmo.highlightHandle(3); // negative x
		gizmo._beginGesture();
		assert.strictEqual(eventId, "axisSelected", "axisSelected event fired");
		assert.strictEqual(tool.getAxis(), ExplodeAxis.X, "X axis");
		assert.strictEqual(tool.getDirection(), ExplodeDirection.Negative, "-X axis");

		tool.setAxis(ExplodeAxis.Z);
		assert.strictEqual(tool.getAxis(), ExplodeAxis.Z, "Z axis");
		tool.setDirection(ExplodeDirection.Positive);
		assert.strictEqual(tool.getDirection(), ExplodeDirection.Positive, "+Z axis");

		assert.strictEqual(tool.getSelectedItem(), null, "no default selected item");

		function event(x, y) {
			var rectangle = viewport.getDomRef().getBoundingClientRect();
			var offset = {
				x: rectangle.left + window.pageXOffset,
				y: rectangle.top + window.pageYOffset
			};
			return { x: x + offset.x, y: y + offset.y, buttons: 1 };
		}

		tool._handler.click(event(40, 95));
		assert.strictEqual(tool.getSelectedItem(), g1.sId, "Torus1 clicked, group 1 selected");

		tool._handler.click(event(150, 200));
		assert.strictEqual(tool.getSelectedItem(), g2.sId, "Sphere clicked, group 2 selected");

		tool._handler.click(event(290, 100));
		assert.strictEqual(tool.getSelectedItem(), g3.sId, "Cone clicked, group 3 selected");

		var maxDifference = 1e-2;
		function assertClose(actual, expected, message) {
			var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
			assert.pushResult({ result: passes, actual: actual, expected: expected, message: message + " (" + actual + " ~ " + expected + ")" });
		}

		function testArray(a, b, message) {
			a.forEach(function(v, i) {
				assertClose(v, b[i], message + "[" + i + "]");
			});
		}

		function testOffsets(offsets, testIndex) {
			items.forEach(function(item, index) {
				testArray(item.position.clone().sub(pos[index]).toArray(), offsets[index >> 1], testIndex + ": " + names[index] + ".offset");
			});
		}

		function testRadialOffsets(offsets, testIndex) {
			items.forEach(function(item, index) {
				testArray(item.position.clone().sub(pos[index]).toArray(), offsets[index], testIndex + ": " + names[index] + ".offset");
			});
		}

		function testNodePositions(view, nodesOriginal, offsets, testIndex) {
			var nodes = view.nodes;
			nodes.forEach(function(node, index) {
				var origin = nodesOriginal[index].transform.length === 16 ? nodesOriginal[index].transform : TransformationMatrix.convertTo4x4(nodesOriginal[index].transform);
				var nodeTransform = node.transform.length === 16 ? node.transform : TransformationMatrix.convertTo4x4(node.transform);
				var offset = [nodeTransform[12] - origin[12], nodeTransform[13] - origin[13], nodeTransform[14] - origin[14]];

				testArray(offset, offsets[index >> 1], testIndex + ": " + names[index] + ".transform");
			});
		}

		function testGeneratedOffsetsStatic(offsets, testIndex) {
			var json = tool.generateRequestData({});
			testNodePositions(json.data.views[0], initialJson.data.views[0].nodes, offsets, testIndex);
			// Clean up
			var views = scene.getViews();
			scene.removeView(views[views.length - 1]);
		}

		function testGeneratedOffsetsAnimation(offsets, testIndex) {
			var json = tool.generateRequestData({ animation: { enabled: true } });
			testNodePositions(json.data.views[0], initialJson.data.views[0].nodes, restOffset, testIndex);
			var nodes = json.data.animation.sequences[0].nodes;
			var tracks = json.data.animation.tracks;
			nodes.forEach(function(node, index) {
				var trackData = tracks[node.rtranslate.track].vector3;
				// Second key has final position
				var offset = [trackData[3], trackData[4], trackData[5]];
				testArray(offset, offsets[index], testIndex + " (Animated): RefNode(" + index + "), " + names[index] + ".transform");
			});
			// Clean up
			var views = scene.getViews();
			scene.removeView(views[views.length - 1]);
		}

		function testGeneratedOffsetsAnimationMultipleSequences(offsets, testIndex) {
			var json = tool.generateRequestData({ animation: { enabled: true, separateAnimations: true } });
			testNodePositions(json.data.views[0], initialJson.data.views[0].nodes, restOffset, testIndex);
			var tracks = json.data.animation.tracks;
			json.data.views[0].playbacks.forEach(function(playback) {
				var sequence = json.data.animation.sequences[playback.sequence];
				var nodes = sequence.nodes;
				nodes.forEach(function(node, index) {
					var trackData = tracks[node.rtranslate.track].vector3;
					// Second key has final position
					var offset = [trackData[3], trackData[4], trackData[5]];
					testArray(offset, offsets[playback.sequence], testIndex + " (Multi-Sequence): RefNode(" + index + "), " + names[index] + ".transform, track: " + JSON.stringify({ tracks: tracks }));
				});
			});
			// Clean up
			var views = scene.getViews();
			scene.removeView(views[views.length - 1]);
		}

		function testGeneratedOffsetsAnimationMultipleViews(offsets, testIndex) {
			var json = tool.generateRequestData({ animation: { enabled: true, separateAnimations: true, separateViews: true } });
			var tracks = json.data.animation.tracks;
			var initialNodes = initialJson.data.views[0].nodes;
			json.data.views.forEach(function(view, viewId) {
				var positions = offsets.slice(0, viewId).concat(restOffset.slice(viewId, restOffset.length));
				testNodePositions(view, initialNodes, positions, testIndex);
				var sequence = json.data.animation.sequences[view.playbacks[0].sequence];
				var nodes = sequence.nodes;
				nodes.forEach(function(node, index) {
					var trackData = tracks[node.rtranslate.track].vector3;
					// Second key has final position, only test moved nodes in current view
					if (trackData.length > 3) {
						var offset = [trackData[3], trackData[4], trackData[5]];
						testArray(offset, offsets[viewId], testIndex + " (Multi-View): View(" + viewId + "), RefNode(" + index + "), " + names[index] + ".transform");
					}
				});
			});
			// Clean up
			var views = scene.getViews();
			for (var i = 0; i < json.data.views.length; i++) {
				scene.removeView(views[views.length - 1]);
			}
		}

		function testOffsetsAll(offsets, index) {
			var magnitude = tool.getMagnitude();
			testOffsets(offsets, index);
			testGeneratedOffsetsStatic(offsets, index);
			testGeneratedOffsetsAnimation(offsets, index);
			tool.setMagnitude(magnitude);
			testGeneratedOffsetsAnimationMultipleSequences(offsets, index);
			tool.setMagnitude(magnitude);
			testGeneratedOffsetsAnimationMultipleViews(offsets, index);
		}

		testOffsetsAll(restOffset, 0);

		tool.setMagnitude(100);

		testOffsetsAll([[0, 0, 100], [0, 0, 67.5], [0, 0, 33.2]], 1);

		tool.reset();
		assert.strictEqual(tool.getType(), ExplodeType.Linear, "default type");
		assert.strictEqual(tool.getAxis(), undefined, "default axis");
		assert.strictEqual(tool.getDirection(), undefined, "default direction");
		assert.strictEqual(tool.getMagnitude(), 0, "default magnitude");

		testOffsetsAll(restOffset, 2);

		tool.setAxis(ExplodeAxis.Z);
		tool.setMagnitude(100);
		tool.setDirection(ExplodeDirection.Negative);
		assert.strictEqual(tool.getDirection(), ExplodeDirection.Negative, "-Z axis");

		testOffsetsAll([[0, 0, -100], [0, 0, -67.5], [0, 0, -33.2]], 3);

		tool.setType(ExplodeType.Radial);
		assert.strictEqual(tool.getType(), ExplodeType.Radial, "Radial explode type");
		testRadialOffsets([[-92.85, 37.14, 0], [-92.84, -37.14, 0], [0, 66.66, 0], [-0.16, -66.66, 0], [30.95, 12.38, 0], [30.95, -12.38, 0]], 4);

		tool.setType(ExplodeType.Linear);
		assert.strictEqual(tool.getType(), ExplodeType.Linear, "Linear explode type");
		testOffsetsAll([[0, 0, -100], [0, 0, -67.5], [0, 0, -33.2]], 5);

		tool.setAxis(ExplodeAxis.X);
		assert.strictEqual(tool.getAxis(), ExplodeAxis.X, "-X axis");

		testOffsetsAll([[-100, 0, 0], [-59.12, 0, 0], [-20.83, 0, 0]], 6);

		gizmo.highlightHandle(3);
		gizmo._beginGesture();
		eventId = undefined;
		gizmo._setOffset(-50);
		assert.strictEqual(eventId, "magnitudeChanging", "magnitudeChanging event fired");
		assert.strictEqual(tool.getMagnitude(), 50, "event.magnitude = 50"); // 100 - 50 = 50
		eventId = undefined;
		gizmo._endGesture();
		assert.strictEqual(eventId, "magnitudeChanged", "magnitudeChanged event fired");
		assert.strictEqual(tool.getMagnitude(), 50, "event.magnitude = 50"); // 100 - 50 = 50
		// tool.setMagnitude(50);

		testOffsetsAll([[-50, 0, 0], [-29.56, 0, 0], [-10.415, 0, 0]], 7);

		tool.setSelectedItem(g2);

		eventId = undefined;
		magnitudeAdjustmentMultiplier = undefined;
		gizmo._setMagnitudeAdjustmentMultiplier(1);
		assert.strictEqual(eventId, "itemPositionAdjusting", "itemPositionAdjusting event fired");
		assert.strictEqual(magnitudeAdjustmentMultiplier, 1, "event.magnitudeAdjustmentMultiplier = +1");

		testOffsetsAll([[-50, 0, 0], [-43.5, 0, 0], [-10.415, 0, 0]], 8);

		eventId = undefined;
		magnitudeAdjustmentMultiplier = undefined;
		gizmo._setMagnitudeAdjustmentMultiplier(-1);
		assert.strictEqual(eventId, "itemPositionAdjusting", "itemPositionAdjusting event fired");
		assert.strictEqual(magnitudeAdjustmentMultiplier, -1, "event.magnitudeAdjustmentMultiplier = -1");

		testOffsetsAll([[-50, 0, 0], [-15.62, 0, 0], [-10.415, 0, 0]], 9);

		eventId = undefined;
		magnitudeAdjustmentMultiplier = undefined;
		gizmo._setMagnitudeAdjustmentMultiplier(0, true);
		assert.strictEqual(eventId, "itemPositionAdjusted", "itemPositionAdjusted event fired");
		assert.strictEqual(magnitudeAdjustmentMultiplier, 0, "event.magnitudeAdjustmentMultiplier = 0");

		testOffsetsAll([[-50, 0, 0], [-29.56, 0, 0], [-10.415, 0, 0]], 10);

		tool.setSelectedItem(g1);
		eventId = undefined;
		moveUp = undefined;
		gizmo._moveSelectedGroup(+2);
		assert.strictEqual(eventId, "itemSequenceChangePressed", "itemSequenceChangePressed event fired");
		assert.strictEqual(moveUp, false, "event.moveUp");

		assert.strictEqual(tool.getItems()[0], g2, "group 2 order changed");
		assert.strictEqual(tool.getItems()[1], g3, "group 3 order changed");
		assert.strictEqual(tool.getItems()[2], g1, "group 1 order changed");

		testOffsets([[-14.83, 0, 0], [-50, 0, 0], [-28.18, 0, 0]], 11);

		tool.setAxis(undefined);
		assert.strictEqual(tool.getAxis(), undefined, "undefined axis");

		testOffsets([[0, 0, 0], [0, 0, 0], [0, 0, 0]], 12);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
