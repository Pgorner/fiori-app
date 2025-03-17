/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/mdc/ushell/LinkDelegate",
	"sap/ui/mdc/link/LinkItem",
	"sap/ui/mdc/link/Log"
], function(UShellLinkDelegate, LinkItem, Log) {
	"use strict";

	const SampleLinkDelegate = Object.assign({}, UShellLinkDelegate);

	SampleLinkDelegate.fetchLinkItems = function(oLink, oBindingContext, oInfoLog) {
		const oPayload = oLink.getPayload();
		let aItemsToReturn = [
			new LinkItem({
				key: "item00",
				href: "#Action00",
				text: "item 00"
			})
		];
		const oContextObject = oBindingContext ? oBindingContext.getObject(oBindingContext.getPath()) : undefined;
		if (oInfoLog) {
			oInfoLog.initialize(UShellLinkDelegate._getSemanticObjects(oPayload));
			aItemsToReturn.forEach(function(oItem) {
				oInfoLog.addIntent(Log.IntentType.API, {
					text: oItem.getText(),
					intent: oItem.getHref()
				});
			});
		}
		const oSemanticAttributes = UShellLinkDelegate._calculateSemanticAttributes(oContextObject, oPayload, oInfoLog);
		return UShellLinkDelegate._retrieveNavigationTargets("", oSemanticAttributes, oPayload, oInfoLog).then(function(aLinks, oOwnNavigationLink) {
			aItemsToReturn = aItemsToReturn.concat(aLinks);
			return Promise.resolve(aItemsToReturn);
		});
	};

	return SampleLinkDelegate;
});
