/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/Scene",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/colorToCSSColor",
	"sap/ui/vk/colorToABGR",
	"sap/ui/vk/AnimationPlayer",
	"sap/ui/vk/ViewManager",
	"sap/ui/vk/AnimationPlayback",
	"sap/ui/vk/AnimationTrackType",
	"sap/ui/vk/NodeContentType",
	"test-resources/sap/ui/vk/qunit/utils/UI5Utils",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/threejs/SceneBuilder"
], function(
	jQuery,
	Scene,
	ViewStateManager,
	THREE,
	colorToCSSColor,
	colorToABGR,
	AnimationPlayer,
	ViewManager,
	AnimationPlayback,
	AnimationTrackType,
	NodeContentType,
	UI5Utils,
	ModuleWithContentConnector,
	SceneBuilder
) {
	"use strict";

	var getAllChildMeshNodes = function(parent, meshNodes) {
		if (parent && parent instanceof THREE.Mesh) {
			meshNodes.push(parent);
		}

		if (parent && parent.children && parent.children.length > 0) {
			var oi;
			for (oi = 0; oi < parent.children.length; oi += 1) {
				getAllChildMeshNodes(parent.children[oi], meshNodes);
			}
		}
	};

	var getAllChildNodes = function(parent, childNodes) {
		if (parent && !(parent.geometry && (parent.name === "" || parent.name === undefined))) {
			childNodes.push(parent);
		}

		if (parent && parent.children && parent.children.length > 0) {
			var oi;
			for (oi = 0; oi < parent.children.length; oi += 1) {
				getAllChildNodes(parent.children[oi], childNodes);
			}
		}
	};

	var getParentNodeWithMoreThanOneMeshes = function(object) {
		while (object && object.parent) {
			var meshNodes = [];
			getAllChildMeshNodes(object.parent, meshNodes);
			if (meshNodes.length > 2) {
				return object.parent;
			}
			object = object.parent;
		}
	};

	QUnit.module("threejs.ViewStateManager", {

		afterEach: function() {
			if (this.viewStateManager) {
				this.viewStateManager.destroy();
			}
		}
	});

	QUnit.test("Three JS ViewStateManager", function(assert) {
		var done = assert.async();
		var test = 0;

		var testVisibility = function(viewStateManager, originallySelectedNode) {
			viewStateManager.setVisibilityState(originallySelectedNode, true, false);
			assert.deepEqual(viewStateManager.getVisibilityState(originallySelectedNode), true, "Setting visibility true");

			viewStateManager.setVisibilityState(originallySelectedNode, false, false);
			assert.deepEqual(viewStateManager.getVisibilityState(originallySelectedNode), false, "Setting visibility false");

			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			var children = [];
			getAllChildNodes(parent, children);

			viewStateManager.setVisibilityState(parent, true, true);
			viewStateManager.getVisibilityState(children).forEach(function(state) {
				assert.deepEqual(state, true, "Setting visibility true recursively");
			});

			viewStateManager.setVisibilityState(parent, false, true);
			viewStateManager.getVisibilityState(children).forEach(function(state) {
				assert.deepEqual(state, false, "Setting visibility false recursively");
			});

			// TODO - call getVisibilityChanges to test VEIDs of changed nodes
		};

		var getCurrentOpacity = function(nodeRef) {
			if (nodeRef.material) {
				return nodeRef.material.opacity;
			}
		};

		var testOpacity = function(viewStateManager, originallySelectedNode) {
			var originalOpacity = getCurrentOpacity(originallySelectedNode);
			var opacity = 0.5;

			viewStateManager.setOpacity(originallySelectedNode, opacity, false);
			var returnedOpacity = viewStateManager.getOpacity(originallySelectedNode);
			var currentOpacity = getCurrentOpacity(originallySelectedNode);
			assert.ok(Math.abs(opacity - returnedOpacity) < 0.0000001 && Math.abs(opacity - currentOpacity) < 0.0000001, "Setting opacity works ok");

			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			var children = [];
			getAllChildNodes(parent, children);

			viewStateManager.setOpacity(originallySelectedNode, null, false);
			returnedOpacity = viewStateManager.getOpacity(originallySelectedNode);
			currentOpacity = getCurrentOpacity(originallySelectedNode);
			assert.ok(returnedOpacity == null && Math.abs(originalOpacity - currentOpacity) < 0.0000001, "Removing opacity works ok");
		};

		var getCurrentColor = function(nodeRef) {
			if (nodeRef && nodeRef.material) {
				var color = {
					red: Math.round(nodeRef.material.color.r * 255),
					green: Math.round(nodeRef.material.color.g * 255),
					blue: Math.round(nodeRef.material.color.b * 255),
					alpha: nodeRef.material.opacity
				};
				return colorToABGR(color);
			}
		};

		var testTintColor = function(viewStateManager, originallySelectedNode) {
			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			var children = [];
			getAllChildNodes(parent, children);
			var originalNodeColor = getCurrentColor(originallySelectedNode);

			var color = { red: 255, green: 150, blue: 0, alpha: 1 };
			var colorRGBA = colorToABGR(color);

			viewStateManager.setTintColor(originallySelectedNode, colorRGBA, false);
			var returnedColor = viewStateManager.getTintColor(originallySelectedNode, true);
			var currentNodeColor = getCurrentColor(originallySelectedNode);
			assert.ok(colorRGBA == returnedColor && colorRGBA == currentNodeColor, "Setting tint color works ok");

			viewStateManager.setTintColor(parent, colorRGBA, true);
			var colorOK = true;
			var ni;
			for (ni = 0; ni < children.length; ni++) {
				var returnColor = viewStateManager.getTintColor(children[ni], true);
				currentNodeColor = getCurrentColor(children[ni]);

				if (returnColor && returnColor !== colorRGBA) {
					colorOK = false;
				}

				if (currentNodeColor && currentNodeColor !== colorRGBA) {
					colorOK = false;
				}
			}
			assert.ok(colorOK, "Setting tint color recursively works ok");

			viewStateManager.setTintColor(originallySelectedNode, null, false);
			returnedColor = viewStateManager.getTintColor(originallySelectedNode, true);
			currentNodeColor = getCurrentColor(originallySelectedNode);
			assert.ok(returnedColor == undefined && originalNodeColor == currentNodeColor, "Removing tint color works ok");

			viewStateManager.setTintColor(parent, null, true);
			colorOK = true;
			for (ni = 0; ni < children.length; ni++) {
				var returnTintColor = viewStateManager.getTintColor(children[ni], true);
				currentNodeColor = getCurrentColor(children[ni]);

				if (returnTintColor) {
					colorOK = false;
				}

				if (currentNodeColor && currentNodeColor === colorRGBA) {
					colorOK = false;
				}
			}
			assert.ok(colorOK, "Removing tint color recursively works ok");
		};

		var testSelection = function(viewStateManager, originallySelectedNode, testNodeName) {
			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			var children = [];
			getAllChildNodes(parent, children);
			var originalNodeColor = getCurrentColor(originallySelectedNode);
			var highlightingColor = 0xFF123456;
			viewStateManager.setHighlightColor(highlightingColor);

			viewStateManager.setSelectionStates(originallySelectedNode, [], false);
			var currentNodeColor = getCurrentColor(originallySelectedNode);
			var selected = viewStateManager.getSelectionState(originallySelectedNode);
			assert.ok(selected && highlightingColor == currentNodeColor, "Selecting signal node works ok");

			viewStateManager.setSelectionStates([], originallySelectedNode, false);
			currentNodeColor = getCurrentColor(originallySelectedNode);
			selected = viewStateManager.getSelectionState(originallySelectedNode);
			assert.ok(!selected && originalNodeColor == currentNodeColor, "Deselecting signal node works ok");

			viewStateManager.setSelectionStates(parent, [], true);
			var colorOK = true;
			var ni;
			for (ni = 0; ni < children.length; ni++) {
				selected = viewStateManager.getSelectionState(children[ni]);
				currentNodeColor = getCurrentColor(children[ni]);

				if (!selected) {
					colorOK = false;
				}

				if (currentNodeColor && currentNodeColor !== highlightingColor) {
					colorOK = false;
				}
			}
			assert.ok(colorOK, "Selecting recursively works ok");

			viewStateManager.setSelectionStates([], parent, true);
			colorOK = true;
			for (ni = 0; ni < children.length; ni++) {
				selected = viewStateManager.getSelectionState(children[ni]);
				currentNodeColor = getCurrentColor(children[ni]);

				if (selected) {
					colorOK = false;
				}

				if (currentNodeColor && currentNodeColor !== originalNodeColor) {
					colorOK = false;
				}
			}
			assert.ok(colorOK, "Deselecting recursively works ok");

			var nodes = [parent.parent, parent, parent.children[0], parent.children[1], parent.children[2]];

			viewStateManager.setSelectionStates([], nodes[0], true);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [false, false, false, false, false], "All nodes are deselected.");

			viewStateManager.setSelectionStates(nodes[0], [], false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [true, false, false, false, false], "Only the root parent is selected.");

			viewStateManager.setRecursiveSelection(true);
			viewStateManager.setSelectionStates(nodes[0], [], false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [true, true, true, true, true], "All nodes are selected.");

			viewStateManager.setRecursiveSelection(false);
			viewStateManager.setSelectionStates([], nodes[3], false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [true, true, true, false, true], "Only one child is deselected.");

			viewStateManager.setRecursiveSelection(true);
			viewStateManager.setSelectionStates([], nodes[3], false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [false, false, true, false, true], "One child and ancestors are deselected.");

			viewStateManager.setSelectionStates(nodes[3], [], false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [false, false, true, true, true], "Children are selected, ancestors are deselected.");
		};

		var testOutlining = function(viewStateManager, topNode) {

			viewStateManager.setOutlineColor(0x00FFFF00);
			var outliningColor = viewStateManager.getOutlineColor(true);
			var cssOutlineColor = viewStateManager.getOutlineColor(false);
			assert.ok(outliningColor === 0x00FFFF00 && cssOutlineColor === "rgba(0,255,255,0)", "Outline color is ok");

			viewStateManager.setOutlineWidth(2.0);
			var outliningWidth = viewStateManager.getOutlineWidth();
			assert.ok(outliningWidth === 2.0, "Outline width is ok");

			viewStateManager.setOutliningStates(topNode, [], false, true);
			assert.deepEqual(viewStateManager.getOutliningState(topNode), true, "One node is outlined.");

			viewStateManager.setOutliningStates([], topNode, false, true);
			assert.deepEqual(viewStateManager.getOutliningState(topNode), false, "One node is un-outlined.");

			var children = [];
			getAllChildNodes(topNode, children);

			var i;
			var outlined = [];
			var unoutlined = [];
			for (i = 0; i < children.length; i++) {
				outlined.push(true);
				unoutlined.push(false);
			}

			viewStateManager.setOutliningStates(children, [], false, true);
			assert.deepEqual(viewStateManager.getOutliningState(children), outlined, "Multiple nodes are outlined.");

			viewStateManager.setOutliningStates([], children, false, true);
			assert.deepEqual(viewStateManager.getOutliningState(children), unoutlined, "Multiple nodes are un-outlined.");

			viewStateManager.setOutliningStates(topNode, [], true, false);
			assert.deepEqual(viewStateManager.getOutliningState(children), outlined, "Nodes are outlined recursively.");

			viewStateManager.setOutliningStates([], topNode, true, false);
			assert.deepEqual(viewStateManager.getOutliningState(children), unoutlined, "Nodes are unoutlined recursively.");
		};

		var testLightingColor = function(viewStateManager) {

			var originalColor = { red: 255, green: 0, blue: 0, alpha: 1.0 };
			var setColor = { red: 10, green: 50, blue: 50, alpha: 0.4 };

			var originalColorRBGA = colorToABGR(originalColor);
			var setColorRBGA = colorToABGR(setColor);

			var originalColorCSS = colorToCSSColor(originalColor);
			var setColorCSS = colorToCSSColor(setColor);

			assert.equal(viewStateManager.getHighlightColor(true), originalColorRBGA, "Original highligh color RBGA is ok");
			assert.equal(viewStateManager.getHighlightColor(), originalColorCSS, "Original highligh color CSS is ok");

			viewStateManager.setHighlightColor(setColorRBGA);
			assert.equal(viewStateManager.getHighlightColor(true), setColorRBGA, "Setting highlighting color RBGA is ok");

			viewStateManager.setHighlightColor(originalColorRBGA);
			assert.equal(viewStateManager.getHighlightColor(true), originalColorRBGA, "Restore highlighting color RBGA is ok");

			viewStateManager.setHighlightColor(setColorCSS);
			assert.equal(viewStateManager.getHighlightColor(true), setColorRBGA, "Setting highlighting color CSS is ok");
		};

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			// use the last mesh node as the selected node
			var meshNodes = [];
			getAllChildMeshNodes(nativeScene, meshNodes);
			var originallySelectedNode = meshNodes[meshNodes.length - 1];

			// find the parent of the selected node
			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			// find all the children of parent node
			var selectedNodesWithCallback = [];
			getAllChildMeshNodes(parent, selectedNodesWithCallback);

			testVisibility(viewStateManager, originallySelectedNode);
			testOpacity(viewStateManager, originallySelectedNode);
			testTintColor(viewStateManager, originallySelectedNode);
			testLightingColor(viewStateManager);
			testSelection(viewStateManager, originallySelectedNode);

			testOutlining(viewStateManager, obj);

			viewStateManager.destroy();
			viewStateManager = null;
			test++;
			if (test === 2) {
				done();
			}
		};

		var loader = new THREE.ObjectLoader();
		var that = this;
		loader.load("test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", testFunction);
		loader.load("test-resources/sap/ui/vk/qunit/media/chair.json", testFunction);
	});

	QUnit.test("BulkOperations - visibility", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var meshNodes = [];
			getAllChildMeshNodes(nativeScene, meshNodes);

			var currentVisibility = viewStateManager.getVisibilityState(meshNodes);
			var makeVisibleCount = 0, makeHiddenCount = 0;
			var invertedVisibility = currentVisibility.map(function(item) {
				if (!item) {
					makeVisibleCount++;
				} else {
					makeHiddenCount++;
				}

				return !item;
			});

			viewStateManager.attachEventOnce("visibilityChanged", function(event) {
				var visible = event.getParameter("visible");
				var hidden = event.getParameter("hidden");

				assert.ok(Array.isArray(visible), "visible event parameter ok");
				assert.ok(visible.length === makeVisibleCount, "visible element count ok");
				assert.ok(Array.isArray(hidden), "hidden event parameter ok");
				assert.ok(hidden.length === makeHiddenCount, "hidden element count ok");

				done();
			});

			viewStateManager.setVisibilityState(meshNodes, invertedVisibility);
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", testFunction);

	});

	QUnit.test("BulkOperations - opacity", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var meshNodes = [];
			getAllChildMeshNodes(nativeScene, meshNodes);

			var currentOpacity = viewStateManager.getOpacity(meshNodes);
			var changedNodesCount = Math.min(3, currentOpacity.length);

			var changedOpacity = currentOpacity.map(function(item, idx) {
				if (idx >= changedNodesCount) {
					return item;
				}
				return idx;
			});

			viewStateManager.attachEventOnce("opacityChanged", function(event) {
				var changed = event.getParameter("changed");
				var opacity = event.getParameter("opacity");

				assert.ok(Array.isArray(changed), "nodes array ok");
				assert.equal(changed.length, changedNodesCount, "nodes array element count ok");
				assert.ok(Array.isArray(opacity), "opacity array ok");
				assert.equal(opacity.length, changedNodesCount, "opacity array count ok");

				done();
			});

			viewStateManager.setOpacity(meshNodes, changedOpacity);
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", testFunction);

	});

	QUnit.test("BulkOperations - tint color", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var meshNodes = [];
			getAllChildMeshNodes(nativeScene, meshNodes);

			var currentTint = viewStateManager.getTintColor(meshNodes);
			var changedNodesCount = Math.min(3, currentTint.length);

			var changedTint = currentTint.map(function(item, idx) {
				if (idx >= changedNodesCount) {
					return item;
				}
				return idx;
			});

			viewStateManager.attachEventOnce("tintColorChanged", function(event) {
				var changed = event.getParameter("changed");
				var tintColor = event.getParameter("tintColor");
				var tintColorABGR = event.getParameter("tintColorABGR");

				assert.ok(Array.isArray(changed), "nodes array ok");
				assert.equal(changed.length, changedNodesCount, "nodes array element count ok");
				assert.ok(Array.isArray(tintColor), "tint color array ok");
				assert.equal(tintColor.length, changedNodesCount, "tint color array count ok");
				assert.ok(Array.isArray(tintColorABGR), "tint color ABGR array ok");
				assert.equal(tintColorABGR.length, changedNodesCount, "tint color ABGR array count ok");

				done();
			});

			viewStateManager.setTintColor(meshNodes, changedTint);
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", testFunction);

	});

	QUnit.test("three.js ViewStateManager.setJoints", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var nodes = [];
			for (var i = 5; i < 32; i++) {
				nodes[i] = obj.getObjectByName("Box #" + i);
			}

			var joints = [
				{
					node: nodes[7],  // (7) < 23 < (6) < 25
					parent: nodes[23]
				}, {
					node: nodes[14], // (14) < (22) < 18 < (10) < 11
					parent: nodes[22]
				}, {
					node: nodes[6],  // (6) < 25
					parent: nodes[25]
				}, {
					node: nodes[22], // (22) < 18 < (10) < 11
					parent: nodes[18]
				}, {
					node: nodes[10], // (10) < 11
					parent: nodes[11]
				}, {
					node: nodes[12], // (12) < 17 < 16 < (10) < 11
					parent: nodes[17]
				}
			];
			viewStateManager.setJoints(joints);

			function testArrayOfNodes(a, b, message) {
				assert.deepEqual(typeof a, typeof b, message);
				if (b) {
					assert.deepEqual(a.length, b.length, message);
					b.forEach(function(node, index) {
						assert.deepEqual(a[index].name, node.name, message + index);
					});
				}
			}

			function indexToNode(index) {
				return nodes[index];
			}

			function testNodePosition(node, x, y, z, message) {
				assert.deepEqual(node.matrixWorld.elements[12], x, message + " x");
				assert.deepEqual(node.matrixWorld.elements[13], y, message + " y");
				assert.deepEqual(node.matrixWorld.elements[14], z, message + " z");
			}

			var order = [6, 7, 10, 22, 14, 12].map(indexToNode);
			var nodesToUpdate = [[23].map(indexToNode), undefined, [18, 16, 17].map(indexToNode), undefined, undefined, undefined];
			joints = viewStateManager.getJoints();
			assert.deepEqual(joints.length, order.length, "VSM joint count");
			joints.forEach(function(joint, index) {
				assert.deepEqual(joint.node.name, order[index].name, "joints[" + index + "] order test");
				testArrayOfNodes(joint.nodesToUpdate, nodesToUpdate[index], "joints[" + index + "] nodesToUpdate test");
			});

			nativeScene.updateMatrixWorld(true);
			testNodePosition(nodes[6], 0, 0, 50, "nodes[6] origin position");       // 5 > 6 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[7], 0, 50, 50, "nodes[7] origin position");      // 5 > 7 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[11], 0, 0, 50, "nodes[10] origin position");     // 5 > 11 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[10], 0, 0, 50, "nodes[10] origin position");     // 5 > 10 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[22], 0, 50, 50, "nodes[22] origin position");    // 6 > 22 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[23], 0, 50, 50, "nodes[23] origin position");    // 6 > 23 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[16], 0, 0, 50, "nodes[16] origin position");     // 10 > 16 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[17], 0, 50, 50, "nodes[17] origin position");    // 16 > 17 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[18], 0, 50, 50, "nodes[18] origin position");    // 10 > 18 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[12], 0, -100, -10, "nodes[12] origin position"); // 5 > 9 > 12 {x: 0, y: 0, z: -60}
			testNodePosition(nodes[14], 0, -100, 50, "nodes[14] origin position");  // 9 > 14 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[25], 0, 50, 50, "nodes[25] origin position");    // 9 > 13 > 25 {x: 0, y: 160, z: 100}


			var transforms = {
				nodeRefs: [],
				positions: []
			};

			joints.forEach(function(joint) {
				transforms.nodeRefs.push(joint.node);
				transforms.positions.push(joint);
			});
			viewStateManager.setTransformation(transforms.nodeRefs, transforms.positions);
			viewStateManager._setJointNodeMatrix();

			testNodePosition(nodes[6], 0, 0, 50, "nodes[6] origin position");       // 5 > 6 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[7], 0, 50, 50, "nodes[7] origin position");      // 5 > 7 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[11], 0, 0, 50, "nodes[10] origin position");     // 5 > 11 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[10], 0, 0, 50, "nodes[10] origin position");     // 5 > 10 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[22], 0, 50, 50, "nodes[22] origin position");    // 6 > 22 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[23], 0, 50, 50, "nodes[23] origin position");    // 6 > 23 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[16], 0, 0, 50, "nodes[16] origin position");     // 10 > 16 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[17], 0, 50, 50, "nodes[17] origin position");    // 16 > 17 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[18], 0, 50, 50, "nodes[18] origin position");    // 10 > 18 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[12], 0, -100, -10, "nodes[12] origin position"); // 5 > 9 > 12 {x: 0, y: 0, z: -60}
			testNodePosition(nodes[14], 0, -100, 50, "nodes[14] origin position");  // 9 > 14 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[25], 0, 50, 50, "nodes[25] origin position");    // 9 > 13 > 25 {x: 0, y: 160, z: 100}

			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - activate view", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});
			view1.thumbnailData = "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";
			view1.thumbnailType = "png";

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i;
			for (i = 0; i < nodes.length; i++) {
				var nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.visible = true;
				nodeInfo.opacity = 1.0;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			function testRestProperties(node, message) {
				var restTrans = viewStateManager.getRestTransformation(node);
				var positionArray = node.position.toArray();
				var scaleArray = node.scale.toArray();
				var quaternionArray = node.quaternion.toArray();
				var ropacity = viewStateManager.getRestOpacity(node);
				var opacity = viewStateManager.getOpacity(node);
				assert.deepEqual(restTrans.translation, positionArray, message + node.name + " rest translation");
				assert.deepEqual(restTrans.scale, scaleArray, message + node.name + " rest scale");
				if (opacity !== null) {
					assert.equal(ropacity, opacity, message + node.name + " rest opacity");
				}
				assert.deepEqual(restTrans.quaternion, quaternionArray, message + node.name + " rest quaternion");
			}

			var trans;
			for (i = 0; i < nodes.length; i++) {
				trans = viewStateManager.getTransformation(nodes[i]);
				trans.translation = [trans.translation[0] + 10, trans.translation[1] + 20, trans.translation[2] + 30];
				trans.scale = [trans.scale[0] * 1.0, trans.scale[1] * 2.0, trans.scale[2] * 3.0];
				trans.quaternion = [trans.quaternion[1], trans.quaternion[0], trans.quaternion[3], trans.quaternion[2]];
				viewStateManager.setTransformation(nodes[i], trans);
				viewStateManager.setOpacity(nodes[i], 0.5);
			}
			viewStateManager.setVisibilityState(nodes, false);

			viewStateManager._resetNodesMaterialAndOpacityByCurrentView(view1);
			viewStateManager._resetNodesStatusByCurrentView(view1, true, false);

			for (i = 0; i < nodes.length; i++) {
				testRestProperties(nodes[i], "activateView: ");
			}

			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - restOpacity", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i;
			for (i = 0; i < nodes.length; i++) {
				var nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.opacity = 0.9;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			function testRestOpacity(node, message) {
				var ropacity = viewStateManager.getRestOpacity(node);
				var opacity = viewStateManager.getOpacity(node);
				if (opacity !== null) {
					assert.equal(ropacity, opacity, message + node.name + " rest opacity");
				}
			}

			for (i = 0; i < nodes.length; i++) {
				viewStateManager.setOpacity(nodes[i], 0.5);
				viewStateManager.restoreRestOpacity(nodes[i]);
				testRestOpacity(nodes[i], "restore/getRestOpacity: ");
			}

			for (i = 0; i < nodes.length; i++) {
				viewStateManager.setOpacity(nodes[i], 0.6);
				viewStateManager.updateRestOpacity(nodes[i]);
				testRestOpacity(nodes[i], "update/getRestOpacity: ");
			}

			for (i = 0; i < nodes.length; i++) {
				viewStateManager.setOpacity(nodes[i], 0.7);
				viewStateManager.setRestOpacity(nodes[i], 0.7);
				testRestOpacity(nodes[i], "set/getRestOpacity: ");
			}
			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - restTransformation", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i;
			for (i = 0; i < nodes.length; i++) {
				var nodeInfo = {};
				nodeInfo.target = nodes[i];
				var transform = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
				nodeInfo.transform = transform;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			var joints = [
				{
					node: nodes[7],
					parent: nodes[23]
				}, {
					node: nodes[14],
					parent: nodes[22]
				}
			];
			var sequence1 = scene.createSequence("1", { name: "sequence1", duration: 1.0 });
			var firedSequenceChangedCounts = 0;
			sequence1._fireSequenceChanged = function() {
				firedSequenceChangedCounts = firedSequenceChangedCounts + 1;
			};
			var playback1 = new AnimationPlayback({
				sequence: sequence1
			});

			view1.addPlayback(playback1);
			view1.resetPlaybacksStartTimes();
			viewStateManager.setJoints(joints, playback1);


			for (i = 0; i < nodes.length; i++) {
				viewStateManager.updateRestTransformation(nodes[i], i != nodes.length - 1);
			}
			assert.equal(firedSequenceChangedCounts, 1);

			function testRestPosition(node, message) {
				var restTrans = viewStateManager.getRestTransformation(node);
				var positionArray = node.position.toArray();
				var scaleArray = node.scale.toArray();
				var quaternionArray = node.quaternion.toArray();
				assert.deepEqual(restTrans.translation, positionArray, message + node.name + " rest translation");
				assert.deepEqual(restTrans.scale, scaleArray, message + node.name + " rest scale");
				assert.deepEqual(restTrans.quaternion, quaternionArray, message + node.name + " rest quaternion");
			}

			for (i = 0; i < nodes.length; i++) {
				testRestPosition(nodes[i], "update/getRestTransformation: ");
			}

			var trans;
			for (i = 0; i < nodes.length; i++) {
				trans = viewStateManager.getTransformation(nodes[i]);
				viewStateManager.setRestTransformation(nodes[i], trans.translation);
				viewStateManager.setRestTransformation(nodes[i], null, trans.quaternion);
				viewStateManager.setRestTransformation(nodes[i], null, null, trans.scale);
			}

			for (i = 0; i < nodes.length; i++) {
				testRestPosition(nodes[i], "set/getRestTransformation: ");
			}

			for (i = 0; i < nodes.length; i++) {
				trans = viewStateManager.getTransformation(nodes[i]);
				trans.translation = [trans.translation[0] + 10, trans.translation[1] + 20, trans.translation[2] + 30];
				trans.scale = [trans.scale[0] * 1.0, trans.scale[1] * 2.0, trans.scale[2] * 3.0];
				trans.quaternion = [trans.quaternion[1], trans.quaternion[0], trans.quaternion[3], trans.quaternion[2]];
				viewStateManager.setTransformation(nodes[i], trans);
				viewStateManager.restoreRestTransformation(nodes[i]);
			}

			for (i = 0; i < nodes.length; i++) {
				testRestPosition(nodes[i], "restoreRestTransformation: ");
			}

			for (i = 0; i < nodes.length; i++) {
				trans = viewStateManager.getTransformation(nodes[i]);
				trans.translation = [trans.translation[0] + 10, trans.translation[1] + 20, trans.translation[2] + 30];
				trans.scale = [trans.scale[0] * 1.0, trans.scale[1] * 2.0, trans.scale[2] * 3.0];
				var rQuaternion = new THREE.Quaternion(0.0, 1.0, 0.0, 1.0);
				var quat = new THREE.Quaternion(trans.quaternion[0], trans.quaternion[1], trans.quaternion[2], trans.quaternion[3]);
				trans.quaternion = quat.multiply(rQuaternion).toArray();
				viewStateManager.setTransformation(nodes[i], trans);
				trans = viewStateManager.getRelativeTransformation(nodes[i]);
				assert.deepEqual(trans.translation, [10, 20, 30], "relativeTransformation: " + nodes[i].name + " translation");
				assert.deepEqual(trans.scale, [1.0, 2.0, 3.0], "relativeTransformation: " + nodes[i].name + " scale");
				assert.deepEqual(trans.quaternion, [0.0, 1.0, 0.0, 1.0], "relativeTransformation: " + nodes[i].name + " quaternion");

			}

			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - animation translation key creation", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);
			animationPlayer.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i;
			for (i = 0; i < nodes.length; i++) {
				var nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.opacity = 0.9;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			var sequence1 = scene.createSequence("1", { name: "sequence1", duration: 1.0 });

			var playback1 = new AnimationPlayback({
				sequence: sequence1
			});

			view1.addPlayback(playback1);
			view1.resetPlaybacksStartTimes();

			var trans;
			var time = 0;
			var timeDiff = 0.5;
			var translationDiff = [10, 20, 30];
			var ci;
			var track;
			var key, keyValue;
			for (ci = 0; ci < 3; ci++) {
				for (i = nodes.length - 1; i >= 0; i = i - 5) {
					trans = viewStateManager.getTransformation(nodes[i]);
					if (ci > 0) {
						trans.translation = [trans.translation[0] + translationDiff[0],
						trans.translation[1] + translationDiff[1],
						trans.translation[2] + translationDiff[2]];
					}
					viewStateManager.setTransformation(nodes[i], trans);
					viewStateManager.setTranslationKey(nodes[i], time + timeDiff * ci, playback1, true);
				}
			}
			for (i = nodes.length - 1; i >= 0; i = i - 5) {
				track = sequence1.getNodeAnimation(nodes[i], AnimationTrackType.Translate);
				for (ci = 0; ci < 3; ci++) {
					key = track.getKey(ci);
					assert.equal(key.time, time + timeDiff * ci, "translation key time: " + key.time.toString() + " " + nodes[i].name);
					keyValue = [translationDiff[0] * ci, translationDiff[1] * ci, translationDiff[2] * ci];
					assert.deepEqual(key.value, keyValue, "translation key value: " + nodes[i].name);
				}
			}

			var sequence2 = scene.createSequence("2", { name: "sequence2", duration: 1.0 });

			var playback2 = new AnimationPlayback({
				sequence: sequence2
			});

			view1.addPlayback(playback2);
			view1.resetPlaybacksStartTimes();
			animationPlayer.setTime(time + timeDiff * 2, 0);

			for (ci = 0; ci < 3; ci++) {
				for (i = nodes.length - 1; i >= 0; i = i - 5) {
					trans = viewStateManager.getTransformation(nodes[i]);
					if (ci > 0) {
						trans.translation = [trans.translation[0] + translationDiff[0],
						trans.translation[1] + translationDiff[1],
						trans.translation[2] + translationDiff[2]];
					}
					viewStateManager.setTransformation(nodes[i], trans);
					viewStateManager.setTranslationKey(nodes[i], time + timeDiff * ci, playback2, true);
				}
			}
			for (i = nodes.length - 1; i >= 0; i = i - 5) {
				track = sequence2.getNodeAnimation(nodes[i], AnimationTrackType.Translate);
				for (ci = 0; ci < 3; ci++) {
					key = track.getKey(ci);
					assert.equal(key.time, time + timeDiff * ci, "translation key time: " + key.time.toString() + " " + nodes[i].name);
					keyValue = [translationDiff[0] * ci, translationDiff[1] * ci, translationDiff[2] * ci];
					assert.deepEqual(key.value, keyValue, "translation key value: " + nodes[i].name);
				}
			}

			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - animation scale key creation", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);
			animationPlayer.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i;
			for (i = 0; i < nodes.length; i++) {
				var nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.opacity = 0.9;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			var sequence1 = scene.createSequence("1", { name: "sequence1", duration: 1.0 });

			var playback1 = new AnimationPlayback({
				sequence: sequence1
			});

			view1.addPlayback(playback1);
			view1.resetPlaybacksStartTimes();

			var trans;
			var time = 0;
			var timeDiff = 0.5;
			var scaleDiff = [1.0, 2.0, 3.0];
			var ci;
			var track;
			var key, keyValue;
			for (ci = 0; ci < 3; ci++) {
				for (i = nodes.length - 1; i >= 0; i = i - 5) {
					trans = viewStateManager.getTransformation(nodes[i]);
					if (ci > 0) {
						trans.scale = [trans.scale[0] * scaleDiff[0],
						trans.scale[1] * scaleDiff[1],
						trans.scale[2] * scaleDiff[2]];
					}
					viewStateManager.setTransformation(nodes[i], trans);
					viewStateManager.setScaleKey(nodes[i], time + timeDiff * ci, playback1, true);
				}
			}
			for (i = nodes.length - 1; i >= 0; i = i - 5) {
				track = sequence1.getNodeAnimation(nodes[i], AnimationTrackType.Scale);
				for (ci = 0; ci < 3; ci++) {
					key = track.getKey(ci);
					assert.equal(key.time, time + timeDiff * ci, "scale key time: " + key.time.toString() + " " + nodes[i].name);
					keyValue = [Math.pow(scaleDiff[0], ci), Math.pow(scaleDiff[1], ci), Math.pow(scaleDiff[2], ci)];
					assert.deepEqual(key.value, keyValue, "scale key value: " + nodes[i].name);
				}
			}

			var sequence2 = scene.createSequence("2", { name: "sequence2", duration: 1.0 });

			var playback2 = new AnimationPlayback({
				sequence: sequence2
			});

			view1.addPlayback(playback2);
			view1.resetPlaybacksStartTimes();
			animationPlayer.setTime(time + timeDiff * 2, 0);

			for (ci = 0; ci < 3; ci++) {
				for (i = nodes.length - 1; i >= 0; i = i - 5) {
					trans = viewStateManager.getTransformation(nodes[i]);
					if (ci > 0) {
						trans.scale = [trans.scale[0] * scaleDiff[0],
						trans.scale[1] * scaleDiff[1],
						trans.scale[2] * scaleDiff[2]];
					}
					viewStateManager.setTransformation(nodes[i], trans);
					viewStateManager.setScaleKey(nodes[i], time + timeDiff * ci, playback2, true);
				}
			}
			for (i = nodes.length - 1; i >= 0; i = i - 5) {
				track = sequence2.getNodeAnimation(nodes[i], AnimationTrackType.Scale);
				for (ci = 0; ci < 3; ci++) {
					key = track.getKey(ci);
					assert.equal(key.time, time + timeDiff * ci, "scale key time: " + key.time.toString() + " " + nodes[i].name);
					keyValue = [Math.pow(scaleDiff[0], ci), Math.pow(scaleDiff[1], ci), Math.pow(scaleDiff[2], ci)];
					assert.deepEqual(key.value, keyValue, "scale key value: " + nodes[i].name);
				}
			}

			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - animation rotation key creation", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);
			animationPlayer.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i;
			for (i = 0; i < nodes.length; i++) {
				var nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.opacity = 0.9;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			var sequence1 = scene.createSequence("1", { name: "sequence1", duration: 1.0 });

			var playback1 = new AnimationPlayback({
				sequence: sequence1
			});

			view1.addPlayback(playback1);
			view1.resetPlaybacksStartTimes();

			var euler;
			var time = 0;
			var timeDiff = 0.5;
			var rotationDiff = [0.3, 0.2, 0.1];
			var ci;
			var track;
			var key, keyValue;
			for (ci = 0; ci < 3; ci++) {
				for (i = nodes.length - 1; i >= 0; i = i - 5) {
					euler = [rotationDiff[0] * ci, rotationDiff[1] * ci, rotationDiff[2] * ci];
					viewStateManager.setRotationKey(nodes[i], time + timeDiff * ci, euler, playback1, true);
				}
			}
			for (i = nodes.length - 1; i >= 0; i = i - 5) {
				track = sequence1.getNodeAnimation(nodes[i], AnimationTrackType.Rotate);
				for (ci = 0; ci < 3; ci++) {
					key = track.getKey(ci);
					assert.equal(key.time, time + timeDiff * ci, "rotation key time: " + key.time.toString() + " " + nodes[i].name);
					keyValue = [rotationDiff[0] * ci, rotationDiff[1] * ci, rotationDiff[2] * ci, 36];
					assert.deepEqual(key.value, keyValue, "rotation key value: " + nodes[i].name);
				}
			}

			var sequence2 = scene.createSequence("2", { name: "sequence2", duration: 1.0 });

			var playback2 = new AnimationPlayback({
				sequence: sequence2
			});

			view1.addPlayback(playback2);
			view1.resetPlaybacksStartTimes();
			animationPlayer.setTime(time + timeDiff * 2, 0);

			for (ci = 0; ci < 3; ci++) {
				for (i = nodes.length - 1; i >= 0; i = i - 5) {
					euler = [rotationDiff[0] * ci, rotationDiff[1] * ci, rotationDiff[2] * ci];
					viewStateManager.setRotationKey(nodes[i], time + timeDiff * ci, euler, playback1, true);
				}
			}
			for (i = nodes.length - 1; i >= 0; i = i - 5) {
				track = sequence1.getNodeAnimation(nodes[i], AnimationTrackType.Rotate);
				for (ci = 0; ci < 3; ci++) {
					key = track.getKey(ci);
					assert.equal(key.time, time + timeDiff * ci, "rotation key time: " + key.time.toString() + " " + nodes[i].name);
					keyValue = [rotationDiff[0] * ci, rotationDiff[1] * ci, rotationDiff[2] * ci, 36];
					assert.deepEqual(key.value, keyValue, "rotation key value: " + nodes[i].name);
				}
			}

			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - axis-angle animation rotation key creation", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);
			animationPlayer.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i;
			for (i = 0; i < nodes.length; i++) {
				var nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.opacity = 0.9;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			var sequence1 = scene.createSequence("1", { name: "sequence1", duration: 1.0 });

			var playback1 = new AnimationPlayback({
				sequence: sequence1
			});

			view1.addPlayback(playback1);
			view1.resetPlaybacksStartTimes();

			var keys = [
				{
					time: 0,
					value: [0, 0.4472135954999579, 0.8944271909999159, 0.5235988]
				},
				{
					time: 0.5,
					value: [0, 0, 1, -1.27409]
				},
				{
					time: 1,
					value: [-0.5773502691896258, 0.5773502691896258, -0.5773502691896258, 2.076942]
				}
			];

			var nodeRef = nodes[Math.floor(nodes.length / 2)];
			keys.forEach(function(key) {
				viewStateManager.setAxisAngleRotationKey(nodeRef, key.time, key.value, playback1, true);
			});

			var track = sequence1.getNodeAnimation(nodeRef, AnimationTrackType.Rotate);
			keys.forEach(function(key, i) {
				var k = track.getKey(i);
				assert.deepEqual(k.value, key.value, "axis-angle rotation key, index = " + i + " is correct");
			});

			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - animation opacity key creation", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);
			animationPlayer.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i;
			for (i = 0; i < nodes.length; i++) {
				var nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.opacity = 0.9;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			for (i = 0; i < nodes.length; i++) {
				viewStateManager.restoreRestOpacity(nodes[i]);
			}

			var sequence1 = scene.createSequence("1", { name: "sequence1", duration: 1.0 });

			var playback1 = new AnimationPlayback({
				sequence: sequence1
			});

			view1.addPlayback(playback1);
			view1.resetPlaybacksStartTimes();

			var time = 0;
			var timeDiff = 0.5;
			var opacityDiff = 0.5;
			var ci;
			var opacity;
			var key, keyValue;
			for (ci = 0; ci < 3; ci++) {
				for (i = nodes.length - 1; i >= 0; i = i - 5) {
					opacity = viewStateManager.getOpacity(nodes[i]);
					if (ci > 0) {
						opacity *= opacityDiff;
					}
					viewStateManager.setOpacity(nodes[i], opacity);
					viewStateManager.setOpacityKey(nodes[i], time + timeDiff * ci, playback1, true);
				}
			}
			var track;
			for (i = nodes.length - 1; i >= 0; i = i - 5) {
				track = sequence1.getNodeAnimation(nodes[i], AnimationTrackType.Opacity);
				for (ci = 0; ci < 3; ci++) {
					key = track.getKey(ci);
					assert.equal(key.time, time + timeDiff * ci, "opacity key time: " + key.time.toString() + " " + nodes[i].name);
					keyValue = Math.pow(opacityDiff, ci);
					assert.equal(key.value, keyValue, "opacity key value: " + nodes[i].name);
				}
			}

			var sequence2 = scene.createSequence("2", { name: "sequence2", duration: 1.0 });

			var playback2 = new AnimationPlayback({
				sequence: sequence2
			});

			view1.addPlayback(playback2);
			view1.resetPlaybacksStartTimes();
			animationPlayer.setTime(time + timeDiff * 2, 0);

			for (ci = 0; ci < 3; ci++) {
				for (i = nodes.length - 1; i >= 0; i = i - 5) {
					opacity = viewStateManager.getOpacity(nodes[i]);
					if (ci > 0) {
						opacity *= opacityDiff;
					}
					viewStateManager.setOpacity(nodes[i], opacity);
					viewStateManager.setOpacityKey(nodes[i], time + timeDiff * ci, playback2, true);
				}
			}
			for (i = nodes.length - 1; i >= 0; i = i - 5) {
				track = sequence2.getNodeAnimation(nodes[i], AnimationTrackType.Opacity);
				for (ci = 0; ci < 3; ci++) {
					key = track.getKey(ci);
					assert.equal(key.time, time + timeDiff * ci, "opacity key time: " + key.time.toString() + " " + nodes[i].name);
					keyValue = Math.pow(opacityDiff, ci);
					assert.equal(key.value, keyValue, "opacity key value: " + nodes[i].name);
				}
			}

			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - animation translation key creation with joints", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);
			animationPlayer.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i, nodeInfo;
			for (i = 0; i < nodes.length; i++) {
				nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.opacity = 0.9;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			var node1 = nodes[nodes.length - 1];
			var node2 = nodes[nodes.length - 6];

			var x = (node1.matrixWorld.elements[12] + node2.matrixWorld.elements[12]) / 2.0;
			var y = (node1.matrixWorld.elements[13] + node2.matrixWorld.elements[13]) / 2.0;
			var z = (node1.matrixWorld.elements[14] + node2.matrixWorld.elements[14]) / 2.0;

			var sequence1 = scene.createSequence("1", { name: "sequence1", duration: 1.0 });
			var playback1 = new AnimationPlayback({
				sequence: sequence1
			});

			view1.addPlayback(playback1);
			view1.resetPlaybacksStartTimes();

			var nodeHierarchy = scene.getDefaultNodeHierarchy();
			var rnode1 = nodeHierarchy.createNode(scene.getSceneRef(), "rnode1", null, NodeContentType.Reference);
			rnode1.position.x = x;
			rnode1.position.y = y;
			rnode1.position.z = z;
			rnode1.updateMatrix();
			nodeInfo = [{ target: rnode1, transform: rnode1.matrix.elements.slice() }];
			view1.updateNodeInfos(nodeInfo);

			var joints = [];
			var joint1 = {};
			joint1.parent = rnode1;
			joint1.node = node1;
			joints.push(joint1);
			var joint2 = {};
			joint2.parent = rnode1;
			joint2.node = node1;
			joints.push(joint2);
			sequence1.setJoint(joints);

			animationPlayer.setTime(0);
			var time = 0;
			var timeDiff = 0.5;
			var refTransDiff = [20, 0, 0];
			viewStateManager.setTranslationKey(rnode1, time, playback1, true);
			var ci;
			var trans;
			for (ci = 1; ci < 3; ci++) {
				trans = viewStateManager.getTransformation(rnode1);
				trans.translation = [trans.translation[0] + refTransDiff[0],
				trans.translation[1] + refTransDiff[1],
				trans.translation[2] + refTransDiff[2]];
				viewStateManager.setTransformation(rnode1, trans);
				viewStateManager.setTranslationKey(rnode1, time + timeDiff * ci, playback1, true);
			}
			var nodeTransDiff = [0, 10, 0];
			animationPlayer.setTime(0);
			viewStateManager.setTranslationKey(node1, time, playback1, true);
			for (ci = 1; ci < 3; ci++) {
				animationPlayer.setTime(time + timeDiff * ci);
				trans = viewStateManager.getTransformation(node1);
				trans.translation = [trans.translation[0] + nodeTransDiff[0],
				trans.translation[1] + nodeTransDiff[1],
				trans.translation[2] + nodeTransDiff[2]];
				viewStateManager.setTransformation(node1, trans);
				viewStateManager.setTranslationKey(node1, time + timeDiff * ci, playback1, true);
			}

			animationPlayer.setTime(0);
			viewStateManager.setTranslationKey(node2, time, playback1, true);
			for (ci = 1; ci < 3; ci++) {
				animationPlayer.setTime(time + timeDiff * ci);
				trans = viewStateManager.getTransformation(node2);
				trans.translation = [trans.translation[0] + nodeTransDiff[0],
				trans.translation[1] + nodeTransDiff[1],
				trans.translation[2] + nodeTransDiff[2]];
				viewStateManager.setTransformation(node2, trans);
				viewStateManager.setTranslationKey(node2, time + timeDiff * ci, playback1, true);
			}
			var key, keyValue;
			var rtrack1 = sequence1.getNodeAnimation(rnode1, AnimationTrackType.Translate);
			for (ci = 0; ci < 3; ci++) {
				key = rtrack1.getKey(ci);
				assert.equal(key.time, time + timeDiff * ci, "translation key time: " + key.time.toString() + " " + rnode1.name);
				keyValue = [refTransDiff[0] * ci, refTransDiff[1] * ci, refTransDiff[2] * ci];
				assert.deepEqual(key.value, keyValue, "translation key value: " + rnode1.name);
			}

			var track1 = sequence1.getNodeAnimation(node1, AnimationTrackType.Translate);
			for (ci = 0; ci < 3; ci++) {
				key = track1.getKey(ci);
				assert.equal(key.time, time + timeDiff * ci, "translation key time: " + key.time.toString() + " " + node1.name);
				keyValue = [nodeTransDiff[0] * ci, nodeTransDiff[1] * ci, nodeTransDiff[2] * ci];
				assert.deepEqual(key.value, keyValue, "translation key value: " + node1.name);
			}

			var track2 = sequence1.getNodeAnimation(node2, AnimationTrackType.Translate);
			for (ci = 0; ci < 3; ci++) {
				key = track2.getKey(ci);
				assert.equal(key.time, time + timeDiff * ci, "translation key time: " + key.time.toString() + " " + node2.name);
				keyValue = [nodeTransDiff[0] * ci, nodeTransDiff[1] * ci, nodeTransDiff[2] * ci];
				assert.deepEqual(key.value, keyValue, "translation key value: " + node2.name);
			}
			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - animation scale key creation with joints", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);
			animationPlayer.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i, nodeInfo;
			for (i = 0; i < nodes.length; i++) {
				nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.opacity = 0.9;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			var node1 = nodes[nodes.length - 1];
			var node2 = nodes[nodes.length - 6];

			var x = (node1.matrixWorld.elements[12] + node2.matrixWorld.elements[12]) / 2.0;
			var y = (node1.matrixWorld.elements[13] + node2.matrixWorld.elements[13]) / 2.0;
			var z = (node1.matrixWorld.elements[14] + node2.matrixWorld.elements[14]) / 2.0;

			var sequence1 = scene.createSequence("1", { name: "sequence1", duration: 1.0 });
			var playback1 = new AnimationPlayback({
				sequence: sequence1
			});

			view1.addPlayback(playback1);
			view1.resetPlaybacksStartTimes();

			var nodeHierarchy = scene.getDefaultNodeHierarchy();
			var rnode1 = nodeHierarchy.createNode(scene.getSceneRef(), "rnode1", null, NodeContentType.Reference);
			rnode1.position.x = x;
			rnode1.position.y = y;
			rnode1.position.z = z;
			rnode1.updateMatrix();
			nodeInfo = [{ target: rnode1, transform: rnode1.matrix.elements.slice() }];
			view1.updateNodeInfos(nodeInfo);

			var joints = [];
			var joint1 = {};
			joint1.parent = rnode1;
			joint1.node = node1;
			joints.push(joint1);
			var joint2 = {};
			joint2.parent = rnode1;
			joint2.node = node1;
			joints.push(joint2);
			sequence1.setJoint(joints);

			animationPlayer.setTime(0);
			var time = 0;
			var timeDiff = 0.5;
			var ci;
			var trans;

			animationPlayer.setTime(0);
			var refScaleDiff = [2, 1, 3];
			viewStateManager.setScaleKey(rnode1, time, playback1, true);
			for (ci = 1; ci < 3; ci++) {
				trans = viewStateManager.getTransformation(rnode1);
				trans.scale = [trans.scale[0] * refScaleDiff[0],
				trans.scale[1] * refScaleDiff[1],
				trans.scale[2] * refScaleDiff[2]];
				viewStateManager.setTransformation(rnode1, trans);
				viewStateManager.setScaleKey(rnode1, time + timeDiff * ci, playback1, true);
			}

			var nodeScaleDiff = [0.5, 1, 0.5];
			animationPlayer.setTime(0);
			viewStateManager.setScaleKey(node1, time, playback1, true);
			for (ci = 1; ci < 3; ci++) {
				animationPlayer.setTime(time + timeDiff * ci);
				trans = viewStateManager.getTransformation(node1);
				trans.scale = [trans.scale[0] * nodeScaleDiff[0],
				trans.scale[1] * nodeScaleDiff[1],
				trans.scale[2] * nodeScaleDiff[2]];
				viewStateManager.setTransformation(node1, trans);
				viewStateManager.setScaleKey(node1, time + timeDiff * ci, playback1, true);
			}

			animationPlayer.setTime(0);
			viewStateManager.setScaleKey(node2, time, playback1, true);
			for (ci = 1; ci < 3; ci++) {
				animationPlayer.setTime(time + timeDiff * ci);
				trans = viewStateManager.getTransformation(node2);
				trans.scale = [trans.scale[0] * nodeScaleDiff[0],
				trans.scale[1] * nodeScaleDiff[1],
				trans.scale[2] * nodeScaleDiff[2]];
				viewStateManager.setTransformation(node2, trans);
				viewStateManager.setScaleKey(node2, time + timeDiff * ci, playback1, true);
			}

			var key, keyValue;
			var rtrack1 = sequence1.getNodeAnimation(rnode1, AnimationTrackType.Scale);
			for (ci = 0; ci < 3; ci++) {
				key = rtrack1.getKey(ci);
				assert.equal(key.time, time + timeDiff * ci, "scale key time: " + key.time.toString() + " " + rnode1.name);
				keyValue = [Math.pow(refScaleDiff[0], ci), Math.pow(refScaleDiff[1], ci), Math.pow(refScaleDiff[2], ci)];
				assert.deepEqual(key.value, keyValue, "scale key value: " + rnode1.name);
			}

			var track1 = sequence1.getNodeAnimation(node1, AnimationTrackType.Scale);
			for (ci = 0; ci < 3; ci++) {
				key = track1.getKey(ci);
				assert.equal(key.time, time + timeDiff * ci, "scale key time: " + key.time.toString() + " " + node1.name);
				keyValue = [Math.pow(nodeScaleDiff[0], ci), Math.pow(nodeScaleDiff[1], ci), Math.pow(nodeScaleDiff[2], ci)];
				assert.deepEqual(key.value, keyValue, "scale key value: " + node1.name);
			}

			var track2 = sequence1.getNodeAnimation(node2, AnimationTrackType.Scale);
			for (ci = 0; ci < 3; ci++) {
				key = track2.getKey(ci);
				assert.equal(key.time, time + timeDiff * ci, "scale key time: " + key.time.toString() + " " + node2.name);
				keyValue = [Math.pow(nodeScaleDiff[0], ci), Math.pow(nodeScaleDiff[1], ci), Math.pow(nodeScaleDiff[2], ci)];
				assert.deepEqual(key.value, keyValue, "scale key value: " + node2.name);
			}

			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("three.js ViewStateManager - animation rotation key creation with joints", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = that.viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var animationPlayer = new AnimationPlayer({
				viewStateManager: viewStateManager
			});

			var viewManager = new ViewManager({
				animationPlayer: animationPlayer
			});

			viewStateManager.setViewManager(viewManager);

			var view1 = scene.createView({
				name: "Step 1",
				description: "sdfsdfsfds",
				viewId: "i0000000300000001"
			});

			viewManager.activateView(view1);
			animationPlayer.activateView(view1);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);

			var nodeInfos = [];
			var i, nodeInfo;
			for (i = 0; i < nodes.length; i++) {
				nodeInfo = {};
				nodeInfo.target = nodes[i];
				nodeInfo.transform = nodes[i].matrix.elements.slice();
				nodeInfo.opacity = 0.9;
				nodeInfos.push(nodeInfo);
			}
			view1.setNodeInfos(nodeInfos);

			var node1 = nodes[nodes.length - 1];
			var node2 = nodes[nodes.length - 6];

			var x = (node1.matrixWorld.elements[12] + node2.matrixWorld.elements[12]) / 2.0;
			var y = (node1.matrixWorld.elements[13] + node2.matrixWorld.elements[13]) / 2.0;
			var z = (node1.matrixWorld.elements[14] + node2.matrixWorld.elements[14]) / 2.0;

			var sequence1 = scene.createSequence("1", { name: "sequence1", duration: 1.0 });
			var playback1 = new AnimationPlayback({
				sequence: sequence1
			});

			view1.addPlayback(playback1);
			view1.resetPlaybacksStartTimes();

			var nodeHierarchy = scene.getDefaultNodeHierarchy();
			var rnode1 = nodeHierarchy.createNode(scene.getSceneRef(), "rnode1", null, NodeContentType.Reference);
			rnode1.position.x = x;
			rnode1.position.y = y;
			rnode1.position.z = z;
			rnode1.updateMatrix();
			nodeInfo = [{ target: rnode1, transform: rnode1.matrix.elements.slice() }];
			view1.updateNodeInfos(nodeInfo);

			var joints = [];
			var joint1 = {};
			joint1.parent = rnode1;
			joint1.node = node1;
			joints.push(joint1);
			var joint2 = {};
			joint2.parent = rnode1;
			joint2.node = node1;
			joints.push(joint2);
			sequence1.setJoint(joints);

			animationPlayer.setTime(0);
			var time = 0;
			var timeDiff = 0.5;
			var ci;

			animationPlayer.setTime(0);
			var euler;
			var refRotateDiff = [0.78, 1.57, 0];
			for (ci = 0; ci < 3; ci++) {
				euler = [refRotateDiff[0] * ci, refRotateDiff[1] * ci, refRotateDiff[2] * ci];
				viewStateManager.setRotationKey(rnode1, time + timeDiff * ci, euler, playback1, true);
			}

			var nodeRotateDiff = [3.14, 0, 0.5];
			for (ci = 0; ci < 3; ci++) {
				animationPlayer.setTime(time + timeDiff * ci);
				euler = [nodeRotateDiff[0] * ci, nodeRotateDiff[1] * ci, nodeRotateDiff[2] * ci];
				viewStateManager.setRotationKey(node1, time + timeDiff * ci, euler, playback1, true);
				viewStateManager.setRotationKey(node2, time + timeDiff * ci, euler, playback1, true);
			}

			var key, keyValue;
			var rtrack1 = sequence1.getNodeAnimation(rnode1, AnimationTrackType.Rotate);
			for (ci = 0; ci < 3; ci++) {
				key = rtrack1.getKey(ci);
				assert.equal(key.time, time + timeDiff * ci, "rotate key time: " + key.time.toString() + " " + rnode1.name);
				keyValue = [refRotateDiff[0] * ci, refRotateDiff[1] * ci, refRotateDiff[2] * ci, 36];
				assert.deepEqual(key.value, keyValue, "rotate key value: " + rnode1.name);
			}

			var track1 = sequence1.getNodeAnimation(node1, AnimationTrackType.Rotate);
			for (ci = 0; ci < 3; ci++) {
				key = track1.getKey(ci);
				assert.equal(key.time, time + timeDiff * ci, "rotate key time: " + key.time.toString() + " " + node1.name);
				keyValue = [nodeRotateDiff[0] * ci, nodeRotateDiff[1] * ci, nodeRotateDiff[2] * ci, 36];
				assert.deepEqual(key.value, keyValue, "rotate key value: " + node1.name);
			}

			var track2 = sequence1.getNodeAnimation(node2, AnimationTrackType.Rotate);
			for (ci = 0; ci < 3; ci++) {
				key = track2.getKey(ci);
				assert.equal(key.time, time + timeDiff * ci, "rotate key time: " + key.time.toString() + " " + node2.name);
				keyValue = [nodeRotateDiff[0] * ci, nodeRotateDiff[1] * ci, nodeRotateDiff[2] * ci, 36];
				assert.deepEqual(key.value, keyValue, "rotate key value: " + node2.name);
			}
			done();
		};

		var that = this;
		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.test("ViewStateManager destroy should destroy OutlineRenderer", function(assert) {
		var done = assert.async();

		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			assert.ok(viewStateManager._outlineRenderer, "OutlineRenderer is created");

			viewStateManager.destroy();

			assert.ok(!viewStateManager._outlineRenderer, "OutlineRenderer is detroyed");

			done();
		});
	});

	QUnit.test("three.js ViewStateManager - get and set background image type", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var nodes = [];
			getAllChildNodes(nativeScene, nodes);
			var sceneBuilder = new SceneBuilder();
			sceneBuilder.setRootNode(nodes[0], "123", "456", scene);
			scene.setSceneBuilder(sceneBuilder);

			var imageType = viewStateManager.getBackgroundImageType();
			assert.equal(imageType, null, "No background node: background imageType null");

			var nodeHierarchy = scene.getDefaultNodeHierarchy();
			var sphere = { type: "sphere", radius: "1000" }, plane = { type: "plane", length: "100", width: "40" };
			var sphereNode = nodeHierarchy.createNode(nodes[0], "sphere", null, NodeContentType.Background, { parametricContent: sphere, visible: false });
			var planeNode = nodeHierarchy.createNode(nodes[0], "plane", null, NodeContentType.Background, { parametricContent: plane });
			assert.equal(sphereNode.userData.renderStage, -1, "Background sphere node renderStage");
			assert.equal(planeNode.userData.renderStage, -1, "Background plane node renderStage");

			var view1 = scene.createView({
				name: "Background and symbol view",
				description: "Background and symbol nodes",
				viewId: "v123456"
			});
			viewStateManager.activateView(view1);
			view1.updateNodeInfos([{ target: sphereNode, visible: true }, { target: planeNode, visible: true }]);

			viewStateManager.setBackgroundImageType("360Image");
			imageType = viewStateManager.getBackgroundImageType();
			assert.equal(imageType, "360Image", "Switch to sphere background node: background imageType 360Image");
			viewStateManager.setBackgroundImageType("2DImage");
			imageType = viewStateManager.getBackgroundImageType();
			assert.equal(imageType, "2DImage", "Set back to plane background node: background imageType 2DImage");

			var symbol1 = nodeHierarchy.createNode(nodes[0], "Symbol1", null, NodeContentType.Symbol);
			var symbol2 = nodeHierarchy.createNode(nodes[0], "Symbol2", null, NodeContentType.Symbol);
			view1.updateNodeInfos([{ target: symbol1 }, { target: symbol2 }]);
			var symbolNodes = viewStateManager.getSymbolNodes();
			assert.equal(symbolNodes.length, 2, "Add two Symbol Nodes: 2");
			done();
		};

		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);
	});

	QUnit.moduleWithContentConnector("threejs.ViewStateManager", "test-resources/sap/ui/vk/qunit/media/chair.json", "threejs.test.json", function(assert) {
	});

	QUnit.test("three.js ViewStateManager - 'selectable' property", function(assert) {
		var vsm = new ViewStateManager({ contentConnector: this.contentConnector });

		var nh = this.contentConnector.getContent().getDefaultNodeHierarchy();

		var seat = nh.findNodesByName({ value: "seat_assy" })[0];
		var backRest = seat.children[1].children[0];

		assert.equal(vsm.getSelectable(seat), true, "'seat_assy' is selectable by default");

		vsm.setSelectable(seat, true);
		assert.strictEqual(vsm.getSelectable(seat), true, "'seat_assy' is selectable");
		assert.strictEqual(vsm.getSelectable(backRest), true, "'back_rest_75' (a descendant of 'seat_assy') is selectable");

		vsm.setSelectable(seat, false);
		assert.strictEqual(vsm.getSelectable(seat), false, "'seat_assy' is selectable");
		assert.strictEqual(vsm.getSelectable(backRest), false, "'back_rest_75' (a descendant of 'seat_assy') is unselectable");

		vsm.setSelectable(seat, null);
		assert.strictEqual(vsm.getSelectable(seat), true, "'seat_assy' is selectable after resetting");
		assert.strictEqual(vsm.getSelectable(backRest), true, "'back_rest_75' (a descendant of 'seat_assy') is selectable after resetting");

		vsm.destroy();
	});

	QUnit.test("Test associated marker movement", function(assert) {

		let associatedMarkers = new Map();
		let markers = new Map();
		// worldspace node will not be updated
		markers.set("2000", { "coordinateSpace": 0, "markerNodeId": "2000" });
		markers.set("3000", { "coordinateSpace": 1, "markerNodeId": "3000" });
		markers.set("4000", { "coordinateSpace": 1, "markerNodeId": "4000" });
		markers.set("5000", { "coordinateSpace": 1, "markerNodeId": "5000" });


		associatedMarkers.set("1000", markers)

		const nodeMatrix = new THREE.Matrix4().compose({ x: 100, y: 100, z: 100 }, { _x: 0, _y: 0, _z: 0, _w: 1 }, new THREE.Vector3(1, 1, 1));
		const refNodes = [{ matrixWorld: nodeMatrix }];

		const markerNodes = [
			new THREE.Object3D(),
			new THREE.Object3D(),
			new THREE.Object3D()
		]
		markerNodes.forEach((node) => {
			node.userData = { treeNode: { transform: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] } }
		});

		// hidden node will not be updated
		markerNodes[2].visible = false;

		const mockGetPersistentIdToNodeRef = (nodeSid) => {
			switch (nodeSid) {
				case "1000": return refNodes[0];
				case "2000": return markerNodes[0];
				case "3000": return markerNodes[1];
				case "4000": return markerNodes[2];
				default: return null
			}
		}

		const sceneBuilder = { getAllNodesWithBoundMarkers: sinon.stub().returns(associatedMarkers) };
		const scene = {
			getSceneBuilder: sinon.stub().returns(sceneBuilder),
			getDefaultNodeHierarchy: sinon.stub().returns(null),
			setViewStateManager: sinon.stub().returns(null),
			getInitialView: sinon.stub().returns(null),
			persistentIdToNodeRef: mockGetPersistentIdToNodeRef,
			PoiCoordinateSpaces: {
				ReferenceNodeSpace: 1
			}
		};

		const vsm = new ViewStateManager();
		vsm._setScene(scene);
		vsm.updateAssociatedMarkerMatrix();

		const identityMatrix = new THREE.Matrix4();

		assert.ok(markerNodes[0].matrix.equals(identityMatrix), "Marker node one should be identity");
		assert.ok(markerNodes[1].matrix.equals(nodeMatrix), "Marker node one should have the same matrix as node");
		assert.ok(markerNodes[2].matrix.equals(identityMatrix), "Marker node three should be identity");
		vsm.destroy();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
