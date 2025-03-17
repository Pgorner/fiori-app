/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Initialization Code and shared classes of test library sap.ui.testLibrary.
 */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/core/library"
], function(Lib) {
	"use strict";

	/**
	 * DesignTime library.
	 *
	 * @namespace
	 * @name sap.ui.testLibrary
	 * @author SAP SE
	 * @version 1.132.1
	 * @private
	 */

	// delegate further initialization of this library to the Core
	const testLib = Lib.init({
		apiVersion: 2,
		name: "sap.ui.testLibrary",
		version: "1.132.1",
		dependencies: ["sap.ui.core", "sap.ui.dt"],
		types: [],
		interfaces: [],
		controls: [
			"dt.control.SimpleScrollControl"
		],
		elements: [],
		extensions: {
			flChangeHandlers: {
				"dt.control.SimpleScrollControl": {
					moveControls: "default"
				}
			}
		}
	});

	return testLib;
}, /* bExport= */ true);