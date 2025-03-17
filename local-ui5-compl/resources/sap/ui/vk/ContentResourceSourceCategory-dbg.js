/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.ContentResourceSourceCategory.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * The categories of content resources.
	 * @enum {string}
	 * @readonly
	 * @public
	 * @alias sap.ui.vk.ContentResourceSourceCategory
	 * @deprecated Since version 1.50.0. Content resource categories shall not be used anymore. See {@link sap.ui.vk.ContentResource#sourceType} property for selection of content type.
	 */
	var ContentResourceSourceCategory = {
		/**
		 * The 3D content resource.
		 * @public
		 */
		"3D": "3D",
		/**
		 * The 2D content resource.
		 * @public
		 */
		"2D": "2D"
	};

	DataType.registerEnum("sap.ui.vk.ContentResourceSourceCategory", ContentResourceSourceCategory);

	return ContentResourceSourceCategory;

}, /* bExport= */ true);
