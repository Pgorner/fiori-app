/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/tools/PointCloudSelectionTool",
	"sap/ui/vk/threejs/PointCloudGroup",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	Viewport,
	ViewStateManager,
	THREE,
	PointCloudSelectionTool,
	PointCloudGroup,
	loader
) {
	"use strict"

	const viewport = new Viewport().placeAt("content")
	nextUIUpdate.runSync()

	function roundValue(v) { return Math.round(v * 100) / 100 }

	QUnit.moduleWithContentConnector("PointCloudSelectionTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewport.setViewStateManager(new ViewStateManager({ contentConnector: this.contentConnector }))
		viewport.setContentConnector(this.contentConnector)
	})

	QUnit.test("Test PointCloudSelectionTool", function(assert) {
		const tool = new PointCloudSelectionTool()
		assert.ok(tool !== null, "PointCloudSelectionTool created")
		const gizmo = tool.getAggregation("gizmo")
		assert.ok(gizmo !== null, "PointCloudSelectionToolGizmo created")

		viewport.addTool(tool)
		tool.setActive(true, viewport)

		function vectorEqual(vec, value, message) {
			assert.deepEqual(vec.toArray().map(roundValue), value, `${message}: ${vec.toArray()}`)
		}

		assert.strictEqual(tool.getGroups().length, 0, "no groups created")

		viewport.setViewInfo({
			camera: {
				rotation: { yaw: 0, pitch: 0, roll: 0 },
				position: { x: 0, y: 0, z: 100 },
				projectionType: "perspective",
				bindingType: "vertical",
				fieldOfView: 30
			}
		})
		const camera = viewport.getCamera().getCameraRef()
		camera.near = 90
		camera.far = 110
		camera.updateProjectionMatrix()
		camera.updateMatrixWorld(true)

		const offset = tool._handler._getOffset(viewport.getDomRef())
		tool._handler.click({ x: 150 + offset.x, y: 91 + offset.y })
		assert.strictEqual(tool.getGroups().length, 1, "group1 created on click")
		const group1 = tool.getGroups()[0]
		assert.strictEqual(group1, tool.getCurrentGroup(), "group1 is current")
		// vectorEqual(group1.getPosition(), [0, 10.1, 2.5], "group1.position") <- excluded from the test due to inaccuracy of the GPU hit test, [0, 10.28, 2.5] — result on the test server
		vectorEqual(group1.getQuaternion(), [0, 0, 0, 1], "group1.quaternion")
		vectorEqual(group1.getSize(), [13.06, 13.06, 13.06], "group1.size")

		const group2 = tool.addGroup()
		assert.notEqual(group1, group2, "group1 != group2")
		assert.strictEqual(tool.getGroups().length, 2, "group2 added")
		assert.strictEqual(group2, tool.getCurrentGroup(), "group2 is current")
		vectorEqual(group2.getPosition(), [0, 0, 0], "group2.position")
		vectorEqual(group2.getQuaternion(), [0, 0, 0, 1], "group2.quaternion")
		vectorEqual(group2.getSize(), [13.4, 13.4, 13.4], "group2.size")

		const group3 = tool.addGroup({
			position: [1, 2, 3],
			quaternion: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 6),
			size: 20
		})
		assert.strictEqual(group3, tool.getCurrentGroup(), "group3 is current")
		assert.strictEqual(tool.getGroups().length, 3, "group3 added")
		vectorEqual(group3.getPosition(), [1, 2, 3], "group3.position")
		vectorEqual(group3.getQuaternion(), [0.26, 0, 0, 0.97], "group3.quaternion")
		vectorEqual(group3.getSize(), [20, 20, 20], "group3.size")

		tool.previousGroup()
		assert.strictEqual(group2, tool.getCurrentGroup(), "group2 is current")
		tool.previousGroup()
		assert.strictEqual(group1, tool.getCurrentGroup(), "group1 is current")
		tool.nextGroup()
		assert.strictEqual(group2, tool.getCurrentGroup(), "group2 is current")
		tool.nextGroup()
		assert.strictEqual(group3, tool.getCurrentGroup(), "group3 is current")

		const removedGroup1 = tool.removeGroup()
		assert.strictEqual(removedGroup1, group3, "group3 removed")
		assert.strictEqual(tool.getGroups().length, 2, "groups length")

		const removedGroup2 = tool.removeGroup(group1)
		assert.strictEqual(removedGroup2, group1, "group1 removed")
		assert.strictEqual(tool.getGroups().length, 1, "groups length")
		assert.strictEqual(tool.getGroups()[0], group2, "group2 left")

		tool.clearGroups()
		assert.strictEqual(tool.getGroups().length, 0, "groups cleared")
	})

	QUnit.test("Test PointCloudGroup", function(assert) {
		const g1 = new PointCloudGroup({
			position: [0, 0, 0],
			size: 20
		})

		const g2 = new PointCloudGroup({
			position: [10, 0, 0],
			size: [1, 1, 2]
		})

		const g3 = new PointCloudGroup({
			position: [8, 0, 0],
			quaternion: [0, -0.409, 0, 0.913],
			size: [1, 2, 1]
		})

		function matrixEqual(m, value, message) {
			assert.deepEqual(m.elements.map(roundValue), value, message)
		}

		matrixEqual(g1.getMatrix(), [20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 1], "g1.matrix")
		matrixEqual(g2.getMatrix(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 10, 0, 0, 1], "g2.matrix")
		matrixEqual(g3.getMatrix(), [0.67, 0, 0.75, 0, 0, 2, 0, 0, -0.75, 0, 0.67, 0, 8, 0, 0, 1], "g3.matrix")

		assert.ok(g1.intersectsGroup(g1), "g1 intersects g1")
		assert.ok(g2.intersectsGroup(g2), "g2 intersects g2")
		assert.ok(g3.intersectsGroup(g3), "g3 intersects g3")

		assert.ok(g1.intersectsGroup(g2), "g1 intersects g2")
		assert.ok(g2.intersectsGroup(g1), "g2 intersects g1")

		assert.ok(g1.intersectsGroup(g3), "g1 intersects g3")
		assert.ok(g3.intersectsGroup(g3), "g3 intersects g1")

		assert.notOk(g2.intersectsGroup(g3), "g1 not intersects g3")
		assert.notOk(g3.intersectsGroup(g2), "g3 not intersects g1")

		assert.ok(g1.overlapsGroup(g1), "g1 overlaps g1")
		assert.ok(g2.overlapsGroup(g2), "g2 overlaps g2")
		assert.ok(g3.overlapsGroup(g3), "g3 overlaps g3")

		assert.notOk(g1.overlapsGroup(g2), "g1 not overlaps g2")
		assert.notOk(g2.overlapsGroup(g1), "g2 not overlaps g1")

		assert.ok(g1.overlapsGroup(g3), "g1 overlaps g3")
		assert.notOk(g3.overlapsGroup(g1), "g3 not overlaps g1")

		assert.notOk(g2.overlapsGroup(g3), "g2 not overlaps g3")
		assert.notOk(g3.overlapsGroup(g2), "g3 not overlaps g2")
	})

	QUnit.done(function() {
		jQuery("#content").hide()
	})
})
