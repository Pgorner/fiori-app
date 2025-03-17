/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/documentation/sdk/model/formatter"], function (Controller, formatter) {
	"use strict";

	return Controller.extend("sap.ui.documentation.sdk.blocks.IndexEntry", {
		formatText: function() {
			return formatter.formatIndexByVersionEntry.apply(formatter, arguments);
		}
	});
});