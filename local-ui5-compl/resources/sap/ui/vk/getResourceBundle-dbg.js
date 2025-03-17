/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides function sap.ui.vk.getResourceBundle.
sap.ui.define([
	"sap/ui/core/Lib"
], function(
	Library
) {
	"use strict";

	return function() {
		return Library.getResourceBundleFor("sap.ui.vk.i18n");
	};
}, /* bExport= */ true);
