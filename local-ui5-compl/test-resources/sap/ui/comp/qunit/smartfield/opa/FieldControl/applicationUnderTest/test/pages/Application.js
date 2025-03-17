sap.ui.define([
	"sap/ui/test/Opa5",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Actions",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Assertions"
], function(
	Opa5,
	SmartFieldActions,
	SmartFieldAssertions
) {
	"use strict";

	Opa5.createPageObjects({
		onTheApplicationPage: {
			actions: {
				iChangeTheValueTo: function(sIdSmartField, sValue) {
					return SmartFieldActions.iEnterTextInSmartField.call(this, sIdSmartField, sValue, false);
				}
			},
			assertions: {
				iShouldSeeSmartFieldWithRequiredState: function(sId, bRequired) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function(oSmartField) {
							Opa5.assert.strictEqual(
								oSmartField.getRequired(),
								bRequired,
								"SmartField should has it's property set to mandatory " + bRequired
							);
						}
					});
				},
				iShouldSeeSmartFieldWithIdAndBindingValue: function(sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndBindingValue.call(this,
						sId,
						oValue
					);
				}
			}
		}
	});
});