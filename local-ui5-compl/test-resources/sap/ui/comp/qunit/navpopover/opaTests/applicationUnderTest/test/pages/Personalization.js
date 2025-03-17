/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationContainsPropertyEqual",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"test-resources/sap/ui/comp/testutils/opa/TestUtils",
	"test-resources/sap/ui/comp/testutils/opa/smartlink/Actions",
	"test-resources/sap/ui/comp/testutils/opa/smartlink/Assertions",
	"test-resources/sap/ui/comp/testutils/opa/smartlink/waitForP13nDialog"
], function(
	Opa5,
	AggregationContainsPropertyEqual,
	Ancestor,
	PropertyStrictEquals,
	TestUtils,
	SmartLinkActions,
	SmartLinkAssertions,
	waitForP13nDialog
) {
	"use strict";

	Opa5.createPageObjects({
		onThePersonalizationPage: {
			actions: {
				iRightClickOnLinkInElementOverlay: function(sText) {
					return SmartLinkActions.iRightClickOnLinkInElementOverlay.call(this, sText);
				},
				iSelectALinkOnP13nDialog: function(sColumnName) {
					return SmartLinkActions.iSelectALinkOnP13nDialog.call(this, sColumnName);
				},
				iPressOnMoreLinksButton: function() {
					return SmartLinkActions.iPressOnMoreLinksButton.call(this, {});
				},
				iPressOkButton: function() {
					return SmartLinkActions.iPressTheOKButtonOnTheDialog.call(this);
				},
				iPressRestoreButton: function() {
					return SmartLinkActions.iPressTheResetButtonOnTheDialog.call(this);
				},
				iClickOnTheCheckboxSelectAll: function() {
					return SmartLinkActions.iClickOnTheCheckboxSelectAll.call(this);
				}
			},
			assertions: {
				iShouldSeeTheColumnInATable: function(sColumnName) {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: function(oTable) {
							var aColumns = oTable.getColumns(),
							bExists = aColumns.some(function(oColumn) {
								return new AggregationContainsPropertyEqual({
									aggregationName : "header",
									propertyName : "text",
									propertyValue : sColumnName
								}).isMatching(oColumn);
							});
							return bExists;
						},
						errorMessage: "Column with header text '" + sColumnName + "' not found"
					});
				},
				iShouldSeeAnOpenNavigationPopover: function() {
					return SmartLinkAssertions.iShouldSeeAPopover.call(this);
				},
				iShouldSeeTheMoreLinksButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtils.getTextFromResourceBundle("sap.ui.comp", "POPOVER_DEFINE_LINKS")
						}),
						success: function(aButton) {
							Opa5.assert.equal(aButton.length, 1, "The 'More Links' button found");
						},
						errorMessage: "No 'More Links' button found"
					});
				},
				iShouldSeeLinkItemOnP13nDialog: function(sItemText, iIndex, bSelected, bEnabled) {
					return waitForP13nDialog.call(this, {
						success: function(oP13nDialog) {
							this.waitFor({
								searchOpenDialogs: true,
								controlType: "sap.m.Table",
								matchers: new Ancestor(oP13nDialog, false),
								success: function(aTables) {
									Opa5.assert.equal(aTables.length, 1, "sap.m.Table found on Dialog");
									var oTable = aTables[0];
									if (bEnabled === undefined || bEnabled === null) {
										bEnabled = true;
									}
									this.waitFor({
										controlType: "sap.m.Link",
										// also search for disabled links as this is needed for the keyuser adaptation scenario
										enabled: false,
										matchers: [
											// check if link is in the table
											new Ancestor(oTable, false),
											// check for text value of the link
											new PropertyStrictEquals({
												name: "text",
												value: sItemText
											}),
											// check for enabled value of the link
											new PropertyStrictEquals({
												name: "enabled",
												value: bEnabled
											}),
											// check for index of the link in the table
											function(oLink) {
												if (iIndex === undefined || iIndex === null) {
													return true;
												}
												var aItems = oTable.getItems().filter(function(oItem){
													return oItem.getCells()[0].getItems()[0].getItems()[0] === oLink;
												});
												return oTable.getItems().indexOf(aItems[0]) === iIndex;
											},
											// check for selected value of the link
											function(oLink) {
												if (bSelected === undefined || bSelected === null) {
													return true;
												}
												var aItems = oTable.getItems().filter(function(oItem){
													return oItem.getCells()[0].getItems()[0].getItems()[0] === oLink;
												});
												return aItems[0].getSelected() === bSelected;
											}
										],
										success: function(oLink) {
											Opa5.assert.equal(oLink.length, 1, "Link with text '" + sItemText + "' found on the P13n Dialog");
										},
										errorMessage: "Link with text '" + sItemText + "' not found in the P13n dialog"
									});
								}
							});
						}
					});
				},
				iShouldSeeTheDefineLinksDialog: function() {
					return waitForP13nDialog.call(this, {});
				}
			}
		}
	});
});
