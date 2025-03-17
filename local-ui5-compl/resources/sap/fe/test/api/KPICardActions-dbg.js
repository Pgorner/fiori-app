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
	var KPICardActions = function (oBuilderInstance) {
		return KPICardAPI.call(this, oBuilderInstance);
	};
	KPICardActions.prototype = Object.create(KPICardAPI.prototype);
	KPICardActions.prototype.constructor = KPICardActions;
	KPICardActions.prototype.isAction = true;

	/**
	 * Clicks on the header of the KPI Card.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 */
	KPICardActions.prototype.iClickHeader = function () {
		var oKPIBuilder = this.getBuilder();

		return this.prepareResult(oKPIBuilder.doClickKPICardHeader().description("Clicking KPI card header").execute());
	};

	return KPICardActions;
});
