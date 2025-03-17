/* global QUnit */

sap.ui.define([
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/threejs/Scene",
	"test-resources/sap/ui/vk/qunit/utils/ThreeJSUtils"
], function(
	Loader,
	Scene,
	ThreeJSUtils
) {
	"use strict";

	// var materialCreate = sinon.spy(THREE.Material, "call");
	// var geometryCreate = sinon.spy(THREE.BufferGeometry, "call");
	// var materialDispose = sinon.spy(THREE.Material.prototype, "dispose");
	// var geometryDispose = sinon.spy(THREE.BufferGeometry.prototype, "dispose");

	QUnit.moduleWithContentConnector("threejs.Scene Tests", "test-resources/sap/ui/vk/qunit/media/998.vds", "vds4", null);

	QUnit.test("threejs.Scene clears all objects", function(assert) {
		var scene = this.contentConnector.getContent();
		assert.ok(scene instanceof sap.ui.vk.threejs.Scene, "Scene is properly constructed");

		scene.destroy();

		// var geometryCallInfo = ThreeJSUtils.createCallInfo(geometryCreate, geometryDispose);
		// ThreeJSUtils.analyzeCallInfo("Geometries", geometryCallInfo, assert);

		// var materialCallInfo = ThreeJSUtils.createCallInfo(materialCreate, materialDispose);
		// ThreeJSUtils.analyzeCallInfo("Materials", materialCallInfo, assert);
	});

	QUnit.test("objectTransform matrix", function(assert) {
		const expectedObjectTransform = {
			"Spacer": [1, -0, 0, 0, -0, 1, 0, 0, 0, -0, 1, 0, -25, 0, -0, 1],
			"Lock Washer": [1, 0, 0, 0, -0, 1, -0, 0, -0, 0, 1, 0, 0, -1.25, 0, 1],
			"Screw": [1, -0, -0, 0, -0, 1, -0, 0, -0, -0, 1, 0, -16.5, -0, -0, 1],
			"Clutch Spring": [1, 0, -0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -8, -0, 1],
			"Clutch Plate": [1, -0, -0, 0, -0, 1, 0, 0, -0, -0, 1, 0, -0, 0, -1.5, 1],
			"Seal Ring": [1, -0, -0, 0, -0, 1, 0, 0, -0, 0, 1, 0, -3.5, -0, -0, 1]
		};

		this.contentConnector.getContent().getSceneRef().traverse((node) => {
			if (node.userData.objectTransform && expectedObjectTransform[node.name]) {
				const m = node.userData.objectTransform.elements.map(e => Math.round(e * 100) / 100);
				assert.deepEqual(m, expectedObjectTransform[node.name], `${node.name} objectTransform`);
			}
		});
	});

	QUnit.test("threejs.Scene _expandBoundingBox", function(assert) {
		var scene = this.contentConnector.getContent();
		var bbox = scene._computeBoundingBox(true, true, true);
		const tol = 1.0e-6;
		assert.ok(Math.abs(bbox.min.x + 110.00007792778223) < tol);
		assert.ok(Math.abs(bbox.min.y + 165.83486397433427) < tol);
		assert.ok(Math.abs(bbox.min.z + 165.83474645209856) < tol);
		assert.ok(Math.abs(bbox.max.x - 29.000026067540805) < tol);
		assert.ok(Math.abs(bbox.max.y - 165.83484293387323) < tol);

		var sceneRef = scene.getSceneRef();
		sceneRef.children[0].visible = false;
		bbox = scene._computeBoundingBox(true, true, true);
		assert.ok(isFinite(bbox.min.x) == false);
		bbox = scene._computeBoundingBox(false, true, true);
		assert.ok(Math.abs(bbox.min.x + 110.00007792778223) < tol);
		sceneRef.children[0].visible = true;
	});


	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
