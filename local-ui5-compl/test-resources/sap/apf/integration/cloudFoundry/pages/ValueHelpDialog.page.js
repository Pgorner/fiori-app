sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Properties"
], function (Opa5, Press, EnterText, Properties) {
	"use strict";

	var sViewName = "sap.apf.cloudFoundry.ui.valuehelp.view.CatalogBrowser";

	Opa5.createPageObjects({
		onTheValueHelpDialog: {
			actions: {
				iPressTheCancelButton: function() {
					return this.waitFor({
						id: "buttonCancel",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the Cancel button on the Dialog view"
					});
				},
				iSearchDestination1: function() {
					return this.waitFor({
						id: "searchField",
						viewName: sViewName,
						actions: new EnterText({
							text: "1"
						}),
						errorMessage: "Did not find the searchField on the Dialog view"
					});
				},
				iSearchDestination2: function() {
					return this.waitFor({
						id: "searchField",
						viewName: sViewName,
						actions: new EnterText({
							text: "2"
						}),
						errorMessage: "Did not find the searchField on the Dialog view"
					});
				},
				iSearchDestination3: function() {
					return this.waitFor({
						id: "searchField",
						viewName: sViewName,
						actions: new EnterText({
							text: "3"
						}),
						errorMessage: "Did not find the searchField on the Dialog view"
					});
				},
				iSearchDestination4: function() {
					return this.waitFor({
						id: "searchField",
						viewName: sViewName,
						actions: new EnterText({
							text: "4"
						}),
						errorMessage: "Did not find the searchField on the Dialog view"
					});
				},
				iSelectTheFirstDestination: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.StandardListItem",
						actions: new Press(),
						errorMessage: "Did not find the destination on the Dialog view"
					});
				},
				iSearchAService: function() {
					return this.waitFor({
						id: "searchField",
						viewName: sViewName,
						actions: new EnterText({
							text: "my_odata"
						}),
						errorMessage: "Did not find the searchField on the Dialog view"
					});
				},
				iInputAWrongServiceUrl: function() {
					return this.waitFor({
						id: "urlInput",
						viewName: sViewName,
						actions: new EnterText({
							text: "odata/not/my/service/"
						}),
						errorMessage: "Did not find the URL input on the Dialog view"
					});
				},
				iInputACorrectServiceUrl: function() {
					return this.waitFor({
						id: "urlInput",
						viewName: sViewName,
						actions: new EnterText({
							text: "/odata/my/service/"
						}),
						errorMessage: "Did not find the URL input on the Dialog view"
					});
				},
				iPressTheSelectButton: function() {
					return this.waitFor({
						id: "buttonSelect",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the Select button on the Dialog view"
					});
				},
				iPressTheBackButton: function() {
					return this.waitFor({
						id: "buttonBack",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the Back button on the Dialog view"
					});
				},
				iPressTheOKButton: function() {
					return this.waitFor({
						id: "buttonOk",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the OK button on the Dialog view"
					});
				},
				iSelectAService: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.ColumnListItem",
						matchers: new Properties({
							id: /^.*-0$/ // we need to match an id here manually, otherwise OPA5 would press all visible Items at once
						}),
						actions: new Press(),
						errorMessage: "Did not find the destination on the Dialog view"
					});
				}
			},
			assertions: {
				iShouldSeeFourDestinations: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.StandardListItem",
						success: function (oElements) {
							Opa5.assert.strictEqual(oElements.length, 4, "4 Destinations are visible");
						},
						errorMessage: "Did not find destinations"
					});
				},
				iShouldSeeOneDestination: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.StandardListItem",
						success: function (aElements) {
							Opa5.assert.strictEqual(aElements.length, 1, "1 Destination is visible");
						},
						errorMessage: "Did not find destinations"
					});
				},
				iShouldSeeServices: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.ColumnListItem",
						success: function () {
							Opa5.assert.ok(true, "Services are visible");
						},
						errorMessage: "Did not find services"
					});
				},
				iShouldSeeNoServices: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Table",
						success: function (aTables) {
							Opa5.assert.strictEqual(aTables[0].getItems().length, 0, "1 Service would be visible (if the mock server would support searching)");
						},
						errorMessage: "Did not find services"
					});
				},
				iShouldSeeTheUrlInput: function() {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.ComboBox",
						success: function() {
							Opa5.assert.ok(true, "URL Input is visible");
						},
						errorMessage: "Did not find the URL Input"
					});
				},
				iShouldSeeTheOverviewPage: function() {
					return this.waitFor({
						id: "destinationOverview",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "Overview is visible");
						},
						errorMessage: "Did not find overview page"
					});
				},
				iShouldSeeTheReducedOverviewPage: function() {
					return this.waitFor({
						id: "reducedDestinationOverview",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "Reduced Overview is visible");
						},
						errorMessage: "Did not find reduced overview page"
					});
				},
				iShouldSeeTheServiceOnlyOverviewPage: function() {
					return this.waitFor({
						id: "serviceOnlyOverview",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "Service-Only Overview is visible");
						},
						errorMessage: "Did not find service-only overview page"
					});
				},
				iShouldSeeTheBackButton: function() {
					return this.waitFor({
						id: "buttonBack",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "Back button visible");
						},
						errorMessage: "Did not find the Back button on the Dialog view"
					});
				},
				iShouldSeeTheSelectButton: function() {
					return this.waitFor({
						id: "buttonSelect",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "Select button visible");
						},
						errorMessage: "Did not find the Select button on the Dialog view"
					});
				},
				iShouldSeeTheOKButton: function() {
					return this.waitFor({
						id: "buttonOk",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "OK button visible");
						},
						errorMessage: "Did not find the OK button on the Dialog view"
					});
				},
				iShouldNotSeeTheBackButton: function() {
					return this.waitFor({
						id: "catalogBrowser",
						viewName: sViewName,
						success: function(oDialog) {
							var aButtons = oDialog.getButtons().filter(function(oButton) {
								return oButton.getId() === "buttonBack";
							});
							Opa5.assert.strictEqual(aButtons.length, 0, "Back button not visible");
						}
					});
				},
				iShouldNotSeeTheSelectButton: function() {
					return this.waitFor({
						id: "catalogBrowser",
						viewName: sViewName,
						success: function(oDialog) {
							var aButtons = oDialog.getButtons().filter(function(oButton) {
								return oButton.getId() === "buttonSelect";
							});
							Opa5.assert.strictEqual(aButtons.length, 0, "Select button not visible");
						}
					});
				},
				iShouldNotSeeTheOKButton: function() {
					return this.waitFor({
						id: "buttonOk",
						viewName: sViewName,
						visible: false,
						success: function(oButton) {
							Opa5.assert.ok(!oButton.getVisible(), "OK button not visible");
						}
					});
				}
			}
		}
	});
});
