/* global QUnit, sinon*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/Viewport",
	"sap/ui/vk/NodeContentType",
	"sap/ui/vk/svg/ViewStateManager",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/svg/Ellipse",
	"sap/ui/vk/svg/Path",
	"sap/ui/vk/svg/HotspotHelper",
	"sap/ui/vk/tools/DuplicateSvgElementTool",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	Viewport,
	NodeContentType,
	ViewStateManager,
	SvgScene,
	Element,
	Rectangle,
	Ellipse,
	Path,
	HotspotHelper,
	DuplicateSvgElementTool,
	loader
) {
	"use strict";

	var viewStateManager;
	var viewport = new Viewport();
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	var emptyHotspotEffect = "url(#hotspot-effect-#00000000)";

	QUnit.moduleWithContentConnector("svg.Hotspots", "test-resources/sap/ui/vk/qunit/media/parametric_objects.vds", "vds4-2d", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);

		var nh = viewStateManager._scene.getDefaultNodeHierarchy();
		var sceneNode = viewStateManager._scene.getRootElement();
		var hotspotNode = nh.createNode(sceneNode.children[0], "NewHotspot", null, NodeContentType.Hotspot);
		var shape = new Rectangle({
			x: 100,
			y: 100,
			width: 100,
			height: 100
		});
		shape.userData = { skipId: true };
		hotspotNode.add(shape);

		/**
		 * 	All theoretically possible cases need to be tested - hence creating a complex hotspot hierarchy below.
		 *  Possible cases:
		 * 		- Hotspot with non-hotspot ancestors
		 * 		- Hotspot with non-hotspot and hotspot ancestors
		 *
		 * 	Also presence of Non-Identity TMAT leads to creation of a separate DOM node (<g>) - hence this needs
		 * 	to be tested with identity and non-identity tmats.
		 *
		 * 	Eventual hierarchy looks like below
		 * 		Root
		 * 		 .
		 * 		 .
		 * 		 |__ Hotspot Hierarchy 1 [Content Type: Hotspot, Tmat: Identity]
		 * 				|_ Something in between [Content Type: Regular, Tmat: Identity]
		 * 				|		|_ Hotspot Child1 [Content Type: Hotspot, Tmat: Identity]
		 * 	 			|		|	|_ Rectangle [Content Type: Regular, Tmat: Identity]
		 * 				|		|_ Hotspot Child2 [Content Type: Hotspot, Tmat: Non-Identity]
		 * 				|			|_ Rectangle [Content Type: Regular, Tmat: Identity]
		 * 				|
		 * 				|- Hotspot Child3 [Content Type: Hotspot, Tmat: Identity]
		 * 				|	|_ Rectangle [Content Type: Regular, Tmat: Identity]
		 * 				|
		 * 				|- Hotspot Child4 [Content Type: Hotspot, Tmat: Non-Identity]
		 * 				|	|_ Rectangle [Content Type: Regular, Tmat: Identity]
		 * 				|
		 *			 	|_ Something Else in between [Content Type: Regular, Tmat: Non-Identity]
		 * 				|		|_ Hotspot Child5 [Content Type: Hotspot, Tmat: Identity]
		 * 	 			|		|	|_ Rectangle [Content Type: Regular, Tmat: Identity]
		 * 				|		|_ Hotspot Child6 [Content Type: Hotspot, Tmat: Non-Identity]
		 * 				|			|_ Rectangle [Content Type: Regular, Tmat: Identity]
		 * 				|
		 * 				|- Hotspot Child7 [Content Type: Hotspot, Tmat: Identity]
		 * 				|	|_ Rectangle [Content Type: Regular, Tmat: Identity]
		 * 				|
		 * 				|- Hotspot Child8 [Content Type: Hotspot, Tmat: Non-Identity]
		 * 					|_ Rectangle [Content Type: Regular, Tmat: Identity]
		 *
		 * 	In the above, anything other than "Hotspot Hierarchy 1" that has its own dedicated domReference - can not have a "filter" attribute on it.
		 */

		var hotspotHierarchyNode = nh.createNode(sceneNode.children[0], "Hotspot Hierarchy 1", null, NodeContentType.Hotspot);

		var somethingInBetween = nh.createNode(hotspotHierarchyNode, "Something in between", null, NodeContentType.Regular);
		var hotspotChild1 = nh.createNode(somethingInBetween, "Hotspot Child1", null, NodeContentType.Hotspot);
		var hotspotGeometry1 = new Rectangle({
			x: 100,
			y: 300,
			width: 100,
			height: 100
		});

		hotspotChild1.add(hotspotGeometry1);

		// Presence of non-identity TMAT leads to a separate <g> being rendered - most likely use case
		// Else hotspotChild4.domRef is same as it's parent's domRef
		// Add two hotspots to test this scenario as well
		var hotspotChild2 = nh.createNode(somethingInBetween, "Hotspot Child2", null, NodeContentType.Hotspot, { matrix: new Float32Array([1, 0, 0, 1, -30, -20]) });
		var hotspotGeometry2 = new Rectangle({
			x: 300,
			y: 300,
			width: 100,
			height: 100
		});

		hotspotChild2.add(hotspotGeometry2);

		var hotspotChild3 = nh.createNode(hotspotHierarchyNode, "Hotspot Child3", null, NodeContentType.Hotspot);
		var hotspotGeometry3 = new Rectangle({
			x: 500,
			y: 300,
			width: 100,
			height: 100
		});

		hotspotChild3.add(hotspotGeometry3);

		var hotspotChild4 = nh.createNode(hotspotHierarchyNode, "Hotspot Child4", null, NodeContentType.Hotspot, { matrix: new Float32Array([1, 0, 0, 1, -30, -20]) });
		var hotspotGeometry4 = new Rectangle({
			x: 700,
			y: 300,
			width: 100,
			height: 100
		});

		hotspotChild4.add(hotspotGeometry4);

		var somethingElseInBetween = nh.createNode(hotspotHierarchyNode, "Something Else in between", null, NodeContentType.Regular, { matrix: new Float32Array([1, 0, 0, 1, -30, -20]) });
		var hotspotChild5 = nh.createNode(somethingElseInBetween, "Hotspot Child5", null, NodeContentType.Hotspot);
		var hotspotGeometry5 = new Rectangle({
			x: 100,
			y: 500,
			width: 100,
			height: 100
		});

		hotspotChild5.add(hotspotGeometry5);

		var hotspotChild6 = nh.createNode(somethingElseInBetween, "Hotspot Child6", null, NodeContentType.Hotspot, { matrix: new Float32Array([1, 0, 0, 1, -30, -20]) });
		var hotspotGeometry6 = new Rectangle({
			x: 300,
			y: 500,
			width: 100,
			height: 100
		});

		hotspotChild6.add(hotspotGeometry6);

		var hotspotChild7 = nh.createNode(hotspotHierarchyNode, "Hotspot Child7", null, NodeContentType.Hotspot);
		var hotspotGeometry7 = new Rectangle({
			x: 500,
			y: 500,
			width: 100,
			height: 100
		});

		hotspotChild7.add(hotspotGeometry7);

		var hotspotChild8 = nh.createNode(hotspotHierarchyNode, "Hotspot Child8", null, NodeContentType.Hotspot, { matrix: new Float32Array([1, 0, 0, 1, -30, -20]) });
		var hotspotGeometry8 = new Rectangle({
			x: 700,
			y: 500,
			width: 100,
			height: 100
		});

		hotspotChild8.add(hotspotGeometry8);

		// viewport.zoomTo("node", hotspotNode);
	}, function() {

	});

	QUnit.test("Loading scene", function(assert) {
		var scene = viewStateManager._scene;
		assert.ok(scene && scene instanceof SvgScene, "SVG VDS4 file is loaded");
		if (scene) {
			var nh = viewStateManager._scene.getDefaultNodeHierarchy();
			var sceneNode = viewStateManager._scene.getRootElement();
			assert.ok(sceneNode instanceof Element, "root element");
			assert.ok(sceneNode.children.length > 0, "root.children");

			var hotspots = nh.getHotspotNodeRefs();
			assert.ok(hotspots.length === 10, "Ten hotspots");
		} else {
			assert.ok(false, "Unable to load VDS4 file");
		}
	});

	QUnit.test("Visibility and appearance", function(assert) {
		var nh = viewStateManager._scene.getDefaultNodeHierarchy();
		var hotspotNodeIds = nh.getHotspotNodeRefs();
		var hotspot = hotspotNodeIds[0];
		var hotspotHierarchy = hotspotNodeIds[1];

		assert.ok(hotspot.domRef, "DomRef object");
		assert.equal(hotspot.domRef.getAttribute("opacity"), "0", "Initially invisible");
		assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), "0", "Initially invisible");
		for (var child1 of hotspotHierarchy.children[0].children) {
			assert.equal(child1.domRef.getAttribute("opacity"), "0", "Initially invisible");
		}

		viewport.setShowAllHotspots(true);
		assert.equal(hotspot.domRef.getAttribute("opacity"), "1", "All hotspots visible");
		assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), "1", "All hotspots visible");
		for (var child2 of hotspotHierarchy.children[0].children) {
			assert.equal(child2.domRef.getAttribute("opacity"), "1", "All hotspots visible");
		}

		viewport.setShowAllHotspots(false);
		assert.equal(hotspot.domRef.getAttribute("opacity"), "0", "All hotspots invisible");
		assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), "0", "All hotspots invisible");
		for (var child3 of hotspotHierarchy.children[0].children) {
			assert.equal(child3.domRef.getAttribute("opacity"), "0", "All hotspots invisible");
		}

		assert.equal(hotspot.domRef.getAttribute("filter"), emptyHotspotEffect, "Hotspots default effect");

		hotspotHierarchy.traverse(function(node) {
			if (node == hotspotHierarchy) {
				assert.equal(node.domRef.hasAttribute("filter"), true, "filter attribute present");
				assert.equal(node.domRef.getAttribute("filter"), emptyHotspotEffect, "filter attribute equals url(#hotspot-effect-#00000000)");
			} else {
				if (node.domRef !== node.parent.domRef) {
					assert.equal(node.domRef.hasAttribute("filter"), false, "filter attribute not present");
				}
			}
		});

		viewport.showHotspots([hotspot, hotspotHierarchy], true, "rgb(255,0,0)");
		assert.equal(hotspot.domRef.getAttribute("filter"), "url(#hotspot-effect-#ff0000ff)", "Hotspots custom effect");
		assert.equal(hotspot.domRef.getAttribute("opacity"), "1", "Hotspot is visible");

		hotspotHierarchy.traverse(function(node) {
			if (node == hotspotHierarchy) {
				assert.equal(node.domRef.hasAttribute("filter"), true, "filter attribute present");
				assert.equal(node.domRef.getAttribute("filter"), "url(#hotspot-effect-#ff0000ff)", "Hotspots custom effect");
			} else {
				if (node.domRef !== node.parent.domRef) {
					assert.equal(node.domRef.hasAttribute("filter"), false, "filter attribute not present");
				}
			}
		});

		viewport.showHotspots([hotspot, hotspotHierarchy], false);
		assert.equal(hotspot.domRef.getAttribute("filter"), emptyHotspotEffect, "Hotspots default effect again");
		assert.equal(hotspot.domRef.getAttribute("opacity"), "0", "Hotspot is not visible");

		hotspotHierarchy.traverse(function(node) {
			if (node == hotspotHierarchy) {
				assert.equal(node.domRef.hasAttribute("filter"), true, "filter attribute present");
				assert.equal(node.domRef.getAttribute("filter"), emptyHotspotEffect, "Hotspots default effect again");
			} else {
				if (node.domRef !== node.parent.domRef) {
					assert.equal(node.domRef.hasAttribute("filter"), false, "filter attribute not present");
				}
			}
		});

		viewport.showHotspots([hotspot, hotspotHierarchy], true, "rgba(0,128,0, 0.5)");
		assert.equal(hotspot.domRef.getAttribute("filter"), "url(#hotspot-effect-#0080007f)", "Hotspots custom effect with alpha");
		assert.equal(hotspot.domRef.getAttribute("opacity"), "1", "Hotspot is visible");

		hotspotHierarchy.traverse(function(node) {
			if (node == hotspotHierarchy) {
				assert.equal(node.domRef.hasAttribute("filter"), true, "filter attribute present");
				assert.equal(node.domRef.getAttribute("filter"), "url(#hotspot-effect-#0080007f)", "Hotspots custom effect with alpha");
			} else {
				if (node.domRef !== node.parent.domRef) {
					assert.equal(node.domRef.hasAttribute("filter"), false, "filter attribute not present");
				}
			}
		});

		viewport.showHotspots([hotspot, hotspotHierarchy], false);
		viewStateManager.setHighlightColor("rgba(255, 0, 0, 0.8)");
		viewStateManager.setSelectionStates(hotspot, []);

		viewport.setShowAllHotspots(true);
		assert.equal(hotspot.domRef.getAttribute("opacity"), "1", "Selected and showing hotspot has opacity of 1");

		viewport.setShowAllHotspots(false);
		assert.equal(hotspot.domRef.getAttribute("opacity"), "1", "Selected and not-showing hotspot has opacity of highlight color");
		assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), "0", "Non-selected and not-showing hotspot has opacity of 0");
		for (var child3 of hotspotHierarchy.children[0].children) {
			assert.equal(child3.domRef.getAttribute("opacity"), "0", "Non-selected and not-showing hotspot has opacity of 0");
		}

		viewport.showHotspots([hotspot, hotspotHierarchy], true, "rgba(0,128,0, 0.5)");
		assert.equal(hotspot.domRef.getAttribute("opacity"), "1", "Selected and showing hotspot has opacity of 1");

		viewport.showHotspots([hotspot, hotspotHierarchy], false);
		assert.equal(hotspot.domRef.getAttribute("opacity"), "1", "Selected hotspot and not-showing has opacity of highlight color");
		assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), "0", "Non-selected and not-showing hotspot has opacity of 0");
		for (var child3 of hotspotHierarchy.children[0].children) {
			assert.equal(child3.domRef.getAttribute("opacity"), "0", "Non-selected and not-showing hotspot has opacity of 0");
		}

	});

	QUnit.test("Hittest and selection", function(assert) {
		var nh = viewStateManager._scene.getDefaultNodeHierarchy();
		var hotspotNodeIds = nh.getHotspotNodeRefs();
		var hotspot = hotspotNodeIds[0];
		var hotspotHierarchy = hotspotNodeIds[1];
		var done = assert.async();

		var f = viewport.onAfterRendering;
		viewport.onAfterRendering = function() {
			f();
			viewport.onAfterRendering = f;

			var viewportRect = viewport.getDomRef().getBoundingClientRect();

			assert.equal(hotspot.domRef.getAttribute("opacity"), "0", "Initially invisible");

			var hoverEffect = "url(#hotspot-effect-#bb000059)";
			var selectionEffect = "url(#hotspot-effect-#bb0000bf)";

			var rect = hotspot.domRef.getBoundingClientRect();
			viewport.getImplementation().hover(rect.x - viewportRect.x + rect.width / 2, rect.y - viewportRect.y + rect.height / 2);

			assert.equal(hotspot.domRef.getAttribute("opacity"), 1, "Hover opacity");
			assert.equal(hotspot.domRef.getAttribute("filter"), hoverEffect, "Hover effect");

			viewport.getImplementation().hover(viewportRect.x + 1, viewportRect.y + 1);
			assert.equal(hotspot.domRef.getAttribute("opacity"), "0", "Again invisible");
			assert.equal(hotspot.domRef.getAttribute("filter"), emptyHotspotEffect, "Again no effect");

			viewStateManager.setSelectionStates([hotspot], []);
			assert.equal(hotspot.domRef.getAttribute("opacity"), 1, "Selection opacity");
			assert.equal(hotspot.domRef.getAttribute("filter"), selectionEffect, "Selection effect");

			viewport.getImplementation().hover(rect.x - viewportRect.x + rect.width / 2, rect.y - viewportRect.y + rect.height / 2);

			assert.equal(hotspot.domRef.getAttribute("opacity"), 1, "Hover over selection is ignored: opacity");
			assert.equal(hotspot.domRef.getAttribute("filter"), selectionEffect, "Hover over selection is ignored: effect");



			assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), "0", "Initially invisible");
			assert.equal(hotspotHierarchy.domRef.getAttribute("filter"), emptyHotspotEffect, "Initially no effect");

			// hotspotHierarchy.domRef could be quite huge and not all of it will produce hover effect.
			// Hence choosing a constituent
			rect = hotspotHierarchy.children[2].children[0].domRef.getBoundingClientRect();
			viewport.getImplementation().hover(rect.x - viewportRect.x + rect.width / 2, rect.y - viewportRect.y + rect.height / 2);

			assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), 1, "Hover makes it visible");
			assert.equal(hotspotHierarchy.domRef.getAttribute("filter"), hoverEffect, "Hover effect");

			viewport.getImplementation().hover(viewportRect.x + 1, viewportRect.y + 1);
			assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), "0", "Again invisible");
			assert.equal(hotspotHierarchy.domRef.getAttribute("filter"), emptyHotspotEffect, "Again no effect");

			viewStateManager.setSelectionStates([hotspotHierarchy], []);
			assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), 1, "Selection opacity");
			assert.equal(hotspotHierarchy.domRef.getAttribute("filter"), selectionEffect, "Selection effect");

			viewport.getImplementation().hover(rect.x - viewportRect.x + rect.width / 2, rect.y - viewportRect.y + rect.height / 2);

			assert.equal(hotspotHierarchy.domRef.getAttribute("opacity"), 1, "Hover over selection is ignored: opacity");
			assert.equal(hotspotHierarchy.domRef.getAttribute("filter"), selectionEffect, "Hover over selection is ignored: effect");

			done();
		};
		viewport.invalidate();
	});

	var rectIndex = 0;
	function createElementsRecursive(parent, array, level) {
		array.forEach(function(element) {
			if (Array.isArray(element)) {
				var g = new Element();
				g.sid = g.name = "G" + level + parent.children.length;
				parent.add(g);
				createElementsRecursive(g, element, level + 1);
			} else {
				var r = new Rectangle();
				r.sid = r.name = element;
				r.stroke = [0.5, 1, 1, 0.5];
				r.strokeWidth = 1.5;
				r.x = (rectIndex % 3) * 100 + r.strokeWidth * 0.5;
				r.y = Math.floor(rectIndex / 3) * 100 + r.strokeWidth * 0.5;
				r.width = 100 - r.strokeWidth;
				r.height = 100 - r.strokeWidth;
				r.fill = [0.5, 0.5, 0.5, 0.5];
				rectIndex++;
				parent.add(r);
			}
		});
	}

	QUnit.test("HotspotHelper and DuplicateSvgElementTool", function(assert) {
		var scene = viewStateManager._scene;
		var hotspotsRoot = new Element();
		scene.getRootElement().add(hotspotsRoot);
		// hotspotsRoot
		// ├─G00
		// │ ├─A
		// │ ├─B
		// │ └─C
		// └─G01
		//   ├─D
		//   ├─G11
		//   │ ├─E
		//   │ ├─F
		//   │ └─G
		//   └─H
		createElementsRecursive(hotspotsRoot, [["A", "B", "C"], ["D", ["E", "F", "G"], "H"]], 0);
		assert.strictEqual(hotspotsRoot.children.length, 2, "2 hotspots");

		var nodes = {};
		["A", "B", "C", "D", "E", "F", "G", "H"].forEach(function(name) {
			var node = nodes[name] = hotspotsRoot.getElementByProperty("name", name);
			assert.ok(node, "Node " + name + " found");
			assert.equal(node._vkGetNodeContentType(), NodeContentType.Regular, name + " regular content type");
		});

		nodes.A._vkSetNodeContentType(NodeContentType.Hotspot);
		assert.equal(nodes.A._vkGetNodeContentType(), NodeContentType.Hotspot, "A hotspot");
		nodes.F._vkSetNodeContentType(NodeContentType.Hotspot);
		assert.equal(nodes.F._vkGetNodeContentType(), NodeContentType.Hotspot, "F hotspot");

		var hotspotHelper = new HotspotHelper();

		createElementsRecursive(hotspotsRoot, ["B2"], 0);
		const B2 = hotspotsRoot.getElementByProperty("name", "B2");
		B2._vkSetNodeContentType(NodeContentType.Hotspot);
		assert.strictEqual(hotspotsRoot.children.length, 3, "3 hotspots");
		assert.equal(B2._vkGetNodeContentType(), NodeContentType.Hotspot, "B2 hotspot");
		assert.equal(B2.name, "B2", "B2 name");
		assert.equal(B2.constructor, Rectangle, "B2 class");
		assert.equal(B2.parent, hotspotsRoot, "B2 parent");
		assert.equal(B2.children.length, 0, "B2 children");

		createElementsRecursive(hotspotsRoot, ["EG"], 0);
		const EG = hotspotsRoot.getElementByProperty("name", "EG");
		EG._vkSetNodeContentType(NodeContentType.Hotspot);
		assert.strictEqual(hotspotsRoot.children.length, 4, "4 hotspots");
		assert.equal(EG._vkGetNodeContentType(), NodeContentType.Hotspot, "EG hotspot");
		assert.equal(EG.name, "EG", "EG name");
		assert.equal(EG.constructor, Rectangle, "EG class");
		assert.equal(EG.parent, hotspotsRoot, "EG parent");
		assert.equal(EG.children.length, 0, "EG children");

		viewport.getCamera()._zoomTo({ min: { x: 0, y: 0 }, max: { x: 300, y: 300 } }, 300, 300, 0);
		viewport.setFreezeCamera(true);

		function event(x, y) {
			var rectangle = viewport.getDomRef().getBoundingClientRect();
			var offset = {
				x: rectangle.left + window.pageXOffset,
				y: rectangle.top + window.pageYOffset
			};
			return { x: x + offset.x, y: y + offset.y, buttons: 1 };
		}

		var duplicateSvgElementTool = new DuplicateSvgElementTool({ parentNode: hotspotsRoot });
		viewport.addTool(duplicateSvgElementTool);
		duplicateSvgElementTool.setNodeList([nodes.A, EG]);
		var done = [assert.async(), assert.async()];
		duplicateSvgElementTool.attachNodesCreated(function(event) {
			var hnodes = event.getParameter("nodes");
			assert.ok(hnodes && hnodes.length === 2, "2 hotspots duplicated");
			assert.strictEqual(hotspotsRoot.children.length, done.length === 2 ? 6 : 8, "hotspots");
			var A2 = hnodes[0];
			var EG2 = hnodes[1];
			assert.equal(A2.name, "A", "A2 name");
			assert.equal(A2.constructor, Rectangle, "A2 class");
			assert.equal(A2._vkGetNodeContentType(), NodeContentType.Hotspot, "A2 hotspot");
			var expectedMatrix = new Float32Array(done.length === 2 ? [1, 0, 0, 1, -30, -20] : [1, 0, 0, 1, 0, 20]);
			assert.equal(A2.matrix.length, expectedMatrix.length, "A2 matrix");
			for (let i = 0; i < expectedMatrix.length; i++) {
				assert.ok(Math.abs(A2.matrix[i] - expectedMatrix[i]) < 1e-5);
			}
			assert.equal(A2.children.length, 0, "A2 no children");
			assert.equal(EG2.name, "EG", "EG2 name");
			assert.equal(EG2.constructor, Rectangle, "EG2 class");
			assert.equal(EG2._vkGetNodeContentType(), NodeContentType.Hotspot, "EG2 hotspot");
			assert.equal(EG2.matrix.length, expectedMatrix.length, "EG2 matrix");
			for (let i = 0; i < expectedMatrix.length; i++) {
				assert.ok(Math.abs(EG2.matrix[i] - expectedMatrix[i]) < 1e-5);
			}
			assert.equal(EG2.children.length, 0, "EG2 children");
			done.pop()();
		});
		duplicateSvgElementTool.setActive(true, viewport);
		assert.equal(duplicateSvgElementTool.getActive(), true, "duplicateSvgElementTool is active");
		duplicateSvgElementTool._handler.click(event(20, 30));
		assert.equal(duplicateSvgElementTool.getActive(), true, "duplicateSvgElementTool is still active");
		duplicateSvgElementTool._handler.click(event(50, 70));
		duplicateSvgElementTool.setActive(false, viewport);
		assert.equal(duplicateSvgElementTool.getActive(), false, "duplicateSvgElementTool is not active");
		assert.strictEqual(hotspotsRoot.children.length, 8, "8 hotspots");

		var B3 = hotspotHelper.duplicateHotspot(B2, hotspotsRoot, null, viewport)[0];
		assert.strictEqual(hotspotsRoot.children.length, 9, "9 hotspots");
		assert.ok(B3, "B2 duplicated");
		assert.equal(B3.name, "B2", "B3 name");
		assert.equal(B3.constructor, Rectangle, "B3 class");
		assert.equal(B3._vkGetNodeContentType(), NodeContentType.Hotspot, "B3 hotspot");
		assert.equal(B3.children.length, 0, "B3 children");
		assert.deepEqual(B3.matrix, new Float32Array([1, 0, 0, 1, 30, 30]), "B3 matrix");

		var EG3 = hotspotHelper.duplicateHotspot(EG, hotspotsRoot, [1, 0, 0, 1, 123, 234], viewport)[0];
		assert.strictEqual(hotspotsRoot.children.length, 10, "10 hotspots");
		assert.ok(EG3, "EG duplicated");
		assert.equal(EG3.name, "EG", "EG3 name");
		assert.equal(EG3.constructor, Rectangle, "EG3 class");
		assert.equal(EG3._vkGetNodeContentType(), NodeContentType.Hotspot, "EG3 hotspot");
		assert.equal(EG3.children.length, 0, "EG3 children");
		assert.deepEqual(EG3.matrix, new Float32Array([1, 0, 0, 1, 123, 234]), "EG3 matrix");

		scene.getDefaultNodeHierarchy().removeNode(B3);
		assert.strictEqual(hotspotsRoot.children.length, 9, "9 hotspots");

		viewStateManager.getCurrentView = sinon.stub().returns({
			getViewId: sinon.stub().returns("something"),
			getName: sinon.stub().returns("some other thing")
		});

		var Bcopy = scene.getDefaultNodeHierarchy().createNodeCopy(nodes.B, nodes.B.parent, "BCopy");
		Bcopy._vkSetNodeContentType("Hotspot");

		var Ecopy = scene.getDefaultNodeHierarchy().createNodeCopy(nodes.E, nodes.E.parent, "ECopy");
		Ecopy._vkSetNodeContentType("Hotspot");

		var Gcopy = scene.getDefaultNodeHierarchy().createNodeCopy(nodes.G, nodes.G.parent, "GCopy");
		Gcopy._vkSetNodeContentType("Hotspot");


		var B4 = scene.getDefaultNodeHierarchy().createNode(hotspotsRoot, "B4", null, "Hotspot");
		B4.add(Bcopy);

		var EG4 = scene.getDefaultNodeHierarchy().createNode(hotspotsRoot, "EG4", null, "Hotspot");
		EG4.add(Ecopy);
		EG4.add(Gcopy);

		assert.strictEqual(hotspotsRoot.children.length, 11, "11 hotspots");

		var B4EG4 = hotspotHelper.mergeHotspots(scene, [B4, EG4]);
		assert.strictEqual(B4EG4.nodeRef.children.length, 3, "2 from EG4, 1 from B4");
		assert.equal(B4EG4.nodeRef._vkGetNodeContentType(), NodeContentType.Hotspot, "B4EG4 hotspot");
		assert.equal(B4EG4.nodeRef.name, "B4", "B4 (first selected) name");

		viewStateManager.getCurrentView.reset();
	});

	QUnit.test("HotspotHelper.mergeElements", function(assert) {
		var scene = viewStateManager._scene;
		var root = new Element();
		scene.getRootElement().add(root);
		createElementsRecursive(root, [["A", "B", "C"], ["D", ["E", "F", "G"], "H"]], 0);
		assert.strictEqual(root.children.length, 2, "2 group nodes created");

		var hotspotHelper = new HotspotHelper();
		var g0 = root.children[0];
		var g1 = root.children[1];
		assert.strictEqual(g0.children.length, 3, "g0 3 children");
		assert.strictEqual(g1.children.length, 3, "g1 3 children");
		var g11 = g1.children[1];
		assert.strictEqual(g11.children.length, 3, "g11 3 children");

		var result = hotspotHelper.mergeElements(scene.getDefaultNodeHierarchy(),
			[g0.children[1], g1.children[0], g11.children[1], g11]); // B, D, F, [E, F, G]

		var request = result.request;
		assert.ok(request, "merge request created");
		assert.ok(result.nodeRef, "merged node created");
		assert.strictEqual(result.nodeRef.name, "B", "merged node name");
		assert.strictEqual(result.nodeRef.children.length, 5, "5 geometries merged");
		assert.strictEqual(result.nodeRef.children.map(n => n.name).sort().join(','), "B,D,E,F,G", "merged geometry names");
		assert.strictEqual(request.parametrics && request.parametrics.length, 1, "request.parametrics");
		assert.strictEqual(request.fillStyles && request.fillStyles.length, 1, "request.fillstyles");
		assert.strictEqual(request.lineStyles && request.lineStyles.length, 1, "request.linestyles");
		assert.strictEqual(request.textStyles, undefined, "no request.textStyles");
		assert.strictEqual(request.nodes.length, 5, "request.nodes");
		assert.strictEqual(request.nodes.map(n => n.name).join(','), "B,,,,", "node.name");
		assert.strictEqual(request.nodes.map(n => n.sid).join(','), ",B,D,F,G11", "node.sid");
		assert.strictEqual(request.nodes.map(n => n.contentType).join(','), "geometry,,,,", "node.contentType");
		assert.strictEqual(request.nodes.map(n => n.parametric).join(','), "0,,,,", "node.parametric");
		assert.strictEqual(request.fillStyles[0].colour, "#7f7f7f7f", "fillstyle.colour");
		assert.strictEqual(request.lineStyles[0].colour, "#7fffff7f", "linestyle.colour");
		assert.strictEqual(request.lineStyles[0].width, "1.5px", "linestyle.width");
		var parametric = request.parametrics[0];
		assert.strictEqual(parametric.shapes && parametric.shapes.length, 5, "parametric.shapes");
		assert.strictEqual(parametric.shapes.map(n => n.fill).join(','), "0,0,0,0,0", "shape.fill");
		assert.strictEqual(parametric.shapes.map(n => n.type).join(','), "rectangle,rectangle,rectangle,rectangle,rectangle", "shape.type");
	});

	QUnit.test("HotspotHelper.createHotspotFromGeometry", function(assert) {
		var done = assert.async();
		var scene = viewStateManager._scene;
		var root = new Element();
		scene.getRootElement().add(root);

		var ellipse = new Ellipse({
			name: "ellipse-1",
			major: 100,
			minor: 70,
			matrix: [-0.2225, 0.9749, -0.9749, -0.2225, -50, 60]
		});

		var rect = new Rectangle({
			name: "rect-1",
			x: -150,
			y: -360,
			width: 100,
			height: 200,
			matrix: [0.2225, -0.9749, 0.9749, 0.2225, 240, -50]
		});

		root.add(rect);
		root.add(ellipse);

		var group = new Element({ matrix: [0.9659, -0.2588, 0.2588, 0.9659, -10, 20] });
		root.add(group);

		var hotspotHelper = new HotspotHelper();
		hotspotHelper.createHotspotFromGeometry([ellipse, rect], scene.getDefaultNodeHierarchy(), group).then(
			function(hotpost) {
				assert.ok(hotpost && hotpost._vkGetNodeContentType() === NodeContentType.Hotspot, "hotspot created");
				assert.ok(hotpost.children.length === 1 && hotpost.children[0] instanceof Path, "one path child created");

				assert.deepEqual(Array.from(hotpost.matrix).map(n => Math.round(n * 1000) / 1000), [0.27, 0.072, -0.072, 0.27, -110.733, -147.773], "hotpost matrix");

				assert.ok(hotpost.children[0].segments.length > 5, "path segments created");

				done();
			}
		);
	});

	QUnit.done(function() {
		// jQuery("#content").hide();
	});
});
