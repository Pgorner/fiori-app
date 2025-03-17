/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/svg/ViewStateManager",
	"sap/ui/vk/svg/Viewport",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/NodeContentType",
	"sap/ui/vk/VisibilityMode",
	"sap/ui/vk/ZoomTo"
], function(
	nextUIUpdate,
	ViewStateManager,
	Viewport,
	Scene,
	Element,
	Rectangle,
	NodeContentType,
	VisibilityMode,
	ZoomTo
) {
	"use strict";

	QUnit.module('sap.ui.vk.svg.Viewport', {
		beforeEach: function() {
			var rectIndex = 0;
			function createElementsRecursive(parent, array, level) {
				array.forEach(function(element) {
					if (Array.isArray(element)) {
						var g = new Element();
						g.sid = g.name = "G" + level + parent.children.length;
						parent.add(g);
						createElementsRecursive(g, element, level + 1);
					} else {
						var r = new Rectangle({
							fillStyle: {
								veid: rectIndex % 3,
								colour: ["#f00", "#0f0", "#00f"][rectIndex % 3]
							},
							lineStyle: {
								veid: rectIndex % 3 + 3,
								colour: ["#ff0", "#fff", "#0ff"][rectIndex % 3]
							}
						});
						r.sid = r.name = element;
						r.x = (rectIndex % 3) * 100 + 0.5;
						r.y = Math.floor(rectIndex / 3) * 100 + 0.5;
						r.width = 99;
						r.height = 99;
						rectIndex++;
						parent.add(r);
					}
				});
			}

			var viewStateManager = new ViewStateManager();
			var viewport = this.viewport = new Viewport({ viewStateManager: viewStateManager });
			viewport.placeAt("content");
			nextUIUpdate.runSync();

			var scene = this.scene = new Scene();
			createElementsRecursive(scene.getRootElement(), [["A", "B", "C"], ["D", ["E", "F", "G"], "H"]], 0, 0);

			viewport._setScene(scene);
			viewStateManager._setScene(scene);

			// set node fake veid
			var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy();
			var allNodeRefs = nodeHierarchy.findNodesByName();
			allNodeRefs.forEach(function(node) {
				node.userData.treeNode = { sid: node.uid };
			});

			viewport.invalidate();
			nextUIUpdate.runSync();
		},
		afterEach: function() {
			this.viewport.getParent().removeContent(this.viewport);
		}
	})

	QUnit.test("SVG Viewport", function(assert) {
		const viewport = this.viewport;
		const scene = this.scene;
		assert.ok(viewport, "The viewport is created.");
		assert.ok(viewport instanceof Viewport, "The viewport is sap.ui.vk.svg.Viewport implementation.");

		assert.notEqual(viewport.getDomRef(), null, "Viewport rendered");
		assert.strictEqual(viewport._styles.size, 6, "Viewport has 6 CSS styles");

		var names = ["A", "B", "C", "D", "E", "F", "G", "H"];
		var root = scene.getRootElement();
		var nodes = names.map(function(name) {
			var node = root.getElementByProperty("name", name);
			assert.ok(node, name + " found");
			return node;
		});

		var fillStyles = [], lineStyles = [];
		nodes.forEach(function(node, index) {
			if (index < 3) {
				assert.ok(node._fillStyleId, names[index] + " has CSS fill style");
				fillStyles.push(node._fillStyleId);
				assert.ok(node._lineStyleId, names[index] + " has CSS line style");
				lineStyles.push(node._lineStyleId);
			} else {
				assert.strictEqual(node._fillStyleId, fillStyles[index % 3], names[index] + " has correct CSS fill style");
				assert.strictEqual(node._lineStyleId, lineStyles[index % 3], names[index] + " has correct CSS line style");
			}
			assert.ok(node.hasClass(node._fillStyleId), names[index] + " has fill style class");
			assert.ok(node.hasClass(node._lineStyleId), names[index] + " has line style class");
		});

		// No query provided (shall return camera info only)
		var viewInfo = viewport.getViewInfo();
		assert.ok(!!viewInfo.camera, "No query - Camera retrieved");
		assert.strictEqual(viewInfo.visibility, undefined, "No query - No visibility information");
		assert.strictEqual(viewInfo.selection, undefined, "No query - No selection information");

		// Query with no camera required
		viewInfo = viewport.getViewInfo({ camera: false });
		assert.strictEqual(viewInfo.camera, undefined, "Camera info shall not be retrieved");

		// Simple visibility query without camera specified (shall still return camera info)
		viewInfo = viewport.getViewInfo({ visibility: true, selection: false });
		assert.ok(!!viewInfo.camera, "No camera query - Camera still retrieved");
		assert.ok(!!viewInfo.visibility, "Visibility required - Visibility information retrieved");
		assert.strictEqual(viewInfo.visibility.visible.length, 11, "Visibility required - Correct number of visible nodes");
		assert.strictEqual(viewInfo.visibility.hidden.length, 0, "Visibility required - Correct number of hidden nodes");
		assert.strictEqual(viewInfo.selection, undefined, "Selection not required -  No selection information");

		// Visibility query requiring differences but diff tracking is not set
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.ok(!!viewInfo.visibility, "Visibility diff required - Visibility object retrieved");
		assert.strictEqual(viewInfo.visibility.changes, undefined, "Visibility diff required - Tracking not set");

		// Visibility query requiring differences with diff tracking set
		var viewStateManager = viewport._viewStateManager;
		viewStateManager.setShouldTrackVisibilityChanges(true);
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.ok(!!viewInfo.visibility, "Visibility diff required - Visibility object retrieved");
		assert.ok(!!viewInfo.visibility.changes, "Visibility diff required - Tracking set");

		// Simple selection query
		viewInfo = viewport.getViewInfo({ selection: true });
		assert.ok(!!viewInfo.selection, "Selection required - Selection information retrieved");
		assert.strictEqual(viewInfo.selection.selected.length, 0, "Selection required - No selected nodes");

		var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy(),
			allNodeRefs = nodeHierarchy.findNodesByName(),
			nodeRefToVEID = new Map(),
			veidToNodeRef = new Map(),
			nodeRefs = [],
			nodes = [];
		allNodeRefs.forEach(function(node) {
			nodeRefs.push(node);
			nodes.push(node.sid);
			nodeRefToVEID.set(node, node.sid);
			veidToNodeRef.set(node.sid, node);
		});

		var cameraTests = [
			{ camera: { viewBox: [0, 0, 250, 250] } },
			{ camera: { viewBox: [50, 0, 200, 200] } },
			{ camera: { viewBox: [0, 50, 150, 150] } },
			{ camera: { viewBox: [100, 100, 100, 100] } }
		];

		var maxDifference = 1e-3;
		function assertClose(assert, actual, expected, message) {
			var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
			assert.pushResult({ result: passes, actual: actual, expected: expected, message: message + " (" + actual + " ~ " + expected + ")" });
		}

		function compareViewBox(viewBox, expectedViewBox, message) {
			assertClose(assert, viewBox[0], expectedViewBox[0], message + " viewBox.x");
			assertClose(assert, viewBox[1], expectedViewBox[1], message + " viewBox.y");
			assertClose(assert, viewBox[2], expectedViewBox[2], message + " viewBox.width");
			assertClose(assert, viewBox[3], expectedViewBox[3], message + " viewBox.height");
		}

		cameraTests.forEach(function(test, i) {
			viewport.setViewInfo(test, 0);
			compareViewBox(viewport._getViewBox(), test.camera.viewBox, "setViewInfo " + i);
		});

		var camera = viewport.getCamera();
		camera.setUpDirection([0, -1, 0]);
		function testCameraPos(epos, ezf, evb, message) {
			var pos = camera.getPosition();
			var zoomFactor = camera.getZoomFactor();
			assertClose(assert, pos[0], epos[0], message + " camera.position.x");
			assertClose(assert, pos[1], epos[1], message + " camera.position.y");
			assertClose(assert, zoomFactor, ezf, message + " camera.zoomFactor");
			compareViewBox(camera._getViewBox(), evb, message);
		}

		var curViewBox = cameraTests[3].camera.viewBox;
		var curPosition = [curViewBox[0] + curViewBox[2] * 0.5, curViewBox[1] + curViewBox[3] * 0.5];
		var curZoomFactor = 2 / curViewBox[2];
		testCameraPos(curPosition, curZoomFactor, curViewBox, "1");

		function getViewBox(position, zoomFactor, sx, sy) {
			return [position[0] - sx / zoomFactor, position[1] - sy / zoomFactor, sx * 2 / zoomFactor, sy * 2 / zoomFactor];
		}

		var testPosition = [250, 200];
		var testZoomFactor = 0.02;
		var testViewBox = getViewBox(testPosition, testZoomFactor, 1, 1);
		// 1 - set position, 2 - set zoomFactor
		camera.setPosition(testPosition);
		camera.setZoomFactor(testZoomFactor);
		testCameraPos(testPosition, testZoomFactor, testViewBox, "2");

		assert.equal(camera._width, 300, "camera.width");
		assert.equal(camera._height, 300, "camera.height");

		camera.update(250, 200);
		assert.equal(camera._width, 250, "camera.width");
		assert.equal(camera._height, 200, "camera.height");
		testCameraPos(testPosition, testZoomFactor, getViewBox(testPosition, testZoomFactor, 1.25, 1), "3");

		camera.update(200, 250);
		assert.equal(camera._width, 200, "camera.width");
		assert.equal(camera._height, 250, "camera.height");
		testCameraPos(testPosition, testZoomFactor, getViewBox(testPosition, testZoomFactor, 1, 1.25), "4");

		camera.setPosition(curPosition);
		camera.setZoomFactor(curZoomFactor);
		testCameraPos(curPosition, curZoomFactor, getViewBox(curPosition, curZoomFactor, 1, 1.25), "5");

		camera.update(300, 300);
		assert.equal(camera._width, 300, "camera.width");
		assert.equal(camera._height, 300, "camera.height");
		testCameraPos(curPosition, curZoomFactor, curViewBox, "6");

		// 1 - set zoomFactor, 2 - set position
		camera.setZoomFactor(testZoomFactor);
		camera.setPosition(testPosition);
		testCameraPos(testPosition, testZoomFactor, testViewBox, "7");

		camera.setZoomFactor(curZoomFactor);
		camera.setPosition(curPosition);
		testCameraPos(curPosition, curZoomFactor, curViewBox, "8");

		var visibilityTests = [
			{ visibility: { visible: [nodes[3], nodes[6]], hidden: [nodes[7], nodes[2]], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [nodes[7], nodes[3]], hidden: [nodes[2], nodes[6]], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [nodes[2], nodes[6]], hidden: [nodes[7], nodes[3]], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [nodes[3], nodes[7], nodes[2]], hidden: [nodes[6]], mode: VisibilityMode.Complete } }
		];

		visibilityTests.forEach(function(test) {
			viewport.setViewInfo(test, 0);
			var visibility = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Complete } }).visibility;
			test.visibility.visible.forEach(function(veid) {
				var nodeRef = veidToNodeRef.get(veid);
				assert.strictEqual(viewStateManager.getVisibilityState(nodeRef), true, veid + " visible");
				assert.notStrictEqual(visibility.visible.indexOf(veid), -1, veid + " visible");
				assert.strictEqual(visibility.hidden.indexOf(veid), -1, veid + " not hidden");
			});
			test.visibility.hidden.forEach(function(veid) {
				var nodeRef = veidToNodeRef.get(veid);
				assert.strictEqual(viewStateManager.getVisibilityState(nodeRef), false, veid + " hidden");
				assert.strictEqual(visibility.visible.indexOf(veid), -1, veid + " not visible");
				assert.notStrictEqual(visibility.hidden.indexOf(veid), -1, veid + " hidden");
			});
		});

		function testSelectionViewInfo(count1, count2) {
			var viewInfo = viewport.getViewInfo({ selection: true });

			assert.equal(viewInfo.selection.selected.length, count1, count1 + " selected nodes");

			viewStateManager.enumerateSelection(function(nodeRef) {
				var veId = nodeRefToVEID.get(nodeRef);
				assert.ok(viewInfo.selection.selected.indexOf(veId) >= 0, veId + " selected");
			});

			return viewInfo;
		}

		testSelectionViewInfo(0, 0);

		viewStateManager.setSelectionStates([nodeRefs[1], nodeRefs[2], nodeRefs[3]], [], false, false);
		var vi = testSelectionViewInfo(3, 2);

		viewStateManager.setSelectionStates([nodeRefs[3], nodeRefs[5]], [nodeRefs[1], nodeRefs[2]], false, false);
		testSelectionViewInfo(2, 3);

		viewport.setViewInfo(vi);
		testSelectionViewInfo(3, 2);

		// check default value
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// get initial camera position
		var initialCamera = viewport.getViewInfo().camera;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen");

		// try to rotate
		viewport.rotate(20, 20);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not rotated");

		// try to pan
		viewport.pan(5, 10);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not panned");

		// try to zoom
		viewport.zoom(1.4);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not zoomed");

		// unfreeze camera
		viewport.setFreezeCamera(false);
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// zoom out scene
		viewport.beginGesture(1, 1);
		viewport.zoom(0.04);
		viewport.endGesture();

		// test initial zoom for unknown camera
		var rawData = {
			rawInitialZoom: viewport._camera._initialZoom,
			width: viewport._width
		};
		viewport._camera._initialZoom = -1;
		viewport._width = 0;
		var event = {
			size: {
				width: viewport._width,
				height: viewport._height
			}
		};
		assert.equal(viewport._handleResize(event), true);
		viewport._camera._initialZoom = rawData.rawInitialZoom;
		viewport._width = rawData.width;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen again");

		/* TODO: rewrite the test without using setTimeout()/setInterval()/viewport.tap().

		// try to double click
		var done = assert.async();
		var done2 = assert.async();
		viewport.tap(1, 1, true);
		setTimeout(function() {
			assert.deepEqual(viewport.getViewInfo().camera, newCamera, "Not changed");

			viewport.zoomTo(ZoomTo.All, null, 0, 0);
			viewport.setFreezeCamera(false);

			var nodeClicked;
			viewport.attachNodeClicked(function(event) {
				nodeClicked = event.getParameter("nodeRef");
				assert.equal(nodeClicked.name, "B", "Viewport Gesture click tab");
				done2();
			});
			viewport.tap(150, 50, false);

			// assert.equal(viewport.getCamera().getCameraRef().position.toArray().toString(), "0,0,100", "Viewport camera original position");

			var newViewBox;
			viewport.attachCameraChanged(function(event) {
				newViewBox = event.getParameter("viewBox");
			});
			viewport.tap(50, 150, true);

			setTimeout(function() {
				assertClose(assert, newViewBox[0], -5, "zoomTo viewBox.x");
				assertClose(assert, newViewBox[1], 95, "zoomTo viewBox.y");
				assertClose(assert, newViewBox[2], 110, "zoomTo viewBox.width");
				assertClose(assert, newViewBox[3], 110, "zoomTo viewBox.height");

				viewport.zoomTo(ZoomTo.All, null, 0, 0);

				var dx = 100;
				var dy = 50;
				var zoom = 0.95;

				viewport.pan(dx, dy);
				var id = viewport.getIdForLabel();
				var domobj = document.getElementById(id);
				var o = viewport._viewportHandler._getOffset(domobj);
				var rect = {
					x: o.x,
					y: o.y,
					w: domobj.offsetWidth,
					h: domobj.offsetHeight
				};
				var event = {
					points: [
						{ x: rect.x + rect.w, y: rect.y + rect.h },
						{ x: rect.x + rect.w, y: rect.y + rect.h }
					],
					buttons: 2,
					timeStamp: 249703,
					n: 2,
					d: 0,
					x: rect.x + rect.w,
					y: rect.y + rect.h
				};
				viewport._viewportHandler.beginGesture(event);
				viewport._viewportHandler.move(event);
				viewport.zoom(1 / zoom);
				viewport._viewportHandler.endGesture(event);
				setTimeout(function() {
					assertClose(assert, newViewBox[0], -dx + viewport._width * (1 - zoom), "Viewport gestures viewBox.x");
					assertClose(assert, newViewBox[1], -dy + viewport._height * (1 - zoom), "Viewport gestures viewBox.y");
					assertClose(assert, newViewBox[2], viewport._width * zoom, "Viewport gestures viewBox.width");
					assertClose(assert, newViewBox[3], viewport._height * zoom, "Viewport gestures viewBox.height");

					viewport.zoomTo(ZoomTo.All, null, 0, 0);
					nodeRefs.forEach(function(node) {
						if (node.children.length === 0) {
							node._vkSetNodeContentType(NodeContentType.Hotspot);
						}
					});

					var hotspotName;
					viewport.attachHotspotEnter(function(event) {
						hotspotName = event.getParameter("nodeRef").name;
					});
					viewport.attachHotspotLeave(function(event) {
						hotspotName = "!" + event.getParameter("nodeRef").name;
					});
					viewport.hover(50, 50);
					assert.strictEqual(hotspotName, "A", "Hotspot enter A");
					viewport.hover(100, -5);
					assert.strictEqual(hotspotName, "!A", "Hotspot leave A");
					viewport.hover(150, 50);
					assert.strictEqual(hotspotName, "B", "Hotspot enter B");
					viewport.hover(200, -5);
					assert.strictEqual(hotspotName, "!B", "Hotspot leave B");
					viewport.hover(250, 50);
					assert.strictEqual(hotspotName, "C", "Hotspot enter C");
					viewport.hover(305, 50);
					assert.strictEqual(hotspotName, "!C", "Hotspot leave C");

					viewport.exit();
					assert.equal(viewport.getScene(), null, "Viewport exit");

					done();
				}, 1000);
			}, 1000);
		}, 1000);
		*/
	});

	function createEvent(domRef, type, x, y, originalEvent) {
		const event = $.Event(type);
		const bounds = domRef.getBoundingClientRect();
		event.pageX = bounds.x + x;
		event.pageY = bounds.y + y;
		event.originalEvent = originalEvent;
		event.preventDefault = function() { };
		return event;
	}

	function triggerEvent(domRef, type, x, y, originalEvent) {
		$(domRef).trigger(createEvent(domRef, type, x, y, originalEvent));
	}

	QUnit.test("Mini-map", function(assert) {
		const viewport = this.viewport;
		assert.notEqual(viewport.getDomRef(), null, "viewport rendered");
		assert.deepEqual(viewport._getViewBox(), [0, 0, 300, 300], "initial view box");

		const miniMapDialog = viewport.getMiniMap();
		assert.ok(miniMapDialog, "mini-map dialog created");

		const miniMap = viewport._miniMap;
		assert.notOk(miniMap.getDomRef(), "mini-map not rendered");
		miniMapDialog.open();
		const miniMapDomRef = miniMap.getDomRef();
		assert.ok(miniMapDomRef, "mini-map rendered after dialog open");

		function round(value) {
			return Math.round(parseFloat(value) * 1e2) / 1e2;
		}

		function getRect() {
			return [round(miniMap._rect.style.left), round(miniMap._rect.style.top), round(miniMap._rect.style.width), round(miniMap._rect.style.height)];
		}

		assert.deepEqual(miniMap._sceneBBox, [0.5, 0.5, 299, 299], "scene bounding box");
		assert.strictEqual(miniMap._width, 320, "mini-map width");
		assert.strictEqual(miniMap._height, 320, "mini-map height");
		assert.deepEqual(getRect(), [-0.54, -0.54, 321.07, 321.07], "initial rect");

		triggerEvent(miniMapDomRef, 'mousewheel', 160, 160, { wheelDelta: 960, touches: [] });
		assert.deepEqual(getRect(), [79.73, 79.73, 160.54, 160.54], "rect after zoom");

		miniMap.ontouchstart(createEvent(miniMapDomRef, 'touchstart', 80, 240));
		assert.deepEqual(getRect(), [-0.27, 159.73, 160.54, 160.54], "rect after move");

		miniMapDialog.close();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
