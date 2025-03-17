/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.BillboardStyle.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Billboard style for {@link sap.ui.vk.threejs.Billboard}.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.BillboardStyle
	 * @private
	 */
	var BillboardStyle = {
		RectangularShape: "RectangularShape",
		CircularShape: "CircularShape",
		None: "None",
		TextGlow: "TextGlow"
	};

	DataType.registerEnum("sap.ui.vk.BillboardStyle", BillboardStyle);

	return BillboardStyle;

}, /* bExport= */ true);
