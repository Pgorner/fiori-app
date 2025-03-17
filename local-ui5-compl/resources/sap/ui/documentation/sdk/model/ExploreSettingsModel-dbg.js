/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/model/json/JSONModel"], function(JSONModel) {
	"use strict";

	return new JSONModel({
		autoRun: true,
		schemaValidation: false,
		splitViewVertically: false,
		editable: true,
		editorType: "text",
		internal: window._isinternal
	});
});
