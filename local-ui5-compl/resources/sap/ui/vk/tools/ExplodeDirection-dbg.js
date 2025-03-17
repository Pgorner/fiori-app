/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.tools.ExplodeDirection.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Defines the explode direction type.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.tools.ExplodeDirection
	 * @public
	 */
	var ExplodeDirection = {
		Positive: "Positive",
		Negative: "Negative"
	};

	DataType.registerEnum("sap.ui.vk.tools.ExplodeDirection", ExplodeDirection);

	return ExplodeDirection;

}, /* bExport= */ true);
