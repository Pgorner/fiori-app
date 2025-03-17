/*global QUnit */
sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ovp/test/integrations/pages/Common",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function (
	Opa5,
	Common,
	PropertyStrictEquals
) {
	"use strict";
	Opa5.createPageObjects({
		onTheMainPage: {
			baseClass: Common,
			actions: {
				iClickTheAdaptFiltersButton: function (btnName) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: btnName
						}),
						success: function (oButton1) {
							oButton1[0].$().trigger("tap");
						},
						errorMessage: " Adapt Filters button cant be clicked"
					});
				},
				iClickSmartFilterBar: function () {
					return this.waitFor({
						controlType: "sap.f.DynamicPageTitle",
						success: function (sfb) {
							sfb[0].$().trigger("tap");
							return this;
						},
						errorMessage: " Smart Filter bar cant be clicked"
					});
				},
				iClickTheGoButton: function (btnName) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: btnName
						}),
						success: function (oButton1) {
							oButton1[0].$().trigger("tap");
						},
						errorMessage: " Go button cant be clicked"
					});
				},
				iConfirmFilterChange: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: "Go" // No other identifier
							})
						],
						success: function (btns) {
							var btn = btns[0];
							btn.firePress();
						},
						errorMessage: "The confirmation dialog cannot be closed"
					});
				},
				iFilterBarFilter: function (fieldName, value) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",

						success: function (filterBars) {
							var filterBar = filterBars[0];

							var filterItems = filterBar.getAllFilterItems();
							for (var i = 0; i < filterItems.length; i++) {
								var filterItem = filterItems[i];
								if (filterItem.getName() == fieldName) {
									var filterControl = filterBar.determineControlByFilterItem(filterItem);
									filterControl.setValue(value);
									filterBar.fireFilterChange();
									Opa5.assert.ok(true, "Filters Applied");

								}
							}
						},
						errorMessage: "The filter cannot be applied"
					});
				}

			},

			assertions: {
				dialogOpen: function () {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: "Adapt Filters"
						}),
						success: function (oTitle) {
							Opa5.assert.ok(true, "Setting Dialog opened with a title");
						},
						errorMessage: "Setting Dialog not opened with a title."
					});
				},
				//Check if Adapt Filters button is present
				iFindAdaptFiltersButton: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: "Adapt Filters (1)"
						}),
						success: function (oButton1) {
							QUnit.strictEqual(oButton1[0].getText(), "Adapt Filters (1)", "Found Adapt Filter Button");
						},
						errorMessage: "The page has no Adapt Filters button."
					});
				}
			}
		}
	});
});