sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Util",
	"sap/ui/test/matchers/Descendant",
	"sap/ui/core/date/UniversalDateUtils",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/DateStorage",
	"sap/ui/comp/qunit/personalization/opaTests/modules/waitForNavigationControl",
	"sap/ui/comp/qunit/personalization/opaTests/modules/waitForP13nDialog"
], function(
	Library,
	Opa5,
	Press,
	EnterText,
	Ancestor,
	Properties,
	PropertyStrictEquals,
	TestUtil,
	Descendant,
	UniversalDateUtils,
	DateStorage,
	waitForNavigationControl,
	waitForP13nDialog
	 ) {
	"use strict";
	var oMResourceBundle = Library.getResourceBundleFor("sap.m");

	function __iPressButton(sId) {
		return {
			id: sId,
			controlType: "sap.m.Button",
			actions: new Press(),
			errorMessage: "Did not find the button with ID " + sId
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
	function __iPressTheSetFilterDataAsStringButton() {
		return {
			id: "__xmlview0--setfilterDataAsString",
			actions: new Press()
		};
	}

	function __iPressTheSetUiStateWithNoSemanticDateButton() {
		return {
			id: "__xmlview0--setUiStateNoSemanticDates",
			actions: new Press()
		};
	}
	function __iOpenTheVHD(sControlID) {
		return {
			id: sControlID + "-vhi",
			controlType: "sap.ui.core.Icon",
			actions: new Press()
		};
	}
	function __iOpenTheVHDPerso(sControlID) {
		return {
			id: sControlID + "-vhi",
			searchOpenDialogs: true,
			controlType: "sap.ui.core.Icon",
			actions: new Press()
		};
	}
	function __iSelectDateOperation(sText) {
		return {
			controlType: "sap.m.Popover",
			searchOpenDialogs: true,
			success: function (aPopovers) {
				var i, oItem,
					oPopover = aPopovers[0],
					aItems = oPopover.getContent()[0] &&
						oPopover.getContent()[0].getPages()[0] &&
						oPopover.getContent()[0].getPages()[0].getContent()[0].getItems();
				for (i = 0; i < aItems.length; i++) {
					oItem = aItems[i];
					if (oItem.getMetadata().getName() === "sap.m.DynamicDateRangeListItem" && oItem.getTitle() === sText){
						oItem.setSelected(true, true);
						return new Press().executeOn(oItem);
					}
				}

				oPopover.close();

			}
		};
	}
	function __iSelectDateOperationByKey(sText) {
		return {
			controlType: "sap.m.Popover",
			searchOpenDialogs: true,
			success: function (aPopovers) {
				var i, oItem,
					oPopover = aPopovers[0],
					aItems = oPopover.getContent()[0] &&
						oPopover.getContent()[0].getPages()[0] &&
						oPopover.getContent()[0].getPages()[0].getContent()[0].getItems();
				for (i = 0; i < aItems.length; i++) {
					oItem = aItems[i];
					if (oItem.getMetadata().getName() === "sap.m.DynamicDateRangeListItem" && oItem.getOptionKey() === sText){
						oItem.setSelected(true, true);
						return new Press().executeOn(oItem);
					}
				}

				oPopover.close();
			}
		};
	}
	function __iSetValueToSelectedOperation(aValues, sOperation) {
		return {
			controlType: "sap.m.Popover",
			searchOpenDialogs: true,
			success: function (aPopovers) {
				var i, oItem,
					oPopover = aPopovers[0],
					aItems = oPopover.getContent()[0] &&
						oPopover.getContent()[0].getPages()[1] &&
						oPopover.getContent()[0].getPages()[1].getContent();
				for (i = 0; i < aItems.length; i++) {
					oItem = aItems[i];
					if (oItem.isA("sap.m.Label")) {
						continue;
					}
					//Value for X
					if (oItem.isA("sap.m.StepInput")) {
						oItem.setValue(aValues.shift());
						if (aValues.length === 0) {
							if (sOperation !== undefined) {
								switch (sOperation) {
									case "NEXTMINUTES":
										DateStorage.setNextMinutes(sOperation, 10);
										break;
									case "LASTMINUTES":
										DateStorage.setLastMinutes(sOperation, 10);
										break;
									case "LASTMINUTESINCLUDED":
										DateStorage.setLastMinutesIncluded(sOperation, 10);
										break;
									case "LASTHOURSINCLUDED":
										DateStorage.setLastHoursIncluded(sOperation, 10);
										break;
									case "NEXTMINUTESINCLUDED":
										DateStorage.setNextMinutesIncluded(sOperation, 10);
										break;
									case "NEXTHOURSINCLUDED":
										DateStorage.setNextHoursIncluded(sOperation, 10);
										break;
									default:
										break;
								}
							}
						}
					}
					//Unit of Time
					if (oItem.isA("sap.m.Select")) {
						if (sOperation !== undefined) {
							switch (sOperation) {
								case "NEXTMINUTES":
								case "LASTMINUTES":
								case "LASTMINUTESINCLUDED":
								case "NEXTMINUTESINCLUDED":
									oItem.setSelectedKey("MINUTES");
									break;
								case "LASTHOURS":
								case "LASTHOURSINCLUDED":
								case "NEXTHOURS":
								case "NEXTHOURSINCLUDED":
									oItem.setSelectedKey("HOURS");
									break;
								case "LASTDAYS":
								case "LASTDAYSINCLUDED":
								case "NEXTDAYS":
								case "NEXTDAYSINCLUDED":
									oItem.setSelectedKey("DAYS");
									break;
								case "LASTWEEKS":
								case "LASTWEEKSINCLUDED":
								case "NEXTWEEKS":
								case "NEXTWEEKSINCLUDED":
									oItem.setSelectedKey("WEEKS");
									break;
								case "LASTMONTHS":
								case "LASTMONTHSINCLUDED":
								case "NEXTMONTHS":
								case "NEXTMONTHSINCLUDED":
									oItem.setSelectedKey("MONTHS");
									break;
								case "LASTQUARTERS":
								case "LASTQUARTERSINCLUDED":
								case "NEXTQUARTERS":
								case "NEXTQUARTERSINCLUDED":
									oItem.setSelectedKey("QUARTERS");
									break;
								case "LASTYEARS":
								case "LASTYEARSINCLUDED":
								case "NEXTYEARS":
								case "NEXTYEARSINCLUDED":
									oItem.setSelectedKey("YEARS");
									break;
								default:
									break;
							}
						}
					}
					//Time Period
					if (oItem.isA("sap.m.VBox")) {
						var oInnerItems = oItem?.getItems();
						if (oInnerItems.length === 4 &&  oInnerItems[0].isA("sap.m.RadioButton") && oInnerItems[2].isA("sap.m.RadioButton")) {
							if (sOperation.indexOf("INCLUDED") !== -1) {
								oInnerItems[2].setSelected(true);
								oInnerItems[0].setSelected(false);
							} else {
								oInnerItems[0].setSelected(true);
								oInnerItems[2].setSelected(false);
							}
						}
					}
				}
			}
		};
	}
	function __iEnterValue(sControlID, sValue, bKeepFocus) {
		return {
			id: sControlID,
			actions: new EnterText({
				text: sValue,
				keepFocus: !!bKeepFocus
			})
		};
	}
	function __iEnterValuePerso(sControlID, sValue, bKeepFocus) {
		return {
			id: sControlID,
			searchOpenDialogs: true,
			actions: new EnterText({
				text: sValue,
				keepFocus: !!bKeepFocus
			})
		};
	}
	function __iClickShowAll() {
		return {
			controlType: "sap.m.Button",
			searchOpenDialogs: false,
			matchers: new PropertyStrictEquals({
				name: "text",
				value: "Show All Filters"
			}),
			actions: new Press()
		};
	}
	function __iClickApply() {
		return {
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			matchers: new PropertyStrictEquals({
				name: "text",
				value: oMResourceBundle.getText("DYNAMIC_DATE_RANGE_CONFIRM")
			}),
			actions: new Press()
		};
	}
	function __iClickCancel(sControlID, sText) {
		return this.waitFor({
			id: sControlID,
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			matchers: new PropertyStrictEquals({
				name: "text",
				value: oMResourceBundle.getText("DYNAMIC_DATE_RANGE_CANCEL")
			}),
			actions: new Press()
		});
	}
	function __iExpandVHDFilters(sControlID){
		return {
			controlType: "sap.m.Dialog",
			searchOpenDialogs: true,
			check: function (aDialogs) {
				return !!aDialogs.length;
			},
			success: function (aDialogs) {
				Opa5.assert.equal(aDialogs.length, 1, "ValueHelpDialog found");
				this.waitFor({
					controlType: "sap.m.Button",
					matchers: new PropertyStrictEquals({
						name: "id",
						value: sControlID + "-valueHelpDialog-smartFilterBar-btnShowHide"
					}),
					success: function (aButtons) {
						Opa5.assert.equal(aButtons.length, 1, "'Show Filters' button found");
					},
					errorMessage: "Cannot find a 'Show Filters' button in the ValueHelpDialog",
					actions: new Press()
				});
			},
			errorMessage: "Cannot find a ValueHelpDialog"
		};
	}
	function __iSelectAnItemFromSuggestions(sID,sText, iIndex) {
		return {
			id: sID,
			success: function () {
				this.iOpenSuggestions(sID, sText, true);
				this.iSelectAnItemFromTheSuggest(iIndex);
			}
		};
	}
	function __iOpenSuggestions(sID, sText) {
		return {
			id: sID,
			actions: new EnterText({ text: sText, keepFocus: true })
		};
	}
	function __iSelectAnItemFromTheSuggest(iIndex) {
		return {
			controlType: "sap.m.StandardListItem",
			searchOpenDialogs: true,
			success: function (aColumns) {
				new Press().executeOn(aColumns[iIndex]);
			}
		};
	}
	function __iSaveVariantAs(sVariantNameOld, sVariantNameNew) {
		return {
			controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
			check: function (aVariantManagements) {
				return !!aVariantManagements.length;
			},
			actions: new Press(),
			success: function (aVariantManagements) {
				Opa5.assert.equal(aVariantManagements.length, 1, "VariantManagement found");
				this.waitFor({
					controlType: "sap.m.Button",
					matchers: new PropertyStrictEquals({
						name: "text",
						value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVEAS")
					}),
					actions: new Press(),
					success: function (aButtons) {
						Opa5.assert.equal(aButtons.length, 1, "'Save As' button found");
						this.waitFor({
							controlType: "sap.m.Input",
							matchers: new PropertyStrictEquals({
								name: "value",
								value: sVariantNameOld
							}),
							actions: new EnterText({
								text: sVariantNameNew
							}),
							success: function (aInputs) {
								Opa5.assert.ok(aInputs[0].getValue() === sVariantNameNew, "Input value is set to '" + sVariantNameNew + "'");
								this.waitFor({
									controlType: "sap.m.Button",
									matchers: new PropertyStrictEquals({
										name: "text",
										value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVE")
									}),
									actions: new Press(),
									success: function (aButtons) {
										Opa5.assert.equal(aButtons.length, 1, "'OK' button found");
									}
								});
							}
						});
					},
					errorMessage: "Cannot find 'Save As' button on VariantManagement"
				});
			},
			errorMessage: "Could not find VariantManagement"
		};
	}
	function __iSelectDefaultVariant(sVariant){
		return {
			controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
			actions: new Press(),
			success: function(aVM){
				this.waitFor({
					controlType: "sap.m.Button",
					matchers: new PropertyStrictEquals({
						name: "text",
						value: "Manage"
					}),
					actions: new Press(),
					success: function(){
						this.waitFor({
							controlType: "sap.m.Input",
							matchers: new PropertyStrictEquals({
								name: "value",
								value: sVariant
							}),
							success: function(aInput){
								this.waitFor({
									controlType: "sap.m.ColumnListItem",
									matchers: new Descendant(aInput[0]),
									success: function(aColumnListItem){
										this.waitFor({
											controlType: "sap.m.RadioButton",
											matchers: new Ancestor(aColumnListItem[0]),
											actions: new Press(),
											success: function(aBtn){
												this.waitFor({
													searchOpenDialogs: true,
													controlType: "sap.m.Button",
													matchers: new PropertyStrictEquals({
														name: "text",
														value: "Save",
														actions: new Press()
													}),
													actions: new Press()
												});
											}
										});
									}
								});
							}
						});
					}
				});
			}
		};
	}
	function __iSelectVariant(sVariantName) {
		return {
			controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
			check: function (aVariantManagements) {
				return !!aVariantManagements.length;
			},
			actions: new Press(),
			success: function (aVariantManagements) {
				Opa5.assert.equal(aVariantManagements.length, 1, "VariantManagement found");
				this.waitFor({
					controlType: "sap.ui.core.Item",
					matchers: [
						new Ancestor(aVariantManagements[0]), new Properties({
							text: sVariantName
						})
					],
					actions: new Press(),
					errorMessage: "Cannot select '" + sVariantName + "' from VariantManagement"
				});
			},
			errorMessage: "Could not find VariantManagement"
		};
	}
	function __iSetFilterOperation(sId, sOperation) {
		return {
			id: "smartFilterBar",
			controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
			success: function (oSmartFilterBar) {
				oSmartFilterBar.setDateRangeTypeOperationByKey(sId, sOperation);
			}
		};
	}
	function _iPressAdaptFiletrsDialogButton() {
		return {
			id: "smartFilterBar-btnFilters",
			controlType: "sap.m.Button",
			actions: new Press(),
			errorMessage: "Did not find the adapt filters button"

		};
	}
	function _iPressTheAdaptFiltersShowValuesButton() {
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
	function _iResetAdaptFiltersDialog() {
		return {
			searchOpenDialogs: true,
			controlType: "sap.m.Button",
			matchers: new PropertyStrictEquals({
				name: "text",
				value: "Reset"
			}),
			actions: new Press(),
			success: function () {
				this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Button",
					matchers: new PropertyStrictEquals({
						name: "text",
						value: "OK"
					}),
					success: function (aButtons) {
						new Press().executeOn(aButtons[1]);
					}
				});
			}
		};
	}
	function _iCloseAdaptFiltersDialog() {
		return {
			id: "smartFilterBar-adapt-filters-dialog-confirmBtn",
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			actions: new Press()
		};
	}
	function _iPressTheVHDOK(sControlID) {
		return {
			id: sControlID + "-valueHelpDialog-ok",
			controlType: "sap.m.Button",
			actions: new Press()
		};
	}
	function _iPressTheVHDCancel(sControlID) {
		return {
			id: sControlID + "-valueHelpDialog-cancel",
			controlType: "sap.m.Button",
			actions: new Press()
		};
	}
	//TODO: Similar to SmartFilterBarTypes _iSelectSingleRowFromVHD
	function _iSelectSingleRowFromVHD(sControlID, sText) {
		return {
			// id: sControlID + "-valueHelpDialog-table",
			// controlType: "sap.ui.table.Table",
			// searchOpenDialogs: true,
			// success: function (oTable) {
			controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
			searchOpenDialogs: true,
			success: function (aPopovers) {
				var sRowText,
					oPopover = aPopovers[0],
					aRows,
					oTableSelectionInstance;

				oPopover.getTableAsync().then(function(oTable){
					aRows = oTable.getRows();
					oTableSelectionInstance = (oTable._getSelectionPlugin && oTable._getSelectionPlugin().isA("sap.ui.table.plugins.MultiSelectionPlugin") && oTable.data("isInternal")) ? oTable._getSelectionPlugin() : oTable;
					aRows.forEach(function(oRow, iIndex){
						sRowText = oRow.getCells()[0].getText();
						if (sRowText === sText) {
							oTable._iSourceRowIndex = iIndex;
							oTableSelectionInstance.addSelectionInterval(iIndex, iIndex);
						}
					});
				});
			}
		};
	}
	function __iPressOnPersonalizationButton () {
		return {
			controlType: "sap.m.Button",
			matchers: new PropertyStrictEquals({
				name: "icon",
				value: "sap-icon://action-settings"
			}),
			actions: new Press()
		};
	}
	function __iAddFilter(sFilterName) {
		return {
			controlType: "sap.m.CustomListItem",
			success: function(aCustomListItems) {
				this.waitFor({
					controlType: "sap.m.ComboBox",
					actions: new EnterText({
						text: sFilterName,
						pressEnterKey: true
					})
				});
			}
		};
	}
	function __iPressAButtonOnTheWarningDialog(sButtonText) {
		return {
			controlType: "sap.m.Dialog",
			matchers: new PropertyStrictEquals({
				name: "title",
				value: "Warning"
			}),
			success: function(aDialogs) {
				Opa5.assert.equal(aDialogs.length, 1, "warning dialog found");
				this.iPressAButtonOnTheDialog(aDialogs[0], sButtonText);
			}
		};
	}
	function __iClearDDRValue(sId) {
		return {
			id: sId,
			searchOpenDialogs: false,
			actions: new EnterText({
				text: ""
			})
		};
	}
	function __iPressOnButtonWithIcon (sIcon) {
		return {
			controlType: "sap.m.Button",
			matchers: new PropertyStrictEquals({
				name: "icon",
				value: sIcon
			}),
			actions: new Press()
		};
	}
	function __iPressAButtonOnTheDialog (oDialog, sButtonText) {
		return {
			searchOpenDialogs: true,
			controlType: "sap.m.Button",
			matchers: [
				new PropertyStrictEquals({
					name: "text",
					value: sButtonText
				}),
				new Ancestor(oDialog, false)
			],
			actions: new Press(),
			errorMessage: "Could not find the '" + sButtonText + "' button"
		};
	}
	return {
		iPressButton: function (sId) {
			return this.waitFor(__iPressButton(sId));
		},
		iPressTheRestoreButton: function () {
			return this.waitFor(__iPressTheRestoreButton());
		},
		iPressTheFilterGoButton: function () {
			return this.waitFor(__iPressTheFilterGoButton());
		},
		iPressSearchFieldIconButton: function (sId) {
			return this.waitFor(__iPressSearchFieldIconButton(sId));
		},
		iPressValueHelpIcon: function (sFieldId) {
			return this.waitFor(__iPressValueHelpIcon(sFieldId));
		},
		iPressTheSetFilterDataAsStringButton: function () {
			return this.waitFor(__iPressTheSetFilterDataAsStringButton());
		},
		iPressTheSetUiStateWithNoSemanticDateButton: function () {
			return this.waitFor(__iPressTheSetUiStateWithNoSemanticDateButton());
		},
		iOpenTheVHD: function (sControlId) {
			return this.waitFor(__iOpenTheVHD(sControlId));
		},
		iSelectDateOperation: function (sText) {
			return this.waitFor(__iSelectDateOperation(sText));
		},
		iSelectDateOperationByKey: function (sText) {
			return this.waitFor(__iSelectDateOperationByKey(sText));
		},
		iSetValueToSelectedOperation: function (aValues, sOperation) {
			return this.waitFor(__iSetValueToSelectedOperation(aValues, sOperation));
		},
		iEnterValue: function (sControlId, sValue, bKeepFocus) {
			return this.waitFor(__iEnterValue(sControlId, sValue, bKeepFocus));
		},
		iEnterValuePerso: function (sControlId, sValue, bKeepFocus) {
			return this.waitFor(__iEnterValuePerso(sControlId, sValue, bKeepFocus));
		},
		iClickShowAll: function () {
			return this.waitFor(__iClickShowAll());
		},
		iClickApply: function () {
			return this.waitFor(__iClickApply());
		},
		iClickCancel: function (sControlId, sText) {
			return this.waitFor(__iClickCancel(sControlId, sText));
		},
		iExpandVHDFilters: function (sControlId) {
			return this.waitFor(__iExpandVHDFilters(sControlId));
		},
		iSelectAnItemFromSuggestions: function (sId, sText, iIndex) {
			return this.waitFor(__iSelectAnItemFromSuggestions(sId,sText, iIndex));
		},
		iOpenSuggestions: function (sID, sText) {
			return this.waitFor(__iOpenSuggestions(sID, sText));
		},
		iSelectAnItemFromTheSuggest: function (iIndex) {
			return this.waitFor(__iSelectAnItemFromTheSuggest(iIndex));
		},
		iSaveVariantAs: function (sVariantNameOld, sVariantNameNew) {
			return this.waitFor(__iSaveVariantAs(sVariantNameOld, sVariantNameNew));
		},
		iSelectDefaultVariant: function (sVariant) {
			return this.waitFor(__iSelectDefaultVariant(sVariant));
		},
		iSelectVariant: function (sVariantName) {
			return this.waitFor(__iSelectVariant(sVariantName));
		},
		iSetFilterOperation: function (sId, sOperation) {
			return this.waitFor(__iSetFilterOperation(sId, sOperation));
		},
		iPressAdaptFiletrsDialogButton: function () {
			return this.waitFor(_iPressAdaptFiletrsDialogButton());
		},
		iPressTheAdaptFiltersShowValuesButton: function () {
			return this.waitFor(_iPressTheAdaptFiltersShowValuesButton());
		},
		iResetAdaptFiltersDialog: function () {
			return this.waitFor(_iResetAdaptFiltersDialog());
		},
		iCloseAdaptFiltersDialog: function () {
			return this.waitFor(_iCloseAdaptFiltersDialog());
		},
		iPressTheVHDOK: function (sControlID) {
			return this.waitFor(_iPressTheVHDOK(sControlID));
		},
		iPressTheVHDCancel: function (sControlID) {
			return this.waitFor(_iPressTheVHDCancel(sControlID));
		},
		iSelectSingleRowFromVHD: function(sControlID, sText) {
			return this.waitFor(_iSelectSingleRowFromVHD(sControlID, sText));
		},
		iPressOnButtonWithIcon: function (sIcon) {
			return this.waitFor(__iPressOnButtonWithIcon(sIcon));
		},
		iNavigateToPanel: function (sPanelName) {
			return waitForNavigationControl.call(this, {
				success: function(oNavigationControl) {

					var sNavigationControlType, sInnerControlType, sInnerControlPropertyName;

					//Mobile
					if (oNavigationControl.isA("sap.m.List")) {
						sNavigationControlType = "sap.m.List";
						sInnerControlType = "sap.m.StandardListItem";
						sInnerControlPropertyName = "title";
					}

					//New Layout
					if (oNavigationControl.isA("sap.m.IconTabBar")) {
						sNavigationControlType = "sap.m.IconTabBar";
						sInnerControlType = "sap.m.IconTabFilter";
						sInnerControlPropertyName = "text";
					}

					//Old Layout
					if (oNavigationControl.isA("sap.m.SegmentedButton")) {
						sNavigationControlType = "sap.m.SegmentedButton";
						sInnerControlType = "sap.m.Button";
						sInnerControlPropertyName = "text";
					}

					return this.waitFor({
						controlType: sNavigationControlType,
						success: function(aNavigationControls) {
							var oNavigationControl = aNavigationControls[0];
							this.waitFor({
								controlType: sInnerControlType,
								matchers: [
									new Ancestor(oNavigationControl),
									new PropertyStrictEquals({
										name: sInnerControlPropertyName,
										value: sPanelName
									})
								],
								actions: new Press()
							});
						}
					});
				}
			});
		},

		iPressRestoreButton: function() {
			return waitForP13nDialog.call(this, {
				success: function(oP13nDialog) {
					this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_RESET")
							}),
							new PropertyStrictEquals({
								name: "enabled",
								value: true
							}),
							new Ancestor(oP13nDialog, false)
						],
						actions: new Press(),
						errorMessage: "Could not find the 'Restore' button"
					});
				}
			});
		},

		iPressOnPersonalizationButton: function () {
			return this.waitFor(__iPressOnPersonalizationButton());
		},
		iAddFilter: function (sFilterName) {
			return this.waitFor(__iAddFilter(sFilterName));
		},
		iPressAButtonOnTheWarningDialog: function (sButtonText) {
			return this.waitFor(__iPressAButtonOnTheWarningDialog(sButtonText));
		},
		iPressAButtonOnTheDialog: function (oDialog, sButtonText) {
			return this.waitFor(__iPressAButtonOnTheDialog(oDialog, sButtonText));
		},
		iOpenTheVHDPerso: function (sControlId) {
			return this.waitFor(__iOpenTheVHDPerso(sControlId));
		},
		iPressAButtonOnTheP13nDialog: function(sButtonText) {
			return waitForP13nDialog.call(this, {
				success: function(oP13nDialog) {
					this.iPressAButtonOnTheDialog(oP13nDialog, sButtonText);
				}
			});
		},
		iClearDDRValue: function (sId) {
			return this.waitFor(__iClearDDRValue(sId));
		}
	};
});
