/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/AnimationPlayer",
	"sap/ui/vk/AnimationPlayback",
	"sap/ui/vk/AnimationTrackType",
	"sap/ui/vk/AnimationTrackValueType",
	"sap/ui/vk/View",
	"sap/ui/vk/ViewManager",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/thirdparty/three"
], function(
	nextUIUpdate,
	jQuery,
	ViewStateManager,
	Viewport,
	AnimationPlayer,
	AnimationPlayback,
	AnimationTrackType,
	AnimationTrackValueType,
	View,
	ViewManager,
	loader,
	THREE
) {
	"use strict";

	QUnit.moduleWithContentConnector("AnimationPlayer", "test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", "threejs.test.json",
		function(assert) {
			this.viewStateManager = new ViewStateManager({
				contentConnector: this.contentConnector
			});
			this.viewport = new Viewport({
				contentConnector: this.contentConnector,
				viewStateManager: this.viewStateManager
			});
			this.animationPlayer = new AnimationPlayer({
				viewStateManager: this.viewStateManager
			});
			this.viewManager = new ViewManager({
				contentConnector: this.contentConnector,
				viewStateManager: this.viewStateManager
			});
			this.viewStateManager.setViewManager(this.viewManager);
			this.viewport.placeAt("content");
			nextUIUpdate.runSync();
		},
		null,
		function() {
			if (this.viewport) {
				this.viewport.destroy();
				delete this.viewport;
			}
			if (this.viewStateManager) {
				this.viewStateManager.destroy();
				delete this.viewStateManager;
			}
			if (this.animationPlayer) {
				this.animationPlayer.destroy();
				delete this.animationPlayer;
			}
			if (this.viewManager) {
				this.viewManager.destroy();
				delete this.viewManager;
			}
		}
	);

	QUnit.test("timeChanged event", function(assert) {
		var contentConnector = this.contentConnector;
		var animationPlayer = this.animationPlayer;

		var scene = contentConnector.getContent();

		var sequence0 = scene.createSequence("sq0", {
			name: "Test sequence 0",
			duration: 1.2
		});

		var sequence1 = scene.createSequence("sq1", {
			name: "Test sequence 1",
			duration: 3
		});

		var view = new View();
		var playback0 = new AnimationPlayback();
		playback0.setSequence(sequence0);
		view.addPlayback(playback0);

		var playback1 = new AnimationPlayback();
		playback1.setSequence(sequence1);
		view.addPlayback(playback1);
		animationPlayer.activateView(view);

		assert.equal(animationPlayer.getTime(), 0, "time initialized to zero");

		var beforeTimeChangedFired, timeChangedFired;
		var onBeforeTimeChanged, onTimeChanged;


		// change to a time within playback 1
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 0, "time parameter");
			assert.equal(parameters.nextTime, 1, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, playback0, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1, "time parameter");
			assert.equal(parameters.previousTime, 0, "previousTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(1);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 1, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback0, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");


		// change to end of first playback
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1, "time parameter");
			assert.equal(parameters.nextTime, 1.2, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, playback0, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1.2, "time parameter");
			assert.equal(parameters.previousTime, 1, "previousTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(1.2, 0);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 1.2, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback0, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");


		// change to start of first playback
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1.2, "time parameter");
			assert.equal(parameters.nextTime, 1.2, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, playback1, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1.2, "time parameter");
			assert.equal(parameters.previousTime, 1.2, "previousTime parameter");
			assert.equal(parameters.currentPlayback, playback1, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(0, 1);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 1.2, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback1, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");


		// no change to time
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function() {
			beforeTimeChangedFired = true;
		};
		onTimeChanged = function() {
			timeChangedFired = true;
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(0, 1);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 1.2, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback1, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, false, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, false, "timeChangedFired fired");


		// block time change events
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function() {
			beforeTimeChangedFired = true;
		};
		onTimeChanged = function() {
			timeChangedFired = true;
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(0, 0, true);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);
		assert.equal(animationPlayer.getTime(), 0, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback0, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, false, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, false, "timeChangedFired fired");


		// time out of range (-1)
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 0, "time parameter");
			assert.equal(parameters.nextTime, -1, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, undefined, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, -1, "time parameter");
			assert.equal(parameters.previousTime, 0, "previousTime parameter");
			assert.equal(parameters.currentPlayback, undefined, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(-1);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), -1, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), undefined, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");


		// time out of range (+10)
		animationPlayer.setTime(0);
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 0, "time parameter");
			assert.equal(parameters.nextTime, 10, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, undefined, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 10, "time parameter");
			assert.equal(parameters.previousTime, 0, "previousTime parameter");
			assert.equal(parameters.currentPlayback, undefined, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(10);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 10, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), undefined, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");
	});

	QUnit.test("setTime", function(assert) {
		var contentConnector = this.contentConnector;
		var viewStateManager = this.viewStateManager;
		var animationPlayer = this.animationPlayer;
		var viewManager = this.viewManager;

		var scene = contentConnector.getContent();

		var nodeRef = scene.getDefaultNodeHierarchy().findNodesByName({ value: "foot_peg_washer4" })[0];

		var view = scene.createView({
			name: "Test View",
			autoPlayAnimation: false
		});

		// We create 2 sequential animation playbacks:
		//
		// time in sequence             0           2
		//                  |----1.2----|---2.0x2---|----1.3-----|
		//                  | pre-delay | animation | post-delay |
		// time in playback 0          1.2         5.2          6.5
		//
		// time in sequence                                                  0           3
		//                                                       |----0.6----|--3.0/1.5--|----0.4-----|
		//                                                       | pre-delay | animation | post-delay |
		// time in playback                                      0          0.6         2.6          3.0
		//                                                     (6.5)       (7.1)       (9.1)        (9.5)
		//
		// relative values              0           20                       0         -10
		// absolute values  0           0           20          20          20          10           10

		////////////////////////////////////////////////////////////////////////
		// Sequence 0

		var sequence0 = scene.createSequence("sq0", {
			name: "Test sequence 0",
			duration: 2
		});

		var playback0 = new AnimationPlayback({
			sequence: sequence0,
			startTime: 0,
			preDelay: 1.2,
			postDelay: 1.3,
			timeScale: 2.0
		});

		view.addPlayback(playback0);

		var track0 = scene.createTrack("Track0", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		track0.insertKey(0, [0, 0, 0]);
		track0.insertKey(2, [20, 0, 0]);

		sequence0.setNodeAnimation(nodeRef, AnimationTrackType.Translate, track0);

		////////////////////////////////////////////////////////////////////////
		// Sequence 1

		var sequence1 = scene.createSequence("sq1", {
			name: "Test sequence 1",
			duration: 3
		});

		var playback1 = new AnimationPlayback({
			sequence: sequence1,
			startTime: 6.5,
			preDelay: 0.6,
			postDelay: 0.4,
			timeScale: 1 / 1.5
		});

		view.addPlayback(playback1);

		var track1 = scene.createTrack("Track1", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		track1.insertKey(0, [0, 0, 0]);
		track1.insertKey(3, [-10, 0, 0]);

		sequence1.setNodeAnimation(nodeRef, AnimationTrackType.Translate, track1);

		////////////////////////////////////////////////////////////////////////
		// Asserts

		viewManager.activateView(view, true);
		animationPlayer.activateView(view);

		var controlPoints = [
			// Sequential
			{ time: 0.0, value: 0.0 },
			{ time: 0.6, value: 0.0 },
			{ time: 1.2, value: 0.0 },
			{ time: 3.2, value: 10.0 },
			{ time: 5.2, value: 20.0 },
			{ time: 6.0, value: 20.0 },
			{ time: 6.5, value: 20.0 },

			{ time: 6.8, value: 20.0 },
			{ time: 8.1, value: 15.0 },
			{ time: 9.1, value: 10.0 },
			{ time: 9.3, value: 10.0 },
			{ time: 9.5, value: 10.0 },

			// Random
			{ time: 0.6, value: 0.0 },
			{ time: 6.0, value: 20.0 },
			{ time: 9.3, value: 10.0 },
			{ time: 0.0, value: 0.0 },
			{ time: 6.8, value: 20.0 },
			{ time: 9.5, value: 10.0 },
			{ time: 1.2, value: 0.0 },
			{ time: 9.1, value: 10.0 },
			{ time: 5.2, value: 20.0 },
			{ time: 3.2, value: 10.0 },
			{ time: 8.1, value: 15.0 },
			{ time: 6.5, value: 20.0 }
		];

		controlPoints.forEach(function(point) {
			animationPlayer.setTime(point.time);
			var x = viewStateManager.getTransformation(nodeRef).translation[0];
			assert.equal(Math.fround(x), Math.fround(point.value), "setTime(" + point.time + ")");
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
