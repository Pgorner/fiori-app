/*global QUnit */
sap.ui.define([
    "sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/Common/Common",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/utils/OpaResourceBundle",
	"sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
	"sap/ui/test/actions/Press"
], function (Opa5, Common, OpaResourceBundle, ApplicationSettings, Press) {
	"use strict";
	var oi18n = OpaResourceBundle.template["AnalyticalListPage"].getResourceBundle();
	Opa5.createPageObjects({
		onTheVisualFilterDialog: {
			baseClass: Common,
			actions: {
				iClickTheValueHelp: function (filterName) {
					var okButton;
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						check: function (aButtons) {
							var bFlag = false;
							aButtons.forEach(function (oButton) {
								if (oButton.getIcon() === "sap-icon://value-help" || oButton.getIcon() === "sap-icon://slim-arrow-down") {
									if (oButton.getParent().getParent().getItems()[1].getItems()[0].getParentProperty().indexOf(filterName) !== -1) {
										okButton = oButton;
										bFlag = true;
									}
								}
							});
							return bFlag;
						},
						success: function () {
							okButton.firePress();
							Opa5.assert.ok(true, "Value help button is supported and Clicked");
						},
						errorMessage: "Value help button is not supported"
					});
				},
				//to add values in CF dialog
				iAddFilterValueInCompactDialog: function (fieldName, value) {
					return this.waitFor({
						controlType: "sap.m.Input",
						searchOpenDialogs: true,
						check: function (aInputItems) {
							if (aInputItems) {
								var bSuccess = false;
								aInputItems.forEach(function (oInputItem) {
									var property = oInputItem.getLabels()[0]
									if (property.getText() === fieldName) {
										oInputItem.setValue(value);
										oInputItem.fireChange();
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "filter applied");
						},
						errorMessage: "The filter cannot be applied"
					});
				},
				iRemoveFilterValueInCompactDialog: function (cfItemNum) {
					return this.waitFor({
						controlType: "sap.ui.core.Icon",
						searchOpenDialogs: true,
						success: function (aIcons) {
							aIcons[cfItemNum].firePress();
							Opa5.assert.ok(true, "OK button was clicked")
						},
						errorMessage: "The page has no OK button."
					});
				},
				iClickSelectedButtonDeleteIcon: function (index) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Token",
						success: function (aTokens) {
							aTokens[index].getAggregation("deleteIcon").firePress();
							Opa5.assert.ok(true, "Selected button cancel Clicked");
						},
						errorMessage: "Selected button cancel not Clicked"
					});
				},
				iClickSelectedButtonRemove: function () {
					var removeButton;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						check: function (aButtons) {
							var bFlag = false;
							aButtons.forEach(function (oButton) {
								if (oButton.getIcon() === "sap-icon://decline") {
									removeButton = oButton;
									bFlag = true;
								}
							});
							return bFlag;
						},
						success: function () {
							removeButton.firePress();
							Opa5.assert.ok(true, "Selected button remove Clicked");
						},
						errorMessage: "Selected button remove not Clicked"
					});
				},
				//click chart property buttons, ie, sort,type and measure
				iClickChartButton: function (btnName) {
					var chartButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						check: function (aButtons) {
							return aButtons.filter(function (oButton) {
								if (oButton._getTooltip() === btnName) {
									chartButton = oButton;
									return true;
								}
								return false;
							});
						},
						success: function () {
							chartButton.$().trigger("click");
							chartButton.firePress();
						},
						errorMessage: "button not clicked"
					});
				},
				/*This function allows you to click the chart toolbar button corresponding to the visual filter chart
				@param btnName is the name of the button that needs to be clicked.
				@param vfItem denotes the chart that needs to be clicked.*/
				iClickToolbarButton: function (btnName, vfItem) {
					var chartButton = null
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: btnName
						}),
						check: function (aButtons) {
							chartButton = aButtons[vfItem];
							return true;
						},
						success: function () {
							chartButton.$().trigger("click");
							chartButton.firePress();
						},
						errorMessage: "Chart property could not be changed"
					});
				},

				/**
				* Click on the overflow button on the given overflowtoolbar.
				* No action will be performed in case the overflow button is not available for the toolbar
				* @param {string} sTitle - Title text to identify the right overflow toolbar Eg: "Actual Costs by Cost Center"
				* @return {*} success or failure
				**/
				iClickTheOverflowButtonForTheToolbar: function (sTitle) {
					return this.waitFor({
						controlType: "sap.m.ToggleButton",
						searchOpenDialogs: true,
						visible: false,
						success: function (oButtons) {
							for (var i = 0; i < oButtons.length; i++) {
								if (oButtons[i].getParent() &&
									oButtons[i].getParent().getContent &&
									oButtons[i].getParent().getContent()[0].getText &&
									oButtons[i].getParent().getContent()[0].getText() === sTitle) {
									oButtons[i].firePress();
									Opa5.assert.ok(true, "Overflow button found for the toolbar and clicked successfully");
									return null;
								}
							}
							Opa5.assert.ok(true, "Overflow button not found for the toolbar and no action was performed");
						},
						errorMessage: "Could not find the overflowButton on the dialog"
					});
				},
				//change sort, chart type or measure by passing position of the required change in the popup
				iChangeChartProperty: function (idx) {
					var chartProperty = null, popup = null, bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.List",
						searchOpenDialogs: true,
						autoWait: true,
						check: function (aDialogs) {
							if (aDialogs) {
								aDialogs.forEach(function (oDialog) {
									var prop = oDialog.getItems();
									if (prop && prop.length && prop[idx]) {
										prop = prop[idx];
										prop.setSelected(true);
										popup = oDialog;
										chartProperty = prop;
										if (prop) {
											popup.fireSelectionChange({
												listItem: chartProperty,
												listItems: popup.getItems(),
												selected: chartProperty.getSelected()
											});
											bSuccess = true;
										}
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "chart property has been changed");
						},
						errorMessage: "Chart property could not be changed"
					});
				},
				iClickMoreFiltersLink: function (slinkName) {
					var link = null;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Link",
						check: function (oLink) {
							var bSuccess = false;
							oLink.forEach(function (aLink) {
								if (aLink.getText() === slinkName) {
									link = aLink;
									bSuccess = true;
								}
							});
							return bSuccess;
						},
						success: function () {
							link.firePress();
							Opa5.assert.ok(true, "Clicked the More Filters Link");
						},
						errorMessage: "There is no More Filters Link/Link can't be clicked"
					});
				},
				iCheckSelectFilterCheckbox: function (listName, bVisible, bIsCompact) {
					var index = null;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.List",
						check: function (oList) {
							if (oList) {
								var bSuccess = false;
								oList.forEach(function (aList) {
									if (aList.getParent().getParent().getId().indexOf("adapt-filters-dialog") > -1) {
										return;
									}
									var aListItems = aList.getItems();
									if (bIsCompact) {
										for (var i = 0; i < aListItems.length; i++) {
											if (aListItems[i].getContent()[0].getText() === listName.trim()) {
												index = i;
												bSuccess = true
											}
										}
									} else {
										for (var i = 0; i < aListItems.length; i++) {
											if (aListItems[i].getTitle && aListItems[i].getTitle() === listName.trim()) {
												index = i
												bSuccess = true
											}
										}
									}
									if (bSuccess) {
										if (aListItems[index].getSelected() !== bVisible) {
											new Press().executeOn(aListItems[index].getMultiSelectControl());
										}
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Selected/deselected the Filter Item Chart ");
						},
						errorMessage: "The filter Item chart can't be selected/deselected"
					});
				},
				iSetShowOnFilterBarCheckBoxState: function (state, idx) {
					var oCheckBox;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CheckBox",
						check: function (aCheckBox) {
							if (aCheckBox[idx]) {
								aCheckBox[idx].setSelected(state);
								oCheckBox = aCheckBox[idx];
								return true;
							}
							return false;
						},
						success: function () {
							oCheckBox.fireSelect({
								selected: state
							});
							Opa5.assert.ok(true, "state changed");
						},
						errorMessage: "state not changed"
					});
				},
				iClickSelectedButton: function (num) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "(" + num + ")"
						}),
						success: function (oButton) {
							oButton[0].firePress();
						},
						errorMessage: "The page has no (" + num + ")" + "Button"
					});
				}
			},
			assertions: {
				iCheckChartButton: function (btnName) {
					var chartButton = false;
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						check: function (aButtons) {
							for (var i = 0; i < aButtons.length; i++) {
								if (aButtons[i].getText() === btnName) {
									chartButton = true;
									return chartButton;
								}
							}
							return chartButton;
						},
						success: function () {
							Opa5.assert.ok(true, "Button is present");
						},
						errorMessage: "button not present."
					});
				},
				iCheckVisualFilterDialogInvisibleText: function (sId, sMandatoryProperty) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CustomListItem",
						check: function (aCustomlistItem) {
							return aCustomlistItem.some(function (oCustomListItem) {
								var aItems = oCustomListItem.getContent()[0].getItems()[1].getItems();
								var sMsg = oi18n.getText("VIS_FILTER_ITEM_ARIA");
								if (sMandatoryProperty) {
									sMsg += " " + oi18n.getText("VIS_FILTER_MANDATORY_PROPERTY_ARIA", sMandatoryProperty);
								}
								sMsg += " " + oi18n.getText("VIS_FILTER_DIALOG_NAVIGATE_ARIA") + " " + oi18n.getText("VIS_FILTER_ACCESS_FIELDS_ARIA");
								return (aItems[2].isA("sap.ui.core.InvisibleText") && aItems[2].getId() === sId && aItems[2].getText() === sMsg);
							});
						},
						success: function () {
							Opa5.assert.ok(true, "InvisibleText with id " + sId + " is present for the visual filter on the dialog.");
						},
						errorMessage: "InvisibleText is missing for the visual filter on the dialog."
					});
				},
				iCheckChartScale: function (iShortRefNumber, sScale) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						check: function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								for (var i = 0; i < aCharts.length; i++) {
									var chartItem = aCharts[i].getParent();
									if (chartItem._shortRefNumber === iShortRefNumber && chartItem._scaleValue === sScale) {
										bSuccess = true;
										break;
									}
								}
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "Scale Applied Successfully");
						},
						errorMessage: "Wrong Scale Found"
					});
				},
				iCheckChartMeasureWithChartType: function (sMeasure, sChartType) {
					if (sChartType.toLowerCase() === "bar") {
						sChartType = "Bar";
					} else if (sChartType.toLowerCase() === "donut") {
						sChartType = "Donut";
					} else if (sChartType.toLowerCase() === "line") {
						sChartType = "Line";
					}
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.Interactive" + sChartType + "Chart",
						check: function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								aCharts.forEach(function (oCharts) {
									var chartItem = oCharts.getParent();
									if (chartItem.getMeasureField() === sMeasure) {
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Measure has been changed successfully");
						},
						errorMessage: "Change in measure could not be applied"
					});
				},
				//verify change in chart type
				iCheckTypeOfChart: function (sChartType, sProperty) {
					if (sChartType.toLowerCase() === "bar") {
						sChartType = "Bar";
					} else if (sChartType.toLowerCase() === "donut") {
						sChartType = "Donut";
					} else if (sChartType.toLowerCase() === "line") {
						sChartType = "Line";
					}
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.Interactive" + sChartType + "Chart",
						check: function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								aCharts.forEach(function (oCharts) {
									var parent = oCharts.getParent();
									var dim = parent.getProperty("dimensionField");
									if (dim === sProperty) {
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Chart type has been changed");
						},
						errorMessage: "Chart type could not be changed"
					});
				},
				iCheckDefaultSortOrder: function (sChartType, bIsDescending) {
					if (sChartType.toLowerCase() === "bar") {
						sChartType = "Bar";
					} else if (sChartType.toLowerCase() === "donut") {
						sChartType = "Donut";
					} else if (sChartType.toLowerCase() === "line") {
						sChartType = "Line";
					}
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.Interactive" + sChartType + "Chart",
						check: function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								aCharts.forEach(function (oCharts) {
									var chartItem = oCharts.getParent();
									if (chartItem.getSortOrder()[0].Descending.Boolean === bIsDescending) {
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Default Sort order for " + sChartType + " Chart has been set Appropriate");
						},
						errorMessage: "Default Sort order not Appropriate"
					});
				},
				iCheckShowOnFilterBarCheckBox: function () {
					return this.waitFor({
						controlType: "sap.m.CheckBox",
						searchOpenDialogs: true,
						check: function (aCheckBox) {
							if (aCheckBox.length > 0) {
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "CheckBox is present");
						},
						errorMessage: "CheckBox is not present"
					});
				},
				iCheckShowOnFilterBarCheckBoxState: function (state, idx) {
					var bIsShownOnFilterBar = false;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CheckBox",
						check: function (aCheckBox) {
							if (aCheckBox[idx].getSelected() === state) {
								bIsShownOnFilterBar = true;
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(bIsShownOnFilterBar, "state changed");
						},
						errorMessage: "state not changed"
					});
				},
				//check selected Button
				iCheckSelectedButtonCount: function (num, sProp) {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						check: function (aButtons) {
							for (var i in aButtons) {
								var oButton = aButtons[i],
									sTooltip = oButton.getTooltip();
								if (oButton.getText() === "(" + num + ")" && sTooltip && sTooltip.search(sProp) > -1) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, num + "filters selected");
						},
						errorMessage: "no selections"
					});
				},
				iCheckBarChartSelection: function () {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						check: function (aCharts) {
							if (aCharts[0]) {
								var oChart = aCharts[0];
								var aBars = oChart.getAggregation("bars");
								var bSuccess = true;
								aBars.forEach(function (oBar) {
									var sValue = oBar.getProperty("selected");
									if (sValue === true) {
										bSuccess = false;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "The Bar Chart has no Selections");
						},
						errorMessage: "The Bar Chart has Selections"
					});
				},
				iCheckOverlay: function (bVisible, overlayMessage, vfCount, sLabel) {
					var count = 0, bSuccess = true;
					this.waitFor({
						controlType: "sap.m.VBox",
						visible: bVisible,
						check: function (aVBox) {
							for (var i = 0; i < aVBox.length; i++) {
								if (aVBox[i].getItems()[0].sId.indexOf("Property") !== -1) {
									//not using a general condition for all overlays texts to keep track of
									//count of charts with overlay for REFINE_CURRENCY_OVERLAY
									if (aVBox[i].getItems()[0]._chart && aVBox[i].getItems()[0]._chart.getErrorMessage() === oi18n.getText(overlayMessage, sLabel ? [sLabel] : undefined)) {
										count++;
										bSuccess = true;
									}
								}
							}
							if (bSuccess && count === vfCount) {
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "overlay exists on all charts");
						},
						errorMessage: "Overlay has not been applied"
					});
				},
				iCheckForOverlayOnChart: function (bVisible, overlayMessage, vfItem) {
					this.waitFor({
						controlType: "sap.m.VBox",
						visible: bVisible,
						check: function (aVBox) {
							if (aVBox[vfItem].getItems()[0].sId.indexOf("label") !== -1) {
								//not using a general condition for all overlays texts to keep track of
								//count of charts with overlay for REFINE_CURRENCY_OVERLAY
								if (aVBox[vfItem].getItems()[0].getText() === oi18n.getText(overlayMessage)) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "overlay exists on " + vfItem + " charts");
						},
						errorMessage: "Overlay has not been applied"
					});
				},
				iCheckRenderedChart: function (chartType, dimensionField, bSearchOpenDialogs) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.Interactive" + chartType + "Chart",
						searchOpenDialogs: !!bSearchOpenDialogs,
						check: function (aCharts) {
							for (var i = 0; i < aCharts.length; i++) {
								if (aCharts[i] && aCharts[i].getParent().getDimensionField() === dimensionField) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Chart rendered");
						},
						errorMessage: "Chart has not been rendered"

					});
				},
				iCheckVHTooltip: function (chartType, dimensionField, tooltipMessage, itemsSelected) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.Interactive" + chartType + "Chart",
						searchOpenDialogs: true,
						check: function (aCharts) {
							var sDimField = dimensionField.replace(/\s+/g, '');
							for (var i = 0; i < aCharts.length; i++) {
								if (aCharts[i] && aCharts[i].getParent().getDimensionField() === sDimField) {
									//since tooltip can vary across charts, first get the chart control and then get the VH button tooltip.
									var tooltip = aCharts[i].getParent().getParent().getParent().getItems()[0].getContent()[4].getTooltip();
									if (tooltip === oi18n.getText(tooltipMessage, [dimensionField, itemsSelected])) {
										return true;
									}
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Appropriate Tooltip");
						},
						errorMessage: "Incorrect Tooltip"
					});
				},
				iCheckChartTitle: function (bDialogOpen, chartTitle) {
					return this.waitFor({
						controlType: "sap.m.Title",
						searchOpenDialogs: bDialogOpen,
						check: function (aTitles) {
							var firstPartTitle = false, secondPartTitle = false;
							var charTitleSplit = chartTitle.split(" | ");
							for (var i = 0; i < aTitles.length; i++) {
								var titleText = aTitles[i].getText();
								if (charTitleSplit.length > 1) {
									if (!firstPartTitle) {
										firstPartTitle = titleText.indexOf(charTitleSplit[0]) !== -1;
									}
									secondPartTitle = titleText.indexOf("| " + charTitleSplit[1]) !== -1;
									if (firstPartTitle && secondPartTitle) {
										return true;
									}
								} else if (aTitles[i].getText().indexOf(chartTitle) !== -1) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "The chart has title");
						},
						errorMessage: "Chart does not have a title"
					});
				},
				iCheckForHiddenMeasure: function (sMeasureName) {
					return this.waitFor({
						controlType: "sap.m.List",
						searchOpenDialogs: true,
						check: function (aLists) {
							var bSuccess;
							if (aLists) {
								aLists.forEach(function (oList) {
									if (oList.getParent().getParent().getId().indexOf("adapt-filters-dialog") > -1) {
										return;
									}
									var props = oList.getItems();
									for (var i in props) {
										if (props[i].getTitle && props[i].getTitle() === sMeasureName) {
											return false;
										}
									}
									bSuccess = true;
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Hidden measure " + sMeasureName + " was not found in the measures list");
						},
						errorMessage: "Hidden measure " + sMeasureName + " was found in the measures list"
					});
				},
				iCheckFilterOnDialog: function (sToken) {
					return this.waitFor({
						controlType: "sap.m.Token",
						searchOpenDialogs: true,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: sToken
						}),
						success: function () {
							Opa5.assert.ok(true, "FIlter is applied Properly");
						},
						errorMessage: "Filter is not applied properly"
					});
				},
				iCheckVFChartSelected: function (sChartType, value, parentProperty, isNotSelected, bSearchInDialog) {
					// isNotSelected determines whether to check for value being selected or not selected
					var sInteractiveChart;
					if (sChartType.toLowerCase() === "bar") {
						sInteractiveChart = "InteractiveBarChart";
					} else if (sChartType.toLowerCase() === "line") {
						sInteractiveChart = "InteractiveLineChart";
					} else if (sChartType.toLowerCase() === "donut") {
						sInteractiveChart = "InteractiveDonutChart";
					}
					var aAggregation = null;
					return this.waitFor({
						controlType: "sap.suite.ui.microchart." + sInteractiveChart,
						searchOpenDialogs: bSearchInDialog,
						check: function (aCharts) {
							var bSuccess = false;
							if (aCharts) {
								aCharts.forEach(function (oChart) {
									if (oChart.getParent().getParentProperty() === parentProperty) {
										var fGetAggregation = oChart.getBars || oChart.getPoints || oChart.getSegments,
											aChartAggregations = fGetAggregation.call(oChart);
										for (var i = 0; i < aChartAggregations.length; i++) {
											aAggregation = aChartAggregations[i];
											var CustomData = aAggregation.getCustomData()[0];
											if (CustomData.getProperty("value").toString() === value.toString()) {
												bSuccess = isNotSelected ? !aAggregation.getSelected() : aAggregation.getSelected();
											}
										}
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							var message;
							if (isNotSelected) {
								message = value + " is not selected";
							} else {
								message = value + " is selected";
							}
							Opa5.assert.ok(true, message);
						},
						errorMessage: "Error in checking " + value
					});
				},
				iCheckForFiltersAppliedInDialog: function (sProp, sValue, bIsFilterValueEmpty) {
					var sAppsId = ApplicationSettings.getAppParameters().ALPPrefixID, bSuccess = false,
						sFilterItemId = sAppsId + "--template::SmartFilterBar-filterItemControlA_-" + sProp;
					return this.waitFor({
						controlType: "sap.m.InputBase",
						searchOpenDialogs: true,
						check: function (aInput) {
							aInput.forEach(function (oInput) {
								if (oInput.getId() === sFilterItemId) {
									if (!bIsFilterValueEmpty) {
										if (oInput.getDateValue && oInput.getDateValue()) {
											bSuccess = oInput.getDateValue().toString() === sValue;
										} else if (oInput.getValue()) {
											bSuccess = oInput.getValue() === sValue;
										}
									} else {
										bSuccess = (oInput.getDateValue && oInput.getDateValue() === null) || oInput.getValue() === sValue;
									}
								}
							});
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "vf-cf values are in sync for property " + sProp);
						},
						errorMessage: "The value in vf and cf are not in sync for " + sProp
					});
				},
				/*
				This function checks whether the particular value is applied to a property in CFD
				@sProp , provide the property name
				@sValue , provide the value that is applied in CFD for the property sProp
				@bIsFilterValueEmpty, maintain true if there is no value for the property sProp, in which case sValue should be supplied empty.
									  maintain false if there is a value for the property sProp, in which case sValue should have the value to tbe verified
				*/
				isFiltersAppliedInDialog: function (sProp, sValue, bIsFilterValueEmpty) {
					var sAppsId = ApplicationSettings.getAppParameters().ALPPrefixID, bSuccess = false,
						sFilterItemId = sAppsId + "--template::SmartFilterBar-filterItemControl_BASIC-" + sProp;
					return this.waitFor({
						controlType: "sap.m.InputBase",
						searchOpenDialogs: true,
						check: function (aInput) {
							aInput.forEach(function (oInput) {
								if (oInput.getId() === sFilterItemId) {
									if (!bIsFilterValueEmpty) {
										if (oInput.getValue() === sValue) {
											bSuccess = true;
										}
									} else {
										if (oInput.getValue() === '') {
											bSuccess = true;
										}
									}
								}
							});
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "vf-cf values are in sync for property " + sProp);
						},
						errorMessage: "The value in vf and cf are not in sync for " + sProp
					});
				}
			}
		}
	});
});
