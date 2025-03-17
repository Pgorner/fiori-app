/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/tools/ScaleTool",
	"sap/ui/vk/tools/CoordinateSystem",
	"sap/ui/vk/tools/GizmoPlacementMode",
	"sap/ui/vk/tools/ToolNodeSet",
	"sap/ui/vk/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	Viewport,
	ViewStateManager,
	ScaleTool,
	CoordinateSystem,
	GizmoPlacementMode,
	ToolNodeSet,
	THREE,
	loader
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager;
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	QUnit.moduleWithContentConnector("ScaleTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Test snapping", function(assert) {
		const tool = new ScaleTool();
		assert.ok(!!tool, "tool created");

		tool.setActive(true, viewport);
		tool.setCoordinateSystem(CoordinateSystem.World);
		assert.strictEqual(tool.getCoordinateSystem(), CoordinateSystem.World, "World coordinate system set");
		tool.setPlacementMode(GizmoPlacementMode.Default);
		assert.strictEqual(tool.getPlacementMode(), GizmoPlacementMode.Default, "Default placement mode set");
		tool.setEnableSnapping(true);
		assert.ok(tool.getEnableSnapping(), "snapping enabled");

		const node = viewport.getScene().getSceneRef().getObjectByName("Sphere");
		assert.ok(!!node, "Sphere found");
		viewStateManager.setSelectionStates(node, [], false, true);

		const gizmo = tool.getGizmo();
		gizmo.show(viewport, tool);

		const roundVector = (v) => v.toArray().map((v, i) => Math.round(v * 100) / 100);
		assert.deepEqual(roundVector(node.position), [0, -10, 0], "initial object position");
		assert.deepEqual(roundVector(node.scale), [1, 1, 1], "initial object scale");

		gizmo.beginGesture();
		gizmo._scale(new THREE.Vector3(4, 4, 4));
		gizmo.endGesture();

		assert.deepEqual(roundVector(node.position), [0, -10, 0], "object position not changed");
		assert.deepEqual(roundVector(node.scale), [2.88, 2.88, 2.88], "new object scale");
	});

	QUnit.test("Test node set selection", function(assert) {
		var tool = new ScaleTool();
		assert.ok(tool !== null, "Tool created");
		tool.setActive(true, viewport);
		viewport.addTool(tool);

		var torus = viewStateManager.getNodeHierarchy().findNodesByName({ value: "Torus1" })[0];
		var box = viewStateManager.getNodeHierarchy().findNodesByName({ value: "Box" })[0];

		viewStateManager.setSelectionStates([torus], []);
		viewStateManager.setOutliningStates([box], []);

		assert.equal(viewStateManager.getSelectionState(torus), true, "Torus is selected");
		assert.equal(viewStateManager.getOutliningState(torus), false, "Torus is not outlined");

		assert.equal(viewStateManager.getSelectionState(box), false, "Box is not selected");
		assert.equal(viewStateManager.getOutliningState(box), true, "Box is outlined");

		assert.equal(torus.scale.x, 1, "Original torus scale is 1");
		assert.equal(box.scale.x, 1, "Original box scale is 1");

		tool.scale(5, 0, 0);

		assert.equal(torus.scale.x, 5, "Highlighted node has scaled");
		assert.equal(box.scale.x, 1, "Outlined node has not scaled");

		tool.setNodeSet(ToolNodeSet.Outline);
		tool.scale(5, 0, 0);

		assert.equal(torus.scale.x, 5, "Highlighted node has not scaled");
		assert.equal(box.scale.x, 5, "Outlined node has scaled");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
