/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/ui/Device",
	"sap/ui/test/Opa5",
	"./waitForP13nDialog"
], function(
	Device,
	Opa5,
	waitForP13nDialog
) {
	"use strict";

	/**
	 * Retrieves the navigation control in a <code>P13nDialog</code>
	 *
	 * @param {Object} oSettings Config object to retrieve a navigation control in a <code>P13nDialog</code>
	 * @param {Function} oSettings.success Success callback triggered in case a navigation control has been found
	 */
	return function waitForNavigationcontrol(oSettings) {
		oSettings = oSettings || {};

		//Mobile
		if (Device.system.phone) {
			return this.waitFor({
				controlType: "sap.m.List",
				success: function(aLists) {
					Opa5.assert.equal(aLists.length, 1 , "One list found");
					if (oSettings.success) {
						oSettings.succes.call(this, aLists[0]);
					}
				}
			});
		}

		return waitForP13nDialog.call(this, {
			success: function(oP13nDialog) {
				return this.waitFor({
					controlType: "sap.m.IconTabBar",
					matchers: {
						ancestor: oP13nDialog
					},
					success: function(aTabBar) {
						Opa5.assert.ok(aTabBar.length === 1, "IconTabBar found");
						if (oSettings.success) {
							oSettings.success.call(this, aTabBar[0]);
						}
					},
					errorMessage: "sap.m.IconTabBar not found"
				});
			}
		});
	};
});
