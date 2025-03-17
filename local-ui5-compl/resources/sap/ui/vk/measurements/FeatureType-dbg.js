/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.measurements.FeatureType.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Feature type.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.measurements.FeatureType
	 * @private
	 */
	var FeatureType = {
		/**
		 * Vertex feature
		 * @public
		 */
		Vertex: "Vertex",
		/**
		 * Edge feature
		 * @public
		 */
		Edge: "Edge",
		/**
		* Face feature
		* @public
		*/
		Face: "Face"
	};

	DataType.registerEnum("sap.ui.vk.measurements.FeatureType", FeatureType);

	return FeatureType;
});
