/*!
 * SAP UI development toolkit for HTML5 (SAPUI5). (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */

/**
 * Initialization Code and shared classes of library sap.apf.
 */
sap.ui.define([
	"sap/ui/core/Lib",
	// library dependencies
	"sap/ui/core/library",
	"sap/suite/ui/commons/library",
	"sap/m/library",
	"sap/ui/layout/library",
	"sap/ushell/library",
	"sap/viz/library",
	"sap/ui/comp/library",
	"sap/ui/export/library",
	"sap/ui/table/library"
], function(Library) {

	/**
	 * Analysis Path Framework
	 *
	 * @namespace
	 * @name sap.apf
	 * @public
	 */

	return Library.init({
		name : "sap.apf",
		apiVersion: 2,
		dependencies : [
			"sap.ui.core",
			"sap.suite.ui.commons",
			"sap.m",
			"sap.ui.layout",
			"sap.ushell",
			"sap.viz",
			"sap.ui.comp",
			"sap.ui.export",
			"sap.ui.table"
		],
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		noLibraryCSS: true,
		version: "1.132.0"
	});


});
