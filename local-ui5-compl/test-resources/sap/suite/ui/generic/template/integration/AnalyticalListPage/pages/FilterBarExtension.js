sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/Common/Common",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/utils/OpaResourceBundle",
	"sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
	"sap/ui/table/plugins/MultiSelectionPlugin"
], function (Opa5, Common, AggregationFilled, PropertyStrictEquals, OpaResourceBundle, ApplicationSettings, MultiSelectionPlugin) {

	"use strict";
	var oi18n = OpaResourceBundle.template["AnalyticalListPage"].getResourceBundle();
	Opa5.createPageObjects({
		onTheFilterBar: {
			baseClass: Common,
			actions: {
				iSelectBarChart: function(barIndex) {
 					return this.waitFor({
 						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						success: function (aCharts) {
							var oChart = aCharts[0];
							var bars = oChart.getBars();
 								if(bars && bars.length) {
									var bar = bars[barIndex];
 									bar.setSelected(true);
									//check requirement of condition
									oChart.fireSelectionChanged({
										selectedBars: oChart.getSelectedBars(),
										bar: bar,
										selected: bar.getSelected()
									});
									Opa5.assert.ok(true, "Selection made");
 								}
							},
 						errorMessage: "The chart selection cannot be applied"
 					});
 				},
				//make selections on line chart
				//specific to line chart as microchart control is not available
				//scope for common function in future to support all
				iSelectLineChart: function(pointIndex) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.InteractiveLineChart",
						success: function (aCharts) {
							var oChart = aCharts[0];
							var points = oChart.getPoints();
								if(points && points.length) {
									var point = points[pointIndex];
									point.setSelected(true);
									//check requirement of condition
									oChart.fireSelectionChanged({
										selectedPoints: oChart.getSelectedPoints(),
										point: point,
										selected: point.getSelected()
									});
									Opa5.assert.ok(true, "Selection made");
								}
							},
						errorMessage: "The chart selection cannot be applied"
					});
				},
				iClickDropDownIcon: function (bIsSearchInFilterBar) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "icon",
							value: "sap-icon://slim-arrow-down"
						}),
						check: function (oButtons) {
							var bShareButton = false;
							if (bIsSearchInFilterBar) {
								oButtons[2].firePress();
								bShareButton = true;
							} else {
								oButtons[0].firePress();
								bShareButton = true;
							}
							return bShareButton;
						},
						success: function () {
							Opa5.assert.ok(true, "dropDownList icon clicked");
						},
						errorMessage: "dropDownList icon is not clicked"
					});
				},
				iClickInputValuehelp: function (fieldName) {
					return this.waitFor({
						controlType: "sap.m.Input",
						success: function (aInputs) {
							for (var i in aInputs) {
								if (aInputs[i].getId().indexOf(fieldName) !== -1) {
									var valuehelpButton = aInputs[i]._getValueHelpIcon && aInputs[i]._getValueHelpIcon();
									valuehelpButton.firePress();
									Opa5.assert.ok(true, "Value help button for " + fieldName + " pressed");
									break;
								}
							}
						},
						errorMessage: "No valuehelp"
					});
				},
				iSetTheDynamicDateRangeValue: function (sId, oDate) {
					return this.waitFor({
						controlType: "sap.m.DynamicDateRange",
						id: new RegExp(sId + "$"),
						success: function (aControls) {
							aControls[0].setValue({ operator: "FROM", values: [oDate] });
							aControls[0].fireChange({ value: aControls[0].getValue(), valid: true });
							Opa5.assert.ok(true, "The value '" + JSON.stringify(oDate) + "' is set at the DynamicDateRange field with the id '" + sId + "'");
						},
						errorMessage: "The DynamicDateRange field with the given id could not be found "
					});
				},
				iAddValueInValuehelp: function (value) {
					return this.waitFor({
						controlType: "sap.m.Input",
						success: function (aInputs) {
							aInputs[0].setValue(value);
							aInputs[0].fireChange();
							aInputs[0].fireSubmit();
							Opa5.assert.ok(true, "Value added");
						},
						errorMessage: "No valuehelp"
					});
				},
				iClickDefineConditionsTab: function () {
					return this.waitFor({
						controlType: "sap.m.IconTabFilter",
						searchOpenDialogs: true,
						success: function (aIconTabFilter) {
							aIconTabFilter.forEach(function (oIconText) {
								if (oIconText.getText().indexOf("Define Conditions") > -1) {
									var oIconTabBar = oIconText.getParent().getParent();
									oIconTabBar.fireSelect({ key: oIconText.getKey() });
									Opa5.assert.ok(true, "Define Conditions tab clicked");
								}
							});
						},
						errorMessage: "Define Conditions tab not clicked"
					});
				},
				iSelectOperatorInVH: function (value) {
					return this.waitFor({
						controlType: "sap.m.ComboBox",
						success: function (aSelect) {
							var select = aSelect[0];
							select.setSelectedKey("EQ");
							select.fireChange({ selectedItem: select.getSelectedItem() });
							Opa5.assert.ok(true, "Value added");
						},
						errorMessage: "No valuehelp"
					});
				},
				iClickSelectedButton: function(num) {
					var selectedBtn;
					return this.waitFor({
						controlType: "sap.m.Button",
						check : function (aButtons) {
							if (aButtons) {
								var bSuccess = false;
								aButtons.forEach(function (oButton) {
									if(oButton.getText() === "(" + num + ")") {
										selectedBtn = oButton;
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							selectedBtn.firePress();
							Opa5.assert.ok(true,"Selected" + "(" + num + ")" + "button pressed");
						},
						errorMessage: "The page has no (" + num + ")" + "Button"
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
				iClickSelectedButtonClearAll: function () {
					var removeButton;
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						check: function (aPopover) {
							var bFlag = false;
							var aToolbar = aPopover[0].getContent();
							if (aToolbar[0]) {
								var cnt = aToolbar[0].getInfoToolbar().getContent()[2];
								if (cnt.getSrc() === "sap-icon://sys-cancel") {
									removeButton = cnt;
									bFlag = true;
								}
							};
							return bFlag;
						},
						success: function () {
							removeButton.firePress();
							Opa5.assert.ok(true, "Selected button remove Clicked");
						},
						errorMessage: "Selected button remove not Clicked"
					});
				},
				iClickDropdownList: function () {
					var dropDownList, list;
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						check: function (aPopover) {
							var bFlag = false;
							var aToolbar = aPopover[0].getContent();
							if (aToolbar[0]) {
								dropDownList = aToolbar[0];
								list = aToolbar[0].getItems();
								list[1].setSelected(!list[1].getSelected());
								if (!list[1].getSelected()) {
									bFlag = true;
								}
							};
							return bFlag;
						},
						success: function () {
							dropDownList.fireSelectionChange({
								listItem: list[1],
								selected: list[1].getSelected()
							});
							Opa5.assert.ok(true, "Dropdown list Clicked");
						},
						errorMessage: "Dropdown list not Clicked"
					});
				},
				iClickDropdownPopoverOk: function () {
					var okButton;
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						check: function (aPopover) {
							var bFlag = false;
							if (aPopover[0]) {
								var cnt = aPopover[0].getBeginButton();
								if (cnt.getText().toLowerCase() === "ok") {
									okButton = cnt;
									bFlag = true;
								}
							};
							return bFlag;
						},
						success: function () {
							okButton.firePress();
							Opa5.assert.ok(true, "Dropdown popOver Ok Clicked");
						},
						errorMessage: "Dropdown popOver Ok not Clicked"
					});
				},
				iClickDropdownPopoverSearchFieldWithFilter: function (sFilter) {
					var oSearchButton;
					return this.waitFor({
						controlType: "sap.m.SearchField",
						check: function (aSearchField) {
							var bFlag = false;
							if (aSearchField) {
								aSearchField[0].setValue(sFilter);
								oSearchButton = aSearchField[0];
								bFlag = true;
							}
							return bFlag;
						},
						success: function () {
							oSearchButton.fireSearch();
							Opa5.assert.ok(true, "Dropdown popover search triggered");
						},
						errorMessage: "Dropdown popover search trigger failed"
					});
				},
				iClickTheFilterButton: function () {
					var filterButton;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function (aButtons) {
							return aButtons.filter(function (oButton) {
								var str = oButton.getText();
								if (str.indexOf("Adapt Filters") > -1) {
									filterButton = oButton;
									return true;
								}
								return false;
							});
						},
						success: function () {
							filterButton.firePress();
							Opa5.assert.ok(true, "Filter button clicked");
						},
						errorMessage: "The filter button cannot be clicked"
					});
				},
				iClickTheFilterButtonInOverflowToolbar: function () {
					var filterButton;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aOverflowToolbar) {
							if (aOverflowToolbar.length) {
								var aToolbarContents = aOverflowToolbar[1].getContent();
								for (var i = 0; i < aToolbarContents.length; i++) {
									if (aToolbarContents[i].sId.indexOf("VisualFilterDialogButton") > 0) {
										filterButton = aToolbarContents[i];
										return true;
									}
								}
							}
							return false;
						},
						success: function () {
							filterButton.firePress();
							Opa5.assert.ok(true, "Filter button clicked");
						},
						errorMessage: "The filter button cannot be clicked"
					});
				},
				iClickTheValueHelp: function (icon, filter) {
					var okButton;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function (aButtons) {
							for (var i in aButtons) {
								var oButton = aButtons[i];
								var sTooltip = oButton.getTooltip && oButton.getTooltip() && oButton.getTooltip().replace(/\s+/g, '');
								if (oButton.getIcon() === icon && sTooltip && sTooltip.indexOf(filter) > -1) {
									if (oButton.getParent().getParent().getParent().getItems()[1].getItems()[0].getDimensionField() === filter) {
										okButton = oButton;
										return true;
									}
								}
							}
							return false;
						},
						success: function () {
							okButton.firePress();
							Opa5.assert.ok(true, "Value help button is supported and Clicked");
						},
						errorMessage: "Value help button is not supported"
					});
				},
				iMakeSelection: function (aIndexNum) {
					var oItemTable, oSelectionChange;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.ui.table.Table",
						check: function (aTable) {
							return aTable.filter(function (oTable) {
								if (oTable) {
									oItemTable = oTable;
									oSelectionChange = {
										rowIndices: aIndexNum,
										selectAll: undefined,
										userInteraction: true
									};
									return true;
								}
								return false;
							});
						},
						success: function () {
							var oSelectionPlugin = MultiSelectionPlugin.findOn(oItemTable);
							aIndexNum.length === 1 ? oSelectionPlugin.setSelectionInterval(aIndexNum[0], aIndexNum[0]) : oSelectionPlugin.setSelectionInterval(aIndexNum[0], aIndexNum[1]);
							oItemTable.fireRowSelectionChange(oSelectionChange);
							Opa5.assert.ok(true, "Item selected/deselected");
						},
						errorMessage: "Item not selected"
					});
				},
				iClickOverflowToggleButton: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						success: function (aOverflowToggleButton) {
							for (var i in aOverflowToggleButton) {
								if (aOverflowToggleButton[i].getId().indexOf("KpiTagContainer") !== -1) {
									aOverflowToggleButton[i].firePress();
									Opa5.assert.ok(true, "KPi tag is present in the overflow.")
								}
							}
						},
						errorMessage: "KPI not in overflow"
					});
				},
				iCheckForDynamicDateControl: function (icon, sTooltip, bIsSearchInDialog) {
					var okButton;
					return this.waitFor({
						searchOpenDialogs: bIsSearchInDialog,
						controlType: "sap.m.Button",
						check: function (aButtons) {
							var bFlag = false;
							aButtons.forEach(function (oButton) {
								if (oButton.getIcon() === icon && oButton.getTooltip() === sTooltip) {
									okButton = oButton;
									bFlag = true;
								}
							});
							return bFlag;
						},
						success: function () {
							okButton.firePress();
							Opa5.assert.ok(true, "DatePicker button is supported and Clicked");
						},
						errorMessage: "DatePicker button is not supported"
					});
				}
			},

			assertions: {
				iCheckVFWithSelectionVariant: function (chartType, dimensionValue, sParentProperty) {
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.Interactive" + chartType + "Chart",
						check: function (aCharts) {
							if (aCharts && aCharts.length) {
								for (var i in aCharts) {
									if (aCharts[i].getCustomData()[0].mProperties.value.mProperties.parentProperty === sParentProperty) {
										var chartParts = (aCharts[i].getBars && aCharts[i].getBars()) || (aCharts[i].getSegments && aCharts[i].getSegments()) || (aCharts[i].getPoints && aCharts[i].getPoints());
										for (var j in chartParts) {
											if (chartParts[j].getCustomData() && chartParts[j].getCustomData()[0]) {
												var customData = chartParts[j].getCustomData()[0];
												bSuccess = customData.getValue() === dimensionValue;
												if (bSuccess) {
													return bSuccess;
												}
											}
										}
									}
								}
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "SV has been considered");
						},
						errorMessage: "SV has not been considered"
					});
				},
				iCheckMandatoryFilter: function () {
					return this.waitFor({
						controlType: "sap.m.Label",
						success: function (aLabel) {
							aLabel.forEach(function (oLabel) {
								if (oLabel.getText() === "Actual Costs by Cost Element in K USD" && oLabel.hasStyleClass("sapSmartTemplatesAnalyticalListPageRequired")) {
									Opa5.assert.ok(true, "Asterisk is applied in title for mandatory filter");
								}
							});
						},
						errorMessage: "Asterisk is not applied in title for mandatory filter"
					});
				},
				iCountDecimalPrecision: function (expectedValue) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						check: function (aCharts) {
							if (aCharts[0]) {
								var oChart = aCharts[0];
								var aPoints = oChart.getAggregation("bars");
								var bSuccess = true;
								aPoints.forEach(function (oPoint) {
									var sValue = oPoint.getProperty("displayedValue");
									if (sValue.indexOf('.') === -1 && expectedValue === 0) {
										return bSuccess;
									}
									if ((sValue.length - 2 - sValue.indexOf('.')) !== expectedValue) {
										bSuccess = false;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "The expected number of fractional digits is the same as observed");
						},
						errorMessage: "The expected number of fractional digits is not the same as observed"
					});
				},
				iCountVFDecimalPrecision: function (chartType, expectedValue, bSearchInDialog) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.Interactive" + chartType + "Chart",
						searchOpenDialogs: bSearchInDialog,
						check: function (aCharts) {
							if (aCharts[0]) {
								var oChart = aCharts[0];
								if (chartType === "Bar") {
									var aPoints = oChart.getAggregation("bars");
								} else if (chartType === "Line") {
									var aPoints = oChart.getAggregation("points");
								} else {
									var aPoints = oChart.getAggregation("segments");
								}
								var bSuccess = true;
								aPoints.forEach(function (oPoint) {
									var sValue = oPoint.getProperty("displayedValue");

									if (expectedValue === 0 && sValue.indexOf('.') === -1) {
										return bSuccess;
									} else if ((sValue.toString().split(".")[1].length) === expectedValue) {
										return bSuccess;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "The expected number of fractional digits for " + chartType + " chart is the same as observed");
						},
						errorMessage: "The expected number of fractional digits is not the same as observed for " + chartType + " chart"
					});
				},
				iCheckTheItemsInDateRangePopOverList: function (count, sId) {
					return this.waitFor({
						controlType: "sap.m.Popover",
						id: new RegExp(sId + "$"),
						success: function (oPopover) {
							var aItems = oPopover[0].getContent()[0].getPages()[0].getContent()[0].getItems();
							var bFlag = aItems.length === count ? true : false;
							Opa5.assert.ok(bFlag, "DateRange PopOver List contains " + count + " items");
						},
						errorMessage: "Popover list not found on the screen"
					});
				},
				iSeeDropdownListItems: function (iCount) {
					return this.waitFor({
						controlType: "sap.m.List",
						searchOpenDialogs: true,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						check: function (aList) {
							var bFlag = false;
							aList.forEach(function (oList) {
								if (oList.getItems().length === iCount) {
									bFlag = true;
								}
							});
							return bFlag;
						},
						success: function () {
							Opa5.assert.ok(true, "Dropdown list has items");
						},
						errorMessage: "Dropdown list does not have Items"
					});
				},
				iShouldSeeEmptyDropdownList: function () {
					return this.waitFor({
						controlType: "sap.m.List",
						searchOpenDialogs: true,
						check: function (aList) {
							var bFlag = false;
							aList.forEach(function (oList) {
								if (oList.getItems().length === 0) {
									bFlag = true;
								}
							});
							return bFlag;
						},
						success: function () {
							Opa5.assert.ok(true, "Dropdown list is empty");
						},
						errorMessage: "Dropdown list is not empty"
					});
				},
				iSearchForItemsTable: function () {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.ui.table.Table",
						success: function (aTable) {
							Opa5.assert.ok(aTable[0].getRows().length > 0, "items have loaded");
						},
						errorMessage: "items have not loaded"
					});
				},
				iClickTheItemsInDynamicDatePopOver: function (sDynamicDateOption) {
					this.waitFor({
						controlType: "sap.m.Popover",
						success: function (aPopover) {
							for (var i in aPopover) {
								var oPopover = aPopover[i];
								if (oPopover.getContent() && oPopover.getContent()[0].isA("sap.m.DynamicDateRange")) {
									oPopover.getContent()[0].open();
									Opa5.assert.ok(true, "Dynamic Date Range Popover has been opened");
									break;
								}
							}
						},
						errorMessage: "Dynamic Date Range Control not found"
					});

					return this.waitFor({
						controlType: "sap.m.Popover",
						success: function (aPopover) {
							aPopover.forEach(function (oPopover) {
								if (oPopover.getContent()[0].isA("sap.m.NavContainer")) {
									var aItems = oPopover.getContent()[0].getPages() &&
										oPopover.getContent()[0].getPages()[0].getContent() &&
										oPopover.getContent()[0].getPages()[0].getContent()[0].getItems();
									aItems.forEach(function (aItem) {
										if (aItem && aItem.getTitle() === sDynamicDateOption) {
											aItem.firePress();
											Opa5.assert.ok(true, "Dynamic Date Range Option has been selected for the list");
											return null;
										}
									});
								}
							});
						},
						errorMessage: "Popover list not found on the Dynamic Date Range Popover"
					});
				},
				iCheckForCalendar: function (oDate, bIsSearchInDialog) {
					return this.waitFor({
						searchOpenDialogs: bIsSearchInDialog,
						controlType: "sap.ui.unified.Calendar",
						check: function (aCalendar) {
							var bFlag = false;
							aCalendar.forEach(function (oCalendar) {
								if (oCalendar.getSelectedDates().length > 0) {
									if (oCalendar.getSelectedDates()[0].getStartDate().getTime() === oDate.getTime()) {
										bFlag = true;
									}
								}
							});
							return bFlag;
						},
						success: function () {
							Opa5.assert.ok(true, "Calendar supported and filter value synced properly");
						},
						errorMessage: "Calendar not supported and filter value synced properly"
					});
				},
				iCheckVisualFilterBarInvisibleText: function (iPosition, sId, sMandatoryProperty, sOverlayMsg, sLabel) {
					return this.waitFor({
						controlType: "sap.m.HeaderContainer",
						check: function (aHeaderContainer) {
							var oContent = aHeaderContainer[0].getContent()[iPosition]; //get the VBox inside the correct HeaderContainerItemContainer
							var bSuccess = aHeaderContainer[0].getAriaLabelledBy()[iPosition].indexOf(sId) > -1; //modified for BCP-keepalive
							var aItems = oContent.getItems();
							var oTitle1 = aItems[0].getItems()[0].getContent()[0]; //first part of title in the OverflowToolbar
							var oTitle2 = aItems[0].getItems()[0].getContent()[1]; //second part of title in the OverflowToolbar
							var sMsg = oi18n.getText("VIS_FILTER_ITEM_ARIA");
							sMsg += " " + (oTitle2.getText().length > 0 ? oTitle1.getText() + oTitle2.getText() : oTitle1.getText());
							if (sMandatoryProperty) {
								sMsg += " " + oi18n.getText("VIS_FILTER_MANDATORY_PROPERTY_ARIA_LABEL");
							}
							if (sOverlayMsg) {
								sMsg += " " + oi18n.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE") + " " + oi18n.getText(sOverlayMsg, sLabel ? [sLabel] : undefined) + " " + oi18n.getText("VIS_FILTER_BAR_NAVIGATE_ARIA");
							}
							else {
								sMsg += " " + oi18n.getText("VIS_FILTER_BAR_NAVIGATE_ARIA") + " " + oi18n.getText("VIS_FILTER_ACCESS_FIELDS_ARIA");
							}
							//return bSuccess && (aItems[3].isA("sap.ui.core.InvisibleText") && aItems[3].getId() === sId && aItems[3].getText() === sMsg);
							//modified for BCP-keepalive
							return bSuccess && (aItems[2].isA("sap.ui.core.InvisibleText") && aItems[2].getId().indexOf(sId) > -1 && aItems[2].getText() === sMsg);
						},
						success: function () {
							Opa5.assert.ok(true, "InvisibleText with id " + sId + " is present for the visual filter on the bar.");
						},
						errorMessage: "InvisibleText is missing for the visual filter on the bar."
					});
				},
				iCheckFilterBarCollapsedText: function (sText) {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						success: function (oPage) {
							var title = oPage[0].getTitle();
							var text = title.getSnappedContent()[0].getText();
							Opa5.assert.ok(text === sText, "Filters are displayed as part of Filtered by section in collapsed mode");
						},
						errorMessage: "Filters are not displayed as part of Filtered by section in collapsed mode"
					});
				},
				iCheckMandatoryFieldsForErrorState: function () {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt",
						//searchOpenDialogs:true,
						check: function (aFilterBars) {
							var bSuccess = true;
							if (aFilterBars) {
								var aMandatoryFilterItems = aFilterBars[0].determineMandatoryFilterItems();
								for (var i = 0; i < aMandatoryFilterItems.length; i++) {
									var oFilterItem = aMandatoryFilterItems[i],
										oFilterItemControl = aFilterBars[0].determineControlByFilterItem(oFilterItem),
										oValueState = oFilterItemControl.getValueState();
									if (oValueState === sap.ui.core.ValueState.Error) {
										bSuccess = false;
										break;
									}
								}
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "Mandatory fields on the compact filter bar are not in error state on initial load");
						},
						errorMessage: "Mandatory fields on the compact filter bar are not in error state"
					});
				},
				iShouldSeePopOverButtons: function (btnName) {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						check: function (aPopover) {
							var bFlag = false;
							if (aPopover[0]) {
								if (aPopover[0].getBeginButton().getText().toLowerCase() === btnName.toLowerCase() || aPopover[0].getEndButton().getText().toLowerCase() === btnName.toLowerCase()) {
									bFlag = true;
								}
							}
							return bFlag;
						},
						success: function () {
							Opa5.assert.ok(true, " " + btnName.toLowerCase() + " Button is visible in the popOver");
						},
						errorMessage: " " + btnName.toLowerCase() + " Button is not visible in the popOver"
					});
				},
				iCheckPresenceOfChart: function () {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.InteractiveDonutChart",
						check: function (aCharts) {
							if (aCharts[0]) {
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Visual Filter Charts are loaded");
						},
						errorMessage: "Visual Filter Charts are not loaded"
					});
				},
				iCheckValuesFromExtensionAreApplied: function (sProperty, sChartType, iPosition) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.Interactive" + sChartType + "Chart",
						check: function (aCharts) {
							if (aCharts[iPosition]) {
								var sParentProperty = aCharts[iPosition].getParent().getParentProperty();
								if (sParentProperty === sProperty) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Visual Filter Chart is loaded with values from onBeforeVisualFilterRebindExtension");
						},
						errorMessage: "Visual Filter Chart is not rendered as values are not applied from onBeforeVisualFilterRebindExtension"
					});
				},
				isVisualFilterApplied: function (sChartType, sFieldName, value) {
					return this._isVisualFilterApplied(sChartType, sFieldName, value);
				},
				isVisualFilterNotApplied: function (sChartType, sFieldName, value) {
					return this._isVisualFilterApplied(sChartType, sFieldName, value, true);
				},
				_isVisualFilterApplied: function (sChartType, sFieldName, value, bCheckIfRemoved) {
					var sInteractiveChart;
					if (sChartType.toLowerCase() === "bar") {
						sInteractiveChart = "InteractiveBarChart";
					} else if (sChartType.toLowerCase() === "line") {
						sInteractiveChart = "InteractiveLineChart";
					} else if (sChartType.toLowerCase() === "donut") {
						sInteractiveChart = "InteractiveDonutChart";
					}
					var aAggregation;
					return this.waitFor({
						controlType: "sap.suite.ui.microchart." + sInteractiveChart,
						check: function (aCharts) {
							var bSuccess = bCheckIfRemoved;
							if (aCharts) {
								aCharts.forEach(function (oChart) {
									if (sFieldName && sFieldName !== oChart.getParent().getDimensionField()) {
										return;
									}
									var fGetAggregation = oChart.getBars || oChart.getPoints || oChart.getSegments,
										aChartAggregations = fGetAggregation.call(oChart);
									for (var i = 0; i < aChartAggregations.length; i++) {
										aAggregation = aChartAggregations[i];
										var CustomData = aAggregation.getCustomData()[0];
										if (CustomData.getProperty("value") === value) {
											bSuccess = aAggregation.getSelected() !== bCheckIfRemoved;
										}
									}
								});
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "Visual filter Applied Correctly");
						},
						errorMessage: "Visual filter not Applied Correctly"
					});
				},
				_isFilterAppliedOnFilterBar: function (filterName, value, bCheckIfRemoved, sStatusOfFilter) {
					var bSuccess;
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt",
						check: function (aFilterBars) {
							aFilterBars.forEach(function (oFilterBar) {
								var filterDataByFilterName = oFilterBar.getFilterData(true)[filterName];
								if (filterDataByFilterName) {
									if (filterDataByFilterName.items && filterDataByFilterName.items.length > 0) {
										filterDataByFilterName.items.forEach(function (oItem) {
											if (oItem.key === value) {
												bSuccess = true;
											}
										});
									} else if (filterDataByFilterName.ranges && filterDataByFilterName.ranges.length > 0) {
										filterDataByFilterName.ranges.forEach(function (oRange) {
											if (oRange.value1 === value || oRange.value1.toString() === value.toString()) {
												bSuccess = true;
											}
										});
									} else if (filterDataByFilterName.value === value) {
										bSuccess = true;
									} else if (filterDataByFilterName.toString() === value.toString()) {
										bSuccess = true;
									}
								}
							});
							if (bCheckIfRemoved && !bSuccess) {
								bSuccess = true;
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(bSuccess, "The filter is correctly " + sStatusOfFilter);
						},
						errorMessage: "The filter is not " + sStatusOfFilter
					});
				},
				isFilterNotAppliedOnFilterBar: function (filterName, value) {
					return this._isFilterAppliedOnFilterBar(filterName, value, true, "removed");
				},
				isFilterAppliedOnFilterBar: function (filterName, value) {
					return this._isFilterAppliedOnFilterBar(filterName, value, false, "applied");
				},
				iCheckFilterBarFilterIsApplied: function (filters) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt",
						success: function (filterBars) {
							var filterBar = filterBars[0];
							var filterData = filterBar.getFilterData();
							var keys = Object.keys(filterData);
							var values = Object.keys(filterData).map(function (key) {
								return filterData[key];
							});
							var filterKeys = Object.keys(filters);
							var filterValues = Object.keys(filters).map(function (key) {
								return filters[key];
							});
							var length = filterKeys.length;
							var success = true;
							for (var i = 0; i < length; i++) {
								var index = keys.indexOf(filterKeys[i]);
								if (index === -1 || values[index].ranges[0] && values[index].ranges[0].value1 != filterValues[i]) {
									success = false;
									break;
								}
							}
							// Here it is assumed that there will be only one default property applied via the Common.FilterDefaultValue Annotation for each Filter
							Opa5.assert.ok(success === true, "The Default Property is Applied");
						},
						errorMessage: "Failed to Apply the Default Property"
					});
				},
				//check go button visible or not
				iCheckGoButton: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Go"
						}),
						success: function () {
							Opa5.assert.ok(true, "The page has a Go button.");
						},
						errorMessage: "The page has no Go button."
					});
				},
				//Check if sFieldName VF has correct title and tooltip
				//sProperty can have possible values "title" or "tooltip"
				iCheckVFTitle: function (sMeasure, sDimension, sProperty, sValue) {
					var sText, oChart;
					var sTitleLeft, sTitleRight, sTooltip;
					return this.waitFor({
						controlType: "sap.m.Title",
						check: function (aTitles) {
							aTitles.forEach(function (oTitle) {
								try {
									//Check if title if for the supplied field
									oChart = oTitle.getParent().getParent().getParent().getItems()[1].getItems()[0];
									if (oChart.getDimensionField() !== sDimension || oChart.getMeasureField() !== sMeasure) {
										return; //Check next title
									}
									switch (sProperty) {
										case "title":
											//Left Matching
											sText = oTitle.getText();
											if (sValue.substring(0, sValue.indexOf("|")).trim() === sText.trim()) {
												sTitleLeft = sText;
											}
											//Right Matching
											sText = oTitle.getParent().getContent()[1].getText();
											if (sValue.substring(sValue.indexOf("|")).trim() === sText.trim()) {
												sTitleRight = sText;
											}
											break;
										case "tooltip":
											if (oTitle.getTooltip() === sValue) {
												sTooltip = sValue;
											}
											break;
										default:
											break;
									}
								}
								catch (error) {
									return; //ignore and read next title
								}
							});
							return !!((sTitleLeft && sTitleRight) || sTooltip);
						},
						success: function () {
							Opa5.assert.ok(true, "VF " + sDimension + " has correct " + sProperty);
						},
						errorMessage: "VF " + sProperty + " for " + sDimension + " is incorrect"
					});
				},
				iShouldSeeSelButn: function (bSearchInDialog, bEnabled) {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: bSearchInDialog,
						check: function (aButtons) {
							var bFlag = false;
							if (aButtons[0].getEnabled() === bEnabled) {
								bFlag = true;
							}
							return bFlag;
						},
						success: function () {
							Opa5.assert.ok(true, "ShowSel Button is Selected");
						},
						errorMessage: "ShowSel Button is not Selected"
					});
				},
				iShouldSeeSelectionText: function (bCount) {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						check: function (aPopover) {
							var bFlag = false;
							var aToolbar = aPopover[0].getContent();
							if (aToolbar[0]) {
								var cnt = aToolbar[0].getInfoToolbar().getContent()[0].getText();
								if (cnt.indexOf(bCount) !== -1) {
									bFlag = true;
								}
							};
							return bFlag;
						},
						success: function () {
							Opa5.assert.ok(true, "Selected button remove Clicked");
						},
						errorMessage: "Selected button remove not Clicked"
					});
				},
				iCheckVFSortOrder: function (sDimension1, sDimension2, bSearchInDialog) {
					var sText, sText1;
					return this.waitFor({
						controlType: "sap.m.Title",
						searchOpenDialogs: bSearchInDialog,
						check: function (aTitles) {
							if (bSearchInDialog) {
								sText = aTitles[2].getText();
								sText1 = aTitles[4].getText();
							} else {
								sText = aTitles[5].getText();
								sText1 = aTitles[7].getText();
							}
							if (sText.indexOf(sDimension1) !== -1 && sText1.indexOf(sDimension2) !== -1) {
								return true;
							} else {
								return false;
							}
						},
						success: function () {
							Opa5.assert.ok(true, "Visual Filters are in the expected order");
						},
						errorMessage: "Visual Filters are not in the proper order"
					});
				},
				//check share button
				iCheckForSingleShareButton: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function (oButtons) {
							//Find overflow button
							var oMoreButton;
							oButtons.forEach(function (oButton) {
								if (oButton.getIcon() === "sap-icon://overflow") {
									oMoreButton = oButton;
								}
							});
							// If there is more button fire press event
							if (oMoreButton) {
								oMoreButton.firePress();
							}
							var oShareButton;
							// Ensure that there is only one share button
							oButtons.forEach(function (oButton) {
								if (oButton.getTooltip() === "Share" && oShareButton) {
									//Return false if there is more than one share button
									return false;
								} else {
									oShareButton = oButton;
								}
							});
							//Return true if there is only one share button
							return oShareButton !== undefined;
						},
						success: function () {
							Opa5.assert.ok(true, "The page has only one Share button.");
						},
						errorMessage: "The page has zero or more than one Share button."
					});
				},
				//check date format
				iCheckDateFormat: function (parentProperty, bSearchInDialog) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.InteractiveLineChart",
						searchOpenDialogs: bSearchInDialog,
						check: function (aCharts) {
							if (aCharts) {
								for (var i = 0; i < aCharts.length; i++) {
									var oChart = aCharts[i];
									if (oChart.getParent().getParentProperty() === parentProperty) {
										var aPoints = oChart.getPoints();
										var nCount = 0;
										aPoints.forEach(function (oPoint) {
											//get the tooltip
											var sToolTip = oPoint.mAggregations.tooltip;
											//get the label
											var sLabel = oPoint.getProperty("label");
											var bSecondaryLabel = oPoint.getProperty("secondaryLabel");
											var displayConcatenatedLabel = sLabel.concat(" ", bSecondaryLabel);
											//check whether the label and tooltip are showing the date in medium format or not.
											if (sLabel === "Dec 10, 2016" || sLabel === "Dec 11, 2016" || sLabel === "Oct 24, 2018" && sLabel === sToolTip.substr(0, 12)) {
												nCount++;
											} else if (displayConcatenatedLabel === "Aug 2019" || displayConcatenatedLabel === "Sep 2019" || displayConcatenatedLabel === "Oct 2019" || displayConcatenatedLabel === "Nov 2019" || displayConcatenatedLabel === "Dec 2019" && sLabel === sToolTip.substr(0, 3)) {
												nCount++;
											} else if (displayConcatenatedLabel === "Q1 2022" || displayConcatenatedLabel === "Q2 2021" || displayConcatenatedLabel === "Q3 2021" || displayConcatenatedLabel === "Q4 2021" && sLabel === sToolTip.substr(0, 2)) {
												nCount++;
											} else if (displayConcatenatedLabel === "9 2021" && sLabel === sToolTip.substr(0, 1)) {
												nCount++;
											} else if (displayConcatenatedLabel === "CW 32 2021" || displayConcatenatedLabel === "CW 42 2021" || displayConcatenatedLabel === "CW 44 2021" || displayConcatenatedLabel === "CW 45 2021" || displayConcatenatedLabel === "CW 50 2021" || displayConcatenatedLabel === "CW 22 2022" && sLabel === sToolTip.substr(0, 5)) {
												nCount++;
											}
										});
										//return true if all the tooltip and labels are in correct format.
										return nCount === aPoints.length;
									}
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "The Line Chart is showing date in medium format");
						},
						errorMessage: "The Line chart is showing date in wrong format"
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
				iCheckForButtonWithAriaHasPopup: function (sId, bIsInsideDialog) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = oAppParams.ALPPrefixID + "--" + sId;
					return this.waitFor({
						searchOpenDialogs: bIsInsideDialog,
						id: sIntId,
						matchers: new PropertyStrictEquals({
							name: "ariaHasPopup",
							value: sap.ui.core.aria.HasPopup.Dialog
						}),
						success: function () {
							Opa5.assert.ok(true, "The button with id" + "contains ariaHasPopup");
						},
						errorMessage: "The button with id " + "doesn't contain ariaHasPopup"
					});
				},
				//check selected Button count
				iCheckSelectedButtonCount: function (num, sProp) {
					return this.waitFor({
						controlType: "sap.m.Button",
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
				iCheckVHTooltip: function (chartType, dimensionField, tooltipMessage, itemsSelected) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.Interactive" + chartType + "Chart",
						check: function (aCharts) {
							var sDimField = dimensionField.replace(/\s+/g, '');
							for (var i = 0; i < aCharts.length; i++) {
								if (aCharts[i] && aCharts[i].getParent().getDimensionField() === sDimField) {
									//since tooltip can vary across charts, first get the chart control and then get the VH button tooltip.
									var tooltip = aCharts[i].getParent().getParent().getParent().getParent().getItem().getItems()[0].getItems()[0].getContent()[3].getTooltip();
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
				iCheckVFLabelAndTooltip: function (chartType, dimensionField, sLabel, bOpenDialog) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.Interactive" + chartType + "Chart",
						searchOpenDialogs: bOpenDialog || false,
						check: function (aCharts) {
							for (var i = 0; i < aCharts.length; i++) {
								if (aCharts[i] && aCharts[i].getParent().getDimensionField() === dimensionField) {
									if (aCharts[i].getPoints()[0].getLabel() === sLabel && aCharts[i].getPoints()[0].getTooltip().indexOf(sLabel) !== -1) {
										return true;
									}
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Appropriate Label");
						},
						errorMessage: "Incorrect Label"
					});
				},
				iCheckVFLabelAndTooltipChart: function (sChartType, dimensionField, sLabel) {
					var sInteractiveChart;
					if (sChartType.toLowerCase() === "bar") {
						sInteractiveChart = "InteractiveBarChart";
					} else if (sChartType.toLowerCase() === "line") {
						sInteractiveChart = "InteractiveLineChart";
					} else if (sChartType.toLowerCase() === "donut") {
						sInteractiveChart = "InteractiveDonutChart";
					}
					return this.waitFor({
						controlType: "sap.suite.ui.microchart." + sInteractiveChart,
						check: function (aCharts) {
							for (var i = 0; i < aCharts.length; i++) {
								if (aCharts[i] && aCharts[i].getParent().getDimensionField() === dimensionField) {
									var fn = aCharts[i].getPoints || aCharts[i].getBars || aCharts[i].getSegments;
									fn = fn.call(aCharts[i]);
									for (var j = 0; j < fn.length; j++) {
										if (fn[j].getLabel() === sLabel && fn[j].getTooltip().indexOf(sLabel) !== -1)
											return true;
									}
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Appropriate Label");
						},
						errorMessage: "Incorrect Label"
					});
				},
				iCheckVFChartSelected: function (sChartType, value, parentProperty, isNotSelected) {
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
				iCheckHiddenFilters: function (iChartCnt) {
					var count = 0
					return this.waitFor({
						controlType: "sap.m.VBox",
						check: function (aVBox) {
							if (aVBox) {
								var bSuccess = false;
								aVBox.forEach(function (oVBox) {
									if (oVBox.getFieldGroupIds()[0] === "headerBar") {
										bSuccess = true;
										count++;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(count === iChartCnt, "Hidden filters are not loaded");
						},
						errorMessage: "Hidden filters are loaded"
					});
				},
				iCheckDropdownResponsivePopoverforTextArrangement: function (sTextArrangement) {
					var list;
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						check: function (aPopover) {
							var isProperlyTextArranged = false;
							var aToolbar = aPopover[0].getContent();
							if (aToolbar[0]) {
								dropDownList = aToolbar[0];
								list = aToolbar[0].getItems();
								list[1].setSelected(!list[1].getSelected());
								if (sTextArrangement === "idAndDescription") {
									isProperlyTextArranged = (list[1].getTitle().indexOf("(") && list[1].getTitle().indexOf(")"));
								}
							};
							return isProperlyTextArranged;
						},
						success: function () {
							Opa5.assert.ok(true, "Drop Down is showing Label as per Text Arrangement");
						},
						errorMessage: "Dropdown is not showing Label as per Text Arrangement"
					});
				},
				iCheckDropdownResponsivePopoverFromNavigationText: function () {
					var dropDownList, list;
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						check: function (aPopover) {
							var aToolbar = aPopover[0].getContent();
							if (aToolbar[0]) {
								dropDownList = aToolbar[0];
								if (dropDownList.getItems()[0].getTitle().indexOf("United States Dollar") !== -1) {
									return true;
								}
							};
						},
						success: function () {
							Opa5.assert.ok(true, "Drop Down is showing titles from the navigation property");
						},
						errorMessage: "Dropdown is not showing titles from the navigation property"
					});
				},
				iCheckVFLabelforTextArangement: function (sChartType, sTextArrangement, bSearchInDialog) {
					var sInteractiveChart;
					if (sChartType.toLowerCase() === "bar") {
						sInteractiveChart = "InteractiveBarChart";
					} else if (sChartType.toLowerCase() === "line") {
						sInteractiveChart = "InteractiveLineChart";
					} else if (sChartType.toLowerCase() === "donut") {
						sInteractiveChart = "InteractiveDonutChart";
					}
					return this.waitFor({
						controlType: "sap.suite.ui.microchart." + sInteractiveChart,
						searchOpenDialogs: bSearchInDialog,
						check: function (aCharts) {
							if (aCharts[0]) {
								var oChart = aCharts[0];
								if (sInteractiveChart === "InteractiveBarChart") {
									var aBars = oChart.getBars();
								} else if (sInteractiveChart === "InteractiveLineChart") {
									var aBars = oChart.getPoints();
								} else {
									var aBars = oChart.getSegments();
								}
								var nCount = 0;
								aBars.forEach(function (oBar) {
									var sToolTip = oBar.getTooltip();
									var sLabel = oBar.getProperty("label");
									var dimValue = oBar.getCustomData()[0].getValue();
									if (sTextArrangement === "TextFirst") {
										dimValue = "(" + dimValue + ")";
									} else {
										dimValue = dimValue + " (";
									}
									if (sLabel !== "Other") {
										if (sLabel.indexOf(dimValue) !== -1 && sToolTip.indexOf(sLabel) !== -1) {
											nCount++;
										}
									}
								});
								//return true if all the tooltip and labels are in correct format.
								if (sChartType.toLowerCase() === "donut") {
									return nCount === aBars.length - 1;
								} else {
									return nCount === aBars.length;
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "The " + sChartType + " Chart is showing Label as per Text Arrangement");
						},
						errorMessage: "The " + sChartType + " Chart is not showing Label as per Text Arrangement"
					});
				},
				iCheckPopoverLabelforTextArangement: function (bSearchInDialog) {
					var aBarCharTitle = [];
					this.waitFor({
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						searchOpenDialogs: bSearchInDialog,
						success: function (aCharts) {
							var aBars = aCharts[0].getBars();
							aBars.forEach(function (oBar) {
								aBarCharTitle.push(oBar.getProperty("label"));
							});
						}
					});
					return this.waitFor({
						controlType: "sap.m.Popover",
						check: function (aPopover) {
							var bFlag = false;
							var oList = aPopover[0].getContent()[0];
							var aItems = oList.getItems();
							aItems.forEach(function (oItem) {
								var sTitle = oItem.getTitle();
								if (aBarCharTitle.indexOf(sTitle) !== -1) {
									bFlag = true;
								}
							});
							return bFlag;
						},
						success: function () {
							Opa5.assert.ok(true, "The Bar Chart Popover is showing Label as per Text Arrangement");
						},
						errorMessage: "The Bar Chart Popover is not showing Label as per Text Arrangement"
					});
				},
				iCheckOverlay: function (bVisible, overlayMessage, vfCount, sLabel) {
					var count = 0, bSuccess = true;
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",
						visible: bVisible,
						check: function (aVisualFilters) {
							var headerContents = aVisualFilters[0].getContent();
							for (var i = 0; i < headerContents.length; i++) {
								var vBox = headerContents[i].getItems()[1];
								if (vBox.getItems()[0]._chart.getErrorMessage() === oi18n.getText(overlayMessage, sLabel ? [sLabel] : undefined) && vBox.getItems()[0]._chart.getShowError() === bVisible) {
									count++;
									bSuccess = true;
								}
							}
							if (bSuccess && count === vfCount) {
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "overlay exists on " + vfCount + " charts");
						},
						errorMessage: "Overlay has not been applied"
					});
				},
				//function to check whether the overlay is present for a particular VFChart
				iCheckOverlayForChart: function (bVisible, overlayMessage, vfItem, sLabel) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",
						visible: bVisible,
						check: function (aContainer) {
							var headerContents = aContainer[0].getContent();
							var vBox = headerContents[vfItem - 1].getItems()[1];
							if (vBox.getItems()[0]._chart.getErrorMessage() === oi18n.getText(overlayMessage, sLabel ? [sLabel] : undefined) && vBox.getVisible() === bVisible) {
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "overlay exists for chart " + vfItem);
						},
						errorMessage: "Overlay has not been applied"
					});
				},
				//function to confirm that the overlay is not present for a particular VFChart
				iCheckNoOverlayForChart: function (bVisible, vfItem) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",
						visible: bVisible,
						check: function (aContainer) {
							var headerContents = aContainer[0].getContent();
							var vBox = headerContents[vfItem - 1].getItems()[1];
							if (vBox.getItems()[0]._chart.getShowError() === bVisible) {
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "overlay does not exist for chart " + vfItem);
						},
						errorMessage: "Overlay has  been applied"
					});
				},
				isChartColored: function (chartType, fieldName, colorValue, bOpenDialog) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart." + chartType,
						searchOpenDialogs: bOpenDialog ? true : false,
						check: function (aCharts) {
							if (aCharts) {
								var bSuccess = true;
								aCharts.forEach(function (oChart) {
									if (oChart.getParent().getDimensionField() === fieldName) {
										switch (chartType) {
											case "InteractiveBarChart":
												var bars = oChart.getBars();
												for (var i = 0; i < bars.length; i++) {
													if (bars[i].getColor() !== colorValue[i]) {
														bSuccess = false;
													}
												}
												break;
											case "InteractiveLineChart":
												var points = oChart.getPoints();;
												for (var i = 0; i < points.length; i++) {
													if (points[i].getColor() !== colorValue[i]) {
														bSuccess = false;
													}
												}
												break;
											case "InteractiveDonutChart":
												var segments = oChart.getSegments();
												for (var i = 0; i < segments.length; i++) {
													if (segments[i].getColor() !== colorValue[i]) {
														bSuccess = false;
													}
												}
												break;
											default:
												break;
										}
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Semantic Coloring implemented correctly");
						},
						errorMessage: "Semantic Coloring not implemented correctly"
					});
				},
				isParameterApplied: function (paramsName, value) {
					var bSuccess;
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt",
						check: function (aFilterBars) {
							aFilterBars.forEach(function (oFilterBar) {
								var filterData = oFilterBar.getFilterData(true);
								var filterValue = filterData[paramsName];
								bSuccess = (filterValue !== null && filterValue !== undefined && filterValue === value);
							});
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "The Parameter is Applied");
						},
						errorMessage: "The Parameter is not Applied"
					});
				},
				iCheckVFLabelForChart: function (sChartType, bSearchInDialog) {
					var sInteractiveChart;
					if (sChartType.toLowerCase() === "bar") {
						sInteractiveChart = "InteractiveBarChart";
					} else if (sChartType.toLowerCase() === "line") {
						sInteractiveChart = "InteractiveLineChart";
					} else if (sChartType.toLowerCase() === "donut") {
						sInteractiveChart = "InteractiveDonutChart";
					}
					return this.waitFor({
						controlType: "sap.suite.ui.microchart." + sInteractiveChart,
						searchOpenDialogs: bSearchInDialog,
						check: function (aCharts) {
							if (aCharts[0]) {
								var oChart = aCharts[0];
								var aBars = oChart.getBars() || oChart.getPoints() || oChart.getSegments();
								var nCount = 0;
								aBars.forEach(function (oBar) {
									var sToolTip = oBar.getTooltip();
									var sLabel = oBar.getProperty("label");
									var dimValue = oBar.getCustomData()[0].getValue();
									if (sToolTip.indexOf(sLabel) !== -1 && sToolTip.indexOf(dimValue) !== -1) {
										nCount++;
									}
								});
								return nCount === aBars.length;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "The " + sChartType + " Chart is showing proper entries for Label and Value");
						},
						errorMessage: "The " + sChartType + " Bar Chart is not showing proper entries for Label and Value"
					});
				},
				iCheckTokensAreApplied: function (sProperty, aTokenValues) {
					return this.waitFor({
						id: ApplicationSettings.getAppParameters().ALPPrefixID + "--template::SmartFilterBar-filterItemControl_BASIC-" + sProperty,
						success: function (oInput) {
							var count = 0;
							var aTokens = oInput.getTokens();
							for (var i in aTokenValues) {
								for (var j in aTokens) {
									if (aTokens[j].getText() === aTokenValues[i]) {
										count++;
										break;
									}
								}
							}
							if (count === aTokenValues.length) {
								return true;
							}
							Opa5.assert.ok(true, "Tokens have been applied");
						},
						errorMessage: "Tokens have not been applied"
					});
				},
				iCheckFilterInFilterBar: function (sProperty, bIsPresent, bIsDropDown) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt",
						check: function (aFilterBar) {
							if (!aFilterBar[0]) {
								return false;
							}
							var aInput = aFilterBar[0].getFilterGroupItems();
							for (var i in aInput) {
								if (aInput[i].getName().indexOf(sProperty) > -1 && aInput[i].getVisibleInFilterBar()) {
									return bIsPresent;
								}
							}
							return !bIsPresent;
						},
						success: function () {
							Opa5.assert.ok(true, sProperty + " is " + (bIsPresent ? "" : "not ") + "present in the filter bar");
						},
						errorMessage: sProperty + " is " + (bIsPresent ? "" : "not ") + "present in the filter bar"
					});
				},
				iCheckChartTitleInTheBar: function (chartTitle) {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aToolbars) {
							var chartTitleSplit = chartTitle.split(" | "),
								firstPartTitle, secondPartTitle;
							if (chartTitleSplit.length === 1) {
								chartTitleSplit.push("");
							}
							for (var i = 0; i < aToolbars.length; i++) {
								firstPartTitle = false, secondPartTitle = false;
								if (aToolbars[i].hasStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterTitleToolbar")) {
									var aTitles = aToolbars[i].getContent();
									firstPartTitle = aTitles[0] && aTitles[0].getText && chartTitleSplit[0].indexOf(aTitles[0].getText()) > -1;
									secondPartTitle = aTitles[1] && aTitles[1].getText && aTitles[1].getText().indexOf(chartTitleSplit[1]) > -1;
									if (firstPartTitle && secondPartTitle) {
										return true;
									}
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
				iCheckSetPressPinButton: function (bVisible) {
					return this.waitFor({
						controlType: "sap.f.DynamicPageHeader",
						success: function (aDynamicHeader) {
							var bPinButtonPressed = aDynamicHeader[0]._getPinButton().getPressed();
							Opa5.assert.ok(bPinButtonPressed === bVisible, "Pin Button Pressed ok");
						},
						errorMessage: "Pin Button Pressed not ok"
					});
				},
				iCheckUnitFieldInChart: function (sUnit, sChartType, sProperty, bIsUnitPresentInChart/* optional */, bSearchInDialog/* optional */) {
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
						searchOpenDialogs: !!bSearchInDialog,
						check: function (aCharts) {
							var bSuccess = false;
							if (aCharts) {
								aCharts.forEach(function (oChart) {
									if (sProperty !== oChart.getParent().getDimensionField()) {
										return;
									}
									var fGetAggregation = oChart.getBars || oChart.getPoints || oChart.getSegments,
										aChartAggregations = fGetAggregation.call(oChart);
									for (var i = 0; i < aChartAggregations.length; i++) {
										aAggregation = aChartAggregations[i];
										if (aAggregation.getDisplayedValue().endsWith(sUnit) !== bIsUnitPresentInChart) {
											bSuccess = false;
										}
										bSuccess = true;
									}
								});
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "Unit field is " + (bIsUnitPresentInChart ? "" : "not") + "present in the chart");
						},
						errorMessage: "Unit field is " + (bIsUnitPresentInChart ? "" : "not") + "present in the chart"
					});
				}
			}
		}
	});
});
