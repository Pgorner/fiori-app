/* global QUnit */

sap.ui.define([
	"sap/ui/vk/DrawerToolbar",
	"sap/ui/vk/DrawerToolbarButton",
	"sap/ui/vk/NavigationMode",
	"sap/m/Button"
], function(
	DrawerToolbar,
	DrawerToolbarButton,
	NavigationMode,
	Button
) {
	"use strict";

	QUnit.test("Toolbar Creation", function(assert) {
		var Toolbar = new DrawerToolbar();
		assert.ok(Toolbar._getToolbar(), "Toolbar created");
		assert.strictEqual(Toolbar._getToolbar().getContent().length, 27, "All content exists");
		Toolbar.destroy();
	});

	QUnit.test("Add Content To Toolbar", function(assert) {
		var Toolbar = new DrawerToolbar();
		var button = new Button();
		button.vitId = "QUnitButton";
		var contentToolbar = Toolbar._getToolbar();
		contentToolbar.addContent(button);
		assert.strictEqual(contentToolbar.getContent().length, 28, "Button added to content");
		Toolbar.destroy();
	});

	QUnit.test("Remove Content From Toolbar", function(assert) {
		var Toolbar = new DrawerToolbar();
		var contentToolbar = Toolbar._getToolbar();
		function getContent(name) {
			return contentToolbar.getContent().find(function(content) { return content.vitId === name; });
		}
		contentToolbar.removeContent(getContent(DrawerToolbarButton.Hide));
		contentToolbar.removeContent(getContent(DrawerToolbarButton.Orbit));
		assert.strictEqual(contentToolbar.getContent().length, 25, "Buttons removed from content");
		contentToolbar.removeContent(getContent(DrawerToolbarButton.Show));
		assert.strictEqual(contentToolbar.getContent().length, 23, "Beginning spacer removed automatically");
		contentToolbar.removeContent(getContent(DrawerToolbarButton.FitToView));
		assert.strictEqual(contentToolbar.getContent().length, 21, "Side by side spacer removed automatically");
		contentToolbar.removeContent(getContent(DrawerToolbarButton.FullScreen));
		assert.strictEqual(contentToolbar.getContent().length, 20, "Ending spacer removed automatically");
		Toolbar.destroy();
	});

	QUnit.test("Toolbar Navigation Modes", function(assert) {
		var toolbar = new DrawerToolbar();
		var contentToolbar = toolbar._getToolbar();
		function getContent(name) {
			return contentToolbar.getContent().find(function(content) { return content.vitId === name; });
		}

		toolbar.setNavigationMode(NavigationMode.Turntable);
		assert.strictEqual(toolbar.getNavigationMode(), NavigationMode.Turntable, "Turntable navigation mode");
		assert.strictEqual(getContent(DrawerToolbarButton.Turntable).getPressed(), true, "turntable pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Orbit).getPressed(), false, "orbit not pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Pan).getPressed(), false, "pan not pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Zoom).getPressed(), false, "zoom not pressed");

		toolbar.setNavigationMode(NavigationMode.Orbit);
		assert.strictEqual(toolbar.getNavigationMode(), NavigationMode.Orbit, "Pan navigation mode");
		assert.strictEqual(getContent(DrawerToolbarButton.Turntable).getPressed(), false, "turntable not pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Orbit).getPressed(), true, "orbit pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Pan).getPressed(), false, "pan not pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Zoom).getPressed(), false, "zoom not pressed");

		toolbar.setNavigationMode(NavigationMode.Pan);
		assert.strictEqual(toolbar.getNavigationMode(), NavigationMode.Pan, "Pan navigation mode");
		assert.strictEqual(getContent(DrawerToolbarButton.Turntable).getPressed(), false, "turntable not pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Orbit).getPressed(), false, "orbit not pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Pan).getPressed(), true, "pan pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Zoom).getPressed(), false, "zoom not pressed");

		toolbar.setNavigationMode(NavigationMode.Zoom);
		assert.strictEqual(toolbar.getNavigationMode(), NavigationMode.Zoom, "Zoom navigation mode");
		assert.strictEqual(getContent(DrawerToolbarButton.Turntable).getPressed(), false, "turntable not pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Orbit).getPressed(), false, "orbit not pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Pan).getPressed(), false, "pan not pressed");
		assert.strictEqual(getContent(DrawerToolbarButton.Zoom).getPressed(), true, "zoom pressed");

		toolbar.destroy();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});

});
