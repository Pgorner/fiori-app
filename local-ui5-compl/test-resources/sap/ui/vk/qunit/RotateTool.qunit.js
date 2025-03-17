/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/tools/RotateTool",
	"sap/ui/vk/tools/CoordinateSystem",
	"sap/ui/vk/tools/GizmoPlacementMode",
	"sap/ui/vk/tools/ToolNodeSet",
	"sap/ui/vk/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	Viewport,
	ViewStateManager,
	RotateTool,
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

	QUnit.moduleWithContentConnector("RotateTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Test snapping", function(assert) {
		const tool = new RotateTool();
		assert.ok(!!tool, "tool created");

		tool.setActive(true, viewport);
		tool.setCoordinateSystem(CoordinateSystem.World);
		assert.strictEqual(tool.getCoordinateSystem(), CoordinateSystem.World, "World coordinate system set");
		tool.setPlacementMode(GizmoPlacementMode.Custom); // center of rotation at point (0, 0, 0)
		assert.strictEqual(tool.getPlacementMode(), GizmoPlacementMode.Custom, "Custom placement mode set");
		tool.setEnableSnapping(true);
		assert.ok(tool.getEnableSnapping(), "snapping enabled");

		const node = viewport.getScene().getSceneRef().getObjectByName("Cylinder")
		assert.ok(!!node, "Cylinder found");
		viewStateManager.setSelectionStates(node, [], false, true);

		const gizmo = tool.getGizmo();
		gizmo.show(viewport, tool);

		const roundVector = (v) => v.toArray().map((v, i) => Math.round(v * 100) / 100);
		assert.deepEqual(roundVector(node.position), [-25, -10, 0], "initial object position");
		assert.deepEqual(roundVector(node.quaternion), [0, 0, 0, 1], "initial object quaternion");

		gizmo.beginGesture();
		gizmo._rotate(new THREE.Euler(0, Math.PI, 0));
		gizmo.endGesture();

		assert.deepEqual(roundVector(node.position), [22.6, -10, 10.69], "new object position");
		assert.deepEqual(roundVector(node.quaternion), [0, 0.98, 0, 0.22], "new object quaternion");
	});

	QUnit.test("Test node set selection", function(assert) {
		var tool = new RotateTool();
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

		var pos1 = torus.quaternion.x;
		var pos2 = box.quaternion.x;

		tool.rotate(1, 0, 0, 0);

		assert.notEqual(pos1, torus.quaternion.x, "Highlighted node has rotated");
		assert.equal(pos2, box.quaternion.x, "Outlined node has not rotated");

		pos1 = torus.quaternion.x;
		tool.setNodeSet(ToolNodeSet.Outline);
		tool.rotate(1, 0, 0, 0);

		assert.equal(pos1, torus.quaternion.x, "Highlighted node has not rotated");
		assert.notEqual(pos2, box.quaternion.x, "Outlined node has rotated");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
