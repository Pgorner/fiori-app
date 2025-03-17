/* global QUnit */

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/vk/ToggleMenuButton",
	"sap/ui/vk/ToggleMenuItem"
], function(
	nextUIUpdate,
	ToggleMenuButton,
	ToggleMenuItem
) {
	"use strict";

	QUnit.test("ToggleMenuButton", async function(assert) {
		var selectedItem = null;
		var newItem = null;
		var oldItem = null;
		var items = [
			new ToggleMenuItem({
				icon: "sap-icon://border",
				text: "item 1",
				toggleable: false,
				key: 0
			}),
			new ToggleMenuItem({
				icon: "sap-icon://circle-task",
				text: "item 2",
				key: 1
			}),
			new ToggleMenuItem({
				icon: "sap-icon://less",
				text: "item 3",
				toggleable: false,
				key: 2
			}),
			new ToggleMenuItem({
				icon: "sap-icon://arrow-right",
				text: "item 4",
				startsSection: true,
				key: 3
			})
		];
		var button = new ToggleMenuButton({
			type: sap.m.ButtonType.Transparent,
			items: items,
			itemToggled: function(event) {
				newItem = event.getParameter("newItem");
				oldItem = event.getParameter("oldItem");
				selectedItem = null;
				assert.equal(button.getDefaultItem(), newItem ? newItem.getId() : oldItem.getId(), "defaultItem test");
				if (newItem) {
					assert.ok(newItem.getToggleable(), "item[" + newItem.getKey() + "] is toggleable");
				}
				if (oldItem) {
					assert.ok(oldItem.getToggleable(), "item[" + oldItem.getKey() + "] is toggleable");
				}
			},
			itemSelected: function(event) {
				selectedItem = event.getParameter("item");
				assert.notOk(selectedItem.getToggleable(), "item[" + selectedItem.getKey() + "] is not toggleable");
				newItem = oldItem = null;
			}
		});

		var toolbar = new sap.m.Toolbar({
			width: "auto",
			design: sap.m.ToolbarDesign.Solid,
			content: [button]
		});
		var page = new sap.m.Page({ content: [toolbar] }).placeAt("content");
		await nextUIUpdate();

		var items = button.getAggregation("items");
		assert.ok(items && items.length === 4, "Items");

		var toggleButton = button.getAggregation("_toggleButton");
		var arrowButton = button.getAggregation("_arrowButton");
		var menu = button.getAggregation("_menu");
		assert.ok(button.getAggregation("_toggleButton") instanceof sap.m.ToggleButton, "Toogle button created");
		assert.ok(arrowButton instanceof sap.m.Button, "Arrow button created");
		assert.ok(menu instanceof sap.m.Menu, "Menu created");
		assert.ok(menu.getItems() && menu.getItems().length === 4, "Menu items");

		assert.ok(page.getDomRef(), "Page rendered");
		assert.ok(toolbar.getDomRef(), "Toolbar rendered");
		assert.ok(button.getDomRef(), "Button rendered");

		assert.equal(button.getDefaultItem(), items[1].getId(), "Initial defaultItem");
		assert.equal(toggleButton.getIcon(), items[1].getIcon(), "Initial toggleButton icon");
		assert.equal(toggleButton.getPressed(), false, "Initial toggleButton state");

		assert.equal(selectedItem, null, "selectedItem = null");
		assert.equal(newItem, null, "newItem = null");
		assert.equal(oldItem, null, "oldItem = null");

		menu.fireItemSelected({ item: items[0] });

		assert.equal(selectedItem && selectedItem.getId(), items[0].getId(), "selectedItem = item[0]");
		assert.equal(newItem && newItem.getId(), null, "newItem = null");
		assert.equal(oldItem && oldItem.getId(), null, "oldItem = null");
		assert.equal(toggleButton.getIcon(), items[1].getIcon(), "icon1");

		menu.fireItemSelected({ item: items[1] });

		assert.equal(selectedItem && selectedItem.getId(), null, "selectedItem = null");
		assert.equal(newItem && newItem.getId(), items[1].getId(), "newItem = item[1]");
		assert.equal(oldItem && oldItem.getId(), null, "oldItem = null");
		assert.equal(toggleButton.getIcon(), items[1].getIcon(), "icon1");

		menu.fireItemSelected({ item: items[1] });

		assert.equal(selectedItem && selectedItem.getId(), null, "selectedItem = null");
		assert.equal(newItem && newItem.getId(), null, "newItem = null");
		assert.equal(oldItem && oldItem.getId(), items[1].getId(), "oldItem = item[1]");
		assert.equal(toggleButton.getIcon(), items[1].getIcon(), "icon1");

		menu.fireItemSelected({ item: items[2] });

		assert.equal(selectedItem && selectedItem.getId(), items[2].getId(), "selectedItem = item[2]");
		assert.equal(newItem && newItem.getId(), null, "newItem = null");
		assert.equal(oldItem && oldItem.getId(), null, "oldItem = null");
		assert.equal(toggleButton.getIcon(), items[1].getIcon(), "icon1");

		menu.fireItemSelected({ item: items[3] });

		assert.equal(selectedItem && selectedItem.getId(), null, "selectedItem = null");
		assert.equal(newItem && newItem.getId(), items[3].getId(), "newItem = item[3]");
		assert.equal(oldItem && oldItem.getId(), null, "oldItem = null");
		assert.equal(toggleButton.getIcon(), items[3].getIcon(), "icon3");

		menu.fireItemSelected({ item: items[1] });

		assert.equal(selectedItem && selectedItem.getId(), null, "selectedItem = null");
		assert.equal(newItem && newItem.getId(), items[1].getId(), "newItem = item[1]");
		assert.equal(oldItem && oldItem.getId(), items[3].getId(), "oldItem = item[3]");
		assert.equal(toggleButton.getIcon(), items[1].getIcon(), "icon1");

		newItem = oldItem = null;
		toggleButton.setPressed(!toggleButton.getPressed());
		toggleButton.firePress({});

		assert.equal(newItem && newItem.getId(), null, "newItem = null");
		assert.equal(oldItem && oldItem.getId(), items[1].getId(), "oldItem = item[1]");
		assert.equal(toggleButton.getIcon(), items[1].getIcon(), "icon1");

		page.destroy();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});

});
