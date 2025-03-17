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
				iToggleTableEditMode: function (bEditable) {
					return this.waitFor({
						id: "idView--smartTable",
						success: function (oTable) {
							if (oTable.getEditable() === bEditable) {
								return;
							}
							this.waitFor({
								id: "idView--smartTable-btnEditToggle",
								actions: new Press()
							});
						}
					});
				},
				iOpenVHD: function (sId) {
					return this.waitFor({
						id: sId + "-input-vhi",
						success: function(oVHD) {
							new Press().executeOn(oVHD);
						}
					});
				}
			},
			assertions: {
				iShouldSeeSmartFieldWithIdAndValue: function (sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndValue.call(this, sId, oValue);
				},
				iShouldSeeChangeEventWithText: function (sText) {
					return this.waitFor({
						id: "idView--text",
						controlType: "sap.m.Text",
						success: function (oText) {
							Opa5.assert.equal(oText.getText(), sText, "Change event text is correct");
						}
					});
				},
				iShouldSeeAllFilters: function (bFlag) {
					return this.waitFor({
						controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
						success: function(aDialogs) {
							var oFilterBar = aDialogs[0]._oFilterBar;
							Opa5.assert.equal(oFilterBar.getShowAllFilters(), bFlag);
						}
					});
				},
				iShouldSeeFilterBarExpanded: function (bFlag) {
					return this.waitFor({
						controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
						success: function(aDialogs) {
							var oFilterBar = aDialogs[0]._oFilterBar;
							Opa5.assert.equal(oFilterBar.getFilterBarExpanded(), bFlag);
						}
					});
				}
			}
		}
	});
});
