/* global QUnit */
sap.ui.define(
	[
		"sap/ui/core/Lib",
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"sap/ui/test/opaQunit",
		"test-resources/sap/ui/comp/testutils/opa/TestUtils",
		"test-resources/sap/ui/comp/testutils/opa/TestLibrary",
		"sap/ui/test/actions/Press"
	],
	function(
		Library,
		Opa5,
		PropertyStrictEquals,
		opaTest,
		TestUtils,
		TestLibrary,
		Press
	) {
		"use strict";
		var APPLICATION_UNDER_TEST_URL = "test-resources/sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTestSmallSize/ValueHelpDialog.html";
		var oRb = Library.getResourceBundleFor("sap.ui.comp");

		Opa5.extendConfig({
			autoWait: true,
			testLibs: {
				compTestLibrary: {
					namespace: "test.sap.ui.comp.valuehelpdialog",
					viewName: "ValueHelpDialog",
					appUrl: APPLICATION_UNDER_TEST_URL
				}
			},
			frameWidth: '320',
			frameHeight: '700'
		});

		Opa5.createPageObjects({
			onTheValueHelpDialogPage: {
				actions: {
					iPressButtonWithIcon: function(sIconName) {
						return this.waitFor({
							controlType: "sap.m.Button",
							searchOpenDialogs: true,
							matchers: new PropertyStrictEquals({
								name: "icon",
								value: sIconName
							}),
							success: function(aButtons) {
								new Press().executeOn(aButtons[0]);
							}
						});
					}
				},
				assertions: {
					iShouldSeeButtonWithIcon: function (sIcon) {
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "icon",
								value: sIcon
							}),
							success: function (aButtons) {
								Opa5.assert.equal(aButtons.length, 1, "One button found");
								Opa5.assert.equal(aButtons[0].getIcon(), sIcon, "The button " + sIcon + " found.");
							}
						});
					},
					iShouldSeeButtonWithText: function (sText) {
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: sText
							}),
							success: function (aButtons) {
								Opa5.assert.equal(aButtons.length, 1, "One button found");
								Opa5.assert.equal(aButtons[0].getText(), sText, "The button " + sText + " found.");
							}
						});
					},
					iShouldSeeSpacers: function (iNumber) {
						return this.waitFor({
							controlType: "sap.m.ToolbarSpacer",
							success: function (aButtons) {
								Opa5.assert.equal(aButtons.length, iNumber, iNumber + " spacers are found");
							}
						});
					},
					iShouldSeeSpacerWithWidth: function (iIndex, sWidth) {
						return this.waitFor({
							controlType: "sap.m.ToolbarSpacer",
							success: function (aButtons) {
								Opa5.assert.equal(aButtons[iIndex].getWidth(), sWidth, "Spacer with index " + iIndex + " has correct width: " + sWidth);
							}
						});
					},

					iShouldSeeToolbars: function (iNumber) {
						return this.waitFor({
							controlType: "sap.m.OverflowToolbar",
							success: function (aToolbars) {
								Opa5.assert.equal(aToolbars.length, iNumber, iNumber + " toolbars found");
							}
						});
					},

					iShouldSeeToolbarsWithPadding: function (sProperty, aPaddings) {
						return this.waitFor({
							controlType: "sap.m.OverflowToolbar",
							success: function (aToolbars) {
								if (aToolbars?.length > 0) {
									aToolbars.forEach(function(oToolBar, iIndex){
										var oDomRef = oToolBar.$()[0],
											oStyle = getComputedStyle(oDomRef);

										var sPropertyValue = (sProperty === "paddingRight") ? oStyle.paddingRight : oStyle.paddingLeft;

										Opa5.assert.equal(sPropertyValue, aPaddings[iIndex], sProperty + " is " + aPaddings[iIndex] + " and it is correct");
									});
								}
							}
						});
					}
				}
			}
		});


		var sInputId = "valuehelpdialog---mainView--smartFilterBar-filterItemControlA_-Text";

		QUnit.module("ValueHelpDialog in small size");

		//When I open the ValueHelpDialog, I should see Go button and Overlow button
		opaTest("I open the ValueHelpDialog and check visible buttons", function(Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sInputId);

			Then.onTheValueHelpDialogPage.iShouldSeeButtonWithText(oRb.getText("FILTER_BAR_GO"));
			Then.onTheValueHelpDialogPage.iShouldSeeButtonWithIcon(oRb.getText("sap-icon://overflow"));
			// Then.onTheValueHelpDialogPage.iShouldSeeSpacers(3);
			Then.onTheValueHelpDialogPage.iShouldSeeSpacerWithWidth(0, "0.5rem");

			When.onTheValueHelpDialogPage.iPressButtonWithIcon("sap-icon://overflow");
			Then.onTheValueHelpDialogPage.iShouldSeeButtonWithText(oRb.getText("FILTER_BAR_VH_SHOW_FILTERS"));

			// cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		//When I open the ValueHelpDialog, I should see toolbar with no padding
		opaTest("I open the ValueHelpDialog and check toolbar paddings", function(Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sInputId);

			Then.onTheValueHelpDialogPage.iShouldSeeToolbars(3);

			// Search toolbar has no left/right padding
			// Table toolbar has no left padding because it is overwritten in our style
			// Footer toolbar has left/right padding
			Then.onTheValueHelpDialogPage.iShouldSeeToolbarsWithPadding("paddingLeft", ["0px", "0px", "16px"]);
			Then.onTheValueHelpDialogPage.iShouldSeeToolbarsWithPadding("paddingRight", ["0px", "8px", "16px"]);

			// cleanup
			Given.onTheCompTestLibrary.iStopMyApp();
		});
	}
);
