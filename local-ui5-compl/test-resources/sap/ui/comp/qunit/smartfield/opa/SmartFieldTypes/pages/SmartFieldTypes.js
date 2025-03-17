sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/base/util/deepEqual",
	"test-resources/sap/ui/comp/testutils/opa/TestUtils",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/base/strings/capitalize",
	"test-resources/sap/ui/comp/testutils/opa/valuehelpdialog/Actions",
	"test-resources/sap/ui/comp/testutils/opa/valuehelpdialog/Assertions",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Actions",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Assertions"
], function(
	Opa5,
	Press,
	EnterText,
	deepEqual,
	TestUtils,
	PropertyStrictEquals,
	capitalize,
	ValueHelpDialogActions,
	ValueHelpDialogAssertions,
	SmartFieldActions,
	SmartFieldAssertions
) {
	"use strict";

	function isEqual(oA, oB) {
		var i,
			sKey,
			bIsMatching = true;

		for (sKey in oB) {
			if (Array.isArray(oA[sKey]) && Array.isArray(oB[sKey])) {
				for (i = 0; i < oB[sKey].length; i++) {
					bIsMatching = isEqual(oA[sKey][i], oB[sKey][i]);
					if (!bIsMatching) {
						break;
					}
				}
			} else if (typeof oA[sKey] === "object" && typeof oB[sKey] === "object") {
				bIsMatching = isEqual(oA[sKey], oB[sKey]);
				if (!bIsMatching) {
					break;
				}
			} else if (oA.hasOwnProperty(sKey) && oB.hasOwnProperty(sKey) && oA[sKey] !== oB[sKey]) {
				bIsMatching = false;
				break;
			}
		}

		return bIsMatching;
	}

	var fnMatchData = function(sProperty, vValue) {
		return function(oCodeEditor) {
			var sValue = oCodeEditor.getValue();
			var oDataValues = sValue ? JSON.parse(sValue) : {};
			var bIsMatching = true;

			if (
				!oDataValues.hasOwnProperty(sProperty) ||
				!deepEqual(vValue, oDataValues[sProperty])
			) {
				bIsMatching = false;
			}

			return bIsMatching;
		};
	};

	Opa5.createPageObjects({
		onTheSmartFieldTypesPage: {
			actions: {
				iPressSelectProduct: function(sTitle) {
					return this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: new PropertyStrictEquals({
							name: "title",
							value: sTitle
						}),
						actions: new Press()
					});
				},
				iExpandVHDFilters: function() {
					return TestUtils.isPhone()
						? ValueHelpDialogActions.iOpenAdvancedSearch.call(this)
						: ValueHelpDialogActions.iPressShowFiltersButton.call(this);
				},
				// TODO: NOT USED
				iSelectsPopoverItemByIndex: function(sId, iIndex) {
					return SmartFieldActions.iSelectsPopoverItemByIndex.call(this, sId, iIndex);
				},
				iPressTheVHDFilterGoButton: function() {
					return ValueHelpDialogActions.iPressGoButton.call(this);
				},
				iSelectRowInVHDTable: function(iIndex) {
					return ValueHelpDialogActions.iSelectItemByIndex.call(this, iIndex);
				},
				// TODO: NOT USED
				iEnterTextInSmartField: function(sId, sText, bKeepFocus, bClearTextFirst, bPressEnterKey) {
					return SmartFieldActions.iEnterTextInSmartField.call(
						this,
						sId,
						sText,
						bKeepFocus,
						bClearTextFirst,
						bPressEnterKey
					);
				},
				iEnterTextInControl: function(sId, sText, bKeepFocus) {
					return this.waitFor({
						id: sId,
						actions: new EnterText({
							text: sText,
							keepFocus: !!bKeepFocus
						})
					});
				},
				iEnterValueInSmartField: function(sId, sValue) {
					this.waitFor({
						id: sId,
						success: function(oSmartField) {
							oSmartField.setValue(sValue);
						}
					});
				},
				// TODO: NOT USED
				iEnterValueInUomRelatedField: function(sId, oValue) {
					return SmartFieldActions.iEnterValueInUomRelatedField.call(this,
						sId,
						oValue
					);
				},
				// TODO: NOT USED
				iSetSmartFieldInnerControlProperties: function(sId, aProperties) {
					return SmartFieldActions.iSetSmartFieldInnerControlProperties.call(this,
						sId,
						aProperties
					);
				},
				// TODO: NOT USED
				iSelectSmartFieldFirstDropdownItemForSelect: function(sId) {
					return SmartFieldActions.iSelectSmartFieldFirstDropdownItemForSelect.call(this, sId);
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
				},
				// TODO: NOT USED
				iCheckSmartFieldItem: function(sId) {
					return SmartFieldActions.iCheckSmartFieldItem.call(this, sId);
				},
				iPressButton: function(sId) {
					return this.waitFor({
						id: sId,
						actions: new Press()
					});
				},
				iToggleFormEditMode: function(sId, bEditable) {
					return this.waitFor({
						id: sId,
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
				iChangeFirstItemKeyInInnerControl: function(sId, sText, bKeepFocus) {
					return this.waitFor({
						id: sId,
						success: function(oControl) {
							if (!oControl.getEditable() || !oControl.getFirstInnerControl().isA("sap.m.ComboBox")) {
								return;
							}
							oControl.getFirstInnerControl().getFirstItem().setKey(sText);
						}
					});
				},
				iUpdateTheValueFromDataModel: function(sId, mValue) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						matchers: function(oSmartField) {
							var oValueBinding = oSmartField.getBinding("value"),
								oBindingContext = oValueBinding && oValueBinding.getContext();

							return oBindingContext !== undefined;
						},
						success: function(oSmartField) {
							var oValueBinding = oSmartField.getBinding("value"),
								sValueBindingPath = oValueBinding && oValueBinding.getPath(),
								oBindingContext = oValueBinding && oValueBinding.getContext(),
								oDataModel = oBindingContext && oBindingContext.getModel();

							return oDataModel && oDataModel.setProperty(sValueBindingPath, mValue, oBindingContext);
						}
					});
				},
				iUpdateTheInParamFromDataModel: function(sId, sInParam, mValue) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						matchers: function(oSmartField) {
							var oValueBinding = oSmartField.getBinding("value"),
								oBindingContext = oValueBinding && oValueBinding.getContext();

							return oBindingContext !== undefined;
						},
						success: function(oSmartField) {
							var oValueBinding = oSmartField.getBinding("value"),
								oBindingContext = oValueBinding && oValueBinding.getContext(),
								oDataModel = oBindingContext && oBindingContext.getModel();

							return oDataModel && oDataModel.setProperty(sInParam, mValue, oBindingContext);
						}
					});
				},
				iClearRequestsLog: function(sIdRequestsLog) {
					return this.waitFor({
						id: sIdRequestsLog,
						success: function(oList) {
							oList.removeAllItems();
						}
					});
				},
				iClearEventsLog: function(sIdEventsLog) {
					return this.waitFor({
						id: sIdEventsLog,
						success: function(oList) {
							oList.removeAllItems();
						}
					});
				},
				iCheckSmartFieldForErrors: function(sID) {
					return this.waitFor({
						id: sID,
						success: function(oSmartField) {
							return oSmartField.checkValuesValidity({ handleSuccess: true }).catch(function(oError) { });
						}
					});
				}
			},
			assertions: {
				iShouldSeeValueHelpDialogWithFiltersAndRows: function(
					nFiltersCount,
					nRowsCount
				) {
					ValueHelpDialogAssertions.iCheckFilterBarDisplaysNFilters.call(this, nFiltersCount);
					ValueHelpDialogAssertions.iCheckItemsCountEqualTo.call(this, nRowsCount);
				},
				iShouldSeeSmartFieldWithIdAndValue: function(sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndValue.call(this,
						sId,
						oValue
					);
				},
				iShouldSeeSmartFieldWithIdAndBaseControlValue: function(sId, sValue) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						matchers: function(oSmartField) {
							return oSmartField.getFirstInnerControl() !== null;
						},
						success: function(oSmartField) {
							var sBaseControlValue,
								oInnerControl = oSmartField.getFirstInnerControl();

							if (oInnerControl.isA("sap.m.InputBase")) {
								sBaseControlValue = oInnerControl.getValue();
							} else if (oInnerControl.isA("sap.m.Text")) {
								sBaseControlValue = oInnerControl.getText();
							}

							Opa5.assert.strictEqual(sBaseControlValue, sValue, "The base control with Id: " + oInnerControl.getId() + "has right value: " + sBaseControlValue);
						},
						errorMessage:
							"SmartField with Id " + sId + " was not found!"
					});
				},
				iShouldSeeSmartFieldWithIdAndDateTimeValue: function(sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndDateTimeValue.call(this,
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
				iShouldSeeSmartFieldWithValueStateError: function(sId, sState, sError) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithValueStateError.call(this,
						sId,
						sState,
						sError
					);
				},
				iShouldSeeSmartFieldWithValueStateText: function(sId, sText) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithValueStateText.call(this,
						sId,
						sText
					);
				},
				iShouldSeeSmartFiledPopupFiltered: function(sId, nItemsCount) {
					return SmartFieldAssertions.iShouldSeeSmartFiledPopupFiltered.call(this,
						sId,
						nItemsCount
					);
				},
				iShouldSeeSmartFiledSelectPopupFiltered: function(sId, nItemsCount) {
					return SmartFieldAssertions.iShouldSeeSmartFiledSelectPopupFiltered.call(this,
						sId,
						nItemsCount
					);
				},
				iShouldSeeSmartFieldWithEmptyIndicator: function(sId) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithEmptyIndicator.call(this,
						sId
					);
				},
				iShouldNotSeeSmartFieldWithEmptyIndicator: function(sId) {
					return SmartFieldAssertions.iShouldNotSeeSmartFieldWithEmptyIndicator.call(this,
						sId
					);
				},
				iShouldSeeUomFieldWithShrinkFactorOf: function(sId, iShrinkFactor) {
					return SmartFieldAssertions.iShouldSeeUomFieldWithShrinkFactorOf.call(this,
						sId,
						iShrinkFactor
					);
				},
				iShouldSeeSmartFieldWithDomAttribute: function(
					sId,
					sDomAttribute,
					sValue
				) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithDomAttribute.call(this,
						sId,
						sDomAttribute,
						sValue
					);
				},
				iShouldSeeSmartFieldWithoutDomAttribute: function(
					sId,
					sDomAttribute
				) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithoutDomAttribute.call(this,
						sId,
						sDomAttribute
					);
				},
				iCheckFieldContainsToken: function(sId, sTokenText) {
					return SmartFieldAssertions.iCheckFieldContainsTokenAtPosition.call(this,
						sId,
						sTokenText,
						0
					);
				},
				iCheckFieldContainsTokenAtPosition: function(
					sId,
					sTokenText,
					nIndex
				) {
					return SmartFieldAssertions.iCheckFieldContainsTokenAtPosition.call(this,
						sId,
						sTokenText,
						nIndex
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
				iShouldSeeSmartFieldWithIdAndInnerControlSelectedItemText: function(
					sId,
					sValue
				) {
					return this.waitFor({
						id: sId,
						success: function(oControl) {
							var oItem,
								oInnerControl = oControl.getFirstInnerControl();

							if (oInnerControl.isA("sap.m.ComboBox")) {
								oItem = oInnerControl.getSelectedItem();
								Opa5.assert.strictEqual(
									oItem.getText(),
									sValue,
									"The selected item has value " + oItem.getText() + "!"
								);
							}
						}
					});
				},
				iShouldSeeComboBoxWithSelectedItem: function(sId, sValue) {
					return this.waitFor({
						id: sId,
						success: function(oControl) {
							var oItem,
								oInnerControl = oControl.getFirstInnerControl();

							if (oInnerControl.isA("sap.m.ComboBox")) {
								oItem = oInnerControl.getSelectedItem();
								Opa5.assert.strictEqual(
									oItem,
									null,
									"The item has been selected!"
								);
							}
						}
					});
				},
				iShouldSeeGroupElementWithCSSDisplay: function(
					sGroupId,
					sFieldId,
					sDisplay
				) {
					return SmartFieldAssertions.iShouldSeeGroupElementWithCSSDisplay.call(this,
						sGroupId,
						sFieldId,
						sDisplay
					);
				},
				iShouldSeeData: function(sEditorId, sProperty, oValue) {
					return this.waitFor({
						controlType: "sap.ui.codeeditor.CodeEditor",
						id: sEditorId,
						matchers: fnMatchData(sProperty, oValue),
						success: function(oCodeEditor) {
							Opa5.assert.ok(
								oCodeEditor.getValue(),
								"Data property " + sProperty + " has value " + oValue + "!"
							); // tested in matcher
						},
						errorMessage:
							"Data property " + sProperty + " has not value " + oValue + "!"
					});
				},
				iShouldSeeSmartFieldPopupItemWithTitle: function(sId, nIndex, sTitle) {
					return SmartFieldAssertions.iShouldSeeSmartFieldPopupItemWithTitle.call(this,
						sId,
						nIndex,
						sTitle
					);
				},
				iShouldSeeSmartFieldSuggestionItemWithText: function(sId, nIndex, sText) {
					return SmartFieldAssertions.iShouldSeeSmartFieldSuggestionItemWithText.call(this,
						sId,
						nIndex,
						sText
					);
				},
				iCheckSmartFieldProperyHasValue: function(sId, sProperty, oValue) {
					return SmartFieldAssertions.iCheckSmartFieldProperyHasValue.call(this,
						sId,
						sProperty,
						oValue
					);
				},
				iShouldSeeSmartFieldInMode: function(sId, sMode) {
					return SmartFieldAssertions.iShouldSeeSmartFieldInMode.call(this,sId, sMode);
				},
				iShouldSeeSmartFieldWithTextAlign: function(sId, sValue) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfield.SmartField",
						id: sId,
						success: function(oSmartField) {
							Opa5.assert.strictEqual(oSmartField.getFirstInnerControl().getTextAlign(), sValue, "Field is properly aligned");
						},
						errorMessage:
							"Field " + sId + " is not aligned properly!"
					});
				},
				iShouldSeeSmartFieldWithIdAndPlaceholder: function(sId, bHasPlaceHolderSet) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfield.SmartField",
						id: sId,
						success: function(oSmartField) {
							var bAssertion = bHasPlaceHolderSet ? oSmartField.getDomRef().style.minHeight !== "" : oSmartField.getDomRef().style.minHeight === "";

							Opa5.assert.ok(bAssertion);
						}
					});
				},
				iShouldSeeNumberOfRequests: function(sIdRequestsLog, nCount, oRequest) {
					return this.waitFor({
						id: sIdRequestsLog,
						success: function(oList) {
							var aResult;

							// We are not responsible for "$skip=0&$top=141" parameter and we can not control it.
							// It depends on the screen size, so we delete it.
							delete oRequest.urlParameters[0];

							aResult = oList.getItems().filter(function(oItem) {
								var oSentRequest = oItem.data("sentRequest").sentRequest;

								delete oSentRequest.urlParameters[0];

								return isEqual(oSentRequest, oRequest);
							});

							Opa5.assert.strictEqual(
								aResult.length,
								nCount,
								"Expected requests: " + nCount + ", Actual requests: " + aResult.length
							);
						}
					});
				},
				iShouldSeeSmartFieldFiredEvent: function(sIdEventsLog, sId, sEventId) {
					return this.waitFor({
						id: sIdEventsLog,
						success: function(oList) {
							var aResult = oList.getItems().filter(function(oItem) {
								var oFiredEvent = oItem.data("fireEvent").firedEvent;

								return oFiredEvent.eventId === sEventId && oFiredEvent.source.getId() === sId;
							});
							Opa5.assert.strictEqual(aResult.length, 1, "The event " + sEventId + " was fired from " + sId);
						}
					});
				},
				iShouldSeeSmartFieldWithInitialValue: function(sId, bIsInitial) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfield.SmartField",
						id: sId,
						success: function(oSmartField) {
							Opa5.assert.strictEqual(oSmartField._bValueNotInitial, bIsInitial, "The SmartField has no initial value");
						}
					});
				},
				iShouldSeeInnerControlWith: function(sId, sPropertyName, mValue) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfield.SmartField",
						id: sId,
						success: function(oSmartField) {
							var sGetter = "get" + capitalize(sPropertyName),
								oInnerControl = oSmartField.getFirstInnerControl(),
								mCurrentValue = oInnerControl[sGetter]();

							Opa5.assert.strictEqual(mCurrentValue, mValue, "The SmartField's inner control has " + sPropertyName + " with the right value " + mValue);
						}
					});
				},
				iShouldSeePendingChanges: function(sId, oPendingChanges) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function(oSmartField) {
							var oValueBinding = oSmartField.getBinding("value"),
								oBindingContext = oValueBinding && oValueBinding.getContext(),
								oDataModel = oBindingContext && oBindingContext.getModel();

							Opa5.assert.strictEqual(JSON.stringify(oDataModel.getPendingChanges()), JSON.stringify(oPendingChanges));
						}
					});
				},
				iSeeTheSuggestionsPopover: function(sId) {
					return this.waitFor({
						id: sId,
						controlType: "sap.m.Popover",
						success: function(oInputPopover) {
							Opa5.assert.ok(oInputPopover.getVisible(), "Suggestions were shown");
						},
						errorMessage: "Suggestions popover were not shown.",
						timeout: 5000
					});
				},
				iShouldNotSeeShowAllItems: function(sId) {
					return this.waitFor({
						id: sId,
						controlType: "sap.m.Popover",
						success: function(oPopover) {
							Opa5.assert.equal(oPopover.getFooter(), null, "Show All Items button is not present as no footer set.");
						},
						errorMessage: "Show All Items button is still present."

					});
				},
				iShouldSeeSmartFieldFirstInnerControlIsA: function(sId, oControlType) {
					return SmartFieldAssertions.iShouldSeeSmartFieldFirstInnerControlIsA.call(this, sId, oControlType);
				},
				iShouldSeeDialogTitleWithValue: function (sValue) {
					return SmartFieldAssertions.iShouldSeeDialogTitleWithValue.call(this,
						sValue
					);
				}
			}
		}
	});
});
