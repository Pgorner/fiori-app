/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/type/Date", // to have it loaded
	"sap/ui/model/type/DateTime", // to have it loaded
	"sap/ui/model/type/Time" // to have it loaded
], function (
	UIComponent,
	DateType,
	DateTimeType,
	TimeType
	) {
	"use strict";

	return UIComponent.extend("sap.ui.mdc.integration.field.dateContent.Component", {
		metadata : {
			manifest: "json"
		}
	});
});
