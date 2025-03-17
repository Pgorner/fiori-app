/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

/**
 * Initialization Code and shared classes of library sap.ndc.
 */
sap.ui.define([
	'sap/m/library', // library dependency
	'sap/ui/core/Core',  // provides sap.ui.getCore()
	'sap/ui/core/library' // library dependency
], function() {
	"use strict";


	/**
	 * SAPUI5 library with controls with native device capabilities.
	 *
	 * @namespace
	 * @alias sap.ndc
	 * @public
	 */
	var thisLib = sap.ui.getCore().initLibrary({
		name : "sap.ndc",
		apiVersion: 2,
		dependencies : ["sap.ui.core","sap.m"],
		types: [],
		interfaces: [],
		controls: [
			"sap.ndc.BarcodeScannerButton",
			"sap.ndc.BarcodeScannerUIContainer" // private
		],
		elements: [],
		noLibraryCSS: true,
		version: "1.132.1"
	});

	return thisLib;

});