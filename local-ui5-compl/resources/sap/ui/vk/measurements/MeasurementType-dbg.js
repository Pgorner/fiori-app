/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.measurements.MeasurementType.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Measurement type.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.measurements.MeasurementType
	 * @private
	 */
	var MeasurementType = {
		/**
		 * Angle measurement
		 * @public
		 */
		Angle: "Angle",
		/**
		 * Distance measurement
		 * @public
		 */
		Distance: "Distance",
		/**
		 * Area measurement
		 * @public
		 */
		Area: "Area"
	};

	DataType.registerEnum("sap.ui.vk.measurements.MeasurementType", MeasurementType);

	return MeasurementType;
});
