/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FEBuilder", "sap/ui/test/OpaBuilder", "sap/fe/test/Utils"], function (FEBuilder, OpaBuilder, Utils) {
	"use strict";

	var KPIBuilder = function () {
		return FEBuilder.apply(this, arguments);
	};

	KPIBuilder.create = function (oOpaInstance) {
		return new KPIBuilder(oOpaInstance);
	};

	KPIBuilder.prototype = Object.create(FEBuilder.prototype);
	KPIBuilder.prototype.constructor = KPIBuilder;

	/**
	 * Checks if a KPI tag exists with a given label and other optional properties.
	 * @param {string} sKPILabel The label of the KPI
	 * @param {object} oKPIProperties Additional optional properties on the KPI (status, number, or unit)
	 * @returns {sap.fe.test.builder.KPIBuilder} This instance
	 * @private
	 * @ui5-restricted
	 */
	KPIBuilder.prototype.checkKPITag = function (sKPILabel, oKPIProperties) {
		var oTagProperties = { text: sKPILabel };

		if (oKPIProperties && oKPIProperties.status) {
			oTagProperties.status = oKPIProperties.status;
		}

		var retValue = this.hasType("sap.m.GenericTag").hasProperties(oTagProperties);

		if (oKPIProperties && (oKPIProperties.number || oKPIProperties.unit)) {
			var oNumberProperties = {};
			if (oKPIProperties.number) {
				oNumberProperties.number = oKPIProperties.number;
			}
			if (oKPIProperties.unit) {
				oNumberProperties.unit = oKPIProperties.unit;
			}
			retValue = retValue.hasChildren(FEBuilder.create(this).hasType("sap.m.ObjectNumber").hasProperties(oNumberProperties));
		}
		return retValue;
	};

	/**
	 * Clicks on a KPI tag to open the card.
	 * @param {string} sKPILabel The label of the KPI
	 * @returns {sap.fe.test.builder.KPIBuilder} This instance
	 * @private
	 */
	KPIBuilder.prototype.clickKPITag = function (sKPILabel) {
		var oTagProperties = { text: sKPILabel };

		return this.hasType("sap.m.GenericTag").hasProperties(oTagProperties).doPress();
	};

	/**
	 * Closes the popover containing the KPI card.
	 * @returns {sap.fe.test.builder.KPIBuilder} This instance
	 * @private
	 */
	KPIBuilder.prototype.closeKPICard = function () {
		return this.hasType("sap.m.Popover")
			.hasChildren(FEBuilder.create(this).hasType("sap.ui.integration.widgets.Card"))
			.do(function (popover) {
				popover.close();
			});
	};

	/**
	 * Checks if a KPI Card is displayed.
	 * @returns {sap.fe.test.builder.KPIBuilder} This instance
	 * @private
	 */
	KPIBuilder.prototype.checkKPICard = function () {
		return this.hasType("sap.m.Popover").hasChildren(FEBuilder.create(this).hasType("sap.ui.integration.widgets.Card"));
	};

	/**
	 * Clicks on the KPI card header.
	 * @returns {sap.fe.test.builder.KPIBuilder} This instance
	 */
	KPIBuilder.prototype.doClickKPICardHeader = function () {
		return this.hasType("sap.ui.integration.cards.NumericHeader").doPress();
	};

	/**
	 * Applies a matcher to the content of the card header.
	 * @param {sap.ui.test.matchers.Matcher} vMatcher The matcher to filter child items
	 * @param {boolean} bDirectChild Specifies if the matcher should be applied only to direct children or all descendants
	 * @returns {sap.fe.test.builder.KPIBuilder} This instance
	 */
	KPIBuilder.prototype.doOnKPICardHeader = function (vMatcher, bDirectChild) {
		return this.hasType("sap.ui.integration.widgets.Card").hasChildren(
			FEBuilder.create(this).hasType("sap.ui.integration.cards.NumericHeader").hasChildren(vMatcher, bDirectChild)
		);
	};

	/**
	 * Applies a matcher to the card chart.
	 * @param {sap.ui.test.matchers.Matcher} vMatcher The matcher to be applied to the chart
	 * @returns {sap.fe.test.builder.KPIBuilder} This instance
	 */
	KPIBuilder.prototype.doOnKPICardChart = function (vMatcher) {
		var analyticalContentMatcher = vMatcher
			? FEBuilder.create(this).hasType("sap.ui.integration.cards.AnalyticalContent").hasChildren(vMatcher)
			: FEBuilder.create(this).hasType("sap.ui.integration.cards.AnalyticalContent");

		return this.hasType("sap.ui.integration.widgets.Card").hasChildren(analyticalContentMatcher);
	};

	return KPIBuilder;
});
