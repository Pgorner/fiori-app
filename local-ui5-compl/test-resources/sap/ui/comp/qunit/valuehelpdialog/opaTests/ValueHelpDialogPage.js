sap.ui.define([
	"sap/ui/test/Opa5",
	"test-resources/sap/ui/comp/testutils/opa/TestUtils",
	"test-resources/sap/ui/comp/testutils/opa/valuehelpdialog/Actions",
	"test-resources/sap/ui/comp/testutils/opa/valuehelpdialog/Assertions"
], function(
	Opa5,
	TestUtils,
	ValueHelpDialogActions,
	ValueHelpDialogAssertions
) {
	"use strict";

	Opa5.extendConfig({
		autoWait: true,
		testLibs: {
			compTestLibrary: {
				namespace: "test.sap.ui.comp.valuehelpdialog",
				viewName: "ValueHelpDialog",
				appUrl:
					"test-resources/sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/ValueHelpDialog.html"
			}
		}
	});

	Opa5.createPageObjects({
		onTheValueHelpDialogPage: {
			actions: {
				iOpenValueHelpDialogForInput: function(sInputId) {
					return ValueHelpDialogActions.iOpenValueHelpDialogForInput.call(this, sInputId);
				},
				iCloseValueHelpDialogForInput: function(sInputId) {
					return ValueHelpDialogActions.iCloseValueHelpDialogForInput.call(this, sInputId);
				},
				iOpenTabSearchAndSelect: function() {
					return ValueHelpDialogActions.iOpenTabSearchAndSelect.call(this);
				},
				iOpenTabDefineConditions: function() {
					return ValueHelpDialogActions.iOpenTabDefineConditions.call(this);
				},
				iPressValueHelpDialogOKButton: function(sInputId) {
					return ValueHelpDialogActions.iPressValueHelpDialogOKButton.call(this, sInputId);
				},
				iPressValueHelpDialogCancelButton: function(sInputId) {
					return ValueHelpDialogActions.iPressValueHelpDialogCancelButton.call(this, sInputId);
				},
				iPressBackButton: function() {
					return ValueHelpDialogActions.iPressBackButton.call(this);
				},
				iAddNewCondition: function() {
					return ValueHelpDialogActions.iAddNewCondition.call(this);
				},
				iRemoveConditionAtIndex: function(nIndex) {
					return ValueHelpDialogActions.iRemoveConditionAtIndex.call(this, nIndex);
				},
				iOpenConditionOperations: function(nIndex) {
					return ValueHelpDialogActions.iOpenConditionOperations.call(this, nIndex);
				},
				iSelectConditionOperator: function(nIndex, sOperationKey) {
					return ValueHelpDialogActions.iSelectConditionOperator.call(this, nIndex, sOperationKey);
				},
				iEnterConditionValues: function(nIndex, sValue1, sValue2) {
					return ValueHelpDialogActions.iEnterConditionValues.call(this, nIndex, sValue1, sValue2);
				},
				iEnterSearchText: function(sText) {
					return ValueHelpDialogActions.iEnterSearchText.call(this, sText);
				},
				iOpenAdvancedSearch: function() {
					return ValueHelpDialogActions.iOpenAdvancedSearch.call(this);
				},
				iPressGoButton: function() {
					return ValueHelpDialogActions.iPressGoButton.call(this);
				},
				iSubmitSearch: function() {
					return ValueHelpDialogActions.iSubmitSearch.call(this);
				},
				iSearchByText: function(sText) {
					ValueHelpDialogActions.iEnterSearchText.call(this, sText);
					ValueHelpDialogActions.iSubmitSearch.call(this);
				},
				iPressShowFiltersButton: function() {
					return ValueHelpDialogActions.iPressShowFiltersButton.call(this);
				},
				iPressHideFiltersButton: function() {
					return ValueHelpDialogActions.iPressHideFiltersButton.call(this);
				},
				iShowFilters: function() {
					return TestUtils.isPhone() ?
						ValueHelpDialogActions.iOpenAdvancedSearch.call(this) :
						ValueHelpDialogActions.iPressShowFiltersButton.call(this);
				},
				iHideFilters: function() {
					return TestUtils.isPhone() ?
						ValueHelpDialogActions.iPressGoButton.call(this) :
						ValueHelpDialogActions.iPressHideFiltersButton.call(this);
				},
				iShowAllFilters: function() {
					return ValueHelpDialogActions.iShowAllFilters.call(this);
				},
				iSearchByFilterIdAndValue: function(sFilterId, sValue) {
					return ValueHelpDialogActions.iSearchByFilterIdAndValue.call(this, sFilterId, sValue);
				},
				iSearchByFilterNameAndValue: function(sFilterName, sValue) {
					return ValueHelpDialogActions.iSearchByFilterNameAndValue.call(this, sFilterName, sValue);
				},
				iSearchByFilterIndexAndValue: function(nIndex, sValue) {
					return ValueHelpDialogActions.iSearchByFilterIndexAndValue.call(this, nIndex, sValue);
				},
				iSelectItemByIndex: function(nIndex) {
					return ValueHelpDialogActions.iSelectItemByIndex.call(this, nIndex);
				},
				iSelectItemsByRange: function(iStartIndex, iEndIndex) {
					return ValueHelpDialogActions.iSelectItemsByRange.call(this, iStartIndex, iEndIndex);
				},
				iDeselectItemByIndex: function(nIndex) {
					return ValueHelpDialogActions.iDeselectItemByIndex.call(this, nIndex);
				},
				iSelectAllItems: function() {
					return ValueHelpDialogActions.iSelectAllItems.call(this);
				},
				iDeselectAllItems: function() {
					return ValueHelpDialogActions.iDeselectAllItems.call(this);
				},
				iRemoveFilterTokensByFilterIndex: function(nIndex) {
					return ValueHelpDialogActions.iRemoveFilterTokensByFilterIndex.call(this, nIndex);
				},
				iPressColumnHeader: function(sTableId, iColumnIndex) {
					return ValueHelpDialogActions.iPressColumnHeader.call(this, sTableId, iColumnIndex);
				}
			},
			assertions: {
				iCheckValueHelpDialogIsOpenedForInput: function(sInputId) {
					return ValueHelpDialogAssertions.iCheckValueHelpDialogIsOpened.call(this, sInputId);
				},
				iCheckValueHelpDialogIsNotOpenedForInput: function(sInputId) {
					return ValueHelpDialogAssertions.iCheckValueHelpDialogIsNotOpened.call(this, sInputId);
				},
				iCheckConditionsCountEqualTo: function(nCount) {
					return ValueHelpDialogAssertions.iCheckConditionsCountEqualTo.call(this, nCount);
				},
				iCheckConditionsOperatorAtPositionIsMatching: function(
					nIndex,
					sOperatorKey
				) {
					return ValueHelpDialogAssertions.iCheckConditionsOperatorAtPositionIsMatching.call(this, nIndex, sOperatorKey);
				},
				iCheckConditionsValuesAtPositionEqualTo: function(
					nIndex,
					sValue1,
					sValue2
				) {
					return ValueHelpDialogAssertions.iCheckConditionsValuesAtPositionEqualTo.call(this, nIndex, sValue1, sValue2);
				},
				iCheckConditionsTabTitleContainsCount: function(nCount) {
					return ValueHelpDialogAssertions.iCheckConditionsTabTitleContainsCount.call(this, nCount);
				},
				iCheckFilterBarDisplaysAllFilters: function() {
					return ValueHelpDialogAssertions.iCheckFilterBarDisplaysAllFilters.call(this);
				},
				iCheckFilterBarDisplaysNFilters: function(nCount) {
					return ValueHelpDialogAssertions.iCheckFilterBarDisplaysNFilters.call(this, nCount);
				},
				iCheckFilterBarHasFilterWithLabel: function(sFilterLabel) {
					return ValueHelpDialogAssertions.iCheckFilterBarHasFilterWithLabel.call(this, sFilterLabel);
				},
				iCheckFilterBarHasFilterByName: function(sFilterName) {
					return ValueHelpDialogAssertions.iCheckFilterBarHasFilterByName.call(this, sFilterName);
				},
				iCheckFilterBarIsExpanded: function() {
					return ValueHelpDialogAssertions.iCheckValuHelpDialogFiltersAreExpanded.call(this);
				},
				iCheckFilterBarIsCollapsed: function() {
					return ValueHelpDialogAssertions.iCheckValuHelpDialogFiltersAreCollapsed.call(this);
				},
				iCheckItemsCountEqualTo: function(nCount) {
					return ValueHelpDialogAssertions.iCheckItemsCountEqualTo.call(this, nCount);
				},
				iCheckItemIsSelected: function(nIndex) {
					return ValueHelpDialogAssertions.iCheckItemIsSelected.call(this, nIndex);
				},
				iCheckItemIsNotSelected: function(nIndex) {
					return ValueHelpDialogAssertions.iCheckItemIsNotSelected.call(this, nIndex);
				},
				iCheckSearchAndSelectTabTitleContainsCount: function(nCount) {
					return ValueHelpDialogAssertions.iCheckSearchAndSelectTabTitleContainsCount.call(this, nCount);
				},
				iCheckColumnIsSorted: function(sColumnName, bExpectSorted) {
					return this.waitFor({
						controlType: "sap.ui.table.Column",
						properties: {
							sortProperty: sColumnName
						},
						errorMessage: "No columns with name '" + sColumnName + "' were found.",
						success: function(aColumns) {
							var sMessage = "Column '" + sColumnName + "' should be sorted";
							if (!bExpectSorted) {
								sMessage = "Column '" + sColumnName + "' should NOT be sorted";
							}

							var bActualSorted = aColumns[0].getSortOrder() !== "None";

							/** @deprecated As of version 1.120 */
							if (!aColumns[0].getSorted()) {
								bActualSorted = false;
							}

							Opa5.assert.equal(bActualSorted, bExpectSorted, sMessage);
						}
					});
				},
				theColumnMenuShouldOpen: function() {
					return ValueHelpDialogAssertions.theColumnMenuShouldOpen.call(this);
				},
				theColumnMenuShouldNotOpen: function() {
					return ValueHelpDialogAssertions.theColumnMenuShouldNotOpen.call(this);
				},
				iCheckColumnMenuCustomQuickActions: function(sColumnName, iItems) {
					return this.waitFor({
						controlType: "sap.ui.table.Column",
						properties: {
							sortProperty: sColumnName
						},
						errorMessage: "No columns with name '" + sColumnName + "' were found.",
						success: function(aColumns) {
							var sMessage = "Column '" + sColumnName + "' custom quick actions' number is correct";

							Opa5.assert.equal(aColumns[0].getHeaderMenuInstance().getQuickActions()[0].getItems().length, iItems, sMessage);
						}
					});
				},
				iCheckColumnMenuDefaultQuickAction: function(sColumnName, bIsVisible) {
					return this.waitFor({
						controlType: "sap.ui.table.Column",
						properties: {
							sortProperty: sColumnName
						},
						errorMessage: "No columns with name '" + sColumnName + "' were found.",
						success: function(aColumns) {
							var oContainer = aColumns[0].getHeaderMenuInstance().getAggregation("_quickActions")[0].getEffectiveQuickActions(),
								sMessage = "Column '" + sColumnName + "' items number is correct";

							if (oContainer.length) {
								Opa5.assert.equal(oContainer[0].getVisible(), bIsVisible, sMessage);
							}
						}
					});
				},
				iCheckColumnMenuItemLabel: function(sColumnName, iIndex, sLabel) {
					return this.waitFor({
						controlType: "sap.ui.table.Column",
						properties: {
							sortProperty: sColumnName
						},
						errorMessage: "No columns with name '" + sColumnName + "' were found.",
						success: function(aColumns) {
							var sMessage = "ColumnMenu item with index " + iIndex + " has correct label";

							Opa5.assert.equal(aColumns[0].getHeaderMenuInstance().getAggregation("quickActions")[0].getEffectiveQuickActions()[iIndex].getLabel(), "Sort By: " + sLabel, sMessage);
						}
					});
				}
			}
		}
	});
});
