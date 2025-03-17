/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.BillboardTextEncoding.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * Billboard text encoding for {@link sap.ui.vk.threejs.Billboard}.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.BillboardTextEncoding
	 * @private
	 */
	var BillboardTextEncoding = {
		PlainText: "PlainText",
		HtmlText: "HtmlText"
	};

	DataType.registerEnum("sap.ui.vk.BillboardTextEncoding", BillboardTextEncoding);

	return BillboardTextEncoding;

}, /* bExport= */ true);
