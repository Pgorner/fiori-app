/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.tools.ExplodeType.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Defines the explode type.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.tools.ExplodeType
	 * @public
	 */
	var ExplodeType = {
		Linear: "Linear",
		Radial: "Radial"
	};

	DataType.registerEnum("sap.ui.vk.tools.ExplodeType", ExplodeType);

	return ExplodeType;

}, /* bExport= */ true);
