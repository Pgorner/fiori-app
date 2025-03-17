/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

 sap.ui.define([], function() {
	"use strict";
	return {
			context: "sap.card",
			properties: {
				title: {
					label: "Title",
					type: "string",
					path: "header/title",
					maxLength: 30
				},
				subTitle: {
					label: "Subtitle",
					type: "string",
					path: "header/subTitle"
				},
				icon: {
					label: "Icon src",
					type: "string",
					path: "header/icon/src"
				},
				status: {
					label: "Status",
					type: "string",
					path: "header/status/text"
				}
			},
			propertyEditors: {
				"enum" : "sap/ui/integration/designtime/baseEditor/propertyEditor/enumStringEditor/EnumStringEditor",
				"string" : "sap/ui/integration/designtime/baseEditor/propertyEditor/stringEditor/StringEditor"
			}
		};
	}
);
