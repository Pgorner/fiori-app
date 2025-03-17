/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.MapContainerButtonType.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Types of custom buttons supported on the MapContainer toolbar
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.MapContainerButtonType
	 * @public
	 * @deprecated As of version 1.120.2. This object is moved to sap.ui.vbm namespace, see {@link sap.ui.vbm.MapContainerButtonType}
	 */
	var MapContainerButtonType = {
		Click: "Click",
		Toggle: "Toggle"
	};

	DataType.registerEnum("sap.ui.vk.MapContainerButtonType", MapContainerButtonType);

	return MapContainerButtonType;

}, /* bExport= */ true);
