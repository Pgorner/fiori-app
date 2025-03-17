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
					"integerParameter": {
						"manifestpath": "/sap.card/configuration/parameters/integerParameter/value",
						"type": "integer",
						"formatter": { minIntegerDigits: 3 }
					}
				}
			},
			"preview": {
				"modes": "LiveAbstract"
			}
		});
	};
});
