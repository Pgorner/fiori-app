sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Actions",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Assertions"
], function (
	Opa5,
	Press,
	SmartFieldActions,
	SmartFieldAssertions
) {
	"use strict";

	Opa5.createPageObjects({
		onTheApplicationPage: {
			actions: {
				iChangeTheValueTo: function (sId, sValue) {
					return SmartFieldActions.iEnterTextInSmartField.call(this, sId, sValue, false);
				},
				iResetTheModel: function () {
					return this.waitFor({
						id: "ResetModel",
						controlType: "sap.m.Button",
						actions: new Press()
					});
				},
				iExpandPersisted: function () {
					return this.waitFor({
						id: "ExpandPersisted",
						controlType: "sap.m.Button",
						actions: new Press()
					});
				},
				iExpandCreated: function () {
					return this.waitFor({
						id: "ExpandCreated",
						controlType: "sap.m.Button",
						actions: new Press()
					});
				}
			},
			assertions: {
				iShouldSeeSmartFieldWithIdAndValue: function (sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndValue.call(this, sId, oValue);
				},
				iShouldSeeSmartFieldInMode: function (sId, sMode) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function (oSmartField) {
							Opa5.assert.equal(oSmartField.getMode(), sMode,
								"The SmartField with the id " + sId + " is in " + sMode + " mode!");
						},
						errorMessage: "Could not find SmartField with id " + sId
					});
				}
			}
		}
	});
});
