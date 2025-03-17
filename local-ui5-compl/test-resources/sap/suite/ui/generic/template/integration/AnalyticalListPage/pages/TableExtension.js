/*global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/suite/ui/generic/template/integration/Common/Common",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/table/plugins/MultiSelectionPlugin"
], function (Opa5, Press, Common, PropertyStrictEquals, MultiSelectionPlugin) {

	"use strict";
	function fnGetSelectionPluginForUITable (oUiTable) {
		return MultiSelectionPlugin.findOn(oUiTable);
	}
	
	Opa5.createPageObjects({
		onTheTable: {
			baseClass: Common,
			actions: {
				iSelectARow: function () {
					return this.waitFor({
						controlType: "sap.ui.table.AnalyticalTable",
						success: function (aTable) {
							var oAnalyticalTable = aTable[0];
							var oSelectionPlugin = fnGetSelectionPluginForUITable(oAnalyticalTable);
							(oSelectionPlugin || oAnalyticalTable).setSelectionInterval(0, 0);
							Opa5.assert.ok(true, "Row selected");
						},
						errorMessage: "Row not selected"
					});
				},
				iClearSelection: function () {
					return this.waitFor({
						controlType: "sap.ui.table.AnalyticalTable",
						success: function (aTable) {
							var oAnalyticalTable = aTable[0];
							var oSelectionPlugin = fnGetSelectionPluginForUITable(oAnalyticalTable);
							(oSelectionPlugin || oAnalyticalTable).clearSelection();
							Opa5.assert.ok(true, "Row deselected");
						},
						errorMessage: "Row not deselected"
					});
				},
				// generic function to select menu items of the column header
				iSelectColumnMenuItem: function (sItemText) {
					return this.waitFor({
						controlType: "sap.m.StandardListItem",
						searchOpenDialogs: true,
						matchers: [
							new PropertyStrictEquals({
								name: "title",
								value: sItemText
							})
						],
						actions: new Press(),
						success: function () {
							Opa5.assert.ok(true, "Item '" + sItemText + "' selected from the Items list");
						},
						errorMessage: "The Item '" + sItemText + "' is not available"
					});
				},
				iEnterFilterValue: function (sInput) {
					return this.waitFor({
						controlType: "sap.m.Input",
						success: function (oInput) {
							for (var i = 0; i < oInput.length; i++) {
								oInput[i].setValue(sInput);
								Opa5.assert.ok(true, "Filter value '" + sInput + "' entered to the input field");
								break;
							}
						},
						errorMessage: "Table Column Header is not clicked"
					});
				},
				iSelectRowInTable: function () {
					return this.waitFor({
						controlType: "sap.m.CheckBox",
						success: function (aCheckBox) {
							aCheckBox[1].fireSelect({
								selected: true
							});
							Opa5.assert.ok(true, "Row selected");
						}
					});
				}
			},
			assertions: {
				iSeeMultipleActionsInAColumn: function () {
					return this.waitFor({
						controlType: "sap.m.Table",
						check: function (aTable) {
							var iColWithActions;
							aTable[0].getColumns().forEach(function (oCol, i) {
								if (oCol.getId().indexOf("ActionGroupTest") > -1) {
									iColWithActions = i;
								}
							});
							if (iColWithActions) {
								var oCell = aTable[0].getItems()[0].getCells()[iColWithActions];
								var oCellItems = oCell.getItems();
								var bMultipleActions = oCellItems[0].isA("sap.m.Button") && oCellItems[1].isA("sap.m.Button")
								return bMultipleActions;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Table column with multiple actions is present")
						},
						errorMessage: "Table column multiple actions is not present"
					});
				},
				iCheckControlTypeInColumn: function (sControlType) {
					return this.waitFor({
						controlType: "sap.m.Table",
						check: function (aTable) {
							var sColumnIdString = sControlType === "sap.m.Avatar" ? "ProductPictureURL" : "GrossSalesRevenueBulletChart"
							var iColWithActions;
							aTable[0].getColumns().forEach(function (oCol, i) {
								if (oCol.getId().indexOf(sColumnIdString) > -1) {
									iColWithActions = i;
								}
							});
							if (iColWithActions !== undefined && iColWithActions >= 0) {
								var oCell = aTable[0].getItems()[0].getCells()[iColWithActions];
								var bIsControlPresent;
								if (sControlType.indexOf("SmartMicroChart") > -1) {
									bIsControlPresent = oCell.getItems()[0].isA(sControlType);
								}
								else {
									bIsControlPresent = oCell.isA(sControlType);
								}
								return bIsControlPresent;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Table column with " + sControlType + " is present")
						},
						errorMessage: "Table column " + sControlType + " is not present"
					});
				},

				iCheckIndicatorControlsInAColumn: function (sColumnIdString) {
					//sap.m.RatingIndicator, sap.m.ProgressIndicator
					return this.waitFor({
						controlType: "sap.ui.table.AnalyticalTable",
						check: function (aTable) {
							var iColWithControls;
							aTable[0].getColumns().forEach(function (oCol, i) {
								if (oCol.getId().indexOf(sColumnIdString) > -1) {
									iColWithControls = i;
								}
							});
							if (iColWithControls !== undefined && iColWithControls >= 0) {
								var oCell = aTable[0].getRows()[0].getCells()[iColWithControls];
								var bIsControlPresent = oCell.getItems()[0].isA("sap.m.RatingIndicator") && oCell.getItems()[1].isA("sap.m.ProgressIndicator");
								return bIsControlPresent;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Table column with Rating and Progress indicators are present")
						},
						errorMessage: "Table column with Rating and Progress indicators are not present"
					});
				},

				iCheckAbsenceOfActionButton: function(sName, sView, bEnabled) {
					return this.waitFor({
						controlType: "sap.m.Button",
						visible: !!bEnabled,
						check: function(aButton) {
							for (var i in aButton) {
								var oButton = aButton[i];
								if (oButton.getText() === sName && oButton.getParent().getId().search(sView) > -1) {
									return false;
								}
							}
							return true;
						},
						success: function() {
							Opa5.assert.ok(true, "The button is not present in the view " + sView);
						},
						errorMessage: "The button is present in the view " + sView
					});
				},
				/**
				* This function to check whether component appears on screen or not
				* @param {string} label text for the function
				* @param {string} type component type
				* @param {string} props Properties by which you want to identify the component
				* @param {string} sNameSpace Namespace of your application
				* @param {string} sComponent Component id that is holding your component
				* @param {string} sEntitySet name of the entityset
				*/
				iShouldSeeTheComponent: function (label, type, props, settings, sNameSpace, sComponent, sEntitySet) {
					var checkId;
					var checkStyleClass;
					var sAbsId = sNameSpace + "::" + sComponent + "::" + sEntitySet + "--"
					var waitForConfig = {
						controlType: type,
						check: function (comps) {
							for (var i = 0; i < comps.length; i++) {
								var comp = comps[i];
								if (checkId && comp.getId) {
									if (comp.getId() == checkId || comp.getId() == sAbsId + checkId) { // some IDs are namespaced
										return true;
									}

									continue;
								}

								if (checkStyleClass && comp.hasStyleClass) {
									for (var j = 0; j < checkStyleClass.length; j++) {
										if (comp.hasStyleClass(checkStyleClass)) {
											return true;
										}
									}

									continue;
								}

								if (comp.getVisible && comp.getVisible()) {
									return true;
								}
							}

							return false;
						},
						// timeout: 22,
						timeout: 70,
						success: function () {
							Opa5.assert.ok(true, "The table has the " + label + ".");
						},
						errorMessage: "Can't see the " + label + "."
					};

					if (props) {
						waitForConfig.matchers = [];
						for (var name in props) {
							if (name == 'id') {
								checkId = props[name];
								continue;
							}

							if (name == 'styleClass') {
								checkStyleClass = props[name];
								continue;
							}

							waitForConfig.matchers.push(
								new PropertyStrictEquals({
									name: name,
									value: props[name]
								})
							);
						}
					}

					if (settings) {
						for (var name in settings) {
							waitForConfig[name] = settings[name];
						}
					}

					return this.waitFor(waitForConfig);
				},
				iCheckQuickViewCard: function (aCardText) {
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.ui.layout.form.Form",
						searchOpenDialogs: true,
						check: function (aForm) {
							if (aForm[0]) {
								var matchedCardContentCount = 0;
								var aQuickViewCardContents = aForm[0].getFormContainers()[0].getFormElements();
								aQuickViewCardContents.forEach(function (oCardContent) {
									for (var i = 0; i < aCardText.length; i++) {
										if (oCardContent.getLabel().getText() === aCardText[i]) {
											matchedCardContentCount++;
										}
									}
								});
								if (aCardText.length === matchedCardContentCount) {
									bSuccess = true;
								}
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(bSuccess, "Quick View Card displays field set via annotations");
						},
						errorMessage: "Quick View Card does not display correct fields"
					});
				},
				iCheckTheQuickViewContactCard: function (oContactQuickViewContent) {
					return this.waitFor({
						controlType: "sap.m.Popover",
						success: function (oPopover) {
							var matchedCardContentCount = 0;
							var sFieldLabel;
							var bSuccess = false;
							var aPopoverItems = oPopover[0].getContent()[0].getItems();
							for (var i = 0; i < oContactQuickViewContent.length; i++) {
								sFieldLabel = oContactQuickViewContent[i];
								for (var j = 2; j < aPopoverItems.length; j++) {
									if (aPopoverItems[j].getItems()[0].getText() === (sFieldLabel + ':')) {
										matchedCardContentCount++;
									}
								}
							}
							if (oContactQuickViewContent.length === matchedCardContentCount) {
								bSuccess = true;
							}
							Opa5.assert.ok(bSuccess, "Quick View Card displays field set via annotations");
						},
						errorMessage: "Quick View Card does not display correct fields"
					});
				},
				iCheckIfColumnTemplateIsRenderedAsLink: function (sPropertyName) {
					return this.waitFor({
						controlType: "sap.ui.table.AnalyticalTable",
						autoWait: true,
						timeout: 30,
						check: function (aTable) {
							var aColumns = aTable[0].getColumns();
							var oPropertyColumn;
							for (var i = 0; i < aColumns.length; i++) {
								if (aColumns[i].getLeadingProperty() === sPropertyName) {
									oPropertyColumn = aColumns[i];
									break;
								}
							}
							var bPropertyRenderedAsLink = oPropertyColumn.getTemplate().isA("sap.ui.comp.navpopover.SmartLink");
							return bPropertyRenderedAsLink;
						},
						success: function () {
							Opa5.assert.ok(true, "Column property is rendered as Smart Link");
						},
						errorMessage: "Column property is not rendered as Smart Link"
					});
				}
			}
		}
	});
});
