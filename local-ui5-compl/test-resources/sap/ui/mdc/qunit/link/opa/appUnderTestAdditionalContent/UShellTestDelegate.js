/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/mdc/ushell/LinkDelegate"
], function(LinkDelegate) {
	"use strict";

	const SampleLinkDelegate = Object.assign({}, LinkDelegate);

	SampleLinkDelegate.beforeNavigationCallback = function(oPayload, oEvent) {
		return new Promise(function(resolve) {
			setTimeout(function() {
				resolve(true);
			}, 3000);
		});
	};

	return SampleLinkDelegate;
});
