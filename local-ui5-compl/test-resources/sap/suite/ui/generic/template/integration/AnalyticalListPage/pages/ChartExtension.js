/*global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/Common/Common"
], function (Opa5, Common) {

	"use strict";

	Opa5.createPageObjects({
		onTheChart: {
			baseClass: Common,
			actions: {
				iAddDimensionFromP13nDialog: function (sText) {
					var oSelect = null;
					return this.waitFor({
						controlType: "sap.m.ComboBox",
						success: function (aSelect) {
							for (var i = 0; i < aSelect.length; i++) {
								if (!aSelect[i].getSelectedItem()) {
									oSelect = aSelect[i];
									break;
								}
							}
							var aItems = oSelect.getAggregation("items");
							var oItem = aItems.find(function (aItem) {
								return aItem.getText() === sText
							});
							oSelect.setSelectedItem(oItem);
							oSelect.fireChange({ selectedItem: oSelect.getSelectedItem() });
							Opa5.assert.ok(true, "Selected " + sText + " in Chart p13n dialog");
						},
						errorMessage: "Failed to select chart in p13n dialog"
					});
				},
				iDrillDownChart: function (sDrillDownBy) {
					var oItem, bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						check: function (aResponsivePopover) {
							var items = aResponsivePopover[0].getContent()[1].getItems();
							for (var i = 0; i < items.length; i++) {
								if (items[i].getTitle() === sDrillDownBy) {
									oItem = items[i];
									bSuccess = true;
									break;
								}
							}
							return bSuccess;
						},
						success: function () {
							var oList = oItem.getParent();
							oList.fireSelectionChange({
								listItem: oItem
							});
							Opa5.assert.ok(true, "Drilldown by " + sDrillDownBy + " performed");
						},
						errorMessage: "Drilldown by " + sDrillDownBy + " could not be performed"
					});
				},
				iSelectChart: function (fieldName, value) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartchart.SmartChart",
						check: function (aSmartCharts) {
							var aChartPromises = aSmartCharts.map(function (oSmartChart) {
								return oSmartChart.getChartAsync();
							});
							return Promise.all(aChartPromises).then(function (aCharts) {
								for (var i = 0; i < aCharts.length; i++) {
									var oVizFrame = aCharts[0]._getVizFrame(), oInnerData = {};
									if (oVizFrame) {
										oInnerData[fieldName] = value;
										var data = { data: oInnerData }
										var result = oVizFrame.vizSelection([data], { clearSelection: true });
										if (result) {
											return true;
										}
									}
								}
								return false;
							});
						},
						success: function () {
							Opa5.assert.ok(true, "chart selection has been done");
						},
						errorMessage: "The chart selection cannot be applied"
					});
				}
			},

			assertions: {
				/**
				* This function checks for visible dimension in smartchart
				* @param {string} sDrillDownBy This is the name of the dimension, e.g. "CostCenter"
				* @param {boolean} bVisible When true, looks for the presence of the dimension and when false looks for its absence
				*/
				iShouldSeeChartDrilledDown: function (sDrillDownBy, bVisible) {
					return this.waitFor({
						id: "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--chart",
						success: function (oSmartChart) {
							return oSmartChart.getChartAsync().then(function(oChart) {
								var bSuccess;
								var aVisibleDimensions = oChart.getVisibleDimensions();
								for (var i = 0; i < aVisibleDimensions.length; i++) {
									if (aVisibleDimensions[i] === sDrillDownBy) {
										bSuccess = bVisible ? true : false;
										return;
									}
								}
								bSuccess = bSuccess === undefined ? bVisible ? false : true : bSuccess;
							
								if (bSuccess) {
									Opa5.assert.ok(true, "Dimension has drilled down by " + sDrillDownBy);
								}
								else {
									Opa5.assert.ok(true, "Dimension has not drilled down by " + sDrillDownBy);
								}
							})
						},
						errorMessage: "Chart has failed to drill down by " + sDrillDownBy
					});
				},
				iCheckChartBreadCrumbs: function (nDrillDownCount) {
					return this.waitFor({
						id: "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--chart--breadcrumbs",
						check: function (oBreadCrumb) {
							var bSuccess = false;
							if (oBreadCrumb) {
								var links = oBreadCrumb.getLinks();
								for (var i = 0; i < links.length; i++) {
									Opa5.assert.ok(true, "Found the link " + links[i].getText());
								}
								Opa5.assert.ok(true, "Currently on " + oBreadCrumb.getCurrentLocationText());
								if (links.length === nDrillDownCount) {
									bSuccess = true;
								}
							}
							return bSuccess;
						},
						success: function () {
							Opa5.assert.ok(true, "Chart has drilled down with breadcrumbs");
						},
						errorMessage: "Chart has not drilled down with breadcrumbs"
					});
				}
			}
		}
	});
});
