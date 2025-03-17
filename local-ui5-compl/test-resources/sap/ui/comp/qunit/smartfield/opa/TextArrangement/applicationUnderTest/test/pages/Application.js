sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/actions/Press",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Actions",
	"test-resources/sap/ui/comp/testutils/opa/smartfield/Assertions",
	"test-resources/sap/ui/comp/testutils/opa/valuehelpdialog/Actions"
], function (
	Opa5,
	EnterText,
	Press,
	SmartFieldActions,
	SmartFieldAssertions,
	ValueHelpDialogActions
) {
	"use strict";

	var sIdEvents = "events";

	Opa5.createPageObjects({
		onTheApplicationPage: {
			actions: {
				iChangeTheValueTo: function (sId, sValue) {
					return SmartFieldActions.iEnterTextInSmartField.call(this, sId, sValue, false);
				},
				iChangeTheInputValueTo: function (sId, sValue) {
					return this.waitFor({
						id: sId,
						success: function (oInput) {
							oInput.setValue(sValue);
						}
					});
				},
				iClearTheLog: function () {
					return this.waitFor({
						id: "clearLog",
						actions: new Press()
					});
				},
				iOpenSmartFieldSuggestions: function (sID, sText) {
					return this.waitFor({
						id: sID,
						actions: new EnterText({ text: sText, keepFocus: true })
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
					return ValueHelpDialogActions.iSelectItemByIndex.call(this, iIndex);
				},
				iResetTheODataModel: function () {
					return this.waitFor({
						id: "resetModel",
						actions: new Press()
					});
				},
				iEmptyModelValuesForCompoundKeys: function () {
					return  this.waitFor({
						id: "emptyModelValues",
						actions: new Press()
					});
				},
				iBindTARFields: function () {
					return this.waitFor({
						id: "bindTAR",
						actions: new Press()
					});
				},
				iChangeSuppressToDisplay: function () {
					return this.waitFor({
						id: "suppressToDisplay",
						actions: new Press()
					});
				},
				iChangeSuppressToEdit: function () {
					return this.waitFor({
						id: "suppressToEdit",
						actions: new Press()
					});
				},
				iToggleSmartFormEditMode: function (sId) {
					SmartFieldActions.iToggleSmartFormEditMode.call(this, sId);
				},
				iSelectSmartFieldItemByKey: function (sId, sKey) {
					SmartFieldActions.iSelectSmartFieldItemByKey.call(this, sId, sKey);
				}
			},
			assertions: {
				iShouldSeeSmartFieldWithIdAndValue: function (sId, oValue) {
					return SmartFieldAssertions.iShouldSeeSmartFieldWithIdAndValue.call(this, sId, oValue);
				},
				iShouldSeeNumberOfRequests: function (nCount, sEntitySet) {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							var aResult = oList.getItems().filter(function (oItem) {
								var sRequest = oItem.data("request");
								return (
									sRequest &&
									sRequest.indexOf("testService/" + sEntitySet) !== -1
								);
							});
							Opa5.assert.strictEqual(
								aResult.length,
								nCount,
								"Expected requests: " + nCount
							);
						}
					});
				},
				iShouldCheckTheRequestParameters: function () {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							oList.getItems().forEach(function (oItem) {
								var sLog = oItem.data("request");

								if (sLog && sLog.startsWith("testService/StringVH") && sLog.indexOf("filter=KEY2") === -1) {
									Opa5.assert.notStrictEqual(
										sLog.indexOf("$filter=KEY eq '"),
										-1,
										"Filter for `key` exists"
									);
									Opa5.assert.strictEqual(
										sLog.indexOf("substringof"),
										-1,
										"There is no substringof filter"
									);
								}
							});
						}
					});
				},
				iShouldSeeSimpleLogEntry: function (sExpectedText, iExpectedIndex, iExpectedResults) {
					// Explicit check for null/undefined
					if (iExpectedResults === null || iExpectedResults === undefined) {
						iExpectedResults = 1; // Default positive
					}
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							var iFoundAtIndex,
								aItems = oList.getItems().filter(function (oItem, iIndex) {
									if (oItem.isA("sap.m.StandardListItem") && oItem.getTitle() === sExpectedText) {
										iFoundAtIndex = iIndex;
										return true;
									}
									return false;
								});

							Opa5.assert.strictEqual(aItems.length, iExpectedResults, "One such request exist in log");

							// Explicit check for null/undefined
							if (iExpectedIndex !== null && iExpectedIndex !== undefined) {
								Opa5.assert.strictEqual(iFoundAtIndex, iExpectedIndex,
									"Log entry found at expected index");
							}
						}
					});
				},
				iShouldSeeRequest: function (sRequest, iExpectedIndex) {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							var iFoundAtIndex,
								aItems = oList.getItems().filter(function (oItem, iIndex) {
									if (oItem.data("request") === sRequest) {
										iFoundAtIndex = iIndex;
										return true;
									}
									return false;
								});
							Opa5.assert.strictEqual(
								aItems.length,
								1,
								"One such request exist in log"
							);
							// Explicit check for null/undefined
							if (iExpectedIndex !== null && iExpectedIndex !== undefined) {
								Opa5.assert.strictEqual(iFoundAtIndex, iExpectedIndex,
									"Request found at expected index");
							}
						}
					});
				},
				iShouldNotSeeRequest: function (sRequest) {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							var aItems = oList.getItems().filter(function (oItem, iIndex) {
									if (oItem.data("request") === sRequest) {
										return true;
									}
									return false;
								});
							Opa5.assert.strictEqual(
								aItems.length,
								0,
								"No such request exist in log"
							);
						}
					});
				},
				iCheckTheRequestHasNoSubstringText: function () {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							var aItems = oList.getItems().filter(function (oItem) {
								var sLog = oItem.data("request");
								return sLog && sLog.indexOf("substringof") !== -1;
							});
							Opa5.assert.strictEqual(
								aItems.length,
								0,
								"There should be no requests with substringof operation"
							);
						}
					});
				},
				iShouldSeeSuppressField: function (sText, sMode) {
					return this.waitFor({
						id: "ge1",
						visible: false,
						success: function (oGroup) {
							var oField = oGroup.getElements()[0];
							Opa5.assert.strictEqual(oField.getValue(), sText,
								"Field has the correct text");
							Opa5.assert.strictEqual(oField.getMode(), sMode,
								"Field is in the expected mode");
						}
					});
				}
			}
		}
	});
});
