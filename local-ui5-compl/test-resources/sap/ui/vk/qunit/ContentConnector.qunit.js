/* global QUnit*/

sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/vk/ContentConnector"
], function(
	Core,
	ContentConnector
) {
	"use strict";

	/*
	 * Unit tests for the following methods:
	 * ---- removeContentManagerResolver
	 */

	QUnit.test("test removeContentManagerResolver", function(assert) {

		var resolver1 = function() { };

		var resolver2 = function() { };

		var resolver3 = {
			pattern: "test"
		};

		var resolver4 = {
			pattern: new RegExp("\\w+")
		};

		var resolver5 = {
			pattern: new RegExp("\\w+")
		};

		ContentConnector.addContentManagerResolver(resolver1);
		assert.equal(ContentConnector.removeContentManagerResolver(resolver2), false, "Removing non existing function resolver.");
		assert.equal(ContentConnector.removeContentManagerResolver(resolver1), true, "Removing existing function resolver.");

		ContentConnector.addContentManagerResolver(resolver3);
		assert.equal(ContentConnector.removeContentManagerResolver(resolver4), false, "Removing non existing object resolver with RegExp pattern.");
		assert.equal(ContentConnector.removeContentManagerResolver(resolver3), true, "Removing existing object resolver with String pattern.");

		ContentConnector.addContentManagerResolver(resolver4);
		assert.equal(ContentConnector.removeContentManagerResolver(resolver3), false, "Removing non existing object resolver with String pattern.");
		assert.equal(ContentConnector.removeContentManagerResolver(resolver4), true, "Removing existing object resolver with RegExp pattern.");

		ContentConnector.addContentManagerResolver(resolver3);
		assert.equal(ContentConnector.removeContentManagerResolver("test"), true, "Removing existing object resolver with String pattern by String.");

		ContentConnector.addContentManagerResolver(resolver3);
		assert.equal(ContentConnector.removeContentManagerResolver(new RegExp("\\w+")), false, "Removing existing object resolver with String pattern by RegExp.");

		ContentConnector.addContentManagerResolver(resolver4);
		assert.equal(ContentConnector.removeContentManagerResolver("\\w+"), true, "Removing existing object resolver with RegExp pattern by String.");

		ContentConnector.addContentManagerResolver(resolver4);
		assert.equal(ContentConnector.removeContentManagerResolver(new RegExp("\\w+")), true, "Removing existing object resolver with RegExp pattern by RegExp.");

		ContentConnector.addContentManagerResolver(resolver4);
		assert.equal(ContentConnector.removeContentManagerResolver(resolver5), false, "Removing existing object resolver with RegExp pattern by identical object resolver.");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
