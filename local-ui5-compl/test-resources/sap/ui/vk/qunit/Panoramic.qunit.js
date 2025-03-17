/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/threejs/ParametricGenerators",
	"sap/ui/vk/NodeContentType",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	Viewport,
	ViewStateManager,
	THREE,
	ParametricGenerators,
	NodeContentType,
	loader
) {
	"use strict";

	var vsm = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: vsm });
	viewport.placeAt("content");
	nextUIUpdate.runSync();
	var nativeCamera;

	QUnit.moduleWithContentConnector("Panoramic", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		vsm.setContentConnector(this.contentConnector);
		viewport.setContentConnector(this.contentConnector);
		nativeCamera = viewport.getCamera().getCameraRef();
		viewport.getCamera().setPosition([0, 0, 0]);
		nativeCamera.userData.rotate = true;
	});

	QUnit.test("Load panoramic scene", function(assert) {
		function lookAround(zfactor) {
			viewport._viewportGestureHandler._cameraController.rotate(10, 0, true);
			viewport._viewportGestureHandler._cameraController.zoom(zfactor);
		}

		var done = assert.async();

		var tloader = new THREE.TextureLoader();
		tloader.load("test-resources/sap/ui/vk/qunit/media/kitchen.jpg", function(texture) {
			var sphereMat = new THREE.MeshBasicMaterial();
			sphereMat.map = texture;
			sphereMat.side = THREE.DoubleSide;
			sphereMat.needsUpdate = true;

			assert.ok(texture.image !== undefined, "360Image scene loaded.");

			var sphere = ParametricGenerators.generateSphere({ radius: 1 }, sphereMat);
			sphere._vkSetNodeContentType(NodeContentType.Background);
			assert.equal(sphere.userData.renderStage, -1, "Background node renderStage");

			var sceneRef = viewport._getNativeScene();
			var rootNode = sceneRef.children[0].children[0];
			rootNode.name = "RootNode";
			var backgroundNode = new THREE.Group();
			backgroundNode.name = "Background";
			backgroundNode._vkSetNodeContentType(NodeContentType.Background);
			backgroundNode.add(sphere);
			rootNode.add(backgroundNode);
			vsm.fireVisibilityChanged();

			assert.equal(viewport._isPanoramicActivated(), true, "Viewport panoramic activated.");

			for (var i = 0; i < 30; ++i) {
				lookAround(1.2);
			}
			assert.equal(viewport.getViewInfo().camera.fieldOfView, 5, "Zoom in camera field of view limit - 5.");

			for (var k = 0; k < 100; ++k) {
				lookAround(0.9);
			}
			assert.equal(viewport.getViewInfo().camera.fieldOfView, 90, "Zoom out camera field of view limit - 90.");
			assert.ok(nativeCamera.position.equals(new THREE.Vector3(0, 0, 0)), "Camera position keep unchanged.");

			done();
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
