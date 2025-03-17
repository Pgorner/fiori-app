sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/m/inputUtils/ListHelpers",
	"sap/m/library",
	"sap/ui/test/OpaBuilder"
], function (
	Opa5,
	ListHelpers,
	OpaBuilder
	){
	"use strict";

	var sMULTICOMBOBOX_TOKEN_KEY = ListHelpers.CSS_CLASS + "Token",
		sIdEventsLog = "events",
		oMRB = Opa5.getWindow().sap.ui.require("sap/ui/test/OpaPlugin")?.getLibraryResourceBundle("sap.m"),
		oRB = Opa5.getWindow().sap.ui.require("sap/ui/test/OpaPlugin")?.getLibraryResourceBundle("sap.ui.comp");

	function __theRequestURLShouldMatch(sRequestURL, sErrorMessage) {
		return {
			id: "outputAreaUrl",
			success: function (oText) {
				Opa5.assert.strictEqual(
					oText.getText(),
					sRequestURL,
					sErrorMessage ? sErrorMessage : "Request URL should match"
				);
			}
		};
	}
	function __theFiltersShouldMatch(sFilters, sErrorMessage) {
		return {
			id: "outputAreaFilters",
			success: function (oText) {
				Opa5.assert.strictEqual(
					oText.getText(),
					sFilters,
					sErrorMessage ? sErrorMessage : "Filters should match"
				);
			}
		};
	}
	function __theErrorDialogIsOpen(sErrorMessage) {
		return {
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
		};
	}
	function __theWarningDialogIsOpen() {
		return {
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
		};
	}
	function __thereIsNoEmptyOperation(sControl, bExclude) {
		return {
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
		};
	}
	function __thereIsOperation(sControl, sOperation, sText) {
		return {
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
		};
	}
	function __setCountableTypeToModule(sDefaultCountModelType) {
		return {
			success: function () {
				Opa5.getJQuery()("#__xmlview0").control(0).getModel().setDefaultCountMode(sDefaultCountModelType);
			},
			errorMessage: "Did not find the view"
		};
	}
	function __iShouldSeeValueHelpDialog(sId, iBaseSearchFilters, iRows) {
		return {
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
		};
	}
	function __iShouldSeeValueHelpDialogWithColumns(sId, iColumns, aColumnsNames) {
		return {
			controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
			id: sId,
			success: function (oVHD) {
				oVHD.getTableAsync().then(function(oTable) {
					const aCols = oTable.getColumns();
					let sColName;

					Opa5.assert.equal(aCols.length, iColumns, "The ValueHelpDialog " + sId + " contains the correct number of Columns");
					aCols.forEach(function(aCol, iIndex) {
						sColName = aCol.getLabel().getText();

						Opa5.assert.equal(sColName, aColumnsNames[iIndex], "The " + sColName +  " column has a correct label");
					});
				});
			}
		};
	}
	function __iShouldSeeIncludAndExcludeGroupHeaders(sIncludeText, sExcludeText) {
		return {
			controlType: "sap.m.GroupHeaderListItem",
			success: function (aItems) {
				Opa5.assert.equal(aItems.length, 2, "There should be only two GroupHeaderListItems");
				Opa5.assert.equal(aItems[0].getTitle(), sIncludeText, "The first GroupHeaderListItem is 'Include'");
				Opa5.assert.equal(aItems[1].getTitle(), sExcludeText, "The second GroupHeaderListItem is 'Exclude'");
			}
		};
	}

	function __iShouldSeeValueHelpDialogWithoutMatchingItsTableData(sId, sTitle) {
		return {
			controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
			id: sId,
			success: function (oVHD) {
				var sVHDTitle = oVHD.getTitle();
				Opa5.assert.equal(sVHDTitle, sTitle, "The ValueHelpDialog " + sId + " have the correct title");
			}
		};
	}
	function __iShouldSeeDisabledOperatorsDropdown() {
		return {
			controlType: "sap.m.ComboBox",
			searchOpenDialogs: true,
			success: function (aControls) {
				Opa5.assert.strictEqual(
					aControls[0].getEnabled(),
					false,
					"ComboBox for boolean fields is disabled"
				);
			}
		};
	}

	function __iShouldSeeBTFieldsInCorrectOrder() {
		return {
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
		};
	}
	function __iShouldSeeCorrectNumberOfFiltersInP13nConditionPanel(nCount) {
		return {
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
		};
	}
	function __iShouldSeeFollowingConditions(aConditions) {
		return {
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
		};
	}
	function __theComboBoxValueShouldMatch(sId, sText) {
		return {
			id: sId,
			controlType: "sap.ui.comp.odata.ComboBox",
			success: function (oControl) {
				Opa5.assert.strictEqual(
					oControl.getValue(), sText, "The filter value is correct."
				);
			}
		};
	}
	function __theMultiComboBoxTokensShouldMatch(sId, aTexts) {
		return {
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
		};
	}
	function __theInputValueShouldMatch(sId, sText) {
		return {
			id: sId,
			controlType: "sap.m.Input",
			success: function (oControl) {
				Opa5.assert.strictEqual(
					oControl.getValue(), sText, "The filter value is correct."
				);
			}
		};
	}
	function __theMultiInputTokensShouldMatch(sId, aTexts) {
		return {
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
		};
	}

	function __theValueHelpDialogTokensShouldMatch(sId, aTexts) {
		return {
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
			};
	}
	function __theFilterValueStateShouldMatch(sId, sValueState) {
		return {
			id: sId,
			success: function (oControl) {
				Opa5.assert.strictEqual(oControl.getValueState(), sValueState,
					"The filter value state should be " + sValueState);
			}
		};
	}
	function __theParameterShouldMatch(sParameterValue, sErrorMessage) {
		return {
			id: "outputAreaUrl",
			success: function (oText) {
				Opa5.assert.ok(
					oText.getText().indexOf(sParameterValue) !== -1,
					sErrorMessage ? sErrorMessage : "Parameters should be sent"
				);
			}
		};
	}
	function __iShouldSeeSmartFieldFiredEvent(sId, sEventId) {
		return {
			id: sIdEventsLog,
			success: function (oList) {
				var aResult = oList.getItems().filter(function(oItem) {
					var oFiredEvent = oItem.data("fireEvent").firedEvent;

					return oFiredEvent.eventId === sEventId && oFiredEvent.source.getId() === sId;
				});
				Opa5.assert.strictEqual(aResult.length, 1, "The event " + sEventId + " was fired from " + sId);
			}
		};
	}
	function __iShouldSeeAFilterControl(sId, bRendered) {
		return {
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
		};
	}
	function __iShouldSeeFiltersWithValues(sId, aFilterNames) {
		return {
			controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
			id: sId,
			success: function (oSmartFilterBar) {
				var bMatched = oSmartFilterBar.getFiltersWithValues().every(function(oFilterItem, iIndex){
					return oFilterItem.getName() === aFilterNames[iIndex];
				});

				Opa5.assert.ok(bMatched, "Filters with values are matching");
			}
		};
	}
	function __filtersGroupShouldHaveFilters(sGroupName, nFilterCount) {
		return {
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
		};
	}

	function __theSelectShouldHaveSelectedItemWithKeyAndText(sKey, sText, bSearchOpenDialogs) {
		return {
			controlType: "sap.m.Select",
			searchOpenDialogs: bSearchOpenDialogs,
			success: function (aSelect) {
				const oSelect = aSelect[0];
				Opa5.assert.ok(oSelect);
				Opa5.assert.equal(oSelect.getSelectedKey(), sKey);
				Opa5.assert.equal(oSelect._getSelectedItemText(), sText);
			}
		};
	}
	return {
		theRequestURLShouldMatch: function (sRequestURL, sErrorMessage) {
			return this.waitFor(__theRequestURLShouldMatch(sRequestURL, sErrorMessage));
		},
		theFiltersShouldMatch: function (sFilters, sErrorMessage) {
			return this.waitFor(__theFiltersShouldMatch(sFilters, sErrorMessage));
		},
		theErrorDialogIsOpen: function (sErrorMessage) {
			return this.waitFor(__theErrorDialogIsOpen(sErrorMessage));
		},
		theWarningDialogIsOpen: function () {
			return this.waitFor(__theWarningDialogIsOpen());
		},
		thereIsNoEmptyOperation: function (sControl, bExclude) {
			return this.waitFor(__thereIsNoEmptyOperation(sControl, bExclude));
		},
		thereIsOperation: function (sControl, sOperation, sText) {
			return this.waitFor(__thereIsOperation(sControl, sOperation, sText));
		},
		setCountableTypeToModule: function (sDefaultCountModelType) {
			return this.waitFor(__setCountableTypeToModule(sDefaultCountModelType));
		},
		iShouldSeeValueHelpDialog: function (sId, iBaseSearchFilters, iRows) {
			return this.waitFor(__iShouldSeeValueHelpDialog(sId, iBaseSearchFilters, iRows));
		},
		iShouldSeeValueHelpDialogWithColumns: function (sId, iColumns, aColumnsNames) {
			return this.waitFor(__iShouldSeeValueHelpDialogWithColumns(sId, iColumns, aColumnsNames));
		},
		iShouldSeeIncludAndExcludeGroupHeaders: function (sIncludeText, sExcludeText) {
			return this.waitFor(__iShouldSeeIncludAndExcludeGroupHeaders(sIncludeText, sExcludeText));
		},
		iShouldSeeValueHelpDialogWithoutMatchingItsTableData: function (sId, sTitle) {
			return this.waitFor(__iShouldSeeValueHelpDialogWithoutMatchingItsTableData(sId, sTitle));
		},
		iShouldSeeDisabledOperatorsDropdown: function () {
			return this.waitFor(__iShouldSeeDisabledOperatorsDropdown());
		},
		iShouldSeeBTFieldsInCorrectOrder: function() {
			return this.waitFor(__iShouldSeeBTFieldsInCorrectOrder());
		},
		iShouldSeeCorrectNumberOfFiltersInP13nConditionPanel: function (nCount) {
			return this.waitFor(__iShouldSeeCorrectNumberOfFiltersInP13nConditionPanel(nCount));
		},
		iShouldSeeFollowingConditions: function (aConditions) {
			return this.waitFor(__iShouldSeeFollowingConditions(aConditions));
		},
		theComboBoxValueShouldMatch: function (sId, sText) {
			return this.waitFor(__theComboBoxValueShouldMatch(sId, sText));
		},
		theMultiComboBoxTokensShouldMatch: function (sId, aTexts) {
			return this.waitFor(__theMultiComboBoxTokensShouldMatch(sId, aTexts));
		},
		theInputValueShouldMatch: function (sId, sText) {
			return this.waitFor(__theInputValueShouldMatch(sId, sText));
		},
		theMultiInputTokensShouldMatch: function (sId, aTexts) {
			return this.waitFor(__theMultiInputTokensShouldMatch(sId, aTexts));
		},
		theValueHelpDialogTokensShouldMatch: function (sId, aTexts) {
			return this.waitFor(__theValueHelpDialogTokensShouldMatch(sId, aTexts));
		},
		theFilterValueStateShouldMatch: function (sId, sValueState) {
			return this.waitFor(__theFilterValueStateShouldMatch(sId, sValueState));
		},
		theParameterShouldMatch: function (sParameterValue, sErrorMessage) {
			return this.waitFor(__theParameterShouldMatch(sParameterValue, sErrorMessage));
		},
		iShouldSeeSmartFieldFiredEvent: function (sId, sEventId) {
			return this.waitFor(__iShouldSeeSmartFieldFiredEvent(sId, sEventId));
		},
		iShouldSeeAFilterControl: function (sId, bRendered) {
			return this.waitFor(__iShouldSeeAFilterControl(sId, bRendered));
		},
		iShouldSeeFiltersWithValues: function (sId, aFilterNames) {
			return this.waitFor(__iShouldSeeFiltersWithValues(sId, aFilterNames));
		},
		filtersGroupShouldHaveFilters: function (sGroupName, nFilterCount) {
			return this.waitFor(__filtersGroupShouldHaveFilters(sGroupName, nFilterCount));
		},
		theSelectShouldHaveSelectedItemWithKeyAndText: function (sKey, sText, bSearchOpenDialogs) {
			return this.waitFor(__theSelectShouldHaveSelectedItemWithKeyAndText(sKey, sText, bSearchOpenDialogs));
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
		}
	};
});
