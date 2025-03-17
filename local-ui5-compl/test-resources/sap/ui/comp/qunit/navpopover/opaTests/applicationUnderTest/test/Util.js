/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/comp/qunit/personalization/opaTests/Arrangement",
	"sap/ui/comp/qunit/personalization/opaTests/Action",
	"sap/ui/comp/qunit/personalization/opaTests/Assertion"
], function(
	Opa5,
	Arrangement,
	Action,
	Assertion
) {
	"use strict";

	return {
		getInitialState: function() {
			return {
				"Category Link2": {
					position: 0,
					selected: true,
					enabled: true
				},
				"Category Link3": {
					position: 1,
					selected: false,
					enabled: true
				},
				"Category Link4": {
					position: 2,
					selected: false,
					enabled: true
				},
				"Category Link5": {
					position: 3,
					selected: false,
					enabled: true
				},
				"Category Link6": {
					position: 4,
					selected: false,
					enabled: true
				},
				"Category Link7": {
					position: 5,
					selected: false,
					enabled: true
				},
				"Category Link8": {
					position: 6,
					selected: false,
					enabled: true
				},
				"Category Link9": {
					position: 7,
					selected: false,
					enabled: true
				},
				"Category Link10": {
					position: 8,
					selected: false,
					enabled: true
				},
				"Category Link11": {
					position: 9,
					selected: false,
					enabled: true
				},
				"Category Link12": {
					position: 10,
					selected: false,
					enabled: true
				}
			};
		},
		checkLinks: function(Then, mItems) {
			Object.entries(mItems).forEach(function(oEntry) {
				var sLinkText = oEntry[0];
				var oValue = oEntry[1];
				Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog(sLinkText, oValue.position, oValue.selected, oValue.enabled);
			});
		},
		extendConfig: function(mSettings) {
			const assertions = mSettings?.assertions ? Object.assign({}, mSettings.assertions, new Assertion()) : new Assertion();
			const actions = mSettings?.actions ? Object.assign({}, mSettings.actions, new Action()) : new Action();
			const arrangements = mSettings?.arrangements ? Object.assign({}, mSettings.arrangements, new Arrangement()) : new Arrangement();

			Opa5.extendConfig({
				...{
					asyncPolling: true,
					autoWait: true
				},
				actions,
				assertions,
				arrangements
			});
		},
		windowBlanket: function() {
			if (window.blanket) {
				//window.blanket.options("sap-ui-cover-only", "sap/ui/comp");
				window.blanket.options("sap-ui-cover-never", "sap/viz");
			}
		},
		startJourney: function(sJourney) {
			Opa5.extendConfig({
				autoWait: true,
				async: true,
				appParams: {
					"sap-ui-animation": false
				}
			});

			sap.ui.require([
				sJourney
			], function() {
				QUnit.start();
			});
		}
	};

});
