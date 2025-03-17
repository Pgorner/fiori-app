/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./KPICardAPI", "sap/fe/test/Utils", "sap/fe/test/builder/FEBuilder"], function (KPICardAPI, Utils, FEBuilder) {
	"use strict";

	/**
	 * Constructs a new TableAssertions instance.
	 * @param {sap.fe.test.builder.KPIBuilder} oBuilderInstance The builder instance used to interact with the UI
	 * @returns {sap.fe.test.api.KPICardAssertions} The new instance
	 * @class
	 * @extends sap.fe.test.api.KPICardAPI
	 * @hideconstructor
	 * @public
	 */
	var KPICardAssertions = function (oBuilderInstance) {
		return KPICardAPI.call(this, oBuilderInstance);
	};
	KPICardAssertions.prototype = Object.create(KPICardAPI.prototype);
	KPICardAssertions.prototype.constructor = KPICardAssertions;
	KPICardAssertions.prototype.isAction = false;

	/**
	 * Checks the title of the KPI Card.
	 * @param {string} sTitle The expected title
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 */
	KPICardAssertions.prototype.iSeeHeaderTitle = function (sTitle) {
		var oKPIBuilder = this.getBuilder();
		var vTitleMatcher = FEBuilder.create(this)
			.hasType("sap.m.Text")
			.has(function (oControl) {
				return oControl.getId().endsWith("-title");
			})
			.hasProperties({ text: sTitle });

		return this.prepareResult(
			oKPIBuilder
				.doOnKPICardHeader(vTitleMatcher, true)
				.description("Checking card title: " + sTitle)
				.execute()
		);
	};

	/**
	 * Checks the subtitle of the KPI Card.
	 * @param {string} sSubtitle The expected title
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 */
	KPICardAssertions.prototype.iSeeHeaderSubtitle = function (sSubtitle) {
		var oKPIBuilder = this.getBuilder();
		var vTitleMatcher = FEBuilder.create(this)
			.hasType("sap.m.Text")
			.has(function (oControl) {
				return oControl.getId().endsWith("-subtitle");
			})
			.hasProperties({ text: sSubtitle });

		return this.prepareResult(
			oKPIBuilder
				.doOnKPICardHeader(vTitleMatcher, true)
				.description("Checking card sub-title: " + sSubtitle)
				.execute()
		);
	};

	/**
	 * Checks the unit of the KPI Card.
	 * @param {string} sText The expected unit
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 */
	KPICardAssertions.prototype.iSeeHeaderUnit = function (sText) {
		var oKPIBuilder = this.getBuilder();
		var vTitleMatcher = FEBuilder.create(this)
			.hasType("sap.m.Text")
			.has(function (oControl) {
				return oControl.getId().endsWith("-unitOfMeasurement");
			})
			.hasProperties({ text: sText });

		return this.prepareResult(
			oKPIBuilder
				.doOnKPICardHeader(vTitleMatcher, true)
				.description("Checking card unit: " + sText)
				.execute()
		);
	};

	/**
	 * Checks the details of the KPI Card.
	 * @param {string} sText The expected detail value
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 */
	KPICardAssertions.prototype.iSeeHeaderDetails = function (sText) {
		var oKPIBuilder = this.getBuilder();
		var vTitleMatcher = FEBuilder.create(this)
			.hasType("sap.m.Text")
			.has(function (oControl) {
				return oControl.getId().endsWith("-details");
			})
			.hasProperties({ text: sText });

		return this.prepareResult(
			oKPIBuilder
				.doOnKPICardHeader(vTitleMatcher, true)
				.description("Checking card details: " + sText)
				.execute()
		);
	};

	/**
	 * Checks the main indicator of the KPI Card.
	 * @param {string} sValue The expected value of the indicator
	 * @param {object} mStates Additionnal properties to check (indicator, valueColor, scale)
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 */
	KPICardAssertions.prototype.iSeeHeaderValue = function (sValue, mStates) {
		var oKPIBuilder = this.getBuilder();
		var oProperties = mStates || {};
		oProperties.number = sValue;

		var vTitleMatcher = FEBuilder.create(this).hasType("sap.f.cards.NumericIndicators").hasProperties(oProperties);

		var sDescription = mStates
			? Utils.formatMessage("Checking card header value '{0}' in state '{1}'", sValue, mStates)
			: Utils.formatMessage("Checking card header value '{0}'", sValue);
		return this.prepareResult(
			oKPIBuilder
				.doOnKPICardHeader(vTitleMatcher, true)
				.description("Checking card header: " + sDescription)
				.execute()
		);
	};

	/**
	 * Checks a side indicator of the KPI Card.
	 * @param {string} sTitle The expected title of the side indicator
	 * @param {string} sValue The expected value of the side indicator
	 * @param {string} sUnit The expected unit of the side indicator
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 */
	KPICardAssertions.prototype.iSeeSideIndicator = function (sTitle, sValue, sUnit) {
		var oKPIBuilder = this.getBuilder();

		var vIndicatorMatcher = FEBuilder.create(this)
			.hasType("sap.f.cards.NumericIndicators")
			.hasChildren(
				FEBuilder.create(this)
					.hasType("sap.f.cards.NumericSideIndicator")
					.hasChildren(FEBuilder.create(this).hasType("sap.m.Text").hasProperties({ text: sTitle }))
					.hasChildren(FEBuilder.create(this).hasType("sap.m.Text").hasProperties({ text: sTitle }))
					.hasChildren(FEBuilder.create(this).hasType("sap.m.Text").hasProperties({ text: sValue }))
			);

		return this.prepareResult(
			oKPIBuilder
				.doOnKPICardHeader(vIndicatorMatcher, true)
				.description("Checking card side indicator: " + sTitle + " - " + sValue + " - " + sUnit)
				.execute()
		);
	};

	/**
	 * Checks the chart of the KPI card.
	 * @param {object} mProperties The properties to be checked on the chart (vizType). If null or empty, we just check if the chart is visible.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 */
	KPICardAssertions.prototype.iSeeChart = function (mProperties) {
		var oKPIBuilder = this.getBuilder();

		var vChartMatcher = mProperties && Object.keys(mProperties).length ? FEBuilder.create(this).hasProperties(mProperties) : undefined;

		var sDescription = vChartMatcher
			? Utils.formatMessage("Checking card chart with properties '{0}'", mProperties)
			: Utils.formatMessage("Checking card chart");

		return this.prepareResult(oKPIBuilder.doOnKPICardChart(vChartMatcher).description(sDescription).execute());
	};
	return KPICardAssertions;
});
