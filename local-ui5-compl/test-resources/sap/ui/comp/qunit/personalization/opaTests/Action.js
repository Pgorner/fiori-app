/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/Matcher",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Descendant",
	"./Util",
	"sap/ui/comp/state/UIState",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/AggregationContainsPropertyEqual",
	"sap/ui/test/actions/EnterText",
	"sap/ui/thirdparty/jquery",
	"./modules/waitForNavigationControl",
	"./modules/waitForP13nDialog",
	"./modules/waitForSelectWithSelectedTextOnPanel",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/DateStorage"

], function(
	Library,
	Opa5,
	Press,
	Matcher,
	Properties,
	Ancestor,
	Descendant,
	TestUtil,
	UIState,
	PropertyStrictEquals,
	AggregationContainsPropertyEqual,
	EnterText,
	jQuery,
	waitForNavigationControl,
	waitForP13nDialog,
	waitForSelectWithSelectedTextOnPanel,
	DateStorage
) {
	"use strict";
	const oMResourceBundle = Library.getResourceBundleFor("sap.m");
	var iChangeComboBoxSelection = function(oComboBox, sNew, oSettings) {
		new Press().executeOn(oComboBox);
		this.waitFor({
			controlType: "sap.m.Popover",
			matchers: new Ancestor(oComboBox),
			success: function(aPopovers) {
				Opa5.assert.ok(aPopovers.length === 1, "ComboBox popover found");
				var oPopover = aPopovers[0];
				this.waitFor({
					controlType: "sap.m.StandardListItem",
					matchers: [
						new Ancestor(oPopover, false),
						new PropertyStrictEquals({
							name: "title",
							value: sNew
						})
					],
					actions: new Press(),
					success: function(oSelect) {
						if (oSettings && typeof oSettings.success === "function") {
							oSettings.success.call(this, oSelect);
						}
					},
					errorMessage: "ComboBox StandardListItem with text '" + sNew + "' not found"
				});
			}
		});
	};

	var iRemoveAConditionLine = function(oP13nConditionPanel, iIndex) {
		this.waitFor({
			controlType: "sap.ui.layout.Grid",
			matchers: new Ancestor(oP13nConditionPanel, false),
			success: function(aGrids) {
				var oGrid = aGrids[iIndex + 1];
				this.waitFor({
					controlType: "sap.m.Button",
					matchers: [
						new Ancestor(oGrid, false),
						new PropertyStrictEquals({
							name: "icon",
							value: "sap-icon://decline"
						})
					],
					actions: new Press()
				});
			}
		});
	};

	var waitForPanel = function(oSettings) {
		return this.waitFor({
			controlType: "sap.ui.layout.form.SimpleForm",
			searchOpenDialogs: true,
			actions: oSettings.actions,
			success: oSettings.success
		});
	};

	var waitForP13nConditionPanelOfPanel = function(oSettings) {
		return waitForPanel.call(this, {
			success: function(aPanels) {
				var oPanel = aPanels[0];
				this.waitFor({
					controlType: "sap.ui.comp.p13n.P13nConditionPanel",
					matchers: new Ancestor(oPanel),
					actions: oSettings.actions,
					success: oSettings.success
				});
			}
		});
	};

	var iChangeSelect = function(oPanel, sTextOld, sTextNew) {
		waitForSelectWithSelectedTextOnPanel.call(this, sTextOld, oPanel, {
			actions: new Press(),
			success: function(oSelect) {
				this.waitFor({
					controlType: "sap.m.Popover",
					matchers: new Ancestor(oSelect),
					success: function(aPopovers) {
						Opa5.assert.ok(aPopovers.length === 1, "Selection popover found");
						var oPopover = aPopovers[0];
						this.waitFor({
							controlType: "sap.m.StandardListItem",
							matchers: [
								new Ancestor(oPopover, false),
								new PropertyStrictEquals({
									name: "title",
									value: sTextNew
								})
							],
							actions: new Press(),
							errorMessage: "Selection Item found with text '" + sTextNew + "' not found"
						});
					}
				});
			}
		});
	};

	/**
	 * The Action can be used to...
	 *
	 * @class Action
	 * @extends sap.ui.test.Opa5
	 * @author SAP
	 * @private
	 * @alias sap.ui.comp.qunit.personalization.test.Action
	 */
	var Action = Opa5.extend("sap.ui.comp.qunit.personalization.test.Action", {

		iLookAtTheScreen: function() {
			return this;
		},

		iPressOnPersonalizationButton: function(bWaitForVariant) {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://action-settings"
				}),
				actions: new Press()
			});
		},

		iClickOnTheCheckboxSelectAll: function() {
			var oIDMatcher = new Matcher();
			oIDMatcher.isMatching = function(oControl) {
				return oControl.getId().endsWith('-sa');
			};

			return waitForP13nDialog.call(this, {
				success: function(oP13nDialog) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CheckBox",
						matchers: [
							new Ancestor(oP13nDialog, false),
							oIDMatcher
						],
						success: function(aCheckBoxes) {
							Opa5.assert.ok(aCheckBoxes.length, "'Select all' checkbox found");
						},
						actions: new Press(),
						errorMessage: "'Select all' checkbox not found"
					});
				}
			});
		},

		iClickOnTheCheckboxShowFieldAsColumn: function(sSelectionText) {
			return this.waitFor({
				controlType: "sap.m.p13n.GroupPanel",
				success: function(aPanels) {
					var oPanel = aPanels[0];
					waitForSelectWithSelectedTextOnPanel.call(this, sSelectionText, oPanel, {
						success: function(oSelect) {
							this.waitFor({
								controlType: "sap.ui.layout.Grid",
								matchers: new Descendant(oSelect),
								success: function(aGrids) {
									Opa5.assert.ok(aGrids.length === 1, "sap.ui.layout.Grid which wraps the checkbox control found");
									var oGrid = aGrids[0];
									this.waitFor({
										controlType: "sap.m.CheckBox",
										matchers: new Ancestor(oGrid, false),
										success: function(aCheckBoxes) {
											Opa5.assert.equal(aCheckBoxes.length, 1, "One CheckBox found");
										},
										actions: new Press()
									});
								}
							});
						}
					});
				}
			});
		},

		iNavigateToPanel: function(sPanelName) {
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

		iSelectColumn: function(sColumnName, bChart) {
			var sControlType = bChart ? "sap.m.Text" : "sap.m.Label";
			return waitForP13nDialog.call(this, {
				success: function(oP13nDialog) {
					return this.waitFor({
						controlType: sControlType,
						matchers: [
							new Ancestor(oP13nDialog, false),
							new PropertyStrictEquals({
								name: "text",
								value: sColumnName
							})
						],
						success: function(aLabels) {
							Opa5.assert.ok(aLabels.length === 1, "Found " + sControlType + " for Column '" + sColumnName + "'");
							var oLabel = aLabels[0];
							return this.waitFor({
								controlType: "sap.m.ColumnListItem",
								matchers: [
									new Ancestor(oP13nDialog, false),
									new Descendant(oLabel, false)
								],
								success: function(aColumnListItems) {
									var oColumnListItem = aColumnListItems[0];
									this.waitFor({
										controlType: "sap.m.CheckBox",
										matchers: new Ancestor(oColumnListItem, false),
										actions: new Press(),
										errorMessage: "No sap.m.CheckBox found for column '" + sColumnName + "'"
									});
								}
							});
						}
					});
				}
			});
		},

		iRemoveASortLine: function(iIndex) {
			return this.waitFor({
				controlType: "sap.m.p13n.SortPanel",
				success: function(aP13nSortPanels) {
					var oP13nSortPanel = aP13nSortPanels[0];
					this.waitFor({
						controlType: "sap.m.List",
						matchers: new Ancestor(oP13nSortPanel),
						success: function(aLists) {
							var oList = aLists[0];
							var oItem = oList.getItems()[iIndex];
							this.waitFor({
								controlType: "sap.m.Button",
								matchers: [
									new Ancestor(oItem, false),
									new PropertyStrictEquals({
										name: "icon",
										value: "sap-icon://decline"
									})
								],
								actions: new Press()
							});
						}
					});
				}
			});
		},

		iRemoveAGroupLine: function(iIndex) {
			return this.waitFor({
				controlType: "sap.m.p13n.GroupPanel",
				success: function(aP13nSortPanels) {
					var oP13nSortPanel = aP13nSortPanels[0];
					this.waitFor({
						controlType: "sap.m.List",
						matchers: new Ancestor(oP13nSortPanel),
						success: function(aLists) {
							var oList = aLists[0];
							var oItem = oList.getItems()[iIndex];
							this.waitFor({
								controlType: "sap.m.Button",
								matchers: [
									new Ancestor(oItem, false),
									new PropertyStrictEquals({
										name: "icon",
										value: "sap-icon://decline"
									})
								],
								actions: new Press()
							});
						}
					});
				}
			});
		},

		iRemoveAFilterLine: function(iIndex) {
			if (iIndex === undefined) {
				iIndex = 0;
			}

			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					iRemoveAConditionLine.call(this, oP13nConditionPanel, iIndex);
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

		iPressEscape: function() {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Dialog",
				success: function(aDialogs) {
					aDialogs[0].$().trigger(jQuery.Event("keydown", { keyCode: 27 }));
				}
			});
		},

		iPressCancelButton: function() {
			return this.iPressAButtonOnTheP13nDialog(TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_CANCEL"));
		},

		iPressOkButton: function() {
			return this.iPressAButtonOnTheP13nDialog(TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_OK"));
		},

		iPressAButtonOnTheP13nDialog: function(sButtonText) {
			return waitForP13nDialog.call(this, {
				success: function(oP13nDialog) {
					this.iPressAButtonOnTheDialog(oP13nDialog, sButtonText);
				}
			});
		},

		iPressOkButtonOnTheWarningDialog: function() {
			return this.iPressAButtonOnTheWarningDialog(TestUtil.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.OK"));
		},

		iPressCancelButtonOnTheWarningDialog: function() {
			return this.iPressAButtonOnTheWarningDialog(TestUtil.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.CANCEL"));
		},

		iPressAButtonOnTheWarningDialog: function(sButtonText) {
			return this.waitFor({
				controlType: "sap.m.Dialog",
				matchers: new PropertyStrictEquals({
					name: "title",
					value: "Warning"
				}),
				success: function(aDialogs) {
					Opa5.assert.equal(aDialogs.length, 1, "warning dialog found");
					this.iPressAButtonOnTheDialog(aDialogs[0], sButtonText);
				}
			});
		},

		iPressAButtonOnTheDialog: function(oDialog, sButtonText) {
			return this.waitFor({
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
			});
		},

		iPressDeleteRowButton: function(iIndex) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://decline"
				}),
				success: function(aButtons) {
					if (iIndex < aButtons.length) {
						new Press().executeOn(aButtons[iIndex]);
					}
				}
			});
		},

		iChangeSortSelection: function(sTextOld, sTextNew) {
			return this.waitFor({
				controlType: "sap.m.p13n.SortPanel",
				success: function(aPanels) {
					var oPanel = aPanels[0];
					iChangeSelect.call(this, oPanel, sTextOld, sTextNew);
				}
			});
		},

		iChangeGroupSelection: function(sTextOld, sTextNew) {
			return this.waitFor({
				controlType: "sap.m.p13n.GroupPanel",
				success: function(aPanels) {
					var oPanel = aPanels[0];
					iChangeSelect.call(this, oPanel, sTextOld, sTextNew);
				}
			});
		},

		iClickOnComboBox: function(sValue) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sValue
				}),
				success: function(aComboBoxes) {
					new Press().executeOn(aComboBoxes[0]);
				}
			});
		},

		iClickOnSelect: function(sValue) {
			return this.waitFor({
				controlType: "sap.m.Select",
				matchers: new PropertyStrictEquals({
					name: "selectedKey",
					value: sValue
				}),
				success: function(aSelectLists) {
					new Press().executeOn(aSelectLists[0]);
				}
			});
		},

		iChangeTheCondition: function(sNewCondition, iCondition) {
			if (iCondition === undefined) {
				iCondition = 0;
			}
			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.ui.layout.Grid",
						matchers: new Ancestor(oP13nConditionPanel, true),
						success: function(aGrids) {
							var oWrapperGrid = aGrids[0];
							this.waitFor({
								controlType: "sap.ui.layout.Grid",
								matchers: new Ancestor(oWrapperGrid),
								success: function(aGrids) {
									var oGrid = aGrids[iCondition];
									this.waitFor({
										controlType: "sap.m.ComboBox",
										matchers: [
											new Ancestor(oGrid),
											new AggregationContainsPropertyEqual({
												aggregationName: "items",
												propertyName: "text",
												propertyValue: "Include"
											})
										],
										actions: new Press(),
										success: function(aComboBoxes) {
											var oComboBox = aComboBoxes[0];
											this.waitFor({
												controlType: "sap.m.StandardListItem",
												matchers: [
													new Ancestor(oComboBox),
													new PropertyStrictEquals({
														name: "title",
														value: sNewCondition
													})
												],
												actions: new Press(),
												timeout: 20
											});
										}
									});
								}
							});
						}
					});
				}
			});
		},

		iAddFilter: function(sFilterName) {
			this.waitFor({
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
			});
		},

		iOpenVHDropdown: function(sControlID) {
			return this.waitFor({
				id: sControlID + "-arrow",
				controlType: "sap.ui.core.Icon",
				actions: new Press()
			});
		},

		iOpenTheVHD: function (sControlID) {
			return this.waitFor({
				id: sControlID + "-vhi",
				controlType: "sap.ui.core.Icon",
				actions: new Press()
			});
		},

		iPressTheVHDOKButton: function () {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: function (oControl) {
					return oControl.getId() && oControl.getId().endsWith("valueHelpDialog-ok");
				},
				actions: new Press(),
				searchOpenDialogs: true
			});
		},
		iPressTheVHDCancelButton: function () {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: function (oControl) {
					return oControl.getId() && oControl.getId().endsWith("valueHelpDialog-cancel");
				},
				actions: new Press(),
				searchOpenDialogs: true
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

		iChangeTheFilterField: function(sNewField, iCondition) {
			if (iCondition === undefined) {
				iCondition = 0;
			}

			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.ui.layout.Grid",
						matchers: new Ancestor(oP13nConditionPanel, true),
						success: function(aGrids) {
							var oWrapperGrid = aGrids[0];
							this.waitFor({
								controlType: "sap.ui.layout.Grid",
								matchers: new Ancestor(oWrapperGrid),
								success: function(aConditionGrids) {
									var oConditionGrid = aConditionGrids[iCondition];
									this.waitFor({
										controlType: "sap.m.ComboBox",
										matchers: [
											new Ancestor(oConditionGrid)
										],
										success: function(aComboBoxes) {
											var oComboBox = aComboBoxes[0];
											this.waitFor({
												controlType: "sap.ui.core.Icon",
												matchers: [
													new Ancestor(oComboBox)
												],
												actions: [
													new Press()
												],
												success: function() {
													this.waitFor({
														controlType: "sap.m.StandardListItem",
														matchers: [
															new Ancestor(oComboBox),
															new PropertyStrictEquals({
																name: "title",
																value: sNewField
															})
														],
														actions: new Press(),
														timeout: 20
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
			});
		},

		iPressTheFilterAddButton: function() {
			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: [
							new Ancestor(oP13nConditionPanel),
							new PropertyStrictEquals({
								name: "text",
								value: "Add"
							})
						],
						actions: new Press()
					});
				}
			});
		},

		iSelectFromSuggestions: function(iIndex) {
			return this.waitFor({
				controlType: "sap.m.ColumnListItem",
				searchOpenDialogs: true,
				success: function (aColumns) {
					new Press().executeOn(aColumns[iIndex]);
				}
			});
		},

		iEnterTextInFilterWithId: function(sId, sText) {
			return this.waitFor({
				controlType: "sap.m.Input",
				id: sId,
				success: function(oInput) {
					if (oInput._oSuggestionPopup && !oInput._oSuggestionPopup.isOpen()) {
						oInput._openSuggestionPopup(true);
					}
					new EnterText({ text: sText, keepFocus: true }).executeOn(oInput);
				}
			});
		},

		iEnterTextInFilterWithIdFocusable: function(sId, sText, bKeepFocus) {
			return this.waitFor({
				id: sId,
				success: function(oInput) {
					if (oInput._oSuggestionPopup && !oInput._oSuggestionPopup.isOpen()) {
						oInput._openSuggestionPopup(true);
					}
					new EnterText({ text: sText, keepFocus: bKeepFocus }).executeOn(oInput);
				}
			});
		},

		iEnterTextInConditionField: function(iCondition, sText1, sText2) {
			if (iCondition === undefined) {
				iCondition = 0;
			}

			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.ui.layout.Grid",
						matchers: new Ancestor(oP13nConditionPanel, true),
						success: function(aGrids) {
							var oWrapperGrid = aGrids[0];
							this.waitFor({
								controlType: "sap.ui.layout.Grid",
								matchers: new Ancestor(oWrapperGrid),
								success: function(aConditionGrids) {
									var oConditionGrid = aConditionGrids[iCondition];
									this.waitFor({
										controlType: "sap.m.Input",
										matchers: new Ancestor(oConditionGrid),
										success: function(aInputs) {
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
								}
							});
						}
					});
				}
			});
		},

		iOpenTheP13nDialogAndNavigateToTheFilterTab: function() {
			this.iPressOnPersonalizationButton().and.iNavigateToPanel(TestUtil.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.TAB_Filter"));
		},

		iChangeSelectSelection: function(sNew) {
			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.ui.layout.Grid",
						matchers: new Ancestor(oP13nConditionPanel, true),
						success: function(aGrids) {
							var oGrid = aGrids[0];
							this.waitFor({
								controlType: "sap.m.Select",
								matchers: new Ancestor(oGrid),
								actions: new Press(),
								success: function(aSelects) {
									var oSelect = aSelects[0];
									this.waitFor({
										controlType: "sap.m.SelectList",
										matchers: new Ancestor(oSelect, false),
										success: function(aSelectLists) {
											var oSelectList = aSelectLists[0];
											this.waitFor({
												controlType: "sap.ui.core.Item",
												matchers: [
													new Ancestor(oSelectList),
													new PropertyStrictEquals({
														name: "text",
														value: sNew
													})
												],
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
		},

		iEnterTextInInput: function(sPlaceHolder, sText) {
			return this.waitFor({
				controlType: "sap.m.Input",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: sPlaceHolder
				}),
				success: function(aInput) {
					return new EnterText({
						text: sText
					}).executeOn(aInput[0]);
				}
			});
		},

		iEnterTextInInputFocusable: function(sPlaceHolder, sText, bKeepFocus) {
			return this.waitFor({
				controlType: "sap.m.Input",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: sPlaceHolder
				}),
				success: function(aInput) {
					return new EnterText({
						text: sText,
						keepFocus: bKeepFocus
					}).executeOn(aInput[0]);
				}
			});
		},

		iEnterTextInDatePicker: function(sPlaceHolder, sText) {
			return this.waitFor({
				controlType: "sap.m.DatePicker",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: sPlaceHolder
				}),
				actions: new EnterText({
					text: sText
				})
			});
		},

		iChangeFilterSelectionToDate: function(sDate) {
			return this.waitFor({
				controlType: "sap.m.DatePicker",
				success: function(aDatePickers) {
					var oDatePicker = aDatePickers[0];
					oDatePicker.setValue(sDate);
				}
			});
		},
		iClearFilterValue: function (sId) {
			this.waitFor({
				id: sId,
				success: function (oControl) {
					if ((oControl.getTokens && oControl.getTokens().length) || (oControl.getSelectedItems && oControl.getSelectedItems().length)) {
						oControl.onfocusin({ target: oControl.getDomRef("inner") });
						this.iClearTokensInControl.call(this, oControl);
					}

					if (oControl.getValue && oControl.getValue() && oControl.getValueHelpOnly && !oControl.getValueHelpOnly()) {
						this.iClearValueInControl.call(this, oControl);
					}
				}
			});
		},
		iClickRemoveFilterCriterionForColumn: function (sColumnName) {
			this.waitFor({
				controlType: "sap.m.Dialog",
				success: function() {
					this.waitFor({
						controlType: "sap.ui.layout.Grid",
						matchers: [
							function(oGrid){
								return oGrid.mAggregations.content.find((content) => {return content.sId.endsWith(sColumnName);}) != undefined;
							}
						],
						success: function(aGrid) {
							var oGrid = aGrid[0];
							this.waitFor({
								controlType: "sap.m.Button",
								matchers: [
									function(oButton){
										return oButton.mAggregations.tooltip  == "Remove Filter Criterion";
									},
									new Ancestor(oGrid, false)
								],
								success: function() {
									Opa5.assert.ok(true, `Remove Filter Button clicked for ${sColumnName}`);
								},
								actions: new Press(),
								errorMessage: `No Remove Filter Button for Column ${sColumnName} found in Dialog`
							});
						},
						errorMessage: `No Filterpanel with ending id ${sColumnName} found`
					});
				},
				errorMessage: "Dialog not found"
			});
		},
		iClearTokensInControl: function(oControl) {
			this.waitFor({
				controlType: "sap.ui.core.Icon",
				ancestor: {
					id: oControl.getId()
				},
				properties: {
					src: "sap-icon://decline"
				},
				actions: new Press()
			});
		},
		iChangeComboBoxWithChartTypeTo: function(sChartTypeText) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: TestUtil.getTextFromResourceBundle("sap.m", "COLUMNSPANEL_CHARTTYPE")
				}),
				actions: new Press(),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "ChartType Combobox found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: [
							new Ancestor(aComboBoxes[0]), new Properties({
								title: sChartTypeText
							})
						],
						actions: new Press(),
						success: function(aCoreItems) {
							Opa5.assert.equal(aCoreItems[0].getTitle(), sChartTypeText, "ChartType changed to '" + sChartTypeText + "'");
						},
						errorMessage: "Cannot select '" + sChartTypeText + "' from ChartType Combobox"
					});
				}
			});
		},

		// iChangeRoleOfColumnTo: function(sColumnName, sRole) {
		// this.waitFor({
		// controlType: "sap.m.ColumnListItem",
		// });
		// return this.waitFor({
		// controlType: "sap.m.Select",
		// matchers: new PropertyStrictEquals({
		// name: "text",
		// value: "Category"//TestUtil.getTextFromResourceBundle("sap.m", "COLUMNSPANEL_CHARTTYPE")
		// }),
		// actions: new EnterText({
		// text: sRole
		// })
		// // success: function(aSelects) {
		// // var aSelect = aSelects.filter(function(oSelect) {
		// // return oSelect.getParent().getCells()[0].getText() === sColumnName;
		// // });
		// // Opa5.assert.equal(aSelect.length, 1);
		// // aSelect[0].getFocusDomRef().value = sRole;
		// // // sap.ui.qunit.QUnitUtils.triggerEvent("input", oT);
		// // aSelect[0].$().trigger("tap");
		// // // oSelect.onSelectionChange();
		// // }
		// });
		// },

		iPressBackButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "type",
					value: "Back"
				}),
				actions: new Press()
			});
		},

		iPressButtonWithText: function (sText) {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: sText
				}),
				actions: new Press()
			});
		},

		iSetDataSuiteFormat: function(sControlType, oDataSuiteFormat) {
			return this.waitFor({
				controlType: sControlType,
				success: function(aControls) {
					Opa5.assert.equal(aControls.length, 1, "'" + sControlType + "' has been found");
					aControls[0].setUiState(new UIState({
						presentationVariant: oDataSuiteFormat
					}));
				}
			});
		},

		iSelectVariant: function(sVariantName) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				actions: new Press(),
				success: function(aSmartVariantManagements) {
					var oSmartVariantManagement = aSmartVariantManagements[0];
					this.waitFor({
						controlType: "sap.m.SelectList",
						matchers: new Ancestor(oSmartVariantManagement),
						success: function(aSelectLists) {
							Opa5.assert.equal(aSelectLists.length, 1, "SmartVariantManagement SelectList found");
							var oSelectList = aSelectLists[0];
							this.waitFor({
								controlType: "sap.ui.core.Item",
								matchers: [
									new Ancestor(oSelectList),
									new PropertyStrictEquals({
										name: "text",
										value: sVariantName
									})
								],
								success: function(aVariantItems) {
									Opa5.assert.equal(aVariantItems.length, 1, "Variant '" + sVariantName + "' found");
								},
								actions: new Press(),
								errorMessage: "Cannot select '" + sVariantName + "' from VariantManagement"
							});
						}
					});
				},
				errorMessage: "Could not find SmartVariantManagement"
			});
		},

		/**
		 * Selects a variant by its name from the SmartVariantManagement instance with the given ID
		 *
		 * @param {string} sVariantManagerID The ID of the SmartVariantManagement
		 * @param {string} sVariantName The name of the variant to select
		 * @returns {Promise} OPA waitFor
		 */
		iSelectVariantByVariantManagerID: function(sVariantManagerID, sVariantName) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				actions: new Press(),
				matchers: [
					new PropertyStrictEquals({
						name: "id",
						value: sVariantManagerID
					})
				],
				success: function(aSmartVariantManagements) {
					Opa5.assert.equal(aSmartVariantManagements.length, 1, "SmartVariantManagement found");
					var oSmartVariantManagement = aSmartVariantManagements[0];
					this.waitFor({
						controlType: "sap.m.SelectList",
						matchers: new Ancestor(oSmartVariantManagement),
						success: function(aSelectLists) {
							Opa5.assert.equal(aSelectLists.length, 1, "SmartVariantManagement SelectList found");
							var oSelectList = aSelectLists[0];
							this.waitFor({
								controlType: "sap.ui.core.Item",
								matchers: [
									new Ancestor(oSelectList),
									new PropertyStrictEquals({
										name: "text",
										value: sVariantName
									})
								],
								success: function(aVariantItems) {
									Opa5.assert.equal(aVariantItems.length, 1, "Variant '" + sVariantName + "' found");
								},
								actions: new Press(),
								errorMessage: "Cannot select '" + sVariantName + "' from VariantManagement"
							});
						}
					});
				},
				errorMessage: "Could not find SmartVariantManagement"
			});
		},

		iSaveVariantAs: function(sVariantNameOld, sVariantNameNew) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				matchers: new PropertyStrictEquals({
					name: "defaultVariantKey",
					value: "*standard*"
				}),
				actions: new Press(),
				success: function(aSmartVariantManagements) {
					Opa5.assert.ok(aSmartVariantManagements, "SmartVariantManagement found");
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVEAS")
						}),
						actions: new Press(),
						success: function(aButtons) {
							Opa5.assert.equal(aButtons.length, 1, "'Save As' button found");
							this.iEnterNewVariantName(sVariantNameOld, sVariantNameNew);
						},
						errorMessage: "Cannot find 'Save As' button on VariantManagement"
					});
				},
				errorMessage: "Could not find SmartVariantManagement"
			});
		},

		iEnterNewVariantName: function(sVariantNameOld, sVariantNameNew) {
			return this.waitFor({
				controlType: "sap.m.Input",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sVariantNameOld
				}),
				actions: new EnterText({
					text: sVariantNameNew
				}),
				success: function(aInputs) {
					Opa5.assert.ok(aInputs[0].getValue() === sVariantNameNew, "Input value is set to '" + sVariantNameNew + "'");
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVE")
						}),
						actions: new Press(),
						success: function(aButtons) {
							Opa5.assert.equal(aButtons.length, 1, "'OK' button found");
						}
					});
				}
			});
		},

		iExcludeColumnKeysOnControl: function(aColumnKeys, sControlType) {
			return this.waitFor({
				controlType: sControlType,
				success: function(aControls) {
					Opa5.assert.equal(aControls.length, 1);
					aControls[0].deactivateColumns(aColumnKeys);
				}
			});
		},

		iFreezeColumn: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.ui.table.Table",
				success: function(aTables) {
					Opa5.assert.equal(aTables.length, 1, "'sap.ui.table.Table' found");
					var aColumn = aTables[0].getColumns().filter(function(oColumn) {
						return oColumn.getLabel().getText() === sColumnName;
					});
					Opa5.assert.equal(aColumn.length, 1, "Column '" + sColumnName + "' found");
					Opa5.assert.equal(aColumn[0].getVisible(), true, "Column '" + sColumnName + "' is visible");
					var aVisibleColumns = aTables[0].getColumns().filter(function(oColumn) {
						return oColumn.getVisible() === true;
					});
					aTables[0].setFixedColumnCount(aVisibleColumns.indexOf(aColumn[0]) + 1);
					Opa5.assert.ok(aVisibleColumns.indexOf(aColumn[0]) > -1, true, "Column '" + sColumnName + "' is fixed on position " + (aVisibleColumns.indexOf(aColumn[0]) + 1));
				}
			});
		},

		iOpenColumnMenu: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.ui.table.Column",
				matchers: function (oColumn) {
					return oColumn.getId().endsWith(sColumnName);
				},
				actions: new Press()
			});
		},

		iPressGroupByProperty: function(sPropertyName) {
			return this.waitFor({
				controlType: "sap.m.Label",
				searchOpenDialogs: true,
				matchers: new Properties({
					text: TestUtil.getTextFromResourceBundle("sap.m", "table.COLUMNMENU_QUICK_GROUP")
				}),
				success: function(aLabels) {
					var oMatcher = new Matcher();
					oMatcher.isMatching = function(oControl) {
						return oControl.getAriaLabelledBy().indexOf(aLabels[0].getId()) > -1;
					};

					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: [
							oMatcher,
							new PropertyStrictEquals({
								name: "text",
								value: sPropertyName
							})
						],
						actions: new Press()
					});
				}
			});
		},

		iEnterFilterPanelInput: function(sTableId, sColumnName, sInput) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartfilterbar.SFBMultiInput",
				matchers: function (oSFBMultiInput) {
					return oSFBMultiInput.getId().endsWith("FilterPanel-filterItemControlA_-" + sTableId + "-" + sColumnName);
				},
				actions: new EnterText({
					text: sInput
				}),
				success: function(aInputs) {
					Opa5.assert.ok(aInputs.find(function(oInput){return oInput.getId().endsWith(sColumnName);}).getValue() === sInput, "Input value is set to '" + sInput + "'");
				},
				errorMessage: "SFBMultiInput could not be found"
			});
		},

		iPressFilterOverflowToolbarClearFilterButton: function(sTableId) {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: function(oOverflowToolbarButton){
					return oOverflowToolbarButton.getId().endsWith(sTableId + "-infoToolbarClearButton");
				},
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Clear filter' button found");
				},
				errorMessage: "'Clear filter' button could not be found"
			});
		},

		iPressFilterOverflowToolbar: function() {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbar",
				matchers: function(oOverflowToolbar){
					return oOverflowToolbar.hasStyleClass("sapMListInfoTBar");
				},
				actions: new Press(),
				errorMessage: "'Clear filter' button could not be found"
			});
		},

		iPressOnDrillUpButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://drill-up"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'DrillUp' button found");
				},
				errorMessage: "DrillUp button could not be found"
			});
		},

		iPressOnDrillDownButton: function(sDimensionName) {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://drill-down"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'DrillDown' button found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						// Retrieve all list items in the table
						matchers: [
							function(oStandardListItem) {
								return oStandardListItem.getTitle() === sDimensionName;
							}
						],
						actions: new Press(),
						success: function(aStandardListItems) {
							Opa5.assert.equal(aStandardListItems.length, 1);
							Opa5.assert.equal(aStandardListItems[0].getTitle(), sDimensionName, "List item '" + sDimensionName + "' has been found");
						},
						errorMessage: "Dimension '" + sDimensionName + "' could not be found in the list"
					});
				},
				errorMessage: "DrillDown button could not be found"
			});
		},

		iPressOnIgnoreButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: "Ignore"
				}),
				actions: new Press()
			});
		},

		iPressOnMoveToBottomButton: function() {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbarButton",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://expand-group"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Move to Botton' button found");
				},
				errorMessage: "'Move To Botton' button could not be found"
			});
		},

		iPressOnMoveToTopButton: function() {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbarButton",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://collapse-group"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Move to Top' button found");
				},
				errorMessage: "'Move to Top' button could not be found"
			});
		},

		iPressOnControlWithText: function(sControlType, sText) {
			return this.waitFor({
				id: this.getContext()[sText],
				controlType: sControlType,
				actions: new Press(),
				errorMessage: "The given control was not pressable"
			});
		},

		iPressOnMoreLinksButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "POPOVER_DEFINE_LINKS")
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "The 'More Links' button found");
				}
			});
		},

		iPressOnStartRtaButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://wrench"
				}),
				actions: new Press()
			});
		},

		iWaitUntilTheBusyIndicatorIsGone: function(sId) {
			return this.waitFor({
				id: sId,
				check: function(oRootView) {
					return !!oRootView && oRootView.getBusy() === false;
				},
				success: function() {
					Opa5.assert.ok(true, "the App is not busy anymore");
				},
				errorMessage: "The app is still busy.."
			});
		},

		iPressOnRtaResetButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "BTN_RESTORE")
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Reset' button found");
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "BTN_FREP_OK")
						}),
						actions: new Press(),
						success: function(aButtons) {
							Opa5.assert.equal(aButtons.length, 1, "'OK' button of the warning dialog found");
						}
					});
				}
			});
		},

		iPressAnalyticalColumnHeader: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.ui.table.AnalyticalColumn",
				matchers: new AggregationContainsPropertyEqual({
					aggregationName: "label",
					propertyName: "text",
					propertyValue: sColumnName
				}),
				actions: new Press(),
				success: function(aAnalyticalColumn) {
					Opa5.assert.equal(aAnalyticalColumn.length, 1, "analyticalColumn " + sColumnName + " found");
				},
				errorMessage: "Could not find Column " + sColumnName
			});
		},

		iPressColumnHeader: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.Column",
				matchers: function (oColumn) {
					return oColumn.getId().endsWith(sColumnName);
				},
				actions: new Press()
			});
		},

		waitForP13nChartItemTemplateBox: function(oSettings){
			var bModal = oSettings.hasOwnProperty("modal") ? oSettings.modal : true;
			var sPopoverTitle = oSettings.title;
			var sKind = oSettings.kind;
			var fSuccess = oSettings.success;

			var MDCRb = Library.getResourceBundleFor("sap.ui.mdc");
			var sPlaceholderName = MDCRb.getText('chart.PERSONALIZATION_DIALOG_TEMPLATE_PLACEHOLDER');

			var aMatchers = [];

			if (sPopoverTitle){
				aMatchers.push(new PropertyStrictEquals({
					name: "title",
					value: sPopoverTitle
				}));
			}

			return this.waitFor({
				controlType: bModal ? "sap.m.Dialog" : "sap.m.ResponsivePopover",
				matchers: aMatchers,
				success: function () {
					this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.ComboBox",
						matchers: new PropertyStrictEquals({
							name: "placeholder",
							value: sPlaceholderName
						}),
						success: function (aComboBox) {
							if (sKind === "Dimension"){
								fSuccess(aComboBox[0]);
							} else {
								fSuccess(aComboBox[1]);
							}
						}
					});
				}
			});
		},

		iAddDimension : function(sColumnName, sPopoverTitle, aP13nItems, bModal){
			return this.waitForP13nChartItemTemplateBox({
				title: sPopoverTitle,
				items: aP13nItems,
				kind: "Dimension",
				modal: typeof bModal === "boolean" ? bModal : true,
				success: function(oComboBox) {
					iChangeComboBoxSelection.call(this, oComboBox, sColumnName);
				}.bind(this)
			});
		},

		iAddMeasure : function(sColumnName, sPopoverTitle, aP13nItems, bModal){
			return this.waitForP13nChartItemTemplateBox({
				title: sPopoverTitle,
				items: aP13nItems,
				kind: "Measure",
				modal: typeof bModal === "boolean" ? bModal : true,
				success: function(oComboBox) {
					iChangeComboBoxSelection.call(this, oComboBox, sColumnName);
				}.bind(this)
			});
		},
		iClickOnTableItemWithComboBox: function (sItemName) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.ComboBox",
				matchers: function(oComboBox){
					return oComboBox.getSelectedItem() ? oComboBox.getSelectedItem().getText() === sItemName : false;
				},
				success: function (aLabels) {
					this.waitFor({
						controlType: "sap.m.ColumnListItem",
						matchers: new Descendant(aLabels[0]),
						actions: new Press()
					});
				}
			});
		},

		iPressOnButtonWithIcon: function (sIcon) {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: sIcon
				}),
				actions: new Press()
			});
		},

		iPressOnExportButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: function(oButton) {
					return oButton.getText() === TestUtil.getTextFromResourceBundle("sap.ui.export", "EXPORT_BUTTON");
				},
				actions: new Press()
			});
		},

		iChangeDownloadLimit: function(iLimit) {
			return this.waitFor({
				controlType: "sap.ui.comp.smarttable.SmartTable",
				actions: function(oTable) {
					oTable.attachBeforeExport(function(oEvent) {
						var mExcelSettings = oEvent.getParameter("exportSettings");
						mExcelSettings.dataSource.downloadLimit = iLimit;
					});
				}
			});
		},

		iPressOnListItemWithTitle: function (sTitle) {
			return this.waitFor({
				controlType: "sap.m.StandardListItem",
				matchers: new PropertyStrictEquals({
					name: "title",
					value: sTitle
				}),
				searchOpenDialogs: true,
				actions: new Press()
			});
		},

		iRemoveDimension : function(sColumnName){

			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.ComboBox",
				matchers: function(oComboBox){
					return oComboBox.getSelectedItem() ? oComboBox.getSelectedItem().getText() === sColumnName : false;
				},
				success: function(aComboBox){
					this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.ColumnListItem",
						matchers: new Descendant(aComboBox[0]),
						success: function(aListItem){
							this.waitFor({
								searchOpenDialogs: true,
								controlType: "sap.m.Button",
								matchers: [
									new PropertyStrictEquals({
										name: "icon",
										value: "sap-icon://decline"
									}),
									new Ancestor(aListItem[0])
								],
								actions: new Press()
							});
						}
					});
				}
			});
		},

		iClearTheLog: function () {
			return this.waitFor({
				controlType: "sap.m.Button",
				id: "applicationUnderTest---IDView--clearLog",
				actions: new Press()
			});
		},
		iSelectDateOperationByKey: function(sText) {
			return this.waitFor({
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
			});
		},
		iSetValueToSelectedOperation: function(aValues, sOperation) {
			return this.waitFor({
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
						if (oItem.isA("sap.m.StepInput")){
							oItem.setValue(aValues.shift());
							if (aValues.length === 0) {
								if (sOperation !== undefined) {
									if (sOperation === "NEXTMINUTES") {
										DateStorage.setNextMinutes(sOperation, 10);
									} else if (sOperation === "LASTMINUTES"){
										DateStorage.setLastMinutes(sOperation, 10);
									}
								}
								break;
							}
						}
					}
				}
			});
		},
		iClickApply: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				searchOpenDialogs: true,
				matchers: new PropertyStrictEquals({
					name: "text",
					value: oMResourceBundle.getText("DYNAMIC_DATE_RANGE_CONFIRM")
				}),
				actions: new Press()
			});
		},

		/**
		 * Toggles the 'Show more per row'/'Show less per row' button
		 *
		 * @param {string} sTableId Id of the SmartTable
		 * @param {string} bShowDetails If true, the 'Show more per row' button is pressed, otherwise the 'Show less per row' button is pressed
		 * @returns {Promise} OPA waitFor
		 */
		iSelectShowMoreShowLessPerRow: function(sTableId, bShowDetails) {
			return this.waitFor({
				id: sTableId + "-btnShowHideDetails",
				controlType: "sap.m.SegmentedButton",
				success: function(oSegmentedButton) {
					if (bShowDetails && oSegmentedButton.getSelectedKey() === "hideDetails") {
						oSegmentedButton.getButtons()[0].firePress();
					} else if (!bShowDetails && oSegmentedButton.getSelectedKey() === "showDetails") {
						oSegmentedButton.getButtons()[1].firePress();
					}
				},
				errorMessage: "Did not find the button"
			});
		}
	});

	return Action;
}, true);
