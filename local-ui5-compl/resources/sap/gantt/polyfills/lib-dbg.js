/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/library",
	"sap/gantt/polyfills/time"
], function (library, time) {
	"use strict";

	const polyfills = {
		time
	};

	// proxy object for sap.gantt
	Object.defineProperty(library, "polyfills", {
		value: polyfills,
		writable: false
	});

	return polyfills;
});
