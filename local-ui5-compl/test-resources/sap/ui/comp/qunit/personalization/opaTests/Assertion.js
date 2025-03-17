/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/message/MessageType",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/AggregationContainsPropertyEqual",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Descendant",
	"./Util",
	"./modules/waitForNavigationControl",
	"./modules/waitForP13nDialog",
	"./modules/waitForSelectWithSelectedTextOnPanel",
	"sap/ui/test/actions/Press"
], function(
	Opa5,
	DateFormat,
	MessageType,
	PropertyStrictEquals,
	AggregationContainsPropertyEqual,
	Ancestor,
	Descendant,
	TestUtil,
	waitForNavigationControl,
	waitForP13nDialog,
	waitForSelectWithSelectedTextOnPanel,
	Press
) {
	"use strict";

	var iShouldSeeSortSelectionWithSortOrder = function(sSelectionText, sSortOrderIcon) {
		var sSortOrder = sSortOrderIcon.slice(16, sSortOrderIcon.length);
		return this.waitFor({
			controlType: "sap.m.p13n.SortPanel",
			success: function(aPanels) {
				var oPanel = aPanels[0];
				waitForSelectWithSelectedTextOnPanel.call(this, sSelectionText, oPanel, {
					success: function(oSelect) {
						this.waitFor({
							controlType: "sap.ui.layout.Grid",
							matchers: new Descendant(oSelect),
							success: function(aGrids) {
								Opa5.assert.ok(aGrids.length === 1, "sap.ui.layout.Grid which wraps the sort order control found");
								var oGrid = aGrids[0];
								this.waitFor({
									controlType: "sap.m.SegmentedButton",
									matchers: [
										new AggregationContainsPropertyEqual({
											aggregationName: "buttons",
											propertyName: "icon",
											propertyValue: sSortOrderIcon
										}),
										new Ancestor(oGrid, false)
									],
									success: function(aSegmentedButton) {
										Opa5.assert.ok(aSegmentedButton.length === 1, "'" + sSortOrder + "' is chosen");
									}
								});
							}
						});
					}
				});
			}
		});
	};

	/**
	 * The Assertion can be used to...
	 *
	 * @class Assertion
	 * @extends sap.ui.test.Opa5
	 * @author SAP
	 * @private
	 * @alias sap.ui.comp.qunit.personalization.test.Assertion
	 */
	var Assertion = Opa5.extend("sap.ui.comp.qunit.personalization.test.Assertion", {
		isTabSelected: function(oNavigationControl, sTabName) {
			if (!oNavigationControl || sTabName === "") {
				return false;
			}
			var oSelectedItem = oNavigationControl.getItems().find(function(oItem){return oItem.getKey() === oNavigationControl.getSelectedKey();});
			return oSelectedItem.getText() === sTabName;
		},

		iShouldSeePersonalizationButton: function(sControlType) {
			sControlType = sControlType || "sap.m.OverflowToolbarButton";
			return this.waitFor({
				controlType: sControlType,
				viewName: "Main",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://action-settings"
				}),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "One button found");
					Opa5.assert.equal(aButtons[0].getIcon(), "sap-icon://action-settings", "The personalization button found");
				}
			});
		},

		iShouldSeeATable: function () {
			return this.waitFor({
				controlType: "sap.ui.comp.smarttable.SmartTable",
				check: function (aSmartTable) {
					return aSmartTable.length === 1;
				},
				success: function (aSmartTable) {
					Opa5.assert.ok(aSmartTable.length, "SmartTable is on the screen");
				},
				errorMessage: "No SmartTable found"
			});
		},

		iShouldSeeExportWarningDialog: function (sMessage) {
			return this.waitFor({
				controlType: "sap.m.Dialog",
				check: function (aDialog) {
					return aDialog.length == 1 && aDialog[0].getTitle() === TestUtil.getTextFromResourceBundle("sap.ui.export", "WARNING_TITLE");
				},
				success: function (oDialog) {
					Opa5.assert.equal(oDialog[0].getContent()[0].getText(), sMessage);
				},
				errorMessage: "No Warning dialog found"
			});
		},

		thePersonalizationDialogOpens: function() {
			// no need to set success as we check if the dialog is there in the waitForP13nDialog already
			return waitForP13nDialog.call(this, {});
		},

		thePersonalizationDialogShouldBeClosed: function() {
			var aDomP13nDialogs;
			return this.waitFor({
				check: function() {
					var frameJQuery = Opa5.getJQuery();
					var fnDialog = Opa5.getPlugin().getControlConstructor('sap.m.Dialog');
					aDomP13nDialogs =
						Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnDialog)
						.filter(function(oDialog) {
							// TODO same criterion as in waitForP13nDialog, reuse?
							return oDialog.hasStyleClass("sapMP13nPopup") || oDialog.hasStyleClass("sapUiMdcPersonalizationDialog");
						});
					return !aDomP13nDialogs.length;
				},
				success: function() {
					Opa5.assert.ok(!aDomP13nDialogs.length, "The personalization dialog is closed");
				}
			});
		},

		iShouldSeeWarning: function() {
			this.waitFor({
				controlType: "sap.m.Dialog",
				matchers: new PropertyStrictEquals({
					name: "title",
					value: "Warning"
				}),
				success: function(aDialogs){
					Opa5.assert.equal(aDialogs.length,1,"warning found");
				}
			});
		},

		iShouldSeeFilterIconOnAnalyticalColumn: function(sColumnName) {
			this.waitFor({
				controlType: "sap.ui.table.AnalyticalColumn",
				success: function(aAnalyticalColumns){
					let bColumnHasIcon = false;
					aAnalyticalColumns.forEach((oAnalyticalColumn) => {
						if (oAnalyticalColumn.getDomRef().classList.contains("sapUiTableColFiltered") && oAnalyticalColumn.sId.endsWith(sColumnName)) {
							bColumnHasIcon = true;
						}
					});
					Opa5.assert.equal(bColumnHasIcon, true, `${sColumnName} Column has Filter Icon` );
				}
			});
		},

		iShouldSeeNoFilterIconOnAnalyticalColumn: function(sColumnName) {
			this.waitFor({
				controlType: "sap.ui.table.AnalyticalColumn",
				success: function(aAnalyticalColumns){
					let bColumnHasIcon = false;
					aAnalyticalColumns.forEach((oAnalyticalColumn) => {
						if (oAnalyticalColumn.getDomRef().classList.contains("sapUiTableColFiltered") && oAnalyticalColumn.sId.endsWith(sColumnName)) {
							bColumnHasIcon = true;
						}
					});
					Opa5.assert.equal(bColumnHasIcon, false, `${sColumnName} Column has no Filter Icon` );
				}
			});
		},

		iShouldSeeNavigationControl: function() {
			return waitForNavigationControl.call(this, {
				success: function(oNavigationControl) {
					Opa5.assert.ok(oNavigationControl, "Navigation control found");
				}
			});
		},

		iShouldSeeFilterValueInCodeEditor: function(sId, sValue) {
			return this.waitFor({
				id: sId,
				success: function(oCE){
					if (oCE.getId() === sId) {
						var sCEValue = oCE.getValue().replace(/\n|\r/g, "").replace(/\s/g, '');
						sValue = JSON.stringify(sValue);
						Opa5.assert.equal(sCEValue, sValue, "The correct filter data has been created");
					}
				}
			});
		},
		iShouldSeeTableWithFilters: function(sId, aExpectedFilters) {
			return this.waitFor({
				id: sId,
				success: function(oTable) {
					var aFilters = oTable._getTablePersonalisationData().filters;

					Opa5.assert.equal(aFilters.length, aExpectedFilters.length, "Table has correct number of filters");
					Opa5.assert.equal(aFilters.toString(), aExpectedFilters.toString(), "Table has correct filters");
				}
			});
		},
		iShouldSeeComboBoxItems: function(aItems) {
			return this.waitFor({
				controlType: "sap.m.List",
				success: function(aLists) {
					Opa5.assert.ok(aLists.length === 2, " two lists appears");
					aItems.forEach(function(sText){
						// now there are two lists - one for the innerP13nList and the second one is the dropdown
						aLists[1].getItems().forEach(function(oListItem){
							if (sText === oListItem.getTitle()){
								Opa5.assert.equal(sText, oListItem.getTitle(), "Item " + sText + " found in ComboBox");
							}
						});
					});
				},
				errorMessage: "sap.m.List not found"
			});
		},

		iShouldSeeDropdownWithItems: function(sId, aItems) {
			return this.waitFor({
				id: sId,
				controlType: "sap.m.List",
				success: function(oList) {
					Opa5.assert.equal(oList.getItems().length, aItems.length, "dropdown list has correct number of items");
					aItems.forEach(function(sText){
						oList.getItems().forEach(function(oListItem){
							if (sText === oListItem.getTitle()){
								Opa5.assert.equal(sText, oListItem.getTitle(), "Item " + sText + " found in ComboBox");
							}
						});
					});
				},
				errorMessage: "sap.m.List not found"
			});
		},

		iShouldSeeDropdownFirstItem: function(sId, sItem) {
			return this.waitFor({
				id: sId,
				controlType: "sap.m.List",
				success: function(oList) {
					Opa5.assert.equal(oList.getItems()[0].getTitle(), sItem, "Item " + sItem + " found in ComboBox");
				},
				errorMessage: "sap.m.List not found"
			});
		},

		iShouldSeeSelectListItems: function(aItems) {
			return this.waitFor({
				controlType: "sap.m.SelectList",
				success: function(aLists) {
					Opa5.assert.ok(aLists.length === 1, "list appears");
					aItems.forEach(function(sText){
						var oItemMatch;
						aLists[0].getItems().forEach(function(oListItem){
							if (sText === oListItem.getText()){
								oItemMatch = oListItem;
							}
						});
						Opa5.assert.equal(sText, oItemMatch.getText(), "Item " + sText + " found in ComboBox");
					});
				},
				errorMessage: "sap.m.Selectlist or Item in List not found!"
			});
		},

		iShouldSeeNavigationControlWithPanels: function(iNumberOfPanels) {

			return waitForNavigationControl.call(this, {
				success: function(oNavigationControl) {

					//Mobile
					if (oNavigationControl.isA("sap.m.List")) {
						Opa5.assert.ok(oNavigationControl.getItems().length === iNumberOfPanels, "List with " + iNumberOfPanels + " lines should appear");
					}

					//New Layout
					if (oNavigationControl.isA("sap.m.IconTabBar")) {
						Opa5.assert.ok(oNavigationControl.getItems().length === iNumberOfPanels, "IconTabBar with " + iNumberOfPanels + " tabs should appear");
					}

					//Old Layout
					if (oNavigationControl.isA("sap.m.SegmentedButton")) {
						Opa5.assert.ok(oNavigationControl.getButtons().length === iNumberOfPanels, "Segmented Button with " + iNumberOfPanels + " tabs should appear");
					}
				}
			});
		},

		iShouldSeePanelsInOrder: function(aOrderedPanelNames) {

			return waitForNavigationControl.call(this, {
				success: function(oNavigationControl) {

					//Mobile
					if (oNavigationControl.isA("sap.m.List")) {
						Opa5.assert.ok(oNavigationControl.getItems());
					}

					//New Layout
					if (oNavigationControl.isA("sap.m.IconTabBar")) {
						aOrderedPanelNames.forEach(function(sPanelName, iIndex) {
							var sTabText = oNavigationControl.getItems()[iIndex].getText();
							Opa5.assert.ok(sTabText === sPanelName, (iIndex + 1) + ". tab should be " + sPanelName);
						});
					}

					//Old Layout
					if (oNavigationControl.isA("sap.m.SegmentedButton")) {
						aOrderedPanelNames.forEach(function(sPanelName, iIndex) {
							var sTabText = oNavigationControl.getButtons()[iIndex].getText();
							Opa5.assert.ok(sTabText === sPanelName, (iIndex + 1) + ". tab should be " + sPanelName);
						});
					}
				}
			});
		},

		iShouldSeeSelectedTab: function(sPanelName) {
			return waitForNavigationControl.call(this, {
				success: function(oNavigationControl) {

					//Mobile
					if (oNavigationControl.isA("sap.m.List")) {
						//No selected tab on mobile
						return;
					}
					Opa5.assert.ok(this.isTabSelected(oNavigationControl, sPanelName), "The '" + sPanelName + "' tab is selected");
				}
			});
		},

		iShouldSeePanel: function(sPanelClass) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: sPanelClass,
				success: function(aPanels) {
					Opa5.assert.ok(aPanels[0].getVisible(), "The '" + sPanelClass + "' tab is visible");
				}
			});
		},

		iShouldSeeTheCheckboxSelectAllSwitchedOn: function(bIsSwitchedOn) {
			var oSelectAllCheckbox;
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.CheckBox",
				check: function(aCheckboxes) {
					return aCheckboxes.filter(function(oCheckbox) {
						if (oCheckbox.getId().endsWith("-sa")) {
							oSelectAllCheckbox = oCheckbox;
							return true;
						}
						return false;
					});
				},
				success: function() {
					Opa5.assert.ok(oSelectAllCheckbox.getSelected() === bIsSwitchedOn);
				}
			});
		},

		iShouldSeeTableWithFixedColumnCount: function(iFixedColumnCount) {
			return this.waitFor({
				controlType: "sap.ui.table.Table",
				success: function(aTables) {
					Opa5.assert.equal(aTables.length, 1, "Only one table should be displayed");
					Opa5.assert.equal(aTables[0].getFixedColumnCount(), iFixedColumnCount, "Table has " + iFixedColumnCount + " fixed columns");
				}
			});
		},

		iShouldSeeColumnOfWidth: function(sColumnName, sWidth) {
			return this.waitFor({
				controlType: "sap.ui.table.Column",
				matchers: [
					new AggregationContainsPropertyEqual({
						aggregationName: "label",
						propertyName: "text",
						propertyValue: sColumnName
					}),
					new PropertyStrictEquals({
						name: "width",
						value: sWidth
					})
				],
				success: function(aColumns) {
					Opa5.assert.equal(aColumns.length, 1, "Column '" + sColumnName + "' found with width of '" + sWidth + "'");
				}
			});
		},

		iShouldSeeVisibleColumnsInOrder: function(sColumnType, aOrderedColumnNames) {
			var aDomColumns;
			return this.waitFor({
				controlType: sColumnType,
				check: function() {
					var frameJQuery = Opa5.getJQuery();
					var fnDialog = Opa5.getPlugin().getControlConstructor(sColumnType);
					aDomColumns = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnDialog);
					return aDomColumns.length === aOrderedColumnNames.length;
				},
				success: function() {
					Opa5.assert.equal(aOrderedColumnNames.length, aDomColumns.length);
					aDomColumns.forEach(function(oColumn, iIndex) {
						var sLabel = oColumn.getMetadata().getName() === "sap.m.Column" ? oColumn.getHeader().getText() : oColumn.getLabel().getText();
						Opa5.assert.equal(sLabel, aOrderedColumnNames[iIndex], "Column '" + aOrderedColumnNames[iIndex] + "' is visible on position " + (iIndex + 1));
					});
				}
			});
		},

		iShouldSeeVisibleDimensionsInOrder: function(aOrderedDimensionNames) {
			var aDomElements;
			return this.waitFor({
				controlType: "sap.chart.Chart",
				check: function() {
					var frameJQuery = Opa5.getJQuery();
					var fnControl = Opa5.getPlugin().getControlConstructor("sap.chart.Chart");
					aDomElements = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnControl);
					return aDomElements[0].getVisibleDimensions().length === aOrderedDimensionNames.length;
				},
				success: function() {
					Opa5.assert.equal(aDomElements.length, 1, "One sap.chart.Chart control found");
					Opa5.assert.equal(aDomElements[0].getVisibleDimensions().length, aOrderedDimensionNames.length, "Chart contains " + aOrderedDimensionNames.length + " visible dimensions");
					aDomElements[0].getVisibleDimensions().forEach(function(sDimensionName, iIndex) {
						Opa5.assert.equal(sDimensionName, aOrderedDimensionNames[iIndex], "Dimension '" + sDimensionName + "' is visible on position " + (iIndex + 1));
					});
				}
			});
		},

		iShouldSeeVisibleMeasuresInOrder: function(aOrderedMeasureNames) {
			var aDomElements;
			return this.waitFor({
				controlType: "sap.chart.Chart",
				check: function() {
					var frameJQuery = Opa5.getJQuery();
					var fnControl = Opa5.getPlugin().getControlConstructor("sap.chart.Chart");
					aDomElements = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnControl);
					return aDomElements[0].getVisibleMeasures().length === aOrderedMeasureNames.length;
				},
				success: function() {
					Opa5.assert.equal(aDomElements.length, 1, "One sap.chart.Chart control found");
					Opa5.assert.equal(aDomElements[0].getVisibleMeasures().length, aOrderedMeasureNames.length, "Chart contains " + aOrderedMeasureNames.length + " visible measures");
					aDomElements[0].getVisibleMeasures().forEach(function(sMeasureName, iIndex) {
						Opa5.assert.equal(sMeasureName, aOrderedMeasureNames[iIndex], "Measure '" + sMeasureName + "' is visible on position " + (iIndex + 1));
					});
				}
			});
		},

		iShouldSeeChartOfType: function(sChartTypeKey) {
			var aDomElements;
			return this.waitFor({
				controlType: "sap.chart.Chart",
				check: function() {
					var frameJQuery = Opa5.getJQuery();
					var fnControl = Opa5.getPlugin().getControlConstructor("sap.chart.Chart");
					aDomElements = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnControl);
					return aDomElements[0].getChartType() === sChartTypeKey;
				},
				success: function() {
					Opa5.assert.equal(aDomElements.length, 1, "One sap.chart.Chart control found");
					Opa5.assert.equal(aDomElements[0].getChartType(), sChartTypeKey, "The chart type of the Chart is '" + sChartTypeKey + "'");
				}
			});
		},

		iShouldSeeComboBoxWithChartType: function(sChartTypeText) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sChartTypeText
				}),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "One Combobox found");
					Opa5.assert.equal(aComboBoxes[0].getValue(), sChartTypeText, "The Combobox has value equal to chart type '" + sChartTypeText + "'");
				}
			});
		},

		iShouldSeeChartTypeButtonWithIcon: function(sIcon) {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbarButton",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: sIcon
				}),
				success: function(aOverflowToolbarButtons) {
					Opa5.assert.equal(aOverflowToolbarButtons.length, 1, "One sap.m.OverflowToolbarButton control found");
					Opa5.assert.equal(aOverflowToolbarButtons[0].getIcon(), sIcon, "The chart type icon of the chart type button is '" + sIcon + "'");
				}
			});
		},

		theNumberOfSelectedDimeasuresShouldRemainStable: function() {
			return this.waitFor({
				controlType: "sap.chart.Chart",
				success: function(aCharts) {
					var oChart = aCharts[0];
					var aVisibleCols = [];
					oChart.getModel().getServiceAnnotations()["EPM_DEVELOPER_SCENARIO_SRV.Product"]["com.sap.vocabularies.UI.v1.Chart"]["Dimensions"].forEach(function(oItem) {
						aVisibleCols.push(oItem.PropertyPath);
					});
					oChart.getModel().getServiceAnnotations()["EPM_DEVELOPER_SCENARIO_SRV.Product"]["com.sap.vocabularies.UI.v1.Chart"]["Measures"].forEach(function(oItem) {
						aVisibleCols.push(oItem.PropertyPath);
					});
					Opa5.assert.ok((oChart.getVisibleDimensions().length + oChart.getVisibleMeasures().length) === aVisibleCols.length);
				}
			});
		},

		theTableShouldContainColumns: function(sTableType, iNumberColumns) {
			return this.waitFor({
				controlType: sTableType,
				check: function(aTables) {
					return aTables[0].getColumns().length === iNumberColumns;
				},
				success: function(aTables) {
					Opa5.assert.ok(aTables[0].getColumns().length === iNumberColumns, "Table contains " + iNumberColumns + " columns");
				}
			});
		},

		iShouldSeeItemWithText: function(sItemText, fnAdditionalCheck) {
			return waitForP13nDialog.call(this, {
				success: function(oP13nDialog) {
					var bChart = oP13nDialog.getParent().getMetadata().getName().includes("Chart");
					var sControlType = bChart ? "sap.m.Text" : "sap.m.Label";
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Table",
						matchers: new Ancestor(oP13nDialog, false),
						success: function(aTables) {
							var oTable = aTables[0];
							this.waitFor({
								controlType: sControlType,
								matchers: [
									new Ancestor(oTable, false),
									new PropertyStrictEquals({
										name: "text",
										value: sItemText
									})
								],
								success: function(aTexts) {
									var oText = aTexts[0];
									this.waitFor({
										controlType: "sap.m.ColumnListItem",
										matchers: [
											new Descendant(oText)
										],
										success: function(aColumnListItems) {
											Opa5.assert.equal(aColumnListItems.length, 1);
											Opa5.assert.ok(aColumnListItems[0]);
											Opa5.assert.equal(aColumnListItems[0].getVisible(), true);
											if (fnAdditionalCheck) {
												fnAdditionalCheck.call(this, aColumnListItems[0]);
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

		iShouldSeeItemWithSelection: function(sItemText, bSelected) {
			var fnCheckIfItemIsSelected = function(oItem) {
				Opa5.assert.equal(oItem.getSelected(), bSelected, sItemText + " is " + (bSelected ? "selected" : "unselected"));
			};
			return this.iShouldSeeItemWithText.call(this, sItemText, fnCheckIfItemIsSelected);
		},

		iShouldSeeItemOnPosition: function(sItemText, iIndex) {
			var fnCheckIfItemIsInPosition = function(oItem) {
				Opa5.assert.equal(oItem.getParent().getItems().indexOf(oItem), iIndex, sItemText + " is on position " + iIndex);
			};
			return this.iShouldSeeItemWithText.call(this, sItemText, fnCheckIfItemIsInPosition);
		},

		iShouldSeeMarkingOfItem: function(sItemText, bMarked) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Table",
				success: function(aTables) {
					var aItems = aTables[0].getItems().filter(function(oItem) {
						return oItem.getCells()[0].getText() === sItemText;
					});
					Opa5.assert.equal(aItems.length, 1);
					Opa5.assert.ok(aItems[0]);
					Opa5.assert.equal(aItems[0].getVisible(), true);
					var bIsMarked = aItems[0].$().hasClass("sapMP13nColumnsPanelItemSelected");
					Opa5.assert.equal(bIsMarked, bMarked, sItemText + " is " + (bIsMarked ? "" : "not ") + "marked");
				}
			});
		},

		iShouldSeeGroupSelectionWithColumnName: function(sColumnName) {
			return waitForP13nDialog.call(this, {
				success: function(oP13nDialog) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.ComboBox",
						matchers: new Ancestor(oP13nDialog, false),
						success: function(aComboBoxes) {
							var aComboBox = aComboBoxes.filter(function(oComboBox) {
								if (!oComboBox.getSelectedItem()) {
									return sColumnName === "(none)";
								}
								return oComboBox.getSelectedItem().getText() === sColumnName;
							});
							Opa5.assert.equal(aComboBox.length, 1, "Select with selected column '" + sColumnName + "' is found");
						}
					});
				}
			});
		},

		iShouldSeeGroupSelectionOnPosition: function(sColumnName, iIndex) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var aComboBox = aComboBoxes.filter(function(oComboBox) {
						if (!oComboBox.getSelectedItem()) {
							return sColumnName === "(none)";
						}
						return oComboBox.getSelectedItem().getText() === sColumnName;
					});
					Opa5.assert.equal(aComboBox.length, 1, "Combobox with selected column '" + sColumnName + "' is found");
					Opa5.assert.equal(aComboBoxes.indexOf(aComboBox[0]), iIndex, "Combobox with selected column '" + sColumnName + "' is on position " + iIndex);
				}
			});
		},

		iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn: function(sSelectionText, bChecked) {
			return this.waitFor({
				controlType: "sap.m.p13n.GroupPanel",
				success: function(aPanels) {
					var oPanel = aPanels[0];
					return waitForSelectWithSelectedTextOnPanel.call(this, sSelectionText, oPanel, {
						success: function(oSelect) {
							this.waitFor({
								controlType: "sap.ui.layout.Grid",
								matchers: new Descendant(oSelect),
								success: function(aGrids) {
									Opa5.assert.ok(aGrids.length === 1, "sap.ui.layout.Grid which wraps the checkbox control found");
									var oGrid = aGrids[0];
									this.waitFor({
										controlType: "sap.m.CheckBox",
										matchers: [
											new Ancestor(oGrid, false),
											new PropertyStrictEquals({
												name: "selected",
												value: bChecked
											})
										],
										success: function(aCheckBoxes) {
											Opa5.assert.equal(aCheckBoxes.length, 1, "The CheckBox is " + (bChecked ? "on" : "off"));
										}
									});
								}
							});
						}
					});
				}
			});
		},

		iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn: function(sSelectionText, bEnabled) {
			return this.waitFor({
				controlType: "sap.m.p13n.GroupPanel",
				success: function(aPanels) {
					var oPanel = aPanels[0];
					return waitForSelectWithSelectedTextOnPanel.call(this, sSelectionText, oPanel, {
						success: function(oSelect) {
							this.waitFor({
								controlType: "sap.ui.layout.Grid",
								matchers: new Descendant(oSelect),
								success: function(aGrids) {
									Opa5.assert.ok(aGrids.length === 1, "sap.ui.layout.Grid which wraps the checkbox control found");
									var oGrid = aGrids[0];
									this.waitFor({
										controlType: "sap.m.CheckBox",
										matchers: [
											new Ancestor(oGrid),
											new PropertyStrictEquals({
												name: "enabled",
												value: bEnabled
											})
										],
										success: function(aCheckBoxes) {
											Opa5.assert.equal(aCheckBoxes.length, 1, "The CheckBox is " + (bEnabled ? "enabled" : "disabled"));
										}
									});
								}
							});
						}
					});
				}
			});
		},

		iShouldSeeDisabledOperationsDropdown: function() {
			return this.waitFor({
				controlType: "sap.ui.layout.form.SimpleForm",
				searchOpenDialogs: true,
				success: function (aPanels) {
					var oConditionPanel = aPanels[0].getContent()[0],
						oConditions = oConditionPanel.findAggregatedObjects(true, function (oControl) {
							return oControl.isA("sap.m.ComboBox") && oControl.getItems().some(function(oItem) {
								return oItem.getText() === "Include";
							});
						})[0];
					Opa5.assert.equal(oConditions.getEnabled(), false, "The Operations dropdown is disabled");
				}
			});
		},

		theComboBoxShouldHaveWarningMessage: function() {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					Opa5.assert.ok(oComboBox.getValueState() === MessageType.Warning);
					Opa5.assert.ok(oComboBox.getValueStateText() === TestUtil.getTextFromResourceBundle("sap.ui.comp", "PERSODIALOG_MSG_GROUPING_NOT_POSSIBLE_DESCRIPTION"));
				}
			});
		},

		theComboBoxShouldNotHaveWarningMessage: function() {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					Opa5.assert.ok(oComboBox.getValueState() === MessageType.None);
					Opa5.assert.ok(oComboBox.getValueStateText() === "");
				}
			});
		},

		iCheckSelectValueState: function(sValueState) {
			return this.waitFor({
				controlType: "sap.m.Select",
				success: function(aSelect) {
					var oSelect = aSelect[0];
					Opa5.assert.ok(oSelect.getValueState() === sValueState);
				}
			});
		},

		iCheckInputValueState: function(sValueState) {
			return this.waitFor({
				controlType: "sap.m.Input",
				success: function(aInput) {
					var oInput = aInput[0];
					Opa5.assert.ok(oInput.getValueState() === sValueState, "ValueState is as expected.");
				}
			});
		},
		iCheckInputValueStateWithId: function(sId, sValueState) {
			return this.waitFor({
				controlType: "sap.m.Input",
				id: sId,
				success: function(oInput) {
					Opa5.assert.ok(oInput.getValueState() === sValueState, "ValueState is as expected.");
				}
			});
		},
		theSelectShouldHaveItemWithText: function(sValue, sItemText) {
			return this.waitFor({
				controlType: "sap.m.p13n.SortPanel",
				success: function(aPanels) {
					var oPanel = aPanels[0];
					return waitForSelectWithSelectedTextOnPanel.call(this, sValue, oPanel, {
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
												value: sItemText
											})
										],
										success: function(aItems) {
											Opa5.assert.ok(aItems.length === 1, "Item with text '" + sItemText + "' found");
											new Press().executeOn(oSelect);
										}
									});
								}
							});
						}
					});
				}
			});
		},
		iShouldSeeConditionInputOfType: function(sType) {
			return this.waitFor({
				controlType: "sap.ui.comp.p13n.P13nConditionPanel",
				searchOpenDialogs: true,
				success: function(aPanels) {
					var oPanel = aPanels[0],
						aConditionGrid = oPanel._oConditionsGrid.getContent()[0].getContent(),
						iLength = aConditionGrid.length,
						// last two items of the conditions grid are the two buttons 'X' and 'Add'
						// so we expect that the value input field is before the buttons
						oInput = aConditionGrid[iLength - 4];

					Opa5.assert.equal(oInput.getMetadata().getName(), sType, "Input is with correct type");
				}
			});
		},
		iShouldSeeFilterOfType: function(sId, sType) {
			return this.waitFor({
				id: sId,
				searchOpenDialogs: true,
				success: function(oField) {
					Opa5.assert.equal(oField.getMetadata().getName(), sType, "Field is with correct type");
				}
			});
		},
		iShouldSeeConditionInputWithValueState: function(sValueState) {
			return this.waitFor({
				controlType: "sap.ui.comp.p13n.P13nConditionPanel",
				searchOpenDialogs: true,
				success: function(aPanels) {
					var oPanel = aPanels[0],
						aConditionGrid = oPanel._oConditionsGrid.getContent()[0].getContent(),
						iLength = aConditionGrid.length,
						// last two items of the conditions grid are the two buttons 'X' and 'Add'
						// so we expect that the value input field is before the buttons
						oInput = aConditionGrid[iLength - 4];

					Opa5.assert.equal(oInput.getValueState(), sValueState, "Input is with correct ValueState");
				}
			});
		},
		iShouldSeeSortSelectionWithColumnName: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.p13n.SortPanel",
				success: function(aPanels) {
					var oPanel = aPanels[0];
					return waitForSelectWithSelectedTextOnPanel.call(this, sColumnName, oPanel, {
						success: function(oSelect) {
							Opa5.assert.ok(oSelect, "'" + sColumnName + "' is sorted");
						}
					});
				}
			});
		},

		iShouldSeeSortSelectionWithSortOrderAscending: function(sSelectionText) {
			return iShouldSeeSortSelectionWithSortOrder.call(this, sSelectionText, "sap-icon://sort-ascending");
		},

		iShouldSeeSortSelectionWithSortOrderDescending: function(sSelectionText) {
			return iShouldSeeSortSelectionWithSortOrder.call(this, sSelectionText, "sap-icon://sort-descending");
		},

		iShouldSeeFilterSelectionWithColumnName: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					Opa5.assert.ok(oComboBox.getSelectedItem().getText() === sColumnName, "Column '" + sColumnName + "' found");
				}
			});
		},

		iShouldSeeFilterSelectionWithOperation: function(sOperation) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[1];
					Opa5.assert.ok(oComboBox.getSelectedItem().getText() === sOperation, "Operation '" + sOperation + "' found");
				}
			});
		},

		iShouldSeeEmptyFilterPanel: function() {
			return this.waitFor({
				controlType: "sap.m.CustomListItem",
				//matchers: new Ancestor(oFilterPanel, false),
				success: function(aCustomListItems) {
					var oList = aCustomListItems[0].getList(),
						aListItems = oList.getItems();
					// When FilterPanel is empty the expected length of the list items is 1 - the one containing the 'Filter by' dropdown
					Opa5.assert.equal(aListItems.length, 1, "There are no filters added ");
				}
			});
		},

		iShouldSeeFilterWithNameAndToken: function(sName, sTokenText, sOperation, sControlType) {
			return this.waitFor({
				controlType: sControlType ? sControlType : "sap.ui.comp.smartfilterbar.SFBMultiInput",
				success: function(aControls) {
					var oControl = aControls[0];
					Opa5.assert.equal(oControl._sControlName, sName, "Control " + sName + " is created");
					Opa5.assert.equal(oControl.getTokens().length, 1, "The created control has one token");
					Opa5.assert.equal(oControl.getTokens()[0].getText(), sTokenText, "The created control has correct token text");
					Opa5.assert.equal(oControl.getTokens()[0].data().range.operation, sOperation, "The created token has correct operation");
				}
			});
		},

		iShouldSeeInputWithValue: function(sId, sValue) {
			return this.waitFor({
				controlType: "sap.m.Input",
				id: sId,
				success: function(oControl) {
					Opa5.assert.equal(oControl.getValue(), sValue, "Input has correct value " + sValue);
				}
			});
		},
		iShouldSeeFilterWithValue: function(sId, sValue) {
			return this.waitFor({
				id: sId,
				success: function(oControl) {
					Opa5.assert.equal(oControl.getValue(), sValue, "Input has correct value " + sValue);
				}
			});
		},
		iShouldSeeFilterBarExpanded: function() {
			return this.waitFor({
				controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
				success: function(aSFB) {
					var oSFB = aSFB[0];
					Opa5.assert.equal(oSFB.getFilterBarExpanded(), true, "FilterBar is expanded");
				}
			});
		},
		iShouldSeeAllFilters: function() {
			return this.waitFor({
				controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
				success: function(aSFB) {
					var oSFB = aSFB[0];
					Opa5.assert.equal(oSFB.getShowAllFilters(), true, "showAllFilters is correctly set to true");
					Opa5.assert.equal(oSFB._getShowAllFiltersButton().getDomRef(), null, "Show all filters button is not visible");
				}
			});
		},
		iShouldSeeFilterSelectionWithValueDate: function(sDate) {
			var bFound = false;
			return this.waitFor({
				controlType: "sap.m.DatePicker",
				check: function(aDatePickers) {
					return aDatePickers.filter(function(oDatePicker) {
						sDate = DateFormat.getDateInstance().format(new Date(sDate));
						if (oDatePicker.getValue() === sDate) {
							bFound = true;
							return true;
						}
						return false;
					});
				},
				success: function() {
					Opa5.assert.ok(bFound);
				}
			});
		},

		iShouldSeeFilterOverflowToolBar: function() {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbar",
				success: function(aOverflowToolBars) {
					Opa5.assert.notEqual(aOverflowToolBars.find(function(oOverflowToolbar){return oOverflowToolbar.hasStyleClass("sapMListInfoTBar");}), undefined, "Filter overflowToolbar exists");
				},
				errorMessage: "Filter OverflowToolbar is not visible"
			});
		},

		iShouldNotSeeFilterOverflowToolBar: function() {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbar",
				success: function(aOverflowToolBars) {
					Opa5.assert.equal(aOverflowToolBars.find(function(oOverflowToolbar){return oOverflowToolbar.hasStyleClass("sapMListInfoTBar");}), undefined, "Filter overflowToolbar exists");
				},
				errorMessage: "Filter OverflowToolbar is still visible"
			});
		},

		iShouldSeeFilterSelectionWithValueInput: function(sText) {
			return this.waitFor({
				controlType: "sap.m.Input",
				success: function(aInputs) {
					var oInput = aInputs[0];
					Opa5.assert.ok(oInput.getValue() === sText);
				}
			});
		},

		iShouldSeeFilterMultiComboBox: function(sName) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartfilterbar.SFBMultiComboBox",
				success: function(aControls) {
					var oControl = aControls[0];
					Opa5.assert.equal(oControl._sControlName, sName, "Control " + sName + " is created");
				}
			});
		},

		theNumberOfFilterableColumnKeysShouldRemainStable: function() {
			var oTable = null;
			this.waitFor({
				controlType: "sap.ui.table.Table",
				success: function(aTables) {
					oTable = aTables[0];
				}
			});
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					var oResult = oTable.getModel().getAnalyticalExtensions().findQueryResultByName("ProductCollection");
					var aFilterableColumns = oResult._oEntityType.getFilterablePropertyNames();
					Opa5.assert.ok(oComboBox.getKeys().length === aFilterableColumns.length);
				}
			});
		},

		theNumberOfSortableColumnKeysShouldRemainStable: function() {
			var oTable = null;
			this.waitFor({
				controlType: "sap.ui.table.Table",
				success: function(aTables) {
					oTable = aTables[0];
				}
			});
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aControls) {
					var oComboBox = aControls[0];
					var oResult = oTable.getModel().getAnalyticalExtensions().findQueryResultByName("ProductCollection");
					var aSortableColumns = oResult._oEntityType.getSortablePropertyNames();
					Opa5.assert.ok(oComboBox.getItems().length === aSortableColumns.length);
				}
			});
		},

		iShouldSeeRestoreButtonWhichIsEnabled: function(bEnabled) {
			return this.waitFor({
				searchOpenDialogs: true,
				visible: bEnabled,
				controlType: "sap.m.Button",
				success: function(aButtons) {
					var aRestoreButtons = aButtons.filter(function(oButton) {
						return oButton.getText() === TestUtil.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.RESET");
					});
					Opa5.assert.equal(aRestoreButtons.length, 1);
					Opa5.assert.ok(aRestoreButtons[0].getEnabled() === bEnabled, "The '" + TestUtil.getTextFromResourceBundle("sap.ui.mdc", "p13nDialog.RESET") + "' is " + (bEnabled ? "enabled" : "disabled"));
				}
			});
		},

		iShouldSeeSelectedVariant: function(sVariantName) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				matchers: new PropertyStrictEquals({
					name: "defaultVariantKey",
					value: "*standard*"
				}),
				success: function(aSmartVariantManagements) {
					Opa5.assert.equal(aSmartVariantManagements.length, 1, "SmartVariantManagement found");
					var aVariantItem = aSmartVariantManagements[0].getVariantItems().filter(function(oVariantItem) {
						return oVariantItem.getText() === sVariantName;
					});
					Opa5.assert.equal(aVariantItem.length, 1, "Variant '" + sVariantName + "' found");
				},
				errorMessage: "Could not find SmartVariantManagement"
			});
		},

		theTableHasFreezeColumn: function(sColumnName) {
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
					Opa5.assert.equal(aTables[0].getFixedColumnCount(), aVisibleColumns.indexOf(aColumn[0]) + 1, "Column '" + sColumnName + "' is fixed on position " + (aVisibleColumns.indexOf(aColumn[0]) + 1));
				}
			});
		},

		iShouldNotSeeOnNavigationPopoverPersonalizationLinkText: function(sText) {
			return this.waitFor({
				controlType: "sap.m.Button",
				check: function(aButtons) {
					return aButtons.filter(function(oButton) {
						return oButton.getText() === sText;
					}).length === 0;
				},
				success: function(aButton) {
					Opa5.assert.equal(aButton.length, 1, "Button with text '" + sText + "' found.");
				}
			});
		},
		iShouldSeeMultiSelectionPlugin: function(sId, bValue) {
			return this.waitFor({
				id: sId,
				controlType: "sap.ui.table.Table",
				searchOpenDialogs: true,
				success: function(oTable) {
					const oTableSelectionInstance = oTable._getSelectionPlugin && oTable._getSelectionPlugin();
					Opa5.assert.equal(oTableSelectionInstance.isA("sap.ui.table.plugins.MultiSelectionPlugin"), bValue, `MultiSelectionPlugin is ${bValue}`);
				}
			});
		},

		iShouldSeeStartRtaButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://wrench"
				}),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "One button found");
					Opa5.assert.equal(aButtons[0].getIcon(), "sap-icon://wrench", "The Start Key User Adaptation button found");
				}
			});
		},

		rtaShouldBeClosed: function(sRootControlId) {
			return this.waitFor({
				id: sRootControlId,
				check: function(oView) {
					return !oView.$().hasClass("sapUiRtaRoot");
				},
				success: function() {
					Opa5.assert.ok(true, "Key User Adaptation mode is closed");
				}
			});
		},

		theApplicationIsLoaded: function(sId) {
			var aDomApp;
			return this.waitFor({
				check: function() {
					var frameJQuery = Opa5.getJQuery();
					var fnApp = Opa5.getPlugin().getControlConstructor('sap.m.App');
					aDomApp = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnApp);
					return !!aDomApp.length;
				},
				success: function() {
					Opa5.assert.equal(aDomApp.length, 1, "One app is loaded");
					Opa5.assert.equal(aDomApp[0].getId(), sId, "App '" + sId + "' is loaded");
				}
			});
		},

		theColumnMenuOpens: function() {
			return this.waitFor({
				controlType: "sap.m.table.columnmenu.Menu",
				matchers: function(oPopup) {
					return oPopup.$().hasClass("sapMTCMenu");
				},
				success: function(oPopup) {
					Opa5.assert.ok(oPopup[0].getVisible(), "The column menu is shown.");
				},
				errorMessage: "Did not find the column Menu"
			});
		},

		iShouldSeeNoEmptyOperation: function (iCondition) {
			if (iCondition === undefined) {
				iCondition = 0;
			}

			return this.waitFor({
				controlType: "sap.ui.layout.form.SimpleForm",
				searchOpenDialogs: true,
				success: function (aPanels) {
					var oConditionPanel = aPanels[0].getContent()[iCondition],
						oConditions = oConditionPanel.findAggregatedObjects(true, function (oControl) {
							return oControl.isA("sap.m.ComboBox") && oControl.getItems().some(function(oItem) {
								return oItem.getText() === "Include";
							});
						})[0];

					Opa5.assert.ok(!oConditions.getItems().some(function (oItem) {
						return oItem.getKey() === "Empty";
					}), "There should be no 'empty' operation");
					Opa5.assert.ok(!oConditions.getItems().some(function (oItem) {
						return oItem.getKey() === "Not Empty";
					}), "There should be no 'Not empty' operation");
				}
			});
		},

		iShouldSeeConditionOperations: function (aOperations, iCondition) {
			iCondition = iCondition ? iCondition : 0;
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var aAvailable = aComboBoxes[iCondition].getItems().map(function (oItem) {
							return oItem.getText();
						});

					Opa5.assert.strictEqual(
						aOperations.join(","),
						aAvailable.join(","),
						"Operations list should match"
					);
				},
				errorMessage: "sap.m.Selectlist or Item in List not found!"
			});
		},

		iShouldSeeExcludeOperations: function (aOperations, iCondition) {
			iCondition = iCondition ? iCondition : 0;
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var aItems = aComboBoxes[1].getItems(),
						iExcludeIndex = aItems.findIndex(function(oItem) {
							return oItem.getText() === "Exclude";
						}),
						aExcludeItems = aItems.slice(iExcludeIndex + 1),
						aAvailable = aExcludeItems.map(function (oItem) {
							return oItem.getText();
						});

					Opa5.assert.strictEqual(
						aAvailable.join(", "),
						aOperations.join(", "),
						"Operations list should match"
					);
				},
				errorMessage: "sap.m.Selectlist or Item in List not found!"
			});
		},

		iShouldSeeIncludeOperations: function (aOperations, iCondition) {
			iCondition = iCondition ? iCondition : 0;
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var aItems = aComboBoxes[1].getItems(),
						iExcludeIndex = aItems.findIndex(function(oItem) {
							return oItem.getText() === "Exclude";
						}),
						aIncludeItems = aItems.slice(1, iExcludeIndex),
						aAvailable = aIncludeItems.map(function (oItem) {
							return oItem.getText();
						});

					Opa5.assert.strictEqual(
						aOperations.join(", "),
						aAvailable.join(", "),
						"Operations list should match"
					);
				},
				errorMessage: "sap.m.Selectlist or Item in List not found!"
			});
		},

		iShouldSeeTheColumnMenu: function() {
			return this.waitFor({
				controlType: "sap.m.table.columnmenu.Menu",
				success: function (aMenus) {
					Opa5.assert.ok(aMenus[0].isOpen(), "New Column menu is opened");
				},
				errorMessage: "No Column Menu found"
			});
		},

		iShouldSeeNumberOfRequests: function (nCount, sURL) {
			return this.waitFor({
				id: "applicationUnderTest---IDView--events",
				success: function (oList) {
					var aResult = oList.getItems().filter(function (oItem) {
						var sRequest = oItem.data("request");
						return (
							sRequest &&
							sRequest.indexOf("applicationUnderTest/" + sURL) !== -1
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

		iShouldSeeDialogWithVisibleResetButton: function(bVisibleResetButton) {
			return waitForP13nDialog.call(this, {
				success: function(oP13nDialog) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Bar",
						matchers: new Ancestor(oP13nDialog, false),
						success: function(aBars) {
							var oBar = aBars[0],
							oContent = oBar.getContentRight();
							if (bVisibleResetButton) {
								Opa5.assert.equal(oContent.length, 1, "Reset Button is visible");
							} else {
								Opa5.assert.equal(oContent.length, 0, "Reset Button is hidden");
							}
						}
					});
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

			/**
			 * This method will check the text, selected status and index of a given array in a p13n dialog, which contains p13n items in a defined structure.
			 * Note: the index of the p13n item in the array will also be checked, according to the index of the item in the dialog.
			 *
			 * @param {Array<{p13nItem: string, selected: boolean}>} vItems - the array which is containing the items to be checked in the dialog as following: [{p13nItem: 'Country', selected: true}]
			 * @private
			 */
			iShouldSeeP13nItems: function (vItems) {


			var aVisibleItems = [];
			var aItemNamesSelected = vItems.filter(function(oItem){return oItem.selected;}).map(function(oItem){return oItem.p13nItem;});

			this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.ColumnListItem",
				actions: function (oColumnListItem) {
					this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.ComboBox",
						matchers: new Ancestor(oColumnListItem),
						success: function (aComboBoxes) {
							var oComboBox = aComboBoxes[0];
							var sText = oComboBox.getSelectedItem() ? oComboBox.getSelectedItem().getText() : undefined;

							//Skip template rows
							if (sText == undefined){
								return;
							}

							aVisibleItems.push(sText);

							if (aItemNamesSelected.indexOf(sText) != -1 ) {
								Opa5.assert.ok(true, "Item does contain the correct text " + sText + " for the Label");
							}
						}
					});
				}.bind(this),
				success: function() {
					aVisibleItems.forEach(function(sItemName, iIndex) {
						Opa5.assert.equal(aItemNamesSelected[iIndex], sItemName, "Table item is on the correct index");
					});

					Opa5.assert.ok(true, "Item selection is correct"); //Otherwise test would have failed earlier as arrays are compared
				}
			});

		},

		/**
		 * Checks if the 'Show more per row'/'Show less per row' button is visible on the screen and has the correct state
		 *
		 * @param {string} sTableId Id of the SmartTable
		 * @param {boolean} bShowDetails State of the showHideDetails button (true = show details, false = hide details)
		 * @returns {Promise} OPA waitFor
		 */
		iShouldSeeShowMorePerRowButton: function(sTableId, bShowDetails) {
			return this.waitFor({
				id: sTableId + "-btnShowHideDetails",
				controlType: "sap.m.SegmentedButton",
				success: function(oSegmentedButton) {
					Opa5.assert.ok(oSegmentedButton, "'Show more per row'/'Show less per row' button is visible on the screen");
					if (bShowDetails !== undefined) {
						Opa5.assert.equal(bShowDetails, oSegmentedButton.getSelectedKey() !== "hideDetails", (bShowDetails ? "'Show more per row'" : "'Show less per row'") + " button is selected");
					}
				},
				errorMessage: "Did not find the 'Show more per row'/'Show less per row' button"
			});
		},

		/**
		 * Checks if the variant management is visible on the screen and if the variant is modified or not
		 *
		 * @param {string} sTableId Id of the SmartTable
		 * @param {boolean} bModified State of the variant (true = modified, false = not modified)
		 * @returns {Promise} OPA waitFor
		 */
		iShouldSeeAVariant: function(sTableId, bModified) {
			return this.waitFor({
				id: sTableId + "-variant",
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				success: function (oVariantManagement) {
					Opa5.assert.ok(oVariantManagement, "Variant management is on the screen");
					if (bModified !== undefined) {
						Opa5.assert.equal(oVariantManagement.currentVariantGetModified(), bModified, "Variant is " + (bModified ? "modified" : "not modified"));
					}
				},
				errorMessage: "No VariantManagement found"
			});
		}

	});
	return Assertion;
}, true);
