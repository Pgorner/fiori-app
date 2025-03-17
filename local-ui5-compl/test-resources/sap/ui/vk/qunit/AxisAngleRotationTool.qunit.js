/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/tools/AxisAngleRotationTool",
	"sap/ui/vk/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	Viewport,
	ViewStateManager,
	AxisAngleRotationTool,
	THREE,
	loader
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager;
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	QUnit.moduleWithContentConnector("AxisAngleRotationTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Test snapping", function(assert) {
		const tool = new AxisAngleRotationTool();
		assert.ok(!!tool, "tool created");

		tool.setActive(true, viewport);
		tool.setEnableSnapping(true);
		assert.ok(tool.getEnableSnapping(), "snapping enabled");

		const node = viewport.getScene().getSceneRef().getObjectByName("Box")
		assert.ok(!!node, "Box found");
		viewStateManager.setSelectionStates(node, [], false, true);

		const gizmo = tool.getGizmo();
		gizmo.show(viewport, tool);

		const roundVector = (v) => v.toArray().map((v, i) => Math.round(v * 100) / 100);
		assert.deepEqual(roundVector(node.position), [0, 10, 0], "initial object position");
		assert.deepEqual(roundVector(node.quaternion), [0, 0, 0, 1], "initial object quaternion");

		node.position.set(20, 10, 10);
		node.updateMatrix();
		node.updateMatrixWorld(true);

		gizmo.beginGesture();
		gizmo._rotate(new THREE.Euler(0, 0, Math.PI / 2));
		gizmo.endGesture();

		assert.deepEqual(roundVector(node.position), [20, 10, 10], "position not changed");
		assert.deepEqual(roundVector(node.quaternion), [0, 0, 0, 1], "quaternion not changed");

		gizmo.beginGesture();
		gizmo._rotate(new THREE.Euler(Math.PI / 3, 0, 0));
		gizmo.endGesture();

		assert.deepEqual(roundVector(node.position), [20, 10, 10], "position not changed");
		assert.deepEqual(roundVector(node.quaternion), [0, 0.25, 0, 0.97], "new object quaternion");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
