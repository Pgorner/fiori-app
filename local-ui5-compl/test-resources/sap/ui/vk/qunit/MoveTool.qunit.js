/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/tools/MoveTool",
	"sap/ui/vk/tools/CoordinateSystem",
	"sap/ui/vk/tools/GizmoPlacementMode",
	"sap/ui/vk/tools/ToolNodeSet",
	"sap/ui/vk/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	Viewport,
	ViewStateManager,
	MoveTool,
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

	QUnit.moduleWithContentConnector("MoveTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
		viewport.render();
	});

	QUnit.test("Test snapping", function(assert) {
		const tool = new MoveTool();
		assert.ok(!!tool, "tool created");

		tool.setActive(true, viewport);
		tool.setCoordinateSystem(CoordinateSystem.Local);
		assert.strictEqual(tool.getCoordinateSystem(), CoordinateSystem.Local, "Local coordinate system set");
		tool.setPlacementMode(GizmoPlacementMode.ObjectCenter);
		assert.strictEqual(tool.getPlacementMode(), GizmoPlacementMode.ObjectCenter, "ObjectCenter placement mode set");
		tool.setEnableSnapping(true);
		assert.ok(tool.getEnableSnapping(), "snapping enabled");

		const node = viewport.getScene().getSceneRef().getObjectByName("Sphere")
		assert.ok(!!node, "Sphere found");
		viewStateManager.setSelectionStates(node, [], false, true);

		const gizmo = tool.getGizmo();
		gizmo.show(viewport, tool);

		const roundVector = (v) => v.toArray().map((v) => Math.round(v * 100) / 100);
		assert.deepEqual(roundVector(node.position), [0, -10, 0], "initial object position");

		gizmo.beginGesture();
		gizmo._move(new THREE.Vector3(15, 0, 0));
		gizmo.endGesture();

		assert.deepEqual(roundVector(node.position), [13.36, -10, 0], "new object position");
	});

	QUnit.test("Test node set selection", function(assert) {
		var tool = new MoveTool();
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

		var pos1 = torus.position.x;
		var pos2 = box.position.x;

		tool.move(-10, 0, 0);

		assert.equal(pos1, torus.position.x + 10, "Highlighted node has moved");
		assert.equal(pos2, box.position.x, "Outlined node has not moved");

		pos1 = torus.position.x;
		tool.setNodeSet(ToolNodeSet.Outline);
		tool.move(-10, 0, 0);

		assert.equal(pos1, torus.position.x, "Highlighted node has not moved");
		assert.equal(pos2, box.position.x + 10, "Outlined node has moved");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
