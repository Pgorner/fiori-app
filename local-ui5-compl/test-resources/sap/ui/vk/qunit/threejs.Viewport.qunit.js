/* global QUnit, sinon*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/CameraProjectionType",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/VisibilityMode",
	"sap/ui/vk/threejs/ThreeUtils",
	"sap/ui/vk/tools/RedlineTool",
	"sap/ui/vk/tools/DistanceMeasurementTool",
	"sap/ui/vk/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"test-resources/sap/ui/vk/qunit/utils/ThreeJSUtils"
], function(
	nextUIUpdate,
	CameraProjectionType,
	ContentResource,
	ViewStateManager,
	Viewport,
	VisibilityMode,
	ThreeUtils,
	RedlineTool,
	DistanceMeasurementTool,
	THREE,
	loader,
	ThreeJSUtils
) {
	"use strict";

	var materialCreate = sinon.spy(THREE.Material, "call");
	var materialDispose = sinon.spy(THREE.Material.prototype, "dispose");
	var geometryCreate = sinon.spy(THREE.BufferGeometry, "call");
	var geometryDispose = sinon.spy(THREE.BufferGeometry.prototype, "dispose");


	QUnit.moduleWithContentConnector("Viewport", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json",
		function onLoadingSucceeded(assert) {
			// set node fake sid
			var nodeHierarchy = this.viewport.getScene().getDefaultNodeHierarchy();
			var allNodeRefs = nodeHierarchy.findNodesByName();
			allNodeRefs.forEach(function(node) {
				node.userData.treeNode = { sid: node.uuid };
			});
		},
		function beforeEach(assert) {
			this.viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
			this.viewport = new Viewport({ viewStateManager: this.viewStateManager, contentConnector: this.contentConnector });
			this.viewport.placeAt("content");
			nextUIUpdate.runSync();
			materialCreate.resetHistory();
			materialDispose.resetHistory();
			geometryCreate.resetHistory();
			geometryDispose.resetHistory();
		},
		function afterEach(assert) {
			this.viewport.destroy();
			this.viewport = null;
			this.viewStateManager.destroy();
			this.viewStateManager = null;
			var materialCallInfo = ThreeJSUtils.createCallInfo(materialCreate, materialDispose);
			ThreeJSUtils.analyzeCallInfo("Materials", materialCallInfo, assert);
			var geometryCallInfo = ThreeJSUtils.createCallInfo(geometryCreate, geometryDispose);
			ThreeJSUtils.analyzeCallInfo("Geometries", geometryCallInfo, assert);
		}
	);

	QUnit.test("Initialization", function(assert) {
		var viewport = this.viewport;
		assert.ok(viewport, "The viewport is created.");
		assert.ok(viewport instanceof Viewport, "The viewport is sap.ui.vk.threejs.Viewport implementation.");
	});

	QUnit.test("Default values", function(assert) {
		var viewport = this.viewport;

		// No query provided (shall return camera info only)
		var viewInfo = viewport.getViewInfo();
		assert.notEqual(viewInfo.camera, null, "No query - Camera retrieved");
		assert.equal(viewInfo.visibility, null, "No query - No visibility information");
		assert.equal(viewInfo.selection, undefined, "No query - No selection information");

		// Query with no camera required
		viewInfo = viewport.getViewInfo({ camera: false });
		assert.equal(viewInfo.camera, null, "Camera info shall not be retrieved");

		// Simple visibility query without camera specified (shall still return camera info)
		viewInfo = viewport.getViewInfo({ visibility: true, selection: false });
		assert.notEqual(viewInfo.camera, null, "No camera query - Camera still retrieved");
		assert.notEqual(viewInfo.visibility, null, "Visibility required - Visibility information retrieved");
		assert.equal(viewInfo.visibility.visible.length, 7, "Visibility required - Correct number of visible nodes");
		assert.equal(viewInfo.visibility.hidden.length, 0, "Visibility required - Correct number of hidden nodes");
		assert.equal(viewInfo.selection, undefined, "Selection not required -  No selection information");

		// Visibility query requiring differences but diff tracking is not set
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.notEqual(viewInfo.visibility, null, "Visibility diff required - Visibility object retrieved");
		assert.equal(viewInfo.visibility.changes, null, "Visibility diff required - Tracking not set");

		// Visibility query requiring differences with diff tracking set
		var viewStateManager = this.viewStateManager;
		viewStateManager.setShouldTrackVisibilityChanges(true);
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.notEqual(viewInfo.visibility, null, "Visibility diff required - Visibility object retrieved");
		assert.notEqual(viewInfo.visibility.changes, null, "Visibility diff required - Tracking set");

		// Simple selection query
		viewInfo = viewport.getViewInfo({ selection: true });
		assert.ok(!!viewInfo.selection, "Selection required - Selection information retrieved");
		assert.equal(viewInfo.selection.selected.length, 0, "Selection required - No selected nodes");
		assert.equal(viewInfo.selection.outlined.length, 0, "Selection required - No outlined nodes");
	});

	QUnit.test("setViewInfo getViewInfo", function(assert) {
		var viewport = this.viewport;
		var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy();
		var viewStateManager = this.viewStateManager;
		var allNodeRefs = nodeHierarchy.findNodesByName();
		var nodeRefToVEID = new Map();
		var veidToNodeRef = new Map();
		var nodeRefs = [];
		var nodes = [];
		allNodeRefs.forEach(function(node) {
			nodeRefs.push(node);
			nodes.push(node.uuid);
			nodeRefToVEID.set(node, node.uuid);
			veidToNodeRef.set(node.uuid, node);
		});

		var cameraTests = [
			{ camera: { rotation: { yaw: -48, pitch: 32, roll: -35 }, position: { x: 10, y: 20, z: 30 }, projectionType: CameraProjectionType.Orthographic, zoomFactor: 1.123 } },
			{ camera: { rotation: { yaw: -137, pitch: -32, roll: 45 }, position: { x: 200, y: 300, z: 400 }, projectionType: CameraProjectionType.Perspective, fieldOfView: 45.67 } },
			{ camera: { rotation: { yaw: 134, pitch: 43, roll: -76 }, position: { x: 100, y: 50, z: 25 }, projectionType: CameraProjectionType.Orthographic, zoomFactor: 2.345 } },
			{ camera: { rotation: { yaw: 90, pitch: -5, roll: 10 }, position: { x: 350, y: 0, z: 0 }, projectionType: CameraProjectionType.Perspective, fieldOfView: 34.56 } }
		];

		function floatEqual(a, b, desc) {
			assert.deepEqual(a.toFixed(4), b.toFixed(4), desc);
		}

		cameraTests.forEach(function(test) {
			viewport.setViewInfo(test, 0);
			var camera = viewport.getViewInfo({ camera: true }).camera;
			floatEqual(camera.position.x, test.camera.position.x, "camera.position.x");
			floatEqual(camera.position.y, test.camera.position.y, "camera.position.y");
			floatEqual(camera.position.z, test.camera.position.z, "camera.position.z");
			floatEqual(camera.rotation.yaw, test.camera.rotation.yaw, "camera.yaw");
			floatEqual(camera.rotation.pitch, test.camera.rotation.pitch, "camera.pitch");
			floatEqual(camera.rotation.roll, test.camera.rotation.roll, "camera.roll");
			assert.deepEqual(camera.projectionType, test.camera.projectionType, "camera.projectionType");
			if (camera.projectionType === CameraProjectionType.Orthographic) {
				assert.deepEqual(camera.zoomFactor, test.camera.zoomFactor, "camera.zoomFactor");
			} else {
				assert.deepEqual(camera.fieldOfView, test.camera.fieldOfView, "camera.fieldOfView");
			}
		});

		var visibilityTests = [
			{ visibility: { visible: [nodes[2], nodes[5]], hidden: [nodes[6], nodes[1]], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [nodes[6], nodes[2]], hidden: [nodes[1], nodes[5]], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [nodes[1], nodes[5]], hidden: [nodes[6], nodes[2]], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [nodes[2], nodes[6], nodes[1]], hidden: [nodes[5]], mode: VisibilityMode.Complete } }
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
			assert.equal(viewInfo.selection.outlined.length, count2, count2 + " outlined nodes");

			viewStateManager.enumerateSelection(function(nodeRef) {
				var veId = nodeRefToVEID.get(nodeRef);
				assert.ok(viewInfo.selection.selected.indexOf(veId) >= 0, veId + " selected");
			});
			viewStateManager.enumerateOutlinedNodes(function(nodeRef) {
				var veId = nodeRefToVEID.get(nodeRef);
				assert.ok(viewInfo.selection.outlined.indexOf(veId) >= 0, veId + " outlined");
			});

			return viewInfo;
		}

		testSelectionViewInfo(0, 0);

		viewStateManager.setSelectionStates([nodeRefs[1], nodeRefs[2], nodeRefs[3]], [], false, false);
		viewStateManager.setOutliningStates([nodeRefs[1], nodeRefs[4]], [], false, false);
		var vi = testSelectionViewInfo(3, 2);

		viewStateManager.setSelectionStates([nodeRefs[3], nodeRefs[5]], [nodeRefs[1], nodeRefs[2]], false, false);
		viewStateManager.setOutliningStates([nodeRefs[1], nodeRefs[5], nodeRefs[6]], [nodeRefs[4]], false, false);
		testSelectionViewInfo(2, 3);

		viewport.setViewInfo(vi);
		testSelectionViewInfo(3, 2);
	});

	// TODO: rewrite the test without using setTimeout()/setInterval()/viewport.tap().
	QUnit.skip("Freeze camera", function(assert) {
		var viewport = this.viewport;

		// check default value
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// get initial camera position
		var initialCamera = viewport.getViewInfo().camera;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen");

		// try to rotate
		viewport._viewportGestureHandler._cameraController.rotate(20, 20);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not rotated");

		// try to pan
		viewport._viewportGestureHandler._cameraController.pan(5, 10);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not panned");

		// try to zoom
		viewport._viewportGestureHandler._cameraController.zoom(1.4);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not zoomed");

		// unfreeze camera
		viewport.setFreezeCamera(false);
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// zoom out scene
		viewport._viewportGestureHandler._cameraController.beginGesture(1, 1);
		viewport._viewportGestureHandler._cameraController.zoom(0.04);
		viewport._viewportGestureHandler._cameraController.endGesture();

		// get new camera position
		var newCamera = viewport.getViewInfo().camera;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen again");

		// try to double click
		viewport.tap(1, 1, true);
		assert.deepEqual(viewport.getViewInfo().camera, newCamera, "Not changed");
	});

	// TODO: rewrite the test without using setTimeout()/setInterval()/viewport.tap().
	QUnit.skip("Viewport Gesture Handler", function(assert) {
		var viewport = this.viewport;

		var done = assert.async();
		var done2 = assert.async();
		viewport.setFreezeCamera(false);
		var nodeClicked;
		viewport.attachEventOnce("nodeClicked", function(event) {
			nodeClicked = event.getParameter("nodeRef");
			assert.equal(nodeClicked.name, "Torus1", "Viewport Gesture click tab");
			done2();
		});
		viewport.tap(10, 70, false);

		assert.equal(viewport.getCamera().getCameraRef().position.toArray().toString(), "0,0,100", "Viewport camera original position");

		viewport.attachEventOnce("viewFinished", function() {
			var maxDifference = 1e-1;
			function assertClose(actual, expected, message) {
				var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
				assert.pushResult({ result: passes, actual: actual, expected: expected, message: message + " (" + actual + " ~ " + expected + ")" });
			}

			var newCameraPos = viewport.getCamera().getCameraRef().position.toArray().map(function(p) { return Number.parseFloat(p).toPrecision(4); }).toString();
			assert.equal(newCameraPos, "-25.00,10.00,28.13", "Viewport Gesture double click zoomObject");

			viewport.pan(1, 1);
			var id = viewport.getIdForLabel();
			var domobj = document.getElementById(id);
			var o = viewport._viewportGestureHandler._getOffset(domobj);
			var rect = {
				x: o.x,
				y: o.y,
				w: domobj.offsetWidth,
				h: domobj.offsetHeight
			};
			var gestureEvent = {
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
			viewport._viewportGestureHandler.beginGesture(gestureEvent);
			viewport._viewportGestureHandler.move(gestureEvent);
			viewport.rotate(20, 20);

			viewport.attachEventOnce("viewFinished", function() {
				var newCameraPos = viewport.getCamera().getCameraRef().position.toArray().map(function(p) { return Number.parseFloat(p).toPrecision(4); }).toString();
				assert.equal(newCameraPos, "-25.07,25.37,120.2", "Viewport Gesture pan move rotate zoomToAll");

				var redlineTool = new RedlineTool();
				viewport.addTool(redlineTool);
				redlineTool.setActive(true, viewport);
				assert.ok(redlineTool.getActive(), "RedlineTool should be activated");

				var camera = viewport.getCamera().getCameraRef();
				assert.ok(camera.view && camera.view.enabled, "Viewport redline mode activated");

				assert.strictEqual(camera.view.fullWidth, 300, "view.fullWidth");
				assert.strictEqual(camera.view.fullHeight, 300, "view.fullHeight");
				assert.strictEqual(camera.view.width, 300, "view.width initial");
				assert.strictEqual(camera.view.height, 300, "view.height initial");
				assert.strictEqual(camera.view.offsetX, 0, "view.offsetX initial");
				assert.strictEqual(camera.view.offsetY, 0, "view.offsetY initial");

				var nodes = viewport.getScene().getDefaultNodeHierarchy().findNodesByName({ value: "Box" });
				assert.ok(Array.isArray(nodes) && nodes.length === 1, "Box node found");

				viewport.attachEventOnce("viewFinished", function() {
					assertClose(camera.view.width, 159.15, "view.width after zoomTo");
					assertClose(camera.view.height, 159.15, "view.height after zoomTo");
					assertClose(camera.view.offsetX, 73.25, "view.offsetX after zoomTo");
					assertClose(camera.view.offsetY, 28.64, "view.offsetY after zoomTo");
					done();
				});
				viewport.zoomTo(sap.ui.vk.ZoomTo.Node, nodes[0], 0, 0.15);
			});
			viewport.zoomTo(sap.ui.vk.ZoomTo.All, null, 0, 0);
			viewport._viewportGestureHandler.endGesture(gestureEvent);
		});
		viewport.tap(10, 70, true);
	});

	// TODO: rewrite the test without using setTimeout()/setInterval().
	QUnit.skip("Viewport Gesture Handler - look at object", function(assert) {
		var viewport = this.viewport;

		var done = assert.async();
		assert.equal(viewport.getCamera().getCameraRef().quaternion.toArray().toString(), "0,0,0,1", "Viewport camera original rotation");
		var newCameraQuat;
		viewport.attachCameraChanged(function(event) {
			newCameraQuat = event.getParameter("quaternion").map(function(p) { return Number.parseFloat(p).toPrecision(4); }).toString();
		});

		viewport._viewportGestureHandler._cameraController.lookAtObject(viewport.getScene().getSceneRef().getObjectByName("Torus1"), 100);

		setTimeout(function() {
			assert.equal(newCameraQuat, "0.04797,0.1220,-0.005906,0.9913", "double click - new camera rotate changed to look at object");
			done();
		}, 1000);
	});

	QUnit.test("getObjectImage", function(assert) {
		var obj = new THREE.Mesh(
			new THREE.BoxGeometry(10, 15, 10),
			new THREE.MeshLambertMaterial({ color: 0x0000FF })
		);

		var maxColorDifference = 5;
		function testPixel(ctx, x, y, color) {
			var pixelData = ctx.getImageData(x, y, 1, 1).data;
			return Math.abs(pixelData[0] - color[0]) <= maxColorDifference &&
				Math.abs(pixelData[1] - color[1]) <= maxColorDifference &&
				Math.abs(pixelData[2] - color[2]) <= maxColorDifference;
		}
		function testRect(testName, ctx, x1, y1, x2, y2, color) {
			var result = true;
			for (var y = y1; result && y < y2; y += 10) {
				for (var x = x1; result && x < x2; x += 10) {
					if (testPixel(ctx, x, y, color) == false) {
						result = false;
					};
				}
			}
			assert.ok(result, "Test image: " + testName);
		}

		// function saveBase64AsFile(base64, fileName) {
		// 	var link = document.createElement("a");
		// 	document.body.appendChild(link); // for Firefox
		// 	link.setAttribute("href", base64);
		// 	link.setAttribute("download", fileName);
		// 	link.click();
		// }

		var viewport = this.viewport;
		viewport.render();

		var done = assert.async();
		var image = new Image();
		image.onload = function() {
			assert.strictEqual(this.width, 256, "Default image width");
			assert.strictEqual(this.height, 256, "Default image height");
			var canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			var ctx = canvas.getContext("2d", { willReadFrequently: true });
			ctx.drawImage(this, 0, 0, this.width, this.height);
			document.body.prepend(this, canvas);
			testRect("Background top", ctx, 0, 0, 40, 1, [0, 255, 0]); // background top
			testRect("Background middle", ctx, 0, 128, 40, 129, [0, 127, 0]); // background middle
			testRect("Background bottom", ctx, 0, 255, 40, 256, [0, 0, 0]); // background bottom
			testRect("Box", ctx, 44, 2, 211, 254, [0, 0, 232]); // box
			testRect("Background top", ctx, 215, 0, 256, 1, [0, 255, 0]); // background top
			testRect("Background middle", ctx, 215, 128, 256, 128, [0, 127, 0]); // background middle
			testRect("Background bottom", ctx, 215, 255, 256, 255, [0, 0, 0]); // background bottom
			done();
		};
		image.src = viewport.getObjectImage(obj, undefined, undefined, "#00FF00", "#000000", new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0)); // front view

		var done2 = assert.async();
		var image2 = new Image();
		image2.onload = function() {
			assert.strictEqual(this.width, 300, "Image width");
			assert.strictEqual(this.height, 200, "Image height");
			var canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			var ctx = canvas.getContext("2d", { willReadFrequently: true });
			ctx.drawImage(this, 0, 0, this.width, this.height);
			document.body.prepend(this, canvas);
			testRect("Background", ctx, 0, 0, 49, 200, [255, 0, 0]); // background
			testRect("Box", ctx, 52, 2, 247, 199, [0, 0, 255]); // box
			testRect("Background", ctx, 251, 0, 300, 200, [255, 0, 0]); // background
			done2();
		};
		image2.src = viewport.getObjectImage(obj, 300, 200, "#FF0000", "#FF0000", new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)); // top view

		ThreeUtils.disposeObject(obj);
	});

	QUnit.test("Large scene coordinates disable cluster loading", function(assert) {
		var sceneRef = this.viewport.getScene().getSceneRef();
		assert.ok(sceneRef.userData.useGeometryClusters == undefined, "Initial cluster loading is not set");
		this.viewport.getCamera().setPosition([0, 0, 10000]);
		this.viewport.render();
		assert.ok(sceneRef.userData.useGeometryClusters == false, "Cluster loading is now false");
	});

	QUnit.test("Update after content removal", function(assert) {
		const viewport = this.viewport;

		const contentConnector = sap.ui.getCore().byId(viewport.getContentConnector());
		assert.ok(contentConnector, "ContentConnector found.");
		assert.equal(contentConnector.getContentResources().length, 1, "ContentResources found.");

		viewport.setShouldRenderFrame = sinon.stub()
		contentConnector.removeContentResource(0);

		const done = assert.async();
		setTimeout(() => {
			assert.ok(viewport.setShouldRenderFrame.callCount > 0, "viewport.setShouldRenderFrame was called after ContentResource was removed.");
			assert.ok(viewport.setShouldRenderFrame.args.find((args) => (!args.length || !args[0])), "not skipHierarchyProcessing.")
			done();
		}, 500);
	});

	QUnit.test("Add/remove ContentResource", function(assert) {
		const viewport = this.viewport;

		const contentConnector = sap.ui.getCore().byId(viewport.getContentConnector());
		assert.ok(contentConnector, "ContentConnector found.");
		assert.equal(contentConnector.getContentResources().length, 1, "ContentResources found.");

		const identityMatrix_4x3 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
		const identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
		const matrix2_4x3 = [1, 0, 0, 0, 2, 0, 0, 0, 3, 4, 5, 6];
		const matrix2 = [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 4, 5, 6, 1];

		const done = [assert.async(), assert.async(), assert.async(), assert.async(), assert.async()];
		contentConnector.attachContentChangesFinished((event) => {
			const scene = event.getParameter("content");
			const nativeScene = scene?.getSceneRef();
			switch (done.length) {
				case 5:
					assert.ok(nativeScene, "1: scene found");
					assert.deepEqual(nativeScene.children.map(n => n.name), ["DefaultLights", "11", "22"], "1: scene content");
					assert.deepEqual(nativeScene.children.map(n => n.matrix.elements), [identityMatrix, identityMatrix, matrix2], "1: scene content matrix");
					assert.equal(scene._materialMap.size, 2, "1: 2 materials found");
					contentConnector.removeContentResource(0);
					break;
				case 4:
					assert.ok(nativeScene, "2: scene found");
					assert.deepEqual(nativeScene.children.map(n => n.name), ["DefaultLights", "22"], "2: scene content");
					assert.deepEqual(nativeScene.children.map(n => n.matrix.elements), [identityMatrix, matrix2], "2: scene content matrix");
					assert.equal(scene._materialMap.size, 1, "2: 1 material found");
					contentConnector.addContentResource(new ContentResource({
						source: 'test-resources/sap/ui/vk/qunit/media/multiple_shapes.vds',
						sourceType: 'vds4',
						name: '33',
						localMatrix: identityMatrix_4x3
					}));
					break;
				case 3:
					assert.ok(nativeScene, "3: scene found");
					assert.deepEqual(nativeScene.children.map(n => n.name), ["DefaultLights", "22", "33"], "3: scene content");
					assert.deepEqual(nativeScene.children.map(n => n.matrix.elements), [identityMatrix, matrix2, identityMatrix], "3: scene content matrix");
					assert.equal(scene._materialMap.size, 2, "3: 2 materials found");
					contentConnector.removeContentResource(1);
					break;
				case 2:
					assert.ok(nativeScene, "4: scene found");
					assert.deepEqual(nativeScene.children.map(n => n.name), ["DefaultLights", "22"], "4: scene content");
					assert.deepEqual(nativeScene.children.map(n => n.matrix.elements), [identityMatrix, matrix2], "4: scene content matrix");
					assert.equal(scene._materialMap.size, 1, "4: 1 material found");
					contentConnector.removeContentResource(0);
					break;
				case 1:
					assert.notOk(scene, "5: no resources - no scene");
					break;
			}
			done.pop()();
		})

		contentConnector.removeContentResource(0);
		contentConnector.addContentResource(new ContentResource({
			source: 'test-resources/sap/ui/vk/qunit/media/multiple_shapes.vds',
			sourceType: 'vds4',
			sourceId: '1',
			name: '11'
		}));
		contentConnector.addContentResource(new ContentResource({
			source: 'test-resources/sap/ui/vk/qunit/media/multiple_shapes.vds',
			sourceType: 'vds4',
			sourceId: '2',
			name: '22',
			localMatrix: matrix2_4x3
		}));
	});

	QUnit.test("Clean up", function(assert) {
		var distTool = new DistanceMeasurementTool();
		var viewport = this.viewport;
		viewport.addTool(distTool);
		distTool.setActive(true, viewport);
		assert.ok(distTool.getActive(), "Measurement tool is active");

		viewport.destroy();
		assert.ok(true, "Viewport didn't crash on exit");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
