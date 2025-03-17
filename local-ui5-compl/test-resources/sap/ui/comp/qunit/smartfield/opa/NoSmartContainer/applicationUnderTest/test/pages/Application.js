sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"sap/ui/test/actions/Press",
		"sap/ui/test/matchers/Properties"
	],
	function (
		Opa5,
		Press,
		Properties
    ) {
		"use strict";

		Opa5.createPageObjects({
			onTheApplicationPage: {
				actions: {
					iPressButtonWithText: function (sText) {
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: new Properties({text: sText}),
							actions: new Press(),
							errorMessage: "The button was not found and could not be pressed"
						});
					}
				},
				assertions: {
					iShouldSeeLabelWithId: function (sId) {
						return this.waitFor({
							controlType: "sap.ui.comp.smartfield.SmartLabel",
							matchers: function(oControl) {
								return oControl.getId().includes(sId);
							},
							success: function (aSmartLabel) {
								const oSmartLabel = aSmartLabel[0];
								Opa5.assert.strictEqual(
									oSmartLabel.getVisible(),
									true,
									"SmartLabel is visible"
								);
							}
						});
					},
					iShouldSeeClonedLabelWithText: function (sText) {
						return this.waitFor({
							controlType: "sap.ui.comp.smartfield.SmartLabel",
							matchers: function(oControl) {
								return oControl.getId().includes("clone");
							},
							success: function (aSmartLabel) {
								const oSmartLabel = aSmartLabel[0];
								Opa5.assert.strictEqual(
									oSmartLabel.getText(),
									sText,
									"SmartLabel is has correct text"
								);
							}
						});
					}
				}
			}
		});
	}
);