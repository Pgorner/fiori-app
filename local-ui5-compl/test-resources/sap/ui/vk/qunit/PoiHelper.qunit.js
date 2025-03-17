/* global QUnit, sinon*/

sap.ui.define([
	'sap/ui/vk/threejs/PoiHelper',
	'sap/ui/vk/thirdparty/three'
], function(
	PoiHelper,
	THREE
) {
	"use strict";
	const poiHelper = new PoiHelper();

	// Write a cache item so that we can get symol
	QUnit.test("Test create Poi function", async function(assert) {
		const url = "test";
		const symbolSceneId = "0";
		poiHelper._symbolSceneCache.push({
			url: url, sceneId: symbolSceneId, rootNodeRef: {
				clone: sinon.stub().returns({
					userData: {
						entityId: "0"
					}
				})
			}
		});
		const scene = {
			getDefaultNodeHierarchy: sinon.stub().returns({
				createNode: sinon.stub().returns({
					add: {
						apply: sinon.stub().returns({})
					},
					children: [],
					userData: {
						treeNode: {

						}
					}
				})
			})
		};
		const viewport = {
			getDomRef: sinon.stub().returns({
				getBoundingClientRect: sinon.stub().returns({ top: 0, left: 0 })
			}),
			setShouldRenderFrame: sinon.stub().returns({}),
			_getNativeCamera: sinon.stub().returns({ quaternion: { _x: 0, _y: 0, _z: 0, _w: 1 } }),
			hitTest: sinon.stub().returns({ point: { x: 100, y: 100, z: 100 } }),
			getCurrentView: sinon.stub().returns({
				updateNodeInfos: sinon.stub().returns({})
			})
		};
		const position = { x: 0, y: 0 };
		const nodeInfo = {};

		const nodeMatrix = new THREE.Matrix4().compose({ x: 100, y: 100, z: 100 }, { _x: 0, _y: 0, _z: 0, _w: 1 }, new THREE.Vector3(1, 1, 1));
		const getNearestEntityOrVisibleElementNodes = sinon.stub().returns(
			[{
				matrixWorld: nodeMatrix,
				userData: { nodeId: "1234" }
			}]
		);
		const result = await poiHelper.createPOI(url, scene, "0", viewport, position, nodeInfo, getNearestEntityOrVisibleElementNodes);
		assert.notEqual(result, null, "Should have something from the result");
		assert.equal(result.contentType, "SYMBOL", "Content type should be 'SYMBOL'");
		assert.equal(result.referenceNode, "1234", "Reference node sid should be '1234'");
		assert.equal(result.transformType, "BILLBOARD_VIEW", "Transform type should be billboard view");
		assert.deepEqual(result.transform, [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);
	});
});
