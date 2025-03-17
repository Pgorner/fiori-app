/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.NodeContentType.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Node content type for {@link sap.ui.vk.NodeHierarchy.createNode}.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.NodeContentType
	 * @public
	 */
	var NodeContentType = {
		/**
		 * Regular node
		 * @public
		 */
		Regular: "Regular",
		/**
		 * Reference node
		 * @public
		 */
		Reference: "Reference",
		/**
		 * Annotation node
		 * @public
		 */
		Annotation: "Annotation",
		/**
		 * Background node
		 * @public
		 */
		Background: "Background",
		/**
		 * Symbol node
		 * @public
		 */
		Symbol: "Symbol",
		/**
		 * Hotspot node
		 * @public
		 */
		Hotspot: "Hotspot",
		/**
		 * PMI node
		 * @public
		 */
		PMI: "PMI",
		/**
		 * Point cloud group node
		 * @public
		 */
		PointCloudGroup: "PointCloudGroup",
		/**
		 * Svg image node
		 * @public
		 */
		SvgImage: "SvgImage"
	};

	DataType.registerEnum("sap.ui.vk.NodeContentType", NodeContentType);

	return NodeContentType;

}, /* bExport= */ true);
