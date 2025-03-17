/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/m/App",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/threejs/v2/ViewStateManager",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	jQuery,
	App,
	ContentConnector,
	ContentResource,
	ViewStateManager
) {
	"use strict";

	QUnit.module("threejs.v2.ViewStateManager", {
		before: function(assert) {
			var that = this;
			return new Promise(function(resolve, reject) {
				var contentConnector = new ContentConnector({
					contentResources: [
						new ContentResource({
							source: "test-resources/sap/ui/vk/qunit/media/House.vds",
							sourceType: "vds4",
							sourceId: "abc"
						})
					],
					contentChangesFinished: function(event) {
						var failureReason = event.getParameter("failureReason");
						var content = event.getParameter("content");
						if (failureReason) {
							reject(new Error("Loading model failed."));
						} else if (content) {
							that.contentConnector = this;

							var nodeHierarchy = contentConnector.getContent().getDefaultNodeHierarchy();
							that.n = {
								land: nodeHierarchy.findNodesByName({ value: "Gelaende" })[0],
								house: nodeHierarchy.findNodesByName({ value: "FZK-Haus" })[0],
								attic: nodeHierarchy.findNodesByName({ value: "Dachgeschoss" })[0],
								roof1: nodeHierarchy.findNodesByName({ value: "Dach-1" })[0],
								roof2: nodeHierarchy.findNodesByName({ value: "Dach-2" })[0],
								dummy1: nodeHierarchy.findNodesByName({ value: "7" })[0], // there are empty group nodes 1..7, hidden by default
								groundFloor: nodeHierarchy.findNodesByName({ value: "Erdgeschoss" })[0],
								wall1: nodeHierarchy.findNodesByName({ value: "Wand-Ext-ERDG-1" })[0],
								wall2: nodeHierarchy.findNodesByName({ value: "Wand-Ext-ERDG-2" })[0],
								dummy2: nodeHierarchy.findNodesByName({ value: "1" })[0]  // there are empty group nodes 1..7, hidden by default
							};

							resolve();
						}
					}
				});
				var app = new App();
				app.addDependent(contentConnector);
				app.placeAt("content");
				nextUIUpdate.runSync();
			});
		},

		after: function(assert) {
			if (this.contentConnector) {
				this.contentConnector.destroy();
				this.contentConnector = null;
			}
			this.n = null;
		},

		beforeEach: function(assert) {
			if (this.contentConnector) {
				this.viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
			}
		},

		afterEach: function(assert) {
			if (this.viewStateManager) {
				this.viewStateManager.destroy();
				this.viewStateManager = null;
			}
		}
	});

	QUnit.test("Initial State", function(assert) {
		var vsm = this.viewStateManager;
		var nodeStates = vsm._nodeStates;
		assert.strictEqual(nodeStates.size, 0, "Initial state is empty");
	});

	QUnit.test("Visibility", function(assert) {
		var vsm = this.viewStateManager;
		var n = this.n;
		var nodeStates = vsm._nodeStates;

		vsm.setVisibilityState(n.roof1, false);
		assert.strictEqual(nodeStates.size, 1, "Hide roof1");

		vsm.setVisibilityState(n.roof1, true);
		assert.strictEqual(nodeStates.size, 0, "Show roof1");

		vsm.setVisibilityState([n.roof1, n.roof2], false);
		assert.strictEqual(nodeStates.size, 2, "Hide 2 roofs");

		vsm.setVisibilityState([n.roof1, n.roof2], true);
		assert.strictEqual(nodeStates.size, 0, "Show 2 roofs");

		vsm.setVisibilityState([n.roof1, n.roof2], [true, false]);
		assert.strictEqual(nodeStates.size, 1, "Show roof1, hide roof2");

		vsm.setVisibilityState([n.roof1, n.roof2], [false, true]);
		assert.strictEqual(nodeStates.size, 1, "Hide roof1, show roof2");

		vsm.setVisibilityState([n.roof1, n.roof2], false);
		assert.strictEqual(nodeStates.size, 2, "Hide roof1, hide roof2");

		vsm.setVisibilityState([n.roof1, n.roof2], true);
		assert.strictEqual(nodeStates.size, 0, "Show roof1, show roof2");

		vsm.setVisibilityState(n.house, false);
		assert.strictEqual(nodeStates.size, 1, "Hide house");

		vsm.setVisibilityState(n.house, false);
		assert.strictEqual(nodeStates.size, 1, "Hide house again");

		vsm.setVisibilityState(n.house, true);
		assert.strictEqual(nodeStates.size, 0, "Show house");

		vsm.setVisibilityState(n.house, true);
		assert.strictEqual(nodeStates.size, 0, "Show house again");

		vsm.setVisibilityState(n.house, false, true);
		// Nodes with names '1', ..., '7' are already hidden.
		assert.strictEqual(nodeStates.size, 99, "Hide house recursively");

		vsm.setVisibilityState(n.roof1, true, false, true);
		assert.strictEqual(nodeStates.size, 96, "Show roof1 and its ancestors recursively");

		vsm.setVisibilityState(n.house, true, true, false);
		// Nodes with names '1', ..., '7' are initially hidden, so they are the only ones in nodeStates.
		assert.strictEqual(nodeStates.size, 7, "Show house recursively");

		vsm.resetVisibility();
		assert.strictEqual(nodeStates.size, 0, "Visibility of all nodes restored");
	});

	QUnit.test("Selection - 1", function(assert) {
		var vsm = this.viewStateManager;
		var n = this.n;
		var nodeStates = vsm._nodeStates;

		vsm.setSelectionStates(n.house, []);
		assert.strictEqual(nodeStates.size, 258, "Select house");

		vsm.setSelectionStates([], n.house);
		assert.strictEqual(nodeStates.size, 0, "Deselect house");

		vsm.setSelectionStates([n.house, n.roof1], []);
		assert.strictEqual(nodeStates.size, 258, "Select house and roof1");

		vsm.setSelectionStates([], n.house);
		// The remaining selected node roof1 has a child with geometry, that's why `2`.
		assert.strictEqual(nodeStates.size, 2, "Deselect house");

		vsm.setSelectionStates([], n.roof1);
		assert.strictEqual(nodeStates.size, 0, "Deselect roof1");

		vsm.setSelectionStates(n.house, [], true);
		assert.strictEqual(nodeStates.size, 258, "Select house recursively");

		vsm.setSelectionStates([], n.house);
		assert.strictEqual(nodeStates.size, 257, "Deselect house non-recursively");

		vsm.setSelectionStates([], n.house, true);
		assert.strictEqual(nodeStates.size, 0, "Deselect house recursively");
	});

	QUnit.test("Selection - 2", function(assert) {
		var vsm = this.viewStateManager;
		var n = this.n;
		var nodeStates = vsm._nodeStates;

		vsm.setSelectionStates(n.house, n.roof1);
		var houseState = nodeStates.get(n.house);
		var roof1State = nodeStates.get(n.roof1);
		assert.strictEqual(nodeStates.size, 258, "Select house, deselect roof1");
		assert.notEqual(houseState.boundingBoxNode, null, "House has bounding box");
		assert.strictEqual(houseState.selected, true, "House selected");
		assert.strictEqual(houseState.ancestorSelected, false, "House's ancestor unselected");
		assert.equal(roof1State.boundingBoxNode, null, "Roof1 has no bounding box");
		assert.strictEqual(roof1State.selected, false, "Roof1 unselected");
		assert.strictEqual(roof1State.ancestorSelected, true, "Roof1's ancestor selected");
	});


	QUnit.test("Tint Color", function(assert) {
		var vsm = this.viewStateManager;
		var n = this.n;
		var nodeStates = vsm._nodeStates;

		vsm.setTintColor([n.house, n.roof1], ["green", "blue"]);
		assert.strictEqual(nodeStates.size, 258, "House is green and roof1 is blue");

		var houseState = nodeStates.get(n.house);
		var roof1State = nodeStates.get(n.roof1);

		var green = 0xff008000;
		var blue = 0xffff0000;

		assert.strictEqual(houseState.tintColor, green, "House is green");
		assert.equal(houseState.ancestorTintColor, null, "House's ancestor has no tint color");
		assert.strictEqual(roof1State.tintColor, blue, "Roof1 is blue");
		assert.strictEqual(roof1State.ancestorTintColor, houseState.tintColor, "Roof1's ancestor tint color is house's tint color");

		var greenTintColorCount = 0;
		var greenAncestorTintColor = 0;
		var blueTintColorCount = 0;
		var blueAncestorTintColor = 0;
		nodeStates.forEach(function(state) {
			if (state.tintColor === green) {
				greenTintColorCount += 1;
			} else if (state.tintColor === blue) {
				blueTintColorCount += 1;
			}
			if (state.ancestorTintColor === green) {
				greenAncestorTintColor += 1;
			} else if (state.ancestorTintColor === blue) {
				blueAncestorTintColor += 1;
			}
		});
		assert.strictEqual(greenTintColorCount, 1, "One node with own green color");
		assert.strictEqual(greenAncestorTintColor, 256, "256 nodes with inherited green color");
		assert.strictEqual(blueTintColorCount, 1, "One node with own blue color");
		assert.strictEqual(blueAncestorTintColor, 1, "One node with inherited blue color");

		vsm.setTintColor(n.house, null);
		assert.strictEqual(nodeStates.size, 2, "Remove tint color from house");
		assert.equal(roof1State.ancestorTintColor, null, "Roof1's ancestor tint color is null");
		assert.strictEqual(nodeStates.get(n.roof1.children[0]).ancestorTintColor, blue, "Roof1's child's ancestor tint color is blue");

		vsm.setTintColor(n.roof1, null);
		assert.strictEqual(nodeStates.size, 0, "Remove tint color from roof1");
	});

	QUnit.test("Opacity", function(assert) {
		var vsm = this.viewStateManager;

		var n = this.n;
		var nodeStates = vsm._nodeStates;

		vsm.setOpacity([n.house, n.roof1], [0.75, 0.5]);
		var roof1MeshState = nodeStates.get(n.roof1.children[0]);
		assert.strictEqual(roof1MeshState.material.opacity, 0.75 * 0.5, "Roof1 opacity is 0.75 * 0.5");

		vsm.setOpacity(n.house, null);
		assert.strictEqual(roof1MeshState.material.opacity, 0.5, "Roof1 opacity is 0.5");

		vsm.setOpacity(n.roof1, null);
		assert.strictEqual(nodeStates.size, 0, "Roof1 opacity is null");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
