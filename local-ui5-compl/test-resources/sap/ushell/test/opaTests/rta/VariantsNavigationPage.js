// Copyright (c) 2009-2023 SAP SE, All Rights Reserved */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ushell/test/opaTests/rta/Common",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function (
	Opa5,
	Common,
	AggregationFilled,
	Press,
	PropertyStrictEquals
) {
	"use strict";

	Opa5.createPageObjects({
		onPageWithVariantsNavigation: {
			baseClass: Common,
			actions: {
				iSelectTheFirstObject: function () {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function (oTable) {
							const oFirstItem = oTable[0].getItems()[0];
							oFirstItem.$().trigger("tap");
						},
						errorMessage: "Items not loaded."
					});
				},
				iTriggerTheBrowserForwardEvent: function (sPageOrControlId) {
					return this.waitFor({
						id: sPageOrControlId,
						actions: function () {
							Opa5.getWindow().history.go(+1);
						},
						success: function () {
							Opa5.assert.ok(true, "Pressed on the forward button");
						},
						errorMessage: "Can not press the forward button"
					});
				},
				iSwitchToView: function (iViewIndex) {
					return this.waitFor({
						id: "application-Worklist-display-component---object--variantManagementPage-vm-list",
						errorMessage: "Did not find the view",
						success: function (oList) {
							setTimeout(function () {
									const oItem = oList.getItems()[iViewIndex];
									oItem.$().trigger("tap");
							}, 500);
						}
					});
				},
				iClickOnAnElement (sId) {
					return this.waitFor({
						id: sId,
						actions: new Press(),
						errorMessage: "Did not find the element"
					});
				},
				iEnterANewName: function (sNewLabel) {
					return this.waitFor({
						controlType: "sap.m.Input",
						searchOpenDialogs: true,
						success: function (oInput) {
							oInput[0].setValue(sNewLabel);
						},
						errorMessage: "Did not find the Selected Element Overlay"
					});
				},
				iPressSave: function () {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "type",
							value: "Emphasized"
						}),
						actions: new Press(),
						errorMessage: "Save Button not found"
					});
				}
			},
			assertions: {
				noReloadShouldHaveHappened: function () {
					return this.waitFor({
						controlType: "sap.m.Table",
						success: function () {
							const oOpa5Window = Opa5.getWindow();
							const oUShell = oOpa5Window.sap.ushell;
							Opa5.assert.ok(oUShell._reloadChecker, "Reload did not happen (FLP instance is still the same)");
						}
					});
				},
				iShouldSeeTheAppElement (sId) {
					return this.waitFor({
						id: sId,
						success (oElement) {
							Opa5.assert.ok(oElement.getVisible(), "The element is visible on the UI");
						},
						errorMessage: "Did not find the element or it is still invisible"
					});
				},
				iShouldSeeTheVariantName: function (sNewVariantTitle) {
					return this.waitFor({
						autoWait: true,
						controlType: "sap.ui.fl.variants.VariantManagement",
						matchers: function (oVariantManagement) {
							return oVariantManagement.getTitle().getText() === sNewVariantTitle;
						},
						success: function () {
							Opa5.assert.ok(true, "The variant was duplicated.");
						},
						errorMessage: "The variant was not duplicated"
					});
				}
			}
		}
	});
});
