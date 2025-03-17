sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/table/plugins/MultiSelectionPlugin"
], function (Opa5, Press, PropertyStrictEquals, EnterText, Ancestor, MultiSelectionPlugin) {
		"use strict";
		function fnGetSelectionPluginForUITable (oUiTable) {
			return MultiSelectionPlugin.findOn(oUiTable);
		}

		return Opa5.extend("sap.suite.ui.generic.template.integration.testLibrary.utils.Common", {

			// common actions

			iClickTheBtnWithId: function(sId) {
				return this.waitFor({
					id: sId,
					matchers: new PropertyStrictEquals({
						name: "enabled",
						value: true
					}),
					success: function (oButton) {
						oButton.firePress();
						Opa5.assert.ok(true, "The button with id " + sId + " was clicked");
					},
					errorMessage: "The button with id " + sId + " could not be found"
				});
			},

			/**
			* Select items in the ListReport by LineNumber
			*
			* @param {String} sId id of the table
			* @param {array} aItemIndex An array of line numbers (0-based) to be selected
			* @param {boolean} bSelect Select (true: default) or Unselect (false) the lines
			* @throws {Error} Throws an error if the responsive table could not be found
			* @return {*} success or failure
			* @public
			*/
			iChooseListItemsByLineNo: function(sId, aItemIndex, bSelect) {
				return this.waitFor({
					id: sId,
					success: function(oSmartTableObject) {
						var oTable = (oSmartTableObject.isA("sap.ui.comp.smarttable.SmartTable")) ? oSmartTableObject.getTable() : oSmartTableObject;
						bSelect = (bSelect !== false) ? true : false;
						switch (oTable.getMetadata().getElementName()) {
						case "sap.ui.table.Table": // Grid Table
							var oSelectionPlugin = fnGetSelectionPluginForUITable(oTable);
							(oSelectionPlugin || oTable).setSelectionInterval(aItemIndex[0], aItemIndex[0]); // we support only one item here
							oTable.fireRowSelectionChange(aItemIndex);
							break;
						case "sap.m.Table":
							var aTableItems = oTable.getItems();
							for (var i = 0; i < aItemIndex.length; i++) {
								oTable.setSelectedItem(aTableItems[aItemIndex[i]], bSelect);
							}
							oTable.fireSelectionChange({
								listItems: 	oTable.getSelectedItems(),
								selected: bSelect
							});
							break;
						default:
							break;
						}
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* Select items in a table by line number interval (not for responsive table)
			*
			* @param {String} sId id of the table
			* @param {int} iFirst item to select
			* @param {int} iLast item to select
			* @throws {Error} Throws an error if the table could not be found
			* @return {*} success or failure
			* @public
			*/
			iSelectItemRange: function(sId, iFirst, iLast) {
				return this.waitFor({
					id: sId,
					success: function(oSmartTableObject) {
						var oTable = (oSmartTableObject.isA("sap.ui.comp.smarttable.SmartTable")) ? oSmartTableObject.getTable() : oSmartTableObject;
						if (oTable.isA("sap.m.Table")) {
							Opa5.assert.ok(false, "Method not supported for Responsive Table");
							return;
						}
						var oSelectionPlugin = fnGetSelectionPluginForUITable(oTable);
						(oSelectionPlugin || oTable).addSelectionInterval(iFirst, iLast);
						//var aItemIndex = []; //TODO
						oTable.fireRowSelectionChange();
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* Select all items in a table (not for responsive table)
			*
			* @param {String} sId id of the table
			* @throws {Error} Throws an error if the table could not be found
			* @return {*} success or failure
			* @public
			*/
			iSelectAllItems: function(sId) {
				return this.waitFor({
					id: sId,
					success: function (oSmartTableObject) {
						var oTable = (oSmartTableObject.isA("sap.ui.comp.smarttable.SmartTable")) ? oSmartTableObject.getTable() : oSmartTableObject;
						if (oTable.isA("sap.m.Table")) {
							Opa5.assert.ok(false, "Method not supported for Responsive Table");
							return;
						}
						var oSelectionPlugin = fnGetSelectionPluginForUITable(oTable);
						(oSelectionPlugin || oTable).selectAll();
						//var aItemIndex = []; //TODO
						oTable.fireRowSelectionChange();
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* Deselect all items in a table (not for responsive table)
			*
			* @param {String} sId id of the table
			* @throws {Error} Throws an error if the table could not be found
			* @return {*} success or failure
			* @public
			*/
			iDeselectAllItems: function(sId) {
				return this.waitFor({
					id: sId,
					success: function (oSmartTableObject) {
						var oTable = (oSmartTableObject.isA("sap.ui.comp.smarttable.SmartTable")) ? oSmartTableObject.getTable() : oSmartTableObject;
						if (oTable.isA("sap.m.Table")) {
							Opa5.assert.ok(false, "Method not supported for Responsive Table");
							return;
						}
						var oSelectionPlugin = fnGetSelectionPluginForUITable(oTable);
						(oSelectionPlugin || oTable).clearSelection();
						//var aItemIndex = [];
						oTable.fireRowSelectionChange();
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			iClickTheLnkWithId: function(sId) {
				return this.waitFor({
					id: sId,
					success: function (oLink) {
						oLink.firePress();
						Opa5.assert.ok(true, "The link with id " + sId + " was clicked");
					},
					errorMessage: "The link with id " + sId + " could not be found"
				});
			},

			iClickTheBtnWithIcon: function(sIcon) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: [
						new PropertyStrictEquals({
							name: "icon",
							value: sIcon
						}),
						new PropertyStrictEquals({
							name: "enabled",
							value: true
						})
					],
					success: function(oButton) {
						oButton = Array.isArray(oButton) ? oButton[0] : oButton;
						oButton.firePress();
						Opa5.assert.ok(true, "The button with icon " + sIcon + " was clicked");
					},
					errorMessage: "Did not find the button with icon " + sIcon
				});
			},

			iClickTheMultiCboBoxArrow: function(sFieldName) {
				var oIcon = null;
				return this.waitFor({
					controlType: "sap.ui.core.Icon",
					check: function(aIcons) {
						for (var i = 0; i < aIcons.length; i++ ) {
							if ((aIcons[i].getId().indexOf(sFieldName + "-arrow") > -1)) {
								oIcon = aIcons[i];
								return true;
							}
						}
						return false;
					},
					success: function() {
						oIcon.firePress();
						Opa5.assert.ok(true, "ComboBox icon clicked successfully");
					},
					errorMessage: "Did not find the icon for field with name " + sFieldName
				});
			},

			iSelectItemsFromMultiCboBox: function(sFieldName, sItem) {
				var oCheckBox = null;
				return this.waitFor({
					controlType: "sap.m.CheckBox",
					check: function(aCheckBox) {
						for (var i = 0; i < aCheckBox.length; i++ ){
							if (aCheckBox[i].getParent() && aCheckBox[i].getParent().getParent() && aCheckBox[i].getParent().getParent().getParent() && aCheckBox[i].getParent().getParent().getParent().getParent() &&
								(aCheckBox[i].getParent().getParent().getParent().getParent().getId().indexOf(sFieldName) > -1)) {

								var sTitle = aCheckBox[i].getParent().getTitle();
								if (sTitle === sItem) {
									oCheckBox = aCheckBox[i];
									return true;
								}
							}

						}
						return false;
					},
					success: function() {
						oCheckBox.fireSelect({
							selected: true
						});
						Opa5.assert.ok(true, "The list item with label '" + sItem + "' was checked");
					},
					errorMessage: "The list item with label " + sItem + " could not be rendered/checked"
				});

			},

			iClickTheLinkWithLabel: function(sLabelText, index) {
				var oLink = null;
				var iPosition = index || 1;
				return this.waitFor({
					controlType: "sap.m.Link",
					check: function(aLinks) {
						var iOccurance = 1;
						for (var i = 0; i < aLinks.length; i++ ) {
							if (aLinks[i].getText().indexOf(sLabelText) > -1) {
								if ( iOccurance === iPosition) {
									oLink = aLinks[i];
									return true;
								}
								iOccurance++;
							}
						}
						return false;
					},
					success: function() {
						var sSuccessMsg = "Link with title " + sLabelText + " was clicked successfully";
						new Press().executeOn(oLink);
						Opa5.assert.ok(true, index ?  index + (["st","nd","rd"][((index + 90) % 100 - 10) % 10 - 1] || "th") + " occurrence of " + sSuccessMsg : sSuccessMsg);
					},
					errorMessage: "Did not find the Link"
				});
			},

			iClickOnASmartLinkWithLabel: function (sLabel) {
				var oLink = null;
				return this.waitFor({
					controlType: "sap.ui.comp.navpopover.SmartLink",
					check: function(aLinks) {
						for (var i = 0; i < aLinks.length; i++ ){
							if (aLinks[i].getText().indexOf(sLabel) > -1) {
								oLink = aLinks[i];
								return true;
							}
						}
						return false;
					},
					success: function() {
						new Press().executeOn(oLink);
						Opa5.assert.ok(true, "The Smart link with name: \"" + sLabel + "\" was clicked successfully");
					},
					errorMessage: "Smart link with name: '" + sLabel + "' is either not visible/enabled or not found"
				});
			},

			iClickTheDialogButtonWithLabel: function(sLabelText) {
				return this.waitFor({
					controlType: "sap.m.Button",
					searchOpenDialogs: true,
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: sLabelText
						}),
						new PropertyStrictEquals({
							name: "enabled",
							value: true
						})
					],
					success: function(oButton) {
						new Press().executeOn(oButton[0]);
						Opa5.assert.ok(true, "The Dialog button with label '" + sLabelText + "' clicked successfully");
					},
					errorMessage: "The Dialog is not rendered correctly or the button with label '" + sLabelText + "' is not found on the dialog"
				});
			},


			/**
			 * Click a button (sap.m.Button).
			 *
			 * @param {String} sLabelText The displayed label text of the button to be clicked.
			 * @param {int} iIndex The index of the button having label in case there are multiple matches. Default is 0 for backward compatibility
			 * @throws {Error} Throws an error if the button is not rendered or clicked
			 * @return {*} success or failure
			 * @public
			 **/
			iClickTheButtonWithLabel: function(sLabelText, iIndex) {
				iIndex = iIndex ? iIndex : 0;
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: sLabelText
						}),
						new PropertyStrictEquals({
							name: "enabled",
							value: true
						})
					],
					success: function(oButton) {
						oButton = Array.isArray(oButton) ? oButton[iIndex] : oButton;
						oButton.firePress();
						Opa5.assert.ok(true, "Button with label '" + sLabelText + "' clicked successfully");
					},
					errorMessage: "The Button with label " + sLabelText + " could not be rendered/clicked"
				});
			},

			/**
			 * Click Overflow Toolbar Button, ex: Click on + on table, click on settings/personalization button on table.
			 *
			 * @param {String} sButtonName The displayed label text of the button to be clicked.
			 * @throws {Error} Throws an error if the Overflow Toolbar Button with visible label sButtonName is not rendered/clicked
			 * @return {*} success or failure
			 * @public
			 **/
			iSelectTheOverflowToolbarButton: function(sButtonName) {
				return this.waitFor({
					controlType: "sap.m.OverflowToolbarButton",
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: sButtonName
						}),
						new PropertyStrictEquals({
							name: "enabled",
							value: true
						})
					],
					success: function(oSettingsButton) {
						oSettingsButton = Array.isArray(oSettingsButton) ? oSettingsButton[0] : oSettingsButton;
						oSettingsButton.firePress();
						Opa5.assert.ok(true, "Overflow Toolbar Button with label '" + sButtonName + "' clicked successfully");
					},
					errorMessage: "Did not find the " + sButtonName + " button."
				});
			},

			/**
			 * Select Item from Combo Box Dropdown, ex: Choose Item under Table Personalisation->Group->Combo Box to set the Group By.
			 *
			 * @param {String} sItem is the Item to be chosen from the Combo Box Dropdown.
			 * @param {String} sLabel is the label of the Combo Box. If not passed, latest found Combobox control will be selected.
			 * @throws {Error} Throws an error if the sItem could not be selected
			 * @throws {Error} Throws an error if the Combo Box is not found
			 * @return {*} success or failure
			 * @public
			 **/
			iChoosetheItemFromComboBox: function(sItem, sLabel) {
				return this.waitFor({
					controlType: "sap.m.ComboBox",
					success: function(oCombobox) {
						if (!sLabel) {
							new Press().executeOn(oCombobox[oCombobox.length - 1]); //Due to backward compatibility reasons, the latest found combobox needs to be selected when no label is passed
						} else {
							for (var i = 0; i < oCombobox.length; i++) {
								if (oCombobox[i].getLabels().length > 0 && oCombobox[i].getLabels()[0].getText() === sLabel) {
									new Press().executeOn(oCombobox[i]);
									break;
								}
							}
						}
			            this.waitFor({
							controlType: "sap.m.StandardListItem", // sap.m.ComboBox do not support sap.ui.core.ListItem LR to check this case.
							matchers: [
			                    new PropertyStrictEquals({
									name: "title",
			                        value: sItem
			                    })
							],
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, "Item '" + sItem + "' selected from the Combo Box");
							},
							errorMessage: "Cannot select " + sItem + " from the Combo Box"
			            });
			        },
			        errorMessage: "Could not find the Combo Box"
				});
			},

			/**
			 * Select Item from Select Dropdown, ex: Choose Item under sap.m.Select control
			 *
			 * @param {String} sItem is the Item to be chosen from the Select Dropdown.
			 * @param {String} sLabel is the label of the Select Filter. If not passed, latest found Select control will be selected.
			 * @throws {Error} Throws an error if the sItem could not be selected
			 * @throws {Error} Throws an error if the Select control is not found
			 * @return {*} success or failure
			 * @public
			 **/
			iChoosetheItemFromSelectControl: function(sItem, sLabel) {
				return this.waitFor({
					controlType: "sap.m.Select",
			        success: function(oSelect) {
						if (!sLabel) {
							for (var j = oSelect.length - 1; j >= 0; j--) {
								//oSelect contains the object of control type "sap.uxap.HierarchicalSelect"
								if (oSelect[j].isA("sap.m.Select")) {
									new Press().executeOn(oSelect[j]);
									break;
								}
							}
						} else {
							for (var i = 0; i < oSelect.length; i++) {
								//oSelect contains the object of control type "sap.uxap.HierarchicalSelect"
								if (oSelect[i].isA("sap.m.Select") && oSelect[i].getLabels()[0].getText() === sLabel) {
									new Press().executeOn(oSelect[i]);
									break;
								}
							}
						}
						this.waitFor({
							controlType: "sap.ui.core.Item",
							matchers: [
								new PropertyStrictEquals({
									name: "text",
									value: sItem
			                    })
			                ],
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, "Item '" + sItem + "' selected from the Combo Box");
							},
							errorMessage: "Cannot select " + sItem + " from the Select Control"
			            });
					},
					errorMessage: "Could not find the Select Control"
				});
			},

			iSelectTheFirstCboBox: function() {
				return this.waitFor({
					controlType: "sap.m.ComboBox",
			        actions: new Press(),
			        success: function () {
						Opa5.assert.ok(true, "ComboBox was clicked");
			        },
			        errorMessage: "Could not find the Combo Box"
				});
			},

			iSelectTheItemFromFirstCboBox: function(sItem) {
				return this.waitFor({
                    controlType: "sap.m.StandardListItem", // sap.m.ComboBox do not support sap.ui.core.ListItem LR to check this case.
                    matchers: [
                        new PropertyStrictEquals({
							name: "title",
							value: sItem
                        })
                    ],
                    actions: new Press(),
                    success: function() {
						Opa5.assert.ok(true, "Item was selected");
		            },
                    errorMessage: "Cannot select " + sItem + " from the Combo Box"
                });
			},

			/* not yet working this way, MultiComboBox to be checked
			iChooseItmsFromMultiComboBox: function(oAppParams, sFieldName, oItems) {
				var oTestOpa5TestItem=null;
				return this.waitFor({
					controlType: "sap.m.MultiComboBox",
					//actions: new Press(),
					success: function(aControl) {
						this.waitFor({
							controlType: "sap.m.List", // sap.m.ComboBox do not support sap.ui.core.ListItem LR to check this case.
							matchers: [
								new PropertyStrictEquals({
									name: "text",
									value: sItem
								})
							],
							actions: new Press(),
							errorMessage: "Cannot select "+sItem+" from the Combo Box"
						});
					},
					errorMessage: "Could not find the Combo Box"
				});
			},
			*/

			iClickTheCtrlWithId: function(sId) {
				return this.waitFor({
					id: sId,
					success: function (oControl) {
						oControl.firePress();
						Opa5.assert.ok(true, "The control with id " + sId + " was clicked");
					},
					errorMessage: "The Control with id " + sId + " could not be found"
				});
			},

			iClickTheCtrlWhichContainsId: function(sId) {
				return this.waitFor({
					id: new RegExp(sId),
					success: function (aControls) {
						aControls[0].firePress();
						Opa5.assert.ok(true, "The control which contains id '" + sId + "' was clicked");
					},
					errorMessage: "The Control which contains id '" + sId + "' could not be found"
				});
			},

			iClickTheLstItemWithLabel: function(sLabelText, bState) {
				var oCheckBox = null;
				return this.waitFor({
					controlType: "sap.m.CheckBox",
					check: function(aCheckBox) {
						for (var i = 0; i < aCheckBox.length; i++) {
							var oContent = aCheckBox[i].getParent().getAggregation("content");
							if (oContent) {
								var sTitle = oContent[0].getItems() ? oContent[0].getItems()[0].getText() : oContent[0].getText();
								if (sTitle === sLabelText) {
									oCheckBox = aCheckBox[i];
									return true;
								}
							}
						}
						return false;
					},
					success: function() {
						oCheckBox.fireSelect({
							selected: bState
						});
						Opa5.assert.ok(true, "The list item with label '" + sLabelText + "' was checked");
					},
					errorMessage: "The list item with label " + sLabelText + " could not be rendered/checked"
				});
			},

			iClickTheBackBtnOnFLP: function() {
				return this.waitFor({
					id: "backBtn",
					matchers: [
						new PropertyStrictEquals({
							name: "enabled",
							value: true
						}),
						new PropertyStrictEquals({
							name: "visible",
							value: true
						})
					],
					success: function (oButton) {
						oButton.firePress();
						Opa5.assert.ok(true, "The back button of shell header was clicked successfully");
					},
					errorMessage: "The back button of shell header could not be found"
				});
			},

			iClickOnSmVarViewSelection: function(sId) {
				return this.waitFor({
					id: sId,
					actions: new Press(),
					success: function () {
						Opa5.assert.ok(true, "The Smart Variant view with id '" + sId + "' clicked successfully");
					},
					errorMessage: "The Smart Variant management cannot be clicked"
				});
			},



			// common assertions

			iSeeTheDialogWithTitle: function(sTitle) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: [
						new PropertyStrictEquals({
							name: "visible",
							value: true
						}),
						new PropertyStrictEquals({
							name: "title",
							value: sTitle
						})
					],
					success: function () {
						Opa5.assert.ok(true, "The dialog with title '" + sTitle + "' is currently visible");
					},
					errorMessage: "The dialog with title '" + sTitle + "' is currently not visible"
				});
			},

			/**
			 * Check if currently a dialog (sap.m.Dialog) is visible.
			 *
			 * @param {String} sContent The displayed message Content of the dialog to be checked.
			 * @throws {Error} Throws an error if the dialog is not shown
			 * @return {*} success or failure
			 * @public
			 **/
			iSeeTheDialogWithContent: function(sContent) {
				return this.waitFor({
					controlType: "sap.m.Text",
					searchOpenDialogs: true,
					success: function (aText) {
						var bTextMatched = false;
						aText.forEach(function (oText) {
							if (oText.getText() === sContent) {
								bTextMatched = true;
							}
						});
						Opa5.assert.ok(bTextMatched, "The dialog with Content '" + sContent + "' is currently visible");
					},
					errorMessage: "The dialog with Content '" + sContent + "' is currently not visible"
				});
			},

/*
			iSeeTheDialogWithContent: function(sContent) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: [
						function (oDialog) {
							if (typeof oDialog.getAggregation("content")[0].getText === "function") {
								return (oDialog.getAggregation("content")[0].getText() === sContent);
							} else {
								return (oDialog.getAggregation("content")[0].getAggregation("items")[0].getText() === sContent);
							}
						}
					],
					success: function (oDialog) {
						Opa5.assert.ok(true, "The dialog with Content '" + sContent + "' is currently visible");
					},
					errorMessage: "The dialog with Content '" + sContent + "' is currently not visible"
				});
			},
*/
			iSeeTheButtonOnTheDialog: function(sButton) {
				return this.waitFor({
					controlType: "sap.m.Button",
					searchOpenDialogs: true,
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: sButton
						}),
						new PropertyStrictEquals({
							name: "visible",
							value: true
						})
					],
					success: function () {
						Opa5.assert.ok(true, "The button '" + sButton + "' is visible on the dialog");
					},
					errorMessage: "The dialog with Button '" + sButton + "' is currently not visible"
				});
			},

			/**
			 * Checks whether the dialog is seen with the expected button
			 *
			 * @param {Array} aButton List of button text to be checked in the dialog.
			 * @return {*} success or failure
			 * @public
			**/
			iCheckTheButtonsOnTheDialog: function(aButton) {
				return this.waitFor({
					controlType: "sap.m.Button",
					searchOpenDialogs: true,
					success: function (aDialogButtons) {
						for (var i = 0; i < aButton.length; i++) {
							var bButtonFound = false;
							for (var j = 0; j < aDialogButtons.length; j++) {
								if (aDialogButtons[j].getText() === aButton[i] && aDialogButtons[j].getVisible()) {
									bButtonFound = true;
									break;
								}
							}
							Opa5.assert.ok(bButtonFound, "Button with label \"" + aButton[i] + "\" found in the dialog");
						}
					},
					errorMessage: "The dialog could not be found on the screen"
				});
			},

			iSeeThePopoverWithTitle: function(sTitle) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					matchers: new PropertyStrictEquals({
						name: "title",
						value: sTitle
					}),
					success: function () {
						Opa5.assert.ok(true, "The popover with title '" + sTitle + "' is currently visible");
					},
					errorMessage: "The popover with title '" + sTitle + "' is currently not visible"
				});
			},

			iSeeThePopoverWithMainNavigationId: function(sId) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					success: function (aPopovers) {
						Opa5.assert.equal(aPopovers.length, 1, "There is one open sap.m.Popover");
						var oPopover = aPopovers[0];
						this.waitFor({
							controlType: "sap.m.Title",
							searchOpenDialogs: true,
							matchers: [
								new Ancestor(oPopover, false)
							],
							success: function (aTitles) {
								Opa5.assert.equal(aPopovers.length, 1, "There is one sap.m.Title on the sap.m.Popover");
								var oTitle = aTitles[0];

								this.waitFor({
									controlType: "sap.m.Link",
									searchOpenDialogs: true,
									enabled: false, // always search for sap.m.Link control even if it's disabled
									matchers: [
										new Ancestor(oTitle, false),
										new PropertyStrictEquals({
											name: "text",
											value: sId
										})
									],
									success: function (aLinks) {
										Opa5.assert.equal(aLinks.length, 1, "There is one sap.m.Link as Content of the sap.m.Title");
										Opa5.assert.ok(true, "The popover with title '" + sId + "' is currently visible");
									},
									errorMessage: "There is no sap.m.Link with text '" + sId + "' on the sap.m.Popover"
								});
							},
							errorMessage: "There is no sap.m.Title on the sap.m.Popover"
						});
					},
					errorMessage: "The popover with title '" + sId + "' is currently not visible"
				});
			},

			iSeeThePopoverWithButtonLabel: function(sButtonLabel) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					check: function(oPopOver) {
						var aItems = oPopOver[0].getAggregation("content")[0].getItems();
						for (var i = 0; i < aItems.length; i++ ){
							if (aItems[i].getText() === sButtonLabel) {
									return true;
								}
							}
						return false;
						},
					success: function () {
						Opa5.assert.ok(true, "The popover with Button '" + sButtonLabel + "' is currently visible");
					},
					errorMessage: "The popover with Button '" + sButtonLabel + "' is currently not visible"
				});
			},

			iSeeTheButtonWithId: function(sId) {
				return this.waitFor({
					id: sId,
					matchers: new PropertyStrictEquals({
						name: "visible",
						value: true
					}),
					success: function () {
						Opa5.assert.ok(true, "The button with id '" + sId + "' is currently visible");
					},
					errorMessage: "The button with id " + sId + " could not be found"
				});
			},

			iDoNotSeeTheButtonWithIdInToolbar: function(sToolBarId, sButtonId){
				var aButtons = null;
				var bButtonVisibility = false;
				return this.waitFor({
					controlType: "sap.m.OverflowToolbar",
					id: sToolBarId,
					success: function(oToolbar) {
						aButtons = oToolbar.getContent();
						for (var i = 0; i < aButtons.length; i++ ){
							if (aButtons[i].sId === sButtonId) {
								bButtonVisibility = true;
								break;
							}
						}
						if (bButtonVisibility) {
							Opa5.assert.notOk(bButtonVisibility, "Button with id: " + sButtonId.split("--")[1] + " is available");
						} else {
							Opa5.assert.notOk(bButtonVisibility, "Button with id: " + sButtonId.split("--")[1] + " is not available");
						}
					},
					errorMessage: "Could not find the control" + sToolBarId
				});
			},

			iSeeTheButtonWithIcon: function(sIcon) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: [
						new PropertyStrictEquals({
							name: "icon",
							value: sIcon
						}),
						new PropertyStrictEquals({
							name: "visible",
							value: true
						})
					],
					success: function() {
						Opa5.assert.ok(true, "Found the button with icon " + sIcon);
					},
					errorMessage: "Did not find the button with icon " + sIcon
				});
			},

			iSeeTheControlWithId: function(sId) {
				return this.waitFor({
					id: sId,
					matchers: new PropertyStrictEquals({
						name: "visible",
						value: true
					}),
					success: function () {
						Opa5.assert.ok(true, "The control with id '" + sId + "' is currently visible");
					},
					errorMessage: "The control with id " + sId + " could not be found"
				});
			},

			theBtnWithIdIsEnabled: function(sId, bEnabled) {
				return this.waitFor({
					autoWait: bEnabled,
					id: sId,
					matchers: [
						new PropertyStrictEquals({
							name: "enabled",
							value: bEnabled
						})
					],
					success: function () {
						Opa5.assert.ok(true, "The button with id '" + sId + "' is " + (bEnabled ? "enabled" : "disabled"));
					},
					errorMessage: "The button with id '" + sId + "' and enablement '" + bEnabled + "' could not be found"
				});
			},

			theBtnWithLabelIsEnabled: function(sLabelText, bEnabled) {
				bEnabled = (bEnabled !== false) ? true : false;
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: sLabelText
						}),
						new PropertyStrictEquals({
							name: "enabled",
							value: bEnabled
						})
					],
					success: function() {
						Opa5.assert.ok(true, "The button with label '" + sLabelText + "' is " + (bEnabled ? " enabled" : " not enabled"));
					},
					errorMessage: "The Button with label " + sLabelText + " and enablement" + bEnabled + " could not be found"
				});
			},

			/**
			 * Checks if currently a button is visible
			 *
			 * @param {String} sLabel The label of the button.
			 * @throws {Error} Throws an error if the button is not rendered
			 * @return {*} success or failure
			 * @public
			**/
			iSeeTheButtonWithLabel: function(sLabel) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: sLabel
						}),
						new PropertyStrictEquals({
							name: "visible",
							value: true
						})
					],
					success: function() {
						Opa5.assert.ok(true,"The Button with label " + sLabel + " rendered successfully");
					},
					errorMessage: "The Button with label " + sLabel + " could not be rendered"
				});
			},

			/**
			 * Checks if currently a menuItem is visible
			 *
			 * @param {String} sLabel The label of the menuItem.
			 * @throws {Error} Throws an error if the menuItem is not rendered
			 * @return {*} success or failure
			 * @public
			**/
			iSeeTheMenuItemWithLabel: function(sLabel) {
				return this.waitFor({
					controlType: "sap.ui.unified.MenuItem",
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: sLabel
						}),
						new PropertyStrictEquals({
							name: "visible",
							value: true
						})
					],
					success: function() {
						Opa5.assert.ok(true,"The MenuItem with label " + sLabel + " rendered successfully");
					},
					errorMessage: "The MenuItem with label " + sLabel + " could not be rendered"
				});
			},

			theOvflowToolBarBtnIsEnabled: function(sButtonName, bEnabled, sIntTableId) {
				var aButtons = null;
				var oButton = null;
				return this.waitFor({
					controlType: "sap.m.OverflowToolbar",
					id: sIntTableId,
					check: function(oToolbar) {
						aButtons = oToolbar.getContent();
						for (var i = 0; i < aButtons.length; i++ ) {
							if (aButtons[i].isA("sap.m.Button") && aButtons[i].getText() === sButtonName) {
								oButton = aButtons[i];
								return true;
							}
						}
						return false;
					},
					success: function() {
						Opa5.assert.ok(oButton.getEnabled() === bEnabled, "The button with label '" + sButtonName + "' is enabled=" + bEnabled);
					},
					errorMessage: "Did not find the " + sButtonName + " button."
				});
			},

			/**
			 * To be used only in applications running in the FlexibleColumnLayout. Checks whether the current layout type is as expected
			 *
			 * @param {String} sLayout The layout type which is expected to be currently valid.
			 * @return {*} success or failure
			 * @public
			**/
			theFCLHasLayout: function(sLayout){
				return this.waitFor({
					controlType: "sap.f.FlexibleColumnLayout",
					matchers: new PropertyStrictEquals({
						name: "layout",
						value: sLayout
					}),
					success: function() {
						Opa5.assert.ok(true, "The FCL layout '" + sLayout + "' found as expected");
					},
					errorMessage: "Did not find the FlexibleColumnLayout with layout '" + sLayout + "'"
				});
			},

			iSetThePropertyValueInTable: function(sTableId, sPropertyName, sPropertyValue){
				return this.waitFor({
					controlType: "sap.m.Table",
					id: sTableId,
					success: function(oTable) {
						oTable.setProperty(sPropertyName,sPropertyValue);
						Opa5.assert.ok(true, "Property '" + sPropertyName + "' assigned a value '" + sPropertyValue + "' in table id '" + sTableId.split("--")[1] + "'");
					},
					errorMessage: "Could not find the table" + sTableId
				});
			},

			theListItemIsSelectedInTable: function(sTableId,iListItemIndex){
				return this.waitFor({
					controlType: "sap.m.Table",
					id: sTableId,
					success: function(oTable) {
						if (oTable.getItems()[iListItemIndex].mProperties.selected){
							Opa5.assert.ok(oTable.getItems()[iListItemIndex].mProperties.selected, "ListItem in table is selected");
						} else {
							Opa5.assert.ok(oTable.getItems()[iListItemIndex].mProperties.selected, "ListItem in table is not selected");
						}
					},
					errorMessage: "Could not find the table" + sTableId
				});
			},
			// common functions

			navigateBack: function() {
				return this.waitFor({
					success: function () {
						if (Opa5.getWindow() && Opa5.getWindow().history) {
							Opa5.getWindow().history.back();
							Opa5.assert.ok(true, "One step back navigation was successful");
						}
					}
				});
			},

			checkListReportTableTypeGridTable: function(sSmartTableObjectID) {
				return this.waitFor({
					id: sSmartTableObjectID,
					success: function(oSmartTableObject) {
						if (oSmartTableObject) {
							if (oSmartTableObject.getTable().isA("sap.ui.table.Table")) {
								return "--GridTable";
							} else {
								return "--responsiveTable";
							}
						}
						return null;
					},
					errorMessage: "Could not find object " + sSmartTableObjectID
				});
			},

			/**
			 * Checks app title value in shell header
			 *
			 * @param {String} sTitle value of app title
			 * @return {*} success or failure
			 * @public
			**/
			iCheckShellHeaderWithTitle: function(sTitle) {
				return this.waitFor({
					controlType: "sap.ushell.ui.ShellHeader",
					id: "shell-header",
					matchers: new PropertyStrictEquals({
						name: "visible",
						value: true
					}),
					success: function(oShellHeader) {
						var sAppTitle = oShellHeader.getAppTitle().getText();
						Opa5.assert.equal(sAppTitle, sTitle, "Expected shell app title to be: \"" + sTitle + "\"");
					},
					errorMessage: "Could not find shell header"
				});
			},

			iClickOnItemFromShellNavigationMenu: function (sText) {
				return this.waitFor({
					id: "shellAppTitle",
					success: function (oShellAppTitle) {
						new Press().executeOn(oShellAppTitle);
						Opa5.assert.ok(true, "The Control with id 'shellAppTitle' was clicked successfully");
						this.waitFor({
							id: "shellNavigationMenu",
							success: function (oShellNavigationMenu) {
								var aItems = oShellNavigationMenu.getItems();
								for (var i = 0; i < aItems.length; i++) {
									if (aItems[i].getTitle() === sText) {
										new Press().executeOn(aItems[i]);
										Opa5.assert.ok(true, "Item with text '" + sText + "' clicked successfully from ShellNavigationMenu List");
										return null;
									}
								}
								Opa5.assert.notOk(true, "Item with text '" + sText + "' not found on the ShellNavigationMenu List");
								return null;
							},
							errorMessage: "shellNavigationMenu not found on the screen"
						});
					},
					errorMessage: "shellAppTitle not found on the screen"
				});
			},

			iSeeTheMessageToastWithText: function (sExpectedText, sControlType) {
				var sActualToast;
				return this.waitFor({
					/**
					* waitFor controlType: sap.m.MessageToast doesn't work, currently below is a workaround
					**/
					controlType: sControlType, //Wait for anything on the page to avoid asynchronous execution
					success: function() {
						var bMatch = false;
						var iLength = document.getElementById("OpaFrame").contentWindow.document.getElementsByClassName("sapMMessageToast").length;
						for (var i = 0; i <= iLength - 1; i++) {
							sActualToast = document.getElementById("OpaFrame").contentWindow.document.getElementsByClassName("sapMMessageToast")[i].innerText;
							if (sActualToast === sExpectedText) {
								bMatch = true;
								break;
							}
						}
						Opa5.assert.ok(bMatch, "Toast message is displayed with the text: " + sExpectedText);
					},
					errorMessage: "Toast message not displayed properly on the screen"
				});
			},

			iClickTheShowDetailsButtonOnTableToolBar: function (sSmartTableId) {
				return this.waitFor({
					id: sSmartTableId,
					matchers: new PropertyStrictEquals({
						name: "visible",
						value: true
					}),
					success: function (oSmartTable) {
						var aToolBarButtons = oSmartTable.getToolbar().getContent();
						for (var i = 0; i < aToolBarButtons.length; i++) {
							if (aToolBarButtons[i].getId() === sSmartTableId + "-btnShowHideDetails") {
								var aButtons = aToolBarButtons[i].getItems();
								for (var j = 0; j < aButtons.length; j++) {
									if (aButtons[j].getKey() === "showDetails") {
										aButtons[j].firePress();
										Opa5.assert.ok(true, "Show Details button on the Table toolbar clicked successfully");
										return null;
									}
								}
							}
						}
						Opa5.assert.ok(true, "Show Details button not found on the Table toolbar and no click was performed");
						return null;
					},
					errorMessage: "Smart table not rendered on the screen"
				});
			},

			iSetInputFieldWithId: function (sId, sValue) {
				return this.waitFor({
					id: sId,
					matchers: new PropertyStrictEquals({
						name: "editable",
						value: true
					}),
					actions: new EnterText({
						text: sValue
					}),
					success: function () {
						Opa5.assert.ok(true, "Field value " + sValue + " was set correctly");
					},
					errorMessage: "Field with ID " + sId + " could not be found"
				});
			},

			iShouldNotSeeControlWithId: function (sControlId) {
				return this.waitFor({
					controlType: "sap.ui.core.Control",
					success: function (aControl) {
						for (var i = 0; i < aControl.length; i++) {
							if (aControl[i].getId() === sControlId) {
								Opa5.assert.notOk(true, "Control with Id '" + sControlId + "' is visible on the screen");
								return null;
							}
						}
						Opa5.assert.ok(true, "Control with Id '" + sControlId + "' is not visible on the screen");
					},
					errorMessage: "Error in checking the control"
				});
			}
		});
	}
);
