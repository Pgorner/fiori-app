/*global QUnit */
sap.ui.define([
	"sap/gantt/config/SettingItem",
	"sap/m/FlexBox",
	"sap/m/CheckBox",
	"sap/gantt/simple/ContainerToolbar"
], function (SettingItem, FlexBox, CheckBox, ContainerToolbar) {
	"use strict";

	QUnit.module("Create config.SettingItem with default values.", {
		beforeEach: function () {
			this.oConfig = new SettingItem();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getChecked(), false);
		assert.strictEqual(this.oConfig.getKey(), "");
		assert.strictEqual(this.oConfig.getDisplayText(), "");
	});

	QUnit.module("Create config.SettingItem with customized values.", {
		beforeEach: function () {
			this.oConfig = new SettingItem({
				checked: true,
				key: "ITEM1",
				displayText: "Enable Row Scroll Sync"
			});

			this._oSettingsBox = new FlexBox({
				direction: "Column",
				items: [
					new CheckBox({
						name: "ITEM1",
						text: "Enable Row Scroll Sync",
						selected: false
					}).addStyleClass("sapUiSettingBoxItem"),
					new CheckBox({
						name: "ITEM2",
						text: "Adhoc Line",
						selected: true
					}).addStyleClass("sapUiSettingBoxItem"),
					new CheckBox({
						name: "ITEM3",
						text: "Delta Line",
						selected: true
					}).addStyleClass("sapUiSettingBoxItem")
				]
			}).addStyleClass("sapUiSettingBox");
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getChecked(), true);
		assert.strictEqual(this.oConfig.getKey(), "ITEM1");
		assert.strictEqual(this.oConfig.getDisplayText(), "Enable Row Scroll Sync");
	});

	QUnit.test("Test setChecked should set setSelected property internally.", function (assert) {
		assert.strictEqual(this._oSettingsBox.getItems()[0].getSelected(), false, "setSelected is set to false before setChecked is called");
		this.oConfig.setParent(new ContainerToolbar({}));
		var oContainerToolbar = this.oConfig.getParent();
		oContainerToolbar._oSettingsBox = this._oSettingsBox;
		this.oConfig.setChecked(true);
		assert.strictEqual(this._oSettingsBox.getItems()[0].getSelected(), true, "setSelected is set to true after setChecked is called with value true");
		this.oConfig.setChecked(false);
		assert.strictEqual(this._oSettingsBox.getItems()[0].getSelected(), false, "setSelected is set to false after setChecked is called with value false");
	});
});
