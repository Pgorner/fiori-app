/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/Scene",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/AnimationMath",
	"sap/ui/vk/AnimationPlayer",
	"sap/ui/vk/AnimationPlayback",
	"sap/ui/vk/AnimationTrackType",
	"sap/ui/vk/AnimationTrackValueType",
	"sap/ui/vk/View",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/ViewManager",
	"sap/ui/vk/NodeContentType"
], function(
	nextUIUpdate,
	jQuery,
	Scene,
	ViewStateManager,
	Viewport,
	AnimationMath,
	AnimationPlayer,
	AnimationPlayback,
	AnimationTrackType,
	AnimationTrackValueType,
	View,
	loader,
	THREE,
	ViewManager,
	NodeContentType
) {
	"use strict";

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

	var viewport = new Viewport();
	var viewStateManager, animationPlayer, viewManager;
	viewport.placeAt("content");
	nextUIUpdate.runSync();
	var nodes;
	var view;
	var scene;
	var node1, node2;
	var rnode1, rnode2;
	var sequence1, sequence2;
	var playback1, playback2;

	QUnit.moduleWithContentConnector("AnimationLoad", "test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);

		animationPlayer = new AnimationPlayer({
			viewStateManager: viewStateManager
		});

		viewManager = new ViewManager({
			contentConnector: this.contentConnector,
			animationPlayer: animationPlayer
		});

		viewStateManager.setViewManager(viewManager);

		scene = viewport.getScene();
		var nativeScene = scene.getSceneRef();

		nodes = [];
		getAllChildNodes(nativeScene, nodes);

		var nodeInfos = [];
		var i;
		var nodeInfo;
		for (i = 0; i < nodes.length; i++) {
			nodeInfo = {};
			nodeInfo.target = nodes[i];
			nodeInfo.transform = nodes[i].matrix.elements.slice();
			nodeInfo.opacity = 1.0;
			nodeInfos.push(nodeInfo);
		}

		view = scene.createView({
			name: "Step 1",
			description: "sdfsdfsfds",
			viewId: "i0000000300000001"
		});
		view.setNodeInfos(nodeInfos);

		node1 = nodes[nodes.length - 10];
		nodeInfos[nodes.length - 10].opacity = 0.9;
		node2 = nodes[nodes.length - 6];

		var x = node1.matrixWorld.elements[12];
		var y = node1.matrixWorld.elements[13];
		var z = node1.matrixWorld.elements[14];

		var nodeHierarchy = scene.getDefaultNodeHierarchy();
		rnode1 = nodeHierarchy.createNode(scene.getSceneRef(), "rnode1", null, NodeContentType.Reference);
		rnode1.position.x = x;
		rnode1.position.y = y;
		rnode1.position.z = z;
		rnode1.updateMatrix();

		nodeInfo = [{ target: rnode1, transform: rnode1.matrix.elements.slice() }];
		view.updateNodeInfos(nodeInfo);

		x = node2.matrixWorld.elements[12];
		y = node2.matrixWorld.elements[13];
		z = node2.matrixWorld.elements[14];

		rnode2 = nodeHierarchy.createNode(scene.getSceneRef(), "rnode2", null, NodeContentType.Reference);
		rnode2.position.x = x;
		rnode2.position.y = y;
		rnode2.position.z = z;
		rnode2.updateMatrix();

		nodeInfo = [{ target: rnode2, transform: rnode2.matrix.elements.slice() }];
		view.updateNodeInfos(nodeInfo);

		sequence1 = scene.createSequence("sq1", {
			name: "sequenceName1",
			duration: 1
		});
		playback1 = new AnimationPlayback("plbk1");
		playback1.setSequence(sequence1);
		view.addPlayback(playback1);

		sequence2 = scene.createSequence("sq2");
		playback2 = new AnimationPlayback();
		playback2.setSequence(sequence2);
		view.addPlayback(playback2);
	});

	QUnit.test("Animation - sequence and playback", function(assert) {

		assert.equal(playback1.getId(), "plbk1", "playback ID");
		assert.equal(playback1.getStartTime(), 0, "playback start time");
		assert.equal(playback1.getSequence(), sequence1, "playback sequence");
		assert.equal(playback1.getTimeScale(), 1, "playback speed");
		assert.equal(playback1.getPreDelay(), 0, "playback pre delay");
		assert.equal(playback1.getPostDelay(), 0, "playback post delay");
		assert.equal(playback1.getRepeats(), 1, "playback repeat count");
		assert.equal(playback1.getReversed(), false, "playback direction");

		playback2.setStartTime(1);
		playback2.setSequence(sequence2);
		playback2.setTimeScale(0.5);
		playback2.setPreDelay(2);
		playback2.setPostDelay(3);
		playback2.setRepeats(4);
		playback2.setReversed(true);

		assert.equal(playback2.getStartTime(), 1, "playback start time");
		assert.equal(playback2.getSequence(), sequence2, "playback sequence");
		assert.equal(playback2.getTimeScale(), 0.5, "playback speed");
		assert.equal(playback2.getPreDelay(), 2, "playback pre delay");
		assert.equal(playback2.getPostDelay(), 3, "playback post delay");
		assert.equal(playback2.getRepeats(), 4, "playback repeat count");
		assert.equal(playback2.getReversed(), true, "playback direction");

		playback2.setTimeScale(1);
		playback2.setPreDelay(0);
		playback2.setPostDelay(0);
		playback2.setRepeats(1);
		playback2.setReversed(false);

		assert.deepEqual(scene.getSequences(), [sequence1, sequence2], "sequence list in the scene");

		assert.equal(sequence1.getId(), "sq1", "sequence ID");
		assert.equal(sequence1.getName(), "sequenceName1", "sequence name after creation");

		sequence2.setName("sequenceName2");
		assert.equal(sequence2.getName(), "sequenceName2", "sequence name after update");

		sequence2.setDuration(2.0);
		assert.equal(sequence2.getDuration(), 2.0, "sequence duration after update");

		var joints = [];
		var joint1 = {};
		joint1.parent = rnode1;
		joint1.node = node1;
		joints.push(joint1);
		var joint2 = {};
		joint2.parent = rnode1;
		joint2.node = node2;
		joints.push(joint2);

		sequence1.setJoint(joints);
		var allJoints = sequence1.getJoint();
		assert.ok(allJoints[0].parent === rnode1 && allJoints[0].node === node1 && allJoints[1].parent === rnode1 && allJoints[1].node === node2, "set joint and get all joints");
		allJoints = sequence1.getJoint({ node: node1 });
		assert.ok(allJoints[0].parent === rnode1 && allJoints[0].node === node1, "get joint by chid");
		allJoints = sequence1.getJoint({ parent: rnode1 });
		assert.ok(allJoints[0].parent === rnode1 && allJoints[0].node === node1 && allJoints[1].parent === rnode1 && allJoints[1].node === node2, "get joints by parent");

		sequence1.removeJoint({ node: node1 });
		allJoints = sequence1.getJoint();
		assert.ok(allJoints[0].parent === rnode1 && allJoints[0].node === node2, "remove joint by chid");
		sequence1.removeJoint();
		allJoints = sequence1.getJoint();
		assert.ok(!allJoints.length, "remove all joints");

		sequence1.setJoint([joint1]);

		joint2.parent = rnode2;
		joint2.node = node2;
		sequence2.setJoint([joint2]);

		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3
		});
		var keyValue1 = [1, 2, 3];
		track1.insertKey(0, keyValue1);

		var track2 = scene.createTrack("trk2", {
			trackValueType: AnimationTrackValueType.Vector3
		});
		var keyValue2 = [1, 2, 3];
		track2.insertKey(0, keyValue2);

		sequence1.setNodeAnimation(node1, AnimationTrackType.Translate, track1);
		sequence1.setNodeAnimation(node1, AnimationTrackType.Scale, track2);
		assert.equal(sequence1.getNodeAnimation(node1, AnimationTrackType.Translate), track1, "animation for node - node and property set");
		assert.equal(sequence1.getNodeAnimation(node1, AnimationTrackType.Rotate), null, "animation for node - node and another property set");
		sequence1.removeNodeAnimation(node1, AnimationTrackType.Translate);
		assert.equal(sequence1.getNodeAnimation(node1, AnimationTrackType.Translate), null, "animation for node - remove node animation by property");
		sequence1.removeNodeAnimation(node1);
		assert.equal(sequence1.getNodeAnimation(node1), undefined, "animation for node - remove node animation by property");
	});

	QUnit.test("Animation - translation", function(assert) {

		// tracks
		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		assert.deepEqual(scene.getTracks(), [track1], "track list in the scene");

		assert.equal(track1.getId(), "trk1", "track ID");
		assert.equal(track1.getKeysType(), AnimationTrackValueType.Vector3, "track key type after creation");
		assert.equal(track1.getKeysCount(), 0, "track key count after creation");

		var keyValue1 = [1, 2, 3];
		track1.insertKey(0, keyValue1);
		var keyValue2 = [10, 20, 30];
		track1.insertKey(1, keyValue2);
		assert.equal(track1.getKeysCount(), 2, "track key count after key creation");

		var key = track1.getKey(0);
		assert.equal(key.time, 0, "track key time after key creation");
		assert.deepEqual(key.value, keyValue1, "track key value after key creation");

		keyValue1 = [0, 0, 0];
		track1.updateKey(0, keyValue1);

		key = track1.getKey(0);
		assert.equal(key.time, 0, "track key time after key update");
		assert.deepEqual(key.value, keyValue1, "track key value after key update");

		var keyIndex = track1.findKeyIndex(0.8);
		assert.equal(keyIndex, 1, "track key index after find");

		track1.removeKey(0);
		assert.equal(track1.getKeysCount(), 1, "track key count after removeKey");
		track1.insertKey(0, keyValue1);

		var playbacks = view.getPlaybacks();
		var sequence1 = playbacks[0].getSequence();

		var joint1 = {};
		joint1.parent = rnode1;
		joint1.node = node1;
		sequence1.setJoint([joint1]);

		var rtrack1 = scene.createTrack("rtrk1", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		keyValue1 = [0, 0, 0];
		rtrack1.insertKey(0, keyValue1);
		keyValue2 = [5, 5, 5];
		rtrack1.insertKey(1, keyValue2);

		sequence1.setNodeAnimation(node1, AnimationTrackType.Translate, track1);
		assert.equal(sequence1.getNodeAnimation(node1, AnimationTrackType.Translate), track1, "animation for node - node and property set");
		assert.equal(sequence1.getNodeAnimation(node1, AnimationTrackType.Rotate), null, "animation for node - node and another property set");

		sequence1.setNodeAnimation(rnode1, AnimationTrackType.Translate, rtrack1);

		viewManager.activateView(view);
		animationPlayer.activateView(view);
		animationPlayer.setTime(0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		var property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Translate);
		assert.deepEqual(property1.offsetToRest, [0, 0, 0], "node1 offset to rest at time 0");
		assert.deepEqual(property1.offsetToPrevious, [0, 0, 0], "node1 offset to previous at time 0");
		assert.deepEqual(property1.absolute, [0, 0, 0], "node1 local coordinates at time 0");
		assert.deepEqual(property1.world, [0, 0, 0], "node1 world coordinates at time 0");
		assert.deepEqual(property2.offsetToRest, [0, 0, 0], "reference node1 offset to rest at time 0");
		assert.deepEqual(property2.offsetToPrevious, [0, 0, 0], "reference node1 offset to previous at time 0");
		assert.deepEqual(property2.absolute, [0, 0, 0], "reference node1 local coordinates at time 0");
		assert.deepEqual(property2.world, [0, 0, 0], "reference node1 world coordinates at time 0");

		animationPlayer.setTime(1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Translate);
		assert.deepEqual(property1.offsetToRest, [10, 20, 30], "node1 offset to rest at time 1");
		assert.deepEqual(property1.offsetToPrevious, [10, 20, 30], "node1 offset to previous at time 1");
		assert.deepEqual(property1.absolute, [10, 20, 30], "node1 local coordinates at time 1");
		assert.deepEqual(property1.world, [15, 25, 35], "node1 world coordinates at time 1");
		assert.deepEqual(property2.offsetToRest, [5, 5, 5], "reference node1 offset to rest at time 1");
		assert.deepEqual(property2.offsetToPrevious, [5, 5, 5], "reference node1 offset to previous at time 1");
		assert.deepEqual(property2.absolute, [5, 5, 5], "reference node1 local coordinates at time 1");
		assert.deepEqual(property2.world, [5, 5, 5], "reference node1 world coordinates at time 1");

		animationPlayer.setTime(0.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Translate);
		assert.deepEqual(property1.offsetToRest, [5, 10, 15], "node1 offset to rest at time 0.5");
		assert.deepEqual(property1.offsetToPrevious, [5, 10, 15], "node1 offset to previous at time 0.5");
		assert.deepEqual(property1.absolute, [5, 10, 15], "node1 local coordinates at time 0.5");
		assert.deepEqual(property1.world, [7.5, 12.5, 17.5], "node1 world coordinates at time 0.5");
		assert.deepEqual(property2.offsetToRest, [2.5, 2.5, 2.5], "reference node1 offset to rest at time 0.5");
		assert.deepEqual(property2.offsetToPrevious, [2.5, 2.5, 2.5], "reference node1 offset to previous at time 0.5");
		assert.deepEqual(property2.absolute, [2.5, 2.5, 2.5], "reference node1 local coordinates at time 0.5");
		assert.deepEqual(property2.world, [2.5, 2.5, 2.5], "reference node1 world coordinates at time 0.5");

		var track2 = scene.createTrack("trk2", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		keyValue1 = [0, 0, 0];
		track2.insertKey(0, keyValue1);
		keyValue2 = [10, 10, 10];
		track2.insertKey(2, keyValue2);

		var rtrack2 = scene.createTrack("rtrk2", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		keyValue1 = [0, 0, 0];
		rtrack2.insertKey(0, keyValue1);
		keyValue2 = [10, 10, 10];
		rtrack2.insertKey(2, keyValue2);
		var sequence2 = playbacks[1].getSequence();
		var joint2 = {};
		joint2.parent = rnode2;
		joint2.node = node1;
		sequence2.setJoint([joint2]);

		sequence2.setNodeAnimation(node1, AnimationTrackType.Translate, track2);
		sequence2.setNodeAnimation(rnode2, AnimationTrackType.Translate, rtrack2);
		sequence2.resetDuration();

		view.resetPlaybacksStartTimes();

		animationPlayer.setTime(0, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Translate);
		assert.deepEqual(property1.offsetToRest, [0, 0, 0], "node1 offset to rest at time 0 of the 2nd playback");
		assert.deepEqual(property1.offsetToPrevious, [0, 0, 0], "node1 offset to previous at time 0 of the 2nd playback");
		assert.deepEqual(property1.absolute, [0, 0, 0], "node1 local coordinates at time 0 of the 2nd playback");
		assert.deepEqual(property1.world, [15, 25, 35], "node1 world coordinates at time 0 of the 2nd playback");
		assert.deepEqual(property2.offsetToRest, [0, 0, 0], "reference node2 offset to rest at time 0 of the 2nd playback");
		assert.deepEqual(property2.offsetToPrevious, [0, 0, 0], "reference node2 offset to previous at time 0 of the 2nd playback");
		assert.deepEqual(property2.absolute, [0, 0, 0], "reference node2 local coordinates at time 0 of the 2nd playback");
		assert.deepEqual(property2.world, [0, 0, 0], "reference node2 world coordinates at time 0 of the 2nd playback");

		animationPlayer.setTime(1, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Translate);
		assert.deepEqual(property1.offsetToRest, [5, 5, 5], "node1 offset to rest at time 1 of the 2nd playback");
		assert.deepEqual(property1.offsetToPrevious, [5, 5, 5], "node1 offset to previous at time 1 of the 2nd playback");
		assert.deepEqual(property1.absolute, [5, 5, 5], "node1 local coordinates at time 1 of the 2nd playback");
		assert.deepEqual(property1.world, [25, 35, 45], "node1 world coordinates at time 1 of the 2nd playback");
		assert.deepEqual(property2.offsetToRest, [5, 5, 5], "reference node2 offset to rest at time 1 of the 2nd playback");
		assert.deepEqual(property2.offsetToPrevious, [5, 5, 5], "reference node2 offset to previous at time 1 of the 2nd playback");
		assert.deepEqual(property2.absolute, [5, 5, 5], "reference node2 local coordinates at time 1 of the 2nd playback");
		assert.deepEqual(property2.world, [5, 5, 5], "reference node2 world coordinates at time 1 of the 2nd playback");

		animationPlayer.setTime(2, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Translate);
		assert.deepEqual(property1.offsetToRest, [10, 10, 10], "node1 offset to rest at time 2 of the 2nd playback");
		assert.deepEqual(property1.offsetToPrevious, [10, 10, 10], "node1 offset to previous at time 2 of the 2nd playback");
		assert.deepEqual(property1.absolute, [10, 10, 10], "node1 local coordinates at time 2 of the 2nd playback");
		assert.deepEqual(property1.world, [35, 45, 55], "node1 world coordinates at time 2 of the 2nd playback");
		assert.deepEqual(property2.offsetToRest, [10, 10, 10], "reference node2 offset to rest at time 2 of the 2nd playback");
		assert.deepEqual(property2.offsetToPrevious, [10, 10, 10], "reference node2 offset to previous at time 2 of the 2nd playback");
		assert.deepEqual(property2.absolute, [10, 10, 10], "reference node2 local coordinates at time 2 of the 2nd playback");
		assert.deepEqual(property2.world, [10, 10, 10], "reference node2 world coordinates at time 2 of the 2nd playback");
	});

	QUnit.test("Animation - scale", function(assert) {

		var playbacks = view.getPlaybacks();
		var sequence1 = playbacks[0].getSequence();

		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		var keyValue1 = [1, 1, 1];
		track1.insertKey(0, keyValue1);
		var keyValue2 = [1, 2, 3];
		track1.insertKey(1, keyValue2);

		var joint1 = {};
		joint1.parent = rnode1;
		joint1.node = node1;
		sequence1.setJoint([joint1]);

		var rtrack1 = scene.createTrack("rtrk1", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		keyValue1 = [1, 1, 1];
		rtrack1.insertKey(0, keyValue1);
		keyValue2 = [2, 2, 2];
		rtrack1.insertKey(1, keyValue2);

		sequence1.setNodeAnimation(node1, AnimationTrackType.Scale, track1);
		sequence1.setNodeAnimation(rnode1, AnimationTrackType.Scale, rtrack1);

		viewManager.activateView(view);
		animationPlayer.activateView(view);
		animationPlayer.setTime(0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Scale);
		var property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Scale);
		assert.deepEqual(property1.offsetToRest, [1, 1, 1], "node1 offset to rest at time 0");
		assert.deepEqual(property1.offsetToPrevious, [1, 1, 1], "node1 offset to previous at time 0");
		assert.deepEqual(property1.absolute, [1, 1, 1], "node1 local coordinates at time 0");
		assert.deepEqual(property1.world, [1, 1, 1], "node1 world coordinates at time 0");
		assert.deepEqual(property2.offsetToRest, [1, 1, 1], "reference node1 offset to rest at time 0");
		assert.deepEqual(property2.offsetToPrevious, [1, 1, 1], "reference node1 offset to previous at time 0");
		assert.deepEqual(property2.absolute, [1, 1, 1], "reference node1 local coordinates at time 0");
		assert.deepEqual(property2.world, [1, 1, 1], "reference node1 world coordinates at time 0");

		animationPlayer.setTime(1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Scale);
		property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Scale);
		assert.deepEqual(property1.offsetToRest, [1, 2, 3], "node1 offset to rest at time 1");
		assert.deepEqual(property1.offsetToPrevious, [1, 2, 3], "node1 offset to previous at time 1");
		assert.deepEqual(property1.absolute, [1, 2, 3], "node1 local coordinates at time 1");
		assert.deepEqual(property1.world, [2, 4, 6], "node1 world coordinates at time 1");
		assert.deepEqual(property2.offsetToRest, [2, 2, 2], "reference node1 offset to rest at time 1");
		assert.deepEqual(property2.offsetToPrevious, [2, 2, 2], "reference node1 offset to previous at time 1");
		assert.deepEqual(property2.absolute, [2, 2, 2], "reference node1 local coordinates at time 1");
		assert.deepEqual(property2.world, [2, 2, 2], "reference node1 world coordinates at time 1");

		animationPlayer.setTime(0.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Scale);
		property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Scale);
		assert.deepEqual(property1.offsetToRest, [1, 1.5, 2], "node1 offset to rest at time 0.5");
		assert.deepEqual(property1.offsetToPrevious, [1, 1.5, 2], "node1 offset to previous at time 0.5");
		assert.deepEqual(property1.absolute, [1, 1.5, 2], "node1 local coordinates at time 0.5");
		assert.deepEqual(property1.world, [1.5, 2.25, 3], "node1 world coordinates at time 0.5");
		assert.deepEqual(property2.offsetToRest, [1.5, 1.5, 1.5], "reference node1 offset to rest at time 0.5");
		assert.deepEqual(property2.offsetToPrevious, [1.5, 1.5, 1.5], "reference node1 offset to previous at time 0.5");
		assert.deepEqual(property2.absolute, [1.5, 1.5, 1.5], "reference node1 local coordinates at time 0.5");
		assert.deepEqual(property2.world, [1.5, 1.5, 1.5], "reference node1 world coordinates at time 0.5");

		var track2 = scene.createTrack("trk2", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		keyValue1 = [1, 1, 1];
		track2.insertKey(0, keyValue1);
		keyValue2 = [0.5, 0.5, 0.5];
		track2.insertKey(2, keyValue2);

		var rtrack2 = scene.createTrack("rtrk2", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		keyValue1 = [1, 1, 1];
		rtrack2.insertKey(0, keyValue1);
		keyValue2 = [4, 4, 4];
		rtrack2.insertKey(2, keyValue2);
		var sequence2 = playbacks[1].getSequence();
		var joint2 = {};
		joint2.parent = rnode2;
		joint2.node = node1;
		sequence2.setJoint([joint2]);

		sequence2.setNodeAnimation(node1, AnimationTrackType.Scale, track2);
		sequence2.setNodeAnimation(rnode2, AnimationTrackType.Scale, rtrack2);
		sequence2.resetDuration();

		view.resetPlaybacksStartTimes();

		animationPlayer.setTime(0, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Scale);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Scale);
		assert.deepEqual(property1.offsetToRest, [1, 1, 1], "node1 offset to rest at time 0 of the 2nd playback");
		assert.deepEqual(property1.offsetToPrevious, [1, 1, 1], "node1 offset to previous at time 0 of the 2nd playback");
		assert.deepEqual(property1.absolute, [1, 1, 1], "node1 local coordinates at time 0 of the 2nd playback");
		assert.deepEqual(property1.world, [2, 4, 6], "node1 world coordinates at time 0 of the 2nd playback");
		assert.deepEqual(property2.offsetToRest, [1, 1, 1], "reference node2 offset to rest at time 0 of the 2nd playback");
		assert.deepEqual(property2.offsetToPrevious, [1, 1, 1], "reference node2 offset to previous at time 0 of the 2nd playback");
		assert.deepEqual(property2.absolute, [1, 1, 1], "reference node2 local coordinates at time 0 of the 2nd playback");
		assert.deepEqual(property2.world, [1, 1, 1], "reference node2 world coordinates at time 0 of the 2nd playback");

		animationPlayer.setTime(1, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Scale);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Scale);
		assert.deepEqual(property1.offsetToRest, [0.75, 0.75, 0.75], "node1 offset to rest at time 1 of the 2nd playback");
		assert.deepEqual(property1.offsetToPrevious, [0.75, 0.75, 0.75], "node1 offset to previous at time 1 of the 2nd playback");
		assert.deepEqual(property1.absolute, [0.75, 0.75, 0.75], "node1 local coordinates at time 1 of the 2nd playback");
		assert.deepEqual(property1.world, [3.75, 7.5, 11.25], "node1 world coordinates at time 1 of the 2nd playback");
		assert.deepEqual(property2.offsetToRest, [2.5, 2.5, 2.5], "reference node2 offset to rest at time 1 of the 2nd playback");
		assert.deepEqual(property2.offsetToPrevious, [2.5, 2.5, 2.5], "reference node2 offset to previous at time 1 of the 2nd playback");
		assert.deepEqual(property2.absolute, [2.5, 2.5, 2.5], "reference node2 local coordinates at time 1 of the 2nd playback");
		assert.deepEqual(property2.world, [2.5, 2.5, 2.5], "reference node2 world coordinates at time 1 of the 2nd playback");

		animationPlayer.setTime(2, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Scale);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Scale);
		assert.deepEqual(property1.offsetToRest, [0.5, 0.5, 0.5], "node1 offset to rest at time 2 of the 2nd playback");
		assert.deepEqual(property1.offsetToPrevious, [0.5, 0.5, 0.5], "node1 offset to previous at time 2 of the 2nd playback");
		assert.deepEqual(property1.absolute, [0.5, 0.5, 0.5], "node1 local coordinates at time 2 of the 2nd playback");
		assert.deepEqual(property1.world, [4, 8, 12], "node1 world coordinates at time 2 of the 2nd playback");
		assert.deepEqual(property2.offsetToRest, [4, 4, 4], "reference node2 offset to rest at time 2 of the 2nd playback");
		assert.deepEqual(property2.offsetToPrevious, [4, 4, 4], "reference node2 offset to previous at time 2 of the 2nd playback");
		assert.deepEqual(property2.absolute, [4, 4, 4], "reference node2 local coordinates at time 2 of the 2nd playback");
		assert.deepEqual(property2.world, [4, 4, 4], "reference node2 world coordinates at time 2 of the 2nd playback");
	});

	QUnit.test("Animation - rotate", function(assert) {

		var playbacks = view.getPlaybacks();
		var sequence1 = playbacks[0].getSequence();

		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Euler
		});

		var keyValue1 = [0, 0, 0, 36];
		track1.insertKey(0, keyValue1);
		var keyValue2 = [3.1416, 0, 0, 36];
		track1.insertKey(1, keyValue2);

		var joint1 = {};
		joint1.parent = rnode1;
		joint1.node = node1;
		sequence1.setJoint([joint1]);

		var rtrack1 = scene.createTrack("rtrk1", {
			trackValueType: AnimationTrackValueType.Euler
		});

		keyValue1 = [0, 0, 0, 36];
		rtrack1.insertKey(0, keyValue1);
		keyValue2 = [-3.1416, 0, 0, 36];
		rtrack1.insertKey(1, keyValue2);

		sequence1.setNodeAnimation(node1, AnimationTrackType.Rotate, track1);
		sequence1.setNodeAnimation(rnode1, AnimationTrackType.Rotate, rtrack1);

		var compareVectors = function(vec1, vec2) {
			for (var i = 0; i < vec1.length; i++) {
				if (Math.abs(vec1[i] - vec2[i]) > 0.00001) {
					return false;
				}
			}
			return true;
		};

		viewManager.activateView(view);
		animationPlayer.activateView(view);
		animationPlayer.setTime(0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Rotate);
		var property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Rotate);
		assert.deepEqual(property1.offsetToRest, [0, 0, 0, 1], "node1 offset to rest at time 0");
		assert.deepEqual(property1.offsetToPrevious, [0, 0, 0, 36], "node1 offset to previous at time 0");
		assert.deepEqual(property1.absolute, [0, 0, 0, 1], "node1 local coordinates  at time 0");
		assert.deepEqual(property1.world, [0, 0, 0, 1], "node1 world coordinates  at time 0");
		assert.deepEqual(property2.offsetToRest, [0, 0, 0, 1], "reference node1 offset to rest at time 0");
		assert.deepEqual(property2.offsetToPrevious, [0, 0, 0, 36], "reference node1 offset to previous at time 0");
		assert.deepEqual(property2.absolute, [0, 0, 0, 1], "reference node1 local coordinates  at time 0");
		assert.deepEqual(property2.world, [0, 0, 0, 1], "reference node1 world coordinates  at time 0");

		animationPlayer.setTime(1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Rotate);
		property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Rotate);
		assert.ok(compareVectors(property1.offsetToRest, [1, 0, 0, 0]), "node1 offset to rest at time 1");
		assert.deepEqual(property1.offsetToPrevious, [3.1416, 0, 0, 36], "node1 offset to previous at time 1");
		assert.ok(compareVectors(property1.absolute, [1, 0, 0, 0]), "node1 local coordinates at time 1");
		assert.ok(compareVectors(property1.world, [0, 0, 0, 1]), "node1 world coordinates rest at time 1");
		assert.ok(compareVectors(property2.offsetToRest, [-1, 0, 0, 0]), "reference node1 offset to rest at time 1");
		assert.deepEqual(property2.offsetToPrevious, [-3.1416, 0, 0, 36], "reference node1 offset to previous at time 1");
		// assert.step("[ 1, 0, 0, 0 ] temp: [" + property2.absolute[0] + ", " + property2.absolute[1] + ", " + property2.absolute[2] + ", " + property2.absolute[3] + "]");
		assert.ok(compareVectors(property2.absolute, [-1, 0, 0, 0]), "reference node1 local coordinates at time 1");
		assert.ok(compareVectors(property2.world, [1, 0, 0, 0]), "reference node1 world coordinates rest at time 1");

		animationPlayer.setTime(0.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Rotate);
		property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Rotate);
		assert.ok(compareVectors(property1.offsetToRest, [0.707105, 0, 0, 0.707105]), "node1 offset to rest at time 0.5");
		assert.deepEqual(property1.offsetToPrevious, [1.5708, 0, 0, 36], "node1 offset to previous at time 0.5");
		assert.ok(compareVectors(property1.absolute, [0.707105, 0, 0, 0.707105]), "node1 local coordinates at time 0.5");
		assert.ok(compareVectors(property1.world, [0, 0, 0, 1]), "node1 world coordinates rest at time 0.5");
		assert.ok(compareVectors(property2.offsetToRest, [-0.707105, 0, 0, 0.707105]), "reference node1 offset to rest at time 0.5");
		assert.deepEqual(property2.offsetToPrevious, [-1.5708, 0, 0, 36], "reference node1 offset to previous at time 0.5");
		assert.ok(compareVectors(property2.absolute, [-0.707105, 0, 0, 0.707105]), "reference node1 local coordinates at time 0.5");
		assert.ok(compareVectors(property2.world, [-0.707105, 0, 0, 0.707105]), "reference node1 world coordinates rest at time 0.5");

		var track2 = scene.createTrack("trk2", {
			trackValueType: AnimationTrackValueType.Euler
		});

		keyValue1 = [0, 0, 0, 36];
		track2.insertKey(0, keyValue1);
		keyValue2 = [0, 3.1416, 0, 36];
		track2.insertKey(2, keyValue2);

		var rtrack2 = scene.createTrack("rtrk2", {
			trackValueType: AnimationTrackValueType.Euler
		});

		keyValue1 = [0, 0, 0, 36];
		rtrack2.insertKey(0, keyValue1);
		keyValue2 = [0, -3.1416, 0, 36];
		rtrack2.insertKey(2, keyValue2);
		var sequence2 = playbacks[1].getSequence();
		var joint2 = {};
		joint2.parent = rnode2;
		joint2.node = node1;
		sequence2.setJoint([joint2]);

		sequence2.setNodeAnimation(node1, AnimationTrackType.Rotate, track2);
		sequence2.setNodeAnimation(rnode2, AnimationTrackType.Rotate, rtrack2);
		sequence2.resetDuration();

		view.resetPlaybacksStartTimes();

		animationPlayer.setTime(0, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Rotate);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Rotate);
		assert.deepEqual(property1.offsetToRest, [0, 0, 0, 1], "node1 offset to rest at time 0 of the 2nd playback");
		assert.deepEqual(property1.offsetToPrevious, [0, 0, 0, 36], "node1 offset to previous at time 0 of the 2nd playback");
		assert.deepEqual(property1.absolute, [0, 0, 0, 1], "node1 local coordinates at time 0 of the 2nd playback");
		assert.deepEqual(property1.world, [0, 0, 0, 1], "node1 world coordinates rest at time 0 of the 2nd playback");
		assert.deepEqual(property2.offsetToRest, [0, 0, 0, 1], "reference node2 offset to rest at time 0 of the 2nd playback");
		assert.deepEqual(property2.offsetToPrevious, [0, 0, 0, 36], "reference node2 offset to previous at time 0 of the 2nd playback");
		assert.deepEqual(property2.absolute, [0, 0, 0, 1], "reference node2 local coordinates at time 0 of the 2nd playback");
		assert.deepEqual(property2.world, [0, 0, 0, 1], "reference node2 world coordinates rest at time 0 of the 2nd playback");

		animationPlayer.setTime(1, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Rotate);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Rotate);
		assert.ok(compareVectors(property1.offsetToRest, [0, 0.707105, 0, 0.707105]), "node1 offset to rest at time 1 of the 2nd playback");
		assert.deepEqual(property1.offsetToPrevious, [0, 1.5708, 0, 36], "node1 offset to previous at time 1 of the 2nd playback");
		assert.ok(compareVectors(property1.absolute, [0, 0.707105, 0, 0.707105]), "node1 local coordinates at time 1 of the 2nd playback");
		assert.ok(compareVectors(property1.world, [0, 0, 0, 1]), "node1 world coordinates rest at time 1 of the 2nd playback");
		assert.ok(compareVectors(property2.offsetToRest, [0, -0.707105, 0, 0.707105]), "reference node1 offset to rest at time 1 of the 2nd playback");
		assert.deepEqual(property2.offsetToPrevious, [0, -1.5708, 0, 36], "reference node1 offset to previous at time 1 of the 2nd playback");
		assert.ok(compareVectors(property2.absolute, [0, -0.707105, 0, 0.707105]), "reference node1 local coordinates at time 1 of the 2nd playback");
		assert.ok(compareVectors(property2.world, [0, -0.707105, 0, 0.707105]), "reference node1 world coordinates rest at time 1 of the 2nd playback");

		animationPlayer.setTime(2, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Rotate);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Rotate);
		assert.ok(compareVectors(property1.offsetToRest, [0, 1, 0, 0]), "node1 offset to rest at time 2 of the 2nd playback");
		assert.deepEqual(property1.offsetToPrevious, [0, 3.1416, 0, 36], "node1 offset to previous at time 2 of the 2nd playback");
		assert.ok(compareVectors(property1.absolute, [0, 1, 0, 0]), "node1 local coordinates at time 2 of the 2nd playback");
		assert.ok(compareVectors(property1.world, [0, 0, 0, 1]), "node1 world coordinates rest at time 2 of the 2nd playback");
		assert.ok(compareVectors(property2.offsetToRest, [0, -1, 0, 0]), "reference node1 offset to rest at time 2 of the 2nd playback");
		assert.deepEqual(property2.offsetToPrevious, [0, -3.1416, 0, 36], "reference node1 offset to previous at time 2 of the 2nd playback");
		// assert.step("[ 0, 1, 0, 0 ] temp: [" + property2.absolute[0] + ", " + property2.absolute[1] + ", " + property2.absolute[2] + ", " + property2.absolute[3] + "]");
		assert.ok(compareVectors(property2.absolute, [0, -1, 0, 0]), "reference node1 local coordinates at time 2 of the 2nd playback");
		assert.ok(compareVectors(property2.world, [0, 1, 0, 0]), "reference node1 world coordinates rest at time 2 of the 2nd playback");
	});

	QUnit.test("Animation - opacity", function(assert) {

		var opacityTolerance = 0.001;

		var playbacks = view.getPlaybacks();
		var sequence1 = playbacks[0].getSequence();

		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Scalar
		});

		var keyValue1 = 1;
		track1.insertKey(0, keyValue1);
		var keyValue2 = 0.6;
		track1.insertKey(1, keyValue2);

		var joint1 = {};
		joint1.parent = rnode1;
		joint1.node = node1;
		sequence1.setJoint([joint1]);

		var rtrack1 = scene.createTrack("rtrk1", {
			trackValueType: AnimationTrackValueType.Scalar
		});

		keyValue1 = 1;
		rtrack1.insertKey(0, keyValue1);
		keyValue2 = 0.8;
		rtrack1.insertKey(1, keyValue2);

		sequence1.setNodeAnimation(node1, AnimationTrackType.Opacity, track1);
		sequence1.setNodeAnimation(rnode1, AnimationTrackType.Opacity, rtrack1);

		viewManager.activateView(view);
		animationPlayer.activateView(view);
		animationPlayer.setTime(0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Opacity);
		var property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Opacity);
		assert.equal(property1.offsetToRest, 1, "node1 offset to rest at time 0");
		assert.equal(property1.offsetToPrevious, 1, "node1 offset to previous at time 0");
		assert.equal(property1.opacity, 0.9, "node1 opacity at time 0");
		assert.equal(property1.totalOpacity, 0.9, "node1 total opacity at time 0");
		assert.equal(property2.offsetToRest, 1, "reference node1 offset to rest at time 0");
		assert.equal(property2.offsetToPrevious, 1, "reference node1 offset to previous at time 0");
		assert.equal(property2.opacity, 1, "reference node1 opacity at time 0");
		assert.equal(property2.totalOpacity, 1, "reference node1 total opacity at time 0");

		animationPlayer.setTime(1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Opacity);
		property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Opacity);
		assert.equal(property1.offsetToRest, 0.6, "node1 offset to rest at time 1");
		assert.equal(property1.offsetToPrevious, 0.6, "node1 offset to previous at time 1");
		assert.ok(Math.abs(property1.opacity - 0.54) < opacityTolerance, "node1 opacity at time 1");
		assert.ok(Math.abs(property1.totalOpacity - 0.432) < opacityTolerance, "node1 total opacity at time 1");
		assert.equal(property2.offsetToRest, 0.8, "reference node1 offset to rest at time 1");
		assert.equal(property2.offsetToPrevious, 0.8, "reference node1 offset to previous at time 1");
		assert.equal(property2.opacity, 0.8, "reference node1 opacity at time 1");
		assert.equal(property2.totalOpacity, 0.8, "reference node1 total opacity at time 1");

		animationPlayer.setTime(0.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Opacity);
		property2 = animationPlayer.getAnimatedProperty(rnode1, AnimationTrackType.Opacity);
		assert.equal(property1.offsetToRest, 0.8, "node1 offset to rest at time 0.5");
		assert.equal(property1.offsetToPrevious, 0.8, "node1 offset to previous at time 0.5");
		assert.ok(Math.abs(property1.opacity - 0.72) < opacityTolerance, "node1 opacity at time 0.5");
		assert.ok(Math.abs(property1.totalOpacity - 0.648) < opacityTolerance, "node1 total opacity at time 0.5");
		assert.equal(property2.offsetToRest, 0.9, "reference node1 offset to rest at time 0.5");
		assert.equal(property2.offsetToPrevious, 0.9, "reference node1 offset to previous at time 0.5");
		assert.equal(property2.opacity, 0.9, "reference node1 opacity at time 0.5");
		assert.equal(property2.totalOpacity, 0.9, "reference node1 total opacity at time 0.5");

		var track2 = scene.createTrack("trk2", {
			trackValueType: AnimationTrackValueType.Scalar
		});

		keyValue1 = 1;
		track2.insertKey(0, keyValue1);
		keyValue2 = 0.6;
		track2.insertKey(2, keyValue2);

		var rtrack2 = scene.createTrack("rtrk2", {
			trackValueType: AnimationTrackValueType.Scalar
		});

		keyValue1 = 1;
		rtrack2.insertKey(0, keyValue1);
		keyValue2 = 2;
		rtrack2.insertKey(2, keyValue2);
		var sequence2 = playbacks[1].getSequence();
		var joint2 = {};
		joint2.parent = rnode2;
		joint2.node = node1;
		sequence2.setJoint([joint2]);

		sequence2.setNodeAnimation(node1, AnimationTrackType.Opacity, track2);
		sequence2.setNodeAnimation(rnode2, AnimationTrackType.Opacity, rtrack2);
		sequence2.resetDuration();

		view.resetPlaybacksStartTimes();

		animationPlayer.setTime(0, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Opacity);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Opacity);
		assert.ok(Math.abs(property1.offsetToRest - 0.6 * 0.8) < opacityTolerance, "node1 offset to rest at time 0 of the 2nd playback");
		assert.equal(property1.offsetToPrevious, 1, "node1 offset to previous at time 0 of the 2nd playback");
		assert.ok(Math.abs(property1.opacity - 0.6 * 0.8 * 0.9) < opacityTolerance, "node1 opacity at time 0 of the 2nd playback");
		assert.ok(Math.abs(property1.totalOpacity - 0.6 * 0.8 * 0.9) < opacityTolerance, "node1 total opacity at time 0 of the 2nd playback");
		assert.equal(property2.offsetToRest, 1, "reference node2 offset to rest at time 0 of the 2nd playback");
		assert.equal(property2.offsetToPrevious, 1, "reference node2 offset to previous at time 0 of the 2nd playback");
		assert.equal(property2.opacity, 1, "reference node2 opacity at time 0 of the 2nd playback");
		assert.equal(property2.totalOpacity, 1, "reference node2 total opacity at time 0 of the 2nd playback");

		animationPlayer.setTime(1, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Opacity);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Opacity);
		assert.ok(Math.abs(property1.offsetToRest - 0.48 * 0.8) < opacityTolerance, "node1 offset to rest at time 1 of the 2nd playback");
		assert.equal(property1.offsetToPrevious, 0.8, "node1 offset to previous at time 1 of the 2nd playback");
		assert.ok(Math.abs(property1.opacity - 0.48 * 0.8 * 0.9) < opacityTolerance, "node1 opacity at time 1 of the 2nd playback");
		assert.ok(Math.abs(property1.totalOpacity - 0.518) < opacityTolerance, "node1 total opacity at time 1 of the 2nd playback");
		assert.equal(property2.offsetToRest, 1.5, "reference node2 offset to rest at time 1 of the 2nd playback");
		assert.equal(property2.offsetToPrevious, 1.5, "reference node2 offset to previous at time 1 of the 2nd playback");
		assert.equal(property2.opacity, 1.5, "reference node2 opacity at time 1 of the 2nd playback");
		assert.equal(property2.totalOpacity, 1.5, "reference node2 total opacity rest at time 1 of the 2nd playback");

		animationPlayer.setTime(2, 1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Opacity);
		property2 = animationPlayer.getAnimatedProperty(rnode2, AnimationTrackType.Opacity);
		assert.ok(Math.abs(property1.offsetToRest - 0.48 * 0.6) < opacityTolerance, "node1 offset to rest at time 2 of the 2nd playback");
		assert.equal(property1.offsetToPrevious, 0.6, "node1 offset to previous at time 2 of the 2nd playback");
		assert.ok(Math.abs(property1.opacity - 0.48 * 0.6 * 0.9) < opacityTolerance, "node1 opacity at time 2 of the 2nd playback");
		assert.ok(Math.abs(property1.totalOpacity - 0.518) < opacityTolerance, "node1 total opacity at time 2 of the 2nd playback");
		assert.equal(property2.offsetToRest, 2, "reference node2 offset to rest at time 2 of the 2nd playback");
		assert.equal(property2.offsetToPrevious, 2, "reference node2 offset to previous at time 2 of the 2nd playback");
		assert.equal(property2.opacity, 2, "reference node2 opacity at time 2 of the 2nd playback");
		assert.equal(property2.totalOpacity, 2, "reference node2 total opacity rest at time 2 of the 2nd playback");
	});

	QUnit.test("Animation - euler rotation", function(assert) {
		var playback1 = view.getPlaybacks()[0];
		var sequence1 = playback1.getSequence();
		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Euler
		});

		var order = 36;
		var sx = -90 / 180 * Math.PI;
		var sy = 30 / 180 * Math.PI;
		var sz = 110 / 180 * Math.PI;

		var ex = 90 / 180 * Math.PI;
		var ey = 80 / 180 * Math.PI;
		var ez = 11 / 180 * Math.PI;

		var keyValue1 = [sx, sy, sz, order];
		track1.insertKey(0.0, keyValue1);
		var keyValue2 = [ex, ey, ez, order];
		track1.insertKey(2.0, keyValue2);

		playback1.setStartTime(0);
		playback1.setTimeScale(1);
		playback1.setPreDelay(0);
		playback1.setPostDelay(0);
		playback1.setRepeats(1);
		sequence1.setDuration(2.0);
		sequence1.setNodeAnimation(node1, AnimationTrackType.Rotate, track1);
		playback1.setReversed(false);
		viewManager.activateView(view);
		animationPlayer.activateView(view);

		var compareVectorsQ = function(vec1, vec2) {
			for (var i = 0; i < vec1.length; i++) {
				if (Math.abs(vec1[i] - vec2[i]) > 0.00000001) {
					return false;
				}
			}
			return true;
		};

		var times = [0.0, 0.3333333, 0.75, 1.0, 1.5, 2.0];
		for (var i = 0; i < times.length; i++) {
			var t = times[i] / sequence1.getDuration();
			var quat = AnimationMath.neutralEulerToGlMatrixQuat([sx + t * (ex - sx), sy + t * (ey - sy), sz + t * (ez - sz), order]);
			animationPlayer.setTime(times[i]);
			var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Rotate);

			// assert.deepEqual(property1.offsetToRest, [ 0, 0, 0, 1 ], "offsetToRest 0");
			// assert.deepEqual(property1.offsetToPrevious, [ 0, 0, 0, 36 ], "offsetToPrevious 0");
			// assert.deepEqual(property1.absolute, [ 0, 0, 0, 1 ],  "absolute 0");
			assert.ok(compareVectorsQ(property1.world, [quat[0], quat[1], quat[2], quat[3]]), "world " + times[i]);
		}
	});

	/*
	QUnit.test("Animation - forward and reverse TODO WRONG", function(assert) {
		var playback0 = view.getPlaybacks()[0];
		var playback1 = view.getPlaybacks()[1];
		var sequence0 = playback0.getSequence();
		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		var keyValue1 = [ 0, 1000, 0 ];
		track1.insertKey(0.0, keyValue1);
		var keyValue2 = [ 0, 1300, 0 ];
		track1.insertKey(2.0, keyValue2);

		sequence0.setDuration(2.0);
		sequence0.setNodeAnimation(node1, AnimationTrackType.Translate, track1);
		playback1.setSequence(sequence0);

		playback0.setStartTime(0);
		playback0.setTimeScale(1);
		playback0.setPreDelay(0);
		playback0.setPostDelay(0);
		playback0.setRepeats(1);
		playback0.setReversed(false);

		playback1.setStartTime(2);
		playback1.setTimeScale(1);
		playback1.setPreDelay(0);
		playback1.setPostDelay(0);
		playback1.setRepeats(1);
		playback1.setReversed(true);

		viewManager.activateView(view);
		animationPlayer.activateView(view);

		// forward (move from 1000 to 1300)
		animationPlayer.setTime(0.0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1000, 0 ], "time = 0.0");

		animationPlayer.setTime(1.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1150, 0 ], "time = 1.0");

		animationPlayer.setTime(1.99);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1298.5, 0 ], "time = 1.99");

		// reverse (move from 2600 to 2300). Object is at 1300 at start of playback.
		animationPlayer.setTime(2.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1300 + 1300, 0 ], "time = 2.0");


		animationPlayer.setTime(2.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1300 + 1225, 0 ], "time = 2.5 (back)");

		animationPlayer.setTime(3.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1300 + 1150, 0 ], "time = 3.0 (back)");

		animationPlayer.setTime(4.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1300 + 1000, 0 ], "time = 4.0 (back)");
	});
	*/

	QUnit.test("Animation - no key at 0 time", function(assert) {
		var playback1 = view.getPlaybacks()[0];
		var sequence1 = playback1.getSequence();
		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		var keyValue1 = [0, 1, 0];
		track1.insertKey(1.0, keyValue1);
		var keyValue2 = [0, 3, 0];
		track1.insertKey(5.0, keyValue2);

		playback1.setStartTime(0);
		playback1.setTimeScale(1);
		playback1.setPreDelay(0);
		playback1.setPostDelay(0);
		playback1.setRepeats(1);
		playback1.setReversed(false);
		sequence1.setDuration(5.0);
		sequence1.setNodeAnimation(node1, AnimationTrackType.Translate, track1);

		viewManager.activateView(view);
		animationPlayer.activateView(view);

		animationPlayer.setTime(0.0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1, 0], "time = 0.0");

		animationPlayer.setTime(1.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1, 0], "time = 1.0");

		animationPlayer.setTime(2.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 2.0");

		animationPlayer.setTime(3.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 2, 0], "time = 3.0");

		animationPlayer.setTime(4.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 2.5, 0], "time = 4.0");

		animationPlayer.setTime(5.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 3, 0], "time = 5.0");
	});

	/*
	QUnit.test("Animation - no key at 0 time reverse TODO WRONG", function(assert) {
		view.removePlayback(1);// two playbacks were created by default
		var playback1 = view.getPlaybacks()[0];
		var sequence1 = playback1.getSequence();
		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		var keyValue1 = [ 0, 1100, 0 ];
		track1.insertKey(1.0, keyValue1);
		var keyValue2 = [ 0, 1300, 0 ];
		track1.insertKey(5.0, keyValue2);

		playback1.setStartTime(0);
		playback1.setTimeScale(1);
		playback1.setPreDelay(0);
		playback1.setPostDelay(0);
		playback1.setRepeats(1);
		playback1.setReversed(true);
		sequence1.setDuration(5.0);
		sequence1.setNodeAnimation(node1, AnimationTrackType.Translate, track1);

		viewManager.activateView(view);
		animationPlayer.activateView(view);

		animationPlayer.setTime(0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1300 - 1100, 0 ], "time = 0.0");
		assert.deepEqual(property1.offsetToRest, [ 0, 1300, 0 ], "relative to rest position");
		assert.deepEqual(property1.absolute, [ 0, 200, 0 ],  "under parent node");

		animationPlayer.setTime(1.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1250 - 1100, 0 ], "time = 1.0");
		assert.deepEqual(property1.offsetToRest, [ 0, 1250, 0 ], "relative to rest position");
		assert.deepEqual(property1.absolute, [ 0, 150, 0 ],  "under parent node");

		animationPlayer.setTime(2.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1200 - 1100, 0 ], "time = 2.0");
		assert.deepEqual(property1.offsetToRest, [ 0, 1200, 0 ], "relative to rest position");
		assert.deepEqual(property1.absolute, [ 0, 100, 0 ],  "under parent node");

		animationPlayer.setTime(3.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1150 - 1100, 0 ], "time = 3.0");
		assert.deepEqual(property1.offsetToRest, [ 0, 1150, 0 ], "relative to rest position");
		assert.deepEqual(property1.absolute, [ 0, 50, 0 ],  "under parent node");
		assert.deepEqual(viewStateManager.getRestTransformation(node1).translation, [ 0, 0, 0 ], "rest translation");

		animationPlayer.setTime(4.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1100 - 1100, 0 ], "time = 4.0");
		assert.deepEqual(property1.offsetToRest, [ 0, 1100, 0 ], "relative to rest position");
		assert.deepEqual(property1.absolute, [ 0, 0, 0 ],  "under parent node");

		animationPlayer.setTime(5.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [ 0, 1100 - 1100, 0 ], "time = 5.0");
		assert.deepEqual(property1.offsetToRest, [ 0, 1100, 0 ], "relative to rest position");
		assert.deepEqual(property1.absolute, [ 0, 0, 0 ],  "under parent node");
		assert.deepEqual(viewStateManager.getRestTransformation(node1).translation, [ 0, 0, 0 ], "rest translation");
	});
	*/

	QUnit.test("Animation - cyclic", function(assert) {
		var playback1 = view.getPlaybacks()[0];
		var sequence1 = playback1.getSequence();
		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3,
			cycleForward: true,
			cycleBackward: true
		});

		var keyValue1 = [0, 0, 0];
		track1.insertKey(0.0, keyValue1);
		var keyValue2 = [0, 3, 0];
		track1.insertKey(2.0, keyValue2);

		playback1.setStartTime(0);
		playback1.setTimeScale(1);
		playback1.setPreDelay(0);
		playback1.setPostDelay(0);
		playback1.setRepeats(1);
		playback1.setReversed(false);
		sequence1.setDuration(3.0);
		sequence1.setNodeAnimation(node1, AnimationTrackType.Translate, track1);

		viewManager.activateView(view);
		animationPlayer.activateView(view);

		animationPlayer.setTime(0.0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 0, 0], "time = 0.0");

		animationPlayer.setTime(1.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 1.0");

		animationPlayer.setTime(2.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 3.0, 0], "time = 2.0");

		animationPlayer.setTime(2.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 0.75, 0], "time = 2.5");

		animationPlayer.setTime(3.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 3.0");

		animationPlayer.setTime(4.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 4.0");

		animationPlayer.setTime(15.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 15.0");
	});

	QUnit.test("Animation - cyclic with repeat", function(assert) {
		view.removePlayback(1);// two playbacks were created by default
		var playback1 = view.getPlaybacks()[0];
		var sequence1 = playback1.getSequence();
		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3,
			cycleForward: true,
			cycleBackward: true
		});

		var keyValue1 = [0, 0, 0];
		track1.insertKey(0.0, keyValue1);
		var keyValue2 = [0, 3, 0];
		track1.insertKey(2.0, keyValue2);

		playback1.setStartTime(0);
		playback1.setTimeScale(1);
		playback1.setPreDelay(0);
		playback1.setPostDelay(0);
		playback1.setRepeats(2);
		playback1.setReversed(false);
		sequence1.setDuration(3.0);
		sequence1.setNodeAnimation(node1, AnimationTrackType.Translate, track1);

		viewManager.activateView(view);
		animationPlayer.activateView(view);

		// first time
		animationPlayer.setTime(0.0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 0, 0], "time = 0.0");

		animationPlayer.setTime(1.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 1.0");

		animationPlayer.setTime(2.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 3.0, 0], "time = 2.0");

		animationPlayer.setTime(2.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 0.75, 0], "time = 2.5");

		animationPlayer.setTime(3.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 3.0");

		// repeat (second time)
		animationPlayer.setTime(3.1);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 0.15000000000000013, 0], "time = 3.1");

		animationPlayer.setTime(4.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 4.0");

		animationPlayer.setTime(5.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 3.0, 0], "time = 5.0");

		animationPlayer.setTime(5.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 0.75, 0], "time = 5.5");

		animationPlayer.setTime(6.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 6.0");
	});

	QUnit.test("Animation - cyclic reverse", function(assert) {
		var playback1 = view.getPlaybacks()[0];
		var sequence1 = playback1.getSequence();
		var track1 = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3,
			cycleForward: true,
			cycleBackward: true
		});

		var keyValue1 = [0, 0, 0];
		track1.insertKey(0.0, keyValue1);
		var keyValue2 = [0, 3, 0];
		track1.insertKey(2.0, keyValue2);

		playback1.setStartTime(0);
		playback1.setTimeScale(1);
		playback1.setPreDelay(0);
		playback1.setPostDelay(0);
		playback1.setRepeats(1);
		playback1.setReversed(true);
		sequence1.setDuration(3.0);
		sequence1.setNodeAnimation(node1, AnimationTrackType.Translate, track1);

		viewManager.activateView(view);
		animationPlayer.activateView(view);

		animationPlayer.setTime(0.0);
		var property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 0, 0], "time = 0.0");

		animationPlayer.setTime(0.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, -0.75, 0], "time = 0.5");

		animationPlayer.setTime(1.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 1.5, 0], "time = 1.0");

		animationPlayer.setTime(1.5);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 0.75, 0], "time = 1.5");

		animationPlayer.setTime(2.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, 0, 0], "time = 2.0");

		animationPlayer.setTime(3.0);
		property1 = animationPlayer.getAnimatedProperty(node1, AnimationTrackType.Translate);
		assert.deepEqual(property1.world, [0, -1.5, 0], "time = 3.0");
	});

	QUnit.test("Animation - euler rotation math", function(assert) {
		var rx = 14 / 180 * Math.PI;
		var ry = 77 / 180 * Math.PI;
		var rz = -50 / 180 * Math.PI;
		for (var ax = 0; ax < 3; ax++) {
			for (var ay = 0; ay < 3; ay++) {
				for (var az = 0; az < 3; az++) {
					if ((ax != ay) && (ax != az) && (ay != az)) {
						var order = (ax << 4) | (ay << 2) | az;
						var xyzo = ["X", "Y", "Z"];
						var stringcode = xyzo[ax] + xyzo[ay] + xyzo[az];
						var scode = stringcode + "_" + order;
						// assert.step("Testing axis order " + scode);

						var key = [rx, ry, rz, order];
						// convert euler to quat
						var result = AnimationMath.neutralEulerToGlMatrixQuat(key);

						// now convert back from quat to euler
						// assert.step("original [" + rx + ", " + ry + ", " + rz + "]");
						var result2 = AnimationMath.threeQuatToNeutralEuler(new THREE.Quaternion(result[0], result[1], result[2], result[3]), order);
						// assert.step("result2 [" + result2[0] + ", " + result2[1] + ", " + result2[2] + "]");
						assert.ok(Math.abs(result2[0] - rx) < 0.0001, "X rotation " + scode);
						assert.ok(Math.abs(result2[1] - ry) < 0.0001, "Y rotation " + scode);
						assert.ok(Math.abs(result2[2] - rz) < 0.0001, "Z rotation " + scode);
						assert.equal(result2[3], order, "Rotation order " + scode);

						// check that quat is correct by assembling a rotation matrix in three.js
						var target = new THREE.Matrix4();
						target.identity();
						for (var oi = 0; oi < 3; oi++) {
							var tm = new THREE.Matrix4();
							if ((order >> (oi * 2) & 3) === 0) {
								tm.makeRotationX(rx);
							} else if ((order >> (oi * 2) & 3) === 1) {
								tm.makeRotationY(ry);
							} else if ((order >> (oi * 2) & 3) === 2) {
								tm.makeRotationZ(rz);
							}
							target.premultiply(tm);
						}

						var qres = new THREE.Quaternion();
						qres.setFromRotationMatrix(target);
						assert.ok(Math.abs(result[0] - qres.x) < 0.0001, "X quat " + scode);
						assert.ok(Math.abs(result[1] - qres.y) < 0.0001, "Y quat " + scode);
						assert.ok(Math.abs(result[2] - qres.z) < 0.0001, "Z quat " + scode);
						assert.ok(Math.abs(result[3] - qres.w) < 0.0001, "W quat " + scode);

						var result3 = new THREE.Euler();
						result3.setFromRotationMatrix(target, stringcode);
						// assert.step("result3 [" + result3.x + ", " + result3.y + ", " + result3.z + "]");
						assert.ok(Math.abs(result3.x - rx) < 0.0001, "X rotation three.js " + scode);
						assert.ok(Math.abs(result3.y - ry) < 0.0001, "Y rotation three.js " + scode);
						assert.ok(Math.abs(result3.z - rz) < 0.0001, "Z rotation three.js " + scode);
					}
				}
			}
		}
	});

	QUnit.test("Animation - euler decomposition math", function(assert) {
		// todo: var xa = [  0,     0,     0,      0 ];
		// todo: var ya = [ 90,   592,    92,   -430 ];
		// todo: var za = [  0,     0,     0,      0 ];
		// todo: var or = [ 36,    36,     6,      6 ];
		var xa = [0, 0];
		var ya = [90, -430];
		var za = [0, 0];
		var or = [36, 6];

		for (var i = 0; i < xa.length; i++) {
			var key = [xa[i] / 180 * Math.PI, ya[i] / 180 * Math.PI, za[i] / 180 * Math.PI, or[i]];

			var q = AnimationMath.neutralEulerToGlMatrixQuat(key);
			var r = AnimationMath.glMatrixQuatToNeutral(q);
			var quaternion = new THREE.Quaternion(r[0], r[1], r[2], r[3]);
			var matrix = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);
			quaternion.setFromRotationMatrix(matrix);
			var rvalue = AnimationMath.threeQuatToNeutralEuler(quaternion, key[3]);

			rvalue[0] += AnimationMath.getModulatedAngularValue(key[0]);
			rvalue[1] += AnimationMath.getModulatedAngularValue(key[1]);
			rvalue[2] += AnimationMath.getModulatedAngularValue(key[2]);

			var eres = new THREE.Euler();
			eres.setFromRotationMatrix(matrix, "XYZ");
			assert.step("[" + xa[i] + ", " + ya[i] + ", " + za[i] + "] ==> [" + rvalue[0] * 180 / Math.PI + ", " + rvalue[1] * 180 / Math.PI + ", " + rvalue[2] * 180 / Math.PI
				+ "], three.setFromRotationMatrix = [" + eres.x * 180 / Math.PI + ", " + eres.y * 180 / Math.PI + ", " + eres.z * 180 / Math.PI + "]");

			assert.ok(Math.abs(rvalue[0] - key[0]) < 0.01, "X decomposed");
			assert.ok(Math.abs(rvalue[1] - key[1]) < 0.01, "Y decomposed");
			assert.ok(Math.abs(rvalue[2] - key[2]) < 0.01, "Z decomposed");
		}
	});

	QUnit.test("Matrix ordering - vector transform", function(assert) {
		var s = new THREE.Matrix4();
		var t = new THREE.Matrix4();
		s.makeScale(2, 2, 2);
		t.makeTranslation(5, 5, 5);

		var ts = t.clone();
		ts.multiply(s);// scale by 2, the translate by 5

		var v_ts = new THREE.Vector3(1, 1, 1);
		v_ts.applyMatrix4(ts);// 1 * 2 = 2; 2 + 5 = 7
		assert.deepEqual([v_ts.x, v_ts.y, v_ts.z], [7, 7, 7], "T * S");

		var st = t.clone();
		st.premultiply(s);// translate by 5, then scale by 2

		var v_st = new THREE.Vector3(1, 1, 1);
		v_st.applyMatrix4(st);// 1 + 5 = 6; 6 * 2 = 12
		assert.deepEqual([v_st.x, v_st.y, v_st.z], [12, 12, 12], "S * T");
	});

	QUnit.test("Matrix ordering - euler rotations", function(assert) {
		var r = new THREE.Matrix4();
		r.identity();

		var rtemp = new THREE.Matrix4();
		var rotx = 19 / 180 * Math.PI;
		var roty = 76 / 180 * Math.PI;
		var rotz = -48 / 180 * Math.PI;

		rtemp.makeRotationX(rotx);
		r.multiply(rtemp);

		rtemp.makeRotationY(roty);
		r.multiply(rtemp);

		rtemp.makeRotationZ(rotz);
		r.multiply(rtemp);

		var er = new THREE.Euler();
		er.setFromRotationMatrix(r, "XYZ");
		assert.deepEqual([er.x.toFixed(8), er.y.toFixed(8), er.z.toFixed(8)], [rotx.toFixed(8), roty.toFixed(8), rotz.toFixed(8)], "XYZ rotation");

		var rquat = new THREE.Quaternion();
		rquat.setFromRotationMatrix(r);

		assert.deepEqual([rquat.x.toFixed(8), rquat.y.toFixed(8), rquat.z.toFixed(8), rquat.w.toFixed(8)], ["-0.12816276", "0.60762117", "-0.22328870", "0.75134079"], "Quat rotation");

		var key = [rotx, roty, rotz, 6/* XYZ */];
		var q2 = AnimationMath.neutralEulerToGlMatrixQuat(key);
		assert.deepEqual([q2[0].toFixed(8), q2[1].toFixed(8), q2[2].toFixed(8), q2[3].toFixed(8)], ["-0.12816276", "0.60762117", "-0.22328870", "0.75134079"], "Quat rotation");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
