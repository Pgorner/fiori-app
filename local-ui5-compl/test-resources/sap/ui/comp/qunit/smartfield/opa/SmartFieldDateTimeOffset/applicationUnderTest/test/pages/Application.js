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
				iToggleEditMode: function(sId) {
					return SmartFieldActions.iToggleSmartFormEditMode.call(this, sId);
				},
				iEnterValue: function(sId, sValue) {
					return SmartFieldActions.iEnterTextInSmartField.call(this, sId, sValue, false);
				}
			},
			assertions: {
				iShouldSeeAValue: function(sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndValue.call(this, sId, oValue);
				},
				iShouldSeeABindingValueOfDatePickerTimeZone: function(sId, oValue) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function(oSmartField) {
							var oDatePickerBindingValue = oSmartField.getFirstInnerControl().getBinding("value").getValue();
							Opa5.assert.equal(oDatePickerBindingValue.length, 2, "The Binding of the SmartField with the id " + sId + " contains the correct length!");

							Opa5.assert.equal(oDatePickerBindingValue[1], oValue, "The Binding of the SmartField with the id " + sId + " contains the correct value!");
						},
						errorMessage: "Could not find SmartField with id " + sId
					});
				}
			}
		}
	});
});