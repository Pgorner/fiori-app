/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.SelectionDisplayMode.
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
	 * @alias sap.ui.vk.SelectionDisplayMode
	 * @public
	 */
	var SelectionDisplayMode = {
		Highlight: "Highlight",
		Outline: "Outline"
	};

	DataType.registerEnum("sap.ui.vk.SelectionDisplayMode", SelectionDisplayMode);

	return SelectionDisplayMode;

}, /* bExport= */ true);
