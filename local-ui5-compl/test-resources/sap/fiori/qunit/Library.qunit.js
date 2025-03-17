/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/core/Lib"
], function(Library) {
	"use strict";

	function noop() {}

	QUnit.module("");

	QUnit.test("When the sap.fiori library is loaded...", function(assert) {
		return Library.load("sap.fiori").then(() => {
			assert.ok(true, "...then no error occurs");
		}, (err) => {
			assert.strictEqual(err, undefined, "...then, no error should occur, but it did");
		});
	});

	QUnit.test("When the sap.fiori library is loaded...", function(assert) {
		this.spy(sap.ui, "requireSync");

		assert.strictEqual(sap.ui.loader.config().async, true, "...and the ui5loader operates in async mode (precondition)");

		return Library.load("sap.fiori").catch(noop).finally(function() {
			assert.ok(
				sap.ui.requireSync.neverCalledWith(sinon.match(/sap\/fiori\/messagebundle-preload/)),
				"...then no messagebundle-preload should have been requested");
		});
	});
});
