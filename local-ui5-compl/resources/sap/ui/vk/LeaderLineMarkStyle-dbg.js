/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.LeaderLineMarkStyle.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Leader line mark style for {@link sap.ui.vk.threejs.Callout}.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.LeaderLineMarkStyle
	 * @private
	 */
	var LeaderLineMarkStyle = {
		None: "None",
		Point: "Point",
		Arrow: "Arrow"
	};

	DataType.registerEnum("sap.ui.vk.LeaderLineMarkStyle", LeaderLineMarkStyle);

	return LeaderLineMarkStyle;

}, /* bExport= */ true);
