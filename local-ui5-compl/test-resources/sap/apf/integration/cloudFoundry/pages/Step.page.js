sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function (Opa5, Press) {
	"use strict";

	var sViewName = "sap.apf.modeler.ui.view.requestOptions";

	Opa5.createPageObjects({
		onTheStepPage: {
			actions: {
				iPressTheValueHelpButton: function () {
					return this.waitFor({
						id: "idSource-vhi",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the ValueHelp button on the Step view"
					});
				}
			},

			assertions: {
				iShouldSeeTheValueHelpDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						success: function () {
							// we set the view busy, so we need to query the parent of the app
							Opa5.assert.ok(true, "The dialog is open");
						},
						errorMessage: "Did not find the dialog control"
					});
				}
			}
		}
	});
});
