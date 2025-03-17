/* global QUnit */

sap.ui.define([
	"sap/ui/vk/totara/SceneContext"
], function(
	SceneContext
) {
	"use strict";

	QUnit.test("test getPartialTreeNodes visibility", function(assert) {
		var loader = {
			scenebuilder: {},
			getMeshesBatchSize: function() { },
			getMaterialsBatchSize: function() { },
			getGeomMeshesBatchSize: function() { },
			getGeomMeshesMaxBatchDataSize: function() { },
			getAnnotationsBatchSize: function() { }
		};
		var sceneContext = new SceneContext(null, null, loader);
		var instanceNode = {
			children: [1],
			entityId: "123"
		};
		var elementNode = {};
		var treeNodes = [instanceNode, elementNode];

		var partialTreeNodes = sceneContext.getPartialTreeNodes(treeNodes);
		assert.equal(partialTreeNodes[0].visible, undefined, "Instance node visible");

		elementNode.visible = false;
		partialTreeNodes = sceneContext.getPartialTreeNodes(treeNodes);
		assert.equal(partialTreeNodes[0].visible, false, "Instance node not visible");

		instanceNode.visible = false;
		elementNode = {};
		treeNodes = [instanceNode, elementNode];
		sceneContext.getPartialTreeNodes(treeNodes);
		assert.equal(elementNode.visible, false, "Element node not visible");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});

});
