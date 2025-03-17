/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/ViewStateManager",
	"sap/ui/vk/svg/Viewport",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/colorToCSSColor",
	"sap/ui/vk/colorToABGR",
	"sap/ui/vk/abgrToColor"
], function(
	nextUIUpdate,
	jQuery,
	Scene,
	ViewStateManager,
	Viewport,
	Element,
	Rectangle,
	colorToCSSColor,
	colorToABGR,
	abgrToColor
) {
	"use strict";

	function createElementsRecursive(parent, array, level) {
		array.forEach(function(element) {
			if (Array.isArray(element)) {
				var g = new Element();
				g.name = "G" + level + parent.children.length;
				parent.add(g);
				createElementsRecursive(g, element, level + 1);
			} else {
				var cg = new Element();
				cg.name = "CG" + element;
				parent.add(cg);
				var r = new Rectangle();
				r.sid = r.name = element;
				cg.add(r);
			}
		});
	}

	function createTestScene() {
		var scene = new Scene();
		createElementsRecursive(scene.getRootElement(), [["A", "B", "C"], ["D", ["E", "F", "G"], "H"]], 0);
		return scene;
	}

	function getAllChildRectNodes(parent, rectNodes) {
		if (parent && parent instanceof Rectangle) {
			rectNodes.push(parent);
		}

		if (parent && parent.children && parent.children.length > 0) {
			var oi;
			for (oi = 0; oi < parent.children.length; oi += 1) {
				getAllChildRectNodes(parent.children[oi], rectNodes);
			}
		}
	}

	var vsm = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: vsm });
	viewport.placeAt("content");
	nextUIUpdate.runSync();
	var scene = createTestScene();
	viewport._setScene(scene);
	vsm._setScene(scene);

	QUnit.test("SVG ViewStateManager", function(assert) {
		var done = assert.async();

		function getNodeByName(nodes, name) {
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].name === name) {
					return nodes[i];
				}
			}
			return null;
		}

		var getDescendants = function(node) {
			var descendants = [];
			node.children.forEach(function(child) {
				child.traverse(function(descendant) {
					descendants.push(descendant);
				});
			});
			return descendants;
		};

		function testVisibility(vsm, node) {
			vsm.setVisibilityState(node, true, false);
			assert.strictEqual(vsm.getVisibilityState(node), true, "Setting visibility true");

			vsm.setVisibilityState(node, false, false);
			assert.strictEqual(vsm.getVisibilityState(node), false, "Setting visibility false");

			var descendants = getDescendants(node);
			vsm.setVisibilityState(node, true, true);
			vsm.getVisibilityState(descendants).forEach(function(state) {
				assert.strictEqual(state, true, "Setting visibility true recursively");
			});

			vsm.setVisibilityState(node, false, true);
			vsm.getVisibilityState(descendants).forEach(function(state) {
				assert.strictEqual(state, false, "Setting visibility false recursively");
			});
		}

		function validateOpacityAttribute(node, checkOpacity) {
			assert.ok(node.domRef && (!node.parent || node.domRef !== node.parent.domRef || checkOpacity === null), "Node domRef");
			assert.strictEqual(node.domRef.getAttribute("opacity"), checkOpacity, "Node opacity attribute");
		}

		function testOpacity(vsm, nodes) {
			var opacity = 0.345;
			var groupNode = getNodeByName(nodes, "G01");
			var nodeA = getNodeByName(nodes, "CGA");

			vsm.setOpacity(nodeA, opacity);
			assert.strictEqual(vsm.getOpacity(nodeA), opacity, "Setting opacity " + nodeA.name);
			validateOpacityAttribute(nodeA, opacity.toString());

			vsm.setOpacity(nodeA, null);
			assert.strictEqual(vsm.getOpacity(nodeA), null, "Removing opacity " + nodeA.name);
			assert.strictEqual(nodeA.opacity, undefined, "Removing opacity " + nodeA.name);
			validateOpacityAttribute(nodeA, null);

			var childNode = getNodeByName(nodes, "CGF");
			var groupOpacity = 0.2;
			var childOpacity = 0.5;
			var rootOpacity = 0.1;

			// set nodeF opacity
			vsm.setOpacity(childNode, childOpacity);
			validateOpacityAttribute(childNode, childOpacity.toString());

			// set Group01 opacity
			vsm.setOpacity(groupNode, groupOpacity);
			validateOpacityAttribute(groupNode, groupOpacity.toString());
			// assert nodeF property is unchanged
			assert.strictEqual(childNode.opacity, childOpacity, "Node opacity property");

			// set root opacity
			vsm.setOpacity(scene.getRootElement(), rootOpacity);
			validateOpacityAttribute(scene.getRootElement(), rootOpacity.toString());
			// assert nodeF property is unchanged
			assert.strictEqual(childNode.opacity, childOpacity, "Node opacity property");
			// assert Group01 property is unchanged
			assert.strictEqual(groupNode.opacity, groupOpacity, "Node opacity property");

			// revert group opacity
			vsm.setOpacity(groupNode, undefined);
			validateOpacityAttribute(groupNode, null);

			// validate nodeF is set to rootOpacity
			validateOpacityAttribute(childNode, childOpacity.toString());
			// assert nodeF property is unchanged
			assert.strictEqual(childNode.opacity, childOpacity, "Node opacity property");

			// revert root opacity
			vsm.setOpacity(scene.getRootElement(), undefined);

			// validate child opacity is preserved
			validateOpacityAttribute(childNode, childOpacity.toString());
			// assert nodeF property is unchanged
			assert.strictEqual(childNode.opacity, childOpacity, "Node opacity property");

			// set Group01 opacity
			vsm.setOpacity(groupNode, groupOpacity);
			validateOpacityAttribute(groupNode, groupOpacity.toString());
			// assert nodeF property is unchanged
			assert.strictEqual(childNode.opacity, childOpacity, "Node opacity property");

			// revert nodeF opacity
			vsm.setOpacity(childNode, undefined);
			// validate childNode has opacity of Group01
			validateOpacityAttribute(groupNode, groupOpacity.toString());

			// revert Group01 opacity
			vsm.setOpacity(groupNode, undefined);
			// validate childNode has opacity undefined
			validateOpacityAttribute(childNode, null);
		}

		function testTintColor(vsm, node) {
			var descendants = getDescendants(node);
			var color = 0x87654321;

			vsm.setTintColor(node, color, false);
			assert.strictEqual(vsm.getTintColor(node, true), color, "Setting tint color " + node.name);
			assert.strictEqual(node.tintColor, color, "Setting tint color " + node.name);
			descendants.forEach(function(descendant) {
				assert.strictEqual(vsm.getTintColor(descendant, true), null, "Setting tint color " + descendant.name);
				assert.strictEqual(descendant.tintColor, undefined, "Setting tint color " + descendant.name);
			});

			vsm.setTintColor(node, color, true);
			assert.strictEqual(vsm.getTintColor(node, true), color, "Setting tint color recursively " + node.name);
			assert.strictEqual(node.tintColor, color, "Setting tint color recursively " + node.name);
			descendants.forEach(function(descendant) {
				assert.strictEqual(vsm.getTintColor(descendant, true), color, "Setting tint color recursively " + descendant.name);
				assert.strictEqual(descendant.tintColor, color, "Setting tint color recursively " + descendant.name);
			});

			vsm.setTintColor(node, null, false);
			assert.strictEqual(vsm.getTintColor(node, true), null, "Removing tint color " + node.name);
			assert.strictEqual(node.tintColor, undefined, "Removing tint color " + node.name);
			descendants.forEach(function(descendant) {
				assert.strictEqual(vsm.getTintColor(descendant, true), color, "Removing tint color " + descendant.name);
				assert.strictEqual(descendant.tintColor, color, "Removing tint color " + descendant.name);
			});

			vsm.setTintColor(node, null, true);
			assert.strictEqual(vsm.getTintColor(node, true), null, "Removing tint color recursively " + node.name);
			assert.strictEqual(node.tintColor, undefined, "Removing tint color recursively " + node.name);
			descendants.forEach(function(descendant) {
				assert.strictEqual(vsm.getTintColor(descendant, true), null, "Removing tint color recursively " + descendant.name);
				assert.strictEqual(descendant.tintColor, undefined, "Removing tint color recursively " + descendant.name);
			});
		}

		function testHighlightColor(vsm) {
			var originalColor = abgrToColor(0xBF0000BB);
			var setColor = { red: 10, green: 50, blue: 50, alpha: 0.4 };

			var originalColorRBGA = colorToABGR(originalColor);
			var setColorRBGA = colorToABGR(setColor);

			var originalColorCSS = colorToCSSColor(originalColor);
			var setColorCSS = colorToCSSColor(setColor);

			assert.equal(vsm.getHighlightColor(true), originalColorRBGA, "Original highlight color RBGA");
			assert.equal(vsm.getHighlightColor(), originalColorCSS, "Original highlight color CSS");

			vsm.setHighlightColor(setColorRBGA);
			assert.equal(vsm.getHighlightColor(true), setColorRBGA, "Setting highlighting color RBGA");

			vsm.setHighlightColor(originalColorRBGA);
			assert.equal(vsm.getHighlightColor(true), originalColorRBGA, "Restore highlighting color RBGA");

			vsm.setHighlightColor(setColorCSS);
			assert.equal(vsm.getHighlightColor(true), setColorRBGA, "Setting highlighting color CSS");
		}

		function testSelection(vsm, node) {
			var highlightColor = 0x12345678;
			vsm.setHighlightColor(highlightColor);
			assert.strictEqual(node.highlightColor, undefined, "Default highlight color " + node.name);

			vsm.setSelectionStates(node, [], false);
			node.traverse(function(child) {
				assert.strictEqual(vsm.getSelectionState(child), child === node, "Check selection " + child.name);
				assert.strictEqual(child.highlightColor, highlightColor, "Highligh color after selection " + child.name);
			});

			vsm.setSelectionStates([], node, false);
			node.traverse(function(child) {
				assert.strictEqual(vsm.getSelectionState(child), false, "Check deselection " + child.name);
				assert.strictEqual(child.highlightColor, undefined, "No highlighting " + child.name);
			});

			vsm.setSelectionStates(node, [], true);
			node.traverse(function(child) {
				assert.strictEqual(vsm.getSelectionState(child), true, "Selecting recursively " + child.name);
				assert.strictEqual(child.highlightColor, highlightColor, "Highlighting with selection " + child.name);
			});

			vsm.setSelectionStates([], node, true);
			node.traverse(function(child) {
				assert.strictEqual(vsm.getSelectionState(child), false, "Deselecting recursively " + child.name);
				assert.strictEqual(child.highlightColor, undefined, "Highlighting with selection " + child.name);
			});

			var child1 = node.children[1];
			var nodes = [node, child1, child1.children[0], child1.children[1], child1.children[2]];

			vsm.setSelectionStates([], nodes[0], true);
			assert.deepEqual(vsm.getSelectionState(nodes), [false, false, false, false, false], "All nodes are deselected.");

			vsm.setSelectionStates(nodes[0], [], false);
			assert.deepEqual(vsm.getSelectionState(nodes), [true, false, false, false, false], "Only the root parent is selected.");

			vsm.setRecursiveSelection(true);
			vsm.setSelectionStates(nodes[0], [], false);
			assert.deepEqual(vsm.getSelectionState(nodes), [true, true, true, true, true], "All nodes are selected.");

			vsm.setRecursiveSelection(false);
			vsm.setSelectionStates([], nodes[3], false);
			assert.deepEqual(vsm.getSelectionState(nodes), [true, true, true, false, true], "Only one child is deselected.");

			vsm.setRecursiveSelection(true);
			vsm.setSelectionStates([], nodes[3], false);
			assert.deepEqual(vsm.getSelectionState(nodes), [false, false, true, false, true], "One child and ancestors are deselected.");

			vsm.setSelectionStates(nodes[3], [], false);
			assert.deepEqual(vsm.getSelectionState(nodes), [false, false, true, true, true], "Children are selected, ancestors are deselected.");
		}

		// use the last mesh node as the selected node
		var nodes = [];
		scene.getRootElement().traverse(function(child) {
			nodes.push(child);
		});

		var groupNode = getNodeByName(nodes, "G01");

		testVisibility(vsm, groupNode);
		testOpacity(vsm, nodes);
		testTintColor(vsm, groupNode);
		testHighlightColor(vsm);
		testSelection(vsm, groupNode);

		done();
	});

	QUnit.test("BulkOperations - visibility", function(assert) {
		var done = assert.async();

		var scene = createTestScene();

		var vsm = new ViewStateManager();
		vsm._setScene(scene);

		var rectNodes = [];
		getAllChildRectNodes(scene.getRootElement(), rectNodes);

		vsm.setVisibilityState(rectNodes[0], false, false);
		vsm.setVisibilityState(rectNodes[2], false, false);

		var visibleCount = 0, hiddenCount = 0;
		var invertedVisibility = vsm.getVisibilityState(rectNodes).map(function(visible) {
			visible = !visible;

			if (visible) {
				visibleCount++;
			} else {
				hiddenCount++;
			}

			return visible;
		});

		vsm.attachEventOnce("visibilityChanged", function(event) {
			var visible = event.getParameter("visible");
			var hidden = event.getParameter("hidden");

			assert.ok(Array.isArray(visible), "visible event parameter ok");
			assert.strictEqual(visible.length, visibleCount, visibleCount + " elements visible");
			assert.ok(Array.isArray(hidden), "hidden event parameter ok");
			assert.strictEqual(hidden.length, hiddenCount, hiddenCount + " elements hidden");

			done();
		});

		vsm.setVisibilityState(rectNodes, invertedVisibility);
	});

	QUnit.test("BulkOperations - opacity", function(assert) {
		var done = assert.async();

		var scene = createTestScene();

		var vsm = new ViewStateManager();
		vsm._setScene(scene);

		var rectNodes = [];
		getAllChildRectNodes(scene.getRootElement(), rectNodes);

		var currentOpacity = vsm.getOpacity(rectNodes);
		var changedNodesCount = Math.min(3, currentOpacity.length);

		var changedOpacity = currentOpacity.map(function(opacity, i) {
			return i < changedNodesCount ? i * 0.1 : opacity;
		});

		vsm.attachEventOnce("opacityChanged", function(event) {
			var changed = event.getParameter("changed");
			var opacity = event.getParameter("opacity");

			assert.ok(Array.isArray(changed), "nodes array ok");
			assert.strictEqual(changed.length, changedNodesCount, "nodes array element count ok");
			assert.ok(Array.isArray(opacity), "opacity array ok");
			assert.strictEqual(opacity.length, changedNodesCount, "opacity array count ok");

			done();
		});

		vsm.setOpacity(rectNodes, changedOpacity);
	});

	QUnit.test("BulkOperations - tint color", function(assert) {
		var done = assert.async();

		var scene = createTestScene();

		var vsm = new ViewStateManager();
		vsm._setScene(scene);

		var rectNodes = [];
		getAllChildRectNodes(scene.getRootElement(), rectNodes);

		var currentTint = vsm.getTintColor(rectNodes);
		var changedNodesCount = Math.min(3, currentTint.length);

		var changedTint = currentTint.map(function(tintColor, i) {
			return i < changedNodesCount ? 0xFF << (i * 8) : tintColor;
		});

		vsm.attachEventOnce("tintColorChanged", function(event) {
			var changed = event.getParameter("changed");
			var tintColor = event.getParameter("tintColor");
			var tintColorABGR = event.getParameter("tintColorABGR");

			assert.ok(Array.isArray(changed), "nodes array ok");
			assert.strictEqual(changed.length, changedNodesCount, "nodes array element count ok");
			assert.ok(Array.isArray(tintColor), "tint color array ok");
			assert.strictEqual(tintColor.length, changedNodesCount, "tint color array count ok");
			assert.ok(Array.isArray(tintColorABGR), "tint color ABGR array ok");
			assert.strictEqual(tintColorABGR.length, changedNodesCount, "tint color ABGR array count ok");

			done();
		});

		vsm.setTintColor(rectNodes, changedTint);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
