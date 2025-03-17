/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./BaseAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "sap/ui/core/library"],
	function (BaseAPI, Utils, OpaBuilder, FEBuilder, library) {
		"use strict";

		var SortOrder = library.SortOrder;
		/**
		 * Constructs a new ChartAssertions instance.
		 *
		 * TODO this API does not fit the criteria for public API and needs some rework. Not considered critical for apps though.
		 * @param {sap.fe.test.builder.FEBuilder} oBuilderInstance  The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vChartDescription] Description (optional) of the chart to be used for logging messages
		 * @returns {sap.fe.test.api.ChartAssertions} The new instance
		 * @class
		 * @private
		 */
		var ChartAssertions = function (oBuilderInstance, vChartDescription) {
			return BaseAPI.call(this, oBuilderInstance, vChartDescription);
		};
		ChartAssertions.prototype = Object.create(BaseAPI.prototype);
		ChartAssertions.prototype.constructor = ChartAssertions;
		ChartAssertions.prototype.isAction = false;

		ChartAssertions.prototype.iCheckItems = function (iNumberOfItems, sTab) {
			return OpaBuilder.create(this)
				.hasType("sap.ui.mdc.Chart")
				.check(function (aCharts) {
					var oChart;
					if (sTab && aCharts && aCharts.length > 1) {
						for (var i = 0; i < aCharts.length; i++) {
							if (aCharts[i].getId().indexOf("fe::Chart::" + sTab) > -1) {
								oChart = aCharts[i];
								break;
							}
						}
					} else {
						oChart = aCharts[0];
					}
					var aContexts = oChart.getControlDelegate()._getChart(oChart).getBinding("data").getContexts();
					return (
						(aContexts && (iNumberOfItems === undefined ? aContexts.length !== 0 : aContexts.length === iNumberOfItems)) ||
						(!aContexts && iNumberOfItems === 0)
					);
				}, true)
				.description("Seeing " + iNumberOfItems + "of items")
				.execute();
		};

		ChartAssertions.prototype.iSeeChartType = function (sChartType) {
			return OpaBuilder.create(this)
				.hasType("sap.ui.mdc.Chart")
				.check(function (oChart) {
					return sChartType === oChart[0].getChartType();
				}, true)
				.description("Chart type is " + sChartType)
				.execute();
		};

		ChartAssertions.prototype.iSeeChartVisible = function () {
			return OpaBuilder.create(this)
				.hasType("sap.ui.mdc.Chart")
				.check(function (oChart) {
					return oChart[0].getVisible() === true;
				}, true)
				.description("Chart is Visible")
				.execute();
		};

		ChartAssertions.prototype.iCheckBreadCrumb = function (sLink) {
			return OpaBuilder.create(this)
				.hasType("sap.m.Breadcrumbs")
				.hasProperties({ currentLocationText: sLink })
				.description("BreadCrumb is " + sLink)
				.execute();
		};

		ChartAssertions.prototype.iCheckVisibleDimensions = function (aDimensions) {
			return OpaBuilder.create(this)
				.hasType("sap.chart.Chart")
				.check(function (oChart) {
					return oChart[0].getVisibleDimensions().toString() === aDimensions.toString();
				})
				.description("Visible Dimensions are checked correctly")
				.execute();
		};
		ChartAssertions.prototype.iCheckVisibleMeasures = function (aMeasures) {
			return OpaBuilder.create(this)
				.hasType("sap.chart.Chart")
				.check(function (oChart) {
					return oChart[0].getVisibleMeasures().toString() === aMeasures.toString();
				})
				.description("Visible Measures are checked correctly")
				.execute();
		};

		ChartAssertions.prototype.iCheckChartNoDataText = function (sNoDataText) {
			return OpaBuilder.create(this)
				.hasType("sap.ui.mdc.Chart")
				.check(function (oChart) {
					return sNoDataText === oChart[0].getNoDataText();
				})
				.description("No Data text is " + sNoDataText)
				.execute();
		};

		ChartAssertions.prototype.iCheckButtonWithText = function (sText) {
			return OpaBuilder.create(this)
				.hasType("sap.m.Button")
				.hasProperties({ text: sText })
				.description("Seeing Button with text '" + sText + "'")
				.execute();
		};

		ChartAssertions.prototype.iCheckMessageToastWithText = function (sText) {
			return FEBuilder.createMessageToastBuilder(sText).execute(this);
		};

		return ChartAssertions;
	}
);
