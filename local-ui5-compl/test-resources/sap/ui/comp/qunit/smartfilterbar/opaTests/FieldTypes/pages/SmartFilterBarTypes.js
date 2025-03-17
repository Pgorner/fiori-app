sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"sap/ui/test/matchers/Ancestor",
		"sap/ui/test/matchers/Descendant",
		"sap/m/inputUtils/ListHelpers",
		"sap/m/library",
		"sap/ui/test/OpaBuilder"
	],
	function (
		Opa5,
		Press,
		EnterText,
		PropertyStrictEquals,
		Ancestor,
		Descendant,
		ListHelpers,
		mobileLibrary,
		OpaBuilder) {
		"use strict";

		var ButtonType = mobileLibrary.ButtonType,
			oRB = Opa5.getWindow().sap.ui.require("sap/ui/test/OpaPlugin")?.getLibraryResourceBundle("sap.ui.comp"),
			sMULTICOMBOBOX_TOKEN_KEY = ListHelpers.CSS_CLASS + "Token",
			oMRB = Opa5.getWindow().sap.ui.require("sap/ui/test/OpaPlugin")?.getLibraryResourceBundle("sap.m"),
			sIdEventsLog = "events";

		Opa5.createPageObjects({
			onTheSmartFilterBarTypesPage: {
				arrangements: new Opa5({
					iStartMyApp: function () {
						return this.iStartMyAppInAFrame(
							sap.ui.require.toUrl(
								"sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/applicationUnderTest/SmartFilterBar_Types.html"
							)).then(function () {
								// Cache resource bundle URL
								oRB = Opa5.getWindow().sap.ui.require("sap/ui/test/OpaPlugin")?.getLibraryResourceBundle("sap.ui.comp");
							});
					},
					iEnsureMyAppIsRunning: function () {
						if (!this._myApplicationIsRunning) {
							this.iStartMyApp();
							this._myApplicationIsRunning = true;
						}
					}
				}),
				actions: new Opa5({
					iPressTheAdaptFiltersShowValuesButton: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							searchOpenDialogs: true,
							actions: new Press(),
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "Show Values"
							})
						});
					},
					iPressTokenRemoveIcon: function(sMultiComboBoxId, sTokenText) {
						return this.waitFor({
							controlType: "sap.m.Token",
							searchOpenDialogs: true,
							matchers: [
								new PropertyStrictEquals({
									name: "text",
									value: sTokenText
								}),
								new Ancestor(sMultiComboBoxId)
							],
							success: function (aTokens) {
								aTokens[0].mAggregations.deleteIcon.firePress();
							}
						});
					},
					iPressTheAdaptFiltersCancelButton: function () {
						return this.waitFor({
							id: "smartFilterBar-adapt-filters-dialog-cancelBtn",
							searchOpenDialogs: true,
							actions: new Press()
						});
					},
					iPressTheAdaptFiltersOKButton: function () {
						return this.waitFor({
							id: "smartFilterBar-adapt-filters-dialog-confirmBtn",
							searchOpenDialogs: true,
							actions: new Press()
						});
					},
					iPressTheAdaptFiltersGoButton: function () {
						return this.waitFor({
							id: "smartFilterBar-btnGoFilterDialog",
							searchOpenDialogs: true,
							actions: new Press()
						});
					},
					iPressTheRestoreButton: function () {
						return this.waitFor({
							id: "smartFilterBar-btnRestore",
							controlType: "sap.m.Button",
							actions: new Press(),
							errorMessage: "Did not find the restore button"
						});
					},
					iPressTheErrorDialogCloseButton: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							actions: new Press(),
							searchOpenDialogs: true,
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "Close"
							})
						});
					},
					iPressTheFilterGoButton: function () {
						return this.waitFor({
							id: "smartFilterBar-btnGo",
							controlType: "sap.m.Button",
							actions: new Press(),
							errorMessage: "Did not find the button 'Go'"
						});
					},
					iPressSearchFieldIconButton: function (sId) {
						return this.waitFor({
							id: sId,
							controlType: "sap.m.Button",
							actions: new Press(),
							searchOpenDialogs: true
						});
					},
					iPressValueHelpIcon: function (sFieldID) {
						return this.waitFor({
							id: sFieldID,
							controlType: "sap.ui.core.Icon",
							actions: new Press(),
							errorMessage: "Did not find the Value help with ID" + sFieldID
						});
					},
					iPressTheSetfilterDataAsStringButton: function () {
						return this.waitFor({
							id: "__xmlview0--setfilterDataAsString",
							actions: new Press()
						});
					},
					iEnterStringInFiled: function (sFieldID, sString, sErrorMessage, bKeepFocus) {
						return this.waitFor({
							id: sFieldID,
							actions: new EnterText({
								text: sString,
								keepFocus: !!bKeepFocus
							}),
							errorMessage: sErrorMessage ? sErrorMessage : "Did not find the field"
						});
					},
					iNavigateToTheDefineConditionsTab: function () {
						return this.waitFor({
							controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
							success: function (aDialogs) {
								aDialogs[0]._updateView("DESKTOP_CONDITIONS_VIEW");
							}
						});
					},
					// Due to unstable test in DINC0199212 we now wait for the first row of the table
					// to be loaded before we go to the 'Define Conditions' tab
					__iNavigateToTheDefineConditionsTab: function () {
						return this.waitFor({
							controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
							success: function (aDialogs) {
								return this.waitFor({
									controlType: "sap.ui.table.Row",
									searchOpenDialogs: true,
									success: function() {
										aDialogs[0]._updateView("DESKTOP_CONDITIONS_VIEW");
									}
								});
							}
						});
					},
					iSelectOperation: function (sOperation, bExclude) {
						return this.waitFor({
							controlType: "sap.m.ComboBox",
							success: function (aControls) {
								// First control should be the include operations select and second the exclude
								aControls[bExclude ? 1 : 0].setSelectedKey(sOperation).fireEvent("change");
							},
							searchOpenDialogs: true
						});
					},
					iPressTheVHDOKButton: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: function (oControl) {
								return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.getType() === ButtonType.Emphasized;
							},
							actions: new Press(),
							searchOpenDialogs: true
						});
					},
					iPressTheVHDCancelButton: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: function (oControl) {
								return oControl.getText() === oRB.getText("VALUEHELPDLG_CANCEL");
							},
							actions: new Press(),
							searchOpenDialogs: true
						});
					},
					iOpenTheVHD: function (sControlID) {
						return this.waitFor({
							id: sControlID + "-vhi",
							controlType: "sap.ui.core.Icon",
							actions: new Press()
						});
					},
					iExpandMultiComboBox: function (sControlID) {
						return this.waitFor({
							id: sControlID + "-arrow",
							controlType: "sap.ui.core.Icon",
							actions: new Press()
						});
					},
					iPressMultiComboBoxItem: function (sMultiComboBoxId, sListItemTitle) {
						return this.waitFor({
							controlType: "sap.m.StandardListItem",
							matchers: [
								new PropertyStrictEquals({
									name: "title",
									value: sListItemTitle
								}),
								new Ancestor(sMultiComboBoxId)
							],
							actions: new Press()
						});
					},
					iPressTheVHDOK: function (sControlID) {
						return this.waitFor({
							id: sControlID + "-valueHelpDialog-ok",
							controlType: "sap.m.Button",
							actions: new Press()
						});
					},
					iSelectRowsFromVHD: function(sControlID, aTexts) {
						return this.waitFor({
							id: sControlID + "-valueHelpDialog-table-ui5table",
							controlType: "sap.ui.table.Table",
							searchOpenDialogs: true,
							success: function (oTable) {
								var sRowText,
									aRows = oTable.getRows(),
									oTableSelectionInstance = (oTable._getSelectionPlugin && oTable._getSelectionPlugin().isA("sap.ui.table.plugins.MultiSelectionPlugin") && oTable.data("isInternal")) ? oTable._getSelectionPlugin() : oTable;

									aRows.forEach(function(oRow, iIndex){
										sRowText = oRow.getCells()[0].getText();
										if (sRowText === aTexts[iIndex]) {
											oTable._iSourceRowIndex = iIndex;
											oTableSelectionInstance.addSelectionInterval(iIndex, iIndex);
										}
									});
							}
						});
					},
					iOpenTheDropdown: function () {
						return this.waitFor({
							controlType: "sap.m.P13nConditionPanel",
							searchOpenDialogs: true,
							success: function (aConditionPanels) {
								var oConditionPanel = aConditionPanels[0],
									aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
										return oControl.isA("sap.ui.layout.Grid");
									}),
									oComboBox = aGrids[1].findAggregatedObjects(true, function (oControl) {
										// Heuristics: the first sap.m.ComboBox control in the condition panel is the operations select
										return oControl.isA("sap.m.ComboBox") && oControl.getItemByText("Include");
									})[0];
								oComboBox.open();
							}
						});
					},
					iChangeTheCondition: function (sNewCondition, bExclude, iCondition) {
						if (iCondition === undefined) {
							iCondition = 0;
						}

						return this.waitFor({
							controlType: "sap.m.P13nConditionPanel",
							searchOpenDialogs: true,
							success: function (aConditionPanels) {
								var oItem,
									oConditionPanel = aConditionPanels[0],
									aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
										return oControl.isA("sap.ui.layout.Grid");
									}),
									oComboBox = aGrids[iCondition + 1].findAggregatedObjects(true, function (oControl) {
										// Heuristics: the first sap.m.ComboBox control in the condition panel is the operations select
										return oControl.isA("sap.m.ComboBox") && oControl.getItemByText("Include");
									})[0];
								oComboBox.open();
								oItem = oComboBox._getList().findAggregatedObjects(false, function (oItem) {
									return oItem.mProperties && oItem.mProperties.title === sNewCondition;
								})[0];
								oItem.$().trigger("tap");
							}
						});
					},
					iEnterTextInConditionField: function (bExclude, iCondition, sText1, sText2) {
						if (iCondition === undefined) {
							iCondition = 0;
						}

						return this.waitFor({
							controlType: "sap.m.P13nConditionPanel",
							searchOpenDialogs: true,
							success: function (aConditionPanels) {
								var oConditionPanel = aConditionPanels[0],
									aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
										return oControl.isA("sap.ui.layout.Grid");
									}),
									aInputs = aGrids[iCondition + 1].findAggregatedObjects(true, function (oControl) {
										// Heuristics find input fields
										return oControl.isA("sap.m.Input");
									});

								new EnterText({
									text: sText1
								}).executeOn(aInputs[0]);

								if (aInputs[1]) {
									new EnterText({
										text: sText2
									}).executeOn(aInputs[1]);
								}
							}
						});
					},
					iSearchFieldsInAdaptFilters: function (sText) {
						return this.waitFor({
							controlType: "sap.m.SearchField",
							searchOpenDialogs: true,
							matchers: new PropertyStrictEquals({
								name: "placeholder",
								value: "Search for Filters"
							}),
							success: function (oSearchFields) {
								const oSearchField = oSearchFields[0];
								oSearchField.setValue(sText);
								oSearchField.fireLiveChange();
							}
						});
					},
					iPressButtonWithIcon: function(sIconName) {
						return this.waitFor({
							controlType: "sap.m.Button",
							searchOpenDialogs: true,
							matchers: new PropertyStrictEquals({
								name: "icon",
								value: sIconName
							}),
							success: function(aButtons) {
								new Press().executeOn(aButtons[0]);
							}
						});
					},
					iPressTheFilterAddButton: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							searchOpenDialogs: true,
							matchers: [
								new PropertyStrictEquals({
									name: "text",
									value: "Add"
								})
							],
							success: function (aButtons) {
								new Press().executeOn(aButtons[0]);
							}
						});
					},
					iPressTheFiltersRemoveAllButton : function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							searchOpenDialogs: true,
							matchers: [
								new PropertyStrictEquals({
									name: "text",
									value: "Remove All"
								})
							],
							success: function (aButtons) {
								new Press().executeOn(aButtons[0]);
							},
							errorMessage : "Did not found the Remove all Button"
						});
					},
					iOpenTheAdaptFiltersDialog: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "smartFilterBar-btnFilters",
							actions: new Press()
						});
					},
					iCloseTheAdaptFiltersDialog: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "smartFilterBar-adapt-filters-dialog-cancelBtn",
							actions: new Press()
						});
					},
					iSwitchAdaptFiltersToGroupView: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "icon",
								value: "sap-icon://group-2"
							}),
							actions: new Press()
						});
					},
					iOpenValueHelpRequestForFilterItem: function(sPropertyName, sSFBId) {
						return this.waitFor({
							controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
							id: sSFBId,
							success: function (oSmartFilterBar) {
								oSmartFilterBar.openValueHelpRequestForFilterItem(sPropertyName);
							}
						});
					},
					iExpandAdaptFiltersGroup: function (sGroupName) {
						return this.waitFor({
							controlType: "sap.m.Panel",
							matchers: function (oPanel) {
								var oTitle,
									bMatched = false,
									oHeaderToolbar = oPanel.getHeaderToolbar(),
									oExpandButton = oPanel.getDependents()[0];

								if (oHeaderToolbar) {
									oTitle = oHeaderToolbar.getContent()[0];
								}

								if ( oTitle && oTitle.getText() === sGroupName && oExpandButton) {
									bMatched = true;
								}

								return bMatched;
							},
							success: function (oPanel) {
								var oExpandButton = oPanel[0].getDependents()[0],
									oPress = new Press();

									// Act
									oPress.executeOn(oExpandButton);

									// Cleanup
									oPress.destroy();
							}
						});
					},
					iExpandVHDFilters: function (sControlID) {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: sControlID + "-valueHelpDialog-smartFilterBar-btnShowHide",
							searchOpenDialogs: true,
							actions: new Press()
						});
					},
					iToggleTheShortButton: function () {
						return this.waitFor({
							id: "__xmlview0--shortMode",
							actions: new Press()
						});
					},
					iSelectItemFromComboBox: function (sId, sItemText) {
						return this.waitFor({
							id: sId,
							controlType: "sap.ui.comp.odata.ComboBox",
							success: function (oControl) {
								var aItems = oControl.getItems(),
									oSelectedItem = aItems.find(function(oItem){
										return oItem.getText() === sItemText;
									});

								oControl.setSelectedItem(oSelectedItem);
							}
						});
					},
					iSelectItemsFromMultiComboBox: function (sId, aItemTexts) {
						return this.waitFor({
							id: sId,
							controlType: "sap.ui.comp.smartfilterbar.SFBMultiComboBox",
							success: function (oControl) {
								var aItems = oControl.getItems(),
									aSelectedItems = aItems.filter(function(oItem){
										return aItemTexts.indexOf(oItem.getText()) !== -1;
									});

								oControl.setSelectedItems(aSelectedItems);
								oControl.fireSelectionChange();
							}
						});
					},
					setModelDefaultCountModeToNone: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "__xmlview0--changeModelDefaultCountMode",
							actions: new Press(),
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "Change Model defaultCountMode to None"
							})
						});
					},
					setModelDefaultCountModeToRequest: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "__xmlview0--changeModelDefaultCountModeRequest",
							actions: new Press(),
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "Change Model defaultCountMode to Request"
							})
						});
					},
					iSetFilterData: function (sId, oFilterData) {
						return this.waitFor({
							controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
							id: sId,
							success: function (oSmartFilterBar) {
								oSmartFilterBar.setFilterData(oFilterData);
							}
						});
					},
					iChangeFilterVisibility: function (sId) {
						return this.waitFor({
							controlType: "sap.m.CustomListItem",
							matchers: new Descendant(sId, true),
							searchOpenDialogs: true,
							actions: new Press()
						});
					},
					iSelectFilter: function(sFilterLabel, bIsSelected, sViewType){
						this.waitFor(
							new OpaBuilder()
								.hasId(/-selectMulti$/)
								.hasType("sap.m.CheckBox")
								.do(function(oCheckBox){
									var oParent = oCheckBox.getParent();
									//GroupView is using "CustomListItem" while the ListView is using "ColumnListItem"
									if (oParent.isA("sap.m.CustomListItem") || oParent.isA("sap.m.ColumnListItem")){
										var oLabelContainer = sViewType === "list" ? oParent.getCells()[0] : oParent.getContent()[0];
										var oControl = oLabelContainer.getItems()[0];
										if (oControl.isA("sap.m.Label") && oControl.getText() === sFilterLabel &&
											((bIsSelected && !oCheckBox.getSelected()) ||
											(!bIsSelected && oCheckBox.getSelected()))) {
											new Press().executeOn(oCheckBox);
										}
									}
								})
								.build()
						);
					}
				}),
				assertions: new Opa5({
					theRequestURLShouldMatch: function (sRequestURL, sErrorMessage) {
						return this.waitFor({
							id: "outputAreaUrl",
							success: function (oText) {
								Opa5.assert.strictEqual(
									oText.getText(),
									sRequestURL,
									sErrorMessage ? sErrorMessage : "Request URL should match"
								);
							}
						});
					},
					theFiltersShouldMatch: function (sFilters, sErrorMessage) {
						return this.waitFor({
							id: "outputAreaFilters",
							success: function (oText) {
								Opa5.assert.strictEqual(
									oText.getText(),
									sFilters,
									sErrorMessage ? sErrorMessage : "Filters should match"
								);
							}
						});
					},
					theErrorDialogIsOpen: function (sErrorMessage) {
						return this.waitFor({
							controlType: "sap.m.Dialog",
							searchOpenDialogs: true,
							success: function (aDialogs) {
								var oDialog = aDialogs[0];

								Opa5.assert.ok(oDialog.isA("sap.m.Dialog"), 'Error Dialog should be open');
								// Opa5.assert.strictEqual(oDialog.getTitle(), oRB.getText("VALUEHELPDLG_SELECTIONFAILEDTITLE"),
								// 	"Error dialog title should match");
								Opa5.assert.strictEqual(
									oDialog.getContent()[0].getText(),
									oRB.getText(sErrorMessage ? sErrorMessage : "VALIDATION_ERROR_MESSAGE"), "Error message in dialog should match"
								);
							},
							errorMessage: "did not find the filters dialog",
							timeout: 15
						});
					},
					theWarningDialogIsOpen: function () {
						return this.waitFor({
							controlType: "sap.m.Dialog",
							searchOpenDialogs: true,
							success: function (aDialogs) {
								var oDialog = aDialogs[1];

								Opa5.assert.ok(oDialog.isA("sap.m.Dialog"), 'Warning Dialog should be open');

								Opa5.assert.strictEqual(
									oDialog.getTitle(),
									oRB.getText("VALUEHELPDLG_SELECTIONFAILEDLOADTITLE"), "Warning message in dialog should match"
								);
							},
							errorMessage: "did not find the warning filters dialog",
							timeout: 15
						});
					},
					thereIsNoEmptyOperation: function (sControl, bExclude) {
						return this.waitFor({
							controlType: "sap.m.ComboBox",
							searchOpenDialogs: true,
							success: function (aControls) {
								var sOperation = bExclude ? "NotEmpty" : "Empty";
								Opa5.assert.strictEqual(
									!!aControls[0].findItem("key", sOperation),
									false,
									"There is no Empty operation in " + (bExclude ? "include" : "exclude") + " operations select for " + sControl
								);
							}
						});
					},
					thereIsOperation: function (sControl, sOperation, sText) {
						return this.waitFor({
							controlType: "sap.m.ComboBox",
							searchOpenDialogs: true,
							success: function (aControls) {
								Opa5.assert.strictEqual(
									!!aControls[0].findItem("key", sOperation),
									true,
									"There is no Empty operation in " + sOperation + " operations select for " + sControl
								);
								if (sText) {
									Opa5.assert.strictEqual(
										aControls[0].findItem("key", sOperation).getText(),
										sText,
										"There is  operation in " + sOperation + " operations select for " + sControl
									);
								}
							}
						});
					},
					setCountableTypeToModule: function (sDefaultCountModelType) {
						return this.waitFor({
							success: function () {
								Opa5.getJQuery()("#__xmlview0").control(0).getModel().setDefaultCountMode(sDefaultCountModelType);
							},
							errorMessage: "Did not find the view"
						});
					},
					iShouldSeeValueHelpDialog: function (sId, iBaseSearchFilters, iRows) {
						return this.waitFor({
							controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
							id: sId,
							success: function (oVHD) {
								var sBasicSearchText = oVHD.getBasicSearchText(),
									aContexts;
								oVHD.getTableAsync().then(function(oTable) {
									aContexts = oTable.getBinding("rows").getCurrentContexts();
									Opa5.assert.equal(sBasicSearchText, iBaseSearchFilters, "The ValueHelpDialog " + sId + " contains the correct base search filter");
									Opa5.assert.equal(aContexts.length, iRows, "The ValueHelpDialog " + sId + " contains the correct number of Rows");
								});
							}
						});
					},
					iShouldSeeIncludAndExcludeGroupHeaders: function (sIncludeText, sExcludeText) {
						return this.waitFor({
							controlType: "sap.m.GroupHeaderListItem",
							success: function (aItems) {
								Opa5.assert.equal(aItems.length, 2, "There should be only two GroupHeaderListItems");
								Opa5.assert.equal(aItems[0].getTitle(), sIncludeText, "The first GroupHeaderListItem is 'Include'");
								Opa5.assert.equal(aItems[1].getTitle(), sExcludeText, "The second GroupHeaderListItem is 'Exclude'");
							}
						});
					},
					iShouldSeeValueHelpDialogWithoutMatchingItsTableData: function (sId, sTitle) {
						return this.waitFor({
							controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
							id: sId,
							success: function (oVHD) {
								var sVHDTitle = oVHD.getTitle();
								Opa5.assert.equal(sVHDTitle, sTitle, "The ValueHelpDialog " + sId + " have the correct title");
							}
						});
					},
					iShouldSeeDisabledOperatorsDropdown: function () {
						return this.waitFor({
							controlType: "sap.m.ComboBox",
							searchOpenDialogs: true,
							success: function (aControls) {
								Opa5.assert.strictEqual(
									aControls[0].getEnabled(),
									false,
									"ComboBox for boolean fields is disabled"
								);
							}
						});
					},
					iShouldSeeBTFieldsInCorrectOrder: function() {
						return this.waitFor({
							controlType: "sap.ui.comp.p13n.P13nConditionPanel",
							searchOpenDialogs: true,
							success: function(aPanels) {
								var oPanel = aPanels[0],
									aConditionGrid = oPanel._oConditionsGrid.getContent()[0].getContent(),
									iLength = aConditionGrid.length,
									// last two items of the conditions grid are the two buttons 'X' and 'Add'
									// so we expect that the 'from' and 'to' input fields are before the buttons
									oValue1 = aConditionGrid[iLength - 4],
									oValue2 = aConditionGrid[iLength - 3];

								Opa5.assert.equal(oValue1.getPlaceholder(), oMRB.getText("CONDITIONPANEL_LABELFROM"), "field 'From' is in the correct position");
								Opa5.assert.equal(oValue2.getPlaceholder(), oMRB.getText("CONDITIONPANEL_LABELTO"), "field 'To' is in the correct position");
							}
						});
					},
					iShouldSeeCorrectNumberOfFiltersInP13nConditionPanel: function (nCount) {
						return this.waitFor({
							controlType: "sap.m.P13nConditionPanel",
							searchOpenDialogs: true,
							success: function (aConditionPanels) {
								var oConditionPanel = aConditionPanels[0],
									aContent = oConditionPanel.getAggregation("content"),
									oConditionPanelContent = aContent[aContent.length - 1],
									aConditionPanelTargetGrids = oConditionPanelContent.getAggregation("content");

								Opa5.assert.strictEqual(
									aConditionPanelTargetGrids.length, nCount, "The count of the filters is correct."
								);
							},
							errorMessage : "The count of the filters is not correct."
						});
					},
					iShouldSeeFollowingConditions: function (aConditions) {
						return this.waitFor({
							controlType: "sap.m.P13nConditionPanel",
							searchOpenDialogs: true,
							success: function (aConditionPanels) {
								var iConditionIndex = 0,
									oConditionPanel = aConditionPanels[0],
									oConditionPanelContent = oConditionPanel.getAggregation("content")[4],
									oConditionPanelTargetGrids = oConditionPanelContent.getAggregation("content")[0],
									oComboBox = oConditionPanelTargetGrids.getAggregation("content")[4];

									oComboBox.getItems().forEach(function(oItems, iIndex){
										if (oItems.isA("sap.ui.core.ListItem")) {
											Opa5.assert.strictEqual(
												oItems.getKey(), aConditions[iConditionIndex], "The Condition index is correct."
											);
											iConditionIndex++;
										}
									});

									Opa5.assert.strictEqual(
										aConditions.length, iConditionIndex, "The count of the conditions is correct."
									);
							},
							errorMessage : "The count of the filters is not correct."
						});
					},
					theComboBoxValueShouldMatch: function (sId, sText) {
						return this.waitFor({
							id: sId,
							controlType: "sap.ui.comp.odata.ComboBox",
							success: function (oControl) {
								Opa5.assert.strictEqual(
									oControl.getValue(), sText, "The filter value is correct."
								);
							}
						});
					},
					theMultiComboBoxTokensShouldMatch: function (sId, aTexts) {
						return this.waitFor({
							id: sId,
							controlType: "sap.ui.comp.smartfilterbar.SFBMultiComboBox",
							success: function (oControl) {
								var aSelectedItems = oControl.getSelectedItems();

								aTexts.forEach(function(sText, iIndex){
									Opa5.assert.strictEqual(
										sText, aSelectedItems[iIndex].data(sMULTICOMBOBOX_TOKEN_KEY).getText(), "The filter token text is correct."
									);
								});
							}
						});
					},
					theMultiComboBoxSelectedItemsLengthMatch: function (sId, sLength) {
						return this.waitFor({
							id: sId,
							controlType: "sap.ui.comp.smartfilterbar.SFBMultiComboBox",
							success: function (oControl) {
								Opa5.assert.strictEqual(oControl.getSelectedItems().length, 0, "Selected items have length of " + sLength);
							}
						});
					},
					theInputValueShouldMatch: function (sId, sText) {
						return this.waitFor({
							id: sId,
							controlType: "sap.m.Input",
							success: function (oControl) {
								Opa5.assert.strictEqual(
									oControl.getValue(), sText, "The filter value is correct."
								);
							}
						});
					},
					theMultiInputTokensShouldMatch: function (sId, aTexts) {
						return this.waitFor({
							id: sId,
							controlType: "sap.ui.comp.smartfilterbar.SFBMultiInput",
							success: function (oControl) {
								var aTokens = oControl.getTokens();

								aTexts.forEach(function(sText, iIndex){
									Opa5.assert.strictEqual(
										sText, aTokens[iIndex].getText(), "The filter token text is correct."
									);
								});
							}
						});
					},
					theValueHelpDialogTokensShouldMatch: function (sId, aTexts) {
						return this.waitFor({
							id: sId + "-valueHelpDialog-selectedTokens",
							controlType: "sap.m.Tokenizer",
							success: function (oControl) {
								var aTokens = oControl.getTokens();

								aTexts.forEach(function(sText, iIndex){
									Opa5.assert.strictEqual(
										sText, aTokens[iIndex].getText(), "The filter token text is correct."
									);
								});
							}
						});
					},
					theFilterValueStateShouldMatch: function (sId, sValueState) {
						return this.waitFor({
							id: sId,
							success: function (oControl) {
								Opa5.assert.strictEqual(oControl.getValueState(), sValueState,
									"The filter value state should be " + sValueState);
							}
						});
					},
					theParameterShouldMatch: function (sParameterValue, sErrorMessage) {
						return this.waitFor({
							id: "outputAreaUrl",
							success: function (oText) {
								Opa5.assert.ok(
									oText.getText().indexOf(sParameterValue) !== -1,
									sErrorMessage ? sErrorMessage : "Parameters should be sent"
								);
							}
						});
					},
					iShouldSeeSmartFieldFiredEvent: function (sId, sEventId) {
						return this.waitFor({
							id: sIdEventsLog,
							success: function (oList) {
								var aResult = oList.getItems().filter(function(oItem) {
									var oFiredEvent = oItem.data("fireEvent").firedEvent;

									return oFiredEvent.eventId === sEventId && oFiredEvent.source.getId() === sId;
								});
								Opa5.assert.strictEqual(aResult.length, 1, "The event " + sEventId + " was fired from " + sId);
							}
						});
					},
					iShouldSeeAFilterControl: function (sId, bRendered) {
						return this.waitFor({
							id: sId,
							success: function (oControl) {
								var bResult = false,
									sVisible,
									oDomRef = oControl.getDomRef();

								if (bRendered && oDomRef !== null) {
									bResult = true;
									sVisible = "visible";
								}

								if (!bRendered && oDomRef === null) {
									bResult = true;
									sVisible = "invisible";
								}

								Opa5.assert.ok(bResult, "Filter with Id: " + sId + " is " + sVisible);
							}
						});
					},
					iShouldSeeFiltersWithValues: function (sId, aFilterNames) {
						return this.waitFor({
							controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
							id: sId,
							success: function (oSmartFilterBar) {
								var bMatched = oSmartFilterBar.getFiltersWithValues().every(function(oFilterItem, iIndex){
									return oFilterItem.getName() === aFilterNames[iIndex];
								});

								Opa5.assert.ok(bMatched, "Filters with values are matching");
							}
						});
					},
					filtersGroupShouldHaveFilters: function (sGroupName, nFilterCount) {
						return this.waitFor({
							controlType: "sap.m.Panel",
							matchers: function (oPanel) {
								var oTitle,
									bMatched = false,
									oHeaderToolbar = oPanel.getHeaderToolbar(),
									oExpandButton = oPanel.getDependents()[0];

								if (oHeaderToolbar) {
									oTitle = oHeaderToolbar.getContent()[0];
								}

								if ( oTitle && oTitle.getText() === sGroupName && oExpandButton) {
									bMatched = true;
								}

								return bMatched;
							},
							success: function (aPanels) {
								var oListItem = aPanels[0].getContent()[0];

								Opa5.assert.ok(oListItem);

								Opa5.assert.equal(oListItem.getItems().length, nFilterCount, sGroupName + "group has correct number of filters");
							}
						});
					},
					theSelectShouldHaveSelectedItemWithKeyAndText: function (sKey, sText, bSearchOpenDialogs) {
						return this.waitFor({
							controlType: "sap.m.Select",
							searchOpenDialogs: bSearchOpenDialogs,
							success: function (aSelect) {
								const oSelect = aSelect[0];
								Opa5.assert.ok(oSelect);
								Opa5.assert.equal(oSelect.getSelectedKey(), sKey);
								Opa5.assert.equal(oSelect._getSelectedItemText(), sText);
							}
						});
					},
					iCheckFilterIsSelected: function(sFilterLabel, bIsSelected, sViewType){
						this.waitFor(
							new OpaBuilder()
								.hasId(/-selectMulti$/)
								.hasType("sap.m.CheckBox")
								.do(function(oCheckBox){
									var oParent = oCheckBox.getParent();
									//GroupView is using "CustomListItem" while the ListView is using "ColumnListItem"
									if (oParent.isA("sap.m.CustomListItem") || oParent.isA("sap.m.ColumnListItem")){
										var oLabelContainer = sViewType === "list" ? oParent.getCells()[0] : oParent.getContent()[0];
										var oControl = oLabelContainer.getItems()[0];
										if (oControl.isA("sap.m.Label") && oControl.getText() === sFilterLabel) {
											Opa5.assert.ok(oCheckBox.getSelected() === bIsSelected, "Filter is selected");
										}
									}
								})
							.build());
					},
					iShouldSeeFilterWithValueStateText: function(sId, sText) {
						this.waitFor({
							id: sId,
							success: function (oControl) {
								Opa5.assert.equal(oControl.getValueStateText(), sText, "Filter has correct value state text");
							}
						});
					},
					iShouldSeeFilterWithValueState: function(sId, sValueState) {
						this.waitFor({
							id: sId,
							success: function (oControl) {
								Opa5.assert.equal(oControl.getValueState(), sValueState, "Filter has correct value state");
							}
						});
					}
				})
			}
		});
	}
);
