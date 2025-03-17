/* global QUnit, sinon*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"test-resources/sap/ui/vk/qunit/utils/ThreeJSUtils",
	"sap/ui/vk/threejs/Material"
], function(
	nextUIUpdate,
	jQuery,
	ViewStateManager,
	Viewport,
	THREE,
	loader,
	ThreeJSUtils,
	Material
) {
	"use strict";

	var materialCreate = sinon.spy(THREE.Material, "call");
	var materialDispose = sinon.spy(THREE.Material.prototype, "dispose");

	QUnit.moduleWithContentConnector("Material", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", "threejs.test.json",
		null,
		function beforeEach(assert) {
			this.viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
			this.viewport = new Viewport({ viewStateManager: this.viewStateManager, contentConnector: this.contentConnector });
			this.viewport.placeAt("content");
			nextUIUpdate.runSync();
			materialCreate.resetHistory();
			materialDispose.resetHistory();
		},
		function afterEach(assert) {
			this.viewport.destroy();
			this.viewport = null;
			this.viewStateManager.destroy();
			this.viewStateManager = null;
			var materialCallInfo = ThreeJSUtils.createCallInfo(materialCreate, materialDispose);
			ThreeJSUtils.analyzeCallInfo("Materials", materialCallInfo, assert);
		}
	);

	QUnit.test("Double-sided materials", function(assert) {
		var viewport = this.viewport;
		var scene = viewport.getScene();

		var getNumberOfMaterials = function(scene) {
			var nh = scene.getDefaultNodeHierarchy();
			var allNodes = nh.findNodesByName();
			var count = 0;
			allNodes.forEach(function(node) {
				if (node.material != null) {
					count++;
				}
			});
			return count;
		};

		var getNumberOfDoubleSidedMaterials = function(scene) {
			var nh = scene.getDefaultNodeHierarchy();
			var allNodes = nh.findNodesByName();
			var count = 0;
			allNodes.forEach(function(node) {
				if (node.material != null) {
					if (node.material.side === THREE.DoubleSide) {
						count++;
					}
				}
			});
			return count;
		};

		assert.ok(getNumberOfDoubleSidedMaterials(scene) === 0, "Initial state of materials ");

		scene.setDoubleSided(true);
		assert.ok(getNumberOfDoubleSidedMaterials(scene) === getNumberOfMaterials(scene), "All materials are double sided ");

		scene.setDoubleSided(false);
		assert.ok(getNumberOfDoubleSidedMaterials(scene) === 0, "No double sided materials");
	});

	QUnit.test("Set opacity of material at 50%", function(assert) {
		var testMaterial = new Material();
		assert.ok(testMaterial, "Test material created");

		testMaterial.setOpacity(0.5);
		assert.equal(testMaterial._nativeMaterial.opacity, 0.5, "New opacity updated");
		assert.equal(testMaterial._nativeMaterial.transparent, true, "New transparent updated");
	});

	QUnit.test("Set opacity of material at 100%", function(assert) {
		var testMaterial = new Material();
		assert.ok(testMaterial, "Test material created");

		testMaterial.setOpacity(1);
		assert.equal(testMaterial._nativeMaterial.opacity, 1, "New opacity updated");
		assert.equal(testMaterial._nativeMaterial.transparent, false, "New transparent updated");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
