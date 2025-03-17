/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.BillboardCoordinateSpace.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Billboard coordinate space for {@link sap.ui.vk.threejs.Billboard}.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.BillboardCoordinateSpace
	 * @private
	 */
	var BillboardCoordinateSpace = {
		Viewport: "Viewport", // billboard only
		Screen: "Screen",     // billboard only
		World: "World"        // callout only
	};

	DataType.registerEnum("sap.ui.vk.BillboardCoordinateSpace", BillboardCoordinateSpace);

	return BillboardCoordinateSpace;

}, /* bExport= */ true);
