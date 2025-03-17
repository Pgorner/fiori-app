sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Descendant",
	"sap/m/library",
	"sap/ui/test/OpaBuilder"
], function(
	Opa5,
	Press,
	EnterText,
	PropertyStrictEquals,
	Descendant,
	mobileLibrary,
	OpaBuilder
	){
	"use strict";

    var ButtonType = mobileLibrary.ButtonType,
		oRB = Opa5.getWindow().sap.ui.require("sap/ui/test/OpaPlugin")?.getLibraryResourceBundle("sap.ui.comp");

	function __iPressTheAdaptFiltersShowValuesButton() {
		return {
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			actions: new Press(),
			matchers: new PropertyStrictEquals({
				name: "text",
				value: "Show Values"
			})
		};
	}
	function __iPressTheAdaptFiltersCancelButton() {
		return {
			id: "smartFilterBar-adapt-filters-dialog-cancelBtn",
			searchOpenDialogs: true,
			actions: new Press()
		};
	}
	function __iPressTheAdaptFiltersOKButton() {
		return {
			id: "smartFilterBar-adapt-filters-dialog-confirmBtn",
			searchOpenDialogs: true,
			actions: new Press()
		};
	}
	function __iPressTheAdaptFiltersGoButton() {
		return {
			id: "smartFilterBar-btnGoFilterDialog",
			searchOpenDialogs: true,
			actions: new Press()
		};
	}
	function __iPressTheRestoreButton() {
		return {
			id: "smartFilterBar-btnRestore",
			controlType: "sap.m.Button",
			actions: new Press(),
			errorMessage: "Did not find the restore button"
		};
	}
	function __iPressTheErrorDialogCloseButton() {
		return {
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true,
			matchers: new PropertyStrictEquals({
				name: "text",
				value: "Close"
			})
		};
	}
	function __iPressTheFilterGoButton() {
		return {
			id: "smartFilterBar-btnGo",
			controlType: "sap.m.Button",
			actions: new Press(),
			errorMessage: "Did not find the button 'Go'"
		};
	}
	function __iPressSearchFieldIconButton(sId) {
		return {
			id: sId,
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		};
	}
	function __iPressValueHelpIcon(sFieldID) {
		return {
			id: sFieldID,
			controlType: "sap.ui.core.Icon",
			actions: new Press(),
			errorMessage: "Did not find the Value help with ID" + sFieldID
		};
	}
	function __iPressTheSetfilterDataAsStringButton() {
		return {
			id: "__xmlview0--setfilterDataAsString",
			actions: new Press()
		};
	}
	function __iEnterStringInFiled(sFieldID, sString, sErrorMessage, bKeepFocus) {
		return {
			id: sFieldID,
			actions: new EnterText({
				text: sString,
				keepFocus: !!bKeepFocus
			}),
			errorMessage: sErrorMessage ? sErrorMessage : "Did not find the field"
		};
	}
	//TODO: check usage of __iNavigateToTheDefineConditionsTab if you reuse these actions as there was change due to unstable test
	function __iNavigateToTheDefineConditionsTab() {
		return {
			controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
			success: function (aDialogs) {
				aDialogs[0]._updateView("DESKTOP_CONDITIONS_VIEW");
			}
		};
	}
	function __iSelectOperation(sOperation, bExclude) {
		return {
			controlType: "sap.m.ComboBox",
			success: function (aControls) {
				// First control should be the include operations select and second the exclude
				aControls[bExclude ? 1 : 0].setSelectedKey(sOperation).fireEvent("change");
			},
			searchOpenDialogs: true
		};
	}
	function __iPressTheVHDOKButton() {
		return {
			controlType: "sap.m.Button",
			matchers: function (oControl) {
				return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.getType() === ButtonType.Emphasized;
			},
			actions: new Press(),
			searchOpenDialogs: true
		};
	}
	function __iPressTheVHDCancelButton() {
		return {
			controlType: "sap.m.Button",
			matchers: function (oControl) {
				return oControl.getText() === oRB.getText("VALUEHELPDLG_CANCEL");
			},
			actions: new Press(),
			searchOpenDialogs: true
		};
	}
	function __iOpenTheVHD(sControlID) {
		return {
			id: sControlID + "-vhi",
			controlType: "sap.ui.core.Icon",
			actions: new Press()
		};
	}
	function __iPressTheVHDOK(sControlID) {
		return {
			id: sControlID + "-valueHelpDialog-ok",
			controlType: "sap.m.Button",
			actions: new Press()
		};
	}
	function __iSelectRowsFromVHD(sControlID, aTexts) {
		return {
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
		};
	}
	function __iOpenTheDropdown() {
		return {
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
		};
	}
	function __iChangeTheCondition(sNewCondition, bExclude, iCondition) {
		return {
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
		};
	}
	function __iEnterTextInConditionField(bExclude, iCondition, sText1, sText2) {
		return {
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
		};
	}
	function __iPressButtonWithIcon(sIconName) {
		return {
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			matchers: new PropertyStrictEquals({
				name: "icon",
				value: sIconName
			}),
			success: function(aButtons) {
				new Press().executeOn(aButtons[0]);
			}
		};
	}
	function __iPressTheFilterAddButton() {
		return {
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
		};
	}
	function __iPressTheFiltersRemoveAllButton() {
		return {
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
		};
	}
	function __iOpenTheAdaptFiltersDialog() {
		return {
			controlType: "sap.m.Button",
			id: "smartFilterBar-btnFilters",
			actions: new Press()
		};
	}
	function __iSwitchAdaptFiltersToGroupView() {
		return {
			controlType: "sap.m.Button",
			matchers: new PropertyStrictEquals({
				name: "icon",
				value: "sap-icon://group-2"
			}),
			actions: new Press()
		};
	}
	function __iExpandAdaptFiltersGroup(sGroupName) {
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
			success: function (oPanel) {
				var oExpandButton = oPanel[0].getDependents()[0],
					oPress = new Press();

					// Act
					oPress.executeOn(oExpandButton);

					// Cleanup
					oPress.destroy();
			}
		};
	}
	function __iExpandVHDFilters(sControlID) {
		return {
			controlType: "sap.m.Button",
			id: sControlID + "-valueHelpDialog-smartFilterBar-btnShowHide",
			searchOpenDialogs: true,
			actions: new Press()
		};
	}
	function __iToggleTheShortButton() {
		return {
			id: "__xmlview0--shortMode",
			actions: new Press()
		};
	}
	function __iSelectItemFromComboBox(sId, sItemText) {
		return {
			id: sId,
			controlType: "sap.ui.comp.odata.ComboBox",
			success: function (oControl) {
				var aItems = oControl.getItems(),
					oSelectedItem = aItems.find(function(oItem){
						return oItem.getText() === sItemText;
					});

				oControl.setSelectedItem(oSelectedItem);
			}
		};
	}
	function __iSelectItemsFromMultiComboBox(sId, aItemTexts) {
		return {
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
		};
	}
	function __setModelDefaultCountModeToNone() {
		return {
			controlType: "sap.m.Button",
			id: "__xmlview0--changeModelDefaultCountMode",
			actions: new Press(),
			matchers: new PropertyStrictEquals({
				name: "text",
				value: "Change Model defaultCountMode to None"
			})
		};
	}
	function __setModelDefaultCountModeToRequest() {
		return {
			controlType: "sap.m.Button",
			id: "__xmlview0--changeModelDefaultCountModeRequest",
			actions: new Press(),
			matchers: new PropertyStrictEquals({
				name: "text",
				value: "Change Model defaultCountMode to Request"
			})
		};
	}
	function __iSetFilterData(sId, oFilterData) {
		return {
			controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
			id: sId,
			success: function (oSmartFilterBar) {
				oSmartFilterBar.setFilterData(oFilterData);
			}
		};
	}
	function __iChangeFilterVisibility(sId) {
		return {
			controlType: "sap.m.CustomListItem",
			matchers: new Descendant(sId, true),
			searchOpenDialogs: true,
			actions: new Press()
		};
	}

	return {
		iPressTheAdaptFiltersShowValuesButton: function () {
			return this.waitFor(__iPressTheAdaptFiltersShowValuesButton());
		},
		iPressTheAdaptFiltersCancelButton: function () {
			return this.waitFor(__iPressTheAdaptFiltersCancelButton());
		},
		iPressTheAdaptFiltersOKButton: function () {
			return this.waitFor(__iPressTheAdaptFiltersOKButton());
		},
		iPressTheAdaptFiltersGoButton: function () {
			return this.waitFor(__iPressTheAdaptFiltersGoButton());
		},
		iPressTheRestoreButton: function () {
			return this.waitFor(__iPressTheRestoreButton());
		},
		iPressTheErrorDialogCloseButton: function () {
			return this.waitFor(__iPressTheErrorDialogCloseButton());
		},
		iPressTheFilterGoButton: function () {
			return this.waitFor(__iPressTheFilterGoButton());
		},
		iPressSearchFieldIconButton: function (sId) {
			return this.waitFor(__iPressSearchFieldIconButton(sId));
		},
		iPressValueHelpIcon: function (sFieldID) {
			return this.waitFor(__iPressValueHelpIcon(sFieldID));
		},
		iPressTheSetfilterDataAsStringButton: function () {
			return this.waitFor(__iPressTheSetfilterDataAsStringButton());
		},
		iEnterStringInFiled: function (sFieldID, sString, sErrorMessage, bKeepFocus) {
			return this.waitFor(__iEnterStringInFiled(sFieldID, sString, sErrorMessage, bKeepFocus));
		},
		iNavigateToTheDefineConditionsTab: function () {
			return this.waitFor(__iNavigateToTheDefineConditionsTab());
		},
		iSelectOperation: function (sOperation, bExclude) {
			return this.waitFor(__iSelectOperation(sOperation, bExclude));
		},
		iPressTheVHDOKButton: function () {
			return this.waitFor(__iPressTheVHDOKButton());
		},
		iPressTheVHDCancelButton: function () {
			return this.waitFor(__iPressTheVHDCancelButton());
		},
		iOpenTheVHD: function (sControlID) {
			return this.waitFor(__iOpenTheVHD(sControlID));
		},
		iPressTheVHDOK: function (sControlID) {
			return this.waitFor(__iPressTheVHDOK(sControlID));
		},
		iSelectRowsFromVHD: function(sControlID, aTexts) {
			return this.waitFor(__iSelectRowsFromVHD(sControlID, aTexts));
		},
		iOpenTheDropdown: function () {
			return this.waitFor(__iOpenTheDropdown());
		},
		iChangeTheCondition: function (sNewCondition, bExclude, iCondition) {
			if (iCondition === undefined) {
				iCondition = 0;
			}

			return this.waitFor(__iChangeTheCondition(sNewCondition, bExclude, iCondition));
		},
		iEnterTextInConditionField: function (bExclude, iCondition, sText1, sText2) {
			if (iCondition === undefined) {
				iCondition = 0;
			}

			return this.waitFor(__iEnterTextInConditionField(bExclude, iCondition, sText1, sText2));
		},
		iPressButtonWithIcon: function(sIconName) {
			return this.waitFor(__iPressButtonWithIcon(sIconName));
		},
		iPressTheFilterAddButton: function () {
			return this.waitFor(__iPressTheFilterAddButton());
		},
		iPressTheFiltersRemoveAllButton : function () {
			return this.waitFor(__iPressTheFiltersRemoveAllButton());
		},
		iOpenTheAdaptFiltersDialog: function () {
			return this.waitFor(__iOpenTheAdaptFiltersDialog());
		},
		iSwitchAdaptFiltersToGroupView: function () {
			return this.waitFor(__iSwitchAdaptFiltersToGroupView());
		},
		iExpandAdaptFiltersGroup: function (sGroupName) {
			return this.waitFor(__iExpandAdaptFiltersGroup(sGroupName));
		},
		iExpandVHDFilters: function (sControlID) {
			return this.waitFor(__iExpandVHDFilters(sControlID));
		},
		iToggleTheShortButton: function () {
			return this.waitFor(__iToggleTheShortButton());
		},
		iSelectItemFromComboBox: function (sId, sItemText) {
			return this.waitFor(__iSelectItemFromComboBox(sId, sItemText));
		},
		iSelectItemsFromMultiComboBox: function (sId, aItemTexts) {
			return this.waitFor(__iSelectItemsFromMultiComboBox(sId, aItemTexts));
		},
		setModelDefaultCountModeToNone: function () {
			return this.waitFor(__setModelDefaultCountModeToNone());
		},
		setModelDefaultCountModeToRequest: function () {
			return this.waitFor(__setModelDefaultCountModeToRequest());
		},
		iSetFilterData: function (sId, oFilterData) {
			return this.waitFor(__iSetFilterData(sId, oFilterData));
		},
		iChangeFilterVisibility: function (sId) {
			return this.waitFor(__iChangeFilterVisibility(sId));
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
	};
});
