sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/AggregationFilled",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Actions",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Assertions",
	"test-resources/sap/ui/comp/testutils/opa/valuehelpdialog/Actions"
], function (
	Opa5,
	Press,
	EnterText,
	AggregationFilled,
	SmartFieldActions,
	SmartFieldAssertions,
	ValueHelpDialogActions
) {
	"use strict";

	Opa5.createPageObjects({
		onTheApplicationPage: {
			actions: {
				iClearTheLog: function () {
					return this.waitFor({
						id: "clearLog",
						actions: new Press()
					});
				},
				iSubmitChanges: function () {
					return this.waitFor({
						id: "submitChanges",
						actions: new Press()
					});
				},
				iSwitchToEdit: function () {
					return this.waitFor({
						id: "switchToEdit",
						actions: new Press()
					});
				},
				iSwitchToEdit2: function () {
					return this.waitFor({
						id: "switchToEdit2",
						actions: new Press()
					});
				},
				iSetShowValueHelp: function () {
					return this.waitFor({
						id: "setShowValueHelp",
						actions: new Press()
					});
				},
				iSwitchFieldNullToEdit: function () {
					return this.waitFor({
						id: "FieldNull",
						success: function (oForm) {
							oForm.setEditable(true);
						}
					});
				},
				iSwitchFieldNullToDisplay: function () {
					return this.waitFor({
						id: "FieldNull",
						success: function (oForm) {
							oForm.setEditable(false);
						}
					});
				},
				iChangeTheValueTo: function (sId, sValue) {
					return SmartFieldActions.iEnterTextInSmartField.call(this,
						sId,
						sValue,
						false
					);
				},
				iOpenSmartFieldSuggestions: function (sID, sText) {
					return this.waitFor({
						id: sID,
						actions: new EnterText({ text: sText, keepFocus: true })
					});
				},
				iOpenSuggestionsForSmartField: function(sId){
					return this.waitFor({
						id: sId,
						success: function (oSmartField) {
							if (!oSmartField.getFirstInnerControl()._oSuggestionPopup.isOpen()) {
								oSmartField.getFirstInnerControl()._openSuggestionPopup(true);
							}
						}
					});
				},
				iSelectAnItemFromTheSuggest: function (iIndex) {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						searchOpenDialogs: true,
						success: function (aColumns) {
							new Press().executeOn(aColumns[iIndex]);
						}
					});
				},
				iSelectAnItemFromSuggestions: function (sID, iIndex) {
					return this.waitFor({
						id: sID,
						success: function () {
							this.iOpenSmartFieldSuggestions(sID, "1", true);
							this.iOpenSuggestionsForSmartField(sID);
							this.iSelectAnItemFromTheSuggest(iIndex);
						}
					});
				},
				iSelectAnItemFromValueHelp: function (sID, iIndex) {
					ValueHelpDialogActions.iOpenValueHelpDialogForInput.call(this, sID);
					return this.waitFor({
						id: sID + "-valueHelpDialog-table-ui5table",
						matchers: new AggregationFilled({
							name: "rows"
						}),
						success: function (oTable) {
							var oTableSelectionInstance = (oTable._getSelectionPlugin && oTable._getSelectionPlugin().isA("sap.ui.table.plugins.MultiSelectionPlugin") && oTable.data("isInternal")) ? oTable._getSelectionPlugin() : oTable,
							oRows = oTable.getRows();

							if (oRows && oTableSelectionInstance.getSelectedIndices().indexOf(iIndex) === -1){
								new Press().executeOn(oRows[iIndex].getCells()[0]);
							}
						}
					});
				},
				iResetTheODataModel: function () {
					return this.waitFor({
						id: "resetModel",
						actions: new Press()
					});
				},
				iPressTheFunctionImportBindButton: function () {
					return this.waitFor({
						id: "functionImportBind",
						actions: new Press()
					});
				},
				iPressTheFunctionImportValueHelpBindButton: function (sId) {
					return this.waitFor({
						id: sId,
						actions: new Press()
					});
				}
			},
			assertions: {
				iShouldSeeSmartFieldWithIdAndValue: function (sId, sValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndValue.call(this, sId, sValue);
				},
				iShouldSeeEmptySmartField: function (sId) {
					return this.waitFor({
						id: sId,
						success: function (oControl) {
							Opa5.assert.ok(!!oControl.getDomRef().querySelector(".sapMEmptyIndicator"),
								"SmartField has rendered empty indicator"
							);
						}
					});
				},
				iShouldSeeRenderedSmartField: function (sId) {
					return this.waitFor({
						id: sId,
						success: function (oControl) {
							Opa5.assert.ok(oControl.getFirstInnerControl().getDomRef(),
								"SmartField has rendered internal controls"
							);
						}
					});
				},
				iShouldSeeSmartFieldInMode: function (sId, sMode) {
					return this.waitFor({
						id: sId,
						success: function (oControl) {
							Opa5.assert.strictEqual(oControl.getMode(), sMode,
								"SmartField rendered in correct mode"
							);
						}
					});
				},
				iShouldSeeSmartFieldInFocus: function (sId) {
					return this.waitFor({
						id: sId,
						success: function (oControl) {
							var oFocused = Opa5.getWindow().document.activeElement;
							Opa5.assert.strictEqual(oControl.getFocusDomRef(), oFocused,
								"Control is focused"
							);
						}
					});
				},
				iShouldSeePendingChangeForField: function (sEntitySet, sFieldName, sValue) {
					return this.waitFor({
						id: "modelDump",
						success: function (oText) {
							var oData = JSON.parse(oText.getText()),
								sKey = Object.keys(oData).find(function (sKey) {
									return sKey.startsWith(sEntitySet);
								}),
								oRecord = oData[sKey];

							Opa5.assert.strictEqual(oRecord[sFieldName], sValue);
						}
					});
				},
				iShouldSeeRequestForField: function (sRequestType, sFieldName, sValue) {
					return this.waitFor({
						controlType: "sap.m.CustomListItem",
						success: function (aControls) {
							var oControl = aControls.find(function (oControl) {
												return oControl.data("requestType") === sRequestType &&
														oControl.data("body").hasOwnProperty(sFieldName);
											});

							Opa5.assert.strictEqual(oControl.data("body")[sFieldName], sValue);
						}
					});
				},
				iShouldSeeListenersCountForField: function (sId, sListener, iCount) {
					return this.waitFor({
						id: sId,
						success: function (oControl) {
							Opa5.assert.strictEqual(oControl.getFirstInnerControl().mEventRegistry[sListener].length,
							iCount
							);
						}
					});
				},
				iShouldSeeValueHelpFilterWithLabel: function (sID, sLabel) {
					ValueHelpDialogActions.iOpenValueHelpDialogForInput.call(this, sID);
					this.waitFor({
						controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
						searchOpenDialogs: true,
						success: function (aValueHelpDialogs) {
							var oValueHelpDialog = aValueHelpDialogs[0];
							var oFilterBar = oValueHelpDialog.getFilterBar();
							var oControl = oFilterBar._getFilterControlByLabel(sLabel);

							Opa5.assert.ok(
								!!oControl,
								"FilterBar should contain filter with label " + sLabel
							);
							oValueHelpDialog.close();
						},
						errorMessage: "Cannot find ValueHelpDialog",
						timeout: 10
					});
				},
				iShouldSeeSmartMandatory: function (sId, bMandatory) {
					return this.waitFor({
						id: sId,
						success: function (oControl) {
							if (bMandatory || bMandatory === undefined) {
								bMandatory = true;
							} else {
								bMandatory = false;
							}
							Opa5.assert.strictEqual(oControl.getMandatory(),bMandatory,
								"Control is mandatory"
							);
						}
					});
				},
				iShouldSeeTheFormatedText: function (sId, sText) {
					return this.waitFor({
						id: sId,
						success: function (oControl) {
							Opa5.assert.strictEqual(oControl.getHtmlText(), sText,
								"Control html text is correct."
							);
						}
					});
				}
			}
		}
	});
});
