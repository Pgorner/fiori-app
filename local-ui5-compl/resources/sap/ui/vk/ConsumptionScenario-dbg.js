/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Consumption scenario for metering.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.ConsumptionScenario
	 * @private
	 */
	var ConsumptionScenario = {
		EPD: "EPD",
		SAP: "SAP",
		Partner: "Partner"
	};

	DataType.registerEnum("sap.ui.vk.ConsumptionScenario", ConsumptionScenario);

	return ConsumptionScenario;
});
