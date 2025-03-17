/*global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/Common/Common",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/utils/OpaManifest",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/utils/OpaResourceBundle",
	"sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings"
], function (Opa5, Common, Press, PropertyStrictEquals, OpaManifest, OpaResourceBundle, ApplicationSettings) {

	"use strict";
	var oi18n = OpaResourceBundle.template["AnalyticalListPage"].getResourceBundle();
	Opa5.createPageObjects({
		onTheMainPage: {
			baseClass: Common,
			actions: {
				iAppylHiddenFilterToFilterBar: function (sFilterRestriction, sFilterName, sValue) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt",
						check: function (aFilterBars) {
							var oFilter = {},
								bSuccess = false;
							if (sFilterRestriction === "single") {
								oFilter[sFilterName] = sValue;
							} else if (sFilterRestriction === "multiple") {
								oFilter[sFilterName] = {
									items: [],
									ranges: [],
									value: null
								};
								if (typeof sValue === "string") {
									oFilter[sFilterName].value = sValue
								}
								// TODO: enhance to add filters to items and ranges as well
							}
							aFilterBars[0].setFilterData(oFilter);
							var oFilters = aFilterBars[0].getFilterData(true);
							if (sFilterRestriction === "single" && oFilters[sFilterName] === sValue) {
								bSuccess = true;
							} else if (sFilterRestriction === "multiple") {
								if (typeof sValue === "string" && oFilters[sFilterName].value === sValue) {
									bSuccess = true;
								}
								// TODO: enhance to add filters to items and ranges as well
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "The hidden filter is successfully applied");
						},
						errorMessage: "The hidden filter is not applied"
					});
				},
				//Click anywhere on the page to close the popover
				iCloseTheKPIPopover: function () {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						success: function (aPopovers) {
							aPopovers.forEach(function (oPopover) {
								oPopover.destroy();
								Opa5.assert.ok(true, "The PopOver is closed");
							});
						},
						errorMessage: "The KPI popover cannot be removed"
					});
				},
				iSelectKPIChart: function () {
					return this.waitFor({
						controlType: "sap.viz.ui5.controls.VizFrame",
						searchOpenDialogs: true,
						check: function (kpis) {
							if (kpis) {
								var action = {
									clearSelection: true
								};
								//no API to get top 3 data of viz chart for selections
								//hence directly creating data object and passing it to the the selection event
								var points = [{
									data: {
										"Net Amount": 278455.22,
										"Customer Country Name": "Argentina",
										"Customer Country Name.d": "Argentina"
									}
								}];
								kpis[0].vizSelection(points, action);
								kpis[0].fireSelectData();
								return true;
							}
							return false
						},
						timeout: 45,
						success: function () {
							Opa5.assert.ok(true, "Navigated to new application from KPI chart");
						},
						errorMessage: "Error in navigation from KPI chart"
					});
				},
				iClickKPIHeader: function () {
					return this.waitFor({
						controlType: "sap.m.VBox",
						searchOpenDialogs: true,
						success: function (aHBox) {
							for (var i in aHBox) {
								if (aHBox[i].getId().indexOf("ovpCardHeader") !== -1) {
									aHBox[i].$().trigger("click");
									Opa5.assert.ok(true, "KPI card header clicked");
								}
							}
						},
						errorMessage: "Header in KPI card not clicked"
					});
				},
				iClickRowActionDetails: function (iRowIndex) {
					iRowIndex = iRowIndex ? iRowIndex : 0;
					return this.waitFor({
						controlType: "sap.ui.table.RowAction",
						success: function (oButton) {
							var items = oButton[iRowIndex].getItems();
							items[0].firePress();
							Opa5.assert.ok(true, "RowAction for the index '" + iRowIndex + "' is clicked");
						},
						errorMessage: "The page has no row action button."
					});
				},
				iClickRowActionButton: function () {
					return this.waitFor({
						controlType: "sap.ui.table.RowAction",
						success: function (oButton) {
							oButton[0].$().trigger("click");
							Opa5.assert.ok(true, "RowAction is clicked");
						},
						errorMessage: "The page has no navigation enabled."
					});
				},
				iClickFilterBarHeader: function () {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						success: function (oPage) {
							oPage[0].setHeaderExpanded(!oPage[0].getHeaderExpanded());
							Opa5.assert.ok(true, "Filterbar header is clicked");
						},
						errorMessage: "The Filterbar header is not clicked"
					});
				},
				iClickShareIcon: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "tooltip",
							value: "Share (Shift+Ctrl+S)"
						}),
						actions: new Press(),
						success: function () {
							Opa5.assert.ok(true, "Share icon clicked");
						},
						errorMessage: "Share icon is not found"
					});
				}
			},

			assertions: {
				iCheckAbsenceOfValueHelpButton: function (sProperty, bSearchDialog) {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: !!bSearchDialog,
						check: function (aButton) {
							for (var i in aButton) {
								var oButton = aButton[i],
									sTooltip = oButton.getTooltip && oButton.getTooltip() && oButton.getTooltip().indexOf(sProperty) > -1;
								if (sTooltip) {
									return false;
								}
							}
							return true;
						},
						success: function () {
							Opa5.assert.ok(true, "Value help button not found");
						},
						errorMessage: "Value help button found"
					});
				},
				iCheckForHiddenKPI: function (kpiName) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						check: function (kpis) {
							var bIsKPIHidden = true;
							if (kpis) {
								for (var i = 0; i < kpis.length; i++) {
									if (kpis[i].sId.indexOf(kpiName) !== -1) {
										bIsKPIHidden = false;
										return bIsKPIHidden;
									}
								}
							}
							return bIsKPIHidden;
						},
						success: function () {
							Opa5.assert.ok(true, "KPI is hidden");
						},
						errorMessage: "KPI is not hidden"
					});
				},
				iCheckTheChartTableSegmentedButtonDoesNotOverflow: function () {
					return this.waitFor({
						controlType: "sap.m.SegmentedButton",
						check: function (aSegmentedButtons) {
							return aSegmentedButtons.some(function (oSegmentedButton) {
								if (oSegmentedButton.getParent().getId() === "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITagContainer::filterableKPIs") {
									return true;
								}
								return false;
							});
						},
						success: function () {
							Opa5.assert.ok(true, "The SegmentedButton does not overflow.");
						},
						errorMessage: "The SegmentedButton does overflow"
					});
				},
				iCheckVisualFilterVHButtonDisabled: function (bSearchOpenDialogs, sTitleText) {
					return this.waitFor({
						controlType: "sap.m.VBox",
						searchOpenDialogs: bSearchOpenDialogs,
						check: function (aVBox) {
							return aVBox.some(function (oVBox) {
								if (oVBox.getItems()[0].isA("sap.m.OverflowToolbar")) {
									if (oVBox.getItems()[0].getTitleControl() && oVBox.getItems()[0].getTitleControl().getText() === sTitleText) {
										return true;
									}
								}
							});
						},
						success: function () {
							Opa5.assert.ok(true, "The valuehelp/datepicker/dropdown button on the visual filter is disabled");
						},
						errorMessage: "The valuehelp/datepicker/dropdown button on the visual filter is not disabled"
					});
				},
				iCheckNumberofFractionalDigit: function (sQualifierName, decimal) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						success: function (kpis) {
							var oKPI = kpis.filter(function (oKPI) {
								return oKPI.getQualifier() === sQualifierName;
							})[0];
							Opa5.assert.ok(oKPI.kpiSettings.dataPoint.ValueFormat.NumberOfFractionalDigits.Int == decimal, "Fractional digits number matched");
						},
						errorMessage: "The KPI are not being displayed"
					});
				},
				iCheckKpiScaleFactor: function (sQualifierName, scale) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						success: function (kpis) {
							var oKPI = kpis.filter(function (oKPI) {
								return oKPI.getQualifier() === sQualifierName;
							})[0];
							Opa5.assert.ok(oKPI.getValue() != undefined && (oKPI.getValue().getNumber().indexOf(scale) > 0), "KPI Scale factor is found as expected");
						},
						errorMessage: "The KPI are not being displayed"
					});
				},
				iCheckKpiValue: function (sQualifierName, value) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						success: function (kpis) {
							var oKPI = kpis.filter(function (oKPI) {
								return oKPI.getQualifier() === sQualifierName;
							})[0];
							Opa5.assert.ok(oKPI.getValue().getNumber() === value, "The KPI has proper values");
						},
						errorMessage: "The KPI are not being displayed"
					});
				},
				iCheckKpiTagTitle: function (nId) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag",
						success: function (kpis) {
							var kpiTag = kpis[nId];
							if (kpiTag.mProperties.shortDescription != undefined && (kpiTag.mProperties.value != undefined)) {
								Opa5.assert.ok(true, "The KPI has the correct title");
							}
						},
						errorMessage: "kpi has incorrect title"
					});
				},
				iCheckKpiTagTitleWithUoM: function (nId, val) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag",
						success: function (kpis) {
							Opa5.assert.ok(kpis[nId].getUnit() === val, "The KPI Tag title displays the mentioned UoM");
						},
						errorMessage: "The KPI UoM is not been displayed"
					});
				},
				iCheckKpiTagTooltip: function (nId, sTooltipMsg, sIndicator) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag",
						success: function (kpis) {
							var kpiTag = kpis[nId];
							var sKpiIndicator = kpiTag.getIndicator(),
								bIndicatorsMatch = (sKpiIndicator === sIndicator) || (sKpiIndicator === "Critical" && sIndicator === "Risk") || (sKpiIndicator === "Positive" && sIndicator === "Good") || (!sKpiIndicator && sIndicator === "Neutral")
							if ((kpiTag.getTooltip().indexOf(sTooltipMsg) > -1) && bIndicatorsMatch) {
								Opa5.assert.ok(true, "kpi has the correct tooltip");
							}
						},
						errorMessage: "The KPI are not being displayed"
					});
				},
				iCheckVFMandatoryFilter: function (VFProperty, MandatoryProp, sChartType, MandatoryPropValue, bVFIsMainEntitySet) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicro" + sChartType,
						success: function (aVF) {
							var oVF;
							for (var i = 0; i < aVF.length; i++) {
								if (aVF[i].getParentProperty() === VFProperty) {
									oVF = aVF[i];
									break;
								}
							}
							var filtersApplied = oVF.getDimensionFilterExternal().aFilters[0].aFilters;
							for (var j = 0; j < filtersApplied.length; j++) {
								if (filtersApplied[j].sPath === MandatoryProp && filtersApplied[j].oValue1 === MandatoryPropValue) {
									var sMsg = bVFIsMainEntitySet ? "The mandatory field value is passed to the visual filter without defining it as In Parameter" : "The Mandatory filter value is passed to the VF that is from different a entity set";
									Opa5.assert.ok(true, sMsg);
									break;
								}
							}
						},
						errorMessage: "The mandatory filter value is not passed to the VF"
					});
				},
				iShouldSeeTheComponent: function (label, type, props, settings) {
					var checkId;
					var checkStyleClass;
					var waitForConfig = {
						controlType: type,
						check: function (comps) {
							for (var i = 0; i < comps.length; i++) {
								var comp = comps[i];
								if (checkId && comp.getId) {
									if (comp.getId() == checkId || comp.getId() == "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--" + checkId) { // some IDs are namespaced
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
						timeout: 70,
						success: function () {
							Opa5.assert.ok(true, "The main page has the " + label + ".");
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
				iShouldSeeTheInteractiveChartControls: function (label, control) {
					return this.waitFor({
						controlType: control,
						success: function (ctrls) {
							var isPercentage = false;
							for (var i = 0; i < ctrls.length; i++) {
								var aggregations = ctrls[i].getBars();
								for (var j = 0; j < aggregations.length; j++) {
									isPercentage = aggregations[j].getProperty('displayedValue').indexOf("%");
								}
								Opa5.assert.ok(true, (isPercentage) ? "The" + label + "has percentage" : "The" + label + "has absolute values");
							}
						},
						errorMessage: "The page doesn't have " + label + "control."
					});
				},

				//TODO: Checks if any variant is present in the page.
				//Conditions to check for page level , chart and table should be done if the smartVariantManagement is enabled
				iShouldSeeVariantControls: function () {
					return this.waitFor({
						controlType: "sap.m.VariantManagement",
						success: function (ctrls) {
							for (var i = 0; i < ctrls.length; i++) {
								var ctrl = ctrls[i];
								Opa5.assert.ok(true, "The main page has the " + ctrl + ".");
							}
						},
						errorMessage: "The page doesn't have a variant control."
					});
				},
				iCheckFilterCount: function (count, id) {
					return this.waitFor({
						controlType: "sap.m.Button",
						success: function (btns) {
							var checkVFId = "template::VisualFilterDialogButton";
							var checkCFId = "template::SmartFilterBar-btnFilters";
							var cntrlId = id ? id + "::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--" : "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--"
							var bAsserit = false;
							for (var i = 0; i < btns.length; i++) {
								var btn = btns[i];
								if (btn.getId() === checkVFId || (btn.getId() === cntrlId + checkVFId) || (btn.getId() === cntrlId + checkCFId)) {
									var filterText = btn.getText();
									if (filterText === "Adapt Filters (" + count + ")" || filterText === "Adapt Filters") {
										bAsserit = true;
									}
								}
							}
							Opa5.assert.ok(bAsserit, "Filter count has been updated");
						},
						errorMessage: "The filter count value is incorrect"
					});
				},
				iCheckTooltip: function (buttonType, filterBarType) {
					return this.waitFor({
						controlType: "sap.m.Button",
						success: function (btns) {
							var contrlId, bAsserit = false;
							var templateId = filterBarType === "SmartFilterbar" ? "template::SmartFilterBar" : "";
							if (buttonType === "Adapt Filter Button") {
								contrlId = templateId === "" ? "template::VisualFilterDialogButton" : templateId + "-btnFilters";
							} else if (buttonType === "Go Button") {
								contrlId = templateId === "" ? "template::GoFilters" : templateId + "-btnGo";
							}
							for (var i = 0; i < btns.length; i++) {
								var btn = btns[i];
								if (btn.getId().indexOf(contrlId) !== -1) {
									bAsserit = btn.getText() === btn.getTooltip();
								}
							}
							Opa5.assert.ok(bAsserit, "The tooltip for " + buttonType + " is correct");
						},
						errorMessage: "The tooltip for " + buttonType + " is incorrect"
					});
				},
				iCheckFilterCountInOverflowToolbar: function (count) {
					var filterButton;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aOverflowToolbar) {
							if (aOverflowToolbar.length) {
								for (var j = 0; j < aOverflowToolbar.length; j++) {
									var aToolbarContents = aOverflowToolbar[j].getContent();
									for (var i = 0; i < aToolbarContents.length; i++) {
										//check for dialog button in CF or VF mode
										if (aToolbarContents[i].sId.indexOf("VisualFilterDialogButton") > 0 || aToolbarContents[i].sId.indexOf("SmartFilterBar-btnFilters") > 0) {
											filterButton = aToolbarContents[i];
											if (filterButton.getText().indexOf(count) > 0) {
												return true;
											}
										}
									}
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "Filter count correct");
						},
						errorMessage: "Incorrect filter count"
					});
				},
				iCheckForFilterSwitch: function () {
					return this.waitFor({
						controlType: "sap.m.SegmentedButton",
						check: function (aButtons) {
							var checkId = "template::FilterSwitchButton"
							var bFlag = true;
							aButtons.forEach(function (oButton) {
								if (oButton.getId() == checkId || oButton.getId() == "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--" + checkId) {
									bFlag = false;
								}
							});
							return bFlag;
						},
						success: function () {
							Opa5.assert.ok(true, "FilterSwitch is not present");
						},
						errorMessage: "Filter Switch is present"
					});
				},
				iCheckVisualFilterCharts: function (iChartCnt) {
					var count = 0;
					return this.waitFor({
						controlType: "sap.m.VBox",
						check: function (aVBox) {
							var bSuccess = true;
							if (aVBox) {
								//var bSuccess = false;
								aVBox.forEach(function (oVBox) {
									if (oVBox.getFieldGroupIds()[0] === "headerBar") {
										bSuccess = true;
										count++;
									}
								});
								return bSuccess;
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(count === iChartCnt || iChartCnt === 0, count + " VF Charts are present");
						},
						errorMessage: count + " VF Charts are present"
					});
				},
				iCheckVFChartandTitleWidth: function () {
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.HeaderContainer",
						check: function (aContainer) {
							var headerContents = aContainer[0].getContent();
							for (var i = 0; i < headerContents.length; i++) {
								var oVBox = headerContents[i];
								if (oVBox.getItems()[0].$().css("width") === oVBox.getItems()[1].$().css("width")) {
									bSuccess = true;
								} else {
									bSuccess = false;
									break;
								}
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(bSuccess, "VF Chart and Title width are equal");
						},
						errorMessage: "VF Chart and Title width are not equal"
					});
				},
				iShouldSeeTheFilterVisibility: function () {
					var bIsCF = false,
						bIsVF = false;
					return this.waitFor({
						controlType: "sap.m.FlexBox",
						check: function (aFlexBox) {
							if (aFlexBox) {
								aFlexBox.forEach(function (oFlexBox) {
									if (oFlexBox.getId().indexOf("template::CompactFilterContainer") != -1) {
										bIsCF = oFlexBox.getVisible();
									} else if (oFlexBox.getId().indexOf("template::VisualFilterContainer") != -1) {
										bIsVF = oFlexBox.getVisible();
									}
								});
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(bIsCF !== bIsVF, bIsVF ? "VF Visibility is true" : "VF Visibility is false");
						},
						errorMessage: "VF and CF are Visible"
					});
				},
				iShouldSeeTheAdaptFiltersInGoButtonmode: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						success: function (btns) {
							var bAsserit = false;
							for (var i = 0; i < btns.length; i++) {
								var filterText = btns[i].getText();
								if (filterText.indexOf("Adapt Filters") != -1) {
									if (btns[i - 1].getText() === "Go") {
										bAsserit = true;
									} else if (btns[i - 2].getId().indexOf("-internalBtn") != -1) {
										bAsserit = true;
									}
								}
							}
							Opa5.assert.ok(bAsserit, "Adapt Filters present");
						},
						errorMessage: "Adapt Filters are not present"
					});
				},
				iShouldSeeTheAdaptFiltersInLivemode: function () { //Need to be removed
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aToolbars) {
							var actionButtons = aToolbars[1].getContent();
							for (var i = 0; i < actionButtons.length; i++) {
								if (actionButtons[i].sId.indexOf("VisualFilterDialogButton") !== -1) {
									if (actionButtons[i].getText().indexOf("Adapt Filters") !== -1) {
										if (actionButtons[i + 1].getId().indexOf("template::Share-internalBtn") != -1) {
											bSuccess = true;
										}
									}
								}
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "Adapt Filters present");
						},
						errorMessage: "Adapt Filters are not present"
					});
				},
				iShouldSeeTheAdaptFiltersVisibilityInLivemode: function () {
					var bSuccess = true;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aToolbars) {
							var actionButtons = aToolbars[0].getContent();
							for (var i = 0; i < actionButtons.length; i++) {
								if (actionButtons[i].sId.indexOf("VisualFilterDialogButton") !== -1) {
									if (actionButtons[i].getText().indexOf("Adapt Filters") !== -1 &&
										actionButtons[i].getVisible() === true) {
										bSuccess = true;
									}
								}
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(bSuccess, "Adapt Filters are hidden");
						},
						errorMessage: "Adapt Filters are not hidden"
					});
				},

				// check if the Custom Toolbar in the Smart Table is rendered correctly without determining and global actions
				// Get all "sap.m.Button" and match the button's text against the manifest
				theCustomToolbarForTheSmartTableIsRenderedWithoutGlobalAndDetermining: function () {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						success: async function (aControl) {
							var iButtonIndex = 0;
							var oTableToolbar;

							for (var i in aControl) {
								if (aControl[i].getId().indexOf("TableToolbar") > 1) {
									oTableToolbar = aControl[i];
								}
							}

							var aButton = oTableToolbar.getContent().filter(function (oControl) {
								return oControl.isA("sap.m.Button");
							});
							// Wait until the manifest data is loaded
							await this.iWaitForPromise(OpaManifest.loadManifestData());

							var mProductBreakoutActions = OpaManifest.getManifestModel().getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage/sap.ui.generic.app/ZCOSTCENTERCOSTSQUERY0020/Actions/");
							var oi18nResourceBundle = OpaResourceBundle.demokit["sample.analytical.list.page.ext"].i18n;
							for (var sAction in mProductBreakoutActions) {
								if (!mProductBreakoutActions[sAction].determining && !mProductBreakoutActions[sAction].global && (!mProductBreakoutActions[sAction].filter || mProductBreakoutActions[sAction].filter === "table")) {
									Opa5.assert.equal(aButton[iButtonIndex].getText(), oi18nResourceBundle.getProperty(mProductBreakoutActions[sAction].id), "The " + oi18nResourceBundle.getProperty(mProductBreakoutActions[sAction].id) + " button is rendered correctly");
									if (aButton[iButtonIndex].getText() === "Requires Selection") {
										Opa5.assert.equal(aButton[iButtonIndex].getEnabled(), false, "Requires Selection is rendered in table correctly");
									}
									iButtonIndex++;
								}
							}
						},
						errorMessage: "The Smart Table Toolbar is not rendered correctly"
					});
				},
				// check if the dynamic header is rendered with global actions
				// Get all "sap.m.Button" and match the button's text against the manifest
				isTheDynamicHeaderRenderingGlobalActions: function () {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						success: async function (aControl) {
							//ok(true, "OPA needs to be fixed as it uses private APIs")
							Opa5.assert.ok(true, "The DynamicPage can fit contents");
							var iButtonIndex = 0;
							var titleBar = aControl[0].getTitle().getActions()
							var aButton = titleBar.filter(function (oControl) {
								return oControl.isA("sap.m.Button");;
							});
							// Wait until the manifest data is loaded
							await this.iWaitForPromise(OpaManifest.loadManifestData());

							var mProductBreakoutActions = OpaManifest.getManifestModel().getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage/sap.ui.generic.app/ZCOSTCENTERCOSTSQUERY0020/Actions/");
							var oi18nResourceBundle = OpaResourceBundle.demokit["sample.analytical.list.page.ext"].i18n;
							for (var sAction in mProductBreakoutActions) {
								if (mProductBreakoutActions[sAction].global) {
									Opa5.assert.equal(aButton[iButtonIndex].getText(), oi18nResourceBundle.getProperty(mProductBreakoutActions[sAction].id), "The " + oi18nResourceBundle.getProperty(mProductBreakoutActions[sAction].id) + " button is rendered correctly");
									iButtonIndex++;
								}
							}
						},
						errorMessage: "The Global Actions is not rendered correctly"
					});
				},
				iShouldSeeTheChartMinHeight: function () {
					var bHasStyleClass = false;
					return this.waitFor({
						controlType: "sap.m.VBox",
						check: function (aVBox) {
							aVBox.forEach(function (oVBox) {
								if (oVBox.hasStyleClass("sapSmartTemplatesAnalyticalListPageChartContainer")) {
									if (oVBox.$().css('min-height') == "160px") {
										bHasStyleClass = true;
									}
								}
							});
							return bHasStyleClass;
						},
						success: function () {
							Opa5.assert.ok(bHasStyleClass, "The Min Chart Height is set");
						},
						errorMessage: "The Min Chart Height is not set"
					});
				},
				isTheFooterBarHasDeterminingButtonsCorrectly: function () {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						matchers: [
							new PropertyStrictEquals({
								name: "showFooter",
								value: true
							})
						],
						success: async function (aControl) {
							var footerBar = aControl[0].getFooter().getContent();
							var aButton = footerBar.filter(function (oControl) {
								return oControl.isA("sap.m.Button");
							});
							var nManifestCount = 0,
								nUICount = 0;
							// Wait until the manifest data is loaded
							await this.iWaitForPromise(OpaManifest.loadManifestData());
							
							var mProductBreakoutActions = OpaManifest.getManifestModel().getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage/sap.ui.generic.app/ZCOSTCENTERCOSTSQUERY0020/Actions/");
							for (var sAction in mProductBreakoutActions) {
								if (mProductBreakoutActions[sAction].determining && !mProductBreakoutActions[sAction].global) {
									++nManifestCount;
									for (var i = 0; i < aButton.length; i++) {
										var sButtonId = aButton[i].getId().split("--")[1];
										if (sButtonId === mProductBreakoutActions[sAction].id && aButton[i].getVisible) {
											++nUICount;
											break;
										}
									}
								}
							}
							Opa5.assert.ok(nManifestCount === nUICount, nUICount + " determining button(s) are rendered correctly on the footer bar");
						},
						errorMessage: "Determining button(s) are not rendered correctly on the footer bar"
					});
				},
				iCheckForRequiresSelectionButtons: async function (oControl, oControlName, expectedResult) {
					Opa5.assert.ok(true, "The OverflowToolbar has its design set to 'Transparent'");
					var iButtonIndex = 0;
					var aButton;
					aButton = oControl[0].getContent().filter(function (oControl) {
						return oControl.isA("sap.m.Button");
					});

					// Wait until the manifest data is loaded
					await this.iWaitForPromise(OpaManifest.loadManifestData());

					var mProductBreakoutActions = OpaManifest.getManifestModel().getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage/sap.ui.generic.app/ZCOSTCENTERCOSTSQUERY0020/Actions/");
					
					for (var sAction in mProductBreakoutActions) {
						if (mProductBreakoutActions[sAction].requiresSelection && !mProductBreakoutActions[sAction].determining && !mProductBreakoutActions[sAction].global && (!mProductBreakoutActions[sAction].filter || mProductBreakoutActions[sAction].filter === oControlName)) {
							Opa5.assert.equal(aButton[iButtonIndex].getEnabled(), expectedResult, "Requires Selection is rendered in " + oControlName + " correctly");
						}
						iButtonIndex++;
					}
				},
				// check if the Custom Toolbar in the Smart Table is rendered correctly with RequireSelection disabled
				// Get all "sap.m.Button" and match the button's text against the manifest
				theCustomToolbarForTheSmartTableIsRenderedWithRequireSelectionCorrectly: function (expectedResult) {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						success: function (aControl) {
							var oTableToolbar;
							for (var i in aControl) {
								if (aControl[i].getId().indexOf("TableToolbar") > 1) {
									oTableToolbar = aControl[i];
								}
							}
							this.iCheckForRequiresSelectionButtons([oTableToolbar], "table", expectedResult);
						},
						errorMessage: "The Require Selection Smart Table Toolbar buttons are not rendered correctly"
					});
				},
				// check if the Custom Toolbar in the Smart Chart is rendered correctly with RequireSelection disabled
				// Get all "sap.m.Button" and match the button's text against the manifest
				theCustomToolbarForTheSmartChartIsRenderedWithRequireSelectionCorrectly: function (expectedResult) {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						matchers: [
							new PropertyStrictEquals({
								name: "design",
								value: "Transparent"
							})
						],
						success: function (oControl) {
							this.iCheckForRequiresSelectionButtons(oControl, "chart", expectedResult)
						},
						errorMessage: "The Require Selection in Smart Chart Toolbar buttons are not rendered correctly"
					});
				},
				iShouldSeeActionButtonsWithValidId: function () {
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aToolbars) {
							var actionButtons = aToolbars[0].getContent();
							for (var i = 0; i < actionButtons.length; i++) {
								if (actionButtons[i].sId) {
									bSuccess = true;
								}
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "Buttons have valid id");
						},
						errorMessage: "Buttons do not have a valid id"
					});
				},
				//when no target is available for navigation from kpi chart,
				//kpi card remains open on click of chart
				iCheckOpenKPICard: function () {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						timeout: 30,
						check: function (kpiCard) {
							if (kpiCard[0]) {
								var openCardType = kpiCard[0].getContent()[0].getViewName();
								if (openCardType.indexOf("KpiCardSizeM") !== -1) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "KPI card is still open as there is no target defined for navigation")
						},
						errorMessage: "Check navigation issue from KPI card"
					})
				},
				// Check for segmented button not present in table/chart toolbar
				isSegmentedButtonNotPresentInToolbar: function (oControlName) {
					var bSuccess = true;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						success: function (aControl) {
							var aButton = aControl.filter(function (oControl) {
								if (oControl.getId().indexOf("TableToolbar") !== -1 || oControl.getId().indexOf("ChartToolbar") !== -1) {
									oControl.getContent().forEach(function (content) {
										return content.isA("sap.m.SegmentedButton");
									});
								}
							});
							if (aButton.length > 0 && aButton[0].getId() !== "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::FilterSwitchButton") {
								bSuccess = false;
							}
							Opa5.assert.ok(bSuccess, "segmented button not present in" + oControlName + "toolbar with filterable KPI");
						}
					});
				},
				iCheckKpiTitleInCard: function (sTitle) {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						success: function (aPopovers) {
							var customData = aPopovers[0].getAggregation("_popup").getContent()[0].getCustomData();
							for (var i = 0; i < customData.length; i++) {
								if (customData[i].getKey() === "kpiTitle" && customData[i].getValue() === sTitle) {
									Opa5.assert.ok(true, "KPI title in card is correct");
								}
							}
						},
						errorMessage: "KPI title is not the same in the card"
					});
				},
				iCheckKpiIndicator: function (id, indicator) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						success: function (kpi) {
							if ((!kpi[id].getIndicator() && indicator === "Neutral") || kpi[id].getIndicator() === indicator) {
								Opa5.assert.ok(true, "criticality indicator is set correctly for kpi");
							} else {
								Opa5.assert.ok(false, "criticality indicator is set incorrectly for kpi");
							}
						},
						errorMessage: "KPI tag has wrong criticality indicator"
					});
				},
				iCheckKpiErrorType: function (id, errorType) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						success: function (kpi) {
							if (kpi[id].getErrorType() === errorType) {
								Opa5.assert.ok(true, "Error type correctly set");
							} else {
								Opa5.assert.ok(false, "Error type is not set correctly");
							}
						},
						errorMessage: "KPI tag has wrong error type"
					});
				},
				iCheckKPICurrencyUnit: function (id, currency) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						success: function (aKPIs) {
							var kpi = aKPIs[id];
							if (kpi.getUnit() === currency) {
								Opa5.assert.ok(true, "Unit of currency is correct");
							}
						},
						errorMessage: "Unit of currency of kpi is incorrect"
					});
				},
				iCheckKpiErrorText: function (kpiErrorText) {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						success: function (aPopovers) {
							kpiErrorText = oi18n.getText(kpiErrorText);
							if (aPopovers[0].getAggregation("_popup").getContent()[0].getText().indexOf(kpiErrorText) !== -1) {
								Opa5.assert.ok(true, "KPI error text is properly displayed");
							} else {
								Opa5.assert.ok(false, "KPI error text is Incorrect");
							}
						},
						errorMessage: "KPI title is not the same in the card"
					});
				},
				iCheckContentViewButtonsToolbar: function (sID) {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aOverflowToolbars) {
							for (var i in aOverflowToolbars) {
								if (aOverflowToolbars[i].getId().indexOf("template::" + sID)) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "ContentViewButtons overflow toolbar exists");
						},
						errorMessage: "ContentViewButtons Toolbar does not exist"
					});
				},
				iCheckCriticalityInKPICard: function (criticality) {
					return this.waitFor({
						controlType: "sap.m.HBox",
						searchOpenDialogs: true,
						success: function (aHBox) {
							for (var i in aHBox) {
								if (aHBox[i].getId().indexOf("kpiHBoxNumeric") !== -1) {
									var oValue = aHBox[i].getItems()[0];
									if (oValue.getValueColor() === criticality) {
										Opa5.assert.ok(true, "Card is in sync with tag");
									}
								}
							}
						},
						errorMessage: "Criticality is wrong"
					});
				},
				iCheckValueHelpDialogForTokens: function (aValues) {
					return this.waitFor({
						controlType: "sap.m.Token",
						searchOpenDialogs: true,
						check: function (aTokens) {
							var count = 0;
							for (var i in aValues) {
								for (var j in aTokens) {
									if (aTokens[j].getText() === aValues[i]) {
										count++;
										break;
									}
								}
							}
							if (count === aValues.length) {
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "exclude tokens are present");
						},
						errorMessage: "exclude tokens absent"
					});
				},
				iCheckChartDataLabelOnVizFrame: function () {
					var bVisible = false;
					return this.waitFor({
						controlType: "sap.viz.ui5.controls.VizFrame",
						searchOpenDialogs: true,
						check: function (aVizFrames) {
							var oVizFrame = aVizFrames[0],
							oVizProperties = oVizFrame.getVizProperties();
							bVisible = oVizProperties.plotArea.dataLabel.visible;
							return bVisible;
						},
						success: function () {
							Opa5.assert.ok(bVisible, "DataLabel visible=" + bVisible);
						},
						errorMessage: "DataLabel is not visible"
					});
				},
				iCheckChartDataLabelOnSmartChart: function () {
					var bVisible = false;
					return this.waitFor({
						controlType: "sap.ui.comp.smartchart.SmartChart",
						searchOpenDialogs: false,
						check: function (aSmartCharts) {
							var oSmartChart = aSmartCharts[0];
							return oSmartChart.getChartAsync().then(function (oChart) {
								var oVizProperties = oChart._getVizFrame().getVizProperties();
								bVisible = oVizProperties.plotArea.dataLabel.visible;
								return bVisible;
							});
						},
						success: function (bVisible) {
							Opa5.assert.ok(bVisible, "DataLabel visible=" + bVisible);
						},
						errorMessage: "DataLabel is not visible"
					});
				},
				/**
				* Checks if currently a segmented button with specific label is visible
				*
				* @param {String} sLabel The label of the button.
				* @throws {Error} Throws an error if the segmented button is not rendered
				* @return {*} success or failure
				* @public
				*/
				iShouldSeeTheSegmentedButtonWithLabel: function (sLabel) {
					return this.waitFor({
						controlType: "sap.m.SegmentedButton",
						matchers: [function (oCandidateButton) {
							var bFound = false;
							for (var i = 0; i < oCandidateButton.getItems().length; i++) {
								if (oCandidateButton.getItems()[i].getText() === sLabel) {
									bFound = true;
									break;
								}
							}
							return (bFound);
						}],
						success: function () {
							Opa5.assert.ok(true, "The Segmented Button with label '" + sLabel + "' is shown on  the Object Page");
						},
						errorMessage: "The Segmented Button with label '" + sLabel + "' couldn't be found on the List Report"
					});
				},
				theResultListFieldHasTheCorrectValue: function (oItem, sTabKey) {
					var oAppParams = ApplicationSettings.getAppParameters();
					return this.waitFor({
						//	check sTabKey in case of TableTabs
						id: sTabKey ? oAppParams.ALPPrefixID + "--template:::ALPTable:::SmartTable:::sQuickVariantKey::" + sTabKey : oAppParams.ALPPrefixID + "--table",
						success: function (oSmartTableObject) {
							if (oSmartTableObject) {
								var aTableItems;
								switch (oSmartTableObject.getTable().getMetadata().getElementName()) {
									case "sap.m.Table":
										aTableItems = oSmartTableObject.getTable().getItems();
										break;
									case "sap.ui.table.Table":
										aTableItems = oSmartTableObject.getTable().getRows();
										break;
									case "sap.ui.table.AnalyticalTable":
										aTableItems = oSmartTableObject.getTable().getRows();
										break;
									default:
										break;
								}
								var nValue = aTableItems[oItem.Line].getBindingContext().getProperty(oItem.Field);
								Opa5.assert.equal(nValue, oItem.Value, "Checking field " + oItem.Field + " with value " + oItem.Value);
							} else {
								Opa5.assert.ok(false, "Undefined object --AnalyticalListPage");
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				}
			}
		}
	});
});
