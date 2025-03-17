/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/Designtime"], function (
	Designtime
) {
	"use strict";
	return function () {
		return new Designtime({
			"form": {
				"items": {
					"datetimeParameter": {
						"manifestpath": "/sap.card/configuration/parameters/datetimeParameter/value",
						"type": "datetime",
						"formatter": { style: 'long' }
					}
				}
			},
			"preview": {
				"modes": "LiveAbstract"
			}
		});
	};
});
