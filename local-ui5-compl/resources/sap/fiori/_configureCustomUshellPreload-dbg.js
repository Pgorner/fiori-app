/*!
 * SAPUI5
 *
 * (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
(function(window){
	"use strict";

	var cfg = window['sap-ushell-config'] = window['sap-ushell-config'] || {};
	cfg.ushell = cfg.ushell || {};
	cfg.ushell.customPreload = {
		enabled: true,
		coreResourcesComplement: [
			"sap/fiori/core-ext-light-0.js",
			"sap/fiori/core-ext-light-1.js",
			"sap/fiori/core-ext-light-2.js",
			"sap/fiori/core-ext-light-3.js"
		]
	};
}(window));
