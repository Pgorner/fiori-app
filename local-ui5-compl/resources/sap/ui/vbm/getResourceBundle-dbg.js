/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

// Provides function sap.ui.vbm.getResourceBundle.
sap.ui.define([
	"sap/base/i18n/ResourceBundle"
], function( ResourceBundle ) {
	"use strict";
	// Retrieve ResourceBundle for a name that is not a library
		return ResourceBundle.create.bind(ResourceBundle, { bundleName: "sap.ui.vbm.i18n.messagebundle"});
}, /* bExport= */ true);
