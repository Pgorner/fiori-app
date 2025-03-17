/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.BillboardHorizontalAlignment.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Billboard text horizontal alignment for {@link sap.ui.vk.threejs.Billboard}.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.BillboardHorizontalAlignment
	 * @private
	 */
	var BillboardHorizontalAlignment = {
		Left: "left",
		Center: "center",
		Right: "right"
	};

	DataType.registerEnum("sap.ui.vk.BillboardHorizontalAlignment", BillboardHorizontalAlignment);

	return BillboardHorizontalAlignment;

}, /* bExport= */ true);
