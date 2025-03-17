/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.RotationType.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Rotation type for specifying node's transformation matrix rotation component.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.RotationType
	 * @private
	 */
	var RotationType = {
		/**
		 * Quaternion
		 * @public
		 */
		Quaternion: "Quaternion",
		/**
		 * Axis-Angle
		 * @public
		 */
		AngleAxis: "AngleAxis",
		/**
		 * Euler angles
		 * @public
		 */
		Euler: "Euler"
	};

	DataType.registerEnum("sap.ui.vk.RotationType", RotationType);

	return RotationType;

}, /* bExport= */ true);
