/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
	"use strict";

	new ComponentContainer({
		name: "sap.ui.mdc.ActionToolbarTesting",
		manifest: true,
		height: "100%",
		settings : {
			id : "ActionToolbarTesting"
		},
		async: true
	}).placeAt("content");
});
