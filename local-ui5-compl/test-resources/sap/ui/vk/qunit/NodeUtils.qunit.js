/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/Scene",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/NodeUtils"
], function(
	jQuery,
	Scene,
	ViewStateManager,
	THREE,
	NodeUtils
) {
	"use strict";

	QUnit.test("NodeUtils.centerOfNodes", function(assert) {
		var done = assert.async();

		function testArray(a, b, message) {
			a.forEach(function(v, i) {
				assert.ok(Math.abs(v - b[i]) < 1e-5, message + " " + i + " (" + v + "=" + b[i] + ")");
			});
		}

		var nodeA = new THREE.Mesh(new THREE.CylinderGeometry(5, 4, 10, 16), new THREE.MeshBasicMaterial());
		nodeA.position.set(5, 10, 15);
		nodeA.updateMatrixWorld(true);

		var nodeB = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
		nodeB.position.set(-1, -2, -3);
		nodeB.updateMatrixWorld(true);

		var nodeC = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), new THREE.MeshBasicMaterial());
		nodeC.position.set(4, 3, 4);
		nodeC.updateMatrixWorld(true);

		// Create and add nodes to scene to test
		var nativeScene = new THREE.Scene();
		var scene = new Scene(nativeScene);
		nativeScene.add(nodeA);
		nativeScene.add(nodeB);
		nativeScene.add(nodeC);

		var viewStateManager = new ViewStateManager();
		viewStateManager._setScene(scene);
		viewStateManager.setSelectionStates([nodeA, nodeB, nodeC], [], false, true);

		testArray(NodeUtils.centerOfNodes([nodeA, nodeB], viewStateManager), [4, 6, 8], "A B");
		testArray(NodeUtils.centerOfNodes([nodeB, nodeC], viewStateManager), [3, 2, 2], "B C");
		testArray(NodeUtils.centerOfNodes([nodeA, nodeC], viewStateManager), [5, 7, 10], "A C");
		testArray(NodeUtils.centerOfNodes([nodeA, nodeB, nodeC], viewStateManager), [4, 6, 8], "A B C");

		var nodeGroup = new THREE.Group();
		nodeGroup.add(nodeA);
		nodeGroup.add(nodeB);
		nodeGroup.add(nodeC);

		testArray(NodeUtils.centerOfNodes([nodeGroup], viewStateManager), [4, 6, 8], "Node group");

		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
