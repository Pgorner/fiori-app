/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.tools.ToolNodeSet.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Selection display options.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.tools.ToolNodeSet
	 * @public
	 */
	var ToolNodeSet = {
		Highlight: "Highlight",
		Outline: "Outline"
	};

	DataType.registerEnum("sap.ui.vk.tools.ToolNodeSet", ToolNodeSet);

	return ToolNodeSet;

}, /* bExport= */ true);
