/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/RedlineUpgradeManager"
], function(
	RedlineUpgradeManager
) {
	"use strict";

	QUnit.test("Test schema version 1.0", function(assert) {
		var json = {
			schemaVersion: "1.0"
		};
		assert.strictEqual(RedlineUpgradeManager.upgrade(json).schemaVersion, json.schemaVersion, "Version equivalent");
	});

	QUnit.test("Test unsupported schema version", function(assert) {
		var json = {
			schemaVersion: "99"
		};
		assert.throws(function() {RedlineUpgradeManager.upgrade(json);}, "Error thrown");
	});

	QUnit.test("Test undefined schema version", function(assert) {
		var json = {
			schemaVersion: undefined
		};
		assert.strictEqual(RedlineUpgradeManager.upgrade(json).schemaVersion, "1.0", "Version equivalent");
	});

	QUnit.test("Test no schema version property", function(assert) {
		var json = {};
		assert.strictEqual(RedlineUpgradeManager.upgrade(json).schemaVersion, "1.0", "Version equivalent");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});