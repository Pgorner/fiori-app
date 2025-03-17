/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.tools.GizmoPlacementMode.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Sets the placement mode for move tool.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.tools.GizmoPlacementMode
	 * @public
	 */
	var GizmoPlacementMode = {
		/**
		 * Default PlacementMode
		 * @public
		 */
		Default: "Default",
		/**
		 * Object(s) center PlacementMode
		 * @public
		 */
		ObjectCenter: "ObjectCenter",
		/**
		 * Custom position PlacementMode
		 * @private
		 */
		Custom: "Custom"
	};

	DataType.registerEnum("sap.ui.vk.tools.GizmoPlacementMode", GizmoPlacementMode);

	return GizmoPlacementMode;

}, /* bExport= */ true);
