/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/threejs/ParametricGenerators",
	"sap/ui/vk/tools/PoiManipulationTool",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/NodeContentType",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	Viewport,
	ViewStateManager,
	ParametricGenerators,
	PoiManipulationTool,
	THREE,
	NodeContentType,
	loader
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager;
	viewport.placeAt("content");
	nextUIUpdate.runSync();
	var nativeCamera;

	QUnit.moduleWithContentConnector("PoiManipulationTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
		nativeCamera = viewport.getCamera().getCameraRef();
		viewport.getCamera().setPosition([0, 0, 0]);
		nativeCamera.userData.rotate = true;
	});

	QUnit.test("Test Poi Tool", function(assert) {
		var done = assert.async();
		var sceneRef = viewport._getNativeScene();

		var tool = new PoiManipulationTool();
		assert.ok(tool !== null, "Tool created");
		tool.setActive(true, viewport);
		viewport.addTool(tool);

		var tloader = new THREE.TextureLoader();
		tloader.load("test-resources/sap/ui/vk/qunit/media/kitchen.jpg", function(texture) {
			var sphereMat = new THREE.MeshBasicMaterial();
			sphereMat.map = texture;
			sphereMat.side = THREE.DoubleSide;
			sphereMat.needsUpdate = true;
			assert.ok(texture.image !== undefined, "360Image scene loaded.");

			var sphere = ParametricGenerators.generateSphere({ radius: 1000 }, sphereMat);
			sphere._vkSetNodeContentType(NodeContentType.Background);
			assert.equal(sphere.userData.renderStage, -1, "Background node renderStage");
			var rootNode = sceneRef.children[0].children[0];
			rootNode.name = "RootNode";
			var backgroundNode = new THREE.Group();
			backgroundNode.name = "Background";
			backgroundNode._vkSetNodeContentType(NodeContentType.Background);
			backgroundNode.add(sphere);
			rootNode.add(backgroundNode);
			viewStateManager.fireVisibilityChanged();
			assert.equal(viewport._isPanoramicActivated(), true, "Viewport 360 scene activated.");

			var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy();

			var view1 = viewport.getScene().createView({
				name: "Background and symbol view",
				description: "Background and symbol nodes",
				viewId: "v123456"
			});
			viewStateManager._implementation.activateView(view1);

			var symbol1 = nodeHierarchy.createNode(sceneRef, "Symbol1", null, NodeContentType.Symbol);
			var symbol2 = nodeHierarchy.createNode(sceneRef, "Symbol2", null, NodeContentType.Symbol);
			assert.equal(symbol1.userData.renderStage, 1, "symbol1 renderStage");
			assert.equal(symbol2.userData.renderStage, 1, "symbol2 renderStage");
			view1.updateNodeInfos([{ target: symbol1 }, { target: symbol2 }]);
			var symbolNodes = viewStateManager.getSymbolNodes();
			assert.equal(symbolNodes.length, 2, "Add two Symbol Nodes: 2");

			assert.equal(tool.getSelectedPois().length, 0, "No poi symbol selected: 0");
			viewStateManager.setSelectionStates(symbol1, [], false);
			assert.equal(tool.getSelectedPois().length, 1, "One poi symbol selected: 1");

			var buttons = tool.getButtons();
			assert.equal(buttons.length, 2, "Two poi buttons created");

			tool.addButtons(new sap.m.Button({ icon: "sap-icon://delete" }));
			buttons = tool.getButtons().filter(function(btn) { return btn.getVisible(); });
			assert.equal(buttons.length, 1, "Add one new button");

			// Test viewStateManager gone
			viewport.setViewStateManager(null);
			tool._updateSelectedPoi();
			tool.setActive(false, viewport);
			assert.equal(viewport.getViewStateManager(), null, "Null ViewStateManager");
			done();
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
