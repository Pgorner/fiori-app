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
					return SmartFieldActions.iEnterTextInSmartField.call(this,
						sId,
						sValue,
						false
					);
				},
				iSelectSmartFieldItemByKey: function (sId, sValue) {
					return SmartFieldActions.iSelectSmartFieldItemByKey.call(this,
						sId,
						sValue
					);
				},
				iResetTheODataModel: function () {
					return this.waitFor({
						id: "resetModel",
						actions: new Press()
					});
				},
				iOpenTheMessagePopover: function () {
					return this.waitFor({
						id: "messagePopoverButton",
						actions: new Press()
					});
				},
				iNavigateBack: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						success: function (aButtons) {
							var oButton = aButtons.find(function (oButton) {
								return oButton.getIcon() === "sap-icon://nav-back";
							});

							if (oButton) {
								new Press().executeOn(oButton);
							}
						}
					});
				},
				iBindInvalidData: function () {
					return this.waitFor({
						id: "bindInvalid",
						actions: new Press()
					});
				},
				iChangeTheFormEditMode: function (sFormID, bEditable) {
					return this.waitFor({
						id: sFormID,
						success: function (oSF) {
							oSF.setEditable(bEditable);
						}
					});
				},
				iSwitchTheTIEMSTo: function (sTIEMS) {
					var oMap = {
							None: "switchToNone",
							ValueList: "switchToValueList",
							ValueListWarning: "switchToValueListWarning"
						},
						sButtonID = oMap[sTIEMS];

					return this.waitFor({
						id: sButtonID,
						actions: new Press()
					});
				}
			},
			assertions: {
				iShouldSeeSmartFieldWithIdAndValue: function (sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndValue.call(this,
						sId,
						oValue
					);
				},
				iShouldSeeSmartFieldWithRealValue: function (sId, sValue) {
					return this.waitFor({
						id: sId,
						success: function (oSF) {
							Opa5.assert.strictEqual(oSF.getFirstInnerControl().getValue(), sValue);
						}
					});
				},
				iShouldSeeSmartFieldWithState: function (sId, sState) {
					return this.waitFor({
						id: sId,
						success: function (oSF) {
							Opa5.assert.strictEqual(oSF.getValueState(), sState);
						}
					});
				},
				iShouldSeePendingChangeForField: function (sFieldName, sValue) {
					return this.waitFor({
						id: "modelDump",
						success: function (oText) {
							var oData = JSON.parse(oText.getText()),
								oRecord = oData[Object.keys(oData)[0]];

							Opa5.assert.strictEqual(oRecord[sFieldName], sValue);
						}
					});
				},
				iShouldSeeNoPendingChanges: function () {
					return this.waitFor({
						id: "modelDump",
						success: function (oText) {
							Opa5.assert.strictEqual(oText.getText(), "{}");
						}
					});
				},
				iShouldSeeMessage: function (sType, sDescription) {
					return this.waitFor({
						controlType: "sap.m.MessageListItem",
						searchOpenDialogs: true,
						success: function (aMessages) {
							var aMessage = aMessages[0];
							Opa5.assert.strictEqual(aMessage.getMessageType(), sType);
							Opa5.assert.strictEqual(aMessage.getDescription(), sDescription);
						}
					});
				},
				iShouldSeeNoMessageManagerButton: function () {
					return this.waitFor({
						id: "messagePopoverButton",
						visible: false,
						success: function (oButton) {
							Opa5.assert.notOk(oButton.getVisible());
						}
					});
				}
			}
		}
	});
});
