/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/core/date/UniversalDateUtils",
	"sap/ui/test/OpaBuilder",
	"sap/ui/test/matchers/Descendant",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Properties",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/util/InitializeMatcher",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Util"
], function(
	Library,
	Opa5,
	opaTest,
	Press,
	EnterText,
	PropertyStrictEquals,
	UniversalDateUtils,
	OpaBuilder,
	Descendant,
	Ancestor,
	Properties,
	InitializeMatcher,
	TestUtil
) {
	"use strict";

	var oCompResourceBundle = Library.getResourceBundleFor("sap.ui.comp");
	var sFilterUnderTest = "DateTime Single";
	var aChangedItemsOrder = [
		{item: "DateTime Single", selected: true},
		{item: "Key Date", selected: true},
		{item: "DateTime Multiple", selected: true}
	];
	var aDefaultItemsOrder = [
		{item: "Key Date", selected: true},
		{item: "DateTime Single", selected: true},
		{item: "DateTime Multiple", selected: true}
	];

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/AdaptFiltersRearrange/applicationUnderTest/SmartFilterBar_AdaptFilterRearrange.html"
					)
				);
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			},
			iStopMyApp: function () {
				this._myApplicationIsRunning = false;
				return this.iTeardownMyAppFrame();
			}
		}),
		actions: new Opa5({
			iOpenAdaptFiltersDialog: function(){
				this.waitFor(new OpaBuilder()
					.hasType("sap.ui.comp.smartfilterbar.SmartFilterBar")
					.has(new InitializeMatcher())
					.do(function(oFilterBar){
						oFilterBar.showAdaptFilterDialog();
					})
					.build());
			},
			iCloseAdaptFiltersDialog: function(){
				this.waitFor(new OpaBuilder()
					.hasType("sap.m.Button")
					.hasId(/adapt-filters-dialog-confirmBtn$/)
					.isDialogElement(true)
					.do(function(oButton){
						new Press().executeOn(oButton);
					})
					.build());
			},
			iPressOnButtonWithIcon: function (sIcon) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: new PropertyStrictEquals({
						name: "icon",
						value: sIcon
					}),
					actions: new Press(),
					success: function onAdaptFiltersIconButtonPressed(sIcon) {
						Opa5.assert.ok(true, 'The adapt filters ' + sIcon + ' button was pressed');
					},
					errorMessage: 'The adapt filters "Move Down" button could not be pressed'
				});
			},
			iClickOnTableItem: function (sItemText) {
				return this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Label",
					matchers: new PropertyStrictEquals({
						name: "text",
						value: sItemText
					}),
					success: function (aLabels) {
						this.waitFor({
							controlType: "sap.m.ColumnListItem",
							matchers: new Descendant(aLabels[0]),
							actions: new Press()
						});
					}
				});
			},
			iSaveVariantAs: function (sVariantNameOld, sVariantNameNew) {
				return this.waitFor({
					controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
					check: function (aVariantManagements) {
						return !!aVariantManagements.length;
					},
					actions: new Press(),
					success: function (aVariantManagements) {
						Opa5.assert.equal(aVariantManagements.length, 1, "VariantManagement found");
						this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVEAS")
							}),
							actions: new Press(),
							success: function (aButtons) {
								Opa5.assert.equal(aButtons.length, 1, "'Save As' button found");
								this.waitFor({
									controlType: "sap.m.Input",
									matchers: new PropertyStrictEquals({
										name: "value",
										value: sVariantNameOld
									}),
									actions: new EnterText({
										text: sVariantNameNew
									}),
									success: function (aInputs) {
										Opa5.assert.ok(aInputs[0].getValue() === sVariantNameNew, "Input value is set to '" + sVariantNameNew + "'");
										this.waitFor({
											controlType: "sap.m.Button",
											matchers: new PropertyStrictEquals({
												name: "text",
												value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVE")
											}),
											actions: new Press(),
											success: function (aButtons) {
												Opa5.assert.equal(aButtons.length, 1, "'OK' button found");
											}
										});
									}
								});
							},
							errorMessage: "Cannot find 'Save As' button on VariantManagement"
						});
					},
					errorMessage: "Could not find VariantManagement"
				});
			},
			iSelectDefaultVariant: function (sVariant) {
				return this.waitFor({
					controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
					actions: new Press(),
					success: function(aVM){
						this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "Manage"
							}),
							actions: new Press(),
							success: function(){
								this.waitFor({
									controlType: "sap.m.Input",
									matchers: new PropertyStrictEquals({
										name: "value",
										value: sVariant
									}),
									success: function(aInput){
										this.waitFor({
											controlType: "sap.m.ColumnListItem",
											matchers: new Descendant(aInput[0]),
											success: function(aColumnListItem){
												this.waitFor({
													controlType: "sap.m.RadioButton",
													matchers: new Ancestor(aColumnListItem[0]),
													actions: new Press(),
													success: function(aBtn){
														this.waitFor({
															searchOpenDialogs: true,
															controlType: "sap.m.Button",
															matchers: new PropertyStrictEquals({
																name: "text",
																value: "Save",
																actions: new Press()
															}),
															actions: new Press()
														});
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
			},
			iSelectVariant: function(sVariantName) {
				return this.waitFor({
					controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
					check: function (aVariantManagements) {
						return !!aVariantManagements.length;
					},
					actions: new Press(),
					success: function (aVariantManagements) {
						Opa5.assert.equal(aVariantManagements.length, 1, "VariantManagement found");
						this.waitFor({
							controlType: "sap.ui.core.Item",
							matchers: [
								new Ancestor(aVariantManagements[0]), new Properties({
									text: sVariantName
								})
							],
							actions: new Press(),
							errorMessage: "Cannot select '" + sVariantName + "' from VariantManagement"
						});
					},
					errorMessage: "Could not find VariantManagement"
				});
			}
		}),
		assertions: new Opa5({
			iShouldSeeIconWithText: function (sText) {
				return this.waitFor({
					controlType: "sap.ui.core.Icon",
					matchers: new PropertyStrictEquals({
						name: "src",
						value: sText
					}),
					errorMessage : "Did not find an icon with text " + sText,
					success: function (aButtons) {
						Opa5.assert.equal(aButtons.length, 1, "One icon found");
						Opa5.assert.equal(aButtons[0].getSrc(), sText, "The icon " + sText + " found.");
					}
				});
			},
			iCheckAdaptFiltersOrder: function(vItems){
				vItems.forEach(function (oItem, iIndex) {
					this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Label",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: oItem.item
						}),
						success: function (aLabels) {
							this.waitFor({
								controlType: "sap.m.ColumnListItem",
								matchers: new Descendant(aLabels[0]),
								success: function (aColumnListItems) {
									Opa5.assert.equal(aColumnListItems[0].getParent().getItems().indexOf(aColumnListItems[0]), iIndex, "Item is on the correct index");
									Opa5.assert.equal(aColumnListItems[0].getSelected(), oItem.selected, "The item is selected: " + oItem.selected);
									Opa5.assert.equal(aLabels[0].getText(), oItem.item, "Item does contain the correct text " + oItem.item + " for the Label");
								}
							});
						}
					});
				}.bind(this));
			},
			iCheckRearrangedFiltersOrderInLayout: function(vItems){
				vItems.forEach(function (oItem, iIndex) {
					this.waitFor({
						searchOpenDialogs: false,
						controlType: "sap.m.Label",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: oItem.item
						}),
						success: function (aLabels) {
							var aLabelDomNodes = aLabels[0].getParent().getParent().getDomRef().querySelectorAll(".sapUiCompFilterBarItem label");

							Opa5.assert.equal(aLabelDomNodes[iIndex].textContent, oItem.item, "Item does contain the correct text " + oItem.item + " for the Label");
						}
					});
				}.bind(this));
			}
		})
	});

	QUnit.module("Defaults");

	opaTest("SmartFilterBar - Adapt Filters Dialog - check move buttons available", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenAdaptFiltersDialog();
		When.iClickOnTableItem(sFilterUnderTest);

		// Assert
		Then.iShouldSeeIconWithText("sap-icon://collapse-group");
		Then.iShouldSeeIconWithText("sap-icon://navigation-up-arrow");
		Then.iShouldSeeIconWithText("sap-icon://navigation-down-arrow");
		Then.iShouldSeeIconWithText("sap-icon://expand-group");

		// Act
		When.iCloseAdaptFiltersDialog();
	});

	opaTest("SmartFilterBar - Adapt Filters Dialog - check reorder in dialog", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenAdaptFiltersDialog();
		When.iClickOnTableItem(sFilterUnderTest);

		// Assert
		Then.iShouldSeeIconWithText("sap-icon://navigation-down-arrow");

		// Act
		When.iPressOnButtonWithIcon("sap-icon://navigation-up-arrow");

		// Assert
		Then.iCheckAdaptFiltersOrder(aChangedItemsOrder);
		// Act
		When.iCloseAdaptFiltersDialog();
	});

	opaTest("SmartFilterBar - Adapt Filters Dialog - check reorder in layout", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenAdaptFiltersDialog();
		When.iClickOnTableItem(sFilterUnderTest);

		// Assert
		Then.iShouldSeeIconWithText("sap-icon://navigation-down-arrow");

		// Act
		When.iPressOnButtonWithIcon("sap-icon://navigation-up-arrow");

		// Assert
		Then.iCheckAdaptFiltersOrder(aChangedItemsOrder);

		// Act
		When.iCloseAdaptFiltersDialog();
		// Assert
		Then.iCheckRearrangedFiltersOrderInLayout(aChangedItemsOrder);
	});

	opaTest("SmartFilterBar - Adapt Filters Dialog - rearrange filters - Variant Management", function(Given, When, Then) {
		// Arrange
		var sVariantName = "AFD_rearrangement" + new Date().toISOString();
		Given.iEnsureMyAppIsRunning();

		When.iOpenAdaptFiltersDialog();
		When.iClickOnTableItem(sFilterUnderTest);
		When.iPressOnButtonWithIcon("sap-icon://navigation-up-arrow");

		// Assert
		Then.iCheckAdaptFiltersOrder(aChangedItemsOrder);

		// Act
		When.iCloseAdaptFiltersDialog();

		// Assert
		Then.iCheckRearrangedFiltersOrderInLayout(aChangedItemsOrder);

		// Act
		When.iSaveVariantAs(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), sVariantName);
		When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));

		// Assert
		Then.iCheckRearrangedFiltersOrderInLayout(aDefaultItemsOrder);

		// Act
		When.iSelectVariant(sVariantName);

		// Assert
		Then.iCheckRearrangedFiltersOrderInLayout(aChangedItemsOrder);

		// Cleanup
		When.iSelectVariant("Standard");
	});

	opaTest("SmartFilterBar - Adapt Filters Dialog - rearrange filters - Variant Management - check order in Adapt Filters Dialog", function(Given, When, Then) {
		// Arrange
		var sVariantName = "AFD_rearrangement" + new Date().toISOString();
		Given.iEnsureMyAppIsRunning();

		When.iOpenAdaptFiltersDialog();
		When.iClickOnTableItem(sFilterUnderTest);
		When.iPressOnButtonWithIcon("sap-icon://navigation-up-arrow");

		// Assert
		Then.iCheckAdaptFiltersOrder(aChangedItemsOrder);

		// Act
		When.iCloseAdaptFiltersDialog();

		// Assert
		Then.iCheckRearrangedFiltersOrderInLayout(aChangedItemsOrder);

		// Act
		When.iSaveVariantAs(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), sVariantName);
		When.iSelectVariant(oCompResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));

		// Assert
		Then.iCheckRearrangedFiltersOrderInLayout(aDefaultItemsOrder);

		// Act
		When.iSelectVariant(sVariantName);

		// Assert
		Then.iCheckRearrangedFiltersOrderInLayout(aChangedItemsOrder);

		// Act
		When.iOpenAdaptFiltersDialog();

		// Assert
		Then.iCheckAdaptFiltersOrder(aChangedItemsOrder);
	});

	opaTest("LAST-The purpose of this test is to Cleanup after all the tests", function (Given) {
		Opa5.assert.ok(true); // We need one assertion

		// Cleanup
		Given.iStopMyApp();
	});
});
