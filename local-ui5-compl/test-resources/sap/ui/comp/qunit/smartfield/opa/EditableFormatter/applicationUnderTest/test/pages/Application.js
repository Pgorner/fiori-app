sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Actions",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Assertions"
], function(
	Opa5,
	Press,
	SmartFieldActions,
	SmartFieldAssertions
) {
	"use strict";

	Opa5.createPageObjects({
		onTheApplicationPage: {
			actions: {
				iPressButton: function(sId) {
					return this.waitFor({
						id: sId,
						actions: new Press(),
						errorMessage: "the '" + sId + "' button not found!"
					});
				},
				iSetSmartFieldControlProperty: function(sId, sProperty, oValue) {
					return SmartFieldActions.iSetSmartFieldControlProperty.call(this, sId, sProperty, oValue);
				},
				iEnterTextInSmartField: function(sId, sText, bKeepFocus) {
					return SmartFieldActions.iEnterTextInSmartField.call(this, sId, sText, bKeepFocus);
				}
			},
			assertions: {
				iShouldSeeSmartFieldInMode: function(sId, sMode) {
					return SmartFieldAssertions.iShouldSeeSmartFieldInMode.call(this, sId, sMode);
				}
			}
		}
	});
});
