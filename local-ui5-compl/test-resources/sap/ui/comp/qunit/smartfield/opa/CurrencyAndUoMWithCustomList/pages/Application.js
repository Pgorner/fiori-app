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
		onTheSmartFieldTypesPage: {
			actions: {
				iEnterValueInUomRelatedField: function(sId, oValue) {
					return SmartFieldActions.iEnterValueInUomRelatedField.call(this,
						sId,
						oValue
					);
				},
				iToggleEditMode: function (sId, bEditable) {
					return this.waitFor({
						id: sId,
						success: function (oField) {
							if (oField.getEditable() === bEditable) {
								return;
							}
							oField.setEditable(bEditable);
						}
					});

				},
				iToggleUomEditMode: function(sId, bEditable) {
					return SmartFieldActions.iToggleUomEditMode.call(this, sId, bEditable);
				},
				iToggleFormEditMode: function(bEditable) {
					return this.waitFor({
						id: "idView--smartForm",
						success: function(oForm) {
							if (oForm.getEditable() === bEditable) {
								return;
							}

							this.iWaitForPromise(
								new Promise(function(resolve, reject) {
									oForm.attachEventOnce("editToggled", function() {
										resolve();
									});
								})
							);
							oForm.setEditable(bEditable);
						}
					});
				},
				iClickButton: function (sId) {
					return this.waitFor({
						id: sId,
						actions: new Press(sId)
					});
				}
			},
			assertions: {
				iShouldSeeSmartFieldWithIdAndValue: function(sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndValue.call(this,
						sId,
						oValue
					);
				},
				iShouldSeeSmartFieldWithIdAndBindingValue: function(sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndBindingValue.call(this,
						sId,
						oValue
					);
				},
				iShouldSeeSmartFieldWithValueState: function(sId, sState) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithValueState.call(this,
						sId,
						sState
					);
				},
				iShouldSeeSmartFieldFixedListWithIdAndValue: function (sId, oValue) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function (oSmartField) {
							var oControl = oSmartField.getFirstInnerControl();
							Opa5.assert.ok(oControl.isA("sap.ui.comp.smartfield.ComboBox"));
							Opa5.assert.equal(oControl.getValue(), oValue, "The SmartField with the id " + sId + " contains the correct value!");
						},
						errorMessage: "Could not find SmartField with id " + sId
					});
				},
				iShouldSeeSmartFieldWithValueStateText: function(sId, sText) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithValueStateText.call(this,
						sId,
						sText
					);
				},
				iShouldSeeSmartFieldWithIdAndInnerControlValue: function(
					sId,
					sValue
				) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndInnerControlValue.call(this,
						sId,
						sValue
					);
				},
				iShouldSeeNumberOfErrors: function (sId, nLength) {
					return this.waitFor({
						id: sId,
						success: function (oList) {
							var aItems = oList.getItems(),
								oItem = aItems[aItems.length - 2];
							Opa5.assert.strictEqual(
								oItem.getTitle(),
								"Model message errors length: " + nLength,
								"Model message errors length is correct"
							);
						}
					});
				},
				iShouldSeeOfErrorsMessage: function (sId, sMessage) {
					return this.waitFor({
						id: sId,
						success: function (oList) {
							var aItems = oList.getItems(),
								oItem = aItems[aItems.length - 1];
							Opa5.assert.strictEqual(
								oItem.getTitle(),
								"Model message errors: " + sMessage,
								"Model message errors are correct"
							);
						}
					});
				}
			}
		}
	});
});
