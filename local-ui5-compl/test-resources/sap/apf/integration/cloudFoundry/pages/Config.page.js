sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function (Opa5, Press) {
	"use strict";

	var sViewName = "sap.apf.modeler.ui.view.configurationList";

	Opa5.createPageObjects({
		onTheConfigPage: {
			actions: {
				iPressTheShareButton: function() {
					return this.waitFor({
						id: "idPublishbutton",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "did not find the share button"
					});
				}
			},
			assertions: {
				iShouldSeeTheShareDialog: function() {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						success: function() {
							Opa5.assert.ok(true, "dialog is open");
						},
						errorMessage: "did not find the dialog"
					});
				}
			}
		}
	});

});
