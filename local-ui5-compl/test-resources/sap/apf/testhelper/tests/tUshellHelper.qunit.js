sap.ui.define([
	"sap/apf/testhelper/ushellHelper",
	"sap/apf/testhelper/doubles/messageHandler"
],function(
	ushellHelper,
	MessageHandlerDouble
) {
	"use strict";

	QUnit.module("Ushell double", {
		beforeEach : function(assert) {
			this.messageHandler = new MessageHandlerDouble().spyPutMessage();
			ushellHelper.setup();
		},
		afterEach : function(assert) {
			ushellHelper.teardown();
		}
	});
	QUnit.test('App state only', function(assert) {
		var done = assert.async();
		if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
			var appNav = sap.ushell.Container.getService("CrossApplicationNavigation");
			var appState = appNav.createEmptyAppState(this);
			appState.setData({
				name : "hugo"
			});
			appState.save();
			appNav.getAppState(this, appState.getKey()).done(function(container) {
				assert.equal(container.getData().name, 'hugo', 'Saved app state fetched');
				done();
			}).fail(function() {
				assert.ok(false);
				done();
			});
		} else {
			assert.ok(false, "sap.ushell.Container not defined");
		}
	});
});