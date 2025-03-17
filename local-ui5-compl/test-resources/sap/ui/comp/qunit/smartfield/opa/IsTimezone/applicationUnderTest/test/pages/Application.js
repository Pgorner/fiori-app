sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/EnterText",
	"test-resources/sap/ui/comp/testutils/opa/valuehelpdialog/Actions"
], function(
	Opa5,
	EnterText,
	ValueHelpDialogActions
) {
	"use strict";

	Opa5.createPageObjects({
		onTheApplicationPage: {
			actions: {
				iOpenVHD: function(sId) {
					return ValueHelpDialogActions.iOpenValueHelpDialogForInput.call(this, sId);
				},
				iOpenSmartFieldSuggestions: function(sID, sText) {
					return this.waitFor({
						id: sID,
						success: function(oSmartField) {
							var oInnerControl = oSmartField.getFirstInnerControl();

							if (oInnerControl._oSuggestionPopup && !oInnerControl._oSuggestionPopup.isOpen()) {
								oInnerControl._openSuggestionPopup(true);
							}

							new EnterText({ text: sText, keepFocus: true }).executeOn(oInnerControl);
						}
					});
				}
			},
			assertions: {
				iShouldSeeSmartFieldFixedListItemWithText: function(sId, nIndex, sText) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function(oSmartField) {
							var oControl = oSmartField.getFirstInnerControl();
							Opa5.assert.equal(oControl.getItemAt(nIndex).getText(), sText, "The SmartField with the id " + sId + " contains the correct text item!");
						},
						errorMessage: "Could not find SmartField with id " + sId
					});
				},
				iCheckTableItemWithText: function(nIndex, sText) {
					this.waitFor({
						controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
						searchOpenDialogs: true,
						success: function(aValueHelpDialogs) {
							var oValueHelpDialog = aValueHelpDialogs[0];
							oValueHelpDialog.getTableAsync().then(function(oTable) {
								Opa5.assert.equal(
									oTable.getRows()[nIndex].getCells()[0].getText(),
									sText,
									"Table item contains the correct text"
								);
							});
						}
					});
				},
				iCheckPedningChanges: function(sId, sText) {
					this.waitFor({
						id: sId,
						success: function(oText) {
							Opa5.assert.strictEqual(
								oText.getText(),
								sText,
								"There should be pending changes"
							);
						}
					});
				}
			}
		}
	});
});
