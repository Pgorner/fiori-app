/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/Viewport",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/threejs/Material",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/ObjectType",
	"sap/ui/vk/cssColorToColor"
], function(
	nextUIUpdate,
	jQuery,
	ViewStateManager,
	Viewport,
	loader,
	Material,
	THREE,
	ObjectType,
	cssColorToColor
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	QUnit.moduleWithContentConnector("NodeHierarchy", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", "threejs.test.json", function(assert) {
		this.nodeHierarchy = this.contentConnector.getContent().getDefaultNodeHierarchy();
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);
	});

	QUnit.test("General", function(assert) {
		var nodes = this.nodeHierarchy.findNodesByName("");
		var node = this.nodeHierarchy.createNodeProxy(nodes[0]);
		assert.equal(node.getNodeHierarchy(), this.nodeHierarchy, "Node hierarchy reference");
		assert.equal(node.getNodeRef(), nodes[0], "Node reference");
		assert.equal(node.getNodeId(), nodes[0], "Node Id");
		assert.equal(node.getName(), "Box #5", "Group node name");
		assert.ok(node.getHasChildren(), "Has children");
		this.nodeHierarchy.destroyNodeProxy(node);
	});

	var materialTests = function(assert, node) {
		assert.equal(node.getMaterialId(), undefined, "Node does not have material");
		assert.ok(node.enumerateMaterials().length === 1, "Node has no materials to enumerate");
		assert.ok(node.enumerateMaterials(true).length === 1, "Recursive material enumeration");

		node.setOpacity(0.35);
		assert.equal(node.getOpacity(), 0.35, "Opacity set");

		node.setTintColorABGR(0x10a00020);
		assert.equal(node.getTintColorABGR(), 0x10a00020, "Tint color ABGR set");

		var color = "rgba(100,128,132,0.4)";
		node.setTintColor(color);
		assert.equal(node.getTintColor(), color, "Tint color set");

		var mat = new Material();
		mat.setName("testMaterial");
		mat.setOpacity(0.2);

		node.assignMaterial(mat);
		assert.equal(node.enumerateMaterials(true).length, 2, "Material has been added");

		var mat2 = new Material();
		mat2.setName("testMaterial2");
		mat2.setOpacity(0.2);

		mat2.id = '12';

		node.replaceMaterial(mat, mat2);
		assert.equal(node.getNodeRef().userData.materialId, "12");
		var matArr = node.enumerateMaterials(true);
		assert.equal(matArr.length, 2, "Material has not been added");
		assert.equal(matArr[1].getName(), "testMaterial2", "Material replaced");
	};

	QUnit.test("Materials with ViewStateManager", function(assert) {
		var nodes = this.nodeHierarchy.findNodesByName("");
		var node = this.nodeHierarchy.createNodeProxy(nodes[0]);
		materialTests(assert, node);
		this.nodeHierarchy.destroyNodeProxy(node);
	});

	QUnit.test("Materials without ViewStateManager", function(assert) {
		var nodes = this.nodeHierarchy.findNodesByName("");
		var node = this.nodeHierarchy.createNodeProxy(nodes[0]);

		// Remove view sate manager and run tests
		viewport.getImplementation().getScene().setViewStateManager(null);
		materialTests(assert, node);
		this.nodeHierarchy.destroyNodeProxy(node);
	});

	QUnit.test("Materials in seletecd node", function(assert) {
		var nodes = this.nodeHierarchy.findNodesByName("");
		var node = this.nodeHierarchy.createNodeProxy(nodes[4]);

		var DefaultHighlightingEmissive = {
			r: 0,
			g: 0,
			b: 1
		};

		var DefaultHighlightingSpecular = {
			r: 0,
			g: 1,
			b: 0
		};

		var mat1 = new Material();
		mat1._nativeMaterial.name = "test1";
		mat1._nativeMaterial.userData.defaultHighlightingEmissive = DefaultHighlightingEmissive;
		mat1._nativeMaterial.userData.defaultHighlightingSpecular = DefaultHighlightingSpecular;
		node.assignMaterial(mat1);

		viewStateManager.setHighlightColor("rgba(255, 0, 0, 1.0)");
		viewStateManager.setSelectionStates(node.getNodeRef(), []);

		var mat2 = new Material();
		mat2._nativeMaterial.name = "test2";
		mat2._nativeMaterial.userData.defaultHighlightingEmissive = DefaultHighlightingEmissive;
		mat2._nativeMaterial.userData.defaultHighlightingSpecular = DefaultHighlightingSpecular;
		mat2.setSpecularColour("rgba(200, 200, 200, 1.0)");
		mat2.setEmissiveColour("rgba(100, 100, 100, 1.0)");
		node.assignMaterial(mat2);

		var displayMaterial = new Material();
		displayMaterial.setMaterialRef(node.getNodeRef().material);;

		var specularC = displayMaterial.getSpecularColour();
		var specularColour = cssColorToColor(specularC);
		assert.ok(specularColour.red === 0 &&
			specularColour.green === 255 &&
			specularColour.blue === 0, "Specular colour set to default for selected node");

		var emissiveC = displayMaterial.getEmissiveColour();
		var emissiveColour = cssColorToColor(emissiveC);
		assert.ok(emissiveColour.red === 0 &&
			emissiveColour.green === 0 &&
			emissiveColour.blue === 255, "Emissive colour set to default for selected node");

		var mat3 = new Material();
		mat3._nativeMaterial.name = "test3";
		mat3._nativeMaterial.userData.defaultHighlightingEmissive = DefaultHighlightingEmissive;
		mat3._nativeMaterial.userData.defaultHighlightingSpecular = DefaultHighlightingSpecular;
		mat3.setSpecularColour("rgba(200, 200, 200, 1.0)");
		mat3.setEmissiveColour("rgba(100, 100, 100, 1.0)");

		viewStateManager.setHighlightColor("rgba(0, 0, 0, 0)");
		node.assignMaterial(mat3);

		displayMaterial.setMaterialRef(node.getNodeRef().material);

		specularC = displayMaterial.getSpecularColour();
		specularColour = cssColorToColor(specularC);
		assert.ok(specularColour.red === 200 &&
			specularColour.green === 200 &&
			specularColour.blue === 200, "Specular colour is not changed for selected node with complete transparent highlight colour");

		emissiveC = displayMaterial.getEmissiveColour();
		emissiveColour = cssColorToColor(emissiveC);
		assert.ok(emissiveColour.red === 100 &&
			emissiveColour.green === 100 &&
			emissiveColour.blue === 100, "Emissive colour is not changed for selected node with complete transparent highlight colour");

		this.nodeHierarchy.destroyNodeProxy(node);
	});

	QUnit.test("Materials with PMI and Hotspot child nodes", function(assert) {
		var nodes = this.nodeHierarchy.findNodesByName("");
		var childNode = nodes[0].children[1];

		var mat1 = new Material();
		mat1._nativeMaterial.name = "test1";

		var nodeProxy = this.nodeHierarchy.createNodeProxy(nodes[0]);
		var childProxy = this.nodeHierarchy.createNodeProxy(childNode);
		var matArr1 = nodeProxy.enumerateMaterials(true);
		var matArr2 = childProxy.enumerateMaterials(true);
		assert.equal(matArr1.length, 1, "Initial number of materials on parent node");
		assert.equal(matArr2.length, 1, "Initial number of materials on child node");
		assert.equal(matArr1[0]._nativeMaterial.name, "Explorer_Default", "Default material on parent node");
		assert.equal(matArr2[0]._nativeMaterial.name, "Explorer_Default", "Default material on child node");

		// Mark child node as hotspot and assign material to parent node
		childNode.userData.objectType = ObjectType.Hotspot;
		nodeProxy.assignMaterial(mat1);

		matArr1 = nodeProxy.enumerateMaterials(true);
		matArr2 = childProxy.enumerateMaterials(true);

		assert.equal(matArr1.length, 2, "Number of materials on parent node");
		assert.equal(matArr2.length, 1, "Number of materials on child hotspot node");
		assert.equal(matArr1[0]._nativeMaterial.name, "Explorer_Default", "Default material on parent node");
		assert.equal(matArr1[1]._nativeMaterial.name, "test1", "New material on parent node");
		assert.equal(matArr2[0]._nativeMaterial.name, "Explorer_Default", "Default material on child hotspot node");

		// Mark child node as PMI and assign material to parent node
		childNode.userData.objectType = ObjectType.PMI;
		var mat2 = new Material();
		mat2._nativeMaterial.name = "test2";
		nodeProxy.assignMaterial(mat2);

		matArr1 = nodeProxy.enumerateMaterials(true);
		matArr2 = childProxy.enumerateMaterials(true);

		assert.equal(matArr1.length, 2, "Number of materials on parent node");
		assert.equal(matArr2.length, 1, "Number of materials on child PMI node");
		assert.equal(matArr1[0]._nativeMaterial.name, "Explorer_Default", "Default material on parent node");
		assert.equal(matArr1[1]._nativeMaterial.name, "test2", "New material on parent node");
		assert.equal(matArr2[0]._nativeMaterial.name, "Explorer_Default", "Default material on child PMI node");

		// Child node is regular geometry node, assign material to parent node which should change child material as well
		delete childNode.userData.objectType;
		var mat3 = new Material();
		mat3._nativeMaterial.name = "test3";
		nodeProxy.assignMaterial(mat3);

		matArr1 = nodeProxy.enumerateMaterials(true);
		matArr2 = childProxy.enumerateMaterials(true);

		assert.equal(matArr1.length, 2, "Number of materials on parent node");
		assert.equal(matArr2.length, 1, "Number of materials on regular child node");
		assert.equal(matArr1[0]._nativeMaterial.name, "Explorer_Default", "Default material on parent node");
		assert.equal(matArr1[1]._nativeMaterial.name, "test3", "New material on parent node");
		assert.equal(matArr2[0]._nativeMaterial.name, "test3", "Default material on regular child node");
	});

	QUnit.test("Matrices", function(assert) {
		var nodes = this.nodeHierarchy.findNodesByName({ value: "Box #30" });
		var node = this.nodeHierarchy.createNodeProxy(nodes[0]);
		var ancestors = this.nodeHierarchy.getAncestors(nodes[0]);
		ancestors[0].userData.boundingBox = new THREE.Box3();
		assert.deepEqual(node.getLocalMatrix(), [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], "Local matrix value");
		node.setLocalMatrixNotUpdatingBBox([1, 0, 0, 0, 1, 0, 0, 0, 1, 2, 3, 4]);
		assert.deepEqual(node.getLocalMatrix(), [1, 0, 0, 0, 1, 0, 0, 0, 1, 2, 3, 4], "Local matrix modified value");
		var size = new THREE.Vector3();
		this.nodeHierarchy.getAncestors(nodes[0])[0].userData.boundingBox.getSize(size);
		assert.deepEqual({ x: size.x, y: size.y, z: size.z }, { x: 0, y: 0, z: 0 }, "Bounding box not set");
		node.setLocalMatrix([1, 0, 0, 0, 1, 0, 0, 0, 1, 5, 6, 7]);
		this.nodeHierarchy.getAncestors(nodes[0])[0].userData.boundingBox.getSize(size);
		assert.deepEqual(node.getLocalMatrix(), [1, 0, 0, 0, 1, 0, 0, 0, 1, 5, 6, 7], "Local matrix modified value");
		assert.notDeepEqual({ x: size.x, y: size.y, z: size.z }, { x: 0, y: 0, z: 0 }, "Bounding box set");

		assert.deepEqual(node.getWorldMatrix(), [1, 0, 0, 0, 1, 0, 0, 0, 1, 5, 56, 57], "World matrix value");
		node.setWorldMatrix([1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1]);
		assert.deepEqual(node.getWorldMatrix(), [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1], "World matrix modified value");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
