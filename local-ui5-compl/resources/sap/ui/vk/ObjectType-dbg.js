/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.ObjectType.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Object type
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.ObjectType
	 * @public
	 */
	var ObjectType = {
		PMI: 0,
		Hotspot: 1
	};

	DataType.registerEnum("sap.ui.vk.ObjectType", ObjectType);

	return ObjectType;

}, /* bExport= */ true);
