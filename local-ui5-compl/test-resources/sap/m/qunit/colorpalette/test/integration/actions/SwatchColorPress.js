/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/thirdparty/jquery", "sap/ui/test/actions/Press"], function ($, Press) {
	"use strict";

	return Press.extend("cp.opa.test.app.actions.SwatchColorPress", {
		/**
		 * Sets focus on given control and triggers a 'tap' event on it (which is internally translated into a 'press' event).
		 * Logs an error if control is not visible (i.e. has no dom representation)
		 *
		 * @param {HTMLElement} oControl DOM node representing a single swatch color
		 * @public
		 */
		executeOn : function (oControl) {
			var $ActionDomRef = $(oControl);

			if ($ActionDomRef.length) {
				this.getUtils().triggerEvent("tap", oControl);
			}
		}
	});
});