/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/threejs/ContentManager",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/threejs/Scene",
	"sap/ui/vk/thirdparty/three"
], function(
	ContentManager,
	ContentResource,
	Scene,
	THREE
) {
	"use strict";

	function findNodeByName(name, node) {
		if (node.name === name) {
			return node;
		}
		for (var i = 0; i < node.children.length; ++i) {
			var result = findNodeByName(name, node.children[i]);
			if (result) {
				return result;
			}
		}
		return null;
	}

	QUnit.test("test contentChangesStarted event", function(assert) {
		var done = assert.async();
		var manager = new ContentManager();

		manager.attachEvent("contentChangesStarted", function() {
			assert.ok(true, "contentChangesStarted event fired.");
			done();
		});

		manager.loadContent(null, []);
	});

	QUnit.test("test contentChangesFinished event", function(assert) {
		var done = assert.async();
		var manager = new ContentManager();

		manager.attachEvent("contentChangesFinished", function() {
			assert.ok(true, "contentChangesFinished event fired.");
			done();
		});

		manager.loadContent(null, []);
	});


	QUnit.test("test that native scene doesn't get initialized twice.", function(assert) {
		var done = assert.async();
		var manager = new ContentManager();
		var scene = new Scene(new THREE.Scene());

		manager.attachEvent("contentChangesFinished", function(event) {
			var content = event.getParameter("content");

			assert.notEqual(content, null, "content is not null.");

			if (content) {
				var nativeScene = content.getSceneRef();
				assert.notEqual(nativeScene, null, "native scene is not null.");

				if (nativeScene) {
					assert.strictEqual(nativeScene.children.length, 0, "native scene has no children.");
				}
			}
			done();
		});

		manager.loadContent(scene, []);
	});

	QUnit.test("test native scene gets initialized when it gets created.", function(assert) {
		var done = assert.async();
		var manager = new ContentManager();

		manager.attachEvent("contentChangesFinished", function(event) {
			var content = event.getParameter("content");

			assert.notEqual(content, null, "content is not null.");

			if (content) {
				var scene = content.getSceneRef();
				assert.notEqual(scene, null, "native scene is not null.");

				if (scene) {
					assert.notStrictEqual(scene.children.length, 0, "scene has some children.");
				}
			}
			done();
		});

		manager.loadContent(null, []);
	});

	/*
	hierarchy modification sequence test:
		load ['cooper'] model -> check model loaded correctly by inspecting nodes
		load ['arbor_press'] model -> check 'cooper' model's node is absent and 'arbor_press' nodes are present
		load ['arbor_press, 'drop_saw'] models -> check both models nodes are present
		load ['arbor press' -> 'drop saw', 'drop saw' -> 'arbor press'] models check nodes for all 4 models are present
		load ['arbor_press'] model -> check model nodes are present
		load [] model -> check scene is empty
	*/
	QUnit.test("test hierarchy changes apply correctly.", function(assert) {
		var done = assert.async();
		var manager = new ContentManager();

		function checkStepSix(event) {
			assert.ok(true, "STEP #6 STARTED.");
			var content = event.getParameter("content");
			assert.notEqual(content, null, "content is not null.");

			if (content) {
				var scene = content.getSceneRef();
				assert.notEqual(scene, null, "native scene is not null.");

				if (scene) {
					assert.strictEqual(scene.children.length, 1, "scene is empty.");
				}
			}
			done();
		}

		function checkStepFive(event) {
			assert.ok(true, "STEP #5 STARTED.");

			var content = event.getParameter("content");
			assert.notEqual(content, null, "content is not null.");

			if (content) {
				var scene = content.getSceneRef();
				assert.notEqual(scene, null, "native scene is not null.");

				if (scene) {
					var node1 = findNodeByName("press #1", scene);
					var node2 = findNodeByName("Arbor_Press.iam", scene);

					assert.notEqual(node1, null, "scene contains 'press #1' node.");
					assert.notEqual(node2, null, "scene contains 'Arbor_Press.iam' node.");

					if (node1 && node2) {
						manager.attachEventOnce("contentChangesFinished", checkStepSix);
						manager.loadContent(content, []);
						return;
					}
				}
			}
			done();
		}

		function checkStepFour(event) {
			assert.ok(true, "STEP #4 STARTED.");

			var content = event.getParameter("content");
			assert.notEqual(content, null, "content is not null.");

			if (content) {
				var scene = content.getSceneRef();
				assert.notEqual(scene, null, "native scene is not null.");

				if (scene) {
					var node1 = findNodeByName("press #1", scene);
					var node2 = findNodeByName("press #2", scene);
					var node3 = findNodeByName("saw #1", scene);
					var node4 = findNodeByName("saw #2", scene);

					assert.notEqual(node1, null, "scene contains 'press #1' node.");
					assert.notEqual(node2, null, "scene contains 'press #2' node.");
					assert.notEqual(node3, null, "scene contains 'saw #1' node.");
					assert.notEqual(node4, null, "scene contains 'saw #2' node.");

					if (node1 && node2 && node3 && node4) {
						manager.attachEventOnce("contentChangesFinished", checkStepFive);
						manager.loadContent(content, [new ContentResource({
							source: "test-resources/sap/ui/vk/qunit/media/arbor_press.vds",
							sourceType: "vds4",
							name: "press #1"
						})]);
						return;
					}
				}
			}
			done();
		}

		function checkStepThree(event) {
			assert.ok(true, "STEP #3 STARTED.");

			var content = event.getParameter("content");
			assert.notEqual(content, null, "content is not null.");

			if (content) {
				var scene = content.getSceneRef();
				assert.notEqual(scene, null, "native scene is not null.");

				if (scene) {
					var node1 = findNodeByName("press #1", scene);
					var node2 = findNodeByName("Arbor_Press.iam", scene);
					var node3 = findNodeByName("saw #1", scene);
					var node4 = findNodeByName("A0401001", scene);

					assert.notEqual(node1, null, "scene contains 'press #1' node.");
					assert.notEqual(node2, null, "scene contains 'Arbor_Press.iam' node.");
					assert.notEqual(node3, null, "scene contains 'saw #1' node.");
					assert.notEqual(node4, null, "scene contains 'A0401001' node.");

					if (node1 && node2 && node3 && node4) {
						var press1 = new ContentResource({
							source: "test-resources/sap/ui/vk/qunit/media/arbor_press.vds",
							sourceType: "vds4",
							name: "press #1"
						});

						var saw1 = new ContentResource({
							source: "test-resources/sap/ui/vk/qunit/media/drop_saw.vds",
							sourceType: "vds4",
							name: "saw #1"
						});

						press1.addContentResource(new ContentResource({
							source: "test-resources/sap/ui/vk/qunit/media/drop_saw.vds",
							sourceType: "vds4",
							name: "saw #2"
						}));

						saw1.addContentResource(new ContentResource({
							source: "test-resources/sap/ui/vk/qunit/media/arbor_press.vds",
							sourceType: "vds4",
							name: "press #2"
						}));

						manager.attachEventOnce("contentChangesFinished", checkStepFour);
						manager.loadContent(content, [press1, saw1]);
						return;
					}
				}
			}
			done();
		}

		function checkStepTwo(event) {
			assert.ok(true, "STEP #2 STARTED.");

			var content = event.getParameter("content");
			assert.notEqual(content, null, "content is not null.");

			if (content) {
				var scene = content.getSceneRef();
				assert.notEqual(scene, null, "native scene is not null.");

				if (scene) {
					var node1 = findNodeByName("cooper #1", scene);
					var node2 = findNodeByName("press #1", scene);
					var node3 = findNodeByName("Arbor_Press.iam", scene);

					assert.equal(node1, null, "scene doesn't contains 'cooper #1' node.");
					assert.notEqual(node2, null, "scene contains 'press #1' node.");
					assert.notEqual(node3, null, "scene contains 'Arbor_Press.iam' node.");

					if (!node1 && node2 && node3) {
						manager.attachEventOnce("contentChangesFinished", checkStepThree);
						manager.loadContent(content, [
							new ContentResource({
								source: "test-resources/sap/ui/vk/qunit/media/arbor_press.vds",
								sourceType: "vds4",
								name: "press #1"
							}),
							new ContentResource({
								source: "test-resources/sap/ui/vk/qunit/media/drop_saw.vds",
								sourceType: "vds4",
								name: "saw #1"
							})
						]);
						return;
					}
				}
			}
			done();
		}

		function checkStepOne(event) {
			assert.ok(true, "STEP #1 STARTED.");

			var content = event.getParameter("content");
			assert.notEqual(content, null, "content is not null.");

			if (content) {
				var scene = content.getSceneRef();
				assert.notEqual(scene, null, "native scene is not null.");

				if (scene) {
					var node1 = findNodeByName("cooper #1", scene);
					var node2 = findNodeByName("COOPER PB-ASY-IN", scene);

					assert.notEqual(node1, null, "scene contains 'cooper #1' node.");
					assert.notEqual(node2, null, "scene contains 'COOPER PB-ASY-IN' node.");

					if (node1 && node1) {
						manager.attachEventOnce("contentChangesFinished", checkStepTwo);
						manager.loadContent(content, [new ContentResource({
							source: "test-resources/sap/ui/vk/qunit/media/arbor_press.vds",
							sourceType: "vds4",
							name: "press #1"
						})]);
						return;
					}
				}
			}
			done();
		}

		manager.attachEventOnce("contentChangesFinished", checkStepOne);
		manager.loadContent(null, [new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/cooper.vds",
			sourceType: "vds4",
			name: "cooper #1"
		})]);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
