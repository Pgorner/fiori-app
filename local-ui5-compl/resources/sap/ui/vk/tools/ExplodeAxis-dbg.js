/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.tools.ExplodeAxis.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Defines the explode axis type.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.tools.ExplodeAxis
	 * @public
	 */
	var ExplodeAxis = {
		X: "X",
		Y: "Y",
		Z: "Z"
	};

	DataType.registerEnum("sap.ui.vk.tools.ExplodeAxis", ExplodeAxis);

	return ExplodeAxis;

}, /* bExport= */ true);
