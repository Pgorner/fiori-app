/* global QUnit */

sap.ui.define([
	"sap/base/Log",
	"sap/ui/base/ManagedObject",
	"sap/ui/core/Element",
	"sap/ui/vk/Core"
], function(
	Log,
	ManagedObject,
	Element,
	vkCore
) {
	"use strict";

	////////////////////////////////////////////////////////////////////////////
	// Test associations with normal types

	var Team = ManagedObject.extend("sap.ui.vk.qunit.Team", {
		metadata: {
			associations: {
				coach: {
					type: "sap.ui.vk.qunit.Coach",
					multiple: false
				},
				captain: {
					type: "sap.ui.vk.qunit.Player",
					multiple: false
				},
				players: {
					type: "sap.ui.vk.qunit.Player",
					multiple: true
				}
			}
		},
		constructor: function(id, settings) {
			ManagedObject.apply(this, arguments);
			vkCore.observeAssociations(this);
		},
		onSetCoach: function(coach) {
			Log.info("onSetCoach(" + coach.getId() + ")");
		},
		onUnsetCoach: function(coach) {
			Log.info("onUnsetCoach(" + coach.getId() + ")");
		},
		onSetCaptain: function(captain) {
			Log.info("onSetCaptain(" + captain.getId() + ")");
		},
		onUnsetCaptain: function(captain) {
			Log.info("onUnsetCaptain(" + captain.getId() + ")");
		},
		onAddPlayer: function(player) {
			Log.info("onAddPlayer(" + player.getId() + ")");
		},
		onRemovePlayer: function(player) {
			Log.info("onRemovePlayer(" + player.getId() + ")");
		}
	});

	var Coach = Element.extend("sap.ui.vk.qunit.Coach", {
		constructor: function(id, settings) {
			Element.apply(this, arguments);
			vkCore.observeLifetime(this);
		}
	});

	var Player = Element.extend("sap.ui.vk.qunit.Player", {
		constructor: function(id, settings) {
			Element.apply(this, arguments);
			vkCore.observeLifetime(this);
		}
	});

	QUnit.module("Core - Observing Associations with Normal Types", {
		beforeEach: function(assert) {
			this.spy(Team.prototype, "onSetCoach");
			this.spy(Team.prototype, "onUnsetCoach");
			this.spy(Team.prototype, "onSetCaptain");
			this.spy(Team.prototype, "onUnsetCaptain");
			this.spy(Team.prototype, "onAddPlayer");
			this.spy(Team.prototype, "onRemovePlayer");
		},
		afterEach: function(assert) {
			Team.prototype.onSetCoach.restore();
			Team.prototype.onUnsetCoach.restore();
			Team.prototype.onSetCaptain.restore();
			Team.prototype.onUnsetCaptain.restore();
			Team.prototype.onAddPlayer.restore();
			Team.prototype.onRemovePlayer.restore();
		}
	});

	QUnit.test("Observe associations - 1", function(assert) {
		var calls;

		var team = new Team("team-1");
		team.setCoach("coach-1");
		team.setCaptain("captain-1");
		team.addPlayer("player-1");
		team.addPlayer("player-2");
		team.addPlayer("player-3");

		var coach1 = new Coach("coach-1");
		var captain = new Player("captain-1");
		var player1 = new Player("player-1");
		var player2 = new Player("player-2");

		calls = Team.prototype.onSetCoach.getCalls();
		assert.equal(calls.length, 1, "onSetCoach called 1 time");
		assert.equal(calls[0].args[0], coach1, "Coach 'coach-1' set");

		calls = Team.prototype.onSetCaptain.getCalls();
		assert.equal(calls.length, 1, "onSetCaptain called 1 time");
		assert.equal(calls[0].args[0], captain, "Captain 'captain-1' set");

		calls = Team.prototype.onAddPlayer.getCalls();
		assert.equal(calls.length, 2, "onAddPlayer called 2 times");
		assert.equal(calls[0].args[0], player1, "Player 'player-1' added");
		assert.equal(calls[1].args[0], player2, "Player 'player-2' added");

		coach1.destroy();

		calls = Team.prototype.onUnsetCoach.getCalls();
		assert.equal(calls.length, 1, "onUnsetCoach called 1 time");
		assert.equal(calls[0].args[0], coach1, "Coach 'coach-1' unset");

		captain.destroy();

		calls = Team.prototype.onUnsetCaptain.getCalls();
		assert.equal(calls.length, 1, "onUnsetCaptain called 1 time");
		assert.equal(calls[0].args[0], captain, "Captain 'captain-1' unset");

		player1.destroy();
		player2.destroy();

		calls = Team.prototype.onRemovePlayer.getCalls();
		assert.equal(calls.length, 2, "onRemovePlayer called 2 times");
		assert.equal(calls[0].args[0], player1, "Player 'player-1' removed");
		assert.equal(calls[1].args[0], player2, "Player 'player-2' removed");

		team.destroy();
	});

	QUnit.test("Observe associations - 2", function(assert) {
		var calls;

		var coach1 = new Coach("coach-1");
		var captain = new Player("captain-1");
		var player1 = new Player("player-1");
		var player2 = new Player("player-2");

		var team = new Team("team-1");
		team.setCoach("coach-1");
		team.setCaptain("captain-1");
		team.addPlayer("player-1");
		team.addPlayer("player-2");
		team.addPlayer("player-3");

		calls = Team.prototype.onSetCoach.getCalls();
		assert.equal(calls.length, 1, "onSetCoach called 1 time");
		assert.equal(calls[0].args[0], coach1, "Coach 'coach-1' set");

		calls = Team.prototype.onSetCaptain.getCalls();
		assert.equal(calls.length, 1, "onSetCaptain called 1 time");
		assert.equal(calls[0].args[0], captain, "Captain 'captain-1' set");

		calls = Team.prototype.onAddPlayer.getCalls();
		assert.equal(calls.length, 2, "onAddPlayer called 2 times");
		assert.equal(calls[0].args[0], player1, "Player 'player-1' added");
		assert.equal(calls[1].args[0], player2, "Player 'player-2' added");

		coach1.destroy();

		calls = Team.prototype.onUnsetCoach.getCalls();
		assert.equal(calls.length, 1, "onUnsetCoach called 1 time");
		assert.equal(calls[0].args[0], coach1, "Coach 'coach-1' unset");

		captain.destroy();

		calls = Team.prototype.onUnsetCaptain.getCalls();
		assert.equal(calls.length, 1, "onUnsetCaptain called 1 time");
		assert.equal(calls[0].args[0], captain, "Captain 'captain-1' unset");

		player1.destroy();
		player2.destroy();

		calls = Team.prototype.onRemovePlayer.getCalls();
		assert.equal(calls.length, 2, "onRemovePlayer called 2 times");
		assert.equal(calls[0].args[0], player1, "Player 'player-1' removed");
		assert.equal(calls[1].args[0], player2, "Player 'player-2' removed");

		team.destroy();
	});

	QUnit.test("Observe associations - 3", function(assert) {
		var calls;

		var coach1 = new Coach("coach-1");
		var captain = new Player("captain-1");
		var player1 = new Player("player-1");
		var player2 = new Player("player-2");

		var team = new Team("team-1");
		team.setCoach("coach-1");
		team.setCaptain("captain-1");
		team.addPlayer("player-1");
		team.addPlayer("player-2");
		team.addPlayer("player-3");

		calls = Team.prototype.onSetCoach.getCalls();
		assert.equal(calls.length, 1, "onSetCoach called 1 time");
		assert.equal(calls[0].args[0], coach1, "Coach 'coach-1' set");

		calls = Team.prototype.onSetCaptain.getCalls();
		assert.equal(calls.length, 1, "onSetCaptain called 1 time");
		assert.equal(calls[0].args[0], captain, "Captain 'captain-1' set");

		calls = Team.prototype.onAddPlayer.getCalls();
		assert.equal(calls.length, 2, "onAddPlayer called 2 times");
		assert.equal(calls[0].args[0], player1, "Player 'player-1' added");
		assert.equal(calls[1].args[0], player2, "Player 'player-2' added");

		team.destroy();

		calls = Team.prototype.onUnsetCoach.getCalls();
		assert.equal(calls.length, 1, "onUnsetCoach called 1 time");
		assert.equal(calls[0].args[0], coach1, "Coach 'coach-1' unset");

		calls = Team.prototype.onUnsetCaptain.getCalls();
		assert.equal(calls.length, 1, "onUnsetCaptain called 1 time");
		assert.equal(calls[0].args[0], captain, "Captain 'captain-1' unset");

		calls = Team.prototype.onRemovePlayer.getCalls();
		assert.equal(calls.length, 2, "onRemovePlayer called 2 times");
		assert.equal(calls[0].args[0], player1, "Player 'player-1' removed");
		assert.equal(calls[1].args[0], player2, "Player 'player-2' removed");

		coach1.destroy();
		captain.destroy();
		player1.destroy();
		player2.destroy();

		// Nothing must change after associated objects are destroyed if the object that references them is destroyed
		// first.

		calls = Team.prototype.onUnsetCoach.getCalls();
		assert.equal(calls.length, 1, "onUnsetCoach called 1 time");
		assert.equal(calls[0].args[0], coach1, "Coach 'coach-1' unset");

		calls = Team.prototype.onUnsetCaptain.getCalls();
		assert.equal(calls.length, 1, "onUnsetCaptain called 1 time");
		assert.equal(calls[0].args[0], captain, "Captain 'captain-1' unset");

		calls = Team.prototype.onRemovePlayer.getCalls();
		assert.equal(calls.length, 2, "onRemovePlayer called 2 times");
		assert.equal(calls[0].args[0], player1, "Player 'player-1' removed");
		assert.equal(calls[1].args[0], player2, "Player 'player-2' removed");
	});

	////////////////////////////////////////////////////////////////////////////
	// Test associations with interfaces

	var Viewport = Element.extend("sap.ui.vk.qunit.Viewport", {
		metadata: {
			interfaces: ["sap.ui.vk.qunit.IViewActivator"]
		},
		constructor: function(id, settings) {
			Element.apply(this, arguments);
			vkCore.observeLifetime(this);
		}
	});

	var ViewManager = ManagedObject.extend("sap.ui.vk.qunit.ViewManager", {
		metadata: {
			associations: {
				viewActivator: {
					type: "sap.ui.vk.qunit.IViewActivator", // NB: This is interface name, not class name.
					multiple: false
				}
			}
		},
		constructor: function(id, settings) {
			ManagedObject.apply(this, arguments);
			vkCore.observeAssociations(this);
			this._viewActivator = null;
			this._currentView = null;
		},
		onSetViewActivator: function(viewActivator) {
			this._viewActivator = viewActivator;
		},
		onUnsetViewActivator: function(viewActivator) {
			this._viewActivator = null;
		}
	});

	QUnit.module("Core - Observing Associations with Interfaces", {
		beforeEach: function(assert) {
			this.spy(ViewManager.prototype, "onSetViewActivator");
			this.spy(ViewManager.prototype, "onUnsetViewActivator");
		},
		afterEach: function(assert) {
			ViewManager.prototype.onSetViewActivator.restore();
			ViewManager.prototype.onUnsetViewActivator.restore();
		}
	});

	QUnit.test("Observe associations with interfaces - 1", function(assert) {
		var viewManager = new ViewManager("viewManager-1");
		var viewport = new Viewport("viewport-1");
		viewManager.setViewActivator(viewport);
		viewManager.setViewActivator(null);
		viewport.destroy();
		viewManager.destroy();

		var calls;

		calls = ViewManager.prototype.onSetViewActivator.getCalls();
		assert.equal(calls.length, 1, "onSetViewActivator called 1 time");
		assert.equal(calls[0].args[0], viewport, "Viewport 'viewport-1' is set");

		calls = ViewManager.prototype.onUnsetViewActivator.getCalls();
		assert.equal(calls.length, 1, "onUnsetViewActivator called 1 time");
		assert.equal(calls[0].args[0], viewport, "Viewport 'viewport-1' is unset");
	});
});
