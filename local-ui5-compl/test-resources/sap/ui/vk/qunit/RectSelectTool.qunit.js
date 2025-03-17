/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/threejs/Scene",
	"sap/ui/vk/tools/RectSelectTool"
], function(
	nextUIUpdate,
	THREE,
	ViewStateManager,
	Viewport,
	Scene,
	RectSelectTool
) {
	"use strict";

	var rectSelectTool = new RectSelectTool();

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({
		viewStateManager: viewStateManager,
		tools: [rectSelectTool]
	});
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	var nativeScene = new THREE.Scene();
	nativeScene.add(new THREE.DirectionalLight());

	var dx = 17;
	var dy = 10;
	var geom = new THREE.IcosahedronGeometry(6, 3);

	function addMesh(parent, x, y, color, skipIt) {
		var mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({ color: color, flatShading: true }));
		mesh.name = parent.name + "M";
		mesh.position.set(x, y, 0);
		mesh.updateMatrix();
		mesh.userData.skipIt = skipIt;
		parent.add(mesh);
		return mesh;
	}

	var A = addMesh(nativeScene, -dx, dy, 0xFF0000, false); // "A" mesh
	A.name = "A";

	var B = new THREE.Group(); // "B" -> ["mesh"]
	B.name = "B";
	nativeScene.add(B);
	addMesh(B, -dx, -dy, 0x00FFFF, true);

	var C = new THREE.Group(); // "C" -> [Group(skipIt) -> ["mesh"], "mesh"]
	C.name = "C";
	nativeScene.add(C);
	var CG = new THREE.Group();
	CG.name = "CG";
	CG.userData.skipIt = true;
	C.add(CG);
	addMesh(C, 0, dy, 0x00FF00, true);
	addMesh(CG, 0, -dy, 0xFF00FF, true);

	var D = new THREE.Group(); // "D"(closed) -> ["mesh", Group -> ["mesh"]]
	D.name = "D";
	D.userData.closed = true;
	nativeScene.add(D);
	var DG = new THREE.Group();
	DG.name = "DG";
	addMesh(D, dx, dy, 0x0000FF, true);
	D.add(DG);
	addMesh(DG, dx, -dy, 0xFFFF00, true);

	var scene = new Scene(nativeScene);

	viewport._setContent(scene);
	viewStateManager._setScene(scene);

	QUnit.test("RectSelectTool", async function(assert) {
		assert.ok(viewport instanceof Viewport, "The sap.ui.vk.threejs.Viewport is created.");

		rectSelectTool.setActive(true, viewport);
		viewport.rerender();
		await nextUIUpdate();
		viewport.render();

		// set camera state
		var nativeCamera = viewport.getCamera().getCameraRef();
		nativeCamera.fov = 30;
		nativeCamera.up.set(0, 1, 0);
		nativeCamera.position.set(0, 0, 100);
		nativeCamera.lookAt(0, 0, 0);
		nativeCamera.updateMatrix();
		nativeCamera.updateMatrixWorld();

		function compareStrings(a, b) {
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			} else {
				return 0;
			}
		}

		function testSelection(x1, y1, x2, y2, expectedNodes) {
			var nodes = rectSelectTool.select(x1, y1, x2, y2, scene, viewport.getCamera());
			var nodeNames = nodes.map(function(node) { return node.name; }).sort(compareStrings);
			assert.deepEqual(nodeNames, expectedNodes, "select(" + x1 + "," + y1 + "," + x2 + "," + y2 + ")");
		}

		testSelection(0, 0, 100, 150, ["A"]);
		testSelection(100, 0, 200, 150, []);
		testSelection(200, 0, 300, 150, []);
		testSelection(0, 150, 100, 300, ["B"]);
		testSelection(100, 150, 200, 300, []);
		testSelection(200, 150, 300, 300, []);

		testSelection(0, 0, 100, 300, ["A", "B"]);
		testSelection(100, 0, 200, 300, ["C"]);
		testSelection(200, 0, 300, 300, ["D"]);

		testSelection(0, 0, 150, 300, ["A", "B"]);
		testSelection(150, 0, 300, 300, ["D"]);

		testSelection(0, 0, 300, 150, ["A"]);
		testSelection(0, 150, 300, 300, ["B"]);

		testSelection(0, 0, 200, 300, ["A", "B", "C"]);
		testSelection(100, 0, 300, 300, ["C", "D"]);

		testSelection(0, 0, 300, 300, ["A", "B", "C", "D"]);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
